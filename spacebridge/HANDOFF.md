# 공간브릿지 이어서 작업 — 핸드오프 브리핑

> 새 대화방에서 이 파일을 먼저 읽으면 그대로 이어집니다. 작업 브랜치: `claude/spacebridge-customer-research-7by8zi` (PR #4)

## 지금까지 완성된 것 (전부 커밋됨)
1. **사이트** (`spacebridge/live-patch/site/`): 실사 히어로(한국 전용)·8개 분야·무료도구 7종·상담폼(백오피스 DB 연결 코드+제3자 동의 분리)·비용안내·FAQ·업무제휴·남색 푸터. 디자인 헌법(글자6·굵기2·색4·radius10/16·Pretendard·keep-all) 전 페이지 통과, 모바일 320~412 무넘침. SEO(robots Yeti·sitemap 10개·네이버/구글 인증 메타 슬롯).
2. **운영 백오피스** (`spacebridge/backoffice/`): Node 내장 http+SQLite, 의존성 0.
   - CRM(상담 DB·접수번호 SB-YYYYMMDD-NNN·운영콘솔 /admin·로그인·파이프라인·검색·제3자동의 분리)
   - 정산 원장(연결·수수료 건별·월마감·세무 CSV)
   - KPI 대시보드(전환·유입경로)
   - 마케팅(콘텐츠 캘린더·후속 이메일 템플릿)
   - 용역계약서(/contract HTML 인쇄·PDF + templates/용역계약서.docx)
   - 맥 원클릭 실행: `start.command`, 배포설정 Dockerfile·fly.toml·DEPLOY.md
   - 로컬 테스트 16/16 통과
3. **마케팅** (`spacebridge/marketing/`): 브랜드 스토리텔링(실적 숫자 없이)·블로그 글 5편·릴스5+카드뉴스·노출 알고리즘 실행맵·키워드맵·SEO 등록 가이드. 전부 --no-publish.

## 확정된 결정 (다시 묻지 말 것)
- 정본 주소 gongganbridge.com만(surge 중단). 디자인 헌법 고정. 이미지 실사·한국 전용(외국인·영어·얼굴 금지).
- 매칭은 대표 수동, 수수료율 업체별 건별 입력. 지플랜 미사용.
- 실적 숫자 없음→가짜 금지·스토리텔링. 시공사진 없음→정보형 콘텐츠 1기, 파트너 확보 후 시공전후 2기.
- 채널: IG @gonggan.bridge, 블로그 bridgeone11, 카톡 pf.kakao.com/_xkpqIX, 문자 010-8443-4756. 스마트플레이스 제외(비상주).
- 검색노출 무료 오가닉만(광고 금지).

## 대표가 할 일 (로그인 필요 — 나머지는 내가)
1. 사이트 배포: 사이트 폴더에서 `npx vercel --prod`
2. 네이버 서치어드바이저·구글 서치콘솔 등록 → 인증코드 받아서 나에게 → 내가 사이트에 넣고 재배포
3. 백오피스 켜기: `start.command` 더블클릭(로컬) / 상시운영은 Fly.io
4. 블로그·릴스 발행

## 중요 · 환경 한계 (다음 세션도 동일)
- 이 세션은 **클라우드(웹) 클로드코드**라 사장님 맥 화면·마우스·브라우저 제어 불가, 외부 사이트(네이버 등) 접속 차단.
- 화면 자동 클릭/브라우저 열기가 필요하면 **맥에 설치된 클로드코드(터미널) 또는 코덱스**를 써야 함. 웹 세션은 파일·코드·git·자체 렌더 스크린샷까지만 가능.

## 데모 링크 (참고)
- 운영 콘솔 데모: https://claude.ai/code/artifact/6ebfd67d-92eb-4d4e-9d04-914388fa52b4
- 용역계약서: https://claude.ai/code/artifact/e753b089-46ed-4c80-9c24-b8a0bdf8b59b
- 대표 할 일: https://claude.ai/code/artifact/471c3869-809f-46c0-9503-37c857c43e80
