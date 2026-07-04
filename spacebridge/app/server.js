#!/usr/bin/env node
/**
 * 공간브릿지 플랫폼 서버 (zero-dependency)
 * 실행: node server.js          (기본 포트 3000)
 * 환경변수: PORT, ADMIN_PASSWORD (기본값은 반드시 변경할 것 — README 참고)
 *
 * 구성
 *  - 공개 사이트:   /            홈페이지 (견적 폼 → 리드 DB 수집)
 *                   /guide.html  창업가이드 게시판
 *  - 수집 API:      POST /api/track  방문 추적 (채널·검색어·경로 자동 판별)
 *                   POST /api/lead   견적문의 (카테고리별 DB 적재 + 유입 출처 귀속)
 *  - 관리자:        /admin       대시보드·리드 관리·게시판 CRUD (비밀번호 로그인)
 *
 * 저장소: data/ 폴더의 JSON/JSONL 파일 (별도 DB 설치 불필요)
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const DATA = path.join(ROOT, 'data');
const PUB = path.join(ROOT, 'public');
const ADMIN_DIR = path.join(ROOT, 'admin');
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'spacebridge2026!';
const SESSION_TTL = 7 * 24 * 3600 * 1000;

fs.mkdirSync(DATA, { recursive: true });

/* ---------- 저장소 ---------- */
function readJson(file, def) {
  try { return JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8')); }
  catch (e) { return def; }
}
function writeJson(file, obj) {
  const p = path.join(DATA, file);
  const tmp = p + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 1));
  fs.renameSync(tmp, p);
}
function appendVisit(v) {
  const d = new Date(v.t);
  const file = `visits-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}.jsonl`;
  fs.appendFileSync(path.join(DATA, file), JSON.stringify(v) + '\n');
}
function readVisits(sinceMs) {
  const out = [];
  const now = new Date();
  for (let i = 0; i < 13; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const file = path.join(DATA, `visits-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}.jsonl`);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      try { const v = JSON.parse(line); if (v.t >= sinceMs) out.push(v); } catch (e) {}
    }
    if (d.getTime() < sinceMs - 32 * 86400000) break;
  }
  return out;
}

/* 게시판 시드 (최초 1회) */
if (!fs.existsSync(path.join(DATA, 'posts.json'))) {
  const now = Date.now();
  writeJson('posts.json', [
    { id: 1, cat: '공지', title: '공간브릿지 홈페이지가 문을 열었습니다', body: '인테리어부터 포스·키오스크·CCTV·세무기장까지, 창업 준비를 한 번에 해결하는 공간브릿지입니다.\n\n무료 실측·통합 견적은 홈페이지 견적문의 또는 카카오톡 채널로 신청해 주세요.', published: true, views: 0, created: now, updated: now },
    { id: 2, cat: '비용 가이드', title: '상가 계약 후 가장 먼저 할 일 5가지 — 순서 틀리면 월세만 나갑니다', body: '(초안) 임대차 계약 직후 해야 할 일을 순서대로 정리합니다.\n\n1. 철거·원상복구 범위 확인\n2. 인테리어 실측과 통합 견적\n3. 인허가(영업신고) 요건 확인\n4. 포스·키오스크·CCTV 배선 계획을 도면 단계에서 확정\n5. 사업자등록과 부가세 환급 준비\n\n자세한 내용은 상담 시 무료로 안내드립니다.', published: true, views: 0, created: now, updated: now },
    { id: 3, cat: '창업 가이드', title: '키오스크 렌탈 vs 구매, 사장님한테 유리한 쪽은?', body: '(초안) 초기 비용, 36개월 총비용, A/S 조건 세 가지로 비교해 드립니다. 매장 상황별 추천이 다르니 견적 문의 시 함께 상담받으세요.', published: true, views: 0, created: now, updated: now },
  ]);
}

/* 사이트 콘텐츠 시드 (최초 1회) — 관리자 [사이트 편집]에서 수정 */
const DEFAULT_CONTENT = {
  site: {
    phone: '0000-0000', kakao_url: '#', kakao_name: '@공간브릿지',
    promise: '영업시간 내 3시간 안에 연락드립니다 · 광고 연락 없음',
    ceo: '○○○', biz_no: '000-00-00000', address: '○○시 ○○구 ○○로 00, 0층',
    email: 'hello@spacebridge.kr', footer_note: '실내건축공사업 면허 · 시공 보증보험 가입',
  },
  hero: {
    badge: '상가 인테리어 + 포스 · 키오스크 · CCTV · 세무기장 원스톱',
    t1: '창업 준비, 다섯 군데 알아보지 마세요.',
    t2: '인테리어부터 포스·CCTV·세무까지,',
    t3: '공간브릿지 하나면 됩니다.',
    sub: '임대차 계약하셨나요? 지금부터 오픈까지, 저희가 한 번에 챙깁니다.',
  },
  trust: [
    { num: '○○', unit: '건', cap: '누적 시공' },
    { num: '○', unit: '종', cap: '대응 업종' },
    { num: '○', unit: '주', cap: '평균 공사기간' },
    { num: '○', unit: '년', cap: '시공 후 AS 보증' },
  ],
  portfolio: [
    { tag: 'CAFE · 공사 3주', title: '○○동 12평 카페', cost: '1,850만원', inc: '인테리어 + 포스 + CCTV 포함 · 철거부터 오픈까지', img: '' },
    { tag: 'RESTAURANT · 공사 4주', title: '○○동 18평 국밥집', cost: '3,200만원', inc: '인테리어 + 주방설비 배관 + 포스·키오스크 포함', img: '' },
    { tag: 'HAIR SALON · 공사 3주', title: '○○동 10평 미용실', cost: '2,400만원', inc: '인테리어 + CCTV + 세무기장 개시 포함', img: '' },
  ],
  reviews: [
    { quote: '오픈일을 2주 앞당겼어요.', body: '공사 끝나는 주에 포스랑 CCTV가 같이 설치되더라고요. 원래 잡았던 오픈일보다 2주 빨리 열어서, 그만큼 월세를 벌었습니다.', name: '김○○ 사장님', shop: '○○동 12평 카페 · 2026년 ○월 오픈' },
    { quote: '업체 조율 스트레스가 없었어요.', body: '전에 가게 할 땐 업체 다섯 군데랑 통화하느라 하루가 다 갔는데, 이번엔 담당자 한 분한테만 물어보면 끝. 저는 메뉴 준비에만 집중했습니다.', name: '박○○ 사장님', shop: '○○동 18평 국밥집 · 2026년 ○월 오픈' },
    { quote: '견적서가 한 장이라 비교가 쉬웠어요.', body: '인테리어, 포스, CCTV, 기장료까지 한 장에 다 적혀 있으니 총비용이 바로 보였어요. 숨은 비용이 없다는 게 제일 컸습니다.', name: '이○○ 사장님', shop: '○○동 10평 미용실 · 2026년 ○월 오픈' },
  ],
};
if (!fs.existsSync(path.join(DATA, 'content.json'))) writeJson('content.json', DEFAULT_CONTENT);
function getContent() {
  const c = readJson('content.json', DEFAULT_CONTENT);
  // 누락 필드는 기본값으로 보강 (구버전 데이터 호환)
  return {
    site: Object.assign({}, DEFAULT_CONTENT.site, c.site),
    hero: Object.assign({}, DEFAULT_CONTENT.hero, c.hero),
    trust: Array.isArray(c.trust) && c.trust.length ? c.trust : DEFAULT_CONTENT.trust,
    portfolio: Array.isArray(c.portfolio) ? c.portfolio : DEFAULT_CONTENT.portfolio,
    reviews: Array.isArray(c.reviews) ? c.reviews : DEFAULT_CONTENT.reviews,
  };
}

/* ---------- 홈페이지 렌더링 (CMS 템플릿) ---------- */
function escHtml(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function escAttr(s) { return escHtml(s); }
function renderHome() {
  let html = fs.readFileSync(path.join(PUB, 'index.html'), 'utf8');
  const c = getContent();
  const s = c.site, h = c.hero;
  const trustHtml = c.trust.map(t =>
    `<div class="t-item"><div class="t-num">${escHtml(t.num)}<span class="u">${escHtml(t.unit)}</span></div><div class="t-cap">${escHtml(t.cap)}</div></div>`
  ).join('\n    ');
  const grad = ['t1', 't2', 't3'];
  const pfHtml = c.portfolio.map((p, i) => {
    const thumb = p.img
      ? `<div class="pf-thumb" style="background:url('${escAttr(p.img)}') center/cover no-repeat;">
          <div class="ba"><span class="before">BEFORE</span><span class="after">AFTER</span></div>
        </div>`
      : `<div class="pf-thumb ${grad[i % 3]}">
          <div class="ba"><span class="before">BEFORE</span><span class="after">AFTER</span></div>
          <div class="ph-label">시공 사진 준비 중</div>
        </div>`;
    return `<article class="pf-card">
        ${thumb}
        <div class="pf-body">
          <div class="pf-tag">${escHtml(p.tag)}</div>
          <h4>${escHtml(p.title)}</h4>
          <div class="pf-cost">총 <b>${escHtml(p.cost)}</b></div>
          <div class="pf-inc">${escHtml(p.inc)}</div>
        </div>
      </article>`;
  }).join('\n      ');
  const rvHtml = c.reviews.map(r =>
    `<article class="rv-card">
        <div class="stars">★★★★★</div>
        <p class="quote">"${escHtml(r.quote)}"</p>
        <p class="body">${escHtml(r.body)}</p>
        <div class="who">
          <span class="avatar">${escHtml((r.name || '고').charAt(0))}</span>
          <span><span class="nm">${escHtml(r.name)}</span><br><span class="shop">${escHtml(r.shop)}</span></span>
        </div>
      </article>`
  ).join('\n      ');
  const map = {
    HERO_BADGE: escHtml(h.badge), HERO_T1: escHtml(h.t1), HERO_T2: escHtml(h.t2), HERO_T3: escHtml(h.t3), HERO_SUB: escHtml(h.sub),
    TRUST_ITEMS: trustHtml, PORTFOLIO_CARDS: pfHtml, REVIEW_CARDS: rvHtml,
    PHONE: escHtml(s.phone), PHONE_TEL: String(s.phone || '').replace(/\D/g, ''),
    KAKAO_URL: s.kakao_url && s.kakao_url !== '#' ? escAttr(s.kakao_url) : '#quote',
    KAKAO_NAME: escHtml(s.kakao_name), PROMISE: escHtml(s.promise),
    CEO: escHtml(s.ceo), BIZ_NO: escHtml(s.biz_no), ADDRESS: escHtml(s.address),
    EMAIL: escHtml(s.email), FOOTER_NOTE: escHtml(s.footer_note),
  };
  return html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in map ? map[k] : m));
}

/* ---------- 유입 채널·검색어 판별 ---------- */
function deriveChannel(ref, utm) {
  if (utm && utm.utm_source) {
    const s = utm.utm_source.toLowerCase();
    const map = { naver: '네이버(광고/캠페인)', google: '구글(캠페인)', instagram: '인스타그램(캠페인)', kakao: '카카오(캠페인)', youtube: '유튜브(캠페인)' };
    return map[s] || `캠페인:${utm.utm_source}`;
  }
  if (!ref) return '직접 유입';
  let host = '';
  try { host = new URL(ref).hostname.toLowerCase(); } catch (e) { return '기타'; }
  if (host.includes('blog.naver')) return '네이버 블로그';
  if (host.includes('cafe.naver')) return '네이버 카페';
  if (host.includes('place.naver') || host.includes('map.naver') || host.includes('m.place')) return '네이버 플레이스';
  if (host.includes('ader.naver') || host.includes('adcr.naver')) return '네이버 광고';
  if (host.includes('naver')) return '네이버 검색';
  if (host.includes('google')) return '구글 검색';
  if (host.includes('instagram')) return '인스타그램';
  if (host.includes('youtube') || host.includes('youtu.be')) return '유튜브';
  if (host.includes('daum') || host.includes('kakao')) return '다음/카카오';
  if (host.includes('facebook') || host.includes('fb.com')) return '페이스북';
  if (host.includes('soomgo')) return '숨고';
  if (host.includes('qplace')) return '큐플레이스';
  if (host.includes('band.us')) return '네이버 밴드';
  return host; // 기타 사이트는 도메인 그대로
}
function extractKeyword(ref, utm) {
  if (utm && utm.utm_term) return utm.utm_term;
  if (!ref) return '';
  try {
    const u = new URL(ref);
    return u.searchParams.get('query') || u.searchParams.get('q') || u.searchParams.get('keyword') || '';
  } catch (e) { return ''; }
}

/* ---------- 세션(관리자) ---------- */
function getSessions() {
  const s = readJson('sessions.json', {});
  let changed = false;
  const now = Date.now();
  for (const k of Object.keys(s)) if (now - s[k].created > SESSION_TTL) { delete s[k]; changed = true; }
  if (changed) writeJson('sessions.json', s);
  return s;
}
function isAdmin(req) {
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/sb_admin=([a-f0-9]{48})/);
  if (!m) return false;
  return !!getSessions()[m[1]];
}

/* ---------- HTTP 유틸 ---------- */
function send(res, code, body, headers) {
  const h = Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, headers || {});
  res.writeHead(code, h);
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}
function readBody(req, maxBytes) {
  const limit = maxBytes || 200000;
  return new Promise((resolve, reject) => {
    let buf = '';
    req.on('data', c => { buf += c; if (buf.length > limit) { reject(new Error('too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(buf ? JSON.parse(buf) : {}); } catch (e) { reject(e); } });
  });
}
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.webp': 'image/webp' };
function serveFile(res, base, rel) {
  const p = path.normalize(path.join(base, rel));
  if (!p.startsWith(base)) return send(res, 403, { error: 'forbidden' });
  if (!fs.existsSync(p) || !fs.statSync(p).isFile()) return send(res, 404, '<h1>404</h1>', { 'Content-Type': 'text/html; charset=utf-8' });
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
}
function esc(s) { return String(s == null ? '' : s); }
function clip(s, n) { return esc(s).slice(0, n); }

/* ---------- 통계 집계 ---------- */
function buildStats(days) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1)).getTime();
  const visits = readVisits(start);
  const leads = readJson('leads.json', []).filter(l => l.t >= start);

  const dayKey = t => { const d = new Date(t); return `${d.getMonth() + 1}/${d.getDate()}`; };
  const daily = [];
  const dayIndex = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1) + i);
    const k = `${d.getMonth() + 1}/${d.getDate()}`;
    dayIndex[k] = daily.length;
    daily.push({ d: k, visits: 0, uniq: 0, leads: 0, _sids: new Set() });
  }
  const channels = {}, keywords = {}, referrers = {}, pages = {}, allSids = new Set();
  for (const v of visits) {
    const k = dayKey(v.t);
    if (dayIndex[k] == null) continue;
    const row = daily[dayIndex[k]];
    row.visits++; row._sids.add(v.sid); allSids.add(v.sid);
    channels[v.ch] = channels[v.ch] || { visits: 0, leads: 0 }; channels[v.ch].visits++;
    if (v.kw) keywords[v.kw] = (keywords[v.kw] || 0) + 1;
    if (v.ref) { let h = v.ref; try { h = new URL(v.ref).hostname; } catch (e) {} referrers[h] = (referrers[h] || 0) + 1; }
    pages[v.path] = (pages[v.path] || 0) + 1;
  }
  const leadCats = {};
  for (const l of leads) {
    const k = dayKey(l.t);
    if (dayIndex[k] != null) daily[dayIndex[k]].leads++;
    const ch = l.first && l.first.ch ? l.first.ch : '직접 유입';
    channels[ch] = channels[ch] || { visits: 0, leads: 0 }; channels[ch].leads++;
    for (const c of (l.cats || [])) leadCats[c] = (leadCats[c] || 0) + 1;
  }
  for (const row of daily) { row.uniq = row._sids.size; delete row._sids; }
  const top = (obj, n) => Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, n);
  const todayRow = daily[daily.length - 1] || { visits: 0, leads: 0 };
  const totalVisits = daily.reduce((s, r) => s + r.visits, 0);
  const totalLeads = daily.reduce((s, r) => s + r.leads, 0);
  return {
    days, daily,
    channels: Object.entries(channels).map(([name, o]) => ({ name, visits: o.visits, leads: o.leads })).sort((a, b) => b.visits - a.visits).slice(0, 10),
    keywords: top(keywords, 15).map(([kw, n]) => ({ kw, n })),
    referrers: top(referrers, 10).map(([ref, n]) => ({ ref, n })),
    pages: top(pages, 10).map(([p, n]) => ({ path: p, n })),
    leadCats: Object.entries(leadCats).map(([cat, n]) => ({ cat, n })).sort((a, b) => b.n - a.n),
    totals: {
      todayVisits: todayRow.visits, todayLeads: todayRow.leads,
      visits: totalVisits, uniq: allSids.size, leads: totalLeads,
      conv: totalVisits ? +(totalLeads / totalVisits * 100).toFixed(2) : 0,
    },
  };
}

/* ---------- 라우터 ---------- */
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x');
  const p = u.pathname;
  try {
    /* --- 공개 API --- */
    if (req.method === 'POST' && p === '/api/track') {
      const b = await readBody(req);
      const utm = b.utm || {};
      appendVisit({
        t: Date.now(), sid: clip(b.sid, 40) || 'anon',
        path: clip(b.path, 200) || '/',
        ch: deriveChannel(clip(b.ref, 500), utm),
        kw: clip(extractKeyword(b.ref, utm), 100),
        ref: clip(b.ref, 300), utm,
        dev: /mobile|android|iphone/i.test(req.headers['user-agent'] || '') ? 'mobile' : 'pc',
      });
      return send(res, 204, '');
    }
    if (req.method === 'POST' && p === '/api/lead') {
      const b = await readBody(req);
      if (!b.phone || String(b.phone).replace(/\D/g, '').length < 9) return send(res, 400, { error: '연락처를 확인해 주세요.' });
      const leads = readJson('leads.json', []);
      const first = b.first || {};
      leads.push({
        id: (leads.length ? leads[leads.length - 1].id : 0) + 1,
        t: Date.now(),
        phone: clip(b.phone, 30), region: clip(b.region, 60), size: clip(b.size, 20),
        biz: clip(b.biz, 40), cats: (Array.isArray(b.cats) ? b.cats : []).map(c => clip(c, 20)).slice(0, 6),
        msg: clip(b.msg, 500),
        first: { ch: deriveChannel(clip(first.ref, 500), first.utm || {}), kw: clip(extractKeyword(first.ref, first.utm || {}), 100), ref: clip(first.ref, 300), landing: clip(first.landing, 200) },
        status: '신규', memo: '',
      });
      writeJson('leads.json', leads);
      return send(res, 200, { ok: true });
    }
    if (req.method === 'GET' && p === '/api/posts') {
      const posts = readJson('posts.json', []).filter(x => x.published)
        .sort((a, b) => b.created - a.created)
        .map(({ id, cat, title, created, views }) => ({ id, cat, title, created, views }));
      return send(res, 200, posts);
    }
    if (req.method === 'GET' && /^\/api\/posts\/\d+$/.test(p)) {
      const id = +p.split('/').pop();
      const posts = readJson('posts.json', []);
      const post = posts.find(x => x.id === id && x.published);
      if (!post) return send(res, 404, { error: 'not found' });
      post.views = (post.views || 0) + 1;
      writeJson('posts.json', posts);
      return send(res, 200, post);
    }

    /* --- 관리자 인증 --- */
    if (req.method === 'POST' && p === '/api/admin/login') {
      const b = await readBody(req);
      if (b.password !== ADMIN_PASSWORD) return send(res, 401, { error: '비밀번호가 올바르지 않습니다.' });
      const token = crypto.randomBytes(24).toString('hex');
      const sessions = getSessions();
      sessions[token] = { created: Date.now() };
      writeJson('sessions.json', sessions);
      return send(res, 200, { ok: true }, { 'Set-Cookie': `sb_admin=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax` });
    }
    if (req.method === 'POST' && p === '/api/admin/logout') {
      const cookie = req.headers.cookie || '';
      const m = cookie.match(/sb_admin=([a-f0-9]{48})/);
      if (m) { const s = getSessions(); delete s[m[1]]; writeJson('sessions.json', s); }
      return send(res, 200, { ok: true }, { 'Set-Cookie': 'sb_admin=; Path=/; Max-Age=0' });
    }

    /* --- 관리자 API (인증 필수) --- */
    if (p.startsWith('/api/admin/')) {
      if (!isAdmin(req)) return send(res, 401, { error: 'unauthorized' });

      if (req.method === 'GET' && p === '/api/admin/me') return send(res, 200, { ok: true });

      /* 사이트 콘텐츠 (CMS) */
      if (req.method === 'GET' && p === '/api/admin/content') return send(res, 200, getContent());
      if (req.method === 'PUT' && p === '/api/admin/content') {
        const b = await readBody(req);
        const cur = getContent();
        const next = {
          site: Object.assign({}, cur.site, b.site || {}),
          hero: Object.assign({}, cur.hero, b.hero || {}),
          trust: Array.isArray(b.trust) && b.trust.length ? b.trust.slice(0, 6) : cur.trust,
          portfolio: Array.isArray(b.portfolio) ? b.portfolio.slice(0, 12) : cur.portfolio,
          reviews: Array.isArray(b.reviews) ? b.reviews.slice(0, 12) : cur.reviews,
        };
        writeJson('content.json', next);
        return send(res, 200, { ok: true });
      }
      /* 사진 업로드 (base64 dataURL) */
      if (req.method === 'POST' && p === '/api/admin/upload') {
        const b = await readBody(req, 9 * 1024 * 1024);
        const m = /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/.exec(b.data || '');
        if (!m) return send(res, 400, { error: 'PNG/JPG/WebP 이미지만 업로드할 수 있습니다.' });
        const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
        const buf = Buffer.from(m[2], 'base64');
        if (buf.length > 6 * 1024 * 1024) return send(res, 400, { error: '6MB 이하 이미지만 가능합니다.' });
        const updir = path.join(DATA, 'uploads');
        fs.mkdirSync(updir, { recursive: true });
        const fname = Date.now() + '-' + crypto.randomBytes(4).toString('hex') + '.' + ext;
        fs.writeFileSync(path.join(updir, fname), buf);
        return send(res, 200, { ok: true, url: '/uploads/' + fname });
      }

      if (req.method === 'GET' && p === '/api/admin/stats') {
        const days = Math.min(365, Math.max(1, +(u.searchParams.get('days') || 30)));
        return send(res, 200, buildStats(days));
      }
      if (req.method === 'GET' && p === '/api/admin/leads') {
        return send(res, 200, readJson('leads.json', []).slice().reverse());
      }
      if (req.method === 'GET' && p === '/api/admin/leads.csv') {
        const rows = [['ID', '일시', '연락처', '지역', '평수', '업종', '관심서비스', '유입채널', '검색어', '랜딩', '상태', '메모']];
        for (const l of readJson('leads.json', [])) {
          rows.push([l.id, new Date(l.t).toLocaleString('ko-KR'), l.phone, l.region, l.size, l.biz,
            (l.cats || []).join('|'), l.first && l.first.ch || '', l.first && l.first.kw || '', l.first && l.first.landing || '', l.status, l.memo]);
        }
        const csv = '﻿' + rows.map(r => r.map(c => `"${String(c == null ? '' : c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
        return send(res, 200, csv, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="spacebridge-leads.csv"' });
      }
      if (req.method === 'PATCH' && /^\/api\/admin\/leads\/\d+$/.test(p)) {
        const id = +p.split('/').pop();
        const b = await readBody(req);
        const leads = readJson('leads.json', []);
        const l = leads.find(x => x.id === id);
        if (!l) return send(res, 404, { error: 'not found' });
        if (b.status != null) l.status = clip(b.status, 20);
        if (b.memo != null) l.memo = clip(b.memo, 1000);
        writeJson('leads.json', leads);
        return send(res, 200, { ok: true });
      }
      if (req.method === 'DELETE' && /^\/api\/admin\/leads\/\d+$/.test(p)) {
        const id = +p.split('/').pop();
        const leads = readJson('leads.json', []).filter(x => x.id !== id);
        writeJson('leads.json', leads);
        return send(res, 200, { ok: true });
      }
      if (req.method === 'GET' && p === '/api/admin/posts') {
        return send(res, 200, readJson('posts.json', []).sort((a, b) => b.created - a.created));
      }
      if (req.method === 'POST' && p === '/api/admin/posts') {
        const b = await readBody(req);
        if (!b.title) return send(res, 400, { error: '제목을 입력하세요.' });
        const posts = readJson('posts.json', []);
        const id = posts.reduce((m, x) => Math.max(m, x.id), 0) + 1;
        posts.push({ id, cat: clip(b.cat, 20) || '창업 가이드', title: clip(b.title, 200), body: clip(b.body, 20000), published: b.published !== false, views: 0, created: Date.now(), updated: Date.now() });
        writeJson('posts.json', posts);
        return send(res, 200, { ok: true, id });
      }
      if (req.method === 'PUT' && /^\/api\/admin\/posts\/\d+$/.test(p)) {
        const id = +p.split('/').pop();
        const b = await readBody(req);
        const posts = readJson('posts.json', []);
        const post = posts.find(x => x.id === id);
        if (!post) return send(res, 404, { error: 'not found' });
        if (b.title != null) post.title = clip(b.title, 200);
        if (b.cat != null) post.cat = clip(b.cat, 20);
        if (b.body != null) post.body = clip(b.body, 20000);
        if (b.published != null) post.published = !!b.published;
        post.updated = Date.now();
        writeJson('posts.json', posts);
        return send(res, 200, { ok: true });
      }
      if (req.method === 'DELETE' && /^\/api\/admin\/posts\/\d+$/.test(p)) {
        const id = +p.split('/').pop();
        writeJson('posts.json', readJson('posts.json', []).filter(x => x.id !== id));
        return send(res, 200, { ok: true });
      }
      return send(res, 404, { error: 'not found' });
    }

    /* --- 정적 파일 --- */
    if (req.method === 'GET') {
      if (p === '/admin' || p === '/admin/') return serveFile(res, ADMIN_DIR, 'admin.html');
      if (p.startsWith('/admin/')) return serveFile(res, ADMIN_DIR, p.slice(7));
      if (p.startsWith('/uploads/')) return serveFile(res, path.join(DATA, 'uploads'), p.slice(9));
      if (p === '/' || p === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        return res.end(renderHome());
      }
      return serveFile(res, PUB, p.slice(1));
    }
    return send(res, 405, { error: 'method not allowed' });
  } catch (e) {
    return send(res, 500, { error: 'server error' });
  }
});

server.listen(PORT, () => {
  console.log(`공간브릿지 서버 실행 중 → http://localhost:${PORT}`);
  console.log(`관리자 페이지        → http://localhost:${PORT}/admin`);
  if (ADMIN_PASSWORD === 'spacebridge2026!') console.log('⚠ 기본 관리자 비밀번호 사용 중 — 배포 전 ADMIN_PASSWORD 환경변수로 변경하세요.');
});
