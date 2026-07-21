// 공간브릿지 운영 백오피스 서버 (Node http 내장, 외부 의존성 0)
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const db = require('./db');
const auth = require('./auth');

const PORT = process.env.PORT || 4700;
const DB = db.openDb(process.env.SB_DB || path.join(__dirname, 'data.sqlite'));

// ---- rate limit (IP+경로 분당) ----
const hits = new Map();
function limited(key, max, windowMs = 60000) {
  const now = Date.now(); const rec = hits.get(key) || { n: 0, t: now };
  if (now - rec.t > windowMs) { rec.n = 0; rec.t = now; }
  rec.n++; hits.set(key, rec); return rec.n > max;
}

function send(res, code, data, headers = {}) {
  const body = typeof data === 'string' ? data : JSON.stringify(data);
  res.writeHead(code, { 'Content-Type': typeof data === 'string'
    ? 'text/html; charset=utf-8' : 'application/json; charset=utf-8', ...headers });
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve) => {
    let b = ''; req.on('data', c => { b += c; if (b.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(b ? JSON.parse(b) : {}); } catch { resolve({}); } });
  });
}
function currentUser(req) {
  const c = auth.parseCookies(req.headers.cookie);
  return auth.verify(c.sb_session);
}
function requireAuth(req, res) {
  const u = currentUser(req);
  if (!u) { send(res, 401, { error: '로그인이 필요합니다' }); return null; }
  return u;
}

const CORS_ORIGIN = process.env.SB_CORS_ORIGIN || 'https://gongganbridge.com';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;
  const ip = req.socket.remoteAddress || 'x';

  // 공개 상담 접수(/api/lead)만 교차출처 허용 — 사이트 폼에서 직접 POST
  if (p === '/api/lead') {
    res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  }

  try {
    // ---- 공개 API: 상담 접수 (사이트 폼 → DB) ----
    if (p === '/api/lead' && req.method === 'POST') {
      if (limited('lead:' + ip, 10)) return send(res, 429, { error: '잠시 후 다시 시도해주세요' });
      const body = await readBody(req);
      if (!body.name || !body.phone) return send(res, 400, { error: '이름·연락처는 필수입니다' });
      if (!body.consent_service) return send(res, 400, { error: '상담 동의가 필요합니다' });
      const { receiptNo } = db.createLead(DB, body);
      return send(res, 200, { ok: true, receiptNo });
    }

    // ---- 로그인 ----
    if (p === '/api/login' && req.method === 'POST') {
      if (limited('login:' + ip, 8)) return send(res, 429, { error: '잠시 후 다시 시도' });
      const { email, password } = await readBody(req);
      const user = DB.prepare('SELECT * FROM users WHERE email=?').get(email || '');
      if (!user || !auth.verifyPw(password || '', user.pw_hash))
        return send(res, 401, { error: '이메일 또는 비밀번호가 틀립니다' });
      const token = auth.sign({ uid: user.id, role: user.role, exp: Date.now() + 12 * 3600e3 });
      return send(res, 200, { ok: true, email: user.email, role: user.role },
        { 'Set-Cookie': `sb_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=43200` });
    }
    if (p === '/api/logout' && req.method === 'POST') {
      return send(res, 200, { ok: true }, { 'Set-Cookie': 'sb_session=; Path=/; Max-Age=0' });
    }
    if (p === '/api/me') {
      const u = currentUser(req);
      return send(res, 200, { user: u ? { role: u.role } : null });
    }

    // ---- 관리자 API (인증 필요) ----
    if (p === '/api/leads' && req.method === 'GET') {
      if (!requireAuth(req, res)) return;
      return send(res, 200, { leads: db.listLeads(DB,
        { status: url.searchParams.get('status') || '', q: url.searchParams.get('q') || '' }) });
    }
    if (p === '/api/lead/status' && req.method === 'POST') {
      const u = requireAuth(req, res); if (!u) return;
      const { id, status } = await readBody(req);
      db.updateLeadStatus(DB, id, status, u.uid);
      return send(res, 200, { ok: true });
    }
    if (p === '/api/stats' && req.method === 'GET') {
      if (!requireAuth(req, res)) return;
      return send(res, 200, db.stats(DB));
    }
    if (p === '/api/partners' && req.method === 'GET') {
      if (!requireAuth(req, res)) return;
      return send(res, 200, { partners: db.listPartners(DB) });
    }
    if (p === '/api/partners' && req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      const id = db.createPartner(DB, await readBody(req));
      return send(res, 200, { ok: true, id });
    }
    if (p === '/api/privacy-log' && req.method === 'GET') {
      if (!requireAuth(req, res)) return;
      return send(res, 200, { log: DB.prepare('SELECT * FROM privacy_log ORDER BY at DESC LIMIT 300').all() });
    }

    // ---- 3단계: 정산 ----
    if (p === '/api/connect' && req.method === 'POST') {   // 상담→파트너 연결
      if (!requireAuth(req, res)) return;
      try { const id = db.createConnection(DB, await readBody(req)); return send(res, 200, { ok: true, id }); }
      catch (e) { return send(res, 400, { error: e.message }); }
    }
    if (p === '/api/connections' && req.method === 'GET') {
      if (!requireAuth(req, res)) return;
      return send(res, 200, { connections: db.listConnections(DB) });
    }
    if (p === '/api/settlement' && req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      return send(res, 200, { ok: true, ...db.createSettlement(DB, await readBody(req)) });
    }
    if (p === '/api/settlement/paid' && req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      const { id, paid_status } = await readBody(req);
      db.setSettlementPaid(DB, id, paid_status); return send(res, 200, { ok: true });
    }
    if (p === '/api/settlements' && req.method === 'GET') {
      if (!requireAuth(req, res)) return;
      return send(res, 200, { settlements: db.listSettlements(DB, { month: url.searchParams.get('month') || '' }) });
    }
    if (p === '/api/settlements/close' && req.method === 'GET') {
      if (!requireAuth(req, res)) return;
      const month = url.searchParams.get('month') || new Date().toISOString().slice(0, 7);
      return send(res, 200, db.monthlyClose(DB, month));
    }
    if (p === '/api/settlements/csv' && req.method === 'GET') {
      if (!requireAuth(req, res)) return;
      const month = url.searchParams.get('month') || new Date().toISOString().slice(0, 7);
      return send(res, 200, db.settlementsCsv(DB, month),
        { 'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="settlement-${month}.csv"` });
    }

    // ---- 4단계: 마케팅 + 대시보드 ----
    if (p === '/api/dashboard' && req.method === 'GET') {
      if (!requireAuth(req, res)) return;
      return send(res, 200, db.dashboard(DB));
    }
    if (p === '/api/content' && req.method === 'GET') {
      if (!requireAuth(req, res)) return;
      return send(res, 200, { content: db.listContent(DB) });
    }
    if (p === '/api/content' && req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      const id = db.addContent(DB, await readBody(req)); return send(res, 200, { ok: true, id });
    }
    if (p === '/api/content/status' && req.method === 'POST') {
      if (!requireAuth(req, res)) return;
      const { id, status } = await readBody(req);
      db.setContentStatus(DB, id, status); return send(res, 200, { ok: true });
    }

    // ---- 정적: /admin 콘솔 ----
    if (p === '/admin' || p === '/admin/') {
      return send(res, 200, fs.readFileSync(path.join(__dirname, 'public', 'admin.html'), 'utf8'));
    }
    // ---- 용역계약서 양식 (직접입력·인쇄·PDF) ----
    if (p === '/contract' || p === '/contract.html') {
      return send(res, 200, fs.readFileSync(path.join(__dirname, 'public', 'contract.html'), 'utf8'));
    }
    if (p === '/health') return send(res, 200, { ok: true });

    send(res, 404, { error: 'not found' });
  } catch (e) {
    send(res, 500, { error: String(e.message || e) });
  }
});

if (require.main === module) {
  server.listen(PORT, () => console.log('backoffice on :' + PORT));
}
module.exports = { server, DB };
