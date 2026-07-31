/* 러너펍 가맹 개설 영업 전면 위임 제안 — 주식회사 내일사장
   v11 · 내일사장 본덱 어법 이식(소제목 = 체크 원 + 파란 볼드 · 표 = 회색 라벨 열 + 파란 상하 테두리).
   화이트 지배 + 옅은 그라데이션. 15장.
   · 헤드는 명사형 2행, 마침표 없음     · 리드는 08 · 15 두 장만
   · 결론 띠는 챕터 종료 2장(02 · 10)만  · 초대형 수치는 03 한 장만
   · 노란 형광 0건 · 다크 면은 표지 하단 띠 하나 · 러닝 푸터 없음        */
const NM = '/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/node_modules';
const pptxgen = require(NM + '/pptxgenjs');
const p = new pptxgen();
p.layout = 'LAYOUT_WIDE';
p.author = '주식회사 내일사장'; p.company = '주식회사 내일사장';
p.title = '러너펍 가맹 개설 영업 전면 위임 제안 — 내일사장';

const K = require('./kit10.js')(p);
const { C,T,t,G,A,path, rect,rrect,bg,grad,hr,vr, tx,runs, frame,footer,anchor,head,head2,lead,note,
        bandSentence, sectionBar,tagChip, check,icon,iconRow,stepBadge,pill,card,bar,table,
        tri,rail,chart2, BODY, SAFE,Y,span,region,split,pad,at,fit,img,setSlide } = K;

const P = (f)=>path.join(A,f);
const RIGHT = SAFE.x + SAFE.w;                       // 12.583
const FULL  = ()=>region('full',0,0,G.W,G.H);
const GBAR  = P('gr_bar_h.png');

const CHAPFIRST = {2:1,3:1,9:1,13:1};                // 영문 앵커는 챕터 첫 장만
/* 공통 — 지면 그라데이션 + 챕터 마크 */
function page(no, chapNo, chapEn, gradient){
  const s = p.addSlide(); bg(s,C.WHITE);
  if(gradient) grad(s,FULL(),{x:0,y:0,w:G.W,h:G.H},'gr_page.png',C.WHITE);
  frame(s,no,chapNo);
  if(chapEn && CHAPFIRST[no]) anchor(s,chapEn);
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
  grad(s,F,{x:0,y:0,w:G.W,h:5.86},'gr_page.png',C.WHITE);
  grad(s,F,{x:0,y:5.86,w:G.W,h:G.H-5.86},'gr_cover.png',C.NAVY);
  setSlide(1);

  const TOP = 0.94, BOT = 5.30;                       // 좌우 두 단이 공유하는 상·하 기준선
  const CAPH = 0.22;
  /* 좌 : 제안 요지. 앱 목업(내일사장 자사 화면)은 이 제안의 주제가 아니므로 걷어냈다 */
  const LX = SAFE.x, LW = 6.80;
  tx(s,F,{x:LX,y:TOP,w:LW,h:0.26},'러너펍 가맹 개설 영업 전면 위임',T.label,
    {size:11,color:C.BLUE,cs:2.8,valign:'middle'});
  hr(s,LX,1.34,1.60,C.BLUE,0.030);
  tx(s,F,{x:LX,y:1.58,w:LW,h:0.88},'가맹영업대행 제안서',T.head,{size:46,ls:56,valign:'middle'});
  tx(s,F,{x:LX,y:2.52,w:LW,h:0.54},
    '러너펍이 갖춘 개설 구조에 내일사장이 확보한 창업 수요를 붙입니다.\n계약이 성사된 건에만 비용이 발생합니다.',
    T.lead,{size:11.5,color:C.MUTE});
  hr(s,LX,3.20,LW,C.RULE);
  tx(s,F,{x:LX,y:3.32,w:LW,h:0.24},'가맹계약 1건당 성공보수 (VAT 별도)',T.note,
    {size:9.5,color:C.MUTE,valign:'middle'});
  s.addText([{text:'1,000',options:{fontSize:42,bold:true,color:C.BLUE,charSpacing:-1.4}},
             {text:'만원',options:{fontSize:16,bold:true,color:C.BLUE}}],
    t({...at(F,{x:LX,y:3.62,w:LW,h:0.80},{kind:'fig',pt:42}),valign:'middle'}));
  tx(s,F,{x:LX,y:4.50,w:LW,h:0.28},'가맹비 1,500만원 − 성공보수 1,000만원 = 계약 시점 본사 순수취 +500만원',T.body,
    {size:11,bold:true,color:C.NAVY,valign:'middle'});
  foot(s,F,LX,BOT-CAPH,LW,'※ 계약 체결 및 가맹비 입금 완료 건에만 청구하며, 착수금 · 월 고정비 · 광고비 없음 (러너펍 공개 가맹 안내 기준)',9);

  /* 우 : 제안 대상 업종 그대로 — 홀덤 라운지 매장 구성 도해 */
  const RX = 7.95, RW = RIGHT-RX;
  const cf = P('p11_pub.png');
  const cw = RW-0.60, ch = cw/G.imgAspect(cf);
  const panH = 0.30+ch+0.10+CAPH+0.22;
  const blockH = 0.26+0.14+panH;
  const RY = TOP + ((BOT-TOP)-blockH)/2;
  tx(s,F,{x:RX,y:RY,w:RW,h:0.26},'제안 대상 업종  ·  RUNNER PUB 홀덤 라운지',T.label,
    {size:10,color:C.BLUE,cs:1.4,align:'center',valign:'middle'});
  rrect(s,at(F,{x:RX,y:RY+0.40,w:RW,h:panH},{kind:'card'}),C.BLUEBG0,0.06);
  s.addImage({path:cf, ...img(F,{x:RX+0.30,y:RY+0.70,w:cw,h:ch},cf)});
  tx(s,F,{x:RX+0.20,y:RY+0.80+ch,w:RW-0.40,h:CAPH},'가맹 개설 대상 매장 구성 — 홀덤 테이블 · 바 · 라운지',T.note,
    {size:9,color:C.MUTE,align:'center',valign:'middle'});

  /* 다크 띠 — 제안 4행 요약 */
  const SUM = [['확보된 창업 수요','앱 10만 · 예비창업자 DB 5,114명'],
               ['위임 범위','발굴부터 클로징까지 전 과정'],
               ['비용 구조','계약 성사 건에만 1,000만원'],
               ['검증 방식','파일럿 기간 · 건수 본사 결정']];
  const sw = SAFE.w/4;
  SUM.forEach(([k,v],i)=>{
    const x = SAFE.x+sw*i;
    if(i) vr(s,x-0.14,6.14,0.44,C.NAVYTEX,0.010);
    tx(s,F,{x,y:6.10,w:sw-0.28,h:0.22},k,T.note,{size:8.5,color:C.BLUEP,valign:'middle'});
    tx(s,F,{x,y:6.32,w:sw-0.28,h:0.26},v,T.body,{size:10,color:C.INK_ON,valign:'middle'});
  });
  hr(s,SAFE.x,6.70,SAFE.w,C.NAVYTEX,0.010);

  // 두 로고는 높이가 아니라 잉크 면적을 맞춘다 — 중심선 7.05 공유
  const AREA = 0.406, MID = 7.05;
  const NSL = P('ns_logo_w.png'), na = G.imgAspect(NSL);
  const lh = Math.sqrt(AREA/na), lw = na*lh;
  s.addImage({path:NSL, ...img(F,{x:SAFE.x,y:MID-lh/2,w:lw,h:lh},NSL)});
  icon(s,F,SAFE.x+lw+0.24,MID-0.12,0.24,'arrow',true);
  const RPL = P('logo.png'), ra = G.imgAspect(RPL);
  const rh = Math.sqrt(AREA/ra), rw = ra*rh;
  s.addImage({path:RPL, ...img(F,{x:SAFE.x+lw+0.72,y:MID-rh/2,w:rw,h:rh},RPL)});
  tx(s,F,{x:RIGHT-6.0,y:6.80,w:6.0,h:0.22},'수신  러너스튜디오(주) 귀중 · 대표 박경관',T.body,
    {size:10.5,color:C.INK_ON,align:'right',valign:'middle'});
  tx(s,F,{x:RIGHT-6.0,y:7.04,w:6.0,h:0.22},'담당  지용관 본부장 · 010-3629-7778',T.note,
    {size:9.5,color:C.BLUEP,align:'right',valign:'middle'});
  s.addNotes('발신은 주식회사 내일사장입니다. 가맹 개설 영업을 전면 위임받겠다는 제안입니다.');
}

/* ══════════════ 02 01 Fit — 러너펍이 갖춘 것 · 내일사장이 채우는 것 ══════════════ */
{
  const CUT = 7.30;
  const s = p.addSlide(); bg(s,C.WHITE);
  grad(s,FULL(),{x:CUT,y:0,w:G.W-CUT,h:6.13},'gr_panelh.png',C.BLUEBG0);
  vr(s,CUT,0,6.13,C.RULE,0.010);
  frame(s,2,'01'); anchor(s,'Fit');
  head2(s,'러너펍이 갖춘 것과\n[내일사장이 채우는 것]',{x:SAFE.x,w:6.20});

  const B = BODY('ir');
  const L = region('aL',SAFE.x,B.y,CUT-SAFE.x-0.46,B.h);
  const RX = CUT+0.46, R = region('aR',RX,B.y,RIGHT-RX,B.h);

  sectionBar(s,L,L.x,L.y,L.w,'러너펍이 이미 갖춘 것');
  ['러너러너 앱 (예약 · 회원관리 · 정산 · 토너먼트)','본사 검증 점포 추천 체계',
   '준법 운영 기준','가맹 절차 9단계 · 계약에서 오픈까지 4~6주',
   '래빗 페스티벌 · 시즌 랭킹전 · 매장 간 콜라보','앱 리뉴얼 후 플랫폼 이용자 1.5배 증가'].forEach((v,i)=>{
    const y = L.y+0.56+i*0.46;
    check(s,L,L.x,y+0.05,0.20);
    tx(s,L,{x:L.x+0.32,y,w:L.w-0.32,h:0.30},v,T.body,{size:11,valign:'middle'});
  });
  foot(s,L,L.x,L.y+3.24,L.w,'출처 : IT비즈뉴스(2024.7.4) · 앱 리뉴얼 후 플랫폼 이용자 증가분');

  sectionBar(s,R,R.x,R.y,R.w,'남은 한 가지',{bg:C.WHITE});
  tx(s,R,{x:R.x+0.18,y:R.y+0.50,w:R.w-0.18,h:0.32},'계약 가능한 창업자 모수',T.sub,
    {size:16,color:C.BLUE,valign:'middle'});
  tx(s,R,{x:R.x+0.18,y:R.y+0.86,w:R.w-0.36,h:0.44},
    '개설 속도를 결정하는 계약 이전 구간의 접점 총량',T.cardtx,{size:9.5,color:C.MUTE});
  // 장식용 그림 대신 이 장의 논지를 그대로 놓는다 — 접점에서 계약까지가 내일사장의 구간이다
  vr(s,R.x+0.13,R.y+1.58,1.22,C.BLUEP,0.020);
  [['접점','창업 수요가 상주하는 플랫폼'],
   ['상담','예비창업자 DB 5,114명 · 상담 기록 499건'],
   ['계약','러너펍 가맹계약 체결']].forEach(([k,v],i)=>{
    const y = R.y+1.44+i*0.56;
    stepBadge(s,R,R.x,y+0.04,0.26,i+1);
    tx(s,R,{x:R.x+0.40,y,w:R.w-0.40,h:0.24},k,T.label,{color:C.BLUE,valign:'middle'});
    tx(s,R,{x:R.x+0.40,y:y+0.23,w:R.w-0.40,h:0.27},v,T.body,{size:11,valign:'middle'});
  });
  const yb = R.y+3.08;
  rrect(s,at(R,{x:R.x,y:yb,w:R.w,h:0.33},{kind:'card'}),C.WHITE,0.07);
  tx(s,R,{x:R.x+0.20,y:yb,w:R.w-0.40,h:0.33},'내일사장이 붙이는 구간 — 접점 확보부터 계약 체결까지',T.body,
    {size:10.5,bold:true,color:C.BLUE,valign:'middle'});

  bandSentence(s,'개설 이후 구조는 러너펍이 완비 · 계약 이전 구간의 [창업 수요는 내일사장이 보유]');
  s.addNotes('러너펍은 개설 이후 구조가 완비돼 있습니다. 남은 한 가지가 계약 가능한 창업자 모수입니다.');
}

/* ══════════════ 03 02 Capability — 확보된 창업 수요 (초대형 수치는 이 장만) ══════════════ */
{
  const s = page(3,'02','Capability',true);
  head2(s,'이번 제안 이전에\n[확보된 창업 수요]');

  const B = BODY('ir');
  const Rw = G.rows(B,[['k',2.26,'fix'],['gap',0.22,'fix'],['cmp',1]]);
  const KP = [['앱 누적 다운로드','100,000','+',[['2023',3],['2024',8],['2026',10]],'2026.07 누적 기준'],
              ['월간 활성 이용자 MAU','50,000','+',null,'2026.07 기준'],
              ['예비창업자 DB','5,114','명',null,'2026.06 사내 ERP 기준 · 상담 기록 499건'],
              ['누적 매물 거래 규모','1,600','억원',null,'2026.07 누적 · 매물 등록 10,000건']];
  const kc = split(Rw.k,4,0.28);
  KP.forEach(([lab,val,unit,bars,cap],i)=>{
    const c = kc[i];
    tx(s,c,{x:c.x,y:c.y,w:c.w,h:0.26},lab,T.note,{size:9.5,color:C.MUTE,valign:'middle'});
    s.addText([{text:val,options:{fontSize:36,bold:true,color:C.NAVY,charSpacing:-1.4}},
               {text:unit,options:{fontSize:13,bold:true,color:C.BLUE}}],
      t({...at(c,{x:c.x,y:c.y+0.30,w:c.w,h:0.64},{kind:'fig',pt:36}),valign:'middle'}));
    if(bars) bars.forEach(([yy,v],k)=>{
      const y = c.y+1.06+k*0.26;
      tx(s,c,{x:c.x,y,w:0.52,h:0.22},yy,T.note,{size:8.5,color:C.MUTE,valign:'middle'});
      gbar(s,c,c.x+0.56,y+0.05,(c.w-1.16)*v/10,0.13);
      tx(s,c,{x:c.x+c.w-0.56,y,w:0.56,h:0.22},`${v}만`,T.glabel,
        {size:9,color:C.BLUE,align:'right',valign:'middle'});
    });
    else hr(s,c.x,c.y+1.17,c.w,C.RULE);
    foot(s,c,c.x,c.y+1.92,c.w,cap,8);
  });

  sectionBar(s,Rw.cmp,Rw.cmp.x,Rw.cmp.y,Rw.cmp.w,'인증 서비스 활용 전후 비교');
  [['자영업자 1년 생존율','67%','99%','↑ 32%p','* 내일사장 인증 서비스 이용 건 기준'],
   ['양도양수 성공비율','47%','80%','↑ 33%p','* 내일사장 인증 서비스 이용 건 기준']].forEach(([k,a,b,d,cap],i)=>{
    const y = Rw.cmp.y+0.58+i*0.66;
    tx(s,Rw.cmp,{x:Rw.cmp.x,y,w:2.90,h:0.30},k,T.body,{size:11,valign:'middle'});
    s.addText([{text:a,options:{fontSize:13,color:C.MUTE}},
               {text:'   →   ',options:{fontSize:11,color:C.MUTE}},
               {text:b,options:{fontSize:24,bold:true,color:C.NAVY}}],
      t({...at(Rw.cmp,{x:Rw.cmp.x+3.028,y:y-0.04,w:2.80,h:0.40},{kind:'fig',pt:24}),valign:'middle'}));
    tx(s,Rw.cmp,{x:Rw.cmp.x+6.056,y:y-0.02,w:1.60,h:0.34},d,T.glabel,
      {size:16,color:C.BLUE,valign:'middle'});
    foot(s,Rw.cmp,Rw.cmp.x+9.084,y+0.03,Rw.cmp.w-9.084,cap,8.5);
  });
  s.addNotes('모수를 새로 만드실 필요가 없습니다. 이 값은 이번 제안 이전에 확보돼 있습니다.');
}

/* ══════════════ 04 02 Capability — 회사 현황 · 연혁 ══════════════ */
{
  const s = page(4,'02','Capability');
  head2(s,'프랜차이즈 본사와 일해 온 회사\n[내일사장] 현황 및 연혁');

  const B = BODY('ir');
  const L = region('coL',SAFE.x,B.y,5.30,B.h);
  const R = region('hisR',SAFE.x+5.72,B.y,RIGHT-(SAFE.x+5.72),B.h);

  /* ── 좌 : 회사 현황 · 협력기관 (본덱 표 어법 — 회색 라벨 열 + 파란 상하 테두리) ── */
  const LBW = 1.50;
  function infoTable(reg,x,y,w,rowsIn,rh){
    hr(s,x,y,w,C.BLUE,0.020);
    let cy = y+0.020;
    rowsIn.forEach(([k,v],i)=>{
      rect(s,at(reg,{x,y:cy,w:LBW,h:rh},{kind:'cell'}),C.GRAY);
      tx(s,reg,{x:x+0.10,y:cy,w:LBW-0.20,h:rh},k,T.body,
        {size:10.5,bold:true,color:C.NAVY,align:'center',valign:'middle'});
      tx(s,reg,{x:x+LBW+0.20,y:cy,w:w-LBW-0.28,h:rh},v,T.body,
        {size:10.5,color:C.NAVY,valign:'middle'});
      cy += rh;
      if(i<rowsIn.length-1) hr(s,x+LBW,cy,w-LBW,C.RULE);
    });
    hr(s,x,cy,w,C.BLUE,0.020);
    return cy+0.020;
  }

  sectionBar(s,L,L.x,L.y,L.w,'회사 현황');
  let ly = infoTable(L,L.x,L.y+0.42,L.w,
    [['회사명','주식회사 내일사장  ·  2023년 1월 설립'],
     ['대표','박규태'],
     ['소재지','경기도 하남시 조정대로 45 미사센텀비즈 922호']],0.44);

  sectionBar(s,L,L.x,ly+0.30,L.w,'협력기관');
  infoTable(L,L.x,ly+0.72,L.w,
    [['관계사','씨엔티테크 (CNT TECH)'],
     ['협력사','한국프랜차이즈산업협회 (KFA)'],
     ['오픈 이노베이션','다날 · SPC 섹타나인 · 토스']],0.46);

  /* ── 우 : 연혁 타임라인 (연도 알약 + 세로 레일) ── */
  sectionBar(s,R,R.x,R.y,R.w,'연혁');
  const HIS = [
    ['2020년 ~','FC 자문사 설립 및 운영',[]],
    ['2023년','플랫폼 개발',
      ['내일사장 1.0 버전 출시 · 웹 버전 오픈',
       '벤처기업 인증 · 기업부설연구소 설립',
       '매물인증 기반 부동산 중개방법 특허출원 3건']],
    ['2024년','BM모델 구축',
      ['서브웨이 등 주요 프랜차이즈 약 20곳 브랜드인증관 입점',
       '한국프랜차이즈산업협회 공동사업단 설립',
       'SPC · 삼성웰스토리 · 다날 업무협약 체결',
       '초기창업패키지 · R&D 디딤돌사업 선정']],
    ['2025년','BM모델 고도화',
      ['구글 우수 스타트업 선정 (Google 창구)',
       'TIPS 선정 (중소벤처기업부)',
       '디지털 이노베이션 IT플랫폼부문 대상 (과기정통부)']]];
  const HY0 = 3.00, HHD = 0.32, HIT = 0.215, HGAP = 0.10, PW = 1.04;
  const dots = [];
  let hy = HY0;
  HIS.forEach(([yr,ttl,items])=>{
    dots.push(hy+HHD/2);
    hy += HHD + items.length*HIT + HGAP;
  });
  rail(s,R,R.x+0.09,HY0+0.06,dots[dots.length-1]-HY0+0.10,dots.map(d=>d),C.RULE);
  hy = HY0;
  HIS.forEach(([yr,ttl,items])=>{
    pill(s,R,R.x+0.34,hy+0.025,yr,C.BLUE,C.WHITE,PW);
    tx(s,R,{x:R.x+0.34+PW+0.16,y:hy,w:R.w-(0.34+PW+0.16),h:HHD},ttl,T.sub,
      {size:12,color:C.NAVY,valign:'middle'});
    hy += HHD;
    items.forEach(v=>{
      tx(s,R,{x:R.x+0.44,y:hy,w:R.w-0.44,h:HIT},'· '+v,T.cardtx,
        {size:9.5,color:C.NAVY,valign:'middle'});
      hy += HIT;
    });
    hy += HGAP;
  });
  s.addNotes('2023년 설립 이후 프랜차이즈 본사를 상대로 쌓아 온 이력입니다.');
}

/* ══════════════ 05 02 Capability — 팀 ══════════════ */
{
  const s = page(5,'02','Capability');
  head2(s,'[세종대학교 겸임교수]들이 만든\n프랜차이즈 창업 지원 플랫폼');

  const B = BODY('ir');
  const CUTY = 4.86;
  const L = region('ceoL',SAFE.x,B.y,5.30,CUTY-B.y);
  const R = region('specR',SAFE.x+5.72,B.y,RIGHT-(SAFE.x+5.72),CUTY-B.y);
  const D = region('cxoD',SAFE.x,5.06,SAFE.w,B.y2-5.06);

  /* ── 좌 : 대표이사 ── */
  sectionBar(s,L,L.x,L.y,L.w,'대표이사');
  tx(s,L,{x:L.x,y:3.00,w:L.w,h:0.30},
    [{text:'박규태  ',options:{color:C.BLUE}},{text:'CEO',options:{color:C.NAVY}}],
    T.sub,{size:15,valign:'middle'});
  tx(s,L,{x:L.x,y:3.32,w:L.w,h:0.24},'유통학 박사 · 세종사이버대 외식창업프랜차이즈학과 겸임교수',
    T.cardtx,{size:9.8,color:C.MUTE,valign:'middle'});
  ['현] (주)내일사장 대표이사',
   '전] 중앙그룹 외식부문 신사업 팀장',
   '전] 이삭토스트 총괄사업부장 (COO)',
   '전] SPC 파리바게뜨 가맹사업본부'].forEach((v,i)=>
    tx(s,L,{x:L.x,y:3.62+i*0.24,w:L.w,h:0.24},v,T.cardtx,{size:9.8,color:C.NAVY,valign:'middle'}));
  hr(s,L.x,4.62,L.w,C.BLUE,0.020);
  tx(s,L,{x:L.x,y:4.64,w:L.w,h:0.22},'대형 프랜차이즈 재직 11년  +  외식 시스템 구축 7년',
    T.cardtx,{size:9.8,bold:true,color:C.NAVY,valign:'middle'});

  /* ── 우 : 프랜차이즈 창업 Specialist 4분야 ── */
  sectionBar(s,R,R.x,R.y,R.w,'프랜차이즈 창업 Specialist');
  const SP = ['프랜차이즈 본부구축','창업 모객 · 매장 활성화 마케팅','가맹점 운영관리 (SV)','가맹영업 · 점포개발'];
  const spw = (R.w-0.16)/2;
  SP.forEach((v,i)=>{
    const x = R.x+(spw+0.16)*(i%2), y = 3.02+(0.84+0.12)*Math.floor(i/2);
    rrect(s,at(R,{x,y,w:spw,h:0.84},{kind:'card'}),i<2?C.BLUEBG:C.BLUEBG0,0.06);
    tx(s,R,{x:x+0.16,y,w:spw-0.32,h:0.84},v,T.body,
      {size:11,bold:true,align:'center',valign:'middle'});
  });

  /* ── 하 : C-Level 3인 ── */
  hr(s,SAFE.x,4.96,SAFE.w,C.RULE);
  const CXO = [
    ['천영식','CMO','프랜차이즈 경영학 석사 · 창업마케팅 저서 다수',
      ['현] 경기창조센터 마케팅 전임교수','전] 한촌 · 육수당 마케팅 본부장',
       '전] 죠스떡볶이 · 바르다김선생 마케팅 팀장','전] 창업마케팅 와이즈컴퍼니 대표']],
    ['김우곤','COO','유통학 박사 · 세종대학교 유통학과 겸임교수',
      ['전] McDonald\'s · Subway International B.V','전] Delivery Hero Korea · 투썸플레이스 · 폴바셋',
       '전] SPC 등 외식 프랜차이즈 15년']],
    ['김준영','CSO','호텔관광경영학 박사 · 세종대학교 유통학과 겸임교수',
      ['현] 한국외식협회 전문위원','전] 제너시스그룹 BBQ OSM팀 실무 관리자',
       '전] 한국프랜차이즈학회 간사','전] 알파랩 2.0 수석연구원']]];
  const cw = (D.w-0.48)/3;
  CXO.forEach(([nm,pos,deg,cars],i)=>{
    const x = D.x+(cw+0.24)*i;
    if(i) vr(s,x-0.12,D.y+0.02,1.34,C.RULE,0.008);
    tx(s,D,{x,y:D.y,w:cw,h:0.28},
      [{text:nm+'  ',options:{color:C.BLUE}},{text:pos,options:{color:C.NAVY}}],
      T.sub,{size:12.5,valign:'middle'});
    tx(s,D,{x,y:D.y+0.30,w:cw,h:0.24},deg,T.cardtx,{size:9.3,color:C.MUTE,valign:'middle'});
    cars.forEach((v,k)=>tx(s,D,{x,y:D.y+0.60+k*0.235,w:cw,h:0.235},v,T.cardtx,
      {size:9.3,color:C.NAVY,valign:'middle'}));
  });
  s.addNotes('가맹 개설을 본사에서 직접 해 본 사람들이 만든 회사입니다.');
}

/* ══════════════ 06 02 Capability — 수행 업무 · 수행 브랜드 ══════════════ */
{
  const s = page(6,'02','Capability');
  head2(s,'[가맹영업] 수행 업무 3종\n및 수행 브랜드 현황');

  const B = BODY('ir');
  const L = region('wL',SAFE.x,B.y,4.60,B.h);
  const R = region('wR',SAFE.x+5.06,B.y,RIGHT-(SAFE.x+5.06),B.h);

  sectionBar(s,L,L.x,L.y,L.w,'러너펍에 투입할 수행 업무 3종');
  [['deal','가맹영업대행',['예비창업자 모객 · 1차 상담 · 등급 분류','조건별 브랜드 매칭 및 미팅 주선','인·적성검사, 정보공개서 제공부터 계약 체결까지 절차 관리']],
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
  sectionBar(s,R,R.x,R.y+2.74,R.w,'진행 사례');
  rrect(s,at(R,{x:R.x,y:R.y+3.22,w:R.w,h:0.64},{kind:'card'}),C.BLUEBG,0.08);
  tx(s,R,{x:R.x+0.22,y:R.y+3.22,w:R.w-0.44,h:0.64},
    '33떡볶이 강동역점 — 임대차 · 가맹 예약 완료 · 주간 실매출 2,150 / 1,500만원 2주 실측',
    T.sub,{size:12,valign:'middle'});
  foot(s,R,R.x,R.y+3.94,R.w,'※ 2025~2026 영업 수행 브랜드 기준 · 브랜드별 계약 체결 건수는 미팅 시 원장 기준으로 제시');
  s.addNotes('플랫폼 지표가 아니라 가맹을 판 실적입니다.');
}

/* ══════════════ 07 02 Capability — 전략적 제휴 현황 ══════════════ */
{
  const s = page(7,'02','Capability');
  head2(s,'예비창업자 접점을 넓히는\n[전략적 제휴] 현황');

  const B = BODY('ir');
  sectionBar(s,B,B.x,B.y,B.w,'러너펍 창업 수요 확보에 활용되는 제휴망');
  const AL = [['SPC 플랫폼 개발 참여','신뢰도','파리바게뜨 · 던킨 등 가맹점 6,000개',null,1],
              ['KFA 공동사업단 공동설립','신뢰도','프랜차이즈 본사 1,400여개 대상 · 인증매장 · 위생교육','kfa',1],
              ['바로고 든든상점','모객','등록매장 18만 대상 배너 · 푸시 상호 노출','barogo',1],
              ['삼성웰스토리 365솔루션','모객','사업단 공동설립 · 브랜드인증관 입점 및 광고',null,0],
              ['요기요','모객','플랫폼 배너 · 내일사장 제작 콘텐츠 노출','yogiyo',0],
              ['동네알바 (사람인)','모객','상시 배너 노출','saramin',0],
              ['포브스코리아 어워즈','신뢰도','중앙일보 주최 · 내일사장 주관','forbes',0],
              ['아프니까 사장이다','모객','회원 210만 대상 바이럴',null,0]];
  const gw = (B.w-0.28*3)/4, gh = 1.62, GAP = 0.30;
  const gy0 = B.y+0.56 + ((B.h-0.56)-(gh*2+GAP))/2;
  AL.forEach(([k,tag,v,lg,major],i)=>{
    const x = B.x+(gw+0.28)*(i%4), y = gy0+(gh+GAP)*Math.floor(i/4);
    rrect(s,at(B,{x,y,w:gw,h:gh},{kind:'card'}),major?C.BLUEBG:C.BLUEBG0,0.08);
    if(lg){
      // 로고 벽은 높이가 아니라 잉크 면적을 통일해야 광학 무게가 맞는다.
      // 높이로 맞추면 가로로 긴 마크(KFA a=8.7)가 짧은 마크(요기요 a=2.0)보다 4배 커 보인다.
      const f = P(`lg_${lg}.png`), a = G.imgAspect(f), AREA = 0.190;
      let lh2 = Math.sqrt(AREA/a), lwd = a*lh2;
      if(lwd > 1.46){ lwd = 1.46; lh2 = lwd/a; }
      if(lh2 > 0.30){ lh2 = 0.30; lwd = a*lh2; }
      s.addImage({path:f, ...img(B,{x:x+0.20,y:y+0.13+(0.30-lh2)/2,w:lwd,h:lh2},f)});
    }
    const cw = G.textWidth(tag,8.5)+0.42;
    tagChip(s,B,x+gw-0.20-cw,y+0.16,tag,{bg:C.WHITE,color:C.BLUE});
    tx(s,B,{x:x+0.20,y:y+0.52,w:gw-0.40,h:0.42},k,T.sub,{size:11.5});
    hr(s,x+0.20,y+1.00,gw-0.40,C.RULE);
    tx(s,B,{x:x+0.20,y:y+1.06,w:gw-0.40,h:0.42},v,T.cardtx,{size:9.3,color:C.MUTE});
  });
  s.addNotes('러너펍에 필요한 창업 수요는 이 제휴망 안에서 나옵니다.');
}

/* ══════════════ 08 02 Capability — 근거 문서 (리드 허용 1) ══════════════ */
{
  const s = p.addSlide(); bg(s,C.WHITE);
  grad(s,FULL(),{x:0,y:2.44,w:G.W,h:G.H-2.44},'gr_panel.png',C.BLUEBG0);
  hr(s,0,2.44,G.W,C.RULE,0.010);
  frame(s,8,'02');
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
    s.addImage({path:f, ...img(c,{x:c.x+(c.w-iw)/2,y:c.y+3.20-ih,w:iw,h:ih},f)});
    rrect(s,at(c,{x:c.x,y:c.y+3.26,w:c.w,h:0.36},{kind:'cap'}),C.BLUE,0.08);
    rect(s,at(c,{x:c.x,y:c.y+3.26,w:c.w,h:0.18},{kind:'cap'}),C.BLUE);
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

/* ══════════════ 09 03 Terms — 위임 범위 ══════════════ */
{
  const s = page(9,'03','Terms');
  head2(s,'발굴부터 클로징까지\n[전 과정 위임], 본사는 승인');

  const B = BODY('ir');
  const Rw = G.rows(B,[['tbl',1],['gap',0.14,'fix'],['trk',0.90,'fix']]);
  sectionBar(s,Rw.tbl,Rw.tbl.x,Rw.tbl.y,Rw.tbl.w,'러너펍 가맹 개설 업무별 수행 주체와 본사 승인 사항');
  const tb = region('tb',Rw.tbl.x,Rw.tbl.y+0.48,Rw.tbl.w,Rw.tbl.h-0.48);
  { const rh=(tb.h-0.38)/7;
    for(let i=1;i<7;i+=2) rect(s,at(tb,{x:tb.x,y:tb.y+0.38+rh*i,w:tb.w,h:rh},{kind:'row'}),C.BLUEBG0); }
  table(s,tb,[{h:'업무',w:2.70},{h:'내일사장 수행',w:5.80},{h:'본사 승인',w:tb.w-8.50}],[
    ['영업 조직 운영','가맹영업팀 운영 · 두 트랙 동시 영업',{v:'—',c:C.MUTE}],
    ['창업 마케팅','예비창업자 리드 확보 · 창업마케팅 집행','브랜드 자료 승인'],
    ['창업 상담 및 브리핑','상권 · 손익 자료와 인·적성검사 결과로 결정 마무리','승인 문구 사용 · 점주 승인'],
    ['점포개발 및 물건화','실측 · 견적까지 끝낸 브리핑 상태','개설 승인'],
    ['계약 주선','조건 협의 및 클로징 지원','가맹계약 체결'],
    ['인테리어 시공','공사주관 및 도급계약 수행 가능','시공 여부 · 수익 분배 협의'],
    ['본사 유입 건','성공보수 대상 제외 · 리드 최초 유입 경로 기준','유입 경로 본사 확인'],
  ],{rh:(tb.h-0.38)/7,fs:10.5});

  sectionBar(s,Rw.trk,Rw.trk.x,Rw.trk.y,Rw.trk.w,'영업 2트랙');
  const ts = split(region('tk',Rw.trk.x,Rw.trk.y+0.42,Rw.trk.w,0.48),2,0.30);
  [['TRACK A','신규 창업자','플랫폼 상주 창업 수요 · 예비창업자 DB 5,114명'],
   ['TRACK B','기존 홀덤펍 리브랜딩','운영 중인 점주 대상 · 검토 기간 단축']].forEach(([a,b,c],i)=>{
    const cc = ts[i];
    rrect(s,at(cc,{x:cc.x,y:cc.y,w:cc.w,h:cc.h},{kind:'card'}),C.BLUEBG0,0.06);
    tx(s,cc,{x:cc.x+0.18,y:cc.y+0.02,w:0.92,h:0.24},a,T.label,{color:C.BLUE,valign:'middle'});
    tx(s,cc,{x:cc.x+1.14,y:cc.y+0.01,w:cc.w-1.32,h:0.26},b,T.sub,{size:12,valign:'middle'});
    tx(s,cc,{x:cc.x+0.18,y:cc.y+0.27,w:cc.w-0.36,h:0.21},c,T.cardtx,{size:9.3,color:C.MUTE});
  });
  s.addNotes('본사는 승인만 하시면 됩니다.');
}

/* ══════════════ 10 03 Terms — 비교 · 결론 띠 ══════════════ */
{
  const s = page(10,'03','Terms',true);
  head2(s,'[직영 채용] · 일반 대행 · 내일사장\n세 가지 방식 비교');

  const B = BODY('full');
  sectionBar(s,B,B.x,B.y,B.w,'러너펍 가맹 개설 영업 방식 항목별 비교');
  const tb = region('cb',B.x,B.y+0.48,B.w,B.h-0.80);
  const cw = (tb.w-2.86)/3;
  rrect(s,at(tb,{x:tb.x+2.86+cw*2,y:tb.y,w:cw,h:tb.h},{kind:'hl'}),C.BLUEBG,0.08);
  { const rh=(tb.h-0.38)/7;
    for(let i=1;i<7;i+=2) rect(s,at(tb,{x:tb.x,y:tb.y+0.38+rh*i,w:tb.w-cw,h:rh},{kind:'row'}),C.BLUEBG0); }
  table(s,tb,[{h:'',w:2.86},{h:'직영 채용',w:cw,a:'center'},{h:'일반 대행',w:cw,a:'center'},
              {h:'내일사장',w:cw,a:'center'}],[
    ['착수 시점 비용',{v:'급여 · 4대보험',c:C.MUTE},{v:'착수금 발생',c:C.MUTE},{v:'0원',b:true,c:C.BLUEDK}],
    ['미계약 건 원가',{v:'본사 부담',c:C.MUTE},{v:'본사 부담',c:C.MUTE},{v:'내일사장 부담',b:true,c:C.BLUEDK}],
    ['창업자 모수',{v:'직접 모객',c:C.MUTE},{v:'대행사 규모에 따름',c:C.MUTE},{v:'앱 10만 · DB 5,114명',b:true,c:C.BLUEDK}],
    ['점주 선별 기준',{v:'담당자 판단',c:C.MUTE},{v:'대행사 재량',c:C.MUTE},{v:'인·적성검사 결과 제출',b:true,c:C.BLUEDK}],
    ['브리핑 자료',{v:'직접 제작',c:C.MUTE},{v:'브랜드 자료 전달',c:C.MUTE},{v:'상권 · 손익 직접 산출',b:true,c:C.BLUEDK}],
    ['준법 관리',{v:'담당자 역량',c:C.MUTE},{v:'대행사 재량',c:C.MUTE},{v:'시스템 강제',b:true,c:C.BLUEDK}],
    ['본사 인력 증원',{v:'필요',c:C.MUTE},{v:'관리 인력 필요',c:C.MUTE},{v:'0명',b:true,c:C.BLUEDK}],
  ],{rh:(tb.h-0.38)/7});
  foot(s,B,B.x+2.86,B.y+B.h-0.26,B.w-2.86,
    '※ 직영 채용 — 계약 성사 여부와 무관하게 급여 · 4대보험 매월 발생    ※ 일반 대행 — 착수금 유무 및 반환 조건은 대행사별 계약에 따름');

  bandSentence(s,'미위임 시 채용 고정비와 미계약 건 원가 본사 부담 · 위임 시 [계약 성사 건에만 비용 발생]');
  s.addNotes('대안과 나란히 놓아야 위임이 계산됩니다.');
}

/* ══════════════ 11 03 Terms — 비용 · 정산 ══════════════ */
{
  const s = page(11,'03','Terms');
  head2(s,'[비용 발생] 시점과\n성공보수 정산 기준');

  const B = BODY('ir');
  const L = region('cL',SAFE.x,B.y,6.20,B.h);
  const R = region('cR',SAFE.x+6.66,B.y,RIGHT-(SAFE.x+6.66),B.h);

  sectionBar(s,L,L.x,L.y,L.w,'항목별 발생 시점과 금액');
  const tb = region('tb',L.x,L.y+0.48,L.w,3.34);
  { const rh=(tb.h-0.38)/5;
    for(let i=1;i<5;i+=2) rect(s,at(tb,{x:tb.x,y:tb.y+0.38+rh*i,w:tb.w,h:rh},{kind:'row'}),C.BLUEBG0); }
  table(s,tb,[{h:'항목',w:1.50},{h:'발생 시점',w:tb.w-3.20},{h:'금액',w:1.70,a:'right'}],[
    ['착수금','해당 없음',{v:'0원',b:true,c:C.BLUE}],
    ['월 고정비','해당 없음',{v:'0원',b:true,c:C.BLUE}],
    ['광고비','가맹 개설 영업 대가 청구 없음',{v:'0원',b:true,c:C.BLUE}],
    [{v:'성공보수',b:true},'가맹계약 체결 및 가맹비 입금 완료 후',{v:'1,000만원',b:true,c:C.NAVY}],
    ['해제 · 환불 시','본사 정책에 맞춰 착수 전 협의',{v:'협의',c:C.MUTE}],
  ],{rh:(tb.h-0.38)/5});
  foot(s,L,L.x,L.y+3.90,L.w,'※ 성공보수는 부가가치세 별도');

  sectionBar(s,R,R.x,R.y,R.w,'할인 귀속과 해제 시 환수');
  [['할인 귀속','할인액 전액 내일사장 성공보수에서 차감 · 본사 가맹비 수취 1,500만원 불변'],
   ['해제 시 환수','가맹계약 해제 · 환불 발생 시 성공보수 환수 기준을 착수 전 협의']].forEach(([k,v],i)=>{
    const y = R.y+0.48+i*0.66;
    rrect(s,at(R,{x:R.x,y,w:R.w,h:0.60},{kind:'card'}),C.BLUEBG0,0.06);
    tx(s,R,{x:R.x+0.18,y:y+0.04,w:R.w-0.36,h:0.22},k,T.label,{color:C.BLUE,valign:'middle'});
    tx(s,R,{x:R.x+0.18,y:y+0.26,w:R.w-0.36,h:0.32},v,T.cardtx,{size:9.3,color:C.NAVY});
  });
  foot(s,R,R.x,R.y+1.80,R.w,'※ 할인 한도는 건별 본사 승인 후 확정 · 내일사장 단독 조건 제시 없음');

  sectionBar(s,R,R.x,R.y+2.10,R.w,'LSM 광고 집행 기준 · 내일사장 수취 구간');
  [['800만원 이하','본사 집행'],
   ['800만원 초과 ~ 1,000만원 미만','양사 협의'],
   ['1,000만원 전액 수취','내일사장 집행 · 수취액 중 200만원 매장 LSM 광고비']].forEach(([k,v],i)=>{
    const y = R.y+2.56+i*0.54;
    rrect(s,at(R,{x:R.x,y,w:R.w,h:0.48},{kind:'card'}),i===2?C.BLUEBG:C.BLUEBG0,0.06);
    stepBadge(s,R,R.x+0.16,y+0.11,0.26,i+1);
    tx(s,R,{x:R.x+0.54,y:y+0.02,w:R.w-0.72,h:0.24},k,T.body,{size:10,bold:true,valign:'middle'});
    tx(s,R,{x:R.x+0.54,y:y+0.24,w:R.w-0.72,h:0.22},v,T.cardtx,{size:9.3,color:C.MUTE,valign:'middle'});
  });
  s.addNotes('청구는 계약이 체결되고 가맹비 입금이 확인된 뒤에만 발생합니다.');
}

/* ══════════════ 12 03 Terms — 회수 구조 ══════════════ */
{
  const CUT = 6.10;
  const s = p.addSlide(); bg(s,C.WHITE);
  grad(s,FULL(),{x:CUT,y:0,w:G.W-CUT,h:G.H},'gr_panelh.png',C.BLUEBG0);
  vr(s,CUT,0,G.H,C.RULE,0.010);
  frame(s,12,'03');
  head2(s,'계약 시점부터 흑자,\n[로열티 전액 순증]',{x:SAFE.x,w:5.10});

  const B = BODY('ir');
  const L = region('rL',SAFE.x,B.y,CUT-SAFE.x-0.46,B.h);
  const R = region('rR',CUT+0.46,B.y,RIGHT-(CUT+0.46),B.h);

  sectionBar(s,L,L.x,L.y,L.w,'계약 1건 · 계약 시점');
  [['가맹비 (본사 수취)','+1,500만원',C.NAVY],['성공보수 (내일사장)','−1,000만원',C.MUTE]].forEach(([k,v,col],i)=>{
    const y = L.y+0.58+i*0.48;
    tx(s,L,{x:L.x,y,w:2.70,h:0.32},k,T.body,{size:11,valign:'middle'});
    tx(s,L,{x:L.x+2.70,y,w:L.w-2.70,h:0.32},v,T.glabel,
      {size:14,color:col,align:'right',valign:'middle'});
    hr(s,L.x,y+0.38,L.w,C.RULE);
  });
  rrect(s,at(L,{x:L.x,y:L.y+1.62,w:L.w,h:0.86},{kind:'card'}),C.BLUEBG,0.08);
  tx(s,L,{x:L.x+0.20,y:L.y+1.72,w:L.w-0.40,h:0.24},'계약 시점 본사 순수취',T.note,
    {size:9,color:C.MUTE,valign:'middle'});
  s.addText([{text:'+500',options:{fontSize:30,bold:true,color:C.BLUE,charSpacing:-1.2}},
             {text:'만원',options:{fontSize:13,bold:true,color:C.BLUE}}],
    t({...at(L,{x:L.x+0.20,y:L.y+1.94,w:L.w-0.40,h:0.48},{kind:'fig',pt:30}),valign:'middle'}));
  tx(s,L,{x:L.x,y:L.y+2.62,w:L.w,h:0.26},'이후 월 로열티 150만원 전액 본사 순증 — 개설 대가 추가 청구 없음',T.body,
    {size:11,valign:'middle'});
  tx(s,L,{x:L.x,y:L.y+2.96,w:L.w,h:0.44},
    '개설 기본비용 1,600만원 전액 할인 프로모션은 본사 정책 그대로 유지 · 성공보수는 가맹비 1,500만원 범위 안에서만 정산',
    T.body,{size:10,color:C.NAVY});
  foot(s,L,L.x,L.y+3.90,L.w,'※ 러너펍 공개 가맹 안내 기준 시뮬레이션 · 실제 조건은 본사 정책에 따름');

  sectionBar(s,R,R.x,R.y,R.w,'1개점 누적 본사 순수취 — 성공보수 차감 후',{bg:C.WHITE});
  [['12개월',2300],['24개월',4100],['36개월',5900]].forEach(([k,v],i)=>{
    const y = R.y+0.58+i*0.48;
    tx(s,R,{x:R.x,y,w:0.96,h:0.28},k,T.body,{size:10.5,valign:'middle'});
    gbar(s,R,R.x+1.02,y+0.05,(R.w-2.62)*v/5900,0.18);
    tx(s,R,{x:R.x+R.w-1.52,y,w:1.52,h:0.28},v.toLocaleString()+'만원',T.glabel,
      {size:11,color:i===2?C.BLUE:C.NAVY,align:'right',valign:'middle'});
  });
  sectionBar(s,R,R.x,R.y+2.06,R.w,'출점 규모별 36개월 누적 순수취',{bg:C.WHITE});
  [['3개점',17700],['5개점',29500],['10개점',59000]].forEach(([k,v],i)=>{
    const y = R.y+2.62+i*0.44;
    tx(s,R,{x:R.x,y,w:0.96,h:0.28},k,T.body,{size:10.5,valign:'middle'});
    gbar(s,R,R.x+1.02,y+0.05,(R.w-2.62)*v/59000,0.18);
    tx(s,R,{x:R.x+R.w-1.52,y,w:1.52,h:0.28},v.toLocaleString()+'만원',T.glabel,
      {size:11,color:i===2?C.BLUE:C.NAVY,align:'right',valign:'middle'});
  });
  foot(s,R,R.x,R.y+3.94,R.w,'10개점 × 36개월 = 5억 9,000만원   ·   단위 : 만원');
  s.addNotes('계약 시점에 이미 흑자입니다.');
}

/* ══════════════ 13 04 Governance — 준법 통제 ══════════════ */
{
  const s = page(13,'04','Governance');
  head2(s,'사람이 아닌\n[시스템] 기반의 준법 통제');

  const B = BODY('ir');
  const Rw = G.rows(B,[['flow',1.14,'fix'],['gap',0.22,'fix'],['tbl',1]]);
  sectionBar(s,Rw.flow,Rw.flow.x,Rw.flow.y,Rw.flow.w,'전자계약 잠금 흐름');
  const FL = [['정보공개서 제공','본사 자료 그대로 전달'],
              ['D-14 자동 카운트','가맹사업법 제7조제3항'],
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
  const gt = region('gt',Rw.tbl.x,Rw.tbl.y+0.48,Rw.tbl.w,Rw.tbl.h-0.48);
  { const rh=(gt.h-0.38)/6;
    for(let i=1;i<6;i+=2) rect(s,at(Rw.tbl,{x:Rw.tbl.x,y:gt.y+0.38+rh*i,w:Rw.tbl.w,h:rh},{kind:'row'}),C.BLUEBG0); }
  const GV = [['정보공개서 · 계약서','본사 제공 · 내일사장은 전달 및 설명 보조'],
              ['법정 숙고기간','가맹사업법 제7조제3항 14일 준수 · 기간 단축 유도 금지'],
              ['예상매출 진술','구두 약속 금지 · 본사 승인 문구만 사용'],
              ['광고 · 상담 스크립트','본사 사전 승인 후 사용'],
              ['위반 확인 시','해당 건 영업 즉시 중단 및 본사 통보'],
              ['업종 인허가 · 게임물 기준','러너펍 본사 기준 그대로 적용 · 내일사장 독자 판단 및 안내 금지']];
  table(s,gt,[{h:'항목',w:3.32},{h:'기준',w:gt.w-3.32}],
    GV.map(([k,v])=>[{v:k,b:true},v]),{rh:(gt.h-0.38)/6});
  s.addNotes('준법은 사람이 아니라 시스템이 강제합니다.');
}

/* ══════════════ 14 04 Governance — 업종 이력 없음 ══════════════ */
{
  const s = page(14,'04','Governance',true);
  head2(s,'홀덤 업종\n[영업 이력 없음]');

  const B = BODY('ir');
  const L = region('nL',SAFE.x,B.y,4.72,B.h);
  const R = region('nR',SAFE.x+5.18,B.y,RIGHT-(SAFE.x+5.18),B.h);

  rrect(s,at(L,{x:L.x,y:L.y,w:L.w,h:1.62},{kind:'card'}),C.BLUEBG0,0.08);
  tagChip(s,L,L.x+0.20,L.y+0.16,'업종 경험 없음');
  tx(s,L,{x:L.x+0.20,y:L.y+0.54,w:2.10,h:0.24},'홀덤 업종 영업 이력',T.note,
    {size:9,color:C.MUTE,valign:'middle'});
  s.addText([{text:'0',options:{fontSize:32,bold:true,color:C.NAVY,charSpacing:-1.2}},
             {text:'건',options:{fontSize:13,bold:true,color:C.MUTE}}],
    t({...at(L,{x:L.x+0.20,y:L.y+0.80,w:1.90,h:0.60},{kind:'fig',pt:32}),valign:'middle'}));
  vr(s,L.x+2.42,L.y+0.54,0.86,C.RULE);
  tx(s,L,{x:L.x+2.62,y:L.y+0.54,w:L.w-2.82,h:0.24},'본사가 정하시는 항목',T.note,
    {size:9,color:C.MUTE,valign:'middle'});
  s.addText([{text:'8',options:{fontSize:32,bold:true,color:C.BLUE,charSpacing:-1.2}},
             {text:'건',options:{fontSize:13,bold:true,color:C.BLUE}}],
    t({...at(L,{x:L.x+2.62,y:L.y+0.80,w:1.70,h:0.60},{kind:'fig',pt:32}),valign:'middle'}));
  ['첫 구간 파일럿 운영','건수 · 기간 · 중단 시점 본사 단독 결정',
   '보완 장치 — 파일럿 · 주 단위 리포트 · 본사 승인 자료 전용',
   '러너펍 브랜드 및 러너러너 앱 본사 교육 이수 후 영업 투입'].forEach((v,i)=>{
    const y = L.y+1.92+i*0.46;
    check(s,L,L.x,y+0.03,0.20);
    tx(s,L,{x:L.x+0.32,y,w:L.w-0.32,h:0.28},v,T.body,{size:11,valign:'middle'});
  });
  foot(s,L,L.x,L.y+3.86,L.w,'※ 리브랜딩 트랙은 운영 중 점주 대상이며, 입지 · 손익 · 계약 절차는 업종과 무관');

  sectionBar(s,R,R.x,R.y,R.w,'파일럿 운영 기준 — 본사 결정 사항');
  const pt = region('pt',R.x,R.y+0.48,R.w,B.h-0.48);
  { const rh=(pt.h-0.38)/8;
    for(let i=1;i<8;i+=2) rect(s,at(R,{x:R.x,y:pt.y+0.38+rh*i,w:R.w,h:rh},{kind:'row'}),C.BLUEBG0); }
  const PT = [['검증 기간','착수 전 별지로 기간 확정'],
              ['목표 건수','착수 전 별지로 목표 건수 확정'],
              ['영업 범위','전국 또는 특정 권역 중 선택'],
              ['평가 지표','신규 리드 수 · 상담 진행 수 · 계약 체결 건수'],
              ['보고','주 단위 리포트 — 활동 지표 및 단계별 파이프라인'],
              ['착수 조건','본사 승인 자료 확정 후 즉시 착수 · 착수금 없음'],
              ['중단 기준','본사 판단으로 즉시 중단 — 사유 제한 없음'],
              ['기간 종료 시','연장 또는 종료 본사 단독 결정']];
  table(s,pt,[{h:'항목',w:2.42},{h:'본사 결정 사항',w:pt.w-2.42}],
    PT.map(([k,v])=>[{v:k,b:true},v]),{rh:(pt.h-0.38)/8});
  s.addNotes('숨기지 않고 먼저 말씀드립니다. 검증 방법은 본사가 정하십니다.');
}

/* ══════════════ 15 Close — 결정 5건 · 담당 ══════════════ */
{
  const s = p.addSlide(); bg(s,C.WHITE);
  const F = FULL();
  grad(s,F,{x:0,y:0,w:G.W,h:G.H},'gr_page.png',C.WHITE);
  setSlide(15);
  hr(s,SAFE.x,Y.topRule.y,SAFE.w,C.NAVY,0.014);
  const brow = region('brow',SAFE.x,Y.brow.y,SAFE.w,Y.brow.h);
  const BL = P('ns_logo.png'), bl = 1.10, blh = bl/G.imgAspect(BL);
  s.addImage({path:BL, ...img(brow,{x:RIGHT-bl,y:Y.brow.y+(Y.brow.h-blh)/2,w:bl,h:blh},BL)});
  { const ft = region('foot',SAFE.x,Y.foot.y,SAFE.w,Y.foot.h);
    tx(s,ft,{x:RIGHT-1.2,y:Y.foot.y+0.02,w:1.2,h:0.22},'15',T.foot,
      {size:9,color:C.MUTE,align:'right',valign:'middle'}); }
  head(s,'본사가 정하시는 [결정 5건]');
  lead(s,'아래 다섯 가지만 정해 주시면 그대로 따릅니다.',false,11);

  const B = BODY('max');
  [['전속 · 비전속','전속 여부 · 타 대행사 병행 · 홀덤 동종 브랜드 영업 제한'],
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

  hr(s,B.x+(B.w-4.20)/2,B.y+2.76,4.20,C.RULE);
  const CL = P('ns_logo.png'), cl = 1.72, clh = cl/G.imgAspect(CL);
  s.addImage({path:CL, ...img(B,{x:B.x+(B.w-cl)/2,y:B.y+2.88,w:cl,h:clh},CL)});
  tx(s,B,{x:B.x,y:B.y+3.34,w:B.w,h:0.28},'내일부터 내 일이 사장이 되는 플랫폼',T.sub,
    {size:14,align:'center',valign:'middle'});
  tx(s,B,{x:B.x,y:B.y+3.64,w:B.w,h:0.22},'담당  지용관 본부장 · 010-3629-7778',T.body,
    {size:10.5,bold:true,color:C.BLUE,align:'center',valign:'middle'});
  tx(s,B,{x:B.x,y:B.y+3.86,w:B.w,h:0.22},
    '수신  러너스튜디오(주) 귀중 · 대표 박경관   ·   서울 강남구 삼성로100길 12 제이타워 B2',T.note,
    {size:9,color:C.MUTE,align:'center',valign:'middle'});
  s.addNotes('다섯 가지만 정해 주시면 됩니다.');
}

/* ═══ 저장 ═══ */
const OUT='/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v4/runnerpub_v10.pptx';
G.imgManifest('/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v4/img_manifest.json');
const rep=G.report('/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v4/layout_report_v10.txt');
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
