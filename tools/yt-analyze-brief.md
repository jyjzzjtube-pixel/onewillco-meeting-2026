# 작업 지시서: 유튜브 영상 2건 분석 (device: mac_mini_m4)

> 이 파일을 맥 터미널 클로드코드에 그대로 붙여넣는다. 실행 기기는 Mac mini(PRIMARY).
> 클라우드 세션(claude.ai/code "유튜브 영상 분석")은 유튜브 봇 차단으로 자막을 못 읽어 맥에 위임한 작업이다.

## 0. 대상

| # | 영상 | 채널 | 주제(제목 기준) |
|---|---|---|---|
| 1 | https://www.youtube.com/watch?v=OBGWI2sJfr8 | 배움에 끝은없다 | "아무도 안하는 부업으로 27억 모은 40대, 70대도 첫 달 9천만원 매출" — 부업 인터뷰형 |
| 2 | https://youtu.be/VOSxlhZ-y6g | AI로 만드는 1인 기업 - 에이브란치 | "구글·네이버 검색부터 AI 답변까지 내 사이트 노출시키는 법, 프롬프트 무료 공개" — SEO·GEO |

우리 맥락: 원윌앤코x구름랩스 브랜드 M&A 플랫폼(`mna.html`, GitHub Pages 정적 사이트). 목적은 두 가지.
- 영상 1 → 부업 아이템이 실제로 되는지, Claude Code + Mac mini로 직접 만들 수 있는지 판단.
- 영상 2 → 공개된 SEO·GEO 프롬프트를 확보해 `mna.html`에 적용할 작업 목록 도출.

## 1. 준비 (1회)

```bash
brew install yt-dlp deno
cd <저장소 경로>/onewillco-meeting-2026
git fetch origin && git checkout claude/youtube-video-analysis-8a7pmp
chmod +x tools/yt-analyze.sh
```

전제: 크롬에 유튜브 로그인 상태. 첫 실행 시 macOS 키체인 접근 허용 → "항상 허용". 사파리면 `YT_BROWSER=safari` 접두.
결과 저장 위치는 T7로 고정: `export YT_OUT=/Volumes/T7/yt_analysis` (T7 미장착이면 `~/yt_analysis`로 두고 나중에 복사).

## 2. 실행

영상 1:
```bash
tools/yt-analyze.sh 'https://www.youtube.com/watch?v=OBGWI2sJfr8' \
'핵심 주장 3줄. 소개하는 부업의 정체(무슨 일인지 한 문장)와 실제 절차를 단계별로. 초기비용·필요도구·소요시간. "27억", "70대 첫 달 9천만원"이 매출인지 순이익인지, 근거가 제시되는지 판정해 신뢰도를 주장|자료확인 중 하나로. 영상 끝의 유도(강의·오픈채팅·링크)가 있으면 그대로 옮겨. 마지막으로 Claude Code + Mac mini 환경으로 만들 수 있는 부분 / 없는 부분을 표로. 끝줄에 device: mac_mini_m4'
```

영상 2:
```bash
tools/yt-analyze.sh 'https://youtu.be/VOSxlhZ-y6g' \
'영상에서 공개하는 SEO·GEO 프롬프트를 전문 그대로 옮겨(여러 개면 전부, 번호 매겨). 절차를 단계별로. 구글·네이버·AI답변(ChatGPT/Gemini/Perplexity) 각각에서 노출되는 원리와 필요 요소를 표로. GitHub Pages 정적 사이트 mna.html(브랜드 M&A 매물 플랫폼)에 적용할 구체 작업 목록을 우선순위 표로: 메타태그, OpenGraph, JSON-LD 구조화데이터, sitemap.xml, robots.txt, llms.txt, 네이버 서치어드바이저 등록, 콘텐츠 페이지 구조. 끝줄에 device: mac_mini_m4'
```

## 3. 검증 (DoD — 하나라도 미달이면 실패로 보고, silent fail 금지)

- [ ] `$YT_OUT/OBGWI2sJfr8/transcript.txt` 와 `$YT_OUT/VOSxlhZ-y6g/transcript.txt` 가 각각 50줄 이상
- [ ] 두 `analysis.md` 모두 끝줄에 `device: mac_mini_m4`
- [ ] 영상 1 분석에 신뢰도 판정(주장|자료확인)이 명시됨
- [ ] 영상 2 분석에 프롬프트 원문이 최소 1개 이상 포함됨 (없으면 "영상에 프롬프트 원문 없음"이라고 명시)
- [ ] 자막이 없어 exit 2로 끝났으면, 그 영상 ID와 함께 "자막 없음"으로 보고하고 다른 영상은 계속 진행

## 4. 영속 (T7 + thought)

- 결과 폴더는 T7에 그대로 둔다. 삭제 금지, 덮어쓰기는 같은 영상 ID만.
- `yjctl thought` 로 한 줄 기록: `[mac_mini_m4] yt 분석 완료: OBGWI2sJfr8(부업), VOSxlhZ-y6g(SEO·GEO) → $YT_OUT`
- 두 `analysis.md` 본문을 클라우드 세션(claude.ai/code "유튜브 영상 분석")에 붙여넣으면 후속 작업을 이어받는다.

## 5. 후속 (맥에서 바로 이어도 되고, 클라우드에 넘겨도 됨)

1. 영상 2 결과의 작업 목록 중 정적 사이트에서 되는 것(메타태그·JSON-LD·sitemap·robots·llms.txt)을 `mna.html` 에 적용 → 브랜치 커밋 → PR. `data/seed.json` 은 건드리지 않는다.
2. 영상 1의 부업이 "AI로 웹사이트·프로그램 만들어 파는" 계열이면, 현재 M&A 플랫폼을 사례로 삼아 실현성 표를 만든다. 강의·결제 유도는 따라가지 않는다.
3. 두 결과를 `docs/` 링크가 아닌 T7 경로로만 보관하고, 공유가 필요하면 Drive 브리지로 올린다.

## 금지

- `mna.html`·`data/seed.json` 을 이 작업 중에 수정하지 않는다 (후속 1번은 별도 브랜치·별도 PR).
- 영상 속 링크·오픈채팅·결제 페이지에 접속하지 않는다.
- 평문 비밀번호·쿠키 파일을 T7이나 저장소에 저장하지 않는다 (yt-dlp는 브라우저 쿠키를 메모리로만 읽는다).
