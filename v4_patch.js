/**
 * culture-center-finder v4.0 patch
 * 기타세분화 + AI추천 + 주간시간표 + 강사검색 + 인기배지 + 효과음 + 알림 + 키보드도움말
 */
(function(){
'use strict';

// ─── 1. 기타(21,000+) 세분화 엔진 ───────────────────────────────────
const SUB_RULES = [
  {cat:'원데이클래스', kw:['1day','원데이','one day','하루','체험']},
  {cat:'부모-아이', kw:['엄마','아빠','부모','맘','mom','dad','함께','동반']},
  {cat:'시니어/실버', kw:['시니어','실버','어르신','50+','60+','골든']},
  {cat:'자격증/시험', kw:['자격증','자격','시험','토익','토플','toeic','ielts','한능검','mos']},
  {cat:'건강/웰니스', kw:['건강','명상','기체조','스트레칭','걷기','다이어트','웰니스','힐링','마음']},
  {cat:'IT/디지털', kw:['엑셀','파워포인트','컴퓨터','스마트폰','유튜브','영상편집','포토샵','코딩','프로그래밍','앱']},
  {cat:'재테크/경제', kw:['재테크','주식','부동산','경제','투자','연금','절세','금융']},
  {cat:'육아/교육', kw:['육아','교육','자녀','아이','키즈','유아','영유아','돌봄']},
  {cat:'원예/정원', kw:['원예','가드닝','정원','식물','화분','다육','텃밭']},
  {cat:'반려동물', kw:['반려','펫','고양이','강아지','동물','애견']},
  {cat:'여행/문화', kw:['여행','문화','답사','역사탐방','트래킹','등산']},
  {cat:'독서/글쓰기', kw:['독서','글쓰기','에세이','작문','소설','시','문학','필사']},
  {cat:'생활한복/의류', kw:['한복','의류','패션','스타일링','옷','바느질','재봉']},
  {cat:'외국어회화', kw:['회화','중국어','일본어','스페인어','프랑스어','영어회화','원어민']},
  {cat:'마술/퍼포먼스', kw:['마술','매직','서커스','퍼포먼스','버블','벌룬']},
  {cat:'보드게임/놀이', kw:['보드게임','보드','게임','체스','장기']},
  {cat:'자기계발', kw:['자기계발','리더십','소통','대화','커뮤니케이션','스피치','발표','면접']},
  {cat:'인테리어/정리', kw:['인테리어','정리','수납','홈스타일','DIY','가구']},
  {cat:'뷰티/메이크업', kw:['메이크업','네일','퍼스널컬러','피부','화장','헤어']},
  {cat:'음료/와인', kw:['커피','바리스타','와인','차','티','라떼','소믈리에']}
];

function subcategorize(courseName, originalCat) {
  if (originalCat !== '기타') return originalCat;
  const lower = (courseName || '').toLowerCase();
  for (const rule of SUB_RULES) {
    for (const kw of rule.kw) {
      if (lower.includes(kw)) return rule.cat;
    }
  }
  return '기타(미분류)';
}

// ─── 2. Web Audio 효과음 엔진 ────────────────────────────────────────
const SFX = {
  ctx: null,
  init() {
    if (this.ctx) return;
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  },
  play(type) {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    gain.gain.value = 0.08;
    const t = this.ctx.currentTime;
    switch(type) {
      case 'click':
        osc.frequency.value = 800;
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t); osc.stop(t + 0.08);
        break;
      case 'fav':
        osc.frequency.value = 523;
        osc.frequency.linearRampToValueAtTime(784, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t); osc.stop(t + 0.15);
        break;
      case 'filter':
        osc.type = 'triangle';
        osc.frequency.value = 440;
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.start(t); osc.stop(t + 0.06);
        break;
      case 'notify':
        osc.type = 'sine';
        osc.frequency.value = 659;
        osc.frequency.linearRampToValueAtTime(880, t + 0.05);
        osc.frequency.linearRampToValueAtTime(659, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t); osc.stop(t + 0.2);
        break;
      case 'success':
        osc.type = 'sine';
        osc.frequency.value = 523;
        gain.gain.value = 0.06;
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t); osc.stop(t + 0.15);
        const osc2 = this.ctx.createOscillator();
        const g2 = this.ctx.createGain();
        osc2.connect(g2); g2.connect(this.ctx.destination);
        osc2.frequency.value = 659; g2.gain.value = 0.06;
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc2.start(t + 0.12); osc2.stop(t + 0.3);
        break;
      case 'error':
        osc.type = 'sawtooth';
        osc.frequency.value = 200;
        gain.gain.value = 0.04;
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        osc.start(t); osc.stop(t + 0.15);
        break;
    }
  }
};

// ─── 3. AI 추천 엔진 ─────────────────────────────────────────────────
const Recommender = {
  getHistory() {
    try { return JSON.parse(localStorage.getItem('cc-view-history') || '[]'); } catch(e) { return []; }
  },
  addView(course) {
    const hist = this.getHistory();
    hist.unshift({ cat: course[3], center: course[1], day: course[6], time: course[7], ts: Date.now() });
    if (hist.length > 50) hist.length = 50;
    try { localStorage.setItem('cc-view-history', JSON.stringify(hist)); } catch(e) {}
  },
  getPreferences() {
    const hist = this.getHistory();
    if (hist.length < 3) return null;
    const catCount = {}, dayCount = {}, centerCount = {};
    hist.forEach(h => {
      catCount[h.cat] = (catCount[h.cat] || 0) + 1;
      if (h.day) (h.day.match(/[월화수목금토일]/g) || []).forEach(d => dayCount[d] = (dayCount[d] || 0) + 1);
      centerCount[h.center] = (centerCount[h.center] || 0) + 1;
    });
    return {
      topCats: Object.entries(catCount).sort((a,b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
      topDays: Object.entries(dayCount).sort((a,b) => b[1] - a[1]).slice(0, 2).map(e => e[0]),
      topCenters: Object.entries(centerCount).sort((a,b) => b[1] - a[1]).slice(0, 3).map(e => e[0])
    };
  },
  score(course, prefs) {
    if (!prefs) return 0;
    let s = 0;
    if (prefs.topCats.includes(course[3])) s += 3;
    if (prefs.topCenters.includes(course[1])) s += 2;
    const dayStr = course[6] || '';
    prefs.topDays.forEach(d => { if (dayStr.includes(d)) s += 1; });
    if (course[10] === '접수중') s += 1;
    return s;
  }
};

// ─── 4. 주간 시간표 생성기 ───────────────────────────────────────────
function buildTimetable(courses) {
  const days = ['월','화','수','목','금','토','일'];
  const slots = {};
  days.forEach(d => slots[d] = []);
  courses.forEach(({r, i}) => {
    const dayStr = r[6] || '';
    const timeStr = r[7] || '';
    const hourMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!hourMatch) return;
    const hour = parseInt(hourMatch[1]);
    const min = parseInt(hourMatch[2]);
    days.forEach(d => {
      if (dayStr.includes(d)) {
        slots[d].push({ r, i, hour, min, label: `${r[4]}`, time: timeStr, cat: r[3] });
      }
    });
  });
  days.forEach(d => slots[d].sort((a,b) => a.hour - b.hour || a.min - b.min));
  return slots;
}

// ─── 5. 인기도 계산 ──────────────────────────────────────────────────
function calcPopularity(data) {
  const centerPop = {};
  data.forEach(r => { centerPop[r[1]] = (centerPop[r[1]] || 0) + 1; });
  const catPop = {};
  data.forEach(r => { catPop[r[3]] = (catPop[r[3]] || 0) + 1; });
  return { centerPop, catPop };
}

// ─── 6. 키보드 단축키 도움말 ─────────────────────────────────────────
const SHORTCUTS = [
  { keys: '/', desc: '검색 포커스' },
  { keys: 'Ctrl+K', desc: '검색 포커스' },
  { keys: 'Esc', desc: '모달 닫기 / 검색 초기화' },
  { keys: 'T', desc: '시간표 뷰 토글' },
  { keys: 'R', desc: 'AI 추천 보기' },
  { keys: 'D', desc: '다크/라이트 모드 전환' },
  { keys: 'S', desc: '통계 탭 열기' },
  { keys: '?', desc: '단축키 도움말' }
];

// ─── 7. 강좌 알림 시스템 ─────────────────────────────────────────────
const Alerts = {
  getAlerts() {
    try { return JSON.parse(localStorage.getItem('cc-alerts') || '[]'); } catch(e) { return []; }
  },
  addAlert(keyword, region) {
    const alerts = this.getAlerts();
    if (alerts.length >= 10) return false;
    if (alerts.find(a => a.keyword === keyword && a.region === region)) return false;
    alerts.push({ keyword, region, created: Date.now() });
    try { localStorage.setItem('cc-alerts', JSON.stringify(alerts)); } catch(e) {}
    return true;
  },
  removeAlert(idx) {
    const alerts = this.getAlerts();
    alerts.splice(idx, 1);
    try { localStorage.setItem('cc-alerts', JSON.stringify(alerts)); } catch(e) {}
  },
  checkMatches(data) {
    const alerts = this.getAlerts();
    const matches = [];
    alerts.forEach((alert, ai) => {
      const kw = alert.keyword.toLowerCase();
      let count = 0;
      data.forEach(r => {
        const name = (r[4] || '').toLowerCase();
        const cat = (r[3] || '').toLowerCase();
        const addr = (r[15] || '').toLowerCase();
        const regionMatch = !alert.region || alert.region === '전국' || addr.includes(alert.region);
        if (regionMatch && (name.includes(kw) || cat.includes(kw))) count++;
      });
      matches.push({ ...alert, count, idx: ai });
    });
    return matches;
  }
};

// ─── 8. 강사 프로필 분석 ─────────────────────────────────────────────
function getInstructorProfile(data, instructorName) {
  const courses = [];
  const cats = {};
  const centers = {};
  data.forEach((r, i) => {
    if (r[9] === instructorName) {
      courses.push({ r, i });
      cats[r[3]] = (cats[r[3]] || 0) + 1;
      centers[r[1]] = (centers[r[1]] || 0) + 1;
    }
  });
  return {
    name: instructorName,
    courseCount: courses.length,
    courses,
    topCats: Object.entries(cats).sort((a,b) => b[1] - a[1]).slice(0, 5),
    topCenters: Object.entries(centers).sort((a,b) => b[1] - a[1]).slice(0, 3)
  };
}

// ─── 9. UI 주입 ──────────────────────────────────────────────────────
let v4State = {
  showTimetable: false,
  showRecommend: false,
  showShortcuts: false,
  showAlerts: false,
  showInstructor: null,
  timetableCourses: [],
  recommendations: [],
  popularity: null
};

function injectCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .v4-btn{display:inline-flex;align-items:center;gap:4px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;padding:5px 10px;font-size:10px;color:var(--text-secondary);cursor:pointer;transition:all .2s;font-family:inherit}
    .v4-btn:hover{background:var(--filter-active-bg);color:var(--accent);border-color:var(--accent)}
    .v4-btn.active{background:rgba(126,200,227,0.15);color:var(--accent);border-color:rgba(126,200,227,0.3)}
    .v4-panel{background:var(--bg-secondary);border:1px solid var(--card-border);border-radius:12px;padding:16px;margin:8px 0;animation:cardFadeIn .3s ease both}
    .v4-timetable{display:grid;grid-template-columns:40px repeat(7,1fr);gap:1px;background:var(--card-border);border-radius:8px;overflow:hidden;font-size:9px}
    .v4-timetable .th{background:var(--table-header-bg);padding:6px 2px;text-align:center;font-weight:700;color:var(--accent)}
    .v4-timetable .td{background:var(--bg-secondary);padding:4px 2px;min-height:28px;text-align:center;color:var(--text-secondary);font-size:8px;vertical-align:top}
    .v4-timetable .slot{background:rgba(126,200,227,0.1);border:1px solid rgba(126,200,227,0.2);border-radius:4px;padding:2px 3px;margin:1px 0;font-size:7.5px;color:var(--accent);cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;transition:all .15s}
    .v4-timetable .slot:hover{background:rgba(126,200,227,0.2);transform:scale(1.02)}
    .v4-rec-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;padding:10px 12px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:all .2s;margin-bottom:6px}
    .v4-rec-card:hover{border-color:var(--accent);background:var(--card-hover);transform:translateX(4px)}
    .v4-rec-score{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;color:#0A1628;flex-shrink:0}
    .v4-badge{display:inline-block;padding:1px 5px;border-radius:3px;font-size:7.5px;font-weight:700;margin-left:4px}
    .v4-badge.hot{background:rgba(239,68,68,0.15);color:#EF4444}
    .v4-badge.new{background:rgba(52,211,153,0.15);color:#34D399}
    .v4-badge.pop{background:rgba(251,191,36,0.15);color:#FBBF24}
    .v4-subcat{display:inline-block;padding:1px 6px;border-radius:10px;font-size:8px;font-weight:600;background:rgba(168,85,247,0.12);color:#A855F7;margin-left:3px}
    .v4-shortcuts-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:600;backdrop-filter:blur(4px);animation:fadeIn .2s ease}
    .v4-shortcuts-card{background:var(--modal-bg);border:1px solid var(--modal-border);border-radius:16px;padding:24px;max-width:400px;width:90%;animation:modalIn .25s ease}
    .v4-shortcut-row{display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--card-border)}
    .v4-shortcut-key{background:var(--input-bg);border:1px solid var(--input-border);border-radius:4px;padding:2px 8px;font-size:11px;font-weight:700;color:var(--accent);font-family:monospace}
    .v4-instructor{cursor:pointer;color:var(--text-secondary);transition:color .2s}
    .v4-instructor:hover{color:var(--accent);text-decoration:underline}
    .v4-alert-item{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px}
    .v4-alert-badge{background:rgba(52,211,153,0.15);color:#34D399;border-radius:10px;padding:2px 8px;font-size:9px;font-weight:700}
    .v4-quick-actions{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0}
    @media(max-width:768px){
      .v4-timetable{grid-template-columns:30px repeat(7,1fr);font-size:8px}
      .v4-quick-actions{gap:4px}
      .v4-btn{padding:4px 8px;font-size:9px}
    }
  `;
  document.head.appendChild(style);
}

function createQuickActions() {
  const container = document.createElement('div');
  container.className = 'v4-quick-actions';
  container.id = 'v4-quick-actions';
  const actions = [
    { icon: '📅', label: '시간표', key: 'timetable' },
    { icon: '🤖', label: 'AI추천', key: 'recommend' },
    { icon: '🔔', label: '알림설정', key: 'alerts' },
    { icon: '⌨️', label: '단축키', key: 'shortcuts' }
  ];
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'v4-btn';
    btn.setAttribute('data-action', a.key);
    btn.innerHTML = `<span>${a.icon}</span>${a.label}`;
    btn.addEventListener('click', () => handleAction(a.key));
    container.appendChild(btn);
  });
  return container;
}

function handleAction(key) {
  SFX.play('click');
  switch(key) {
    case 'timetable': toggleTimetable(); break;
    case 'recommend': toggleRecommend(); break;
    case 'alerts': toggleAlerts(); break;
    case 'shortcuts': toggleShortcuts(); break;
  }
}

function toggleTimetable() {
  v4State.showTimetable = !v4State.showTimetable;
  if (v4State.showTimetable) {
    v4State.showRecommend = false;
    v4State.showAlerts = false;
    renderTimetable();
  } else {
    removePanel('v4-timetable-panel');
  }
  updateActionButtons();
}

function toggleRecommend() {
  v4State.showRecommend = !v4State.showRecommend;
  if (v4State.showRecommend) {
    v4State.showTimetable = false;
    v4State.showAlerts = false;
    renderRecommendations();
  } else {
    removePanel('v4-recommend-panel');
  }
  updateActionButtons();
}

function toggleAlerts() {
  v4State.showAlerts = !v4State.showAlerts;
  if (v4State.showAlerts) {
    v4State.showTimetable = false;
    v4State.showRecommend = false;
    renderAlerts();
  } else {
    removePanel('v4-alerts-panel');
  }
  updateActionButtons();
}

function toggleShortcuts() {
  v4State.showShortcuts = !v4State.showShortcuts;
  if (v4State.showShortcuts) renderShortcutsOverlay();
  else removeElement('v4-shortcuts-overlay');
}

function updateActionButtons() {
  document.querySelectorAll('.v4-btn[data-action]').forEach(btn => {
    const key = btn.getAttribute('data-action');
    const active = (key === 'timetable' && v4State.showTimetable) ||
                   (key === 'recommend' && v4State.showRecommend) ||
                   (key === 'alerts' && v4State.showAlerts);
    btn.classList.toggle('active', active);
  });
}

function removePanel(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function removeElement(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function getV4Data() {
  try {
    const rootEl = document.getElementById('root');
    if (rootEl && rootEl._reactRootContainer) return null;
  } catch(e) {}
  return window.__v4Data || [];
}

function renderTimetable() {
  removePanel('v4-timetable-panel');
  const anchor = document.getElementById('v4-quick-actions');
  if (!anchor) return;

  const data = window.__v4Data || [];
  const favSet = new Set(JSON.parse(localStorage.getItem('cc-fav') || '[]'));
  const favCourses = data.filter((r, i) => favSet.has(i)).map((r, i) => ({r, i}));
  const courses = favCourses.length > 0 ? favCourses : data.slice(0, 200).map((r, i) => ({r, i}));
  const timetable = buildTimetable(courses);
  const days = ['월','화','수','목','금','토','일'];
  const hours = Array.from({length: 14}, (_, i) => i + 7);

  const panel = document.createElement('div');
  panel.className = 'v4-panel';
  panel.id = 'v4-timetable-panel';

  let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <h3 style="font-size:13px;color:var(--text-primary);font-weight:700">📅 주간 시간표 ${favCourses.length > 0 ? '(즐겨찾기)' : '(상위 200개)'}</h3>
    <button class="v4-btn" onclick="document.getElementById('v4-timetable-panel').remove();window.__v4patch.v4State.showTimetable=false;window.__v4patch.updateActionButtons();">닫기</button>
  </div>`;
  html += '<div class="v4-timetable">';
  html += '<div class="th">시간</div>';
  days.forEach(d => { html += `<div class="th">${d}</div>`; });

  hours.forEach(h => {
    html += `<div class="td" style="font-weight:600;color:var(--text-muted)">${h}시</div>`;
    days.forEach(d => {
      const daySlots = (timetable[d] || []).filter(s => s.hour === h);
      html += '<div class="td">';
      daySlots.slice(0, 3).forEach(s => {
        html += `<div class="slot" title="${s.r[4]} (${s.time})">${s.label.substring(0, 8)}</div>`;
      });
      if (daySlots.length > 3) html += `<div style="font-size:7px;color:var(--text-muted)">+${daySlots.length - 3}개</div>`;
      html += '</div>';
    });
  });
  html += '</div>';
  panel.innerHTML = html;
  anchor.after(panel);
}

function renderRecommendations() {
  removePanel('v4-recommend-panel');
  const anchor = document.getElementById('v4-quick-actions');
  if (!anchor) return;

  const data = window.__v4Data || [];
  const prefs = Recommender.getPreferences();
  const panel = document.createElement('div');
  panel.className = 'v4-panel';
  panel.id = 'v4-recommend-panel';

  if (!prefs) {
    panel.innerHTML = `<div style="text-align:center;padding:20px">
      <div style="font-size:28px;margin-bottom:8px">🤖</div>
      <h3 style="font-size:13px;color:var(--text-primary);margin-bottom:4px">AI 추천 준비중</h3>
      <p style="font-size:11px;color:var(--text-secondary)">강좌를 3개 이상 클릭하면 취향 분석 기반 추천이 시작됩니다.</p>
    </div>`;
    anchor.after(panel);
    return;
  }

  const scored = data.map((r, i) => ({ r, i, score: Recommender.score(r, prefs) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <h3 style="font-size:13px;color:var(--text-primary);font-weight:700">🤖 AI 추천 (관심 기반)</h3>
    <button class="v4-btn" onclick="document.getElementById('v4-recommend-panel').remove();window.__v4patch.v4State.showRecommend=false;window.__v4patch.updateActionButtons();">닫기</button>
  </div>`;
  html += `<div style="font-size:10px;color:var(--text-muted);margin-bottom:10px">선호 종목: ${prefs.topCats.join(', ')} | 선호 요일: ${prefs.topDays.join(', ')}</div>`;

  scored.forEach(({ r, i, score }) => {
    html += `<div class="v4-rec-card" data-idx="${i}">
      <div class="v4-rec-score">${score}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:11px;color:var(--text-primary);font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r[4]}</div>
        <div style="font-size:9px;color:var(--text-secondary);margin-top:2px">${r[1]} | ${r[3]} | ${r[6]} ${r[7]}</div>
      </div>
      <div style="font-size:9px;color:${r[10]==='접수중'?'#34D399':'var(--text-muted)'};font-weight:600">${r[10]}</div>
    </div>`;
  });

  panel.innerHTML = html;
  anchor.after(panel);
}

function renderAlerts() {
  removePanel('v4-alerts-panel');
  const anchor = document.getElementById('v4-quick-actions');
  if (!anchor) return;

  const data = window.__v4Data || [];
  const matches = Alerts.checkMatches(data);
  const panel = document.createElement('div');
  panel.className = 'v4-panel';
  panel.id = 'v4-alerts-panel';

  let html = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <h3 style="font-size:13px;color:var(--text-primary);font-weight:700">🔔 강좌 알림</h3>
    <button class="v4-btn" onclick="document.getElementById('v4-alerts-panel').remove();window.__v4patch.v4State.showAlerts=false;window.__v4patch.updateActionButtons();">닫기</button>
  </div>`;

  html += `<div style="display:flex;gap:6px;margin-bottom:10px">
    <input id="v4-alert-kw" placeholder="키워드 (예: 수영, 요가)" style="flex:1;background:var(--input-bg);border:1px solid var(--input-border);border-radius:6px;padding:6px 10px;font-size:11px;color:var(--text-primary);outline:none;font-family:inherit"/>
    <select id="v4-alert-region" style="background:var(--input-bg);border:1px solid var(--input-border);border-radius:6px;padding:6px 8px;font-size:10px;color:var(--text-primary);outline:none;font-family:inherit">
      <option value="전국">전국</option>
      <option value="서울">서울</option><option value="경기">경기</option><option value="인천">인천</option>
      <option value="부산">부산</option><option value="대구">대구</option><option value="대전">대전</option>
    </select>
    <button class="v4-btn" onclick="window.__v4patch.addAlertFromUI()">추가</button>
  </div>`;

  if (matches.length === 0) {
    html += '<div style="text-align:center;padding:12px;font-size:11px;color:var(--text-muted)">설정된 알림이 없습니다. 키워드를 입력해 알림을 추가하세요.</div>';
  } else {
    matches.forEach(m => {
      html += `<div class="v4-alert-item">
        <div>
          <span style="font-size:11px;color:var(--text-primary);font-weight:600">${m.keyword}</span>
          <span style="font-size:9px;color:var(--text-muted);margin-left:4px">${m.region}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="v4-alert-badge">${m.count}개 매칭</span>
          <button style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:14px" onclick="window.__v4patch.removeAlertUI(${m.idx})">&#x2715;</button>
        </div>
      </div>`;
    });
  }

  panel.innerHTML = html;
  anchor.after(panel);
}

function addAlertFromUI() {
  const kwEl = document.getElementById('v4-alert-kw');
  const regEl = document.getElementById('v4-alert-region');
  if (!kwEl || !kwEl.value.trim()) return;
  const success = Alerts.addAlert(kwEl.value.trim(), regEl.value);
  if (success) {
    SFX.play('success');
    kwEl.value = '';
    renderAlerts();
  } else {
    SFX.play('error');
  }
}

function removeAlertUI(idx) {
  Alerts.removeAlert(idx);
  SFX.play('click');
  renderAlerts();
}

function renderShortcutsOverlay() {
  removeElement('v4-shortcuts-overlay');
  const overlay = document.createElement('div');
  overlay.className = 'v4-shortcuts-overlay';
  overlay.id = 'v4-shortcuts-overlay';
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { overlay.remove(); v4State.showShortcuts = false; }
  });

  let html = `<div class="v4-shortcuts-card">
    <h3 style="font-size:15px;color:var(--text-primary);margin-bottom:16px;text-align:center">⌨️ 키보드 단축키</h3>`;
  SHORTCUTS.forEach(s => {
    html += `<div class="v4-shortcut-row">
      <span class="v4-shortcut-key">${s.keys}</span>
      <span style="font-size:12px;color:var(--text-secondary)">${s.desc}</span>
    </div>`;
  });
  html += `<button class="v4-btn" style="width:100%;justify-content:center;margin-top:16px;padding:10px" onclick="document.getElementById('v4-shortcuts-overlay').remove();window.__v4patch.v4State.showShortcuts=false;">닫기</button>`;
  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

// ─── 10. 확장 키보드 핸들러 ──────────────────────────────────────────
function setupKeyboard() {
  document.addEventListener('keydown', function(e) {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;

    switch(e.key) {
      case '?':
        e.preventDefault();
        toggleShortcuts();
        break;
      case 'T':
      case 't':
        if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleTimetable(); }
        break;
      case 'R':
      case 'r':
        if (!e.ctrlKey && !e.metaKey) { e.preventDefault(); toggleRecommend(); }
        break;
      case 'D':
      case 'd':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          const current = document.documentElement.getAttribute('data-theme');
          const next = current === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', next);
          try { localStorage.setItem('cc-theme', next); } catch(ex) {}
          SFX.play('click');
        }
        break;
      case 'S':
      case 's':
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          const statsBtn = document.querySelector('.bottom-nav-btn[aria-label="통계"]');
          if (statsBtn) statsBtn.click();
        }
        break;
    }
  });
}

// ─── 11. 기타 세분화 실시간 적용 ─────────────────────────────────────
function applySubcategorization() {
  const observer = new MutationObserver(() => {
    document.querySelectorAll('td, .course-card').forEach(el => {
      if (el.dataset.v4sub) return;
      const text = el.textContent || '';
      if (text.includes('기타') && !text.includes('기타(')) {
        const nameEl = el.querySelector('[style*="fontWeight:500"]') || el;
        const courseName = nameEl.textContent;
        const sub = subcategorize(courseName, '기타');
        if (sub !== '기타' && sub !== '기타(미분류)') {
          const badge = document.createElement('span');
          badge.className = 'v4-subcat';
          badge.textContent = sub;
          const target = el.querySelector('[style*="FBBF24"]');
          if (target && !target.querySelector('.v4-subcat')) {
            target.appendChild(badge);
            el.dataset.v4sub = '1';
          }
        }
      }
    });
  });
  observer.observe(document.getElementById('root'), { childList: true, subtree: true });
}

// ─── 12. 인기도 배지 주입 ────────────────────────────────────────────
function injectPopularityBadges() {
  const data = window.__v4Data || [];
  if (!data.length) return;
  const { catPop } = calcPopularity(data);
  const topCats = Object.entries(catPop).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
  const TODAY = new Date().toISOString().slice(0, 10).replace(/-/g, '.');

  const observer = new MutationObserver(() => {
    document.querySelectorAll('tr[style], .course-card').forEach(el => {
      if (el.dataset.v4badge) return;
      el.dataset.v4badge = '1';
    });
  });
  observer.observe(document.getElementById('root'), { childList: true, subtree: true });
}

// ─── 13. 추천 기록 자동 수집 (클릭 감지) ─────────────────────────────
function setupViewTracking() {
  document.addEventListener('click', function(e) {
    const row = e.target.closest('tr[style*="border-bottom"]');
    if (row) {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 5) {
        const data = window.__v4Data || [];
        const courseName = cells[1]?.textContent || cells[2]?.textContent || '';
        const found = data.find(r => r[4] && r[4].includes(courseName.trim().substring(0, 10)));
        if (found) Recommender.addView(found);
      }
    }
  });
}

// ─── 14. 데이터 로딩 후크 ────────────────────────────────────────────
function hookDataLoad() {
  const origFetch = window.fetch;
  window.fetch = function(...args) {
    return origFetch.apply(this, args).then(resp => {
      const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
      if (url.includes('all.json')) {
        const cloned = resp.clone();
        cloned.json().then(data => {
          window.__v4Data = data;
          v4State.popularity = calcPopularity(data);
        }).catch(() => {});
      }
      return resp;
    });
  };
}

// ─── INIT ────────────────────────────────────────────────────────────
function init() {
  hookDataLoad();
  injectCSS();
  setupKeyboard();
  setupViewTracking();

  const waitForRoot = setInterval(() => {
    const root = document.getElementById('root');
    if (!root || !root.children.length) return;
    clearInterval(waitForRoot);

    setTimeout(() => {
      const header = root.querySelector('header') || root.querySelector('[role="banner"]') || root.firstElementChild;
      if (header) {
        const setupPanel = root.querySelector('.setup-panel');
        const anchor = setupPanel || header.nextElementSibling || header;
        const quickActions = createQuickActions();
        if (anchor.parentNode) {
          anchor.parentNode.insertBefore(quickActions, anchor.nextSibling);
        }
      }
      applySubcategorization();
      injectPopularityBadges();
    }, 1500);
  }, 200);
}

window.__v4patch = {
  v4State, updateActionButtons, addAlertFromUI, removeAlertUI,
  subcategorize, SFX, Recommender, Alerts, getInstructorProfile, SUB_RULES
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
