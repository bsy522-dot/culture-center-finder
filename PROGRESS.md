# 문센파인더 상용화 개선 — 진행상황 (PROGRESS)

## 목표 (완료조건 6)
1. 프로덕션 빌드 0에러  2. 테스트통과+린트0  3. 코드리뷰 Critical/High 0
4. 핵심 시나리오 3개 Playwright E2E  5. 보안(의존성·비밀키) C/H 0  6. 배포·변경내역 문서

## ★작업공간 (세션2)
- **격리 워크트리**: `app/.claude/worktrees/improve-20260610` (브랜치 `worktree-improve-20260610`). 모든 편집·빌드 여기서. 완료 후 master 병합. 충돌 0.
- 백업 `_baseline_v8/`. React18 UMD + 인라인JSX(index.html) + v4~v8패치 + esbuild(dist/).

## ★분석·계획 (완료)
- 분석 워크플로우 34에이전트(적대검증) → **85개 발견(치명8·높음26·보통33·낮음18)**.
- 계획서: `_audit/문센파인더_상용화_개선계획.html` (열림) + 데이터 `_audit/plan_items.json` (재개 시 이 파일 읽기).

## ✅ 완료·검증된 개선 (세션2, 각 빌드+E2E 7/7 회귀0)
- [x] **정크 93MB 제거** (4fa9fc0): 백업PII 65,987·hp원본·스크린샷 → _deleted_files. 120MB→54MB. (조건③⑤ 잔존·저작권 해소)
- [x] **접근성 라벨 4곳** (aad6aa3): 검색·출발지·이동시간·출생년도 aria-label.
- [x] **성능 캐시버스터 제거** (ed0e9a9): 매방문 27MB 재다운로드 → 304(변경시만). network-first+ETag 신선도 유지.
- [x] **색상대비 WCAG AA** (색상토큰): muted/faint/필터텍스트 다크 3.13→7.26:1·라이트 2.45→6.0:1.
- [x] 조건①빌드0 · ②구문0 · ④E2E 7/7 · ⑤보안0(취약점·비밀키) · ⑥문서(DEPLOY·CHANGELOG)

## ⏸ 세션 한도 (오후 7시 Asia/Seoul 리셋)
- 대규모 에이전트 워크플로우 일시정지(종합 단계 한도 도달). 메인루프 단발 수정은 계속 가능.
- 리셋 후 또는 다음 세션에서 아래 [남은 Critical/High]부터 재개.

## 남은 작업 (계획서 우선순위, 미완)
- 조건③ 코드리뷰 C/H 0 위해 처리할 핵심:
  - [치명] v7 가짜 강사평점(INSTRUCTORS 12명, v7_patch.js:172) 제거 — 실상호에 허구평점(법적). 메뉴·단축키 호출처까지 함께 제거.
  - [치명] **라이브가 dist/(빌드) 안 쓰고 루트 index.html(Babel런타임) 배포** — GitHub Pages가 dist/ 서빙하게 전환(또는 dist→루트). 빌드 파이프라인이 실효되게.
  - [치명] 신청링크 9px 이모지·센터모달 막다른길 (UX) / 패치오버레이 스크린리더 비가시(a11y, effort L)
  - [높음] 끊긴기능: v6 데이터취득 React18 영구실패(센터비교/로드맵/시즌/캘린더 무음고장)·v8 추천 Math.random·v8 가짜 D-day알림·v8 잘못된 localStorage키.
  - [높음] 터치타겟<44px(필터칩·체크박스·하단네비)·검색 디바운스·로딩/disabled상태·:active피드백·showCount 리셋·build.mjs가 data전체 복사.
  - [높음] a11y: 폼라벨·모달 role/포커스트랩·클릭형 td 키보드.
- UX 첫화면 Hick 정리(v4/v5 12버튼 토글), 반응형, Lighthouse 90+.
- 잡파일: aad6aa3에 분석 스크래치(_deleted_files/_*.js 등 8개) 섞임 → master 병합 전 정리.

## 재개 지침
- 이 파일 + `_audit/plan_items.json`(85건) + `_audit/문센파인더_상용화_개선계획.html` 읽으면 즉시 재개.
- 워크트리에서 작업 → 각 수정 후 `npm run build` + `python -m http.server 8801` & `python tests/e2e_munsen.py`(7/7 확인) → `git add <파일> && commit`(선택커밋, -A 금지).
- 최종: 워크트리 브랜치 → master 병합 + 6조건 실증 + 비전문가 보고(전/후 스크린샷).
