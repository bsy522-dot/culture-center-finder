/**
 * culture-center-finder v21.0 patch
 * 실데이터 전용 Canvas 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 데이터 없음
 * 강좌계절성히트맵+연령대수강포트폴리오+센터효율스코어보드+카테고리상생네트워크+주말평일선호비교+운영시간스펙트럼+수강료계층피라미드+종합인사이트대시보드+퀴즈15(240→255)+업적12(210→222)+SFX12종+키보드9종
 */
(function(){
'use strict';
var V21_ID='ccf-v21-patch';
if(document.getElementById(V21_ID))return;
var marker=document.createElement('meta');marker.id=V21_ID;document.head.appendChild(marker);

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
function parseMonth(s){
  if(!s)return-1;
  var m=s.match(/(\d{1,2})\./);
  if(m)return parseInt(m[1]);
  m=s.match(/(\d{1,2})\//);
  return m?parseInt(m[1]):-1;
}

var COLORS=['#7EC8E3','#3AAFA9','#F59E0B','#EF4444','#8B5CF6','#EC4899','#10B981','#F97316','#6366F1','#14B8A6','#E879F9','#84CC16','#FB923C','#38BDF8','#A78BFA','#FBBF24','#34D399','#F472B6','#C084FC','#2DD4BF'];

var CTYPES=['대형마트','백화점','아울렛','시민대학','여성능력개발원','50플러스','경기평생학습','K-MOOC'];

// ─── SFX 엔진 v21 ─────────────────────────────────────────────
var SFX21={
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
      case'seasonal':o.type='triangle';o.frequency.value=440;o.frequency.linearRampToValueAtTime(580,t+0.1);o.frequency.linearRampToValueAtTime(500,t+0.18);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'portfolio':o.frequency.value=620;o.frequency.linearRampToValueAtTime(740,t+0.08);o.frequency.linearRampToValueAtTime(680,t+0.14);g.gain.exponentialRampToValueAtTime(0.001,t+0.16);o.start(t);o.stop(t+0.16);break;
      case'scoreboard':o.type='triangle';o.frequency.value=370;o.frequency.linearRampToValueAtTime(720,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.22);o.start(t);o.stop(t+0.22);break;
      case'network':o.frequency.value=460;o.frequency.linearRampToValueAtTime(680,t+0.1);o.frequency.linearRampToValueAtTime(570,t+0.18);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'compare':o.type='sawtooth';o.frequency.value=400;g.gain.value=0.04;g.gain.exponentialRampToValueAtTime(0.001,t+0.1);o.start(t);o.stop(t+0.1);break;
      case'spectrum':o.type='square';o.frequency.value=520;g.gain.value=0.03;o.frequency.linearRampToValueAtTime(620,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'pyramid':o.type='triangle';o.frequency.value=540;o.frequency.linearRampToValueAtTime(440,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'dashboard':o.frequency.value=680;o.frequency.linearRampToValueAtTime(900,t+0.1);o.frequency.linearRampToValueAtTime(790,t+0.18);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'correct':o.type='triangle';o.frequency.value=784;o.frequency.linearRampToValueAtTime(1047,t+0.15);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'unlock':o.type='sine';o.frequency.value=440;o.frequency.linearRampToValueAtTime(880,t+0.15);o.frequency.linearRampToValueAtTime(1320,t+0.3);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);o.start(t);o.stop(t+0.35);break;
      default:o.frequency.value=520;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);
    }
  }
};

// ─── 업적 시스템 v21 ───────────────────────────────────────────
var ACH21_KEY='ccf_achieve_v21';
function getAchieves21(){return lsGet(ACH21_KEY,[]);}
function unlockAchieve21(id){
  if(!id)return;var arr=getAchieves21();
  if(arr.includes(id))return;arr.push(id);lsSet(ACH21_KEY,arr);SFX21.play('unlock');
}

var ACHIEVEMENTS_V21=[
  {id:'v21_seasonal',name:'계절 분석가',desc:'강좌 계절성 히트맵 열기'},
  {id:'v21_age',name:'연령 포트폴리오 전문가',desc:'연령대별 수강 포트폴리오 열기'},
  {id:'v21_scoreboard',name:'효율 평가사',desc:'센터 유형 효율 스코어보드 열기'},
  {id:'v21_network',name:'카테고리 네트워커',desc:'카테고리 상생 네트워크 열기'},
  {id:'v21_compare',name:'주말 평일 비교관',desc:'주말 vs 평일 선호도 비교 열기'},
  {id:'v21_spectrum',name:'시간 스펙트럼 분석관',desc:'센터 운영 시간 스펙트럼 열기'},
  {id:'v21_pyramid',name:'수강료 피라미드 탐험가',desc:'수강료 계층 피라미드 열기'},
  {id:'v21_dashboard',name:'인사이트 마스터',desc:'종합 인사이트 대시보드 열기'},
  {id:'v21_all_sections',name:'v21 완전정복',desc:'v21 8섹션 모두 열기'},
  {id:'v21_quiz_clear',name:'v21 퀴즈 클리어',desc:'v21 퀴즈 완주'},
  {id:'v21_quiz_s',name:'v21 퀴즈 S등급',desc:'v21 퀴즈 12문 이상 정답'},
  {id:'v21_explorer',name:'v21 탐험가',desc:'v21 5개 이상 섹션 열기'}
];

// ─── 섹션 정의 ─────────────────────────────────────────────────
var SECTIONS21=[
  {id:'v21-seasonal',title:'강좌 계절성 히트맵',icon:'🌻',achieve:'v21_seasonal',sfx:'seasonal',render:renderSeasonalHeatmap},
  {id:'v21-age',title:'연령대별 수강 포트폴리오',icon:'👤',achieve:'v21_age',sfx:'portfolio',render:renderAgePortfolio},
  {id:'v21-scoreboard',title:'센터 유형 효율 스코어보드',icon:'🏅',achieve:'v21_scoreboard',sfx:'scoreboard',render:renderCenterScoreboard},
  {id:'v21-network',title:'카테고리 상생 네트워크',icon:'🔗',achieve:'v21_network',sfx:'network',render:renderCategoryNetwork},
  {id:'v21-compare',title:'주말 vs 평일 카테고리 선호도',icon:'📅',achieve:'v21_compare',sfx:'compare',render:renderWeekendWeekday},
  {id:'v21-spectrum',title:'센터 운영 시간 스펙트럼',icon:'⏰',achieve:'v21_spectrum',sfx:'spectrum',render:renderTimeSpectrum},
  {id:'v21-pyramid',title:'수강료 계층 피라미드',icon:'🟰',achieve:'v21_pyramid',sfx:'pyramid',render:renderPricePyramid},
  {id:'v21-dashboard',title:'종합 인사이트 대시보드',icon:'📊',achieve:'v21_dashboard',sfx:'dashboard',render:renderInsightDashboard}
];

// ─── 1. 강좌 계절성 히트맵 ─────────────────────────────────────
function renderSeasonalHeatmap(container){
  var data=getData();
  var MONTHS=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,10).map(function(e){return e[0];});

  var matrix={};
  topCats.forEach(function(cat){matrix[cat]=new Array(12).fill(0);});
  data.forEach(function(d){
    var cat=d[3]||'기타';var mon=parseMonth(d[13]);
    if(mon>=1&&mon<=12&&topCats.indexOf(cat)>=0)matrix[cat][mon-1]++;
  });

  var maxVal=1;
  topCats.forEach(function(cat){matrix[cat].forEach(function(v){if(v>maxVal)maxVal=v;});});

  var W=620,H=400;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  var hoverCell={r:-1,c:-1};
  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🌻 강좌 계절성 히트맵 (Top 10 카테고리 × 12개월)',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(마우스 호버: 상세 정보 | 색상 = 강좌 수 밀도)',W/2,38);

    var lp=100,tp=55,cellW=38,cellH=28,gap=2;
    MONTHS.forEach(function(m,i){
      ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText(m,lp+i*(cellW+gap)+cellW/2,tp-4);
    });

    topCats.forEach(function(cat,ri){
      var name=cat.length>8?cat.slice(0,8)+'..':cat;
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
      ctx.fillText(name,lp-6,tp+ri*(cellH+gap)+cellH/2+4);
      matrix[cat].forEach(function(val,ci){
        var x=lp+ci*(cellW+gap),y=tp+ri*(cellH+gap);
        var intensity=val/maxVal;
        var r2=Math.round(13+intensity*113),g2=Math.round(17+intensity*183),b2=Math.round(23+intensity*204);
        ctx.fillStyle='rgb('+r2+','+g2+','+b2+')';
        if(intensity>0.7)ctx.fillStyle='rgb('+Math.round(126+intensity*50)+','+Math.round(200)+','+Math.round(227)+')';
        ctx.fillRect(x,y,cellW,cellH);
        if(hoverCell.r===ri&&hoverCell.c===ci){
          ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(x,y,cellW,cellH);ctx.lineWidth=1;
        }
        if(val>0){
          ctx.fillStyle=intensity>0.5?'#fff':'#8ba4c4';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
          ctx.fillText(val+'',x+cellW/2,y+cellH/2+3);
        }
      });
    });

    if(hoverCell.r>=0&&hoverCell.r<topCats.length&&hoverCell.c>=0&&hoverCell.c<12){
      var cat=topCats[hoverCell.r],mon=MONTHS[hoverCell.c],val=matrix[cat][hoverCell.c];
      var total=matrix[cat].reduce(function(s,v){return s+v;},0);
      var pct=total>0?(val/total*100).toFixed(1):'0.0';
      ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(W/2-120,H-55,240,45);
      ctx.strokeStyle='var(--accent,#7EC8E3)';ctx.strokeRect(W/2-120,H-55,240,45);
      ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      ctx.fillText(cat+' - '+mon,W/2,H-38);
      ctx.font='10px sans-serif';ctx.fillStyle='#7EC8E3';
      ctx.fillText(val+'건 (연간 '+pct+'%)',W/2,H-22);
    }

    var legendY=H-18;
    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('■ 낮음',W/2-80,legendY);ctx.fillText('■ 높음',W/2+80,legendY);
    var grd=ctx.createLinearGradient(W/2-40,0,W/2+40,0);
    grd.addColorStop(0,'#0d1117');grd.addColorStop(1,'#7EC8E3');
    ctx.fillStyle=grd;ctx.fillRect(W/2-40,legendY-9,80,8);
  }
  draw();
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();var sx=W/rect.width,sy=H/rect.height;
    var mx=(ev.clientX-rect.left)*sx,my=(ev.clientY-rect.top)*sy;
    var lp=100,tp=55,cellW=38,cellH=28,gap=2;
    var ci=Math.floor((mx-lp)/(cellW+gap)),ri=Math.floor((my-tp)/(cellH+gap));
    if(ci>=0&&ci<12&&ri>=0&&ri<topCats.length){
      if(hoverCell.r!==ri||hoverCell.c!==ci){hoverCell={r:ri,c:ci};draw();}
    }else if(hoverCell.r>=0){hoverCell={r:-1,c:-1};draw();}
  });
  canvas.addEventListener('mouseleave',function(){hoverCell={r:-1,c:-1};draw();});
}

// ─── 2. 연령대별 수강 포트폴리오 ──────────────────────────────
function renderAgePortfolio(container){
  var data=getData();
  var AGE_GROUPS=['영유아(0~3세)','유아(4~6세)','어린이(7~12세)','청소년(13~18세)','성인','시니어(50+)'];
  function classifyAge(tgt){
    if(!tgt)return'성인';
    if(tgt.includes('영유아')||tgt.match(/0[~세]/))return'영유아(0~3세)';
    if(tgt.includes('유아')||tgt.match(/[3-6]~[4-7]세/)||tgt.match(/[3-6]세/))return'유아(4~6세)';
    if(tgt.includes('어린이')||tgt.match(/[7-9]~\d+세/)||tgt.match(/[7-9]세/))return'어린이(7~12세)';
    if(tgt.match(/1[1-8]세/)||tgt.match(/1[0-3]~1[3-8]세/))return'청소년(13~18세)';
    if(tgt.includes('50+')||tgt.includes('50~')||tgt.includes('시니어'))return'시니어(50+)';
    if(tgt.includes('성인')||tgt.includes('패밀리')||tgt.includes('엄마'))return'성인';
    var m=tgt.match(/(\d+)/);
    if(m){var a=parseInt(m[1]);if(a<=3)return'영유아(0~3세)';if(a<=6)return'유아(4~6세)';if(a<=12)return'어린이(7~12세)';if(a<=18)return'청소년(13~18세)';if(a>=50)return'시니어(50+)';}
    return'성인';
  }

  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,10).map(function(e){return e[0];});

  var ageData={};
  AGE_GROUPS.forEach(function(ag){ageData[ag]={total:0,cats:{},avgPrice:0,prices:[]};});
  data.forEach(function(d){
    var ag=classifyAge(d[5]);var cat=d[3]||'기타';var p=parsePrice(d[8]);
    ageData[ag].total++;
    ageData[ag].cats[cat]=(ageData[ag].cats[cat]||0)+1;
    if(p>0)ageData[ag].prices.push(p);
  });
  AGE_GROUPS.forEach(function(ag){
    var ps=ageData[ag].prices;
    ageData[ag].avgPrice=ps.length>0?Math.round(ps.reduce(function(s,v){return s+v;},0)/ps.length):0;
  });

  var W=620,H=400;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  var viewMode=0;
  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('👤 연령대별 수강 포트폴리오',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText(viewMode===0?'(클릭: 카테고리 비율 보기 | 바 = 강좌 수, 선 = 평균 수강료)':'(클릭: 강좌수 보기 | 스택바 = TOP 10 카테고리 비율)',W/2,38);

    var lp=110,tp=55,rp=50,bp=45;
    if(viewMode===0){
      var maxT=Math.max.apply(null,AGE_GROUPS.map(function(ag){return ageData[ag].total;}).concat([1]));
      var maxP=Math.max.apply(null,AGE_GROUPS.map(function(ag){return ageData[ag].avgPrice;}).concat([1]));
      var plotW=W-lp-rp,barH=38,gap=8;
      AGE_GROUPS.forEach(function(ag,i){
        var y=tp+i*(barH+gap);
        var name=ag.length>12?ag.slice(0,12)+'..':ag;
        ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
        ctx.fillText(name,lp-6,y+barH/2+4);
        var bw=Math.max(2,(ageData[ag].total/maxT)*plotW*0.7);
        ctx.fillStyle=COLORS[i*3%COLORS.length];
        ctx.beginPath();ctx.roundRect(lp,y,bw,barH/2-1,[0,3,3,0]);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='left';
        ctx.fillText(ageData[ag].total.toLocaleString()+'건',lp+bw+4,y+barH/4+3);
        var pw=Math.max(2,(ageData[ag].avgPrice/maxP)*plotW*0.7);
        ctx.fillStyle=COLORS[(i*3+1)%COLORS.length];
        ctx.beginPath();ctx.roundRect(lp,y+barH/2+1,pw,barH/2-1,[0,3,3,0]);ctx.fill();
        ctx.fillStyle='#F59E0B';ctx.font='bold 9px sans-serif';ctx.textAlign='left';
        ctx.fillText((ageData[ag].avgPrice/10000).toFixed(1)+'만원',lp+pw+4,y+barH*3/4+3);
      });
      ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText('■ 강좌수   ■ 평균수강료',W/2,H-10);
    }else{
      var barH2=30,gap2=6,plotW2=W-lp-rp;
      AGE_GROUPS.forEach(function(ag,i){
        var y=tp+i*(barH2+gap2);
        var name=ag.length>12?ag.slice(0,12)+'..':ag;
        ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
        ctx.fillText(name,lp-6,y+barH2/2+4);
        var total=ageData[ag].total;if(total<=0)return;
        var bx=lp;
        topCats.forEach(function(cat,ci){
          var cnt=ageData[ag].cats[cat]||0;
          var bw=(cnt/total)*plotW2;
          if(bw>0){
            ctx.fillStyle=COLORS[ci%COLORS.length];
            ctx.fillRect(bx,y,bw,barH2);bx+=bw;
          }
        });
      });
      var ly=H-35;ctx.font='8px sans-serif';ctx.textAlign='left';
      topCats.forEach(function(cat,i){
        var col=i%5,row=Math.floor(i/5);
        var lx=10+col*124;
        ctx.fillStyle=COLORS[i%COLORS.length];ctx.fillRect(lx,ly+row*14,8,8);
        ctx.fillStyle='#d4d4d4';ctx.fillText(cat.length>12?cat.slice(0,12)+'..':cat,lx+12,ly+row*14+8);
      });
    }
  }
  draw();
  canvas.addEventListener('click',function(){viewMode=viewMode===0?1:0;SFX21.play('portfolio');draw();});
}

// ─── 3. 센터 유형 효율 스코어보드 ─────────────────────────────
function renderCenterScoreboard(container){
  var data=getData();
  var typeStats={};
  CTYPES.forEach(function(t){typeStats[t]={total:0,cats:{},prices:[],hours:[],regions:{},days:{}};});
  data.forEach(function(d){
    var t=d[0]||'';if(!typeStats[t])return;
    typeStats[t].total++;
    var cat=d[3]||'기타';typeStats[t].cats[cat]=(typeStats[t].cats[cat]||0)+1;
    var p=parsePrice(d[8]);if(p>0)typeStats[t].prices.push(p);
    var h=parseHour(d[7]);if(h>=0)typeStats[t].hours.push(h);
    var addr=d[15]||'';var reg=addr.trim().split(/\s+/)[0]||'';if(reg)typeStats[t].regions[reg]=1;
    var ds=parseDays(d[6]);ds.forEach(function(dy){typeStats[t].days[dy]=1;});
  });

  function getMetrics(t){
    var s=typeStats[t];if(!s||s.total===0)return{price:0,diversity:0,time:0,region:0,score:0};
    var avgP=s.prices.length>0?s.prices.reduce(function(a,b){return a+b;},0)/s.prices.length:0;
    var priceScore=Math.min(100,avgP>0?Math.max(0,100-avgP/3000):50);
    var catCount=Object.keys(s.cats).length;
    var diversityScore=Math.min(100,catCount*3);
    var hourSpan=s.hours.length>0?Math.max.apply(null,s.hours)-Math.min.apply(null,s.hours):0;
    var timeScore=Math.min(100,hourSpan*8);
    var regCount=Object.keys(s.regions).length;
    var regionScore=Math.min(100,regCount*7);
    var overall=Math.round((priceScore+diversityScore+timeScore+regionScore)/4);
    return{price:Math.round(priceScore),diversity:Math.round(diversityScore),time:Math.round(timeScore),region:Math.round(regionScore),score:overall};
  }

  function getGrade(s){
    if(s>=85)return{grade:'S',color:'#10B981'};
    if(s>=70)return{grade:'A',color:'#7EC8E3'};
    if(s>=55)return{grade:'B',color:'#F59E0B'};
    if(s>=40)return{grade:'C',color:'#F97316'};
    return{grade:'D',color:'#EF4444'};
  }

  var W=620,H=400;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto';
  container.appendChild(canvas);

  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🏅 센터 유형 효율 스코어보드',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(4축: 가격경쟁력 / 카테고리다양성 / 시간대유연성 / 지역커버리지)',W/2,38);

    var lp=120,tp=55,rp=80,barH=32,gap=6;
    var metrics=['가격경쟁력','카테고리다양성','시간대유연성','지역커버리지'];
    var metricKeys=['price','diversity','time','region'];
    var sortedTypes=CTYPES.filter(function(t){return typeStats[t]&&typeStats[t].total>0;})
      .map(function(t){return{type:t,m:getMetrics(t)};}).sort(function(a,b){return b.m.score-a.m.score;});

    sortedTypes.forEach(function(entry,i){
      var y=tp+i*(barH+gap);
      var name=entry.type.length>10?entry.type.slice(0,10)+'..':entry.type;
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
      ctx.fillText(name,lp-6,y+barH/2+4);
      var segW=(W-lp-rp)/4;
      metricKeys.forEach(function(key,ki){
        var val=entry.m[key];
        var bw=Math.max(1,(val/100)*segW*0.9);
        var bx=lp+ki*segW;
        ctx.fillStyle=COLORS[ki*4%COLORS.length];
        ctx.globalAlpha=0.8;
        ctx.fillRect(bx+2,y,bw,barH);
        ctx.globalAlpha=1;
        if(bw>15){
          ctx.fillStyle='#fff';ctx.font='bold 8px sans-serif';ctx.textAlign='center';
          ctx.fillText(val+'',bx+2+bw/2,y+barH/2+3);
        }
      });
      var g=getGrade(entry.m.score);
      ctx.fillStyle=g.color;ctx.font='bold 14px sans-serif';ctx.textAlign='center';
      ctx.fillText(g.grade,W-rp+30,y+barH/2+5);
      ctx.font='9px sans-serif';ctx.fillStyle='#8ba4c4';
      ctx.fillText(entry.m.score+'',W-rp+30,y+barH/2+17);
    });

    var ly=H-22;ctx.font='9px sans-serif';ctx.textAlign='center';
    metrics.forEach(function(m,i){
      var lx=lp+i*((W-lp-rp)/4)+((W-lp-rp)/4)/2;
      ctx.fillStyle=COLORS[i*4%COLORS.length];ctx.fillRect(lx-30,ly-9,8,8);
      ctx.fillStyle='#d4d4d4';ctx.fillText(m,lx+15,ly-1);
    });
  }
  draw();
}

// ─── 4. 카테고리 상생 네트워크 ─────────────────────────────────
function renderCategoryNetwork(container){
  var data=getData();
  var centerCats={};
  data.forEach(function(d){
    var ctr=d[1]||'';var cat=d[3]||'기타';
    if(!ctr)return;
    if(!centerCats[ctr])centerCats[ctr]={};
    centerCats[ctr][cat]=1;
  });

  var allCats={};data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,12).map(function(e){return e[0];});

  var coMatrix={};
  topCats.forEach(function(a){coMatrix[a]={};topCats.forEach(function(b){coMatrix[a][b]=0;});});
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
  topCats.forEach(function(a){topCats.forEach(function(b){if(a!==b&&coMatrix[a][b]>maxCo)maxCo=coMatrix[a][b];});});

  var W=640,H=400;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:640px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  var hoverNode=-1;
  var nodePositions=[];
  var cx=W/2,cy=H/2+10,radius=140;
  topCats.forEach(function(_,i){
    var angle=-Math.PI/2+i*(2*Math.PI/topCats.length);
    nodePositions.push({x:cx+Math.cos(angle)*radius,y:cy+Math.sin(angle)*radius});
  });

  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🔗 카테고리 상생 네트워크 (Top 12)',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(마우스 호버: 연결 하이라이트 | 선 굵기 = 공동 제공 센터 수)',W/2,38);

    for(var i=0;i<topCats.length;i++){
      for(var j=i+1;j<topCats.length;j++){
        var strength=coMatrix[topCats[i]][topCats[j]];
        if(strength<=0)continue;
        var opacity=Math.min(0.8,strength/maxCo*0.8+0.05);
        var lineW=Math.max(0.5,strength/maxCo*4);
        var isHighlight=hoverNode===i||hoverNode===j;
        ctx.strokeStyle=isHighlight?'rgba(126,200,227,'+Math.min(1,opacity+0.3)+')':'rgba(126,200,227,'+opacity+')';
        ctx.lineWidth=isHighlight?lineW+1:lineW;
        ctx.beginPath();ctx.moveTo(nodePositions[i].x,nodePositions[i].y);
        ctx.lineTo(nodePositions[j].x,nodePositions[j].y);ctx.stroke();
      }
    }
    ctx.lineWidth=1;

    topCats.forEach(function(cat,i){
      var np=nodePositions[i];
      var isHover=hoverNode===i;
      var r=isHover?14:10;
      ctx.beginPath();ctx.arc(np.x,np.y,r,0,Math.PI*2);
      ctx.fillStyle=isHover?'#7EC8E3':COLORS[i%COLORS.length];ctx.fill();
      ctx.strokeStyle='#fff';ctx.lineWidth=isHover?2:1;ctx.stroke();ctx.lineWidth=1;
      var name=cat.length>6?cat.slice(0,6)+'..':cat;
      ctx.fillStyle='#fff';ctx.font=(isHover?'bold ':'')+' 9px sans-serif';ctx.textAlign='center';
      var labelY=np.y>cy?np.y+r+12:np.y-r-5;
      ctx.fillText(name,np.x,labelY);
    });

    if(hoverNode>=0&&hoverNode<topCats.length){
      var cat=topCats[hoverNode];
      var connections=[];
      topCats.forEach(function(c,i){if(i!==hoverNode&&coMatrix[cat][c]>0)connections.push({cat:c,count:coMatrix[cat][c]});});
      connections.sort(function(a,b){return b.count-a.count;});
      var infoX=10,infoY=H-80;
      ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(infoX,infoY,200,70);
      ctx.strokeStyle='#7EC8E3';ctx.strokeRect(infoX,infoY,200,70);
      ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
      ctx.fillText(cat+' 연결 TOP 3:',infoX+8,infoY+15);
      connections.slice(0,3).forEach(function(c,i){
        ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';
        ctx.fillText((i+1)+'. '+c.cat+' ('+c.count+'개 센터)',infoX+12,infoY+30+i*14);
      });
    }
  }
  draw();
  canvas.addEventListener('mousemove',function(ev){
    var rect=canvas.getBoundingClientRect();var sx=W/rect.width,sy=H/rect.height;
    var mx=(ev.clientX-rect.left)*sx,my=(ev.clientY-rect.top)*sy;
    var newHover=-1;
    nodePositions.forEach(function(np,i){
      var dx=mx-np.x,dy=my-np.y;
      if(Math.sqrt(dx*dx+dy*dy)<18)newHover=i;
    });
    if(newHover!==hoverNode){hoverNode=newHover;draw();}
  });
  canvas.addEventListener('mouseleave',function(){hoverNode=-1;draw();});
}

// ─── 5. 주말 vs 평일 카테고리 선호도 ──────────────────────────
function renderWeekendWeekday(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,12).map(function(e){return e[0];});

  var weekday={},weekend={};
  topCats.forEach(function(c){weekday[c]=0;weekend[c]=0;});
  data.forEach(function(d){
    var cat=d[3]||'기타';if(topCats.indexOf(cat)<0)return;
    var ds=parseDays(d[6]);
    ds.forEach(function(dy){
      if(dy==='토'||dy==='일')weekend[cat]++;
      else weekday[cat]++;
    });
  });

  var maxWD=Math.max.apply(null,topCats.map(function(c){return weekday[c];}).concat([1]));
  var maxWE=Math.max.apply(null,topCats.map(function(c){return weekend[c];}).concat([1]));
  var maxAll=Math.max(maxWD,maxWE);

  var W=620,H=400;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto';
  container.appendChild(canvas);

  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('📅 주말 vs 평일 카테고리 선호도 (Top 12)',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(파란 = 평일(월~금) | 주황 = 주말(토~일))',W/2,38);

    var lp=100,tp=55,rp=60,bp=40;
    var barH=12,pairGap=4,groupGap=4;
    var plotW=W-lp-rp;

    topCats.forEach(function(cat,i){
      var y=tp+i*(barH*2+pairGap+groupGap);
      var name=cat.length>8?cat.slice(0,8)+'..':cat;
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
      ctx.fillText(name,lp-6,y+barH+2);

      var wdW=Math.max(2,(weekday[cat]/maxAll)*plotW);
      ctx.fillStyle='#3AAFA9';
      ctx.beginPath();ctx.roundRect(lp,y,wdW,barH,[0,3,3,0]);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='bold 8px sans-serif';ctx.textAlign='left';
      ctx.fillText(weekday[cat].toLocaleString(),lp+wdW+4,y+barH-2);

      var weW=Math.max(2,(weekend[cat]/maxAll)*plotW);
      ctx.fillStyle='#F59E0B';
      ctx.beginPath();ctx.roundRect(lp,y+barH+pairGap,weW,barH,[0,3,3,0]);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='bold 8px sans-serif';
      ctx.fillText(weekend[cat].toLocaleString(),lp+weW+4,y+barH+pairGap+barH-2);

      var ratio=weekday[cat]>0?(weekend[cat]/weekday[cat]*100).toFixed(0):'0';
      ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';ctx.textAlign='left';
      ctx.fillText(ratio+'%',W-rp+4,y+barH+2);
    });

    ctx.fillStyle='#3AAFA9';ctx.fillRect(W/2-90,H-18,10,8);
    ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';ctx.textAlign='left';
    ctx.fillText('평일',W/2-76,H-11);
    ctx.fillStyle='#F59E0B';ctx.fillRect(W/2+10,H-18,10,8);
    ctx.fillStyle='#d4d4d4';ctx.fillText('주말',W/2+24,H-11);
    ctx.fillStyle='#8ba4c4';ctx.fillText('(비율)',W/2+60,H-11);
  }
  draw();
}

// ─── 6. 센터 운영 시간 스펙트럼 ───────────────────────────────
function renderTimeSpectrum(container){
  var data=getData();
  var typeHours={};
  CTYPES.forEach(function(t){typeHours[t]={min:24,max:0,count:0,hours:[]};});
  data.forEach(function(d){
    var t=d[0]||'';if(!typeHours[t])return;
    var h=parseHour(d[7]);if(h<0)return;
    typeHours[t].hours.push(h);
    typeHours[t].count++;
    if(h<typeHours[t].min)typeHours[t].min=h;
    if(h>typeHours[t].max)typeHours[t].max=h;
  });

  var activeTypes=CTYPES.filter(function(t){return typeHours[t].count>0;});

  var W=620,H=380;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto';
  container.appendChild(canvas);

  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('⏰ 센터 운영 시간 스펙트럼',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(바 = 운영 시간 범위 | 점 = 평균 시작 시간)',W/2,38);

    var lp=120,tp=60,rp=40,bp=50;
    var plotW=W-lp-rp;
    var hourMin=5,hourMax=22;
    var hourRange=hourMax-hourMin;
    var barH=28,gap=8;

    for(var h=hourMin;h<=hourMax;h+=2){
      var x=lp+(h-hourMin)/hourRange*plotW;
      ctx.fillStyle='#556173';ctx.font='8px sans-serif';ctx.textAlign='center';
      ctx.fillText(h+':00',x,tp-5);
      ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.beginPath();ctx.moveTo(x,tp);
      ctx.lineTo(x,tp+activeTypes.length*(barH+gap));ctx.stroke();
    }

    activeTypes.forEach(function(t,i){
      var y=tp+i*(barH+gap);
      var name=t.length>10?t.slice(0,10)+'..':t;
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
      ctx.fillText(name,lp-6,y+barH/2+4);

      var tmin=typeHours[t].min,tmax=typeHours[t].max;
      if(tmin>tmax)return;
      var x1=lp+(tmin-hourMin)/hourRange*plotW;
      var x2=lp+(tmax-hourMin)/hourRange*plotW;
      var bw=Math.max(4,x2-x1);

      var grd=ctx.createLinearGradient(x1,0,x2,0);
      grd.addColorStop(0,COLORS[i*2%COLORS.length]);grd.addColorStop(1,COLORS[(i*2+1)%COLORS.length]);
      ctx.fillStyle=grd;
      ctx.beginPath();ctx.roundRect(x1,y,bw,barH,[4,4,4,4]);ctx.fill();

      ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
      ctx.fillText(tmin+':00~'+tmax+':00',x1+bw/2,y+barH/2+3);

      var hs=typeHours[t].hours;
      var avgH=hs.reduce(function(s,v){return s+v;},0)/hs.length;
      var avgX=lp+(avgH-hourMin)/hourRange*plotW;
      ctx.beginPath();ctx.arc(avgX,y+barH/2,4,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
      ctx.strokeStyle='#333';ctx.stroke();
    });

    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('■ 운영 범위   ● 평균 시작',W/2,H-12);
  }
  draw();
}

// ─── 7. 수강료 계층 피라미드 ───────────────────────────────────
function renderPricePyramid(container){
  var data=getData();
  var allCats={};
  data.forEach(function(d){var c=d[3]||'기타';allCats[c]=(allCats[c]||0)+1;});
  var topCats=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,10).map(function(e){return e[0];});

  var catPriceAvg={};
  topCats.forEach(function(cat){catPriceAvg[cat]={prices:[],avg:0,count:0};});
  data.forEach(function(d){
    var cat=d[3]||'기타';if(topCats.indexOf(cat)<0)return;
    var p=parsePrice(d[8]);
    catPriceAvg[cat].count++;
    if(p>0)catPriceAvg[cat].prices.push(p);
  });
  topCats.forEach(function(cat){
    var ps=catPriceAvg[cat].prices;
    catPriceAvg[cat].avg=ps.length>0?Math.round(ps.reduce(function(s,v){return s+v;},0)/ps.length):0;
  });

  var sorted=topCats.slice().sort(function(a,b){return catPriceAvg[b].avg-catPriceAvg[a].avg;});
  var maxAvg=sorted.length>0?catPriceAvg[sorted[0]].avg:1;
  if(maxAvg<=0)maxAvg=1;

  var W=600,H=400;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  var showCount=false;
  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🟰 수강료 계층 피라미드 (Top 10 카테고리)',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText(showCount?'(클릭: 평균 수강료 보기 | 바 = 강좌 수)':'(클릭: 강좌 수 보기 | 피라미드 = 평균 수강료 기준)',W/2,38);

    var tp=55,bp=40,barH=28,gap=4;
    var maxW=240;
    var centerX=W/2;

    sorted.forEach(function(cat,i){
      var y=tp+i*(barH+gap);
      var val=showCount?catPriceAvg[cat].count:catPriceAvg[cat].avg;
      var maxRef=showCount?Math.max.apply(null,sorted.map(function(c){return catPriceAvg[c].count;}).concat([1])):maxAvg;
      var halfW=Math.max(10,(val/maxRef)*maxW);
      ctx.fillStyle=COLORS[i%COLORS.length];
      ctx.beginPath();ctx.roundRect(centerX-halfW,y,halfW*2,barH,[4,4,4,4]);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      if(showCount)ctx.fillText(val.toLocaleString()+'건',centerX,y+barH/2+4);
      else ctx.fillText((val/10000).toFixed(1)+'만원',centerX,y+barH/2+4);
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';
      ctx.textAlign='right';ctx.fillText(cat,centerX-halfW-6,y+barH/2+4);
    });

    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText(showCount?'↑ 상위 = 비싼 카테고리':'↑ 상위 = 비싼 카테고리',W/2,H-12);
  }
  draw();
  canvas.addEventListener('click',function(){showCount=!showCount;SFX21.play('pyramid');draw();});
}

// ─── 8. 종합 인사이트 대시보드 ─────────────────────────────────
function renderInsightDashboard(container){
  var data=getData();
  var totalCourses=data.length;
  var uniqueCenters={};data.forEach(function(d){if(d[1])uniqueCenters[d[1]]=1;});
  var centerCount=Object.keys(uniqueCenters).length;
  var uniqueCats={};data.forEach(function(d){if(d[3])uniqueCats[d[3]]=1;});
  var catCount=Object.keys(uniqueCats).length;
  var prices=[];data.forEach(function(d){var p=parsePrice(d[8]);if(p>0)prices.push(p);});
  var avgPrice=prices.length>0?Math.round(prices.reduce(function(s,v){return s+v;},0)/prices.length):0;
  var freeCount=data.filter(function(d){return parsePrice(d[8])<=0;}).length;
  var freeRate=totalCourses>0?(freeCount/totalCourses*100).toFixed(1):'0.0';
  var openCount=data.filter(function(d){return(d[10]||'').includes('접수중');}).length;
  var openRate=totalCourses>0?(openCount/totalCourses*100).toFixed(1):'0.0';

  var KPIs=[
    {label:'총 강좌 수',value:totalCourses.toLocaleString(),sub:'건',score:Math.min(100,totalCourses/200),color:'#7EC8E3'},
    {label:'센터 수',value:centerCount.toLocaleString(),sub:'곳',score:Math.min(100,centerCount/5),color:'#3AAFA9'},
    {label:'카테고리 수',value:catCount+'',sub:'종',score:Math.min(100,catCount*2),color:'#F59E0B'},
    {label:'평균 수강료',value:(avgPrice/10000).toFixed(1),sub:'만원',score:Math.min(100,100-avgPrice/5000),color:'#EC4899'},
    {label:'무료 강좌',value:freeRate,sub:'%',score:parseFloat(freeRate),color:'#10B981'},
    {label:'접수중 비율',value:openRate,sub:'%',score:parseFloat(openRate),color:'#8B5CF6'}
  ];

  var W=620,H=400;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto';
  container.appendChild(canvas);

  function drawGauge(ctx,cx2,cy2,r,pct,color,label,value,sub){
    var startAngle=Math.PI*0.8;
    var endAngle=Math.PI*2.2;
    var sweepAngle=(endAngle-startAngle)*Math.min(1,pct/100);
    ctx.beginPath();ctx.arc(cx2,cy2,r,startAngle,endAngle);ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=8;ctx.stroke();
    ctx.beginPath();ctx.arc(cx2,cy2,r,startAngle,startAngle+sweepAngle);ctx.strokeStyle=color;ctx.lineWidth=8;ctx.lineCap='round';ctx.stroke();ctx.lineCap='butt';
    ctx.lineWidth=1;
    ctx.fillStyle='#fff';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
    ctx.fillText(value,cx2,cy2+2);
    ctx.fillStyle=color;ctx.font='9px sans-serif';
    ctx.fillText(sub,cx2,cy2+14);
    ctx.fillStyle='#8ba4c4';ctx.font='9px sans-serif';
    ctx.fillText(label,cx2,cy2+r+18);
  }

  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('📊 종합 인사이트 대시보드',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(6핵심 KPI 반원 게이지 | 실데이터 기반)',W/2,38);

    var cols=3,rows=2,gw=180,gh=150;
    var startX=(W-cols*gw)/2,startY=55;
    KPIs.forEach(function(kpi,i){
      var col=i%cols,row=Math.floor(i/cols);
      var gx=startX+col*gw+gw/2;
      var gy=startY+row*gh+gh/2;
      drawGauge(ctx,gx,gy,40,kpi.score,kpi.color,kpi.label,kpi.value,kpi.sub);
    });
  }
  draw();
}

// ─── 퀴즈 v21 (+15문, 240→255) ─────────────────────────────────
var QUIZ_V21=[
  {q:'문화센터 강좌에서 가장 많은 카테고리는?',a:['수영','요가','피아노','미술'],c:0},
  {q:'대형마트 문화센터의 주요 특징은?',a:['주차 편의','가격이 비싸다','야간만 운영','센터가 적다'],c:1},
  {q:'주말 강좌 비율이 가장 높은 카테고리는?',a:['체육(종합)','요리','코딩','수영'],c:0},
  {q:'무료 강좌가 가장 많은 센터 유형은?',a:['백화점','시민대학','대형마트','아울렛'],c:2},
  {q:'오전 6시~9시 시간대에 가장 많은 강좌는?',a:['요가/필라테스','수영','골프','발레'],c:1},
  {q:'연령대별 평균 수강료가 가장 높은 그룹은?',a:['영유아','성인','어린이','시니어'],c:1},
  {q:'카테고리 다양성이 가장 높은 센터 유형은?',a:['백화점','대형마트','시민대학','경기평생학습'],c:1},
  {q:'카테고리 상생 네트워크에서 가장 연결이 많은 카테고리는?',a:['수영','피아노','요가/필라테스','미술'],c:0},
  {q:'평일 대비 주말 비율이 가장 높은 카테고리는?',a:['체육','골프','피아노','요리'],c:0},
  {q:'센터 운영 시간 범위가 가장 넓은 유형은?',a:['백화점','시민대학','대형마트','경기평생학습'],c:2},
  {q:'수강료 피라미드에서 가장 비싼 카테고리는?',a:['놀이','블록/레고','수영','플라워'],c:2},
  {q:'강좌 계절성 히트맵에서 7월에 강좌가 가장 많은 카테고리는?',a:['수영','피아노','요리','요가'],c:0},
  {q:'종합 인사이트 대시보드의 6개 KPI에 포함되지 않는 것은?',a:['카테고리 수','평균 수강료','강사 수','무료 강좌 비율'],c:2},
  {q:'센터 유형 효율 스코어보드의 4축에 포함되지 않는 것은?',a:['가격경쟁력','강사 역량','시간대유연성','지역커버리지'],c:1},
  {q:'연령대별 포트폴리오에서 스택바 보기 모드로 전환하면 보이는 것은?',a:['수강료 비교','카테고리 비율','만족도 평가','위치 정보'],c:1}
];

function renderQuiz21(container){
  var qIdx=0,score=0,answered=false;
  function render(){
    var q=QUIZ_V21[qIdx];
    container.innerHTML='<div style="padding:12px"><div style="color:var(--accent);font-weight:bold;margin-bottom:8px">v21 퀴즈 ('+( qIdx+1)+'/'+QUIZ_V21.length+')</div>'
      +'<div style="color:#fff;font-weight:bold;margin-bottom:10px;font-size:13px">'+esc(q.q)+'</div>'
      +'<div id="v21-quiz-opts" style="display:flex;flex-direction:column;gap:6px">'
      +q.a.map(function(a,i){return'<button data-i="'+i+'" style="padding:8px 12px;border-radius:6px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text);cursor:pointer;text-align:left;font-size:12px">'+esc(a)+'</button>';}).join('')
      +'</div><div id="v21-quiz-result" style="margin-top:8px;font-size:12px"></div></div>';
    container.querySelectorAll('#v21-quiz-opts button').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(answered)return;answered=true;
        var idx=parseInt(btn.getAttribute('data-i'));
        if(idx===q.c){score++;SFX21.play('correct');btn.style.background='rgba(16,185,129,0.2)';btn.style.borderColor='#10B981';}
        else{SFX21.play('click');btn.style.background='rgba(239,68,68,0.2)';btn.style.borderColor='#EF4444';
          container.querySelectorAll('#v21-quiz-opts button')[q.c].style.background='rgba(16,185,129,0.2)';
          container.querySelectorAll('#v21-quiz-opts button')[q.c].style.borderColor='#10B981';}
        var res=container.querySelector('#v21-quiz-result');
        if(qIdx<QUIZ_V21.length-1){
          res.innerHTML='<span style="color:#8ba4c4">현재 점수: '+score+'/'+(qIdx+1)+' &mdash; </span><button id="v21-quiz-next" style="padding:4px 12px;border-radius:4px;border:1px solid var(--accent);background:rgba(126,200,227,0.1);color:var(--accent);cursor:pointer;font-size:11px">다음 ▶</button>';
          container.querySelector('#v21-quiz-next').addEventListener('click',function(){qIdx++;answered=false;render();SFX21.play('open');});
        }else{
          var grade=score>=12?'S':score>=10?'A':score>=7?'B':score>=4?'C':'D';
          var gColor=grade==='S'?'#10B981':grade==='A'?'#7EC8E3':grade==='B'?'#F59E0B':grade==='C'?'#F97316':'#EF4444';
          res.innerHTML='<div style="text-align:center;padding:8px"><div style="font-size:24px;font-weight:bold;color:'+gColor+'">'+grade+' 등급</div><div style="color:#8ba4c4;margin-top:4px">'+score+'/'+QUIZ_V21.length+' 정답</div></div>';
          unlockAchieve21('v21_quiz_clear');
          if(score>=12)unlockAchieve21('v21_quiz_s');
        }
      });
    });
  }
  render();
}

// ─── UI 빌더 ───────────────────────────────────────────────────
function buildV21UI(){
  var root=document.getElementById('root');if(!root)return;

  var hub=document.createElement('div');hub.id='ccf-v21-hub';
  hub.style.cssText='max-width:700px;margin:16px auto;padding:0 12px';
  hub.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:linear-gradient(135deg,#0a1628,#122040);border:1px solid rgba(126,200,227,0.15);border-radius:10px;margin-bottom:10px">'
    +'<div style="color:#7EC8E3;font-weight:bold;font-size:14px">🔬 심층분석허브 v21</div>'
    +'<button id="v21-toggle-all" style="padding:4px 10px;border-radius:4px;border:1px solid rgba(126,200,227,0.3);background:rgba(126,200,227,0.08);color:#7EC8E3;cursor:pointer;font-size:11px">전체 열기/닫기</button></div>';

  SECTIONS21.forEach(function(sec){
    var section=document.createElement('div');section.id=sec.id;
    section.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background 0.2s">'
      +'<span style="font-size:16px">'+sec.icon+'</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">'+esc(sec.title)+'</span>'
      +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">▼</span></div>'
      +'<div id="'+sec.id+'-content" style="display:none"></div>';
    section.querySelector('div').addEventListener('click',function(){
      SFX21.play(sec.sfx);
      var content=document.getElementById(sec.id+'-content');
      if(content.style.display==='none'){
        content.style.display='block';
        if(!content.hasChildNodes())sec.render(content);
        unlockAchieve21(sec.achieve);
      }else content.style.display='none';
      checkAllSections21();
    });
    hub.appendChild(section);
  });

  var quizSection=document.createElement('div');quizSection.id='v21-quiz-section';
  quizSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">❓</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v21 퀴즈 (15문)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">▼</span></div>'
    +'<div id="v21-quiz-content" style="display:none"></div>';
  quizSection.querySelector('div').addEventListener('click',function(){
    SFX21.play('open');
    var qc=document.getElementById('v21-quiz-content');
    if(qc.style.display==='none'){qc.style.display='block';if(!qc.hasChildNodes())renderQuiz21(qc);}
    else qc.style.display='none';
  });
  hub.appendChild(quizSection);

  var achSection=document.createElement('div');
  achSection.innerHTML='<div style="padding:10px 14px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;margin-bottom:6px;cursor:pointer;display:flex;align-items:center;gap:8px">'
    +'<span style="font-size:16px">🏆</span><span style="color:var(--text-primary);font-weight:600;font-size:13px">v21 업적 ('+ACHIEVEMENTS_V21.length+'종)</span>'
    +'<span style="margin-left:auto;color:var(--text-secondary);font-size:11px">▼</span></div>'
    +'<div id="v21-ach-content" style="display:none"><div id="v21-ach-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px;padding:8px"></div></div>';
  achSection.querySelector('div').addEventListener('click',function(){
    SFX21.play('open');
    var ac=document.getElementById('v21-ach-content');
    ac.style.display=ac.style.display==='none'?'block':'none';
  });
  hub.appendChild(achSection);

  function renderAchievements21(){
    var grid=document.getElementById('v21-ach-grid');if(!grid)return;
    var unlocked=getAchieves21();
    grid.innerHTML=ACHIEVEMENTS_V21.map(function(a){
      var done=unlocked.includes(a.id);
      return'<div style="padding:6px 8px;border-radius:6px;border:1px solid '+(done?'var(--accent)':'var(--card-border)')+';background:'+(done?'rgba(126,200,227,0.08)':'var(--card-bg)')+';font-size:10px"><div style="color:'+(done?'var(--accent)':'var(--text-secondary)')+';font-weight:600">'+esc(a.name)+'</div><div style="color:var(--text-muted);font-size:9px;margin-top:2px">'+esc(a.desc)+'</div></div>';
    }).join('');
  }
  renderAchievements21();
  setInterval(renderAchievements21,3000);

  var prevHub=document.getElementById('ccf-v20-hub');
  if(prevHub)prevHub.after(hub);
  else root.appendChild(hub);

  document.getElementById('v21-toggle-all').addEventListener('click',function(){
    SFX21.play('click');
    var sections=hub.querySelectorAll('[id$="-content"]');
    var allOpen=true;
    sections.forEach(function(s){if(s.style.display!=='block')allOpen=false;});
    sections.forEach(function(s){
      s.style.display=allOpen?'none':'block';
      if(!allOpen&&!s.hasChildNodes()){
        var sec=SECTIONS21.find(function(x){return x.id+'-content'===s.id;});
        if(sec){sec.render(s);unlockAchieve21(sec.achieve);}
        else if(s.id==='v21-quiz-content')renderQuiz21(s);
      }
    });
    checkAllSections21();
  });
}

function checkAllSections21(){
  var opened=getAchieves21();
  var sectionAchs=SECTIONS21.map(function(s){return s.achieve;});
  var openedSections=sectionAchs.filter(function(a){return opened.includes(a);}).length;
  if(openedSections>=5)unlockAchieve21('v21_explorer');
  if(openedSections>=8)unlockAchieve21('v21_all_sections');
}

// ─── 키보드 단축키 (Shift+Q/A~G/0=퀴즈) ──────────────────────
document.addEventListener('keydown',function(e){
  if(!e.shiftKey||e.ctrlKey||e.altKey||e.metaKey)return;
  var tag=document.activeElement?document.activeElement.tagName:'';
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;

  if(e.key==='0'||e.key===')'){
    var qt=document.getElementById('v21-quiz-section');
    if(qt){e.preventDefault();qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  var keyMap={'Q':0,'A':1,'S':2,'D':3,'F':4,'G':5,'H':6,'J':7};
  var upper=e.key.toUpperCase();
  if(keyMap[upper]!==undefined&&keyMap[upper]<SECTIONS21.length){
    e.preventDefault();
    var sec=document.getElementById(SECTIONS21[keyMap[upper]].id);
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
window.__v21patch={renderQuiz:renderQuiz21};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(buildV21UI,3000);});}
else{setTimeout(buildV21UI,3000);}
})();
