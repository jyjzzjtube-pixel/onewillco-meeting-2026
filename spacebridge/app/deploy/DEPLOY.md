# 공간브릿지 배포 가이드 (도메인 등록 완료 기준)

도메인은 이미 가비아에 등록되어 있으므로, 남은 것은 딱 3단계입니다:
**① 서버 1대 만들기 → ② 명령어 1줄 실행 → ③ DNS 레코드 2개 입력.**
전체 30분~1시간이면 끝납니다.

---

## ① 서버 만들기 (둘 중 하나)

Node.js가 도는 리눅스 서버 1대가 필요합니다. 사양은 **1vCPU / 1GB면 충분**합니다.

### 옵션 A. 가비아 g클라우드 (가비아 안에서 해결)
1. [gabia.com](https://www.gabia.com) 로그인 → **클라우드 → g클라우드** → 서버 신청
2. 이미지: **Ubuntu 22.04 (또는 24.04)** / 사양: g1 Basic (1vCPU·1GB) / 공인 IP 부여
3. 생성 후 **방화벽(보안그룹)에서 포트 22, 80, 443 허용**
4. 발급된 **공인 IP**와 SSH 접속 정보(비밀번호 또는 키)를 메모

### 옵션 B. AWS Lightsail (월 $5, 해외 결제 가능하면 추천)
1. [lightsail.aws.amazon.com](https://lightsail.aws.amazon.com) → Create instance
2. 리전 **Seoul** / OS Only / **Ubuntu 22.04** / $5 플랜
3. Networking 탭 → **고정 IP(Static IP) 생성·연결** + 방화벽에 HTTPS(443) 추가
4. 브라우저 SSH 버튼으로 바로 접속 가능

---

## ② 앱 올리고 설치 스크립트 실행

내 컴퓨터(또는 서버)에서:

```bash
# 방법 1 — 저장소에서 바로 (서버에서 실행, 개인 저장소면 GitHub 토큰 필요)
git clone https://github.com/jyjzzjtube-pixel/onewillco-meeting-2026.git
cd onewillco-meeting-2026/spacebridge/app

# 방법 2 — 내 컴퓨터에서 app 폴더만 업로드
scp -r spacebridge/app ubuntu@서버IP:~/spacebridge
# 이후 서버에서: cd ~/spacebridge
```

그다음 **한 줄**:

```bash
bash deploy/setup.sh 내도메인.com
```

- 관리자 비밀번호를 물어봅니다 → 원하는 비밀번호 입력 (절대 기본값 금지)
- Node·pm2(상시 실행+재부팅 자동시작)·Caddy(HTTPS 자동)까지 전부 자동 설치됩니다
- 끝나면 화면에 **서버 IP와 DNS에 넣을 값**이 그대로 출력됩니다

---

## ③ 가비아 DNS 연결 (클릭 5번)

1. **My가비아 → 이용 중인 서비스 → 도메인 → [관리]**
2. **DNS 정보 → DNS 관리(레코드 수정)**
3. 레코드 2개 추가:

| 타입 | 호스트 | 값(IP) | TTL |
|---|---|---|---|
| A | @ | 서버 공인 IP | 600 |
| A | www | 서버 공인 IP | 600 |

4. 저장 → 보통 10분~1시간 내 반영
5. `https://내도메인.com` 접속 확인 (인증서는 Caddy가 자동 발급 — DNS 반영 직후 1~2분 걸릴 수 있음)

---

## ④ 오픈 당일 체크리스트 (사이트가 뜬 직후)

**관리자(`https://내도메인.com/admin`) → [사이트 편집]에서:**
- [ ] `도메인` 칸에 `https://내도메인.com` 입력 (사이트맵·검색엔진용)
- [ ] 대표 전화, 카카오톡 채널 URL, 대표자명, 사업자번호, 주소를 실제 값으로
- [ ] 신뢰 숫자 4개(누적 시공 등)를 실제 값으로
- [ ] 포트폴리오에 실제 시공 사진 업로드

**검색엔진 등록 (유입의 시작):**
- [ ] [네이버 서치어드바이저](https://searchadvisor.naver.com) → 사이트 등록 → 소유확인에서 **HTML 태그 방식** 선택 → `content="..."` 안의 코드만 복사 → 관리자 [사이트 편집]의 "네이버 소유확인 코드" 칸에 붙여넣고 저장 → 서치어드바이저에서 [확인] 클릭
- [ ] 소유확인 후: **요청 → 사이트맵 제출** `https://내도메인.com/sitemap.xml` / **RSS 제출** `https://내도메인.com/rss.xml`
- [ ] [구글 서치콘솔](https://search.google.com/search-console) 동일 방식 (HTML 태그 → "구글 소유확인 코드" 칸) + 사이트맵 제출
- [ ] 네이버 스마트플레이스에 홈페이지 주소 연결

**운영 습관:**
- [ ] 견적문의 DB에 문의가 들어오면 3시간 내 회신 (홈페이지에 약속한 시간)
- [ ] 시공 1건 끝날 때마다: 게시판 시공일지 1편 + 포트폴리오 사진 업데이트
- [ ] 매주 월요일 대시보드에서 유입 채널·검색어 확인

---

## 문제 해결

| 증상 | 해결 |
|---|---|
| https 접속 안 됨 | DNS 반영 대기 (nslookup 내도메인.com 으로 IP 확인) → 서버에서 `sudo systemctl restart caddy` |
| 사이트 안 뜸 | `pm2 status`로 spacebridge가 online인지, `pm2 logs spacebridge`로 오류 확인 |
| 비밀번호 변경 | `ADMIN_PASSWORD='새비번' pm2 restart spacebridge --update-env` |
| 데이터 백업 | `app/data/` 폴더만 복사하면 끝 (문의 DB·게시글·사진·통계 전부) |
