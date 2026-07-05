import fs from 'fs';

function parseCSV(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim());
  const headers = lines[0].split(',');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',');
    const row = {};
    headers.forEach((h, idx) => { row[h.trim()] = (vals[idx] || '').trim(); });
    rows.push(row);
  }
  return { headers: headers.map(h => h.trim()), rows };
}

const fileContent = fs.readFileSync('f:/AntiGravity/syncs/MoldCutterSearch_syncs/data/molds.csv', 'utf-8');
const moldsCSV = parseCSV(fileContent);

const dic059 = moldsCSV.rows.find(r => r.MoldName === 'DIC-059');
console.log('DIC-059 found:', dic059 ? 'YES' : 'NO');
if (dic059) {
  console.log('MoldID:', dic059.MoldID);
} else {
  // Try to find it by MoldID 500
  const row500 = moldsCSV.rows.find(r => r.MoldID === '500');
  console.log('Row 500:', row500);
}
