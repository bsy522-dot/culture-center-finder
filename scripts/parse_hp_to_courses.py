# -*- coding: utf-8 -*-
"""
GitHub Actions 전용 파서 — HP 크롤링 결과를 courses_all.json에 병합

동작:
  1. data/hp_live.json 읽기 (crawl_hp_full.py 출력)
  2. data/courses_all.json 읽기 (기존 이마트/롯데/공공 데이터 포함)
  3. 기존 데이터에서 홈플러스 항목 제거 후 새 HP 데이터로 교체
  4. courses_all.json, courses_live.json 저장

로컬 Excel 파일(이마트/롯데/공공)은 건드리지 않음.
로컬에서 수동 parse_all.py 실행 결과를 base로 사용.
"""
import json, sys, os
sys.stdout.reconfigure(encoding='utf-8')

# repo 루트 = scripts/ 의 부모
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(REPO_ROOT, 'data')

hp_live_path    = os.path.join(DATA_DIR, 'hp_live.json')
courses_all_path = os.path.join(DATA_DIR, 'courses_all.json')
courses_live_path = os.path.join(DATA_DIR, 'courses_live.json')

# 1. hp_live.json 로드
if not os.path.exists(hp_live_path):
    print(f'ERROR: {hp_live_path} not found. Run crawl_hp_full.py first.')
    sys.exit(1)

with open(hp_live_path, encoding='utf-8') as f:
    hp_courses = json.load(f)
print(f'HP courses loaded: {len(hp_courses)}')

# 2. courses_all.json 로드 (없으면 빈 배열로 시작)
if os.path.exists(courses_all_path):
    with open(courses_all_path, encoding='utf-8') as f:
        all_courses = json.load(f)
    print(f'Existing courses_all: {len(all_courses)}')
else:
    all_courses = []
    print('courses_all.json not found — starting fresh')

# 3. 기존 HP 항목 제거 (center 필드 index=1 이 "홈플러스"로 시작하는 것)
non_hp = [c for c in all_courses if not (isinstance(c, list) and len(c) > 1 and str(c[1]).startswith('홈플러스'))]
print(f'Non-HP kept: {len(non_hp)} / HP removed: {len(all_courses) - len(non_hp)}')

# 4. 새 HP 추가
merged = non_hp + hp_courses
print(f'Merged total: {len(merged)}')

# 5. 저장
os.makedirs(DATA_DIR, exist_ok=True)
with open(courses_all_path, 'w', encoding='utf-8') as f:
    json.dump(merged, f, ensure_ascii=False)
with open(courses_live_path, 'w', encoding='utf-8') as f:
    json.dump(merged, f, ensure_ascii=False)

print(f'Saved courses_all.json ({len(merged)} courses)')

# Stats
centers = {}
cats = {}
hp_count = 0
for c in merged:
    if isinstance(c, list) and len(c) > 3:
        cn = c[1]
        cat = c[3]
        centers[cn] = centers.get(cn, 0) + 1
        cats[cat] = cats.get(cat, 0) + 1
        if str(cn).startswith('홈플러스'):
            hp_count += 1

print(f'\n=== HP courses in merged: {hp_count} ===')
print(f'=== Total centers: {len(centers)}, categories: {len(cats)} ===')
for k, v in sorted(centers.items(), key=lambda x: -x[1])[:15]:
    print(f'  {k}: {v}')
