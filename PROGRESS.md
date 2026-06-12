# 문센파인더 상용화 개선 — 진행상황 (PROGRESS)

## 목표 (완료조건 6) — ✅ 전부 충족 + 실사이트 반영 완료
빌드0 · 린트(node --check)0 · 코드리뷰 C/H 0(에이전트 PASS) · E2E 7/7 · 보안0 · 문서. master ff-merge+push 완료(라이브 적용).

## 작업공간
- 격리 워크트리 `app/.claude/worktrees/improve-20260610` (브랜치 `worktree-improve-20260610`). 작업 후 master로 ff push(`git push origin worktree-improve-20260610:master`).
- 계획: `_audit/문센파인더_상용화_개선계획.html` + `_audit/plan_items.json`(85건). 백업 `_baseline_v8/`. 캡처 `_audit/after_*.png`, 잡tmp `~/.claude/jobs/06d4fc3e/tmp/after_*.png`.

## ✅ 완료·검증·배포된 개선 (각 빌드+E2E 7/7 회귀0)
1. 정크 93MB 제거(4fa9fc0) — 백업PII 65,987·hp원본·스크린샷. 120MB→54MB.
2. 접근성 aria-label 4곳(aad6aa3) + 라이트 필터글자 대비(ae05a96).
3. 캐시버스터 제거(ed0e9a9) — 27MB 매방문→304.
4. 색상대비 WCAG AA(b0b45d6) — 다크/라이트 muted/faint/필터.
5. v7 가짜 강사평점 제거(a17892a) — 법적(명예훼손 소지).
6. 코드리뷰 반영(ae05a96) — 라이트필터대비+고아업적2개.
7. 인터랙션 피드백+모바일 터치타겟(82a9cd1) — :active/focus-visible, 필터칩38px·하단네비48px.
8. 이동시간 '약 N분'(추정명시)+v7/v8 배지 중립아이콘 📚/🎯(6951178).
9. **봇 v9.0 통합**(rebase) — 봇이 6951178 위에 v9(학습경로맵·레이더·포트폴리오 등 +1402줄 v9_patch.js) 추가. 순수 추가형(index.html 메타+스크립트1줄, 내 개선 전부 보존 확인)이라 깨끗이 rebase, 빌드+E2E 7/7 무손상.
10. **신청 동선 강화**(a3e0bf3, 라이브✓) — 카드 '신청 →' 버튼·센터모달 강좌별 '신청' 컬럼·센터 전화 클릭형 tel: 링크·표 신청링크 확대(9→13px)+aria. 9px 🔗 막다른길 해소(Fitts/Jakob, 명시적 텍스트 CTA).
11. **v9 레일 모달 겹침 수정**(cc32334, 라이브✓) — #v9-quick-actions(z940)가 코어모달(z100) 위로 떠 센터모달 신청컬럼 가리던 문제. `body:has(.modal-overlay) #v9-quick-actions{display:none}` CSS로 모달 열림시 숨김. index.html이라 v9_patch 주간 재생성에도 유지(durable).

## 남은 작업 (계획서, 미완 — 다음 세션)
- [치명] **라이브가 dist/(빌드본) 미사용** — 루트 index.html(Babel런타임) 배포 중. GitHub Pages가 dist/ 서빙하게 빌드파이프라인 연결(구조변경, 신중). 큰 성능향상.
- [높음] 끊긴기능: v6 데이터취득 React18 실패(센터비교/로드맵/시즌/캘린더 무음고장)·v8 추천 Math.random·v8 가짜 D-day알림·v8 잘못된 localStorage키. (※v8_patch는 봇 미재생성 → durable 수정 가능)
- [높음] 첫화면 Hick 정리(v4/v5/v9 떠다니는 버튼 다수 — 토글 접기/그룹화)·검색 디바운스·검색버튼 로딩상태.
- [높음] a11y: 모달 role="dialog"/aria-modal/포커스트랩·클릭형 td 키보드.
- build.mjs data전체 복사 정리·잡파일(_deleted_files/_*.js 등) 정리.

## 재개 지침
- 이 파일 + `_audit/plan_items.json` 읽기. 워크트리에서 작업 → 각 수정 후 `npm run build`(+[build] OK) + 서버8801 + `tests/e2e_munsen.py`(7/7) → 선택커밋(`git add <파일>`, -A 금지) → `git push origin worktree-improve-20260610:master`(ff).
- ★외부 자동봇이 주간 index.html 재작성(v9·v10 등) 가능 → **재개 시 반드시 `git fetch` 후 origin/master 변동 점검**. 변동 시 `git rebase origin/master`(내 변경은 보통 충돌 없음). v9는 순수 추가형이었음.
