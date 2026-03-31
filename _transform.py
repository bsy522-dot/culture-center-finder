import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Step 1: Replace DEFAULT_DATA with empty placeholder + regions constant
old_data = re.search(
    r'// Data format:.*?\n// index 16.*?\nconst DEFAULT_DATA = \[[\s\S]*?\n\];',
    content
)
if not old_data:
    print("ERROR: DEFAULT_DATA not found")
    exit(1)

print(f"Found DEFAULT_DATA at chars {old_data.start()}-{old_data.end()}")

new_data = '''// Data loaded from external JSON file
const DEFAULT_DATA = [];
const REGIONS=["전국","서울","경기","인천","부산","대구","대전","광주","울산","세종","강원","충북","충남","전북","전남","경북","경남","제주"];
function getRegion(addr){
  if(!addr)return"";
  const p=addr.split(" ")[0];
  const map={"서울":"서울","경기":"경기","인천":"인천","부산":"부산","대구":"대구","대전":"대전","광주":"광주","울산":"울산","세종":"세종","강원":"강원","충북":"충북","충남":"충남","전북":"전북","전남":"전남","경북":"경북","경남":"경남","제주":"제주"};
  return map[p]||"";
}'''

content = content[:old_data.start()] + new_data + content[old_data.end():]

# Step 2a: Replace data state init
content = content.replace(
    "const [data,setData]=useState(()=>load(LSK,DEFAULT_DATA.map(r=>[...r])));",
    "const [data,setData]=useState(()=>load(LSK,[]));\n  const [loading,setLoading]=useState(true);\n  const [allData,setAllData]=useState([]);"
)

# Step 2b: Replace settings default
content = content.replace(
    'const [settings,setSettings]=useState(()=>load(LSS,{birthYear:2018,address:"강남역",maxMin:60,transport:"public"}));',
    'const [settings,setSettings]=useState(()=>load(LSS,{birthYear:0,address:"",maxMin:60,transport:"public",region:"전국"}));'
)

# Step 2c: Add useEffect for fetching data
old_effects = '  useEffect(()=>{save(LSS,settings);},[settings]);\n\n  const showT'

new_effects = '''  useEffect(()=>{save(LSS,settings);},[settings]);

  // Load data from JSON
  useEffect(()=>{
    const stored=load(LSK,[]);
    if(stored&&stored.length>0){
      setData(stored);setAllData(stored);setLoading(false);return;
    }
    setLoading(true);
    fetch("data/all.json")
      .then(r=>r.json())
      .then(d=>{setData(d);setAllData(d);save(LSK,d);setLoading(false);})
      .catch(e=>{console.error("Failed to load data:",e);setLoading(false);});
  },[]);

  const showT'''

content = content.replace(old_effects, new_effects)

# Step 2d: Replace childAge calculation
content = content.replace(
    "const childAge = 2026 - settings.birthYear;",
    "const childAge = settings.birthYear ? (new Date().getFullYear() - settings.birthYear) : 0;"
)

# Step 2e: Modify filtered - travel time and region
content = content.replace(
    'f=f.filter(({r})=>(fCat==="전체"||r[0]===fCat)&&(fGrp==="전체"||r[3]===fGrp)&&getTime(r)<=settings.maxMin);',
    'f=f.filter(({r})=>(fCat==="전체"||r[0]===fCat)&&(fGrp==="전체"||r[3]===fGrp)&&(settings.address?getTime(r)<=settings.maxMin:true));\n    // Region filter\n    if(settings.region&&settings.region!=="전국")f=f.filter(({r})=>getRegion(r[15])===settings.region);'
)

# Step 2f: Modify age filter
content = content.replace(
    "if(settings.birthYear){\n      f=f.filter(({r})=>{\n        const range=parseAge(r[5]);\n        if(!range)return true; // 연령 정보 없으면 표시\n        const[lo,hi]=range;\n        return childAge>=lo && childAge<=hi+1;\n      });\n    }",
    "if(settings.birthYear && settings.birthYear>0){\n      f=f.filter(({r})=>{\n        const range=parseAge(r[5]);\n        if(!range)return true;\n        const[lo,hi]=range;\n        return childAge>=lo && childAge<=hi+1;\n      });\n    }"
)

# Step 2g: Update resetData
content = content.replace(
    'setData(DEFAULT_DATA.map(r=>[...r]));setFav(new Set());setMemos({});showT("초기화 완료");',
    'if(allData.length>0){setData(allData.map(r=>[...r]));}else{fetch("data/all.json").then(r=>r.json()).then(d=>{setData(d);setAllData(d);save(LSK,d);});}setFav(new Set());setMemos({});showT("초기화 완료");'
)

# Step 2h: Update centers calculation
content = content.replace(
    "const centers=[...new Set(data.filter(r=>getTimeFor(r)<=settings.maxMin).map(r=>r[1]))];",
    "const centers=[...new Set(data.filter(r=>settings.address?getTimeFor(r)<=settings.maxMin:true).map(r=>r[1]))];"
)

# Step 3a: Replace birth year dropdown
old_birthyear = '{[2016,2017,2018,2019,2020,2021,2022,2023,2024].map(y=><option key={y} value={y}>{y}년생(만{2026-y}세)</option>)}'
new_birthyear = '{[0,...Array.from({length:75},(_,i)=>2024-i)].map(y=><option key={y} value={y}>{y===0?"전체 (나이무관)":`${y}년생(만${new Date().getFullYear()-y}세)`}</option>)}'
content = content.replace(old_birthyear, new_birthyear)

# Step 3b: Add region dropdown before favOnly
old_favonly = '{favOnly&&<span style={{color:"#FBBF24",marginLeft:4}}> · 즐겨찾기</span>}'
new_region_fav = '''<select value={settings.region||"전국"} onChange={e=>setSettings({...settings,region:e.target.value})}
                    style={{background:"rgba(167,139,250,0.12)",border:"1px solid rgba(167,139,250,0.25)",borderRadius:5,color:"#A78BFA",fontWeight:700,fontSize:11,padding:"1px 4px",outline:"none",fontFamily:"inherit",cursor:"pointer",marginLeft:2}}>
                    {REGIONS.map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                  {favOnly&&<span style={{color:"#FBBF24",marginLeft:4}}> \\u00b7 즐겨찾기</span>}'''
content = content.replace(old_favonly, new_region_fav)

# Step 3c: Change address input
content = content.replace(
    '''<input value={settings.address} onChange={e=>setSettings({...settings,address:e.target.value})}
                    style={{background:"rgba(126,200,227,0.12)",border:"1px solid rgba(126,200,227,0.25)",borderRadius:5,color:"#7EC8E3",fontWeight:700,fontSize:11,padding:"1px 6px",width:Math.max(60,settings.address.length*11),outline:"none",fontFamily:"inherit",textAlign:"center"}}
                    title="출발지 변경 (역명/주소)"/>''',
    '''<input value={settings.address} onChange={e=>setSettings({...settings,address:e.target.value})}
                    placeholder="주소 입력"
                    style={{background:"rgba(126,200,227,0.12)",border:"1px solid rgba(126,200,227,0.25)",borderRadius:5,color:"#7EC8E3",fontWeight:700,fontSize:11,padding:"1px 6px",width:Math.max(60,(settings.address||"주소 입력").length*11),outline:"none",fontFamily:"inherit",textAlign:"center"}}
                    title="출발지 입력 (미입력시 이동시간 필터 비활성화)"/>'''
)

# Step 3d: Add loading indicator
content = content.replace(
    '      {/* Header */}',
    '''      {/* Loading Indicator */}
      {loading && (
        <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(8,11,16,0.95)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:999}}>
          <div style={{width:48,height:48,border:"4px solid rgba(126,200,227,0.2)",borderTop:"4px solid #7EC8E3",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
          <div style={{marginTop:16,color:"#7EC8E3",fontSize:14,fontWeight:600}}>강좌 데이터 로딩 중...</div>
          <style>{"@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}"}</style>
        </div>
      )}

      {/* Header */}''',
    1  # Only replace first occurrence
)

# Step 3e: Update travel time display
content = content.replace(
    '<span style={{margin:"0 2px"}}> 이내 · <b>{centers.length}</b>곳 <b>{filtered.length}</b>개 강좌 · </span>',
    '<span style={{margin:"0 2px"}}>{settings.address?" 이내":""} · <b>{centers.length}</b>곳 <b>{filtered.length}</b>개 강좌 · </span>'
)

# Step 3f: Disable maxMin when no address
content = content.replace(
    '''<select value={settings.maxMin} onChange={e=>setSettings({...settings,maxMin:+e.target.value})}
                    style={{background:"rgba(255,183,71,0.12)",border:"1px solid rgba(255,183,71,0.25)",borderRadius:5,color:"#FFB347",fontWeight:700,fontSize:11,padding:"1px 4px",outline:"none",fontFamily:"inherit",cursor:"pointer",margin:"0 1px"}}>
                    {[10,15,20,25,30,35,40,45,50,55,60,70,80,90].map(m=><option key={m} value={m}>{m}분</option>)}
                  </select>''',
    '''<select value={settings.maxMin} onChange={e=>setSettings({...settings,maxMin:+e.target.value})}
                    disabled={!settings.address}
                    style={{background:settings.address?"rgba(255,183,71,0.12)":"rgba(255,255,255,0.04)",border:"1px solid "+(settings.address?"rgba(255,183,71,0.25)":"rgba(255,255,255,0.1)"),borderRadius:5,color:settings.address?"#FFB347":"rgba(255,255,255,0.3)",fontWeight:700,fontSize:11,padding:"1px 4px",outline:"none",fontFamily:"inherit",cursor:settings.address?"pointer":"default",margin:"0 1px",opacity:settings.address?1:0.5}}>
                    {[10,15,20,25,30,35,40,45,50,55,60,70,80,90,120,180].map(m=><option key={m} value={m}>{m}분</option>)}
                  </select>'''
)

# Step 3g: Show "-" for travel time when no address
content = content.replace(
    '{settings.transport==="car"?(r[16]||Math.round(r[2]*0.65)):r[2]}분',
    '{settings.address?(settings.transport==="car"?(r[16]||Math.round(r[2]*0.65)):r[2])+"분":"-"}'
)

# Step 3h: Update usage text
content = content.replace(
    '<b>사용법:</b> 헤더에서 출생년도/출발지/교통수단 설정',
    '<b>사용법:</b> 헤더에서 출생년도/지역/출발지/교통수단 설정'
)

# Save
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

lines = content.split('\n')
print(f"Done! File: {len(content)} chars, {len(lines)} lines")
