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
  ['topRule',  0.012],   // 최상단 풀폭 괘선
  ['topGap',   0.150],
  ['brow',     0.300],   // 좌: 챕터번호 / 우: 내일사장 로고
  ['browGap',  0.100],
  ['anchor',   0.460],   // 영문 챕터 앵커 (챕터 첫 장만)
  ['head',     0.560],   // 국문 헤드 26pt 1줄
  ['lead',     0.440],   // 리드문 13pt 최대 2줄
  ['leadGap',  0.260],
  ['body',     3.128],   // ★ 본문
  ['bodyGap',  0.140],
  ['note',     0.200],   // 각주 8.5pt
  ['noteGap',  0.120],
  ['band',     0.520],   // 결론 밴드
  ['footGap',  0.180],
  ['footRule', 0.010],
  ['foot',     0.260],
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

/* 앵커 없는 장: anchor + head 를 합쳐 국문 헤드 2줄 허용 */
Y.headFull = { y: Y.anchor.y, h: Y.head.b - Y.anchor.y, b: Y.head.b };
/* 각주 없는 장: note 밴드까지 본문으로 흡수 */
Y.bodyFull = { y: Y.body.y, h: Y.note.b - Y.body.y, b: Y.note.b };
/* 결론 밴드 없는 장: band 까지 흡수 */
Y.bodyMax  = { y: Y.body.y, h: Y.band.b - Y.body.y, b: Y.band.b };
/* 풀블리드 밴드 (검사 예외 · 화면 끝까지) */
const BLEED = { x: 0, y: 6.130, w: W, h: H - 6.130 };

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
const placements = [];   // {slide, region, x,y,w,h, kind, text, color, seq}
const surfaces  = [];    // {slide, x,y,w,h, color, seq}  ← 그린 순서대로
const slideBg   = {};    // {slide: color}
const bandKind  = {};    // {slide: '문장형'|'수치형'|'칩형'}
let CUR = { slide: 0 };
let SEQ = 0;
let PENDING_BG = 'FFFFFF';

function setSlide(n) { CUR.slide = n; if (!slideBg[n]) slideBg[n] = PENDING_BG; }
/** 슬라이드 배경색 등록 — addSlide 직후 호출 */
function setBg(c) {          // addSlide 직후 호출 — 이 시점부터 새 장으로 센다
  PENDING_BG = c; CUR.slide += 1; slideBg[CUR.slide] = c;
}
/** 색 면 등록 — 가독 검사와 시각 면적 계산에 쓰인다 */
function surface(box, color) {
  surfaces.push({ slide: CUR.slide, seq: SEQ++, x: box.x, y: box.y, w: box.w, h: box.h, color });
  return box;
}
/** 결론 밴드 종류 등록 */
function setBand(kind) { bandKind[CUR.slide] = kind; }

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
  placements.push({ slide: CUR.slide, region: reg.name, seq: SEQ++, ...b, ...meta });
  return b;
}

/* ── 텍스트 실측 (한글 폭 계수) ── */
/* 맑은 고딕 실측 근사: 한글 1.00em, 라틴·숫자 0.58em(대문자 볼드 여유 반영), 공백 0.28em */
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
    else w += 0.58 * em;
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
  return at(reg, box, { kind: 'text', text: String(text).slice(0, 60), pt, lines, color: opt.color });
}


/* ── 이미지 비율 검사 ──
   원본 종횡비와 배치 종횡비가 어긋나면 그림이 눌리거나 늘어난다.
   허용 오차 1.5%. 넘으면 빌드 중단. */
const imgSizeCache = {};
function imgAspect(file) {
  if (imgSizeCache[file] !== undefined) return imgSizeCache[file];
  const buf = fs.readFileSync(file);
  let a = null;
  if (buf.slice(1, 4).toString() === 'PNG') {
    a = buf.readUInt32BE(16) / buf.readUInt32BE(20);
  }
  imgSizeCache[file] = a;
  return a;
}
/** 이미지를 영역 안에 배치하고 비율까지 검사한다 */
function img(reg, box, file) {
  const a = imgAspect(file);
  if (a) {
    const b = box.w / box.h;
    const err = Math.abs(b - a) / a;
    if (err > 0.015) {
      throw new Error(
        `[P${String(CUR.slide).padStart(2, '0')}] 이미지 비율 불일치 «${reg.name}»\n` +
        `   원본 ${a.toFixed(4)} vs 배치 ${b.toFixed(4)}  (오차 ${(err * 100).toFixed(1)}%)\n` +
        `   ${file.split('/').pop()}  배치 ${box.w.toFixed(3)} × ${box.h.toFixed(3)} in\n` +
        `   → 높이를 ${(box.w / a).toFixed(3)} 또는 너비를 ${(box.h * a).toFixed(3)} 로 맞추십시오`);
    }
  }
  return at(reg, box, { kind: 'img', text: file.split('/').pop() });
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


/* ══════════════════════════════════════════════════════════════
   §8 가독 검사 — 다크 면 위 어두운 글자 / 라이트 면 위 흰 글자
   배경색과 글자색의 WCAG 대비율을 좌표 단위로 대조한다.
   ══════════════════════════════════════════════════════════════ */
function _lin(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
function lum(hex) {
  const h = String(hex).replace('#', '');
  return 0.2126 * _lin(parseInt(h.slice(0, 2), 16))
       + 0.7152 * _lin(parseInt(h.slice(2, 4), 16))
       + 0.0722 * _lin(parseInt(h.slice(4, 6), 16));
}
function contrast(a, b) {
  const L1 = Math.max(lum(a), lum(b)), L2 = Math.min(lum(a), lum(b));
  return (L1 + 0.05) / (L2 + 0.05);
}
/** 텍스트 상자 아래에 실제로 깔린 면을 찾는다 — 60% 이상 덮는 면 중 가장 나중에 그린 것 */
function surfaceUnder(t) {
  let best = null;
  const area = t.w * t.h;
  for (const s of surfaces) {
    if (s.slide !== t.slide || s.seq > t.seq) continue;
    const ox = Math.min(s.x + s.w, t.x + t.w) - Math.max(s.x, t.x);
    const oy = Math.min(s.y + s.h, t.y + t.h) - Math.max(s.y, t.y);
    if (ox <= 0 || oy <= 0) continue;
    if ((ox * oy) / area < 0.6) continue;
    if (!best || s.seq > best.seq) best = s;
  }
  return best ? best.color : (slideBg[t.slide] || 'FFFFFF');
}
const MIN_CONTRAST = 3.0;
function contrastReport() {
  const bad = [];
  for (const t of placements) {
    if (t.kind !== 'text' || !t.color) continue;
    const bgc = surfaceUnder(t);
    const r = contrast(t.color, bgc);
    if (r < MIN_CONTRAST) bad.push({ slide: t.slide, text: t.text, fg: t.color, bg: bgc, ratio: +r.toFixed(2) });
  }
  return bad;
}

/* ── §4 시각 면적 — 본문 영역에서 도형·이미지·표가 차지하는 비율 (합집합, 0.04in 격자) ── */
const TEXTISH = new Set(['text']);
function visualReport() {
  const CELL = 0.04;
  const out = {};
  const slides = [...new Set(placements.map(p => p.slide))].sort((a, b) => a - b);
  for (const sl of slides) {
    const bx = SAFE.x, by = Y.body.y, bw = SAFE.w, bh = Y.bodyFull.h;
    const nx = Math.ceil(bw / CELL), ny = Math.ceil(bh / CELL);
    const grid = new Uint8Array(nx * ny);
    const marks = [
      ...surfaces.filter(s => s.slide === sl && !(s.w > 12 && s.h > 6)),
      ...placements.filter(p => p.slide === sl && !TEXTISH.has(p.kind)),
    ];
    for (const m of marks) {
      const i0 = Math.max(0, Math.floor((m.x - bx) / CELL)), i1 = Math.min(nx, Math.ceil((m.x + m.w - bx) / CELL));
      const j0 = Math.max(0, Math.floor((m.y - by) / CELL)), j1 = Math.min(ny, Math.ceil((m.y + m.h - by) / CELL));
      for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) grid[j * nx + i] = 1;
    }
    let on = 0; for (let k = 0; k < grid.length; k++) on += grid[k];
    out[sl] = Math.round(on / grid.length * 1000) / 10;
  }
  return out;
}

/* ── 다크 면적 비율 — 화면 전체에서 어두운 면이 차지하는 비율 (레퍼런스 IR 실측 15%) ── */
function darkAreaReport() {
  const CELL = 0.06;
  const out = {};
  const slides = [...new Set(placements.map(p => p.slide))].sort((a, b) => a - b);
  const nx = Math.ceil(W / CELL), ny = Math.ceil(H / CELL);
  for (const sl of slides) {
    const grid = new Uint8Array(nx * ny);
    const bgDark = lum(slideBg[sl] || 'FFFFFF') < 0.12;
    if (bgDark) grid.fill(1);
    for (const m of surfaces.filter(s => s.slide === sl)) {
      const on = lum(m.color) < 0.12 ? 1 : 0;   // 파란 면(0.17)은 다크로 세지 않는다
      const i0 = Math.max(0, Math.floor(m.x / CELL)), i1 = Math.min(nx, Math.ceil((m.x + m.w) / CELL));
      const j0 = Math.max(0, Math.floor(m.y / CELL)), j1 = Math.min(ny, Math.ceil((m.y + m.h) / CELL));
      if (i1 - i0 < 2 || j1 - j0 < 2) continue;              // 괘선 두께는 면으로 세지 않는다
      for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) grid[j * nx + i] = on;
    }
    let n = 0; for (let k = 0; k < grid.length; k++) n += grid[k];
    out[sl] = Math.round(n / grid.length * 1000) / 10;
  }
  return out;
}

/* ── §4 장별 시각 규격 요약 ── */
function styleReport() {
  const out = {};
  const slides = [...new Set(placements.map(p => p.slide))].sort((a, b) => a - b);
  const va = visualReport();
  for (const sl of slides) {
    const ps = placements.filter(p => p.slide === sl);
    const ss = surfaces.filter(s => s.slide === sl);
    const bg = slideBg[sl] || 'FFFFFF';
    const dark = lum(bg) < 0.18;
    const halfDark = ss.some(s => lum(s.color) < 0.18 && s.w > 3.5 && s.h > 2.5 && !(s.w > 12 && s.h > 6));
    const fullDark = dark || ss.some(s => lum(s.color) < 0.18 && s.w > 12 && s.h > 6);
    out[sl] = {
      bg: fullDark ? '순색면' : halfDark ? '명암분할' : (ss.some(s => s.w > 3 && s.h > 1.4 && lum(s.color) > 0.18 && s.color !== 'FFFFFF') ? '라이트+틴트' : '라이트'),
      dark: 0,
      bigFig: Math.max(0, ...ps.filter(p => p.pt).map(p => p.pt)),
      icons: ps.filter(p => ['mk', 'icon', 'badge', 'pill', 'chip'].includes(p.kind)).length,
      band: bandKind[sl] || '—',
      visual: va[sl],
    };
  }
  return out;
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

  const bad = contrastReport();
  lines.push(`  가독 위반 ${bad.length}건 (배경 대비 ${MIN_CONTRAST} 미만)`);
  for (const b of bad) lines.push(`    P${String(b.slide).padStart(2, '0')}  #${b.fg} on #${b.bg} = ${b.ratio}  «${b.text}»`);

  const st = styleReport();
  const da = darkAreaReport();
  for (const k of Object.keys(st)) st[k].dark = da[k];
  const avgDark = Math.round(Object.values(da).reduce((a, b) => a + b, 0) / Object.keys(da).length * 10) / 10;
  const kinds = Object.values(st);
  const solid = kinds.filter(v => v.bg === '순색면').length;
  const splitN = kinds.filter(v => v.bg === '명암분할').length;
  const noFig = Object.entries(st).filter(([, v]) => v.bigFig < 28).map(([k]) => k);
  const noIcon = Object.entries(st).filter(([, v]) => v.icons === 0).map(([k]) => k);
  const thin = Object.entries(st).filter(([, v]) => v.visual < 40).map(([k]) => `${k}(${v_(st, k)}%)`);
  let run = 0, worst = 0, runB = 0, worstB = 0, prevB = null;
  for (const k of Object.keys(st)) {
    if (st[k].bg === '라이트') { run++; worst = Math.max(worst, run); } else run = 0;
    if (st[k].band === prevB) { runB++; worstB = Math.max(worstB, runB + 1); } else { runB = 0; }
    prevB = st[k].band;
  }
  lines.push('');
  lines.push('§4 비주얼 강제 규격');
  lines.push(`  다크 면적 비율 평균 ${avgDark}%  (레퍼런스 내일사장 IR 실측 15% · 허용 12~25%)`);
  lines.push(`  순색 풀블리드 면 ${solid}장 · 좌우 명암분할 ${splitN}장 = 색 면 ${solid + splitN}장 / ${kinds.length}장`);
  lines.push(`  흰 배경 최대 연속 ${worst}장  (규격 3장 미만)`);
  lines.push(`  같은 밴드 종류 최대 연속 ${worstB}장  (규격 3장 미만)`);
  lines.push(`  대형 수치 28pt 미만인 장 ${noFig.length}장  ${noFig.map(n => 'P' + n).join(' ')}`);
  lines.push(`  포인트 아이콘 없는 장 ${noIcon.length}장  ${noIcon.map(n => 'P' + n).join(' ')}`);
  lines.push(`  시각 면적 40% 미만 ${thin.length}장  ${thin.map(n => 'P' + n).join(' ')}`);
  lines.push('');
  lines.push('  쪽  배경        수치  아이콘  밴드    시각면적  다크면적');
  for (const [k, v] of Object.entries(st))
    lines.push(`  ${String(k).padStart(2, '0')}  ${v.bg.padEnd(10, ' ')}  ${String(v.bigFig).padStart(4)}  ${String(v.icons).padStart(5)}   ${v.band.padEnd(5, ' ')}   ${String(v.visual).padStart(5)}%  ${String(v.dark).padStart(6)}%`);
  const out = lines.join('\n');
  if (file) fs.writeFileSync(file, out + '\n');
  return { text: out, overlaps: hits };
}

function v_(st, k) { return st[k].visual; }

module.exports = { W, H, M, SAFE, Y, BLEED, COLS, GUT, COLW, colX, span,
                   region, rows, split, pad, at, fit, img, imgAspect, textWidth, lineCount,
                   setSlide, setBg, surface, setBand, report, placements, surfaces,
                   contrast, lum, contrastReport, styleReport, visualReport, darkAreaReport };
