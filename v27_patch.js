/**
 * culture-center-finder v27.0 patch
 * 벤치마크(클래스101/탈잉) 대응 고급 Canvas 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 데이터 없음
 * 강좌수요예측트렌드분석기Canvas+센터운영효율성벤치마크레이더Canvas+수강료세분화가격전략워터폴Canvas+강좌시너지조합추천기Canvas+대상별학습수요갭토네이도Canvas+센터입지경쟁력매트릭스Canvas+요일별카테고리점유율흐름도Canvas+종합수강시장인사이트대시보드Canvas+퀴즈15(330→345)+업적12(282→294)+SFX12종+키보드9종
 */
(function(){
'use strict';
var V27_ID='ccf-v27-patch';
if(document.getElementById(V27_ID))return;
var marker=document.createElement('meta');marker.id=V27_ID;document.head.appendChild(marker);

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
// ─── v27 전용 분류 헬퍼 ──────────────────────────────────────
function classifyTarget(s){
  if(!s)return'미지정';
  if(s.indexOf('성인')>=0)return'성인';
  if(s.indexOf('패밀리')>=0)return'패밀리';
  if(s.indexOf('어린이')>=0||s.indexOf('유아')>=0||/\d세/.test(s))return'유아동';
  return'기타';
}
var BAND_NAMES=['무료','~3만','3~5만','5~10만','10~20만','20만+'];
function getPriceBand(price){
  if(price<=0)return 0;if(price<=30000)return 1;if(price<=50000)return 2;
  if(price<=100000)return 3;if(price<=200000)return 4;return 5;
}
var HIGH_DEMAND_STATUS=['마감임박','대기접수','대기신청','대기등록','추가접수'];
var DAYS_KO=['월','화','수','목','금','토','일'];
function grade5(v){return v>=80?'S':v>=65?'A':v>=50?'B':v>=35?'C':'D';}
function gradeColor(g){return g==='S'?'#FFD700':g==='A'?'#10B981':g==='B'?'#3AAFA9':g==='C'?'#F59E0B':'#EF4444';}

var COLORS=['#F59E0B','#7EC8E3','#10B981','#EF4444','#8B5CF6','#EC4899','#34D399','#F97316','#6366F1','#14B8A6','#E879F9','#84CC16','#FB923C','#38BDF8','#A78BFA'];
var TYPES8=['홈플러스','롯데마트','이마트','백화점','구청','대학','스포츠센터','기타'];
var ACCENT='#F59E0B';

// ─── SFX 엔진 v27 ─────────────────────────────────────────────
var SFX27={
  _ctx:null,
  _get:function(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  play:function(type){
    var c=this._get();if(!c)return;
    var o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);g.gain.value=0.06;
    var t=c.currentTime;
    switch(type){
      case'click':o.frequency.value=640;g.gain.exponentialRampToValueAtTime(0.001,t+0.05);o.start(t);o.stop(t+0.05);break;
      case'open':o.frequency.value=700;o.frequency.linearRampToValueAtTime(940,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'close':o.frequency.value=800;o.frequency.linearRampToValueAtTime(500,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'correct':o.frequency.value=620;o.frequency.linearRampToValueAtTime(880,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'wrong':o.type='sawtooth';o.frequency.value=340;g.gain.value=0.04;g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'achieve':o.frequency.value=600;o.frequency.linearRampToValueAtTime(1000,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'scroll':o.type='triangle';o.frequency.value=560;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);break;
      case'hover':o.frequency.value=780;g.gain.value=0.03;g.gain.exponentialRampToValueAtTime(0.001,t+0.04);o.start(t);o.stop(t+0.04);break;
      case'complete':o.frequency.value=540;o.frequency.linearRampToValueAtTime(760,t+0.1);o.frequency.linearRampToValueAtTime(980,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'expand':o.type='triangle';o.frequency.value=600;o.frequency.linearRampToValueAtTime(820,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'collapse':o.type='triangle';o.frequency.value=750;o.frequency.linearRampToValueAtTime(520,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'milestone':o.frequency.value=540;o.frequency.linearRampToValueAtTime(980,t+0.15);o.frequency.linearRampToValueAtTime(760,t+0.25);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);break;
      default:o.frequency.value=540;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);
    }
  }
};

// ─── 업적 시스템 v27 ──────────────────────────────────────────
var ACHIEVEMENTS_V27=[
  {id:'v27_demand',name:'수요 예측가',desc:'강좌 수요 예측 트렌드 분석기 열기'},
  {id:'v27_efficiency',name:'효율 벤치마커',desc:'센터 운영 효율성 벤치마크 열기'},
  {id:'v27_pricing',name:'가격 전략가 v27',desc:'수강료 세분화 가격 전략 워터폴 열기'},
  {id:'v27_synergy',name:'시너지 큐레이터',desc:'강좌 시너지 조합 추천기 열기'},
  {id:'v27_demandgap',name:'갭 분석가',desc:'대상별 학습 수요 갭 분석기 열기'},
  {id:'v27_location',name:'입지 전략가',desc:'센터 입지 경쟁력 매트릭스 열기'},
  {id:'v27_dailyflow',name:'요일 트래커',desc:'요일별 카테고리 점유율 흐름도 열기'},
  {id:'v27_insight',name:'시장 인사이터',desc:'종합 수강 시장 인사이트 대시보드 열기'},
  {id:'v27_quiz_master',name:'v27 퀴즈 마스터',desc:'v27 퀴즈 10문 이상 정답'},
  {id:'v27_quiz_perfect',name:'v27 퀴즈 만점',desc:'v27 퀴즈 15문 전부 정답'},
  {id:'v27_explorer',name:'v27 탐험가',desc:'v27 5개 이상 섹션 열기'},
  {id:'v27_complete',name:'v27 정복자',desc:'v27 모든 섹션+퀴즈 완료'}
];

function getAchieves27(){return lsGet('ccf_achieves_v27',[]);}
function unlockAchieve27(id){
  var arr=getAchieves27();
  if(arr.indexOf(id)<0){arr.push(id);lsSet('ccf_achieves_v27',arr);SFX27.play('achieve');}
  checkAllSections27();
}
function checkAllSections27(){
  var arr=getAchieves27();
  var sectionAchs=SECTIONS27.map(function(s){return s.achieve;});
  var opened=sectionAchs.filter(function(a){return arr.indexOf(a)>=0;}).length;
  if(opened>=5&&arr.indexOf('v27_explorer')<0)unlockAchieve27('v27_explorer');
  if(opened>=8&&arr.indexOf('v27_quiz_master')>=0&&arr.indexOf('v27_complete')<0)unlockAchieve27('v27_complete');
}

// ─── 섹션 정의 ─────────────────────────────────────────────────
var SECTIONS27=[
  {id:'v27-demand',title:'강좌 수요 예측 트렌드 분석기',icon:'📈',achieve:'v27_demand',sfx:'expand',render:renderDemandTrend},
  {id:'v27-efficiency',title:'센터 운영 효율성 벤치마크',icon:'🏢',achieve:'v27_efficiency',sfx:'expand',render:renderEfficiencyBenchmark},
  {id:'v27-pricing-waterfall',title:'수강료 세분화 가격 전략',icon:'💵',achieve:'v27_pricing',sfx:'expand',render:renderPricingWaterfall},
  {id:'v27-synergy',title:'강좌 시너지 조합 추천기',icon:'🔗',achieve:'v27_synergy',sfx:'expand',render:renderSynergy},
  {id:'v27-demand-gap',title:'대상별 학습 수요 갭 분석기',icon:'👥',achieve:'v27_demandgap',sfx:'expand',render:renderDemandGap},
  {id:'v27-location',title:'센터 입지 경쟁력 매트릭스',icon:'📍',achieve:'v27_location',sfx:'expand',render:renderLocationMatrix},
  {id:'v27-daily-flow',title:'요일별 카테고리 점유율 흐름도',icon:'📊',achieve:'v27_dailyflow',sfx:'expand',render:renderDailyFlow},
  {id:'v27-market-insight',title:'종합 수강 시장 인사이트',icon:'🎯',achieve:'v27_insight',sfx:'milestone',render:renderMarketInsight}
];

// ─── 1. 강좌 수요 예측 트렌드 분석기 ─────────────────────────────
function renderDemandTrend(container){
  var data=getData();
  var catCount={};
  data.forEach(function(d){var c=d[3]||'기타';catCount[c]=(catCount[c]||0)+1;});
  var topCats=Object.entries(catCount).sort(function(a,b){return b[1]-a[1];}).slice(0,6).map(function(e){return e[0];});
  var MONTHS=[8,9,10,11,12];
  var series={};
  topCats.forEach(function(c){series[c]=[0,0,0,0,0];});
  data.forEach(function(d){
    var c=d[3]||'기타';if(topCats.indexOf(c)<0)return;
    var m=parseMonth(d[13]);var mi=MONTHS.indexOf(m);if(mi<0)return;
    series[c][mi]++;
  });
  var maxVal=1;
  topCats.forEach(function(c){series[c].forEach(function(v){if(v>maxVal)maxVal=v;});});

  function forecast(arr){
    var n=arr.length,sx=0,sy=0,sxy=0,sxx=0;
    for(var i=0;i<n;i++){sx+=i;sy+=arr[i];sxy+=i*arr[i];sxx+=i*i;}
    var denom=(n*sxx-sx*sx);if(denom===0)return arr[n-1];
    var slope=(n*sxy-sx*sy)/denom;
    var intercept=(sy-slope*sx)/n;
    return Math.max(0,Math.round(slope*n+intercept));
  }
  var forecasts={};topCats.forEach(function(c){forecasts[c]=forecast(series[c]);});
  var growth={};
  topCats.forEach(function(c){
    var arr=series[c];var fi=-1,li=-1;
    for(var i=0;i<arr.length;i++){if(arr[i]>0){if(fi<0)fi=i;li=i;}}
    growth[c]=(fi<0||fi===li)?0:((arr[li]-arr[fi])/arr[fi])*100;
  });
  var maxAll=maxVal;
  forecasts && topCats.forEach(function(c){if(forecasts[c]>maxAll)maxAll=forecasts[c];});
  function trendGrade(g){return g>=50?'S':g>=15?'A':g>=-15?'B':g>=-40?'C':'D';}

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#080B10;cursor:pointer';
  container.appendChild(canvas);
  var selIdx=0;
  var x0=55,x1=430,y0=300,y1=55;
  function xAt(i){return x0+i*((x1-x0)/5);}
  function yAt(v){return y0-(v/maxAll)*(y0-y1);}

  canvas.addEventListener('click',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    if(mx>=445&&mx<=615&&my>=58){
      var idx=Math.floor((my-58)/27);
      if(idx>=0&&idx<topCats.length){selIdx=idx;SFX27.play('click');drawDT();}
    }
  });

  function drawDT(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#080B10';ctx.fillRect(0,0,620,400);
    ctx.fillStyle=ACCENT;ctx.font='bold 13px sans-serif';
    ctx.fillText('📈 강좌 수요 예측 트렌드 분석기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('카테고리별 월별 강좌 개설 추이(8~12월) | 우측 목록 클릭: 카테고리 선택',10,38);

    // grid
    ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1;
    for(var gy=0;gy<=4;gy++){
      var yy=y1+gy*((y0-y1)/4);
      ctx.beginPath();ctx.moveTo(x0,yy);ctx.lineTo(x1,yy);ctx.stroke();
    }
    ctx.strokeStyle='rgba(255,255,255,0.15)';
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y0);ctx.moveTo(x0,y0);ctx.lineTo(x0,y1);ctx.stroke();

    var labels=['8월','9월','10월','11월','12월','예측'];
    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    labels.forEach(function(l,i){ctx.fillStyle=i===5?ACCENT:'#556173';ctx.fillText(l,xAt(i),y0+16);});
    ctx.textAlign='left';

    topCats.forEach(function(c,ci){
      var isSel=(ci===selIdx);
      var col=COLORS[ci%COLORS.length];
      ctx.strokeStyle=isSel?col:col+'44';
      ctx.lineWidth=isSel?2.5:1;
      ctx.beginPath();
      series[c].forEach(function(v,i){var px=xAt(i),py=yAt(v);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);});
      ctx.stroke();
      // dashed to forecast
      ctx.setLineDash([3,3]);
      ctx.beginPath();ctx.moveTo(xAt(4),yAt(series[c][4]));ctx.lineTo(xAt(5),yAt(forecasts[c]));ctx.stroke();
      ctx.setLineDash([]);
      series[c].forEach(function(v,i){
        ctx.beginPath();ctx.arc(xAt(i),yAt(v),isSel?4:2.5,0,Math.PI*2);
        ctx.fillStyle=isSel?col:col+'88';ctx.fill();
      });
      ctx.beginPath();ctx.arc(xAt(5),yAt(forecasts[c]),isSel?5:3,0,Math.PI*2);
      ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.stroke();
    });

    // legend
    topCats.forEach(function(c,ci){
      var ly=58+ci*27;var isSel=(ci===selIdx);
      ctx.fillStyle=isSel?'rgba(245,158,11,0.1)':'transparent';
      ctx.fillRect(440,ly-14,178,24);
      ctx.fillStyle=COLORS[ci%COLORS.length];ctx.fillRect(445,ly-8,10,10);
      ctx.fillStyle=isSel?'#fff':'#8ba4c4';ctx.font=(isSel?'bold ':'')+'9px sans-serif';
      ctx.fillText(c.substring(0,6),460,ly);
      var g=growth[c];
      ctx.fillStyle=g>=0?'#10B981':'#EF4444';ctx.font='8px sans-serif';
      ctx.fillText((g>=0?'▲':'▼')+Math.abs(g).toFixed(0)+'%',565,ly);
    });

    var sc=topCats[selIdx];
    var g=growth[sc];var tg=trendGrade(g);
    ctx.fillStyle='rgba(245,158,11,0.06)';
    ctx.beginPath();ctx.roundRect(10,340,600,52,6);ctx.fill();
    ctx.strokeStyle='rgba(245,158,11,0.25)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle=gradeColor(tg);ctx.font='bold 16px sans-serif';
    ctx.fillText(tg,20,372);
    ctx.fillStyle=ACCENT;ctx.font='bold 10px sans-serif';
    ctx.fillText(esc(sc)+' 트렌드 등급',45,360);
    ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
    ctx.fillText('8월→12월 증감률 '+(g>=0?'+':'')+g.toFixed(1)+'% | 차월 예측 '+forecasts[sc]+'건 (현재 '+series[sc][4]+'건)',45,375);
    ctx.fillText('전체 상위 6개 카테고리 기준 | 회귀분석 기반 선형 예측치',45,388);
  }
  drawDT();
}

// ─── 2. 센터 운영 효율성 벤치마크 (레이더) ───────────────────────
function renderEfficiencyBenchmark(container){
  var data=getData();
  var perType={};
  TYPES8.forEach(function(t){perType[t]={count:0,cats:{},priceSum:0,priceN:0,hourBucket:{},targets:{},regions:{}};});
  data.forEach(function(d){
    var t=getCenterType(d);var p=perType[t];
    p.count++;
    p.cats[d[3]||'기타']=1;
    var price=parsePrice(d[8]);if(price>0){p.priceSum+=price;p.priceN++;}
    var h=parseHour(d[7]);if(h>=0){var slot=Math.floor(h/2)*2;p.hourBucket[slot]=(p.hourBucket[slot]||0)+1;}
    p.targets[classifyTarget(d[5])]=1;
    p.regions[getRegion(d[1]||'')]=1;
  });
  var maxCount=1,maxCat=1;
  TYPES8.forEach(function(t){if(perType[t].count>maxCount)maxCount=perType[t].count;if(Object.keys(perType[t].cats).length>maxCat)maxCat=Object.keys(perType[t].cats).length;});
  var avgPrices=TYPES8.map(function(t){var p=perType[t];return p.priceN>0?p.priceSum/p.priceN:0;});
  var maxAvgP=Math.max.apply(null,avgPrices.filter(function(v){return v>0;}).concat([1]));
  var minAvgP=Math.min.apply(null,avgPrices.filter(function(v){return v>0;}).concat([maxAvgP]));

  var metrics={};
  TYPES8.forEach(function(t,ti){
    var p=perType[t];
    var courseScore=p.count>0?(p.count/maxCount)*100:0;
    var catScore=p.count>0?(Object.keys(p.cats).length/maxCat)*100:0;
    var avgP=avgPrices[ti];
    var priceScore=avgP>0&&maxAvgP>minAvgP?((maxAvgP-avgP)/(maxAvgP-minAvgP))*100:(avgP>0?50:0);
    var hKeys=Object.keys(p.hourBucket);var hTotal=0;hKeys.forEach(function(k){hTotal+=p.hourBucket[k];});
    var ent=0;hKeys.forEach(function(k){var pr=p.hourBucket[k]/(hTotal||1);ent+=-pr*Math.log(pr+1e-12)/Math.LN2;});
    var maxEnt=Math.log(12)/Math.LN2;
    var timeScore=hTotal>0?Math.min(100,(ent/maxEnt)*100):0;
    var targetScore=Math.min(100,(Object.keys(p.targets).length/4)*100);
    var regionScore=Math.min(100,(Object.keys(p.regions).length/9)*100);
    metrics[t]={course:courseScore,cat:catScore,price:priceScore,time:timeScore,target:targetScore,region:regionScore,count:p.count,avgPrice:avgP};
  });
  var AXES=['강좌수','카테고리다양성','가격경쟁력','시간대활용','대상다양성','지역커버'];
  var AXKEYS=['course','cat','price','time','target','region'];

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#080B10;cursor:pointer';
  container.appendChild(canvas);
  var selType=TYPES8[1];
  var cx=225,cy=175,R=115;
  function ptFor(axIdx,val){
    var ang=-Math.PI/2+axIdx*(Math.PI*2/6);
    var r=(val/100)*R;
    return{x:cx+Math.cos(ang)*r,y:cy+Math.sin(ang)*r};
  }

  canvas.addEventListener('click',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    if(mx>=460&&mx<=610&&my>=55){
      var idx=Math.floor((my-55)/34);
      if(idx>=0&&idx<TYPES8.length){selType=TYPES8[idx];SFX27.play('click');drawEB();}
    }
  });

  function drawEB(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#080B10';ctx.fillRect(0,0,620,400);
    ctx.fillStyle=ACCENT;ctx.font='bold 13px sans-serif';
    ctx.fillText('🏢 센터 운영 효율성 벤치마크',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('8센터유형×6축 레이더 | 우측 목록 클릭: 유형 선택',10,38);

    // grid rings
    ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
    [0.25,0.5,0.75,1].forEach(function(f){
      ctx.beginPath();
      for(var i=0;i<=6;i++){var p=ptFor(i%6,f*100);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
      ctx.stroke();
    });
    AXES.forEach(function(a,i){
      var p=ptFor(i,100);
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p.x,p.y);ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.stroke();
      var lp=ptFor(i,118);
      ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText(a,lp.x,lp.y);
      ctx.textAlign='left';
    });

    // average reference polygon (dashed)
    var avgVals=AXKEYS.map(function(k){var s=0,n=0;TYPES8.forEach(function(t){if(metrics[t].count>0){s+=metrics[t][k];n++;}});return n>0?s/n:0;});
    ctx.setLineDash([3,3]);ctx.strokeStyle='rgba(255,255,255,0.35)';ctx.lineWidth=1;
    ctx.beginPath();
    avgVals.forEach(function(v,i){var p=ptFor(i,v);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});
    ctx.closePath();ctx.stroke();ctx.setLineDash([]);

    // faint polygons for non-selected
    TYPES8.forEach(function(t){
      if(t===selType)return;
      var m=metrics[t];if(m.count<=0)return;
      ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
      ctx.beginPath();
      AXKEYS.forEach(function(k,i){var p=ptFor(i,m[k]);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});
      ctx.closePath();ctx.stroke();
    });
    // selected polygon
    var sm=metrics[selType];
    var selIdx=TYPES8.indexOf(selType);
    var selColor=COLORS[selIdx%COLORS.length];
    ctx.fillStyle=selColor+'33';ctx.strokeStyle=selColor;ctx.lineWidth=2;
    ctx.beginPath();
    AXKEYS.forEach(function(k,i){var p=ptFor(i,sm[k]);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});
    ctx.closePath();ctx.fill();ctx.stroke();
    AXKEYS.forEach(function(k,i){var p=ptFor(i,sm[k]);ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle=selColor;ctx.fill();});

    // legend
    TYPES8.forEach(function(t,i){
      var ly=55+i*34;var isSel=(t===selType);
      ctx.fillStyle=isSel?'rgba(245,158,11,0.1)':'transparent';
      ctx.fillRect(455,ly-2,160,30);
      ctx.fillStyle=COLORS[i%COLORS.length];ctx.fillRect(460,ly+4,10,10);
      ctx.fillStyle=isSel?'#fff':'#8ba4c4';ctx.font=(isSel?'bold ':'')+'9px sans-serif';
      ctx.fillText(t,475,ly+13);
      ctx.fillStyle='#556173';ctx.font='8px sans-serif';
      ctx.fillText(metrics[t].count+'개 강좌',475,ly+24);
    });

    var overall=AXKEYS.reduce(function(s,k){return s+sm[k];},0)/6;
    var og=grade5(overall);
    ctx.fillStyle='rgba(245,158,11,0.06)';
    ctx.beginPath();ctx.roundRect(10,345,430,48,6);ctx.fill();
    ctx.strokeStyle='rgba(245,158,11,0.25)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle=gradeColor(og);ctx.font='bold 16px sans-serif';
    ctx.fillText(og,20,375);
    ctx.fillStyle=ACCENT;ctx.font='bold 10px sans-serif';
    ctx.fillText(esc(selType)+' 종합 운영효율',45,362);
    ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
    ctx.fillText('평균점수 '+overall.toFixed(1)+'/100 | 강좌 '+sm.count+'개 | 평균가 '+(sm.avgPrice>0?Math.round(sm.avgPrice).toLocaleString()+'원':'-'),45,375);
    ctx.fillText('점선=8유형 평균 대비',45,388);
  }
  drawEB();
}

// ─── 3. 수강료 세분화 가격 전략 워터폴 ────────────────────────────
function renderPricingWaterfall(container){
  var data=getData();
  var catCount={};
  data.forEach(function(d){var c=d[3]||'기타';catCount[c]=(catCount[c]||0)+1;});
  var topCats=Object.entries(catCount).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});
  var options=['전체'].concat(topCats);
  var bandsByOpt={};
  options.forEach(function(o){bandsByOpt[o]=[0,0,0,0,0,0];});
  var priceSumByOpt={},priceNByOpt={};
  options.forEach(function(o){priceSumByOpt[o]=0;priceNByOpt[o]=0;});
  data.forEach(function(d){
    var c=d[3]||'기타';
    var price=parsePrice(d[8]);
    var b=getPriceBand(price);
    bandsByOpt['전체'][b]++;
    if(price>0){priceSumByOpt['전체']+=price;priceNByOpt['전체']++;}
    if(topCats.indexOf(c)>=0){
      bandsByOpt[c][b]++;
      if(price>0){priceSumByOpt[c]+=price;priceNByOpt[c]++;}
    }
  });

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#080B10;cursor:pointer';
  container.appendChild(canvas);
  var selOpt='전체';
  var bandColors=['#556173','#10B981','#34D399','#F59E0B','#F97316','#EF4444'];

  canvas.addEventListener('click',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    if(mx>=520&&mx<=635&&my>=58){
      var idx=Math.floor((my-58)/26);
      if(idx>=0&&idx<options.length){selOpt=options[idx];SFX27.play('click');drawWF();}
    }
  });

  function drawWF(){
    var arr=bandsByOpt[selOpt];
    var total=arr.reduce(function(s,v){return s+v;},0)||1;
    var maxCum=total;
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#080B10';ctx.fillRect(0,0,640,400);
    ctx.fillStyle=ACCENT;ctx.font='bold 13px sans-serif';
    ctx.fillText('💵 수강료 세분화 가격 전략 워터폴',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('가격구간 누적 워터폴 | 우측 목록 클릭: 카테고리 선택 | 현재: ',10,38);
    ctx.fillStyle=ACCENT;ctx.font='bold 10px sans-serif';
    ctx.fillText(selOpt,222,38);

    var x0=40,barW=54,gap=8,y0=300,scaleH=210;
    var cum=0;
    var barTops=[];
    for(var i=0;i<6;i++){
      var val=arr[i];
      var x=x0+i*(barW+gap);
      var yTop=y0-((cum+val)/maxCum)*scaleH;
      var yBot=y0-(cum/maxCum)*scaleH;
      ctx.fillStyle=bandColors[i];ctx.globalAlpha=0.8;
      ctx.beginPath();ctx.roundRect(x,yTop,barW,Math.max(1,yBot-yTop),3);ctx.fill();ctx.globalAlpha=1;
      ctx.fillStyle='#d4d4d4';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
      ctx.fillText(val,x+barW/2,yTop-6);
      ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';
      ctx.fillText(BAND_NAMES[i],x+barW/2,y0+14);
      ctx.textAlign='left';
      barTops.push({x:x,yTop:yTop,yBot:yBot,barW:barW});
      if(i<5){
        var nx=x0+(i+1)*(barW+gap);
        ctx.setLineDash([2,2]);ctx.strokeStyle='rgba(255,255,255,0.25)';
        ctx.beginPath();ctx.moveTo(x+barW,yTop);ctx.lineTo(nx,yTop);ctx.stroke();
        ctx.setLineDash([]);
      }
      cum+=val;
    }
    // total grounded bar
    var tx=x0+6*(barW+gap);
    var th=(total/maxCum)*scaleH;
    ctx.fillStyle=ACCENT;ctx.globalAlpha=0.85;
    ctx.beginPath();ctx.roundRect(tx,y0-th,barW,th,3);ctx.fill();ctx.globalAlpha=1;
    ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
    ctx.fillText(total,tx+barW/2,y0-th-6);
    ctx.fillStyle=ACCENT;ctx.font='bold 8px sans-serif';
    ctx.fillText('합계',tx+barW/2,y0+14);
    ctx.textAlign='left';

    // legend list
    options.forEach(function(o,i){
      var ly=58+i*26;var isSel=(o===selOpt);
      ctx.fillStyle=isSel?'rgba(245,158,11,0.1)':'transparent';
      ctx.fillRect(516,ly-14,120,22);
      ctx.fillStyle=isSel?ACCENT:'#8ba4c4';ctx.font=(isSel?'bold ':'')+'9px sans-serif';
      ctx.fillText(o.substring(0,7),522,ly);
    });

    var avgP=priceNByOpt[selOpt]>0?priceSumByOpt[selOpt]/priceNByOpt[selOpt]:0;
    var maxBandIdx=0,maxBandVal=-1;
    arr.forEach(function(v,i){if(v>maxBandVal){maxBandVal=v;maxBandIdx=i;}});
    ctx.fillStyle='rgba(245,158,11,0.06)';
    ctx.beginPath();ctx.roundRect(10,345,500,48,6);ctx.fill();
    ctx.strokeStyle='rgba(245,158,11,0.25)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle=ACCENT;ctx.font='bold 10px sans-serif';
    ctx.fillText(esc(selOpt)+' 가격 분포',20,362);
    ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
    ctx.fillText('평균가 '+Math.round(avgP).toLocaleString()+'원 | 최다구간: '+BAND_NAMES[maxBandIdx]+' ('+maxBandVal+'건, '+(total>0?(maxBandVal/total*100).toFixed(1):0)+'%)',20,375);
    ctx.fillText('총 '+total+'건 | 가격 유효데이터 '+priceNByOpt[selOpt]+'건',20,388);
  }
  drawWF();
}

// ─── 4. 강좌 시너지 조합 추천기 ──────────────────────────────────
function renderSynergy(container){
  var data=getData();
  var centerCats={};
  data.forEach(function(d){
    var center=d[1]||'';if(!center)return;
    var cat=d[3]||'기타';
    if(!centerCats[center])centerCats[center]={};
    centerCats[center][cat]=1;
  });
  var catCenterCount={};
  Object.values(centerCats).forEach(function(cats){
    Object.keys(cats).forEach(function(c){catCenterCount[c]=(catCenterCount[c]||0)+1;});
  });
  var topCats=Object.entries(catCenterCount).sort(function(a,b){return b[1]-a[1];}).slice(0,12).map(function(e){return e[0];});
  var pairCount={};
  Object.values(centerCats).forEach(function(cats){
    var arr=Object.keys(cats).filter(function(c){return topCats.indexOf(c)>=0;});
    for(var i=0;i<arr.length;i++){
      for(var j=i+1;j<arr.length;j++){
        var key=arr[i]<arr[j]?arr[i]+'|'+arr[j]:arr[j]+'|'+arr[i];
        pairCount[key]=(pairCount[key]||0)+1;
      }
    }
  });
  var edges=[];
  for(var i=0;i<topCats.length;i++){
    for(var j=i+1;j<topCats.length;j++){
      var key=topCats[i]+'|'+topCats[j];
      var w=pairCount[key]||0;
      if(w>=8){
        var score=w/Math.min(catCenterCount[topCats[i]],catCenterCount[topCats[j]])*100;
        edges.push({s:i,t:j,w:w,score:score});
      }
    }
  }
  var maxW=1;edges.forEach(function(e){if(e.w>maxW)maxW=e.w;});
  var maxFreq=topCats.length?Math.max.apply(null,topCats.map(function(c){return catCenterCount[c];})):1;

  var nodes=topCats.map(function(c,i){
    var angle=(i/topCats.length)*Math.PI*2-Math.PI/2;
    var r=140;
    return{cat:c,freq:catCenterCount[c],x:225+Math.cos(angle)*r,y:190+Math.sin(angle)*r};
  });
  var recs=edges.slice().sort(function(a,b){return b.score-a.score;}).filter(function(e){return e.w>=10;}).slice(0,5);

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#080B10';
  container.appendChild(canvas);
  var hoverIdx=-1;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverIdx=-1;
    for(var i=0;i<nodes.length;i++){
      if(Math.abs(mx-nodes[i].x)<14&&Math.abs(my-nodes[i].y)<14){hoverIdx=i;break;}
    }
    drawSY();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawSY();});

  function drawSY(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#080B10';ctx.fillRect(0,0,620,400);
    ctx.fillStyle=ACCENT;ctx.font='bold 13px sans-serif';
    ctx.fillText('🔗 강좌 시너지 조합 추천기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('센터 동시운영 카테고리 네트워크 | 노드=카테고리(TOP12) | 간선=결합률',10,38);

    edges.forEach(function(e){
      var n1=nodes[e.s],n2=nodes[e.t];
      var isHov=(hoverIdx===e.s||hoverIdx===e.t);
      ctx.beginPath();ctx.moveTo(n1.x,n1.y);ctx.lineTo(n2.x,n2.y);
      ctx.strokeStyle=isHov?'rgba(245,158,11,0.75)':'rgba(126,200,227,'+(0.08+(e.w/maxW)*0.35)+')';
      ctx.lineWidth=isHov?2+e.w/maxW*3:0.5+e.w/maxW*2.5;
      ctx.stroke();
    });

    nodes.forEach(function(n,i){
      var isHov=(i===hoverIdx);
      var r=4+Math.min(10,(n.freq/maxFreq)*10);
      ctx.beginPath();ctx.arc(n.x,n.y,isHov?r+3:r,0,Math.PI*2);
      ctx.fillStyle=COLORS[i%COLORS.length];ctx.globalAlpha=isHov?1:0.75;ctx.fill();ctx.globalAlpha=1;
      if(isHov){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();}
      ctx.fillStyle=isHov?'#fff':'#8ba4c4';ctx.font=(isHov?'bold 10px':'9px')+' sans-serif';ctx.textAlign='center';
      ctx.fillText(n.cat.substring(0,5),n.x,n.y-r-5);ctx.textAlign='left';
    });

    // recommendation panel
    ctx.fillStyle='rgba(245,158,11,0.06)';
    ctx.beginPath();ctx.roundRect(10,340,600,54,6);ctx.fill();
    ctx.strokeStyle='rgba(245,158,11,0.25)';ctx.lineWidth=1;ctx.stroke();

    if(hoverIdx>=0){
      var hn=nodes[hoverIdx];
      var conns=edges.filter(function(e){return e.s===hoverIdx||e.t===hoverIdx;}).sort(function(a,b){return b.score-a.score;}).slice(0,3);
      ctx.fillStyle=ACCENT;ctx.font='bold 10px sans-serif';
      ctx.fillText('&quot;'+esc(hn.cat)+'&quot; 추천 조합 TOP'+conns.length,20,357);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      var txt=conns.map(function(c){var other=topCats[c.s===hoverIdx?c.t:c.s];return other.substring(0,5)+'('+c.score.toFixed(0)+'%)';}).join(' | ');
      ctx.fillText(txt||'추천 조합 데이터 부족',20,373);
      ctx.fillText('운영센터 '+hn.freq+'곳',20,388);
    }else{
      ctx.fillStyle=ACCENT;ctx.font='bold 10px sans-serif';
      ctx.fillText('전체 TOP5 추천 시너지 조합 (결합률 기준)',20,357);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      var txt2=recs.map(function(e){return topCats[e.s].substring(0,4)+'+'+topCats[e.t].substring(0,4)+'('+e.score.toFixed(0)+'%)';}).join(' | ');
      ctx.fillText(txt2||'데이터 부족',20,373);
      ctx.fillText('노드에 마우스를 올려 개별 카테고리 추천을 확인하세요',20,388);
    }
  }
  drawSY();
}

// ─── 5. 대상별 학습 수요 갭 분석기 (토네이도) ─────────────────────
function renderDemandGap(container){
  var data=getData();
  var GROUPS=['성인','유아동','미지정','패밀리'];
  var stats={};
  GROUPS.forEach(function(g){stats[g]={count:0,high:0};});
  var total=0;
  data.forEach(function(d){
    var g=classifyTarget(d[5]);
    if(GROUPS.indexOf(g)<0)return;
    stats[g].count++;total++;
    if(HIGH_DEMAND_STATUS.indexOf(d[10])>=0)stats[g].high++;
  });
  var avgHigh=0,cnt=0;
  GROUPS.forEach(function(g){if(stats[g].count>0){avgHigh+=stats[g].high/stats[g].count*100;cnt++;}});
  avgHigh=cnt>0?avgHigh/cnt:0;

  var rows=GROUPS.map(function(g){
    var s=stats[g];
    var share=total>0?(s.count/total)*100:0;
    var highRatio=s.count>0?(s.high/s.count)*100:0;
    var gap=highRatio-avgHigh;
    return{name:g,share:share,highRatio:highRatio,gap:gap,count:s.count};
  }).sort(function(a,b){return Math.abs(b.gap)-Math.abs(a.gap);});
  var maxShare=Math.max.apply(null,rows.map(function(r){return r.share;}).concat([1]));
  var maxHigh=Math.max.apply(null,rows.map(function(r){return r.highRatio;}).concat([1]));
  var maxBar=Math.max(maxShare,maxHigh);

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#080B10;cursor:pointer';
  container.appendChild(canvas);
  var selIdx=0;
  var cx=310,rowH=52,startY=70,barMaxW=210;

  canvas.addEventListener('click',function(ev){
    var rect=canvas.getBoundingClientRect();
    var my=(ev.clientY-rect.top)*(400/rect.height);
    var idx=Math.floor((my-startY+18)/rowH);
    if(idx>=0&&idx<rows.length){selIdx=idx;SFX27.play('click');drawDG();}
  });

  function gapLabel(gap){return gap>3?'공급부족':gap<-3?'공급과잉':'균형';}
  function gapColor(gap){return gap>3?'#EF4444':gap<-3?'#7EC8E3':'#10B981';}

  function drawDG(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#080B10';ctx.fillRect(0,0,620,400);
    ctx.fillStyle=ACCENT;ctx.font='bold 13px sans-serif';
    ctx.fillText('👥 대상별 학습 수요 갭 분석기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('좌:공급비중(%) 우:대기·마감비율(%) | 클릭: 대상 선택',10,38);

    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(cx,50);ctx.lineTo(cx,50+rows.length*rowH+10);ctx.stroke();
    ctx.fillStyle='#7EC8E3';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('← 공급 비중',cx-100,55);
    ctx.fillStyle='#F97316';ctx.fillText('수요 압력(대기·마감) →',cx+110,55);
    ctx.textAlign='left';

    rows.forEach(function(r,i){
      var y=startY+i*rowH;var isSel=(i===selIdx);
      var sw=(r.share/maxBar)*barMaxW;
      var hw=(r.highRatio/maxBar)*barMaxW;
      ctx.fillStyle=isSel?'rgba(126,200,227,0.9)':'rgba(126,200,227,0.55)';
      ctx.beginPath();ctx.roundRect(cx-sw,y-2,sw,20,[4,0,0,4]);ctx.fill();
      ctx.fillStyle=isSel?'rgba(249,115,22,0.9)':'rgba(249,115,22,0.55)';
      ctx.beginPath();ctx.roundRect(cx,y-2,hw,20,[0,4,4,0]);ctx.fill();

      ctx.fillStyle=isSel?'#fff':'#d4d4d4';ctx.font=(isSel?'bold ':'')+'10px sans-serif';ctx.textAlign='center';
      ctx.fillText(r.name,cx,y+34);
      ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';
      ctx.fillText(r.share.toFixed(1)+'%',cx-sw-18,y+12);
      ctx.fillText(r.highRatio.toFixed(1)+'%',cx+hw+18,y+12);
      var gc=gapColor(r.gap);
      ctx.fillStyle=gc;ctx.font='bold 8px sans-serif';
      ctx.fillText((r.gap>=0?'+':'')+r.gap.toFixed(1)+'p',cx,y+45);
      ctx.textAlign='left';
      if(isSel){ctx.strokeStyle=ACCENT;ctx.lineWidth=1.5;ctx.strokeRect(cx-sw-30,y-6,sw+hw+60,28);}
    });

    var sel=rows[selIdx];
    var lbl=gapLabel(sel.gap);
    ctx.fillStyle='rgba(245,158,11,0.06)';
    ctx.beginPath();ctx.roundRect(10,320,600,72,6);ctx.fill();
    ctx.strokeStyle='rgba(245,158,11,0.25)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle=gapColor(sel.gap);ctx.font='bold 13px sans-serif';
    ctx.fillText(lbl,20,342);
    ctx.fillStyle=ACCENT;ctx.font='bold 10px sans-serif';
    ctx.fillText(esc(sel.name)+' 대상 학습 수요 갭 분석',80,342);
    ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
    ctx.fillText('강좌 공급 '+sel.count+'건 (전체의 '+sel.share.toFixed(1)+'%) | 대기·마감 비율 '+sel.highRatio.toFixed(1)+'% (평균 '+avgHigh.toFixed(1)+'%)',20,358);
    ctx.fillText('갭 점수 '+(sel.gap>=0?'+':'')+sel.gap.toFixed(1)+'p — '+(sel.gap>3?'공급 대비 수요 압력이 높아 강좌 확대가 필요합니다':sel.gap<-3?'공급이 수요보다 많아 포화 상태입니다':'공급과 수요가 균형을 이루고 있습니다'),20,374);
    ctx.fillText('※ 수요압력 = (마감임박+대기접수+대기신청+대기등록+추가접수) 상태 비율',20,388);
  }
  drawDG();
}

// ─── 6. 센터 입지 경쟁력 매트릭스 ────────────────────────────────
function renderLocationMatrix(container){
  var data=getData();
  var allRegions={};
  data.forEach(function(d){var r=getRegion(d[1]||'');allRegions[r]=(allRegions[r]||0)+1;});
  var topRegions=Object.entries(allRegions).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});
  var total=data.length||1;

  var matrix={};var rowTotal={};var colTotal={};
  topRegions.forEach(function(r){matrix[r]={};TYPES8.forEach(function(t){matrix[r][t]=0;});rowTotal[r]=0;});
  TYPES8.forEach(function(t){colTotal[t]=0;});
  data.forEach(function(d){
    var r=getRegion(d[1]||'');if(topRegions.indexOf(r)<0)return;
    var t=getCenterType(d);
    matrix[r][t]++;rowTotal[r]++;colTotal[t]++;
  });

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#080B10;cursor:pointer';
  container.appendChild(canvas);
  var hoverR=-1,hoverC=-1;
  var cellW=64,cellH=32,startX=80,startY=65;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverR=-1;hoverC=-1;
    if(mx>=startX&&my>=startY){
      var c=Math.floor((mx-startX)/cellW);
      var r=Math.floor((my-startY)/cellH);
      if(r>=0&&r<topRegions.length&&c>=0&&c<TYPES8.length){hoverR=r;hoverC=c;}
    }
    drawLM();
  });
  canvas.addEventListener('mouseleave',function(){hoverR=-1;hoverC=-1;drawLM();});

  function drawLM(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#080B10';ctx.fillRect(0,0,640,400);
    ctx.fillStyle=ACCENT;ctx.font='bold 13px sans-serif';
    ctx.fillText('📍 센터 입지 경쟁력 매트릭스',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('지역×센터유형 강좌밀도 | 색상=경쟁지수(LQ) | 숫자=강좌 수',10,38);

    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';ctx.textAlign='center';
    TYPES8.forEach(function(t,ci){
      ctx.fillStyle=(ci===hoverC)?ACCENT:'#8ba4c4';
      ctx.fillText(t.substring(0,5),startX+ci*cellW+cellW/2,startY-8);
    });
    ctx.textAlign='right';
    topRegions.forEach(function(r,ri){
      ctx.fillStyle=(ri===hoverR)?ACCENT:'#8ba4c4';ctx.font='9px sans-serif';
      ctx.fillText(r,startX-8,startY+ri*cellH+cellH/2+3);
    });
    ctx.textAlign='left';

    topRegions.forEach(function(r,ri){
      TYPES8.forEach(function(t,ci){
        var v=matrix[r][t];
        var expected=(rowTotal[r]*colTotal[t])/total;
        var lq=expected>0?v/expected:0;
        var isHov=(ri===hoverR&&ci===hoverC);
        var color;
        if(v===0)color='rgba(255,255,255,0.02)';
        else if(lq>=1.5)color='rgba(16,185,129,'+(0.25+Math.min(0.6,(lq-1)*0.25))+')';
        else if(lq>=0.5)color='rgba(126,200,227,'+(0.1+lq*0.15)+')';
        else color='rgba(239,68,68,'+(0.15+Math.min(0.5,(1-lq*2)*0.35))+')';
        ctx.fillStyle=isHov?'rgba(245,158,11,0.35)':color;
        ctx.beginPath();ctx.roundRect(startX+ci*cellW+1,startY+ri*cellH+1,cellW-2,cellH-2,3);ctx.fill();
        if(v>0){
          ctx.fillStyle=lq>=1.5?'#fff':lq>=0.5?'#cfe':'#f99';
          ctx.font='bold 9px sans-serif';ctx.textAlign='center';
          ctx.fillText(v,startX+ci*cellW+cellW/2,startY+ri*cellH+cellH/2+3);
          ctx.textAlign='left';
        }
      });
    });

    if(hoverR>=0&&hoverC>=0){
      var r=topRegions[hoverR],t=TYPES8[hoverC];
      var v=matrix[r][t];
      var expected=(rowTotal[r]*colTotal[t])/total;
      var lq=expected>0?v/expected:0;
      var lbl=v===0?'공백 시장':lq>=1.5?'경쟁우위 시장':lq>=0.5?'보통':'약세 시장';
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(140,340,360,50,6);ctx.fill();
      ctx.fillStyle=ACCENT;ctx.font='bold 10px sans-serif';
      ctx.fillText(r+' · '+esc(t)+' — '+lbl,150,356);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText('강좌 '+v+'개 | 경쟁지수(LQ) '+lq.toFixed(2)+' | 지역 총 '+rowTotal[r]+'개',150,370);
      ctx.fillText('유형 전국 '+colTotal[t]+'개 | 기대값 '+expected.toFixed(1)+'개',150,384);
    }else{
      ctx.fillStyle='#556173';ctx.font='9px sans-serif';
      ctx.fillText('셀에 마우스를 올려 지역×유형별 경쟁 지수를 확인하세요',150,362);
    }
  }
  drawLM();
}

// ─── 7. 요일별 카테고리 점유율 흐름도 ────────────────────────────
function renderDailyFlow(container){
  var data=getData();
  var catCount={};
  data.forEach(function(d){var c=d[3]||'기타';catCount[c]=(catCount[c]||0)+1;});
  var topCats=Object.entries(catCount).sort(function(a,b){return b[1]-a[1];}).slice(0,6).map(function(e){return e[0];});
  var LAYERS=topCats.concat(['그외']);
  var matrix={};
  DAYS_KO.forEach(function(day){matrix[day]={};LAYERS.forEach(function(l){matrix[day][l]=0;});});
  data.forEach(function(d){
    var c=d[3]||'기타';
    var days=parseDays(d[6]);
    days.forEach(function(day){
      if(DAYS_KO.indexOf(day)<0)return;
      var layer=topCats.indexOf(c)>=0?c:'그외';
      matrix[day][layer]++;
    });
  });
  var dayTotals={};
  DAYS_KO.forEach(function(day){var s=0;LAYERS.forEach(function(l){s+=matrix[day][l];});dayTotals[day]=s||1;});

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#080B10;cursor:pointer';
  container.appendChild(canvas);
  var focusLayer=-1;
  var x0=55,x1=470,y0=300,y1=55;

  canvas.addEventListener('click',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    if(mx>=480&&mx<=615&&my>=58){
      var idx=Math.floor((my-58)/27);
      if(idx>=0&&idx<LAYERS.length){focusLayer=(focusLayer===idx)?-1:idx;SFX27.play('click');drawDF();}
    }
  });

  function drawDF(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#080B10';ctx.fillRect(0,0,620,400);
    ctx.fillStyle=ACCENT;ctx.font='bold 13px sans-serif';
    ctx.fillText('📊 요일별 카테고리 점유율 흐름도',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('7요일×TOP6 카테고리 100% 누적 영역차트 | 우측 목록 클릭: 강조',10,38);

    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y0);ctx.moveTo(x0,y0);ctx.lineTo(x0,y1);ctx.stroke();
    DAYS_KO.forEach(function(day,i){
      var xx=x0+i*((x1-x0)/6);
      ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText(day,xx,y0+15);
      ctx.textAlign='left';
    });

    // build cumulative percentage per day per layer
    var polys=LAYERS.map(function(){return[];});
    DAYS_KO.forEach(function(day,di){
      var xx=x0+di*((x1-x0)/6);
      var cum=0;
      LAYERS.forEach(function(l,li){
        var pct=matrix[day][l]/dayTotals[day]*100;
        var yBot=y0-(cum/100)*(y0-y1);
        cum+=pct;
        var yTop=y0-(cum/100)*(y0-y1);
        polys[li].push({x:xx,yTop:yTop,yBot:yBot,pct:pct});
      });
    });

    LAYERS.forEach(function(l,li){
      var isFocus=(focusLayer===li);
      var dim=(focusLayer>=0&&!isFocus);
      var col=li===LAYERS.length-1?'#556173':COLORS[li%COLORS.length];
      ctx.beginPath();
      polys[li].forEach(function(p,i){if(i===0)ctx.moveTo(p.x,p.yTop);else ctx.lineTo(p.x,p.yTop);});
      for(var i=polys[li].length-1;i>=0;i--)ctx.lineTo(polys[li][i].x,polys[li][i].yBot);
      ctx.closePath();
      ctx.fillStyle=col;ctx.globalAlpha=dim?0.12:(isFocus?0.85:0.55);ctx.fill();ctx.globalAlpha=1;
      if(isFocus){ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.stroke();}
    });

    // legend
    LAYERS.forEach(function(l,i){
      var ly=58+i*27;var isFocus=(i===focusLayer);
      var col=i===LAYERS.length-1?'#556173':COLORS[i%COLORS.length];
      ctx.fillStyle=isFocus?'rgba(245,158,11,0.1)':'transparent';
      ctx.fillRect(475,ly-14,140,24);
      ctx.fillStyle=col;ctx.fillRect(480,ly-8,10,10);
      ctx.fillStyle=isFocus?'#fff':'#8ba4c4';ctx.font=(isFocus?'bold ':'')+'9px sans-serif';
      ctx.fillText(l.substring(0,6),495,ly);
    });

    var showLayer=focusLayer>=0?focusLayer:0;
    var lname=LAYERS[showLayer];
    var vals=DAYS_KO.map(function(day){return matrix[day][lname]/dayTotals[day]*100;});
    var maxDay=DAYS_KO[vals.indexOf(Math.max.apply(null,vals))];
    var minDay=DAYS_KO[vals.indexOf(Math.min.apply(null,vals))];
    ctx.fillStyle='rgba(245,158,11,0.06)';
    ctx.beginPath();ctx.roundRect(10,345,600,48,6);ctx.fill();
    ctx.strokeStyle='rgba(245,158,11,0.25)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle=ACCENT;ctx.font='bold 10px sans-serif';
    ctx.fillText(esc(lname)+' 요일별 점유율 흐름',20,362);
    ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
    ctx.fillText('최고 점유 요일: '+maxDay+'요일('+Math.max.apply(null,vals).toFixed(1)+'%) | 최저: '+minDay+'요일('+Math.min.apply(null,vals).toFixed(1)+'%)',20,376);
    ctx.fillText('범례를 클릭하면 해당 카테고리 흐름이 강조됩니다',20,388);
  }
  drawDF();
}

// ─── 8. 종합 수강 시장 인사이트 대시보드 ─────────────────────────
function renderMarketInsight(container){
  var data=getData();
  var total=data.length||1;

  // KPI1: 시장성장세
  var catCount={};
  data.forEach(function(d){var c=d[3]||'기타';catCount[c]=(catCount[c]||0)+1;});
  var topCats=Object.entries(catCount).sort(function(a,b){return b[1]-a[1];}).slice(0,10).map(function(e){return e[0];});
  var MONTHS=[8,9,10,11,12];
  var posGrowth=0;
  topCats.forEach(function(c){
    var arr=[0,0,0,0,0];
    data.forEach(function(d){if((d[3]||'기타')!==c)return;var m=parseMonth(d[13]);var mi=MONTHS.indexOf(m);if(mi>=0)arr[mi]++;});
    var fi=-1,li=-1;
    for(var i=0;i<arr.length;i++){if(arr[i]>0){if(fi<0)fi=i;li=i;}}
    if(fi>=0&&li>fi&&arr[li]>=arr[fi])posGrowth++;
  });
  var kpi1=(posGrowth/topCats.length)*100;

  // KPI2: 가격접근성
  var affordable=0,priceN=0;
  data.forEach(function(d){var p=parsePrice(d[8]);if(p>0){priceN++;if(p<=50000)affordable++;}});
  var kpi2=priceN>0?(affordable/priceN)*100:0;

  // KPI3: 공급-수요 균형도
  var GROUPS=['성인','유아동','미지정','패밀리'];
  var gstats={};GROUPS.forEach(function(g){gstats[g]={count:0,high:0};});
  var gtotal=0;
  data.forEach(function(d){var g=classifyTarget(d[5]);if(GROUPS.indexOf(g)<0)return;gstats[g].count++;gtotal++;if(HIGH_DEMAND_STATUS.indexOf(d[10])>=0)gstats[g].high++;});
  var avgHigh=0,gc=0;
  GROUPS.forEach(function(g){if(gstats[g].count>0){avgHigh+=gstats[g].high/gstats[g].count*100;gc++;}});
  avgHigh=gc>0?avgHigh/gc:0;
  var gapSum=0;
  GROUPS.forEach(function(g){if(gstats[g].count>0)gapSum+=Math.abs((gstats[g].high/gstats[g].count*100)-avgHigh);});
  var kpi3=Math.max(0,100-(gapSum/GROUPS.length)*4);

  // KPI4: 시너지 밀도
  var centerCats={};
  data.forEach(function(d){var center=d[1]||'';if(!center)return;var cat=d[3]||'기타';if(!centerCats[center])centerCats[center]={};centerCats[center][cat]=1;});
  var catCenterCount={};
  Object.values(centerCats).forEach(function(cats){Object.keys(cats).forEach(function(c){catCenterCount[c]=(catCenterCount[c]||0)+1;});});
  var topSyn=Object.entries(catCenterCount).sort(function(a,b){return b[1]-a[1];}).slice(0,12).map(function(e){return e[0];});
  var pairCount={};
  Object.values(centerCats).forEach(function(cats){
    var arr=Object.keys(cats).filter(function(c){return topSyn.indexOf(c)>=0;});
    for(var i=0;i<arr.length;i++)for(var j=i+1;j<arr.length;j++){var key=arr[i]<arr[j]?arr[i]+'|'+arr[j]:arr[j]+'|'+arr[i];pairCount[key]=(pairCount[key]||0)+1;}
  });
  var scores=[];
  for(var i=0;i<topSyn.length;i++)for(var j=i+1;j<topSyn.length;j++){
    var key=topSyn[i]+'|'+topSyn[j];var w=pairCount[key]||0;
    if(w>0)scores.push(w/Math.min(catCenterCount[topSyn[i]],catCenterCount[topSyn[j]])*100);
  }
  var kpi4=scores.length?scores.reduce(function(s,v){return s+v;},0)/scores.length:0;

  // KPI5: 입지 커버리지
  var allRegions={};
  data.forEach(function(d){var r=getRegion(d[1]||'');allRegions[r]=(allRegions[r]||0)+1;});
  var topRegions=Object.entries(allRegions).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});
  var cellSet={};
  data.forEach(function(d){var r=getRegion(d[1]||'');if(topRegions.indexOf(r)<0)return;var t=getCenterType(d);cellSet[r+'|'+t]=1;});
  var kpi5=(Object.keys(cellSet).length/(topRegions.length*TYPES8.length))*100;

  // KPI6: 요일 운영 균형도
  var dayCount={};DAYS_KO.forEach(function(dd){dayCount[dd]=0;});
  data.forEach(function(d){parseDays(d[6]).forEach(function(dd){if(dayCount[dd]!==undefined)dayCount[dd]++;});});
  var dTotal=0;DAYS_KO.forEach(function(dd){dTotal+=dayCount[dd];});
  var dEnt=0;DAYS_KO.forEach(function(dd){var p=dayCount[dd]/(dTotal||1);if(p>0)dEnt+=-p*Math.log(p)/Math.LN2;});
  var maxDEnt=Math.log(7)/Math.LN2;
  var kpi6=maxDEnt>0?Math.min(100,(dEnt/maxDEnt)*100):0;

  // KPI7: 센터유형 다양성
  var typeCount={};TYPES8.forEach(function(t){typeCount[t]=0;});
  data.forEach(function(d){typeCount[getCenterType(d)]++;});
  var tVals=Object.values(typeCount).sort(function(a,b){return a-b;});
  var tn=tVals.length,tSum=tVals.reduce(function(a,b){return a+b;},0);
  var giniNum=0;tVals.forEach(function(v,i){giniNum+=(2*(i+1)-tn-1)*v;});
  var tGini=tn>0&&tSum>0?giniNum/(tn*tSum):0;
  var kpi7=Math.max(0,Math.min(100,(1-tGini)*100));

  // KPI8: 카테고리 포트폴리오 폭
  var catN=Object.keys(catCount).length;
  var kpi8=Math.min(100,(catN/60)*100);

  var KPIs=[
    {name:'시장성장세',value:kpi1,icon:'📈'},
    {name:'가격접근성',value:kpi2,icon:'💵'},
    {name:'공급수요균형',value:kpi3,icon:'👥'},
    {name:'시너지밀도',value:kpi4,icon:'🔗'},
    {name:'입지커버리지',value:kpi5,icon:'📍'},
    {name:'요일운영균형',value:kpi6,icon:'📊'},
    {name:'센터유형다양성',value:kpi7,icon:'🏢'},
    {name:'카테고리폭',value:kpi8,icon:'🎨'}
  ];
  var weights=[0.15,0.12,0.14,0.12,0.12,0.11,0.12,0.12];
  var overall=KPIs.reduce(function(sum,k,i){return sum+k.value*weights[i];},0);
  var overallGrade=grade5(overall);

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#080B10';
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
    drawMI();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawMI();});

  function drawMI(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#080B10';ctx.fillRect(0,0,620,400);
    ctx.fillStyle=ACCENT;ctx.font='bold 13px sans-serif';
    ctx.fillText('🎯 종합 수강 시장 인사이트',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    var gc2=gradeColor(overallGrade);
    ctx.fillText('8 KPI 가중평가 | ',10,38);
    ctx.fillStyle=gc2;ctx.font='bold 11px sans-serif';
    ctx.fillText('종합등급 '+overallGrade+' ('+overall.toFixed(1)+')',130,38);

    for(var i=0;i<8;i++){
      var kpi=KPIs[i];
      var col=i%4,row=Math.floor(i/4);
      var gx=15+col*152,gy=58+row*168;
      var isHov=(i===hoverIdx);
      var pct=Math.max(0,Math.min(100,kpi.value))/100;

      ctx.fillStyle=isHov?'rgba(245,158,11,0.08)':'rgba(255,255,255,0.02)';
      ctx.strokeStyle=isHov?'rgba(245,158,11,0.3)':'rgba(255,255,255,0.06)';
      ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(gx,gy,145,160,8);ctx.fill();ctx.stroke();

      ctx.fillStyle=isHov?ACCENT:'#d4d4d4';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      ctx.fillText(kpi.icon+' '+kpi.name,gx+72,gy+18);

      var gcx=gx+72,gcy=gy+95,gR=42;
      ctx.beginPath();ctx.arc(gcx,gcy,gR,Math.PI,0);
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=7;ctx.stroke();

      var endA=Math.PI+pct*Math.PI;
      ctx.beginPath();ctx.arc(gcx,gcy,gR,Math.PI,endA);
      var kGrade=grade5(kpi.value);
      var kColor=gradeColor(kGrade);
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
  drawMI();
}

// ─── 퀴즈 v27 (15문) ────────────────────────────────────────────
var QUIZ27=[
  {q:'강좌 수요 예측 트렌드 분석기에서 차월 예측치는 어떤 방식으로 계산되나요?',o:['최근 5개월 데이터 선형회귀 분석','임의의 난수 생성','전월 대비 10% 증가 고정','작년 동월 데이터 복사'],c:0},
  {q:'수요 트렌드 등급에서 8월 대비 12월 증감률이 -50% 이하이면 등급은?',o:['D','S','A','B'],c:0},
  {q:'센터 운영 효율성 벤치마크 레이더의 6개 축에 포함되지 않는 것은?',o:['강사 만족도','가격경쟁력','시간대활용','지역커버'],c:0},
  {q:'효율성 벤치마크에서 &quot;시간대활용&quot; 점수는 무엇을 기반으로 계산되나요?',o:['시간대 분포의 엔트로피(분산도)','평균 수강료','강좌 개수','카테고리 수'],c:0},
  {q:'수강료 세분화 가격 전략 워터폴에서 마지막 막대(합계)가 나타내는 것은?',o:['선택된 카테고리의 전체 강좌 수','최고가 강좌 1개','평균 수강료','무료 강좌 수'],c:0},
  {q:'가격 워터폴에서 &quot;10~20만&quot; 구간의 가격 범위는?',o:['100,001원~200,000원','100,000원~200,000원','150,000원~250,000원','90,000원~190,000원'],c:0},
  {q:'강좌 시너지 조합 추천기에서 결합률(%) 계산 기준은?',o:['공동 코스 수 ÷ 두 카테고리 중 적은 센터 수','전체 강좌 수','두 카테고리 가격 차이','강사 수'],c:0},
  {q:'시너지 네트워크에서 노드 크기가 나타내는 것은?',o:['해당 카테고리를 운영하는 센터 수','수강료','강좌 기간','참여 학생 수'],c:0},
  {q:'대상별 학습 수요 갭 분석기에서 &quot;수요 압력&quot;을 측정하는 데 사용되는 상태값이 아닌 것은?',o:['접수중','마감임박','대기접수','추가접수'],c:0},
  {q:'수요 갭 분석에서 갭 점수가 +3보다 크면 어떤 의미인가요?',o:['공급부족(수요 압력이 평균보다 높음)','공급과잉','완전 균형','데이터 부족'],c:0},
  {q:'센터 입지 경쟁력 매트릭스에서 색상이 나타내는 지표는?',o:['경쟁지수(LQ, 입지 특화도)','평균 수강료','강좌 기간','접수 상태'],c:0},
  {q:'입지 경쟁력 매트릭스에서 LQ가 0인 셀(강좌 수 0)은 무엇을 의미하나요?',o:['공백 시장','포화 시장','고가 시장','데이터 오류'],c:0},
  {q:'요일별 카테고리 점유율 흐름도의 그래프 형태는?',o:['100% 누적 영역 차트','원형 파이 차트','산점도','레이더 차트'],c:0},
  {q:'요일별 점유율 흐름도에서 &quot;그외&quot; 레이어가 포함된 이유는?',o:['TOP6 카테고리 외 나머지를 합쳐 100%를 맞추기 위해','오류 데이터 표시용','무료 강좌 전용','주말 전용 카테고리'],c:0},
  {q:'종합 수강 시장 인사이트 대시보드의 8개 KPI 중 &quot;시너지밀도&quot;는 어떤 분석기의 데이터를 활용하나요?',o:['강좌 시너지 조합 추천기','수강료 워터폴','요일별 흐름도','입지 매트릭스'],c:0}
];

function renderQuiz27(container){
  var qIdx=0,score=0,answered=false;
  function render(){
    if(qIdx>=QUIZ27.length){
      container.innerHTML='<div style="padding:12px;text-align:center"><div style="color:'+ACCENT+';font-size:14px;font-weight:bold">🎉 v27 퀴즈 완료!</div><div style="color:#d4d4d4;margin-top:8px;font-size:13px">최종 점수: '+score+'/'+QUIZ27.length+'</div></div>';
      if(score>=10)unlockAchieve27('v27_quiz_master');
      if(score>=15)unlockAchieve27('v27_quiz_perfect');
      return;
    }
    var q=QUIZ27[qIdx];answered=false;
    container.innerHTML='<div style="padding:12px"><div style="color:#8ba4c4;font-size:10px;margin-bottom:4px">Q'+(qIdx+1)+'/'+QUIZ27.length+' | 점수: '+score+'</div>'
      +'<div style="color:var(--text-primary);font-size:12px;font-weight:600;margin-bottom:10px">'+q.q+'</div>'
      +'<div id="v27-quiz-opts" style="display:flex;flex-direction:column;gap:6px">'
      +q.o.map(function(o,i){return'<button style="padding:8px 12px;border-radius:6px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text);cursor:pointer;text-align:left;font-size:11px" data-idx="'+i+'">'+esc(o)+'</button>';}).join('')
      +'</div><div id="v27-quiz-result" style="margin-top:8px;font-size:12px"></div></div>';
    container.querySelectorAll('#v27-quiz-opts button').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(answered)return;answered=true;
        var idx=parseInt(btn.getAttribute('data-idx'));
        if(idx===q.c){score++;btn.style.background='rgba(16,185,129,0.2)';btn.style.borderColor='#10B981';SFX27.play('correct');}
        else{btn.style.background='rgba(239,68,68,0.2)';btn.style.borderColor='#EF4444';
          container.querySelectorAll('#v27-quiz-opts button')[q.c].style.background='rgba(16,185,129,0.2)';
          container.querySelectorAll('#v27-quiz-opts button')[q.c].style.borderColor='#10B981';SFX27.play('wrong');}
        var res=container.querySelector('#v27-quiz-result');
        if(res){
          res.innerHTML='<span style="color:#8ba4c4">현재 점수: '+score+'/'+(qIdx+1)+' &mdash; </span><button id="v27-quiz-next" style="padding:4px 12px;border-radius:4px;border:1px solid '+ACCENT+';background:rgba(245,158,11,0.1);color:'+ACCENT+';cursor:pointer;font-size:11px">다음 &#9654;</button>';
          container.querySelector('#v27-quiz-next').addEventListener('click',function(){qIdx++;answered=false;render();SFX27.play('open');});
        }
      });
    });
  }
  render();
}

// ─── UI 빌드 ──────────────────────────────────────────────────
function buildV27UI(){
  var root=document.getElementById('root');if(!root)return;

  var hub=document.createElement('div');hub.id='ccf-v27-hub';
  hub.style.cssText='max-width:700px;margin:16px auto;padding:0 12px';
  hub.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,#1a1204,#1e1408);border:1px solid rgba(245,158,11,0.18);border-radius:10px;margin-bottom:10px">'
    +'<div style="color:'+ACCENT+';font-weight:bold;font-size:14px">🚀 시장분석허브 v27</div>'
    +'<button id="v27-toggle-all" style="padding:4px 10px;border-radius:4px;border:1px solid rgba(245,158,11,0.3);background:rgba(245,158,11,0.08);color:'+ACCENT+';cursor:pointer;font-size:11px">전체 열기/닫기</button></div>';

  SECTIONS27.forEach(function(sec){
    var section=document.createElement('div');section.id=sec.id;
    section.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background 0.2s">'
      +'<span style="font-size:16px">'+sec.icon+'</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">'+esc(sec.title)+'</span>'
      +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
      +'<div id="'+sec.id+'-content" style="display:none"></div>';
    section.querySelector('div').addEventListener('click',function(){
      SFX27.play(sec.sfx);
      var content=document.getElementById(sec.id+'-content');
      if(content.style.display==='none'){
        content.style.display='block';
        if(!content.hasChildNodes())sec.render(content);
        unlockAchieve27(sec.achieve);
      }else content.style.display='none';
      checkAllSections27();
    });
    hub.appendChild(section);
  });

  var quizSection=document.createElement('div');quizSection.id='v27-quiz-section';
  quizSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">&#10067;</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v27 퀴즈 (15문)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
    +'<div id="v27-quiz-content" style="display:none"></div>';
  quizSection.querySelector('div').addEventListener('click',function(){
    SFX27.play('open');
    var qc=document.getElementById('v27-quiz-content');
    if(qc.style.display==='none'){qc.style.display='block';if(!qc.hasChildNodes())renderQuiz27(qc);}
    else qc.style.display='none';
  });
  hub.appendChild(quizSection);

  var achSection=document.createElement('div');
  achSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">&#127942;</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v27 업적 ('+ACHIEVEMENTS_V27.length+'종)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
    +'<div id="v27-ach-content" style="display:none"><div id="v27-ach-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;padding:8px"></div></div>';
  achSection.querySelector('div').addEventListener('click',function(){
    SFX27.play('open');
    var ac=document.getElementById('v27-ach-content');
    ac.style.display=ac.style.display==='none'?'block':'none';
  });
  hub.appendChild(achSection);

  function renderAchievements27(){
    var grid=document.getElementById('v27-ach-grid');if(!grid)return;
    var unlocked=getAchieves27();
    grid.innerHTML=ACHIEVEMENTS_V27.map(function(a){
      var done=unlocked.indexOf(a.id)>=0;
      return'<div style="padding:6px 8px;border-radius:6px;border:1px solid '+(done?ACCENT:'var(--card-border)')+';background:'+(done?'rgba(245,158,11,0.08)':'var(--card-bg)')+';font-size:10px"><div style="color:'+(done?ACCENT:'var(--text-secondary)')+';font-weight:600">'+esc(a.name)+'</div><div style="color:var(--text-muted);font-size:9px;margin-top:2px">'+esc(a.desc)+'</div></div>';
    }).join('');
  }
  renderAchievements27();
  setInterval(renderAchievements27,3000);

  var prevHub=document.getElementById('ccf-v26-hub');
  if(prevHub)prevHub.after(hub);
  else root.appendChild(hub);

  document.getElementById('v27-toggle-all').addEventListener('click',function(){
    SFX27.play('click');
    var allOpen=SECTIONS27.every(function(s){var c=document.getElementById(s.id+'-content');return c&&c.style.display!=='none';});
    SECTIONS27.forEach(function(s){
      var c=document.getElementById(s.id+'-content');
      if(c){
        if(allOpen)c.style.display='none';
        else{c.style.display='block';
          var sec=SECTIONS27.find(function(x){return x.id+'-content'===c.id;});
          if(sec&&!c.hasChildNodes())sec.render(c);
          if(sec)unlockAchieve27(sec.achieve);
        }
      }
    });
    checkAllSections27();
  });

  // ─── 하단 네비게이션 버튼 추가 ─────────────────────────────
  var navInner=document.querySelector('.bottom-nav-inner');
  if(navInner){
    var navLabels=[
      {icon:'📈',label:'수요예측',secId:'v27-demand'},
      {icon:'🏢',label:'효율벤치',secId:'v27-efficiency'},
      {icon:'💵',label:'가격전략',secId:'v27-pricing-waterfall'},
      {icon:'🔗',label:'시너지',secId:'v27-synergy'},
      {icon:'👥',label:'수요갭',secId:'v27-demand-gap'},
      {icon:'📍',label:'입지매트릭스',secId:'v27-location'},
      {icon:'📊',label:'요일흐름',secId:'v27-daily-flow'},
      {icon:'🎯',label:'시장인사이트',secId:'v27-market-insight'},
      {icon:'❓',label:'퀴즈27',secId:'v27-quiz-section'}
    ];
    navLabels.forEach(function(nl){
      var btn=document.createElement('button');
      btn.className='bottom-nav-btn';
      btn.setAttribute('aria-label','v27 '+nl.label);
      btn.innerHTML='<span>'+nl.icon+'</span><span style="color:'+ACCENT+';font-size:8px">'+esc(nl.label)+'</span>';
      btn.addEventListener('click',function(){
        SFX27.play('scroll');
        var target=document.getElementById(nl.secId);
        if(target){target.scrollIntoView({behavior:'smooth',block:'start'});target.querySelector('div').click();}
      });
      navInner.appendChild(btn);
    });
  }
}

// ─── 키보드 단축키 (Shift+A/S/D/F/G/H/J/K, Shift+9=퀴즈) ──
document.addEventListener('keydown',function(e){
  if(!e.shiftKey||e.ctrlKey||e.altKey||e.metaKey)return;
  var tag=document.activeElement?document.activeElement.tagName:'';
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;

  if(e.key==='9'||e.key==='('){
    var qt=document.getElementById('v27-quiz-section');
    if(qt){e.preventDefault();qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  var keyMap={'A':0,'S':1,'D':2,'F':3,'G':4,'H':5,'J':6,'K':7};
  var upper=e.key.toUpperCase?e.key.toUpperCase():e.key;
  if(keyMap[upper]!==undefined&&keyMap[upper]<SECTIONS27.length){
    e.preventDefault();
    var sec=document.getElementById(SECTIONS27[keyMap[upper]].id);
    if(sec){sec.scrollIntoView({behavior:'smooth',block:'start'});sec.querySelector('div').click();}
  }
});

// ─── roundRect 폴리필 (v26에서 이미 정의됨, 방어적으로만 체크) ────
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
window.__v27patch={renderQuiz:renderQuiz27};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(buildV27UI,4000);});}
else{setTimeout(buildV27UI,4000);}
})();
