/* ═══════════════════════════════════════════════════════════════
   좌표 체계 — 영역(Region)을 선언하고, 그 안에만 배치한다.
   벗어나면 빌드가 즉시 실패한다. 짤림·이탈·겹침을 코드로 막는다.
   ═══════════════════════════════════════════════════════════════ */
const fs = require('fs');

/* ── 캔버스 ── */
const W = 13.333, H = 7.5;

/* ── 전역 여백 (safe area) ── */
const M = { l: 0.75, r: 0.75, t: 0.36, b: 0.30 };
const SAFE = { x: M.l, y: M.t, w: W - M.l - M.r, h: H - M.t - M.b };  // 11.833 × 6.84

/* ── 세로 밴드: 위에서 아래로 누적. 합이 SAFE.h 와 정확히 일치해야 한다 ── */
const BANDS = [
  ['brow',    0.32],   // 로고 · 섹션 라벨
  ['browGap', 0.14],
  ['rule',    0.012],  // 상단 괘선
  ['headGap', 0.22],
  ['head',    0.66],   // 헤드라인 (33pt 1줄)
  ['lead',    0.50],   // 리드문 (13.5pt 최대 2줄)
  ['leadGap', 0.26],
  ['body',    3.202],  // ★ 본문 영역 — 모든 콘텐츠는 여기 안에서만
  ['bodyGap', 0.16],
  ['note',    0.20],   // 각주
  ['noteGap', 0.10],
  ['bandRule',0.016],  // 결산 괘선
  ['bandGap', 0.10],
  ['band',    0.44],   // 결산 라벨 + 수치
  ['footGap', 0.22],
  ['footRule',0.010],
  ['foot',    0.28],   // 러닝 푸터
];

/* 밴드 → 절대 y 좌표 */
const Y = {};
{
  let y = SAFE.y, sum = 0;
  for (const [k, h] of BANDS) { Y[k] = { y, h, b: y + h }; y += h; sum += h; }
  const diff = Math.abs(sum - SAFE.h);
  if (diff > 0.0005) {
    throw new Error(`밴드 높이 합(${sum.toFixed(4)})이 안전영역 높이(${SAFE.h.toFixed(4)})와 다릅니다. 차이 ${diff.toFixed(4)}in`);
  }
}

/* 각주 없는 장은 note 밴드까지 본문으로 흡수한다 */
Y.bodyFull = { y: Y.body.y, h: Y.note.b - Y.body.y, b: Y.note.b };

/* ── 가로 컬럼: 12열 그리드 ── */
const COLS = 12, GUT = 0.22;
const COLW = (SAFE.w - GUT * (COLS - 1)) / COLS;      // 0.7841…
const colX = (i) => SAFE.x + (COLW + GUT) * i;
/** span(시작열, 열개수) → {x,w} */
const span = (i, n) => ({ x: colX(i), w: COLW * n + GUT * (n - 1) });

/* ── 영역 객체 ── */
function region(name, x, y, w, h) { return { name, x, y, w, h, x2: x + w, y2: y + h }; }

/** 본문 영역을 세로로 분할 */
function rows(area, spec) {
  // spec: [['a',1],['gap',0.2],['b',2]] — 숫자는 비율(fr) 또는 고정('0.2in' 형태는 gap 이름으로 구분)
  const fixed = spec.filter(s => s[2] === 'fix').reduce((a, s) => a + s[1], 0);
  const frs = spec.filter(s => s[2] !== 'fix').reduce((a, s) => a + s[1], 0);
  const unit = frs > 0 ? (area.h - fixed) / frs : 0;
  const out = {}; let y = area.y;
  for (const [k, v, kind] of spec) {
    const h = kind === 'fix' ? v : unit * v;
    out[k] = region(`${area.name}.${k}`, area.x, y, area.w, h);
    y += h;
  }
  return out;
}
/** 영역을 가로로 n등분 (거터 포함) */
function split(area, n, gut) {
  const g = gut === undefined ? GUT : gut;
  const w = (area.w - g * (n - 1)) / n;
  return Array.from({ length: n }, (_, i) =>
    region(`${area.name}[${i}]`, area.x + (w + g) * i, area.y, w, area.h));
}
/** 영역 안쪽 여백 */
function pad(a, t, r, b, l) {
  if (r === undefined) { r = b = l = t; }
  if (b === undefined) { b = t; l = r; }
  if (l === undefined) { l = r; }
  return region(a.name + '.pad', a.x + l, a.y + t, a.w - l - r, a.h - t - b);
}

/* ── 배치 검사기 ── */
const EPS = 0.004;
const placements = [];   // {slide, region, x,y,w,h, kind, text}
let CUR = { slide: 0 };

function setSlide(n) { CUR.slide = n; }

/**
 * 영역 안에 배치할 때만 통과. 벗어나면 예외.
 * @returns {{x,y,w,h}} 그대로 반환하여 addText/addShape 에 바로 넣는다
 */
function at(reg, box, meta = {}) {
  const b = { x: box.x, y: box.y, w: box.w, h: box.h };
  const over = [];
  if (b.x < reg.x - EPS) over.push(`좌 ${(reg.x - b.x).toFixed(3)}`);
  if (b.y < reg.y - EPS) over.push(`상 ${(reg.y - b.y).toFixed(3)}`);
  if (b.x + b.w > reg.x2 + EPS) over.push(`우 ${(b.x + b.w - reg.x2).toFixed(3)}`);
  if (b.y + b.h > reg.y2 + EPS) over.push(`하 ${(b.y + b.h - reg.y2).toFixed(3)}`);
  if (over.length) {
    throw new Error(
      `[P${String(CUR.slide).padStart(2, '0')}] 영역 이탈 «${reg.name}»  ${over.join(' / ')} in 초과\n` +
      `   영역 x${reg.x.toFixed(2)}~${reg.x2.toFixed(2)} y${reg.y.toFixed(2)}~${reg.y2.toFixed(2)}\n` +
      `   배치 x${b.x.toFixed(2)}~${(b.x + b.w).toFixed(2)} y${b.y.toFixed(2)}~${(b.y + b.h).toFixed(2)}\n` +
      `   내용 ${JSON.stringify(meta.text || meta.kind || '').slice(0, 90)}`);
  }
  placements.push({ slide: CUR.slide, region: reg.name, ...b, ...meta });
  return b;
}

/* ── 텍스트 실측 (한글 폭 계수) ── */
/* 맑은 고딕/Pretendard 기준 실측 근사: 한글 1.00em, 라틴·숫자 0.52em, 공백 0.28em */
function textWidth(str, pt) {
  const em = pt / 72;
  let w = 0;
  for (const ch of str) {
    const c = ch.codePointAt(0);
    if (ch === ' ') w += 0.28 * em;
    else if (c >= 0xAC00 && c <= 0xD7A3) w += 1.00 * em;      // 한글 음절
    else if (c >= 0x3130 && c <= 0x318F) w += 1.00 * em;      // 자모
    else if (c > 0x2000 && c < 0x3000) w += 0.55 * em;        // 문장부호·기호
    else if (c >= 0xFF00 && c <= 0xFFEF) w += 1.00 * em;      // 전각
    else w += 0.52 * em;
  }
  return w;
}
/** 주어진 폭에서 몇 줄이 되는지 (명시 개행 반영) */
function lineCount(str, boxW, pt) {
  return String(str).split('\n').reduce((n, seg) => {
    const need = textWidth(seg, pt);
    return n + Math.max(1, Math.ceil(need / Math.max(0.01, boxW) - 1e-6));
  }, 0);
}
/**
 * 텍스트가 상자 안에 들어가는지 검사. 넘치면 예외.
 * lineSpacing 단위 pt. 지정 없으면 pt*1.38
 */
function fit(reg, box, text, pt, opt = {}) {
  const innerW = box.w - (opt.inset || 0);
  const lines = lineCount(text, innerW, pt);
  const ls = (opt.lineSpacing || pt * 1.38) / 72;
  const need = lines * ls;
  if (need > box.h + EPS) {
    throw new Error(
      `[P${String(CUR.slide).padStart(2, '0')}] 텍스트 넘침 «${reg.name}»\n` +
      `   ${lines}줄 × ${(ls * 72).toFixed(1)}pt = ${need.toFixed(3)}in > 상자 ${box.h.toFixed(3)}in\n` +
      `   ${pt}pt · 폭 ${innerW.toFixed(2)}in · "${String(text).replace(/\n/g, '⏎').slice(0, 70)}"`);
  }
  return at(reg, box, { kind: 'text', text: String(text).slice(0, 60), pt, lines });
}

/* ── 같은 슬라이드 내 겹침 검사 ── */
function overlapReport() {
  const bySlide = {};
  for (const p of placements) (bySlide[p.slide] ||= []).push(p);
  const hits = [];
  for (const [sl, arr] of Object.entries(bySlide)) {
    for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) {
      const a = arr[i], b = arr[j];
      if (a.kind !== 'text' || b.kind !== 'text') continue;
      const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (ox > 0.05 && oy > 0.05) hits.push({ slide: +sl, a: a.text, b: b.text, ox: +ox.toFixed(3), oy: +oy.toFixed(3) });
    }
  }
  return hits;
}

function report(file) {
  const hits = overlapReport();
  const lines = [];
  lines.push('배치 검사 결과');
  lines.push(`  총 배치 ${placements.length}건 · 슬라이드 ${new Set(placements.map(p => p.slide)).size}장`);
  lines.push(`  영역 이탈 0건 (이탈 시 빌드 중단)`);
  lines.push(`  텍스트 넘침 0건 (넘침 시 빌드 중단)`);
  lines.push(`  텍스트 겹침 ${hits.length}건`);
  for (const h of hits) lines.push(`    P${String(h.slide).padStart(2, '0')}  «${h.a}» × «${h.b}»  ${h.ox}×${h.oy}in`);
  const out = lines.join('\n');
  if (file) fs.writeFileSync(file, out + '\n');
  return { text: out, overlaps: hits };
}

module.exports = { W, H, M, SAFE, Y, COLS, GUT, COLW, colX, span,
                   region, rows, split, pad, at, fit, textWidth, lineCount,
                   setSlide, report, placements };
