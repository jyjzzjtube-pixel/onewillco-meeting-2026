// data/seed.json 스키마·규칙 검증 — 커밋 전에 반드시 실행: node tools/validate-seed.mjs
// 검사: 타입·필수값 + id 형식 + ts 밀리초 범위 + 사칭 금지 + 하위 id 중복 + 음수 금액
//       + 이상치(월수익>월매출 등) + main 대비 삭제·id 재사용 금지
import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'data', 'seed.json');

const errors = [];
const warns = [];
let seed;
try {
  seed = JSON.parse(readFileSync(path, 'utf-8'));
} catch (e) {
  console.error('❌ JSON 파싱 실패:', e.message);
  process.exit(1);
}

const isStr = v => typeof v === 'string';
const isNumOrNull = v => v == null || (typeof v === 'number' && !Number.isNaN(v));
const NOW = Date.now();
const TS_MIN = 1.5e12; // 2017년 이후 — 초 단위(10자리) 입력을 잡아냄
const BANNED_AUTHORS = ['관리자', '구름']; // 실제 사용자 계정명 사칭 금지

function checkId(id, kind, tag) {
  const re = new RegExp('^seed-' + kind + '-\\d{3,}$');
  if (!isStr(id) || !re.test(id)) errors.push(`${tag}: id는 'seed-${kind}-###' 형식이어야 함 (현재: ${id})`);
}
function checkTs(ts, tag, allowZero) {
  if (typeof ts !== 'number' || Number.isNaN(ts)) { errors.push(`${tag}: ts는 숫자(epoch 밀리초)`); return; }
  if (allowZero && ts === 0) return;
  if (ts < TS_MIN) errors.push(`${tag}: ts=${ts} — 밀리초가 아님 (초 단위로 입력한 듯. date +%s%3N 사용)`);
  if (ts > NOW + 86400e3) errors.push(`${tag}: ts가 미래 시각`);
}
function checkSub(list, kind, tag, subIds) {
  const prefix = kind === 'comments' ? 'c' : 'd';
  (list || []).forEach((c, i) => {
    const t = `${tag} ${kind}[${i}]`;
    checkId(c.id, prefix, t);
    if (subIds.has(c.id)) errors.push(`${t}: 하위 id 중복 (${c.id})`); else subIds.add(c.id);
    if (!isStr(c.author) || !c.author) errors.push(`${t}: author 필요`);
    else if (BANNED_AUTHORS.includes(c.author)) errors.push(`${t}: author '${c.author}'는 실제 사용자 계정명 — 'AI비서' 등을 사용`);
    if (kind === 'comments' && (!isStr(c.text) || !c.text)) errors.push(`${t}: text 필요`);
    if (kind === 'docs' && (!isStr(c.url) || !/^https?:\/\//.test(c.url))) errors.push(`${t}: url은 http(s) 링크`);
    checkTs(c.ts, t);
  });
}
function checkChecks(list, tag, subIds) {
  (list || []).forEach((c, i) => {
    const t = `${tag} checks[${i}]`;
    checkId(c.id, 'k', t);
    if (subIds.has(c.id)) errors.push(`${t}: 하위 id 중복 (${c.id})`); else subIds.add(c.id);
    if (!isStr(c.label) || !c.label) errors.push(`${t}: label 필요`);
    if (typeof c.done !== 'boolean') errors.push(`${t}: done은 true/false`);
    if (c.done) {
      if (!isStr(c.by) || !c.by) errors.push(`${t}: done인데 by(확인자) 비어있음`);
      checkTs(c.ts ?? 0, t);
      if ((c.ts ?? 0) === 0) errors.push(`${t}: done인데 ts=0`);
    }
  });
}
function checkMoney(o, fields, tag) {
  fields.forEach(k => {
    const v = o[k];
    if (!isNumOrNull(v)) { errors.push(`${tag}: ${k}는 숫자(만원)/null`); return; }
    if (v != null && v < 0 && k !== 'profit' && k !== 'mProfit') errors.push(`${tag}: ${k}가 음수`);
    if (v != null && v >= 1e7) warns.push(`${tag}: ${k}=${v} — 100억↑ 표기, 원 단위로 넣은 것 아닌지 확인 (만원 단위)`);
  });
}
function checkExtras(o, tag) {
  if (o.trust != null && !['주장', '자료확인', '실사검증'].includes(o.trust)) errors.push(`${tag}: trust는 주장|자료확인|실사검증`);
  if (o.nextAction != null && !isStr(o.nextAction)) errors.push(`${tag}: nextAction은 문자열`);
  if (o.nextDue != null && o.nextDue !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(o.nextDue)) errors.push(`${tag}: nextDue는 YYYY-MM-DD`);
}
function checkFilesMeta(list, tag) {
  if (list == null) return;
  if (!Array.isArray(list)) { errors.push(`${tag}: files는 배열`); return; }
  // files는 사용자가 화면에서 첨부하는 로컬 전용 필드 (실제 바이트는 브라우저에 저장). AI는 보통 docs 링크를 사용.
}
function checkSource(src, tag) {
  if (src == null) return;
  if (typeof src !== 'object') { errors.push(`${tag}: source는 {url, name, fetchedAt} 객체`); return; }
  if (src.url && !/^https?:\/\//.test(src.url)) errors.push(`${tag}: source.url은 http(s) 링크`);
  if (src.fetchedAt != null) checkTs(src.fetchedAt, tag + ' source');
}

if (!Array.isArray(seed.brands)) errors.push('brands는 배열이어야 함');
if (!Array.isArray(seed.listings)) errors.push('listings는 배열이어야 함');

const ids = new Set();
(seed.brands || []).forEach((b, i) => {
  const tag = `brands[${i}](${b.id || '?'})`;
  checkId(b.id, 'brand', tag);
  if (ids.has(b.id)) errors.push(`${tag}: id 중복`); else ids.add(b.id);
  if (!isStr(b.corpName) || !b.corpName) errors.push(`${tag}: corpName(법인명) 필요`);
  if (!isStr(b.tradeName) || !b.tradeName) errors.push(`${tag}: tradeName(상호명) 필요`);
  if (b.openDate && (!/^\d{4}-\d{2}-\d{2}$/.test(b.openDate) || new Date(b.openDate) > new Date())) errors.push(`${tag}: openDate는 과거의 YYYY-MM-DD`);
  checkMoney(b, ['branches', 'revenue', 'profit', 'askPrice'], tag);
  if (b.status && !['검토중', '협상중', '실사중', '인수완료', '보류'].includes(b.status)) errors.push(`${tag}: status 값 확인`);
  // 이상치
  if (b.profit != null && b.revenue != null && b.profit > b.revenue) errors.push(`${tag}: 영업이익 > 연매출`);
  if (b.profit != null && b.revenue && b.profit / b.revenue > 0.4) warns.push(`${tag}: 이익률 ${Math.round(b.profit / b.revenue * 100)}% — 비정상 고이익, 근거 확인`);
  checkSource(b.source, tag);
  checkExtras(b, tag);
  checkFilesMeta(b.files, tag);
  const sub = new Set();
  checkSub(b.comments, 'comments', tag, sub);
  checkSub(b.docs, 'docs', tag, sub);
  checkChecks(b.checks, tag, sub);
});
(seed.listings || []).forEach((l, i) => {
  const tag = `listings[${i}](${l.id || '?'})`;
  checkId(l.id, 'listing', tag);
  if (ids.has(l.id)) errors.push(`${tag}: id 중복`); else ids.add(l.id);
  if (!isStr(l.title) || !l.title) errors.push(`${tag}: title(매물명) 필요`);
  if (!isStr(l.region) || !l.region) errors.push(`${tag}: region(지역) 필요`);
  checkMoney(l, ['price', 'premium', 'deposit', 'rent', 'mRevenue', 'mProfit', 'size'], tag);
  if (l.status && !['판매중', '협상중', '계약진행', '거래완료'].includes(l.status)) errors.push(`${tag}: status 값 확인`);
  if (l.brandId && !(seed.brands || []).some(b => b.id === l.brandId)) errors.push(`${tag}: brandId '${l.brandId}'에 해당하는 브랜드 없음`);
  // 이상치
  if (l.mProfit != null && l.mRevenue != null && l.mProfit > l.mRevenue) errors.push(`${tag}: 월수익 > 월매출`);
  if (l.rent != null && l.mRevenue != null && l.rent > l.mRevenue) errors.push(`${tag}: 월세 > 월매출`);
  if (l.rent != null && l.mRevenue && l.rent / l.mRevenue > 0.25) warns.push(`${tag}: 월세가 월매출의 25% 초과 — 임차료 부담 확인`);
  checkSource(l.source, tag);
  checkExtras(l, tag);
  checkFilesMeta(l.files, tag);
  const sub = new Set();
  checkSub(l.comments, 'comments', tag, sub);
  checkSub(l.docs, 'docs', tag, sub);
  checkChecks(l.checks, tag, sub);
});

// main 대비 삭제·id 재사용 금지 (git 이력이 있을 때만)
try {
  let base = '';
  for (const ref of ['origin/main', 'main']) {
    try { base = execSync(`git show ${ref}:data/seed.json`, { cwd: root, stdio: ['pipe', 'pipe', 'ignore'] }).toString(); break; } catch (e) { /* 다음 ref */ }
  }
  if (base) {
    const prev = JSON.parse(base);
    const cur = new Map();
    [...(seed.brands || []), ...(seed.listings || [])].forEach(o => cur.set(o.id, o));
    [...(prev.brands || []), ...(prev.listings || [])].forEach(p => {
      const c = cur.get(p.id);
      if (!c) { errors.push(`${p.id}: 기존 항목 삭제 금지 — status 변경으로 대체하세요`); return; }
      const wasBrand = (prev.brands || []).some(x => x.id === p.id);
      const isBrand = (seed.brands || []).some(x => x.id === p.id);
      if (wasBrand !== isBrand) errors.push(`${p.id}: id 종류 변경 금지 (brand↔listing 재사용)`);
      ['comments', 'docs'].forEach(k => {
        const prevIds = new Set((p[k] || []).map(x => x.id));
        const curIds = new Set((c[k] || []).map(x => x.id));
        prevIds.forEach(pid => { if (!curIds.has(pid)) errors.push(`${p.id} ${k}(${pid}): 기존 ${k} 삭제 금지`); });
      });
    });
  }
} catch (e) { warns.push('main 비교 생략: ' + e.message.split('\n')[0]); }

if (warns.length) {
  console.warn('⚠ 경고 ' + warns.length + '건 (통과는 됨 — 확인 권장):');
  warns.forEach(w => console.warn(' -', w));
}
if (errors.length) {
  console.error('❌ 검증 실패 ' + errors.length + '건:');
  errors.forEach(e => console.error(' -', e));
  process.exit(1);
}
console.log(`✅ seed.json OK — 브랜드 ${seed.brands.length}개, 매물 ${seed.listings.length}건`);
