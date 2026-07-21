// 데이터 접근 계층 — 나중에 Postgres로 이전 시 이 파일만 교체하면 됨.
'use strict';
const { DatabaseSync } = require('node:sqlite');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');

function openDb(path = join(__dirname, 'data.sqlite')) {
  const db = new DatabaseSync(path);
  db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  db.exec(readFileSync(join(__dirname, 'schema.sql'), 'utf8'));
  return db;
}

// 접수번호: SB-YYYYMMDD-NNN (당일 순번)
function nextReceiptNo(db) {
  const d = new Date();
  const ymd = d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  const prefix = 'SB-' + ymd + '-';
  const row = db.prepare(
    "SELECT COUNT(*) n FROM leads WHERE receipt_no LIKE ?"
  ).get(prefix + '%');
  return prefix + String(row.n + 1).padStart(3, '0');
}

function logPrivacy(db, action, subject, detail, actor) {
  db.prepare('INSERT INTO privacy_log(action,subject,detail,actor) VALUES(?,?,?,?)')
    .run(action, subject || '', detail || '', actor || 'system');
}

// 상담 접수: 고객 + 상담 레코드 생성, 접수번호 반환 (동의는 분리 저장)
function createLead(db, p) {
  const retain = new Date();
  retain.setFullYear(retain.getFullYear() + 1); // 기본 보유 1년
  const retainUntil = retain.toISOString().slice(0, 10);
  const tx = db.prepare.bind(db);
  db.exec('BEGIN');
  try {
    const cust = tx(
      `INSERT INTO customers(name,phone,region,business_type,source,
         consent_service,consent_thirdparty,consent_at,retain_until)
       VALUES(?,?,?,?,?,?,?,datetime('now','localtime'),?)`
    ).run(p.name, p.phone, p.region || '', p.business_type || '', p.source || 'direct',
          p.consent_service ? 1 : 0, p.consent_thirdparty ? 1 : 0, retainUntil);
    const customerId = cust.lastInsertRowid;
    const receiptNo = nextReceiptNo(db);
    tx(`INSERT INTO leads(receipt_no,customer_id,categories,message,desired_date,desired_time)
        VALUES(?,?,?,?,?,?)`)
      .run(receiptNo, customerId, (p.categories || []).join(','), p.message || '',
           p.desired_date || '', p.desired_time || '');
    logPrivacy(db, '수집', receiptNo, `상담접수 분야:${(p.categories||[]).join(',')}`, 'site');
    if (p.consent_thirdparty)
      logPrivacy(db, '제3자제공동의', receiptNo, '파트너 연결 동의', 'site');
    db.exec('COMMIT');
    return { receiptNo, customerId };
  } catch (e) { db.exec('ROLLBACK'); throw e; }
}

function listLeads(db, { status, q } = {}) {
  let sql = `SELECT l.*, c.name, c.phone, c.region, c.business_type,
                    c.consent_thirdparty, c.source
             FROM leads l JOIN customers c ON c.id = l.customer_id`;
  const w = [], a = [];
  if (status) { w.push('l.status = ?'); a.push(status); }
  if (q) { w.push('(c.name LIKE ? OR c.phone LIKE ? OR l.receipt_no LIKE ?)');
           a.push('%'+q+'%','%'+q+'%','%'+q+'%'); }
  if (w.length) sql += ' WHERE ' + w.join(' AND ');
  sql += ' ORDER BY l.created_at DESC LIMIT 500';
  return db.prepare(sql).all(...a);
}

function updateLeadStatus(db, id, status, actor) {
  db.prepare("UPDATE leads SET status=?, updated_at=datetime('now','localtime') WHERE id=?")
    .run(status, id);
  db.prepare('INSERT INTO audit_log(action,entity,entity_id) VALUES(?,?,?)')
    .run('status:' + status, 'lead', id);
}

function stats(db) {
  const g = (s) => db.prepare('SELECT COUNT(*) n FROM leads WHERE status=?').get(s).n;
  return {
    total: db.prepare('SELECT COUNT(*) n FROM leads').get().n,
    신규: g('신규'), 연결: g('연결'), 계약: g('계약'), 완료: g('완료'),
    partners: db.prepare('SELECT COUNT(*) n FROM partners').get().n,
  };
}

// 제휴업체
function createPartner(db, p) {
  return db.prepare(
    `INSERT INTO partners(company,contact_name,phone,email,fields,regions,verify_status,fee_terms,memo)
     VALUES(?,?,?,?,?,?,?,?,?)`
  ).run(p.company, p.contact_name||'', p.phone||'', p.email||'',
        (p.fields||[]).join(','), (p.regions||[]).join(','),
        p.verify_status||'미검증', p.fee_terms||'', p.memo||'').lastInsertRowid;
}
function listPartners(db) {
  return db.prepare('SELECT * FROM partners ORDER BY created_at DESC').all();
}

module.exports = {
  openDb, nextReceiptNo, logPrivacy, createLead, listLeads,
  updateLeadStatus, stats, createPartner, listPartners,
};
