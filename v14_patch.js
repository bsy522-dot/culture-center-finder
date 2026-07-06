/* culture-center-finder v14.0 patch – 2026-07-06 */
(function(){
'use strict';
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
const V14_ID='ccf-v14-patch';
if(document.getElementById(V14_ID))return;
const marker=document.createElement('meta');marker.id=V14_ID;document.head.appendChild(marker);
function qs(s,p){return(p||document).querySelector(s);}
function ce(t){return document.createElement(t);}
function lsGet(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function isDark(){return document.documentElement.classList.contains('dark')||document.body.classList.contains('dark-mode')||window.matchMedia('(prefers-color-scheme:dark)').matches||document.documentElement.getAttribute('data-theme')==='dark';}
function showToast14(msg,dur){
  const t=ce('div');t.className='v14-toast';
  t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:'+
    (isDark()?'rgba(255,255,255,0.95)':'rgba(30,30,30,0.95)')+';color:'+(isDark()?'#111':'#fff')+
    ';padding:12px 24px;border-radius:28px;font-size:14px;z-index:99999;box-shadow:0 4px 20px rgba(0,0,0,0.3);'+
    'animation:v14FadeIn 0.3s ease;pointer-events:none;text-align:center;max-width:90vw;';
  t.textContent=msg;document.body.appendChild(t);
  setTimeout(function(){t.style.opacity='0';t.style.transition='opacity 0.3s';setTimeout(function(){t.remove();},300);},dur||2500);
}
function fmtDate14(d){var dt=d?new Date(d):new Date();var mm=String(dt.getMonth()+1).padStart(2,'0');var dd=String(dt.getDate()).padStart(2,'0');return dt.getFullYear()+'-'+mm+'-'+dd;}

/* ===== SFX v14 엔진 ===== */
var SFX14={
  _ctx:null,_getCtx:function(){if(!this._ctx)try{this._ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}return this._ctx;},
  _presets:{
    alert_open:{freq:622,type:'sine',dur:0.2,vol:0.12},
    review_post:{freq:698,type:'triangle',dur:0.22,vol:0.13},
    dag_explore:{freq:554,type:'sine',dur:0.18,vol:0.11},
    instructor_card:{freq:740,type:'triangle',dur:0.2,vol:0.12},
    cal_export:{freq:880,type:'sine',dur:0.3,vol:0.14},
    spark_view:{freq:523,type:'sine',dur:0.15,vol:0.11},
    matrix_compare:{freq:659,type:'triangle',dur:0.22,vol:0.13},
    recommend_pick:{freq:784,type:'sine',dur:0.25,vol:0.13},
    quiz_v14:{freq:587,type:'sine',dur:0.18,vol:0.11},
    quiz_correct14:{freq:988,type:'sine',dur:0.3,vol:0.14},
    achieve_v14:{freq:1047,type:'sine',dur:0.4,vol:0.16},
    feature_open14:{freq:830,type:'triangle',dur:0.2,vol:0.12}
  },
  play:function(name){
    var c=this._getCtx();if(!c)return;var p=this._presets[name];if(!p)return;
    try{var o=c.createOscillator();var g=c.createGain();o.type=p.type;o.frequency.value=p.freq;
    g.gain.setValueAtTime(p.vol,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+p.dur);
    o.connect(g);g.connect(c.destination);o.start(c.currentTime);o.stop(c.currentTime+p.dur);}catch(e){}
  }
};

/* ===== 업적 v14 ===== */
var V14_ACHIEVEMENTS=[
  {id:'alert_watcher',name:'강좌 알리미',desc:'실시간 강좌 알림 대시보드를 처음 사용',icon:'&#128276;'},
  {id:'alert_expert',name:'알림 전문가',desc:'인기도 대시보드를 5회 열람',icon:'&#128200;'},
  {id:'review_writer',name:'후기 작성자',desc:'수강 후기를 처음 작성',icon:'&#9997;'},
  {id:'review_popular',name:'인기 리뷰어',desc:'후기에 좋아요 10개 달성',icon:'&#127775;'},
  {id:'dag_navigator',name:'경로 탐색가',desc:'학습 경로 DAG를 처음 탐색',icon:'&#128268;'},
  {id:'instructor_fan',name:'강사 팬',desc:'강사 포트폴리오 3명 열람',icon:'&#127891;'},
  {id:'cal_syncer',name:'캘린더 동기화',desc:'주간 시간표를 .ics로 내보내기',icon:'&#128197;'},
  {id:'price_tracker',name:'가격 추적자',desc:'수강료 변동 추이 처음 조회',icon:'&#128178;'},
  {id:'matrix_analyst',name:'비교 분석가',desc:'강좌 비교 매트릭스 처음 완료',icon:'&#128202;'},
  {id:'recommend_user',name:'추천 사용자',desc:'개인화 추천 처음 이용',icon:'&#129302;'},
  {id:'quiz_v14_ace',name:'퀴즈 v14 에이스',desc:'v14 퀴즈에서 S등급 획득',icon:'&#127942;'},
  {id:'v14_explorer',name:'v14 탐험가',desc:'v14 신규 기능 5개 이상 사용',icon:'&#127757;'}
];

/* ===== 퀴즈 v14 ===== */
var QUIZ_V14=[
  {q:'클래스101에서 가장 인기 있는 카테고리는?',opts:['프로그래밍','드로잉/일러스트','요리','음악'],a:1},
  {q:'탈잉의 핵심 차별점인 &quot;소그룹 튜터링&quot;의 일반적 그룹 크기는?',opts:['1~2명','3~6명','10~15명','20명 이상'],a:1},
  {q:'Udemy에서 강좌 가격이 가장 저렴해지는 시기는?',opts:['매주 월요일','분기별 세일','거의 항상 세일 진행','연 1회 블랙프라이데이만'],a:2},
  {q:'문화센터 강좌에서 &quot;기타&quot; 카테고리가 많은 주된 이유는?',opts:['분류 기준 부재','강사 부족','데이터 오류','수요 부족'],a:0},
  {q:'수강 후기에서 가장 신뢰도가 높은 형태는?',opts:['별점만','텍스트만','별점+텍스트+사진','익명 점수'],a:2},
  {q:'학습 경로(Learning Path)의 주요 장점은?',opts:['수강료 할인','체계적 순서 제시','강사 변경 가능','무료 수강'],a:1},
  {q:'iCalendar(.ics) 파일의 표준 포맷은?',opts:['JSON','XML','RFC 5545 텍스트','CSV'],a:2},
  {q:'수강료 변동에 가장 큰 영향을 미치는 요인은?',opts:['날씨','학기 시작/종료 시즌','강사 인지도','건물 위치'],a:1},
  {q:'강좌 비교 시 가장 중요한 정량적 지표는?',opts:['건물 외관','시간당 비용 대비 만족도','SNS 팔로워','주차 편의성'],a:1},
  {q:'개인화 추천 시스템에서 &quot;협업 필터링&quot;이란?',opts:['강사가 직접 추천','비슷한 사용자의 선호도 기반 추천','가격순 정렬','최신순 정렬'],a:1},
  {q:'Coursera의 &quot;Guided Project&quot;의 평균 소요시간은?',opts:['1시간','2~3시간','1일','1주일'],a:1},
  {q:'문화센터 강좌의 월 평균 수강료 범위(2026 기준)는?',opts:['1~3만원','4~10만원','11~20만원','21만원 이상'],a:1},
  {q:'DAG(Directed Acyclic Graph)에서 &quot;Acyclic&quot;의 의미는?',opts:['방향 없음','순환 없음','연결 없음','가중치 없음'],a:1},
  {q:'PWA에서 오프라인 기능을 구현하는 핵심 기술은?',opts:['React','Service Worker','CSS Grid','WebSocket'],a:1},
  {q:'v14에서 추가된 Canvas 기반 시각화 기능 수는?',opts:['4개','6개','8개','10개'],a:2}
];

/* ===== 기능 추적 + 업적 ===== */
var v14Features=lsGet('cc-v14-features',{});
function trackFeature14(name){
  if(!v14Features[name]){v14Features[name]=1;}else{v14Features[name]++;}
  lsSet('cc-v14-features',v14Features);
  checkAchieve14();
}
function checkAchieve14(){
  var unlocked=lsGet('cc-v14-unlocked',[]);
  var checks=[
    {id:'alert_watcher',cond:function(){return v14Features.alert>=1;}},
    {id:'alert_expert',cond:function(){return v14Features.alert>=5;}},
    {id:'review_writer',cond:function(){return v14Features.review_write>=1;}},
    {id:'review_popular',cond:function(){return lsGet('cc-v14-review-likes',0)>=10;}},
    {id:'dag_navigator',cond:function(){return v14Features.dag>=1;}},
    {id:'instructor_fan',cond:function(){return (v14Features.instructor||0)>=3;}},
    {id:'cal_syncer',cond:function(){return v14Features.cal_export>=1;}},
    {id:'price_tracker',cond:function(){return v14Features.spark>=1;}},
    {id:'matrix_analyst',cond:function(){return v14Features.matrix>=1;}},
    {id:'recommend_user',cond:function(){return v14Features.recommend>=1;}},
    {id:'quiz_v14_ace',cond:function(){return lsGet('cc-v14-quiz-best',0)>=90;}},
    {id:'v14_explorer',cond:function(){var cnt=0;['alert','review_write','dag','instructor','cal_export','spark','matrix','recommend'].forEach(function(k){if(v14Features[k])cnt++;});return cnt>=5;}}
  ];
  checks.forEach(function(c){
    if(unlocked.indexOf(c.id)===-1&&c.cond()){
      unlocked.push(c.id);lsSet('cc-v14-unlocked',unlocked);
      var a=V14_ACHIEVEMENTS.find(function(x){return x.id===c.id;});
      if(a){SFX14.play('achieve_v14');showToast14('🏆 업적 해금: '+a.name+' — '+a.desc,3000);}
    }
  });
}

/* ===== 모달 팩토리 ===== */
function makeModal14(title,subtitle){
  var old=qs('#v14-modal');if(old)old.remove();
  var dk=isDark();
  var modal=ce('div');modal.id='v14-modal';
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:99998;animation:v14FadeIn 0.3s ease;';
  var inner=ce('div');
  inner.style.cssText='background:'+(dk?'#1a1a2e':'#ffffff')+';border-radius:20px;max-width:680px;width:95%;max-height:88vh;overflow-y:auto;padding:24px;box-shadow:0 20px 60px rgba(0,0,0,0.5);animation:v14SlideUp 0.35s ease;position:relative;';
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

/* ===== 1. 실시간 강좌 인기도 대시보드 ===== */
function openLiveCourseAlert(){
  SFX14.play('alert_open');trackFeature14('alert');
  var dk=isDark();var r=makeModal14('&#128276; 실시간 강좌 인기도 대시보드','카테고리별 수강 수요 분석 + 인기 급상승 알림');
  var canvas=ce('canvas');canvas.width=600;canvas.height=380;
  canvas.style.cssText='width:100%;max-width:600px;display:block;margin:0 auto 12px;border-radius:12px;';
  var categories=['요가/필라테스','수영','피아노','미술','댄스','외국어','요리','플로리스트','서예','코딩'];
  var data=categories.map(function(){return{current:Math.floor(Math.random()*800+200),prev:Math.floor(Math.random()*700+200)};});
  function draw(){
    var ctx=canvas.getContext('2d');var W=600,H=380;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 16px sans-serif';
    ctx.fillText('카테고리별 수강 수요 (현재 vs 이전분기)',30,30);
    ctx.font='11px sans-serif';ctx.fillStyle=dk?'#8BA4C4':'#666';
    ctx.fillText('■ 현재분기  ■ 이전분기  ▲ 급상승',30,50);
    var maxVal=Math.max.apply(null,data.map(function(d){return Math.max(d.current,d.prev);}));
    var barW=22,gap=38,startX=50,startY=340,chartH=260;
    categories.forEach(function(cat,i){
      var x=startX+i*gap*1.45;
      var h1=data[i].current/maxVal*chartH;
      var h2=data[i].prev/maxVal*chartH;
      var grad1=ctx.createLinearGradient(x,startY-h1,x,startY);
      grad1.addColorStop(0,'#7EC8E3');grad1.addColorStop(1,'#3AAFA9');
      ctx.fillStyle=grad1;ctx.fillRect(x,startY-h1,barW,h1);
      ctx.fillStyle=dk?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.1)';
      ctx.fillRect(x+barW+2,startY-h2,barW*0.6,h2);
      var change=Math.round((data[i].current-data[i].prev)/data[i].prev*100);
      ctx.fillStyle=change>0?'#4CAF50':'#F44336';ctx.font='bold 10px sans-serif';
      ctx.fillText((change>0?'▲':'▼')+Math.abs(change)+'%',x-2,startY-h1-8);
      ctx.save();ctx.translate(x+barW/2,startY+12);ctx.rotate(-Math.PI/6);
      ctx.fillStyle=dk?'#8BA4C4':'#555';ctx.font='10px sans-serif';
      ctx.fillText(cat,0,0);ctx.restore();
    });
    for(var g=0;g<=4;g++){
      var y=startY-g*(chartH/4);
      ctx.strokeStyle=dk?'rgba(255,255,255,0.08)':'rgba(0,0,0,0.06)';
      ctx.beginPath();ctx.moveTo(startX-10,y);ctx.lineTo(startX+categories.length*gap*1.45,y);ctx.stroke();
      ctx.fillStyle=dk?'#8BA4C4':'#888';ctx.font='10px sans-serif';
      ctx.fillText(String(Math.round(maxVal*g/4)),8,y+4);
    }
    var hotIdx=0;var hotChange=-Infinity;
    data.forEach(function(d,i){var ch=(d.current-d.prev)/d.prev*100;if(ch>hotChange){hotChange=ch;hotIdx=i;}});
    ctx.fillStyle=dk?'rgba(255,215,0,0.15)':'rgba(255,215,0,0.1)';
    ctx.fillRect(startX+hotIdx*gap*1.45-4,60,barW+12,startY-56);
    ctx.fillStyle='#FFD700';ctx.font='bold 11px sans-serif';
    ctx.fillText('🔥 HOT',startX+hotIdx*gap*1.45-2,74);
  }
  draw();
  var refreshBtn=ce('button');refreshBtn.textContent='🔄 데이터 새로고침';
  refreshBtn.style.cssText='display:block;margin:8px auto;padding:10px 24px;border-radius:12px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'#252540':'#f0f4f8')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:13px;cursor:pointer;';
  refreshBtn.onclick=function(){
    data=categories.map(function(){return{current:Math.floor(Math.random()*800+200),prev:Math.floor(Math.random()*700+200)};});
    draw();SFX14.play('alert_open');showToast14('📊 데이터 갱신 완료',1500);
  };
  r.box.appendChild(canvas);r.box.appendChild(refreshBtn);
  document.body.appendChild(r.modal);
}

/* ===== 2. 수강 후기 소셜 피드 ===== */
function openPeerReviewFeed(){
  SFX14.play('review_post');trackFeature14('review_feed');
  var dk=isDark();var r=makeModal14('&#9997; 수강 후기 소셜 피드','별점 리뷰 + 좋아요 + 답글 커뮤니티');
  var reviews=lsGet('cc-v14-reviews',[
    {id:1,course:'요가 기초반',center:'홈플러스 강서점',stars:5,text:'몸이 정말 가벼워졌어요! 선생님이 친절하시고 동작 하나하나 꼼꼼히 봐주세요.',likes:7,replies:['저도 같은 수업 듣고 있어요!'],date:'2026-07-01'},
    {id:2,course:'피아노 입문',center:'롯데마트 잠실점',stars:4,text:'피아노를 처음 배우는데 3개월만에 간단한 곡을 칠 수 있게 되었어요.',likes:12,replies:['어떤 곡 배우셨나요?','저도 등록하고 싶어요'],date:'2026-06-28'},
    {id:3,course:'수채화 클래스',center:'현대백화점 판교점',stars:5,text:'매주 작품 하나씩 완성하는 재미가 있어요. 재료비 별도지만 퀄리티 최고!',likes:9,replies:[],date:'2026-06-25'},
    {id:4,course:'줌바 피트니스',center:'이마트 성수점',stars:3,text:'음악은 좋은데 사람이 너무 많아서 공간이 좁아요. 시간대 변경 추천.',likes:4,replies:['오전반은 여유있어요'],date:'2026-06-20'},
    {id:5,course:'영어 회화',center:'신세계 센텀시티점',stars:4,text:'원어민 선생님이라 발음 교정에 좋아요. 소그룹이라 말할 기회가 많습니다.',likes:15,replies:['몇 명 정도 되나요?','저는 중급반인데 만족해요'],date:'2026-06-15'}
  ]);
  var feedDiv=ce('div');feedDiv.style.cssText='max-height:400px;overflow-y:auto;';
  function renderFeed(){
    feedDiv.innerHTML='';
    reviews.sort(function(a,b){return b.likes-a.likes;}).forEach(function(rev,ri){
      var card=ce('div');
      card.style.cssText='padding:14px;margin-bottom:10px;border-radius:12px;border:1px solid '+(dk?'#333':'#e0e0e0')+';background:'+(dk?'#1e1e3a':'#fafafa')+';';
      var starsHtml='';for(var s=0;s<5;s++)starsHtml+='<span style="color:'+(s<rev.stars?'#FFD700':'#555')+';">&#9733;</span>';
      card.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">'+
        '<div style="font-weight:600;color:'+(dk?'#7EC8E3':'#0EA5E9')+';font-size:14px;">'+esc(rev.course)+'</div>'+
        '<div style="font-size:12px;color:'+(dk?'#666':'#999')+';">'+esc(rev.date)+'</div></div>'+
        '<div style="font-size:11px;color:'+(dk?'#8BA4C4':'#888')+';margin-bottom:6px;">'+esc(rev.center)+' '+starsHtml+'</div>'+
        '<div style="font-size:13px;color:'+(dk?'#d4d4d4':'#333')+';line-height:1.5;margin-bottom:10px;">'+esc(rev.text)+'</div>';
      var actBar=ce('div');actBar.style.cssText='display:flex;gap:12px;align-items:center;';
      var likeBtn=ce('button');likeBtn.innerHTML='&#128077; '+rev.likes;
      likeBtn.style.cssText='padding:5px 12px;border-radius:16px;border:1px solid '+(dk?'#444':'#ddd')+';background:transparent;color:'+(dk?'#e0e0e0':'#333')+';font-size:12px;cursor:pointer;';
      likeBtn.onclick=function(){rev.likes++;lsSet('cc-v14-reviews',reviews);
        var totalLikes=0;reviews.forEach(function(r2){totalLikes+=r2.likes;});lsSet('cc-v14-review-likes',totalLikes);
        renderFeed();SFX14.play('review_post');checkAchieve14();};
      var replyBtn=ce('button');replyBtn.innerHTML='&#128172; '+rev.replies.length+'개 답글';
      replyBtn.style.cssText=likeBtn.style.cssText;
      replyBtn.onclick=function(){
        var txt=prompt('답글을 입력하세요:');if(txt&&txt.trim()){rev.replies.push(txt.trim());lsSet('cc-v14-reviews',reviews);renderFeed();}
      };
      actBar.appendChild(likeBtn);actBar.appendChild(replyBtn);card.appendChild(actBar);
      if(rev.replies.length>0){
        var repDiv=ce('div');repDiv.style.cssText='margin-top:8px;padding-left:12px;border-left:2px solid '+(dk?'#444':'#ddd')+';';
        rev.replies.forEach(function(rep){
          var rd=ce('div');rd.style.cssText='font-size:12px;color:'+(dk?'#8BA4C4':'#666')+';padding:4px 0;';
          rd.textContent='↳ '+rep;repDiv.appendChild(rd);
        });
        card.appendChild(repDiv);
      }
      feedDiv.appendChild(card);
    });
  }
  var writeBtn=ce('button');writeBtn.textContent='✏️ 후기 작성';
  writeBtn.style.cssText='display:block;width:100%;padding:12px;border-radius:12px;border:1px solid '+(dk?'#7EC8E3':'#0EA5E9')+';background:'+(dk?'rgba(126,200,227,0.15)':'rgba(14,165,233,0.1)')+';color:'+(dk?'#7EC8E3':'#0EA5E9')+';font-size:14px;font-weight:600;cursor:pointer;margin-bottom:12px;';
  writeBtn.onclick=function(){
    var course=prompt('강좌명:');if(!course)return;
    var center=prompt('센터명:');if(!center)return;
    var stars=parseInt(prompt('별점 (1~5):'),10);if(isNaN(stars)||stars<1||stars>5)stars=3;
    var text=prompt('후기 내용:');if(!text)return;
    reviews.unshift({id:Date.now(),course:course,center:center,stars:stars,text:text,likes:0,replies:[],date:fmtDate14()});
    lsSet('cc-v14-reviews',reviews);trackFeature14('review_write');renderFeed();
    SFX14.play('review_post');showToast14('✅ 후기가 등록되었습니다!',2000);
  };
  r.box.appendChild(writeBtn);renderFeed();r.box.appendChild(feedDiv);
  document.body.appendChild(r.modal);
}

/* ===== 3. 학습 경로 DAG 시각화 ===== */
function openLearningPathDAG(){
  SFX14.play('dag_explore');trackFeature14('dag');
  var dk=isDark();var r=makeModal14('&#128268; 학습 경로 DAG 시각화','선수 과목 관계를 그래프로 탐색');
  var canvas=ce('canvas');canvas.width=640;canvas.height=420;
  canvas.style.cssText='width:100%;max-width:640px;display:block;margin:0 auto 12px;border-radius:12px;cursor:pointer;';
  var nodes=[
    {id:0,name:'기초 체력',x:80,y:60,level:0,color:'#4CAF50'},
    {id:1,name:'요가 입문',x:240,y:40,level:1,color:'#7EC8E3'},
    {id:2,name:'수영 입문',x:240,y:120,level:1,color:'#3AAFA9'},
    {id:3,name:'댄스 기초',x:240,y:200,level:1,color:'#FF9800'},
    {id:4,name:'필라테스',x:400,y:40,level:2,color:'#7EC8E3'},
    {id:5,name:'요가 중급',x:400,y:100,level:2,color:'#7EC8E3'},
    {id:6,name:'수영 중급',x:400,y:160,level:2,color:'#3AAFA9'},
    {id:7,name:'줌바',x:400,y:220,level:2,color:'#FF9800'},
    {id:8,name:'발레',x:400,y:280,level:2,color:'#E91E63'},
    {id:9,name:'요가 고급',x:560,y:70,level:3,color:'#9C27B0'},
    {id:10,name:'수상스포츠',x:560,y:160,level:3,color:'#3AAFA9'},
    {id:11,name:'K-POP 댄스',x:560,y:250,level:3,color:'#FF5722'},
    {id:12,name:'명상/웰니스',x:560,y:340,level:3,color:'#9C27B0'},
    {id:13,name:'피아노 입문',x:80,y:300,level:0,color:'#2196F3'},
    {id:14,name:'피아노 중급',x:240,y:300,level:1,color:'#2196F3'},
    {id:15,name:'피아노 고급',x:400,y:340,level:2,color:'#2196F3'},
    {id:16,name:'미술 기초',x:80,y:380,level:0,color:'#FF5722'},
    {id:17,name:'수채화',x:240,y:380,level:1,color:'#FF5722'}
  ];
  var edges=[
    [0,1],[0,2],[0,3],[1,4],[1,5],[2,6],[3,7],[3,8],
    [5,9],[4,9],[6,10],[7,11],[8,11],[5,12],[9,12],
    [13,14],[14,15],[16,17]
  ];
  var selected=-1;
  function draw(){
    var ctx=canvas.getContext('2d');ctx.clearRect(0,0,640,420);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,640,420);
    edges.forEach(function(e){
      var from=nodes[e[0]],to=nodes[e[1]];
      ctx.strokeStyle=dk?'rgba(126,200,227,0.3)':'rgba(14,165,233,0.25)';
      ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.stroke();
      var mx=(from.x+to.x*2)/3,my=(from.y+to.y*2)/3;
      var angle=Math.atan2(to.y-from.y,to.x-from.x);
      ctx.fillStyle=dk?'rgba(126,200,227,0.5)':'rgba(14,165,233,0.4)';
      ctx.beginPath();ctx.moveTo(mx+8*Math.cos(angle),my+8*Math.sin(angle));
      ctx.lineTo(mx+6*Math.cos(angle+2.5),my+6*Math.sin(angle+2.5));
      ctx.lineTo(mx+6*Math.cos(angle-2.5),my+6*Math.sin(angle-2.5));
      ctx.fill();
    });
    nodes.forEach(function(n,i){
      var isSel=i===selected;
      ctx.beginPath();ctx.arc(n.x,n.y,isSel?22:18,0,Math.PI*2);
      ctx.fillStyle=n.color+(isSel?'':'99');ctx.fill();
      if(isSel){ctx.strokeStyle='#FFD700';ctx.lineWidth=3;ctx.stroke();}
      ctx.fillStyle='#fff';ctx.font=(isSel?'bold ':'')+' 9px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(n.name,n.x,n.y);
    });
    ctx.textAlign='start';
    if(selected>=0){
      var sn=nodes[selected];
      ctx.fillStyle=dk?'rgba(126,200,227,0.1)':'rgba(14,165,233,0.08)';
      ctx.fillRect(10,390,620,25);
      ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='12px sans-serif';
      var prereqs=edges.filter(function(e){return e[1]===selected;}).map(function(e){return nodes[e[0]].name;});
      var nexts=edges.filter(function(e){return e[0]===selected;}).map(function(e){return nodes[e[1]].name;});
      ctx.fillText('📌 '+sn.name+' | 선수: '+(prereqs.length?prereqs.join(', '):'없음')+' | 다음: '+(nexts.length?nexts.join(', '):'최종 단계'),15,406);
    }
  }
  canvas.onclick=function(ev){
    var rect=canvas.getBoundingClientRect();
    var sx=640/rect.width,sy=420/rect.height;
    var mx=(ev.clientX-rect.left)*sx,my=(ev.clientY-rect.top)*sy;
    selected=-1;
    nodes.forEach(function(n,i){var dx=mx-n.x,dy=my-n.y;if(Math.sqrt(dx*dx+dy*dy)<22)selected=i;});
    draw();if(selected>=0)SFX14.play('dag_explore');
  };
  draw();
  r.box.appendChild(canvas);
  var legend=ce('div');legend.style.cssText='display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:6px;';
  [{c:'#4CAF50',l:'체력'},{c:'#7EC8E3',l:'요가'},{c:'#3AAFA9',l:'수영'},{c:'#FF9800',l:'댄스'},{c:'#2196F3',l:'피아노'},{c:'#FF5722',l:'미술'},{c:'#9C27B0',l:'고급'}].forEach(function(item){
    var sp=ce('span');sp.innerHTML='<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:'+item.c+';margin-right:4px;"></span><span style="font-size:11px;color:'+(dk?'#8BA4C4':'#666')+';">'+item.l+'</span>';
    legend.appendChild(sp);
  });
  r.box.appendChild(legend);
  document.body.appendChild(r.modal);
}

/* ===== 4. 강사 포트폴리오 쇼케이스 ===== */
function openInstructorShowcase(){
  SFX14.play('instructor_card');trackFeature14('instructor');
  var dk=isDark();var r=makeModal14('&#127891; 강사 포트폴리오 쇼케이스','강사 경력 타임라인 + 전문성 도넛 차트');
  var canvas=ce('canvas');canvas.width=560;canvas.height=380;
  canvas.style.cssText='width:100%;max-width:560px;display:block;margin:0 auto 12px;border-radius:12px;';
  var instructors=[
    {name:'김예진',specialty:['요가','필라테스','명상'],years:8,rating:4.8,students:1200,courses:12,color:'#7EC8E3'},
    {name:'박성호',specialty:['수영','수상스포츠'],years:12,rating:4.9,students:2500,courses:8,color:'#3AAFA9'},
    {name:'이수연',specialty:['피아노','음악이론'],years:15,rating:4.7,students:800,courses:15,color:'#2196F3'},
    {name:'최단비',specialty:['K-POP댄스','줌바','발레'],years:6,rating:4.6,students:3000,courses:10,color:'#FF9800'},
    {name:'정하늘',specialty:['수채화','유화','드로잉'],years:10,rating:4.8,students:600,courses:18,color:'#FF5722'},
    {name:'한서준',specialty:['영어회화','토익'],years:9,rating:4.5,students:1500,courses:6,color:'#9C27B0'}
  ];
  var curIdx=lsGet('cc-v14-instructor-idx',0);
  function drawInstructor(idx){
    var ctx=canvas.getContext('2d');var W=560,H=380;var ins=instructors[idx];
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    ctx.beginPath();ctx.arc(70,70,40,0,Math.PI*2);
    ctx.fillStyle=ins.color+'33';ctx.fill();ctx.strokeStyle=ins.color;ctx.lineWidth=3;ctx.stroke();
    ctx.fillStyle=ins.color;ctx.font='bold 28px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(ins.name.charAt(0),70,70);ctx.textAlign='start';
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 18px sans-serif';
    ctx.fillText(ins.name+' 강사',130,55);
    ctx.fillStyle=dk?'#8BA4C4':'#666';ctx.font='12px sans-serif';
    ctx.fillText('경력 '+ins.years+'년 | 수강생 '+ins.students+'명 | 강좌 '+ins.courses+'개',130,78);
    var tagX=130;ins.specialty.forEach(function(s){
      ctx.fillStyle=ins.color+'33';var tw=ctx.measureText(s).width+16;
      ctx.beginPath();ctx.roundRect(tagX,88,tw,22,6);ctx.fill();
      ctx.fillStyle=ins.color;ctx.font='11px sans-serif';ctx.fillText(s,tagX+8,103);
      tagX+=tw+6;
    });
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 13px sans-serif';
    ctx.fillText('평점',40,150);
    var cx=80,cy=210,rad=40;
    var pct=ins.rating/5;
    ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.strokeStyle=dk?'#333':'#e0e0e0';ctx.lineWidth=10;ctx.stroke();
    ctx.beginPath();ctx.arc(cx,cy,rad,-Math.PI/2,-Math.PI/2+pct*Math.PI*2);ctx.strokeStyle=ins.color;ctx.lineWidth=10;ctx.stroke();
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 20px sans-serif';ctx.textAlign='center';
    ctx.fillText(ins.rating.toFixed(1),cx,cy+2);
    ctx.font='10px sans-serif';ctx.fillStyle='#FFD700';ctx.fillText('★★★★★'.slice(0,Math.round(ins.rating)),cx,cy+18);
    ctx.textAlign='start';
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 13px sans-serif';
    ctx.fillText('경력 타임라인',160,150);
    var tlX=170,tlY=175,tlW=360,tlH=8;
    ctx.fillStyle=dk?'#333':'#e0e0e0';ctx.beginPath();ctx.roundRect(tlX,tlY,tlW,tlH,4);ctx.fill();
    var filled=Math.min(ins.years/20,1)*tlW;
    var grad=ctx.createLinearGradient(tlX,0,tlX+filled,0);
    grad.addColorStop(0,ins.color);grad.addColorStop(1,ins.color+'88');
    ctx.fillStyle=grad;ctx.beginPath();ctx.roundRect(tlX,tlY,filled,tlH,4);ctx.fill();
    var milestones=[{yr:1,label:'입문'},{yr:3,label:'중급'},{yr:5,label:'전문'},{yr:10,label:'마스터'},{yr:15,label:'원로'},{yr:20,label:'대가'}];
    milestones.forEach(function(m){
      var mx=tlX+(m.yr/20)*tlW;
      ctx.fillStyle=m.yr<=ins.years?ins.color:(dk?'#555':'#ccc');
      ctx.beginPath();ctx.arc(mx,tlY+4,5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=dk?'#8BA4C4':'#666';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText(m.label,mx,tlY+20);ctx.fillText(m.yr+'년',mx,tlY+32);
    });
    ctx.textAlign='start';
    var stats=[
      {label:'수강생 만족도',val:Math.round(ins.rating/5*100),max:100,color:'#4CAF50'},
      {label:'재수강률',val:Math.min(95,50+ins.years*3),max:100,color:'#2196F3'},
      {label:'추천 지수',val:Math.min(98,60+ins.rating*6),max:100,color:'#FF9800'},
      {label:'경력 숙련도',val:Math.min(100,ins.years*6.5),max:100,color:'#9C27B0'}
    ];
    stats.forEach(function(st,si){
      var sy2=250+si*30;
      ctx.fillStyle=dk?'#8BA4C4':'#666';ctx.font='11px sans-serif';
      ctx.fillText(st.label,40,sy2+4);
      ctx.fillStyle=dk?'#252540':'#e8e8e8';ctx.beginPath();ctx.roundRect(180,sy2-6,340,14,4);ctx.fill();
      var bw=st.val/st.max*340;
      ctx.fillStyle=st.color;ctx.beginPath();ctx.roundRect(180,sy2-6,bw,14,4);ctx.fill();
      ctx.fillStyle=dk?'#fff':'#333';ctx.font='bold 10px sans-serif';
      ctx.fillText(st.val+'%',185+bw+6,sy2+4);
    });
  }
  drawInstructor(curIdx);
  var navDiv=ce('div');navDiv.style.cssText='display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:8px;';
  instructors.forEach(function(ins,i){
    var b=ce('button');b.textContent=ins.name;
    b.style.cssText='padding:6px 14px;border-radius:16px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(i===curIdx?ins.color+'33':'transparent')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:12px;cursor:pointer;';
    b.onclick=function(){curIdx=i;lsSet('cc-v14-instructor-idx',i);drawInstructor(i);SFX14.play('instructor_card');
      navDiv.querySelectorAll('button').forEach(function(btn,j){btn.style.background=j===i?instructors[j].color+'33':'transparent';});};
    navDiv.appendChild(b);
  });
  r.box.appendChild(canvas);r.box.appendChild(navDiv);
  document.body.appendChild(r.modal);
}

/* ===== 5. 주간 시간표 캘린더 + .ics 내보내기 ===== */
function openWeeklyCalSync(){
  SFX14.play('cal_export');trackFeature14('cal_view');
  var dk=isDark();var r=makeModal14('&#128197; 주간 시간표 캘린더','시간표 편집 + .ics 파일 내보내기');
  var canvas=ce('canvas');canvas.width=580;canvas.height=340;
  canvas.style.cssText='width:100%;max-width:580px;display:block;margin:0 auto 12px;border-radius:12px;';
  var days=['월','화','수','목','금','토','일'];
  var hours=['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
  var schedule=lsGet('cc-v14-schedule',[
    {day:0,hour:9,dur:1,name:'요가 기초',color:'#7EC8E3'},
    {day:1,hour:14,dur:1.5,name:'피아노 입문',color:'#2196F3'},
    {day:2,hour:10,dur:1,name:'수영 중급',color:'#3AAFA9'},
    {day:3,hour:16,dur:1,name:'영어 회화',color:'#9C27B0'},
    {day:4,hour:11,dur:1,name:'수채화',color:'#FF5722'},
    {day:5,hour:9,dur:2,name:'줌바 피트니스',color:'#FF9800'}
  ]);
  function drawCal(){
    var ctx=canvas.getContext('2d');var W=580,H=340;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    var leftM=50,topM=30,cellW=(W-leftM-10)/7,cellH=(H-topM-10)/hours.length;
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
    days.forEach(function(d,i){ctx.fillText(d,leftM+i*cellW+cellW/2,20);});
    ctx.textAlign='end';ctx.fillStyle=dk?'#8BA4C4':'#888';ctx.font='9px sans-serif';
    hours.forEach(function(h,i){ctx.fillText(h,leftM-4,topM+i*cellH+cellH/2+3);});
    ctx.textAlign='start';
    for(var r2=0;r2<=hours.length;r2++){
      ctx.strokeStyle=dk?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)';
      ctx.beginPath();ctx.moveTo(leftM,topM+r2*cellH);ctx.lineTo(W-10,topM+r2*cellH);ctx.stroke();
    }
    for(var c=0;c<=7;c++){
      ctx.beginPath();ctx.moveTo(leftM+c*cellW,topM);ctx.lineTo(leftM+c*cellW,H-10);ctx.stroke();
    }
    schedule.forEach(function(s){
      var x=leftM+s.day*cellW+2;
      var y=topM+(s.hour-9)*cellH+1;
      var h=s.dur*cellH-2;
      var w=cellW-4;
      ctx.fillStyle=s.color+'44';ctx.beginPath();ctx.roundRect(x,y,w,h,4);ctx.fill();
      ctx.strokeStyle=s.color;ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(x,y,w,h,4);ctx.stroke();
      ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 9px sans-serif';ctx.textAlign='center';
      ctx.fillText(s.name,x+w/2,y+h/2+3);ctx.textAlign='start';
    });
  }
  drawCal();
  var btnRow=ce('div');btnRow.style.cssText='display:flex;gap:8px;justify-content:center;flex-wrap:wrap;';
  var addBtn=ce('button');addBtn.textContent='➕ 강좌 추가';
  addBtn.style.cssText='padding:10px 20px;border-radius:12px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'#252540':'#f0f4f8')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:13px;cursor:pointer;';
  addBtn.onclick=function(){
    var name=prompt('강좌명:');if(!name)return;
    var day=parseInt(prompt('요일 (0=월~6=일):'),10);if(isNaN(day)||day<0||day>6)return;
    var hour=parseInt(prompt('시작 시간 (9~20):'),10);if(isNaN(hour)||hour<9||hour>20)return;
    var dur=parseFloat(prompt('수업 시간(시간 단위, 예: 1, 1.5):'))||1;
    var colors=['#7EC8E3','#3AAFA9','#FF9800','#2196F3','#FF5722','#9C27B0','#E91E63','#4CAF50'];
    schedule.push({day:day,hour:hour,dur:dur,name:name,color:colors[schedule.length%colors.length]});
    lsSet('cc-v14-schedule',schedule);drawCal();SFX14.play('feature_open14');
  };
  var exportBtn=ce('button');exportBtn.textContent='📅 .ics 내보내기';
  exportBtn.style.cssText='padding:10px 20px;border-radius:12px;border:1px solid '+(dk?'#7EC8E3':'#0EA5E9')+';background:'+(dk?'rgba(126,200,227,0.15)':'rgba(14,165,233,0.1)')+';color:'+(dk?'#7EC8E3':'#0EA5E9')+';font-size:13px;font-weight:600;cursor:pointer;';
  exportBtn.onclick=function(){
    trackFeature14('cal_export');
    var ics='BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//CCF//v14//KO\r\nCALSCALE:GREGORIAN\r\n';
    var baseDate=new Date();var dayOfWeek=baseDate.getDay();
    schedule.forEach(function(s){
      var diff=(s.day+1)-dayOfWeek;if(diff<0)diff+=7;
      var start=new Date(baseDate);start.setDate(start.getDate()+diff);
      start.setHours(s.hour,0,0,0);
      var end=new Date(start);end.setMinutes(end.getMinutes()+s.dur*60);
      function fmt(d){return d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'T'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'00';}
      ics+='BEGIN:VEVENT\r\nDTSTART:'+fmt(start)+'\r\nDTEND:'+fmt(end)+'\r\nSUMMARY:'+s.name+'\r\nRRULE:FREQ=WEEKLY\r\nEND:VEVENT\r\n';
    });
    ics+='END:VCALENDAR';
    var blob=new Blob([ics],{type:'text/calendar;charset=utf-8'});
    var a=ce('a');a.href=URL.createObjectURL(blob);a.download='munsen_schedule.ics';a.click();
    SFX14.play('cal_export');showToast14('📅 .ics 파일이 다운로드됩니다!',2000);checkAchieve14();
  };
  btnRow.appendChild(addBtn);btnRow.appendChild(exportBtn);
  r.box.appendChild(canvas);r.box.appendChild(btnRow);
  document.body.appendChild(r.modal);
}

/* ===== 6. 수강료 변동 추이 스파크라인 ===== */
function openPriceHistorySpark(){
  SFX14.play('spark_view');trackFeature14('spark');
  var dk=isDark();var r=makeModal14('&#128178; 수강료 변동 추이 스파크라인','카테고리별 분기별 수강료 트렌드');
  var canvas=ce('canvas');canvas.width=560;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:560px;display:block;margin:0 auto 12px;border-radius:12px;';
  var cats=[
    {name:'요가/필라테스',data:[85,88,90,92,95,98],color:'#7EC8E3'},
    {name:'수영',data:[120,118,125,130,128,135],color:'#3AAFA9'},
    {name:'피아노',data:[100,105,108,110,115,118],color:'#2196F3'},
    {name:'미술',data:[70,72,75,73,78,80],color:'#FF5722'},
    {name:'댄스',data:[65,68,70,72,75,78],color:'#FF9800'},
    {name:'외국어',data:[90,95,92,100,105,110],color:'#9C27B0'},
    {name:'요리',data:[80,82,85,88,90,95],color:'#E91E63'},
    {name:'코딩',data:[110,115,120,125,130,140],color:'#4CAF50'}
  ];
  var quarters=['24Q1','24Q2','24Q3','24Q4','25Q1','25Q2'];
  function drawSparks(){
    var ctx=canvas.getContext('2d');var W=560,H=400;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 16px sans-serif';
    ctx.fillText('카테고리별 월평균 수강료 추이 (천원)',20,24);
    cats.forEach(function(cat,ci){
      var rowH=42,rowY=40+ci*rowH;
      ctx.fillStyle=dk?'#8BA4C4':'#555';ctx.font='12px sans-serif';
      ctx.fillText(cat.name,12,rowY+20);
      var sparkX=130,sparkW=300,sparkH=28;
      var minV=Math.min.apply(null,cat.data),maxV=Math.max.apply(null,cat.data);
      var range=maxV-minV||1;
      ctx.strokeStyle=cat.color;ctx.lineWidth=2;ctx.beginPath();
      cat.data.forEach(function(v,vi){
        var x=sparkX+vi/(cat.data.length-1)*sparkW;
        var y=rowY+sparkH-(v-minV)/range*sparkH+4;
        if(vi===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      });
      ctx.stroke();
      cat.data.forEach(function(v,vi){
        var x=sparkX+vi/(cat.data.length-1)*sparkW;
        var y=rowY+sparkH-(v-minV)/range*sparkH+4;
        ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);
        ctx.fillStyle=vi===cat.data.length-1?cat.color:cat.color+'88';ctx.fill();
      });
      var minIdx=cat.data.indexOf(minV),maxIdx=cat.data.indexOf(maxV);
      ctx.font='bold 8px sans-serif';
      ctx.fillStyle='#4CAF50';ctx.fillText('▲'+maxV+'k',sparkX+maxIdx/(cat.data.length-1)*sparkW-8,rowY);
      ctx.fillStyle='#F44336';ctx.fillText('▼'+minV+'k',sparkX+minIdx/(cat.data.length-1)*sparkW-8,rowY+sparkH+14);
      var latest=cat.data[cat.data.length-1],prev=cat.data[cat.data.length-2];
      var chg=Math.round((latest-prev)/prev*100);
      ctx.fillStyle=chg>=0?'#4CAF50':'#F44336';ctx.font='bold 11px sans-serif';
      ctx.fillText((chg>=0?'+':'')+chg+'%',sparkX+sparkW+16,rowY+18);
      ctx.fillStyle=dk?'#666':'#aaa';ctx.font='10px sans-serif';
      ctx.fillText(latest+'천원',sparkX+sparkW+16,rowY+32);
    });
    ctx.fillStyle=dk?'#555':'#ccc';ctx.font='9px sans-serif';
    quarters.forEach(function(q,qi){
      ctx.fillText(q,130+qi/(quarters.length-1)*300-12,H-4);
    });
  }
  drawSparks();
  r.box.appendChild(canvas);
  document.body.appendChild(r.modal);
}

/* ===== 7. 강좌 비교 매트릭스 ===== */
function openCourseCompareMatrix(){
  SFX14.play('matrix_compare');trackFeature14('matrix');
  var dk=isDark();var r=makeModal14('&#128202; 강좌 비교 매트릭스','최대 4개 강좌를 6개 축으로 시각 비교');
  var canvas=ce('canvas');canvas.width=600;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:600px;display:block;margin:0 auto 12px;border-radius:12px;';
  var courses=[
    {name:'요가 기초',price:8,duration:7,rating:9,difficulty:3,location:8,schedule:7,color:'#7EC8E3'},
    {name:'수영 중급',price:6,duration:8,rating:8,difficulty:6,location:7,schedule:6,color:'#3AAFA9'},
    {name:'피아노 입문',price:5,duration:9,rating:9,difficulty:5,location:6,schedule:8,color:'#2196F3'},
    {name:'K-POP 댄스',price:7,duration:6,rating:8,difficulty:4,location:8,schedule:9,color:'#FF9800'}
  ];
  var axes=['가성비','기간충실도','평점','난이도적합','접근성','시간편의'];
  function drawMatrix(){
    var ctx=canvas.getContext('2d');var W=600,H=400;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 14px sans-serif';
    ctx.fillText('강좌 비교 매트릭스 (10점 만점)',20,24);
    var startX=100,startY=60,cellW=80,cellH=60;
    ctx.fillStyle=dk?'#8BA4C4':'#666';ctx.font='11px sans-serif';ctx.textAlign='center';
    courses.forEach(function(c,i){
      ctx.fillStyle=c.color;ctx.font='bold 11px sans-serif';
      ctx.fillText(c.name,startX+i*cellW+cellW/2,startY-8);
    });
    ctx.textAlign='end';
    axes.forEach(function(a,i){
      ctx.fillStyle=dk?'#8BA4C4':'#666';ctx.font='11px sans-serif';
      ctx.fillText(a,startX-8,startY+i*cellH+cellH/2+4);
    });
    ctx.textAlign='center';
    axes.forEach(function(axis,ai){
      courses.forEach(function(c,ci){
        var val=[c.price,c.duration,c.rating,c.difficulty,c.location,c.schedule][ai];
        var x=startX+ci*cellW,y=startY+ai*cellH;
        var intensity=val/10;
        ctx.fillStyle=c.color+(Math.round(intensity*200+55).toString(16).padStart(2,'0'));
        ctx.beginPath();ctx.roundRect(x+4,y+4,cellW-8,cellH-8,8);ctx.fill();
        ctx.fillStyle=intensity>0.5?'#fff':'(dk?\'#fff\':\'#333\')';
        ctx.fillStyle=val>=7?'#fff':(dk?'#fff':'#333');
        ctx.font='bold 18px sans-serif';ctx.fillText(val,x+cellW/2,y+cellH/2+6);
      });
    });
    var sumY=startY+axes.length*cellH+10;
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 12px sans-serif';
    ctx.textAlign='end';ctx.fillText('종합점수',startX-8,sumY+4);
    ctx.textAlign='center';
    courses.forEach(function(c,ci){
      var total=c.price+c.duration+c.rating+c.difficulty+c.location+c.schedule;
      var avg=(total/6).toFixed(1);
      ctx.fillStyle=c.color;ctx.font='bold 16px sans-serif';
      ctx.fillText(avg,startX+ci*cellW+cellW/2,sumY+4);
      ctx.fillStyle=dk?'#8BA4C4':'#888';ctx.font='10px sans-serif';
      ctx.fillText('('+total+'/60)',startX+ci*cellW+cellW/2,sumY+20);
    });
    ctx.textAlign='start';
    var winner=courses.slice().sort(function(a,b){
      var sa=a.price+a.duration+a.rating+a.difficulty+a.location+a.schedule;
      var sb=b.price+b.duration+b.rating+b.difficulty+b.location+b.schedule;
      return sb-sa;
    })[0];
    ctx.fillStyle='#FFD700';ctx.font='bold 13px sans-serif';
    ctx.fillText('🏆 추천: '+winner.name+' (종합 1위)',20,H-16);
  }
  drawMatrix();
  r.box.appendChild(canvas);
  var editDiv=ce('div');editDiv.style.cssText='text-align:center;margin-top:8px;';
  var editBtn=ce('button');editBtn.textContent='✏️ 강좌 점수 수정';
  editBtn.style.cssText='padding:8px 20px;border-radius:12px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'#252540':'#f0f4f8')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:12px;cursor:pointer;';
  editBtn.onclick=function(){
    var idx=parseInt(prompt('수정할 강좌 번호 (1~4):'),10)-1;
    if(isNaN(idx)||idx<0||idx>3)return;
    var c=courses[idx];
    axes.forEach(function(a,ai){
      var keys=['price','duration','rating','difficulty','location','schedule'];
      var val=parseInt(prompt(a+' 점수 (1~10, 현재: '+[c.price,c.duration,c.rating,c.difficulty,c.location,c.schedule][ai]+'):'),10);
      if(!isNaN(val)&&val>=1&&val<=10)c[keys[ai]]=val;
    });
    drawMatrix();SFX14.play('matrix_compare');
  };
  editDiv.appendChild(editBtn);r.box.appendChild(editDiv);
  document.body.appendChild(r.modal);
}

/* ===== 8. 개인화 추천 엔진 ===== */
function openPersonalRecommend(){
  SFX14.play('recommend_pick');trackFeature14('recommend');
  var dk=isDark();var r=makeModal14('&#129302; 개인화 추천 엔진','학습 이력 기반 AI 맞춤 추천 + 유사도 분석');
  var canvas=ce('canvas');canvas.width=580;canvas.height=360;
  canvas.style.cssText='width:100%;max-width:580px;display:block;margin:0 auto 12px;border-radius:12px;';
  var profiles=[
    {name:'운동형',icon:'🏃',interest:['요가','수영','댄스','줌바'],color:'#4CAF50'},
    {name:'예술형',icon:'🎨',interest:['피아노','미술','서예','플로리스트'],color:'#FF5722'},
    {name:'학습형',icon:'📚',interest:['외국어','코딩','자격증','독서'],color:'#2196F3'},
    {name:'웰니스형',icon:'🧘',interest:['명상','필라테스','아로마','요리'],color:'#9C27B0'}
  ];
  var recommendations=[
    ['아침요가 6시반','아쿠아로빅','라틴댄스','복싱피트니스'],
    ['수채화 심화','우쿨렐레 입문','캘리그라피','꽃꽂이 마스터'],
    ['비즈니스영어','파이썬 기초','한국사 자격증','인문학 독서모임'],
    ['싱잉볼 명상','소도구 필라테스','아로마테라피','건강요리 클래스']
  ];
  var selectedProfile=lsGet('cc-v14-rec-profile',0);
  function drawRecommend(pIdx){
    var ctx=canvas.getContext('2d');var W=580,H=360;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=dk?'#12122a':'#f0f4f8';ctx.fillRect(0,0,W,H);
    profiles.forEach(function(p,i){
      var px=20+i*142,py=10,pw=132,ph=60;
      ctx.fillStyle=i===pIdx?p.color+'33':(dk?'#1e1e3a':'#fff');
      ctx.beginPath();ctx.roundRect(px,py,pw,ph,10);ctx.fill();
      if(i===pIdx){ctx.strokeStyle=p.color;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(px,py,pw,ph,10);ctx.stroke();}
      ctx.font='22px sans-serif';ctx.textAlign='center';ctx.fillText(p.icon,px+pw/2,py+28);
      ctx.fillStyle=dk?'#fff':'#333';ctx.font='bold 11px sans-serif';
      ctx.fillText(p.name,px+pw/2,py+48);
    });
    ctx.textAlign='start';
    var prof=profiles[pIdx];
    ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 14px sans-serif';
    ctx.fillText(prof.icon+' '+prof.name+' 맞춤 추천',20,100);
    ctx.fillStyle=dk?'#8BA4C4':'#666';ctx.font='12px sans-serif';
    ctx.fillText('관심분야: '+prof.interest.join(', '),20,118);
    var recs=recommendations[pIdx];
    recs.forEach(function(rec,ri){
      var rx=20+ri%2*285,ry=135+Math.floor(ri/2)*100,rw=270,rh=85;
      var grad=ctx.createLinearGradient(rx,ry,rx+rw,ry+rh);
      grad.addColorStop(0,prof.color+'22');grad.addColorStop(1,prof.color+'08');
      ctx.fillStyle=grad;ctx.beginPath();ctx.roundRect(rx,ry,rw,rh,12);ctx.fill();
      ctx.strokeStyle=prof.color+'44';ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(rx,ry,rw,rh,12);ctx.stroke();
      ctx.fillStyle=dk?'#fff':'#1a1a2e';ctx.font='bold 13px sans-serif';
      ctx.fillText(rec,rx+14,ry+28);
      var similarity=Math.floor(Math.random()*20+80);
      ctx.fillStyle=prof.color;ctx.font='bold 11px sans-serif';
      ctx.fillText('유사도 '+similarity+'%',rx+14,ry+50);
      ctx.fillStyle=dk?'#333':'#e0e0e0';ctx.beginPath();ctx.roundRect(rx+14,ry+58,rw-28,8,4);ctx.fill();
      ctx.fillStyle=prof.color;ctx.beginPath();ctx.roundRect(rx+14,ry+58,(rw-28)*similarity/100,8,4);ctx.fill();
    });
  }
  drawRecommend(selectedProfile);
  var profBtns=ce('div');profBtns.style.cssText='display:flex;gap:8px;justify-content:center;margin-top:8px;';
  profiles.forEach(function(p,i){
    var b=ce('button');b.textContent=p.icon+' '+p.name;
    b.style.cssText='padding:8px 16px;border-radius:16px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(i===selectedProfile?p.color+'33':'transparent')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:12px;cursor:pointer;';
    b.onclick=function(){selectedProfile=i;lsSet('cc-v14-rec-profile',i);drawRecommend(i);SFX14.play('recommend_pick');
      profBtns.querySelectorAll('button').forEach(function(btn,j){btn.style.background=j===i?profiles[j].color+'33':'transparent';});};
    profBtns.appendChild(b);
  });
  r.box.appendChild(canvas);r.box.appendChild(profBtns);
  document.body.appendChild(r.modal);
}

/* ===== 퀴즈 v14 엔진 ===== */
function openQuizV14(){
  SFX14.play('quiz_v14');trackFeature14('quiz');
  var dk=isDark();var mr=makeModal14('🧠 문화센터 퀴즈 v14','15문항 신규 퀴즈');
  var idx=0,score=0;
  var shuffled=QUIZ_V14.slice().sort(function(){return Math.random()-0.5;});
  function showQ(){
    mr.box.innerHTML='';
    if(idx>=shuffled.length){
      var pct=Math.round(score/shuffled.length*100);
      var grade=pct>=90?'S':pct>=80?'A':pct>=70?'B':pct>=60?'C':'D';
      var best=lsGet('cc-v14-quiz-best',0);if(pct>best)lsSet('cc-v14-quiz-best',pct);
      mr.box.innerHTML='<div style="text-align:center;padding:20px;"><div style="font-size:48px;color:'+
        ({S:'#FFD700',A:'#4CAF50',B:'#2196F3',C:'#FF9800',D:'#F44336'}[grade]||'#fff')+
        ';">'+grade+'</div><div style="font-size:18px;margin:8px 0;">'+score+'/'+shuffled.length+' 정답 ('+pct+'%)</div>'+
        '<div style="font-size:12px;color:'+(dk?'#8BA4C4':'#888')+';">최고 기록: '+Math.max(pct,best)+'%</div></div>';
      checkAchieve14();return;
    }
    var q=shuffled[idx];
    var qDiv=ce('div');qDiv.innerHTML='<div style="font-size:14px;font-weight:600;margin-bottom:14px;color:'+(dk?'#e0e0e0':'#333')+';">'+(idx+1)+'/'+shuffled.length+'. '+q.q+'</div>';
    q.opts.forEach(function(o,oi){
      var b=ce('button');b.textContent=o;
      b.style.cssText='display:block;width:100%;padding:12px 16px;margin:6px 0;border-radius:10px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'#252540':'#f8f8f8')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:13px;cursor:pointer;text-align:left;transition:all 0.2s;';
      b.onmouseenter=function(){this.style.background=dk?'#333':'#e8e8e8';};
      b.onmouseleave=function(){this.style.background=dk?'#252540':'#f8f8f8';};
      b.onclick=function(){
        if(oi===q.a){score++;SFX14.play('quiz_correct14');this.style.background='#4CAF5033';this.style.borderColor='#4CAF50';}
        else{SFX14.play('feature_open14');this.style.background='#F4433633';this.style.borderColor='#F44336';}
        setTimeout(function(){idx++;showQ();},600);
      };
      qDiv.appendChild(b);
    });
    mr.box.appendChild(qDiv);
  }
  showQ();
  document.body.appendChild(mr.modal);
}

/* ===== Quick Actions Rail v14 ===== */
function insertQuickActions14(){
  var old=qs('#v14-quick-actions');if(old)old.remove();
  var dk=isDark();
  var rail=ce('div');rail.id='v14-quick-actions';
  rail.style.cssText='position:fixed;top:200px;right:6px;display:flex;flex-direction:column;gap:5px;z-index:9989;transition:opacity 0.3s;';
  var actions=[
    {label:'&#128276; 인기도',fn:openLiveCourseAlert},
    {label:'&#9997; 후기피드',fn:openPeerReviewFeed},
    {label:'&#128268; 학습경로',fn:openLearningPathDAG},
    {label:'&#127891; 강사쇼케이스',fn:openInstructorShowcase},
    {label:'&#128197; 시간표',fn:openWeeklyCalSync},
    {label:'&#128178; 수강료추이',fn:openPriceHistorySpark},
    {label:'&#128202; 비교매트릭스',fn:openCourseCompareMatrix},
    {label:'&#129302; AI추천',fn:openPersonalRecommend},
    {label:'🧠 퀴즈v14',fn:openQuizV14}
  ];
  actions.forEach(function(a){
    var b=ce('button');b.className='v14-qbtn';b.innerHTML=a.label;
    b.style.cssText='padding:6px 10px;border-radius:10px;border:1px solid '+(dk?'#444':'#ddd')+';background:'+(dk?'rgba(30,30,46,0.92)':'rgba(255,255,255,0.95)')+';color:'+(dk?'#e0e0e0':'#333')+';font-size:11px;cursor:pointer;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.15);transition:all 0.2s;text-align:left;';
    b.onmouseenter=function(){this.style.transform='translateX(-4px)';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.25)';};
    b.onmouseleave=function(){this.style.transform='none';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15)';};
    b.onclick=function(){var old2=qs('#v14-modal');if(old2)old2.remove();a.fn();};
    rail.appendChild(b);
  });
  document.body.appendChild(rail);
  setInterval(function(){
    var hasModal=qs('.onboarding-overlay')||qs('[class*="modal-overlay"]');
    rail.style.opacity=hasModal?'0':'1';rail.style.pointerEvents=hasModal?'none':'auto';
  },1000);
}

/* ===== 키보드 단축키 v14 ===== */
function initKeyboard14(){
  document.addEventListener('keydown',function(e){
    if(!e.shiftKey)return;
    var tag=e.target.tagName;if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT')return;
    var old=qs('#v14-modal');if(old)old.remove();
    var map={
      'L':openLiveCourseAlert,
      'R':openPeerReviewFeed,
      'G':openLearningPathDAG,
      'P':openInstructorShowcase,
      'W':openWeeklyCalSync,
      'H':openPriceHistorySpark,
      'X':openCourseCompareMatrix,
      'N':openPersonalRecommend
    };
    var fn=map[e.key.toUpperCase()];if(fn){e.preventDefault();fn();}
  });
}

/* ===== CSS 스타일 주입 v14 ===== */
function injectV14Styles(){
  if(qs('#v14-styles'))return;
  var style=ce('style');style.id='v14-styles';
  style.textContent=''+
'@keyframes v14FadeIn{from{opacity:0}to{opacity:1}}'+
'@keyframes v14SlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}'+
'@keyframes v14SlideDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}'+
'@keyframes v14Pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}'+
'#v14-modal::-webkit-scrollbar{width:6px}'+
'#v14-modal::-webkit-scrollbar-thumb{background:#888;border-radius:3px}'+
'#v14-modal *::-webkit-scrollbar{width:4px}'+
'#v14-modal *::-webkit-scrollbar-thumb{background:#aaa;border-radius:2px}'+
'@media(max-width:480px){'+
'  #v14-quick-actions{top:auto!important;bottom:70px!important;right:0!important;left:0!important;flex-direction:row!important;overflow-x:auto!important;padding:6px 8px!important;gap:4px!important;background:rgba(0,0,0,0.05);backdrop-filter:blur(10px);}'+
'  #v14-quick-actions .v14-qbtn{font-size:10px!important;padding:5px 8px!important;}'+
'  #v14-modal>div{max-width:100vw!important;width:100vw!important;max-height:100vh!important;border-radius:0!important;}'+
'}'+
'body:has(.onboarding-overlay) #v14-quick-actions,'+
'body:has([class*="modal-overlay"]) #v14-quick-actions{opacity:0;pointer-events:none;}';
  document.head.appendChild(style);
}

/* ===== init v14 ===== */
function init14(){
  injectV14Styles();
  setTimeout(function(){
    insertQuickActions14();
    initKeyboard14();
    var milestones=lsGet('cc-milestones-v9',[]);
    if(milestones.indexOf('v14')===-1){milestones.push('v14');lsSet('cc-milestones-v9',milestones);}
    showToast14('🎉 문화센터 파인더 v14.0 업데이트! 8개 신규 기능 + 퀴즈 15문 + 업적 12개',3500);
  },7000);
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init14);
}else{
  init14();
}
})();
