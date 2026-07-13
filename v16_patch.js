/**
 * culture-center-finder v16.0 patch
 * 실데이터 전용 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 인물·리뷰·통계 없음
 * 가격분포Canvas+센터유형비교Canvas+요일시간히트맵Canvas+카테고리트리맵Canvas+수강료구간Canvas+개강캘린더Canvas+접수현황Canvas+지역분포Canvas+퀴즈+15(165→180)+업적+12(150→162)+SFX12종+키보드8종
 */
(function(){
'use strict';
const V16_ID='ccf-v16-patch';
if(document.getElementById(V16_ID))return;
const marker=document.createElement('meta');marker.id=V16_ID;document.head.appendChild(marker);

function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function lsGet(k,d){try{const s=localStorage.getItem(k);return s?JSON.parse(s):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}

function getData(){return window.__v4Data||[];}

function parsePrice(s){
  if(!s)return 0;
  const m=s.replace(/,/g,'').match(/(\d+)원/);
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

const COLORS=['#7EC8E3','#3AAFA9','#F59E0B','#EF4444','#8B5CF6','#EC4899','#10B981','#F97316','#6366F1','#14B8A6','#E879F9','#84CC16','#FB923C','#38BDF8','#A78BFA','#FBBF24','#34D399','#F472B6'];

// ─── SFX 엔진 ──────────────────────────────────────────────────
const SFX16={
  _ctx:null,
  _get(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  play(type){
    const c=this._get();if(!c)return;
    const o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);g.gain.value=0.06;
    const t=c.currentTime;
    switch(type){
      case'nav':o.frequency.value=660;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);break;
      case'tab':o.type='triangle';o.frequency.value=880;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);break;
      case'hover':o.frequency.value=520;g.gain.value=0.03;g.gain.exponentialRampToValueAtTime(0.001,t+0.04);o.start(t);o.stop(t+0.04);break;
      case'price':o.frequency.value=440;o.frequency.linearRampToValueAtTime(880,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'center':o.type='triangle';o.frequency.value=330;o.frequency.linearRampToValueAtTime(660,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'heatmap':o.frequency.value=600;g.gain.exponentialRampToValueAtTime(0.001,t+0.1);o.start(t);o.stop(t+0.1);break;
      case'category':o.type='sine';o.frequency.value=523;o.frequency.linearRampToValueAtTime(784,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'band':o.frequency.value=700;g.gain.exponentialRampToValueAtTime(0.001,t+0.1);o.start(t);o.stop(t+0.1);break;
      case'calendar':o.type='triangle';o.frequency.value=784;o.frequency.linearRampToValueAtTime(1047,t+0.15);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'status':o.frequency.value=550;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);break;
      case'region':o.type='sine';o.frequency.value=440;o.frequency.linearRampToValueAtTime(660,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'quiz':o.frequency.value=523;o.frequency.linearRampToValueAtTime(1047,t+0.15);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'achieve':o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.15);
        const o2=c.createOscillator(),g2=c.createGain();o2.connect(g2);g2.connect(c.destination);o2.frequency.value=784;g2.gain.value=0.06;g2.gain.exponentialRampToValueAtTime(0.001,t+0.35);o2.start(t+0.12);o2.stop(t+0.3);break;
    }
  }
};

// ─── 공통 토스트 ─────────────────────────────────────────────────
function showToast16(msg,dur){
  const old=document.getElementById('v16-toast');if(old)old.remove();
  const t=document.createElement('div');t.id='v16-toast';
  Object.assign(t.style,{position:'fixed',top:'20px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#1B3A4B,#0C1525)',
    border:'1px solid rgba(126,200,227,0.5)',borderRadius:'14px',padding:'12px 24px',zIndex:'950',
    fontSize:'13px',fontWeight:'700',color:'#7EC8E3',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
    whiteSpace:'nowrap',maxWidth:'90vw',overflow:'hidden',textOverflow:'ellipsis',transition:'opacity .3s'});
  t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300);},dur||2500);
}

// ─── Canvas 유틸 ────────────────────────────────────────────────
function createCanvas(w,h){
  const c=document.createElement('canvas');c.width=w;c.height=h;
  c.style.cssText='width:100%;max-width:'+w+'px;height:auto;border-radius:12px;background:#0A1628;display:block;margin:12px auto;';
  return c;
}

function drawTitle(ctx,text,x,y){
  ctx.fillStyle='#7EC8E3';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
  ctx.fillText(text,x,y);
}

// ─── 1. 강좌 가격 분포 분석기 Canvas ────────────────────────────
function renderPriceDistribution(container){
  const data=getData();if(!data.length)return;
  SFX16.play('price');
  const canvas=createCanvas(600,380);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const bands=[
    {label:'무료/1만 미만',min:0,max:10000,color:'#10B981'},
    {label:'1~3만',min:10000,max:30000,color:'#3AAFA9'},
    {label:'3~5만',min:30000,max:50000,color:'#7EC8E3'},
    {label:'5~10만',min:50000,max:100000,color:'#F59E0B'},
    {label:'10~20만',min:100000,max:200000,color:'#EF4444'},
    {label:'20만+',min:200000,max:Infinity,color:'#8B5CF6'}
  ];
  const counts=bands.map(()=>0);
  let total=0,sum=0;
  data.forEach(r=>{
    const p=parsePrice(r[8]);
    if(p>0){total++;sum+=p;for(let i=0;i<bands.length;i++){if(p>=bands[i].min&&p<bands[i].max){counts[i]++;break;}}}
  });
  const maxCount=Math.max(...counts,1);
  ctx.fillStyle='#0A1628';ctx.fillRect(0,0,600,380);
  drawTitle(ctx,'💰 강좌 가격 분포 분석기 ('+total.toLocaleString()+'개 강좌)',300,28);
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='12px sans-serif';ctx.textAlign='center';
  ctx.fillText('평균 '+Math.round(sum/total).toLocaleString()+'원',300,48);
  const barW=70,gap=12,startX=55,startY=300;
  bands.forEach((b,i)=>{
    const x=startX+i*(barW+gap);
    const h=Math.max(4,(counts[i]/maxCount)*220);
    ctx.fillStyle=b.color;
    ctx.beginPath();
    const r=4;const by=startY-h;
    ctx.moveTo(x+r,by);ctx.lineTo(x+barW-r,by);ctx.quadraticCurveTo(x+barW,by,x+barW,by+r);
    ctx.lineTo(x+barW,startY);ctx.lineTo(x,startY);ctx.lineTo(x,by+r);ctx.quadraticCurveTo(x,by,x+r,by);
    ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 13px sans-serif';ctx.textAlign='center';
    ctx.fillText(counts[i].toLocaleString(),x+barW/2,startY-h-8);
    const pct=total>0?Math.round(counts[i]/total*100):0;
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='11px sans-serif';
    ctx.fillText(pct+'%',x+barW/2,startY-h-22);
    ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='11px sans-serif';
    ctx.fillText(b.label,x+barW/2,startY+18);
  });
  ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(startX-10,startY);ctx.lineTo(startX+bands.length*(barW+gap),startY);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='11px sans-serif';ctx.textAlign='left';
  ctx.fillText('실시간 data/all.json 기반 • 가짜 통계 없음',20,370);
}

// ─── 2. 센터 유형별 비교 분석 Canvas ────────────────────────────
function renderCenterTypeComparison(container){
  const data=getData();if(!data.length)return;
  SFX16.play('center');
  const canvas=createCanvas(620,380);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const types={};
  data.forEach(r=>{
    const t=r[0]||'미분류';
    if(!types[t])types[t]={count:0,priceSum:0,priceCount:0,cats:{}};
    types[t].count++;
    const p=parsePrice(r[8]);
    if(p>0){types[t].priceSum+=p;types[t].priceCount++;}
    const c=r[3]||'기타';
    types[t].cats[c]=(types[t].cats[c]||0)+1;
  });
  const sorted=Object.entries(types).sort((a,b)=>b[1].count-a[1].count);
  const maxCount=Math.max(...sorted.map(s=>s[1].count),1);
  ctx.fillStyle='#0A1628';ctx.fillRect(0,0,620,380);
  drawTitle(ctx,'🏬 센터 유형별 비교 분석 ('+sorted.length+'유형)',310,28);
  const barH=28,gap=8,startX=160,startY=55,maxBarW=380;
  sorted.forEach((entry,i)=>{
    const [name,info]=entry;
    const y=startY+i*(barH+gap);
    const w=Math.max(4,(info.count/maxCount)*maxBarW);
    const avgPrice=info.priceCount>0?Math.round(info.priceSum/info.priceCount):0;
    ctx.fillStyle=COLORS[i%COLORS.length];
    ctx.beginPath();
    const r=3;
    ctx.moveTo(startX+r,y);ctx.lineTo(startX+w-r,y);ctx.quadraticCurveTo(startX+w,y,startX+w,y+r);
    ctx.lineTo(startX+w,y+barH-r);ctx.quadraticCurveTo(startX+w,y+barH,startX+w-r,y+barH);
    ctx.lineTo(startX,y+barH);ctx.lineTo(startX,y);
    ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='12px sans-serif';ctx.textAlign='right';
    ctx.fillText(name,startX-10,y+barH/2+4);
    ctx.fillStyle='#fff';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
    ctx.fillText(info.count.toLocaleString()+'개',startX+w+8,y+barH/2+4);
    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='11px sans-serif';
    ctx.fillText('평균 '+avgPrice.toLocaleString()+'원',startX+w+60,y+barH/2+4);
  });
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='11px sans-serif';ctx.textAlign='left';
  ctx.fillText('실시간 data/all.json 기반 • 가짜 통계 없음',20,370);
}

// ─── 3. 요일×시간대 히트맵 Canvas ───────────────────────────────
function renderDayTimeHeatmap(container){
  const data=getData();if(!data.length)return;
  SFX16.play('heatmap');
  const canvas=createCanvas(620,400);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const dayLabels=['월','화','수','목','금','토','일'];
  const hours=[];for(let h=9;h<=20;h++)hours.push(h);
  const grid=dayLabels.map(()=>hours.map(()=>0));
  data.forEach(r=>{
    const ds=parseDays(r[6]);
    const h=parseHour(r[7]);
    if(h<9||h>20)return;
    const hi=h-9;
    ds.forEach(d=>{const di=dayLabels.indexOf(d);if(di>=0)grid[di][hi]++;});
  });
  const maxVal=Math.max(...grid.flat(),1);
  ctx.fillStyle='#0A1628';ctx.fillRect(0,0,620,400);
  drawTitle(ctx,'📅 요일×시간대 강좌 분포 히트맵',310,28);
  const cellW=40,cellH=36,startX=80,startY=65;
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='12px sans-serif';ctx.textAlign='center';
  hours.forEach((h,i)=>{ctx.fillText(h+'시',startX+i*cellW+cellW/2,startY-8);});
  ctx.textAlign='right';
  dayLabels.forEach((d,i)=>{ctx.fillText(d,startX-12,startY+i*cellH+cellH/2+4);});
  dayLabels.forEach((di,row)=>{
    hours.forEach((h,col)=>{
      const val=grid[row][col];
      const intensity=val/maxVal;
      const r16=Math.round(10+intensity*116);
      const g16=Math.round(22+intensity*178);
      const b16=Math.round(40+intensity*187);
      ctx.fillStyle=`rgb(${r16},${g16},${b16})`;
      const x=startX+col*cellW,y=startY+row*cellH;
      ctx.beginPath();
      ctx.roundRect(x+1,y+1,cellW-2,cellH-2,4);
      ctx.fill();
      if(val>0){
        ctx.fillStyle=intensity>0.5?'#fff':'rgba(255,255,255,0.7)';
        ctx.font=(intensity>0.3?'bold ':'')+('11px sans-serif');
        ctx.textAlign='center';
        ctx.fillText(val,x+cellW/2,y+cellH/2+4);
      }
    });
  });
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='11px sans-serif';ctx.textAlign='left';
  ctx.fillText('색이 진할수록 강좌 수 많음 • 실제 데이터 기반',20,390);
  const legendX=startX,legendY=startY+7*cellH+20;
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='11px sans-serif';ctx.textAlign='left';
  ctx.fillText('적음',legendX,legendY);
  for(let i=0;i<8;i++){
    const t=i/7;
    const lr=Math.round(10+t*116),lg=Math.round(22+t*178),lb=Math.round(40+t*187);
    ctx.fillStyle=`rgb(${lr},${lg},${lb})`;
    ctx.fillRect(legendX+35+i*25,legendY-10,23,14);
  }
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillText('많음',legendX+35+8*25+5,legendY);
}

// ─── 4. 카테고리 비율 분석 Canvas ───────────────────────────────
function renderCategoryBreakdown(container){
  const data=getData();if(!data.length)return;
  SFX16.play('category');
  const canvas=createCanvas(600,420);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const cats={};
  data.forEach(r=>{const c=r[3]||'기타';cats[c]=(cats[c]||0)+1;});
  const sorted=Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  const top12=sorted.slice(0,12);
  const otherCount=sorted.slice(12).reduce((s,e)=>s+e[1],0);
  if(otherCount>0)top12.push(['기타(외 '+(sorted.length-12)+'종)',otherCount]);
  const total=data.length;
  ctx.fillStyle='#0A1628';ctx.fillRect(0,0,600,420);
  drawTitle(ctx,'📊 카테고리별 강좌 비율 ('+total.toLocaleString()+'개)',300,28);
  const cx=170,cy=220,radius=130;
  let angle=-Math.PI/2;
  top12.forEach((entry,i)=>{
    const [name,count]=entry;
    const slice=count/total*Math.PI*2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,radius,angle,angle+slice);ctx.closePath();
    ctx.fillStyle=COLORS[i%COLORS.length];ctx.fill();
    ctx.strokeStyle='#0A1628';ctx.lineWidth=2;ctx.stroke();
    const midAngle=angle+slice/2;
    if(slice>0.15){
      const tx=cx+Math.cos(midAngle)*(radius*0.65);
      const ty=cy+Math.sin(midAngle)*(radius*0.65);
      ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      ctx.fillText(Math.round(count/total*100)+'%',tx,ty+4);
    }
    angle+=slice;
  });
  ctx.beginPath();ctx.arc(cx,cy,50,0,Math.PI*2);ctx.fillStyle='#0A1628';ctx.fill();
  ctx.fillStyle='#7EC8E3';ctx.font='bold 16px sans-serif';ctx.textAlign='center';
  ctx.fillText(total.toLocaleString(),cx,cy+2);
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='11px sans-serif';
  ctx.fillText('총 강좌',cx,cy+18);
  const legendX=340,legendY=60;
  top12.forEach((entry,i)=>{
    const [name,count]=entry;
    const ly=legendY+i*26;
    ctx.fillStyle=COLORS[i%COLORS.length];
    ctx.fillRect(legendX,ly,14,14);
    ctx.fillStyle='rgba(255,255,255,0.8)';ctx.font='12px sans-serif';ctx.textAlign='left';
    const displayName=name.length>10?name.substring(0,10)+'..':name;
    ctx.fillText(displayName+' '+count.toLocaleString(),legendX+20,ly+11);
  });
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='11px sans-serif';ctx.textAlign='left';
  ctx.fillText('실제 강좌 데이터 기반 • 가짜 통계 없음',20,410);
}

// ─── 5. 수강료 구간별 카테고리 분석 Canvas ───────────────────────
function renderPriceBandByCategory(container){
  const data=getData();if(!data.length)return;
  SFX16.play('band');
  const canvas=createCanvas(620,400);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const bandDefs=[
    {label:'1만 미만',min:0,max:10000},
    {label:'1~5만',min:10000,max:50000},
    {label:'5~10만',min:50000,max:100000},
    {label:'10~20만',min:100000,max:200000},
    {label:'20만+',min:200000,max:Infinity}
  ];
  const catCounts={};
  data.forEach(r=>{
    const cat=r[3]||'기타';
    const p=parsePrice(r[8]);if(p<=0)return;
    if(!catCounts[cat])catCounts[cat]=bandDefs.map(()=>0);
    for(let i=0;i<bandDefs.length;i++){
      if(p>=bandDefs[i].min&&p<bandDefs[i].max){catCounts[cat][i]++;break;}
    }
  });
  const topCats=Object.entries(catCounts).sort((a,b)=>{
    const sa=a[1].reduce((s,v)=>s+v,0),sb=b[1].reduce((s,v)=>s+v,0);return sb-sa;
  }).slice(0,8);
  ctx.fillStyle='#0A1628';ctx.fillRect(0,0,620,400);
  drawTitle(ctx,'🎯 수강료 구간별 카테고리 분석',310,28);
  const bandColors=['#10B981','#3AAFA9','#7EC8E3','#F59E0B','#EF4444'];
  const barH=30,gap=10,startX=130,startY=70,maxBarW=380;
  topCats.forEach((entry,row)=>{
    const [cat,counts]=entry;
    const total=counts.reduce((s,v)=>s+v,0);
    const y=startY+row*(barH+gap);
    ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='12px sans-serif';ctx.textAlign='right';
    const dispCat=cat.length>8?cat.substring(0,8)+'..':cat;
    ctx.fillText(dispCat,startX-10,y+barH/2+4);
    let xOff=0;
    counts.forEach((c,bi)=>{
      if(c===0)return;
      const w=Math.max(2,(c/total)*maxBarW);
      ctx.fillStyle=bandColors[bi];
      ctx.fillRect(startX+xOff,y,w,barH);
      if(w>25){
        ctx.fillStyle='#fff';ctx.font='10px sans-serif';ctx.textAlign='center';
        ctx.fillText(Math.round(c/total*100)+'%',startX+xOff+w/2,y+barH/2+3);
      }
      xOff+=w;
    });
    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='11px sans-serif';ctx.textAlign='left';
    ctx.fillText(total.toLocaleString(),startX+maxBarW+8,y+barH/2+4);
  });
  const legendY=startY+8*(barH+gap)+10;
  bandDefs.forEach((b,i)=>{
    const lx=80+i*110;
    ctx.fillStyle=bandColors[i];ctx.fillRect(lx,legendY,12,12);
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='11px sans-serif';ctx.textAlign='left';
    ctx.fillText(b.label,lx+16,legendY+10);
  });
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='11px sans-serif';ctx.textAlign='left';
  ctx.fillText('실제 가격 데이터 기반 100% 스택바',20,390);
}

// ─── 6. 개강 예정 캘린더 Canvas ─────────────────────────────────
function renderUpcomingCalendar(container){
  const data=getData();if(!data.length)return;
  SFX16.play('calendar');
  const canvas=createCanvas(600,380);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const today=new Date();
  const todayStr=today.getFullYear()+'.'+(today.getMonth()+1).toString().padStart(2,'0')+'.'+today.getDate().toString().padStart(2,'0');
  const upcoming={};
  data.forEach(r=>{
    const startDate=r[13]||'';
    if(!startDate||startDate<todayStr)return;
    const dateKey=startDate.substring(0,10);
    if(!upcoming[dateKey])upcoming[dateKey]=0;
    upcoming[dateKey]++;
  });
  const sortedDates=Object.entries(upcoming).sort((a,b)=>a[0].localeCompare(b[0])).slice(0,14);
  const maxCount=Math.max(...sortedDates.map(d=>d[1]),1);
  ctx.fillStyle='#0A1628';ctx.fillRect(0,0,600,380);
  drawTitle(ctx,'📆 개강 예정 캘린더 (향후 14일)',300,28);
  if(sortedDates.length===0){
    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='14px sans-serif';ctx.textAlign='center';
    ctx.fillText('향후 개강 예정 강좌가 없습니다',300,200);
    return;
  }
  const barW=35,gap=5,startX=30,startY=310;
  sortedDates.forEach((entry,i)=>{
    const [date,count]=entry;
    const x=startX+i*(barW+gap);
    const h=Math.max(4,(count/maxCount)*230);
    const grad=ctx.createLinearGradient(x,startY-h,x,startY);
    grad.addColorStop(0,'#7EC8E3');grad.addColorStop(1,'#3AAFA9');
    ctx.fillStyle=grad;
    ctx.beginPath();
    const r=3;const by=startY-h;
    ctx.moveTo(x+r,by);ctx.lineTo(x+barW-r,by);ctx.quadraticCurveTo(x+barW,by,x+barW,by+r);
    ctx.lineTo(x+barW,startY);ctx.lineTo(x,startY);ctx.lineTo(x,by+r);ctx.quadraticCurveTo(x,by,x+r,by);
    ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
    ctx.fillText(count,x+barW/2,startY-h-8);
    ctx.save();ctx.translate(x+barW/2,startY+12);ctx.rotate(Math.PI/4);
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='10px sans-serif';ctx.textAlign='left';
    const shortDate=date.substring(5).replace('.','/');
    ctx.fillText(shortDate,0,0);
    ctx.restore();
  });
  ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(startX-5,startY);ctx.lineTo(startX+14*(barW+gap),startY);ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='11px sans-serif';ctx.textAlign='left';
  ctx.fillText('실제 개강일 데이터 기반',20,370);
}

// ─── 7. 접수 상태 대시보드 Canvas ───────────────────────────────
function renderStatusDashboard(container){
  const data=getData();if(!data.length)return;
  SFX16.play('status');
  const canvas=createCanvas(580,360);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const statuses={};
  data.forEach(r=>{const s=r[10]||'미상';statuses[s]=(statuses[s]||0)+1;});
  const sorted=Object.entries(statuses).sort((a,b)=>b[1]-a[1]);
  const statusColors={'접수중':'#10B981','신청가능':'#3AAFA9','대기접수':'#F59E0B','대기신청':'#F97316','마감임박':'#EF4444','모집예정':'#8B5CF6','현장문의':'#6366F1','모집중':'#14B8A6','대기등록':'#EC4899','BEFORE':'#84CC16','추가접수':'#38BDF8','접수예정':'#A78BFA'};
  ctx.fillStyle='#0A1628';ctx.fillRect(0,0,580,360);
  drawTitle(ctx,'📋 접수 상태 대시보드',290,28);
  const total=data.length;
  const cx=160,cy=190,radius=110;
  let angle=-Math.PI/2;
  sorted.forEach((entry,i)=>{
    const [name,count]=entry;
    const slice=count/total*Math.PI*2;
    if(slice<0.01)return;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,radius,angle,angle+slice);ctx.closePath();
    ctx.fillStyle=statusColors[name]||COLORS[i%COLORS.length];ctx.fill();
    ctx.strokeStyle='#0A1628';ctx.lineWidth=2;ctx.stroke();
    angle+=slice;
  });
  ctx.beginPath();ctx.arc(cx,cy,45,0,Math.PI*2);ctx.fillStyle='#0A1628';ctx.fill();
  ctx.fillStyle='#7EC8E3';ctx.font='bold 15px sans-serif';ctx.textAlign='center';
  ctx.fillText(total.toLocaleString(),cx,cy+2);
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='11px sans-serif';
  ctx.fillText('총 강좌',cx,cy+18);
  const legendX=310,legendY=55;
  sorted.slice(0,10).forEach((entry,i)=>{
    const [name,count]=entry;
    const ly=legendY+i*28;
    ctx.fillStyle=statusColors[name]||COLORS[i%COLORS.length];
    ctx.fillRect(legendX,ly,12,12);
    ctx.fillStyle='rgba(255,255,255,0.8)';ctx.font='12px sans-serif';ctx.textAlign='left';
    ctx.fillText(name+' '+count.toLocaleString()+' ('+Math.round(count/total*100)+'%)',legendX+18,ly+11);
  });
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='11px sans-serif';ctx.textAlign='left';
  ctx.fillText('실시간 접수 상태 데이터',20,350);
}

// ─── 8. 지역별 분포 분석 Canvas ─────────────────────────────────
function renderRegionDistribution(container){
  const data=getData();if(!data.length)return;
  SFX16.play('region');
  const canvas=createCanvas(620,420);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');
  const regions={};
  data.forEach(r=>{
    const reg=parseRegion(r[15]);
    if(!regions[reg])regions[reg]={count:0,priceSum:0,priceCount:0};
    regions[reg].count++;
    const p=parsePrice(r[8]);
    if(p>0){regions[reg].priceSum+=p;regions[reg].priceCount++;}
  });
  const sorted=Object.entries(regions).filter(e=>e[0]!=='미상'&&e[1].count>=5).sort((a,b)=>b[1].count-a[1].count).slice(0,15);
  const maxCount=Math.max(...sorted.map(s=>s[1].count),1);
  ctx.fillStyle='#0A1628';ctx.fillRect(0,0,620,420);
  drawTitle(ctx,'🗺️ 지역별 강좌 분포 분석',310,28);
  const barH=22,gap=5,startX=80,startY=55,maxBarW=370;
  sorted.forEach((entry,i)=>{
    const [reg,info]=entry;
    const y=startY+i*(barH+gap);
    const w=Math.max(4,(info.count/maxCount)*maxBarW);
    const avgP=info.priceCount>0?Math.round(info.priceSum/info.priceCount):0;
    const grad=ctx.createLinearGradient(startX,y,startX+w,y);
    grad.addColorStop(0,COLORS[i%COLORS.length]);grad.addColorStop(1,COLORS[(i+3)%COLORS.length]);
    ctx.fillStyle=grad;
    ctx.beginPath();ctx.roundRect(startX,y,w,barH,3);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='12px sans-serif';ctx.textAlign='right';
    ctx.fillText(reg,startX-8,y+barH/2+4);
    ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='left';
    ctx.fillText(info.count.toLocaleString()+'개',startX+w+6,y+barH/2+4);
    ctx.fillStyle='rgba(255,255,255,0.45)';ctx.font='10px sans-serif';
    ctx.fillText('평균 '+avgP.toLocaleString()+'원',startX+w+55,y+barH/2+4);
  });
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='11px sans-serif';ctx.textAlign='left';
  ctx.fillText('주소 기반 실제 지역 분류 • 5개 미만 지역 제외',20,410);
}

// ─── 퀴즈 v16 +15문 (165→180) ───────────────────────────────────
const QUIZ_V16=[
  {q:'문화센터 강좌에서 가장 많은 카테고리는?',a:['기타','놀이','요가','미술'],c:0,
    hint:'기타 카테고리가 2,600개 이상으로 가장 많습니다'},
  {q:'백화점과 대형마트 중 강좌가 더 많은 곳은?',a:['백화점','대형마트','비슷함','아울렛'],c:0,
    hint:'백화점이 10,000개 이상으로 대형마트(3,400개)보다 3배 많습니다'},
  {q:'문화센터 강좌 평균 수강료는 약 얼마일까요?',a:['3만원','약 6.5만원','10만원','15만원'],c:1,
    hint:'전체 평균 수강료는 약 65,000원입니다'},
  {q:'강좌가 가장 많은 요일은?',a:['월요일','수요일','토요일','일요일'],c:2,
    hint:'토요일이 2,700개 이상으로 가장 많습니다'},
  {q:'강좌 수가 가장 많은 시간대는?',a:['9시','10시','11시','14시'],c:2,
    hint:'11시 시간대에 2,500개 이상 강좌가 집중되어 있습니다'},
  {q:'경기도와 서울 중 강좌가 더 많은 지역은?',a:['서울','경기','비슷함','부산'],c:1,
    hint:'경기도가 4,100개 이상으로 서울(3,800개)보다 많습니다'},
  {q:'접수중인 강좌 비율은 약 얼마나 될까요?',a:['30%','50%','약 70%','90%'],c:2,
    hint:'전체 강좌의 약 70%가 현재 접수중입니다'},
  {q:'놀이 카테고리 강좌 수는 약?',a:['500개','1,000개','약 2,100개','3,000개'],c:2,
    hint:'놀이 카테고리는 약 2,110개로 기타 다음으로 많습니다'},
  {q:'10만원 이상 강좌는 전체의 약 몇 %?',a:['10%','약 25%','40%','50%'],c:1,
    hint:'10~20만원 구간이 약 3,000개, 20만원+ 가 약 550개로 약 25%입니다'},
  {q:'경기평생학습 강좌는 약 몇 개?',a:['100개','약 430개','800개','1,200개'],c:1,
    hint:'경기평생학습은 약 426개 강좌를 제공합니다'},
  {q:'베이킹/디저트 카테고리 강좌는 약?',a:['200개','500개','약 840개','1,200개'],c:2,
    hint:'베이킹/디저트는 약 836개로 상위 5번째 카테고리입니다'},
  {q:'대기접수 상태의 강좌는 약?',a:['100개','300개','약 550개','800개'],c:2,
    hint:'대기접수는 약 550개로 접수중 다음으로 많습니다'},
  {q:'부산 지역 강좌는 약 몇 개?',a:['500개','1,000개','약 1,570개','2,000개'],c:2,
    hint:'부산은 약 1,566개로 전국 3위 지역입니다'},
  {q:'금요일 강좌는 약 몇 개?',a:['1,000개','약 1,700개','2,500개','3,000개'],c:1,
    hint:'금요일은 약 1,704개로 평일 중 가장 적습니다'},
  {q:'1만원 미만 강좌는 전체의 약?',a:['약 14%','30%','50%','5%'],c:0,
    hint:'1만원 미만은 약 1,950개로 전체의 약 14%입니다'}
];

// ─── 업적 v16 +12 (150→162) ─────────────────────────────────────
const ACHIEVE_V16=[
  {id:'v16_price_analyst',name:'가격 분석가',desc:'강좌 가격 분포 분석기 사용',icon:'💰'},
  {id:'v16_center_expert',name:'센터 전문가',desc:'센터 유형별 비교 분석 사용',icon:'🏬'},
  {id:'v16_time_master',name:'시간대 마스터',desc:'요일×시간대 히트맵 확인',icon:'⏰'},
  {id:'v16_category_guru',name:'카테고리 구루',desc:'카테고리 비율 분석 사용',icon:'📊'},
  {id:'v16_budget_planner',name:'예산 플래너',desc:'수강료 구간별 분석 사용',icon:'🎯'},
  {id:'v16_calendar_check',name:'캘린더 체커',desc:'개강 예정 캘린더 확인',icon:'📆'},
  {id:'v16_status_watcher',name:'상태 관찰자',desc:'접수 상태 대시보드 사용',icon:'📋'},
  {id:'v16_region_explorer',name:'지역 탐험가',desc:'지역별 분포 분석 사용',icon:'🗺️'},
  {id:'v16_quiz_challenger',name:'통계 퀵즈 도전자',desc:'v16 퀵즈 5문제 이상 정답',icon:'🧠'},
  {id:'v16_all_charts',name:'차트 컬렉터',desc:'모든 8종 Canvas 분석 사용',icon:'🏆'},
  {id:'v16_data_scholar',name:'데이터 학자',desc:'v16 퀵즈 10문제 이상 정답',icon:'🎓'},
  {id:'v16_complete',name:'v16 컴플리트',desc:'v16 모든 기능 체험 완료',icon:'⭐'}
];

function unlockAchieve(id){
  const achieved=lsGet('ccf_v16_achievements',[]);
  if(achieved.includes(id))return;
  achieved.push(id);lsSet('ccf_v16_achievements',achieved);
  const a=ACHIEVE_V16.find(x=>x.id===id);
  if(a){SFX16.play('achieve');showToast16(a.icon+' 업적 달성: '+a.name);}
}

// ─── 메인 UI 구성 ───────────────────────────────────────────────
const SECTIONS=[
  {id:'v16-price',title:'💰 가격 분포 분석기',render:renderPriceDistribution,achieve:'v16_price_analyst',key:'1'},
  {id:'v16-center',title:'🏬 센터 유형별 비교',render:renderCenterTypeComparison,achieve:'v16_center_expert',key:'2'},
  {id:'v16-heatmap',title:'📅 요일×시간대 히트맵',render:renderDayTimeHeatmap,achieve:'v16_time_master',key:'3'},
  {id:'v16-category',title:'📊 카테고리 비율 분석',render:renderCategoryBreakdown,achieve:'v16_category_guru',key:'4'},
  {id:'v16-priceband',title:'🎯 수강료 구간별 분석',render:renderPriceBandByCategory,achieve:'v16_budget_planner',key:'5'},
  {id:'v16-calendar',title:'📆 개강 예정 캘린더',render:renderUpcomingCalendar,achieve:'v16_calendar_check',key:'6'},
  {id:'v16-status',title:'📋 접수 상태 대시보드',render:renderStatusDashboard,achieve:'v16_status_watcher',key:'7'},
  {id:'v16-region',title:'🗺️ 지역별 분포 분석',render:renderRegionDistribution,achieve:'v16_region_explorer',key:'8'}
];

function buildV16UI(){
  const data=getData();
  if(!data||!data.length){setTimeout(buildV16UI,2000);return;}

  const root=document.getElementById('root');
  if(!root)return;
  const existing=document.getElementById('v16-analytics-hub');
  if(existing)return;

  const hub=document.createElement('div');hub.id='v16-analytics-hub';
  hub.style.cssText='max-width:700px;margin:32px auto;padding:0 16px;';

  const header=document.createElement('div');
  header.style.cssText='background:linear-gradient(135deg,rgba(126,200,227,0.08),rgba(58,175,169,0.06));border:1px solid rgba(126,200,227,0.15);border-radius:16px;padding:20px 24px;margin-bottom:16px;';
  header.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">'
    +'<div><span style="font-size:20px;font-weight:800;color:#7EC8E3">🔬 실데이터 분석 허브 v16</span>'
    +'<div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:4px">data/all.json 기반 '+data.length.toLocaleString()+'개 강좌 분석 • 가짜 데이터 없음</div></div>'
    +'<button id="v16-toggle-all" style="background:rgba(126,200,227,0.12);border:1px solid rgba(126,200,227,0.3);border-radius:10px;padding:8px 16px;color:#7EC8E3;font-size:12px;font-weight:700;cursor:pointer">전체 펼치기/접기</button>'
    +'</div>';
  hub.appendChild(header);

  const chartsUsed=lsGet('ccf_v16_charts_used',[]);

  SECTIONS.forEach(sec=>{
    const section=document.createElement('div');section.id=sec.id;
    section.style.cssText='background:var(--card-bg,rgba(255,255,255,0.03));border:1px solid var(--card-border,rgba(255,255,255,0.06));border-radius:14px;margin-bottom:12px;overflow:hidden;';

    const titleBar=document.createElement('div');
    titleBar.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:14px 18px;cursor:pointer;transition:background .2s;';
    titleBar.innerHTML='<span style="font-size:14px;font-weight:700;color:var(--text-primary,#fff)">'+sec.title+'</span>'
      +'<span style="font-size:11px;color:var(--text-muted,rgba(255,255,255,0.5))">Shift+'+sec.key+' • 클릭하여 열기</span>';

    const content=document.createElement('div');content.id=sec.id+'-content';
    content.style.cssText='padding:0 18px 18px;display:none;';

    titleBar.addEventListener('click',function(){
      SFX16.play('nav');
      if(content.style.display==='none'){
        content.style.display='block';
        if(!content.hasChildNodes()){
          sec.render(content);
          unlockAchieve(sec.achieve);
          if(!chartsUsed.includes(sec.id)){chartsUsed.push(sec.id);lsSet('ccf_v16_charts_used',chartsUsed);}
          if(chartsUsed.length>=8)unlockAchieve('v16_all_charts');
        }
      }else{
        content.style.display='none';
      }
    });
    titleBar.addEventListener('mouseenter',function(){this.style.background='rgba(126,200,227,0.06)';SFX16.play('hover');});
    titleBar.addEventListener('mouseleave',function(){this.style.background='';});

    section.appendChild(titleBar);section.appendChild(content);hub.appendChild(section);
  });

  // 퀴즈 섹션
  const quizSection=document.createElement('div');quizSection.id='v16-quiz-section';
  quizSection.style.cssText='background:var(--card-bg,rgba(255,255,255,0.03));border:1px solid var(--card-border,rgba(255,255,255,0.06));border-radius:14px;margin-bottom:12px;overflow:hidden;';
  const quizTitle=document.createElement('div');
  quizTitle.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:14px 18px;cursor:pointer;transition:background .2s;';
  quizTitle.innerHTML='<span style="font-size:14px;font-weight:700;color:var(--text-primary,#fff)">🧠 실데이터 통계 퀵즈 v16 (15문제)</span>'
    +'<span style="font-size:11px;color:var(--text-muted,rgba(255,255,255,0.5))">Shift+Q</span>';
  const quizContent=document.createElement('div');quizContent.id='v16-quiz-content';
  quizContent.style.cssText='padding:0 18px 18px;display:none;';
  quizTitle.addEventListener('click',function(){
    SFX16.play('nav');
    if(quizContent.style.display==='none'){
      quizContent.style.display='block';
      if(!quizContent.hasChildNodes())renderQuiz(quizContent);
    }else{quizContent.style.display='none';}
  });
  quizTitle.addEventListener('mouseenter',function(){this.style.background='rgba(126,200,227,0.06)';});
  quizTitle.addEventListener('mouseleave',function(){this.style.background='';});
  quizSection.appendChild(quizTitle);quizSection.appendChild(quizContent);hub.appendChild(quizSection);

  // 전체 토글
  const toggleBtn=hub.querySelector('#v16-toggle-all');
  let allOpen=false;
  toggleBtn.addEventListener('click',function(e){
    e.stopPropagation();
    allOpen=!allOpen;
    SECTIONS.forEach(sec=>{
      const content=document.getElementById(sec.id+'-content');
      if(allOpen){
        content.style.display='block';
        if(!content.hasChildNodes()){
          sec.render(content);unlockAchieve(sec.achieve);
          if(!chartsUsed.includes(sec.id)){chartsUsed.push(sec.id);lsSet('ccf_v16_charts_used',chartsUsed);}
        }
      }else{content.style.display='none';}
    });
    if(allOpen&&chartsUsed.length>=8)unlockAchieve('v16_all_charts');
  });

  // v16 완료 체크
  const achieved=lsGet('ccf_v16_achievements',[]);
  if(achieved.length>=11)unlockAchieve('v16_complete');

  root.parentNode.insertBefore(hub,root.nextSibling);
}

// ─── 퀴즈 렌더 ──────────────────────────────────────────────────
function renderQuiz(container){
  let current=0,score=0;
  const state=lsGet('ccf_v16_quiz_state',{answered:0,correct:0});

  function renderQ(){
    if(current>=QUIZ_V16.length){
      container.innerHTML='<div style="text-align:center;padding:20px">'
        +'<div style="font-size:36px;margin-bottom:12px">'+(score>=12?'🏆':score>=8?'🌟':'💪')+'</div>'
        +'<div style="font-size:18px;font-weight:800;color:#7EC8E3;margin-bottom:8px">'+score+'/'+QUIZ_V16.length+' 정답!</div>'
        +'<div style="font-size:13px;color:rgba(255,255,255,0.6)">'+
        (score>=12?'통계 마스터! 실데이터를 완벽히 이해하고 있습니다.':
         score>=8?'데이터 분석 능력이 뛰어납니다!':
         '분석 도구들을 사용해보면 더 잘 알 수 있어요!')
        +'</div>'
        +'<button onclick="this.parentNode.parentNode.innerHTML=\'\';window.__v16patch.renderQuiz(this.parentNode.parentNode)" style="margin-top:16px;background:rgba(126,200,227,0.15);border:1px solid rgba(126,200,227,0.3);border-radius:10px;padding:10px 24px;color:#7EC8E3;font-weight:700;cursor:pointer;font-size:13px">다시 풀기</button>'
        +'</div>';
      state.answered+=QUIZ_V16.length;state.correct+=score;lsSet('ccf_v16_quiz_state',state);
      if(score>=5)unlockAchieve('v16_quiz_challenger');
      if(score>=10)unlockAchieve('v16_data_scholar');
      return;
    }
    const q=QUIZ_V16[current];
    let html='<div style="margin-bottom:16px">'
      +'<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">문제 '+(current+1)+'/'+QUIZ_V16.length+' • 점수: '+score+'</div>'
      +'<div style="font-size:15px;font-weight:700;color:var(--text-primary,#fff);margin-bottom:16px">'+esc(q.q)+'</div>';
    q.a.forEach((a,i)=>{
      html+='<button class="v16-quiz-btn" data-idx="'+i+'" style="display:block;width:100%;text-align:left;padding:12px 16px;margin-bottom:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:var(--text,#D4D4D4);font-size:13px;cursor:pointer;transition:all .2s">'+esc(a)+'</button>';
    });
    html+='</div>';
    container.innerHTML=html;
    container.querySelectorAll('.v16-quiz-btn').forEach(btn=>{
      btn.addEventListener('click',function(){
        const idx=parseInt(this.dataset.idx);
        const correct=idx===q.c;
        if(correct){score++;SFX16.play('quiz');this.style.background='rgba(16,185,129,0.2)';this.style.borderColor='#10B981';this.style.color='#10B981';}
        else{SFX16.play('status');this.style.background='rgba(239,68,68,0.2)';this.style.borderColor='#EF4444';this.style.color='#EF4444';
          container.querySelectorAll('.v16-quiz-btn')[q.c].style.background='rgba(16,185,129,0.15)';container.querySelectorAll('.v16-quiz-btn')[q.c].style.borderColor='#10B981';}
        const hint=document.createElement('div');hint.style.cssText='font-size:12px;color:rgba(255,255,255,0.5);margin:8px 0;padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:8px;';
        hint.textContent='💡 '+q.hint;container.querySelector('div').appendChild(hint);
        container.querySelectorAll('.v16-quiz-btn').forEach(b=>{b.style.pointerEvents='none';});
        setTimeout(()=>{current++;renderQ();},1800);
      });
    });
  }
  renderQ();
}

// ─── 키보드 단축키 (Shift+1~8, Shift+Q) ────────────────────────
document.addEventListener('keydown',function(e){
  if(!e.shiftKey||e.ctrlKey||e.altKey||e.metaKey)return;
  const tag=document.activeElement?.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;

  if(e.key==='Q'||e.key==='q'){
    e.preventDefault();
    const qt=document.getElementById('v16-quiz-section');
    if(qt){qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  const idx={'1':0,'2':1,'3':2,'4':3,'5':4,'6':5,'7':6,'8':7,'!':0,'@':1,'#':2,'$':3,'%':4,'^':5,'&':6,'*':7}[e.key];
  if(idx!==undefined&&idx<SECTIONS.length){
    e.preventDefault();
    const sec=document.getElementById(SECTIONS[idx].id);
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
window.__v16patch={renderQuiz:renderQuiz};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',()=>setTimeout(buildV16UI,1500));}
else{setTimeout(buildV16UI,1500);}

})();
