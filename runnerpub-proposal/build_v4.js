/* 러너펍 가맹 개설 영업 위임 제안 — 내일사장
   전면 재제작 v4 · 내일사장 브랜드 팔레트(#2C68F3 / #1D2C47) 기반 */
const pptxgen = require('/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/node_modules/pptxgenjs');
const path = require('path');
const A = '/home/user/onewillco-meeting-2026/runnerpub-proposal/assets';

const p = new pptxgen();
p.layout = 'LAYOUT_WIDE';                       // 13.333 × 7.5
p.author = '주식회사 내일사장'; p.company = '주식회사 내일사장';
p.title = '러너펍 가맹 개설 영업 위임 제안 — 내일사장';

/* ═══ 팔레트 — 내일사장 로고에서 추출 ═══ */
const NAVY  = '16233D';   // 짙은 네이비 지면
const NAVY2 = '1D2C47';   // 워드마크 네이비 = 밝은 지면의 잉크
const BLUE  = '2C68F3';   // 브랜드 블루(마크)
const BLUED = '1E4FCB';
const BLUEL = '7FA8FF';   // 어두운 지면 위 블루
const PAPER = 'F2F4F8';
const CARD  = 'FFFFFF';
const GOLD  = 'B8862B';   // 금액 전용

const GOLD_L= 'E5B75C';   // 어두운 지면 위 금액
const MUTE  = '6C7891';
const MUTED = '93A0B8';   // 어두운 지면 위 약한 글씨
const RULE  = 'D6DCE7';
const RULED = '2B3A56';
const ONINK = 'F4F6FA';
const F = '맑은 고딕';

/* ═══ 그리드 ═══ */
const W=13.333, H=7.5;
const ML=0.75, RX=12.583, CW=RX-ML;             // 11.833
const TOPRULE=0.80, HEADY=1.06, LEADY=1.86, BODY=2.46;
const BANDY=6.44, FOOTY=7.08;

const t=(o)=>Object.assign({fontFace:F,margin:0},o);
const rect=(s,x,y,w,h,c)=>s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{color:c},line:{type:'none'}});
const hr=(s,x,y,w,c,h)=>rect(s,x,y,w,h||0.009,c);
const vr=(s,x,y,h,c,w)=>rect(s,x,y,w||0.009,h,c);

/* 상·하단 공통 크롬 */
function chrome(s,no,section,dark){
  const rl=dark?RULED:RULE, mu=dark?MUTED:MUTE;
  s.addImage({path:path.join(A,dark?'ns_logo_w.png':'ns_logo.png'),x:ML,y:0.40,w:1.22,h:0.214});
  s.addText(section,t({x:RX-6,y:0.42,w:6,h:0.22,fontSize:10.5,bold:true,
    color:dark?BLUEL:BLUE,align:'right',charSpacing:1.6,valign:'middle'}));
  hr(s,ML,TOPRULE,CW,rl);
  hr(s,ML,7.00,CW,rl);
  s.addText('주식회사 내일사장  →  러너스튜디오(주) 러너펍 가맹본부',
    t({x:ML,y:FOOTY,w:8,h:0.24,fontSize:9,color:mu,valign:'middle'}));
  s.addText(`${String(no).padStart(2,'0')} / 18`,
    t({x:RX-2,y:FOOTY,w:2,h:0.24,fontSize:9.5,bold:true,color:dark?ONINK:NAVY2,align:'right',valign:'middle'}));
}
/* 헤드라인 */
function head(s,txt,dark,size){
  s.addText(txt,t({x:ML,y:HEADY,w:CW,h:0.62,fontSize:size||33,bold:true,
    color:dark?ONINK:NAVY2,charSpacing:-0.6,valign:'middle'}));
}
/* 리드문 */
function lead(s,txt,dark,w,y){
  s.addText(txt,t({x:ML,y:y||LEADY,w:w||CW,h:0.46,fontSize:13.5,
    color:dark?MUTED:MUTE,lineSpacing:21}));
}
/* 하단 결론 밴드 */
function band(s,label,val,unit,dark,money){
  hr(s,ML,BANDY,CW,dark?ONINK:NAVY2,dark?0.020:0.016);
  s.addText(label,t({x:ML,y:BANDY+0.14,w:7.2,h:0.32,fontSize:11.5,
    color:dark?MUTED:MUTE,valign:'middle'}));
  const vc = money ? (dark?GOLD_L:GOLD) : (dark?ONINK:NAVY2);
  s.addText([{text:val,options:{fontSize:30,bold:true,color:vc}},
             {text:unit?'  '+unit:'',options:{fontSize:12.5,bold:true,color:dark?MUTED:MUTE}}],
    t({x:RX-5.6,y:BANDY+0.08,w:5.6,h:0.44,align:'right',valign:'middle'}));
}
/* 각주 */
function foot(s,txt,dark){
  s.addText(txt,t({x:ML,y:6.18,w:CW,h:0.18,fontSize:9,color:dark?MUTED:MUTE}));
}
/* 섹션 소제목 */
function slabel(s,txt,x,y,w,c){
  s.addText(txt,t({x,y,w:w||4,h:0.26,fontSize:10.5,bold:true,color:c||MUTE,charSpacing:1.2,valign:'middle'}));
}
/* 표 */
function table(s,x,y,cols,rows,o={}){
  const fs=o.fs||12, rh=o.rh||0.5, dark=o.dark;
  const tw=cols.reduce((a,c)=>a+c.w,0);
  let cy=y;
  if(o.header!==false){
    hr(s,x,cy,tw,dark?ONINK:NAVY2,0.016); cy+=0.10;
    let cx=x;
    cols.forEach(c=>{s.addText(c.h,t({x:cx,y:cy,w:c.w,h:0.26,fontSize:9.5,bold:true,
      color:dark?MUTED:MUTE,align:c.a||'left',charSpacing:0.8,valign:'middle'})); cx+=c.w;});
    cy+=0.34;
  }
  rows.forEach(r=>{
    hr(s,x,cy,tw,dark?RULED:RULE);
    let cx=x;
    r.forEach((cell,i)=>{
      const c=cols[i], v=(typeof cell==='object')?cell:{v:cell};
      s.addText(v.v,t({x:cx,y:cy+0.06,w:(c.a==='right'?c.w:c.w-0.16),h:rh-0.10,
        fontSize:v.fs||fs,bold:!!v.b,color:v.c||(dark?ONINK:NAVY2),
        align:c.a||'left',valign:'middle',lineSpacing:(v.fs||fs)*1.4}));
      cx+=c.w;
    });
    cy+=rh;
  });
  hr(s,x,cy,tw,dark?RULED:RULE);
  return cy;
}
/* 대형 수치 */
function fig(s,x,y,w,val,unit,label,note,size,dark){
  s.addText([{text:val,options:{fontSize:size||44,bold:true,color:dark?ONINK:NAVY2}},
             {text:unit?' '+unit:'',options:{fontSize:15,bold:true,color:dark?BLUEL:BLUE}}],
    t({x,y,w,h:0.72,valign:'middle'}));
  s.addText(label,t({x,y:y+0.74,w,h:0.28,fontSize:12,bold:true,color:dark?ONINK:NAVY2,valign:'middle'}));
  if(note) s.addText(note,t({x,y:y+1.02,w,h:0.42,fontSize:9.8,color:dark?MUTED:MUTE,lineSpacing:13}));
}
/* 카드 */
function card(s,x,y,w,h,accent){
  rect(s,x,y,w,h,CARD);
  if(accent) rect(s,x,y,w,0.055,accent);
}

/* ══════════ 01 표지 ══════════ */
{
  const s=p.addSlide(); s.background={color:NAVY};
  rect(s,0,0,0.30,H,BLUE);

  s.addImage({path:path.join(A,'ns_logo_w.png'),x:ML,y:0.62,w:1.86,h:0.327});
  s.addText('주식회사 내일사장',t({x:ML,y:1.04,w:5,h:0.26,fontSize:11,color:MUTED,charSpacing:0.6}));

  s.addText('가맹 개설 영업 위임 제안',
    t({x:ML,y:1.98,w:9,h:0.44,fontSize:14,bold:true,color:BLUEL,charSpacing:3.4}));
  hr(s,ML,2.52,2.0,BLUE,0.035);

  s.addText([{text:'가맹을 팔아 온 사람들이',options:{breakLine:true}},
             {text:'러너펍을 팔겠습니다',options:{}}],
    t({x:ML,y:2.86,w:11,h:1.86,fontSize:52,bold:true,color:ONINK,lineSpacing:70,charSpacing:-1.6}));

  s.addText('SPC 파리바게뜨 가맹사업본부 · 이삭토스트 COO · 맥도날드 · 써브웨이 · CJ푸드빌 출신이 만든 창업 플랫폼입니다.\n계약이 체결되고 가맹비 입금이 완료된 건에만 성공보수를 청구합니다.',
    t({x:ML,y:4.92,w:10.4,h:0.78,fontSize:14,color:MUTED,lineSpacing:24}));

  hr(s,ML,5.96,CW,RULED);
  const CV=[['성공보수','가맹계약 1건당 1,000만원 (VAT 별도)'],
            ['청구 조건','계약 체결 및 가맹비 입금 완료 건에 한함'],
            ['영업 트랙','신규 창업자 · 기존 홀덤펍 리브랜딩']];
  CV.forEach(([k,v],i)=>{
    const x=ML+ (CW/3)*i;
    s.addText(k,t({x,y:6.16,w:3.6,h:0.22,fontSize:9.5,color:BLUEL,charSpacing:1.2}));
    s.addText(v,t({x,y:6.40,w:(CW/3)-0.4,h:0.30,fontSize:11.5,bold:true,color:ONINK,valign:'middle'}));
    if(i) vr(s,x-0.30,6.16,0.56,RULED);
  });

  s.addText('수신',t({x:RX-4,y:6.96,w:4,h:0.20,fontSize:9,color:MUTED,align:'right'}));
  s.addText('러너스튜디오(주) 귀중 · 대표 박경관',
    t({x:RX-5,y:7.16,w:5,h:0.24,fontSize:11,bold:true,color:ONINK,align:'right'}));
  s.addText('2026. 07',t({x:ML,y:7.16,w:3,h:0.24,fontSize:11,color:MUTED}));
  s.addNotes('발신은 주식회사 내일사장, 수신은 러너스튜디오입니다. 저희 팀이 가맹사업 본부 출신으로 구성돼 있다는 점부터 말씀드립니다.');
}

/* ══════════ 02 제안 한 장 요약 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,2,'제안 요약');
  head(s,'한 장으로 먼저 말씀드립니다');
  lead(s,'뒤에 자세히 붙이겠습니다만, 본사께서 판단하실 내용은 이 네 가지입니다.',false,10.6);

  const Q=[
    ['01','누가 하는가','프랜차이즈 본부 출신 경영진이 운영하는 창업 플랫폼입니다. 대표는 SPC 파리바게뜨 가맹사업본부와 이삭토스트 COO를 거쳤습니다.','P.05'],
    ['02','무엇으로 하는가','앱 다운로드 10만 건, 월 이용자 5만 명, 예비창업자 DB 5,114명. 이미 모여 있는 창업 수요 위에서 영업합니다.','P.07'],
    ['03','얼마인가','가맹계약 1건당 1,000만원(VAT 별도). 착수금·월 고정비·광고비는 없습니다.','P.14'],
    ['04','본사 부담은','계약 전까지 0원입니다. 성공보수는 가맹비 1,500만원 안에서 정산되어 계약 시점에 본사는 이미 흑자입니다.','P.16'],
  ];
  const bw=(CW-0.66)/2;
  Q.forEach(([n,k,v,ref],i)=>{
    const x=ML+(bw+0.66)*(i%2), y=BODY+Math.floor(i/2)*1.86;
    card(s,x,y,bw,1.60,BLUE);
    s.addText(n,t({x:x+0.34,y:y+0.26,w:0.8,h:0.30,fontSize:12,bold:true,color:BLUE,charSpacing:1.2}));
    s.addText(ref,t({x:x+bw-1.4,y:y+0.26,w:1.06,h:0.30,fontSize:10,bold:true,color:MUTE,align:'right'}));
    s.addText(k,t({x:x+0.34,y:y+0.56,w:bw-0.68,h:0.34,fontSize:17,bold:true,color:NAVY2,valign:'middle'}));
    s.addText(v,t({x:x+0.34,y:y+0.96,w:bw-0.68,h:0.56,fontSize:11.5,color:MUTE,lineSpacing:16.5}));
  });

  band(s,'계약이 성사되기 전까지 본사가 지출하는 금액','0','원');
  s.addNotes('네 가지만 보시면 됩니다. 누가, 무엇으로, 얼마에, 본사 부담은 얼마인가.');
}

/* ══════════ 03 회사 개요 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,3,'회사');
  head(s,'내일부터 내 일이 사장이 되는 플랫폼');
  lead(s,'허위·과장 매물로 창업자가 무너지는 것을 막겠다는 목적으로 만들어진 회사입니다.',false,10.6);

  const rows=[
    [{v:'법인',b:true},'주식회사 내일사장 (NAEILSAJANG Corp.)'],
    [{v:'대표',b:true},'박규태 — 유통학 박사 · 세종사이버대 외식창업프랜차이즈학 겸임교수'],
    [{v:'설립',b:true},'2022년 6월 설립 준비 및 MVP 테스트 → 2023년 1월 법인 설립'],
    [{v:'서비스',b:true},'매장 양도양수 직거래 플랫폼 「내일사장」 (앱 · 웹) 및 프랜차이즈 ERP'],
    [{v:'핵심 기술',b:true},'홈택스(국세청) 데이터 연동 실매출 검증 · 매물인증 기반 부동산중개방법 특허출원 3건'],
    [{v:'수행 업무',b:true},'가맹영업대행 · 창업 마케팅 · 점포개발 및 물건화 · 인테리어 시공'],
  ];
  const e=table(s,ML,BODY,[{h:'구분',w:2.3},{h:'내용',w:CW-2.3}],rows,{rh:0.44});

  slabel(s,'설립 취지',ML,e+0.30,3,BLUE);
  s.addText('양도자를 대변하는 과장된 매출 정보와 무자격 컨설턴트의 허위 매물 브리핑이 창업자를 조기 폐업으로 몰고 있습니다.\n저희는 홈택스 실매출로 검증한 매물만 인증합니다.',
    t({x:ML+2.6,y:e+0.26,w:CW-2.6,h:0.44,fontSize:12,color:NAVY2,lineSpacing:17,valign:'middle'}));

  band(s,'매물인증 기반 부동산중개방법 · 특허출원','3','건');
  s.addNotes('저희는 허위 매물로 창업자가 망하는 걸 막겠다고 만든 회사입니다. 그래서 검증이 본업입니다.');
}

/* ══════════ 04 연혁 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,4,'연혁');
  head(s,'3년 만에 인증·특허·투자를 갖췄습니다');
  lead(s,'2022년 MVP에서 시작해 벤처기업 인증과 기업부설연구소, 시드 투자유치까지 왔습니다.',false,10.6);

  const HIS=[
    ['2022','MVP 테스트','법인 설립 준비 및 앱 MVP 테스트\n매장등록 200건 · 인증매물 1,000건 진행'],
    ['2023','법인 설립','내일사장 1.0 출시 · 벤처기업 인증 · 기업부설연구소 설립\n특허출원 3건 · 데이터바우처 우수기업\nBBQ 등 주요 프랜차이즈 10곳 브랜드인증관 입점\n연매출 2억원 · 앱 다운로드 3만'],
    ['2024','BM 다각화','초기창업패키지 선정 · R&D 디딤돌사업 선정\n서브웨이 등 약 20곳 브랜드인증관 입점\n한국프랜차이즈산업협회 공동사업단 설립\n연매출 4억원 · 앱 다운로드 8만'],
    ['2025','투자 유치','구글 창구 프로그램 선정\nSeed 투자유치 (씨엔티테크 — 스테이션케이 제1호 투자조합)\nSPC · 삼성웰스토리 · 캐시노트 · 다날 업무협약\n상반기 매출 4.6억원 (전년 연매출 초과)'],
  ];
  const cw=CW/4;
  hr(s,ML,BODY,CW,NAVY2,0.016);
  HIS.forEach(([y,k,v],i)=>{
    const x=ML+cw*i;
    rect(s,x,BODY,0.9,0.055,BLUE);
    s.addText(y,t({x,y:BODY+0.22,w:cw-0.4,h:0.52,fontSize:30,bold:true,color:BLUE,charSpacing:-0.8,valign:'middle'}));
    s.addText(k,t({x,y:BODY+0.78,w:cw-0.4,h:0.30,fontSize:14,bold:true,color:NAVY2,valign:'middle'}));
    s.addText(v,t({x,y:BODY+1.16,w:cw-0.45,h:1.70,fontSize:10.8,color:MUTE,lineSpacing:16,valign:'top'}));
    if(i) vr(s,x-0.20,BODY+0.22,2.62,RULE);
  });
  hr(s,ML,BODY+2.96,CW,RULE);

  slabel(s,'수상 · 선정',ML,BODY+3.16,3);
  s.addText('공간융합 빅데이터 창업경진대회 최우수 (국토정보공사)  ·  경기도 우수스타트업 경진 우수 (경기과학진흥원)  ·  2023 데이터바우처 우수기업',
    t({x:ML+2.6,y:BODY+3.12,w:CW-2.6,h:0.34,fontSize:11.5,color:NAVY2,valign:'middle'}));

  band(s,'매출 추이 · 2023년 1.9억 → 2024년 4억 → 2025년 상반기','4.6','억원',false,true);
  foot(s,'※ 2025년 상반기 매출은 2025.06 기준으로, 반기에 전년도 연매출을 넘어섰습니다.');
  s.addNotes('3년 동안 인증, 특허, 정부 사업, 투자를 차례로 받았습니다. 매출은 매년 두 배 가까이 늘고 있습니다.');
}

/* ══════════ 05 팀 (핵심) ══════════ */
{
  const s=p.addSlide(); s.background={color:NAVY};
  chrome(s,5,'팀',true);
  head(s,'"가맹을 팔아 보셨습니까"에 대한 답입니다',true);
  lead(s,'저희 경영진은 프랜차이즈 가맹사업 본부에서 실제로 가맹점을 열어 온 사람들입니다.',true,10.6);

  const TEAM=[
    ['박규태','대표이사','유통학 박사 · 현 세종사이버대 외식창업프랜차이즈학 겸임교수\n전 SPC 파리바게뜨 가맹사업본부 · 전 이삭토스트 총괄사업부장(COO)\n전 중앙그룹 외식부문 신사업 팀장',true],
    ['김우곤','COO','유통학 박사 · 세종대학교 유통학과 겸임교수\n전 McDonald’s · Subway International B.V · Delivery Hero Korea\nCJ푸드빌 · SPC 외 15년',true],
    ['천영식','CMO','프랜차이즈 경영학 석사 · 창업마케팅 저서 다수\n전 한촌 · 육수당 마케팅본부장\n전 죠스떡볶이 · 바르다김선생 마케팅팀장',false],
    ['장수형','CTO','LG하우시스 · 아리따움 몰 · 농협 올인원뱅크 앱 외 다수 개발 · 운영\n플랫폼 개발 전문회사 유니위즈 운영',false],
    ['엄태관','운영 팀장','프랜차이즈 경영학 석사 · 현 학점은행 기관운영교수\n전 아딸 가맹사업본부 · 전 이삭토스트 영업파트장\n전 셀렉토커피 영업팀장',true],
    ['김재현','기획 팀장','외식경영학 박사 · 전 국립대 겸임교수\n전 창업플랫폼 서비스기획 팀장',false],
    ['김호병','팀장','공인중개사 · 브랜드 개설 및 영업\n전 창업컨설팅 경력 5년 이상',false],
  ];
  const bw=(CW-0.70)/2, rh=0.95;
  TEAM.forEach(([nm,pos,car,fr],i)=>{
    const x=ML+(bw+0.70)*(i%2), y=BODY+Math.floor(i/2)*rh;
    hr(s,x,y,bw,RULED);
    s.addText(nm,t({x,y:y+0.14,w:1.4,h:0.30,fontSize:16,bold:true,color:ONINK,valign:'middle'}));
    s.addText(pos,t({x,y:y+0.46,w:1.4,h:0.24,fontSize:10.5,bold:true,color:fr?BLUEL:MUTED,valign:'middle'}));
    s.addText(car,t({x:x+1.52,y:y+0.12,w:bw-1.52,h:0.72,fontSize:10.2,color:MUTED,lineSpacing:14.5}));
  });
  hr(s,ML,BODY+rh*3,bw,RULED);
  const lx=ML+(bw+0.70);
  hr(s,lx,BODY+rh*3,bw,RULED);
  s.addText('■  프랜차이즈 본부에서 가맹 개설을 직접 해 본 인원이 7인 중 4인입니다.\n     러너펍 영업은 이 네 사람이 직접 맡습니다.',
    t({x:lx,y:BODY+rh*3+0.16,w:bw,h:0.62,fontSize:11.5,bold:true,color:BLUEL,lineSpacing:18}));

  band(s,'프랜차이즈 본사 출신 · 경영진 및 팀장 7인 중','4','인',true);
  s.addNotes('본사에서 가장 먼저 물으실 질문이 이겁니다. 저희 대표는 파리바게뜨 가맹사업본부와 이삭토스트 COO 출신이고, 영업팀장은 아딸 가맹사업본부와 셀렉토커피 영업팀장 출신입니다.');
}

/* ══════════ 06 인증 · 자격 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,6,'자격');
  head(s,'말이 아니라 등록된 자격으로 증명합니다');
  lead(s,'가맹 개설 영업은 법이 관여하는 영역입니다. 검증된 사업자만 맡을 수 있어야 한다고 생각합니다.',false,10.6);

  const C=[
    ['벤처기업 인증','2023년 취득'],
    ['기업부설연구소','2023년 설립'],
    ['특허출원 3건','매물인증 기반 부동산중개방법'],
    ['초기창업패키지','2024 선정'],
    ['R&D 디딤돌사업','2024 선정'],
    ['구글 창구 프로그램','2025 선정'],
    ['Seed 투자유치','씨엔티테크 — 스테이션케이 제1호 투자조합'],
    ['한국프랜차이즈산업협회','공동사업단 공동설립 (인증매장 · 위생교육)'],
  ];
  const cw=(CW-0.60)/4, ch=1.24;
  C.forEach(([k,v],i)=>{
    const x=ML+(cw+0.20)*(i%4), y=BODY+Math.floor(i/4)*(ch+0.24);
    card(s,x,y,cw,ch,BLUE);
    s.addText(k,t({x:x+0.26,y:y+0.30,w:cw-0.52,h:0.44,fontSize:13.5,bold:true,color:NAVY2,lineSpacing:19}));
    s.addText(v,t({x:x+0.26,y:y+0.78,w:cw-0.52,h:0.36,fontSize:10.2,color:MUTE,lineSpacing:13.5}));
  });

  slabel(s,'준법 운영',ML,BODY+2.88,3);
  s.addText('정보공개서 제공 후 가맹사업법 제7조 법정 숙려기간 14일이 지나기 전에는 시스템에서 전자계약 버튼이 잠깁니다. 사람이 달력을 세지 않습니다.',
    t({x:ML+2.6,y:BODY+2.84,w:CW-2.6,h:0.40,fontSize:12,color:NAVY2,lineSpacing:17,valign:'middle'}));

  band(s,'법정 숙려기간 · 시스템이 자동으로 잠그는 기간','14','일');
  s.addNotes('가맹사업법 위반은 본사 리스크입니다. 저희는 숙려기간을 시스템으로 강제합니다.');
}

/* ══════════ 07 플랫폼 실적 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,7,'실적');
  head(s,'창업 수요를 새로 만드실 필요가 없습니다');
  lead(s,'아래 모수는 이번 제안 이전에 이미 확보돼 있습니다. 러너펍은 모객 비용과 시간을 지불하지 않아도 됩니다.',false,10.8);

  const S=[
    ['100,000','건 +','앱 누적 다운로드','창업·양수 수요가 상주하는 채널'],
    ['50,000','명 +','월간 활성 이용자','MAU 기준'],
    ['5,114','명','예비창업자 상담 DB','자금·지역·업종 조건까지 확보'],
    ['1,600','억원 +','누적 매물 거래 규모','플랫폼 누적 기준'],
    ['10,000','건 +','누적 매물 등록','점포·상가 데이터베이스'],
    ['2,000','건 +','누적 거래 성사','등록 → 상담 → 검증 → 계약'],
  ];
  hr(s,ML,BODY,CW,NAVY2,0.016);
  const cw=CW/3;
  S.forEach(([v,u,k,n],i)=>{
    const x=ML+cw*(i%3), y=BODY+0.24+Math.floor(i/3)*1.60;
    fig(s,x,y,cw-0.45,v,u,k,n,40);
    if(i%3) vr(s,x-0.22,y-0.06,1.50,RULE);
  });
  hr(s,ML,BODY+1.52,CW,RULE);
  hr(s,ML,BODY+3.12,CW,RULE);

  slabel(s,'인증 서비스 효과',ML,BODY+3.30,3,BLUE);
  const EF=[['자영업자 1년 생존률','67 %','99 %'],['양도양수 성공 비율','47 %','80 %']];
  EF.forEach(([k,a,b],i)=>{
    const x=ML+3.0+i*4.4;
    s.addText(k,t({x,y:BODY+3.28,w:2.4,h:0.30,fontSize:11,color:MUTE,valign:'middle'}));
    s.addText([{text:a,options:{fontSize:13,color:MUTE}},
               {text:'  →  ',options:{fontSize:11,color:MUTE}},
               {text:b,options:{fontSize:19,bold:true,color:BLUE}}],
      t({x:x+2.4,y:BODY+3.22,w:1.9,h:0.40,valign:'middle'}));
  });

  band(s,'모수 확보를 위해 본사가 쓰실 시간과 비용','0','원');
  foot(s,'※ 플랫폼 지표는 내일사장 누적 기준(2026.07)이며, 생존률·성공비율은 내일사장 인증 서비스 이용 건 기준 자체 집계값입니다.');
  s.addNotes('앱 10만, 월 5만 명, 상담 DB 5,114명. 러너펍에 맞는 사람을 이 안에서 찾습니다.');
}

/* ══════════ 08 제휴 네트워크 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,8,'네트워크');
  head(s,'업계 안에서 이미 자리를 잡고 있습니다');
  lead(s,'저희가 만든 트래픽만 쓰는 것이 아니라, 협회와 대기업 플랫폼을 통해 창업 수요를 받습니다.',false,10.8);

  const N=[
    ['한국프랜차이즈산업협회','공동사업단 공동설립','1,400여 개 프랜차이즈 본사를 대상으로 인증매장·위생교육 사업을 협회와 공동 수행합니다'],
    ['SPC','플랫폼 개발 참여','파리바게뜨·배스킨라빈스·던킨·파스쿠찌 등 가맹점 6,000개를 포함한 그룹사 협업 관계'],
    ['삼성웰스토리','365솔루션 사업단 공동설립','웰스토리 고객사에 브랜드인증관 입점·광고를 제공하고 프랜차이즈 고객사를 자문합니다'],
    ['바로고','든든상점 제휴','18만 등록매장이 사용하는 프로그램에 상호 배너·푸시를 노출합니다'],
    ['요기요','플랫폼 배너 · 콘텐츠','요기요 플랫폼에 내일사장 제작 콘텐츠를 노출합니다'],
    ['포브스코리아','프랜차이즈 어워즈 주관','중앙일보 주최 어워즈를 내일사장이 주관합니다'],
  ];
  const bw=(CW-0.5)/2;
  N.forEach(([k,r,v],i)=>{
    const x=ML+(bw+0.5)*(i%2), y=BODY+Math.floor(i/2)*1.14;
    hr(s,x,y,bw,i<2?BLUE:RULE,i<2?0.030:0.009);
    s.addText(k,t({x,y:y+0.16,w:bw*0.56,h:0.32,fontSize:15,bold:true,color:NAVY2,valign:'middle'}));
    s.addText(r,t({x:x+bw*0.56,y:y+0.18,w:bw*0.44,h:0.28,fontSize:10,bold:true,color:BLUE,align:'right',valign:'middle'}));
    s.addText(v,t({x,y:y+0.52,w:bw-0.2,h:0.56,fontSize:11,color:MUTE,lineSpacing:16}));
  });

  slabel(s,'브랜드인증관 입점',ML,BODY+3.52,3.4,BLUE);
  s.addText('BBQ · 서브웨이 · 공차 · 한촌 · 오비맥주 · 삼립 · 육수당 · 북창동순두부 · 호호반점 · 오레노카츠 등',
    t({x:ML+2.9,y:BODY+3.48,w:CW-2.9,h:0.34,fontSize:11.5,color:NAVY2,valign:'middle'}));

  band(s,'B2B 제휴 브랜드 · 파트너','80','개 +');
  s.addNotes('협회, SPC, 삼성웰스토리, 바로고, 요기요까지 붙어 있습니다. 러너펍도 이 망 위에 올라갑니다.');
}

/* ══════════ 09 3대 업무 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,9,'업무');
  head(s,'가맹영업 · 마케팅 · 점포개발을 한 회사가 합니다');
  lead(s,'세 가지를 따로 발주하실 필요가 없습니다. 브랜드 본사가 하는 일을 그대로 대행합니다.',false,10.8);

  const J=[
    ['01','가맹영업대행',BLUE,
     ['예비창업자 모객과 1차 상담','조건별 등급 분류 (추진 · 관리 · 보류)','자금 · 지역 · 업종 조건에 맞춘 브랜드 매칭','정보공개서 제공부터 계약 체결까지 절차 관리']],
    ['02','창업 마케팅',BLUE,
     ['블로그 · 네이버 플레이스 · 검색광고 · SNS','창업박람회 부스 · 사업설명회 운영','신규 매장 오픈 행사 및 지역 홍보','브랜드별 소구점 A/B 테스트']],
    ['03','점포개발 · 물건화',BLUE,
     ['부동산 · 임장으로 후보 점포 발굴','보증금 · 권리금 · 월세 · 평수 수집','실측 · 현장사진 · 인테리어 견적 산출','즉시 브리핑 가능한 상태로 완성']],
  ];
  const cw=(CW-0.6)/3;
  J.forEach(([n,k,c,li],i)=>{
    const x=ML+(cw+0.3)*i;
    hr(s,x,BODY,cw,c,0.038);
    s.addText(n,t({x,y:BODY+0.20,w:1,h:0.28,fontSize:11,bold:true,color:c,charSpacing:1.4}));
    s.addText(k,t({x,y:BODY+0.50,w:cw,h:0.40,fontSize:19,bold:true,color:NAVY2,valign:'middle'}));
    li.forEach((v,j)=>{
      const y=BODY+1.02+j*0.56;
      rect(s,x,y+0.13,0.10,0.10,c);
      s.addText(v,t({x:x+0.26,y,w:cw-0.32,h:0.50,fontSize:11.5,color:NAVY2,lineSpacing:16.5,valign:'middle'}));
    });
    if(i) vr(s,x-0.15,BODY+0.20,3.10,RULE);
  });

  hr(s,ML,BODY+3.36,CW,RULE);
  slabel(s,'추가 수행',ML,BODY+3.54,3,BLUE);
  s.addText('인테리어 시공 — 「내일사장인테리어」 명의로 공사주관 및 도급계약을 실제 수행하고 있습니다 (오레노카츠 장승배기점 등)',
    t({x:ML+2.6,y:BODY+3.50,w:CW-2.6,h:0.34,fontSize:12,color:NAVY2,valign:'middle'}));

  band(s,'가맹 개설에 필요한 실무 · 한 회사에서','3','대 업무 일괄');
  s.addNotes('가맹영업, 마케팅, 점포개발을 한 회사가 다 합니다. 본사는 세 군데와 계약하실 필요가 없습니다.');
}

/* ══════════ 10 보유 도구 ══════════ */
{
  const s=p.addSlide(); s.background={color:NAVY};
  chrome(s,10,'도구',true);
  head(s,'말로 파는 게 아니라 자료로 팝니다',true);
  lead(s,'창업자가 결정을 미루는 자리마다 근거 문서를 내놓습니다. 아래는 이미 운영 중인 도구입니다.',true,10.8);

  const T=[
    ['홈택스 데이터 연동','국세청 신고자료를 연동해 매장 실매출을 검증합니다. 이미 운영 중입니다'],
    ['수익분석표 계산기','재료비·인건비·로열티를 넣으면 세전수익이 즉시 산출됩니다. 면책 고지가 자동 표기됩니다'],
    ['상권분석 · 목표매출 보고서','유동인구·배후세대·경쟁점을 담아 미팅용 PDF로 출력합니다'],
    ['거리제한 선긋기 지도','영업지역을 도로·블록 경계를 따라 그립니다. 기존 매장과 충돌하면 경고하고, 가맹계약서에 첨부됩니다'],
    ['정보공개서 발송 · D-day','발송·수령확인이 기록되고 숙려기간 14일이 자동 카운트됩니다'],
    ['인력 세팅 계산기','매출 규모를 넣으면 권장 인력과 인건비가 주간 시간표로 나옵니다'],
  ];
  const bw=(CW-0.7)/2;
  T.forEach(([k,v],i)=>{
    const x=ML+(bw+0.7)*(i%2), y=BODY+Math.floor(i/2)*1.16;
    hr(s,x,y,bw,RULED);
    s.addText(k,t({x,y:y+0.18,w:bw,h:0.34,fontSize:15,bold:true,color:ONINK,valign:'middle'}));
    s.addText(v,t({x,y:y+0.56,w:bw-0.2,h:0.58,fontSize:11,color:MUTED,lineSpacing:16}));
  });
  hr(s,ML,BODY+3.18,CW,RULED);

  s.addText('이 도구는 러너펍 상담에 그대로 투입됩니다. 창업자에게 감이 아니라 숫자를 드립니다.',
    t({x:ML,y:BODY+3.50,w:CW,h:0.34,fontSize:12.5,bold:true,color:BLUEL,valign:'middle'}));

  band(s,'상담·검증·계약 단계별 자체 운영 도구','6','종',true);
  s.addNotes('창업자가 결정을 미루는 이유는 근거가 없어서입니다. 저희는 근거를 문서로 만들어 냅니다.');
}

/* ══════════ 11 러너펍 진단 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,11,'진단');
  head(s,'남은 변수는 창업자 접점 하나입니다');
  lead(s,'개설 이후를 받쳐 주는 구조는 본사가 이미 갖추셨습니다. 저희가 맡을 구간은 그 앞단입니다.',false,10.8);

  slabel(s,'러너펍이 이미 갖춘 것',ML,BODY,4.4);
  hr(s,ML,BODY+0.30,6.6,NAVY2,0.014);
  const L=['러너러너 앱 — 예약 · 회원관리 · 정산 · 토너먼트 · 핸디랭킹 · 음료주문',
           '본사가 검증한 점포를 추천하는 체계',
           '불법 요소를 배제하는 준법 운영 기준',
           '가맹 절차 9단계 · 계약에서 오픈까지 4~6주',
           '래빗 페스티벌 · 시즌 랭킹전 · 매장 간 콜라보',
           '앱 리뉴얼 후 플랫폼 서비스 이용자 1.5배 증가'];
  L.forEach((v,i)=>{
    const y=BODY+0.46+i*0.54;
    s.addText(v,t({x:ML,y,w:6.5,h:0.38,fontSize:12,color:NAVY2,valign:'middle'}));
    hr(s,ML,y+0.44,6.6,RULE);
  });

  const rx=ML+7.2, rw=CW-7.2;
  slabel(s,'아직 비어 있는 것',rx,BODY,4,BLUE);
  hr(s,rx,BODY+0.30,rw,BLUE,0.030);
  s.addText('계약 가능한\n창업자 모수',t({x:rx,y:BODY+0.52,w:rw,h:0.90,fontSize:24,bold:true,color:NAVY2,lineSpacing:34}));
  s.addText('출점 속도를 결정하는 것은 계약 이전 구간의 접점 총량입니다.\n러너펍이 아직 갖지 못한 것은 이 하나뿐입니다.',
    t({x:rx,y:BODY+1.54,w:rw,h:0.70,fontSize:11.5,color:MUTE,lineSpacing:17}));
  rect(s,rx,BODY+2.36,rw,0.86,CARD);
  s.addText('내일사장이 담당하는 구간이\n정확히 여기입니다',
    t({x:rx+0.28,y:BODY+2.48,w:rw-0.56,h:0.62,fontSize:13,bold:true,color:BLUE,lineSpacing:19}));
  s.addText('두 경로 모두 계약 이전 구간의 상담·분석 비용은 내일사장이 부담합니다.',
    t({x:rx,y:BODY+3.36,w:rw,h:0.44,fontSize:10.8,color:MUTE,lineSpacing:15}));

  band(s,'남은 변수 · 창업자 접점','1','개');
  foot(s,'※ 러너러너 앱 운영사는 (주)러너소프트로 러너스튜디오(주)와 별개 법인입니다. 이용자 1.5배 증가는 IT비즈뉴스 2024.7.4 보도 기준.');
  s.addNotes('러너펍은 개설 이후 구조가 완비돼 있습니다. 남은 건 창업자 접점이고, 그게 저희 구간입니다.');
}

/* ══════════ 12 위임 업무 범위 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,12,'업무 범위');
  head(s,'본사는 승인만, 실무 전 과정은 저희가 맡습니다');
  lead(s,'영업 조직 운영부터 계약 주선, 점포개발까지 개설에 필요한 실무를 하나로 묶어 수행합니다.',false,10.8);

  const rows=[
    [{v:'영업 조직 운영',b:true},'가맹영업팀을 운영하고 신규 창업자와 기존 홀덤펍 두 트랙으로 영업합니다'],
    [{v:'창업 마케팅',b:true},'예비창업자 리드 확보를 위한 가맹 창업마케팅을 집행합니다'],
    [{v:'창업 상담 · 브리핑',b:true},'상권·손익 자료를 만들어 러너펍 조건에 맞춰 창업자의 결정을 마무리합니다'],
    [{v:'점포개발 · 물건화',b:true},'후보지를 발굴하고 실측·견적까지 끝내 즉시 브리핑 가능한 상태로 만듭니다'],
    [{v:'계약 주선',b:true},'가맹계약 체결까지 조건 협의와 클로징을 지원합니다'],
    [{v:'본사 유입 건',b:true},'본사 문의·본사 직영 영업 유입 건은 성공보수 대상이 아니며, 요청하시면 응대만 지원합니다'],
    [{v:'본사가 하실 일',b:true,c:BLUE},{v:'브랜드 자료 승인 · 가맹계약 체결 · 개설 승인 — 그 앞단의 발굴·상담·설득·클로징은 전부 내일사장이 맡습니다',b:true,c:BLUE}],
  ];
  const e=table(s,ML,BODY,[{h:'업무',w:3.4},{h:'수행 내용',w:CW-3.4}],rows,{rh:0.38});

  slabel(s,'위임 조건 결정권',ML,e+0.30,3.4,BLUE);
  s.addText('① 전속 · 비전속   ② 대상 지역   ③ 위임 기간   ④ 직영 · 타 대행사 병행 여부\n이 네 가지는 본사가 정해 주시면 그대로 따릅니다.',
    t({x:ML+3.5,y:e+0.24,w:CW-3.5,h:0.46,fontSize:11.5,color:NAVY2,lineSpacing:16,valign:'middle'}));

  band(s,'위임 시 본사가 추가로 채용해야 할 영업 인력','0','명');
  s.addNotes('본사는 승인만 하시면 됩니다. 전속 여부와 지역, 기간은 본사가 정하시는 대로 따릅니다.');
}

/* ══════════ 13 영업 2트랙 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,13,'실행');
  head(s,'신규 창업자와 기존 홀덤펍, 두 트랙을 동시에 엽니다');
  lead(s,'신규 수요만 기다리지 않습니다. 이미 운영 중인 점주를 전환시키는 경로를 함께 가동합니다.',false,10.8);

  const TR=[
    ['TRACK A','신규 창업자',BLUE,
     [['접점','플랫폼에 상주하는 창업 수요 · 상담 DB 5,114명'],
      ['절차','상권 · 손익 브리핑 → 계약'],
      ['특성','모수 기반 · 검토 기간 필요'],
      ['소구점','현재 프로모션 기준 개설 기본비용 전액 할인 · 4~6주 오픈']]],
    ['TRACK B','기존 홀덤펍 리브랜딩',NAVY2,
     [['접점','즉시 전환 대상 점주'],
      ['절차','전환 상담 → 계약'],
      ['특성','즉시 전환형 · 검토 기간 짧음'],
      ['소구점','러너펍 브랜드 전환 · 예약 · 회원관리 체계 승계']]],
  ];
  const bw=(CW-0.6)/2;
  TR.forEach(([tag,nm,c,rows],i)=>{
    const x=ML+(bw+0.6)*i;
    hr(s,x,BODY,bw,c,0.038);
    s.addText(tag,t({x,y:BODY+0.20,w:bw,h:0.28,fontSize:10.5,bold:true,color:c,charSpacing:1.8}));
    s.addText(nm,t({x,y:BODY+0.50,w:bw,h:0.44,fontSize:21,bold:true,color:NAVY2,valign:'middle'}));
    rows.forEach(([k,v],j)=>{
      const y=BODY+1.06+j*0.58;
      s.addText(k,t({x,y,w:1.3,h:0.40,fontSize:10.5,color:MUTE,valign:'middle'}));
      s.addText(v,t({x:x+1.4,y,w:bw-1.4,h:0.40,fontSize:12,color:NAVY2,valign:'middle',lineSpacing:16}));
      hr(s,x,y+0.52,bw,RULE);
    });
    if(i) vr(s,x-0.30,BODY+0.20,3.16,RULE);
  });

  slabel(s,'공통 운영 약속',ML,BODY+3.40,3,BLUE);
  const PR=['본사 승인 자료만 사용','러너펍 준법 운영 기준 준수','리드 최초 유입 경로 기준 구분','주 단위 활동 리포트 제출'];
  PR.forEach((v,i)=>{
    const x=ML+2.9+(CW-2.9)/4*i;
    rect(s,x,BODY+3.46,0.10,0.10,BLUE);
    s.addText(v,t({x:x+0.24,y:BODY+3.36,w:(CW-2.9)/4-0.34,h:0.44,fontSize:10.8,color:NAVY2,lineSpacing:15}));
  });

  band(s,'영업 트랙 · 활동 보고','2','트랙 · 주 단위 보고');
  s.addNotes('두 트랙을 동시에 돌립니다. 리브랜딩은 이미 운영 중인 점주라 결정이 빠릅니다.');
}

/* ══════════ 14 비용 발생 구조 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,14,'조건');
  head(s,'착수금도 월 고정비도 광고비도 청구하지 않습니다');
  lead(s,'청구는 가맹계약이 체결되고 가맹비 입금이 확인된 뒤에만 발생합니다.',false,10.8);

  const rows=[
    [{v:'착수금'},'해당 없음',{v:'0 원',b:true,c:MUTE}],
    [{v:'월 고정비'},'해당 없음',{v:'0 원',b:true,c:MUTE}],
    [{v:'광고비'},'가맹 개설 영업 대가로는 청구하지 않습니다 (LSM 집행 기준은 P.15)',{v:'0 원',b:true,c:MUTE}],
    [{v:'성공보수',b:true},'가맹계약 체결 및 가맹비 입금 완료 후',{v:'1,000 만원',b:true,c:GOLD}],
  ];
  const e=table(s,ML,BODY,[{h:'항목',w:2.6},{h:'발생 시점',w:CW-5.6},{h:'금액',w:3.0,a:'right'}],rows,{rh:0.50,fs:13});

  hr(s,ML,e+0.32,CW,NAVY2,0.014);
  const R=[['청구 시점','가맹계약 체결과 가맹비 입금이 모두 확인된 뒤'],
           ['미계약 건 원가','상담·분석·마케팅 비용 전부 내일사장 부담'],
           ['해제 · 환불 시','본사 정책에 맞춰 착수 전 협의']];
  const rw3=CW/3;
  R.forEach(([k,v],i)=>{
    const x=ML+rw3*i, y=e+0.52;
    s.addText(k,t({x,y,w:rw3-0.4,h:0.26,fontSize:11.5,bold:true,color:BLUE,valign:'middle'}));
    s.addText(v,t({x,y:y+0.28,w:rw3-0.4,h:0.30,fontSize:11.5,color:NAVY2,valign:'middle'}));
    if(i) vr(s,x-0.20,y,0.56,RULE);
  });

  band(s,'계약 · 입금 완료 전 내일사장에 지급하는 현금','0','원');
  foot(s,'※ 성공보수는 부가가치세 별도입니다.');
  s.addNotes('계약 전에는 본사가 내실 돈이 없습니다.');
}

/* ══════════ 15 네고 · LSM · 인테리어 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,15,'조건');
  head(s,'창업자가 깎은 금액은 전액 내일사장 몫에서 차감합니다');
  lead(s,'네고가 어디까지 진행되든 본사 순수취는 500만원 그대로입니다.',false,10.8);

  const rows=[
    ['네고 없음',{v:'1,500 만원'},{v:'(1,000)',c:GOLD},{v:'500 만원',b:true}],
    ['네고 발생',{v:'1,500 − 할인액'},{v:'(1,000 − 할인액)',c:GOLD},{v:'500 만원',b:true}],
    ['할인 1,000만원 가정 시',{v:'500 만원'},{v:'0',c:GOLD},{v:'500 만원',b:true}],
  ];
  const e=table(s,ML,BODY,[{h:'시나리오',w:4.2},{h:'창업자 납입',w:2.5,a:'right'},
    {h:'내일사장 성공보수',w:2.6,a:'right'},{h:'본사 순수취',w:CW-9.3,a:'right'}],rows,{rh:0.46,fs:13});

  rect(s,ML,e+0.26,0.10,0.10,BLUE);
  s.addText('할인 적용 여부와 한도는 건별로 본사 승인 후 확정합니다. 위 표의 1,000만원은 성공보수가 소진되는 지점을 보여 주는 가정값입니다.',
    t({x:ML+0.28,y:e+0.16,w:CW-0.28,h:0.32,fontSize:12,bold:true,color:BLUE,valign:'middle'}));

  slabel(s,'LSM 광고 집행 기준 · 내일사장 수취 구간',ML,e+0.62,5.4,BLUE);
  const LS=[['800만원 이하','본사 집행',MUTE,'본사 정책에 따라 집행하며\n내일사장은 청구하지 않습니다'],
            ['800만원 초과 ~ 1,000만원 미만','협의',MUTE,'집행 주체와 금액을\n양사 협의로 결정합니다'],
            ['1,000만원 전액 수취','내일사장 집행',BLUE,'수취액 중 200만원을 해당 매장\nLSM 광고비로 집행합니다']];
  const cw2=(CW-0.5)/3;
  LS.forEach(([k,who,c,v],i)=>{
    const x=ML+(cw2+0.25)*i, y=e+0.86;
    card(s,x,y,cw2,0.88,c);
    s.addText(k,t({x:x+0.22,y:y+0.14,w:cw2-0.44,h:0.24,fontSize:11,bold:true,color:NAVY2,valign:'middle'}));
    s.addText(who,t({x:x+0.22,y:y+0.38,w:cw2-0.44,h:0.24,fontSize:12.5,bold:true,color:c,valign:'middle'}));
    s.addText(v,t({x:x+0.22,y:y+0.60,w:cw2-0.44,h:0.28,fontSize:9.5,color:MUTE,lineSpacing:12.5}));
  });

  rect(s,ML,e+1.94,0.10,0.10,NAVY2);
  s.addText('인테리어 시공',t({x:ML+0.28,y:e+1.84,w:2.6,h:0.30,fontSize:12,bold:true,color:NAVY2,valign:'middle'}));
  s.addText('내일사장이 직접 진행할 수 있으며, 개설 과정의 추가 수익 분배는 착수 전 별도 협의합니다.',
    t({x:ML+3.0,y:e+1.84,w:CW-3.0,h:0.30,fontSize:12,color:NAVY2,valign:'middle'}));

  band(s,'할인 1,000만원까지 · 본사 순수취','500','만원 불변',false,true);
  s.addNotes('네고는 저희 몫에서 부담합니다. 본사 순수취는 그대로입니다.');
}

/* ══════════ 16 회수 구조 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,16,'수지');
  head(s,'계약 시점부터 흑자이고, 로열티는 전액 순증입니다');
  lead(s,'가맹비 1,500만원 안에서 성공보수가 정산되므로 본사는 별도 예산을 편성하실 필요가 없습니다.',false,10.8);

  const lw=4.9;
  slabel(s,'계약 1건 · 계약 시점',ML,BODY,3.4,BLUE);
  const calc=[['가맹비 (본사 수취)','+1,500',NAVY2],['성공보수 (내일사장)','−1,000',GOLD]];
  calc.forEach(([k,v,c],i)=>{
    const y=BODY+0.34+i*0.52;
    s.addText(k,t({x:ML,y,w:3.0,h:0.38,fontSize:12.5,color:NAVY2,valign:'middle'}));
    s.addText([{text:v,options:{fontSize:19,bold:true,color:c}},{text:' 만원',options:{fontSize:11,color:MUTE}}],
      t({x:ML+2.9,y,w:lw-2.9,h:0.38,align:'right',valign:'middle'}));
    hr(s,ML,y+0.42,lw,RULE);
  });
  s.addText('계약 시점 본사 순수익',t({x:ML,y:BODY+1.46,w:3.0,h:0.46,fontSize:13,bold:true,color:NAVY2,valign:'middle'}));
  s.addText([{text:'+500',options:{fontSize:30,bold:true,color:BLUE}},{text:' 만원',options:{fontSize:11.5,color:MUTE}}],
    t({x:ML+2.4,y:BODY+1.42,w:lw-2.4,h:0.52,align:'right',valign:'middle'}));
  hr(s,ML,BODY+2.02,lw,NAVY2,0.014);

  slabel(s,'성공보수의 성격',ML,BODY+2.22,3.4,BLUE);
  const K=[['1회성','계약 1건에 한 번만 발생합니다'],
           ['가맹비 내 정산','추가 예산 편성이 필요하지 않습니다'],
           ['로열티는 순증','월 150만원은 전액 본사 수익으로 남습니다']];
  K.forEach(([k,v],i)=>{
    const y=BODY+2.56+i*0.42;
    s.addText(k,t({x:ML,y,w:1.7,h:0.34,fontSize:11,bold:true,color:MUTE,valign:'middle'}));
    s.addText(v,t({x:ML+1.8,y,w:lw-1.8,h:0.34,fontSize:11,color:NAVY2,valign:'middle'}));
  });

  const BX=ML+lw+0.7, BW=RX-BX;
  slabel(s,'이후 누적 본사 수익 · 월 로열티 150만원 반영',BX,BODY,5.4);
  const B=[['계약 시점',500],['12개월',2300],['24개월',4100],['36개월',5900]];
  B.forEach(([k,v],i)=>{
    const y=BODY+0.34+i*0.56;
    s.addText(k,t({x:BX,y,w:1.4,h:0.40,fontSize:12,bold:true,color:NAVY2,valign:'middle'}));
    rect(s,BX+1.5,y+0.09,BW-3.5,0.22,'DDE3EE');
    rect(s,BX+1.5,y+0.09,Math.max(0.08,(BW-3.5)*v/5900),0.22,i===3?BLUE:'9DB8EC');
    s.addText([{text:v.toLocaleString(),options:{fontSize:15,bold:true,color:i===3?BLUE:NAVY2}},
               {text:' 만원',options:{fontSize:10,color:MUTE}}],
      t({x:BX+BW-1.9,y,w:1.9,h:0.40,align:'right',valign:'middle'}));
  });
  hr(s,BX,BODY+2.62,BW,RULE);
  slabel(s,'출점 규모별 36개월 누적',BX,BODY+2.80,3.6,BLUE);
  [['3개점','1억 7,700'],['5개점','2억 9,500']].forEach(([k,v],i)=>{
    const x=BX+(BW/2)*i;
    s.addText(k,t({x,y:BODY+3.10,w:1.4,h:0.28,fontSize:11,color:MUTE,valign:'middle'}));
    s.addText([{text:v,options:{fontSize:18,bold:true,color:NAVY2}},{text:' 만원',options:{fontSize:10,color:MUTE}}],
      t({x,y:BODY+3.34,w:BW/2-0.3,h:0.36,valign:'middle'}));
    if(i) vr(s,x-0.26,BODY+3.10,0.62,RULE);
  });

  band(s,'10개점 출점 시 · 36개월 누적','5억 9,000','만원',false,true);
  foot(s,'※ 러너펍 공개 가맹 안내 기준(가맹비 1,500만원 / 월 로열티 150만원 · 부가세 별도) 시뮬레이션이며 실제 조건은 본사 정책에 따릅니다. 개설 기본비용 1,600만원(프로모션 전액 할인 중)과 폐점 · 중도해지는 반영하지 않았습니다.');
  s.addNotes('500만원밖에 안 남는다고 보실 수 있는데, 그 500만원은 계약 시점에 이미 흑자라는 뜻입니다. 본체는 로열티입니다.');
}

/* ══════════ 17 준법 · 리드귀속 ══════════ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  chrome(s,17,'통제');
  head(s,'브랜드와 준법 책임은 본사 기준을 그대로 따릅니다');
  lead(s,'정보제공 책임이 본사에 있는 항목은 본사가 직접 수행하시고, 내일사장은 보조 범위 안에서만 움직입니다.',false,10.8);

  const hw=(CW-0.6)/2;
  slabel(s,'준법 운영 기준',ML,BODY,3.4);
  const r1=[['정보공개서 · 계약서','본사가 제공, 내일사장은 전달 · 설명 보조'],
            ['법정 숙려기간','14일 준수, 기간 단축 유도 금지'],
            ['예상매출 진술','구두 약속 금지, 본사 승인 문구만 사용'],
            ['광고 · 상담 스크립트','본사 사전 승인 후 사용'],
            ['위반 확인 시','해당 건 영업 즉시 중단 및 본사 통보']];
  table(s,ML,BODY+0.34,[{h:'',w:2.5},{h:'',w:hw-2.5}],r1,{rh:0.52,fs:11.5,header:false});

  slabel(s,'리드 귀속 규칙',ML+hw+0.6,BODY,3.4);
  const r2=[['귀속 기준','리드가 최초로 유입된 경로 기준으로 실적을 구분합니다'],
            ['본사 인바운드','본사 문의 · 직영 영업 유입 건은 성공보수 대상이 아닙니다'],
            ['선등록 확인','본사 DB에 선등록 이력이 있으면 최초 유입을 본사로 봅니다'],
            ['증빙 방법','내일사장 발굴 건은 ERP 등록 기록으로 확인합니다'],
            ['이견 처리','주 단위 리포트 수령 후 이의제기, 최종 판정은 본사 자료 기준']];
  table(s,ML+hw+0.6,BODY+0.34,[{h:'',w:2.3},{h:'',w:hw-2.3}],r2,{rh:0.52,fs:11.5,header:false});
  vr(s,ML+hw+0.30,BODY,3.10,RULE);

  slabel(s,'업종 경험',ML,BODY+3.28,3.2,BLUE);
  s.addText('홀덤 업종 전담 이력은 없습니다. 다만 리브랜딩 트랙은 이미 업을 운영 중인 점주가 대상이고, 입지 · 손익 · 계약 절차는 업종과 무관하게 반복되는 영역입니다. 초기 구간은 파일럿으로 운영하고 건수와 기간은 본사가 정하십니다.',
    t({x:ML+2.6,y:BODY+3.22,w:CW-2.6,h:0.52,fontSize:11.5,color:NAVY2,lineSpacing:17,valign:'middle'}));

  band(s,'준법 · 귀속 판정은 본사 자료 기준 · 활동 리포트 제출','주 1','회');
  s.addNotes('준법과 리드 귀속은 전부 본사 기준입니다. 업종 경험이 없다는 점은 숨기지 않고 파일럿으로 검증받겠습니다.');
}

/* ══════════ 18 클로징 ══════════ */
{
  const s=p.addSlide(); s.background={color:NAVY};
  chrome(s,18,'CLOSE',true);
  head(s,'파일럿 구간으로 시작하시면 됩니다',true);
  lead(s,'검증 기간과 판단 지표를 본사가 정하시고, 그 기준으로 첫 구간을 평가하십시오. 아래 회신처로 알려 주시면 즉시 협의를 시작하겠습니다.',true,10.8);

  const lw=6.6;
  slabel(s,'파일럿 운영 기준',ML,BODY,3.4,MUTED);
  hr(s,ML,BODY+0.30,lw,ONINK,0.014);
  const V=[['검증 기간','본사가 정하시는 기간 — 착수 전 별지로 확정'],
           ['목표 건수','본사가 정하시는 목표 — 착수 전 별지로 확정'],
           ['평가 지표','신규 리드 수 · 상담 진행 수 · 가맹계약 체결 건수'],
           ['보고','주 단위 리포트 — 활동 지표와 단계별 파이프라인'],
           ['착수 조건','본사 승인 자료 확정 후 즉시 착수 · 착수금 없음'],
           ['기간 종료 시','연장 또는 종료를 본사가 단독 결정']];
  V.forEach(([k,v],i)=>{
    const y=BODY+0.46+i*0.44;
    s.addText(k,t({x:ML,y,w:2.2,h:0.34,fontSize:11,color:MUTED,valign:'middle'}));
    s.addText(v,t({x:ML+2.3,y,w:lw-2.3,h:0.34,fontSize:11.5,color:ONINK,valign:'middle'}));
    hr(s,ML,y+0.38,lw,RULED);
  });

  const rx=ML+lw+0.7, rw=RX-rx;
  slabel(s,'요약',rx,BODY,3,MUTED);
  hr(s,rx,BODY+0.30,rw,ONINK,0.014);
  const SUM=['프랜차이즈 본사 출신 4인이 직접 영업합니다',
             '앱 10만 · 월 5만 명 · 상담 DB 5,114명 위에서 팝니다',
             '계약 전 본사 지출 0원, 성공보수는 가맹비 안에서 정산',
             '계약 시점 +500만원 · 로열티는 전액 순증'];
  SUM.forEach((v,i)=>{
    const y=BODY+0.48+i*0.54;
    rect(s,rx,y+0.14,0.10,0.10,BLUEL);
    s.addText(v,t({x:rx+0.28,y,w:rw-0.28,h:0.48,fontSize:11.5,color:ONINK,lineSpacing:16,valign:'middle'}));
  });
  s.addImage({path:path.join(A,'logo.png'),x:rx,y:BODY+2.78,w:1.62,h:0.531});

  hr(s,ML,BODY+3.34,CW,RULED);
  s.addText('발신',t({x:ML,y:BODY+3.30,w:1,h:0.20,fontSize:9,color:MUTED}));
  s.addImage({path:path.join(A,'ns_logo_w.png'),x:ML,y:BODY+3.50,w:1.44,h:0.253});
  const RC=ML+2.5;
  [['담당',2.1],['연락처',2.3],['이메일',2.9]].reduce((acc,[k,w])=>{
    s.addText(k,t({x:acc,y:BODY+3.30,w,h:0.20,fontSize:9,color:MUTED}));
    hr(s,acc,BODY+3.72,w-0.3,MUTED);
    return acc+w;
  },RC);
  s.addText('수신  러너스튜디오(주) 귀중 · 대표 박경관',
    t({x:RX-4.2,y:BODY+3.40,w:4.2,h:0.24,fontSize:10.5,color:ONINK,align:'right'}));
  s.addText('서울 강남구 삼성로100길 12 제이타워 B2',
    t({x:RX-4.2,y:BODY+3.66,w:4.2,h:0.20,fontSize:9,color:MUTED,align:'right'}));

  band(s,'검증 기간 종료 시 본사에 남는 비용','0','원',true);
  s.addNotes('파일럿 한 건으로 시작하시면 됩니다. 종료하셔도 본사에 남는 비용은 없습니다.');
}

/* ═══ 저장 ═══ */
const OUT='/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v4/runnerpub_v4.pptx';
p.writeFile({fileName:OUT}).then(async f=>{
  const fs=require('fs'), JSZip=require('/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/node_modules/jszip');
  const z=await JSZip.loadAsync(fs.readFileSync(f)); let n=0;
  for(const name of Object.keys(z.files)){
    if(!/^ppt\/slides\/slide\d+\.xml$/.test(name)) continue;
    const xml=await z.file(name).async('string');
    const fixed=xml.replace(/<a:ln><\/a:ln>/g,()=>{n++;return '<a:ln><a:noFill/></a:ln>';});
    if(n) z.file(name,fixed);
  }
  fs.writeFileSync(f,await z.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
  console.log('WROTE',f,'| noFill',n);
});
