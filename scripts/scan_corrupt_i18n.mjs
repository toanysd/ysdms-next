import fs from 'fs';

const ja = JSON.parse(fs.readFileSync('messages/ja.json', 'utf8'));
const vi = JSON.parse(fs.readFileSync('messages/vi.json', 'utf8'));

function checkCorrupt(obj, path = '', lang = '') {
  for (let k in obj) {
    const currentPath = path ? path + '.' + k : k;
    if (k.includes('${') || k.includes('$') || (k.includes('{') && !k.startsWith('{'))) {
      console.log(`Corrupt Key [${lang}]: ${currentPath}`);
    }
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      checkCorrupt(obj[k], currentPath, lang);
    } else if (typeof obj[k] === 'string') {
      const val = obj[k];
      if (val.includes('${')) {
        console.log(`Corrupt Val [${lang}]: ${currentPath} = "${val}"`);
      }
    }
  }
}

console.log('--- Corrupt Key/Val Scan ---');
checkCorrupt(ja, '', 'JA');
checkCorrupt(vi, '', 'VI');
