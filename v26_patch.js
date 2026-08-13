/**
 * culture-center-finder v26.0 patch
 * 고급 Canvas 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 데이터 없음
 * 강좌명키워드동시출현네트워크Canvas+센터별가격전략포지셔닝맵Canvas+강사멀티센터활동분석기Canvas+카테고리대상시간대3차원히트맵Canvas+수강료구간별효율분석기Canvas+센터운영다각화트리맵Canvas+지역별카테고리특화도지수Canvas+종합강좌데이터헬스체크대시보드Canvas+퀴즈15(315→330)+업적12(270→282)+SFX12종+키보드9종
 */
(function(){
'use strict';
var V26_ID='ccf-v26-patch';
if(document.getElementById(V26_ID))return;
var marker=document.createElement('meta');marker.id=V26_ID;document.head.appendChild(marker);

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

var COLORS=['#10B981','#34D399','#F59E0B','#EF4444','#8B5CF6','#EC4899','#7EC8E3','#F97316','#6366F1','#14B8A6','#E879F9','#84CC16','#FB923C','#38BDF8','#A78BFA','#FBBF24','#2DD4BF','#F472B6','#C084FC','#059669'];
var TYPES8=['홈플러스','롯데마트','이마트','백화점','구청','대학','스포츠센터','기타'];

// ─── SFX 엔진 v26 ─────────────────────────────────────────────
var SFX26={
  _ctx:null,
  _get:function(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  play:function(type){
    var c=this._get();if(!c)return;
    var o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);g.gain.value=0.06;
    var t=c.currentTime;
    switch(type){
      case'click':o.frequency.value=620;g.gain.exponentialRampToValueAtTime(0.001,t+0.05);o.start(t);o.stop(t+0.05);break;
      case'open':o.frequency.value=680;o.frequency.linearRampToValueAtTime(920,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'close':o.frequency.value=780;o.frequency.linearRampToValueAtTime(480,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'correct':o.frequency.value=600;o.frequency.linearRampToValueAtTime(860,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'wrong':o.type='sawtooth';o.frequency.value=350;g.gain.value=0.04;g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'achieve':o.frequency.value=580;o.frequency.linearRampToValueAtTime(980,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'scroll':o.type='triangle';o.frequency.value=540;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);break;
      case'hover':o.frequency.value=760;g.gain.value=0.03;g.gain.exponentialRampToValueAtTime(0.001,t+0.04);o.start(t);o.stop(t+0.04);break;
      case'complete':o.frequency.value=520;o.frequency.linearRampToValueAtTime(740,t+0.1);o.frequency.linearRampToValueAtTime(960,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'expand':o.type='triangle';o.frequency.value=580;o.frequency.linearRampToValueAtTime(800,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'collapse':o.type='triangle';o.frequency.value=730;o.frequency.linearRampToValueAtTime(500,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'milestone':o.frequency.value=520;o.frequency.linearRampToValueAtTime(960,t+0.15);o.frequency.linearRampToValueAtTime(740,t+0.25);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);break;
      default:o.frequency.value=520;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);
    }
  }
};

// ─── 업적 시스템 v26 ──────────────────────────────────────────
var ACHIEVEMENTS_V26=[
  {id:'v26_keyword',name:'키워드 네트워커',desc:'강좌명 키워드 동시출현 네트워크 열기'},
  {id:'v26_pricing',name:'가격 전략가',desc:'센터별 가격 전략 포지셔닝 맵 열기'},
  {id:'v26_instructor',name:'강사 프로파일러',desc:'강사 멀티센터 활동 분석기 열기'},
  {id:'v26_heatmap3d',name:'3차원 분석가',desc:'카테고리x대상x시간대 3차원 히트맵 열기'},
  {id:'v26_efficiency',name:'효율 심사관',desc:'수강료 구간별 효율 분석기 열기'},
  {id:'v26_treemap',name:'다각화 매퍼',desc:'센터 운영 다각화 트리맵 열기'},
  {id:'v26_lq',name:'특화도 연구원',desc:'지역별 카테고리 특화도 지수 열기'},
  {id:'v26_health',name:'헬스체커',desc:'종합 강좌 데이터 헬스체크 대시보드 열기'},
  {id:'v26_quiz_master',name:'v26 퀴즈 마스터',desc:'v26 퀴즈 10문 이상 정답'},
  {id:'v26_quiz_perfect',name:'v26 퀴즈 만점',desc:'v26 퀴즈 15문 전부 정답'},
  {id:'v26_explorer',name:'v26 탐험가',desc:'v26 5개 이상 섹션 열기'},
  {id:'v26_complete',name:'v26 정복자',desc:'v26 모든 섹션+퀴즈 완료'}
];

function getAchieves26(){return lsGet('ccf_achieves_v26',[]);}
function unlockAchieve26(id){
  var arr=getAchieves26();
  if(arr.indexOf(id)<0){arr.push(id);lsSet('ccf_achieves_v26',arr);SFX26.play('achieve');}
  checkAllSections26();
}
function checkAllSections26(){
  var arr=getAchieves26();
  var sectionAchs=SECTIONS26.map(function(s){return s.achieve;});
  var opened=sectionAchs.filter(function(a){return arr.indexOf(a)>=0;}).length;
  if(opened>=5&&arr.indexOf('v26_explorer')<0)unlockAchieve26('v26_explorer');
  if(opened>=8&&arr.indexOf('v26_quiz_master')>=0&&arr.indexOf('v26_complete')<0)unlockAchieve26('v26_complete');
}

// ─── 섹션 정의 ─────────────────────────────────────────────────
var SECTIONS26=[
  {id:'v26-keyword',title:'강좌명 키워드 동시출현 네트워크',icon:'🔗',achieve:'v26_keyword',sfx:'expand',render:renderKeywordNet},
  {id:'v26-pricing',title:'센터별 가격 전략 포지셔닝 맵',icon:'💰',achieve:'v26_pricing',sfx:'expand',render:renderPricingMap},
  {id:'v26-instructor',title:'강사 멀티센터 활동 분석기',icon:'👨‍🏫',achieve:'v26_instructor',sfx:'expand',render:renderInstructor},
  {id:'v26-heatmap3d',title:'카테고리x대상x시간대 3차원 히트맵',icon:'🧊',achieve:'v26_heatmap3d',sfx:'expand',render:renderHeatmap3D},
  {id:'v26-efficiency',title:'수강료 구간별 효율 분석기',icon:'⚖️',achieve:'v26_efficiency',sfx:'expand',render:renderEfficiency},
  {id:'v26-treemap',title:'센터 운영 다각화 트리맵',icon:'🌳',achieve:'v26_treemap',sfx:'expand',render:renderTreemap},
  {id:'v26-lq',title:'지역별 카테고리 특화도 지수',icon:'📍',achieve:'v26_lq',sfx:'expand',render:renderLQ},
  {id:'v26-health',title:'종합 강좌 데이터 헬스체크 대시보드',icon:'🏥',achieve:'v26_health',sfx:'milestone',render:renderHealth}
];

// ─── 1. 강좌명 키워드 동시출현 네트워크 ──────────────────────────
function renderKeywordNet(container){
  var data=getData();
  var wordFreq={};
  var pairFreq={};
  data.forEach(function(d){
    var title=d[4]||'';
    var words=title.match(/[가-힣]{2,3}/g);
    if(!words||words.length<2)return;
    var uniq=[];
    words.forEach(function(w){if(uniq.indexOf(w)<0)uniq.push(w);});
    uniq.forEach(function(w){wordFreq[w]=(wordFreq[w]||0)+1;});
    for(var i=0;i<uniq.length;i++){
      for(var j=i+1;j<uniq.length;j++){
        var key=uniq[i]<uniq[j]?uniq[i]+'|'+uniq[j]:uniq[j]+'|'+uniq[i];
        pairFreq[key]=(pairFreq[key]||0)+1;
      }
    }
  });
  var topWords=Object.entries(wordFreq).sort(function(a,b){return b[1]-a[1];}).slice(0,20);
  var wordSet=topWords.map(function(e){return e[0];});
  var maxFreq=topWords.length?topWords[0][1]:1;
  var edges=[];var maxEdge=1;
  for(var i=0;i<wordSet.length;i++){
    for(var j=i+1;j<wordSet.length;j++){
      var key=wordSet[i]<wordSet[j]?wordSet[i]+'|'+wordSet[j]:wordSet[j]+'|'+wordSet[i];
      var w=pairFreq[key]||0;
      if(w>=3){edges.push({s:i,t:j,w:w});if(w>maxEdge)maxEdge=w;}
    }
  }
  // layout: circular
  var nodes=topWords.map(function(e,i){
    var angle=(i/topWords.length)*Math.PI*2-Math.PI/2;
    var r=140;
    return{word:e[0],freq:e[1],x:320+Math.cos(angle)*r,y:210+Math.sin(angle)*r,idx:i};
  });

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverIdx=-1;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverIdx=-1;
    for(var i=0;i<nodes.length;i++){
      if(Math.abs(mx-nodes[i].x)<14&&Math.abs(my-nodes[i].y)<14){hoverIdx=i;break;}
    }
    drawKN();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawKN();});

  function drawKN(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('🔗 강좌명 키워드 동시출현 네트워크',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('TOP 20 키워드 원형 네트워크 | 간선=동시출현빈도 | 노드크기=빈도',10,38);

    edges.forEach(function(e){
      var n1=nodes[e.s],n2=nodes[e.t];
      var isHov=(hoverIdx===e.s||hoverIdx===e.t);
      ctx.beginPath();ctx.moveTo(n1.x,n1.y);ctx.lineTo(n2.x,n2.y);
      ctx.strokeStyle=isHov?'rgba(16,185,129,0.7)':'rgba(16,185,129,'+(0.08+(e.w/maxEdge)*0.35)+')';
      ctx.lineWidth=isHov?2+e.w/maxEdge*3:0.5+e.w/maxEdge*2.5;
      ctx.stroke();
    });

    nodes.forEach(function(n,i){
      var isHov=(i===hoverIdx);
      var r=4+Math.min(10,(n.freq/maxFreq)*10);
      ctx.beginPath();ctx.arc(n.x,n.y,isHov?r+3:r,0,Math.PI*2);
      ctx.fillStyle=COLORS[i%COLORS.length];ctx.globalAlpha=isHov?1:0.75;ctx.fill();ctx.globalAlpha=1;
      if(isHov){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();}
      ctx.fillStyle=isHov?'#fff':'#8ba4c4';ctx.font=(isHov?'bold 10px':'9px')+' sans-serif';ctx.textAlign='center';
      ctx.fillText(n.word,n.x,n.y-r-5);ctx.textAlign='left';
    });

    if(hoverIdx>=0){
      var hn=nodes[hoverIdx];
      var conns=edges.filter(function(e){return e.s===hoverIdx||e.t===hoverIdx;});
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(10,350,300,44,6);ctx.fill();
      ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
      ctx.fillText('&quot;'+hn.word+'&quot; 출현: '+hn.freq+'회',20,366);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText('연결 키워드: '+conns.length+'개 | 최대 동시출현: '+(conns.length?Math.max.apply(null,conns.map(function(c){return c.w;})):0)+'회',20,382);
    }
  }
  drawKN();
}

// ─── 2. 센터별 가격 전략 포지셔닝 맵 ────────────────────────────
function renderPricingMap(container){
  var data=getData();
  var centerStats={};
  data.forEach(function(d){
    var name=d[1]||'';if(!name)return;
    if(!centerStats[name])centerStats[name]={count:0,totalPrice:0,priceN:0,cats:{}};
    centerStats[name].count++;
    var price=parsePrice(d[8]);if(price>0){centerStats[name].totalPrice+=price;centerStats[name].priceN++;}
    centerStats[name].cats[d[3]||'기타']=1;
  });
  var entries=Object.entries(centerStats).filter(function(e){return e[1].priceN>0;})
    .sort(function(a,b){return b[1].count-a[1].count;}).slice(0,20);
  var maxAvg=1,maxDiv=1,maxCount=1;
  var pts=entries.map(function(e){
    var s=e[1];
    var avgP=s.totalPrice/s.priceN;
    var div=Object.keys(s.cats).length;
    if(avgP>maxAvg)maxAvg=avgP;
    if(div>maxDiv)maxDiv=div;
    if(s.count>maxCount)maxCount=s.count;
    return{name:e[0],avgPrice:avgP,diversity:div,count:s.count};
  });
  var medPrice=0,medDiv=0;
  if(pts.length){
    var sp=pts.slice().sort(function(a,b){return a.avgPrice-b.avgPrice;});
    medPrice=sp[Math.floor(sp.length/2)].avgPrice;
    var sd=pts.slice().sort(function(a,b){return a.diversity-b.diversity;});
    medDiv=sd[Math.floor(sd.length/2)].diversity;
  }

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
      var cx=px0+(pts[i].avgPrice/maxAvg)*(px1-px0);
      var cy=py0-(pts[i].diversity/maxDiv)*(py0-py1);
      if(Math.abs(mx-cx)<12&&Math.abs(my-cy)<12){hoverIdx=i;break;}
    }
    drawPM();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawPM();});

  function drawPM(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('💰 센터별 가격 전략 포지셔닝 맵',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('X:평균수강료 Y:카테고리다양성 | 원크기=강좌수 | TOP 20센터',10,38);

    // quadrant lines
    var qx=px0+(medPrice/maxAvg)*(px1-px0);
    var qy=py0-(medDiv/maxDiv)*(py0-py1);
    ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.setLineDash([4,4]);ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(qx,py1);ctx.lineTo(qx,py0);ctx.stroke();
    ctx.beginPath();ctx.moveTo(px0,qy);ctx.lineTo(px1,qy);ctx.stroke();
    ctx.setLineDash([]);

    // quadrant labels
    ctx.fillStyle='rgba(16,185,129,0.35)';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('저가다양',(px0+qx)/2,(py1+qy)/2);
    ctx.fillText('고가다양',(qx+px1)/2,(py1+qy)/2);
    ctx.fillText('저가집중',(px0+qx)/2,(qy+py0)/2);
    ctx.fillText('고가집중',(qx+px1)/2,(qy+py0)/2);
    ctx.textAlign='left';

    // axes
    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(px0,py0);ctx.lineTo(px1,py0);ctx.moveTo(px0,py0);ctx.lineTo(px0,py1);ctx.stroke();
    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('평균수강료 →',(px0+px1)/2,py0+18);
    ctx.save();ctx.translate(25,(py0+py1)/2);ctx.rotate(-Math.PI/2);ctx.fillText('카테고리 다양성 →',0,0);ctx.restore();
    ctx.textAlign='left';

    pts.forEach(function(p,i){
      var cx=px0+(p.avgPrice/maxAvg)*(px1-px0);
      var cy=py0-(p.diversity/maxDiv)*(py0-py1);
      var isHov=(i===hoverIdx);
      var r=3+Math.min(10,(p.count/maxCount)*10);
      ctx.beginPath();ctx.arc(cx,cy,isHov?r+3:r,0,Math.PI*2);
      ctx.fillStyle=COLORS[i%COLORS.length];ctx.globalAlpha=isHov?1:0.65;ctx.fill();ctx.globalAlpha=1;
      if(isHov){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.stroke();}
      ctx.fillStyle=isHov?'#fff':'#8ba4c4';ctx.font='7px sans-serif';
      ctx.fillText(p.name.substring(0,5),cx+r+3,cy+3);
    });

    if(hoverIdx>=0){
      var hp=pts[hoverIdx];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(340,340,270,52,6);ctx.fill();
      ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(hp.name.substring(0,15)),350,356);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText(hp.count+'개 | 평균 '+Math.round(hp.avgPrice).toLocaleString()+'원',350,370);
      ctx.fillText('카테고리 '+hp.diversity+'종 | '+(hp.avgPrice>medPrice?'고가':'저가')+' '+(hp.diversity>medDiv?'다양':'집중'),350,384);
    }
  }
  drawPM();
}

// ─── 3. 강사 멀티센터 활동 분석기 ────────────────────────────────
function renderInstructor(container){
  var data=getData();
  var instrMap={};
  data.forEach(function(d){
    var instr=d[9]||'';if(!instr||instr.length<2)return;
    if(!instrMap[instr])instrMap[instr]={centers:{},cats:{}};
    instrMap[instr].centers[d[1]||'']=1;
    instrMap[instr].cats[d[3]||'기타']=1;
  });
  var multi=Object.entries(instrMap).filter(function(e){return Object.keys(e[1].centers).length>=2;})
    .map(function(e){return{name:e[0],centerCount:Object.keys(e[1].centers).length,catCount:Object.keys(e[1].cats).length,centers:Object.keys(e[1].centers)};})
    .sort(function(a,b){return b.centerCount-a.centerCount;}).slice(0,15);
  var maxCenters=multi.length?multi[0].centerCount:1;
  var pageIdx=0;

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a;cursor:pointer';
  container.appendChild(canvas);

  canvas.addEventListener('click',function(){pageIdx=(pageIdx+1)%Math.max(1,multi.length);drawIns();SFX26.play('click');});

  function drawIns(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('👨‍🏫 강사 멀티센터 활동 분석기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('2개+ 센터 활동 강사 TOP 15 | 클릭: 강사 상세 ('+(pageIdx+1)+'/'+multi.length+')',10,38);

    if(!multi.length){ctx.fillStyle='#556173';ctx.fillText('멀티센터 강사 데이터 없음',250,200);return;}

    var barX=150,barMaxW=400,barH=18,gap=4,startY=55;
    multi.forEach(function(m,i){
      var y=startY+i*(barH+gap);
      var bw=(m.centerCount/maxCenters)*barMaxW;
      var catAlpha=Math.min(1,0.3+m.catCount*0.15);
      ctx.fillStyle=i===pageIdx?'rgba(16,185,129,'+catAlpha+')':'rgba(16,185,129,'+(catAlpha*0.6)+')';
      ctx.beginPath();ctx.roundRect(barX,y,bw,barH,[0,4,4,0]);ctx.fill();
      if(i===pageIdx){ctx.strokeStyle='#10B981';ctx.lineWidth=1;ctx.stroke();}
      ctx.fillStyle=i===pageIdx?'#fff':'#8ba4c4';ctx.font='9px sans-serif';ctx.textAlign='right';
      ctx.fillText(esc(m.name.substring(0,7)),barX-6,y+13);
      ctx.textAlign='left';
      ctx.fillStyle='#d4d4d4';ctx.font='8px sans-serif';
      ctx.fillText(m.centerCount+'개',barX+bw+6,y+13);
    });

    // detail panel for selected instructor
    if(multi[pageIdx]){
      var sel=multi[pageIdx];
      ctx.fillStyle='rgba(16,185,129,0.06)';
      ctx.beginPath();ctx.roundRect(10,348,600,46,6);ctx.fill();
      ctx.strokeStyle='rgba(16,185,129,0.2)';ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(sel.name)+' — '+sel.centerCount+'개 센터, '+sel.catCount+'개 카테고리',20,366);
      ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';
      ctx.fillText('활동센터: '+sel.centers.slice(0,4).map(function(c){return c.substring(0,8);}).join(', ')+(sel.centers.length>4?' ...':''),20,382);
    }
  }
  drawIns();
}

// ─── 4. 카테고리x대상x시간대 3차원 히트맵 ───────────────────────
function renderHeatmap3D(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});
  var SLOTS=['9-11','11-13','13-15','15-17','17-19','19-21'];
  var TARGETS=['전체','성인','어린이','청소년','시니어'];
  var filterIdx=0;

  function buildMatrix(){
    var target=TARGETS[filterIdx];
    var matrix=[];
    for(var r=0;r<SLOTS.length;r++){matrix[r]=[];for(var c=0;c<topCats.length;c++)matrix[r][c]=0;}
    data.forEach(function(d){
      var cat=d[3]||'기타';var ci=topCats.indexOf(cat);if(ci<0)return;
      if(target!=='전체'){
        var tg=d[5]||'';
        if(target==='시니어'){if(tg.indexOf('시니어')<0&&tg.indexOf('어르신')<0)return;}
        else if(tg.indexOf(target)<0)return;
      }
      var h=parseHour(d[7]);if(h<0)return;
      var ri=-1;
      if(h>=9&&h<11)ri=0;else if(h>=11&&h<13)ri=1;else if(h>=13&&h<15)ri=2;
      else if(h>=15&&h<17)ri=3;else if(h>=17&&h<19)ri=4;else if(h>=19&&h<21)ri=5;
      if(ri>=0)matrix[ri][ci]++;
    });
    return matrix;
  }

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a;cursor:pointer';
  container.appendChild(canvas);
  var hoverR=-1,hoverC=-1;
  var cellW=60,cellH=42,startX=80,startY=70;

  canvas.addEventListener('click',function(ev){
    var rect=canvas.getBoundingClientRect();
    var my=(ev.clientY-rect.top)*(400/rect.height);
    if(my<55){filterIdx=(filterIdx+1)%TARGETS.length;drawHM();SFX26.play('click');}
  });
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverR=-1;hoverC=-1;
    if(mx>=startX&&my>=startY){
      var c=Math.floor((mx-startX)/cellW);
      var r=Math.floor((my-startY)/cellH);
      if(r>=0&&r<SLOTS.length&&c>=0&&c<topCats.length){hoverR=r;hoverC=c;}
    }
    drawHM();
  });
  canvas.addEventListener('mouseleave',function(){hoverR=-1;hoverC=-1;drawHM();});

  function drawHM(){
    var matrix=buildMatrix();
    var maxVal=1;
    matrix.forEach(function(row){row.forEach(function(v){if(v>maxVal)maxVal=v;});});
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('🧊 카테고리x대상x시간대 3차원 히트맵',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('클릭 상단: 대상 필터 변경 | 현재: ',10,38);
    ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
    ctx.fillText(TARGETS[filterIdx],170,38);
    TARGETS.forEach(function(t,i){
      ctx.fillStyle=i===filterIdx?'#10B981':'#556173';ctx.font=(i===filterIdx?'bold ':'')+' 9px sans-serif';
      ctx.fillText(t,240+i*50,38);
    });

    // column headers
    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';ctx.textAlign='center';
    topCats.forEach(function(cat,ci){
      ctx.fillStyle=(ci===hoverC)?'#10B981':'#8ba4c4';
      ctx.fillText(cat.substring(0,5),startX+ci*cellW+cellW/2,startY-8);
    });
    // row headers
    ctx.textAlign='right';
    SLOTS.forEach(function(slot,ri){
      ctx.fillStyle=(ri===hoverR)?'#10B981':'#8ba4c4';ctx.font='9px sans-serif';
      ctx.fillText(slot+'시',startX-8,startY+ri*cellH+cellH/2+3);
    });
    ctx.textAlign='left';

    SLOTS.forEach(function(slot,ri){
      topCats.forEach(function(cat,ci){
        var v=matrix[ri][ci];
        var norm=v/maxVal;
        var isHov=(ri===hoverR&&ci===hoverC);
        ctx.fillStyle=isHov?'rgba(255,255,255,0.3)':'rgba(16,185,129,'+(0.06+norm*0.8)+')';
        ctx.beginPath();ctx.roundRect(startX+ci*cellW+1,startY+ri*cellH+1,cellW-2,cellH-2,3);ctx.fill();
        if(v>0){
          ctx.fillStyle=norm>0.5?'#fff':'#8ba4c4';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
          ctx.fillText(v,startX+ci*cellW+cellW/2,startY+ri*cellH+cellH/2+3);
          ctx.textAlign='left';
        }
      });
    });

    if(hoverR>=0&&hoverC>=0){
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(160,345,320,44,6);ctx.fill();
      ctx.fillStyle='#10B981';ctx.font='bold 9px sans-serif';
      ctx.fillText(esc(topCats[hoverC])+' · '+SLOTS[hoverR]+'시 · '+TARGETS[filterIdx],170,361);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText('강좌 수: '+matrix[hoverR][hoverC]+'개',170,377);
    }
  }
  drawHM();
}

// ─── 5. 수강료 구간별 효율 분석기 ───────────────────────────────
function renderEfficiency(container){
  var data=getData();
  var BANDS=['무료','~3만','3~5만','5~10만','10~20만','20만+'];
  function getBand(price){
    if(price<=0)return 0;if(price<=30000)return 1;if(price<=50000)return 2;
    if(price<=100000)return 3;if(price<=200000)return 4;return 5;
  }
  var bandStats=BANDS.map(function(){return{count:0,totalSess:0,sessN:0,totalDur:0,durN:0,totalPrice:0,priceN:0};});
  data.forEach(function(d){
    var price=parsePrice(d[8]);
    var bi=getBand(price);
    bandStats[bi].count++;
    var sess=parseSessions(d[14]);
    if(sess>0){bandStats[bi].totalSess+=sess;bandStats[bi].sessN++;}
    var dur=parseDurationHours(d[7]);
    if(dur>0&&dur<8){bandStats[bi].totalDur+=dur;bandStats[bi].durN++;}
    if(price>0){bandStats[bi].totalPrice+=price;bandStats[bi].priceN++;}
  });

  var metrics=bandStats.map(function(s,i){
    var avgSess=s.sessN>0?s.totalSess/s.sessN:0;
    var avgDur=s.durN>0?s.totalDur/s.durN:0;
    var avgPrice=s.priceN>0?s.totalPrice/s.priceN:0;
    var perSession=avgSess>0&&avgPrice>0?avgPrice/avgSess:0;
    return{band:BANDS[i],avgSess:avgSess,avgDur:avgDur,perSession:perSession,count:s.count};
  });
  var maxSess=1,maxPer=1;
  metrics.forEach(function(m){if(m.avgSess>maxSess)maxSess=m.avgSess;if(m.perSession>maxPer)maxPer=m.perSession;});

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverIdx=-1;
  var barX=100,barW=70,gap=10,startY=70,barMaxH=220;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    hoverIdx=-1;
    for(var i=0;i<6;i++){
      var x=barX+i*(barW+gap);
      if(mx>=x&&mx<=x+barW){hoverIdx=i;break;}
    }
    drawEff();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawEff();});

  function grade(perSess){return perSess<=0?'-':perSess<=3000?'S':perSess<=5000?'A':perSess<=8000?'B':perSess<=12000?'C':'D';}

  function drawEff(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('⚖️ 수강료 구간별 효율 분석기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('초록:평균수강횟수 | 주황:회당단가 | S~D 가성비등급',10,38);

    var baseY=startY+barMaxH;
    metrics.forEach(function(m,i){
      var x=barX+i*(barW+gap);
      var isHov=(i===hoverIdx);
      // session bar (left half)
      var sh=(m.avgSess/maxSess)*barMaxH;
      ctx.fillStyle=isHov?'rgba(16,185,129,0.85)':'rgba(16,185,129,0.55)';
      ctx.beginPath();ctx.roundRect(x,baseY-sh,barW/2-2,sh,[4,4,0,0]);ctx.fill();
      // per-session bar (right half)
      var ph=(m.perSession/maxPer)*barMaxH;
      ctx.fillStyle=isHov?'rgba(249,115,22,0.85)':'rgba(249,115,22,0.55)';
      ctx.beginPath();ctx.roundRect(x+barW/2+1,baseY-ph,barW/2-2,ph,[4,4,0,0]);ctx.fill();

      // band label
      ctx.fillStyle=isHov?'#10B981':'#8ba4c4';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText(m.band,x+barW/2,baseY+14);
      // grade
      var g=grade(m.perSession);
      var gc=g==='S'?'#FFD700':g==='A'?'#10B981':g==='B'?'#3AAFA9':g==='C'?'#F59E0B':'#EF4444';
      ctx.fillStyle=gc;ctx.font='bold 11px sans-serif';
      ctx.fillText(g,x+barW/2,baseY+28);
      ctx.textAlign='left';
    });

    // legend
    ctx.fillStyle='rgba(16,185,129,0.7)';ctx.fillRect(470,55,10,10);
    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';ctx.fillText('평균 수강횟수',484,64);
    ctx.fillStyle='rgba(249,115,22,0.7)';ctx.fillRect(470,70,10,10);
    ctx.fillStyle='#8ba4c4';ctx.fillText('회당 단가',484,79);

    if(hoverIdx>=0){
      var hm=metrics[hoverIdx];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(150,340,320,52,6);ctx.fill();
      ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
      ctx.fillText(hm.band+' 구간 ('+hm.count+'개)',160,356);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText('평균 '+hm.avgSess.toFixed(1)+'회 | 회당 '+Math.round(hm.perSession).toLocaleString()+'원 | 1회 '+hm.avgDur.toFixed(1)+'시간',160,370);
      ctx.fillText('가성비등급: '+grade(hm.perSession),160,384);
    }
  }
  drawEff();
}

// ─── 6. 센터 운영 다각화 트리맵 ─────────────────────────────────
function renderTreemap(container){
  var data=getData();
  var typeGroup={};
  TYPES8.forEach(function(t){typeGroup[t]={};});
  data.forEach(function(d){
    var t=getCenterType(d);
    var cat=d[3]||'기타';
    if(!typeGroup[t])typeGroup[t]={};
    typeGroup[t][cat]=(typeGroup[t][cat]||0)+1;
  });

  var blocks=[];
  var typeColors={'홈플러스':'#10B981','롯데마트':'#F59E0B','이마트':'#8B5CF6','백화점':'#EC4899','구청':'#6366F1','대학':'#14B8A6','스포츠센터':'#F97316','기타':'#84CC16'};
  TYPES8.forEach(function(t){
    var cats=typeGroup[t];
    var totalForType=0;
    Object.values(cats).forEach(function(v){totalForType+=v;});
    var topCats=Object.entries(cats).sort(function(a,b){return b[1]-a[1];}).slice(0,5);
    topCats.forEach(function(e){
      blocks.push({type:t,cat:e[0],count:e[1],color:typeColors[t]||'#10B981'});
    });
  });
  blocks.sort(function(a,b){return b.count-a.count;});
  var totalCount=blocks.reduce(function(s,b){return s+b.count;},0)||1;

  // simple squarified treemap layout
  var rects=[];
  var areaW=600,areaH=310,ox=10,oy=60;
  var remaining=blocks.slice();
  function layoutRow(items,x,y,w,h,horiz){
    var total=items.reduce(function(s,b){return s+b.count;},0);
    var pos=0;
    items.forEach(function(item){
      var frac=item.count/total;
      var rect;
      if(horiz){rect={x:x,y:y+pos*h,w:w,h:frac*h};}
      else{rect={x:x+pos*w,y:y,w:frac*w,h:h};}
      rect.type=item.type;rect.cat=item.cat;rect.count=item.count;rect.color=item.color;
      rects.push(rect);
      pos+=frac;
    });
  }
  // simplified strip layout
  var curX=ox,curY=oy,remW=areaW,remH=areaH;
  var idx=0,horiz=true;
  while(idx<remaining.length){
    var rowItems=[];
    var rowCount=0;
    var stripSize=horiz?remW*0.4:remH*0.4;
    while(idx<remaining.length&&rowItems.length<4){
      rowItems.push(remaining[idx]);rowCount+=remaining[idx].count;idx++;
    }
    var frac=rowCount/totalCount;
    if(horiz){
      var rh=Math.min(remH,frac*areaH*blocks.length/remaining.length+40);
      if(rh>remH)rh=remH;
      layoutRow(rowItems,curX,curY,remW,rh,false);
      curY+=rh;remH-=rh;
    }else{
      var rw=Math.min(remW,frac*areaW*blocks.length/remaining.length+40);
      if(rw>remW)rw=remW;
      layoutRow(rowItems,curX,curY,rw,remH,true);
      curX+=rw;remW-=rw;
    }
    horiz=!horiz;
  }

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverIdx=-1;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverIdx=-1;
    for(var i=0;i<rects.length;i++){
      var r=rects[i];
      if(mx>=r.x&&mx<=r.x+r.w&&my>=r.y&&my<=r.y+r.h){hoverIdx=i;break;}
    }
    drawTM();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawTM();});

  function drawTM(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('🌳 센터 운영 다각화 트리맵',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('센터유형×카테고리 | 면적=강좌수 | 색상=센터유형',10,38);

    rects.forEach(function(r,i){
      var isHov=(i===hoverIdx);
      ctx.fillStyle=r.color;ctx.globalAlpha=isHov?0.85:0.5;
      ctx.beginPath();ctx.roundRect(r.x+1,r.y+1,Math.max(0,r.w-2),Math.max(0,r.h-2),3);ctx.fill();
      ctx.globalAlpha=1;
      if(isHov){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();}
      if(r.w>35&&r.h>22){
        ctx.fillStyle='#fff';ctx.font='bold 8px sans-serif';ctx.textAlign='center';
        ctx.fillText(r.cat.substring(0,4),r.x+r.w/2,r.y+r.h/2-2);
        ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='7px sans-serif';
        ctx.fillText(r.count,r.x+r.w/2,r.y+r.h/2+10);
        ctx.textAlign='left';
      }
    });

    // legend
    var lx=10,ly=378;
    TYPES8.forEach(function(t,i){
      ctx.fillStyle=typeColors[t]||'#10B981';ctx.globalAlpha=0.7;
      ctx.fillRect(lx+i*75,ly,8,8);ctx.globalAlpha=1;
      ctx.fillStyle='#8ba4c4';ctx.font='7px sans-serif';
      ctx.fillText(t,lx+i*75+11,ly+8);
    });

    if(hoverIdx>=0){
      var hr=rects[hoverIdx];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(380,340,250,44,6);ctx.fill();
      ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(hr.type)+' · '+esc(hr.cat),390,356);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText('강좌 수: '+hr.count+'개 ('+(hr.count/totalCount*100).toFixed(1)+'%)',390,372);
    }
  }
  drawTM();
}

// ─── 7. 지역별 카테고리 특화도 지수 (LQ 히트맵) ─────────────────
function renderLQ(container){
  var data=getData();
  var allCats={};var allRegions={};
  data.forEach(function(d){
    var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;
    var r=getRegion(d[1]||'');allRegions[r]=(allRegions[r]||0)+1;
  });
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});
  var topRegions=Object.entries(allRegions).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});
  var total=data.length||1;

  var regCatCount={};
  topRegions.forEach(function(r){regCatCount[r]={};topCats.forEach(function(c){regCatCount[r][c]=0;});});
  var regTotal={};topRegions.forEach(function(r){regTotal[r]=0;});
  var catTotal={};topCats.forEach(function(c){catTotal[c]=0;});
  data.forEach(function(d){
    var r=getRegion(d[1]||'');var c=d[3]||'기타';
    if(topRegions.indexOf(r)<0||topCats.indexOf(c)<0)return;
    regCatCount[r][c]++;regTotal[r]++;catTotal[c]++;
  });

  var lqMatrix={};
  topRegions.forEach(function(r){
    lqMatrix[r]={};
    topCats.forEach(function(c){
      var regShare=regTotal[r]>0?regCatCount[r][c]/regTotal[r]:0;
      var natShare=total>0?catTotal[c]/total:0;
      lqMatrix[r][c]=natShare>0?regShare/natShare:0;
    });
  });

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverR=-1,hoverC=-1;
  var cellW=56,cellH=32,startX=80,startY=65;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverR=-1;hoverC=-1;
    if(mx>=startX&&my>=startY){
      var c=Math.floor((mx-startX)/cellW);
      var r=Math.floor((my-startY)/cellH);
      if(r>=0&&r<topRegions.length&&c>=0&&c<topCats.length){hoverR=r;hoverC=c;}
    }
    drawLQ();
  });
  canvas.addEventListener('mouseleave',function(){hoverR=-1;hoverC=-1;drawLQ();});

  function drawLQ(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('📍 지역별 카테고리 특화도 지수 (LQ)',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('LQ>1.5 초록(특화) | LQ 0.5~1.5 중립 | LQ<0.5 빨강(미발달)',10,38);

    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';ctx.textAlign='center';
    topCats.forEach(function(cat,ci){
      ctx.fillStyle=(ci===hoverC)?'#10B981':'#8ba4c4';
      ctx.fillText(cat.substring(0,5),startX+ci*cellW+cellW/2,startY-8);
    });
    ctx.textAlign='right';
    topRegions.forEach(function(r,ri){
      ctx.fillStyle=(ri===hoverR)?'#10B981':'#8ba4c4';ctx.font='9px sans-serif';
      ctx.fillText(r,startX-8,startY+ri*cellH+cellH/2+3);
    });
    ctx.textAlign='left';

    topRegions.forEach(function(r,ri){
      topCats.forEach(function(cat,ci){
        var lq=lqMatrix[r][cat];
        var isHov=(ri===hoverR&&ci===hoverC);
        var color;
        if(lq>=1.5)color='rgba(16,185,129,'+(0.3+Math.min(0.65,(lq-1)*0.3))+')';
        else if(lq>=0.5)color='rgba(255,255,255,'+(0.05+lq*0.08)+')';
        else color='rgba(239,68,68,'+(0.15+Math.min(0.55,(1-lq*2)*0.4))+')';
        ctx.fillStyle=isHov?'rgba(255,255,255,0.3)':color;
        ctx.beginPath();ctx.roundRect(startX+ci*cellW+1,startY+ri*cellH+1,cellW-2,cellH-2,3);ctx.fill();
        ctx.fillStyle=lq>=1.5?'#fff':lq>=0.5?'#8ba4c4':'#f99';
        ctx.font='bold 8px sans-serif';ctx.textAlign='center';
        ctx.fillText(lq.toFixed(2),startX+ci*cellW+cellW/2,startY+ri*cellH+cellH/2+3);
        ctx.textAlign='left';
      });
    });

    if(hoverR>=0&&hoverC>=0){
      var r=topRegions[hoverR],c=topCats[hoverC];
      var lq=lqMatrix[r][c];
      var label=lq>=1.5?'특화 지역':lq>=0.5?'보통':'미발달';
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(130,340,360,50,6);ctx.fill();
      ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
      ctx.fillText(r+' · '+esc(c),140,356);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText('LQ='+lq.toFixed(3)+' ('+label+') | 강좌 '+regCatCount[r][c]+'개',140,370);
      ctx.fillText('지역 총 '+regTotal[r]+'개 | 전국 해당카테고리 '+catTotal[c]+'개',140,384);
    }
  }
  drawLQ();
}

// ─── 8. 종합 강좌 데이터 헬스체크 대시보드 ──────────────────────
function renderHealth(container){
  var data=getData();
  var total=data.length||1;

  // KPI1: 데이터 풍부도
  var kpi1=Math.min(100,(total/50000)*100);

  // KPI2: 가격 투명성
  var priceValid=0;
  data.forEach(function(d){if(parsePrice(d[8])>0)priceValid++;});
  var kpi2=(priceValid/total)*100;

  // KPI3: 시간대 분산도 (엔트로피)
  var hourBuckets={};
  data.forEach(function(d){var h=parseHour(d[7]);if(h>=0){var slot=Math.floor(h/2)*2;hourBuckets[slot]=(hourBuckets[slot]||0)+1;}});
  var hourKeys=Object.keys(hourBuckets);var hourTotal=0;
  hourKeys.forEach(function(k){hourTotal+=hourBuckets[k];});
  var hourEntropy=0;
  hourKeys.forEach(function(k){var p=hourBuckets[k]/(hourTotal||1);hourEntropy+=-p*Math.log(p+1e-12)/Math.LN2;});
  var maxHourEnt=Math.log(hourKeys.length||1)/Math.LN2;
  var kpi3=maxHourEnt>0?Math.min(100,(hourEntropy/maxHourEnt)*100):50;

  // KPI4: 카테고리 균형 (Gini inverted)
  var catCount={};
  data.forEach(function(d){var c=d[3]||'기타';catCount[c]=(catCount[c]||0)+1;});
  var catVals=Object.values(catCount).sort(function(a,b){return a-b;});
  var n=catVals.length;var catSum=catVals.reduce(function(a,b){return a+b;},0);
  var giniNum=0;
  catVals.forEach(function(v,i){giniNum+=(2*(i+1)-n-1)*v;});
  var gini=n>0&&catSum>0?giniNum/(n*catSum):0;
  var kpi4=Math.max(0,Math.min(100,(1-gini)*100));

  // KPI5: 지역 커버리지
  var regionSet={};
  data.forEach(function(d){regionSet[getRegion(d[1]||'')]=1;});
  var kpi5=Math.min(100,(Object.keys(regionSet).length/10)*100);

  // KPI6: 센터 다양성
  var centerSet={};
  data.forEach(function(d){if(d[1])centerSet[d[1]]=1;});
  var kpi6=Math.min(100,(Object.keys(centerSet).length/500)*100);

  // KPI7: 접수 활성도
  var accepting=0;
  data.forEach(function(d){if(d[10]&&String(d[10]).indexOf('접수중')>=0)accepting++;});
  var kpi7=(accepting/total)*100;

  // KPI8: 강사 정보 충실도
  var hasInstr=0;
  data.forEach(function(d){if(d[9]&&String(d[9]).length>=2)hasInstr++;});
  var kpi8=(hasInstr/total)*100;

  var KPIs=[
    {name:'데이터 풍부도',value:kpi1,icon:'📊'},
    {name:'가격 투명성',value:kpi2,icon:'💲'},
    {name:'시간대 분산도',value:kpi3,icon:'⏰'},
    {name:'카테고리 균형',value:kpi4,icon:'⚖️'},
    {name:'지역 커버리지',value:kpi5,icon:'🗺️'},
    {name:'센터 다양성',value:kpi6,icon:'🏢'},
    {name:'접수 활성도',value:kpi7,icon:'📝'},
    {name:'강사 충실도',value:kpi8,icon:'👤'}
  ];
  var weights=[0.14,0.13,0.11,0.12,0.12,0.12,0.13,0.13];
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
    drawHL();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawHL();});

  function drawHL(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('🏥 종합 강좌 데이터 헬스체크',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    var gradeColor=overallGrade==='S'?'#FFD700':overallGrade==='A'?'#10B981':overallGrade==='B'?'#3AAFA9':overallGrade==='C'?'#F59E0B':'#EF4444';
    ctx.fillText('8 KPI 가중평가 | ',10,38);
    ctx.fillStyle=gradeColor;ctx.font='bold 11px sans-serif';
    ctx.fillText('종합등급 '+overallGrade+' ('+overall.toFixed(1)+')',130,38);

    for(var i=0;i<8;i++){
      var kpi=KPIs[i];
      var col=i%4,row=Math.floor(i/4);
      var gx=15+col*152,gy=58+row*168;
      var isHov=(i===hoverIdx);
      var pct=Math.max(0,Math.min(100,kpi.value))/100;

      ctx.fillStyle=isHov?'rgba(16,185,129,0.08)':'rgba(255,255,255,0.02)';
      ctx.strokeStyle=isHov?'rgba(16,185,129,0.3)':'rgba(255,255,255,0.06)';
      ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(gx,gy,145,160,8);ctx.fill();ctx.stroke();

      ctx.fillStyle=isHov?'#10B981':'#d4d4d4';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      ctx.fillText(kpi.icon+' '+kpi.name,gx+72,gy+18);

      var gcx=gx+72,gcy=gy+95,gR=42;
      ctx.beginPath();ctx.arc(gcx,gcy,gR,Math.PI,0);
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=7;ctx.stroke();

      var endA=Math.PI+pct*Math.PI;
      ctx.beginPath();ctx.arc(gcx,gcy,gR,Math.PI,endA);
      var kGrade=kpi.value>=80?'S':kpi.value>=65?'A':kpi.value>=50?'B':kpi.value>=35?'C':'D';
      var kColor=kGrade==='S'?'#FFD700':kGrade==='A'?'#10B981':kGrade==='B'?'#3AAFA9':kGrade==='C'?'#F59E0B':'#EF4444';
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
  drawHL();
}

// ─── 퀴즈 v26 (15문) ────────────────────────────────────────────
var QUIZ26=[
  {q:'키워드 동시출현 네트워크에서 노드 크기가 나타내는 것은?',o:['해당 키워드의 출현 빈도','수강료 금액','강좌 기간','강사 수'],c:0},
  {q:'센터별 가격 전략 포지셔닝 맵에서 &quot;저가다양&quot; 영역은 어떤 센터인가?',o:['평균수강료 낮고 카테고리 많음','평균수강료 높고 카테고리 많음','평균수강료 낮고 카테고리 적음','평균수강료 높고 카테고리 적음'],c:0},
  {q:'강사 멀티센터 활동 분석기의 분석 대상은?',o:['2개 이상 센터에서 가르치는 강사','1개 센터 전속 강사','무자격 강사','온라인 전용 강사'],c:0},
  {q:'3차원 히트맵에서 필터링 가능한 대상(d[5]) 범주에 포함되지 않는 것은?',o:['직장인','성인','어린이','시니어'],c:0},
  {q:'수강료 구간별 효율 분석기에서 가성비 등급 S를 받으려면?',o:['회당단가가 가장 낮아야 함','총수강료가 가장 비싸야 함','강좌 수가 가장 많아야 함','강사가 유명해야 함'],c:0},
  {q:'센터 운영 다각화 트리맵에서 사각형 면적은 무엇을 나타내나요?',o:['강좌 수','수강료','강사 수','건물 면적'],c:0},
  {q:'지역별 카테고리 특화도 지수(LQ)가 1.5 이상이면 의미하는 것은?',o:['해당 지역에서 그 카테고리가 특화됨','전국 평균과 동일함','해당 카테고리가 미발달됨','데이터가 부족함'],c:0},
  {q:'헬스체크 대시보드의 &quot;가격 투명성&quot; KPI는 무엇을 측정하나요?',o:['유효 가격 데이터가 있는 강좌 비율','가격이 가장 저렴한 강좌 수','할인율 평균','무료 강좌 비율'],c:0},
  {q:'LQ(Location Quotient) 공식에서 분자는 무엇인가요?',o:['해당 지역의 카테고리 점유율','전국 카테고리 점유율','총 강좌 수','센터 수'],c:0},
  {q:'헬스체크의 &quot;카테고리 균형&quot;은 어떤 통계 지표를 기반으로 하나요?',o:['지니계수(반전)','평균값','중앙값','표준편차'],c:0},
  {q:'키워드 네트워크의 간선(edge)이 의미하는 것은?',o:['두 키워드가 같은 강좌 제목에 동시 출현','두 키워드가 비슷한 뜻','두 강좌가 같은 시간대','두 센터가 같은 지역'],c:0},
  {q:'3차원 히트맵의 시간대 슬롯 중 첫 번째 구간은?',o:['9-11시','7-9시','11-13시','8-10시'],c:0},
  {q:'수강료 구간에서 &quot;3~5만&quot; 구간의 가격 범위는?',o:['30,001원~50,000원','30,000원~50,000원','35,000원~55,000원','25,000원~45,000원'],c:0},
  {q:'헬스체크의 &quot;시간대 분산도&quot;가 높으면 의미하는 것은?',o:['다양한 시간대에 골고루 강좌가 분포','특정 시간대에 집중','야간 강좌가 많음','주말 강좌가 많음'],c:0},
  {q:'v26 데이터 헬스체크의 종합등급 체계는?',o:['S~D 5단계','A~F 6단계','1~5점','상/중/하 3단계'],c:0}
];

function renderQuiz26(container){
  var qIdx=0,score=0,answered=false;
  function render(){
    if(qIdx>=QUIZ26.length){
      container.innerHTML='<div style="padding:12px;text-align:center"><div style="color:#10B981;font-size:14px;font-weight:bold">🎉 v26 퀴즈 완료!</div><div style="color:#d4d4d4;margin-top:8px;font-size:13px">최종 점수: '+score+'/'+QUIZ26.length+'</div></div>';
      if(score>=10)unlockAchieve26('v26_quiz_master');
      if(score>=15)unlockAchieve26('v26_quiz_perfect');
      return;
    }
    var q=QUIZ26[qIdx];answered=false;
    container.innerHTML='<div style="padding:12px"><div style="color:#8ba4c4;font-size:10px;margin-bottom:4px">Q'+(qIdx+1)+'/'+QUIZ26.length+' | 점수: '+score+'</div>'
      +'<div style="color:var(--text-primary);font-size:12px;font-weight:600;margin-bottom:10px">'+q.q+'</div>'
      +'<div id="v26-quiz-opts" style="display:flex;flex-direction:column;gap:6px">'
      +q.o.map(function(o,i){return'<button style="padding:8px 12px;border-radius:6px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text);cursor:pointer;text-align:left;font-size:11px" data-idx="'+i+'">'+esc(o)+'</button>';}).join('')
      +'</div><div id="v26-quiz-result" style="margin-top:8px;font-size:12px"></div></div>';
    container.querySelectorAll('#v26-quiz-opts button').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(answered)return;answered=true;
        var idx=parseInt(btn.getAttribute('data-idx'));
        if(idx===q.c){score++;btn.style.background='rgba(16,185,129,0.2)';btn.style.borderColor='#10B981';SFX26.play('correct');}
        else{btn.style.background='rgba(239,68,68,0.2)';btn.style.borderColor='#EF4444';
          container.querySelectorAll('#v26-quiz-opts button')[q.c].style.background='rgba(16,185,129,0.2)';
          container.querySelectorAll('#v26-quiz-opts button')[q.c].style.borderColor='#10B981';SFX26.play('wrong');}
        var res=container.querySelector('#v26-quiz-result');
        if(res){
          res.innerHTML='<span style="color:#8ba4c4">현재 점수: '+score+'/'+(qIdx+1)+' &mdash; </span><button id="v26-quiz-next" style="padding:4px 12px;border-radius:4px;border:1px solid #10B981;background:rgba(16,185,129,0.1);color:#10B981;cursor:pointer;font-size:11px">다음 &#9654;</button>';
          container.querySelector('#v26-quiz-next').addEventListener('click',function(){qIdx++;answered=false;render();SFX26.play('open');});
        }
      });
    });
  }
  render();
}

// ─── UI 빌드 ──────────────────────────────────────────────────
function buildV26UI(){
  var root=document.getElementById('root');if(!root)return;

  var hub=document.createElement('div');hub.id='ccf-v26-hub';
  hub.style.cssText='max-width:700px;margin:16px auto;padding:0 12px';
  hub.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,#0a1628,#081e1e);border:1px solid rgba(16,185,129,0.15);border-radius:10px;margin-bottom:10px">'
    +'<div style="color:#10B981;font-weight:bold;font-size:14px">🔬 고급분석허브 v26</div>'
    +'<button id="v26-toggle-all" style="padding:4px 10px;border-radius:4px;border:1px solid rgba(16,185,129,0.3);background:rgba(16,185,129,0.08);color:#10B981;cursor:pointer;font-size:11px">전체 열기/닫기</button></div>';

  SECTIONS26.forEach(function(sec){
    var section=document.createElement('div');section.id=sec.id;
    section.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background 0.2s">'
      +'<span style="font-size:16px">'+sec.icon+'</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">'+esc(sec.title)+'</span>'
      +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
      +'<div id="'+sec.id+'-content" style="display:none"></div>';
    section.querySelector('div').addEventListener('click',function(){
      SFX26.play(sec.sfx);
      var content=document.getElementById(sec.id+'-content');
      if(content.style.display==='none'){
        content.style.display='block';
        if(!content.hasChildNodes())sec.render(content);
        unlockAchieve26(sec.achieve);
      }else content.style.display='none';
      checkAllSections26();
    });
    hub.appendChild(section);
  });

  var quizSection=document.createElement('div');quizSection.id='v26-quiz-section';
  quizSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">&#10067;</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v26 퀴즈 (15문)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
    +'<div id="v26-quiz-content" style="display:none"></div>';
  quizSection.querySelector('div').addEventListener('click',function(){
    SFX26.play('open');
    var qc=document.getElementById('v26-quiz-content');
    if(qc.style.display==='none'){qc.style.display='block';if(!qc.hasChildNodes())renderQuiz26(qc);}
    else qc.style.display='none';
  });
  hub.appendChild(quizSection);

  var achSection=document.createElement('div');
  achSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">&#127942;</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v26 업적 ('+ACHIEVEMENTS_V26.length+'종)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
    +'<div id="v26-ach-content" style="display:none"><div id="v26-ach-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;padding:8px"></div></div>';
  achSection.querySelector('div').addEventListener('click',function(){
    SFX26.play('open');
    var ac=document.getElementById('v26-ach-content');
    ac.style.display=ac.style.display==='none'?'block':'none';
  });
  hub.appendChild(achSection);

  function renderAchievements26(){
    var grid=document.getElementById('v26-ach-grid');if(!grid)return;
    var unlocked=getAchieves26();
    grid.innerHTML=ACHIEVEMENTS_V26.map(function(a){
      var done=unlocked.indexOf(a.id)>=0;
      return'<div style="padding:6px 8px;border-radius:6px;border:1px solid '+(done?'#10B981':'var(--card-border)')+';background:'+(done?'rgba(16,185,129,0.08)':'var(--card-bg)')+';font-size:10px"><div style="color:'+(done?'#10B981':'var(--text-secondary)')+';font-weight:600">'+esc(a.name)+'</div><div style="color:var(--text-muted);font-size:9px;margin-top:2px">'+esc(a.desc)+'</div></div>';
    }).join('');
  }
  renderAchievements26();
  setInterval(renderAchievements26,3000);

  var prevHub=document.getElementById('ccf-v25-hub');
  if(prevHub)prevHub.after(hub);
  else root.appendChild(hub);

  document.getElementById('v26-toggle-all').addEventListener('click',function(){
    SFX26.play('click');
    var allOpen=SECTIONS26.every(function(s){var c=document.getElementById(s.id+'-content');return c&&c.style.display!=='none';});
    SECTIONS26.forEach(function(s){
      var c=document.getElementById(s.id+'-content');
      if(c){
        if(allOpen)c.style.display='none';
        else{c.style.display='block';
          var sec=SECTIONS26.find(function(x){return x.id+'-content'===c.id;});
          if(sec&&!c.hasChildNodes())sec.render(c);
          if(sec)unlockAchieve26(sec.achieve);
        }
      }
    });
    checkAllSections26();
  });

  // ─── 하단 네비게이션 버튼 추가 ─────────────────────────────
  var navInner=document.querySelector('.bottom-nav-inner');
  if(navInner){
    var navLabels=[
      {icon:'🔗',label:'키워드',secId:'v26-keyword'},
      {icon:'💰',label:'포지셔닝',secId:'v26-pricing'},
      {icon:'👨‍🏫',label:'강사',secId:'v26-instructor'},
      {icon:'🧊',label:'히트맵',secId:'v26-heatmap3d'},
      {icon:'⚖️',label:'효율',secId:'v26-efficiency'},
      {icon:'🌳',label:'트리맵',secId:'v26-treemap'},
      {icon:'📍',label:'특화도',secId:'v26-lq'},
      {icon:'🏥',label:'헬스체크',secId:'v26-health'},
      {icon:'❓',label:'퀴즈26',secId:'v26-quiz-section'}
    ];
    navLabels.forEach(function(nl){
      var btn=document.createElement('button');
      btn.className='bottom-nav-btn';
      btn.setAttribute('aria-label','v26 '+nl.label);
      btn.innerHTML='<span>'+nl.icon+'</span><span style="color:#10B981;font-size:8px">'+esc(nl.label)+'</span>';
      btn.addEventListener('click',function(){
        SFX26.play('scroll');
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
    var qt=document.getElementById('v26-quiz-section');
    if(qt){e.preventDefault();qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  var keyMap={'Q':0,'W':1,'E':2,'R':3,'T':4,'Y':5,'U':6,'I':7};
  var upper=e.key.toUpperCase?e.key.toUpperCase():e.key;
  if(keyMap[upper]!==undefined&&keyMap[upper]<SECTIONS26.length){
    e.preventDefault();
    var sec=document.getElementById(SECTIONS26[keyMap[upper]].id);
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
window.__v26patch={renderQuiz:renderQuiz26};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(buildV26UI,3900);});}
else{setTimeout(buildV26UI,3900);}
})();
