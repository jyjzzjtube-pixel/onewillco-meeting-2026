#!/usr/bin/env python3
"""그라데이션 면 — PPTX 도형은 그라데이션을 못 넣으므로 이미지로 만들어 깐다.
   선형 그라데이션이라 늘려도 깨지지 않는다(비율 검사 예외 대상)."""
from PIL import Image
import os

A = '/home/user/onewillco-meeting-2026/runnerpub-proposal/assets'
os.makedirs(A, exist_ok=True)


def hx(c):
    c = c.lstrip('#')
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def linear(name, w, h, c0, c1, direction='세로', stops=None):
    """direction: 가로 / 세로 / 대각"""
    a, b = hx(c0), hx(c1)
    im = Image.new('RGB', (w, h))
    px = im.load()
    for y in range(h):
        for x in range(w):
            if direction == '가로':
                t = x / max(1, w - 1)
            elif direction == '세로':
                t = y / max(1, h - 1)
            else:
                t = (x / max(1, w - 1) + y / max(1, h - 1)) / 2
            if stops:
                t = stops(t)
            px[x, y] = (int(a[0] + (b[0] - a[0]) * t),
                        int(a[1] + (b[1] - a[1]) * t),
                        int(a[2] + (b[2] - a[2]) * t))
    im.save(os.path.join(A, name))
    return name, im.size


def ease(t):
    return t * t * (3 - 2 * t)


SET = [
    # 지면 — 흰색에서 아주 연한 파랑. 거의 안 보일 만큼 옅게.
    ('gr_page.png',    1600, 900, '#FFFFFF', '#F1F5FD', '대각'),
    # 세로 패널 — 흰색 → 연파랑 틴트
    ('gr_panel.png',    900, 1200, '#FFFFFF', '#E7EFFA', '세로'),
    # 가로 패널 — 연파랑 → 흰색 (오른쪽으로 밝아진다)
    ('gr_panelh.png',  1400, 900, '#E7EFFA', '#FFFFFF', '가로'),
    # 결론 띠 — 파랑에서 진한 파랑으로. 흰 글씨가 얹힌다.
    ('gr_band.png',    1600, 200, '#1F4FBF', '#122F7A', '가로'),
    # 표지 — 네이비에서 파랑으로 대각
    ('gr_cover.png',   1600, 900, '#16294A', '#22468C', '대각'),
    # KPI 카드 — 연파랑 → 흰색 세로
    ('gr_kpi.png',      800, 500, '#EDF3FE', '#FFFFFF', '세로'),
    # 강조 세로바 — 파랑 → 연파랑
    ('gr_bar.png',       40, 400, '#2868F0', '#8FB4FF', '세로'),
    # 노란 형광 면 — 노랑 → 옅은 노랑
    ('gr_yel.png',      600, 200, '#FFE96B', '#FFF6BE', '가로'),
]

if __name__ == '__main__':
    for name, w, h, c0, c1, d in SET:
        print('%-16s %s' % linear(name, w, h, c0, c1, d, ease))
