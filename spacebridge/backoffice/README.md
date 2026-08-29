# 공간브릿지 운영 백오피스 (2단계: CRM)

의존성 0 (Node 22 내장 http + SQLite). 로컬에서 바로 구동·테스트 가능.

## 로컬 실행
```bash
cd spacebridge/backoffice
node seed.js admin@gongganbridge.com <비밀번호>   # 운영자 계정 1회 생성
SB_SECRET=<임의문자열> node server.js             # http://localhost:4700/admin
```
- 관리자 콘솔: `http://localhost:4700/admin`
- 상담 접수 API(사이트 폼이 호출): `POST /api/lead`

## 테스트
```bash
node test.js     # 접수→저장→로그인→목록→상태변경→처리대장→rate limit, 10/10
```

## 구성
| 파일 | 역할 |
|---|---|
| `schema.sql` | DB 스키마(고객·상담·제휴·연결·정산·운영자·개인정보대장·감사) |
| `db.js` | 데이터 접근 계층 (Postgres 이전 시 이 파일만 교체) |
| `auth.js` | scrypt 해시 + HMAC 서명 쿠키 로그인 |
| `server.js` | API + `/admin` 서빙, rate limit |
| `public/admin.html` | 운영 콘솔(로그인·KPI·상담 파이프라인·검색) |
| `seed.js` | 운영자 계정 생성 |

## 사이트 상담폼 → DB 연결 (배포 시)
gongganbridge.com 상담폼 제출 시 아래로 POST:
```js
fetch('https://<백오피스주소>/api/lead', {
  method:'POST', headers:{'Content-Type':'application/json'},
  body: JSON.stringify({
    name, phone, region, business_type, categories:[...],
    message, desired_date, desired_time,
    consent_service:true,          // 필수 동의
    consent_thirdparty:true/false, // 파트너 제3자 제공(선택)
    source:'naver' // 유입경로
  })
})
// 응답 { ok:true, receiptNo:'SB-YYYYMMDD-NNN' } → 고객에게 접수번호 안내
```

## 운영 배포 (최종 핸드오프 시)
- 환경변수: `SB_SECRET`(세션 서명 키·필수), `SB_DB`(DB 파일 경로), `PORT`
- 상시 호스트(Fly.io/Render 등)에 올리고 DB 파일은 영구 볼륨에 저장, HTTPS 필수
- 백업: `data.sqlite` 파일 일 1회 복사

## 남은 단계
- 3단계: 정산 원장(연결·수수료·월마감) — connections/settlements 테이블 이미 준비됨
- 4단계: 마케팅 자동화 + KPI 대시보드
- 5단계: 무료 검색노출(네이버·구글)
