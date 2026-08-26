import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  'process.env.SUPABASE_SERVICE_ROLE_KEY'
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
  return { headers: headers.map(h => h.trim()), rows };
}

async function fetchAll(tableName, selectStr) {
  let allData = [];
  let start = 0;
  while (true) {
    const { data, error } = await supabase.from(tableName).select(selectStr).range(start, start + 999);
    if (error) throw error;
    if (!data || data.length === 0) break;
    allData.push(...data);
    if (data.length < 1000) break;
    start += 1000;
  }
  return allData;
}

async function main() {
  const csvDir = 'f:/AntiGravity/syncs/MoldCutterSearch_syncs/data';

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  DATA REMEDIATION SCRIPT - PHASE 3 (CUTTERS)             ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  console.log('--- LOADING CSV DATA ---');
  const cuttersCSV = parseCSV(fs.readFileSync(`${csvDir}/cutters.csv`, 'utf-8'));
  const moldcutterCSV = parseCSV(fs.readFileSync(`${csvDir}/moldcutter.csv`, 'utf-8'));
  console.log(`Loaded ${cuttersCSV.rows.length} cutters from CSV.`);
  console.log(`Loaded ${moldcutterCSV.rows.length} mold_cutter links from CSV.`);

  // 1. Load Cutter Master from DB
  const dbCutters = await fetchAll('cutter_master', 'id, code');
  const dbCutterMap = new Map(); // code -> uuid
  for (const c of dbCutters) {
    dbCutterMap.set(c.code, c.id);
  }

  // 2. Build map from CSV CutterID -> DB Cutter UUID
  const csvCutterIdToUUID = new Map();
  for (const c of cuttersCSV.rows) {
    const code = c.CutterNo || c.CutterCode || c.CutterID;
    const uuid = dbCutterMap.get(code);
    if (uuid) {
      csvCutterIdToUUID.set(c.CutterID, uuid);
    }
  }
  console.log(`Mapped ${csvCutterIdToUUID.size} CSV CutterIDs to Supabase UUIDs.`);

  // 3. Load Design Revisions from DB
  const dbDesigns = await fetchAll('mold_design_revision', 'id, legacy_id');
  const dbDesignMap = new Map(); // legacy_id -> uuid
  for (const d of dbDesigns) {
    if (d.legacy_id) {
      dbDesignMap.set(String(d.legacy_id), d.id);
    }
  }
  console.log(`Mapped ${dbDesignMap.size} MoldDesignIDs to Supabase UUIDs.`);

  // 4. Get existing configs to avoid duplicates
  const existingConfigs = await fetchAll('mold_cutter_config', 'revision_id, cutter_id');
  const existingSet = new Set();
  for (const ec of existingConfigs) {
    existingSet.add(`${ec.revision_id}_${ec.cutter_id}`);
  }
  console.log(`Found ${existingSet.size} existing links in mold_cutter_config.`);

  // 5. Process moldcutter.csv
  let newLinks = 0;
  let missingCutterCount = 0;
  let missingDesignCount = 0;
  
  const inserts = [];

  for (const link of moldcutterCSV.rows) {
    const cutterUUID = csvCutterIdToUUID.get(link.CutterID);
    const designUUID = dbDesignMap.get(link.MoldDesignID);

    if (!cutterUUID) {
      missingCutterCount++;
      continue;
    }
    if (!designUUID) {
      missingDesignCount++;
      continue;
    }

    const key = `${designUUID}_${cutterUUID}`;
    if (!existingSet.has(key)) {
      inserts.push({
        revision_id: designUUID,
        cutter_id: cutterUUID,
        setup_notes: link.MoldCutterNotes || null
      });
      existingSet.add(key);
      newLinks++;
    }
  }

  console.log(`\n--- IMPORTING CUTTER CONFIGS ---`);
  console.log(`Ready to insert ${inserts.length} new links.`);
  console.log(`Missing Cutters: ${missingCutterCount} (Cutter not found in cutter_master)`);
  console.log(`Missing Designs: ${missingDesignCount} (Design not found in mold_design_revision)`);

  // Batch insert
  const BATCH_SIZE = 500;
  for (let i = 0; i < inserts.length; i += BATCH_SIZE) {
    const batch = inserts.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('mold_cutter_config').insert(batch);
    if (error) {
      console.error(`Error inserting batch ${i}:`, error.message);
    } else {
      console.log(`Inserted batch ${i} to ${i + batch.length}...`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('PHASE 3 REMEDIATION COMPLETE');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
