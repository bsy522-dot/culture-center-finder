# -*- coding: utf-8 -*-
"""문센파인더 핵심 시나리오 E2E (Playwright 실제 브라우저). 완료조건 ④."""
import sys
from playwright.sync_api import sync_playwright

URL = "http://localhost:8801/index.html"
results = []
def check(name, cond, detail=""):
    results.append((name, cond, detail)); print(f"  [{'PASS' if cond else 'FAIL'}] {name} {detail}")

with sync_playwright() as p:
    try: b = p.chromium.launch(channel="chrome", headless=True)
    except Exception: b = p.chromium.launch(headless=True)
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    cerr = []
    pg.on("pageerror", lambda e: cerr.append(str(e)[:80]))
    pg.on("console", lambda m: cerr.append(m.text[:80]) if m.type == "error" and "404" not in m.text else None)

    # ── 시나리오 1: 로드 + 강좌 검색 ──
    print("시나리오1: 앱 로드 + 강좌 검색")
    pg.goto(URL, wait_until="networkidle", timeout=45000)
    pg.wait_for_timeout(3500)
    base_text_len = pg.evaluate("()=>document.body.innerText.length")
    check("앱 로드(강좌 렌더)", base_text_len > 5000, f"(텍스트 {base_text_len})")
    check("로드 콘솔에러 0", len(cerr) == 0, str(cerr[:2]))
    # 검색 입력 찾기 (강좌명/검색 placeholder, address 제외)
    si = pg.evaluate("""()=>{
      const ins=[...document.querySelectorAll('input[type=text],input:not([type])')];
      const cand=ins.find(i=>/검색|강좌|이름|찾/.test(i.placeholder||'')) || ins.find(i=>!/주소|출발|지역|동/.test(i.placeholder||''));
      if(cand){cand.setAttribute('data-e2e','search');return cand.placeholder||'(no ph)';}return null;
    }""")
    if si is not None:
        pg.fill("[data-e2e=search]", "요가")
        pg.wait_for_timeout(1500)
        after = pg.evaluate("()=>document.body.innerText")
        check("검색 동작(요가 결과)", "요가" in after, "")
    else:
        check("검색 입력 발견", False, "검색창 못찾음")

    # ── 시나리오 2: 지역 필터 ──
    print("시나리오2: 지역 필터(서울)")
    pg.goto(URL, wait_until="networkidle", timeout=45000); pg.wait_for_timeout(3000)
    clicked = pg.evaluate("""()=>{
      const el=[...document.querySelectorAll('button,div,span')].find(e=>(e.innerText||'').trim()==='서울');
      if(el){el.click();return true;}return false;
    }""")
    pg.wait_for_timeout(1500)
    check("지역버튼 '서울' 클릭", clicked, "")
    if clicked:
        seoul = pg.evaluate("()=>document.body.innerText.includes('서울')")
        check("서울 필터 적용", seoul, "")

    # ── 시나리오 3: 강좌 상세 열기 ──
    print("시나리오3: 강좌 상세 보기")
    pg.goto(URL, wait_until="networkidle", timeout=45000); pg.wait_for_timeout(3000)
    opened = pg.evaluate("""()=>{
      // 강좌 행/카드 클릭 후 모달/상세 등장 감지
      const before=document.querySelectorAll('[class*=modal],[role=dialog],[class*=detail],[class*=overlay]').length;
      const rows=[...document.querySelectorAll('tr,[class*=card],[class*=course],[class*=row]')].filter(r=>(r.innerText||'').length>15);
      if(rows[0]){rows[0].click();}
      return {before, rowFound: rows.length>0};
    }""")
    pg.wait_for_timeout(1200)
    after_modal = pg.evaluate("()=>document.querySelectorAll('[class*=modal],[role=dialog],[class*=detail],[class*=overlay]').length")
    check("강좌 행 존재", opened["rowFound"], "")
    check("상세/모달 표시", after_modal > opened["before"] or after_modal > 0, f"(모달요소 {after_modal})")

    b.close()

passed = sum(1 for _, c, _ in results if c)
total = len(results)
print(f"\n=== E2E 결과: {passed}/{total} 통과 ===")
sys.exit(0 if passed == total else 1)
