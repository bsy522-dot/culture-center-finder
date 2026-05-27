/**
 * culture-center-finder v6.0 patch
 * 커리큘럼로드맵+센터비교대시보드+시즌추천+월간캘린더+리뷰인사이트+D-Day카운트다운+성향테스트+주간다이제스트+종목백과사전+퀴즈15문추가(15→30)+업적12추가(30→42)+SFX6종
 */
(function(){
'use strict';

const V6_ID = 'ccf-v6-patch';
if (document.getElementById(V6_ID)) return;
const marker = document.createElement('meta');
marker.id = V6_ID;
document.head.appendChild(marker);

// ─── 유틸 ──────────────────────────────────────────────────────────
function qs(s, p) { return (p || document).querySelector(s); }
function ce(tag, attrs, children) {
  const el = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k === 'className') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  });
  if (children) {
    if (typeof children === 'string') el.innerHTML = children;
    else if (Array.isArray(children)) children.forEach(c => { if (c) el.appendChild(c); });
    else el.appendChild(children);
  }
  return el;
}
function lsGet(k, d) { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch(e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {} }
function showToast(msg, dur) {
  const old = document.getElementById('v6-toast');
  if (old) old.remove();
  const t = ce('div', { id: 'v6-toast', style: {
    position:'fixed',top:'20px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#1E3A5F,#0C1525)',
    border:'1px solid rgba(126,200,227,0.4)',borderRadius:'12px',padding:'10px 20px',zIndex:'900',
    fontSize:'12px',fontWeight:'600',color:'#7EC8E3',boxShadow:'0 8px 32px rgba(0,0,0,0.4)',
    animation:'slideDown .3s ease both',whiteSpace:'nowrap'
  }}, msg);
  document.body.appendChild(t);
  setTimeout(() => { t.style.animation = 'slideUp .3s ease both'; setTimeout(() => t.remove(), 300); }, dur || 2500);
}

// ─── SFX 엔진 (6종 추가) ─────────────────────────────────────────
const SFX6 = {
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
      roadmap:    { freq: 523, type: 'sine', dur: 0.15, vol: 0.12 },
      compare:    { freq: 659, type: 'triangle', dur: 0.12, vol: 0.1 },
      season:     { freq: 440, type: 'sine', dur: 0.2, vol: 0.1 },
      calendar:   { freq: 587, type: 'triangle', dur: 0.15, vol: 0.1 },
      dday:       { freq: 784, type: 'square', dur: 0.08, vol: 0.06 },
      encyclopedia: { freq: 698, type: 'sine', dur: 0.18, vol: 0.1 }
    };
    const p = presets[name] || presets.roadmap;
    o.frequency.value = p.freq;
    o.type = p.type;
    g.gain.setValueAtTime(p.vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + p.dur);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + p.dur);
  }
};

// ─── 1. 커리큘럼 로드맵 ──────────────────────────────────────────
const ROADMAPS = {
  '수영': [
    { level: '입문', title: '물 적응', desc: '수중 호흡, 물놀이, 킥 연습', age: '3~6세', duration: '3개월' },
    { level: '초급', title: '기본 영법', desc: '자유형/배영 기초, 15m 완주', age: '6~10세', duration: '6개월' },
    { level: '중급', title: '4영법 마스터', desc: '자유형/배영/평영/접영 50m', age: '8~15세', duration: '1년' },
    { level: '상급', title: '수영 선수반', desc: '기록 단축, 대회 준비, IM 200m', age: '10세+', duration: '2년+' }
  ],
  '피아노': [
    { level: '입문', title: '음감 놀이', desc: '도레미 인지, 손가락 번호, 간단한 동요', age: '4~7세', duration: '3개월' },
    { level: '초급', title: '바이엘/체르니 100', desc: '악보 읽기, 양손 연주, 기초 스케일', age: '6~12세', duration: '1년' },
    { level: '중급', title: '소나티네/체르니 30', desc: '페달 사용, 다이나믹 표현, 발표회 참가', age: '8~15세', duration: '2년' },
    { level: '상급', title: '소나타/쇼팽', desc: '고급 테크닉, 콩쿠르 준비, 즉흥 연주', age: '12세+', duration: '3년+' }
  ],
  '발레': [
    { level: '입문', title: '프리발레', desc: '스트레칭, 기본 포지션, 음악 감상', age: '4~6세', duration: '3개월' },
    { level: '초급', title: '바 워크', desc: '플리에/텐듀/론드잠 기본 바 동작', age: '6~10세', duration: '6개월' },
    { level: '중급', title: '센터 워크', desc: '피루엣/그랑바트망/점프 조합', age: '8~15세', duration: '2년' },
    { level: '상급', title: '공연반/토슈즈', desc: '토슈즈 착용, 바리에이션, 공연 참가', age: '12세+', duration: '3년+' }
  ],
  '태권도': [
    { level: '입문', title: '흰띠~노랑띠', desc: '기본 서기, 주먹지르기, 앞차기', age: '5~7세', duration: '3개월' },
    { level: '초급', title: '초록띠~파랑띠', desc: '품새 태극 1~4장, 발차기 조합', age: '6~12세', duration: '1년' },
    { level: '중급', title: '빨강띠~품', desc: '태극 5~8장, 겨루기, 격파', age: '8~15세', duration: '2년' },
    { level: '상급', title: '유단자', desc: '고려/금강 품새, 대회, 시범', age: '12세+', duration: '3년+' }
  ],
  '미술': [
    { level: '입문', title: '미술 놀이', desc: '색감 탐구, 자유 드로잉, 다양한 재료 체험', age: '4~6세', duration: '3개월' },
    { level: '초급', title: '기초 드로잉', desc: '선/형태/명암 기초, 정물 스케치', age: '7~12세', duration: '6개월' },
    { level: '중급', title: '수채화/아크릴', desc: '색채론, 구도, 풍경화/인물화', age: '10~16세', duration: '1년' },
    { level: '상급', title: '포트폴리오', desc: '유화, 개인전 준비, 입시 미술', age: '14세+', duration: '2년+' }
  ],
  '요가/필라테스': [
    { level: '입문', title: '기초 스트레칭', desc: '호흡법, 기본 자세 10종, 몸 인식', age: '성인', duration: '1개월' },
    { level: '초급', title: '빈야사 입문', desc: '태양경배, 전사 자세, 나무 자세', age: '성인', duration: '3개월' },
    { level: '중급', title: '아쉬탕가/파워', desc: '역전 자세, 밸런스, 코어 강화', age: '성인', duration: '6개월' },
    { level: '상급', title: '지도자 과정', desc: '해부학, 지도법, 200HR RYT 준비', age: '성인', duration: '1년+' }
  ],
  '코딩/로봇': [
    { level: '입문', title: '언플러그드', desc: '알고리즘 보드게임, 로봇 코딩 체험', age: '5~7세', duration: '3개월' },
    { level: '초급', title: '스크래치/엔트리', desc: '블록 코딩, 간단한 게임/애니메이션', age: '7~12세', duration: '6개월' },
    { level: '중급', title: '파이썬/앱인벤터', desc: '텍스트 코딩, 앱 제작, 데이터 분석', age: '10~16세', duration: '1년' },
    { level: '상급', title: 'AI/대회 준비', desc: '머신러닝 기초, 정보올림피아드', age: '14세+', duration: '2년+' }
  ],
  '영어': [
    { level: '입문', title: '파닉스/놀이영어', desc: 'ABC 노래, 기본 단어, 영어 노래', age: '4~6세', duration: '3개월' },
    { level: '초급', title: '기초 회화', desc: '자기소개, 일상 표현, 리딩 기초', age: '7~12세', duration: '6개월' },
    { level: '중급', title: '영어 독서/토론', desc: '챕터북, 발표, 에세이 쓰기', age: '10~16세', duration: '1년' },
    { level: '상급', title: '시험 준비/원서', desc: 'TOEFL/IELTS, 원서 독해, 디베이트', age: '14세+', duration: '2년+' }
  ]
};

function showRoadmap() {
  SFX6.play('roadmap');
  const overlay = ce('div', { className: 'modal-overlay', style: { zIndex: '150' } });
  const modal = ce('div', { className: 'modal', style: { maxWidth: '700px', maxHeight: '85vh', overflowY: 'auto' } });

  let currentCat = Object.keys(ROADMAPS)[0];

  function render() {
    const levelColors = { '입문': '#60A5FA', '초급': '#34D399', '중급': '#FBBF24', '상급': '#F87171' };
    modal.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
      '<h2 style="margin:0;color:var(--text-primary)">&#x1F4DA; 커리큘럼 로드맵</h2>' +
      '<button id="v6-rm-close" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&#x00D7;</button></div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">' +
      Object.keys(ROADMAPS).map(cat =>
        '<button class="v6-rm-cat" data-cat="' + cat + '" style="padding:5px 14px;border-radius:16px;font-size:11px;font-weight:' +
        (cat === currentCat ? '700' : '500') + ';cursor:pointer;border:1px solid ' +
        (cat === currentCat ? 'rgba(126,200,227,0.4)' : 'var(--card-border)') + ';background:' +
        (cat === currentCat ? 'rgba(126,200,227,0.15)' : 'transparent') + ';color:' +
        (cat === currentCat ? '#7EC8E3' : 'var(--text-muted)') + '">' + cat + '</button>'
      ).join('') + '</div>';

    const steps = ROADMAPS[currentCat] || [];
    let roadHTML = '<div style="position:relative;padding-left:24px">';
    roadHTML += '<div style="position:absolute;left:10px;top:0;bottom:0;width:2px;background:linear-gradient(180deg,#60A5FA,#34D399,#FBBF24,#F87171);border-radius:1px"></div>';
    steps.forEach((step, i) => {
      const c = levelColors[step.level] || '#7EC8E3';
      roadHTML += '<div style="position:relative;margin-bottom:20px;padding:14px 16px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;border-left:3px solid ' + c + '">' +
        '<div style="position:absolute;left:-20px;top:18px;width:12px;height:12px;border-radius:50%;background:' + c + ';border:2px solid var(--bg)"></div>' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
        '<span style="font-size:9px;font-weight:700;color:' + c + ';background:' + c + '18;padding:2px 8px;border-radius:8px">' + step.level + '</span>' +
        '<span style="font-size:9px;color:var(--text-faint)">' + step.duration + '</span></div>' +
        '<div style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:4px">' + step.title + '</div>' +
        '<div style="font-size:11px;color:var(--text-secondary);line-height:1.6;margin-bottom:6px">' + step.desc + '</div>' +
        '<div style="font-size:9px;color:var(--text-muted)">&#x1F464; 대상: ' + step.age + '</div>' +
        '</div>';
    });
    roadHTML += '</div>';
    modal.innerHTML += roadHTML;

    modal.querySelector('#v6-rm-close').onclick = () => overlay.remove();
    modal.querySelectorAll('.v6-rm-cat').forEach(btn => {
      btn.onclick = () => { currentCat = btn.dataset.cat; render(); };
    });
  }
  render();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  checkAchievement('roadmap_user');
}

// ─── 2. 센터 비교 대시보드 ──────────────────────────────────────
function showCenterCompare() {
  SFX6.play('compare');
  const overlay = ce('div', { className: 'modal-overlay', style: { zIndex: '150' } });
  const modal = ce('div', { className: 'modal', style: { maxWidth: '800px', maxHeight: '85vh', overflowY: 'auto' } });

  const allData = getAllData();
  const centerMap = {};
  allData.forEach(r => {
    const name = r[1];
    if (!centerMap[name]) centerMap[name] = { courses: [], programs: new Set(), days: {}, prices: [] };
    centerMap[name].courses.push(r);
    centerMap[name].programs.add(r[3]);
    const day = r[6] || '';
    ['월','화','수','목','금','토','일'].forEach(d => { if (day.includes(d)) centerMap[name].days[d] = (centerMap[name].days[d] || 0) + 1; });
    const price = parseInt((r[8] || '').replace(/,/g, '').match(/(\d+)/)?.[1] || '0');
    if (price > 0) centerMap[name].prices.push(price);
  });

  const centerNames = Object.keys(centerMap).sort((a, b) => centerMap[b].courses.length - centerMap[a].courses.length);
  let selected = centerNames.slice(0, Math.min(3, centerNames.length));

  function render() {
    modal.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<h2 style="margin:0;color:var(--text-primary)">&#x1F3E2; 센터 비교 대시보드</h2>' +
      '<button id="v6-cc-close" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&#x00D7;</button></div>' +
      '<div style="margin-bottom:12px"><select id="v6-cc-sel1" style="background:var(--input-bg);color:var(--text-primary);border:1px solid var(--input-border);border-radius:6px;padding:5px 8px;font-size:11px;margin-right:6px;max-width:200px">' +
      centerNames.map(n => '<option value="' + n.replace(/"/g, '&quot;') + '"' + (n === selected[0] ? ' selected' : '') + '>' + n + ' (' + centerMap[n].courses.length + ')</option>').join('') + '</select>' +
      '<span style="font-size:11px;color:var(--text-muted)">vs</span>' +
      '<select id="v6-cc-sel2" style="background:var(--input-bg);color:var(--text-primary);border:1px solid var(--input-border);border-radius:6px;padding:5px 8px;font-size:11px;margin-left:6px;max-width:200px">' +
      centerNames.map(n => '<option value="' + n.replace(/"/g, '&quot;') + '"' + (n === selected[1] ? ' selected' : '') + '>' + n + ' (' + centerMap[n].courses.length + ')</option>').join('') + '</select></div>';

    const c1 = centerMap[selected[0]], c2 = centerMap[selected[1]];
    if (!c1 || !c2) { modal.innerHTML += '<p style="color:var(--text-muted)">센터를 선택하세요</p>'; return; }

    const avgPrice = (prices) => prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
    const rows = [
      ['강좌 수', c1.courses.length, c2.courses.length, '개'],
      ['종목 수', c1.programs.size, c2.programs.size, '종'],
      ['평균 수강료', avgPrice(c1.prices).toLocaleString(), avgPrice(c2.prices).toLocaleString(), '원'],
      ['최저 수강료', c1.prices.length ? Math.min(...c1.prices).toLocaleString() : '-', c2.prices.length ? Math.min(...c2.prices).toLocaleString() : '-', '원'],
      ['최고 수강료', c1.prices.length ? Math.max(...c1.prices).toLocaleString() : '-', c2.prices.length ? Math.max(...c2.prices).toLocaleString() : '-', '원'],
      ['토요일 강좌', c1.days['토'] || 0, c2.days['토'] || 0, '개'],
      ['일요일 강좌', c1.days['일'] || 0, c2.days['일'] || 0, '개']
    ];

    let tableHTML = '<table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:16px"><thead><tr>' +
      '<th style="padding:8px;text-align:left;color:var(--text-secondary);font-weight:600;font-size:10px;border-bottom:2px solid var(--table-header-border)">항목</th>' +
      '<th style="padding:8px;text-align:right;color:#60A5FA;font-weight:600;font-size:10px;border-bottom:2px solid var(--table-header-border)">' + selected[0].replace(/홈플러스 |이마트 |롯데마트 /g, '') + '</th>' +
      '<th style="padding:8px;text-align:right;color:#F472B6;font-weight:600;font-size:10px;border-bottom:2px solid var(--table-header-border)">' + selected[1].replace(/홈플러스 |이마트 |롯데마트 /g, '') + '</th>' +
      '</tr></thead><tbody>';
    rows.forEach(([label, v1, v2, unit]) => {
      const n1 = typeof v1 === 'number' ? v1 : parseInt(String(v1).replace(/,/g, '')) || 0;
      const n2 = typeof v2 === 'number' ? v2 : parseInt(String(v2).replace(/,/g, '')) || 0;
      const winner = n1 > n2 ? 1 : n2 > n1 ? 2 : 0;
      tableHTML += '<tr style="border-bottom:1px solid var(--table-row-border)">' +
        '<td style="padding:7px 8px;color:var(--text-secondary)">' + label + '</td>' +
        '<td style="padding:7px 8px;text-align:right;font-weight:' + (winner === 1 ? '700' : '400') + ';color:' + (winner === 1 ? '#60A5FA' : 'var(--text)') + '">' + v1 + (unit ? ' ' + unit : '') + (winner === 1 ? ' &#x2B50;' : '') + '</td>' +
        '<td style="padding:7px 8px;text-align:right;font-weight:' + (winner === 2 ? '700' : '400') + ';color:' + (winner === 2 ? '#F472B6' : 'var(--text)') + '">' + v2 + (unit ? ' ' + unit : '') + (winner === 2 ? ' &#x2B50;' : '') + '</td></tr>';
    });
    tableHTML += '</tbody></table>';
    modal.innerHTML += tableHTML;

    const progs1 = [...c1.programs], progs2 = [...c2.programs];
    const common = progs1.filter(p => progs2.includes(p));
    const only1 = progs1.filter(p => !progs2.includes(p));
    const only2 = progs2.filter(p => !progs1.includes(p));

    modal.innerHTML += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:12px">' +
      '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;padding:10px"><div style="font-size:10px;font-weight:700;color:#34D399;margin-bottom:6px">&#x1F91D; 공통 종목 (' + common.length + ')</div>' +
      common.map(p => '<span style="display:inline-block;font-size:9px;background:rgba(52,211,153,0.1);color:#34D399;padding:2px 6px;border-radius:4px;margin:1px">' + p + '</span>').join('') + '</div>' +
      '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;padding:10px"><div style="font-size:10px;font-weight:700;color:#60A5FA;margin-bottom:6px">&#x1F535; ' + selected[0].replace(/홈플러스 |이마트 |롯데마트 /g, '') + '만 (' + only1.length + ')</div>' +
      only1.map(p => '<span style="display:inline-block;font-size:9px;background:rgba(96,165,250,0.1);color:#60A5FA;padding:2px 6px;border-radius:4px;margin:1px">' + p + '</span>').join('') + '</div>' +
      '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;padding:10px"><div style="font-size:10px;font-weight:700;color:#F472B6;margin-bottom:6px">&#x1F7E3; ' + selected[1].replace(/홈플러스 |이마트 |롯데마트 /g, '') + '만 (' + only2.length + ')</div>' +
      only2.map(p => '<span style="display:inline-block;font-size:9px;background:rgba(244,114,182,0.1);color:#F472B6;padding:2px 6px;border-radius:4px;margin:1px">' + p + '</span>').join('') + '</div></div>';

    modal.querySelector('#v6-cc-close').onclick = () => overlay.remove();
    modal.querySelector('#v6-cc-sel1').onchange = (e) => { selected[0] = e.target.value; render(); };
    modal.querySelector('#v6-cc-sel2').onchange = (e) => { selected[1] = e.target.value; render(); };
  }
  render();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  checkAchievement('center_compare');
}

// ─── 3. 시즌별 추천 ──────────────────────────────────────────────
const SEASON_DATA = {
  '봄 (3~5월)': {
    icon: '&#x1F338;', color: '#F472B6',
    programs: ['요가/필라테스','발레','K-POP댄스','사진','플라워','인라인','골프'],
    tip: '봄에는 야외 활동과 새로운 시작에 어울리는 강좌가 인기입니다. 꽃꽂이, 사진, 가벼운 운동을 추천합니다.'
  },
  '여름 (6~8월)': {
    icon: '&#x1F3D6;&#xFE0F;', color: '#60A5FA',
    programs: ['수영','체조','힙합댄스','과학','코딩/로봇','영어','드럼'],
    tip: '여름에는 수영이 단연 인기! 방학 특강으로 코딩, 영어, 과학 실험 등 집중 학습도 좋습니다.'
  },
  '가을 (9~11월)': {
    icon: '&#x1F341;', color: '#FB923C',
    programs: ['피아노','바이올린','미술(종합)','회화','독서/논술','한자/서예','악기'],
    tip: '가을은 예술의 계절! 악기, 미술, 독서 등 감성을 자극하는 강좌를 시작하기 좋은 시기입니다.'
  },
  '겨울 (12~2월)': {
    icon: '&#x2744;&#xFE0F;', color: '#818CF8',
    programs: ['태권도','펜싱','요리','베이킹/디저트','뮤지컬','보컬/노래','축구'],
    tip: '겨울에는 실내 운동과 따뜻한 요리/베이킹 강좌가 인기입니다. 새해 다짐으로 무술도 추천!'
  }
};

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return '봄 (3~5월)';
  if (month >= 6 && month <= 8) return '여름 (6~8월)';
  if (month >= 9 && month <= 11) return '가을 (9~11월)';
  return '겨울 (12~2월)';
}

function showSeasonRecommend() {
  SFX6.play('season');
  const overlay = ce('div', { className: 'modal-overlay', style: { zIndex: '150' } });
  const modal = ce('div', { className: 'modal', style: { maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto' } });
  const current = getCurrentSeason();

  let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
    '<h2 style="margin:0;color:var(--text-primary)">&#x1F324;&#xFE0F; 시즌별 추천 강좌</h2>' +
    '<button id="v6-ss-close" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&#x00D7;</button></div>';

  Object.entries(SEASON_DATA).forEach(([name, data]) => {
    const isCurrent = name === current;
    html += '<div style="background:' + (isCurrent ? data.color + '12' : 'var(--card-bg)') + ';border:1px solid ' +
      (isCurrent ? data.color + '40' : 'var(--card-border)') + ';border-radius:12px;padding:16px;margin-bottom:12px' +
      (isCurrent ? ';box-shadow:0 0 20px ' + data.color + '15' : '') + '">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' +
      '<span style="font-size:22px">' + data.icon + '</span>' +
      '<span style="font-size:14px;font-weight:700;color:' + data.color + '">' + name + '</span>' +
      (isCurrent ? '<span style="font-size:9px;font-weight:700;color:#fff;background:' + data.color + ';padding:2px 8px;border-radius:8px">NOW</span>' : '') + '</div>' +
      '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px">' +
      data.programs.map(p => '<span style="display:inline-block;font-size:10px;background:' + data.color + '15;color:' + data.color + ';padding:3px 10px;border-radius:12px;font-weight:600">' + p + '</span>').join('') + '</div>' +
      '<div style="font-size:11px;color:var(--text-secondary);line-height:1.6">' + data.tip + '</div></div>';
  });

  modal.innerHTML = html;
  modal.querySelector('#v6-ss-close').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  checkAchievement('season_explorer');
}

// ─── 4. 월간 캘린더 ──────────────────────────────────────────────
function showMonthlyCalendar() {
  SFX6.play('calendar');
  const overlay = ce('div', { className: 'modal-overlay', style: { zIndex: '150' } });
  const modal = ce('div', { className: 'modal', style: { maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' } });

  let viewDate = new Date();
  const plannerData = lsGet('cc-planner', []);
  const studyDays = lsGet('cc-study-days', {});

  function render() {
    const year = viewDate.getFullYear(), month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
      '<h2 style="margin:0;color:var(--text-primary)">&#x1F4C5; 학습 캘린더</h2>' +
      '<button id="v6-cal-close" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&#x00D7;</button></div>' +
      '<div style="display:flex;justify-content:center;align-items:center;gap:16px;margin-bottom:16px">' +
      '<button id="v6-cal-prev" style="background:var(--input-bg);border:1px solid var(--input-border);border-radius:6px;padding:4px 10px;color:var(--text);cursor:pointer;font-size:14px">&#x25C0;</button>' +
      '<span style="font-size:15px;font-weight:700;color:var(--text-primary)">' + year + '년 ' + (month + 1) + '월</span>' +
      '<button id="v6-cal-next" style="background:var(--input-bg);border:1px solid var(--input-border);border-radius:6px;padding:4px 10px;color:var(--text);cursor:pointer;font-size:14px">&#x25B6;</button></div>';

    html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-bottom:12px">';
    ['일','월','화','수','목','금','토'].forEach((d, i) => {
      const color = i === 0 ? '#F87171' : i === 6 ? '#60A5FA' : 'var(--text-secondary)';
      html += '<div style="text-align:center;font-size:10px;font-weight:700;color:' + color + ';padding:6px 0">' + d + '</div>';
    });

    const dayNames = ['일','월','화','수','목','금','토'];
    for (let i = 0; i < firstDay; i++) html += '<div></div>';
    for (let d = 1; d <= lastDate; d++) {
      const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
      const isToday = dateStr === todayStr;
      const dayOfWeek = new Date(year, month, d).getDay();
      const dayName = dayNames[dayOfWeek];
      const hasPlan = plannerData.some(p => p.day === dayName);
      const hasStudy = studyDays[dateStr];

      html += '<div style="text-align:center;padding:8px 2px;border-radius:8px;cursor:pointer;position:relative;' +
        'background:' + (isToday ? 'linear-gradient(135deg,rgba(126,200,227,0.2),rgba(58,175,169,0.1))' : hasStudy ? 'rgba(52,211,153,0.08)' : 'var(--card-bg)') + ';' +
        'border:1px solid ' + (isToday ? 'rgba(126,200,227,0.4)' : 'var(--card-border)') + '"' +
        ' data-date="' + dateStr + '" class="v6-cal-day">' +
        '<div style="font-size:12px;font-weight:' + (isToday ? '800' : '500') + ';color:' +
        (dayOfWeek === 0 ? '#F87171' : dayOfWeek === 6 ? '#60A5FA' : isToday ? '#7EC8E3' : 'var(--text)') + '">' + d + '</div>' +
        (hasPlan ? '<div style="width:4px;height:4px;border-radius:50%;background:#FBBF24;margin:2px auto 0"></div>' : '') +
        (hasStudy ? '<div style="width:4px;height:4px;border-radius:50%;background:#34D399;margin:2px auto 0"></div>' : '') +
        '</div>';
    }
    html += '</div>';

    const studyCount = Object.keys(studyDays).filter(k => k.startsWith(year + '-' + String(month + 1).padStart(2, '0'))).length;
    const planCount = plannerData.filter(p => !p.done).length;
    const doneCount = plannerData.filter(p => p.done).length;
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">' +
      '<div style="background:var(--stat-card-bg);border:1px solid var(--stat-card-border);border-radius:8px;padding:10px;text-align:center"><div style="font-size:20px;font-weight:800;color:#34D399">' + studyCount + '</div><div style="font-size:9px;color:var(--text-muted)">이번 달 학습일</div></div>' +
      '<div style="background:var(--stat-card-bg);border:1px solid var(--stat-card-border);border-radius:8px;padding:10px;text-align:center"><div style="font-size:20px;font-weight:800;color:#FBBF24">' + planCount + '</div><div style="font-size:9px;color:var(--text-muted)">예정 플래너</div></div>' +
      '<div style="background:var(--stat-card-bg);border:1px solid var(--stat-card-border);border-radius:8px;padding:10px;text-align:center"><div style="font-size:20px;font-weight:800;color:#7EC8E3">' + doneCount + '</div><div style="font-size:9px;color:var(--text-muted)">완료 플래너</div></div></div>';

    modal.innerHTML = html;
    modal.querySelector('#v6-cal-close').onclick = () => overlay.remove();
    modal.querySelector('#v6-cal-prev').onclick = () => { viewDate = new Date(year, month - 1, 1); render(); };
    modal.querySelector('#v6-cal-next').onclick = () => { viewDate = new Date(year, month + 1, 1); render(); };
    modal.querySelectorAll('.v6-cal-day').forEach(el => {
      el.onclick = () => {
        const dateStr = el.dataset.date;
        const days = lsGet('cc-study-days', {});
        if (days[dateStr]) delete days[dateStr];
        else days[dateStr] = true;
        lsSet('cc-study-days', days);
        showToast(days[dateStr] ? '&#x2705; 학습일 기록!' : '학습일 해제');
        render();
      };
    });
  }
  render();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  checkAchievement('calendar_user');
}

// ─── 5. 리뷰 인사이트 ────────────────────────────────────────────
function showReviewInsights() {
  const overlay = ce('div', { className: 'modal-overlay', style: { zIndex: '150' } });
  const modal = ce('div', { className: 'modal', style: { maxWidth: '600px', maxHeight: '85vh', overflowY: 'auto' } });

  const reviews = lsGet('cc-reviews', {});
  const allData = getAllData();
  const entries = Object.entries(reviews);

  let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
    '<h2 style="margin:0;color:var(--text-primary)">&#x1F4CA; 리뷰 인사이트</h2>' +
    '<button id="v6-ri-close" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&#x00D7;</button></div>';

  if (!entries.length) {
    html += '<div style="text-align:center;padding:40px;color:var(--text-faint)"><div style="font-size:32px;margin-bottom:8px">&#x270D;&#xFE0F;</div>' +
      '<div style="font-size:13px;font-weight:600">아직 리뷰가 없습니다</div>' +
      '<div style="font-size:11px;margin-top:4px">강좌를 체험하고 리뷰를 작성해보세요!</div></div>';
  } else {
    const total = entries.length;
    const avgRating = (entries.reduce((s, [, r]) => s + r.rating, 0) / total).toFixed(1);
    const ratingDist = [0, 0, 0, 0, 0];
    entries.forEach(([, r]) => { if (r.rating >= 1 && r.rating <= 5) ratingDist[r.rating - 1]++; });

    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">' +
      '<div style="background:var(--stat-card-bg);border:1px solid var(--stat-card-border);border-radius:10px;padding:12px;text-align:center"><div style="font-size:24px;font-weight:800;color:#FBBF24">' + avgRating + '</div><div style="font-size:9px;color:var(--text-muted)">평균 별점</div></div>' +
      '<div style="background:var(--stat-card-bg);border:1px solid var(--stat-card-border);border-radius:10px;padding:12px;text-align:center"><div style="font-size:24px;font-weight:800;color:var(--accent)">' + total + '</div><div style="font-size:9px;color:var(--text-muted)">총 리뷰 수</div></div>' +
      '<div style="background:var(--stat-card-bg);border:1px solid var(--stat-card-border);border-radius:10px;padding:12px;text-align:center"><div style="font-size:24px;font-weight:800;color:#34D399">' + ratingDist[4] + '</div><div style="font-size:9px;color:var(--text-muted)">5점 리뷰</div></div></div>';

    html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;padding:14px;margin-bottom:12px">' +
      '<div style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:10px">별점 분포</div>';
    for (let i = 4; i >= 0; i--) {
      const pct = total > 0 ? (ratingDist[i] / total * 100) : 0;
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">' +
        '<span style="font-size:10px;width:30px;color:#FBBF24">' + '&#x2B50;'.repeat(i + 1).substring(0, 6) + (i + 1) + '</span>' +
        '<div style="flex:1;height:14px;background:var(--bar-bg);border-radius:3px;overflow:hidden">' +
        '<div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,#FBBF24,#FB923C);border-radius:3px"></div></div>' +
        '<span style="font-size:10px;color:var(--text-muted);width:30px;text-align:right">' + ratingDist[i] + '</span></div>';
    }
    html += '</div>';

    const catRatings = {};
    entries.forEach(([idx, r]) => {
      const course = allData[parseInt(idx)];
      if (course) {
        const cat = course[3] || '기타';
        if (!catRatings[cat]) catRatings[cat] = [];
        catRatings[cat].push(r.rating);
      }
    });

    const catAvgs = Object.entries(catRatings).map(([cat, ratings]) => ({
      cat, avg: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1), count: ratings.length
    })).sort((a, b) => b.avg - a.avg);

    if (catAvgs.length > 0) {
      html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;padding:14px">' +
        '<div style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:10px">종목별 만족도</div>';
      catAvgs.forEach(({ cat, avg, count }) => {
        html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
          '<span style="font-size:10px;width:80px;color:var(--text-secondary)">' + cat + '</span>' +
          '<div style="flex:1;height:16px;background:var(--bar-bg);border-radius:3px;overflow:hidden">' +
          '<div style="width:' + (avg / 5 * 100) + '%;height:100%;background:linear-gradient(90deg,#34D399,#3AAFA9);border-radius:3px"></div></div>' +
          '<span style="font-size:10px;font-weight:700;color:#FBBF24;width:25px;text-align:right">' + avg + '</span>' +
          '<span style="font-size:9px;color:var(--text-faint);width:25px">(' + count + ')</span></div>';
      });
      html += '</div>';
    }
  }

  modal.innerHTML = html;
  modal.querySelector('#v6-ri-close').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  checkAchievement('review_analyst');
}

// ─── 6. D-Day 카운트다운 ─────────────────────────────────────────
function showDDay() {
  SFX6.play('dday');
  const overlay = ce('div', { className: 'modal-overlay', style: { zIndex: '150' } });
  const modal = ce('div', { className: 'modal', style: { maxWidth: '550px', maxHeight: '85vh', overflowY: 'auto' } });

  const allData = getAllData();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = [];
  allData.forEach((r, i) => {
    const start = r[13];
    if (!start) return;
    const parts = start.split('.');
    if (parts.length < 3) return;
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    date.setHours(0, 0, 0, 0);
    const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff <= 60) {
      upcoming.push({ idx: i, course: r, date, diff });
    }
  });
  upcoming.sort((a, b) => a.diff - b.diff);

  let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
    '<h2 style="margin:0;color:var(--text-primary)">&#x23F0; D-Day 카운트다운</h2>' +
    '<button id="v6-dd-close" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&#x00D7;</button></div>';

  if (!upcoming.length) {
    html += '<div style="text-align:center;padding:40px;color:var(--text-faint)"><div style="font-size:32px;margin-bottom:8px">&#x1F4C5;</div>' +
      '<div style="font-size:13px;font-weight:600">예정된 강좌가 없습니다</div></div>';
  } else {
    html += '<div style="font-size:10px;color:var(--text-muted);margin-bottom:12px">60일 이내 시작 예정 강좌 ' + upcoming.length + '개</div>';
    upcoming.slice(0, 30).forEach(({ course, diff }) => {
      const urgency = diff === 0 ? '#EF4444' : diff <= 3 ? '#FB923C' : diff <= 7 ? '#FBBF24' : diff <= 14 ? '#34D399' : '#60A5FA';
      const label = diff === 0 ? 'D-DAY' : 'D-' + diff;
      html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;border-left:3px solid ' + urgency + '">' +
        '<div style="min-width:50px;text-align:center"><div style="font-size:14px;font-weight:800;color:' + urgency + '">' + label + '</div>' +
        '<div style="font-size:8px;color:var(--text-faint)">' + course[13] + '</div></div>' +
        '<div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:600;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + course[4] + '</div>' +
        '<div style="font-size:9px;color:var(--text-muted)">' + course[1] + ' &#x00B7; ' + course[3] + ' &#x00B7; ' + (course[6] || '') + ' ' + (course[7] || '') + '</div></div>' +
        '<span style="font-size:8px;font-weight:700;color:' + (course[10] === '접수중' ? '#34D399' : course[10] === '마감임박' ? '#FB923C' : 'var(--text-muted)') + '">' + (course[10] || '') + '</span></div>';
    });
  }

  modal.innerHTML = html;
  modal.querySelector('#v6-dd-close').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  checkAchievement('dday_checker');
}

// ─── 7. 성향 테스트 (나에게 맞는 강좌 찾기) ─────────────────────
const PERSONALITY_QUESTIONS = [
  { q: '주말에 가장 하고 싶은 것은?', a: [
    { text: '밖에서 땀 흘리며 운동하기', tags: ['수영','태권도','축구','체육'] },
    { text: '조용히 악기 연주하기', tags: ['피아노','바이올린','드럼','우쿨렐레'] },
    { text: '그림이나 만들기 하기', tags: ['미술','회화','캘리그라피','도자기/목공'] },
    { text: '새로운 것 배우기', tags: ['코딩/로봇','영어','과학','바둑'] }
  ]},
  { q: '나의 성격은?', a: [
    { text: '활발하고 에너지가 넘친다', tags: ['K-POP댄스','힙합댄스','인라인','체조'] },
    { text: '꼼꼼하고 집중력이 좋다', tags: ['피아노','바이올린','미술','바둑'] },
    { text: '사교적이고 팀활동을 좋아한다', tags: ['축구','농구','뮤지컬','보컬/노래'] },
    { text: '창의적이고 상상력이 풍부하다', tags: ['미술(종합)','코딩/로봇','요리','플라워'] }
  ]},
  { q: '선호하는 시간대는?', a: [
    { text: '오전 (활기차게!)', tags: ['수영','요가/필라테스','태권도'] },
    { text: '오후 (집중해서!)', tags: ['피아노','영어','과학'] },
    { text: '저녁 (퇴근 후!)', tags: ['요가/필라테스','발레','보컬/노래'] },
    { text: '주말 (여유있게!)', tags: ['골프','요리','사진'] }
  ]},
  { q: '배우고 싶은 이유는?', a: [
    { text: '건강과 체력 증진', tags: ['수영','태권도','요가/필라테스','체조'] },
    { text: '예술적 감성 발달', tags: ['피아노','발레','미술','바이올린'] },
    { text: '실용적 스킬 습득', tags: ['영어','코딩/로봇','요리','재테크/강연'] },
    { text: '스트레스 해소와 취미', tags: ['K-POP댄스','보컬/노래','사진','플라워'] }
  ]},
  { q: '가장 끌리는 분위기는?', a: [
    { text: '역동적이고 활기찬', tags: ['축구','K-POP댄스','힙합댄스','태권도'] },
    { text: '우아하고 섬세한', tags: ['발레','바이올린','캘리그라피','플라워'] },
    { text: '재미있고 신나는', tags: ['드럼','뮤지컬','요리','블록/레고'] },
    { text: '차분하고 명상적인', tags: ['요가/필라테스','한자/서예','독서/논술','수학'] }
  ]}
];

function showPersonalityTest() {
  const overlay = ce('div', { className: 'modal-overlay', style: { zIndex: '150' } });
  const modal = ce('div', { className: 'modal', style: { maxWidth: '500px', maxHeight: '85vh', overflowY: 'auto' } });

  let step = 0;
  const answers = [];

  function render() {
    if (step < PERSONALITY_QUESTIONS.length) {
      const q = PERSONALITY_QUESTIONS[step];
      let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
        '<h2 style="margin:0;color:var(--text-primary)">&#x1F9E0; 나에게 맞는 강좌는?</h2>' +
        '<button id="v6-pt-close" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&#x00D7;</button></div>' +
        '<div style="display:flex;gap:4px;margin-bottom:16px">';
      for (let i = 0; i < PERSONALITY_QUESTIONS.length; i++) {
        html += '<div style="flex:1;height:4px;border-radius:2px;background:' + (i <= step ? 'linear-gradient(90deg,#7EC8E3,#3AAFA9)' : 'var(--card-border)') + '"></div>';
      }
      html += '</div>' +
        '<div style="font-size:10px;color:var(--text-muted);margin-bottom:8px">질문 ' + (step + 1) + '/' + PERSONALITY_QUESTIONS.length + '</div>' +
        '<div style="font-size:15px;font-weight:700;color:var(--text-primary);margin-bottom:20px;line-height:1.5">' + q.q + '</div>';
      q.a.forEach((a, i) => {
        html += '<button class="v6-pt-ans" data-idx="' + i + '" style="display:block;width:100%;text-align:left;padding:14px 16px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;margin-bottom:8px;font-size:13px;color:var(--text);cursor:pointer;transition:all .2s;font-family:inherit">' + a.text + '</button>';
      });
      modal.innerHTML = html;
      modal.querySelector('#v6-pt-close').onclick = () => overlay.remove();
      modal.querySelectorAll('.v6-pt-ans').forEach(btn => {
        btn.onmouseenter = () => { btn.style.background = 'rgba(126,200,227,0.1)'; btn.style.borderColor = 'rgba(126,200,227,0.3)'; };
        btn.onmouseleave = () => { btn.style.background = 'var(--card-bg)'; btn.style.borderColor = 'var(--card-border)'; };
        btn.onclick = () => {
          answers.push(PERSONALITY_QUESTIONS[step].a[parseInt(btn.dataset.idx)].tags);
          step++;
          render();
        };
      });
    } else {
      const tagCount = {};
      answers.flat().forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; });
      const ranked = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
      const top5 = ranked.slice(0, 5);

      let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
        '<h2 style="margin:0;color:var(--text-primary)">&#x1F389; 추천 결과</h2>' +
        '<button id="v6-pt-close" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&#x00D7;</button></div>' +
        '<div style="text-align:center;margin-bottom:20px"><div style="font-size:14px;font-weight:700;color:var(--text-primary)">당신에게 추천하는 강좌!</div></div>';

      const colors = ['#7EC8E3', '#34D399', '#FBBF24', '#F472B6', '#818CF8'];
      top5.forEach(([prog, score], i) => {
        const maxScore = top5[0][1];
        const pct = (score / maxScore * 100);
        html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;padding:12px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px">' +
          '<div style="font-size:20px;font-weight:900;color:' + colors[i] + ';width:24px;text-align:center">' + (i + 1) + '</div>' +
          '<div style="flex:1"><div style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:4px">' + prog + '</div>' +
          '<div style="height:6px;background:var(--bar-bg);border-radius:3px;overflow:hidden"><div style="width:' + pct + '%;height:100%;background:' + colors[i] + ';border-radius:3px"></div></div></div>' +
          '<div style="font-size:11px;font-weight:700;color:' + colors[i] + '">' + Math.round(pct) + '%</div></div>';
      });

      html += '<div style="text-align:center;margin-top:16px"><button id="v6-pt-retry" style="background:linear-gradient(135deg,#7EC8E3,#3AAFA9);border:none;border-radius:8px;padding:10px 24px;color:#0A1628;font-weight:700;font-size:12px;cursor:pointer">다시 테스트하기</button></div>';

      modal.innerHTML = html;
      modal.querySelector('#v6-pt-close').onclick = () => overlay.remove();
      modal.querySelector('#v6-pt-retry').onclick = () => { step = 0; answers.length = 0; render(); };
      checkAchievement('personality_test');
    }
  }
  render();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// ─── 8. 주간 다이제스트 ──────────────────────────────────────────
function showWeeklyDigest() {
  const overlay = ce('div', { className: 'modal-overlay', style: { zIndex: '150' } });
  const modal = ce('div', { className: 'modal', style: { maxWidth: '550px', maxHeight: '85vh', overflowY: 'auto' } });

  const allData = getAllData();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10).replace(/-/g, '.');

  const recruiting = allData.filter(r => ['접수중', '마감임박', '추가모집'].includes(r[10]));
  const closing = allData.filter(r => r[10] === '마감임박');
  const upcoming = allData.filter(r => r[13] && r[13] >= todayStr).sort((a, b) => a[13].localeCompare(b[13]));

  const catCount = {};
  recruiting.forEach(r => { catCount[r[3]] = (catCount[r[3]] || 0) + 1; });
  const hotCats = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const reviews = lsGet('cc-reviews', {});
  const favs = lsGet('cc-fav', []);
  const plannerData = lsGet('cc-planner', []);

  let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
    '<h2 style="margin:0;color:var(--text-primary)">&#x1F4E8; 주간 다이제스트</h2>' +
    '<button id="v6-wd-close" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&#x00D7;</button></div>' +
    '<div style="font-size:10px;color:var(--text-muted);margin-bottom:16px">' + today.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }) + ' 기준</div>';

  html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px">' +
    '<div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:10px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:800;color:#34D399">' + recruiting.length.toLocaleString() + '</div><div style="font-size:9px;color:var(--text-muted)">모집중</div></div>' +
    '<div style="background:rgba(251,146,60,0.08);border:1px solid rgba(251,146,60,0.2);border-radius:10px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:800;color:#FB923C">' + closing.length + '</div><div style="font-size:9px;color:var(--text-muted)">마감임박</div></div>' +
    '<div style="background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.2);border-radius:10px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:800;color:#60A5FA">' + upcoming.slice(0, 100).length + '+</div><div style="font-size:9px;color:var(--text-muted)">시작예정</div></div>' +
    '<div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:10px;padding:10px;text-align:center"><div style="font-size:18px;font-weight:800;color:#FBBF24">' + favs.length + '</div><div style="font-size:9px;color:var(--text-muted)">즐겨찾기</div></div></div>';

  if (hotCats.length) {
    html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;padding:14px;margin-bottom:12px">' +
      '<div style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:10px">&#x1F525; 인기 종목 TOP 5</div>';
    hotCats.forEach(([cat, cnt], i) => {
      const pct = (cnt / hotCats[0][1] * 100);
      html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
        '<span style="font-size:10px;width:80px;color:var(--text-secondary)">' + (i + 1) + '. ' + cat + '</span>' +
        '<div style="flex:1;height:14px;background:var(--bar-bg);border-radius:3px;overflow:hidden"><div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,#FB923C,#FBBF24);border-radius:3px"></div></div>' +
        '<span style="font-size:10px;font-weight:700;color:#FB923C;width:35px;text-align:right">' + cnt + '</span></div>';
    });
    html += '</div>';
  }

  if (closing.length) {
    html += '<div style="background:rgba(251,146,60,0.05);border:1px solid rgba(251,146,60,0.15);border-radius:10px;padding:14px;margin-bottom:12px">' +
      '<div style="font-size:12px;font-weight:700;color:#FB923C;margin-bottom:10px">&#x26A0;&#xFE0F; 마감임박 강좌</div>';
    closing.slice(0, 5).forEach(r => {
      html += '<div style="font-size:11px;color:var(--text);padding:4px 0;border-bottom:1px solid var(--table-row-border)">' +
        '<span style="font-weight:600">' + r[4] + '</span> <span style="font-size:9px;color:var(--text-muted)">- ' + r[1] + '</span></div>';
    });
    html += '</div>';
  }

  html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;padding:14px">' +
    '<div style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:8px">&#x1F4DD; 나의 활동 요약</div>' +
    '<div style="font-size:11px;color:var(--text-secondary);line-height:2">' +
    '&#x2022; 리뷰 작성: ' + Object.keys(reviews).length + '개<br>' +
    '&#x2022; 즐겨찾기: ' + favs.length + '개<br>' +
    '&#x2022; 플래너: ' + plannerData.length + '개 (완료 ' + plannerData.filter(p => p.done).length + '개)<br>' +
    '&#x2022; 업적: ' + (lsGet('cc-achievements', [])).length + '/' + (30 + 12) + '개</div></div>';

  modal.innerHTML = html;
  modal.querySelector('#v6-wd-close').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  checkAchievement('digest_reader');
}

// ─── 9. 종목 백과사전 ────────────────────────────────────────────
const ENCYCLOPEDIA = [
  { name: '수영', icon: '&#x1F3CA;', history: '고대 이집트 BC2500년 벽화에 수영하는 모습이 등장. 1896년 제1회 올림픽부터 정식 종목.', effects: '전신 유산소 운동, 심폐기능 강화, 관절 부담 적음, 성장기 키 성장 촉진', ageRange: '3세~', popularity: 95 },
  { name: '피아노', icon: '&#x1F3B9;', history: '1700년경 이탈리아 크리스토포리가 발명. 88건반 표준은 1880년대 확립.', effects: '양손 협응력, 집중력, 수학적 사고력, 감정 표현력 향상', ageRange: '4세~', popularity: 90 },
  { name: '발레', icon: '&#x1FA70;', history: '15세기 이탈리아 궁정에서 시작, 루이 14세가 프랑스 왕립 발레 아카데미 설립(1661).', effects: '유연성, 자세 교정, 근력, 음악성, 표현력 발달', ageRange: '4세~', popularity: 80 },
  { name: '태권도', icon: '&#x1F94B;', history: '1955년 최홍희 장군이 명명. 2000년 시드니 올림픽 정식 종목. 세계 210개국 보급.', effects: '호신술, 체력, 예의범절, 자신감, 정신력 강화', ageRange: '5세~', popularity: 85 },
  { name: '미술', icon: '&#x1F3A8;', history: '라스코 동굴벽화(BC15000)부터 이어진 인류 최초의 예술. 현대미술은 20세기 다양화.', effects: '창의력, 관찰력, 소근육 발달, 정서적 안정, 색채 감각', ageRange: '3세~', popularity: 82 },
  { name: '바이올린', icon: '&#x1F3BB;', history: '16세기 이탈리아에서 탄생. 스트라디바리우스(1644-1737) 명기 제작.', effects: '음감, 집중력, 인내심, 양손 협응, 감성 발달', ageRange: '5세~', popularity: 65 },
  { name: '요가/필라테스', icon: '&#x1F9D8;', history: '요가는 5000년 전 인도, 필라테스는 1920년대 조셉 필라테스가 창시.', effects: '유연성, 코어 강화, 스트레스 해소, 자세 교정', ageRange: '성인', popularity: 88 },
  { name: '코딩/로봇', icon: '&#x1F916;', history: '1950년대 컴퓨터 프로그래밍 시작, 2010년대 초등 코딩 교육 의무화 확대.', effects: '논리적 사고, 문제해결력, 창의력, 4차산업 대비', ageRange: '5세~', popularity: 75 },
  { name: '영어', icon: '&#x1F1FA;&#x1F1F8;', history: '세계 공용어로 15억 인구 사용. 영어교육 시작 연령 지속 하향 추세.', effects: '글로벌 소통, 인지 유연성, 진학/취업 경쟁력', ageRange: '4세~', popularity: 92 },
  { name: 'K-POP댄스', icon: '&#x1F3A4;', history: '2000년대 한류와 함께 세계적 인기. BTS, 블랙핑크 등으로 글로벌 확산.', effects: '리듬감, 체력, 자신감, 표현력, 협동심', ageRange: '6세~', popularity: 78 },
  { name: '요리', icon: '&#x1F373;', history: '호모 에렉투스의 불 사용(170만년 전)이 시작. 현대 요리교육은 19세기 프랑스 조리학교.', effects: '자립심, 영양 지식, 소근육, 과학적 사고, 성취감', ageRange: '6세~', popularity: 70 },
  { name: '골프', icon: '&#x26F3;', history: '15세기 스코틀랜드 기원. 1764년 세인트앤드루스 18홀 표준. 2016년 올림픽 복귀.', effects: '집중력, 인내심, 전략적 사고, 전신 운동, 사교', ageRange: '8세~', popularity: 60 }
];

function showEncyclopedia() {
  SFX6.play('encyclopedia');
  const overlay = ce('div', { className: 'modal-overlay', style: { zIndex: '150' } });
  const modal = ce('div', { className: 'modal', style: { maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto' } });

  let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
    '<h2 style="margin:0;color:var(--text-primary)">&#x1F4D6; 종목 백과사전</h2>' +
    '<button id="v6-enc-close" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&#x00D7;</button></div>' +
    '<div style="font-size:10px;color:var(--text-muted);margin-bottom:12px">' + ENCYCLOPEDIA.length + '개 종목의 역사, 기대효과, 인기도를 확인하세요</div>';

  ENCYCLOPEDIA.forEach(item => {
    html += '<div style="background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:16px;margin-bottom:10px">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
      '<span style="font-size:24px">' + item.icon + '</span>' +
      '<div style="flex:1"><div style="font-size:14px;font-weight:700;color:var(--text-primary)">' + item.name + '</div>' +
      '<div style="font-size:9px;color:var(--text-muted)">' + item.ageRange + ' 시작 가능</div></div>' +
      '<div style="text-align:center"><div style="font-size:14px;font-weight:800;color:#FBBF24">' + item.popularity + '</div>' +
      '<div style="font-size:8px;color:var(--text-faint)">인기도</div></div></div>' +
      '<div style="margin-bottom:8px"><div style="font-size:10px;font-weight:700;color:#60A5FA;margin-bottom:3px">&#x1F4DC; 역사</div>' +
      '<div style="font-size:11px;color:var(--text-secondary);line-height:1.6">' + item.history + '</div></div>' +
      '<div><div style="font-size:10px;font-weight:700;color:#34D399;margin-bottom:3px">&#x2728; 기대효과</div>' +
      '<div style="font-size:11px;color:var(--text-secondary);line-height:1.6">' + item.effects + '</div></div>' +
      '<div style="margin-top:8px;height:4px;background:var(--bar-bg);border-radius:2px;overflow:hidden">' +
      '<div style="width:' + item.popularity + '%;height:100%;background:linear-gradient(90deg,#7EC8E3,#3AAFA9);border-radius:2px"></div></div></div>';
  });

  modal.innerHTML = html;
  modal.querySelector('#v6-enc-close').onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  checkAchievement('encyclopedia_reader');
}

// ─── 10. 퀴즈 +15문 (15→30) ────────────────────────────────────
const QUIZ_V6 = [
  { q: '대한민국에서 수영 인구가 가장 많은 연령대는?', a: ['10대','20~30대','40~50대','60대 이상'], c: 2, hint: '자녀 동반 수영과 건강 목적의 성인이 합쳐져 40~50대가 가장 많습니다.' },
  { q: '피아노 건반 수 표준은?', a: ['76건반','85건반','88건반','92건반'], c: 2, hint: '스타인웨이가 1880년대에 88건반을 표준으로 확립했습니다.' },
  { q: '발레의 5가지 기본 포지션을 정리한 사람은?', a: ['루이 14세','피에르 보샹','마리우스 프티파','세르게이 디아길레프'], c: 1, hint: '루이 14세의 춤 교사인 피에르 보샹이 5가지 발 포지션을 체계화했습니다.' },
  { q: '태권도가 올림픽 정식 종목이 된 해는?', a: ['1992년','1996년','2000년','2004년'], c: 2, hint: '2000년 시드니 올림픽에서 정식 종목으로 채택되었습니다.' },
  { q: '문화센터에서 가장 인기 있는 유아 강좌 종목은?', a: ['영어','수영','미술','발레'], c: 1, hint: '물놀이부터 시작하는 수영은 유아 강좌 중 부동의 1위입니다.' },
  { q: '요가의 기원 국가는?', a: ['중국','일본','인도','태국'], c: 2, hint: '요가는 약 5,000년 전 인도에서 시작된 수행법입니다.' },
  { q: '필라테스를 창시한 사람의 이름은?', a: ['요셉 필라테스','칼 필라테스','마이클 필라테스','한스 필라테스'], c: 0, hint: '독일 출신의 조셉(요셉) 필라테스가 1920년대에 창시했습니다.' },
  { q: '바이올린의 현은 몇 개?', a: ['3개','4개','5개','6개'], c: 1, hint: 'G-D-A-E 4개의 현으로 구성됩니다.' },
  { q: '대형마트 문화센터 수강기간은 보통?', a: ['1개월','3개월','6개월','1년'], c: 1, hint: '대부분의 대형마트 문화센터는 3개월(12주) 단위로 운영됩니다.' },
  { q: 'K-POP 댄스가 문화센터에서 인기를 끌기 시작한 시기는?', a: ['2000년대 초','2010년대 초','2015년 이후','2020년 이후'], c: 2, hint: 'BTS, 블랙핑크 등의 글로벌 인기와 함께 2015년 이후 급증했습니다.' },
  { q: '코딩 교육에서 가장 많이 사용되는 블록 코딩 도구는?', a: ['엔트리','스크래치','앱인벤터','코드닷오알지'], c: 1, hint: 'MIT에서 개발한 스크래치는 전 세계적으로 가장 많이 사용됩니다.' },
  { q: '문화센터 강좌 접수 시 가장 빨리 마감되는 종목은?', a: ['미술','수영','피아노','요리'], c: 1, hint: '수영은 시설 수용 인원이 제한적이라 접수 시작 후 가장 빨리 마감됩니다.' },
  { q: '홈플러스 문화센터 1호점은 어디?', a: ['일산점','강서점','잠실점','영등포점'], c: 2, hint: '홈플러스 잠실점이 문화센터 사업을 가장 먼저 시작한 점포 중 하나입니다.' },
  { q: '바둑에서 바둑판의 선 수는?', a: ['15x15','17x17','19x19','21x21'], c: 2, hint: '바둑판은 가로 19줄, 세로 19줄로 총 361개의 교차점이 있습니다.' },
  { q: '캘리그라피의 어원은?', a: ['아름다운 글씨(그리스어)','장식 문자(라틴어)','예술 서체(영어)','붓 글씨(한자)'], c: 0, hint: 'Kallos(아름다운) + Graphe(글씨)라는 그리스어에서 유래했습니다.' }
];

function showQuizV6() {
  const overlay = ce('div', { className: 'modal-overlay', style: { zIndex: '150' } });
  const modal = ce('div', { className: 'modal', style: { maxWidth: '500px', maxHeight: '85vh', overflowY: 'auto' } });

  const questions = [...QUIZ_V6].sort(() => Math.random() - 0.5).slice(0, 10);
  let current = 0, score = 0, answered = false;

  function render() {
    if (current >= questions.length) {
      const grade = score >= 10 ? 'S' : score >= 8 ? 'A' : score >= 6 ? 'B' : score >= 4 ? 'C' : 'D';
      const gradeColor = { S: '#FFD700', A: '#34D399', B: '#60A5FA', C: '#FBBF24', D: '#F87171' };
      modal.innerHTML = '<div style="text-align:center;padding:20px">' +
        '<div style="font-size:48px;margin-bottom:12px">&#x1F3C6;</div>' +
        '<div style="font-size:60px;font-weight:900;color:' + gradeColor[grade] + '">' + grade + '</div>' +
        '<div style="font-size:16px;font-weight:700;color:var(--text-primary);margin:8px 0">' + score + ' / ' + questions.length + ' 정답</div>' +
        '<div style="font-size:11px;color:var(--text-muted);margin-bottom:20px">' +
        (grade === 'S' ? '완벽합니다! 문화센터 박사!' : grade === 'A' ? '대단해요! 거의 만점!' : grade === 'B' ? '좋아요! 꽤 잘 알고 있네요.' : '조금 더 알아볼까요?') + '</div>' +
        '<button id="v6-q2-retry" style="background:linear-gradient(135deg,#7EC8E3,#3AAFA9);border:none;border-radius:8px;padding:10px 24px;color:#0A1628;font-weight:700;font-size:12px;cursor:pointer;margin-right:8px">다시 도전</button>' +
        '<button id="v6-q2-close" style="background:var(--input-bg);border:1px solid var(--input-border);border-radius:8px;padding:10px 24px;color:var(--text);font-weight:600;font-size:12px;cursor:pointer">닫기</button></div>';
      modal.querySelector('#v6-q2-retry').onclick = () => { current = 0; score = 0; answered = false; questions.sort(() => Math.random() - 0.5); render(); };
      modal.querySelector('#v6-q2-close').onclick = () => overlay.remove();
      if (score === questions.length) checkAchievement('quiz_v6_perfect');
      checkAchievement('quiz_v6_play');
      return;
    }

    const q = questions[current];
    answered = false;
    let html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<h2 style="margin:0;color:var(--text-primary)">&#x1F4DD; 퀴즈 v6</h2>' +
      '<button id="v6-q2-close" style="background:none;border:none;color:var(--text-muted);font-size:20px;cursor:pointer">&#x00D7;</button></div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:12px">' +
      '<span style="font-size:10px;color:var(--text-muted)">' + (current + 1) + '/' + questions.length + '</span>' +
      '<span style="font-size:10px;font-weight:700;color:#34D399">' + score + '점</span></div>' +
      '<div style="height:4px;background:var(--bar-bg);border-radius:2px;margin-bottom:16px"><div style="width:' + ((current + 1) / questions.length * 100) + '%;height:100%;background:linear-gradient(90deg,#7EC8E3,#3AAFA9);border-radius:2px;transition:width .3s"></div></div>' +
      '<div style="font-size:14px;font-weight:700;color:var(--text-primary);margin-bottom:16px;line-height:1.5">' + q.q + '</div>';
    q.a.forEach((a, i) => {
      html += '<button class="v6-q2-ans" data-idx="' + i + '" style="display:block;width:100%;text-align:left;padding:12px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;font-size:12px;color:var(--text);cursor:pointer;transition:all .2s;font-family:inherit">' +
        '<span style="color:var(--text-muted);margin-right:8px">' + (i + 1) + '.</span>' + a + '</button>';
    });
    html += '<div id="v6-q2-hint" style="display:none;background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.2);border-radius:8px;padding:10px 14px;margin-top:10px;font-size:11px;color:#60A5FA;line-height:1.5"></div>';

    modal.innerHTML = html;
    modal.querySelector('#v6-q2-close').onclick = () => overlay.remove();
    modal.querySelectorAll('.v6-q2-ans').forEach(btn => {
      btn.onclick = () => {
        if (answered) return;
        answered = true;
        const idx = parseInt(btn.dataset.idx);
        const correct = idx === q.c;
        if (correct) score++;
        btn.style.background = correct ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.15)';
        btn.style.borderColor = correct ? '#34D399' : '#EF4444';
        btn.style.color = correct ? '#34D399' : '#EF4444';
        if (!correct) {
          const correctBtn = modal.querySelectorAll('.v6-q2-ans')[q.c];
          correctBtn.style.background = 'rgba(52,211,153,0.15)';
          correctBtn.style.borderColor = '#34D399';
          correctBtn.style.color = '#34D399';
        }
        const hint = modal.querySelector('#v6-q2-hint');
        hint.style.display = 'block';
        hint.innerHTML = (correct ? '&#x2705; 정답! ' : '&#x274C; 오답. ') + q.hint;
        SFX6.play(correct ? 'season' : 'dday');
        setTimeout(() => { current++; render(); }, 2000);
      };
    });
  }
  render();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// ─── 업적 +12개 (30→42) ─────────────────────────────────────────
const V6_ACHIEVEMENTS = [
  { id: 'roadmap_user', name: '로드맵 탐험가', desc: '커리큘럼 로드맵 열람', icon: '&#x1F4DA;' },
  { id: 'center_compare', name: '비교 분석가', desc: '센터 비교 대시보드 사용', icon: '&#x1F3E2;' },
  { id: 'season_explorer', name: '시즌 가이드', desc: '시즌별 추천 강좌 열람', icon: '&#x1F324;&#xFE0F;' },
  { id: 'calendar_user', name: '캘린더 활용', desc: '월간 캘린더 사용', icon: '&#x1F4C5;' },
  { id: 'review_analyst', name: '리뷰 분석가', desc: '리뷰 인사이트 열람', icon: '&#x1F4CA;' },
  { id: 'dday_checker', name: 'D-Day 체크', desc: 'D-Day 카운트다운 열람', icon: '&#x23F0;' },
  { id: 'personality_test', name: '자기 분석', desc: '성향 테스트 완료', icon: '&#x1F9E0;' },
  { id: 'digest_reader', name: '다이제스트 독자', desc: '주간 다이제스트 열람', icon: '&#x1F4E8;' },
  { id: 'encyclopedia_reader', name: '백과사전 탐독', desc: '종목 백과사전 열람', icon: '&#x1F4D6;' },
  { id: 'quiz_v6_play', name: '퀴즈 v6 도전', desc: 'v6 퀴즈 도전', icon: '&#x1F4DD;' },
  { id: 'quiz_v6_perfect', name: '퀴즈 v6 만점', desc: 'v6 퀴즈 만점 달성', icon: '&#x1F4AF;' },
  { id: 'study_7days', name: '7일 학습자', desc: '캘린더에 7일 이상 학습 기록', icon: '&#x1F31F;' }
];

function checkAchievement(id) {
  const unlocked = lsGet('cc-achievements', []);
  if (unlocked.includes(id)) return;
  unlocked.push(id);
  lsSet('cc-achievements', unlocked);
  const def = V6_ACHIEVEMENTS.find(a => a.id === id);
  if (!def) return;
  const toast = ce('div', { id: 'v6-achieve-toast2', style: {
    position:'fixed',top:'20px',right:'20px',background:'linear-gradient(135deg,#1E3A5F,#0C1525)',
    border:'1px solid rgba(126,200,227,0.4)',borderRadius:'12px',padding:'12px 18px',zIndex:'900',
    display:'flex',alignItems:'center',gap:'10px',animation:'slideDown .4s ease both',
    boxShadow:'0 8px 32px rgba(0,0,0,0.4)'
  }}, '<span style="font-size:24px">' + def.icon + '</span><div><div style="font-size:10px;color:#7EC8E3;font-weight:700">업적 달성!</div><div style="font-size:12px;color:#fff;font-weight:600">' + def.name + '</div><div style="font-size:9px;color:#8BA4C4">' + def.desc + '</div></div>');
  document.body.appendChild(toast);
  SFX6.play('encyclopedia');
  setTimeout(() => { toast.style.animation = 'slideUp .3s ease both'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// ─── 데이터 접근 헬퍼 ────────────────────────────────────────────
function getAllData() {
  try {
    const root = document.getElementById('root');
    if (root && root._reactRootContainer) {
      const fiber = root._reactRootContainer._internalRoot?.current;
      if (fiber) {
        let node = fiber;
        const queue = [node];
        while (queue.length) {
          const n = queue.shift();
          if (n.memoizedState) {
            let s = n.memoizedState;
            while (s) {
              if (s.queue && Array.isArray(s.queue.lastRenderedState) && s.queue.lastRenderedState.length > 100 && Array.isArray(s.queue.lastRenderedState[0])) {
                return s.queue.lastRenderedState;
              }
              s = s.next;
            }
          }
          if (n.child) queue.push(n.child);
          if (n.sibling) queue.push(n.sibling);
        }
      }
    }
  } catch(e) {}
  return lsGet('cc-data-v10', []);
}

// ─── 퀵 액션 버튼 삽입 ──────────────────────────────────────────
function insertQuickActions() {
  const existing = document.getElementById('v6-quick-actions');
  if (existing) return;

  const container = ce('div', { id: 'v6-quick-actions', style: {
    position: 'fixed', bottom: '80px', left: '50%', transform: 'translateX(-50%)',
    display: 'flex', gap: '6px', zIndex: '85', flexWrap: 'wrap', justifyContent: 'center',
    background: 'rgba(12,21,37,0.9)', backdropFilter: 'blur(10px)',
    border: '1px solid rgba(126,200,227,0.15)', borderRadius: '16px', padding: '8px 12px',
    maxWidth: '95vw'
  }});

  const buttons = [
    { label: '&#x1F4DA; 로드맵', fn: showRoadmap, key: '1' },
    { label: '&#x1F3E2; 센터비교', fn: showCenterCompare, key: '2' },
    { label: '&#x1F324;&#xFE0F; 시즌', fn: showSeasonRecommend, key: '3' },
    { label: '&#x1F4C5; 캘린더', fn: showMonthlyCalendar, key: '4' },
    { label: '&#x1F4CA; 리뷰인사이트', fn: showReviewInsights, key: '5' },
    { label: '&#x23F0; D-Day', fn: showDDay, key: '6' },
    { label: '&#x1F9E0; 성향테스트', fn: showPersonalityTest, key: '7' },
    { label: '&#x1F4E8; 다이제스트', fn: showWeeklyDigest, key: '8' },
    { label: '&#x1F4D6; 백과사전', fn: showEncyclopedia, key: '9' },
    { label: '&#x1F4DD; 퀴즈v6', fn: showQuizV6, key: '0' }
  ];

  buttons.forEach(({ label, fn, key }) => {
    const btn = ce('button', {
      style: {
        background: 'rgba(126,200,227,0.08)', border: '1px solid rgba(126,200,227,0.15)',
        borderRadius: '10px', padding: '5px 10px', fontSize: '10px', fontWeight: '600',
        color: '#7EC8E3', cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit',
        whiteSpace: 'nowrap'
      },
      title: key + '키로 열기'
    }, label);
    btn.onmouseenter = () => { btn.style.background = 'rgba(126,200,227,0.2)'; btn.style.borderColor = 'rgba(126,200,227,0.4)'; };
    btn.onmouseleave = () => { btn.style.background = 'rgba(126,200,227,0.08)'; btn.style.borderColor = 'rgba(126,200,227,0.15)'; };
    btn.onclick = fn;
    container.appendChild(btn);
  });

  const toggleBtn = ce('button', {
    id: 'v6-qa-toggle',
    style: {
      position: 'fixed', bottom: '80px', right: '70px', width: '36px', height: '36px',
      borderRadius: '50%', background: 'linear-gradient(135deg,#7EC8E3,#3AAFA9)',
      border: 'none', color: '#0A1628', fontSize: '16px', fontWeight: '900',
      cursor: 'pointer', zIndex: '86', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    title: 'v6 기능 메뉴'
  }, '&#x2699;');

  let visible = false;
  container.style.display = 'none';
  toggleBtn.onclick = () => {
    visible = !visible;
    container.style.display = visible ? 'flex' : 'none';
    toggleBtn.innerHTML = visible ? '&#x2716;' : '&#x2699;';
  };

  document.body.appendChild(container);
  document.body.appendChild(toggleBtn);
}

// ─── 키보드 단축키 (Shift+숫자) ─────────────────────────────────
function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;
    if (!e.shiftKey) return;

    const map = {
      '1': showRoadmap,
      '2': showCenterCompare,
      '3': showSeasonRecommend,
      '4': showMonthlyCalendar,
      '5': showReviewInsights,
      '6': showDDay,
      '7': showPersonalityTest,
      '8': showWeeklyDigest,
      '9': showEncyclopedia,
      '0': showQuizV6
    };

    if (map[e.key]) {
      e.preventDefault();
      map[e.key]();
    }
  });
}

// ─── CSS 애니메이션 추가 ─────────────────────────────────────────
function injectStyles() {
  if (document.getElementById('v6-styles')) return;
  const style = ce('style', { id: 'v6-styles' });
  style.textContent = '@keyframes slideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}' +
    '@keyframes slideUp{from{transform:translateY(0);opacity:1}to{transform:translateY(-20px);opacity:0}}';
  document.head.appendChild(style);
}

// ─── 학습일 자동 체크 (7일 업적) ─────────────────────────────────
function checkStudyStreak() {
  const days = lsGet('cc-study-days', {});
  if (Object.keys(days).length >= 7) checkAchievement('study_7days');
}

// ─── 초기화 ──────────────────────────────────────────────────────
function init() {
  injectStyles();
  setTimeout(() => {
    insertQuickActions();
    initKeyboard();
    checkStudyStreak();
  }, 2000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
