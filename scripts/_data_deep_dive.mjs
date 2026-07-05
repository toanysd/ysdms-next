import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const c = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ'
);

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
  return { headers: headers.map(h=>h.trim()), rows };
}

async function main() {
  const csvDir = 'F:/AntiGravity/Projects/ysdms-nextgen/source_data/csv-access-data';

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  DEEP DIVE: Understanding Data Gaps                     ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // ===== 1. How is mold_physical keyed? By legacy_id or by physical_code? =====
  console.log('━━━ DIVE 1: mold_physical keying strategy ━━━');
  const { data: physSample } = await c.from('mold_physical').select('id, physical_code, legacy_id, serial_no, unit_index').limit(10);
  console.log('Sample mold_physical rows:');
  for (const r of physSample) {
    console.log(`  code="${r.physical_code}" legacy_id=${r.legacy_id} serial_no=${r.serial_no} unit_index=${r.unit_index}`);
  }
  
  // How many have legacy_id populated?
  const { count: withLegacy } = await c.from('mold_physical').select('*', { count: 'exact' }).not('legacy_id', 'is', null).limit(0);
  const { count: withoutLegacy } = await c.from('mold_physical').select('*', { count: 'exact' }).is('legacy_id', null).limit(0);
  console.log(`\n  legacy_id populated: ${withLegacy}`);
  console.log(`  legacy_id NULL: ${withoutLegacy}`);
  console.log(`  Total: ${withLegacy + withoutLegacy}`);

  // ===== 2. Try finding "TDS-006 R2" by physical_code =====
  console.log('\n━━━ DIVE 2: Searching for MISS records by code ━━━');
  const missCodes = ['TDS-006 R2', 'TDS006R2', 'JAE-303', 'JAE303', 'DIC-059', 'DIC059', 'HRT-002', 'HRT002'];
  for (const code of missCodes) {
    const { data } = await c.from('mold_physical').select('id, physical_code, legacy_id').ilike('physical_code', `%${code}%`);
    if (data && data.length > 0) {
      console.log(`  [FOUND by code] "${code}" → ${data.map(d => `"${d.physical_code}" (lid=${d.legacy_id})`).join(', ')}`);
    } else {
      console.log(`  [NOT FOUND] "${code}"`);
    }
  }

  // ===== 3. Check if CSV MoldID is actually the Access auto-increment ID =====
  console.log('\n━━━ DIVE 3: CSV MoldID range vs Supabase legacy_id range ━━━');
  const moldsCSV = parseCSV(fs.readFileSync(`${csvDir}/molds.csv`, 'utf-8'));
  const csvIds = moldsCSV.rows.map(r => parseInt(r.MoldID)).filter(x => !isNaN(x));
  console.log(`  CSV MoldID range: ${Math.min(...csvIds)} — ${Math.max(...csvIds)}`);
  
  // Query min/max legacy_id
  const { data: minLid } = await c.from('mold_physical').select('legacy_id').not('legacy_id', 'is', null).order('legacy_id', { ascending: true }).limit(1);
  const { data: maxLid } = await c.from('mold_physical').select('legacy_id').not('legacy_id', 'is', null).order('legacy_id', { ascending: false }).limit(1);
  console.log(`  SB legacy_id range: ${minLid?.[0]?.legacy_id} — ${maxLid?.[0]?.legacy_id}`);

  // ===== 4. Check TIH-014 chain in detail =====
  console.log('\n━━━ DIVE 4: TIH-014 chain deep analysis ━━━');
  // CSV says: MoldID=10, MoldName=TIH-014, MoldDesignID=3018, MoldRevisionID=3072
  // SB chain linked to wrong design?
  const { data: tih } = await c.from('mold_physical').select('*, revision:mold_design_revision(*, base:mold_base(*))').eq('physical_code', 'TIH-014');
  if (tih && tih.length > 0) {
    for (const t of tih) {
      console.log(`  physical_code="${t.physical_code}" legacy_id=${t.legacy_id}`);
      console.log(`  → revision_id=${t.revision_id}`);
      if (t.revision) {
        console.log(`    revision_code="${t.revision.revision_code}" legacy_id=${t.revision.legacy_id}`);
        if (t.revision.base) {
          console.log(`    base_code="${t.revision.base.code}" base_name="${t.revision.base.name}"`);
        }
      }
    }
  }
  
  // Now find what design with legacy_id=3018 looks like
  console.log('\n  Looking for design with legacy_id=3018:');
  const { data: d3018 } = await c.from('mold_design_revision').select('id, revision_code, legacy_id, mold_base_id').eq('legacy_id', 3018);
  if (d3018 && d3018.length > 0) {
    for (const d of d3018) {
      console.log(`    id=${d.id} code="${d.revision_code}" lid=${d.legacy_id} base=${d.mold_base_id}`);
    }
  } else {
    console.log('    NOT FOUND — legacy_id=3018 does not exist in mold_design_revision');
  }

  // Check how many designs have legacy_id populated
  const { count: designsWithLid } = await c.from('mold_design_revision').select('*', { count: 'exact' }).not('legacy_id', 'is', null).limit(0);
  const { count: designsWithoutLid } = await c.from('mold_design_revision').select('*', { count: 'exact' }).is('legacy_id', null).limit(0);
  console.log(`\n  design legacy_id populated: ${designsWithLid}`);
  console.log(`  design legacy_id NULL: ${designsWithoutLid}`);

  // ===== 5. Check the revision_code naming pattern =====
  console.log('\n━━━ DIVE 5: How are records being keyed? ━━━');
  // Maybe physical_code = MoldName from CSV, and the import didn't use legacy MoldID?
  const { data: samplePhys } = await c.from('mold_physical').select('physical_code, legacy_id').order('created_at', { ascending: true }).limit(5);
  console.log('  Oldest mold_physical:');
  for (const r of samplePhys) {
    console.log(`    "${r.physical_code}" legacy_id=${r.legacy_id}`);
  }
  
  // Try matching by physical_code = MoldName
  console.log('\n  Cross-checking by MoldName match:');
  const testNames = ['TIH-014', 'TDS-006 R2', 'JAE-303', 'DIC-059', 'HRT-002', 'SSM-021', 'JAE-090'];
  for (const name of testNames) {
    const { data, count } = await c.from('mold_physical').select('physical_code, legacy_id', { count: 'exact' }).eq('physical_code', name);
    console.log(`    "${name}": ${count} match(es) — legacy_ids: ${data?.map(d=>d.legacy_id).join(',') || 'none'}`);
  }

  // ===== 6. Cutter: understand the 439 row gap =====
  console.log('\n━━━ DIVE 6: Cutter row gap analysis ━━━');
  const cuttersCSV = parseCSV(fs.readFileSync(`${csvDir}/cutters.csv`, 'utf-8'));
  
  // CSV has CutterMasterID field — this might be the grouping key
  // Multiple CSV rows share same CutterMasterID (one cutter master → many physical cutter entries)
  const masterIds = new Set(cuttersCSV.rows.map(r => r.CutterMasterID));
  console.log(`  CSV unique CutterMasterID: ${masterIds.size}`);
  console.log(`  CSV total CutterID rows: ${cuttersCSV.rows.length}`);
  console.log(`  SB cutter_master rows: 1273`);
  console.log(`  → Gap explained? cutter_master stores UNIQUE masters, CSV stores ALL physical entries`);
  
  // Verify: CSV CutterMasterID count ≈ SB cutter_master count?
  const diff = Math.abs(masterIds.size - 1273);
  console.log(`  → Unique master diff: ${masterIds.size} vs 1273 = ${diff}`);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('DEEP DIVE COMPLETE');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
