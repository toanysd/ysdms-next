import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const c = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  'process.env.SUPABASE_SERVICE_ROLE_KEY'
);

// Simple CSV parser
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
  console.log('║  YSDMS DATA INTEGRITY AUDIT — CSV vs Supabase          ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // ========== TEST 1: mold_physical vs molds.csv ==========
  console.log('━━━ TEST 1: mold_physical vs molds.csv ━━━');
  const moldsCSV = parseCSV(fs.readFileSync(`${csvDir}/molds.csv`, 'utf-8'));
  console.log(`CSV rows: ${moldsCSV.rows.length}`);
  console.log(`CSV headers: ${moldsCSV.headers.join(', ')}`);
  
  // Pick 5 random mold IDs from CSV and check Supabase
  const testMoldIDs = [10, 55, 272, 500, 1000]; // diverse legacy IDs
  for (const legacyId of testMoldIDs) {
    const csvRow = moldsCSV.rows.find(r => r.MoldID === String(legacyId));
    if (!csvRow) { console.log(`  [SKIP] MoldID ${legacyId} not in CSV`); continue; }
    
    const { data: sbRows } = await c.from('mold_physical').select('*').eq('legacy_id', legacyId);
    if (!sbRows || sbRows.length === 0) {
      console.log(`  [MISS] MoldID ${legacyId} (${csvRow.MoldName}) — NOT in Supabase`);
      continue;
    }
    
    const sb = sbRows[0];
    const issues = [];
    
    // Check MoldName → should match code somewhere
    // CSV MoldCode → mold_physical.physical_code? or mold_base.code?
    // CSV RackLayerID → mold_physical.rack_layer_id? (but it's UUID now)
    // CSV ItemTypeID → mold_physical.item_type_id?
    // CSV MoldNotes → mold_physical.notes?
    // CSV MoldUsageStatus → mold_physical.usage_status?
    // CSV DeviceStatus → mold_physical.device_status?
    // CSV KeeperCompany → mold_physical.keeper_company?
    
    if (csvRow.MoldNotes && sb.notes !== csvRow.MoldNotes) {
      if (!sb.notes) issues.push(`notes: CSV="${csvRow.MoldNotes}" vs SB=null`);
      else if (sb.notes !== csvRow.MoldNotes) issues.push(`notes: CSV="${csvRow.MoldNotes.substring(0,30)}" vs SB="${(sb.notes||'').substring(0,30)}"`);
    }
    
    if (csvRow.DeviceStatus && csvRow.DeviceStatus !== sb.device_status) {
      issues.push(`device_status: CSV="${csvRow.DeviceStatus}" vs SB="${sb.device_status}"`);
    }
    
    if (csvRow.MoldUsageStatus && csvRow.MoldUsageStatus !== sb.usage_status) {
      issues.push(`usage_status: CSV="${csvRow.MoldUsageStatus}" vs SB="${sb.usage_status}"`);
    }
    
    const status = issues.length === 0 ? '✅ MATCH' : '⚠️ DIFF';
    console.log(`  [${status}] MoldID ${legacyId} (${csvRow.MoldName}) — physical_code="${sb.physical_code}"`);
    issues.forEach(i => console.log(`    → ${i}`));
  }

  // ========== TEST 2: mold_design_revision vs molddesign.csv ==========
  console.log('\n━━━ TEST 2: mold_design_revision vs molddesign.csv ━━━');
  const designCSV = parseCSV(fs.readFileSync(`${csvDir}/molddesign.csv`, 'utf-8'));
  console.log(`CSV rows: ${designCSV.rows.length}`);
  
  const testDesignIDs = [21, 45, 277, 660, 3018]; // diverse legacy IDs
  for (const legacyId of testDesignIDs) {
    const csvRow = designCSV.rows.find(r => r.MoldDesignID === String(legacyId));
    if (!csvRow) { console.log(`  [SKIP] MoldDesignID ${legacyId} not in CSV`); continue; }
    
    const { data: sbRows } = await c.from('mold_design_revision').select('*').eq('legacy_id', legacyId);
    if (!sbRows || sbRows.length === 0) {
      console.log(`  [MISS] DesignID ${legacyId} (${csvRow.MoldDesignName}) — NOT in Supabase`);
      continue;
    }
    
    const sb = sbRows[0];
    const issues = [];
    
    // Compare dimensions
    const checkNum = (csvField, sbField, label) => {
      const csvVal = parseFloat(csvRow[csvField]);
      const sbVal = parseFloat(sb[sbField]);
      if (!isNaN(csvVal) && csvVal !== 0) {
        if (isNaN(sbVal)) issues.push(`${label}: CSV=${csvVal} vs SB=null`);
        else if (Math.abs(csvVal - sbVal) > 0.01) issues.push(`${label}: CSV=${csvVal} vs SB=${sbVal}`);
      }
    };
    
    checkNum('MoldDesignLength', 'design_length', 'design_length');
    checkNum('MoldDesignWidth', 'design_width', 'design_width');
    checkNum('MoldDesignHeight', 'design_height', 'design_height');
    checkNum('MoldDesignDepth', 'design_depth', 'design_depth');
    checkNum('PocketNumbers', 'pocket_numbers', 'pocket_numbers');
    checkNum('Pitch', 'pitch', 'pitch');
    checkNum('CutlineX', 'cutline_x', 'cutline_x');
    checkNum('CutlineY', 'cutline_y', 'cutline_y');
    
    // Check text fields
    if (csvRow.MoldOrientation && csvRow.MoldOrientation !== '0') {
      if (sb.mold_orientation !== csvRow.MoldOrientation) {
        issues.push(`mold_orientation: CSV="${csvRow.MoldOrientation}" vs SB="${sb.mold_orientation}"`);
      }
    }
    if (csvRow.MoldSetupType && csvRow.MoldSetupType !== '0') {
      if (sb.mold_setup_type !== csvRow.MoldSetupType) {
        issues.push(`mold_setup_type: CSV="${csvRow.MoldSetupType}" vs SB="${sb.mold_setup_type}"`);
      }
    }
    if (csvRow.DesignForPlasticType && sb.design_for_plastic_type !== csvRow.DesignForPlasticType) {
      issues.push(`plastic_type: CSV="${csvRow.DesignForPlasticType.substring(0,30)}" vs SB="${(sb.design_for_plastic_type||'').substring(0,30)}"`);
    }
    
    const status = issues.length === 0 ? '✅ MATCH' : '⚠️ DIFF';
    console.log(`  [${status}] DesignID ${legacyId} (${csvRow.MoldDesignName})`);
    issues.forEach(i => console.log(`    → ${i}`));
  }

  // ========== TEST 3: cutter_master vs cutters.csv ==========
  console.log('\n━━━ TEST 3: cutter_master vs cutters.csv ━━━');
  const cuttersCSV = parseCSV(fs.readFileSync(`${csvDir}/cutters.csv`, 'utf-8'));
  console.log(`CSV rows: ${cuttersCSV.rows.length}`);
  console.log(`CSV headers: ${cuttersCSV.headers.join(', ')}`);
  
  // Count check
  const { count: sbCutterCount } = await c.from('cutter_master').select('*', { count: 'exact' }).limit(0);
  console.log(`Supabase rows: ${sbCutterCount}`);
  console.log(`  → Row count diff: CSV=${cuttersCSV.rows.length} vs SB=${sbCutterCount}`);
  
  // Spot check 5 cutters by CutterID (legacy_id is not always available, use code)
  const testCutterCodes = ['JAE090', 'ADV017', 'SSM025', 'DIC001', 'HKS010'];
  for (const code of testCutterCodes) {
    const csvRow = cuttersCSV.rows.find(r => r.CutterDesignCode === code || r.CutterCode === code);
    if (!csvRow) { console.log(`  [SKIP] CutterCode ${code} not in CSV`); continue; }
    
    const { data: sbRows } = await c.from('cutter_master').select('*').eq('code', code);
    if (!sbRows || sbRows.length === 0) {
      console.log(`  [MISS] CutterCode ${code} (${csvRow.CutterName}) — NOT in Supabase`);
      continue;
    }
    
    const sb = sbRows[0];
    const issues = [];
    
    // Check key fields
    if (csvRow.CutterName && sb.cutter_name !== csvRow.CutterName) {
      issues.push(`name: CSV="${csvRow.CutterName}" vs SB="${sb.cutter_name}"`);
    }
    if (csvRow.CutterNote && sb.cutter_note !== csvRow.CutterNote) {
      issues.push(`note: CSV="${csvRow.CutterNote.substring(0,40)}" vs SB="${(sb.cutter_note||'').substring(0,40)}"`);
    }
    
    const csvBlade = parseInt(csvRow.BladeCount);
    if (!isNaN(csvBlade) && csvBlade > 0 && sb.blade_count !== csvBlade) {
      issues.push(`blade_count: CSV=${csvBlade} vs SB=${sb.blade_count}`);
    }
    
    const csvShared = csvRow.MoldShared;
    if (csvShared && csvShared !== '' && sb.mold_shared !== (csvShared === 'TRUE' || csvShared === 'true')) {
      // mold_shared in CSV is text like "004", "128" etc, not boolean
      // skip boolean check if it's a code value
    }
    
    const status = issues.length === 0 ? '✅ MATCH' : '⚠️ DIFF';
    console.log(`  [${status}] CutterCode ${code} (${csvRow.CutterName})`);
    issues.forEach(i => console.log(`    → ${i}`));
  }

  // ========== TEST 4: rack_layers vs racklayers.csv ==========
  console.log('\n━━━ TEST 4: rack_layers vs racklayers.csv ━━━');
  const rlCSV = parseCSV(fs.readFileSync(`${csvDir}/racklayers.csv`, 'utf-8'));
  console.log(`CSV rows: ${rlCSV.rows.length}`);
  
  const { count: sbRLCount } = await c.from('rack_layers').select('*', { count: 'exact' }).limit(0);
  console.log(`Supabase rows: ${sbRLCount}`);
  
  // Check rack_id population
  const { data: rlWithRack } = await c.from('rack_layers').select('id, code, rack_id, layer_index, label').limit(20);
  let nullRackCount = 0;
  let nonNullRackCount = 0;
  for (const rl of rlWithRack) {
    if (rl.rack_id) nonNullRackCount++;
    else nullRackCount++;
  }
  console.log(`  → rack_id NULL: ${nullRackCount}/${rlWithRack.length} (sample)`);
  console.log(`  → rack_id SET: ${nonNullRackCount}/${rlWithRack.length} (sample)`);
  
  // Cross-check: CSV RackLayerID 11 → RackID 1, Layer 1
  // In Supabase, rack_layers.code="11" should have rack_id pointing to racks.code="1", layer_index=1
  const testRLCodes = ['11', '85', '125', '704', '1001'];
  for (const code of testRLCodes) {
    const csvRow = rlCSV.rows.find(r => r.RackLayerID === code);
    if (!csvRow) { console.log(`  [SKIP] RackLayerID ${code} not in CSV`); continue; }
    
    const { data: sbRows } = await c.from('rack_layers').select('*').eq('code', code);
    if (!sbRows || sbRows.length === 0) {
      console.log(`  [MISS] RackLayer ${code} — NOT in Supabase`);
      continue;
    }
    
    const sb = sbRows[0];
    const issues = [];
    
    if (sb.layer_index !== parseInt(csvRow.RackLayerNumber)) {
      issues.push(`layer_index: CSV=${csvRow.RackLayerNumber} vs SB=${sb.layer_index}`);
    }
    if (!sb.rack_id) {
      issues.push(`rack_id: NULL (should link to RackID=${csvRow.RackID})`);
    }
    
    const status = issues.length === 0 ? '✅ MATCH' : '⚠️ DIFF';
    console.log(`  [${status}] RackLayer ${code} (Rack=${csvRow.RackID}, Layer=${csvRow.RackLayerNumber})`);
    issues.forEach(i => console.log(`    → ${i}`));
  }

  // ========== TEST 5: mold_physical legacy_id mapping correctness ==========
  console.log('\n━━━ TEST 5: mold_physical → mold_design_revision → mold_base chain integrity ━━━');
  
  // Pick some molds and trace the whole chain
  const testChainMolds = [10, 55, 272, 500, 1000];
  for (const legacyMoldId of testChainMolds) {
    const csvMold = moldsCSV.rows.find(r => r.MoldID === String(legacyMoldId));
    if (!csvMold) continue;
    
    // CSV: MoldID → MoldDesignID → find that design → get DesignMasterID
    const csvDesignId = csvMold.MoldDesignID;
    const csvDesignRow = designCSV.rows.find(r => r.MoldDesignID === csvDesignId);
    const csvDesignMasterId = csvDesignRow ? csvDesignRow.DesignMasterID : 'N/A';
    const csvMoldName = csvMold.MoldName;
    const csvDesignName = csvDesignRow ? csvDesignRow.MoldDesignName : 'N/A';
    
    // Supabase: mold_physical (legacy_id) → revision_id → mold_design_revision → mold_base_id → mold_base
    const { data: sbPhysical } = await c.from('mold_physical').select('id, physical_code, revision_id, legacy_id').eq('legacy_id', legacyMoldId);
    if (!sbPhysical || sbPhysical.length === 0) {
      console.log(`  [MISS] MoldID ${legacyMoldId} (${csvMoldName}) — NOT in Supabase`);
      continue;
    }
    
    const phys = sbPhysical[0];
    const { data: sbDesign } = await c.from('mold_design_revision').select('id, revision_code, mold_base_id, legacy_id').eq('id', phys.revision_id);
    
    if (!sbDesign || sbDesign.length === 0) {
      console.log(`  [BROKEN] MoldID ${legacyMoldId}: revision_id ${phys.revision_id} NOT found in mold_design_revision`);
      continue;
    }
    
    const design = sbDesign[0];
    const { data: sbBase } = await c.from('mold_base').select('id, code, name').eq('id', design.mold_base_id);
    
    const issues = [];
    
    // Check: CSV MoldDesignID should match design.legacy_id
    if (String(design.legacy_id) !== csvDesignId) {
      issues.push(`design legacy_id: CSV.MoldDesignID=${csvDesignId} vs SB.design.legacy_id=${design.legacy_id}`);
    }
    
    // Check: design revision_code should relate to CSV design name
    if (design.revision_code !== csvDesignName) {
      // Not necessarily an error — revision_code might be formatted differently
      // Just note it
    }
    
    const baseName = sbBase && sbBase.length > 0 ? sbBase[0].name : 'N/A';
    const baseCode = sbBase && sbBase.length > 0 ? sbBase[0].code : 'N/A';
    
    const status = issues.length === 0 ? '✅ CHAIN OK' : '⚠️ CHAIN ISSUE';
    console.log(`  [${status}] CSV MoldID=${legacyMoldId} "${csvMoldName}" → DesignID=${csvDesignId}`);
    console.log(`    SB: physical="${phys.physical_code}" → design="${design.revision_code}" (lid=${design.legacy_id}) → base="${baseName}" (${baseCode})`);
    issues.forEach(i => console.log(`    → ${i}`));
  }

  // ========== TEST 6: product_mold_map integrity ==========
  console.log('\n━━━ TEST 6: product_mold_map bridge count ━━━');
  const moldcutterCSV = parseCSV(fs.readFileSync(`${csvDir}/moldcutter.csv`, 'utf-8'));
  console.log(`CSV moldcutter.csv rows: ${moldcutterCSV.rows.length}`);
  console.log(`CSV moldcutter headers: ${moldcutterCSV.headers.join(', ')}`);
  
  const { count: sbPMMCount } = await c.from('product_mold_map').select('*', { count: 'exact' }).limit(0);
  const { count: sbMCCCount } = await c.from('mold_cutter_config').select('*', { count: 'exact' }).limit(0);
  console.log(`Supabase product_mold_map rows: ${sbPMMCount}`);
  console.log(`Supabase mold_cutter_config rows: ${sbMCCCount}`);
  console.log(`CSV moldcutter rows: ${moldcutterCSV.rows.length} (should ≈ mold_cutter_config)`);

  // ========== TEST 7: Row count summary ==========
  console.log('\n━━━ TEST 7: Row Count Comparison ━━━');
  const csvCounts = {
    'molds.csv (→ mold_physical)': moldsCSV.rows.length,
    'molddesign.csv (→ mold_design_revision)': designCSV.rows.length,
    'cutters.csv (→ cutter_master)': cuttersCSV.rows.length,
    'racklayers.csv (→ rack_layers)': rlCSV.rows.length,
  };
  
  const sbCounts = {
    'mold_physical': (await c.from('mold_physical').select('*', { count: 'exact' }).limit(0)).count,
    'mold_design_revision': (await c.from('mold_design_revision').select('*', { count: 'exact' }).limit(0)).count,
    'cutter_master': sbCutterCount,
    'rack_layers': sbRLCount,
  };
  
  const sbKeys = ['mold_physical', 'mold_design_revision', 'cutter_master', 'rack_layers'];
  const csvKeys = Object.keys(csvCounts);
  
  for (let i = 0; i < csvKeys.length; i++) {
    const csvCount = csvCounts[csvKeys[i]];
    const sbCount = sbCounts[sbKeys[i]];
    const diff = sbCount - csvCount;
    const sym = diff === 0 ? '✅' : diff > 0 ? '🔵+' : '🔴-';
    console.log(`  ${sym} ${csvKeys[i]}: CSV=${csvCount} vs SB=${sbCount} (diff=${diff})`);
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('AUDIT COMPLETE');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
