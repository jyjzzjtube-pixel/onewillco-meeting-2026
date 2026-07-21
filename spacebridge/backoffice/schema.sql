-- 공간브릿지 운영 백오피스 스키마 (SQLite)
-- 개인정보보호법: 동의 분리(consent_service/thirdparty), 보유기간(retain_until), 처리대장(privacy_log)

CREATE TABLE IF NOT EXISTS customers (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  phone         TEXT NOT NULL,
  region        TEXT,
  business_type TEXT,
  source        TEXT,                 -- 유입경로(naver/google/instagram/direct 등)
  memo          TEXT,
  consent_service    INTEGER NOT NULL DEFAULT 0,  -- 서비스 상담 동의(필수)
  consent_thirdparty INTEGER NOT NULL DEFAULT 0,  -- 파트너 제3자 제공 동의(선택)
  consent_at    TEXT,
  retain_until  TEXT,                 -- 보유기간 만료일(YYYY-MM-DD)
  created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS leads (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  receipt_no   TEXT UNIQUE NOT NULL,  -- SB-YYYYMMDD-NNN
  customer_id  INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  categories   TEXT,                  -- 관심분야(콤마)
  message      TEXT,
  desired_date TEXT,
  desired_time TEXT,
  status       TEXT NOT NULL DEFAULT '신규',  -- 신규/기준안내/연결/계약/완료/보류
  created_at   TEXT NOT NULL DEFAULT (datetime('now','localtime')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS partners (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  company      TEXT NOT NULL,
  contact_name TEXT,
  phone        TEXT,
  email        TEXT,
  fields       TEXT,                  -- 취급분야(콤마)
  regions      TEXT,                  -- 가능지역(콤마)
  verify_status TEXT NOT NULL DEFAULT '미검증',  -- 미검증/검증완료
  fee_terms    TEXT,                  -- 수수료 약정 메모
  memo         TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS connections (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id     INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  partner_id  INTEGER NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  category    TEXT,
  status      TEXT NOT NULL DEFAULT '전달',   -- 전달/수락/거절/계약/완료
  created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS settlements (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  connection_id INTEGER NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
  amount        INTEGER NOT NULL DEFAULT 0,   -- 계약금액(원)
  fee_rate      REAL NOT NULL DEFAULT 0,      -- 수수료율(%)
  fee_amount    INTEGER NOT NULL DEFAULT 0,   -- 수수료(원)
  paid_status   TEXT NOT NULL DEFAULT '미수',  -- 미수/입금완료
  settle_month  TEXT,                         -- YYYY-MM
  created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT UNIQUE NOT NULL,
  pw_hash    TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'admin',   -- admin/staff
  created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS privacy_log (   -- 개인정보 처리대장
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  action  TEXT NOT NULL,   -- 수집/이용/제3자제공/파기
  subject TEXT,            -- 대상(고객명/접수번호)
  detail  TEXT,
  actor   TEXT,            -- 처리자
  at      TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS audit_log (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id   INTEGER,
  action    TEXT,
  entity    TEXT,
  entity_id INTEGER,
  at        TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE INDEX IF NOT EXISTS idx_leads_status  ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_cust_phone    ON customers(phone);
