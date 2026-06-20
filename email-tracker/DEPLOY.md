# clasp 터미널 배포 가이드 (브라우저 없이 코드 → Google 업로드)

> 아래 명령어를 위에서부터 순서대로 복사·실행하세요.
> `clasp login`, 권한 동의 단계에서만 브라우저 인증이 1회 필요합니다(그 외 전부 터미널).

```bash
# 0) Node.js(LTS) 설치 확인 — 없으면 https://nodejs.org 에서 설치
node -v
npm -v

# 1) clasp 전역 설치
npm install -g @google/clasp

# 2) clasp 로그인 (브라우저 1회 인증 → 토큰이 ~/.clasprc.json 에 저장됨)
clasp login

# 2-1) [필수] Apps Script API 켜기
#  → https://script.google.com/home/usersettings 에서 "Apps Script API"를 ON

# 3) 작업 폴더로 이동 후 프로젝트 생성
cd email-tracker
clasp create --title "Email Open Tracker" --type webapp --rootDir .

# 4) 코드 푸시 (로컬 Code.gs → 구글 프로젝트로 업로드)
clasp push

# 5) 최초 1회: setup() 실행해 로그 스프레드시트 자동 생성
#    (편집기 권한 동의가 필요하므로 아래로 편집기 열어 setup 실행 권장)
clasp open
#  → 편집기에서 함수 "setup" 선택 후 실행 → 권한 승인

# 6) 웹앱 배포 (익명 접근 허용해야 픽셀이 로드됨)
clasp deploy --description "v1 pixel tracker"

# 6-1) 배포 목록/‑URL 확인
clasp deployments
#  → "AKfycb..." 형태의 배포 ID 확인.
#    최종 픽셀 URL = https://script.google.com/macros/s/<배포ID>/exec

# 7) 발급된 /exec URL 을 스크립트에 저장 (편집기 또는 clasp run)
#    편집기에서:  setWebAppUrl("https://script.google.com/macros/s/<배포ID>/exec")  실행
```

## 배포 시 권한 설정 (중요)
`clasp deploy` 전, Apps Script 편집기 → 배포 → 배포 관리에서:
- **실행 주체(Execute as):** 나(Me)
- **액세스 권한(Who has access):** **모든 사용자(Anyone)**
  → 수신자가 익명으로 픽셀을 불러올 수 있어야 기록됩니다.

## 코드 수정 후 재배포 루프
```bash
clasp push
clasp deploy --deploymentId <기존배포ID> --description "v2"
# (같은 deploymentId 로 재배포해야 URL 이 유지됨)
```

## 동작 점검
1. `setup()` 실행 → 로그에 SHEET_ID / 스프레드시트 URL 출력 확인
2. `sendTrackedEmail("내other계정@gmail.com", "테스트", "<p>본문</p>", "나")` 실행
3. 받은 메일을 "이미지 표시"로 열람 → 스프레드시트 OpenLog 시트에 한 줄 기록 확인

## 한계 (정직 고지)
- Gmail 이미지 프록시(googleusercontent) 때문에 수신자 실제 IP 대신 Google IP 가 찍힐 수 있음.
- 수신자가 "이미지 자동 표시"를 꺼두면 추적 불가.
- 프록시 캐싱으로 첫 열람만 잡히고 재열람은 누락될 수 있음.
- 반드시 본인이 발송한 메일의 수신/열람 여부 확인 용도로만 사용하세요.
