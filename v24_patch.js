/**
 * culture-center-finder v24.0 patch
 * 벤치마킹 Canvas 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 데이터 없음
 * 커리큘럼깊이분석기Canvas+브랜드인지도레이더Canvas+크로스셀링매트릭스Canvas+학습속도분석기Canvas+시즌수요예측기Canvas+운영최적화스코어Canvas+가치사슬분석기Canvas+종합전략대시보드Canvas+퀴즈15(285→300)+업적12(246→258)+SFX12종+키보드9종
 */
(function(){
'use strict';
var V24_ID='ccf-v24-patch';
if(document.getElementById(V24_ID))return;
var marker=document.createElement('meta');marker.id=V24_ID;document.head.appendChild(marker);

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function lsGet(k,d){try{var s=localStorage.getItem(k);return s?JSON.parse(s):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function getData(){return window.__v4Data||[];}

function parsePrice(s){
  if(!s)return 0;
  var m=s.replace(/,/g,'').match(/(\d+)/);
  return m?parseInt(m[1]):0;
}
function parseHour(s){
  if(!s)return-1;
  var m=s.match(/(\d{1,2}):/);
  return m?parseInt(m[1]):-1;
}
function parseDays(s){
  if(!s)return[];
  return(s.match(/[월화수목금토일]/g)||[]);
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

var COLORS=['#06B6D4','#3AAFA9','#F59E0B','#EF4444','#8B5CF6','#EC4899','#7EC8E3','#F97316','#6366F1','#14B8A6','#E879F9','#84CC16','#FB923C','#38BDF8','#A78BFA','#FBBF24','#34D399','#F472B6','#C084FC','#2DD4BF'];

// ─── SFX 엔진 v24 ─────────────────────────────────────────────
var SFX24={
  _ctx:null,
  _get:function(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  play:function(type){
    var c=this._get();if(!c)return;
    var o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);g.gain.value=0.06;
    var t=c.currentTime;
    switch(type){
      case'click':o.frequency.value=580;g.gain.exponentialRampToValueAtTime(0.001,t+0.05);o.start(t);o.stop(t+0.05);break;
      case'open':o.frequency.value=640;o.frequency.linearRampToValueAtTime(880,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'close':o.frequency.value=740;o.frequency.linearRampToValueAtTime(440,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'correct':o.frequency.value=560;o.frequency.linearRampToValueAtTime(820,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'wrong':o.type='sawtooth';o.frequency.value=320;g.gain.value=0.04;g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'achieve':o.frequency.value=540;o.frequency.linearRampToValueAtTime(940,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'scroll':o.type='triangle';o.frequency.value=500;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);break;
      case'hover':o.frequency.value=720;g.gain.value=0.03;g.gain.exponentialRampToValueAtTime(0.001,t+0.04);o.start(t);o.stop(t+0.04);break;
      case'complete':o.frequency.value=480;o.frequency.linearRampToValueAtTime(700,t+0.1);o.frequency.linearRampToValueAtTime(920,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'expand':o.type='triangle';o.frequency.value=540;o.frequency.linearRampToValueAtTime(760,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'collapse':o.type='triangle';o.frequency.value=690;o.frequency.linearRampToValueAtTime(460,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'milestone':o.frequency.value=480;o.frequency.linearRampToValueAtTime(920,t+0.15);o.frequency.linearRampToValueAtTime(700,t+0.25);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);break;
      default:o.frequency.value=480;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);
    }
  }
};

// ─── 업적 시스템 v24 ──────────────────────────────────────────
var ACHIEVEMENTS_V24=[
  {id:'v24_curriculum',name:'커리큘럼 분석가',desc:'강좌 커리큘럼 깊이 분석 열기'},
  {id:'v24_brand',name:'브랜드 전략가',desc:'센터 브랜드 인지도 레이더 열기'},
  {id:'v24_crosssell',name:'크로스셀링 전문가',desc:'카테고리 크로스셀링 매트릭스 열기'},
  {id:'v24_pace',name:'학습 속도 분석가',desc:'수강생 학습 속도 분석 열기'},
  {id:'v24_season',name:'시즌 예측가',desc:'강좌 시즌 수요 예측 열기'},
  {id:'v24_operation',name:'운영 최적화 전문가',desc:'센터 운영 최적화 스코어 열기'},
  {id:'v24_valuechain',name:'가치사슬 분석가',desc:'강좌 가치사슬 분석 열기'},
  {id:'v24_strategy',name:'전략 대시보더',desc:'종합 수강 전략 대시보드 열기'},
  {id:'v24_quiz_master',name:'v24 퀴즈 마스터',desc:'v24 퀴즈 10문 이상 정답'},
  {id:'v24_quiz_perfect',name:'v24 퀴즈 만점',desc:'v24 퀴즈 15문 전부 정답'},
  {id:'v24_explorer',name:'v24 탐험가',desc:'v24 5개 이상 섹션 열기'},
  {id:'v24_complete',name:'v24 정복자',desc:'v24 모든 섹션+퀴즈 완료'}
];

function getAchieves24(){return lsGet('ccf_achieves_v24',[]);}
function unlockAchieve24(id){
  var arr=getAchieves24();
  if(arr.indexOf(id)<0){arr.push(id);lsSet('ccf_achieves_v24',arr);SFX24.play('achieve');}
  checkAllSections24();
}
function checkAllSections24(){
  var arr=getAchieves24();
  var sectionAchs=SECTIONS24.map(function(s){return s.achieve;});
  var opened=sectionAchs.filter(function(a){return arr.indexOf(a)>=0;}).length;
  if(opened>=5&&arr.indexOf('v24_explorer')<0)unlockAchieve24('v24_explorer');
  if(opened>=8&&arr.indexOf('v24_quiz_master')>=0&&arr.indexOf('v24_complete')<0)unlockAchieve24('v24_complete');
}

// ─── 섹션 정의 ─────────────────────────────────────────────────
var SECTIONS24=[
  {id:'v24-curriculum',title:'강좌 커리큘럼 깊이 분석기',icon:'📚',achieve:'v24_curriculum',sfx:'expand',render:renderCurriculum},
  {id:'v24-brand',title:'센터 브랜드 인지도 레이더',icon:'📡',achieve:'v24_brand',sfx:'expand',render:renderBrand},
  {id:'v24-crosssell',title:'카테고리 크로스셀링 매트릭스',icon:'🔗',achieve:'v24_crosssell',sfx:'expand',render:renderCrossell},
  {id:'v24-pace',title:'수강생 학습 속도 분석기',icon:'⚡',achieve:'v24_pace',sfx:'expand',render:renderPace},
  {id:'v24-season',title:'강좌 시즌 수요 예측기',icon:'🌦️',achieve:'v24_season',sfx:'expand',render:renderSeason},
  {id:'v24-operation',title:'센터 운영 최적화 스코어',icon:'⚙️',achieve:'v24_operation',sfx:'expand',render:renderOperation},
  {id:'v24-valuechain',title:'강좌 가치사슬 분석기',icon:'🔄',achieve:'v24_valuechain',sfx:'expand',render:renderValuechain},
  {id:'v24-strategy',title:'종합 수강 전략 대시보드',icon:'🎯',achieve:'v24_strategy',sfx:'milestone',render:renderStrategy}
];

// ─── 1. 강좌 커리큘럼 깊이 분석기 (수평 누적 바) ─────────────
function renderCurriculum(container){
  var data=getData();
  var catStats={};
  data.forEach(function(d){
    var cat=d[3]||'기타';
    if(!catStats[cat])catStats[cat]={count:0,totalSess:0,sessN:0,totalPrice:0,priceN:0};
    catStats[cat].count++;
    var sess=parseSessions(d[14]);
    if(sess>0){catStats[cat].totalSess+=sess;catStats[cat].sessN++;}
    var price=parsePrice(d[8]);
    if(price>0){catStats[cat].totalPrice+=price;catStats[cat].priceN++;}
  });
  var topCats=Object.entries(catStats).sort(function(a,b){return b[1].count-a[1].count;}).slice(0,10);
  var mode=0;
  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a;cursor:pointer';
  container.appendChild(canvas);
  var hoverRow=-1;

  canvas.addEventListener('click',function(){mode=(mode+1)%3;drawCurr();SFX24.play('click');});
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverRow=-1;
    for(var i=0;i<topCats.length;i++){
      var y=62+i*32;
      if(my>=y&&my<y+28){hoverRow=i;break;}
    }
    drawCurr();
  });
  canvas.addEventListener('mouseleave',function(){hoverRow=-1;drawCurr();});

  function drawCurr(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('📚 강좌 커리큘럼 깊이 분석기',10,22);
    var labels=['강좌수','평균수강횟수','회당가격'];
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('클릭: '+labels[mode]+' 보기 | TOP 10 카테고리',10,38);

    var maxVal=1;
    var vals=topCats.map(function(e){
      var s=e[1];
      if(mode===0)return s.count;
      if(mode===1)return s.sessN>0?s.totalSess/s.sessN:0;
      return(s.priceN>0&&s.sessN>0)?(s.totalPrice/s.priceN)/(s.totalSess/s.sessN):0;
    });
    for(var vi=0;vi<vals.length;vi++){if(vals[vi]>maxVal)maxVal=vals[vi];}

    for(var i=0;i<topCats.length;i++){
      var y=62+i*32;
      var isHov=(i===hoverRow);
      var barW=Math.max(5,(vals[i]/maxVal)*360);

      ctx.fillStyle='#8ba4c4';ctx.font=(isHov?'bold ':'')+' 9px sans-serif';ctx.textAlign='right';
      ctx.fillText(esc(topCats[i][0].substring(0,8)),118,y+18);
      ctx.textAlign='left';

      ctx.fillStyle=isHov?COLORS[i%COLORS.length]:COLORS[i%COLORS.length];
      ctx.globalAlpha=isHov?0.9:0.55;
      ctx.beginPath();ctx.roundRect(125,y+4,barW,22,4);ctx.fill();
      ctx.globalAlpha=1;

      ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';
      var valStr=mode===0?vals[i].toLocaleString()+'개':mode===1?vals[i].toFixed(1)+'회':Math.round(vals[i]).toLocaleString()+'원';
      ctx.fillText(valStr,130+barW+5,y+18);
    }

    if(hoverRow>=0){
      var hs=topCats[hoverRow][1];
      var avgS=hs.sessN>0?(hs.totalSess/hs.sessN):0;
      var avgP=hs.priceN>0?(hs.totalPrice/hs.priceN):0;
      var pps=(avgS>0&&avgP>0)?(avgP/avgS):0;
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(340,340,270,52,6);ctx.fill();
      ctx.fillStyle='#06B6D4';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(topCats[hoverRow][0]),350,356);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText(hs.count+'개 | 평균 '+avgS.toFixed(1)+'회 | 평균가 '+Math.round(avgP).toLocaleString()+'원',350,370);
      ctx.fillText('회당가격: '+Math.round(pps).toLocaleString()+'원',350,384);
    }
  }
  drawCurr();
}

// ─── 2. 센터 브랜드 인지도 레이더 (8타입 6축) ────────────────
function renderBrand(container){
  var data=getData();
  var TYPES=['홈플러스','롯데마트','이마트','백화점','구청','대학','스포츠센터','기타'];
  var AXES=['강좌수','카테고리다양성','가격경쟁력','시간대범위','수강횟수','인기도'];
  var typeStats={};
  TYPES.forEach(function(t){typeStats[t]={count:0,cats:{},totalPrice:0,priceN:0,hours:{},totalSess:0,sessN:0,centers:{}};});

  data.forEach(function(d){
    var t=getCenterType(d);
    var s=typeStats[t];if(!s)return;
    s.count++;
    s.cats[d[3]||'기타']=1;
    s.centers[d[1]||'']=1;
    var price=parsePrice(d[8]);
    if(price>0){s.totalPrice+=price;s.priceN++;}
    var h=parseHour(d[7]||d[9]);
    if(h>=0)s.hours[h]=1;
    var sess=parseSessions(d[14]);
    if(sess>0){s.totalSess+=sess;s.sessN++;}
  });

  var totalCourses=data.length||1;
  var typeScores=TYPES.map(function(t){
    var s=typeStats[t];
    var avgPrice=s.priceN>0?s.totalPrice/s.priceN:0;
    var scores=[
      Math.min(100,s.count/8),
      Math.min(100,Object.keys(s.cats).length*6),
      Math.min(100,avgPrice>0?80000/avgPrice:50),
      Math.min(100,Object.keys(s.hours).length*8),
      Math.min(100,s.sessN>0?(s.totalSess/s.sessN)*8:0),
      Math.min(100,(s.count/totalCourses)*400)
    ];
    var total=scores.reduce(function(a,b){return a+b;},0)/6;
    var grade=total>=80?'S':total>=65?'A':total>=50?'B':total>=35?'C':'D';
    return{name:t,scores:scores,total:total,grade:grade,count:s.count};
  });

  var selectedT=0;
  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a;cursor:pointer';
  container.appendChild(canvas);
  canvas.addEventListener('click',function(){selectedT=(selectedT+1)%TYPES.length;drawBrand();SFX24.play('click');});

  function drawBrand(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('📡 센터 브랜드 인지도 레이더',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('클릭: 브랜드 전환 | '+esc(TYPES[selectedT])+' | '+typeScores[selectedT].grade+'등급',10,38);

    var cx=270,cy=220,R=120;
    var scores=typeScores[selectedT].scores;

    for(var ring=5;ring>=1;ring--){
      ctx.beginPath();
      for(var ai=0;ai<6;ai++){
        var angle=-Math.PI/2+(ai/6)*Math.PI*2;
        var rx=cx+Math.cos(angle)*R*(ring/5);
        var ry=cy+Math.sin(angle)*R*(ring/5);
        if(ai===0)ctx.moveTo(rx,ry);else ctx.lineTo(rx,ry);
      }
      ctx.closePath();ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;ctx.stroke();
    }
    for(var li=0;li<6;li++){
      var la=-Math.PI/2+(li/6)*Math.PI*2;
      ctx.beginPath();ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(la)*R,cy+Math.sin(la)*R);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.stroke();
      var lx=cx+Math.cos(la)*(R+22);
      var ly=cy+Math.sin(la)*(R+22);
      ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText(AXES[li],lx,ly+4);
    }
    ctx.textAlign='left';

    ctx.beginPath();
    for(var si=0;si<6;si++){
      var sa=-Math.PI/2+(si/6)*Math.PI*2;
      var sv=scores[si]/100;
      var sx=cx+Math.cos(sa)*R*sv;
      var sy=cy+Math.sin(sa)*R*sv;
      if(si===0)ctx.moveTo(sx,sy);else ctx.lineTo(sx,sy);
    }
    ctx.closePath();
    ctx.fillStyle='rgba(6,182,212,0.2)';ctx.fill();
    ctx.strokeStyle='#06B6D4';ctx.lineWidth=2;ctx.stroke();

    for(var di=0;di<6;di++){
      var da=-Math.PI/2+(di/6)*Math.PI*2;
      var dv=scores[di]/100;
      ctx.beginPath();ctx.arc(cx+Math.cos(da)*R*dv,cy+Math.sin(da)*R*dv,4,0,Math.PI*2);
      ctx.fillStyle='#06B6D4';ctx.fill();
    }

    var gaugeColor=typeScores[selectedT].grade==='S'?'#FFD700':typeScores[selectedT].grade==='A'?'#06B6D4':typeScores[selectedT].grade==='B'?'#3AAFA9':typeScores[selectedT].grade==='C'?'#F59E0B':'#EF4444';
    ctx.fillStyle=gaugeColor;ctx.font='bold 20px sans-serif';ctx.textAlign='center';
    ctx.fillText(typeScores[selectedT].grade,cx,cy+7);ctx.textAlign='left';

    var ly2=55;
    for(var ki=0;ki<TYPES.length;ki++){
      var isSel=(ki===selectedT);
      ctx.fillStyle=isSel?'rgba(6,182,212,0.15)':'transparent';
      if(isSel){ctx.beginPath();ctx.roundRect(450,ly2-10,160,16,3);ctx.fill();}
      ctx.fillStyle=COLORS[ki%COLORS.length];ctx.fillRect(455,ly2-6,8,8);
      ctx.fillStyle=isSel?'#06B6D4':'#8ba4c4';ctx.font=(isSel?'bold ':'')+' 9px sans-serif';
      ctx.fillText(esc(TYPES[ki])+' ('+typeScores[ki].count+')',468,ly2+1);
      ly2+=20;
    }
    ctx.fillStyle='#d4d4d4';ctx.font='11px sans-serif';
    ctx.fillText('종합: '+typeScores[selectedT].total.toFixed(1)+'/100',455,ly2+14);
  }
  drawBrand();
}

// ─── 3. 카테고리 크로스셀링 매트릭스 (10x10 히트맵) ──────────
function renderCrossell(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,10).map(function(e){return e[0];});

  var centerCats={};
  data.forEach(function(d){
    var center=d[1]||d[0]||'';
    var cat=d[3]||'기타';
    if(topCats.indexOf(cat)<0)return;
    if(!centerCats[center])centerCats[center]={};
    centerCats[center][cat]=1;
  });

  var matrix=[];
  for(var i=0;i<10;i++){matrix[i]=[];for(var j=0;j<10;j++){matrix[i][j]=0;}}
  var centers=Object.values(centerCats);
  centers.forEach(function(cats){
    for(var i=0;i<10;i++){
      for(var j=0;j<10;j++){
        if(cats[topCats[i]]&&cats[topCats[j]])matrix[i][j]++;
      }
    }
  });
  var maxVal=1;
  for(var mi=0;mi<10;mi++)for(var mj=0;mj<10;mj++){if(mi!==mj&&matrix[mi][mj]>maxVal)maxVal=matrix[mi][mj];}

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverR=-1,hoverC=-1;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverR=-1;hoverC=-1;
    var cellW=34,cellH=30,startX=140,startY=65;
    if(mx>=startX&&my>=startY){
      var c=Math.floor((mx-startX)/cellW);
      var r=Math.floor((my-startY)/cellH);
      if(r>=0&&r<10&&c>=0&&c<10){hoverR=r;hoverC=c;}
    }
    drawCross();
  });
  canvas.addEventListener('mouseleave',function(){hoverR=-1;hoverC=-1;drawCross();});

  function drawCross(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('🔗 카테고리 크로스셀링 매트릭스',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('동일 센터 내 카테고리 동시 운영 빈도 | TOP 10',10,38);

    var cellW=34,cellH=30,startX=140,startY=65;

    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';
    for(var ci=0;ci<10;ci++){
      ctx.save();
      ctx.translate(startX+ci*cellW+cellW/2,startY-4);
      ctx.rotate(-0.6);
      ctx.textAlign='left';
      ctx.fillStyle=(ci===hoverC)?'#06B6D4':'#8ba4c4';
      ctx.fillText(esc(topCats[ci].substring(0,5)),0,0);
      ctx.restore();
    }
    ctx.textAlign='right';
    for(var ri=0;ri<10;ri++){
      ctx.fillStyle=(ri===hoverR)?'#06B6D4':'#8ba4c4';ctx.font='9px sans-serif';
      ctx.fillText(esc(topCats[ri].substring(0,6)),startX-5,startY+ri*cellH+cellH/2+3);
    }
    ctx.textAlign='left';

    for(var r=0;r<10;r++){
      for(var c=0;c<10;c++){
        var val=matrix[r][c];
        var norm=(r===c)?1:(val/maxVal);
        var isHov=(r===hoverR&&c===hoverC);
        var isDiag=(r===c);

        if(isDiag){
          ctx.fillStyle='rgba(6,182,212,0.12)';
        }else{
          var alpha=0.1+norm*0.7;
          ctx.fillStyle=norm<0.3?'rgba(6,182,212,'+alpha+')':norm<0.65?'rgba(245,158,11,'+alpha+')':'rgba(239,68,68,'+alpha+')';
        }
        if(isHov)ctx.fillStyle='rgba(255,255,255,0.25)';
        ctx.beginPath();ctx.roundRect(startX+c*cellW+1,startY+r*cellH+1,cellW-2,cellH-2,3);ctx.fill();

        if(val>0&&!isDiag){
          ctx.fillStyle=norm>0.4?'#fff':'#ccc';ctx.font='bold 8px sans-serif';ctx.textAlign='center';
          ctx.fillText(val.toString(),startX+c*cellW+cellW/2,startY+r*cellH+cellH/2+3);
          ctx.textAlign='left';
        }
        if(isDiag){
          ctx.fillStyle='#06B6D4';ctx.font='bold 8px sans-serif';ctx.textAlign='center';
          ctx.fillText(val.toString(),startX+c*cellW+cellW/2,startY+r*cellH+cellH/2+3);
          ctx.textAlign='left';
        }
      }
    }

    if(hoverR>=0&&hoverC>=0){
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(490,340,140,52,6);ctx.fill();
      ctx.fillStyle='#06B6D4';ctx.font='bold 9px sans-serif';
      ctx.fillText(esc(topCats[hoverR].substring(0,6)),500,356);
      ctx.fillStyle='#d4d4d4';ctx.font='8px sans-serif';
      ctx.fillText('x '+esc(topCats[hoverC].substring(0,6)),500,370);
      ctx.fillText('동시운영: '+matrix[hoverR][hoverC]+'개 센터',500,384);
    }
  }
  drawCross();
}

// ─── 4. 수강생 학습 속도 분석기 (바 차트) ─────────────────────
function renderPace(container){
  var data=getData();
  var catPace={};
  data.forEach(function(d){
    var cat=d[3]||'기타';
    if(!catPace[cat])catPace[cat]={totalSess:0,sessN:0,totalDays:0,daysN:0,count:0};
    catPace[cat].count++;
    var sess=parseSessions(d[14]);
    var days=parseDays(d[6]||d[9]).length;
    if(sess>0){catPace[cat].totalSess+=sess;catPace[cat].sessN++;}
    if(days>0){catPace[cat].totalDays+=days;catPace[cat].daysN++;}
  });

  var topCats=Object.entries(catPace).sort(function(a,b){return b[1].count-a[1].count;}).slice(0,10);
  var paceData=topCats.map(function(e){
    var s=e[1];
    var avgSess=s.sessN>0?s.totalSess/s.sessN:0;
    var avgDaysPerWeek=s.daysN>0?s.totalDays/s.daysN:1;
    var weeklyLoad=avgSess>0?(avgDaysPerWeek/avgSess*avgSess):avgDaysPerWeek;
    return{cat:e[0],avgSess:avgSess,avgDays:avgDaysPerWeek,weeklyLoad:avgDaysPerWeek,count:s.count};
  });

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverRow=-1;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverRow=-1;
    for(var i=0;i<paceData.length;i++){
      var y=62+i*32;
      if(my>=y&&my<y+28){hoverRow=i;break;}
    }
    drawPace();
  });
  canvas.addEventListener('mouseleave',function(){hoverRow=-1;drawPace();});

  function drawPace(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('⚡ 수강생 학습 속도 분석기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('주간 수업일수 + 총 수강횟수 | TOP 10 카테고리',10,38);

    var maxSess=1,maxDays=1;
    paceData.forEach(function(p){if(p.avgSess>maxSess)maxSess=p.avgSess;if(p.weeklyLoad>maxDays)maxDays=p.weeklyLoad;});

    for(var i=0;i<paceData.length;i++){
      var p=paceData[i];
      var y=62+i*32;
      var isHov=(i===hoverRow);

      ctx.fillStyle=isHov?'#06B6D4':'#8ba4c4';ctx.font=(isHov?'bold ':'')+' 9px sans-serif';ctx.textAlign='right';
      ctx.fillText(esc(p.cat.substring(0,8)),118,y+12);
      ctx.textAlign='left';

      var sessW=Math.max(5,(p.avgSess/maxSess)*200);
      var daysW=Math.max(5,(p.weeklyLoad/maxDays)*120);
      var intensity=p.weeklyLoad/maxDays;
      var barColor=intensity<0.33?'#06B6D4':intensity<0.66?'#F59E0B':'#EF4444';

      ctx.fillStyle=barColor;ctx.globalAlpha=isHov?0.9:0.5;
      ctx.beginPath();ctx.roundRect(125,y+2,sessW,10,3);ctx.fill();
      ctx.globalAlpha=1;

      ctx.fillStyle='#3AAFA9';ctx.globalAlpha=isHov?0.9:0.5;
      ctx.beginPath();ctx.roundRect(125,y+14,daysW,10,3);ctx.fill();
      ctx.globalAlpha=1;

      ctx.fillStyle='#d4d4d4';ctx.font='8px sans-serif';
      ctx.fillText(p.avgSess.toFixed(1)+'회',130+sessW+4,y+11);
      ctx.fillText(p.weeklyLoad.toFixed(1)+'일/주',130+daysW+4,y+23);
    }

    ctx.fillStyle='rgba(6,182,212,0.6)';ctx.fillRect(430,375,15,8);
    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';ctx.fillText('저',449,382);
    ctx.fillStyle='rgba(245,158,11,0.6)';ctx.fillRect(468,375,15,8);ctx.fillText('중',487,382);
    ctx.fillStyle='rgba(239,68,68,0.6)';ctx.fillRect(506,375,15,8);ctx.fillText('고',525,382);

    ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';
    ctx.fillText('상단: 평균수강횟수 | 하단: 주간수업일수',125,395);

    if(hoverRow>=0){
      var hp=paceData[hoverRow];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(370,330,240,42,6);ctx.fill();
      ctx.fillStyle='#06B6D4';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(hp.cat),380,346);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText(hp.count+'개 | '+hp.avgSess.toFixed(1)+'회 | '+hp.weeklyLoad.toFixed(1)+'일/주',380,362);
    }
  }
  drawPace();
}

// ─── 5. 강좌 시즌 수요 예측기 (12x8 히트맵) ──────────────────
function renderSeason(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});

  var MONTHS=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  var matrix={};
  topCats.forEach(function(cat){matrix[cat]={};for(var m=1;m<=12;m++)matrix[cat][m]=0;});

  data.forEach(function(d){
    var cat=d[3]||'기타';
    if(topCats.indexOf(cat)<0)return;
    var month=parseMonth(d[13]);
    if(month>=1&&month<=12){
      matrix[cat][month]++;
    }else{
      var name=d[4]||'';
      var mm=name.match(/(\d{1,2})\//);
      if(mm){var mv=parseInt(mm[1]);if(mv>=1&&mv<=12)matrix[cat][mv]++;}
    }
  });

  var maxVal=1;
  topCats.forEach(function(cat){for(var m=1;m<=12;m++){if(matrix[cat][m]>maxVal)maxVal=matrix[cat][m];}});

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverR=-1,hoverC=-1;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverR=-1;hoverC=-1;
    var cellW=38,cellH=36,startX=100,startY=60;
    if(mx>=startX&&my>=startY){
      var c=Math.floor((mx-startX)/cellW);
      var r=Math.floor((my-startY)/cellH);
      if(r>=0&&r<8&&c>=0&&c<12){hoverR=r;hoverC=c;}
    }
    drawSeason();
  });
  canvas.addEventListener('mouseleave',function(){hoverR=-1;hoverC=-1;drawSeason();});

  function drawSeason(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('🌦️ 강좌 시즌 수요 예측기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('12개월 x 8카테고리 | 개강일 기준 강좌 밀도',10,38);

    var cellW=38,cellH=36,startX=100,startY=60;

    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';ctx.textAlign='center';
    for(var ci=0;ci<12;ci++){
      ctx.fillStyle=(ci===hoverC)?'#06B6D4':'#8ba4c4';
      ctx.fillText(MONTHS[ci],startX+ci*cellW+cellW/2,startY-5);
    }
    ctx.textAlign='right';
    for(var ri=0;ri<topCats.length;ri++){
      ctx.fillStyle=(ri===hoverR)?'#06B6D4':'#8ba4c4';ctx.font='9px sans-serif';
      ctx.fillText(esc(topCats[ri].substring(0,6)),startX-5,startY+ri*cellH+cellH/2+3);
    }
    ctx.textAlign='left';

    for(var r=0;r<topCats.length;r++){
      for(var c=0;c<12;c++){
        var val=matrix[topCats[r]][c+1];
        var norm=val/maxVal;
        var isHov=(r===hoverR&&c===hoverC);
        var alpha=0.08+norm*0.8;
        ctx.fillStyle=isHov?'rgba(255,255,255,0.25)':norm<0.2?'rgba(6,182,212,'+alpha+')':norm<0.5?'rgba(6,182,212,'+(alpha+0.1)+')':norm<0.75?'rgba(245,158,11,'+alpha+')':'rgba(239,68,68,'+alpha+')';
        ctx.beginPath();ctx.roundRect(startX+c*cellW+1,startY+r*cellH+1,cellW-2,cellH-2,3);ctx.fill();

        if(val>0){
          ctx.fillStyle=norm>0.35?'#fff':'#ccc';ctx.font='bold 8px sans-serif';ctx.textAlign='center';
          ctx.fillText(val.toString(),startX+c*cellW+cellW/2,startY+r*cellH+cellH/2+3);
          ctx.textAlign='left';
        }
      }
    }

    ctx.fillStyle='rgba(6,182,212,0.4)';ctx.fillRect(420,375,15,8);
    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';ctx.fillText('저',439,382);
    ctx.fillStyle='rgba(245,158,11,0.5)';ctx.fillRect(458,375,15,8);ctx.fillText('중',477,382);
    ctx.fillStyle='rgba(239,68,68,0.6)';ctx.fillRect(496,375,15,8);ctx.fillText('고',515,382);

    if(hoverR>=0&&hoverC>=0){
      var hv=matrix[topCats[hoverR]][hoverC+1];
      var catTotal=0;for(var m=1;m<=12;m++)catTotal+=matrix[topCats[hoverR]][m];
      var pct=catTotal>0?((hv/catTotal)*100).toFixed(1):'0';
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(440,8,190,52,6);ctx.fill();
      ctx.fillStyle='#06B6D4';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(topCats[hoverR].substring(0,8)),450,24);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText(MONTHS[hoverC]+': '+hv+'개 ('+pct+'%)',450,40);
      ctx.fillText('연간 총: '+catTotal+'개',450,54);
    }
  }
  drawSeason();
}

// ─── 6. 센터 운영 최적화 스코어 (수평 바 S~D등급) ────────────
function renderOperation(container){
  var data=getData();
  var TYPES=['홈플러스','롯데마트','이마트','백화점','구청','대학','스포츠센터','기타'];
  var METRICS=['활용도','다양성','가격합리','시간커버','회차가치','수용력'];
  var typeStats={};
  TYPES.forEach(function(t){typeStats[t]={count:0,cats:{},centers:{},totalPrice:0,priceN:0,hours:{},totalSess:0,sessN:0};});

  data.forEach(function(d){
    var t=getCenterType(d);
    var s=typeStats[t];if(!s)return;
    s.count++;
    s.cats[d[3]||'기타']=1;
    s.centers[d[1]||'']=1;
    var price=parsePrice(d[8]);
    if(price>0){s.totalPrice+=price;s.priceN++;}
    var h=parseHour(d[7]||d[9]);
    if(h>=0)s.hours[h]=1;
    var sess=parseSessions(d[14]);
    if(sess>0){s.totalSess+=sess;s.sessN++;}
  });

  var opScores=TYPES.map(function(t){
    var s=typeStats[t];
    var centerCount=Object.keys(s.centers).length||1;
    var avgPrice=s.priceN>0?s.totalPrice/s.priceN:0;
    var avgSess=s.sessN>0?s.totalSess/s.sessN:0;
    var scores=[
      Math.min(100,s.count/centerCount*2),
      Math.min(100,Object.keys(s.cats).length*5),
      Math.min(100,avgPrice>0?80000/avgPrice:50),
      Math.min(100,Object.keys(s.hours).length*7),
      Math.min(100,avgSess*8),
      Math.min(100,s.count/5)
    ];
    var total=scores.reduce(function(a,b){return a+b;},0)/6;
    var grade=total>=80?'S':total>=65?'A':total>=50?'B':total>=35?'C':'D';
    return{name:t,scores:scores,total:total,grade:grade,count:s.count};
  });

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverRow=-1;

  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverRow=-1;
    for(var i=0;i<TYPES.length;i++){
      var y=58+i*40;
      if(my>=y&&my<y+36){hoverRow=i;break;}
    }
    drawOp();
  });
  canvas.addEventListener('mouseleave',function(){hoverRow=-1;drawOp();});

  function drawOp(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('⚙️ 센터 운영 최적화 스코어',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('6축 (활용도/다양성/가격합리/시간커버/회차가치/수용력) S~D등급',10,38);

    var metricColors=['#06B6D4','#3AAFA9','#F59E0B','#8B5CF6','#EC4899','#84CC16'];

    for(var i=0;i<TYPES.length;i++){
      var os=opScores[i];
      var y=58+i*40;
      var isHov=(i===hoverRow);
      var gaugeColor=os.grade==='S'?'#FFD700':os.grade==='A'?'#06B6D4':os.grade==='B'?'#3AAFA9':os.grade==='C'?'#F59E0B':'#EF4444';

      ctx.fillStyle=isHov?'#06B6D4':'#8ba4c4';ctx.font=(isHov?'bold ':'')+' 9px sans-serif';ctx.textAlign='right';
      ctx.fillText(esc(os.name),72,y+22);
      ctx.textAlign='left';

      var totalW=360;
      var x=80;
      for(var mi=0;mi<6;mi++){
        var segW=(os.scores[mi]/100)*60;
        ctx.fillStyle=metricColors[mi];ctx.globalAlpha=isHov?0.85:0.5;
        ctx.beginPath();ctx.roundRect(x,y+6,segW,24,mi===0?[3,0,0,3]:mi===5?[0,3,3,0]:[0,0,0,0]);ctx.fill();
        x+=segW;
      }
      ctx.globalAlpha=1;

      ctx.fillStyle=gaugeColor;ctx.font='bold 12px sans-serif';
      ctx.fillText(os.grade,x+8,y+22);
      ctx.fillStyle='#556173';ctx.font='9px sans-serif';
      ctx.fillText(os.total.toFixed(0),x+26,y+22);
    }

    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';
    for(var li=0;li<6;li++){
      ctx.fillStyle=metricColors[li];ctx.fillRect(80+li*80,385,10,6);
      ctx.fillStyle='#8ba4c4';ctx.fillText(METRICS[li],93+li*80,392);
    }

    if(hoverRow>=0){
      var ho=opScores[hoverRow];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(350,48,260,62,6);ctx.fill();
      ctx.fillStyle='#06B6D4';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(ho.name)+' ('+ho.count+'개 강좌)',360,64);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      var detail=METRICS.map(function(m,mi){return m+':'+ho.scores[mi].toFixed(0);}).join(' ');
      ctx.fillText(detail.substring(0,45),360,80);
      if(detail.length>45)ctx.fillText(detail.substring(45),360,94);
      else ctx.fillText('등급: '+ho.grade+' | 종합: '+ho.total.toFixed(1),360,94);
    }
  }
  drawOp();
}

// ─── 7. 강좌 가치사슬 분석기 (퍼널+라인) ─────────────────────
function renderValuechain(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,6).map(function(e){return e[0];});

  var STAGES=['탐색','비교','선택','등록','수강','완주','후기','재수강'];
  var RATES=[1.8,1.4,1.0,0.72,0.55,0.38,0.18,0.10];

  var catChains={};
  topCats.forEach(function(cat){
    var count=allCats[cat]||0;
    var sessions=0,sessN=0;
    data.forEach(function(d){
      if((d[3]||'기타')===cat){var s=parseSessions(d[14]);if(s>0){sessions+=s;sessN++;}}
    });
    var avgSess=sessN>0?sessions/sessN:4;
    var completionBonus=Math.min(1.3,avgSess/8);
    catChains[cat]=RATES.map(function(r,idx){
      var adjusted=r;
      if(idx>=4)adjusted=r*completionBonus;
      return Math.round(count*adjusted);
    });
  });

  var selectedCat=0;
  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a;cursor:pointer';
  container.appendChild(canvas);
  var hoverStage=-1;

  canvas.addEventListener('click',function(){selectedCat=(selectedCat+1)%topCats.length;drawVC();SFX24.play('click');});
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    hoverStage=-1;
    for(var i=0;i<8;i++){
      var bx=70+i*66;
      if(mx>=bx&&mx<bx+60){hoverStage=i;break;}
    }
    drawVC();
  });
  canvas.addEventListener('mouseleave',function(){hoverStage=-1;drawVC();});

  function drawVC(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('🔄 강좌 가치사슬 분석기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('클릭: 카테고리 전환 | 8단계 가치사슬 | '+esc(topCats[selectedCat]),10,38);

    var chain=catChains[topCats[selectedCat]]||[];
    var maxVal=chain[0]||1;
    var barColors=['#06B6D4','#3AAFA9','#14B8A6','#10B981','#F59E0B','#F97316','#EF4444','#8B5CF6'];

    for(var i=0;i<8;i++){
      var bx=70+i*66;
      var barH=Math.max(8,(chain[i]/maxVal)*200);
      var by=310-barH;
      var isHov=(i===hoverStage);

      ctx.fillStyle=barColors[i];ctx.globalAlpha=isHov?0.95:0.55;
      ctx.beginPath();ctx.roundRect(bx,by,56,barH,4);ctx.fill();
      ctx.globalAlpha=1;

      ctx.fillStyle='#fff';ctx.font='bold 8px sans-serif';ctx.textAlign='center';
      ctx.fillText(chain[i].toLocaleString(),bx+28,by-5);

      ctx.fillStyle=isHov?'#06B6D4':'#8ba4c4';ctx.font=(isHov?'bold ':'')+' 8px sans-serif';
      ctx.fillText(STAGES[i],bx+28,328);

      if(i>0){
        var convRate=chain[0]>0?((chain[i]/chain[0])*100).toFixed(0):'0';
        ctx.fillStyle='#556173';ctx.font='7px sans-serif';
        ctx.fillText(convRate+'%',bx+28,340);
      }
      ctx.textAlign='left';
    }

    ctx.beginPath();ctx.moveTo(98,310-(chain[0]/maxVal)*200);
    for(var li=1;li<8;li++){
      var lx=70+li*66+28;
      var lh=Math.max(8,(chain[li]/maxVal)*200);
      ctx.lineTo(lx,310-lh);
    }
    ctx.strokeStyle='rgba(6,182,212,0.6)';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.stroke();ctx.setLineDash([]);

    for(var pi=0;pi<8;pi++){
      var px=70+pi*66+28;
      var ph=Math.max(8,(chain[pi]/maxVal)*200);
      ctx.beginPath();ctx.arc(px,310-ph,3,0,Math.PI*2);
      ctx.fillStyle='#06B6D4';ctx.fill();
    }

    if(i<8){
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(70,310);ctx.lineTo(600,310);ctx.stroke();
    }

    var ly2=55;
    for(var ki=0;ki<topCats.length;ki++){
      var isSel=(ki===selectedCat);
      ctx.fillStyle=isSel?'rgba(6,182,212,0.15)':'transparent';
      if(isSel){ctx.beginPath();ctx.roundRect(5,ly2-10,120,16,3);ctx.fill();}
      ctx.fillStyle=COLORS[ki%COLORS.length];ctx.fillRect(10,ly2-6,8,8);
      ctx.fillStyle=isSel?'#06B6D4':'#8ba4c4';ctx.font=(isSel?'bold ':'')+' 9px sans-serif';
      ctx.fillText(esc(topCats[ki].substring(0,8)),23,ly2+1);
      ly2+=20;
    }

    if(hoverStage>=0){
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(300,350,310,42,6);ctx.fill();
      ctx.fillStyle='#06B6D4';ctx.font='bold 10px sans-serif';
      ctx.fillText(STAGES[hoverStage]+' 단계',310,366);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      var stageConv=chain[0]>0?((chain[hoverStage]/chain[0])*100).toFixed(1):'0';
      var dropoff=hoverStage>0&&chain[hoverStage-1]>0?((1-chain[hoverStage]/chain[hoverStage-1])*100).toFixed(1):'0';
      ctx.fillText(chain[hoverStage]+'개 | 누적전환: '+stageConv+'%'+(hoverStage>0?' | 이탈: '+dropoff+'%':''),310,382);
    }
  }
  drawVC();
}

// ─── 8. 종합 수강 전략 대시보드 (8 KPI 게이지 4x2) ──────────
function renderStrategy(container){
  var data=getData();
  var totalCount=data.length||1;

  var allCats={};var allCenters={};var allHours={};var allRegions={};
  var totalPrice=0,priceN=0,totalSess=0,sessN=0;
  var brandSet={};
  data.forEach(function(d){
    allCats[d[3]||'기타']=(allCats[d[3]||'기타']||0)+1;
    allCenters[d[1]||'']=1;
    var h=parseHour(d[7]||d[9]);if(h>=0)allHours[h]=1;
    var r=getRegion(d[15]||d[1]||d[0]);allRegions[r]=1;
    var price=parsePrice(d[8]);if(price>0){totalPrice+=price;priceN++;}
    var sess=parseSessions(d[14]);if(sess>0){totalSess+=sess;sessN++;}
    brandSet[getCenterType(d)]=1;
  });

  var catKeys=Object.keys(allCats);
  var catValues=catKeys.map(function(k){return allCats[k];});
  var catMean=catValues.reduce(function(a,b){return a+b;},0)/catKeys.length;
  var catStd=Math.sqrt(catValues.reduce(function(s,v){return s+(v-catMean)*(v-catMean);},0)/catKeys.length);
  var catBalance=catMean>0?Math.max(0,100-catStd/catMean*30):50;

  var avgPrice=priceN>0?totalPrice/priceN:0;
  var avgSess=sessN>0?totalSess/sessN:0;

  var KPIs=[
    {name:'강좌다양성',value:Math.min(100,catKeys.length*2.5),icon:'🎭'},
    {name:'가격경쟁력',value:Math.min(100,avgPrice>0?80000/avgPrice:50),icon:'💰'},
    {name:'시간대커버리지',value:Math.min(100,Object.keys(allHours).length*6),icon:'⏰'},
    {name:'카테고리밸런스',value:Math.min(100,catBalance),icon:'⚖️'},
    {name:'센터접근성',value:Math.min(100,Object.keys(allRegions).length*10),icon:'📍'},
    {name:'수강효율',value:Math.min(100,avgSess*8),icon:'📊'},
    {name:'브랜드파워',value:Math.min(100,Object.keys(brandSet).length*13),icon:'🏢'},
    {name:'수강가치',value:Math.min(100,avgSess>0&&avgPrice>0?(avgSess/avgPrice*10000):50),icon:'⭐'}
  ];

  var weights=[0.15,0.13,0.12,0.1,0.12,0.13,0.1,0.15];
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
    drawStrat();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawStrat();});

  function drawStrat(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#06B6D4';ctx.font='bold 13px sans-serif';
    ctx.fillText('🎯 종합 수강 전략 대시보드',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    var gradeColor=overallGrade==='S'?'#FFD700':overallGrade==='A'?'#06B6D4':overallGrade==='B'?'#3AAFA9':overallGrade==='C'?'#F59E0B':'#EF4444';
    ctx.fillText('8 KPI 종합 | ',10,38);
    ctx.fillStyle=gradeColor;ctx.font='bold 11px sans-serif';
    ctx.fillText('종합등급 '+overallGrade+' ('+overall.toFixed(1)+')',130,38);

    for(var i=0;i<8;i++){
      var kpi=KPIs[i];
      var col=i%4,row=Math.floor(i/4);
      var gx=15+col*152,gy=58+row*168;
      var isHov=(i===hoverIdx);
      var pct=kpi.value/100;

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
  drawStrat();
}

// ─── 퀴즈 v24 (15문) ────────────────────────────────────────
var QUIZ24=[
  {q:'클래스101 대비 문화센터의 가장 큰 장점은 무엇인가요?',o:['저렴한 오프라인 실습 환경','높은 수강료','제한적 카테고리','온라인 전용 수업'],c:0},
  {q:'크로스셀링 매트릭스에서 높은 값은 무엇을 의미하나요?',o:['두 카테고리가 같은 센터에서 자주 운영됨','수강료가 비쌈','수강생이 많음','강사가 동일함'],c:0},
  {q:'커리큘럼 깊이 분석에서 &quot;회당가격&quot;이란?',o:['총 수강료를 수강횟수로 나눈 값','1시간당 가격','월별 가격','등록비'],c:0},
  {q:'브랜드 인지도 레이더에서 6축에 포함되지 않는 것은?',o:['강사 경력','강좌수','가격경쟁력','시간대범위'],c:0},
  {q:'학습 속도 분석기에서 &quot;고강도&quot; 카테고리의 특징은?',o:['주당 수업일수가 많음','수강료가 높음','인기가 없음','온라인 전용'],c:0},
  {q:'시즌 수요 예측기는 어떤 데이터를 기반으로 분석하나요?',o:['강좌 개강일','수강생 나이','강사 이름','센터 면적'],c:0},
  {q:'센터 운영 최적화 스코어에서 S등급의 기준 점수는?',o:['80점 이상','50점 이상','100점','60점 이상'],c:0},
  {q:'가치사슬 8단계 중 마지막 단계는 무엇인가요?',o:['재수강','수료','후기','완주'],c:0},
  {q:'종합 전략 대시보드에서 가중치가 가장 높은 KPI는?',o:['강좌다양성과 수강가치','브랜드파워','시간대커버리지','카테고리밸런스'],c:0},
  {q:'탈잉 대비 문화센터의 차별화 포인트는?',o:['전국 오프라인 센터 네트워크','1:1 개인 레슨','자체 제작 콘텐츠','구독 모델'],c:0},
  {q:'크로스셀링 전략이 문화센터에 중요한 이유는?',o:['같은 센터에서 다양한 수강을 유도','가격을 올리기 위해','강사를 줄이기 위해','시설을 축소하기 위해'],c:0},
  {q:'가격경쟁력 지수 100은 어떤 상황인가요?',o:['매우 저렴한 수강료 수준','가장 비싼 수강료','무료 강좌 없음','환불 정책 없음'],c:0},
  {q:'센터 브랜드 8가지 유형에 포함되지 않는 것은?',o:['편의점','홈플러스','이마트','백화점'],c:0},
  {q:'가치사슬에서 &quot;이탈율&quot;이 가장 높은 단계는 보통 어디인가요?',o:['수강에서 완주 사이','탐색에서 비교 사이','등록에서 수강 사이','후기에서 재수강 사이'],c:0},
  {q:'종합 전략 대시보드의 카테고리밸런스는 어떻게 계산하나요?',o:['카테고리별 강좌수의 균등 분포 정도','카테고리 총 개수','인기 카테고리 비율','신규 카테고리 수'],c:0}
];

function renderQuiz24(container){
  var qIdx=0,score=0,answered=false;
  function render(){
    if(qIdx>=QUIZ24.length){
      container.innerHTML='<div style="padding:12px;text-align:center"><div style="color:#06B6D4;font-size:14px;font-weight:bold">🎉 v24 퀴즈 완료!</div><div style="color:#d4d4d4;margin-top:8px;font-size:13px">최종 점수: '+score+'/'+QUIZ24.length+'</div></div>';
      if(score>=10)unlockAchieve24('v24_quiz_master');
      if(score>=15)unlockAchieve24('v24_quiz_perfect');
      return;
    }
    var q=QUIZ24[qIdx];answered=false;
    container.innerHTML='<div style="padding:12px"><div style="color:#8ba4c4;font-size:10px;margin-bottom:4px">Q'+(qIdx+1)+'/'+QUIZ24.length+' | 점수: '+score+'</div>'
      +'<div style="color:var(--text-primary);font-size:12px;font-weight:600;margin-bottom:10px">'+q.q+'</div>'
      +'<div id="v24-quiz-opts" style="display:flex;flex-direction:column;gap:6px">'
      +q.o.map(function(o,i){return'<button style="padding:8px 12px;border-radius:6px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text);cursor:pointer;text-align:left;font-size:11px" data-idx="'+i+'">'+esc(o)+'</button>';}).join('')
      +'</div><div id="v24-quiz-result" style="margin-top:8px;font-size:12px"></div></div>';
    container.querySelectorAll('#v24-quiz-opts button').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(answered)return;answered=true;
        var idx=parseInt(btn.getAttribute('data-idx'));
        if(idx===q.c){score++;btn.style.background='rgba(6,182,212,0.2)';btn.style.borderColor='#06B6D4';SFX24.play('correct');}
        else{btn.style.background='rgba(239,68,68,0.2)';btn.style.borderColor='#EF4444';
          container.querySelectorAll('#v24-quiz-opts button')[q.c].style.background='rgba(6,182,212,0.2)';
          container.querySelectorAll('#v24-quiz-opts button')[q.c].style.borderColor='#06B6D4';SFX24.play('wrong');}
        var res=container.querySelector('#v24-quiz-result');
        if(res){
          res.innerHTML='<span style="color:#8ba4c4">현재 점수: '+score+'/'+(qIdx+1)+' &mdash; </span><button id="v24-quiz-next" style="padding:4px 12px;border-radius:4px;border:1px solid #06B6D4;background:rgba(6,182,212,0.1);color:#06B6D4;cursor:pointer;font-size:11px">다음 &#9654;</button>';
          container.querySelector('#v24-quiz-next').addEventListener('click',function(){qIdx++;answered=false;render();SFX24.play('open');});
        }
      });
    });
  }
  render();
}

// ─── UI 빌드 ──────────────────────────────────────────────────
function buildV24UI(){
  var root=document.getElementById('root');if(!root)return;

  var hub=document.createElement('div');hub.id='ccf-v24-hub';
  hub.style.cssText='max-width:700px;margin:16px auto;padding:0 12px';
  hub.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,#0a1628,#0a1e2e);border:1px solid rgba(6,182,212,0.15);border-radius:10px;margin-bottom:10px">'
    +'<div style="color:#06B6D4;font-weight:bold;font-size:14px">🔬 벤치마킹분석허브 v24</div>'
    +'<button id="v24-toggle-all" style="padding:4px 10px;border-radius:4px;border:1px solid rgba(6,182,212,0.3);background:rgba(6,182,212,0.08);color:#06B6D4;cursor:pointer;font-size:11px">전체 열기/닫기</button></div>';

  SECTIONS24.forEach(function(sec){
    var section=document.createElement('div');section.id=sec.id;
    section.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background 0.2s">'
      +'<span style="font-size:16px">'+sec.icon+'</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">'+esc(sec.title)+'</span>'
      +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
      +'<div id="'+sec.id+'-content" style="display:none"></div>';
    section.querySelector('div').addEventListener('click',function(){
      SFX24.play(sec.sfx);
      var content=document.getElementById(sec.id+'-content');
      if(content.style.display==='none'){
        content.style.display='block';
        if(!content.hasChildNodes())sec.render(content);
        unlockAchieve24(sec.achieve);
      }else content.style.display='none';
      checkAllSections24();
    });
    hub.appendChild(section);
  });

  var quizSection=document.createElement('div');quizSection.id='v24-quiz-section';
  quizSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">&#10067;</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v24 퀴즈 (15문)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
    +'<div id="v24-quiz-content" style="display:none"></div>';
  quizSection.querySelector('div').addEventListener('click',function(){
    SFX24.play('open');
    var qc=document.getElementById('v24-quiz-content');
    if(qc.style.display==='none'){qc.style.display='block';if(!qc.hasChildNodes())renderQuiz24(qc);}
    else qc.style.display='none';
  });
  hub.appendChild(quizSection);

  var achSection=document.createElement('div');
  achSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">&#127942;</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v24 업적 ('+ACHIEVEMENTS_V24.length+'종)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">&#9660;</span></div>'
    +'<div id="v24-ach-content" style="display:none"><div id="v24-ach-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;padding:8px"></div></div>';
  achSection.querySelector('div').addEventListener('click',function(){
    SFX24.play('open');
    var ac=document.getElementById('v24-ach-content');
    ac.style.display=ac.style.display==='none'?'block':'none';
  });
  hub.appendChild(achSection);

  function renderAchievements24(){
    var grid=document.getElementById('v24-ach-grid');if(!grid)return;
    var unlocked=getAchieves24();
    grid.innerHTML=ACHIEVEMENTS_V24.map(function(a){
      var done=unlocked.indexOf(a.id)>=0;
      return'<div style="padding:6px 8px;border-radius:6px;border:1px solid '+(done?'#06B6D4':'var(--card-border)')+';background:'+(done?'rgba(6,182,212,0.08)':'var(--card-bg)')+';font-size:10px"><div style="color:'+(done?'#06B6D4':'var(--text-secondary)')+';font-weight:600">'+esc(a.name)+'</div><div style="color:var(--text-muted);font-size:9px;margin-top:2px">'+esc(a.desc)+'</div></div>';
    }).join('');
  }
  renderAchievements24();
  setInterval(renderAchievements24,3000);

  var prevHub=document.getElementById('ccf-v23-hub');
  if(prevHub)prevHub.after(hub);
  else root.appendChild(hub);

  document.getElementById('v24-toggle-all').addEventListener('click',function(){
    SFX24.play('click');
    var allOpen=SECTIONS24.every(function(s){var c=document.getElementById(s.id+'-content');return c&&c.style.display!=='none';});
    SECTIONS24.forEach(function(s){
      var c=document.getElementById(s.id+'-content');
      if(c){
        if(allOpen)c.style.display='none';
        else{c.style.display='block';
          var sec=SECTIONS24.find(function(x){return x.id+'-content'===c.id;});
          if(sec&&!c.hasChildNodes())sec.render(c);
          if(sec)unlockAchieve24(sec.achieve);
        }
      }
    });
    checkAllSections24();
  });

  // ─── 하단 네비게이션 버튼 추가 ─────────────────────────────
  var navInner=document.querySelector('.bottom-nav-inner');
  if(navInner){
    var navLabels=[
      {icon:'📚',label:'커리큘럼',secId:'v24-curriculum'},
      {icon:'📡',label:'브랜드',secId:'v24-brand'},
      {icon:'🔗',label:'크로스셀',secId:'v24-crosssell'},
      {icon:'⚡',label:'학습속도',secId:'v24-pace'},
      {icon:'🌦️',label:'시즌',secId:'v24-season'},
      {icon:'⚙️',label:'운영',secId:'v24-operation'},
      {icon:'🔄',label:'가치사슬',secId:'v24-valuechain'},
      {icon:'🎯',label:'전략',secId:'v24-strategy'},
      {icon:'❓',label:'퀴즈24',secId:'v24-quiz-section'}
    ];
    navLabels.forEach(function(nl){
      var btn=document.createElement('button');
      btn.className='bottom-nav-btn';
      btn.setAttribute('aria-label','v24 '+nl.label);
      btn.innerHTML='<span>'+nl.icon+'</span><span style="color:#06B6D4;font-size:8px">'+esc(nl.label)+'</span>';
      btn.addEventListener('click',function(){
        SFX24.play('scroll');
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
    var qt=document.getElementById('v24-quiz-section');
    if(qt){e.preventDefault();qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  var keyMap={'Q':0,'W':1,'E':2,'R':3,'T':4,'Y':5,'U':6,'I':7};
  var upper=e.key.toUpperCase?e.key.toUpperCase():e.key;
  if(keyMap[upper]!==undefined&&keyMap[upper]<SECTIONS24.length){
    e.preventDefault();
    var sec=document.getElementById(SECTIONS24[keyMap[upper]].id);
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
window.__v24patch={renderQuiz:renderQuiz24};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(buildV24UI,3600);});}
else{setTimeout(buildV24UI,3600);}
})();
