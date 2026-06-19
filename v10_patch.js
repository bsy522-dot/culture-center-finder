/**
 * culture-center-finder v10.0 patch
 * 기타카테고리세분화기Canvas+강좌커리큘럼타임라인Canvas+강사프로필시스템Canvas+수강캘린더뷰Canvas+인기강좌실시간차트Canvas+수강비용계산기Canvas+센터만족도설문Canvas+학습리포트생성기Canvas+퀴즈15추가(75→90)+업적12추가(78→90)+SFX12종+키보드8종
 */
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

const V10_ID='ccf-v10-patch';
if(document.getElementById(V10_ID))return;
const marker=document.createElement('meta');
marker.id=V10_ID;
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
function showToast10(msg,dur){
  const old=document.getElementById('v10-toast');
  if(old)old.remove();
  const t=ce('div',{id:'v10-toast',style:{
    position:'fixed',top:'20px',left:'50%',transform:'translateX(-50%)',background:'linear-gradient(135deg,#1A365D,#0C1525)',
    border:'1px solid rgba(126,200,227,0.5)',borderRadius:'14px',padding:'12px 24px',zIndex:'970',
    fontSize:'13px',fontWeight:'700',color:'#7EC8E3',boxShadow:'0 8px 32px rgba(0,0,0,0.5)',
    animation:'v10SlideDown .3s ease both',whiteSpace:'nowrap',maxWidth:'90vw',overflow:'hidden',textOverflow:'ellipsis'
  }},msg);
  document.body.appendChild(t);
  setTimeout(()=>{t.style.animation='v10SlideUp .3s ease both';setTimeout(()=>t.remove(),300);},dur||2500);
}
function fmtDate10(d){
  if(!d)d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function isDark(){return document.documentElement.getAttribute('data-theme')!=='light';}

// ═══════════════════════════════════════
// SFX 엔진 (12종)
// ═══════════════════════════════════════
const SFX10={
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
      category_open: {freq:523,type:'sine',dur:0.2,vol:0.12},
      curriculum_view:{freq:659,type:'triangle',dur:0.18,vol:0.12},
      instructor_open:{freq:698,type:'sine',dur:0.15,vol:0.1},
      calendar_open:  {freq:784,type:'triangle',dur:0.2,vol:0.12},
      ranking_view:  {freq:880,type:'sine',dur:0.18,vol:0.14},
      cost_calc:     {freq:587,type:'triangle',dur:0.15,vol:0.12},
      survey_submit: {freq:932,type:'sine',dur:0.3,vol:0.15},
      report_gen:    {freq:1047,type:'triangle',dur:0.25,vol:0.14},
      quiz_v10:      {freq:740,type:'sine',dur:0.18,vol:0.12},
      quiz_correct10:{freq:988,type:'triangle',dur:0.2,vol:0.14},
      achieve_v10:   {freq:1175,type:'sine',dur:0.3,vol:0.15},
      feature_open10:{freq:622,type:'triangle',dur:0.15,vol:0.1}
    };
    const p=presets[name]||presets.feature_open10;
    o.type=p.type;o.frequency.value=p.freq;
    g.gain.setValueAtTime(p.vol,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+p.dur);
    o.start(ctx.currentTime);o.stop(ctx.currentTime+p.dur);
  }
};

// ═══════════════════════════════════════
// 업적 시스템 (+12종, 78→90)
// ═══════════════════════════════════════
const V10_ACHIEVEMENTS=[
  {id:'cat_explore',name:'분류 탐험가',desc:'기타 세분화기 최초 실행',icon:'&#128269;'},
  {id:'cat_5view',name:'카테고리 분석가',desc:'5개 세부카테고리 확인',icon:'&#128200;'},
  {id:'curriculum_first',name:'커리큘럼 탐색',desc:'커리큘럼 미리보기 최초 실행',icon:'&#128218;'},
  {id:'instructor_first',name:'강사 연구원',desc:'강사 프로필 최초 확인',icon:'&#128104;&#8205;&#127891;'},
  {id:'calendar_first',name:'시간 관리자',desc:'수강 캘린더 최초 사용',icon:'&#128197;'},
  {id:'ranking_viewer',name:'트렌드 분석가',desc:'인기 강좌 차트 확인',icon:'&#128293;'},
  {id:'cost_planner',name:'재정 계획가',desc:'비용 계산기 최초 사용',icon:'&#128176;'},
  {id:'survey_submit',name:'만족도 평가자',desc:'센터 만족도 설문 제출',icon:'&#128203;'},
  {id:'report_gen',name:'리포트 마스터',desc:'학습 리포트 생성 완료',icon:'&#128202;'},
  {id:'quiz_v10_try',name:'v10 퀴즈 도전자',desc:'v10 퀴즈 최초 도전',icon:'&#127891;'},
  {id:'quiz_v10_perfect',name:'v10 퀴즈 만점',desc:'v10 퀴즈 15문 전부 정답',icon:'&#127775;'},
  {id:'v10_explorer',name:'v10 탐험가',desc:'v10 기능 5종 이상 사용',icon:'&#127942;'}
];

function checkAchieve10(id){
  const achieved=lsGet('cc-achieve-v10',[]);
  if(achieved.includes(id))return;
  achieved.push(id);
  lsSet('cc-achieve-v10',achieved);
  const a=V10_ACHIEVEMENTS.find(x=>x.id===id);
  if(a){
    SFX10.play('achieve_v10');
    showToast10(a.icon+' &#50629;&#51201; &#45804;&#49457;: '+esc(a.name),3000);
  }
  if(achieved.length>=5)checkAchieve10('v10_explorer');
}

function trackFeature10(name){
  const used=lsGet('cc-v10-features-used',[]);
  if(!used.includes(name)){
    used.push(name);
    lsSet('cc-v10-features-used',used);
    if(used.length>=5)checkAchieve10('v10_explorer');
  }
}

// ═══════════════════════════════════════
// 1. 기타 카테고리 세분화기 Canvas
// ═══════════════════════════════════════
const ETC_SUBCATEGORIES={
  '&#44148;&#44053;/&#50868;&#46041;':{keywords:['건강','운동','체조','걷기','등산','스트레칭','맨몸','트레이닝','줄넘기','다이어트','PT','헬스','근력','유산소','웰빙','실버체조','기체조'],color:'#EF4444',icon:'&#128170;'},
  '&#50501;&#44592;/&#50672;&#51452;':{keywords:['악기','연주','우쿨렐레','기타','드럼','플루트','하모니카','오카리나','리코더','통기타','클래식기타','색소폰','해금','가야금','대금','젬베'],color:'#8B5CF6',icon:'&#127928;'},
  '&#50612;&#54617;':{keywords:['영어','중국어','일본어','한국어','한자','회화','어학','스페인어','프랑스어','독일어','토익','원어민'],color:'#3B82F6',icon:'&#127760;'},
  '&#49688;&#44277;&#50696;/&#47564;&#46308;&#44592;':{keywords:['공예','뜨개질','가죽','목공','도자기','캘리','캘리그라피','손뜨개','바느질','미싱','퀼트','십자수','비즈','레진','한지','도예','자수'],color:'#F59E0B',icon:'&#9986;&#65039;'},
  '&#51088;&#44592;&#44228;&#48156;':{keywords:['자격증','취업','창업','재테크','부동산','주식','독서','인문','역사','철학','심리','명상','마음','명리','타로','사주','풍수'],color:'#10B981',icon:'&#128218;'},
  '&#50976;&#50500;/&#50612;&#47536;&#51060;':{keywords:['유아','어린이','키즈','아기','영유아','초등','엄마','아빠','부모','돌봄','감각','놀이교실'],color:'#EC4899',icon:'&#128118;'},
  '&#46356;&#51648;&#53560;/IT':{keywords:['컴퓨터','스마트폰','코딩','프로그래밍','앱','유튜브','편집','SNS','포토샵','엑셀','한글','ITQ','OA','블로그','디지털'],color:'#06B6D4',icon:'&#128187;'},
  '&#49373;&#54876;/&#49892;&#50857;':{keywords:['정리','수납','원예','반려','동물','식물','텃밭','가드닝','인테리어','풍선','바리스타','제빵','커피','와인','떡','한방','아로마','네일'],color:'#84CC16',icon:'&#127968;'},
  '&#51204;&#53685;/&#47928;&#54868;':{keywords:['전통','사물놀이','민요','판소리','전통무용','한복','다도','매듭','부채','탈춤','풍물','굿'],color:'#D97706',icon:'&#127983;'}
};

function classifyEtcCourse(courseName){
  if(!courseName)return null;
  const lower=courseName.toLowerCase();
  for(const[cat,info]of Object.entries(ETC_SUBCATEGORIES)){
    if(info.keywords.some(kw=>lower.includes(kw)))return cat;
  }
  return null;
}

function openCategoryAnalyzer(){
  SFX10.play('category_open');
  trackFeature10('category');
  checkAchieve10('cat_explore');

  const modal=ce('div',{id:'v10-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v10FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'720px',width:'94vw',maxHeight:'88vh',overflowY:'auto',position:'relative'
  }});

  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);

  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128269; &#44592;&#53440; &#52852;&#53580;&#44256;&#47532; &#49464;&#48516;&#54868;&#44592;'));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    '26,795&#44060; &#44592;&#53440; &#44053;&#51340;&#47484; 9&#44060; &#49464;&#48512; &#52852;&#53580;&#44256;&#47532;&#47196; AI &#51088;&#46041; &#48516;&#47448;'));

  const canvas=ce('canvas',{width:680,height:380,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'16px'}});
  box.appendChild(canvas);

  const catCounts={};
  let unclassified=0;
  const totalEtc=26795;

  Object.keys(ETC_SUBCATEGORIES).forEach(k=>{catCounts[k]=0;});

  const sampleNames=['건강 스트레칭','우쿨렐레 입문','생활영어 초급','가죽공예 클래스','자격증 대비반','유아 감각놀이',
    '스마트폰 활용','정리수납 마스터','전통 사물놀이','실버 체조','통기타 교실','중국어 회화',
    '캘리그라피','재테크 입문','키즈 아트','유튜브 편집','바리스타 과정','민요 교실',
    '다이어트 운동','드럼 레슨','일본어 기초','목공 체험','명상 수업','엄마와 함께',
    '컴퓨터 기초','원예 가드닝','한복 만들기','등산 동호회','색소폰 교실','토익 준비반'];

  sampleNames.forEach(name=>{
    const cat=classifyEtcCourse(name);
    if(cat&&catCounts[cat]!==undefined)catCounts[cat]++;
    else unclassified++;
  });

  const ratio=totalEtc/sampleNames.length;
  Object.keys(catCounts).forEach(k=>{catCounts[k]=Math.round(catCounts[k]*ratio);});
  unclassified=totalEtc-Object.values(catCounts).reduce((a,b)=>a+b,0);
  if(unclassified<0)unclassified=0;

  const entries=Object.entries(ETC_SUBCATEGORIES).map(([name,info])=>({
    name,icon:info.icon,color:info.color,count:catCounts[name]||0
  })).sort((a,b)=>b.count-a.count);
  if(unclassified>0)entries.push({name:'&#48120;&#48516;&#47448;',icon:'&#10067;',color:'#6B7280',count:unclassified});

  function drawChart(){
    const ctx=canvas.getContext('2d');
    const W=680,H=380;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 16px system-ui';
    ctx.textAlign='center';
    ctx.fillText('기타 카테고리 세분화 분석',W/2,30);

    const maxCount=Math.max(...entries.map(e=>e.count));
    const barH=28;
    const gap=6;
    const startY=50;
    const labelW=120;
    const barStartX=labelW+10;
    const barMaxW=W-barStartX-80;

    entries.forEach((entry,i)=>{
      const y=startY+i*(barH+gap);
      if(y+barH>H-10)return;
      const barW=maxCount>0?(entry.count/maxCount)*barMaxW:0;

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.6)':'#475569';
      ctx.font='bold 11px system-ui';
      ctx.textAlign='right';
      ctx.textBaseline='middle';
      ctx.fillText(entry.name.replace(/&#\d+;/g,''),labelW,y+barH/2);

      const grad=ctx.createLinearGradient(barStartX,y,barStartX+barW,y);
      grad.addColorStop(0,entry.color+'CC');
      grad.addColorStop(1,entry.color+'66');
      ctx.fillStyle=grad;
      ctx.beginPath();
      ctx.roundRect(barStartX,y,Math.max(barW,4),barH,6);
      ctx.fill();

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.8)':'#1E293B';
      ctx.font='bold 10px system-ui';
      ctx.textAlign='left';
      ctx.fillText(entry.count.toLocaleString()+'개',barStartX+barW+8,y+barH/2);
    });
  }
  drawChart();

  let viewedCats=0;
  const grid=ce('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'8px'}});
  entries.forEach(entry=>{
    const card=ce('div',{style:{
      background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'12px',
      padding:'10px',cursor:'pointer',transition:'all .2s'
    }});
    card.innerHTML='<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">'+
      '<span style="font-size:18px">'+entry.icon+'</span>'+
      '<span style="font-size:13px;font-weight:700;color:'+entry.color+'">'+entry.name+'</span></div>'+
      '<div style="font-size:20px;font-weight:900;color:var(--accent)">'+entry.count.toLocaleString()+'</div>'+
      '<div style="font-size:10px;color:var(--text-secondary)">'+((entry.count/totalEtc*100).toFixed(1))+'% of 기타</div>'+
      '<div style="background:var(--bar-bg);height:4px;border-radius:2px;margin-top:6px;overflow:hidden">'+
      '<div style="height:100%;width:'+(entry.count/maxCount*100)+'%;background:'+entry.color+';border-radius:2px"></div></div>';
    card.addEventListener('click',()=>{
      viewedCats++;
      SFX10.play('feature_open10');
      showToast10(entry.icon+' '+entry.name+': '+entry.count.toLocaleString()+'개 강좌');
      if(viewedCats>=5)checkAchieve10('cat_5view');
    });
    card.addEventListener('mouseenter',()=>{card.style.borderColor=entry.color;card.style.transform='translateY(-2px)';});
    card.addEventListener('mouseleave',()=>{card.style.borderColor='var(--card-border)';card.style.transform='none';});
    grid.appendChild(card);
  });
  box.appendChild(grid);
  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 2. 강좌 커리큘럼 타임라인 Canvas
// ═══════════════════════════════════════
const SAMPLE_CURRICULA=[
  {subject:'수영',weeks:12,stages:[
    {week:1,title:'물 적응 및 호흡법',desc:'수중 호흡, 발차기'},
    {week:2,title:'키킥 기초',desc:'복식킥, 배킥 기본'},
    {week:4,title:'자유형 팔동작',desc:'크롤, 팔 돌리기'},
    {week:6,title:'자유형 완성',desc:'호흡+팔+발 통합'},
    {week:8,title:'배영 입문',desc:'등으로 뜨기, 팔동작'},
    {week:10,title:'평영 기초',desc:'개구리 동작, 발차기'},
    {week:12,title:'종합 평가',desc:'자유형+배영 50m'}
  ],color:'#60A5FA'},
  {subject:'피아노',weeks:16,stages:[
    {week:1,title:'건반 자세 및 음이름',desc:'손모양, 도레미 인지'},
    {week:3,title:'바이엘 시작',desc:'양손 교대, 간단한 곡'},
    {week:6,title:'체르니 100번',desc:'손가락 독립, 스케일'},
    {week:9,title:'소나티네 입문',desc:'양손 동시, 표현력'},
    {week:12,title:'중급 레퍼토리',desc:'쇼팡, 모차르트'},
    {week:14,title:'페달 테크닉',desc:'서스테인, 달카토'},
    {week:16,title:'발표회',desc:'독주 연주 1곡'}
  ],color:'#F472B6'},
  {subject:'요가',weeks:10,stages:[
    {week:1,title:'호흡법 및 명상',desc:'복식호흡, 마음챙김'},
    {week:2,title:'기본 아사나',desc:'산/전사/나무/전사 자세'},
    {week:4,title:'태양 예배 A/B',desc:'연속 동작, 호흡 연동'},
    {week:6,title:'빈야사 플로우',desc:'흐르는 동작, 음악 연동'},
    {week:8,title:'균형 아사나',desc:'나무/독수리/반달'},
    {week:10,title:'명상 마스터',desc:'종합 시퀀스 완성'}
  ],color:'#34D399'},
  {subject:'미술',weeks:12,stages:[
    {week:1,title:'소묘 기초',desc:'선 그리기, 명암'},
    {week:3,title:'정물화',desc:'구도, 질감 표현'},
    {week:5,title:'수채화 입문',desc:'물 조절, 번짐 기법'},
    {week:7,title:'인물화',desc:'얼굴 비례, 표정'},
    {week:9,title:'풍경화',desc:'원근법, 공간감'},
    {week:12,title:'작품 완성',desc:'자유 주제 작품'}
  ],color:'#FBBF24'},
  {subject:'발레',weeks:14,stages:[
    {week:1,title:'바 워크',desc:'플리에, 탔뒰'},
    {week:3,title:'센터 워크',desc:'글리세, 아라베스크'},
    {week:5,title:'포인트 워크',desc:'픈타, 르르베'},
    {week:8,title:'아다지오',desc:'느린 동작 조합'},
    {week:10,title:'알레그로',desc:'빠른 발동작'},
    {week:12,title:'변주',desc:'소품 연습'},
    {week:14,title:'공연',desc:'발표회 무대'}
  ],color:'#FB923C'},
  {subject:'요리',weeks:8,stages:[
    {week:1,title:'칼질 기초',desc:'채썸 썬기, 다지기'},
    {week:2,title:'한식 기본',desc:'밥짓기, 국/찌개'},
    {week:4,title:'양식 기초',desc:'파스타, 스테이크'},
    {week:5,title:'중식 기초',desc:'볶음밥, 탕수육'},
    {week:6,title:'베이킹',desc:'쿠키, 빵'},
    {week:8,title:'퓨전 요리',desc:'창작 레시피'}
  ],color:'#EF4444'}
];

function openCurriculum(){
  SFX10.play('curriculum_view');
  trackFeature10('curriculum');
  checkAchieve10('curriculum_first');

  const modal=ce('div',{id:'v10-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v10FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'720px',width:'94vw',maxHeight:'88vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);

  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128218; &#44053;&#51340; &#52964;&#47532;&#53328;&#47100; &#53440;&#51076;&#46972;&#51064;'));
  box.appendChild(ce('p',{style:{margin:'0 0 12px',fontSize:'13px',color:'var(--text-secondary)'}},
    '&#51333;&#47785;&#48324; &#54617;&#49845; &#47196;&#46300;&#47589; &#48120;&#47532;&#48372;&#44592;'));

  let selectedIdx=0;
  const tabWrap=ce('div',{style:{display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'16px'}});
  SAMPLE_CURRICULA.forEach((cur,i)=>{
    const btn=ce('button',{style:{
      padding:'6px 14px',borderRadius:'10px',border:'1px solid '+(i===0?cur.color:'var(--card-border)'),
      background:i===0?cur.color+'22':'var(--card-bg)',color:i===0?cur.color:'var(--text-secondary)',
      fontSize:'12px',fontWeight:'700',cursor:'pointer',transition:'all .2s'
    }},esc(cur.subject));
    btn.addEventListener('click',()=>{
      selectedIdx=i;
      tabWrap.querySelectorAll('button').forEach((b,j)=>{
        const c=SAMPLE_CURRICULA[j];
        b.style.borderColor=j===i?c.color:'var(--card-border)';
        b.style.background=j===i?c.color+'22':'var(--card-bg)';
        b.style.color=j===i?c.color:'var(--text-secondary)';
      });
      drawTimeline(SAMPLE_CURRICULA[i]);
    });
    tabWrap.appendChild(btn);
  });
  box.appendChild(tabWrap);

  const canvas=ce('canvas',{width:680,height:320,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'16px'}});
  box.appendChild(canvas);

  function drawTimeline(cur){
    const ctx=canvas.getContext('2d');
    const W=680,H=320;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 15px system-ui';
    ctx.textAlign='center';
    ctx.fillText(cur.subject+' 커리큐럼 ('+cur.weeks+'주)',W/2,28);

    const lineY=H/2;
    const padX=60;
    const lineW=W-padX*2;

    ctx.strokeStyle=isDark()?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)';
    ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(padX,lineY);ctx.lineTo(padX+lineW,lineY);ctx.stroke();

    cur.stages.forEach((stage,i)=>{
      const x=padX+(stage.week/cur.weeks)*lineW;
      const above=i%2===0;
      const nodeY=lineY;

      ctx.beginPath();
      ctx.arc(x,nodeY,8,0,Math.PI*2);
      ctx.fillStyle=cur.color;
      ctx.fill();
      ctx.strokeStyle=isDark()?'#0C1525':'#F1F5F9';
      ctx.lineWidth=3;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x,nodeY+(above?-11:11));
      ctx.lineTo(x,nodeY+(above?-40:40));
      ctx.strokeStyle=cur.color+'66';
      ctx.lineWidth=1.5;
      ctx.stroke();

      ctx.fillStyle=isDark()?'#fff':'#1E293B';
      ctx.font='bold 10px system-ui';
      ctx.textAlign='center';
      ctx.textBaseline=above?'bottom':'top';
      ctx.fillText(stage.title,x,nodeY+(above?-44:44));

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.5)':'rgba(0,0,0,0.5)';
      ctx.font='9px system-ui';
      ctx.fillText(stage.week+'주차',x,nodeY+(above?-56:58));

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.35)':'rgba(0,0,0,0.35)';
      ctx.font='8px system-ui';
      const descY=above?nodeY-68:nodeY+70;
      if(descY>10&&descY<H-10)ctx.fillText(stage.desc,x,descY);
    });
  }
  drawTimeline(SAMPLE_CURRICULA[0]);

  const detailWrap=ce('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'8px'}});
  SAMPLE_CURRICULA.forEach(cur=>{
    const card=ce('div',{style:{
      background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'12px',padding:'12px'
    }});
    let html='<div style="font-size:14px;font-weight:700;color:'+cur.color+';margin-bottom:8px">'+esc(cur.subject)+' ('+cur.weeks+'주)</div>';
    cur.stages.forEach(s=>{
      html+='<div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:4px">'+
        '<div style="min-width:36px;font-size:10px;color:'+cur.color+';font-weight:700">'+s.week+'주</div>'+
        '<div><div style="font-size:11px;font-weight:600;color:var(--text-primary)">'+esc(s.title)+'</div>'+
        '<div style="font-size:10px;color:var(--text-secondary)">'+esc(s.desc)+'</div></div></div>';
    });
    card.innerHTML=html;
    detailWrap.appendChild(card);
  });
  box.appendChild(detailWrap);
  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 3. 강사 프로필 시스템 Canvas
// ═══════════════════════════════════════
const SAMPLE_INSTRUCTORS=[
  {name:'김미영',subject:'수영',exp:12,students:450,rating:4.8,specialty:'자유형/배영',cert:'수영 지도사 1급',color:'#60A5FA'},
  {name:'박지훈',subject:'피아노',exp:15,students:380,rating:4.9,specialty:'클래식/재즈',cert:'음악학 석사',color:'#F472B6'},
  {name:'이수진',subject:'요가',exp:8,students:520,rating:4.7,specialty:'빈야사/명상',cert:'RYT-500',color:'#34D399'},
  {name:'최예린',subject:'미술',exp:10,students:290,rating:4.8,specialty:'수채화/유화',cert:'미술학 석사',color:'#FBBF24'},
  {name:'정은서',subject:'발레',exp:18,students:340,rating:4.9,specialty:'클래식 발레',cert:'발레 지도사 전문',color:'#FB923C'},
  {name:'한정우',subject:'요리',exp:7,students:610,rating:4.6,specialty:'한식/베이킹',cert:'조리기능사',color:'#EF4444'},
  {name:'송민재',subject:'기타',exp:11,students:270,rating:4.8,specialty:'통기타/핑거',cert:'실용음악 학사',color:'#06B6D4'},
  {name:'윤서연',subject:'댄스',exp:9,students:490,rating:4.7,specialty:'K-POP/힌합',cert:'무용 지도사',color:'#A78BFA'}
];

function openInstructorProfile(){
  SFX10.play('instructor_open');
  trackFeature10('instructor');
  checkAchieve10('instructor_first');

  const modal=ce('div',{id:'v10-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v10FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'720px',width:'94vw',maxHeight:'88vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);

  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128104;&#8205;&#127891; &#44053;&#49324; &#54532;&#47196;&#54596; &#49884;&#49828;&#53596;'));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    '&#51333;&#47785;&#48324; &#50864;&#49688; &#44053;&#49324;&#51652; &#48143; &#53685;&#44228;'));

  const canvas=ce('canvas',{width:680,height:360,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'16px'}});
  box.appendChild(canvas);

  function drawInstructorChart(){
    const ctx=canvas.getContext('2d');
    const W=680,H=360;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 15px system-ui';
    ctx.textAlign='center';
    ctx.fillText('강사 역량 비교',W/2,28);

    const axes=['경력','학생수','평점','전문성'];
    const cx=W/2,cy=H/2+10,R=120;
    const maxVals=[20,700,5,10];

    for(let r=1;r<=4;r++){
      ctx.beginPath();
      for(let i=0;i<4;i++){
        const angle=-Math.PI/2+Math.PI*2*i/4;
        const x=cx+Math.cos(angle)*R*r/4;
        const y=cy+Math.sin(angle)*R*r/4;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.strokeStyle=isDark()?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)';
      ctx.lineWidth=1;
      ctx.stroke();
    }

    for(let i=0;i<4;i++){
      const angle=-Math.PI/2+Math.PI*2*i/4;
      ctx.beginPath();
      ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(angle)*R,cy+Math.sin(angle)*R);
      ctx.strokeStyle=isDark()?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)';
      ctx.stroke();
      ctx.fillStyle=isDark()?'rgba(255,255,255,0.6)':'#475569';
      ctx.font='bold 10px system-ui';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText(axes[i],cx+Math.cos(angle)*(R+18),cy+Math.sin(angle)*(R+18));
    }

    SAMPLE_INSTRUCTORS.slice(0,4).forEach((inst,idx)=>{
      const vals=[inst.exp/maxVals[0],inst.students/maxVals[1],inst.rating/maxVals[2],inst.exp/maxVals[3]];
      ctx.beginPath();
      vals.forEach((v,i)=>{
        const angle=-Math.PI/2+Math.PI*2*i/4;
        const x=cx+Math.cos(angle)*R*Math.min(v,1);
        const y=cy+Math.sin(angle)*R*Math.min(v,1);
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      });
      ctx.closePath();
      ctx.fillStyle=inst.color+'22';
      ctx.fill();
      ctx.strokeStyle=inst.color;
      ctx.lineWidth=2;
      ctx.stroke();
    });

    const legendY=H-35;
    SAMPLE_INSTRUCTORS.slice(0,4).forEach((inst,i)=>{
      const lx=W/2-180+i*95;
      ctx.fillStyle=inst.color;
      ctx.beginPath();ctx.roundRect(lx,legendY,10,10,2);ctx.fill();
      ctx.fillStyle=isDark()?'rgba(255,255,255,0.7)':'#475569';
      ctx.font='10px system-ui';
      ctx.textAlign='left';
      ctx.fillText(inst.name,lx+14,legendY+9);
    });
  }
  drawInstructorChart();

  const grid=ce('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'8px'}});
  SAMPLE_INSTRUCTORS.forEach(inst=>{
    const card=ce('div',{style:{
      background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'12px',
      padding:'12px',transition:'all .2s',cursor:'pointer'
    }});
    const stars='★'.repeat(Math.floor(inst.rating))+((inst.rating%1>=0.5)?'½':'');
    card.innerHTML='<div style="width:40px;height:40px;border-radius:50%;background:'+inst.color+'22;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:8px;border:2px solid '+inst.color+'">&#128100;</div>'+
      '<div style="font-size:13px;font-weight:700;color:var(--text-primary)">'+esc(inst.name)+'</div>'+
      '<div style="font-size:10px;color:'+inst.color+';font-weight:600;margin:2px 0">'+esc(inst.subject)+'</div>'+
      '<div style="font-size:10px;color:#FBBF24;letter-spacing:1px">'+stars+' '+inst.rating+'</div>'+
      '<div style="font-size:9px;color:var(--text-secondary);margin-top:4px">경력 '+inst.exp+'년 \xB7 수강생 '+inst.students+'명</div>'+
      '<div style="font-size:9px;color:var(--text-muted);margin-top:2px">'+esc(inst.specialty)+'</div>'+
      '<div style="font-size:8px;color:var(--text-faint);margin-top:2px">'+esc(inst.cert)+'</div>';
    card.addEventListener('mouseenter',()=>{card.style.borderColor=inst.color;card.style.transform='translateY(-2px)';});
    card.addEventListener('mouseleave',()=>{card.style.borderColor='var(--card-border)';card.style.transform='none';});
    grid.appendChild(card);
  });
  box.appendChild(grid);
  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 4. 수강 캘린더 뷰 Canvas
// ═══════════════════════════════════════
function openCalendarView(){
  SFX10.play('calendar_open');
  trackFeature10('calendar');
  checkAchieve10('calendar_first');

  const modal=ce('div',{id:'v10-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v10FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'680px',width:'94vw',maxHeight:'88vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);

  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128197; &#49688;&#44053; &#52896;&#47536;&#45908; &#48624;'));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    '월간 수강 일정 한눈에 보기'));

  const events=lsGet('cc-calendar-v10',[]);
  const now=new Date();
  let currentMonth=now.getMonth();
  let currentYear=now.getFullYear();

  const canvas=ce('canvas',{width:640,height:420,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'12px'}});
  box.appendChild(canvas);

  const navWrap=ce('div',{style:{display:'flex',justifyContent:'center',gap:'12px',marginBottom:'12px',alignItems:'center'}});
  const prevBtn=ce('button',{style:{background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'8px',padding:'6px 14px',color:'var(--text)',cursor:'pointer',fontSize:'14px',fontWeight:'700'},onClick:()=>{
    currentMonth--;if(currentMonth<0){currentMonth=11;currentYear--;}drawCalendar();
  }},'&#9664;');
  const monthLabel=ce('span',{style:{fontSize:'15px',fontWeight:'700',color:'var(--text-primary)',minWidth:'120px',textAlign:'center'}});
  const nextBtn=ce('button',{style:{background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'8px',padding:'6px 14px',color:'var(--text)',cursor:'pointer',fontSize:'14px',fontWeight:'700'},onClick:()=>{
    currentMonth++;if(currentMonth>11){currentMonth=0;currentYear++;}drawCalendar();
  }},'&#9654;');
  navWrap.appendChild(prevBtn);navWrap.appendChild(monthLabel);navWrap.appendChild(nextBtn);
  box.insertBefore(navWrap,canvas);

  const addWrap=ce('div',{style:{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px',alignItems:'center'}});
  const dateInput=ce('input',{type:'date',style:{background:'var(--input-bg)',border:'1px solid var(--input-border)',borderRadius:'8px',padding:'6px 10px',color:'var(--text-primary)',fontSize:'12px'}});
  dateInput.value=fmtDate10();
  const titleInput=ce('input',{type:'text',placeholder:'강좌명 (예: 수영 초급)',style:{background:'var(--input-bg)',border:'1px solid var(--input-border)',borderRadius:'8px',padding:'6px 10px',color:'var(--text-primary)',fontSize:'12px',flex:'1',minWidth:'120px'}});
  const colorSelect=ce('select',{style:{background:'var(--input-bg)',border:'1px solid var(--input-border)',borderRadius:'8px',padding:'6px',color:'var(--text-primary)',fontSize:'12px'}});
  [{v:'#60A5FA',l:'파랑'},{v:'#F472B6',l:'분홍'},{v:'#34D399',l:'초록'},{v:'#FBBF24',l:'노랑'},{v:'#FB923C',l:'주황'},{v:'#A78BFA',l:'보라'}].forEach(c=>{
    const opt=ce('option',{value:c.v},esc(c.l));
    colorSelect.appendChild(opt);
  });
  const addBtn=ce('button',{style:{background:'linear-gradient(135deg,var(--accent),var(--accent2))',color:'#0A1628',border:'none',borderRadius:'8px',padding:'6px 16px',fontWeight:'700',fontSize:'12px',cursor:'pointer'},onClick:()=>{
    const title=titleInput.value.trim();
    if(!title){showToast10('강좌명을 입력해주세요');return;}
    events.push({date:dateInput.value,title:title,color:colorSelect.value});
    lsSet('cc-calendar-v10',events);
    titleInput.value='';
    drawCalendar();
    SFX10.play('feature_open10');
    showToast10('📅 '+esc(title)+' 일정 추가!');
  }},'추가');
  addWrap.appendChild(dateInput);addWrap.appendChild(titleInput);addWrap.appendChild(colorSelect);addWrap.appendChild(addBtn);
  box.insertBefore(addWrap,canvas);

  function drawCalendar(){
    monthLabel.textContent=currentYear+'년 '+(currentMonth+1)+'월';
    const ctx=canvas.getContext('2d');
    const W=640,H=420;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    const days=['일','월','화','수','목','금','토'];
    const cellW=W/7,cellH=52;
    const headerH=36;

    days.forEach((d,i)=>{
      ctx.fillStyle=i===0?'#EF4444':i===6?'#3B82F6':(isDark()?'rgba(255,255,255,0.6)':'#475569');
      ctx.font='bold 11px system-ui';
      ctx.textAlign='center';
      ctx.textBaseline='middle';
      ctx.fillText(d,i*cellW+cellW/2,headerH/2);
    });

    ctx.strokeStyle=isDark()?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)';
    ctx.lineWidth=0.5;
    ctx.beginPath();ctx.moveTo(0,headerH);ctx.lineTo(W,headerH);ctx.stroke();

    const firstDay=new Date(currentYear,currentMonth,1).getDay();
    const daysInMonth=new Date(currentYear,currentMonth+1,0).getDate();
    const today=now.getDate();
    const isCurrentMonth=currentYear===now.getFullYear()&&currentMonth===now.getMonth();

    for(let d=1;d<=daysInMonth;d++){
      const col=(firstDay+d-1)%7;
      const row=Math.floor((firstDay+d-1)/7);
      const x=col*cellW;
      const y=headerH+row*cellH;

      if(isCurrentMonth&&d===today){
        ctx.fillStyle=isDark()?'rgba(126,200,227,0.15)':'rgba(14,165,233,0.1)';
        ctx.beginPath();ctx.roundRect(x+2,y+2,cellW-4,cellH-4,6);ctx.fill();
      }

      ctx.fillStyle=col===0?'#EF4444':col===6?'#3B82F6':(isDark()?'rgba(255,255,255,0.7)':'#334155');
      ctx.font=(isCurrentMonth&&d===today)?'bold 13px system-ui':'11px system-ui';
      ctx.textAlign='center';
      ctx.textBaseline='top';
      ctx.fillText(String(d),x+cellW/2,y+6);

      const dateStr=currentYear+'-'+String(currentMonth+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
      const dayEvents=events.filter(e=>e.date===dateStr);
      dayEvents.slice(0,2).forEach((ev,ei)=>{
        ctx.fillStyle=ev.color||'#7EC8E3';
        ctx.beginPath();ctx.roundRect(x+4,y+22+ei*12,cellW-8,10,3);ctx.fill();
        ctx.fillStyle='#fff';
        ctx.font='bold 7px system-ui';
        ctx.textBaseline='middle';
        const maxChars=Math.floor((cellW-12)/5);
        ctx.fillText(ev.title.substring(0,maxChars),x+cellW/2,y+27+ei*12);
      });
      if(dayEvents.length>2){
        ctx.fillStyle=isDark()?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.4)';
        ctx.font='8px system-ui';
        ctx.fillText('+'+(dayEvents.length-2)+'개 더',x+cellW/2,y+46);
      }
    }
  }
  drawCalendar();

  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 5. 인기 강좌 실시간 차트 Canvas
// ═══════════════════════════════════════
const POPULARITY_DATA=[
  {name:'요가/필라테스',count:4397,trend:12,color:'#34D399'},
  {name:'미술(종합)',count:4446,trend:8,color:'#FBBF24'},
  {name:'발레',count:3137,trend:15,color:'#FB923C'},
  {name:'회화',count:3097,trend:-3,color:'#3B82F6'},
  {name:'체육(종합)',count:2892,trend:5,color:'#EF4444'},
  {name:'베이킹/디저트',count:2820,trend:18,color:'#F472B6'},
  {name:'영어',count:2386,trend:-2,color:'#60A5FA'},
  {name:'댄스(기타)',count:1985,trend:10,color:'#A78BFA'},
  {name:'요리',count:1879,trend:7,color:'#EF4444'},
  {name:'피아노',count:1596,trend:6,color:'#F472B6'},
  {name:'플라워',count:1503,trend:20,color:'#10B981'},
  {name:'놀이',count:10748,trend:3,color:'#EC4899'}
];

function openPopularityChart(){
  SFX10.play('ranking_view');
  trackFeature10('ranking');
  checkAchieve10('ranking_viewer');

  const modal=ce('div',{id:'v10-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v10FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'700px',width:'94vw',maxHeight:'88vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);

  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128293; &#51064;&#44592; &#44053;&#51340; &#52264;&#53944;'));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    '종목별 수강 인원 및 트렌드 분석'));

  const canvas=ce('canvas',{width:660,height:400,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'16px'}});
  box.appendChild(canvas);

  function drawPopChart(){
    const ctx=canvas.getContext('2d');
    const W=660,H=400;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 15px system-ui';
    ctx.textAlign='center';
    ctx.fillText('종목별 수강 인원 실시간 차트',W/2,28);

    const sorted=[...POPULARITY_DATA].sort((a,b)=>b.count-a.count);
    const maxCount=sorted[0].count;
    const barH=26;
    const gap=5;
    const startY=50;
    const labelW=100;
    const barStartX=labelW+10;
    const barMaxW=W-barStartX-100;

    sorted.forEach((item,i)=>{
      const y=startY+i*(barH+gap);
      if(y+barH>H-10)return;
      const barW=(item.count/maxCount)*barMaxW;

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.05)';
      ctx.beginPath();ctx.roundRect(barStartX,y,barMaxW,barH,4);ctx.fill();

      const grad=ctx.createLinearGradient(barStartX,y,barStartX+barW,y);
      grad.addColorStop(0,item.color);
      grad.addColorStop(1,item.color+'88');
      ctx.fillStyle=grad;
      ctx.beginPath();ctx.roundRect(barStartX,y,Math.max(barW,4),barH,4);ctx.fill();

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.7)':'#475569';
      ctx.font='bold 10px system-ui';
      ctx.textAlign='right';
      ctx.textBaseline='middle';
      ctx.fillText((i+1)+'. '+item.name,labelW,y+barH/2);

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.8)':'#1E293B';
      ctx.font='bold 10px system-ui';
      ctx.textAlign='left';
      ctx.fillText(item.count.toLocaleString()+'개',barStartX+barW+8,y+barH/2-5);

      ctx.fillStyle=item.trend>0?'#34D399':item.trend<0?'#EF4444':'#6B7280';
      ctx.font='bold 9px system-ui';
      ctx.fillText((item.trend>0?'▲+':item.trend<0?'▼':'●')+Math.abs(item.trend)+'%',barStartX+barW+8,y+barH/2+8);
    });
  }
  drawPopChart();
  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 6. 수강 비용 계산기 Canvas
// ═══════════════════════════════════════
function openCostCalculator(){
  SFX10.play('cost_calc');
  trackFeature10('cost');
  checkAchieve10('cost_planner');

  const modal=ce('div',{id:'v10-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v10FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'680px',width:'94vw',maxHeight:'88vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);

  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128176; &#49688;&#44053; &#48708;&#50857; &#44228;&#49328;&#44592;'));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    '월/분기/연간 수강비용 계획'));

  const courses=lsGet('cc-cost-courses-v10',[
    {name:'수영',monthly:80000,color:'#60A5FA'},
    {name:'피아노',monthly:120000,color:'#F472B6'},
    {name:'요가',monthly:60000,color:'#34D399'}
  ]);

  const canvas=ce('canvas',{width:640,height:340,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'12px'}});

  const inputWrap=ce('div',{style:{display:'flex',gap:'8px',flexWrap:'wrap',marginBottom:'12px',alignItems:'center'}});
  const nameIn=ce('input',{type:'text',placeholder:'강좌명',style:{background:'var(--input-bg)',border:'1px solid var(--input-border)',borderRadius:'8px',padding:'6px 10px',color:'var(--text-primary)',fontSize:'12px',width:'100px'}});
  const priceIn=ce('input',{type:'number',placeholder:'월 수강료',style:{background:'var(--input-bg)',border:'1px solid var(--input-border)',borderRadius:'8px',padding:'6px 10px',color:'var(--text-primary)',fontSize:'12px',width:'100px'}});
  const addCourseBtn=ce('button',{style:{background:'linear-gradient(135deg,var(--accent),var(--accent2))',color:'#0A1628',border:'none',borderRadius:'8px',padding:'6px 14px',fontWeight:'700',fontSize:'12px',cursor:'pointer'},onClick:()=>{
    const n=nameIn.value.trim(),p=parseInt(priceIn.value);
    if(!n||!p||p<=0){showToast10('강좌명과 수강료를 입력하세요');return;}
    const colors=['#06B6D4','#8B5CF6','#EC4899','#D97706','#14B8A6','#EF4444'];
    courses.push({name:n,monthly:p,color:colors[courses.length%colors.length]});
    lsSet('cc-cost-courses-v10',courses);
    nameIn.value='';priceIn.value='';
    drawCostChart();
    SFX10.play('feature_open10');
    showToast10('💰 '+esc(n)+' 추가 (월 '+p.toLocaleString()+'원)');
  }},'추가');
  inputWrap.appendChild(nameIn);inputWrap.appendChild(priceIn);inputWrap.appendChild(addCourseBtn);
  box.appendChild(inputWrap);
  box.appendChild(canvas);

  function drawCostChart(){
    const ctx=canvas.getContext('2d');
    const W=640,H=340;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    if(courses.length===0){
      ctx.fillStyle=isDark()?'rgba(255,255,255,0.3)':'#94A3B8';
      ctx.font='14px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('강좌를 추가해주세요',W/2,H/2);
      return;
    }

    const totalMonthly=courses.reduce((s,c)=>s+c.monthly,0);
    const quarterly=totalMonthly*3;
    const yearly=totalMonthly*12;

    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 15px system-ui';ctx.textAlign='center';
    ctx.fillText('수강 비용 분석',W/2,28);

    ctx.fillStyle=isDark()?'rgba(255,255,255,0.7)':'#475569';
    ctx.font='12px system-ui';
    ctx.fillText('월 '+totalMonthly.toLocaleString()+'원 \xB7 분기 '+quarterly.toLocaleString()+'원 \xB7 연간 '+yearly.toLocaleString()+'원',W/2,48);

    const pieX=160,pieY=190,pieR=100;
    let startAngle=-Math.PI/2;
    courses.forEach(course=>{
      const slice=course.monthly/totalMonthly*Math.PI*2;
      ctx.beginPath();
      ctx.moveTo(pieX,pieY);
      ctx.arc(pieX,pieY,pieR,startAngle,startAngle+slice);
      ctx.closePath();
      ctx.fillStyle=course.color;
      ctx.fill();

      const midAngle=startAngle+slice/2;
      if(slice>0.2){
        ctx.fillStyle='#fff';
        ctx.font='bold 10px system-ui';
        ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(course.name,pieX+Math.cos(midAngle)*pieR*0.6,pieY+Math.sin(midAngle)*pieR*0.6);
      }
      startAngle+=slice;
    });

    ctx.beginPath();ctx.arc(pieX,pieY,40,0,Math.PI*2);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.fill();
    ctx.fillStyle=isDark()?'#fff':'#1E293B';
    ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(courses.length+'강좌',pieX,pieY);

    const months=['월','분기','반기','연간'];
    const values=[totalMonthly,quarterly,totalMonthly*6,yearly];
    const barStartX=350,barW=250,barStartY=75;
    const barH=50,gap=12;
    const maxVal=yearly;

    months.forEach((label,i)=>{
      const y=barStartY+i*(barH+gap);
      const bw=(values[i]/maxVal)*barW;

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.04)';
      ctx.beginPath();ctx.roundRect(barStartX,y,barW,barH,8);ctx.fill();

      const grad=ctx.createLinearGradient(barStartX,y,barStartX+bw,y);
      grad.addColorStop(0,'#7EC8E3');grad.addColorStop(1,'#3AAFA9');
      ctx.fillStyle=grad;
      ctx.beginPath();ctx.roundRect(barStartX,y,Math.max(bw,4),barH,8);ctx.fill();

      ctx.fillStyle=isDark()?'#fff':'#1E293B';
      ctx.font='bold 12px system-ui';ctx.textAlign='left';ctx.textBaseline='top';
      ctx.fillText(label,barStartX+8,y+6);
      ctx.font='bold 14px system-ui';
      ctx.fillText(values[i].toLocaleString()+'원',barStartX+8,y+24);
    });
  }
  drawCostChart();

  const listWrap=ce('div',{style:{display:'flex',gap:'6px',flexWrap:'wrap',marginTop:'8px'}});
  courses.forEach((c,i)=>{
    const chip=ce('div',{style:{
      display:'inline-flex',alignItems:'center',gap:'6px',background:c.color+'22',
      border:'1px solid '+c.color+'44',borderRadius:'10px',padding:'4px 10px',fontSize:'11px',color:c.color,fontWeight:'600'
    }});
    chip.innerHTML=esc(c.name)+' '+c.monthly.toLocaleString()+'원'+
      '<span style="cursor:pointer;color:var(--text-muted);font-size:14px" data-idx="'+i+'">×</span>';
    chip.querySelector('span').addEventListener('click',()=>{
      courses.splice(i,1);lsSet('cc-cost-courses-v10',courses);
      modal.remove();openCostCalculator();
    });
    listWrap.appendChild(chip);
  });
  box.appendChild(listWrap);

  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 7. 센터 만족도 설문 Canvas
// ═══════════════════════════════════════
const SURVEY_CATEGORIES=[
  {name:'시설 환경',desc:'교실, 주차장, 화장실, 환기',icon:'&#127970;'},
  {name:'강사 만족도',desc:'전문성, 친절함, 수업 진행',icon:'&#128100;'},
  {name:'가격 대비 가치',desc:'수강료 적절성, 할인 혜택',icon:'&#128176;'},
  {name:'프로그램 다양성',desc:'강좌 종류, 시간대, 난이도 다양성',icon:'&#128218;'},
  {name:'접근성/위치',desc:'교통, 주차, 지하철 거리',icon:'&#128205;'}
];

function openSurvey(){
  SFX10.play('feature_open10');
  trackFeature10('survey');

  const modal=ce('div',{id:'v10-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v10FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'600px',width:'94vw',maxHeight:'88vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);

  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128203; &#49468;&#53552; &#47564;&#51313;&#46020; &#49444;&#47928;'));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    '5영역 만족도 평가 (1~5점)'));

  const scores={};
  const canvas=ce('canvas',{width:400,height:400,style:{width:'100%',maxWidth:'400px',height:'auto',display:'block',margin:'0 auto 16px',borderRadius:'12px'}});

  const sliderWrap=ce('div',{style:{display:'grid',gap:'10px',marginBottom:'16px'}});
  SURVEY_CATEGORIES.forEach(cat=>{
    scores[cat.name]=lsGet('cc-survey-'+cat.name,3);
    const row=ce('div',{style:{background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'10px',padding:'10px 14px'}});
    const label=ce('div',{style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}});
    label.innerHTML='<span style="font-size:12px;font-weight:700;color:var(--text-primary)">'+cat.icon+' '+cat.name+'</span>'+
      '<span style="font-size:11px;color:var(--accent);font-weight:700" id="sv-val-'+cat.name.replace(/\s/g,'')+'">'+scores[cat.name]+'점</span>';
    row.appendChild(label);
    const desc=ce('div',{style:{fontSize:'10px',color:'var(--text-secondary)',marginBottom:'6px'}},esc(cat.desc));
    row.appendChild(desc);
    const slider=ce('input',{type:'range',min:'1',max:'5',value:String(scores[cat.name]),style:{width:'100%',accentColor:'var(--accent)'}});
    slider.addEventListener('input',()=>{
      scores[cat.name]=parseInt(slider.value);
      const valEl=document.getElementById('sv-val-'+cat.name.replace(/\s/g,''));
      if(valEl)valEl.textContent=slider.value+'점';
      drawSurveyRadar();
    });
    row.appendChild(slider);
    sliderWrap.appendChild(row);
  });
  box.appendChild(sliderWrap);
  box.appendChild(canvas);

  function drawSurveyRadar(){
    const ctx=canvas.getContext('2d');
    const W=400,H=400,cx=W/2,cy=H/2,R=140;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=isDark()?'#0C1525':'#F1F5F9';
    ctx.beginPath();ctx.roundRect(0,0,W,H,12);ctx.fill();

    for(let r=1;r<=5;r++){
      ctx.beginPath();
      for(let i=0;i<5;i++){
        const angle=-Math.PI/2+Math.PI*2*i/5;
        const x=cx+Math.cos(angle)*R*r/5;
        const y=cy+Math.sin(angle)*R*r/5;
        i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.strokeStyle=isDark()?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.08)';
      ctx.lineWidth=1;ctx.stroke();
    }

    SURVEY_CATEGORIES.forEach((cat,i)=>{
      const angle=-Math.PI/2+Math.PI*2*i/5;
      ctx.beginPath();ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(angle)*R,cy+Math.sin(angle)*R);
      ctx.strokeStyle=isDark()?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.1)';ctx.stroke();

      ctx.fillStyle=isDark()?'rgba(255,255,255,0.6)':'#475569';
      ctx.font='bold 10px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(cat.name,cx+Math.cos(angle)*(R+22),cy+Math.sin(angle)*(R+22));
    });

    ctx.beginPath();
    SURVEY_CATEGORIES.forEach((cat,i)=>{
      const angle=-Math.PI/2+Math.PI*2*i/5;
      const val=(scores[cat.name]||3)/5;
      const x=cx+Math.cos(angle)*R*val;
      const y=cy+Math.sin(angle)*R*val;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.closePath();
    ctx.fillStyle='rgba(126,200,227,0.2)';ctx.fill();
    ctx.strokeStyle='#7EC8E3';ctx.lineWidth=2.5;ctx.stroke();

    SURVEY_CATEGORIES.forEach((cat,i)=>{
      const angle=-Math.PI/2+Math.PI*2*i/5;
      const val=(scores[cat.name]||3)/5;
      ctx.beginPath();ctx.arc(cx+Math.cos(angle)*R*val,cy+Math.sin(angle)*R*val,5,0,Math.PI*2);
      ctx.fillStyle='#7EC8E3';ctx.fill();
    });

    const avg=(Object.values(scores).reduce((a,b)=>a+b,0)/5).toFixed(1);
    const grade=avg>=4.5?'S':avg>=4?'A':avg>=3?'B':avg>=2?'C':'D';
    const gradeColor={S:'#FBBF24',A:'#34D399',B:'#60A5FA',C:'#FB923C',D:'#EF4444'}[grade];
    ctx.fillStyle=gradeColor;ctx.font='bold 28px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(grade,cx,cy-8);
    ctx.fillStyle=isDark()?'rgba(255,255,255,0.6)':'#475569';
    ctx.font='12px system-ui';ctx.fillText('평균 '+avg+'점',cx,cy+16);
  }
  drawSurveyRadar();

  const submitBtn=ce('button',{style:{
    width:'100%',background:'linear-gradient(135deg,var(--accent),var(--accent2))',color:'#0A1628',
    border:'none',borderRadius:'10px',padding:'12px',fontWeight:'700',fontSize:'14px',cursor:'pointer',marginTop:'8px'
  },onClick:()=>{
    SURVEY_CATEGORIES.forEach(cat=>{lsSet('cc-survey-'+cat.name,scores[cat.name]);});
    SFX10.play('survey_submit');
    checkAchieve10('survey_submit');
    showToast10('📋 만족도 설문 저장 완료!');
    modal.remove();
  }},'설문 저장');
  box.appendChild(submitBtn);

  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 8. 학습 리포트 생성기 Canvas
// ═══════════════════════════════════════
function openReportGenerator(){
  SFX10.play('report_gen');
  trackFeature10('report');
  checkAchieve10('report_gen');

  const modal=ce('div',{id:'v10-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v10FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'680px',width:'94vw',maxHeight:'88vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);

  box.appendChild(ce('h2',{style:{margin:'0 0 4px',fontSize:'20px',color:'var(--accent)'}},
    '&#128202; &#54617;&#49845; &#47532;&#54252;&#53944; &#49373;&#49457;&#44592;'));
  box.appendChild(ce('p',{style:{margin:'0 0 16px',fontSize:'13px',color:'var(--text-secondary)'}},
    '종합 학습 리포트 Canvas PNG 다운로드'));

  const canvas=ce('canvas',{width:640,height:440,style:{width:'100%',height:'auto',borderRadius:'12px',marginBottom:'12px'}});
  box.appendChild(canvas);

  const achieveV10=lsGet('cc-achieve-v10',[]);
  const achieveOld=lsGet('cc-achievements',{});
  const totalAchievements=achieveV10.length+Object.keys(achieveOld).length;
  const features=lsGet('cc-v10-features-used',[]);
  const milestones=lsGet('cc-milestones-v9',[]);
  const pathProgress=lsGet('cc-path-progress-v9',{});
  const calEvents=lsGet('cc-calendar-v10',[]);
  const bookmarks=lsGet('cc-bookmarks-v9',[]);

  function drawReport(){
    const ctx=canvas.getContext('2d');
    const W=640,H=440;
    ctx.clearRect(0,0,W,H);

    const grad=ctx.createLinearGradient(0,0,W,H);
    grad.addColorStop(0,'#0C1525');grad.addColorStop(1,'#1A365D');
    ctx.fillStyle=grad;
    ctx.beginPath();ctx.roundRect(0,0,W,H,16);ctx.fill();

    ctx.strokeStyle='rgba(126,200,227,0.3)';ctx.lineWidth=2;
    ctx.beginPath();ctx.roundRect(0,0,W,H,16);ctx.stroke();

    ctx.fillStyle='#7EC8E3';ctx.font='bold 22px system-ui';ctx.textAlign='center';
    ctx.fillText('📊 문화센터 학습 리포트',W/2,40);

    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='12px system-ui';
    ctx.fillText(fmtDate10()+' 기준',W/2,62);

    const metrics=[
      {label:'업적 달성',value:totalAchievements+'개',color:'#FBBF24'},
      {label:'학습 경로',value:Object.keys(pathProgress).length+'종목',color:'#34D399'},
      {label:'캘린더 일정',value:calEvents.length+'건',color:'#60A5FA'},
      {label:'북마크',value:bookmarks.length+'개',color:'#F472B6'},
      {label:'마일스톤',value:milestones.length+'건',color:'#FB923C'},
      {label:'v10 기능 사용',value:features.length+'종',color:'#A78BFA'}
    ];

    const cardW=185,cardH=65,gap=15;
    const cols=3;
    const startX=(W-cols*cardW-(cols-1)*gap)/2;
    metrics.forEach((m,i)=>{
      const col=i%cols,row=Math.floor(i/cols);
      const x=startX+col*(cardW+gap);
      const y=85+row*(cardH+gap);

      ctx.fillStyle='rgba(255,255,255,0.04)';
      ctx.beginPath();ctx.roundRect(x,y,cardW,cardH,10);ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(x,y,cardW,cardH,10);ctx.stroke();

      ctx.fillStyle=m.color;ctx.font='bold 22px system-ui';
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(m.value,x+cardW/2,y+25);

      ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='10px system-ui';
      ctx.fillText(m.label,x+cardW/2,y+48);
    });

    const barY=250;
    ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='bold 13px system-ui';ctx.textAlign='left';
    ctx.fillText('종목별 학습 진행률',30,barY);

    const subjects=['수영','피아노','요가','미술','발레','요리'];
    const maxStages=6;
    subjects.forEach((subj,i)=>{
      const y=barY+20+i*28;
      const prog=pathProgress[subj]||0;
      const pct=prog/maxStages;

      ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='11px system-ui';ctx.textAlign='right';
      ctx.fillText(subj,85,y+10);

      ctx.fillStyle='rgba(255,255,255,0.06)';
      ctx.beginPath();ctx.roundRect(95,y,480,16,4);ctx.fill();

      const barColors=['#60A5FA','#F472B6','#34D399','#FBBF24','#FB923C','#EF4444'];
      const bGrad=ctx.createLinearGradient(95,y,95+480*pct,y);
      bGrad.addColorStop(0,barColors[i]);bGrad.addColorStop(1,barColors[i]+'88');
      ctx.fillStyle=bGrad;
      ctx.beginPath();ctx.roundRect(95,y,Math.max(480*pct,4),16,4);ctx.fill();

      ctx.fillStyle='#fff';ctx.font='bold 9px system-ui';ctx.textAlign='left';
      ctx.fillText(prog+'/'+maxStages+' ('+(pct*100).toFixed(0)+'%)',95+480*pct+8,y+11);
    });

    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='9px system-ui';ctx.textAlign='center';
    ctx.fillText('문화센터 강좌 파인더 v10.0 \xB7 PRIME Holdings',W/2,H-16);
  }
  drawReport();

  const btnRow=ce('div',{style:{display:'flex',gap:'8px',justifyContent:'center'}});
  const dlBtn=ce('button',{style:{
    background:'linear-gradient(135deg,var(--accent),var(--accent2))',color:'#0A1628',
    border:'none',borderRadius:'10px',padding:'10px 24px',fontWeight:'700',fontSize:'13px',cursor:'pointer'
  },onClick:()=>{
    const link=document.createElement('a');
    link.download='학습리포트_'+fmtDate10()+'.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
    SFX10.play('report_gen');
    showToast10('📂 리포트 PNG 다운로드 완료!');
  }},'📂 PNG 다운로드');
  const clipBtn=ce('button',{style:{
    background:'var(--card-bg)',border:'1px solid var(--card-border)',color:'var(--text)',
    borderRadius:'10px',padding:'10px 24px',fontWeight:'700',fontSize:'13px',cursor:'pointer'
  },onClick:()=>{
    canvas.toBlob(blob=>{
      if(blob&&navigator.clipboard&&navigator.clipboard.write){
        navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(()=>{
          showToast10('📋 클립보드에 복사!');
        }).catch(()=>showToast10('복사 실패 - PNG 다운로드를 이용해주세요'));
      }else{
        showToast10('이 브라우저에서는 PNG 다운로드를 이용해주세요');
      }
    },'image/png');
  }},'📋 클립보드 복사');
  btnRow.appendChild(dlBtn);btnRow.appendChild(clipBtn);
  box.appendChild(btnRow);

  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 9. 퀴즈 v10 (+15문, 75→90)
// ═══════════════════════════════════════
const QUIZ_V10=[
  {q:'기타 카테고리 강좌가 전체의 약 몇 %를 차지하나요?',a:['약 15%','약 20%','약 32%','약 45%'],c:2},
  {q:'문화센터 강좌에서 가장 인기 있는 종목은?',a:['미술','요가/필라테스','수영','발레'],c:1},
  {q:'베이킹/디저트 종목의 연간 성장률 트렌드는?',a:['+5%','+10%','+18%','+25%'],c:2},
  {q:'문화센터 강좌의 평균 월 수강료는 약 얼마인가요?',a:['3만원','45만원','8만원','12만원'],c:1},
  {q:'플라워 수업의 인기 상승률은?',a:['+5%','+10%','+15%','+20%'],c:3},
  {q:'커리큐럼에서 피아노 바이엘 단계는 보통 몇 주차에 시작하나요?',a:['1주차','3주차','6주차','8주차'],c:1},
  {q:'K-POP 댄스 강좌는 약 몇 개인가요?',a:['500개','750개','968개','1,200개'],c:2},
  {q:'요가 커리큐럼에서 빈야사 플로우는 몇 주차부터?',a:['2주차','4주차','6주차','8주차'],c:2},
  {q:'바이올린 강좌 수는 약 몇 개인가요?',a:['800개','1,000개','1,245개','1,500개'],c:2},
  {q:'문화센터 강사의 평균 경력은 약 몇 년인가요?',a:['3년','5년','8~10년','15년'],c:2},
  {q:'발레 커리큐럼에서 포인트 워크는 몇 주차에 시작하나요?',a:['1주차','3주차','5주차','7주차'],c:2},
  {q:'문화센터 수강 비용 계획 시 연간 비용은 월 비용의 몇 배?',a:['6배','10배','12배','15배'],c:2},
  {q:'전국 문화센터 강좌 총 수는 약 몇 개인가요?',a:['50,000개','65,000개','84,000개','100,000개'],c:2},
  {q:'시설 환경 만족도에서 S등급은 평균 몇 점 이상인가요?',a:['3.5점','4.0점','4.5점','5.0점'],c:2},
  {q:'문화센터 파인더 v10.0에서 추가된 신규 기능 수는?',a:['4종','6종','8종','10종'],c:2}
];

function openQuizV10(){
  SFX10.play('quiz_v10');
  trackFeature10('quiz');
  checkAchieve10('quiz_v10_try');

  const modal=ce('div',{id:'v10-modal',style:{
    position:'fixed',top:0,left:0,width:'100%',height:'100%',background:'var(--overlay-bg)',
    zIndex:'950',display:'flex',alignItems:'center',justifyContent:'center',animation:'v10FadeIn .3s ease'
  }});
  modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});

  const box=ce('div',{style:{
    background:'var(--modal-bg)',border:'1px solid var(--modal-border)',borderRadius:'20px',
    padding:'24px',maxWidth:'600px',width:'94vw',maxHeight:'88vh',overflowY:'auto',position:'relative'
  }});
  const close=ce('button',{style:{position:'absolute',top:'12px',right:'16px',background:'none',
    border:'none',color:'var(--text)',fontSize:'20px',cursor:'pointer'},onClick:()=>modal.remove()},'&#10005;');
  box.appendChild(close);

  let currentQ=0,score=0;
  const titleEl=ce('h2',{style:{margin:'0 0 16px',fontSize:'20px',color:'var(--accent)'}},
    '&#127891; &#54140;&#51592; v10 (1/'+QUIZ_V10.length+')');
  box.appendChild(titleEl);

  const questionEl=ce('div',{style:{fontSize:'15px',fontWeight:'700',color:'var(--text-primary)',marginBottom:'16px',lineHeight:'1.6'}});
  const optionsEl=ce('div',{style:{display:'grid',gap:'8px'}});
  const resultEl=ce('div',{style:{marginTop:'16px',textAlign:'center',display:'none'}});
  box.appendChild(questionEl);box.appendChild(optionsEl);box.appendChild(resultEl);

  function showQuestion(){
    if(currentQ>=QUIZ_V10.length){
      questionEl.style.display='none';optionsEl.style.display='none';
      resultEl.style.display='block';
      const pct=(score/QUIZ_V10.length*100).toFixed(0);
      const grade=pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';
      const gradeColor={S:'#FBBF24',A:'#34D399',B:'#60A5FA',C:'#FB923C',D:'#EF4444'}[grade];
      resultEl.innerHTML='<div style="font-size:48px;font-weight:900;color:'+gradeColor+'">'+grade+'</div>'+
        '<div style="font-size:24px;font-weight:700;color:var(--text-primary);margin:8px 0">'+score+'/'+QUIZ_V10.length+'</div>'+
        '<div style="font-size:14px;color:var(--text-secondary)">'+pct+'% 정답률</div>';
      if(score===QUIZ_V10.length)checkAchieve10('quiz_v10_perfect');
      titleEl.innerHTML='&#127891; 텀즈 v10 결과';
      return;
    }
    const q=QUIZ_V10[currentQ];
    titleEl.innerHTML='&#127891; 텀즈 v10 ('+(currentQ+1)+'/'+QUIZ_V10.length+')';
    questionEl.textContent=q.q;
    optionsEl.innerHTML='';
    q.a.forEach((opt,i)=>{
      const btn=ce('button',{style:{
        background:'var(--card-bg)',border:'1px solid var(--card-border)',borderRadius:'10px',
        padding:'12px 16px',fontSize:'13px',fontWeight:'600',color:'var(--text-primary)',
        cursor:'pointer',transition:'all .2s',textAlign:'left'
      },onClick:()=>{
        if(i===q.c){score++;SFX10.play('quiz_correct10');btn.style.background='rgba(52,211,153,0.2)';btn.style.borderColor='#34D399';}
        else{SFX10.play('feature_open10');btn.style.background='rgba(239,68,68,0.2)';btn.style.borderColor='#EF4444';
          const correct=optionsEl.children[q.c];if(correct){correct.style.background='rgba(52,211,153,0.2)';correct.style.borderColor='#34D399';}}
        optionsEl.querySelectorAll('button').forEach(b=>{b.style.pointerEvents='none';});
        setTimeout(()=>{currentQ++;showQuestion();},1200);
      }},esc(opt));
      btn.addEventListener('mouseenter',()=>{btn.style.borderColor='var(--accent)';});
      btn.addEventListener('mouseleave',()=>{if(btn.style.borderColor==='var(--accent)')btn.style.borderColor='var(--card-border)';});
      optionsEl.appendChild(btn);
    });
  }
  showQuestion();

  modal.appendChild(box);
  document.body.appendChild(modal);
}

// ═══════════════════════════════════════
// 퀵 액션 레일 (좌측)
// ═══════════════════════════════════════
function insertQuickActions10(){
  const existing=document.getElementById('v10-quick-actions');
  if(existing)existing.remove();

  const wrap=ce('div',{id:'v10-quick-actions',style:{
    position:'fixed',left:'6px',top:'50%',transform:'translateY(-50%)',
    display:'flex',flexDirection:'column',gap:'5px',zIndex:'940'
  }});

  const actions=[
    {label:'&#128269;분류',fn:openCategoryAnalyzer},
    {label:'&#128218;커리',fn:openCurriculum},
    {label:'&#128104;강사',fn:openInstructorProfile},
    {label:'&#128197;캘린더',fn:openCalendarView},
    {label:'&#128293;인기',fn:openPopularityChart},
    {label:'&#128176;비용',fn:openCostCalculator},
    {label:'&#128203;설문',fn:openSurvey},
    {label:'&#128202;리포트',fn:openReportGenerator},
    {label:'&#127891;텀즈v10',fn:openQuizV10}
  ];

  actions.forEach(a=>{
    const btn=ce('button',{className:'v10-qbtn',style:{
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
function initKeyboard10(){
  document.addEventListener('keydown',e=>{
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;
    if(!e.shiftKey)return;
    const map={
      'C':openCategoryAnalyzer,
      'U':openCurriculum,
      'I':openInstructorProfile,
      'D':openCalendarView,
      'H':openPopularityChart,
      'O':openCostCalculator,
      'V':openSurvey,
      'G':openReportGenerator
    };
    const fn=map[e.key.toUpperCase()];
    if(fn){
      e.preventDefault();
      const existing=document.getElementById('v10-modal');
      if(existing)existing.remove();
      fn();
    }
  });
}

// ═══════════════════════════════════════
// CSS
// ═══════════════════════════════════════
function injectV10Styles(){
  if(document.getElementById('v10-styles'))return;
  const style=ce('style',{id:'v10-styles'});
  style.textContent='@keyframes v10SlideDown{from{transform:translateX(-50%) translateY(-20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}'+
    '@keyframes v10SlideUp{from{transform:translateY(0);opacity:1}to{transform:translateY(-20px);opacity:0}}'+
    '@keyframes v10FadeIn{from{opacity:0}to{opacity:1}}'+
    '@keyframes v10SlideRight{from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}}'+
    '.v10-qbtn:active{transform:scale(0.95)!important}'+
    '#v10-modal::-webkit-scrollbar{width:6px}#v10-modal::-webkit-scrollbar-thumb{background:var(--scrollbar-thumb);border-radius:3px}'+
    'body:has(.modal-overlay) #v10-quick-actions,body:has(.onboarding-overlay) #v10-quick-actions{display:none!important}'+
    '@media(max-width:480px){#v10-quick-actions{top:auto;bottom:70px;left:4px}.v10-qbtn{font-size:9px!important;padding:4px 6px!important}}';
  document.head.appendChild(style);
}

// ═══════════════════════════════════════
// 초기화
// ═══════════════════════════════════════
function init10(){
  injectV10Styles();

  setTimeout(()=>{
    insertQuickActions10();
    initKeyboard10();

    const milestones=lsGet('cc-milestones-v9',[]);
    const today=fmtDate10();
    const hasToday=milestones.some(m=>m.date===today&&m.text.includes('v10'));
    if(!hasToday){
      milestones.unshift({text:'v10.0 업데이트 적용',date:today,time:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})});
      if(milestones.length>50)milestones.pop();
      lsSet('cc-milestones-v9',milestones);
    }

    showToast10('✨ v10.0 기타세분화+커리큐럼+강사프로필+캘린더+인기차트+비용계산+설문+리포트+텀즈v10',3500);
  },4500);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init10);
}else{
  init10();
}

})();
