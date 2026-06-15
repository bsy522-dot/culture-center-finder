/**
 * culture-center-finder v5.0 patch
 * 수강리뷰+가격분석+센터프로필+학습플래너+공유카드+업적30개+시간대히트맵+퀴즈15문+탐색통계+난이도가이드
 */
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

// ─── 1. 수강 리뷰 시스템 ────────────────────────────────────────────
const Reviews = {
  _key: 'cc-reviews',
  getAll() {
    try { return JSON.parse(localStorage.getItem(this._key) || '{}'); } catch(e) { return {}; }
  },
  getForCourse(idx) {
    const all = this.getAll();
    return all[idx] || null;
  },
  save(idx, rating, comment) {
    const all = this.getAll();
    all[idx] = { rating, comment, ts: Date.now() };
    try { localStorage.setItem(this._key, JSON.stringify(all)); } catch(e) {}
    Achievements.check('review_first');
    const count = Object.keys(all).length;
    if (count >= 5) Achievements.check('review_5');
    if (count >= 20) Achievements.check('review_20');
  },
  remove(idx) {
    const all = this.getAll();
    delete all[idx];
    try { localStorage.setItem(this._key, JSON.stringify(all)); } catch(e) {}
  },
  getStats() {
    const all = this.getAll();
    const entries = Object.values(all);
    if (!entries.length) return { count: 0, avg: 0 };
    const sum = entries.reduce((s, r) => s + r.rating, 0);
    return { count: entries.length, avg: (sum / entries.length).toFixed(1) };
  }
};

// ─── 2. 학습 플래너 ─────────────────────────────────────────────────
const Planner = {
  _key: 'cc-planner',
  getAll() {
    try { return JSON.parse(localStorage.getItem(this._key) || '[]'); } catch(e) { return []; }
  },
  add(courseIdx, day, memo) {
    const plans = this.getAll();
    plans.push({ courseIdx, day, memo, created: Date.now(), done: false });
    try { localStorage.setItem(this._key, JSON.stringify(plans)); } catch(e) {}
    Achievements.check('planner_first');
    if (plans.length >= 5) Achievements.check('planner_5');
  },
  toggle(idx) {
    const plans = this.getAll();
    if (plans[idx]) {
      plans[idx].done = !plans[idx].done;
      try { localStorage.setItem(this._key, JSON.stringify(plans)); } catch(e) {}
      if (plans[idx].done) {
        const doneCount = plans.filter(p => p.done).length;
        if (doneCount >= 10) Achievements.check('planner_done_10');
      }
    }
  },
  remove(idx) {
    const plans = this.getAll();
    plans.splice(idx, 1);
    try { localStorage.setItem(this._key, JSON.stringify(plans)); } catch(e) {}
  },
  getWeekSummary() {
    const plans = this.getAll();
    const days = ['월','화','수','목','금','토','일'];
    const summary = {};
    days.forEach(d => summary[d] = []);
    plans.forEach((p, i) => {
      if (p.day && summary[p.day]) summary[p.day].push({ ...p, idx: i });
    });
    return summary;
  }
};

// ─── 3. 탐색 이력 추적 ─────────────────────────────────────────────
const Explorer = {
  _key: 'cc-explore-stats',
  get() {
    try {
      return JSON.parse(localStorage.getItem(this._key) || '{"views":0,"searches":0,"filters":0,"favActions":0,"sessions":0,"firstVisit":null,"cats":{},"regions":{},"days":{}}');
    } catch(e) {
      return {views:0,searches:0,filters:0,favActions:0,sessions:0,firstVisit:null,cats:{},regions:{},days:{}};
    }
  },
  save(stats) {
    try { localStorage.setItem(this._key, JSON.stringify(stats)); } catch(e) {}
  },
  trackView(course) {
    const s = this.get();
    s.views++;
    if (course) {
      const cat = course[3] || '기타';
      s.cats[cat] = (s.cats[cat] || 0) + 1;
      const addr = course[15] || '';
      const region = addr.match(/(서울|경기|인천|부산|대구|대전|광주|울산|세종|강원|충북|충남|전북|전남|경북|경남|제주)/);
      if (region) s.regions[region[1]] = (s.regions[region[1]] || 0) + 1;
    }
    this.save(s);
    if (s.views >= 10) Achievements.check('explorer_10');
    if (s.views >= 50) Achievements.check('explorer_50');
    if (s.views >= 200) Achievements.check('explorer_200');
  },
  trackSearch() {
    const s = this.get();
    s.searches++;
    this.save(s);
    if (s.searches >= 10) Achievements.check('searcher_10');
    if (s.searches >= 50) Achievements.check('searcher_50');
  },
  trackFilter() {
    const s = this.get();
    s.filters++;
    this.save(s);
    if (s.filters >= 20) Achievements.check('filter_master');
  },
  initSession() {
    const s = this.get();
    s.sessions++;
    if (!s.firstVisit) s.firstVisit = Date.now();
    this.save(s);
    if (s.sessions >= 7) Achievements.check('regular_visitor');
    if (s.sessions >= 30) Achievements.check('power_user');
  }
};

// ─── 4. 업적 시스템 ─────────────────────────────────────────────────
const ACHIEVEMENT_DEFS = [
  { id: 'first_visit', name: '첫 방문', desc: '문화센터 파인더에 처음 방문', icon: '🎉' },
  { id: 'explorer_10', name: '탐험가', desc: '강좌 10개 이상 열람', icon: '🔍' },
  { id: 'explorer_50', name: '고급 탐험가', desc: '강좌 50개 이상 열람', icon: '🧭' },
  { id: 'explorer_200', name: '마스터 탐험가', desc: '강좌 200개 이상 열람', icon: '🏆' },
  { id: 'searcher_10', name: '검색왕', desc: '검색 10회 이상', icon: '🔎' },
  { id: 'searcher_50', name: '검색 마스터', desc: '검색 50회 이상', icon: '💎' },
  { id: 'filter_master', name: '필터 달인', desc: '필터 20회 이상 사용', icon: '🎯' },
  { id: 'review_first', name: '첫 리뷰', desc: '강좌 리뷰 1개 작성', icon: '✍️' },
  { id: 'review_5', name: '리뷰어', desc: '리뷰 5개 이상 작성', icon: '📝' },
  { id: 'review_20', name: '리뷰 마스터', desc: '리뷰 20개 이상 작성', icon: '📚' },
  { id: 'fav_first', name: '첫 즐겨찾기', desc: '강좌 즐겨찾기 1개 추가', icon: '⭐' },
  { id: 'fav_10', name: '수집가', desc: '즐겨찾기 10개 이상', icon: '🌟' },
  { id: 'fav_30', name: '수집 마스터', desc: '즐겨찾기 30개 이상', icon: '💫' },
  { id: 'planner_first', name: '계획의 시작', desc: '학습 플래너에 1개 추가', icon: '📅' },
  { id: 'planner_5', name: '계획적 학습자', desc: '플래너 5개 이상 등록', icon: '📋' },
  { id: 'planner_done_10', name: '실행력 갑', desc: '플래너 완료 10개 달성', icon: '✅' },
  { id: 'alert_first', name: '알림 설정', desc: '강좌 알림 1개 설정', icon: '🔔' },
  { id: 'share_first', name: '공유왕', desc: '공유 카드 1회 생성', icon: '🎴' },
  { id: 'quiz_first', name: '퀴즈 도전', desc: '퀴즈 첫 도전', icon: '❓' },
  { id: 'quiz_perfect', name: '퀴즈 만점', desc: '퀴즈 만점 달성', icon: '💯' },
  { id: 'regular_visitor', name: '단골 손님', desc: '7회 이상 방문', icon: '🏠' },
  { id: 'power_user', name: '파워 유저', desc: '30회 이상 방문', icon: '⚡' },
  { id: 'timetable_user', name: '시간표 활용', desc: '시간표 기능 사용', icon: '🕐' },
  { id: 'ai_user', name: 'AI 추천 체험', desc: 'AI 추천 기능 사용', icon: '🤖' },
  { id: 'dark_toggle', name: '테마 전환', desc: '다크/라이트 모드 전환', icon: '🌙' },
  { id: 'price_analyst', name: '가격 분석가', desc: '가격 분석 기능 사용', icon: '💰' },
  { id: 'center_explorer', name: '센터 탐방', desc: '센터 프로필 5회 열람', icon: '🏛️' },
  { id: 'heatmap_user', name: '시간 분석가', desc: '시간대 히트맵 열람', icon: '🗺️' },
  { id: 'all_regions', name: '전국 탐방', desc: '5개 이상 지역 강좌 열람', icon: '🗾' },
  { id: 'cat_explorer', name: '다재다능', desc: '10개 이상 종목 탐색', icon: '🎭' }
];

const Achievements = {
  _key: 'cc-achievements',
  getUnlocked() {
    try { return JSON.parse(localStorage.getItem(this._key) || '[]'); } catch(e) { return []; }
  },
  check(id) {
    const unlocked = this.getUnlocked();
    if (unlocked.includes(id)) return false;
    unlocked.push(id);
    try { localStorage.setItem(this._key, JSON.stringify(unlocked)); } catch(e) {}
    const def = ACHIEVEMENT_DEFS.find(a => a.id === id);
    if (def) this.showToast(def);
    return true;
  },
  showToast(def) {
    const existing = document.getElementById('v5-achieve-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'v5-achieve-toast';
    toast.style.cssText = 'position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#1E3A5F,#0C1525);border:1px solid rgba(126,200,227,0.4);border-radius:12px;padding:12px 18px;z-index:800;display:flex;align-items:center;gap:10px;animation:slideDown .4s ease both;box-shadow:0 8px 32px rgba(0,0,0,0.4)';
    toast.innerHTML = `<span style="font-size:24px">${def.icon}</span><div><div style="font-size:10px;color:#7EC8E3;font-weight:700">업적 달성!</div><div style="font-size:12px;color:#fff;font-weight:600">${def.name}</div><div style="font-size:9px;color:#8BA4C4">${def.desc}</div></div>`;
    document.body.appendChild(toast);
    if (window.__v4patch && window.__v4patch.SFX) window.__v4patch.SFX.play('success');
    setTimeout(() => { toast.style.animation = 'slideUp .3s ease both'; setTimeout(() => toast.remove(), 300); }, 3000);
  },
  getProgress() {
    const unlocked = this.getUnlocked();
    return { unlocked: unlocked.length, total: ACHIEVEMENT_DEFS.length, pct: Math.round(unlocked.length / ACHIEVEMENT_DEFS.length * 100) };
  }
};

// ─── 5. 가격 분석 엔진 ─────────────────────────────────────────────
function analyzePrices(data) {
  const byCat = {};
  const byCenter = {};
  const priceRanges = { free: 0, under5: 0, under10: 0, under20: 0, over20: 0 };
  let totalWithPrice = 0;
  let totalPrice = 0;

  data.forEach(r => {
    const priceStr = (r[8] || '').replace(/[^0-9]/g, '');
    const price = parseInt(priceStr) || 0;
    if (price <= 0) return;
    totalWithPrice++;
    totalPrice += price;

    const cat = r[3] || '기타';
    if (!byCat[cat]) byCat[cat] = { sum: 0, count: 0, min: Infinity, max: 0 };
    byCat[cat].sum += price;
    byCat[cat].count++;
    byCat[cat].min = Math.min(byCat[cat].min, price);
    byCat[cat].max = Math.max(byCat[cat].max, price);

    const center = r[1] || '기타';
    if (!byCenter[center]) byCenter[center] = { sum: 0, count: 0 };
    byCenter[center].sum += price;
    byCenter[center].count++;

    if (price === 0) priceRanges.free++;
    else if (price <= 50000) priceRanges.under5++;
    else if (price <= 100000) priceRanges.under10++;
    else if (price <= 200000) priceRanges.under20++;
    else priceRanges.over20++;
  });

  const catAvg = Object.entries(byCat)
    .map(([cat, d]) => ({ cat, avg: Math.round(d.sum / d.count), count: d.count, min: d.min, max: d.max }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const centerAvg = Object.entries(byCenter)
    .map(([center, d]) => ({ center, avg: Math.round(d.sum / d.count), count: d.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalWithPrice,
    avgPrice: totalWithPrice ? Math.round(totalPrice / totalWithPrice) : 0,
    priceRanges,
    catAvg,
    centerAvg
  };
}

// ─── 6. 시간대 히트맵 분석 ──────────────────────────────────────────
function analyzeTimeSlots(data) {
  const days = ['월','화','수','목','금','토','일'];
  const hours = Array.from({length: 14}, (_, i) => i + 7);
  const grid = {};
  days.forEach(d => { grid[d] = {}; hours.forEach(h => grid[d][h] = 0); });

  data.forEach(r => {
    const dayStr = r[6] || '';
    const timeStr = r[7] || '';
    const hourMatch = timeStr.match(/(\d{1,2}):/);
    if (!hourMatch) return;
    const hour = parseInt(hourMatch[1]);
    if (hour < 7 || hour > 20) return;
    days.forEach(d => {
      if (dayStr.includes(d)) grid[d][hour]++;
    });
  });

  let maxCount = 0;
  days.forEach(d => hours.forEach(h => { if (grid[d][h] > maxCount) maxCount = grid[d][h]; }));
  return { grid, days, hours, maxCount };
}

// ─── 7. 센터 프로필 분석 ────────────────────────────────────────────
let centerViewCount = 0;
function buildCenterProfile(data, centerName) {
  const courses = [];
  const cats = {};
  const days = {};
  const prices = [];
  data.forEach((r, i) => {
    if (r[1] === centerName) {
      courses.push({ r, i });
      cats[r[3]] = (cats[r[3]] || 0) + 1;
      const dayStr = r[6] || '';
      ['월','화','수','목','금','토','일'].forEach(d => {
        if (dayStr.includes(d)) days[d] = (days[d] || 0) + 1;
      });
      const p = parseInt((r[8] || '').replace(/[^0-9]/g, '')) || 0;
      if (p > 0) prices.push(p);
    }
  });
  const avgPrice = prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0;
  centerViewCount++;
  if (centerViewCount >= 5) Achievements.check('center_explorer');
  return {
    name: centerName,
    total: courses.length,
    topCats: Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 8),
    dayDist: days,
    avgPrice,
    priceRange: prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null
  };
}

// ─── 8. 난이도 가이드 ───────────────────────────────────────────────
const DIFFICULTY_GUIDE = [
  {
    level: '입문',
    color: '#34D399',
    desc: '처음 시작하는 분께 추천',
    cats: ['체험','원데이클래스','걷기','스트레칭','독서/글쓰기','보드게임/놀이'],
    tips: ['편안한 복장으로 참여하세요','준비물은 센터에서 제공하는 경우가 많습니다','친구와 함께 하면 더 즐겁습니다']
  },
  {
    level: '초급',
    color: '#60A5FA',
    desc: '기초를 배우고 싶은 분',
    cats: ['수영','요가','피아노','미술','댄스','발레','기타연주','뜨개질','서예'],
    tips: ['주 1~2회 꾸준히 참여하세요','강사님께 궁금한 점을 적극 질문하세요','복습이 실력 향상의 핵심입니다']
  },
  {
    level: '중급',
    color: '#FBBF24',
    desc: '기본기를 갖추고 실력을 키우고 싶은 분',
    cats: ['자격증/시험','외국어회화','IT/디지털','재테크/경제','메이크업'],
    tips: ['실습 위주 강좌를 선택하세요','동료 수강생과 스터디 그룹을 만들어보세요','관련 자격증 취득을 목표로 설정하세요']
  },
  {
    level: '상급',
    color: '#EF4444',
    desc: '전문 수준을 목표하는 분',
    cats: ['자격증(전문)','프로그래밍','바리스타','소믈리에','퍼스널컬러'],
    tips: ['포트폴리오를 만들어보세요','현업 전문가 강사의 수업을 선택하세요','관련 커뮤니티에 참여하세요']
  }
];

// ─── 9. 문화센터 퀴즈 ──────────────────────────────────────────────
const QUIZ_DATA = [
  { q: '대한민국에서 가장 많은 문화센터 강좌를 운영하는 지역은?', a: ['서울','경기','인천','부산'], c: 0, exp: '서울이 가장 많은 문화센터 강좌를 보유하고 있습니다.' },
  { q: '문화센터 강좌 중 가장 인기 있는 종목 카테고리는?', a: ['미술','수영','요가','댄스'], c: 2, exp: '요가는 전 연령대에서 꾸준히 인기 있는 종목입니다.' },
  { q: '문화센터는 주로 어디에 위치해 있나요?', a: ['공공기관','대형마트/백화점','학교','병원'], c: 1, exp: '홈플러스, 롯데마트, 백화점 등 대형 유통시설 내 문화센터가 많습니다.' },
  { q: '문화센터 수강료의 평균 범위는?', a: ['무료~3만원','5만~10만원','10만~20만원','20만원 이상'], c: 1, exp: '대부분의 문화센터 강좌는 월 5~10만원 수준입니다.' },
  { q: '원데이 클래스의 일반적인 수업 시간은?', a: ['30분','1~2시간','3~4시간','하루 종일'], c: 1, exp: '원데이 클래스는 보통 1~2시간 진행됩니다.' },
  { q: '문화센터 강좌 접수는 보통 언제 시작하나요?', a: ['상시접수','매월 초','분기별','연초 1회'], c: 1, exp: '대부분의 문화센터는 매월 초에 다음 달 강좌 접수를 시작합니다.' },
  { q: '시니어 전용 문화센터 프로그램의 주요 대상 연령은?', a: ['40대 이상','50대 이상','60대 이상','70대 이상'], c: 1, exp: '시니어 프로그램은 보통 50대 이상을 대상으로 합니다.' },
  { q: '문화센터에서 가장 많이 운영하는 어린이 프로그램은?', a: ['수영','미술','발레','영어'], c: 1, exp: '어린이 미술 교실은 거의 모든 문화센터에서 운영합니다.' },
  { q: '문화센터 강좌 할인 혜택으로 가장 흔한 것은?', a: ['조기등록 할인','다수강좌 할인','가족 할인','SNS 공유 할인'], c: 0, exp: '조기 등록(얼리버드) 할인이 가장 보편적입니다.' },
  { q: '온라인 문화센터 강좌가 크게 늘어난 계기는?', a: ['스마트폰 보급','코로나19','5G 도입','메타버스 유행'], c: 1, exp: '2020년 코로나19 팬데믹으로 온라인 강좌가 대폭 확대되었습니다.' },
  { q: '문화센터 강좌 환불 기준으로 맞는 것은?', a: ['개강 전 전액','수강 1/3 전 2/3 환불','수강 후 환불 불가','언제든 전액 환불'], c: 1, exp: '소비자보호법에 따라 수강 1/3 경과 전에는 2/3 환불이 가능합니다.' },
  { q: '국내 대형마트 문화센터 중 가장 오래된 곳은?', a: ['이마트','홈플러스','롯데마트','하나로마트'], c: 0, exp: '이마트 문화센터가 국내 대형마트 중 가장 먼저 시작했습니다.' },
  { q: '문화센터 수강 시 가장 중요한 선택 기준은?', a: ['가격','위치/접근성','강사','시간대'], c: 1, exp: '설문조사에 따르면 위치와 접근성이 가장 중요한 선택 요소입니다.' },
  { q: '부모-아이 함께 수강하는 프로그램의 인기 종목은?', a: ['수영','요리','미술','체조'], c: 2, exp: '부모-아이 미술 교실이 가장 인기 있는 동반 수업입니다.' },
  { q: '문화센터 강좌의 일반적인 한 학기 기간은?', a: ['1개월','2~3개월','6개월','1년'], c: 1, exp: '대부분 2~3개월(한 분기) 단위로 운영됩니다.' }
];

// ─── 10. 공유 카드 생성 (Canvas) ────────────────────────────────────
function generateShareCard() {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 380;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 600, 380);
  grad.addColorStop(0, '#0C1525');
  grad.addColorStop(0.5, '#162040');
  grad.addColorStop(1, '#0C1525');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 600, 380);

  ctx.strokeStyle = 'rgba(126,200,227,0.3)';
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, 584, 364);

  ctx.fillStyle = '#7EC8E3';
  ctx.font = 'bold 22px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('문화센터 강좌 파인더', 300, 45);

  ctx.fillStyle = '#8BA4C4';
  ctx.font = '12px -apple-system, sans-serif';
  ctx.fillText('나의 탐색 현황', 300, 68);

  const stats = Explorer.get();
  const reviewStats = Reviews.getStats();
  const achProgress = Achievements.getProgress();
  const favCount = (JSON.parse(localStorage.getItem('cc-fav') || '[]')).length;

  const cards = [
    { label: '열람 강좌', value: stats.views.toLocaleString(), icon: '🔍' },
    { label: '검색 횟수', value: stats.searches.toLocaleString(), icon: '🔎' },
    { label: '즐겨찾기', value: favCount.toString(), icon: '⭐' },
    { label: '리뷰 작성', value: reviewStats.count.toString(), icon: '✍️' },
    { label: '업적 달성', value: `${achProgress.unlocked}/${achProgress.total}`, icon: '🏆' },
    { label: '방문 횟수', value: stats.sessions.toString(), icon: '📊' }
  ];

  const cardW = 160, cardH = 80, gap = 20, startX = 60, startY = 95;
  cards.forEach((c, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = startX + col * (cardW + gap);
    const y = startY + row * (cardH + gap);

    ctx.fillStyle = 'rgba(126,200,227,0.08)';
    ctx.beginPath();
    ctx.roundRect(x, y, cardW, cardH, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(126,200,227,0.2)';
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${c.icon} ${c.value}`, x + cardW / 2, y + 38);

    ctx.fillStyle = '#8BA4C4';
    ctx.font = '11px -apple-system, sans-serif';
    ctx.fillText(c.label, x + cardW / 2, y + 60);
  });

  const topCats = Object.entries(stats.cats).sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (topCats.length) {
    ctx.fillStyle = '#8BA4C4';
    ctx.font = '11px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('관심 종목: ' + topCats.map(e => e[0]).join(', '), 300, 305);
  }

  ctx.fillStyle = 'rgba(126,200,227,0.5)';
  ctx.font = '10px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  const dateStr = new Date().toLocaleDateString('ko-KR');
  ctx.fillText(`PRIME Holdings | ${dateStr}`, 300, 355);

  Achievements.check('share_first');
  return canvas;
}

// ─── 11. Web Audio SFX 추가 (v5 전용) ──────────────────────────────
const V5SFX = {
  play(type) {
    if (!window.__v4patch || !window.__v4patch.SFX) return;
    const sfx = window.__v4patch.SFX;
    sfx.init();
    if (!sfx.ctx) return;
    const osc = sfx.ctx.createOscillator();
    const gain = sfx.ctx.createGain();
    osc.connect(gain);
    gain.connect(sfx.ctx.destination);
    gain.gain.value = 0.06;
    const t = sfx.ctx.currentTime;
    switch(type) {
      case 'achievement':
        osc.type = 'sine';
        osc.frequency.value = 523;
        osc.frequency.linearRampToValueAtTime(784, t + 0.1);
        osc.frequency.linearRampToValueAtTime(1047, t + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.start(t); osc.stop(t + 0.35);
        break;
      case 'quiz_correct':
        osc.type = 'sine';
        osc.frequency.value = 660;
        osc.frequency.linearRampToValueAtTime(880, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t); osc.stop(t + 0.2);
        break;
      case 'quiz_wrong':
        osc.type = 'sawtooth';
        osc.frequency.value = 220;
        osc.frequency.linearRampToValueAtTime(180, t + 0.15);
        gain.gain.value = 0.03;
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t); osc.stop(t + 0.2);
        break;
      case 'planner':
        osc.type = 'triangle';
        osc.frequency.value = 440;
        osc.frequency.linearRampToValueAtTime(550, t + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.start(t); osc.stop(t + 0.12);
        break;
      case 'review':
        osc.type = 'sine';
        osc.frequency.value = 392;
        osc.frequency.linearRampToValueAtTime(523, t + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.start(t); osc.stop(t + 0.18);
        break;
      case 'share':
        osc.type = 'sine';
        osc.frequency.value = 587;
        osc.frequency.linearRampToValueAtTime(784, t + 0.08);
        osc.frequency.linearRampToValueAtTime(1047, t + 0.16);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.start(t); osc.stop(t + 0.25);
        break;
    }
  }
};

// ─── 12. v5 상태 + CSS 주입 ─────────────────────────────────────────
let v5State = {
  showPriceAnalysis: false,
  showHeatmap: false,
  showPlanner: false,
  showAchievements: false,
  showQuiz: false,
  showDiffGuide: false,
  showCenterProfile: null,
  showShareCard: false,
  showExploreStats: false,
  quizIdx: 0,
  quizScore: 0,
  quizAnswered: []
};

function injectV5CSS() {
  const style = document.createElement('style');
  style.id = 'v5-css';
  style.textContent = `
    @keyframes slideDown{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes progressGrow{from{width:0}to{width:var(--target-width)}}
    .v5-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:500;backdrop-filter:blur(6px);animation:fadeIn .2s ease}
    .v5-card{background:var(--modal-bg);border:1px solid var(--modal-border);border-radius:16px;padding:24px;max-width:550px;width:92%;max-height:85vh;overflow-y:auto;animation:modalIn .25s ease;box-shadow:var(--shadow)}
    .v5-card h3{font-size:16px;color:var(--text-primary);margin-bottom:12px;font-weight:700}
    .v5-close{background:var(--input-bg);border:1px solid var(--input-border);border-radius:8px;padding:6px 16px;font-size:11px;color:var(--text-secondary);cursor:pointer;font-family:inherit;transition:all .2s}
    .v5-close:hover{background:var(--filter-active-bg);color:var(--accent);border-color:var(--accent)}
    .v5-bar{height:20px;background:var(--bar-bg);border-radius:4px;overflow:hidden;margin:4px 0}
    .v5-bar-fill{height:100%;border-radius:4px;transition:width .6s ease}
    .v5-heatmap{display:grid;gap:2px;font-size:8px}
    .v5-heat-cell{border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:8px;color:rgba(255,255,255,0.7);transition:transform .15s}
    .v5-heat-cell:hover{transform:scale(1.15);z-index:1}
    .v5-quiz-option{display:block;width:100%;text-align:left;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;padding:10px 14px;margin:6px 0;font-size:12px;color:var(--text-primary);cursor:pointer;font-family:inherit;transition:all .2s}
    .v5-quiz-option:hover{background:var(--card-hover);border-color:var(--accent)}
    .v5-quiz-option.correct{background:rgba(52,211,153,0.15);border-color:#34D399;color:#34D399}
    .v5-quiz-option.wrong{background:rgba(239,68,68,0.1);border-color:#EF4444;color:#EF4444}
    .v5-quiz-option:disabled{cursor:default;opacity:0.8}
    .v5-achieve-card{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin:4px 0;transition:all .2s}
    .v5-achieve-card.unlocked{border-color:rgba(126,200,227,0.3);background:rgba(126,200,227,0.05)}
    .v5-achieve-card.locked{opacity:0.4;filter:grayscale(1)}
    .v5-star{cursor:pointer;font-size:20px;transition:transform .15s}
    .v5-star:hover{transform:scale(1.2)}
    .v5-planner-day{background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;padding:10px;margin:4px 0}
    .v5-planner-item{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--card-border);font-size:11px}
    .v5-planner-item:last-child{border-bottom:none}
    .v5-center-stat{display:inline-flex;flex-direction:column;align-items:center;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;padding:8px 12px;min-width:70px;text-align:center}
    .v5-diff-card{background:var(--card-bg);border-left:3px solid;border-radius:0 8px 8px 0;padding:14px 16px;margin:8px 0}
    @media(max-width:768px){
      .v5-card{padding:18px;max-width:100%;width:96%}
      .v5-heatmap{font-size:7px}
    }
  `;
  document.head.appendChild(style);
}

// ─── 13. 렌더링 함수들 ──────────────────────────────────────────────

function renderPriceAnalysis() {
  closeAllV5Overlays();
  const data = window.__v4Data || [];
  if (!data.length) return;
  const analysis = analyzePrices(data);
  Achievements.check('price_analyst');

  const overlay = document.createElement('div');
  overlay.className = 'v5-overlay';
  overlay.id = 'v5-price-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  const rangeLabels = ['무료','~5만원','~10만원','~20만원','20만원+'];
  const rangeValues = [analysis.priceRanges.free, analysis.priceRanges.under5, analysis.priceRanges.under10, analysis.priceRanges.under20, analysis.priceRanges.over20];
  const rangeMax = Math.max(...rangeValues);
  const rangeColors = ['#34D399','#60A5FA','#FBBF24','#F97316','#EF4444'];

  let html = `<div class="v5-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <h3>💰 가격 분석 대시보드</h3>
    <button class="v5-close" onclick="document.getElementById('v5-price-overlay').remove()">닫기</button>
  </div>`;

  html += `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">
    <div class="sc"><div class="n">${analysis.totalWithPrice.toLocaleString()}</div><div class="l">가격 정보 있는 강좌</div></div>
    <div class="sc"><div class="n">${analysis.avgPrice.toLocaleString()}원</div><div class="l">평균 수강료</div></div>
    <div class="sc"><div class="n">${analysis.catAvg.length}</div><div class="l">종목별 분석</div></div>
  </div>`;

  html += '<div style="margin-bottom:16px"><div style="font-size:12px;color:var(--text-primary);font-weight:600;margin-bottom:8px">가격대별 분포</div>';
  rangeLabels.forEach((label, i) => {
    const pct = rangeMax ? Math.round(rangeValues[i] / rangeMax * 100) : 0;
    html += `<div style="display:flex;align-items:center;gap:8px;margin:4px 0">
      <span style="font-size:10px;color:var(--text-secondary);width:55px;text-align:right">${label}</span>
      <div class="v5-bar" style="flex:1"><div class="v5-bar-fill" style="width:${pct}%;background:${rangeColors[i]}"></div></div>
      <span style="font-size:10px;color:var(--text-muted);width:50px">${rangeValues[i].toLocaleString()}</span>
    </div>`;
  });
  html += '</div>';

  html += '<div style="margin-bottom:12px"><div style="font-size:12px;color:var(--text-primary);font-weight:600;margin-bottom:8px">종목별 평균 수강료 TOP 15</div>';
  const catMax = Math.max(...analysis.catAvg.map(c => c.avg));
  analysis.catAvg.forEach(c => {
    const pct = catMax ? Math.round(c.avg / catMax * 100) : 0;
    html += `<div style="display:flex;align-items:center;gap:8px;margin:3px 0">
      <span style="font-size:9px;color:var(--text-secondary);width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:right" title="${c.cat}">${c.cat}</span>
      <div class="v5-bar" style="flex:1;height:14px"><div class="v5-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,#7EC8E3,#3AAFA9)"></div></div>
      <span style="font-size:9px;color:var(--text-muted);width:65px">${c.avg.toLocaleString()}원</span>
    </div>`;
  });
  html += '</div></div>';

  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function renderHeatmap() {
  closeAllV5Overlays();
  const data = window.__v4Data || [];
  if (!data.length) return;
  const { grid, days, hours, maxCount } = analyzeTimeSlots(data);
  Achievements.check('heatmap_user');

  const overlay = document.createElement('div');
  overlay.className = 'v5-overlay';
  overlay.id = 'v5-heatmap-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  let html = `<div class="v5-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <h3>🗺️ 시간대별 강좌 히트맵</h3>
    <button class="v5-close" onclick="document.getElementById('v5-heatmap-overlay').remove()">닫기</button>
  </div>`;

  html += `<div class="v5-heatmap" style="grid-template-columns:40px repeat(${days.length},1fr)">`;
  html += '<div></div>';
  days.forEach(d => { html += `<div style="text-align:center;font-size:10px;font-weight:700;color:var(--accent);padding:4px">${d}</div>`; });

  hours.forEach(h => {
    html += `<div style="text-align:right;font-size:9px;color:var(--text-muted);padding:4px 4px 4px 0;line-height:28px">${h}시</div>`;
    days.forEach(d => {
      const count = grid[d][h];
      const intensity = maxCount ? count / maxCount : 0;
      const bg = intensity === 0 ? 'rgba(126,200,227,0.03)' :
                 intensity < 0.2 ? 'rgba(126,200,227,0.1)' :
                 intensity < 0.4 ? 'rgba(126,200,227,0.25)' :
                 intensity < 0.6 ? 'rgba(126,200,227,0.4)' :
                 intensity < 0.8 ? 'rgba(58,175,169,0.6)' : 'rgba(58,175,169,0.85)';
      html += `<div class="v5-heat-cell" style="background:${bg};height:28px" title="${d} ${h}시: ${count}개 강좌">${count || ''}</div>`;
    });
  });
  html += '</div>';

  html += `<div style="display:flex;align-items:center;gap:6px;justify-content:center;margin-top:12px;font-size:9px;color:var(--text-muted)">
    <span>적음</span>
    <div style="display:flex;gap:2px">
      <div style="width:16px;height:12px;background:rgba(126,200,227,0.03);border-radius:2px"></div>
      <div style="width:16px;height:12px;background:rgba(126,200,227,0.1);border-radius:2px"></div>
      <div style="width:16px;height:12px;background:rgba(126,200,227,0.25);border-radius:2px"></div>
      <div style="width:16px;height:12px;background:rgba(126,200,227,0.4);border-radius:2px"></div>
      <div style="width:16px;height:12px;background:rgba(58,175,169,0.6);border-radius:2px"></div>
      <div style="width:16px;height:12px;background:rgba(58,175,169,0.85);border-radius:2px"></div>
    </div>
    <span>많음</span>
  </div></div>`;

  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function renderPlanner() {
  closeAllV5Overlays();
  const data = window.__v4Data || [];
  const summary = Planner.getWeekSummary();
  const days = ['월','화','수','목','금','토','일'];
  const dayColors = ['#EF4444','#F97316','#FBBF24','#34D399','#60A5FA','#818CF8','#A855F7'];

  const overlay = document.createElement('div');
  overlay.className = 'v5-overlay';
  overlay.id = 'v5-planner-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  let html = `<div class="v5-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <h3>📋 학습 플래너</h3>
    <button class="v5-close" onclick="document.getElementById('v5-planner-overlay').remove()">닫기</button>
  </div>`;

  html += `<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
    <input id="v5-plan-memo" placeholder="강좌명 또는 메모" style="flex:1;min-width:120px;background:var(--input-bg);border:1px solid var(--input-border);border-radius:6px;padding:6px 10px;font-size:11px;color:var(--text-primary);outline:none;font-family:inherit"/>
    <select id="v5-plan-day" style="background:var(--input-bg);border:1px solid var(--input-border);border-radius:6px;padding:6px;font-size:10px;color:var(--text-primary);outline:none;font-family:inherit">
      ${days.map(d => `<option value="${d}">${d}요일</option>`).join('')}
    </select>
    <button class="v5-close" style="background:linear-gradient(135deg,var(--accent),var(--accent2));color:#0A1628;font-weight:700;border:none" onclick="window.__v5patch.addPlanFromUI()">추가</button>
  </div>`;

  days.forEach((d, di) => {
    const items = summary[d] || [];
    html += `<div class="v5-planner-day">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
        <span style="width:8px;height:8px;border-radius:50%;background:${dayColors[di]}"></span>
        <span style="font-size:12px;font-weight:700;color:var(--text-primary)">${d}요일</span>
        <span style="font-size:9px;color:var(--text-muted)">(${items.length}개)</span>
      </div>`;
    if (items.length === 0) {
      html += '<div style="font-size:10px;color:var(--text-muted);padding:4px 0">등록된 계획이 없습니다</div>';
    } else {
      items.forEach(item => {
        html += `<div class="v5-planner-item">
          <input type="checkbox" ${item.done ? 'checked' : ''} onchange="window.__v5patch.togglePlan(${item.idx})" style="cursor:pointer"/>
          <span style="flex:1;color:${item.done ? 'var(--text-muted)' : 'var(--text-primary)'};${item.done ? 'text-decoration:line-through' : ''}">${item.memo ? esc(item.memo) : '(미정)'}</span>
          <button style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:12px" onclick="window.__v5patch.removePlan(${item.idx})">&#x2715;</button>
        </div>`;
      });
    }
    html += '</div>';
  });

  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function renderAchievements() {
  closeAllV5Overlays();
  const unlocked = Achievements.getUnlocked();
  const progress = Achievements.getProgress();

  const overlay = document.createElement('div');
  overlay.className = 'v5-overlay';
  overlay.id = 'v5-achieve-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  let html = `<div class="v5-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <h3>🏆 업적 (${progress.unlocked}/${progress.total})</h3>
    <button class="v5-close" onclick="document.getElementById('v5-achieve-overlay').remove()">닫기</button>
  </div>`;

  html += `<div style="margin-bottom:16px">
    <div class="v5-bar" style="height:8px;border-radius:4px">
      <div class="v5-bar-fill" style="width:${progress.pct}%;background:linear-gradient(90deg,#7EC8E3,#3AAFA9);border-radius:4px"></div>
    </div>
    <div style="font-size:10px;color:var(--text-muted);margin-top:4px;text-align:center">${progress.pct}% 달성</div>
  </div>`;

  ACHIEVEMENT_DEFS.forEach(def => {
    const isUnlocked = unlocked.includes(def.id);
    html += `<div class="v5-achieve-card ${isUnlocked ? 'unlocked' : 'locked'}">
      <span style="font-size:24px">${def.icon}</span>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:600;color:${isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)'}">${def.name}</div>
        <div style="font-size:10px;color:var(--text-secondary)">${def.desc}</div>
      </div>
      ${isUnlocked ? '<span style="color:#34D399;font-size:14px;font-weight:700">&#x2713;</span>' : '<span style="color:var(--text-faint);font-size:10px">미달성</span>'}
    </div>`;
  });

  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function renderQuiz() {
  closeAllV5Overlays();
  v5State.quizIdx = 0;
  v5State.quizScore = 0;
  v5State.quizAnswered = [];
  Achievements.check('quiz_first');
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const existing = document.getElementById('v5-quiz-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'v5-overlay';
  overlay.id = 'v5-quiz-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  const idx = v5State.quizIdx;

  if (idx >= QUIZ_DATA.length) {
    const pct = Math.round(v5State.quizScore / QUIZ_DATA.length * 100);
    if (pct === 100) Achievements.check('quiz_perfect');
    let grade = pct >= 90 ? 'S' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    let gradeColor = pct >= 90 ? '#FFD700' : pct >= 80 ? '#34D399' : pct >= 70 ? '#60A5FA' : pct >= 60 ? '#FBBF24' : '#EF4444';

    let html = `<div class="v5-card" style="text-align:center">
      <div style="font-size:48px;margin-bottom:12px">🎓</div>
      <h3>퀴즈 완료!</h3>
      <div style="font-size:48px;font-weight:900;color:${gradeColor};margin:16px 0">${grade}</div>
      <div style="font-size:14px;color:var(--text-primary);margin-bottom:4px">${v5State.quizScore}/${QUIZ_DATA.length} 정답 (${pct}%)</div>
      <div style="font-size:11px;color:var(--text-secondary);margin-bottom:20px">${pct >= 80 ? '문화센터 전문가시네요!' : pct >= 60 ? '좋은 결과입니다!' : '다시 도전해보세요!'}</div>
      <div style="display:flex;gap:8px;justify-content:center">
        <button class="v5-close" onclick="window.__v5patch.renderQuiz()">다시 도전</button>
        <button class="v5-close" onclick="document.getElementById('v5-quiz-overlay').remove()">닫기</button>
      </div>
    </div>`;
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    return;
  }

  const q = QUIZ_DATA[idx];
  const answered = v5State.quizAnswered[idx] !== undefined;

  let html = `<div class="v5-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3>❓ 문화센터 퀴즈 (${idx + 1}/${QUIZ_DATA.length})</h3>
      <button class="v5-close" onclick="document.getElementById('v5-quiz-overlay').remove()">닫기</button>
    </div>
    <div class="v5-bar" style="height:4px;margin-bottom:16px"><div class="v5-bar-fill" style="width:${Math.round((idx / QUIZ_DATA.length) * 100)}%;background:linear-gradient(90deg,#7EC8E3,#3AAFA9)"></div></div>
    <div style="font-size:14px;color:var(--text-primary);font-weight:600;margin-bottom:16px;line-height:1.6">${q.q}</div>`;

  q.a.forEach((opt, oi) => {
    let cls = 'v5-quiz-option';
    if (answered) {
      if (oi === q.c) cls += ' correct';
      else if (oi === v5State.quizAnswered[idx] && oi !== q.c) cls += ' wrong';
    }
    html += `<button class="${cls}" ${answered ? 'disabled' : ''} onclick="window.__v5patch.answerQuiz(${oi})">${String.fromCharCode(9312 + oi)} ${opt}</button>`;
  });

  if (answered) {
    html += `<div style="background:${v5State.quizAnswered[idx] === q.c ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)'};border-radius:8px;padding:10px 14px;margin-top:12px;font-size:11px;color:var(--text-secondary);line-height:1.6">
      ${v5State.quizAnswered[idx] === q.c ? '✅ 정답!' : '❌ 오답'} ${q.exp}
    </div>
    <button class="v5-close" style="width:100%;margin-top:12px;text-align:center;padding:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#0A1628;font-weight:700;border:none" onclick="window.__v5patch.nextQuiz()">
      ${idx < QUIZ_DATA.length - 1 ? '다음 문제 →' : '결과 보기'}
    </button>`;
  }

  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function answerQuiz(choice) {
  const idx = v5State.quizIdx;
  if (v5State.quizAnswered[idx] !== undefined) return;
  v5State.quizAnswered[idx] = choice;
  if (choice === QUIZ_DATA[idx].c) {
    v5State.quizScore++;
    V5SFX.play('quiz_correct');
  } else {
    V5SFX.play('quiz_wrong');
  }
  renderQuizQuestion();
}

function nextQuiz() {
  v5State.quizIdx++;
  renderQuizQuestion();
}

function renderDiffGuide() {
  closeAllV5Overlays();

  const overlay = document.createElement('div');
  overlay.className = 'v5-overlay';
  overlay.id = 'v5-diff-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  let html = `<div class="v5-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <h3>📊 난이도별 강좌 가이드</h3>
    <button class="v5-close" onclick="document.getElementById('v5-diff-overlay').remove()">닫기</button>
  </div>`;

  DIFFICULTY_GUIDE.forEach(g => {
    html += `<div class="v5-diff-card" style="border-left-color:${g.color}">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${g.color}"></span>
        <span style="font-size:14px;font-weight:700;color:var(--text-primary)">${g.level}</span>
        <span style="font-size:10px;color:var(--text-secondary)">${g.desc}</span>
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px">
        ${g.cats.map(c => `<span style="background:rgba(126,200,227,0.1);border:1px solid rgba(126,200,227,0.2);border-radius:10px;padding:2px 8px;font-size:9px;color:var(--accent)">${c}</span>`).join('')}
      </div>
      <div style="font-size:10px;color:var(--text-secondary);line-height:1.8">
        ${g.tips.map(t => `<div style="display:flex;gap:4px;align-items:baseline"><span style="color:${g.color}">&#x25CF;</span> ${t}</div>`).join('')}
      </div>
    </div>`;
  });

  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function renderExploreStats() {
  closeAllV5Overlays();
  const stats = Explorer.get();
  const reviewStats = Reviews.getStats();

  const overlay = document.createElement('div');
  overlay.className = 'v5-overlay';
  overlay.id = 'v5-stats-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  const topCats = Object.entries(stats.cats).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const topRegions = Object.entries(stats.regions).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const catMax = topCats.length ? topCats[0][1] : 1;

  if (Object.keys(stats.regions).length >= 5) Achievements.check('all_regions');
  if (Object.keys(stats.cats).length >= 10) Achievements.check('cat_explorer');

  let html = `<div class="v5-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <h3>📊 나의 탐색 통계</h3>
    <button class="v5-close" onclick="document.getElementById('v5-stats-overlay').remove()">닫기</button>
  </div>`;

  html += `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">
    <div class="sc"><div class="n">${stats.views}</div><div class="l">강좌 열람</div></div>
    <div class="sc"><div class="n">${stats.searches}</div><div class="l">검색 횟수</div></div>
    <div class="sc"><div class="n">${stats.sessions}</div><div class="l">방문 횟수</div></div>
  </div>`;

  if (topCats.length) {
    html += '<div style="margin-bottom:16px"><div style="font-size:12px;color:var(--text-primary);font-weight:600;margin-bottom:8px">관심 종목 TOP 8</div>';
    topCats.forEach(([cat, count]) => {
      const pct = Math.round(count / catMax * 100);
      html += `<div style="display:flex;align-items:center;gap:8px;margin:3px 0">
        <span style="font-size:9px;color:var(--text-secondary);width:55px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:right">${cat}</span>
        <div class="v5-bar" style="flex:1;height:14px"><div class="v5-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,#7EC8E3,#3AAFA9)"></div></div>
        <span style="font-size:9px;color:var(--text-muted);width:30px">${count}</span>
      </div>`;
    });
    html += '</div>';
  }

  if (topRegions.length) {
    html += '<div style="margin-bottom:12px"><div style="font-size:12px;color:var(--text-primary);font-weight:600;margin-bottom:8px">탐색 지역</div>';
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap">';
    topRegions.forEach(([region, count]) => {
      html += `<div class="v5-center-stat"><div style="font-size:14px;font-weight:700;color:var(--accent)">${count}</div><div style="font-size:9px;color:var(--text-muted)">${region}</div></div>`;
    });
    html += '</div></div>';
  }

  if (reviewStats.count > 0) {
    html += `<div style="margin-bottom:12px"><div style="font-size:12px;color:var(--text-primary);font-weight:600;margin-bottom:4px">리뷰 활동</div>
      <div style="font-size:11px;color:var(--text-secondary)">총 ${reviewStats.count}개 리뷰 | 평균 ${reviewStats.avg}점</div>
    </div>`;
  }

  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function renderShareCard() {
  closeAllV5Overlays();
  const canvas = generateShareCard();

  const overlay = document.createElement('div');
  overlay.className = 'v5-overlay';
  overlay.id = 'v5-share-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  const card = document.createElement('div');
  card.className = 'v5-card';
  card.style.textAlign = 'center';
  card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <h3>🎴 공유 카드</h3>
    <button class="v5-close" onclick="document.getElementById('v5-share-overlay').remove()">닫기</button>
  </div>`;

  canvas.style.cssText = 'width:100%;max-width:500px;border-radius:12px;border:1px solid var(--card-border)';
  card.appendChild(canvas);

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:8px;justify-content:center;margin-top:16px';
  const dlBtn = document.createElement('button');
  dlBtn.className = 'v5-close';
  dlBtn.style.cssText = 'background:linear-gradient(135deg,var(--accent),var(--accent2));color:#0A1628;font-weight:700;border:none';
  dlBtn.textContent = '📥 다운로드';
  dlBtn.addEventListener('click', () => {
    V5SFX.play('share');
    const link = document.createElement('a');
    link.download = 'culture-finder-stats.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  const cpBtn = document.createElement('button');
  cpBtn.className = 'v5-close';
  cpBtn.textContent = '📋 클립보드';
  cpBtn.addEventListener('click', () => {
    canvas.toBlob(blob => {
      if (blob && navigator.clipboard && navigator.clipboard.write) {
        navigator.clipboard.write([new ClipboardItem({'image/png': blob})]).then(() => {
          cpBtn.textContent = '✅ 복사됨!';
          V5SFX.play('share');
          setTimeout(() => cpBtn.textContent = '📋 클립보드', 2000);
        }).catch(() => {});
      }
    });
  });

  btnRow.appendChild(dlBtn);
  btnRow.appendChild(cpBtn);
  card.appendChild(btnRow);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}

function renderCenterProfile(centerName) {
  closeAllV5Overlays();
  const data = window.__v4Data || [];
  if (!data.length) return;
  const profile = buildCenterProfile(data, centerName);

  const overlay = document.createElement('div');
  overlay.className = 'v5-overlay';
  overlay.id = 'v5-center-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  const dayNames = ['월','화','수','목','금','토','일'];
  const dayMax = Math.max(...dayNames.map(d => profile.dayDist[d] || 0), 1);

  let html = `<div class="v5-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
    <h3>🏛️ ${profile.name}</h3>
    <button class="v5-close" onclick="document.getElementById('v5-center-overlay').remove()">닫기</button>
  </div>`;

  html += `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px">
    <div class="sc"><div class="n">${profile.total}</div><div class="l">총 강좌</div></div>
    <div class="sc"><div class="n">${profile.topCats.length}</div><div class="l">종목 수</div></div>
    <div class="sc"><div class="n">${profile.avgPrice ? profile.avgPrice.toLocaleString() + '원' : '-'}</div><div class="l">평균 수강료</div></div>
  </div>`;

  if (profile.topCats.length) {
    html += '<div style="margin-bottom:16px"><div style="font-size:12px;color:var(--text-primary);font-weight:600;margin-bottom:8px">종목 분포</div>';
    const topMax = profile.topCats[0][1];
    profile.topCats.forEach(([cat, count]) => {
      const pct = Math.round(count / topMax * 100);
      html += `<div style="display:flex;align-items:center;gap:8px;margin:3px 0">
        <span style="font-size:9px;color:var(--text-secondary);width:50px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:right">${cat}</span>
        <div class="v5-bar" style="flex:1;height:14px"><div class="v5-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,#7EC8E3,#3AAFA9)"></div></div>
        <span style="font-size:9px;color:var(--text-muted);width:25px">${count}</span>
      </div>`;
    });
    html += '</div>';
  }

  html += '<div style="margin-bottom:12px"><div style="font-size:12px;color:var(--text-primary);font-weight:600;margin-bottom:8px">요일별 강좌 수</div>';
  html += '<div style="display:flex;gap:4px;align-items:flex-end;height:80px">';
  dayNames.forEach(d => {
    const count = profile.dayDist[d] || 0;
    const h = Math.max(4, Math.round(count / dayMax * 70));
    html += `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
      <span style="font-size:8px;color:var(--text-muted)">${count}</span>
      <div style="width:100%;height:${h}px;background:linear-gradient(0deg,#3AAFA9,#7EC8E3);border-radius:3px 3px 0 0"></div>
      <span style="font-size:9px;color:var(--text-secondary);font-weight:600">${d}</span>
    </div>`;
  });
  html += '</div></div>';

  if (profile.priceRange) {
    html += `<div style="font-size:10px;color:var(--text-secondary)">수강료 범위: ${profile.priceRange.min.toLocaleString()}원 ~ ${profile.priceRange.max.toLocaleString()}원</div>`;
  }

  html += '</div>';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

function renderReviewModal(courseIdx) {
  closeAllV5Overlays();
  const data = window.__v4Data || [];
  const course = data[courseIdx];
  if (!course) return;
  const existing = Reviews.getForCourse(courseIdx);

  const overlay = document.createElement('div');
  overlay.className = 'v5-overlay';
  overlay.id = 'v5-review-overlay';
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  let currentRating = existing ? existing.rating : 0;

  let html = `<div class="v5-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3>✍️ 강좌 리뷰</h3>
      <button class="v5-close" onclick="document.getElementById('v5-review-overlay').remove()">닫기</button>
    </div>
    <div style="font-size:13px;color:var(--text-primary);font-weight:600;margin-bottom:4px">${course[4]}</div>
    <div style="font-size:10px;color:var(--text-secondary);margin-bottom:16px">${course[1]} | ${course[3]}</div>
    <div style="margin-bottom:12px">
      <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">별점</div>
      <div id="v5-stars" style="display:flex;gap:4px">
        ${[1,2,3,4,5].map(s => `<span class="v5-star" data-star="${s}" onclick="window.__v5patch.setRating(${s})" style="color:${s <= currentRating ? '#FBBF24' : 'var(--text-faint)'}">${s <= currentRating ? '★' : '☆'}</span>`).join('')}
      </div>
    </div>
    <textarea id="v5-review-comment" placeholder="수강 후기를 작성해주세요 (선택)" style="width:100%;height:80px;background:var(--input-bg);border:1px solid var(--input-border);border-radius:8px;padding:10px;font-size:12px;color:var(--text-primary);outline:none;resize:none;font-family:inherit">${esc(existing ? existing.comment : '')}</textarea>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px">
      ${existing ? '<button class="v5-close" style="color:#EF4444" onclick="window.__v5patch.deleteReview(' + courseIdx + ')">삭제</button>' : ''}
      <button class="v5-close" style="background:linear-gradient(135deg,var(--accent),var(--accent2));color:#0A1628;font-weight:700;border:none" onclick="window.__v5patch.saveReview(${courseIdx})">저장</button>
    </div>
  </div>`;

  overlay.innerHTML = html;
  document.body.appendChild(overlay);
  window.__v5_currentRating = currentRating;
}

function setRating(star) {
  window.__v5_currentRating = star;
  const container = document.getElementById('v5-stars');
  if (!container) return;
  container.querySelectorAll('.v5-star').forEach(el => {
    const s = parseInt(el.dataset.star);
    el.style.color = s <= star ? '#FBBF24' : 'var(--text-faint)';
    el.textContent = s <= star ? '★' : '☆';
  });
}

function saveReview(courseIdx) {
  const rating = window.__v5_currentRating || 0;
  if (rating === 0) return;
  const comment = (document.getElementById('v5-review-comment') || {}).value || '';
  Reviews.save(courseIdx, rating, comment);
  V5SFX.play('review');
  document.getElementById('v5-review-overlay')?.remove();
}

function deleteReview(courseIdx) {
  Reviews.remove(courseIdx);
  document.getElementById('v5-review-overlay')?.remove();
}

function closeAllV5Overlays() {
  ['v5-price-overlay','v5-heatmap-overlay','v5-planner-overlay','v5-achieve-overlay',
   'v5-quiz-overlay','v5-diff-overlay','v5-stats-overlay','v5-share-overlay',
   'v5-center-overlay','v5-review-overlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

// ─── 14. 퀵 액션 버튼 + 키보드 단축키 ──────────────────────────────
function createV5QuickActions() {
  const container = document.createElement('div');
  container.className = 'v4-quick-actions';
  container.id = 'v5-quick-actions';
  const actions = [
    { icon: '💰', label: '가격분석', fn: renderPriceAnalysis },
    { icon: '🗺️', label: '히트맵', fn: renderHeatmap },
    { icon: '📋', label: '플래너', fn: renderPlanner },
    { icon: '🏆', label: '업적', fn: renderAchievements },
    { icon: '❓', label: '퀴즈', fn: renderQuiz },
    { icon: '📊', label: '난이도', fn: renderDiffGuide },
    { icon: '🎴', label: '공유카드', fn: renderShareCard },
    { icon: '📈', label: '탐색통계', fn: renderExploreStats }
  ];
  actions.forEach(a => {
    const btn = document.createElement('button');
    btn.className = 'v4-btn';
    btn.innerHTML = `<span>${a.icon}</span>${a.label}`;
    btn.addEventListener('click', () => {
      if (window.__v4patch && window.__v4patch.SFX) window.__v4patch.SFX.play('click');
      a.fn();
    });
    container.appendChild(btn);
  });
  return container;
}

function setupV5Keyboard() {
  document.addEventListener('keydown', function(e) {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    switch(e.key) {
      case 'P': case 'p': e.preventDefault(); renderPriceAnalysis(); break;
      case 'H': case 'h': e.preventDefault(); renderHeatmap(); break;
      case 'L': case 'l': e.preventDefault(); renderPlanner(); break;
      case 'A': case 'a': e.preventDefault(); renderAchievements(); break;
      case 'Q': case 'q': e.preventDefault(); renderQuiz(); break;
      case 'G': case 'g': e.preventDefault(); renderDiffGuide(); break;
      case 'C': case 'c': e.preventDefault(); renderShareCard(); break;
      case 'X': case 'x': e.preventDefault(); renderExploreStats(); break;
    }
  });
}

// ─── 15. 센터 클릭 감지 + 즐겨찾기 감지 ────────────────────────────
function setupClickTracking() {
  document.addEventListener('click', function(e) {
    const row = e.target.closest('tr[style*="border-bottom"]');
    if (row) {
      const data = window.__v4Data || [];
      const cells = row.querySelectorAll('td');
      if (cells.length >= 2) {
        const courseName = (cells[1]?.textContent || '').trim().substring(0, 15);
        const found = data.findIndex(r => r[4] && r[4].includes(courseName));
        if (found >= 0) Explorer.trackView(data[found]);
      }
    }

    const starBtn = e.target.closest('[title*="즐겨찾기"]') || e.target.closest('button');
    if (starBtn && (starBtn.textContent || '').includes('★')) {
      const favList = JSON.parse(localStorage.getItem('cc-fav') || '[]');
      if (favList.length >= 1) Achievements.check('fav_first');
      if (favList.length >= 10) Achievements.check('fav_10');
      if (favList.length >= 30) Achievements.check('fav_30');
    }
  });

  const searchInput = document.querySelector('input[placeholder*="검색"]');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      if (this.value.length >= 2) Explorer.trackSearch();
    });
  } else {
    const obs = new MutationObserver(() => {
      const inp = document.querySelector('input[placeholder*="검색"]');
      if (inp && !inp.dataset.v5tracked) {
        inp.dataset.v5tracked = '1';
        inp.addEventListener('input', function() {
          if (this.value.length >= 2) Explorer.trackSearch();
        });
      }
    });
    obs.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  }
}

// ─── 16. 플래너 UI 헬퍼 ────────────────────────────────────────────
function addPlanFromUI() {
  const memo = (document.getElementById('v5-plan-memo') || {}).value || '';
  const day = (document.getElementById('v5-plan-day') || {}).value || '월';
  if (!memo.trim()) return;
  Planner.add(null, day, memo.trim());
  V5SFX.play('planner');
  renderPlanner();
}

function togglePlan(idx) {
  Planner.toggle(idx);
  V5SFX.play('planner');
  renderPlanner();
}

function removePlan(idx) {
  Planner.remove(idx);
  renderPlanner();
}

// ─── INIT ────────────────────────────────────────────────────────────
function initV5() {
  injectV5CSS();
  setupV5Keyboard();
  setupClickTracking();
  Explorer.initSession();
  Achievements.check('first_visit');

  const waitForV4 = setInterval(() => {
    const v4actions = document.getElementById('v4-quick-actions');
    if (!v4actions) return;
    clearInterval(waitForV4);

    setTimeout(() => {
      const v5actions = createV5QuickActions();
      v4actions.parentNode.insertBefore(v5actions, v4actions.nextSibling);
    }, 500);
  }, 300);
}

window.__v5patch = {
  v5State, Reviews, Planner, Explorer, Achievements,
  renderPriceAnalysis, renderHeatmap, renderPlanner, renderAchievements,
  renderQuiz, renderQuizQuestion, answerQuiz, nextQuiz,
  renderDiffGuide, renderExploreStats, renderShareCard,
  renderCenterProfile, renderReviewModal, setRating, saveReview, deleteReview,
  addPlanFromUI, togglePlan, removePlan, V5SFX
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initV5);
} else {
  initV5();
}

})();
