# -*- coding: utf-8 -*-
import io, os

OUT = "/tmp/claude-0/-home-user-onewillco-meeting-2026/e45e1d59-bb0f-5971-8866-2e14a767d632/scratchpad/v2/deck_v2.html"
A = "/home/user/onewillco-meeting-2026/runnerpub-proposal/assets"

DOCNAME = "내일사장 → 러너스튜디오(주) · 가맹 개설 영업 위임 제안"
TOTAL = 13

# ── 좌표 상수 ────────────────────────────────────────────────
AX = 44.0      # 계측 축선
RAIL = 194.0   # 우측 정렬선
FIELD = 150.0
MEAS = 124.4

RULE = "var(--rule)"
INK = "var(--ink)"
ORULE = "var(--on-ink-rule)"
OINK = "var(--on-ink)"


def d(cls, style, inner=""):
    return '<div class="%s" style="%s">%s</div>' % (cls, style, inner)


def hl(x, y, w, color=RULE, t=0.15):
    return d("ln", "left:%.3fmm;top:%.3fmm;width:%.3fmm;height:%.3fmm;background:%s" % (x, y, w, t, color))


def vl(x, y, h, color=RULE, t=0.15):
    return d("ln", "left:%.3fmm;top:%.3fmm;width:%.3fmm;height:%.3fmm;background:%s" % (x, y, t, h, color))


def ticks(bold=(), dark=False, split=None):
    """12mm 눈금 19칸(26~242). bold 좌표에는 1.2pt·6mm 굵은 눈금."""
    out = []
    for ty in range(26, 243, 12):
        below = (split is not None and ty >= split)
        c_w = ORULE if (dark or below) else RULE
        c_s = OINK if (dark or below) else INK
        if ty in bold:
            out.append(hl(38, ty, 6, c_s, 0.42))
        else:
            out.append(hl(41, ty, 3, c_w, 0.15))
    return "".join(out)


def axis(dark=False, split=None):
    if split is None:
        return vl(AX, 18, 224, ORULE if dark else RULE, 0.18)
    return (vl(AX, 18, split - 18, RULE, 0.18) +
            vl(AX, split, 242 - split, ORULE, 0.18))


def progress(n, dark=False):
    out = [hl(AX, 22, FIELD, ORULE if dark else RULE, 0.15)]
    step = (FIELD - 3.0) / (TOTAL - 1)
    for i in range(TOTAL):
        x = 44 + i * step
        if i == n - 1:
            c = OINK if dark else INK
        else:
            c = ORULE if dark else RULE
        out.append(d("ln", "left:%.3fmm;top:18.5mm;width:3mm;height:1.6mm;background:%s" % (x, c)))
    return "".join(out)


def pc(n, tag):
    return "P.%02d / %d<br>— %s" % (n, TOTAL, tag)


def num(v, unit, cls="fig-close", ucls="u-m", peak=False, plus=False):
    p = " fig-peak" if peak else ""
    s = '<span class="%s%s">%s</span>' % (cls, p, v)
    if unit:
        s += '<span class="%s">%s</span>' % (ucls, unit)
    if plus:
        s += '<span class="%s">+</span>' % ucls
    return s


# ── 표 빌더 ─────────────────────────────────────────────────
def table(x, y, cols, header, rows):
    w = sum(c[0] for c in cols)
    h = ""
    if header:
        cells = ""
        for (cw, al), t in zip(cols, header):
            cells += '<div class="tc%s" style="width:%.3fmm">%s</div>' % (
                " ar" if al == "r" else "", cw, t)
        h += '<div class="thr">%s</div>' % cells
    for cells_txt, rh in rows:
        cells = ""
        for (cw, al), t in zip(cols, cells_txt):
            cells += '<div class="tc%s" style="width:%.3fmm">%s</div>' % (
                " ar" if al == "r" else "", cw, t)
        h += '<div class="tdr" style="min-height:%.3fmm">%s</div>' % (rh, cells)
    return d("tblx", "left:%.3fmm;top:%.3fmm;width:%.3fmm" % (x, y, w), h)


# ── 페이지 골격 ──────────────────────────────────────────────
def sheet(no, label, coord, bold, band_l, band_r, footnotes, content,
          dark=False, split=None, panel=""):
    skel = []
    skel.append(d("lab-coord", "left:16mm;top:17.4mm;width:22mm", coord))
    skel.append(d("lab-meta", "left:16mm;top:30mm;width:20mm", label))
    skel.append(progress(no, dark))
    skel.append(axis(dark, split))
    skel.append(ticks(bold, dark, split))
    skel.append(hl(AX, 242, FIELD, ORULE if (dark or split) else INK, 0.22))
    skel.append(d("band", "left:44mm;top:246mm;width:150mm;height:12mm",
                  '<div class="band-l">%s</div><div class="band-r">%s</div>' % (band_l, band_r)))
    dc = ORULE if (dark or split) else INK
    skel.append(hl(AX, 260, FIELD, dc, 0.32))
    skel.append(hl(AX, 261.52, FIELD, dc, 0.32))
    fz = "".join('<div class="fn">%s</div>' % f for f in footnotes)
    skel.append(d("fnzone", "left:44mm;top:267.5mm;width:150mm", fz))

    if split:
        # 다크 패널 안으로 내려가는 마감 요소는 반전 세트를 쓴다
        tail = "".join(skel[-5:])
        skel = skel[:-5] + ['<div class="on-dark">%s</div>' % tail]
    cls = "sheet" + (" dark on-dark" if dark else "")
    foot = ('<div class="runfoot%s"><div class="rf-l">%s</div>'
            '<div class="rf-r">%02d&thinsp;/&thinsp;%d</div></div>') % (
        " on-dark" if (dark or split) else "", DOCNAME, no, TOTAL)
    return ('<section class="%s">%s<div class="stage">%s%s</div>%s</section>'
            % (cls, panel, "".join(skel), content, foot))


# ══════════════════════════════════════════════════════════════
def page1():
    c = []
    c.append(d("send", "left:44mm;top:27.2mm;width:100mm",
               '내일사장<span class="sub">— 창업 지원 플랫폼 · 발신</span>'))
    c.append(d("imgw", "left:173.6mm;top:26mm;width:20.4mm",
               '<img src="%s/logo.png" style="width:20.4mm;display:block">' % A))
    c.append(d("slogan", "left:104mm;top:36mm;width:90mm",
               "수신 — 러너펍 · 플랫폼이 만드는 홀덤펍의 새로운 기준"))
    c.append(hl(44, 34, 150, "var(--on-ink-rule)", 0.18))
    c.append(d("t-cover", "left:44mm;top:74mm;width:150mm",
               "러너펍의 다음 매장은<br>계약이 성사된 뒤에<br>비용이 발생합니다"))
    c.append(d("lead", "left:44mm;top:132mm;width:150mm",
               "내일사장은 창업 수요가 이미 모여 있는 창업 플랫폼입니다. 러너펍 가맹 개설 영업을 "
               "위임해 주시면, 가맹계약이 체결되고 가맹비 입금이 완료된 건에만 성공보수를 청구합니다."))
    rows = [("발신", "내일사장 — 창업 지원 플랫폼"),
            ("발신 담당", '<span class="ph">담당자명 · 연락처 · 이메일</span>'),
            ("수신", "러너스튜디오(주) 귀중"),
            ("수신 담당", "대표 박경관"),
            ("수신 주소", "서울 강남구 삼성로100길 12 제이타워 B2"),
            ("문건 성격", "가맹 개설 영업 위임 제안")]
    c.append(table(44, 158, [(46, "l"), (104, "r")], None,
                   [(('<span class="k">%s</span>' % a, b), 7) for a, b in rows]))
    c.append(d("stamp", "left:44mm;top:230mm;width:60mm", "2026.07"))
    frame = (d("imgw", "left:2mm;top:2.9mm;width:22mm",
                '<img src="%s/card.png" style="width:22mm;display:block">' % A)
             + hl(0, 0, 7, "var(--on-ink-weak)", 0.22)
             + vl(0, 0, 7, "var(--on-ink-weak)", 0.22)
             + d("ln", "right:0;bottom:0;width:7mm;height:0.22mm;background:var(--on-ink-weak)")
             + d("ln", "right:0;bottom:0;width:0.22mm;height:7mm;background:var(--on-ink-weak)"))
    c.append(d("frame", "left:168mm;top:203mm;width:26mm;height:37.3mm", frame))
    return sheet(1, "COVER · 제안 개요", pc(1, "COVER"), (26, 62, 86, 158),
                 '계약 전 본사 부담 <span class="bv">0원</span>'
                 '&nbsp;&nbsp;/&nbsp;&nbsp;계약 시점 순증',
                 '<span class="u-m">+</span>' + num("500", "만원"),
                 ["본 제안은 계약서가 아니며 협의를 위한 제안 자료입니다.",
                  "발신 담당자 정보는 본사 제출본에 기입합니다."],
                 "".join(c), dark=True)


def page2():
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "러너펍의 개설 인프라는 이미 완비되어 있습니다.<br>"
               "출점 속도를 결정하는 변수는 창업자 접점입니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "러너러너 앱이 예약부터 정산까지 운영을 표준화했고, 본사 검증 점포 추천과 가맹 "
               "절차 9단계로 계약에서 오픈까지 4~6주가 확보되어 있습니다. 계약 이후를 받쳐 주는 "
               "구조는 이미 자리 잡았습니다."))
    left = ['<div class="ch">이미 갖춰진 것</div>',
            '<div class="cr tall"><div class="rl">러너러너 앱</div>'
            '<div class="cap">예약·회원관리·정산·토너먼트·<br>포스터생성·핸디랭킹·음료주문</div></div>',
            '<div class="cr">본사 검증 점포 추천</div>',
            '<div class="cr">준법 운영 체계</div>',
            '<div class="cr">가맹 절차 9단계</div>',
            '<div class="cr">계약→오픈 4~6주</div>',
            '<div class="cr tall2"><div class="rl">브랜드 이벤트</div>'
            '<div class="cap">래빗 페스티벌·시즌 랭킹전·<br>매장 간 콜라보</div></div>']
    c.append(d("blk", "left:44mm;top:86mm;width:73.2mm", "".join(left)))
    right = ['<div class="ch">남은 변수</div>',
             '<div class="cr tall"><div class="rl">계약 가능한 창업자 모수</div>'
             '<div class="cap">계약 이전 구간의 접점 총량</div></div>',
             '<div class="cr"></div>', '<div class="cr"></div>']
    c.append(d("blk", "left:120.8mm;top:86mm;width:73.2mm", "".join(right)))
    c.append(d("cap abs", "left:120.8mm;top:130mm;width:73.2mm",
               "본사 내부 영업으로 커버되는 범위는 본사 판단에 따르며, 내일사장은 그 위에 "
               "접점을 더합니다."))
    c.append(vl(119, 86, 70, RULE, 0.15))
    c.append(d("lab-data abs", "left:44mm;top:170mm;width:73.2mm", "리뉴얼 후 플랫폼 서비스 이용자"))
    c.append(d("blk", "left:44mm;top:176mm;width:73.2mm", num("1.5", "배", "fig-l", "u-l")))
    c.append(d("gauge", "left:44mm;top:191mm;width:55mm;height:3mm;background:var(--data-return)"))
    c.append(d("cap abs", "left:44mm;top:196mm;width:73.2mm", "IT비즈뉴스 2024.7.4 보도 기준"))
    c.append(d("imgw", "left:146.4mm;top:170mm;width:46mm",
               '<img src="%s/ranking.png" style="width:46mm;display:block">' % A))
    c.append(d("cap abs", "left:146.4mm;top:219mm;width:47.6mm", "러너러너 앱 화면"))
    c.append(d("body abs", "left:44mm;top:230mm;width:124.4mm",
               "내일사장이 담당하는 구간은 계약 이전의 창업자 접점 하나입니다."))
    return sheet(2, "진단 · 남은 변수", pc(2, "진단"), (26, 62, 86, 170),
                 "병목 항목 · 계약→오픈",
                 '<span class="u-m">남은 변수</span>' + num("1", "개")
                 + '<span class="u-m">&nbsp;·&nbsp;</span>' + num("4~6", "주"),
                 ["러너러너 앱 운영사는 (주)러너소프트로 러너스튜디오(주)와 별개 법인입니다.",
                  "앱 리뉴얼 후 이용자 1.5배 증가 — IT비즈뉴스 2024.7.4 보도."],
                 "".join(c))


def page3():
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "창업 수요를 새로 만들지 않습니다.<br>모수를 만드는 비용과 시간은 이미 지불됐습니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "내일사장은 생성형 AI 기반 창업 지원 플랫폼입니다. 아래 일곱 개 지표는 이번 제안 "
               "이전에 이미 확보된 값이며, 모수를 새로 만드는 구간의 비용과 시간이 지금 시점에 "
               "이미 지불되어 있습니다."))
    c.append(d("lab-data abs", "left:44mm;top:86mm;width:124.4mm", "누적 매물 거래 규모"))
    c.append(d("blk", "left:44mm;top:92mm;width:150mm",
               num("1,600", "억원", "fig-xl", "u-xl", plus=True)))
    mets = [("앱 누적 다운로드", "100,000", "건", True),
            ("월간 활성 이용자(MAU)", "50,000", "명", True),
            ("누적 매물 등록", "10,000", "건", True),
            ("누적 거래 성사", "2,000", "건", True),
            ("B2B 제휴 브랜드·파트너", "80", "개", True),
            ("평균 리드타임 단축", "60", "%", False)]
    for i, (lab, v, u, plus) in enumerate(mets):
        r, col = divmod(i, 2)
        x = 44 + col * 76.8
        y = 134 + r * 19
        inner = (hl(0, 0, 73.2, RULE, 0.15)
                 + d("lab-data abs", "left:0;top:1.8mm", lab)
                 + d("blk", "left:0;top:7mm", num(v, u, "fig-l", "u-l", plus=plus)))
        c.append(d("cell", "left:%.3fmm;top:%.3fmm;width:73.2mm;height:19mm" % (x, y), inner))
    c.append(d("cap abs", "left:44mm;top:193mm;width:150mm",
               "B2B 제휴 80개+는 브랜드별 영업 프로세스가 이미 표준화되어 있다는 뜻입니다. "
               "러너펍은 전담 담당자를 지정해 운영합니다."))
    qual = ["생성형 AI 기반 창업 지원 플랫폼",
            "세종대학교 겸임교수진이 설립",
            "무자격 컨설턴트의 불법·허위 중개 피해 예방이 설립 취지"]
    c.append(d("blk", "left:44mm;top:204mm;width:124.4mm",
               "".join('<div class="body">%s</div>' % q for q in qual)))
    c.append(d("body abs", "left:44mm;top:230mm;width:150mm",
               "이 모수는 위임 시점에 이미 존재합니다. 다만 홀덤 업종 단독 실적은 아니며, "
               "업종 경험을 대체하는 장치는 P.13에 별도로 정리했습니다."))
    return sheet(3, "축 01 · 확보된 모수", pc(3, "축 01"), (26, 62, 86, 134, 206),
                 "누적 매물 거래 규모", num("1,600", "억원", peak=True, plus=True),
                 ["지표는 내일사장 플랫폼 전체 누적 기준이며 홀덤 업종 단독 실적이 아닙니다."],
                 "".join(c))


def page4():
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "관심을 계약으로 바꾸는 절차가<br>사내에서 이미 돌아갑니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "AI 상권분석과 손익분석을 통과한 리드만 본사에 넘깁니다. 리드는 ERP에서 관리되고 "
               "공인중개사 제휴망을 통해 점포까지 이어지며, 내일사장 플랫폼 누적 기준 평균 "
               "리드타임은 60% 단축되었습니다."))
    st = [("01", "수요·매물 유입", "플랫폼 유입 수요"),
          ("02", "AI 상권분석", "입지·유동·경합 점포 검토"),
          ("03", "손익분석", "임대 조건·초기 투자금·자기자본 대비 P&amp;L 검토"),
          ("04", "매물 브리핑", "공인중개사 제휴망(리맥스코리아 등)"),
          ("05", "본사 검증<br>점포 추천", "계약")]
    for i, (n, lab, desc) in enumerate(st):
        x = 44 + i * 30.6
        inner = (hl(0, 0, 27.6, INK, 0.22)
                 + d("st-n", "left:0;top:2mm", n)
                 + d("st-l", "left:0;top:7mm;width:27.6mm", lab)
                 + d("cap abs", "left:0;top:15mm;width:27.6mm", desc))
        c.append(d("cell", "left:%.3fmm;top:86mm;width:27.6mm;height:24mm" % x, inner))
        if i < 4:
            c.append(hl(44 + 27.6 + i * 30.6, 87.6, 3, RULE, 0.15))
    c.append(table(44, 122, [(40, "l"), (110, "l")], ["체계", "역할"],
                   [(("ERP 리드관리", "리드 최초 유입 경로 기준 실적 구분"), 9),
                    (("점포개발", "본사 검증 점포 추천 공정과 연계"), 9)]))
    c.append(d("lab-data abs", "left:44mm;top:158mm;width:150mm",
               "평균 리드타임 — 내일사장 플랫폼 누적 기준"))
    c.append(d("blk", "left:44mm;top:163.5mm;width:150mm",
               num("60", "%", "fig-l", "u-l") + '<span class="u-l">단축</span>'))
    c.append(d("cap abs", "left:44mm;top:177mm;width:150mm",
               "내일사장 플랫폼 누적 기준이며 러너펍 개설 사례 기준값이 아닙니다."))
    c.append(d("ch2", "left:44mm;top:194mm;width:73.2mm", "러너러너 — 운영"))
    c.append(d("cap abs", "left:44mm;top:200.5mm;width:73.2mm",
               "예약·회원관리·정산·토너먼트<br>포스터생성·핸디랭킹·음료주문"))
    c.append(d("ch2", "left:120.8mm;top:194mm;width:73.2mm", "내일사장 — 개설 영업"))
    c.append(d("cap abs", "left:120.8mm;top:200.5mm;width:73.2mm",
               "AI 상권분석·손익분석·매물 브리핑<br>ERP 리드관리·공인중개사 제휴망·점포개발"))
    c.append(hl(44, 211, 150, RULE, 0.15))
    c.append(d("cap abs", "left:44mm;top:213mm;width:150mm",
               "두 자산은 겹치지 않고 이어붙습니다."))
    c.append(d("body abs", "left:44mm;top:230mm;width:150mm",
               "리드 통과 기준 항목은 본사와 사전 합의한 체크리스트를 사용하며, 기준에 미달한 "
               "리드는 본사에 전달하지 않습니다."))
    return sheet(4, "축 01 · 리드 처리 능력", pc(4, "축 01"), (26, 62, 86, 122, 158, 194),
                 "평균 리드타임 단축", num("60", "%"),
                 ["내일사장 플랫폼 누적 기준이며 러너펍 개설 사례 기준값이 아닙니다."],
                 "".join(c))


def page5():
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "착수금도 월 고정비도<br>광고비도 청구하지 않습니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "청구는 가맹계약이 체결되고 가맹비 입금이 확인된 뒤에만 발생합니다. 그 이전 "
               "구간에서 본사가 부담하는 현금은 0원입니다."))
    z = '<span class="zero">0원</span>'
    c.append(table(44, 86, [(34, "l"), (78, "l"), (38, "r")], ["항목", "발생 시점", "금액"],
                   [(("착수금", "해당 없음", z), 8),
                    (("월 고정비", "해당 없음", z), 8),
                    (('광고비<span class="ast">★</span>', "해당 없음", z), 8),
                    (("성공보수", "가맹계약 체결 및 가맹비 입금 완료 후",
                      num("1,000", "만원", "fig-s", "u-s")), 8)]))
    c.append(d("cap abs", "left:44mm;top:125.5mm;width:150mm",
               "성공보수는 부가가치세 별도입니다. 광고비 항목은 하단 각주 ★를 참조하십시오."))
    items = [("착수금", 0), ("월 고정비", 0), ("광고비", 0), ("성공보수", 100)]
    for i, (lab, ln) in enumerate(items):
        y = 134 + i * 9
        c.append(d("lab-data abs", "left:44mm;top:%.3fmm;width:30mm" % y, lab))
        if ln > 0:
            c.append(d("gauge", "left:76mm;top:%.3fmm;width:100mm;height:3.4mm;"
                                "background:var(--data-cost)" % (y + 0.2)))
            c.append(d("vlab", "left:44mm;top:%.3fmm;width:150mm" % (y - 2.6),
                       num("1,000", "만원", "fig-s", "u-s")))
        else:
            c.append(d("ln", "left:76mm;top:%.3fmm;width:6mm;height:3.4mm;"
                             "background:transparent;"
                             "box-shadow:inset 0 0 0 0.18mm var(--rule)" % (y + 0.2)))
            c.append(d("vlab", "left:84.5mm;top:%.3fmm;width:40mm;text-align:left"
                       % (y - 1.4), z))
    pts = [("리드 유입", 44), ("상담·분석", 94), ("가맹계약 체결", 144)]
    for lab, x in pts:
        c.append(d("lab-data abs", "left:%.3fmm;top:176mm;width:46mm" % x, lab))
        c.append(vl(x, 184.4, 3.2, RULE, 0.15))
    c.append(d("lab-data abs ar", "left:134mm;top:176mm;width:60mm", "가맹비 입금 완료"))
    c.append(d("dash", "left:44mm;top:185.9mm;width:100mm;height:0.22mm"))
    c.append(hl(144, 185.9, 50, INK, 0.22))
    c.append(d("ln", "left:191mm;top:185.2mm;width:3mm;height:1.6mm;background:var(--ink)"))
    c.append(d("lab-data abs ar", "left:124mm;top:189.5mm;width:70mm", "청구 시작점"))
    c.append(d("cap abs", "left:44mm;top:189.8mm;width:96mm", "이 구간 비용 발생 없음"))
    c.append(table(44, 200, [(40, "l"), (110, "l")], None,
                   [(('<span class="k">성공보수 지급 시점</span>',
                      "가맹비 입금 확인 후 본사가 정하는 지급일"), 9),
                    (('<span class="k">계약 해제·환불 시</span>',
                      "오픈 전 가맹계약 해제 또는 가맹비 환불이 발생하면 해당 건 성공보수를 "
                      "전액 반환하며, 반환 절차와 기한은 본사 기준을 따릅니다"), 12)]))
    c.append(d("body abs", "left:44mm;top:225mm;width:150mm",
               "미계약 건에 발생한 원가는 전부 내일사장이 부담합니다. 브랜드 노출·준법 등 현금 외 "
               "리스크는 준법 운영 장(P.10)에서 통제 방식으로 답합니다."))
    return sheet(5, "축 02 · 비용 발생 구조", pc(5, "조건 01"), (26, 62, 86, 134, 170, 206),
                 "계약·입금 완료 전 본사 부담", num("0", "원"),
                 ["러너펍 공개 가맹 안내 기준 시뮬레이션이며 실제 조건은 본사 정책에 따릅니다.",
                  "개설 기본비용 1,600만원(오픈지원비 100 + 교육비 300 + 계약이행보증금 1,000 "
                  "+ 설계감리비 200)은 전액 할인 프로모션 중입니다.",
                  "★ 네고로 내일사장 수취가 800만원 이하가 되는 경우 해당 매장 LSM 광고 집행 "
                  "주체는 본사로 이동합니다(P.06 참조)."],
                 "".join(c))


def page6():
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "창업자가 깎은 금액은 전액<br>내일사장 성공보수에서 차감합니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "네고가 어디까지 진행되든 본사 수취액은 가맹비 1,500만원 그대로입니다. 줄어드는 "
               "구간은 내일사장 성공보수 하나이며, LSM 광고 집행 주체도 수취 구간별로 미리 정해 "
               "두었습니다."))
    scen = [("네고 없음", 100.0, "성공보수 1,000"),
            ("네고 발생", 60.0, "1,000 − 할인액"),
            ("네고 최대", 0.0, "성공보수 0 · 할인액 최대 1,000")]
    for i, (lab, cl, vtxt) in enumerate(scen):
        y = 86 + i * 14
        c.append(d("bar", "left:44mm;top:%.3fmm;width:150mm;height:9mm;"
                          "background:var(--data-return)" % y,
                   '<div class="bar-l">%s</div><div class="bar-r">가맹비 1,500만원</div>' % lab))
        c.append(d("ln", "left:94mm;top:%.3fmm;width:100mm;height:4mm;"
                         "background:var(--data-void)" % (y + 10)))
        if cl > 0:
            c.append(d("gauge", "left:%.3fmm;top:%.3fmm;width:%.3fmm;height:4mm;"
                                "background:var(--data-cost)" % (194 - cl, y + 10, cl)))
        c.append(d("cap abs ar", "left:44mm;top:%.3fmm;width:48mm" % (y + 9.8), vtxt))
    c.append(vl(194, 86, 42, INK, 0.22))
    c.append(d("cap abs", "left:44mm;top:130.5mm;width:150mm",
               '<span class="mk" style="background:var(--data-return)"></span>본사 수취 '
               '&nbsp;&nbsp;<span class="mk"></span>내일사장 성공보수 '
               '&nbsp;&nbsp;<span class="mk" style="background:var(--data-void)"></span>'
               '창업자 할인액'))
    c.append(d("cap abs", "left:44mm;top:134.5mm;width:150mm",
               "본사 수취 1,500만원은 세 경우 모두 동일합니다."))
    c.append(table(44, 140, [(40, "l"), (58, "r"), (52, "r")],
                   ["시나리오", "내일사장 성공보수", "본사 수취"],
                   [(("네고 없음", '<span class="neg">(1,000)</span>',
                      num("1,500", "만원", "fig-s", "u-s")), 9),
                    (("네고 발생", '<span class="neg">(1,000 − 할인액)</span>',
                      num("1,500", "만원", "fig-s", "u-s")), 9),
                    (("네고 최대", '<span class="zero">0</span>',
                      num("1,500", "만원", "fig-s", "u-s")), 9)]))
    c.append(table(44, 180, [(60, "l"), (34, "l"), (56, "l")],
                   ["내일사장 수취 구간", "집행 주체", "LSM 집행 금액"],
                   [(("1,000만원 전액 수취", "내일사장 집행",
                      '<span class="mk"></span>200만원'), 9),
                    (("800만원 이하", "본사 집행", "협의 — 상한 200만원 기준"), 9),
                    (("800만원 초과~1,000만원 미만", "협의", "집행 주체·금액 협의"), 9)]))
    c.append(d("ch2", "left:44mm;top:221mm;width:150mm", "인테리어 시공 — 이해상충 방지 기준"))
    icw = ["① 시공은 본사 지정 스펙과 설계감리 승인 범위 안에서만 수행합니다.",
           "② 시공 참여 여부는 창업자에게 제시되는 가맹 조건에 영향을 주지 않습니다.",
           "③ 개설 과정 추가 수익 분배는 시공 착수 전 별도로 합의합니다."]
    c.append(d("blk", "left:44mm;top:227.5mm;width:150mm",
               "".join('<div class="cap">%s</div>' % t for t in icw)))
    return sheet(6, "축 02 · 변동 방어", pc(6, "조건 02"), (26, 62, 86, 140, 180, 218),
                 "네고 여하에 불구 본사 수취",
                 num("1,500", "만원") + '<span class="u-m">불변</span>'
                 + '<div class="bandcap">LSM 집행 주체는 수취 구간에 따라 달라집니다</div>',
                 ["러너펍 공개 가맹 안내 기준 시뮬레이션이며 실제 조건은 본사 정책에 따릅니다.",
                  "본사 수취 1,500만원은 가맹비 기준이며, LSM 광고 집행 주체가 본사로 이동하는 "
                  "구간에서는 집행비가 별도로 발생합니다."],
                 "".join(c))


def page_alt():
    """축 02 · 대안 비용 비교 — 성공보수 1,000만원의 근거."""
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "성공보수 1,000만원은<br>본사가 쓰지 않게 되는 비용입니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "자체 영업은 계약이 0건인 기간에도 인건비와 광고비가 계속 발생합니다. 위임은 계약 "
               "이전 전 구간에서 본사 지출이 0원이고, 계약이 성사된 건에만 1,000만원이 "
               "청구됩니다."))
    lft = [("고정 인건비", "계약이 0건인 달에도 발생"),
           ("월 광고비", "리드가 없는 기간에도 발생"),
           ("미계약 건 원가", "전액 본사 부담"),
           ("지출 발생 시점", "계약 여부와 무관")]
    rgt = [("착수금·월 고정비", "0원 — 발생 항목 자체가 없음"),
           ("광고비", "0원 — 발생 항목 자체가 없음"),
           ("미계약 건 원가", "전액 내일사장 부담"),
           ("지출 발생 시점", "가맹계약 체결·가맹비 입금 후")]
    def col(head, rows):
        out = ['<div class="ch">%s</div>' % head]
        for a, b in rows:
            out.append('<div class="cr"><div class="rl">%s</div>'
                       '<div class="cap">%s</div></div>' % (a, b))
        return "".join(out)
    c.append(d("blk", "left:44mm;top:86mm;width:73.2mm", col("본사 자체 영업", lft)))
    c.append(d("blk", "left:120.8mm;top:86mm;width:73.2mm", col("내일사장 위임", rgt)))
    c.append(vl(119, 86, 42, RULE, 0.15))
    c.append(d("cap abs", "left:44mm;top:130mm;width:150mm",
               "미계약 상태에서도 계속 나가는 비용과, 계약된 건에만 나가는 비용의 차이입니다. "
               "자체 영업 금액은 본사 내부 자료이므로 발생 조건만 비교했습니다."))
    c.append(table(44, 140, [(46, "l"), (56, "l"), (48, "l")],
                   ["성공보수가 부담하는 구간", "수행 내용", "원가 선부담"],
                   [(("리드 획득", "플랫폼·앱 유입 수요에서 발굴", "내일사장"), 9),
                    (("AI 상권분석·손익분석", "입지·P&amp;L 검토", "내일사장"), 9),
                    (("매물 브리핑", "공인중개사 제휴망 연계", "내일사장"), 9),
                    (("상담·계약 동행", "전환 상담부터 계약까지", "내일사장"), 9),
                    (("미계약 종결", "위 원가 전액 손실 처리", "내일사장"), 9)]))
    c.append(d("body abs", "left:44mm;top:198mm;width:150mm",
               "개설 1건이 N개월 앞당겨지면 월 로열티 150만원 × N개월이 추가로 발생하며, 이 "
               "금액이 성공보수를 상쇄하는 시점이 있습니다. N은 본사 출점 계획에 맞춰 함께 "
               "산정합니다."))
    c.append(d("body abs", "left:44mm;top:222mm;width:150mm",
               "성공보수 1,000만원은 본사가 자체 영업으로 부담해야 할 인건비·광고비·미계약 건 "
               "원가를 대체하는 금액이며, 계약이 성사되지 않으면 청구되지 않습니다."))
    return sheet(7, "축 02 · 대안 비용", pc(7, "조건 02"), (26, 62, 86, 140, 194, 218),
                 "계약 0건인 기간 본사 지출", num("0", "원"),
                 ["성공보수 가맹계약 1건당 1,000만원(부가가치세 별도)은 내일사장 제안 조건입니다.",
                  "자체 영업 비용은 본사 내부 자료 사항이므로 금액을 표기하지 않고 발생 조건만 "
                  "비교했습니다."],
                 "".join(c))


def page7():
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "가맹비 안에서 정산하므로,<br>계약이 체결되는 시점에 이미 흑자입니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "가맹비 1,500만원에서 성공보수 1,000만원을 정산하면 계약 시점에 500만원이 "
               "남습니다. 성공보수가 가맹비 범위 안에서 처리되므로 본사에는 회수를 기다리는 "
               "기간이 없습니다."))
    steps = [("가맹비", 44.0, 150.0, "var(--data-return)", num("1,500", "만원", "fig-s", "u-s")),
             ("성공보수", 94.0, 100.0, "var(--data-cost)", '<span class="neg">(1,000)</span>'),
             ("계약 시점 잔액", 44.0, 50.0, "var(--data-return)",
              '<span class="u-s">+</span>' + num("500", "만원", "fig-s", "u-s"))]
    for i, (lab, bx, bw, bg, val) in enumerate(steps):
        y = 86 + i * 18
        c.append(d("bar", "left:%.3fmm;top:%.3fmm;width:%.3fmm;height:9mm;background:%s"
                   % (bx, y, bw, bg), '<div class="bar-l">%s</div>' % lab))
        c.append(d("vlab", "left:%.3fmm;top:%.3fmm;width:%.3fmm" % (bx, y + 9.4, bw), val))
    c.append(hl(44, 141, 150, RULE, 0.15))
    c.append(table(44, 146, [(52, "l"), (46.8, "r")], None,
                   [(("가맹비", num("1,500", "만원", "fig-s", "u-s")), 9),
                    (("성공보수", '<span class="neg">(1,000)</span>'), 9)]))
    c.append(hl(44, 166, 98.8, INK, 0.22))
    c.append(table(44, 166.5, [(52, "l"), (46.8, "r")], None,
                   [(('<span class="k">계약 시점 순증</span>',
                      '<span class="u-s">+</span>' + num("500", "만원", "fig-s", "u-s")), 9)]))
    for sy, sg in ((146.0, "+"), (155.0, "−"), (166.5, "+")):
        c.append(d("sg abs", "left:144.5mm;top:%.3fmm;width:8mm;height:9mm" % sy, sg))
    c.append(d("cap abs", "left:44mm;top:178mm;width:150mm", "본사 순현금 흐름"))
    c.append(d("lab-data abs", "left:44mm;top:194mm;width:124.4mm", "계약 시점 본사 순증"))
    c.append(d("blk", "left:44mm;top:199.5mm;width:150mm",
               '<span class="fig-m">+500</span><span class="u-m">만원</span>'))
    c.append(d("body abs", "left:44mm;top:220mm;width:124.4mm",
               "계약 시점 이후에는 월 로열티 150만원(부가가치세 별도)이 순증으로 쌓입니다. 이 값이 "
               "다음 페이지 36개월 누적의 기준선입니다."))
    return sheet(8, "축 03 · 계약 시점 수지", pc(8, "조건 03"), (26, 62, 86, 146, 194, 218),
                 "계약 시점 본사 순증",
                 '<span class="u-m">+</span><span class="fig-close fig-peak">500</span>'
                 '<span class="u-m">만원</span>',
                 ["러너펍 공개 가맹 안내 기준 시뮬레이션이며 실제 조건은 본사 정책에 따릅니다."],
                 "".join(c))


def page8():
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "1개점 36개월 5,900만원,<br>10개점이면 5억 9,000만원입니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "계약 시점 +500만원 위에 월 로열티 150만원이 순증으로 쌓입니다. 12개월 "
               "2,300만원, 24개월 4,100만원, 36개월 5,900만원이며, 규모별 누계는 이 값에 출점 "
               "수를 곱한 값입니다."))
    base = 146.0
    cols = [("계약 시점", 3.73, "+500"), ("12개월", 17.2, "2,300"),
            ("24개월", 30.6, "4,100"), ("36개월", 44.0, "5,900")]
    for i, (lab, h, val) in enumerate(cols):
        x = 44 + i * 37.5
        if h > 0:
            c.append(d("ln", "left:%.3fmm;top:%.3fmm;width:37.5mm;height:%.3fmm;"
                             "background:var(--data-return)" % (x, base - h, h)))
            c.append(d("blk", "left:%.3fmm;top:%.3fmm;width:37.5mm" % (x, base - h - 12),
                       num(val, "만원", "fig-l", "u-l")))
        c.append(d("lab-data abs", "left:%.3fmm;top:147.5mm;width:37.5mm" % x, lab))
    c.append(hl(44, base, 150, RULE, 0.15))
    comp = [("3개점", 45.0, "var(--data-return-3)", "1", "억", "7,700"),
            ("5개점", 75.0, "var(--data-return-2)", "2", "억", "9,500"),
            ("10개점", 150.0, "var(--data-return)", "5", "억", "9,000")]
    for i, (lab, w, bg, a, u1, b) in enumerate(comp):
        y = 158 + i * 15
        c.append(d("lab-data abs", "left:44mm;top:%.3fmm;width:70mm" % y, lab + " · 36개월 누계"))
        c.append(d("vlab", "left:44mm;top:%.3fmm;width:150mm" % (y - 1.2),
                   num(a, u1, "fig-s", "u-s") + num("&thinsp;" + b, "만원", "fig-s", "u-s")))
        c.append(d("gauge", "left:44mm;top:%.3fmm;width:%.3fmm;height:8mm;background:%s"
                   % (y + 6, w, bg)))
    c.append(d("cap abs", "left:44mm;top:205mm;width:150mm",
               "10개점은 상한 예시이며 출점 수는 본사 정책에 따릅니다.<br>"
               "전제: 가맹비 1,500만원 − 성공보수 1,000만원, 월 로열티 150만원 순증 기준.<br>"
               "전제: 출점 규모별 누계는 1개점 36개월 5,900만원에 출점 수를 곱한 값입니다.<br>"
               "전제: 36개월간 가맹계약 존속·로열티 정상 납부, 폐점·중도해지 미반영."))
    c.append(d("body abs", "left:44mm;top:223mm;width:150mm",
               "위임의 성과는 동일 조건이 반복될 경우 산식상 출점 수에 비례합니다. 개설 1건이 늘 "
               "때마다 같은 폭의 순증이 더해집니다."))
    return sheet(9, "축 03 · 36개월 누적", pc(9, "조건 03"), (26, 62, 86, 158, 206),
                 "10개점 36개월 누계",
                 '<span class="fig-close fig-peak">5</span><span class="u-m">억</span>'
                 '<span class="fig-close fig-peak">&thinsp;9,000</span><span class="u-m">만원</span>',
                 ["러너펍 공개 가맹 안내 기준 시뮬레이션이며 실제 조건은 본사 정책에 따릅니다."],
                 "".join(c))


def page_law():
    """준법 운영 · 리드 귀속."""
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "브랜드와 준법 책임은<br>본사 기준을 그대로 적용합니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "내일사장은 무자격 컨설턴트의 불법·허위 중개 피해를 예방하기 위해 설립된 "
               "플랫폼입니다. 정보제공 책임이 본사에 귀속되는 항목은 본사가 직접 수행하고, "
               "내일사장은 보조 범위 안에서만 움직입니다."))
    c.append(table(44, 86, [(44, "l"), (106, "l")], ["준법 운영 기준", "적용 방식"],
                   [(("정보공개서·현황문서", "본사가 제공, 내일사장은 전달·설명 보조만 수행"), 9),
                    (("법정 숙려기간", "체결 전 숙려기간 준수, 기간 단축 유도 금지"), 9),
                    (("예상매출 진술", "예상매출·수익 구두 약속 금지, 본사 승인 문구만 사용"), 9),
                    (("사전 승인", "광고 소재·상담 스크립트는 본사 사전 승인 후 사용"), 9),
                    (("표현 기준", "사행성 오해 소지 표현 금지 목록은 본사 기준 적용"), 9),
                    (("위반 확인 시", "해당 건 영업 즉시 중단, 성공보수 미청구"), 9)]))
    c.append(table(44, 154, [(44, "l"), (106, "l")], ["리드 귀속 규칙", "기준"],
                   [(("귀속 기준 시점", "내일사장이 ERP에 등록하고 본사에 통보한 시점"), 9),
                    (("선등록 우선", "통보 시점에 본사 DB에 동일 연락처가 있으면 본사 귀속"), 9),
                    (("귀속 유효기간", "본사가 정하는 기간, 만료 후 처리도 본사 기준에 따름"), 9),
                    (("이견 처리", "주 단위 리포트 수령 후 이의제기 기한 내 협의, 최종 판정은 "
                                "본사 확인 자료 기준"), 9)]))
    c.append(d("body abs", "left:44mm;top:206mm;width:150mm",
               "홀덤펍은 사행성 오해가 상시 따라붙는 업종입니다. 내일사장은 본사가 정한 표현 "
               "기준과 승인 절차 밖에서 창업자를 접촉하지 않습니다."))
    c.append(d("body abs", "left:44mm;top:224mm;width:150mm",
               "기존 홀덤펍 리브랜딩 트랙은 기존 계약 종료·해지 절차 완료가 확인된 점주만 "
               "접촉하며, 미종료 점주 대상 전환 권유는 하지 않습니다."))
    return sheet(10, "준법 · 리드 귀속", pc(10, "통제"), (26, 62, 86, 154, 206),
                 "준법 위반 확인 시 · 해당 건 성공보수",
                 '<span class="fig-close" style="font-size:15pt">미청구</span>',
                 ["무자격 컨설턴트의 불법·허위 중개 피해 예방이 내일사장 설립 취지입니다.",
                  "숙려기간·이의제기 기한 등 구체 일수는 본사 준법 기준에 맞춰 확정합니다."],
                 "".join(c))


def page9():
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "신규 창업자와 기존 홀덤펍 리브랜딩,<br>두 트랙을 동시에 엽니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "영업 대상은 한 갈래가 아닙니다. 신규 창업자는 플랫폼 유입 수요에서 만들고, 기존 "
               "홀덤펍은 즉시 전환형 리브랜딩으로 접근합니다. 계약 체결 이후 오픈까지는 본사 기준 "
               "4~6주이며, 계약 이전 영업 구간은 리드 상황에 따라 달라집니다."))
    c.append(d("bar", "left:44mm;top:88mm;width:150mm;height:8mm;background:var(--data-void)",
               '<div class="bar-l" style="color:var(--ink)">영업·상담 구간 — 기간 미확정</div>'
               '<div class="bar-r" style="color:var(--ink);opacity:.72">D+0 이전</div>'))
    wlab = ["D+0 계약", "D+1주", "D+2주", "D+3주", "D+4주", "D+5주"]
    for i, t in enumerate(wlab):
        c.append(d("lab-data abs", "left:%.3fmm;top:102mm;width:25mm" % (44 + i * 25), t))
    for i in range(7):
        c.append(vl(44 + i * 25, 108, 31, RULE, 0.15))
    lanes = [("신규 창업자 — 플랫폼 유입 수요 기반", 150.0, 111.0),
             ("기존 홀덤펍 리브랜딩 — 즉시 전환형", 100.0, 125.0)]
    for lab, w, y in lanes:
        c.append(d("bar", "left:44mm;top:%.3fmm;width:%.3fmm;height:10mm;"
                          "background:var(--data-return)" % (y, w),
                   '<div class="bar-l">%s</div>' % lab))
        c.append(d("ln", "left:%.3fmm;top:%.3fmm;width:3mm;height:1.6mm;background:var(--ink)"
                   % (44 + w - 6, y + 4.2)))
    c.append(d("lab-data abs ar", "left:124mm;top:138mm;width:70mm", "오픈 4~6주"))
    for i in range(6):
        c.append(d("tri", "left:%.3fmm;top:143mm" % (44 + i * 25 + 11)))
    c.append(d("lab-data abs", "left:44mm;top:147mm;width:150mm", "주 단위 리포트 발행"))
    c.append(d("lab-data abs", "left:44mm;top:158mm;width:150mm", "가맹 절차 9단계"))
    for i in range(9):
        x = 44 + i * 16.667
        c.append(vl(x, 163.5, 3.4, RULE, 0.15))
        c.append(d("stepn", "left:%.3fmm;top:168.5mm;width:16.667mm" % x, "%02d" % (i + 1)))
    c.append(hl(44, 167, 150, RULE, 0.15))
    c.append(table(44, 178, [(26, "l"), (70, "l"), (54, "l")],
                   ["구분", "신규 창업자", "기존 홀덤펍 리브랜딩"],
                   [(("접점", "플랫폼 유입 수요", "즉시 전환 대상"), 8),
                    (("절차", "상권·손익분석 → 매물 브리핑 → 계약", "전환 상담 → 계약"), 8),
                    (("특성", "모수 기반", "계약→오픈 기간 그대로 활용"), 8),
                    (("전제 조건", "본사 검증 점포 추천 절차 준수",
                      "기존 계약 종료 확인 후 접촉"), 8)]))
    opl = ["— 러너펍 전담 담당자 지정",
           "— 홀덤펍 업종 내 경합 브랜드 동시 수임 제한(적용 범위 본사 협의)",
           "— 미종료 계약 점주 대상 전환 권유 금지"]
    opr = ["— 주 단위 리포트에 신규 리드 수·상담 진행 수·단계별 파이프라인 건수 포함",
           "— 기존 러너펍 가맹점 영업권 보호는 본사 상권 정책을 그대로 적용",
           "— 본사 검증 점포 추천 절차 연계"]
    c.append(d("blk", "left:44mm;top:221mm;width:73.2mm",
               "".join('<div class="cap">%s</div>' % o for o in opl)))
    c.append(d("blk", "left:120.8mm;top:221mm;width:73.2mm",
               "".join('<div class="cap">%s</div>' % o for o in opr)))
    return sheet(11, "실행 · 2트랙 · 4~6주", pc(11, "실행"), (26, 62, 86, 158, 178, 218),
                 "<strong>계약→오픈</strong> · 보고 주기",
                 num("4~6", "주") + '<span class="u-m">&nbsp;·&nbsp;주 단위</span>',
                 ["러너펍 공개 가맹 안내 기준.",
                  "4~6주는 가맹계약 체결 이후 오픈까지의 기간이며 계약 이전 영업 구간은 포함하지 "
                  "않습니다."], "".join(c))


def page10():
    """제안 조건 정본."""
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "계약 1건당 1,000만원,<br>그 외에 본사가 부담할 항목은 없습니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "아래 표가 이번 제안의 핵심 조건이며, 위임 기간·독점 여부·영업지역·종료 조건은 "
               "본사 방침에 맞춰 확정합니다. 표에 없는 항목은 협의 대상으로 남겨 둡니다."))
    rows = [
        ("성공보수", "가맹계약 1건당 " + num("1,000", "만원", "fig-s", "u-s")
         + '<span class="u-s">(부가가치세 별도)</span>', 9),
        ("청구 조건", "계약 체결 및 가맹비 입금 완료 건에 한함. 본사가 직접 계약한 건은 "
                  "성공보수 미청구", 9),
        ("미발생 비용", "착수금·월 고정비·광고비 없음 (LSM 집행은 P.06 기준)", 9),
        ("네고 시", "할인액 전액 내일사장 성공보수에서 차감, 본사 수취액 불변", 9),
        ("LSM 광고", "내일사장 1,000만원 전액 수취 시 그중 200만원 집행 / 800만원 이하 시 "
                   "본사 집행(금액 협의) / 초과 구간 협의", 12),
        ("해제·환불 시", "오픈 전 계약 해제·가맹비 환불 시 해당 건 성공보수 전액 반환", 9),
        ("리드 귀속", "ERP 등록·본사 통보 시점 기준. 본사 DB 선등록 건은 본사 귀속 (P.10)", 9),
        ("위임 형태·기간", "독점 / 비독점, 위임 기간·연장·영업지역·종료 조건은 본사 선택", 9),
        ("인테리어 시공", "본사 지정 스펙과 설계감리 승인 범위 안에서만 진행 가능", 9),
        ("보고", "본사 승인 자료만 사용, 리드 최초 유입 경로로 실적 구분, 주 단위 리포트", 9),
    ]
    c.append(table(44, 86, [(34, "l"), (116, "l")], ["항목", "조건"],
                   [((a, b), h) for a, b, h in rows]))
    c.append(d("lab-data abs", "left:44mm;top:194mm;width:150mm", "본사 확정이 필요한 여백"))
    bl = ["— 위임 형태 (독점 / 비독점)", "— 위임 기간 및 연장 조건", "— 영업지역 범위"]
    br = ["— 실적 미달 시 종료 조건", "— 성공보수 지급일", "— 리드 귀속 유효기간"]
    c.append(d("blk", "left:44mm;top:200mm;width:73.2mm",
               "".join('<div class="cap">%s</div>' % t for t in bl)))
    c.append(d("blk", "left:120.8mm;top:200mm;width:73.2mm",
               "".join('<div class="cap">%s</div>' % t for t in br)))
    c.append(d("body abs", "left:44mm;top:218mm;width:150mm",
               "여백으로 둔 항목은 내일사장이 임의로 정하지 않습니다. 본사가 정한 값을 그대로 "
               "적용해 확정합니다."))
    return sheet(12, "조건 · 제안 정본", pc(12, "조건 정본"), (26, 62, 86, 194, 218),
                 "계약·입금 전 본사 현금 부담 · 개설 1건당 순증",
                 num("0", "원") + '<span class="u-m">&nbsp;·&nbsp;+</span>'
                 + num("500", "만원"),
                 ["러너펍 공개 가맹 안내 기준 시뮬레이션이며 실제 조건은 본사 정책에 따릅니다."],
                 "".join(c))


def page_close():
    """CLOSE · 검증 방식 + 업종 경험 보완 장치."""
    c = []
    c.append(d("t-page", "left:44mm;top:26mm;width:124.4mm",
               "파일럿 한 건으로<br>검증 기준을 먼저 정하시면 됩니다"))
    c.append(d("lead", "left:44mm;top:62mm;width:150mm",
               "검증 기간과 판단 지표를 본사가 정하고, 그 기준으로 첫 구간을 평가하시면 됩니다. "
               "기간이 끝나면 연장 또는 종료를 본사가 단독으로 결정하며, 종료 시 본사에 남는 "
               "비용은 없습니다."))
    c.append(table(44, 86, [(38, "l"), (112, "l")], ["검증 방식", "기준"],
                   [(("파일럿 기간", "본사가 정하는 기간"), 9),
                    (("평가 지표", "신규 리드 수 · 상담 진행 수 · 가맹계약 체결 건수"), 9),
                    (("보고", "주 단위 리포트 — 활동 지표와 단계별 파이프라인 건수 포함"), 9),
                    (("초기 구간 운영", "본사 동석 파일럿으로 진행, 건수·기간은 본사가 정함"), 9),
                    (("기간 종료 시", "연장 또는 종료를 본사가 단독 결정, 종료 시 잔여 비용 없음"),
                     9)]))
    c.append(d("ch2", "left:44mm;top:146mm;width:150mm", "홀덤 업종 경험을 대체하는 장치"))
    dev = ["① 리브랜딩 트랙은 이미 업을 운영 중인 점주가 대상이므로 업종 지식 부담이 낮습니다.",
           "② 입지·손익·계약 절차는 업종에 무관하게 반복되는 역량입니다.",
           "③ 영업 개시 전 본사 교육 과정(교육비 300만원 항목)을 이수한 뒤 착수합니다.",
           "④ 초기 구간은 본사 동석 파일럿으로 진행하고 건수·기간은 본사가 정합니다."]
    c.append(d("blk", "left:44mm;top:152.5mm;width:150mm",
               "".join('<div class="body" style="max-inline-size:150mm">%s</div>' % t
                       for t in dev)))
    p = []
    p.append(d("t-close", "left:44mm;top:190mm;width:88mm",
               "첫 번째 계약 한 건부터<br>시작하시면 됩니다"))
    summ = ["모수 보유 — 창업 수요를 새로 만들지 않습니다",
            "계약 건에만 비용 — 착수금·월 고정비·광고비 없음",
            "계약 시점 +500만원 — 회수를 기다리는 기간이 없습니다"]
    p.append(d("blk", "left:44mm;top:212mm;width:90mm",
               "".join('<div class="body" style="max-inline-size:90mm">%s</div>' % s
                       for s in summ)))
    p.append(vl(136, 190, 42, "var(--on-ink-rule)", 0.18))
    p.append(d("imgw", "left:171.8mm;top:188mm;width:22.2mm",
               '<img src="%s/logo.png" style="width:22.2mm;display:block">' % A))
    p.append(d("lab-data abs ar", "left:134mm;top:200mm;width:60mm", "수신"))
    p.append(d("recv", "left:134mm;top:204.5mm;width:60mm",
               "러너스튜디오(주) 귀중<br>대표 박경관<br>서울 강남구 삼성로100길 12 제이타워 B2"))
    p.append(d("lab-data abs ar", "left:134mm;top:220mm;width:60mm", "발신"))
    p.append(d("recv", "left:134mm;top:224.5mm;width:60mm",
               "내일사장 — 창업 지원 플랫폼<br>"
               '<span class="ph">담당자명 · 연락처</span>'))
    panel = d("panel", "left:0;top:182mm;width:210mm;height:115mm", "")
    return sheet(13, "CLOSE · 검증 방식", pc(13, "CLOSE"), (26, 62, 86, 146),
                 "검증 기간 종료 시 본사 잔여 비용", num("0", "원"),
                 ["플랫폼 누적 기준이며 홀덤 업종 단독 실적이 아닙니다.",
                  "앱 리뉴얼 후 플랫폼 서비스 이용자 1.5배 증가 — IT비즈뉴스 2024.7.4 보도.",
                  "러너펍 공개 가맹 안내 기준 시뮬레이션이며 실제 조건은 본사 정책에 따릅니다."],
                 "".join(c) + '<div class="on-dark">%s</div>' % "".join(p),
                 split=182, panel=panel)


CSS = r"""
@page{size:A4 portrait;margin:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact;background:#fff}
:root{
  --paper:#F3F5F1; --ink:#14201C; --ink-body:#2E3A35; --ink-weak:#6C7873; --rule:#C3CCC5;
  --on-ink:#F3F5F1; --on-ink-weak:#97A39D; --on-ink-rule:#38443F;
  --data-return:#0F6B63; --data-return-2:#3E8B84; --data-return-3:#71A9A3;
  --data-cost:#A8791F; --data-void:#C3CCC5;
  --axis-x:44mm; --rail-x:194mm; --field:150mm; --measure:124.4mm;
}
@font-face{font-family:'Pretendard';src:url('/root/.fonts/Pretendard-Thin.otf')format('opentype');font-weight:100;font-display:block}
@font-face{font-family:'Pretendard';src:url('/root/.fonts/Pretendard-ExtraLight.otf')format('opentype');font-weight:200;font-display:block}
@font-face{font-family:'Pretendard';src:url('/root/.fonts/Pretendard-Light.otf')format('opentype');font-weight:300;font-display:block}
@font-face{font-family:'Pretendard';src:url('/root/.fonts/Pretendard-Regular.otf')format('opentype');font-weight:400;font-display:block}
@font-face{font-family:'Pretendard';src:url('/root/.fonts/Pretendard-Medium.otf')format('opentype');font-weight:500;font-display:block}
@font-face{font-family:'Pretendard';src:url('/root/.fonts/Pretendard-SemiBold.otf')format('opentype');font-weight:600;font-display:block}
@font-face{font-family:'Pretendard';src:url('/root/.fonts/Pretendard-Bold.otf')format('opentype');font-weight:700;font-display:block}
@font-face{font-family:'Pretendard';src:url('/root/.fonts/Pretendard-Black.otf')format('opentype');font-weight:900;font-display:block}
/* ExtraBold(800) 은 @font-face 조차 선언하지 않는다. */

body{margin:0;padding:0;background:#fff}

.sheet{
  position:relative; width:210mm; height:297mm; overflow:hidden;
  page-break-after:always; break-after:page;
  display:flex; flex-direction:column;
  background:var(--paper);
  font-family:'Pretendard',system-ui,sans-serif;
  font-size:9.5pt; line-height:1.70; font-weight:400;
  color:var(--ink-body); text-align:left;
  word-break:keep-all; overflow-wrap:break-word; line-break:strict;
  font-kerning:normal;
  font-variant-numeric:tabular-nums; font-feature-settings:'tnum' 1;
}
.sheet:last-of-type{page-break-after:auto;break-after:auto}
.sheet *{margin:0;padding:0;border:0;border-radius:0;box-shadow:none;text-decoration:none;font-style:normal}

.stage{position:relative;flex:1 1 auto;z-index:1}
.panel{position:absolute;background:var(--ink);z-index:0}
.ln,.gauge,.bar,.cell,.frame,.tblx,.vlab,.rblk,.dash,.tri,.blk,.imgw,.signs,.abs,
.lab-meta,.lab-coord,.fnzone,.band,.slogan,.stamp,.recv,.caplab,.ch2,.stepn{position:absolute}
.gauge,.bar{border-top-right-radius:1mm;border-bottom-right-radius:1mm}
.ar{text-align:right}

/* ── 러닝 푸터 ── */
.runfoot{position:relative;z-index:1;margin-top:auto;height:12mm;
  display:flex;justify-content:space-between;align-items:flex-start;
  padding:1.6mm 16mm 0 16mm;font-size:7pt;line-height:1.4;
  font-weight:400;color:var(--ink-weak);letter-spacing:.02em}
.runfoot.on-dark{color:var(--on-ink-weak);font-size:7.5pt}
.rf-r{font-variant-numeric:tabular-nums;font-weight:500}

/* ── 제목 계열 ── */
.t-cover{font-size:26pt;line-height:1.24;font-weight:700;letter-spacing:-0.022em;
  color:var(--on-ink);max-inline-size:150mm;position:absolute}
.t-close{font-size:22pt;line-height:1.28;font-weight:600;letter-spacing:-0.020em;
  color:var(--on-ink);max-inline-size:150mm;position:absolute}
.t-page{font-size:18pt;line-height:1.34;font-weight:600;letter-spacing:-0.016em;
  color:var(--ink);max-inline-size:124.4mm;position:absolute}

/* ── 리드·본문 ── */
.lead{font-size:11.5pt;line-height:1.62;font-weight:300;letter-spacing:-0.012em;
  color:var(--ink-body);max-inline-size:150mm;position:absolute}
.body{font-size:9.5pt;line-height:1.70;font-weight:400;letter-spacing:-0.010em;
  color:var(--ink-body);max-inline-size:124.4mm}
.body.abs{position:absolute}
.body strong{font-weight:700;color:var(--ink)}

/* ── 라벨·캡션·각주 ── */
.lab-meta{font-size:7.5pt;line-height:1.40;font-weight:700;letter-spacing:.14em;color:var(--ink-weak)}
.lab-coord{font-size:7.5pt;line-height:1.4;font-weight:500;letter-spacing:.12em;color:var(--ink-weak)}
.lab-data{font-size:8pt;line-height:1.35;font-weight:500;letter-spacing:.02em;color:var(--ink)}
.cap,.caplab{font-size:7pt;line-height:1.50;font-weight:400;color:#5A6762}
.fn{font-size:7pt;line-height:1.50;font-weight:400;color:#5A6762;max-inline-size:150mm}
.sheet .ph{color:var(--on-ink-weak);border-bottom:0.15mm dotted var(--on-ink-weak);
  padding-bottom:0.6mm}
.ast{font-size:7pt;font-weight:500;color:var(--ink-weak);vertical-align:super;margin-left:.4mm}
.send{font-size:11.5pt;font-weight:600;letter-spacing:-.012em;color:var(--on-ink);position:absolute}
.send .sub{font-size:8pt;font-weight:400;letter-spacing:.05em;color:var(--on-ink-weak);
  margin-left:1.6mm}
.bv{font-size:11pt;font-weight:600;color:var(--on-ink);font-variant-numeric:tabular-nums}
.bandcap{font-size:7.5pt;font-weight:400;color:var(--ink-weak);white-space:nowrap;
  letter-spacing:0;margin-top:.4mm}
.band-l strong{font-weight:700;color:var(--ink)}
.on-dark .band-l strong{color:var(--on-ink)}
.on-dark .cap,.on-dark .fn,.on-dark .lab-meta,.on-dark .lab-coord{color:var(--on-ink-weak);font-size:8pt}
.on-dark .lab-coord{letter-spacing:.10em}

/* ── 수치 스케일 ── */
.fig-xl{font-size:68pt;line-height:.90;font-weight:100;letter-spacing:-.020em;color:var(--ink)}
.fig-l{font-size:30pt;line-height:1.00;font-weight:200;letter-spacing:-.012em;color:var(--ink)}
.fig-m{font-size:20pt;line-height:1.00;font-weight:500;letter-spacing:-.008em;color:var(--ink)}
.fig-s{font-size:12pt;line-height:1.45;font-weight:500;letter-spacing:0;color:var(--ink)}
.fig-close{font-size:20pt;line-height:1.00;font-weight:600;letter-spacing:-.008em;color:var(--ink)}
.fig-xl,.fig-l,.fig-m,.fig-s,.fig-close{font-variant-numeric:tabular-nums;font-feature-settings:'tnum' 1}
.fig-peak{font-weight:900}

.u-xl{font-size:14pt;font-weight:500;color:var(--ink-weak);margin-left:1.6mm}
.u-l{font-size:10pt;font-weight:500;color:var(--ink-weak);margin-left:1.1mm}
.u-m{font-size:9.5pt;font-weight:500;color:var(--ink-weak);margin-left:.9mm}
.u-s{font-size:8pt;font-weight:400;color:var(--ink-weak);margin-left:.7mm}
.u-xl,.u-l,.u-m,.u-s{display:inline-block;vertical-align:baseline;letter-spacing:0}

.neg{color:var(--ink);font-weight:500;font-size:11pt;font-variant-numeric:tabular-nums}
.zero{color:var(--ink-weak);font-weight:500;font-size:11pt;font-variant-numeric:tabular-nums}

/* ── 표 (세로 괘선 0 · 배경 채움 0) ── */
.thr{display:flex;align-items:flex-end;padding-bottom:1.8mm;border-bottom:0.22mm solid var(--ink)}
.thr .tc{font-size:8pt;font-weight:600;color:var(--ink);letter-spacing:.06em;line-height:1.3}
.tdr{display:flex;align-items:baseline;border-bottom:0.15mm solid var(--rule);padding:1.2mm 0;
  box-sizing:border-box}
.tblx .tdr:last-child{border-bottom:0}
.tc{font-size:9.5pt;line-height:1.5;font-weight:400;color:var(--ink-body);
  padding-right:2.4mm;box-sizing:border-box}
.tc.ar{text-align:right;padding-right:0;font-variant-numeric:tabular-nums}
.tc .k{font-weight:500;color:var(--ink)}
.on-dark .tc{color:var(--on-ink)}
.on-dark .tc .k{color:var(--on-ink-weak)}
.on-dark .thr{border-bottom-color:var(--on-ink-rule)}
.on-dark .thr .tc{color:var(--on-ink)}
.on-dark .tdr{border-bottom-color:var(--on-ink-rule)}

/* ── P2 대조 컬럼 ── */
.ch{font-size:8pt;font-weight:600;color:var(--ink);letter-spacing:.06em;
  padding-bottom:1.8mm;border-bottom:0.22mm solid var(--ink)}
.ch2{font-size:8pt;font-weight:600;color:var(--ink);letter-spacing:.06em;
  padding-bottom:1.4mm;border-bottom:0.22mm solid var(--ink)}
.cr{height:9mm;display:flex;flex-direction:column;justify-content:center;
  border-bottom:0.15mm solid var(--rule);font-size:9.5pt;line-height:1.4;
  color:var(--ink-body);box-sizing:border-box;padding-right:3mm}
.cr.tall{height:15mm}
.cr.tall2{height:13mm}
.cr .rl{font-weight:500;color:var(--ink)}
.cr:empty{border-bottom-style:dashed}
.cr .cap{color:#5A6762}

/* ── 퍼널 단계 ── */
.st-n{font-size:8pt;font-weight:500;letter-spacing:.08em;color:var(--ink-weak);position:absolute}
.st-l{font-size:9.5pt;font-weight:600;line-height:1.34;color:var(--ink);position:absolute}
.stepn{font-size:8pt;font-weight:500;letter-spacing:.06em;color:var(--ink-weak);
  padding-left:1.2mm;box-sizing:border-box}

/* ── 막대 내부 라벨 (포함 관계) ── */
.bar{display:flex;align-items:center;justify-content:space-between;
  padding:0 2.4mm;box-sizing:border-box;overflow:hidden}
.bar-l{font-size:8pt;font-weight:600;letter-spacing:.03em;color:var(--paper)}
.bar-r{font-size:7.5pt;font-weight:400;color:var(--paper);opacity:.85}
.vlab,.rblk{text-align:right}

.mk{display:inline-block;width:3mm;height:1.6mm;background:var(--data-cost);
  vertical-align:middle;margin-right:1.2mm}

/* ── 부호 레인 ── */
.sg{font-size:9.5pt;font-weight:500;color:var(--ink-weak);
  display:flex;align-items:center;justify-content:flex-start}

/* ── 점선 구간 ── */
.dash{background-image:linear-gradient(to right,var(--rule) 0 1.2mm,transparent 1.2mm 2.4mm);
  background-size:2.4mm 100%}

/* ── 삼각 마커 ── */
.tri{width:0;height:0;border-left:1.5mm solid transparent;border-right:1.5mm solid transparent;
  border-top:2.6mm solid var(--rule)}

/* ── 결산 밴드 ── */
.band{display:flex;align-items:center;justify-content:space-between}
.band-l{font-size:8pt;font-weight:500;letter-spacing:.05em;color:var(--ink-weak)}
.band-r{text-align:right;white-space:nowrap}
.on-dark .band-l{color:var(--on-ink-weak)}
.on-dark .fig-close,.on-dark .fig-m,.on-dark .fig-l,.on-dark .fig-s{color:var(--on-ink)}
.on-dark .u-m,.on-dark .u-l,.on-dark .u-s,.on-dark .u-xl{color:var(--on-ink-weak)}
.on-dark .body,.on-dark .lead,.on-dark .lab-data{color:var(--on-ink)}
.on-dark .neg{color:var(--on-ink)}
.on-dark .zero{color:var(--on-ink-weak)}

/* 표지·클로징 */
.dark{background:var(--ink)}
.slogan{font-size:8pt;font-weight:500;letter-spacing:.04em;color:var(--on-ink-weak);text-align:right}
.stamp{font-size:9.5pt;font-weight:500;color:var(--on-ink-weak);letter-spacing:.06em}
.recv{font-size:8pt;line-height:1.55;font-weight:400;color:var(--on-ink-weak);text-align:right}

/* 베이스라인 예외 주석 —
   본문 9.5pt/1.70 = 5.7mm 는 12mm 눈금의 정수배가 아니다.
   행마다 스냅하지 않고 블록의 첫 줄 상단만 12mm 눈금에 스냅하며,
   블록 내부 행 리듬은 line-height 에 위임한다. */
"""


def build():
    pages = [page1(), page2(), page3(), page4(), page5(), page6(),
             page_alt(), page7(), page8(), page_law(), page9(),
             page10(), page_close()]
    html = ('<!doctype html><html lang="ko"><head><meta charset="utf-8">'
            '<title>러너펍 가맹 개설 영업 위임 제안 — 내일사장</title>'
            '<style>%s</style></head><body>%s</body></html>' % (CSS, "".join(pages)))
    with io.open(OUT, "w", encoding="utf-8") as f:
        f.write(html)
    print("written", OUT, len(html))


build()
