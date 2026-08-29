#!/bin/bash
# 공간브릿지 백오피스 원클릭 실행 (맥: 더블클릭 또는 터미널에서 ./start.command)
cd "$(dirname "$0")"
export SB_SECRET="${SB_SECRET:-$(openssl rand -hex 16 2>/dev/null || echo change-me)}"
export SB_DB="${SB_DB:-$(pwd)/data.sqlite}"
export PORT="${PORT:-4700}"
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node가 없습니다. https://nodejs.org 에서 LTS 설치 후 다시 실행하세요."; read -p "엔터를 누르면 닫힙니다"; exit 1
fi
# 운영자 계정이 없으면 최초 1회 생성
node --no-warnings -e "const d=require('./db').openDb(process.env.SB_DB);const n=d.prepare('SELECT COUNT(*) n FROM users').get().n;process.exit(n>0?0:7)" 2>/dev/null
if [ $? -eq 7 ]; then
  echo "== 최초 실행: 운영자 계정을 만듭니다 =="
  read -p "관리자 이메일 [admin@gongganbridge.com]: " EMAIL; EMAIL=${EMAIL:-admin@gongganbridge.com}
  read -p "비밀번호: " PW
  node --no-warnings seed.js "$EMAIL" "$PW"
  node --no-warnings seed-content.js 2>/dev/null
fi
echo ""
echo "✅ 운영 콘솔 실행 중 → 브라우저에서 열기:"
echo "   http://localhost:$PORT/admin      (상담·정산·대시보드·마케팅)"
echo "   http://localhost:$PORT/contract   (용역계약서)"
echo "   (끄려면 이 창에서 Control+C)"
echo ""
node --no-warnings server.js
