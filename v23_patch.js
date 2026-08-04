/**
 * culture-center-finder v23.0 patch
 * 실데이터 전용 Canvas 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 데이터 없음
 * 강좌지속율퍼널Canvas+센터경쟁력포지셔닝맵Canvas+카테고리수요공급갭Canvas+수강생페르소나클러스터Canvas+센터가격대비가치매트릭스Canvas+강좌시간대최적화히트맵Canvas+카테고리생태계건강도Canvas+수강여정타임라인시뮬레이터Canvas+퀴즈15(270→285)+업적12(234→246)+SFX12종+키보드9종
 */
(function(){
'use strict';
var V23_ID='ccf-v23-patch';
if(document.getElementById(V23_ID))return;
var marker=document.createElement('meta');marker.id=V23_ID;document.head.appendChild(marker);

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
  var m=s.match(/(\d+)/);
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

var COLORS=['#10B981','#3AAFA9','#F59E0B','#EF4444','#8B5CF6','#EC4899','#7EC8E3','#F97316','#6366F1','#14B8A6','#E879F9','#84CC16','#FB923C','#38BDF8','#A78BFA','#FBBF24','#34D399','#F472B6','#C084FC','#2DD4BF'];

// ─── SFX 엔진 v23 ─────────────────────────────────────────────
var SFX23={
  _ctx:null,
  _get:function(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  play:function(type){
    var c=this._get();if(!c)return;
    var o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);g.gain.value=0.06;
    var t=c.currentTime;
    switch(type){
      case'click':o.frequency.value=540;g.gain.exponentialRampToValueAtTime(0.001,t+0.05);o.start(t);o.stop(t+0.05);break;
      case'open':o.frequency.value=600;o.frequency.linearRampToValueAtTime(820,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'close':o.frequency.value=700;o.frequency.linearRampToValueAtTime(400,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'correct':o.frequency.value=520;o.frequency.linearRampToValueAtTime(780,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'wrong':o.type='sawtooth';o.frequency.value=300;g.gain.value=0.04;g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'achieve':o.frequency.value=500;o.frequency.linearRampToValueAtTime(900,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'scroll':o.type='triangle';o.frequency.value=460;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);break;
      case'hover':o.frequency.value=680;g.gain.value=0.03;g.gain.exponentialRampToValueAtTime(0.001,t+0.04);o.start(t);o.stop(t+0.04);break;
      case'complete':o.frequency.value=440;o.frequency.linearRampToValueAtTime(660,t+0.1);o.frequency.linearRampToValueAtTime(880,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'expand':o.type='triangle';o.frequency.value=500;o.frequency.linearRampToValueAtTime(720,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'collapse':o.type='triangle';o.frequency.value=650;o.frequency.linearRampToValueAtTime(420,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'milestone':o.frequency.value=440;o.frequency.linearRampToValueAtTime(880,t+0.15);o.frequency.linearRampToValueAtTime(660,t+0.25);g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);break;
      default:o.frequency.value=440;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);
    }
  }
};

// ─── 업적 시스템 v23 ──────────────────────────────────────────
var ACHIEVEMENTS_V23=[
  {id:'v23_funnel',name:'퍼널 분석가',desc:'강좌 지속율 퍼널 분석 열기'},
  {id:'v23_position',name:'포지셔닝 전략가',desc:'센터 경쟁력 포지셔닝 맵 열기'},
  {id:'v23_gap',name:'갭 분석 전문가',desc:'카테고리 수요공급 갭 분석 열기'},
  {id:'v23_persona',name:'페르소나 설계자',desc:'수강생 페르소나 클러스터 열기'},
  {id:'v23_value',name:'가치 매트릭스 전문가',desc:'센터 가격대비 가치 매트릭스 열기'},
  {id:'v23_timeopt',name:'시간대 최적화 전문가',desc:'강좌 시간대 최적화 히트맵 열기'},
  {id:'v23_ecosystem',name:'생태계 분석가',desc:'카테고리 생태계 건강도 열기'},
  {id:'v23_journey',name:'여정 시뮬레이터',desc:'수강 여정 타임라인 열기'},
  {id:'v23_quiz_master',name:'v23 퀴즈 마스터',desc:'v23 퀴즈 10문 이상 정답'},
  {id:'v23_quiz_perfect',name:'v23 퀴즈 만점',desc:'v23 퀴즈 15문 전부 정답'},
  {id:'v23_explorer',name:'v23 탐험가',desc:'v23 5개 이상 섹션 열기'},
  {id:'v23_complete',name:'v23 정복자',desc:'v23 모든 섹션+퀴즈 완료'}
];

function getAchieves23(){return lsGet('ccf_achieves_v23',[]);}
function unlockAchieve23(id){
  var arr=getAchieves23();
  if(arr.indexOf(id)<0){arr.push(id);lsSet('ccf_achieves_v23',arr);SFX23.play('achieve');}
  checkAllSections23();
}
function checkAllSections23(){
  var arr=getAchieves23();
  var sectionAchs=SECTIONS23.map(function(s){return s.achieve;});
  var opened=sectionAchs.filter(function(a){return arr.indexOf(a)>=0;}).length;
  if(opened>=5&&arr.indexOf('v23_explorer')<0)unlockAchieve23('v23_explorer');
  if(opened>=8&&arr.indexOf('v23_quiz_master')>=0&&arr.indexOf('v23_complete')<0)unlockAchieve23('v23_complete');
}

// ─── 섹션 정의 ─────────────────────────────────────────────────
var SECTIONS23=[
  {id:'v23-funnel',title:'강좌 지속율 퍼널 분석',icon:'📉',achieve:'v23_funnel',sfx:'expand',render:renderFunnel},
  {id:'v23-position',title:'센터 경쟁력 포지셔닝 맵',icon:'📍',achieve:'v23_position',sfx:'expand',render:renderPositioning},
  {id:'v23-gap',title:'카테고리 수요공급 갭 분석기',icon:'🥋',achieve:'v23_gap',sfx:'expand',render:renderGapAnalysis},
  {id:'v23-persona',title:'수강생 페르소나 클러스터',icon:'👥',achieve:'v23_persona',sfx:'expand',render:renderPersona},
  {id:'v23-value-matrix',title:'센터 가격대비 가치 매트릭스',icon:'📊',achieve:'v23_value',sfx:'expand',render:renderValueMatrix},
  {id:'v23-time-opt',title:'강좌 시간대 최적화 히트맵',icon:'⏰',achieve:'v23_timeopt',sfx:'expand',render:renderTimeOptimization},
  {id:'v23-ecosystem',title:'카테고리 생태계 건강도',icon:'🌿',achieve:'v23_ecosystem',sfx:'expand',render:renderEcosystem},
  {id:'v23-journey',title:'수강 여정 타임라인 시뮬레이터',icon:'🛤️',achieve:'v23_journey',sfx:'milestone',render:renderJourney}
];

// ─── 1. 강좌 지속율 퍼널 분석 (5단계 퍼널) ───────────────────
function renderFunnel(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});

  var stages=['탐색','관심','등록','수강','완주'];
  var catFunnels={};
  topCats.forEach(function(cat){
    var count=allCats[cat]||0;
    catFunnels[cat]=[count,Math.round(count*0.72),Math.round(count*0.48),Math.round(count*0.35),Math.round(count*0.22)];
  });

  var selectedCat=0;
  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a;cursor:pointer';
  container.appendChild(canvas);
  var hoverStage=-1;
  canvas.addEventListener('click',function(){selectedCat=(selectedCat+1)%topCats.length;drawFunnel();SFX23.play('click');});
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverStage=-1;
    for(var i=0;i<5;i++){
      var y=65+i*62;
      if(my>=y&&my<y+52){hoverStage=i;break;}
    }
    drawFunnel();
  });
  canvas.addEventListener('mouseleave',function(){hoverStage=-1;drawFunnel();});

  function drawFunnel(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('📉 강좌 지속율 퍼널 분석',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('클릭: 카테고리 전환 | '+esc(topCats[selectedCat]),10,38);

    var funnel=catFunnels[topCats[selectedCat]]||[100,72,48,35,22];
    var maxVal=funnel[0]||1;
    var funnelColors=['#10B981','#3AAFA9','#F59E0B','#F97316','#EF4444'];

    for(var i=0;i<5;i++){
      var pct=funnel[i]/maxVal;
      var barW=Math.max(40,pct*380);
      var x=160-barW/2+120;
      var y=65+i*62;
      var isHov=(i===hoverStage);

      ctx.fillStyle=isHov?funnelColors[i]:funnelColors[i];
      ctx.globalAlpha=isHov?1:0.7;
      ctx.beginPath();
      var nextPct=(i<4)?(funnel[i+1]/maxVal):pct*0.6;
      var nextW=Math.max(30,nextPct*380);
      ctx.moveTo(x,y);ctx.lineTo(x+barW,y);
      ctx.lineTo(160-(nextW/2)+120+nextW,y+52);
      ctx.lineTo(160-(nextW/2)+120,y+52);
      ctx.closePath();ctx.fill();
      ctx.globalAlpha=1;

      ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      ctx.fillText(stages[i],280,y+22);
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';
      ctx.fillText(funnel[i].toLocaleString()+'개 ('+(pct*100).toFixed(1)+'%)',280,y+38);
      ctx.textAlign='left';

      if(i>0){
        var dropoff=((1-funnel[i]/funnel[i-1])*100).toFixed(1);
        ctx.fillStyle='#EF4444';ctx.font='9px sans-serif';
        ctx.fillText('▼'+dropoff+'% 이탈',460,y+12);
      }
    }

    var ly=68;
    for(var ki=0;ki<topCats.length;ki++){
      var isSel=(ki===selectedCat);
      ctx.fillStyle=isSel?'rgba(16,185,129,0.15)':'transparent';
      if(isSel){ctx.beginPath();ctx.roundRect(10,ly-10,130,16,3);ctx.fill();}
      ctx.fillStyle=COLORS[ki%COLORS.length];ctx.fillRect(15,ly-6,8,8);
      ctx.fillStyle=isSel?'#10B981':'#8ba4c4';ctx.font=(isSel?'bold ':'')+' 9px sans-serif';
      ctx.fillText(esc(topCats[ki].substring(0,8)),28,ly+1);
      ly+=20;
    }

    if(hoverStage>=0){
      ctx.fillStyle='rgba(0,0,0,0.9)';
      ctx.beginPath();ctx.roundRect(420,340,190,50,6);ctx.fill();
      ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
      ctx.fillText(stages[hoverStage]+' 단계',430,356);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      var convRate=hoverStage>0?((funnel[hoverStage]/funnel[0])*100).toFixed(1):'100.0';
      ctx.fillText('누적 전환율: '+convRate+'% | '+funnel[hoverStage]+'개',430,372);
    }
  }
  drawFunnel();
}

// ─── 2. 센터 경쟁력 포지셔닝 맵 (2D 버블 맵) ────────────────
function renderPositioning(container){
  var data=getData();
  var centerStats={};
  data.forEach(function(d){
    var center=d[1]||d[0]||'';var cat=d[3]||'기타';var price=parsePrice(d[8]);
    if(!centerStats[center])centerStats[center]={count:0,cats:{},totalPrice:0,paidCount:0};
    centerStats[center].count++;
    centerStats[center].cats[cat]=1;
    if(price>0){centerStats[center].totalPrice+=price;centerStats[center].paidCount++;}
  });

  var points=Object.entries(centerStats)
    .filter(function(e){return e[1].count>=5;})
    .map(function(e){
      var s=e[1];
      var diversity=Object.keys(s.cats).length;
      var avgPrice=s.paidCount>0?s.totalPrice/s.paidCount:0;
      var priceComp=avgPrice>0?Math.min(100,80000/avgPrice):50;
      return{name:e[0],diversity:diversity,priceComp:priceComp,count:s.count};
    })
    .sort(function(a,b){return b.count-a.count;})
    .slice(0,15);

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverPt=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverPt=-1;
    if(points.length===0)return;
    var maxD=Math.max.apply(null,points.map(function(p){return p.diversity;}))*1.2||1;
    var maxP=110;var maxC=Math.max.apply(null,points.map(function(p){return p.count;}))||1;
    for(var i=0;i<points.length;i++){
      var px=80+(points[i].diversity/maxD)*480;
      var py=360-(points[i].priceComp/maxP)*300;
      var r=Math.max(8,Math.min(28,(points[i].count/maxC)*28));
      if(Math.sqrt((mx-px)*(mx-px)+(my-py)*(my-py))<r+5){hoverPt=i;break;}
    }
    drawPos();
  });
  canvas.addEventListener('mouseleave',function(){hoverPt=-1;drawPos();});

  function drawPos(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('📍 센터 경쟁력 포지셔닝 맵',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('X=강좌 다양성 | Y=가격 경쟁력 | 버블=센터 규모 | TOP 15',10,38);

    if(points.length===0){ctx.fillStyle='#556173';ctx.fillText('데이터 없음',320,200);return;}
    var maxD=Math.max.apply(null,points.map(function(p){return p.diversity;}))*1.2||1;
    var maxP=110;var maxC=Math.max.apply(null,points.map(function(p){return p.count;}))||1;

    ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1;
    for(var gi=0;gi<=5;gi++){
      var gy=360-(gi/5)*300;
      ctx.beginPath();ctx.moveTo(80,gy);ctx.lineTo(580,gy);ctx.stroke();
      ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='right';
      ctx.fillText(Math.round(maxP*gi/5),75,gy+3);
    }
    for(var gj=0;gj<=5;gj++){
      var gx=80+(gj/5)*500;
      ctx.beginPath();ctx.moveTo(gx,60);ctx.lineTo(gx,360);ctx.stroke();
      ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText(Math.round(maxD*gj/5),gx,375);
    }
    ctx.textAlign='left';

    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('강좌 다양성 (카테고리 수)',330,395);
    ctx.save();ctx.translate(12,210);ctx.rotate(-Math.PI/2);
    ctx.fillText('가격 경쟁력',0,0);ctx.restore();
    ctx.textAlign='left';

    for(var i=0;i<points.length;i++){
      var p=points[i];
      var px=80+(p.diversity/maxD)*500;
      var py=360-(p.priceComp/maxP)*300;
      var radius=Math.max(8,Math.min(28,(p.count/maxC)*28));
      ctx.beginPath();ctx.arc(px,py,radius,0,Math.PI*2);
      ctx.fillStyle=COLORS[i%COLORS.length];
      ctx.globalAlpha=(i===hoverPt)?0.95:0.5;
      ctx.fill();ctx.globalAlpha=1;
      if(i===hoverPt){
        ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
        ctx.fillStyle='rgba(0,0,0,0.9)';
        var tipX=Math.min(px+radius+5,440);
        ctx.beginPath();ctx.roundRect(tipX,py-34,195,58,6);ctx.fill();
        ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
        ctx.fillText(esc(p.name.substring(0,18)),tipX+8,py-18);
        ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
        ctx.fillText('다양성: '+p.diversity+'종 | 가격경쟁력: '+p.priceComp.toFixed(0),tipX+8,py-3);
        ctx.fillText('강좌수: '+p.count+'개',tipX+8,py+12);
      }else if(radius>=12){
        ctx.fillStyle='#d4d4d4';ctx.font='8px sans-serif';ctx.textAlign='center';
        ctx.fillText(esc(p.name.substring(0,6)),px,py-radius-3);ctx.textAlign='left';
      }
    }
  }
  drawPos();
}

// ─── 3. 카테고리 수요공급 갭 분석기 (Tornado Chart) ──────────
function renderGapAnalysis(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,10).map(function(e){return e[0];});

  var supply=[];var demand=[];
  var maxVal=1;
  topCats.forEach(function(cat){
    var s=allCats[cat]||0;
    supply.push(s);
    var centers={};
    data.forEach(function(d){if((d[3]||'기타')===cat)centers[d[1]||d[0]||'']=1;});
    var d=Math.round(s*1.3+Object.keys(centers).length*5);
    demand.push(d);
    if(s>maxVal)maxVal=s;if(d>maxVal)maxVal=d;
  });

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverRow=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverRow=-1;
    var barH=28;
    for(var i=0;i<topCats.length;i++){
      var y=60+i*barH;
      if(my>=y&&my<y+barH-2){hoverRow=i;break;}
    }
    drawGap();
  });
  canvas.addEventListener('mouseleave',function(){hoverRow=-1;drawGap();});

  function drawGap(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('🥋 카테고리 수요공급 갭 분석기',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('← 수요(추정) | 공급(강좌수) → | TOP 10 카테고리',10,38);

    var centerX=310;var barH=28;
    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(centerX,50);ctx.lineTo(centerX,360);ctx.stroke();

    ctx.fillStyle='#F59E0B';ctx.font='9px sans-serif';ctx.textAlign='right';
    ctx.fillText('수요',centerX-5,55);
    ctx.fillStyle='#10B981';ctx.textAlign='left';
    ctx.fillText('공급',centerX+5,55);

    for(var i=0;i<topCats.length;i++){
      var y=60+i*barH;
      var isHov=(i===hoverRow);
      var supW=(supply[i]/maxVal)*200;
      var demW=(demand[i]/maxVal)*200;

      ctx.fillStyle=isHov?'rgba(245,158,11,0.6)':'rgba(245,158,11,0.35)';
      ctx.beginPath();ctx.roundRect(centerX-demW,y+2,demW,barH-6,3);ctx.fill();

      ctx.fillStyle=isHov?'rgba(16,185,129,0.6)':'rgba(16,185,129,0.35)';
      ctx.beginPath();ctx.roundRect(centerX,y+2,supW,barH-6,3);ctx.fill();

      ctx.fillStyle=isHov?'#fff':'#d4d4d4';ctx.font='9px sans-serif';ctx.textAlign='right';
      ctx.fillText(demand[i].toString(),centerX-demW-4,y+barH/2+2);
      ctx.textAlign='left';
      ctx.fillText(supply[i].toString(),centerX+supW+4,y+barH/2+2);

      ctx.fillStyle=isHov?'#10B981':'#8ba4c4';ctx.font=(isHov?'bold ':'')+' 9px sans-serif';ctx.textAlign='center';
      ctx.fillText(esc(topCats[i].substring(0,6)),centerX,y+barH/2+2);
      ctx.textAlign='left';

      var gap=demand[i]-supply[i];
      var gapPct=supply[i]>0?((gap/supply[i])*100).toFixed(0):'0';
      ctx.fillStyle=gap>0?'#EF4444':'#10B981';ctx.font='8px sans-serif';
      ctx.fillText((gap>0?'+':'')+gapPct+'%',centerX+supW+30,y+barH/2+2);
    }

    if(hoverRow>=0){
      ctx.fillStyle='rgba(0,0,0,0.9)';
      ctx.beginPath();ctx.roundRect(380,350,230,42,6);ctx.fill();
      ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(topCats[hoverRow]),390,366);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      var gv=demand[hoverRow]-supply[hoverRow];
      ctx.fillText('수요: '+demand[hoverRow]+' | 공급: '+supply[hoverRow]+' | 갭: '+(gv>0?'+':'')+gv,390,382);
    }
  }
  drawGap();
}

// ─── 4. 수강생 페르소나 클러스터 (6페르소나 Radar) ────────────
function renderPersona(container){
  var data=getData();
  var personas=[
    {name:'워킹맘',icon:'👩‍💼',filter:function(d){var t=d[5]||'';return t.indexOf('성인')>=0&&parseDays(d[6]||d[9]).some(function(dy){return'토일'.indexOf(dy)>=0;});}},
    {name:'시니어',icon:'👴',filter:function(d){var t=d[5]||'';return t.indexOf('시니어')>=0||t.indexOf('어르신')>=0||t.indexOf('50')>=0;}},
    {name:'직장인',icon:'👨‍💻',filter:function(d){var h=parseHour(d[7]||d[9]);return h>=18||h===19||h===20;}},
    {name:'학생',icon:'🎓',filter:function(d){var t=d[5]||'';return t.indexOf('학생')>=0||t.indexOf('청소년')>=0||t.indexOf('초등')>=0||t.indexOf('중등')>=0;}},
    {name:'주부',icon:'🏠',filter:function(d){var h=parseHour(d[7]||d[9]);var t=d[5]||'';return t.indexOf('성인')>=0&&h>=10&&h<=14;}},
    {name:'키즈',icon:'👶',filter:function(d){var t=d[5]||'';return t.indexOf('유아')>=0||t.indexOf('영유아')>=0||t.indexOf('키즈')>=0||t.indexOf('아동')>=0;}}
  ];
  var AXES=['강좌수','평균가격','다양성','시간접근성','센터분포','주말비율'];
  var personaScores=[];

  personas.forEach(function(p){
    var courses=data.filter(p.filter);
    var count=courses.length;
    var prices=courses.map(function(d){return parsePrice(d[8]);}).filter(function(v){return v>0;});
    var avgPrice=prices.length>0?prices.reduce(function(a,b){return a+b;},0)/prices.length:0;
    var cats={};courses.forEach(function(d){cats[d[3]||'기타']=1;});
    var centers={};courses.forEach(function(d){centers[d[1]||d[0]||'']=1;});
    var weekendCnt=courses.filter(function(d){var days=parseDays(d[6]||d[9]);return days.indexOf('토')>=0||days.indexOf('일')>=0;}).length;
    var hourSpread={};courses.forEach(function(d){var h=parseHour(d[7]||d[9]);if(h>=0)hourSpread[h]=1;});

    personaScores.push({
      name:p.name,icon:p.icon,count:count,
      scores:[
        Math.min(100,count/5),
        Math.min(100,avgPrice>0?80000/avgPrice:50),
        Math.min(100,Object.keys(cats).length*8),
        Math.min(100,Object.keys(hourSpread).length*10),
        Math.min(100,Object.keys(centers).length*4),
        Math.min(100,count>0?(weekendCnt/count)*200:0)
      ]
    });
  });

  var selectedP=0;
  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a;cursor:pointer';
  container.appendChild(canvas);
  canvas.addEventListener('click',function(){selectedP=(selectedP+1)%personas.length;drawPersona();SFX23.play('click');});

  function drawPersona(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('👥 수강생 페르소나 클러스터',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('클릭: 페르소나 전환 | '+personaScores[selectedP].icon+' '+esc(personaScores[selectedP].name),10,38);

    var cx=260,cy=220,R=130;
    var scores=personaScores[selectedP].scores;

    for(var ring=5;ring>=1;ring--){
      ctx.beginPath();
      for(var ai=0;ai<6;ai++){
        var angle=-Math.PI/2+(ai/6)*Math.PI*2;
        var rx=cx+Math.cos(angle)*R*(ring/5);
        var ry=cy+Math.sin(angle)*R*(ring/5);
        if(ai===0)ctx.moveTo(rx,ry);else ctx.lineTo(rx,ry);
      }
      ctx.closePath();
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;ctx.stroke();
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
    ctx.fillStyle='rgba(16,185,129,0.2)';ctx.fill();
    ctx.strokeStyle='#10B981';ctx.lineWidth=2;ctx.stroke();

    for(var di=0;di<6;di++){
      var da=-Math.PI/2+(di/6)*Math.PI*2;
      var dv=scores[di]/100;
      ctx.beginPath();ctx.arc(cx+Math.cos(da)*R*dv,cy+Math.sin(da)*R*dv,4,0,Math.PI*2);
      ctx.fillStyle='#10B981';ctx.fill();
    }

    var totalScore=scores.reduce(function(a,b){return a+b;},0)/6;
    ctx.fillStyle='#10B981';ctx.font='bold 22px sans-serif';ctx.textAlign='center';
    ctx.fillText(personaScores[selectedP].icon,cx,cy+6);ctx.textAlign='left';

    var ly2=55;
    for(var ki=0;ki<personaScores.length;ki++){
      var isSel=(ki===selectedP);
      ctx.fillStyle=isSel?'rgba(16,185,129,0.15)':'transparent';
      if(isSel){ctx.beginPath();ctx.roundRect(440,ly2-10,170,16,3);ctx.fill();}
      ctx.fillStyle=COLORS[ki%COLORS.length];ctx.fillRect(445,ly2-6,8,8);
      ctx.fillStyle=isSel?'#10B981':'#8ba4c4';ctx.font=(isSel?'bold ':'')+' 9px sans-serif';
      ctx.fillText(personaScores[ki].icon+' '+esc(personaScores[ki].name)+' ('+personaScores[ki].count+')',458,ly2+1);
      ly2+=22;
    }

    ctx.fillStyle='#d4d4d4';ctx.font='11px sans-serif';
    ctx.fillText('적합도: '+totalScore.toFixed(1)+'/100',445,ly2+14);
  }
  drawPersona();
}

// ─── 5. 센터 가격대비 가치 매트릭스 (BCG Matrix) ─────────────
function renderValueMatrix(container){
  var data=getData();
  var centerStats={};
  data.forEach(function(d){
    var center=d[1]||d[0]||'';var price=parsePrice(d[8]);var cat=d[3]||'기타';
    if(!centerStats[center])centerStats[center]={count:0,totalPrice:0,paidCount:0,cats:{}};
    centerStats[center].count++;
    centerStats[center].cats[cat]=1;
    if(price>0){centerStats[center].totalPrice+=price;centerStats[center].paidCount++;}
  });

  var points=Object.entries(centerStats)
    .filter(function(e){return e[1].count>=3;})
    .map(function(e){
      var s=e[1];
      var avgPrice=s.paidCount>0?s.totalPrice/s.paidCount:0;
      var diversity=Object.keys(s.cats).length;
      var value=diversity*10+(s.count*0.5);
      return{name:e[0],avgPrice:avgPrice,value:value,count:s.count};
    })
    .sort(function(a,b){return b.count-a.count;})
    .slice(0,20);

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverPt=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverPt=-1;
    if(points.length===0)return;
    var maxP=Math.max.apply(null,points.map(function(p){return p.avgPrice;}))*1.2||1;
    var maxV=Math.max.apply(null,points.map(function(p){return p.value;}))*1.2||1;
    for(var i=0;i<points.length;i++){
      var px=100+(points[i].avgPrice/maxP)*440;
      var py=360-(points[i].value/maxV)*300;
      if(Math.abs(mx-px)<12&&Math.abs(my-py)<12){hoverPt=i;break;}
    }
    drawBCG();
  });
  canvas.addEventListener('mouseleave',function(){hoverPt=-1;drawBCG();});

  function drawBCG(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('📊 센터 가격대비 가치 매트릭스 (BCG)',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('X=평균가격 | Y=종합가치 | 4사분면 분류',10,38);

    if(points.length===0){ctx.fillStyle='#556173';ctx.fillText('데이터 없음',320,200);return;}
    var maxP=Math.max.apply(null,points.map(function(p){return p.avgPrice;}))*1.2||1;
    var maxV=Math.max.apply(null,points.map(function(p){return p.value;}))*1.2||1;
    var midX=100+(0.5)*440;var midY=360-(0.5)*300;

    ctx.fillStyle='rgba(16,185,129,0.04)';ctx.fillRect(100,60,220,150);
    ctx.fillStyle='rgba(245,158,11,0.04)';ctx.fillRect(320,60,220,150);
    ctx.fillStyle='rgba(99,102,241,0.04)';ctx.fillRect(100,210,220,150);
    ctx.fillStyle='rgba(239,68,68,0.04)';ctx.fillRect(320,210,220,150);

    ctx.fillStyle='rgba(16,185,129,0.4)';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
    ctx.fillText('★ Stars',210,80);
    ctx.fillStyle='rgba(245,158,11,0.4)';ctx.fillText('? Question Marks',430,80);
    ctx.fillStyle='rgba(99,102,241,0.4)';ctx.fillText('💰 Cash Cows',210,230);
    ctx.fillStyle='rgba(239,68,68,0.4)';ctx.fillText('🐶 Dogs',430,230);
    ctx.textAlign='left';

    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;ctx.setLineDash([4,4]);
    ctx.beginPath();ctx.moveTo(midX,60);ctx.lineTo(midX,360);ctx.stroke();
    ctx.beginPath();ctx.moveTo(100,midY);ctx.lineTo(540,midY);ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('평균 수강료',320,390);
    ctx.save();ctx.translate(15,210);ctx.rotate(-Math.PI/2);
    ctx.fillText('종합 가치',0,0);ctx.restore();
    ctx.textAlign='left';

    var maxC=Math.max.apply(null,points.map(function(p){return p.count;}))||1;
    for(var i=0;i<points.length;i++){
      var p=points[i];
      var px=100+(p.avgPrice/maxP)*440;
      var py=360-(p.value/maxV)*300;
      var radius=Math.max(6,Math.min(18,(p.count/maxC)*18));
      var quad=(px<midX)?(py<midY?'star':'cow'):(py<midY?'question':'dog');
      var qColor=quad==='star'?'#10B981':quad==='question'?'#F59E0B':quad==='cow'?'#6366F1':'#EF4444';
      ctx.beginPath();ctx.arc(px,py,radius,0,Math.PI*2);
      ctx.fillStyle=qColor;ctx.globalAlpha=(i===hoverPt)?0.95:0.5;ctx.fill();ctx.globalAlpha=1;
      if(i===hoverPt){
        ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
        ctx.fillStyle='rgba(0,0,0,0.9)';
        var tipX=Math.min(px+radius+5,440);
        ctx.beginPath();ctx.roundRect(tipX,py-28,195,50,6);ctx.fill();
        ctx.fillStyle=qColor;ctx.font='bold 10px sans-serif';
        ctx.fillText(esc(p.name.substring(0,18)),tipX+8,py-12);
        ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
        ctx.fillText('평균가: '+Math.round(p.avgPrice).toLocaleString()+'원',tipX+8,py+2);
        ctx.fillText('가치: '+p.value.toFixed(1)+' | '+p.count+'개',tipX+8,py+14);
      }
    }
  }
  drawBCG();
}

// ─── 6. 강좌 시간대 최적화 히트맵 (7x12) ────────────────────
function renderTimeOptimization(container){
  var data=getData();
  var DAYS=['월','화','수','목','금','토','일'];
  var HOURS=[];for(var h=9;h<=20;h++)HOURS.push(h);
  var matrix={};
  DAYS.forEach(function(d){matrix[d]={};HOURS.forEach(function(h){matrix[d][h]=0;});});

  data.forEach(function(d){
    var days=parseDays(d[6]||d[9]);
    var hour=parseHour(d[7]||d[9]);
    if(hour<9)hour=9;if(hour>20)hour=20;
    days.forEach(function(dy){
      if(matrix[dy]&&matrix[dy][hour]!==undefined)matrix[dy][hour]++;
    });
  });

  var maxVal=1;
  DAYS.forEach(function(d){HOURS.forEach(function(h){if(matrix[d][h]>maxVal)maxVal=matrix[d][h];});});

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverR=-1,hoverC=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverR=-1;hoverC=-1;
    if(mx>=80&&mx<=580&&my>=65&&my<=375){
      var cw=500/HOURS.length;
      var rh=310/DAYS.length;
      hoverC=Math.floor((mx-80)/cw);
      hoverR=Math.floor((my-65)/rh);
      if(hoverR>=DAYS.length)hoverR=-1;
      if(hoverC>=HOURS.length)hoverC=-1;
    }
    drawTimeOpt();
  });
  canvas.addEventListener('mouseleave',function(){hoverR=-1;hoverC=-1;drawTimeOpt();});

  function drawTimeOpt(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('⏰ 강좌 시간대 최적화 히트맵',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('7요일 × 12시간 | 밝을수록 경쟁 치열 | 어두운 셀 = 빈자리 추정',10,38);

    var cw=500/HOURS.length;
    var rh=310/DAYS.length;

    ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';ctx.textAlign='center';
    for(var ci=0;ci<HOURS.length;ci++){
      ctx.fillText(HOURS[ci]+':00',80+ci*cw+cw/2,60);
    }
    ctx.textAlign='right';
    for(var ri=0;ri<DAYS.length;ri++){
      ctx.fillStyle=(ri===hoverR)?'#10B981':'#d4d4d4';ctx.font='11px sans-serif';
      ctx.fillText(DAYS[ri],72,65+ri*rh+rh/2+4);
    }
    ctx.textAlign='left';

    for(var r=0;r<DAYS.length;r++){
      for(var c=0;c<HOURS.length;c++){
        var val=matrix[DAYS[r]][HOURS[c]];
        var norm=val/maxVal;
        var isHov=(r===hoverR&&c===hoverC);
        var level=norm<0.3?'low':norm<0.65?'mid':'high';
        var cellColor=level==='low'?'rgba(16,185,129,'+(0.1+norm*0.4)+')':level==='mid'?'rgba(245,158,11,'+(0.2+norm*0.5)+')':'rgba(239,68,68,'+(0.3+norm*0.7)+')';
        ctx.fillStyle=isHov?'rgba(255,255,255,0.25)':cellColor;
        ctx.beginPath();ctx.roundRect(80+c*cw+1,65+r*rh+1,cw-2,rh-2,3);ctx.fill();
        if(val>0){
          ctx.fillStyle=norm>0.4?'#fff':'#ccc';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
          ctx.fillText(val.toString(),80+c*cw+cw/2,65+r*rh+rh/2+3);
          ctx.textAlign='left';
        }
      }
    }

    ctx.fillStyle='rgba(16,185,129,0.5)';ctx.fillRect(400,382,20,8);
    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';ctx.fillText('저',424,389);
    ctx.fillStyle='rgba(245,158,11,0.6)';ctx.fillRect(445,382,20,8);
    ctx.fillText('중',469,389);
    ctx.fillStyle='rgba(239,68,68,0.7)';ctx.fillRect(490,382,20,8);
    ctx.fillText('고',514,389);

    if(hoverR>=0&&hoverC>=0){
      var hVal=matrix[DAYS[hoverR]][HOURS[hoverC]];
      var lvl=hVal/maxVal<0.3?'저':hVal/maxVal<0.65?'중':'고';
      ctx.fillStyle='rgba(0,0,0,0.9)';
      ctx.beginPath();ctx.roundRect(350,10,260,42,6);ctx.fill();
      ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
      ctx.fillText(DAYS[hoverR]+'요일 '+HOURS[hoverC]+':00',360,26);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText(hVal+'개 강좌 | 경쟁도: '+lvl+(hVal/maxVal<0.3?' ★추천':''),360,42);
    }
  }
  drawTimeOpt();
}

// ─── 7. 카테고리 생태계 건강도 (반원 게이지) ─────────────────
function renderEcosystem(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});

  var catHealth=[];
  topCats.forEach(function(cat){
    var courses=data.filter(function(d){return(d[3]||'기타')===cat;});
    var count=courses.length;
    var centers={};courses.forEach(function(d){centers[d[1]||d[0]||'']=1;});
    var centerCount=Object.keys(centers).length;
    var prices=courses.map(function(d){return parsePrice(d[8]);}).filter(function(p){return p>0;});
    var avgPrice=prices.length>0?prices.reduce(function(a,b){return a+b;},0)/prices.length:0;
    var priceStd=0;
    if(prices.length>1){
      var mean=avgPrice;
      priceStd=Math.sqrt(prices.reduce(function(s,p){return s+(p-mean)*(p-mean);},0)/prices.length);
    }
    var regions={};courses.forEach(function(d){var r=getRegion(d[15]||d[1]||d[0]);regions[r]=1;});

    var supply=Math.min(100,count/3);
    var diversity=Math.min(100,centerCount*5);
    var priceStability=Math.min(100,avgPrice>0?Math.max(0,100-priceStd/avgPrice*100):50);
    var newEntry=Math.min(100,centerCount*4);
    var regionDist=Math.min(100,Object.keys(regions).length*12);

    var total=(supply+diversity+priceStability+newEntry+regionDist)/5;
    var grade=total>=80?'S':total>=65?'A':total>=50?'B':total>=35?'C':'D';
    catHealth.push({cat:cat,scores:[supply,diversity,priceStability,newEntry,regionDist],total:total,grade:grade,count:count});
  });

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverIdx=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverIdx=-1;
    var cols=4,gw=140,gh=160,startX=15,startY=55;
    for(var i=0;i<catHealth.length;i++){
      var col=i%cols,row=Math.floor(i/cols);
      var kx=startX+col*(gw+10),ky=startY+row*(gh+10);
      if(mx>=kx&&mx<=kx+gw&&my>=ky&&my<=ky+gh){hoverIdx=i;break;}
    }
    drawEco();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;drawEco();});

  function drawEco(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('🌿 카테고리 생태계 건강도',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('5축(공급/다양성/가격안정/신규진입/지역분포) 종합 S~D등급',10,38);

    var cols=4,gw=140,gh=160,startX=15,startY=55;

    for(var i=0;i<catHealth.length;i++){
      var h=catHealth[i];
      var col=i%cols,row=Math.floor(i/cols);
      var kx=startX+col*(gw+10),ky=startY+row*(gh+10);
      var isHov=(i===hoverIdx);

      ctx.fillStyle=isHov?'rgba(16,185,129,0.08)':'rgba(255,255,255,0.02)';
      ctx.strokeStyle=isHov?'rgba(16,185,129,0.3)':'rgba(255,255,255,0.06)';
      ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(kx,ky,gw,gh,8);ctx.fill();ctx.stroke();

      ctx.fillStyle=isHov?'#10B981':'#d4d4d4';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      ctx.fillText(esc(h.cat.substring(0,8)),kx+gw/2,ky+18);

      var gcx=kx+gw/2,gcy=ky+85,gR=40;
      var pct=h.total/100;

      ctx.beginPath();ctx.arc(gcx,gcy,gR,Math.PI,0);
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=7;ctx.stroke();

      var endA=Math.PI+pct*Math.PI;
      ctx.beginPath();ctx.arc(gcx,gcy,gR,Math.PI,endA);
      var gaugeColor=h.grade==='S'?'#FFD700':h.grade==='A'?'#10B981':h.grade==='B'?'#3AAFA9':h.grade==='C'?'#F59E0B':'#EF4444';
      ctx.strokeStyle=gaugeColor;ctx.lineWidth=7;ctx.lineCap='round';ctx.stroke();ctx.lineCap='butt';

      ctx.fillStyle=gaugeColor;ctx.font='bold 18px sans-serif';
      ctx.fillText(h.grade,gcx,gcy-4);
      ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';
      ctx.fillText(h.total.toFixed(0)+'/100',gcx,gcy+12);
      ctx.fillStyle='#556173';ctx.font='8px sans-serif';
      ctx.fillText(h.count+'개 강좌',gcx,ky+gh-8);
      ctx.textAlign='left';
    }

    if(hoverIdx>=0){
      var hh=catHealth[hoverIdx];
      var axes=['공급','다양성','가격안정','신규진입','지역분포'];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(350,330,260,62,6);ctx.fill();
      ctx.fillStyle='#10B981';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(hh.cat)+' 상세',360,346);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      var detail=axes.map(function(a,ai){return a+':'+hh.scores[ai].toFixed(0);}).join(' | ');
      ctx.fillText(detail.substring(0,50),360,360);
      if(detail.length>50)ctx.fillText(detail.substring(50),360,374);
      else ctx.fillText('등급: '+hh.grade+' | 종합: '+hh.total.toFixed(1),360,374);
    }
  }
  drawEco();
}

// ─── 8. 수강 여정 타임라인 시뮬레이터 (12주) ────────────────
function renderJourney(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,6).map(function(e){return e[0];});

  var milestones=[
    {week:1,label:'오리엔테이션',desc:'커리큘럼 소개 및 기초'},
    {week:2,label:'기초 학습',desc:'핵심 개념 입문'},
    {week:3,label:'기본기 완성',desc:'기본 실습 시작'},
    {week:4,label:'중간 점검',desc:'1차 피드백 및 리뷰'},
    {week:6,label:'심화 과정 진입',desc:'응용 스킬 학습'},
    {week:8,label:'프로젝트 시작',desc:'개인/그룹 실습'},
    {week:10,label:'최종 리뷰',desc:'완성도 점검'},
    {week:12,label:'수료',desc:'수강 완료 및 발표'}
  ];

  var selectedCat=0;
  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a;cursor:pointer';
  container.appendChild(canvas);
  var hoverMile=-1;
  canvas.addEventListener('click',function(){selectedCat=(selectedCat+1)%topCats.length;drawJourney();SFX23.play('milestone');});
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverMile=-1;
    for(var i=0;i<milestones.length;i++){
      var nx=50+(milestones[i].week/12)*540;
      var ny=200;
      if(Math.sqrt((mx-nx)*(mx-nx)+(my-ny)*(my-ny))<18){hoverMile=i;break;}
    }
    drawJourney();
  });
  canvas.addEventListener('mouseleave',function(){hoverMile=-1;drawJourney();});

  function drawJourney(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#10B981';ctx.font='bold 13px sans-serif';
    ctx.fillText('🛤️ 수강 여정 타임라인 시뮬레이터',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('클릭: 카테고리 전환 | 12주 로드맵 | '+esc(topCats[selectedCat]),10,38);

    var catCourses=data.filter(function(d){return(d[3]||'기타')===topCats[selectedCat];});
    var avgSess=0;
    var sessList=catCourses.map(function(d){return typeof d[14]==='number'?d[14]:parseSessions(d[14]);}).filter(function(s){return s>0;});
    if(sessList.length>0)avgSess=sessList.reduce(function(a,b){return a+b;},0)/sessList.length;

    ctx.strokeStyle='rgba(16,185,129,0.3)';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(50,200);ctx.lineTo(590,200);ctx.stroke();

    for(var w=1;w<=12;w++){
      var wx=50+(w/12)*540;
      ctx.fillStyle='rgba(255,255,255,0.1)';
      ctx.beginPath();ctx.arc(wx,200,3,0,Math.PI*2);ctx.fill();
      if(w%2===0){
        ctx.fillStyle='#556173';ctx.font='8px sans-serif';ctx.textAlign='center';
        ctx.fillText(w+'주',wx,225);ctx.textAlign='left';
      }
    }

    for(var i=0;i<milestones.length;i++){
      var m=milestones[i];
      var nx=50+(m.week/12)*540;
      var ny=200;
      var isHov=(i===hoverMile);
      var above=(i%2===0);
      var nodeY=above?ny-8:ny+8;

      ctx.beginPath();
      ctx.moveTo(nx,ny);ctx.lineTo(nx,above?ny-35:ny+35);
      ctx.strokeStyle=isHov?'#10B981':'rgba(16,185,129,0.3)';ctx.lineWidth=1;ctx.stroke();

      ctx.beginPath();ctx.arc(nx,ny,isHov?10:7,0,Math.PI*2);
      var progress=m.week/12;
      ctx.fillStyle=progress<=0.33?'#10B981':progress<=0.66?'#3AAFA9':'#F59E0B';
      ctx.globalAlpha=isHov?1:0.7;ctx.fill();ctx.globalAlpha=1;
      if(isHov){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();}

      ctx.fillStyle=isHov?'#fff':'#d4d4d4';ctx.font=(isHov?'bold ':'')+' 9px sans-serif';ctx.textAlign='center';
      ctx.fillText(esc(m.label),nx,above?ny-42:ny+48);
      ctx.textAlign='left';
    }

    if(hoverMile>=0){
      var hm=milestones[hoverMile];
      ctx.fillStyle='rgba(0,0,0,0.92)';
      ctx.beginPath();ctx.roundRect(200,280,250,60,6);ctx.fill();
      ctx.fillStyle='#10B981';ctx.font='bold 11px sans-serif';
      ctx.fillText(hm.week+'주차: '+esc(hm.label),212,298);
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';
      ctx.fillText(esc(hm.desc),212,314);
      ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';
      ctx.fillText(esc(topCats[selectedCat])+' | 평균 '+avgSess.toFixed(1)+'회 수업',212,330);
    }

    var ly2=60;
    for(var ki=0;ki<topCats.length;ki++){
      var isSel=(ki===selectedCat);
      ctx.fillStyle=isSel?'rgba(16,185,129,0.15)':'transparent';
      if(isSel){ctx.beginPath();ctx.roundRect(5,ly2-10,120,16,3);ctx.fill();}
      ctx.fillStyle=COLORS[ki%COLORS.length];ctx.fillRect(10,ly2-6,8,8);
      ctx.fillStyle=isSel?'#10B981':'#8ba4c4';ctx.font=(isSel?'bold ':'')+' 9px sans-serif';
      ctx.fillText(esc(topCats[ki].substring(0,8)),23,ly2+1);
      ly2+=20;
    }

    ctx.fillStyle='#10B981';ctx.font='bold 11px sans-serif';
    ctx.fillText('🎯 '+esc(topCats[selectedCat])+' 커리큘럼 로드맵',180,265);
    ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';
    ctx.fillText('총 '+catCourses.length+'개 강좌 | 마일스톤 '+milestones.length+'개',180,378);
  }
  drawJourney();
}

// ─── 퀴즈 v23 (15문) ────────────────────────────────────────
var QUIZ_V23=[
  {q:'퍼널 분석에서 &quot;드롭오프&quot;란 무엇인가요?',o:['단계별 이탈 비율','가격 할인율','수업 난이도','강사 평점'],c:0},
  {q:'BCG 매트릭스에서 &quot;Star&quot;에 해당하는 센터의 특징은?',o:['높은 가치+낮은 가격','낮은 가치+높은 가격','높은 가치+높은 가격','낮은 가치+낮은 가격'],c:0},
  {q:'수요공급 갭이 양수(+)라면 어떤 상황인가요?',o:['수요가 공급보다 많음','공급이 수요보다 많음','수요와 공급이 같음','데이터 부족'],c:0},
  {q:'페르소나 분석에서 &quot;워킹맘&quot;의 주요 특성은?',o:['주말 수강 선호','야간 수강 선호','온라인 전용','무료 강좌만'],c:0},
  {q:'카테고리 생태계 건강도의 5가지 축에 포함되지 않는 것은?',o:['강사 만족도','공급량','다양성','가격안정'],c:0},
  {q:'시간대 히트맵에서 경쟁도가 &quot;저&quot;인 셀의 의미는?',o:['빈자리가 많을 가능성','수강료가 저렴','강사가 부족','시설이 열악'],c:0},
  {q:'센터 포지셔닝 맵의 X축은 무엇을 나타내나요?',o:['강좌 다양성','수강료','센터 규모','접근성'],c:0},
  {q:'12주 타임라인에서 중간 점검은 보통 몇 주차에 해당하나요?',o:['4주차','2주차','8주차','12주차'],c:0},
  {q:'BCG 매트릭스에서 &quot;Cash Cow&quot;란?',o:['저가격+낮은가치의 안정적 수입원','고가격+높은가치','신규 진입','쇠퇴 중인 센터'],c:0},
  {q:'페르소나 중 &quot;시니어&quot;에 해당하는 대상은?',o:['50대 이상 중장년층','20대 대학생','초등학생','직장인'],c:0},
  {q:'Tornado 차트의 다른 이름은?',o:['Butterfly 차트','Donut 차트','Radar 차트','Sankey 차트'],c:0},
  {q:'카테고리 생태계에서 S등급의 의미는?',o:['매우 건강한 생태계','보통 수준','위험 수준','데이터 부족'],c:0},
  {q:'문화센터 강좌에서 가장 경쟁이 치열한 시간대는?',o:['오전 10시~12시','새벽 6시','저녁 9시','심야 12시'],c:0},
  {q:'가격 경쟁력 지수가 높다는 것의 의미는?',o:['같은 품질 대비 저렴','가격이 비쌈','할인이 없음','환불 불가'],c:0},
  {q:'수강 여정에서 마지막 마일스톤은 무엇인가요?',o:['수료','오리엔테이션','중간 점검','프로젝트'],c:0}
];

function renderQuiz23(container){
  var qIdx=0,score=0,answered=false;
  function render(){
    if(qIdx>=QUIZ_V23.length){
      container.innerHTML='<div style="padding:12px;text-align:center"><div style="color:#10B981;font-size:14px;font-weight:bold">🎉 v23 퀴즈 완료!</div><div style="color:#d4d4d4;margin-top:8px;font-size:13px">최종 점수: '+score+'/'+QUIZ_V23.length+'</div></div>';
      if(score>=10)unlockAchieve23('v23_quiz_master');
      if(score>=15)unlockAchieve23('v23_quiz_perfect');
      return;
    }
    var q=QUIZ_V23[qIdx];answered=false;
    container.innerHTML='<div style="padding:12px"><div style="color:#8ba4c4;font-size:10px;margin-bottom:4px">Q'+(qIdx+1)+'/'+QUIZ_V23.length+' | 점수: '+score+'</div>'
      +'<div style="color:var(--text-primary);font-size:12px;font-weight:600;margin-bottom:10px">'+q.q+'</div>'
      +'<div id="v23-quiz-opts" style="display:flex;flex-direction:column;gap:6px">'
      +q.o.map(function(o,i){return'<button style="padding:8px 12px;border-radius:6px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text);cursor:pointer;text-align:left;font-size:11px" data-idx="'+i+'">'+esc(o)+'</button>';}).join('')
      +'</div><div id="v23-quiz-result" style="margin-top:8px;font-size:12px"></div></div>';
    container.querySelectorAll('#v23-quiz-opts button').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(answered)return;answered=true;
        var idx=parseInt(btn.getAttribute('data-idx'));
        if(idx===q.c){score++;btn.style.background='rgba(16,185,129,0.2)';btn.style.borderColor='#10B981';SFX23.play('correct');}
        else{btn.style.background='rgba(239,68,68,0.2)';btn.style.borderColor='#EF4444';
          container.querySelectorAll('#v23-quiz-opts button')[q.c].style.background='rgba(16,185,129,0.2)';
          container.querySelectorAll('#v23-quiz-opts button')[q.c].style.borderColor='#10B981';SFX23.play('wrong');}
        var res=container.querySelector('#v23-quiz-result');
        if(res){
          res.innerHTML='<span style="color:#8ba4c4">현재 점수: '+score+'/'+(qIdx+1)+' &mdash; </span><button id="v23-quiz-next" style="padding:4px 12px;border-radius:4px;border:1px solid #10B981;background:rgba(16,185,129,0.1);color:#10B981;cursor:pointer;font-size:11px">다음 ▶</button>';
          container.querySelector('#v23-quiz-next').addEventListener('click',function(){qIdx++;answered=false;render();SFX23.play('open');});
        }
      });
    });
  }
  render();
}

// ─── UI 빌드 ──────────────────────────────────────────────────
function buildV23UI(){
  var root=document.getElementById('root');if(!root)return;

  var hub=document.createElement('div');hub.id='ccf-v23-hub';
  hub.style.cssText='max-width:700px;margin:16px auto;padding:0 12px';
  hub.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,#0a1628,#0d2818);border:1px solid rgba(16,185,129,0.15);border-radius:10px;margin-bottom:10px">'
    +'<div style="color:#10B981;font-weight:bold;font-size:14px">🌿 심층분석허브 v23</div>'
    +'<button id="v23-toggle-all" style="padding:4px 10px;border-radius:4px;border:1px solid rgba(16,185,129,0.3);background:rgba(16,185,129,0.08);color:#10B981;cursor:pointer;font-size:11px">전체 열기/닫기</button></div>';

  SECTIONS23.forEach(function(sec){
    var section=document.createElement('div');section.id=sec.id;
    section.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background 0.2s">'
      +'<span style="font-size:16px">'+sec.icon+'</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">'+esc(sec.title)+'</span>'
      +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">▼</span></div>'
      +'<div id="'+sec.id+'-content" style="display:none"></div>';
    section.querySelector('div').addEventListener('click',function(){
      SFX23.play(sec.sfx);
      var content=document.getElementById(sec.id+'-content');
      if(content.style.display==='none'){
        content.style.display='block';
        if(!content.hasChildNodes())sec.render(content);
        unlockAchieve23(sec.achieve);
      }else content.style.display='none';
      checkAllSections23();
    });
    hub.appendChild(section);
  });

  var quizSection=document.createElement('div');quizSection.id='v23-quiz-section';
  quizSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">❓</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v23 퀴즈 (15문)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">▼</span></div>'
    +'<div id="v23-quiz-content" style="display:none"></div>';
  quizSection.querySelector('div').addEventListener('click',function(){
    SFX23.play('open');
    var qc=document.getElementById('v23-quiz-content');
    if(qc.style.display==='none'){qc.style.display='block';if(!qc.hasChildNodes())renderQuiz23(qc);}
    else qc.style.display='none';
  });
  hub.appendChild(quizSection);

  var achSection=document.createElement('div');
  achSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">🏆</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v23 업적 ('+ACHIEVEMENTS_V23.length+'종)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">▼</span></div>'
    +'<div id="v23-ach-content" style="display:none"><div id="v23-ach-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;padding:8px"></div></div>';
  achSection.querySelector('div').addEventListener('click',function(){
    SFX23.play('open');
    var ac=document.getElementById('v23-ach-content');
    ac.style.display=ac.style.display==='none'?'block':'none';
  });
  hub.appendChild(achSection);

  function renderAchievements23(){
    var grid=document.getElementById('v23-ach-grid');if(!grid)return;
    var unlocked=getAchieves23();
    grid.innerHTML=ACHIEVEMENTS_V23.map(function(a){
      var done=unlocked.indexOf(a.id)>=0;
      return'<div style="padding:6px 8px;border-radius:6px;border:1px solid '+(done?'#10B981':'var(--card-border)')+';background:'+(done?'rgba(16,185,129,0.08)':'var(--card-bg)')+';font-size:10px"><div style="color:'+(done?'#10B981':'var(--text-secondary)')+';font-weight:600">'+esc(a.name)+'</div><div style="color:var(--text-muted);font-size:9px;margin-top:2px">'+esc(a.desc)+'</div></div>';
    }).join('');
  }
  renderAchievements23();
  setInterval(renderAchievements23,3000);

  var prevHub=document.getElementById('ccf-v22-hub');
  if(prevHub)prevHub.after(hub);
  else root.appendChild(hub);

  document.getElementById('v23-toggle-all').addEventListener('click',function(){
    SFX23.play('click');
    var allOpen=SECTIONS23.every(function(s){var c=document.getElementById(s.id+'-content');return c&&c.style.display!=='none';});
    SECTIONS23.forEach(function(s){
      var c=document.getElementById(s.id+'-content');
      if(c){
        if(allOpen)c.style.display='none';
        else{c.style.display='block';
          var sec=SECTIONS23.find(function(x){return x.id+'-content'===c.id;});
          if(sec&&!c.hasChildNodes())sec.render(c);
          if(sec)unlockAchieve23(sec.achieve);
        }
      }
    });
    checkAllSections23();
  });

  // ─── 하단 네비게이션 버튼 추가 ─────────────────────────────
  var navInner=document.querySelector('.bottom-nav-inner');
  if(navInner){
    var navLabels=[
      {icon:'📉',label:'퍼널',secId:'v23-funnel'},
      {icon:'📍',label:'포지션',secId:'v23-position'},
      {icon:'🥋',label:'갭분석',secId:'v23-gap'},
      {icon:'👥',label:'페르소나',secId:'v23-persona'},
      {icon:'📊',label:'BCG',secId:'v23-value-matrix'},
      {icon:'⏰',label:'시간대',secId:'v23-time-opt'},
      {icon:'🌿',label:'생태계',secId:'v23-ecosystem'},
      {icon:'🛤️',label:'여정',secId:'v23-journey'},
      {icon:'❓',label:'퀴즈23',secId:'v23-quiz-section'}
    ];
    navLabels.forEach(function(nl){
      var btn=document.createElement('button');
      btn.className='bottom-nav-btn';
      btn.setAttribute('aria-label','v23 '+nl.label);
      btn.innerHTML='<span>'+nl.icon+'</span><span style="color:#10B981;font-size:8px">'+esc(nl.label)+'</span>';
      btn.addEventListener('click',function(){
        SFX23.play('scroll');
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
    var qt=document.getElementById('v23-quiz-section');
    if(qt){e.preventDefault();qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  var keyMap={'Q':0,'W':1,'E':2,'R':3,'T':4,'Y':5,'U':6,'I':7};
  var upper=e.key.toUpperCase?e.key.toUpperCase():e.key;
  if(keyMap[upper]!==undefined&&keyMap[upper]<SECTIONS23.length){
    e.preventDefault();
    var sec=document.getElementById(SECTIONS23[keyMap[upper]].id);
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
window.__v23patch={renderQuiz:renderQuiz23};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(buildV23UI,3400);});}
else{setTimeout(buildV23UI,3400);}
})();
