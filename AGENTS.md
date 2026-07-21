# 원윌앤코x구름랩스 브랜드 M&A 플랫폼 — AI 에이전트 데이터 기입 가이드

이 저장소의 `mna.html`은 브랜드 M&A 플랫폼이다.
영구 주소: https://jyjzzjtube-pixel.github.io/onewillco-meeting-2026/mna.html

에이전트(클로드코드·코덱스)가 브랜드·매물·댓글·자료를 **자동 기입**하는 공식 경로는
`data/seed.json` 하나뿐이다. HTML을 고치지 말고 이 파일만 수정한다.
main에 머지되면 약 1분 내에 위 주소의 모든 접속자 화면에 자동 반영된다.

## 기입 절차 (필수 순서)

1. `data/seed.json` 수정 (아래 스키마)
2. `node tools/validate-seed.mjs` — ✅ 가 나와야 커밋 가능 (PR에서도 CI가 자동 실행되어 실패 시 머지 불가.
   검증 내용: id 형식·중복, ts 밀리초 범위, 사용자 계정명 사칭, 월수익>월매출 등 이상치, main 대비 삭제·재사용)
3. 브랜치에 커밋 → 푸시 → main으로 PR/머지

## 규칙

- **id는 절대 변경·재사용 금지.** id 형식은 검증기가 강제한다: `seed-brand-###` / `seed-listing-###` / `seed-c-###`(댓글) / `seed-d-###`(자료) / `seed-k-###`(체크리스트), ### 는 3자리 이상 숫자.
- 가능하면 항목에 `source: { "url": "...", "name": "네이버부동산", "fetchedAt": <epoch ms> }` 를 넣어 **어디서 언제 수집한 숫자인지** 남긴다.
- 기존 항목을 수정할 때는 같은 id를 유지한 채 필드 값만 바꾼다 (화면에서 해당 항목이 갱신됨).
- **삭제는 금지.** 항목을 지우면 사용자 화면에서도 사라질 수 있다. 빼고 싶으면 status만 바꾼다 (예: 매물 → "거래완료").
- 금액 단위는 **만원** 숫자 (예: 2.5억 → `25000`). 모르는 값은 `null`.
- `ts`는 epoch 밀리초. 셸에서: `date +%s%3N`
- 댓글 author는 실제 화면 사용자와 구분되게 `"AI비서"` 등을 쓴다 (사용자 계정명 `관리자`, `구름` 사칭 금지).
- 선택 필드: `trust`(숫자 신뢰도: `주장`|`자료확인`|`실사검증` — AI가 공식 자료로 대조 확인한 경우에만 `자료확인`),
  `nextAction`(다음 액션 텍스트), `nextDue`(기한 YYYY-MM-DD). 확실치 않으면 생략(주장으로 표시됨).
- **파일·사진 첨부(`files`)는 기입하지 말 것.** 사용자가 화면에서 직접 올리는 로컬 전용 필드다. AI는 공유가 필요한 자료를 `docs`(링크)로 넣는다.

## 스키마 + 예시

```json
{
  "brands": [
    {
      "id": "seed-brand-001",
      "corpName": "(주)에이스에프앤비",
      "tradeName": "포카드홀덤펍",
      "industry": "홀덤펍",
      "openDate": "2021-03-15",
      "branches": 14,
      "revenue": 320000,
      "profit": 41000,
      "askPrice": 180000,
      "status": "협상중",
      "manager": "진지윤",
      "memo": "직영 3 + 가맹 11",
      "comments": [
        { "id": "seed-c-001", "author": "AI비서", "text": "재무제표 3개년 수집 완료", "ts": 1784000000000 }
      ],
      "docs": [
        { "id": "seed-d-001", "name": "2025 재무제표", "url": "https://drive.google.com/...", "author": "AI비서", "ts": 1784000000000 }
      ],
      "checks": [
        { "id": "seed-k-001", "label": "재무제표 3개년", "done": false, "by": "", "ts": 0 }
      ]
    }
  ],
  "listings": [
    {
      "id": "seed-listing-001",
      "title": "포카드홀덤펍 강남역점",
      "brandId": "seed-brand-001",
      "region": "서울 강남구 역삼동",
      "industry": "홀덤펍",
      "price": 28000,
      "premium": 9000,
      "deposit": 5000,
      "rent": 380,
      "mRevenue": 5200,
      "mProfit": 1100,
      "size": 45,
      "floor": "2층",
      "status": "판매중",
      "link": "https://...",
      "desc": "역세권 도보 2분",
      "comments": [],
      "docs": []
    }
  ]
}
```

- brand.status: `검토중 | 협상중 | 실사중 | 인수완료 | 보류`
- listing.status: `판매중 | 협상중 | 계약진행 | 거래완료`
- `brandId`는 seed 안의 브랜드 id를 참조 (없으면 `""`)

## 배포형 웹앱(Apps Script)에 기입할 때

정적 페이지가 아니라 배포된 웹앱(`/exec` 주소)의 공유 DB에 넣으려면 doPost API 사용
(토큰은 Apps Script 프로젝트 설정 → 스크립트 속성 `API_TOKEN`):

```bash
curl -sL -X POST '<웹앱 /exec 주소>' -H 'Content-Type: application/json' -d '{
  "token": "<API_TOKEN>",
  "action": "applyOp",
  "op": { "type": "upsertListing", "listing": { "id": "seed-listing-002", "title": "…", "region": "…" } }
}'
```

op 종류: `upsertBrand {brand}` · `upsertListing {listing}` · `addComment {kind:'brand'|'listing', id, comment}` · `addDoc {kind, id, doc}` · `setCheck {kind, id, check}` (전체 목록은 `webapp/Code.gs`의 `applyOp_` 참고)

## 자동 계산 필드 (기입하지 말 것)

회수기간((양도가+권리금)÷월수익), 연수익률(월수익×12÷(양도가+권리금+보증금)), 이익률, 인수 배수(희망가÷영업이익),
딜 신호등(🟢🟡🔴), 이상치 경고는 화면에서 자동 계산된다. 원천 숫자(price·mProfit·deposit·revenue·profit·askPrice)만 정확히 기입하면 된다.
`checks`(실사 체크리스트)는 수집한 자료가 있으면 해당 항목을 `done: true`로 바꾸고 `by: "AI비서"`, `ts`를 채운다.
