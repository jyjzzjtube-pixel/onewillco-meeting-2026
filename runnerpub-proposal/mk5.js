/* 러너펍 가맹 개설 영업 위임 제안 — 주식회사 내일사장
   v5 · grid.js 좌표 체계 위에 재구축. 모든 배치는 영역 검사와 텍스트 실측을 통과해야 한다. */
const NM = '/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/node_modules';
const pptxgen = require(NM + '/pptxgenjs');
const path = require('path');
const G = require('./grid.js');
const A = '/home/user/onewillco-meeting-2026/runnerpub-proposal/assets';

const p = new pptxgen();
p.layout = 'LAYOUT_WIDE';
p.author = '주식회사 내일사장'; p.company = '주식회사 내일사장';
p.title = '러너펍 가맹 개설 영업 위임 제안 — 내일사장';

/* ═══ 팔레트 (내일사장 로고 추출값) ═══ */
const NAVY='16233D', NAVY2='1D2C47', BLUE='2C68F3', BLUEL='7FA8FF',
      PAPER='F2F4F8', CARD='FFFFFF', GOLD='B8862B', GOLDL='E5B75C',
      MUTE='6C7891', MUTED='93A0B8', RULE='D6DCE7', RULED='2B3A56',
      ONINK='F4F6FA', TRACK='DDE3EE';
const F = '맑은 고딕';
const { SAFE, Y, span, region, split, pad, at, fit, setSlide } = G;

const t=(o)=>Object.assign({fontFace:F,margin:0},o);
const rect=(s,b,c)=>s.addShape(p.ShapeType.rect,{...b,fill:{color:c},line:{type:'none'}});
/* 괘선: 영역 검사 없이 그리는 순수 장식(높이 0에 가까움) */
const hr=(s,x,y,w,c,h)=>rect(s,{x,y,w,h:h||0.010},c);
const vr=(s,x,y,h,c,w)=>rect(s,{x,y,w:w||0.010,h},c);

/* ═══ 슬라이드 공통 골격 ═══ */
function frame(s,no,section,dark){
  setSlide(no);
  const mu=dark?MUTED:MUTE, rl=dark?RULED:RULE;
  const brow=region('brow',SAFE.x,Y.brow.y,SAFE.w,Y.brow.h);
  s.addImage({path:path.join(A,dark?'ns_logo_w.png':'ns_logo.png'),
    ...at(brow,{x:SAFE.x,y:Y.brow.y+0.05,w:1.22,h:0.214},{kind:'img'})});
  const sec=span(6,6);
  fit(brow,{x:sec.x,y:Y.brow.y+0.05,w:sec.w,h:0.22},section,10.5);
  s.addText(section,t({x:sec.x,y:Y.brow.y+0.05,w:sec.w,h:0.22,fontSize:10.5,bold:true,
    color:dark?BLUEL:BLUE,align:'right',charSpacing:1.6,valign:'middle'}));
  hr(s,SAFE.x,Y.rule.y,SAFE.w,rl,Y.rule.h);

  hr(s,SAFE.x,Y.footRule.y,SAFE.w,rl,Y.footRule.h);
  const ft=region('foot',SAFE.x,Y.foot.y,SAFE.w,Y.foot.h);
  const fl=span(0,8), fr=span(10,2);
  s.addText('주식회사 내일사장  →  러너스튜디오(주) 러너펍 가맹본부',
    t({...at(ft,{x:fl.x,y:Y.foot.y+0.02,w:fl.w,h:0.24}),fontSize:9,color:mu,valign:'middle'}));
  s.addText(`${String(no).padStart(2,'0')} / 18`,
    t({...at(ft,{x:fr.x,y:Y.foot.y+0.02,w:fr.w,h:0.24}),fontSize:9.5,bold:true,
      color:dark?ONINK:NAVY2,align:'right',valign:'middle'}));
}
function head(s,txt,dark,size){
  const r=region('head',SAFE.x,Y.head.y,SAFE.w,Y.head.h);
  const pt=size||33;
  const box=fit(r,{x:SAFE.x,y:Y.head.y,w:SAFE.w,h:Y.head.h},txt,pt,{lineSpacing:pt*1.30});
  s.addText(txt,t({...box,fontSize:pt,bold:true,color:dark?ONINK:NAVY2,
    charSpacing:-0.6,valign:'middle',lineSpacing:pt*1.30}));
}
function lead(s,txt,dark,cols){
  const r=region('lead',SAFE.x,Y.lead.y,SAFE.w,Y.lead.h);
  const sp=span(0,cols||11);
  const box=fit(r,{x:sp.x,y:Y.lead.y,w:sp.w,h:Y.lead.h},txt,13.5,{lineSpacing:21});
  s.addText(txt,t({...box,fontSize:13.5,color:dark?MUTED:MUTE,lineSpacing:21}));
}
function note(s,txt,dark){
  const r=region('note',SAFE.x,Y.note.y,SAFE.w,Y.note.h);
  const box=fit(r,{x:SAFE.x,y:Y.note.y,w:SAFE.w,h:Y.note.h},txt,9,{lineSpacing:12.6});
  s.addText(txt,t({...box,fontSize:9,color:dark?MUTED:MUTE}));
}
function band(s,label,val,unit,dark,money){
  hr(s,SAFE.x,Y.bandRule.y,SAFE.w,dark?ONINK:NAVY2,Y.bandRule.h);
  const r=region('band',SAFE.x,Y.band.y,SAFE.w,Y.band.h);
  const L=span(0,7), R=span(7,5);
  const lb=fit(r,{x:L.x,y:Y.band.y+0.06,w:L.w,h:0.30},label,11.5);
  s.addText(label,t({...lb,fontSize:11.5,color:dark?MUTED:MUTE,valign:'middle'}));
  const vc=money?(dark?GOLDL:GOLD):(dark?ONINK:NAVY2);
  s.addText([{text:val,options:{fontSize:30,bold:true,color:vc}},
             {text:unit?'  '+unit:'',options:{fontSize:12.5,bold:true,color:dark?MUTED:MUTE}}],
    t({...at(r,{x:R.x,y:Y.band.y+0.01,w:R.w,h:0.42},{kind:'fig'}),align:'right',valign:'middle'}));
}
/* 본문 영역 반환 */
const BODY =(full)=>region('body',SAFE.x,Y.body.y,SAFE.w,(full?Y.bodyFull:Y.body).h);

/* 소제목 */
function slabel(s,reg,box,txt,c){
  const b=fit(reg,box,txt,10.5,{lineSpacing:14});
  s.addText(txt,t({...b,fontSize:10.5,bold:true,color:c||MUTE,charSpacing:1.2,valign:'middle'}));
}
/* 본문 텍스트 */
function tx(s,reg,box,txt,pt,o={}){
  const b=fit(reg,box,txt,pt,{lineSpacing:o.lineSpacing||pt*1.38,inset:o.inset||0});
  s.addText(txt,t({...b,fontSize:pt,bold:!!o.bold,color:o.color||NAVY2,
    align:o.align||'left',valign:o.valign||'top',lineSpacing:o.lineSpacing||pt*1.38,
    charSpacing:o.charSpacing}));
}
/* 표 — 영역 안에서 행 높이를 자동 산출 */
function table(s,reg,cols,rows,o={}){
  const dark=o.dark, fs=o.fs||12, hdr=o.header!==false;
  const tw=cols.reduce((a,c)=>a+c.w,0);
  if(tw>reg.w+0.005) throw new Error(`[표] 컬럼 합 ${tw.toFixed(3)} > 영역 ${reg.w.toFixed(3)} «${reg.name}»`);
  const hh=hdr?0.40:0;
  const rh=o.rh||((reg.h-hh)/rows.length);
  if(hh+rh*rows.length>reg.h+0.005) throw new Error(`[표] 총 높이 초과 «${reg.name}» 필요 ${(hh+rh*rows.length).toFixed(3)} > 가용 ${reg.h.toFixed(3)} (행 ${rows.length}개 × ${rh.toFixed(3)})`);
  let cy=reg.y;
  if(hdr){
    hr(s,reg.x,cy,tw,dark?ONINK:NAVY2,0.016); cy+=0.09;
    let cx=reg.x;
    cols.forEach(c=>{
      s.addText(c.h,t({...at(reg,{x:cx,y:cy,w:c.w,h:0.24},{kind:'th'}),fontSize:9.5,bold:true,
        color:dark?MUTED:MUTE,align:c.a||'left',charSpacing:0.8,valign:'middle'})); cx+=c.w;});
    cy+=0.31;
  }
  rows.forEach(r=>{
    hr(s,reg.x,cy,tw,dark?RULED:RULE);
    let cx=reg.x;
    r.forEach((cell,i)=>{
      const c=cols[i], v=(typeof cell==='object')?cell:{v:cell};
      const w=(c.a==='right')?c.w:c.w-0.16;
      tx(s,reg,{x:cx,y:cy+0.05,w,h:rh-0.10},v.v,v.fs||fs,
        {bold:v.b,color:v.c||(dark?ONINK:NAVY2),align:c.a,valign:'middle',lineSpacing:(v.fs||fs)*1.34});
      cx+=c.w;
    });
    cy+=rh;
  });
  hr(s,reg.x,cy,tw,dark?RULED:RULE);
  return cy;
}
/* 대형 수치 */
function fig(s,reg,box,val,unit,label,sub,pt,dark){
  s.addText([{text:val,options:{fontSize:pt||40,bold:true,color:dark?ONINK:NAVY2}},
             {text:unit?' '+unit:'',options:{fontSize:15,bold:true,color:dark?BLUEL:BLUE}}],
    t({...at(reg,{x:box.x,y:box.y,w:box.w,h:0.66},{kind:'fig'}),valign:'middle'}));
  tx(s,reg,{x:box.x,y:box.y+0.68,w:box.w,h:0.26},label,12,{bold:true,valign:'middle',
    color:dark?ONINK:NAVY2,lineSpacing:16});
  if(sub) tx(s,reg,{x:box.x,y:box.y+0.96,w:box.w,h:box.h-0.96},sub,9.8,
    {color:dark?MUTED:MUTE,lineSpacing:13});
}
/* 카드 */
function card(s,reg,box,accent,pd){
  at(reg,box,{kind:'card'});
  rect(s,box,CARD);
  if(accent) rect(s,{x:box.x,y:box.y,w:box.w,h:0.05},accent);
  return pad(region(box.name||'card',box.x,box.y,box.w,box.h),pd===undefined?0.22:pd);
}

/* ══════════ 01 표지 ══════════ */
{
  setSlide(1);
  const s=p.addSlide(); s.background={color:NAVY};
  rect(s,{x:0,y:0,w:0.26,h:G.H},BLUE);
  const FULL=region('cover',SAFE.x,SAFE.y,SAFE.w,G.H-SAFE.y-0.30);

  s.addImage({path:path.join(A,'ns_logo_w.png'),...at(FULL,{x:SAFE.x,y:0.56,w:1.86,h:0.327},{kind:'img'})});
  tx(s,FULL,{x:SAFE.x,y:0.96,w:5,h:0.24},'주식회사 내일사장',11,{color:MUTED,charSpacing:0.6});

  tx(s,FULL,{x:SAFE.x,y:1.86,w:9,h:0.30},'가맹 개설 영업 위임 제안',14,
    {bold:true,color:BLUEL,charSpacing:3.4,valign:'middle'});
  hr(s,SAFE.x,2.32,2.0,BLUE,0.034);

  const HL='가맹을 팔아 온 사람들이\n러너펍을 팔겠습니다';
  tx(s,FULL,{x:SAFE.x,y:2.62,w:8.6,h:1.88},HL,50,{bold:true,color:ONINK,lineSpacing:66,charSpacing:-1.6});

  s.addImage({path:path.join(A,'illust_cover.png'),
    ...at(FULL,{x:SAFE.x+10.30,y:2.28,w:1.06,h:2.32},{kind:'img'})});

  tx(s,FULL,{x:SAFE.x,y:4.66,w:10.4,h:0.74},
    'SPC 파리바게뜨 가맹사업본부 · 이삭토스트 COO · 맥도날드 · 써브웨이 · CJ푸드빌 출신이 만든 창업 플랫폼입니다.\n계약이 체결되고 가맹비 입금이 완료된 건에만 성공보수를 청구합니다.',
    14,{color:MUTED,lineSpacing:24});

  hr(s,SAFE.x,5.66,SAFE.w,RULED);
  const CV=[['성공보수','가맹계약 1건당 1,000만원 (VAT 별도)'],
            ['청구 조건','계약 체결 및 가맹비 입금 완료 건에 한함'],
            ['영업 트랙','신규 창업자 · 기존 홀덤펍 리브랜딩']];
  CV.forEach(([k,v],i)=>{
    const c=span(i*4,4);
    tx(s,FULL,{x:c.x,y:5.86,w:c.w,h:0.20},k,9.5,{color:BLUEL,charSpacing:1.2});
    tx(s,FULL,{x:c.x,y:6.10,w:c.w,h:0.30},v,11.5,{bold:true,color:ONINK,valign:'middle'});
    if(i) vr(s,c.x-0.11,5.86,0.54,RULED);
  });
  hr(s,SAFE.x,6.62,SAFE.w,RULED);
  tx(s,FULL,{x:SAFE.x,y:6.80,w:3,h:0.24},'2026. 07',11,{color:MUTED,valign:'middle'});
  tx(s,FULL,{x:SAFE.x+6.83,y:6.80,w:5,h:0.24},'수신   러너스튜디오(주) 귀중 · 대표 박경관',11,
    {color:ONINK,align:'right',valign:'middle'});
  s.addNotes('발신은 주식회사 내일사장입니다. 저희 팀이 가맹사업 본부 출신이라는 점부터 말씀드립니다.');
}

/* ══════════ 02 제안 요약 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,2,'제안 요약');
  head(s,'한 장으로 먼저 말씀드립니다');
  lead(s,'뒤에 자세히 붙이겠습니다만, 본사께서 판단하실 내용은 이 네 가지입니다.',false,10);

  const B=BODY(true);
  const R=G.rows(B,[['top',1],['gap',0.24,'fix'],['bot',1]]);
  const Q=[
    ['01','누가 하는가','프랜차이즈 본부 출신 경영진이 운영하는 창업 플랫폼입니다.\n대표는 SPC 파리바게뜨 가맹사업본부와 이삭토스트 COO를 거쳤습니다.','P.05'],
    ['02','무엇으로 하는가','앱 다운로드 10만 건, 월 이용자 5만 명, 예비창업자 DB 5,114명.\n이미 모여 있는 창업 수요 위에서 영업합니다.','P.07'],
    ['03','얼마인가','가맹계약 1건당 1,000만원(VAT 별도).\n착수금·월 고정비·광고비는 없습니다.','P.14'],
    ['04','본사 부담은','계약 전까지 0원입니다. 성공보수는 가맹비 1,500만원 안에서\n정산되어 계약 시점에 본사는 이미 흑자입니다.','P.16'],
  ];
  [R.top,R.bot].forEach((row,ri)=>{
    split(row,2,0.34).forEach((cell,ci)=>{
      const [n,k,v,ref]=Q[ri*2+ci];
      const inner=card(s,B,{...cell,name:`q${ri}${ci}`},BLUE);
      tx(s,inner,{x:inner.x,y:inner.y+0.06,w:1.0,h:0.26},n,12,{bold:true,color:BLUE,charSpacing:1.2});
      tx(s,inner,{x:inner.x+inner.w-1.2,y:inner.y+0.06,w:1.2,h:0.26},ref,10,{bold:true,color:MUTE,align:'right'});
      tx(s,inner,{x:inner.x,y:inner.y+0.36,w:inner.w,h:0.34},k,17,{bold:true,valign:'middle'});
      tx(s,inner,{x:inner.x,y:inner.y+0.74,w:inner.w,h:inner.h-0.74},v,11.5,{color:MUTE,lineSpacing:16.5});
    });
  });
  band(s,'계약이 성사되기 전까지 본사가 지출하는 금액','0','원');
  s.addNotes('네 가지만 보시면 됩니다.');
}

/* ══════════ 03 회사 개요 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,3,'회사');
  head(s,'내일부터 내 일이 사장이 되는 플랫폼');
  lead(s,'허위·과장 매물로 창업자가 무너지는 것을 막겠다는 목적으로 만들어진 회사입니다.',false,10);

  const B=BODY(true);
  const R=G.rows(B,[['tbl',1],['gap',0.22,'fix'],['why',0.52,'fix']]);
  const rows=[
    [{v:'법인',b:true},'주식회사 내일사장 (NAEILSAJANG Corp.)'],
    [{v:'대표',b:true},'박규태 — 유통학 박사 · 세종사이버대 외식창업프랜차이즈학 겸임교수'],
    [{v:'설립',b:true},'2022년 6월 설립 준비 및 MVP 테스트 → 2023년 1월 법인 설립'],
    [{v:'서비스',b:true},'매장 양도양수 직거래 플랫폼 「내일사장」 (앱 · 웹) 및 프랜차이즈 ERP'],
    [{v:'핵심 기술',b:true},'홈택스(국세청) 데이터 연동 실매출 검증 · 매물인증 기반 부동산중개방법 특허출원 3건'],
    [{v:'수행 업무',b:true},'가맹영업대행 · 창업 마케팅 · 점포개발 및 물건화 · 인테리어 시공'],
  ];
  table(s,R.tbl,[{h:'구분',w:2.3},{h:'내용',w:R.tbl.w-2.3}],rows);
  slabel(s,R.why,{x:R.why.x,y:R.why.y+0.10,w:2.4,h:0.26},'설립 취지',BLUE);
  tx(s,R.why,{x:R.why.x+2.6,y:R.why.y,w:R.why.w-2.6,h:R.why.h},
    '양도자를 대변하는 과장된 매출 정보와 무자격 컨설턴트의 허위 매물 브리핑이 창업자를 조기 폐업으로 몰고 있습니다.\n저희는 홈택스 실매출로 검증한 매물만 인증합니다.',
    12,{lineSpacing:17,valign:'middle'});

  band(s,'매물인증 기반 부동산중개방법 · 특허출원','3','건');
  s.addNotes('허위 매물로 창업자가 망하는 걸 막겠다고 만든 회사입니다. 그래서 검증이 본업입니다.');
}

/* ══════════ 04 연혁 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,4,'연혁');
  head(s,'3년 만에 인증 · 특허 · 투자를 갖췄습니다');
  lead(s,'2022년 MVP에서 시작해 벤처기업 인증과 기업부설연구소, 시드 투자유치까지 왔습니다.',false,10);

  const B=BODY();
  const R=G.rows(B,[['tl',1],['gap',0.18,'fix'],['awd',0.50,'fix']]);
  const HIS=[
    ['2022','MVP 테스트','법인 설립 준비 및 앱 MVP 테스트\n매장등록 200건\n인증매물 1,000건 진행'],
    ['2023','법인 설립','내일사장 1.0 출시\n벤처기업 인증 · 기업부설연구소\n특허출원 3건 · 데이터바우처 우수기업\nBBQ 등 프랜차이즈 10곳 인증관 입점\n연매출 2억원 · 다운로드 3만'],
    ['2024','BM 다각화','초기창업패키지 · R&D 디딤돌 선정\n서브웨이 등 약 20곳 인증관 입점\n한국프랜차이즈산업협회 사업단 설립\n연매출 4억원 · 다운로드 8만'],
    ['2025','투자 유치','구글 창구 프로그램 선정\nSeed 투자유치 (씨엔티테크)\nSPC · 삼성웰스토리 · 캐시노트 협약\n상반기 매출 4.6억원'],
  ];
  hr(s,R.tl.x,R.tl.y,R.tl.w,NAVY2,0.016);
  const cells=split(R.tl,4,0.30);
  HIS.forEach(([yy,k,v],i)=>{
    const c=cells[i];
    rect(s,at(R.tl,{x:c.x,y:c.y,w:0.86,h:0.05},{kind:'mk'}),BLUE);
    tx(s,R.tl,{x:c.x,y:c.y+0.18,w:c.w,h:0.58},yy,30,{bold:true,color:BLUE,charSpacing:-0.8,valign:'middle',lineSpacing:38});
    tx(s,R.tl,{x:c.x,y:c.y+0.80,w:c.w,h:0.30},k,14,{bold:true,valign:'middle'});
    tx(s,R.tl,{x:c.x,y:c.y+1.12,w:c.w,h:c.h-1.16},v,10.8,{color:MUTE,lineSpacing:16});
    if(i) vr(s,c.x-0.15,c.y+0.20,c.h-0.24,RULE);
  });
  slabel(s,R.awd,{x:R.awd.x,y:R.awd.y+0.06,w:2.4,h:0.26},'수상 · 선정',BLUE);
  tx(s,R.awd,{x:R.awd.x+2.6,y:R.awd.y,w:R.awd.w-2.6,h:R.awd.h},
    '공간융합 빅데이터 창업경진대회 최우수 (국토정보공사)  ·  경기도 우수스타트업 경진 우수 (경기과학진흥원)\n2023 데이터바우처 우수기업',
    11.5,{valign:'middle',lineSpacing:16});

  band(s,'매출 추이 · 2023년 1.9억 → 2024년 4억 → 2025년 상반기','4.6','억원',false,true);
  note(s,'※ 2025년 상반기 매출은 2025.06 기준으로, 반기에 전년도 연매출을 넘어섰습니다.');
  s.addNotes('3년 동안 인증, 특허, 정부 사업, 투자를 차례로 받았습니다.');
}

/* ══════════ 05 팀 ══════════ */
{
  const s=p.addSlide(); s.background={color:NAVY};
  s.addImage({path:path.join(A,'p05_bg.png'),x:0,y:0,w:G.W,h:G.H});
  frame(s,5,'팀',true);
  head(s,'"가맹을 팔아 보셨습니까"에 대한 답입니다',true);
  lead(s,'저희 경영진은 프랜차이즈 가맹사업 본부에서 실제로 가맹점을 열어 온 사람들입니다.',true,10);

  const B=BODY(true);
  const TEAM=[
    ['박규태','대표이사',true,'유통학 박사 · 세종사이버대 겸임교수\n전 SPC 파리바게뜨 가맹사업본부\n전 이삭토스트 총괄사업부장(COO)'],
    ['김우곤','COO',true,'유통학 박사 · 세종대 유통학과 겸임교수\n전 McDonald’s · Subway Int’l B.V\n전 CJ푸드빌 · SPC 외 15년'],
    ['천영식','CMO',false,'프랜차이즈 경영학 석사\n전 한촌 · 육수당 마케팅본부장\n전 죠스떡볶이 마케팅팀장'],
    ['장수형','CTO',false,'농협 올인원뱅크 · 아리따움 몰 외 개발\n플랫폼 개발사 유니위즈 운영'],
    ['엄태관','운영 팀장',true,'프랜차이즈 경영학 석사\n전 아딸 가맹사업본부\n전 셀렉토커피 영업팀장'],
    ['김재현','기획 팀장',false,'외식경영학 박사 · 전 국립대 겸임교수\n전 창업플랫폼 서비스기획 팀장'],
    ['김호병','팀장',false,'공인중개사 · 브랜드 개설 및 영업\n전 창업컨설팅 경력 5년 이상'],
  ];
  const R=G.rows(B,[['r0',1],['r1',1],['r2',1],['r3',1]]);
  const ROWS=[R.r0,R.r1,R.r2,R.r3];
  TEAM.forEach(([nm,pos,fr,car],i)=>{
    const row=ROWS[Math.floor(i/2)], cell=split(row,2,0.44)[i%2];
    hr(s,cell.x,cell.y,cell.w,RULED);
    tx(s,cell,{x:cell.x,y:cell.y+0.08,w:1.36,h:0.32},nm,16,{bold:true,color:ONINK,valign:'middle',lineSpacing:21});
    tx(s,cell,{x:cell.x,y:cell.y+0.42,w:1.36,h:0.24},pos,10.5,{bold:true,color:fr?BLUEL:MUTED,valign:'middle',lineSpacing:14});
    tx(s,cell,{x:cell.x+1.44,y:cell.y+0.06,w:cell.w-1.44,h:cell.h-0.14},car,10.2,
      {color:MUTED,lineSpacing:14.5});
  });
  const last=split(R.r3,2,0.44)[1];
  hr(s,last.x,last.y,last.w,RULED);
  tx(s,last,{x:last.x,y:last.y+0.14,w:last.w,h:last.h-0.20},
    '프랜차이즈 본부에서 가맹 개설을 직접 해 본 인원이 7인 중 4인입니다.\n러너펍 영업은 이 네 사람이 직접 맡습니다.',
    11.5,{bold:true,color:BLUEL,lineSpacing:19});

  band(s,'프랜차이즈 본사 출신 · 경영진 및 팀장 7인 중','4','인',true);
  s.addNotes('본사에서 가장 먼저 물으실 질문입니다. 대표는 파리바게뜨 가맹사업본부, 영업팀장은 아딸 가맹사업본부 출신입니다.');
}

/* ══════════ 06 자격 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,6,'자격');
  head(s,'말이 아니라 등록된 자격으로 증명합니다');
  lead(s,'가맹 개설 영업은 법이 관여하는 영역입니다. 검증된 사업자만 맡을 수 있어야 한다고 생각합니다.',false,10);

  const B=BODY(true);
  const R=G.rows(B,[['g0',1],['gap',0.22,'fix'],['g1',1],['gap2',0.22,'fix'],['law',0.50,'fix']]);
  const C=[
    ['벤처기업 인증','2023년 취득'],['기업부설연구소','2023년 설립'],
    ['특허출원 3건','매물인증 기반 부동산중개방법'],['초기창업패키지','2024 선정'],
    ['R&D 디딤돌사업','2024 선정'],['구글 창구 프로그램','2025 선정'],
    ['Seed 투자유치','씨엔티테크 — 스테이션케이 제1호'],['한국프랜차이즈산업협회','공동사업단 공동설립'],
  ];
  [R.g0,R.g1].forEach((row,ri)=>{
    split(row,4,0.22).forEach((cell,ci)=>{
      const [k,v]=C[ri*4+ci];
      const inner=card(s,B,{...cell,name:`c${ri}${ci}`},BLUE);
      tx(s,inner,{x:inner.x,y:inner.y+0.10,w:inner.w,h:0.46},k,13.5,{bold:true,lineSpacing:19});
      tx(s,inner,{x:inner.x,y:inner.y+0.60,w:inner.w,h:inner.h-0.60},v,10.2,{color:MUTE,lineSpacing:13.5});
    });
  });
  slabel(s,R.law,{x:R.law.x,y:R.law.y+0.10,w:2.4,h:0.26},'준법 운영',BLUE);
  tx(s,R.law,{x:R.law.x+2.6,y:R.law.y,w:R.law.w-2.6,h:R.law.h},
    '정보공개서 제공 후 가맹사업법 제7조 법정 숙려기간 14일이 지나기 전에는 시스템에서 전자계약 버튼이 잠깁니다.\n사람이 달력을 세지 않습니다.',
    12,{lineSpacing:17,valign:'middle'});

  band(s,'법정 숙려기간 · 시스템이 자동으로 잠그는 기간','14','일');
  s.addNotes('가맹사업법 위반은 본사 리스크입니다. 저희는 숙려기간을 시스템으로 강제합니다.');
}

/* ══════════ 07 실적 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,7,'실적');
  head(s,'창업 수요를 새로 만드실 필요가 없습니다');
  lead(s,'아래 모수는 이번 제안 이전에 이미 확보돼 있습니다. 러너펍은 모객 비용과 시간을 지불하지 않아도 됩니다.',false,11);

  const B=BODY();
  const R=G.rows(B,[['f0',1],['f1',1],['eff',0.40,'fix']]);
  const S=[
    ['100,000','건 +','앱 누적 다운로드','창업·양수 수요가 상주하는 채널'],
    ['50,000','명 +','월간 활성 이용자','MAU 기준'],
    ['5,114','명','예비창업자 상담 DB','자금·지역·업종 조건까지 확보'],
    ['1,600','억원 +','누적 매물 거래 규모','플랫폼 누적 기준'],
    ['10,000','건 +','누적 매물 등록','점포·상가 데이터베이스'],
    ['2,000','건 +','누적 거래 성사','등록 → 상담 → 검증 → 계약'],
  ];
  hr(s,B.x,B.y,B.w,NAVY2,0.016);
  [R.f0,R.f1].forEach((row,ri)=>{
    split(row,3,0.30).forEach((cell,ci)=>{
      const [v,u,k,n]=S[ri*3+ci];
      fig(s,cell,{x:cell.x,y:cell.y+0.12,w:cell.w,h:cell.h-0.20},v,u,k,n,40);
      if(ci) vr(s,cell.x-0.15,cell.y+0.14,cell.h-0.24,RULE);
    });
    hr(s,B.x,row.y+row.h-0.02,B.w,RULE);
  });
  slabel(s,R.eff,{x:R.eff.x,y:R.eff.y+0.06,w:2.6,h:0.26},'인증 서비스 효과',BLUE);
  [['자영업자 1년 생존률','67 %','99 %'],['양도양수 성공 비율','47 %','80 %']].forEach(([k,a,b],i)=>{
    const c=span(3+i*4,4);
    tx(s,R.eff,{x:c.x,y:R.eff.y+0.05,w:2.3,h:0.30},k,11,{color:MUTE,valign:'middle'});
    s.addText([{text:a,options:{fontSize:13,color:MUTE}},
               {text:'  →  ',options:{fontSize:11,color:MUTE}},
               {text:b,options:{fontSize:19,bold:true,color:BLUE}}],
      t({...at(R.eff,{x:c.x+2.3,y:R.eff.y+0.02,w:c.w-2.3,h:0.36},{kind:'fig'}),valign:'middle'}));
  });

  band(s,'모수 확보를 위해 본사가 쓰실 시간과 비용','0','원');
  note(s,'※ 플랫폼 지표는 내일사장 누적 기준(2026.07)이며, 생존률·성공비율은 내일사장 인증 서비스 이용 건 기준 자체 집계값입니다.');
  s.addNotes('앱 10만, 월 5만 명, 상담 DB 5,114명. 러너펍에 맞는 사람을 이 안에서 찾습니다.');
}

/* ══════════ 08 제휴 네트워크 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,8,'네트워크');
  head(s,'업계 안에서 이미 자리를 잡고 있습니다');
  lead(s,'저희가 만든 트래픽만 쓰는 것이 아니라, 협회와 대기업 플랫폼을 통해 창업 수요를 받습니다.',false,11);

  const B=BODY(true);
  const R=G.rows(B,[['logos',0.84,'fix'],['gap',0.20,'fix'],['n0',1],['n1',1],['n2',1]]);
  /* 제휴사 로고 8종 — IR 원본에서 추출 */
  rect(s,at(B,{x:R.logos.x,y:R.logos.y,w:R.logos.w,h:R.logos.h},{kind:'card'}),CARD);
  const LG=[['spc',0.86],['samsung',0.92],['kfa',1.34],['barogo',1.10],
            ['cashnote',0.92],['saramin',0.86],['yogiyo',0.60],['forbes',0.66]];
  const totalW=LG.reduce((a,l)=>a+l[1],0);
  const gapW=(R.logos.w-0.60-totalW)/(LG.length-1);
  let lx=R.logos.x+0.30;
  LG.forEach(([k,w])=>{
    s.addImage({path:path.join(A,`lg_${k}.png`),
      ...at(R.logos,{x:lx,y:R.logos.y+0.26,w,h:0.32},{kind:'img'})});
    lx+=w+gapW;
  });

  const N=[
    ['한국프랜차이즈산업협회','공동사업단 공동설립','1,400여 개 본사 대상 인증매장 · 위생교육 공동 사업'],
    ['SPC','플랫폼 개발 참여','파리바게뜨 · 던킨 등 가맹점 6,000개 그룹사 협업'],
    ['삼성웰스토리','365솔루션 사업단 공동설립','고객사에 브랜드인증관 입점 · 광고 제공 및 자문'],
    ['바로고','든든상점 제휴','18만 등록매장 프로그램에 상호 배너 · 푸시 노출'],
    ['요기요','플랫폼 배너 · 콘텐츠','요기요 플랫폼에 내일사장 제작 콘텐츠 노출'],
    ['포브스코리아','프랜차이즈 어워즈 주관','중앙일보 주최 어워즈를 내일사장이 주관'],
  ];
  [R.n0,R.n1,R.n2].forEach((row,ri)=>{
    split(row,2,0.44).forEach((cell,ci)=>{
      const [k,r,v]=N[ri*2+ci];
      hr(s,cell.x,cell.y,cell.w,ri===0?BLUE:RULE,ri===0?0.028:0.010);
      tx(s,cell,{x:cell.x,y:cell.y+0.12,w:cell.w*0.56,h:0.30},k,15,{bold:true,valign:'middle'});
      tx(s,cell,{x:cell.x+cell.w*0.56,y:cell.y+0.14,w:cell.w*0.44,h:0.26},r,10,
        {bold:true,color:BLUE,align:'right',valign:'middle'});
      tx(s,cell,{x:cell.x,y:cell.y+0.46,w:cell.w-0.16,h:cell.h-0.52},v,11,{color:MUTE,lineSpacing:16});
    });
  });

  band(s,'B2B 제휴 브랜드 · 파트너','80','개 +');
  s.addNotes('협회, SPC, 삼성웰스토리, 바로고, 요기요까지 붙어 있습니다.');
}

/* ══════════ 09 3대 업무 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,9,'업무');
  head(s,'가맹영업 · 마케팅 · 점포개발을 한 회사가 합니다');
  lead(s,'세 가지를 따로 발주하실 필요가 없습니다. 브랜드 본사가 하는 일을 그대로 대행합니다.',false,11);

  const B=BODY(true);
  const R=G.rows(B,[['cols',1],['gap',0.20,'fix'],['extra',0.44,'fix']]);
  const J=[
    ['01','가맹영업대행',['예비창업자 모객과 1차 상담','조건별 등급 분류 (추진 · 관리 · 보류)','자금 · 지역 · 업종 조건에 맞춘 브랜드 매칭','정보공개서 제공부터 계약 체결까지 절차 관리']],
    ['02','창업 마케팅',['블로그 · 네이버 플레이스 · 검색광고 · SNS','창업박람회 부스 · 사업설명회 운영','신규 매장 오픈 행사 및 지역 홍보','브랜드별 소구점 A/B 테스트']],
    ['03','점포개발 · 물건화',['부동산 · 임장으로 후보 점포 발굴','보증금 · 권리금 · 월세 · 평수 수집','실측 · 현장사진 · 인테리어 견적 산출','즉시 브리핑 가능한 상태로 완성']],
  ];
  split(R.cols,3,0.34).forEach((c,i)=>{
    const [n,k,li]=J[i];
    hr(s,c.x,c.y,c.w,BLUE,0.036);
    tx(s,c,{x:c.x,y:c.y+0.16,w:1.2,h:0.26},n,11,{bold:true,color:BLUE,charSpacing:1.4});
    s.addImage({path:path.join(A,`p09_icon${i+1}.png`),
      ...at(c,{x:c.x+c.w-0.46,y:c.y+0.14,w:0.44,h:0.44},{kind:'img'})});
    tx(s,c,{x:c.x,y:c.y+0.46,w:c.w-0.60,h:0.38},k,19,{bold:true,valign:'middle'});
    const bl=G.rows(region(c.name+'.li',c.x,c.y+0.98,c.w,c.h-0.98),
      [['a',1],['b',1],['c',1],['d',1]]);
    [bl.a,bl.b,bl.c,bl.d].forEach((r,j)=>{
      rect(s,at(r,{x:r.x,y:r.y+0.14,w:0.10,h:0.10},{kind:'mk'}),BLUE);
      tx(s,r,{x:r.x+0.26,y:r.y,w:r.w-0.30,h:r.h-0.04},li[j],11.5,{lineSpacing:16,valign:'middle'});
    });
    if(i) vr(s,c.x-0.17,c.y+0.16,c.h-0.20,RULE);
  });
  slabel(s,R.extra,{x:R.extra.x,y:R.extra.y+0.08,w:2.4,h:0.26},'추가 수행',BLUE);
  tx(s,R.extra,{x:R.extra.x+2.6,y:R.extra.y,w:R.extra.w-2.6,h:R.extra.h},
    '인테리어 시공 — 「내일사장인테리어」 명의로 공사주관 및 도급계약을 실제 수행하고 있습니다 (오레노카츠 장승배기점 등)',
    12,{valign:'middle'});

  band(s,'가맹 개설에 필요한 실무 · 한 회사에서','3','대 업무 일괄');
  s.addNotes('가맹영업, 마케팅, 점포개발을 한 회사가 다 합니다.');
}

/* ══════════ 10 보유 도구 ══════════ */
{
  const s=p.addSlide(); s.background={color:NAVY};
  frame(s,10,'도구',true);
  head(s,'말로 파는 게 아니라 자료로 팝니다',true);
  lead(s,'창업자가 결정을 미루는 자리마다 근거 문서를 내놓습니다. 아래는 이미 운영 중인 도구입니다.',true,11);

  const B=BODY(true);
  const L=region('toolL',B.x,B.y,span(0,8).w,B.h);
  const Rr=region('toolR',span(8,4).x,B.y,span(8,4).w,B.h);

  const T=[
    ['홈택스 데이터 연동','국세청 신고자료를 연동해 매장 실매출을 검증합니다'],
    ['수익분석표 계산기','재료비·인건비·로열티를 넣으면 세전수익이 즉시 산출됩니다'],
    ['상권분석 · 목표매출 보고서','유동인구·배후세대·경쟁점을 담아 미팅용 PDF로 출력합니다'],
    ['거리제한 선긋기 지도','영업지역을 도로·블록 경계로 그리고 충돌 시 경고합니다'],
    ['정보공개서 발송 · D-day','발송·수령확인이 기록되고 숙려기간 14일이 자동 카운트됩니다'],
    ['인력 세팅 계산기','매출 규모를 넣으면 권장 인력과 인건비가 주간 시간표로 나옵니다'],
  ];
  const TR=G.rows(L,[['a',1],['b',1],['c',1],['d',1],['e',1],['f',1]]);
  [TR.a,TR.b,TR.c,TR.d,TR.e,TR.f].forEach((r,i)=>{
    hr(s,r.x,r.y,r.w,RULED);
    tx(s,r,{x:r.x,y:r.y+0.08,w:3.5,h:0.28},T[i][0],13,{bold:true,color:ONINK,valign:'middle'});
    tx(s,r,{x:r.x+3.62,y:r.y+0.08,w:r.w-3.62,h:r.h-0.16},T[i][1],10.5,{color:MUTED,lineSpacing:14.5});
  });

  slabel(s,Rr,{x:Rr.x,y:Rr.y,w:Rr.w,h:0.26},'실제 화면 · 홈택스 연동 실매출',MUTED);
  s.addImage({path:path.join(A,'app_sales.png'),
    ...at(Rr,{x:Rr.x+0.16,y:Rr.y+0.36,w:1.62,h:2.82},{kind:'img'})});
  s.addImage({path:path.join(A,'app_report.png'),
    ...at(Rr,{x:Rr.x+1.94,y:Rr.y+0.36,w:1.75,h:2.82},{kind:'img'})});

  band(s,'상담 · 검증 · 계약 단계별 자체 운영 도구','6','종',true);
  s.addNotes('창업자가 결정을 미루는 이유는 근거가 없어서입니다. 저희는 근거를 문서로 만듭니다.');
}

/* ══════════ 11 러너펍 진단 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,11,'진단');
  head(s,'남은 변수는 창업자 접점 하나입니다');
  lead(s,'개설 이후를 받쳐 주는 구조는 본사가 이미 갖추셨습니다. 저희가 맡을 구간은 그 앞단입니다.',false,11);

  const B=BODY();
  const L=region('diagL',B.x,B.y,span(0,7).w,B.h);
  const Rr=region('diagR',span(7,5).x,B.y,span(7,5).w,B.h);

  slabel(s,L,{x:L.x,y:L.y,w:4.4,h:0.26},'러너펍이 이미 갖춘 것');
  hr(s,L.x,L.y+0.32,L.w,NAVY2,0.014);
  const LI=['러너러너 앱 — 예약 · 회원관리 · 정산 · 토너먼트 · 핸디랭킹',
            '본사가 검증한 점포를 추천하는 체계',
            '불법 요소를 배제하는 준법 운영 기준',
            '가맹 절차 9단계 · 계약에서 오픈까지 4~6주',
            '래빗 페스티벌 · 시즌 랭킹전 · 매장 간 콜라보',
            '앱 리뉴얼 후 플랫폼 서비스 이용자 1.5배 증가'];
  const LR=G.rows(region('li',L.x,L.y+0.44,L.w,L.h-0.44),
    [['a',1],['b',1],['c',1],['d',1],['e',1],['f',1]]);
  [LR.a,LR.b,LR.c,LR.d,LR.e,LR.f].forEach((r,i)=>{
    tx(s,r,{x:r.x,y:r.y,w:r.w-0.10,h:r.h-0.08},LI[i],12,{valign:'middle'});
    hr(s,r.x,r.y+r.h-0.06,L.w,RULE);
  });

  slabel(s,Rr,{x:Rr.x,y:Rr.y,w:Rr.w,h:0.26},'아직 비어 있는 것 — 계약 가능한 창업자 모수',BLUE);
  hr(s,Rr.x,Rr.y+0.32,Rr.w,BLUE,0.030);
  s.addImage({path:path.join(A,'p11_pub.png'),
    ...at(Rr,{x:Rr.x+0.16,y:Rr.y+0.46,w:4.48,h:2.44},{kind:'img'})});
  tx(s,Rr,{x:Rr.x,y:Rr.y+2.98,w:Rr.w,h:0.22},
    '매장은 준비되어 있습니다. 앉을 사람을 내일사장이 데려옵니다.',11,{bold:true,color:BLUE,lineSpacing:15});

  band(s,'남은 변수 · 창업자 접점','1','개');
  note(s,'※ 러너러너 앱 운영사는 (주)러너소프트로 러너스튜디오(주)와 별개 법인입니다. 이용자 1.5배 증가는 IT비즈뉴스 2024.7.4 보도 기준.');
  s.addNotes('러너펍은 개설 이후 구조가 완비돼 있습니다. 남은 건 창업자 접점입니다.');
}

/* ══════════ 12 위임 업무 범위 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,12,'업무 범위');
  head(s,'본사는 승인만, 실무 전 과정은 저희가 맡습니다');
  lead(s,'영업 조직 운영부터 계약 주선, 점포개발까지 개설에 필요한 실무를 하나로 묶어 수행합니다.',false,11);

  const B=BODY(true);
  const R=G.rows(B,[['tbl',1],['gap',0.20,'fix'],['dec',0.52,'fix']]);
  const rows=[
    [{v:'영업 조직 운영',b:true},'가맹영업팀을 운영하고 신규 창업자와 기존 홀덤펍 두 트랙으로 영업합니다'],
    [{v:'창업 마케팅',b:true},'예비창업자 리드 확보를 위한 가맹 창업마케팅을 집행합니다'],
    [{v:'창업 상담 · 브리핑',b:true},'상권·손익 자료를 만들어 러너펍 조건에 맞춰 창업자의 결정을 마무리합니다'],
    [{v:'점포개발 · 물건화',b:true},'후보지를 발굴하고 실측·견적까지 끝내 즉시 브리핑 가능한 상태로 만듭니다'],
    [{v:'계약 주선',b:true},'가맹계약 체결까지 조건 협의와 클로징을 지원합니다'],
    [{v:'본사 유입 건',b:true},'본사 문의·직영 영업 유입 건은 성공보수 대상이 아니며, 요청하시면 응대만 지원합니다'],
    [{v:'본사가 하실 일',b:true,c:BLUE},{v:'브랜드 자료 승인 · 가맹계약 체결 · 개설 승인 — 그 앞단은 전부 내일사장이 맡습니다',b:true,c:BLUE}],
  ];
  table(s,R.tbl,[{h:'업무',w:3.4},{h:'수행 내용',w:R.tbl.w-3.4}],rows);
  slabel(s,R.dec,{x:R.dec.x,y:R.dec.y+0.10,w:3.4,h:0.26},'위임 조건 결정권',BLUE);
  tx(s,R.dec,{x:R.dec.x+3.5,y:R.dec.y,w:R.dec.w-3.5,h:R.dec.h},
    '① 전속 · 비전속   ② 대상 지역   ③ 위임 기간   ④ 직영 · 타 대행사 병행 여부\n이 네 가지는 본사가 정해 주시면 그대로 따릅니다.',
    11.5,{lineSpacing:16,valign:'middle'});

  band(s,'위임 시 본사가 추가로 채용해야 할 영업 인력','0','명');
  s.addNotes('본사는 승인만 하시면 됩니다.');
}

/* ══════════ 13 영업 2트랙 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,13,'실행');
  head(s,'신규 창업자와 기존 홀덤펍, 두 트랙을 동시에 엽니다');
  lead(s,'신규 수요만 기다리지 않습니다. 이미 운영 중인 점주를 전환시키는 경로를 함께 가동합니다.',false,11);

  const B=BODY(true);
  const R=G.rows(B,[['tr',1],['gap',0.20,'fix'],['pr',0.46,'fix']]);
  const TR=[
    ['TRACK A','신규 창업자',BLUE,
     [['접점','플랫폼에 상주하는 창업 수요 · 상담 DB 5,114명'],['절차','상권 · 손익 브리핑 → 계약'],
      ['특성','모수 기반 · 검토 기간 필요'],['소구점','개설 기본비용 전액 할인 · 4~6주 오픈']]],
    ['TRACK B','기존 홀덤펍 리브랜딩',NAVY2,
     [['접점','즉시 전환 대상 점주'],['절차','전환 상담 → 계약'],
      ['특성','즉시 전환형 · 검토 기간 짧음'],['소구점','러너펍 브랜드 전환 · 회원관리 체계 승계']]],
  ];
  split(R.tr,2,0.44).forEach((c,i)=>{
    const [tag,nm,col,rws]=TR[i];
    hr(s,c.x,c.y,c.w,col,0.036);
    tx(s,c,{x:c.x,y:c.y+0.16,w:c.w,h:0.26},tag,10.5,{bold:true,color:col,charSpacing:1.8});
    tx(s,c,{x:c.x,y:c.y+0.46,w:c.w,h:0.42},nm,21,{bold:true,valign:'middle'});
    const rr=G.rows(region(c.name+'.r',c.x,c.y+1.00,c.w,c.h-1.00),
      [['a',1],['b',1],['c',1],['d',1]]);
    [rr.a,rr.b,rr.c,rr.d].forEach((r,j)=>{
      tx(s,r,{x:r.x,y:r.y,w:1.3,h:r.h-0.10},rws[j][0],10.5,{color:MUTE,valign:'middle'});
      tx(s,r,{x:r.x+1.4,y:r.y,w:r.w-1.4,h:r.h-0.10},rws[j][1],12,{valign:'middle',lineSpacing:16});
      hr(s,r.x,r.y+r.h-0.08,c.w,RULE);
    });
    if(i) vr(s,c.x-0.22,c.y+0.16,c.h-0.20,RULE);
  });
  slabel(s,R.pr,{x:R.pr.x,y:R.pr.y+0.08,w:2.6,h:0.26},'공통 운영 약속',BLUE);
  const PR=['본사 승인 자료만 사용','러너펍 준법 운영 기준 준수','리드 최초 유입 경로 기준 구분','주 단위 활동 리포트 제출'];
  const prArea=region('pr',R.pr.x+2.8,R.pr.y,R.pr.w-2.8,R.pr.h);
  split(prArea,4,0.16).forEach((c,i)=>{
    rect(s,at(c,{x:c.x,y:c.y+0.12,w:0.10,h:0.10},{kind:'mk'}),BLUE);
    tx(s,c,{x:c.x+0.22,y:c.y,w:c.w-0.26,h:c.h},PR[i],10.5,{lineSpacing:14.5,valign:'middle'});
  });

  band(s,'영업 트랙 · 활동 보고','2','트랙 · 주 단위 보고');
  s.addNotes('두 트랙을 동시에 돌립니다.');
}

/* ══════════ 14 비용 발생 구조 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,14,'조건');
  head(s,'착수금도 월 고정비도 광고비도 청구하지 않습니다');
  lead(s,'청구는 가맹계약이 체결되고 가맹비 입금이 확인된 뒤에만 발생합니다.',false,11);

  const B=BODY();
  const R=G.rows(B,[['tbl',1],['gap',0.22,'fix'],['set',0.72,'fix']]);
  const rows=[
    [{v:'착수금'},'해당 없음',{v:'0 원',b:true,c:MUTE}],
    [{v:'월 고정비'},'해당 없음',{v:'0 원',b:true,c:MUTE}],
    [{v:'광고비'},'가맹 개설 영업 대가로는 청구하지 않습니다 (LSM 집행 기준은 P.15)',{v:'0 원',b:true,c:MUTE}],
    [{v:'성공보수',b:true},'가맹계약 체결 및 가맹비 입금 완료 후',{v:'1,000 만원',b:true,c:GOLD}],
  ];
  table(s,R.tbl,[{h:'항목',w:2.6},{h:'발생 시점',w:R.tbl.w-5.6},{h:'금액',w:3.0,a:'right'}],rows,{fs:13});
  hr(s,R.set.x,R.set.y,R.set.w,NAVY2,0.014);
  const SET=[['청구 시점','가맹계약 체결과 가맹비 입금이 모두 확인된 뒤'],
             ['미계약 건 원가','상담·분석·마케팅 비용 전부 내일사장 부담'],
             ['해제 · 환불 시','본사 정책에 맞춰 착수 전 협의']];
  split(region('set',R.set.x,R.set.y+0.14,R.set.w,R.set.h-0.14),3,0.30).forEach((c,i)=>{
    tx(s,c,{x:c.x,y:c.y,w:c.w,h:0.26},SET[i][0],11.5,{bold:true,color:BLUE,valign:'middle'});
    tx(s,c,{x:c.x,y:c.y+0.28,w:c.w,h:c.h-0.28},SET[i][1],11.5,{valign:'middle'});
    if(i) vr(s,c.x-0.15,c.y,c.h,RULE);
  });

  band(s,'계약 · 입금 완료 전 내일사장에 지급하는 현금','0','원');
  note(s,'※ 성공보수는 부가가치세 별도입니다.');
  s.addNotes('계약 전에는 본사가 내실 돈이 없습니다.');
}

/* ══════════ 15 네고 · LSM · 인테리어 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,15,'조건');
  head(s,'창업자가 깎은 금액은 전액 내일사장 몫에서 차감합니다');
  lead(s,'네고가 어디까지 진행되든 본사 순수취는 500만원 그대로입니다.',false,11);

  const B=BODY(true);
  const R=G.rows(B,[['tbl',1.35],['ok',0.34,'fix'],['lsmL',0.30,'fix'],['lsm',1],['itr',0.34,'fix']]);
  const rows=[
    ['네고 없음',{v:'1,500 만원'},{v:'(1,000)',c:GOLD},{v:'500 만원',b:true}],
    ['네고 발생',{v:'1,500 − 할인액'},{v:'(1,000 − 할인액)',c:GOLD},{v:'500 만원',b:true}],
    ['할인 1,000만원 가정 시',{v:'500 만원'},{v:'0',c:GOLD},{v:'500 만원',b:true}],
  ];
  table(s,R.tbl,[{h:'시나리오',w:4.2},{h:'창업자 납입',w:2.5,a:'right'},
    {h:'내일사장 성공보수',w:2.6,a:'right'},{h:'본사 순수취',w:R.tbl.w-9.3,a:'right'}],rows,{fs:13});

  rect(s,at(R.ok,{x:R.ok.x,y:R.ok.y+0.12,w:0.10,h:0.10},{kind:'mk'}),BLUE);
  tx(s,R.ok,{x:R.ok.x+0.26,y:R.ok.y,w:R.ok.w-0.26,h:R.ok.h},
    '할인 적용 여부와 한도는 건별로 본사 승인 후 확정합니다. 위 표의 1,000만원은 성공보수가 소진되는 지점을 보여 주는 가정값입니다.',
    12,{bold:true,color:BLUE,valign:'middle'});
  slabel(s,R.lsmL,{x:R.lsmL.x,y:R.lsmL.y,w:6,h:0.26},'LSM 광고 집행 기준 · 내일사장 수취 구간',BLUE);

  const LS=[['800만원 이하','본사 집행',MUTE,'본사 정책에 따라 집행하며 내일사장은 청구하지 않습니다'],
            ['800만원 초과 ~ 1,000만원 미만','협의',MUTE,'집행 주체와 금액을 양사 협의로 결정합니다'],
            ['1,000만원 전액 수취','내일사장 집행',BLUE,'수취액 중 200만원을 해당 매장 LSM 광고비로 집행']];
  split(R.lsm,3,0.26).forEach((c,i)=>{
    const [k,who,col,v]=LS[i];
    const inner=card(s,R.lsm,{...c,name:`lsm${i}`},col,0.14);
    tx(s,inner,{x:inner.x,y:inner.y+0.06,w:inner.w,h:0.24},k,11,{bold:true,valign:'middle'});
    tx(s,inner,{x:inner.x,y:inner.y+0.32,w:inner.w,h:0.26},who,12.5,{bold:true,color:col,valign:'middle'});
    tx(s,inner,{x:inner.x,y:inner.y+0.60,w:inner.w,h:inner.h-0.60},v,9.5,{color:MUTE,lineSpacing:12.5});
  });
  rect(s,at(R.itr,{x:R.itr.x,y:R.itr.y+0.12,w:0.10,h:0.10},{kind:'mk'}),NAVY2);
  tx(s,R.itr,{x:R.itr.x+0.26,y:R.itr.y,w:2.6,h:R.itr.h},'인테리어 시공',12,{bold:true,valign:'middle'});
  tx(s,R.itr,{x:R.itr.x+3.0,y:R.itr.y,w:R.itr.w-3.0,h:R.itr.h},
    '내일사장이 직접 진행할 수 있으며, 개설 과정의 추가 수익 분배는 착수 전 별도 협의합니다.',12,{valign:'middle'});

  band(s,'할인 1,000만원까지 · 본사 순수취','500','만원 불변',false,true);
  s.addNotes('네고는 저희 몫에서 부담합니다.');
}

/* ══════════ 16 회수 구조 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,16,'수지');
  head(s,'계약 시점부터 흑자이고, 로열티는 전액 순증입니다');
  lead(s,'가맹비 1,500만원 안에서 성공보수가 정산되므로 본사는 별도 예산을 편성하실 필요가 없습니다.',false,11);

  const B=BODY();
  const L=region('roiL',B.x,B.y,span(0,5).w,B.h);
  const Rr=region('roiR',span(5,7).x,B.y,span(5,7).w,B.h);

  slabel(s,L,{x:L.x,y:L.y,w:3.4,h:0.26},'계약 1건 · 계약 시점',BLUE);
  [['가맹비 (본사 수취)','+1,500',NAVY2],['성공보수 (내일사장)','−1,000',GOLD]].forEach(([k,v,c],i)=>{
    const y=L.y+0.36+i*0.52;
    tx(s,L,{x:L.x,y,w:2.9,h:0.36},k,12.5,{valign:'middle'});
    s.addText([{text:v,options:{fontSize:19,bold:true,color:c}},{text:' 만원',options:{fontSize:11,color:MUTE}}],
      t({...at(L,{x:L.x+2.9,y,w:L.w-2.9,h:0.36},{kind:'fig'}),align:'right',valign:'middle'}));
    hr(s,L.x,y+0.42,L.w,RULE);
  });
  tx(s,L,{x:L.x,y:L.y+1.46,w:2.6,h:0.44},'계약 시점 본사 순수익',13,{bold:true,valign:'middle'});
  s.addText([{text:'+500',options:{fontSize:30,bold:true,color:BLUE}},{text:' 만원',options:{fontSize:11.5,color:MUTE}}],
    t({...at(L,{x:L.x+2.2,y:L.y+1.44,w:L.w-2.2,h:0.48},{kind:'fig'}),align:'right',valign:'middle'}));
  hr(s,L.x,L.y+2.00,L.w,NAVY2,0.014);
  slabel(s,L,{x:L.x,y:L.y+2.16,w:3.4,h:0.26},'성공보수의 성격',BLUE);
  [['1회성','계약 1건에 한 번만 발생합니다'],
   ['가맹비 내 정산','추가 예산 편성이 필요하지 않습니다'],
   ['로열티는 순증','월 150만원은 전액 본사 수익입니다']].forEach(([k,v],i)=>{
    const y=L.y+2.50+i*0.23;
    tx(s,L,{x:L.x,y,w:1.7,h:0.22},k,11,{bold:true,color:MUTE,valign:'middle'});
    tx(s,L,{x:L.x+1.8,y,w:L.w-1.8,h:0.22},v,11,{valign:'middle'});
  });

  slabel(s,Rr,{x:Rr.x,y:Rr.y,w:5.6,h:0.26},'이후 누적 본사 수익 · 월 로열티 150만원 반영',BLUE);
  [['계약 시점',500],['12개월',2300],['24개월',4100],['36개월',5900]].forEach(([k,v],i)=>{
    const y=Rr.y+0.32+i*0.46;
    tx(s,Rr,{x:Rr.x,y,w:1.4,h:0.36},k,12,{bold:true,valign:'middle'});
    rect(s,at(Rr,{x:Rr.x+1.5,y:y+0.08,w:Rr.w-3.5,h:0.20},{kind:'bar'}),TRACK);
    rect(s,at(Rr,{x:Rr.x+1.5,y:y+0.08,w:Math.max(0.08,(Rr.w-3.5)*v/5900),h:0.20},{kind:'bar'}),i===3?BLUE:'9DB8EC');
    s.addText([{text:v.toLocaleString(),options:{fontSize:15,bold:true,color:i===3?BLUE:NAVY2}},
               {text:' 만원',options:{fontSize:10,color:MUTE}}],
      t({...at(Rr,{x:Rr.x+Rr.w-1.9,y,w:1.9,h:0.36},{kind:'fig'}),align:'right',valign:'middle'}));
  });
  hr(s,Rr.x,Rr.y+2.22,Rr.w,RULE);
  slabel(s,Rr,{x:Rr.x,y:Rr.y+2.34,w:3.6,h:0.26},'출점 규모별 36개월 누적',BLUE);
  [['3개점','1억 7,700'],['5개점','2억 9,500']].forEach(([k,v],i)=>{
    const x=Rr.x+(Rr.w/2)*i;
    tx(s,Rr,{x,y:Rr.y+2.64,w:1.4,h:0.22},k,11,{color:MUTE,valign:'middle'});
    s.addText([{text:v,options:{fontSize:18,bold:true,color:NAVY2}},{text:' 만원',options:{fontSize:10,color:MUTE}}],
      t({...at(Rr,{x,y:Rr.y+2.86,w:Rr.w/2-0.3,h:0.32},{kind:'fig'}),valign:'middle'}));
    if(i) vr(s,x-0.20,Rr.y+2.64,0.54,RULE);
  });

  band(s,'10개점 출점 시 · 36개월 누적','5억 9,000','만원',false,true);
  note(s,'※ 러너펍 공개 가맹 안내 기준(가맹비 1,500만원 / 월 로열티 150만원 · 부가세 별도) 시뮬레이션이며 실제 조건은 본사 정책에 따릅니다. 개설 기본비용과 폐점 · 중도해지는 반영하지 않았습니다.');
  s.addNotes('500만원밖에 안 남는다고 보실 수 있는데, 계약 시점에 이미 흑자라는 뜻입니다.');
}

/* ══════════ 17 준법 · 리드귀속 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,17,'통제');
  head(s,'브랜드와 준법 책임은 본사 기준을 그대로 따릅니다');
  lead(s,'정보제공 책임이 본사에 있는 항목은 본사가 직접 수행하시고, 내일사장은 보조 범위 안에서만 움직입니다.',false,11);

  const B=BODY(true);
  const R=G.rows(B,[['tbl',1],['gap',0.18,'fix'],['exp',0.60,'fix']]);
  const cells=split(R.tbl,2,0.44);
  const T=[
    ['준법 운영 기준',[['정보공개서 · 계약서','본사 제공 · 전달과 설명만 보조'],
      ['법정 숙려기간','14일 준수 · 단축 유도 금지'],
      ['예상매출 진술','구두 약속 금지 · 승인 문구만'],
      ['광고 · 상담 스크립트','본사 사전 승인 후 사용'],
      ['위반 확인 시','해당 건 즉시 중단 및 본사 통보']]],
    ['리드 귀속 규칙',[['귀속 기준','최초 유입 경로 기준으로 구분'],
      ['본사 인바운드','본사 문의 · 직영 유입 건은 대상 아님'],
      ['선등록 확인','본사 DB 선등록 시 본사 귀속'],
      ['증빙 방법','ERP 등록 기록으로 확인'],
      ['이견 처리','주 단위 리포트 후 이의제기']]],
  ];
  cells.forEach((c,i)=>{
    slabel(s,c,{x:c.x,y:c.y,w:3.4,h:0.26},T[i][0]);
    const tb=region(c.name+'.t',c.x,c.y+0.32,c.w,c.h-0.32);
    table(s,tb,[{h:'',w:2.15},{h:'',w:tb.w-2.15}],T[i][1],{rh:(tb.h)/5,fs:11.5,header:false});
    if(i) vr(s,c.x-0.22,c.y,c.h,RULE);
  });
  slabel(s,R.exp,{x:R.exp.x,y:R.exp.y+0.10,w:2.4,h:0.26},'업종 경험',BLUE);
  tx(s,R.exp,{x:R.exp.x+2.6,y:R.exp.y,w:R.exp.w-2.6,h:R.exp.h},
    '홀덤 업종 전담 이력은 없습니다. 리브랜딩 트랙은 이미 업을 운영 중인 점주가 대상이고,\n입지 · 손익 · 계약 절차는 업종과 무관합니다. 초기 구간은 파일럿으로 운영하고 건수와 기간은 본사가 정하십니다.',
    11,{lineSpacing:16,valign:'middle'});

  band(s,'준법 · 귀속 판정은 본사 자료 기준 · 활동 리포트 제출','주 1','회');
  s.addNotes('준법과 리드 귀속은 전부 본사 기준입니다.');
}

/* ══════════ 18 클로징 ══════════ */
{
  const s=p.addSlide(); s.background={color:NAVY};
  frame(s,18,'CLOSE',true);
  head(s,'파일럿 구간으로 시작하시면 됩니다',true);
  lead(s,'검증 기간과 판단 지표를 본사가 정하시고, 그 기준으로 첫 구간을 평가하십시오.',true,11);

  const B=BODY(true);
  const R=G.rows(B,[['main',1],['gap',0.22,'fix'],['sig',0.72,'fix']]);
  const L=region('clL',R.main.x,R.main.y,span(0,7).w,R.main.h);
  const Rr=region('clR',span(7,5).x,R.main.y,span(7,5).w,R.main.h);

  slabel(s,L,{x:L.x,y:L.y,w:3.4,h:0.26},'파일럿 운영 기준',MUTED);
  hr(s,L.x,L.y+0.32,L.w,ONINK,0.014);
  const V=[['검증 기간','본사가 정하시는 기간 — 착수 전 별지로 확정'],
           ['목표 건수','본사가 정하시는 목표 — 착수 전 별지로 확정'],
           ['평가 지표','신규 리드 수 · 상담 진행 수 · 가맹계약 체결 건수'],
           ['보고','주 단위 리포트 — 활동 지표와 단계별 파이프라인'],
           ['착수 조건','본사 승인 자료 확정 후 즉시 착수 · 착수금 없음'],
           ['기간 종료 시','연장 또는 종료를 본사가 단독 결정']];
  const VR=G.rows(region('v',L.x,L.y+0.44,L.w,L.h-0.44),
    [['a',1],['b',1],['c',1],['d',1],['e',1],['f',1]]);
  [VR.a,VR.b,VR.c,VR.d,VR.e,VR.f].forEach((r,i)=>{
    tx(s,r,{x:r.x,y:r.y,w:2.2,h:r.h-0.08},V[i][0],11,{color:MUTED,valign:'middle'});
    tx(s,r,{x:r.x+2.3,y:r.y,w:r.w-2.3,h:r.h-0.08},V[i][1],11.5,{color:ONINK,valign:'middle'});
    hr(s,r.x,r.y+r.h-0.06,L.w,RULED);
  });

  slabel(s,Rr,{x:Rr.x,y:Rr.y,w:3,h:0.26},'요약',MUTED);
  hr(s,Rr.x,Rr.y+0.32,Rr.w,ONINK,0.014);
  const SUM=['프랜차이즈 본사 출신 4인이 직접 영업합니다',
             '앱 10만 · 월 5만 명 · 상담 DB 5,114명 위에서 팝니다',
             '계약 전 본사 지출 0원 · 성공보수는 가맹비 안에서 정산',
             '계약 시점 +500만원 · 로열티는 전액 순증'];
  const SR=G.rows(region('sum',Rr.x,Rr.y+0.44,Rr.w,1.62),[['a',1],['b',1],['c',1],['d',1]]);
  [SR.a,SR.b,SR.c,SR.d].forEach((r,i)=>{
    rect(s,at(r,{x:r.x,y:r.y+0.14,w:0.10,h:0.10},{kind:'mk'}),BLUEL);
    tx(s,r,{x:r.x+0.26,y:r.y,w:r.w-0.26,h:r.h-0.04},SUM[i],11.5,{color:ONINK,lineSpacing:16,valign:'middle'});
  });
  s.addImage({path:path.join(A,'logo.png'),
    ...at(Rr,{x:Rr.x,y:Rr.y+2.08,w:1.62,h:0.531},{kind:'img'})});

  hr(s,R.sig.x,R.sig.y,R.sig.w,RULED);
  tx(s,R.sig,{x:R.sig.x,y:R.sig.y+0.10,w:1,h:0.20},'발신',9,{color:MUTED});
  s.addImage({path:path.join(A,'ns_logo_w.png'),
    ...at(R.sig,{x:R.sig.x,y:R.sig.y+0.32,w:1.44,h:0.253},{kind:'img'})});
  let acc=R.sig.x+2.0;
  [['담당',1.9],['연락처',2.0],['이메일',2.3]].forEach(([k,w])=>{
    tx(s,R.sig,{x:acc,y:R.sig.y+0.10,w,h:0.20},k,9,{color:MUTED});
    hr(s,acc,R.sig.y+0.52,w-0.3,MUTED);
    acc+=w;
  });
  tx(s,R.sig,{x:R.sig.x+8.4,y:R.sig.y+0.32,w:R.sig.w-8.4,h:0.24},
    '수신  러너스튜디오(주) 귀중 · 대표 박경관',10.5,{color:ONINK,align:'right',valign:'middle'});
  tx(s,R.sig,{x:R.sig.x+8.4,y:R.sig.y+0.52,w:R.sig.w-8.4,h:0.20},
    '서울 강남구 삼성로100길 12 제이타워 B2',9,{color:MUTED,align:'right'});

  band(s,'검증 기간 종료 시 본사에 남는 비용','0','원',true);
  s.addNotes('파일럿 한 건으로 시작하시면 됩니다.');
}

/* ═══ 저장 + 검사 보고 ═══ */
const OUT='/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v4/runnerpub_v5.pptx';
const rep=G.report('/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v4/layout_report.txt');
console.log(rep.text);
p.writeFile({fileName:OUT}).then(async f=>{
  const fs=require('fs'), JSZip=require(NM+'/jszip');
  const z=await JSZip.loadAsync(fs.readFileSync(f)); let n=0;
  for(const name of Object.keys(z.files)){
    if(!/^ppt\/slides\/slide\d+\.xml$/.test(name)) continue;
    const xml=await z.file(name).async('string');
    const fixed=xml.replace(/<a:ln><\/a:ln>/g,()=>{n++;return '<a:ln><a:noFill/></a:ln>';});
    if(n) z.file(name,fixed);
  }
  fs.writeFileSync(f,await z.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
  console.log('\nWROTE',f);
});
