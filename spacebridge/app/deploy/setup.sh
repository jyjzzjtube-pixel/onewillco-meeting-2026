#!/usr/bin/env bash
# ============================================================
# 공간브릿지 서버 자동 설치 스크립트 (Ubuntu 22.04/24.04 기준)
#
# 사용법:  서버에 app 폴더를 올린 뒤, app 폴더 안에서
#   bash deploy/setup.sh 내도메인.com
#
# 하는 일: Node.js + pm2 + Caddy(HTTPS 자동) 설치,
#          서버 상시 실행·재부팅 자동시작·도메인 연결까지 한 번에.
# ============================================================
set -euo pipefail

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
  read -rp "도메인을 입력하세요 (예: spacebridge.co.kr): " DOMAIN
fi
DOMAIN="${DOMAIN#https://}"; DOMAIN="${DOMAIN#http://}"; DOMAIN="${DOMAIN%/}"

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
echo "▶ 앱 위치: $APP_DIR"
echo "▶ 도메인: $DOMAIN (www.$DOMAIN 포함)"

# ---------- 1. Node.js ----------
if ! command -v node >/dev/null 2>&1; then
  echo "▶ Node.js 22 설치 중..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "▶ Node.js 확인: $(node --version)"
fi

# ---------- 2. 관리자 비밀번호 ----------
echo
read -rsp "▶ 관리자 비밀번호를 설정하세요 (입력 안 보임): " ADMIN_PW; echo
if [ -z "$ADMIN_PW" ]; then echo "비밀번호는 비울 수 없습니다."; exit 1; fi

# ---------- 3. pm2 (상시 실행 + 재부팅 자동시작) ----------
if ! command -v pm2 >/dev/null 2>&1; then
  echo "▶ pm2 설치 중..."
  sudo npm install -g pm2 >/dev/null
fi
cd "$APP_DIR"
pm2 delete spacebridge >/dev/null 2>&1 || true
ADMIN_PASSWORD="$ADMIN_PW" PORT=3000 pm2 start server.js --name spacebridge --update-env
pm2 save
sudo env "PATH=$PATH" pm2 startup systemd -u "$USER" --hp "$HOME" >/dev/null 2>&1 || true
pm2 save

# ---------- 4. Caddy (HTTPS 자동 발급·갱신) ----------
if ! command -v caddy >/dev/null 2>&1; then
  echo "▶ Caddy 설치 중..."
  sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --yes --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
  sudo apt-get update && sudo apt-get install -y caddy
fi
sudo tee /etc/caddy/Caddyfile >/dev/null <<CADDY
$DOMAIN, www.$DOMAIN {
    reverse_proxy localhost:3000
    encode gzip
}
CADDY
sudo systemctl enable caddy >/dev/null 2>&1 || true
sudo systemctl restart caddy

# ---------- 5. 완료 안내 ----------
IP=$(curl -s --max-time 5 ifconfig.me || hostname -I | awk '{print $1}')
echo
echo "============================================================"
echo "✅ 설치 완료!"
echo
echo "다음 단계 (가비아 DNS 설정):"
echo "  My가비아 → 도메인 관리 → DNS 관리 → 레코드 추가"
echo "    A 레코드 | 호스트 @   | 값 $IP"
echo "    A 레코드 | 호스트 www | 값 $IP"
echo
echo "DNS 반영(보통 10분~1시간) 후:"
echo "  홈페이지  → https://$DOMAIN"
echo "  관리자    → https://$DOMAIN/admin"
echo "  (HTTPS 인증서는 Caddy가 자동 발급합니다 — DNS 연결 전이면 잠시 대기)"
echo
echo "서버 관리 명령:"
echo "  pm2 status              # 상태 확인"
echo "  pm2 logs spacebridge    # 로그"
echo "  pm2 restart spacebridge # 재시작"
echo "============================================================"
