// data/seed.json 스키마 검증 — 커밋 전에 반드시 실행: node tools/validate-seed.mjs
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'data', 'seed.json');

const errors = [];
let seed;
try {
  seed = JSON.parse(readFileSync(path, 'utf-8'));
} catch (e) {
  console.error('❌ JSON 파싱 실패:', e.message);
  process.exit(1);
}

const isStr = v => typeof v === 'string';
const isNumOrNull = v => v == null || (typeof v === 'number' && !Number.isNaN(v));

function checkSub(list, kind, ownerId) {
  (list || []).forEach((c, i) => {
    if (!isStr(c.id) || !c.id) errors.push(`${ownerId} ${kind}[${i}]: id 필요`);
    if (!isStr(c.author) || !c.author) errors.push(`${ownerId} ${kind}[${i}]: author 필요`);
    if (kind === 'comments' && (!isStr(c.text) || !c.text)) errors.push(`${ownerId} comments[${i}]: text 필요`);
    if (kind === 'docs' && (!isStr(c.url) || !/^https?:\/\//.test(c.url))) errors.push(`${ownerId} docs[${i}]: url은 http(s) 링크`);
    if (typeof c.ts !== 'number') errors.push(`${ownerId} ${kind}[${i}]: ts는 epoch 밀리초 숫자`);
  });
}

if (!Array.isArray(seed.brands)) errors.push('brands는 배열이어야 함');
if (!Array.isArray(seed.listings)) errors.push('listings는 배열이어야 함');

const ids = new Set();
(seed.brands || []).forEach((b, i) => {
  const tag = `brands[${i}](${b.id || '?'})`;
  if (!isStr(b.id) || !b.id) errors.push(`${tag}: id 필요 (예: seed-brand-001)`);
  else if (ids.has(b.id)) errors.push(`${tag}: id 중복`);
  else ids.add(b.id);
  if (!isStr(b.corpName) || !b.corpName) errors.push(`${tag}: corpName(법인명) 필요`);
  if (!isStr(b.tradeName) || !b.tradeName) errors.push(`${tag}: tradeName(상호명) 필요`);
  if (b.openDate && !/^\d{4}-\d{2}-\d{2}$/.test(b.openDate)) errors.push(`${tag}: openDate는 YYYY-MM-DD`);
  ['branches', 'revenue', 'profit', 'askPrice'].forEach(k => { if (!isNumOrNull(b[k])) errors.push(`${tag}: ${k}는 숫자(만원)/null`); });
  if (b.status && !['검토중', '협상중', '실사중', '인수완료', '보류'].includes(b.status)) errors.push(`${tag}: status 값 확인`);
  checkSub(b.comments, 'comments', tag);
  checkSub(b.docs, 'docs', tag);
});
(seed.listings || []).forEach((l, i) => {
  const tag = `listings[${i}](${l.id || '?'})`;
  if (!isStr(l.id) || !l.id) errors.push(`${tag}: id 필요 (예: seed-listing-001)`);
  else if (ids.has(l.id)) errors.push(`${tag}: id 중복`);
  else ids.add(l.id);
  if (!isStr(l.title) || !l.title) errors.push(`${tag}: title(매물명) 필요`);
  if (!isStr(l.region) || !l.region) errors.push(`${tag}: region(지역) 필요`);
  ['price', 'premium', 'deposit', 'rent', 'mRevenue', 'mProfit', 'size'].forEach(k => { if (!isNumOrNull(l[k])) errors.push(`${tag}: ${k}는 숫자(만원)/null`); });
  if (l.status && !['판매중', '협상중', '계약진행', '거래완료'].includes(l.status)) errors.push(`${tag}: status 값 확인`);
  if (l.brandId && !(seed.brands || []).some(b => b.id === l.brandId)) errors.push(`${tag}: brandId '${l.brandId}'에 해당하는 브랜드 없음`);
  checkSub(l.comments, 'comments', tag);
  checkSub(l.docs, 'docs', tag);
});

if (errors.length) {
  console.error('❌ 검증 실패 ' + errors.length + '건:');
  errors.forEach(e => console.error(' -', e));
  process.exit(1);
}
console.log(`✅ seed.json OK — 브랜드 ${seed.brands.length}개, 매물 ${seed.listings.length}건`);
