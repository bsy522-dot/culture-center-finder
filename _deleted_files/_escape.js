const fs = require('fs');
const src = __dirname + '/_findings_short.json';
const f = JSON.parse(fs.readFileSync(src, 'utf8'));
const s = JSON.stringify(f);
let out = '';
for (const ch of s) {
  const c = ch.codePointAt(0);
  if (c > 127) {
    out += '\\u' + c.toString(16).padStart(4, '0');
  } else {
    out += ch;
  }
}
fs.writeFileSync(__dirname + '/_findings_escaped.txt', out);
console.log('escaped length:', out.length);
console.log('reparse ok, count:', JSON.parse(out).length);
