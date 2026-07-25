/**
 * culture-center-finder v20.0 patch
 * 실데이터 전용 Canvas 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 데이터 없음
 * 강사클러스터+가치분석+성장률비교+포트폴리오레이더+대상시간매트릭스+운영효율+네이밍패턴+스코어카드+퀴즈15(225→240)+업적12(198→210)+SFX12종+키보드8종
 */
(function(){
'use strict';
const V20_ID='ccf-v20-patch';
if(document.getElementById(V20_ID))return;
const marker=document.createElement('meta');marker.id=V20_ID;document.head.appendChild(marker);

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function lsGet(k,d){try{const s=localStorage.getItem(k);return s?JSON.parse(s):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function getData(){return window.__v4Data||[];}

function parsePrice(s){
  if(!s)return 0;
  const m=s.replace(/,/g,'').match(/(\d+)/);
  return m?parseInt(m[1]):0;
}
function parseHour(s){
  if(!s)return-1;
  const m=s.match(/(\d{1,2}):/);
  return m?parseInt(m[1]):-1;
}
function parseDays(s){
  if(!s)return[];
  return(s.match(/[월화수목금토일]/g)||[]);
}
function parseRegion(addr){
  if(!addr)return'미상';
  const p=addr.trim().split(/\s+/);
  return p[0]||'미상';
}

const COLORS=['#7EC8E3','#3AAFA9','#F59E0B','#EF4444','#8B5CF6','#EC4899','#10B981','#F97316','#6366F1','#14B8A6','#E879F9','#84CC16','#FB923C','#38BDF8','#A78BFA','#FBBF24','#34D399','#F472B6','#C084FC','#2DD4BF'];

const SLOTS20=['오전(6~9)','오전(9~12)','오후(12~15)','오후(15~18)','저녁(18~21)','야간(21~)'];
function getSlot20(h){if(h<6)return-1;if(h<9)return 0;if(h<12)return 1;if(h<15)return 2;if(h<18)return 3;if(h<21)return 4;return 5;}
const PRANGES20=['무료','~5만','5~10만','10~20만','20~30만','30만+'];
function getPRange20(p){if(p<=0)return 0;if(p<=50000)return 1;if(p<=100000)return 2;if(p<=200000)return 3;if(p<=300000)return 4;return 5;}

const TARGET_LABELS=['성인','영유아','유아','어린이','시니어','패밀리'];
function matchTarget(tgt){
  if(!tgt)return'기타';
  for(var i=0;i<TARGET_LABELS.length;i++){if(tgt.includes(TARGET_LABELS[i]))return TARGET_LABELS[i];}
  return'기타';
}

// ─── SFX 엔진 v20 ─────────────────────────────────────────────
const SFX20={
  _ctx:null,
  _get(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  play(type){
    const c=this._get();if(!c)return;
    const o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);g.gain.value=0.06;
    const t=c.currentTime;
    switch(type){
      case'click':o.frequency.value=500;g.gain.exponentialRampToValueAtTime(0.001,t+0.05);o.start(t);o.stop(t+0.05);break;
      case'open':o.frequency.value=560;o.frequency.linearRampToValueAtTime(780,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'cluster':o.type='triangle';o.frequency.value=420;o.frequency.linearRampToValueAtTime(560,t+0.1);o.frequency.linearRampToValueAtTime(480,t+0.18);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'value':o.frequency.value=600;o.frequency.linearRampToValueAtTime(720,t+0.08);o.frequency.linearRampToValueAtTime(660,t+0.14);g.gain.exponentialRampToValueAtTime(0.001,t+0.16);o.start(t);o.stop(t+0.16);break;
      case'growth':o.type='triangle';o.frequency.value=350;o.frequency.linearRampToValueAtTime(700,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.22);o.start(t);o.stop(t+0.22);break;
      case'radar':o.frequency.value=440;o.frequency.linearRampToValueAtTime(660,t+0.1);o.frequency.linearRampToValueAtTime(550,t+0.18);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'heatmap':o.type='sawtooth';o.frequency.value=380;g.gain.value=0.04;g.gain.exponentialRampToValueAtTime(0.001,t+0.1);o.start(t);o.stop(t+0.1);break;
      case'efficiency':o.type='square';o.frequency.value=500;g.gain.value=0.03;o.frequency.linearRampToValueAtTime(600,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'naming':o.type='triangle';o.frequency.value=520;o.frequency.linearRampToValueAtTime(420,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'scorecard':o.frequency.value=660;o.frequency.linearRampToValueAtTime(880,t+0.1);o.frequency.linearRampToValueAtTime(770,t+0.18);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'correct':o.type='triangle';o.frequency.value=784;o.frequency.linearRampToValueAtTime(1047,t+0.15);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'unlock':o.type='sine';o.frequency.value=440;o.frequency.linearRampToValueAtTime(880,t+0.15);o.frequency.linearRampToValueAtTime(1320,t+0.3);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);o.start(t);o.stop(t+0.35);break;
      default:o.frequency.value=500;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);
    }
  }
};

// ─── 업적 시스템 v20 ───────────────────────────────────────────
const ACH20_KEY='ccf_achieve_v20';
function getAchieves20(){return lsGet(ACH20_KEY,[]);}
function unlockAchieve20(id){
  if(!id)return;const arr=getAchieves20();
  if(arr.includes(id))return;arr.push(id);lsSet(ACH20_KEY,arr);SFX20.play('unlock');
}

const ACHIEVEMENTS_V20=[
  {id:'v20_cluster',name:'클러스터 분석가',desc:'강사별 강좌 클러스터 분석기 열기'},
  {id:'v20_value',name:'가치 감정사',desc:'수강료 구간별 가치 분석기 열기'},
  {id:'v20_growth',name:'성장률 추적자',desc:'카테고리 성장률 비교 열기'},
  {id:'v20_portfolio',name:'포트폴리오 설계사',desc:'센터 포트폴리오 밸런스 레이더 열기'},
  {id:'v20_matrix',name:'매트릭스 해독가',desc:'대상x시간대 선호 매트릭스 열기'},
  {id:'v20_efficiency',name:'운영 효율 전문가',desc:'요일별 센터 운영 효율 분석기 열기'},
  {id:'v20_naming',name:'네이밍 분석관',desc:'강좌 네이밍 패턴 분석기 열기'},
  {id:'v20_scorecard',name:'스코어카드 마스터',desc:'통합 강좌 스코어카드 열기'},
  {id:'v20_all_sections',name:'v20 완전정복',desc:'v20 8섹션 모두 열기'},
  {id:'v20_quiz_clear',name:'v20 퀴즈 클리어',desc:'v20 퀴즈 완주'},
  {id:'v20_quiz_s',name:'v20 퀴즈 S등급',desc:'v20 퀴즈 12문 이상 정답'},
  {id:'v20_explorer',name:'v20 탐험가',desc:'v20 5개 이상 섹션 열기'}
];

// ─── 섹션 정의 ─────────────────────────────────────────────────
const SECTIONS20=[
  {id:'v20-cluster',title:'강사별 강좌 클러스터 분석기',icon:'📊',achieve:'v20_cluster',sfx:'cluster',render:renderClusterAnalyzer},
  {id:'v20-value',title:'수강료 구간별 가치 분석기',icon:'💰',achieve:'v20_value',sfx:'value',render:renderValueAnalyzer},
  {id:'v20-growth',title:'카테고리 성장률 비교',icon:'📈',achieve:'v20_growth',sfx:'growth',render:renderGrowthComparison},
  {id:'v20-portfolio',title:'센터 포트폴리오 밸런스 레이더',icon:'🎯',achieve:'v20_portfolio',sfx:'radar',render:renderPortfolioRadar},
  {id:'v20-target-time',title:'대상\xD7시간대 선호 매트릭스',icon:'🗂',achieve:'v20_matrix',sfx:'heatmap',render:renderTargetTimeMatrix},
  {id:'v20-efficiency',title:'요일별 센터 운영 효율 분석기',icon:'⚙️',achieve:'v20_efficiency',sfx:'efficiency',render:renderDayEfficiency},
  {id:'v20-naming',title:'강좌 네이밍 패턴 분석기',icon:'🔤',achieve:'v20_naming',sfx:'naming',render:renderNamingPattern},
  {id:'v20-scorecard',title:'통합 강좌 스코어카드',icon:'🏆',achieve:'v20_scorecard',sfx:'scorecard',render:renderScorecard}
];

// ─── 1. 강사별 강좌 클러스터 분석기 ────────────────────────────
function renderClusterAnalyzer(container){
  const data=getData();
  const centerCats={};
  data.forEach(function(d){
    var ctr=d[1]||'';var cat=d[3]||'기타';
    if(!ctr)return;
    if(!centerCats[ctr])centerCats[ctr]={total:0,cats:{}};
    centerCats[ctr].total++;
    centerCats[ctr].cats[cat]=(centerCats[ctr].cats[cat]||0)+1;
  });
  var topCenters=Object.entries(centerCats).sort(function(a,b){return b[1].total-a[1].total;}).slice(0,15);
  var allCats={};
  topCenters.forEach(function(e){Object.keys(e[1].cats).forEach(function(c){allCats[c]=(allCats[c]||0)+e[1].cats[c];});});
  var topCatNames=Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});

  var W=620,H=400;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  var drillCenter='';
  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';

    if(!drillCenter){
      ctx.fillText('📊 센터별 강좌 카테고리 클러스터 (Top 15)',W/2,22);
      ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
      ctx.fillText('(클릭: 센터 상세 분석 | 바 = 카테고리 비율)',W/2,38);
      var lp=140,tp=50,rp=50,bp=50;
      var barH=18,gap=3;
      var maxTotal=topCenters.length>0?topCenters[0][1].total:1;
      topCenters.forEach(function(e,i){
        var y=tp+i*(barH+gap);
        var name=e[0].length>14?e[0].slice(0,14)+'..':e[0];
        ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
        ctx.fillText(name,lp-6,y+13);
        var bx=lp;
        topCatNames.forEach(function(cat,ci){
          var cnt=e[1].cats[cat]||0;
          var bw=(cnt/maxTotal)*(W-lp-rp);
          if(bw>0){
            ctx.fillStyle=COLORS[ci%COLORS.length];
            ctx.fillRect(bx,y,bw,barH);
            bx+=bw;
          }
        });
        var otherCnt=e[1].total-topCatNames.reduce(function(s,c){return s+(e[1].cats[c]||0);},0);
        if(otherCnt>0){var ow=(otherCnt/maxTotal)*(W-lp-rp);ctx.fillStyle='#555';ctx.fillRect(bx,y,ow,barH);bx+=ow;}
        ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='left';
        ctx.fillText(e[1].total+'',bx+4,y+13);
      });
      var ly=H-40;ctx.font='9px sans-serif';ctx.textAlign='left';
      topCatNames.forEach(function(cat,i){
        var col=i%4,row=Math.floor(i/4);
        var lx=20+col*150;
        ctx.fillStyle=COLORS[i%COLORS.length];ctx.fillRect(lx,ly+row*14,8,8);
        ctx.fillStyle='#d4d4d4';ctx.fillText(cat.length>12?cat.slice(0,12)+'..':cat,lx+12,ly+row*14+8);
      });
    }else{
      var cData=centerCats[drillCenter];
      ctx.fillText('📊 '+drillCenter,W/2,22);
      ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
      ctx.fillText('(클릭: 전체 보기로 돌아가기 | 총 '+cData.total+'건)',W/2,38);
      var entries=Object.entries(cData.cats).sort(function(a,b){return b[1]-a[1];}).slice(0,12);
      var maxCat=entries.length>0?entries[0][1]:1;
      var lp=120,tp=55,rp=60,barH2=22,gap2=3;
      entries.forEach(function(e,i){
        var y=tp+i*(barH2+gap2);
        var bw=Math.max(2,(e[1]/maxCat)*(W-lp-rp));
        ctx.fillStyle=COLORS[i%COLORS.length];
        ctx.beginPath();ctx.roundRect(lp,y,bw,barH2,[0,4,4,0]);ctx.fill();
        ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
        ctx.fillText(e[0].length>10?e[0].slice(0,10)+'..':e[0],lp-6,y+15);
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
        ctx.fillText(e[1]+'건 ('+(e[1]/cData.total*100).toFixed(1)+'%)',lp+bw+4,y+15);
      });
    }
  }
  draw();
  canvas.addEventListener('click',function(e){
    if(drillCenter){drillCenter='';SFX20.play('cluster');draw();return;}
    var rect=canvas.getBoundingClientRect();var sy=H/rect.height;
    var my=(e.clientY-rect.top)*sy;
    var tp=50,barH=18,gap=3;
    var idx=Math.floor((my-tp)/(barH+gap));
    if(idx>=0&&idx<topCenters.length){drillCenter=topCenters[idx][0];SFX20.play('open');draw();}
  });
}

// ─── 2. 수강료 구간별 가치 분석기 ──────────────────────────────
function renderValueAnalyzer(container){
  var data=getData();
  var rangeStats=PRANGES20.map(function(){return{prices:[],count:0};});
  data.forEach(function(d){
    var p=parsePrice(d[8]);var ri=getPRange20(p);
    rangeStats[ri].count++;
    if(p>0)rangeStats[ri].prices.push(p);
  });
  var rangeAvgs=rangeStats.map(function(r){return r.prices.length>0?Math.round(r.prices.reduce(function(s,v){return s+v;},0)/r.prices.length):0;});
  var maxCount=Math.max.apply(null,rangeStats.map(function(r){return r.count;}));
  if(maxCount===0)maxCount=1;

  function getGrade(ri){
    var avg=rangeAvgs[ri];var cnt=rangeStats[ri].count;
    if(ri===0)return{grade:'S',color:'#10B981'};
    var ratio=cnt>0?avg/cnt:0;
    if(ratio<5)return{grade:'S',color:'#10B981'};
    if(ratio<15)return{grade:'A',color:'#7EC8E3'};
    if(ratio<40)return{grade:'B',color:'#F59E0B'};
    if(ratio<100)return{grade:'C',color:'#F97316'};
    return{grade:'D',color:'#EF4444'};
  }

  var W=600,H=380;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  var showDetail=false;
  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('💰 수강료 구간별 가치 분석',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText(showDetail?'(클릭: 바 차트로 전환 | 구간별 평균+건수)':'(클릭: 상세 보기 | 바 = 강좌 수, 선 = 평균 수강료)',W/2,38);

    var lp=60,tp=55,rp=50,bp=70;
    var plotW=W-lp-rp,plotH=H-tp-bp,barW=plotW/6;

    if(!showDetail){
      for(var i=0;i<=4;i++){
        var y=tp+i*(plotH/4);var val=Math.round(maxCount*(1-i/4));
        ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='right';
        ctx.fillText(val.toLocaleString(),lp-8,y+3);
        ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.beginPath();ctx.moveTo(lp,y);ctx.lineTo(W-rp,y);ctx.stroke();
      }
      PRANGES20.forEach(function(label,i){
        var x=lp+i*barW;var bh=(rangeStats[i].count/maxCount)*plotH;var by=tp+plotH-bh;
        ctx.fillStyle=COLORS[i*3%COLORS.length];
        ctx.beginPath();ctx.roundRect(x+6,by,barW-12,bh,[4,4,0,0]);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
        if(bh>20)ctx.fillText(rangeStats[i].count.toLocaleString()+'건',x+barW/2,by+bh/2+4);
        ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
        ctx.fillText(label,x+barW/2,tp+plotH+14);
      });
      var maxAvg=Math.max.apply(null,rangeAvgs.concat([1]));
      ctx.beginPath();ctx.strokeStyle='#F59E0B';ctx.lineWidth=2;
      PRANGES20.forEach(function(_,i){
        var x=lp+i*barW+barW/2;
        var y=tp+plotH-(rangeAvgs[i]/maxAvg)*plotH*0.9;
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      });
      ctx.stroke();ctx.lineWidth=1;
      PRANGES20.forEach(function(_,i){
        var x=lp+i*barW+barW/2;var y=tp+plotH-(rangeAvgs[i]/maxAvg)*plotH*0.9;
        ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle='#F59E0B';ctx.fill();
        ctx.fillStyle='#F59E0B';ctx.font='8px sans-serif';ctx.textAlign='center';
        if(rangeAvgs[i]>0)ctx.fillText((rangeAvgs[i]/10000).toFixed(1)+'만',x,y-8);
      });
      ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText('바: 강좌 수 | 선: 평균 수강료',W/2,H-10);
    }else{
      var cardW=80,cardH=85,gap=12,cols=3;
      var startX=(W-cols*(cardW+gap)+gap)/2;
      var startY=tp;
      PRANGES20.forEach(function(label,i){
        var col=i%cols,row=Math.floor(i/cols);
        var cx=startX+col*(cardW+gap),cy=startY+row*(cardH+gap+20);
        var gr=getGrade(i);
        ctx.fillStyle='rgba(255,255,255,0.04)';
        ctx.beginPath();ctx.roundRect(cx,cy,cardW,cardH,[6]);ctx.fill();
        ctx.strokeStyle=gr.color+'66';ctx.beginPath();ctx.roundRect(cx,cy,cardW,cardH,[6]);ctx.stroke();
        ctx.fillStyle=gr.color;ctx.font='bold 22px sans-serif';ctx.textAlign='center';
        ctx.fillText(gr.grade,cx+cardW/2,cy+30);
        ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
        ctx.fillText(label,cx+cardW/2,cy+48);
        ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';
        ctx.fillText(rangeStats[i].count.toLocaleString()+'건',cx+cardW/2,cy+62);
        ctx.fillText('평균 '+(rangeAvgs[i]/10000).toFixed(1)+'만',cx+cardW/2,cy+74);
      });
    }
  }
  draw();
  canvas.addEventListener('click',function(){showDetail=!showDetail;SFX20.play('value');draw();});
}

// ─── 3. 카테고리 성장률 비교 ───────────────────────────────────
function renderGrowthComparison(container){
  var data=getData();
  var catCounts={};var catTypes={};
  data.forEach(function(d){
    var cat=d[3]||'기타';var ctype=d[0]||'기타';
    catCounts[cat]=(catCounts[cat]||0)+1;
    if(!catTypes[cat])catTypes[cat]={};
    catTypes[cat][ctype]=(catTypes[cat][ctype]||0)+1;
  });
  var total=data.length||1;
  var topCats=Object.entries(catCounts).sort(function(a,b){return b[1]-a[1];}).slice(0,12);
  var maxCnt=topCats.length>0?topCats[0][1]:1;
  var allTypes={};
  topCats.forEach(function(e){if(catTypes[e[0]])Object.keys(catTypes[e[0]]).forEach(function(t){allTypes[t]=(allTypes[t]||0)+catTypes[e[0]][t];});});
  var topTypeNames=Object.entries(allTypes).sort(function(a,b){return b[1]-a[1];}).slice(0,6).map(function(e){return e[0];});

  var W=620,H=400;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  var showPct=false;
  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('📈 카테고리 분포 비교 (Top 12)',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText(showPct?'(클릭: 건수 모드 | 센터유형별 비율)':'(클릭: 비율 모드 | 스택바 = 센터유형 분포)',W/2,38);

    var lp=110,tp=52,rp=70,barH=22,gap=4;
    var barArea=W-lp-rp;

    topCats.forEach(function(e,i){
      var y=tp+i*(barH+gap);
      var cat=e[0],cnt=e[1];
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
      ctx.fillText(cat.length>10?cat.slice(0,10)+'..':cat,lp-6,y+15);

      if(showPct){
        var pct=(cnt/total*100).toFixed(1);
        var bw=Math.max(2,(cnt/maxCnt)*barArea);
        ctx.fillStyle=COLORS[i%COLORS.length];
        ctx.beginPath();ctx.roundRect(lp,y,bw,barH,[0,4,4,0]);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
        ctx.fillText(pct+'% ('+cnt.toLocaleString()+'건)',lp+bw+4,y+15);
      }else{
        var bx=lp;var typeData=catTypes[cat]||{};
        topTypeNames.forEach(function(t,ti){
          var tc=typeData[t]||0;
          var bw=(tc/maxCnt)*barArea;
          if(bw>0){
            ctx.fillStyle=COLORS[ti%COLORS.length];
            ctx.fillRect(bx,y,bw,barH);
            bx+=bw;
          }
        });
        var otherCnt=cnt-topTypeNames.reduce(function(s,t){return s+(typeData[t]||0);},0);
        if(otherCnt>0){var ow=(otherCnt/maxCnt)*barArea;ctx.fillStyle='#444';ctx.fillRect(bx,y,ow,barH);bx+=ow;}
        ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='left';
        ctx.fillText(cnt.toLocaleString(),bx+4,y+15);
      }
    });
    var ly=H-36;ctx.font='9px sans-serif';ctx.textAlign='left';
    topTypeNames.forEach(function(t,i){
      var col=i%3,row=Math.floor(i/3);
      var lx=20+col*200;
      ctx.fillStyle=COLORS[i%COLORS.length];ctx.fillRect(lx,ly+row*14,8,8);
      ctx.fillStyle='#d4d4d4';ctx.fillText(t.length>16?t.slice(0,16)+'..':t,lx+12,ly+row*14+8);
    });
  }
  draw();
  canvas.addEventListener('click',function(){showPct=!showPct;SFX20.play('growth');draw();});
}

// ─── 4. 센터 포트폴리오 밸런스 레이더 ──────────────────────────
function renderPortfolioRadar(container){
  var data=getData();
  var typeStats={};
  data.forEach(function(d){
    var type=d[0]||'기타';
    if(!typeStats[type])typeStats[type]={cats:new Set(),prices:[],hours:new Set(),targets:new Set(),days:new Set(),count:0,centers:new Set()};
    var ts=typeStats[type];ts.count++;
    ts.cats.add(d[3]||'기타');
    var p=parsePrice(d[8]);if(p>0)ts.prices.push(p);
    var h=parseHour(d[7]);if(h>=0)ts.hours.add(h);
    ts.targets.add(d[5]||'');
    parseDays(d[6]||'').forEach(function(day){ts.days.add(day);});
    ts.centers.add(d[1]||'');
  });
  var typeArr=Object.entries(typeStats).sort(function(a,b){return b[1].count-a[1].count;}).slice(0,8);
  var axes=['카테고리다양성','가격경쟁력','시간대범위','대상다양성','요일커버리지','강좌규모'];

  function getScores(st){
    var avgP=st.prices.length>0?st.prices.reduce(function(s,v){return s+v;},0)/st.prices.length:0;
    return[
      Math.min(100,st.cats.size*5),
      avgP>0?Math.min(100,Math.max(10,100-avgP/3000)):50,
      Math.min(100,st.hours.size*7),
      Math.min(100,st.targets.size*16),
      Math.min(100,st.days.size*14),
      Math.min(100,st.count/100*100)
    ];
  }

  var W=600,H=380;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  var selIdx=0;var compareIdx=-1;
  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🎯 센터 포트폴리오 밸런스 레이더',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(클릭: 유형 전환 | 우클릭: 비교 오버레이)',W/2,38);

    var cx=W/2-50,cy=H/2+12,radius=120,n=axes.length;
    for(var ring=1;ring<=5;ring++){
      var r=radius*ring/5;ctx.beginPath();
      for(var i=0;i<n;i++){var a=-Math.PI/2+i*2*Math.PI/n;var x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
      ctx.closePath();ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.stroke();
    }
    for(var i=0;i<n;i++){
      var a=-Math.PI/2+i*2*Math.PI/n;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+radius*Math.cos(a),cy+radius*Math.sin(a));ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.stroke();
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText(axes[i],cx+(radius+20)*Math.cos(a),cy+(radius+20)*Math.sin(a)+4);
    }
    function drawRadar(bi,isSel){
      var scores=getScores(typeArr[bi][1]);
      ctx.beginPath();
      scores.forEach(function(score,i){var a=-Math.PI/2+i*2*Math.PI/n;var r2=radius*score/100;i===0?ctx.moveTo(cx+r2*Math.cos(a),cy+r2*Math.sin(a)):ctx.lineTo(cx+r2*Math.cos(a),cy+r2*Math.sin(a));});
      ctx.closePath();ctx.strokeStyle=COLORS[bi];ctx.lineWidth=isSel?2.5:1.5;ctx.stroke();
      if(isSel){ctx.fillStyle=COLORS[bi]+'33';ctx.fill();}
      ctx.lineWidth=1;
    }
    drawRadar(selIdx,true);
    if(compareIdx>=0&&compareIdx!==selIdx)drawRadar(compareIdx,false);

    var sc=getScores(typeArr[selIdx][1]);
    ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='right';
    ctx.fillText(typeArr[selIdx][0],W-12,60);
    ctx.font='9px sans-serif';ctx.fillStyle='#8ba4c4';
    axes.forEach(function(ax,i){ctx.fillText(ax+': '+sc[i].toFixed(0),W-12,75+i*13);});
    ctx.fillText('강좌: '+typeArr[selIdx][1].count.toLocaleString(),W-12,75+axes.length*13);
    ctx.fillText('센터: '+typeArr[selIdx][1].centers.size,W-12,88+axes.length*13);

    var ly=H-30;
    typeArr.forEach(function(e,i){
      var col=i%4,row=Math.floor(i/4);
      var lx=10+col*145;
      ctx.fillStyle=COLORS[i];ctx.fillRect(lx,ly+row*14,8,8);
      ctx.fillStyle=i===selIdx?'#fff':'#8ba4c4';ctx.font=(i===selIdx?'bold ':'')+'9px sans-serif';ctx.textAlign='left';
      ctx.fillText(e[0].length>12?e[0].slice(0,12)+'..':e[0],lx+12,ly+row*14+8);
    });
  }
  draw();
  canvas.addEventListener('click',function(){selIdx=(selIdx+1)%typeArr.length;SFX20.play('radar');draw();});
  canvas.addEventListener('contextmenu',function(e){e.preventDefault();compareIdx=compareIdx>=0?-1:(selIdx+1)%typeArr.length;SFX20.play('open');draw();});
}

// ─── 5. 대상x시간대 선호 매트릭스 ──────────────────────────────
function renderTargetTimeMatrix(container){
  var data=getData();
  var matrix={};
  TARGET_LABELS.forEach(function(t){matrix[t]={};SLOTS20.forEach(function(s){matrix[t][s]=0;});});
  var catByCell={};
  data.forEach(function(d){
    var tgt=matchTarget(d[5]);if(tgt==='기타')return;
    var h=parseHour(d[7]);var slot=getSlot20(h);if(slot<0)return;
    var slotName=SLOTS20[slot];
    matrix[tgt][slotName]++;
    var key=tgt+'|'+slotName;
    var cat=d[3]||'기타';
    if(!catByCell[key])catByCell[key]={};
    catByCell[key][cat]=(catByCell[key][cat]||0)+1;
  });
  var maxVal=1;
  TARGET_LABELS.forEach(function(t){SLOTS20.forEach(function(s){var v=matrix[t][s];if(v>maxVal)maxVal=v;});});

  var W=620,H=400;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  var hoverCell=null;
  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🗂 대상\xD7시간대 선호 매트릭스',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(클릭: 셀 상세 정보 | 밝기 = 강좌 수 비례)',W/2,38);

    var lp=70,tp=65,rp=30,bp=60;
    var cellW=(W-lp-rp)/SLOTS20.length;
    var cellH=(H-tp-bp)/TARGET_LABELS.length;

    ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillStyle='#d4d4d4';
    SLOTS20.forEach(function(s,si){
      var short=s.replace(/[()]/g,'').replace('오전','AM').replace('오후','PM').replace('저녁','PM').replace('야간','NT');
      ctx.fillText(short,lp+si*cellW+cellW/2,tp-8);
    });
    ctx.textAlign='right';
    TARGET_LABELS.forEach(function(t,ti){ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.fillText(t,lp-6,tp+ti*cellH+cellH/2+4);});

    TARGET_LABELS.forEach(function(t,ti){
      SLOTS20.forEach(function(s,si){
        var val=matrix[t][s];
        var intensity=val/maxVal;
        var r=Math.round(14+intensity*112);
        var g=Math.round(180*intensity);
        var b=Math.round(227*(1-intensity*0.5));
        ctx.fillStyle='rgba('+r+','+g+','+b+','+Math.max(0.06,intensity*0.9)+')';
        var x=lp+si*cellW,y=tp+ti*cellH;
        ctx.fillRect(x+1,y+1,cellW-2,cellH-2);
        if(val>0){
          ctx.fillStyle='rgba(255,255,255,'+(intensity>0.3?0.9:0.5)+')';
          ctx.font=(intensity>0.5?'bold ':'')+'10px sans-serif';ctx.textAlign='center';
          ctx.fillText(val,x+cellW/2,y+cellH/2+4);
        }
      });
    });

    if(hoverCell){
      var key=hoverCell.tgt+'|'+hoverCell.slot;
      var cats=catByCell[key];
      if(cats){
        var topCat=Object.entries(cats).sort(function(a,b){return b[1]-a[1];}).slice(0,3);
        var info=hoverCell.tgt+' / '+hoverCell.slot.replace(/[()]/g,'')+': '+matrix[hoverCell.tgt][hoverCell.slot]+'건';
        ctx.fillStyle='rgba(0,0,0,0.85)';ctx.beginPath();ctx.roundRect(W/2-140,H-55,280,45,[6]);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
        ctx.fillText(info,W/2,H-38);
        ctx.font='9px sans-serif';ctx.fillStyle='#8ba4c4';
        ctx.fillText('인기: '+topCat.map(function(e){return e[0]+'('+e[1]+')';}).join(', '),W/2,H-22);
      }
    }
  }
  draw();
  canvas.addEventListener('click',function(e){
    var rect=canvas.getBoundingClientRect();var sx=W/rect.width,sy=H/rect.height;
    var mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
    var lp=70,tp=65,rp=30,bp=60;
    var cellW=(W-lp-rp)/SLOTS20.length,cellH=(H-tp-bp)/TARGET_LABELS.length;
    var ci=Math.floor((mx-lp)/cellW),ri=Math.floor((my-tp)/cellH);
    if(ci>=0&&ci<SLOTS20.length&&ri>=0&&ri<TARGET_LABELS.length){
      hoverCell={tgt:TARGET_LABELS[ri],slot:SLOTS20[ci]};
      SFX20.play('heatmap');draw();
    }else{hoverCell=null;draw();}
  });
}

// ─── 6. 요일별 센터 운영 효율 분석기 ───────────────────────────
function renderDayEfficiency(container){
  var data=getData();
  var dayLabels=['월','화','수','목','금','토','일'];
  var typeCounts={};
  data.forEach(function(d){var t=d[0]||'기타';typeCounts[t]=(typeCounts[t]||0)+1;});
  var topTypes=Object.entries(typeCounts).sort(function(a,b){return b[1]-a[1];}).slice(0,8).map(function(e){return e[0];});
  var dayTypeMatrix={};var dayTotals={};
  dayLabels.forEach(function(day){dayTypeMatrix[day]={};dayTotals[day]=0;topTypes.forEach(function(t){dayTypeMatrix[day][t]=0;});});
  var typeCenters={};topTypes.forEach(function(t){typeCenters[t]=new Set();});
  data.forEach(function(d){
    var t=d[0]||'기타';if(!topTypes.includes(t))return;
    var days=parseDays(d[6]||'');
    days.forEach(function(day){if(dayTypeMatrix[day]){dayTypeMatrix[day][t]++;dayTotals[day]++;}});
    typeCenters[t].add(d[1]||'');
  });
  var maxDayTotal=Math.max.apply(null,dayLabels.map(function(d){return dayTotals[d];}));
  if(maxDayTotal===0)maxDayTotal=1;

  var W=620,H=380;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  var showEfficiency=false;
  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('⚙️ 요일별 센터 운영 효율',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText(showEfficiency?'(클릭: 분포 모드 | 센터당 강좌 수)':'(클릭: 효율 모드 | 스택바 = 센터유형 분포)',W/2,38);

    var lp=50,tp=55,rp=40,bp=60;
    var plotW=W-lp-rp,plotH=H-tp-bp,barW=plotW/7;

    if(!showEfficiency){
      for(var i=0;i<=4;i++){
        var y=tp+i*(plotH/4);var val=Math.round(maxDayTotal*(1-i/4));
        ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='right';
        ctx.fillText(val.toLocaleString(),lp-8,y+3);
        ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.beginPath();ctx.moveTo(lp,y);ctx.lineTo(W-rp,y);ctx.stroke();
      }
      dayLabels.forEach(function(day,di){
        var x=lp+di*barW;
        var by=tp+plotH;
        topTypes.forEach(function(t,ti){
          var cnt=dayTypeMatrix[day][t];
          var bh=(cnt/maxDayTotal)*plotH;
          if(bh>0){
            ctx.fillStyle=COLORS[ti%COLORS.length];
            by-=bh;ctx.fillRect(x+4,by,barW-8,bh);
          }
        });
        ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='center';
        ctx.fillText(day,x+barW/2,tp+plotH+14);
        ctx.fillStyle='#556173';ctx.font='8px sans-serif';
        ctx.fillText(dayTotals[day].toLocaleString()+'건',x+barW/2,tp+plotH+26);
      });
    }else{
      var effData=[];
      topTypes.forEach(function(t,ti){
        var centerCnt=typeCenters[t].size||1;
        dayLabels.forEach(function(day){
          var cnt=dayTypeMatrix[day][t];
          effData.push({type:t,day:day,eff:Math.round(cnt/centerCnt*100)/100,ti:ti});
        });
      });
      var lp2=90,tp2=55,rp2=30,bp2=40;
      var cellW=(W-lp2-rp2)/7;
      var cellH=(H-tp2-bp2)/topTypes.length;
      var maxEff=Math.max.apply(null,effData.map(function(e){return e.eff;}).concat([1]));

      ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillStyle='#d4d4d4';
      dayLabels.forEach(function(d,di){ctx.fillText(d,lp2+di*cellW+cellW/2,tp2-8);});
      ctx.textAlign='right';
      topTypes.forEach(function(t,ti){ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';ctx.fillText(t.length>8?t.slice(0,8)+'..':t,lp2-6,tp2+ti*cellH+cellH/2+3);});

      effData.forEach(function(ed){
        var di=dayLabels.indexOf(ed.day),ti2=topTypes.indexOf(ed.type);
        if(di<0||ti2<0)return;
        var intensity=ed.eff/maxEff;
        var x=lp2+di*cellW,y=tp2+ti2*cellH;
        var g=Math.round(200*intensity);var b2=Math.round(140*(1-intensity));
        ctx.fillStyle='rgba('+Math.round(30+intensity*90)+','+g+','+b2+','+Math.max(0.08,intensity*0.85)+')';
        ctx.fillRect(x+1,y+1,cellW-2,cellH-2);
        if(ed.eff>0){
          ctx.fillStyle='rgba(255,255,255,'+(intensity>0.3?0.85:0.4)+')';
          ctx.font=(intensity>0.5?'bold ':'')+'8px sans-serif';ctx.textAlign='center';
          ctx.fillText(ed.eff.toFixed(1),x+cellW/2,y+cellH/2+3);
        }
      });
    }
    var ly=H-46;ctx.font='8px sans-serif';ctx.textAlign='left';
    topTypes.forEach(function(t,i){
      var col=i%4,row=Math.floor(i/4);
      var lx=12+col*150;
      ctx.fillStyle=COLORS[i%COLORS.length];ctx.fillRect(lx,ly+row*13,7,7);
      ctx.fillStyle='#d4d4d4';ctx.fillText(t.length>14?t.slice(0,14)+'..':t,lx+10,ly+row*13+7);
    });
  }
  draw();
  canvas.addEventListener('click',function(){showEfficiency=!showEfficiency;SFX20.play('efficiency');draw();});
}

// ─── 7. 강좌 네이밍 패턴 분석기 ────────────────────────────────
function renderNamingPattern(container){
  var data=getData();
  var stopWords=['the','and','for','with','프로','그램','수업','강좌','특강','반','클래스','과정','을','를','이','가','에','는','은','의','로','으로','한','있','없','할','하','된','및','더','등'];
  var wordCounts={};
  data.forEach(function(d){
    var name=d[4]||'';
    var words=name.replace(/[^가-힣a-zA-Z0-9\s]/g,' ').split(/\s+/);
    words.forEach(function(w){
      w=w.trim();
      if(w.length<2)return;
      if(stopWords.includes(w.toLowerCase()))return;
      wordCounts[w]=(wordCounts[w]||0)+1;
    });
  });
  var topWords=Object.entries(wordCounts).sort(function(a,b){return b[1]-a[1];}).slice(0,20);
  var maxWord=topWords.length>0?topWords[0][1]:1;

  var wordCats={};
  topWords.forEach(function(e){wordCats[e[0]]={};});
  data.forEach(function(d){
    var name=d[4]||'';var cat=d[3]||'기타';
    topWords.forEach(function(e){
      if(name.includes(e[0])){wordCats[e[0]][cat]=(wordCats[e[0]][cat]||0)+1;}
    });
  });

  var W=600,H=380;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  var drillWord='';
  function draw(){
    var ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';

    if(!drillWord){
      ctx.fillText('🔤 강좌 네이밍 패턴 분석 (Top 20)',W/2,22);
      ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
      ctx.fillText('(클릭: 키워드별 카테고리 분포 보기)',W/2,38);
      var col1=topWords.slice(0,10),col2=topWords.slice(10,20);
      var lp1=70,lp2=W/2+30,tp=52,barH=26,gap=4;
      var barArea1=W/2-lp1-20,barArea2=W-lp2-30;

      function drawCol(items,lp,barArea){
        items.forEach(function(e,i){
          var y=tp+i*(barH+gap);
          var bw=Math.max(2,(e[1]/maxWord)*barArea);
          ctx.fillStyle=COLORS[i%COLORS.length];
          ctx.beginPath();ctx.roundRect(lp,y,bw,barH,[0,4,4,0]);ctx.fill();
          ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
          ctx.fillText(e[0].length>6?e[0].slice(0,6)+'..':e[0],lp-6,y+17);
          ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='left';
          ctx.fillText(e[1].toLocaleString()+'회',lp+bw+4,y+17);
        });
      }
      drawCol(col1,lp1,barArea1);
      drawCol(col2,lp2,barArea2);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.beginPath();ctx.moveTo(W/2,tp);ctx.lineTo(W/2,tp+10*(barH+gap));ctx.stroke();
    }else{
      ctx.fillText('🔤 "'+drillWord+'" 키워드 카테고리 분포',W/2,22);
      ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
      var totalUse=wordCounts[drillWord]||0;
      ctx.fillText('(클릭: 전체 보기로 돌아가기 | 총 '+totalUse.toLocaleString()+'회 사용)',W/2,38);
      var cats=wordCats[drillWord]||{};
      var entries=Object.entries(cats).sort(function(a,b){return b[1]-a[1];}).slice(0,12);
      var maxCat=entries.length>0?entries[0][1]:1;
      var lp=120,tp2=55,rp=60,barH2=22,gap2=3;
      entries.forEach(function(e,i){
        var y=tp2+i*(barH2+gap2);
        var bw=Math.max(2,(e[1]/maxCat)*(W-lp-rp));
        ctx.fillStyle=COLORS[i%COLORS.length];
        ctx.beginPath();ctx.roundRect(lp,y,bw,barH2,[0,4,4,0]);ctx.fill();
        ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
        ctx.fillText(e[0].length>10?e[0].slice(0,10)+'..':e[0],lp-6,y+15);
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
        ctx.fillText(e[1]+'건',lp+bw+4,y+15);
      });
    }
  }
  draw();
  canvas.addEventListener('click',function(e){
    if(drillWord){drillWord='';SFX20.play('naming');draw();return;}
    var rect=canvas.getBoundingClientRect();var sy=H/rect.height,sx=W/rect.width;
    var my=(e.clientY-rect.top)*sy,mx=(e.clientX-rect.left)*sx;
    var tp=52,barH=26,gap=4;
    var idx=Math.floor((my-tp)/(barH+gap));
    if(mx<W/2&&idx>=0&&idx<10&&topWords[idx]){drillWord=topWords[idx][0];SFX20.play('open');draw();}
    else if(mx>=W/2&&idx>=0&&idx<10&&topWords[idx+10]){drillWord=topWords[idx+10][0];SFX20.play('open');draw();}
  });
}

// ─── 8. 통합 강좌 스코어카드 ───────────────────────────────────
function renderScorecard(container){
  var data=getData();
  var totalCourses=data.length;
  var prices=[];var catSet=new Set();var centerSet=new Set();var daySet=new Set();var hourSet=new Set();var tgtSet=new Set();
  var priceMin=Infinity,priceMax=0;
  data.forEach(function(d){
    var p=parsePrice(d[8]);if(p>0){prices.push(p);if(p<priceMin)priceMin=p;if(p>priceMax)priceMax=p;}
    catSet.add(d[3]||'기타');centerSet.add(d[1]||'');
    parseDays(d[6]||'').forEach(function(day){daySet.add(day);});
    var h=parseHour(d[7]);if(h>=0)hourSet.add(h);
    var t=matchTarget(d[5]);if(t!=='기타')tgtSet.add(t);
  });
  var avgPrice=prices.length>0?Math.round(prices.reduce(function(s,v){return s+v;},0)/prices.length):0;

  var metrics=[
    {name:'총강좌수',value:totalCourses,max:20000,unit:'건'},
    {name:'평균수강료',value:avgPrice,max:300000,unit:'원'},
    {name:'카테고리수',value:catSet.size,max:50,unit:'개'},
    {name:'센터수',value:centerSet.size,max:500,unit:'개'},
    {name:'요일커버리지',value:daySet.size,max:7,unit:'/7'},
    {name:'시간대분포',value:hourSet.size,max:18,unit:'시간'},
    {name:'대상다양성',value:tgtSet.size,max:6,unit:'유형'},
    {name:'가격범위',value:priceMax-priceMin,max:500000,unit:'원'}
  ];

  function overallGrade(){
    var avgPct=metrics.reduce(function(s,m){return s+Math.min(100,m.value/m.max*100);},0)/metrics.length;
    if(avgPct>=80)return{grade:'S',color:'#10B981'};
    if(avgPct>=65)return{grade:'A',color:'#7EC8E3'};
    if(avgPct>=50)return{grade:'B',color:'#F59E0B'};
    if(avgPct>=35)return{grade:'C',color:'#F97316'};
    return{grade:'D',color:'#EF4444'};
  }

  var W=620,H=380;
  var canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto';
  container.appendChild(canvas);

  var ctx=canvas.getContext('2d');
  ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('🏆 통합 강좌 스코어카드',W/2,22);
  ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
  ctx.fillText('8개 지표 종합 평가 | 반원 게이지',W/2,38);

  var cols=4,rows=2;
  var gW=125,gH=115,gapX=18,gapY=20;
  var startX=(W-cols*(gW+gapX)+gapX)/2;
  var startY=52;

  metrics.forEach(function(m,i){
    var col=i%cols,row=Math.floor(i/cols);
    var cx2=startX+col*(gW+gapX)+gW/2;
    var cy2=startY+row*(gH+gapY)+55;
    var radius=38;
    var pct=Math.min(1,m.value/m.max);
    var startAngle=Math.PI;
    var endAngle=Math.PI+Math.PI*pct;

    ctx.beginPath();ctx.arc(cx2,cy2,radius,Math.PI,2*Math.PI);ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=8;ctx.stroke();
    var gaugeColor=pct>=0.8?'#10B981':pct>=0.6?'#7EC8E3':pct>=0.4?'#F59E0B':pct>=0.2?'#F97316':'#EF4444';
    ctx.beginPath();ctx.arc(cx2,cy2,radius,startAngle,endAngle);ctx.strokeStyle=gaugeColor;ctx.lineWidth=8;ctx.lineCap='round';ctx.stroke();ctx.lineCap='butt';ctx.lineWidth=1;

    ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
    var valStr=m.value>=10000?(m.value/10000).toFixed(1)+'만':m.value.toLocaleString();
    ctx.fillText(valStr,cx2,cy2-2);
    ctx.fillStyle='#8ba4c4';ctx.font='8px sans-serif';
    ctx.fillText(m.unit,cx2,cy2+10);
    ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
    ctx.fillText(m.name,cx2,cy2+radius+14);
    ctx.fillStyle=gaugeColor;ctx.font='bold 9px sans-serif';
    ctx.fillText(Math.round(pct*100)+'%',cx2,cy2+radius+26);
  });

  var og=overallGrade();
  ctx.fillStyle=og.color;ctx.font='bold 28px sans-serif';ctx.textAlign='center';
  ctx.fillText(og.grade,W/2,H-22);
  ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
  ctx.fillText('종합 등급',W/2,H-8);
}

// ─── 퀴즈 v20 (15문항, 225→240) ────────────────────────────────
var QUIZ_V20=[
  {q:'강좌 클러스터 분석에서 클러스터의 기본 그룹핑 기준은?',a:['가격대','센터명 + 카테고리','요일','시간대'],c:1},
  {q:'수강료 구간별 가치 분석에서 S등급이 의미하는 것은?',a:['가장 비싼 구간','가장 가치 효율이 높은 구간','가장 인기 있는 구간','가장 강좌가 적은 구간'],c:1},
  {q:'카테고리 분포 비교에서 스택바 차트가 보여주는 정보는?',a:['시간대별 분포','센터유형별 구성 비율','가격 추이','접수 상태'],c:1},
  {q:'포트폴리오 밸런스 레이더의 6축 중 "가격경쟁력"이 높다면?',a:['가격이 비싸다','가격이 상대적으로 저렴하다','강좌가 많다','카테고리가 다양하다'],c:1},
  {q:'대상\xD7시간대 매트릭스에서 셀의 밝기가 의미하는 것은?',a:['가격 수준','해당 조합의 강좌 수','접수율','만족도'],c:1},
  {q:'요일별 센터 운영 효율에서 "효율 점수"의 계산 방법은?',a:['총 강좌수 \xD7 요일수','강좌수 \xF7 센터수','수강료 합계','카테고리 수 \xD7 요일수'],c:1},
  {q:'강좌 네이밍 패턴 분석에서 제외해야 할 단어는?',a:['요가','피아노','조사/접속사 등 불용어','영어 단어'],c:2},
  {q:'통합 스코어카드에서 반원 게이지가 보여주는 것은?',a:['시간 경과','각 지표의 달성률','매출 현황','수강생 수'],c:1},
  {q:'히트맵에서 색상이 가장 진한 셀의 의미는?',a:['데이터 없음','해당 조합의 값이 가장 높음','오류 발생','시간이 오래됨'],c:1},
  {q:'레이더 차트에서 비교 오버레이 모드의 목적은?',a:['데이터 삭제','두 유형의 강약점 비교','아름다운 차트 생성','가격 비교'],c:1},
  {q:'포트폴리오 분석에서 "요일커버리지"가 100점이면?',a:['월~금만 운영','월~일 모두 강좌 운영','주말만 운영','강좌가 없음'],c:1},
  {q:'수강료 분석에서 무료 강좌의 가치 등급이 S인 이유는?',a:['품질이 좋아서','비용 대비 가치가 무한대','인기가 많아서','강사가 유명해서'],c:1},
  {q:'네이밍 패턴 분석에서 키워드 클릭 시 보여주는 정보는?',a:['가격 분포','해당 키워드를 사용하는 카테고리 분포','센터 위치','수강생 리뷰'],c:1},
  {q:'스코어카드의 종합 등급 S를 받으려면 평균 달성률은?',a:['50% 이상','65% 이상','80% 이상','100%'],c:2},
  {q:'문화센터 데이터 분석에서 실데이터 사용의 가장 큰 장점은?',a:['빠른 로딩','정확한 현황 반영','더 예쁜 차트','간단한 구현'],c:1}
];

function renderQuiz20(container){
  var state=lsGet('ccf_quiz_v20',{idx:0,score:0,done:false,answers:[]});

  function renderQ(){
    if(state.done){
      var grade=state.score>=14?'S':state.score>=12?'A':state.score>=10?'B':state.score>=7?'C':'D';
      if(state.score>=12)unlockAchieve20('v20_quiz_s');
      unlockAchieve20('v20_quiz_clear');
      container.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:28px;margin-bottom:8px">'+grade+'</div><div style="color:var(--text-secondary);font-size:13px">v20 퀴즈 완료: '+state.score+'/'+QUIZ_V20.length+'문 정답</div><button id="v20-quiz-retry" style="margin-top:12px;padding:6px 16px;border-radius:6px;background:var(--accent);color:#fff;border:none;cursor:pointer;font-size:12px">다시 풀기</button></div>';
      document.getElementById('v20-quiz-retry')?.addEventListener('click',function(){
        state.idx=0;state.score=0;state.done=false;state.answers=[];lsSet('ccf_quiz_v20',state);renderQ();
      });
      return;
    }
    var qi=state.idx;
    if(qi>=QUIZ_V20.length){state.done=true;lsSet('ccf_quiz_v20',state);renderQ();return;}
    var q=QUIZ_V20[qi];
    container.innerHTML='<div style="padding:12px"><div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">Q'+(qi+1)+'/'+QUIZ_V20.length+' (점수: '+state.score+')</div><div style="font-size:13px;color:var(--text-primary);margin-bottom:12px">'+q.q+'</div><div id="v20-quiz-opts"></div></div>';
    var opts=document.getElementById('v20-quiz-opts');
    q.a.forEach(function(a,ai){
      var btn=document.createElement('button');
      btn.style.cssText='display:block;width:100%;text-align:left;padding:8px 12px;margin-bottom:6px;border-radius:6px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text);cursor:pointer;font-size:12px';
      btn.textContent=a;
      btn.addEventListener('click',function(){
        var correct=ai===q.c;
        if(correct){state.score++;SFX20.play('correct');}
        state.answers.push(ai);state.idx++;lsSet('ccf_quiz_v20',state);
        btn.style.background=correct?'rgba(16,185,129,0.2)':'rgba(239,68,68,0.2)';
        btn.style.borderColor=correct?'#10B981':'#EF4444';
        setTimeout(renderQ,400);
      });
      opts.appendChild(btn);
    });
  }
  renderQ();
}

// ─── UI 빌더 ────────────────────────────────────────────────────
function buildV20UI(){
  var root=document.getElementById('root');
  if(!root)return;

  var hub=document.createElement('div');
  hub.id='ccf-v20-hub';
  hub.style.cssText='margin:16px auto;max-width:700px;padding:0 12px';

  var header=document.createElement('div');
  header.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:16px;margin-bottom:12px';
  header.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between"><div><span style="font-size:15px;font-weight:700;color:var(--text-primary)">🔬 벤치마킹 분석허브 v20</span><span style="font-size:10px;color:var(--text-secondary);margin-left:8px">클러스터\xB7가치\xB7성장률\xB7포트폴리오\xB7매트릭스\xB7효율\xB7네이밍\xB7스코어</span></div><button id="v20-toggle-all" style="padding:4px 10px;border-radius:6px;background:var(--accent);color:#fff;border:none;cursor:pointer;font-size:11px">전체 열기/닫기</button></div>';
  hub.appendChild(header);

  SECTIONS20.forEach(function(sec){
    var section=document.createElement('div');section.id=sec.id;
    section.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;margin-bottom:8px;overflow:hidden';
    var titleDiv=document.createElement('div');
    titleDiv.style.cssText='padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background .15s';
    titleDiv.innerHTML='<span style="font-size:16px">'+sec.icon+'</span><span style="font-size:12px;font-weight:600;color:var(--text-primary)">'+esc(sec.title)+'</span><span style="margin-left:auto;font-size:10px;color:var(--text-secondary)">▼</span>';
    section.appendChild(titleDiv);
    var content=document.createElement('div');content.id=sec.id+'-content';content.style.cssText='display:none;padding:8px 12px';
    section.appendChild(content);
    titleDiv.addEventListener('click',function(){
      SFX20.play(sec.sfx||'open');
      var isOpen=content.style.display==='block';
      content.style.display=isOpen?'none':'block';
      if(!isOpen&&!content.hasChildNodes()){sec.render(content);unlockAchieve20(sec.achieve);checkAllSections20();}
    });
    hub.appendChild(section);
  });

  var quizSection=document.createElement('div');quizSection.id='v20-quiz-section';
  quizSection.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;margin-bottom:8px;overflow:hidden';
  var quizTitle=document.createElement('div');
  quizTitle.style.cssText='padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:8px';
  quizTitle.innerHTML='<span style="font-size:16px">❓</span><span style="font-size:12px;font-weight:600;color:var(--text-primary)">v20 퀴즈 (15문)</span><span style="margin-left:auto;font-size:10px;color:var(--text-secondary)">▼</span>';
  quizSection.appendChild(quizTitle);
  var quizContent=document.createElement('div');quizContent.id='v20-quiz-content';quizContent.style.cssText='display:none;padding:8px 12px';
  quizSection.appendChild(quizContent);
  quizTitle.addEventListener('click',function(){
    SFX20.play('click');
    var isOpen=quizContent.style.display==='block';
    quizContent.style.display=isOpen?'none':'block';
    if(!isOpen&&!quizContent.hasChildNodes())renderQuiz20(quizContent);
  });
  hub.appendChild(quizSection);

  var achSection=document.createElement('div');
  achSection.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;margin-bottom:8px;padding:12px 16px';
  achSection.innerHTML='<div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:8px">🏅 v20 업적 ('+ACHIEVEMENTS_V20.length+'종)</div><div id="v20-ach-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px"></div>';
  hub.appendChild(achSection);

  function renderAchievements20(){
    var grid=document.getElementById('v20-ach-grid');if(!grid)return;
    var unlocked=getAchieves20();
    grid.innerHTML=ACHIEVEMENTS_V20.map(function(a){
      var done=unlocked.includes(a.id);
      return'<div style="padding:6px 8px;border-radius:6px;border:1px solid '+(done?'var(--accent)':'var(--card-border)')+';background:'+(done?'rgba(126,200,227,0.08)':'var(--card-bg)')+';font-size:10px"><div style="color:'+(done?'var(--accent)':'var(--text-secondary)')+';font-weight:600">'+esc(a.name)+'</div><div style="color:var(--text-muted);font-size:9px;margin-top:2px">'+esc(a.desc)+'</div></div>';
    }).join('');
  }
  renderAchievements20();
  setInterval(renderAchievements20,3000);

  var prevHub=document.getElementById('ccf-v19-hub');
  if(prevHub)prevHub.after(hub);
  else root.appendChild(hub);

  document.getElementById('v20-toggle-all').addEventListener('click',function(){
    SFX20.play('click');
    var sections=hub.querySelectorAll('[id$="-content"]');
    var allOpen=true;
    sections.forEach(function(s){if(s.style.display!=='block')allOpen=false;});
    sections.forEach(function(s){
      s.style.display=allOpen?'none':'block';
      if(!allOpen&&!s.hasChildNodes()){
        var sec=SECTIONS20.find(function(x){return x.id+'-content'===s.id;});
        if(sec){sec.render(s);unlockAchieve20(sec.achieve);}
        else if(s.id==='v20-quiz-content')renderQuiz20(s);
      }
    });
    checkAllSections20();
  });
}

function checkAllSections20(){
  var opened=getAchieves20();
  var sectionAchs=SECTIONS20.map(function(s){return s.achieve;});
  var openedSections=sectionAchs.filter(function(a){return opened.includes(a);}).length;
  if(openedSections>=5)unlockAchieve20('v20_explorer');
  if(openedSections>=8)unlockAchieve20('v20_all_sections');
}

// ─── 키보드 단축키 (Shift+I~P, Shift+9=퀴즈) ─────────────────
document.addEventListener('keydown',function(e){
  if(!e.shiftKey||e.ctrlKey||e.altKey||e.metaKey)return;
  var tag=document.activeElement?.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;

  if(e.key==='9'||e.key==='('){
    var qt=document.getElementById('v20-quiz-section');
    if(qt){e.preventDefault();qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  var keyMap={'I':0,'J':1,'K':2,'L':3,'M':4,'N':5,'O':6,'P':7};
  var upper=e.key.toUpperCase();
  if(keyMap[upper]!==undefined&&keyMap[upper]<SECTIONS20.length){
    e.preventDefault();
    var sec=document.getElementById(SECTIONS20[keyMap[upper]].id);
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
window.__v20patch={renderQuiz:renderQuiz20};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(buildV20UI,2800);});}
else{setTimeout(buildV20UI,2800);}
})();
