// 초기 운영자 계정 생성. 사용: node seed.js <email> <password>
'use strict';
const db = require('./db');
const auth = require('./auth');
const DB = db.openDb(process.env.SB_DB);
const email = process.argv[2] || 'admin@gongganbridge.com';
const pw = process.argv[3] || 'change-me-now';
const exists = DB.prepare('SELECT id FROM users WHERE email=?').get(email);
if (exists) { console.log('이미 존재:', email); process.exit(0); }
DB.prepare('INSERT INTO users(email,pw_hash,role) VALUES(?,?,?)')
  .run(email, auth.hashPw(pw), 'admin');
console.log('운영자 계정 생성:', email);
