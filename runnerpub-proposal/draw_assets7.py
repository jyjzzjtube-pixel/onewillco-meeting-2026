#!/usr/bin/env python3
"""v7 신규 자산 — 팔레트 밖 색과 스톡 이미지를 전부 대체한다.
   1) 표지 폰 목업 3대 (내일사장 앱 실제 화면 · 팔레트 프레임)
   2) 상권 격자 도식 (STEP3 스톡 3D 이미지 대체)
   3) 제휴 로고월 그레이스케일
"""
from PIL import Image, ImageDraw, ImageFilter
import os

A = '/home/user/onewillco-meeting-2026/runnerpub-proposal/assets'
S = 3                                     # 슈퍼샘플

NAVY = (22, 35, 61)
NAVY2 = (29, 44, 71)
BLUE = (44, 104, 243)
BLUEL = (127, 168, 255)
TINT = (238, 243, 255)
RULE = (214, 220, 231)
MUTE = (108, 120, 145)


# ══════════ 1. 표지 폰 목업 3대 ══════════
def phone(screen_path, w, h, crop_top=0.0, crop_h=1.0):
    """단말 1대 — 본체 NAVY2, 테두리 BLUE, 화면은 원본 앱 캡처"""
    W, H = w * S, h * S
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    rad = int(W * 0.115)
    d.rounded_rectangle([0, 0, W - 1, H - 1], radius=rad, fill=NAVY2 + (255,),
                        outline=BLUE + (255,), width=max(2, int(W * 0.012)))
    # 화면 영역
    pad = int(W * 0.045)
    sx0, sy0 = pad, int(H * 0.038)
    sx1, sy1 = W - pad, H - int(H * 0.038)
    sw, sh = sx1 - sx0, sy1 - sy0
    src = Image.open(screen_path).convert('RGB')
    # 폭 기준 맞춤 — 가로는 절대 자르지 않는다(글줄 절단 0). 세로만 crop_top 으로 창을 고른다
    sc = sw / src.width
    src = src.resize((sw, max(1, int(src.height * sc))), Image.LANCZOS)
    if src.height < sh:                       # 세로가 모자라면 화면 자체의 위·아래 바탕색으로 잇는다
        extra = sh - src.height
        top = extra // 2
        c_top = src.crop((0, 0, sw, 1)).resize((1, 1), Image.BOX).getpixel((0, 0))
        c_bot = src.crop((0, src.height - 1, sw, src.height)).resize((1, 1), Image.BOX).getpixel((0, 0))
        pad_im = Image.new('RGB', (sw, sh), c_bot)
        pad_im.paste(Image.new('RGB', (sw, top), c_top), (0, 0))
        pad_im.paste(src, (0, top))
        src = pad_im
    y0 = min(max(0, int((src.height - sh) * crop_top)), max(0, src.height - sh))
    src = src.crop((0, y0, sw, y0 + sh))
    mask = Image.new('L', (sw, sh), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, sw - 1, sh - 1],
                                           radius=int(rad * 0.72), fill=255)
    im.paste(src, (sx0, sy0), mask)
    # 노치
    nw2, nh2 = int(W * 0.30), int(H * 0.018)
    d.rounded_rectangle([(W - nw2) // 2, sy0 + int(H * 0.008),
                         (W + nw2) // 2, sy0 + int(H * 0.008) + nh2],
                        radius=nh2 // 2, fill=NAVY + (255,))
    return im


def cover_phones(name='cover_phones.png'):
    """앱 화면 2대 겹침 — 팔레트 프레임"""
    W, H = 1470, 1740
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    # 두 대만 쓴다 — 서로 다른 화면 2종이 실재하므로 3대째는 같은 화면 반복이 된다
    specs = [
        ('app_report_screen.png', 520, 945, -9, (10, 670), 0.00, 1.0),
        ('app_sales_screen.png', 740, 1330, 0, (700, 150), 0.00, 1.0),
    ]
    for f, w, h, ang, pos, ct, ch in specs:
        p = phone(os.path.join(A, f), w, h, ct, ch)
        p = p.resize((w, h), Image.LANCZOS)
        if ang:
            p = p.rotate(ang, resample=Image.BICUBIC, expand=True)
        # 그림자
        sh = Image.new('RGBA', p.size, (0, 0, 0, 0))
        sh.paste((0, 0, 0, 90), (0, 0), p.split()[3])
        sh = sh.filter(ImageFilter.GaussianBlur(14))
        out.alpha_composite(sh, (pos[0] + 10, pos[1] + 16))
        out.alpha_composite(p, pos)
    out.save(os.path.join(A, name))
    return out.size


# ══════════ 2. 상권 격자 도식 ══════════
def trade_area(name='p07_area.png', w=1360, h=860):
    W, H = w * S, h * S
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    lw = int(9 * S / 3)

    def L(pts, col, wd, dash=None):
        p = [(x * S, y * S) for x, y in pts]
        if not dash:
            d.line(p, fill=col + (255,), width=int(wd * S), joint='curve')
        else:
            (x0, y0), (x1, y1) = p[0], p[1]
            n = int(((x1 - x0) ** 2 + (y1 - y0) ** 2) ** .5 / (dash * S * 2))
            for i in range(max(1, n)):
                t0, t1 = i / n, (i + 0.5) / n
                d.line([(x0 + (x1 - x0) * t0, y0 + (y1 - y0) * t0),
                        (x0 + (x1 - x0) * t1, y0 + (y1 - y0) * t1)],
                       fill=col + (255,), width=int(wd * S))

    # 도로
    for y in (250, 560):
        L([(40, y), (1320, y)], RULE, 14)
    L([(520, 40), (520, 820)], RULE, 14)
    L([(940, 40), (940, 820)], RULE, 11)
    # 블록 면
    for bx, by, bw, bh in ((70, 60, 420, 160), (570, 60, 330, 160),
                           (70, 300, 420, 230), (990, 300, 320, 230),
                           (570, 600, 330, 200), (990, 600, 320, 200)):
        d.rounded_rectangle([bx * S, by * S, (bx + bw) * S, (by + bh) * S],
                            radius=10 * S, fill=TINT + (255,))
    # 반경 원 2겹 (점선)
    cx, cy = 730, 420
    for r, wd in ((190, 5), (300, 4)):
        for k in range(0, 360, 9):
            import math
            a0 = math.radians(k)
            a1 = math.radians(k + 5)
            d.line([(cx * S + r * S * math.cos(a0), cy * S + r * S * math.sin(a0)),
                    (cx * S + r * S * math.cos(a1), cy * S + r * S * math.sin(a1))],
                   fill=BLUEL + (255,), width=int(wd * S))

    def pin(px, py, col, size=1.0):
        r = 34 * size
        d.ellipse([(px - r) * S, (py - r - 26 * size) * S,
                   (px + r) * S, (py + r - 26 * size) * S],
                  fill=col + (255,))
        d.polygon([((px - r * 0.62) * S, (py - 8 * size) * S),
                   ((px + r * 0.62) * S, (py - 8 * size) * S),
                   (px * S, (py + 34 * size) * S)], fill=col + (255,))
        rr = r * 0.36
        d.ellipse([(px - rr) * S, (py - rr - 26 * size) * S,
                   (px + rr) * S, (py + rr - 26 * size) * S], fill=(255, 255, 255, 255))

    pin(730, 420, BLUE, 1.25)
    pin(360, 250, MUTE, 0.85)
    pin(1060, 560, MUTE, 0.85)
    # 축척
    L([(70, 800), (250, 800)], MUTE, 5)
    for x in (70, 250):
        L([(x, 788), (x, 812)], MUTE, 5)

    im = im.resize((w, h), Image.LANCZOS)
    im.save(os.path.join(A, name))
    return im.size


# ══════════ 3. 로고월 그레이스케일 ══════════
def gray_logos():
    made = []
    for k in ('spc', 'samsung', 'kfa', 'barogo', 'saramin', 'forbes', 'cashnote', 'yogiyo'):
        f = os.path.join(A, f'lg_{k}.png')
        if not os.path.exists(f):
            continue
        im = Image.open(f).convert('RGBA')
        r, g, b, al = im.split()
        gy = Image.merge('RGB', (r, g, b)).convert('L')
        # 다크 면 위에 얹으므로 밝게 반전 톤으로 통일
        out = Image.merge('RGBA', (gy, gy, gy, al))
        out.save(os.path.join(A, f'lg_{k}_g.png'))
        made.append(f'lg_{k}_g.png')
    return made


if __name__ == '__main__':
    print('cover_phones.png', cover_phones())
    print('p07_area.png    ', trade_area())
    print('gray logos      ', gray_logos())


# ══════════ 4. STEP 카드용 가로 크롭 ══════════
def step_crops():
    out = []
    for src, name, top, ratio in (
            ('app_sales.png', 'p07_step1.png', 0.10, 1.45),
            ('app_report.png', 'p07_step2.png', 0.06, 1.45)):
        im = Image.open(os.path.join(A, src)).convert('RGB')
        h = int(im.width / ratio)
        y0 = min(max(0, int(im.height * top)), max(0, im.height - h))
        im = im.crop((0, y0, im.width, y0 + h))
        # 라운드 마스크 없이 그대로 — 카드 안에 넣는다
        im.save(os.path.join(A, name))
        out.append((name, im.size, round(im.size[0] / im.size[1], 4)))
    return out
