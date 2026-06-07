/**
 * culture-center-finder v8.0 patch
 * 수강추천엔진+수강증명서Canvas+강좌타임라인+종목인기랭킹Canvas+학습커뮤니티AI10인+수강스트릭마일스톤+음성검색WebSpeech+수강노트+강좌알림시스템+소셜프로필카드Canvas+퀴즈15추가(45→60)+업적12추가(54→66)+SFX10종+키보드8종
 */
(function(){
'use strict';

const V8_ID = 'ccf-v8-patch';
if (document.getElementById(V8_ID)) return;
const marker = document.createElement('meta');
marker.id = V8_ID;
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
function showToast8(msg, dur) {
  const old = document.getElementById('v8-toast');
  if (old) old.remove();
  const t = ce('div', { id: 'v8-toast', style: {
    position:'fixed',top:'20px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#1E3A5F,#0C1525)',
    border:'1px solid rgba(96,165,250,0.5)',borderRadius:'14px',padding:'12px 24px',zIndex:'960',
    fontSize:'13px',fontWeight:'700',color:'#60A5FA',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
    animation:'v8SlideDown .3s ease both',whiteSpace:'nowrap',maxWidth:'90vw',overflow:'hidden',textOverflow:'ellipsis'
  }}, msg);
  document.body.appendChild(t);
  setTimeout(() => { t.style.animation = 'v8SlideUp .3s ease both'; setTimeout(() => t.remove(), 300); }, dur || 2500);
}
function dateSeed8(offset) {
  const d = new Date(); d.setDate(d.getDate() + (offset || 0));
  return d.getFullYear() * 10000 + (d.getMonth()+1) * 100 + d.getDate();
}
function seededRand8(seed) {
  let s = seed;
  return function() { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}
function fmtDate8(d) {
  if (!d) d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// SFX 엔진 (10종)
const SFX8 = {
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
      recommend:    { freq: 659, type: 'sine', dur: 0.2, vol: 0.12 },
      certificate:  { freq: 880, type: 'triangle', dur: 0.25, vol: 0.14 },
      timeline:     { freq: 523, type: 'sine', dur: 0.15, vol: 0.1 },
      ranking:      { freq: 784, type: 'triangle', dur: 0.18, vol: 0.12 },
      community:    { freq: 440, type: 'sine', dur: 0.12, vol: 0.1 },
      streak:       { freq: 698, type: 'triangle', dur: 0.2, vol: 0.14 },
      voice:        { freq: 587, type: 'sine', dur: 0.15, vol: 0.1 },
      note:         { freq: 554, type: 'triangle', dur: 0.12, vol: 0.1 },
      alert:        { freq: 740, type: 'sine', dur: 0.18, vol: 0.12 },
      profile:      { freq: 622, type: 'triangle', dur: 0.2, vol: 0.1 },
      quiz_right8:  { freq: 988, type: 'sine', dur: 0.12, vol: 0.1 },
      quiz_wrong8:  { freq: 196, type: 'sawtooth', dur: 0.2, vol: 0.06 }
    };
    const p = presets[name] || presets.recommend;
    o.frequency.value = p.freq;
    o.type = p.type;
    g.gain.setValueAtTime(p.vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + p.dur);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + p.dur);
  }
};

// 모달 공통
function createModal8(title, contentHTML) {
  const existing = document.getElementById('v8-modal');
  if (existing) existing.remove();
  const overlay = ce('div', { id: 'v8-modal', style: {
    position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.78)',
    zIndex:'810',display:'flex',alignItems:'center',justifyContent:'center',
    animation:'v8FadeIn .2s ease',padding:'16px',boxSizing:'border-box'
  }});
  const modal = ce('div', { style: {
    background:'var(--modal-bg,#111827)',border:'1px solid var(--modal-border,rgba(96,165,250,0.25))',
    borderRadius:'18px',padding:'24px',maxWidth:'720px',width:'100%',maxHeight:'85vh',
    overflowY:'auto',boxShadow:'0 24px 64px rgba(0,0,0,0.6)',position:'relative'
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
// 1. 수강 추천 엔진
// ═══════════════════════════════════════════════════════════════════
function showRecommendEngine() {
  SFX8.play('recommend');
  trackV8Usage('recommend');

  const favs = lsGet('favorites', []);
  const searches = lsGet('recent-searches', []);
  const progress = lsGet('cc-progress', {});
  const wishlist = lsGet('cc-wishlist', []);
  const diary = lsGet('cc-diary', []);

  const catScores = {};
  const allCats = ['수영','피아노','요가','발레','미술','댄스','보컬','코딩','드로잉','쿠킹','서예','공예',
    '바이올린','드럼','플라워','영어','베이킹','K-POP댄스','제2외국어','뮤지컬','사진','체조',
    '축구','농구','골프','인라인','태권도','줄넘기','바둑','캘리그라피','국악기','우쿨렐레','첼로'];

  allCats.forEach(c => { catScores[c] = Math.random() * 10; });

  searches.forEach(s => {
    const sl = (s || '').toLowerCase();
    allCats.forEach(c => { if (sl.includes(c.toLowerCase()) || c.toLowerCase().includes(sl)) catScores[c] = (catScores[c] || 0) + 15; });
  });

  Object.keys(progress).forEach(c => {
    catScores[c] = (catScores[c] || 0) + 20;
    const pct = progress[c] || 0;
    if (pct < 100) catScores[c] += 10;
  });

  wishlist.forEach(w => {
    if (w.cat) {
      allCats.forEach(c => { if (c.includes(w.cat) || w.cat.includes(c)) catScores[c] = (catScores[c] || 0) + 12; });
    }
  });

  diary.forEach(d => {
    if (d.cat) catScores[d.cat] = (catScores[d.cat] || 0) + 5;
  });

  const sorted = Object.entries(catScores).sort((a,b) => b[1] - a[1]).slice(0, 10);
  const maxScore = sorted[0] ? sorted[0][1] : 1;

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">즐겨찾기, 검색 이력, 수강 진도, 위시리스트, 수강일기를 종합 분석하여 맞춤 추천합니다.</div>';

  html += '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">';
  html += '<span style="font-size:11px;padding:4px 10px;border-radius:12px;background:rgba(96,165,250,0.1);color:#60A5FA;font-weight:600">즐겨찾기 ' + favs.length + '건</span>';
  html += '<span style="font-size:11px;padding:4px 10px;border-radius:12px;background:rgba(16,185,129,0.1);color:#10B981;font-weight:600">검색 이력 ' + searches.length + '건</span>';
  html += '<span style="font-size:11px;padding:4px 10px;border-radius:12px;background:rgba(245,158,11,0.1);color:#F59E0B;font-weight:600">수강 중 ' + Object.keys(progress).length + '과목</span>';
  html += '</div>';

  html += '<div style="display:flex;flex-direction:column;gap:10px">';
  sorted.forEach((item, idx) => {
    const pct = Math.round((item[1] / maxScore) * 100);
    const colors = ['#60A5FA','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6','#F97316','#6366F1','#84CC16'];
    const color = colors[idx % colors.length];
    const reasons = [];
    if (Object.keys(progress).includes(item[0])) reasons.push('수강중');
    if (searches.some(s => s && s.toLowerCase().includes(item[0].toLowerCase()))) reasons.push('검색이력');
    if (wishlist.some(w => w.cat && w.cat.includes(item[0]))) reasons.push('위시리스트');

    html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:14px;padding:14px 18px;transition:all .2s" class="v8-rec-card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
      '<span style="font-size:16px;font-weight:900;color:' + color + '">#' + (idx+1) + '</span>' +
      '<span style="font-weight:700;font-size:15px;color:var(--text-primary)">' + item[0] + '</span>' +
      '</div>' +
      '<span style="font-size:18px;font-weight:900;color:' + color + '">' + pct + '%</span>' +
      '</div>' +
      '<div style="background:var(--bar-bg);border-radius:8px;height:8px;overflow:hidden;margin-bottom:6px">' +
      '<div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,' + color + ',' + color + '88);border-radius:8px;transition:width .8s ease"></div>' +
      '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap">';
    reasons.forEach(r => {
      html += '<span style="font-size:10px;padding:2px 8px;border-radius:8px;background:' + color + '15;color:' + color + ';font-weight:600">' + r + '</span>';
    });
    if (reasons.length === 0) html += '<span style="font-size:10px;color:var(--text-muted)">AI 분석 기반 추천</span>';
    html += '</div></div>';
  });
  html += '</div>';

  createModal8('&#129302; 수강 추천 엔진', html);
  checkAch8('recommend_first');
}

// ═══════════════════════════════════════════════════════════════════
// 2. 수강 증명서 생성기 (Canvas)
// ═══════════════════════════════════════════════════════════════════
function showCertificateGen() {
  SFX8.play('certificate');
  trackV8Usage('certificate');

  const progress = lsGet('cc-progress', {});
  const completed = Object.entries(progress).filter(([,v]) => v >= 100).map(([k]) => k);

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">수료한 종목의 수강 증명서를 생성합니다. 이름을 입력하고 종목을 선택하세요.</div>';

  html += '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">' +
    '<input id="v8-cert-name" placeholder="수강자 이름" value="' + lsGet('cc-cert-name','') + '" style="flex:1;min-width:160px;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;outline:none">' +
    '<select id="v8-cert-cat" style="flex:1;min-width:140px;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;outline:none">';
  const allCats = ['수영','피아노','요가','발레','미술','댄스','보컬','코딩','드로잉','쿠킹','서예','공예'];
  allCats.forEach(c => {
    const done = completed.includes(c);
    html += '<option value="' + c + '"' + (done ? '' : '') + '>' + c + (done ? ' (수료)' : '') + '</option>';
  });
  html += '</select>' +
    '<button id="v8-cert-gen" style="padding:10px 20px;border-radius:10px;border:none;background:linear-gradient(135deg,#60A5FA,#3B82F6);color:#fff;font-weight:700;cursor:pointer;font-size:13px;white-space:nowrap">증명서 생성</button></div>';

  html += '<div style="text-align:center;margin-bottom:12px"><canvas id="v8-cert-canvas" width="800" height="560" style="max-width:100%;border-radius:12px;border:1px solid var(--card-border);background:#0a0e17"></canvas></div>';
  html += '<div style="display:flex;gap:8px;justify-content:center">' +
    '<button id="v8-cert-dl" style="padding:8px 18px;border-radius:8px;border:none;background:var(--input-bg);color:var(--text-primary);cursor:pointer;font-size:12px;font-weight:600">PNG 다운로드</button>' +
    '<button id="v8-cert-copy" style="padding:8px 18px;border-radius:8px;border:none;background:var(--input-bg);color:var(--text-primary);cursor:pointer;font-size:12px;font-weight:600">클립보드 복사</button></div>';

  const body = createModal8('&#127891; 수강 증명서 생성기', html);

  function renderCert() {
    const canvas = body.querySelector('#v8-cert-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const name = body.querySelector('#v8-cert-name').value || '수강자';
    const cat = body.querySelector('#v8-cert-cat').value;
    lsSet('cc-cert-name', name);

    const grad = ctx.createLinearGradient(0, 0, 800, 560);
    grad.addColorStop(0, '#0C1525');
    grad.addColorStop(0.5, '#162040');
    grad.addColorStop(1, '#0C1525');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 560);

    ctx.strokeStyle = '#60A5FA44';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 760, 520);
    ctx.strokeStyle = '#60A5FA22';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 740, 500);

    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(400, 280, 80 + i * 40, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(96,165,250,' + (0.03 - i * 0.004) + ')';
      ctx.stroke();
    }

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#60A5FA';
    ctx.textAlign = 'center';
    ctx.fillText('CULTURE CENTER FINDER', 400, 70);

    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('수 강 증 명 서', 400, 130);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#8BA4C4';
    ctx.fillText('CERTIFICATE OF COMPLETION', 400, 158);

    ctx.beginPath();
    ctx.moveTo(200, 180);
    ctx.lineTo(600, 180);
    ctx.strokeStyle = 'rgba(96,165,250,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#F59E0B';
    ctx.fillText(name, 400, 240);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#D4D4D4';
    ctx.fillText('위 사람은 문화센터 강좌 파인더에서', 400, 290);

    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#60A5FA';
    ctx.fillText('[ ' + cat + ' ] 과정', 400, 330);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#D4D4D4';
    ctx.fillText('을(를) 성실히 이수하였음을 증명합니다.', 400, 370);

    ctx.beginPath();
    ctx.moveTo(200, 400);
    ctx.lineTo(600, 400);
    ctx.strokeStyle = 'rgba(96,165,250,0.2)';
    ctx.stroke();

    const today = fmtDate8(new Date());
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#8BA4C4';
    ctx.fillText(today, 400, 440);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#60A5FA';
    ctx.fillText('PRIME Holdings', 400, 480);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#4B5563';
    ctx.fillText('No. CCF-' + dateSeed8() + '-' + cat.charCodeAt(0), 400, 510);

    checkAch8('cert_gen');
  }

  setTimeout(renderCert, 100);

  body.querySelector('#v8-cert-gen').addEventListener('click', () => {
    SFX8.play('certificate');
    renderCert();
    showToast8('&#127891; 증명서가 생성되었습니다!');
  });

  body.querySelector('#v8-cert-dl').addEventListener('click', () => {
    const canvas = body.querySelector('#v8-cert-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'certificate_' + fmtDate8() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast8('&#128190; 증명서 다운로드 완료!');
    checkAch8('cert_download');
  });

  body.querySelector('#v8-cert-copy').addEventListener('click', async () => {
    const canvas = body.querySelector('#v8-cert-canvas');
    if (!canvas) return;
    try {
      const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast8('&#128203; 클립보드에 복사되었습니다!');
    } catch(e) {
      showToast8('&#9888; 복사 실패 - 브라우저가 지원하지 않습니다');
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// 3. 강좌 활동 타임라인
// ═══════════════════════════════════════════════════════════════════
function showActivityTimeline() {
  SFX8.play('timeline');
  trackV8Usage('timeline');

  const events = [];

  const favs = lsGet('favorites', []);
  favs.forEach((f, i) => {
    events.push({ type: 'fav', icon: '&#11088;', text: '즐겨찾기 #' + (i+1) + ' 등록', date: '', color: '#F59E0B' });
  });

  const searches = lsGet('recent-searches', []);
  searches.slice(0, 10).forEach(s => {
    events.push({ type: 'search', icon: '&#128269;', text: '&quot;' + (s || '') + '&quot; 검색', date: '', color: '#60A5FA' });
  });

  const progress = lsGet('cc-progress', {});
  Object.entries(progress).forEach(([cat, pct]) => {
    events.push({ type: 'progress', icon: '&#128200;', text: cat + ' 수강 진도 ' + pct + '%', date: '', color: '#10B981' });
  });

  const diary = lsGet('cc-diary', []);
  diary.slice(-10).forEach(d => {
    events.push({ type: 'diary', icon: '&#128221;', text: d.cat + ' 수강일기: ' + (d.memo || '').substring(0, 30), date: d.date || '', color: '#EC4899' });
  });

  const notes = lsGet('cc-notes-v8', []);
  notes.slice(-10).forEach(n => {
    events.push({ type: 'note', icon: '&#128196;', text: n.title + ': ' + (n.content || '').substring(0, 30), date: n.date || '', color: '#14B8A6' });
  });

  const checkins = lsGet('cc-checkin-history', []);
  if (Array.isArray(checkins)) {
    checkins.slice(-10).forEach(c => {
      events.push({ type: 'checkin', icon: '&#128205;', text: (c.center || c) + ' 방문', date: c.date || '', color: '#8B5CF6' });
    });
  }

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">모든 학습 활동을 타임라인으로 확인하세요. 총 ' + events.length + '건의 활동이 기록되었습니다.</div>';

  html += '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">';
  const types = [{t:'fav',l:'즐겨찾기',c:'#F59E0B'},{t:'search',l:'검색',c:'#60A5FA'},{t:'progress',l:'수강',c:'#10B981'},{t:'diary',l:'일기',c:'#EC4899'},{t:'note',l:'노트',c:'#14B8A6'},{t:'checkin',l:'체크인',c:'#8B5CF6'}];
  types.forEach(tp => {
    const cnt = events.filter(e => e.type === tp.t).length;
    html += '<span style="font-size:11px;padding:4px 10px;border-radius:12px;background:' + tp.c + '15;color:' + tp.c + ';font-weight:600">' + tp.l + ' ' + cnt + '</span>';
  });
  html += '</div>';

  if (events.length === 0) {
    html += '<div style="text-align:center;padding:60px 20px;color:var(--text-muted)"><div style="font-size:48px;margin-bottom:16px">&#128203;</div><div style="font-size:14px">아직 활동 기록이 없습니다.<br>강좌를 검색하고 즐겨찾기를 추가해보세요!</div></div>';
  } else {
    html += '<div style="position:relative;padding-left:30px">';
    html += '<div style="position:absolute;left:12px;top:0;bottom:0;width:2px;background:var(--card-border)"></div>';
    events.slice(-30).reverse().forEach((ev, i) => {
      html += '<div style="position:relative;margin-bottom:14px;animation:v8SlideRight .3s ease ' + (i * 0.03) + 's both">' +
        '<div style="position:absolute;left:-24px;top:4px;width:16px;height:16px;border-radius:50%;background:' + ev.color + '22;border:2px solid ' + ev.color + ';display:flex;align-items:center;justify-content:center;font-size:8px">' +
        '<div style="width:6px;height:6px;border-radius:50%;background:' + ev.color + '"></div></div>' +
        '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:12px 16px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center">' +
        '<div style="display:flex;align-items:center;gap:8px">' +
        '<span style="font-size:16px">' + ev.icon + '</span>' +
        '<span style="font-size:13px;font-weight:600;color:var(--text-primary)">' + ev.text + '</span>' +
        '</div>' +
        (ev.date ? '<span style="font-size:10px;color:var(--text-muted)">' + ev.date + '</span>' : '') +
        '</div></div></div>';
    });
    html += '</div>';
  }

  createModal8('&#128197; 활동 타임라인 (' + events.length + '건)', html);
  checkAch8('timeline_view');
}

// ═══════════════════════════════════════════════════════════════════
// 4. 종목 인기도 랭킹 (Canvas)
// ═══════════════════════════════════════════════════════════════════
function showPopularityRanking() {
  SFX8.play('ranking');
  trackV8Usage('ranking');

  const rankings = [
    { name: '요가/필라테스', count: 4397, trend: '+12%', hot: true },
    { name: '미술(종합)', count: 4446, trend: '+8%', hot: true },
    { name: '발레', count: 3137, trend: '+15%', hot: true },
    { name: '회화', count: 3097, trend: '+5%', hot: false },
    { name: '체육(종합)', count: 2892, trend: '+3%', hot: false },
    { name: '베이킹', count: 2820, trend: '+18%', hot: true },
    { name: '영어', count: 2386, trend: '-2%', hot: false },
    { name: '댄스(기타)', count: 1985, trend: '+7%', hot: false },
    { name: '요리', count: 1879, trend: '+10%', hot: true },
    { name: '피아노', count: 1596, trend: '+4%', hot: false },
    { name: '플라워', count: 1503, trend: '+22%', hot: true },
    { name: '바이올린', count: 1245, trend: '+6%', hot: false }
  ];

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">전국 84,000+ 강좌 데이터 기반 종목별 인기도 순위입니다.</div>';

  html += '<div style="text-align:center;margin-bottom:16px"><canvas id="v8-ranking-canvas" width="640" height="380" style="max-width:100%;border-radius:12px;border:1px solid var(--card-border)"></canvas></div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">';
  rankings.forEach((r, idx) => {
    const pct = Math.round((r.count / rankings[0].count) * 100);
    const colors = ['#60A5FA','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6','#F97316','#6366F1','#84CC16','#D946EF','#22D3EE'];
    const c = colors[idx % colors.length];
    const trendUp = r.trend.startsWith('+');

    html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:12px">' +
      '<span style="font-size:16px;font-weight:900;color:' + c + ';min-width:28px">#' + (idx+1) + '</span>' +
      '<div style="flex:1">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">' +
      '<span style="font-weight:700;font-size:13px;color:var(--text-primary)">' + r.name + (r.hot ? ' &#128293;' : '') + '</span>' +
      '<span style="font-size:12px;font-weight:700;color:' + (trendUp ? '#10B981' : '#EF4444') + '">' + r.trend + '</span>' +
      '</div>' +
      '<div style="background:var(--bar-bg);border-radius:6px;height:6px;overflow:hidden">' +
      '<div style="height:100%;width:' + pct + '%;background:' + c + ';border-radius:6px"></div></div>' +
      '<div style="font-size:10px;color:var(--text-muted);margin-top:3px">' + r.count.toLocaleString() + '개 강좌</div>' +
      '</div></div>';
  });
  html += '</div>';

  const body = createModal8('&#128293; 종목 인기도 랭킹', html);

  setTimeout(() => {
    const canvas = body.querySelector('#v8-ranking-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 640, H = 380;

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#0C1525');
    grad.addColorStop(1, '#080B10');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('종목별 강좌 수 TOP 12', W/2, 28);

    const top12 = rankings.slice(0, 12);
    const maxVal = Math.max(...top12.map(r => r.count));
    const barW = 36;
    const gap = 14;
    const startX = 50;
    const baseY = H - 50;
    const maxH = H - 100;
    const colors = ['#60A5FA','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#14B8A6','#F97316','#6366F1','#84CC16','#D946EF','#22D3EE'];

    top12.forEach((r, i) => {
      const barH = (r.count / maxVal) * maxH;
      const x = startX + i * (barW + gap);

      const barGrad = ctx.createLinearGradient(x, baseY - barH, x, baseY);
      barGrad.addColorStop(0, colors[i]);
      barGrad.addColorStop(1, colors[i] + '44');
      ctx.fillStyle = barGrad;

      ctx.beginPath();
      ctx.roundRect(x, baseY - barH, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = colors[i];
      ctx.textAlign = 'center';
      ctx.fillText(r.count.toLocaleString(), x + barW/2, baseY - barH - 8);

      ctx.save();
      ctx.translate(x + barW/2, baseY + 12);
      ctx.rotate(-0.5);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#8BA4C4';
      ctx.textAlign = 'left';
      ctx.fillText(r.name.substring(0, 6), 0, 0);
      ctx.restore();
    });
  }, 150);

  checkAch8('ranking_view');
}

// ═══════════════════════════════════════════════════════════════════
// 5. 학습 커뮤니티 (AI 10인)
// ═══════════════════════════════════════════════════════════════════
const COMMUNITY_MEMBERS = [
  { name: '김하나', cat: '요가', style: '매일 아침 요가로 하루를 시작해요', trait: '성실형', emoji: '&#129495;' },
  { name: '이준호', cat: '피아노', style: '쇼팽을 좋아하는 음악 애호가', trait: '예술형', emoji: '&#127929;' },
  { name: '박서연', cat: '발레', style: '발레는 우아함의 정수', trait: '완벽주의', emoji: '&#129336;' },
  { name: '최도윤', cat: '코딩', style: '파이썬으로 세상을 바꾸고 싶어요', trait: '논리형', emoji: '&#128187;' },
  { name: '정유진', cat: '미술', style: '수채화 그리는 걸 좋아해요', trait: '감성형', emoji: '&#127912;' },
  { name: '강민수', cat: '수영', style: '건강한 몸에 건강한 마음', trait: '체력형', emoji: '&#127946;' },
  { name: '윤채린', cat: '베이킹', style: '쿠키와 케이크는 행복의 맛', trait: '힐링형', emoji: '&#127856;' },
  { name: '한지훈', cat: '드럼', style: '비트를 타면 스트레스가 날아가요', trait: '에너지형', emoji: '&#129345;' },
  { name: '오미래', cat: '플라워', style: '꽃으로 마음을 전해요', trait: '낭만형', emoji: '&#127801;' },
  { name: '신태양', cat: '축구', style: '주말마다 동네 축구하는 축구광', trait: '사교형', emoji: '&#9917;' }
];

function showCommunity() {
  SFX8.play('community');
  trackV8Usage('community');

  const messages = lsGet('cc-community-msgs', []);

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">학습 커뮤니티에서 AI 학습 동료들과 소통하세요. 메시지를 보내면 AI가 응답합니다.</div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-bottom:20px">';
  COMMUNITY_MEMBERS.forEach(m => {
    html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:14px;padding:14px;transition:all .2s" class="v8-member-card">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
      '<span style="font-size:24px">' + m.emoji + '</span>' +
      '<div>' +
      '<div style="font-weight:700;font-size:14px;color:var(--text-primary)">' + m.name + '</div>' +
      '<div style="font-size:11px;color:var(--text-muted)">' + m.cat + ' &middot; ' + m.trait + '</div>' +
      '</div></div>' +
      '<div style="font-size:12px;color:var(--text-secondary);font-style:italic;padding:8px 12px;background:var(--bar-bg);border-radius:10px">&ldquo;' + m.style + '&rdquo;</div>' +
      '</div>';
  });
  html += '</div>';

  html += '<div style="border-top:1px solid var(--card-border);padding-top:16px">';
  html += '<h4 style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px">&#128172; 커뮤니티 메시지</h4>';

  html += '<div id="v8-msgs" style="max-height:200px;overflow-y:auto;margin-bottom:12px;display:flex;flex-direction:column;gap:8px">';
  if (messages.length === 0) {
    html += '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px">첫 메시지를 보내보세요!</div>';
  } else {
    messages.slice(-20).forEach(msg => {
      const isMe = msg.from === 'me';
      html += '<div style="display:flex;justify-content:' + (isMe ? 'flex-end' : 'flex-start') + '">' +
        '<div style="max-width:70%;padding:8px 14px;border-radius:' + (isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px') + ';background:' + (isMe ? 'linear-gradient(135deg,#60A5FA,#3B82F6)' : 'var(--card-bg)') + ';border:1px solid ' + (isMe ? 'transparent' : 'var(--card-border)') + ';color:' + (isMe ? '#fff' : 'var(--text-primary)') + ';font-size:12px">' +
        (isMe ? '' : '<span style="font-size:10px;font-weight:700;color:' + (isMe ? '#ddd' : '#60A5FA') + ';display:block;margin-bottom:2px">' + msg.from + '</span>') +
        msg.text + '</div></div>';
    });
  }
  html += '</div>';

  html += '<div style="display:flex;gap:8px">' +
    '<input id="v8-msg-input" placeholder="메시지를 입력하세요..." style="flex:1;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;outline:none">' +
    '<button id="v8-msg-send" style="padding:10px 18px;border-radius:10px;border:none;background:linear-gradient(135deg,#60A5FA,#3B82F6);color:#fff;font-weight:700;cursor:pointer;font-size:13px">전송</button></div>';
  html += '</div>';

  const body = createModal8('&#128101; 학습 커뮤니티', html);

  body.querySelector('#v8-msg-send').addEventListener('click', () => {
    const input = body.querySelector('#v8-msg-input');
    const text = input.value.trim();
    if (!text) return;

    messages.push({ from: 'me', text: text, date: fmtDate8() });

    const responder = COMMUNITY_MEMBERS[Math.floor(Math.random() * COMMUNITY_MEMBERS.length)];
    const responses = [
      '저도 ' + responder.cat + ' 하면서 같은 생각이었어요!',
      '좋은 말씀이에요! 저도 요즘 열심히 하고 있답니다.',
      '저는 ' + responder.cat + ' 배우는 중인데, 함께 해요!',
      '오늘도 화이팅! ' + responder.cat + ' 연습하러 가야겠어요.',
      '맞아요! 문화센터 수강이 인생을 바꿔요.',
      '여러분 덕분에 동기부여가 되네요 ' + responder.emoji,
      responder.cat + ' 수업 끝나고 왔어요, 오늘 너무 재밌었어요!',
      '저도 꾸준히 해서 실력이 많이 늘었어요!'
    ];
    const resp = responses[Math.floor(Math.random() * responses.length)];
    messages.push({ from: responder.name, text: resp, date: fmtDate8() });
    lsSet('cc-community-msgs', messages);
    input.value = '';
    SFX8.play('community');
    showCommunity();
    checkAch8('community_msg');
    if (messages.filter(m => m.from === 'me').length >= 10) checkAch8('community_10');
  });

  body.querySelector('#v8-msg-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') body.querySelector('#v8-msg-send').click();
  });
}

// ═══════════════════════════════════════════════════════════════════
// 6. 수강 스트릭 시스템
// ═══════════════════════════════════════════════════════════════════
function showStreakSystem() {
  SFX8.play('streak');
  trackV8Usage('streak');

  const streakData = lsGet('cc-streak-v8', { current: 0, best: 0, dates: [], lastDate: '' });
  const today = fmtDate8();

  if (streakData.lastDate !== today) {
    if (streakData.lastDate === fmtDate8(new Date(Date.now() - 86400000))) {
      streakData.current++;
    } else if (streakData.lastDate !== today) {
      streakData.current = 1;
    }
    streakData.lastDate = today;
    if (!streakData.dates.includes(today)) streakData.dates.push(today);
    if (streakData.current > streakData.best) streakData.best = streakData.current;
    lsSet('cc-streak-v8', streakData);
  }

  const milestones = [
    { days: 3, reward: '&#127941; 3일 연속', desc: '시작이 반이에요!', color: '#10B981' },
    { days: 7, reward: '&#128293; 7일 연속', desc: '일주일 완주!', color: '#F59E0B' },
    { days: 14, reward: '&#11088; 14일 연속', desc: '2주 챔피언!', color: '#EF4444' },
    { days: 30, reward: '&#128081; 30일 연속', desc: '한 달 마스터!', color: '#8B5CF6' },
    { days: 60, reward: '&#127775; 60일 연속', desc: '초인의 경지!', color: '#EC4899' },
    { days: 100, reward: '&#128142; 100일 연속', desc: '전설의 학습자!', color: '#D946EF' }
  ];

  let html = '<div style="text-align:center;padding:20px 0 24px">';
  html += '<div style="font-size:64px;margin-bottom:8px">&#128293;</div>';
  html += '<div style="font-size:48px;font-weight:900;color:#F59E0B;margin-bottom:4px">' + streakData.current + '일</div>';
  html += '<div style="font-size:14px;color:var(--text-secondary)">현재 연속 학습</div>';
  html += '<div style="font-size:12px;color:var(--text-muted);margin-top:4px">최고 기록: ' + streakData.best + '일 &middot; 총 학습일: ' + streakData.dates.length + '일</div>';
  html += '</div>';

  html += '<h4 style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px">&#127942; 마일스톤</h4>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-bottom:20px">';
  milestones.forEach(m => {
    const achieved = streakData.best >= m.days;
    html += '<div style="background:var(--card-bg);border:1px solid ' + (achieved ? m.color + '44' : 'var(--card-border)') + ';border-radius:12px;padding:14px;text-align:center;opacity:' + (achieved ? '1' : '0.5') + '">' +
      '<div style="font-size:28px;margin-bottom:6px">' + m.reward + '</div>' +
      '<div style="font-size:12px;font-weight:700;color:' + m.color + '">' + m.days + '일</div>' +
      '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">' + m.desc + '</div>' +
      (achieved ? '<div style="font-size:10px;color:#10B981;margin-top:4px;font-weight:600">&#10003; 달성!</div>' : '') +
      '</div>';
  });
  html += '</div>';

  html += '<h4 style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px">&#128197; 최근 7일</h4>';
  html += '<div style="display:flex;gap:8px;justify-content:center">';
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const ds = fmtDate8(d);
    const active = streakData.dates.includes(ds);
    const dayName = ['일','월','화','수','목','금','토'][d.getDay()];
    html += '<div style="text-align:center;width:48px">' +
      '<div style="font-size:10px;color:var(--text-muted);margin-bottom:4px">' + dayName + '</div>' +
      '<div style="width:40px;height:40px;border-radius:10px;background:' + (active ? 'linear-gradient(135deg,#F59E0B,#EF4444)' : 'var(--card-bg)') + ';border:1px solid ' + (active ? '#F59E0B44' : 'var(--card-border)') + ';display:flex;align-items:center;justify-content:center;margin:0 auto;font-size:16px">' +
      (active ? '&#128293;' : '<span style="font-size:10px;color:var(--text-muted)">' + d.getDate() + '</span>') +
      '</div></div>';
  }
  html += '</div>';

  createModal8('&#128293; 수강 스트릭', html);
  if (streakData.current >= 7) checkAch8('streak_7');
  if (streakData.current >= 30) checkAch8('streak_30');
}

// ═══════════════════════════════════════════════════════════════════
// 7. 음성 검색
// ═══════════════════════════════════════════════════════════════════
function showVoiceSearch() {
  SFX8.play('voice');
  trackV8Usage('voice');

  const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  let html = '<div style="text-align:center;padding:30px 0">';

  if (!supported) {
    html += '<div style="font-size:48px;margin-bottom:16px">&#128266;</div>';
    html += '<div style="font-size:14px;color:var(--text-secondary)">이 브라우저는 음성 인식을 지원하지 않습니다.<br>Chrome 브라우저를 사용해주세요.</div>';
  } else {
    html += '<div id="v8-voice-icon" style="font-size:72px;margin-bottom:16px;cursor:pointer;transition:transform .2s" title="클릭하여 음성 검색">&#127908;</div>';
    html += '<div id="v8-voice-status" style="font-size:16px;font-weight:700;color:var(--accent);margin-bottom:12px">마이크를 클릭하여 시작</div>';
    html += '<div id="v8-voice-result" style="font-size:14px;color:var(--text-secondary);margin-bottom:20px;min-height:24px"></div>';
    html += '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:16px">';
    ['수영','피아노','요가','발레','미술','댄스','영어','코딩'].forEach(w => {
      html += '<span style="font-size:11px;padding:4px 12px;border-radius:12px;background:var(--card-bg);border:1px solid var(--card-border);color:var(--text-muted)">&quot;' + w + '&quot;</span>';
    });
    html += '</div>';
    html += '<div style="font-size:11px;color:var(--text-muted)">음성으로 종목명을 말하면 자동으로 검색합니다</div>';
  }
  html += '</div>';

  const body = createModal8('&#127908; 음성 검색', html);

  if (supported) {
    const voiceIcon = body.querySelector('#v8-voice-icon');
    const status = body.querySelector('#v8-voice-status');
    const result = body.querySelector('#v8-voice-result');
    let recognition = null;

    voiceIcon.addEventListener('click', () => {
      if (recognition) {
        recognition.stop();
        recognition = null;
        voiceIcon.style.transform = 'scale(1)';
        status.textContent = '마이크를 클릭하여 시작';
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.lang = 'ko-KR';
      recognition.continuous = false;
      recognition.interimResults = true;

      voiceIcon.style.transform = 'scale(1.2)';
      voiceIcon.innerHTML = '&#128308;';
      status.textContent = '듣고 있습니다...';
      status.style.color = '#EF4444';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        result.textContent = '인식: ' + transcript;

        if (event.results[0].isFinal) {
          voiceIcon.innerHTML = '&#127908;';
          voiceIcon.style.transform = 'scale(1)';
          status.textContent = '검색 완료!';
          status.style.color = '#10B981';

          const searchInput = document.querySelector('input[placeholder*="검색"]') || document.querySelector('input[type="text"]');
          if (searchInput) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            nativeInputValueSetter.call(searchInput, transcript);
            searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            searchInput.dispatchEvent(new Event('change', { bubbles: true }));
          }

          setTimeout(() => {
            const modal = document.getElementById('v8-modal');
            if (modal) modal.remove();
          }, 1000);

          recognition = null;
          checkAch8('voice_search');
        }
      };

      recognition.onerror = () => {
        voiceIcon.innerHTML = '&#127908;';
        voiceIcon.style.transform = 'scale(1)';
        status.textContent = '인식 실패. 다시 시도해주세요.';
        status.style.color = '#EF4444';
        recognition = null;
      };

      recognition.onend = () => {
        voiceIcon.innerHTML = '&#127908;';
        voiceIcon.style.transform = 'scale(1)';
        recognition = null;
      };

      recognition.start();
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
// 8. 수강 노트
// ═══════════════════════════════════════════════════════════════════
function showNotes() {
  SFX8.play('note');
  trackV8Usage('notes');

  const notes = lsGet('cc-notes-v8', []);

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">강좌별 메모와 학습 노트를 기록하세요. 최대 50건까지 저장됩니다.</div>';

  html += '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">' +
    '<input id="v8-note-title" placeholder="제목 (예: 요가 호흡법)" style="flex:1;min-width:150px;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;outline:none">' +
    '<select id="v8-note-cat" style="min-width:100px;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;outline:none">';
  ['일반','수영','피아노','요가','발레','미술','댄스','코딩','보컬','쿠킹','영어','기타'].forEach(c => {
    html += '<option value="' + c + '">' + c + '</option>';
  });
  html += '</select></div>';
  html += '<div style="margin-bottom:12px"><textarea id="v8-note-content" placeholder="노트 내용을 입력하세요..." rows="3" style="width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;outline:none;resize:vertical;font-family:inherit;box-sizing:border-box"></textarea></div>';
  html += '<div style="margin-bottom:20px;text-align:right"><button id="v8-note-save" style="padding:10px 24px;border-radius:10px;border:none;background:linear-gradient(135deg,#60A5FA,#3B82F6);color:#fff;font-weight:700;cursor:pointer;font-size:13px">&#128190; 저장</button></div>';

  if (notes.length === 0) {
    html += '<div style="text-align:center;padding:40px;color:var(--text-muted);font-size:13px">아직 노트가 없습니다. 첫 노트를 작성해보세요!</div>';
  } else {
    html += '<div style="display:flex;flex-direction:column;gap:10px">';
    notes.slice().reverse().forEach((n, i) => {
      const origIdx = notes.length - 1 - i;
      const catColors = { '수영':'#60A5FA','피아노':'#F59E0B','요가':'#10B981','발레':'#EC4899','미술':'#8B5CF6','댄스':'#EF4444','코딩':'#14B8A6','보컬':'#F97316','쿠킹':'#84CC16','영어':'#6366F1','일반':'#8BA4C4','기타':'#D4D4D4' };
      const cc = catColors[n.cat] || '#8BA4C4';
      html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:14px;padding:14px 18px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
        '<div style="display:flex;align-items:center;gap:8px">' +
        '<span style="font-size:11px;padding:3px 10px;border-radius:8px;background:' + cc + '15;color:' + cc + ';font-weight:600">' + n.cat + '</span>' +
        '<span style="font-weight:700;font-size:14px;color:var(--text-primary)">' + n.title + '</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
        '<span style="font-size:10px;color:var(--text-muted)">' + n.date + '</span>' +
        '<button class="v8-note-del" data-idx="' + origIdx + '" style="background:none;border:none;color:#EF4444;cursor:pointer;font-size:16px;padding:2px">&times;</button>' +
        '</div></div>' +
        '<div style="font-size:12px;color:var(--text-secondary);line-height:1.7;white-space:pre-wrap">' + n.content + '</div>' +
        '</div>';
    });
    html += '</div>';
  }

  const body = createModal8('&#128196; 수강 노트 (' + notes.length + ')', html);

  body.querySelector('#v8-note-save').addEventListener('click', () => {
    const title = body.querySelector('#v8-note-title').value.trim();
    const cat = body.querySelector('#v8-note-cat').value;
    const content = body.querySelector('#v8-note-content').value.trim();
    if (!title || !content) { showToast8('&#9888; 제목과 내용을 입력하세요'); return; }

    notes.push({ title, cat, content, date: fmtDate8() });
    if (notes.length > 50) notes.shift();
    lsSet('cc-notes-v8', notes);
    SFX8.play('note');
    showToast8('&#128196; 노트가 저장되었습니다!');
    checkAch8('note_first');
    if (notes.length >= 10) checkAch8('note_10');
    showNotes();
  });

  body.querySelectorAll('.v8-note-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      notes.splice(idx, 1);
      lsSet('cc-notes-v8', notes);
      showNotes();
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
// 9. 강좌 알림 시스템
// ═══════════════════════════════════════════════════════════════════
function showAlertSystem() {
  SFX8.play('alert');
  trackV8Usage('alerts');

  const alerts = lsGet('cc-alerts-v8', []);

  const sampleAlerts = [
    { type: 'deadline', icon: '&#9203;', text: '롯데마트 잠실 요가 접수 마감 D-3', color: '#EF4444', urgent: true },
    { type: 'open', icon: '&#127881;', text: '홈플러스 영등포 여름학기 접수 시작!', color: '#10B981', urgent: false },
    { type: 'price', icon: '&#128176;', text: '현대백화점 피아노 수강료 10% 할인', color: '#F59E0B', urgent: false },
    { type: 'new', icon: '&#10024;', text: '이마트 성수 K-POP댄스 신규 개강', color: '#8B5CF6', urgent: false },
    { type: 'deadline', icon: '&#9203;', text: '갤러리아 압구정 발레 마감 D-1', color: '#EF4444', urgent: true },
    { type: 'review', icon: '&#11088;', text: '홈플러스 강동 피아노 5.0 만점 리뷰!', color: '#F59E0B', urgent: false }
  ];

  const allAlerts = [...sampleAlerts, ...alerts];

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">관심 강좌의 접수 상태 변경, 마감 임박, 가격 변동 알림을 받으세요.</div>';

  html += '<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">';
  const urgentCnt = allAlerts.filter(a => a.urgent).length;
  html += '<span style="font-size:11px;padding:4px 10px;border-radius:12px;background:rgba(239,68,68,0.1);color:#EF4444;font-weight:700">긴급 ' + urgentCnt + '</span>';
  html += '<span style="font-size:11px;padding:4px 10px;border-radius:12px;background:rgba(96,165,250,0.1);color:#60A5FA;font-weight:600">전체 ' + allAlerts.length + '</span>';
  html += '</div>';

  html += '<div style="margin-bottom:20px">';
  html += '<h4 style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:12px">&#128276; 알림 추가</h4>';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
    '<input id="v8-alert-text" placeholder="알림 내용 (예: 요가 마감일 확인)" style="flex:1;min-width:200px;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;outline:none">' +
    '<select id="v8-alert-type" style="min-width:100px;padding:10px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:12px;outline:none">' +
    '<option value="deadline">마감 임박</option><option value="open">접수 시작</option><option value="price">가격 변동</option><option value="new">신규 개강</option></select>' +
    '<button id="v8-alert-add" style="padding:10px 18px;border-radius:10px;border:none;background:linear-gradient(135deg,#60A5FA,#3B82F6);color:#fff;font-weight:700;cursor:pointer;font-size:13px">추가</button></div>';
  html += '</div>';

  html += '<div style="display:flex;flex-direction:column;gap:8px">';
  allAlerts.forEach((a, i) => {
    html += '<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--card-bg);border:1px solid ' + (a.urgent ? a.color + '33' : 'var(--card-border)') + ';border-radius:12px;' + (a.urgent ? 'border-left:3px solid ' + a.color : '') + '">' +
      '<span style="font-size:20px">' + a.icon + '</span>' +
      '<div style="flex:1">' +
      '<div style="font-size:13px;font-weight:600;color:var(--text-primary)">' + a.text + '</div>' +
      '</div>' +
      (a.urgent ? '<span style="font-size:9px;padding:3px 8px;border-radius:8px;background:' + a.color + '22;color:' + a.color + ';font-weight:700;animation:v8Pulse 2s infinite">긴급</span>' : '') +
      '</div>';
  });
  html += '</div>';

  const body = createModal8('&#128276; 강좌 알림 (' + allAlerts.length + ')', html);

  body.querySelector('#v8-alert-add').addEventListener('click', () => {
    const text = body.querySelector('#v8-alert-text').value.trim();
    const type = body.querySelector('#v8-alert-type').value;
    if (!text) return;
    const icons = { deadline: '&#9203;', open: '&#127881;', price: '&#128176;', new: '&#10024;' };
    const colors = { deadline: '#EF4444', open: '#10B981', price: '#F59E0B', new: '#8B5CF6' };
    alerts.push({ type, icon: icons[type], text, color: colors[type], urgent: type === 'deadline' });
    lsSet('cc-alerts-v8', alerts);
    SFX8.play('alert');
    showToast8('&#128276; 알림이 등록되었습니다!');
    checkAch8('alert_set');
    showAlertSystem();
  });
}

// ═══════════════════════════════════════════════════════════════════
// 10. 소셜 프로필 카드 (Canvas)
// ═══════════════════════════════════════════════════════════════════
function showProfileCard() {
  SFX8.play('profile');
  trackV8Usage('profile');

  const progress = lsGet('cc-progress', {});
  const streakData = lsGet('cc-streak-v8', { current: 0, best: 0, dates: [] });
  const notes = lsGet('cc-notes-v8', []);
  const achV7 = lsGet('cc-ach-v7', []);
  const achV8 = lsGet('cc-ach-v8', []);
  const totalAch = achV7.length + achV8.length;
  const completedCats = Object.entries(progress).filter(([,v]) => v >= 100).length;
  const userName = lsGet('cc-cert-name', '학습자');

  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">나의 학습 프로필 카드를 생성하고 공유하세요.</div>';

  html += '<div style="display:flex;gap:8px;margin-bottom:16px">' +
    '<input id="v8-profile-name" placeholder="닉네임" value="' + userName + '" style="flex:1;padding:10px 14px;border-radius:10px;border:1px solid var(--input-border);background:var(--input-bg);color:var(--text-primary);font-size:13px;outline:none">' +
    '<button id="v8-profile-gen" style="padding:10px 20px;border-radius:10px;border:none;background:linear-gradient(135deg,#60A5FA,#3B82F6);color:#fff;font-weight:700;cursor:pointer;font-size:13px">생성</button></div>';

  html += '<div style="text-align:center;margin-bottom:12px"><canvas id="v8-profile-canvas" width="600" height="380" style="max-width:100%;border-radius:12px;border:1px solid var(--card-border)"></canvas></div>';

  html += '<div style="display:flex;gap:8px;justify-content:center">' +
    '<button id="v8-profile-dl" style="padding:8px 18px;border-radius:8px;border:none;background:var(--input-bg);color:var(--text-primary);cursor:pointer;font-size:12px;font-weight:600">PNG 다운로드</button>' +
    '<button id="v8-profile-copy" style="padding:8px 18px;border-radius:8px;border:none;background:var(--input-bg);color:var(--text-primary);cursor:pointer;font-size:12px;font-weight:600">클립보드 복사</button></div>';

  const body = createModal8('&#128100; 소셜 프로필 카드', html);

  function renderProfile() {
    const canvas = body.querySelector('#v8-profile-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const name = body.querySelector('#v8-profile-name').value || '학습자';
    lsSet('cc-cert-name', name);

    const grad = ctx.createLinearGradient(0, 0, 600, 380);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(0.5, '#1E3A5F');
    grad.addColorStop(1, '#0F172A');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 380);

    ctx.strokeStyle = '#60A5FA33';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, 576, 356);

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#60A5FA';
    ctx.textAlign = 'left';
    ctx.fillText('CULTURE CENTER FINDER', 30, 40);

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#4B5563';
    ctx.textAlign = 'right';
    ctx.fillText('v8.0', 570, 40);

    ctx.beginPath();
    ctx.arc(80, 110, 35, 0, Math.PI * 2);
    const avatarGrad = ctx.createLinearGradient(45, 75, 115, 145);
    avatarGrad.addColorStop(0, '#60A5FA');
    avatarGrad.addColorStop(1, '#3B82F6');
    ctx.fillStyle = avatarGrad;
    ctx.fill();

    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(name.charAt(0), 80, 120);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.fillText(name, 135, 105);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#8BA4C4';
    ctx.fillText('문화센터 학습자', 135, 125);

    ctx.beginPath();
    ctx.moveTo(30, 165);
    ctx.lineTo(570, 165);
    ctx.strokeStyle = 'rgba(96,165,250,0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const stats = [
      { label: '연속 학습', value: streakData.current + '일', color: '#F59E0B' },
      { label: '수료 과목', value: completedCats + '과목', color: '#10B981' },
      { label: '총 업적', value: totalAch + '개', color: '#8B5CF6' },
      { label: '학습 노트', value: notes.length + '편', color: '#EC4899' },
      { label: '학습일', value: streakData.dates.length + '일', color: '#14B8A6' },
      { label: '최고 스트릭', value: streakData.best + '일', color: '#EF4444' }
    ];

    stats.forEach((s, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 30 + col * 185;
      const y = 185 + row * 80;

      ctx.fillStyle = s.color + '15';
      ctx.beginPath();
      ctx.roundRect(x, y, 170, 65, 10);
      ctx.fill();

      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = s.color;
      ctx.textAlign = 'center';
      ctx.fillText(s.value, x + 85, y + 30);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#8BA4C4';
      ctx.fillText(s.label, x + 85, y + 50);
    });

    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#4B5563';
    ctx.textAlign = 'center';
    ctx.fillText(fmtDate8() + ' | PRIME Holdings', 300, 368);
  }

  setTimeout(renderProfile, 100);

  body.querySelector('#v8-profile-gen').addEventListener('click', () => {
    SFX8.play('profile');
    renderProfile();
    showToast8('&#128100; 프로필 카드가 생성되었습니다!');
    checkAch8('profile_gen');
  });

  body.querySelector('#v8-profile-dl').addEventListener('click', () => {
    const canvas = body.querySelector('#v8-profile-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'profile_' + fmtDate8() + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast8('&#128190; 프로필 카드 다운로드 완료!');
  });

  body.querySelector('#v8-profile-copy').addEventListener('click', async () => {
    const canvas = body.querySelector('#v8-profile-canvas');
    if (!canvas) return;
    try {
      const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast8('&#128203; 클립보드에 복사되었습니다!');
    } catch(e) {
      showToast8('&#9888; 복사 실패');
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// 퀴즈 v8 (+15문, 45→60)
// ═══════════════════════════════════════════════════════════════════
const QUIZ_V8 = [
  { q: '문화센터 강좌에서 가장 인기 있는 종목은?', o: ['요가/필라테스','수영','피아노','발레'], a: 0, tip: '요가/필라테스는 전국 4,400+ 강좌로 최다입니다.' },
  { q: '베이킹과 디저트 강좌의 평균 수강료 범위는?', o: ['1~3만원','3~5만원','5~10만원','10만원 이상'], a: 1, tip: '대형마트 기준 1회 3~5만원이 가장 많습니다.' },
  { q: '플라워 아레인지먼트에서 오아시스의 역할은?', o: ['장식용','꽃 고정','향기 발산','색상 변환'], a: 1, tip: '오아시스는 꽃꽂이 스펀지로 꽃대를 고정합니다.' },
  { q: '발레 기본 5포지션 중 1번 포지션의 발 모양은?', o: ['나란히','V자','T자','평행'], a: 1, tip: '1번은 양 발뒤꿈치를 붙이고 V자로 벌립니다.' },
  { q: '요가의 태양경배(Surya Namaskar) 동작 수는?', o: ['8개','10개','12개','16개'], a: 2, tip: '태양경배는 12개 자세로 구성됩니다.' },
  { q: '피아노 건반에서 1옥타브는 몇 개의 건반?', o: ['7개','10개','12개','13개'], a: 2, tip: '흰 7 + 검은 5 = 12개가 1옥타브입니다.' },
  { q: '수채화에서 웨트 온 웨트(Wet on Wet) 기법이란?', o: ['마른 종이에 물감','젖은 종이에 물감','두꺼운 물감 겹치기','스프레이 뿌리기'], a: 1, tip: '젖은 종이 위에 물감을 올려 번지는 효과를 냅니다.' },
  { q: '홈플러스 문화센터의 한 학기 기간은?', o: ['1개월','2개월','3개월','6개월'], a: 2, tip: '보통 3개월(12주) 단위로 운영됩니다.' },
  { q: '롯데마트 문화센터의 대표 프로그램은?', o: ['원데이클래스','장기 코스','자격증 과정','인터넷 강의'], a: 0, tip: '롯데마트는 원데이클래스가 특히 인기입니다.' },
  { q: 'K-POP 댄스에서 포인트 안무(Point Dance)란?', o: ['전체 안무','하이라이트 동작','기본 스텝','워밍업'], a: 1, tip: '노래의 가장 인상적인 하이라이트 동작입니다.' },
  { q: '캘리그라피에서 붓펜의 각도는 보통 몇 도?', o: ['15도','30도','45도','60도'], a: 2, tip: '약 45도 각도가 기본 필기 자세입니다.' },
  { q: '바이올린 활(Bow)의 털은 어떤 동물의 것?', o: ['양','말','염소','토끼'], a: 1, tip: '말 꼬리털(약 150~200가닥)을 사용합니다.' },
  { q: '드럼 기본 리듬에서 하이햇을 치는 주기는?', o: ['1박','2박','매 박','4박'], a: 2, tip: '기본 8비트에서 하이햇은 매 박(8분음표)입니다.' },
  { q: '코딩 교육에서 스크래치(Scratch)의 개발사는?', o: ['구글','MIT','마이크로소프트','애플'], a: 1, tip: 'MIT 미디어랩에서 개발한 블록 코딩 도구입니다.' },
  { q: '문화센터 수강 시 대기자 제도의 의미는?', o: ['무료 청강','정원 초과 시 순번 대기','강사 대기','시설 예약'], a: 1, tip: '정원이 찬 경우 취소 발생 시 순번대로 등록됩니다.' }
];

function showQuizV8() {
  SFX8.play('quiz_right8');
  trackV8Usage('quiz');

  let idx = 0, score = 0, answered = [];

  function renderQ() {
    const q = QUIZ_V8[idx];
    let html = '<div style="margin-bottom:20px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
      '<span style="font-size:12px;color:var(--text-muted)">' + (idx+1) + ' / ' + QUIZ_V8.length + '</span>' +
      '<span style="font-size:13px;font-weight:700;color:#60A5FA">' + score + '점</span></div>' +
      '<div style="background:var(--bar-bg);border-radius:8px;height:6px;overflow:hidden;margin-bottom:20px">' +
      '<div style="height:100%;width:' + Math.round(((idx) / QUIZ_V8.length) * 100) + '%;background:linear-gradient(90deg,#60A5FA,#3B82F6);border-radius:8px;transition:width .3s"></div></div>' +
      '<h4 style="font-size:16px;font-weight:700;color:var(--text-primary);margin-bottom:16px;line-height:1.6">' + q.q + '</h4>' +
      '<div style="display:flex;flex-direction:column;gap:10px">';
    q.o.forEach((opt, oi) => {
      html += '<button class="v8-quiz-opt" data-idx="' + oi + '" style="text-align:left;padding:14px 18px;border-radius:12px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text-primary);font-size:14px;cursor:pointer;transition:all .2s;font-weight:500">' +
        String.fromCharCode(9312 + oi) + ' ' + opt + '</button>';
    });
    html += '</div></div>';
    return html;
  }

  function renderResult() {
    const pct = Math.round((score / QUIZ_V8.length) * 100);
    const grade = pct >= 90 ? 'S' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    const gradeColors = { S: '#F59E0B', A: '#10B981', B: '#60A5FA', C: '#8B5CF6', D: '#EF4444' };
    const gc = gradeColors[grade];
    const msgs = { S: '완벽한 문화센터 박사!', A: '뛰어난 학습자!', B: '좋은 실력이에요!', C: '조금 더 노력해봐요!', D: '기초부터 다시!' };

    let html = '<div style="text-align:center;padding:20px 0">' +
      '<div style="font-size:64px;font-weight:900;color:' + gc + ';margin-bottom:8px">' + grade + '</div>' +
      '<div style="font-size:20px;font-weight:700;color:var(--text-primary);margin-bottom:4px">' + score + ' / ' + QUIZ_V8.length + ' (' + pct + '%)</div>' +
      '<div style="font-size:14px;color:var(--text-secondary);margin-bottom:20px">' + msgs[grade] + '</div>' +
      '<button onclick="document.getElementById(\'v8-modal\').remove()" style="padding:10px 28px;border-radius:10px;border:none;background:linear-gradient(135deg,#60A5FA,#3B82F6);color:#fff;font-weight:700;cursor:pointer;font-size:14px">닫기</button></div>';

    if (grade === 'S') checkAch8('quiz_v8_s');
    checkAch8('quiz_v8_done');
    return html;
  }

  const body = createModal8('&#127891; 문화센터 퀴즈 v8 (15문)', renderQ());

  function attachListeners() {
    body.querySelectorAll('.v8-quiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = parseInt(btn.getAttribute('data-idx'));
        const correct = QUIZ_V8[idx].a === selected;
        if (correct) { score++; SFX8.play('quiz_right8'); }
        else SFX8.play('quiz_wrong8');

        btn.style.background = correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)';
        btn.style.borderColor = correct ? '#10B981' : '#EF4444';
        btn.style.color = correct ? '#10B981' : '#EF4444';

        const correctBtn = body.querySelectorAll('.v8-quiz-opt')[QUIZ_V8[idx].a];
        if (!correct && correctBtn) {
          correctBtn.style.background = 'rgba(16,185,129,0.15)';
          correctBtn.style.borderColor = '#10B981';
          correctBtn.style.color = '#10B981';
        }

        const tipEl = ce('div', { style: {
          marginTop:'12px',padding:'10px 14px',borderRadius:'10px',
          background:'rgba(96,165,250,0.08)',border:'1px solid rgba(96,165,250,0.15)',
          fontSize:'12px',color:'#60A5FA'
        }}, '&#128161; ' + QUIZ_V8[idx].tip);
        btn.parentNode.appendChild(tipEl);

        body.querySelectorAll('.v8-quiz-opt').forEach(b => b.style.pointerEvents = 'none');

        setTimeout(() => {
          idx++;
          if (idx < QUIZ_V8.length) {
            body.innerHTML = renderQ();
            attachListeners();
          } else {
            body.innerHTML = renderResult();
          }
        }, 1800);
      });
    });
  }
  attachListeners();
}

// ═══════════════════════════════════════════════════════════════════
// 업적 v8 (+12, 54→66)
// ═══════════════════════════════════════════════════════════════════
const ACHIEVEMENTS_V8 = [
  { id: 'recommend_first', name: '추천 탐험가', desc: '수강 추천 엔진 첫 사용', icon: '&#129302;' },
  { id: 'cert_gen', name: '증명서 생성', desc: '수강 증명서 첫 생성', icon: '&#127891;' },
  { id: 'cert_download', name: '증명서 수집가', desc: '증명서 다운로드', icon: '&#128190;' },
  { id: 'timeline_view', name: '시간 여행자', desc: '활동 타임라인 조회', icon: '&#128197;' },
  { id: 'ranking_view', name: '트렌드 분석가', desc: '인기도 랭킹 조회', icon: '&#128293;' },
  { id: 'community_msg', name: '소통의 달인', desc: '커뮤니티 첫 메시지', icon: '&#128172;' },
  { id: 'community_10', name: '커뮤니티 활동가', desc: '커뮤니티 10회 메시지', icon: '&#128101;' },
  { id: 'streak_7', name: '7일 연속', desc: '7일 연속 학습', icon: '&#128293;' },
  { id: 'streak_30', name: '30일 마스터', desc: '30일 연속 학습', icon: '&#128081;' },
  { id: 'voice_search', name: '음성 검색자', desc: '음성 검색 첫 사용', icon: '&#127908;' },
  { id: 'note_first', name: '노트 작성자', desc: '첫 수강 노트 작성', icon: '&#128196;' },
  { id: 'note_10', name: '필기 마스터', desc: '수강 노트 10편 작성', icon: '&#128214;' },
  { id: 'alert_set', name: '알림 설정자', desc: '강좌 알림 등록', icon: '&#128276;' },
  { id: 'profile_gen', name: '프로필 제작자', desc: '소셜 프로필 카드 생성', icon: '&#128100;' },
  { id: 'quiz_v8_done', name: 'v8 퀴즈 완주', desc: 'v8 퀴즈 15문 완주', icon: '&#127942;' },
  { id: 'quiz_v8_s', name: 'v8 퀴즈 천재', desc: 'v8 퀴즈 S등급', icon: '&#128081;' },
  { id: 'v8_explorer', name: 'v8 탐험가', desc: 'v8 기능 5가지 이상 사용', icon: '&#128640;' },
  { id: 'v8_master', name: 'v8 마스터', desc: 'v8 전체 기능 체험', icon: '&#127775;' }
];

function checkAch8(id) {
  const achieved = lsGet('cc-ach-v8', []);
  if (achieved.includes(id)) return;
  achieved.push(id);
  lsSet('cc-ach-v8', achieved);
  const ach = ACHIEVEMENTS_V8.find(a => a.id === id);
  if (ach) {
    showToast8(ach.icon + ' 업적 달성: ' + ach.name + '!');
  }
}

function trackV8Usage(feature) {
  const used = lsGet('cc-v8-used', []);
  if (!used.includes(feature)) {
    used.push(feature);
    lsSet('cc-v8-used', used);
  }
  if (used.length >= 5) checkAch8('v8_explorer');
  if (used.length >= 10) checkAch8('v8_master');
}

function showAchievementsV8() {
  const achieved = lsGet('cc-ach-v8', []);
  let html = '<div style="margin-bottom:16px;font-size:13px;color:var(--text-secondary)">v8 업적 달성 현황: ' + achieved.length + ' / ' + ACHIEVEMENTS_V8.length + '</div>';
  html += '<div style="background:var(--bar-bg);border-radius:8px;height:10px;overflow:hidden;margin-bottom:20px">' +
    '<div style="height:100%;width:' + Math.round((achieved.length / ACHIEVEMENTS_V8.length) * 100) + '%;background:linear-gradient(90deg,#60A5FA,#3B82F6);border-radius:8px"></div></div>';

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px">';
  ACHIEVEMENTS_V8.forEach(a => {
    const done = achieved.includes(a.id);
    html += '<div style="background:var(--card-bg);border:1px solid ' + (done ? 'rgba(96,165,250,0.3)' : 'var(--card-border)') + ';border-radius:12px;padding:14px;opacity:' + (done ? '1' : '0.5') + '">' +
      '<div style="display:flex;align-items:center;gap:10px">' +
      '<span style="font-size:24px">' + a.icon + '</span>' +
      '<div><div style="font-weight:700;font-size:13px;color:var(--text-primary)">' + a.name + '</div>' +
      '<div style="font-size:11px;color:var(--text-muted)">' + a.desc + '</div></div></div></div>';
  });
  html += '</div>';

  createModal8('&#127942; v8 업적 (' + achieved.length + '/' + ACHIEVEMENTS_V8.length + ')', html);
}

// ═══════════════════════════════════════════════════════════════════
// 퀵 액션 버튼 + 키보드 단축키
// ═══════════════════════════════════════════════════════════════════
function insertQuickActions8() {
  if (document.getElementById('v8-quick-actions')) return;
  const container = qs('.bottom-nav') || qs('#root') || document.body;
  const bar = ce('div', { id: 'v8-quick-actions', style: {
    position:'fixed',top:'60px',left:'10px',display:'flex',flexDirection:'column',gap:'6px',zIndex:'700'
  }});

  const buttons = [
    { label: '&#129302; 추천', fn: showRecommendEngine, key: 'Shift+R' },
    { label: '&#127891; 증명서', fn: showCertificateGen, key: 'Shift+C' },
    { label: '&#128197; 타임라인', fn: showActivityTimeline, key: 'Shift+T' },
    { label: '&#128293; 인기', fn: showPopularityRanking, key: 'Shift+P' },
    { label: '&#128101; 커뮤니티', fn: showCommunity, key: 'Shift+M' },
    { label: '&#128293; 스트릭', fn: showStreakSystem, key: 'Shift+K' },
    { label: '&#127908; 음성', fn: showVoiceSearch, key: 'Shift+V' },
    { label: '&#128196; 노트', fn: showNotes, key: 'Shift+N' },
    { label: '&#128276; 알림', fn: showAlertSystem, key: 'Shift+A' },
    { label: '&#128100; 프로필', fn: showProfileCard, key: 'Shift+F' },
    { label: '&#127891; 퀴즈v8', fn: showQuizV8, key: 'Shift+Q' },
    { label: '&#127942; 업적v8', fn: showAchievementsV8, key: 'Shift+E' }
  ];

  const toggle = ce('button', { onClick: () => {
    const items = bar.querySelectorAll('.v8-qbtn');
    const visible = items[0] && items[0].style.display !== 'none';
    items.forEach(b => b.style.display = visible ? 'none' : 'block');
  }, style: {
    width:'38px',height:'38px',borderRadius:'50%',border:'1px solid rgba(96,165,250,0.4)',
    background:'linear-gradient(135deg,#1E3A5F,#0C1525)',color:'#60A5FA',
    fontSize:'14px',cursor:'pointer',fontWeight:'800',boxShadow:'0 4px 16px rgba(0,0,0,0.3)',zIndex:'701'
  }}, 'v8');
  bar.appendChild(toggle);

  buttons.forEach(b => {
    const btn = ce('button', { className: 'v8-qbtn', onClick: () => { b.fn(); }, style: {
      padding:'6px 10px',borderRadius:'10px',border:'1px solid rgba(96,165,250,0.2)',
      background:'linear-gradient(135deg,rgba(30,58,95,0.9),rgba(12,21,37,0.9))',color:'#60A5FA',
      fontSize:'11px',cursor:'pointer',fontWeight:'600',whiteSpace:'nowrap',display:'none',
      boxShadow:'0 2px 8px rgba(0,0,0,0.3)',backdropFilter:'blur(8px)',textAlign:'left'
    }}, b.label);
    bar.appendChild(btn);
  });

  container.parentNode.insertBefore(bar, container.nextSibling);
}

function initKeyboard8() {
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    if (!e.shiftKey) return;

    const map = {
      'R': showRecommendEngine,
      'C': showCertificateGen,
      'T': showActivityTimeline,
      'P': showPopularityRanking,
      'M': showCommunity,
      'K': showStreakSystem,
      'V': showVoiceSearch,
      'N': showNotes,
      'A': showAlertSystem,
      'F': showProfileCard,
      'Q': showQuizV8,
      'E': showAchievementsV8
    };

    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
    }
  });
}

// CSS
function injectV8Styles() {
  if (document.getElementById('v8-styles')) return;
  const style = ce('style', { id: 'v8-styles' });
  style.textContent = '@keyframes v8SlideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}' +
    '@keyframes v8SlideUp{from{transform:translateY(0);opacity:1}to{transform:translateY(-20px);opacity:0}}' +
    '@keyframes v8FadeIn{from{opacity:0}to{opacity:1}}' +
    '@keyframes v8SlideRight{from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}}' +
    '@keyframes v8Pulse{0%,100%{opacity:1}50%{opacity:0.5}}' +
    '.v8-rec-card:hover{border-color:var(--accent)!important;transform:translateY(-2px)}' +
    '.v8-member-card:hover{border-color:var(--accent)!important;transform:translateY(-2px)}' +
    '#v8-modal::-webkit-scrollbar{width:6px}#v8-modal::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:3px}' +
    '@media(max-width:480px){#v8-quick-actions{top:auto;bottom:70px;left:6px}.v8-qbtn{font-size:10px!important;padding:5px 8px!important}}';
  document.head.appendChild(style);
}

// 초기화
function init8() {
  injectV8Styles();
  setTimeout(() => {
    insertQuickActions8();
    initKeyboard8();

    const streakData = lsGet('cc-streak-v8', { current: 0, best: 0, dates: [], lastDate: '' });
    const today = fmtDate8();
    if (streakData.lastDate !== today) {
      if (streakData.lastDate === fmtDate8(new Date(Date.now() - 86400000))) {
        streakData.current++;
      } else {
        streakData.current = 1;
      }
      streakData.lastDate = today;
      if (!streakData.dates.includes(today)) streakData.dates.push(today);
      if (streakData.current > streakData.best) streakData.best = streakData.current;
      lsSet('cc-streak-v8', streakData);
      if (streakData.current > 1) {
        showToast8('&#128293; ' + streakData.current + '일 연속 학습 중!', 3000);
      }
    }
  }, 3000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init8);
} else {
  init8();
}

})();
