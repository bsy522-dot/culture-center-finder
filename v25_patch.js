/**
 * culture-center-finder v25.0 patch
 * 벤치마킹 Canvas 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 데이터 없음
 * 포트폴리오분산투자분석기Canvas+벤치마크매치업비교기Canvas+수강패턴시퀀스마이닝Canvas+카테고리성숙도라이프사이클Canvas+운영시간대갭분석기Canvas+수강료가성비프론티어Canvas+접근성인클루전매트릭스Canvas+종합수강인텔리전스리포트Canvas+퀴즈15(300→315)+업적12(258→270)+SFX12종+키보드9종
 */
(function(){
'use strict';
var V25_ID='ccf-v25-patch';
if(document.getElementById(V25_ID))return;
var marker=document.createElement('meta');marker.id=V25_ID;document.head.appendChild(marker);

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function lsGet(k,d){try{var s=localStorage.getItem(k);return s?JSON.parse(s):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function getData(){return window.__v4Data||[];}

function parsePrice(s){
  if(!s)return 0;
  var m=String(s).replace(/,/g,'').match(/(\d+)/);
  return m?parseInt(m[1]):0;
}
function parseHour(s){
  if(!s)return-1;
  var m=String(s).match(/(\d{1,2}):/);
  return m?parseInt(m[1]):-1;
}
function parseDays(s){
  if(!s)return[];
  return(String(s).match(/[월화수목금토일]/g)||[]);
}
function parseSessions(s){
  if(!s)return 0;
  if(typeof s==='number')return s;
  var m=String(s).match(/(\d+)/);
  return m?parseInt(m[1]):0;
}
function getRegion(center){
  if(!center)return'기타';
  if(center.indexOf('서울')>=0||center.indexOf('강남')>=0||center.indexOf('영등포')>=0||center.indexOf('송파')>=0||center.indexOf('잠실')>=0)return'서울';
  if(center.indexOf('경기')>=0||center.indexOf('수원')>=0||center.indexOf('성남')>=0||center.indexOf('고양')>=0||center.indexOf('용인')>=0||center.indexOf('안양')>=0||center.indexOf('부천')>=0||center.indexOf('화성')>=0||center.indexOf('평택')>=0)return'경기';
  if(center.indexOf('인천')>=0)return'인천';
  if(center.indexOf('부산')>=0)return'부산';
  if(center.indexOf('대구')>=0)return'대구';
  if(center.indexOf('대전')>=0)return'대전';
  if(center.indexOf('광주')>=0)return'광주';
  if(center.indexOf('충')>=0)return'충청';
  if(center.indexOf('전')>=0||center.indexOf('전남')>=0||center.indexOf('전북')>=0)return'전라';
  if(center.indexOf('경남')>=0||center.indexOf('경북')>=0||center.indexOf('울산')>=0||center.indexOf('창원')>=0||center.indexOf('포항')>=0)return'경상';
  return'기타';
}
function getCenterType(d){
  var name=d[1]||'';
  if(name.indexOf('홈플러스')>=0)return'홈플러스';
  if(name.indexOf('롯데')>=0)return'롯데마트';
  if(name.indexOf('이마트')>=0||name.indexOf('E마트')>=0)return'이마트';
  var type=d[0]||'';
  if(type.indexOf('백화점')>=0||name.indexOf('백화점')>=0||name.indexOf('현대')>=0||name.indexOf('신세계')>=0||name.indexOf('갤러리아')>=0)return'백화점';
  if(name.indexOf('구청')>=0||name.indexOf('주민')>=0||name.indexOf('시청')>=0||type.indexOf('지자체')>=0)return'구청';
  if(name.indexOf('대학')>=0||type.indexOf('대학')>=0)return'대학';
  if(name.indexOf('스포츠')>=0||name.indexOf('체육')>=0||name.indexOf('수영')>=0||type.indexOf('스포츠')>=0)return'스포츠센터';
  return'기타';
}
function parseMonth(s){
  if(!s)return-1;
  var m=String(s).match(/\.(\d{1,2})\./);
  if(m)return parseInt(m[1]);
  m=String(s).match(/(\d{1,2})\//);
  return m?parseInt(m[1]):-1;
}
function parseDurationHours(s){
  if(!s)return 1;
  var m=String(s).match(/(\d{1,2}):(\d{2})\s*~\s*(\d{1,2}):(\d{2})/);
  if(!m)return 1;
  var startM=parseInt(m[1])*60+parseInt(m[2]);
  var endM=parseInt(m[3])*60+parseInt(m[4]);
  var diff=endM-startM;
  if(diff<=0)diff+=24*60;
  return diff/60;
}
function paretoFrontier(pts){
  var frontier=[];
  for(var i=0;i<pts.length;i++){
    var dominated=false;
    for(var j=0;j<pts.length;j++){
      if(i===j)continue;
      if(pts[j].x<=pts[i].x&&pts[j].y>=pts[i].y&&(pts[j].x<pts[i].x||pts[j].y>pts[i].y)){dominated=true;break;}
    }
    if(!dominated)frontier.push(pts[i]);
  }
  frontier.sort(function(a,b){return a.x-b.x;});
  return frontier;
}

var COLORS=['#06B6D4','#3AAFA9','#F59E0B','#EF4444','#8B5CF6','#EC4899','#7EC8E3','#F97316','#6366F1','#14B8A6','#E879F9','#84CC16','#FB923C','#38BDF8','#A78BFA','#FBBF24','#34D399','#F472B6','#C084FC','#2DD4BF'];
var TYPES8=['홈플러스','롯데마트','이마트','백화점','구청','대학','스포츠센터','기타'];

// ─── SFX 엔진 v25 ─────────────────────────────────────────────
var SFX25={
  _ctx:null,
  _get:function(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  play:function(type){
    var c=this._get();if(!c)return;
    var o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);g.gain.value=0.06;
    var t=c.currentTime;
    switch(type){
      case'click':o.frequency.value=590;g.gain.exponentialRampToValueAtTime(0.001,t+0.05);o.start(t);o.stop(t+0.05);break;
      case'open':o.frequency.value=650;o.frequency.linearRampToValueAtTime(890,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'close':o.frequency.value=750;o.frequency.linearRampToValueAtTime(450,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'correct':o.frequency.value=570;o.frequency.linearRampToValueAtTime(830,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'wrong':o.type='sawtooth';o.frequency.value=330;g.gain.value=0.04;g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'achieve':o.frequency.value=550;o.frequency.linearRampToValueAtTime(950,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'scroll':o.type='triangle';o.frequency.value=510;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);break;
      case'hover':o.frequency.value=730;g.gain.value=0.03;g.gain.exponentialRampToValueAtTime(0.001,t+0.04);o.start(t);o.stop(t+0.04);break;
      case'complete':o.frequency.value=490;o.frequency.linearRampToValueAtTime(710,t+0.1);o.frequency.linearRampToValueAtTime(930,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'expand':o.type='triangle';o.frequency.value=550;o.frequency.linearRampToValueAtTime(770,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'collapse':o.type='triangle';o.frequency.value=700;o.frequency.linearRampToValueAtTime(470,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'milestone':o.frequency.value=490;o.frequency.linearRampToValueAtTime(930,t+0.15);o.frequency.linearRampToValueAtTime(710,t+0.25);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);break;
      default:o.frequency.value=490;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);
    }
  }
};

// ─── 업적 시스템 v25 ──────────────────────────────────────────
var ACHIEVEMENTS_V25=[
  {id:'v25_portfolio',name:'포트폴리오 투자가',desc:'강좌 포트폴리오 분산투자 분석기 열기'},
  {id:'v25_matchup',name:'벤치마크 심판',desc:'센터 벤치마크 매치업 비교기 열기'},
  {id:'v25_sequence',name:'시퀀스 마이너',desc:'수강 패턴 시퀀스 마이닝 열기'},
  {id:'v25_maturity',name:'라이프사이클 전문가',desc:'카테고리 성숙도 라이프사이클 열기'},
  {id:'v25_gap',name:'갭 헌터',desc:'센터 운영 시간대 갭 분석기 열기'},
  {id:'v25_frontier',name:'가성비 프론티어러',desc:'수강료 가성비 프론티어 열기'},
  {id:'v25_inclusion',name:'인클루전 심사관',desc:'강좌 접근성 인클루전 매트릭스 열기'},
  {id:'v25_intelligence',name:'인텔리전스 애널리스트',desc:'종합 수강 인텔리전스 리포트 열기'},
  {id:'v25_quiz_master',name:'v25 퀴즈 마스터',desc:'v25 퀴즈 10문 이상 정답'},
  {id:'v25_quiz_perfect',name:'v25 퀴즈 만점',desc:'v25 퀴즈 15문 전부 정답'},
  {id:'v25_explorer',name:'v25 탐험가',desc:'v25 5개 이상 섹션 열기'},
  {id:'v25_complete',name:'v25 정복자',desc:'v25 모든 섹션+퀴즈 완료'}
];

function getAchieves25(){return lsGet('ccf_achieves_v25',[]);}
function unlockAchieve25(id){
  var arr=getAchieves25();
  if(arr.indexOf(id)<0){arr.push(id);lsSet('ccf_achieves_v25',arr);SFX25.play('achieve');}
  checkAllSections25();
}
function checkAllSections25(){
  var arr=getAchieves25();
  var sectionAchs=SECTIONS25.map(function(s){return s.achieve;});
  var opened=sectionAchs.filter(function(a){return arr.indexOf(a)>=0;}).length;
  if(opened>=5&&arr.indexOf('v25_explorer')<0)unlockAchieve25('v25_explorer');
  if(opened>=8&&arr.indexOf('v25_quiz_master')>=0&&arr.indexOf('v25_complete')<0)unlockAchieve25('v25_complete');
}

// ─── 섹션 정의 ─────────────────────────────────────────────────
var SECTIONS25=[
  {id:'v25-portfolio',title:'강좌 포트폴리오 분산투자 분석기',icon:'📈',achieve:'v25_portfolio',sfx:'expand',render:renderPortfolio},
  {id:'v25-matchup',title:'센터 벤치마크 매치업 비교기',icon:'⚔️',achieve:'v25_matchup',sfx:'expand',render:renderMatchup},
  {id:'v25-sequence',title:'수강 패턴 시퀀스 마이닝',icon:'🧬',achieve:'v25_sequence',sfx:'expand',render:renderSequence},
  {id:'v25-maturity',title:'카테고리 성숙도 라이프사이클',icon:'🌱',achieve:'v25_maturity',sfx:'expand',render:renderMaturity},
  {id:'v25-gap',title:'센터 운영 시간대 갭 분석기',icon:'🕳️',achieve:'v25_gap',sfx:'expand',render:renderGap},
  {id:'v25-frontier',title:'수강료 가성비 프론티어',icon:'💎',achieve:'v25_frontier',sfx:'expand',render:renderFrontier},
  {id:'v25-inclusion',title:'강좌 접근성 인클루전 매트릭스',icon:'🤝',achieve:'v25_inclusion',sfx:'expand',render:renderInclusion},
  {id:'v25-intelligence',title:'종합 수강 인텔리전스 리포트',icon:'🧠',achieve:'v25_intelligence',sfx:'milestone',render:renderIntelligence}
];

// ─── 1. 강좌 포트폴리오 분산투자 분석기 (2D 산점도 + 효율프론티어) ───
function renderPortfolio(container){
  var data=getData();
  var catStats={};
  data.forEach(function(d){
    var cat=d[3]||'기타';
    if(!catStats[cat])catStats[cat]={count:0,totalPrice:0,priceN:0,totalHours:0,hoursN:0};
    catStats[cat].count++;
    var price=parsePrice(d[8]);
    if(price>0){catStats[cat].totalPrice+=price;catStats[cat].priceN++;}
    var sess=parseSessions(d[14]);
    var dur=parseDurationHours(d[7]);
    if(sess>0){catStats[cat].totalHours+=sess*dur;catStats[cat].hoursN++;}
  });
  var topCats=Object.entries(catStats).sort(function(a,b){return b[1].count-a[1].count;}).slice(0,10);

  var maxPrice=1,maxHours=1;
  var pts=topCats.map(function(e,i){
    var s=e[1];
    var avgPrice=s.priceN>0?s.totalPrice/s.priceN:0;
    var avgHours=s.hoursN>0?s.totalHours/s.hoursN:0;
    if(avgPrice>maxPrice)maxPrice=avgPrice;
    if(avgHours>maxHours)maxHours=avgHours;
    return{cat:e[0],x:avgPrice,y:avgHours,count:s.count,idx:i};
  });
  var frontier=paretoFrontier(pts);
  var optimal=frontier.reduce(function(best,p){
    var ratio=p.x>0?p.y/p.x*10000:0;
    if(!best||ratio>best._ratio){p._ratio=ratio;return p;}
    return best;
  },null);

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverIdx=-1;
  var px0=70,px1=580,py0=340,py1=60;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverIdx=-1;
    for(var i=0;i<pts.length;i++){
      var cx=px0+(pts[i].x/maxPrice)*(px1-px0);
      var cy=py0-(pts[i].y/maxHours)*(py0-py1);
      if(Math.abs(mx-cx)<10&&Math.abs(my-cy)<10){hoverIdx=i;break;}
    }
    drawPF();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawPF();});

  function drawPF(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('📈 강좌 포트폴리오 분산투자 분석기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('X:평균수강료 Y:총투자시간(회차×시간) | 점선:효율프론티어 | ★최적분산점',10,38);

    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(px0,py0);ctx.lineTo(px1,py0);ctx.moveTo(px0,py0);ctx.lineTo(px0,py1);ctx.stroke();
    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('비용(수강료) →',(px0+px1)/2,362);
    ctx.save();ctx.translate(30,(py0+py1)/2);ctx.rotate(-Math.PI/2);ctx.fillText('시간투자(시간) →',0,0);ctx.restore();
    ctx.textAlign='left';

    // 프론티어 곡선
    if(frontier.length>1){
      ctx.beginPath();
      frontier.forEach(function(p,i){
        var cx=px0+(p.x/maxPrice)*(px1-px0);
        var cy=py0-(p.y/maxHours)*(py0-py1);
        if(i===0)ctx.moveTo(cx,cy);else ctx.lineTo(cx,cy);
      });
      ctx.strokeStyle='rgba(6,182,212,0.55)';ctx.lineWidth=2;ctx.setLineDash([5,4]);ctx.stroke();ctx.setLineDash([]);
    }

    pts.forEach(function(p,i){
      var cx=px0+(p.x/maxPrice)*(px1-px0);
      var cy=py0-(p.y/maxHours)*(py0-py1);
      var isHov=(i===hoverIdx);
      var isFrontier=frontier.indexOf(p)>=0;
      var r=isHov?9:6+Math.min(6,p.count/50);
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.fillStyle=COLORS[i%COLORS.length];ctx.globalAlpha=isHov?1:(isFrontier?0.85:0.55);ctx.fill();
      if(isFrontier){ctx.strokeStyle='#06B6D4';ctx.lineWidth=1.5;ctx.stroke();}
      ctx.globalAlpha=1;
      ctx.fillStyle=isHov?'#fff':'#8ba4c4';ctx.font=(isHov?'bold ':'')+' 8px sans-serif';
      ctx.fillText(esc(p.cat.substring(0,6)),cx+10,cy+3);
    });

    if(optimal){
      var ox=px0+(optimal.x/maxPrice)*(px1-px0);
      var oy=py0-(optimal.y/maxHours)*(py0-py1);
      ctx.fillStyle='#FFD700';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
      ctx.fillText('★',ox,oy-14);
      ctx.textAlign='left';
    }

    if(hoverIdx>=0){
      var hp=pts[hoverIdx];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(370,335,240,56,6);ctx.fill();
      ctx.fillStyle='#06B6D4';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(hp.cat),380,351);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText(hp.count+'개 | 평균 '+Math.round(hp.x).toLocaleString()+'원 | 투자 '+hp.y.toFixed(1)+'시간',380,366);
      ctx.fillText(frontier.indexOf(hp)>=0?'✓ 효율프론티어 포함':'프론티어 미포함',380,381);
    }
  }
  drawPF();
}

// ─── 2. 센터 벤치마크 매치업 비교기 (Head-to-Head 듀얼바 6축) ───
function renderMatchup(container){
  var data=getData();
  var AXES=['강좌수','다양성','가격경쟁력','시간대범위','수강횟수','인기도'];
  var typeStats={};
  TYPES8.forEach(function(t){typeStats[t]={count:0,cats:{},totalPrice:0,priceN:0,hours:{},totalSess:0,sessN:0};});
  data.forEach(function(d){
    var t=getCenterType(d);
    var s=typeStats[t];if(!s)return;
    s.count++;s.cats[d[3]||'기타']=1;
    var price=parsePrice(d[8]);if(price>0){s.totalPrice+=price;s.priceN++;}
    var h=parseHour(d[7]);if(h>=0)s.hours[h]=1;
    var sess=parseSessions(d[14]);if(sess>0){s.totalSess+=sess;s.sessN++;}
  });
  var total=data.length||1;
  var typeScores=TYPES8.map(function(t){
    var s=typeStats[t];
    var avgPrice=s.priceN>0?s.totalPrice/s.priceN:0;
    var scores=[
      Math.min(100,s.count/8),
      Math.min(100,Object.keys(s.cats).length*6),
      Math.min(100,avgPrice>0?80000/avgPrice:50),
      Math.min(100,Object.keys(s.hours).length*8),
      Math.min(100,s.sessN>0?(s.totalSess/s.sessN)*8:0),
      Math.min(100,(s.count/total)*400)
    ];
    return{name:t,scores:scores,count:s.count};
  });

  var pairs=[];
  for(var i=0;i<TYPES8.length;i++)for(var j=i+1;j<TYPES8.length;j++)pairs.push([i,j]);
  var pairIdx=0;

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a;cursor:pointer';
  container.appendChild(canvas);

  canvas.addEventListener('click',function(){pairIdx=(pairIdx+1)%pairs.length;drawMU();SFX25.play('click');});

  function drawMU(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    var pA=typeScores[pairs[pairIdx][0]],pB=typeScores[pairs[pairIdx][1]];
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('⚔️ 센터 벤치마크 매치업 비교기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('클릭: 조합 변경 ('+(pairIdx+1)+'/'+pairs.length+') | Head-to-Head 6축',10,38);

    ctx.fillStyle=COLORS[0];ctx.font='bold 12px sans-serif';ctx.textAlign='left';
    ctx.fillText(esc(pA.name)+' ('+pA.count+'개)',15,58);
    ctx.fillStyle=COLORS[3];ctx.textAlign='right';
    ctx.fillText(esc(pB.name)+' ('+pB.count+'개)',625,58);
    ctx.textAlign='left';

    var midX=320,barMax=250,rowH=48,startY=75;
    var winsA=0,winsB=0;
    for(var i=0;i<6;i++){
      var y=startY+i*rowH;
      var av=pA.scores[i],bv=pB.scores[i];
      if(av>bv)winsA++;else if(bv>av)winsB++;
      var aw=(av/100)*barMax,bw=(bv/100)*barMax;

      ctx.fillStyle=av>=bv?'#06B6D4':'rgba(6,182,212,0.4)';
      ctx.beginPath();ctx.roundRect(midX-aw,y,aw,20,[4,0,0,4]);ctx.fill();
      ctx.fillStyle=bv>=av?'#F59E0B':'rgba(245,158,11,0.4)';
      ctx.beginPath();ctx.roundRect(midX,y,bw,20,[0,4,4,0]);ctx.fill();

      ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='right';
      ctx.fillText(av.toFixed(0),midX-aw-5,y+14);
      ctx.textAlign='left';
      ctx.fillText(bv.toFixed(0),midX+bw+5,y+14);

      ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText(AXES[i],midX,y+34);
      ctx.textAlign='left';
    }

    var resultTxt=winsA>winsB?esc(pA.name)+' 우세 ('+winsA+':'+winsB+')':winsB>winsA?esc(pB.name)+' 우세 ('+winsB+':'+winsA+')':'동률 ('+winsA+':'+winsB+')';
    ctx.fillStyle='#FFD700';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
    ctx.fillText('🏆 '+resultTxt,320,392);
    ctx.textAlign='left';
  }
  drawMU();
}

// ─── 3. 수강 패턴 시퀀스 마이닝 (Sankey-style 흐름도) ─────────
function renderSequence(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,12).map(function(e){return e[0];});

  var centerCats={};
  data.forEach(function(d){
    var center=d[1]||d[0]||'';
    var cat=d[3]||'기타';
    if(topCats.indexOf(cat)<0)return;
    if(!centerCats[center])centerCats[center]={};
    centerCats[center][cat]=1;
  });
  var n=topCats.length;
  var matrix=[];
  for(var i=0;i<n;i++){matrix[i]=[];for(var j=0;j<n;j++)matrix[i][j]=0;}
  Object.values(centerCats).forEach(function(cats){
    for(var i=0;i<n;i++)for(var j=0;j<n;j++){
      if(i!==j&&cats[topCats[i]]&&cats[topCats[j]])matrix[i][j]++;
    }
  });
  var edges=[];
  for(var i=0;i<n;i++)for(var j=i+1;j<n;j++){
    var w=matrix[i][j];
    if(w>0)edges.push({s:i,t:j,w:w});
  }
  edges.sort(function(a,b){return b.w-a.w;});
  edges=edges.slice(0,20);
  var maxW=1;edges.forEach(function(e){if(e.w>maxW)maxW=e.w;});

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverEdge=-1;
  var lx=110,rx=510,topY=50,botY=380;

  function nodeY(i){return topY+(i/(n-1))*(botY-topY);}

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverEdge=-1;
    for(var i=0;i<edges.length;i++){
      var e=edges[i];
      var y1=nodeY(e.s),y2=nodeY(e.t);
      var midx=(lx+rx)/2;
      var midy=(y1+y2)/2;
      if(Math.abs(mx-midx)<80&&Math.abs(my-midy)<12){hoverEdge=i;break;}
    }
    drawSeq();
  });
  canvas.addEventListener('mouseleave',function(){hoverEdge=-1;drawSeq();});

  function drawSeq(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('🧬 수강 패턴 시퀀스 마이닝',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('TOP 12 카테고리 동시운영 흐름 | 아크 두께=전환빈도 | 상위 20개 연결',10,38);

    for(var i=0;i<n;i++){
      var y=nodeY(i);
      ctx.fillStyle=COLORS[i%COLORS.length];
      ctx.beginPath();ctx.arc(lx,y,4,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(rx,y,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';ctx.textAlign='right';
      ctx.fillText(esc(topCats[i].substring(0,6)),lx-8,y+3);
      ctx.textAlign='left';
      ctx.fillText(esc(topCats[i].substring(0,6)),rx+8,y+3);
    }

    edges.forEach(function(e,i){
      var y1=nodeY(e.s),y2=nodeY(e.t);
      var isHov=(i===hoverEdge);
      var thick=1+Math.max(0.5,(e.w/maxW)*10);
      ctx.beginPath();
      ctx.moveTo(lx+5,y1);
      ctx.bezierCurveTo(lx+180,y1,rx-180,y2,rx-5,y2);
      ctx.strokeStyle=isHov?'rgba(255,215,0,0.85)':'rgba(6,182,212,'+(0.12+(e.w/maxW)*0.45)+')';
      ctx.lineWidth=isHov?thick+2:thick;
      ctx.stroke();
    });

    if(hoverEdge>=0){
      var he=edges[hoverEdge];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(190,355,240,38,6);ctx.fill();
      ctx.fillStyle='#FFD700';ctx.font='bold 9px sans-serif';
      ctx.fillText(esc(topCats[he.s].substring(0,8))+' ↔ '+esc(topCats[he.t].substring(0,8)),200,370);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText('동시운영 '+he.w+'개 센터',200,384);
    }
  }
  drawSeq();
}

// ─── 4. 카테고리 성숙도 라이프사이클 (S커브 4단계) ────────────
function renderMaturity(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,10).map(function(e){return e[0];});
  var total=data.length||1;

  var catInfo={};
  topCats.forEach(function(c){catInfo[c]={months:{},count:allCats[c]};});
  data.forEach(function(d){
    var cat=d[3]||'기타';
    if(!catInfo[cat])return;
    var m=parseMonth(d[13]);
    if(m>=1&&m<=12)catInfo[cat].months[m]=(catInfo[cat].months[m]||0)+1;
  });

  var lifecycle=topCats.map(function(cat,i){
    var info=catInfo[cat];
    var share=info.count/total;
    var monthDiversity=Object.keys(info.months).length/12;
    var composite=Math.min(100,share*500+monthDiversity*40);
    var stage=composite<25?'도입':composite<55?'성장':composite<80?'성숙':'쇠퇴';
    var sig=100/(1+Math.exp(-0.09*(composite-50)));
    return{cat:cat,composite:composite,sig:sig,stage:stage,count:info.count,idx:i};
  });

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverIdx=-1;
  var px0=60,px1=600,py0=340,py1=60;
  var STAGE_COLOR={'도입':'#8B5CF6','성장':'#06B6D4','성숙':'#3AAFA9','쇠퇴':'#EF4444'};

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverIdx=-1;
    for(var i=0;i<lifecycle.length;i++){
      var l=lifecycle[i];
      var cx=px0+(l.composite/100)*(px1-px0);
      var cy=py0-(l.sig/100)*(py0-py1);
      if(Math.abs(mx-cx)<10&&Math.abs(my-cy)<10){hoverIdx=i;break;}
    }
    drawMat();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawMat();});

  function drawMat(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('🌱 카테고리 성숙도 라이프사이클',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('시장점유율+월분산 기반 S커브 | 도입→성장→성숙→쇠퇴',10,38);

    var stageBounds=[0,25,55,80,100];
    var stageNames=['도입','성장','성숙','쇠퇴'];
    for(var b=0;b<4;b++){
      var bx0=px0+(stageBounds[b]/100)*(px1-px0);
      var bx1=px0+(stageBounds[b+1]/100)*(px1-px0);
      ctx.fillStyle=b%2===0?'rgba(255,255,255,0.015)':'rgba(255,255,255,0.03)';
      ctx.fillRect(bx0,py1,bx1-bx0,py0-py1);
      ctx.fillStyle=STAGE_COLOR[stageNames[b]];ctx.globalAlpha=0.7;ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText(stageNames[b],(bx0+bx1)/2,py0+16);
      ctx.globalAlpha=1;
    }
    ctx.textAlign='left';

    ctx.beginPath();
    for(var x=0;x<=100;x+=2){
      var sy=100/(1+Math.exp(-0.09*(x-50)));
      var cx=px0+(x/100)*(px1-px0);
      var cy=py0-(sy/100)*(py0-py1);
      if(x===0)ctx.moveTo(cx,cy);else ctx.lineTo(cx,cy);
    }
    ctx.strokeStyle='rgba(255,255,255,0.25)';ctx.lineWidth=1.5;ctx.stroke();

    lifecycle.forEach(function(l,i){
      var cx=px0+(l.composite/100)*(px1-px0);
      var cy=py0-(l.sig/100)*(py0-py1);
      var isHov=(i===hoverIdx);
      ctx.beginPath();ctx.arc(cx,cy,isHov?8:5,0,Math.PI*2);
      ctx.fillStyle=STAGE_COLOR[l.stage];ctx.fill();
      if(isHov){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();}
      ctx.fillStyle=isHov?'#fff':'#8ba4c4';ctx.font=(isHov?'bold ':'')+' 8px sans-serif';
      ctx.fillText(esc(l.cat.substring(0,6)),cx+8,cy-8);
    });

    if(hoverIdx>=0){
      var hl=lifecycle[hoverIdx];
      var outlook=hl.stage==='도입'?'초기 시장 진입 단계, 확장 잠재력 보유':hl.stage==='성장'?'수요 확산 중, 카테고리 투자 적기':hl.stage==='성숙'?'안정적 운영, 경쟁 심화 국면':'수요 정체, 리뉴얼/신규기획 필요';
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(360,335,270,58,6);ctx.fill();
      ctx.fillStyle=STAGE_COLOR[hl.stage];ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(hl.cat)+' · '+hl.stage,370,351);
      ctx.fillStyle='#d4d4d4';ctx.font='8px sans-serif';
      ctx.fillText(hl.count+'개 | 종합점수 '+hl.composite.toFixed(1),370,365);
      ctx.fillText('전망: '+outlook,370,379);
    }
  }
  drawMat();
}

// ─── 5. 센터 운영 시간대 갭 분석기 (수요-공급 갭 히트맵) ──────
function renderGap(container){
  var data=getData();
  var HOURS=[];for(var h=8;h<=19;h++)HOURS.push(h);
  var actual={};TYPES8.forEach(function(t){actual[t]={};HOURS.forEach(function(h){actual[t][h]=0;});});
  var typeTotal={};TYPES8.forEach(function(t){typeTotal[t]=0;});
  var hourTotal={};HOURS.forEach(function(h){hourTotal[h]=0;});
  var grandTotal=0;

  data.forEach(function(d){
    var t=getCenterType(d);
    var h=parseHour(d[7]);
    if(HOURS.indexOf(h)<0)return;
    if(!actual[t])return;
    actual[t][h]++;typeTotal[t]++;hourTotal[h]++;grandTotal++;
  });
  grandTotal=grandTotal||1;

  var gap={};var maxAbsGap=1;
  TYPES8.forEach(function(t){
    gap[t]={};
    HOURS.forEach(function(h){
      var expected=hourTotal[h]*(typeTotal[t]/grandTotal);
      var g=actual[t][h]-expected;
      gap[t][h]=g;
      if(Math.abs(g)>maxAbsGap)maxAbsGap=Math.abs(g);
    });
  });

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverR=-1,hoverC=-1;
  var cellW=41,cellH=30,startX=110,startY=55;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverR=-1;hoverC=-1;
    if(mx>=startX&&my>=startY){
      var c=Math.floor((mx-startX)/cellW);
      var r=Math.floor((my-startY)/cellH);
      if(r>=0&&r<TYPES8.length&&c>=0&&c<HOURS.length){hoverR=r;hoverC=c;}
    }
    drawGap();
  });
  canvas.addEventListener('mouseleave',function(){hoverR=-1;hoverC=-1;drawGap();});

  function drawGap(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('🕳️ 센터 운영 시간대 갭 분석기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('8센터유형×12시간대(8~19시) | 파랑:공급과잉 빨강:공급부족(기회) ⭐:빈시간대',10,38);

    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';ctx.textAlign='center';
    HOURS.forEach(function(h,ci){
      ctx.fillStyle=(ci===hoverC)?'#06B6D4':'#8ba4c4';
      ctx.fillText(h+'시',startX+ci*cellW+cellW/2,startY-5);
    });
    ctx.textAlign='right';
    TYPES8.forEach(function(t,ri){
      ctx.fillStyle=(ri===hoverR)?'#06B6D4':'#8ba4c4';ctx.font='9px sans-serif';
      ctx.fillText(esc(t),startX-6,startY+ri*cellH+cellH/2+3);
    });
    ctx.textAlign='left';

    TYPES8.forEach(function(t,ri){
      HOURS.forEach(function(h,ci){
        var g=gap[t][h];
        var norm=g/maxAbsGap;
        var isHov=(ri===hoverR&&ci===hoverC);
        var isEmpty=(actual[t][h]===0&&hourTotal[h]>grandTotal*0.03);
        var color=norm>=0?'rgba(56,189,248,'+(0.12+Math.min(0.75,norm))+')':'rgba(239,68,68,'+(0.12+Math.min(0.75,-norm))+')';
        ctx.fillStyle=isHov?'rgba(255,255,255,0.3)':color;
        ctx.beginPath();ctx.roundRect(startX+ci*cellW+1,startY+ri*cellH+1,cellW-2,cellH-2,3);ctx.fill();
        if(isEmpty){
          ctx.fillStyle='#FFD700';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
          ctx.fillText('★',startX+ci*cellW+cellW/2,startY+ri*cellH+cellH/2+4);
          ctx.textAlign='left';
        }
      });
    });

    if(hoverR>=0&&hoverC>=0){
      var t=TYPES8[hoverR],h=HOURS[hoverC];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(370,340,240,52,6);ctx.fill();
      ctx.fillStyle='#06B6D4';ctx.font='bold 9px sans-serif';
      ctx.fillText(esc(t)+' · '+h+'시',380,356);
      ctx.fillStyle='#d4d4d4';ctx.font='8px sans-serif';
      ctx.fillText('실제 '+actual[t][h]+'개 | 갭 '+(gap[t][h]>=0?'+':'')+gap[t][h].toFixed(1),380,370);
      ctx.fillText(gap[t][h]<0?'⚠ 공급부족 (기회 시간대)':'공급 충분',380,384);
    }
  }
  drawGap();
}

// ─── 6. 수강료 가성비 프론티어 (파레토 프론티어 + 추천존) ─────
function renderFrontier(container){
  var data=getData();
  var catStats={};
  data.forEach(function(d){
    var cat=d[3]||'기타';
    if(!catStats[cat])catStats[cat]={count:0,totalPrice:0,priceN:0,totalSess:0,sessN:0};
    catStats[cat].count++;
    var price=parsePrice(d[8]);if(price>0){catStats[cat].totalPrice+=price;catStats[cat].priceN++;}
    var sess=parseSessions(d[14]);if(sess>0){catStats[cat].totalSess+=sess;catStats[cat].sessN++;}
  });
  var topCats=Object.entries(catStats).sort(function(a,b){return b[1].count-a[1].count;}).slice(0,10);

  var maxPrice=1,maxSess=1;
  var pts=topCats.map(function(e){
    var s=e[1];
    var avgPrice=s.priceN>0?s.totalPrice/s.priceN:0;
    var avgSess=s.sessN>0?s.totalSess/s.sessN:0;
    if(avgPrice>maxPrice)maxPrice=avgPrice;
    if(avgSess>maxSess)maxSess=avgSess;
    return{cat:e[0],x:avgPrice,y:avgSess,count:s.count};
  });
  var frontier=paretoFrontier(pts);
  var medPrice=pts.slice().sort(function(a,b){return a.x-b.x;})[Math.floor(pts.length/2)].x;
  var medSess=pts.slice().sort(function(a,b){return a.y-b.y;})[Math.floor(pts.length/2)].y;

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverIdx=-1;
  var px0=70,px1=580,py0=340,py1=60;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverIdx=-1;
    for(var i=0;i<pts.length;i++){
      var cx=px0+(pts[i].x/maxPrice)*(px1-px0);
      var cy=py0-(pts[i].y/maxSess)*(py0-py1);
      if(Math.abs(mx-cx)<10&&Math.abs(my-cy)<10){hoverIdx=i;break;}
    }
    drawVal();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawVal();});

  function drawVal(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('💎 수강료 가성비 프론티어',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('X:평균수강료(낮을수록↑) Y:평균수강횟수(높을수록↑) | 초록존:추천구간',10,38);

    var rx0=px0,ry0=py0-(medSess/maxSess)*(py0-py1);
    var rx1=px0+(medPrice/maxPrice)*(px1-px0),ry1=py1;
    ctx.fillStyle='rgba(52,211,153,0.08)';
    ctx.fillRect(rx0,ry1,rx1-rx0,ry0-ry1);
    ctx.strokeStyle='rgba(52,211,153,0.3)';ctx.setLineDash([3,3]);
    ctx.strokeRect(rx0,ry1,rx1-rx0,ry0-ry1);ctx.setLineDash([]);
    ctx.fillStyle='#34D399';ctx.font='9px sans-serif';ctx.fillText('추천존 (저가·고횟수)',rx0+6,ry1+14);

    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(px0,py0);ctx.lineTo(px1,py0);ctx.moveTo(px0,py0);ctx.lineTo(px0,py1);ctx.stroke();

    if(frontier.length>1){
      ctx.beginPath();
      frontier.forEach(function(p,i){
        var cx=px0+(p.x/maxPrice)*(px1-px0);
        var cy=py0-(p.y/maxSess)*(py0-py1);
        if(i===0)ctx.moveTo(cx,cy);else ctx.lineTo(cx,cy);
      });
      ctx.strokeStyle='rgba(255,215,0,0.6)';ctx.lineWidth=2;ctx.stroke();
    }

    pts.forEach(function(p,i){
      var cx=px0+(p.x/maxPrice)*(px1-px0);
      var cy=py0-(p.y/maxSess)*(py0-py1);
      var isHov=(i===hoverIdx);
      var isFrontier=frontier.indexOf(p)>=0;
      ctx.beginPath();ctx.arc(cx,cy,isHov?9:6,0,Math.PI*2);
      ctx.fillStyle=isFrontier?'#FFD700':COLORS[i%COLORS.length];
      ctx.globalAlpha=isHov?1:0.75;ctx.fill();ctx.globalAlpha=1;
      ctx.fillStyle=isHov?'#fff':'#8ba4c4';ctx.font=(isHov?'bold ':'')+' 8px sans-serif';
      ctx.fillText(esc(p.cat.substring(0,6)),cx+9,cy+3);
    });

    if(hoverIdx>=0){
      var hp=pts[hoverIdx];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(360,335,250,52,6);ctx.fill();
      ctx.fillStyle='#06B6D4';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(hp.cat),370,351);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText(hp.count+'개 | 평균 '+Math.round(hp.x).toLocaleString()+'원 | '+hp.y.toFixed(1)+'회',370,366);
      ctx.fillText(frontier.indexOf(hp)>=0?'★ 가성비 프론티어':'프론티어 미포함',370,380);
    }
  }
  drawVal();
}

// ─── 7. 강좌 접근성 인클루전 매트릭스 (8카테고리×6지표 히트맵) ─
function renderInclusion(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});
  var METRICS=['가격','시간대','지역','요일','대상','기간'];

  var catInfo={};
  topCats.forEach(function(c){catInfo[c]={prices:[],hours:{},regions:{},days:{},targets:{},sessBuckets:{}};});
  data.forEach(function(d){
    var cat=d[3]||'기타';
    var info=catInfo[cat];if(!info)return;
    var price=parsePrice(d[8]);if(price>0)info.prices.push(price);
    var h=parseHour(d[7]);if(h>=0)info.hours[h]=1;
    var r=getRegion(d[15]||d[1]||'');info.regions[r]=1;
    parseDays(d[6]).forEach(function(dd){info.days[dd]=1;});
    var tg=d[5]||'기타';info.targets[tg]=1;
    var sess=parseSessions(d[14]);
    var bucket=sess<=1?'단기':sess<=4?'중단기':sess<=8?'중기':'장기';
    info.sessBuckets[bucket]=1;
  });

  var maxAvgPrice=1;
  topCats.forEach(function(c){
    var p=catInfo[c].prices;
    var avg=p.length?p.reduce(function(a,b){return a+b;},0)/p.length:0;
    catInfo[c].avgPrice=avg;
    if(avg>maxAvgPrice)maxAvgPrice=avg;
  });

  var scores={};
  topCats.forEach(function(c){
    var info=catInfo[c];
    scores[c]=[
      Math.max(0,100-(info.avgPrice/maxAvgPrice)*100),
      Math.min(100,Object.keys(info.hours).length*9),
      Math.min(100,Object.keys(info.regions).length*11),
      Math.min(100,Object.keys(info.days).length*15),
      Math.min(100,Object.keys(info.targets).length*20),
      Math.min(100,Object.keys(info.sessBuckets).length*25)
    ];
  });

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverR=-1,hoverC=-1;
  var cellW=68,cellH=34,startX=140,startY=60;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverR=-1;hoverC=-1;
    if(mx>=startX&&my>=startY){
      var c=Math.floor((mx-startX)/cellW);
      var r=Math.floor((my-startY)/cellH);
      if(r>=0&&r<topCats.length&&c>=0&&c<6){hoverR=r;hoverC=c;}
    }
    drawInc();
  });
  canvas.addEventListener('mouseleave',function(){hoverR=-1;hoverC=-1;drawInc();});

  function grade(v){return v>=80?'S':v>=65?'A':v>=50?'B':v>=35?'C':'D';}

  function drawInc(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('🤝 강좌 접근성 인클루전 매트릭스',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('TOP 8 카테고리 × 6접근성지표 | 포용성 등급 S~D',10,38);

    ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';ctx.textAlign='center';
    METRICS.forEach(function(m,ci){
      ctx.fillStyle=(ci===hoverC)?'#06B6D4':'#8ba4c4';
      ctx.fillText(m,startX+ci*cellW+cellW/2,startY-8);
    });
    ctx.textAlign='right';
    topCats.forEach(function(c,ri){
      ctx.fillStyle=(ri===hoverR)?'#06B6D4':'#8ba4c4';ctx.font='9px sans-serif';
      ctx.fillText(esc(c.substring(0,7)),startX-8,startY+ri*cellH+cellH/2+3);
    });
    ctx.textAlign='left';

    topCats.forEach(function(c,ri){
      var rowScores=scores[c];
      var avgScore=rowScores.reduce(function(a,b){return a+b;},0)/6;
      METRICS.forEach(function(m,ci){
        var v=rowScores[ci];
        var isHov=(ri===hoverR&&ci===hoverC);
        var alpha=0.12+(v/100)*0.7;
        ctx.fillStyle=isHov?'rgba(255,255,255,0.3)':'rgba(6,182,212,'+alpha+')';
        ctx.beginPath();ctx.roundRect(startX+ci*cellW+1,startY+ri*cellH+1,cellW-2,cellH-2,3);ctx.fill();
        ctx.fillStyle=v>50?'#fff':'#9fb4cc';ctx.font='9px sans-serif';ctx.textAlign='center';
        ctx.fillText(v.toFixed(0),startX+ci*cellW+cellW/2,startY+ri*cellH+cellH/2+3);
        ctx.textAlign='left';
      });
      var g=grade(avgScore);
      var gc=g==='S'?'#FFD700':g==='A'?'#06B6D4':g==='B'?'#3AAFA9':g==='C'?'#F59E0B':'#EF4444';
      ctx.fillStyle=gc;ctx.font='bold 11px sans-serif';
      ctx.fillText(g,startX+6*cellW+16,startY+ri*cellH+cellH/2+4);
    });
    ctx.fillStyle='#556173';ctx.font='8px sans-serif';
    ctx.fillText('등급',startX+6*cellW+10,startY-8);

    if(hoverR>=0&&hoverC>=0){
      var c=topCats[hoverR];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(150,352,340,40,6);ctx.fill();
      ctx.fillStyle='#06B6D4';ctx.font='bold 9px sans-serif';
      ctx.fillText(esc(c)+' · '+METRICS[hoverC],160,368);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText('점수 '+scores[c][hoverC].toFixed(1)+'/100 ('+grade(scores[c][hoverC])+'등급)',160,382);
    }
  }
  drawInc();
}

// ─── 8. 종합 수강 인텔리전스 리포트 (8 KPI 반원게이지 4x2) ────
function renderIntelligence(container){
  var data=getData();
  var total=data.length||1;

  // KPI1: 포트폴리오분산 (엔트로피 기반 다양성)
  var catCount={};
  data.forEach(function(d){var c=d[3]||'기타';catCount[c]=(catCount[c]||0)+1;});
  var catKeys=Object.keys(catCount);
  var entropy=0;
  catKeys.forEach(function(k){var p=catCount[k]/total;entropy+=-p*Math.log(p+1e-12)/Math.LN2;});
  var maxEntropy=Math.log(catKeys.length||1)/Math.LN2;
  var kpiPortfolio=maxEntropy>0?Math.min(100,(entropy/maxEntropy)*100):50;

  // KPI2: 매치업 경쟁력 (유형 평균 종합 스코어)
  var typeStats={};TYPES8.forEach(function(t){typeStats[t]={count:0,cats:{},totalPrice:0,priceN:0,hours:{},totalSess:0,sessN:0};});
  data.forEach(function(d){
    var t=getCenterType(d);var s=typeStats[t];if(!s)return;
    s.count++;s.cats[d[3]||'기타']=1;
    var price=parsePrice(d[8]);if(price>0){s.totalPrice+=price;s.priceN++;}
    var h=parseHour(d[7]);if(h>=0)s.hours[h]=1;
    var sess=parseSessions(d[14]);if(sess>0){s.totalSess+=sess;s.sessN++;}
  });
  var typeAvgScores=TYPES8.map(function(t){
    var s=typeStats[t];var avgPrice=s.priceN>0?s.totalPrice/s.priceN:0;
    var sc=[Math.min(100,s.count/8),Math.min(100,Object.keys(s.cats).length*6),Math.min(100,avgPrice>0?80000/avgPrice:50),Math.min(100,Object.keys(s.hours).length*8),Math.min(100,s.sessN>0?(s.totalSess/s.sessN)*8:0),Math.min(100,(s.count/total)*400)];
    return sc.reduce(function(a,b){return a+b;},0)/6;
  });
  var kpiMatchup=typeAvgScores.reduce(function(a,b){return a+b;},0)/TYPES8.length;

  // KPI3: 시퀀스 연결성 (동시운영 밀도, TOP12)
  var top12=Object.entries(catCount).sort(function(a,b){return b[1]-a[1];}).slice(0,12).map(function(e){return e[0];});
  var centerCats={};
  data.forEach(function(d){
    var center=d[1]||'';var cat=d[3]||'기타';
    if(top12.indexOf(cat)<0)return;
    if(!centerCats[center])centerCats[center]={};
    centerCats[center][cat]=1;
  });
  var pairCount=0,pairTotal=0;
  Object.values(centerCats).forEach(function(cats){
    var have=top12.filter(function(c){return cats[c];});
    pairTotal+=(top12.length*(top12.length-1))/2;
    pairCount+=(have.length*(have.length-1))/2;
  });
  var kpiSequence=pairTotal>0?Math.min(100,(pairCount/pairTotal)*100*8):30;

  // KPI4: 성숙도 지수 (성숙+쇠퇴 비중)
  var top10=Object.entries(catCount).sort(function(a,b){return b[1]-a[1];}).slice(0,10).map(function(e){return e[0];});
  var monthMap={};top10.forEach(function(c){monthMap[c]={};});
  data.forEach(function(d){
    var cat=d[3]||'기타';if(!monthMap[cat])return;
    var m=parseMonth(d[13]);if(m>=1&&m<=12)monthMap[cat][m]=1;
  });
  var matureCount=0;
  top10.forEach(function(c){
    var share=(catCount[c]||0)/total;
    var diversity=Object.keys(monthMap[c]).length/12;
    var composite=Math.min(100,share*500+diversity*40);
    if(composite>=55)matureCount++;
  });
  var kpiMaturity=Math.min(100,(matureCount/top10.length)*100);

  // KPI5: 시간대갭 커버리지
  var HOURS=[];for(var h=8;h<=19;h++)HOURS.push(h);
  var coverCells=0;
  TYPES8.forEach(function(t){
    HOURS.forEach(function(hh){
      var has=data.some(function(d){return getCenterType(d)===t&&parseHour(d[7])===hh;});
      if(has)coverCells++;
    });
  });
  var kpiGap=Math.min(100,(coverCells/(TYPES8.length*HOURS.length))*100);

  // KPI6: 가성비 (프론티어 비율)
  var vcStats={};
  data.forEach(function(d){
    var cat=d[3]||'기타';
    if(top10.indexOf(cat)<0)return;
    if(!vcStats[cat])vcStats[cat]={totalPrice:0,priceN:0,totalSess:0,sessN:0};
    var price=parsePrice(d[8]);if(price>0){vcStats[cat].totalPrice+=price;vcStats[cat].priceN++;}
    var sess=parseSessions(d[14]);if(sess>0){vcStats[cat].totalSess+=sess;vcStats[cat].sessN++;}
  });
  var vcPts=top10.map(function(c){
    var s=vcStats[c]||{totalPrice:0,priceN:0,totalSess:0,sessN:0};
    return{x:s.priceN>0?s.totalPrice/s.priceN:0,y:s.sessN>0?s.totalSess/s.sessN:0};
  });
  var vcFrontier=paretoFrontier(vcPts);
  var kpiFrontier=Math.min(100,(vcFrontier.length/vcPts.length)*100);

  // KPI7: 접근성 (인클루전 평균)
  var top8=Object.entries(catCount).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});
  var incStats={};top8.forEach(function(c){incStats[c]={prices:[],hours:{},regions:{},days:{},targets:{},buckets:{}};});
  data.forEach(function(d){
    var cat=d[3]||'기타';var info=incStats[cat];if(!info)return;
    var price=parsePrice(d[8]);if(price>0)info.prices.push(price);
    var hh=parseHour(d[7]);if(hh>=0)info.hours[hh]=1;
    var r=getRegion(d[15]||d[1]||'');info.regions[r]=1;
    parseDays(d[6]).forEach(function(dd){info.days[dd]=1;});
    info.targets[d[5]||'기타']=1;
    var sess=parseSessions(d[14]);
    var bucket=sess<=1?'단기':sess<=4?'중단기':sess<=8?'중기':'장기';
    info.buckets[bucket]=1;
  });
  var maxAP=1;top8.forEach(function(c){var p=incStats[c].prices;var avg=p.length?p.reduce(function(a,b){return a+b;},0)/p.length:0;incStats[c].avgPrice=avg;if(avg>maxAP)maxAP=avg;});
  var incScoresAvg=top8.map(function(c){
    var info=incStats[c];
    var sc=[Math.max(0,100-(info.avgPrice/maxAP)*100),Math.min(100,Object.keys(info.hours).length*9),Math.min(100,Object.keys(info.regions).length*11),Math.min(100,Object.keys(info.days).length*15),Math.min(100,Object.keys(info.targets).length*20),Math.min(100,Object.keys(info.buckets).length*25)];
    return sc.reduce(function(a,b){return a+b;},0)/6;
  });
  var kpiInclusion=incScoresAvg.reduce(function(a,b){return a+b;},0)/(incScoresAvg.length||1);

  var KPIs=[
    {name:'포트폴리오분산',value:kpiPortfolio,icon:'📈'},
    {name:'매치업경쟁력',value:kpiMatchup,icon:'⚔️'},
    {name:'시퀀스연결성',value:kpiSequence,icon:'🧬'},
    {name:'성숙도지수',value:kpiMaturity,icon:'🌱'},
    {name:'갭커버리지',value:kpiGap,icon:'🕳️'},
    {name:'가성비프론티어',value:kpiFrontier,icon:'💎'},
    {name:'접근성인클루전',value:kpiInclusion,icon:'🤝'}
  ];
  var weights7=[0.16,0.14,0.12,0.13,0.13,0.16,0.16];
  var overall7=KPIs.reduce(function(sum,k,i){return sum+k.value*weights7[i];},0);
  KPIs.push({name:'종합',value:overall7,icon:'🧠'});
  var weights=[0.13,0.12,0.1,0.11,0.11,0.13,0.13,0.17];
  var overall=KPIs.reduce(function(sum,k,i){return sum+k.value*weights[i];},0);
  var overallGrade=overall>=80?'S':overall>=65?'A':overall>=50?'B':overall>=35?'C':'D';

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverIdx=-1;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverIdx=-1;
    for(var i=0;i<8;i++){
      var col=i%4,row=Math.floor(i/4);
      var gx=15+col*152,gy=58+row*168;
      if(mx>=gx&&mx<=gx+145&&my>=gy&&my<=gy+160){hoverIdx=i;break;}
    }
    drawIntel();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawIntel();});

  function drawIntel(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('🧠 종합 수강 인텔리전스 리포트',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    var gradeColor=overallGrade==='S'?'#FFD700':overallGrade==='A'?'#06B6D4':overallGrade==='B'?'#3AAFA9':overallGrade==='C'?'#F59E0B':'#EF4444';
    ctx.fillText('8 KPI 종합 가중평가 | ',10,38);
    ctx.fillStyle=gradeColor;ctx.font='bold 11px sans-serif';
    ctx.fillText('종합등급 '+overallGrade+' ('+overall.toFixed(1)+')',150,38);

    for(var i=0;i<8;i++){
      var kpi=KPIs[i];
      var col=i%4,row=Math.floor(i/4);
      var gx=15+col*152,gy=58+row*168;
      var isHov=(i===hoverIdx);
      var pct=Math.max(0,Math.min(100,kpi.value))/100;

      ctx.fillStyle=isHov?'rgba(6,182,212,0.08)':'rgba(255,255,255,0.02)';
      ctx.strokeStyle=isHov?'rgba(6,182,212,0.3)':'rgba(255,255,255,0.06)';
      ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(gx,gy,145,160,8);ctx.fill();ctx.stroke();

      ctx.fillStyle=isHov?'#06B6D4':'#d4d4d4';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      ctx.fillText(kpi.icon+' '+kpi.name,gx+72,gy+18);

      var gcx=gx+72,gcy=gy+95,gR=42;
      ctx.beginPath();ctx.arc(gcx,gcy,gR,Math.PI,0);
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=7;ctx.stroke();

      var endA=Math.PI+pct*Math.PI;
      ctx.beginPath();ctx.arc(gcx,gcy,gR,Math.PI,endA);
      var kGrade=kpi.value>=80?'S':kpi.value>=65?'A':kpi.value>=50?'B':kpi.value>=35?'C':'D';
      var kColor=kGrade==='S'?'#FFD700':kGrade==='A'?'#06B6D4':kGrade==='B'?'#3AAFA9':kGrade==='C'?'#F59E0B':'#EF4444';
      ctx.strokeStyle=kColor;ctx.lineWidth=7;ctx.lineCap='round';ctx.stroke();ctx.lineCap='butt';

      ctx.fillStyle=kColor;ctx.font='bold 16px sans-serif';
      ctx.fillText(kGrade,gcx,gcy-2);
      ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';
      ctx.fillText(kpi.value.toFixed(0)+'/100',gcx,gcy+14);
      ctx.fillStyle='#556173';ctx.font='8px sans-serif';
      ctx.fillText('가중치: '+(weights[i]*100).toFixed(0)+'%',gcx,gy+152);
      ctx.textAlign='left';
    }
  }
  drawIntel();
}

// ─── 퀴즈 v25 (15문) ────────────────────────────────────────
var QUIZ25=[
  {q:'포트폴리오 분산투자 분석기에서 효율프론티어에 속하는 카테고리의 특징은?',o:['적은 비용으로 많은 시간을 투자할 수 있음','수강료가 가장 비쌈','인기가 전혀 없음','강사가 한 명뿐임'],c:0},
  {q:'벤치마크 매치업 비교기의 6축에 포함되지 않는 것은?',o:['강사 자격증 수','강좌수','가격경쟁력','수강횟수'],c:0},
  {q:'시퀀스 마이닝에서 아크 두께가 굵을수록 의미하는 것은?',o:['두 카테고리의 동시운영 빈도가 높음','수강료가 높음','강좌 기간이 김','거리가 가까움'],c:0},
  {q:'카테고리 성숙도 라이프사이클의 4단계 순서로 올바른 것은?',o:['도입→성장→성숙→쇠퇴','성숙→도입→쇠퇴→성장','쇠퇴→성장→도입→성숙','성장→쇠퇴→도입→성숙'],c:0},
  {q:'운영 시간대 갭 분석기에서 &quot;공급부족(기회)&quot;은 어떤 색으로 표시되나요?',o:['빨강 계열','파랑 계열','초록 계열','회색 계열'],c:0},
  {q:'가성비 프론티어에서 &quot;추천존&quot;의 조건은?',o:['저가격 + 고수강횟수','고가격 + 저수강횟수','고가격 + 고수강횟수','저가격 + 저수강횟수'],c:0},
  {q:'접근성 인클루전 매트릭스의 6개 지표에 포함되지 않는 것은?',o:['강사 평점','가격','시간대','지역'],c:0},
  {q:'종합 수강 인텔리전스 리포트는 몇 개의 KPI로 구성되나요?',o:['8개','5개','10개','3개'],c:0},
  {q:'클래스101 대비 문화센터 오프라인 강좌의 강점은?',o:['실습 중심 대면 학습 환경','완전 비대면 강의','구독형 무제한 수강','AI 자동 채점'],c:0},
  {q:'탈잉 대비 문화센터의 차별화 포인트로 가장 알맞은 것은?',o:['전국 다수 센터의 오프라인 네트워크','1인 프리랜서 강사 중심 매칭','프로젝트 기반 포트폴리오 심사','시간당 과외형 매칭'],c:0},
  {q:'포트폴리오 분산투자 분석기의 ★ 표시는 무엇을 의미하나요?',o:['최적 분산 투자 포인트','가장 비싼 카테고리','가장 인기 없는 카테고리','신규 개설 카테고리'],c:0},
  {q:'매치업 비교기에서 승패는 무엇으로 결정되나요?',o:['6축 중 더 높은 점수를 얻은 축의 개수','수강생 리뷰 평점','센터 규모','강사 수'],c:0},
  {q:'시간대 갭 분석기의 분석 대상 시간 범위는?',o:['오전 8시~오후 7시(8AM~8PM)','오전 6시~오후 10시','24시간 전체','오후 12시~오후 6시'],c:0},
  {q:'인클루전 매트릭스에서 &quot;기간&quot; 지표는 무엇으로 계산되나요?',o:['수강횟수 구간(단기/중단기/중기/장기)의 다양성','강좌 총 개월 수','강사 경력 기간','센터 운영 연한'],c:0},
  {q:'종합 인텔리전스 리포트의 등급 체계는?',o:['S~D 5단계','A~F 6단계','1~10점','상/중/하 3단계'],c:0}
];

function renderQuiz25(container){
  var qIdx=0,score=0,answered=false;
  function render(){
    if(qIdx>=QUIZ25.length){
      container.innerHTML='<div style="padding:12px;text-align:center"><div style="color:#06B6D4;font-size:14px;font-weight:bold">🎉 v25 퀴즈 완료!</div><div style="color:#d4d4d4;margin-top:8px;font-size:13px">최종 점수: '+score+'/'+QUIZ25.length+'</div></div>';
      if(score>=10)unlockAchieve25('v25_quiz_master');
      if(score>=15)unlockAchieve25('v25_quiz_perfect');
      return;
    }
    var q=QUIZ25[qIdx];answered=false;
    container.innerHTML='<div style="padding:12px"><div style="color:#8ba4c4;font-size:10px;margin-bottom:4px">Q'+(qIdx+1)+'/'+QUIZ25.length+' | 점수: '+score+'</div>'
      +'<div style="color:var(--text-primary);font-size:12px;font-weight:600;margin-bottom:10px">'+q.q+'</div>'
      +'<div id="v25-quiz-opts" style="display:flex;flex-direction:column;gap:6px">'
      +q.o.map(function(o,i){return'<button style="padding:8px 12px;border-radius:6px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text);cursor:pointer;text-align:left;font-size:11px" data-idx="'+i+'">'+esc(o)+'</button>';}).join('')
      +'</div><div id="v25-quiz-result" style="margin-top:8px;font-size:12px"></div></div>';
    container.querySelectorAll('#v25-quiz-opts button').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(answered)return;answered=true;
        var idx=parseInt(btn.getAttribute('data-idx'));
        if(idx===q.c){score++;btn.style.background='rgba(6,182,212,0.2)';btn.style.borderColor='#06B6D4';SFX25.play('correct');}
        else{btn.style.background='rgba(239,68,68,0.2)';btn.style.borderColor='#EF4444';
          container.querySelectorAll('#v25-quiz-opts button')[q.c].style.background='rgba(6,182,212,0.2)';
          container.querySelectorAll('#v25-quiz-opts button')[q.c].style.borderColor='#06B6D4';SFX25.play('wrong');}
        var res=container.querySelector('#v25-quiz-result');
        if(res){
          res.innerHTML='<span style="color:#8ba4c4">현재 점수: '+score+'/'+(qIdx+1)+' &mdash; </span><button id="v25-quiz-next" style="padding:4px 12px;border-radius:4px;border:1px solid #06B6D4;background:rgba(6,182,212,0.1);color:#06B6D4;cursor:pointer;font-size:11px">다음 &#9654;</button>';
          container.querySelector('#v25-quiz-next').addEventListener('click',function(){qIdx++;answered=false;render();SFX25.play('open');});
        }
      });
    });
  }
  render();
}

// ─── UI 빌드 ──────────────────────────────────────────────────
function buildV25UI(){
  var root=document.getElementById('root');if(!root)return;

  var hub=document.createElement('div');hub.id='ccf-v25-hub';
  hub.style.cssText='max-width:700px;margin:16px auto;padding:0 12px';
  hub.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,#0a1628,#0a1e2e);border:1px solid rgba(6,182,212,0.15);border-radius:10px;margin-bottom:10px">'
    +'<div style="color:#06B6D4;font-weight:bold;font-size:14px">🔬 벤치마킹분석허브 v25</div>'
    +'<button id="v25-toggle-all" style="padding:4px 10px;border-radius:4px;border:1px solid rgba(6,182,212,0.3);background:rgba(6,182,212,0.08);color:#06B6D4;cursor:pointer;font-size:11px">전체 열기/닫기</button></div>';

  SECTIONS25.forEach(function(sec){
    var section=document.createElement('div');section.id=sec.id;
    section.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background 0.2s">'
      +'<span style="font-size:16px">'+sec.icon+'</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">'+esc(sec.title)+'</span>'
      +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
      +'<div id="'+sec.id+'-content" style="display:none"></div>';
    section.querySelector('div').addEventListener('click',function(){
      SFX25.play(sec.sfx);
      var content=document.getElementById(sec.id+'-content');
      if(content.style.display==='none'){
        content.style.display='block';
        if(!content.hasChildNodes())sec.render(content);
        unlockAchieve25(sec.achieve);
      }else content.style.display='none';
      checkAllSections25();
    });
    hub.appendChild(section);
  });

  var quizSection=document.createElement('div');quizSection.id='v25-quiz-section';
  quizSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">&#10067;</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v25 퀴즈 (15문)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
    +'<div id="v25-quiz-content" style="display:none"></div>';
  quizSection.querySelector('div').addEventListener('click',function(){
    SFX25.play('open');
    var qc=document.getElementById('v25-quiz-content');
    if(qc.style.display==='none'){qc.style.display='block';if(!qc.hasChildNodes())renderQuiz25(qc);}
    else qc.style.display='none';
  });
  hub.appendChild(quizSection);

  var achSection=document.createElement('div');
  achSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">&#127942;</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v25 업적 ('+ACHIEVEMENTS_V25.length+'종)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
    +'<div id="v25-ach-content" style="display:none"><div id="v25-ach-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;padding:8px"></div></div>';
  achSection.querySelector('div').addEventListener('click',function(){
    SFX25.play('open');
    var ac=document.getElementById('v25-ach-content');
    ac.style.display=ac.style.display==='none'?'block':'none';
  });
  hub.appendChild(achSection);

  function renderAchievements25(){
    var grid=document.getElementById('v25-ach-grid');if(!grid)return;
    var unlocked=getAchieves25();
    grid.innerHTML=ACHIEVEMENTS_V25.map(function(a){
      var done=unlocked.indexOf(a.id)>=0;
      return'<div style="padding:6px 8px;border-radius:6px;border:1px solid '+(done?'#06B6D4':'var(--card-border)')+';background:'+(done?'rgba(6,182,212,0.08)':'var(--card-bg)')+';font-size:10px"><div style="color:'+(done?'#06B6D4':'var(--text-secondary)')+';font-weight:600">'+esc(a.name)+'</div><div style="color:var(--text-muted);font-size:9px;margin-top:2px">'+esc(a.desc)+'</div></div>';
    }).join('');
  }
  renderAchievements25();
  setInterval(renderAchievements25,3000);

  var prevHub=document.getElementById('ccf-v24-hub');
  if(prevHub)prevHub.after(hub);
  else root.appendChild(hub);

  document.getElementById('v25-toggle-all').addEventListener('click',function(){
    SFX25.play('click');
    var allOpen=SECTIONS25.every(function(s){var c=document.getElementById(s.id+'-content');return c&&c.style.display!=='none';});
    SECTIONS25.forEach(function(s){
      var c=document.getElementById(s.id+'-content');
      if(c){
        if(allOpen)c.style.display='none';
        else{c.style.display='block';
          var sec=SECTIONS25.find(function(x){return x.id+'-content'===c.id;});
          if(sec&&!c.hasChildNodes())sec.render(c);
          if(sec)unlockAchieve25(sec.achieve);
        }
      }
    });
    checkAllSections25();
  });

  // ─── 하단 네비게이션 버튼 추가 ─────────────────────────────
  var navInner=document.querySelector('.bottom-nav-inner');
  if(navInner){
    var navLabels=[
      {icon:'📈',label:'포트폴리오',secId:'v25-portfolio'},
      {icon:'⚔️',label:'매치업',secId:'v25-matchup'},
      {icon:'🧬',label:'시퀀스',secId:'v25-sequence'},
      {icon:'🌱',label:'성숙도',secId:'v25-maturity'},
      {icon:'🕳️',label:'시간갭',secId:'v25-gap'},
      {icon:'💎',label:'가성비',secId:'v25-frontier'},
      {icon:'🤝',label:'인클루전',secId:'v25-inclusion'},
      {icon:'🧠',label:'인텔리전스',secId:'v25-intelligence'},
      {icon:'❓',label:'퀴즈25',secId:'v25-quiz-section'}
    ];
    navLabels.forEach(function(nl){
      var btn=document.createElement('button');
      btn.className='bottom-nav-btn';
      btn.setAttribute('aria-label','v25 '+nl.label);
      btn.innerHTML='<span>'+nl.icon+'</span><span style="color:#06B6D4;font-size:8px">'+esc(nl.label)+'</span>';
      btn.addEventListener('click',function(){
        SFX25.play('scroll');
        var target=document.getElementById(nl.secId);
        if(target){target.scrollIntoView({behavior:'smooth',block:'start'});target.querySelector('div').click();}
      });
      navInner.appendChild(btn);
    });
  }
}

// ─── 키보드 단축키 (Shift+Q/W/E/R/T/Y/U/I, Shift+0=퀴즈) ──
document.addEventListener('keydown',function(e){
  if(!e.shiftKey||e.ctrlKey||e.altKey||e.metaKey)return;
  var tag=document.activeElement?document.activeElement.tagName:'';
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;

  if(e.key==='0'||e.key===')'){
    var qt=document.getElementById('v25-quiz-section');
    if(qt){e.preventDefault();qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  var keyMap={'Q':0,'W':1,'E':2,'R':3,'T':4,'Y':5,'U':6,'I':7};
  var upper=e.key.toUpperCase?e.key.toUpperCase():e.key;
  if(keyMap[upper]!==undefined&&keyMap[upper]<SECTIONS25.length){
    e.preventDefault();
    var sec=document.getElementById(SECTIONS25[keyMap[upper]].id);
    if(sec){sec.scrollIntoView({behavior:'smooth',block:'start'});sec.querySelector('div').click();}
  }
});

// ─── roundRect 폴리필 ──────────────────────────────────────────
if(!CanvasRenderingContext2D.prototype.roundRect){
  CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
    if(typeof r==='number')r=[r,r,r,r];
    this.moveTo(x+r[0],y);this.lineTo(x+w-r[1],y);this.quadraticCurveTo(x+w,y,x+w,y+r[1]);
    this.lineTo(x+w,y+h-r[2]);this.quadraticCurveTo(x+w,y+h,x+w-r[2],y+h);
    this.lineTo(x+r[3],y+h);this.quadraticCurveTo(x,y+h,x,y+h-r[3]);
    this.lineTo(x,y+r[0]);this.quadraticCurveTo(x,y,x+r[0],y);
    this.closePath();return this;
  };
}

// ─── 초기화 ────────────────────────────────────────────────────
window.__v25patch={renderQuiz:renderQuiz25};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(buildV25UI,3700);});}
else{setTimeout(buildV25UI,3700);}
})();
