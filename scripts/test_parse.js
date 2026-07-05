const fs = require('fs');

function parseCSV(filePath) {
  if(!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^\uFEFF/, ''));
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    let row = []; let cur = ''; let inQuotes = false;
    for(let j = 0; j < line.length; j++) {
      if(line[j] === '"') { inQuotes = !inQuotes; }
      else if (line[j] === ',' && !inQuotes) { row.push(cur); cur = ''; }
      else { cur += line[j]; }
    }
    row.push(cur);
    let obj = {};
    headers.forEach((h, idx) => obj[h] = row[idx] ? row[idx].trim().replace(/^"|"$/g, '') : null);
    data.push(obj);
  }
  return data;
}

function hex12(numStr) {
  if (!numStr || numStr.toLowerCase() === 'nan') return '000000000000';
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return '000000000000';
  return num.toString(16).padStart(12, '0');
}

function uuid(num, prefix) {
  return `00000000-${prefix}-0000-0000-${hex12(num)}`;
}

const jobsData = parseCSV('source_data/csv-access-data/jobs.csv');
const uuids = jobsData.map(j => uuid(j.JobID, '5555'));
const uniqueUuids = new Set(uuids);
console.log('Unique UUIDs:', uniqueUuids.size);

// Print duplicates if any
const countMap = {};
uuids.forEach(u => countMap[u] = (countMap[u] || 0) + 1);
const duplicates = Object.keys(countMap).filter(u => countMap[u] > 1);
if (duplicates.length > 0) {
  console.log('Duplicates:', duplicates);
}
