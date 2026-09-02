
import * as xlsx from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=([^\n]+)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\n]+)/)[1].trim();
const supabase = createClient(url, key);

function normalize_code(code) {
  return String(code).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

async function run() {
  console.log('Fetching design_revisions...');
  let designs = [];
  let page = 0;
  while (true) {
    const { data, error } = await supabase.from('design_revisions')
      .select('revision_id, design_code, plastic_id, products(product_code, legacy_id)')
      .range(page * 1000, (page + 1) * 1000 - 1);
    if (error) throw error;
    designs.push(...data);
    if (data.length < 1000) break;
    page++;
  }
  
  console.log('Fetching plastic_master...');
  const { data: pmData } = await supabase.from('plastic_master').select('plastic_id, plastic_code, plastic_family');
  const pmMap = new Map();
  pmData.forEach(p => pmMap.set(p.plastic_code, p));
  
  const wb = xlsx.readFile('./source_data/生産指示書/B. トレイデータ一覧表.xlsx');
  const ws = wb.Sheets[wb.SheetNames[0]];
  const df = xlsx.utils.sheet_to_json(ws, { header: 1, range: 4 });

  const excelPns = new Map();
  
  for (const row of df) {
    const pn = row[0];
    if (!pn) continue;
    
    const zaisitsu = row[2] || '';
    const thickness = row[3] || '';
    const width = row[4] || '';
    const taiden = row[5] || '';
    const silicon = row[6] || '';
    const tofu = row[7] || '';
    
    const plastic_code = \_\_\_\_\_\;
    const plastic_text = \ 	 [\] 帯電:\ ｼﾘｺﾝ:\ 塗布:\;
    
    const nPn = normalize_code(pn);
    excelPns.set(nPn, { plastic_code, plastic_text });
    excelPns.set(\TE\, { plastic_code, plastic_text });
  }

  let updates = [];
  
  for (const d of designs) {
    if (d.plastic_id) continue;
    
    const d_code = normalize_code(d.design_code);
    const p_code = d.products && d.products.product_code ? normalize_code(d.products.product_code) : '';
    const l_id = d.products && d.products.legacy_id ? normalize_code(d.products.legacy_id) : '';
    
    let match = null;
    if (excelPns.has(d_code)) match = excelPns.get(d_code);
    else if (p_code && excelPns.has(p_code)) match = excelPns.get(p_code);
    else if (l_id && excelPns.has(l_id)) match = excelPns.get(l_id);
    
    if (match && pmMap.has(match.plastic_code)) {
      updates.push({
        revision_id: d.revision_id,
        plastic_id: pmMap.get(match.plastic_code).plastic_id,
        plastic_type_designed: match.plastic_text,
        design_code: d.design_code,
        plastic_family: pmMap.get(match.plastic_code).plastic_family
      });
    }
  }

  console.log(\Ready to update \ records.\);
  
  let successCount = 0;
  const BATCH_SIZE = 200;
  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const chunk = updates.slice(i, i + BATCH_SIZE);
    const promises = chunk.map(u => 
      supabase.from('design_revisions')
        .update({ plastic_id: u.plastic_id, plastic_type_designed: u.plastic_type_designed })
        .eq('revision_id', u.revision_id)
        .is('plastic_id', null)
    );
    const results = await Promise.all(promises);
    successCount += results.filter(r => !r.error).length;
    console.log(\Processed chunk \ / \);
  }
  
  console.log(\Successfully updated \ records.\);
  console.log('\n--- 5 Sample Updates ---');
  for(let i = 0; i < Math.min(5, updates.length); i++) {
    console.log(\Design: \ | Text: \ | Family: \);
  }
}

run().catch(console.error);
