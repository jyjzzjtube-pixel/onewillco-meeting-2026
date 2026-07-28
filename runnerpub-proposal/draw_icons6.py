#!/usr/bin/env python3
"""포인트 아이콘 세트 — 코드로 그린다. 320×320, 선굵기 13px 고정, 4배 슈퍼샘플링.
   라이트 면용(BLUE) / 다크 면용(BLUEL) 두 벌을 같은 좌표로 뽑는다."""
from PIL import Image, ImageDraw
import math, os

OUT = '/home/user/onewillco-meeting-2026/runnerpub-proposal/assets'
os.makedirs(OUT, exist_ok=True)
S = 4
N = 320
W = 13                       # 기준 선 굵기
BLUE = (44, 104, 243)
BLUEL = (127, 168, 255)


def canvas():
    im = Image.new('RGBA', (N * S, N * S), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)


def L(d, pts, col, w=W, closed=False):
    p = [(x * S, y * S) for x, y in pts]
    if closed:
        p = p + [p[0]]
    d.line(p, fill=col + (255,), width=int(w * S), joint='curve')
    r = w * S / 2
    for x, y in p:
        d.ellipse([x - r, y - r, x + r, y + r], fill=col + (255,))


def E(d, box, col, w=W, fill=None):
    b = [v * S for v in box]
    if fill:
        d.ellipse(b, fill=fill + (255,))
    d.ellipse(b, outline=col + (255,), width=int(w * S))


def R(d, box, col, w=W, rad=0, fill=None):
    b = [v * S for v in box]
    if rad:
        if fill:
            d.rounded_rectangle(b, radius=rad * S, fill=fill + (255,))
        d.rounded_rectangle(b, radius=rad * S, outline=col + (255,), width=int(w * S))
    else:
        if fill:
            d.rectangle(b, fill=fill + (255,))
        d.rectangle(b, outline=col + (255,), width=int(w * S))


def arc(d, box, a0, a1, col, w=W):
    d.arc([v * S for v in box], a0, a1, fill=col + (255,), width=int(w * S))


# ═══════════════ 아이콘 정의 — 모두 (draw, col) 시그니처 ═══════════════

def ic_app(d, c):            # 앱 · 다운로드
    R(d, (96, 34, 224, 286), c, rad=26)
    L(d, [(136, 34), (184, 34)], c, 8)
    L(d, [(124, 96), (196, 96)], c, 9)
    L(d, [(124, 134), (196, 134)], c, 9)
    L(d, [(124, 172), (170, 172)], c, 9)
    E(d, (140, 208, 180, 248), c, 9)


def ic_users(d, c):          # 창업자 모수 · 사람들
    E(d, (56, 74, 128, 146), c)
    arc(d, (34, 156, 150, 272), 180, 360, c)
    E(d, (176, 90, 232, 146), c, 11)
    arc(d, (158, 164, 250, 256), 180, 360, c, 11)
    E(d, (252, 118, 292, 158), c, 9)
    arc(d, (240, 176, 304, 240), 180, 360, c, 9)


def ic_deal(d, c):           # 계약 · 체결
    L(d, [(48, 40), (172, 40), (216, 86), (216, 244), (48, 244)], c, closed=True)
    L(d, [(172, 40), (172, 86), (216, 86)], c, 9)
    for y in (122, 156, 190):
        L(d, [(80, y), (184, y)], c, 9)
    E(d, (188, 178, 288, 278), c, fill=None)
    L(d, [(210, 228), (232, 252), (268, 204)], c)


def ic_won(d, c):            # 비용 · 성공보수
    E(d, (34, 34, 286, 286), c)
    L(d, [(104, 118), (140, 202), (160, 140), (180, 202), (216, 118)], c, 11)
    L(d, [(92, 158), (228, 158)], c, 9)
    L(d, [(92, 186), (228, 186)], c, 9)


def ic_store(d, c):          # 점포개발
    L(d, [(30, 118), (58, 84), (262, 84), (290, 118)], c, closed=True)
    L(d, [(46, 118), (46, 268)], c)
    L(d, [(274, 118), (274, 268)], c)
    L(d, [(46, 268), (274, 268)], c)
    L(d, [(120, 268), (120, 190), (200, 190), (200, 268)], c)


def ic_pin(d, c):            # 입지 · 상권
    cx, cy, r = 160, 118, 74
    arc(d, (cx - r, cy - r, cx + r, cy + r), 145, 35, c)
    L(d, [(cx - r * .819, cy + r * .574), (cx, cy + 168)], c)
    L(d, [(cx + r * .819, cy + r * .574), (cx, cy + 168)], c)
    E(d, (cx - 26, cy - 26, cx + 26, cy + 26), c, 11)


def ic_mega(d, c):           # 창업 마케팅
    L(d, [(40, 124), (124, 124), (222, 54), (222, 262), (124, 192), (40, 192)], c, closed=True)
    L(d, [(88, 192), (88, 254), (128, 254), (128, 212)], c)
    for i, r in enumerate((30, 54, 78)):
        arc(d, (236 - r, 158 - r, 236 + r, 158 + r), -50, 50, c, 10 - i)


def ic_shield(d, c):         # 준법
    L(d, [(160, 28), (274, 74), (274, 158)], c)
    L(d, [(160, 28), (46, 74), (46, 158)], c)
    arc(d, (46, 66, 274, 294), 0, 180, c)
    L(d, [(112, 156), (146, 192), (212, 122)], c)


def ic_cal(d, c):            # 숙려기간 · 일정
    R(d, (38, 62, 282, 282), c, rad=20)
    L(d, [(38, 122), (282, 122)], c, 10)
    L(d, [(102, 32), (102, 88)], c, 11)
    L(d, [(218, 32), (218, 88)], c, 11)
    for j in range(2):
        for i in range(3):
            E(d, (92 + i * 56, 166 + j * 56, 116 + i * 56, 190 + j * 56), c, 0, fill=c)


def ic_chart(d, c):          # 실적 · 수익
    L(d, [(42, 44), (42, 268), (286, 268)], c)
    R(d, (78, 190, 122, 262), c, 10)
    R(d, (148, 138, 192, 262), c, 10)
    R(d, (218, 76, 262, 262), c, 10)
    L(d, [(78, 118), (152, 74), (222, 40)], c, 9)


def ic_search(d, c):         # 검증 · 실사
    E(d, (42, 42, 206, 206), c)
    L(d, [(190, 190), (282, 282)], c)
    L(d, [(88, 124), (160, 124)], c, 10)
    L(d, [(88, 158), (140, 158)], c, 10)


def ic_report(d, c):         # 리포트 · 인증
    L(d, [(52, 34), (208, 34), (256, 82), (256, 286), (52, 286)], c, closed=True)
    L(d, [(208, 34), (208, 82), (256, 82)], c, 9)
    R(d, (88, 168, 116, 246), c, 8)
    R(d, (140, 132, 168, 246), c, 8)
    R(d, (192, 96, 220, 246), c, 8)


def ic_funnel(d, c):         # 모객 · 깔때기
    L(d, [(34, 46), (286, 46), (188, 164), (188, 262), (132, 290), (132, 164)], c, closed=True)
    L(d, [(84, 100), (236, 100)], c, 9)


def ic_flag(d, c):           # 파일럿 · 목표
    L(d, [(70, 30), (70, 292)], c)
    L(d, [(70, 52), (256, 52), (216, 108), (256, 164), (70, 164)], c, closed=True)


def ic_network(d, c):        # 제휴 네트워크
    E(d, (128, 24, 192, 88), c, 11)
    E(d, (24, 200, 88, 264), c, 11)
    E(d, (232, 200, 296, 264), c, 11)
    E(d, (128, 128, 192, 192), c, 11, fill=None)
    L(d, [(160, 88), (160, 128)], c, 9)
    L(d, [(132, 176), (80, 208)], c, 9)
    L(d, [(188, 176), (240, 208)], c, 9)


def ic_arrow(d, c):          # 이관 · 진행
    L(d, [(38, 160), (262, 160)], c)
    L(d, [(184, 82), (264, 160), (184, 238)], c)


def ic_lock(d, c):           # 통제 · 잠금
    R(d, (54, 138, 266, 286), c, rad=20)
    arc(d, (94, 42, 226, 174), 180, 360, c)
    E(d, (146, 194, 174, 222), c, 0, fill=c)
    L(d, [(160, 216), (160, 250)], c, 11)


def ic_clock(d, c):          # 기간 · 속도
    E(d, (34, 34, 286, 286), c)
    L(d, [(160, 96), (160, 164), (218, 194)], c, 11)


def ic_badge(d, c):          # 자격 · 인증
    E(d, (58, 26, 262, 230), c)
    L(d, [(104, 204), (78, 300), (160, 262), (242, 300), (216, 204)], c, 11)
    L(d, [(122, 122), (150, 154), (200, 96)], c, 11)


def ic_doc_x(d, c):          # 검증되지 않은 정보
    L(d, [(58, 34), (214, 34), (262, 82), (262, 286), (58, 286)], c, closed=True)
    L(d, [(214, 34), (214, 82), (262, 82)], c, 9)
    L(d, [(112, 150), (208, 246)], c, 11)
    L(d, [(208, 150), (112, 246)], c, 11)


ICONS = {
    'app': ic_app, 'users': ic_users, 'deal': ic_deal, 'won': ic_won,
    'store': ic_store, 'pin': ic_pin, 'mega': ic_mega, 'shield': ic_shield,
    'cal': ic_cal, 'chart': ic_chart, 'search': ic_search, 'report': ic_report,
    'funnel': ic_funnel, 'flag': ic_flag, 'network': ic_network, 'arrow': ic_arrow,
    'lock': ic_lock, 'clock': ic_clock, 'badge': ic_badge, 'docx': ic_doc_x,
}

if __name__ == '__main__':
    made = []
    for name, fn in ICONS.items():
        for suffix, col in (('', BLUE), ('_w', BLUEL)):
            im, d = canvas()
            fn(d, col)
            im = im.resize((N, N), Image.LANCZOS)
            f = f'ic_{name}{suffix}.png'
            im.save(os.path.join(OUT, f))
            made.append(f)
    print(f'아이콘 {len(made)}개 생성 · 320×320 · 1:1')
    for i in range(0, len(made), 6):
        print('  ' + '  '.join(made[i:i + 6]))
