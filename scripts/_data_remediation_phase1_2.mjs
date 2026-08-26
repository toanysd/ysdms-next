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
  console.log('║  DATA REMEDIATION SCRIPT - PHASE 1 & 2                   ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  console.log('--- LOADING CSV DATA ---');
  const moldsCSV = parseCSV(fs.readFileSync(`${csvDir}/molds.csv`, 'utf-8'));
  const designCSV = parseCSV(fs.readFileSync(`${csvDir}/molddesign.csv`, 'utf-8'));
  console.log(`Loaded ${moldsCSV.rows.length} molds from CSV.`);
  console.log(`Loaded ${designCSV.rows.length} designs from CSV.`);

  // =========================================================================
  // STEP 1: RESTORE ANCHORS (legacy_id)
  // =========================================================================
  console.log('\n--- STEP 1.1: RESTORING legacy_id FOR mold_design_revision ---');
  let allDesigns = await fetchAll('mold_design_revision', 'id, revision_code, legacy_id');
  console.log(`Fetched ${allDesigns.length} designs from DB`);

  let designUpdates = 0;
  for (const dbRow of allDesigns) {
    if (dbRow.legacy_id == null) {
      const csvMatch = designCSV.rows.find(r => r.MoldDesignName === dbRow.revision_code);
      if (csvMatch) {
        const legacyId = parseInt(csvMatch.MoldDesignID);
        if (!isNaN(legacyId)) {
          const { error: updErr } = await supabase
            .from('mold_design_revision')
            .update({ legacy_id: legacyId })
            .eq('id', dbRow.id);
          
          if (updErr) {
            console.error(`Error updating design ${dbRow.revision_code}:`, updErr.message);
          } else {
            designUpdates++;
            if (designUpdates % 500 === 0) console.log(`  Updated ${designUpdates} mold_design_revisions...`);
          }
        }
      }
    }
  }
  console.log(`Finished updating ${designUpdates} mold_design_revisions with legacy_id.`);

  console.log('\n--- STEP 1.2: RESTORING legacy_id FOR mold_physical ---');
  let allPhysicals = await fetchAll('mold_physical', 'id, physical_code, legacy_id, revision_id');
  console.log(`Fetched ${allPhysicals.length} physicals from DB`);

  let physicalUpdates = 0;
  for (const dbRow of allPhysicals) {
    if (dbRow.legacy_id == null) {
      const csvMatch = moldsCSV.rows.find(r => r.MoldName === dbRow.physical_code);
      if (csvMatch) {
        const legacyId = parseInt(csvMatch.MoldID);
        if (!isNaN(legacyId)) {
          const { error: updErr } = await supabase
            .from('mold_physical')
            .update({ legacy_id: legacyId })
            .eq('id', dbRow.id);
          
          if (updErr) {
            console.error(`Error updating physical ${dbRow.physical_code}:`, updErr.message);
          } else {
            physicalUpdates++;
            dbRow.legacy_id = legacyId;
            if (physicalUpdates % 500 === 0) console.log(`  Updated ${physicalUpdates} mold_physicals...`);
          }
        }
      }
    }
  }
  console.log(`Finished updating ${physicalUpdates} mold_physicals with legacy_id.`);

  // Refresh data after updates
  allDesigns = await fetchAll('mold_design_revision', 'id, revision_code, legacy_id');
  allPhysicals = await fetchAll('mold_physical', 'id, physical_code, legacy_id, revision_id');

  const designIdMap = new Map();
  for (const d of allDesigns) {
    if (d.legacy_id) designIdMap.set(String(d.legacy_id), d.id);
  }

  // =========================================================================
  // STEP 2: REBUILD CHAIN INTEGRITY
  // =========================================================================
  console.log('\n--- STEP 2: REBUILDING CHAIN INTEGRITY (mold_physical -> mold_design_revision) ---');
  
  let chainUpdates = 0;
  let chainErrors = 0;
  let orphans = 0;

  for (const phys of allPhysicals) {
    if (!phys.legacy_id) {
      orphans++;
      continue;
    }

    const csvRow = moldsCSV.rows.find(r => r.MoldID === String(phys.legacy_id));
    if (!csvRow) continue;

    const targetDesignLegacyId = csvRow.MoldDesignID;
    const targetRevisionUUID = designIdMap.get(targetDesignLegacyId);

    if (!targetRevisionUUID) {
      continue;
    }

    if (phys.revision_id !== targetRevisionUUID) {
      const { error: updErr } = await supabase
        .from('mold_physical')
        .update({ revision_id: targetRevisionUUID })
        .eq('id', phys.id);

      if (updErr) {
        console.error(`Failed to update chain for ${phys.physical_code}:`, updErr.message);
        chainErrors++;
      } else {
        chainUpdates++;
        if (chainUpdates % 500 === 0) console.log(`  Fixed ${chainUpdates} physical -> revision links...`);
      }
    }
  }

  console.log(`Finished rebuilding chain integrity.`);
  console.log(`  -> Successfully relinked: ${chainUpdates}`);
  console.log(`  -> Errors during relink: ${chainErrors}`);
  console.log(`  -> Physicals still without legacy_id (orphans): ${orphans}`);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('PHASE 1 & 2 REMEDIATION COMPLETE');
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
