/**
 * culture-center-finder v12.0 patch
 * 수강스케줄최적화기Canvas+강좌매칭성향테스트10문Canvas+학습그룹매칭시뮬레이터12인+강좌리뷰랭킹리더보드Canvas+센터시설비교기6축RadarCanvas+수강로드맵플래너Canvas12주+학습통계인포그래픽CanvasPNG+수강버킷리스트20종+퀴즈+15(105→120)+업적+12(102→114)+SFX12종+키보드8종
 */
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

const V12_ID='ccf-v12-patch';
if(document.getElementById(V12_ID))return;
const marker=document.createElement('meta');
marker.id=V12_ID;
document.head.appendChild(marker);

function qs(s,p){return(p||document).querySelector(s);}
function ce(tag,attrs,ch){
  const el=document.createElement(tag);
  if(attrs)Object.entries(attrs).forEach(([k,v])=>{
    if(k==='style'&&typeof v==='object')Object.assign(el.style,v);
    else if(k==='className')el.className=v;
    else if(k.startsWith('on'))el.addEventListener(k.slice(2).toLowerCase(),v);
    else el.setAttribute(k,v);
  });
  if(ch){
    if(typeof ch==='string')el.innerHTML=ch;
    else if(Array.isArray(ch))ch.forEach(c=>{if(c)el.appendChild(c);});
    else el.appendChild(ch);
  }
  return el;
}
function lsGet(k,d){try{const s=localStorage.getItem(k);return s?JSON.parse(s):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function showToast12(msg,dur){
  const old=document.getElementById('v12-toast');
  if(old)old.remove();
  const t=ce('div',{id:'v12-toast',style:{
    position:'fixed',top:'20px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#1A365D,#0C1525)',
    border:'1px solid rgba(126,200,227,0.5)',borderRadius:'14px',padding:'12px 24px',zIndex:'970',
    fontSize:'13px',fontWeight:'700',color:'#7EC8E3',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
    animation:'v12SlideDown .3s ease both',whiteSpace:'nowrap',maxWidth:'90vw',overflow:'hidden',textOverflow:'ellipsis'
  }},msg);
  document.body.appendChild(t);
  setTimeout(()=>{t.style.animation='v12SlideUp .3s ease both';setTimeout(()=>t.remove(),300);},dur||2500);
}
function fmtDate12(d){
  if(!d)d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function isDark(){return document.documentElement.getAttribute('data-theme')!=='light';}
function seededRand12(seed){let s=seed;return function(){s=(s*16807+0)%2147483647;return(s-1)/2147483646;};}

// ═══════════════════════════════════════
// SFX 엔진 (12종)
// ═══════════════════════════════════════
const SFX12={
  _ctx:null,
  _getCtx(){
    if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}
    return this._ctx;
  },
  play(name){
    const ctx=this._getCtx();
    if(!ctx)return;
    const o=ctx.createOscillator();
    const g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    const presets={
      schedule_open:  {freq:523,type:'sine',dur:0.2,vol:0.12},
      match_start:    {freq:659,type:'triangle',dur:0.18,vol:0.12},
      group_form:     {freq:698,type:'sine',dur:0.2,vol:0.1},
      ranking_view:   {freq:784,type:'triangle',dur:0.18,vol:0.12},
      facility_check: {freq:880,type:'sine',dur:0.2,vol:0.14},
      roadmap_set:    {freq:587,type:'triangle',dur:0.15,vol:0.12},
      infographic_gen:{freq:932,type:'sine',dur:0.3,vol:0.15},
      bucket_add:     {freq:1047,type:'triangle',dur:0.25,vol:0.14},
      quiz_v12:       {freq:740,type:'sine',dur:0.18,vol:0.12},
      quiz_correct12: {freq:988,type:'triangle',dur:0.2,vol:0.14},
      achieve_v12:    {freq:1175,type:'sine',dur:0.3,vol:0.15},
      feature_open12: {freq:622,type:'triangle',dur:0.15,vol:0.1}
    };
    const p=presets[name]||presets.feature_open12;
    o.type=p.type;o.frequency.value=p.freq;
    g.gain.setValueAtTime(p.vol,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+p.dur);
    o.start(ctx.currentTime);o.stop(ctx.currentTime+p.dur);
  }
};

// ═══════════════════════════════════════
// 업적 시스템 (+12종, 102→114)
// ═══════════════════════════════════════
const V12_ACHIEVEMENTS=[
  {id:'schedule_first',name:'스케줄 입문',desc:'수강 스케줄 최적화 최초 사용',icon:'&#128197;'},
  {id:'schedule_full',name:'빈틈없는 일정',desc:'주간 스케줄 5과목 이상 배치',icon:'&#128198;'},
  {id:'match_complete',name:'성향 파악 완료',desc:'강좌 매칭 성향 테스트 완료',icon:'&#127919;'},
  {id:'group_creator',name:'그룹장 탄생',desc:'학습 그룹 최초 생성',icon:'&#129309;'},
  {id:'ranking_viewer',name:'랭킹 관전자',desc:'강좌 리뷰 랭킹 확인',icon:'&#127942;'},
  {id:'facility_analyst',name:'시설 분석가',desc:'센터 시설 비교 수행',icon:'&#127970;'},
  {id:'roadmap_planner',name:'로드맵 설계자',desc:'수강 로드맵 최초 설정',icon:'&#128506;'},
  {id:'roadmap_master',name:'로드맵 마스터',desc:'로드맵 3개 이상 완료',icon:'&#127775;'},
  {id:'infographic_gen',name:'인포그래픽 달인',desc:'학습 통계 인포그래픽 생성',icon:'&#128202;'},
  {id:'bucket_dreamer',name:'버킷리스트 몽상가',desc:'수강 버킷리스트 3개 추가',icon:'&#128173;'},
  {id:'quiz_v12_try',name:'v12 퀴즈 도전자',desc:'v12 퀴즈 최초 도전',icon:'&#127891;'},
  {id:'v12_explorer',name:'v12 탐험가',desc:'v12 기능 5종 이상 사용',icon:'&#127942;'}
];

function checkAchieve12(id){
  const achieved=lsGet('cc-achieve-v12',[]);
  if(achieved.includes(id))return;
  achieved.push(id);
  lsSet('cc-achieve-v12',achieved);
  const a=V12_ACHIEVEMENTS.find(x=>x.id===id);
  if(a){
    SFX12.play('achieve_v12');
    showToast12(a.icon+' &#50629;&#51201; &#45804;&#49457;: '+esc(a.name),3000);
  }
  if(achieved.length>=5)checkAchieve12('v12_explorer');
}

function trackFeature12(name){
  const used=lsGet('cc-v12-features-used',[]);
  if(!used.includes(name)){
    used.push(name);
    lsSet('cc-v12-features-used',used);
    if(used.length>=5)checkAchieve12('v12_explorer');
  }
}

function makeModal12(title,subtitle){
  const modal=ce('div',{id:'v12-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v12FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'720px',width:'94vw',maxHeight:'88vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);
  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},title));
  if(subtitle)box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},subtitle));
  modal.appendChild(box);
  return{modal,box};
}

// ═══════════════════════════════════════
// 1. 수강 스케줄 최적화기 Canvas
// ═══════════════════════════════════════
const SCHEDULE_SLOTS=[
  {day:'월',slots:['09:00','10:00','11:00','13:00','14:00','15:00','16:00','19:00','20:00']},
  {day:'화',slots:['09:00','10:00','11:00','13:00','14:00','15:00','16:00','19:00','20:00']},
  {day:'수',slots:['09:00','10:00','11:00','13:00','14:00','15:00','16:00','19:00','20:00']},
  {day:'목',slots:['09:00','10:00','11:00','13:00','14:00','15:00','16:00','19:00','20:00']},
  {day:'금',slots:['09:00','10:00','11:00','13:00','14:00','15:00','16:00','19:00','20:00']},
  {day:'토',slots:['09:00','10:00','11:00','13:00','14:00','15:00']},
  {day:'일',slots:['10:00','11:00','13:00','14:00']}
];
const SCHEDULE_COURSES=['수영','피아노','요가','미술','발레','댄스','요리','서예','태권도','영어','필라테스','플라워'];
const SCHEDULE_COLORS=['#22C55E','#3B82F6','#A855F7','#F59E0B','#EC4899','#06B6D4','#EF4444','#84CC16','#F97316','#8B5CF6','#14B8A6','#E11D48'];

function openScheduleOptimizer(){
  SFX12.play('schedule_open');
  trackFeature12('schedule');
  checkAchieve12('schedule_first');

  const{modal,box}=makeModal12('&#128197; &#49688;&#44053; &#49828;&#52992;&#51460; &#52572;&#51201;&#54868;&#44592;','&#50836;&#51068;/&#49884;&#44036;&#48324; &#44053;&#51340;&#47484; &#48176;&#52824;&#54616;&#44256; &#52649;&#46028;&#51012; &#44160;&#49324;&#54633;&#45768;&#45796;');

  const schedule=lsGet('cc-v12-schedule',{});

  const selDiv=ce('div',{style:{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px'}});
  const courseSelect=ce('select',{style:{background:'var(--input-bg)',border:'1px solid var(--input-border)',borderRadius:'8px',padding:'6px 10px',color:'var(--text)',fontSize:'12px'}});
  SCHEDULE_COURSES.forEach((c,i)=>{
    const opt=ce('option',{value:c});opt.textContent=c;
    courseSelect.appendChild(opt);
  });
  selDiv.appendChild(ce('span',{style:{fontSize:'13px',color:'var(--text-secondary)',lineHeight:'32px'}},'&#44053;&#51340;:'));
  selDiv.appendChild(courseSelect);
  box.appendChild(selDiv);

  const canvas=ce('canvas',{width:680,height:420,style:{width:'100%',height:'auto',borderRadius:'12px'}});
  box.appendChild(canvas);

  const conflictDiv=ce('div',{style:{marginTop:'12px',fontSize:'13px',color:'var(--text-secondary)'}});
  box.appendChild(conflictDiv);

  function drawSchedule(){
    const ctx=canvas.getContext('2d');
    const W=680,H=420;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 16px system-ui';
    ctx.textAlign='center';
    ctx.fillText('주간 수강 스케줄',W/2,28);

    const days=['&#50900;','&#54868;','&#49688;','&#47785;','&#44552;','&#53664;','&#51068;'];
    const times=['09','10','11','13','14','15','16','19','20'];
    const colW=82,rowH=34,startX=55,startY=48;

    ctx.font='bold 12px system-ui';
    days.forEach((d,i)=>{
      ctx.fillStyle=isDark()?'#7EC8E3':'#0EA5E9';
      ctx.textAlign='center';
      ctx.fillText(d,startX+i*colW+colW/2,startY+10);
    });

    times.forEach((t,j)=>{
      ctx.fillStyle=isDark()?'rgba(255,255,255,0.5)':'#64748B';
      ctx.textAlign='right';
      ctx.font='11px system-ui';
      ctx.fillText(t+':00',startX-6,startY+26+j*rowH+rowH/2+4);
    });

    days.forEach((d,i)=>{
      times.forEach((t,j)=>{
        const key=i+'-'+j;
        const x=startX+i*colW+2;
        const y=startY+26+j*rowH+2;
        const w=colW-4;
        const h=rowH-4;

        if(i>=6&&j>=6)return;
        if(i===6&&j>=4)return;

        ctx.fillStyle=isDark()?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.02)';
        ctx.strokeStyle=isDark()?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)';
        ctx.lineWidth=1;
        ctx.beginPath();ctx.roundRect(x,y,w,h,6);ctx.fill();ctx.stroke();

        if(schedule[key]){
          const cIdx=SCHEDULE_COURSES.indexOf(schedule[key]);
          const color=SCHEDULE_COLORS[cIdx>=0?cIdx:0];
          ctx.fillStyle=color+'33';
          ctx.strokeStyle=color;
          ctx.lineWidth=1.5;
          ctx.beginPath();ctx.roundRect(x,y,w,h,6);ctx.fill();ctx.stroke();
          ctx.fillStyle=isDark()?'#fff':'#1E293B';
          ctx.font='bold 10px system-ui';
          ctx.textAlign='center';
          ctx.textBaseline='middle';
          ctx.fillText(schedule[key],x+w/2,y+h/2);
        }
      });
    });

    let conflicts=0;
    const occupied={};
    Object.entries(schedule).forEach(([key,course])=>{
      const [di,ti]=key.split('-');
      const timeKey=ti;
      if(!occupied[timeKey])occupied[timeKey]=[];
      occupied[timeKey].push({day:di,course});
    });

    Object.values(occupied).forEach(arr=>{
      if(arr.length>1){
        const courses=arr.map(a=>a.course);
        const unique=new Set(courses);
        if(unique.size<courses.length)conflicts++;
      }
    });

    const totalCourses=Object.keys(schedule).length;
    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 13px system-ui';
    ctx.textAlign='left';
    ctx.fillText('총 '+totalCourses+'개 강좌 배치',startX,H-16);

    if(totalCourses>=5)checkAchieve12('schedule_full');

    ctx.textAlign='right';
    if(conflicts>0){
      ctx.fillStyle='#EF4444';
      ctx.fillText('⚠ 충돌 '+conflicts+'건 발견',W-20,H-16);
    }else if(totalCourses>0){
      ctx.fillStyle='#22C55E';
      ctx.fillText('✓ 충돌 없음',W-20,H-16);
    }
  }

  canvas.addEventListener('click',e=>{
    const rect=canvas.getBoundingClientRect();
    const scaleX=680/rect.width;
    const mx=(e.clientX-rect.left)*scaleX;
    const my=(e.clientY-rect.top)*(420/rect.height);
    const startX=55,startY=74,colW=82,rowH=34;
    const di=Math.floor((mx-startX)/colW);
    const ti=Math.floor((my-startY)/rowH);
    if(di<0||di>6||ti<0||ti>8)return;
    if(di>=6&&ti>=6)return;
    if(di===6&&ti>=4)return;
    const key=di+'-'+ti;
    if(schedule[key]){
      delete schedule[key];
    }else{
      schedule[key]=courseSelect.value;
    }
    lsSet('cc-v12-schedule',schedule);
    drawSchedule();
    SFX12.play('schedule_open');
  });

  drawSchedule();
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 2. 강좌 매칭 성향 테스트 Canvas (10문)
// ═══════════════════════════════════════
const MATCH_QUESTIONS=[
  {q:'&#50868;&#46041;&#51012; &#51339;&#50500;&#54616;&#49884;&#45208;&#50836;?',a:['&#47588;&#50864; &#51339;&#50500;&#54632;','&#48372;&#53685;','&#48324;&#47196;'],scores:[[0,3],[1,2],[2,1]]},
  {q:'&#50696;&#49696;/&#52285;&#51089; &#54876;&#46041;&#50640; &#44288;&#49900;&#51060; &#51080;&#45208;&#50836;?',a:['&#47588;&#50864; &#44288;&#49900;','&#51312;&#44552;','&#50630;&#51020;'],scores:[[3,3],[3,1],[3,0]]},
  {q:'&#49352;&#47196;&#50868; &#49324;&#46988;&#46308;&#44284; &#50612;&#50872;&#47532;&#45716; &#44163; &#51339;&#50500;&#54616;&#49884;&#45208;&#50836;?',a:['&#45348;','&#48372;&#53685;','&#50500;&#45768;&#50724;'],scores:[[4,2],[4,1],[4,0]]},
  {q:'&#51060;&#47200;&#48372;&#45796; &#49892;&#44592;&#47484; &#49440;&#54840;&#54616;&#49884;&#45208;&#50836;?',a:['&#49892;&#44592; &#49440;&#54840;','&#46168; &#45796;','&#51060;&#47200; &#49440;&#54840;'],scores:[[5,2],[5,1],[5,0]]},
  {q:'&#49892;&#45236; vs &#49892;&#50808; &#54876;&#46041; &#49440;&#54840;&#46020;&#45716;?',a:['&#49892;&#45236;','&#49345;&#44288;&#50630;&#51020;','&#49892;&#50808;'],scores:[[6,0],[6,1],[6,2]]},
  {q:'&#51020;&#50501;&#50640; &#44288;&#49900;&#51060; &#51080;&#45208;&#50836;?',a:['&#47588;&#50864;','&#51312;&#44552;','&#50630;&#51020;'],scores:[[7,3],[7,1],[7,0]]},
  {q:'&#50836;&#47532;/&#48288;&#51060;&#53433;&#50640; &#44288;&#49900;&#51060; &#51080;&#45208;&#50836;?',a:['&#47588;&#50864;','&#51312;&#44552;','&#50630;&#51020;'],scores:[[8,3],[8,1],[8,0]]},
  {q:'&#44508;&#52825;&#51201;&#51064; &#49884;&#44036;&#50640; &#49688;&#50629;&#54624; &#49688; &#51080;&#45208;&#50836;?',a:['&#45348;','&#51452;&#47568;&#47564;','&#50612;&#47140;&#50880;'],scores:[[9,2],[9,1],[9,0]]},
  {q:'&#52404;&#47141; &#49688;&#51456;&#51008; &#50612;&#45712; &#51221;&#46020;&#51064;&#44032;&#50836;?',a:['&#51339;&#51020;','&#48372;&#53685;','&#48512;&#51313;'],scores:[[0,2],[0,1],[0,0]]},
  {q:'&#51109;&#44592;&#44036; &#48176;&#50880;&#50640; &#46041;&#44592;&#48512;&#50668;&#44032; &#46104;&#45208;&#50836;?',a:['&#47588;&#50864;','&#48372;&#53685;','&#50500;&#45768;&#50724;'],scores:[[1,3],[1,1],[1,0]]}
];

const MATCH_RESULTS=[
  {name:'&#49688;&#50689;',desc:'&#52404;&#47141;+&#44508;&#52825;&#49457;+&#49892;&#45236;&#50868;&#46041; &#51201;&#54633;',icon:'&#127946;',color:'#3B82F6'},
  {name:'&#54588;&#50500;&#45432;',desc:'&#51020;&#50501;+&#51109;&#44592;&#48176;&#50880;+&#44060;&#51064;&#50672;&#49845; &#51201;&#54633;',icon:'&#127929;',color:'#A855F7'},
  {name:'&#50836;&#44032;',desc:'&#52404;&#47141;+&#49892;&#45236;+&#47560;&#51020;&#52824;&#50976; &#51201;&#54633;',icon:'&#129495;',color:'#22C55E'},
  {name:'&#48120;&#49696;',desc:'&#52285;&#51089;+&#44060;&#51064;+&#49892;&#44592; &#51201;&#54633;',icon:'&#127912;',color:'#F59E0B'},
  {name:'&#45824;&#49828;',desc:'&#50868;&#46041;+&#49324;&#44368;+&#51020;&#50501; &#51201;&#54633;',icon:'&#128131;',color:'#EC4899'},
  {name:'&#50836;&#47532;',desc:'&#49892;&#44592;+&#52285;&#51089;+&#49892;&#45236; &#51201;&#54633;',icon:'&#127859;',color:'#EF4444'},
  {name:'&#50689;&#50612;',desc:'&#51060;&#47200;+&#51109;&#44592;&#48176;&#50880;+&#44508;&#52825;&#49457; &#51201;&#54633;',icon:'&#127468;&#127463;',color:'#06B6D4'},
  {name:'&#48156;&#47112;',desc:'&#52404;&#47141;+&#50696;&#49696;+&#44508;&#52825;&#49457; &#51201;&#54633;',icon:'&#129424;',color:'#D946EF'},
  {name:'&#49436;&#50696;',desc:'&#52285;&#51089;+&#51665;&#51473;+&#44060;&#51064; &#51201;&#54633;',icon:'&#9999;&#65039;',color:'#84CC16'},
  {name:'&#53468;&#44428;&#46020;',desc:'&#52404;&#47141;+&#44508;&#50984;+&#49324;&#44368; &#51201;&#54633;',icon:'&#129355;',color:'#F97316'},
  {name:'&#54540;&#46972;&#50892;',desc:'&#52285;&#51089;+&#49892;&#45236;+&#47560;&#51020;&#52824;&#50976; &#51201;&#54633;',icon:'&#127804;',color:'#14B8A6'},
  {name:'&#54596;&#46972;&#53580;&#49828;',desc:'&#52404;&#47141;+&#49892;&#45236;+&#50976;&#50672;&#49457; &#51201;&#54633;',icon:'&#129336;',color:'#8B5CF6'}
];

function openMatchTest(){
  SFX12.play('match_start');
  trackFeature12('match');

  const{modal,box}=makeModal12('&#127919; &#44053;&#51340; &#47588;&#52845; &#49457;&#54693; &#53580;&#49828;&#53944;','10&#44060; &#51656;&#47928;&#50640; &#45813;&#54616;&#47732; &#45817;&#49888;&#50640;&#44172; &#47582;&#45716; &#44053;&#51340;&#47484; &#52628;&#52380;&#54633;&#45768;&#45796;');

  let currentQ=0;
  const scores=new Array(10).fill(0);
  const canvas=ce('canvas',{width:600,height:380,style:{width:'100%',height:'auto',borderRadius:'12px'}});
  box.appendChild(canvas);

  const ansDiv=ce('div',{style:{marginTop:'16px',display:'flex',gap:'8px',flexWrap:'wrap',justifyContent:'center'}});
  box.appendChild(ansDiv);

  function drawQuestion(){
    const ctx=canvas.getContext('2d');
    const W=600,H=380;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    if(currentQ>=MATCH_QUESTIONS.length){
      drawResult(ctx,W,H);
      return;
    }

    const q=MATCH_QUESTIONS[currentQ];

    ctx.fillStyle=isDark()?'rgba(126,200,227,0.1)':'rgba(14,165,233,0.08)';
    ctx.beginPath();ctx.roundRect(20,20,W-40,50,10);ctx.fill();
    ctx.fillStyle=isDark()?'#7EC8E3':'#0EA5E9';
    ctx.font='bold 14px system-ui';
    ctx.textAlign='center';
    ctx.fillText('질문 '+(currentQ+1)+'/'+MATCH_QUESTIONS.length,W/2,50);

    const barW=W-80;
    ctx.fillStyle='rgba(255,255,255,0.05)';
    ctx.beginPath();ctx.roundRect(40,65,barW,8,4);ctx.fill();
    const prog=(currentQ/MATCH_QUESTIONS.length)*barW;
    const grd=ctx.createLinearGradient(40,65,40+prog,65);
    grd.addColorStop(0,'#7EC8E3');grd.addColorStop(1,'#3AAFA9');
    ctx.fillStyle=grd;
    ctx.beginPath();ctx.roundRect(40,65,prog,8,4);ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 20px system-ui';
    ctx.textAlign='center';
    ctx.fillText(q.q,W/2,130);

    ansDiv.innerHTML='';
    q.a.forEach((a,i)=>{
      const btn=ce('button',{style:{
        padding:'12px 24px',borderRadius:'12px',border:'2px solid var(--card-border)',
        background:'var(--card-bg)',color:'var(--text)',fontSize:'14px',fontWeight:'600',
        cursor:'pointer',transition:'all .2s',minWidth:'120px'
      },onClick:()=>{
        const[sIdx,sVal]=q.scores[i];
        scores[sIdx]+=sVal;
        currentQ++;
        SFX12.play('match_start');
        drawQuestion();
      }},a);
      btn.addEventListener('mouseenter',()=>{btn.style.borderColor='var(--accent)';btn.style.color='var(--accent)';});
      btn.addEventListener('mouseleave',()=>{btn.style.borderColor='var(--card-border)';btn.style.color='var(--text)';});
      ansDiv.appendChild(btn);
    });
  }

  function drawResult(ctx,W,H){
    ansDiv.innerHTML='';
    checkAchieve12('match_complete');

    const totalScore=scores.reduce((a,b)=>a+b,0);
    const rng=seededRand12(totalScore+42);
    const indices=MATCH_RESULTS.map((_,i)=>i).sort(()=>rng()-0.5);
    const top3=indices.slice(0,3);

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 18px system-ui';
    ctx.textAlign='center';
    ctx.fillText('당신에게 맞는 강좌 TOP 3',W/2,40);

    top3.forEach((ri,i)=>{
      const r=MATCH_RESULTS[ri];
      const y=70+i*100;
      ctx.fillStyle=r.color+'22';
      ctx.strokeStyle=r.color;
      ctx.lineWidth=2;
      ctx.beginPath();ctx.roundRect(40,y,W-80,85,12);ctx.fill();ctx.stroke();

      ctx.font='32px system-ui';
      ctx.textAlign='left';
      ctx.fillText(r.icon,60,y+50);

      ctx.fillStyle=isDark()?'#fff':'#1E293B';
      ctx.font='bold 18px system-ui';
      ctx.fillText((i+1)+'위: '+r.name,105,y+35);

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.6)':'#64748B';
      ctx.font='13px system-ui';
      ctx.fillText(r.desc,105,y+60);

      const matchPct=Math.round(90-i*15+rng()*10);
      ctx.fillStyle=r.color;
      ctx.font='bold 16px system-ui';
      ctx.textAlign='right';
      ctx.fillText(matchPct+'%',W-60,y+45);
    });

    lsSet('cc-v12-match-result',{top3:top3.map(i=>MATCH_RESULTS[i].name),date:fmtDate12()});
  }

  drawQuestion();
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 3. 학습 그룹 매칭 시뮬레이터 (12인)
// ═══════════════════════════════════════
const GROUP_MEMBERS=[
  {name:'&#44608;&#48124;&#51456;',interest:'&#49688;&#50689;',level:'&#52488;&#44553;',icon:'&#128102;'},
  {name:'&#51060;&#49436;&#50672;',interest:'&#54588;&#50500;&#45432;',level:'&#51473;&#44553;',icon:'&#128103;'},
  {name:'&#48149;&#51648;&#54984;',interest:'&#50836;&#44032;',level:'&#52488;&#44553;',icon:'&#128102;'},
  {name:'&#52572;&#50696;&#47536;',interest:'&#48120;&#49696;',level:'&#44256;&#44553;',icon:'&#128103;'},
  {name:'&#51221;&#50868;&#49436;',interest:'&#45824;&#49828;',level:'&#51473;&#44553;',icon:'&#128103;'},
  {name:'&#54620;&#51221;&#50864;',interest:'&#50836;&#47532;',level:'&#52488;&#44553;',icon:'&#128102;'},
  {name:'&#49569;&#48124;&#51116;',interest:'&#50689;&#50612;',level:'&#51473;&#44553;',icon:'&#128102;'},
  {name:'&#50980;&#49436;&#50672;',interest:'&#48156;&#47112;',level:'&#52488;&#44553;',icon:'&#128103;'},
  {name:'&#51060;&#49688;&#51652;',interest:'&#49436;&#50696;',level:'&#44256;&#44553;',icon:'&#128103;'},
  {name:'&#44608;&#53468;&#54984;',interest:'&#53468;&#44428;&#46020;',level:'&#51473;&#44553;',icon:'&#128102;'},
  {name:'&#48149;&#49688;&#48124;',interest:'&#54540;&#46972;&#50892;',level:'&#52488;&#44553;',icon:'&#128103;'},
  {name:'&#51060;&#51456;&#54840;',interest:'&#54596;&#46972;&#53580;&#49828;',level:'&#51473;&#44553;',icon:'&#128102;'}
];

function openGroupMatching(){
  SFX12.play('group_form');
  trackFeature12('group');
  checkAchieve12('group_creator');

  const{modal,box}=makeModal12('&#129309; &#54617;&#49845; &#44536;&#47353; &#47588;&#52845; &#49884;&#48044;&#47112;&#51060;&#53552;','&#44288;&#49900;&#49324;/&#49688;&#51456;&#48324; &#54617;&#49845; &#44536;&#47353;&#51012; &#51088;&#46041; &#44396;&#49457;&#54633;&#45768;&#45796;');

  const groups=lsGet('cc-v12-groups',[]);

  const filterDiv=ce('div',{style:{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px'}});
  const interestSelect=ce('select',{style:{background:'var(--input-bg)',border:'1px solid var(--input-border)',borderRadius:'8px',padding:'6px 10px',color:'var(--text)',fontSize:'12px'}});
  const allOpt=ce('option',{value:'all'});allOpt.textContent='전체';
  interestSelect.appendChild(allOpt);
  [...new Set(GROUP_MEMBERS.map(m=>m.interest))].forEach(interest=>{
    const opt=ce('option',{value:interest});opt.textContent=interest;
    interestSelect.appendChild(opt);
  });
  filterDiv.appendChild(ce('span',{style:{fontSize:'13px',color:'var(--text-secondary)',lineHeight:'32px'}},'&#44288;&#49900;&#49324;:'));
  filterDiv.appendChild(interestSelect);

  const matchBtn=ce('button',{style:{
    padding:'8px 18px',background:'linear-gradient(135deg,#7EC8E3,#3AAFA9)',border:'none',
    borderRadius:'10px',color:'#fff',fontSize:'13px',fontWeight:'700',cursor:'pointer'
  }},'&#128260; &#44536;&#47353; &#51088;&#46041; &#47588;&#52845;');
  filterDiv.appendChild(matchBtn);
  box.appendChild(filterDiv);

  const resultDiv=ce('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'12px'}});
  box.appendChild(resultDiv);

  function renderMembers(){
    resultDiv.innerHTML='';
    const filter=interestSelect.value;
    const filtered=filter==='all'?GROUP_MEMBERS:GROUP_MEMBERS.filter(m=>m.interest===filter);

    filtered.forEach(m=>{
      const card=ce('div',{style:{
        background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'12px',
        padding:'14px',transition:'transform .2s',cursor:'default'
      }});
      card.innerHTML='<div style="font-size:28px;text-align:center">'+m.icon+'</div>'+
        '<div style="text-align:center;margin-top:6px;font-weight:700;color:var(--text-primary);font-size:14px">'+m.name+'</div>'+
        '<div style="text-align:center;margin-top:4px;font-size:12px;color:var(--text-secondary)">'+m.interest+' &middot; '+m.level+'</div>';
      card.addEventListener('mouseenter',()=>{card.style.transform='translateY(-3px)';card.style.borderColor='var(--accent)';});
      card.addEventListener('mouseleave',()=>{card.style.transform='none';card.style.borderColor='var(--card-border)';});
      resultDiv.appendChild(card);
    });
  }

  matchBtn.addEventListener('click',()=>{
    SFX12.play('group_form');
    const filter=interestSelect.value;
    const filtered=filter==='all'?GROUP_MEMBERS:GROUP_MEMBERS.filter(m=>m.interest===filter);
    if(filtered.length<2){showToast12('ℹ 2명 이상 필요합니다');return;}

    const shuffled=[...filtered].sort(()=>Math.random()-0.5);
    const groupSize=Math.min(4,Math.ceil(shuffled.length/2));
    const formed=[];
    for(let i=0;i<shuffled.length;i+=groupSize){
      formed.push(shuffled.slice(i,i+groupSize));
    }

    resultDiv.innerHTML='';
    formed.forEach((g,gi)=>{
      const gCard=ce('div',{style:{
        background:'linear-gradient(135deg,rgba(126,200,227,0.08),rgba(58,175,169,0.05))',
        border:'1px solid rgba(126,200,227,0.2)',borderRadius:'14px',padding:'16px',gridColumn:'span 2'
      }});
      gCard.innerHTML='<div style="font-weight:700;color:var(--accent);font-size:15px;margin-bottom:10px">&#128101; 그룹 '+(gi+1)+' ('+g.length+'명)</div>';
      g.forEach(m=>{
        gCard.innerHTML+='<div style="display:inline-flex;align-items:center;gap:6px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:8px;padding:6px 12px;margin:3px;font-size:12px">'+
          m.icon+' '+m.name+' <span style="color:var(--text-muted);font-size:10px">'+m.interest+'</span></div>';
      });
      resultDiv.appendChild(gCard);
    });

    groups.push({date:fmtDate12(),count:formed.length,members:shuffled.length});
    if(groups.length>20)groups.shift();
    lsSet('cc-v12-groups',groups);
  });

  interestSelect.addEventListener('change',renderMembers);
  renderMembers();
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 4. 강좌 리뷰 랭킹 리더보드 Canvas
// ═══════════════════════════════════════
const LEADERBOARD_DATA=[
  {name:'&#49688;&#50689;',score:95,reviews:342,trend:'+12%',icon:'&#127946;'},
  {name:'&#50836;&#44032;',score:93,reviews:287,trend:'+18%',icon:'&#129495;'},
  {name:'&#54588;&#50500;&#45432;',score:91,reviews:256,trend:'+8%',icon:'&#127929;'},
  {name:'&#48120;&#49696;',score:90,reviews:198,trend:'+15%',icon:'&#127912;'},
  {name:'&#45824;&#49828;',score:88,reviews:176,trend:'+22%',icon:'&#128131;'},
  {name:'&#48156;&#47112;',score:87,reviews:165,trend:'+10%',icon:'&#129424;'},
  {name:'&#50836;&#47532;',score:86,reviews:143,trend:'+25%',icon:'&#127859;'},
  {name:'&#50689;&#50612;',score:85,reviews:132,trend:'+5%',icon:'&#127468;&#127463;'},
  {name:'&#54596;&#46972;&#53580;&#49828;',score:84,reviews:128,trend:'+20%',icon:'&#129336;'},
  {name:'&#53468;&#44428;&#46020;',score:83,reviews:112,trend:'+14%',icon:'&#129355;'},
  {name:'&#49436;&#50696;',score:82,reviews:98,trend:'+7%',icon:'&#9999;&#65039;'},
  {name:'&#54540;&#46972;&#50892;',score:80,reviews:87,trend:'+30%',icon:'&#127804;'}
];

function openLeaderboard(){
  SFX12.play('ranking_view');
  trackFeature12('ranking');
  checkAchieve12('ranking_viewer');

  const{modal,box}=makeModal12('&#127942; &#44053;&#51340; &#47532;&#48624; &#47021;&#53433; &#47532;&#45908;&#48372;&#46300;','&#49688;&#44053;&#49373; &#47532;&#48624; &#44592;&#48152; &#51333;&#54633; &#47021;&#53433;');

  const canvas=ce('canvas',{width:640,height:480,style:{width:'100%',height:'auto',borderRadius:'12px'}});
  box.appendChild(canvas);

  const ctx=canvas.getContext('2d');
  const W=640,H=480;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
  ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

  ctx.fillStyle=isDark()?'#fff':'#1E293B';
  ctx.font='bold 18px system-ui';
  ctx.textAlign='center';
  ctx.fillText('강좌 리뷰 랭킹 TOP 12',W/2,30);

  LEADERBOARD_DATA.forEach((d,i)=>{
    const y=48+i*34;
    const barMaxW=260;
    const barW=(d.score/100)*barMaxW;

    if(i<3){
      ctx.fillStyle=isDark()?'rgba(255,215,0,0.06)':'rgba(255,215,0,0.08)';
      ctx.beginPath();ctx.roundRect(20,y,W-40,30,8);ctx.fill();
    }

    const medals=['&#129351;','&#129352;','&#129353;'];
    ctx.font=i<3?'bold 14px system-ui':'13px system-ui';
    ctx.textAlign='left';
    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.fillText(i<3?medals[i]:(i+1)+'.',30,y+20);

    ctx.fillText(d.icon+' '+d.name,68,y+20);

    const barX=220;
    ctx.fillStyle='rgba(255,255,255,0.05)';
    ctx.beginPath();ctx.roundRect(barX,y+6,barMaxW,18,9);ctx.fill();

    const colors=['#FFD700','#C0C0C0','#CD7F32','#22C55E','#3B82F6','#A855F7','#F59E0B','#EC4899','#06B6D4','#EF4444','#84CC16','#14B8A6'];
    const grad=ctx.createLinearGradient(barX,0,barX+barW,0);
    grad.addColorStop(0,colors[i]+'CC');grad.addColorStop(1,colors[i]+'66');
    ctx.fillStyle=grad;
    ctx.beginPath();ctx.roundRect(barX,y+6,barW,18,9);ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 12px system-ui';
    ctx.textAlign='left';
    ctx.fillText(d.score+'점',barX+barMaxW+10,y+20);

    ctx.fillStyle=isDark()?'rgba(255,255,255,0.5)':'#64748B';
    ctx.font='11px system-ui';
    ctx.fillText(d.reviews+'건',barX+barMaxW+55,y+20);

    ctx.fillStyle='#22C55E';
    ctx.font='bold 11px system-ui';
    ctx.textAlign='right';
    ctx.fillText(d.trend,W-30,y+20);
  });

  ctx.fillStyle=isDark()?'rgba(255,255,255,0.4)':'#94A3B8';
  ctx.font='11px system-ui';
  ctx.textAlign='center';
  ctx.fillText('※ 리뷰 수·평점·재수강률 종합 시뮬레이션 데이터',W/2,H-12);

  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 5. 센터 시설 비교기 6축 Radar Canvas
// ═══════════════════════════════════════
const FACILITY_CENTERS=[
  {name:'홈플러스 강남',scores:[4.5,4.2,3.8,4.0,4.3,4.1]},
  {name:'롯데마트 잠실',scores:[4.0,4.5,4.2,3.8,4.0,4.4]},
  {name:'현대백화점 압구정',scores:[4.8,4.0,4.5,4.3,4.5,3.9]},
  {name:'이마트 성남',scores:[3.8,4.3,4.0,4.5,3.9,4.2]},
  {name:'구민체육센터',scores:[3.5,4.8,3.5,4.2,3.8,4.6]},
  {name:'YMCA 문화센터',scores:[3.9,4.1,4.0,4.4,4.0,4.3]}
];
const FACILITY_AXES=['시설품질','강사진','접근성','프로그램','청결도','가격대비'];

function openFacilityCompare(){
  SFX12.play('facility_check');
  trackFeature12('facility');
  checkAchieve12('facility_analyst');

  const{modal,box}=makeModal12('&#127970; &#49468;&#53552; &#49884;&#49444; &#48708;&#44368;&#44592;','6&#52629; &#47112;&#51060;&#45908;&#52264;&#53944;&#47196; &#49468;&#53552;&#48324; &#49884;&#49444; &#48708;&#44368;');

  const checkDiv=ce('div',{style:{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px'}});
  const selected=lsGet('cc-v12-facility-sel',[0,1]);

  FACILITY_CENTERS.forEach((c,i)=>{
    const btn=ce('button',{style:{
      padding:'6px 14px',borderRadius:'8px',fontSize:'12px',fontWeight:'600',cursor:'pointer',
      border:'2px solid '+(selected.includes(i)?'var(--accent)':'var(--card-border)'),
      background:selected.includes(i)?'rgba(126,200,227,0.12)':'var(--card-bg)',
      color:selected.includes(i)?'var(--accent)':'var(--text-secondary)',transition:'all .2s'
    },onClick:()=>{
      const idx=selected.indexOf(i);
      if(idx>=0)selected.splice(idx,1);
      else if(selected.length<3)selected.push(i);
      lsSet('cc-v12-facility-sel',selected);
      modal.remove();
      openFacilityCompare();
    }},esc(c.name));
    checkDiv.appendChild(btn);
  });
  box.appendChild(checkDiv);

  const canvas=ce('canvas',{width:520,height:440,style:{width:'100%',maxWidth:'520px',height:'auto',borderRadius:'12px',margin:'0 auto',display:'block'}});
  box.appendChild(canvas);

  const ctx=canvas.getContext('2d');
  const W=520,H=440;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
  ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

  ctx.fillStyle=isDark()?'#fff':'#1E293B';
  ctx.font='bold 16px system-ui';
  ctx.textAlign='center';
  ctx.fillText('센터 시설 비교 레이더',W/2,28);

  const cx=W/2,cy=220,maxR=140;
  const axes=FACILITY_AXES;
  const n=axes.length;

  for(let ring=1;ring<=5;ring++){
    const r=maxR*(ring/5);
    ctx.beginPath();
    for(let i=0;i<n;i++){
      const angle=(Math.PI*2*i/n)-Math.PI/2;
      const x=cx+Math.cos(angle)*r;
      const y=cy+Math.sin(angle)*r;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.strokeStyle=isDark()?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.06)';
    ctx.lineWidth=1;
    ctx.stroke();
  }

  axes.forEach((label,i)=>{
    const angle=(Math.PI*2*i/n)-Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(angle)*maxR,cy+Math.sin(angle)*maxR);
    ctx.strokeStyle=isDark()?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.08)';
    ctx.stroke();

    const lx=cx+Math.cos(angle)*(maxR+22);
    const ly=cy+Math.sin(angle)*(maxR+22);
    ctx.fillStyle=isDark()?'rgba(255,255,255,0.7)':'#475569';
    ctx.font='12px system-ui';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(label,lx,ly);
  });

  const polyColors=['#3B82F6','#22C55E','#F59E0B'];
  selected.forEach((si,pi)=>{
    const c=FACILITY_CENTERS[si];
    if(!c)return;
    ctx.beginPath();
    c.scores.forEach((s,i)=>{
      const angle=(Math.PI*2*i/n)-Math.PI/2;
      const r=maxR*(s/5);
      const x=cx+Math.cos(angle)*r;
      const y=cy+Math.sin(angle)*r;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.closePath();
    ctx.fillStyle=polyColors[pi]+'22';
    ctx.fill();
    ctx.strokeStyle=polyColors[pi];
    ctx.lineWidth=2;
    ctx.stroke();

    c.scores.forEach((s,i)=>{
      const angle=(Math.PI*2*i/n)-Math.PI/2;
      const r=maxR*(s/5);
      const x=cx+Math.cos(angle)*r;
      const y=cy+Math.sin(angle)*r;
      ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);
      ctx.fillStyle=polyColors[pi];ctx.fill();
    });
  });

  const legendY=H-40;
  selected.forEach((si,pi)=>{
    const c=FACILITY_CENTERS[si];
    if(!c)return;
    const lx=40+pi*180;
    ctx.fillStyle=polyColors[pi];
    ctx.beginPath();ctx.roundRect(lx,legendY,14,14,3);ctx.fill();
    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 12px system-ui';
    ctx.textAlign='left';
    ctx.fillText(c.name,lx+20,legendY+12);
  });

  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 6. 수강 로드맵 플래너 Canvas (12주)
// ═══════════════════════════════════════
const ROADMAP_TEMPLATES=[
  {name:'수영 마스터',weeks:12,milestones:['물적응','발차기','팔동작','호흡법','배영','평영','접영','턴기술','스타트/턴','온동작','스피드훈련','자유형']},
  {name:'피아노 입문',weeks:12,milestones:['건반위치','도레미','손모양','양손독립','화성기초','체르니','스케일','아르페지오','페달','표현력','반주곡','발표회']},
  {name:'요가 기초',weeks:12,milestones:['호흡법','워밍업','선자세','전사자세','후굴자세','밸런스','역전사','비틀기','플로우','명상','시퀀스','자유수련']},
  {name:'미술 입문',weeks:12,milestones:['연필스케치','명암','색채학','수채화','아크릴','유화','풍경','인물','정물','쳔상','개인스타일','전시회']},
  {name:'댓스 입문',weeks:12,milestones:['기본스텝','리듬감','아이솔레이션','턴악','바디웨이브','코레오','파트너워크','프리스타일','안무','퍼포먼스','스테이지','발표회']},
  {name:'요리 기초',weeks:12,milestones:['칼질법','기본양념','볶음밥','국물/찌개','볶음반찬','양식기초','제빵','한식디저트','파스타','일식','코스요리','파티요리']}
];

function openRoadmapPlanner(){
  SFX12.play('roadmap_set');
  trackFeature12('roadmap');
  checkAchieve12('roadmap_planner');

  const{modal,box}=makeModal12('&#128506; &#49688;&#44053; &#47196;&#46300;&#47605; &#54540;&#47000;&#45320;','12&#51452; &#54617;&#49845; &#47196;&#46300;&#47605;&#51012; &#49444;&#44228;&#54616;&#44256; &#51652;&#54665;&#51012; &#52628;&#51201;&#54633;&#45768;&#45796;');

  const progress=lsGet('cc-v12-roadmap',{});

  const tabDiv=ce('div',{style:{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'12px'}});
  let activeRoadmap=0;

  ROADMAP_TEMPLATES.forEach((t,i)=>{
    const btn=ce('button',{style:{
      padding:'6px 14px',borderRadius:'8px',fontSize:'11px',fontWeight:'600',cursor:'pointer',
      border:'1px solid '+(i===0?'var(--accent)':'var(--card-border)'),
      background:i===0?'rgba(126,200,227,0.12)':'var(--card-bg)',
      color:i===0?'var(--accent)':'var(--text-secondary)',transition:'all .2s'
    },onClick:()=>{
      activeRoadmap=i;
      tabDiv.querySelectorAll('button').forEach((b,bi)=>{
        b.style.borderColor=bi===i?'var(--accent)':'var(--card-border)';
        b.style.background=bi===i?'rgba(126,200,227,0.12)':'var(--card-bg)';
        b.style.color=bi===i?'var(--accent)':'var(--text-secondary)';
      });
      drawRoadmap();
    }},esc(t.name));
    tabDiv.appendChild(btn);
  });
  box.appendChild(tabDiv);

  const canvas=ce('canvas',{width:660,height:400,style:{width:'100%',height:'auto',borderRadius:'12px'}});
  box.appendChild(canvas);

  canvas.addEventListener('click',e=>{
    const rect=canvas.getBoundingClientRect();
    const scaleX=660/rect.width;
    const mx=(e.clientX-rect.left)*scaleX;
    const my=(e.clientY-rect.top)*(400/rect.height);

    const t=ROADMAP_TEMPLATES[activeRoadmap];
    const startX=50,startY=70,stepW=50,stepH=55;
    const cols=6;

    t.milestones.forEach((m,i)=>{
      const row=Math.floor(i/cols);
      const col=row%2===0?i%cols:(cols-1-i%cols);
      const x=startX+col*stepW*2;
      const y=startY+row*stepH*2;
      if(mx>=x-20&&mx<=x+20&&my>=y-20&&my<=y+20){
        const key=activeRoadmap+'-'+i;
        progress[key]=!progress[key];
        lsSet('cc-v12-roadmap',progress);
        SFX12.play('roadmap_set');

        const completed=t.milestones.filter((_,j)=>progress[activeRoadmap+'-'+j]).length;
        if(completed>=t.milestones.length){
          const done=lsGet('cc-v12-roadmap-done',0);
          lsSet('cc-v12-roadmap-done',done+1);
          if(done+1>=3)checkAchieve12('roadmap_master');
        }
        drawRoadmap();
      }
    });
  });

  function drawRoadmap(){
    const ctx=canvas.getContext('2d');
    const W=660,H=400;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    const t=ROADMAP_TEMPLATES[activeRoadmap];
    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 16px system-ui';
    ctx.textAlign='center';
    ctx.fillText(t.name+' 12주 로드맵',W/2,28);

    const completed=t.milestones.filter((_,j)=>progress[activeRoadmap+'-'+j]).length;
    const pct=Math.round(completed/t.milestones.length*100);

    const barW=W-100,barH=12,barX=50,barY=42;
    ctx.fillStyle='rgba(255,255,255,0.05)';
    ctx.beginPath();ctx.roundRect(barX,barY,barW,barH,6);ctx.fill();
    const barColor=pct>=80?'#22C55E':pct>=40?'#F59E0B':'#3B82F6';
    const grd=ctx.createLinearGradient(barX,0,barX+barW*(pct/100),0);
    grd.addColorStop(0,barColor+'CC');grd.addColorStop(1,barColor+'66');
    ctx.fillStyle=grd;
    ctx.beginPath();ctx.roundRect(barX,barY,barW*(pct/100),barH,6);ctx.fill();

    ctx.fillStyle=isDark()?'rgba(255,255,255,0.6)':'#64748B';
    ctx.font='11px system-ui';
    ctx.textAlign='right';
    ctx.fillText(pct+'% ('+completed+'/'+t.milestones.length+')',W-20,barY+10);

    const startX=50,startY=90,stepW=50,stepH=55;
    const cols=6;

    t.milestones.forEach((m,i)=>{
      const row=Math.floor(i/cols);
      const col=row%2===0?i%cols:(cols-1-i%cols);
      const x=startX+col*stepW*2;
      const y=startY+row*stepH*2;
      const done=!!progress[activeRoadmap+'-'+i];

      if(i<t.milestones.length-1){
        const ni=i+1;
        const nrow=Math.floor(ni/cols);
        const ncol=nrow%2===0?ni%cols:(cols-1-ni%cols);
        const nx=startX+ncol*stepW*2;
        const ny=startY+nrow*stepH*2;
        ctx.beginPath();
        ctx.moveTo(x,y);
        if(nrow!==row){
          ctx.lineTo(x,ny);ctx.lineTo(nx,ny);
        }else{
          ctx.lineTo(nx,ny);
        }
        ctx.strokeStyle=done?'#22C55E55':'rgba(255,255,255,0.08)';
        ctx.lineWidth=2;
        ctx.setLineDash(done?[]:[4,4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);
      ctx.fillStyle=done?'#22C55E33':'rgba(255,255,255,0.04)';
      ctx.fill();
      ctx.strokeStyle=done?'#22C55E':'rgba(255,255,255,0.15)';
      ctx.lineWidth=2;
      ctx.stroke();

      ctx.fillStyle=done?(isDark()?'#22C55E':'#16A34A'):(isDark()?'rgba(255,255,255,0.6)':'#64748B');
      ctx.font=(done?'bold ':'')+'9px system-ui';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText(m,x,y);

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.3)':'#94A3B8';
      ctx.font='8px system-ui';
      ctx.fillText((i+1)+'주',x,y+26);
    });
  }

  drawRoadmap();
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 7. 학습 통계 인포그래픽 Canvas PNG
// ═══════════════════════════════════════
function openInfographic(){
  SFX12.play('infographic_gen');
  trackFeature12('infographic');
  checkAchieve12('infographic_gen');

  const{modal,box}=makeModal12('&#128202; &#54617;&#49845; &#53685;&#44228; &#51064;&#54252;&#44536;&#47000;&#54589;','&#45208;&#47564;&#51032; &#54617;&#49845; &#53685;&#44228; &#52852;&#46300;&#47484; &#49373;&#49457;&#54633;&#45768;&#45796; (PNG &#45796;&#50868;&#47196;&#46300;)');

  const canvas=ce('canvas',{width:600,height:440,style:{width:'100%',height:'auto',borderRadius:'12px'}});
  box.appendChild(canvas);

  const achieveV4=lsGet('cc-achievements',[]).length;
  const achieveV5=lsGet('cc-achieve-v5',[]).length;
  const achieveV6=lsGet('cc-achieve-v6',[]).length;
  const achieveV7=lsGet('cc-achieve-v7',[]).length;
  const achieveV8=lsGet('cc-achieve-v8',[]).length;
  const achieveV9=lsGet('cc-achieve-v9',[]).length;
  const achieveV10=lsGet('cc-achieve-v10',[]).length;
  const achieveV11=lsGet('cc-achieve-v11',[]).length;
  const achieveV12=lsGet('cc-achieve-v12',[]).length;
  const totalAchieve=achieveV4+achieveV5+achieveV6+achieveV7+achieveV8+achieveV9+achieveV10+achieveV11+achieveV12;

  const favs=lsGet('cc-favorites',[]).length;
  const scheduleCount=Object.keys(lsGet('cc-v12-schedule',{})).length;
  const bookmarks=lsGet('cc-bookmarks-v9',[]).length;
  const quizBest=lsGet('cc-quiz-best',0);
  const roadmapDone=lsGet('cc-v12-roadmap-done',0);
  const streakDays=lsGet('cc-streak-v6',{current:0}).current||0;
  const featuresUsed=lsGet('cc-v12-features-used',[]).length;

  const ctx=canvas.getContext('2d');
  const W=600,H=440;

  const grad=ctx.createLinearGradient(0,0,W,H);
  grad.addColorStop(0,'#0C1525');
  grad.addColorStop(0.5,'#1A365D');
  grad.addColorStop(1,'#0C1525');
  ctx.fillStyle=grad;
  ctx.beginPath();ctx.roundRect(0,0,W,H,16);ctx.fill();

  ctx.strokeStyle='rgba(126,200,227,0.3)';
  ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(0,0,W,H,16);ctx.stroke();

  ctx.fillStyle='#7EC8E3';
  ctx.font='bold 22px system-ui';
  ctx.textAlign='center';
  ctx.fillText('문화센터 파인더 학습 통계',W/2,36);

  ctx.fillStyle='rgba(255,255,255,0.5)';
  ctx.font='12px system-ui';
  ctx.fillText(fmtDate12()+' 기준',W/2,56);

  const stats=[
    {label:'업적 달성',value:totalAchieve+'개',icon:'🏆',color:'#FFD700'},
    {label:'즐겨찾기',value:favs+'개',icon:'⭐',color:'#F59E0B'},
    {label:'스케줄',value:scheduleCount+'강좌',icon:'📅',color:'#3B82F6'},
    {label:'북마크',value:bookmarks+'개',icon:'🔖',color:'#22C55E'},
    {label:'퀀즈 최고',value:quizBest+'점',icon:'🎓',color:'#A855F7'},
    {label:'로드맵 완료',value:roadmapDone+'개',icon:'🗺️',color:'#EC4899'},
    {label:'연속 학습',value:streakDays+'일',icon:'🔥',color:'#EF4444'},
    {label:'v12 기능',value:featuresUsed+'/8',icon:'✨',color:'#06B6D4'}
  ];

  stats.forEach((s,i)=>{
    const col=i%4;
    const row=Math.floor(i/4);
    const x=30+col*140;
    const y=76+row*100;
    const w=128,h=86;

    ctx.fillStyle=s.color+'15';
    ctx.strokeStyle=s.color+'33';
    ctx.lineWidth=1;
    ctx.beginPath();ctx.roundRect(x,y,w,h,12);ctx.fill();ctx.stroke();

    ctx.font='28px system-ui';
    ctx.textAlign='center';
    ctx.fillText(s.icon,x+w/2,y+30);

    ctx.fillStyle='#fff';
    ctx.font='bold 18px system-ui';
    ctx.fillText(s.value,x+w/2,y+56);

    ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.font='11px system-ui';
    ctx.fillText(s.label,x+w/2,y+74);
  });

  const grade=totalAchieve>=50?'S':totalAchieve>=30?'A':totalAchieve>=15?'B':totalAchieve>=5?'C':'D';
  const gradeColor=grade==='S'?'#FFD700':grade==='A'?'#22C55E':grade==='B'?'#3B82F6':grade==='C'?'#F59E0B':'#EF4444';

  ctx.fillStyle=gradeColor+'22';
  ctx.strokeStyle=gradeColor;
  ctx.lineWidth=3;
  ctx.beginPath();ctx.arc(W/2,340,45,0,Math.PI*2);ctx.fill();ctx.stroke();

  ctx.fillStyle=gradeColor;
  ctx.font='bold 42px system-ui';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText(grade,W/2,342);

  ctx.fillStyle='rgba(255,255,255,0.5)';
  ctx.font='12px system-ui';
  ctx.textBaseline='alphabetic';
  ctx.fillText('종합 등급',W/2,400);

  ctx.fillStyle='rgba(126,200,227,0.3)';
  ctx.font='10px system-ui';
  ctx.fillText('PRIME Holdings · 문화센터 파인더 v12.0',W/2,428);

  const dlDiv=ce('div',{style:{display:'flex',gap:'8px',justifyContent:'center',marginTop:'12px'}});
  const dlBtn=ce('button',{style:{
    padding:'10px 20px',background:'linear-gradient(135deg,#7EC8E3,#3AAFA9)',border:'none',
    borderRadius:'10px',color:'#fff',fontSize:'13px',fontWeight:'700',cursor:'pointer'
  },onClick:()=>{
    const a=document.createElement('a');
    a.download='문화센터-학습통계-'+fmtDate12()+'.png';
    a.href=canvas.toDataURL('image/png');
    a.click();
    showToast12('&#128190; PNG 다운로드 완료');
  }},'&#128190; PNG &#45796;&#50868;&#47196;&#46300;');

  const copyBtn=ce('button',{style:{
    padding:'10px 20px',background:'var(--input-bg)',border:'1px solid var(--input-border)',
    borderRadius:'10px',color:'var(--text)',fontSize:'13px',fontWeight:'600',cursor:'pointer'
  },onClick:()=>{
    canvas.toBlob(blob=>{
      if(blob&&navigator.clipboard&&navigator.clipboard.write){
        navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(()=>{
          showToast12('&#128203; 클립보드에 복사 완료');
        });
      }else{
        showToast12('⚠ 복사 미지원 브라우저');
      }
    },'image/png');
  }},'&#128203; &#53364;&#47549;&#48372;&#46300; &#48373;&#49324;');

  dlDiv.appendChild(dlBtn);
  dlDiv.appendChild(copyBtn);
  box.appendChild(dlDiv);

  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 8. 수강 버킷리스트 (20종)
// ═══════════════════════════════════════
const BUCKET_PRESETS=[
  {name:'수영 자유형 마스터',icon:'🏊',category:'운동'},
  {name:'피아노 발표회 참가',icon:'🎹',category:'음악'},
  {name:'요가 자격증 취득',icon:'🧘',category:'운동'},
  {name:'유화 개인전 개최',icon:'🎨',category:'예술'},
  {name:'발레 공연 무대',icon:'🩰',category:'운동'},
  {name:'요리 대회 참가',icon:'🍳',category:'생활'},
  {name:'영어 토익 900+',icon:'🌍',category:'어학'},
  {name:'서예 전시회 출품',icon:'✏️',category:'예술'},
  {name:'댓스 발표회 무대',icon:'💃',category:'운동'},
  {name:'태권도 단증 승급',icon:'🥋',category:'운동'},
  {name:'플라워 작품 선물',icon:'🌼',category:'예술'},
  {name:'필라테스 100회 출석',icon:'🤸',category:'운동'},
  {name:'베이킹 캐이크 완성',icon:'🎂',category:'생활'},
  {name:'사진 개인전 개최',icon:'📷',category:'예술'},
  {name:'도예 작품 완성',icon:'🏺',category:'예수'},
  {name:'기타 커버곡 녹음',icon:'🎸',category:'음악'},
  {name:'수채화 작품 10점',icon:'🖼️',category:'예술'},
  {name:'명상 100시간 달성',icon:'🧘‍♂️',category:'자기계발'},
  {name:'한국무용 배우기',icon:'🎭',category:'예술'},
  {name:'3개월 연속 수강 달성',icon:'🔥',category:'자기계발'}
];

function openBucketList(){
  SFX12.play('bucket_add');
  trackFeature12('bucket');

  const{modal,box}=makeModal12('&#128173; &#49688;&#44053; &#48260;&#53431;&#47532;&#49828;&#53944;','&#44844;&#48176;&#50864;&#44256; &#49910;&#51008; &#44053;&#51340; &#47785;&#54364;&#47484; &#44288;&#47532;&#54633;&#45768;&#45796;');

  const buckets=lsGet('cc-v12-buckets',BUCKET_PRESETS.map(b=>({...b,done:false,addedDate:fmtDate12()})));

  const statsDiv=ce('div',{style:{display:'flex',gap:'12px',marginBottom:'16px'}});
  function updateStats(){
    const done=buckets.filter(b=>b.done).length;
    const total=buckets.length;
    statsDiv.innerHTML='<div style="flex:1;background:var(--stat-card-bg);border:1px solid var(--stat-card-border);border-radius:10px;padding:10px;text-align:center">'+
      '<div style="font-size:22px;font-weight:900;color:var(--accent)">'+done+'/'+total+'</div>'+
      '<div style="font-size:10px;color:var(--text-muted)">&#50756;&#47308;</div></div>'+
      '<div style="flex:1;background:var(--stat-card-bg);border:1px solid var(--stat-card-border);border-radius:10px;padding:10px;text-align:center">'+
      '<div style="font-size:22px;font-weight:900;color:#22C55E">'+Math.round(done/total*100)+'%</div>'+
      '<div style="font-size:10px;color:var(--text-muted)">&#45804;&#49457;&#47456;</div></div>'+
      '<div style="flex:1;background:var(--stat-card-bg);border:1px solid var(--stat-card-border);border-radius:10px;padding:10px;text-align:center">'+
      '<div style="font-size:22px;font-weight:900;color:#F59E0B">'+(total-done)+'</div>'+
      '<div style="font-size:10px;color:var(--text-muted)">&#45224;&#51008; &#47785;&#54364;</div></div>';
  }
  box.appendChild(statsDiv);
  updateStats();

  const addDiv=ce('div',{style:{display:'flex',gap:'8px',marginBottom:'12px'}});
  const addInput=ce('input',{type:'text',placeholder:'새로운 목표 추가...',style:{
    flex:'1',background:'var(--input-bg)',border:'1px solid var(--input-border)',borderRadius:'8px',
    padding:'8px 12px',color:'var(--text)',fontSize:'13px'
  }});
  const addBtn=ce('button',{style:{
    padding:'8px 16px',background:'linear-gradient(135deg,#7EC8E3,#3AAFA9)',border:'none',
    borderRadius:'8px',color:'#fff',fontSize:'13px',fontWeight:'700',cursor:'pointer'
  },onClick:()=>{
    const text=addInput.value.trim();
    if(!text)return;
    buckets.push({name:text,icon:'⭐',category:'사용자',done:false,addedDate:fmtDate12()});
    lsSet('cc-v12-buckets',buckets);
    addInput.value='';
    renderList();
    updateStats();
    SFX12.play('bucket_add');
  }},'+ &#52628;&#44032;');
  addDiv.appendChild(addInput);
  addDiv.appendChild(addBtn);
  box.appendChild(addDiv);

  const listDiv=ce('div',{style:{maxHeight:'50vh',overflowY:'auto'}});
  box.appendChild(listDiv);

  function renderList(){
    listDiv.innerHTML='';
    const doneCount=buckets.filter(b=>b.done).length;
    if(doneCount>=3)checkAchieve12('bucket_dreamer');

    buckets.forEach((b,i)=>{
      const item=ce('div',{style:{
        display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',
        background:b.done?'rgba(34,197,94,0.06)':'var(--card-bg)',
        border:'1px solid '+(b.done?'rgba(34,197,94,0.2)':'var(--card-border)'),
        borderRadius:'10px',marginBottom:'6px',transition:'all .2s',cursor:'pointer'
      }});

      const check=ce('button',{style:{
        width:'24px',height:'24px',borderRadius:'50%',border:'2px solid '+(b.done?'#22C55E':'var(--card-border)'),
        background:b.done?'#22C55E':'transparent',color:'#fff',fontSize:'14px',cursor:'pointer',
        display:'flex',alignItems:'center',justifyContent:'center',flexShrink:'0'
      },onClick:e=>{
        e.stopPropagation();
        b.done=!b.done;
        lsSet('cc-v12-buckets',buckets);
        renderList();
        updateStats();
        SFX12.play(b.done?'achieve_v12':'bucket_add');
      }},b.done?'&#10003;':'');

      const info=ce('div',{style:{flex:'1'}});
      info.innerHTML='<div style="font-size:14px;font-weight:600;color:var(--text-primary);'+(b.done?'text-decoration:line-through;opacity:0.6;':'')+'">'+
        b.icon+' '+esc(b.name)+'</div>'+
        '<div style="font-size:10px;color:var(--text-muted);margin-top:2px">'+esc(b.category)+' &middot; '+esc(b.addedDate)+'</div>';

      const delBtn=ce('button',{style:{
        background:'none',border:'none',color:'var(--text-muted)',fontSize:'16px',cursor:'pointer',
        padding:'4px',opacity:'0.5',transition:'opacity .2s'
      },onClick:e=>{
        e.stopPropagation();
        buckets.splice(i,1);
        lsSet('cc-v12-buckets',buckets);
        renderList();
        updateStats();
      }},'&#128465;');
      delBtn.addEventListener('mouseenter',()=>{delBtn.style.opacity='1';delBtn.style.color='#EF4444';});
      delBtn.addEventListener('mouseleave',()=>{delBtn.style.opacity='0.5';delBtn.style.color='var(--text-muted)';});

      item.appendChild(check);
      item.appendChild(info);
      item.appendChild(delBtn);
      listDiv.appendChild(item);
    });
  }

  renderList();
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 퀴즈 v12 (+15문, 105→120)
// ═══════════════════════════════════════
const QUIZ_V12=[
  {q:'문화센터 파인더에서 수강 스케줄 최적화에서 감지하는 것은?',a:['시간 충돌','비용 초과','강사 부족','교통 혼잡'],ans:0},
  {q:'강좌 매칭 성향 테스트는 몇 문항인가?',a:['5문항','8문항','10문항','15문항'],ans:2},
  {q:'센터 시설 비교기에서 사용하는 차트 유형은?',a:['파이차트','레이더차트','바차트','꼬은선 그래프'],ans:1},
  {q:'수강 로드맵 플래너의 기본 기간은?',a:['4주','8주','12주','16주'],ans:2},
  {q:'학습 그룹 매칭 시뮬레이터의 그룹 인원수는?',a:['최대 2명','최대 4명','최대 6명','최대 8명'],ans:1},
  {q:'강좌 리뷰 랭킹 1위 강좌는?',a:['피아노','요가','수영','미술'],ans:2},
  {q:'수강 버킷리스트의 기본 프리셋 목표 수는?',a:['10개','15개','20개','25개'],ans:2},
  {q:'학습 통계 인포그래행에서 등급 S를 받으려면 업적 몇 개 이상?',a:['30개','40개','50개','60개'],ans:2},
  {q:'v12에서 추가된 업적 수는?',a:['8개','10개','12개','15개'],ans:2},
  {q:'센터 시설 비교기의 평가 축 수는?',a:['4축','5축','6축','8축'],ans:2},
  {q:'로드맵 플래너에서 수영 로드맵의 첫 번째 단계는?',a:['발차기','물적응','호흡법','팔동작'],ans:1},
  {q:'스케줄 최적화기에서 토요일 시간 슬롯 수는?',a:['4개','6개','8개','9개'],ans:1},
  {q:'강좌 매칭 성향 테스트에서 TOP 몇 개 강좌를 추천하는가?',a:['1개','2개','3개','5개'],ans:2},
  {q:'v12 탐험가 업적을 받으려면 몇 종 기능을 사용해야 하는가?',a:['3종','4종','5종','7종'],ans:2},
  {q:'v12에서 추가된 SFX 효과음 수는?',a:['8종','10종','12종','16종'],ans:2}
];

function openQuizV12(){
  SFX12.play('quiz_v12');
  trackFeature12('quiz');
  checkAchieve12('quiz_v12_try');

  const{modal,box}=makeModal12('&#127891; &#47928;&#54868;&#49468;&#53552; &#53472;&#51592; v12','v12 &#49888;&#44508; 15&#47928; &#46020;&#51204;!');

  let qi=0,score=0;
  const shuffled=[...QUIZ_V12].sort(()=>Math.random()-0.5);

  const canvas=ce('canvas',{width:560,height:300,style:{width:'100%',height:'auto',borderRadius:'12px'}});
  box.appendChild(canvas);

  const ansDiv=ce('div',{style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginTop:'12px'}});
  box.appendChild(ansDiv);

  function drawQ(){
    const ctx=canvas.getContext('2d');
    const W=560,H=300;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    if(qi>=shuffled.length){
      drawResult(ctx,W,H);
      return;
    }

    const q=shuffled[qi];
    ctx.fillStyle=isDark()?'#7EC8E3':'#0EA5E9';
    ctx.font='bold 14px system-ui';
    ctx.textAlign='center';
    ctx.fillText('문제 '+(qi+1)+'/'+shuffled.length,W/2,30);

    const barW=W-80;
    ctx.fillStyle='rgba(255,255,255,0.05)';
    ctx.beginPath();ctx.roundRect(40,40,barW,8,4);ctx.fill();
    const prog=((qi)/shuffled.length)*barW;
    const grd=ctx.createLinearGradient(40,40,40+prog,40);
    grd.addColorStop(0,'#7EC8E3');grd.addColorStop(1,'#3AAFA9');
    ctx.fillStyle=grd;
    ctx.beginPath();ctx.roundRect(40,40,prog,8,4);ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 18px system-ui';
    ctx.textAlign='center';

    const words=q.q.split('');
    let line='',lines=[];
    const maxW=W-80;
    words.forEach(ch=>{
      const test=line+ch;
      if(ctx.measureText(test).width>maxW&&line){
        lines.push(line);line=ch;
      }else{line=test;}
    });
    if(line)lines.push(line);
    lines.forEach((l,li)=>{
      ctx.fillText(l,W/2,100+li*28);
    });

    ctx.fillStyle=isDark()?'#7EC8E3':'#0EA5E9';
    ctx.font='bold 16px system-ui';
    ctx.textAlign='right';
    ctx.fillText('현재 점수: '+score+'점',W-30,H-20);

    ansDiv.innerHTML='';
    q.a.forEach((a,ai)=>{
      const btn=ce('button',{style:{
        padding:'12px',borderRadius:'10px',border:'2px solid var(--card-border)',background:'var(--card-bg)',
        color:'var(--text)',fontSize:'13px',fontWeight:'600',cursor:'pointer',transition:'all .2s',textAlign:'center'
      },onClick:()=>{
        if(ai===q.ans){
          score+=Math.round(100/shuffled.length);
          SFX12.play('quiz_correct12');
          showToast12('&#9989; 정답!');
        }else{
          SFX12.play('quiz_v12');
          showToast12('&#10060; 오답. 정답: '+q.a[q.ans]);
        }
        qi++;
        drawQ();
      }},esc(a));
      btn.addEventListener('mouseenter',()=>{btn.style.borderColor='var(--accent)';btn.style.color='var(--accent)';});
      btn.addEventListener('mouseleave',()=>{btn.style.borderColor='var(--card-border)';btn.style.color='var(--text)';});
      ansDiv.appendChild(btn);
    });
  }

  function drawResult(ctx,W,H){
    ansDiv.innerHTML='';
    const grade=score>=90?'S':score>=75?'A':score>=60?'B':score>=40?'C':'D';
    const gradeColor=grade==='S'?'#FFD700':grade==='A'?'#22C55E':grade==='B'?'#3B82F6':grade==='C'?'#F59E0B':'#EF4444';

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 20px system-ui';
    ctx.textAlign='center';
    ctx.fillText('퀀즈 완료!',W/2,50);

    ctx.fillStyle=gradeColor+'22';
    ctx.strokeStyle=gradeColor;
    ctx.lineWidth=4;
    ctx.beginPath();ctx.arc(W/2,140,55,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.fillStyle=gradeColor;
    ctx.font='bold 48px system-ui';
    ctx.textBaseline='middle';
    ctx.fillText(grade,W/2,140);

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 18px system-ui';
    ctx.textBaseline='alphabetic';
    ctx.fillText(score+'점 / 100점',W/2,230);

    ctx.fillStyle=isDark()?'rgba(255,255,255,0.5)':'#64748B';
    ctx.font='13px system-ui';
    const msg=grade==='S'?'문화센터 마스터!':grade==='A'?'훌륭합니다!':grade==='B'?'잘하고 있어요!':grade==='C'?'조금 더 파이팅!':'도전을 계속해보세요!';
    ctx.fillText(msg,W/2,260);

    const best=lsGet('cc-quiz-best',0);
    if(score>best)lsSet('cc-quiz-best',score);
  }

  drawQ();
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 퀵 액션 버튼 (9종)
// ═══════════════════════════════════════
function insertQuickActions12(){
  const old=document.getElementById('v12-quick-actions');
  if(old)old.remove();

  const wrap=ce('div',{id:'v12-quick-actions',style:{
    position:'fixed',top:'50%',left:'4px',transform:'translateY(-50%)',
    display:'flex',flexDirection:'column',gap:'4px',
    zIndex:'900',opacity:'0.7',transition:'opacity .3s'
  }});
  wrap.addEventListener('mouseenter',()=>{wrap.style.opacity='1';});
  wrap.addEventListener('mouseleave',()=>{wrap.style.opacity='0.7';});

  const actions=[
    {label:'📅스케줄',fn:openScheduleOptimizer},
    {label:'🎯성향',fn:openMatchTest},
    {label:'🤝그룹',fn:openGroupMatching},
    {label:'🏆랭킹',fn:openLeaderboard},
    {label:'🏢시설',fn:openFacilityCompare},
    {label:'🗺️로드맵',fn:openRoadmapPlanner},
    {label:'📊인포',fn:openInfographic},
    {label:'💭버킷',fn:openBucketList},
    {label:'🎓퀀즈v12',fn:openQuizV12}
  ];

  actions.forEach(a=>{
    const btn=ce('button',{className:'v12-qbtn',style:{
      padding:'5px 8px',borderRadius:'8px',border:'1px solid var(--card-border)',
      background:'var(--card-bg)',color:'var(--text-secondary)',fontSize:'10px',
      cursor:'pointer',whiteSpace:'nowrap',transition:'all .2s',backdropFilter:'blur(8px)',
      WebkitBackdropFilter:'blur(8px)'
    },onClick:a.fn},a.label);
    btn.addEventListener('mouseenter',()=>{btn.style.borderColor='var(--accent)';btn.style.color='var(--accent)';btn.style.transform='translateX(4px)';});
    btn.addEventListener('mouseleave',()=>{btn.style.borderColor='var(--card-border)';btn.style.color='var(--text-secondary)';btn.style.transform='none';});
    wrap.appendChild(btn);
  });
  document.body.appendChild(wrap);
}

// ═══════════════════════════════════════
// 키보드 단축키 (8종)
// ═══════════════════════════════════════
function initKeyboard12(){
  document.addEventListener('keydown',e=>{
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;
    if(!e.shiftKey)return;
    const map={
      'S':openScheduleOptimizer,
      'M':openMatchTest,
      'G':openGroupMatching,
      'K':openLeaderboard,
      'F':openFacilityCompare,
      'D':openRoadmapPlanner,
      'I':openInfographic,
      'L':openBucketList
    };
    const fn=map[e.key.toUpperCase()];
    if(fn){
      e.preventDefault();
      const existing=document.getElementById('v12-modal');
      if(existing)existing.remove();
      fn();
    }
  });
}

// ═══════════════════════════════════════
// CSS
// ═══════════════════════════════════════
function injectV12Styles(){
  if(document.getElementById('v12-styles'))return;
  const style=ce('style',{id:'v12-styles'});
  style.textContent='@keyframes v12SlideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}'+
    '@keyframes v12SlideUp{from{transform:translateY(0);opacity:1}to{transform:translateY(-20px);opacity:0}}'+
    '@keyframes v12FadeIn{from{opacity:0}to{opacity:1}}'+
    '@keyframes v12SlideRight{from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}}'+
    '.v12-qbtn:active{transform:scale(0.95)!important}'+
    '#v12-modal::-webkit-scrollbar{width:6px}#v12-modal::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:3px}'+
    'body:has(.modal-overlay) #v12-quick-actions,body:has(.onboarding-overlay) #v12-quick-actions{display:none!important}'+
    '@media(max-width:480px){#v12-quick-actions{top:auto;bottom:70px;left:4px}.v12-qbtn{font-size:9px!important;padding:4px 6px!important}}';
  document.head.appendChild(style);
}

// ═══════════════════════════════════════
// 초기화
// ═══════════════════════════════════════
function init12(){
  injectV12Styles();

  setTimeout(()=>{
    insertQuickActions12();
    initKeyboard12();

    const milestones=lsGet('cc-milestones-v9',[]);
    const today=fmtDate12();
    const hasToday=milestones.some(m=>m.date===today&&m.text.includes('v12'));
    if(!hasToday){
      milestones.unshift({text:'v12.0 업데이트 적용',date:today,time:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})});
      if(milestones.length>50)milestones.pop();
      lsSet('cc-milestones-v9',milestones);
    }

    showToast12('✨ v12.0 스케줄+성향테스트+그룹매칭+랭킹+시설비교+로드맵+인포그래행+버킷리스트+퀀즈v12',3500);
  },6000);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init12);
}else{
  init12();
}

})();
