# 문센파인더 상용화 개선 — 진행상황 (PROGRESS)

## 목표 (완료조건 6) — ✅ 전부 충족 + 실사이트 반영 완료
빌드0 · 린트(node --check)0 · 코드리뷰 C/H 0(에이전트 PASS) · E2E 7/7 · 보안0 · 문서. master ff-merge+push 완료(라이브 적용).

## 작업공간
- 격리 워크트리 `app/.claude/worktrees/improve-20260610` (브랜치 `worktree-improve-20260610`). 작업 후 master ff-merge+push.
- 계획: `_audit/문센파인더_상용화_개선계획.html` + `_audit/plan_items.json`(85건). 백업 `_baseline_v8/`. 캡처 `_audit/after_*.png`.

## ✅ 완료·검증·배포된 개선 (각 빌드+E2E 7/7 회귀0)
1. 정크 93MB 제거(4fa9fc0) — 백업PII 65,987·hp원본·스크린샷. 120MB→54MB.
2. 접근성 aria-label 4곳(aad6aa3) + 라이트 필터글자 대비(ae05a96).
3. 캐시버스터 제거(ed0e9a9) — 27MB 매방문→304.
4. 색상대비 WCAG AA(b0b45d6) — 다크/라이트 muted/faint/필터.
5. v7 가짜 강사평점 제거(a17892a) — 법적(명예훼손 소지).
6. 코드리뷰 반영(ae05a96) — 라이트필터대비+고아업적2개.
7. 인터랙션 피드백+모바일 터치타겟(82a9cd1) — :active/focus-visible, 필터칩38px·하단네비48px.
8. 이동시간 '약 N분'(추정명시)+v7/v8 배지 중립아이콘 📚/🎯(6951178).

## 남은 작업 (계획서, 미완 — 컴팩트/다음 세션)
- [치명] **라이브가 dist/(빌드본) 미사용** — 루트 index.html(Babel런타임) 배포 중. GitHub Pages가 dist/ 서빙하게 빌드파이프라인 연결(구조변경, 신중). 큰 성능향상.
- [치명] 신청링크 9px 이모지→버튼화 / 센터상세 모달 막다른길(신청·전화 CTA 추가).
- [높음] 끊긴기능: v6 데이터취득 React18 실패(센터비교/로드맵/시즌/캘린더 무음고장)·v8 추천 Math.random·v8 가짜 D-day알림·v8 잘못된 localStorage키.
- [높음] 첫화면 Hick 정리(v4/v5 12버튼 토글 접기)·검색 디바운스·검색버튼 로딩상태·떠다니는 레일 겹침.
- [높음] a11y: 모달 role/포커스트랩·클릭형 td 키보드.
- build.mjs data전체 복사 정리·잡파일(_deleted_files/_*.js 등) 정리.

## 재개 지침
- 이 파일 + `_audit/plan_items.json` 읽기. 워크트리에서 작업 → 각 수정 후 `npm run build` + 서버8801 + `tests/e2e_munsen.py`(7/7) → 선택커밋(`git add <파일>`, -A 금지) → master ff-merge+push.
- ★외부 자동봇이 주간 index.html 재작성(v9 등) 가능 → 재개 시 `git fetch` 후 충돌 점검.
