/* v6 공통 키트 — 팔레트 · 골격 함수
   설계서 §1 토큰, §4 반복 장치를 그대로 구현한다. */
const NM = '/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/node_modules';
const path = require('path');
const G = require('./grid.js');
const A = '/home/user/onewillco-meeting-2026/runnerpub-proposal/assets';

/* ═══ 팔레트 ═══ */
/* 내일사장 IR 14장 픽셀 실측에서 뽑은 색 — 지면 #F8F8F8 47% · 네이비 #203858 계열 15% ·
   파랑 #2868F0 · 연파랑 #A8C0F8 · 틴트 #E8F0F8 */
const C = {
  NAVY:'1E3457', NAVY2:'27405F', NAVYTEX:'3A5580',
  BLUE:'2868F0', BLUEDK:'1A55CC', BLUEL:'6890F0', BLUEP:'A8C0F8',
  BLUEBG:'E7EFFA', BLUEBG2:'DCE7F8', BLUEBG0:'F4F7FD',
  RED:'E23B3B', REDBG:'FDECEC', YEL:'FFE96B',
  PAPER:'F8F8F8', GRAY:'EFF1F4', WHITE:'FFFFFF', INK_ON:'F7F9FC',
  MUTE:'5C687F', MUTED:'A6B6D2', RULE:'DFE3EA', RULED:'35496B',
};
const F = '맑은 고딕';

/* ═══ 타이포 스케일 ═══ */
const T = {
  chap:   {s:13,   b:true,  cs:1.5},
  anchor: {s:32,   b:true,  cs:-0.5, ls:33},
  head:   {s:26,   b:true,  cs:-0.8, ls:33},
  head2:  {s:24,   b:true,  cs:-0.8, ls:30},
  lead:   {s:13,   b:false, ls:19},
  sub:    {s:14,   b:true,  ls:19},
  body:   {s:11.5, b:false, ls:15.4},
  cardtx: {s:10.5, b:false, ls:14.3},
  label:  {s:9,    b:true,  cs:0.8},
  note:   {s:8.5,  b:false, ls:12},
  fig:    {s:44,   b:true,  cs:-1.0},
  figu:   {s:15,   b:true},
  glabel: {s:11,   b:true},
  bandtx: {s:15,   b:false, ls:21},
  foot:   {s:8.5,  b:false},
};

const { SAFE, Y, span, region, split, pad, at, fit, img, imgFree, setSlide, setBg, surface, setBand, BLEED } = G;
const t = (o) => Object.assign({fontFace:F, margin:0}, o);

module.exports = function make(p) {
  const rect = (s,b,c) => { surface(b,c); return s.addShape(p.ShapeType.rect,
    {...b, fill:{color:c}, line:{type:'none'}}); };
  const rrect = (s,b,c,r) => { surface(b,c); return s.addShape(p.ShapeType.roundRect,
    {...b, fill:{color:c}, line:{type:'none'}, rectRadius:(r===undefined?0.10:r)}); };
  /** 그라데이션 면 — assets/gr_*.png 를 늘려서 깐다. 검사기에는 대표색으로 등록 */
  function grad(s,reg,box,name,repColor){
    const f=path.join(A,name);
    s.addImage({path:f, ...imgFree(reg,box,f)});
    surface(box, repColor||C.WHITE);
    return box;
  }
  /** 슬라이드 배경 — 배경색을 검사기에 등록한다 */
  const bg = (s,c) => { s.background={color:c}; setBg(c); };
  const hr = (s,x,y,w,c,h) => rect(s,{x,y,w,h:h||0.008},c);
  const vr = (s,x,y,h,c,w) => rect(s,{x,y,w:w||0.008,h},c);

  /* ── 도시 실루엣 텍스처 ── */
  const SEED=[0.42,0.68,0.31,0.85,0.55,0.24,0.72,0.48,0.90,0.36,
              0.61,0.29,0.78,0.44,0.66,0.33,0.82,0.51,0.27,0.70];
  function skyline(s,x,y,w,h,col){
    const bw=w/SEED.length;
    SEED.forEach((v,i)=>rect(s,{x:x+bw*i, y:y+h-h*v, w:bw*0.86, h:h*v}, col||C.NAVYTEX));
  }

  /* ── 텍스트 ── */
  function tx(s,reg,box,txt,st,o={}){
    const pt=o.size||st.s, ls=o.ls||st.ls||pt*1.34;
    const plain = Array.isArray(txt) ? txt.map(r=>r.text).join('') : txt;
    const col = o.color || (Array.isArray(txt) && txt[0].options && txt[0].options.color) || C.NAVY;
    const b=fit(reg,box,plain,pt,{lineSpacing:ls, color:col});
    s.addText(txt,t({...b, fontSize:pt, bold:(o.bold!==undefined?o.bold:st.b),
      color:o.color||C.NAVY, align:o.align||'left', valign:o.valign||'top',
      lineSpacing:ls, charSpacing:(o.cs!==undefined?o.cs:st.cs)}));
    return b;
  }
  /** 파란 띠 위 런 — 기본 흰색, [대괄호] 안은 형광 노랑 */
  function runsOnBlue(str){
    return str.split(/(\[[^\]]*\])/).filter(Boolean).map(seg =>
      seg.startsWith('[')
        ? {text: seg.slice(1,-1), options:{color:C.YEL, bold:true}}
        : {text: seg, options:{color:C.WHITE}});
  }
  /** 헤드라인 런 — [대괄호] 안을 BLUE 로 */
  function runs(str, dark){
    const base = dark ? C.INK_ON : C.NAVY;
    const acc  = dark ? C.BLUEL  : C.BLUE;
    return str.split(/(\[[^\]]*\])/).filter(Boolean).map(seg =>
      seg.startsWith('[')
        ? {text: seg.slice(1,-1), options:{color:acc}}
        : {text: seg, options:{color:base}});
  }

  /* ── 슬라이드 골격 ── */
  function frame(s,no,chap,dark,bleed,rightDark,leftDark){
    setSlide(no);
    const rd = dark||rightDark, ld = dark||leftDark;
    hr(s, SAFE.x, Y.topRule.y, SAFE.w, dark?C.WHITE:C.NAVY, 0.014);
    const brow = region('brow', SAFE.x, Y.brow.y, SAFE.w, Y.brow.h);
    if(chap) tx(s,brow,{x:SAFE.x,y:Y.brow.y+0.02,w:1.6,h:0.24},chap,T.chap,
      {color:ld?C.MUTED:C.MUTE, valign:'middle'});
    const lf = path.join(A, rd?'ns_logo_w.png':'ns_logo.png');
    const lw = 1.10, lh = lw/G.imgAspect(lf);
    s.addImage({path:lf, ...img(brow,{x:SAFE.x+SAFE.w-lw, y:Y.brow.y+(Y.brow.h-lh)/2, w:lw, h:lh}, lf)});

    FOOTNO = no;
    footer(s);
  }
  let FOOTNO = 0;
  /** 푸터 — 풀블리드 밴드가 덮은 뒤 다시 그릴 수 있게 분리 */
  /** 푸터 — IR 어법: 러닝 푸터 없음. 우하단 회색 쪽번호 하나뿐 */
  function footer(s){
    if(FOOTNO===0) return;
    const ft = region('foot', SAFE.x, Y.foot.y, SAFE.w, Y.foot.h);
    tx(s,ft,{x:SAFE.x+SAFE.w-1.2,y:Y.foot.y+0.02,w:1.2,h:0.22},
      String(FOOTNO),T.foot,{size:9,color:C.MUTE, align:'right', valign:'middle'});
  }
  /** 영문 챕터 앵커 */
  function anchor(s,txtStr,dark,box){
    const r=region('anchor',SAFE.x,Y.anchor.y,SAFE.w,Y.anchor.h);
    const b=box||{x:SAFE.x,w:SAFE.w};
    tx(s,r,{x:b.x,y:Y.anchor.y,w:b.w,h:Y.anchor.h},txtStr,T.anchor,
      {color:dark?C.INK_ON:C.NAVY, valign:'middle'});
  }
  /** 국문 헤드 — full=true 면 anchor 밴드까지 써서 2줄 */
  function head(s,str,dark,full,cols){
    const band = full ? Y.headFull : Y.head;
    const st   = full ? T.head2 : T.head;
    const r=region('head',SAFE.x,band.y,SAFE.w,band.h);
    const sp = (typeof cols==='number') ? span(0,cols) : (cols||{x:SAFE.x,w:SAFE.w});
    tx(s,r,{x:sp.x,y:band.y,w:sp.w,h:band.h},runs(str,dark),st,{valign:'middle'});
  }
  /** IR 조판 국문 헤드 — 2행 명사형. 앵커 아래 head+lead 밴드를 합쳐 쓴다 */
  function head2(s,str,box){
    const r=region('head',SAFE.x,Y.headTwo.y,SAFE.w,Y.headTwo.h);
    const b=box||{x:SAFE.x,w:SAFE.w};
    tx(s,r,{x:b.x,y:Y.headTwo.y,w:b.w,h:Y.headTwo.h},runs(str,false),T.head2,
      {size:25,ls:34,valign:'middle'});
  }
  function lead(s,str,dark,cols){
    const r=region('lead',SAFE.x,Y.lead.y,SAFE.w,Y.lead.h);
    const sp = (cols && typeof cols==='object') ? cols : span(0,cols||11);
    tx(s,r,{x:sp.x,y:Y.lead.y,w:sp.w,h:Y.lead.h},str,T.lead,{color:dark?C.MUTED:C.MUTE});
  }
  function note(s,str,dark,box){
    const r=region('note',SAFE.x,Y.note.y,SAFE.w,Y.note.h);
    const b=box||{x:SAFE.x,w:SAFE.w};
    tx(s,r,{x:b.x,y:Y.note.y,w:b.w,h:Y.note.h},str,T.note,{color:dark?C.MUTED:C.MUTE});
  }
  /* ── 결론 밴드 3종 ── */
  function bandFig(s,label,val,unit,o){              // 수치형
    setBand('수치형');
    const op = (o===true)?{dark:true}:(o||{});
    const lD = op.labelDark!==undefined?op.labelDark:!!op.dark;
    const fD = op.figDark  !==undefined?op.figDark  :!!op.dark;
    const r=region('band',SAFE.x,Y.band.y,SAFE.w,Y.band.h);
    const L=op.labelBox||span(0,7), R=span(7,5);
    hr(s,L.x,Y.band.y,L.w,lD?C.INK_ON:C.NAVY,0.016);
    hr(s,R.x,Y.band.y,R.w,fD?C.INK_ON:C.NAVY,0.016);
    tx(s,r,{x:L.x,y:Y.band.y+0.14,w:L.w,h:0.30},label,T.body,
      {color:lD?C.MUTED:C.MUTE, valign:'middle'});
    s.addText([{text:val,options:{fontSize:28,bold:true,color:fD?C.INK_ON:C.NAVY}},
               {text:unit?'  '+unit:'',options:{fontSize:13,bold:true,color:fD?C.MUTED:C.MUTE}}],
      t({...at(r,{x:R.x,y:Y.band.y+0.025,w:R.w,h:0.47},{kind:'fig',pt:28}),align:'right',valign:'middle'}));
  }
  function bandSentence(s,str,tag){                 // 결론 띠 — 파란 그라데이션, 챕터 종료 장에만
    setBand('문장형');
    const r0=region('bleed',0,0,G.W,G.H);
    grad(s,r0,{x:0,y:Y.band.y-0.10,w:G.W,h:Y.band.h+0.20},'gr_band.png',C.BLUE);
    const r=region('band',SAFE.x,Y.band.y,SAFE.w,Y.band.h);
    let tw=0;
    if(tag){
      tw=G.textWidth(tag,9)+0.44;
      rrect(s,at(r,{x:SAFE.x+SAFE.w-tw,y:Y.band.y+0.10,w:tw,h:0.32},{kind:'pill'}),C.WHITE,0.16);
      tx(s,r,{x:SAFE.x+SAFE.w-tw+0.22,y:Y.band.y+0.10,w:tw-0.44,h:0.32},tag,T.label,
        {color:C.BLUE,valign:'middle'});
      tw+=0.28;
    }
    tx(s,r,{x:SAFE.x,y:Y.band.y+0.06,w:SAFE.w-tw,h:0.40},runsOnBlue(str),T.bandtx,{valign:'middle'});
  }
  function bandChips(s,label,chips){                // 칩형 — 파란 순색 풀블리드 띠
    setBand('칩형');
    rect(s,BLEED,C.BLUE);
    const r=region('band',SAFE.x,Y.band.y,SAFE.w,Y.band.h);
    tx(s,r,{x:SAFE.x,y:Y.band.y+0.14,w:2.9,h:0.28},label,T.body,{color:'C9DAFF',valign:'middle'});
    let x=SAFE.x+3.05;
    chips.forEach(cstr=>{
      const w=Math.min(2.9, G.textWidth(cstr,9)+0.34);
      rrect(s,at(r,{x,y:Y.band.y+0.12,w,h:0.30},{kind:'chip'}),C.WHITE,0.15);
      tx(s,r,{x:x+0.17,y:Y.band.y+0.14,w:w-0.34,h:0.26},cstr,T.label,
        {color:C.BLUE,valign:'middle'});
      x+=w+0.20;
    });
    footer(s,true,false,false,C.BLUE);
  }
  /** 회색 틴트 소제목 띠 — IR 의 섹션 헤더 어법 */
  function sectionBar(s,reg,x,y,w,str,o={}){
    const h=o.h||0.34;
    rect(s,at(reg,{x,y,w,h},{kind:'hl'}),o.bg||C.GRAY);
    rect(s,at(reg,{x,y,w:0.05,h},{kind:'hl'}),o.accent||C.BLUE);
    tx(s,reg,{x:x+0.18,y,w:(o.labelW||w-0.30),h},str,T.sub,
      {size:o.size||12.5,color:o.color||C.NAVY,valign:'middle'});
    return h;
  }
  /** 작은 회색 날짜/기간 칩 — IR 어법 */
  function tagChip(s,reg,x,y,str,o={}){
    const w=G.textWidth(str,8.5)+0.42;
    rrect(s,at(reg,{x,y,w,h:0.24},{kind:'chip'}),o.bg||C.GRAY,0.06);
    tx(s,reg,{x:x+0.18,y,w:w-0.36,h:0.24},str,T.note,
      {size:8.5,color:(o.color===C.BLUE&&o.bg===C.BLUEBG)?C.BLUEDK:(o.color||C.MUTE),valign:'middle'});
    return w;
  }
  /* ── 요소 ── */
  function check(s,reg,x,y,size){                   // 파란 원 + 흰 체크
    const d=size||0.22;
    s.addShape(p.ShapeType.ellipse,{...at(reg,{x,y,w:d,h:d},{kind:'mk'}),
      fill:{color:C.BLUE},line:{type:'none'}});
    s.addText('✓',t({x,y,w:d,h:d,fontFace:F,fontSize:d*46,bold:true,
      color:C.WHITE,align:'center',valign:'middle',margin:0}));
  }
  /** 포인트 아이콘 — assets/ic_<name>[_w].png, 1:1 */
  function icon(s,reg,x,y,size,name,onDark){
    const f=path.join(A,`ic_${name}${onDark?'_w':''}.png`);
    s.addImage({path:f, ...img(reg,{x,y,w:size,h:size},f)});
    at(reg,{x,y,w:size,h:size},{kind:'icon',text:name});
    return size;
  }
  /** 아이콘 + 제목 + 설명 한 덩어리 */
  function iconRow(s,reg,x,y,w,name,title,desc,onDark,isz){
    const d=isz||0.34;
    icon(s,reg,x,y,d,name,onDark);
    tx(s,reg,{x:x+d+0.18,y:y-0.01,w:w-d-0.18,h:0.26},title,T.sub,
      {size:12.5,color:onDark?C.INK_ON:C.NAVY,valign:'middle'});
    if(desc) tx(s,reg,{x:x+d+0.18,y:y+0.26,w:w-d-0.18,h:0.30},desc,T.cardtx,
      {size:10,color:onDark?C.MUTED:C.MUTE});
    return d;
  }
  /** 단계 배지 — 파란 원 안 숫자 */
  function stepBadge(s,reg,x,y,size,n,onDark){
    const d=size||0.32;
    s.addShape(p.ShapeType.ellipse,{...at(reg,{x,y,w:d,h:d},{kind:'badge'}),
      fill:{color:onDark?C.BLUEL:C.BLUE},line:{type:'none'}});
    s.addText(String(n),t({x,y,w:d,h:d,fontFace:F,fontSize:d*40,bold:true,
      color:onDark?C.NAVY:C.WHITE,align:'center',valign:'middle',margin:0}));
    return d;
  }
  /** 형광 강조 — 노란 면 위에 대형 수치 */
  function hiFig(s,reg,box,val,unit,size){
    rect(s,at(reg,{x:box.x,y:box.y+box.h*0.34,w:box.w,h:box.h*0.52},{kind:'hl'}),C.YEL);
    s.addText([{text:val,options:{fontSize:size||44,bold:true,color:C.NAVY,charSpacing:-1.5}},
               {text:unit?' '+unit:'',options:{fontSize:(size||44)*0.36,bold:true,color:C.NAVY}}],
      t({...at(reg,{x:box.x+0.10,y:box.y,w:box.w-0.20,h:box.h},{kind:'fig',pt:size||44}),valign:'middle'}));
  }
  function pill(s,reg,x,y,str,fillC,txtC,fixedW){
    const w=fixedW||(G.textWidth(str,9)+0.44);
    rrect(s,at(reg,{x,y,w,h:0.27},{kind:'pill'}),fillC||C.BLUE,0.13);
    tx(s,reg,{x:x+0.18,y,w:w-0.36,h:0.27},str,T.label,{color:txtC||C.WHITE,valign:'middle'});
    return w;
  }
  function card(s,reg,box,fillC){
    at(reg,box,{kind:'card'});
    rrect(s,box,fillC||C.PAPER,0.10);
    return region((box.name||'card')+'.in', box.x+0.22, box.y+0.20, box.w-0.44, box.h-0.40);
  }
  /* 가로 막대 — 0 기준선 + 끝 값 라벨 */
  function bar(s,reg,x,y,w,h,ratio,fillC,trackC){
    rect(s,at(reg,{x,y,w,h},{kind:'bar'}),trackC||C.RULE);
    rect(s,at(reg,{x,y,w:Math.max(0.06,w*ratio),h},{kind:'bar'}),fillC||C.BLUE);
  }
  /* 표 */
  function table(s,reg,cols,rows,o={}){
    const dark=o.dark, fs=o.fs||T.body.s, hdr=o.header!==false;
    const tw=cols.reduce((a,c)=>a+c.w,0);
    if(tw>reg.w+0.005) throw new Error(`[표] 컬럼 합 ${tw.toFixed(3)} > 영역 ${reg.w.toFixed(3)} «${reg.name}»`);
    const hh=hdr?0.38:0;
    const rh=o.rh||((reg.h-hh)/rows.length);
    if(hh+rh*rows.length>reg.h+0.005)
      throw new Error(`[표] 높이 초과 «${reg.name}» 필요 ${(hh+rh*rows.length).toFixed(3)} > 가용 ${reg.h.toFixed(3)}`);
    let cy=reg.y;
    if(hdr){
      hr(s,reg.x,cy,tw,dark?C.INK_ON:C.NAVY,0.016); cy+=0.08;
      let cx=reg.x;
      cols.forEach(c=>{ tx(s,reg,{x:cx,y:cy,w:c.w,h:0.24},c.h,T.label,
        {color:dark?C.MUTED:C.MUTE, align:c.a, valign:'middle'}); cx+=c.w; });
      cy+=0.30;
    }
    rows.forEach(r=>{
      hr(s,reg.x,cy,tw,dark?C.RULED:C.RULE);
      let cx=reg.x;
      r.forEach((cell,i)=>{
        const c=cols[i], v=(typeof cell==='object')?cell:{v:cell};
        const w=(c.a==='right')?c.w:c.w-0.16;
        tx(s,reg,{x:cx,y:cy+0.05,w,h:rh-0.10},v.v,T.body,
          {size:v.fs||fs, bold:v.b, color:v.c||(dark?C.INK_ON:C.NAVY),
           align:c.a, valign:'middle'});
        cx+=c.w;
      });
      cy+=rh;
    });
    hr(s,reg.x,cy,tw,dark?C.RULED:C.RULE);
    return cy;
  }
  function fig(s,reg,box,val,unit,label,sub,dark,size){
    s.addText([{text:val,options:{fontSize:size||T.fig.s,bold:true,
                 color:dark?C.INK_ON:C.NAVY,charSpacing:-1}},
               {text:unit?' '+unit:'',options:{fontSize:T.figu.s,bold:true,
                 color:dark?C.BLUEL:C.BLUE}}],
      t({...at(reg,{x:box.x,y:box.y,w:box.w,h:0.70},{kind:'fig',pt:size||T.fig.s}),valign:'middle'}));
    tx(s,reg,{x:box.x,y:box.y+0.72,w:box.w,h:0.26},label,T.sub,
      {size:12, color:dark?C.INK_ON:C.NAVY, valign:'middle'});
    if(sub) tx(s,reg,{x:box.x,y:box.y+1.00,w:box.w,h:box.h-1.00},sub,T.cardtx,
      {size:9.8, color:dark?C.MUTED:C.MUTE});
  }

  /* ── v7 추가 골격 ───────────────────────────────────────────── */
  /** 좌우 명암분할 — 항상 y=0→7.5in 풀블리드. 인셋 카드 금지. */
  function splitPanel(s,side,xCut,col){
    const c=col||C.NAVY;
    if(side==='left') rect(s,{x:0,y:0,w:xCut,h:G.H},c);
    else              rect(s,{x:xCut,y:0,w:G.W-xCut,h:G.H},c);
    return xCut;
  }
  /** 형광 마커 — 글자 뒤에 노란 면을 깐다 (라이트 지면 전용) */
  function mark(s,reg,box){
    rect(s,at(reg,{x:box.x,y:box.y+box.h*0.30,w:box.w,h:box.h*0.62},{kind:'hl'}),C.YEL);
  }
  /** 대형 수치 블록 — 값·단위·라벨, 형광 언더바 옵션 */
  function kpi(s,reg,box,val,unit,label,o={}){
    const size=o.size||48, col=o.color||(o.dark?C.INK_ON:C.NAVY);
    if(o.hi) rect(s,at(reg,{x:box.x,y:box.y+0.06,w:Math.min(box.w,o.hiW||3.2),h:size/72*1.05},{kind:'hl'}),C.YEL);
    if(label) tx(s,reg,{x:box.x,y:box.y-0.28,w:box.w,h:0.24},label,T.label,
      {color:o.dark?C.MUTED:C.MUTE,valign:'middle'});
    s.addText([{text:val,options:{fontSize:size,bold:true,color:o.hi?C.NAVY:col,charSpacing:-1.4}},
               {text:unit?' '+unit:'',options:{fontSize:Math.max(12,size*0.30),bold:true,
                 color:o.hi?C.NAVY:(o.unitColor||(o.dark?C.BLUEL:C.BLUE))}}],
      t({...at(reg,{x:box.x+(o.hi?0.16:0),y:box.y,w:box.w-(o.hi?0.16:0),h:size/72*1.28},{kind:'fig',pt:size}),valign:'middle'}));
    if(o.bar) rect(s,at(reg,{x:box.x,y:box.y+size/72*1.32,w:o.barW||1.6,h:0.06},{kind:'hl'}),C.YEL);
    return size/72*1.28;
  }
  /** 삼각 — 상승 표식 */
  function tri(s,reg,x,y,w,h,col,dir){
    const d=dir||'up';
    const pts = d==='up' ? [[0.5,0],[1,1],[0,1]] : [[0,0],[1,0],[0.5,1]];
    s.addShape(p.ShapeType.triangle,{...at(reg,{x,y,w,h},{kind:'icon'}),
      fill:{color:col||C.BLUEL},line:{type:'none'},rotate:d==='up'?0:180});
  }
  /** 세로 타임라인 레일 + 연도 핀 */
  function rail(s,reg,x,y,h,ys,col){
    rect(s,at(reg,{x,y,w:0.022,h},{kind:'rail'}),col||C.RULED);
    ys.forEach(py=>{
      s.addShape(p.ShapeType.ellipse,{...at(reg,{x:x-0.07,y:py-0.08,w:0.16,h:0.16},{kind:'icon'}),
        fill:{color:C.BLUE},line:{type:'none'}});
    });
  }
  /** 2계열 막대 차트 — 그룹별 계열 2개 + 값 라벨 */
  function chart2(s,reg,box,groups,o={}){
    const n=groups.length, gw=box.w/n, bw=o.bw||0.34, gap=o.gap||0.10;
    const maxV=Math.max(...groups.flatMap(g=>g.v));
    const dark=o.dark;
    groups.forEach((g,i)=>{
      const ns=g.v.length;
      const gx=box.x+gw*i+(gw-(bw*ns+gap*(ns-1)))/2;
      g.v.forEach((v,k)=>{
        const bh=Math.max(0.10,(box.h-0.62)*v/maxV);
        const bx=gx+(bw+gap)*k, by=box.y+0.34+(box.h-0.62-bh);
        rect(s,at(reg,{x:bx,y:by,w:bw,h:bh},{kind:'bar'}),(ns===1||k)?(dark?C.BLUEL:C.BLUE):(dark?'46587A':C.RULE));
        tx(s,reg,{x:bx-(gap/2),y:by-0.28,w:bw+gap,h:0.24},g.l[k],T.note,
          {size:8.5,bold:true,color:(ns===1||k)?(dark?C.BLUEL:C.BLUE):(dark?C.MUTED:C.MUTE),align:'center',valign:'middle'});
      });
      tx(s,reg,{x:box.x+gw*i,y:box.y+box.h-0.24,w:gw,h:0.24},g.k,T.note,
        {size:9.5,color:dark?C.MUTED:C.MUTE,align:'center',valign:'middle'});
    });
  }

  const BODY  = (m)=>{const b=(m==='full'?Y.bodyFull:m==='max'?Y.bodyMax:m==='tall'?Y.bodyTall:m==='ir'?Y.bodyIR:Y.body);
    return region('body',SAFE.x,b.y,SAFE.w,b.h);};

  return { C,T,F,t,G,A,path, rect,rrect,bg,grad,hr,vr, skyline, tx,runs, frame,footer,anchor,head,lead,note,
           bandFig,bandSentence,bandChips, head2, check,icon,iconRow,stepBadge,hiFig,pill,card,bar,table,fig,
           sectionBar,tagChip,runsOnBlue,
           splitPanel,mark,kpi,tri,rail,chart2, BODY,
           SAFE,Y,span,region,split,pad,at,fit,img,setSlide,BLEED };
};
