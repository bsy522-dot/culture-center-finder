/**
 * culture-center-finder v18.0 patch
 * 실데이터 전용 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 인물·리뷰·통계 없음
 * 센터평균수강료랭킹Canvas+카테고리대상인기도Canvas+지역별가격분포Canvas+센터유형요일점유Canvas+수강횟수가격효율Canvas+시간대카테고리집중도Canvas+강좌경쟁지수Canvas+센터종합평가레이더Canvas+퀴즈+15(195→210)+업적+12(174→186)+SFX12종+키보드8종
 */
(function(){
'use strict';
const V18_ID='ccf-v18-patch';
if(document.getElementById(V18_ID))return;
const marker=document.createElement('meta');marker.id=V18_ID;document.head.appendChild(marker);

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

// ─── SFX 엔진 ──────────────────────────────────────────────────
const SFX18={
  _ctx:null,
  _get(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  play(type){
    const c=this._get();if(!c)return;
    const o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);g.gain.value=0.06;
    const t=c.currentTime;
    switch(type){
      case'nav':o.frequency.value=720;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);break;
      case'tab':o.type='triangle';o.frequency.value=940;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);break;
      case'hover':o.frequency.value=580;g.gain.value=0.03;g.gain.exponentialRampToValueAtTime(0.001,t+0.04);o.start(t);o.stop(t+0.04);break;
      case'rank':o.frequency.value=523;o.frequency.linearRampToValueAtTime(784,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.18);o.start(t);o.stop(t+0.18);break;
      case'heat':o.type='sawtooth';o.frequency.value=330;g.gain.value=0.04;g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'region':o.type='triangle';o.frequency.value=440;o.frequency.linearRampToValueAtTime(660,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.14);o.start(t);o.stop(t+0.14);break;
      case'stack':o.frequency.value=392;o.frequency.linearRampToValueAtTime(523,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'scatter':o.type='sine';o.frequency.value=600;o.frequency.linearRampToValueAtTime(900,t+0.08);g.gain.exponentialRampToValueAtTime(0.001,t+0.1);o.start(t);o.stop(t+0.1);break;
      case'time':o.type='triangle';o.frequency.value=494;g.gain.exponentialRampToValueAtTime(0.001,t+0.1);o.start(t);o.stop(t+0.1);break;
      case'compete':o.frequency.value=660;o.frequency.linearRampToValueAtTime(880,t+0.15);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'radar':o.type='sine';o.frequency.value=350;o.frequency.linearRampToValueAtTime(700,t+0.2);g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;
      case'quiz':o.frequency.value=880;g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'achieve':o.type='triangle';o.frequency.value=523;o.frequency.linearRampToValueAtTime(1047,t+0.3);g.gain.exponentialRampToValueAtTime(0.001,t+0.35);o.start(t);o.stop(t+0.35);break;
      default:o.frequency.value=600;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);
    }
  }
};

// ─── 업적 시스템 ────────────────────────────────────────────────
const ACH18_KEY='ccf_achieve_v18';
function getAchieves(){return lsGet(ACH18_KEY,[]);}
function unlockAchieve(id){
  if(!id)return;
  const arr=getAchieves();
  if(arr.includes(id))return;
  arr.push(id);
  lsSet(ACH18_KEY,arr);
  SFX18.play('achieve');
}

const ACHIEVEMENTS_V18=[
  {id:'v18_price_ranker',name:'가격 분석가',desc:'센터 평균수강료 랭킹 열기'},
  {id:'v18_target_mapper',name:'대상 매퍼',desc:'카테고리×대상 인기도 히트맵 열기'},
  {id:'v18_region_pricer',name:'지역 가격관',desc:'지역별 가격 분포 열기'},
  {id:'v18_day_analyst',name:'요일 분석가',desc:'센터유형 요일점유 열기'},
  {id:'v18_efficiency',name:'효율 계산가',desc:'수강횟수 가격효율 열기'},
  {id:'v18_time_expert',name:'시간대 전문가',desc:'시간대 카테고리 집중도 열기'},
  {id:'v18_competitor',name:'경쟁 분석관',desc:'강좌 경쟁지수 열기'},
  {id:'v18_radar_master',name:'종합 평가관',desc:'센터 종합평가 레이더 열기'},
  {id:'v18_all_sections',name:'v18 완전정복',desc:'v18 8섹션 모두 열기'},
  {id:'v18_quiz_clear',name:'v18 퀴즈 클리어',desc:'v18 퀴즈 전문 통과'},
  {id:'v18_quiz_s',name:'v18 퀴즈 S등급',desc:'v18 퀴즈 12문 이상'},
  {id:'v18_explorer',name:'v18 탐험가',desc:'v18 5개 이상 섹션 열기'}
];

// ─── 섹션 정의 ──────────────────────────────────────────────────
const SECTIONS=[
  {id:'v18-price-rank',title:'센터 평균수강료 랭킹',icon:'💰',achieve:'v18_price_ranker',render:renderPriceRank},
  {id:'v18-target-heat',title:'카테고리×대상 인기도',icon:'🎯',achieve:'v18_target_mapper',render:renderTargetHeat},
  {id:'v18-region-price',title:'지역별 가격대 분포',icon:'🗺️',achieve:'v18_region_pricer',render:renderRegionPrice},
  {id:'v18-day-type',title:'센터유형 요일 점유율',icon:'📅',achieve:'v18_day_analyst',render:renderDayType},
  {id:'v18-session-eff',title:'수강횟수 가격효율',icon:'⚡',achieve:'v18_efficiency',render:renderSessionEff},
  {id:'v18-time-cat',title:'시간대 카테고리 집중도',icon:'🕐',achieve:'v18_time_expert',render:renderTimeCat},
  {id:'v18-compete',title:'강좌 경쟁지수 분석',icon:'🏆',achieve:'v18_competitor',render:renderCompete},
  {id:'v18-radar',title:'센터 종합평가 레이더',icon:'📊',achieve:'v18_radar_master',render:renderRadar}
];

// ─── 1. 센터 평균수강료 랭킹 ────────────────────────────────────
function renderPriceRank(container){
  const data=getData();
  const centerPrices={};
  data.forEach(d=>{
    const p=parsePrice(d[8]);
    if(p<=0)return;
    const center=d[1]||'';
    if(!center)return;
    if(!centerPrices[center])centerPrices[center]={sum:0,cnt:0};
    centerPrices[center].sum+=p;
    centerPrices[center].cnt++;
  });
  const entries=Object.entries(centerPrices).filter(e=>e[1].cnt>=5).map(e=>({name:e[0],avg:Math.round(e[1].sum/e[1].cnt),cnt:e[1].cnt}));
  entries.sort((a,b)=>a.avg-b.avg);
  const cheapest=entries.slice(0,15);
  const expensive=entries.slice(-15).reverse();

  const W=620,H=400;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  let showCheap=true;
  function draw(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    const list=showCheap?cheapest:expensive;
    const title=showCheap?'💰 가장 저렴한 센터 TOP 15':'💎 프리미엄 센터 TOP 15';
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText(title,W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(클릭: 저렴↔프리미엄 전환, 최소 5강좌 이상 센터)',W/2,38);

    const maxVal=list.length>0?Math.max(...list.map(e=>e.avg)):1;
    const barH=20,gap=3,startY=50,leftPad=180,rightPad=60;
    const barArea=W-leftPad-rightPad;

    list.forEach((item,i)=>{
      const y=startY+i*(barH+gap);
      const bw=Math.max(2,(item.avg/maxVal)*barArea);
      const color=COLORS[i%COLORS.length];
      ctx.fillStyle=color;
      ctx.beginPath();ctx.roundRect(leftPad,y,bw,barH,[0,4,4,0]);ctx.fill();
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='right';
      const label=item.name.length>16?item.name.slice(0,16)+'...':item.name;
      ctx.fillText(label,leftPad-6,y+14);
      ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
      ctx.fillText(item.avg.toLocaleString()+'원 ('+item.cnt+'강좌)',leftPad+bw+4,y+14);
    });

    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('분석 대상: 5강좌 이상 보유 센터 | 총 '+entries.length+'개 센터',W/2,H-8);
  }
  draw();
  canvas.addEventListener('click',()=>{showCheap=!showCheap;SFX18.play('rank');draw();});

  const info=document.createElement('div');
  info.style.cssText='font-size:11px;color:var(--text-secondary);padding:6px 12px;text-align:center';
  info.textContent='총 '+entries.length+'개 센터 분석 완료. 평균 수강료 범위: '+cheapest[0]?.avg?.toLocaleString()+'원 ~ '+expensive[0]?.avg?.toLocaleString()+'원';
  container.appendChild(info);
}

// ─── 2. 카테고리×대상 인기도 히트맵 ─────────────────────────────
function renderTargetHeat(container){
  const data=getData();
  const targets=['성인','영유아','유아','어린이','패밀리'];
  const catMap={};
  data.forEach(d=>{
    const cat=d[3]||'기타';
    const tgt=d[5]||'';
    if(!catMap[cat])catMap[cat]={};
    const matched=targets.find(t=>tgt.includes(t))||'기타';
    catMap[cat][matched]=(catMap[cat][matched]||0)+1;
  });
  const allCats=Object.keys(catMap).sort((a,b)=>{
    const sa=Object.values(catMap[a]).reduce((s,v)=>s+v,0);
    const sb=Object.values(catMap[b]).reduce((s,v)=>s+v,0);
    return sb-sa;
  }).slice(0,12);
  const cols=[...targets,'기타'];

  const W=640,H=420;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;canvas.style.cssText='width:100%;max-width:640px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:crosshair';
  container.appendChild(canvas);

  let hoverCell=null;
  function draw(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🎯 카테고리 × 대상 인기도 히트맵',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(셀 밝기 = 강좌 수, 마우스 오버로 상세 확인)',W/2,38);

    const leftPad=90,topPad=60,rightPad=30,bottomPad=40;
    const cellW=(W-leftPad-rightPad)/cols.length;
    const cellH=(H-topPad-bottomPad)/allCats.length;
    let maxVal=1;
    allCats.forEach(cat=>cols.forEach(col=>{const v=(catMap[cat]||{})[col]||0;if(v>maxVal)maxVal=v;}));

    ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillStyle='#d4d4d4';
    cols.forEach((col,ci)=>{ctx.fillText(col,leftPad+ci*cellW+cellW/2,topPad-8);});
    ctx.textAlign='right';
    allCats.forEach((cat,ri)=>{
      const label=cat.length>7?cat.slice(0,7)+'..':cat;
      ctx.fillStyle='#d4d4d4';ctx.fillText(label,leftPad-8,topPad+ri*cellH+cellH/2+4);
    });

    allCats.forEach((cat,ri)=>{
      cols.forEach((col,ci)=>{
        const val=(catMap[cat]||{})[col]||0;
        const intensity=val/maxVal;
        const r=Math.round(14+intensity*112);
        const g=Math.round(165-intensity*80);
        const b=Math.round(233-intensity*100);
        ctx.fillStyle=`rgba(${r},${g},${b},${Math.max(0.15,intensity)})`;
        const x=leftPad+ci*cellW,y=topPad+ri*cellH;
        ctx.fillRect(x+1,y+1,cellW-2,cellH-2);
        if(hoverCell&&hoverCell.r===ri&&hoverCell.c===ci){
          ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,cellW-2,cellH-2);
          ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
          ctx.fillText(val+'건',x+cellW/2,y+cellH/2+3);
        }else if(val>0){
          ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='9px sans-serif';ctx.textAlign='center';
          ctx.fillText(val>999?(val/1000).toFixed(1)+'k':val,x+cellW/2,y+cellH/2+3);
        }
      });
    });

    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText('총 '+data.length.toLocaleString()+'건 강좌 | '+allCats.length+'개 카테고리 × '+cols.length+'개 대상',W/2,H-10);
  }
  draw();

  canvas.addEventListener('mousemove',function(e){
    const rect=canvas.getBoundingClientRect();
    const sx=W/rect.width,sy=H/rect.height;
    const mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
    const leftPad=90,topPad=60,rightPad=30,bottomPad=40;
    const cellW=(W-leftPad-rightPad)/cols.length;
    const cellH=(H-topPad-bottomPad)/allCats.length;
    const ci=Math.floor((mx-leftPad)/cellW),ri=Math.floor((my-topPad)/cellH);
    if(ci>=0&&ci<cols.length&&ri>=0&&ri<allCats.length){
      if(!hoverCell||hoverCell.r!==ri||hoverCell.c!==ci){hoverCell={r:ri,c:ci};draw();}
    }else if(hoverCell){hoverCell=null;draw();}
  });
  canvas.addEventListener('mouseleave',()=>{if(hoverCell){hoverCell=null;draw();}});
}

// ─── 3. 지역별 가격대 분포 ──────────────────────────────────────
function renderRegionPrice(container){
  const data=getData();
  const regionPrices={};
  data.forEach(d=>{
    const p=parsePrice(d[8]);if(p<=0)return;
    const addr=d[15]||'';
    const region=parseRegion(addr);
    if(region==='미상')return;
    if(!regionPrices[region])regionPrices[region]=[];
    regionPrices[region].push(p);
  });
  const regions=Object.keys(regionPrices).filter(r=>regionPrices[r].length>=20).sort((a,b)=>regionPrices[b].length-regionPrices[a].length).slice(0,15);
  regions.forEach(r=>regionPrices[r].sort((a,b)=>a-b));

  function q(arr,pct){const idx=Math.floor(arr.length*pct);return arr[Math.min(idx,arr.length-1)];}

  const W=620,H=400;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto';
  container.appendChild(canvas);

  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('🗺️ 지역별 수강료 분포 (박스플롯)',W/2,22);
  ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
  ctx.fillText('25%~75% 구간 박스 + 중앙값 | 최소 20건 이상 지역',W/2,38);

  const leftPad=60,topPad=55,rightPad=40,bottomPad=50;
  const plotW=W-leftPad-rightPad,plotH=H-topPad-bottomPad;
  let allMax=0;
  regions.forEach(r=>{const mx=q(regionPrices[r],0.95);if(mx>allMax)allMax=mx;});
  if(allMax===0)allMax=100000;

  const barW=plotW/regions.length;
  regions.forEach((r,i)=>{
    const arr=regionPrices[r];
    const mn=arr[0],mx=arr[arr.length-1];
    const q1=q(arr,0.25),med=q(arr,0.5),q3=q(arr,0.75);
    const x=leftPad+i*barW+barW/2;
    const toY=v=>topPad+plotH-(v/allMax)*plotH;

    ctx.strokeStyle=COLORS[i%COLORS.length];ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x,toY(Math.min(mn,allMax)));ctx.lineTo(x,toY(Math.min(mx,allMax)));ctx.stroke();

    const boxTop=toY(Math.min(q3,allMax)),boxBot=toY(q1);
    ctx.fillStyle=COLORS[i%COLORS.length]+'44';
    ctx.fillRect(x-barW*0.3,boxTop,barW*0.6,boxBot-boxTop);
    ctx.strokeStyle=COLORS[i%COLORS.length];ctx.strokeRect(x-barW*0.3,boxTop,barW*0.6,boxBot-boxTop);

    const medY=toY(Math.min(med,allMax));
    ctx.beginPath();ctx.moveTo(x-barW*0.3,medY);ctx.lineTo(x+barW*0.3,medY);ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();ctx.lineWidth=1;

    ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.save();ctx.translate(x,H-bottomPad+12);ctx.rotate(-Math.PI/6);ctx.fillText(r,0,0);ctx.restore();
    ctx.fillStyle='#8ba4c4';ctx.fillText((med/1000).toFixed(0)+'k',x,medY-6);
  });

  const ySteps=5;
  for(let i=0;i<=ySteps;i++){
    const val=Math.round(allMax*i/ySteps);
    const y=topPad+plotH-(i/ySteps)*plotH;
    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='right';
    ctx.fillText((val/1000).toFixed(0)+'k',leftPad-8,y+3);
    ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.beginPath();ctx.moveTo(leftPad,y);ctx.lineTo(W-rightPad,y);ctx.stroke();
  }
}

// ─── 4. 센터유형 요일 점유율 ────────────────────────────────────
function renderDayType(container){
  const data=getData();
  const days=['월','화','수','목','금','토','일'];
  const types=new Set();
  const dayTypeMap={};
  days.forEach(d=>{dayTypeMap[d]={};});

  data.forEach(d=>{
    const dayStr=d[6]||'';
    const parsed=parseDays(dayStr);
    const type=d[0]||'기타';
    types.add(type);
    parsed.forEach(day=>{
      if(dayTypeMap[day]){dayTypeMap[day][type]=(dayTypeMap[day][type]||0)+1;}
    });
  });
  const typeArr=[...types].sort((a,b)=>{
    const sa=days.reduce((s,d)=>(dayTypeMap[d][a]||0)+s,0);
    const sb=days.reduce((s,d)=>(dayTypeMap[d][b]||0)+s,0);
    return sb-sa;
  }).slice(0,8);

  const W=620,H=380;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto';
  container.appendChild(canvas);

  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('📅 센터유형별 요일 점유율 (스택바)',W/2,22);
  ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
  ctx.fillText('각 요일의 강좌를 센터유형별로 분류',W/2,38);

  const leftPad=60,topPad=55,rightPad=30,bottomPad=70;
  const plotW=W-leftPad-rightPad,plotH=H-topPad-bottomPad;
  const barW=plotW/days.length;
  let maxTotal=0;
  days.forEach(d=>{const total=typeArr.reduce((s,t)=>(dayTypeMap[d][t]||0)+s,0);if(total>maxTotal)maxTotal=total;});
  if(maxTotal===0)maxTotal=1;

  days.forEach((day,di)=>{
    let cumY=0;
    const x=leftPad+di*barW;
    typeArr.forEach((type,ti)=>{
      const val=dayTypeMap[day][type]||0;
      const h=(val/maxTotal)*plotH;
      ctx.fillStyle=COLORS[ti%COLORS.length];
      ctx.fillRect(x+4,topPad+plotH-cumY-h,barW-8,h);
      if(h>12){
        ctx.fillStyle='#fff';ctx.font='8px sans-serif';ctx.textAlign='center';
        ctx.fillText(val,x+barW/2,topPad+plotH-cumY-h/2+3);
      }
      cumY+=h;
    });
    ctx.fillStyle='#d4d4d4';ctx.font='11px sans-serif';ctx.textAlign='center';
    ctx.fillText(day+'요일',x+barW/2,topPad+plotH+16);
  });

  const legendY=H-bottomPad+30;
  const legendCols=4;
  typeArr.forEach((type,i)=>{
    const col=i%legendCols,row=Math.floor(i/legendCols);
    const lx=leftPad+col*140,ly=legendY+row*14;
    ctx.fillStyle=COLORS[i%COLORS.length];ctx.fillRect(lx,ly,8,8);
    ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';ctx.textAlign='left';
    const label=type.length>12?type.slice(0,12)+'..':type;
    ctx.fillText(label,lx+12,ly+7);
  });
}

// ─── 5. 수강횟수 가격효율 ───────────────────────────────────────
function renderSessionEff(container){
  const data=getData();
  const points=[];
  data.forEach(d=>{
    const p=parsePrice(d[8]);if(p<=0)return;
    const sessions=parseInt(d[14])||0;if(sessions<=0)return;
    const perSession=Math.round(p/sessions);
    const cat=d[3]||'기타';
    points.push({sessions,price:p,perSession,cat});
  });
  const catCounts={};
  points.forEach(pt=>{catCounts[pt.cat]=(catCounts[pt.cat]||0)+1;});
  const topCats=Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(e=>e[0]);
  const catColorMap={};topCats.forEach((c,i)=>{catColorMap[c]=COLORS[i];});

  const grouped={};
  points.forEach(pt=>{
    if(!topCats.includes(pt.cat))return;
    if(!grouped[pt.cat])grouped[pt.cat]={sumP:0,sumS:0,cnt:0,points:[]};
    grouped[pt.cat].sumP+=pt.price;
    grouped[pt.cat].sumS+=pt.sessions;
    grouped[pt.cat].cnt++;
    if(grouped[pt.cat].points.length<50)grouped[pt.cat].points.push(pt);
  });

  const W=600,H=380;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;background:#0d1117;display:block;margin:8px auto';
  container.appendChild(canvas);

  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('⚡ 수강횟수 vs 1회당 가격 (카테고리별)',W/2,22);
  ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
  ctx.fillText('X축: 총 수강횟수 | Y축: 1회당 수강료 (원)',W/2,38);

  const leftPad=70,topPad=55,rightPad=30,bottomPad=70;
  const plotW=W-leftPad-rightPad,plotH=H-topPad-bottomPad;
  let maxSessions=20,maxPerSession=50000;
  points.forEach(pt=>{
    if(pt.sessions<=20&&pt.perSession<=50000){
      if(pt.sessions>maxSessions)maxSessions=pt.sessions;
      if(pt.perSession>maxPerSession)maxPerSession=pt.perSession;
    }
  });

  ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=0.5;
  for(let i=0;i<=4;i++){
    const y=topPad+i*(plotH/4);
    ctx.beginPath();ctx.moveTo(leftPad,y);ctx.lineTo(W-rightPad,y);ctx.stroke();
    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='right';
    const val=Math.round(maxPerSession*(1-i/4));
    ctx.fillText((val/1000).toFixed(0)+'k원',leftPad-6,y+3);
  }
  for(let i=0;i<=maxSessions;i+=4){
    const x=leftPad+(i/maxSessions)*plotW;
    ctx.fillStyle='#556173';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText(i+'회',x,topPad+plotH+14);
  }

  topCats.forEach(cat=>{
    const g=grouped[cat];if(!g)return;
    const color=catColorMap[cat];
    g.points.forEach(pt=>{
      if(pt.sessions>maxSessions||pt.perSession>maxPerSession)return;
      const x=leftPad+(pt.sessions/maxSessions)*plotW;
      const y=topPad+plotH-(pt.perSession/maxPerSession)*plotH;
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fillStyle=color+'88';ctx.fill();
    });
  });

  const legendY=H-bottomPad+28;
  topCats.forEach((cat,i)=>{
    const col=i%4,row=Math.floor(i/4);
    const lx=leftPad+col*135,ly=legendY+row*14;
    ctx.fillStyle=catColorMap[cat];ctx.beginPath();ctx.arc(lx+4,ly+3,3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#d4d4d4';ctx.font='9px sans-serif';ctx.textAlign='left';
    ctx.fillText(cat.length>10?cat.slice(0,10)+'..':cat,lx+12,ly+6);
  });
}

// ─── 6. 시간대 카테고리 집중도 ──────────────────────────────────
function renderTimeCat(container){
  const data=getData();
  const timeSlots=['오전(6~9)','오전(9~12)','오후(12~15)','오후(15~18)','저녁(18~21)','야간(21~)'];
  function getSlot(h){if(h<0)return-1;if(h<9)return 0;if(h<12)return 1;if(h<15)return 2;if(h<18)return 3;if(h<21)return 4;return 5;}

  const slotCat={};timeSlots.forEach((_,i)=>{slotCat[i]={};});
  data.forEach(d=>{
    const h=parseHour(d[7]);const slot=getSlot(h);if(slot<0)return;
    const cat=d[3]||'기타';
    slotCat[slot][cat]=(slotCat[slot][cat]||0)+1;
  });

  const allCats=new Set();
  Object.values(slotCat).forEach(m=>Object.keys(m).forEach(c=>allCats.add(c)));
  const catArr=[...allCats].sort((a,b)=>{
    const sa=Object.values(slotCat).reduce((s,m)=>(m[a]||0)+s,0);
    const sb=Object.values(slotCat).reduce((s,m)=>(m[b]||0)+s,0);
    return sb-sa;
  }).slice(0,10);

  const W=620,H=400;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:crosshair';
  container.appendChild(canvas);

  let hoverCell=null;
  function draw(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🕐 시간대별 카테고리 집중도',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('각 시간대에 어떤 카테고리가 집중되는지 히트맵',W/2,38);

    const leftPad=80,topPad=60,rightPad=30,bottomPad=30;
    const cellW=(W-leftPad-rightPad)/timeSlots.length;
    const cellH=(H-topPad-bottomPad)/catArr.length;
    let maxVal=1;
    catArr.forEach(cat=>timeSlots.forEach((_,si)=>{const v=slotCat[si][cat]||0;if(v>maxVal)maxVal=v;}));

    ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillStyle='#d4d4d4';
    timeSlots.forEach((slot,si)=>{ctx.fillText(slot,leftPad+si*cellW+cellW/2,topPad-8);});
    ctx.textAlign='right';
    catArr.forEach((cat,ri)=>{
      ctx.fillStyle='#d4d4d4';ctx.fillText(cat.length>7?cat.slice(0,7)+'..':cat,leftPad-6,topPad+ri*cellH+cellH/2+4);
    });

    catArr.forEach((cat,ri)=>{
      timeSlots.forEach((_,si)=>{
        const val=slotCat[si][cat]||0;
        const intensity=val/maxVal;
        const g=Math.round(200*intensity);const b=Math.round(227*(1-intensity*0.5));
        ctx.fillStyle=`rgba(${Math.round(126+intensity*60)},${g},${b},${Math.max(0.12,intensity)})`;
        const x=leftPad+si*cellW,y=topPad+ri*cellH;
        ctx.fillRect(x+1,y+1,cellW-2,cellH-2);
        if(hoverCell&&hoverCell.r===ri&&hoverCell.c===si){
          ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,cellW-2,cellH-2);
          ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
          ctx.fillText(val+'건',x+cellW/2,y+cellH/2+3);
        }else if(val>0){
          ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='8px sans-serif';ctx.textAlign='center';
          ctx.fillText(val>999?(val/1000).toFixed(1)+'k':val,x+cellW/2,y+cellH/2+3);
        }
      });
    });
  }
  draw();
  canvas.addEventListener('mousemove',function(e){
    const rect=canvas.getBoundingClientRect();
    const sx=W/rect.width,sy=H/rect.height;
    const mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
    const leftPad=80,topPad=60,rightPad=30,bottomPad=30;
    const cellW=(W-leftPad-rightPad)/timeSlots.length;
    const cellH=(H-topPad-bottomPad)/catArr.length;
    const ci=Math.floor((mx-leftPad)/cellW),ri=Math.floor((my-topPad)/cellH);
    if(ci>=0&&ci<timeSlots.length&&ri>=0&&ri<catArr.length){
      if(!hoverCell||hoverCell.r!==ri||hoverCell.c!==ci){hoverCell={r:ri,c:ci};draw();}
    }else if(hoverCell){hoverCell=null;draw();}
  });
  canvas.addEventListener('mouseleave',()=>{if(hoverCell){hoverCell=null;draw();}});
}

// ─── 7. 강좌 경쟁지수 분석 ─────────────────────────────────────
function renderCompete(container){
  const data=getData();
  const catRegion={};
  data.forEach(d=>{
    const cat=d[3]||'기타';
    const region=parseRegion(d[15]||'');
    if(region==='미상')return;
    const key=cat+'|'+region;
    catRegion[key]=(catRegion[key]||0)+1;
  });

  const topCats={};
  data.forEach(d=>{const cat=d[3]||'기타';topCats[cat]=(topCats[cat]||0)+1;});
  const catArr=Object.entries(topCats).sort((a,b)=>b[1]-a[1]).slice(0,8).map(e=>e[0]);
  const regionCounts={};
  data.forEach(d=>{const r=parseRegion(d[15]||'');if(r!=='미상')regionCounts[r]=(regionCounts[r]||0)+1;});
  const topRegions=Object.entries(regionCounts).sort((a,b)=>b[1]-a[1]).slice(0,8).map(e=>e[0]);

  const W=620,H=380;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;canvas.style.cssText='width:100%;max-width:620px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:crosshair';
  container.appendChild(canvas);

  let hoverCell=null;
  function draw(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('🏆 카테고리×지역 경쟁지수',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('값이 높을수록 해당 지역에서 해당 카테고리 강좌가 많음 (경쟁 치열)',W/2,38);

    const leftPad=70,topPad=58,rightPad=30,bottomPad=30;
    const cellW=(W-leftPad-rightPad)/topRegions.length;
    const cellH=(H-topPad-bottomPad)/catArr.length;
    let maxVal=1;
    catArr.forEach(cat=>topRegions.forEach(r=>{const v=catRegion[cat+'|'+r]||0;if(v>maxVal)maxVal=v;}));

    ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillStyle='#d4d4d4';
    topRegions.forEach((r,ci)=>{ctx.fillText(r,leftPad+ci*cellW+cellW/2,topPad-8);});
    ctx.textAlign='right';
    catArr.forEach((cat,ri)=>{ctx.fillStyle='#d4d4d4';ctx.fillText(cat.length>6?cat.slice(0,6)+'..':cat,leftPad-6,topPad+ri*cellH+cellH/2+4);});

    catArr.forEach((cat,ri)=>{
      topRegions.forEach((r,ci)=>{
        const val=catRegion[cat+'|'+r]||0;
        const intensity=val/maxVal;
        const red=Math.round(intensity*200);
        const green=Math.round(180-intensity*100);
        ctx.fillStyle=`rgba(${126+red*0.4},${green},${200-intensity*100},${Math.max(0.1,intensity)})`;
        const x=leftPad+ci*cellW,y=topPad+ri*cellH;
        ctx.fillRect(x+1,y+1,cellW-2,cellH-2);
        if(hoverCell&&hoverCell.r===ri&&hoverCell.c===ci){
          ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.strokeRect(x+1,y+1,cellW-2,cellH-2);
          ctx.fillStyle='#fff';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
          ctx.fillText(val+'건',x+cellW/2,y+cellH/2+3);
        }else if(val>0){
          ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='8px sans-serif';ctx.textAlign='center';
          ctx.fillText(val,x+cellW/2,y+cellH/2+3);
        }
      });
    });
  }
  draw();
  canvas.addEventListener('mousemove',function(e){
    const rect=canvas.getBoundingClientRect();
    const sx=W/rect.width,sy=H/rect.height;
    const mx=(e.clientX-rect.left)*sx,my=(e.clientY-rect.top)*sy;
    const leftPad=70,topPad=58,rightPad=30,bottomPad=30;
    const cellW=(W-leftPad-rightPad)/topRegions.length;
    const cellH=(H-topPad-bottomPad)/catArr.length;
    const ci=Math.floor((mx-leftPad)/cellW),ri=Math.floor((my-topPad)/cellH);
    if(ci>=0&&ci<topRegions.length&&ri>=0&&ri<catArr.length){
      if(!hoverCell||hoverCell.r!==ri||hoverCell.c!==ci){hoverCell={r:ri,c:ci};draw();}
    }else if(hoverCell){hoverCell=null;draw();}
  });
  canvas.addEventListener('mouseleave',()=>{if(hoverCell){hoverCell=null;draw();}});
}

// ─── 8. 센터 종합평가 레이더 ────────────────────────────────────
function renderRadar(container){
  const data=getData();
  const brands={};
  data.forEach(d=>{
    const type=d[0]||'기타';
    if(!brands[type])brands[type]={prices:[],cats:new Set(),hours:new Set(),targets:new Set(),days:new Set(),count:0};
    const b=brands[type];
    b.count++;
    const p=parsePrice(d[8]);if(p>0)b.prices.push(p);
    b.cats.add(d[3]||'기타');
    const h=parseHour(d[7]);if(h>=0)b.hours.add(h);
    b.targets.add(d[5]||'');
    parseDays(d[6]||'').forEach(day=>b.days.add(day));
  });

  const brandArr=Object.entries(brands).sort((a,b)=>b[1].count-a[1].count).slice(0,6);
  const axes=['가격경쟁력','카테고리다양성','시간대범위','대상다양성','요일커버리지','규모'];

  function getScores(b){
    const avgP=b.prices.length>0?b.prices.reduce((s,v)=>s+v,0)/b.prices.length:0;
    const priceScore=avgP>0?Math.min(100,Math.max(0,100-avgP/2000)):50;
    const catScore=Math.min(100,b.cats.size*8);
    const hourScore=Math.min(100,b.hours.size*7);
    const targetScore=Math.min(100,b.targets.size*20);
    const dayScore=Math.min(100,b.days.size*15);
    const sizeScore=Math.min(100,b.count/50);
    return[priceScore,catScore,hourScore,targetScore,dayScore,sizeScore];
  }

  const W=600,H=400;
  const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;background:#0d1117;display:block;margin:8px auto;cursor:pointer';
  container.appendChild(canvas);

  let selectedIdx=0;
  function draw(){
    const ctx=canvas.getContext('2d');
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d1117';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('📊 센터유형 종합평가 레이더',W/2,22);
    ctx.font='10px sans-serif';ctx.fillStyle='#8ba4c4';
    ctx.fillText('(클릭으로 센터유형 전환 | 6축: 가격·다양성·시간대·대상·요일·규모)',W/2,38);

    const cx=W/2,cy=H/2+15,radius=120;
    const n=axes.length;

    for(let ring=1;ring<=5;ring++){
      const r=radius*ring/5;
      ctx.beginPath();
      for(let i=0;i<n;i++){
        const angle=-Math.PI/2+i*2*Math.PI/n;
        const x=cx+r*Math.cos(angle),y=cy+r*Math.sin(angle);
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath();ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.stroke();
    }

    for(let i=0;i<n;i++){
      const angle=-Math.PI/2+i*2*Math.PI/n;
      const x=cx+radius*Math.cos(angle),y=cy+radius*Math.sin(angle);
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.stroke();
      ctx.fillStyle='#d4d4d4';ctx.font='10px sans-serif';ctx.textAlign='center';
      const lx=cx+(radius+18)*Math.cos(angle),ly=cy+(radius+18)*Math.sin(angle);
      ctx.fillText(axes[i],lx,ly+4);
    }

    brandArr.forEach(([name,b],bi)=>{
      const scores=getScores(b);
      const isSelected=bi===selectedIdx;
      ctx.beginPath();
      scores.forEach((score,i)=>{
        const angle=-Math.PI/2+i*2*Math.PI/n;
        const r=radius*score/100;
        const x=cx+r*Math.cos(angle),y=cy+r*Math.sin(angle);
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      });
      ctx.closePath();
      ctx.strokeStyle=COLORS[bi];ctx.lineWidth=isSelected?2.5:1;ctx.stroke();
      if(isSelected){ctx.fillStyle=COLORS[bi]+'33';ctx.fill();}
    });

    const legendX=30,legendY=H-60;
    brandArr.forEach(([name],i)=>{
      const col=i%3,row=Math.floor(i/3);
      const lx=legendX+col*195,ly=legendY+row*16;
      ctx.fillStyle=COLORS[i];ctx.fillRect(lx,ly,10,10);
      ctx.fillStyle=i===selectedIdx?'#fff':'#8ba4c4';ctx.font=(i===selectedIdx?'bold ':'')+' 10px sans-serif';ctx.textAlign='left';
      ctx.fillText(name,lx+14,ly+9);
    });

    const [selName,selB]=brandArr[selectedIdx];
    const selScores=getScores(selB);
    ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='right';
    ctx.fillText(selName+' 상세',W-20,60);
    ctx.font='9px sans-serif';ctx.fillStyle='#8ba4c4';
    axes.forEach((ax,i)=>{ctx.fillText(ax+': '+selScores[i].toFixed(0)+'/100',W-20,75+i*13);});
  }
  draw();
  canvas.addEventListener('click',()=>{selectedIdx=(selectedIdx+1)%brandArr.length;SFX18.play('radar');draw();});
}

// ─── 퀴즈 v18 (15문항, 195→210) ─────────────────────────────────
const QUIZ_V18=[
  {q:'문화센터에서 &quot;가성비&quot;가 가장 좋은 카테고리는 일반적으로?',a:['수영','요가','피아노','발레'],c:0},
  {q:'강좌 수가 가장 많은 센터 유형은?',a:['백화점','대형마트','평생학습관','아카데미'],c:0},
  {q:'&quot;경쟁지수&quot;가 높다는 것은 해당 지역에서?',a:['수강생이 많다','같은 카테고리 강좌가 많다','가격이 비싸다','인기가 없다'],c:1},
  {q:'수강료 분위수에서 Q1(25%)이 의미하는 것은?',a:['가장 저렴한 25%','평균 가격','가장 비싼 25%','중간값'],c:0},
  {q:'스택바 차트에서 각 색상 세그먼트가 나타내는 것은?',a:['시간대','가격대','센터유형 비율','난이도'],c:2},
  {q:'히트맵에서 셀의 밝기가 의미하는 것은?',a:['가격 수준','강좌 수량','만족도','거리'],c:1},
  {q:'레이더 차트의 축이 6개일 때, 면적이 넓을수록?',a:['가격이 비쌈','종합 평가가 높음','인기가 없음','접근성이 낮음'],c:1},
  {q:'산점도에서 X축이 수강횟수, Y축이 1회당 가격일 때, 좌하단 점은?',a:['비싸고 많은 횟수','저렴하고 적은 횟수','비싸고 적은 횟수','저렴하고 많은 횟수'],c:1},
  {q:'PWA에서 서비스워커의 주 역할은?',a:['UI 렌더링','오프라인 캐시','보안 인증','데이터 분석'],c:1},
  {q:'시간대별 분석에서 &quot;오전(9~12)&quot;에 가장 많은 카테고리는 보통?',a:['수영','댄스','악기','요가'],c:0},
  {q:'박스플롯에서 &quot;수염(whisker)&quot;이 길면?',a:['가격 분포가 넓다','평균이 높다','데이터가 적다','모든 가격이 같다'],c:0},
  {q:'센터 종합평가에서 &quot;가격경쟁력&quot; 점수가 높으면?',a:['가격이 비싸다','가격이 저렴하다','강좌가 적다','위치가 좋다'],c:1},
  {q:'요일 점유율에서 &quot;토요일&quot;에 특히 많은 대상은?',a:['성인','영유아','어린이','패밀리'],c:2},
  {q:'강좌 데이터 시각화에서 &quot;실데이터&quot;의 의미는?',a:['AI가 생성한 가짜 데이터','실제 크롤링한 강좌 정보','사용자 리뷰 기반','설문조사 결과'],c:1},
  {q:'카테고리 다양성 지수가 높은 센터의 장점은?',a:['가격이 저렴','선택지가 다양','위치가 좋음','시설이 좋음'],c:1}
];

function renderQuiz18(container){
  const state=lsGet('ccf_quiz_v18',{idx:0,score:0,done:false,answers:[]});

  function renderQ(){
    if(state.done){
      const grade=state.score>=14?'S':state.score>=12?'A':state.score>=10?'B':state.score>=7?'C':'D';
      if(state.score>=12)unlockAchieve('v18_quiz_s');
      unlockAchieve('v18_quiz_clear');
      container.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:28px;margin-bottom:8px">'+grade+'</div><div style="color:var(--text-secondary);font-size:13px">v18 퀴즈 완료: '+state.score+'/'+QUIZ_V18.length+'문 정답</div><button id="v18-quiz-retry" style="margin-top:12px;padding:6px 16px;border-radius:6px;background:var(--accent);color:#fff;border:none;cursor:pointer;font-size:12px">다시 풀기</button></div>';
      document.getElementById('v18-quiz-retry')?.addEventListener('click',()=>{
        state.idx=0;state.score=0;state.done=false;state.answers=[];lsSet('ccf_quiz_v18',state);renderQ();
      });
      return;
    }
    const qi=state.idx;
    if(qi>=QUIZ_V18.length){state.done=true;lsSet('ccf_quiz_v18',state);renderQ();return;}
    const q=QUIZ_V18[qi];
    container.innerHTML='<div style="padding:12px"><div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px">Q'+(qi+1)+'/'+QUIZ_V18.length+' (점수: '+state.score+')</div><div style="font-size:13px;color:var(--text-primary);margin-bottom:12px">'+q.q+'</div><div id="v18-quiz-opts"></div></div>';
    const opts=document.getElementById('v18-quiz-opts');
    q.a.forEach((a,ai)=>{
      const btn=document.createElement('button');
      btn.style.cssText='display:block;width:100%;text-align:left;padding:8px 12px;margin-bottom:6px;border-radius:6px;border:1px solid var(--card-border);background:var(--card-bg);color:var(--text);cursor:pointer;font-size:12px';
      btn.textContent=a;
      btn.addEventListener('click',()=>{
        const correct=ai===q.c;
        if(correct){state.score++;SFX18.play('quiz');}
        state.answers.push(ai);state.idx++;lsSet('ccf_quiz_v18',state);
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
function buildV18UI(){
  const root=document.getElementById('root');
  if(!root)return;

  const hub=document.createElement('div');
  hub.id='ccf-v18-hub';
  hub.style.cssText='margin:16px auto;max-width:700px;padding:0 12px';

  const header=document.createElement('div');
  header.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:16px;margin-bottom:12px';
  header.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between"><div><span style="font-size:15px;font-weight:700;color:var(--text-primary)">📈 심층분석허브 v18</span><span style="font-size:10px;color:var(--text-secondary);margin-left:8px">센터평가·경쟁분석·가격분포·시간대·대상별</span></div><button id="v18-toggle-all" style="padding:4px 10px;border-radius:6px;background:var(--accent);color:#fff;border:none;cursor:pointer;font-size:11px">전체 열기/닫기</button></div>';
  hub.appendChild(header);

  SECTIONS.forEach(sec=>{
    const section=document.createElement('div');section.id=sec.id;
    section.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;margin-bottom:8px;overflow:hidden';
    const titleDiv=document.createElement('div');
    titleDiv.style.cssText='padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:background .15s';
    titleDiv.innerHTML='<span style="font-size:16px">'+sec.icon+'</span><span style="font-size:12px;font-weight:600;color:var(--text-primary)">'+esc(sec.title)+'</span><span style="margin-left:auto;font-size:10px;color:var(--text-secondary)">▼</span>';
    section.appendChild(titleDiv);
    const content=document.createElement('div');content.id=sec.id+'-content';content.style.cssText='display:none;padding:8px 12px';
    section.appendChild(content);
    titleDiv.addEventListener('click',()=>{
      SFX18.play('nav');
      const isOpen=content.style.display==='block';
      content.style.display=isOpen?'none':'block';
      if(!isOpen&&!content.hasChildNodes()){sec.render(content);unlockAchieve(sec.achieve);checkAllSections();}
    });
    hub.appendChild(section);
  });

  const quizSection=document.createElement('div');quizSection.id='v18-quiz-section';
  quizSection.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;margin-bottom:8px;overflow:hidden';
  const quizTitle=document.createElement('div');
  quizTitle.style.cssText='padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:8px';
  quizTitle.innerHTML='<span style="font-size:16px">❓</span><span style="font-size:12px;font-weight:600;color:var(--text-primary)">v18 퀴즈 (15문)</span><span style="margin-left:auto;font-size:10px;color:var(--text-secondary)">▼</span>';
  quizSection.appendChild(quizTitle);
  const quizContent=document.createElement('div');quizContent.id='v18-quiz-content';quizContent.style.cssText='display:none;padding:8px 12px';
  quizSection.appendChild(quizContent);
  quizTitle.addEventListener('click',()=>{
    SFX18.play('tab');
    const isOpen=quizContent.style.display==='block';
    quizContent.style.display=isOpen?'none':'block';
    if(!isOpen&&!quizContent.hasChildNodes())renderQuiz18(quizContent);
  });
  hub.appendChild(quizSection);

  const achSection=document.createElement('div');
  achSection.style.cssText='background:var(--card-bg);border:1px solid var(--card-border);border-radius:10px;margin-bottom:8px;padding:12px 16px';
  achSection.innerHTML='<div style="font-size:12px;font-weight:600;color:var(--text-primary);margin-bottom:8px">🏅 v18 업적 ('+ACHIEVEMENTS_V18.length+'종)</div><div id="v18-ach-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:6px"></div>';
  hub.appendChild(achSection);

  function renderAchievements(){
    const grid=document.getElementById('v18-ach-grid');if(!grid)return;
    const unlocked=getAchieves();
    grid.innerHTML=ACHIEVEMENTS_V18.map(a=>{
      const done=unlocked.includes(a.id);
      return'<div style="padding:6px 8px;border-radius:6px;border:1px solid '+(done?'var(--accent)':'var(--card-border)')+';background:'+(done?'rgba(126,200,227,0.08)':'var(--card-bg)')+';font-size:10px"><div style="color:'+(done?'var(--accent)':'var(--text-secondary)')+';font-weight:600">'+esc(a.name)+'</div><div style="color:var(--text-muted);font-size:9px;margin-top:2px">'+esc(a.desc)+'</div></div>';
    }).join('');
  }
  renderAchievements();
  setInterval(renderAchievements,3000);

  const prevHub=document.getElementById('ccf-v17-hub');
  if(prevHub)prevHub.after(hub);
  else root.appendChild(hub);

  document.getElementById('v18-toggle-all').addEventListener('click',function(){
    SFX18.play('tab');
    const sections=hub.querySelectorAll('[id$="-content"]');
    const allOpen=[...sections].every(s=>s.style.display==='block');
    sections.forEach(s=>{
      s.style.display=allOpen?'none':'block';
      if(!allOpen&&!s.hasChildNodes()){
        const sec=SECTIONS.find(x=>x.id+'-content'===s.id);
        if(sec){sec.render(s);unlockAchieve(sec.achieve);}
        else if(s.id==='v18-quiz-content')renderQuiz18(s);
      }
    });
    checkAllSections();
  });
}

function checkAllSections(){
  const opened=getAchieves();
  const sectionAchs=SECTIONS.map(s=>s.achieve);
  const openedSections=sectionAchs.filter(a=>opened.includes(a)).length;
  if(openedSections>=5)unlockAchieve('v18_explorer');
  if(openedSections>=8)unlockAchieve('v18_all_sections');
}

// ─── 키보드 단축키 (Shift+1~8, Shift+0=퀴즈) ───────────────────
document.addEventListener('keydown',function(e){
  if(!e.shiftKey||e.ctrlKey||e.altKey||e.metaKey)return;
  const tag=document.activeElement?.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;

  if(e.key==='0'||e.key===')'){
    const qt=document.getElementById('v18-quiz-section');
    if(qt){e.preventDefault();qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  const numKeys={'!':0,'@':1,'#':2,'$':3,'%':4,'^':5,'&':6,'*':7};
  const shifted=numKeys[e.key];
  if(shifted!==undefined&&shifted<SECTIONS.length){
    e.preventDefault();
    const sec=document.getElementById(SECTIONS[shifted].id);
    if(sec){sec.scrollIntoView({behavior:'smooth',block:'start'});sec.querySelector('div').click();}
  }
});

// ─── roundRect 폴리필 ───────────────────────────────────────────
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

// ─── 초기화 ─────────────────────────────────────────────────────
window.__v18patch={renderQuiz:renderQuiz18};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',()=>setTimeout(buildV18UI,2500));}
else{setTimeout(buildV18UI,2500);}
})();
