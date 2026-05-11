const fs = require('fs');
const path = require('path');

const dataDir = 'F:\\AntiGravity\\Projects\\ysdms-nextgen\\source_data\\csv-access-data';
const filesToAnalyze = [
  'moldmaster.csv',
  'molds.csv', 
  'molddesign.csv',
  'moldrevision.csv',
  'worklog.csv'
];

function parseCSVLine(line) {
  const result = [];
  let currentStr = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i+1] === '"') {
        currentStr += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(currentStr.trim());
      currentStr = '';
    } else {
      currentStr += char;
    }
  }
  result.push(currentStr.trim());
  return result;
}

filesToAnalyze.forEach(filename => {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filename}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  // Handle both \r\n and \n
  const lines = content.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length === 0) {
    console.log(`File is empty: ${filename}`);
    return;
  }
  
  const headers = parseCSVLine(lines[0]);
  const stats = headers.map(h => ({ header: h, count: 0, sample: new Set() }));
  
  let validRows = 0;
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    // if row is somewhat valid
    if (row.length > 1) {
      validRows++;
      for (let j = 0; j < Math.min(row.length, headers.length); j++) {
        if (row[j] !== '' && row[j] !== '0' && row[j].toLowerCase() !== 'false' && row[j] !== 'NULL') {
          stats[j].count++;
          if (stats[j].sample.size < 3) {
            stats[j].sample.add(row[j]);
          }
        }
      }
    }
  }
  
  console.log(`\n======================================================`);
  console.log(`BẢNG: ${filename} | Tổng số dòng: ${validRows}`);
  console.log(`======================================================`);
  stats.forEach(s => {
    const fillRate = validRows > 0 ? ((s.count / validRows) * 100).toFixed(1) : 0;
    const samples = Array.from(s.sample).join(' | ');
    console.log(`${s.header.padEnd(25)} | Tỉ lệ điền: ${fillRate.padStart(5)}% (${s.count}) | VD: ${samples}`);
  });
});
