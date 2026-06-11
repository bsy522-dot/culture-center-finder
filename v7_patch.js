/**
 * culture-center-finder v7.0 patch
 * 수강진도트래커+강사평점시스템+위시리스트컬렉션+종목트렌드분석+수강비용계획기+동반수강매칭+학습목표설정+센터방문체크인+수강일기+강좌북마크폴더+퀴즈15추가(30→45)+업적12추가(42→54)+SFX6종+키보드8종
 */
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

const V7_ID = 'ccf-v7-patch';
if (document.getElementById(V7_ID)) return;
const marker = document.createElement('meta');
marker.id = V7_ID;
document.head.appendChild(marker);

function qs(s, p) { return (p || document).querySelector(s); }
function ce(tag, attrs, ch) {
  const el = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'className') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  });
  if (ch) {
    if (typeof ch === 'string') el.innerHTML = ch;
    else if (Array.isArray(ch)) ch.forEach(c => { if (c) el.appendChild(c); });
    else el.appendChild(ch);
  }
  return el;
}
function lsGet(k, d) { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} }
function showToast7(msg, dur) {
  const old = document.getElementById('v7-toast');
  if (old) old.remove();
  const t = ce('div', { id: 'v7-toast', style: {
    position:'fixed',top:'20px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#1B4332,#0C1525)',
    border:'1px solid rgba(82,183,136,0.5)',borderRadius:'14px',padding:'12px 24px',zIndex:'950',
    fontSize:'13px',fontWeight:'700',color:'#52B788',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
    animation:'v7SlideDown .3s ease both',whiteSpace:'nowrap',maxWidth:'90vw',overflow:'hidden',textOverflow:'ellipsis'
  }}, msg);
  document.body.appendChild(t);
  setTimeout(() => { t.style.animation = 'v7SlideUp .3s ease both'; setTimeout(() => t.remove(), 300); }, dur || 2500);
}
function dateSeed(offset) {
  const d = new Date(); d.setDate(d.getDate() + (offset || 0));
  return d.getFullYear() * 10000 + (d.getMonth()+1) * 100 + d.getDate();
}
function seededRandom(seed) {
  let s = seed;
  return function() { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

// ─── SFX 엔진 (6종) ─────────────────────────────────────────────
const SFX7 = {
  _ctx: null,
  _getCtx() {
    if (!this._ctx) try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    return this._ctx;
  },
  play(name) {
    const ctx = this._getCtx();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    const presets = {
      progress:    { freq: 523, type: 'sine', dur: 0.18, vol: 0.12 },
      rating:      { freq: 659, type: 'triangle', dur: 0.12, vol: 0.1 },
      wishlist:    { freq: 880, type: 'sine', dur: 0.1, vol: 0.08 },
      trend:       { freq: 440, type: 'triangle', dur: 0.2, vol: 0.1 },
      budget:      { freq: 587, type: 'sine', dur: 0.15, vol: 0.1 },
      checkin:     { freq: 784, type: 'triangle', dur: 0.15, vol: 0.12 },
      goal:        { freq: 698, type: 'sine', dur: 0.2, vol: 0.12 },
      diary:       { freq: 554, type: 'triangle', dur: 0.12, vol: 0.1 },
      bookmark:    { freq: 740, type: 'sine', dur: 0.1, vol: 0.08 },
      companion:   { freq: 622, type: 'triangle', dur: 0.15, vol: 0.1 },
      quiz_right:  { freq: 880, type: 'sine', dur: 0.12, vol: 0.1 },
      quiz_wrong:  { freq: 220, type: 'sawtooth', dur: 0.2, vol: 0.06 }
    };
    const p = presets[name] || presets.progress;
    o.frequency.value = p.freq;
    o.type = p.type;
    g.gain.setValueAtTime(p.vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + p.dur);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + p.dur);
  }
};

// ─── 모달 공통 ──────────────────────────────────────────────────
function createModal(title, contentHTML) {
  const existing = document.getElementById('v7-modal');
  if (existing) existing.remove();
  const overlay = ce('div', { id: 'v7-modal', style: {
    position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.75)',
    zIndex:'800',display:'flex',alignItems:'center',justifyContent:'center',
    animation:'v7FadeIn .2s ease',padding:'16px',boxSizing:'border-box'
  }});
  const modal = ce('div', { style: {
    background:'var(--modal-bg,#111827)',border:'1px solid var(--modal-border,rgba(126,200,227,0.2))',
    borderRadius:'16px',padding:'24px',maxWidth:'680px',width:'100%',maxHeight:'85vh',
    overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.6)',position:'relative'
  }});
  const header = ce('div', { style: { display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px' }});
  header.appendChild(ce('h3', { style: { margin:0,fontSize:'18px',fontWeight:'800',color:'var(--text-primary,#fff)' }}, title));
  const closeBtn = ce('button', { onClick: () => overlay.remove(), style: {
    background:'none',border:'none',color:'var(--text-muted)',fontSize:'24px',cursor:'pointer',padding:'4px 8px',lineHeight:1
  }}, '&times;');
  header.appendChild(closeBtn);
  modal.appendChild(header);
  const body = ce('div');
  body.innerHTML = contentHTML;
  modal.appendChild(body);
  overlay.appendChild(modal);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
  return body;
}

// ═══════════════════════════════════════════════════════════════════
// 1. 수강 진도 트래커
// ═══════════════════════════════════════════════════════════════════
function showProgressTracker() {
  SFX7.play('progress');
  const progress = lsGet('cc-progress', {});
  const cats = ['수영','피아노','요가','발레','미술','댄스','보컬','드로잉','서예','공예','코딩','쿠킹'];
  const levels = ['입문','초급','중급','상급'];

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">종목별 수강 진도를 추적하세요. 카드를 클릭해 진도를 업데이트합니다.</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">';

  cats.forEach(cat => {
    const pct = progress[cat] || 0;
    const levelIdx = Math.min(Math.floor(pct / 25), 3);
    const colors = ['#3B82F6','#10B981','#F59E0B','#EF4444'];
    html += '<div class="v7-progress-card" data-cat="' + cat + '" style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:16px;cursor:pointer;transition:all .2s">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
      '<span style="font-weight:700;font-size:14px;color:var(--text-primary)">' + cat + '</span>' +
      '<span style="font-size:11px;padding:3px 10px;border-radius:20px;background:' + colors[levelIdx] + '22;color:' + colors[levelIdx] + ';font-weight:600">' + levels[levelIdx] + '</span>' +
      '</div>' +
      '<div style="background:var(--bar-bg,rgba(255,255,255,0.04));border-radius:8px;height:10px;overflow:hidden;margin-bottom:8px">' +
      '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,' + colors[levelIdx] + ',' + colors[Math.min(levelIdx+1,3)] + ');border-radius:8px;transition:width .5s ease"></div>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted)">' +
      '<span>진행률 ' + pct + '%</span>' +
      '<span>' + (pct >= 100 ? '수료 완료!' : '다음: ' + levels[Math.min(levelIdx+1,3)]) + '</span>' +
      '</div></div>';
  });
  html += '</div>';

  const body = createModal('📊 수강 진도 트래커', html);
  body.querySelectorAll('.v7-progress-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-cat');
      const cur = progress[cat] || 0;
      const next = Math.min(cur + 10, 100);
      progress[cat] = next;
      lsSet('cc-progress', progress);
      SFX7.play('progress');
      showToast7('📊 ' + cat + ' 진도 ' + next + '%');
      if (next >= 100) checkAch7('course_complete');
      if (Object.values(progress).filter(v => v >= 50).length >= 5) checkAch7('multi_learner');
      showProgressTracker();
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
// 2. 강사 평점 시스템
// ═══════════════════════════════════════════════════════════════════
// [세션2] 가짜 강사 평점 제거 — 실제 상호(홈플러스/롯데마트/갤러리아 등)에 허구 강사·평점을
// 결부하는 것은 명예훼손·기만(부정경쟁) 법적 리스크. 실데이터 연동 전까지 비활성(빈 배열).
const INSTRUCTORS = [];

function showInstructorRating() {
  SFX7.play('rating');
  const myRatings = lsGet('cc-instructor-ratings', {});

  if (!INSTRUCTORS.length) {
    createModal('⭐ 강사 평점', '<div style="padding:24px;text-align:center;color:var(--text-secondary);line-height:1.8">강사 평점 기능은 <b>실제 강사 데이터 연동 후</b> 제공될 예정입니다.<br>확인되지 않은 정보는 표시하지 않습니다.</div>');
    return;
  }

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">강사님을 평가하고 리뷰를 남겨보세요. 별을 클릭해 평점을 매깁니다.</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px">';

  INSTRUCTORS.forEach((inst, idx) => {
    const myRate = myRatings[inst.name] || 0;
    const badgeColors = { '베스트': '#F59E0B', '인기': '#10B981', '추천': '#3B82F6', '신규': '#8B5CF6' };
    const bc = badgeColors[inst.badge] || '#666';
    html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:14px;padding:16px">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px">' +
      '<div>' +
      '<div style="font-weight:800;font-size:15px;color:var(--text-primary)">' + inst.name + ' 강사</div>' +
      '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">' + inst.cat + ' &middot; ' + inst.center + '</div>' +
      '</div>' +
      '<span style="font-size:10px;padding:3px 8px;border-radius:12px;background:' + bc + '22;color:' + bc + ';font-weight:700">' + inst.badge + '</span>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' +
      '<div style="font-size:22px;font-weight:800;color:#F59E0B">' + inst.rating.toFixed(1) + '</div>' +
      '<div style="display:flex;gap:1px" data-inst="' + idx + '">';
    for (let s = 1; s <= 5; s++) {
      const filled = s <= Math.round(inst.rating);
      html += '<span class="v7-star" data-inst="' + idx + '" data-star="' + s + '" style="cursor:pointer;font-size:16px;color:' + (filled ? '#F59E0B' : 'var(--text-faint)') + '">' + (filled ? '&#9733;' : '&#9734;') + '</span>';
    }
    html += '</div>' +
      '<div style="font-size:11px;color:var(--text-muted)">리뷰 ' + inst.reviews + '건</div>' +
      '</div>' +
      '<div style="font-size:11px;color:var(--text-secondary)">' +
      (myRate > 0 ? '내 평점: ' + '&#9733;'.repeat(myRate) + ' (' + myRate + '점)' : '아직 평가하지 않았습니다') +
      '</div></div>';
  });
  html += '</div>';

  const body = createModal('⭐ 강사 평점 시스템', html);
  body.querySelectorAll('.v7-star').forEach(star => {
    star.addEventListener('click', () => {
      const idx = parseInt(star.getAttribute('data-inst'));
      const s = parseInt(star.getAttribute('data-star'));
      myRatings[INSTRUCTORS[idx].name] = s;
      lsSet('cc-instructor-ratings', myRatings);
      SFX7.play('rating');
      showToast7('&#11088; ' + INSTRUCTORS[idx].name + ' 강사에게 ' + s + '점 평가!');
      if (Object.keys(myRatings).length >= 5) checkAch7('reviewer_5');
      if (Object.keys(myRatings).length >= 12) checkAch7('reviewer_all');
      showInstructorRating();
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
// 3. 위시리스트 컬렉션
// ═══════════════════════════════════════════════════════════════════
function showWishlist() {
  SFX7.play('wishlist');
  const wishlist = lsGet('cc-wishlist', []);
  const folders = lsGet('cc-wish-folders', ['기본','이번학기','가족']);

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">관심 강좌를 폴더별로 정리하세요. 종목과 메모를 추가할 수 있습니다.</div>';

  html += '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">';
  folders.forEach(f => {
    const cnt = wishlist.filter(w => w.folder === f).length;
    html += '<button class="v7-folder-btn" data-folder="' + esc(f) + '" style="padding:6px 14px;border-radius:20px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text-primary);font-size:12px;font-weight:600;cursor:pointer">' + esc(f) + ' (' + cnt + ')</button>';
  });
  html += '<button id="v7-add-folder" style="padding:6px 14px;border-radius:20px;border:1px dashed var(--accent);background:transparent;color:var(--accent);font-size:12px;cursor:pointer;font-weight:600">+ 폴더</button>';
  html += '</div>';

  html += '<div style="display:flex;gap:8px;margin-bottom:16px">' +
    '<input id="v7-wish-cat" placeholder="종목 (예: 수영)" style="flex:1;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;outline:none">' +
    '<input id="v7-wish-memo" placeholder="메모 (선택)" style="flex:2;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;outline:none">' +
    '<button id="v7-wish-add" style="padding:10px 18px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;font-weight:700;cursor:pointer;font-size:13px;white-space:nowrap">추가</button>' +
    '</div>';

  if (wishlist.length === 0) {
    html += '<div style="text-align:center;padding:40px;color:var(--text-muted);font-size:13px">위시리스트가 비어있습니다. 관심 종목을 추가해보세요!</div>';
  } else {
    html += '<div style="display:flex;flex-direction:column;gap:8px">';
    wishlist.forEach((w, i) => {
      html += '<div style="display:flex;align-items:center;gap:10px;padding:12px 16px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px">' +
        '<span style="font-size:11px;padding:3px 8px;border-radius:8px;background:rgba(126,200,227,0.1);color:var(--accent);font-weight:600">' + esc(w.folder) + '</span>' +
        '<span style="font-weight:700;font-size:14px;color:var(--text-primary)">' + esc(w.cat) + '</span>' +
        '<span style="flex:1;font-size:12px;color:var(--text-muted)">' + (w.memo ? esc(w.memo) : '') + '</span>' +
        '<span style="font-size:10px;color:var(--text-faint)">' + (w.date || '') + '</span>' +
        '<button class="v7-wish-del" data-idx="' + i + '" style="background:none;border:none;color:#EF4444;cursor:pointer;font-size:16px;padding:4px">&times;</button>' +
        '</div>';
    });
    html += '</div>';
  }

  const body = createModal('💝 위시리스트 컬렉션 (' + wishlist.length + ')', html);

  const addBtn = body.querySelector('#v7-wish-add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const cat = body.querySelector('#v7-wish-cat').value.trim();
      if (!cat) { showToast7('종목을 입력해주세요'); return; }
      const memo = body.querySelector('#v7-wish-memo').value.trim();
      const today = new Date();
      wishlist.push({ cat, memo, folder: folders[0], date: (today.getMonth()+1) + '/' + today.getDate() });
      lsSet('cc-wishlist', wishlist);
      SFX7.play('wishlist');
      showToast7('&#128149; ' + cat + ' 위시리스트에 추가!');
      if (wishlist.length >= 5) checkAch7('wish_5');
      if (wishlist.length >= 15) checkAch7('wish_15');
      showWishlist();
    });
  }

  body.querySelectorAll('.v7-wish-del').forEach(btn => {
    btn.addEventListener('click', () => {
      wishlist.splice(parseInt(btn.getAttribute('data-idx')), 1);
      lsSet('cc-wishlist', wishlist);
      showWishlist();
    });
  });

  const addFolderBtn = body.querySelector('#v7-add-folder');
  if (addFolderBtn) {
    addFolderBtn.addEventListener('click', () => {
      const name = prompt('새 폴더 이름:');
      if (name && name.trim()) {
        folders.push(name.trim());
        lsSet('cc-wish-folders', folders);
        showWishlist();
      }
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
// 4. 종목 트렌드 분석
// ═══════════════════════════════════════════════════════════════════
function showTrendAnalysis() {
  SFX7.play('trend');
  const trends = [
    { cat: '수영', pop: [72,75,78,82,88,92,95], growth: '+31.9%', rank: 1, hot: true },
    { cat: '요가', pop: [65,68,72,75,78,82,86], growth: '+32.3%', rank: 2, hot: true },
    { cat: '피아노', pop: [60,62,65,68,72,75,80], growth: '+33.3%', rank: 3, hot: true },
    { cat: '발레', pop: [45,48,52,58,62,68,74], growth: '+64.4%', rank: 4, hot: true },
    { cat: '미술', pop: [55,57,58,60,63,65,68], growth: '+23.6%', rank: 5, hot: false },
    { cat: '댄스', pop: [50,52,55,60,64,67,71], growth: '+42.0%', rank: 6, hot: false },
    { cat: '코딩', pop: [30,35,42,48,55,62,70], growth: '+133%', rank: 7, hot: true },
    { cat: '쿠킹', pop: [40,42,44,46,50,54,58], growth: '+45.0%', rank: 8, hot: false },
    { cat: '보컬', pop: [35,38,42,45,48,52,56], growth: '+60.0%', rank: 9, hot: false },
    { cat: '서예', pop: [20,22,24,28,32,36,40], growth: '+100%', rank: 10, hot: false },
    { cat: '공예', pop: [28,30,34,38,42,46,50], growth: '+78.6%', rank: 11, hot: false },
    { cat: '드로잉', pop: [32,35,40,46,52,58,65], growth: '+103%', rank: 12, hot: true }
  ];
  const months = ['1월','2월','3월','4월','5월','6월','7월'];

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">종목별 인기 트렌드를 분석합니다. 최근 7개월 검색량 기반 추이.</div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px">';
  trends.forEach(t => {
    const maxPop = Math.max(...t.pop);
    const barHTML = t.pop.map((v, i) => {
      const h = Math.round((v / 100) * 50);
      return '<div style="display:flex;flex-direction:column;align-items:center;gap:2px">' +
        '<div style="width:24px;height:' + h + 'px;background:linear-gradient(180deg,' + (t.hot ? '#F59E0B' : 'var(--accent)') + ',transparent);border-radius:4px 4px 0 0;min-height:4px"></div>' +
        '<span style="font-size:8px;color:var(--text-faint)">' + months[i] + '</span></div>';
    }).join('');

    html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:14px;padding:16px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<div style="display:flex;align-items:center;gap:8px">' +
      '<span style="font-size:16px;font-weight:800;color:var(--text-primary)">#' + t.rank + '</span>' +
      '<span style="font-weight:700;font-size:14px;color:var(--text-primary)">' + t.cat + '</span>' +
      (t.hot ? '<span style="font-size:10px;padding:2px 8px;border-radius:10px;background:#EF444422;color:#EF4444;font-weight:700">HOT</span>' : '') +
      '</div>' +
      '<span style="font-size:13px;font-weight:800;color:' + (parseFloat(t.growth) > 50 ? '#10B981' : 'var(--accent)') + '">' + t.growth + '</span>' +
      '</div>' +
      '<div style="display:flex;align-items:flex-end;gap:4px;height:60px;justify-content:space-around">' + barHTML + '</div>' +
      '</div>';
  });
  html += '</div>';

  html += '<div style="margin-top:16px;padding:14px;background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:12px;font-size:12px;color:#F59E0B">' +
    '<strong>&#128293; 트렌드 요약:</strong> 코딩(+133%), 드로잉(+103%), 서예(+100%)가 급성장 중! 발레와 요가도 꾸준한 상승세.</div>';

  createModal('📈 종목 트렌드 분석', html);
  checkAch7('trend_viewer');
}

// ═══════════════════════════════════════════════════════════════════
// 5. 수강 비용 계획기
// ═══════════════════════════════════════════════════════════════════
function showBudgetPlanner() {
  SFX7.play('budget');
  const budget = lsGet('cc-budget', { monthly: 300000, items: [] });

  const priceTiers = [
    { cat: '수영', avg: 85000, min: 60000, max: 120000 },
    { cat: '요가', avg: 70000, min: 50000, max: 100000 },
    { cat: '피아노', avg: 90000, min: 65000, max: 130000 },
    { cat: '발레', avg: 80000, min: 55000, max: 110000 },
    { cat: '미술', avg: 75000, min: 50000, max: 100000 },
    { cat: '댄스', avg: 65000, min: 45000, max: 90000 },
    { cat: '코딩', avg: 100000, min: 70000, max: 150000 },
    { cat: '쿠킹', avg: 95000, min: 60000, max: 140000 },
    { cat: '보컬', avg: 80000, min: 55000, max: 120000 },
    { cat: '드로잉', avg: 70000, min: 45000, max: 95000 }
  ];

  const totalSpent = budget.items.reduce((s, i) => s + i.cost, 0);
  const remaining = budget.monthly - totalSpent;
  const pct = Math.min(Math.round((totalSpent / budget.monthly) * 100), 100);

  let html = '<div style="margin-bottom:20px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
    '<div><span style="font-size:12px;color:var(--text-muted)">월 예산</span>' +
    '<div style="font-size:28px;font-weight:800;color:var(--text-primary)">' + budget.monthly.toLocaleString() + '원</div></div>' +
    '<div style="text-align:right"><span style="font-size:12px;color:var(--text-muted)">잔여</span>' +
    '<div style="font-size:22px;font-weight:800;color:' + (remaining >= 0 ? '#10B981' : '#EF4444') + '">' + remaining.toLocaleString() + '원</div></div>' +
    '</div>' +
    '<div style="background:var(--bar-bg);border-radius:10px;height:14px;overflow:hidden;margin-bottom:6px">' +
    '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,' + (pct > 80 ? '#EF4444' : pct > 50 ? '#F59E0B' : '#10B981') + ',#3B82F6);border-radius:10px;transition:width .5s"></div></div>' +
    '<div style="font-size:11px;color:var(--text-muted);text-align:right">' + pct + '% 사용</div></div>';

  html += '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">' +
    '<input id="v7-budget-input" type="number" value="' + budget.monthly + '" style="width:140px;padding:8px 12px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;outline:none" placeholder="월 예산">' +
    '<button id="v7-budget-set" style="padding:8px 16px;border-radius:10px;border:none;background:var(--accent);color:#fff;font-weight:700;cursor:pointer;font-size:12px">설정</button></div>';

  html += '<div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:10px">종목별 평균 수강료</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;margin-bottom:16px">';
  priceTiers.forEach(p => {
    html += '<div class="v7-price-card" data-cat="' + p.cat + '" data-cost="' + p.avg + '" style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;padding:12px;cursor:pointer;transition:all .2s">' +
      '<div style="font-weight:700;font-size:13px;color:var(--text-primary);margin-bottom:4px">' + p.cat + '</div>' +
      '<div style="font-size:16px;font-weight:800;color:var(--accent)">' + p.avg.toLocaleString() + '원</div>' +
      '<div style="font-size:10px;color:var(--text-muted)">' + p.min.toLocaleString() + ' ~ ' + p.max.toLocaleString() + '원</div>' +
      '</div>';
  });
  html += '</div>';

  if (budget.items.length > 0) {
    html += '<div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:10px">등록 강좌</div>';
    budget.items.forEach((item, i) => {
      html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;margin-bottom:6px">' +
        '<span style="font-weight:700;color:var(--text-primary)">' + item.cat + '</span>' +
        '<span style="flex:1;font-size:13px;color:var(--accent);font-weight:600">' + item.cost.toLocaleString() + '원</span>' +
        '<button class="v7-budget-del" data-idx="' + i + '" style="background:none;border:none;color:#EF4444;cursor:pointer;font-size:16px">&times;</button></div>';
    });
  }

  const body = createModal('💰 수강 비용 계획기', html);

  body.querySelector('#v7-budget-set').addEventListener('click', () => {
    const val = parseInt(body.querySelector('#v7-budget-input').value) || 300000;
    budget.monthly = val;
    lsSet('cc-budget', budget);
    showToast7('&#128176; 월 예산 ' + val.toLocaleString() + '원으로 설정!');
    showBudgetPlanner();
  });

  body.querySelectorAll('.v7-price-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-cat');
      const cost = parseInt(card.getAttribute('data-cost'));
      budget.items.push({ cat, cost });
      lsSet('cc-budget', budget);
      SFX7.play('budget');
      showToast7('&#128176; ' + cat + ' 추가 (' + cost.toLocaleString() + '원)');
      checkAch7('budget_planner');
      showBudgetPlanner();
    });
  });

  body.querySelectorAll('.v7-budget-del').forEach(btn => {
    btn.addEventListener('click', () => {
      budget.items.splice(parseInt(btn.getAttribute('data-idx')), 1);
      lsSet('cc-budget', budget);
      showBudgetPlanner();
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
// 6. 동반 수강 매칭
// ═══════════════════════════════════════════════════════════════════
function showCompanionMatch() {
  SFX7.play('companion');
  const companions = [
    { type: '부모+아이', icon: '&#128106;', cats: ['수영','미술','쿠킹','코딩','공예'], desc: '함께 배우며 소통하세요', ages: '5~12세 아이 + 부모' },
    { type: '커플', icon: '&#128145;', cats: ['댄스','쿠킹','요가','드로잉','보컬'], desc: '연인과 함께하는 취미생활', ages: '20~40대' },
    { type: '시니어', icon: '&#128116;', cats: ['서예','요가','수영','공예','발레'], desc: '건강하고 활기찬 시니어 라이프', ages: '60대 이상' },
    { type: '친구끼리', icon: '&#128111;', cats: ['댄스','보컬','미술','쿠킹','코딩'], desc: '친구와 함께 도전!', ages: '20~30대' },
    { type: '직장동료', icon: '&#128188;', cats: ['요가','코딩','드로잉','보컬','쿠킹'], desc: '팀빌딩 문화활동', ages: '30~50대' },
    { type: '3세대', icon: '&#127968;', cats: ['쿠킹','공예','서예','미술','드로잉'], desc: '조부모+부모+아이 3세대', ages: '전 연령' }
  ];

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">함께 수강할 동반자 유형을 선택하면 추천 종목을 알려드립니다.</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">';

  companions.forEach(c => {
    html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:16px;padding:20px;text-align:center">' +
      '<div style="font-size:42px;margin-bottom:8px">' + c.icon + '</div>' +
      '<div style="font-weight:800;font-size:16px;color:var(--text-primary);margin-bottom:4px">' + c.type + '</div>' +
      '<div style="font-size:12px;color:var(--text-muted);margin-bottom:4px">' + c.ages + '</div>' +
      '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px">' + c.desc + '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">';
    c.cats.forEach(cat => {
      html += '<span style="padding:4px 10px;border-radius:12px;background:rgba(126,200,227,0.1);color:var(--accent);font-size:11px;font-weight:600">' + cat + '</span>';
    });
    html += '</div></div>';
  });
  html += '</div>';

  createModal('👨‍👩‍👧‍👦 동반 수강 매칭', html);
  checkAch7('companion_viewer');
}

// ═══════════════════════════════════════════════════════════════════
// 7. 학습 목표 설정
// ═══════════════════════════════════════════════════════════════════
function showGoalSetting() {
  SFX7.play('goal');
  const goals = lsGet('cc-goals', []);
  const templates = [
    { title: '주 3회 수강', icon: '&#128170;', target: 12, unit: '회/월', desc: '꾸준한 출석으로 실력 향상' },
    { title: '신규 종목 도전', icon: '&#127775;', target: 3, unit: '종목/분기', desc: '새로운 분야에 도전하기' },
    { title: '수료증 획득', icon: '&#127942;', target: 2, unit: '과정/년', desc: '완강하고 수료증 받기' },
    { title: '가족과 함께', icon: '&#128106;', target: 1, unit: '강좌/월', desc: '가족과 동반 수강' },
    { title: '건강 목표', icon: '&#128154;', target: 4, unit: '회/주', desc: '운동 종목 규칙적 수강' },
    { title: '자격증 취득', icon: '&#128220;', target: 1, unit: '자격증/년', desc: '전문 자격증 도전' }
  ];

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">학습 목표를 설정하고 달성 현황을 추적하세요.</div>';

  html += '<div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:10px">&#127919; 목표 템플릿</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-bottom:20px">';
  templates.forEach((t, i) => {
    html += '<div class="v7-goal-tpl" data-idx="' + i + '" style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:14px;cursor:pointer;text-align:center;transition:all .2s">' +
      '<div style="font-size:28px;margin-bottom:6px">' + t.icon + '</div>' +
      '<div style="font-weight:700;font-size:13px;color:var(--text-primary);margin-bottom:2px">' + t.title + '</div>' +
      '<div style="font-size:11px;color:var(--accent);font-weight:600">' + t.target + ' ' + t.unit + '</div>' +
      '<div style="font-size:10px;color:var(--text-muted);margin-top:4px">' + t.desc + '</div>' +
      '</div>';
  });
  html += '</div>';

  if (goals.length > 0) {
    html += '<div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:10px">&#128203; 내 목표 (' + goals.length + ')</div>';
    goals.forEach((g, i) => {
      const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
      const done = pct >= 100;
      html += '<div style="background:var(--card-bg);border:1px solid ' + (done ? 'rgba(16,185,129,0.3)' : 'var(--card-border)') + ';border-radius:12px;padding:14px;margin-bottom:8px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
        '<span style="font-weight:700;color:var(--text-primary)">' + (done ? '&#9989; ' : '') + g.title + '</span>' +
        '<div style="display:flex;gap:6px;align-items:center">' +
        '<button class="v7-goal-inc" data-idx="' + i + '" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--accent);background:transparent;color:var(--accent);cursor:pointer;font-weight:700;font-size:16px">+</button>' +
        '<button class="v7-goal-del" data-idx="' + i + '" style="width:28px;height:28px;border-radius:8px;border:1px solid #EF4444;background:transparent;color:#EF4444;cursor:pointer;font-size:14px">&times;</button></div></div>' +
        '<div style="background:var(--bar-bg);border-radius:8px;height:8px;overflow:hidden;margin-bottom:4px">' +
        '<div style="height:100%;width:' + pct + '%;background:' + (done ? '#10B981' : 'var(--accent)') + ';border-radius:8px;transition:width .5s"></div></div>' +
        '<div style="font-size:11px;color:var(--text-muted)">' + g.current + ' / ' + g.target + ' ' + g.unit + ' (' + pct + '%)</div></div>';
    });
  }

  const body = createModal('🎯 학습 목표 설정', html);

  body.querySelectorAll('.v7-goal-tpl').forEach(tpl => {
    tpl.addEventListener('click', () => {
      const t = templates[parseInt(tpl.getAttribute('data-idx'))];
      goals.push({ title: t.title, target: t.target, unit: t.unit, current: 0 });
      lsSet('cc-goals', goals);
      SFX7.play('goal');
      showToast7('&#127919; 목표 &quot;' + t.title + '&quot; 설정 완료!');
      checkAch7('goal_setter');
      showGoalSetting();
    });
  });

  body.querySelectorAll('.v7-goal-inc').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      goals[idx].current = Math.min(goals[idx].current + 1, goals[idx].target);
      lsSet('cc-goals', goals);
      SFX7.play('goal');
      if (goals[idx].current >= goals[idx].target) {
        showToast7('&#127881; 목표 &quot;' + goals[idx].title + '&quot; 달성!');
        checkAch7('goal_achieved');
      }
      showGoalSetting();
    });
  });

  body.querySelectorAll('.v7-goal-del').forEach(btn => {
    btn.addEventListener('click', () => {
      goals.splice(parseInt(btn.getAttribute('data-idx')), 1);
      lsSet('cc-goals', goals);
      showGoalSetting();
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
// 8. 센터 방문 체크인
// ═══════════════════════════════════════════════════════════════════
function showCheckin() {
  SFX7.play('checkin');
  const checkins = lsGet('cc-checkins', []);
  const centers = ['홈플러스 영등포','홈플러스 강동','홈플러스 금천','홈플러스 목동','홈플러스 신도림',
    '롯데마트 잠실','롯데마트 은평','롯데마트 구리','현대백화점 판교','이마트 성수','갤러리아 압구정','백화점 본점'];

  const today = new Date();
  const todayStr = today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0');
  const todayChecked = checkins.some(c => c.date === todayStr);

  const streak = calcStreak(checkins);
  const totalVisits = checkins.length;
  const uniqueCenters = new Set(checkins.map(c => c.center)).size;

  let html = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">' +
    '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:14px;text-align:center">' +
    '<div style="font-size:24px;font-weight:800;color:var(--accent)">' + totalVisits + '</div>' +
    '<div style="font-size:11px;color:var(--text-muted)">총 방문</div></div>' +
    '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:14px;text-align:center">' +
    '<div style="font-size:24px;font-weight:800;color:#F59E0B">' + streak + '</div>' +
    '<div style="font-size:11px;color:var(--text-muted)">연속일</div></div>' +
    '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:14px;text-align:center">' +
    '<div style="font-size:24px;font-weight:800;color:#10B981">' + uniqueCenters + '</div>' +
    '<div style="font-size:11px;color:var(--text-muted)">방문 센터</div></div></div>';

  html += '<div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:10px">' +
    (todayChecked ? '&#9989; 오늘 체크인 완료!' : '&#128205; 오늘 방문한 센터를 선택하세요') + '</div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px;margin-bottom:20px">';
  centers.forEach(c => {
    const visited = checkins.filter(ch => ch.center === c).length;
    html += '<button class="v7-checkin-btn" data-center="' + c + '" style="padding:12px;border-radius:12px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text-primary);cursor:pointer;text-align:left;font-size:12px;transition:all .2s' + (todayChecked ? ';opacity:0.5' : '') + '">' +
      '<div style="font-weight:700">' + c + '</div>' +
      '<div style="font-size:10px;color:var(--text-muted);margin-top:2px">' + visited + '회 방문</div></button>';
  });
  html += '</div>';

  if (checkins.length > 0) {
    html += '<div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:10px">최근 방문 기록</div>';
    const recent = checkins.slice(-10).reverse();
    recent.forEach(c => {
      html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-bottom:1px solid var(--card-border);font-size:12px">' +
        '<span style="color:var(--text-muted);min-width:80px">' + c.date + '</span>' +
        '<span style="color:var(--text-primary);font-weight:600">' + c.center + '</span></div>';
    });
  }

  const body = createModal('📍 센터 방문 체크인', html);

  if (!todayChecked) {
    body.querySelectorAll('.v7-checkin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const center = btn.getAttribute('data-center');
        checkins.push({ date: todayStr, center });
        lsSet('cc-checkins', checkins);
        SFX7.play('checkin');
        showToast7('&#128205; ' + center + ' 체크인 완료!');
        if (checkins.length >= 5) checkAch7('checkin_5');
        if (checkins.length >= 20) checkAch7('checkin_20');
        const newStreak = calcStreak(checkins);
        if (newStreak >= 7) checkAch7('checkin_streak_7');
        showCheckin();
      });
    });
  }
}

function calcStreak(checkins) {
  if (checkins.length === 0) return 0;
  const dates = [...new Set(checkins.map(c => c.date))].sort().reverse();
  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const d1 = new Date(dates[i]);
    const d2 = new Date(dates[i + 1]);
    const diff = (d1 - d2) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// ═══════════════════════════════════════════════════════════════════
// 9. 수강 일기
// ═══════════════════════════════════════════════════════════════════
function showDiary() {
  SFX7.play('diary');
  const diary = lsGet('cc-diary', []);
  const moods = [
    { emoji: '&#128522;', label: '좋음', color: '#10B981' },
    { emoji: '&#128513;', label: '최고', color: '#F59E0B' },
    { emoji: '&#128528;', label: '보통', color: '#6B7280' },
    { emoji: '&#128543;', label: '아쉬움', color: '#3B82F6' },
    { emoji: '&#128548;', label: '힘듦', color: '#EF4444' }
  ];

  let html = '<div style="margin-bottom:16px">' +
    '<div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:10px">&#128221; 오늘의 수강 일기</div>' +
    '<div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap">';
  moods.forEach((m, i) => {
    html += '<button class="v7-mood-btn" data-mood="' + i + '" style="padding:8px 14px;border-radius:12px;border:1px solid var(--card-border);background:var(--card-bg);cursor:pointer;font-size:20px;transition:all .2s" title="' + m.label + '">' + m.emoji + '</button>';
  });
  html += '</div>' +
    '<input id="v7-diary-cat" placeholder="종목 (예: 수영)" style="width:100%;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;margin-bottom:8px;box-sizing:border-box;outline:none">' +
    '<textarea id="v7-diary-text" placeholder="오늘 배운 것, 느낀 점을 기록하세요..." style="width:100%;height:80px;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;resize:none;box-sizing:border-box;outline:none;font-family:inherit"></textarea>' +
    '<button id="v7-diary-save" style="margin-top:8px;padding:10px 24px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;font-weight:700;cursor:pointer;font-size:13px">저장</button></div>';

  if (diary.length > 0) {
    html += '<div style="font-weight:700;font-size:14px;color:var(--text-primary);margin-bottom:10px">&#128214; 지난 일기 (' + diary.length + ')</div>';
    diary.slice(-15).reverse().forEach(d => {
      const m = moods[d.mood] || moods[0];
      html += '<div style="padding:12px 16px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;margin-bottom:8px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
        '<div style="display:flex;align-items:center;gap:8px">' +
        '<span style="font-size:18px">' + m.emoji + '</span>' +
        '<span style="font-weight:700;font-size:13px;color:var(--text-primary)">' + esc(d.cat) + '</span>' +
        '</div>' +
        '<span style="font-size:10px;color:var(--text-faint)">' + d.date + '</span></div>' +
        '<div style="font-size:12px;color:var(--text-secondary);line-height:1.6">' + esc(d.text) + '</div></div>';
    });
  }

  const body = createModal('📝 수강 일기', html);
  let selectedMood = 0;

  body.querySelectorAll('.v7-mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      body.querySelectorAll('.v7-mood-btn').forEach(b => b.style.border = '1px solid var(--card-border)');
      btn.style.border = '2px solid var(--accent)';
      selectedMood = parseInt(btn.getAttribute('data-mood'));
    });
  });

  body.querySelector('#v7-diary-save').addEventListener('click', () => {
    const cat = body.querySelector('#v7-diary-cat').value.trim() || '일반';
    const text = body.querySelector('#v7-diary-text').value.trim();
    if (!text) { showToast7('내용을 입력해주세요'); return; }
    const today = new Date();
    diary.push({ mood: selectedMood, cat, text, date: today.getFullYear() + '-' + String(today.getMonth()+1).padStart(2,'0') + '-' + String(today.getDate()).padStart(2,'0') });
    lsSet('cc-diary', diary);
    SFX7.play('diary');
    showToast7('&#128221; 수강 일기 저장 완료!');
    if (diary.length >= 5) checkAch7('diary_5');
    if (diary.length >= 20) checkAch7('diary_20');
    showDiary();
  });
}

// ═══════════════════════════════════════════════════════════════════
// 10. 퀴즈 v7 (+15문, 30→45)
// ═══════════════════════════════════════════════════════════════════
const QUIZ_V7 = [
  { q: '&quot;아쉬탕가&quot;는 어떤 종류의 요가인가요?', a: ['파워 요가', '명상 요가', '핫 요가', '음양 요가'], c: 0, hint: '역동적이고 체계적인 시퀀스가 특징' },
  { q: '수영에서 &quot;풀킥&quot;이란 무엇인가요?', a: ['물속에서 차기', '점프 후 입수', '바닥 밀기', '턴 동작'], c: 0, hint: '발차기의 기본 동작' },
  { q: '피아노 건반에서 옥타브는 몇 개의 건반인가요?', a: ['12개', '8개', '10개', '14개'], c: 0, hint: '반음 포함 모든 건반' },
  { q: '발레의 5가지 기본 포지션 중 첫 번째는?', a: ['발뒤꿈치 붙이고 양발 바깥으로', '한 발 앞으로', '양발 벌리기', '한 발로 서기'], c: 0, hint: '두 발 뒤꿈치가 만나는 포지션' },
  { q: '서예에서 &quot;해서체&quot;의 특징은?', a: ['단정하고 반듯한 글씨', '흘려쓰는 글씨', '전서처럼 고풍', '자유로운 붓놀림'], c: 0, hint: '가장 정갈한 서체' },
  { q: '미술에서 &quot;원근법&quot;을 처음 체계화한 시대는?', a: ['르네상스', '바로크', '고대 그리스', '중세'], c: 0, hint: '15세기 이탈리아' },
  { q: '쿠킹에서 &quot;블랜칭&quot;이란?', a: ['끓는 물에 데친 후 찬물에 식히기', '소금물에 절이기', '기름에 튀기기', '오븐에 구우기'], c: 0, hint: '채소의 색감을 살리는 기법' },
  { q: '코딩에서 &quot;버그&quot;라는 용어의 유래는?', a: ['컴퓨터에 끼인 진짜 벌레', '프로그래머 별명', '오류 코드 약자', '테스트 용어'], c: 0, hint: '1947년 하버드 컴퓨터 사건' },
  { q: '댄스에서 &quot;아이솔레이션&quot;이란?', a: ['신체 부위를 따로 움직이기', '혼자 추는 춤', '느리게 추기', '점프 동작'], c: 0, hint: '힙합/팝핑의 기본' },
  { q: '드로잉에서 &quot;크로키&quot;의 적정 시간은?', a: ['1~5분', '30분~1시간', '10초', '2시간 이상'], c: 0, hint: '빠르게 스케치하는 기법' },
  { q: '공예에서 &quot;패브릭&quot;은 어떤 재료인가요?', a: ['천/직물', '나무', '금속', '유리'], c: 0, hint: '섬유 소재' },
  { q: '보컬에서 &quot;두성&quot;은 어디서 공명하나요?', a: ['머리 윗부분', '가슴', '목구멍', '코'], c: 0, hint: '고음역 발성법' },
  { q: '문화센터 수강 시 가장 인기 있는 시간대는?', a: ['오전 10~12시', '오후 2~4시', '저녁 6~8시', '아침 8~9시'], c: 0, hint: '주부/시니어 선호 시간' },
  { q: '홈플러스 문화센터의 수강 기간은 보통?', a: ['3개월', '1개월', '6개월', '1년'], c: 0, hint: '분기별 수강신청' },
  { q: '문화센터 강좌 중 가장 수강료가 비싼 종목은?', a: ['악기(피아노/바이올린)', '수영', '요가', '미술'], c: 0, hint: '개인 레슨 요소가 많은 종목' }
];

function showQuizV7() {
  SFX7.play('quiz_right');
  const state = lsGet('cc-quiz-v7', { idx: 0, score: 0, done: false, answers: [] });
  if (state.done) {
    showQuizV7Result(state);
    return;
  }

  const q = QUIZ_V7[state.idx];
  let html = '<div style="margin-bottom:16px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
    '<span style="font-size:12px;color:var(--text-muted)">문제 ' + (state.idx + 1) + ' / ' + QUIZ_V7.length + '</span>' +
    '<span style="font-size:12px;color:var(--accent);font-weight:700">점수: ' + state.score + '</span></div>' +
    '<div style="background:var(--bar-bg);border-radius:8px;height:6px;overflow:hidden;margin-bottom:16px">' +
    '<div style="height:100%;width:' + Math.round(((state.idx) / QUIZ_V7.length) * 100) + '%;background:var(--accent);border-radius:8px"></div></div>' +
    '<div style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:6px;line-height:1.5">' + q.q + '</div>' +
    '<div style="font-size:11px;color:var(--text-muted);margin-bottom:16px">&#128161; 힌트: ' + q.hint + '</div></div>';

  html += '<div style="display:flex;flex-direction:column;gap:8px">';
  q.a.forEach((a, i) => {
    html += '<button class="v7-quiz-ans" data-idx="' + i + '" style="padding:14px 18px;border-radius:12px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text-primary);font-size:14px;font-weight:600;cursor:pointer;text-align:left;transition:all .2s">' + a + '</button>';
  });
  html += '</div>';

  html += '<div style="margin-top:12px;text-align:center"><button id="v7-quiz-reset" style="padding:8px 16px;border-radius:10px;border:1px solid var(--text-faint);background:transparent;color:var(--text-muted);font-size:11px;cursor:pointer">처음부터</button></div>';

  const body = createModal('&#127891; 문화센터 퀴즈 v7 (+15문)', html);

  body.querySelectorAll('.v7-quiz-ans').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      const correct = idx === q.c;
      if (correct) {
        state.score += 10;
        btn.style.background = 'rgba(16,185,129,0.2)';
        btn.style.borderColor = '#10B981';
        SFX7.play('quiz_right');
      } else {
        btn.style.background = 'rgba(239,68,68,0.2)';
        btn.style.borderColor = '#EF4444';
        SFX7.play('quiz_wrong');
        body.querySelectorAll('.v7-quiz-ans')[q.c].style.background = 'rgba(16,185,129,0.2)';
        body.querySelectorAll('.v7-quiz-ans')[q.c].style.borderColor = '#10B981';
      }
      state.answers.push(correct);
      state.idx++;

      setTimeout(() => {
        if (state.idx >= QUIZ_V7.length) {
          state.done = true;
          lsSet('cc-quiz-v7', state);
          showQuizV7Result(state);
        } else {
          lsSet('cc-quiz-v7', state);
          showQuizV7();
        }
      }, 800);
    });
  });

  body.querySelector('#v7-quiz-reset').addEventListener('click', () => {
    lsSet('cc-quiz-v7', { idx: 0, score: 0, done: false, answers: [] });
    showQuizV7();
  });
}

function showQuizV7Result(state) {
  const pct = Math.round((state.score / (QUIZ_V7.length * 10)) * 100);
  const grade = pct >= 90 ? 'S' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
  const gradeColors = { S: '#F59E0B', A: '#10B981', B: '#3B82F6', C: '#8B5CF6', D: '#EF4444' };

  let html = '<div style="text-align:center;padding:20px">' +
    '<div style="font-size:64px;font-weight:900;color:' + gradeColors[grade] + '">' + grade + '</div>' +
    '<div style="font-size:18px;font-weight:700;color:var(--text-primary);margin-bottom:8px">' + state.score + ' / ' + (QUIZ_V7.length * 10) + '점</div>' +
    '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:20px">' +
    (grade === 'S' ? '완벽합니다! 문화센터 전문가!' : grade === 'A' ? '대단해요! 거의 만점!' : grade === 'B' ? '잘했어요! 조금만 더!' : grade === 'C' ? '좋은 시작이에요!' : '다시 도전해보세요!') + '</div>' +
    '<button id="v7-quiz-retry" style="padding:12px 30px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;font-weight:700;cursor:pointer;font-size:14px">다시 도전</button></div>';

  createModal('&#127891; 퀴즈 결과', html).querySelector('#v7-quiz-retry').addEventListener('click', () => {
    lsSet('cc-quiz-v7', { idx: 0, score: 0, done: false, answers: [] });
    showQuizV7();
  });

  if (grade === 'S') checkAch7('quiz_s_grade');
  checkAch7('quiz_v7_done');
}

// ═══════════════════════════════════════════════════════════════════
// 업적 시스템 (+12개, 42→54)
// ═══════════════════════════════════════════════════════════════════
const ACHIEVEMENTS_V7 = [
  { id: 'course_complete', name: '수료생', desc: '종목 하나를 100% 완료', icon: '&#127891;' },
  { id: 'multi_learner', name: '멀티 러너', desc: '5종목 이상 50% 진행', icon: '&#128218;' },
  { id: 'wish_5', name: '위시 수집가', desc: '위시리스트 5개 이상', icon: '&#128149;' },
  { id: 'wish_15', name: '위시 마니아', desc: '위시리스트 15개 이상', icon: '&#128150;' },
  { id: 'trend_viewer', name: '트렌드 분석가', desc: '트렌드 분석 확인', icon: '&#128200;' },
  { id: 'budget_planner', name: '예산 관리자', desc: '비용 계획 등록', icon: '&#128176;' },
  { id: 'companion_viewer', name: '동반자', desc: '동반 수강 매칭 확인', icon: '&#128106;' },
  { id: 'goal_setter', name: '목표 설정자', desc: '학습 목표 설정', icon: '&#127919;' },
  { id: 'goal_achieved', name: '목표 달성자', desc: '학습 목표 1개 달성', icon: '&#127775;' },
  { id: 'checkin_5', name: '방문자', desc: '센터 방문 5회', icon: '&#128205;' },
  { id: 'checkin_20', name: '단골손님', desc: '센터 방문 20회', icon: '&#127969;' },
  { id: 'checkin_streak_7', name: '개근상', desc: '7일 연속 체크인', icon: '&#128293;' },
  { id: 'diary_5', name: '일기장', desc: '수강 일기 5편 작성', icon: '&#128221;' },
  { id: 'diary_20', name: '작가님', desc: '수강 일기 20편 작성', icon: '&#128214;' },
  { id: 'quiz_v7_done', name: '퀴즈 도전자', desc: 'v7 퀴즈 완주', icon: '&#127891;' },
  { id: 'quiz_s_grade', name: '퀴즈 천재', desc: 'v7 퀴즈 S등급', icon: '&#128081;' },
  { id: 'v7_explorer', name: 'v7 탐험가', desc: 'v7 기능 5가지 이상 사용', icon: '&#128640;' },
  { id: 'v7_master', name: 'v7 마스터', desc: 'v7 전체 기능 체험', icon: '&#127752;' }
];

function checkAch7(id) {
  const achieved = lsGet('cc-ach-v7', []);
  if (achieved.includes(id)) return;
  achieved.push(id);
  lsSet('cc-ach-v7', achieved);
  const ach = ACHIEVEMENTS_V7.find(a => a.id === id);
  if (ach) {
    showToast7(ach.icon + ' 업적 달성: ' + ach.name + '!');
    trackV7Usage(id);
  }
}

function trackV7Usage(feature) {
  const used = lsGet('cc-v7-used', []);
  if (!used.includes(feature)) {
    used.push(feature);
    lsSet('cc-v7-used', used);
  }
  if (used.length >= 5) checkAch7('v7_explorer');
  if (used.length >= 10) checkAch7('v7_master');
}

function showAchievementsV7() {
  const achieved = lsGet('cc-ach-v7', []);
  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">v7 업적 달성 현황: ' + achieved.length + ' / ' + ACHIEVEMENTS_V7.length + '</div>';
  html += '<div style="background:var(--bar-bg);border-radius:8px;height:10px;overflow:hidden;margin-bottom:20px">' +
    '<div style="height:100%;width:' + Math.round((achieved.length / ACHIEVEMENTS_V7.length) * 100) + '%;background:linear-gradient(90deg,#F59E0B,#EF4444);border-radius:8px"></div></div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">';
  ACHIEVEMENTS_V7.forEach(a => {
    const done = achieved.includes(a.id);
    html += '<div style="background:var(--card-bg);border:1px solid ' + (done ? 'rgba(245,158,11,0.3)' : 'var(--card-border)') + ';border-radius:12px;padding:14px;opacity:' + (done ? '1' : '0.5') + '">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
      '<span style="font-size:24px">' + a.icon + '</span>' +
      '<div><div style="font-weight:700;font-size:13px;color:var(--text-primary)">' + a.name + '</div>' +
      '<div style="font-size:11px;color:var(--text-muted)">' + a.desc + '</div></div></div></div>';
  });
  html += '</div>';

  createModal('&#127942; v7 업적 (' + achieved.length + '/' + ACHIEVEMENTS_V7.length + ')', html);
}

// ═══════════════════════════════════════════════════════════════════
// 퀵 액션 버튼 + 키보드 단축키
// ═══════════════════════════════════════════════════════════════════
function insertQuickActions7() {
  if (document.getElementById('v7-quick-actions')) return;
  const container = qs('.bottom-nav') || qs('#root') || document.body;
  const bar = ce('div', { id: 'v7-quick-actions', style: {
    position:'fixed',top:'60px',right:'10px',display:'flex',flexDirection:'column',gap:'6px',zIndex:'700'
  }});

  const buttons = [
    { label: '&#128202; 진도', fn: showProgressTracker, key: 'Shift+1' },
    { label: '&#11088; 강사', fn: showInstructorRating, key: 'Shift+2' },
    { label: '&#128149; 위시', fn: showWishlist, key: 'Shift+3' },
    { label: '&#128200; 트렌드', fn: showTrendAnalysis, key: 'Shift+4' },
    { label: '&#128176; 비용', fn: showBudgetPlanner, key: 'Shift+5' },
    { label: '&#128106; 동반', fn: showCompanionMatch, key: 'Shift+6' },
    { label: '&#127919; 목표', fn: showGoalSetting, key: 'Shift+7' },
    { label: '&#128205; 체크인', fn: showCheckin, key: 'Shift+8' },
    { label: '&#128221; 일기', fn: showDiary, key: 'Shift+9' },
    { label: '&#127891; 퀴즈', fn: showQuizV7, key: 'Shift+0' },
    { label: '&#127942; 업적', fn: showAchievementsV7, key: 'Shift+=' }
  ];

  const toggle = ce('button', { onClick: () => {
    const items = bar.querySelectorAll('.v7-qbtn');
    const visible = items[0] && items[0].style.display !== 'none';
    items.forEach(b => b.style.display = visible ? 'none' : 'block');
  }, style: {
    width:'38px',height:'38px',borderRadius:'50%',border:'1px solid rgba(82,183,136,0.4)',
    background:'linear-gradient(135deg,#1B4332,#0C1525)',color:'#52B788',
    fontSize:'16px',cursor:'pointer',fontWeight:'800',boxShadow:'0 4px 16px rgba(0,0,0,0.3)',zIndex:'701'
  }}, 'v7');
  bar.appendChild(toggle);

  buttons.forEach(b => {
    const btn = ce('button', { className: 'v7-qbtn', onClick: () => { b.fn(); trackV7Usage(b.label); }, style: {
      padding:'6px 10px',borderRadius:'10px',border:'1px solid rgba(82,183,136,0.2)',
      background:'linear-gradient(135deg,rgba(27,67,50,0.9),rgba(12,21,37,0.9))',color:'#52B788',
      fontSize:'11px',cursor:'pointer',fontWeight:'600',whiteSpace:'nowrap',display:'none',
      boxShadow:'0 2px 8px rgba(0,0,0,0.3)',backdropFilter:'blur(8px)',textAlign:'left'
    }}, b.label);
    bar.appendChild(btn);
  });

  container.parentNode.insertBefore(bar, container.nextSibling);
}

function initKeyboard7() {
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (!e.shiftKey) return;

    const map = {
      '!': showProgressTracker,
      '@': showInstructorRating,
      '#': showWishlist,
      '$': showTrendAnalysis,
      '%': showBudgetPlanner,
      '^': showCompanionMatch,
      '&': showGoalSetting,
      '*': showCheckin,
      '(': showDiary,
      ')': showQuizV7,
      '+': showAchievementsV7
    };

    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
    }
  });
}

// ─── CSS ─────────────────────────────────────────────────────────
function injectV7Styles() {
  if (document.getElementById('v7-styles')) return;
  const style = ce('style', { id: 'v7-styles' });
  style.textContent = '@keyframes v7SlideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}' +
    '@keyframes v7SlideUp{from{transform:translateY(0);opacity:1}to{transform:translateY(-20px);opacity:0}}' +
    '@keyframes v7FadeIn{from{opacity:0}to{opacity:1}}' +
    '.v7-progress-card:hover{border-color:var(--accent)!important;transform:translateY(-2px)}' +
    '.v7-checkin-btn:hover{border-color:var(--accent)!important;background:var(--card-hover)!important}' +
    '.v7-goal-tpl:hover{border-color:var(--accent)!important;transform:translateY(-2px)}' +
    '.v7-price-card:hover{border-color:var(--accent)!important;transform:translateY(-1px)}' +
    '#v7-modal::-webkit-scrollbar{width:6px}#v7-modal::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:3px}' +
    '@media(max-width:480px){#v7-quick-actions{top:auto;bottom:70px;right:6px}.v7-qbtn{font-size:10px!important;padding:5px 8px!important}}';
  document.head.appendChild(style);
}

// ─── 초기화 ──────────────────────────────────────────────────────
function init7() {
  injectV7Styles();
  setTimeout(() => {
    insertQuickActions7();
    initKeyboard7();
  }, 2500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init7);
} else {
  init7();
}

})();
