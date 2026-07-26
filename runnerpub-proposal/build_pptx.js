const pptxgen = require('pptxgenjs');
const path = require('path');

const D = __dirname;
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';              // 13.333 x 7.5
pres.author = '내일사장';
pres.company = '내일사장';
pres.title = '러너펍 가맹영업 파트너십 제안';

// ── 디자인 토큰 ──────────────────────────────────
const INK   = '12101F';
const INK2  = '3A3550';
const MUTED = '6E6885';
const LINE  = 'E3DFF2';
const TINT  = 'F6F4FC';
const VIO   = '5B3DF5';
const VIOD  = '241A5C';
const GOLD  = 'B4832B';
const GOLDL = 'D8A84A';
const W8    = 'FFFFFF';
const F     = '맑은 고딕';

const M = 0.62;                 // 좌우 여백
const CW = 13.333 - M * 2;      // 콘텐츠 폭 12.093

const t = (o) => Object.assign({ fontFace: F, color: INK, margin: 0 }, o);

// 포커칩 모티프 — 섹션 번호 (전 슬라이드 반복)
function chip(s, no, label, y = 0.44) {
  s.addShape(pres.ShapeType.ellipse, {
    x: M, y: y, w: 0.42, h: 0.42, fill: { color: VIO },
    line: { color: VIO, width: 0 },
  });
  s.addText(no, t({ x: M, y: y, w: 0.42, h: 0.42, fontSize: 11, bold: true,
    color: W8, align: 'center', valign: 'middle' }));
  s.addText(label, t({ x: M + 0.6, y: y, w: 6, h: 0.42, fontSize: 11, bold: true,
    color: MUTED, charSpacing: 2.2, valign: 'middle' }));
}

function title(s, runs, y = 1.05, size = 29) {
  s.addText(runs, t({ x: M, y: y, w: CW, h: 1.0, fontSize: size, bold: true,
    lineSpacing: size * 1.32, valign: 'top' }));
}

function foot(s, pg) {
  s.addText('내일사장 × 러너펍 가맹영업 파트너십 제안', t({
    x: M, y: 6.92, w: 7, h: 0.3, fontSize: 8, color: MUTED, charSpacing: 0.6, valign: 'middle' }));
  s.addText(pg, t({ x: 13.333 - M - 1, y: 6.92, w: 1, h: 0.3, fontSize: 8,
    bold: true, color: MUTED, align: 'right', valign: 'middle' }));
}

function card(s, x, y, w, h, opts = {}) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: opts.fill || W8 },
    line: { color: opts.line || LINE, width: 1 },
  });
}

const STATS = [
  ['1,600', '억원+', '누적 매물 거래 규모'],
  ['100,000', '건+', '앱 누적 다운로드'],
  ['50,000', '명+', '월간 활성 이용자'],
  ['10,000', '건+', '누적 매물 등록'],
  ['2,000', '건+', '누적 거래 성사'],
  ['60', '%', '평균 리드타임 단축'],
];

/* ══════════════ 1. 표지 ══════════════ */
{
  const s = pres.addSlide();
  s.background = { path: path.join(D, 'bg_cover.jpg') };

  s.addImage({ path: path.join(D, 'card.png'), x: 10.15, y: 1.35, w: 3.4, h: 4.87,
    transparency: 88, rotate: 12 });

  s.addImage({ path: path.join(D, 'logo.png'), x: M, y: 0.5, w: 2.25, h: 0.74 });
  s.addShape(pres.ShapeType.roundRect, {
    x: 13.333 - M - 2.4, y: 0.6, w: 2.4, h: 0.42, rectRadius: 0.06,
    fill: { color: '1B1440', transparency: 55 }, line: { color: 'FFFFFF', width: 0.75, transparency: 62 },
  });
  s.addText('PARTNERSHIP PROPOSAL', t({ x: 13.333 - M - 2.4, y: 0.6, w: 2.4, h: 0.42,
    fontSize: 8.5, bold: true, color: 'E8E4FF', align: 'center', valign: 'middle', charSpacing: 1.4 }));

  s.addText('가맹 개설 영업 · 모객 대행', t({ x: M, y: 1.92, w: 8, h: 0.32,
    fontSize: 10.5, bold: true, color: GOLDL, charSpacing: 3.4, valign: 'middle' }));

  s.addText([
    { text: '러너펍의 다음 매장을,', options: { breakLine: true } },
    { text: '10만 창업 수요', options: { color: 'C9B8FF' } },
    { text: ' 위에서', options: { breakLine: true } },
    { text: '열겠습니다.' },
  ], t({ x: M, y: 2.36, w: 8.8, h: 2.05, fontSize: 38, bold: true, color: W8, lineSpacing: 50 }));

  s.addText([
    { text: '내일사장은 ' },
    { text: '생성형 AI 기반 창업 지원 플랫폼', options: { bold: true, color: W8 } },
    { text: '이자 가맹영업 전문 조직입니다.', options: { breakLine: true } },
    { text: '이미 확보한 창업 수요와 제휴망 위에서 러너펍 가맹점을 개설합니다.' },
  ], t({ x: M, y: 4.55, w: 8.6, h: 0.8, fontSize: 12, color: 'C4BEDC', lineSpacing: 21 }));

  // 실적 티커 6종
  const tw = CW / 6;
  STATS.forEach(([v, u, k], i) => {
    const x = M + tw * i;
    s.addText([
      { text: v, options: { fontSize: 17, bold: true, color: W8 } },
      { text: u, options: { fontSize: 10, bold: true, color: GOLDL } },
    ], t({ x, y: 5.78, w: tw - 0.12, h: 0.34, valign: 'middle' }));
    s.addText(k, t({ x, y: 6.12, w: tw - 0.12, h: 0.26, fontSize: 8.5, color: '9E97BC', valign: 'middle' }));
  });

  s.addText([
    { text: '내일사장', options: { fontSize: 12.5, bold: true, color: W8, breakLine: true } },
    { text: '점포 개발 · 가맹 영업 · 모객 전문', options: { fontSize: 9, color: '9E97BC' } },
  ], t({ x: M, y: 6.66, w: 6, h: 0.6 }));
  s.addText([
    { text: '러너스튜디오(주) 귀하', options: { breakLine: true } },
    { text: '2026. 07' },
  ], t({ x: 13.333 - M - 4, y: 6.66, w: 4, h: 0.6, fontSize: 9.5, color: '9E97BC', align: 'right', lineSpacing: 15 }));

  s.addNotes('러너펍 본사에 드리는 가맹영업 대행 제안입니다. 핵심은 두 가지입니다. 첫째, 내일사장은 이미 창업 수요를 확보한 플랫폼입니다. 둘째, 계약이 성사된 건에만 비용이 발생합니다.');
}

/* ══════════════ 2. 왜 지금인가 ══════════════ */
{
  const s = pres.addSlide();
  chip(s, '01', 'WHY NOW');
  title(s, [
    { text: '러너펍은 지금,', options: { breakLine: true } },
    { text: '가장 공격적으로', options: { color: VIO } },
    { text: ' 문을 열고 있습니다.' },
  ]);

  // 좌: 논지
  s.addText('공식 가맹 안내 기준으로 러너펍은 초기 개설 부담을 사실상 없애고, 계약에서 오픈까지의 기간도 최단 구간으로 압축해 두었습니다. 브랜드는 이미 확장 준비를 마쳤습니다.',
    t({ x: M, y: 2.42, w: 6.05, h: 0.9, fontSize: 11.5, color: INK2, lineSpacing: 20 }));

  s.addShape(pres.ShapeType.roundRect, { x: M, y: 3.5, w: 6.05, h: 2.92, rectRadius: 0.06,
    fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText([
    { text: '브랜드도, 시스템도, 조건도', options: { breakLine: true } },
    { text: '준비되었습니다.' },
  ], t({ x: M + 0.42, y: 3.85, w: 5.2, h: 0.85, fontSize: 17, bold: true, color: W8, lineSpacing: 25 }));
  s.addText([
    { text: '남은 변수는 ' },
    { text: '“누가, 얼마나 빠르게 창업자를 데려오는가”', options: { color: 'C9B8FF', bold: true } },
    { text: '입니다.' },
  ], t({ x: M + 0.42, y: 4.72, w: 5.2, h: 0.55, fontSize: 13, bold: true, color: W8, lineSpacing: 20 }));
  s.addText([
    { text: '본사가 영업 인력을 직접 늘리면 고정비와 채용 리스크가 함께 늘어납니다. 내일사장은 ' },
    { text: '고정비 없이', options: { bold: true, color: W8 } },
    { text: ' 그 물량을 외부에서 만들어 드립니다.' },
  ], t({ x: M + 0.42, y: 5.38, w: 5.2, h: 0.75, fontSize: 10, color: 'A9A2C4', lineSpacing: 17 }));

  // 우: 근거 카드 2 + 이미 갖춘 것 3
  const RX = 7.0, RW = CW - 6.38;
  card(s, RX, 2.36, RW / 2 - 0.1, 1.72);
  s.addText('개설 기본비용', t({ x: RX + 0.28, y: 2.56, w: 2.2, h: 0.26, fontSize: 9, bold: true, color: VIO, charSpacing: 1 }));
  s.addText([
    { text: '1,600만원', options: { fontSize: 11.5, bold: true, color: MUTED, strike: true } },
    { text: ' → ', options: { fontSize: 11.5, bold: true, color: GOLD } },
    { text: '전액 할인', options: { fontSize: 15, bold: true, color: INK } },
  ], t({ x: RX + 0.24, y: 2.86, w: 2.28, h: 0.4, valign: 'middle' }));
  s.addText('오픈지원비·교육비·계약이행보증금·설계감리비를 면제하는 프로모션 운영 중',
    t({ x: RX + 0.24, y: 3.3, w: 2.3, h: 0.62, fontSize: 8.8, color: MUTED, lineSpacing: 14 }));

  card(s, RX + RW / 2 + 0.1, 2.36, RW / 2 - 0.1, 1.72);
  s.addText('계약 → 오픈', t({ x: RX + RW / 2 + 0.38, y: 2.56, w: 2.2, h: 0.26, fontSize: 9, bold: true, color: VIO, charSpacing: 1 }));
  s.addText([
    { text: '4~6', options: { fontSize: 21, bold: true, color: INK } },
    { text: ' 주', options: { fontSize: 13, bold: true, color: GOLD } },
  ], t({ x: RX + RW / 2 + 0.38, y: 2.86, w: 2.35, h: 0.4, valign: 'middle' }));
  s.addText('상권 검토부터 시공·교육·오픈 부스팅까지 단계별 지원 체계가 이미 갖춰져 있음',
    t({ x: RX + RW / 2 + 0.34, y: 3.3, w: 2.3, h: 0.62, fontSize: 8.8, color: MUTED, lineSpacing: 14 }));

  s.addText('본사가 이미 갖춘 것', t({ x: RX, y: 4.34, w: 4, h: 0.28, fontSize: 9, bold: true, color: MUTED, charSpacing: 1.6 }));
  const READY = [
    ['준법 운영 체계', '현금 환전 등 불법 요소를 배제하는 운영 기준과 정기 점검 체크리스트'],
    ['본사 검증 점포 추천', '상담 → 본사 점포 추천 → 물색 → 확인 → 개점 입지 필터링 체계'],
    ['러너러너 플랫폼', '예약·회원관리·정산·토너먼트 운영을 앱에서 처리, 운영 부담 최소화'],
  ];
  READY.forEach(([h, d], i) => {
    const y = 4.7 + i * 0.6;
    s.addShape(pres.ShapeType.ellipse, { x: RX, y: y + 0.09, w: 0.11, h: 0.11,
      fill: { color: VIO }, line: { width: 0 } });
    s.addText(h, t({ x: RX + 0.26, y: y, w: 1.85, h: 0.28, fontSize: 10, bold: true, valign: 'middle' }));
    s.addText(d, t({ x: RX + 2.14, y: y - 0.02, w: RW - 2.14, h: 0.5, fontSize: 8.6, color: MUTED, lineSpacing: 13 }));
  });

  foot(s, '02');
  s.addNotes('러너펍은 개설 기본비용 1,600만원을 전액 할인하는 프로모션을 운영 중이고, 계약에서 오픈까지 4~6주입니다. 확장 의지가 분명한 시점이라는 뜻입니다.');
}

/* ══════════════ 3. 우리가 가진 것 ══════════════ */
{
  const s = pres.addSlide();
  chip(s, '02', 'WHAT WE BRING');
  title(s, [
    { text: '영업을 ' },
    { text: '0에서 시작하지 않습니다.', options: { color: VIO } },
  ]);
  s.addText('내일사장은 이미 창업 수요와 거래 데이터가 모여 있는 플랫폼을 운영합니다. 러너펍은 이 위에 브랜드를 올리기만 하면 됩니다.',
    t({ x: M, y: 1.95, w: 9.4, h: 0.34, fontSize: 11.5, color: INK2 }));

  // 6분할 지표
  const SUB = ['실제 계약 시장으로 연결된 거래', '창업·양수 수요가 상주하는 채널', 'MAU 기준',
               '점포·상가 데이터베이스', '등록 → 상담 → 검증 → 계약', '계약까지 걸리는 기간 기준'];
  const gw = CW / 3;
  STATS.forEach(([v, u, k], i) => {
    const cx = M + gw * (i % 3), cy = 2.5 + Math.floor(i / 3) * 1.16;
    s.addText([
      { text: v, options: { fontSize: 26, bold: true, color: VIOD } },
      { text: u, options: { fontSize: 12, bold: true, color: GOLD } },
    ], t({ x: cx, y: cy, w: gw - 0.3, h: 0.5, valign: 'middle' }));
    s.addText(k, t({ x: cx, y: cy + 0.5, w: gw - 0.3, h: 0.24, fontSize: 10, bold: true, valign: 'middle' }));
    s.addText(SUB[i], t({ x: cx, y: cy + 0.74, w: gw - 0.3, h: 0.22, fontSize: 8.4, color: MUTED, valign: 'middle' }));
  });

  // 크레덴셜
  card(s, M, 4.92, CW / 2 - 0.12, 0.94, { fill: TINT, line: TINT });
  s.addText('세종대학교 겸임교수진이 만든 플랫폼', t({ x: M + 0.3, y: 5.06, w: 5.4, h: 0.26, fontSize: 10, bold: true, color: VIOD }));
  s.addText('무자격 컨설턴트의 불법·허위 중개로 인한 소상공인 피해를 예방하고, 검증된 창업 수요와 거래 데이터를 축적합니다.',
    t({ x: M + 0.3, y: 5.32, w: 5.4, h: 0.48, fontSize: 8.8, color: MUTED, lineSpacing: 13.5 }));

  card(s, M + CW / 2 + 0.12, 4.92, CW / 2 - 0.12, 0.94, { fill: TINT, line: TINT });
  s.addText('80개+ 브랜드가 이미 함께합니다', t({ x: M + CW / 2 + 0.42, y: 5.06, w: 5.4, h: 0.26, fontSize: 10, bold: true, color: VIOD }));
  s.addText('프랜차이즈 본사 네트워크와 공인중개사 제휴망(리맥스코리아 등)을 통해 입점지와 창업 수요를 동시에 확보합니다.',
    t({ x: M + CW / 2 + 0.42, y: 5.32, w: 5.4, h: 0.48, fontSize: 8.8, color: MUTED, lineSpacing: 13.5 }));

  // 해석 밴드
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 6.0, w: CW, h: 0.82, rectRadius: 0.06,
    fill: { color: INK }, line: { color: INK, width: 0 } });
  const MEAN = [
    ['모수를 새로 만들 필요가 없다', '창업 검토 수요가 이미 플랫폼 안에 있습니다'],
    ['상담이 아니라 거래 경험이다', '2,000건 이상을 실제 계약까지 끌고 간 조직입니다'],
    ['결정까지의 시간이 짧아진다', 'AI 상권·손익 분석으로 판단 근거를 앞당깁니다'],
  ];
  s.addText('이 숫자가 러너펍에 의미하는 것', t({ x: M + 0.34, y: 6.1, w: 3.4, h: 0.24,
    fontSize: 8.4, bold: true, color: GOLDL, charSpacing: 1.4, valign: 'middle' }));
  MEAN.forEach(([h, d], i) => {
    const cx = M + 3.95 + i * 2.72;
    s.addText(h, t({ x: cx, y: 6.14, w: 2.62, h: 0.26, fontSize: 9.6, bold: true, color: W8, valign: 'middle' }));
    s.addText(d, t({ x: cx, y: 6.42, w: 2.62, h: 0.34, fontSize: 8.2, color: 'A9A2C4', lineSpacing: 12 }));
  });

  s.addText('※ 상기 수치는 내일사장 플랫폼 누적 기준입니다.',
    t({ x: M, y: 6.9, w: 6, h: 0.24, fontSize: 7.6, color: MUTED, valign: 'middle' }));
  s.addText('03', t({ x: 13.333 - M - 1, y: 6.9, w: 1, h: 0.24, fontSize: 8, bold: true, color: MUTED, align: 'right', valign: 'middle' }));
  s.addNotes('1,600억 거래, 앱 10만 다운로드, MAU 5만. 영업 모수를 새로 만들 필요가 없다는 것이 핵심입니다.');
}

/* ══════════════ 4. 파는 방식 ══════════════ */
{
  const s = pres.addSlide();
  chip(s, '03', 'HOW WE SELL');
  title(s, [
    { text: '두 개의 트랙으로 ' },
    { text: '동시에', options: { color: VIO } },
    { text: ' 물량을 만듭니다.' },
  ]);
  s.addText('신규 창업자만 기다리지 않습니다. 이미 홀덤펍을 운영 중인 점주를 러너펍으로 전환시키는 경로를 함께 가동해 계약 속도를 높입니다.',
    t({ x: M, y: 1.95, w: 10.5, h: 0.34, fontSize: 11.5, color: INK2 }));

  const TRACKS = [
    ['TRACK A', '신규 창업자', [
      '플랫폼에 상주하는 예비창업자 수요에 러너펍을 직접 노출',
      '개설 기본비용 전액 할인·4~6주 오픈을 핵심 소구점으로 제시',
      'AI 상권분석·손익 시뮬레이션으로 창업 확신을 만들어 클로징',
    ]],
    ['TRACK B', '기존 홀덤펍 리브랜딩', [
      '개인 운영 홀덤펍 점주를 대상으로 러너펍 전환 제안',
      '러너러너 앱 입점에 따른 유입·예약·노쇼 관리 효과를 소구',
      '이미 운영 중인 점주이므로 의사결정이 빠른 즉시 전환형 리드',
    ]],
  ];
  TRACKS.forEach(([tag, nm, items], i) => {
    const x = M + i * (CW / 2 + 0.12), w = CW / 2 - 0.12;
    card(s, x, 2.5, w, 2.42);
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.5, w, h: 0.76, rectRadius: 0.06,
      fill: { color: VIOD }, line: { color: VIOD, width: 0 } });
    s.addShape(pres.ShapeType.rect, { x, y: 3.0, w, h: 0.26, fill: { color: VIOD }, line: { width: 0 } });
    s.addText(tag, t({ x: x + 0.34, y: 2.6, w: 3, h: 0.22, fontSize: 8.2, bold: true, color: 'A99BE8', charSpacing: 1.4 }));
    s.addText(nm, t({ x: x + 0.34, y: 2.82, w: 4.5, h: 0.3, fontSize: 13, bold: true, color: W8 }));
    items.forEach((it, j) => {
      const y = 3.48 + j * 0.46;
      s.addShape(pres.ShapeType.ellipse, { x: x + 0.36, y: y + 0.1, w: 0.1, h: 0.1,
        fill: { color: VIO }, line: { width: 0 } });
      s.addText(it, t({ x: x + 0.6, y: y, w: w - 0.95, h: 0.4, fontSize: 9.8, color: INK2, lineSpacing: 14.5 }));
    });
  });

  s.addText('두 트랙을 동시에 굴리는 도구', t({ x: M, y: 5.18, w: 5, h: 0.28, fontSize: 9, bold: true, color: MUTED, charSpacing: 1.6 }));
  const TOOLS = [
    ['01', 'AI 상권분석', '입지 적합성과 상권 데이터를 보고서로 제시'],
    ['02', '손익분석 (P&L)', '예상 수익구조를 수치로 제시해 결정 지연 차단'],
    ['03', 'ERP · 리드관리', '상담부터 계약까지 파이프라인을 시스템으로 관리'],
    ['04', '점포개발', '제휴 중개망을 통한 입지 물색·확보 지원'],
  ];
  const tw2 = CW / 4;
  TOOLS.forEach(([n, h, d], i) => {
    const x = M + tw2 * i;
    s.addText(n, t({ x, y: 5.54, w: 1, h: 0.22, fontSize: 8.2, bold: true, color: GOLD, charSpacing: 1.2 }));
    s.addText(h, t({ x, y: 5.78, w: tw2 - 0.3, h: 0.28, fontSize: 11, bold: true }));
    s.addText(d, t({ x, y: 6.08, w: tw2 - 0.3, h: 0.46, fontSize: 8.8, color: MUTED, lineSpacing: 13.5 }));
  });

  s.addText([
    { text: '창업자가 결정을 미루는 이유는 대부분 정보 부족입니다. 내일사장은 ' },
    { text: '근거를 문서로 제시', options: { bold: true, color: VIO } },
    { text: '해 그 지연을 끊습니다.' },
  ], t({ x: M, y: 6.62, w: CW, h: 0.3, fontSize: 10, color: INK2, valign: 'middle' }));

  foot(s, '04');
  s.addNotes('신규 창업자와 기존 홀덤펍 리브랜딩, 두 트랙을 동시에 돌립니다. 리브랜딩 트랙은 이미 운영 중인 점주라 결정이 빠릅니다.');
}

/* ══════════════ 5. 시너지 ══════════════ */
{
  const s = pres.addSlide();
  chip(s, '04', 'SYNERGY');
  title(s, [
    { text: '두 플랫폼이 만나면 ' },
    { text: '유입이 양방향', options: { color: VIO } },
    { text: '이 됩니다.' },
  ]);
  s.addText('러너펍은 “플랫폼이 만드는 홀덤펍의 새로운 기준”을 내세우는 브랜드입니다. 내일사장 역시 플랫폼 기업입니다. 두 플랫폼은 서로 다른 수요를 붙잡고 있습니다.',
    t({ x: M, y: 1.95, w: 11.4, h: 0.34, fontSize: 11.5, color: INK2 }));

  // 좌: 결합 다이어그램
  const BW = 2.62;
  card(s, M, 2.56, BW, 1.62, { fill: TINT, line: 'CFC6F5' });
  s.addText('내일사장', t({ x: M, y: 2.74, w: BW, h: 0.24, fontSize: 9, bold: true, color: VIO, align: 'center', charSpacing: 1.2 }));
  s.addText('창업 수요', t({ x: M, y: 3.0, w: BW, h: 0.34, fontSize: 15, bold: true, color: VIOD, align: 'center' }));
  s.addText([{ text: '매장을 여는 사람', options: { breakLine: true } }, { text: '예비창업자 · 업종 전환 희망자' }],
    t({ x: M, y: 3.4, w: BW, h: 0.6, fontSize: 8.8, color: MUTED, align: 'center', lineSpacing: 13.5 }));

  s.addText('+', t({ x: M + BW, y: 2.56, w: 0.58, h: 1.62, fontSize: 20, bold: true, color: GOLD, align: 'center', valign: 'middle' }));

  card(s, M + BW + 0.58, 2.56, BW, 1.62);
  s.addText('러너러너', t({ x: M + BW + 0.58, y: 2.74, w: BW, h: 0.24, fontSize: 9, bold: true, color: VIO, align: 'center', charSpacing: 1.2 }));
  s.addText('이용 수요', t({ x: M + BW + 0.58, y: 3.0, w: BW, h: 0.34, fontSize: 15, bold: true, color: VIOD, align: 'center' }));
  s.addText([{ text: '매장을 찾는 사람', options: { breakLine: true } }, { text: '홀덤펍 이용자 · 토너먼트 참가자' }],
    t({ x: M + BW + 0.58, y: 3.4, w: BW, h: 0.6, fontSize: 8.8, color: MUTED, align: 'center', lineSpacing: 13.5 }));

  // 우: 3단계 흐름
  const FX = M + BW * 2 + 0.58 + 0.5, FW = CW - (BW * 2 + 0.58 + 0.5);
  const FLOW = [
    ['개설 단계', '내일사장 플랫폼의 창업 수요가 러너펍 가맹점으로 전환됩니다.'],
    ['운영 단계', '개설된 매장은 러너러너 앱의 예약·회원관리·토너먼트 운영 체계 위에서 고객을 확보합니다.'],
    ['확산 단계', '운영이 안정된 매장의 성과는 다음 창업자를 설득하는 레퍼런스가 되어 다시 개설로 이어집니다.'],
  ];
  FLOW.forEach(([h, d], i) => {
    const y = 2.56 + i * 0.62;
    s.addShape(pres.ShapeType.roundRect, { x: FX, y, w: 1.32, h: 0.42, rectRadius: 0.05,
      fill: { color: TINT }, line: { color: TINT, width: 0 } });
    s.addText(h, t({ x: FX, y, w: 1.32, h: 0.42, fontSize: 9.4, bold: true, color: VIOD, align: 'center', valign: 'middle' }));
    s.addText(d, t({ x: FX + 1.5, y: y - 0.04, w: FW - 1.5, h: 0.5, fontSize: 9.4, color: INK2, lineSpacing: 14, valign: 'middle' }));
  });

  s.addText([
    { text: '러너러너 앱은 리뉴얼 이후 토너먼트를 제외한 플랫폼 서비스 이용자가 ' },
    { text: '1.5배 증가', options: { bold: true, color: VIO } },
    { text: '한 것으로 보도된 바 있습니다. 매장을 늘릴수록 앱의 밀도가 올라가고, 앱의 밀도는 다시 다음 가맹 상담의 설득 자료가 됩니다.' },
  ], t({ x: M, y: 4.44, w: CW, h: 0.36, fontSize: 10, color: INK2, valign: 'middle' }));

  s.addShape(pres.ShapeType.roundRect, { x: M, y: 4.98, w: CW, h: 1.5, rectRadius: 0.06,
    fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText([
    { text: '러너펍은 매장을 ' },
    { text: '운영', options: { color: 'C9B8FF' } },
    { text: '하는 플랫폼을 가졌고, 내일사장은 매장을 ', options: {} },
    { text: '여는', options: { color: 'C9B8FF' } },
    { text: ' 수요를 가졌습니다.', options: { breakLine: true } },
    { text: '두 축이 붙는 순간 출점은 이벤트가 아니라 흐름이 됩니다.' },
  ], t({ x: M + 0.44, y: 5.2, w: CW - 0.88, h: 1.06, fontSize: 14, bold: true, color: W8, lineSpacing: 25 }));

  s.addText('※ 러너러너 앱 이용자 증가 수치는 언론 보도(IT비즈뉴스, 2024. 7. 4.) 기준입니다.',
    t({ x: M, y: 6.62, w: 7, h: 0.24, fontSize: 7.6, color: MUTED, valign: 'middle' }));
  foot(s, '05');
  s.addNotes('내일사장은 매장을 여는 수요를, 러너러너는 매장을 찾는 수요를 갖고 있습니다. 두 축이 붙으면 출점이 흐름이 됩니다.');
}

/* ══════════════ 6. 조건 ══════════════ */
{
  const s = pres.addSlide();
  chip(s, '05', 'TERMS');
  title(s, [
    { text: '계약이 되지 않으면, ' },
    { text: '비용도 없습니다.', options: { color: VIO } },
  ]);

  // 수수료 히어로
  s.addShape(pres.ShapeType.roundRect, { x: M, y: 1.82, w: CW, h: 1.22, rectRadius: 0.06,
    fill: { color: INK }, line: { color: INK, width: 0 } });
  s.addText([
    { text: '1,000', options: { fontSize: 34, bold: true, color: W8 } },
    { text: '만원', options: { fontSize: 17, bold: true, color: W8 } },
  ], t({ x: M + 0.44, y: 1.98, w: 3.3, h: 0.58, valign: 'middle' }));
  s.addText('가맹계약 1건당 · 부가가치세 별도',
    t({ x: M + 0.46, y: 2.58, w: 3.3, h: 0.26, fontSize: 9.5, bold: true, color: GOLDL, charSpacing: 0.6, valign: 'middle' }));
  s.addText([
    { text: '가맹계약 체결과 가맹비 입금이 완료된 건에 대해서만 청구합니다.', options: { breakLine: true } },
    { text: '착수금 · 월 고정비 · 광고비 등 그 외 비용은 일체 없습니다.', options: { bold: true, color: W8, breakLine: true } },
    { text: '본사는 영업 인력을 늘리지 않고도 출점 물량을 확보하게 됩니다.' },
  ], t({ x: M + 4.3, y: 2.02, w: CW - 4.8, h: 0.86, fontSize: 10, color: 'A9A2C4', lineSpacing: 17 }));

  // LSM 표
  const rows = [
    [{ text: '내일사장 수취 성공보수', options: { bold: true, color: W8, fill: { color: VIOD } } },
     { text: '매장 광고 집행', options: { bold: true, color: W8, fill: { color: VIOD } } },
     { text: '내용', options: { bold: true, color: W8, fill: { color: VIOD } } }],
    [{ text: '1,000만원 전액 수취 시', options: { bold: true } },
     { text: '내일사장', options: { bold: true, color: VIO, align: 'center' } },
     { text: '수취액 중 200만원을 해당 매장의 LSM(지역 매장 마케팅) 광고비로 집행' }],
    [{ text: '800만원 이하', options: { bold: true, fill: { color: TINT } } },
     { text: '본사', options: { bold: true, color: VIO, align: 'center', fill: { color: TINT } } },
     { text: '본사가 해당 매장의 LSM 광고를 부담·집행', options: { fill: { color: TINT } } }],
    [{ text: '800만원 초과 1,000만원 미만', options: { bold: true } },
     { text: '협의', options: { bold: true, color: VIO, align: 'center' } },
     { text: '집행 주체와 분담 비율을 양사 협의로 결정' }],
  ];
  s.addTable(rows, {
    x: M, y: 3.34, w: CW, colW: [3.5, 1.9, CW - 5.4],
    rowH: [0.34, 0.4, 0.4, 0.4],
    fontFace: F, fontSize: 9.6, color: INK2, valign: 'middle',
    border: { type: 'solid', color: LINE, pt: 0.75 },
    margin: [4, 10, 4, 10],
  });

  // 조건 노트 2열
  const NOTES = [
    ['①', '창업자 네고는 내일사장 몫에서 부담합니다.', '할인이 발생해도 그 금액은 전액 내일사장의 성공보수에서 차감하며, 본사 수취 금액에는 영향이 없습니다.'],
    ['②', '인테리어 시공은 내일사장이 진행할 수 있습니다.', '시공을 포함한 개설 과정의 추가 수익 분배는 양사가 별도 협의하여 정합니다.'],
    ['③', '영업은 본사 승인 자료로만 진행합니다.', '브랜드 소개서·창업비용 자료 등 승인된 자료만 사용하며 준법 운영 기준을 따릅니다.'],
    ['④', '진행 상황은 주 단위로 공유합니다.', '리드 현황과 상담 단계를 정기 리포트로 제출해 파이프라인을 투명하게 유지합니다.'],
  ];
  NOTES.forEach(([mk, h, d], i) => {
    const x = M + (i % 2) * (CW / 2 + 0.12), y = 5.18 + Math.floor(i / 2) * 0.72;
    s.addText(mk, t({ x, y, w: 0.28, h: 0.26, fontSize: 10, bold: true, color: VIO }));
    s.addText(h, t({ x: x + 0.3, y, w: CW / 2 - 0.5, h: 0.26, fontSize: 9.8, bold: true }));
    s.addText(d, t({ x: x + 0.3, y: y + 0.26, w: CW / 2 - 0.5, h: 0.44, fontSize: 8.8, color: MUTED, lineSpacing: 13.5 }));
  });

  foot(s, '06');
  s.addNotes('계약 1건당 1,000만원, 부가세 별도. 성사된 건에만 청구합니다. 네고가 들어오면 저희 몫에서 부담하므로 본사 수취액은 변하지 않습니다.');
}

/* ══════════════ 7. 다음 단계 ══════════════ */
{
  const s = pres.addSlide();
  s.background = { path: path.join(D, 'bg_end.jpg') };

  s.addShape(pres.ShapeType.ellipse, { x: M, y: 0.44, w: 0.42, h: 0.42,
    fill: { color: VIO }, line: { width: 0 } });
  s.addText('06', t({ x: M, y: 0.44, w: 0.42, h: 0.42, fontSize: 11, bold: true, color: W8, align: 'center', valign: 'middle' }));
  s.addText('NEXT STEP', t({ x: M + 0.6, y: 0.44, w: 6, h: 0.42, fontSize: 11, bold: true,
    color: '9E97BC', charSpacing: 2.2, valign: 'middle' }));

  s.addText([
    { text: '시작에 필요한 것은 ' },
    { text: '결정 하나', options: { color: 'C9B8FF' } },
    { text: '입니다.' },
  ], t({ x: M, y: 1.1, w: CW, h: 0.7, fontSize: 30, bold: true, color: W8 }));
  s.addText('계약 조건이 확정되면 곧바로 영업을 가동할 수 있습니다. 별도의 셋업 비용이나 준비 기간은 필요하지 않습니다.',
    t({ x: M, y: 1.92, w: 10, h: 0.34, fontSize: 11.5, color: 'B3ABCE' }));

  const STEPS = [
    ['STEP 01', '협의', '조건과 업무 범위 논의'],
    ['STEP 02', '조건 확정', '수수료 · 정산 기준 합의'],
    ['STEP 03', '브랜드 교육', '본사 상품·준법 기준 숙지'],
    ['STEP 04', '영업 가동', '리드 발굴 및 상담 개시'],
  ];
  const sw = CW / 4;
  STEPS.forEach(([n, h, d], i) => {
    const x = M + sw * i;
    s.addShape(pres.ShapeType.roundRect, { x, y: 2.6, w: sw - 0.26, h: 1.16, rectRadius: 0.06,
      fill: { color: 'FFFFFF', transparency: 92 }, line: { color: 'FFFFFF', width: 0.75, transparency: 78 } });
    s.addText(n, t({ x: x + 0.28, y: 2.76, w: sw - 0.6, h: 0.22, fontSize: 8.2, bold: true, color: GOLDL, charSpacing: 1.2 }));
    s.addText(h, t({ x: x + 0.28, y: 2.98, w: sw - 0.6, h: 0.3, fontSize: 13, bold: true, color: W8 }));
    s.addText(d, t({ x: x + 0.28, y: 3.3, w: sw - 0.6, h: 0.28, fontSize: 8.8, color: 'A9A2C4' }));
  });

  const RECAP = [
    ['본사 리스크', '0', '원', '계약이 성사된 건에만 비용이 발생합니다. 고정비도, 선투자도 없습니다.'],
    ['영업 모수', '확보', '됨', '창업 수요와 제휴망이 이미 플랫폼 안에 있습니다. 처음부터 만들지 않습니다.'],
    ['가동 시점', '즉시', ' 가능', '조건만 확정되면 셋업 기간 없이 바로 상담을 시작합니다.'],
  ];
  const rw = CW / 3;
  RECAP.forEach(([k, v, u, d], i) => {
    const x = M + rw * i;
    s.addText(k, t({ x, y: 4.28, w: rw - 0.4, h: 0.24, fontSize: 8.6, bold: true, color: '9E97BC', charSpacing: 1.4 }));
    s.addText([
      { text: v, options: { fontSize: 22, bold: true, color: W8 } },
      { text: u, options: { fontSize: 12, bold: true, color: GOLDL } },
    ], t({ x, y: 4.54, w: rw - 0.4, h: 0.44, valign: 'middle' }));
    s.addText(d, t({ x, y: 5.02, w: rw - 0.4, h: 0.46, fontSize: 8.8, color: 'A9A2C4', lineSpacing: 13.5 }));
  });

  s.addText([
    { text: '러너펍은 이미 확장할 준비를 마쳤습니다.', options: { breakLine: true } },
    { text: '그 속도를 만드는 일', options: { color: 'C9B8FF' } },
    { text: '을 내일사장이 맡겠습니다.' },
  ], t({ x: M, y: 5.72, w: 8.6, h: 0.8, fontSize: 16, bold: true, color: W8, lineSpacing: 27 }));

  s.addText([
    { text: '내일사장', options: { fontSize: 13, bold: true, color: W8, breakLine: true } },
    { text: '점포 개발 · 가맹 영업 · 모객 전문', options: { fontSize: 9, color: '9E97BC' } },
  ], t({ x: M, y: 6.62, w: 6, h: 0.56 }));
  s.addText([
    { text: '러너스튜디오(주) 귀하', options: { breakLine: true } },
    { text: '2026. 07' },
  ], t({ x: 13.333 - M - 4, y: 6.62, w: 4, h: 0.56, fontSize: 9.5, color: '9E97BC', align: 'right', lineSpacing: 15 }));

  s.addNotes('조건만 확정되면 바로 가동할 수 있습니다. 본사 리스크는 0원입니다.');
}

pres.writeFile({ fileName: path.join(D, 'runnerpub_deck.pptx') })
  .then(f => console.log('WROTE', f));
