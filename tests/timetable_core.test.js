// 시간표 엔진 단위 시험 — 실행: node --test tests/timetable_core.test.js
// 끝부분 'real data' 시험은 data/all.json 실데이터 전체로 돈다(가짜 자료 없음).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const T = require('../timetable_core.js');

const row = (center, cat, title, day, time, price = '120,000원(12회)', start = '2026.12.06') =>
  ['백화점', center, 0, cat, title, '5-7세', day, time, price, '', '접수중', '', 'https://x/' + encodeURIComponent(title + day + time), start, 12, '서울', 0];

test('parseDays: 데이터에 실제로 있는 요일 표기', () => {
  assert.deepEqual(T.parseDays('매주 토'), [5]);
  assert.deepEqual(T.parseDays('토'), [5]);
  assert.deepEqual(T.parseDays('화,목'), [1, 3]);
  assert.deepEqual(T.parseDays('화~목'), [1, 2, 3]);
  assert.deepEqual(T.parseDays('매주 토/일'), [5, 6]);
  assert.deepEqual(T.parseDays('화목'), [1, 3]);
  assert.deepEqual(T.parseDays('월,화,수,목,금'), [0, 1, 2, 3, 4]);
  assert.deepEqual(T.parseDays('매일'), [0, 1, 2, 3, 4, 5, 6]);
  assert.deepEqual(T.parseDays('금~월'), [0, 4, 5, 6]);
  assert.deepEqual(T.parseDays(''), []);
});

test('parseTime', () => {
  assert.deepEqual(T.parseTime('11:00~11:50'), { s: 660, e: 710 });
  assert.deepEqual(T.parseTime('9:30-10:20'), { s: 570, e: 620 });
  assert.deepEqual(T.parseTime('10:30'), { s: 630, e: 680 });
  assert.equal(T.parseTime(''), null);
});

test('clash: 같은 요일 겹침, 다른 센터는 이동시간까지 띄움', () => {
  const a = T.toSession(row('A점', '수영', '수영1', '토', '10:00~10:50'), 0);
  const b = T.toSession(row('A점', '발레', '발레1', '토', '10:50~11:40'), 1);
  const c = T.toSession(row('B점', '발레', '발레2', '토', '11:00~11:50'), 2);
  const d = T.toSession(row('B점', '미술', '미술1', '일', '10:00~10:50'), 3);
  const travel = () => 30;
  const tr = (x, y) => (x === y ? 0 : 30);
  assert.equal(T.clash(a, b, tr), false, '같은 센터 연달아는 가능');
  assert.equal(T.clash(a, c, tr), true, '다른 센터 10분 뒤는 이동 불가');
  assert.equal(T.clash(a, d, travel), false, '다른 요일');
});

test('parseCommand: 회장님이 쓸 만한 말들', () => {
  const cats = ['수영', '발레', '피아노', '미술(종합)', '미술', '요가/필라테스', '체조', '태권도', '영어'];
  let c = T.parseCommand('주말만, 수영 꼭, 하루 2개까지, 10만원 이하', cats);
  assert.deepEqual(c.days, [5, 6]);
  assert.deepEqual(c.must, ['수영']);
  assert.equal(c.maxPerDay, 2);
  assert.equal(c.budget, 100000);
  assert.deepEqual(c.unknown, []);

  c = T.parseCommand('평일 오후 3시 이후, 피아노 빼고', cats);
  assert.deepEqual(c.days, [0, 1, 2, 3, 4]);
  assert.equal(c.after, 15 * 60);
  assert.deepEqual(c.ban, ['피아노']);

  c = T.parseCommand('수요일은 못 가요', cats);
  assert.deepEqual(c.banDays, [2]);
  assert.equal(c.days, null);

  c = T.parseCommand('월 10만원 안으로', cats);
  assert.deepEqual(c.banDays, []);
  assert.equal(c.days, null, '"월 10만원"의 월은 요일이 아님');
  assert.equal(c.budget, 100000);

  c = T.parseCommand('한 곳에서 몰아서, 특강도 넣어줘', cats);
  assert.equal(c.sameCenter, true);
  assert.equal(c.oneTime, true);

  c = T.parseCommand('요가랑 미술만', cats);
  assert.ok(c.onlyCats.includes('요가/필라테스'));
  assert.ok(c.onlyCats.includes('미술'));

  c = T.parseCommand('오전만', cats);
  assert.equal(c.before, 12 * 60 + 30);

  c = T.parseCommand('2시부터 6시까지', cats);
  assert.equal(c.after, 14 * 60);
  assert.equal(c.before, 18 * 60);

  c = T.parseCommand('운동 위주로 최대한 많이', cats);
  assert.equal(c.goal, 'variety');
  assert.ok(c.onlyCats.includes('수영') && c.onlyCats.includes('체조'));

  c = T.parseCommand('바나나 우유', cats);
  assert.deepEqual(c.unknown, ['바나나 우유'], '못 알아들은 말은 그대로 돌려준다');

  c = T.parseCommand('수영 꼭 넣고 바나나', cats);
  assert.deepEqual(c.must, ['수영']);
  assert.deepEqual(c.unknown, ['바나나'], '아는 말과 섞여도 모르는 낱말은 알려 준다');

  // 흔한 말투는 '못 알아들음'으로 잡히면 안 된다
  for (const s of ['주말만, 수영 꼭, 하루 2개까지, 10만원 이하', '평일 오후 3시 이후, 피아노 빼고', '수요일은 못 가요',
    '월 10만원 안으로', '한 곳에서 몰아서, 특강도 넣어줘', '요가랑 미술만', '2시부터 6시까지', '운동 위주로 최대한 많이',
    '토요일 오전에 수영 넣어줘', '시간표 짜줘', '하루에 하나씩 여유 있게', '가까운 곳으로 싸게', '평일 오후 3시 이후',
    '한 곳에서 몰아서', '수요일 빼고', '특강도 넣기']) {
    assert.deepEqual(T.parseCommand(s, cats).unknown, [], '"' + s + '" 에서 못 알아들음이 나옴');
  }
  assert.equal(T.parseCommand('', cats).oneTime, null, '말 안 하면 1회 특강 여부는 화면이 정함');
  assert.equal(T.parseCommand('특강 빼고', cats).oneTime, false);
});

test('suggest: 겹침 없는 3안 + 종목 최다안이 가장 많은 종목', () => {
  const rows = [
    row('A점', '수영', '아쿠아 수영', '토', '10:00~10:50'),
    row('A점', '수영', '아쿠아 수영', '일', '10:00~10:50'),
    row('A점', '발레', '발레 B', '토', '10:00~10:50'),
    row('A점', '발레', '발레 B', '토', '11:00~11:50'),
    row('A점', '피아노', '피아노', '토', '11:00~11:50'),
    row('B점', '미술', '미술놀이', '토', '13:00~13:50', '60,000원(12회)'),
    row('B점', '체조', '리듬체조', '일', '11:00~11:50'),
    row('B점', '체조', '리듬체조', '토', '10:00~10:50'),
  ];
  const pool = rows.map((r, i) => T.toSession(r, i));
  const travel = (a, b) => (a === b ? 0 : 40);
  const plans = T.suggest(pool, T.emptyCons(), { travel, seed: 3, timeBudgetMs: 120 });
  assert.equal(plans.length, 3);
  for (const p of plans) {
    for (let i = 0; i < p.items.length; i++)
      for (let j = i + 1; j < p.items.length; j++)
        assert.equal(T.clash(p.items[i], p.items[j], travel), false, p.name + ' 겹침');
  }
  // 정답 = 모든 부분집합을 다 따져 본 '겹침 없는 최대 종목 수'
  let best = 0;
  for (let m = 1; m < 1 << pool.length; m++) {
    const pick = pool.filter((_, i) => m & (1 << i));
    let ok = true;
    for (let i = 0; i < pick.length && ok; i++)
      for (let j = i + 1; j < pick.length; j++)
        if (T.clash(pick[i], pick[j], travel) || (pick[i].center === pick[j].center && pick[i].title === pick[j].title)) { ok = false; break; }
    if (ok) best = Math.max(best, new Set(pick.map(p => p.cat)).size);
  }
  assert.equal(plans[0].stats.cats, best, '종목 최다안 = 완전탐색 최댓값 ' + best);
  // 한 곳 몰아서: 센터 수가 종목 최다안 이하
  assert.ok(plans[1].stats.centers <= plans[0].stats.centers);
  // 여유: 하루 2개까지, 사이 30분 이상
  const perDay = {};
  plans[2].items.forEach(p => p.days.forEach(d => (perDay[d] = (perDay[d] || 0) + 1)));
  assert.ok(Object.values(perDay).every(n => n <= 2));
  for (let i = 0; i < plans[2].items.length; i++)
    for (let j = i + 1; j < plans[2].items.length; j++)
      assert.equal(T.clash(plans[2].items[i], plans[2].items[j], travel, 30), false);
});

test('suggest fill: 직접 담은 강좌는 같은 종목이어도 겹치지 않으면 전부', () => {
  const rows = [
    row('A점', '미술', '클레이', '월', '10:00~10:50'),
    row('A점', '미술', '수채화', '화', '10:00~10:50'),
    row('A점', '미술', '드로잉', '수', '10:00~10:50'),
    row('A점', '미술', '만들기', '수', '10:20~11:10'), // 드로잉과 겹침
  ];
  const pool = rows.map((r, i) => T.toSession(r, i));
  const noFill = T.suggest(pool, T.emptyCons(), { seed: 2, timeBudgetMs: 40 });
  const filled = T.suggest(pool, T.emptyCons(), { seed: 2, timeBudgetMs: 40, fill: true });
  assert.equal(noFill[0].stats.items, 1, 'fill 없으면 종목마다 1개');
  assert.equal(filled[0].stats.items, 3, 'fill 이면 겹치는 1개 빼고 3개');
});

test('suggest: 조건(일요일 빼기·수영 꼭) 지킴', () => {
  const rows = [
    row('A점', '수영', '수영', '일', '10:00~10:50'),
    row('A점', '수영', '수영', '토', '15:00~15:50'),
    row('A점', '발레', '발레', '토', '15:00~15:50'),
    row('A점', '미술', '미술', '일', '12:00~12:50'),
  ];
  const pool = rows.map((r, i) => T.toSession(r, i));
  const cons = T.parseCommand('일요일 빼고, 수영 꼭', ['수영', '발레', '미술']);
  const plans = T.suggest(pool, cons, { seed: 1, timeBudgetMs: 60 });
  for (const p of plans) {
    assert.ok(p.items.every(x => !x.days.includes(6)), '일요일 없음');
    assert.ok(p.items.some(x => x.cat === '수영'), '수영 포함');
  }
});

test('alternativesFor / nearestAt: 끌어 옮길 자리', () => {
  const rows = [
    row('A점', '수영', '아쿠아 수영', '토', '10:00~10:50'),
    row('A점', '수영', '아쿠아 수영', '일', '10:00~10:50'),
    row('A점', '수영', '아쿠아 수영', '토', '11:00~11:50'),
    row('A점', '발레', '발레', '일', '10:00~10:50'),
  ];
  const pool = rows.map((r, i) => T.toSession(r, i));
  const plan = [pool[0], pool[3]];
  const alts = T.alternativesFor(pool[0], plan, pool, T.emptyCons(), (a, b) => (a === b ? 0 : 30));
  assert.deepEqual(alts.map(a => a.gi), [2], '일 10시는 발레와 겹쳐 제외, 토 11시만');
  assert.equal(T.nearestAt(alts, 5, 11 * 60 + 20).gi, 2);
  assert.equal(T.nearestAt(alts, 6, 11 * 60), null);
});

test('real data: all.json 전체로 해석률·제안 속도', () => {
  const p = path.join(__dirname, '..', 'data', 'all.json');
  if (!fs.existsSync(p)) return;
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  let ok = 0;
  const sess = [];
  data.forEach((r, i) => { const s = T.toSession(r, i); if (s) { ok++; sess.push(s); } });
  const rate = ok / data.length;
  assert.ok(rate > 0.995, '요일·시간 해석률 ' + (rate * 100).toFixed(2) + '%');
  // 한 센터 근처 크기의 실제 후보(현대백화점 무역센터점) 로 제안
  const pool = sess.filter(s => s.center.includes('무역센터'));
  if (pool.length) {
    const cats = [...new Set(data.map(r => r[3]))];
    const t0 = Date.now();
    const plans = T.suggest(pool, T.parseCommand('토요일만', cats), { seed: 5, timeBudgetMs: 300 });
    const ms = Date.now() - t0;
    assert.ok(ms < 1500, '제안 ' + ms + 'ms');
    assert.ok(plans[0].items.length > 0);
    assert.ok(plans[0].items.every(x => x.days.every(d => d === 5)));
    console.log('  실데이터: 해석률', (rate * 100).toFixed(2) + '%', '| 무역센터 후보', pool.length,
      '| 3안 종목 수', plans.map(p => p.stats.cats).join('/'), '|', ms + 'ms');
  }
});
