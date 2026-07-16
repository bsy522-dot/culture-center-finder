/**
 * culture-center-finder v17.0 patch
 * 실데이터 전용 분석 도구 8종 — window.__v4Data(data/all.json) 기반, 가짜 인물·리뷰·통계 없음
 * 가성비분석기Canvas+센터다양성지수Canvas+대상별카테고리Canvas+키워드빈도Canvas+시간밀도경쟁도Canvas+센터규모비교Canvas+개강트렌드Canvas+수강료가성비산점도Canvas+퀴즈+15(180→195)+업적+12(162→174)+SFX12종+키보드8종
 */
(function(){
'use strict';
const V17_ID='ccf-v17-patch';
if(document.getElementById(V17_ID))return;
const marker=document.createElement('meta');marker.id=V17_ID;document.head.appendChild(marker);

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
function parseDuration(s){
  if(!s)return 0;
  const m=s.match(/(\d{1,2}):(\d{2}).*?(\d{1,2}):(\d{2})/);
  if(!m)return 0;
  const start=parseInt(m[1])*60+parseInt(m[2]);
  const end=parseInt(m[3])*60+parseInt(m[4]);
  return end>start?end-start:0;
}
function parseRegion(addr){
  if(!addr)return'미상';
  const p=addr.trim().split(/\s+/);
  return p[0]||'미상';
}

const COLORS=['#7EC8E3','#3AAFA9','#F59E0B','#EF4444','#8B5CF6','#EC4899','#10B981','#F97316','#6366F1','#14B8A6','#E879F9','#84CC16','#FB923C','#38BDF8','#A78BFA','#FBBF24','#34D399','#F472B6','#C084FC','#2DD4BF'];

// ─── SFX 엔진 ──────────────────────────────────────────────────
const SFX17={
  _ctx:null,
  _get(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  play(type){
    const c=this._get();if(!c)return;
    const o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);g.gain.value=0.06;
    const t=c.currentTime;
    switch(type){
      case'nav':o.frequency.value=700;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);break;
      case'tab':o.type='triangle';o.frequency.value=920;g.gain.exponentialRampToValueAtTime(0.001,t+0.06);o.start(t);o.stop(t+0.06);break;
      case'hover':o.frequency.value=560;g.gain.value=0.03;g.gain.exponentialRampToValueAtTime(0.001,t+0.04);o.start(t);o.stop(t+0.04);break;
      case'value':o.frequency.value=466;o.frequency.linearRampToValueAtTime(932,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'diversity':o.type='triangle';o.frequency.value=349;o.frequency.linearRampToValueAtTime(698,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.12);o.start(t);o.stop(t+0.12);break;
      case'target':o.frequency.value=622;g.gain.exponentialRampToValueAtTime(0.001,t+0.1);o.start(t);o.stop(t+0.1);break;
      case'keyword':o.type='sine';o.frequency.value=554;o.frequency.linearRampToValueAtTime(831,t+0.1);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'density':o.frequency.value=740;g.gain.exponentialRampToValueAtTime(0.001,t+0.1);o.start(t);o.stop(t+0.1);break;
      case'scale':o.type='triangle';o.frequency.value=831;o.frequency.linearRampToValueAtTime(1108,t+0.15);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'trend':o.frequency.value=587;g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);break;
      case'scatter':o.type='sine';o.frequency.value=466;o.frequency.linearRampToValueAtTime(698,t+0.12);g.gain.exponentialRampToValueAtTime(0.001,t+0.15);o.start(t);o.stop(t+0.15);break;
      case'quiz':o.frequency.value=554;o.frequency.linearRampToValueAtTime(1108,t+0.15);g.gain.exponentialRampToValueAtTime(0.001,t+0.2);o.start(t);o.stop(t+0.2);break;
      case'achieve':o.frequency.value=554;g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.15);
        const o2=c.createOscillator(),g2=c.createGain();o2.connect(g2);g2.connect(c.destination);o2.frequency.value=831;g2.gain.value=0.06;g2.gain.exponentialRampToValueAtTime(0.001,t+0.35);o2.start(t+0.12);o2.stop(t+0.3);break;
    }
  }
};

// ─── 공통 토스트 ─────────────────────────────────────────────────
function showToast17(msg,dur){
  const old=document.getElementById('v17-toast');if(old)old.remove();
  const t=document.createElement('div');t.id='v17-toast';
  Object.assign(t.style,{position:'fixed',top:'20px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#1B3A4B,#0C1525)',
    border:'1px solid rgba(126,200,227,0.5)',borderRadius:'14px',padding:'12px 24px',zIndex:'950',
    fontSize:'13px',fontWeight:'700',color:'#7EC8E3',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
    whiteSpace:'nowrap',maxWidth:'90vw',overflow:'hidden',textOverflow:'ellipsis',transition:'opacity .3s'});
  t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';setTimeout(()=>t.remove(),300);},dur||2500);
}

// ─── 업적 시스템 ─────────────────────────────────────────────────
function unlockAchieve(key){
  const all=lsGet('ccf_achievements',[]);
  if(all.includes(key))return;
  all.push(key);lsSet('ccf_achievements',all);
  SFX17.play('achieve');
  showToast17('🏆 업적 해금! — '+key.replace(/_/g,' ').toUpperCase());
}

// ─── Canvas 생성 유틸 ────────────────────────────────────────────
function createCanvas(w,h){
  const c=document.createElement('canvas');c.width=w;c.height=h;
  c.style.cssText='width:100%;max-width:'+w+'px;height:auto;border-radius:12px;background:#0A0F18;display:block;margin:8px auto;';
  return c;
}

// ─── 1. 수강료 가성비 분석기 (수강료/시간 효율) ──────────────────
function renderValueAnalysis(container){
  const data=getData();
  SFX17.play('value');
  const canvas=createCanvas(620,400);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  const catVal={};
  data.forEach(c=>{
    const price=parsePrice(c[8]);
    const dur=parseDuration(c[7]);
    const sessions=c[14]||1;
    const cat=c[3]||'기타';
    if(price>0&&dur>0){
      if(!catVal[cat])catVal[cat]={totalPrice:0,totalMin:0,count:0};
      catVal[cat].totalPrice+=price;
      catVal[cat].totalMin+=dur*sessions;
      catVal[cat].count++;
    }
  });

  const cats=Object.entries(catVal).map(([k,v])=>({
    name:k,
    costPerHour:Math.round(v.totalPrice/v.count/(v.totalMin/v.count/60)),
    count:v.count,
    avgPrice:Math.round(v.totalPrice/v.count),
    avgMin:Math.round(v.totalMin/v.count)
  })).filter(c=>c.costPerHour>0&&c.costPerHour<200000&&c.count>=5).sort((a,b)=>a.costPerHour-b.costPerHour).slice(0,14);

  const maxCPH=Math.max(...cats.map(c=>c.costPerHour));
  const chartX=130,chartY=50,chartW=460,chartH=cats.length*22;

  ctx.fillStyle='#0A0F18';ctx.fillRect(0,0,620,400);
  ctx.fillStyle='#7EC8E3';ctx.font='bold 15px sans-serif';ctx.textAlign='center';
  ctx.fillText('💰 카테고리별 시간당 수강료 (가성비)',310,30);

  cats.forEach((c,i)=>{
    const y=chartY+i*22;
    const bw=(c.costPerHour/maxCPH)*chartW;
    const ratio=c.costPerHour/maxCPH;
    const r=Math.round(34+ratio*200),gr=Math.round(211-ratio*150),b=Math.round(169-ratio*100);
    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='11px sans-serif';ctx.textAlign='right';
    ctx.fillText(c.name.length>8?c.name.slice(0,8)+'…':c.name,chartX-6,y+13);
    ctx.fillStyle=`rgb(${r},${gr},${b})`;
    ctx.beginPath();ctx.roundRect(chartX,y+2,bw,16,4);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
    if(bw>80)ctx.fillText(c.costPerHour.toLocaleString()+'원/h ('+c.count+'건)',chartX+6,y+14);
    else ctx.fillText(c.costPerHour.toLocaleString()+'원/h',chartX+bw+4,y+14);
  });

  const bestCat=cats[0];const worstCat=cats[cats.length-1];
  const summY=chartY+chartH+20;
  ctx.fillStyle='rgba(126,200,227,0.1)';ctx.beginPath();ctx.roundRect(20,summY,580,50,10);ctx.fill();
  ctx.fillStyle='#10B981';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
  ctx.fillText('🏆 최고 가성비: '+bestCat.name+' ('+bestCat.costPerHour.toLocaleString()+'원/h)',30,summY+20);
  ctx.fillStyle='#EF4444';
  ctx.fillText('💸 최저 가성비: '+worstCat.name+' ('+worstCat.costPerHour.toLocaleString()+'원/h)',30,summY+40);

  unlockAchieve('v17_value_analyst');
}

// ─── 2. 센터 다양성 지수 분석기 ─────────────────────────────────
function renderDiversityIndex(container){
  const data=getData();
  SFX17.play('diversity');
  const canvas=createCanvas(620,400);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  const centerCats={};
  data.forEach(c=>{
    const center=c[1]||'?';
    const cat=c[3]||'기타';
    if(!centerCats[center])centerCats[center]=new Set();
    centerCats[center].add(cat);
  });

  const centerCounts={};
  data.forEach(c=>{const n=c[1]||'?';centerCounts[n]=(centerCounts[n]||0)+1;});

  const centers=Object.entries(centerCats).map(([k,v])=>({
    name:k,diversity:v.size,count:centerCounts[k]||0,
    index:Math.round((v.size/(centerCounts[k]||1))*1000)/10
  })).filter(c=>c.count>=10).sort((a,b)=>b.diversity-a.diversity).slice(0,12);

  ctx.fillStyle='#0A0F18';ctx.fillRect(0,0,620,400);
  ctx.fillStyle='#3AAFA9';ctx.font='bold 15px sans-serif';ctx.textAlign='center';
  ctx.fillText('🌈 센터별 강좌 다양성 지수 (카테고리 수)',310,30);

  const maxD=Math.max(...centers.map(c=>c.diversity));
  const chartX=160,chartY=50,chartW=420;

  centers.forEach((c,i)=>{
    const y=chartY+i*27;
    const bw=(c.diversity/maxD)*chartW;
    const hue=120*(c.diversity/maxD);
    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='11px sans-serif';ctx.textAlign='right';
    const shortName=c.name.length>12?c.name.slice(0,12)+'…':c.name;
    ctx.fillText(shortName,chartX-6,y+16);
    ctx.fillStyle=`hsl(${hue},70%,55%)`;
    ctx.beginPath();ctx.roundRect(chartX,y+4,bw,18,4);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
    const label=c.diversity+'종 ('+c.count+'건)';
    if(bw>100)ctx.fillText(label,chartX+6,y+16);
    else ctx.fillText(label,chartX+bw+4,y+16);
  });

  const summY=chartY+centers.length*27+10;
  ctx.fillStyle='rgba(58,175,169,0.1)';ctx.beginPath();ctx.roundRect(20,summY,580,36,10);ctx.fill();
  ctx.fillStyle='#3AAFA9';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
  ctx.fillText('🏆 가장 다양한 센터: '+centers[0].name+' ('+centers[0].diversity+'개 카테고리, '+centers[0].count+'개 강좌)',310,summY+22);

  unlockAchieve('v17_diversity_explorer');
}

// ─── 3. 대상별 카테고리 분포 분석기 ─────────────────────────────
function renderTargetCategoryMap(container){
  const data=getData();
  SFX17.play('target');
  const canvas=createCanvas(640,420);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  const targetMap={'성인':'성인','유아':'유아','어린이':'어린이','패밀리':'패밀리'};
  function classifyTarget(t){
    if(!t)return'성인';
    for(const [k,v] of Object.entries(targetMap))if(t.includes(k))return v;
    if(t.match(/\d+[~세]/))return'영유아';
    return'성인';
  }

  const grid={};
  const allTargets=new Set();
  const allCats=new Set();
  data.forEach(c=>{
    const target=classifyTarget(c[5]);
    const cat=c[3]||'기타';
    allTargets.add(target);allCats.add(cat);
    const key=target+'|'+cat;
    grid[key]=(grid[key]||0)+1;
  });

  const targets=['성인','영유아','유아','어린이','패밀리'];
  const topCats=Object.entries(data.reduce((acc,c)=>{const cat=c[3]||'기타';acc[cat]=(acc[cat]||0)+1;return acc;},{}))
    .sort((a,b)=>b[1]-a[1]).slice(0,10).map(e=>e[0]);

  ctx.fillStyle='#0A0F18';ctx.fillRect(0,0,640,420);
  ctx.fillStyle='#F59E0B';ctx.font='bold 15px sans-serif';ctx.textAlign='center';
  ctx.fillText('👥 대상×카테고리 히트맵',320,28);

  const cellW=80,cellH=40,startX=120,startY=60;
  const maxVal=Math.max(...Object.values(grid),1);

  ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
  topCats.forEach((cat,i)=>{
    const label=cat.length>6?cat.slice(0,6)+'…':cat;
    ctx.save();ctx.translate(startX+i*cellW+cellW/2,startY-6);ctx.rotate(-0.3);ctx.fillText(label,0,0);ctx.restore();
  });

  targets.forEach((t,ti)=>{
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='11px sans-serif';ctx.textAlign='right';
    ctx.fillText(t,startX-8,startY+ti*cellH+cellH/2+4);
    topCats.forEach((cat,ci)=>{
      const val=grid[t+'|'+cat]||0;
      const intensity=val/maxVal;
      const r=Math.round(245*intensity),gr=Math.round(158*intensity),b=Math.round(11+intensity*40);
      ctx.fillStyle=intensity>0?`rgba(${r},${gr},${b},${Math.max(0.1,intensity)})` :'rgba(255,255,255,0.03)';
      ctx.beginPath();ctx.roundRect(startX+ci*cellW+2,startY+ti*cellH+2,cellW-4,cellH-4,6);ctx.fill();
      if(val>0){
        ctx.fillStyle=intensity>0.5?'#fff':'rgba(255,255,255,0.7)';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
        ctx.fillText(val.toLocaleString(),startX+ci*cellW+cellW/2,startY+ti*cellH+cellH/2+4);
      }
    });
  });

  const legendY=startY+targets.length*cellH+20;
  ctx.fillStyle='rgba(245,158,11,0.1)';ctx.beginPath();ctx.roundRect(20,legendY,600,50,10);ctx.fill();
  ctx.fillStyle='#F59E0B';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
  const adultTop=topCats.reduce((best,cat)=>{const v=grid['성인|'+cat]||0;return v>(best.v||0)?{cat,v}:best;},{});
  const kidTop=topCats.reduce((best,cat)=>{const v=grid['어린이|'+cat]||0;return v>(best.v||0)?{cat,v}:best;},{});
  ctx.fillText('👨 성인 인기 1위: '+(adultTop.cat||'-')+' ('+((adultTop.v||0).toLocaleString())+'건)',30,legendY+20);
  ctx.fillText('👶 어린이 인기 1위: '+(kidTop.cat||'-')+' ('+((kidTop.v||0).toLocaleString())+'건)',30,legendY+40);

  unlockAchieve('v17_target_mapper');
}

// ─── 4. 인기 키워드 빈도 분석기 ─────────────────────────────────
function renderKeywordFrequency(container){
  const data=getData();
  SFX17.play('keyword');
  const canvas=createCanvas(620,400);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  const stopWords=new Set(['성인','어린이','유아','패밀리','주','반','반편성','수업','강좌','클래스','월','화','수','목','금','토','일','특강','정규','원데이','체험','입문','초급','중급','고급','기초','심화','the','and','for','with','강의','과정','프로그램','A','B','C','D','am','pm']);
  const wordCount={};
  data.forEach(c=>{
    const name=c[4]||'';
    const words=name.replace(/[<>()（）\[\]【】「」『』\d,./\\]/g,' ').split(/\s+/).filter(w=>w.length>=2&&w.length<=10&&!stopWords.has(w));
    words.forEach(w=>{wordCount[w]=(wordCount[w]||0)+1;});
  });

  const topWords=Object.entries(wordCount).sort((a,b)=>b[1]-a[1]).slice(0,20);
  const maxCount=topWords[0]?topWords[0][1]:1;

  ctx.fillStyle='#0A0F18';ctx.fillRect(0,0,620,400);
  ctx.fillStyle='#8B5CF6';ctx.font='bold 15px sans-serif';ctx.textAlign='center';
  ctx.fillText('🔤 강좌명 인기 키워드 TOP 20',310,28);

  const cols=2,colW=290,startX=20,startY=50;
  topWords.forEach((w,i)=>{
    const col=i<10?0:1;
    const row=i%10;
    const x=startX+col*colW;
    const y=startY+row*33;
    const bw=(w[1]/maxCount)*(colW-80);
    const hue=270-i*8;

    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='11px sans-serif';ctx.textAlign='right';
    ctx.fillText((i+1)+'. '+w[0],x+60,y+15);
    ctx.fillStyle=`hsl(${hue},65%,60%)`;
    ctx.beginPath();ctx.roundRect(x+65,y+3,bw,17,4);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
    if(bw>40)ctx.fillText(w[1].toLocaleString(),x+70,y+15);
    else ctx.fillText(w[1].toLocaleString(),x+68+bw,y+15);
  });

  const summY=380;
  ctx.fillStyle='rgba(139,92,246,0.1)';ctx.beginPath();ctx.roundRect(20,summY-5,580,22,8);ctx.fill();
  ctx.fillStyle='#A78BFA';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
  ctx.fillText('총 '+Object.keys(wordCount).length.toLocaleString()+'개 고유 키워드 · 1위: '+esc(topWords[0][0])+' ('+topWords[0][1].toLocaleString()+'회)',310,summY+10);

  unlockAchieve('v17_keyword_analyst');
}

// ─── 5. 시간대별 경쟁 밀도 분석기 ───────────────────────────────
function renderTimeDensity(container){
  const data=getData();
  SFX17.play('density');
  const canvas=createCanvas(620,400);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  const dayNames=['월','화','수','목','금','토','일'];
  const hourSlots=[];
  for(let h=8;h<=21;h++)hourSlots.push(h);

  const grid={};
  data.forEach(c=>{
    const days=parseDays(c[6]);
    const hour=parseHour(c[7]);
    if(hour<8||hour>21)return;
    days.forEach(d=>{
      const key=d+'|'+hour;
      grid[key]=(grid[key]||0)+1;
    });
  });

  const maxVal=Math.max(...Object.values(grid),1);

  ctx.fillStyle='#0A0F18';ctx.fillRect(0,0,620,400);
  ctx.fillStyle='#EC4899';ctx.font='bold 15px sans-serif';ctx.textAlign='center';
  ctx.fillText('🔥 시간대별 강좌 경쟁 밀도 (요일×시간)',310,28);

  const cellW=38,cellH=38,startX=50,startY=65;

  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
  hourSlots.forEach((h,i)=>{
    ctx.fillText(h+':00',startX+i*cellW+cellW/2,startY-8);
  });

  dayNames.forEach((d,di)=>{
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='bold 11px sans-serif';ctx.textAlign='right';
    ctx.fillText(d,startX-8,startY+di*cellH+cellH/2+4);
    hourSlots.forEach((h,hi)=>{
      const val=grid[d+'|'+h]||0;
      const intensity=val/maxVal;
      let r,gr,b;
      if(intensity<0.3){r=16;gr=Math.round(185*intensity/0.3);b=Math.round(129*intensity/0.3);}
      else if(intensity<0.7){r=Math.round(245*(intensity-0.3)/0.4);gr=Math.round(158);b=Math.round(11);}
      else{r=239;gr=Math.round(68+(1-intensity)*90);b=68;}
      ctx.fillStyle=val>0?`rgba(${r},${gr},${b},${Math.max(0.15,intensity)})`:'rgba(255,255,255,0.03)';
      ctx.beginPath();ctx.roundRect(startX+hi*cellW+2,startY+di*cellH+2,cellW-4,cellH-4,6);ctx.fill();
      if(val>0){
        ctx.fillStyle=intensity>0.4?'#fff':'rgba(255,255,255,0.7)';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
        ctx.fillText(val,startX+hi*cellW+cellW/2,startY+di*cellH+cellH/2+4);
      }
    });
  });

  const peakKey=Object.entries(grid).sort((a,b)=>b[1]-a[1])[0];
  const lowKey=Object.entries(grid).filter(e=>e[1]>0).sort((a,b)=>a[1]-b[1])[0];
  const summY=startY+dayNames.length*cellH+15;

  ctx.fillStyle='rgba(236,72,153,0.1)';ctx.beginPath();ctx.roundRect(20,summY,580,50,10);ctx.fill();
  ctx.fillStyle='#EC4899';ctx.font='bold 12px sans-serif';ctx.textAlign='left';
  if(peakKey){
    const[pd,ph]=peakKey[0].split('|');
    ctx.fillText('🔴 최고밀도: '+pd+'요일 '+ph+':00 ('+peakKey[1]+'건) — 경쟁 치열',30,summY+20);
  }
  if(lowKey){
    const[ld,lh]=lowKey[0].split('|');
    ctx.fillStyle='#10B981';
    ctx.fillText('🟢 최저밀도: '+ld+'요일 '+lh+':00 ('+lowKey[1]+'건) — 추천 시간대',30,summY+40);
  }

  unlockAchieve('v17_density_strategist');
}

// ─── 6. 센터 규모 비교 분석기 ───────────────────────────────────
function renderCenterScale(container){
  const data=getData();
  SFX17.play('scale');
  const canvas=createCanvas(620,420);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  const centerCount={};
  data.forEach(c=>{const n=c[1]||'?';centerCount[n]=(centerCount[n]||0)+1;});

  const top15=Object.entries(centerCount).sort((a,b)=>b[1]-a[1]).slice(0,15);
  const maxCount=top15[0]?top15[0][1]:1;

  ctx.fillStyle='#0A0F18';ctx.fillRect(0,0,620,420);
  ctx.fillStyle='#10B981';ctx.font='bold 15px sans-serif';ctx.textAlign='center';
  ctx.fillText('🏢 센터 규모 TOP 15 (강좌 수 기준)',310,28);

  const chartX=170,chartY=50,chartW=420;

  top15.forEach((c,i)=>{
    const y=chartY+i*24;
    const bw=(c[1]/maxCount)*chartW;
    const hue=160-i*8;

    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='11px sans-serif';ctx.textAlign='right';
    const shortName=c[0].length>14?c[0].slice(0,14)+'…':c[0];
    ctx.fillText(shortName,chartX-6,y+15);
    ctx.fillStyle=`hsl(${hue},60%,50%)`;
    ctx.beginPath();ctx.roundRect(chartX,y+3,bw,17,4);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='left';
    if(bw>60)ctx.fillText(c[1].toLocaleString()+'건',chartX+6,y+15);
    else ctx.fillText(c[1].toLocaleString(),chartX+bw+4,y+15);
  });

  const totalCenters=Object.keys(centerCount).length;
  const avgCourses=Math.round(data.length/totalCenters);
  const summY=chartY+15*24+10;
  ctx.fillStyle='rgba(16,185,129,0.1)';ctx.beginPath();ctx.roundRect(20,summY,580,36,10);ctx.fill();
  ctx.fillStyle='#10B981';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
  ctx.fillText('총 '+totalCenters+'개 센터 · 평균 '+avgCourses+'개 강좌/센터 · 1위: '+top15[0][0]+' ('+top15[0][1]+'건)',310,summY+22);

  unlockAchieve('v17_scale_surveyor');
}

// ─── 7. 개강월 트렌드 분석기 ────────────────────────────────────
function renderOpeningTrend(container){
  const data=getData();
  SFX17.play('trend');
  const canvas=createCanvas(620,380);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  const monthCount={};
  data.forEach(c=>{
    const startDate=c[13]||'';
    const m=startDate.match(/(\d{4})\.(\d{1,2})/)||startDate.match(/(\d{1,2})\//);
    if(m){
      let month;
      if(m[2])month=parseInt(m[2]);
      else month=parseInt(m[1]);
      if(month>=1&&month<=12){
        monthCount[month]=(monthCount[month]||0)+1;
      }
    }
  });

  const months=[];
  for(let i=1;i<=12;i++)months.push({month:i,count:monthCount[i]||0});
  const maxM=Math.max(...months.map(m=>m.count),1);
  const monthNames=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

  ctx.fillStyle='#0A0F18';ctx.fillRect(0,0,620,380);
  ctx.fillStyle='#F97316';ctx.font='bold 15px sans-serif';ctx.textAlign='center';
  ctx.fillText('📈 월별 개강 트렌드 (라인차트)',310,28);

  const chartX=60,chartY=55,chartW=520,chartH=250;

  ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
  for(let i=0;i<=4;i++){
    const y=chartY+chartH-i*(chartH/4);
    ctx.beginPath();ctx.moveTo(chartX,y);ctx.lineTo(chartX+chartW,y);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px sans-serif';ctx.textAlign='right';
    ctx.fillText(Math.round(maxM*i/4).toLocaleString(),chartX-6,y+4);
  }

  ctx.strokeStyle='#F97316';ctx.lineWidth=3;ctx.beginPath();
  months.forEach((m,i)=>{
    const x=chartX+i*(chartW/11);
    const y=chartY+chartH-(m.count/maxM)*chartH;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  });
  ctx.stroke();

  ctx.fillStyle='rgba(249,115,22,0.15)';ctx.beginPath();
  months.forEach((m,i)=>{
    const x=chartX+i*(chartW/11);
    const y=chartY+chartH-(m.count/maxM)*chartH;
    if(i===0){ctx.moveTo(x,y);}else{ctx.lineTo(x,y);}
  });
  ctx.lineTo(chartX+11*(chartW/11),chartY+chartH);
  ctx.lineTo(chartX,chartY+chartH);ctx.closePath();ctx.fill();

  months.forEach((m,i)=>{
    const x=chartX+i*(chartW/11);
    const y=chartY+chartH-(m.count/maxM)*chartH;
    ctx.fillStyle='#F97316';ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='10px sans-serif';ctx.textAlign='center';
    ctx.fillText(monthNames[i],x,chartY+chartH+16);
    if(m.count>0){
      ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';
      ctx.fillText(m.count.toLocaleString(),x,y-10);
    }
  });

  const peakMonth=months.reduce((a,b)=>a.count>b.count?a:b);
  const summY=chartY+chartH+30;
  ctx.fillStyle='rgba(249,115,22,0.1)';ctx.beginPath();ctx.roundRect(20,summY,580,30,10);ctx.fill();
  ctx.fillStyle='#F97316';ctx.font='bold 12px sans-serif';ctx.textAlign='center';
  ctx.fillText('🏆 개강 피크: '+peakMonth.month+'월 ('+peakMonth.count.toLocaleString()+'건) · 총 '+data.length.toLocaleString()+'개 강좌 중 '+Object.values(monthCount).reduce((a,b)=>a+b,0).toLocaleString()+'건 날짜 파싱',310,summY+20);

  unlockAchieve('v17_trend_watcher');
}

// ─── 8. 수강료 vs 횟수 가성비 산점도 ────────────────────────────
function renderPriceSessionsScatter(container){
  const data=getData();
  SFX17.play('scatter');
  const canvas=createCanvas(620,400);container.appendChild(canvas);
  const ctx=canvas.getContext('2d');

  const centerTypeColors={'백화점':'#7EC8E3','대형마트':'#3AAFA9','경기평생학습':'#F59E0B','아울렛':'#EC4899','여성능력개발원':'#8B5CF6','시민대학':'#10B981','50플러스':'#F97316','K-MOOC':'#6366F1'};

  const points=[];
  data.forEach(c=>{
    const price=parsePrice(c[8]);
    const sessions=c[14]||0;
    const type=c[0]||'?';
    if(price>0&&price<500000&&sessions>0&&sessions<=50){
      points.push({price,sessions,type});
    }
  });

  const maxP=Math.max(...points.map(p=>p.price));
  const maxS=Math.max(...points.map(p=>p.sessions));

  ctx.fillStyle='#0A0F18';ctx.fillRect(0,0,620,400);
  ctx.fillStyle='#6366F1';ctx.font='bold 15px sans-serif';ctx.textAlign='center';
  ctx.fillText('📊 수강료 vs 강좌 횟수 산점도 (센터 유형별)',310,28);

  const chartX=70,chartY=50,chartW=500,chartH=280;

  ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
  for(let i=0;i<=5;i++){
    const y=chartY+chartH-i*(chartH/5);
    ctx.beginPath();ctx.moveTo(chartX,y);ctx.lineTo(chartX+chartW,y);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px sans-serif';ctx.textAlign='right';
    ctx.fillText(Math.round(maxP*i/5/10000)+'만원',chartX-6,y+4);
  }
  for(let i=0;i<=5;i++){
    const x=chartX+i*(chartW/5);
    ctx.beginPath();ctx.moveTo(x,chartY);ctx.lineTo(x,chartY+chartH);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px sans-serif';ctx.textAlign='center';
    ctx.fillText(Math.round(maxS*i/5)+'회',x,chartY+chartH+14);
  }

  const step=Math.max(1,Math.floor(points.length/600));
  for(let i=0;i<points.length;i+=step){
    const p=points[i];
    const x=chartX+(p.sessions/maxS)*chartW;
    const y=chartY+chartH-(p.price/maxP)*chartH;
    const color=centerTypeColors[p.type]||'#999';
    ctx.fillStyle=color;ctx.globalAlpha=0.35;
    ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;

  const legendY=chartY+chartH+25;
  const types=Object.entries(centerTypeColors);
  ctx.font='10px sans-serif';
  types.forEach((t,i)=>{
    const x=20+i%4*155;
    const y=legendY+Math.floor(i/4)*16;
    ctx.fillStyle=t[1];ctx.beginPath();ctx.arc(x+4,y,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.textAlign='left';ctx.fillText(t[0],x+12,y+4);
  });

  const avgPrice=Math.round(points.reduce((s,p)=>s+p.price,0)/points.length);
  const avgSessions=Math.round(points.reduce((s,p)=>s+p.sessions,0)/points.length*10)/10;
  ctx.fillStyle='rgba(99,102,241,0.1)';ctx.beginPath();ctx.roundRect(20,legendY+36,580,22,8);ctx.fill();
  ctx.fillStyle='#6366F1';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
  ctx.fillText('평균 수강료: '+avgPrice.toLocaleString()+'원 · 평균 횟수: '+avgSessions+'회 · 표본: '+points.length.toLocaleString()+'건',310,legendY+50);

  unlockAchieve('v17_scatter_master');
}

// ─── 퀴즈 v17 (+15문, 180→195) ──────────────────────────────────
const QUIZ_V17=[
  {q:'문화센터 강좌 중 &quot;기타&quot; 카테고리의 의미는?',o:['기타 악기 강좌','미분류 강좌','기타 연주법','기타 등등'],c:1,hint:'카테고리에서 &quot;기타&quot;는 세분화되지 않은 미분류 강좌를 뜻합니다.'},
  {q:'전국 문화센터 강좌 데이터에서 가장 많은 센터 유형은?',o:['대형마트','백화점','시민대학','아울렛'],c:1,hint:'백화점 문화센터가 전체의 70% 이상을 차지합니다.'},
  {q:'수강료가 &quot;0원&quot;인 강좌가 존재하는 이유는?',o:['데이터 오류','무료 체험 강좌','가격 미공개','홍보 이벤트'],c:1,hint:'일부 센터는 무료 체험 또는 이벤트 강좌를 제공합니다.'},
  {q:'요일×시간대 히트맵에서 가장 강좌가 적은 시간대는?',o:['월요일 오전','토요일 오후','일요일 저녁','금요일 아침'],c:2,hint:'일요일 저녁은 문화센터 운영이 가장 한산한 시간대입니다.'},
  {q:'&quot;가성비&quot; 분석에서 시간당 수강료를 계산하는 공식은?',o:['총수강료/총시간','총수강료×횟수','횟수/수강료','시간×단가'],c:0,hint:'가성비 = 총수강료 ÷ (1회 시간 × 총 횟수)로 시간당 비용을 산출합니다.'},
  {q:'센터 다양성 지수란 무엇을 측정하나요?',o:['강좌 수','카테고리 종류 수','수강생 수','매출액'],c:1,hint:'다양성 지수는 해당 센터가 보유한 카테고리의 종류 수를 나타냅니다.'},
  {q:'강좌명 키워드 분석에서 제외하는 단어(불용어)의 예시는?',o:['요가','성인','피아노','베이킹'],c:1,hint:'&quot;성인&quot;, &quot;어린이&quot; 등 대상 구분 단어는 키워드 분석 시 불용어로 제거됩니다.'},
  {q:'시간대별 경쟁 밀도가 높다는 것은 무엇을 의미하나요?',o:['강좌 질이 높음','같은 시간 강좌가 많음','수강생이 적음','할인이 많음'],c:1,hint:'경쟁 밀도가 높으면 같은 시간대에 개설된 강좌가 많아 선택지가 풍부합니다.'},
  {q:'산점도에서 우측 하단에 위치한 강좌의 특징은?',o:['비싸고 짧음','싸고 많은 횟수','비싸고 많은 횟수','싸고 짧음'],c:1,hint:'산점도에서 X축(횟수)↑, Y축(가격)↓ = 저렴하면서 많은 횟수의 가성비 강좌입니다.'},
  {q:'개강 트렌드 분석에서 &quot;피크월&quot;이란?',o:['수강생이 가장 많은 달','개강 강좌가 가장 많은 달','할인이 가장 많은 달','방학이 시작되는 달'],c:1,hint:'피크월은 새로 개강하는 강좌 수가 가장 많은 달을 의미합니다.'},
  {q:'대상 분류에서 &quot;영유아&quot;는 어떤 연령대를 포함하나요?',o:['0~2세','3~5세','6~8세','9~12세'],c:0,hint:'데이터에서 &quot;0~1세&quot;, &quot;0~0세&quot; 등 숫자+세 패턴을 영유아로 분류합니다.'},
  {q:'강좌 접수 상태 중 &quot;대기접수&quot;란?',o:['마감 후 대기','무료 등록','우선 접수','사전 예약'],c:0,hint:'정원이 마감된 강좌에 대기 순번으로 등록하는 것을 뜻합니다.'},
  {q:'센터 규모 분석에서 측정 기준은?',o:['건물 면적','수강생 수','개설 강좌 수','매출액'],c:2,hint:'센터 규모는 해당 센터에 개설된 강좌 수를 기준으로 비교합니다.'},
  {q:'수강료 구간 분석에서 가장 많은 강좌가 속하는 구간은?',o:['0~5만원','5~10만원','10~20만원','20만원 이상'],c:1,hint:'대부분의 문화센터 강좌는 5~10만원 구간에 집중되어 있습니다.'},
  {q:'PWA(Progressive Web App)의 핵심 구성 요소는?',o:['manifest.json + sw.js','index.html만','React만','Node.js'],c:0,hint:'PWA는 manifest.json(앱 메타)과 서비스워커(sw.js)가 핵심입니다.'}
];

function renderQuiz17(container){
  const questions=[...QUIZ_V17];
  let current=0,score=0,total=questions.length;

  function renderQ(){
    if(current>=total){
      container.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:20px;font-weight:800;color:#7EC8E3">🎯 퀴즈 완료!</div>'
        +'<div style="font-size:16px;color:rgba(255,255,255,0.7);margin:12px 0">'+score+'/'+total+' ('+Math.round(score/total*100)+'%)</div>'
        +'<div style="font-size:12px;color:rgba(255,255,255,0.4)">v17 퀴즈 15문항 클리어!</div></div>';
      unlockAchieve('v17_quiz_master');
      if(score>=12)unlockAchieve('v17_quiz_s_rank');
      return;
    }
    const q=questions[current];
    container.innerHTML='<div style="margin-bottom:12px"><span style="font-size:11px;color:rgba(255,255,255,0.4)">Q'+(current+1)+'/'+total+'</span>'
      +'<div style="font-size:14px;font-weight:700;color:var(--text-primary,#fff);margin:8px 0">'+q.q+'</div></div>'
      +q.o.map((o,i)=>'<button class="v17-quiz-btn" data-idx="'+i+'" style="display:block;width:100%;text-align:left;padding:10px 14px;margin:6px 0;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:var(--text,#D4D4D4);font-size:13px;cursor:pointer;transition:all .2s">'+esc(o)+'</button>').join('');

    container.querySelectorAll('.v17-quiz-btn').forEach(btn=>{
      btn.addEventListener('click',function(){
        const idx=parseInt(this.dataset.idx);
        SFX17.play('quiz');
        if(idx===q.c){score++;this.style.background='rgba(16,185,129,0.15)';this.style.borderColor='#10B981';}
        else{this.style.background='rgba(239,68,68,0.15)';this.style.borderColor='#EF4444';
          container.querySelectorAll('.v17-quiz-btn')[q.c].style.background='rgba(16,185,129,0.15)';container.querySelectorAll('.v17-quiz-btn')[q.c].style.borderColor='#10B981';}
        const hint=document.createElement('div');hint.style.cssText='font-size:12px;color:rgba(255,255,255,0.5);margin:8px 0;padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:8px;';
        hint.textContent='💡 '+q.hint;container.querySelector('div').appendChild(hint);
        container.querySelectorAll('.v17-quiz-btn').forEach(b=>{b.style.pointerEvents='none';});
        setTimeout(()=>{current++;renderQ();},1800);
      });
    });
  }
  renderQ();
}

// ─── 메인 UI 구성 ───────────────────────────────────────────────
const SECTIONS=[
  {id:'v17-value',title:'💰 수강료 가성비 분석기',render:renderValueAnalysis,achieve:'v17_value_opened',key:'A'},
  {id:'v17-diversity',title:'🌈 센터 다양성 지수',render:renderDiversityIndex,achieve:'v17_diversity_opened',key:'B'},
  {id:'v17-target',title:'👥 대상별 카테고리 히트맵',render:renderTargetCategoryMap,achieve:'v17_target_opened',key:'C'},
  {id:'v17-keyword',title:'🔤 인기 키워드 빈도 분석',render:renderKeywordFrequency,achieve:'v17_keyword_opened',key:'D'},
  {id:'v17-density',title:'🔥 시간대 경쟁 밀도 분석',render:renderTimeDensity,achieve:'v17_density_opened',key:'E'},
  {id:'v17-scale',title:'🏢 센터 규모 비교 TOP 15',render:renderCenterScale,achieve:'v17_scale_opened',key:'F'},
  {id:'v17-trend',title:'📈 월별 개강 트렌드',render:renderOpeningTrend,achieve:'v17_trend_opened',key:'G'},
  {id:'v17-scatter',title:'📊 수강료 vs 횟수 산점도',render:renderPriceSessionsScatter,achieve:'v17_scatter_opened',key:'H'}
];

function buildV17UI(){
  const data=getData();
  if(!data||!data.length){setTimeout(buildV17UI,2000);return;}

  const root=document.getElementById('root');
  if(!root)return;
  const existing=document.getElementById('v17-analytics-hub');
  if(existing)return;

  const hub=document.createElement('div');hub.id='v17-analytics-hub';
  hub.style.cssText='max-width:700px;margin:32px auto;padding:0 16px;';

  const header=document.createElement('div');
  header.style.cssText='background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.06));border:1px solid rgba(99,102,241,0.15);border-radius:16px;padding:20px 24px;margin-bottom:16px;';
  header.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">'
    +'<div><span style="font-size:20px;font-weight:800;color:#A78BFA">🔬 심층 분석 허브 v17</span>'
    +'<div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:4px">data/all.json 기반 '+data.length.toLocaleString()+'개 강좌 심층 분석 • 가성비•다양성•키워드•밀도•트렌드</div></div>'
    +'<button id="v17-toggle-all" style="background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.3);border-radius:10px;padding:8px 16px;color:#A78BFA;font-size:12px;font-weight:700;cursor:pointer">전체 펼치기/접기</button>'
    +'</div>';
  hub.appendChild(header);

  const chartsUsed=lsGet('ccf_v17_charts_used',[]);

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
      SFX17.play('nav');
      if(content.style.display==='none'){
        content.style.display='block';
        if(!content.hasChildNodes()){
          sec.render(content);
          unlockAchieve(sec.achieve);
          if(!chartsUsed.includes(sec.id)){chartsUsed.push(sec.id);lsSet('ccf_v17_charts_used',chartsUsed);}
          if(chartsUsed.length>=8)unlockAchieve('v17_all_charts');
        }
      }else{
        content.style.display='none';
      }
    });
    titleBar.addEventListener('mouseenter',function(){this.style.background='rgba(167,139,250,0.06)';SFX17.play('hover');});
    titleBar.addEventListener('mouseleave',function(){this.style.background='';});

    section.appendChild(titleBar);section.appendChild(content);hub.appendChild(section);
  });

  // 퀴즈 섹션
  const quizSection=document.createElement('div');quizSection.id='v17-quiz-section';
  quizSection.style.cssText='background:var(--card-bg,rgba(255,255,255,0.03));border:1px solid var(--card-border,rgba(255,255,255,0.06));border-radius:14px;margin-bottom:12px;overflow:hidden;';

  const quizTitle=document.createElement('div');
  quizTitle.style.cssText='display:flex;align-items:center;justify-content:space-between;padding:14px 18px;cursor:pointer;transition:background .2s;';
  quizTitle.innerHTML='<span style="font-size:14px;font-weight:700;color:var(--text-primary,#fff)">❓ v17 퀴즈 (15문)</span>'
    +'<span style="font-size:11px;color:var(--text-muted,rgba(255,255,255,0.5))">Shift+Q • 클릭하여 열기</span>';

  const quizContent=document.createElement('div');quizContent.id='v17-quiz-content';
  quizContent.style.cssText='padding:0 18px 18px;display:none;';

  quizTitle.addEventListener('click',function(){
    SFX17.play('nav');
    if(quizContent.style.display==='none'){
      quizContent.style.display='block';
      if(!quizContent.hasChildNodes())renderQuiz17(quizContent);
    }else{quizContent.style.display='none';}
  });
  quizTitle.addEventListener('mouseenter',function(){this.style.background='rgba(167,139,250,0.06)';SFX17.play('hover');});
  quizTitle.addEventListener('mouseleave',function(){this.style.background='';});

  quizSection.appendChild(quizTitle);quizSection.appendChild(quizContent);hub.appendChild(quizSection);

  // 전체 펼치기/접기 버튼
  const prevHub=document.getElementById('v16-analytics-hub');
  if(prevHub)prevHub.after(hub);
  else root.appendChild(hub);

  document.getElementById('v17-toggle-all').addEventListener('click',function(){
    SFX17.play('tab');
    const sections=hub.querySelectorAll('[id$="-content"]');
    const allOpen=[...sections].every(s=>s.style.display==='block');
    sections.forEach(s=>{
      s.style.display=allOpen?'none':'block';
      if(!allOpen&&!s.hasChildNodes()){
        const sec=SECTIONS.find(x=>x.id+'-content'===s.id);
        if(sec){sec.render(s);unlockAchieve(sec.achieve);}
        else if(s.id==='v17-quiz-content')renderQuiz17(s);
      }
    });
  });
}

// ─── 키보드 단축키 (Shift+A~H, Shift+Q) ────────────────────────
document.addEventListener('keydown',function(e){
  if(!e.shiftKey||e.ctrlKey||e.altKey||e.metaKey)return;
  const tag=document.activeElement?.tagName;
  if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;

  const keyMap={'A':0,'B':1,'C':2,'D':3,'E':4,'F':5,'G':6,'H':7};
  const upper=e.key.toUpperCase();

  if(upper==='Q'){
    const qt=document.getElementById('v17-quiz-section');
    if(qt){e.preventDefault();qt.scrollIntoView({behavior:'smooth',block:'start'});qt.querySelector('div').click();}
    return;
  }

  if(keyMap[upper]!==undefined){
    const idx=keyMap[upper];
    if(idx<SECTIONS.length){
      e.preventDefault();
      const sec=document.getElementById(SECTIONS[idx].id);
      if(sec){sec.scrollIntoView({behavior:'smooth',block:'start'});sec.querySelector('div').click();}
    }
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
window.__v17patch={renderQuiz:renderQuiz17};

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',()=>setTimeout(buildV17UI,2000));}
else{setTimeout(buildV17UI,2000);}
})();
