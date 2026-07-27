const pptxgen = require('pptxgenjs');
const path = require('path');
const A = '/home/user/onewillco-meeting-2026/runnerpub-proposal/assets';

const p = new pptxgen();
p.layout = 'LAYOUT_WIDE';               // 13.333 x 7.5
p.author = '내일사장'; p.company = '내일사장';
p.title = '가맹 개설 영업 위임 제안 — 내일사장 → 러너펍';

/* ── 토큰 (v2 검증 팔레트 계승) ── */
const PAPER='F3F5F1', INK='14201C', BODY='2E3A35', WEAK='6C7873', RULE='C3CCC5';
const TEAL='0F6B63', TEAL2='3E8B84', TEAL3='9BC2BE', BRONZE='A8791F', VOID='C3CCC5';
const ONINK='F3F5F1', ONWEAK='97A39D', ONRULE='38443F';
const F='맑은 고딕';

const W=13.333, H=7.5, ML=0.62, RX=12.713;   // 우측 종점
const CX=2.02;                                // 본문 시작
const CW=RX-CX;

const t=(o)=>Object.assign({fontFace:F,color:BODY,margin:0},o);
const line=(s,x,y,w,c=RULE,h=0.008)=>s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{color:c},line:{width:0}});

/* 진도 표식 + 좌측 레일 + 러닝 푸터 */
function frame(s,no,label,sub,dark){
  const ink=dark?ONINK:INK, weak=dark?ONWEAK:WEAK, rule=dark?ONRULE:RULE;
  // 상단 진도 눈금 13칸
  const gw=(RX-CX)/13;
  for(let i=0;i<13;i++){
    const on=(i+1)===no;
    s.addShape(p.ShapeType.rect,{x:CX+gw*i,y:0.42,w:gw-0.055,h:on?0.075:0.028,
      fill:{color:on?(dark?ONINK:INK):(dark?ONRULE:RULE)},line:{width:0}});
  }
  // 좌측 레일
  s.addText(`P.${String(no).padStart(2,'0')} / 13`,t({x:ML,y:0.40,w:1.3,h:0.2,fontSize:7.5,color:weak,charSpacing:0.7}));
  s.addText(`— ${label}`,t({x:ML,y:0.58,w:1.3,h:0.2,fontSize:7.5,color:weak,charSpacing:0.5}));
  if(sub) s.addText(sub,t({x:ML,y:1.02,w:1.3,h:0.7,fontSize:8,color:weak,lineSpacing:12}));
  // 푸터
  line(s,CX,6.97,CW,rule);
  s.addText('내일사장 → 러너스튜디오(주) · 가맹 개설 영업 위임 제안',
    t({x:CX,y:7.04,w:8,h:0.22,fontSize:7.2,color:weak,charSpacing:0.4,valign:'middle'}));
  s.addText(`${String(no).padStart(2,'0')} / 13`,
    t({x:RX-1.2,y:7.04,w:1.2,h:0.22,fontSize:7.2,color:weak,align:'right',valign:'middle'}));
}

function head(s,l1,l2,dark){
  const ink=dark?ONINK:INK;
  s.addText(l1,t({x:CX,y:0.86,w:CW,h:0.44,fontSize:22,bold:true,color:ink,charSpacing:-0.4}));
  if(l2) s.addText(l2,t({x:CX,y:1.30,w:CW,h:0.44,fontSize:22,bold:true,color:ink,charSpacing:-0.4}));
}
function lead(s,txt,y,dark,w){
  s.addText(txt,t({x:CX,y:y||1.92,w:w||CW,h:0.5,fontSize:10.5,
    color:dark?ONWEAK:BODY,lineSpacing:17}));
}
/* 하단 결산 밴드 */
function ledger(s,label,val,unit,dark,pre){
  const rule=dark?ONRULE:INK;
  line(s,CX,6.30,CW,rule,0.014);
  s.addText(label,t({x:CX,y:6.40,w:6,h:0.34,fontSize:9,color:dark?ONWEAK:WEAK,valign:'middle'}));
  const runs=[];
  if(pre) runs.push({text:pre,options:{fontSize:12,bold:true,color:dark?ONINK:INK}});
  runs.push({text:val,options:{fontSize:23,bold:true,color:dark?ONINK:INK}});
  if(unit) runs.push({text:' '+unit,options:{fontSize:10.5,color:dark?ONWEAK:WEAK}});
  s.addText(runs,t({x:RX-5,y:6.36,w:5,h:0.42,align:'right',valign:'middle'}));
}
/* 표 */
function table(s,x,y,cols,rows,opt={}){
  const fs=opt.fs||9, rh=opt.rh||0.36;
  let cy=y;
  if(opt.header!==false){
    line(s,x,cy,cols.reduce((a,c)=>a+c.w,0),INK,0.014);
    cy+=0.07;
    let cxx=x;
    cols.forEach(c=>{s.addText(c.h,t({x:cxx,y:cy,w:c.w,h:0.22,fontSize:7.6,color:WEAK,
      align:c.a||'left',charSpacing:0.5,valign:'middle'})); cxx+=c.w;});
    cy+=0.28;
  }
  rows.forEach((r)=>{
    line(s,x,cy,cols.reduce((a,c)=>a+c.w,0));
    let cxx=x;
    r.forEach((cell,i)=>{
      const c=cols[i], o=(typeof cell==='object')?cell:{v:cell};
      s.addText(o.v,t({x:cxx+(c.a==='right'?-0.06:0),y:cy+0.05,w:c.w-0.1,h:rh-0.08,
        fontSize:o.fs||fs,bold:!!o.b,color:o.c||BODY,align:c.a||'left',valign:'middle',lineSpacing:(o.fs||fs)*1.35}));
      cxx+=c.w;
    });
    cy+=rh;
  });
  line(s,x,cy,cols.reduce((a,c)=>a+c.w,0));
  return cy;
}
/* 수치 셀 */
function stat(s,x,y,w,val,unit,label,note,big){
  s.addText([{text:val,options:{fontSize:big||26,bold:true,color:INK}},
             {text:unit?' '+unit:'',options:{fontSize:11,color:BRONZE,bold:true}}],
    t({x,y,w,h:0.5,valign:'middle'}));
  s.addText(label,t({x,y:y+0.5,w,h:0.22,fontSize:8.6,bold:true,color:INK,valign:'middle'}));
  if(note) s.addText(note,t({x,y:y+0.72,w,h:0.36,fontSize:7.4,color:WEAK,lineSpacing:10.5}));
}
/* 가로 막대 */
function bar(s,x,y,w,ratio,color,h){
  s.addShape(p.ShapeType.rect,{x,y,w,h:h||0.17,fill:{color:VOID},line:{width:0}});
  if(ratio>0) s.addShape(p.ShapeType.rect,{x,y,w:Math.max(0.05,w*ratio),h:h||0.17,fill:{color},line:{width:0}});
}

const STATS=[
  ['1,600','억원 +','누적 매물 거래 규모','실제 계약으로 연결된 거래'],
  ['100,000','건 +','앱 누적 다운로드','창업·양수 수요 상주 채널'],
  ['50,000','명 +','월간 활성 이용자','MAU 기준'],
  ['10,000','건 +','누적 매물 등록','점포·상가 데이터베이스'],
  ['2,000','건 +','누적 거래 성사','등록 → 상담 → 검증 → 계약'],
  ['80','개 +','제휴 브랜드·파트너','프랜차이즈 본사 네트워크'],
];

/* ══ 01 표지 ══ */
{
  const s=p.addSlide(); s.background={color:INK};
  s.addImage({path:path.join(A,'card.png'),x:10.55,y:1.15,w:2.05,h:2.94,transparency:82});
  s.addImage({path:path.join(A,'logo.png'),x:10.62,y:0.52,w:1.9,h:0.62});
  s.addText('수신',t({x:9.55,y:0.55,w:0.9,h:0.2,fontSize:7.5,color:ONWEAK,align:'right'}));
  s.addText('러너스튜디오(주)',t({x:8.3,y:0.75,w:2.15,h:0.22,fontSize:8.6,color:ONINK,align:'right',bold:true}));

  s.addText('내일사장',t({x:ML,y:0.5,w:4,h:0.32,fontSize:15,bold:true,color:ONINK,charSpacing:-0.2}));
  s.addText('생성형 AI 기반 창업 지원 플랫폼 · 발신',t({x:ML,y:0.84,w:5,h:0.22,fontSize:8.4,color:ONWEAK}));

  s.addText([{text:'가맹 개설 영업을',options:{breakLine:true}},
             {text:'이미 모인 창업 수요 위에서'},],
    t({x:ML,y:2.05,w:8.6,h:1.3,fontSize:33,bold:true,color:ONINK,lineSpacing:46,charSpacing:-0.8}));
  s.addText('수행하겠습니다',t({x:ML,y:3.28,w:8.6,h:0.62,fontSize:33,bold:true,color:TEAL3,lineSpacing:46,charSpacing:-0.8}));

  s.addText('내일사장은 매물·창업 수요·거래 데이터를 운영하는 플랫폼 사업자입니다. 러너펍 가맹 개설 영업을 위임해 주시면,\n계약이 체결되고 가맹비 입금이 완료된 건에 한하여 성공보수를 청구합니다.',
    t({x:ML,y:4.12,w:8.9,h:0.7,fontSize:10.5,color:ONWEAK,lineSpacing:18}));

  line(s,ML,5.06,RX-ML,ONRULE);
  const tw=(RX-ML)/6;
  STATS.forEach(([v,u,k],i)=>{
    s.addText([{text:v,options:{fontSize:15,bold:true,color:ONINK}},
               {text:' '+u,options:{fontSize:8,color:TEAL3,bold:true}}],
      t({x:ML+tw*i,y:5.20,w:tw-0.1,h:0.3,valign:'middle'}));
    s.addText(k,t({x:ML+tw*i,y:5.50,w:tw-0.1,h:0.22,fontSize:7.6,color:ONWEAK}));
  });
  line(s,ML,5.86,RX-ML,ONRULE);

  s.addText('문건 성격',t({x:ML,y:6.02,w:2,h:0.2,fontSize:7.4,color:ONWEAK}));
  s.addText('가맹 개설 영업 위임 제안 · 계약서 아님',t({x:ML,y:6.22,w:5,h:0.24,fontSize:9,color:ONINK}));
  s.addText('발신 담당',t({x:4.9,y:6.02,w:2,h:0.2,fontSize:7.4,color:ONWEAK}));
  s.addText('담당자명 · 연락처 · 이메일',t({x:4.9,y:6.22,w:4,h:0.24,fontSize:9,color:ONWEAK}));
  s.addText('2026. 07',t({x:RX-2,y:6.22,w:2,h:0.24,fontSize:9,color:ONINK,align:'right'}));

  line(s,ML,6.72,RX-ML,ONRULE);
  s.addText('내일사장 → 러너스튜디오(주) · 가맹 개설 영업 위임 제안',
    t({x:ML,y:6.82,w:8,h:0.22,fontSize:7.2,color:ONWEAK,valign:'middle'}));
  s.addText('01 / 13',t({x:RX-1.2,y:6.82,w:1.2,h:0.22,fontSize:7.2,color:ONWEAK,align:'right',valign:'middle'}));
  s.addNotes('발신 내일사장, 수신 러너스튜디오(주)입니다. 저희는 창업 수요와 거래 데이터를 운영하는 플랫폼 사업자이고, 러너펍 가맹 개설 영업을 대행하겠다는 제안입니다.');
}

/* ══ 02 내일사장은 어떤 회사인가 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,2,'회사','내일사장\n개요');
  head(s,'창업 시장의 거래를 데이터로 바꾸는','플랫폼 사업자입니다');
  lead(s,'내일사장은 소상공인이 무자격 컨설턴트의 불법·허위 중개로 피해를 입지 않도록, 검증된 창업 수요와 거래 데이터를 축적하는 것을 목표로 설립되었습니다.',2.02,false,10.2);

  const rows=[
    ['설립 배경','세종대학교 겸임교수진이 설립. 무자격 창업 컨설턴트의 불법·허위 중개 피해 예방이 설립 취지입니다.'],
    ['사업 정의','생성형 AI 기반 창업 지원 플랫폼. 매물·상권·손익 데이터를 분석해 창업 의사결정을 지원합니다.'],
    ['운영 채널','자체 앱과 웹, 그리고 매물·리드를 관리하는 ERP를 직접 운영합니다.'],
    ['거래 범위','점포 양도양수 중개, 프랜차이즈 가맹 개설 영업, 점포개발까지 하나의 흐름으로 처리합니다.'],
    ['제휴 구조','프랜차이즈 본사 80개+ 네트워크와 공인중개사 제휴망(리맥스코리아 등)을 동시에 운용합니다.'],
  ];
  table(s,CX,2.72,[{h:'구분',w:2.0},{h:'내용',w:CW-2.0}],rows,{rh:0.56,fs:9.2});

  ledger(s,'플랫폼 누적 거래 규모','1,600','억원 +');
  s.addText('※ 지표는 내일사장 플랫폼 전체 누적 기준입니다.',t({x:CX,y:6.72,w:8,h:0.2,fontSize:7,color:WEAK}));
  s.addNotes('내일사장이 어떤 회사인지부터 말씀드립니다. 세종대 겸임교수진이 만든 창업 지원 플랫폼이고, 설립 취지가 소상공인 피해 예방입니다.');
}

/* ══ 03 플랫폼 실적 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,3,'실적','확보된\n모수');
  head(s,'창업 수요를 새로 만들지 않습니다','');
  lead(s,'아래 지표는 이번 제안 이전에 이미 확보된 값입니다. 러너펍은 모수를 만드는 비용과 시간을 지불하지 않아도 됩니다.',1.55,false,10.2);

  line(s,CX,2.20,CW,INK,0.014);
  const cw3=CW/3;
  STATS.forEach(([v,u,k,n],i)=>{
    const x=CX+cw3*(i%3), y=2.42+Math.floor(i/3)*1.42;
    stat(s,x,y,cw3-0.35,v,u,k,n,24);
    if(i%3) line(s,x-0.16,y-0.14,0.008,VOID);
  });
  line(s,CX,3.78,CW);
  line(s,CX,5.20,CW);

  s.addText('리드타임 단축',t({x:CX,y:5.34,w:2.4,h:0.24,fontSize:8.6,bold:true,color:INK,valign:'middle'}));
  bar(s,CX+2.5,5.40,5.2,0.6,TEAL);
  s.addText([{text:'60',options:{fontSize:15,bold:true,color:INK}},{text:' %',options:{fontSize:9,color:BRONZE,bold:true}}],
    t({x:CX+7.9,y:5.30,w:1.2,h:0.32,valign:'middle'}));
  s.addText('등록에서 계약까지 걸리는 기간의 플랫폼 누적 평균 단축률',
    t({x:CX+2.5,y:5.66,w:7.5,h:0.22,fontSize:7.6,color:WEAK,valign:'middle'}));

  ledger(s,'누적 거래 성사','2,000','건 +');
  s.addText('※ 플랫폼 전체 누적 기준이며, 홀덤 업종 단독 실적이 아닙니다. 업종 경험을 대체하는 장치는 P.12에 정리했습니다.',
    t({x:CX,y:6.72,w:10,h:0.2,fontSize:7,color:WEAK}));
  s.addNotes('1,600억원 거래, 앱 10만 다운로드, 월 5만 명. 이 모수는 이번 제안 이전에 이미 있는 값입니다.');
}

/* ══ 04 플랫폼이 하는 일 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,4,'플랫폼','서비스\n구성');
  head(s,'플랫폼이 실제로 수행하는 업무입니다','');
  lead(s,'매물을 올려두는 게시판이 아닙니다. 등록부터 계약까지 각 단계에 저희가 직접 개입하는 도구와 절차가 있습니다.',1.55,false,10.4);

  const P=[
    ['01','매물 등록 · 인증','점주 동의 후 홈택스 3개월 평균 매출 데이터로 검증하고 인증 표기를 부여합니다'],
    ['02','AI 상권분석','입지·유동·경쟁 점포를 분석해 보고서로 제시합니다'],
    ['03','AI 손익분석','임대 조건·초기 투자금·자기자본 대비 P&L을 산출합니다'],
    ['04','생성형 AI 브리핑','매물 경쟁력 분석과 브리핑 문서를 자동 생성합니다'],
    ['05','ERP 리드관리','상담부터 계약까지 파이프라인을 시스템에서 관리합니다'],
    ['06','점포개발 · 중개','공인중개사 제휴망을 통해 입점지를 물색·확보합니다'],
  ];
  line(s,CX,2.16,CW,INK,0.014);
  const cw4=CW/3;
  P.forEach(([n,ttl,d],i)=>{
    const x=CX+cw4*(i%3), y=2.36+Math.floor(i/3)*1.30;
    s.addText(n,t({x,y,w:1,h:0.2,fontSize:7.6,bold:true,color:BRONZE,charSpacing:0.8}));
    s.addText(ttl,t({x,y:y+0.22,w:cw4-0.4,h:0.28,fontSize:11.5,bold:true,color:INK,valign:'middle'}));
    s.addText(d,t({x,y:y+0.54,w:cw4-0.4,h:0.52,fontSize:8.4,color:WEAK,lineSpacing:12.5}));
    if(i%3) line(s,x-0.18,y-0.06,0.008,VOID);
  });
  line(s,CX,3.62,CW);
  line(s,CX,4.92,CW);

  s.addText('이 여섯 가지는 러너펍 가맹 상담에도 그대로 투입됩니다. 창업자가 결정을 미루는 이유는 대부분 정보 부족이고, 저희는 근거를 문서로 제시해 그 지연을 끊습니다.',
    t({x:CX,y:5.10,w:CW,h:0.5,fontSize:9.6,color:BODY,lineSpacing:15}));

  ledger(s,'등록 → 상담 → 검증 → 계약 · 단계별 도구','6','종');
  s.addNotes('플랫폼이 실제로 하는 업무 여섯 가지입니다. 매물 인증, AI 상권분석, 손익분석, 생성형 브리핑, ERP 리드관리, 점포개발. 러너펍 상담에도 그대로 씁니다.');
}

/* ══ 05 가맹영업 대행 업무 범위 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,5,'업무 범위','수행\n업무');
  head(s,'위임해 주시면 수행하는 업무입니다','');
  lead(s,'영업 조직 운영부터 계약 주선, 점포개발까지 개설에 필요한 실무를 하나로 묶어 수행합니다.',1.55);

  const rows=[
    [{v:'01',b:true,c:BRONZE},{v:'인바운드 상담',b:true},'본사로 들어온 가맹 문의를 접수·응대하고 상담 단계까지 관리합니다'],
    [{v:'02',b:true,c:BRONZE},{v:'창업 상담 · 브리핑',b:true},'AI 상권분석과 손익분석 보고서를 근거로 창업 상담을 진행합니다'],
    [{v:'03',b:true,c:BRONZE},{v:'영업 조직 운영',b:true},'가맹영업팀을 운영하고 신규 창업자·기존 홀덤펍 두 트랙으로 영업합니다'],
    [{v:'04',b:true,c:BRONZE},{v:'창업 마케팅',b:true},'예비창업자 리드(DB) 확보를 위한 가맹 창업마케팅을 집행합니다'],
    [{v:'05',b:true,c:BRONZE},{v:'계약 주선',b:true},'가맹계약 체결까지 조건 협의와 클로징을 지원합니다'],
    [{v:'06',b:true,c:BRONZE},{v:'점포개발',b:true},'상권조사·입지선정·부동산 정보 제공으로 개점 후보지를 확보합니다'],
  ];
  const endY=table(s,CX,2.20,[{h:'',w:0.62},{h:'업무',w:2.9},{h:'수행 내용',w:CW-3.52}],rows,{rh:0.45,fs:9.2});

  s.addText('본사가 직접 하실 일',t({x:CX,y:endY+0.24,w:3.4,h:0.22,fontSize:8,bold:true,color:WEAK,charSpacing:0.6}));
  s.addText('브랜드 자료 승인 · 가맹계약 체결 · 개설 승인',
    t({x:CX,y:endY+0.48,w:5.4,h:0.24,fontSize:9.4,color:BODY,valign:'middle'}));
  s.addText('내일사장이 맡는 일',t({x:CX+6.2,y:endY+0.24,w:3.4,h:0.22,fontSize:8,bold:true,color:TEAL,charSpacing:0.6}));
  s.addText('그 앞단의 발굴 · 상담 · 설득 · 클로징 전 과정',
    t({x:CX+6.2,y:endY+0.48,w:CW-6.2,h:0.24,fontSize:9.4,color:BODY,valign:'middle'}));

  ledger(s,'위임 시 본사가 추가로 채용해야 할 영업 인력','0','명');
  s.addNotes('위임해 주시면 저희가 수행하는 업무 여섯 가지입니다. 본사는 자료 승인과 계약 체결만 하시면 됩니다.');
}

/* ══ 06 제휴 네트워크 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,6,'네트워크','제휴\n구조');
  head(s,'브랜드망과 중개망을 동시에 운용합니다','');
  lead(s,'창업 수요만 있는 것이 아니라, 그 수요를 앉힐 자리와 연결할 브랜드가 함께 있습니다.',1.55);

  // 3열 구조
  const bw=(CW-1.0)/3;
  const BOX=[
    ['수요','예비창업자 · 업종 전환 희망자','앱 10만 다운로드 · 월 5만 명 채널에서 창업 수요를 확보합니다',TEAL],
    ['브랜드','프랜차이즈 본사 80개 +','B2B 제휴 네트워크에서 조건에 맞는 브랜드를 매칭합니다',TEAL2],
    ['자리','공인중개사 제휴망','리맥스코리아 등 중개망과 매물 10,000건 DB로 입점지를 확보합니다',BRONZE],
  ];
  BOX.forEach(([tag,ttl,d,c],i)=>{
    const x=CX+(bw+0.5)*i;
    line(s,x,2.20,bw,c,0.028);
    s.addText(tag,t({x,y:2.34,w:bw,h:0.24,fontSize:8.2,bold:true,color:c,charSpacing:1.4}));
    s.addText(ttl,t({x,y:2.62,w:bw,h:0.48,fontSize:13,bold:true,color:INK,lineSpacing:19}));
    s.addText(d,t({x,y:3.18,w:bw,h:0.86,fontSize:8.6,color:WEAK,lineSpacing:13}));
    if(i<2) s.addText('+',t({x:x+bw+0.06,y:2.62,w:0.38,h:0.4,fontSize:15,bold:true,color:VOID,align:'center',valign:'middle'}));
  });

  line(s,CX,4.12,CW,INK,0.014);
  s.addText('러너펍이 이 구조에 들어오면',t({x:CX,y:4.26,w:5,h:0.24,fontSize:8.4,bold:true,color:WEAK,charSpacing:0.6}));
  const F2=[
    ['브랜드망에 러너펍 편입','상담 중인 창업자에게 러너펍을 후보 브랜드로 제시합니다'],
    ['중개망으로 입점지 확보','홀덤펍 조건에 맞는 상가를 제휴 중개망에서 물색합니다'],
    ['기존 홀덤펍 접촉','매물·점주 데이터베이스에서 리브랜딩 대상을 발굴합니다'],
  ];
  F2.forEach(([h1,d],i)=>{
    const y=4.58+i*0.52;
    s.addShape(p.ShapeType.rect,{x:CX,y:y+0.10,w:0.09,h:0.09,fill:{color:TEAL},line:{width:0}});
    s.addText(h1,t({x:CX+0.26,y,w:3.4,h:0.3,fontSize:9.6,bold:true,color:INK,valign:'middle'}));
    s.addText(d,t({x:CX+3.8,y,w:CW-3.8,h:0.3,fontSize:9,color:BODY,valign:'middle'}));
  });

  ledger(s,'제휴 브랜드 · 파트너','80','개 +');
  s.addNotes('저희는 수요, 브랜드, 자리 세 가지를 동시에 갖고 있습니다. 러너펍이 이 구조에 들어오면 세 방향에서 동시에 영업이 붙습니다.');
}

/* ══ 07 러너펍 진단 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,7,'진단','남은\n변수');
  head(s,'러너펍의 개설 인프라는 이미 완비되어 있습니다','');
  lead(s,'러너러너 앱이 예약부터 정산까지 운영을 표준화했고, 본사 검증 점포 추천과 가맹 절차 9단계로 계약에서 오픈까지 4~6주가 확보되어 있습니다.',1.55,false,10.4);

  const L=['러너러너 앱 — 예약·회원관리·정산·토너먼트·포스터생성·핸디랭킹·음료주문',
           '본사 검증 점포 추천 — 상담 → 추천 → 물색 → 확인 → 개점',
           '준법 운영 체계 — 불법 요소 배제 기준과 정기 점검',
           '가맹 절차 9단계 · 계약 → 오픈 4~6주',
           '브랜드 이벤트 — 래빗 페스티벌 · 시즌 랭킹전 · 매장 간 콜라보'];
  s.addText('이미 갖춰진 것',t({x:CX,y:2.24,w:4,h:0.22,fontSize:8,bold:true,color:WEAK,charSpacing:0.8}));
  line(s,CX,2.48,6.55,INK,0.012);
  L.forEach((v,i)=>{
    const y=2.62+i*0.44;
    s.addText(v,t({x:CX,y,w:6.5,h:0.34,fontSize:9.2,color:BODY,valign:'middle'}));
    line(s,CX,y+0.38,6.55);
  });

  s.addText('남은 변수',t({x:CX+7.1,y:2.24,w:4,h:0.22,fontSize:8,bold:true,color:BRONZE,charSpacing:0.8}));
  line(s,CX+7.1,2.48,CW-7.1,BRONZE,0.012);
  s.addText('계약 가능한 창업자 모수',t({x:CX+7.1,y:2.66,w:CW-7.1,h:0.3,fontSize:12.5,bold:true,color:INK}));
  s.addText('계약 이전 구간의 접점 총량입니다. 개설 이후를 받쳐 주는 구조는 이미 자리 잡았고, 출점 속도를 결정하는 변수는 창업자 접점 하나로 좁혀집니다.',
    t({x:CX+7.1,y:3.04,w:CW-7.1,h:0.8,fontSize:9,color:WEAK,lineSpacing:13.5}));
  s.addText('내일사장이 담당하는 구간이 정확히 여기입니다.',
    t({x:CX+7.1,y:3.92,w:CW-7.1,h:0.3,fontSize:9.4,bold:true,color:TEAL,valign:'middle'}));

  s.addImage({path:path.join(A,'ranking.png'),x:CX+7.35,y:4.34,w:1.95,h:2.0});
  s.addText('러너러너 앱 화면',t({x:CX+9.45,y:5.2,w:1.6,h:0.2,fontSize:7.4,color:WEAK}));
  s.addText('리뉴얼 후 플랫폼 서비스 이용자',t({x:CX+9.45,y:5.44,w:1.7,h:0.2,fontSize:7.4,color:WEAK}));
  s.addText([{text:'1.5',options:{fontSize:16,bold:true,color:INK}},{text:' 배',options:{fontSize:9,color:BRONZE,bold:true}}],
    t({x:CX+9.45,y:5.66,w:1.6,h:0.32,valign:'middle'}));

  ledger(s,'병목 항목 · 계약 → 오픈','1','개 · 4~6주');
  s.addText('※ 러너러너 앱 운영사는 (주)러너소프트로 러너스튜디오(주)와 별개 법인입니다. 이용자 1.5배 증가는 IT비즈뉴스 2024.7.4 보도 기준.',
    t({x:CX,y:6.72,w:10.5,h:0.2,fontSize:7,color:WEAK}));
  s.addNotes('러너펍은 개설 이후 구조가 이미 완비되어 있습니다. 남은 변수는 창업자 접점 하나이고, 저희가 담당하는 구간이 정확히 거기입니다.');
}

/* ══ 08 2트랙 실행 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,8,'실행','영업\n2트랙');
  head(s,'신규 창업자와 기존 홀덤펍, 두 트랙을 동시에 엽니다','');
  lead(s,'신규 수요만 기다리지 않습니다. 이미 운영 중인 점주를 전환시키는 경로를 함께 가동해 계약 속도를 높입니다.',1.55);

  const TR=[
    ['TRACK A','신규 창업자',TEAL,
     [['접점','플랫폼 유입 창업 수요'],['절차','상권·손익 브리핑 → 계약'],['특성','모수 기반 · 검토 기간 필요'],['소구점','개설 기본비용 전액 할인 · 4~6주 오픈']]],
    ['TRACK B','기존 홀덤펍 리브랜딩',BRONZE,
     [['접점','즉시 전환 대상 점주'],['절차','전환 상담 → 계약'],['특성','계약 → 오픈 기간 그대로 활용'],['소구점','러너러너 앱 입점 · 예약·노쇼 관리 효과']]],
  ];
  TR.forEach(([tag,nm,c,rows],i)=>{
    const x=CX+i*(CW/2+0.24), w=CW/2-0.24;
    line(s,x,2.20,w,c,0.028);
    s.addText(tag,t({x,y:2.34,w,h:0.22,fontSize:7.8,bold:true,color:c,charSpacing:1.4}));
    s.addText(nm,t({x,y:2.58,w,h:0.34,fontSize:14,bold:true,color:INK}));
    rows.forEach(([k,v],j)=>{
      const y=3.08+j*0.48;
      s.addText(k,t({x,y,w:1.15,h:0.3,fontSize:8.4,color:WEAK,valign:'middle'}));
      s.addText(v,t({x:x+1.25,y,w:w-1.25,h:0.3,fontSize:9.4,color:BODY,valign:'middle'}));
      line(s,x,y+0.36,w);
    });
  });

  line(s,CX,5.14,CW,INK,0.012);
  s.addText('공통 운영 약속',t({x:CX,y:5.26,w:3,h:0.22,fontSize:8,bold:true,color:WEAK,charSpacing:0.6}));
  const PR=['전담 담당자 지정','경합 브랜드 동시 수임 제한','주 단위 활동 리포트','기존 가맹점 영업권 보호','계약 미종료 점주 권유 금지'];
  PR.forEach((v,i)=>{
    const x=CX+(CW/5)*i;
    s.addShape(p.ShapeType.rect,{x,y:5.58,w:0.09,h:0.09,fill:{color:TEAL},line:{width:0}});
    s.addText(v,t({x:x+0.2,y:5.50,w:CW/5-0.3,h:0.4,fontSize:8.4,color:BODY,lineSpacing:12}));
  });

  ledger(s,'계약 → 오픈 · 보고 주기','4~6','주 · 주 단위');
  s.addNotes('두 트랙을 동시에 돌립니다. 리브랜딩 트랙은 이미 운영 중인 점주라 의사결정이 빠릅니다.');
}

/* ══ 09 비용 구조 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,9,'조건','비용\n발생 구조');
  head(s,'착수금도 월 고정비도 광고비도 청구하지 않습니다','');
  lead(s,'청구는 가맹계약이 체결되고 가맹비 입금이 확인된 뒤에만 발생합니다. 그 이전 구간에서 본사가 부담하는 현금은 0원입니다.',1.55,false,10.4);

  const rows=[
    [{v:'착수금'},'해당 없음',{v:'0 원',b:true,c:WEAK}],
    [{v:'월 고정비'},'해당 없음',{v:'0 원',b:true,c:WEAK}],
    [{v:'광고비'},'해당 없음 (LSM 집행은 P.10 기준)',{v:'0 원',b:true,c:WEAK}],
    [{v:'성공보수',b:true},'가맹계약 체결 및 가맹비 입금 완료 후',{v:'1,000 만원',b:true,c:INK}],
  ];
  table(s,CX,2.20,[{h:'항목',w:2.4},{h:'발생 시점',w:CW-4.9},{h:'금액',w:2.5,a:'right'}],rows,{rh:0.48,fs:9.6});

  line(s,CX,4.86,CW,INK,0.012);
  const R9=[['지급 시점','가맹비 입금 확인 후 본사가 정하는 지급일'],
            ['계약 해제 · 환불 시','오픈 전 가맹계약이 해제되거나 가맹비 환불이 발생하면 해당 건 성공보수를 전액 반환합니다'],
            ['미계약 건 원가','상담·분석·브리핑에 들어간 비용은 전부 내일사장이 부담하며 본사에 청구하지 않습니다']];
  R9.forEach(([k,v],i)=>{
    const y=5.02+i*0.42;
    s.addText(k,t({x:CX,y,w:2.4,h:0.3,fontSize:8.8,bold:true,color:WEAK,valign:'middle'}));
    s.addText(v,t({x:CX+2.5,y,w:CW-2.5,h:0.3,fontSize:9.2,color:BODY,valign:'middle'}));
    line(s,CX,y+0.36,CW);
  });
  s.addText('성공보수는 부가가치세 별도입니다.',t({x:CX,y:6.72,w:5,h:0.2,fontSize:7,color:WEAK}));

  ledger(s,'계약 · 입금 완료 전 본사 부담','0','원');
  s.addNotes('계약 전에는 본사가 내실 돈이 없습니다. 계약이 깨지면 성공보수도 전액 반환합니다.');
}

/* ══ 10 네고·LSM·인테리어 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,10,'조건','변동\n방어');
  head(s,'창업자가 깎은 금액은 전액 내일사장 몫에서 차감합니다','');
  lead(s,'네고가 어디까지 진행되든 본사 수취액은 가맹비 1,500만원 그대로입니다. 줄어드는 구간은 내일사장 성공보수 하나입니다.',1.55,false,10.4);

  const rows=[
    [{v:'네고 없음',b:true},{v:'1,500 만원',b:true,c:INK},{v:'(1,000)',c:WEAK}],
    [{v:'네고 발생',b:true},{v:'1,500 만원',b:true,c:INK},{v:'(1,000 − 할인액)',c:WEAK}],
    [{v:'네고 최대',b:true},{v:'1,500 만원',b:true,c:INK},{v:'0',c:WEAK}],
  ];
  table(s,CX,2.20,[{h:'시나리오',w:3.0},{h:'본사 수취',w:3.4,a:'right'},{h:'내일사장 성공보수',w:CW-6.4,a:'right'}],rows,{rh:0.44,fs:9.6});

  s.addText('LSM 광고 집행 기준',t({x:CX,y:4.06,w:4,h:0.22,fontSize:8,bold:true,color:WEAK,charSpacing:0.6}));
  const rows2=[
    [{v:'1,000만원 전액 수취',b:true},{v:'내일사장 집행',c:TEAL,b:true},'수취액 중 200만원을 해당 매장 LSM 광고비로 집행'],
    [{v:'800만원 이하',b:true},{v:'본사 집행',c:BRONZE,b:true},'상한 200만원 기준으로 협의'],
    [{v:'800만원 초과 ~ 1,000만원 미만',b:true},{v:'협의',c:WEAK,b:true},'집행 주체와 금액을 양사 협의로 결정'],
  ];
  table(s,CX,4.28,[{h:'내일사장 수취 구간',w:3.9},{h:'집행 주체',w:2.3},{h:'기준',w:CW-6.2}],rows2,{rh:0.40,fs:9});

  s.addText('인테리어 시공',t({x:CX,y:5.94,w:2.4,h:0.22,fontSize:8,bold:true,color:WEAK,charSpacing:0.6}));
  s.addText('내일사장이 진행할 수 있으며, 본사 지정 스펙과 감리 승인 범위 안에서 수행합니다. 시공 참여 여부는 가맹 조건에 영향을 주지 않고, 추가 수익 분배는 착수 전 별도 합의합니다.',
    t({x:CX+2.5,y:5.90,w:CW-2.5,h:0.34,fontSize:8.8,color:BODY,lineSpacing:13}));

  ledger(s,'네고 여하에 불구 본사 수취','1,500','만원 불변');
  s.addNotes('네고는 저희 몫에서 부담합니다. 본사 수취액은 어떤 경우에도 1,500만원입니다.');
}

/* ══ 11 회수 구조 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,11,'수지','회수\n구조');
  head(s,'가맹비 안에서 정산하므로, 계약 시점에 이미 흑자입니다','');
  lead(s,'성공보수는 본사가 추가로 편성하는 예산이 아닙니다. 가맹비 범위 안에서 처리되고, 이후 월 로열티는 전액 순증으로 쌓입니다.',1.55,false,10.4);

  // 좌: 계약 시점 계산
  s.addText('계약 1건 · 계약 시점',t({x:CX,y:2.24,w:3,h:0.22,fontSize:8,bold:true,color:WEAK,charSpacing:0.6}));
  const calc=[['가맹비 (본사 수취)','+1,500',INK],['성공보수 (내일사장)','−1,000',WEAK]];
  calc.forEach(([k,v,c],i)=>{
    const y=2.56+i*0.44;
    s.addText(k,t({x:CX,y,w:2.8,h:0.3,fontSize:9.4,color:BODY,valign:'middle'}));
    s.addText([{text:v,options:{fontSize:12.5,bold:true,color:c}},{text:' 만원',options:{fontSize:8.4,color:WEAK}}],
      t({x:CX+2.7,y,w:1.8,h:0.3,align:'right',valign:'middle'}));
    line(s,CX,y+0.36,4.5);
  });
  s.addText('계약 시점 본사 순수익',t({x:CX,y:3.52,w:2.8,h:0.32,fontSize:9.6,bold:true,color:INK,valign:'middle'}));
  s.addText([{text:'+500',options:{fontSize:19,bold:true,color:TEAL}},{text:' 만원',options:{fontSize:9.4,bold:true,color:BRONZE}}],
    t({x:CX+2.4,y:3.48,w:2.1,h:0.38,align:'right',valign:'middle'}));
  line(s,CX,3.94,4.5,INK,0.012);
  s.addText('성공보수를 지급하고도 계약 즉시 흑자입니다. 본사가 별도 예산을 편성할 필요가 없습니다.',
    t({x:CX,y:4.08,w:4.5,h:0.44,fontSize:8.6,color:WEAK,lineSpacing:12.5}));

  // 우: 누적 막대
  const BX=CX+5.2, BW=CW-5.2;
  s.addText('이후 누적 본사 수익 · 월 로열티 150만원 반영',t({x:BX,y:2.24,w:BW,h:0.22,fontSize:8,bold:true,color:WEAK,charSpacing:0.6}));
  const B=[['계약 시점',500],['12개월',2300],['24개월',4100],['36개월',5900]];
  B.forEach(([k,v],i)=>{
    const y=2.60+i*0.52;
    s.addText(k,t({x:BX,y,w:1.2,h:0.3,fontSize:9,bold:true,color:BODY,valign:'middle'}));
    bar(s,BX+1.3,y+0.06,BW-3.3,v/5900,i===3?TEAL:TEAL2,0.18);
    s.addText([{text:v.toLocaleString(),options:{fontSize:11.5,bold:true,color:i===3?TEAL:INK}},
               {text:' 만원',options:{fontSize:8,color:WEAK}}],
      t({x:BX+BW-1.9,y,w:1.9,h:0.3,align:'right',valign:'middle'}));
  });
  line(s,BX,4.72,BW);
  const SC=[['3개점',' 1억 7,700'],['5개점',' 2억 9,500'],['10개점',' 5억 9,000']];
  s.addText('출점 규모별 36개월 누적',t({x:BX,y:4.86,w:3,h:0.2,fontSize:7.8,bold:true,color:WEAK,charSpacing:0.6}));
  SC.forEach(([k,v],i)=>{
    const x=BX+(BW/3)*i;
    s.addText(k,t({x,y:5.12,w:1.2,h:0.22,fontSize:8.4,color:WEAK,valign:'middle'}));
    s.addText([{text:v.trim(),options:{fontSize:12.5,bold:true,color:INK}},{text:' 만원',options:{fontSize:8,color:WEAK}}],
      t({x,y:5.34,w:BW/3-0.3,h:0.3,valign:'middle'}));
  });

  ledger(s,'10개점 · 36개월 누적','5억 9,000','만원');
  s.addText('※ 러너펍 공개 가맹 안내 기준(가맹비 1,500만원 / 월 로열티 150만원·부가세 별도) 시뮬레이션이며, 실제 조건은 본사 정책에 따릅니다. 폐점·중도해지는 반영하지 않았습니다.',
    t({x:CX,y:6.72,w:CW,h:0.2,fontSize:7,color:WEAK}));
  s.addNotes('본사가 가장 먼저 하실 계산이 500만원밖에 안 남는다는 것일 텐데, 그 500만원은 계약 시점에 이미 흑자라는 뜻입니다. 본체는 월 로열티입니다.');
}

/* ══ 12 준법·리드귀속·검증 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,12,'통제','준법 · 귀속\n검증');
  head(s,'브랜드와 준법 책임은 본사 기준을 그대로 적용합니다','');
  lead(s,'정보제공 책임이 본사에 귀속되는 항목은 본사가 직접 수행하고, 내일사장은 보조 범위 안에서만 움직입니다.',1.55,false,10.4);

  const r1=[
    ['정보공개서 · 계약서','본사가 제공, 내일사장은 전달·설명 보조'],
    ['법정 숙려기간','체결 전 숙려기간 준수, 기간 단축 유도 금지'],
    ['예상매출 진술','예상매출·수익 구두 약속 금지, 본사 승인 문구만 사용'],
    ['광고·상담 스크립트','본사 사전 승인 후 사용'],
    ['위반 확인 시','해당 건 영업 즉시 중단, 성공보수 미청구'],
  ];
  s.addText('준법 운영 기준',t({x:CX,y:2.22,w:3,h:0.22,fontSize:8,bold:true,color:WEAK,charSpacing:0.6}));
  table(s,CX,2.46,[{h:'항목',w:2.7},{h:'적용 방식',w:3.5}],r1,{rh:0.42,fs:8.6,header:false});

  const r2=[
    ['귀속 기준 시점','내일사장이 ERP에 등록하고 본사에 통보한 시점'],
    ['선등록 우선','본사 DB에 이미 있는 건은 본사 귀속'],
    ['귀속 유효기간','본사가 정하는 기간'],
    ['이견 처리','주 단위 리포트 수령 후 이의제기, 최종 판정은 본사 자료 기준'],
  ];
  s.addText('리드 귀속 규칙',t({x:CX+6.6,y:2.22,w:3,h:0.22,fontSize:8,bold:true,color:WEAK,charSpacing:0.6}));
  table(s,CX+6.6,2.46,[{h:'항목',w:1.5},{h:'기준',w:CW-8.1}],r2,{rh:0.42,fs:8.6,header:false});

  line(s,CX,4.72,CW,INK,0.012);
  s.addText('홀덤 업종 경험을 대체하는 장치',t({x:CX,y:4.86,w:4,h:0.22,fontSize:8,bold:true,color:BRONZE,charSpacing:0.6}));
  const r3=[
    '리브랜딩 트랙은 이미 업을 운영 중인 점주가 대상이므로 업종 지식 부담이 낮습니다',
    '입지·손익·계약 절차는 업종에 무관하게 반복되는 영역입니다',
    '영업 개시 전 본사 교육 과정을 이수한 뒤 착수합니다',
    '초기 구간은 본사 동석 파일럿으로 진행하고, 건수·기간은 본사가 정합니다',
  ];
  r3.forEach((v,i)=>{
    const x=CX+(CW/2+0.2)*(i%2), y=5.12+Math.floor(i/2)*0.42;
    s.addText(`0${i+1}`,t({x,y,w:0.4,h:0.26,fontSize:7.6,bold:true,color:BRONZE,valign:'middle'}));
    s.addText(v,t({x:x+0.44,y,w:CW/2-0.7,h:0.26,fontSize:8.8,color:BODY,valign:'middle'}));
  });

  ledger(s,'준법 위반 확인 시 · 해당 건 성공보수','미청구','');
  s.addNotes('브랜드와 준법 책임은 전부 본사 기준을 따릅니다. 리드 귀속도 규칙을 먼저 정해두었습니다.');
}

/* ══ 13 클로징 ══ */
{
  const s=p.addSlide(); s.background={color:INK};
  frame(s,13,'CLOSE','검증\n방식',true);
  head(s,'파일럿 한 건으로 검증 기준을 먼저 정하시면 됩니다','',true);
  lead(s,'검증 기간과 판단 지표를 본사가 정하시고, 그 기준으로 첫 구간을 평가하시면 됩니다. 기간이 끝나면 연장 또는 종료를 본사가 단독으로 결정하며, 종료 시 본사에 남는 비용은 없습니다.',1.55,true,10.6);

  const V=[['검증 기간','본사가 정하는 기간'],['평가 지표','신규 리드 수 · 상담 진행 수 · 가맹계약 체결 건수'],
           ['보고','주 단위 리포트 — 활동 지표와 단계별 파이프라인 포함'],
           ['초기 구간 운영','본사 동석 파일럿으로 진행, 건수·기간은 본사 지정'],
           ['기간 종료 시','연장 또는 종료를 본사가 단독 결정, 잔여 비용 없음']];
  line(s,CX,2.32,6.9,ONINK,0.012);
  V.forEach(([k,v],i)=>{
    const y=2.46+i*0.46;
    s.addText(k,t({x:CX,y,w:2.2,h:0.3,fontSize:9,color:ONWEAK,valign:'middle'}));
    s.addText(v,t({x:CX+2.3,y,w:4.6,h:0.3,fontSize:9.2,color:ONINK,valign:'middle'}));
    line(s,CX,y+0.36,6.9,ONRULE);
  });

  s.addText('요약',t({x:CX+7.4,y:2.32,w:2,h:0.22,fontSize:8,bold:true,color:ONWEAK,charSpacing:0.8}));
  const SUM=['모수 보유 — 창업 수요를 새로 만들지 않습니다',
             '업무 완비 — 상권·손익·브리핑·ERP·점포개발 직접 운영',
             '계약 전 비용 — 착수금·월 고정비·광고비 없음',
             '계약 시점 +500만원 — 회수 대기 기간 없음'];
  SUM.forEach((v,i)=>{
    const y=2.62+i*0.52;
    s.addShape(p.ShapeType.rect,{x:CX+7.4,y:y+0.10,w:0.09,h:0.09,fill:{color:TEAL3},line:{width:0}});
    s.addText(v,t({x:CX+7.66,y,w:CW-7.86,h:0.42,fontSize:8.8,color:ONINK,lineSpacing:12.5}));
  });

  s.addImage({path:path.join(A,'logo.png'),x:CX+7.4,y:4.92,w:1.55,h:0.51});
  s.addText('수신',t({x:CX+7.4,y:5.54,w:1,h:0.18,fontSize:7,color:ONWEAK}));
  s.addText('러너스튜디오(주) 귀중 · 대표 박경관',t({x:CX+7.4,y:5.72,w:3.29,h:0.22,fontSize:8.4,color:ONINK}));
  s.addText('서울 강남구 삼성로100길 12 제이타워 B2',t({x:CX+7.4,y:5.94,w:3.29,h:0.2,fontSize:7.4,color:ONWEAK}));

  s.addText('발신',t({x:CX,y:5.54,w:1,h:0.18,fontSize:7,color:ONWEAK}));
  s.addText('내일사장 — 생성형 AI 기반 창업 지원 플랫폼',t({x:CX,y:5.72,w:5,h:0.22,fontSize:8.6,color:ONINK}));
  s.addText('담당자명 · 연락처 · 이메일',t({x:CX,y:5.94,w:4,h:0.2,fontSize:7.6,color:ONWEAK}));

  ledger(s,'검증 기간 종료 시 본사 잔여 비용','0','원',true);
  s.addNotes('파일럿 한 건으로 시작하시면 됩니다. 기준은 본사가 정하시고, 종료하셔도 남는 비용은 없습니다.');
}

p.writeFile({fileName:'/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v3/runnerpub_wide.pptx'})
 .then(f=>console.log('WROTE',f));
