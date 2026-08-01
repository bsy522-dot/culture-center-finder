/**
 * culture-center-finder v22.0 patch
 * 실데이터 전용 Canvas 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 데이터 없음
 * 카테고리시장점유율도넛Canvas+강좌가격탄력성산점도Canvas+센터접근효율매트릭스Canvas+멀티카테고리수강패턴네트워크Canvas+센터충성도랭킹Canvas+강좌포화도히트맵Canvas+수강ROI시뮬레이터RadarCanvas+종합시장인텔리전스게이지Canvas+퀴즈15(255→270)+업적12(222→234)+SFX12종+키보드9종
 */
(function(){
'use strict';
var V22_ID='ccf-v22-patch';
if(document.getElementById(V22_ID))return;
var marker=document.createElement('meta');marker.id=V22_ID;document.head.appendChild(marker);

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

var COLORS=['#7EC8E3','#3AAFA9','#F59E0B','#EF4444','#8B5CF6','#EC4899','#10B981','#F97316','#6366F1','#14B8A6','#E879F9','#84CC16','#FB923C','#38BDF8','#A78BFA','#FBBF24','#34D399','#F472B6','#C084FC','#2DD4BF'];

var CTYPES=['대형마트','백화점','아울렛','시민대학','여성능력개발원','50플러스','경기평생학습','K-MOOC'];

// ─── SFX 엔진 v22 ─────────────────────────────────────────────
var SFX22={
  _ctx:null,
  _get:function(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  play:function(type){
    var c=this._get();if(!c)return;
    var o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);g.gain.value=0.06;
    var t=c.currentTime;
    switch(type){
      case'click':o.frequency.value=520;g.gain.exponentialRampToValueAtTime(0.001,t+0.05);o.start(t);o.stop(t+0.05);break;
      case'open':o.frequency.value=580;o.frequency.linearRampToValueAtTime(800,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'market':o.type='triangle';o.frequency.value=460;o.frequency.linearRampToValueAtTime(620,t+0.1);o.frequency.linearRampToValueAtTime(540,t+0.18);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'elastic':o.frequency.value=380;o.frequency.linearRampToValueAtTime(560,t+0.08);o.frequency.linearRampToValueAtTime(470,t+0.16);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);o.start(t);o.stop(t+0.18);break;
      case'access':o.type='triangle';o.frequency.value=500;o.frequency.linearRampToValueAtTime(700,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'multi':o.frequency.value=440;o.frequency.linearRampToValueAtTime(660,t+0.1);o.frequency.linearRampToValueAtTime(550,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.22);o.start(t);o.stop(t+0.22);break;
      case'loyalty':o.type='sawtooth';o.frequency.value=360;g.gain.value=0.04;o.frequency.linearRampToValueAtTime(520,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.14);o.start(t);o.stop(t+0.14);break;
      case'saturation':o.type='square';o.frequency.value=480;g.gain.value=0.03;o.frequency.linearRampToValueAtTime(600,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'roi':o.frequency.value=550;o.frequency.linearRampToValueAtTime(750,t+0.1);o.frequency.linearRampToValueAtTime(650,t+0.18);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'intel':o.type='triangle';o.frequency.value=420;o.frequency.linearRampToValueAtTime(680,t+0.15);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);o.start(t);o.stop(t+0.18);break;
      case'quiz22':o.frequency.value=600;o.frequency.linearRampToValueAtTime(800,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'achieve22':o.frequency.value=500;o.frequency.linearRampToValueAtTime(900,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      default:o.frequency.value=440;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);
    }
  }
};

// ─── 업적 시스템 v22 ──────────────────────────────────────────
var ACHIEVEMENTS_V22=[
  {id:'v22_market',name:'시장 분석가',desc:'카테고리 시장점유율 열기'},
  {id:'v22_elastic',name:'가격 전문가',desc:'가격 탄력성 분석 열기'},
  {id:'v22_access',name:'접근 효율 전략가',desc:'센터 접근 효율 분석 열기'},
  {id:'v22_multi',name:'멀티수강 탐험가',desc:'멀티카테고리 수강 패턴 열기'},
  {id:'v22_loyalty',name:'충성도 분석가',desc:'센터 충성도 랭킹 열기'},
  {id:'v22_saturation',name:'포화도 감별사',desc:'강좌 포화도 히트맵 열기'},
  {id:'v22_roi',name:'ROI 전략가',desc:'수강 ROI 시뮬레이터 열기'},
  {id:'v22_intel',name:'시장 인텔리전스',desc:'종합 시장 인텔리전스 열기'},
  {id:'v22_quiz_master',name:'v22 퀴즈 마스터',desc:'v22 퀴즈 10문 이상 정답'},
  {id:'v22_quiz_perfect',name:'v22 퀴즈 만점',desc:'v22 퀴즈 15문 전부 정답'},
  {id:'v22_explorer',name:'v22 탐험가',desc:'v22 5개 이상 섹션 열기'},
  {id:'v22_complete',name:'v22 정복자',desc:'v22 모든 섹션+퀴즈 완료'}
];

function getAchieves22(){return lsGet('ccf_achieves_v22',[]);}
function unlockAchieve22(id){
  var arr=getAchieves22();
  if(arr.indexOf(id)<0){arr.push(id);lsSet('ccf_achieves_v22',arr);SFX22.play('achieve22');}
  checkAllSections22();
}
function checkAllSections22(){
  var arr=getAchieves22();
  var sectionAchs=SECTIONS22.map(function(s){return s.achieve;});
  var opened=sectionAchs.filter(function(a){return arr.indexOf(a)>=0;}).length;
  if(opened>=5&&arr.indexOf('v22_explorer')<0)unlockAchieve22('v22_explorer');
  if(opened>=8&&arr.indexOf('v22_quiz_master')>=0&&arr.indexOf('v22_complete')<0)unlockAchieve22('v22_complete');
}

// ─── 섹션 정의 ─────────────────────────────────────────────────
var SECTIONS22=[
  {id:'v22-market',title:'카테고리 시장점유율 분석',icon:'🥧',achieve:'v22_market',sfx:'market',render:renderMarketShare},
  {id:'v22-elastic',title:'강좌 가격 탄력성 분석기',icon:'📈',achieve:'v22_elastic',sfx:'elastic',render:renderPriceElasticity},
  {id:'v22-access',title:'센터 접근 효율 매트릭스',icon:'🏢',achieve:'v22_access',sfx:'access',render:renderAccessEfficiency},
  {id:'v22-multi',title:'멀티카테고리 수강 패턴',icon:'🔀',achieve:'v22_multi',sfx:'multi',render:renderMultiCategory},
  {id:'v22-loyalty',title:'센터 충성도 랭킹',icon:'💎',achieve:'v22_loyalty',sfx:'loyalty',render:renderLoyaltyRanking},
  {id:'v22-saturation',title:'강좌 포화도 히트맵',icon:'🗺️',achieve:'v22_saturation',sfx:'saturation',render:renderSaturationHeatmap},
  {id:'v22-roi',title:'수강 ROI 시뮬레이터',icon:'💰',achieve:'v22_roi',sfx:'roi',render:renderROISimulator},
  {id:'v22-intel',title:'종합 시장 인텔리전스',icon:'🧠',achieve:'v22_intel',sfx:'intel',render:renderMarketIntelligence}
];

// ─── 1. 카테고리 시장점유율 분석 (도넛 차트) ──────────────────
function renderMarketShare(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var sorted=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];});
  var top12=sorted.slice(0,12);
  var otherCount=sorted.slice(12).reduce(function(s,e){return s+e[1];},0);
  if(otherCount>0)top12.push(['기타(나머지)',otherCount]);
  var total=top12.reduce(function(s,e){return s+e[1];},0);

  var mode=0;
  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a;cursor:pointer';
  container.appendChild(canvas);

  var hoverIdx=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    var cx=200,cy=200,ro=140,ri=70;
    var dx=mx-cx,dy=my-cy,dist=Math.sqrt(dx*dx+dy*dy);
    hoverIdx=-1;
    if(dist>=ri&&dist<=ro){
      var angle=Math.atan2(dy,dx);if(angle<0)angle+=Math.PI*2;
      var cumAngle=-Math.PI/2;
      for(var i=0;i<top12.length;i++){
        var sliceAngle=(top12[i][1]/total)*Math.PI*2;
        var startA=cumAngle;if(startA<0)startA+=Math.PI*2;
        var endA=cumAngle+sliceAngle;if(endA<0)endA+=Math.PI*2;
        cumAngle+=sliceAngle;
        var normStart=startA;while(normStart<0)normStart+=Math.PI*2;
        var normEnd=normStart+sliceAngle;
        if(angle>=normStart&&angle<normEnd){hoverIdx=i;break;}
      }
    }
    draw();
  });
  canvas.addEventListener('mouseleave',function(){hoverIdx=-1;draw();});
  canvas.addEventListener('click',function(){mode=(mode+1)%2;draw();SFX22.play('market');});

  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#7EC8E3';ctx.font='bold 13px sans-serif';
    ctx.fillText('🥧 카테고리 시장점유율'+(mode===0?' (전체)':' (센터유형별)'),10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('클릭: 모드 전환 | 총 '+total.toLocaleString()+'개 강좌',10,38);

    var cx=200,cy=210,ro=140,ri=70;
    var startAngle=-Math.PI/2;
    for(var i=0;i<top12.length;i++){
      var sliceAngle=(top12[i][1]/total)*Math.PI*2;
      var isHover=(i===hoverIdx);
      ctx.beginPath();
      if(isHover){
        var midA=startAngle+sliceAngle/2;
        ctx.arc(cx+Math.cos(midA)*8,cy+Math.sin(midA)*8,ro+4,startAngle,startAngle+sliceAngle);
        ctx.arc(cx+Math.cos(midA)*8,cy+Math.sin(midA)*8,ri-2,startAngle+sliceAngle,startAngle,true);
      }else{
        ctx.arc(cx,cy,ro,startAngle,startAngle+sliceAngle);
        ctx.arc(cx,cy,ri,startAngle+sliceAngle,startAngle,true);
      }
      ctx.closePath();
      ctx.fillStyle=COLORS[i%COLORS.length];
      ctx.globalAlpha=isHover?1:0.85;
      ctx.fill();
      ctx.globalAlpha=1;
      startAngle+=sliceAngle;
    }

    ctx.fillStyle='#d4d4d4';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
    ctx.fillText(total.toLocaleString(),cx,cy-4);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('총 강좌',cx,cy+12);
    ctx.textAlign='left';

    var ly=52;
    for(var j=0;j<top12.length;j++){
      var pct=(top12[j][1]/total*100).toFixed(1);
      ctx.fillStyle=COLORS[j%COLORS.length];
      ctx.fillRect(380,ly,10,10);
      ctx.fillStyle=(j===hoverIdx)?'#fff':'#d4d4d4';ctx.font='10px sans-serif';
      ctx.fillText(esc(top12[j][0]),395,ly+9);
      ctx.fillStyle='#8ba4c4';
      ctx.fillText(top12[j][1].toLocaleString()+' ('+pct+'%)',520,ly+9);
      ly+=24;
      if(ly>385)break;
    }

    if(hoverIdx>=0&&hoverIdx<top12.length){
      var hi=top12[hoverIdx];
      ctx.fillStyle='rgba(126,200,227,0.15)';
      ctx.beginPath();ctx.roundRect(360,ly+8,250,36,6);ctx.fill();
      ctx.fillStyle='#7EC8E3';ctx.font='bold 11px sans-serif';
      ctx.fillText(esc(hi[0]),370,ly+25);
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';
      ctx.fillText(hi[1].toLocaleString()+'개 ('+(hi[1]/total*100).toFixed(1)+'%)',370,ly+39);
    }
  }
  draw();
}

// ─── 2. 강좌 가격 탄력성 분석기 (산점도) ──────────────────────
function renderPriceElasticity(container){
  var data=getData();
  var catStats={};
  data.forEach(function(d){
    var cat=d[3]||'기타';var price=parsePrice(d[8]);var sess=parseSessions(d[10]);
    if(price<=0)return;
    if(!catStats[cat])catStats[cat]={prices:[],sessions:[],count:0};
    catStats[cat].prices.push(price);
    catStats[cat].sessions.push(sess);
    catStats[cat].count++;
  });
  var allCats={};data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,10).map(function(e){return e[0];});

  var points=[];
  topCats.forEach(function(cat,ci){
    if(!catStats[cat])return;
    var s=catStats[cat];
    var avgPrice=s.prices.reduce(function(a,b){return a+b;},0)/s.prices.length;
    var avgSess=s.sessions.reduce(function(a,b){return a+b;},0)/s.sessions.length;
    points.push({cat:cat,avgPrice:avgPrice,avgSess:avgSess,count:s.count,ci:ci});
  });

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverPt=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverPt=-1;
    for(var i=0;i<points.length;i++){
      var p=points[i];
      var maxP=Math.max.apply(null,points.map(function(x){return x.avgPrice;}));
      var maxS=Math.max.apply(null,points.map(function(x){return x.avgSess;}));
      var px=80+(p.avgPrice/maxP)*480;
      var py=360-(p.avgSess/maxS)*300;
      if(Math.abs(mx-px)<15&&Math.abs(my-py)<15){hoverPt=i;break;}
    }
    drawElastic();
  });
  canvas.addEventListener('mouseleave',function(){hoverPt=-1;drawElastic();});

  function drawElastic(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#7EC8E3';ctx.font='bold 13px sans-serif';
    ctx.fillText('📈 강좌 가격 탄력성 분석 (평균가격 vs 평균수강횟수)',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('버블 크기 = 강좌 수 | TOP 10 카테고리',10,38);

    if(points.length===0)return;
    var maxP=Math.max.apply(null,points.map(function(x){return x.avgPrice;}))*1.1;
    var maxS=Math.max.apply(null,points.map(function(x){return x.avgSess;}))*1.1;
    var maxC=Math.max.apply(null,points.map(function(x){return x.count;}));

    ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
    for(var gi=0;gi<=5;gi++){
      var gy=360-(gi/5)*300;
      ctx.beginPath();ctx.moveTo(80,gy);ctx.lineTo(580,gy);ctx.stroke();
      ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='right';
      ctx.fillText(Math.round(maxS*gi/5)+'회',75,gy+3);
    }
    for(var gj=0;gj<=5;gj++){
      var gx=80+(gj/5)*500;
      ctx.beginPath();ctx.moveTo(gx,60);ctx.lineTo(gx,360);ctx.stroke();
      ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText(Math.round(maxP*gj/5/1000)+'K',gx,375);
    }
    ctx.textAlign='left';

    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('평균 수강료 (원)',330,395);
    ctx.save();ctx.translate(12,210);ctx.rotate(-Math.PI/2);
    ctx.fillText('평균 수강횟수',0,0);ctx.restore();
    ctx.textAlign='left';

    for(var i=0;i<points.length;i++){
      var p=points[i];
      var px=80+(p.avgPrice/maxP)*500;
      var py=360-(p.avgSess/maxS)*300;
      var radius=Math.max(8,Math.min(30,(p.count/maxC)*30));
      ctx.beginPath();ctx.arc(px,py,radius,0,Math.PI*2);
      ctx.fillStyle=COLORS[p.ci%COLORS.length];
      ctx.globalAlpha=(i===hoverPt)?0.9:0.5;
      ctx.fill();
      ctx.globalAlpha=1;
      if(i===hoverPt){
        ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
        ctx.fillStyle='rgba(0,0,0,0.85)';
        ctx.beginPath();ctx.roundRect(px+radius+5,py-30,170,52,6);ctx.fill();
        ctx.fillStyle='#7EC8E3';ctx.font='bold 10px sans-serif';
        ctx.fillText(esc(p.cat),px+radius+12,py-16);
        ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
        ctx.fillText('평균가: '+Math.round(p.avgPrice).toLocaleString()+'원',px+radius+12,py-2);
        ctx.fillText('평균횟수: '+p.avgSess.toFixed(1)+'회 | '+p.count+'개',px+radius+12,py+12);
      }else{
        ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';ctx.textAlign='center';
        ctx.fillText(esc(p.cat),px,py-radius-4);ctx.textAlign='left';
      }
    }
  }
  drawElastic();
}

// ─── 3. 센터 접근 효율 매트릭스 ───────────────────────────────
function renderAccessEfficiency(container){
  var data=getData();
  var typeStats={};
  CTYPES.forEach(function(ct){typeStats[ct]={count:0,totalPrice:0,catSet:{},daySet:{},hourSet:{}};});
  data.forEach(function(d){
    var center=d[0]||'';var cat=d[3]||'기타';var price=parsePrice(d[8]);
    var days=parseDays(d[9]);var hour=parseHour(d[9]);
    for(var ti=0;ti<CTYPES.length;ti++){
      if(center.indexOf(CTYPES[ti])>=0||(CTYPES[ti]==='대형마트'&&(center.indexOf('홈플러스')>=0||center.indexOf('이마트')>=0))){
        var ts=typeStats[CTYPES[ti]];
        ts.count++;ts.totalPrice+=price;ts.catSet[cat]=1;
        days.forEach(function(dy){ts.daySet[dy]=1;});
        if(hour>=0)ts.hourSet[hour]=1;
        break;
      }
    }
  });

  var axes=['강좌수','평균가격','카테고리다양성','요일범위'];
  var maxVals=[0,0,0,0];
  var typeData=[];
  CTYPES.forEach(function(ct){
    var ts=typeStats[ct];if(ts.count===0)return;
    var vals=[ts.count,ts.count>0?ts.totalPrice/ts.count:0,Object.keys(ts.catSet).length,Object.keys(ts.daySet).length];
    typeData.push({name:ct,vals:vals});
    for(var a=0;a<4;a++)if(vals[a]>maxVals[a])maxVals[a]=vals[a];
  });

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverRow=-1,hoverCol=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverRow=-1;hoverCol=-1;
    if(mx>=140&&mx<=580&&my>=60&&my<=380&&typeData.length>0){
      var cw=440/axes.length;
      var rh=320/typeData.length;
      hoverCol=Math.floor((mx-140)/cw);
      hoverRow=Math.floor((my-60)/rh);
      if(hoverRow>=typeData.length)hoverRow=-1;
      if(hoverCol>=axes.length)hoverCol=-1;
    }
    drawAccess();
  });
  canvas.addEventListener('mouseleave',function(){hoverRow=-1;hoverCol=-1;drawAccess();});

  function drawAccess(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#7EC8E3';ctx.font='bold 13px sans-serif';
    ctx.fillText('🏢 센터 접근 효율 매트릭스 (센터유형 × 4축)',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('호버: 상세 정보 | 셀 밝기 = 상대값',10,38);

    if(typeData.length===0){ctx.fillStyle='#556173';ctx.fillText('데이터 없음',300,200);return;}

    var cw=440/axes.length;
    var rh=Math.min(40,320/typeData.length);

    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';ctx.textAlign='center';
    for(var ai=0;ai<axes.length;ai++){
      ctx.fillText(axes[ai],140+ai*cw+cw/2,55);
    }
    ctx.textAlign='right';
    for(var ri=0;ri<typeData.length;ri++){
      ctx.fillStyle=(ri===hoverRow)?'#7EC8E3':'#d4d4d4';
      ctx.font='10px sans-serif';
      ctx.fillText(esc(typeData[ri].name),135,60+ri*rh+rh/2+4);
    }
    ctx.textAlign='left';

    for(var r=0;r<typeData.length;r++){
      for(var c=0;c<axes.length;c++){
        var val=maxVals[c]>0?typeData[r].vals[c]/maxVals[c]:0;
        var isHover=(r===hoverRow&&c===hoverCol);
        var hue=c===1?0:(c===0?200:(c===2?150:270));
        var alpha=0.15+val*0.7;
        ctx.fillStyle='hsla('+hue+',70%,55%,'+(isHover?Math.min(1,alpha+0.3):alpha)+')';
        ctx.beginPath();ctx.roundRect(140+c*cw+2,60+r*rh+2,cw-4,rh-4,4);ctx.fill();
        ctx.fillStyle=val>0.5?'#fff':'#d4d4d4';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
        if(c===1)ctx.fillText(Math.round(typeData[r].vals[c]).toLocaleString(),140+c*cw+cw/2,60+r*rh+rh/2+4);
        else ctx.fillText(Math.round(typeData[r].vals[c]).toString(),140+c*cw+cw/2,60+r*rh+rh/2+4);
        ctx.textAlign='left';
      }
    }

    if(hoverRow>=0&&hoverCol>=0){
      var td=typeData[hoverRow];
      ctx.fillStyle='rgba(0,0,0,0.9)';
      ctx.beginPath();ctx.roundRect(380,340,230,50,6);ctx.fill();
      ctx.fillStyle='#7EC8E3';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(td.name)+' - '+axes[hoverCol],390,356);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText('값: '+(hoverCol===1?Math.round(td.vals[hoverCol]).toLocaleString()+'원':Math.round(td.vals[hoverCol])),390,372);
      var rank=typeData.slice().sort(function(a,b){return b.vals[hoverCol]-a.vals[hoverCol];}).findIndex(function(x){return x.name===td.name;})+1;
      ctx.fillText('순위: '+rank+'/'+typeData.length,500,372);
    }
  }
  drawAccess();
}

// ─── 4. 멀티카테고리 수강 패턴 네트워크 ──────────────────────
function renderMultiCategory(container){
  var data=getData();
  var centerCats={};
  data.forEach(function(d){
    var center=d[0]||'';var cat=d[3]||'기타';
    if(!centerCats[center])centerCats[center]={};
    centerCats[center][cat]=1;
  });

  var allCats={};data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,12).map(function(e){return e[0];});

  var coMatrix={};
  topCats.forEach(function(c1){coMatrix[c1]={};topCats.forEach(function(c2){coMatrix[c1][c2]=0;});});

  Object.values(centerCats).forEach(function(cats){
    var keys=Object.keys(cats).filter(function(c){return topCats.indexOf(c)>=0;});
    for(var i=0;i<keys.length;i++){
      for(var j=i+1;j<keys.length;j++){
        coMatrix[keys[i]][keys[j]]++;
        coMatrix[keys[j]][keys[i]]++;
      }
    }
  });

  var maxCo=1;
  topCats.forEach(function(c1){topCats.forEach(function(c2){if(c1!==c2&&coMatrix[c1][c2]>maxCo)maxCo=coMatrix[c1][c2];});});

  var canvas=document.createElement('canvas');canvas.width=640;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);

  var hoverNode=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(640/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverNode=-1;
    var cx=280,cy=215,R=150;
    for(var i=0;i<topCats.length;i++){
      var angle=-Math.PI/2+(i/topCats.length)*Math.PI*2;
      var nx=cx+Math.cos(angle)*R,ny=cy+Math.sin(angle)*R;
      if(Math.sqrt((mx-nx)*(mx-nx)+(my-ny)*(my-ny))<18){hoverNode=i;break;}
    }
    drawMulti();
  });
  canvas.addEventListener('mouseleave',function(){hoverNode=-1;drawMulti();});

  function drawMulti(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,640,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,640,400);
    ctx.fillStyle='#7EC8E3';ctx.font='bold 13px sans-serif';
    ctx.fillText('🔀 멀티카테고리 수강 패턴 네트워크',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('같은 센터에서 동시 운영되는 카테고리 연결 | TOP 12',10,38);

    var cx=280,cy=215,R=150;
    var positions=[];
    for(var i=0;i<topCats.length;i++){
      var angle=-Math.PI/2+(i/topCats.length)*Math.PI*2;
      positions.push({x:cx+Math.cos(angle)*R,y:cy+Math.sin(angle)*R});
    }

    for(var a=0;a<topCats.length;a++){
      for(var b=a+1;b<topCats.length;b++){
        var coVal=coMatrix[topCats[a]][topCats[b]];
        if(coVal<=0)continue;
        var strength=coVal/maxCo;
        if(strength<0.1)continue;
        var isHighlight=(hoverNode===a||hoverNode===b);
        ctx.strokeStyle=isHighlight?'rgba(126,200,227,0.6)':'rgba(126,200,227,'+(0.05+strength*0.3)+')';
        ctx.lineWidth=isHighlight?2:Math.max(0.5,strength*3);
        ctx.beginPath();ctx.moveTo(positions[a].x,positions[a].y);ctx.lineTo(positions[b].x,positions[b].y);ctx.stroke();
      }
    }

    for(var n=0;n<topCats.length;n++){
      var isHov=(n===hoverNode);
      var nodeR=isHov?16:12;
      ctx.beginPath();ctx.arc(positions[n].x,positions[n].y,nodeR,0,Math.PI*2);
      ctx.fillStyle=COLORS[n%COLORS.length];ctx.globalAlpha=isHov?1:0.7;ctx.fill();ctx.globalAlpha=1;
      if(isHov){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();}
      ctx.fillStyle='#d4d4d4';ctx.font=(isHov?'bold ':'')+' 9px sans-serif';ctx.textAlign='center';
      ctx.fillText(esc(topCats[n]),positions[n].x,positions[n].y-nodeR-4);
      ctx.textAlign='left';
    }

    if(hoverNode>=0){
      var connections=[];
      for(var ci=0;ci<topCats.length;ci++){
        if(ci!==hoverNode&&coMatrix[topCats[hoverNode]][topCats[ci]]>0){
          connections.push({cat:topCats[ci],co:coMatrix[topCats[hoverNode]][topCats[ci]]});
        }
      }
      connections.sort(function(a,b){return b.co-a.co;});
      ctx.fillStyle='rgba(0,0,0,0.9)';
      ctx.beginPath();ctx.roundRect(470,50,165,Math.min(connections.length*16+30,200),6);ctx.fill();
      ctx.fillStyle='#7EC8E3';ctx.font='bold 10px sans-serif';
      ctx.fillText(esc(topCats[hoverNode])+' 연결',480,68);
      var cy2=82;
      connections.slice(0,10).forEach(function(c){
        ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
        ctx.fillText(esc(c.cat)+': '+c.co+'개 센터',480,cy2);
        cy2+=15;
      });
    }
  }
  drawMulti();
}

// ─── 5. 센터 충성도 랭킹 ────────────────────────────────────
function renderLoyaltyRanking(container){
  var data=getData();
  var centerStats={};
  data.forEach(function(d){
    var center=d[0]||'';var cat=d[3]||'기타';var price=parsePrice(d[8]);
    if(!centerStats[center])centerStats[center]={count:0,cats:{},totalPrice:0};
    centerStats[center].count++;
    centerStats[center].cats[cat]=1;
    centerStats[center].totalPrice+=price;
  });

  var ranked=Object.entries(centerStats)
    .filter(function(e){return e[1].count>=5;})
    .map(function(e){
      var s=e[1];
      var diversity=Object.keys(s.cats).length;
      var avgPrice=s.count>0?s.totalPrice/s.count:0;
      var score=s.count*0.4+diversity*10*0.3+(avgPrice>0?Math.min(100,100000/avgPrice)*0.3:0);
      return{name:e[0],count:s.count,diversity:diversity,avgPrice:avgPrice,score:score};
    })
    .sort(function(a,b){return b.score-a.score;})
    .slice(0,15);

  var maxScore=ranked.length>0?ranked[0].score:1;

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverBar=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverBar=-1;
    var barH=Math.min(20,300/ranked.length);
    for(var i=0;i<ranked.length;i++){
      var y=60+i*barH;
      if(my>=y&&my<y+barH-2){hoverBar=i;break;}
    }
    drawLoyalty();
  });
  canvas.addEventListener('mouseleave',function(){hoverBar=-1;drawLoyalty();});

  function drawLoyalty(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#7EC8E3';ctx.font='bold 13px sans-serif';
    ctx.fillText('💎 센터 충성도 랭킹 (강좌수×다양성×가성비)',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('5개 이상 강좌 보유 센터 TOP 15 | 호버: 상세',10,38);

    var barH=Math.min(20,300/ranked.length);
    for(var i=0;i<ranked.length;i++){
      var r=ranked[i];
      var barW=(r.score/maxScore)*350;
      var y=60+i*barH;
      var isHov=(i===hoverBar);
      var grade=r.score>=maxScore*0.8?'S':r.score>=maxScore*0.6?'A':r.score>=maxScore*0.4?'B':'C';
      var gradeColor=grade==='S'?'#FFD700':grade==='A'?'#7EC8E3':grade==='B'?'#3AAFA9':'#8ba4c4';

      ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='right';
      var displayName=r.name.length>12?r.name.substring(0,12)+'..':r.name;
      ctx.fillText(esc(displayName),148,y+barH/2+3);
      ctx.textAlign='left';

      ctx.fillStyle=isHov?'rgba(126,200,227,0.35)':'rgba(126,200,227,0.15)';
      ctx.beginPath();ctx.roundRect(155,y+1,barW,barH-3,3);ctx.fill();

      ctx.fillStyle=gradeColor;ctx.font='bold 9px sans-serif';
      ctx.fillText(grade,155+barW+5,y+barH/2+3);

      if(isHov){
        ctx.fillStyle='rgba(0,0,0,0.9)';
        ctx.beginPath();ctx.roundRect(380,y-5,230,48,6);ctx.fill();
        ctx.fillStyle='#7EC8E3';ctx.font='bold 10px sans-serif';
        ctx.fillText(esc(r.name.substring(0,20)),390,y+10);
        ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
        ctx.fillText('강좌: '+r.count+'개 | 다양성: '+r.diversity+'종',390,y+24);
        ctx.fillText('평균가: '+Math.round(r.avgPrice).toLocaleString()+'원 | 점수: '+r.score.toFixed(1),390,y+37);
      }
    }
  }
  drawLoyalty();
}

// ─── 6. 강좌 포화도 히트맵 ───────────────────────────────────
function renderSaturationHeatmap(container){
  var data=getData();
  var REGIONS=['서울','경기','인천','부산','대구','대전','광주','충청','전라','경상','기타'];
  var allCats={};data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,10).map(function(e){return e[0];});

  var matrix={};
  REGIONS.forEach(function(r){matrix[r]={};topCats.forEach(function(c){matrix[r][c]=0;});});
  data.forEach(function(d){
    var cat=d[3]||'기타';var region=getRegion(d[0]);
    if(topCats.indexOf(cat)>=0&&matrix[region])matrix[region][cat]++;
  });

  var maxVal=1;
  REGIONS.forEach(function(r){topCats.forEach(function(c){if(matrix[r][c]>maxVal)maxVal=matrix[r][c];});});

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverR=-1,hoverC=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverR=-1;hoverC=-1;
    if(mx>=100&&mx<=580&&my>=65&&my<=380){
      var cw=480/topCats.length;
      var rh=315/REGIONS.length;
      hoverC=Math.floor((mx-100)/cw);
      hoverR=Math.floor((my-65)/rh);
      if(hoverR>=REGIONS.length)hoverR=-1;
      if(hoverC>=topCats.length)hoverC=-1;
    }
    drawSat();
  });
  canvas.addEventListener('mouseleave',function(){hoverR=-1;hoverC=-1;drawSat();});

  function drawSat(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#7EC8E3';ctx.font='bold 13px sans-serif';
    ctx.fillText('🗺️ 강좌 포화도 히트맵 (지역 × 카테고리)',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('셀 밝기 = 강좌 밀도 | TOP 10 카테고리 × 11 지역',10,38);

    var cw=480/topCats.length;
    var rh=315/REGIONS.length;

    ctx.save();
    for(var ci=0;ci<topCats.length;ci++){
      ctx.fillStyle=(ci===hoverC)?'#7EC8E3':'#8ba4c4';ctx.font='9px sans-serif';
      ctx.save();
      ctx.translate(100+ci*cw+cw/2,62);ctx.rotate(-0.5);
      ctx.fillText(esc(topCats[ci].substring(0,6)),0,0);
      ctx.restore();
    }
    ctx.restore();

    for(var ri=0;ri<REGIONS.length;ri++){
      ctx.fillStyle=(ri===hoverR)?'#7EC8E3':'#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
      ctx.fillText(REGIONS[ri],95,65+ri*rh+rh/2+4);
      ctx.textAlign='left';
      for(var cj=0;cj<topCats.length;cj++){
        var val=matrix[REGIONS[ri]][topCats[cj]];
        var norm=val/maxVal;
        var isHov=(ri===hoverR&&cj===hoverC);
        var r2=Math.round(10+norm*80);var g2=Math.round(40+norm*140);var b2=Math.round(80+norm*100);
        ctx.fillStyle=isHov?'rgba(126,200,227,'+(0.3+norm*0.7)+')':'rgba('+r2+','+g2+','+b2+','+(0.2+norm*0.75)+')';
        ctx.beginPath();ctx.roundRect(100+cj*cw+1,65+ri*rh+1,cw-2,rh-2,3);ctx.fill();
        if(val>0){
          ctx.fillStyle=norm>0.4?'#fff':'#aaa';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
          ctx.fillText(val.toString(),100+cj*cw+cw/2,65+ri*rh+rh/2+3);
          ctx.textAlign='left';
        }
      }
    }

    if(hoverR>=0&&hoverC>=0){
      var hVal=matrix[REGIONS[hoverR]][topCats[hoverC]];
      var regionTotal=0;topCats.forEach(function(c){regionTotal+=matrix[REGIONS[hoverR]][c];});
      ctx.fillStyle='rgba(0,0,0,0.9)';
      ctx.beginPath();ctx.roundRect(350,10,260,42,6);ctx.fill();
      ctx.fillStyle='#7EC8E3';ctx.font='bold 10px sans-serif';
      ctx.fillText(REGIONS[hoverR]+' × '+esc(topCats[hoverC]),360,26);
      ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
      ctx.fillText(hVal+'개 강좌 | 지역점유율 '+(regionTotal>0?(hVal/regionTotal*100).toFixed(1):0)+'%',360,42);
    }
  }
  drawSat();
}

// ─── 7. 수강 ROI 시뮬레이터 (6축 Radar) ─────────────────────
function renderROISimulator(container){
  var data=getData();
  var allCats={};data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});

  var AXES=['가성비','강좌수','다양성','시간접근성','센터분포','인기도'];
  var catScores={};
  var totalCourses=data.length||1;

  topCats.forEach(function(cat){
    var courses=data.filter(function(d){return(d[3]||'기타')===cat;});
    var prices=courses.map(function(d){return parsePrice(d[8]);}).filter(function(p){return p>0;});
    var avgPrice=prices.length>0?prices.reduce(function(a,b){return a+b;},0)/prices.length:50000;
    var sessions=courses.map(function(d){return parseSessions(d[10]);}).filter(function(s){return s>0;});
    var avgSess=sessions.length>0?sessions.reduce(function(a,b){return a+b;},0)/sessions.length:1;
    var costPerSession=avgSess>0?avgPrice/avgSess:avgPrice;
    var centers={};courses.forEach(function(d){centers[d[0]||'']=1;});
    var centerCount=Object.keys(centers).length;
    var dayCount={};courses.forEach(function(d){parseDays(d[9]).forEach(function(dy){dayCount[dy]=1;});});
    var hourCount={};courses.forEach(function(d){var h=parseHour(d[9]);if(h>=0)hourCount[h]=1;});

    catScores[cat]=[
      Math.min(100,costPerSession>0?100000/costPerSession:50),
      Math.min(100,courses.length/10),
      Math.min(100,centerCount*5),
      Math.min(100,Object.keys(dayCount).length*14+Object.keys(hourCount).length*5),
      Math.min(100,centerCount*3),
      Math.min(100,(courses.length/totalCourses)*500)
    ];
  });

  var selectedCat=0;
  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a;cursor:pointer';
  container.appendChild(canvas);
  canvas.addEventListener('click',function(){selectedCat=(selectedCat+1)%topCats.length;drawROI();SFX22.play('roi');});

  function drawROI(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#7EC8E3';ctx.font='bold 13px sans-serif';
    ctx.fillText('💰 수강 ROI 시뮬레이터 (6축 레이더)',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('클릭: 카테고리 전환 | '+esc(topCats[selectedCat]),10,38);

    var cx=260,cy=220,R=130;
    var scores=catScores[topCats[selectedCat]]||[50,50,50,50,50,50];

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
      var lx=cx+Math.cos(la)*(R+20);
      var ly=cy+Math.sin(la)*(R+20);
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
    ctx.fillStyle='rgba(126,200,227,0.2)';ctx.fill();
    ctx.strokeStyle='#7EC8E3';ctx.lineWidth=2;ctx.stroke();

    for(var di=0;di<6;di++){
      var da=-Math.PI/2+(di/6)*Math.PI*2;
      var dv=scores[di]/100;
      ctx.beginPath();ctx.arc(cx+Math.cos(da)*R*dv,cy+Math.sin(da)*R*dv,4,0,Math.PI*2);
      ctx.fillStyle='#7EC8E3';ctx.fill();
    }

    var totalScore=scores.reduce(function(a,b){return a+b;},0)/6;
    var grade=totalScore>=80?'S':totalScore>=65?'A':totalScore>=50?'B':totalScore>=35?'C':'D';
    var gradeColor=grade==='S'?'#FFD700':grade==='A'?'#7EC8E3':grade==='B'?'#3AAFA9':grade==='C'?'#F59E0B':'#EF4444';

    ctx.fillStyle=gradeColor;ctx.font='bold 28px sans-serif';ctx.textAlign='center';
    ctx.fillText(grade,cx,cy+8);ctx.textAlign='left';

    var ly2=55;
    for(var ki=0;ki<topCats.length;ki++){
      var isSel=(ki===selectedCat);
      ctx.fillStyle=isSel?'rgba(126,200,227,0.15)':'transparent';
      if(isSel){ctx.beginPath();ctx.roundRect(440,ly2-10,170,16,3);ctx.fill();}
      ctx.fillStyle=COLORS[ki%COLORS.length];
      ctx.fillRect(445,ly2-6,8,8);
      ctx.fillStyle=isSel?'#7EC8E3':'#8ba4c4';ctx.font=(isSel?'bold ':'')+' 9px sans-serif';
      ctx.fillText(esc(topCats[ki]),458,ly2+1);
      ly2+=20;
    }

    ctx.fillStyle='#d4d4d4';ctx.font='11px sans-serif';
    ctx.fillText('종합 ROI: '+totalScore.toFixed(1)+'/100',445,ly2+10);
  }
  drawROI();
}

// ─── 8. 종합 시장 인텔리전스 게이지 ────────────────────────
function renderMarketIntelligence(container){
  var data=getData();
  var totalCourses=data.length;
  var centers={};var cats={};var regions={};var paidCount=0;var totalPrice=0;var weekendCount=0;
  data.forEach(function(d){
    centers[d[0]||'']=1;
    cats[d[3]||'기타']=1;
    regions[getRegion(d[0])]=1;
    var price=parsePrice(d[8]);if(price>0){paidCount++;totalPrice+=price;}
    var days=parseDays(d[9]);
    if(days.indexOf('토')>=0||days.indexOf('일')>=0)weekendCount++;
  });

  var KPIs=[
    {name:'총 강좌수',value:totalCourses,max:5000,unit:'개'},
    {name:'센터 수',value:Object.keys(centers).length,max:200,unit:'개'},
    {name:'카테고리 수',value:Object.keys(cats).length,max:50,unit:'종'},
    {name:'평균 수강료',value:paidCount>0?Math.round(totalPrice/paidCount):0,max:300000,unit:'원'},
    {name:'주말 강좌 비율',value:totalCourses>0?Math.round(weekendCount/totalCourses*100):0,max:100,unit:'%'},
    {name:'지역 커버리지',value:Object.keys(regions).length,max:11,unit:'개 지역'}
  ];

  var canvas=document.createElement('canvas');canvas.width=620;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:620px;display:block;margin:6px auto;border-radius:8px;background:#0a0f1a';
  container.appendChild(canvas);
  var hoverKPI=-1;
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();
    var mx=(ev.clientX-rect.left)*(620/rect.width);
    var my=(ev.clientY-rect.top)*(400/rect.height);
    hoverKPI=-1;
    var cols=3,rows=2;
    var gw=180,gh=140;
    var startX=40,startY=55;
    for(var ki=0;ki<KPIs.length;ki++){
      var col=ki%cols,row=Math.floor(ki/cols);
      var kx=startX+col*(gw+15),ky=startY+row*(gh+15);
      if(mx>=kx&&mx<=kx+gw&&my>=ky&&my<=ky+gh){hoverKPI=ki;break;}
    }
    drawIntel();
  });
  canvas.addEventListener('mouseleave',function(){hoverKPI=-1;drawIntel();});

  function drawIntel(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,620,400);
    ctx.fillStyle='#0a0f1a';ctx.fillRect(0,0,620,400);
    ctx.fillStyle='#7EC8E3';ctx.font='bold 13px sans-serif';
    ctx.fillText('🧠 종합 시장 인텔리전스',10,22);
    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('6 KPI 반원 게이지 대시보드 | 호버: 상세',10,38);

    var cols=3,gw=180,gh=140,startX=40,startY=55;

    for(var i=0;i<KPIs.length;i++){
      var kpi=KPIs[i];
      var col=i%cols,row=Math.floor(i/cols);
      var kx=startX+col*(gw+15),ky=startY+row*(gh+15);
      var isHov=(i===hoverKPI);

      ctx.fillStyle=isHov?'rgba(126,200,227,0.08)':'rgba(255,255,255,0.02)';
      ctx.strokeStyle=isHov?'rgba(126,200,227,0.3)':'rgba(255,255,255,0.06)';
      ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(kx,ky,gw,gh,8);ctx.fill();ctx.stroke();

      ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText(kpi.name,kx+gw/2,ky+18);

      var gcx=kx+gw/2,gcy=ky+85,gR=45;
      var pct=Math.min(1,kpi.value/kpi.max);

      ctx.beginPath();ctx.arc(gcx,gcy,gR,Math.PI,0);
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=8;ctx.stroke();

      var startA=Math.PI;var endA=Math.PI+pct*Math.PI;
      ctx.beginPath();ctx.arc(gcx,gcy,gR,startA,endA);
      var gaugeColor=pct>=0.7?'#10B981':pct>=0.4?'#F59E0B':'#EF4444';
      ctx.strokeStyle=gaugeColor;ctx.lineWidth=8;ctx.lineCap='round';ctx.stroke();ctx.lineCap='butt';

      ctx.fillStyle='#d4d4d4';ctx.font='bold 14px sans-serif';
      ctx.fillText(kpi.value.toLocaleString(),gcx,gcy-8);
      ctx.fillStyle='#556173';ctx.font='9px sans-serif';
      ctx.fillText(kpi.unit,gcx,gcy+6);

      ctx.fillStyle=gaugeColor;ctx.font='bold 10px sans-serif';
      ctx.fillText(Math.round(pct*100)+'%',gcx,gcy+22);
      ctx.textAlign='left';
    }

    var overallPct=KPIs.reduce(function(s,k){return s+Math.min(1,k.value/k.max);},0)/KPIs.length;
    var overallGrade=overallPct>=0.8?'S':overallPct>=0.6?'A':overallPct>=0.45?'B':'C';
    var gColor=overallGrade==='S'?'#FFD700':overallGrade==='A'?'#7EC8E3':overallGrade==='B'?'#3AAFA9':'#F59E0B';
    ctx.fillStyle=gColor;ctx.font='bold 16px sans-serif';ctx.textAlign='center';
    ctx.fillText('종합 등급: '+overallGrade+' ('+Math.round(overallPct*100)+'%)',310,385);
    ctx.textAlign='left';
  }
  drawIntel();
}

// ─── 퀴즈 v22 (15문) ────────────────────────────────────────
var QUIZ_V22=[
  {q:'문화센터에서 가장 인기있는 카테고리는 무엇인가요?',o:['수영','요가','미술','피아노'],c:0},
  {q:'시장점유율 분석에서 &quot;도넛 차트&quot;의 장점은?',o:['전체 대비 비율 파악','시계열 비교','상관관계 분석','분포 확인'],c:0},
  {q:'가격 탄력성이 높다는 것은 무엇을 의미하나요?',o:['가격에 수요가 민감','가격이 높음','품질이 좋음','경쟁이 심함'],c:0},
  {q:'센터 다양성 지수가 높은 센터의 특징은?',o:['다양한 카테고리 운영','높은 수강료','넓은 면적','오래된 역사'],c:0},
  {q:'멀티카테고리 수강 패턴에서 &quot;연결&quot;이 의미하는 것은?',o:['같은 센터에서 동시 운영','수강생 공유','강사 겸직','가격 연동'],c:0},
  {q:'ROI(Return on Investment)를 수강에 적용하면?',o:['비용 대비 학습 효과','수업 시간 대비 성적','강사 급여 대비 수강생','시설 투자 대비 매출'],c:0},
  {q:'포화도 히트맵에서 어두운 셀이 의미하는 것은?',o:['강좌가 적음','강좌가 많음','가격이 높음','인기가 많음'],c:0},
  {q:'센터 충성도 점수 계산에 포함되지 않는 요소는?',o:['건물 층수','강좌 수','카테고리 다양성','가성비'],c:0},
  {q:'대형마트 문화센터의 대표적인 브랜드는?',o:['홈플러스/이마트','스타벅스','다이소','올리브영'],c:0},
  {q:'주말 강좌 비율이 높다는 것이 의미하는 바는?',o:['직장인 접근성 높음','비용이 저렴','강사가 많음','시설이 좋음'],c:0},
  {q:'지역 커버리지가 넓은 센터 유형은 주로?',o:['대형마트/백화점','시민대학','개인학원','온라인강좌'],c:0},
  {q:'강좌 가격과 수강횟수의 관계를 보여주는 차트는?',o:['산점도','파이차트','히스토그램','간트차트'],c:0},
  {q:'네트워크 그래프에서 노드 크기가 크다는 것은?',o:['연결이 많음','가격이 높음','최근 개설','수강생 많음'],c:0},
  {q:'KPI 대시보드의 반원 게이지에서 녹색이 의미하는 것은?',o:['목표 70% 이상 달성','위험 수준','평균 수준','데이터 부족'],c:0},
  {q:'문화센터 데이터 분석에서 &quot;실데이터&quot;란?',o:['실제 수집된 강좌 정보','시뮬레이션 결과','AI 생성 데이터','설문조사 결과'],c:0}
];

function renderQuiz22(container){
  var qIdx=0,score=0,answered=false;
  function render(){
    if(qIdx>=QUIZ_V22.length){
      container.innerHTML='<div style="padding:12px;text-align:center"><div style="color:#7EC8E3;font-size:14px;font-weight:bold">🎉 v22 퀴즈 완료!</div><div style="color:#d4d4d4;margin-top:8px;font-size:13px">최종 점수: '+score+'/'+QUIZ_V22.length+'</div></div>';
      if(score>=10)unlockAchieve22('v22_quiz_master');
      if(score>=15)unlockAchieve22('v22_quiz_perfect');
      return;
    }
    var q=QUIZ_V22[qIdx];answered=false;
    container.innerHTML='<div style="padding:12px"><div style="color:#8ba4c4;font-size:10px;margin-bottom:4px">Q'+(qIdx+1)+'/'+QUIZ_V22.length+' | 점수: '+score+'</div>'
      +'<div style="color:var(--text-primary);font-size:12px;font-weight:600;margin-bottom:10px">'+q.q+'</div>'
      +'<div id="v22-quiz-opts" style="display:flex;flex-direction:column;gap:6px">'
      +q.o.map(function(o,i){return'<button style="padding:8px 12px;border-radius:6px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text);cursor:pointer;text-align:left;font-size:11px" data-idx="'+i+'">'+esc(o)+'</button>';}).join('')
      +'</div><div id="v22-quiz-result" style="margin-top:8px;font-size:12px"></div></div>';
    container.querySelectorAll('#v22-quiz-opts button').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(answered)return;answered=true;
        var idx=parseInt(btn.getAttribute('data-idx'));
        if(idx===q.c){score++;btn.style.background='rgba(16,185,129,0.2)';btn.style.borderColor='#10B981';SFX22.play('quiz22');}
        else{btn.style.background='rgba(239,68,68,0.2)';btn.style.borderColor='#EF4444';
          container.querySelectorAll('#v22-quiz-opts button')[q.c].style.background='rgba(16,185,129,0.2)';
          container.querySelectorAll('#v22-quiz-opts button')[q.c].style.borderColor='#10B981';}
        var res=container.querySelector('#v22-quiz-result');
        if(res){
          res.innerHTML='<span style="color:#8ba4c4">현재 점수: '+score+'/'+(qIdx+1)+' &mdash; </span><button id="v22-quiz-next" style="padding:4px 12px;border-radius:4px;border:1px solid var(--accent);background:rgba(126,200,227,0.1);color:var(--accent);cursor:pointer;font-size:11px">다음 ▶</button>';
          container.querySelector('#v22-quiz-next').addEventListener('click',function(){qIdx++;answered=false;render();SFX22.play('open');});
        }
      });
    });
  }
  render();
}

// ─── UI 빌드 ──────────────────────────────────────────────────
function buildV22UI(){
  var root=document.getElementById('root');if(!root)return;

  var hub=document.createElement('div');hub.id='ccf-v22-hub';
  hub.style.cssText='max-width:700px;margin:16px auto;padding:0 12px';
  hub.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,#0a1628,#122040);border:1px solid rgba(126,200,227,0.15);border-radius:10px;margin-bottom:10px">'
    +'<div style="color:#7EC8E3;font-weight:bold;font-size:14px">🧠 심층분석허브 v22</div>'
    +'<button id="v22-toggle-all" style="padding:4px 10px;border-radius:4px;border:1px solid rgba(126,200,227,0.3);background:rgba(126,200,227,0.08);color:#7EC8E3;cursor:pointer;font-size:11px">전체 열기/닫기</button></div>';

  SECTIONS22.forEach(function(sec){
    var section=document.createElement('div');section.id=sec.id;
    section.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background 0.2s">'
      +'<span style="font-size:16px">'+sec.icon+'</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">'+esc(sec.title)+'</span>'
      +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">▼</span></div>'
      +'<div id="'+sec.id+'-content" style="display:none"></div>';
    section.querySelector('div').addEventListener('click',function(){
      SFX22.play(sec.sfx);
      var content=document.getElementById(sec.id+'-content');
      if(content.style.display==='none'){
        content.style.display='block';
        if(!content.hasChildNodes())sec.render(content);
        unlockAchieve22(sec.achieve);
      }else content.style.display='none';
      checkAllSections22();
    });
    hub.appendChild(section);
  });

  var quizSection=document.createElement('div');quizSection.id='v22-quiz-section';
  quizSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">❓</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v22 퀴즈 (15문)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">▼</span></div>'
    +'<div id="v22-quiz-content" style="display:none"></div>';
  quizSection.querySelector('div').addEventListener('click',function(){
    SFX22.play('open');
    var qc=document.getElementById('v22-quiz-content');
    if(qc.style.display==='none'){qc.style.display='block';if(!qc.hasChildNodes())renderQuiz22(qc);}
    else qc.style.display='none';
  });
  hub.appendChild(quizSection);

  var achSection=document.createElement('div');
  achSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">🏆</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v22 업적 ('+ACHIEVEMENTS_V22.length+'종)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">▼</span></div>'
    +'<div id="v22-ach-content" style="display:none"><div id="v22-ach-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;padding:8px"></div></div>';
  achSection.querySelector('div').addEventListener('click',function(){
    SFX22.play('open');
    var ac=document.getElementById('v22-ach-content');
    ac.style.display=ac.style.display==='none'?'block':'none';
  });
  hub.appendChild(achSection);

  function renderAchievements22(){
    var grid=document.getElementById('v22-ach-grid');if(!grid)return;
    var unlocked=getAchieves22();
    grid.innerHTML=ACHIEVEMENTS_V22.map(function(a){
      var done=unlocked.includes(a.id);
      return'<div style="padding:6px 8px;border-radius:6px;border:1px solid '+(done?'var(--accent)':'var(--card-border)')+';background:'+(done?'rgba(126,200,227,0.08)':'var(--card-bg)')+';font-size:10px"><div style="color:'+(done?'var(--accent)':'var(--text-secondary)')+';font-weight:600">'+esc(a.name)+'</div><div style="color:var(--text-muted);font-size:9px;margin-top:2px">'+esc(a.desc)+'</div></div>';
    }).join('');
  }
  renderAchievements22();
  setInterval(renderAchievements22,3000);

  var prevHub=document.getElementById('ccf-v21-hub');
  if(prevHub)prevHub.after(hub);
  else root.appendChild(hub);

  document.getElementById('v22-toggle-all').addEventListener('click',function(){
    SFX22.play('click');
    var allOpen=SECTIONS22.every(function(s){var c=document.getElementById(s.id+'-content');return c&&c.style.display!=='none';});
    SECTIONS22.forEach(function(s){
      var c=document.getElementById(s.id+'-content');
      if(c){
        if(allOpen)c.style.display='none';
        else{c.style.display='block';
          var sec=SECTIONS22.find(function(x){return x.id+'-content'===c.id;});
          if(sec&&!c.hasChildNodes())sec.render(c);
          if(sec)unlockAchieve22(sec.achieve);
        }
      }
    });
    checkAllSections22();
  });
}

// ─── 키보드 단축키 (Shift+I~P/0=퀴즈) ──────────────────────
document.addEventListener('keydown',function(e){
  if(!e.shiftKey||e.ctrlKey||e.altKey||e.metaKey)return;
  var tag=document.activeElement?document.activeElement.tagName:'';
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;

  if(e.key==='0'||e.key===')'){
    var qt=document.getElementById('v22-quiz-section');
    if(qt){e.preventDefault();qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  var keyMap={'I':0,'O':1,'P':2,'[':3,'J':4,'K':5,'L':6,';':7};
  var upper=e.key.toUpperCase?e.key.toUpperCase():e.key;
  if(keyMap[upper]!==undefined&&keyMap[upper]<SECTIONS22.length){
    e.preventDefault();
    var sec=document.getElementById(SECTIONS22[keyMap[upper]].id);
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
window.__v22patch={renderQuiz:renderQuiz22};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(buildV22UI,3200);});}
else{setTimeout(buildV22UI,3200);}
})();
