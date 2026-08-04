#!/usr/bin/env python3
"""자산 정규화 — "선언한 상자 = 실제로 보이는 잉크" 를 강제한다.

배치 코드는 좌표를 정확히 찍지만, PNG 안에 투명 여백이 비대칭으로 들어 있으면
잉크가 상자 안에서 떠다닌다. 그래서 좌표는 맞는데 눈으로 보면 어긋난다.
실측한 여백은 이랬다 — lg_forbes 좌147/우300px(파일 폭의 50%가 빈 공간),
lg_yogiyo 좌193/우111, ic_users 세로 56%, ic_arrow 세로 47%.
같은 크기로 배치해도 아이콘마다 실제로 보이는 크기가 달라진다.

두 갈래로 처리한다.
  · 아이콘 — 잉크를 정사각 캔버스 안에서 중앙에 놓고 잉크 비율을 통일한다.
    비율이 1:1 로 유지되므로 배치 코드는 손대지 않는다.
  · 로고 — 잉크 경계로 딱 자른다. 종횡비가 바뀌므로 imgAspect() 를 쓰는 곳은
    자동 반영되고, 하드코딩된 나눗셈만 함께 고친다.
"""
import glob
import os
import sys

import numpy as np
from PIL import Image

A = '/home/user/onewillco-meeting-2026/runnerpub-proposal/assets'
ICON_INK = 0.88          # 정사각 캔버스에서 잉크가 차지할 비율
ALPHA_ON = 8             # 잉크로 볼 최소 알파


def ink_box(im):
    a = np.asarray(im.convert('RGBA'))[:, :, 3]
    ys, xs = np.nonzero(a > ALPHA_ON)
    if len(xs) == 0:
        return None
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def normalize_icon(path, side=320):
    """잉크를 잘라내 정사각 캔버스 중앙에 같은 비율로 다시 앉힌다."""
    im = Image.open(path).convert('RGBA')
    box = ink_box(im)
    if box is None:
        return None
    ink = im.crop(box)
    target = int(side * ICON_INK)
    sc = min(target / ink.width, target / ink.height)
    nw, nh = max(1, round(ink.width * sc)), max(1, round(ink.height * sc))
    ink = ink.resize((nw, nh), Image.LANCZOS)
    out = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    out.paste(ink, ((side - nw) // 2, (side - nh) // 2), ink)
    out.save(path)
    return (im.size, out.size, round(nw / max(1, nh), 3))


def trim_logo(path):
    """잉크 경계로 딱 자른다."""
    im = Image.open(path).convert('RGBA')
    box = ink_box(im)
    if box is None:
        return None
    if box == (0, 0, im.width, im.height):
        return (im.size, im.size, round(im.width / im.height, 4))
    out = im.crop(box)
    out.save(path)
    return (im.size, out.size, round(out.width / out.height, 4))


def main():
    os.chdir(A)
    icons = sorted(glob.glob('ic_*.png'))
    logos = (sorted(glob.glob('lg_*.png'))
             + ['ns_logo.png', 'ns_logo_w.png', 'logo.png']
             + ['p11_pub.png', 'p11_pub_w.png', 'cover_phones.png'])

    print(f'아이콘 정규화 — 정사각 {320}px · 잉크 비율 {ICON_INK:.0%} · 중앙 정렬')
    n = 0
    for f in icons:
        r = normalize_icon(f)
        if r:
            n += 1
    print(f'  {n}개 처리')

    print('로고 잉크 경계 트림')
    for f in logos:
        if not os.path.exists(f):
            continue
        r = trim_logo(f)
        if r:
            print(f'  {f:22s} {str(r[0]):12s} → {str(r[1]):12s}  비율 {r[2]}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
