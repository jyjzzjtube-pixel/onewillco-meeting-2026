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

  console.log('\n=== 전체 ' + pass + '/10 통과 ===');
  server.close(); process.exit(0);
})().catch(e => { console.error('✗ 실패:', e.message); process.exit(1); });
