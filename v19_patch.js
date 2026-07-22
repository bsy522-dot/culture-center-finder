/**
 * culture-center-finder v19.0 patch
 * 실데이터 전용 Canvas 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 데이터 없음
 * 시간대별가격분석+카테고리수명분석+브랜드경쟁력매트릭스+수강료구간트리맵+요일별선호레이더+대상별바이올린+시간표밀도히트맵+강좌추천엔진+퀴즈15(210→225)+업적12(186→198)+SFX12종+키보드8종
 */
(function(){
'use strict';
const V19_ID='ccf-v19-patch';
if(document.getElementById(V19_ID))return;
const marker=document.createElement('meta');marker.id=V19_ID;document.head.appendChild(marker);

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

const SLOTS19=['오전(6~9)','오전(9~12)','오후(12~15)','오후(15~18)','저녁(18~21)','야간(21~)'];
function getSlot19(h){if(h<6)return-1;if(h<9)return 0;if(h<12)return 1;if(h<15)return 2;if(h<18)return 3;if(h<21)return 4;return 5;}
const PRANGES=['무료','~5만','5~10만','10~20만','20~30만','30만+'];
function getPRange19(p){if(p<=0)return 0;if(p<=50000)return 1;if(p<=100000)return 2;if(p<=200000)return 3;if(p<=300000)return 4;return 5;}

function layoutTreemap(items,x,y,w,h){
  if(!items.length)return[];
  if(items.length===1)return[{n:items[0].n,v:items[0].v,x:x,y:y,w:w,h:h}];
  var total=items.reduce(function(s,i){return s+i.v;},0);
  if(total<=0)return[];
  var half=total/2,sum=0,si=1;
  for(var i=0;i<items.length-1;i++){sum+=items[i].v;if(sum>=half){si=i+1;break;}}
  var left=items.slice(0,si),right=items.slice(si);
  var ls=left.reduce(function(s,i){return s+i.v;},0),r=ls/total;
  if(w>=h){var lw=w*r;return layoutTreemap(left,x,y,lw,h).concat(layoutTreemap(right,x+lw,y,w-lw,h));}
  var lh=h*r;return layoutTreemap(left,x,y,w,lh).concat(layoutTreemap(right,x,y+lh,w,h-lh));
}

// ─── SFX 엔진 v19 ─────────────────────────────────────────────
const SFX19={
  _ctx:null,
  _get(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  play(type){
    const c=this._get();if(!c)return;
    const o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);g.gain.value=0.06;
    const t=c.currentTime;
    switch(type){
      case'click':o.frequency.value=480;g.gain.exponentialRampToValueAtTime(0.001,t+0.05);o.start(t);o.stop(t+0.05);break;
      case'open':o.frequency.value=550;o.frequency.linearRampToValueAtTime(770,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'slide':o.type='triangle';o.frequency.value=400;o.frequency.linearRampToValueAtTime(500,t+0.15);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);o.start(t);o.stop(t+0.18);break;
      case'chart':o.frequency.value=620;o.frequency.linearRampToValueAtTime(440,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'matrix':o.type='sawtooth';o.frequency.value=370;g.gain.value=0.04;g.gain.exponentialRampToValueAtTime(0.001,t+0.1);o.start(t);o.stop(t+0.1);break;
      case'tree':o.type='triangle';o.frequency.value=500;o.frequency.linearRampToValueAtTime(800,t+0.15);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'spin':o.frequency.value=700;o.frequency.linearRampToValueAtTime(350,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'violin':o.type='triangle';o.frequency.value=460;o.frequency.linearRampToValueAtTime(480,t+0.05);o.frequency.linearRampToValueAtTime(440,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.14);o.start(t);o.stop(t+0.14);break;
      case'grid':o.type='square';o.frequency.value=520;g.gain.value=0.03;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);break;
      case'match':o.frequency.value=660;o.frequency.linearRampToValueAtTime(1100,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'correct':o.type='triangle';o.frequency.value=784;o.frequency.linearRampToValueAtTime(1047,t+0.15);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'unlock':o.type='sine';o.frequency.value=440;o.frequency.linearRampToValueAtTime(880,t+0.15);o.frequency.linearRampToValueAtTime(1320,t+0.3);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);o.start(t);o.stop(t+0.35);break;
      default:o.frequency.value=500;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);
    }
  }
};

// ─── 업적 시스템 v19 ───────────────────────────────────────────
const ACH19_KEY='ccf_achieve_v19';
function getAchieves19(){return lsGet(ACH19_KEY,[]);}
function unlockAchieve19(id){
  if(!id)return;const arr=getAchieves19();
  if(arr.includes(id))return;arr.push(id);lsSet(ACH19_KEY,arr);SFX19.play('unlock');
}

const ACHIEVEMENTS_V19=[
  {id:'v19_time_price',name:'시간대 분석가',desc:'시간대별 가격 분석기 열기'},
  {id:'v19_cat_duration',name:'수명 분석관',desc:'카테고리별 수명 분석기 열기'},
  {id:'v19_brand_matrix',name:'브랜드 매트릭스',desc:'센터 브랜드 경쟁력 매트릭스 열기'},
  {id:'v19_treemap',name:'트리맵 탐험가',desc:'수강료 구간별 트리맵 열기'},
  {id:'v19_day_radar',name:'요일 레이더',desc:'요일별 카테고리 선호도 열기'},
  {id:'v19_violin',name:'바이올린 감상가',desc:'대상별 수강료 바이올린 플롯 열기'},
  {id:'v19_heatmap',name:'시간표 해독가',desc:'센터별 시간표 밀도 히트맵 열기'},
  {id:'v19_recommend',name:'추천 엔진 가동',desc:'강좌 추천 매칭 엔진 열기'},
  {id:'v19_all_sections',name:'v19 완전정복',desc:'v19 8섹션 모두 열기'},
  {id:'v19_quiz_clear',name:'v19 퀴즈 클리어',desc:'v19 퀴즈 완주'},
  {id:'v19_quiz_s',name:'v19 퀴즈 S등급',desc:'v19 퀴즈 12문 이상 정답'},
  {id:'v19_explorer',name:'v19 탐험가',desc:'v19 5개 이상 섹션 열기'}
];

// ─── 섹션 정의 ─────────────────────────────────────────────────
const SECTIONS19=[
  {id:'v19-time-price',title:'시간대별 가격 분석기',icon:'⏰',achieve:'v19_time_price',sfx:'chart',render:renderTimePriceAnalyzer},
  {id:'v19-cat-duration',title:'카테고리별 강좌 수명 분석기',icon:'📏',achieve:'v19_cat_duration',sfx:'slide',render:renderCategoryDuration},
  {id:'v19-brand-matrix',title:'센터 브랜드 경쟁력 매트릭스',icon:'🏢',achieve:'v19_brand_matrix',sfx:'matrix',render:renderBrandMatrix},
  {id:'v19-price-tree',title:'수강료 구간별 카테고리 트리맵',icon:'🌳',achieve:'v19_treemap',sfx:'tree',render:renderPriceTreemap},
  {id:'v19-day-radar',title:'요일별 카테고리 선호도 레이더',icon:'📡',achieve:'v19_day_radar',sfx:'spin',render:renderDayPreference},
  {id:'v19-violin',title:'대상별 수강료 분포 바이올린',icon:'🎻',achieve:'v19_violin',sfx:'violin',render:renderTargetViolin},
  {id:'v19-sched-heat',title:'센터별 시간표 밀도 히트맵',icon:'🗓️',achieve:'v19_heatmap',sfx:'grid',render:renderScheduleHeatmap},
  {id:'v19-recommend',title:'강좌 추천 적합도 매칭 엔진',icon:'🎯',achieve:'v19_recommend',sfx:'match',render:renderCourseRecommend}
];

// ─── 1. 시간대별 가격 분석기 ───────────────────────────────────
function renderTimePriceAnalyzer(container){
  const data=getData();
  const slotData=SLOTS19.map(()=>({prices:[],cats:{}}));
  data.forEach(d=>{
    const h=parseHour(d[7]);const slot=getSlot19(h);if(slot<0)return;
    const p=parsePrice(d[8]);if(p<=0)return;
    const cat=d[3]||'기타';
    slotData[slot].prices.push(p);
    slotData[slot].cats[cat]=(slotData[slot].cats[cat]||0)+1;
  });
  const avgs=slotData.map(s=>s.prices.length>0?Math.round(s.prices.reduce((a,b)=>a+b,0)/s.prices.length):0);
  const maxAvg=Math.max(...avgs,1);

  const W=620,H=400;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  let drillSlot=-1;
  function draw(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';

    if(drillSlot<0){
      ctx.fillText('⏰ 시간대별 평균 수강료',W/2,22);
      ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
      ctx.fillText('(클릭: 해당 시간대 카테고리 분포 확인)',W/2,38);
      const lp=70,tp=55,rp=40,bp=60;
      const plotW=W-lp-rp,plotH=H-tp-bp,barW=plotW/6;
      for(let i=0;i<=4;i++){
        const y=tp+i*(plotH/4);const val=Math.round(maxAvg*(1-i/4));
        ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='right';
        ctx.fillText((val/1000).toFixed(0)+'k원',lp-8,y+3);
        ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.beginPath();ctx.moveTo(lp,y);ctx.lineTo(W-rp,y);ctx.stroke();
      }
      SLOTS19.forEach((label,i)=>{
        const x=lp+i*barW;const bh=(avgs[i]/maxAvg)*plotH;const by=tp+plotH-bh;
        ctx.fillStyle=COLORS[i*3%COLORS.length];
        ctx.beginPath();ctx.roundRect(x+6,by,barW-12,bh,[4,4,0,0]);ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
        if(bh>20)ctx.fillText(avgs[i].toLocaleString()+'원',x+barW/2,by+bh/2+4);
        ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';
        ctx.fillText(label,x+barW/2,tp+plotH+14);
        ctx.fillStyle='#556173';ctx.font='8px sans-serif';
        ctx.fillText(slotData[i].prices.length+'건',x+barW/2,tp+plotH+26);
      });
    }else{
      const sd=slotData[drillSlot];
      ctx.fillText('⏰ '+SLOTS19[drillSlot]+' 카테고리 분포',W/2,22);
      ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
      ctx.fillText('(클릭: 전체 보기로 돌아가기 | 총 '+sd.prices.length+'건)',W/2,38);
      const entries=Object.entries(sd.cats).sort((a,b)=>b[1]-a[1]).slice(0,12);
      const maxCat=entries.length>0?entries[0][1]:1;
      const lp=120,tp=55,rp=60,barH=22,gap=3;
      entries.forEach((e,i)=>{
        const y=tp+i*(barH+gap);
        const bw=Math.max(2,(e[1]/maxCat)*(W-lp-rp));
        ctx.fillStyle=COLORS[i%COLORS.length];
        ctx.beginPath();ctx.roundRect(lp,y,bw,barH,[0,4,4,0]);ctx.fill();
        ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
        ctx.fillText(e[0].length>10?e[0].slice(0,10)+'..':e[0],lp-6,y+15);
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
        ctx.fillText(e[1]+'건',lp+bw+4,y+15);
      });
    }
  }
  draw();
  canvas.addEventListener('click',function(e){
    if(drillSlot>=0){drillSlot=-1;SFX19.play('chart');draw();return;}
    const rect=canvas.getBoundingClientRect();const sx=W/rect.width;
    const mx=(e.clientX-rect.left)*sx;
    const lp=70,rp=40,barW=(W-lp-rp)/6;
    const idx=Math.floor((mx-lp)/barW);
    if(idx>=0&&idx<6){drillSlot=idx;SFX19.play('open');draw();}
  });
}

// ─── 2. 카테고리별 강좌 수명 분석기 ────────────────────────────
function renderCategoryDuration(container){
  const data=getData();
  const catMap={};
  data.forEach(d=>{
    const cat=d[3]||'기타';const sessions=parseInt(d[14])||0;const p=parsePrice(d[8]);
    if(sessions<=0)return;
    if(!catMap[cat])catMap[cat]={sumS:0,sumP:0,cnt:0};
    catMap[cat].sumS+=sessions;catMap[cat].sumP+=p;catMap[cat].cnt++;
  });
  const entries=Object.entries(catMap).filter(e=>e[1].cnt>=10).map(e=>({
    name:e[0],avgS:Math.round(e[1].sumS/e[1].cnt*10)/10,
    avgPPS:e[1].sumS>0?Math.round(e[1].sumP/e[1].sumS):0,cnt:e[1].cnt
  })).sort((a,b)=>b.avgS-a.avgS).slice(0,10);

  const W=600,H=380;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  let showPPS=false;
  function draw(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    const title=showPPS?'📏 1회당 평균 수강료 (카테고리별)':'📏 카테고리별 평균 수강 횟수';
    ctx.fillText(title,W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(클릭: 횟수 ↔ 1회당 가격 전환 | 최소 10강좌 이상)',W/2,38);
    const lp=100,tp=55,rp=60,barH=26,gap=4;
    const maxVal=showPPS?Math.max(...entries.map(e=>e.avgPPS),1):Math.max(...entries.map(e=>e.avgS),1);
    const barArea=W-lp-rp;
    entries.forEach((item,i)=>{
      const y=tp+i*(barH+gap);
      const val=showPPS?item.avgPPS:item.avgS;
      const bw=Math.max(2,(val/maxVal)*barArea);
      ctx.fillStyle=COLORS[i%COLORS.length];
      ctx.beginPath();ctx.roundRect(lp,y,bw,barH,[0,4,4,0]);ctx.fill();
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
      ctx.fillText(item.name.length>8?item.name.slice(0,8)+'..':item.name,lp-6,y+17);
      ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
      const label=showPPS?item.avgPPS.toLocaleString()+'원/회':item.avgS+'회 (Ø)';
      ctx.fillText(label,lp+bw+4,y+17);
    });
    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('분석 대상: '+entries.length+'개 카테고리 | '+entries.reduce((s,e)=>s+e.cnt,0).toLocaleString()+'건 강좌',W/2,H-10);
  }
  draw();
  canvas.addEventListener('click',()=>{showPPS=!showPPS;SFX19.play('slide');draw();});
}

// ─── 3. 센터 브랜드 경쟁력 매트릭스 ────────────────────────────
function renderBrandMatrix(container){
  const data=getData();
  const brands={};
  data.forEach(d=>{
    const type=d[0]||'기타';
    if(!brands[type])brands[type]={prices:[],cats:new Set(),hours:new Set(),targets:new Set(),regions:new Set(),count:0};
    const b=brands[type];b.count++;
    const p=parsePrice(d[8]);if(p>0)b.prices.push(p);
    b.cats.add(d[3]||'기타');
    const h=parseHour(d[7]);if(h>=0)b.hours.add(h);
    b.targets.add(d[5]||'');
    const r=parseRegion(d[15]||'');if(r!=='미상')b.regions.add(r);
  });
  const brandArr=Object.entries(brands).sort((a,b)=>b[1].count-a[1].count).slice(0,8);
  const axes=['가격경쟁력','카테고리다양성','시간대범위','지역커버리지','강좌수','대상다양성'];

  function getScores(b){
    const avgP=b.prices.length>0?b.prices.reduce((s,v)=>s+v,0)/b.prices.length:0;
    return[
      avgP>0?Math.min(100,Math.max(10,100-avgP/3000)):50,
      Math.min(100,b.cats.size*6),
      Math.min(100,b.hours.size*8),
      Math.min(100,b.regions.size*5),
      Math.min(100,b.count/80*100),
      Math.min(100,b.targets.size*18)
    ];
  }

  const W=640,H=420;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:640px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  let selIdx=0;
  function draw(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🏢 센터 브랜드 경쟁력 레이더',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(클릭으로 브랜드 전환 | 6축: 가격\xB7카테고리\xB7시간\xB7지역\xB7강좌수\xB7대상)',W/2,38);
    const cx=W/2-40,cy=H/2+10,radius=130,n=axes.length;
    for(let ring=1;ring<=5;ring++){
      const r=radius*ring/5;ctx.beginPath();
      for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;const x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
      ctx.closePath();ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.stroke();
    }
    for(let i=0;i<n;i++){
      const a=-Math.PI/2+i*2*Math.PI/n;
      const ex=cx+radius*Math.cos(a),ey=cy+radius*Math.sin(a);
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.stroke();
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='center';
      const lx=cx+(radius+20)*Math.cos(a),ly=cy+(radius+20)*Math.sin(a);
      ctx.fillText(axes[i],lx,ly+4);
    }
    brandArr.forEach(([name,b],bi)=>{
      const scores=getScores(b);const isSel=bi===selIdx;
      ctx.beginPath();
      scores.forEach((score,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;const r=radius*score/100;const x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
      ctx.closePath();ctx.strokeStyle=COLORS[bi];ctx.lineWidth=isSel?2.5:1;ctx.stroke();
      if(isSel){ctx.fillStyle=COLORS[bi]+'33';ctx.fill();}
      ctx.lineWidth=1;
    });
    const selScores=getScores(brandArr[selIdx][1]);
    ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='right';
    ctx.fillText(brandArr[selIdx][0]+' 상세',W-16,60);
    ctx.font='9px sans-serif';ctx.fillStyle='#8ba4c4';
    axes.forEach((ax,i)=>{ctx.fillText(ax+': '+selScores[i].toFixed(0)+'/100',W-16,75+i*13);});
    ctx.fillText('강좌 수: '+brandArr[selIdx][1].count.toLocaleString(),W-16,75+axes.length*13);
    const ly=H-35;
    brandArr.forEach(([name],i)=>{
      const col=i%4,row=Math.floor(i/4);
      const lx=20+col*155,lly=ly+row*16;
      ctx.fillStyle=COLORS[i];ctx.fillRect(lx,lly,10,10);
      ctx.fillStyle=i===selIdx?'#fff':'#8ba4c4';ctx.font=(i===selIdx?'bold ':'')+'9px sans-serif';ctx.textAlign='left';
      ctx.fillText(name.length>14?name.slice(0,14)+'..':name,lx+14,lly+9);
    });
  }
  draw();
  canvas.addEventListener('click',()=>{selIdx=(selIdx+1)%brandArr.length;SFX19.play('matrix');draw();});
}

// ─── 4. 수강료 구간별 카테고리 트리맵 ──────────────────────────
function renderPriceTreemap(container){
  const data=getData();
  const rangeData=PRANGES.map(()=>({}));
  data.forEach(d=>{
    const p=parsePrice(d[8]);const ri=getPRange19(p);const cat=d[3]||'기타';
    rangeData[ri][cat]=(rangeData[ri][cat]||0)+1;
  });
  const rangeTotals=rangeData.map(m=>Object.values(m).reduce((s,v)=>s+v,0));

  const W=620,H=400;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  let drillIdx=-1;
  function draw(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    const lp=15,tp=55,rp=15,bp=30;
    const tw=W-lp-rp,th=H-tp-bp;

    if(drillIdx<0){
      ctx.fillText('🌳 수강료 구간별 카테고리 트리맵',W/2,22);
      ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
      ctx.fillText('(클릭: 구간 상세 보기 | 블록 크기 = 강좌 수 비율)',W/2,38);
      const items=PRANGES.map((name,i)=>({n:name,v:rangeTotals[i],idx:i})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v);
      const rects=layoutTreemap(items,lp,tp,tw,th);
      rects.forEach((r,ri)=>{
        ctx.fillStyle=COLORS[r.idx*3%COLORS.length]+'88';
        ctx.fillRect(r.x+1,r.y+1,r.w-2,r.h-2);
        ctx.strokeStyle=COLORS[r.idx*3%COLORS.length];ctx.strokeRect(r.x+1,r.y+1,r.w-2,r.h-2);
        if(r.w>40&&r.h>30){
          ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
          ctx.fillText(r.n,r.x+r.w/2,r.y+r.h/2-4);
          ctx.font='9px sans-serif';ctx.fillStyle='#d4d4d4';
          ctx.fillText(r.v.toLocaleString()+'건',r.x+r.w/2,r.y+r.h/2+10);
        }
      });
    }else{
      const rd=rangeData[drillIdx];
      ctx.fillText('🌳 '+PRANGES[drillIdx]+' 구간 카테고리 상세',W/2,22);
      ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
      ctx.fillText('(클릭: 전체 보기로 돌아가기 | 총 '+rangeTotals[drillIdx].toLocaleString()+'건)',W/2,38);
      const items=Object.entries(rd).map(([n,v])=>({n,v})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v);
      const rects=layoutTreemap(items,lp,tp,tw,th);
      rects.forEach((r,ri)=>{
        ctx.fillStyle=COLORS[ri%COLORS.length]+'88';
        ctx.fillRect(r.x+1,r.y+1,r.w-2,r.h-2);
        ctx.strokeStyle=COLORS[ri%COLORS.length];ctx.strokeRect(r.x+1,r.y+1,r.w-2,r.h-2);
        if(r.w>35&&r.h>25){
          ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
          const lbl=r.n.length>8?r.n.slice(0,8)+'..':r.n;
          ctx.fillText(lbl,r.x+r.w/2,r.y+r.h/2-2);
          ctx.font='9px sans-serif';ctx.fillStyle='#d4d4d4';
          ctx.fillText(r.v.toLocaleString()+'건',r.x+r.w/2,r.y+r.h/2+12);
        }
      });
    }
  }
  draw();
  canvas.addEventListener('click',function(e){
    if(drillIdx>=0){drillIdx=-1;SFX19.play('tree');draw();return;}
    const rect=canvas.getBoundingClientRect();const sx=W/rect.width,sy=H/rect.height;
    const mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
    const lp=15,tp=55,rp=15,bp=30,tw=W-lp-rp,th=H-tp-bp;
    const items=PRANGES.map((name,i)=>({n:name,v:rangeTotals[i],idx:i})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v);
    const rects=layoutTreemap(items,lp,tp,tw,th);
    for(let i=0;i<rects.length;i++){
      const r=rects[i];
      if(mx>=r.x&&mx<=r.x+r.w&&my>=r.y&&my<=r.y+r.h){drillIdx=r.idx;SFX19.play('open');draw();return;}
    }
  });
}

// ─── 5. 요일별 카테고리 선호도 레이더 ──────────────────────────
function renderDayPreference(container){
  const data=getData();
  const dayLabels=['월','화','수','목','금','토','일'];
  const catDays={};
  data.forEach(d=>{
    const cat=d[3]||'기타';const days=parseDays(d[6]||'');
    if(!catDays[cat])catDays[cat]={};
    days.forEach(day=>{catDays[cat][day]=(catDays[cat][day]||0)+1;});
  });
  const catTotals={};
  Object.entries(catDays).forEach(([cat,m])=>{catTotals[cat]=Object.values(m).reduce((s,v)=>s+v,0);});
  const topCats=Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).slice(0,8).map(e=>e[0]);

  const W=600,H=400;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  let catIdx=0;
  function draw(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    const cat=topCats[catIdx]||'';
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('📡 요일별 카테고리 선호도: '+cat,W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(클릭: 다음 카테고리 | '+(catIdx+1)+'/'+topCats.length+')',W/2,38);
    const cx=W/2,cy=H/2+15,radius=125,n=dayLabels.length;
    for(let ring=1;ring<=5;ring++){
      const r=radius*ring/5;ctx.beginPath();
      for(let i=0;i<n;i++){const a=-Math.PI/2+i*2*Math.PI/n;i===0?ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a)):ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));}
      ctx.closePath();ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.stroke();
    }
    for(let i=0;i<n;i++){
      const a=-Math.PI/2+i*2*Math.PI/n;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+radius*Math.cos(a),cy+radius*Math.sin(a));ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.stroke();
      ctx.fillStyle='#d4d4d4';ctx.font='11px sans-serif';ctx.textAlign='center';
      ctx.fillText(dayLabels[i]+'요일',cx+(radius+18)*Math.cos(a),cy+(radius+18)*Math.sin(a)+4);
    }
    const cd=catDays[cat]||{};
    const maxDay=Math.max(...dayLabels.map(d=>cd[d]||0),1);
    ctx.beginPath();
    dayLabels.forEach((day,i)=>{
      const val=cd[day]||0;const a=-Math.PI/2+i*2*Math.PI/n;
      const r=radius*(val/maxDay);const x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.closePath();ctx.strokeStyle=COLORS[catIdx%COLORS.length];ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle=COLORS[catIdx%COLORS.length]+'33';ctx.fill();ctx.lineWidth=1;
    dayLabels.forEach((day,i)=>{
      const val=cd[day]||0;const a=-Math.PI/2+i*2*Math.PI/n;
      const r=radius*(val/maxDay);const x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle=COLORS[catIdx%COLORS.length];ctx.fill();
      if(val>0){ctx.fillStyle='#fff';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText(val,x,y-8);}
    });
    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('총 '+catTotals[cat]+'건 | 최대 요일: '+dayLabels.reduce((mx,d)=>(cd[d]||0)>(cd[mx]||0)?d:mx,dayLabels[0])+'요일',W/2,H-10);
  }
  draw();
  canvas.addEventListener('click',()=>{catIdx=(catIdx+1)%topCats.length;SFX19.play('spin');draw();});
}

// ─── 6. 대상별 수강료 분포 바이올린 플롯 ────────────────────────
function renderTargetViolin(container){
  const data=getData();
  const tgtLabels=['성인','영유아','유아','어린이','패밀리'];
  const tgtPrices={};tgtLabels.forEach(t=>{tgtPrices[t]=[];});
  data.forEach(d=>{
    const p=parsePrice(d[8]);if(p<=0)return;
    const tgt=d[5]||'';
    const matched=tgtLabels.find(t=>tgt.includes(t));
    if(matched)tgtPrices[matched].push(p);
  });
  tgtLabels.forEach(t=>tgtPrices[t].sort((a,b)=>a-b));
  let globalMax=0;tgtLabels.forEach(t=>{const arr=tgtPrices[t];if(arr.length>0){const p95=arr[Math.min(arr.length-1,Math.floor(arr.length*0.95))];if(p95>globalMax)globalMax=p95;}});
  if(globalMax===0)globalMax=100000;

  const W=620,H=380;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto';
  container.appendChild(canvas);

  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('🎻 대상별 수강료 분포 (바이올린 플롯)',W/2,22);
  ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
  ctx.fillText('넓은 부분 = 해당 가격대에 강좌가 많음 | 희선 = 중앙값',W/2,38);

  const lp=60,tp=55,rp=20,bp=40;
  const plotW=W-lp-rp,plotH=H-tp-bp;
  const colW=plotW/tgtLabels.length;
  const nBins=30;
  const tgtColors=['#7EC8E3','#F59E0B','#10B981','#EC4899','#8B5CF6'];

  for(let i=0;i<=4;i++){
    const y=tp+i*(plotH/4);const val=Math.round(globalMax*(1-i/4));
    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='right';
    ctx.fillText((val/10000).toFixed(0)+'만',lp-8,y+3);
    ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.beginPath();ctx.moveTo(lp,y);ctx.lineTo(W-rp,y);ctx.stroke();
  }

  tgtLabels.forEach((tgt,ti)=>{
    const arr=tgtPrices[tgt];
    if(arr.length<3)return;
    const cx=lp+ti*colW+colW/2;
    const maxHW=colW*0.38;
    const bins=new Array(nBins).fill(0);
    arr.forEach(p=>{const idx=Math.min(nBins-1,Math.floor(Math.min(p,globalMax)/globalMax*nBins));bins[idx]++;});
    const maxBin=Math.max(...bins,1);

    ctx.beginPath();
    for(let i=0;i<nBins;i++){const y=tp+plotH-(i/nBins)*plotH;const hw=(bins[i]/maxBin)*maxHW;ctx.lineTo(cx-hw,y);}
    for(let i=nBins-1;i>=0;i--){const y=tp+plotH-(i/nBins)*plotH;const hw=(bins[i]/maxBin)*maxHW;ctx.lineTo(cx+hw,y);}
    ctx.closePath();ctx.fillStyle=tgtColors[ti]+'44';ctx.fill();ctx.strokeStyle=tgtColors[ti];ctx.lineWidth=1.5;ctx.stroke();ctx.lineWidth=1;

    function q(pct){return arr[Math.min(arr.length-1,Math.floor(arr.length*pct))];}
    const med=q(0.5),q1=q(0.25),q3=q(0.75);
    [q1,q3].forEach(v=>{
      const y=tp+plotH-(Math.min(v,globalMax)/globalMax)*plotH;
      ctx.strokeStyle=tgtColors[ti];ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(cx-maxHW*0.5,y);ctx.lineTo(cx+maxHW*0.5,y);ctx.stroke();ctx.setLineDash([]);
    });
    const medY=tp+plotH-(Math.min(med,globalMax)/globalMax)*plotH;
    ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-maxHW*0.6,medY);ctx.lineTo(cx+maxHW*0.6,medY);ctx.stroke();ctx.lineWidth=1;
    ctx.fillStyle='#fff';ctx.font='8px sans-serif';ctx.textAlign='center';
    ctx.fillText((med/10000).toFixed(1)+'만',cx,medY-6);

    ctx.fillStyle=tgtColors[ti];ctx.font='10px sans-serif';ctx.textAlign='center';
    ctx.fillText(tgt,cx,H-bp+14);
    ctx.fillStyle='#556173';ctx.font='8px sans-serif';
    ctx.fillText(arr.length.toLocaleString()+'건',cx,H-bp+26);
  });
}

// ─── 7. 센터별 시간표 밀도 히트맵 ──────────────────────────────
function renderScheduleHeatmap(container){
  const data=getData();
  const centerCounts={};
  data.forEach(d=>{const c=d[1]||'';if(c)centerCounts[c]=(centerCounts[c]||0)+1;});
  const topCenters=Object.entries(centerCounts).sort((a,b)=>b[1]-a[1]).slice(0,10).map(e=>e[0]);

  const centerSchedule={};
  topCenters.forEach(c=>{centerSchedule[c]={};});
  const dayLabels=['월','화','수','목','금','토','일'];
  const hours=[];for(let h=8;h<=19;h++)hours.push(h);

  data.forEach(d=>{
    const c=d[1]||'';if(!centerSchedule[c])return;
    const ds=parseDays(d[6]||'');const h=parseHour(d[7]);
    if(h<8||h>19)return;
    ds.forEach(day=>{
      const key=day+'|'+h;
      centerSchedule[c][key]=(centerSchedule[c][key]||0)+1;
    });
  });

  const W=640,H=400;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:640px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  let selCenter=0;
  function draw(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    const cName=topCenters[selCenter];
    const sched=centerSchedule[cName]||{};
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🗓️ 시간표 밀도: '+(cName.length>20?cName.slice(0,20)+'..':cName),W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(클릭: 다음 센터 | '+(selCenter+1)+'/'+topCenters.length+' | '+centerCounts[cName]+'강좌)',W/2,38);

    const lp=50,tp=60,rp=30,bp=30;
    const cellW=(W-lp-rp)/dayLabels.length;
    const cellH=(H-tp-bp)/hours.length;
    let maxVal=1;
    dayLabels.forEach(day=>{hours.forEach(h=>{const v=sched[day+'|'+h]||0;if(v>maxVal)maxVal=v;});});

    ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillStyle='#d4d4d4';
    dayLabels.forEach((d,di)=>{ctx.fillText(d,lp+di*cellW+cellW/2,tp-8);});
    ctx.textAlign='right';
    hours.forEach((h,hi)=>{ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';ctx.fillText(h+'시',lp-6,tp+hi*cellH+cellH/2+3);});

    dayLabels.forEach((day,di)=>{
      hours.forEach((h,hi)=>{
        const val=sched[day+'|'+h]||0;
        const intensity=val/maxVal;
        const r=Math.round(14+intensity*120);
        const g=Math.round(180*intensity);
        const b=Math.round(227*(1-intensity*0.6));
        ctx.fillStyle='rgba('+r+','+g+','+b+','+Math.max(0.08,intensity)+')';
        const x=lp+di*cellW,y=tp+hi*cellH;
        ctx.fillRect(x+1,y+1,cellW-2,cellH-2);
        if(val>0){
          ctx.fillStyle='rgba(255,255,255,'+(intensity>0.5?0.9:0.5)+')';
          ctx.font=(intensity>0.5?'bold ':'')+'8px sans-serif';ctx.textAlign='center';
          ctx.fillText(val,x+cellW/2,y+cellH/2+3);
        }
      });
    });

    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    const totalSlots=dayLabels.reduce((s,day)=>s+hours.reduce((ss,h)=>(sched[day+'|'+h]?1:0)+ss,0),0);
    ctx.fillText('활용 슬롯: '+totalSlots+'/'+(dayLabels.length*hours.length)+' | 피크 시간 기준',W/2,H-8);
  }
  draw();
  canvas.addEventListener('click',()=>{selCenter=(selCenter+1)%topCenters.length;SFX19.play('grid');draw();});
}

// ─── 8. 강좌 추천 적합도 매칭 엔진 ─────────────────────────────
function renderCourseRecommend(container){
  const data=getData();
  const catCounts={};
  data.forEach(d=>{catCounts[d[3]||'기타']=(catCounts[d[3]||'기타']||0)+1;});
  const topCats=Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(e=>e[0]);
  const tgtOpts=['성인','영유아','유아','어린이','패밀리'];

  const sel={slot:-1,budget:-1,cat:'',target:''};

  const uiDiv=document.createElement('div');
  uiDiv.style.cssText='padding:4px 8px;font-size:10px';

  function makeRow(label,items,key,isIdx){
    const row=document.createElement('div');
    row.style.cssText='margin-bottom:5px;display:flex;flex-wrap:wrap;align-items:center;gap:3px';
    const lbl=document.createElement('span');
    lbl.style.cssText='color:var(--text-secondary);min-width:48px;font-size:10px;font-weight:600';
    lbl.textContent=label;row.appendChild(lbl);
    items.forEach((item,i)=>{
      const btn=document.createElement('button');
      btn.style.cssText='padding:2px 7px;border-radius:4px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text-secondary);cursor:pointer;font-size:10px;transition:all .15s';
      btn.textContent=item;
      btn.addEventListener('click',()=>{
        const val=isIdx?i:item;
        sel[key]=sel[key]===val?(isIdx?-1:''):val;
        row.querySelectorAll('button').forEach((b,j)=>{
          const bVal=isIdx?j:items[j];
          const isSel=sel[key]===bVal;
          b.style.background=isSel?'var(--accent)':'var(--card-bg)';
          b.style.color=isSel?'#fff':'var(--text-secondary)';
          b.style.borderColor=isSel?'var(--accent)':'';
        });
        SFX19.play('click');drawResults();
      });
      row.appendChild(btn);
    });
    return row;
  }

  uiDiv.appendChild(makeRow('시간대:',SLOTS19.map(s=>s.replace(/[()]/g,'')),'slot',true));
  uiDiv.appendChild(makeRow('예산:',PRANGES,'budget',true));
  uiDiv.appendChild(makeRow('카테고리:',topCats,'cat',false));
  uiDiv.appendChild(makeRow('대상:',tgtOpts,'target',false));
  container.appendChild(uiDiv);

  const W=600,H=380;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
  canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;background:#0d1117;display:block;margin:8px auto';
  container.appendChild(canvas);

  const partLabels=['시간','예산','카테고리','대상'];
  const partColors=['#7EC8E3','#F59E0B','#10B981','#EC4899'];

  function drawResults(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🎯 강좌 추천 매칭 결과',W/2,22);

    const hasSel=sel.slot>=0||sel.budget>=0||sel.cat||sel.target;
    if(!hasSel){
      ctx.fillStyle='#8ba4c4';ctx.font='12px sans-serif';
      ctx.fillText('위 조건을 선택하면 매칭 결과가 표시됩니다',W/2,H/2);
      return;
    }

    const scored=[];
    data.forEach(d=>{
      let score=0;const parts=[0,0,0,0];
      const h=parseHour(d[7]);const p=parsePrice(d[8]);const cat=d[3]||'기타';const tgt=d[5]||'';
      if(sel.slot>=0&&getSlot19(h)===sel.slot){score+=25;parts[0]=25;}
      if(sel.budget>=0&&getPRange19(p)===sel.budget){score+=25;parts[1]=25;}
      if(sel.cat&&cat===sel.cat){score+=25;parts[2]=25;}
      if(sel.target&&tgt.includes(sel.target)){score+=25;parts[3]=25;}
      if(score>0)scored.push({name:d[4]||'',center:d[1]||'',price:d[8]||'',score:score,parts:parts});
    });
    scored.sort((a,b)=>b.score-a.score);
    const top5=scored.slice(0,5);

    ctx.fillStyle='#8ba4c4';ctx.font='10px sans-serif';
    ctx.fillText('총 '+scored.length.toLocaleString()+'건 매칭 (상위 5건 표시)',W/2,38);

    if(top5.length===0){
      ctx.fillStyle='#556173';ctx.font='12px sans-serif';
      ctx.fillText('조건에 맞는 강좌가 없습니다',W/2,H/2);return;
    }

    const topPad=55,leftPad=180,rightPad=50,barH=48,gap=10;
    const barArea=W-leftPad-rightPad;
    top5.forEach((item,i)=>{
      const y=topPad+i*(barH+gap);
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
      const name=item.name.length>18?item.name.slice(0,18)+'..':item.name;
      ctx.fillText(name,leftPad-6,y+16);
      ctx.fillStyle='#556173';ctx.font='9px sans-serif';
      ctx.fillText((item.center.length>14?item.center.slice(0,14)+'..':item.center)+' | '+item.price,leftPad-6,y+30);

      let bx=leftPad;
      item.parts.forEach((p,pi)=>{
        if(p>0){
          const bw=(p/100)*barArea;
          ctx.fillStyle=partColors[pi];
          ctx.fillRect(bx,y+4,bw,barH-16);
          if(bw>35){ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText(partLabels[pi],bx+bw/2,y+barH/2);}
          bx+=bw;
        }
      });
      ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='left';
      ctx.fillText(item.score+'점',bx+6,y+barH/2+1);
    });

    const ly=H-25;ctx.font='9px sans-serif';ctx.textAlign='left';
    partLabels.forEach((l,i)=>{
      const lx=50+i*135;
      ctx.fillStyle=partColors[i];ctx.fillRect(lx,ly,8,8);
      ctx.fillStyle='#d4d4d4';ctx.fillText(l+' 일치',lx+12,ly+7);
    });
  }
  drawResults();
}

// ─── 퀴즈 v19 (15문항, 210→225) ─────────────────────────────────
const QUIZ_V19=[
  {q:'트리맵(Treemap)에서 사각형의 크기가 나타내는 것은?',a:['데이터의 비율','시간 순서','지리적 위치','색상 코드'],c:0},
  {q:'바이올린 플롯에서 가장 넓은 부분이 의미하는 것은?',a:['평균값','최댓값','해당 구간에 데이터가 가장 많음','이상치'],c:2},
  {q:'레이더 차트에서 다각형 면적이 넓을수록?',a:['비용이 높음','종합 점수가 높음','데이터가 부족함','오류가 많음'],c:1},
  {q:'히트맵에서 색상이 진할수록 의미하는 것은?',a:['데이터 없음','해당 셀의 값이 높음','오류 발생','시간이 오래됨'],c:1},
  {q:'1회당 수강료를 계산하는 올바른 공식은?',a:['총 수강료 \xD7 횟수','총 수강료 \xF7 횟수','총 수강료 + 횟수','횟수 \xF7 총 수강료'],c:1},
  {q:'문화센터 강좌의 &quot;횟수&quot;가 의미하는 것은?',a:['수강생 수','전체 수업 회차 수','센터 수','카테고리 수'],c:1},
  {q:'브랜드 경쟁력 분석에서 &quot;가격경쟁력&quot;이 높다면?',a:['가격이 비싸다','가격이 상대적으로 저렴하다','강좌가 적다','접근성이 낮다'],c:1},
  {q:'요일별 카테고리 선호도 분석의 주요 목적은?',a:['가격 비교','인기 요일과 카테고리 파악','센터 위치 확인','수강생 연령 분석'],c:1},
  {q:'시간대별 가격 분석에서 저녁 시간대(18~21시) 강좌의 특징은?',a:['항상 무료','주로 어린이 대상','직장인 대상이 많음','강좌가 없음'],c:2},
  {q:'센터 시간표 밀도가 높은 시간대는 보통?',a:['새벽 4시','오전 10시 전후','자정','시간과 무관'],c:1},
  {q:'수강료 구간 중 일반적으로 강좌 수가 가장 많은 구간은?',a:['무료','~5만원','20~30만원','30만원 이상'],c:1},
  {q:'강좌 추천 시스템에서 매칭 점수가 의미하는 것은?',a:['가격 순위','사용자 선호와 강좌의 일치도','강사 평점','등록 순서'],c:1},
  {q:'카테고리별 평균 수강 횟수가 많다는 것은?',a:['비용이 저렴','해당 카테고리가 장기 과정 위주','인기가 없음','센터가 많음'],c:1},
  {q:'대상별 수강료 분포에서 &quot;중앙값(median)&quot;의 의미는?',a:['가장 많이 나타나는 값','전체 평균','가격순 정렬 시 정확히 중간인 값','가장 비싼 값'],c:2},
  {q:'문화센터 데이터 분석에서 &quot;실데이터&quot; 사용의 장점은?',a:['빠른 로딩','정확한 현황 반영','더 예쁜 차트','간단한 구현'],c:1}
];

function renderQuiz19(container){
  const state=lsGet('ccf_quiz_v19',{idx:0,score:0,done:false,answers:[]});

  function renderQ(){
    if(state.done){
      const grade=state.score>=14?'S':state.score>=12?'A':state.score>=10?'B':state.score>=7?'C':'D';
      if(state.score>=12)unlockAchieve19('v19_quiz_s');
      unlockAchieve19('v19_quiz_clear');
      container.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:28px;margin-bottom:8px">'+grade+'</div><div style="color:var(--text-secondary);font-size:13px">v19 퀴즈 완료: '+state.score+'/'+QUIZ_V19.length+'문 정답</div><button id="v19-quiz-retry" style="margin-top:12px;padding:6px 16px;border-radius:6px;background:var(--accent);color:#fff;border:none;cursor:pointer;font-size:12px">다시 풀기</button></div>';
      document.getElementById('v19-quiz-retry')?.addEventListener('click',()=>{
        state.idx=0;state.score=0;state.done=false;state.answers=[];lsSet('ccf_quiz_v19',state);renderQ();
      });
      return;
    }
    const qi=state.idx;
    if(qi>=QUIZ_V19.length){state.done=true;lsSet('ccf_quiz_v19',state);renderQ();return;}
    const q=QUIZ_V19[qi];
    container.innerHTML='<div style="padding:12px"><div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">Q'+(qi+1)+'/'+QUIZ_V19.length+' (점수: '+state.score+')</div><div style="font-size:13px;color:var(--text-primary);margin-bottom:12px">'+q.q+'</div><div id="v19-quiz-opts"></div></div>';
    const opts=document.getElementById('v19-quiz-opts');
    q.a.forEach((a,ai)=>{
      const btn=document.createElement('button');
      btn.style.cssText='display:block;width:100%;text-align:left;padding:8px 12px;margin-bottom:6px;border-radius:6px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text);cursor:pointer;font-size:12px';
      btn.textContent=a;
      btn.addEventListener('click',()=>{
        const correct=ai===q.c;
        if(correct){state.score++;SFX19.play('correct');}
        state.answers.push(ai);state.idx++;lsSet('ccf_quiz_v19',state);
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
function buildV19UI(){
  const root=document.getElementById('root');
  if(!root)return;

  const hub=document.createElement('div');
  hub.id='ccf-v19-hub';
  hub.style.cssText='margin:16px auto;max-width:700px;padding:0 12px';

  const header=document.createElement('div');
  header.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:16px;margin-bottom:12px';
  header.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between"><div><span style="font-size:15px;font-weight:700;color:var(--text-primary)">🔬 심층분석허브 v19</span><span style="font-size:10px;color:var(--text-secondary);margin-left:8px">시간대\xB7수명\xB7브랜드\xB7트리맵\xB7레이더\xB7바이올린\xB7히트맵\xB7추천</span></div><button id="v19-toggle-all" style="padding:4px 10px;border-radius:6px;background:var(--accent);color:#fff;border:none;cursor:pointer;font-size:11px">전체 열기/닫기</button></div>';
  hub.appendChild(header);

  SECTIONS19.forEach(sec=>{
    const section=document.createElement('div');section.id=sec.id;
    section.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;margin-bottom:8px;overflow:hidden';
    const titleDiv=document.createElement('div');
    titleDiv.style.cssText='padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background .15s';
    titleDiv.innerHTML='<span style="font-size:16px">'+sec.icon+'</span><span style="font-size:12px;font-weight:600;color:var(--text-primary)">'+esc(sec.title)+'</span><span style="margin-left:auto;font-size:10px;color:var(--text-secondary)">▼</span>';
    section.appendChild(titleDiv);
    const content=document.createElement('div');content.id=sec.id+'-content';content.style.cssText='display:none;padding:8px 12px';
    section.appendChild(content);
    titleDiv.addEventListener('click',()=>{
      SFX19.play(sec.sfx||'open');
      const isOpen=content.style.display==='block';
      content.style.display=isOpen?'none':'block';
      if(!isOpen&&!content.hasChildNodes()){sec.render(content);unlockAchieve19(sec.achieve);checkAllSections19();}
    });
    hub.appendChild(section);
  });

  const quizSection=document.createElement('div');quizSection.id='v19-quiz-section';
  quizSection.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;margin-bottom:8px;overflow:hidden';
  const quizTitle=document.createElement('div');
  quizTitle.style.cssText='padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:8px';
  quizTitle.innerHTML='<span style="font-size:16px">❓</span><span style="font-size:12px;font-weight:600;color:var(--text-primary)">v19 퀴즈 (15문)</span><span style="margin-left:auto;font-size:10px;color:var(--text-secondary)">▼</span>';
  quizSection.appendChild(quizTitle);
  const quizContent=document.createElement('div');quizContent.id='v19-quiz-content';quizContent.style.cssText='display:none;padding:8px 12px';
  quizSection.appendChild(quizContent);
  quizTitle.addEventListener('click',()=>{
    SFX19.play('click');
    const isOpen=quizContent.style.display==='block';
    quizContent.style.display=isOpen?'none':'block';
    if(!isOpen&&!quizContent.hasChildNodes())renderQuiz19(quizContent);
  });
  hub.appendChild(quizSection);

  const achSection=document.createElement('div');
  achSection.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;margin-bottom:8px;padding:12px 16px';
  achSection.innerHTML='<div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:8px">🏅 v19 업적 ('+ACHIEVEMENTS_V19.length+'종)</div><div id="v19-ach-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px"></div>';
  hub.appendChild(achSection);

  function renderAchievements19(){
    const grid=document.getElementById('v19-ach-grid');if(!grid)return;
    const unlocked=getAchieves19();
    grid.innerHTML=ACHIEVEMENTS_V19.map(a=>{
      const done=unlocked.includes(a.id);
      return'<div style="padding:6px 8px;border-radius:6px;border:1px solid '+(done?'var(--accent)':'var(--card-border)')+';background:'+(done?'rgba(126,200,227,0.08)':'var(--card-bg)')+';font-size:10px"><div style="color:'+(done?'var(--accent)':'var(--text-secondary)')+';font-weight:600">'+esc(a.name)+'</div><div style="color:var(--text-muted);font-size:9px;margin-top:2px">'+esc(a.desc)+'</div></div>';
    }).join('');
  }
  renderAchievements19();
  setInterval(renderAchievements19,3000);

  const prevHub=document.getElementById('ccf-v18-hub');
  if(prevHub)prevHub.after(hub);
  else root.appendChild(hub);

  document.getElementById('v19-toggle-all').addEventListener('click',function(){
    SFX19.play('click');
    const sections=hub.querySelectorAll('[id$="-content"]');
    const allOpen=[...sections].every(s=>s.style.display==='block');
    sections.forEach(s=>{
      s.style.display=allOpen?'none':'block';
      if(!allOpen&&!s.hasChildNodes()){
        const sec=SECTIONS19.find(x=>x.id+'-content'===s.id);
        if(sec){sec.render(s);unlockAchieve19(sec.achieve);}
        else if(s.id==='v19-quiz-content')renderQuiz19(s);
      }
    });
    checkAllSections19();
  });
}

function checkAllSections19(){
  const opened=getAchieves19();
  const sectionAchs=SECTIONS19.map(s=>s.achieve);
  const openedSections=sectionAchs.filter(a=>opened.includes(a)).length;
  if(openedSections>=5)unlockAchieve19('v19_explorer');
  if(openedSections>=8)unlockAchieve19('v19_all_sections');
}

// ─── 키보드 단축키 (Shift+A~H, Shift+0=퀴즈) ──────────────────
document.addEventListener('keydown',function(e){
  if(!e.shiftKey||e.ctrlKey||e.altKey||e.metaKey)return;
  const tag=document.activeElement?.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;

  if(e.key==='0'||e.key===')'){
    const qt=document.getElementById('v19-quiz-section');
    if(qt){e.preventDefault();qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  const keyMap={'A':0,'B':1,'C':2,'D':3,'E':4,'F':5,'G':6,'H':7};
  const upper=e.key.toUpperCase();
  if(keyMap[upper]!==undefined&&keyMap[upper]<SECTIONS19.length){
    e.preventDefault();
    const sec=document.getElementById(SECTIONS19[keyMap[upper]].id);
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
window.__v19patch={renderQuiz:renderQuiz19};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',()=>setTimeout(buildV19UI,2700));}
else{setTimeout(buildV19UI,2700);}
})();
