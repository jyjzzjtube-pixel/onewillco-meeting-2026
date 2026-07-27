const pptxgen = require('pptxgenjs');
const path = require('path');
const A = '/home/user/onewillco-meeting-2026/runnerpub-proposal/assets';

const p = new pptxgen();
p.layout = 'LAYOUT_WIDE';               // 13.333 x 7.5
p.author = '내일사장'; p.company = '내일사장';
p.title = '가맹 개설 영업 위임 제안 — 내일사장 → 러너펍';

/* ── 토큰 (v2 검증 팔레트 계승) ── */
const PAPER='F3F5F1', INK='14201C', BODY='2E3A35', WEAK='6C7873', RULE='C3CCC5';
const FOOTC='566159';                         // 각주 전용 — WEAK보다 진하게(명암비 확보)
const TEAL='0F6B63', TEAL2='3E8B84', TEAL3='9BC2BE', BRONZE='A8791F', VOID='C3CCC5';
const ONINK='F3F5F1', ONWEAK='97A39D', ONRULE='38443F';
const ONBRONZE='D6A64A';                      // 어두운 배경용 브론즈 (INK 배경 전용)
const F='맑은 고딕';

const W=13.333, H=7.5, ML=0.62, RX=12.713;   // 우측 종점
const FOOTY=6.70;                             // ※ 각주 기준선 (결산 라벨 6.40~6.74 · 푸터선 6.97 사이)
const CX=2.02;                                // 본문 시작
const CW=RX-CX;

const t=(o)=>Object.assign({fontFace:F,color:BODY,margin:0},o);
const line=(s,x,y,w,c=RULE,h=0.008)=>s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{color:c},line:{type:'none'}});
const vline=(s,x,y,h,c=RULE,w=0.008)=>s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{color:c},line:{type:'none'}});

/* 진도 표식 + 좌측 레일 + 러닝 푸터 */
function frame(s,no,label,sub,dark){
  const ink=dark?ONINK:INK, weak=dark?ONWEAK:WEAK, rule=dark?ONRULE:RULE;
  // 상단 진도 눈금 13칸
  const gw=(RX-CX)/13;
  for(let i=0;i<13;i++){
    const on=(i+1)===no;
    s.addShape(p.ShapeType.rect,{x:CX+gw*i,y:0.42,w:gw-0.055,h:on?0.075:0.028,
      fill:{color:on?(dark?ONINK:INK):(dark?ONRULE:RULE)},line:{type:'none'}});
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
/* 하단 결산 밴드 — small:true 이면 값 급수를 2단 내린다(개수·종류·빈도용) */
function ledger(s,label,val,unit,dark,pre,small){
  const rule=dark?ONINK:INK;
  line(s,CX,6.30,CW,rule,dark?0.020:0.014);
  s.addText(label,t({x:CX,y:6.38,w:6,h:0.30,fontSize:9,color:dark?ONWEAK:WEAK,valign:'middle'}));
  const runs=[];
  if(pre) runs.push({text:pre,options:{fontSize:12,bold:true,color:dark?ONINK:INK}});
  runs.push({text:val,options:{fontSize:small?15:23,bold:true,color:dark?ONINK:INK}});
  if(unit) runs.push({text:' '+unit,options:{fontSize:10.5,color:dark?ONWEAK:WEAK}});
  s.addText(runs,t({x:RX-5,y:6.34,w:5,h:0.38,align:'right',valign:'middle'}));
}
/* 섹션 라벨 — 전 페이지 공통 급수(8.0pt bold · charSpacing 0.6) */
function slabel(s,txt,x,y,w,c,align){
  s.addText(txt,t({x,y,w,h:0.22,fontSize:8,bold:true,color:c||WEAK,charSpacing:0.6,align:align||'left'}));
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
      s.addText(o.v,t({x:cxx,y:cy+0.05,w:(c.a==='right'?c.w:c.w-0.1),h:rh-0.08,
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
             {text:unit?' '+unit:'',options:{fontSize:11,color:TEAL2,bold:true}}],
    t({x,y,w,h:0.5,valign:'middle'}));
  s.addText(label,t({x,y:y+0.5,w,h:0.22,fontSize:8.6,bold:true,color:INK,valign:'middle'}));
  if(note) s.addText(note,t({x,y:y+0.72,w,h:0.36,fontSize:7.4,color:WEAK,lineSpacing:10.5}));
}
/* 가로 막대 */
function bar(s,x,y,w,ratio,color,h){
  s.addShape(p.ShapeType.rect,{x,y,w,h:h||0.17,fill:{color:VOID},line:{type:'none'}});
  if(ratio>0) s.addShape(p.ShapeType.rect,{x,y,w:Math.max(0.05,w*ratio),h:h||0.17,fill:{color},line:{type:'none'}});
}

const STATS=[
  ['1,600','억원 +','누적 매물 거래 규모','플랫폼 누적 기준'],
  ['100,000','건 +','앱 누적 다운로드','창업·양수 수요 상주 채널'],
  ['50,000','명 +','월간 활성 이용자','MAU 기준'],
  ['10,000','건 +','누적 매물 등록','점포·상가 데이터베이스'],
  ['2,000','건 +','누적 거래 성사','등록 → 상담 → 검증 → 계약'],
  ['80','개 +','B2B 제휴 브랜드·파트너','브랜드 본사 및 파트너사'],
];

/* ══ 01 표지 ══ */
{
  const s=p.addSlide(); s.background={color:INK};
  s.addImage({path:path.join(A,'logo.png'),x:RX-1.40,y:0.50,w:1.40,h:0.462});
  s.addText('수신 · 검토',t({x:RX-3.6,y:1.26,w:3.6,h:0.18,fontSize:7.2,color:ONWEAK,align:'right',charSpacing:1.2}));
  s.addText('러너스튜디오(주) 귀중',t({x:RX-3.6,y:1.44,w:3.6,h:0.22,fontSize:9,color:ONINK,align:'right',bold:true}));
  s.addText('대표 박경관',t({x:RX-3.6,y:1.66,w:3.6,h:0.2,fontSize:8,color:ONWEAK,align:'right'}));

  s.addText('발신 · 제안',t({x:ML,y:0.40,w:2.4,h:0.18,fontSize:7.2,color:TEAL3,charSpacing:1.2}));
  s.addText('내일사장',t({x:ML,y:0.58,w:4,h:0.44,fontSize:24,bold:true,color:ONINK,charSpacing:-0.4}));
  line(s,ML,1.06,1.62,TEAL3,0.022);
  s.addText('생성형 AI 기반 창업 지원 플랫폼',t({x:ML,y:1.14,w:5,h:0.22,fontSize:8.4,color:ONWEAK}));

  s.addText([{text:'가맹 개설 영업을',options:{breakLine:true}},
             {text:'이미 모인 창업 수요',options:{color:TEAL3}},
             {text:' 위에서',options:{color:ONINK,breakLine:true}},
             {text:'수행하겠습니다'}],
    t({x:ML,y:2.05,w:9.2,h:1.9,fontSize:33,bold:true,color:ONINK,lineSpacing:48,charSpacing:-0.8}));

  s.addText('내일사장은 매물·창업 수요·거래 데이터를 운영하는 플랫폼 사업자입니다. 러너펍 가맹 개설 영업을 위임해 주시면,\n계약이 체결되고 가맹비 입금이 완료된 건에 한하여 성공보수를 청구합니다.',
    t({x:ML,y:4.12,w:8.9,h:0.7,fontSize:10.5,color:ONWEAK,lineSpacing:18}));

  line(s,ML,5.06,RX-ML,ONRULE);
  const COVER=[['1,600','억원 +','누적 매물 거래 규모'],
               ['50,000','명 +','월간 활성 이용자(MAU)'],
               ['80','개 +','B2B 제휴 브랜드·파트너']];
  const tw=(RX-ML)/3;
  COVER.forEach(([v,u,k],i)=>{
    s.addText([{text:v,options:{fontSize:21,bold:true,color:ONINK}},
               {text:' '+u,options:{fontSize:9.5,color:TEAL3,bold:true}}],
      t({x:ML+tw*i,y:5.18,w:tw-0.3,h:0.38,valign:'middle'}));
    s.addText(k,t({x:ML+tw*i,y:5.56,w:tw-0.3,h:0.22,fontSize:8.4,color:ONWEAK}));
    if(i) vline(s,ML+tw*i-0.34,5.18,0.60,ONRULE);
  });
  line(s,ML,5.86,RX-ML,ONRULE);

  s.addText('청구 조건',t({x:ML,y:6.16,w:2,h:0.2,fontSize:7.4,color:ONWEAK}));
  s.addText('가맹계약 1건당 1,000만원 (VAT 별도) · 계약 및 입금 완료 건에 한해 청구',t({x:ML,y:6.36,w:4.6,h:0.24,fontSize:9,color:ONINK}));
  s.addText('영업 트랙',t({x:5.30,y:6.16,w:2,h:0.2,fontSize:7.4,color:ONWEAK}));
  s.addText('신규 창업자 · 기존 홀덤펍 리브랜딩',t({x:5.30,y:6.36,w:4,h:0.24,fontSize:9,color:ONINK}));
  s.addText('2026. 07',t({x:RX-2,y:6.36,w:2,h:0.24,fontSize:9,color:ONINK,align:'right'}));

  s.addText('※ 위 지표는 내일사장 플랫폼 누적 기준입니다.',
    t({x:ML,y:FOOTY,w:8,h:0.18,fontSize:6.8,color:ONWEAK}));
  line(s,ML,6.97,RX-ML,ONRULE);
  s.addText('내일사장 → 러너스튜디오(주) · 가맹 개설 영업 위임 제안',
    t({x:ML,y:7.04,w:8,h:0.22,fontSize:7.2,color:ONWEAK,valign:'middle'}));
  s.addText('01 / 13',t({x:RX-1.2,y:7.04,w:1.2,h:0.22,fontSize:7.2,color:ONWEAK,align:'right',valign:'middle'}));
  s.addNotes('발신 내일사장, 수신 러너스튜디오(주)입니다. 저희는 창업 수요와 거래 데이터를 운영하는 플랫폼 사업자이고, 러너펍 가맹 개설 영업을 대행하겠다는 제안입니다.');
}

/* ══ 02 내일사장은 어떤 회사인가 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,2,'회사','내일사장\n개요');
  head(s,'무자격 · 허위 중개를 없애려고 만들어진 회사입니다','');
  lead(s,'러너펍이 영업을 위임하실 상대가 어떤 조직인지, 설립 배경부터 제휴 구조까지 다섯 항목으로 정리했습니다.',1.55,false,10.2);

  const rows=[
    [{v:'설립 배경',b:true,c:INK},'세종대학교 겸임교수진이 설립. 무자격 창업 컨설턴트의 불법·허위 중개 피해 예방이 설립 취지입니다.'],
    [{v:'사업 정의',b:true,c:INK},'생성형 AI 기반 창업 지원 플랫폼. 매물·상권·손익 데이터를 분석해 창업 의사결정을 지원합니다.'],
    [{v:'운영 채널',b:true,c:INK},'자체 앱과 매물·리드를 관리하는 ERP를 직접 운영합니다.'],
    [{v:'거래 범위',b:true,c:INK},'점포 양도양수 중개와 점포개발을 하나의 흐름으로 처리하며, 이번 제안의 가맹 개설 영업은 그 흐름 위에서 수행합니다.'],
    [{v:'제휴 구조',b:true,c:INK},'B2B 제휴 브랜드·파트너 80개+ 와 공인중개사 제휴망(리맥스코리아 등)을 동시에 운용합니다.'],
  ];
  const e2=table(s,CX,2.20,[{h:'구분',w:2.0},{h:'내용',w:CW-2.0}],rows,{rh:0.48,fs:9.2});

  slabel(s,'분석 · 브리핑 도구',CX,e2+0.22,4.0,WEAK);
  s.addText('AI 상권분석 · 손익분석(P&L) · 매물 브리핑을 자체 도구로 직접 산출합니다',
    t({x:CX,y:e2+0.48,w:CW,h:0.26,fontSize:9.2,color:BODY,valign:'middle'}));

  ledger(s,'러너펍 브랜드가 실릴 채널 · B2B 제휴 브랜드·파트너','80','개 +');
  s.addText('※ 설립 취지는 무자격 창업 컨설턴트의 불법·허위 중개 피해 예방입니다. 제휴 수치는 내일사장 플랫폼 누적 기준입니다.',
    t({x:CX,y:FOOTY,w:9,h:0.18,fontSize:7.2,color:FOOTC}));
  s.addNotes('내일사장이 어떤 회사인지부터 말씀드립니다. 세종대 겸임교수진이 만든 창업 지원 플랫폼이고, 설립 취지가 소상공인 피해 예방입니다.');
}

/* ══ 03 플랫폼 실적 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,3,'실적','확보된\n모수');
  head(s,'창업 수요를 새로 만드실 필요가 없습니다','');
  lead(s,'아래 지표는 이번 제안 이전에 이미 확보된 값입니다. 러너펍은 모수를 만드는 비용과 시간을 지불하지 않아도 됩니다.',1.55,false,10.2);

  line(s,CX,2.20,CW,INK,0.014);
  const cw3=CW/3;
  STATS.forEach(([v,u,k,n],i)=>{
    const x=CX+cw3*(i%3), y=2.42+Math.floor(i/3)*1.58;
    stat(s,x,y,cw3-0.35,v,u,k,n,24);
    if(i%3) vline(s,x-0.18,y-0.08,1.30,VOID);
  });
  line(s,CX,3.78,CW);
  line(s,CX,5.43,CW);

  s.addText('리드타임 단축',t({x:CX,y:5.57,w:2.4,h:0.24,fontSize:8.6,bold:true,color:INK,valign:'middle'}));
  bar(s,CX+cw3,5.63,6.10,0.6,TEAL);
  s.addText([{text:'60',options:{fontSize:16,bold:true,color:INK}},{text:' %',options:{fontSize:9.5,color:TEAL2,bold:true}}],
    t({x:RX-1.0,y:5.53,w:1.0,h:0.32,align:'right',valign:'middle'}));
  s.addText('플랫폼 누적 평균 기준. 러너펍 개설 사례의 기준값이 아닙니다',
    t({x:CX+cw3,y:5.89,w:7.13,h:0.22,fontSize:7.6,color:WEAK,valign:'middle'}));

  ledger(s,'모수 확보에 본사가 쓰실 시간과 비용','0','원');
  s.addText('※ 위 지표는 플랫폼 거래 실적이며 브랜드별 가맹 개설 영업 실적과는 구분되는 값입니다. 그래서 성공보수형 구조와 파일럿(P.13)으로 본사 리스크를 0에 두었습니다.',
    t({x:CX,y:FOOTY,w:CW,h:0.18,fontSize:7.2,color:FOOTC}));
  s.addNotes('1,600억원 거래, 앱 10만 다운로드, 월 5만 명. 이 모수는 이번 제안 이전에 이미 있는 값입니다.');
}

/* ══ 04 플랫폼이 하는 일 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,4,'플랫폼','서비스\n구성');
  head(s,'상담을 계약으로 바꾸는 도구를 이미 갖췄습니다','');
  lead(s,'매물을 올려두는 게시판이 아닙니다. 등록부터 계약까지 각 단계에 저희가 직접 개입하는 도구와 절차가 있습니다.',1.55,false,10.4);

  const P=[
    ['01','매물 데이터베이스','누적 10,000건+ 의 점포·상가 매물 데이터를 직접 등록·운영합니다'],
    ['02','AI 상권분석','상권 데이터를 분석해 입지 판단 근거를 제공합니다'],
    ['03','AI 손익분석','예상 손익(P&L)을 산출해 투자 회수 구조를 제시합니다'],
    ['04','생성형 AI 매물 브리핑','생성형 AI로 매물 브리핑 문서를 작성합니다'],
    ['05','ERP 리드관리','상담부터 계약까지 파이프라인을 시스템에서 관리합니다'],
    ['06','공인중개사 제휴망','리맥스코리아 등 제휴 중개망으로 입점 후보지를 물색합니다'],
  ];
  line(s,CX,2.20,CW,INK,0.014);
  const cw4=CW/3;
  P.forEach(([n,ttl,d],i)=>{
    const x=CX+cw4*(i%3), y=2.46+Math.floor(i/3)*1.64;
    const wc=(i%3===2)?(RX-x):(cw4-0.4);
    s.addText(n,t({x,y,w:1,h:0.2,fontSize:7.6,bold:true,color:WEAK,charSpacing:0.8}));
    s.addText(ttl,t({x,y:y+0.22,w:wc,h:0.28,fontSize:11.5,bold:true,color:INK,valign:'middle'}));
    s.addText(d,t({x,y:y+0.54,w:wc,h:0.52,fontSize:8.4,color:WEAK,lineSpacing:12.5}));
    if(i%3) vline(s,x-0.20,y-0.04,1.10,VOID);
  });
  line(s,CX,3.80,CW);
  line(s,CX,5.44,CW);

  s.addText('이 여섯 가지는 러너펍 가맹 상담에도 그대로 투입됩니다. 상권·손익·브리핑을 문서로 제시해 창업자의 결정 지연을 줄여 왔고, 평균 리드타임을 60% 단축했습니다(플랫폼 누적 평균 기준).',
    t({x:CX,y:5.70,w:CW,h:0.6,fontSize:10,color:BODY,lineSpacing:16}));

  ledger(s,'등록 → 상담 → 검증 → 계약 · 단계별 도구','6','종',false,null,true);
  s.addNotes('플랫폼이 실제로 하는 업무 여섯 가지입니다. 매물 데이터베이스, AI 상권분석, 손익분석, 생성형 브리핑, ERP 리드관리, 공인중개사 제휴망. 러너펍 상담에도 그대로 씁니다.');
}

/* ══ 05 가맹영업 대행 업무 범위 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,5,'업무 범위','수행\n업무');
  head(s,'본사는 승인만, 실무 전 과정은 저희가 맡습니다','');
  lead(s,'영업 조직 운영부터 계약 주선, 점포개발까지 개설에 필요한 실무를 하나로 묶어 수행합니다.',1.55);

  const rows=[
    [{v:'본사 유입 건',b:true},'본사 문의·본사 직영 영업 유입 건은 성공보수 대상이 아니며, 요청하시면 응대만 지원합니다 (P.12)'],
    [{v:'창업 상담 · 브리핑',b:true},'러너펍 가맹 조건에 맞춰 창업자의 의사결정을 마무리합니다'],
    [{v:'영업 조직 운영',b:true},'가맹영업팀을 운영하고 신규 창업자·기존 홀덤펍 두 트랙으로 영업합니다'],
    [{v:'창업 마케팅',b:true},'예비창업자 리드(DB) 확보를 위한 가맹 창업마케팅을 집행합니다'],
    [{v:'계약 주선',b:true},'가맹계약 체결까지 조건 협의와 클로징을 지원합니다'],
    [{v:'점포개발',b:true},'상권조사·입지선정으로 개점 후보지를 확정하고 계약까지 연결합니다'],
  ];
  const endY=table(s,CX,2.20,[{h:'업무',w:3.30},{h:'수행 내용',w:CW-3.30}],rows,{rh:0.36,fs:9.2});

  slabel(s,'본사가 직접 하실 일',CX,endY+0.26,3.4,WEAK);
  s.addText('브랜드 자료 승인 · 가맹계약 체결 · 개설 승인',
    t({x:CX,y:endY+0.52,w:5.4,h:0.28,fontSize:10.5,color:BODY,valign:'middle'}));
  slabel(s,'내일사장이 맡는 일',CX+6.2,endY+0.26,CW-6.2,TEAL,'right');
  s.addText('그 앞단의 발굴 · 상담 · 설득 · 클로징 전 과정',
    t({x:CX+6.2,y:endY+0.52,w:CW-6.2,h:0.28,fontSize:10.5,color:BODY,valign:'middle',align:'right'}));

  line(s,CX,endY+0.96,CW);
  slabel(s,'위임 조건 결정권',CX,endY+1.10,3.20,BRONZE);
  s.addText('① 전속 · 비전속  ② 대상 지역  ③ 위임 기간  ④ 직영·타 대행사 병행 여부 — 이 네 가지는\n본사가 정해 주시면 그대로 따릅니다. 저희가 먼저 조건을 요구하지 않습니다.',
    t({x:CX+3.30,y:endY+1.04,w:CW-3.30,h:0.34,fontSize:9,color:BODY,lineSpacing:13,valign:'middle'}));

  ledger(s,'위임 시 본사가 추가로 채용해야 할 영업 인력','0','명');
  s.addNotes('위임해 주시면 저희가 수행하는 업무 여섯 가지입니다. 본사는 자료 승인과 계약 체결만 하시면 됩니다. 전속 여부와 지역·기간은 본사가 정하시는 대로 따릅니다.');
}

/* ══ 06 제휴 네트워크 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,6,'네트워크','제휴\n구조');
  head(s,'수요 · 브랜드 · 자리를 동시에 운용합니다','');
  lead(s,'창업 수요만 있는 것이 아니라, 그 수요를 앉힐 자리와 연결할 브랜드가 함께 있습니다.',1.55);

  // 3열 구조
  const bw=(CW-1.0)/3;
  const BOX=[
    ['수요','예비창업자 · 업종 전환 희망자','앱 10만 다운로드 · 월 5만 명 채널에서 창업 수요를 확보합니다',TEAL],
    ['브랜드','제휴 브랜드 · 파트너 80개 +','B2B 제휴 네트워크에서 조건에 맞는 브랜드를 매칭합니다',TEAL],
    ['자리','공인중개사 제휴망','리맥스코리아 등 제휴 중개망으로 입점지를 확보합니다',TEAL],
  ];
  BOX.forEach(([tag,ttl,d,c],i)=>{
    const x=CX+(bw+0.5)*i;
    line(s,x,2.20,bw,c,0.028);
    s.addText(tag,t({x,y:2.34,w:bw,h:0.24,fontSize:8,bold:true,color:c,charSpacing:1.4}));
    s.addText(ttl,t({x,y:2.60,w:bw,h:0.30,fontSize:13,bold:true,color:INK,lineSpacing:19}));
    s.addText(d,t({x,y:2.96,w:bw,h:0.52,fontSize:8.8,color:WEAK,lineSpacing:13.5}));
    if(i<2) s.addText('+',t({x:x+bw+0.06,y:2.62,w:0.38,h:0.4,fontSize:15,bold:true,color:VOID,align:'center',valign:'middle'}));
  });

  line(s,CX,3.62,CW,INK,0.014);
  slabel(s,'러너펍이 이 구조에 들어오면',CX,3.76,5,WEAK);
  const F2=[
    ['브랜드망에 러너펍 편입','상담 중인 창업자에게 러너펍을 후보 브랜드로 제시합니다. 별도 광고 없이 기존 상담 흐름에 편입됩니다'],
    ['중개망으로 입점지 확보','홀덤펍 조건에 맞는 상가를 제휴 중개망에서 물색합니다. 입지가 확보된 상태로 창업자에게 제안합니다'],
    ['기존 홀덤펍 접촉','매물 데이터와 제휴 중개망을 통해 리브랜딩 대상을 발굴합니다. 이미 운영 중인 점주라 전환 결정이 빠릅니다'],
  ];
  F2.forEach(([h1,d],i)=>{
    const y=4.10+i*0.825;
    s.addShape(p.ShapeType.rect,{x:CX,y:y+0.19,w:0.10,h:0.10,fill:{color:TEAL},line:{type:'none'}});
    s.addText(h1,t({x:CX+0.28,y,w:3.30,h:0.48,fontSize:10.2,bold:true,color:INK,valign:'middle'}));
    s.addText(d,t({x:CX+bw+0.5,y,w:CW-bw-0.5,h:0.48,fontSize:9.4,color:BODY,lineSpacing:14,valign:'middle'}));
    if(i<2) line(s,CX,y+0.64,CW);
  });

  ledger(s,'러너펍에 즉시 붙는 영업 경로','3','갈래',false,null,true);
  s.addNotes('저희는 수요, 브랜드, 자리 세 가지를 동시에 갖고 있습니다. 러너펍이 이 구조에 들어오면 세 방향에서 동시에 영업이 붙습니다.');
}

/* ══ 07 러너펍 진단 ══ */
{
  /* 3막 구조의 2막 — 배경 반전(INK). 이 페이지의 모든 색은 dark 팔레트를 쓴다. */
  const s=p.addSlide(); s.background={color:INK};
  frame(s,7,'진단','남은\n변수',true);
  head(s,'남은 변수는 창업자 접점 하나입니다','',true);
  lead(s,'러너러너 앱과 본사 검증 점포 추천, 가맹 절차 9단계까지 개설 이후를 받쳐 주는 구조는 본사가 이미 갖췄습니다.',1.55,true,10.4);

  const LW=5.80, RX7=CX+6.35, RW7=CW-6.35;   // 좌 5.80 / 거터 0.55 / 우 4.343
  const L=['러너러너 앱 — 예약·회원관리·정산·토너먼트·포스터생성·핸디랭킹·음료주문',
           '본사 검증 점포 추천 — 본사가 검증한 점포를 추천하는 체계',
           '준법 운영 체계 — 불법 요소를 배제하는 운영 기준',
           '가맹 절차 9단계 · 계약 → 오픈 4~6주',
           '브랜드 이벤트 — 래빗 페스티벌 · 시즌 랭킹전 · 매장 간 콜라보',
           '러너러너 앱 리뉴얼 후 플랫폼 서비스 이용자 1.5배 증가'];
  slabel(s,'이미 갖춰진 것',CX,2.16,4,ONWEAK);
  line(s,CX,2.40,LW,ONINK,0.012);
  L.forEach((v,i)=>{
    const y=2.58+i*0.60;
    s.addText(v,t({x:CX,y,w:LW-0.05,h:0.34,fontSize:9.2,color:ONINK,valign:'middle'}));
    line(s,CX,y+0.46,LW,ONRULE);
  });

  slabel(s,'남은 변수',RX7,2.16,4,ONBRONZE);
  line(s,RX7,2.40,RW7,ONBRONZE,0.012);
  s.addText('계약 가능한 창업자 모수',t({x:RX7,y:2.58,w:RW7,h:0.3,fontSize:12.5,bold:true,color:ONINK}));
  s.addText('계약 이전 구간의 접점 총량입니다.\n출점 속도를 좌우하는 변수는\n창업자 접점 하나입니다.',
    t({x:RX7,y:2.96,w:RW7,h:0.8,fontSize:9,color:ONWEAK,lineSpacing:13.5}));
  s.addText('내일사장이 담당하는 구간이 정확히 여기입니다.',
    t({x:RX7,y:3.84,w:RW7,h:0.3,fontSize:9.4,bold:true,color:TEAL3,valign:'middle'}));

  line(s,RX7,4.28,RW7,ONRULE);
  slabel(s,'접점을 확보하는 경로',RX7,4.40,3,ONWEAK);
  const RV=[['신규 창업자','플랫폼에 상주하는 창업 수요에서 접점을 만듭니다'],
            ['기존 홀덤펍','매물 데이터와 제휴 중개망에서 리브랜딩 대상을 발굴합니다']];
  RV.forEach(([k,v],i)=>{
    const y=4.70+i*0.56;
    s.addShape(p.ShapeType.rect,{x:RX7,y:y+0.06,w:0.08,h:0.08,fill:{color:ONBRONZE},line:{type:'none'}});
    s.addText(k,t({x:RX7+0.26,y:y-0.02,w:RW7-0.26,h:0.20,fontSize:9,bold:true,color:ONINK,valign:'middle'}));
    s.addText(v,t({x:RX7+0.26,y:y+0.19,w:RW7-0.26,h:0.30,fontSize:8.2,color:ONWEAK,lineSpacing:11.5}));
  });
  line(s,RX7,5.77,RW7,ONRULE);
  s.addText('두 경로 모두 계약 이전 구간의 상담·분석 비용은 내일사장이 부담합니다.',
    t({x:RX7,y:5.87,w:RW7,h:0.30,fontSize:8.4,color:TEAL3,lineSpacing:11.5}));

  ledger(s,'남은 변수 · 창업자 접점','1','개',true,null,true);
  s.addText('※ 러너러너 앱 운영사는 (주)러너소프트로 러너스튜디오(주)와 별개 법인입니다. 이용자 1.5배 증가는 IT비즈뉴스 2024.7.4 보도 기준.',
    t({x:CX,y:FOOTY,w:10.5,h:0.18,fontSize:7.2,color:ONWEAK}));
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
     [['접점','플랫폼 유입 창업 수요'],['절차','상권·손익 브리핑 → 계약'],['특성','모수 기반 · 검토 기간 필요'],['소구점','현재 프로모션 기준 개설 기본비용 전액 할인 · 4~6주 오픈']]],
    ['TRACK B','기존 홀덤펍 리브랜딩',TEAL2,
     [['접점','즉시 전환 대상 점주'],['절차','전환 상담 → 계약'],['특성','즉시 전환형 · 검토 기간 짧음'],['소구점','러너펍 브랜드 전환 · 예약·회원관리 체계 승계']]],
  ];
  TR.forEach(([tag,nm,c,rows],i)=>{
    const x=CX+i*(CW/2+0.24), w=CW/2-0.24;
    line(s,x,2.20,w,c,0.028);
    s.addText(tag,t({x,y:2.34,w,h:0.22,fontSize:8,bold:true,color:c,charSpacing:1.4}));
    s.addText(nm,t({x,y:2.58,w,h:0.34,fontSize:14,bold:true,color:INK}));
    rows.forEach(([k,v],j)=>{
      const y=3.08+j*0.556;
      s.addText(k,t({x,y,w:1.15,h:0.3,fontSize:8.4,color:WEAK,valign:'middle'}));
      s.addText(v,t({x:x+1.25,y,w:w-1.25,h:0.3,fontSize:9.4,color:BODY,valign:'middle'}));
      line(s,x,y+0.36,w);
    });
  });

  line(s,CX,5.44,CW,INK,0.012);
  slabel(s,'공통 운영 약속',CX,5.56,3,WEAK);
  const PR=['본사 승인 자료만 사용','러너펍 준법 운영 기준 준수','리드 최초 유입 경로로 실적 구분','주 단위 활동 리포트 제출'];
  PR.forEach((v,i)=>{
    const x=CX+(CW/4)*i;
    s.addShape(p.ShapeType.rect,{x,y:5.88,w:0.09,h:0.09,fill:{color:TEAL},line:{type:'none'}});
    s.addText(v,t({x:x+0.2,y:5.80,w:CW/4-0.34,h:0.4,fontSize:8.8,color:BODY,lineSpacing:12.5}));
  });

  ledger(s,'영업 트랙 · 활동 보고','2','트랙 · 주 단위 보고',false,null,true);
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
    [{v:'광고비'},'가맹 개설 영업 대가로는 청구하지 않습니다 (LSM 집행 기준은 P.10)',{v:'0 원',b:true,c:WEAK}],
    [{v:'성공보수',b:true},'가맹계약 체결 및 가맹비 입금 완료 후',{v:'1,000 만원',b:true,c:BRONZE}],
  ];
  table(s,CX,2.20,[{h:'항목',w:2.4},{h:'발생 시점',w:CW-4.9},{h:'금액',w:2.5,a:'right'}],rows,{rh:0.48,fs:9.2});

  line(s,CX,4.66,CW,INK,0.012);
  slabel(s,'정산 기준',CX,4.76,3,WEAK);
  const R9=[['청구 시점','가맹계약 체결과 가맹비 입금이 모두 확인된 뒤에 청구합니다'],
            ['미계약 건 원가','상담·분석·브리핑과 창업마케팅에 들어간 비용은 전부 내일사장이 부담하며 본사에 청구하지 않습니다'],
            ['해제 · 환불 시 처리','가맹계약이 해제되거나 가맹비가 환불되는 경우의 처리 기준은 본사 정책에 맞춰 착수 전 협의합니다']];
  R9.forEach(([k,v],i)=>{
    const y=5.02+i*0.42;
    s.addText(k,t({x:CX,y,w:2.4,h:0.3,fontSize:8.8,bold:true,color:WEAK,valign:'middle'}));
    s.addText(v,t({x:CX+2.4,y,w:CW-2.4,h:0.3,fontSize:9.2,color:BODY,valign:'middle'}));
    if(i<R9.length-1) line(s,CX,y+0.36,CW);
  });
  s.addText('※ 성공보수는 부가가치세 별도입니다.',t({x:CX,y:FOOTY,w:5,h:0.18,fontSize:7.2,color:FOOTC}));

  ledger(s,'계약 · 입금 완료 전 내일사장에 지급하는 현금','0','원');
  s.addNotes('계약 전에는 본사가 내실 돈이 없습니다. 청구는 계약 체결과 가맹비 입금이 모두 확인된 뒤에만 발생합니다.');
}

/* ══ 10 네고·LSM·인테리어 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,10,'조건','변동\n방어');
  head(s,'창업자가 깎은 금액은 전액 내일사장 몫에서 차감합니다','');
  lead(s,'네고가 어디까지 진행되든 본사 순수취는 500만원 그대로입니다. 줄어드는 구간은 내일사장 성공보수 하나입니다.',1.55,false,10.4);

  const rows=[
    ['네고 없음',{v:'1,500 만원'},{v:'(1,000)',c:BRONZE},{v:'500 만원',b:true,c:INK}],
    ['네고 발생',{v:'1,500 − 할인액'},{v:'(1,000 − 할인액)',c:BRONZE},{v:'500 만원',b:true,c:INK}],
    ['할인 1,000만원 가정 시',{v:'500 만원'},{v:'0',c:BRONZE},{v:'500 만원',b:true,c:INK}],
  ];
  table(s,CX,2.20,[{h:'시나리오',w:3.9},{h:'창업자 납입',w:2.3,a:'right'},
                   {h:'내일사장 성공보수',w:2.3,a:'right'},{h:'본사 순수취',w:CW-8.5,a:'right'}],rows,{rh:0.39,fs:9.2});

  s.addShape(p.ShapeType.rect,{x:CX,y:4.04,w:0.09,h:0.09,fill:{color:BRONZE},line:{type:'none'}});
  s.addText('할인 적용 여부와 한도는 건별로 본사 승인 후 확정하며, 내일사장이 단독으로 조건을 제시하지 않습니다.',
    t({x:CX+0.26,y:3.96,w:CW-0.26,h:0.24,fontSize:9,bold:true,color:BRONZE,valign:'middle'}));

  slabel(s,'LSM 광고 집행 기준 · 내일사장 수취 구간',CX,4.27,5,WEAK);
  const rows2=[
    [{v:'800만원 이하',b:true},{v:'본사 집행',c:BRONZE,b:true},'본사 정책에 따라 집행하며 내일사장은 청구하지 않습니다'],
    [{v:'800만원 초과 ~ 1,000만원 미만',b:true},{v:'협의',c:WEAK,b:true},'집행 주체와 금액을 양사 협의로 결정'],
    [{v:'1,000만원 전액 수취',b:true},{v:'내일사장 집행',c:TEAL,b:true},'수취액 중 200만원을 해당 매장 LSM 광고비로 집행'],
  ];
  const e10=table(s,CX,4.49,[{h:'내일사장 수취 구간',w:3.9},{h:'집행 주체',w:2.3},{h:'기준',w:CW-6.2}],rows2,{rh:0.39,fs:9.2,header:false});

  s.addShape(p.ShapeType.rect,{x:CX,y:e10+0.30,w:0.09,h:0.09,fill:{color:BRONZE},line:{type:'none'}});
  s.addText('인테리어 시공 참여',t({x:CX+0.26,y:e10+0.22,w:3.64,h:0.26,fontSize:9.2,bold:true,color:BRONZE,valign:'middle'}));
  s.addText('내일사장이 시공을 진행할 수 있으며, 개설 과정의 추가 수익 분배는 착수 전 별도 협의합니다.',
    t({x:CX+3.9,y:e10+0.22,w:CW-3.9,h:0.26,fontSize:9.2,color:BODY,valign:'middle'}));

  s.addText('※ 할인 상한은 본사 정책 사항이며, 위 표의 1,000만원은 내일사장 성공보수가 소진되는 지점을 보여 주는 가정값입니다.',
    t({x:CX,y:FOOTY,w:10,h:0.18,fontSize:7.2,color:FOOTC}));

  ledger(s,'할인 1,000만원까지 · 본사 순수취','500','만원 불변');
  s.addNotes('네고는 저희 몫에서 부담합니다. 창업자가 얼마를 깎든 본사 순수취는 500만원 그대로입니다.');
}

/* ══ 11 회수 구조 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,11,'수지','회수\n구조');
  head(s,'계약 시점부터 흑자이고, 이후 로열티는 전액 순증입니다','');
  lead(s,'가맹비 1,500만원 안에서 성공보수 1,000만원이 정산되고, 남는 500만원부터가 본사 순수익입니다. 이후 월 로열티 150만원은 전액 순증입니다.',1.55,false,10.4);

  // 좌: 계약 시점 계산 (좌 블록 폭 4.2 · 거터 0.40)
  const LW11=4.2;
  slabel(s,'계약 1건 · 계약 시점',CX,2.16,3,WEAK);
  const calc=[['가맹비 (본사 수취)','+1,500',INK],['성공보수 (내일사장)','−1,000',BRONZE]];
  calc.forEach(([k,v,c],i)=>{
    const y=2.48+i*0.44;
    s.addText(k,t({x:CX,y,w:2.6,h:0.3,fontSize:9.4,color:BODY,valign:'middle'}));
    s.addText([{text:v,options:{fontSize:12.5,bold:true,color:c}},{text:' 만원',options:{fontSize:8.4,color:WEAK}}],
      t({x:CX+2.4,y,w:1.8,h:0.3,align:'right',valign:'middle'}));
    line(s,CX,y+0.36,LW11);
  });
  s.addText('계약 시점 본사 순수익',t({x:CX,y:3.44,w:2.6,h:0.32,fontSize:9.6,bold:true,color:INK,valign:'middle'}));
  s.addText([{text:'+500',options:{fontSize:19,bold:true,color:TEAL}},{text:' 만원',options:{fontSize:8.4,color:WEAK}}],
    t({x:CX+2.1,y:3.40,w:2.1,h:0.38,align:'right',valign:'middle'}));
  line(s,CX,3.86,LW11,INK,0.012);
  s.addText('개설 기본비용 1,600만원은 본사 프로모션으로 전액 할인 중이며,\n위 계산에는 포함하지 않았습니다.',
    t({x:CX,y:4.00,w:LW11,h:0.44,fontSize:8.6,color:WEAK,lineSpacing:12.5}));

  line(s,CX,4.64,LW11,INK,0.012);
  slabel(s,'성공보수의 성격',CX,4.78,3,WEAK);
  const K11=[['1회성','계약 1건에 한 번만 발생합니다'],
             ['가맹비 내 정산','추가 예산 편성이 필요하지 않습니다'],
             ['로열티는 순증','월 150만원은 전액 본사 수익으로 남습니다']];
  K11.forEach(([k,v],i)=>{
    const y=5.04+i*0.42;
    s.addText(k,t({x:CX,y,w:1.5,h:0.28,fontSize:8.8,bold:true,color:WEAK,valign:'middle'}));
    s.addText(v,t({x:CX+1.6,y,w:LW11-1.6,h:0.28,fontSize:8.6,color:BODY,valign:'middle'}));
  });

  // 우: 누적 막대 (BX=CX+4.6 · 막대폭 BW-2.6)
  const BX=CX+4.6, BW=CW-4.6;
  slabel(s,'이후 누적 본사 수익 · 월 로열티 150만원 반영',BX,2.16,BW,WEAK);
  const B=[['계약 시점',500],['12개월',2300],['24개월',4100],['36개월',5900]];
  B.forEach(([k,v],i)=>{
    const y=2.48+i*0.52;
    s.addText(k,t({x:BX,y,w:1.2,h:0.3,fontSize:9,bold:true,color:BODY,valign:'middle'}));
    bar(s,BX+1.3,y+0.06,BW-2.6,v/5900,i===3?TEAL:TEAL2,0.18);
    s.addText([{text:v.toLocaleString(),options:{fontSize:11.5,bold:true,color:i===3?TEAL:INK}},
               {text:' 만원',options:{fontSize:8,color:WEAK}}],
      t({x:BX+BW-1.3,y,w:1.3,h:0.3,align:'right',valign:'middle'}));
  });
  line(s,BX,4.64,BW);
  const SC=[['3개점',' 1억 7,700'],['5개점',' 2억 9,500']];
  slabel(s,'출점 규모별 36개월 누적',BX,4.78,3,WEAK);
  SC.forEach(([k,v],i)=>{
    const x=BX+(BW/2)*i;
    s.addText(k,t({x,y:5.10,w:1.2,h:0.22,fontSize:8.4,color:WEAK,valign:'middle'}));
    s.addText([{text:v.trim(),options:{fontSize:12.5,bold:true,color:INK}},{text:' 만원',options:{fontSize:8,color:WEAK}}],
      t({x,y:5.32,w:BW/2-0.3,h:0.3,valign:'middle'}));
    if(i) vline(s,x-0.24,5.10,0.52,VOID);
  });
  s.addText('위 누적액에는 인테리어 시공·개설 과정의 추가 수익은 포함하지 않았습니다.',
    t({x:BX,y:5.88,w:BW,h:0.28,fontSize:8.6,color:WEAK,lineSpacing:12.5}));

  ledger(s,'10개점 출점 시 · 36개월 누적','5억 9,000','만원');
  s.addText('※ 러너펍 공개 가맹 안내 기준(가맹비 1,500만원 / 월 로열티 150만원 · 부가세 별도) 시뮬레이션이며 실제 조건은 본사 정책에 따릅니다. 폐점·중도해지는 반영하지 않았습니다.',
    t({x:CX,y:FOOTY,w:CW,h:0.18,fontSize:7.2,color:FOOTC}));
  s.addNotes('본사가 가장 먼저 하실 계산이 500만원밖에 안 남는다는 것일 텐데, 그 500만원은 계약 시점에 이미 흑자라는 뜻입니다. 본체는 월 로열티입니다.');
}

/* ══ 12 준법·리드귀속·검증 ══ */
{
  const s=p.addSlide(); s.background={color:PAPER};
  frame(s,12,'통제','준법 · 귀속\n검증');
  head(s,'홀덤 업종 경험은 장치로 대체하고, 준법·귀속은 본사 기준을 따릅니다','');
  lead(s,'업종 경험 공백은 아래 네 가지 장치로 메웁니다. 그 위에서 정보제공 책임이 본사에 있는 항목은 본사가 직접 수행하고, 내일사장은 보조 범위 안에서만 움직입니다.',1.55,false,10.6);

  /* 최상단 — 업종 경험 대체 장치 (이 문서 최대 반론에 대한 답) */
  /* 좌우 대칭 그리드 — 총폭 CW · 거터 0.50 · 각 컬럼 5.0965 */
  const HW=(CW-0.5)/2, RX12=CX+HW+0.5;
  slabel(s,'홀덤 업종 경험을 대체하는 장치',CX,2.16,4,BRONZE);
  line(s,CX,2.42,CW,BRONZE,0.014);
  const r3=[
    '리브랜딩 트랙은 운영 중인 점주가 대상이라 업종 지식 부담이 낮습니다',
    '입지·손익·계약 절차는 업종에 무관하게 반복되는 영역입니다',
    '본사가 제공하는 브랜드·상품·준법 자료를 사전 숙지한 뒤 착수합니다',
    '초기 구간은 파일럿으로 운영하고, 건수와 기간은 본사가 정하십니다',
  ];
  r3.forEach((v,i)=>{
    const x=CX+(i%2)*(HW+0.5), y=2.58+Math.floor(i/2)*0.46;
    s.addText(`0${i+1}`,t({x,y,w:0.4,h:0.28,fontSize:7.6,bold:true,color:BRONZE,valign:'middle'}));
    s.addText(v,t({x:x+0.44,y,w:HW-0.44,h:0.28,fontSize:9,color:BODY,valign:'middle'}));
  });
  line(s,CX,3.46,CW);

  const r1=[
    ['정보공개서 · 계약서','본사가 제공, 내일사장은 전달·설명 보조'],
    ['법정 숙려기간','체결 전 숙려기간 준수, 기간 단축 유도 금지'],
    ['예상매출 진술','예상매출·수익 구두 약속 금지, 본사 승인 문구만 사용'],
    ['광고·상담 스크립트','본사 사전 승인 후 사용'],
    ['위반 확인 시','해당 건 영업 즉시 중단, 본사 통보'],
  ];
  slabel(s,'준법 운영 기준',CX,3.68,3,WEAK);
  table(s,CX,3.94,[{h:'항목',w:1.75},{h:'적용 방식',w:3.35}],r1,{rh:0.42,fs:9.2,header:false});

  const r2=[
    ['귀속 기준','리드가 최초로 유입된 경로 기준으로 실적을 구분합니다'],
    ['본사 인바운드','본사 문의·본사 직영 영업 유입 건은 성공보수 대상이 아닙니다'],
    ['선등록 확인','본사 DB에 선등록 이력이 있으면 최초 유입을 본사로 봅니다'],
    ['증빙 방법','내일사장 발굴 건은 ERP 등록 기록으로 확인합니다'],
    ['이견 처리','주 단위 리포트 수령 후 이의제기, 최종 판정은 본사 자료 기준'],
  ];
  slabel(s,'리드 귀속 규칙',RX12,3.68,3,WEAK);
  table(s,RX12,3.94,[{h:'항목',w:1.75},{h:'기준',w:3.35}],r2,{rh:0.42,fs:9.2,header:false});

  ledger(s,'준법 · 귀속 판정은 본사 자료 기준 · 활동 리포트 제출','주 1','회',false,null,true);
  s.addNotes('브랜드와 준법 책임은 전부 본사 기준을 따릅니다. 리드 귀속도 규칙을 먼저 정해두었습니다.');
}

/* ══ 13 클로징 ══ */
{
  const s=p.addSlide(); s.background={color:INK};
  frame(s,13,'CLOSE','검증\n방식',true);
  head(s,'파일럿 구간으로 시작하고, 검증 기준은 본사가 정하시면 됩니다','',true);
  lead(s,'검증 기간과 판단 지표를 본사가 정하시고, 그 기준으로 첫 구간을 평가하시면 됩니다. 아래 회신처로 검토 결과를 알려 주시면 즉시 협의를 시작하겠습니다.',1.55,true,10.6);

  const V=[['검증 기간','본사가 정하시는 기간 — 착수 전 별지로 확정'],
           ['목표 건수','본사가 정하시는 목표 — 착수 전 별지로 확정'],
           ['평가 지표','신규 리드 수 · 상담 진행 수 · 가맹계약 체결 건수'],
           ['보고','주 단위 리포트 — 활동 지표와 단계별 파이프라인 포함'],
           ['착수 조건','본사 승인 자료 확정 후 즉시 착수 · 착수금 없음'],
           ['기간 종료 시','연장 또는 종료를 본사가 단독 결정']];
  slabel(s,'파일럿 운영 기준',CX,2.16,3,ONWEAK);
  line(s,CX,2.40,6.9,ONINK,0.012);
  V.forEach(([k,v],i)=>{
    const y=2.52+i*0.46;
    s.addText(k,t({x:CX,y,w:2.2,h:0.3,fontSize:9,color:ONWEAK,valign:'middle'}));
    s.addText(v,t({x:CX+2.3,y,w:4.6,h:0.3,fontSize:9.2,color:ONINK,valign:'middle'}));
    line(s,CX,y+0.36,6.9,ONRULE);
  });

  slabel(s,'요약',CX+7.4,2.16,2,ONWEAK);
  line(s,CX+7.4,2.40,CW-7.4,ONINK,0.012);
  const SUM=['모수 보유 — 창업 수요를 새로 만들지 않습니다',
             '업무 완비 — 상권·손익·브리핑·ERP·점포개발 직접 운영',
             '계약 전 비용 — 착수금·월 고정비·광고비 없음',
             '계약 시점 +500만원 — 회수 대기 기간 없음'];
  SUM.forEach((v,i)=>{
    const y=2.56+i*0.52;
    s.addShape(p.ShapeType.rect,{x:CX+7.4,y:y+0.10,w:0.09,h:0.09,fill:{color:TEAL3},line:{type:'none'}});
    s.addText(v,t({x:CX+7.66,y,w:CW-7.66,h:0.42,fontSize:8.8,color:ONINK,lineSpacing:12.5}));
  });

  /* 서명 밴드 — 3열 baseline 상수 (파일럿 표 하단선 5.18 로부터 0.26 이격) */
  const SIG_L=5.44, SIG_V=5.62, SIG_R=5.86, SIG_S=5.92;

  s.addImage({path:path.join(A,'logo.png'),x:CX+7.4,y:4.62,w:1.55,h:0.51});
  s.addText('수신',t({x:CX+7.4,y:SIG_L,w:1,h:0.18,fontSize:7,color:ONWEAK}));
  s.addText('러너스튜디오(주) 귀중 · 대표 박경관',t({x:CX+7.4,y:SIG_V,w:3.29,h:0.24,fontSize:8.4,color:ONINK}));
  s.addText('서울 강남구 삼성로100길 12 제이타워 B2',t({x:CX+7.4,y:SIG_S,w:3.29,h:0.2,fontSize:7.4,color:ONWEAK}));

  s.addText('발신',t({x:CX,y:SIG_L,w:1,h:0.18,fontSize:7,color:ONWEAK}));
  s.addText('내일사장',t({x:CX,y:SIG_V-0.02,w:2.5,h:0.32,fontSize:14,bold:true,color:ONINK}));
  s.addText('생성형 AI 기반 창업 지원 플랫폼',t({x:CX,y:SIG_S,w:2.5,h:0.20,fontSize:8.4,color:ONWEAK}));

  /* 회신처 — 발송 전 기입란 (담당·연락처·이메일 1행) */
  const RC=CX+2.7;
  [['담당',RC,1.30],['연락처',RC+1.45,1.40],['이메일',RC+3.00,1.55]].forEach(([k,x,w])=>{
    s.addText(k,t({x,y:SIG_L,w,h:0.18,fontSize:7,color:ONWEAK}));
    line(s,x,SIG_R,w,ONWEAK);
  });

  ledger(s,'검증 기간 종료 시 본사 잔여 비용','0','원',true);
  s.addText('※ 계약 시점 +500만원은 러너펍 공개 가맹 안내 기준 시뮬레이션이며 실제 조건은 본사 정책에 따릅니다.',
    t({x:CX,y:FOOTY,w:CW,h:0.18,fontSize:7.2,color:ONWEAK}));
  s.addNotes('파일럿 한 건으로 시작하시면 됩니다. 기준은 본사가 정하시고, 종료하셔도 남는 비용은 없습니다.');
}

const OUT='/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v3/runnerpub_wide.pptx';

/* pptxgenjs 4.0.1 은 line:{type:'none'} 을 빈 <a:ln></a:ln> 로 내보낸다.
   외곽선 없음을 렌더러에 의존하지 않고 확정하기 위해 <a:noFill/> 을 명시한다. */
p.writeFile({fileName:OUT})
 .then(async f=>{
   const fs=require('fs'), JSZip=require('jszip');
   const z=await JSZip.loadAsync(fs.readFileSync(f));
   let n=0;
   for(const name of Object.keys(z.files)){
     if(!/^ppt\/slides\/slide\d+\.xml$/.test(name)) continue;
     const xml=await z.file(name).async('string');
     const fixed=xml.replace(/<a:ln><\/a:ln>/g,()=>{n++;return '<a:ln><a:noFill/></a:ln>';});
     if(n) z.file(name,fixed);
   }
   fs.writeFileSync(f,await z.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));
   console.log('WROTE',f,'| a:ln noFill 명시',n,'건');
 });
