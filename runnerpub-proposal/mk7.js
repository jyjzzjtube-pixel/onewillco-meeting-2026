/* 러너펍 가맹 개설 영업 위임 제안 — 주식회사 내일사장
   v7 · 본사가동 비주얼 극대화 모드 설계(spec_v7.json) 적용. 15장.
   순색 풀블리드 5장(01·02·04·10·13) / 좌우 명암분할 5장(03·05·08·12·15). */
const NM = '/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/node_modules';
const pptxgen = require(NM + '/pptxgenjs');
const p = new pptxgen();
p.layout = 'LAYOUT_WIDE';
p.author = '주식회사 내일사장'; p.company = '주식회사 내일사장';
p.title = '러너펍 가맹 개설 영업 위임 제안 — 내일사장';

const K = require('./kit6.js')(p);
const { C,T,t,G,A,path, rect,rrect,bg,hr,vr, skyline, tx,runs, frame,anchor,head,lead,note,
        bandFig,bandSentence,bandChips, check,icon,iconRow,stepBadge,hiFig,pill,card,bar,table,fig,
        splitPanel,mark,kpi,tri,rail,chart2, BODY,
        SAFE,Y,span,region,split,pad,at,fit,img,setSlide,BLEED } = K;

const P = (f)=>path.join(A,f);
const CUT6 = G.colX(6)-G.GUT/2;      // 6.666
const CUT5 = G.colX(5)-G.GUT/2;      // 5.662
const CUT7 = G.colX(7)-G.GUT/2;      // 7.671
const RIGHT = SAFE.x+SAFE.w;         // 12.583

/* ══════════════ 01 표지 — 순색 네이비 ══════════════ */
{
  const s=p.addSlide(); bg(s,C.NAVY);
  const F=region('cover',0,0,G.W,G.H);
  skyline(s,0,G.H-1.42,G.W,1.42);
  rect(s,{x:0,y:0,w:0.22,h:G.H},C.BLUE);
  frame(s,1,'표지',true);

  /* 좌 — 내일사장 앱 화면 2대 */
  const pf=P('cover_phones.png'), pw=3.42, ph=pw/G.imgAspect(pf);
  s.addImage({path:pf, ...img(F,{x:0.95,y:1.30,w:pw,h:ph},pf)});
  tx(s,F,{x:0.95,y:1.34+ph,w:pw+0.6,h:0.24},'내일사장 앱 — 실매출 검증 · 인증 리포트',T.note,
    {color:C.MUTED,valign:'middle'});

  /* 우 — 카피 */
  const RX=5.30, RW=RIGHT-RX;
  tx(s,F,{x:RX,y:1.10,w:RW,h:0.28},'가맹 개설 영업 위임 제안',T.label,
    {size:12,color:C.BLUEL,cs:3.2,valign:'middle'});
  hr(s,RX,1.52,1.80,C.BLUE,0.032);
  tx(s,F,{x:RX,y:1.78,w:RW,h:1.46},
    runs('가맹을 팔아 온 사람들이\n[러너펍을 팔겠습니다]',true),T.head,{size:36,ls:50});
  tx(s,F,{x:RX,y:3.36,w:RW,h:0.68},
    'SPC 파리바게뜨 가맹사업본부 · 이삭토스트 COO · 맥도날드 · 써브웨이 출신이 만든\n창업 플랫폼입니다. 계약이 체결되고 가맹비 입금이 완료된 건에만 청구합니다.',
    T.lead,{color:C.MUTED});

  kpi(s,F,{x:RX,y:4.40,w:RW,h:0.90},'1,000','만원','가맹계약 1건당 성공보수 · VAT 별도',
    {size:48,hi:true,hiW:3.30});

  hr(s,RX,5.62,RW,C.RULED);
  const lw=1.30, lh=lw/3.7009;
  s.addImage({path:P('ns_logo_w.png'), ...img(F,{x:RX,y:5.82,w:lw,h:lh},P('ns_logo_w.png'))});
  icon(s,F,RX+lw+0.22,5.86,0.26,'arrow',true);
  const rw=1.42, rh=rw/3.045;
  s.addImage({path:P('logo.png'), ...img(F,{x:RX+lw+0.70,y:5.80,w:rw,h:rh},P('logo.png'))});
  tx(s,F,{x:RX+lw+0.70+rw+0.34,y:5.86,w:RW-(lw+0.70+rw+0.34),h:0.26},
    '수신  러너스튜디오(주) 귀중 · 대표 박경관',T.body,
    {size:10.5,color:C.INK_ON,valign:'middle'});

  bandFig(s,'착수금 · 월 고정비 · 광고비 · 미계약 건 원가','0','원',{dark:true});
  s.addNotes('발신은 주식회사 내일사장입니다. 저희 팀이 가맹사업 본부 출신이라는 점부터 말씀드립니다.');
}

/* ══════════════ 02 01 Problem — 순색 네이비 (챕터 표지) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.NAVY);
  frame(s,2,'01',true,true);
  anchor(s,'Problem',true);
  head(s,'창업자는 [판단 근거가 없어서] 결정 직전에 멈춥니다',true);
  lead(s,'홀덤펍 창업을 고민하는 사람이 실제로 지나는 경로와, 각 이해관계자의 목적이 어긋나는 지점입니다.',true,10);

  const B=BODY('full');
  const L=region('pL',B.x,B.y,span(0,9).w,B.h);
  const R=region('pR',span(9,3).x,B.y,span(9,3).w,B.h);
  const Rw=G.rows(L,[['path',1.24,'fix'],['gap',0.18,'fix'],['tbl',1]]);

  tx(s,Rw.path,{x:Rw.path.x,y:Rw.path.y,w:3.4,h:0.26},'주요 창업 경로',T.label,
    {color:C.MUTED,valign:'middle'});
  [['포털사이트 검색','컨설턴트 매물 추천','브랜드 정보는 컨설턴트가 준다'],
   ['지인 · 커뮤니티','공인중개사 사무소 방문','매물 정보는 중개사가 준다']].forEach(([a,b,tail],ri)=>{
    const y=Rw.path.y+0.40+ri*0.46;
    rrect(s,at(Rw.path,{x:Rw.path.x,y,w:2.48,h:0.38},{kind:'chip'}),C.NAVY2,0.08);
    tx(s,Rw.path,{x:Rw.path.x+0.14,y,w:2.20,h:0.38},a,T.body,{size:11,color:C.INK_ON,valign:'middle'});
    icon(s,Rw.path,Rw.path.x+2.58,y+0.07,0.24,'arrow',true);
    rrect(s,at(Rw.path,{x:Rw.path.x+2.92,y,w:2.92,h:0.38},{kind:'chip'}),C.NAVY2,0.08);
    tx(s,Rw.path,{x:Rw.path.x+3.06,y,w:2.64,h:0.38},b,T.body,{size:11,color:C.INK_ON,valign:'middle'});
    icon(s,Rw.path,Rw.path.x+5.94,y+0.07,0.24,'arrow',true);
    rrect(s,at(Rw.path,{x:Rw.path.x+6.28,y,w:1.06,h:0.38},{kind:'chip'}),C.YEL,0.08);
    tx(s,Rw.path,{x:Rw.path.x+6.36,y,w:0.90,h:0.38},'계약',T.body,
      {size:11,bold:true,color:C.NAVY,align:'center',valign:'middle'});
    tx(s,Rw.path,{x:Rw.path.x+7.50,y,w:Rw.path.w-7.50,h:0.38},tail,T.note,
      {size:9,color:C.MUTED,valign:'middle'});
  });

  rrect(s,at(L,{x:Rw.tbl.x,y:Rw.tbl.y-0.10,w:Rw.tbl.w,h:Rw.tbl.h+0.10},{kind:'card'}),C.NAVY2,0.08);
  const tb=region('tb',Rw.tbl.x+0.18,Rw.tbl.y+0.02,Rw.tbl.w-0.36,Rw.tbl.h-0.04);
  table(s,tb,[{h:'구분',w:1.74},{h:'거래 목적',w:3.06},{h:'창업자가 받는 정보',w:tb.w-4.80}],[
    ['양도자','높은 권리금 수취 · 빠른 거래 종결','영업이익이 과장된 정보'],
    ['중개사','중개 수수료 수취','인수 후 매출 · 손익과 무관한 정보'],
    ['컨설팅 업체','높은 수수료 수취','검증되지 않은 매물 브리핑'],
  ],{dark:true, rh:(tb.h-0.38)/3});

  kpi(s,R,{x:R.x,y:R.y+0.40,w:R.w,h:1.10},'3','주체','이해관계자',
    {size:56,dark:true,color:C.YEL,unitColor:C.MUTED});
  ['양도자','중개사','컨설팅 업체'].forEach((v,i)=>{
    const y=R.y+1.62+i*0.44;
    rrect(s,at(R,{x:R.x,y,w:R.w,h:0.36},{kind:'chip'}),C.NAVY2,0.08);
    tx(s,R,{x:R.x+0.16,y,w:R.w-0.32,h:0.36},v,T.body,{size:11,color:C.INK_ON,valign:'middle'});
  });
  tx(s,R,{x:R.x,y:R.y+3.02,w:R.w,h:0.40},'셋 다 창업자 편이 아닙니다.',T.cardtx,
    {size:10,color:C.MUTED});

  bandSentence(s,'내일사장은 [계약 이전 구간]에서 그 판단 근거를 만듭니다.');
  s.addNotes('창업자가 결정을 못 하는 이유는 의지가 없어서가 아니라 믿을 근거가 없어서입니다.');
}

/* ══════════════ 03 01 Problem — 좌우분할 · 우측 다크 ══════════════ */
{
  const s=p.addSlide(); bg(s,C.WHITE);
  splitPanel(s,'right',CUT6,C.NAVY);
  skyline(s,CUT6,G.H-1.05,G.W-CUT6,1.05);
  frame(s,3,'01',false,false,true);
  head(s,'러너펍이 이미 갖춘 것과 [아직 비어 있는 것]',false,true,{x:SAFE.x,w:5.60});
  lead(s,'남은 변수는 계약 가능한 창업자 모수 하나입니다.',false,{x:SAFE.x,w:5.60});

  const B=BODY('full');
  const L=region('gL',B.x,B.y,5.60,B.h);
  const RX=CUT6+0.42, R=region('gR',RX,B.y,RIGHT-RX,B.h);

  tx(s,L,{x:L.x,y:L.y,w:L.w,h:0.28},'이미 갖춘 것',T.sub,{color:C.NAVY,valign:'middle'});
  hr(s,L.x,L.y+0.36,L.w,C.NAVY,0.016);
  ['러너러너 앱 — 예약 · 회원관리 · 정산 · 토너먼트',
   '본사가 검증한 점포를 추천하는 체계',
   '불법 요소를 배제하는 준법 운영 기준',
   '가맹 절차 9단계 · 계약에서 오픈까지 4~6주',
   '래빗 페스티벌 · 시즌 랭킹전 · 매장 간 콜라보',
   '앱 리뉴얼 후 플랫폼 이용자 1.5배 증가'].forEach((v,i)=>{
    const y=L.y+0.54+i*0.49;
    check(s,L,L.x,y+0.04,0.20);
    tx(s,L,{x:L.x+0.32,y,w:L.w-0.34,h:0.30},v,T.body,{valign:'middle'});
  });

  pill(s,R,R.x,R.y,'미확보',C.RED);
  tx(s,R,{x:R.x,y:R.y+0.44,w:R.w,h:0.34},'계약 가능한 창업자 모수',T.sub,
    {size:19,color:C.INK_ON,valign:'middle'});
  kpi(s,R,{x:R.x,y:R.y+1.04,w:R.w,h:1.04},'1.5','배','앱 리뉴얼 후 플랫폼 이용자',
    {size:52,dark:true,color:C.YEL,unitColor:C.MUTED});
  const pf=P('p11_pub_w.png'), pAv=R.h-2.16, pw=Math.min(R.w,pAv*1.778), ph=pw/1.778;
  s.addImage({path:pf, ...img(R,{x:R.x+(R.w-pw)/2,y:R.y+2.16+(pAv-ph)/2,w:pw,h:ph},pf)});
  note(s,'※ IT비즈뉴스 2024.7.4 보도 기준',true,{x:RX,w:R.w});

  bandFig(s,'계약 이전 구간에서 내일사장이 이미 확보한 상담 DB','5,114','명',{figDark:true});
  s.addNotes('러너펍은 개설 이후 구조가 완비돼 있습니다. 남은 건 창업자 접점입니다.');
}

/* ══════════════ 04 02 Solution — 순색 네이비 (챕터 표지) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.NAVY);
  skyline(s,0,G.H-1.30,G.W,1.30);
  frame(s,4,'02',true);
  anchor(s,'Solution',true);
  head(s,'이미 확보된 [창업 수요와 제휴 네트워크]',true);
  lead(s,'모수를 새로 만드실 필요가 없습니다. 아래는 이번 제안 이전에 확보돼 있는 값입니다.',true,11);

  const B=BODY();
  const Rw=G.rows(B,[['k',1.14,'fix'],['g1',0.14,'fix'],['ch',1.14,'fix'],['g2',0.12,'fix'],['lg',0.58,'fix']]);

  const KP=[['100,000','건','앱 누적 다운로드','app'],
            ['50,000','명','월간 활성 이용자','users'],
            ['1,600','억원','누적 매물 거래 규모','chart'],
            ['5,114','명','예비창업자 상담 DB','funnel']];
  const kc=split(Rw.k,4,0.28);
  KP.forEach(([v,u,l,ic],i)=>{
    const c=kc[i];
    icon(s,Rw.k,c.x,c.y,0.26,ic,true);
    s.addText([{text:v,options:{fontSize:35,bold:true,color:C.INK_ON,charSpacing:-1.2}},
               {text:' '+u,options:{fontSize:13,bold:true,color:C.BLUEL}}],
      t({...at(Rw.k,{x:c.x,y:c.y+0.32,w:c.w,h:0.54},{kind:'fig',pt:35}),valign:'middle'}));
    if(i===3) rect(s,at(Rw.k,{x:c.x,y:c.y+0.86,w:1.52,h:0.055},{kind:'hl'}),C.YEL);
    tx(s,Rw.k,{x:c.x,y:c.y+0.92,w:c.w,h:0.22},l,T.note,{size:9.5,color:C.MUTED,valign:'middle'});
  });

  const cc=split(Rw.ch,2,0.44);
  {
    const c=cc[0];
    tx(s,c,{x:c.x,y:c.y,w:c.w,h:0.24},'앱 누적 다운로드 추이',T.label,{color:C.MUTED,valign:'middle'});
    [['2023',3],['2024',8],['2026',10]].forEach(([yy,v],i)=>{
      const y=c.y+0.34+i*0.28;
      tx(s,c,{x:c.x,y,w:0.62,h:0.24},yy,T.note,{color:C.MUTED,valign:'middle'});
      bar(s,c,c.x+0.68,y+0.05,c.w-1.44,0.14,v/10,C.BLUEL,C.RULED);
      tx(s,c,{x:c.x+c.w-0.70,y,w:0.70,h:0.24},`${v}만`,T.glabel,
        {size:10,color:C.INK_ON,align:'right',valign:'middle'});
    });
  }
  {
    const c=cc[1];
    tx(s,c,{x:c.x,y:c.y,w:c.w,h:0.24},'인증 서비스 효과',T.label,{color:C.MUTED,valign:'middle'});
    [['자영업자 1년 생존률','67 %','99 %','+32%p'],
     ['양도양수 성공 비율','47 %','80 %','+33%p']].forEach(([k,a,b,d],i)=>{
      const y=c.y+0.32+i*0.46;
      tx(s,c,{x:c.x,y,w:2.10,h:0.22},k,T.note,{size:9,color:C.MUTED,valign:'middle'});
      s.addText([{text:a,options:{fontSize:11,color:C.MUTED}},
                 {text:'  →  ',options:{fontSize:10,color:C.MUTED}},
                 {text:b,options:{fontSize:26,bold:true,color:C.BLUEL}}],
        t({...at(c,{x:c.x+2.16,y:y-0.10,w:c.w-2.90,h:0.44},{kind:'fig',pt:26}),valign:'middle'}));
      tri(s,c,c.x+c.w-0.66,y+0.02,0.16,0.19,C.RED);
      tx(s,c,{x:c.x+c.w-0.46,y,w:0.46,h:0.22},d,T.glabel,
        {size:9,color:C.RED,align:'right',valign:'middle'});
    });
  }

  rrect(s,at(Rw.lg,{x:Rw.lg.x,y:Rw.lg.y,w:Rw.lg.w,h:Rw.lg.h},{kind:'card'}),C.NAVY2,0.06);
  const KEYS=['spc','samsung','kfa','barogo','saramin','forbes'];
  const LG=KEYS.map(k=>{const f=P(`lg_${k}_w.png`),a=G.imgAspect(f);
    let w=Math.min(0.30*a,1.66); return {f,w,h:w/a};});
  const gapW=(Rw.lg.w-0.70-LG.reduce((t,l)=>t+l.w,0))/(LG.length-1);
  let lx=Rw.lg.x+0.35, mid=Rw.lg.y+Rw.lg.h/2;
  LG.forEach(l=>{ s.addImage({path:l.f, ...img(Rw.lg,{x:lx,y:mid-l.h/2,w:l.w,h:l.h},l.f)}); lx+=l.w+gapW; });

  bandFig(s,'모수 확보를 위해 본사가 쓰실 시간과 비용','0','원',{dark:true});
  note(s,'※ 플랫폼 지표는 내일사장 누적 기준(2026.07)이며, 생존률·성공비율은 내일사장 인증 서비스 이용 건 기준 자체 집계값입니다.',true);
  s.addNotes('앱 10만, 월 5만 명, 상담 DB 5,114명. 러너펍에 맞는 사람을 이 안에서 찾습니다.');
}

/* ══════════════ 05 02 Solution — 좌우분할 · 좌측 다크 (팀) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.WHITE);
  splitPanel(s,'left',CUT5,C.NAVY);
  frame(s,5,'02',false,true,false,true);
  const HB={x:CUT5+0.42,w:RIGHT-(CUT5+0.42)};
  anchor(s,'Team & History',false,HB);
  head(s,'가맹 개설을 [해 본 4인]이 맡습니다',false,false,HB);
  lead(s,'가맹 개설은 본사에서 해 본 사람들이 맡습니다.',false,HB);

  const B=BODY('full');
  const L=region('tmL',SAFE.x,B.y,CUT5-SAFE.x-0.42,B.h);
  const R=region('tmR',HB.x,B.y,HB.w,B.h);

  const YRS=[['2022','MVP 테스트','앱 MVP · 매장등록 200건 · 인증매물 1,000건'],
             ['2023','법인 설립','벤처기업 인증 · 기업부설연구소 · 특허출원 3건'],
             ['2024','BM 다각화','초기창업패키지 · R&D 디딤돌 · KFA 공동사업단'],
             ['2025','투자 유치','구글 창구 선정 · Seed 투자유치 (씨엔티테크)']];
  rail(s,L,L.x+0.09,L.y+0.08,2.32,YRS.map((_,i)=>L.y+0.20+i*0.58));
  YRS.forEach(([y,k,v],i)=>{
    const yy=L.y+0.06+i*0.58;
    tx(s,L,{x:L.x+0.34,y:yy,w:0.80,h:0.28},y,T.sub,{size:15,color:C.BLUEL,valign:'middle'});
    tx(s,L,{x:L.x+1.20,y:yy,w:L.w-1.20,h:0.28},k,T.sub,{size:12.5,color:C.INK_ON,valign:'middle'});
    tx(s,L,{x:L.x+0.34,y:yy+0.28,w:L.w-0.34,h:0.26},v,T.cardtx,{size:9.5,color:C.MUTED});
  });
  kpi(s,L,{x:L.x,y:L.y+2.66,w:L.w,h:0.78},'4','인','프랜차이즈 본사 출신 · 팀 7인 중',
    {size:42,dark:true,color:C.YEL,unitColor:C.MUTED});

  const T4=[['박규태','대표이사','SPC 파리바게뜨 가맹사업본부','이삭토스트 COO'],
            ['김우곤','COO','맥도날드 · 써브웨이 · CJ푸드빌','SPC 외 15년'],
            ['엄태관','운영 팀장','아딸 가맹사업본부','셀렉토커피 영업팀장'],
            ['김호병','팀장','공인중개사','브랜드 개설 및 영업']];
  const cw=(R.w-0.26)/2;
  T4.forEach(([nm,pos,c1,c2],i)=>{
    const x=R.x+(cw+0.26)*(i%2), y=R.y+Math.floor(i/2)*1.44;
    const inner=card(s,R,{x,y,w:cw,h:1.32,name:`t${i}`},C.BLUEBG0);
    tx(s,inner,{x:inner.x,y:inner.y,w:1.20,h:0.28},nm,T.sub,{size:14,valign:'middle'});
    tx(s,inner,{x:inner.x+1.24,y:inner.y+0.02,w:inner.w-1.24,h:0.24},pos,T.label,
      {color:C.BLUE,valign:'middle'});
    rect(s,at(inner,{x:inner.x,y:inner.y+0.34,w:Math.min(inner.w,1.30),h:0.05},{kind:'hl'}),C.YEL);
    tx(s,inner,{x:inner.x,y:inner.y+0.44,w:inner.w,h:0.24},c1,T.cardtx,{size:9.8,color:C.NAVY});
    tx(s,inner,{x:inner.x,y:inner.y+0.66,w:inner.w,h:0.24},c2,T.cardtx,{size:9.8,color:C.MUTE});
  });
  hr(s,R.x,R.y+2.90,R.w,C.RULE);
  tx(s,R,{x:R.x,y:R.y+3.02,w:R.w,h:0.44},
    '그 외  천영식 CMO (죠스떡볶이 · 바르다김선생 마케팅팀장)   ·   장수형 CTO (유니위즈 운영)   ·   김재현 기획팀장 (외식경영학 박사)',
    T.cardtx,{size:9.8,color:C.MUTE});

  bandChips(s,'프랜차이즈 본사 출신',
    ['SPC 파리바게뜨','이삭토스트','맥도날드 · 써브웨이','아딸']);
  s.addNotes('본사에서 가장 먼저 물으실 질문입니다. 대표는 파리바게뜨 가맹사업본부 출신입니다.');
}

/* ══════════════ 06 02 Solution — 라이트 + 틴트 (수행 이력) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.WHITE);
  frame(s,6,'02');
  head(s,'플랫폼 지표가 아니라 [가맹을 판 실적]입니다',false,true);
  lead(s,'아래 브랜드의 가맹영업 · 창업마케팅 · 점포개발을 수행해 왔습니다.',false,11);

  const B=BODY('full');
  const L=region('hL',B.x,B.y,span(0,4).w,B.h);
  const R=region('hR',span(4,8).x,B.y,span(4,8).w,B.h);

  rect(s,at(L,{x:L.x,y:L.y,w:L.w,h:0.34},{kind:'hl'}),C.BLUEBG);
  tx(s,L,{x:L.x+0.12,y:L.y,w:L.w-0.24,h:0.34},'가맹을 팔아 온 회사입니다',T.sub,
    {size:13,color:C.BLUE,valign:'middle'});
  [['deal','가맹영업대행','모객 · 상담 · 등급 분류 · 계약 절차 관리'],
   ['mega','창업 마케팅','블로그 · 검색광고 · SNS · 창업박람회'],
   ['store','점포개발 · 물건화','후보 발굴 · 실측 · 견적까지 끝낸 브리핑']].forEach(([ic,k,v],i)=>{
    iconRow(s,L,L.x,L.y+0.62+i*0.72,L.w,ic,k,v,false,0.30);
  });
  kpi(s,L,{x:L.x,y:L.y+2.86,w:L.w,h:0.62},'3','개 업무','한 회사가 동시에 수행',{size:34});

  rrect(s,at(R,{x:R.x,y:R.y,w:R.w,h:2.36},{kind:'card'}),C.BLUEBG0,0.08);
  tx(s,R,{x:R.x+0.20,y:R.y+0.14,w:3.4,h:0.26},'수행 브랜드',T.label,{color:C.MUTE,valign:'middle'});
  tx(s,R,{x:R.x+R.w-2.0,y:R.y+0.14,w:1.80,h:0.26},'외 14개',T.note,
    {color:C.MUTE,align:'right',valign:'middle'});
  const BR=['33떡볶이','백소정','원앤원','투썸플레이스','명륜진사갈비','요아정',
            '차알','밀본','오레노카츠','랑데자뷰','삼청당','카르마커피',
            '청년피자','메가커피','크린토피아','셀렉토커피'];
  const gr=region('br',R.x+0.20,R.y+0.50,R.w-0.40,1.72);
  const bw=(gr.w-0.14*3)/4, bh=(gr.h-0.12*3)/4;
  BR.forEach((b,i)=>{
    const x=gr.x+(bw+0.14)*(i%4), y=gr.y+(bh+0.12)*Math.floor(i/4);
    rrect(s,at(gr,{x,y,w:bw,h:bh},{kind:'card'}),C.WHITE,0.05);
    tx(s,gr,{x:x+0.08,y,w:bw-0.16,h:bh},b,T.body,{size:10.5,align:'center',valign:'middle'});
  });
  const cb={x:R.x,y:R.y+2.52,w:R.w,h:0.92,name:'case'};
  const ci=card(s,R,cb,C.BLUEBG);
  rect(s,at(R,{x:cb.x,y:cb.y,w:0.08,h:cb.h},{kind:'hl'}),C.YEL);
  tx(s,ci,{x:ci.x,y:ci.y,w:1.5,h:0.24},'대표 사례',T.label,{color:C.BLUE,valign:'middle'});
  tx(s,ci,{x:ci.x,y:ci.y+0.24,w:ci.w,h:0.28},'33떡볶이 강동역점 — 임대차 · 가맹 예약 완료',T.sub,
    {size:13,valign:'middle'});

  bandFig(s,'내일사장이 가맹영업 · 마케팅 · 점포개발을 수행한 브랜드','30','여 개');
  s.addNotes('가맹을 팔아 온 회사라는 말의 물증입니다.');
}

/* ══════════════ 07 02 Solution — 라이트 + 틴트 (도구) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.WHITE);
  frame(s,7,'02',false,true);
  head(s,'결정을 미루는 자리마다 [근거 문서]를 내놓습니다',false,true);
  lead(s,'아래는 이미 운영 중인 화면이며, 러너펍 창업자에게 그대로 나갑니다.',false,11);

  const B=BODY('full');
  const Rw=G.rows(B,[['cards',2.34,'fix'],['g',0.14,'fix'],['k',1]]);
  const STEP=[[1,'실매출 검증','p07_step1.png','홈택스 신고자료를 연동해 매장 실매출을 확인합니다'],
              [2,'인증 리포트','p07_step2.png','검증 결과를 리포트로 만들어 창업자에게 제시합니다'],
              [3,'입지 · 상권','p07_area.png','상권과 입지 조건을 담아 출점 검토 자료로 냅니다']];
  const cs=split(Rw.cards,3,0.30);
  STEP.forEach(([n,ttl,file,desc],i)=>{
    const c=cs[i];
    rrect(s,at(c,{x:c.x,y:c.y,w:c.w,h:c.h},{kind:'card'}),C.BLUEBG0,0.08);
    const d=stepBadge(s,c,c.x+0.16,c.y+0.16,0.30,n);
    tx(s,c,{x:c.x+0.16+d+0.14,y:c.y+0.16,w:c.w-0.30-d-0.14,h:0.30},ttl,T.sub,
      {size:13,valign:'middle'});
    const f=P(file), a=G.imgAspect(f);
    const iw=Math.min(c.w-0.44,1.54*a), ih=iw/a;
    s.addImage({path:f, ...img(c,{x:c.x+(c.w-iw)/2,y:c.y+0.54+(1.54-ih)/2,w:iw,h:ih},f)});
    rect(s,at(c,{x:c.x,y:c.y+c.h-0.44,w:c.w,h:0.44},{kind:'cap'}),C.NAVY);
    tx(s,c,{x:c.x+0.16,y:c.y+c.h-0.44,w:c.w-0.32,h:0.44},desc,T.cardtx,
      {size:9.5,color:C.INK_ON,valign:'middle'});
    if(i<2) icon(s,Rw.cards,c.x+c.w+0.03,c.y+1.14,0.24,'arrow',false);
  });

  kpi(s,Rw.k,{x:Rw.k.x,y:Rw.k.y+0.30,w:2.6,h:0.60},'6','종','자체 운영 중인 브리핑 도구',{size:32});
  const TOOLS=['홈택스 연동','상권분석 보고서','거리제한 지도','정보공개서 D-day','전자계약','SV 점검보고서'];
  let tx0=Rw.k.x+3.10, ty=Rw.k.y+0.24;
  TOOLS.forEach((v,i)=>{
    if(i===3){ tx0=Rw.k.x+3.10; ty=Rw.k.y+0.62; }
    const w=Math.min(2.6,G.textWidth(v,9)+0.34);
    rrect(s,at(Rw.k,{x:tx0,y:ty,w,h:0.32},{kind:'chip'}),C.BLUEBG,0.14);
    tx(s,Rw.k,{x:tx0+0.17,y:ty,w:w-0.34,h:0.32},v,T.label,{color:C.BLUE,valign:'middle'});
    tx0+=w+0.18;
  });

  bandChips(s,'창업자가 결정을 미루는 자리',
    ['① 매출을 못 믿을 때','② 입지를 못 볼 때','③ 계약이 불안할 때']);
  s.addNotes('창업자가 결정을 미루는 이유는 근거가 없어서입니다. 저희는 근거를 문서로 만듭니다.');
}

/* ══════════════ 08 02 Solution — 좌우분할 · 좌측 다크 (위임 범위) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.WHITE);
  splitPanel(s,'left',CUT5,C.NAVY);
  frame(s,8,'02',false,true,false,true);
  const HB={x:CUT5+0.42,w:RIGHT-(CUT5+0.42)};
  head(s,'본사는 [승인만] 하시면 됩니다',false,true,HB);
  lead(s,'발굴 · 상담 · 설득 · 클로징 전 과정을 내일사장이 맡습니다.',false,HB);

  const B=BODY('full');
  const L=region('wL',SAFE.x,B.y,CUT5-SAFE.x-0.42,B.h);
  const R=region('wR',HB.x,B.y,HB.w,B.h);

  [['내일사장이 맡는 일','발굴 · 상담 · 설득 · 클로징 전 과정',C.BLUEL],
   ['본사가 하실 일','브랜드 자료 승인 · 가맹계약 체결 · 개설 승인',C.INK_ON]].forEach(([k,v,col],i)=>{
    const y=L.y+i*1.14;
    rrect(s,at(L,{x:L.x,y,w:L.w,h:1.02},{kind:'card'}),C.NAVY2,0.08);
    tx(s,L,{x:L.x+0.20,y:y+0.16,w:L.w-0.40,h:0.28},k,T.sub,{size:13,color:col,valign:'middle'});
    tx(s,L,{x:L.x+0.20,y:y+0.48,w:L.w-0.40,h:0.44},v,T.body,{size:11,color:C.MUTED});
  });
  kpi(s,L,{x:L.x,y:L.y+2.66,w:L.w,h:0.80},'0','명','위임 시 본사가 추가로 채용할 영업 인력',
    {size:44,dark:true,color:C.YEL,unitColor:C.MUTED});

  const tbx=R.x+0.34, tb=region('wt',tbx,R.y,R.w-0.34,2.62);
  const ROWS=[['영업 조직 운영','가맹영업팀 운영 · 두 트랙 동시 영업',true],
              ['창업 마케팅','예비창업자 리드 확보 · 창업마케팅 집행',true],
              ['창업 상담 · 브리핑','상권 · 손익 자료로 결정 마무리',true],
              ['점포개발 · 물건화','실측 · 견적까지 끝낸 브리핑 상태',true],
              ['계약 주선','조건 협의와 클로징 지원',true],
              ['본사 유입 건','성공보수 대상이 아닙니다',false]];
  table(s,tb,[{h:'업무',w:1.90},{h:'수행 내용',w:tb.w-1.90}],
    ROWS.map(([k,v])=>[{v:k,b:true},v]),{rh:(tb.h-0.38)/6});
  ROWS.forEach(([,,ok],i)=>{
    const y=R.y+0.38+((tb.h-0.38)/6)*i+((tb.h-0.38)/6-0.20)/2;
    if(ok) check(s,R,R.x,y,0.20);
    else   icon(s,R,R.x,y-0.02,0.24,'docx',false);
  });

  const trk=region('trk',R.x,R.y+2.80,R.w,0.68);
  const ts=split(trk,2,0.30);
  [['TRACK A','신규 창업자','플랫폼에 상주하는 창업 수요 · 상담 DB 5,114명'],
   ['TRACK B','기존 홀덤펍 리브랜딩','이미 운영 중인 점주 대상 · 검토 기간이 짧습니다']].forEach(([a,b,c],i)=>{
    const cc=ts[i];
    tx(s,cc,{x:cc.x,y:cc.y+0.02,w:1.00,h:0.24},a,T.label,{color:C.BLUE,valign:'middle'});
    tx(s,cc,{x:cc.x+1.06,y:cc.y,w:cc.w-1.06,h:0.28},b,T.sub,{size:12,valign:'middle'});
    tx(s,cc,{x:cc.x,y:cc.y+0.32,w:cc.w,h:0.34},c,T.cardtx,{size:9.8,color:C.MUTE});
  });

  bandSentence(s,'위임하지 않으시면 [채용 고정비와 미계약 건 원가]가 본사에 남습니다.');
  s.addNotes('본사는 승인만 하시면 됩니다. 앞단은 전부 저희가 맡습니다.');
}

/* ══════════════ 09 02 Solution — 라이트 (선택지 비교) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.WHITE);
  frame(s,9,'02',false,true);
  head(s,'대안과 나란히 놓아야 [위임이 계산]됩니다',false,true);
  lead(s,'직영 채용 · 일반 대행 · 내일사장 세 가지를 같은 기준으로 놓았습니다.',false,11);

  const B=BODY('full');
  const Rw=G.rows(B,[['k',1.00,'fix'],['g',0.12,'fix'],['tb',1]]);

  tx(s,Rw.k,{x:Rw.k.x,y:Rw.k.y+0.06,w:6.4,h:0.32},'내일사장에 위임하실 경우',T.sub,
    {size:14,valign:'middle'});
  tx(s,Rw.k,{x:Rw.k.x,y:Rw.k.y+0.44,w:6.4,h:0.44},
    '계약이 성사되지 않으면 상담 · 분석 · 브리핑 · 마케팅 원가는 전부 내일사장이 부담합니다.',
    T.body,{size:11,color:C.MUTE});
  kpi(s,Rw.k,{x:Rw.k.x+7.30,y:Rw.k.y+0.32,w:4.5,h:0.62},'0','원','착수 시점에 본사가 지출하는 현금',
    {size:36,hi:true,hiW:1.86});

  const cw=(Rw.tb.w-2.86)/3;
  rrect(s,at(B,{x:Rw.tb.x,y:Rw.tb.y-0.08,w:Rw.tb.w,h:Rw.tb.h+0.08},{kind:'card'}),C.PAPER,0.08);
  { const rh=(Rw.tb.h-0.38)/6;
    for(let i=0;i<6;i+=2) rect(s,at(B,{x:Rw.tb.x,y:Rw.tb.y+0.38+rh*i,w:Rw.tb.w,h:rh},{kind:'row'}),C.WHITE); }
  rrect(s,at(Rw.tb,{x:Rw.tb.x+2.86+cw*2,y:Rw.tb.y,w:cw,h:Rw.tb.h},{kind:'hl'}),C.BLUEBG,0.08);
  rect(s,at(Rw.tb,{x:Rw.tb.x+2.86+cw*2,y:Rw.tb.y,w:cw,h:0.055},{kind:'hl'}),C.YEL);
  table(s,Rw.tb,[{h:'',w:2.86},{h:'직영 채용',w:cw,a:'center'},{h:'일반 대행',w:cw,a:'center'},
                 {h:'내일사장',w:cw,a:'center'}],[
    ['착수 시점 비용',{v:'급여 · 4대보험',c:C.MUTE},{v:'착수금 발생',c:C.MUTE},{v:'0원',b:true,c:C.BLUE}],
    ['미계약 건 원가',{v:'본사 부담',c:C.MUTE},{v:'본사 부담',c:C.MUTE},{v:'내일사장 부담',b:true,c:C.BLUE}],
    ['창업자 모수',{v:'직접 모객',c:C.MUTE},{v:'대행사 규모에 따름',c:C.MUTE},{v:'앱 10만 · DB 5,114명',b:true,c:C.BLUE}],
    ['브리핑 자료',{v:'직접 제작',c:C.MUTE},{v:'브랜드 자료 전달',c:C.MUTE},{v:'상권 · 손익 직접 산출',b:true,c:C.BLUE}],
    ['준법 관리',{v:'담당자 역량',c:C.MUTE},{v:'대행사 재량',c:C.MUTE},{v:'시스템 강제',b:true,c:C.BLUE}],
    ['본사 인력 증원',{v:'필요',c:C.MUTE},{v:'관리 인력 필요',c:C.MUTE},{v:'0명',b:true,c:C.BLUE}],
  ],{rh:(Rw.tb.h-0.38)/6});

  bandChips(s,'위임하지 않으실 경우 본사 부담',
    ['① 채용 고정비','② 미계약 건 원가','③ 개설 지연']);
  s.addNotes('대안 셋을 나란히 놓으면 계산이 됩니다.');
}

/* ══════════════ 10 03 Terms — 순색 네이비 (챕터 표지) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.NAVY);
  skyline(s,0,G.H-1.20,G.W,1.20);
  frame(s,10,'03',true);
  anchor(s,'Terms',true);
  head(s,'착수금도 월 고정비도 광고비도 [청구하지 않습니다]',true);
  lead(s,'청구는 가맹계약이 체결되고 가맹비 입금이 확인된 뒤에만 발생합니다.',true,11);

  const B=BODY();
  const L=region('tL',B.x,B.y,span(0,4).w,B.h);
  const R=region('tR',span(4,8).x,B.y,span(4,8).w,B.h);

  rrect(s,at(L,{x:L.x,y:L.y,w:L.w,h:2.72},{kind:'card'}),C.NAVY2,0.10);
  tx(s,L,{x:L.x+0.22,y:L.y+0.18,w:L.w-0.44,h:0.28},'계약 전까지 본사 지출',T.label,
    {color:C.MUTED,valign:'middle'});
  rect(s,at(L,{x:L.x+0.22,y:L.y+0.62,w:2.62,h:0.92},{kind:'hl'}),C.YEL);
  s.addText([{text:'0',options:{fontSize:64,bold:true,color:C.NAVY,charSpacing:-2}},
             {text:' 원',options:{fontSize:22,bold:true,color:C.NAVY}}],
    t({...at(L,{x:L.x+0.40,y:L.y+0.48,w:2.6,h:1.20},{kind:'fig',pt:64}),valign:'middle'}));
  tx(s,L,{x:L.x+0.22,y:L.y+1.80,w:L.w-0.44,h:0.80},
    '상담 · 분석 · 브리핑과 창업마케팅에 들어간 비용은 계약이 성사되지 않아도 전부 내일사장이 부담합니다.',
    T.body,{size:11,color:C.MUTED});
  icon(s,L,L.x+0.22,L.y+2.78,0.28,'won',true);
  tx(s,L,{x:L.x+0.60,y:L.y+2.79,w:L.w-0.82,h:0.26},'성공보수는 부가가치세 별도입니다.',T.note,
    {color:C.MUTED,valign:'middle'});

  rrect(s,at(R,{x:R.x+0.18,y:R.y,w:R.w-0.18,h:B.h},{kind:'card'}),C.NAVY2,0.08);
  const tb=region('tt',R.x+0.34,R.y+0.06,R.w-0.34,B.h-0.12);
  table(s,tb,[{h:'항목',w:2.00},{h:'발생 시점',w:tb.w-4.30},{h:'금액',w:2.30,a:'right'}],[
    ['착수금','해당 없음',{v:'0 원',b:true}],
    ['월 고정비','해당 없음',{v:'0 원',b:true}],
    ['광고비','가맹 개설 영업 대가로는 청구하지 않습니다',{v:'0 원',b:true}],
    [{v:'성공보수',b:true},'가맹계약 체결 및 가맹비 입금 완료 후',{v:'1,000 만원',b:true,c:C.BLUEL}],
    ['해제 · 환불 시','본사 정책에 맞춰 착수 전 협의',{v:'협의',c:C.MUTED}],
  ],{dark:true, rh:(tb.h-0.38)/5});
  [0,1,2].forEach(i=>{
    const rh=(tb.h-0.38)/5;
    icon(s,R,R.x,R.y+0.50+rh*i+(rh-0.22)/2,0.22,'docx',true);
  });

  bandFig(s,'계약 · 입금 완료 전 내일사장에 지급하는 현금','0','원',{dark:true});
  s.addNotes('계약이 되기 전까지 본사가 쓰는 돈은 0원입니다.');
}

/* ══════════════ 11 03 Terms — 라이트 + 틴트 (네고 · LSM) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.WHITE);
  frame(s,11,'03',false,true);
  head(s,'네고가 발생해도 [본사 순수취 500만원 불변]',false,true);
  lead(s,'창업자가 깎은 금액은 전액 내일사장 성공보수에서 차감합니다.',false,11);

  const B=BODY('full');
  const Rw=G.rows(B,[['calc',1.34,'fix'],['g1',0.14,'fix'],['hi',0.40,'fix'],
                     ['g2',0.14,'fix'],['lsm',1]]);

  const st=split(Rw.calc,3,0.46);
  [['가맹비','+1,500','만원','본사 수취',C.NAVY,C.PAPER,false],
   ['성공보수','−1,000','만원','내일사장',C.NAVY,C.PAPER,false],
   ['본사 순수취','500','만원','네고와 무관하게 불변',C.WHITE,C.BLUE,true]]
   .forEach(([k,v,u,sub,col,bgc,inv],i)=>{
    const c=st[i];
    rrect(s,at(Rw.calc,{x:c.x,y:c.y,w:c.w,h:c.h},{kind:'card'}),bgc,0.10);
    tx(s,Rw.calc,{x:c.x+0.22,y:c.y+0.16,w:c.w-0.44,h:0.26},k,T.label,
      {color:inv?C.WHITE:C.MUTE,valign:'middle'});
    s.addText([{text:v,options:{fontSize:inv?40:32,bold:true,color:col,charSpacing:-1.2}},
               {text:' '+u,options:{fontSize:14,bold:true,color:inv?C.WHITE:C.NAVY}}],
      t({...at(Rw.calc,{x:c.x+0.22,y:c.y+0.46,w:c.w-0.44,h:0.58},{kind:'fig',pt:inv?40:32}),valign:'middle'}));
    tx(s,Rw.calc,{x:c.x+0.22,y:c.y+1.06,w:c.w-0.44,h:0.24},sub,T.cardtx,
      {size:10,color:inv?C.WHITE:C.MUTE,valign:'middle'});
    if(i<2) tx(s,Rw.calc,{x:c.x+c.w+0.06,y:c.y+0.46,w:0.34,h:0.42},i?'=':'−',T.body,
      {size:20,ls:28,bold:true,color:C.MUTE,align:'center',valign:'middle'});
  });

  rect(s,at(Rw.hi,{x:Rw.hi.x,y:Rw.hi.y+0.02,w:Rw.hi.w,h:0.36},{kind:'hl'}),C.YEL);
  check(s,Rw.hi,Rw.hi.x+0.14,Rw.hi.y+0.10,0.20);
  tx(s,Rw.hi,{x:Rw.hi.x+0.44,y:Rw.hi.y+0.02,w:Rw.hi.w-0.58,h:0.36},
    '할인 적용 여부와 한도는 건별로 본사 승인 후 확정하며, 내일사장이 단독으로 조건을 제시하지 않습니다.',
    T.body,{size:11,bold:true,color:C.NAVY,valign:'middle'});

  tx(s,Rw.lsm,{x:Rw.lsm.x,y:Rw.lsm.y,w:6.4,h:0.26},'LSM 광고 집행 기준 · 내일사장 수취 구간',
    T.label,{color:C.MUTE,valign:'middle'});
  const ls=split(region('lsmb',Rw.lsm.x,Rw.lsm.y+0.34,Rw.lsm.w,Rw.lsm.h-0.34),3,0.26);
  [['800만원 이하','본사 집행','본사 정책에 따라 집행',C.BLUEBG0,C.NAVY],
   ['800만원 초과 ~ 1,000만원 미만','협의','집행 주체와 금액은 양사 협의',C.BLUEBG2,C.NAVY],
   ['1,000만원 전액 수취','내일사장 집행','수취액 중 200만원을 매장 LSM 광고비로',C.BLUE,C.WHITE]]
   .forEach(([k,who,v,bgc,fg],i)=>{
    const c=ls[i];
    rrect(s,at(c,{x:c.x,y:c.y,w:c.w,h:c.h},{kind:'card'}),bgc,0.08);
    stepBadge(s,c,c.x+0.16,c.y+0.14,0.26,i+1,i===2);
    tx(s,c,{x:c.x+0.50,y:c.y+0.14,w:c.w-0.66,h:0.26},k,T.body,
      {size:10,bold:true,color:fg,valign:'middle'});
    tx(s,c,{x:c.x+0.16,y:c.y+0.46,w:c.w-0.32,h:0.28},who,T.sub,
      {size:13,color:fg,valign:'middle'});
    tx(s,c,{x:c.x+0.16,y:c.y+0.78,w:c.w-0.32,h:c.h-0.86},v,T.cardtx,
      {size:9.5,color:i===2?C.WHITE:C.MUTE});
  });

  bandChips(s,'가맹비 1,500만원 배분',
    ['① 본사 순수취 500','② 성공보수 1,000','③ 할인은 내일사장 몫에서']);
  s.addNotes('네고는 저희 몫에서 부담합니다. 본사 수취는 그대로입니다.');
}

/* ══════════════ 12 03 Terms — 좌우분할 · 우측 다크 (회수) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.WHITE);
  splitPanel(s,'right',CUT6,C.NAVY);
  frame(s,12,'03',false,false,true);
  const HB={x:SAFE.x,w:5.60};
  head(s,'계약 시점부터 흑자, 로열티는 [전액 순증]',false,true,HB);
  lead(s,'가맹비 안에서 정산되므로 별도 예산이 필요 없습니다.',false,HB);

  const B=BODY();
  const L=region('rL',SAFE.x,B.y,5.60,B.h);
  const RX=CUT6+0.42, R=region('rR',RX,B.y,RIGHT-RX,B.h);

  tx(s,L,{x:L.x,y:L.y,w:L.w,h:0.28},'계약 1건 · 계약 시점',T.label,{color:C.MUTE,valign:'middle'});
  hr(s,L.x,L.y+0.36,L.w,C.NAVY,0.016);
  [['가맹비 (본사 수취)','+1,500',C.NAVY],['성공보수 (내일사장)','−1,000',C.MUTE]].forEach(([k,v,col],i)=>{
    const y=L.y+0.52+i*0.50;
    tx(s,L,{x:L.x,y,w:2.7,h:0.34},k,T.body,{valign:'middle'});
    s.addText([{text:v,options:{fontSize:19,bold:true,color:col}},
               {text:' 만원',options:{fontSize:11,color:C.MUTE}}],
      t({...at(L,{x:L.x+2.7,y,w:L.w-2.7,h:0.34},{kind:'fig',pt:19}),align:'right',valign:'middle'}));
    hr(s,L.x,y+0.40,L.w,C.RULE);
  });
  const bi=card(s,L,{x:L.x,y:L.y+1.60,w:L.w,h:1.20,name:'net'},C.BLUEBG);
  tx(s,bi,{x:bi.x,y:bi.y,w:bi.w,h:0.24},'계약 시점 본사 순수익',T.label,{color:C.BLUE,valign:'middle'});
  s.addText([{text:'+500',options:{fontSize:34,bold:true,color:C.BLUE,charSpacing:-1.2}},
             {text:' 만원',options:{fontSize:14,bold:true,color:C.BLUE}}],
    t({...at(bi,{x:bi.x,y:bi.y+0.24,w:bi.w,h:0.54},{kind:'fig',pt:34}),valign:'middle'}));
  tx(s,L,{x:L.x,y:L.y+2.86,w:L.w,h:0.26},'이후 월 로열티 150만원은 전액 본사 수익으로 남습니다.',
    T.body,{size:11,color:C.MUTE});

  tx(s,R,{x:R.x,y:R.y,w:R.w,h:0.26},'1개점 누적 본사 수익',T.label,{color:C.MUTED,valign:'middle'});
  hr(s,R.x,R.y+0.34,R.w,C.INK_ON,0.016);
  [['12개월',2300],['24개월',4100],['36개월',5900]].forEach(([k,v],i)=>{
    const y=R.y+0.50+i*0.42;
    stepBadge(s,R,R.x,y+0.02,0.24,i+1,true);
    tx(s,R,{x:R.x+0.32,y,w:0.92,h:0.28},k,T.body,{size:11,color:C.INK_ON,valign:'middle'});
    bar(s,R,R.x+1.30,y+0.05,R.w-3.24,0.18,v/5900,i===2?C.BLUEL:'46587A',C.RULED);
    tri(s,R,R.x+R.w-1.86,y+0.04,0.13+i*0.03,0.16+i*0.03,C.BLUEL);
    tx(s,R,{x:R.x+R.w-1.66,y,w:1.66,h:0.28},v.toLocaleString()+' 만원',T.glabel,
      {color:i===2?C.BLUEL:C.INK_ON,align:'right',valign:'middle'});
  });
  hr(s,R.x,R.y+1.86,R.w,C.RULED);
  tx(s,R,{x:R.x,y:R.y+1.98,w:2.30,h:0.24},'출점 규모별 36개월 누적',T.label,{color:C.MUTED,valign:'middle'});
  tx(s,R,{x:R.x+R.w-2.60,y:R.y+1.98,w:2.60,h:0.24},'단위 : 만원',T.note,
    {size:8.5,color:C.MUTED,align:'right',valign:'middle'});
  chart2(s,R,{x:R.x,y:R.y+2.26,w:R.w,h:0.86},[
    {k:'3개점',v:[17700],l:['17,700']},
    {k:'5개점',v:[29500],l:['29,500']},
    {k:'10개점',v:[59000],l:['59,000']},
  ],{dark:true,bw:0.86,gap:0.10});

  bandFig(s,'10개점 출점 시 · 36개월 누적','5억 9,000','만원',{figDark:true});
  s.addNotes('계약 시점에 이미 흑자라는 뜻입니다.');
}

/* ══════════════ 13 04 Governance — 순색 네이비 (챕터 표지) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.NAVY);
  frame(s,13,'04',true,true);
  anchor(s,'Governance',true);
  head(s,'준법 영업을 [사람이 아니라 시스템]이 막습니다',true);
  lead(s,'가맹사업법 위반은 본사 리스크입니다. 사람이 달력을 세지 않게 만들어 두었습니다.',true,11);

  const B=BODY('full');
  const L=region('gvL',B.x,B.y,span(0,4).w,B.h);
  const R=region('gvR',span(4,8).x,B.y,span(4,8).w,B.h);

  rrect(s,at(L,{x:L.x,y:L.y,w:L.w,h:B.h},{kind:'card'}),C.NAVY2,0.10);
  tx(s,L,{x:L.x+0.22,y:L.y+0.18,w:L.w-0.44,h:0.26},'법정 숙려기간',T.label,{color:C.MUTED,valign:'middle'});
  rect(s,at(L,{x:L.x+0.22,y:L.y+0.56,w:2.52,h:0.90},{kind:'hl'}),C.YEL);
  s.addText([{text:'14',options:{fontSize:62,bold:true,color:C.NAVY,charSpacing:-2}},
             {text:' 일',options:{fontSize:22,bold:true,color:C.NAVY}}],
    t({...at(L,{x:L.x+0.40,y:L.y+0.42,w:2.5,h:1.18},{kind:'fig',pt:62}),valign:'middle'}));
  icon(s,L,L.x+0.22,L.y+1.72,0.30,'lock',true);
  tx(s,L,{x:L.x+0.22,y:L.y+2.16,w:L.w-0.44,h:0.96},
    '정보공개서 제공 후 14일이 지나기 전에는 시스템에서 전자계약 버튼이 잠깁니다. 기간 경과 전 계약이 구조적으로 불가능합니다.',
    T.body,{size:11,color:C.MUTED});

  rrect(s,at(R,{x:R.x,y:R.y,w:R.w,h:B.h},{kind:'card'}),C.NAVY2,0.08);
  { const rh=(B.h-0.38)/5;
    for(let i=1;i<5;i+=2) rect(s,at(R,{x:R.x,y:R.y+0.38+rh*i,w:R.w,h:rh},{kind:'row'}),C.NAVY); }
  const gt=region('gvt',R.x+0.34,R.y,R.w-0.34,B.h);
  const GV=[['정보공개서 · 계약서','본사가 제공하고 내일사장은 전달과 설명만 보조합니다'],
            ['법정 숙려기간','14일 준수 · 기간 단축 유도 금지'],
            ['예상매출 진술','구두 약속 금지 · 본사 승인 문구만 사용'],
            ['광고 · 상담 스크립트','본사 사전 승인 후 사용'],
            ['위반 확인 시','해당 건 영업 즉시 중단 및 본사 통보']];
  table(s,gt,[{h:'항목',w:2.60},{h:'기준',w:gt.w-2.60}],
    GV.map(([k,v])=>[{v:k,b:true},v]),{dark:true, rh:(gt.h-0.38)/5});
  GV.forEach((_,i)=>{
    const rh=(gt.h-0.38)/5;
    check(s,R,R.x+0.08,R.y+0.42+rh*i+(rh-0.20)/2,0.20);
  });

  bandSentence(s,'정보공개서 제공 후 [14일이 지나기 전에는] 전자계약 버튼이 잠깁니다.');
  s.addNotes('준법은 사람이 아니라 시스템이 막습니다.');
}

/* ══════════════ 14 04 Governance — 라이트 + 틴트 (업종 공백) ══════════════ */
{
  const s=p.addSlide(); bg(s,C.WHITE);
  frame(s,14,'04',false,true);
  head(s,'[홀덤 업종 전담 이력은 없습니다]',false,true);
  lead(s,'숨기지 않고 먼저 말씀드립니다. 대신 검증 방법을 본사가 정하시도록 설계했습니다.',false,11);

  const B=BODY('full');
  const L=region('nL',B.x,B.y,span(0,4).w,B.h);
  const R=region('nR',span(4,8).x,B.y,span(4,8).w,B.h);

  rrect(s,at(L,{x:L.x,y:L.y,w:L.w,h:B.h},{kind:'card'}),C.PAPER,0.10);
  pill(s,L,L.x+0.22,L.y+0.20,'업종 경험 없음',C.RED);
  kpi(s,L,{x:L.x+0.22,y:L.y+0.94,w:L.w-0.44,h:1.10},'0','건','홀덤 업종 전담 영업 이력',
    {size:56,color:C.RED,unitColor:C.MUTE});
  tx(s,L,{x:L.x+0.22,y:L.y+1.98,w:L.w-0.44,h:0.72},
    '그래서 첫 구간을 파일럿으로 두고, 건수와 기간과 중단 시점을 전부 본사가 단독으로 정하시게 했습니다.',
    T.body,{size:11,color:C.MUTE});
  tx(s,L,{x:L.x+0.22,y:L.y+2.82,w:L.w-0.44,h:0.24},'대신 본사가 정하시는 것',T.label,{color:C.NAVY,valign:'middle'});
  const q=split(region('q4',L.x+0.22,L.y+3.08,L.w-0.44,0.36),2,0.16);
  ['검증 기간','목표 건수'].forEach((v,i)=>{
    rrect(s,at(q[i],{x:q[i].x,y:q[i].y,w:q[i].w,h:0.32},{kind:'chip'}),C.BLUEBG,0.13);
    tx(s,q[i],{x:q[i].x+0.10,y:q[i].y,w:q[i].w-0.20,h:0.32},v,T.label,
      {color:C.BLUE,align:'center',valign:'middle'});
  });

  const pt=region('pt',R.x+0.34,R.y,R.w-0.34,B.h);
  const PT=[['검증 기간','본사가 정하시는 기간 — 착수 전 별지로 확정'],
            ['목표 건수','본사가 정하시는 목표 — 착수 전 별지로 확정'],
            ['평가 지표','신규 리드 수 · 상담 진행 수 · 계약 체결 건수'],
            ['보고','주 단위 리포트 — 활동 지표와 단계별 파이프라인'],
            ['착수 조건','본사 승인 자료 확정 후 즉시 착수 · 착수금 없음'],
            ['기간 종료 시','연장 또는 종료를 본사가 단독 결정']];
  table(s,pt,[{h:'항목',w:2.10},{h:'본사 결정 사항',w:pt.w-2.10}],
    PT.map(([k,v])=>[{v:k,b:true},v]),{rh:(pt.h-0.38)/6});
  PT.forEach((_,i)=>{
    const rh=(pt.h-0.38)/6;
    icon(s,R,R.x,R.y+0.42+rh*i+(rh-0.22)/2,0.22,'badge',false);
  });

  bandChips(s,'업종 경험 공백을 메우는 장치',
    ['① 리브랜딩 트랙은 운영 중인 점주 대상','② 입지 · 손익 · 계약 절차는 업종 무관','③ 파일럿 조건 전부 본사 결정']);
  s.addNotes('판매하는 것은 업종이 아니라 창업 결정입니다.');
}

/* ══════════════ 15 Close — 좌우분할 · 좌측 다크 ══════════════ */
{
  const s=p.addSlide(); bg(s,C.WHITE);
  splitPanel(s,'left',CUT7,C.NAVY);
  skyline(s,0,G.H-1.05,CUT7,1.05);
  frame(s,15,null,false,false,false,true);
  const HB={x:SAFE.x,w:CUT7-SAFE.x-0.42};
  anchor(s,'Close',true,HB);
  head(s,'본사가 정해 주실 [결정 5건]',true,false,HB);
  lead(s,'아래 다섯 가지만 정해 주시면 그대로 따릅니다.',true,HB);

  const B=BODY('full');
  const L=region('cL',SAFE.x,B.y,CUT7-SAFE.x-0.42,B.h);
  const RX=CUT7+0.42, R=region('cR',RX,B.y,RIGHT-RX,B.h);

  [['전속 · 비전속','전속으로 하실지, 타 대행사와 병행하실지'],
   ['대상 지역','전국인지, 특정 권역으로 한정하실지'],
   ['위임 기간','파일럿 기간과 연장 조건'],
   ['직영 영업 병행','본사 직영 영업을 함께 두실지'],
   ['인테리어 시공','내일사장 시공 진행 여부 · 추가 수익 분배는 별도 협의']].forEach(([k,v],i)=>{
    const y=L.y+i*0.64;
    if(i===0) rect(s,at(L,{x:L.x,y,w:0.06,h:0.32},{kind:'hl'}),C.YEL);
    stepBadge(s,L,L.x+0.16,y+0.02,0.26,i+1,true);
    tx(s,L,{x:L.x+0.54,y,w:2.30,h:0.28},k,T.sub,{size:13,color:C.INK_ON,valign:'middle'});
    tx(s,L,{x:L.x+2.92,y,w:L.w-2.92,h:0.28},v,T.body,{size:10.5,color:C.MUTED,valign:'middle'});
    hr(s,L.x,y+0.44,L.w,C.RULED);
  });
  tx(s,L,{x:L.x,y:L.y+3.16,w:L.w,h:0.28},
    '착수금은 없습니다. 본사 승인 자료가 확정되면 즉시 착수합니다.',T.body,
    {size:11,bold:true,color:C.BLUEL,valign:'middle'});

  const rf=P('logo.png'), rw=2.20, rh=rw/3.045;
  rrect(s,at(R,{x:R.x,y:R.y,w:R.w,h:rh+0.36},{kind:'card'}),C.NAVY,0.08);
  s.addImage({path:rf, ...img(R,{x:R.x+(R.w-rw)/2,y:R.y+0.18,w:rw,h:rh},rf)});
  hr(s,R.x,R.y+1.22,R.w,C.RULE);
  tx(s,R,{x:R.x,y:R.y+1.34,w:R.w,h:0.22},'수신',T.note,{color:C.MUTE});
  tx(s,R,{x:R.x,y:R.y+1.58,w:R.w,h:0.26},'러너스튜디오(주) 귀중 · 대표 박경관',T.body,
    {size:12,valign:'middle'});
  tx(s,R,{x:R.x,y:R.y+1.86,w:R.w,h:0.22},'서울 강남구 삼성로100길 12 제이타워 B2',T.note,{color:C.MUTE});
  tx(s,R,{x:R.x,y:R.y+2.06,w:R.w,h:0.22},'발신',T.note,{color:C.MUTE});
  const lf=P('ns_logo.png'), lw=1.34;
  s.addImage({path:lf, ...img(R,{x:R.x,y:R.y+2.30,w:lw,h:lw/3.7009},lf)});
  ['담당','연락처','이메일'].forEach((k,i)=>{
    const y=R.y+2.72+i*0.25;
    tx(s,R,{x:R.x,y,w:0.76,h:0.22},k,T.note,{color:C.MUTE,valign:'middle'});
    hr(s,R.x+0.84,y+0.20,R.w-0.84,C.RULE);
  });

  bandFig(s,'검증 기간 종료 시 본사에 남는 비용','0','원',{labelDark:true});
  s.addNotes('다섯 가지만 정해 주시면 됩니다. 종료하셔도 본사에 남는 비용은 없습니다.');
}

/* ═══ 저장 ═══ */
const OUT='/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v4/runnerpub_v7.pptx';
const rep=G.report('/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v4/layout_report_v7.txt');
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
