# 공간브릿지 hotfix v62 — 라이브 점검·개선 패치

대상: gongganbridge.com / 공간브릿지.com (동일 사이트, 정본 canonical = gongganbridge.com)
점검 방식: 라이브 전체(12페이지·CSS 12·JS 13·이미지 45)를 그대로 복제해 1280/390 실측

---

## 🚨 P0 — 히어로 조건표 카드가 헤드라인·CTA를 덮던 결함 (수정 완료)

**증상**
- 데스크톱: 헤드라인 "비교 기준부터 정리하세요." 우측이 흰 카드에 가림
- **모바일(390px): 헤드라인 절반 잘림 + `상담요청` 버튼이 카드에 완전히 덮여 클릭 불가**

**원인**
`spacebridge-experience-v56.css`에 "히어로의 작은 내부 카드를 전역 중앙 모달로 바꾼다" 규칙이 들어가면서
`.sb46-sheet`가 `position:fixed; z-index:3002; inset:50% auto auto 50%`로 전환됨.
그런데 이 모달을 **여닫는 트리거·백드롭·닫기 버튼이 없어**(측정: openTriggers 0, closeBtn 없음, backdrop 없음)
카드가 페이지 로드 직후부터 화면 중앙에 영구 고정 → 히어로를 가림.

**조치** — `assets/spacebridge-hotfix-v62.css` 신규 추가 (기존 파일 미변경)
- 데스크톱: 카드를 히어로 우하단 흐름으로 원복 (`position:absolute`, 폭 400px)
- 태블릿·모바일(≤980px): `position:static`으로 본문 아래 정상 배치
- 모달 잔재(`.sb56-modal-backdrop`) 비표시

**검증 결과**
| 항목 | 수정 전 | 수정 후 |
|---|---|---|
| 데스크톱 H1 노출 | 우측 가림 | 전체 노출 ✅ |
| 모바일 H1 노출 | 절반 잘림 | 전체 노출 ✅ |
| 모바일 상담요청 버튼 | **클릭 막힘** | **클릭 가능** ✅ |

---

## ⚡ 성능 — 이미지 932KB 절감 (79%↓)
`post-1 / post-4 / post-5` 본문 히어로 JPG를 webp로 변환하고 `<picture>`로 우선 적용(JPG 폴백 유지).

| 파일 | 전 | 후 |
|---|---|---|
| photo-cafe | 418KB | 100KB |
| photo-home | 389KB | 78KB |
| photo-restaurant | 374KB | 71KB |

## 🔤 타이포 일관성 — 굵기 23종 → 6종
v31~v60을 거치며 누적된 `font-weight: 450/520/550/620/640/650/660/670/680/690/730/735/750/760/780/850` 등
비표준 값 94곳을 400/500/600/700/800로 스냅. 소수점 `font-size` 36곳 정수화.
→ 시각 회귀 없음(전후 스크린샷 대조 확인).

---

## 적용 방법
현재 사이트 폴더에 이 패치 파일들을 **같은 경로로 덮어쓰기** 한 뒤 재배포하세요.
```
assets/spacebridge-hotfix-v62.css   ← 신규
assets/*.css                        ← 굵기 정규화본으로 교체
img/photo-*.webp                    ← 신규
index.html, post-1/4/5.html         ← 교체 (CSS 링크·picture 태그 반영)
```
그 다음 배포: 사이트 폴더에서 `npx vercel --prod`

> index.html에는 아래 한 줄이 이미 추가돼 있습니다 (v60 CSS 바로 뒤):
> `<link rel="stylesheet" href="/assets/spacebridge-hotfix-v62.css?v=20260829-v62-herofix">`

---

## 점검했으나 손대지 않은 것 (판단 근거)
- **`.section.process` 숨김**: v58에서 `display:none !important` + JS `hidden=true`로 **의도적으로 숨긴 설계 결정**. 되살리지 않음.
- **서브페이지 H1 2개**: `spacebridge-platform-v45.js`가 브랜드 인트로를 주입하며 원본 h1을 `hidden`+`aria-hidden` 처리하는 구조. 화면·스크린리더상 실질 1개라 위험 감수하며 건드리지 않음.
- **폰트 448KB**: 서브셋 시 181KB(264KB 절감) 가능하나, 이후 콘텐츠에 새 글자가 들어가면 깨질 위험이 있어 보류. 이미 preload + `font-display:swap` 적용돼 있어 체감 지연은 낮음.
- **CSS 12개·JS 13개 누적**: 통합 시 로드 순서 의존으로 레이아웃이 깨질 위험. 별도 정리 작업으로 분리 권장.

## 이상 없음으로 확인된 항목
- 4개 도메인 전부 정상: gongganbridge.com / www / 공간브릿지.com / www.공간브릿지.com (모두 200)
- 이미지 alt 누락 0, 깨진 자산 0, 모바일 320/360/390/412 가로 넘침 0
- robots(Yeti 허용)·sitemap 25 URL·canonical·JSON-LD 정상
- 카피: 과장·허위 표현 없음("연결은 보장하지 않습니다", "평균가·최저가 약속하지 않습니다") — 표시광고법 관점 양호
