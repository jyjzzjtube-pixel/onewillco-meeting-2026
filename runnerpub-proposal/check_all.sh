#!/bin/sh
# 산출물 전량 검사 — 좌표/넘침/겹침/텍스트 대비는 node, 이미지 잉크 대비는 python
set -e
V="$(cd "$(dirname "$0")" && pwd)"
node "$V/mk10.js"
echo
python3 "$V/check_img_contrast.py"
