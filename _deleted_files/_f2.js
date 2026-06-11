const a = [
{title:"신청 링크가 9px 이모지로 축소",priority:"critical",evidence:"84431강좌 100% 12번필드 신청 URL 보유하나 index.html:1455 끝 9px 사슬뿐. 강좌명(1443) 클릭은 센터모달만. 44px 미달.",recommendation:"강좌명 onClick window.open(12번필드), 행끝을 신청버튼(28-32px) 승격.",effort:"S",regression_risk:"low"},
{title:"센터상세 모달이 막다른 길",priority:"critical",evidence:"센터모달(1614-1663) 강좌리스트(1644)에 12번필드·mapLink 없어 신청 출구 0개. 전화 23.7%만.",recommendation:"신청 컬럼(12번필드 a태그)+주소(1621) mapLink(904)로 길찾기화.",effort:"S",regression_risk:"low"},
{title:"첫 검색 성공 피크에 피드백 없음",priority:"high",evidence:"applyAddr(645) 회색텍스트뿐, showT(677) 미사용, 카운트(1305) 정적.",recommendation:"applyAddr 완료직후(644) showT+카운트 0.3초 펄스(기존 키프레임).",effort:"S",regression_risk:"none"},
{title:"게이미피 5중 런처가 피크 압도",priority:"high",evidence:"v4-v8 런처 사방(v6:933 v7:914 v8:1303) 버튼 50여개, v6/v7/v8 토글이 동선 덮음.",recommendation:"display none v6확대, 세 토글 우하단 통일, 라벨 메뉴화.",effort:"M",regression_risk:"medium"}
];
const s = JSON.stringify(a);
let out = '';
for (const ch of s) { const c = ch.codePointAt(0); out += c > 127 ? '\\u' + c.toString(16).padStart(4, '0') : ch; }
require('fs').writeFileSync(__dirname + '/_f2_escaped.txt', out);
console.log('raw:', s.length, 'escaped:', out.length, 'reparse:', JSON.parse(out).length);
