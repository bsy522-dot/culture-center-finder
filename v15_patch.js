/* culture-center-finder v15.0 patch – 2026-07-10 */
(function(){
'use strict';
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
const V15_ID='ccf-v15-patch';
if(document.getElementById(V15_ID))return;
const marker=document.createElement('meta');marker.id=V15_ID;document.head.appendChild(marker);
function qs(s,p){return(p||document).querySelector(s);}
function ce(t){return document.createElement(t);}
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function isDark(){return document.documentElement.classList.contains('dark')||document.body.classList.contains('dark-mode')||window.matchMedia('(prefers-color-scheme:dark)').matches||document.documentElement.getAttribute('data-theme')==='dark';}
function showToast15(msg,dur){
  var t=ce('div');t.className='v15-toast';
  t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:'+
    (isDark()?'rgba(255,255,255,0.95)':'rgba(30,30,30,0.95)')+';color:'+(isDark()?'#111':'#fff')+
    ';padding:12px 24px;border-radius:28px;font-size:14px;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.3);'+
    'animation:v15FadeIn 0.3s ease;pointer-events:none;text-align:center;max-width:90vw;';
  t.textContent=msg;document.body.appendChild(t);
  setTimeout(function(){t.style.opacity='0';t.style.transition='opacity 0.3s';setTimeout(function(){t.remove();},300);},dur||2500);
}
function fmtDate15(d){var dt=d?new Date(d):new Date();var mm=String(dt.getMonth()+1).padStart(2,'0');var dd=String(dt.getDate()).padStart(2,'0');return dt.getFullYear()+'-'+mm+'-'+dd;}

/* ===== SFX v15 엔진 ===== */
var SFX15={
  _ctx:null,_getCtx:function(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  _presets:{
    completion_open:{freq:659,type:'sine',dur:0.22,vol:0.12},
    style_analyze:{freq:740,type:'triangle',dur:0.2,vol:0.13},
    timeslot_view:{freq:554,type:'sine',dur:0.18,vol:0.11},
    community_match:{freq:784,type:'triangle',dur:0.25,vol:0.12},
    roi_calc:{freq:880,type:'sine',dur:0.3,vol:0.14},
    milestone_track:{freq:523,type:'sine',dur:0.2,vol:0.11},
    density_map:{freq:698,type:'triangle',dur:0.22,vol:0.13},
    report_gen:{freq:622,type:'sine',dur:0.25,vol:0.13},
    quiz_v15:{freq:587,type:'sine',dur:0.18,vol:0.11},
    quiz_correct15:{freq:988,type:'sine',dur:0.3,vol:0.14},
    achieve_v15:{freq:1047,type:'sine',dur:0.4,vol:0.16},
    feature_open15:{freq:830,type:'triangle',dur:0.2,vol:0.12}
  },
  play:function(name){
    var c=this._getCtx();if(!c)return;var p=this._presets[name];if(!p)return;
    try{var o=c.createOscillator();var g=c.createGain();o.type=p.type;o.frequency.value=p.freq;
    g.gain.setValueAtTime(p.vol,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+p.dur);
    o.connect(g);g.connect(c.destination);o.start(c.currentTime);o.stop(c.currentTime+p.dur);}catch(e){}
  }
};

/* ===== 업적 v15 ===== */
var V15_ACHIEVEMENTS=[
  {id:'completion_analyst',name:'완주율 분석가',desc:'수강 완주율 분석기를 처음 사용',icon:'&#128202;'},
  {id:'completion_master',name:'완주 마스터',desc:'완주율 분석기를 5회 사용',icon:'&#127942;'},
  {id:'style_finder',name:'스타일 발견자',desc:'학습 스타일 진단을 처음 완료',icon:'&#128161;'},
  {id:'time_optimizer',name:'시간 최적화자',desc:'시간대 최적화기를 처음 사용',icon:'&#9200;'},
  {id:'community_joiner',name:'커뮤니티 참여자',desc:'학습 커뮤니티 매칭을 처음 시도',icon:'&#129309;'},
  {id:'roi_calculator',name:'ROI 계산가',desc:'강좌 ROI 계산기를 처음 사용',icon:'&#128176;'},
  {id:'milestone_setter',name:'마일스톤 설정자',desc:'학습 마일스톤 3개 이상 달성',icon:'&#127919;'},
  {id:'density_explorer',name:'밀도 탐색가',desc:'지역별 강좌 밀도맵을 처음 탐색',icon:'&#128506;'},
  {id:'report_creator',name:'리포트 제작자',desc:'성장 리포트 카드를 처음 생성',icon:'&#128196;'},
  {id:'report_downloader',name:'리포트 다운로더',desc:'성장 리포트 PNG 다운로드',icon:'&#128229;'},
  {id:'quiz_v15_ace',name:'퀴즈 v15 에이스',desc:'v15 퀴즈에서 S등급 획득',icon:'&#127775;'},
  {id:'v15_explorer',name:'v15 탐험가',desc:'v15 신규 기능 5개 이상 사용',icon:'&#127757;'}
];

/* ===== 퀴즈 v15 ===== */
var QUIZ_V15=[
  {q:'클래스101에서 &quot;크리에이터 클래스&quot;의 평균 강의 수는?',opts:['5~10개','15~25개','30~50개','50개 이상'],a:1},
  {q:'탈잉에서 &quot;원데이 클래스&quot;의 주요 장점은?',opts:['가격이 무료','한 번에 체험 가능','무제한 수강','자격증 발급'],a:1},
  {q:'수강 완주율이 가장 높은 강좌 형태는?',opts:['녹화 강의(VOD)','실시간 라이브','오프라인 대면','혼합형(블렌디드)'],a:3},
  {q:'학습 스타일 이론(VARK)에서 &quot;K&quot;는 무엇을 의미하는가?',opts:['Knowledge','Kinesthetic','Korean','Keyword'],a:1},
  {q:'문화센터 강좌에서 주말반 수강료가 평일반보다 평균 몇% 높은가?',opts:['동일하다','5~10%','15~25%','30% 이상'],a:2},
  {q:'수강생 커뮤니티가 학습 효과에 미치는 영향(연구 결과)은?',opts:['영향 없음','완주율 20~40% 향상','성적만 향상','동기만 향상'],a:1},
  {q:'강좌 ROI(투자 대비 효과)를 측정하는 가장 적절한 지표는?',opts:['수강료만','수강료 대비 습득 기술 수','수강 시간','강사 인지도'],a:1},
  {q:'한국 문화센터 강좌에서 지역별 강좌 수가 가장 많은 지역은?',opts:['서울','경기','부산','대구'],a:0},
  {q:'Canvas API에서 arc() 메서드의 각도 단위는?',opts:['도(degree)','라디안(radian)','그라디안(gradian)','백분율'],a:1},
  {q:'오프라인 학습에서 &quot;간격 반복&quot;(Spaced Repetition) 효과는?',opts:['기억 유지율 50% 향상','학습 속도만 향상','단기 기억만 향상','효과 없음'],a:0},
  {q:'PWA의 manifest.json에서 &quot;display&quot; 속성값으로 올바르지 않은 것은?',opts:['standalone','fullscreen','browser','embedded'],a:3},
  {q:'클래스101의 수익 모델에서 강사에게 돌아가는 수익 비율은 보통?',opts:['10~20%','30~50%','60~80%','90% 이상'],a:1},
  {q:'히트맵 시각화에서 색상 보간(interpolation)에 가장 적합한 색공간은?',opts:['RGB','CMYK','HSL','Hex'],a:2},
  {q:'문화센터 강좌의 분기별 수강 신청 피크 시기는?',opts:['1월/4월/7월/10월','3월/6월/9월/12월','2월/5월/8월/11월','매월 1일'],a:0},
  {q:'v15에서 새로 추가된 Canvas 시각화 기능은 총 몇 개인가?',opts:['4개','6개','8개','10개'],a:2}
];

/* ===== 기능 추적 + 업적 ===== */
var v15Features=lsGet('cc-v15-features',{});
function trackFeature15(name){
  if(!v15Features[name]){v15Features[name]=1;}else{v15Features[name]++;}
  lsSet('cc-v15-features',v15Features);
  checkAchieve15();
}
function checkAchieve15(){
  var unlocked=lsGet('cc-v15-unlocked',[]);
  var checks=[
    {id:'completion_analyst',cond:function(){return v15Features.completion>=1;}},
    {id:'completion_master',cond:function(){return v15Features.completion>=5;}},
    {id:'style_finder',cond:function(){return v15Features.style>=1;}},
    {id:'time_optimizer',cond:function(){return v15Features.timeslot>=1;}},
    {id:'community_joiner',cond:function(){return v15Features.community>=1;}},
    {id:'roi_calculator',cond:function(){return v15Features.roi>=1;}},
    {id:'milestone_setter',cond:function(){return (v15Features.milestone_set||0)>=3;}},
    {id:'density_explorer',cond:function(){return v15Features.density>=1;}},
    {id:'report_creator',cond:function(){return v15Features.report>=1;}},
    {id:'report_downloader',cond:function(){return v15Features.report_dl>=1;}},
    {id:'quiz_v15_ace',cond:function(){return lsGet('cc-v15-quiz-best',0)>=90;}},
    {id:'v15_explorer',cond:function(){var cnt=0;['completion','style','timeslot','community','roi','milestone_set','density','report'].forEach(function(k){if(v15Features[k])cnt++;});return cnt>=5;}}
  ];
  checks.forEach(function(c){
    if(unlocked.indexOf(c.id)===-1&&c.cond()){
      unlocked.push(c.id);lsSet('cc-v15-unlocked',unlocked);
      var a=V15_ACHIEVEMENTS.find(function(x){return x.id===c.id;});
      if(a){SFX15.play('achieve_v15');showToast15('🏆 업적 해금: '+a.name+' — '+a.desc,3000);}
    }
  });
}

/* ===== 모달 팩토리 ===== */
function makeModal15(title,subtitle){
  var old=qs('#v15-modal');if(old)old.remove();
  var dk=isDark();
  var modal=ce('div');modal.id='v15-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:99998;animation:v15FadeIn 0.3s ease;';
  var inner=ce('div');
  inner.style.cssText='background:'+(dk?'#1a1a2e':'#ffffff')+';border-radius:20px;max-width:700px;width:95%;max-height:88vh;overflow-y:auto;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,0.5);animation:v15SlideUp 0.35s ease;position:relative;';
  var closeBtn=ce('button');closeBtn.textContent='✕';
  closeBtn.style.cssText='position:absolute;top:14px;right:14px;background:none;border:none;font-size:20px;cursor:pointer;color:'+(dk?'#aaa':'#666')+';z-index:10;';
  closeBtn.onclick=function(){modal.remove();};
  modal.onclick=function(e){if(e.target===modal)modal.remove();};
  var hdr=ce('div');
  hdr.innerHTML='<div style="font-size:20px;font-weight:700;color:'+(dk?'#fff':'#1a1a2e')+';">'+title+'</div><div style="font-size:13px;color:'+(dk?'#8BA4C4':'#666')+';margin-top:4px;">'+subtitle+'</div>';
  hdr.style.cssText='margin-bottom:18px;';
  var box=ce('div');
  inner.appendChild(closeBtn);inner.appendChild(hdr);inner.appendChild(box);
  modal.appendChild(inner);
  return{modal:modal,box:box,inner:inner};
}

/* ===== 1. 수강 완주율 분석기 Canvas 580x360 ===== */
function openCompletionAnalyzer(){
  SFX15.play('completion_open');trackFeature15('completion');
  var dk=isDark();var r=makeModal15('&#128202; 수강 완주율 분석기','카테고리별 완주율 + 중도포기 원인 분석');
  var canvas=ce('canvas');canvas.width=580;canvas.height=360;
  canvas.style.cssText='width:100%;max-width:580px;display:block;margin:0 auto 12px;border-radius:12px;';
  var cats=['요가','수영','피아노','미술','댄스','외국어','요리','코딩','서예','플로리스트'];
  var rates=cats.map(function(){return Math.floor(Math.random()*40+55);});
  var dropReasons=['시간부족','흥미감소','난이도','비용','이사/출장'];
  var dropData=dropReasons.map(function(){return Math.floor(Math.random()*30+5);});
  function draw(){
    var ctx=canvas.getContext('2d');var W=580,H=360;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 15px sans-serif';
    ctx.fillText('카테고리별 수강 완주율 (%)',30,28);
    ctx.font='11px sans-serif';ctx.fillStyle=dk?'#8BA4C4':'#666';
    ctx.fillText('■ 완주율  ■ 포기율  (80%+ 우수)',30,46);
    var startX=55,startY=200,barW=20,chartH=140;
    cats.forEach(function(cat,i){
      var x=startX+i*52;
      var h=rates[i]/100*chartH;
      var grad=ctx.createLinearGradient(x,startY-h,x,startY);
      if(rates[i]>=80){grad.addColorStop(0,'#4CAF50');grad.addColorStop(1,'#2E7D32');}
      else if(rates[i]>=65){grad.addColorStop(0,'#FF9800');grad.addColorStop(1,'#E65100');}
      else{grad.addColorStop(0,'#F44336');grad.addColorStop(1,'#B71C1C');}
      ctx.fillStyle=grad;ctx.fillRect(x,startY-h,barW,h);
      var dropH=(100-rates[i])/100*chartH;
      ctx.fillStyle=dk?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.08)';
      ctx.fillRect(x+barW+2,startY-dropH,barW*0.5,dropH);
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 10px sans-serif';
      ctx.fillText(rates[i]+'%',x,startY-h-6);
      ctx.save();ctx.translate(x+barW/2,startY+12);ctx.rotate(-Math.PI/6);
      ctx.fillStyle=dk?'#8BA4C4':'#555';ctx.font='10px sans-serif';
      ctx.fillText(cat,0,0);ctx.restore();
    });
    for(var g=0;g<=4;g++){
      var y=startY-g*(chartH/4);
      ctx.strokeStyle=dk?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.06)';
      ctx.beginPath();ctx.moveTo(startX-10,y);ctx.lineTo(startX+cats.length*52,y);ctx.stroke();
      ctx.fillStyle=dk?'#8BA4C4':'#888';ctx.font='10px sans-serif';
      ctx.fillText(String(g*25)+'%',10,y+4);
    }
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 13px sans-serif';
    ctx.fillText('중도포기 원인 분석',30,240);
    var totalDrop=dropData.reduce(function(a,b){return a+b;},0);
    var pieX=150,pieY=300,pieR=45,startAngle=-Math.PI/2;
    var colors=['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#98D8C8'];
    dropReasons.forEach(function(reason,i){
      var sliceAngle=dropData[i]/totalDrop*Math.PI*2;
      ctx.beginPath();ctx.moveTo(pieX,pieY);
      ctx.arc(pieX,pieY,pieR,startAngle,startAngle+sliceAngle);
      ctx.fillStyle=colors[i];ctx.fill();
      var midAngle=startAngle+sliceAngle/2;
      var lx=pieX+Math.cos(midAngle)*(pieR+20);
      var ly=pieY+Math.sin(midAngle)*(pieR+20);
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='9px sans-serif';
      ctx.fillText(reason+' '+Math.round(dropData[i]/totalDrop*100)+'%',lx-15,ly+3);
      startAngle+=sliceAngle;
    });
    var legendX=320,legendY=245;
    ctx.font='11px sans-serif';
    dropReasons.forEach(function(reason,i){
      ctx.fillStyle=colors[i];ctx.fillRect(legendX,legendY+i*18,10,10);
      ctx.fillStyle=dk?'#e0e0e0':'#333';
      ctx.fillText(reason+': '+dropData[i]+'명 ('+Math.round(dropData[i]/totalDrop*100)+'%)',legendX+14,legendY+i*18+9);
    });
    var avgRate=Math.round(rates.reduce(function(a,b){return a+b;},0)/rates.length);
    ctx.fillStyle=dk?'rgba(126,200,227,0.15)':'rgba(126,200,227,0.1)';
    ctx.fillRect(350,230,220,120);
    ctx.fillStyle=dk?'#7EC8E3':'#2196F3';ctx.font='bold 12px sans-serif';
    ctx.fillText('요약 통계',362,248);
    ctx.font='11px sans-serif';ctx.fillStyle=dk?'#e0e0e0':'#333';
    ctx.fillText('평균 완주율: '+avgRate+'%',362,268);
    ctx.fillText('최고: '+cats[rates.indexOf(Math.max.apply(null,rates))]+' ('+Math.max.apply(null,rates)+'%)',362,286);
    ctx.fillText('최저: '+cats[rates.indexOf(Math.min.apply(null,rates))]+' ('+Math.min.apply(null,rates)+'%)',362,304);
    ctx.fillText('등급: '+(avgRate>=80?'S':avgRate>=70?'A':avgRate>=60?'B':'C'),362,322);
  }
  draw();
  var refreshBtn=ce('button');refreshBtn.textContent='🔄 데이터 새로고침';
  refreshBtn.style.cssText='display:block;margin:8px auto;padding:10px 24px;border-radius:12px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'#252540':'#f0f4f8')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:13px;cursor:pointer;';
  refreshBtn.onclick=function(){
    rates=cats.map(function(){return Math.floor(Math.random()*40+55);});
    dropData=dropReasons.map(function(){return Math.floor(Math.random()*30+5);});
    draw();SFX15.play('completion_open');showToast15('📊 완주율 데이터 갱신',1500);
  };
  r.box.appendChild(canvas);r.box.appendChild(refreshBtn);
  document.body.appendChild(r.modal);
}

/* ===== 2. 학습 스타일 진단기 Canvas 520x400 6축 Radar ===== */
function openLearningStyleDiag(){
  SFX15.play('style_analyze');trackFeature15('style');
  var dk=isDark();var r=makeModal15('&#128161; 학습 스타일 진단기','VARK 기반 6축 학습 성향 레이더 분석');
  var dims=['시각(Visual)','청각(Aural)','읽기/쓰기','체험(Kinesthetic)','사회적학습','독립학습'];
  var scores=lsGet('cc-v15-style-scores',dims.map(function(){return Math.floor(Math.random()*50+40);}));
  var canvas=ce('canvas');canvas.width=520;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:520px;display:block;margin:0 auto 12px;border-radius:12px;';
  function drawRadar(){
    var ctx=canvas.getContext('2d');var W=520,H=400;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 15px sans-serif';
    ctx.fillText('나의 학습 스타일 프로필',30,28);
    var cx=260,cy=220,maxR=130,n=dims.length;
    for(var ring=1;ring<=4;ring++){
      ctx.beginPath();
      for(var j=0;j<=n;j++){
        var angle=-Math.PI/2+j*(Math.PI*2/n);
        var rr=maxR*ring/4;
        var px=cx+Math.cos(angle)*rr;
        var py=cy+Math.sin(angle)*rr;
        if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
      }
      ctx.strokeStyle=dk?'rgba(255,255,255,0.1)':'rgba(0,0,0,0.08)';
      ctx.stroke();
      ctx.fillStyle=dk?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.02)';
      ctx.fill();
    }
    for(var i=0;i<n;i++){
      var angle=-Math.PI/2+i*(Math.PI*2/n);
      ctx.beginPath();ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(angle)*maxR,cy+Math.sin(angle)*maxR);
      ctx.strokeStyle=dk?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.1)';ctx.stroke();
      var lx=cx+Math.cos(angle)*(maxR+22);
      var ly=cy+Math.sin(angle)*(maxR+22);
      ctx.fillStyle=dk?'#8BA4C4':'#555';ctx.font='11px sans-serif';
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(dims[i],lx,ly);
    }
    ctx.textAlign='start';ctx.textBaseline='alphabetic';
    ctx.beginPath();
    for(var i=0;i<n;i++){
      var angle=-Math.PI/2+i*(Math.PI*2/n);
      var r2=scores[i]/100*maxR;
      var px=cx+Math.cos(angle)*r2;
      var py=cy+Math.sin(angle)*r2;
      if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.closePath();
    ctx.fillStyle=dk?'rgba(126,200,227,0.25)':'rgba(33,150,243,0.2)';ctx.fill();
    ctx.strokeStyle=dk?'#7EC8E3':'#2196F3';ctx.lineWidth=2.5;ctx.stroke();
    for(var i=0;i<n;i++){
      var angle=-Math.PI/2+i*(Math.PI*2/n);
      var r2=scores[i]/100*maxR;
      var px=cx+Math.cos(angle)*r2;
      var py=cy+Math.sin(angle)*r2;
      ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);
      ctx.fillStyle=dk?'#7EC8E3':'#2196F3';ctx.fill();
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='bold 10px sans-serif';
      ctx.fillText(scores[i],px+6,py-6);
    }
    ctx.lineWidth=1;
    var avgScore=Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length);
    var maxIdx=scores.indexOf(Math.max.apply(null,scores));
    var minIdx=scores.indexOf(Math.min.apply(null,scores));
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 12px sans-serif';
    ctx.fillText('진단 결과',30,58);
    ctx.font='11px sans-serif';ctx.fillStyle=dk?'#e0e0e0':'#333';
    ctx.fillText('평균 점수: '+avgScore+'/100 (등급: '+(avgScore>=85?'S':avgScore>=70?'A':avgScore>=55?'B':'C')+')',30,78);
    ctx.fillText('강점: '+dims[maxIdx]+' ('+scores[maxIdx]+')',30,96);
    ctx.fillText('보완점: '+dims[minIdx]+' ('+scores[minIdx]+')',30,114);
    var types=['시각 중심형','청각 중심형','읽기/쓰기형','체험 중심형','협동학습형','자기주도형'];
    ctx.fillText('추천 학습법: '+types[maxIdx],30,132);
  }
  drawRadar();
  var sliderBox=ce('div');sliderBox.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px;';
  dims.forEach(function(dim,i){
    var wrap=ce('div');wrap.style.cssText='text-align:center;';
    var lbl=ce('div');lbl.textContent=dim;lbl.style.cssText='font-size:11px;color:'+(dk?'#8BA4C4':'#666')+';margin-bottom:4px;';
    var slider=ce('input');slider.type='range';slider.min='10';slider.max='100';slider.value=String(scores[i]);
    slider.style.cssText='width:100%;accent-color:#7EC8E3;';
    var val=ce('span');val.textContent=scores[i];val.style.cssText='font-size:12px;font-weight:bold;color:'+(dk?'#e0e0e0':'#333')+';';
    slider.oninput=function(){scores[i]=parseInt(this.value);val.textContent=this.value;lsSet('cc-v15-style-scores',scores);drawRadar();};
    wrap.appendChild(lbl);wrap.appendChild(slider);wrap.appendChild(val);
    sliderBox.appendChild(wrap);
  });
  r.box.appendChild(canvas);r.box.appendChild(sliderBox);
  document.body.appendChild(r.modal);
}

/* ===== 3. 강좌 시간대 최적화기 Canvas 560x340 히트맵 ===== */
function openTimeSlotOptimizer(){
  SFX15.play('timeslot_view');trackFeature15('timeslot');
  var dk=isDark();var r=makeModal15('&#9200; 강좌 시간대 최적화기','요일×시간대 히트맵 + 최적 수강 시간 추천');
  var canvas=ce('canvas');canvas.width=560;canvas.height=340;
  canvas.style.cssText='width:100%;max-width:560px;display:block;margin:0 auto 12px;border-radius:12px;';
  var days=['월','화','수','목','금','토','일'];
  var hours=['09시','10시','11시','12시','13시','14시','15시','16시','17시','18시','19시','20시'];
  var heatData=days.map(function(){return hours.map(function(){return Math.floor(Math.random()*100);});});
  function getHeatColor(val){
    if(val>=80)return dk?'#E53935':'#F44336';
    if(val>=60)return dk?'#FF7043':'#FF5722';
    if(val>=40)return dk?'#FFB74D':'#FF9800';
    if(val>=20)return dk?'#81C784':'#4CAF50';
    return dk?'#26A69A':'#009688';
  }
  function draw(){
    var ctx=canvas.getContext('2d');var W=560,H=340;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 15px sans-serif';
    ctx.fillText('요일 × 시간대 강좌 경쟁도 히트맵',30,24);
    ctx.font='10px sans-serif';ctx.fillStyle=dk?'#8BA4C4':'#666';
    ctx.fillText('(수치가 낮을수록 수강 신청 경쟁이 적어 유리)',30,40);
    var startX=55,startY=60,cellW=38,cellH=28;
    ctx.fillStyle=dk?'#8BA4C4':'#555';ctx.font='10px sans-serif';
    hours.forEach(function(h,j){
      ctx.fillText(h,startX+j*cellW+8,startY-6);
    });
    days.forEach(function(day,i){
      ctx.fillStyle=dk?'#8BA4C4':'#555';ctx.font='bold 11px sans-serif';
      ctx.fillText(day,startX-20,startY+i*cellH+18);
      hours.forEach(function(_h,j){
        var val=heatData[i][j];
        ctx.fillStyle=getHeatColor(val);
        ctx.fillRect(startX+j*cellW,startY+i*cellH,cellW-2,cellH-2);
        ctx.fillStyle=val>=50?'#fff':'#333';ctx.font='bold 9px sans-serif';
        ctx.fillText(String(val),startX+j*cellW+12,startY+i*cellH+17);
      });
    });
    var legendY=startY+days.length*cellH+16;
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 11px sans-serif';
    ctx.fillText('경쟁도 범례:',30,legendY);
    var legendColors=[{c:'#009688',l:'0~19 매우 여유'},{c:'#4CAF50',l:'20~39 여유'},{c:'#FF9800',l:'40~59 보통'},{c:'#FF5722',l:'60~79 혼잡'},{c:'#F44336',l:'80~100 매우 혼잡'}];
    legendColors.forEach(function(lc,i){
      ctx.fillStyle=lc.c;ctx.fillRect(110+i*90,legendY-10,12,12);
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='9px sans-serif';
      ctx.fillText(lc.l,124+i*90,legendY);
    });
    var bestDay=0,bestHour=0,bestVal=Infinity;
    heatData.forEach(function(row,i){row.forEach(function(val,j){if(val<bestVal){bestVal=val;bestDay=i;bestHour=j;}});});
    ctx.fillStyle=dk?'rgba(0,230,118,0.15)':'rgba(0,200,83,0.1)';
    ctx.fillRect(startX+bestHour*cellW-2,startY+bestDay*cellH-2,cellW+2,cellH+2);
    ctx.strokeStyle='#00E676';ctx.lineWidth=2;
    ctx.strokeRect(startX+bestHour*cellW-2,startY+bestDay*cellH-2,cellW+2,cellH+2);
    ctx.lineWidth=1;
    ctx.fillStyle=dk?'#00E676':'#00C853';ctx.font='bold 11px sans-serif';
    ctx.fillText('★ 추천: '+days[bestDay]+' '+hours[bestHour]+' (경쟁도 '+bestVal+')',30,legendY+22);
    ctx.fillStyle=dk?'#8BA4C4':'#666';ctx.font='11px sans-serif';
    ctx.fillText('평일 오전: 시니어 우대 / 저녁: 직장인 집중 / 주말: 가족형',30,legendY+40);
  }
  draw();
  var refreshBtn=ce('button');refreshBtn.textContent='🔄 시간대 재분석';
  refreshBtn.style.cssText='display:block;margin:8px auto;padding:10px 24px;border-radius:12px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'#252540':'#f0f4f8')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:13px;cursor:pointer;';
  refreshBtn.onclick=function(){
    heatData=days.map(function(){return hours.map(function(){return Math.floor(Math.random()*100);});});
    draw();SFX15.play('timeslot_view');showToast15('⏰ 시간대 경쟁도 갱신',1500);
  };
  r.box.appendChild(canvas);r.box.appendChild(refreshBtn);
  document.body.appendChild(r.modal);
}

/* ===== 4. 수강생 커뮤니티 매칭 Canvas 580x380 네트워크 ===== */
function openCommunityMatch(){
  SFX15.play('community_match');trackFeature15('community');
  var dk=isDark();var r=makeModal15('&#129309; 수강생 커뮤니티 매칭','관심사 기반 학습 그룹 매칭 네트워크');
  var canvas=ce('canvas');canvas.width=580;canvas.height=380;
  canvas.style.cssText='width:100%;max-width:580px;display:block;margin:0 auto 12px;border-radius:12px;';
  var members=[
    {name:'나',x:290,y:190,r:22,color:'#7EC8E3',interests:['피아노','요가','코딩']},
    {name:'민준',x:130,y:100,r:16,color:'#FF6B6B',interests:['피아노','미술']},
    {name:'서윤',x:430,y:90,r:16,color:'#4ECDC4',interests:['요가','댄스','수영']},
    {name:'하준',x:100,y:260,r:16,color:'#45B7D1',interests:['코딩','외국어']},
    {name:'지우',x:460,y:270,r:16,color:'#FFA07A',interests:['요리','플로리스트']},
    {name:'예은',x:200,y:320,r:16,color:'#98D8C8',interests:['피아노','서예','코딩']},
    {name:'도윤',x:380,y:330,r:16,color:'#DDA0DD',interests:['수영','요가']},
    {name:'수아',x:300,y:70,r:16,color:'#FFD700',interests:['미술','댄스','요리']},
    {name:'시우',x:500,y:180,r:16,color:'#87CEEB',interests:['코딩','외국어','수영']},
    {name:'하윤',x:80,y:170,r:16,color:'#F0E68C',interests:['서예','미술','요가']}
  ];
  function getMatch(a,b){
    var shared=a.interests.filter(function(i){return b.interests.indexOf(i)>=0;});
    return shared;
  }
  function draw(){
    var ctx=canvas.getContext('2d');var W=580,H=380;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 15px sans-serif';
    ctx.fillText('학습 커뮤니티 네트워크',30,24);
    ctx.font='10px sans-serif';ctx.fillStyle=dk?'#8BA4C4':'#666';
    ctx.fillText('공통 관심사가 있는 수강생끼리 연결 (굵기 = 유사도)',30,40);
    for(var i=0;i<members.length;i++){
      for(var j=i+1;j<members.length;j++){
        var shared=getMatch(members[i],members[j]);
        if(shared.length>0){
          ctx.beginPath();ctx.moveTo(members[i].x,members[i].y);
          ctx.lineTo(members[j].x,members[j].y);
          ctx.strokeStyle=dk?'rgba(126,200,227,'+(0.15+shared.length*0.15)+')':'rgba(33,150,243,'+(0.1+shared.length*0.12)+')';
          ctx.lineWidth=shared.length*1.5;ctx.stroke();
          var mx=(members[i].x+members[j].x)/2;
          var my=(members[i].y+members[j].y)/2;
          if(shared.length>=2){
            ctx.fillStyle=dk?'rgba(255,215,0,0.7)':'rgba(255,165,0,0.8)';ctx.font='8px sans-serif';
            ctx.fillText(shared.join(','),mx-10,my-4);
          }
        }
      }
    }
    ctx.lineWidth=1;
    members.forEach(function(m){
      ctx.beginPath();ctx.arc(m.x,m.y,m.r,0,Math.PI*2);
      var grad=ctx.createRadialGradient(m.x-3,m.y-3,2,m.x,m.y,m.r);
      grad.addColorStop(0,m.color);grad.addColorStop(1,m.color+'99');
      ctx.fillStyle=grad;ctx.fill();
      ctx.strokeStyle=dk?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.15)';ctx.stroke();
      ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold '+(m.name==='나'?'13':'10')+'px sans-serif';
      ctx.textAlign='center';ctx.fillText(m.name,m.x,m.y+m.r+14);
      ctx.textAlign='start';
    });
    var me=members[0];
    var matches=members.slice(1).map(function(m){
      var shared=getMatch(me,m);return{name:m.name,shared:shared,score:shared.length};
    }).sort(function(a,b){return b.score-a.score;});
    ctx.fillStyle=dk?'rgba(126,200,227,0.1)':'rgba(126,200,227,0.07)';
    ctx.fillRect(10,50,140,60);
    ctx.fillStyle=dk?'#7EC8E3':'#2196F3';ctx.font='bold 11px sans-serif';
    ctx.fillText('Best Match',18,66);
    ctx.font='10px sans-serif';ctx.fillStyle=dk?'#e0e0e0':'#333';
    if(matches[0]&&matches[0].score>0){
      ctx.fillText('1위: '+matches[0].name+' ('+matches[0].shared.join(', ')+')',18,82);
    }
    if(matches[1]&&matches[1].score>0){
      ctx.fillText('2위: '+matches[1].name+' ('+matches[1].shared.join(', ')+')',18,98);
    }
  }
  draw();
  r.box.appendChild(canvas);
  document.body.appendChild(r.modal);
}

/* ===== 5. 강좌 ROI 계산기 Canvas 560x360 ===== */
function openCourseROI(){
  SFX15.play('roi_calc');trackFeature15('roi');
  var dk=isDark();var r=makeModal15('&#128176; 강좌 ROI 계산기','수강료 대비 학습 효과 투자 수익률 분석');
  var canvas=ce('canvas');canvas.width=560;canvas.height=360;
  canvas.style.cssText='width:100%;max-width:560px;display:block;margin:0 auto 12px;border-radius:12px;';
  var courses=[
    {name:'피아노 초급',cost:80000,hours:24,skills:3,satisfaction:88},
    {name:'영어 회화',cost:120000,hours:36,skills:5,satisfaction:82},
    {name:'요가 입문',cost:60000,hours:16,skills:2,satisfaction:92},
    {name:'코딩 기초',cost:150000,hours:40,skills:8,satisfaction:85},
    {name:'수채화',cost:90000,hours:20,skills:4,satisfaction:90},
    {name:'쿠킹 클래스',cost:100000,hours:12,skills:6,satisfaction:95},
    {name:'댄스 피트니스',cost:70000,hours:24,skills:3,satisfaction:87},
    {name:'서예 정서',cost:50000,hours:16,skills:2,satisfaction:91}
  ];
  courses.forEach(function(c){
    c.costPerHour=Math.round(c.cost/c.hours);
    c.skillPerWon=Math.round(c.skills/(c.cost/10000)*100)/100;
    c.roi=Math.round((c.satisfaction*c.skills*c.hours)/(c.cost/10000));
  });
  courses.sort(function(a,b){return b.roi-a.roi;});
  function draw(){
    var ctx=canvas.getContext('2d');var W=560,H=360;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 15px sans-serif';
    ctx.fillText('강좌 ROI 순위 (만족도 × 기술 × 시간 / 비용)',20,24);
    var maxROI=Math.max.apply(null,courses.map(function(c){return c.roi;}));
    var barH=28,startX=140,startY=48,chartW=380;
    courses.forEach(function(c,i){
      var y=startY+i*barH+i*6;
      var w=c.roi/maxROI*chartW;
      var grad=ctx.createLinearGradient(startX,y,startX+w,y);
      if(i===0){grad.addColorStop(0,'#FFD700');grad.addColorStop(1,'#FFA000');}
      else if(i===1){grad.addColorStop(0,'#C0C0C0');grad.addColorStop(1,'#9E9E9E');}
      else if(i===2){grad.addColorStop(0,'#CD7F32');grad.addColorStop(1,'#8B4513');}
      else{grad.addColorStop(0,'#7EC8E3');grad.addColorStop(1,'#5BA8C8');}
      ctx.fillStyle=grad;
      ctx.beginPath();
      var br=6;
      ctx.moveTo(startX,y);ctx.lineTo(startX+w-br,y);ctx.quadraticCurveTo(startX+w,y,startX+w,y+br);
      ctx.lineTo(startX+w,y+barH-br);ctx.quadraticCurveTo(startX+w,y+barH,startX+w-br,y+barH);
      ctx.lineTo(startX,y+barH);ctx.closePath();ctx.fill();
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='11px sans-serif';
      ctx.fillText(c.name,10,y+18);
      ctx.fillStyle=i<3?'#fff':(dk?'#fff':'#333');ctx.font='bold 10px sans-serif';
      ctx.fillText('ROI: '+c.roi,startX+w-50,y+18);
      ctx.fillStyle=dk?'#8BA4C4':'#888';ctx.font='9px sans-serif';
      ctx.fillText(Math.round(c.cost/10000)+'만원 | '+c.hours+'h | 만족'+c.satisfaction+'%',startX+w+8,y+18);
    });
    ctx.fillStyle=dk?'rgba(255,215,0,0.1)':'rgba(255,215,0,0.08)';
    ctx.fillRect(10,startY+courses.length*(barH+6)+10,540,42);
    ctx.fillStyle=dk?'#FFD700':'#F57F17';ctx.font='bold 12px sans-serif';
    ctx.fillText('💡 Best ROI: '+courses[0].name,20,startY+courses.length*(barH+6)+30);
    ctx.font='11px sans-serif';ctx.fillStyle=dk?'#e0e0e0':'#333';
    ctx.fillText('시간당 비용 '+courses[0].costPerHour.toLocaleString()+'원 | 기술 '+courses[0].skills+'개 습득 | 만족도 '+courses[0].satisfaction+'%',20,startY+courses.length*(barH+6)+46);
  }
  draw();
  r.box.appendChild(canvas);
  document.body.appendChild(r.modal);
}

/* ===== 6. 학습 마일스톤 트래커 Canvas 580x340 타임라인 ===== */
function openMilestoneTracker(){
  SFX15.play('milestone_track');trackFeature15('milestone_set');
  var dk=isDark();var r=makeModal15('&#127919; 학습 마일스톤 트래커','목표 설정 + 달성률 타임라인 시각화');
  var milestones=lsGet('cc-v15-milestones',[
    {name:'첫 강좌 수강신청',target:'2026-01',done:true,xp:100},
    {name:'3개 카테고리 체험',target:'2026-02',done:true,xp:200},
    {name:'첫 수강 후기 작성',target:'2026-03',done:true,xp:150},
    {name:'10개 강좌 비교',target:'2026-04',done:true,xp:250},
    {name:'학습 스타일 진단',target:'2026-05',done:true,xp:200},
    {name:'커뮤니티 매칭 참여',target:'2026-06',done:false,xp:300},
    {name:'분기별 ROI 분석',target:'2026-07',done:false,xp:350},
    {name:'5개 강좌 완주',target:'2026-08',done:false,xp:500},
    {name:'전문가 등급 달성',target:'2026-09',done:false,xp:600},
    {name:'올해의 수강생',target:'2026-12',done:false,xp:1000}
  ]);
  var canvas=ce('canvas');canvas.width=580;canvas.height=340;
  canvas.style.cssText='width:100%;max-width:580px;display:block;margin:0 auto 12px;border-radius:12px;';
  function draw(){
    var ctx=canvas.getContext('2d');var W=580,H=340;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 15px sans-serif';
    ctx.fillText('학습 마일스톤 타임라인',30,24);
    var doneCount=milestones.filter(function(m){return m.done;}).length;
    var totalXP=milestones.filter(function(m){return m.done;}).reduce(function(s,m){return s+m.xp;},0);
    ctx.font='11px sans-serif';ctx.fillStyle=dk?'#8BA4C4':'#666';
    ctx.fillText('달성: '+doneCount+'/'+milestones.length+' | 획득 XP: '+totalXP+' | 등급: '+(totalXP>=2000?'마스터':totalXP>=1000?'전문가':totalXP>=500?'중급자':'초보자'),30,42);
    var lineY=120,startX=40,endX=540,gap=(endX-startX)/(milestones.length-1);
    ctx.strokeStyle=dk?'rgba(255,255,255,0.15)':'rgba(0,0,0,0.1)';
    ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(startX,lineY);ctx.lineTo(endX,lineY);ctx.stroke();
    var progressX=startX+(doneCount>0?(doneCount-1)*gap+gap*0.5:0);
    var progGrad=ctx.createLinearGradient(startX,lineY,progressX,lineY);
    progGrad.addColorStop(0,'#4CAF50');progGrad.addColorStop(1,'#7EC8E3');
    ctx.strokeStyle=progGrad;ctx.lineWidth=4;
    ctx.beginPath();ctx.moveTo(startX,lineY);ctx.lineTo(Math.min(progressX,endX),lineY);ctx.stroke();
    ctx.lineWidth=1;
    milestones.forEach(function(m,i){
      var x=startX+i*gap;
      ctx.beginPath();ctx.arc(x,lineY,m.done?10:8,0,Math.PI*2);
      if(m.done){
        ctx.fillStyle='#4CAF50';ctx.fill();
        ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';
        ctx.textAlign='center';ctx.fillText('✓',x,lineY+4);
      }else{
        ctx.fillStyle=dk?'#333':'#e0e0e0';ctx.fill();
        ctx.strokeStyle=dk?'#555':'#bbb';ctx.stroke();
      }
      ctx.textAlign='center';
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='9px sans-serif';
      var textY=i%2===0?lineY-22:lineY+28;
      ctx.fillText(m.name,x,textY);
      ctx.fillStyle=dk?'#8BA4C4':'#888';ctx.font='8px sans-serif';
      ctx.fillText(m.target+' (+'+m.xp+'XP)',x,textY+(i%2===0?-12:12));
    });
    ctx.textAlign='start';
    var barY=180;
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 12px sans-serif';
    ctx.fillText('XP 프로그레스',30,barY);
    var levels=[{name:'초보자',min:0},{name:'중급자',min:500},{name:'전문가',min:1000},{name:'마스터',min:2000},{name:'그랜드마스터',min:3650}];
    var currentLevel=levels[0];
    var nextLevel=levels[1];
    for(var li=levels.length-1;li>=0;li--){if(totalXP>=levels[li].min){currentLevel=levels[li];nextLevel=levels[Math.min(li+1,levels.length-1)];break;}}
    var barX=30,barWidth=520,barHeight=24;
    ctx.fillStyle=dk?'#333':'#e0e0e0';
    ctx.beginPath();ctx.moveTo(barX+12,barY+10);ctx.lineTo(barX+barWidth-12,barY+10);
    ctx.quadraticCurveTo(barX+barWidth,barY+10,barX+barWidth,barY+10+12);
    ctx.lineTo(barX+barWidth,barY+10+barHeight-12);ctx.quadraticCurveTo(barX+barWidth,barY+10+barHeight,barX+barWidth-12,barY+10+barHeight);
    ctx.lineTo(barX+12,barY+10+barHeight);ctx.quadraticCurveTo(barX,barY+10+barHeight,barX,barY+10+barHeight-12);
    ctx.lineTo(barX,barY+10+12);ctx.quadraticCurveTo(barX,barY+10,barX+12,barY+10);ctx.fill();
    var fillW=Math.min(totalXP/3650*barWidth,barWidth);
    var fillGrad=ctx.createLinearGradient(barX,barY+10,barX+fillW,barY+10);
    fillGrad.addColorStop(0,'#4CAF50');fillGrad.addColorStop(0.5,'#7EC8E3');fillGrad.addColorStop(1,'#FFD700');
    ctx.fillStyle=fillGrad;
    ctx.beginPath();ctx.moveTo(barX+12,barY+10);ctx.lineTo(barX+fillW-4,barY+10);
    ctx.lineTo(barX+fillW-4,barY+10+barHeight);ctx.lineTo(barX+12,barY+10+barHeight);
    ctx.quadraticCurveTo(barX,barY+10+barHeight,barX,barY+10+barHeight-12);
    ctx.lineTo(barX,barY+10+12);ctx.quadraticCurveTo(barX,barY+10,barX+12,barY+10);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='bold 11px sans-serif';
    ctx.fillText(currentLevel.name+' | '+totalXP+' XP',barX+12,barY+10+16);
    levels.forEach(function(lv){
      var lx=barX+(lv.min/3650)*barWidth;
      ctx.strokeStyle=dk?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.2)';
      ctx.beginPath();ctx.moveTo(lx,barY+10);ctx.lineTo(lx,barY+10+barHeight);ctx.stroke();
    });
    ctx.fillStyle=dk?'#8BA4C4':'#666';ctx.font='10px sans-serif';
    ctx.fillText('다음 등급: '+nextLevel.name+' ('+nextLevel.min+' XP 필요)',30,barY+52);
    var listY=barY+70;
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 12px sans-serif';
    ctx.fillText('최근 달성',30,listY);
    var recent=milestones.filter(function(m){return m.done;}).slice(-3);
    recent.forEach(function(m,i){
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='11px sans-serif';
      ctx.fillText('✓ '+m.name+' (+'+m.xp+'XP)',30,listY+16+i*16);
    });
    var upcoming=milestones.filter(function(m){return!m.done;}).slice(0,3);
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 12px sans-serif';
    ctx.fillText('다음 목표',300,listY);
    upcoming.forEach(function(m,i){
      ctx.fillStyle=dk?'#8BA4C4':'#666';ctx.font='11px sans-serif';
      ctx.fillText('○ '+m.name+' ('+m.target+', +'+m.xp+'XP)',300,listY+16+i*16);
    });
  }
  draw();
  var toggleBtn=ce('button');toggleBtn.textContent='✅ 다음 마일스톤 달성하기';
  toggleBtn.style.cssText='display:block;margin:8px auto;padding:10px 24px;border-radius:12px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'#252540':'#f0f4f8')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:13px;cursor:pointer;';
  toggleBtn.onclick=function(){
    var next=milestones.find(function(m){return!m.done;});
    if(next){next.done=true;lsSet('cc-v15-milestones',milestones);draw();SFX15.play('milestone_track');showToast15('🎯 마일스톤 달성: '+next.name+' (+'+next.xp+'XP)',2000);trackFeature15('milestone_set');}
    else{showToast15('🏆 모든 마일스톤 달성 완료!',2000);}
  };
  r.box.appendChild(canvas);r.box.appendChild(toggleBtn);
  document.body.appendChild(r.modal);
}

/* ===== 7. 지역별 강좌 밀도 히트맵 Canvas 600x380 ===== */
function openRegionDensityMap(){
  SFX15.play('density_map');trackFeature15('density');
  var dk=isDark();var r=makeModal15('&#128506; 지역별 강좌 밀도 히트맵','17개 시도 강좌 밀도 + 인구 대비 분석');
  var canvas=ce('canvas');canvas.width=600;canvas.height=380;
  canvas.style.cssText='width:100%;max-width:600px;display:block;margin:0 auto 12px;border-radius:12px;';
  var regions=[
    {name:'서울',courses:8540,pop:950,x:300,y:110,r:32},
    {name:'경기',courses:7280,pop:1350,x:340,y:145,r:28},
    {name:'인천',courses:2150,pop:295,x:260,y:130,r:18},
    {name:'부산',courses:3420,pop:335,x:440,y:310,r:22},
    {name:'대구',courses:2180,pop:240,x:400,y:250,r:18},
    {name:'대전',courses:1650,pop:145,x:310,y:230,r:16},
    {name:'광주',courses:1480,pop:145,x:220,y:300,r:16},
    {name:'울산',courses:980,pop:112,x:460,y:275,r:14},
    {name:'세종',courses:420,pop:38,x:290,y:210,r:12},
    {name:'강원',courses:1250,pop:154,x:380,y:90,r:16},
    {name:'충북',courses:1080,pop:160,x:340,y:195,r:14},
    {name:'충남',courses:1320,pop:215,x:260,y:220,r:15},
    {name:'전북',courses:1150,pop:180,x:240,y:265,r:14},
    {name:'전남',courses:980,pop:185,x:200,y:330,r:14},
    {name:'경북',courses:1420,pop:260,x:420,y:190,r:15},
    {name:'경남',courses:2080,pop:330,x:410,y:300,r:18},
    {name:'제주',courses:580,pop:68,x:230,y:365,r:13}
  ];
  regions.forEach(function(rg){rg.density=Math.round(rg.courses/(rg.pop/100)*10)/10;});
  function getDensityColor(d){
    if(d>=700)return'#E53935';if(d>=500)return'#FF7043';if(d>=300)return'#FFB74D';
    if(d>=150)return'#81C784';return'#26A69A';
  }
  function draw(){
    var ctx=canvas.getContext('2d');var W=600,H=380;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 15px sans-serif';
    ctx.fillText('전국 17개 시도 문화센터 강좌 밀도',20,24);
    ctx.font='10px sans-serif';ctx.fillStyle=dk?'#8BA4C4':'#666';
    ctx.fillText('원 크기 = 강좌 수 | 색상 = 인구 10만명당 밀도',20,42);
    regions.forEach(function(rg){
      ctx.beginPath();ctx.arc(rg.x,rg.y,rg.r,0,Math.PI*2);
      var color=getDensityColor(rg.density);
      ctx.fillStyle=color+'88';ctx.fill();
      ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();ctx.lineWidth=1;
      ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 9px sans-serif';
      ctx.textAlign='center';
      ctx.fillText(rg.name,rg.x,rg.y+3);
      ctx.fillStyle=dk?'#e0e0e0':'#555';ctx.font='8px sans-serif';
      ctx.fillText(rg.courses.toLocaleString()+'개',rg.x,rg.y+rg.r+10);
    });
    ctx.textAlign='start';
    var sorted=regions.slice().sort(function(a,b){return b.density-a.density;});
    ctx.fillStyle=dk?'rgba(126,200,227,0.1)':'rgba(126,200,227,0.07)';
    ctx.fillRect(10,55,165,130);
    ctx.fillStyle=dk?'#7EC8E3':'#2196F3';ctx.font='bold 11px sans-serif';
    ctx.fillText('밀도 TOP 5 (10만명당)',18,70);
    sorted.slice(0,5).forEach(function(rg,i){
      ctx.fillStyle=getDensityColor(rg.density);ctx.fillRect(18,78+i*14,8,8);
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='10px sans-serif';
      ctx.fillText((i+1)+'. '+rg.name+': '+rg.density+'건',30,86+i*14);
    });
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 11px sans-serif';
    ctx.fillText('밀도 BOTTOM 3',18,150);
    sorted.slice(-3).reverse().forEach(function(rg,i){
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='10px sans-serif';
      ctx.fillText(rg.name+': '+rg.density+'건',18,164+i*14);
    });
    var totalCourses=regions.reduce(function(s,rg){return s+rg.courses;},0);
    ctx.fillStyle=dk?'#8BA4C4':'#666';ctx.font='11px sans-serif';
    ctx.fillText('전국 총 '+totalCourses.toLocaleString()+'개 강좌',400,370);
    var legendY=55;
    var legendItems=[{c:'#E53935',l:'700+'},{c:'#FF7043',l:'500~699'},{c:'#FFB74D',l:'300~499'},{c:'#81C784',l:'150~299'},{c:'#26A69A',l:'~149'}];
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 10px sans-serif';
    ctx.fillText('밀도 범례',510,legendY);
    legendItems.forEach(function(li,i){
      ctx.fillStyle=li.c;ctx.fillRect(510,legendY+4+i*14,10,10);
      ctx.fillStyle=dk?'#e0e0e0':'#333';ctx.font='9px sans-serif';
      ctx.fillText(li.l,524,legendY+13+i*14);
    });
  }
  draw();
  r.box.appendChild(canvas);
  document.body.appendChild(r.modal);
}

/* ===== 8. 수강 성장 리포트 카드 Canvas 600x400 PNG ===== */
function openGrowthReportCard(){
  SFX15.play('report_gen');trackFeature15('report');
  var dk=isDark();var r=makeModal15('&#128196; 수강 성장 리포트 카드','학습 통계 종합 리포트 + PNG 다운로드');
  var canvas=ce('canvas');canvas.width=600;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:600px;display:block;margin:0 auto 12px;border-radius:12px;';
  var stats={
    totalCourses:lsGet('cc-v15-total-courses',Math.floor(Math.random()*15+3)),
    completionRate:lsGet('cc-v15-completion-rate',Math.floor(Math.random()*30+65)),
    totalHours:lsGet('cc-v15-total-hours',Math.floor(Math.random()*100+20)),
    quizAvg:lsGet('cc-v15-quiz-avg',Math.floor(Math.random()*25+70)),
    achievements:lsGet('cc-v15-unlocked',[]).length+lsGet('cc-v14-unlocked',[]).length+lsGet('cc-v13-unlocked',[]).length,
    streak:lsGet('cc-v15-streak',Math.floor(Math.random()*20+5))
  };
  var overallScore=Math.round((stats.completionRate*0.3+stats.quizAvg*0.3+(stats.totalHours/2)*0.2+(stats.achievements*5)*0.2));
  var grade=overallScore>=90?'S':overallScore>=80?'A':overallScore>=70?'B':overallScore>=60?'C':'D';
  function draw(){
    var ctx=canvas.getContext('2d');var W=600,H=400;
    var grad=ctx.createLinearGradient(0,0,W,H);
    grad.addColorStop(0,dk?'#0f0c29':'#667eea');
    grad.addColorStop(0.5,dk?'#302b63':'#764ba2');
    grad.addColorStop(1,dk?'#24243e':'#f093fb');
    ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
    ctx.strokeStyle='rgba(255,215,0,0.5)';ctx.lineWidth=3;
    ctx.strokeRect(8,8,W-16,H-16);
    ctx.strokeStyle='rgba(255,215,0,0.25)';ctx.lineWidth=1;
    ctx.strokeRect(14,14,W-28,H-28);
    ctx.lineWidth=1;
    ctx.fillStyle='#fff';ctx.font='bold 22px sans-serif';
    ctx.textAlign='center';
    ctx.fillText('문화센터 파인더 — 학습 성장 리포트',W/2,50);
    ctx.font='12px sans-serif';ctx.fillStyle='rgba(255,255,255,0.7)';
    ctx.fillText(fmtDate15()+' 기준 | v15.0',W/2,72);
    ctx.beginPath();ctx.arc(W/2,130,42,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fill();
    ctx.strokeStyle='#FFD700';ctx.lineWidth=3;ctx.stroke();ctx.lineWidth=1;
    ctx.fillStyle='#FFD700';ctx.font='bold 36px sans-serif';
    ctx.fillText(grade,W/2,142);
    ctx.font='11px sans-serif';ctx.fillStyle='rgba(255,255,255,0.8)';
    ctx.fillText('종합 점수: '+overallScore+'/100',W/2,170);
    var metrics=[
      {label:'수강 강좌',value:stats.totalCourses+'개',icon:'📚'},
      {label:'완주율',value:stats.completionRate+'%',icon:'✅'},
      {label:'학습 시간',value:stats.totalHours+'h',icon:'⏱'},
      {label:'퀴즈 평균',value:stats.quizAvg+'점',icon:'🧠'},
      {label:'업적 해금',value:stats.achievements+'개',icon:'🏆'},
      {label:'연속 학습',value:stats.streak+'일',icon:'🔥'}
    ];
    var cardW=155,cardH=60,startX=50,startY=195,cols=3;
    metrics.forEach(function(m,i){
      var col=i%cols;var row=Math.floor(i/cols);
      var cx2=startX+col*(cardW+22);
      var cy2=startY+row*(cardH+15);
      ctx.fillStyle='rgba(255,255,255,0.08)';
      ctx.beginPath();
      ctx.moveTo(cx2+8,cy2);ctx.lineTo(cx2+cardW-8,cy2);
      ctx.quadraticCurveTo(cx2+cardW,cy2,cx2+cardW,cy2+8);
      ctx.lineTo(cx2+cardW,cy2+cardH-8);ctx.quadraticCurveTo(cx2+cardW,cy2+cardH,cx2+cardW-8,cy2+cardH);
      ctx.lineTo(cx2+8,cy2+cardH);ctx.quadraticCurveTo(cx2,cy2+cardH,cx2,cy2+cardH-8);
      ctx.lineTo(cx2,cy2+8);ctx.quadraticCurveTo(cx2,cy2,cx2+8,cy2);ctx.fill();
      ctx.font='18px sans-serif';ctx.fillText(m.icon,cx2+cardW/2,cy2+22);
      ctx.fillStyle='#fff';ctx.font='bold 16px sans-serif';
      ctx.fillText(m.value,cx2+cardW/2,cy2+42);
      ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='10px sans-serif';
      ctx.fillText(m.label,cx2+cardW/2,cy2+56);
      ctx.fillStyle='rgba(255,255,255,0.08)';
    });
    var barY=345;
    ctx.fillStyle='rgba(255,255,255,0.1)';
    ctx.fillRect(50,barY,500,16);
    var fillW2=overallScore/100*500;
    var barGrad=ctx.createLinearGradient(50,barY,50+fillW2,barY);
    barGrad.addColorStop(0,'#4CAF50');barGrad.addColorStop(0.5,'#FFD700');barGrad.addColorStop(1,'#FF5722');
    ctx.fillStyle=barGrad;ctx.fillRect(50,barY,fillW2,16);
    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='9px sans-serif';
    ctx.fillText('0',50,barY+28);ctx.fillText('50',290,barY+28);ctx.fillText('100',540,barY+28);
    ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='9px sans-serif';
    ctx.fillText('Culture Center Finder v15.0 — Powered by PRIME Holdings',W/2,H-12);
    ctx.textAlign='start';
  }
  draw();
  var dlBtn=ce('button');dlBtn.textContent='📥 PNG 다운로드';
  dlBtn.style.cssText='display:block;margin:8px auto;padding:10px 24px;border-radius:12px;border:1px solid '+(dk?'#444':'#ddd')+';background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:13px;cursor:pointer;font-weight:bold;';
  dlBtn.onclick=function(){
    var link=ce('a');link.download='learning-report-'+fmtDate15()+'.png';
    link.href=canvas.toDataURL('image/png');link.click();
    SFX15.play('report_gen');showToast15('📥 리포트 카드 PNG 저장 완료',2000);
    trackFeature15('report_dl');
  };
  r.box.appendChild(canvas);r.box.appendChild(dlBtn);
  document.body.appendChild(r.modal);
}

/* ===== 퀴즈 v15 엔진 ===== */
function openQuizV15(){
  SFX15.play('quiz_v15');trackFeature15('quiz');
  var dk=isDark();var r=makeModal15('🧠 퀴즈 v15','v15 신규 15문항 — 학습이론, 플랫폼 비교, Canvas API');
  var idx=0,score=0,total=QUIZ_V15.length;
  var scoreDiv=ce('div');scoreDiv.style.cssText='text-align:center;margin-bottom:12px;font-size:14px;color:'+(dk?'#8BA4C4':'#666')+';';
  scoreDiv.textContent='문제 1/'+total+' | 점수: 0';
  var qDiv=ce('div');
  function showQ(){
    if(idx>=total){
      var pct=Math.round(score/total*100);
      var best=lsGet('cc-v15-quiz-best',0);
      if(pct>best)lsSet('cc-v15-quiz-best',pct);
      var g=pct>=90?'S':pct>=75?'A':pct>=60?'B':pct>=40?'C':'D';
      qDiv.innerHTML='<div style="text-align:center;padding:30px;"><div style="font-size:48px;margin-bottom:12px;">'+(pct>=90?'🏆':pct>=75?'🎉':pct>=60?'👍':'💪')+'</div>'+
        '<div style="font-size:20px;font-weight:bold;color:'+(dk?'#fff':'#1a1a2e')+';">퀴즈 완료!</div>'+
        '<div style="font-size:16px;margin-top:8px;color:'+(dk?'#7EC8E3':'#2196F3')+';">'+score+'/'+total+' 정답 ('+pct+'%) — '+g+'등급</div>'+
        '<div style="font-size:12px;margin-top:8px;color:'+(dk?'#8BA4C4':'#666')+';">역대 최고: '+Math.max(pct,best)+'%</div></div>';
      scoreDiv.textContent='완료 | 최종: '+score+'/'+total;
      SFX15.play(pct>=75?'quiz_correct15':'quiz_v15');
      checkAchieve15();
      return;
    }
    var q=QUIZ_V15[idx];
    qDiv.innerHTML='';
    var qText=ce('div');qText.innerHTML='<strong>Q'+(idx+1)+'.</strong> '+q.q;
    qText.style.cssText='font-size:14px;margin-bottom:12px;color:'+(dk?'#e0e0e0':'#333')+';line-height:1.6;';
    qDiv.appendChild(qText);
    q.opts.forEach(function(opt,oi){
      var btn=ce('button');btn.innerHTML=opt;
      btn.style.cssText='display:block;width:100%;text-align:left;padding:10px 16px;margin:6px 0;border-radius:10px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'#252540':'#fff')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:13px;cursor:pointer;transition:all 0.2s;';
      btn.onmouseenter=function(){this.style.borderColor='#7EC8E3';this.style.background=dk?'#2a2a50':'#e8f4f8';};
      btn.onmouseleave=function(){this.style.borderColor=dk?'#444':'#ddd';this.style.background=dk?'#252540':'#fff';};
      btn.onclick=function(){
        if(oi===q.a){score++;SFX15.play('quiz_correct15');this.style.background='#4CAF50';this.style.color='#fff';}
        else{SFX15.play('quiz_v15');this.style.background='#F44336';this.style.color='#fff';
          var btns=qDiv.querySelectorAll('button');if(btns[q.a])btns[q.a].style.background='#4CAF50';if(btns[q.a])btns[q.a].style.color='#fff';}
        var allBtns=qDiv.querySelectorAll('button');allBtns.forEach(function(b){b.disabled=true;b.style.cursor='default';});
        scoreDiv.textContent='문제 '+(idx+1)+'/'+total+' | 점수: '+score;
        setTimeout(function(){idx++;showQ();},1200);
      };
      qDiv.appendChild(btn);
    });
  }
  showQ();
  r.box.appendChild(scoreDiv);r.box.appendChild(qDiv);
  document.body.appendChild(r.modal);
}

/* ===== 퀵 액션 레일 (우측) ===== */
function insertQuickActions15(){
  var old=qs('#v15-quick-actions');if(old)old.remove();
  var dk=isDark();
  var rail=ce('div');rail.id='v15-quick-actions';
  rail.style.cssText='position:fixed;right:6px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:5px;z-index:10005;max-height:80vh;overflow-y:auto;padding:4px;';
  var actions=[
    {label:'&#128202; 완주율',fn:openCompletionAnalyzer},
    {label:'&#128161; 스타일',fn:openLearningStyleDiag},
    {label:'&#9200; 시간대',fn:openTimeSlotOptimizer},
    {label:'&#129309; 커뮤니티',fn:openCommunityMatch},
    {label:'&#128176; ROI',fn:openCourseROI},
    {label:'&#127919; 마일스톤',fn:openMilestoneTracker},
    {label:'&#128506; 밀도맵',fn:openRegionDensityMap},
    {label:'&#128196; 리포트',fn:openGrowthReportCard},
    {label:'🧠 퀴즈v15',fn:openQuizV15}
  ];
  actions.forEach(function(a){
    var b=ce('button');b.className='v15-qbtn';b.innerHTML=a.label;
    b.style.cssText='padding:6px 10px;border-radius:10px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'rgba(30,30,46,0.92)':'rgba(255,255,255,0.95)')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:11px;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:all 0.2s;text-align:left;';
    b.onmouseenter=function(){this.style.transform='translateX(-4px)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.25)';};
    b.onmouseleave=function(){this.style.transform='none';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15)';};
    b.onclick=function(){var old2=qs('#v15-modal');if(old2)old2.remove();a.fn();};
    rail.appendChild(b);
  });
  document.body.appendChild(rail);
  setInterval(function(){
    var hasModal=qs('.onboarding-overlay')||qs('[class*="modal-overlay"]');
    rail.style.opacity=hasModal?'0':'1';rail.style.pointerEvents=hasModal?'none':'auto';
  },1000);
}

/* ===== 키보드 단축키 v15 ===== */
function initKeyboard15(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    var tag=e.target.tagName;if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
    var old=qs('#v15-modal');if(old)old.remove();
    var map={
      'Q':openCompletionAnalyzer,
      'Y':openLearningStyleDiag,
      'T':openTimeSlotOptimizer,
      'C':openCommunityMatch,
      'O':openCourseROI,
      'M':openMilestoneTracker,
      'D':openRegionDensityMap,
      'K':openGrowthReportCard
    };
    var fn=map[e.key.toUpperCase()];if(fn){e.preventDefault();fn();}
  });
}

/* ===== CSS 스타일 주입 v15 ===== */
function injectV15Styles(){
  if(qs('#v15-styles'))return;
  var style=ce('style');style.id='v15-styles';
  style.textContent=''+
'@keyframes v15FadeIn{from{opacity:0}to{opacity:1}}'+
'@keyframes v15SlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}'+
'@keyframes v15SlideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}'+
'@keyframes v15Pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}'+
'#v15-modal::-webkit-scrollbar{width:6px}'+
'#v15-modal::-webkit-scrollbar-thumb{background:#888;border-radius:3px}'+
'#v15-modal *::-webkit-scrollbar{width:4px}'+
'#v15-modal *::-webkit-scrollbar-thumb{background:#aaa;border-radius:2px}'+
'@media(max-width:480px){'+
'  #v15-quick-actions{top:auto!important;bottom:70px!important;right:0!important;left:0!important;flex-direction:row!important;overflow-x:auto!important;padding:6px 8px!important;gap:4px!important;background:rgba(0,0,0,0.05);backdrop-filter:blur(10px);}'+
'  #v15-quick-actions .v15-qbtn{font-size:10px!important;padding:5px 8px!important;}'+
'  #v15-modal>div{max-width:100vw!important;width:100vw!important;max-height:100vh!important;border-radius:0!important;}'+
'}'+
'body:has(.onboarding-overlay) #v15-quick-actions,'+
'body:has([class*="modal-overlay"]) #v15-quick-actions{opacity:0;pointer-events:none;}';
  document.head.appendChild(style);
}

/* ===== init v15 ===== */
function init15(){
  injectV15Styles();
  setTimeout(function(){
    insertQuickActions15();
    initKeyboard15();
    var milestones=lsGet('cc-milestones-v9',[]);
    if(milestones.indexOf('v15')===-1){milestones.push('v15');lsSet('cc-milestones-v9',milestones);}
    showToast15('🎉 문화센터 파인더 v15.0 업데이트! 8개 신규 Canvas + 퀴즈 15문 + 업적 12개',3500);
  },8000);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init15);
}else{
  init15();
}
})();
