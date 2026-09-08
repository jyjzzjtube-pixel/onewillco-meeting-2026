#!/usr/bin/env bash
# yt-analyze.sh — 유튜브 영상 자막 수집 → Claude Code 분석 (Mac mini PRIMARY 전용)
#
# 사용법:
#   ~/yt-analyze.sh '<유튜브 URL>' ['분석 질문(선택)']
# 환경변수:
#   YT_BROWSER  쿠키를 가져올 브라우저 (기본 chrome, 대안 safari|firefox|brave)
#   YT_OUT      결과 저장 루트 (기본 ~/yt_analysis, T7 경로로 바꿔도 됨)
#
# 결과: $YT_OUT/<videoId>/{title,meta,desc,transcript}.txt, input.md, analysis.md
# 원칙: 삭제 없음, 같은 영상은 같은 폴더에 덮어씀(멱등), 실패 시 즉시 중단(silent fail 금지)
set -euo pipefail

URL="${1:?사용법: yt-analyze.sh '<youtube-url>' ['질문']}"
Q="${2:-이 영상의 핵심 주장 3줄, 소개하는 부업/방법의 실제 절차(단계별), 초기비용·필요도구, 수익 주장의 신뢰도(주장|자료확인), 그리고 Claude Code + Mac mini 환경으로 직접 만들 수 있는 부분과 만들 수 없는 부분을 표로 정리해줘. 마지막 줄에 device: mac_mini_m4 를 표기해.}"
BROWSER="${YT_BROWSER:-chrome}"
OUT_ROOT="${YT_OUT:-$HOME/yt_analysis}"

ID=$(python3 -c 'import sys,re
m=re.search(r"(?:v=|youtu\.be/|shorts/|live/)([\w-]{11})",sys.argv[1])
print(m.group(1)) if m else sys.exit("영상 ID를 URL에서 못 찾음: "+sys.argv[1])' "$URL")
OUT="$OUT_ROOT/$ID"
mkdir -p "$OUT"
echo "== [mac_mini_m4] 영상 $ID → $OUT"

# 1) 도구 확인 (yt-dlp는 최신 유튜브 추출에 deno JS 런타임이 필요)
command -v brew   >/dev/null || { echo "Homebrew 없음: https://brew.sh 먼저 설치"; exit 1; }
command -v yt-dlp >/dev/null || brew install yt-dlp
command -v deno   >/dev/null || brew install deno
command -v claude >/dev/null || { echo "claude CLI 없음: npm i -g @anthropic-ai/claude-code"; exit 1; }

# 2) 자막 + 메타 수집 (로그인 쿠키 재사용 → 봇 차단 우회, 평문 비번 저장 안 함)
yt-dlp --cookies-from-browser "$BROWSER" \
  --skip-download --write-auto-sub --write-sub \
  --sub-lang 'ko.*,en.*' --sub-format vtt \
  --print-to-file '%(title)s' "$OUT/title.txt" \
  --print-to-file '채널=%(channel)s | 업로드=%(upload_date)s | 길이=%(duration_string)s | 조회=%(view_count)s | url=%(webpage_url)s' "$OUT/meta.txt" \
  --print-to-file '%(description)s' "$OUT/desc.txt" \
  -o "$OUT/sub.%(ext)s" "$URL"

VTT=$(ls "$OUT"/sub.ko*.vtt 2>/dev/null | head -1 || true)
[ -n "$VTT" ] || VTT=$(ls "$OUT"/sub.*.vtt 2>/dev/null | head -1 || true)
[ -n "$VTT" ] || { echo "자막 파일 없음(영상에 자막이 꺼져 있을 수 있음). $OUT 확인"; exit 2; }

# 3) VTT → 평문 (타임코드·태그·중복줄 제거)
python3 - "$VTT" "$OUT/transcript.txt" <<'PY'
import sys, re
src, dst = sys.argv[1], sys.argv[2]
lines, prev = [], None
for raw in open(src, encoding="utf-8"):
    l = raw.strip()
    if not l or "-->" in l or l.startswith(("WEBVTT", "Kind:", "Language:")) or re.fullmatch(r"\d+", l):
        continue
    l = re.sub(r"<[^>]+>", "", l).strip()
    if l and l != prev:
        lines.append(l); prev = l
open(dst, "w", encoding="utf-8").write("\n".join(lines))
print(f"자막 {len(lines)}줄 → {dst}")
PY

# 4) Claude Code 분석 입력 조립
{
  echo "# 제목: $(cat "$OUT/title.txt")"
  echo "# 메타: $(cat "$OUT/meta.txt")"
  echo; echo "## 영상 설명"; cat "$OUT/desc.txt"
  echo; echo "## 자막 전문"; cat "$OUT/transcript.txt"
} > "$OUT/input.md"

# 5) 분석 (-p 비대화 모드, stdin으로 자막 전달)
claude -p "$Q" < "$OUT/input.md" > "$OUT/analysis.md"

echo "== 완료: $OUT/analysis.md"
echo "------------------------------------------------------------"
cat "$OUT/analysis.md"
