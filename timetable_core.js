/*
 * 문센파인더 시간표 엔진 (timetable_core.js) — 2026-11-15 신설
 * ---------------------------------------------------------------------------
 * 화면과 분리된 순수 계산 부품. index.html 의 시간표 화면이 window.CCFTT 로 쓴다.
 * node 에서도 require 되도록 UMD 꼴(단위 시험: tests/timetable_core.test.js).
 *
 *  - parseDays / parseTime / toSession : 강좌 행(17칸 배열) → 시간표 블록
 *  - clash / fits                      : 겹침 판정(센터가 다르면 이동시간까지 띄움)
 *  - parseCommand                      : "주말만, 수영 꼭, 하루 2개까지" 같은 말 → 조건
 *                                        (외부 AI 없이 규칙으로 — 알아들은 것/못 알아들은 것을 그대로 돌려준다)
 *  - suggest                           : 시간표 3안(종목 최다 · 한 곳 몰아서 · 여유·알뜰)
 *  - alternativesFor                   : 블록을 끌 때 옮겨 갈 수 있는 같은 종목의 다른 시간
 *
 * 행 열 순서(index.html FIELDS): 0분류 1센터 2이동 3종목 4강좌명 5대상 6요일 7시간 8수강료
 *                                9강사 10상태 11전화 12홈페이지 13시작일 14회차 15주소 16차량
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CCFTT = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DAYS = ['월', '화', '수', '목', '금', '토', '일'];
  var DAY_IDX = { '월': 0, '화': 1, '수': 2, '목': 3, '금': 4, '토': 5, '일': 6 };

  /* ── 1. 행 해석 ─────────────────────────────────────────────────────── */

  // "매주 토" "화,목" "화~목" "토/일" "화목" "매일" "주말" "평일" → [요일번호]
  function parseDays(str) {
    var s = String(str || '').replace(/\s+/g, '');
    if (!s) return [];
    var set = {};
    if (/매일|월~일|월-일/.test(s)) return [0, 1, 2, 3, 4, 5, 6];
    if (/주말/.test(s)) { set[5] = 1; set[6] = 1; }
    if (/평일|주중/.test(s)) { [0, 1, 2, 3, 4].forEach(function (d) { set[d] = 1; }); }
    s = s.replace(/매주|격주|매월|요일|주말|평일|주중/g, '');
    // 범위 "화~목"
    s = s.replace(/([월화수목금토일])[~\-]([월화수목금토일])/g, function (_, a, b) {
      var i = DAY_IDX[a], j = DAY_IDX[b];
      if (j < i) j += 7;
      for (var k = i; k <= j; k++) set[k % 7] = 1;
      return '';
    });
    for (var c = 0; c < s.length; c++) {
      if (DAY_IDX[s[c]] !== undefined) set[DAY_IDX[s[c]]] = 1;
    }
    return Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
  }

  // "11:00~11:50" → {s:660,e:710}. 끝이 없거나 거꾸로면 50분짜리로 본다.
  function parseTime(str) {
    var m = String(str || '').match(/(\d{1,2}):(\d{2})(?:\s*[~\-–]\s*(\d{1,2}):(\d{2}))?/);
    if (!m) return null;
    var s = (+m[1]) * 60 + (+m[2]);
    var e = m[3] !== undefined ? (+m[3]) * 60 + (+m[4]) : s + 50;
    if (!(e > s)) e = s + 50;
    if (s < 0 || s > 24 * 60) return null;
    return { s: s, e: Math.min(e, 24 * 60) };
  }

  function parsePrice(str) {
    var m = String(str || '').replace(/,/g, '').match(/(\d+)\s*원/);
    if (!m) m = String(str || '').replace(/,/g, '').match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function sessionCount(row) {
    var m = String(row[8] || '').match(/\((\d+)\s*회\)/);
    if (m) return +m[1];
    var n = +row[14];
    return n > 0 ? n : 0;
  }

  // 같은 강좌의 같은 회차를 가리키는 안정 키(데이터 순서가 바뀌어도 유지) — merge_all.py 중복키와 같은 구성
  function keyOf(row) {
    return [row[1], row[4], row[6], row[7], row[13]].join('|');
  }

  function fmt(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  // 행 → 블록. 요일·시간을 못 읽으면 null(시간표에 놓을 수 없음)
  function toSession(row, gi) {
    if (!row) return null;
    var days = parseDays(row[6]);
    var t = parseTime(row[7]);
    if (!days.length || !t) return null;
    var cnt = sessionCount(row);
    return {
      gi: gi,
      key: keyOf(row),
      center: row[1] || '',
      cat: row[3] || '기타',
      title: row[4] || '',
      target: row[5] || '',
      days: days,
      s: t.s,
      e: t.e,
      price: parsePrice(row[8]),
      priceText: row[8] || '',
      count: cnt,
      oneTime: cnt === 1,
      start: row[13] || '',
      status: row[10] || '',
      url: row[12] || '',
      addr: row[15] || '',
      dayText: row[6] || '',
      timeText: row[7] || ''
    };
  }

  /* ── 2. 이동시간 · 겹침 ─────────────────────────────────────────────── */

  function haversine(a, b) {
    var R = 6371, toR = Math.PI / 180;
    var dLat = (b[0] - a[0]) * toR, dLng = (b[1] - a[1]) * toR;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }

  // 센터 사이 이동(분). index.html estimateTravel 과 같은 공식(직선×1.4, 대중교통 20km/h+20분 / 차 40km/h+10분).
  // 같은 센터 0분, 좌표를 모르면 40분으로 넉넉히.
  function makeTravel(coords, mode) {
    var cache = {};
    return function (a, b) {
      if (a === b) return 0;
      var k = a < b ? a + '\u0001' + b : b + '\u0001' + a;
      if (cache[k] !== undefined) return cache[k];
      var ca = coords && coords[a], cb = coords && coords[b];
      var v;
      if (!ca || !cb) v = 40;
      else {
        var d = haversine(ca, cb) * 1.4;
        v = Math.round(mode === 'car' ? d / 40 * 60 + 10 : d / 20 * 60 + 20);
        // 같은 건물(같은 좌표) 다른 센터명 → 10분
        if (d < 0.3) v = 10;
      }
      cache[k] = v;
      return v;
    };
  }

  // 두 블록이 같은 요일에 (필요한 간격까지 포함해) 겹치면 true
  function clash(a, b, travel, minGap) {
    var shared = false;
    for (var i = 0; i < a.days.length; i++) {
      if (b.days.indexOf(a.days[i]) !== -1) { shared = true; break; }
    }
    if (!shared) return false;
    var need = (travel ? travel(a.center, b.center) : (a.center === b.center ? 0 : 30)) + (minGap || 0);
    return a.s < b.e + need && b.s < a.e + need;
  }

  // plan 에 c 를 넣으면 겹치는 블록들
  function conflictsWith(plan, c, travel, minGap) {
    var out = [];
    for (var i = 0; i < plan.length; i++) {
      if (plan[i].key === c.key) continue;
      if (clash(plan[i], c, travel, minGap)) out.push(plan[i]);
    }
    return out;
  }

  /* ── 3. 말 → 조건 ───────────────────────────────────────────────────── */

  var NEG_RE = /빼|제외|말고|없이|싫|안\s*돼|안돼|안됨|안\s*되|금지|불가|못\s*가|빠지|없는/;
  var ONLY_RE = /만(?![원개])|only|위주/;

  // 종목 묶음 별칭: 말에 이 낱말이 나오면 해당 종목들 전체로 본다
  var GROUP_ALIASES = [
    { re: /운동|체육|스포츠/, cats: ['수영', '태권도', '축구', '농구', '펜싱', '골프', '인라인', '줄넘기', '체조', '요가/필라테스', '라켓스포츠', '체육(종합)', '체육', '종합체육'] },
    { re: /무용|댄스|춤/, cats: ['발레', 'K-POP댄스', '밸리댄스', '한국무용', '힙합댄스', '현대무용', '댄스(기타)'] },
    { re: /악기/, cats: ['피아노', '바이올린', '첼로', '드럼', '관악기', '기타(악기)', '우쿨렐레', '국악기', '악기(기타)', '악기'] },
    { re: /미술|공예|그림|만들기/, cats: ['미술(종합)', '미술', '회화', '캘리그라피', '섬유/뜨개', '종이접기', '도자기/목공', '악세서리', '공예(기타)', '공예/만들기'] },
    { re: /음악|노래/, cats: ['보컬/노래', '뮤지컬', '음악놀이'] },
    { re: /요리|쿠킹|베이킹/, cats: ['요리', '베이킹/디저트'] },
    { re: /사고력|교육|공부/, cats: ['과학', '수학', '코딩/로봇', '바둑', '블록/레고', '교구놀이', '영재교육'] },
    { re: /어학|외국어|언어/, cats: ['영어', '제2외국어'] }
  ];
  // 낱말 하나로 종목 하나를 가리키는 별칭
  var CAT_WORDS = {
    '요가': '요가/필라테스', '필라테스': '요가/필라테스', '테니스': '라켓스포츠', '배드민턴': '라켓스포츠',
    '탁구': '라켓스포츠', '케이팝': 'K-POP댄스', 'kpop': 'K-POP댄스', '방송댄스': 'K-POP댄스', '힙합': '힙합댄스',
    '레고': '블록/레고', '블록': '블록/레고', '코딩': '코딩/로봇', '로봇': '코딩/로봇', '독서': '독서/논술',
    '논술': '독서/논술', '한자': '한자/서예', '서예': '한자/서예', '베이킹': '베이킹/디저트', '쿠키': '베이킹/디저트',
    '보컬': '보컬/노래', '노래': '보컬/노래', '도자기': '도자기/목공', '목공': '도자기/목공', '뜨개': '섬유/뜨개',
    '기타연주': '기타(악기)', '통기타': '기타(악기)', '중국어': '제2외국어', '일본어': '제2외국어', '플룻': '관악기',
    '플루트': '관악기', '색소폰': '관악기', '클라리넷': '관악기', '가야금': '국악기', '장구': '국악기'
  };
  var BRANDS = ['현대백화점', '롯데백화점', '신세계', '갤러리아', 'AK', 'NC', '이마트', '롯데마트', '홈플러스', '현대', '롯데'];

  function catKeywords(cat) {
    // "요가/필라테스" → ["요가","필라테스"], "미술(종합)" → ["미술"], "기타(악기)" → [] (기타는 '기타 치기'와 헷갈려 낱말 매칭 제외)
    if (cat === '기타' || cat === '기타(악기)' || cat === '악기(기타)' || cat === '공예(기타)' || cat === '댄스(기타)') return [];
    return cat.replace(/\(.*?\)/g, '').split('/').map(function (x) { return x.trim(); }).filter(function (x) { return x.length >= 2; });
  }

  function hourFrom(numStr, ampm, ctx) {
    var h = +numStr;
    if (ampm === '오후' || ampm === '저녁' || ampm === '밤') { if (h < 12) h += 12; }
    else if (!ampm && h >= 1 && h <= 8 && !/오전|아침/.test(ctx || '')) h += 12; // "3시 이후" = 오후 3시
    return h;
  }

  function emptyCons() {
    return {
      days: null, banDays: [], after: null, before: null, maxPerDay: null, maxItems: null,
      budget: null, must: [], ban: [], centers: [], banCenters: [], sameCenter: false,
      // oneTime: null = 말 안 함(화면이 정함: 직접 담은 강좌면 넣고, 검색 결과 전체면 뺌) / true 넣기 / false 빼기
      oneTime: null, minGap: 0, goal: null, understood: [], unknown: []
    };
  }

  // 못 알아들은 낱말 고르기 — 아는 말(조건 낱말·숫자·종목·센터·흔한 말끝)이 아닌 2글자 이상 낱말만
  var KNOWN_STEMS = ['주말', '평일', '주중', '요일', '오전', '오후', '저녁', '아침', '하루', '과목', '종목', '강좌', '최대', '많이',
    '여러', '다양', '골고루', '여유', '널널', '쉬엄', '빡빡', '무리', '싸게', '저렴', '가성비', '알뜰', '가까', '동선', '이동', '군데',
    '센터', '같은', '몰아', '특강', '원데이', '일일', '반드시', '무조건', '제외', '말고', '없이', '싫어', '안돼', '안됨', '까지', '이하',
    '이내', '이후', '이전', '부터', '넘어', '사이', '쉬는', '간격', '위주', '정도', '이상', '모두', '전부', '최대한', '시간표', '추천',
    '알아서', '해줘', '주세요', '부탁', '그리고', '하고', '가요', '가능', '불가', '어려', '힘들', '타임', '매일', '일주일', '한주',
    '백화점', '마트', '문화센터', '시간', '짧게', '적게', '줄여', '늦게', '일찍', '먼저', '우선', '제일', '가장', '아이', '애들',
    '우리', '같이', '되도록', '가급적', '웬만하면', '되면', '좋겠', '좋아', '원해', '할래', '싶어', '넣기', '빼기', '수업', '학원',
    '하나', '있', '없', '씩', '해서', '하게', '도록', '으로', '에서', '에는', '정도', '조금', '너무', '많은', '적은', '바꿔', '다시'];
  var KNOWN_FIRST = '넣빼짜싫못안꼭좀또만한두세네곳점월화수목금토일매총각';
  function unknownWords(cl, extraKeys) {
    var words = cl.replace(/#매일#/g, '매일').replace(/[^\w가-힣\s]/g, ' ').split(/\s+/).filter(Boolean);
    return words.filter(function (w) {
      if (w.length < 2 || /\d/.test(w)) return false;
      if (KNOWN_FIRST.indexOf(w[0]) !== -1 && w.length <= 3) return false;
      var lw = w.toLowerCase();
      for (var i = 0; i < KNOWN_STEMS.length; i++) if (lw.indexOf(KNOWN_STEMS[i]) !== -1) return false;
      for (var j = 0; j < extraKeys.length; j++) if (extraKeys[j] && lw.indexOf(extraKeys[j]) !== -1) return false;
      if (/^[월화수목금토일]+(요일)?/.test(w)) return false;
      return true;
    });
  }

  // allCats: 데이터에 있는 종목 이름 목록, allCenters: 센터 이름 목록(선택)
  function parseCommand(text, allCats, allCenters) {
    var cons = emptyCons();
    var raw = String(text || '').trim();
    if (!raw) return cons;
    allCats = allCats || [];
    allCenters = allCenters || [];
    var said = function (s) { if (cons.understood.indexOf(s) === -1) cons.understood.push(s); };
    // 낱말 판정용 아는 말: 종목 낱말·별칭·묶음·브랜드·센터 짧은 이름
    var extraKeys = [];
    allCats.forEach(function (c) { catKeywords(c).forEach(function (k) { extraKeys.push(k.toLowerCase()); }); });
    Object.keys(CAT_WORDS).forEach(function (k) { extraKeys.push(k); });
    extraKeys = extraKeys.concat(['운동', '체육', '스포츠', '무용', '댄스', '춤', '악기', '미술', '공예', '그림', '만들기', '음악', '노래',
      '요리', '쿠킹', '베이킹', '사고력', '교육', '공부', '어학', '외국어', '언어', 'kpop']);
    BRANDS.forEach(function (b) { extraKeys.push(b.toLowerCase()); });
    allCenters.forEach(function (cn) {
      var sh = cn.replace(/^(홈플러스|이마트|롯데마트|롯데쇼핑|현대백화점|롯데백화점|신세계|갤러리아|AK플라자|NC)\s*/, '');
      if (sh.length >= 2) extraKeys.push(sh.toLowerCase());
    });

    var clauses = raw.replace(/매일/g, '#매일#')
      .split(/[,，\n;.!?]+|\s그리고\s|\s하고\s|\s및\s|\s또\s/)
      .map(function (c) { return c.trim(); })
      .filter(Boolean);

    clauses.forEach(function (cl) {
      var neg = NEG_RE.test(cl);
      var only = ONLY_RE.test(cl);
      var hit = false;

      // (1) 요일
      var dayHits = [];
      if (/주말/.test(cl)) dayHits.push(5, 6);
      if (/평일|주중/.test(cl)) dayHits.push(0, 1, 2, 3, 4);
      var dre = /(^|[^가-힣])([월화수목금토일]{1,7})(?=요일|만|에|은|는|도|이랑|랑|과|와|빼|제외|말고|\s|$|,)/g, dm;
      while ((dm = dre.exec(cl))) {
        // "월 10만원"·"월 2회" 의 '월'은 한 달 — 요일 아님
        if (dm[2] === '월' && /^\s*\d/.test(cl.slice(dm.index + dm[0].length))) continue;
        for (var k = 0; k < dm[2].length; k++) dayHits.push(DAY_IDX[dm[2][k]]);
      }
      var rng = cl.match(/([월화수목금토일])(?:요일)?\s*[~\-]\s*([월화수목금토일])(?:요일)?/);
      if (rng) dayHits = dayHits.concat(parseDays(rng[1] + '~' + rng[2]));
      if (dayHits.length) {
        hit = true;
        var uniq = dayHits.filter(function (d, i) { return dayHits.indexOf(d) === i; }).sort();
        var names = uniq.map(function (d) { return DAYS[d]; }).join('·');
        if (neg) {
          uniq.forEach(function (d) { if (cons.banDays.indexOf(d) === -1) cons.banDays.push(d); });
          said(names + '요일 빼기');
        } else {
          cons.days = (cons.days || []).concat(uniq).filter(function (d, i, a) { return a.indexOf(d) === i; }).sort();
          said(names + '요일만');
        }
      }

      // (2) 시간대
      var tm;
      if ((tm = cl.match(/(오전|오후|저녁|밤|아침)?\s*(\d{1,2})\s*시(?:\s*(반|\d{1,2}\s*분))?\s*(?:부터|~|-)\s*(오전|오후|저녁|밤)?\s*(\d{1,2})\s*시(?:\s*(반|\d{1,2}\s*분))?/))) {
        var a1 = hourFrom(tm[2], tm[1], cl) * 60 + (tm[3] === '반' ? 30 : parseInt(tm[3] || 0, 10) || 0);
        var b1 = hourFrom(tm[5], tm[4] || tm[1], cl) * 60 + (tm[6] === '반' ? 30 : parseInt(tm[6] || 0, 10) || 0);
        if (b1 > a1) { cons.after = a1; cons.before = b1; said(fmt(a1) + '~' + fmt(b1) + ' 사이'); hit = true; }
      } else if ((tm = cl.match(/(오전|오후|저녁|밤|아침)?\s*(\d{1,2})\s*시(?:\s*(반|\d{1,2}\s*분))?\s*(이후|부터|넘어|뒤|후|이상)/))) {
        cons.after = hourFrom(tm[2], tm[1], cl) * 60 + (tm[3] === '반' ? 30 : parseInt(tm[3] || 0, 10) || 0);
        said(fmt(cons.after) + ' 이후'); hit = true;
      } else if ((tm = cl.match(/(오전|오후|저녁|밤|아침)?\s*(\d{1,2})\s*시(?:\s*(반|\d{1,2}\s*분))?\s*(이전|전|까지|안에|이내)/))) {
        cons.before = hourFrom(tm[2], tm[1], cl) * 60 + (tm[3] === '반' ? 30 : parseInt(tm[3] || 0, 10) || 0);
        said(fmt(cons.before) + ' 전에 끝'); hit = true;
      } else if (/오전|아침/.test(cl) && !/\d\s*시/.test(cl)) {
        if (neg) { cons.after = 12 * 60; said('오후만'); } else { cons.before = 12 * 60 + 30; said('오전만'); }
        hit = true;
      } else if (/저녁|밤/.test(cl) && !/\d\s*시/.test(cl)) {
        if (neg) { cons.before = 18 * 60; said('저녁 빼기'); } else { cons.after = 17 * 60; said('저녁만'); }
        hit = true;
      } else if (/오후/.test(cl) && !/\d\s*시/.test(cl)) {
        if (neg) { cons.before = 12 * 60 + 30; said('오전만'); } else { cons.after = 12 * 60; said('오후만'); }
        hit = true;
      }

      // (3) 개수
      var cm;
      if ((cm = cl.match(/하루(?:에)?\s*(\d+)\s*(?:개|과목|종목|강좌|타임|번)?/))) {
        cons.maxPerDay = Math.max(1, +cm[1]); said('하루 ' + cons.maxPerDay + '개까지'); hit = true;
      } else if (/하루\s*(?:에)?\s*(?:한|하나)/.test(cl)) {
        cons.maxPerDay = 1; said('하루 1개까지'); hit = true;
      }
      if ((cm = cl.match(/(?:총|전부|모두|최대|일주일에|주에|한\s*주에)?\s*(\d+)\s*(?:개|과목|종목|강좌)\s*(?:까지|만|이하|정도|넣|짜)?/)) && !/하루/.test(cl)) {
        cons.maxItems = Math.max(1, +cm[1]); said('모두 ' + cons.maxItems + '개까지'); hit = true;
      }

      // (4) 돈
      var mm;
      if ((mm = cl.match(/(\d+(?:\.\d+)?)\s*만\s*원?/))) {
        cons.budget = Math.round(parseFloat(mm[1]) * 10000); said('수강료 합계 ' + mm[1] + '만원 이하'); hit = true;
      } else if ((mm = cl.match(/(\d{4,})\s*원/))) {
        cons.budget = +mm[1]; said('수강료 합계 ' + (+mm[1]).toLocaleString() + '원 이하'); hit = true;
      }
      if (/싸게|저렴|가성비|알뜰|돈\s*적게/.test(cl)) { cons.goal = 'cheap'; said('싼 강좌 우선'); hit = true; }

      // (5) 목표
      if (/최대한|많이|여러|다양|골고루|종목\s*많/.test(cl) && !neg) { cons.goal = 'variety'; said('종목 최대한 많이'); hit = true; }
      if (/여유|널널|쉬엄|빡빡하지|무리\s*없/.test(cl)) {
        cons.goal = 'relaxed'; if (!cons.maxPerDay) cons.maxPerDay = 1; said('여유 있게(하루 1개)'); hit = true;
      }
      if (/가까|동선|이동\s*(?:적|짧|줄)|한\s*(?:곳|군데|센터)|같은\s*(?:곳|센터)|몰아/.test(cl)) {
        if (/한\s*(?:곳|군데|센터)|같은\s*(?:곳|센터)|몰아/.test(cl)) { cons.sameCenter = true; said('한 센터에서'); }
        else { cons.goal = 'near'; said('가까운 곳·동선 짧게'); }
        hit = true;
      }
      var gm;
      if ((gm = cl.match(/(?:쉬는\s*시간|간격|여유|틈)\s*(\d{1,3})\s*분|(\d{1,3})\s*분\s*(?:쉬|간격|여유|틈)/))) {
        cons.minGap = +(gm[1] || gm[2]); said('강좌 사이 ' + cons.minGap + '분 이상'); hit = true;
      }

      // (6) 1회 특강
      if (/특강|원데이|1회|일일/.test(cl)) {
        cons.oneTime = !neg; said(neg ? '1회 특강 빼기' : '1회 특강도 넣기'); hit = true;
      }

      // (7) 센터·브랜드
      var centerHit = false;
      allCenters.forEach(function (cn) {
        var short = cn.replace(/^(홈플러스|이마트|롯데마트|롯데쇼핑|현대백화점|롯데백화점|신세계|갤러리아|AK플라자|NC)\s*/, '');
        if ((short.length >= 3 && cl.indexOf(short) !== -1) || cl.indexOf(cn) !== -1) {
          centerHit = true;
          if (neg) { cons.banCenters.push(cn); } else { cons.centers.push(cn); }
        }
      });
      if (!centerHit) {
        for (var bi = 0; bi < BRANDS.length; bi++) {
          var br = BRANDS[bi];
          if (cl.indexOf(br) !== -1) {
            centerHit = true;
            if (neg) cons.banCenters.push(br); else cons.centers.push(br);
            break;
          }
        }
      }
      if (centerHit) { said((neg ? '빼는 곳: ' : '이 곳만: ') + (neg ? cons.banCenters : cons.centers).join(', ')); hit = true; }

      // (8) 종목
      var catHits = [];
      var lower = cl.toLowerCase();
      allCats.forEach(function (cat) {
        if (catKeywords(cat).some(function (kw) { return lower.indexOf(kw.toLowerCase()) !== -1; })) catHits.push(cat);
      });
      Object.keys(CAT_WORDS).forEach(function (w) {
        if (lower.indexOf(w) !== -1 && allCats.indexOf(CAT_WORDS[w]) !== -1) catHits.push(CAT_WORDS[w]);
      });
      if (!catHits.length) {
        GROUP_ALIASES.forEach(function (g) {
          if (g.re.test(cl)) g.cats.forEach(function (c) { if (allCats.indexOf(c) !== -1) catHits.push(c); });
        });
      }
      catHits = catHits.filter(function (c, i) { return catHits.indexOf(c) === i; });
      if (catHits.length) {
        hit = true;
        if (neg) {
          catHits.forEach(function (c) { if (cons.ban.indexOf(c) === -1) cons.ban.push(c); });
          said(catHits.join('·') + ' 빼기');
        } else if (only && catHits.length > 0 && !/꼭|반드시|무조건/.test(cl)) {
          // "수영이랑 발레만" = 이 종목들 안에서만
          cons.onlyCats = (cons.onlyCats || []).concat(catHits);
          said(catHits.join('·') + '만');
        } else {
          catHits.forEach(function (c) { if (cons.must.indexOf(c) === -1) cons.must.push(c); });
          said(catHits.join('·') + ' 꼭 넣기');
        }
      }

      var unk = unknownWords(cl, extraKeys);
      if (!hit) { if (unk.length) cons.unknown.push(cl.replace(/#매일#/g, '매일')); }
      else unk.forEach(function (w) { if (cons.unknown.indexOf(w) === -1) cons.unknown.push(w); });
    });

    if (cons.banDays.length && cons.days) {
      cons.days = cons.days.filter(function (d) { return cons.banDays.indexOf(d) === -1; });
    }
    return cons;
  }

  /* ── 4. 조건 통과 · 제안 ────────────────────────────────────────────── */

  function brandMatch(center, list) {
    for (var i = 0; i < list.length; i++) if (center.indexOf(list[i]) !== -1) return true;
    return false;
  }

  function passes(c, cons) {
    if (!cons) return true;
    if (c.oneTime && !cons.oneTime) return false;
    if (cons.days) { for (var i = 0; i < c.days.length; i++) if (cons.days.indexOf(c.days[i]) === -1) return false; }
    for (var j = 0; j < c.days.length; j++) if (cons.banDays.indexOf(c.days[j]) !== -1) return false;
    if (cons.after != null && c.s < cons.after) return false;
    if (cons.before != null && c.e > cons.before) return false;
    if (cons.ban.indexOf(c.cat) !== -1) return false;
    if (cons.onlyCats && cons.onlyCats.length && cons.onlyCats.indexOf(c.cat) === -1) return false;
    if (cons.centers.length && !brandMatch(c.center, cons.centers)) return false;
    if (cons.banCenters.length && brandMatch(c.center, cons.banCenters)) return false;
    if (cons.budget != null && c.price > cons.budget) return false;
    return true;
  }

  // plan 에 c 를 넣을 수 있나(겹침·하루 개수·총 개수·예산)
  function fits(plan, c, cons, travel) {
    cons = cons || emptyCons();
    if (cons.maxItems && plan.length >= cons.maxItems) return false;
    var total = c.price;
    for (var i = 0; i < plan.length; i++) {
      var p = plan[i];
      if (p.key === c.key) return false;
      if (p.center === c.center && p.title === c.title) return false; // 같은 강좌 다른 반 두 개는 안 넣음
      if (clash(p, c, travel, cons.minGap)) return false;
      total += p.price;
    }
    if (cons.budget != null && total > cons.budget) return false;
    if (cons.maxPerDay) {
      for (var d = 0; d < c.days.length; d++) {
        var n = 0;
        for (var q = 0; q < plan.length; q++) if (plan[q].days.indexOf(c.days[d]) !== -1) n++;
        if (n >= cons.maxPerDay) return false;
      }
    }
    return true;
  }

  function stats(plan) {
    var cats = {}, centers = {}, days = {}, price = 0, mins = 0;
    plan.forEach(function (p) {
      cats[p.cat] = 1; centers[p.center] = 1;
      p.days.forEach(function (d) { days[d] = 1; });
      price += p.price; mins += (p.e - p.s) * p.days.length;
    });
    return {
      cats: Object.keys(cats).length, items: plan.length, centers: Object.keys(centers).length,
      days: Object.keys(days).length, price: price, weeklyMin: mins
    };
  }

  // 결정적 난수(같은 입력 → 같은 제안). mulberry32
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function planKey(plan) { return plan.map(function (p) { return p.key; }).sort().join('\n'); }

  var LENSES = [
    { id: 'variety', name: '종목 최다', icon: '🌈', desc: '겹치지 않게 가장 많은 종목' },
    { id: 'compact', name: '몰아서 다니기', icon: '📍', desc: '한 센터 중심 · 나가는 요일 수를 줄여 동선 짧게' },
    { id: 'relaxed', name: '여유·알뜰', icon: '🌿', desc: '하루 2개까지 · 사이 30분 쉬기 · 싼 강좌 우선' }
  ];

  function lensScore(lens, plan, cons, homeTime) {
    var st = stats(plan);
    var mustHit = 0;
    (cons.must || []).forEach(function (m) { if (plan.some(function (p) { return p.cat === m; })) mustHit++; });
    var travelHome = 0;
    plan.forEach(function (p) { travelHome += homeTime ? homeTime(p) : 0; });
    var base = mustHit * 100000;
    if (lens === 'variety') return base + st.cats * 1000 + st.items * 10 - st.centers * 25 - st.price / 20000 - travelHome / 3;
    // 몰아서: 강좌 수는 살리되 나가는 날·센터 수를 줄인 쪽이 이긴다(1개짜리가 이기지 않게 강좌 가치 > 센터 벌점)
    if (lens === 'compact') return base + st.cats * 600 + st.items * 200 - (st.centers - 1) * 120 - st.days * 150 - travelHome * 2 - st.price / 40000;
    return base + st.cats * 700 - st.price / 2500 - Math.max(0, st.items - st.days) * 400 - travelHome / 2;
  }

  /*
   * pool: 블록 배열(toSession 결과). opts: {travel, homeTime(블록→집에서 분), seed, timeBudgetMs}
   * 돌려줌: [{id,name,icon,desc,items,stats}] × 3 (서로 다른 안이 되도록 노력, 후보가 적으면 같을 수 있음)
   */
  function suggest(pool, cons, opts) {
    cons = cons || emptyCons();
    opts = opts || {};
    var travel = opts.travel || makeTravel({}, 'public');
    var homeTime = opts.homeTime || null;
    var rand = rng(opts.seed || 7);
    var deadline = Date.now() + (opts.timeBudgetMs || 350);

    var cands = pool.filter(function (c) { return passes(c, cons); });
    // 종목별 후보(집에서 가까운·싼 순으로 상위 40개만 — 계산량 상한)
    var byCat = {};
    cands.forEach(function (c) { (byCat[c.cat] = byCat[c.cat] || []).push(c); });
    Object.keys(byCat).forEach(function (cat) {
      byCat[cat].sort(function (a, b) {
        return ((homeTime ? homeTime(a) : 0) - (homeTime ? homeTime(b) : 0)) || (a.price - b.price) || (a.s - b.s);
      });
      byCat[cat] = byCat[cat].slice(0, 40);
    });
    var cats = Object.keys(byCat);
    var must = (cons.must || []).filter(function (m) { return byCat[m]; });
    var others = cats.filter(function (c) { return must.indexOf(c) === -1; });

    function shuffled(arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }

    // opts.fill: 1단계(종목마다 1개) 뒤에 남은 후보를 겹치지 않는 한 더 채운다.
    //   직접 담은 관심 강좌로 짤 때 쓴다 — 같은 종목을 여러 개 담았어도 다 들어가야 하니까.
    //   검색 결과 전체로 짤 땐 끔(빈칸마다 강좌가 꽉 차 버린다).
    var fill = !!opts.fill;
    var fillOrder = cands.slice().sort(function (a, b) { return a.days[0] - b.days[0] || a.s - b.s; });
    function greedy(lens, catOrder, pickOrder, consX, centerPin) {
      var plan = [];
      catOrder.forEach(function (cat) {
        var list = pickOrder(byCat[cat] || []);
        for (var i = 0; i < list.length; i++) {
          var c = list[i];
          if (centerPin && c.center !== centerPin && must.indexOf(cat) === -1) continue;
          if (fits(plan, c, consX, travel)) { plan.push(c); break; }
        }
      });
      if (fill) {
        var rest = pickOrder(fillOrder);
        // 몰아서 안: 중심 센터 강좌를 먼저, 다른 센터 강좌는 '이미 나가는 요일'에만 붙인다(나가는 날 수를 안 늘림)
        if (centerPin) rest = rest.filter(function (r) { return r.center === centerPin; })
          .concat(rest.filter(function (r) { return r.center !== centerPin; }));
        for (var j = 0; j < rest.length; j++) {
          var r = rest[j];
          if (centerPin && r.center !== centerPin) {
            var used = {};
            plan.forEach(function (p) { p.days.forEach(function (d) { used[d] = 1; }); });
            if (!r.days.every(function (d) { return used[d]; })) continue;
          }
          if (fits(plan, r, consX, travel)) plan.push(r);
        }
      }
      return plan;
    }

    function jitterOrder(list, w) {
      return list.map(function (c, i) { return { c: c, k: i + rand() * w }; })
        .sort(function (a, b) { return a.k - b.k; }).map(function (x) { return x.c; });
    }

    var results = {};
    LENSES.forEach(function (L) { results[L.id] = []; });
    function keep(lens, plan) {
      if (!plan.length) return;
      var k = planKey(plan);
      var arr = results[lens];
      for (var i = 0; i < arr.length; i++) if (arr[i].k === k) return;
      arr.push({ k: k, plan: plan, score: lensScore(lens, plan, cons, homeTime) });
      arr.sort(function (a, b) { return b.score - a.score; });
      if (arr.length > 6) arr.length = 6;
    }

    // 큰 종목(후보 적은 것)부터 넣으면 잘 맞는다 — 결정적 1회 + 무작위 반복
    var scarceFirst = others.slice().sort(function (a, b) { return byCat[a].length - byCat[b].length; });
    var relaxedCons = Object.assign({}, cons, {
      maxPerDay: cons.maxPerDay ? Math.min(cons.maxPerDay, 2) : 2,
      minGap: Math.max(cons.minGap || 0, 30)
    });
    var cheap = function (list) { return list.slice().sort(function (a, b) { return a.price - b.price; }); };
    var asIs = function (list) { return list; };

    keep('variety', greedy('variety', must.concat(scarceFirst), asIs, cons));
    keep('relaxed', greedy('relaxed', must.concat(scarceFirst), cheap, relaxedCons));
    // 한 곳 몰아서: 후보가 많은 센터 순으로 그 센터만 써 보기
    var centerCount = {};
    cands.forEach(function (c) { centerCount[c.center] = (centerCount[c.center] || 0) + 1; });
    var topCenters = Object.keys(centerCount).sort(function (a, b) { return centerCount[b] - centerCount[a]; }).slice(0, 10);
    topCenters.forEach(function (cn) { keep('compact', greedy('compact', must.concat(scarceFirst), asIs, cons, cn)); });

    var iter = 0;
    while (Date.now() < deadline && iter < 400) {
      iter++;
      var order = must.concat(shuffled(others));
      keep('variety', greedy('variety', order, function (l) { return jitterOrder(l, 4); }, cons));
      keep('relaxed', greedy('relaxed', order, function (l) { return jitterOrder(cheap(l), 3); }, relaxedCons));
      if (topCenters.length) {
        var cn = topCenters[Math.floor(rand() * topCenters.length)];
        keep('compact', greedy('compact', order, function (l) { return jitterOrder(l, 3); }, cons, cn));
      }
    }

    // 세 안이 서로 다르게: 앞 안과 같으면 그 렌즈의 다음 후보
    var used = {};
    return LENSES.map(function (L) {
      var arr = results[L.id];
      var pick = null;
      for (var i = 0; i < arr.length; i++) { if (!used[arr[i].k]) { pick = arr[i]; break; } }
      if (!pick && arr.length) pick = arr[0];
      var items = pick ? pick.plan.slice().sort(function (a, b) { return a.days[0] - b.days[0] || a.s - b.s; }) : [];
      if (pick) used[pick.k] = 1;
      return { id: L.id, name: L.name, icon: L.icon, desc: L.desc, items: items, stats: stats(items) };
    });
  }

  // 블록 item 을 끌 때 옮겨 갈 수 있는 자리: 같은 종목(같은 강좌명 먼저)의 다른 반 중 지금 시간표와 안 겹치는 것
  function alternativesFor(item, plan, pool, cons, travel, limit) {
    var rest = plan.filter(function (p) { return p.key !== item.key; });
    var consX = Object.assign({}, cons || emptyCons(), { maxItems: null, budget: null });
    var norm = function (t) { return String(t).replace(/[\s\[\]()<>【】_\-:~0-9./,]/g, '').slice(0, 8); };
    var nt = norm(item.title);
    var out = [];
    var seen = {};
    pool.forEach(function (c) {
      if (c.key === item.key || c.cat !== item.cat || seen[c.key]) return;
      if (c.oneTime && !item.oneTime && !(cons && cons.oneTime)) return;
      seen[c.key] = 1;
      if (!fits(rest, c, consX, travel)) return;
      var sameTitle = norm(c.title) === nt ? 0 : 1;
      var sameCenter = c.center === item.center ? 0 : 1;
      out.push({ c: c, rank: sameTitle * 4 + sameCenter * 2 + Math.abs(c.s - item.s) / 600 });
    });
    out.sort(function (a, b) { return a.rank - b.rank; });
    return out.slice(0, limit || 40).map(function (x) { return x.c; });
  }

  // 끌어 놓은 곳(요일 d, 분 m)에 가장 가까운 후보
  function nearestAt(cands, day, minute, tol) {
    var best = null, bd = Infinity;
    cands.forEach(function (c) {
      if (c.days.indexOf(day) === -1) return;
      var dist = minute < c.s ? c.s - minute : minute > c.e ? minute - c.e : 0;
      if (dist < bd) { bd = dist; best = c; }
    });
    return bd <= (tol == null ? 30 : tol) ? best : null;
  }

  // 시간표를 사람이 읽는 글로(공유용)
  function planText(plan, title) {
    var lines = [title || '📅 문센 시간표'];
    DAYS.forEach(function (dn, d) {
      var its = plan.filter(function (p) { return p.days.indexOf(d) !== -1; }).sort(function (a, b) { return a.s - b.s; });
      if (!its.length) return;
      lines.push('');
      lines.push('[' + dn + ']');
      its.forEach(function (p) { lines.push(fmt(p.s) + '~' + fmt(p.e) + ' ' + p.title + ' (' + p.center + ')'); });
    });
    var st = stats(plan);
    lines.push('');
    lines.push('종목 ' + st.cats + '개 · 강좌 ' + st.items + '개 · 수강료 합계 ' + st.price.toLocaleString() + '원');
    return lines.join('\n');
  }

  return {
    DAYS: DAYS, LENSES: LENSES,
    parseDays: parseDays, parseTime: parseTime, parsePrice: parsePrice, keyOf: keyOf, fmt: fmt,
    toSession: toSession, makeTravel: makeTravel, clash: clash, conflictsWith: conflictsWith,
    parseCommand: parseCommand, emptyCons: emptyCons, passes: passes, fits: fits, stats: stats,
    suggest: suggest, alternativesFor: alternativesFor, nearestAt: nearestAt, planText: planText
  };
});
