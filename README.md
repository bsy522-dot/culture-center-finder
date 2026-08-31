# 문화센터 강좌 파인더 (culture-center-finder)

전국 43,000+ 문화센터 강좌(마감·개강일 경과 제외 — 지금 신청해서 처음부터 들을 수 있는 강좌만) 비교 PWA. React 18 (UMD) + v4~v7 패치 스크립트. ※홈플러스는 2026-07 영업중단(회생절차 폐지)으로 표기 중단.

## 프로덕션 빌드

브라우저-내 Babel 변환(@babel/standalone, ~2.8MB 런타임 다운로드)을 제거하고
JSX를 esbuild로 사전 변환·minify하여 `dist/`에 정적 산출물을 생성합니다.

```bash
npm install && npm run build      # → dist/ (index.html · app.js · 패치 · data 복사)
```

- 산출물은 `dist/`에 생성됩니다. `dist/` 전체를 그대로 배포하면 됩니다(단독 동작).
- 원본 `index.html`은 **소스(편집 대상)**이며 빌드는 이를 읽기만 합니다.
  외부 자동배포가 `index.html`을 갱신해도 `npm run build`를 다시 실행하면 `dist/`가 재생성됩니다.
- `src/app.jsx`는 빌드시 `index.html`에서 자동 추출되는 중간 산출물입니다(직접 편집 금지).

### 로컬 미리보기

```bash
python -m http.server 8080 --directory dist   # http://127.0.0.1:8080
```

## 빌드 효과

| 항목 | 원본 index.html | dist 빌드 |
|---|---|---|
| 초기 다운로드 | 인라인 JSX 110KB + @babel/standalone ~2.8MB | index.html 20KB + app.js 77KB |
| JSX 변환 | 브라우저에서 런타임 변환 | 사전 변환 완료(런타임 0) |
| 동작 | 기준 | 동일 (강좌 렌더·필터·패치 모두 동일) |
