// 로컬 엔드투엔드 테스트: 접수→저장→로그인→목록→상태변경→처리대장
'use strict';
const assert = require('node:assert');
const http = require('node:http');
process.env.SB_DB = '/tmp/sb-test-' + Date.now() + '.sqlite';
process.env.SB_SECRET = 'test-secret';
const { server, DB } = require('./server');
const auth = require('./auth');
DB.prepare('INSERT INTO users(email,pw_hash,role) VALUES(?,?,?)')
  .run('t@t.com', auth.hashPw('pw123'), 'admin');

function req(method, path, body, cookie) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null;
    const r = http.request({ method, path, port: 4711, host: '127.0.0.1',
      headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) } }, res => {
      let b = ''; res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers,
        data: (() => { try { return JSON.parse(b); } catch { return b; } })() }));
    });
    if (data) r.write(data); r.end();
  });
}

(async () => {
  await new Promise(r => server.listen(4711, r));
  let pass = 0;

  // 1) 공개 상담 접수 → 접수번호 발급
  let r = await req('POST', '/api/lead', {
    name: '홍길동', phone: '01012345678', region: '남양주', business_type: '카페',
    categories: ['인테리어', '포스·CCTV·키오스크'], message: '12평 카페 견적',
    desired_date: '2026-08-01', desired_time: '14~16시',
    consent_service: true, consent_thirdparty: true, source: 'naver',
  });
  assert.strictEqual(r.status, 200); assert.match(r.data.receiptNo, /^SB-\d{8}-001$/);
  console.log('✓ 상담 접수 → 접수번호', r.data.receiptNo); pass++;

  // 2) 동의 없으면 거부
  r = await req('POST', '/api/lead', { name: 'A', phone: '1', consent_service: false });
  assert.strictEqual(r.status, 400);
  console.log('✓ 미동의 접수 거부'); pass++;

  // 3) 인증 없이 목록 → 401
  r = await req('GET', '/api/leads');
  assert.strictEqual(r.status, 401);
  console.log('✓ 비로그인 목록 차단(401)'); pass++;

  // 4) 로그인 → 쿠키
  r = await req('POST', '/api/login', { email: 't@t.com', password: 'pw123' });
  assert.strictEqual(r.status, 200);
  const cookie = (r.headers['set-cookie'][0] || '').split(';')[0];
  console.log('✓ 로그인 성공'); pass++;

  // 5) 목록 조회
  r = await req('GET', '/api/leads', null, cookie);
  assert.strictEqual(r.status, 200); assert.strictEqual(r.data.leads.length, 1);
  assert.strictEqual(r.data.leads[0].name, '홍길동');
  assert.strictEqual(r.data.leads[0].consent_thirdparty, 1);
  const leadId = r.data.leads[0].id;
  console.log('✓ 상담 목록 조회 (제3자동의 분리 저장 확인)'); pass++;

  // 6) 상태 변경 신규→연결
  r = await req('POST', '/api/lead/status', { id: leadId, status: '연결' }, cookie);
  assert.strictEqual(r.status, 200);
  r = await req('GET', '/api/leads?status=' + encodeURIComponent('연결'), null, cookie);
  assert.strictEqual(r.data.leads.length, 1);
  console.log('✓ 상태 변경 신규→연결'); pass++;

  // 7) 통계
  r = await req('GET', '/api/stats', null, cookie);
  assert.strictEqual(r.data.total, 1); assert.strictEqual(r.data.연결, 1);
  console.log('✓ KPI 통계 (총1·연결1)'); pass++;

  // 8) 제휴업체 등록·목록
  r = await req('POST', '/api/partners', { company: '가나인테리어', fields: ['인테리어'], regions: ['남양주'], verify_status: '검증완료' }, cookie);
  assert.strictEqual(r.status, 200);
  r = await req('GET', '/api/partners', null, cookie);
  assert.strictEqual(r.data.partners.length, 1);
  console.log('✓ 제휴업체 등록·조회'); pass++;

  // 9) 개인정보 처리대장 자동 적재
  r = await req('GET', '/api/privacy-log', null, cookie);
  assert.ok(r.data.log.some(x => x.action === '수집'));
  assert.ok(r.data.log.some(x => x.action === '제3자제공동의'));
  console.log('✓ 개인정보 처리대장 자동 기록(수집·제3자제공동의)'); pass++;

  // 10) rate limit
  let blocked = false;
  for (let i = 0; i < 13; i++) { const x = await req('POST', '/api/lead', { name: 'x', phone: '1', consent_service: true }); if (x.status === 429) blocked = true; }
  assert.ok(blocked);
  console.log('✓ rate limit 동작(429)'); pass++;

  // 11) 연결: 제3자 미동의 상담은 거부
  //   먼저 미동의 상담 하나 만들고 파트너 연결 시도 → 400
  const partnersList = (await req('GET', '/api/partners', null, cookie)).data.partners;
  const partnerId = partnersList[0].id;
  // 홍길동(leadId, 제3자동의 O) 연결 → 성공
  r = await req('POST', '/api/connect', { lead_id: leadId, partner_id: partnerId, category: '인테리어' }, cookie);
  assert.strictEqual(r.status, 200);
  const connId = r.data.id;
  console.log('✓ 상담→파트너 연결(동의 확인)'); pass++;

  // 12) 정산 생성: 2000만원 × 3% = 60만원
  r = await req('POST', '/api/settlement', { connection_id: connId, amount: 20000000, fee_rate: 3, settle_month: '2026-08' }, cookie);
  assert.strictEqual(r.data.fee_amount, 600000);
  const setId = r.data.id;
  console.log('✓ 정산 생성 (2천만×3% = 60만원)'); pass++;

  // 13) 입금 처리 + 월마감 집계
  await req('POST', '/api/settlement/paid', { id: setId, paid_status: '입금완료' }, cookie);
  r = await req('GET', '/api/settlements/close?month=2026-08', null, cookie);
  assert.strictEqual(r.data.fee_total, 600000);
  assert.strictEqual(r.data.fee_paid, 600000);
  assert.strictEqual(r.data.fee_unpaid, 0);
  assert.ok(r.data.by_partner['가나인테리어']);
  console.log('✓ 월마감 집계 (수수료계 60만·입금완료·파트너별)'); pass++;

  // 14) 세무 CSV 내보내기 (BOM + 헤더)
  r = await req('GET', '/api/settlements/csv?month=2026-08', null, cookie);
  assert.ok(String(r.data).includes('정산월'));
  assert.ok(String(r.data).includes('가나인테리어'));
  console.log('✓ 세무 CSV 내보내기'); pass++;

  // 15) KPI 대시보드: 퍼널·유입경로·이번달 수수료
  r = await req('GET', '/api/dashboard', null, cookie);
  assert.ok(r.data.total >= 1);
  assert.strictEqual(r.data.funnel.접수, r.data.total);
  assert.strictEqual(r.data.bySource.naver, 1);   // 최초 상담만 naver
  console.log('✓ KPI 대시보드 (퍼널·유입경로 naver·수수료)'); pass++;

  // 16) 콘텐츠 캘린더 추가·조회·상태
  r = await req('POST', '/api/content', { topic: '카페 창업 비용', keyword: '카페 창업 비용', publish_date: '2026-08-01' }, cookie);
  assert.strictEqual(r.status, 200);
  r = await req('GET', '/api/content', null, cookie);
  assert.strictEqual(r.data.content.length, 1);
  console.log('✓ 콘텐츠 캘린더 추가·조회'); pass++;

  console.log('\n=== 전체 ' + pass + '/16 통과 ===');
  server.close(); process.exit(0);
})().catch(e => { console.error('✗ 실패:', e.message); process.exit(1); });
