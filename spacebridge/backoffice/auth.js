// 인증 — 외부 라이브러리 없이 scrypt 해시 + HMAC 서명 쿠키
'use strict';
const crypto = require('node:crypto');

const SECRET = process.env.SB_SECRET || 'dev-only-secret-change-in-prod';

function hashPw(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const dk = crypto.scryptSync(pw, salt, 32).toString('hex');
  return salt + ':' + dk;
}
function verifyPw(pw, stored) {
  const [salt, dk] = String(stored).split(':');
  if (!salt || !dk) return false;
  const cand = crypto.scryptSync(pw, salt, 32).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(dk), Buffer.from(cand));
}

// 서명 세션 토큰: base64(payload).hmac
function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const mac = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return body + '.' + mac;
}
function verify(token) {
  if (!token || !token.includes('.')) return null;
  const [body, mac] = token.split('.');
  const good = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  if (mac.length !== good.length ||
      !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(good))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (p.exp && Date.now() > p.exp) return null;
    return p;
  } catch { return null; }
}
function parseCookies(header) {
  const out = {};
  (header || '').split(';').forEach(c => {
    const i = c.indexOf('='); if (i < 0) return;
    out[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim());
  });
  return out;
}

module.exports = { hashPw, verifyPw, sign, verify, parseCookies };
