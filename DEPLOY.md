# 문센파인더 배포·운영 가이드

전국 문화센터 강좌 검색 PWA. React18(UMD) + 패치(v4~v9) + 정적 데이터(data/).

## 설치 (개발/로컬 미리보기)
```
cd app
python -m http.server 8801        # http://localhost:8801
```
(또는) 프로덕션 빌드 미리보기:
```
npm install                       # 최초 1회 (esbuild devDependency)
npm run build                     # JSX 사전컴파일 → dist/ 생성
cd dist && python -m http.server 8802
```

## 업데이트 (코드/데이터 변경 후)
1. 변경 → `npm run build` (빌드 에러 0 확인)
2. 테스트: `python tests/e2e_munsen.py` (핵심 3시나리오 통과 확인)
3. 배포: master 브랜치 push → **GitHub Actions(`.github/workflows/deploy.yml`)가 esbuild로 dist/ 빌드 후 Pages 배포**(2026-07-10 전환, Pages build_type=workflow). 소스는 여전히 index.html(인라인 JSX)이며 빌드가 자동 추출 — 루트를 직접 서빙하던 legacy 방식 아님. 봇 [AUTO] 커밋도 푸시 즉시 자동 재빌드·반영. 빌드 실패 시 직전 성공 배포 유지.
   - 롤백: Pages 설정을 legacy(master 루트)로 되돌리면 종전 Babel-in-browser 서빙으로 복귀 가능(루트 index.html은 계속 단독 동작 가능하게 유지할 것).

## 롤백 (문제 발생 시)
- **저장 지점 단위 복원**: 각 작업은 커밋으로 저장됨. 직전 상태로 되돌리려면 해당 커밋으로 복원(작업자가 처리).
- **백업 파일**: `_baseline_v8/`(개선 전 전체), `data/*.full.bak`(강사명 포함 원본·비공개), `*.xssbak`(보안수정 전).
- 데이터만 되돌리려면 `data/*.full.bak` 또는 `_baseline_v8/data_bak` 복사.

## 데이터 운영 (우회전략 — 두 버전)
- **공개 배포본**: 강사 실명 제거(개인정보 보호). 강좌명·가격·요일·시간·시작일·기간·카테고리 유지.
- **내부 전체본**: `data/*.full.bak` (강사명 포함, gitignore로 공개 차단).
- 크롤 갱신 시: 새 데이터에 강사명 제거 스크립트 재적용 후 배포.

## 외부 서비스 (출시 전 정식화 필요)
- 지도/지오코딩: nominatim(공개서버) → 상용 시 자체호스팅/유료 API 권장.
- 경로/거리: router.project-osrm(데모서버) → 상용 시 정식 API 권장.
- 상기 항목은 비상업 단계에선 사용 가능하나 수익화 시 교체 필요(법률 검토 리포트 참조).

## 보안
- 사용자 입력은 esc() 헬퍼로 이스케이프(저장형 XSS 차단, v4~v8 적용). ※v9_patch.js는 자동봇 생성분 — 출시 전 XSS 재검토 권장.
- 하드코딩 비밀키 없음. localStorage만 사용(서버 전송 없음).

## 운영 주의 (주간 자동봇)
- 외부 자동봇이 주기적으로 index.html·manifest·sw·vN_patch.js를 master에 **추가형**으로 푸시(v4→v9 …). 순수 추가형이라 보통 충돌은 없으나, 개선 작업 재개 시 **반드시 `git fetch` 후 origin/master 변동 점검** → 변동 시 `git rebase origin/master`.
- 개선 배포는 워크트리 브랜치에서 `git push origin <branch>:master`(빨리감기)로 수행. GitHub Pages 1~2분 후 반영.
