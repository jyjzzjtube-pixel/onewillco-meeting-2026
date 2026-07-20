# 브랜드 M&A 플랫폼 (mna.html) 배포 안내

## 영구 주소 (업데이트해도 바뀌지 않음)

https://claude.ai/code/artifact/3ab2b9a3-f007-425a-a74a-ee300513b9c6

- 기본은 비공개이며, 페이지 우측 상단 공유 메뉴에서 회계법인 대표 등에게 공유할 수 있습니다.
- 데이터는 열어본 사람의 브라우저에 각자 저장됩니다. 상대와 데이터를 맞추려면
  [데이터 관리] → JSON 내보내기/불러오기로 주고받으세요.

## 업데이트 절차 (Claude Code 세션에서)

1. `mna.html` 수정 후 커밋·푸시 (브랜치 `claude/brand-mna-accounting-platform-vqg7nx`, PR #6)
2. 배포용 파일 생성 — `mna.html`에서 `<head>` 안의 `<title>`·`<style>`과 `<body>` 내용만 추출하고
   (`<!DOCTYPE>`·`<html>`·`<head>`·`<body>` 래퍼 제거), Chart.js CDN `<script src=…>` 태그를
   `chart.umd.min.js`(4.4.1) 전체를 담은 인라인 `<script>`로 치환한다.
3. Artifact 도구로 재게시하되, **반드시 `url` 파라미터에 위 영구 주소를 지정**한다.
   (지정하지 않으면 새 주소가 발급되어 링크가 바뀜)
