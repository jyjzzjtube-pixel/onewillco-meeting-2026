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

// ===== 3단계: 정산 원장 =====

// 상담을 파트너에게 연결 (제3자 제공 동의 확인)
function createConnection(db, { lead_id, partner_id, category }) {
  const lead = db.prepare(
    `SELECT l.id, c.consent_thirdparty, l.receipt_no
     FROM leads l JOIN customers c ON c.id=l.customer_id WHERE l.id=?`).get(lead_id);
  if (!lead) throw new Error('상담을 찾을 수 없습니다');
  if (!lead.consent_thirdparty) throw new Error('제3자 제공 미동의 상담은 연결할 수 없습니다');
  const id = db.prepare(
    'INSERT INTO connections(lead_id,partner_id,category) VALUES(?,?,?)'
  ).run(lead_id, partner_id, category || '').lastInsertRowid;
  logPrivacy(db, '제3자제공', lead.receipt_no, `파트너#${partner_id} 연결(${category||''})`, 'operator');
  db.prepare("UPDATE leads SET status='연결', updated_at=datetime('now','localtime') WHERE id=?").run(lead_id);
  return id;
}
function listConnections(db) {
  return db.prepare(
    `SELECT cn.*, l.receipt_no, cu.name AS customer, p.company AS partner
     FROM connections cn
     JOIN leads l ON l.id=cn.lead_id
     JOIN customers cu ON cu.id=l.customer_id
     JOIN partners p ON p.id=cn.partner_id
     ORDER BY cn.created_at DESC LIMIT 500`).all();
}

// 정산 생성: 수수료 = round(계약금액 * 수수료율%)
function createSettlement(db, { connection_id, amount, fee_rate, settle_month }) {
  const amt = Math.round(Number(amount) || 0);
  const rate = Number(fee_rate) || 0;
  const fee = Math.round(amt * rate / 100);
  const month = settle_month || new Date().toISOString().slice(0, 7);
  const id = db.prepare(
    `INSERT INTO settlements(connection_id,amount,fee_rate,fee_amount,settle_month)
     VALUES(?,?,?,?,?)`).run(connection_id, amt, rate, fee, month).lastInsertRowid;
  return { id, fee_amount: fee };
}
function setSettlementPaid(db, id, paid_status) {
  db.prepare('UPDATE settlements SET paid_status=? WHERE id=?').run(paid_status, id);
}
function listSettlements(db, { month } = {}) {
  let sql = `SELECT s.*, cn.category, l.receipt_no, cu.name AS customer, p.company AS partner
             FROM settlements s
             JOIN connections cn ON cn.id=s.connection_id
             JOIN leads l ON l.id=cn.lead_id
             JOIN customers cu ON cu.id=l.customer_id
             JOIN partners p ON p.id=cn.partner_id`;
  const a = [];
  if (month) { sql += ' WHERE s.settle_month=?'; a.push(month); }
  sql += ' ORDER BY s.created_at DESC LIMIT 1000';
  return db.prepare(sql).all(...a);
}

// 월마감: 파트너별·분야별·입금상태별 집계
function monthlyClose(db, month) {
  const rows = listSettlements(db, { month });
  const sum = (arr) => arr.reduce((n, r) => n + r.fee_amount, 0);
  const by = (key) => {
    const m = {};
    rows.forEach(r => { const k = r[key] || '(미지정)'; (m[k] = m[k] || { count: 0, amount: 0, fee: 0 });
      m[k].count++; m[k].amount += r.amount; m[k].fee += r.fee_amount; });
    return m;
  };
  return {
    month,
    count: rows.length,
    amount_total: rows.reduce((n, r) => n + r.amount, 0),
    fee_total: sum(rows),
    fee_paid: sum(rows.filter(r => r.paid_status === '입금완료')),
    fee_unpaid: sum(rows.filter(r => r.paid_status === '미수')),
    by_partner: by('partner'),
    by_category: by('category'),
  };
}

// 세무 제출용 CSV
function settlementsCsv(db, month) {
  const rows = listSettlements(db, { month });
  const head = ['정산월', '접수번호', '고객', '파트너', '분야', '계약금액', '수수료율(%)', '수수료', '입금상태', '생성일'];
  const esc = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const lines = [head.map(esc).join(',')];
  rows.forEach(r => lines.push([r.settle_month, r.receipt_no, r.customer, r.partner, r.category,
    r.amount, r.fee_rate, r.fee_amount, r.paid_status, (r.created_at || '').slice(0, 10)].map(esc).join(',')));
  return '﻿' + lines.join('\r\n'); // BOM: 엑셀 한글 깨짐 방지
}

module.exports = {
  openDb, nextReceiptNo, logPrivacy, createLead, listLeads,
  updateLeadStatus, stats, createPartner, listPartners,
  createConnection, listConnections, createSettlement, setSettlementPaid,
  listSettlements, monthlyClose, settlementsCsv,
};
