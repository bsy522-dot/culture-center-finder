/**
 * guest_shell.js — 손님 우선 셸 (2026-08-31, 품질감사 P0-1 대응)
 * ---------------------------------------------------------------------------
 * 문제: 외부 자동봇이 매주 추가한 vN_patch.js 들이 하단 내비에 자기 버튼을 밀어 넣어
 *       손님용 4칸이 31칸이 됐고(27칸이 B2B 분석도구), 분석 허브가 목록 아래에 통째로
 *       쌓여 목록 페이지 높이가 25,926px(휴대폰 30.7화면)까지 불어났다.
 *
 * 해결(최소 침습 — 패치 파일도, 패치 기능도 건드리지 않는다):
 *   1) 하단 내비에서 vN 패치 버튼을 걷어내 '분석 도구' 시트 안으로 옮긴다.
 *      버튼 DOM을 그대로 이동하므로 각 패치가 붙여둔 클릭 핸들러는 살아 있다.
 *   2) 분석 허브 컨테이너는 기본 숨김. 시트에서 도구를 고를 때만 펼친다.
 *   3) MutationObserver로 상시 감시 — 앞으로 봇이 v28, v29를 추가해도 자동 격리된다.
 *      (배포 자체 차단은 build.mjs 의 ALLOWED_PATCHES 화이트리스트가 담당)
 *
 * 이 파일은 봇 생성물이 아니라 직접 작성한 코어 자산이다. 삭제 금지.
 */
(function () {
  'use strict';

  var EXPERT_ON = 'ccf-expert-on';
  // 패치들이 붙이는 내비 버튼: aria-label 이 항상 'v25 포트폴리오' 꼴이다(v25·v26·v27 동일 확인).
  var EXPERT_LABEL_RE = /^v\d+\s/;
  // 분석 허브 컨테이너 id: 'v16-analytics-hub'(v16·v17) / 'ccf-v18-hub'(v18 이후)
  var HUB_ID_RE = /^(?:ccf-)?v\d+[-_](?:analytics[-_])?hub$/;

  /* ── 스타일 ───────────────────────────────────────────────────────── */
  var css = document.createElement('style');
  css.id = 'ccf-guest-shell-style';
  css.textContent = [
    /* 분석 허브: 전문가 모드일 때만 표시 */
    'body:not(.' + EXPERT_ON + ') [data-ccf-hub]{display:none!important}',
    /* 반대로 전문가 모드에서는 강좌 목록·푸터를 감춘다.
       (1) 분석 화면 위에 강좌 목록이 남아 있으면 무슨 화면인지 알 수 없다.
       (2) 더 중요한 이유: 도구를 누르면 허브까지 스크롤하는데, 그 과정에서 목록 하단의
           무한스크롤 감시자(sentinel)가 화면에 들어와 카드를 100개씩 계속 붙인다.
           실측으로 7,110px 페이지가 33,261px까지 불어났다. 목록을 감추면 애초에 안 걸린다. */
    'body.' + EXPERT_ON + ' #main-content{display:none!important}',
    'body.' + EXPERT_ON + ' .app-footer{display:none!important}',
    'body.' + EXPERT_ON + ' #ccf-expert-launcher{display:none!important}',

    /* 전문가용 진입 카드(데스크톱·모바일 공통, 목록 맨 아래) */
    '#ccf-expert-launcher{max-width:700px;margin:28px auto 8px;padding:16px 18px;border:1px dashed var(--card-border,rgba(255,255,255,.14));border-radius:14px;background:var(--card-bg,rgba(255,255,255,.03));display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap}',
    '#ccf-expert-launcher .ccf-l-t{font-size:13px;font-weight:800;color:var(--text-primary,#fff)}',
    '#ccf-expert-launcher .ccf-l-d{font-size:11px;color:var(--text-muted,rgba(255,255,255,.6));margin-top:3px;line-height:1.5}',
    '#ccf-expert-launcher button{background:var(--input-bg,rgba(255,255,255,.06));border:1px solid var(--input-border,rgba(255,255,255,.12));color:var(--text-primary,#fff);font:inherit;font-size:12px;font-weight:700;padding:9px 16px;border-radius:9px;cursor:pointer;white-space:nowrap}',
    '#ccf-expert-launcher button:hover{border-color:var(--accent,#7EC8E3);color:var(--accent,#7EC8E3)}',

    /* 시트 */
    '#ccf-expert-sheet[hidden]{display:none!important}',
    '#ccf-expert-sheet{position:fixed;inset:0;z-index:400;display:flex;align-items:flex-end;justify-content:center}',
    '#ccf-expert-sheet .ccf-bd{position:absolute;inset:0;background:var(--overlay-bg,rgba(0,0,0,.7))}',
    '#ccf-expert-sheet .ccf-pn{position:relative;width:100%;max-width:620px;max-height:82vh;overflow-y:auto;background:var(--modal-bg,#111827);border:1px solid var(--modal-border,rgba(126,200,227,.2));border-radius:16px 16px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0px));box-shadow:var(--shadow,0 4px 24px rgba(0,0,0,.4))}',
    '@media (min-width:769px){#ccf-expert-sheet{align-items:center}#ccf-expert-sheet .ccf-pn{border-radius:16px;max-height:86vh}}',
    '#ccf-expert-sheet h2{font-size:15px;font-weight:800;color:var(--text-primary,#fff);margin:0}',
    '#ccf-expert-sheet .ccf-sub{font-size:11.5px;color:var(--text-muted,rgba(255,255,255,.6));margin-top:5px;line-height:1.55}',
    '#ccf-expert-sheet .ccf-hd{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}',
    '#ccf-expert-sheet .ccf-x{flex:0 0 auto;width:34px;height:34px;border-radius:9px;background:var(--input-bg,rgba(255,255,255,.06));border:1px solid var(--input-border,rgba(255,255,255,.12));color:var(--text,#D4D4D4);font-size:15px;cursor:pointer;line-height:1}',
    '#ccf-expert-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}',
    /* 이동해 온 패치 버튼 재스타일 — 패치가 인라인 style(8px)로 박아둔 글씨를 !important 로 덮는다 */
    '#ccf-expert-grid > button{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:66px;padding:10px 6px;background:var(--card-bg,rgba(255,255,255,.03));border:1px solid var(--card-border,rgba(255,255,255,.08));border-radius:11px;color:var(--text,#D4D4D4);font:inherit;cursor:pointer;text-align:center}',
    '#ccf-expert-grid > button:hover{border-color:var(--accent,#7EC8E3)}',
    '#ccf-expert-grid > button > span{font-size:12px!important;color:var(--text,#D4D4D4)!important;line-height:1.3;word-break:keep-all}',
    '#ccf-expert-grid > button > span:first-child{font-size:19px!important}',
    '#ccf-expert-empty{font-size:12px;color:var(--text-muted,rgba(255,255,255,.6));padding:18px 4px;text-align:center;line-height:1.6}',

    /* 전문가 모드 종료 버튼 */
    '#ccf-expert-exit[hidden]{display:none!important}',
    '#ccf-expert-exit{position:fixed;right:14px;bottom:76px;z-index:90;background:var(--toast-bg,#1E3A5F);color:var(--text-primary,#fff);border:1px solid var(--modal-border,rgba(126,200,227,.3));border-radius:22px;padding:10px 16px;font:inherit;font-size:12px;font-weight:700;cursor:pointer;box-shadow:var(--shadow,0 4px 24px rgba(0,0,0,.4))}',
    '@media (min-width:769px){#ccf-expert-exit{bottom:20px}}'
  ].join('\n');
  (document.head || document.documentElement).appendChild(css);

  /* ── 시트 DOM ─────────────────────────────────────────────────────── */
  var sheet, grid, exitBtn, launcher;

  function buildSheet() {
    if (sheet) return;
    sheet = document.createElement('div');
    sheet.id = 'ccf-expert-sheet';
    sheet.hidden = true;
    sheet.innerHTML =
      '<div class="ccf-bd"></div>' +
      '<div class="ccf-pn" role="dialog" aria-modal="true" aria-labelledby="ccf-expert-title">' +
        '<div class="ccf-hd">' +
          '<div>' +
            '<h2 id="ccf-expert-title">분석 도구 (전문가용)</h2>' +
            '<div class="ccf-sub">강좌를 찾고 신청하는 데는 필요 없는 화면입니다. ' +
            '센터별 가격·경쟁·수요를 데이터로 들여다볼 때만 쓰세요. ' +
            '모두 실제 수집한 강좌 데이터로 계산합니다.</div>' +
          '</div>' +
          '<button class="ccf-x" type="button" aria-label="분석 도구 닫기">✕</button>' +
        '</div>' +
        '<div id="ccf-expert-grid"></div>' +
        '<div id="ccf-expert-empty" hidden>분석 도구가 아직 준비되지 않았습니다. 잠시 후 다시 열어 주세요.</div>' +
      '</div>';
    document.body.appendChild(sheet);
    grid = sheet.querySelector('#ccf-expert-grid');

    sheet.querySelector('.ccf-bd').addEventListener('click', closeSheet);
    sheet.querySelector('.ccf-x').addEventListener('click', closeSheet);
    // 캡처 단계: 패치 버튼의 원래 핸들러(scrollIntoView)가 돌기 '전에' 허브를 펼쳐 둬야
    // 스크롤 목표가 display:none 이 아니게 된다.
    grid.addEventListener('click', function (e) {
      if (!e.target.closest('button')) return;
      document.body.classList.add(EXPERT_ON);
      if (exitBtn) exitBtn.hidden = false;
      closeSheet();
    }, true);

    exitBtn = document.createElement('button');
    exitBtn.id = 'ccf-expert-exit';
    exitBtn.type = 'button';
    exitBtn.hidden = true;
    exitBtn.textContent = '✕ 분석 화면 닫기';
    exitBtn.addEventListener('click', function () {
      document.body.classList.remove(EXPERT_ON);
      exitBtn.hidden = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(exitBtn);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sheet && !sheet.hidden) closeSheet();
    });
  }

  /* ── 분석 패치 지연 로드 ────────────────────────────────────────
     build.mjs 가 배포본에서 분석 패치 10개(551KB)의 <script> 태그를 빼고
     <meta name="ccf-lazy-patches"> 에 파일명만 남긴다. 손님 대부분은 강좌만 찾고
     나가므로 첫 방문 전송량에서 통째로 빠진다. 시트를 처음 열 때만 순서대로 주입한다.
     meta 가 없으면(원본 index.html = legacy 폴백) 이미 로드돼 있으므로 아무것도 안 한다. */
  var patchState = 'idle';   // idle → loading → done(스크립트 로드 완료)
  var doneAt = 0;            // 스크립트 로드가 끝난 시각
  var GRACE_MS = 10000;      // 로드 완료 후 타일이 붙기를 기다려 주는 시간
  var graceTimer = null;

  function lazyList() {
    var m = document.querySelector('meta[name="ccf-lazy-patches"]');
    var v = m && m.getAttribute('content');
    return v ? v.split(',').map(function (x) { return x.trim(); }).filter(Boolean) : [];
  }

  function loadScript(src) {
    return new Promise(function (res) {
      var el = document.createElement('script');
      el.src = src;
      el.async = false;              // 주입 순서 = 실행 순서(허브 연결 순서 유지)
      el.onload = el.onerror = function () { res(); };
      document.body.appendChild(el);
    });
  }

  function ensurePatches() {
    if (patchState !== 'idle') return Promise.resolve();
    var files = lazyList();
    if (!files.length) { patchState = 'done'; return Promise.resolve(); }
    patchState = 'loading';
    // 패치는 window.__v4Data(강좌 원본)를 읽는다. 아직 안 왔으면 잠깐 기다린다(최대 8초).
    var waited = 0;
    return new Promise(function (res) {
      (function wait() {
        if ((window.__v4Data && window.__v4Data.length) || waited >= 8000) return res();
        waited += 200; setTimeout(wait, 200);
      })();
    }).then(function () {
      return files.reduce(function (p, f) { return p.then(function () { return loadScript(f); }); },
                          Promise.resolve());
    }).then(function () {
      patchState = 'done';
      doneAt = Date.now();
      sweep();
    });
  }

  // 시트 안내문구 갱신. 도구 타일은 패치가 로드된 '뒤에도' sweep()이 비동기로 계속 채우므로
  // (패치마다 자기 내비 버튼을 붙이는 시점이 다르다) 이 함수는 sweep() 끝에서도 매번 불린다.
  // 2026-08-31 재감사 N-2: 로드 직후 한 번만 부르던 탓에 도구 27개가 다 뜬 뒤에도
  // '불러오지 못했습니다'가 영구히 남아 있었다.
  function refreshSheetState() {
    if (!sheet) return;
    var empty = sheet.querySelector('#ccf-expert-empty');
    if (!empty) return;
    if (grid.children.length > 0) {
      if (!empty.hidden) empty.hidden = true;
      return;
    }
    // '스크립트 로드 완료'와 '도구 타일 준비 완료'는 다르다. 각 패치는 스크립트가 실행된 뒤
    // 저마다 다른 시점에 하단 내비 버튼을 붙이고, guest_shell 은 그걸 관찰해 시트로 옮긴다.
    // 그래서 로드 직후 타일이 비어 있는 것은 '실패'가 아니라 '아직'이다.
    // 유예 시간이 지나도록 타일이 하나도 없을 때만 실패라고 말한다(재감사 N-2 후속).
    var failed = patchState === 'done' && doneAt && (Date.now() - doneAt > GRACE_MS);
    var msg = failed
      ? '분석 도구를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.'
      : '분석 도구를 불러오는 중입니다…';
    // 유예가 끝나는 시점에 한 번 다시 평가해 문구가 멈춰 있지 않게 한다.
    if (!failed && patchState === 'done' && doneAt && !graceTimer) {
      graceTimer = setTimeout(function () { graceTimer = null; refreshSheetState(); },
                              Math.max(500, GRACE_MS - (Date.now() - doneAt)) + 100);
    }
    if (empty.hidden) empty.hidden = false;
    // 같은 문자열을 다시 써도 childList 변경으로 잡혀 MutationObserver→sweep→여기로 되돌아온다.
    // 값이 실제로 달라질 때만 쓴다.
    if (empty.textContent !== msg) empty.textContent = msg;
  }

  function openSheet() {
    buildSheet();
    sheet.hidden = false;
    refreshSheetState();
    ensurePatches().then(refreshSheetState);
    var first = grid.querySelector('button') || sheet.querySelector('.ccf-x');
    if (first) { try { first.focus(); } catch (_) {} }
  }

  function closeSheet() { if (sheet) sheet.hidden = true; }

  /* ── 격리 스윕 ────────────────────────────────────────────────────── */
  function sweepNav() {
    var inner = document.querySelector('.bottom-nav-inner');
    if (!inner) return;
    buildSheet();

    // 1. 패치가 밀어 넣은 버튼을 시트로 이동(핸들러 유지)
    Array.prototype.slice.call(inner.children).forEach(function (el) {
      if (el.tagName !== 'BUTTON') return;
      if (el.getAttribute('data-ccf-nav') === 'expert-entry') return;
      if (!EXPERT_LABEL_RE.test(el.getAttribute('aria-label') || '')) return;
      el.classList.remove('bottom-nav-btn');
      grid.appendChild(el);
    });

    // 2. 손님용 내비 끝에 '분석' 한 칸
    if (!inner.querySelector('[data-ccf-nav="expert-entry"]')) {
      var b = document.createElement('button');
      b.className = 'bottom-nav-btn';
      b.type = 'button';
      b.setAttribute('data-ccf-nav', 'expert-entry');
      b.setAttribute('aria-label', '분석 도구 열기 (전문가용)');
      b.innerHTML = '<span>🔬</span>분석';
      b.addEventListener('click', openSheet);
      inner.appendChild(b);
    }
  }

  function sweepHubs() {
    var all = document.querySelectorAll('[id]');
    var first = null;
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (!HUB_ID_RE.test(el.id)) continue;
      if (!el.hasAttribute('data-ccf-hub')) el.setAttribute('data-ccf-hub', '1');
      if (!first) first = el;
    }
    // 목록 맨 아래 전문가용 진입 카드
    // (데스크톱에는 하단 내비가 없으므로 — .bottom-nav 는 768px 이하 전용 — 이 카드가 유일한 입구)
    // 지연 로드 중이면 허브가 아직 없으므로 #root 끝에 붙인다.
    if (!first && !launcher && lazyList().length) first = document.getElementById('root');
    if (first && !launcher) {
      buildSheet();
      launcher = document.createElement('div');
      launcher.id = 'ccf-expert-launcher';
      launcher.innerHTML =
        '<div><div class="ccf-l-t">🔬 분석 도구 (전문가용)</div>' +
        '<div class="ccf-l-d">센터별 가격·경쟁·수요를 데이터로 보는 화면입니다. ' +
        '강좌를 찾는 데는 필요 없어서 기본으로 접어 두었습니다.</div></div>' +
        '<button type="button">열어 보기</button>';
      launcher.querySelector('button').addEventListener('click', openSheet);
      if (first.id === 'root') first.appendChild(launcher);
      else first.parentNode.insertBefore(launcher, first);
    }
  }

  function sweep() {
    sweepNav();
    sweepHubs();
    // 타일이 뒤늦게 도착해도 안내문구가 따라오도록 매 스윕마다 재평가한다(재감사 N-2).
    if (sheet && !sheet.hidden) refreshSheetState();
  }

  /* ── 기동 ─────────────────────────────────────────────────────────── */
  function start() {
    sweep();
    var pending = false;
    new MutationObserver(function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () { pending = false; sweep(); });
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
