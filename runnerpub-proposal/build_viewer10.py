#!/usr/bin/env python3
"""러너펍 제안서 뷰어 — 자립형 HTML 생성 (이미지·폰트·PPTX 전부 인라인)"""
import base64, io, os, re, subprocess, sys
from PIL import Image

V = '/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v4'
OUT = os.path.join(V, 'viewer10.html')
PPTX = os.path.join(V, 'runnerpub_v10.pptx')

LABELS = ['표지', '적합', '수요', '팀', '업무', '제휴', '도구',
          '위임', '비교', '조건', '수지', '준법', '공백', 'CLOSE']
TITLES = [
    '가맹영업대행 제안서 — 러너펍 가맹 개설 영업 전면 위임',
    '러너펍이 갖춘 것과 내일사장이 채우는 것',
    '이번 제안 이전에 확보된 창업 수요',
    '가맹 개설 · 영업을 직접 수행한 4인 중심의 팀 구성',
    '가맹영업 수행 업무 3종 및 수행 브랜드 현황',
    '예비창업자 접점을 넓히는 전략적 제휴 현황',
    '결정 지연 구간별 근거 문서 제공',
    '발굴부터 클로징까지 전 과정 위임, 본사는 승인',
    '직영 채용 · 일반 대행 · 내일사장 세 가지 방식 비교',
    '비용 발생 시점과 성공보수 정산 기준',
    '계약 시점부터 흑자, 로열티 전액 순증',
    '사람이 아닌 시스템 기반의 준법 통제',
    '홀덤 업종 영업 이력 없음',
    '본사가 정하시는 결정 5건 · 담당 지윤진 본부장',
]

# ── 슬라이드 이미지 ───────────────────────────────────────────────
slides = []
for i in range(1, 15):
    im = Image.open(os.path.join(V, 'png10', f'p{i}.png')).convert('RGB')
    im = im.resize((1600, round(1600 * im.height / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'JPEG', quality=78, optimize=True, progressive=True)
    slides.append(base64.b64encode(buf.getvalue()).decode())

pptx_b64 = base64.b64encode(open(PPTX, 'rb').read()).decode()

# ── 본문 ─────────────────────────────────────────────────────────
ticks = '\n'.join(
    f'      <button class="tick" type="button" data-i="{i}" '
    f'aria-label="{i+1}쪽 {LABELS[i]}"><span></span></button>'
    for i in range(14))

figures = '\n'.join(
    f'      <figure class="slide" data-i="{i}"{"" if i == 0 else " hidden"}>'
    f'<img src="data:image/jpeg;base64,{slides[i]}" alt="{i+1}쪽 — {TITLES[i]}" '
    f'{"" if i == 0 else "loading=lazy "}decoding="async"></figure>'
    for i in range(14))

meta = ',\n'.join(f'  {{n:"{LABELS[i]}",t:"{TITLES[i]}"}}' for i in range(14))

HTML = f'''<title>가맹영업대행 제안서 — 내일사장</title>
<style>
:root {{
  --ground:#F2F4F8; --ink:#1D2C47; --body:#39465E; --weak:#6C7891;
  --rule:#D6DCE7; --hair:#E4E9F1; --accent:#2C68F3; --bronze:#B8862B;
  --stage:#FFFFFF; --shadow:rgba(29,44,71,.10);
}}
@media (prefers-color-scheme:dark) {{
  :root {{
    --ground:#16233D; --ink:#F4F6FA; --body:#C9D3E4; --weak:#93A0B8;
    --rule:#2B3A56; --hair:#1E2C46; --accent:#7FA8FF; --bronze:#E5B75C;
    --stage:#0E1729; --shadow:rgba(0,0,0,.5);
  }}
}}
:root[data-theme="dark"] {{
  --ground:#16233D; --ink:#F4F6FA; --body:#C9D3E4; --weak:#93A0B8;
  --rule:#2B3A56; --hair:#1E2C46; --accent:#7FA8FF; --bronze:#E5B75C;
  --stage:#0E1729; --shadow:rgba(0,0,0,.5);
}}
:root[data-theme="light"] {{
  --ground:#F2F4F8; --ink:#1D2C47; --body:#39465E; --weak:#6C7891;
  --rule:#D6DCE7; --hair:#E4E9F1; --accent:#2C68F3; --bronze:#B8862B;
  --stage:#FFFFFF; --shadow:rgba(29,44,71,.10);
}}

* {{ box-sizing:border-box; }}
body {{
  margin:0; background:var(--ground); color:var(--body);
  font-family:"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,
    "Apple SD Gothic Neo","Malgun Gothic","맑은 고딕",system-ui,sans-serif;
  font-size:15px; line-height:1.6; -webkit-font-smoothing:antialiased;
  font-feature-settings:"tnum";
}}
.wrap {{ max-width:1180px; margin:0 auto; padding:28px 20px 44px; }}

/* ── 머리말 ── */
.masthead {{ display:flex; flex-wrap:wrap; gap:14px 24px;
  align-items:flex-end; justify-content:space-between; }}
.eyebrow {{ font-size:10px; letter-spacing:.18em; color:var(--weak);
  text-transform:uppercase; margin:0 0 6px; }}
h1 {{ font-size:19px; font-weight:700; color:var(--ink); margin:0;
  letter-spacing:-.01em; text-wrap:balance; }}
.route {{ font-size:12.5px; color:var(--weak); margin:5px 0 0; }}
.route b {{ color:var(--ink); font-weight:600; }}
.counter {{ text-align:right; white-space:nowrap; }}
.counter .now {{ font-size:30px; font-weight:700; color:var(--ink);
  letter-spacing:-.02em; line-height:1; }}
.counter .of {{ font-size:12px; color:var(--weak); }}

/* ── 13칸 진도 눈금 = 내비게이션 ── */
.meter {{ display:grid; grid-template-columns:repeat(15,1fr); gap:4px;
  margin:20px 0 0; padding:0; }}
.tick {{ appearance:none; background:none; border:0; padding:11px 0 6px;
  cursor:pointer; display:block; }}
.tick span {{ display:block; height:3px; background:var(--rule);
  transition:height .18s ease, background-color .18s ease; }}
.tick:hover span {{ background:var(--weak); }}
.tick[aria-current="true"] span {{ height:9px; background:var(--ink); }}
.tick:focus-visible {{ outline:2px solid var(--accent); outline-offset:2px; }}

/* ── 무대 ── */
.stagerow {{ display:flex; align-items:baseline; justify-content:space-between;
  gap:16px; margin:14px 0 10px; }}
.rail {{ font-size:12px; color:var(--weak); white-space:nowrap; }}
.rail b {{ color:var(--ink); font-weight:600; }}
.claim {{ font-size:13px; color:var(--body); text-align:right;
  text-wrap:balance; }}

.stage {{ position:relative; background:var(--stage);
  border:1px solid var(--rule); box-shadow:0 1px 3px var(--shadow); }}
.slide {{ margin:0; }}
.slide img {{ display:block; width:100%; height:auto; }}
@media (prefers-reduced-motion:no-preference) {{
  .slide {{ animation:fade .22s ease; }}
  @keyframes fade {{ from {{ opacity:0 }} to {{ opacity:1 }} }}
}}

/* ── 조작 ── */
.controls {{ display:flex; gap:8px; margin:12px 0 0; }}
.controls .hint {{ margin-left:auto; align-self:center; font-size:11.5px;
  color:var(--weak); }}
button.nav {{ appearance:none; font:inherit; font-size:13px; font-weight:600;
  color:var(--ink); background:none; border:1px solid var(--rule);
  padding:8px 16px; cursor:pointer; transition:border-color .15s, color .15s; }}
button.nav:hover:not(:disabled) {{ border-color:var(--ink); }}
button.nav:disabled {{ color:var(--weak); border-color:var(--hair);
  cursor:default; }}
button.nav:focus-visible {{ outline:2px solid var(--accent); outline-offset:2px; }}

/* ── 결산 밴드 (덱 자체 장치를 그대로 씀) ── */
.ledger {{ border-top:2px solid var(--ink); margin-top:34px; padding-top:14px;
  display:flex; flex-wrap:wrap; gap:14px 20px;
  align-items:center; justify-content:space-between; }}
.ledger p {{ margin:0; font-size:12.5px; color:var(--weak); }}
.files {{ display:flex; gap:8px; flex-wrap:wrap; }}
a.file {{ font-size:13px; font-weight:600; color:var(--ground);
  background:var(--ink); border:1px solid var(--ink); padding:9px 18px;
  text-decoration:none; transition:opacity .15s; }}
a.file:hover {{ opacity:.82; }}
a.file:focus-visible {{ outline:2px solid var(--accent); outline-offset:2px; }}

/* ── 발송 전 확인 ── */
.notice {{ margin-top:22px; border-left:3px solid var(--bronze);
  padding:2px 0 2px 14px; }}
.notice h2 {{ font-size:11px; letter-spacing:.14em; text-transform:uppercase;
  color:var(--bronze); margin:0 0 4px; font-weight:700; }}
.notice p {{ margin:0; font-size:13px; color:var(--body); }}
.notice p + p {{ margin-top:5px; color:var(--weak); font-size:12.5px; }}

@media (max-width:640px) {{
  .wrap {{ padding:20px 14px 34px; }}
  h1 {{ font-size:16px; }}
  .counter .now {{ font-size:24px; }}
  .claim {{ display:none; }}
  .meter {{ gap:3px; }}
}}
</style>

<div class="wrap">
  <header class="masthead">
    <div>
      <p class="eyebrow">가맹 개설 영업 위임 제안 · 2026.07</p>
      <h1>가맹을 팔아 온 사람들이 러너펍을 팔겠습니다</h1>
      <p class="route">발신 <b>주식회사 내일사장</b> &nbsp;→&nbsp; 수신 <b>러너스튜디오(주)</b> · 러너펍 가맹본부</p>
    </div>
    <div class="counter">
      <div class="now" id="now">01</div>
      <div class="of">/ 15 쪽 · 16:9</div>
    </div>
  </header>

  <nav class="meter" id="meter" aria-label="쪽 이동">
{ticks}
  </nav>

  <div class="stagerow">
    <div class="rail">P.<span id="pno">01</span> — <b id="label">표지</b></div>
    <div class="claim" id="claim"></div>
  </div>

  <div class="stage" id="stage">
{figures}
  </div>

  <div class="controls">
    <button class="nav" type="button" id="prev" disabled>← 이전</button>
    <button class="nav" type="button" id="next">다음 →</button>
    <span class="hint">← → 키로도 넘길 수 있습니다</span>
  </div>

  <div class="ledger">
    <p>편집본 PPTX는 아래에서 바로 받으실 수 있습니다. 본문 폰트는 맑은 고딕이라 다른 PC에서도 그대로 열립니다.</p>
    <div class="files">
      <a class="file" id="dl"
         href="data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,{pptx_b64}"
         download="러너펍_제안서_내일사장_202607.pptx">PPTX 내려받기</a>
    </div>
  </div>

  <section class="notice">
    <h2>협의 사항</h2>
    <p>15쪽 회신처의 담당 · 연락처 · 이메일은 공란으로 두었습니다. 발송 직전에 직접 기입하시면 됩니다.</p>
    <p>파일럿 기간 · 목표 건수 · 대상 지역 · 전속 여부 · 인테리어 시공 진행 여부는 본사가 정하실 항목이라 숫자를 넣지 않았습니다.</p>
    <p>위임 조건(전속 여부 · 지역 · 기간), 파일럿 기간과 목표 건수, 해제 · 환불 시 성공보수 처리 기준도 본사와 협의할 사항이라 비워 두었습니다.</p>
  </section>
</div>

<script>
const META = [
{meta}
];
const stage = document.getElementById('stage');
const figs  = [...stage.querySelectorAll('.slide')];
const ticks = [...document.querySelectorAll('.tick')];
const el = {{
  now:   document.getElementById('now'),
  pno:   document.getElementById('pno'),
  label: document.getElementById('label'),
  claim: document.getElementById('claim'),
  prev:  document.getElementById('prev'),
  next:  document.getElementById('next'),
}};
let cur = -1;

function show(i) {{
  i = Math.max(0, Math.min(14, i));
  if (i === cur) return;
  if (cur > -1) figs[cur].hidden = true;
  figs[i].hidden = false;
  cur = i;
  const pad = String(i + 1).padStart(2, '0');
  el.now.textContent = pad;
  el.pno.textContent = pad;
  el.label.textContent = META[i].n;
  el.claim.textContent = META[i].t;
  el.prev.disabled = i === 0;
  el.next.disabled = i === 14;
  ticks.forEach((t, j) => t.setAttribute('aria-current', String(j === i)));
}}

ticks.forEach(t => t.addEventListener('click', () => show(+t.dataset.i)));
el.prev.addEventListener('click', () => show(cur - 1));
el.next.addEventListener('click', () => show(cur + 1));
addEventListener('keydown', e => {{
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const go = {{ ArrowLeft: cur - 1, ArrowRight: cur + 1,
                Home: 0, End: 14, PageUp: cur - 1, PageDown: cur + 1 }}[e.key];
  if (go === undefined) return;
  e.preventDefault();
  show(go);
}});

show(0);
</script>
'''

open(OUT, 'w', encoding='utf-8').write(HTML)
print('WROTE', OUT, os.path.getsize(OUT) // 1024, 'KB')
