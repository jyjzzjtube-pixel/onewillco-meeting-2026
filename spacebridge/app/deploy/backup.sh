#!/usr/bin/env bash
# 공간브릿지 데이터 자동 백업 — data/ 폴더(문의 DB·게시글·사진·통계)를 통째로 보관
# setup.sh가 매일 새벽 4시에 자동 실행되도록 등록합니다. 수동 실행: bash deploy/backup.sh
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKUP_DIR="$APP_DIR/backups"
mkdir -p "$BACKUP_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
tar -czf "$BACKUP_DIR/data-$STAMP.tar.gz" -C "$APP_DIR" data
# 30일 지난 백업 자동 삭제
find "$BACKUP_DIR" -name 'data-*.tar.gz' -mtime +30 -delete
echo "백업 완료: $BACKUP_DIR/data-$STAMP.tar.gz"
