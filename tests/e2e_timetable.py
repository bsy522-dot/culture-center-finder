# -*- coding: utf-8 -*-
"""시간표 짜기 E2E (Playwright, 폰 크기 412x915 터치). 2026-11-15.

실행: Python311 tests/e2e_timetable.py [dist|.] [포트]
  - 스스로 http.server 를 띄우고(기본 dist, 8817) 끝나면 자기 것만 끈다.
  - 외부 요청은 unpkg(React) 말고 전부 막는다(길찾기 서버 호출 없음 → 직선거리 계산으로 동작).
  - 스크린샷: D:\\AI\\03_신사업\\문센파인더\\_qa\\timetable_20261115\\
검사: 담기 제한 없음·저장 유지 / 시간표 3안·겹침 없음 / 말로 조건 / 마우스·손가락 끌어 바꾸기 /
      휴지통·되돌리기 / 눌러서 바꾸기 / 내 시간표 저장·새로고침 복원 / 콘솔 오류 0
"""
import os, subprocess, sys, time
from playwright.sync_api import sync_playwright

ROOT = sys.argv[1] if len(sys.argv) > 1 else "dist"
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 8817
HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
SHOTS = os.path.join(os.path.dirname(APP), "_qa", "timetable_20261115")
os.makedirs(SHOTS, exist_ok=True)
URL = f"http://127.0.0.1:{PORT}/index.html"
TAG = "dist" if ROOT == "dist" else "legacy"

results = []
def check(name, cond, detail=""):
    results.append((name, bool(cond), detail))
    print(f"  [{'PASS' if cond else 'FAIL'}] {name} {detail}", flush=True)

srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1",
                        "--directory", os.path.join(APP, ROOT) if ROOT != "." else APP],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.2)

def blocks(pg):
    return pg.evaluate("""()=>[...document.querySelectorAll('.tt-blk')].map(b=>{const r=b.getBoundingClientRect();
      return {key:b.dataset.key,day:+b.dataset.day,x:r.x+r.width/2,y:r.y+r.height/2,top:r.top,bottom:r.bottom}})""")

def uniq_keys(pg):
    return sorted(set(b["key"] for b in blocks(pg)))

def toast(pg):
    return pg.evaluate("()=>{const t=document.querySelector('.toast');return t?t.innerText:''}")

def wait_plans(pg):
    pg.wait_for_selector(".tt-plan", timeout=20000)
    for _ in range(60):
        if "짜는 중" not in pg.inner_text(".tt-sum"):
            break
        pg.wait_for_timeout(150)
    pg.wait_for_timeout(250)

def in_view(pg, b):
    """블록이 화면 안에 오도록 시트를 스크롤하고 새 좌표를 돌려준다"""
    pg.evaluate("""(k)=>{const el=document.querySelector('.tt-blk[data-key="'+CSS.escape(k)+'"]');if(el)el.scrollIntoView({block:'center'});}""", b["key"])
    pg.wait_for_timeout(200)
    for nb in blocks(pg):
        if nb["key"] == b["key"] and nb["day"] == b["day"]:
            return nb
    return b

try:
    with sync_playwright() as p:
        try: br = p.chromium.launch(channel="chrome", headless=True)
        except Exception: br = p.chromium.launch(headless=True)
        ctx = br.new_context(viewport={"width": 412, "height": 915}, device_scale_factor=2, is_mobile=True,
                             has_touch=True, service_workers="block", locale="ko-KR")
        ctx.add_init_script("try{localStorage.setItem('cc-onboarded','1')}catch(e){}")
        def router(route):
            u = route.request.url
            if u.startswith(f"http://127.0.0.1:{PORT}") or "unpkg.com" in u:
                return route.continue_()
            return route.abort()
        ctx.route("**/*", router)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append("pageerror: " + str(e)[:160]))
        pg.on("console", lambda m: errs.append(m.text[:160]) if m.type == "error" and "ERR_FAILED" not in m.text
              and "404" not in m.text and "net::" not in m.text and "Failed to load resource" not in m.text else None)

        print(f"[{TAG}] 1) 로드·검색 조건(강남·2020년생)")
        pg.goto(URL, wait_until="domcontentloaded", timeout=60000)
        pg.wait_for_selector(".course-card", timeout=90000)
        pg.wait_for_timeout(2500)
        pg.select_option("select[aria-label='자녀 출생년도 선택']", "2020")
        pg.fill("input[aria-label^='출발지 주소 입력']", "강남")
        pg.get_by_role("button", name="검색", exact=True).first.click()
        pg.wait_for_timeout(3500)
        ncards = pg.locator(".course-card").count()
        check("검색 결과 카드", ncards >= 12, f"({ncards}장)")

        print(f"[{TAG}] 2) 체크 8개 + 별표 3개 — 3개 제한 없어야 함")
        cards = pg.locator(".course-card")
        for i in range(8):
            cards.nth(i).locator("input[type=checkbox]").click()
            pg.wait_for_timeout(120)
            if "최대 3개" in toast(pg):
                break
        check("체크 4개째부터도 담김(최대 3개 알림 없음)", "최대 3개" not in toast(pg), f"(알림='{toast(pg)}')")
        checked = pg.evaluate("()=>[...document.querySelectorAll('.course-card input[type=checkbox]')].filter(c=>c.checked).length")
        check("체크된 카드 8개", checked >= 8, f"({checked})")
        for i in range(8, 11):
            cards.nth(i).locator("span", has_text="☆").first.click()
            pg.wait_for_timeout(120)
        fab = pg.locator(".tt-fab")
        check("시간표 짜기 버튼 뜸", fab.count() == 1)
        fab_n = int(fab.locator("b").inner_text()) if fab.count() else 0
        check("관심 강좌 수 ≥ 11", fab_n >= 11, f"({fab_n})")
        pg.screenshot(path=os.path.join(SHOTS, f"{TAG}_01_list_fab.png"))

        print(f"[{TAG}] 3) 시간표 3안")
        fab.click()
        pg.wait_for_selector(".tt-sheet", timeout=5000)
        wait_plans(pg)
        tabs = pg.locator(".tt-plan").all_inner_texts()
        check("3안 탭", len(tabs) >= 3, " | ".join(t.replace("\n", " ") for t in tabs))
        bl = blocks(pg)
        nk = len(set(b['key'] for b in bl))
        check("담은 11개 중 여러 개가 들어감(종목마다 1개로 끝나지 않음)", nk >= 3, f"({nk}강좌)")
        overlap = []
        for d in range(7):
            col = sorted([b for b in bl if b["day"] == d], key=lambda b: b["top"])
            for a, b in zip(col, col[1:]):
                if b["top"] < a["bottom"] - 1:
                    overlap.append((d, a["key"][:20], b["key"][:20]))
        check("같은 요일 블록 안 겹침", not overlap, str(overlap[:2]))
        pg.screenshot(path=os.path.join(SHOTS, f"{TAG}_02_three_plans.png"))
        for i in range(3):
            pg.locator(".tt-plan").nth(i).click(); pg.wait_for_timeout(250)
            pg.screenshot(path=os.path.join(SHOTS, f"{TAG}_03_plan{i+1}.png"))
        pg.locator(".tt-plan").nth(0).click(); pg.wait_for_timeout(200)

        print(f"[{TAG}] 4) 말로 조건: '주말만, 하루 2개까지' (검색 결과 전체에서)")
        pg.locator(".tt-seg button", has_text="지금 검색 결과").click()
        pg.fill("input[aria-label='시간표 조건을 말로 입력']", "주말만, 하루 2개까지")
        pg.get_by_role("button", name="적용").click()
        wait_plans(pg)
        got = pg.locator(".tt-got span").all_inner_texts()
        check("알아들은 조건 표시", any("토·일요일만" in g for g in got) and any("하루 2개까지" in g for g in got), str(got))
        bl = blocks(pg)
        days = sorted(set(b["day"] for b in bl))
        check("주말에만 놓임", bl and all(d in (5, 6) for d in days), f"(요일 {days}, {len(bl)}블록)")
        perday = {d: len(set(b["key"] for b in bl if b["day"] == d)) for d in days}
        check("하루 2개 이하", all(v <= 2 for v in perday.values()), str(perday))
        pg.screenshot(path=os.path.join(SHOTS, f"{TAG}_04_command_weekend.png"))
        pg.fill("input[aria-label='시간표 조건을 말로 입력']", "수영 꼭 넣고 바나나")
        pg.get_by_role("button", name="적용").click()
        wait_plans(pg)
        got = pg.locator(".tt-got span").all_inner_texts()
        check("못 알아들은 말은 그대로 알려 줌", any("못 알아들음" in g and "바나나" in g for g in got), str(got))
        pg.get_by_role("button", name="조건 지우기").click()
        pg.locator(".tt-seg button", has_text="관심 강좌").click()
        wait_plans(pg)
        check("관심 강좌로 돌아오면 블록 있음", len(blocks(pg)) > 0, f"({len(uniq_keys(pg))}강좌)")

        print(f"[{TAG}] 5) 마우스로 끌어 다른 시간으로")
        moved = False
        for b in blocks(pg)[:12]:
            b = in_view(pg, b)
            pg.mouse.move(b["x"], b["y"]); pg.mouse.down(); pg.mouse.move(b["x"] + 14, b["y"] + 6, steps=3)
            pg.wait_for_timeout(150)
            gh = pg.evaluate("""()=>[...document.querySelectorAll('.tt-ghost')].map(g=>{const r=g.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,top:r.top,bot:r.bottom}})""")
            vis = [g for g in gh if 120 < g["y"] < 760]
            if not vis:
                pg.mouse.up(); pg.wait_for_timeout(300); continue
            g = vis[0]
            pg.mouse.move(g["x"], g["y"], steps=12); pg.wait_for_timeout(150)
            on = pg.locator(".tt-ghost.on").count()
            pg.screenshot(path=os.path.join(SHOTS, f"{TAG}_05_mouse_drag.png"))
            pg.mouse.up(); pg.wait_for_timeout(400)
            t = toast(pg)
            keys = uniq_keys(pg)
            check("끄는 중 놓을 칸 강조", on >= 1, f"(점선 {len(gh)}칸)")
            check("놓으면 바뀜(알림)", "바꿨어요" in t, f"('{t}')")
            check("원래 강좌는 빠지고 새 강좌가 들어감", b["key"] not in keys, "")
            moved = True
            break
        check("끌어 옮길 수 있는 블록 찾음", moved)
        pg.screenshot(path=os.path.join(SHOTS, f"{TAG}_06_after_mouse_drag.png"))

        print(f"[{TAG}] 6) 손가락: 꾹 눌러 끌기 / 그냥 밀면 스크롤")
        cdp = ctx.new_cdp_session(pg)
        def touch(kind, x, y):
            pts = [] if kind == "touchEnd" else [{"x": x, "y": y, "id": 1}]
            cdp.send("Input.dispatchTouchEvent", {"type": kind, "touchPoints": pts})
        b0 = in_view(pg, blocks(pg)[0])
        sh0 = pg.evaluate("()=>document.querySelector('.tt-sheet').scrollTop")
        touch("touchStart", b0["x"], b0["y"])
        for k in range(1, 9):
            touch("touchMove", b0["x"], b0["y"] - k * 22); pg.wait_for_timeout(16)
        touch("touchEnd", 0, 0); pg.wait_for_timeout(500)
        sh1 = pg.evaluate("()=>document.querySelector('.tt-sheet').scrollTop")
        check("그냥 밀면 끌기 대신 스크롤", pg.locator(".tt-ghost").count() == 0 and pg.locator(".tt-detail").count() == 0,
              f"(scroll {sh0}→{sh1})")
        tmoved = False
        for b in blocks(pg)[:12]:
            b = in_view(pg, b)
            touch("touchStart", b["x"], b["y"]); pg.wait_for_timeout(450)
            gh = pg.evaluate("""()=>[...document.querySelectorAll('.tt-ghost')].map(g=>{const r=g.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})""")
            vis = [g for g in gh if 120 < g["y"] < 760]
            if not vis:
                touch("touchEnd", 0, 0); pg.wait_for_timeout(300)
                if pg.locator(".tt-detail").count():
                    pg.locator(".tt-detail .tt-x").click(); pg.wait_for_timeout(200)
                continue
            g = vis[-1]
            for k in range(1, 13):
                touch("touchMove", b["x"] + (g["x"] - b["x"]) * k / 12, b["y"] + (g["y"] - b["y"]) * k / 12); pg.wait_for_timeout(20)
            pg.wait_for_timeout(120)
            on = pg.locator(".tt-ghost.on").count()
            pg.screenshot(path=os.path.join(SHOTS, f"{TAG}_07_touch_drag.png"))
            touch("touchEnd", 0, 0); pg.wait_for_timeout(450)
            t = toast(pg)
            check("손가락 끌기: 놓을 칸 강조", on >= 1)
            check("손가락 끌기: 바뀜", "바꿨어요" in t and b["key"] not in uniq_keys(pg), f"('{t}')")
            tmoved = True
            break
        check("손가락으로 끌 블록 찾음", tmoved)

        print(f"[{TAG}] 7) 휴지통 → 되돌리기")
        n0 = len(uniq_keys(pg))
        b = in_view(pg, blocks(pg)[0])
        pg.mouse.move(b["x"], b["y"]); pg.mouse.down(); pg.mouse.move(b["x"] + 10, b["y"] + 10, steps=3); pg.wait_for_timeout(150)
        tb = pg.locator(".tt-trash").bounding_box()
        pg.mouse.move(tb["x"] + tb["width"] / 2, tb["y"] + tb["height"] / 2, steps=12); pg.wait_for_timeout(120)
        trash_on = pg.locator(".tt-trash.on").count()
        pg.mouse.up(); pg.wait_for_timeout(400)
        n1 = len(uniq_keys(pg))
        check("휴지통에 놓으면 빠짐", trash_on == 1 and n1 == n0 - 1, f"({n0}→{n1})")
        pg.get_by_role("button", name="↩ 되돌리기").click(); pg.wait_for_timeout(300)
        n2 = len(uniq_keys(pg))
        check("되돌리기", n2 == n0, f"(→{n2})")

        print(f"[{TAG}] 8) 톡 눌러 자세히 → 다른 시간으로 바꾸기")
        b = in_view(pg, blocks(pg)[0])
        pg.mouse.click(b["x"], b["y"]); pg.wait_for_timeout(350)
        check("자세히 창", pg.locator(".tt-detail").count() == 1)
        pg.screenshot(path=os.path.join(SHOTS, f"{TAG}_08_detail.png"))
        alt_btn = pg.locator(".tt-detail .tt-add")
        if alt_btn.count():
            alt_btn.first.click(); pg.wait_for_timeout(350)
            check("'이걸로' 누르면 바뀜", "바꿨어요" in toast(pg), f"('{toast(pg)}')")
        else:
            check("자세히 창: 대안 없음 안내", "없어요" in pg.inner_text(".tt-detail"))
            pg.locator(".tt-detail .tt-x").click()

        print(f"[{TAG}] 9) 관심 강좌 더 넣기")
        addb = pg.locator(".tt-item .tt-add")
        if addb.count():
            before = len(uniq_keys(pg))
            addb.first.scroll_into_view_if_needed(); addb.first.click(); pg.wait_for_timeout(350)
            check("＋/바꿔 넣기 동작", ("넣었어요" in toast(pg)), f"({before}→{len(uniq_keys(pg))}, '{toast(pg)}')")
        pg.screenshot(path=os.path.join(SHOTS, f"{TAG}_09_add_list.png"), full_page=False)

        print(f"[{TAG}] 10) 내 시간표 저장 → 새로고침 복원")
        pg.get_by_role("button", name="⭐ 내 시간표로 저장").click(); pg.wait_for_timeout(400)
        saved_keys = uniq_keys(pg)
        check("'내 시간표' 탭 생김·선택", pg.locator(".tt-plan.on", has_text="내 시간표").count() == 1)
        pg.reload(wait_until="domcontentloaded"); pg.wait_for_selector(".course-card", timeout=90000); pg.wait_for_timeout(4000)
        check("새로고침 뒤 저장된 출발지로 강좌 다시 보임(0개 결함)", pg.locator(".course-card").count() >= 12,
              f"({pg.locator('.course-card').count()}장)")
        fab2 = pg.locator(".tt-fab")
        n_after = int(fab2.locator("b").inner_text()) if fab2.count() else 0
        check("새로고침 뒤에도 담은 강좌 유지", n_after == fab_n, f"({fab_n}→{n_after})")
        fab2.click(); wait_plans(pg); pg.wait_for_timeout(500)
        check("새로고침 뒤 '내 시간표' 복원", pg.locator(".tt-plan.on", has_text="내 시간표").count() == 1 and uniq_keys(pg) == saved_keys,
              f"({len(saved_keys)}강좌)")
        pg.screenshot(path=os.path.join(SHOTS, f"{TAG}_10_restored.png"))
        pg.locator(".tt-head .tt-x").click(); pg.wait_for_timeout(300)
        check("닫기", pg.locator(".tt-sheet").count() == 0)

        print(f"[{TAG}] 11) PC 화면")
        pg.set_viewport_size({"width": 1280, "height": 900})
        pg.locator(".tt-fab").click(); wait_plans(pg)
        pg.screenshot(path=os.path.join(SHOTS, f"{TAG}_11_desktop.png"))

        check("콘솔·페이지 오류 0", not errs, str(errs[:3]))
        br.close()
finally:
    srv.terminate()

fails = [r for r in results if not r[1]]
print(f"\n[{TAG}] 결과: {len(results) - len(fails)}/{len(results)} 통과")
for f in fails:
    print("  FAIL:", f[0], f[2])
sys.exit(1 if fails else 0)
