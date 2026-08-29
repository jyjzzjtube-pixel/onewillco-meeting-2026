# 공간브릿지 운영 백오피스 — 설계 문서 (1단계 산출물)

> 목표: gongganbridge.com은 그대로 두고, 같은 서비스에 **데이터 저장 + 대표 전용 관리자화면(/admin)**을 붙인다.
> 개발자 없이 대표 혼자 매일 굴릴 수 있게, 단순하고 오래 가는 구조로.

## 1. 기술 스택 (확정)

| 층 | 선택 | 이유 |
|---|---|---|
| 앱 서버 | **Node.js (http 내장, 외부 의존성 0)** | 설치·컴파일 불필요, 유지보수 단순, 사이트 정적파일도 같이 서빙 |
| DB | **SQLite (Node 22 내장 `node:sqlite`)** | 파일 1개 = DB 전체. 계정·서버 비용 0, 백업은 파일 복사. 소상공인 규모에 최적 |
| 인증 | Node 내장 `crypto`(scrypt 해시 + HMAC 서명 쿠키) | 외부 라이브러리 없이 안전한 로그인 |
| 배포(운영) | 상시 켜진 소형 호스트 (Fly.io / Render 무료~저가 티어) | "우리 서버". 월 0~약 7천원 |

**왜 SQLite인가:** 월 상담 수백 건까지 SQLite로 충분합니다. 계정 가입·월 구독이 필요 없고, DB가 파일 하나라 백업·이전이 쉽습니다.
데이터가 크게 늘면(월 수천 건+) 그때 Postgres(Supabase)로 이전 — 데이터 접근을 `db.js` 한 파일로 몰아서, 이전 시 그 파일만 교체하면 되게 설계.

**월 비용:** 개발·테스트 0원. 운영 시 소형 호스트 0~7천원/월. 도메인은 이미 보유. **광고비 0원(무료 검색노출로 유입).**

## 2. 데이터 모델 (ERD 요약)

```
customers (고객)
  id, name, phone, region, business_type, source(유입경로), memo, created_at
  consent_service(필수동의), consent_thirdparty(제3자제공 동의·선택), consent_at, retain_until(보유기간)

leads (상담 접수)
  id, receipt_no(접수번호 SB-YYYYMMDD-NNN), customer_id→customers,
  categories(관심분야, 콤마), message, desired_date, desired_time,
  status(신규→기준안내→연결→계약→완료→보류), created_at, updated_at

partners (제휴업체)
  id, company, contact_name, phone, email, fields(분야), regions(가능지역),
  verify_status(미검증/검증완료), fee_terms(수수료약정), memo, created_at

connections (상담-파트너 연결)   ← 3단계(정산)에서 본격 사용
  id, lead_id→leads, partner_id→partners, category, status, created_at

settlements (정산)               ← 3단계
  id, connection_id→connections, amount, fee_rate, fee_amount,
  paid_status(미수/입금완료), settle_month(YYYY-MM), created_at

users (운영자 계정)
  id, email, pw_hash, role(admin/staff), created_at

privacy_log (개인정보 처리대장)   ← 법적 의무
  id, action(수집/이용/제3자제공/파기), subject(대상), detail, actor, at

audit_log (감사로그)
  id, user_id, action, entity, entity_id, at
```

## 3. 개인정보 설계 (개인정보보호법 준수)

- **최소수집**: 상담에 꼭 필요한 항목만(이름·연락처·지역·분야). 주민번호 등 민감정보 수집 안 함.
- **동의 분리**: ①서비스 상담(필수) ②파트너에 제3자 제공(선택) 동의를 **분리 저장**(`consent_service`, `consent_thirdparty`). 선택 미동의여도 상담 접수는 가능.
- **보유기간**: `retain_until` 저장. 목적 달성/기간 만료 시 파기 대상 표시.
- **접근권한(RBAC)**: `users.role`로 admin/staff 구분. 로그인 없으면 어떤 개인정보도 못 봄.
- **암호화**: 비밀번호 scrypt 해시. 운영 시 HTTPS 필수(도메인 인증서). DB 파일은 서버 내부에만.
- **파기 흐름**: 삭제요청·기간만료 → 레코드 파기 + `privacy_log`에 파기 기록.
- **처리대장**: 수집·이용·제3자제공·파기를 `privacy_log`에 자동 적재(분쟁·감사 대비).

## 4. 보안

- 로그인(scrypt), 세션은 HMAC 서명 쿠키(위조 불가), 로그아웃.
- 관리자 API는 세션 없으면 401. 공개 API는 상담 접수(`POST /api/lead`) 하나만.
- rate limit: IP·엔드포인트별 분당 제한(스팸 접수 방지).
- 감사로그: 운영자의 조회·수정·삭제를 `audit_log`에 기록.
- 백업: DB 파일 일 1회 복사(운영 호스트 크론 또는 대표가 주기적 다운로드).

## 5. 단계별 로드맵

| 단계 | 산출물 | 대표가 할 일 |
|---|---|---|
| **1. 설계** | 이 문서 | 없음 |
| **2. CRM** | DB스키마·서버·`/admin` 콘솔·상담폼→DB 저장·접수번호 | (없음, 로컬 검증까지 내가) |
| **3. 정산** | 연결·정산 원장, 월마감 집계, 세무 내보내기 | 실제 수수료율 알려주기 |
| **4. 마케팅+KPI** | 콘텐츠 캘린더·초안·후속이메일, 대시보드 | (없음) |
| **5. 무료 검색노출** | 서치어드바이저/서치콘솔 준비물·가이드, 블로그 글, 온페이지 최적화 | 네이버·구글 로그인 등록, 블로그 발행 |
| **최종 핸드오프** | 배포 안내 | DB호스트 계정·키, `npx vercel`/호스트 배포 |

각 단계는 **로컬에서 실제 구동·테스트 후 커밋**. 대표가 할 일은 맨 마지막에 "할 일 목록"으로 한 번에 정리해 요청.
