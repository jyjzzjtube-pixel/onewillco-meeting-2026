#!/usr/bin/env python3
"""이미지 잉크 대비 검사 — grid.js 의 contrastReport() 가 kind!=='text' 를 건너뛰어
   로고·아이콘이 배경 틴트 위에서 안 보여도 "가독 위반 0건" 으로 통과하던 구멍을 막는다.

   grid.js 의 imgManifest() 가 (파일, 배치 크기, surfaceUnder() 로 확정한 배경색) 을 내놓고,
   여기서 실제 픽셀을 읽어 잉크의 WCAG 대비를 잰다.

   사진·스크린샷은 잉크 개념이 없으므로 제외하고, 선화 자산(로고·아이콘·심볼)만 본다.
   판정은 p90 대비 — 가장 진한 10% 가 3.0 을 넘으면 형태는 읽힌다고 본다.
"""
import json
import os
import sys

import numpy as np
from PIL import Image

MIN = 3.0
V = os.path.dirname(os.path.abspath(__file__))


def hx(c):
    c = c.lstrip('#')
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def rel_lum(rgb):
    """WCAG 상대 휘도. rgb 는 0~255 실수 배열 (…,3)"""
    c = np.asarray(rgb, dtype=float) / 255.0
    c = np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * c[..., 0] + 0.7152 * c[..., 1] + 0.0722 * c[..., 2]


def ratio(l1, l2):
    hi, lo = np.maximum(l1, l2), np.minimum(l1, l2)
    return (hi + 0.05) / (lo + 0.05)


def measure(path, bg_hex):
    """배경 위에 알파 합성한 뒤, 배경과 다른 픽셀만 잉크로 보고 대비 분포를 낸다."""
    im = Image.open(path).convert('RGBA')
    a = np.asarray(im, dtype=float)
    alpha = a[:, :, 3:4] / 255.0
    bg = np.array(hx(bg_hex), dtype=float)
    comp = a[:, :, :3] * alpha + bg * (1 - alpha)

    l_bg = rel_lum(bg)
    l_px = rel_lum(comp)
    r = ratio(l_px, l_bg)

    # 잉크 후보 = 조금이라도 덮인 픽셀 전부.
    # 알파 문턱을 높게 잡으면 정작 잡아야 할 "잉크가 씻긴 자산"이 통째로 빠져나간다
    # (lg_kfa 원본은 잉크가 저알파로 저장돼 있어 alpha>0.5 로는 0건이었다).
    ink = (alpha[:, :, 0] > 0.05) & (r > 1.10)
    n = int(ink.sum())
    if n < 200:
        return None
    vals = np.sort(r[ink])
    strong = float((vals >= MIN).mean())
    return {
        'ink_px': n,
        'p50': float(vals[int(n * 0.50)]),
        'p90': float(vals[int(n * 0.90)]),
        'p99': float(vals[min(n - 1, int(n * 0.99))]),
        'max': float(vals[-1]),
        'strong': strong,          # 3.0 을 넘는 잉크 비율
    }


# 사진·스크린샷·풀블리드 그라데이션은 잉크 대비 개념이 없다
SKIP_PREFIX = ('gr_', 'cover_phones', 'app_', 'p07_step', 'p07_dday', 'p07_area', 'p11_pub')


def main():
    mf = os.path.join(V, 'img_manifest.json')
    if not os.path.exists(mf):
        print('img_manifest.json 없음 — node mk10.js 를 먼저 실행하라', file=sys.stderr)
        return 2
    rows = json.load(open(mf, encoding='utf-8'))

    checked, bad = [], []
    for r in rows:
        name = r['name']
        if name.startswith(SKIP_PREFIX):
            continue
        if not os.path.exists(r['file']):
            bad.append((r, None, '파일 없음'))
            continue
        m = measure(r['file'], r['bg'])
        if m is None:
            continue
        checked.append((r, m))
        # ① 가장 진한 1% 조차 문턱을 못 넘으면 형태가 아예 안 읽힌다
        # ② 문턱을 넘는 잉크가 15% 미만이면 획 대부분이 유령처럼 뜬다
        if m['p99'] < MIN:
            bad.append((r, m, 'p99 미달 — 가장 진한 획도 문턱 미달'))
        elif m['strong'] < 0.15:
            bad.append((r, m, f"진한 잉크 {m['strong']*100:.0f}% — 획 대부분이 배경에 묻힘"))

    print('이미지 잉크 대비 검사')
    print(f'  검사 대상 {len(checked)}건 (사진·스크린샷·그라데이션 제외)')
    print(f'  위반 {len(bad)}건 (p99 대비 {MIN} 미만 또는 진한 잉크 15% 미만)')
    for r, m, why in bad:
        if m:
            print(f"    P{r['slide']:02d}  {r['name']}  on #{r['bg']}  "
                  f"p50 {m['p50']:.2f} / p90 {m['p90']:.2f} / p99 {m['p99']:.2f}  "
                  f"진한잉크 {m['strong']*100:.0f}%  — {why}")
        else:
            print(f"    P{r['slide']:02d}  {r['name']}  — {why}")
    if not bad:
        seen, worst = set(), []
        for r, m in sorted(checked, key=lambda t: t[1]['strong']):
            if r['name'] in seen:
                continue
            seen.add(r['name'])
            worst.append((r, m))
            if len(worst) == 5:
                break
        print('  여유 하위 5종 :')
        for r, m in worst:
            print(f"    P{r['slide']:02d}  {r['name']:22s} on #{r['bg']}  "
                  f"p90 {m['p90']:5.2f}  진한잉크 {m['strong']*100:3.0f}%")
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
