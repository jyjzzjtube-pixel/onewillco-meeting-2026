/* v6 공통 키트 — 팔레트 · 골격 함수
   설계서 §1 토큰, §4 반복 장치를 그대로 구현한다. */
const NM = '/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/node_modules';
const path = require('path');
const G = require('./grid.js');
const A = '/home/user/onewillco-meeting-2026/runnerpub-proposal/assets';

/* ═══ 팔레트 ═══ */
const C = {
  NAVY:'16233D', NAVY2:'1D2C47', NAVYTEX:'33456B',
  BLUE:'2C68F3', BLUEL:'7FA8FF', BLUEBG:'E8EFFF', BLUEBG2:'D3E0FF', BLUEBG0:'EEF3FF',
  RED:'E23B3B', YEL:'FFE96B',
  PAPER:'F2F4F8', WHITE:'FFFFFF', INK_ON:'F4F6FA',
  MUTE:'6C7891', MUTED:'93A0B8', RULE:'D6DCE7', RULED:'2B3A56',
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

const { SAFE, Y, span, region, split, pad, at, fit, img, setSlide, BLEED } = G;
const t = (o) => Object.assign({fontFace:F, margin:0}, o);

module.exports = function make(p) {
  const rect = (s,b,c) => s.addShape(p.ShapeType.rect, {...b, fill:{color:c}, line:{type:'none'}});
  const rrect = (s,b,c,r) => s.addShape(p.ShapeType.roundRect,
    {...b, fill:{color:c}, line:{type:'none'}, rectRadius:(r===undefined?0.10:r)});
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
    const b=fit(reg,box,plain,pt,{lineSpacing:ls});
    s.addText(txt,t({...b, fontSize:pt, bold:(o.bold!==undefined?o.bold:st.b),
      color:o.color||C.NAVY, align:o.align||'left', valign:o.valign||'top',
      lineSpacing:ls, charSpacing:(o.cs!==undefined?o.cs:st.cs)}));
    return b;
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
  function frame(s,no,chap,dark,bleed){
    setSlide(no);
    const ink = dark?C.INK_ON:C.NAVY, mu = (dark||bleed)?C.MUTED:C.MUTE;
    hr(s, SAFE.x, Y.topRule.y, SAFE.w, dark?C.WHITE:C.NAVY, 0.014);
    const brow = region('brow', SAFE.x, Y.brow.y, SAFE.w, Y.brow.h);
    if(chap) tx(s,brow,{x:SAFE.x,y:Y.brow.y+0.02,w:1.6,h:0.24},chap,T.chap,
      {color:dark?C.MUTED:C.MUTE, valign:'middle'});
    const lf = path.join(A, dark?'ns_logo_w.png':'ns_logo.png');
    const lw = 1.10, lh = lw/3.7009;
    s.addImage({path:lf, ...img(brow,{x:SAFE.x+SAFE.w-lw, y:Y.brow.y+(Y.brow.h-lh)/2, w:lw, h:lh}, lf)});

    FOOTNO = no;
    if(!bleed) footer(s, dark);   // 풀블리드 밴드 슬라이드는 밴드가 그린 뒤 다시 그린다
  }
  let FOOTNO = 0;
  /** 푸터 — 풀블리드 밴드가 덮은 뒤 다시 그릴 수 있게 분리 */
  function footer(s, onDark){
    hr(s, SAFE.x, Y.footRule.y, SAFE.w, onDark?C.RULED:C.RULE);
    const ft = region('foot', SAFE.x, Y.foot.y, SAFE.w, Y.foot.h);
    const fl = span(0,8), fr = span(10,2);
    tx(s,ft,{x:fl.x,y:Y.foot.y+0.02,w:fl.w,h:0.22},
      '주식회사 내일사장  →  러너스튜디오(주) 러너펍 가맹본부',T.foot,
      {color:onDark?C.MUTED:C.MUTE, valign:'middle'});
    tx(s,ft,{x:fr.x,y:Y.foot.y+0.02,w:fr.w,h:0.22},
      `${String(FOOTNO).padStart(2,'0')} / 15`,T.foot,
      {color:onDark?C.INK_ON:C.NAVY, bold:true, align:'right', valign:'middle'});
  }
  /** 영문 챕터 앵커 */
  function anchor(s,txtStr,dark){
    const r=region('anchor',SAFE.x,Y.anchor.y,SAFE.w,Y.anchor.h);
    tx(s,r,{x:SAFE.x,y:Y.anchor.y,w:SAFE.w,h:Y.anchor.h},txtStr,T.anchor,
      {color:dark?C.INK_ON:C.NAVY, valign:'middle'});
  }
  /** 국문 헤드 — full=true 면 anchor 밴드까지 써서 2줄 */
  function head(s,str,dark,full){
    const band = full ? Y.headFull : Y.head;
    const st   = full ? T.head2 : T.head;
    const r=region('head',SAFE.x,band.y,SAFE.w,band.h);
    tx(s,r,{x:SAFE.x,y:band.y,w:SAFE.w,h:band.h},runs(str,dark),st,{valign:'middle'});
  }
  function lead(s,str,dark,cols){
    const r=region('lead',SAFE.x,Y.lead.y,SAFE.w,Y.lead.h);
    const sp=span(0,cols||11);
    tx(s,r,{x:sp.x,y:Y.lead.y,w:sp.w,h:Y.lead.h},str,T.lead,{color:dark?C.MUTED:C.MUTE});
  }
  function note(s,str,dark){
    const r=region('note',SAFE.x,Y.note.y,SAFE.w,Y.note.h);
    tx(s,r,{x:SAFE.x,y:Y.note.y,w:SAFE.w,h:Y.note.h},str,T.note,{color:dark?C.MUTED:C.MUTE});
  }
  /* ── 결론 밴드 3종 ── */
  function bandFig(s,label,val,unit,dark){          // 수치형
    const r=region('band',SAFE.x,Y.band.y,SAFE.w,Y.band.h);
    hr(s,SAFE.x,Y.band.y,SAFE.w,dark?C.INK_ON:C.NAVY,0.016);
    const L=span(0,7), R=span(7,5);
    tx(s,r,{x:L.x,y:Y.band.y+0.14,w:L.w,h:0.30},label,T.body,
      {color:dark?C.MUTED:C.MUTE, valign:'middle'});
    s.addText([{text:val,options:{fontSize:28,bold:true,color:dark?C.INK_ON:C.NAVY}},
               {text:unit?'  '+unit:'',options:{fontSize:13,bold:true,color:dark?C.MUTED:C.MUTE}}],
      t({...at(r,{x:R.x,y:Y.band.y+0.025,w:R.w,h:0.47},{kind:'fig'}),align:'right',valign:'middle'}));
  }
  function bandSentence(s,str){                     // 문장형 풀블리드
    rect(s,BLEED,C.NAVY);
    skyline(s,0,BLEED.y+BLEED.h-0.46,G.W,0.46);
    const r=region('band',SAFE.x,Y.band.y,SAFE.w,Y.band.h);
    tx(s,r,{x:SAFE.x,y:Y.band.y+0.06,w:SAFE.w,h:0.40},runs(str,true),T.bandtx,{valign:'middle'});
    footer(s,true);
  }
  function bandChips(s,label,chips){                // 칩형 풀블리드
    rect(s,BLEED,C.NAVY);
    skyline(s,0,BLEED.y+BLEED.h-0.46,G.W,0.46);
    const r=region('band',SAFE.x,Y.band.y,SAFE.w,Y.band.h);
    tx(s,r,{x:SAFE.x,y:Y.band.y+0.14,w:2.9,h:0.28},label,T.body,{color:C.MUTED,valign:'middle'});
    let x=SAFE.x+3.05;
    chips.forEach(cstr=>{
      const w=Math.min(2.9, G.textWidth(cstr,9)+0.32);
      rrect(s,at(r,{x,y:Y.band.y+0.12,w,h:0.30},{kind:'chip'}),C.NAVY2,0.15);
      tx(s,r,{x:x+0.16,y:Y.band.y+0.14,w:w-0.32,h:0.26},cstr,T.label,
        {color:C.INK_ON,valign:'middle'});
      x+=w+0.20;
    });
    footer(s,true);
  }
  /* ── 요소 ── */
  function check(s,reg,x,y,size){                   // 파란 원 + 흰 체크
    const d=size||0.22;
    s.addShape(p.ShapeType.ellipse,{...at(reg,{x,y,w:d,h:d},{kind:'mk'}),
      fill:{color:C.BLUE},line:{type:'none'}});
    s.addText('✓',t({x,y,w:d,h:d,fontFace:F,fontSize:d*46,bold:true,
      color:C.WHITE,align:'center',valign:'middle',margin:0}));
  }
  function pill(s,reg,x,y,str,fillC,txtC){
    const w=G.textWidth(str,9)+0.30;
    rrect(s,at(reg,{x,y,w,h:0.26},{kind:'pill'}),fillC||C.BLUE,0.13);
    tx(s,reg,{x:x+0.15,y,w:w-0.30,h:0.26},str,T.label,{color:txtC||C.WHITE,valign:'middle'});
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
      t({...at(reg,{x:box.x,y:box.y,w:box.w,h:0.70},{kind:'fig'}),valign:'middle'}));
    tx(s,reg,{x:box.x,y:box.y+0.72,w:box.w,h:0.26},label,T.sub,
      {size:12, color:dark?C.INK_ON:C.NAVY, valign:'middle'});
    if(sub) tx(s,reg,{x:box.x,y:box.y+1.00,w:box.w,h:box.h-1.00},sub,T.cardtx,
      {size:9.8, color:dark?C.MUTED:C.MUTE});
  }
  const BODY  = (m)=>region('body',SAFE.x,Y.body.y,SAFE.w,(m==='full'?Y.bodyFull:m==='max'?Y.bodyMax:Y.body).h);

  return { C,T,F,t,G,A,path, rect,rrect,hr,vr, skyline, tx,runs, frame,anchor,head,lead,note,
           bandFig,bandSentence,bandChips, check,pill,card,bar,table,fig, BODY,
           SAFE,Y,span,region,split,pad,at,fit,img,setSlide,BLEED };
};
