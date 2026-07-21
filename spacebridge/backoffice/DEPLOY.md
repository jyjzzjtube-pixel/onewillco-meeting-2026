# 백오피스 실제 가동 가이드 (대표용)

> 목표: CRM·정산·대시보드를 상시 켜진 서버에 올려, 실제 상담이 DB에 쌓이게.
> 추천 호스트: **Fly.io** (SQLite 영구 볼륨 지원, 소규모 무료~저가).

## 대표가 할 일 (약 10분, 1회)
1. **Fly.io 가입**: fly.io → Sign up (카드 등록 필요하나 소규모는 무료 크레딧 내)
2. flyctl 설치 (내가 명령어 안내) 후 로그인:
   ```
   fly auth login
   ```
3. `spacebridge/backoffice/` 폴더에서:
   ```
   fly launch --no-deploy      # 앱 생성(fly.toml 사용)
   fly volumes create sb_data --size 1 --region nrt   # SQLite 영구 볼륨
   fly secrets set SB_SECRET=$(openssl rand -hex 32)   # 세션 서명 키(비밀)
   fly deploy
   ```
4. 배포 후 운영자 계정 생성:
   ```
   fly ssh console -C "node --no-warnings seed.js admin@gongganbridge.com <비밀번호>"
   ```
5. 접속: `https://gongganbridge-backoffice.fly.dev/admin` → 로그인

## 사이트 상담폼 → 백오피스 연결
배포되면 백오피스 주소가 나옵니다(예: gongganbridge-backoffice.fly.dev).
그 주소를 알려주시면, 제가 gongganbridge.com 상담폼이 `POST /api/lead` 로
자동 저장되도록 연결하고 재배포합니다. (접수번호가 고객에게 발급됨)

## 환경변수
| 변수 | 용도 | 예시 |
|---|---|---|
| SB_SECRET | 세션 서명 키(필수·비밀) | 랜덤 32바이트 |
| SB_DB | DB 파일 경로 | /data/data.sqlite |
| PORT | 포트 | 8080 |

## 백업
```
fly ssh console -C "cat /data/data.sqlite" > backup-$(date +%F).sqlite   # 주기적 다운로드
```

## 대안 호스트
- Render: Docker + 영구 디스크(Persistent Disk) 마운트 `/data`, 동일 원리
- 소규모 자체 서버(집/사무실 PC 상시)도 가능하나 HTTPS·백업 직접 관리 필요

---
※ 나(클로드코드)는 로그인·결제가 필요한 실제 배포는 못 합니다. 위 명령을 옆에서 한 줄씩 안내하고,
배포 후 주소 연결·운영은 제가 처리합니다.
