
import * as xlsx from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\n]+)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\n]+)/)[1].trim();
const supabase = createClient(url, key);

const workbook = xlsx.readFile('./source_data/生産指示書/B. トレイデータ一覧表.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { range: 3, defval: null });

const uniquePlastics = new Map();

for (const row of data) {
  const zaisitsu = row['材質'];
  if (!zaisitsu) continue;
  
  const thickness = row['厚み'];
  const width = row['ｼｰﾄ巾'];
  const taiden = row['帯電'];
  const silicon = row['ｼﾘｺﾝ'];
  const tofu = row['塗布'];
  
  // Create a unique key
  const code = \\-\-\-\-\-\\;
  
  if (!uniquePlastics.has(code)) {
    uniquePlastics.set(code, {
      plastic_code: code,
      plastic_family: zaisitsu.split('(')[0].trim(), // very naive split
      plastic_subtype: zaisitsu,
      thickness_mm: parseFloat(thickness) || 0,
      width_mm: parseInt(width) || 0,
      additive_text_raw: \帯電:\ ｼﾘｺﾝ:\ 塗布:\\,
      is_active: true
    });
  }
}

const records = Array.from(uniquePlastics.values());
console.log('Total unique plastics to insert:', records.length);
console.log('Sample families:', [...new Set(records.map(r => r.plastic_family))]);

async function run() {
  const { data: res, error } = await supabase.from('plastic_master').upsert(records, { onConflict: 'plastic_code' }).select();
  if (error) {
    console.error('Error inserting plastic_master:', error);
  } else {
    console.log('Successfully inserted', res.length, 'records.');
  }
}
run();

