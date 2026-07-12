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
  return out;
}

async function copyStatics() {
  // vN_patch.js 자동 수집 — 외부 봇이 v9,v10… 추가해도 dist 누락 없이 단독 배포 유지
  const patchFiles = (await fs.readdir(ROOT)).filter(f => /^v\d+_patch\.js$/.test(f));
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
