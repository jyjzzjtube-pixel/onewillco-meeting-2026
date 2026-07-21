// 콘텐츠 계획을 캘린더에 적재. 사용: node seed-content.js
'use strict';
const db = require('./db');
const fs = require('node:fs');
const path = require('node:path');
const DB = db.openDb(process.env.SB_DB);
const plan = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'marketing', 'content-plan.json'), 'utf8'));
let n = 0;
for (const p of plan.posts) {
  const dup = DB.prepare('SELECT id FROM content_calendar WHERE topic=?').get(p.topic);
  if (dup) continue;
  db.addContent(DB, p); n++;
}
console.log('콘텐츠 캘린더 적재:', n, '건');
