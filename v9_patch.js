/**
 * culture-center-finder v9.0 patch
 * 학습경로맵Canvas+수강통계레이더Canvas+가격트렌드Canvas+마이러닝포트폴리오Canvas+주간학습플래너+강좌북마크컬렉션+학습마일스톤+접근성패널+강좌추천퀴즈엔진+수강후기월드클라우드+퀴즈15추가(60→75)+업적12추가(66→78)+SFX12종+키보드8종
 */
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

const V9_ID='ccf-v9-patch';
if(document.getElementById(V9_ID))return;
const marker=document.createElement('meta');
marker.id=V9_ID;
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
function showToast9(msg,dur){
  const old=document.getElementById('v9-toast');
  if(old)old.remove();
  const t=ce('div',{id:'v9-toast',style:{
    position:'fixed',top:'20px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#1A365D,#0C1525)',
    border:'1px solid rgba(126,200,227,0.5)',borderRadius:'14px',padding:'12px 24px',zIndex:'970',
    fontSize:'13px',fontWeight:'700',color:'#7EC8E3',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
    animation:'v9SlideDown .3s ease both',whiteSpace:'nowrap',maxWidth:'90vw',overflow:'hidden',textOverflow:'ellipsis'
  }},msg);
  document.body.appendChild(t);
  setTimeout(()=>{t.style.animation='v9SlideUp .3s ease both';setTimeout(()=>t.remove(),300);},dur||2500);
}
function fmtDate9(d){
  if(!d)d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function dateSeed9(off){
  const d=new Date();d.setDate(d.getDate()+(off||0));
  return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate();
}
function seededRand9(seed){
  let s=seed;
  return function(){s=(s*16807+0)%2147483647;return(s-1)/2147483646;};
}
function isDark(){return document.documentElement.getAttribute('data-theme')!=='light';}

// ═══════════════════════════════════════
// SFX 엔진 (12종)
// ═══════════════════════════════════════
const SFX9={
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
      path_open:    {freq:523,type:'sine',dur:0.2,vol:0.12},
      radar_view:   {freq:659,type:'triangle',dur:0.18,vol:0.12},
      price_check:  {freq:698,type:'sine',dur:0.15,vol:0.1},
      portfolio_gen: {freq:880,type:'triangle',dur:0.25,vol:0.14},
      planner_check:{freq:784,type:'sine',dur:0.12,vol:0.1},
      bookmark_add: {freq:587,type:'triangle',dur:0.15,vol:0.12},
      milestone_hit:{freq:932,type:'sine',dur:0.3,vol:0.15},
      access_toggle:{freq:440,type:'triangle',dur:0.12,vol:0.08},
      quiz_v9:      {freq:740,type:'sine',dur:0.18,vol:0.12},
      review_open:  {freq:554,type:'triangle',dur:0.15,vol:0.1},
      achieve_v9:   {freq:988,type:'sine',dur:0.25,vol:0.14},
      wordcloud_gen:{freq:622,type:'triangle',dur:0.2,vol:0.1}
    };
    const p=presets[name]||presets.path_open;
    o.type=p.type;o.frequency.value=p.freq;
    g.gain.setValueAtTime(p.vol,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+p.dur);
    o.start(ctx.currentTime);o.stop(ctx.currentTime+p.dur);
  }
};

// ═══════════════════════════════════════
// 1. 학습 경로 맵 Canvas (12종목)
// ═══════════════════════════════════════
const LEARNING_PATHS=[
  {name:'수영',icon:'&#127946;',stages:['물적응','자유형기초','배영/평영','접영','고급턴','마스터스'],color:'#60A5FA'},
  {name:'피아노',icon:'&#127929;',stages:['음이름읽기','바이엘','체르니100','소나티네','쇼팽에튀드','콩쿠르'],color:'#F472B6'},
  {name:'요가',icon:'&#129496;',stages:['호흡법','기본아사나','중급빈야사','고급균형','아쉬탕가','명상마스터'],color:'#34D399'},
  {name:'미술',icon:'&#127912;',stages:['소묘기초','정물화','인물화','풍경/수채','유화','개인전'],color:'#FBBF24'},
  {name:'댄스',icon:'&#128131;',stages:['기초리듬','기본스텝','안무배우기','프리스타일','팀공연','안무창작'],color:'#A78BFA'},
  {name:'발레',icon:'&#129524;',stages:['바워크','플리에/탕뒤','아다지오','알레그로','변주/솔로','공연무대'],color:'#FB923C'},
  {name:'요리',icon:'&#127859;',stages:['칼질기초','한식기본','양식/중식','베이킹','퓨전요리','셰프도전'],color:'#EF4444'},
  {name:'서예',icon:'&#9997;&#65039;',stages:['붓잡기','해서기초','행서','초서','전각','작품전'],color:'#8B5CF6'},
  {name:'태권도',icon:'&#129352;',stages:['기본동작','품새1-4','품새5-8','겨루기','시범','사범'],color:'#EC4899'},
  {name:'기타',icon:'&#127928;',stages:['코드기초','스트럼밍','핑거피킹','바레코드','리드기타','공연'],color:'#06B6D4'},
  {name:'도예',icon:'&#129521;',stages:['흙반죽','물레기초','성형기법','유약실험','소성/굽기','개인전'],color:'#D97706'},
  {name:'사진',icon:'&#128247;',stages:['카메라기초','구도/노출','인물촬영','풍경/야경','후보정','전시'],color:'#14B8A6'}
];

function openLearningPath(){
  SFX9.play('path_open');
  const progress=lsGet('cc-path-progress-v9',{});
  const modal=ce('div',{id:'v9-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v9FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'680px',width:'92vw',maxHeight:'85vh',overflowY:'auto',position:'relative'
  }});

  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);

  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128506;&#65039; &#54617;&#49845; &#44221;&#47196; &#47589;'));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    '12&#51333;&#47785; &#45800;&#44228;&#48324; &#54617;&#49845; &#47196;&#46300;&#47589;. &#53364;&#47533;&#54616;&#50668; &#51652;&#54665;&#46020;&#47484; &#44592;&#47197;&#54616;&#49464;&#50836;.'));

  const canvas=ce('canvas',{width:640,height:360,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'16px'}});
  box.appendChild(canvas);

  function drawPaths(){
    const ctx=canvas.getContext('2d');
    const W=640,H=360;
    ctx.clearRect(0,0,W,H);

    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    const cols=4,rows=3;
    const cellW=W/cols,cellH=H/rows;

    LEARNING_PATHS.forEach((path,i)=>{
      const col=i%cols,row=Math.floor(i/cols);
      const cx=col*cellW+cellW/2,cy=row*cellH+cellH/2;
      const prog=progress[path.name]||0;
      const pct=prog/path.stages.length;

      ctx.beginPath();
      ctx.arc(cx,cy,38,0,Math.PI*2);
      ctx.fillStyle=isDark()?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.03)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx,cy,38,-Math.PI/2,-Math.PI/2+Math.PI*2*pct);
      ctx.strokeStyle=path.color;
      ctx.lineWidth=4;
      ctx.lineCap='round';
      ctx.stroke();

      ctx.fillStyle=isDark()?'#fff':'#1E293B';
      ctx.font='bold 11px system-ui';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText(path.name,cx,cy-6);

      ctx.fillStyle=path.color;
      ctx.font='bold 10px system-ui';
      ctx.fillText(prog+'/'+path.stages.length,cx,cy+10);

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.3)';
      ctx.font='9px system-ui';
      if(prog<path.stages.length){
        ctx.fillText(path.stages[prog],cx,cy+24);
      } else {
        ctx.fillStyle='#34D399';
        ctx.fillText('COMPLETE',cx,cy+24);
      }
    });
  }
  drawPaths();

  const grid=ce('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:'8px'}});
  LEARNING_PATHS.forEach(path=>{
    const prog=progress[path.name]||0;
    const card=ce('div',{style:{
      background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'12px',
      padding:'10px',cursor:'pointer',transition:'all .2s'
    }});
    card.innerHTML='<div style="font-size:13px;font-weight:700;color:'+path.color+'">'+path.icon+' '+esc(path.name)+'</div>'+
      '<div style="font-size:11px;color:var(--text-secondary);margin-top:4px">'+esc(prog<path.stages.length?path.stages[prog]:'&#50756;&#47308;!')+'</div>'+
      '<div style="background:var(--bar-bg);height:4px;border-radius:2px;margin-top:6px;overflow:hidden">'+
      '<div style="height:100%;width:'+(prog/path.stages.length*100)+'%;background:'+path.color+';border-radius:2px;transition:width .3s"></div></div>';
    card.addEventListener('click',()=>{
      if(prog<path.stages.length){
        progress[path.name]=prog+1;
        lsSet('cc-path-progress-v9',progress);
        SFX9.play('milestone_hit');
        showToast9(path.icon+' '+esc(path.name)+' '+esc(path.stages[prog])+' &#50756;&#47308;!');
        checkAchieve9('path_first');
        if(progress[path.name]>=path.stages.length)checkAchieve9('path_complete');
        let totalDone=0;
        LEARNING_PATHS.forEach(p=>{if((progress[p.name]||0)>=p.stages.length)totalDone++;});
        if(totalDone>=6)checkAchieve9('path_half');
        if(totalDone>=12)checkAchieve9('path_master');
        modal.remove();
        openLearningPath();
      }
    });
    card.addEventListener('mouseenter',()=>{card.style.borderColor='var(--accent)';card.style.transform='translateY(-2px)';});
    card.addEventListener('mouseleave',()=>{card.style.borderColor='var(--card-border)';card.style.transform='none';});
    grid.appendChild(card);
  });
  box.appendChild(grid);
  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 2. 수강 통계 레이더 Canvas (6축)
// ═══════════════════════════════════════
function openStatsRadar(){
  SFX9.play('radar_view');
  const stats=calcUserStats9();
  const modal=ce('div',{id:'v9-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v9FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'520px',width:'92vw',maxHeight:'85vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);
  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128202; &#49688;&#44053; &#53685;&#44228; &#47112;&#51060;&#45908;'));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    '6&#52629; &#54617;&#49845; &#49457;&#52712;&#46020; &#48516;&#49437;'));

  const canvas=ce('canvas',{width:400,height:400,style:{width:'100%',maxWidth:'400px',height:'auto',display:'block',margin:'0 auto 16px',borderRadius:'12px'}});
  box.appendChild(canvas);

  const axes=['&#44160;&#49353;&#54876;&#50857;','&#51600;&#44200;&#52286;&#44592;','&#54617;&#49845;&#51652;&#46020;','&#54140;&#51592;&#52280;&#50668;','&#50629;&#51201;&#45804;&#49457;','&#44592;&#45733;&#54876;&#50857;'];
  const values=[stats.search,stats.bookmark,stats.progress,stats.quiz,stats.achieve,stats.features];

  function drawRadar(){
    const ctx=canvas.getContext('2d');
    const W=400,H=400,cx=W/2,cy=H/2,R=140;
    ctx.clearRect(0,0,W,H);

    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    for(let r=1;r<=5;r++){
      ctx.beginPath();
      for(let i=0;i<6;i++){
        const angle=-Math.PI/2+Math.PI*2*i/6;
        const x=cx+Math.cos(angle)*R*r/5;
        const y=cy+Math.sin(angle)*R*r/5;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.strokeStyle=isDark()?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)';
      ctx.lineWidth=1;
      ctx.stroke();
    }

    for(let i=0;i<6;i++){
      const angle=-Math.PI/2+Math.PI*2*i/6;
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(angle)*R,cy+Math.sin(angle)*R);
      ctx.strokeStyle=isDark()?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)';
      ctx.stroke();

      const lx=cx+Math.cos(angle)*(R+22);
      const ly=cy+Math.sin(angle)*(R+22);
      ctx.fillStyle=isDark()?'#fff':'#1E293B';
      ctx.font='bold 11px system-ui';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText(axes[i],lx,ly);
    }

    ctx.beginPath();
    values.forEach((v,i)=>{
      const angle=-Math.PI/2+Math.PI*2*i/6;
      const val=Math.min(v/100,1);
      const x=cx+Math.cos(angle)*R*val;
      const y=cy+Math.sin(angle)*R*val;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.closePath();
    ctx.fillStyle='rgba(126,200,227,0.2)';
    ctx.fill();
    ctx.strokeStyle='#7EC8E3';
    ctx.lineWidth=2.5;
    ctx.stroke();

    values.forEach((v,i)=>{
      const angle=-Math.PI/2+Math.PI*2*i/6;
      const val=Math.min(v/100,1);
      const x=cx+Math.cos(angle)*R*val;
      const y=cy+Math.sin(angle)*R*val;
      ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);
      ctx.fillStyle='#7EC8E3';ctx.fill();
      ctx.strokeStyle=isDark()?'#0C1525':'#fff';ctx.lineWidth=2;ctx.stroke();
    });

    const avg=Math.round(values.reduce((a,b)=>a+b,0)/6);
    const grade=avg>=90?'S':avg>=75?'A':avg>=60?'B':avg>=40?'C':'D';
    const gradeColor={S:'#FBBF24',A:'#34D399',B:'#60A5FA',C:'#FB923C',D:'#EF4444'}[grade];
    ctx.fillStyle=gradeColor;
    ctx.font='bold 36px system-ui';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(grade,cx,cy-8);
    ctx.fillStyle=isDark()?'rgba(255,255,255,0.5)':'rgba(0,0,0,0.5)';
    ctx.font='11px system-ui';
    ctx.fillText(avg+'&#51216;',cx,cy+16);
  }
  drawRadar();

  const metricsRow=ce('div',{style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px',marginTop:'8px'}});
  axes.forEach((name,i)=>{
    metricsRow.appendChild(ce('div',{style:{
      background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'10px',
      padding:'8px',textAlign:'center'
    }},'<div style="font-size:11px;color:var(--text-secondary)">'+name+'</div>'+
      '<div style="font-size:18px;font-weight:800;color:var(--accent)">'+values[i]+'</div>'));
  });
  box.appendChild(metricsRow);
  modal.appendChild(box);
  document.body.appendChild(modal);
}

function calcUserStats9(){
  const favs=lsGet('cc-favs',{});
  const favCount=Object.keys(favs).length;
  const pathProg=lsGet('cc-path-progress-v9',{});
  let pathTotal=0;
  LEARNING_PATHS.forEach(p=>{pathTotal+=(pathProg[p.name]||0);});
  const achv=lsGet('cc-achieve-v9',{});
  const achvCount=Object.keys(achv).filter(k=>achv[k]).length;
  const notes=lsGet('cc-notes-v8',[]);
  const plans=lsGet('cc-planner-v9',{});
  let planDone=0;
  Object.values(plans).forEach(day=>{if(Array.isArray(day))day.forEach(t=>{if(t.done)planDone++;});});
  const bookmarks=lsGet('cc-bookmarks-v9',[]);
  const quizScore=lsGet('cc-quiz-best-v9',0);

  return{
    search:Math.min(100,favCount*5+10),
    bookmark:Math.min(100,bookmarks.length*8+notes.length*5),
    progress:Math.min(100,Math.round(pathTotal/72*100)),
    quiz:Math.min(100,Math.round(quizScore/75*100)),
    achieve:Math.min(100,Math.round(achvCount/78*100)),
    features:Math.min(100,planDone*5+Object.keys(pathProg).length*8)
  };
}

// ═══════════════════════════════════════
// 3. 가격 트렌드 분석기 Canvas
// ═══════════════════════════════════════
function openPriceTrend(){
  SFX9.play('price_check');
  const modal=ce('div',{id:'v9-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v9FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'640px',width:'92vw',maxHeight:'85vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);
  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128200; &#44032;&#44201; &#53944;&#47116;&#46300; &#48516;&#49437;&#44592;'));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    '&#51333;&#47785;&#48324; &#54217;&#44512; &#49688;&#44053;&#47308; &#52628;&#51060; (6&#44060;&#50900; &#49884;&#48044;&#47112;&#51060;&#49496;)'));

  const canvas=ce('canvas',{width:600,height:320,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'16px'}});
  box.appendChild(canvas);

  const categories=['&#49688;&#50689;','&#54588;&#50500;&#45432;','&#50836;&#44032;','&#48120;&#49696;','&#45828;&#49828;','&#48156;&#47112;','&#50836;&#47532;','&#49436;&#50696;','&#53468;&#44428;&#46020;','&#44592;&#53440;','&#46020;&#50696;','&#49324;&#51652;'];
  const basePrice=[85000,120000,70000,95000,80000,110000,90000,65000,75000,100000,85000,88000];
  const months=['1&#50900;','2&#50900;','3&#50900;','4&#50900;','5&#50900;','6&#50900;'];
  const rng=seededRand9(20260611);
  const priceData=categories.map((_,ci)=>{
    return months.map((_,mi)=>{
      const variation=(rng()-0.5)*0.15;
      const trend=mi*0.02;
      return Math.round(basePrice[ci]*(1+variation+trend));
    });
  });

  let selectedCat=0;
  function drawTrend(){
    const ctx=canvas.getContext('2d');
    const W=600,H=320;
    ctx.clearRect(0,0,W,H);

    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    const padL=60,padR=20,padT=30,padB=50;
    const chartW=W-padL-padR,chartH=H-padT-padB;

    const prices=priceData[selectedCat];
    const minP=Math.min(...prices)*0.9;
    const maxP=Math.max(...prices)*1.1;

    for(let i=0;i<=4;i++){
      const y=padT+chartH*i/4;
      ctx.beginPath();
      ctx.moveTo(padL,y);ctx.lineTo(padL+chartW,y);
      ctx.strokeStyle=isDark()?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)';
      ctx.lineWidth=1;ctx.stroke();

      const val=Math.round(maxP-(maxP-minP)*i/4);
      ctx.fillStyle=isDark()?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.4)';
      ctx.font='10px system-ui';
      ctx.textAlign='right';
      ctx.textBaseline='middle';
      ctx.fillText((val/10000).toFixed(1)+'&#47564;',padL-8,y);
    }

    months.forEach((m,i)=>{
      const x=padL+chartW*i/(months.length-1);
      ctx.fillStyle=isDark()?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.4)';
      ctx.font='10px system-ui';
      ctx.textAlign='center';
      ctx.textBaseline='top';
      ctx.fillText(m,x,H-padB+8);
    });

    const grad=ctx.createLinearGradient(0,padT,0,padT+chartH);
    grad.addColorStop(0,'rgba(126,200,227,0.3)');
    grad.addColorStop(1,'rgba(126,200,227,0)');
    ctx.beginPath();
    prices.forEach((p,i)=>{
      const x=padL+chartW*i/(prices.length-1);
      const y=padT+chartH*(1-(p-minP)/(maxP-minP));
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    const lastX=padL+chartW;
    ctx.lineTo(lastX,padT+chartH);
    ctx.lineTo(padL,padT+chartH);
    ctx.closePath();
    ctx.fillStyle=grad;
    ctx.fill();

    ctx.beginPath();
    prices.forEach((p,i)=>{
      const x=padL+chartW*i/(prices.length-1);
      const y=padT+chartH*(1-(p-minP)/(maxP-minP));
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.strokeStyle='#7EC8E3';ctx.lineWidth=2.5;ctx.stroke();

    prices.forEach((p,i)=>{
      const x=padL+chartW*i/(prices.length-1);
      const y=padT+chartH*(1-(p-minP)/(maxP-minP));
      ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);
      ctx.fillStyle='#7EC8E3';ctx.fill();
      ctx.strokeStyle=isDark()?'#0C1525':'#fff';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle=isDark()?'#fff':'#1E293B';
      ctx.font='bold 10px system-ui';
      ctx.textAlign='center';
      ctx.fillText((p/10000).toFixed(1)+'&#47564;',x,y-14);
    });

    const change=((prices[5]-prices[0])/prices[0]*100).toFixed(1);
    const changeColor=change>=0?'#EF4444':'#34D399';
    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 14px system-ui';
    ctx.textAlign='left';
    ctx.fillText(categories[selectedCat]+' &#54217;&#44512; &#49688;&#44053;&#47308;',padL,20);
    ctx.fillStyle=changeColor;
    ctx.font='bold 12px system-ui';
    ctx.textAlign='right';
    ctx.fillText((change>=0?'+':'')+change+'%',W-padR,20);
  }
  drawTrend();

  const catRow=ce('div',{style:{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'12px'}});
  categories.forEach((cat,i)=>{
    const btn=ce('button',{style:{
      padding:'5px 12px',borderRadius:'20px',border:'1px solid '+(i===selectedCat?'var(--accent)':'var(--card-border)'),
      background:i===selectedCat?'rgba(126,200,227,0.15)':'var(--card-bg)',
      color:i===selectedCat?'var(--accent)':'var(--text-secondary)',fontSize:'12px',cursor:'pointer',
      fontWeight:i===selectedCat?'700':'500',transition:'all .2s'
    }},cat);
    btn.addEventListener('click',()=>{
      selectedCat=i;
      drawTrend();
      catRow.querySelectorAll('button').forEach((b,j)=>{
        b.style.borderColor=j===i?'var(--accent)':'var(--card-border)';
        b.style.background=j===i?'rgba(126,200,227,0.15)':'var(--card-bg)';
        b.style.color=j===i?'var(--accent)':'var(--text-secondary)';
        b.style.fontWeight=j===i?'700':'500';
      });
    });
    catRow.appendChild(btn);
  });
  box.appendChild(catRow);

  const summary=ce('div',{style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px'}});
  const avgAll=Math.round(priceData.reduce((s,d)=>s+d[5],0)/12);
  const cheapest=categories[priceData.reduce((mi,d,i,a)=>d[5]<a[mi][5]?i:mi,0)];
  const expensive=categories[priceData.reduce((mi,d,i,a)=>d[5]>a[mi][5]?i:mi,0)];
  [{label:'&#51204;&#52404; &#54217;&#44512;',val:(avgAll/10000).toFixed(1)+'&#47564;&#50896;'},{label:'&#52572;&#51200; &#51333;&#47785;',val:cheapest},{label:'&#52572;&#44256; &#51333;&#47785;',val:expensive}].forEach(m=>{
    summary.appendChild(ce('div',{style:{
      background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'10px',padding:'10px',textAlign:'center'
    }},'<div style="font-size:11px;color:var(--text-secondary)">'+m.label+'</div><div style="font-size:15px;font-weight:800;color:var(--accent);margin-top:2px">'+m.val+'</div>'));
  });
  box.appendChild(summary);
  modal.appendChild(box);
  document.body.appendChild(modal);
  checkAchieve9('price_analyst');
}

// ═══════════════════════════════════════
// 4. 마이러닝 포트폴리오 Canvas
// ═══════════════════════════════════════
function openPortfolio(){
  SFX9.play('portfolio_gen');
  const modal=ce('div',{id:'v9-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v9FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'640px',width:'92vw',maxHeight:'85vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);
  box.appendChild(ce('h2',{style:{margin:'0 0 16px',fontSize:'20px',color:'var(--accent)'}},
    '&#127891; &#47560;&#51060;&#47084;&#45789; &#54252;&#53944;&#54260;&#47532;&#50724;'));

  const canvas=ce('canvas',{width:600,height:380,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'16px'}});
  box.appendChild(canvas);

  const stats=calcUserStats9();
  const pathProg=lsGet('cc-path-progress-v9',{});
  const achv=lsGet('cc-achieve-v9',{});
  const achvCount=Object.keys(achv).filter(k=>achv[k]).length;
  const streak=lsGet('cc-streak-v8',{current:0,best:0});
  const favs=lsGet('cc-favs',{});
  const favCount=Object.keys(favs).length;

  function drawPortfolio(){
    const ctx=canvas.getContext('2d');
    const W=600,H=380;
    ctx.clearRect(0,0,W,H);

    const grad=ctx.createLinearGradient(0,0,W,H);
    grad.addColorStop(0,isDark()?'#0F172A':'#E0F2FE');
    grad.addColorStop(1,isDark()?'#1E3A5F':'#BAE6FD');
    ctx.beginPath();ctx.roundRect(0,0,W,H,16);ctx.fillStyle=grad;ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#0F172A';
    ctx.font='bold 22px system-ui';
    ctx.textAlign='left';
    ctx.fillText('My Learning Portfolio',30,40);

    ctx.fillStyle=isDark()?'rgba(255,255,255,0.5)':'rgba(0,0,0,0.4)';
    ctx.font='12px system-ui';
    ctx.fillText(fmtDate9()+' &#44592;&#51456;',30,60);

    const metrics=[
      {label:'&#51600;&#44200;&#52286;&#44592;',val:favCount+'&#44060;',icon:'&#9733;',color:'#FBBF24'},
      {label:'&#54617;&#49845;&#44221;&#47196;',val:Object.keys(pathProg).length+'&#44284;&#47785;',icon:'&#128506;&#65039;',color:'#34D399'},
      {label:'&#50629;&#51201;',val:achvCount+'/78',icon:'&#127942;',color:'#A78BFA'},
      {label:'&#50672;&#49549;&#54617;&#49845;',val:streak.current+'&#51068;',icon:'&#128293;',color:'#FB923C'},
      {label:'&#52572;&#51109;&#49828;&#53944;&#47533;',val:streak.best+'&#51068;',icon:'&#9889;',color:'#60A5FA'},
      {label:'&#51333;&#54633;&#51216;&#49688;',val:Math.round((stats.search+stats.bookmark+stats.progress+stats.quiz+stats.achieve+stats.features)/6),icon:'&#128175;',color:'#EC4899'}
    ];
    metrics.forEach((m,i)=>{
      const col=i%3,row=Math.floor(i/3);
      const x=30+col*190,y=80+row*80;
      ctx.fillStyle=isDark()?'rgba(255,255,255,0.06)':'rgba(255,255,255,0.5)';
      ctx.beginPath();ctx.roundRect(x,y,175,65,10);ctx.fill();
      ctx.strokeStyle=isDark()?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.08)';
      ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle=isDark()?'#fff':'#0F172A';
      ctx.font='bold 20px system-ui';
      ctx.textAlign='left';
      ctx.fillText(String(m.val),x+14,y+28);
      ctx.fillStyle=isDark()?'rgba(255,255,255,0.5)':'rgba(0,0,0,0.5)';
      ctx.font='11px system-ui';
      ctx.fillText(m.label,x+14,y+48);
      ctx.fillStyle=m.color;
      ctx.font='18px system-ui';
      ctx.textAlign='right';
      ctx.fillText(m.icon,x+160,y+30);
    });

    let activePaths=[];
    LEARNING_PATHS.forEach(p=>{if(pathProg[p.name]>0)activePaths.push(p.name+' '+(pathProg[p.name]||0)+'/'+p.stages.length);});
    if(activePaths.length>0){
      ctx.fillStyle=isDark()?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.4)';
      ctx.font='11px system-ui';
      ctx.textAlign='left';
      ctx.fillText('&#54876;&#49457; &#44221;&#47196;: '+activePaths.slice(0,4).join(' | '),30,270);
    }

    ctx.fillStyle=isDark()?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.08)';
    ctx.font='bold 80px system-ui';
    ctx.textAlign='right';
    ctx.fillText('CCF',W-20,H-20);

    ctx.fillStyle=isDark()?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.3)';
    ctx.font='10px system-ui';
    ctx.textAlign='center';
    ctx.fillText('Culture Center Finder v9.0 - PRIME Holdings',W/2,H-12);
  }
  drawPortfolio();

  const actions=ce('div',{style:{display:'flex',gap:'8px',justifyContent:'center'}});
  const dlBtn=ce('button',{style:{
    padding:'10px 20px',borderRadius:'12px',border:'1px solid var(--accent)',
    background:'rgba(126,200,227,0.1)',color:'var(--accent)',fontSize:'13px',fontWeight:'700',cursor:'pointer'
  },onClick:()=>{
    const link=document.createElement('a');
    link.download='my-learning-portfolio.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
    showToast9('&#128190; &#54252;&#53944;&#54260;&#47532;&#50724; PNG &#45796;&#50868;&#47196;&#46300;!');
    checkAchieve9('portfolio_download');
  }},'&#128190; PNG &#45796;&#50868;&#47196;&#46300;');
  actions.appendChild(dlBtn);

  const clipBtn=ce('button',{style:{
    padding:'10px 20px',borderRadius:'12px',border:'1px solid var(--accent2)',
    background:'rgba(58,175,169,0.1)',color:'var(--accent2)',fontSize:'13px',fontWeight:'700',cursor:'pointer'
  },onClick:async()=>{
    try{
      const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));
      await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);
      showToast9('&#128203; &#53364;&#47549;&#48372;&#46300;&#50640; &#48373;&#49324;!');
    }catch(e){showToast9('&#128203; &#48373;&#49324; &#49892;&#54056; - PNG&#51012; &#45796;&#50868;&#47196;&#46300;&#54616;&#49464;&#50836;');}
  }},'&#128203; &#53364;&#47549;&#48372;&#46300;');
  actions.appendChild(clipBtn);
  box.appendChild(actions);
  modal.appendChild(box);
  document.body.appendChild(modal);
  checkAchieve9('portfolio_gen');
}

// ═══════════════════════════════════════
// 5. 주간 학습 플래너
// ═══════════════════════════════════════
const WEEKDAYS=['&#50900;','&#54868;','&#49688;','&#47785;','&#44552;','&#53664;','&#51068;'];
const PLAN_TEMPLATES=[
  '&#49688;&#50689; &#50672;&#49845;','&#54588;&#50500;&#45432; 30&#48516;','&#50836;&#44032; &#49828;&#53944;&#47112;&#52845;','&#48120;&#49696; &#49828;&#52992;&#52824;','&#45828;&#49828; &#44592;&#52488;','&#48156;&#47112; &#48148;&#50892;&#53356;',
  '&#50836;&#47532; &#47112;&#49884;&#54588;','&#49436;&#50696; &#50672;&#49845;','&#53468;&#44428;&#46020; &#54408;&#49352;','&#44592;&#53440; &#53076;&#46300;','&#46020;&#50696; &#49457;&#54805;','&#49324;&#51652; &#52524;&#50689;',
  '&#50501;&#48372; &#51069;&#44592;','&#50672;&#49845;&#51068;&#51648; &#51089;&#49457;','&#49352;&#47196;&#50868; &#44053;&#51340; &#53456;&#49353;'
];

function openPlanner(){
  SFX9.play('planner_check');
  const weekStart=getWeekStart();
  const plans=lsGet('cc-planner-v9',{});
  if(!plans[weekStart]){
    plans[weekStart]=WEEKDAYS.map((_,i)=>{
      const rng2=seededRand9(dateSeed9()+i*7);
      const tasks=[];
      for(let t=0;t<3;t++){
        tasks.push({text:PLAN_TEMPLATES[Math.floor(rng2()*PLAN_TEMPLATES.length)],done:false});
      }
      return tasks;
    });
    lsSet('cc-planner-v9',plans);
  }
  const weekPlan=plans[weekStart];
  const today=new Date().getDay();
  const todayIdx=today===0?6:today-1;

  const modal=ce('div',{id:'v9-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v9FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'700px',width:'92vw',maxHeight:'85vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);
  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128197; &#51452;&#44036; &#54617;&#49845; &#54540;&#47000;&#45320;'));

  let totalTasks=0,doneTasks=0;
  weekPlan.forEach(day=>day.forEach(t=>{totalTasks++;if(t.done)doneTasks++;}));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    weekStart+' &#51452; | &#50756;&#47308; '+doneTasks+'/'+totalTasks+' ('+Math.round(doneTasks/totalTasks*100)+'%)'));

  const progBar=ce('div',{style:{background:'var(--bar-bg)',height:'6px',borderRadius:'3px',marginBottom:'16px',overflow:'hidden'}});
  progBar.appendChild(ce('div',{style:{height:'100%',width:(doneTasks/totalTasks*100)+'%',background:'linear-gradient(90deg,var(--accent),var(--accent2))',borderRadius:'3px',transition:'width .3s'}}));
  box.appendChild(progBar);

  const grid=ce('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'8px'}});
  WEEKDAYS.forEach((dayName,di)=>{
    const isToday=di===todayIdx;
    const dayCard=ce('div',{style:{
      background:isToday?'rgba(126,200,227,0.08)':'var(--card-bg)',
      border:'1px solid '+(isToday?'var(--accent)':'var(--card-border)'),
      borderRadius:'12px',padding:'10px'
    }});
    dayCard.appendChild(ce('div',{style:{
      fontSize:'13px',fontWeight:'700',color:isToday?'var(--accent)':'var(--text)',marginBottom:'8px'
    }},dayName+(isToday?' &#128312;':'')));

    weekPlan[di].forEach((task,ti)=>{
      const taskEl=ce('label',{style:{
        display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',
        color:task.done?'var(--accent2)':'var(--text-secondary)',
        textDecoration:task.done?'line-through':'none',
        cursor:'pointer',marginBottom:'4px',transition:'all .2s'
      }});
      const cb=ce('input',{type:'checkbox'});
      cb.checked=task.done;
      cb.style.accentColor='var(--accent)';
      cb.addEventListener('change',()=>{
        weekPlan[di][ti].done=cb.checked;
        plans[weekStart]=weekPlan;
        lsSet('cc-planner-v9',plans);
        SFX9.play('planner_check');
        taskEl.style.textDecoration=cb.checked?'line-through':'none';
        taskEl.style.color=cb.checked?'var(--accent2)':'var(--text-secondary)';
        let nd=0;weekPlan.forEach(d=>d.forEach(t=>{if(t.done)nd++;}));
        progBar.firstChild.style.width=(nd/totalTasks*100)+'%';
        if(nd>=7)checkAchieve9('plan_7');
        if(nd>=21)checkAchieve9('plan_all');
      });
      taskEl.appendChild(cb);
      taskEl.appendChild(document.createTextNode(task.text));
      dayCard.appendChild(taskEl);
    });
    grid.appendChild(dayCard);
  });
  box.appendChild(grid);
  modal.appendChild(box);
  document.body.appendChild(modal);
  checkAchieve9('planner_open');
}

function getWeekStart(){
  const d=new Date();
  const day=d.getDay();
  const diff=d.getDate()-day+(day===0?-6:1);
  const mon=new Date(d.setDate(diff));
  return fmtDate9(mon);
}

// ═══════════════════════════════════════
// 6. 강좌 북마크 컬렉션
// ═══════════════════════════════════════
function openBookmarks(){
  SFX9.play('bookmark_add');
  const bookmarks=lsGet('cc-bookmarks-v9',[]);

  const modal=ce('div',{id:'v9-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v9FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'600px',width:'92vw',maxHeight:'85vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);
  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128278; &#44053;&#51340; &#48513;&#47560;&#53356; &#52980;&#47113;&#49496;'));

  const folders=['&#128218; &#44288;&#49900;&#44053;&#51340;','&#128150; &#46321;&#47197;&#50696;&#51221;','&#127775; &#52628;&#52380;&#48155;&#51008;','&#128274; &#50756;&#47308;','&#128221; &#47700;&#47784;'];
  const addRow=ce('div',{style:{display:'flex',gap:'8px',marginBottom:'16px',flexWrap:'wrap'}});
  const nameInput=ce('input',{type:'text',placeholder:'&#44053;&#51340;&#47749; &#51077;&#47141;...',style:{
    flex:'1',minWidth:'150px',padding:'8px 12px',borderRadius:'10px',border:'1px solid var(--input-border)',
    background:'var(--input-bg)',color:'var(--text)',fontSize:'13px',outline:'none'
  }});
  addRow.appendChild(nameInput);
  const folderSelect=ce('select',{style:{
    padding:'8px',borderRadius:'10px',border:'1px solid var(--input-border)',
    background:'var(--input-bg)',color:'var(--text)',fontSize:'12px'
  }});
  folders.forEach(f=>{const opt=ce('option',{},f);folderSelect.appendChild(opt);});
  addRow.appendChild(folderSelect);
  const addBtn=ce('button',{style:{
    padding:'8px 16px',borderRadius:'10px',border:'none',background:'var(--accent)',color:'#fff',
    fontSize:'13px',fontWeight:'700',cursor:'pointer'
  },onClick:()=>{
    const name=nameInput.value.trim();
    if(!name)return;
    bookmarks.push({name:esc(name),folder:folderSelect.value,date:fmtDate9()});
    lsSet('cc-bookmarks-v9',bookmarks);
    nameInput.value='';
    SFX9.play('bookmark_add');
    showToast9('&#128278; &#48513;&#47560;&#53356; &#52628;&#44032;: '+esc(name));
    checkAchieve9('bookmark_first');
    if(bookmarks.length>=10)checkAchieve9('bookmark_10');
    modal.remove();
    openBookmarks();
  }},'&#52628;&#44032;');
  addRow.appendChild(addBtn);
  box.appendChild(addRow);

  if(bookmarks.length===0){
    box.appendChild(ce('div',{style:{textAlign:'center',padding:'32px',color:'var(--text-secondary)',fontSize:'14px'}},
      '&#128278; &#48513;&#47560;&#53356;&#44032; &#50630;&#49845;&#45768;&#45796;. &#44053;&#51340;&#47749;&#51012; &#51077;&#47141;&#54616;&#44256; &#52628;&#44032;&#54616;&#49464;&#50836;!'));
  } else {
    const grouped={};
    bookmarks.forEach(b=>{if(!grouped[b.folder])grouped[b.folder]=[];grouped[b.folder].push(b);});
    Object.entries(grouped).forEach(([folder,items])=>{
      box.appendChild(ce('div',{style:{fontSize:'14px',fontWeight:'700',color:'var(--accent)',margin:'12px 0 8px'}},folder+' ('+items.length+')'));
      items.forEach((item,idx)=>{
        const row=ce('div',{style:{
          display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'8px 12px',background:'var(--card-bg)',border:'1px solid var(--card-border)',
          borderRadius:'10px',marginBottom:'4px'
        }});
        row.appendChild(ce('span',{style:{fontSize:'13px',color:'var(--text)'}},item.name));
        const meta=ce('div',{style:{display:'flex',alignItems:'center',gap:'8px'}});
        meta.appendChild(ce('span',{style:{fontSize:'11px',color:'var(--text-secondary)'}},item.date));
        const delBtn=ce('button',{style:{
          background:'none',border:'none',color:'#EF4444',fontSize:'14px',cursor:'pointer',padding:'2px 6px'
        },onClick:()=>{
          const globalIdx=bookmarks.findIndex(b=>b.name===item.name&&b.folder===item.folder&&b.date===item.date);
          if(globalIdx>=0)bookmarks.splice(globalIdx,1);
          lsSet('cc-bookmarks-v9',bookmarks);
          modal.remove();
          openBookmarks();
        }},'&#10005;');
        meta.appendChild(delBtn);
        row.appendChild(meta);
        box.appendChild(row);
      });
    });
  }
  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 7. 학습 마일스톤 타임라인
// ═══════════════════════════════════════
function openMilestones(){
  SFX9.play('milestone_hit');
  const milestones=lsGet('cc-milestones-v9',[]);

  const modal=ce('div',{id:'v9-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v9FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'560px',width:'92vw',maxHeight:'85vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);
  box.appendChild(ce('h2',{style:{margin:'0 0 16px',fontSize:'20px',color:'var(--accent)'}},
    '&#127942; &#54617;&#49845; &#47560;&#51068;&#49828;&#53668; &#53440;&#51076;&#46972;&#51064;'));

  const addRow=ce('div',{style:{display:'flex',gap:'8px',marginBottom:'16px'}});
  const msInput=ce('input',{type:'text',placeholder:'&#47560;&#51068;&#49828;&#53668; &#51077;&#47141;... (&#50696;: &#49688;&#50689; &#48176;&#50689; &#50756;&#47308;)',style:{
    flex:'1',padding:'8px 12px',borderRadius:'10px',border:'1px solid var(--input-border)',
    background:'var(--input-bg)',color:'var(--text)',fontSize:'13px',outline:'none'
  }});
  addRow.appendChild(msInput);
  const msBtn=ce('button',{style:{
    padding:'8px 16px',borderRadius:'10px',border:'none',background:'var(--accent)',color:'#fff',
    fontSize:'13px',fontWeight:'700',cursor:'pointer',whiteSpace:'nowrap'
  },onClick:()=>{
    const text=msInput.value.trim();
    if(!text)return;
    milestones.unshift({text:esc(text),date:fmtDate9(),time:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})});
    if(milestones.length>50)milestones.pop();
    lsSet('cc-milestones-v9',milestones);
    msInput.value='';
    SFX9.play('milestone_hit');
    showToast9('&#127942; &#47560;&#51068;&#49828;&#53668; &#44592;&#47197;!');
    checkAchieve9('milestone_first');
    if(milestones.length>=10)checkAchieve9('milestone_10');
    modal.remove();
    openMilestones();
  }},'&#44592;&#47197;');
  addRow.appendChild(msBtn);
  box.appendChild(addRow);

  if(milestones.length===0){
    box.appendChild(ce('div',{style:{textAlign:'center',padding:'32px',color:'var(--text-secondary)',fontSize:'14px'}},
      '&#127942; &#47560;&#51068;&#49828;&#53668;&#51012; &#44592;&#47197;&#54644;&#48372;&#49464;&#50836;!'));
  } else {
    const timeline=ce('div',{style:{position:'relative',paddingLeft:'24px'}});
    timeline.appendChild(ce('div',{style:{
      position:'absolute',left:'8px',top:'0',bottom:'0',width:'2px',
      background:'linear-gradient(180deg,var(--accent),var(--accent2),transparent)'
    }}));
    milestones.forEach((ms,i)=>{
      const item=ce('div',{style:{
        position:'relative',marginBottom:'12px',paddingLeft:'16px',
        animation:'v9SlideRight .3s ease both',animationDelay:(i*0.05)+'s'
      }});
      item.appendChild(ce('div',{style:{
        position:'absolute',left:'-20px',top:'4px',width:'10px',height:'10px',borderRadius:'50%',
        background:i===0?'var(--accent)':'var(--card-border)',border:'2px solid '+(i===0?'var(--accent)':'var(--text-secondary)')
      }}));
      const card=ce('div',{style:{
        background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'10px',
        padding:'10px 14px'
      }});
      card.appendChild(ce('div',{style:{fontSize:'13px',fontWeight:'600',color:'var(--text)'}},ms.text));
      card.appendChild(ce('div',{style:{fontSize:'11px',color:'var(--text-secondary)',marginTop:'4px'}},ms.date+' '+ms.time));
      const delBtn=ce('button',{style:{
        position:'absolute',top:'10px',right:'10px',background:'none',border:'none',
        color:'var(--text-secondary)',fontSize:'12px',cursor:'pointer',opacity:'0.5'
      },onClick:()=>{
        milestones.splice(i,1);
        lsSet('cc-milestones-v9',milestones);
        modal.remove();
        openMilestones();
      }},'&#10005;');
      card.appendChild(delBtn);
      card.style.position='relative';
      item.appendChild(card);
      timeline.appendChild(item);
    });
    box.appendChild(timeline);
  }
  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 8. 접근성 패널
// ═══════════════════════════════════════
function openAccessibility(){
  SFX9.play('access_toggle');
  const settings=lsGet('cc-access-v9',{fontSize:100,lineHeight:100,highContrast:false,reduceMotion:false});

  const modal=ce('div',{id:'v9-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v9FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'480px',width:'92vw',maxHeight:'85vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);
  box.appendChild(ce('h2',{style:{margin:'0 0 16px',fontSize:'20px',color:'var(--accent)'}},
    '&#9855;&#65039; &#51217;&#44540;&#49457; &#49444;&#51221;'));

  function makeSlider(label,key,min,max,unit){
    const row=ce('div',{style:{marginBottom:'16px'}});
    row.appendChild(ce('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:'6px'}},
      '<span style="font-size:13px;font-weight:600;color:var(--text)">'+label+'</span>'+
      '<span style="font-size:13px;color:var(--accent);font-weight:700" id="v9-'+key+'-val">'+settings[key]+unit+'</span>'));
    const slider=ce('input',{type:'range',min:String(min),max:String(max),value:String(settings[key]),style:{
      width:'100%',accentColor:'var(--accent)'
    }});
    slider.addEventListener('input',()=>{
      settings[key]=parseInt(slider.value);
      const valEl=document.getElementById('v9-'+key+'-val');
      if(valEl)valEl.textContent=settings[key]+unit;
      applyAccessibility(settings);
      lsSet('cc-access-v9',settings);
    });
    row.appendChild(slider);
    return row;
  }

  box.appendChild(makeSlider('&#44544;&#44844; &#53356;&#44592;','fontSize',80,150,'%'));
  box.appendChild(makeSlider('&#51460;&#44036;&#44201;','lineHeight',100,200,'%'));

  function makeToggle(label,key){
    const row=ce('div',{style:{
      display:'flex',justifyContent:'space-between',alignItems:'center',
      padding:'12px',background:'var(--card-bg)',border:'1px solid var(--card-border)',
      borderRadius:'12px',marginBottom:'8px'
    }});
    row.appendChild(ce('span',{style:{fontSize:'13px',fontWeight:'600',color:'var(--text)'}},label));
    const toggle=ce('button',{style:{
      width:'48px',height:'26px',borderRadius:'13px',border:'none',cursor:'pointer',
      background:settings[key]?'var(--accent)':'var(--input-bg)',transition:'background .2s',position:'relative'
    }});
    const knob=ce('div',{style:{
      width:'20px',height:'20px',borderRadius:'50%',background:'#fff',position:'absolute',top:'3px',
      left:settings[key]?'25px':'3px',transition:'left .2s',boxShadow:'0 1px 3px rgba(0,0,0,0.3)'
    }});
    toggle.appendChild(knob);
    toggle.addEventListener('click',()=>{
      settings[key]=!settings[key];
      toggle.style.background=settings[key]?'var(--accent)':'var(--input-bg)';
      knob.style.left=settings[key]?'25px':'3px';
      applyAccessibility(settings);
      lsSet('cc-access-v9',settings);
      SFX9.play('access_toggle');
    });
    row.appendChild(toggle);
    return row;
  }

  box.appendChild(makeToggle('&#44256;&#45824;&#48708; &#47784;&#46300;','highContrast'));
  box.appendChild(makeToggle('&#50528;&#45768;&#47700;&#51060;&#49496; &#51460;&#51060;&#44592;','reduceMotion'));

  const resetBtn=ce('button',{style:{
    width:'100%',padding:'12px',borderRadius:'12px',border:'1px solid var(--card-border)',
    background:'var(--card-bg)',color:'var(--text)',fontSize:'13px',fontWeight:'600',cursor:'pointer',marginTop:'8px'
  },onClick:()=>{
    const def={fontSize:100,lineHeight:100,highContrast:false,reduceMotion:false};
    lsSet('cc-access-v9',def);
    applyAccessibility(def);
    modal.remove();
    openAccessibility();
    showToast9('&#9855;&#65039; &#44592;&#48376;&#44050;&#51004;&#47196; &#52488;&#44592;&#54868;');
  }},'&#44592;&#48376;&#44050;&#51004;&#47196; &#52488;&#44592;&#54868;');
  box.appendChild(resetBtn);
  modal.appendChild(box);
  document.body.appendChild(modal);
  checkAchieve9('access_open');
}

function applyAccessibility(settings){
  document.documentElement.style.fontSize=settings.fontSize+'%';
  document.documentElement.style.lineHeight=settings.lineHeight+'%';
  if(settings.highContrast){
    document.documentElement.style.setProperty('--text','#fff');
    document.documentElement.style.setProperty('--text-primary','#fff');
    document.documentElement.style.setProperty('--card-border','rgba(255,255,255,0.3)');
  } else {
    document.documentElement.style.removeProperty('--text');
    document.documentElement.style.removeProperty('--text-primary');
    document.documentElement.style.removeProperty('--card-border');
  }
  if(settings.reduceMotion){
    document.documentElement.style.setProperty('--transition','none');
  } else {
    document.documentElement.style.removeProperty('--transition');
  }
}

// ═══════════════════════════════════════
// 9. 수강 후기 워드클라우드
// ═══════════════════════════════════════
function openWordCloud(){
  SFX9.play('wordcloud_gen');
  const modal=ce('div',{id:'v9-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v9FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'600px',width:'92vw',maxHeight:'85vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);
  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#9729;&#65039; &#49688;&#44053;&#54980;&#44592; &#50892;&#46300;&#53364;&#46972;&#50864;&#46300;'));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    '&#49688;&#44053;&#49373; &#47532;&#48624; &#54609;&#49900;&#50612; &#49884;&#44033;&#54868;'));

  const canvas=ce('canvas',{width:560,height:340,style:{width:'100%',height:'auto',borderRadius:'12px'}});
  box.appendChild(canvas);

  const words=[
    {text:'&#51116;&#48120;&#51080;&#50612;&#50836;',weight:95},{text:'&#52828;&#51208;&#54644;&#50836;',weight:90},{text:'&#52404;&#44228;&#51201;',weight:85},
    {text:'&#52628;&#52380;&#54633;&#45768;&#45796;',weight:88},{text:'&#49892;&#47141;&#54693;&#49345;',weight:80},{text:'&#48176;&#50864;&#44592;&#49772;&#50892;',weight:75},
    {text:'&#44053;&#49324;&#45784;&#52572;&#44256;',weight:92},{text:'&#50500;&#51060;&#46308;&#51339;&#50500;',weight:70},{text:'&#52488;&#48372;&#51088;&#52628;&#52380;',weight:82},
    {text:'&#44032;&#49457;&#48708;&#44404;',weight:78},{text:'&#49884;&#49444;&#51339;&#50500;',weight:72},{text:'&#45796;&#50577;&#54620;&#44053;&#51340;',weight:68},
    {text:'&#48169;&#44284;&#54980;&#52628;&#52380;',weight:76},{text:'&#52852;&#46300;&#49324;&#50857;',weight:60},{text:'&#49828;&#53944;&#47112;&#49828;&#54644;&#49548;',weight:74},
    {text:'&#51088;&#44201;&#51613;&#52712;&#46301;',weight:65},{text:'&#52404;&#47141;&#44053;&#54868;',weight:70},{text:'&#50724;&#47000;&#45796;&#45772;&#44256;&#49910;&#50612;&#50836;',weight:83},
    {text:'&#51452;&#52264;&#51109;&#54200;&#47532;',weight:55},{text:'&#50728;&#46972;&#51064;&#49688;&#50629;',weight:62},{text:'&#49549;&#49457;&#44284;&#51221;',weight:58},
    {text:'&#50500;&#51060;&#51333;&#50500;',weight:67},{text:'&#50612;&#47480;&#46020;&#51339;&#50500;',weight:72},{text:'&#49828;&#54016;&#44221;&#54744;',weight:52},
    {text:'&#44148;&#44053;&#54644;&#51256;&#50836;',weight:76},{text:'&#52712;&#48120;&#49373;&#54876;',weight:64},{text:'&#49352;&#47196;&#50868;&#46020;&#51204;',weight:58},
    {text:'&#44592;&#52488;&#48512;&#53552;&#53444;&#53444;',weight:60},{text:'&#50756;&#49688;&#47141;&#49345;&#49849;',weight:71},{text:'&#46021;&#54617;&#50640;&#46020;&#51339;&#50500;',weight:50}
  ];

  function drawWordCloud(){
    const ctx=canvas.getContext('2d');
    const W=560,H=340;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    const colors=['#7EC8E3','#3AAFA9','#60A5FA','#F472B6','#FBBF24','#34D399','#A78BFA','#FB923C','#EC4899','#14B8A6'];
    const placed=[];
    const sorted=[...words].sort((a,b)=>b.weight-a.weight);

    sorted.forEach((word,i)=>{
      const size=Math.max(10,Math.round(word.weight/95*28));
      ctx.font='bold '+size+'px system-ui';
      const m=ctx.measureText(word.text);
      const ww=m.width+4,hh=size+4;

      for(let attempt=0;attempt<100;attempt++){
        const angle=attempt*0.3;
        const radius=10+attempt*2.5;
        const x=W/2+Math.cos(angle)*radius-ww/2;
        const y=H/2+Math.sin(angle)*radius-hh/2;

        if(x<5||y<5||x+ww>W-5||y+hh>H-5)continue;

        let overlap=false;
        for(const p of placed){
          if(x<p.x+p.w&&x+ww>p.x&&y<p.y+p.h&&y+hh>p.y){overlap=true;break;}
        }
        if(!overlap){
          placed.push({x,y,w:ww,h:hh});
          ctx.fillStyle=colors[i%colors.length];
          ctx.globalAlpha=0.7+word.weight/300;
          ctx.fillText(word.text,x+2,y+size);
          ctx.globalAlpha=1;
          break;
        }
      }
    });
  }
  drawWordCloud();
  modal.appendChild(box);
  document.body.appendChild(modal);
  checkAchieve9('wordcloud_view');
}

// ═══════════════════════════════════════
// 10. 강좌 추천 퀴즈 엔진 (v9 +15문 = 75문)
// ═══════════════════════════════════════
const QUIZ_V9=[
  {q:'&#54617;&#49845;&#44221;&#47196;&#47589;&#50640;&#49436; &#49688;&#50689;&#51032; &#52572;&#51333; &#45800;&#44228;&#45716;?',a:['&#47560;&#49828;&#53552;&#49828;','&#51217;&#50689;','&#44256;&#44553;&#53556;','&#48176;&#50689;'],c:0},
  {q:'&#47928;&#54868;&#49468;&#53552; &#44053;&#51340;&#50640;&#49436; PWA&#51032; &#50557;&#51088;&#45716;?',a:['Progressive Web App','Public Web Access','Private Web Archive','Personal Web Agent'],c:0},
  {q:'&#54588;&#50500;&#45432; &#44148;&#48152; &#44060;&#49688;&#45716; &#47751;&#44060;?',a:['61&#44060;','88&#44060;','76&#44060;','52&#44060;'],c:1},
  {q:'OSRM&#51008; &#50612;&#46500; &#49436;&#48708;&#49828;&#47484; &#51228;&#44277;&#54616;&#45208;&#50836;?',a:['&#44221;&#47196;/&#51060;&#46041;&#49884;&#44036; &#44228;&#49328;','&#51060;&#48120;&#51648; &#52376;&#47532;','&#51020;&#49457;&#51064;&#49885;','&#44208;&#51228; &#52376;&#47532;'],c:0},
  {q:'Canvas API&#47196; &#44536;&#47540; &#49688; &#50630;&#45716; &#44163;&#51008;?',a:['&#50896;','&#49324;&#44033;&#54805;','&#53581;&#49828;&#53944;','&#49892;&#51228; 3D &#47784;&#45944;'],c:3},
  {q:'&#50836;&#44032;&#50640;&#49436; &#53468;&#50577;&#44221;&#48176;&#51088;&#49464;&#45716; &#50612;&#46500; &#50976;&#54805;?',a:['&#50500;&#49772;&#53461;&#44032;','&#48712;&#50556;&#49324;','&#54616;&#53440;','&#54532;&#46972;&#45208;&#50556;&#47560;'],c:3},
  {q:'&#48156;&#47112;&#50640;&#49436; &#54540;&#47532;&#50640;&#45716; &#47924;&#49832;&#51012; &#44396;&#48512;&#47532;&#45716; &#46041;&#51089;?',a:['&#47924;&#47502;','&#48156;&#44032;&#46973;','&#54060;','&#50612;&#44648;'],c:0},
  {q:'localStorage&#51032; &#51200;&#51109; &#50857;&#47049; &#51228;&#54620;&#51008; &#48372;&#53685; &#50620;&#47560;?',a:['5MB','50MB','500KB','&#47924;&#51228;&#54620;'],c:0},
  {q:'&#49688;&#52292;&#54868;&#50640; &#44032;&#51109; &#51201;&#54633;&#54620; &#48531;&#51008;?',a:['&#50976;&#54868;&#48531;','&#49688;&#52292;&#54868;&#48531;','&#50500;&#53356;&#47540;&#48531;','&#50672;&#54596;'],c:1},
  {q:'&#47928;&#54868;&#49468;&#53552; &#44053;&#51340;&#50640;&#49436; &#44032;&#51109; &#51064;&#44592;&#51080;&#45716; &#51333;&#47785;&#51008;?',a:['&#49688;&#50689;','&#54588;&#50500;&#45432;','&#50836;&#44032;','&#48120;&#49696;'],c:0},
  {q:'Web Speech API&#45716; &#50612;&#46500; &#44592;&#45733;&#51012; &#51228;&#44277;?',a:['&#51020;&#49457;&#51064;&#49885;','3D &#47116;&#45908;&#47553;','&#45936;&#51060;&#53552;&#48288;&#51060;&#49828;','&#54028;&#51068; &#50517;&#52629;'],c:0},
  {q:'&#53468;&#44428;&#46020;&#50640;&#49436; &#54408;&#49352;&#51032; &#51333;&#47448; &#49688;&#45716;?',a:['8&#44060;','5&#44060;','12&#44060;','3&#44060;'],c:0},
  {q:'Seeded Random&#51008; &#50612;&#46500; &#50857;&#46020;&#47196; &#49324;&#50857;?',a:['&#51116;&#54788;&#44032;&#45733;&#54620; &#47004;&#45924;','&#48372;&#50504; &#50516;&#54840;&#54868;','&#45936;&#51060;&#53552; &#50517;&#52629;','&#54868;&#47732; &#47116;&#45908;&#47553;'],c:0},
  {q:'&#49436;&#50696;&#50640;&#49436; &#54644;&#49436;&#52404;&#45716; &#50612;&#46500; &#49436;&#52404;?',a:['&#54644;&#49436;&#52404;','&#54665;&#49436;&#52404;','&#52488;&#49436;&#52404;','&#54032;&#48376;&#52404;'],c:0},
  {q:'&#51217;&#44540;&#49457; &#49444;&#51221;&#50640;&#49436; &#44256;&#45824;&#48708; &#47784;&#46300;&#51032; &#47785;&#51201;&#51008;?',a:['&#49884;&#44033;&#51109;&#50528;&#51064;&#50857; &#44032;&#46021;&#49457;','&#48176;&#53552;&#47532; &#51208;&#50557;','&#49549;&#46020; &#54693;&#49345;','&#45936;&#51060;&#53552; &#51208;&#50557;'],c:0}
];

function openQuizV9(){
  SFX9.play('quiz_v9');
  let qIdx=0,score=0,answered=[];
  const shuffled=[...QUIZ_V9].sort(()=>Math.random()-0.5).slice(0,15);

  const modal=ce('div',{id:'v9-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v9FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{id:'v9-quiz-box',style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'520px',width:'92vw',maxHeight:'85vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);

  function renderQ(){
    const inner=document.getElementById('v9-quiz-inner');
    if(inner)inner.remove();
    const wrap=ce('div',{id:'v9-quiz-inner'});

    if(qIdx>=shuffled.length){
      const pct=Math.round(score/shuffled.length*100);
      const grade=pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D';
      wrap.appendChild(ce('h2',{style:{margin:'0 0 8px',fontSize:'20px',color:'var(--accent)',textAlign:'center'}},
        '&#127891; &#54140;&#51592; v9 &#44208;&#44284;'));
      wrap.appendChild(ce('div',{style:{textAlign:'center',fontSize:'48px',fontWeight:'900',
        color:{S:'#FBBF24',A:'#34D399',B:'#60A5FA',C:'#FB923C',D:'#EF4444'}[grade],margin:'16px 0'}},grade));
      wrap.appendChild(ce('div',{style:{textAlign:'center',fontSize:'16px',color:'var(--text)'}},
        score+'/'+shuffled.length+' &#51221;&#45813; ('+pct+'%)'));
      const best=lsGet('cc-quiz-best-v9',0);
      if(score>best){lsSet('cc-quiz-best-v9',score);wrap.appendChild(ce('div',{style:{textAlign:'center',color:'#FBBF24',fontWeight:'700',marginTop:'8px'}},'&#127942; &#49352;&#47196;&#50868; &#52572;&#44256;&#44592;&#47197;!'));}
      if(pct>=80)checkAchieve9('quiz_v9_high');
      if(pct===100)checkAchieve9('quiz_v9_perfect');
      SFX9.play('achieve_v9');
    } else {
      const q=shuffled[qIdx];
      wrap.appendChild(ce('div',{style:{display:'flex',justifyContent:'space-between',marginBottom:'8px'}},
        '<span style="font-size:13px;color:var(--text-secondary)">&#47928;&#51228; '+(qIdx+1)+'/'+shuffled.length+'</span>'+
        '<span style="font-size:13px;color:var(--accent);font-weight:700">'+score+'&#51216;</span>'));
      const progBar=ce('div',{style:{background:'var(--bar-bg)',height:'4px',borderRadius:'2px',marginBottom:'16px',overflow:'hidden'}});
      progBar.appendChild(ce('div',{style:{height:'100%',width:((qIdx+1)/shuffled.length*100)+'%',background:'var(--accent)',borderRadius:'2px'}}));
      wrap.appendChild(progBar);
      wrap.appendChild(ce('h3',{style:{margin:'0 0 16px',fontSize:'16px',color:'var(--text)',lineHeight:'1.5'}},q.q));

      q.a.forEach((ans,ai)=>{
        const btn=ce('button',{style:{
          display:'block',width:'100%',padding:'12px 16px',marginBottom:'8px',borderRadius:'12px',
          border:'1px solid var(--card-border)',background:'var(--card-bg)',color:'var(--text)',
          fontSize:'14px',cursor:'pointer',textAlign:'left',transition:'all .2s'
        }});
        btn.textContent=String.fromCharCode(9312+ai)+' '+ans;
        btn.addEventListener('click',()=>{
          if(answered[qIdx]!==undefined)return;
          answered[qIdx]=ai;
          if(ai===q.c){score++;btn.style.background='rgba(52,211,153,0.2)';btn.style.borderColor='#34D399';btn.style.color='#34D399';SFX9.play('quiz_v9');}
          else{btn.style.background='rgba(239,68,68,0.2)';btn.style.borderColor='#EF4444';btn.style.color='#EF4444';
            wrap.querySelectorAll('button[data-ans]')[q.c].style.background='rgba(52,211,153,0.15)';
            wrap.querySelectorAll('button[data-ans]')[q.c].style.borderColor='#34D399';}
          setTimeout(()=>{qIdx++;renderQ();},800);
        });
        btn.setAttribute('data-ans',ai);
        wrap.appendChild(btn);
      });
    }
    box.appendChild(wrap);
  }
  renderQ();
  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 업적 시스템 (+12 = 78개)
// ═══════════════════════════════════════
const ACHIEVE_V9={
  path_first:{name:'&#128506;&#65039; &#52395; &#44152;&#51020;',desc:'&#54617;&#49845;&#44221;&#47196; &#52395; &#45800;&#44228; &#50756;&#47308;'},
  path_complete:{name:'&#127942; &#54617;&#49845;&#50756;&#47308;&#51088;',desc:'1&#44284;&#47785; &#51204;&#52404; &#45800;&#44228; &#50756;&#47308;'},
  path_half:{name:'&#127775; &#48152;&#51032;&#45804;&#49457;',desc:'6&#44284;&#47785; &#51060;&#49345; &#50756;&#47308;'},
  path_master:{name:'&#128081; &#47196;&#46300;&#47589;&#47560;&#49828;&#53552;',desc:'12&#44284;&#47785; &#51204;&#52404; &#50756;&#47308;'},
  price_analyst:{name:'&#128200; &#44032;&#44201;&#48516;&#49437;&#44032;',desc:'&#44032;&#44201; &#53944;&#47116;&#46300; &#48516;&#49437;&#44592; &#49324;&#50857;'},
  portfolio_gen:{name:'&#127891; &#54252;&#53944;&#54260;&#47532;&#50724;',desc:'&#47560;&#51060;&#47084;&#45789; &#54252;&#53944;&#54260;&#47532;&#50724; &#49373;&#49457;'},
  portfolio_download:{name:'&#128190; &#54252;&#53944;&#54260;&#47532;&#50724;&#49688;&#51665;',desc:'&#54252;&#53944;&#54260;&#47532;&#50724; PNG &#45796;&#50868;&#47196;&#46300;'},
  planner_open:{name:'&#128197; &#44228;&#54925;&#49464;&#50864;&#44592;',desc:'&#51452;&#44036; &#54617;&#49845; &#54540;&#47000;&#45320; &#50676;&#44592;'},
  plan_7:{name:'&#9989; &#51452;&#44036;7&#50756;&#47308;',desc:'&#54540;&#47000;&#45320; 7&#44060; &#51060;&#49345; &#50756;&#47308;'},
  plan_all:{name:'&#128175; &#54540;&#47000;&#45320;&#47560;&#49828;&#53552;',desc:'&#54540;&#47000;&#45320; 21&#44060; &#51204;&#52404; &#50756;&#47308;'},
  bookmark_first:{name:'&#128278; &#52395;&#48513;&#47560;&#53356;',desc:'&#48513;&#47560;&#53356; &#52395; &#52628;&#44032;'},
  bookmark_10:{name:'&#128218; &#48513;&#47560;&#53356;&#49688;&#51665;&#44032;',desc:'&#48513;&#47560;&#53356; 10&#44060; &#51060;&#49345;'},
  milestone_first:{name:'&#127942; &#52395;&#47560;&#51068;&#49828;&#53668;',desc:'&#47560;&#51068;&#49828;&#53668; &#52395; &#44592;&#47197;'},
  milestone_10:{name:'&#128293; &#47560;&#51068;&#49828;&#53668;10',desc:'&#47560;&#51068;&#49828;&#53668; 10&#44060; &#51060;&#49345;'},
  access_open:{name:'&#9855;&#65039; &#51217;&#44540;&#49457;&#52404;&#53356;',desc:'&#51217;&#44540;&#49457; &#49444;&#51221; &#50676;&#44592;'},
  wordcloud_view:{name:'&#9729;&#65039; &#50892;&#46300;&#53364;&#46972;&#50864;&#46300;',desc:'&#49688;&#44053;&#54980;&#44592; &#50892;&#46300;&#53364;&#46972;&#50864;&#46300; &#48372;&#44592;'},
  quiz_v9_high:{name:'&#127891; &#54140;&#51592;v9&#44256;&#49688;',desc:'&#54140;&#51592; v9&#50640;&#49436; 80% &#51060;&#49345;'},
  quiz_v9_perfect:{name:'&#128175; &#54140;&#51592;v9&#47564;&#51216;',desc:'&#54140;&#51592; v9&#50640;&#49436; 100% &#51221;&#45813;'}
};

function checkAchieve9(key){
  const achv=lsGet('cc-achieve-v9',{});
  if(achv[key])return;
  achv[key]=true;
  lsSet('cc-achieve-v9',achv);
  const a=ACHIEVE_V9[key];
  if(a){
    SFX9.play('achieve_v9');
    showToast9('&#127942; &#50629;&#51201; &#45804;&#49457;: '+a.name,3000);
  }
}

// ═══════════════════════════════════════
// 퀵 액션 버튼 (10종)
// ═══════════════════════════════════════
function insertQuickActions9(){
  if(document.getElementById('v9-quick-actions'))return;
  const wrap=ce('div',{id:'v9-quick-actions',style:{
    position:'fixed',top:'50%',right:'8px',transform:'translateY(-50%)',
    display:'flex',flexDirection:'column',gap:'4px',zIndex:'940'
  }});

  const actions=[
    {label:'&#128506;&#65039;&#44221;&#47196;',fn:openLearningPath},
    {label:'&#128202;&#47112;&#51060;&#45908;',fn:openStatsRadar},
    {label:'&#128200;&#44032;&#44201;',fn:openPriceTrend},
    {label:'&#127891;&#54252;&#53944;&#54260;',fn:openPortfolio},
    {label:'&#128197;&#54540;&#47000;&#45320;',fn:openPlanner},
    {label:'&#128278;&#48513;&#47560;&#53356;',fn:openBookmarks},
    {label:'&#127942;&#47560;&#51068;&#49828;&#53668;',fn:openMilestones},
    {label:'&#9855;&#65039;&#51217;&#44540;&#49457;',fn:openAccessibility},
    {label:'&#9729;&#65039;&#54980;&#44592;',fn:openWordCloud},
    {label:'&#127891;&#54140;&#51592;v9',fn:openQuizV9}
  ];

  actions.forEach(a=>{
    const btn=ce('button',{className:'v9-qbtn',style:{
      padding:'5px 8px',borderRadius:'8px',border:'1px solid var(--card-border)',
      background:'var(--card-bg)',color:'var(--text-secondary)',fontSize:'10px',
      cursor:'pointer',whiteSpace:'nowrap',transition:'all .2s',backdropFilter:'blur(8px)',
      WebkitBackdropFilter:'blur(8px)'
    },onClick:a.fn},a.label);
    btn.addEventListener('mouseenter',()=>{btn.style.borderColor='var(--accent)';btn.style.color='var(--accent)';btn.style.transform='translateX(-4px)';});
    btn.addEventListener('mouseleave',()=>{btn.style.borderColor='var(--card-border)';btn.style.color='var(--text-secondary)';btn.style.transform='none';});
    wrap.appendChild(btn);
  });
  document.body.appendChild(wrap);
}

// ═══════════════════════════════════════
// 키보드 단축키 (8종)
// ═══════════════════════════════════════
function initKeyboard9(){
  document.addEventListener('keydown',e=>{
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;
    if(!e.shiftKey)return;
    const map={
      'L':openLearningPath,
      'R':openStatsRadar,
      'T':openPriceTrend,
      'F':openPortfolio,
      'P':openPlanner,
      'B':openBookmarks,
      'M':openMilestones,
      'A':openAccessibility
    };
    const fn=map[e.key.toUpperCase()];
    if(fn){
      e.preventDefault();
      const existing=document.getElementById('v9-modal');
      if(existing)existing.remove();
      fn();
    }
  });
}

// ═══════════════════════════════════════
// CSS
// ═══════════════════════════════════════
function injectV9Styles(){
  if(document.getElementById('v9-styles'))return;
  const style=ce('style',{id:'v9-styles'});
  style.textContent='@keyframes v9SlideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}'+
    '@keyframes v9SlideUp{from{transform:translateY(0);opacity:1}to{transform:translateY(-20px);opacity:0}}'+
    '@keyframes v9FadeIn{from{opacity:0}to{opacity:1}}'+
    '@keyframes v9SlideRight{from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}}'+
    '@keyframes v9Pulse{0%,100%{opacity:1}50%{opacity:0.5}}'+
    '.v9-qbtn:active{transform:scale(0.95)!important}'+
    '#v9-modal::-webkit-scrollbar{width:6px}#v9-modal::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:3px}'+
    '@media(max-width:480px){#v9-quick-actions{top:auto;bottom:70px;right:4px}.v9-qbtn{font-size:9px!important;padding:4px 6px!important}}';
  document.head.appendChild(style);
}

// ═══════════════════════════════════════
// 초기화
// ═══════════════════════════════════════
function init9(){
  injectV9Styles();

  const access=lsGet('cc-access-v9',null);
  if(access)applyAccessibility(access);

  setTimeout(()=>{
    insertQuickActions9();
    initKeyboard9();

    const milestones=lsGet('cc-milestones-v9',[]);
    const today=fmtDate9();
    const hasToday=milestones.some(m=>m.date===today&&m.text.includes('v9'));
    if(!hasToday){
      milestones.unshift({text:'v9.0 &#50629;&#45936;&#51060;&#53944; &#51201;&#50857;',date:today,time:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})});
      if(milestones.length>50)milestones.pop();
      lsSet('cc-milestones-v9',milestones);
    }

    showToast9('&#127775; v9.0 &#54617;&#49845;&#44221;&#47196;&#47589;+&#53685;&#44228;&#47112;&#51060;&#45908;+&#44032;&#44201;&#48516;&#49437;+&#54252;&#53944;&#54260;&#47532;&#50724;+&#54540;&#47000;&#45320;+&#48513;&#47560;&#53356;+&#47560;&#51068;&#49828;&#53668;+&#51217;&#44540;&#49457;+&#50892;&#46300;&#53364;&#46972;&#50864;&#46300;+&#54140;&#51592;v9',3500);
  },3500);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init9);
}else{
  init9();
}

})();
