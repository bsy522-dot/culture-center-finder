/**
 * culture-center-finder v11.0 patch
 * 수강후기감성분석기Canvas+강좌난이도가이드10종+학습커뮤니티게시판12종+센터접근성평가8항목Canvas+강좌추천퀴즈인터랙티브+수강목표트래커6종Canvas+강좌비교분석기Canvas4종+수강증명서v2CanvasPNG+퀴즈15추가(90→105)+업적12추가(90→102)+SFX12종+키보드8종
 */
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

const V11_ID='ccf-v11-patch';
if(document.getElementById(V11_ID))return;
const marker=document.createElement('meta');
marker.id=V11_ID;
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
function showToast11(msg,dur){
  const old=document.getElementById('v11-toast');
  if(old)old.remove();
  const t=ce('div',{id:'v11-toast',style:{
    position:'fixed',top:'20px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#1A365D,#0C1525)',
    border:'1px solid rgba(126,200,227,0.5)',borderRadius:'14px',padding:'12px 24px',zIndex:'970',
    fontSize:'13px',fontWeight:'700',color:'#7EC8E3',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
    animation:'v11SlideDown .3s ease both',whiteSpace:'nowrap',maxWidth:'90vw',overflow:'hidden',textOverflow:'ellipsis'
  }},msg);
  document.body.appendChild(t);
  setTimeout(()=>{t.style.animation='v11SlideUp .3s ease both';setTimeout(()=>t.remove(),300);},dur||2500);
}
function fmtDate11(d){
  if(!d)d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function isDark(){return document.documentElement.getAttribute('data-theme')!=='light';}

// ═══════════════════════════════════════
// SFX 엔진 (12종)
// ═══════════════════════════════════════
const SFX11={
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
      review_open:    {freq:523,type:'sine',dur:0.2,vol:0.12},
      difficulty_view:{freq:659,type:'triangle',dur:0.18,vol:0.12},
      community_open: {freq:698,type:'sine',dur:0.15,vol:0.1},
      access_check:   {freq:784,type:'triangle',dur:0.2,vol:0.12},
      recommend_spin: {freq:880,type:'sine',dur:0.18,vol:0.14},
      goal_set:       {freq:587,type:'triangle',dur:0.15,vol:0.12},
      compare_open:   {freq:932,type:'sine',dur:0.3,vol:0.15},
      cert_gen:       {freq:1047,type:'triangle',dur:0.25,vol:0.14},
      quiz_v11:       {freq:740,type:'sine',dur:0.18,vol:0.12},
      quiz_correct11: {freq:988,type:'triangle',dur:0.2,vol:0.14},
      achieve_v11:    {freq:1175,type:'sine',dur:0.3,vol:0.15},
      feature_open11: {freq:622,type:'triangle',dur:0.15,vol:0.1}
    };
    const p=presets[name]||presets.feature_open11;
    o.type=p.type;o.frequency.value=p.freq;
    g.gain.setValueAtTime(p.vol,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+p.dur);
    o.start(ctx.currentTime);o.stop(ctx.currentTime+p.dur);
  }
};

// ═══════════════════════════════════════
// 업적 시스템 (+12종, 90→102)
// ═══════════════════════════════════════
const V11_ACHIEVEMENTS=[
  {id:'review_writer',name:'리뷰 작성가',desc:'수강후기 최초 작성',icon:'&#9997;&#65039;'},
  {id:'review_analyst',name:'감성 분석가',desc:'후기 감성 분석 5건 수행',icon:'&#128202;'},
  {id:'difficulty_explorer',name:'난이도 탐험가',desc:'강좌 난이도 가이드 확인',icon:'&#128218;'},
  {id:'community_first',name:'커뮤니티 입문',desc:'커뮤니티 게시판 최초 방문',icon:'&#128172;'},
  {id:'access_evaluator',name:'접근성 평가자',desc:'센터 접근성 평가 완료',icon:'&#9855;'},
  {id:'recommend_user',name:'추천 탐색자',desc:'강좌추천 퀴즈 완료',icon:'&#127919;'},
  {id:'goal_setter',name:'목표 설정가',desc:'수강 목표 최초 설정',icon:'&#127919;'},
  {id:'goal_achiever',name:'목표 달성자',desc:'수강 목표 3개 달성',icon:'&#127942;'},
  {id:'compare_analyst',name:'비교 분석가',desc:'강좌 비교 분석 수행',icon:'&#128200;'},
  {id:'cert_holder',name:'수강증명 달인',desc:'수강증명서 v2 발급',icon:'&#127891;'},
  {id:'quiz_v11_try',name:'v11 퀴즈 도전자',desc:'v11 퀴즈 최초 도전',icon:'&#127891;'},
  {id:'v11_explorer',name:'v11 탐험가',desc:'v11 기능 5종 이상 사용',icon:'&#127942;'}
];

function checkAchieve11(id){
  const achieved=lsGet('cc-achieve-v11',[]);
  if(achieved.includes(id))return;
  achieved.push(id);
  lsSet('cc-achieve-v11',achieved);
  const a=V11_ACHIEVEMENTS.find(x=>x.id===id);
  if(a){
    SFX11.play('achieve_v11');
    showToast11(a.icon+' &#50629;&#51201; &#45804;&#49457;: '+esc(a.name),3000);
  }
  if(achieved.length>=5)checkAchieve11('v11_explorer');
}

function trackFeature11(name){
  const used=lsGet('cc-v11-features-used',[]);
  if(!used.includes(name)){
    used.push(name);
    lsSet('cc-v11-features-used',used);
    if(used.length>=5)checkAchieve11('v11_explorer');
  }
}

function makeModal11(title,subtitle){
  const modal=ce('div',{id:'v11-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v11FadeIn .3s ease'
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
// 1. 수강후기 감성 분석기 Canvas
// ═══════════════════════════════════════
const SENTIMENT_KEYWORDS={
  positive:['좋아','훌륭','만족','재미','즐거','추천','친절','깨끗','세심','체계','알차','유익','최고','배울','실력','향상','성장','감사','편안','쾌적','꼼꼼','열정'],
  negative:['불만','아쉬','부족','별로','힘들','불친절','더럽','비싸','시끄','불편','어려','복잡','느려','답답','짜증','실망','후회','낡은','좁은','졸린'],
  neutral:['보통','그냥','괜찮','무난','평범','적당','일반','나쁘지않','그럭저럭']
};

function analyzeSentiment(text){
  if(!text)return{pos:0,neg:0,neu:0,score:50};
  const lower=text.toLowerCase();
  let pos=0,neg=0,neu=0;
  SENTIMENT_KEYWORDS.positive.forEach(k=>{if(lower.includes(k))pos++;});
  SENTIMENT_KEYWORDS.negative.forEach(k=>{if(lower.includes(k))neg++;});
  SENTIMENT_KEYWORDS.neutral.forEach(k=>{if(lower.includes(k))neu++;});
  const total=pos+neg+neu||1;
  const score=Math.round(((pos-neg)/total+1)*50);
  return{pos,neg,neu,score:Math.max(0,Math.min(100,score))};
}

function openReviewAnalyzer(){
  SFX11.play('review_open');
  trackFeature11('review');
  checkAchieve11('review_writer');

  const{modal,box}=makeModal11('&#9997;&#65039; &#49688;&#44053;&#54980;&#44592; &#44048;&#49457; &#48516;&#49437;&#44592;','&#49688;&#44053;&#54980;&#44592;&#47484; &#51089;&#49457;&#54616;&#47732; AI&#44032; &#44048;&#49457;&#51012; &#48516;&#49437;&#54633;&#45768;&#45796;');

  const reviews=lsGet('cc-v11-reviews',[]);
  const textarea=ce('textarea',{style:{
    width:'100%',minHeight:'80px',background:'var(--input-bg)',border:'1px solid var(--input-border)',
    borderRadius:'12px',padding:'12px',color:'var(--text)',fontSize:'14px',resize:'vertical',
    boxSizing:'border-box',fontFamily:'inherit'
  }});
  textarea.placeholder='&#49688;&#44053;&#54980;&#44592;&#47484; &#51089;&#49457;&#54644;&#51452;&#49464;&#50836; (&#50696;: &#49440;&#49373;&#45784;&#51060; &#52828;&#51208;&#54616;&#44256; &#49688;&#50629;&#51060; &#51116;&#48120;&#51080;&#50612;&#50836;)';
  box.appendChild(textarea);

  const analyzeBtn=ce('button',{style:{
    marginTop:'8px',padding:'10px 20px',background:'linear-gradient(135deg,#7EC8E3,#3AAFA9)',
    border:'none',borderRadius:'10px',color:'#fff',fontSize:'14px',fontWeight:'700',cursor:'pointer'
  }},'&#128270; &#44048;&#49457; &#48516;&#49437;');
  box.appendChild(analyzeBtn);

  const canvas=ce('canvas',{width:600,height:340,style:{width:'100%',height:'auto',borderRadius:'12px',marginTop:'16px'}});
  box.appendChild(canvas);

  const resultDiv=ce('div',{style:{marginTop:'12px'}});
  box.appendChild(resultDiv);

  function drawSentimentChart(results){
    const ctx=canvas.getContext('2d');
    const W=600,H=340;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 16px system-ui';
    ctx.textAlign='center';
    ctx.fillText('수강후기 감성 분석 결과',W/2,30);

    if(results.length===0){
      ctx.fillStyle='var(--text-secondary)';
      ctx.font='14px system-ui';
      ctx.fillText('후기를 작성하고 분석 버튼을 눌러주세요',W/2,H/2);
      return;
    }

    const cx=160,cy=180,r=100;
    const totalPos=results.reduce((a,r)=>a+r.pos,0);
    const totalNeg=results.reduce((a,r)=>a+r.neg,0);
    const totalNeu=results.reduce((a,r)=>a+r.neu,0);
    const total=totalPos+totalNeg+totalNeu||1;

    const segments=[
      {label:'긍정',val:totalPos,color:'#22C55E'},
      {label:'부정',val:totalNeg,color:'#EF4444'},
      {label:'중립',val:totalNeu,color:'#F59E0B'}
    ];

    let startAngle=-Math.PI/2;
    segments.forEach(seg=>{
      const sliceAngle=(seg.val/total)*Math.PI*2;
      if(sliceAngle<=0)return;
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,r,startAngle,startAngle+sliceAngle);
      ctx.closePath();
      ctx.fillStyle=seg.color;
      ctx.fill();
      ctx.strokeStyle=isDark()?'#0C1525':'#F1F5F9';
      ctx.lineWidth=2;
      ctx.stroke();

      const midAngle=startAngle+sliceAngle/2;
      const lx=cx+Math.cos(midAngle)*(r*0.6);
      const ly=cy+Math.sin(midAngle)*(r*0.6);
      const pct=Math.round(seg.val/total*100);
      if(pct>5){
        ctx.fillStyle='#fff';
        ctx.font='bold 12px system-ui';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillText(pct+'%',lx,ly);
      }
      startAngle+=sliceAngle;
    });

    const legendX=320,legendY=100;
    segments.forEach((seg,i)=>{
      const ly=legendY+i*36;
      ctx.fillStyle=seg.color;
      ctx.beginPath();ctx.roundRect(legendX,ly,20,20,4);ctx.fill();
      ctx.fillStyle=isDark()?'#fff':'#1E293B';
      ctx.font='bold 13px system-ui';
      ctx.textAlign='left';
      ctx.textBaseline='middle';
      ctx.fillText(seg.label+': '+seg.val+'건',legendX+28,ly+10);
    });

    const avgScore=Math.round(results.reduce((a,r)=>a+r.score,0)/results.length);
    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 14px system-ui';
    ctx.textAlign='left';
    ctx.fillText('종합 감성 점수: '+avgScore+'/100',legendX,260);

    const barW=200,barH=16,barY=275;
    ctx.fillStyle='rgba(255,255,255,0.1)';
    ctx.beginPath();ctx.roundRect(legendX,barY,barW,barH,8);ctx.fill();
    const scoreColor=avgScore>=70?'#22C55E':avgScore>=40?'#F59E0B':'#EF4444';
    const grad=ctx.createLinearGradient(legendX,barY,legendX+barW*(avgScore/100),barY);
    grad.addColorStop(0,scoreColor+'CC');grad.addColorStop(1,scoreColor+'66');
    ctx.fillStyle=grad;
    ctx.beginPath();ctx.roundRect(legendX,barY,barW*(avgScore/100),barH,8);ctx.fill();

    const grade=avgScore>=90?'S':avgScore>=75?'A':avgScore>=60?'B':avgScore>=40?'C':'D';
    ctx.fillStyle=scoreColor;
    ctx.font='bold 28px system-ui';
    ctx.textAlign='center';
    ctx.fillText(grade,legendX+barW+40,barY+14);
  }

  drawSentimentChart(reviews.map(r=>r.analysis));

  analyzeBtn.addEventListener('click',()=>{
    const text=textarea.value.trim();
    if(!text){showToast11('후기를 입력해주세요');return;}
    const analysis=analyzeSentiment(text);
    reviews.unshift({text:esc(text),date:fmtDate11(),analysis});
    if(reviews.length>50)reviews.pop();
    lsSet('cc-v11-reviews',reviews);
    textarea.value='';
    SFX11.play('review_open');
    showToast11('✨ 감성점수: '+analysis.score+'/100 (긍정:'+analysis.pos+' 부정:'+analysis.neg+' 중립:'+analysis.neu+')');
    drawSentimentChart(reviews.map(r=>r.analysis));
    if(reviews.length>=5)checkAchieve11('review_analyst');
    renderHistory();
  });

  function renderHistory(){
    resultDiv.innerHTML='';
    if(reviews.length===0)return;
    resultDiv.appendChild(ce('h3',{style:{fontSize:'15px',color:'var(--accent)',margin:'12px 0 8px'}},'📝 최근 후기 ('+reviews.length+'건)'));
    reviews.slice(0,8).forEach(r=>{
      const scoreColor=r.analysis.score>=70?'#22C55E':r.analysis.score>=40?'#F59E0B':'#EF4444';
      const card=ce('div',{style:{
        background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'10px',
        padding:'10px',marginBottom:'6px',fontSize:'12px'
      }});
      card.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">'+
        '<span style="color:var(--text-secondary)">'+esc(r.date)+'</span>'+
        '<span style="color:'+scoreColor+';font-weight:700">감성:'+r.analysis.score+'/100</span></div>'+
        '<div style="color:var(--text)">'+r.text+'</div>';
      resultDiv.appendChild(card);
    });
  }
  renderHistory();
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 2. 강좌 난이도 가이드 10종
// ═══════════════════════════════════════
const DIFFICULTY_COURSES=[
  {name:'수영',icon:'🏊',levels:[
    {level:'입문',desc:'물 적응, 호흡법, 발차기 기초',duration:'4주',prereq:'없음'},
    {level:'초급',desc:'자유형 완성, 배영 입문',duration:'8주',prereq:'입문 수료'},
    {level:'중급',desc:'평영, 접영, 턴 기술',duration:'12주',prereq:'초급 수료'},
    {level:'상급',desc:'개인메들리, 스피드 훈련',duration:'16주+',prereq:'중급 수료'}
  ]},
  {name:'피아노',icon:'🎹',levels:[
    {level:'입문',desc:'건반 인지, 손모양, 음이름',duration:'4주',prereq:'없음'},
    {level:'초급',desc:'바이엘 전반, 양손 교대',duration:'12주',prereq:'입문 수료'},
    {level:'중급',desc:'체르니 100, 소나티네',duration:'24주',prereq:'초급 수료'},
    {level:'상급',desc:'쇼팡, 베토벤 소나타',duration:'48주+',prereq:'중급 수료'}
  ]},
  {name:'요가',icon:'🧘',levels:[
    {level:'입문',desc:'호흡법, 기본 아사나',duration:'4주',prereq:'없음'},
    {level:'초급',desc:'태양 예배, 빈야사',duration:'8주',prereq:'입문 수료'},
    {level:'중급',desc:'균형 아사나, 인버전',duration:'16주',prereq:'초급 수료'},
    {level:'상급',desc:'고급 팔적시, 명상 마스터',duration:'24주+',prereq:'중급 수료'}
  ]},
  {name:'미술',icon:'🎨',levels:[
    {level:'입문',desc:'선 그리기, 소므 기초',duration:'4주',prereq:'없음'},
    {level:'초급',desc:'정물화, 수채화 입문',duration:'8주',prereq:'입문 수료'},
    {level:'중급',desc:'인물화, 풍경화, 유화',duration:'16주',prereq:'초급 수료'},
    {level:'상급',desc:'전시 작품 제작',duration:'24주+',prereq:'중급 수료'}
  ]},
  {name:'발레',icon:'🩰',levels:[
    {level:'입문',desc:'바 워크, 플리에',duration:'4주',prereq:'없음'},
    {level:'초급',desc:'센터 워크, 포인트',duration:'12주',prereq:'입문 수료'},
    {level:'중급',desc:'아다지오, 알레그로',duration:'24주',prereq:'초급 수료'},
    {level:'상급',desc:'발표회 작품, 토슈즈',duration:'48주+',prereq:'중급 수료'}
  ]},
  {name:'쿠킹/베이킹',icon:'🍳',levels:[
    {level:'입문',desc:'기본 칼질, 계량, 위생',duration:'4주',prereq:'없음'},
    {level:'초급',desc:'기본 반찬, 한식 기초',duration:'8주',prereq:'입문 수료'},
    {level:'중급',desc:'양식/중식, 디저트',duration:'16주',prereq:'초급 수료'},
    {level:'상급',desc:'코스 요리, 전문 제과',duration:'24주+',prereq:'중급 수료'}
  ]},
  {name:'댄스/K-POP',icon:'💃',levels:[
    {level:'입문',desc:'기본 스텝, 리듬감',duration:'4주',prereq:'없음'},
    {level:'초급',desc:'안무 따라하기',duration:'8주',prereq:'입문 수료'},
    {level:'중급',desc:'커버댓스, 프리스타일',duration:'16주',prereq:'초급 수료'},
    {level:'상급',desc:'공연 무대, 안무 창작',duration:'24주+',prereq:'중급 수료'}
  ]},
  {name:'악기(기타/우클)',icon:'🎸',levels:[
    {level:'입문',desc:'코드 4개, 스트로크',duration:'4주',prereq:'없음'},
    {level:'초급',desc:'기본 반주, 아르페지오',duration:'8주',prereq:'입문 수료'},
    {level:'중급',desc:'핑거피킹, 바레 코드',duration:'16주',prereq:'초급 수료'},
    {level:'상급',desc:'연주회, 밴드 합주',duration:'24주+',prereq:'중급 수료'}
  ]},
  {name:'어학(영어)',icon:'🌍',levels:[
    {level:'입문',desc:'알파벳, 기초 인사',duration:'4주',prereq:'없음'},
    {level:'초급',desc:'생활회화, 기초 문법',duration:'12주',prereq:'입문 수료'},
    {level:'중급',desc:'토익/토플, 비즈니스 영어',duration:'24주',prereq:'초급 수료'},
    {level:'상급',desc:'원어민 프리토킹',duration:'48주+',prereq:'중급 수료'}
  ]},
  {name:'공예/도예',icon:'🎨',levels:[
    {level:'입문',desc:'흑 반죽, 기초 성형',duration:'4주',prereq:'없음'},
    {level:'초급',desc:'유약, 굴림기법',duration:'8주',prereq:'입문 수료'},
    {level:'중급',desc:'유약 장식, 조형미',duration:'16주',prereq:'초급 수료'},
    {level:'상급',desc:'작품 전시, 창작 도예',duration:'24주+',prereq:'중급 수료'}
  ]}
];

function openDifficultyGuide(){
  SFX11.play('difficulty_view');
  trackFeature11('difficulty');
  checkAchieve11('difficulty_explorer');

  const{modal,box}=makeModal11('📖 강좌 난이도 가이드','종목별 난이도 단계와 필수 선수과목');

  const grid=ce('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'12px'}});
  DIFFICULTY_COURSES.forEach(course=>{
    const card=ce('div',{style:{
      background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'14px',
      padding:'14px',transition:'all .2s'
    }});
    let html='<div style="font-size:18px;margin-bottom:8px">'+course.icon+' <span style="font-weight:700;color:var(--accent)">'+esc(course.name)+'</span></div>';
    const colors=['#22C55E','#3B82F6','#F59E0B','#EF4444'];
    course.levels.forEach((lv,i)=>{
      html+='<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px">'+
        '<div style="min-width:6px;min-height:6px;width:6px;height:6px;border-radius:50%;background:'+colors[i]+';margin-top:6px"></div>'+
        '<div><div style="font-size:12px;font-weight:700;color:'+colors[i]+'">'+esc(lv.level)+' <span style="color:var(--text-secondary);font-weight:400">('+esc(lv.duration)+')</span></div>'+
        '<div style="font-size:11px;color:var(--text-secondary)">'+esc(lv.desc)+'</div>'+
        '<div style="font-size:10px;color:var(--text-muted)">선수: '+esc(lv.prereq)+'</div></div></div>';
    });
    card.innerHTML=html;
    card.addEventListener('mouseenter',()=>{card.style.borderColor='var(--accent)';card.style.transform='translateY(-2px)';});
    card.addEventListener('mouseleave',()=>{card.style.borderColor='var(--card-border)';card.style.transform='none';});
    grid.appendChild(card);
  });
  box.appendChild(grid);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 3. 학습 커뮤니티 게시판 12종
// ═══════════════════════════════════════
const COMMUNITY_BOARDS=[
  {id:'free',name:'자유게시판',icon:'💬',desc:'수강생 자유 소통'},
  {id:'review',name:'수강후기',icon:'⭐',desc:'강좌 수강 후기'},
  {id:'qna',name:'질문과답변',icon:'❓',desc:'강좌/센터 질문'},
  {id:'tip',name:'학습팁',icon:'💡',desc:'수강 팁 공유'},
  {id:'meetup',name:'모임/스터디',icon:'🤝',desc:'함께 배우기'},
  {id:'market',name:'장터',icon:'🛒',desc:'재료/장비 거래'},
  {id:'show',name:'작품자랑',icon:'🎨',desc:'배운 결과 공유'},
  {id:'info',name:'정보공유',icon:'📢',desc:'센터/강좌 정보'},
  {id:'challenge',name:'챌린지',icon:'🏆',desc:'주간 학습 목표'},
  {id:'mentor',name:'멘토링',icon:'🌟',desc:'선배 조언'},
  {id:'event',name:'이벤트',icon:'🎉',desc:'발표회/콘테스트'},
  {id:'feedback',name:'개선건의',icon:'📝',desc:'센터 개선 요청'}
];

function openCommunityBoard(){
  SFX11.play('community_open');
  trackFeature11('community');
  checkAchieve11('community_first');

  const{modal,box}=makeModal11('💬 학습 커뮤니티 게시판','12개 게시판에서 수강생들과 소통하세요');

  const posts=lsGet('cc-v11-community',{});
  let currentBoard='free';

  const tabWrap=ce('div',{style:{display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'16px'}});
  const contentWrap=ce('div');

  function renderTabs(){
    tabWrap.innerHTML='';
    COMMUNITY_BOARDS.forEach(b=>{
      const count=(posts[b.id]||[]).length;
      const btn=ce('button',{style:{
        padding:'6px 12px',borderRadius:'10px',border:'1px solid '+(currentBoard===b.id?'var(--accent)':'var(--card-border)'),
        background:currentBoard===b.id?'rgba(126,200,227,0.12)':'var(--card-bg)',
        color:currentBoard===b.id?'var(--accent)':'var(--text-secondary)',
        fontSize:'11px',cursor:'pointer',transition:'all .2s',fontWeight:currentBoard===b.id?'700':'400'
      },onClick:()=>{currentBoard=b.id;renderTabs();renderBoard();}},
      b.icon+' '+b.name+(count?' ('+count+')':''));
      tabWrap.appendChild(btn);
    });
  }

  function renderBoard(){
    contentWrap.innerHTML='';
    const board=COMMUNITY_BOARDS.find(b=>b.id===currentBoard);
    const boardPosts=posts[currentBoard]||[];

    const inputWrap=ce('div',{style:{display:'flex',gap:'8px',marginBottom:'12px'}});
    const input=ce('input',{style:{
      flex:1,padding:'10px 14px',background:'var(--input-bg)',border:'1px solid var(--input-border)',
      borderRadius:'10px',color:'var(--text)',fontSize:'13px',boxSizing:'border-box'
    }});
    input.placeholder=board.name+'에 글을 작성하세요...';
    const postBtn=ce('button',{style:{
      padding:'10px 16px',background:'linear-gradient(135deg,#7EC8E3,#3AAFA9)',border:'none',
      borderRadius:'10px',color:'#fff',fontSize:'13px',fontWeight:'700',cursor:'pointer',whiteSpace:'nowrap'
    },onClick:()=>{
      const text=input.value.trim();
      if(!text)return;
      if(!posts[currentBoard])posts[currentBoard]=[];
      posts[currentBoard].unshift({text:esc(text),date:fmtDate11(),time:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'}),likes:0});
      if(posts[currentBoard].length>30)posts[currentBoard].pop();
      lsSet('cc-v11-community',posts);
      input.value='';
      SFX11.play('community_open');
      showToast11('✅ 글이 등록되었습니다');
      renderBoard();renderTabs();
    }},'등록');
    inputWrap.appendChild(input);
    inputWrap.appendChild(postBtn);
    contentWrap.appendChild(inputWrap);

    if(boardPosts.length===0){
      contentWrap.appendChild(ce('div',{style:{textAlign:'center',padding:'24px',color:'var(--text-secondary)',fontSize:'13px'}},
        board.icon+' '+board.desc+' - 첫 번째 글을 작성해보세요!'));
    }else{
      boardPosts.forEach((p,i)=>{
        const card=ce('div',{style:{
          background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'10px',
          padding:'10px',marginBottom:'6px',transition:'all .2s'
        }});
        card.innerHTML='<div style="display:flex;justify-content:space-between;margin-bottom:4px">'+
          '<span style="font-size:11px;color:var(--text-secondary)">'+p.date+' '+p.time+'</span>'+
          '<span style="font-size:11px;color:var(--accent);cursor:pointer" onclick="this.textContent=\'❤️ \'+(parseInt(this.dataset.likes||0)+1);this.dataset.likes=parseInt(this.dataset.likes||0)+1" data-likes="'+p.likes+'">❤️ '+p.likes+'</span></div>'+
          '<div style="font-size:13px;color:var(--text)">'+p.text+'</div>';
        card.addEventListener('mouseenter',()=>{card.style.borderColor='var(--accent)';});
        card.addEventListener('mouseleave',()=>{card.style.borderColor='var(--card-border)';});
        contentWrap.appendChild(card);
      });
    }
  }

  box.appendChild(tabWrap);
  box.appendChild(contentWrap);
  renderTabs();
  renderBoard();
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 4. 센터 접근성 평가 8항목 Canvas
// ═══════════════════════════════════════
const ACCESS_CRITERIA=[
  {name:'주차장',desc:'무료/유료 주차 시설',max:10,color:'#3B82F6'},
  {name:'대중교통',desc:'지하철/버스 접근성',max:10,color:'#22C55E'},
  {name:'엘리베이터',desc:'장애인/유모차 접근',max:10,color:'#F59E0B'},
  {name:'화장실',desc:'청결도, 장애인 화장실',max:10,color:'#EF4444'},
  {name:'휴게공간',desc:'대기실, 카페테리아',max:10,color:'#8B5CF6'},
  {name:'안전시설',desc:'CCTV, 비상구, 소화기',max:10,color:'#EC4899'},
  {name:'시설 상태',desc:'건물 노후도, 청결',max:10,color:'#06B6D4'},
  {name:'온라인 지원',desc:'온라인 수강, 앱 지원',max:10,color:'#84CC16'}
];

function openAccessEvaluation(){
  SFX11.play('access_check');
  trackFeature11('access');

  const{modal,box}=makeModal11('♿ 센터 접근성 평가','8개 항목으로 센터 접근성을 평가하세요');

  const scores=lsGet('cc-v11-access-scores',ACCESS_CRITERIA.map(()=>5));
  const sliders=[];

  ACCESS_CRITERIA.forEach((c,i)=>{
    const row=ce('div',{style:{marginBottom:'10px'}});
    row.innerHTML='<div style="display:flex;justify-content:space-between;margin-bottom:2px">'+
      '<span style="font-size:12px;font-weight:700;color:'+c.color+'">'+esc(c.name)+'</span>'+
      '<span id="v11-acc-val-'+i+'" style="font-size:12px;color:var(--accent);font-weight:700">'+scores[i]+'/'+c.max+'</span></div>'+
      '<div style="font-size:10px;color:var(--text-secondary);margin-bottom:4px">'+esc(c.desc)+'</div>';
    const slider=ce('input');
    slider.type='range';slider.min=0;slider.max=c.max;slider.value=scores[i];
    slider.style.cssText='width:100%;accent-color:'+c.color;
    slider.addEventListener('input',()=>{
      scores[i]=parseInt(slider.value);
      document.getElementById('v11-acc-val-'+i).textContent=scores[i]+'/'+c.max;
      lsSet('cc-v11-access-scores',scores);
      drawRadar();
    });
    sliders.push(slider);
    row.appendChild(slider);
    box.appendChild(row);
  });

  const canvas=ce('canvas',{width:400,height:400,style:{width:'100%',maxWidth:'400px',height:'auto',borderRadius:'12px',margin:'16px auto',display:'block'}});
  box.appendChild(canvas);

  const resultDiv=ce('div',{style:{textAlign:'center',marginTop:'8px'}});
  box.appendChild(resultDiv);

  function drawRadar(){
    const ctx=canvas.getContext('2d');
    const W=400,H=400;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    const cx=W/2,cy=H/2+10,r=140;
    const n=ACCESS_CRITERIA.length;
    const angleStep=Math.PI*2/n;

    for(let ring=1;ring<=5;ring++){
      const rr=r*(ring/5);
      ctx.beginPath();
      for(let i=0;i<n;i++){
        const angle=-Math.PI/2+i*angleStep;
        const x=cx+Math.cos(angle)*rr;
        const y=cy+Math.sin(angle)*rr;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.strokeStyle=isDark()?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)';
      ctx.lineWidth=1;
      ctx.stroke();
    }

    for(let i=0;i<n;i++){
      const angle=-Math.PI/2+i*angleStep;
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);
      ctx.strokeStyle=isDark()?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.15)';
      ctx.stroke();

      const labelR=r+20;
      const lx=cx+Math.cos(angle)*labelR;
      const ly=cy+Math.sin(angle)*labelR;
      ctx.fillStyle=ACCESS_CRITERIA[i].color;
      ctx.font='bold 10px system-ui';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText(ACCESS_CRITERIA[i].name,lx,ly);
    }

    ctx.beginPath();
    scores.forEach((s,i)=>{
      const angle=-Math.PI/2+i*angleStep;
      const sr=r*(s/10);
      const x=cx+Math.cos(angle)*sr;
      const y=cy+Math.sin(angle)*sr;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.closePath();
    ctx.fillStyle='rgba(126,200,227,0.25)';
    ctx.fill();
    ctx.strokeStyle='#7EC8E3';
    ctx.lineWidth=2;
    ctx.stroke();

    scores.forEach((s,i)=>{
      const angle=-Math.PI/2+i*angleStep;
      const sr=r*(s/10);
      const x=cx+Math.cos(angle)*sr;
      const y=cy+Math.sin(angle)*sr;
      ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);
      ctx.fillStyle=ACCESS_CRITERIA[i].color;ctx.fill();
    });

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 15px system-ui';
    ctx.textAlign='center';
    ctx.fillText('센터 접근성 평가',cx,22);

    const avg=Math.round(scores.reduce((a,b)=>a+b,0)/n*10)/10;
    const grade=avg>=9?'S':avg>=7.5?'A':avg>=6?'B':avg>=4?'C':'D';
    const gradeColor=avg>=7.5?'#22C55E':avg>=5?'#F59E0B':'#EF4444';

    resultDiv.innerHTML='<div style="font-size:24px;font-weight:900;color:'+gradeColor+'">'+grade+' 등급</div>'+
      '<div style="font-size:14px;color:var(--text-secondary)">평균 '+avg+'/10</div>';
  }
  drawRadar();

  const submitBtn=ce('button',{style:{
    display:'block',margin:'12px auto 0',padding:'10px 24px',background:'linear-gradient(135deg,#7EC8E3,#3AAFA9)',
    border:'none',borderRadius:'10px',color:'#fff',fontSize:'14px',fontWeight:'700',cursor:'pointer'
  },onClick:()=>{
    SFX11.play('access_check');
    checkAchieve11('access_evaluator');
    showToast11('✅ 접근성 평가 저장 완료!');
  }},'💾 평가 저장');
  box.appendChild(submitBtn);

  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 5. 강좌 추천 퀴즈 인터랙티브
// ═══════════════════════════════════════
const RECOMMEND_QUESTIONS=[
  {q:'주로 언제 수강하고 싶으세요?',opts:['평일 오전','평일 오후','주말','상관없음'],key:'time'},
  {q:'선호하는 활동 유형은?',opts:['신체 활동','창작/예술','악기/음악','학습/어학'],key:'type'},
  {q:'운동 강도 선호도는?',opts:['가벼운 스트레칭','중간 강도','격렬한 운동','운동 안함'],key:'intensity'},
  {q:'예산 범위는?',opts:['5만원 이하','5~10만원','10~20만원','20만원 이상'],key:'budget'},
  {q:'함께 배우고 싶은 사람은?',opts:['혼자','친구와','가족과','새로운 사람들'],key:'with'}
];

const RECOMMEND_RESULTS={
  '신체 활동':['수영','요가','필라테스','태권도','발레','댄스'],
  '창작/예술':['미술','도예','캘리그라피','꽃꼽이','목공','드로잉'],
  '악기/음악':['피아노','기타','우클렐레','바이올린','색소폰','드럼'],
  '학습/어학':['영어회화','중국어','일본어','컴퓨터','자격증','독서']
};

function openRecommendQuiz(){
  SFX11.play('recommend_spin');
  trackFeature11('recommend');

  const{modal,box}=makeModal11('🎯 강좌 추천 퀴즈','답변을 기반으로 나에게 딱 맞는 강좌를 추천합니다');

  let currentQ=0;
  const answers={};
  const qWrap=ce('div');

  function renderQuestion(){
    qWrap.innerHTML='';
    if(currentQ>=RECOMMEND_QUESTIONS.length){
      renderResult();
      return;
    }
    const q=RECOMMEND_QUESTIONS[currentQ];
    qWrap.appendChild(ce('div',{style:{
      fontSize:'11px',color:'var(--text-secondary)',marginBottom:'8px'
    }},(currentQ+1)+'/'+RECOMMEND_QUESTIONS.length));

    qWrap.appendChild(ce('h3',{style:{fontSize:'16px',color:'var(--text)',marginBottom:'16px'}},esc(q.q)));

    q.opts.forEach((opt,i)=>{
      const btn=ce('button',{style:{
        display:'block',width:'100%',padding:'12px 16px',marginBottom:'8px',
        background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'12px',
        color:'var(--text)',fontSize:'14px',cursor:'pointer',textAlign:'left',transition:'all .2s'
      },onClick:()=>{
        answers[q.key]=opt;
        SFX11.play('recommend_spin');
        currentQ++;
        renderQuestion();
      }},esc(opt));
      btn.addEventListener('mouseenter',()=>{btn.style.borderColor='var(--accent)';btn.style.background='rgba(126,200,227,0.08)';});
      btn.addEventListener('mouseleave',()=>{btn.style.borderColor='var(--card-border)';btn.style.background='var(--card-bg)';});
      qWrap.appendChild(btn);
    });
  }

  function renderResult(){
    checkAchieve11('recommend_user');
    const typeAnswer=answers.type||'신체 활동';
    const courses=RECOMMEND_RESULTS[typeAnswer]||RECOMMEND_RESULTS['신체 활동'];

    qWrap.innerHTML='<div style="text-align:center;margin-bottom:16px">'+
      '<div style="font-size:40px;margin-bottom:8px">🎉</div>'+
      '<h3 style="color:var(--accent);margin:0">추천 결과</h3></div>';

    const grid=ce('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:'8px'}});
    courses.forEach((c,i)=>{
      const card=ce('div',{style:{
        background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'12px',
        padding:'12px',textAlign:'center',transition:'all .2s',animation:'v11SlideRight .3s ease '+(i*0.1)+'s both'
      }});
      const match=Math.round(85+Math.random()*15);
      card.innerHTML='<div style="font-size:22px;margin-bottom:6px">🌟</div>'+
        '<div style="font-size:14px;font-weight:700;color:var(--accent)">'+esc(c)+'</div>'+
        '<div style="font-size:24px;font-weight:900;color:#22C55E;margin:4px 0">'+match+'%</div>'+
        '<div style="font-size:10px;color:var(--text-secondary)">적합도</div>';
      card.addEventListener('mouseenter',()=>{card.style.borderColor='var(--accent)';card.style.transform='translateY(-3px)';});
      card.addEventListener('mouseleave',()=>{card.style.borderColor='var(--card-border)';card.style.transform='none';});
      grid.appendChild(card);
    });
    qWrap.appendChild(grid);

    const summary=ce('div',{style:{
      background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'12px',
      padding:'12px',marginTop:'12px',fontSize:'12px',color:'var(--text-secondary)'
    }});
    summary.innerHTML='📋 <b style="color:var(--accent)">분석 결과</b><br>'+
      '시간: '+esc(answers.time||'-')+' | 유형: '+esc(answers.type||'-')+
      ' | 강도: '+esc(answers.intensity||'-')+' | 예산: '+esc(answers.budget||'-')+
      ' | 함께: '+esc(answers['with']||'-');
    qWrap.appendChild(summary);
  }

  renderQuestion();
  box.appendChild(qWrap);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 6. 수강 목표 트래커 6종 Canvas
// ═══════════════════════════════════════
const GOAL_TEMPLATES=[
  {id:'lesson_count',name:'수강 횟수',icon:'📚',target:20,unit:'회',desc:'월간 수강 횟수 목표'},
  {id:'new_course',name:'신규 강좌',icon:'🆕',target:3,unit:'개',desc:'새로운 강좌 도전'},
  {id:'review_write',name:'후기 작성',icon:'✍️',target:5,unit:'건',desc:'수강 후기 작성'},
  {id:'study_hours',name:'학습 시간',icon:'⏰',target:30,unit:'시간',desc:'월간 총 학습 시간'},
  {id:'quiz_score',name:'퀴즈 점수',icon:'🏆',target:90,unit:'점',desc:'퀴즈 평균 점수 목표'},
  {id:'streak',name:'연속 학습',icon:'🔥',target:7,unit:'일',desc:'연속 학습일 목표'}
];

function openGoalTracker(){
  SFX11.play('goal_set');
  trackFeature11('goal');
  checkAchieve11('goal_setter');

  const{modal,box}=makeModal11('🎯 수강 목표 트래커','6가지 목표를 설정하고 달성하세요');

  const goals=lsGet('cc-v11-goals',GOAL_TEMPLATES.map(t=>({...t,current:0})));

  const canvas=ce('canvas',{width:640,height:360,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'16px'}});
  box.appendChild(canvas);

  function drawGoalChart(){
    const ctx=canvas.getContext('2d');
    const W=640,H=360;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 16px system-ui';
    ctx.textAlign='center';
    ctx.fillText('수강 목표 달성도',W/2,28);

    const barH=36;
    const gap=10;
    const startY=50;
    const labelW=100;
    const barStartX=labelW+10;
    const barMaxW=W-barStartX-100;
    const colors=['#3B82F6','#22C55E','#F59E0B','#EF4444','#8B5CF6','#EC4899'];

    goals.forEach((g,i)=>{
      const y=startY+i*(barH+gap);
      const pct=Math.min(g.current/g.target,1);

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.6)':'#475569';
      ctx.font='bold 11px system-ui';
      ctx.textAlign='right';
      ctx.textBaseline='middle';
      ctx.fillText(g.name,labelW,y+barH/2);

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)';
      ctx.beginPath();ctx.roundRect(barStartX,y,barMaxW,barH,8);ctx.fill();

      const grad=ctx.createLinearGradient(barStartX,y,barStartX+barMaxW*pct,y);
      grad.addColorStop(0,colors[i]+'CC');grad.addColorStop(1,colors[i]+'66');
      ctx.fillStyle=grad;
      ctx.beginPath();ctx.roundRect(barStartX,y,Math.max(barMaxW*pct,4),barH,8);ctx.fill();

      ctx.fillStyle='#fff';
      ctx.font='bold 11px system-ui';
      ctx.textAlign='center';
      if(barMaxW*pct>40){
        ctx.fillText(Math.round(pct*100)+'%',barStartX+barMaxW*pct/2,y+barH/2);
      }

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.7)':'#475569';
      ctx.textAlign='left';
      ctx.fillText(g.current+'/'+g.target+g.unit,barStartX+barMaxW+8,y+barH/2);
    });

    const achieved=goals.filter(g=>g.current>=g.target).length;
    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 13px system-ui';
    ctx.textAlign='center';
    ctx.fillText('달성: '+achieved+'/'+goals.length+' 목표',W/2,H-16);
  }
  drawGoalChart();

  const grid=ce('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'8px'}});
  goals.forEach((g,i)=>{
    const pct=Math.min(Math.round(g.current/g.target*100),100);
    const done=g.current>=g.target;
    const card=ce('div',{style:{
      background:'var(--card-bg)',border:'1px solid '+(done?'#22C55E':'var(--card-border)'),borderRadius:'12px',
      padding:'10px',transition:'all .2s'
    }});
    card.innerHTML='<div style="font-size:20px;text-align:center">'+g.icon+'</div>'+
      '<div style="font-size:13px;font-weight:700;color:var(--accent);text-align:center">'+esc(g.name)+'</div>'+
      '<div style="font-size:10px;color:var(--text-secondary);text-align:center;margin-bottom:6px">'+esc(g.desc)+'</div>'+
      '<div style="text-align:center;font-size:20px;font-weight:900;color:'+(done?'#22C55E':'var(--text)')+'">'+(done?'✅ ':'')+g.current+'/'+g.target+g.unit+'</div>';

    const btnWrap=ce('div',{style:{display:'flex',gap:'4px',marginTop:'6px',justifyContent:'center'}});
    const plusBtn=ce('button',{style:{
      padding:'4px 10px',borderRadius:'8px',border:'1px solid var(--card-border)',
      background:'var(--card-bg)',color:'var(--accent)',fontSize:'14px',cursor:'pointer'
    },onClick:()=>{
      goals[i].current=Math.min(goals[i].current+1,goals[i].target*2);
      lsSet('cc-v11-goals',goals);
      SFX11.play('goal_set');
      showToast11(g.icon+' '+g.name+': '+goals[i].current+'/'+goals[i].target+g.unit);
      if(goals[i].current>=goals[i].target){
        const achievedCount=goals.filter(x=>x.current>=x.target).length;
        if(achievedCount>=3)checkAchieve11('goal_achiever');
      }
      modal.remove();
      openGoalTracker();
    }},'+1');
    const resetBtn=ce('button',{style:{
      padding:'4px 10px',borderRadius:'8px',border:'1px solid var(--card-border)',
      background:'var(--card-bg)',color:'var(--text-secondary)',fontSize:'12px',cursor:'pointer'
    },onClick:()=>{
      goals[i].current=0;
      lsSet('cc-v11-goals',goals);
      modal.remove();
      openGoalTracker();
    }},'초기화');
    btnWrap.appendChild(plusBtn);
    btnWrap.appendChild(resetBtn);
    card.appendChild(btnWrap);
    grid.appendChild(card);
  });
  box.appendChild(grid);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 7. 강좌 비교 분석기 Canvas 4종
// ═══════════════════════════════════════
const COMPARE_COURSES=[
  {name:'홈플러스 문화센터',price:85000,courses:320,rating:4.2,access:8,facility:7,instructor:8},
  {name:'롯데문화센터',price:92000,courses:280,rating:4.5,access:9,facility:8,instructor:9},
  {name:'현대백화점 문화센터',price:120000,courses:250,rating:4.7,access:7,facility:9,instructor:9},
  {name:'이마트 문화센터',price:78000,courses:200,rating:4.0,access:8,facility:6,instructor:7}
];

function openCompareAnalyzer(){
  SFX11.play('compare_open');
  trackFeature11('compare');
  checkAchieve11('compare_analyst');

  const{modal,box}=makeModal11('📊 강좌 비교 분석기','주요 문화센터 4곳 비교 분석');

  const canvas=ce('canvas',{width:640,height:400,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'16px'}});
  box.appendChild(canvas);

  const colors=['#3B82F6','#22C55E','#F59E0B','#EF4444'];
  let chartType=0;
  const chartTypes=['가격 비교','강좌수 비교','평점 비교','종합 레이더'];

  function drawCompareChart(){
    const ctx=canvas.getContext('2d');
    const W=640,H=400;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 15px system-ui';
    ctx.textAlign='center';
    ctx.fillText(chartTypes[chartType],W/2,28);

    if(chartType===3){
      const cx=W/2,cy=H/2+10,r=130;
      const axes=['가격','강좌수','평점','접근성','시설','강사'];
      const n=axes.length;
      const angleStep=Math.PI*2/n;

      for(let ring=1;ring<=5;ring++){
        const rr=r*(ring/5);
        ctx.beginPath();
        for(let i=0;i<n;i++){
          const angle=-Math.PI/2+i*angleStep;
          const x=cx+Math.cos(angle)*rr;
          const y=cy+Math.sin(angle)*rr;
          i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        }
        ctx.closePath();
        ctx.strokeStyle=isDark()?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)';
        ctx.stroke();
      }
      for(let i=0;i<n;i++){
        const angle=-Math.PI/2+i*angleStep;
        ctx.beginPath();ctx.moveTo(cx,cy);
        ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);
        ctx.strokeStyle=isDark()?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.12)';
        ctx.stroke();
        const lx=cx+Math.cos(angle)*(r+18);
        const ly=cy+Math.sin(angle)*(r+18);
        ctx.fillStyle=isDark()?'rgba(255,255,255,0.6)':'#475569';
        ctx.font='bold 10px system-ui';
        ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(axes[i],lx,ly);
      }

      COMPARE_COURSES.forEach((c,ci)=>{
        const vals=[10-c.price/15000,c.courses/40,c.rating*2,c.access,c.facility,c.instructor];
        ctx.beginPath();
        vals.forEach((v,i)=>{
          const angle=-Math.PI/2+i*angleStep;
          const sr=r*(Math.min(v,10)/10);
          const x=cx+Math.cos(angle)*sr;
          const y=cy+Math.sin(angle)*sr;
          i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
        });
        ctx.closePath();
        ctx.fillStyle=colors[ci]+'30';ctx.fill();
        ctx.strokeStyle=colors[ci];ctx.lineWidth=2;ctx.stroke();
      });

      COMPARE_COURSES.forEach((c,ci)=>{
        ctx.fillStyle=colors[ci];
        ctx.beginPath();ctx.roundRect(W/2-200+ci*100,H-30,12,12,3);ctx.fill();
        ctx.fillStyle=isDark()?'rgba(255,255,255,0.7)':'#475569';
        ctx.font='9px system-ui';ctx.textAlign='left';
        ctx.fillText(c.name.replace(/ 문화센터/,''),W/2-200+ci*100+16,H-22);
      });
    }else{
      const barW=80;
      const gap=40;
      const startX=100;
      const maxH=260;
      const baseY=H-60;

      let values,maxVal,unit;
      if(chartType===0){values=COMPARE_COURSES.map(c=>c.price);maxVal=Math.max(...values);unit='원';}
      else if(chartType===1){values=COMPARE_COURSES.map(c=>c.courses);maxVal=Math.max(...values);unit='개';}
      else{values=COMPARE_COURSES.map(c=>c.rating);maxVal=5;unit='점';}

      values.forEach((v,i)=>{
        const x=startX+i*(barW+gap);
        const h=(v/maxVal)*maxH;

        const grad=ctx.createLinearGradient(x,baseY-h,x,baseY);
        grad.addColorStop(0,colors[i]);grad.addColorStop(1,colors[i]+'66');
        ctx.fillStyle=grad;
        ctx.beginPath();ctx.roundRect(x,baseY-h,barW,h,8);ctx.fill();

        ctx.fillStyle=isDark()?'#fff':'#1E293B';
        ctx.font='bold 12px system-ui';
        ctx.textAlign='center';
        ctx.fillText(chartType===0?Math.round(v/10000)+'만':chartType===1?v+unit:v.toFixed(1)+unit,x+barW/2,baseY-h-10);

        ctx.fillStyle=isDark()?'rgba(255,255,255,0.6)':'#475569';
        ctx.font='10px system-ui';
        const name=COMPARE_COURSES[i].name.replace(/ 문화센터/,'');
        ctx.fillText(name,x+barW/2,baseY+18);
      });
    }
  }
  drawCompareChart();

  const tabWrap=ce('div',{style:{display:'flex',gap:'6px',marginBottom:'12px',flexWrap:'wrap'}});
  chartTypes.forEach((t,i)=>{
    const btn=ce('button',{style:{
      padding:'6px 14px',borderRadius:'10px',border:'1px solid '+(chartType===i?'var(--accent)':'var(--card-border)'),
      background:chartType===i?'rgba(126,200,227,0.12)':'var(--card-bg)',
      color:chartType===i?'var(--accent)':'var(--text-secondary)',fontSize:'12px',cursor:'pointer',fontWeight:'700'
    },onClick:()=>{
      chartType=i;
      SFX11.play('compare_open');
      drawCompareChart();
      tabWrap.querySelectorAll('button').forEach((b,j)=>{
        b.style.borderColor=j===i?'var(--accent)':'var(--card-border)';
        b.style.background=j===i?'rgba(126,200,227,0.12)':'var(--card-bg)';
        b.style.color=j===i?'var(--accent)':'var(--text-secondary)';
      });
    }},esc(t));
    tabWrap.appendChild(btn);
  });
  box.appendChild(tabWrap);

  const tableWrap=ce('div',{style:{overflowX:'auto',marginTop:'8px'}});
  let tableHtml='<table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="border-bottom:1px solid var(--card-border)">';
  tableHtml+='<th style="padding:8px;text-align:left;color:var(--accent)">센터</th>';
  ['월 수강료','강좌수','평점','접근성','시설','강사'].forEach(h=>{
    tableHtml+='<th style="padding:8px;text-align:center;color:var(--text-secondary)">'+h+'</th>';
  });
  tableHtml+='</tr></thead><tbody>';
  COMPARE_COURSES.forEach((c,i)=>{
    tableHtml+='<tr style="border-bottom:1px solid var(--card-border)">'+
      '<td style="padding:8px;color:'+colors[i]+';font-weight:700">'+esc(c.name)+'</td>'+
      '<td style="padding:8px;text-align:center;color:var(--text)">'+c.price.toLocaleString()+'원</td>'+
      '<td style="padding:8px;text-align:center;color:var(--text)">'+c.courses+'개</td>'+
      '<td style="padding:8px;text-align:center;color:var(--text)">'+c.rating+'/5</td>'+
      '<td style="padding:8px;text-align:center;color:var(--text)">'+c.access+'/10</td>'+
      '<td style="padding:8px;text-align:center;color:var(--text)">'+c.facility+'/10</td>'+
      '<td style="padding:8px;text-align:center;color:var(--text)">'+c.instructor+'/10</td></tr>';
  });
  tableHtml+='</tbody></table>';
  tableWrap.innerHTML=tableHtml;
  box.appendChild(tableWrap);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 8. 수강증명서 v2 Canvas PNG
// ═══════════════════════════════════════
function openCertGenerator(){
  SFX11.play('cert_gen');
  trackFeature11('cert');
  checkAchieve11('cert_holder');

  const{modal,box}=makeModal11('🎓 수강증명서 v2 발급','나만의 수강증명서를 PNG로 다운로드');

  const nameInput=ce('input',{style:{
    width:'100%',padding:'10px 14px',background:'var(--input-bg)',border:'1px solid var(--input-border)',
    borderRadius:'10px',color:'var(--text)',fontSize:'14px',marginBottom:'8px',boxSizing:'border-box'
  }});
  nameInput.placeholder='이름을 입력하세요';
  box.appendChild(nameInput);

  const courseInput=ce('input',{style:{
    width:'100%',padding:'10px 14px',background:'var(--input-bg)',border:'1px solid var(--input-border)',
    borderRadius:'10px',color:'var(--text)',fontSize:'14px',marginBottom:'8px',boxSizing:'border-box'
  }});
  courseInput.placeholder='강좌명을 입력하세요 (예: 수영 중급반)';
  box.appendChild(courseInput);

  const centerInput=ce('input',{style:{
    width:'100%',padding:'10px 14px',background:'var(--input-bg)',border:'1px solid var(--input-border)',
    borderRadius:'10px',color:'var(--text)',fontSize:'14px',marginBottom:'12px',boxSizing:'border-box'
  }});
  centerInput.placeholder='문화센터명 (예: 홈플러스 문화센터)';
  box.appendChild(centerInput);

  const canvas=ce('canvas',{width:700,height:500,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'12px'}});
  box.appendChild(canvas);

  function drawCert(){
    const ctx=canvas.getContext('2d');
    const W=700,H=500;
    ctx.clearRect(0,0,W,H);

    const bgGrad=ctx.createLinearGradient(0,0,W,H);
    bgGrad.addColorStop(0,'#0F172A');bgGrad.addColorStop(0.5,'#1E293B');bgGrad.addColorStop(1,'#0F172A');
    ctx.fillStyle=bgGrad;
    ctx.beginPath();ctx.roundRect(0,0,W,H,16);ctx.fill();

    ctx.strokeStyle='rgba(126,200,227,0.4)';ctx.lineWidth=3;
    ctx.beginPath();ctx.roundRect(12,12,W-24,H-24,12);ctx.stroke();
    ctx.strokeStyle='rgba(126,200,227,0.15)';ctx.lineWidth=1;
    ctx.beginPath();ctx.roundRect(20,20,W-40,H-40,10);ctx.stroke();

    for(let i=0;i<4;i++){
      const cx2=[30,W-30,30,W-30][i];
      const cy2=[30,30,H-30,H-30][i];
      ctx.beginPath();ctx.arc(cx2,cy2,8,0,Math.PI*2);
      ctx.fillStyle='rgba(126,200,227,0.3)';ctx.fill();
      ctx.beginPath();ctx.arc(cx2,cy2,3,0,Math.PI*2);
      ctx.fillStyle='#7EC8E3';ctx.fill();
    }

    ctx.fillStyle='#7EC8E3';
    ctx.font='bold 28px system-ui';
    ctx.textAlign='center';
    ctx.fillText('수 강 증 명 서',W/2,70);

    ctx.fillStyle='rgba(126,200,227,0.3)';
    ctx.font='12px system-ui';
    ctx.fillText('Certificate of Completion',W/2,92);

    const lineY=120;
    ctx.strokeStyle='rgba(126,200,227,0.2)';
    ctx.beginPath();ctx.moveTo(60,lineY);ctx.lineTo(W-60,lineY);ctx.stroke();

    const name=nameInput.value.trim()||'학습자';
    ctx.fillStyle='#fff';
    ctx.font='bold 32px system-ui';
    ctx.fillText(name,W/2,170);

    ctx.fillStyle='rgba(255,255,255,0.6)';
    ctx.font='14px system-ui';
    ctx.fillText('위 사람은 아래 강좌를 성실히 수강하였음을 증명합니다.',W/2,210);

    const course=courseInput.value.trim()||'문화센터 강좌';
    ctx.fillStyle='#7EC8E3';
    ctx.font='bold 22px system-ui';
    ctx.fillText(course,W/2,260);

    const center=centerInput.value.trim()||'문화센터';
    ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.font='14px system-ui';
    ctx.fillText('기관: '+center,W/2,295);

    ctx.fillText('발급일: '+fmtDate11(),W/2,330);

    ctx.fillStyle='rgba(126,200,227,0.15)';
    ctx.font='bold 80px system-ui';
    ctx.fillText('🎓',W/2,410);

    ctx.fillStyle='rgba(126,200,227,0.4)';
    ctx.font='bold 12px system-ui';
    ctx.fillText('문화센터 강좌 파인더 v11.0',W/2,H-30);

    ctx.fillStyle='rgba(126,200,227,0.2)';
    ctx.font='9px system-ui';
    const certId='CCF-'+fmtDate11().replace(/-/g,'')+'-'+Math.random().toString(36).substr(2,6).toUpperCase();
    ctx.fillText('No. '+certId,W/2,H-14);
  }
  drawCert();

  [nameInput,courseInput,centerInput].forEach(inp=>{
    inp.addEventListener('input',drawCert);
  });

  const btnWrap=ce('div',{style:{display:'flex',gap:'8px',justifyContent:'center'}});

  const dlBtn=ce('button',{style:{
    padding:'10px 20px',background:'linear-gradient(135deg,#7EC8E3,#3AAFA9)',
    border:'none',borderRadius:'10px',color:'#fff',fontSize:'14px',fontWeight:'700',cursor:'pointer'
  },onClick:()=>{
    drawCert();
    const link=document.createElement('a');
    link.download='수강증명서_'+(nameInput.value.trim()||'certificate')+'.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
    SFX11.play('cert_gen');
    showToast11('💾 PNG 다운로드 완료!');
  }},'💾 PNG 다운로드');

  const copyBtn=ce('button',{style:{
    padding:'10px 20px',background:'var(--card-bg)',border:'1px solid var(--card-border)',
    borderRadius:'10px',color:'var(--accent)',fontSize:'14px',fontWeight:'700',cursor:'pointer'
  },onClick:()=>{
    drawCert();
    canvas.toBlob(blob=>{
      if(blob&&navigator.clipboard&&window.ClipboardItem){
        navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(()=>{
          SFX11.play('cert_gen');
          showToast11('📋 클립보드 복사 완료!');
        }).catch(()=>showToast11('복사 실패 - 다운로드를 이용해주세요'));
      }else{
        showToast11('복사 미지원 - 다운로드를 이용해주세요');
      }
    },'image/png');
  }},'📋 클립보드');

  btnWrap.appendChild(dlBtn);
  btnWrap.appendChild(copyBtn);
  box.appendChild(btnWrap);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 퀴즈 v11 (+15문, 90→105)
// ═══════════════════════════════════════
const QUIZ_V11=[
  {q:'문화센터 수강후기에서 가장 중요한 평가 요소는?',opts:['가격','강사의 전문성','시설 청결도','주차장 유무'],a:1},
  {q:'수영 입문 과정에서 가장 먼저 배우는 것은?',opts:['자유형','물 적응 및 호흡법','배영','평영'],a:1},
  {q:'피아노 초급 과정에서 주로 배우는 교재는?',opts:['체르니 100','바이엘','소나타','평균률'],a:1},
  {q:'요가에서 태양 예배 A는 어느 단계에 해당하나요?',opts:['입문','초급','중급','상급'],a:1},
  {q:'문화센터 가격 비교 시 가장 경제적인 곳은?',opts:['홈플러스','롯데','현대백화점','이마트'],a:3},
  {q:'접근성 평가에서 엘리베이터 항목은 주로 누구를 위한 것인가요?',opts:['어린이','장애인/유모차 사용자','직원','강사'],a:1},
  {q:'커뮤니티 게시판에서 장터 게시판의 용도는?',opts:['수강 후기','재료/장비 거래','강좌 정보','챌린지'],a:1},
  {q:'수강 목표 트래커에서 연속 학습 목표의 기본값은?',opts:['3일','5일','7일','10일'],a:2},
  {q:'발레 상급 과정에서 배우는 것은?',opts:['플리에','발표회 작품, 토슈즈','바 워크','기본 스텝'],a:1},
  {q:'감성 분석에서 부정 키워드가 아닌 것은?',opts:['불만','아쉬','추천','불편'],a:2},
  {q:'수강증명서에 포함되지 않는 정보는?',opts:['이름','강좌명','발급일','주민등록번호'],a:3},
  {q:'강좌 추천 퀴즈에서 묻지 않는 항목은?',opts:['시간대','활동 유형','예산','혈액형'],a:3},
  {q:'문화센터 비교에서 평점이 가장 높은 곳은?',opts:['홈플러스','롯데','현대백화점','이마트'],a:2},
  {q:'쿠킹 초급 과정의 주요 내용은?',opts:['코스 요리','칼질 기초','기본 반찬, 한식 기초','전문 제과'],a:2},
  {q:'접근성 평가 항목은 총 몇 개인가요?',opts:['6개','8개','10개','12개'],a:1}
];

function openQuizV11(){
  SFX11.play('quiz_v11');
  trackFeature11('quiz');
  checkAchieve11('quiz_v11_try');

  const{modal,box}=makeModal11('🎓 문화센터 퀴즈 v11','15문항 4지선다 퀴즈');

  const shuffled=[...QUIZ_V11].sort(()=>Math.random()-0.5);
  let idx=0,score=0;
  const qWrap=ce('div');

  function renderQ(){
    qWrap.innerHTML='';
    if(idx>=shuffled.length){
      const pct=Math.round(score/shuffled.length*100);
      const grade=pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D';
      const gradeColor=pct>=75?'#22C55E':pct>=50?'#F59E0B':'#EF4444';
      qWrap.innerHTML='<div style="text-align:center;padding:20px">'+
        '<div style="font-size:48px;margin-bottom:8px">🏆</div>'+
        '<h3 style="color:var(--accent);margin:0 0 8px">퀴즈 완료!</h3>'+
        '<div style="font-size:36px;font-weight:900;color:'+gradeColor+'">'+grade+' 등급</div>'+
        '<div style="font-size:20px;color:var(--text);margin:4px 0">'+score+'/'+shuffled.length+' 정답 ('+pct+'%)</div></div>';
      return;
    }
    const q=shuffled[idx];
    qWrap.appendChild(ce('div',{style:{fontSize:'11px',color:'var(--text-secondary)',marginBottom:'8px'}},(idx+1)+'/'+shuffled.length));
    qWrap.appendChild(ce('h3',{style:{fontSize:'15px',color:'var(--text)',marginBottom:'12px'}},esc(q.q)));

    q.opts.forEach((opt,i)=>{
      const btn=ce('button',{style:{
        display:'block',width:'100%',padding:'10px 14px',marginBottom:'6px',
        background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'10px',
        color:'var(--text)',fontSize:'13px',cursor:'pointer',textAlign:'left',transition:'all .2s'
      },onClick:()=>{
        if(i===q.a){
          score++;
          SFX11.play('quiz_correct11');
          showToast11('✅ 정답!');
        }else{
          showToast11('❌ 오답! 정답: '+esc(q.opts[q.a]));
        }
        idx++;
        setTimeout(renderQ,600);
      }},esc(opt));
      btn.addEventListener('mouseenter',()=>{btn.style.borderColor='var(--accent)';});
      btn.addEventListener('mouseleave',()=>{btn.style.borderColor='var(--card-border)';});
      qWrap.appendChild(btn);
    });
  }
  renderQ();
  box.appendChild(qWrap);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 퀵 액션 레일 (좌측 9종)
// ═══════════════════════════════════════
function insertQuickActions11(){
  if(document.getElementById('v11-quick-actions'))return;
  const wrap=ce('div',{id:'v11-quick-actions',style:{
    position:'fixed',top:'200px',left:'6px',display:'flex',flexDirection:'column',gap:'5px',
    zIndex:'900',opacity:'0.7',transition:'opacity .3s'
  }});
  wrap.addEventListener('mouseenter',()=>{wrap.style.opacity='1';});
  wrap.addEventListener('mouseleave',()=>{wrap.style.opacity='0.7';});

  const actions=[
    {label:'✍️후기',fn:openReviewAnalyzer},
    {label:'📖난이도',fn:openDifficultyGuide},
    {label:'💬커뮤',fn:openCommunityBoard},
    {label:'♿접근성',fn:openAccessEvaluation},
    {label:'🎯추천',fn:openRecommendQuiz},
    {label:'🎯목표',fn:openGoalTracker},
    {label:'📊비교',fn:openCompareAnalyzer},
    {label:'🎓증명서',fn:openCertGenerator},
    {label:'🎓텀즈v11',fn:openQuizV11}
  ];

  actions.forEach(a=>{
    const btn=ce('button',{className:'v11-qbtn',style:{
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
function initKeyboard11(){
  document.addEventListener('keydown',e=>{
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;
    if(!e.shiftKey)return;
    const map={
      'R':openReviewAnalyzer,
      'N':openDifficultyGuide,
      'B':openCommunityBoard,
      'A':openAccessEvaluation,
      'Q':openRecommendQuiz,
      'T':openGoalTracker,
      'P':openCompareAnalyzer,
      'E':openCertGenerator
    };
    const fn=map[e.key.toUpperCase()];
    if(fn){
      e.preventDefault();
      const existing=document.getElementById('v11-modal');
      if(existing)existing.remove();
      fn();
    }
  });
}

// ═══════════════════════════════════════
// CSS
// ═══════════════════════════════════════
function injectV11Styles(){
  if(document.getElementById('v11-styles'))return;
  const style=ce('style',{id:'v11-styles'});
  style.textContent='@keyframes v11SlideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}'+
    '@keyframes v11SlideUp{from{transform:translateY(0);opacity:1}to{transform:translateY(-20px);opacity:0}}'+
    '@keyframes v11FadeIn{from{opacity:0}to{opacity:1}}'+
    '@keyframes v11SlideRight{from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}}'+
    '.v11-qbtn:active{transform:scale(0.95)!important}'+
    '#v11-modal::-webkit-scrollbar{width:6px}#v11-modal::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:3px}'+
    'body:has(.modal-overlay) #v11-quick-actions,body:has(.onboarding-overlay) #v11-quick-actions{display:none!important}'+
    '@media(max-width:480px){#v11-quick-actions{top:auto;bottom:70px;left:4px}.v11-qbtn{font-size:9px!important;padding:4px 6px!important}}';
  document.head.appendChild(style);
}

// ═══════════════════════════════════════
// 초기화
// ═══════════════════════════════════════
function init11(){
  injectV11Styles();

  setTimeout(()=>{
    insertQuickActions11();
    initKeyboard11();

    const milestones=lsGet('cc-milestones-v9',[]);
    const today=fmtDate11();
    const hasToday=milestones.some(m=>m.date===today&&m.text.includes('v11'));
    if(!hasToday){
      milestones.unshift({text:'v11.0 업데이트 적용',date:today,time:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})});
      if(milestones.length>50)milestones.pop();
      lsSet('cc-milestones-v9',milestones);
    }

    showToast11('✨ v11.0 후기분석+난이도가이드+커뮤니티+접근성평가+추천퀴즈+목표트래커+비교분석+증명서v2+텀즈v11',3500);
  },5000);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init11);
}else{
  init11();
}

})();
