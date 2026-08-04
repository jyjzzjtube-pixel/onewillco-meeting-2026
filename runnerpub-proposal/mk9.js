/* 러너펍 가맹 개설 영업 전면 위임 제안 — 주식회사 내일사장
   v9 · 내일사장 IR 어법 이식. 화이트 지배 + 옅은 그라데이션. 15장.
   · 헤드는 명사형 2행, 마침표 없음     · 리드는 08 · 15 두 장만
   · 결론 띠는 챕터 종료 2장(02 · 10)만  · 초대형 수치는 04 한 장만
   · 노란 형광 0건 · 다크 면은 표지 하단 띠 하나 · 러닝 푸터 없음        */
const NM = '/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/node_modules';
const pptxgen = require(NM + '/pptxgenjs');
const p = new pptxgen();
p.layout = 'LAYOUT_WIDE';
p.author = '주식회사 내일사장'; p.company = '주식회사 내일사장';
p.title = '러너펍 가맹 개설 영업 전면 위임 제안 — 내일사장';

const K = require('./kit9.js')(p);
const { C,T,t,G,A,path, rect,rrect,bg,grad,hr,vr, tx,runs, frame,anchor,head,head2,lead,note,
        bandSentence, sectionBar,tagChip, check,icon,iconRow,stepBadge,pill,card,bar,table,
        tri,rail,chart2, BODY, SAFE,Y,span,region,split,pad,at,fit,img,setSlide } = K;

const P = (f)=>path.join(A,f);
const RIGHT = SAFE.x + SAFE.w;                       // 12.583
const FULL  = ()=>region('full',0,0,G.W,G.H);
const GBAR  = P('gr_bar_h.png');

/* 공통 — 지면 그라데이션 + 챕터 마크 */
function page(no, chapNo, chapEn, gradient){
  const s = p.addSlide(); bg(s,C.WHITE);
  if(gradient) grad(s,FULL(),{x:0,y:0,w:G.W,h:G.H},'gr_page.png',C.WHITE);
  frame(s,no,chapNo);
  if(chapEn) anchor(s,chapEn);
  return s;
}
/* 회색 각주 — 수치 블록 바로 아래 */
function foot(s,reg,x,y,w,str,size){
  tx(s,reg,{x,y,w,h:0.22},str,T.note,{size:size||8.5,color:C.MUTE,valign:'middle'});
}
/* 가로 그라데이션 막대 */
function gbar(s,reg,x,y,w,h){
  s.addImage({path:GBAR, ...G.imgFree(reg,{x,y,w:Math.max(0.08,w),h},GBAR)});
}

/* ══════════════ 01 표지 ══════════════ */
{
  const s = p.addSlide(); bg(s,C.WHITE);
  const F = FULL();
  grad(s,F,{x:0,y:0,w:G.W,h:5.62},'gr_page.png',C.WHITE);
  grad(s,F,{x:0,y:5.62,w:G.W,h:G.H-5.62},'gr_cover.png',C.NAVY);
  setSlide(1);

  const pf = P('cover_phones.png'), pw = 3.80, ph = pw/G.imgAspect(pf);
  s.addImage({path:pf, ...img(F,{x:0.95,y:0.62,w:pw,h:ph},pf)});
  tx(s,F,{x:0.95,y:0.70+ph,w:pw+1.0,h:0.24},'내일사장 앱 — 실매출 검증 · 인증 리포트',T.note,
    {size:9,color:C.MUTE,valign:'middle'});

  const RX = 5.90, RW = RIGHT-RX;
  tx(s,F,{x:RX,y:1.24,w:RW,h:0.26},'가맹 개설 영업 위임 제안',T.label,
    {size:11,color:C.BLUE,cs:2.8,valign:'middle'});
  hr(s,RX,1.62,1.60,C.BLUE,0.030);
  tx(s,F,{x:RX,y:1.92,w:RW,h:1.42},
    runs('러너펍 가맹 개설 영업\n[전면 위임] 제안',false),T.head,{size:35,ls:48});
  hr(s,RX,3.58,RW,C.RULE);
  tx(s,F,{x:RX,y:3.74,w:RW,h:0.24},'가맹계약 1건당 성공보수 (VAT 별도)',T.note,
    {size:9.5,color:C.MUTE,valign:'middle'});
  s.addText([{text:'1,000',options:{fontSize:42,bold:true,color:C.BLUE,charSpacing:-1.4}},
             {text:' 만원',options:{fontSize:16,bold:true,color:C.BLUE}}],
    t({...at(F,{x:RX,y:4.00,w:RW,h:0.78},{kind:'fig',pt:42}),valign:'middle'}));
  foot(s,F,RX,4.86,RW,'※ 계약 체결 및 가맹비 입금 완료 건에만 청구 · 착수금 · 월 고정비 · 광고비 없음',9);

  const lw = 1.34, lh = lw/3.7009;
  s.addImage({path:P('ns_logo_w.png'), ...img(F,{x:SAFE.x,y:6.30,w:lw,h:lh},P('ns_logo_w.png'))});
  icon(s,F,SAFE.x+lw+0.24,6.34,0.24,'arrow',true);
  const rw = 1.46, rh = rw/3.045;
  s.addImage({path:P('logo.png'), ...img(F,{x:SAFE.x+lw+0.70,y:6.28,w:rw,h:rh},P('logo.png'))});
  tx(s,F,{x:RIGHT-5.2,y:6.34,w:5.2,h:0.26},'수신  러너스튜디오(주) 귀중 · 대표 박경관',T.body,
    {size:10.5,color:C.INK_ON,align:'right',valign:'middle'});
  s.addNotes('발신은 주식회사 내일사장입니다. 가맹 개설 영업을 전면 위임받겠다는 제안입니다.');
}

/* ══════════════ 02 01 Problem — 결론 띠 ══════════════ */
{
  const s = page(2,'01','Problem',true);
  head2(s,'창업자를 멈추게 하는\n[판단 근거]의 부재');

  const B = BODY('full');
  const Rw = G.rows(B,[['path',1.28,'fix'],['gap',0.18,'fix'],['tbl',1]]);

  sectionBar(s,Rw.path,Rw.path.x,Rw.path.y,5.60,'주요 창업 경로 1');
  sectionBar(s,Rw.path,Rw.path.x+6.23,Rw.path.y,5.60,'주요 창업 경로 2');
  [[0,'포털사이트 검색','컨설턴트(프랜차이즈) 매물 추천','브랜드 정보 출처 — 컨설턴트'],
   [6.23,'지인 · 커뮤니티','공인중개사 사무소 방문','매물 정보 출처 — 중개사']].forEach(([dx,a,b,tail])=>{
    const x = Rw.path.x+dx, y = Rw.path.y+0.52;
    rrect(s,at(Rw.path,{x,y,w:1.72,h:0.40},{kind:'chip'}),C.BLUEBG,0.06);
    tx(s,Rw.path,{x:x+0.12,y,w:1.48,h:0.40},a,T.body,{size:10,valign:'middle'});
    icon(s,Rw.path,x+1.80,y+0.08,0.24,'arrow',false);
    rrect(s,at(Rw.path,{x:x+2.12,y,w:2.44,h:0.40},{kind:'chip'}),C.BLUEBG,0.06);
    tx(s,Rw.path,{x:x+2.24,y,w:2.20,h:0.40},b,T.body,{size:10,valign:'middle'});
    icon(s,Rw.path,x+4.64,y+0.08,0.24,'arrow',false);
    rrect(s,at(Rw.path,{x:x+4.96,y,w:0.64,h:0.40},{kind:'chip'}),C.GRAY,0.06);
    tx(s,Rw.path,{x:x+4.96,y,w:0.64,h:0.40},'계약',T.body,
      {size:10,bold:true,color:C.NAVY,align:'center',valign:'middle'});
    tx(s,Rw.path,{x,y:y+0.46,w:5.60,h:0.26},tail,T.note,{size:8.5,color:C.MUTE,valign:'middle'});
  });

  sectionBar(s,Rw.tbl,Rw.tbl.x,Rw.tbl.y,Rw.tbl.w,'이해관계자별 거래 목적과 문제 내용');
  const tb = region('tb',Rw.tbl.x,Rw.tbl.y+0.46,Rw.tbl.w,Rw.tbl.h-0.60);
  { const rh=(tb.h-0.38)/3;
    for(let i=1;i<3;i+=2) rect(s,at(tb,{x:tb.x,y:tb.y+0.38+rh*i,w:tb.w,h:rh},{kind:'row'}),C.BLUEBG0); }
  table(s,tb,[{h:'이해관계자',w:2.10},{h:'거래 목적',w:4.20},{h:'문제 내용',w:tb.w-6.30}],[
    ['양도자','높은 권리금 수취, 빠른 거래 종결',{v:'영업이익의 과장',b:true}],
    ['중개사','임대인을 대변, 중개 수수료 수취',{v:'인수 후 매출 및 손익과 무관',b:true}],
    ['컨설팅 업체','높은 수수료 수취',{v:'허위 과장 매물 브리핑',b:true}],
  ],{rh:(tb.h-0.38)/3});

  bandSentence(s,'검증되지 않은 정보와 과장된 매출 · 수익 등 불확실한 정보취득으로 [계약 지연 및 개설 건수 미달 초래]');
  s.addNotes('창업자가 결정을 못 하는 이유는 의지가 아니라 믿을 근거가 없어서입니다.');
}

/* ══════════════ 03 01 Problem — 보유 자산 · 미확보 변수 ══════════════ */
{
  const CUT = 7.30;
  const s = p.addSlide(); bg(s,C.WHITE);
  grad(s,FULL(),{x:CUT,y:0,w:G.W-CUT,h:G.H},'gr_panelh.png',C.BLUEBG0);
  frame(s,3,'01'); anchor(s,'Problem');
  head2(s,'러너펍 [보유 자산] 현황과\n미확보 변수',{x:SAFE.x,w:6.20});

  const B = BODY('ir');
  const L = region('aL',SAFE.x,B.y,CUT-SAFE.x-0.46,B.h);
  const RX = CUT+0.42, R = region('aR',RX,B.y,RIGHT-RX,B.h);

  sectionBar(s,L,L.x,L.y,L.w,'보유 자산 현황');
  ['러너러너 앱 (예약 · 회원관리 · 정산 · 토너먼트)','본사 검증 점포 추천 체계',
   '준법 운영 기준','가맹 절차 9단계 · 계약에서 오픈까지 4~6주',
   '래빗 페스티벌 · 시즌 랭킹전 · 매장 간 콜라보','앱 리뉴얼 후 플랫폼 이용자 1.5배 증가'].forEach((v,i)=>{
    const y = L.y+0.62+i*0.56;
    check(s,L,L.x,y+0.05,0.20);
    tx(s,L,{x:L.x+0.32,y,w:L.w-0.32,h:0.30},v,T.body,{size:11,valign:'middle'});
  });
  foot(s,L,L.x,L.y+3.94,L.w,'출처 : IT비즈뉴스(2024.7.4) · 앱 리뉴얼 후 플랫폼 이용자 증가분');

  sectionBar(s,R,R.x,R.y,R.w,'미확보 변수',{bg:C.WHITE});
  tx(s,R,{x:R.x+0.18,y:R.y+0.52,w:R.w-0.18,h:0.34},'계약 가능한 창업자 모수',T.sub,
    {size:16,color:C.BLUE,valign:'middle'});
  tx(s,R,{x:R.x+0.18,y:R.y+0.92,w:R.w-0.36,h:0.46},
    '개설 속도를 결정하는 계약 이전 구간의 접점 총량',T.cardtx,{size:9.5,color:C.MUTE});
  const pf = P('p11_pub.png'), pw = 3.00, ph = pw/1.778;
  s.addImage({path:pf, ...img(R,{x:R.x+(R.w-pw)/2,y:R.y+1.50,w:pw,h:ph},pf)});
  const yb = R.y+1.60+ph;
  rrect(s,at(R,{x:R.x,y:yb,w:R.w,h:0.86},{kind:'card'}),C.WHITE,0.08);
  icon(s,R,R.x+0.18,yb+0.30,0.24,'arrow',false);
  tx(s,R,{x:R.x+0.50,y:yb+0.14,w:R.w-0.68,h:0.24},'내일사장이 채우는 값',T.note,
    {size:9,color:C.MUTE,valign:'middle'});
  tx(s,R,{x:R.x+0.50,y:yb+0.40,w:R.w-0.68,h:0.28},'예비창업자 상담 DB 5,114명',T.body,
    {size:11,bold:true,color:C.BLUE,valign:'middle'});
  s.addNotes('러너펍은 개설 이후 구조가 완비돼 있습니다. 남은 변수는 창업자 모수입니다.');
}

/* ══════════════ 04 02 Solution — 확보된 창업 수요 (초대형 수치는 이 장만) ══════════════ */
{
  const s = page(4,'02','Solution',true);
  head2(s,'이번 제안 이전에\n[확보된 창업 수요]');

  const B = BODY('ir');
  const Rw = G.rows(B,[['k',2.26,'fix'],['gap',0.22,'fix'],['cmp',1]]);
  const KP = [['앱 누적 다운로드','100,000','+',[['2023',3],['2024',8],['2026',10]],'2026.07 누적 기준'],
              ['월간 활성 이용자 MAU','50,000','+',null,'2026.07 기준'],
              ['예비창업자 상담 DB','5,114','명',null,'2026.06 사내 기준 · 상담 기록 499건'],
              ['누적 매물 거래 규모','1,600','억원',null,'2026.07 누적 · 매물 등록 10,000건']];
  const kc = split(Rw.k,4,0.28);
  KP.forEach(([lab,val,unit,bars,cap],i)=>{
    const c = kc[i];
    tx(s,c,{x:c.x,y:c.y,w:c.w,h:0.26},lab,T.note,{size:9.5,color:C.MUTE,valign:'middle'});
    s.addText([{text:val,options:{fontSize:36,bold:true,color:C.NAVY,charSpacing:-1.4}},
               {text:' '+unit,options:{fontSize:13,bold:true,color:C.BLUE}}],
      t({...at(c,{x:c.x,y:c.y+0.30,w:c.w,h:0.64},{kind:'fig',pt:36}),valign:'middle'}));
    if(bars) bars.forEach(([yy,v],k)=>{
      const y = c.y+1.06+k*0.26;
      tx(s,c,{x:c.x,y,w:0.52,h:0.22},yy,T.note,{size:8.5,color:C.MUTE,valign:'middle'});
      gbar(s,c,c.x+0.56,y+0.05,(c.w-1.16)*v/10,0.13);
      tx(s,c,{x:c.x+c.w-0.56,y,w:0.56,h:0.22},`${v}만`,T.glabel,
        {size:9,color:C.BLUE,align:'right',valign:'middle'});
    });
    else gbar(s,c,c.x,c.y+1.10,c.w*0.54,0.09);
    foot(s,c,c.x,c.y+1.92,c.w,cap,8);
  });

  sectionBar(s,Rw.cmp,Rw.cmp.x,Rw.cmp.y,Rw.cmp.w,'인증서비스 활용 전후 비교');
  [['자영업자 1년 생존률','67 %','99 %','↑ 22%','* (23년 기준) 1년 생존률'],
   ['양도양수 성공비율','47 %','80 %','↑ 33%','* 내일사장 인증 서비스 이용 건 기준']].forEach(([k,a,b,d,cap],i)=>{
    const y = Rw.cmp.y+0.54+i*0.60;
    tx(s,Rw.cmp,{x:Rw.cmp.x,y,w:2.60,h:0.30},k,T.body,{size:11,valign:'middle'});
    s.addText([{text:a,options:{fontSize:13,color:C.MUTE}},
               {text:'   →   ',options:{fontSize:11,color:C.MUTE}},
               {text:b,options:{fontSize:24,bold:true,color:C.NAVY}}],
      t({...at(Rw.cmp,{x:Rw.cmp.x+2.70,y:y-0.04,w:3.10,h:0.40},{kind:'fig',pt:24}),valign:'middle'}));
    tri(s,Rw.cmp,Rw.cmp.x+6.00,y,0.20,0.28,C.RED);
    tx(s,Rw.cmp,{x:Rw.cmp.x+6.32,y:y-0.02,w:1.10,h:0.34},d,T.glabel,
      {size:16,color:C.RED,valign:'middle'});
    foot(s,Rw.cmp,Rw.cmp.x+7.66,y+0.03,Rw.cmp.w-7.66,cap,8.5);
  });
  s.addNotes('모수를 새로 만드실 필요가 없습니다. 이 값은 이번 제안 이전에 확보돼 있습니다.');
}

/* ══════════════ 05 02 Solution — 연혁 · 팀 ══════════════ */
{
  const CUT = 5.30;
  const s = p.addSlide(); bg(s,C.WHITE);
  grad(s,FULL(),{x:0,y:0,w:CUT,h:G.H},'gr_panel.png',C.BLUEBG0);
  frame(s,5,'02'); anchor(s,'Solution');
  head2(s,'[가맹 개설]을 본사에서 수행한\n4인 중심의 팀 구성',{x:CUT+0.46,w:RIGHT-(CUT+0.46)});

  const B = BODY('ir');
  const L = region('hL',SAFE.x,B.y,CUT-SAFE.x-0.46,B.h);
  const R = region('hR',CUT+0.46,B.y,RIGHT-(CUT+0.46),B.h);

  sectionBar(s,L,L.x,L.y,L.w,'연혁 및 인증 현황',{bg:C.WHITE});
  const HIS = [['2022. 06 ~ 12','MVP 테스트',[['앱 다운로드 3만 돌파',C.NAVY],['매장등록 200건 · 인증매물 1,000건',C.NAVY]]],
               ['2023. 01 ~','회사 설립',[['벤처기업 인증 · 기업부설연구소 설립',C.BLUE],['부동산중개방법 특허출원 3건',C.BLUE],['연 매출 2억원 달성',C.NAVY]]],
               ['2024. 01 ~','BM 다각화',[['초기창업패키지 · R&D 디딤돌사업 선정',C.RED],['KFA 공동사업단 설립 · 앱 8만 돌파',C.NAVY]]],
               ['2025','투자 유치',[['구글 창구 프로그램 선정',C.RED],['Seed 투자유치 (씨엔티테크—스테이션케이)',C.RED]]]];
  let hy = L.y+0.56;
  HIS.forEach(([per,ttl,items])=>{
    tagChip(s,L,L.x,hy,per,{bg:C.BLUEBG,color:C.BLUE});
    tx(s,L,{x:L.x+1.46,y:hy-0.02,w:L.w-1.46,h:0.28},ttl,T.sub,{size:11,valign:'middle'});
    hy += 0.28;
    items.forEach(([v,col])=>{
      tx(s,L,{x:L.x+0.12,y:hy,w:L.w-0.12,h:0.23},'· '+v,T.cardtx,{size:9.3,color:col,valign:'middle'});
      hy += 0.23;
    });
    hy += 0.11;
  });

  sectionBar(s,R,R.x,R.y,R.w,'실무부터 경영까지 완비된 팀 구성',{bg:C.WHITE});
  hr(s,R.x,R.y+0.44,R.w,C.BLUE,0.020);
  const TEAM = [['박규태','대표이사','유통학 박사',
                 ['현] 세종사이버대 외식창업프랜차이즈학 겸임교수','전] 이삭토스트 총괄사업부장 (COO)','전] SPC 파리바게뜨 가맹사업 본부']],
                ['김우곤','COO','유통학 박사 · 세종대학교 유통학과 겸임교수',
                 ['전] McDonald\'s · Subway International B.V','전] Delivery Hero Korea · CJ푸드빌 · SPC 외 15년']],
                ['엄태관','운영 팀장','프랜차이즈 경영학 석사',
                 ['현] 학점은행 기관 운영교수','전] 아딸 가맹사업 본부 · 셀렉토커피 영업 팀장']],
                ['김호병','팀장','공인중개사',
                 ['브랜드 개설 및 영업','전] 창업컨설팅 경력 5년 이상']]];
  let ty = R.y+0.54;
  TEAM.forEach(([nm,pos,deg,cars],i)=>{
    tx(s,R,{x:R.x,y:ty,w:1.16,h:0.26},nm,T.sub,{size:13,color:C.BLUE,valign:'middle'});
    tx(s,R,{x:R.x+1.20,y:ty+0.02,w:1.16,h:0.24},pos,T.label,{color:C.NAVY,valign:'middle'});
    tx(s,R,{x:R.x+2.46,y:ty+0.01,w:R.w-2.46,h:0.24},deg,T.cardtx,{size:9.3,color:C.MUTE,valign:'middle'});
    cars.forEach((c,k)=>tx(s,R,{x:R.x+2.46,y:ty+0.25+k*0.21,w:R.w-2.46,h:0.21},c,T.cardtx,
      {size:9.3,color:C.NAVY,valign:'middle'}));
    ty += 0.28 + cars.length*0.21;
    if(i<3){ hr(s,R.x,ty-0.05,R.w,C.RULE); ty += 0.08; }
  });
  hr(s,R.x,ty+0.02,R.w,C.BLUE,0.020);
  tx(s,R,{x:R.x,y:ty+0.12,w:R.w,h:0.24},
    '그 외  천영식 CMO · 장수형 CTO · 김재현 기획팀장',T.cardtx,{size:9.3,color:C.MUTE,valign:'middle'});
  s.addNotes('가맹 개설을 본사에서 직접 해 본 4인입니다.');
}

/* ══════════════ 06 02 Solution — 수행 업무 · 수행 브랜드 ══════════════ */
{
  const s = page(6,'02','Solution');
  head2(s,'[가맹영업] 수행 업무 3종\n및 수행 브랜드 현황');

  const B = BODY('ir');
  const L = region('wL',SAFE.x,B.y,4.60,B.h);
  const R = region('wR',SAFE.x+5.06,B.y,RIGHT-(SAFE.x+5.06),B.h);

  sectionBar(s,L,L.x,L.y,L.w,'수행 업무 3종');
  [['deal','가맹영업대행',['예비창업자 모객 · 1차 상담 · 등급 분류','조건별 브랜드 매칭 및 미팅 주선','정보공개서 제공부터 계약 체결까지 절차 관리']],
   ['mega','마케팅',['블로그 · 네이버 플레이스 · 검색광고 · SNS','창업박람회 부스 · 사업설명회','매장 오픈 마케팅']],
   ['store','점포개발 → 물건화',['보증금 · 권리금 · 월세 · 평수 수집','실측 · 현장사진 · 인테리어 견적 산출','즉시 브리핑 가능한 상태로 완성']]].forEach(([ic,k,vs],i)=>{
    const y = L.y+0.58+i*1.20;
    icon(s,L,L.x,y+0.01,0.26,ic,false);
    tx(s,L,{x:L.x+0.36,y,w:L.w-0.36,h:0.26},k,T.sub,{size:12.5,valign:'middle'});
    vs.forEach((v,j)=>tx(s,L,{x:L.x+0.36,y:y+0.30+j*0.24,w:L.w-0.36,h:0.24},'· '+v,T.cardtx,
      {size:9.3,color:C.MUTE,valign:'middle'}));
  });

  sectionBar(s,R,R.x,R.y,R.w,'수행 브랜드',{labelW:2.4});
  tx(s,R,{x:R.x+R.w-1.40,y:R.y+0.04,w:1.40,h:0.26},'외 18개',T.note,
    {size:9,color:C.MUTE,align:'right',valign:'middle'});
  const BR = ['33떡볶이','백소정','원앤원','투썸플레이스','명륜진사갈비','요아정',
              '차알','밀본','오레노카츠','랑데자뷰','청년피자','셀렉토커피'];
  const gr = region('br',R.x,R.y+0.52,R.w,2.10);
  const bw = (gr.w-0.16*3)/4, bh = (gr.h-0.14*2)/3;
  BR.forEach((b,i)=>{
    const x = gr.x+(bw+0.16)*(i%4), y = gr.y+(bh+0.14)*Math.floor(i/4);
    rrect(s,at(gr,{x,y,w:bw,h:bh},{kind:'card'}),C.BLUEBG0,0.05);
    tx(s,gr,{x:x+0.08,y,w:bw-0.16,h:bh},b,T.body,{size:10.5,align:'center',valign:'middle'});
  });
  sectionBar(s,R,R.x,R.y+2.74,R.w,'대표 사례');
  rrect(s,at(R,{x:R.x,y:R.y+3.22,w:R.w,h:0.64},{kind:'card'}),C.BLUEBG,0.08);
  tx(s,R,{x:R.x+0.22,y:R.y+3.22,w:R.w-0.44,h:0.64},
    '33떡볶이 강동역점 — 임대차 · 가맹 예약 완료',T.sub,{size:13,valign:'middle'});
  foot(s,R,R.x,R.y+3.94,R.w,'출처 : 내일사장 영업팀 주간보고 · 블로그(2025~2026)');
  s.addNotes('플랫폼 지표가 아니라 가맹을 판 실적입니다.');
}

/* ══════════════ 07 02 Solution — 전략적 제휴 현황 ══════════════ */
{
  const s = page(7,'02','Solution');
  head2(s,'소상공인 고객 확보를 위한\n[전략적 제휴] 현황');

  const B = BODY('ir');
  sectionBar(s,B,B.x,B.y,B.w,'내일사장 전략적 제휴 현황');
  const AL = [['SPC 플랫폼 개발 참여','모객','파리바게뜨 · 던킨 등 가맹점 6,000개'],
              ['KFA 공동사업단 공동설립','신뢰도','프랜차이즈 본사 1,400여개 대상 · 인증매장 · 위생교육'],
              ['삼성웰스토리 365솔루션','모객','사업단 공동설립 · 브랜드인증관 입점 및 광고'],
              ['바로고 든든상점','모객','등록매장 18만 대상 배너 · 푸시 상호 노출'],
              ['요기요','모객','플랫폼 배너 · 내일사장 제작 콘텐츠 노출'],
              ['동네알바 (사람인)','모객','상시 배너 노출'],
              ['포브스코리아 어워즈','신뢰도','중앙일보 주최 · 내일사장 주관'],
              ['아프니까 사장이다','모객','회원 210만 대상 바이럴']];
  const gw = (B.w-0.28*3)/4, gh = (B.h-0.56-0.26)/2;
  AL.forEach(([k,tag,v],i)=>{
    const x = B.x+(gw+0.28)*(i%4), y = B.y+0.56+(gh+0.26)*Math.floor(i/4);
    rrect(s,at(B,{x,y,w:gw,h:gh},{kind:'card'}),C.BLUEBG0,0.08);
    tagChip(s,B,x+0.20,y+0.16,tag,{bg:C.WHITE,color:C.BLUE});
    tx(s,B,{x:x+0.20,y:y+0.50,w:gw-0.40,h:0.48},k,T.sub,{size:11.5});
    hr(s,x+0.20,y+1.06,gw-0.40,C.RULE);
    tx(s,B,{x:x+0.20,y:y+1.16,w:gw-0.40,h:0.50},v,T.cardtx,{size:9.3,color:C.MUTE});
  });
  s.addNotes('러너펍에 필요한 창업 수요는 이 제휴망 안에서 나옵니다.');
}

/* ══════════════ 08 02 Solution — 근거 문서 (리드 허용 1) ══════════════ */
{
  const s = page(8,'02','Solution');
  grad(s,FULL(),{x:0,y:2.44,w:G.W,h:G.H-2.44},'gr_panel.png',C.BLUEBG0);
  head(s,'결정 지연 구간별 [근거 문서] 제공');
  lead(s,'홈택스 신고자료 연동 · 검증 리포트 · 상권 분석 · 정보공개서 D-day까지 이미 운영 중인 화면',false,11);

  const B = BODY('max');
  const ST = [['STEP 1','p07_step1.png','홈택스 연동 실매출 확인'],
              ['STEP 2','p07_step2.png','검증 리포트 제공'],
              ['STEP 3','p07_area.png','상권 · 입지 출점 검토'],
              ['STEP 4','p07_dday.png','정보공개서 D-day 카운트']];
  const cs = split(B,4,0.26);
  ST.forEach(([st,file,cap],i)=>{
    const c = cs[i];
    tx(s,c,{x:c.x,y:c.y+0.40,w:c.w,h:0.26},st,T.label,{color:C.MUTE,align:'center',valign:'middle'});
    const f = P(file), a = G.imgAspect(f);
    const iw = Math.min(c.w-0.20,2.34*a), ih = iw/a;
    rrect(s,at(c,{x:c.x,y:c.y+0.76,w:c.w,h:2.86},{kind:'card'}),C.WHITE,0.08);
    s.addImage({path:f, ...img(c,{x:c.x+(c.w-iw)/2,y:c.y+0.86+(2.34-ih)/2,w:iw,h:ih},f)});
    rect(s,at(c,{x:c.x,y:c.y+3.26,w:c.w,h:0.36},{kind:'cap'}),C.BLUE);
    tx(s,c,{x:c.x+0.08,y:c.y+3.26,w:c.w-0.16,h:0.36},cap,T.label,
      {color:C.WHITE,align:'center',valign:'middle'});
    if(i<3) hr(s,c.x+c.w+0.04,c.y+2.18,0.18,C.MUTED,0.022);
  });
  sectionBar(s,B,B.x,B.y+3.74,B.w,'보유 도구',{h:0.30,labelW:1.0});
  let tx0 = B.x+1.36;
  ['홈택스 연동','상권분석 보고서','거리제한 지도','정보공개서 D-day','전자계약','SV 점검보고서']
    .forEach(v=>{ tx0 += tagChip(s,B,tx0,B.y+3.77,v,{bg:C.WHITE,color:C.BLUE}) + 0.16; });
  s.addNotes('창업자가 결정을 미루는 자리마다 근거 문서를 내놓습니다.');
}

/* ══════════════ 09 02 Solution — 위임 범위 ══════════════ */
{
  const s = page(9,'02','Solution');
  head2(s,'발굴부터 클로징까지\n[전 과정 위임], 본사는 승인');

  const B = BODY('ir');
  const Rw = G.rows(B,[['tbl',1],['gap',0.22,'fix'],['trk',1.02,'fix']]);
  sectionBar(s,Rw.tbl,Rw.tbl.x,Rw.tbl.y,Rw.tbl.w,'업무별 수행 주체와 본사 승인 사항');
  const tb = region('tb',Rw.tbl.x,Rw.tbl.y+0.48,Rw.tbl.w,Rw.tbl.h-0.48);
  { const rh=(tb.h-0.38)/6;
    for(let i=1;i<6;i+=2) rect(s,at(tb,{x:tb.x,y:tb.y+0.38+rh*i,w:tb.w,h:rh},{kind:'row'}),C.BLUEBG0); }
  table(s,tb,[{h:'업무',w:2.70},{h:'내일사장 수행',w:5.80},{h:'본사 승인',w:tb.w-8.50}],[
    ['영업 조직 운영','가맹영업팀 운영 · 두 트랙 동시 영업',{v:'—',c:C.MUTE}],
    ['창업 마케팅','예비창업자 리드 확보 · 창업마케팅 집행','브랜드 자료 승인'],
    ['창업 상담 및 브리핑','상권 · 손익 자료로 결정 마무리','승인 문구 사용'],
    ['점포개발 및 물건화','실측 · 견적까지 끝낸 브리핑 상태','개설 승인'],
    ['계약 주선','조건 협의 및 클로징 지원','가맹계약 체결'],
    [{v:'본사 유입 건',c:C.MUTE},{v:'성공보수 대상 제외',c:C.MUTE},{v:'—',c:C.MUTE}],
  ],{rh:(tb.h-0.38)/6});

  sectionBar(s,Rw.trk,Rw.trk.x,Rw.trk.y,Rw.trk.w,'영업 2트랙');
  const ts = split(region('tk',Rw.trk.x,Rw.trk.y+0.46,Rw.trk.w,0.54),2,0.30);
  [['TRACK A','신규 창업자','플랫폼 상주 창업 수요 · 상담 DB 5,114명'],
   ['TRACK B','기존 홀덤펍 리브랜딩','운영 중인 점주 대상 · 검토 기간 단축']].forEach(([a,b,c],i)=>{
    const cc = ts[i];
    rrect(s,at(cc,{x:cc.x,y:cc.y,w:cc.w,h:cc.h},{kind:'card'}),C.BLUEBG0,0.06);
    tx(s,cc,{x:cc.x+0.18,y:cc.y+0.03,w:0.92,h:0.24},a,T.label,{color:C.BLUE,valign:'middle'});
    tx(s,cc,{x:cc.x+1.14,y:cc.y+0.02,w:cc.w-1.32,h:0.26},b,T.sub,{size:12,valign:'middle'});
    tx(s,cc,{x:cc.x+0.18,y:cc.y+0.30,w:cc.w-0.36,h:0.22},c,T.cardtx,{size:9.3,color:C.MUTE});
  });
  s.addNotes('본사는 승인만 하시면 됩니다.');
}

/* ══════════════ 10 02 Solution — 비교 · 결론 띠 ══════════════ */
{
  const s = page(10,'02','Solution',true);
  head2(s,'[직영 채용] · 일반 대행 ·\n내일사장 비교');

  const B = BODY('full');
  sectionBar(s,B,B.x,B.y,B.w,'항목별 비교');
  const tb = region('cb',B.x,B.y+0.48,B.w,B.h-0.80);
  const cw = (tb.w-2.86)/3;
  rrect(s,at(tb,{x:tb.x+2.86+cw*2,y:tb.y,w:cw,h:tb.h},{kind:'hl'}),C.BLUEBG,0.08);
  { const rh=(tb.h-0.38)/6;
    for(let i=1;i<6;i+=2) rect(s,at(tb,{x:tb.x,y:tb.y+0.38+rh*i,w:tb.w-cw,h:rh},{kind:'row'}),C.BLUEBG0); }
  table(s,tb,[{h:'',w:2.86},{h:'직영 채용',w:cw,a:'center'},{h:'일반 대행',w:cw,a:'center'},
              {h:'내일사장 · 착수 시점 0원',w:cw,a:'center'}],[
    ['착수 시점 비용',{v:'급여 · 4대보험',c:C.MUTE},{v:'착수금 발생',c:C.MUTE},{v:'0원',b:true,c:C.BLUE}],
    ['미계약 건 원가',{v:'본사 부담',c:C.MUTE},{v:'본사 부담',c:C.MUTE},{v:'내일사장 부담',b:true,c:C.BLUE}],
    ['창업자 모수',{v:'직접 모객',c:C.MUTE},{v:'대행사 규모에 따름',c:C.MUTE},{v:'앱 10만 · DB 5,114명',b:true,c:C.BLUE}],
    ['브리핑 자료',{v:'직접 제작',c:C.MUTE},{v:'브랜드 자료 전달',c:C.MUTE},{v:'상권 · 손익 직접 산출',b:true,c:C.BLUE}],
    ['준법 관리',{v:'담당자 역량',c:C.MUTE},{v:'대행사 재량',c:C.MUTE},{v:'시스템 강제',b:true,c:C.BLUE}],
    ['본사 인력 증원',{v:'필요',c:C.MUTE},{v:'관리 인력 필요',c:C.MUTE},{v:'0명',b:true,c:C.BLUE}],
  ],{rh:(tb.h-0.38)/6});
  foot(s,B,B.x+2.86,B.y+B.h-0.26,B.w-2.86,
    '※ 직영 채용 — 계약 성사 여부와 무관하게 급여 · 4대보험 매월 발생    ※ 일반 대행 — 착수금은 계약 실패 시에도 반환 없음');

  bandSentence(s,'위임하지 않으실 경우 채용 고정비와 미계약 건 원가 본사 부담, 위임 시 [계약 성사 건에만 발생]');
  s.addNotes('대안과 나란히 놓아야 위임이 계산됩니다.');
}

/* ══════════════ 11 03 Terms — 비용 · 정산 ══════════════ */
{
  const s = page(11,'03','Terms');
  head2(s,'[비용 발생] 시점과\n성공보수 정산 기준');

  const B = BODY('ir');
  const L = region('cL',SAFE.x,B.y,6.20,B.h);
  const R = region('cR',SAFE.x+6.66,B.y,RIGHT-(SAFE.x+6.66),B.h);

  sectionBar(s,L,L.x,L.y,L.w,'비용 발생 시점과 금액');
  const tb = region('tb',L.x,L.y+0.48,L.w,2.72);
  { const rh=(tb.h-0.38)/5;
    for(let i=1;i<5;i+=2) rect(s,at(tb,{x:tb.x,y:tb.y+0.38+rh*i,w:tb.w,h:rh},{kind:'row'}),C.BLUEBG0); }
  table(s,tb,[{h:'항목',w:1.50},{h:'발생 시점',w:tb.w-3.20},{h:'금액',w:1.70,a:'right'}],[
    ['착수금','해당 없음',{v:'0원',b:true,c:C.BLUE}],
    ['월 고정비','해당 없음',{v:'0원',b:true,c:C.BLUE}],
    ['광고비','가맹 개설 영업 대가 청구 없음',{v:'0원',b:true,c:C.BLUE}],
    [{v:'성공보수',b:true},'가맹계약 체결 및 가맹비 입금 완료 후',{v:'1,000만원',b:true,c:C.NAVY}],
    ['해제 · 환불 시','본사 정책에 맞춰 착수 전 협의',{v:'협의',c:C.MUTE}],
  ],{rh:(tb.h-0.38)/5});
  foot(s,L,L.x,L.y+3.28,L.w,'※ 성공보수는 부가가치세 별도');

  sectionBar(s,R,R.x,R.y,R.w,'네고 발생 시 배분');
  rrect(s,at(R,{x:R.x,y:R.y+0.48,w:R.w,h:0.72},{kind:'card'}),C.BLUEBG0,0.06);
  s.addText([{text:'가맹비 1,500  −  성공보수 1,000  =  ',options:{fontSize:11,color:C.NAVY}},
             {text:'본사 순수취 500만원',options:{fontSize:13,bold:true,color:C.BLUE}}],
    t({...at(R,{x:R.x+0.16,y:R.y+0.48,w:R.w-0.32,h:0.72},{kind:'fig',pt:13}),valign:'middle'}));
  foot(s,R,R.x,R.y+1.26,R.w,'※ 창업자 할인분은 전액 내일사장 성공보수에서 차감 · 본사 순수취 불변');
  foot(s,R,R.x,R.y+1.50,R.w,'※ 할인 한도는 건별 본사 승인 후 확정 · 내일사장 단독 조건 제시 없음');

  sectionBar(s,R,R.x,R.y+1.90,R.w,'LSM 광고 집행 기준 · 내일사장 수취 구간');
  [['800만원 이하','본사 집행'],
   ['800만원 초과 ~ 1,000만원 미만','양사 협의'],
   ['1,000만원 전액 수취','내일사장 집행 · 수취액 중 200만원 매장 LSM 광고비']].forEach(([k,v],i)=>{
    const y = R.y+2.42+i*0.54;
    rrect(s,at(R,{x:R.x,y,w:R.w,h:0.48},{kind:'card'}),i===2?C.BLUEBG:C.BLUEBG0,0.06);
    stepBadge(s,R,R.x+0.16,y+0.11,0.26,i+1);
    tx(s,R,{x:R.x+0.54,y:y+0.02,w:R.w-0.72,h:0.24},k,T.body,{size:10,bold:true,valign:'middle'});
    tx(s,R,{x:R.x+0.54,y:y+0.24,w:R.w-0.72,h:0.22},v,T.cardtx,{size:9.3,color:C.MUTE,valign:'middle'});
  });
  s.addNotes('청구는 계약이 체결되고 가맹비 입금이 확인된 뒤에만 발생합니다.');
}

/* ══════════════ 12 03 Terms — 회수 구조 ══════════════ */
{
  const s = page(12,'03','Terms');
  const CUT = 6.10;
  grad(s,FULL(),{x:CUT,y:0,w:G.W-CUT,h:G.H},'gr_panelh.png',C.BLUEBG0);
  head2(s,'계약 시점부터 흑자,\n[로열티 전액 순증]',{x:SAFE.x,w:5.10});

  const B = BODY('ir');
  const L = region('rL',SAFE.x,B.y,CUT-SAFE.x-0.46,B.h);
  const R = region('rR',CUT+0.46,B.y,RIGHT-(CUT+0.46),B.h);

  sectionBar(s,L,L.x,L.y,L.w,'계약 1건 · 계약 시점');
  [['가맹비 (본사 수취)','+1,500 만원',C.NAVY],['성공보수 (내일사장)','−1,000 만원',C.MUTE]].forEach(([k,v,col],i)=>{
    const y = L.y+0.58+i*0.48;
    tx(s,L,{x:L.x,y,w:2.70,h:0.32},k,T.body,{size:11,valign:'middle'});
    tx(s,L,{x:L.x+2.70,y,w:L.w-2.70,h:0.32},v,T.glabel,
      {size:14,color:col,align:'right',valign:'middle'});
    hr(s,L.x,y+0.38,L.w,C.RULE);
  });
  rrect(s,at(L,{x:L.x,y:L.y+1.62,w:L.w,h:0.86},{kind:'card'}),C.BLUEBG,0.08);
  tx(s,L,{x:L.x+0.20,y:L.y+1.72,w:L.w-0.40,h:0.24},'계약 시점 본사 순수익',T.note,
    {size:9,color:C.MUTE,valign:'middle'});
  s.addText([{text:'+500',options:{fontSize:30,bold:true,color:C.BLUE,charSpacing:-1.2}},
             {text:' 만원',options:{fontSize:13,bold:true,color:C.BLUE}}],
    t({...at(L,{x:L.x+0.20,y:L.y+1.94,w:L.w-0.40,h:0.48},{kind:'fig',pt:30}),valign:'middle'}));
  tx(s,L,{x:L.x,y:L.y+2.62,w:L.w,h:0.26},'이후 월 로열티 150만원 전액 본사 수익 순증',T.body,
    {size:11,valign:'middle'});
  foot(s,L,L.x,L.y+3.00,L.w,'※ 러너펍 공개 가맹 안내 기준 시뮬레이션 · 실제 조건은 본사 정책에 따름');

  sectionBar(s,R,R.x,R.y,R.w,'1개점 누적 본사 수익',{bg:C.WHITE});
  [['12개월',2300],['24개월',4100],['36개월',5900]].forEach(([k,v],i)=>{
    const y = R.y+0.54+i*0.42;
    tx(s,R,{x:R.x,y,w:0.96,h:0.28},k,T.body,{size:10.5,valign:'middle'});
    gbar(s,R,R.x+1.02,y+0.05,(R.w-2.62)*v/5900,0.18);
    tx(s,R,{x:R.x+R.w-1.52,y,w:1.52,h:0.28},v.toLocaleString()+' 만원',T.glabel,
      {size:11,color:i===2?C.BLUE:C.NAVY,align:'right',valign:'middle'});
  });
  sectionBar(s,R,R.x,R.y+1.86,R.w,'출점 규모별 36개월 누적',{bg:C.WHITE});
  [['3개점',17700],['5개점',29500],['10개점',59000]].forEach(([k,v],i)=>{
    const y = R.y+2.40+i*0.42;
    tx(s,R,{x:R.x,y,w:0.96,h:0.28},k,T.body,{size:10.5,valign:'middle'});
    gbar(s,R,R.x+1.02,y+0.05,(R.w-2.62)*v/59000,0.18);
    tx(s,R,{x:R.x+R.w-1.52,y,w:1.52,h:0.28},v.toLocaleString()+' 만원',T.glabel,
      {size:11,color:i===2?C.BLUE:C.NAVY,align:'right',valign:'middle'});
  });
  foot(s,R,R.x,R.y+3.68,R.w,'10개점 × 36개월 = 5억 9,000만원   ·   단위 : 만원');
  s.addNotes('계약 시점에 이미 흑자입니다.');
}

/* ══════════════ 13 04 Governance — 준법 통제 ══════════════ */
{
  const s = page(13,'04','Governance');
  head2(s,'사람이 아닌\n[시스템] 기반의 준법 통제');

  const B = BODY('ir');
  const Rw = G.rows(B,[['flow',1.32,'fix'],['gap',0.22,'fix'],['tbl',1]]);
  sectionBar(s,Rw.flow,Rw.flow.x,Rw.flow.y,Rw.flow.w,'전자계약 잠금 흐름');
  const FL = [['정보공개서 제공','본사 자료 그대로 전달'],
              ['D-14 자동 카운트','가맹사업법 제7조'],
              ['전자계약 시스템 잠금','기간 경과 전 체결 불가'],
              ['경과 후 잠금 해제','계약 진행']];
  const fs = split(region('fl',Rw.flow.x,Rw.flow.y+0.48,Rw.flow.w,0.72),4,0.42);
  FL.forEach(([k,v],i)=>{
    const c = fs[i];
    rrect(s,at(c,{x:c.x,y:c.y,w:c.w,h:c.h},{kind:'card'}),i===2?C.BLUEBG:C.BLUEBG0,0.06);
    stepBadge(s,c,c.x+0.16,c.y+0.10,0.24,i+1);
    tx(s,c,{x:c.x+0.48,y:c.y+0.06,w:c.w-0.62,h:0.26},k,T.sub,{size:11,valign:'middle'});
    tx(s,c,{x:c.x+0.48,y:c.y+0.34,w:c.w-0.62,h:0.24},v,T.cardtx,{size:9.3,color:C.MUTE,valign:'middle'});
    if(i<3) icon(s,Rw.flow,c.x+c.w+0.08,c.y+0.24,0.24,'arrow',false);
  });

  sectionBar(s,Rw.tbl,Rw.tbl.x,Rw.tbl.y,Rw.tbl.w,'항목별 준법 기준');
  const gt = region('gt',Rw.tbl.x+0.32,Rw.tbl.y+0.48,Rw.tbl.w-0.32,Rw.tbl.h-0.48);
  { const rh=(gt.h-0.38)/5;
    for(let i=1;i<5;i+=2) rect(s,at(Rw.tbl,{x:Rw.tbl.x,y:gt.y+0.38+rh*i,w:Rw.tbl.w,h:rh},{kind:'row'}),C.BLUEBG0); }
  const GV = [['정보공개서 · 계약서','본사 제공 · 내일사장은 전달 및 설명 보조'],
              ['법정 숙려기간','가맹사업법 제7조 14일 준수 · 기간 단축 유도 금지'],
              ['예상매출 진술','구두 약속 금지 · 본사 승인 문구만 사용'],
              ['광고 · 상담 스크립트','본사 사전 승인 후 사용'],
              ['위반 확인 시','해당 건 영업 즉시 중단 및 본사 통보']];
  table(s,gt,[{h:'항목',w:3.00},{h:'기준',w:gt.w-3.00}],
    GV.map(([k,v])=>[{v:k,b:true},v]),{rh:(gt.h-0.38)/5});
  GV.forEach((_,i)=>{
    const rh = (gt.h-0.38)/5;
    check(s,Rw.tbl,Rw.tbl.x,gt.y+0.42+rh*i+(rh-0.20)/2,0.20);
  });
  s.addNotes('준법은 사람이 아니라 시스템이 강제합니다.');
}

/* ══════════════ 14 04 Governance — 업종 이력 없음 ══════════════ */
{
  const s = page(14,'04','Governance',true);
  head2(s,'홀덤 업종 전담 영업\n[이력 없음]');

  const B = BODY('ir');
  const L = region('nL',SAFE.x,B.y,4.72,B.h);
  const R = region('nR',SAFE.x+5.18,B.y,RIGHT-(SAFE.x+5.18),B.h);

  rrect(s,at(L,{x:L.x,y:L.y,w:L.w,h:1.62},{kind:'card'}),C.GRAY,0.08);
  tagChip(s,L,L.x+0.20,L.y+0.16,'업종 경험 없음');
  tx(s,L,{x:L.x+0.20,y:L.y+0.54,w:2.10,h:0.24},'홀덤 업종 전담 영업 이력',T.note,
    {size:9,color:C.MUTE,valign:'middle'});
  s.addText([{text:'0',options:{fontSize:32,bold:true,color:C.NAVY,charSpacing:-1.2}},
             {text:' 건',options:{fontSize:13,bold:true,color:C.MUTE}}],
    t({...at(L,{x:L.x+0.20,y:L.y+0.80,w:1.90,h:0.60},{kind:'fig',pt:32}),valign:'middle'}));
  vr(s,L.x+2.42,L.y+0.54,0.86,C.RULE);
  tx(s,L,{x:L.x+2.62,y:L.y+0.54,w:L.w-2.82,h:0.24},'본사가 정하시는 항목',T.note,
    {size:9,color:C.MUTE,valign:'middle'});
  s.addText([{text:'6',options:{fontSize:32,bold:true,color:C.BLUE,charSpacing:-1.2}},
             {text:' 건',options:{fontSize:13,bold:true,color:C.BLUE}}],
    t({...at(L,{x:L.x+2.62,y:L.y+0.80,w:1.70,h:0.60},{kind:'fig',pt:32}),valign:'middle'}));
  ['첫 구간 파일럿 운영','건수 · 기간 · 중단 시점 본사 단독 결정','업종 경험 공백 보완 장치 3종'].forEach((v,i)=>{
    const y = L.y+1.86+i*0.34;
    check(s,L,L.x,y+0.03,0.20);
    tx(s,L,{x:L.x+0.32,y,w:L.w-0.32,h:0.28},v,T.body,{size:11,valign:'middle'});
  });
  foot(s,L,L.x,L.y+3.02,L.w,'※ 리브랜딩 트랙은 운영 중 점주 대상 · 입지 · 손익 · 계약 절차는 업종 무관');

  sectionBar(s,R,R.x,R.y,R.w,'파일럿 운영 기준 — 본사 결정 사항');
  const pt = region('pt',R.x+0.32,R.y+0.48,R.w-0.32,B.h-0.48);
  { const rh=(pt.h-0.38)/6;
    for(let i=1;i<6;i+=2) rect(s,at(R,{x:R.x,y:pt.y+0.38+rh*i,w:R.w,h:rh},{kind:'row'}),C.BLUEBG0); }
  const PT = [['검증 기간','본사가 정하시는 기간 — 착수 전 별지 확정'],
              ['목표 건수','본사가 정하시는 목표 — 착수 전 별지 확정'],
              ['평가 지표','신규 리드 수 · 상담 진행 수 · 계약 체결 건수'],
              ['보고','주 단위 리포트 — 활동 지표 및 단계별 파이프라인'],
              ['착수 조건','본사 승인 자료 확정 후 즉시 착수 · 착수금 없음'],
              ['기간 종료 시','연장 또는 종료 본사 단독 결정']];
  table(s,pt,[{h:'항목',w:2.10},{h:'본사 결정 사항',w:pt.w-2.10}],
    PT.map(([k,v])=>[{v:k,b:true},v]),{rh:(pt.h-0.38)/6});
  PT.forEach((_,i)=>{
    const rh = (pt.h-0.38)/6;
    icon(s,R,R.x,pt.y+0.42+rh*i+(rh-0.22)/2,0.22,'badge',false);
  });
  s.addNotes('숨기지 않고 먼저 말씀드립니다. 검증 방법은 본사가 정하십니다.');
}

/* ══════════════ 15 Close — 결정 5건 (리드 허용 2) ══════════════ */
{
  const s = p.addSlide(); bg(s,C.WHITE);
  const F = FULL();
  grad(s,F,{x:0,y:0,w:G.W,h:G.H},'gr_page.png',C.WHITE);
  setSlide(15);
  hr(s,SAFE.x,Y.topRule.y,SAFE.w,C.NAVY,0.014);
  const brow = region('brow',SAFE.x,Y.brow.y,SAFE.w,Y.brow.h);
  const bl = 1.10, blh = bl/3.7009;
  s.addImage({path:P('ns_logo.png'), ...img(brow,{x:RIGHT-bl,y:Y.brow.y+(Y.brow.h-blh)/2,w:bl,h:blh},P('ns_logo.png'))});
  head(s,'본사가 정하시는 [결정 5건]');
  lead(s,'아래 다섯 가지만 정해 주시면 그대로 따릅니다.',false,11);

  const B = BODY('max');
  [['전속 · 비전속','전속 여부 및 타 대행사 병행 여부'],
   ['대상 지역','전국 또는 특정 권역 한정'],
   ['위임 기간','파일럿 기간 및 연장 조건'],
   ['직영 영업 병행','본사 직영 영업 병행 여부'],
   ['인테리어 시공','내일사장 시공 진행 여부 · 추가 수익 분배 별도 협의']].forEach(([k,v],i)=>{
    const y = B.y+i*0.46;
    stepBadge(s,B,B.x,y+0.02,0.26,i+1);
    tx(s,B,{x:B.x+0.40,y,w:2.80,h:0.30},k,T.sub,{size:13,valign:'middle'});
    tx(s,B,{x:B.x+3.32,y,w:B.w-3.32,h:0.30},v,T.body,{size:11,color:C.MUTE,valign:'middle'});
    hr(s,B.x,y+0.38,B.w,C.RULE);
  });
  foot(s,B,B.x,B.y+2.40,B.w,'※ 착수금 없음 · 본사 승인 자료 확정 후 즉시 착수');

  const cl = 1.86, clh = cl/3.7009;
  s.addImage({path:P('ns_logo.png'), ...img(B,{x:B.x+(B.w-cl)/2,y:B.y+2.92,w:cl,h:clh},P('ns_logo.png'))});
  tx(s,B,{x:B.x,y:B.y+2.96+clh,w:B.w,h:0.34},'내일부터 내 일이 사장이 되는 플랫폼',T.sub,
    {size:15,align:'center',valign:'middle'});
  tx(s,B,{x:B.x,y:B.y+3.36+clh,w:B.w,h:0.24},
    '수신  러너스튜디오(주) 귀중 · 대표 박경관   ·   서울 강남구 삼성로100길 12 제이타워 B2',T.note,
    {size:9,color:C.MUTE,align:'center',valign:'middle'});
  s.addNotes('다섯 가지만 정해 주시면 됩니다.');
}

/* ═══ 저장 ═══ */
const OUT='/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v4/runnerpub_v9.pptx';
const rep=G.report('/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v4/layout_report_v9.txt');
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
