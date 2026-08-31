/**
 * 문화센터 강좌 파인더 - 프로덕션 빌드 스크립트
 * ----------------------------------------------------------------------------
 * 목적: Babel-in-browser(@babel/standalone 런타임 변환) 제거 → 초기 로딩 속도 개선.
 *
 * 동작:
 *   1. 원본 index.html(읽기 전용, 비파괴)에서 <script type="text/babel"> 본문을 추출
 *      → src/app.jsx 로 기록 (외부 자동배포가 index.html을 갱신해도 항상 최신 소스 반영)
 *   2. esbuild 로 JSX → JS 변환 · 번들 · minify → dist/app.js
 *      - React / ReactDOM 은 전역(window.React, window.ReactDOM)으로 사용되므로 번들에 포함하지 않음
 *      - 소스에 import/export 가 전혀 없어 외부 의존성 번들링 불필요
 *   3. dist/index.html 생성:
 *      (a) @babel/standalone <script> 제거
 *      (b) type="text/babel" 인라인 블록 → <script src="app.js"></script> 로 교체
 *      (c) react / react-dom CDN, v4~v8_patch.js, data/ 참조는 그대로 유지
 *   4. 정적 자산(patch js, manifest, icons, sw.js, data/)을 dist/ 로 복사 → dist 단독 배포 가능
 *
 * 재실행: `npm run build` (또는 `node build.mjs`)
 */

import { build } from 'esbuild';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC_HTML = path.join(ROOT, 'index.html');
const SRC_DIR = path.join(ROOT, 'src');
const SRC_JSX = path.join(SRC_DIR, 'app.jsx');
const DIST_DIR = path.join(ROOT, 'dist');
const DIST_HTML = path.join(DIST_DIR, 'index.html');
const DIST_JS = path.join(DIST_DIR, 'app.js');

const BABEL_OPEN = '<script type="text/babel">';
const BABEL_CLOSE = '</script>';
// 원본 index.html 에서 그대로 제거할 @babel/standalone 로더 라인
const BABEL_CDN_RE = /[ \t]*<script[^>]*@babel\/standalone[^>]*><\/script>\s*\n?/i;

// ★ 배포 허용 패치 화이트리스트 (2026-08-31 신설 — 감사 P0-1)
// 외부 자동봇이 매주 [AUTO] 커밋으로 vN_patch.js를 추가하고 index.html에 <script> 태그를 붙인다.
// 이전에는 루트의 vN_patch.js를 '전량 자동수집'해 dist에 넣었기 때문에, 아무도 승인하지 않은
// 기능이 그대로 손님 화면(특히 하단 내비)에 쌓였다(내비 31칸 중 27칸이 B2B 분석도구).
// 이제는 아래 목록에 있는 것만 dist로 복사하고, 목록에 없는 패치의 <script> 태그는
// dist/index.html 에서 주석 처리한다(파일은 보존 — 404도 나지 않음).
//
// ※새 패치를 배포하려면: (1) 실데이터 기반인지 감사(CLAUDE.md 5항) → (2) 여기에 이름 추가.
//   추가하지 않으면 라이브에 절대 나가지 않는다. 이것이 의도된 동작이다.
const ALLOWED_PATCHES = new Set([
  // 손님용 기능 패치(유지) — 세분화·AI추천·시간표·리뷰·플래너·진도트래커 등
  'v4_patch.js', 'v5_patch.js', 'v6_patch.js', 'v7_patch.js',
  // 전문가용 분석 허브(유지하되 guest_shell.js가 '분석' 시트 안으로 격리)
  'v16_patch.js', 'v17_patch.js', 'v18_patch.js', 'v19_patch.js', 'v20_patch.js',
  'v21_patch.js', 'v22_patch.js', 'v25_patch.js', 'v26_patch.js', 'v27_patch.js',
  // 손님 우선 셸 — 내비 격리·빈결과 안내·롯데마트 대체동선(직접 작성, 봇 생성물 아님)
  'guest_shell.js',
]);
// v8~v15(가짜 인물·리뷰·Math.random 통계), v23·v24(이용자 행동 날조)는 의도적으로 제외 —
// 되살리려면 감사 후 병석님 승인 필요.

// dist 로 복사할 정적 자산(존재하는 것만 복사). data/ 는 디렉터리 재귀 복사.
const STATIC_FILES = [
  'manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png',
  'privacy.html', // 개인정보처리방침 — 배포 사이트에 반드시 포함(스토어 심사 하드게이트)
  'robots.txt', 'sitemap.xml', // SEO — 검색엔진 크롤링 허용 + 지역 랜딩 색인(gen_seo_pages.py 생성물)
];
const STATIC_DIRS = ['data', 'seo']; // seo/ — 지역별 SEO 랜딩 정적페이지(gen_seo_pages.py가 매 데이터 업데이트마다 재생성)

async function readHtml() {
  return fs.readFile(SRC_HTML, 'utf8');
}

/** index.html 에서 babel 스크립트 본문(JSX)을 추출 */
function extractJsx(html) {
  const start = html.indexOf(BABEL_OPEN);
  if (start === -1) throw new Error(`'${BABEL_OPEN}' 블록을 index.html 에서 찾을 수 없습니다.`);
  const bodyStart = start + BABEL_OPEN.length;
  const end = html.indexOf(BABEL_CLOSE, bodyStart);
  if (end === -1) throw new Error('babel 스크립트의 닫는 </script> 를 찾을 수 없습니다.');
  return html.slice(bodyStart, end);
}

/** dist/index.html 본문 생성: babel CDN 제거 + 인라인 블록 → <script src="app.js"> */
function buildDistHtml(html) {
  // (a) @babel/standalone 로더 제거
  let out = html.replace(BABEL_CDN_RE, '');
  if (/@babel\/standalone/i.test(out)) {
    throw new Error('@babel/standalone 스크립트 제거에 실패했습니다.');
  }
  // (b) 인라인 babel 블록 → 빌드 결과 참조로 교체
  const start = out.indexOf(BABEL_OPEN);
  const end = out.indexOf(BABEL_CLOSE, start + BABEL_OPEN.length);
  const blockEnd = end + BABEL_CLOSE.length;
  out = out.slice(0, start) + '<script src="app.js"></script>' + out.slice(blockEnd);

  // (c) 화이트리스트에 없는 vN_patch.js <script> 태그 제거(주석화)
  //     — 파일을 복사하지 않으므로 태그를 남겨두면 404 콘솔 에러가 난다. 태그째 무력화한다.
  //     ※이미 `<!-- <script src="v23_patch.js"></script> -->` 처럼 주석 안에 든 태그는 건드리지 않는다.
  //       주석을 또 감싸면 `<!-- <!-- … --> -->` 가 되어 브라우저가 첫 `-->` 에서 주석을 닫고
  //       남은 ` -->` 를 본문 텍스트로 그려버린다(2026-08-31 실측).
  out = out.replace(/(<!--\s*)?<script\s+src="(v\d+_patch\.js)"><\/script>/g, (m, pre, f) => {
    if (pre) return m;                       // 이미 비활성화된 태그 — 그대로 둔다
    return ALLOWED_PATCHES.has(f) ? m : `<!-- 배포 제외(build.mjs ALLOWED_PATCHES 미등재): ${f} -->`;
  });
  return out;
}

async function copyStatics() {
  // 화이트리스트에 있는 패치만 dist로 복사(자동 수집 금지 — 위 ALLOWED_PATCHES 주석 참조)
  const onDisk = (await fs.readdir(ROOT)).filter(f => /^v\d+_patch\.js$/.test(f) || f === 'guest_shell.js');
  const patchFiles = onDisk.filter(f => ALLOWED_PATCHES.has(f));
  const skipped = onDisk.filter(f => !ALLOWED_PATCHES.has(f));
  if (skipped.length) console.log(`[build]   미승인 패치 ${skipped.length}건 배포 제외: ${skipped.join(', ')}`);
  for (const f of patchFiles) {
    try { await fs.copyFile(path.join(ROOT, f), path.join(DIST_DIR, f)); }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  for (const f of STATIC_FILES) {
    const srcP = path.join(ROOT, f);
    try {
      await fs.copyFile(srcP, path.join(DIST_DIR, f));
    } catch (e) {
      if (e.code !== 'ENOENT') throw e; // 없으면 조용히 skip
    }
  }
  for (const d of STATIC_DIRS) {
    const srcP = path.join(ROOT, d);
    try {
      await fs.cp(srcP, path.join(DIST_DIR, d), { recursive: true });
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
    }
  }
}

async function main() {
  const html = await readHtml();

  // 1. JSX 추출 → src/app.jsx
  const jsx = extractJsx(html);
  await fs.mkdir(SRC_DIR, { recursive: true });
  const banner =
    '/* AUTO-GENERATED from index.html by build.mjs — do not edit by hand. ' +
    'Edit index.html instead, then run `npm run build`. */\n';
  await fs.writeFile(SRC_JSX, banner + jsx, 'utf8');

  // 2. dist 초기화(이전 산출물·임시파일 제거) + esbuild 변환/번들/minify
  try { await fs.rm(DIST_DIR, { recursive: true, force: true }); } catch (e) { console.warn('dist 정리 건너뜀(파일락):', e.code); }
  await fs.mkdir(DIST_DIR, { recursive: true });
  const result = await build({
    entryPoints: [SRC_JSX],
    outfile: DIST_JS,
    bundle: true,
    minify: true,
    format: 'iife',
    target: ['es2018'],
    loader: { '.jsx': 'jsx' },
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    legalComments: 'none',
    logLevel: 'info',
  });
  if (result.errors.length) {
    throw new Error('esbuild 변환 실패: ' + JSON.stringify(result.errors));
  }

  // 3. dist/index.html 생성
  const distHtml = buildDistHtml(html);
  await fs.writeFile(DIST_HTML, distHtml, 'utf8');

  // 4. 정적 자산 복사
  await copyStatics();

  // 크기 비교 로그
  const [srcSize, jsSize] = await Promise.all([
    fs.stat(SRC_HTML).then(s => s.size),
    fs.stat(DIST_JS).then(s => s.size),
  ]);
  const kb = n => (n / 1024).toFixed(1) + ' KB';
  console.log('[build] OK');
  console.log(`[build]   src  index.html : ${kb(srcSize)}  (인라인 JSX + @babel/standalone 런타임 ~2.8 MB 다운로드)`);
  console.log(`[build]   dist app.js     : ${kb(jsSize)}  (사전 변환·minify, babel 런타임 0)`);
  console.log(`[build]   dist/ 단독 배포 가능 (patch·manifest·sw·icons·data 복사 완료)`);
}

main().catch(err => {
  console.error('[build] FAILED:', err.message);
  process.exit(1);
});
