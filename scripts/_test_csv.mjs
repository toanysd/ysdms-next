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

const csvDir = 'F:/AntiGravity/Projects/ysdms-nextgen/source_data/csv-access-data';
// Wait, the new path is f:/AntiGravity/syncs/MoldCutterSearch_syncs/data
const fileContent = fs.readFileSync('f:/AntiGravity/syncs/MoldCutterSearch_syncs/data/molds.csv', 'utf-8');
const moldsCSV = parseCSV(fileContent);

console.log(`Loaded ${moldsCSV.rows.length} rows`);
const jae303 = moldsCSV.rows.find(r => r.MoldName === 'JAE-303');
console.log('JAE-303 in new CSV:', jae303);

const oldContent = fs.readFileSync('f:/AntiGravity/Projects/ysdms-nextgen/source_data/csv-access-data/molds.csv', 'utf-8');
const oldCSV = parseCSV(oldContent);
console.log('JAE-303 in old CSV:', oldCSV.rows.find(r => r.MoldName === 'JAE-303'));
