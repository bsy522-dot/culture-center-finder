# -*- coding: utf-8 -*-
"""홈플러스 문화센터 전체 강좌 크롤링 (스크롤로 전체 로드)
GitHub Actions용 — 경로를 repo 루트 기준 상대경로로 수정
"""
import json, sys, time, re, os
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

STORES = ['잠실점','강동점','금천점','영등포점','합정점','신도림점','서울남현점']
all_text_data = {}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    ctx = browser.new_context(viewport={'width':1280,'height':2000})

    for store_name in STORES:
        print(f'\n=== {store_name} ===')
        page = ctx.new_page()
        try:
            page.goto('https://mschool.homeplus.co.kr/Lecture/Search', timeout=30000)
            page.wait_for_load_state('networkidle', timeout=15000)
            time.sleep(2)

            # Select 서울
            seoul = page.query_selector('button.btn_tree_dpt2:has-text("서울")')
            if seoul: seoul.click(); time.sleep(1)

            # Select store
            btns = page.query_selector_all('button.btn_depth_3, button.btn_filter_add')
            clicked = False
            for b in btns:
                try:
                    t = b.inner_text().strip()
                    if store_name in t:
                        b.click(); clicked = True; print(f'  Selected: {t}'); time.sleep(1); break
                except: pass
            if not clicked:
                print(f'  SKIP: {store_name} not found'); page.close(); continue

            # Search
            search = page.query_selector('button.btn_reuslt_search')
            if search: search.click()
            page.wait_for_load_state('networkidle', timeout=20000)
            time.sleep(3)

            # Scroll to load all items
            prev_count = 0
            for scroll_i in range(100):  # max 100 scrolls
                page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
                time.sleep(1)

                # Check for "more" button or infinite scroll
                more = page.query_selector('.btn_more_view, .btn-more, [class*="more"]')
                if more:
                    try: more.click(); time.sleep(2)
                    except: pass

                items = page.query_selector_all('.lecture_item, .card_item, [class*="lecture"], li.item')
                cur_count = len(items)
                if cur_count == prev_count and scroll_i > 3:
                    break
                prev_count = cur_count
                if scroll_i % 10 == 0:
                    print(f'  Scroll {scroll_i}: {cur_count} items')

            # Get full text
            text = page.inner_text('body')
            all_text_data[store_name] = text
            print(f'  Final: {len(text)} chars')

        except Exception as e:
            print(f'  Error: {e}')
        finally:
            page.close()

    browser.close()

# Parse all collected text
print('\n\n=== PARSING ===')
courses = []

TRAVEL_HP = {
    '잠실점':(35,20),'강동점':(55,35),'금천점':(40,25),
    '영등포점':(40,25),'합정점':(50,30),'신도림점':(45,25),'서울남현점':(20,10),
}
ADDR_HP = {
    '잠실점':'서울 송파구 올림픽로 240','강동점':'서울 강동구 양재대로 1411',
    '금천점':'서울 금천구 시흥대로 410','영등포점':'서울 영등포구 영신로 200',
    '합정점':'서울 마포구 양화로 72','신도림점':'서울 구로구 새말로 97',
    '서울남현점':'서울 관악구 남현길 66',
}

def classify(name):
    t = name.lower()
    if '발레' in t: return '발레'
    if '피아노' in t: return '피아노'
    if '바이올린' in t: return '바이올린'
    if '첼로' in t: return '첼로'
    if any(x in t for x in ['플루트','오카리나','하모니카','리코더']): return '관악기'
    if '드럼' in t: return '드럼'
    if any(x in t for x in ['기타교실','통기타','어쿠스틱']): return '기타(악기)'
    if any(x in t for x in ['우쿨렐레','우쿠렐레']): return '우쿨렐레'
    if any(x in t for x in ['가야금','거문고']): return '국악기'
    if '악기' in t: return '악기(기타)'
    if '수영' in t: return '수영'
    if '태권도' in t: return '태권도'
    if '축구' in t: return '축구'
    if '농구' in t: return '농구'
    if '펜싱' in t: return '펜싱'
    if '골프' in t: return '골프'
    if '인라인' in t: return '인라인'
    if '줄넘기' in t: return '줄넘기'
    if any(x in t for x in ['체조','리듬체조']): return '체조'
    if any(x in t for x in ['요가','필라테스']): return '요가/필라테스'
    if any(x in t for x in ['체육','스포츠','점프','킨볼','신체']): return '체육(종합)'
    if any(x in t for x in ['k-pop','kpop','아이돌','방송댄스']): return 'K-POP댄스'
    if any(x in t for x in ['밸리댄스','벨리']): return '밸리댄스'
    if any(x in t for x in ['힙합','스트릿']): return '힙합댄스'
    if '댄스' in t: return '댄스(기타)'
    if any(x in t for x in ['수채화','유화','드로잉','스케치']): return '회화'
    if any(x in t for x in ['클레이','도예','세라믹','점토']): return '공예/만들기'
    if any(x in t for x in ['캘리','레터링']): return '캘리그라피'
    if any(x in t for x in ['미술','아트','페인팅']): return '미술(종합)'
    if any(x in t for x in ['보컬','노래','성악']): return '보컬/노래'
    if '뮤지컬' in t: return '뮤지컬'
    if any(x in t for x in ['음악','뮤직','리듬','오르프']): return '음악놀이'
    if any(x in t for x in ['베이킹','제과','디저트','케이크','쿠키']): return '베이킹/디저트'
    if any(x in t for x in ['요리','쿠킹','요리사','밥버거','피자']): return '요리'
    if any(x in t for x in ['영어','english','원어민']): return '영어'
    if any(x in t for x in ['중국어','일본어']): return '제2외국어'
    if any(x in t for x in ['코딩','로봇']): return '코딩/로봇'
    if any(x in t for x in ['레고','블럭','블록']): return '블록/레고'
    if '바둑' in t: return '바둑'
    if '과학' in t: return '과학'
    if any(x in t for x in ['수학','연산','주산']): return '수학'
    if any(x in t for x in ['독서','논술','글쓰기']): return '독서/논술'
    if any(x in t for x in ['한자','서예']): return '한자/서예'
    if any(x in t for x in ['역사','한국사']): return '역사'
    if any(x in t for x in ['사진','촬영']): return '사진'
    if any(x in t for x in ['꽃','플라워']): return '플라워'
    if any(x in t for x in ['트니트니','놀이','감성','오감','촉감']): return '놀이'
    return '기타'

def extract_age(text):
    m = re.search(r'(\d+)~(\d+)세', text)
    if m: return f'{m.group(1)}~{m.group(2)}세'
    m = re.search(r'(\d{4})~(\d{2})년생', text)
    if m:
        y1,y2 = int(m.group(1)),int('20'+m.group(2))
        return f'{2026-y2}~{2026-y1}세'
    m = re.search(r'(\d{4})년생', text)
    if m: return f'{2026-int(m.group(1))}세~'
    m = re.search(r'(\d+)~(\d+)개월', text)
    if m: return f'{int(m.group(1))//12}~{int(m.group(2))//12}세'
    m = re.search(r'(\d+)개월', text)
    if m: return f'{int(m.group(1))//12}세~'
    if 'Adult' in text or '성인' in text: return '성인'
    if 'Baby' in text: return '영유아'
    if 'Kids' in text: return '어린이'
    return ''

for store_name, text in all_text_data.items():
    pub, car = TRAVEL_HP.get(store_name, (50,30))
    addr = ADDR_HP.get(store_name, '')
    center = f'홈플러스 {store_name}'

    lines = text.split('\n')
    i = 0
    store_courses = 0
    while i < len(lines):
        line = lines[i].strip()

        if store_name in line and i+1 < len(lines):
            course_type = lines[i+1].strip() if i+1 < len(lines) else ''
            if course_type in ['정규','1일특강','단기특강']:
                block_lines = []
                j = i
                while j < min(i+15, len(lines)):
                    block_lines.append(lines[j].strip())
                    if '장바구니' in lines[j]:
                        break
                    j += 1

                block = '\n'.join(block_lines)

                name_match = re.search(r'(?:개강|마감임박|개강확정)\n(.+?)(?:\n|$)', block)
                if not name_match:
                    name_match = re.search(r'\[(?:Adult|Kids|Baby)\][^\n]*\n(.+?)(?:\n|$)', block)

                course_name = name_match.group(1).strip() if name_match else ''

                time_match = re.search(r'([월화수목금토일])\s+(\d{1,2}:\d{2})\s*~\s*(\d{1,2}:\d{2})', block)
                day = f'매주 {time_match.group(1)}' if time_match else ''
                time_s = f'{time_match.group(2)}~{time_match.group(3)}' if time_match else ''

                fee_match = re.search(r'(\d+회)\s+([\d,]+원)', block)
                if fee_match:
                    sessions = int(fee_match.group(1).replace('회',''))
                    fee = f'{fee_match.group(2)}({fee_match.group(1)})'
                else:
                    fee_match2 = re.search(r'([\d,]+원)', block)
                    fee = fee_match2.group(1) if fee_match2 else ''
                    sessions = 0

                date_match = re.search(r'(\d{4}\.\d{2}\.\d{2})\s*~\s*(\d{4}\.\d{2}\.\d{2})', block)
                start = date_match.group(1) if date_match else ''

                inst_match = re.search(r'([가-힣]{2,4})\s*강사', block)
                instructor = inst_match.group(1) if inst_match else ''

                status = '접수중'
                if '마감' in block: status = '마감임박'
                if '대기' in block: status = '대기접수'

                age = extract_age(block)

                type_tag = ''
                if '[Adult]' in block: type_tag = '성인'
                elif '[Kids]' in block: type_tag = '어린이'
                elif '[Baby]' in block: type_tag = '영유아'
                if not age and type_tag: age = type_tag

                cat = classify(course_name)

                if course_name and time_s:
                    courses.append([
                        '대형마트', center, pub, cat, course_name, age, day, time_s,
                        fee, instructor, status, '', 'https://mschool.homeplus.co.kr',
                        start, sessions, addr, car
                    ])
                    store_courses += 1

                i = j + 1
                continue
        i += 1

    print(f'{store_name}: {store_courses} courses parsed')

print(f'\n=== Total: {len(courses)} courses ===')

# Save — repo 기준 상대경로
out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'hp_live.json')
os.makedirs(os.path.dirname(out_path), exist_ok=True)
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(courses, f, ensure_ascii=False, indent=2)
print(f'Saved to {out_path}')

# Stats
cats = {}
for c in courses:
    cats[c[3]] = cats.get(c[3],0)+1
for k,v in sorted(cats.items(), key=lambda x:-x[1])[:20]:
    print(f'  {k}: {v}')
