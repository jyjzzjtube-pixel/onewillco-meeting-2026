# 총감독 시정 1차 — 완성본 배포 안내

`spacebridge/live-patch/site/` = gongganbridge.com **전체 교체용 완성 사이트**입니다.
2026-07-21 라이브 원본(외부 CSS 5종 포함 전체)을 내려받아 시정 명령 1차를 적용하고 실측 검증을 마쳤습니다.
이 폴더를 통째로 올리면 끝 — 부분 수정 불필요.

## 배포 방법 (Codex 없이, 내 PC에서 2분)
Vercel로 배포하던 그 PC에서:
1. 이 폴더(또는 전달받은 gongganbridge-fix-v1.zip 압축 해제 폴더)를 연다
2. 폴더 안에서 주소창에 `cmd` 입력 → 터미널 열림
3. `npx vercel --prod` 입력
   - "Link to existing project?" → **Y** → 기존 gongganbridge 프로젝트 선택
   - 나머지는 Enter
4. 끝나면 https://gongganbridge.com 새로고침(Ctrl+F5)으로 확인

## 적용된 시정 (명령 1차 전체)
1. **토큰 통일** — 글자 25종→6종(12/14/16/20/28/40), 굵기 19종→2종(400/800), 본문색 45종→4색, radius 10/16px. clamp()·color-mix()·외부 CSS 5종까지 전부 치환. Arial 누수 제거.
2. **유령 섹션 5개 삭제** — trust/solution/howwework/package/honest.
3. **히어로** — 문제 합성 이미지 제거→토큰 브릿지 그래픽 임시 적용, CTA "내 조건 30초 계산하기"+"비교 기준표 무료로 받기", 부제 이득 문장, "상담신청" 문구 전 사이트 0개.
4. **중복 밴드 정리** — 스타일 누락 top-route 내비 삭제, 중복 #categories 섹션(1,267px) 삭제·앵커 재지정.

## 배포 전 자체 확인값 (로컬 렌더 실측)
- font-size 6종 / weight 2종 / 본문색 4색 이외: **0개**
- 높이 0px 섹션: **0개** · "상담신청": **0개**
- 홈 높이 **8,071px** (기존 9,369px, 기준 9,000 이하)
- 모바일 390px 가로 스크롤: index/calc/guide/post/privacy 전부 **없음**

## 남은 것 (2차)
- 히어로 실사 v2 이미지(⓪-A 결과물) 도착 시 교체
- 비용근거·업무제휴·푸터 리디자인(spacebridge/redesign/ 3종) 적용
