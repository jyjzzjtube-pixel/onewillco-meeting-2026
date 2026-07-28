#!/usr/bin/env python3
"""제안서 일러스트 자산 생성 — 4배 슈퍼샘플링 후 축소해 선을 매끄럽게 만든다.
   색·선굵기·비율·여백을 전부 좌표로 통제한다."""
from PIL import Image, ImageDraw
import math, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'img')
os.makedirs(OUT, exist_ok=True)
S = 4                                   # 슈퍼샘플 배율

INK   = (29, 44, 71)
PAPERC= (242, 244, 248)
BLUE  = (44, 104, 243)
NAVY  = (22, 35, 61)
LIGHT = (244, 246, 250)
GRIDL = (30, 44, 70)


def canvas(w, h):
    im = Image.new('RGBA', (w * S, h * S), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


def finish(im, w, h, name):
    im = im.resize((w, h), Image.LANCZOS)
    im.save(os.path.join(OUT, name))
    return im


def L(d, pts, col, wpx, closed=False):
    p = [(x * S, y * S) for x, y in pts]
    if closed:
        p = p + [p[0]]
    d.line(p, fill=col + (255,), width=int(wpx * S), joint='curve')
    r = wpx * S / 2
    for x, y in p:                       # 라운드 캡
        d.ellipse([x - r, y - r, x + r, y + r], fill=col + (255,))


def E(d, box, col, wpx, fill=None):
    b = [v * S for v in box]
    if fill:
        d.ellipse(b, fill=fill)
    d.ellipse(b, outline=col + (255,), width=int(wpx * S))


def R(d, box, col, wpx, rad=0, fill=None):
    b = [v * S for v in box]
    if rad:
        if fill:
            d.rounded_rectangle(b, radius=rad * S, fill=fill)
        d.rounded_rectangle(b, radius=rad * S, outline=col + (255,), width=int(wpx * S))
    else:
        if fill:
            d.rectangle(b, fill=fill)
        d.rectangle(b, outline=col + (255,), width=int(wpx * S))


def arc(d, box, a0, a1, col, wpx):
    d.arc([v * S for v in box], a0, a1, fill=col + (255,), width=int(wpx * S))


# ══════════ 1. 홀덤펍 매장 라인 일러스트 (16:9) ══════════
def pub(name='p11_pub.png', W=1600, H=900, col=INK, accent=BLUE):
    im, d = canvas(W, H)
    w = 7                                              # 기준 선 굵기
    # 바닥 원근 기준선
    L(d, [(90, 690), (1510, 690)], col, 4)
    # 펜던트 조명 3개 + 빛 원뿔
    for cx in (430, 610, 790):
        L(d, [(cx, 120), (cx, 232)], col, 5)
        E(d, (cx - 46, 232, cx + 46, 276), col, w)
        d.polygon([(cx - 44, 276 * 1), (cx + 44, 276), (cx + 150, 470), (cx - 150, 470)],
                  fill=accent + (26,))
    # 포커 테이블 (타원 + 레일)
    E(d, (300, 380, 920, 620), col, w)
    E(d, (334, 396, 886, 604), col, 4)
    # 딜러 자리 표시
    arc(d, (540, 560, 680, 640), 200, 340, col, 5)
    # 의자 6개
    for ang in (205, 250, 290, 335, 20, 160):
        a = math.radians(ang)
        cx, cy = 610 + 372 * math.cos(a), 500 + 168 * math.sin(a)
        R(d, (cx - 44, cy - 30, cx + 44, cy + 30), col, w, rad=14)
    # 카드 2장 (테이블 위)
    L(d, [(560, 468), (596, 452), (620, 500), (584, 516)], col, 5, closed=True)
    L(d, [(606, 462), (642, 446), (666, 494), (630, 510)], col, 5, closed=True)
    # 칩 스택 3개
    for x, n in ((470, 4), (742, 3), (700, 5)):
        for i in range(n):
            E(d, (x - 26, 520 - i * 13, x + 26, 540 - i * 13), col, 4,
              fill=accent + (30,) if i % 2 == 0 else None)
    # 바 카운터
    L(d, [(1050, 300), (1500, 300), (1500, 360), (1050, 360)], col, w, closed=True)
    L(d, [(1050, 360), (1050, 690)], col, w)
    L(d, [(1500, 360), (1500, 690)], col, w)
    for x in (1130, 1230, 1330, 1430):                  # 바 스툴
        L(d, [(x, 470), (x, 620)], col, 5)
        E(d, (x - 34, 440, x + 34, 476), col, w)
        L(d, [(x - 26, 620), (x + 26, 620)], col, 5)
    # 백바 선반 + 병
    L(d, [(1080, 150), (1470, 150)], col, 5)
    L(d, [(1080, 232), (1470, 232)], col, 5)
    for i, x in enumerate(range(1110, 1460, 48)):
        hgt = 46 if i % 2 == 0 else 62
        R(d, (x, 150 - hgt + 82 - 82, x + 22, 150), col, 4)  # placeholder, replaced below
    im2 = im
    return finish(im2, W, H, name)


# 위 함수의 백바 병 부분을 정확히 다시 그리기 위해 재작성
def pub2(name='p11_pub.png', W=1600, H=900, col=INK, accent=BLUE):
    im, d = canvas(W, H)
    w = 7
    L(d, [(90, 700), (1510, 700)], col, 4)

    # 펜던트 조명
    for cx in (430, 610, 790):
        L(d, [(cx, 110), (cx, 226)], col, 5)
        E(d, (cx - 48, 226, cx + 48, 272), col, w)
        d.polygon([((cx - 46) * S, 272 * S), ((cx + 46) * S, 272 * S),
                   ((cx + 152) * S, 452 * S), ((cx - 152) * S, 452 * S)], fill=accent + (24,))

    # 포커 테이블
    E(d, (296, 380, 924, 624), col, w)
    E(d, (332, 398, 888, 606), col, 4)
    arc(d, (536, 556, 684, 646), 200, 340, col, 5)

    # 의자
    for ang in (208, 250, 292, 334, 18, 162):
        a = math.radians(ang)
        cx, cy = 610 + 378 * math.cos(a), 502 + 172 * math.sin(a)
        R(d, (cx - 46, cy - 31, cx + 46, cy + 31), col, w, rad=15)

    # 카드
    L(d, [(556, 466), (594, 449), (619, 500), (581, 517)], col, 5, closed=True)
    L(d, [(604, 460), (642, 443), (667, 494), (629, 511)], col, 5, closed=True)

    # 칩 스택
    for x, n in ((462, 4), (748, 3), (704, 5)):
        for i in range(n):
            E(d, (x - 27, 522 - i * 14, x + 27, 543 - i * 14), col, 4,
              fill=accent + (34,) if i % 2 == 0 else None)

    # 바 카운터
    L(d, [(1046, 296), (1506, 296), (1506, 358), (1046, 358)], col, w, closed=True)
    L(d, [(1052, 358), (1052, 700)], col, w)
    L(d, [(1500, 358), (1500, 700)], col, w)
    for x in (1128, 1230, 1332, 1434):
        L(d, [(x, 472), (x, 626)], col, 5)
        E(d, (x - 35, 438, x + 35, 476), col, w)
        L(d, [(x - 27, 626), (x + 27, 626)], col, 5)

    # 백바 선반과 병
    L(d, [(1078, 142), (1474, 142)], col, 5)
    L(d, [(1078, 236), (1474, 236)], col, 5)
    x = 1100
    for i in range(8):
        bh = 58 if i % 2 == 0 else 74
        R(d, (x, 236 - bh, x + 24, 236), col, 4,
          fill=accent + (30,) if i % 3 == 0 else None)
        L(d, [(x + 8, 236 - bh), (x + 8, 236 - bh - 16), (x + 16, 236 - bh - 16), (x + 16, 236 - bh)], col, 3)
        x += 48

    return finish(im, W, H, name)


# ══════════ 2. 업무 아이콘 3종 (1:1) ══════════
def icon_handshake(name='p09_icon1.png', N=320, col=BLUE):
    """가맹영업대행 — 계약서와 체결 표시"""
    im, d = canvas(N, N)
    w = 13
    # 문서 (우상단 접힘)
    L(d, [(48, 46), (170, 46), (214, 92), (214, 250), (48, 250)], col, w, closed=True)
    L(d, [(170, 46), (170, 92), (214, 92)], col, 9)
    # 본문 줄
    for y in (128, 162, 196):
        L(d, [(80, y), (182, y)], col, 9)
    # 체결 도장(체크)
    E(d, (188, 176, 288, 276), col, w)
    L(d, [(210, 226), (232, 250), (268, 202)], col, w)
    return finish(im, N, N, name)


def icon_mega(name='p09_icon2.png', N=320, col=BLUE):
    im, d = canvas(N, N)
    w = 13
    L(d, [(48, 128), (128, 128), (224, 62), (224, 258), (128, 192), (48, 192)], col, w, closed=True)
    L(d, [(48, 128), (48, 192)], col, w)
    L(d, [(96, 192), (96, 250), (134, 250), (134, 210)], col, w)
    for i, r in enumerate((28, 50, 72)):
        arc(d, (236 - r, 160 - r, 236 + r, 160 + r), -52, 52, col, 9 - i)
    return finish(im, N, N, name)


def icon_pin(name='p09_icon3.png', N=320, col=BLUE):
    """점포개발 — 점포와 위치 핀"""
    im, d = canvas(N, N)
    w = 13
    # 위치 핀 (상단 · 점포와 겹치지 않게)
    cx, cy, r = 232, 66, 36
    arc(d, (cx - r, cy - r, cx + r, cy + r), 152, 28, col, w)
    L(d, [(cx - r * 0.883, cy + r * 0.469), (cx, cy + 84)], col, w)
    L(d, [(cx + r * 0.883, cy + r * 0.469), (cx, cy + 84)], col, w)
    E(d, (cx - 13, cy - 13, cx + 13, cy + 13), col, 10)
    # 점포 차양 · 몸통 · 출입문
    L(d, [(34, 196), (58, 168), (222, 168), (246, 196)], col, w, closed=True)
    L(d, [(46, 196), (46, 282)], col, w)
    L(d, [(234, 196), (234, 282)], col, w)
    L(d, [(46, 282), (234, 282)], col, w)
    L(d, [(108, 282), (108, 224), (172, 224), (172, 282)], col, w)
    return finish(im, N, N, name)


# ══════════ 3. 팀 페이지 배경 그리드 (16:9) ══════════
def grid_bg(name='p05_bg.png', W=2000, H=1125):
    im = Image.new('RGB', (W, H), NAVY)
    d = ImageDraw.Draw(im)
    step = 40
    for x in range(0, W, step):
        d.line([(x, 0), (x, H)], fill=GRIDL, width=1)
    for y in range(0, H, step):
        d.line([(0, y), (W, y)], fill=GRIDL, width=1)
    for x in range(0, W, step * 5):
        d.line([(x, 0), (x, H)], fill=(38, 53, 82), width=2)
    for y in range(0, H, step * 5):
        d.line([(0, y), (W, y)], fill=(38, 53, 82), width=2)
    im.save(os.path.join(OUT, name))
    return im


if __name__ == '__main__':
    pub2()
    icon_handshake(); icon_mega(); icon_pin()
    grid_bg()
    print('생성 완료:')
    for f in ('p11_pub.png', 'p09_icon1.png', 'p09_icon2.png', 'p09_icon3.png', 'p05_bg.png'):
        p = os.path.join(OUT, f)
        print(' ', f, Image.open(p).size)
