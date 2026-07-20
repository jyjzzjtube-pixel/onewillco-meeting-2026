# 브랜드 M&A 플랫폼 — 웹앱 배포 (한 번만 하면 끝)

포카드 ERP처럼 **주소 하나로 접속하는 웹앱**입니다. 배포하면:
- 사장님·회계사 대표 누구든 같은 주소로 접속 → **같은 데이터**를 봅니다 (구글 드라이브에 저장)
- 채팅·자료·매물이 8초 안에 서로 화면에 반영됩니다
- 주소는 한 번 만들면 **업데이트해도 절대 바뀌지 않습니다**

## 방법 A — 복사·붙여넣기 (제일 쉬움, 10분)

1. https://script.google.com 접속 → **새 프로젝트**
2. 왼쪽 파일 목록에서:
   - `Code.gs` → 이 폴더의 `Code.gs` 내용을 전부 붙여넣기
   - **+ 버튼 → HTML** → 파일명 `index` → 이 폴더의 `index.html` 내용을 전부 붙여넣기
3. 프로젝트 이름: `원윌앤코 브랜드MA 플랫폼`
4. 오른쪽 위 **배포 → 새 배포**
   - 유형: **웹 앱**
   - 실행 계정: **나(배포자)**
   - 액세스 권한: **모든 사용자** ← 회계사가 구글 로그인 없이 접속하려면 필수
5. **배포** 클릭 → 권한 승인(내 드라이브에 DB 파일 생성용) → 나오는 `https://script.google.com/macros/s/…/exec` 주소가 **영구 주소**입니다.
6. 그 주소를 회계사 대표에게 보내면 끝.

## 방법 B — clasp (이메일 트래커 때와 동일)

```bash
npm install -g @google/clasp
clasp login
cd webapp
clasp create --type webapp --title "원윌앤코 브랜드MA 플랫폼"
clasp push
clasp deploy --description "v1"
```

## ⚠ 업데이트할 때 주소 안 바뀌게 하는 법 (중요)

코드를 고친 뒤에는 **배포 → 배포 관리 → 연필(수정) → 버전: 새 버전 → 배포**를 눌러야
기존 `/exec` 주소가 그대로 유지됩니다. "새 배포"를 새로 만들면 주소가 달라지니 주의.
(clasp는 `clasp push` 후 `clasp deploy -i <기존 배포 ID>`)

## 파일 안내

- `Code.gs` — 서버: 화면 서비스 + 공유 DB(드라이브의 `onewillco_mna_db.json`) 읽기/쓰기, 동시 편집 잠금 처리
- `index.html` — 화면: 저장소 루트의 `mna.html`과 동일 파일 (수정 시 `cp mna.html webapp/index.html`로 맞춘 뒤 재배포)
- 데이터 백업: 웹앱 [데이터 관리] 탭에서 JSON 내보내기, 또는 드라이브에서 `onewillco_mna_db.json` 직접 확인
