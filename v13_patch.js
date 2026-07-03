/* culture-center-finder v13.0 patch – 2026-07-03 */
(function(){
'use strict';
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
const V13_ID='ccf-v13-patch';
if(document.getElementById(V13_ID))return;
const marker=document.createElement('meta');marker.id=V13_ID;document.head.appendChild(marker);
function qs(s,p){return(p||document).querySelector(s);}
function ce(t){return document.createElement(t);}
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function isDark(){return document.documentElement.classList.contains('dark')||document.body.classList.contains('dark-mode')||window.matchMedia('(prefers-color-scheme:dark)').matches;}
function showToast13(msg,dur){
  const t=ce('div');t.className='v13-toast';
  t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:'+
    (isDark()?'rgba(255,255,255,0.95)':'rgba(30,30,30,0.95)')+';color:'+(isDark()?'#111':'#fff')+
    ';padding:12px 24px;border-radius:28px;font-size:14px;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.3);'+
    'animation:v13FadeIn 0.3s ease;pointer-events:none;text-align:center;max-width:90vw;';
  t.textContent=msg;document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity 0.3s';setTimeout(()=>t.remove(),300);},dur||2500);
}
function fmtDate13(d){const dt=d?new Date(d):new Date();const mm=String(dt.getMonth()+1).padStart(2,'0');const dd=String(dt.getDate()).padStart(2,'0');return dt.getFullYear()+'-'+mm+'-'+dd;}

const SFX13={
  _ctx:null,_getCtx(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  _presets:{
    trend_open:{freq:587,type:'sine',dur:0.18,vol:0.12},
    instructor_eval:{freq:659,type:'triangle',dur:0.2,vol:0.13},
    cost_calc:{freq:523,type:'sine',dur:0.15,vol:0.11},
    community_match:{freq:698,type:'sine',dur:0.22,vol:0.12},
    badge_earn:{freq:880,type:'sine',dur:0.35,vol:0.15},
    diary_check:{freq:440,type:'triangle',dur:0.12,vol:0.1},
    access_score:{freq:554,type:'sine',dur:0.2,vol:0.12},
    curator_pick:{freq:784,type:'triangle',dur:0.25,vol:0.13},
    quiz_v13:{freq:622,type:'sine',dur:0.18,vol:0.11},
    quiz_correct13:{freq:988,type:'sine',dur:0.3,vol:0.14},
    achieve_v13:{freq:1047,type:'sine',dur:0.4,vol:0.16},
    feature_open13:{freq:740,type:'triangle',dur:0.2,vol:0.12}
  },
  play(name){
    const c=this._getCtx();if(!c)return;const p=this._presets[name];if(!p)return;
    try{const o=c.createOscillator();const g=c.createGain();o.type=p.type;o.frequency.value=p.freq;
    g.gain.setValueAtTime(p.vol,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+p.dur);
    o.connect(g);g.connect(c.destination);o.start(c.currentTime);o.stop(c.currentTime+p.dur);}catch(e){}
  }
};

const V13_ACHIEVEMENTS=[
  {id:'trend_analyst',name:'트렌드 분석가',desc:'강좌 트렌드 분석기를 처음 사용',icon:'&#128200;'},
  {id:'trend_expert',name:'트렌드 전문가',desc:'트렌드 분석기 5회 사용',icon:'&#128202;'},
  {id:'instructor_reviewer',name:'강사 평가사',desc:'강사 평가를 처음 완료',icon:'&#127891;'},
  {id:'cost_optimizer',name:'비용 최적화 달인',desc:'비용 최적화 계산기 처음 사용',icon:'&#128176;'},
  {id:'community_joiner',name:'커뮤니티 합류',desc:'학습 커뮤니티 매칭 처음 완료',icon:'&#129309;'},
  {id:'badge_collector',name:'배지 컬렉터',desc:'품질 배지 3개 획득',icon:'&#127942;'},
  {id:'badge_master',name:'배지 마스터',desc:'품질 배지 전체 획득',icon:'&#127775;'},
  {id:'diary_starter',name:'다이어리 시작',desc:'수강 다이어리 처음 작성',icon:'&#128214;'},
  {id:'diary_30days',name:'30일 완주',desc:'수강 다이어리 30일 연속 기록',icon:'&#128293;'},
  {id:'access_checker',name:'접근성 점검관',desc:'센터 접근성 평가 처음 완료',icon:'&#128205;'},
  {id:'curator_user',name:'AI 큐레이터 사용자',desc:'AI 강좌 큐레이션 처음 이용',icon:'&#129302;'},
  {id:'v13_explorer',name:'v13 탐험가',desc:'v13 신규 기능 5개 이상 사용',icon:'&#127756;'}
];

const QUIZ_V13=[
  {q:'문화센터 강좌 중 가장 많은 비율을 차지하는 카테고리는?',opts:['요가/필라테스','기타','수영','미술'],a:1},
  {q:'클래스101의 주요 차별화 포인트는?',opts:['무료 강의','크리에이터 중심 콘텐츠','오프라인 수업','국비 지원'],a:1},
  {q:'탈잉에서 제공하는 주요 수업 형태는?',opts:['대형 강의','소그룹 튜터링','온라인 VOD','자격증 교육'],a:1},
  {q:'문화센터 강좌의 평균 수강 기간은?',opts:['1개월','3개월','6개월','1년'],a:1},
  {q:'수강료 비교 시 가장 중요한 고려 요소는?',opts:['강사 유명도','시간당 비용 대비 콘텐츠 품질','건물 외관','주차장 크기'],a:1},
  {q:'강좌 트렌드 분석에서 계절성이 가장 두드러지는 종목은?',opts:['요가','수영','피아노','스키/수상스포츠'],a:3},
  {q:'강사 역량 평가에서 가장 중요한 축은?',opts:['외모','전문성/경력','나이','소셜 미디어 팔로워'],a:1},
  {q:'학습 커뮤니티 매칭에서 가장 효과적인 그룹 크기는?',opts:['2인','4~6인','10인 이상','20인 이상'],a:1},
  {q:'품질 인증 배지 시스템에서 최고 등급은?',opts:['브론즈','실버','골드','다이아몬드'],a:3},
  {q:'수강 다이어리의 주요 목적은?',opts:['출석 체크','학습 패턴 분석과 동기부여','성적 관리','과제 제출'],a:1},
  {q:'센터 접근성 평가에서 교통 접근성의 이상적 기준은?',opts:['도보 5분','대중교통 15분 이내','차량 30분','헬리콥터 접근'],a:1},
  {q:'AI 강좌 큐레이션에서 가장 중요한 입력 데이터는?',opts:['혈액형','사용자 관심사/학습 이력','별자리','날씨'],a:1},
  {q:'문화센터 강좌 수강료의 일반적 범위는?',opts:['1~3만원','월 3~10만원','월 20만원 이상','무료'],a:1},
  {q:'수강 비용 최적화에서 번들 할인의 일반적 할인율은?',opts:['5%','10~20%','50%','80%'],a:1},
  {q:'v13에서 추가된 신규 기능 수는?',opts:['4개','6개','8개','10개'],a:2}
];

function trackFeature13(name){
  const used=lsGet('cc-v13-features-used',[]);
  if(!used.includes(name)){used.push(name);lsSet('cc-v13-features-used',used);}
  if(used.length>=5)checkAchieve13('v13_explorer');
}

function checkAchieve13(id){
  const achieved=lsGet('cc-v13-achieved',[]);
  if(achieved.includes(id))return;
  const a=V13_ACHIEVEMENTS.find(x=>x.id===id);if(!a)return;
  achieved.push(id);lsSet('cc-v13-achieved',achieved);
  SFX13.play('achieve_v13');
  showToast13(a.icon+' 업적 해금: '+a.name+'!',3000);
}

function makeModal13(title,subtitle){
  const old=qs('#v13-modal');if(old)old.remove();
  const dk=isDark();
  const modal=ce('div');modal.id='v13-modal';
  modal.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99990;display:flex;align-items:center;justify-content:center;animation:v13FadeIn 0.25s ease;';
  const card=ce('div');
  card.style.cssText='background:'+(dk?'#1e1e2e':'#fff')+';color:'+(dk?'#e0e0e0':'#333')+';border-radius:20px;max-width:680px;width:95vw;max-height:88vh;overflow-y:auto;box-shadow:0 8px 40px rgba(0,0,0,0.4);animation:v13SlideUp 0.3s ease;padding:0;';
  const header=ce('div');
  header.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:18px 24px;border-bottom:1px solid '+(dk?'#333':'#eee')+';position:sticky;top:0;background:'+(dk?'#1e1e2e':'#fff')+';border-radius:20px 20px 0 0;z-index:2;';
  const ttl=ce('div');
  ttl.innerHTML='<div style="font-size:18px;font-weight:700;">'+title+'</div>'+(subtitle?'<div style="font-size:12px;color:'+(dk?'#888':'#999')+';margin-top:2px;">'+subtitle+'</div>':'');
  const closeBtn=ce('button');
  closeBtn.textContent='✕';
  closeBtn.style.cssText='background:none;border:none;font-size:22px;cursor:pointer;color:'+(dk?'#aaa':'#666')+';padding:4px 8px;border-radius:8px;';
  closeBtn.onmouseenter=function(){this.style.background=dk?'#333':'#f0f0f0';};
  closeBtn.onmouseleave=function(){this.style.background='none';};
  closeBtn.onclick=function(){modal.remove();};
  header.appendChild(ttl);header.appendChild(closeBtn);
  const box=ce('div');box.style.cssText='padding:20px 24px 24px;';
  card.appendChild(header);card.appendChild(box);modal.appendChild(card);
  modal.addEventListener('click',function(e){if(e.target===modal)modal.remove();});
  return{modal,box,card};
}

/* ===== Feature 1: 강좌 트렌드 분석기 Canvas ===== */
function openTrendAnalyzer(){
  SFX13.play('trend_open');trackFeature13('trend');checkAchieve13('trend_analyst');
  const dk=isDark();const{modal,box}=makeModal13('📈 강좌 트렌드 분석기','월별 카테고리별 수강 트렌드 분석');
  const cats=['요가','수영','피아노','미술','요리','어학','피트니스','공예','코딩','댐스'];
  const months=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  const colors=['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#FF8C42','#6C5CE7','#A8E6CF','#F38181'];
  const data=cats.map((_,ci)=>months.map((_,mi)=>{
    const base=40+ci*8;const seasonal=Math.sin((mi+ci)*0.5)*20;return Math.max(10,Math.round(base+seasonal+((ci*7+mi*13)%30)-15));
  }));
  const canvas=ce('canvas');canvas.width=640;canvas.height=400;canvas.style.cssText='width:100%;max-width:640px;border-radius:12px;display:block;margin:0 auto;';
  function drawChart(sel){
    const ctx=canvas.getContext('2d');const W=640,H=400;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#1a1a2e':'#f8f9fa';ctx.fillRect(0,0,W,H);
    const pad={t:40,r:30,b:50,l:55},cw=W-pad.l-pad.r,ch=H-pad.t-pad.b;
    ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('월별 강좌 트렌드 분석',W/2,22);
    const maxV=120;
    for(let i=0;i<=4;i++){
      const y=pad.t+ch-ch*(i/4);
      ctx.strokeStyle=dk?'#333':'#e0e0e0';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(W-pad.r,y);ctx.stroke();
      ctx.fillStyle=dk?'#888':'#999';ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText(Math.round(maxV*i/4),pad.l-8,y+4);
    }
    months.forEach((m,i)=>{
      const x=pad.l+cw*(i/(months.length-1));
      ctx.fillStyle=dk?'#888':'#999';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(m,x,H-pad.b+18);
    });
    const indices=sel>=0?[sel]:cats.map((_,i)=>i);
    indices.forEach(ci=>{
      ctx.strokeStyle=colors[ci];ctx.lineWidth=sel>=0?3:1.5;ctx.beginPath();
      data[ci].forEach((v,mi)=>{
        const x=pad.l+cw*(mi/(months.length-1));const y=pad.t+ch-ch*(v/maxV);
        mi===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      });
      ctx.stroke();
      if(sel>=0){
        data[ci].forEach((v,mi)=>{
          const x=pad.l+cw*(mi/(months.length-1));const y=pad.t+ch-ch*(v/maxV);
          ctx.fillStyle=colors[ci];ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();
          ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText(v,x,y-8);
        });
      }
    });
    const legY=H-18;const legW=cw/cats.length;
    cats.forEach((c,i)=>{
      const x=pad.l+legW*i+legW/2;
      ctx.fillStyle=colors[i];ctx.fillRect(x-12,legY-5,8,8);
      ctx.fillStyle=dk?'#aaa':'#666';ctx.font='8px sans-serif';ctx.textAlign='left';ctx.fillText(c,x-2,legY+2);
    });
  }
  drawChart(-1);
  const btnRow=ce('div');btnRow.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;justify-content:center;';
  const allBtn=ce('button');allBtn.textContent='전체';
  allBtn.style.cssText='padding:6px 14px;border-radius:16px;border:1px solid '+(dk?'#555':'#ddd')+';background:'+(dk?'#333':'#f0f0f0')+';color:'+(dk?'#e0e0e0':'#333')+';cursor:pointer;font-size:12px;';
  allBtn.onclick=function(){drawChart(-1);SFX13.play('trend_open');};
  btnRow.appendChild(allBtn);
  cats.forEach((c,i)=>{
    const b=ce('button');b.textContent=c;
    b.style.cssText='padding:6px 12px;border-radius:16px;border:none;background:'+colors[i]+'22;color:'+colors[i]+';cursor:pointer;font-size:12px;font-weight:600;';
    b.onclick=function(){drawChart(i);SFX13.play('trend_open');
      const uses=lsGet('cc-v13-trend-uses',0);lsSet('cc-v13-trend-uses',uses+1);if(uses+1>=5)checkAchieve13('trend_expert');
    };
    btnRow.appendChild(b);
  });
  const summary=ce('div');summary.style.cssText='margin-top:16px;padding:14px;border-radius:12px;background:'+(dk?'#252540':'#f0f4ff')+';font-size:13px;line-height:1.6;';
  const topCat=cats[data.reduce((bi,d,i)=>d.reduce((s,v)=>s+v,0)>data[bi].reduce((s,v)=>s+v,0)?i:bi,0)];
  summary.innerHTML='<b>트렌드 요약</b><br>• 연간 최다 수강 카테고리: <b>'+topCat+'</b><br>• 여름 성수기: 수영, 피트니스 급상승<br>• 겨울 성수기: 요가, 공예, 코딩 급상승<br>• 연중 꾸준: 피아노, 미술, 언어';
  box.appendChild(canvas);box.appendChild(btnRow);box.appendChild(summary);
  document.body.appendChild(modal);
}

/* ===== Feature 2: 강사 역량 평가 시스템 Canvas ===== */
function openInstructorEval(){
  SFX13.play('instructor_eval');trackFeature13('instructor');checkAchieve13('instructor_reviewer');
  const dk=isDark();const{modal,box}=makeModal13('🎓 강사 역량 평가 시스템','강사 6축 레이더 평가');
  const axes=['전문성','수업력','소통력','열정','경력','평판'];
  const vals=[80,85,75,90,70,88];
  const saved=lsGet('cc-v13-instructor-eval',null);
  if(saved)saved.forEach((v,i)=>{if(i<vals.length)vals[i]=v;});
  const canvas=ce('canvas');canvas.width=520;canvas.height=440;canvas.style.cssText='width:100%;max-width:520px;border-radius:12px;display:block;margin:0 auto;';
  function drawRadar(){
    const ctx=canvas.getContext('2d');const W=520,H=440,cx=W/2,cy=H/2+10,R=160;
    ctx.clearRect(0,0,W,H);ctx.fillStyle=dk?'#1a1a2e':'#f8f9fa';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('강사 역량 레이더 차트',cx,24);
    for(let ring=1;ring<=5;ring++){
      ctx.strokeStyle=dk?'#333':'#e0e0e0';ctx.lineWidth=0.5;ctx.beginPath();
      const rr=R*(ring/5);
      for(let i=0;i<=6;i++){const a=-Math.PI/2+Math.PI*2*(i/6);ctx.lineTo(cx+rr*Math.cos(a),cy+rr*Math.sin(a));}
      ctx.closePath();ctx.stroke();
    }
    axes.forEach((ax,i)=>{
      const a=-Math.PI/2+Math.PI*2*(i/6);
      ctx.strokeStyle=dk?'#444':'#ccc';ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+R*Math.cos(a),cy+R*Math.sin(a));ctx.stroke();
      const lx=cx+(R+22)*Math.cos(a);const ly=cy+(R+22)*Math.sin(a);
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(ax,lx,ly);
    });
    ctx.beginPath();ctx.fillStyle='rgba(76,175,80,0.25)';ctx.strokeStyle='#4CAF50';ctx.lineWidth=2.5;
    vals.forEach((v,i)=>{
      const a=-Math.PI/2+Math.PI*2*(i/6);const r=R*(v/100);
      i===0?ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a)):ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));
    });
    ctx.closePath();ctx.fill();ctx.stroke();
    vals.forEach((v,i)=>{
      const a=-Math.PI/2+Math.PI*2*(i/6);const r=R*(v/100);
      ctx.fillStyle='#4CAF50';ctx.beginPath();ctx.arc(cx+r*Math.cos(a),cy+r*Math.sin(a),5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=dk?'#fff':'#333';ctx.font='bold 11px sans-serif';ctx.fillText(v,cx+r*Math.cos(a),cy+r*Math.sin(a)-12);
    });
    const avg=Math.round(vals.reduce((s,v)=>s+v,0)/vals.length);
    const grade=avg>=90?'S':avg>=80?'A':avg>=70?'B':avg>=60?'C':'D';
    const gc={S:'#FFD700',A:'#4CAF50',B:'#2196F3',C:'#FF9800',D:'#F44336'}[grade];
    ctx.fillStyle=gc;ctx.font='bold 28px sans-serif';ctx.fillText(grade,cx,H-30);
    ctx.fillStyle=dk?'#aaa':'#666';ctx.font='12px sans-serif';ctx.fillText('종합 '+avg+'점',cx,H-10);
  }
  drawRadar();
  const sliders=ce('div');sliders.style.cssText='margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:8px;';
  axes.forEach((ax,i)=>{
    const row=ce('div');row.style.cssText='display:flex;align-items:center;gap:8px;';
    const lbl=ce('span');lbl.textContent=ax;lbl.style.cssText='font-size:12px;width:50px;color:'+(dk?'#ccc':'#555')+';';
    const inp=ce('input');inp.type='range';inp.min='0';inp.max='100';inp.value=vals[i];
    inp.style.cssText='flex:1;accent-color:#4CAF50;';
    const numLbl=ce('span');numLbl.textContent=vals[i];numLbl.style.cssText='font-size:12px;width:28px;text-align:right;color:'+(dk?'#ccc':'#555')+';';
    inp.oninput=function(){vals[i]=parseInt(this.value);numLbl.textContent=this.value;drawRadar();};
    row.appendChild(lbl);row.appendChild(inp);row.appendChild(numLbl);sliders.appendChild(row);
  });
  const saveBtn=ce('button');saveBtn.textContent='평가 저장';
  saveBtn.style.cssText='margin-top:12px;width:100%;padding:12px;border-radius:12px;border:none;background:linear-gradient(135deg,#4CAF50,#45a049);color:#fff;font-size:14px;font-weight:700;cursor:pointer;';
  saveBtn.onclick=function(){lsSet('cc-v13-instructor-eval',vals.slice());SFX13.play('badge_earn');showToast13('강사 평가가 저장되었습니다!');};
  box.appendChild(canvas);box.appendChild(sliders);box.appendChild(saveBtn);
  document.body.appendChild(modal);
}

/* ===== Feature 3: 수강 비용 최적화 계산기 Canvas ===== */
function openCostOptimizer(){
  SFX13.play('cost_calc');trackFeature13('cost');checkAchieve13('cost_optimizer');
  const dk=isDark();const{modal,box}=makeModal13('💰 수강 비용 최적화 계산기','월별 비용 분석 및 절약 팀');
  const courses=[
    {name:'요가',monthly:80000,discount:15},
    {name:'수영',monthly:90000,discount:10},
    {name:'피아노',monthly:120000,discount:20},
    {name:'미술',monthly:70000,discount:12},
    {name:'요리',monthly:100000,discount:18},
    {name:'어학',monthly:85000,discount:10}
  ];
  const sel=lsGet('cc-v13-cost-sel',[true,false,true,false,false,false]);
  const canvas=ce('canvas');canvas.width=600;canvas.height=340;canvas.style.cssText='width:100%;max-width:600px;border-radius:12px;display:block;margin:0 auto;';
  const colors=['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD'];
  function drawCost(){
    const ctx=canvas.getContext('2d');const W=600,H=340;
    ctx.clearRect(0,0,W,H);ctx.fillStyle=dk?'#1a1a2e':'#f8f9fa';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('수강 비용 분석',W/2,22);
    const active=courses.filter((_,i)=>sel[i]);
    if(active.length===0){ctx.fillStyle=dk?'#888':'#999';ctx.font='14px sans-serif';ctx.fillText('강좌를 선택해주세요',W/2,H/2);return;}
    const total=active.reduce((s,c)=>s+c.monthly,0);
    const savedTotal=active.reduce((s,c)=>s+Math.round(c.monthly*c.discount/100),0);
    const pieR=90,pieCx=160,pieCy=180;
    let startA=-Math.PI/2;
    active.forEach((c,i)=>{
      const ci=courses.indexOf(c);
      const angle=Math.PI*2*(c.monthly/total);
      ctx.beginPath();ctx.moveTo(pieCx,pieCy);ctx.arc(pieCx,pieCy,pieR,startA,startA+angle);ctx.closePath();
      ctx.fillStyle=colors[ci];ctx.fill();
      const midA=startA+angle/2;
      const lx=pieCx+(pieR*0.65)*Math.cos(midA);const ly=pieCy+(pieR*0.65)*Math.sin(midA);
      ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      ctx.fillText(Math.round(c.monthly/total*100)+'%',lx,ly);
      startA+=angle;
    });
    ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='12px sans-serif';ctx.textAlign='center';
    ctx.fillText('월 총 '+total.toLocaleString()+'원',pieCx,pieCy+pieR+22);
    const barX=330,barW=50,barGap=15,maxH=200,barY0=280;
    const periods=[{label:'월',mult:1},{label:'분기',mult:3},{label:'반기',mult:6},{label:'연간',mult:12}];
    periods.forEach((p,i)=>{
      const x=barX+i*(barW+barGap);
      const orig=total*p.mult;const disc=orig-savedTotal*p.mult;
      const hOrig=maxH*(orig/(total*12));const hDisc=maxH*(disc/(total*12));
      ctx.fillStyle=dk?'rgba(255,107,107,0.3)':'rgba(255,107,107,0.2)';ctx.fillRect(x,barY0-hOrig,barW/2-1,hOrig);
      ctx.fillStyle='#4CAF50';ctx.fillRect(x+barW/2+1,barY0-hDisc,barW/2-1,hDisc);
      ctx.fillStyle=dk?'#aaa':'#666';ctx.font='10px sans-serif';ctx.textAlign='center';
      ctx.fillText(p.label,x+barW/2,barY0+14);
      ctx.fillStyle='#4CAF50';ctx.font='bold 9px sans-serif';
      ctx.fillText('-'+(savedTotal*p.mult).toLocaleString(),x+barW/2,barY0-hOrig-6);
    });
    ctx.fillStyle=dk?'#888':'#999';ctx.font='10px sans-serif';ctx.textAlign='left';
    ctx.fillRect(barX,barY0+28,8,8);ctx.fillText('정가',barX+12,barY0+36);
    ctx.fillStyle='#4CAF50';ctx.fillRect(barX+50,barY0+28,8,8);
    ctx.fillStyle=dk?'#888':'#999';ctx.fillText('할인가',barX+62,barY0+36);
  }
  drawCost();
  const checks=ce('div');checks.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px;';
  courses.forEach((c,i)=>{
    const lb=ce('label');lb.style.cssText='display:flex;align-items:center;gap:6px;padding:8px 10px;border-radius:10px;background:'+(dk?'#252540':'#f0f0f0')+';cursor:pointer;font-size:13px;';
    const cb=ce('input');cb.type='checkbox';cb.checked=sel[i];
    cb.onchange=function(){sel[i]=this.checked;lsSet('cc-v13-cost-sel',sel);drawCost();SFX13.play('cost_calc');};
    const sp=ce('span');sp.style.cssText='color:'+colors[i]+';font-weight:600;';sp.textContent=c.name+' '+Math.round(c.monthly/10000)+'만';
    lb.appendChild(cb);lb.appendChild(sp);checks.appendChild(lb);
  });
  const tip=ce('div');tip.style.cssText='margin-top:12px;padding:12px;border-radius:10px;background:'+(dk?'#1a2e1a':'#e8f5e9')+';font-size:12px;line-height:1.5;color:'+(dk?'#a5d6a7':'#2e7d32')+';';
  tip.innerHTML='<b>💡 절약 팀</b><br>• 분기/반기 등록 시 10~20% 할인<br>• 같은 센터 복수 수강 시 추가 할인<br>• 조기 등록 할인 활용 (개강 2주 전)';
  box.appendChild(canvas);box.appendChild(checks);box.appendChild(tip);
  document.body.appendChild(modal);
}

/* ===== Feature 4: 학습 커뮤니티 매칭 Canvas ===== */
function openCommunityMatcher(){
  SFX13.play('community_match');trackFeature13('community');checkAchieve13('community_joiner');
  const dk=isDark();const{modal,box}=makeModal13('🤝 학습 커뮤니티 매칭','관심사 기반 학습 그룹 매칭');
  const members=[
    {name:'김미리',interest:['요가','미술'],level:'중급',region:'강남'},
    {name:'박수진',interest:['피아노','어학'],level:'초급',region:'서초'},
    {name:'이은주',interest:['요리','공예'],level:'고급',region:'마포'},
    {name:'최지훈',interest:['수영','피트니스'],level:'중급',region:'강남'},
    {name:'정해은',interest:['요가','피라테스'],level:'초급',region:'송파'},
    {name:'한수연',interest:['미술','공예'],level:'중급',region:'서초'},
    {name:'오지후',interest:['요리','어학'],level:'고급',region:'강서'},
    {name:'윤상아',interest:['피아노','미술'],level:'중급',region:'관악'},
    {name:'장민호',interest:['피트니스','수영'],level:'초급',region:'동작'},
    {name:'권예진',interest:['요가','요리'],level:'고급',region:'강남'},
    {name:'신현우',interest:['코딩','어학'],level:'중급',region:'판교'},
    {name:'문서연',interest:['댐스','피트니스'],level:'초급',region:'영등포'}
  ];
  const myInterest=lsGet('cc-v13-my-interest',['요가','미술']);
  const myLevel=lsGet('cc-v13-my-level','중급');
  function calcCompat(m){
    let score=0;
    const common=m.interest.filter(i=>myInterest.includes(i)).length;
    score+=common*35;
    if(m.level===myLevel)score+=20;
    return Math.min(100,score+10);
  }
  const ranked=members.map(m=>({...m,compat:calcCompat(m)})).sort((a,b)=>b.compat-a.compat);
  const canvas=ce('canvas');canvas.width=600;canvas.height=300;canvas.style.cssText='width:100%;max-width:600px;border-radius:12px;display:block;margin:0 auto;';
  function drawMatch(){
    const ctx=canvas.getContext('2d');const W=600,H=300;
    ctx.clearRect(0,0,W,H);ctx.fillStyle=dk?'#1a1a2e':'#f8f9fa';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('커뮤니티 매칭 결과 (TOP 6)',W/2,22);
    const top6=ranked.slice(0,6);
    const barH=32,gap=8,startY=45,barMaxW=350,startX=140;
    top6.forEach((m,i)=>{
      const y=startY+i*(barH+gap);
      const w=barMaxW*(m.compat/100);
      const gc=m.compat>=70?'#4CAF50':m.compat>=40?'#FF9800':'#F44336';
      ctx.fillStyle=gc+'33';ctx.beginPath();
      const r=6;ctx.moveTo(startX+r,y);ctx.lineTo(startX+w-r,y);ctx.quadraticCurveTo(startX+w,y,startX+w,y+r);
      ctx.lineTo(startX+w,y+barH-r);ctx.quadraticCurveTo(startX+w,y+barH,startX+w-r,y+barH);
      ctx.lineTo(startX+r,y+barH);ctx.quadraticCurveTo(startX,y+barH,startX,y+barH-r);
      ctx.lineTo(startX,y+r);ctx.quadraticCurveTo(startX,y,startX+r,y);ctx.fill();
      ctx.fillStyle=gc;ctx.fillRect(startX,y,w*0.3,barH);
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='12px sans-serif';ctx.textAlign='right';
      ctx.fillText(m.name,startX-10,y+barH/2+4);
      ctx.fillStyle=dk?'#ccc':'#555';ctx.font='11px sans-serif';ctx.textAlign='left';
      ctx.fillText(m.interest.join(', ')+' | '+m.level+' | '+m.region,startX+8,y+barH/2+4);
      ctx.fillStyle=gc;ctx.font='bold 12px sans-serif';ctx.textAlign='right';
      ctx.fillText(m.compat+'%',startX+barMaxW+40,y+barH/2+4);
    });
  }
  drawMatch();
  const selDiv=ce('div');selDiv.style.cssText='margin-top:14px;';
  selDiv.innerHTML='<div style="font-size:13px;font-weight:600;margin-bottom:8px;color:'+(dk?'#ccc':'#555')+';">나의 관심사 선택 (2개)</div>';
  const allInt=['요가','수영','피아노','미술','요리','어학','피트니스','공예','코딩','댐스'];
  const intRow=ce('div');intRow.style.cssText='display:flex;flex-wrap:wrap;gap:6px;';
  allInt.forEach(it=>{
    const b=ce('button');b.textContent=it;
    const isSel=myInterest.includes(it);
    b.style.cssText='padding:6px 12px;border-radius:14px;border:1px solid '+(isSel?'#4CAF50':(dk?'#555':'#ddd'))+';background:'+(isSel?'#4CAF5022':'transparent')+';color:'+(isSel?'#4CAF50':(dk?'#ccc':'#666'))+';cursor:pointer;font-size:12px;';
    b.onclick=function(){
      const idx=myInterest.indexOf(it);
      if(idx>=0)myInterest.splice(idx,1);
      else if(myInterest.length<2)myInterest.push(it);
      else{myInterest.shift();myInterest.push(it);}
      lsSet('cc-v13-my-interest',myInterest);
      members.forEach(m=>{const r=ranked.find(r=>r.name===m.name);if(r)r.compat=calcCompat(m);});
      ranked.sort((a,b)=>b.compat-a.compat);drawMatch();
      box.innerHTML='';openCommunityMatcher();qs('#v13-modal').remove();
    };
    intRow.appendChild(b);
  });
  selDiv.appendChild(intRow);
  box.appendChild(canvas);box.appendChild(selDiv);
  document.body.appendChild(modal);
}

/* ===== Feature 5: 강좌 품질 인증 배지 시스템 Canvas ===== */
function openBadgeSystem(){
  SFX13.play('badge_earn');trackFeature13('badge');
  const dk=isDark();const{modal,box}=makeModal13('🏅 강좌 품질 인증 배지','학습 활동 기반 품질 배지 시스템');
  const badges=[
    {id:'explorer',name:'탐험가',desc:'기능 5개 사용',icon:'🔍',tier:'bronze',req:5,key:'cc-v13-features-used'},
    {id:'quizzer',name:'퀸즈 도전자',desc:'퀸즈 3회 완료',icon:'🧠',tier:'bronze',req:3,key:'cc-v13-quiz-count'},
    {id:'achiever',name:'업적 수집가',desc:'업적 5개 해금',icon:'🏆',tier:'silver',req:5,key:'cc-v13-achieved'},
    {id:'streaker',name:'연속 학습자',desc:'7일 연속 방문',icon:'🔥',tier:'silver',req:7,key:'cc-v13-streak'},
    {id:'analyst',name:'분석 전문가',desc:'분석 기능 전체 사용',icon:'📊',tier:'gold',req:8,key:'cc-v13-features-used'},
    {id:'master',name:'마스터',desc:'모든 배지 획득',icon:'💎',tier:'diamond',req:5,key:'cc-v13-badges'}
  ];
  const earned=lsGet('cc-v13-badges-earned',[]);
  function checkBadge(b){
    const data=lsGet(b.key,[]);
    const count=Array.isArray(data)?data.length:(typeof data==='number'?data:0);
    return count>=b.req;
  }
  const tierColors={bronze:'#CD7F32',silver:'#C0C0C0',gold:'#FFD700',diamond:'#B9F2FF'};
  const canvas=ce('canvas');canvas.width=600;canvas.height=360;canvas.style.cssText='width:100%;max-width:600px;border-radius:12px;display:block;margin:0 auto;';
  const ctx=canvas.getContext('2d');const W=600,H=360;
  ctx.fillStyle=dk?'#1a1a2e':'#f8f9fa';ctx.fillRect(0,0,W,H);
  ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText('품질 인증 배지 컬렉션',W/2,25);
  const cols=3,cw=W/cols,rh=105;
  badges.forEach((b,i)=>{
    const col=i%cols,row=Math.floor(i/cols);
    const cx=col*cw+cw/2,cy=45+row*rh+rh/2;
    const unlocked=checkBadge(b);
    if(!earned.includes(b.id)&&unlocked){earned.push(b.id);lsSet('cc-v13-badges-earned',earned);
      if(earned.length>=3)checkAchieve13('badge_collector');
      if(earned.length>=badges.length)checkAchieve13('badge_master');
    }
    ctx.beginPath();ctx.arc(cx,cy-10,32,0,Math.PI*2);
    ctx.fillStyle=unlocked?tierColors[b.tier]+'44':(dk?'#333':'#e0e0e0');ctx.fill();
    ctx.strokeStyle=unlocked?tierColors[b.tier]:(dk?'#555':'#ccc');ctx.lineWidth=2.5;ctx.stroke();
    ctx.font='24px sans-serif';ctx.textAlign='center';ctx.fillText(unlocked?b.icon:'🔒',cx,cy-2);
    ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 11px sans-serif';ctx.fillText(b.name,cx,cy+30);
    ctx.fillStyle=dk?'#888':'#999';ctx.font='10px sans-serif';ctx.fillText(b.desc,cx,cy+44);
    const tierLabel=b.tier.charAt(0).toUpperCase()+b.tier.slice(1);
    ctx.fillStyle=tierColors[b.tier];ctx.font='bold 9px sans-serif';ctx.fillText(tierLabel,cx,cy+56);
  });
  const earnedCount=earned.length;
  ctx.fillStyle=dk?'#aaa':'#666';ctx.font='13px sans-serif';ctx.textAlign='center';
  ctx.fillText(earnedCount+'/'+badges.length+' 배지 획득',W/2,H-15);
  const progW=200;
  ctx.fillStyle=dk?'#333':'#e0e0e0';ctx.fillRect(W/2-progW/2,H-38,progW,8);
  ctx.fillStyle='#4CAF50';ctx.fillRect(W/2-progW/2,H-38,progW*(earnedCount/badges.length),8);
  box.appendChild(canvas);
  document.body.appendChild(modal);
}

/* ===== Feature 6: 수강 다이어리 히트맵 Canvas ===== */
function openDiaryHeatmap(){
  SFX13.play('diary_check');trackFeature13('diary');checkAchieve13('diary_starter');
  const dk=isDark();const{modal,box}=makeModal13('📖 수강 다이어리 히트맵','30일 학습 활동 기록 및 분석');
  const diary=lsGet('cc-v13-diary',{});
  const today=fmtDate13();
  const canvas=ce('canvas');canvas.width=620;canvas.height=300;canvas.style.cssText='width:100%;max-width:620px;border-radius:12px;display:block;margin:0 auto;';
  function drawHeatmap(){
    const ctx=canvas.getContext('2d');const W=620,H=300;
    ctx.clearRect(0,0,W,H);ctx.fillStyle=dk?'#1a1a2e':'#f8f9fa';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('30일 수강 활동 히트맵',W/2,22);
    const days=[];const now=new Date();
    for(let i=29;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);days.push(fmtDate13(d));}
    const cellW=18,cellH=18,gap=2,startX=30,startY=55;
    const weekdays=['일','월','화','수','목','금','토'];
    const cols=Math.ceil(days.length/7);
    days.forEach((day,i)=>{
      const col=Math.floor(i/7);const row=i%7;
      const x=startX+col*(cellW+gap)+50;const y=startY+row*(cellH+gap);
      const entry=diary[day];
      const level=entry?entry.level:0;
      const fills=['transparent',dk?'#1a3a1a':'#c8e6c9',dk?'#2e7d32':'#81c784',dk?'#388e3c':'#4caf50',dk?'#1b5e20':'#2e7d32'];
      ctx.fillStyle=fills[level]||( dk?'#252540':'#eee');
      if(!level)ctx.fillStyle=dk?'#252540':'#eee';
      ctx.beginPath();const r=3;
      ctx.moveTo(x+r,y);ctx.lineTo(x+cellW-r,y);ctx.quadraticCurveTo(x+cellW,y,x+cellW,y+r);
      ctx.lineTo(x+cellW,y+cellH-r);ctx.quadraticCurveTo(x+cellW,y+cellH,x+cellW-r,y+cellH);
      ctx.lineTo(x+r,y+cellH);ctx.quadraticCurveTo(x,y+cellH,x,y+cellH-r);
      ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.fill();
      if(day===today){ctx.strokeStyle='#FF6B6B';ctx.lineWidth=2;ctx.stroke();}
    });
    weekdays.forEach((wd,i)=>{
      ctx.fillStyle=dk?'#888':'#999';ctx.font='10px sans-serif';ctx.textAlign='right';
      ctx.fillText(wd,startX+42,startY+i*(cellH+gap)+13);
    });
    const legendX=startX+50,legendY=startY+7*(cellH+gap)+15;
    ctx.fillStyle=dk?'#888':'#999';ctx.font='10px sans-serif';ctx.textAlign='left';ctx.fillText('적음',legendX,legendY+12);
    [0,1,2,3,4].forEach((lv,i)=>{
      const fills=['#eee','#c8e6c9','#81c784','#4caf50','#2e7d32'];
      ctx.fillStyle=dk?['#252540','#1a3a1a','#2e7d32','#388e3c','#1b5e20'][lv]:fills[lv];
      ctx.fillRect(legendX+30+i*(cellW+2),legendY,cellW,cellH);
    });
    ctx.fillStyle=dk?'#888':'#999';ctx.fillText('많음',legendX+30+5*(cellW+2),legendY+12);
    const activeDays=Object.keys(diary).filter(d=>days.includes(d)&&diary[d].level>0).length;
    let streak=0;for(let i=days.length-1;i>=0;i--){if(diary[days[i]]&&diary[days[i]].level>0)streak++;else break;}
    ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 13px sans-serif';ctx.textAlign='left';
    ctx.fillText('활동일: '+activeDays+'/30 | 연속: '+streak+'일',startX+50+cols*(cellW+gap)+30,startY+20);
    if(streak>=30)checkAchieve13('diary_30days');
    const grade=activeDays>=25?'S':activeDays>=20?'A':activeDays>=15?'B':activeDays>=10?'C':'D';
    const gc={S:'#FFD700',A:'#4CAF50',B:'#2196F3',C:'#FF9800',D:'#F44336'}[grade];
    ctx.fillStyle=gc;ctx.font='bold 36px sans-serif';ctx.fillText(grade,startX+50+cols*(cellW+gap)+60,startY+70);
    ctx.fillStyle=dk?'#aaa':'#666';ctx.font='11px sans-serif';
    ctx.fillText('출석률 '+Math.round(activeDays/30*100)+'%',startX+50+cols*(cellW+gap)+30,startY+90);
  }
  drawHeatmap();
  const inputRow=ce('div');inputRow.style.cssText='margin-top:14px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;';
  const levelSelect=ce('select');levelSelect.style.cssText='padding:8px 12px;border-radius:8px;border:1px solid '+(dk?'#555':'#ddd')+';background:'+(dk?'#252540':'#fff')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:13px;';
  [{v:0,l:'활동 없음'},{v:1,l:'가벼운 학습'},{v:2,l:'보통 학습'},{v:3,l:'열심히 학습'},{v:4,l:'폭풍 학습'}].forEach(o=>{
    const opt=ce('option');opt.value=o.v;opt.textContent=o.l;levelSelect.appendChild(opt);
  });
  const currentEntry=diary[today];
  if(currentEntry)levelSelect.value=currentEntry.level;
  const memoInput=ce('input');memoInput.type='text';memoInput.placeholder='오늘의 학습 메모';
  memoInput.style.cssText='flex:1;min-width:150px;padding:8px 12px;border-radius:8px;border:1px solid '+(dk?'#555':'#ddd')+';background:'+(dk?'#252540':'#fff')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:13px;';
  if(currentEntry&&currentEntry.memo)memoInput.value=currentEntry.memo;
  const saveBtn=ce('button');saveBtn.textContent='기록';
  saveBtn.style.cssText='padding:8px 20px;border-radius:8px;border:none;background:#4CAF50;color:#fff;font-weight:600;cursor:pointer;font-size:13px;';
  saveBtn.onclick=function(){
    diary[today]={level:parseInt(levelSelect.value),memo:memoInput.value,time:new Date().toISOString()};
    lsSet('cc-v13-diary',diary);drawHeatmap();SFX13.play('diary_check');showToast13('오늘의 학습이 기록되었습니다!');
  };
  inputRow.appendChild(levelSelect);inputRow.appendChild(memoInput);inputRow.appendChild(saveBtn);
  box.appendChild(canvas);box.appendChild(inputRow);
  document.body.appendChild(modal);
}

/* ===== Feature 7: 센터 접근성 스코어카드 Canvas ===== */
function openAccessScore(){
  SFX13.play('access_score');trackFeature13('access');checkAchieve13('access_checker');
  const dk=isDark();const{modal,box}=makeModal13('📍 센터 접근성 스코어카드','다양한 접근성 요소 종합 평가');
  const factors=['교통 접근성','주차 편의성','버스 노선 수','지하철 거리','보행 환경','장애인 시설','유아 시설','주변 편의시설'];
  const scores=lsGet('cc-v13-access-scores',[75,80,60,70,85,65,50,90]);
  const canvas=ce('canvas');canvas.width=560;canvas.height=400;canvas.style.cssText='width:100%;max-width:560px;border-radius:12px;display:block;margin:0 auto;';
  function drawScore(){
    const ctx=canvas.getContext('2d');const W=560,H=400;
    ctx.clearRect(0,0,W,H);ctx.fillStyle=dk?'#1a1a2e':'#f8f9fa';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('센터 접근성 종합 평가',W/2,22);
    const barH=28,gap=10,startY=45,startX=140,maxW=340;
    factors.forEach((f,i)=>{
      const y=startY+i*(barH+gap);const v=scores[i];const w=maxW*(v/100);
      const gc=v>=80?'#4CAF50':v>=60?'#FF9800':v>=40?'#FFC107':'#F44336';
      ctx.fillStyle=dk?'#252540':'#eee';ctx.fillRect(startX,y,maxW,barH);
      ctx.fillStyle=gc;
      ctx.beginPath();const r=4;
      ctx.moveTo(startX+r,y);ctx.lineTo(startX+w-r,y);ctx.quadraticCurveTo(startX+w,y,startX+w,y+r);
      ctx.lineTo(startX+w,y+barH-r);ctx.quadraticCurveTo(startX+w,y+barH,startX+w-r,y+barH);
      ctx.lineTo(startX+r,y+barH);ctx.quadraticCurveTo(startX,y+barH,startX,y+barH-r);
      ctx.lineTo(startX,y+r);ctx.quadraticCurveTo(startX,y,startX+r,y);ctx.fill();
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='11px sans-serif';ctx.textAlign='right';ctx.fillText(f,startX-10,y+barH/2+4);
      ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
      if(w>30)ctx.fillText(v+'점',startX+w/2,y+barH/2+4);
    });
    const avg=Math.round(scores.reduce((s,v)=>s+v,0)/scores.length);
    const grade=avg>=90?'S':avg>=80?'A':avg>=70?'B':avg>=60?'C':'D';
    const gc={S:'#FFD700',A:'#4CAF50',B:'#2196F3',C:'#FF9800',D:'#F44336'}[grade];
    ctx.fillStyle=gc;ctx.font='bold 32px sans-serif';ctx.textAlign='center';
    ctx.fillText(grade,W/2-30,H-25);
    ctx.fillStyle=dk?'#aaa':'#666';ctx.font='13px sans-serif';
    ctx.fillText('종합 '+avg+'점',W/2+30,H-22);
  }
  drawScore();
  const sliders=ce('div');sliders.style.cssText='margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:6px;';
  factors.forEach((f,i)=>{
    const row=ce('div');row.style.cssText='display:flex;align-items:center;gap:6px;';
    const lbl=ce('span');lbl.textContent=f;lbl.style.cssText='font-size:11px;width:80px;color:'+(dk?'#ccc':'#555')+';';
    const inp=ce('input');inp.type='range';inp.min='0';inp.max='100';inp.value=scores[i];
    inp.style.cssText='flex:1;accent-color:#4CAF50;';
    const num=ce('span');num.textContent=scores[i];num.style.cssText='font-size:11px;width:24px;text-align:right;color:'+(dk?'#ccc':'#555')+';';
    inp.oninput=function(){scores[i]=parseInt(this.value);num.textContent=this.value;drawScore();};
    row.appendChild(lbl);row.appendChild(inp);row.appendChild(num);sliders.appendChild(row);
  });
  const saveBtn=ce('button');saveBtn.textContent='평가 저장';
  saveBtn.style.cssText='margin-top:10px;width:100%;padding:10px;border-radius:10px;border:none;background:linear-gradient(135deg,#2196F3,#1976D2);color:#fff;font-weight:700;cursor:pointer;font-size:14px;';
  saveBtn.onclick=function(){lsSet('cc-v13-access-scores',scores.slice());SFX13.play('badge_earn');showToast13('접근성 평가가 저장되었습니다!');};
  box.appendChild(canvas);box.appendChild(sliders);box.appendChild(saveBtn);
  document.body.appendChild(modal);
}

/* ===== Feature 8: AI 강좌 큐레이터 Canvas ===== */
function openAICurator(){
  SFX13.play('curator_pick');trackFeature13('curator');checkAchieve13('curator_user');
  const dk=isDark();const{modal,box}=makeModal13('🤖 AI 강좌 큐레이터','관심사 기반 맞춤형 강좌 추천');
  const profiles=[
    {type:'창의적 탐구형',courses:['미술','공예','요리','작곡'],desc:'창의적 활동을 즐기며 새로운 것을 만드는 것을 좋아합니다',color:'#FF6B6B'},
    {type:'건강 중시형',courses:['요가','수영','피트니스','댐스'],desc:'신체 건강과 운동을 통한 자기관리를 중시합니다',color:'#4ECDC4'},
    {type:'지적 성장형',courses:['어학','코딩','서예','역사'],desc:'지식 습득과 자기계발을 통한 성장을 추구합니다',color:'#45B7D1'},
    {type:'예술적 감성형',courses:['피아노','바이올린','사진','플라워'],desc:'예술적 감성과 표현력을 발휘하는 활동을 선호합니다',color:'#DDA0DD'}
  ];
  const selProfile=lsGet('cc-v13-curator-profile',0);
  const canvas=ce('canvas');canvas.width=600;canvas.height=340;canvas.style.cssText='width:100%;max-width:600px;border-radius:12px;display:block;margin:0 auto;';
  function drawCurator(pidx){
    const ctx=canvas.getContext('2d');const W=600,H=340;const p=profiles[pidx];
    ctx.clearRect(0,0,W,H);ctx.fillStyle=dk?'#1a1a2e':'#f8f9fa';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
    ctx.fillText('AI 맞춤형 강좌 추천',W/2,22);
    ctx.fillStyle=p.color;ctx.font='bold 16px sans-serif';ctx.fillText(p.type,W/2,52);
    ctx.fillStyle=dk?'#aaa':'#666';ctx.font='12px sans-serif';ctx.fillText(p.desc,W/2,72);
    const cardW=130,cardH=160,gap=12,startX=(W-p.courses.length*(cardW+gap)+gap)/2,startY=95;
    const courseData={
      '미술':{icon:'🎨',level:'초급~고급',price:'5~8만'},
      '공예':{icon:'🧶',level:'초급~중급',price:'6~10만'},
      '요리':{icon:'🍳',level:'초급~고급',price:'8~15만'},
      '작곡':{icon:'🎵',level:'중급~고급',price:'10~15만'},
      '요가':{icon:'🧘',level:'초급~고급',price:'5~8만'},
      '수영':{icon:'🏊',level:'초급~고급',price:'6~10만'},
      '피트니스':{icon:'🏋',level:'초급~중급',price:'5~8만'},
      '댐스':{icon:'💃',level:'초급~고급',price:'6~12만'},
      '어학':{icon:'🌍',level:'초급~고급',price:'8~15만'},
      '코딩':{icon:'💻',level:'초급~중급',price:'10~20만'},
      '서예':{icon:'✍️',level:'초급~고급',price:'5~8만'},
      '역사':{icon:'🏛',level:'초급~중급',price:'무료~3만'},
      '피아노':{icon:'🎹',level:'초급~고급',price:'10~20만'},
      '바이올린':{icon:'🎻',level:'초급~중급',price:'12~20만'},
      '사진':{icon:'📷',level:'초급~중급',price:'8~15만'},
      '플라워':{icon:'🌸',level:'초급~중급',price:'5~10만'}
    };
    p.courses.forEach((c,i)=>{
      const x=startX+i*(cardW+gap);const cd=courseData[c]||{icon:'📚',level:'초급',price:'5만'};
      ctx.fillStyle=p.color+'22';
      ctx.beginPath();const r=10;
      ctx.moveTo(x+r,startY);ctx.lineTo(x+cardW-r,startY);ctx.quadraticCurveTo(x+cardW,startY,x+cardW,startY+r);
      ctx.lineTo(x+cardW,startY+cardH-r);ctx.quadraticCurveTo(x+cardW,startY+cardH,x+cardW-r,startY+cardH);
      ctx.lineTo(x+r,startY+cardH);ctx.quadraticCurveTo(x,startY+cardH,x,startY+cardH-r);
      ctx.lineTo(x,startY+r);ctx.quadraticCurveTo(x,startY,x+r,startY);ctx.fill();
      ctx.strokeStyle=p.color;ctx.lineWidth=1.5;ctx.stroke();
      ctx.font='36px sans-serif';ctx.textAlign='center';ctx.fillText(cd.icon,x+cardW/2,startY+48);
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 14px sans-serif';ctx.fillText(c,x+cardW/2,startY+78);
      ctx.fillStyle=dk?'#aaa':'#666';ctx.font='11px sans-serif';
      ctx.fillText(cd.level,x+cardW/2,startY+100);
      ctx.fillText('월 '+cd.price+'원',x+cardW/2,startY+118);
      ctx.fillStyle=p.color;ctx.font='bold 11px sans-serif';
      ctx.fillText('★ 추천',x+cardW/2,startY+140);
    });
    ctx.fillStyle=dk?'#888':'#999';ctx.font='11px sans-serif';ctx.textAlign='center';
    ctx.fillText('프로필을 선택하면 맞춤형 강좌가 추천됩니다',W/2,H-12);
  }
  drawCurator(selProfile);
  const profileBtns=ce('div');profileBtns.style.cssText='display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;justify-content:center;';
  profiles.forEach((p,i)=>{
    const b=ce('button');b.textContent=p.type;
    b.style.cssText='padding:8px 16px;border-radius:20px;border:2px solid '+p.color+';background:'+(i===selProfile?p.color+'33':'transparent')+';color:'+p.color+';cursor:pointer;font-size:13px;font-weight:600;transition:all 0.2s;';
    b.onclick=function(){lsSet('cc-v13-curator-profile',i);drawCurator(i);SFX13.play('curator_pick');
      profileBtns.querySelectorAll('button').forEach((btn,j)=>{btn.style.background=j===i?profiles[j].color+'33':'transparent';});
    };
    profileBtns.appendChild(b);
  });
  box.appendChild(canvas);box.appendChild(profileBtns);
  document.body.appendChild(modal);
}

/* ===== 퀴즈 v13 엔진 ===== */
function openQuizV13(){
  SFX13.play('quiz_v13');trackFeature13('quiz');
  const dk=isDark();const{modal,box}=makeModal13('🧠 문화센터 퀸즈 v13','15문항 신규 퀸즈');
  let idx=0,score=0;
  const shuffled=QUIZ_V13.slice().sort(()=>Math.random()-0.5);
  function showQ(){
    box.innerHTML='';
    if(idx>=shuffled.length){
      const pct=Math.round(score/shuffled.length*100);
      const grade=pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';
      box.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:48px;color:'+(
        {S:'#FFD700',A:'#4CAF50',B:'#2196F3',C:'#FF9800',D:'#F44336'}[grade]
      )+';">'+grade+'</div><div style="font-size:18px;margin:8px 0;">'+score+'/'+shuffled.length+' 정답 ('+pct+'%)</div></div>';
      const cnt=lsGet('cc-v13-quiz-count',0);lsSet('cc-v13-quiz-count',cnt+1);
      return;
    }
    const q=shuffled[idx];
    const qDiv=ce('div');qDiv.innerHTML='<div style="font-size:14px;font-weight:600;margin-bottom:14px;">'+(idx+1)+'/'+shuffled.length+'. '+esc(q.q)+'</div>';
    q.opts.forEach((o,oi)=>{
      const b=ce('button');b.textContent=o;
      b.style.cssText='display:block;width:100%;padding:12px 16px;margin:6px 0;border-radius:10px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'#252540':'#f8f8f8')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:13px;cursor:pointer;text-align:left;transition:all 0.2s;';
      b.onmouseenter=function(){this.style.background=dk?'#333':'#e8e8e8';};
      b.onmouseleave=function(){this.style.background=dk?'#252540':'#f8f8f8';};
      b.onclick=function(){
        if(oi===q.a){score++;SFX13.play('quiz_correct13');this.style.background='#4CAF5033';this.style.borderColor='#4CAF50';}
        else{SFX13.play('feature_open13');this.style.background='#F4433633';this.style.borderColor='#F44336';}
        setTimeout(()=>{idx++;showQ();},600);
      };
      qDiv.appendChild(b);
    });
    box.appendChild(qDiv);
  }
  showQ();
  document.body.appendChild(modal);
}

/* ===== Quick Actions Rail ===== */
function insertQuickActions13(){
  const old=qs('#v13-quick-actions');if(old)old.remove();
  const dk=isDark();
  const rail=ce('div');rail.id='v13-quick-actions';
  rail.style.cssText='position:fixed;top:200px;left:6px;display:flex;flex-direction:column;gap:5px;z-index:9990;transition:opacity 0.3s;';
  const actions=[
    {label:'📈 트렌드',fn:openTrendAnalyzer},
    {label:'🎓 강사평가',fn:openInstructorEval},
    {label:'💰 비용최적화',fn:openCostOptimizer},
    {label:'🤝 커뮤니티',fn:openCommunityMatcher},
    {label:'🏅 품질배지',fn:openBadgeSystem},
    {label:'📖 다이어리',fn:openDiaryHeatmap},
    {label:'📍 접근성',fn:openAccessScore},
    {label:'🤖 AI큐레이터',fn:openAICurator},
    {label:'🧠 퀸즈v13',fn:openQuizV13}
  ];
  actions.forEach(a=>{
    const b=ce('button');b.className='v13-qbtn';b.textContent=a.label;
    b.style.cssText='padding:6px 10px;border-radius:10px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'rgba(30,30,46,0.92)':'rgba(255,255,255,0.95)')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:11px;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:all 0.2s;';
    b.onmouseenter=function(){this.style.transform='translateX(4px)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.25)';};
    b.onmouseleave=function(){this.style.transform='none';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15)';};
    b.onclick=function(){const old2=qs('#v13-modal');if(old2)old2.remove();a.fn();};
    rail.appendChild(b);
  });
  document.body.appendChild(rail);
  function hideOnModal(){
    const hasModal=qs('.onboarding-overlay')||qs('[class*="modal-overlay"]');
    rail.style.opacity=hasModal?'0':'1';rail.style.pointerEvents=hasModal?'none':'auto';
  }
  setInterval(hideOnModal,1000);
}

/* ===== 키보드 단축키 ===== */
function initKeyboard13(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    const tag=e.target.tagName;if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
    const old=qs('#v13-modal');if(old)old.remove();
    const map={
      'T':openTrendAnalyzer,
      'I':openInstructorEval,
      'C':openCostOptimizer,
      'M':openCommunityMatcher,
      'B':openBadgeSystem,
      'D':openDiaryHeatmap,
      'A':openAccessScore,
      'U':openAICurator
    };
    const fn=map[e.key.toUpperCase()];if(fn){e.preventDefault();fn();}
  });
}

/* ===== CSS 스타일 주입 ===== */
function injectV13Styles(){
  if(qs('#v13-styles'))return;
  const style=ce('style');style.id='v13-styles';
  style.textContent=`
@keyframes v13FadeIn{from{opacity:0}to{opacity:1}}
@keyframes v13SlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes v13SlideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
@keyframes v13Pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
#v13-modal::-webkit-scrollbar{width:6px}
#v13-modal::-webkit-scrollbar-thumb{background:#888;border-radius:3px}
#v13-modal *::-webkit-scrollbar{width:4px}
#v13-modal *::-webkit-scrollbar-thumb{background:#aaa;border-radius:2px}
@media(max-width:480px){
  #v13-quick-actions{top:auto!important;bottom:70px!important;left:0!important;right:0!important;flex-direction:row!important;overflow-x:auto!important;padding:6px 8px!important;gap:4px!important;background:rgba(0,0,0,0.05);backdrop-filter:blur(10px);}
  #v13-quick-actions .v13-qbtn{font-size:10px!important;padding:5px 8px!important;}
  #v13-modal>div{max-width:100vw!important;width:100vw!important;max-height:100vh!important;border-radius:0!important;}
}
body:has(.onboarding-overlay) #v13-quick-actions,
body:has([class*="modal-overlay"]) #v13-quick-actions{opacity:0;pointer-events:none;}
`;
  document.head.appendChild(style);
}

/* ===== init ===== */
function init13(){
  injectV13Styles();
  setTimeout(function(){
    insertQuickActions13();
    initKeyboard13();
    const milestones=lsGet('cc-milestones-v9',[]);
    if(!milestones.includes('v13')){milestones.push('v13');lsSet('cc-milestones-v9',milestones);}
    showToast13('🎉 문화센터 파인더 v13.0 업데이트! 8개 신규 기능 + 퀸즈 15문 + 업적 12개',3500);
  },6000);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init13);
}else{
  init13();
}
})();
