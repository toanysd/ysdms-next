import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';

// Parse arguments
const args = process.argv.slice(2);
const isExecute = args.includes('--execute');
const isDryRun = !isExecute || args.includes('--dry-run');

console.log(`\n=== YSDMS NextGen Backfill Script ===`);
console.log(`Mode: ${isDryRun ? 'DRY RUN (No database changes will be made)' : 'EXECUTE (Writing to database)'}\n`);

// Load Environment Variables
const loadEnv = () => {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^#\s][^=]+)=(.*)$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
      }
    });
  }
};
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Utility: Process numeric values
const parseNumeric = (val) => {
  if (val === undefined || val === null || val === '') return null;
  const str = String(val).trim();
  if (str === '0' || str === '0.0') return null;
  const num = Number(str);
  return isNaN(num) ? null : num;
};

// Utility: Process text values
const parseText = (val, allowZero = false) => {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  if (str === '') return null;
  if (!allowZero && (str === '0' || str === '0.0')) return null;
  return str;
};

// Batch update helper — uses individual .update().eq() calls
const batchUpdate = async (table, updates, idColumn = 'id') => {
  if (isDryRun) return updates.length;
  
  let successCount = 0;
  
  for (const update of updates) {
    const pk = update[idColumn];
    const fields = { ...update };
    delete fields[idColumn];  // Remove PK from update payload
    
    const { error } = await supabase.from(table).update(fields).eq(idColumn, pk);
    if (error) {
      console.error(`Error updating ${table} [${pk}]:`, error.message);
    } else {
      successCount++;
    }
  }
  return successCount;
};

async function main() {
  try {
    // 1. Read CSV files
    const moldDesignCsvPath = path.resolve(process.cwd(), 'source_data/csv-access-data/molddesign.csv');
    const cuttersCsvPath = path.resolve(process.cwd(), 'source_data/csv-access-data/cutters.csv');

    if (!fs.existsSync(moldDesignCsvPath) || !fs.existsSync(cuttersCsvPath)) {
      throw new Error(`CSV files not found. Ensure source_data/csv-access-data/ exists.`);
    }

    const moldDesignData = parse(fs.readFileSync(moldDesignCsvPath, 'utf8'), { columns: true, skip_empty_lines: true, bom: true });
    const cuttersData = parse(fs.readFileSync(cuttersCsvPath, 'utf8'), { columns: true, skip_empty_lines: true, bom: true });

    console.log(`Loaded ${moldDesignData.length} records from molddesign.csv`);
    console.log(`Loaded ${cuttersData.length} records from cutters.csv`);

    // 2. Build mapping of MoldDesignID -> MoldDesignCode
    const moldDesignMap = new Map(); // MoldDesignID -> MoldDesignCode
    moldDesignData.forEach(row => {
      const id = row.MoldDesignID?.trim();
      const code = (row.MoldDesignCode || row.MoldDesignName)?.trim();
      if (id && code) {
        moldDesignMap.set(id, code);
      }
    });

    // 3. Fetch current DB state (paginated to get ALL records)
    console.log(`\nFetching existing data from database...`);
    
    async function fetchAll(table, columns) {
      let allData = [];
      let page = 0;
      const pageSize = 1000;
      while (true) {
        const { data, error } = await supabase.from(table).select(columns).range(page * pageSize, (page + 1) * pageSize - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        allData = allData.concat(data);
        if (data.length < pageSize) break;
        page++;
      }
      return allData;
    }

    // Fetch design_revisions
    const dbDesignRevisions = await fetchAll('design_revisions', 'revision_id, design_code, cutline_length, cutline_width, corner_r, chamfer_c, pocket_numbers, under_depth');
    
    // Fetch cutters
    const dbCutters = await fetchAll('cutters', 'cutter_id, cutter_no, cutter_length_mm, cutter_width_mm, cutter_height_mm, post_cut_length, post_cut_width, pitch_mm, cavity_count, cutter_type, plastic_cut_type');

    const drByCode = new Map(dbDesignRevisions.filter(r => r.design_code).map(r => [r.design_code, r]));
    const cutterByNo = new Map(dbCutters.filter(c => c.cutter_no).map(c => [c.cutter_no, c]));

    console.log(`Found ${dbDesignRevisions.length} design_revisions and ${dbCutters.length} cutters in DB.`);

    // Tracking updates
    const updatesTaskA = [];
    const updatesTaskB = [];
    const updatesTaskC = [];
    const samplesTaskA = [];
    const samplesTaskB = [];
    const samplesTaskC = [];

    // ==========================================
    // TASK A: Backfill design_revisions from molddesign.csv
    // ==========================================
    moldDesignData.forEach(csvRow => {
      const designCode = (csvRow.MoldDesignCode || csvRow.MoldDesignName)?.trim();
      if (!designCode || !drByCode.has(designCode)) return;

      const dbRow = drByCode.get(designCode);
      const update = { revision_id: dbRow.revision_id };
      let hasChanges = false;

      // Maps
      const newLen = parseNumeric(csvRow.CutlineX); // Note: CutlineX -> cutline_length
      const newWidth = parseNumeric(csvRow.CutlineY);
      const newCornerR = parseText(csvRow.CornerR);
      const newChamferC = parseText(csvRow.ChamferC, true); // Allow '0'
      const newPocketNum = parseText(csvRow.PocketNumbers);
      const newUnderDepth = parseNumeric(csvRow.UnderDepth);

      if (dbRow.cutline_length === null && newLen !== null) { update.cutline_length = newLen; hasChanges = true; }
      if (dbRow.cutline_width === null && newWidth !== null) { update.cutline_width = newWidth; hasChanges = true; }
      if (dbRow.corner_r === null && newCornerR !== null) { update.corner_r = newCornerR; hasChanges = true; }
      if (dbRow.chamfer_c === null && newChamferC !== null) { update.chamfer_c = newChamferC; hasChanges = true; }
      if (dbRow.pocket_numbers === null && newPocketNum !== null) { update.pocket_numbers = newPocketNum; hasChanges = true; }
      if (dbRow.under_depth === null && newUnderDepth !== null) { update.under_depth = newUnderDepth; hasChanges = true; }

      if (hasChanges) {
        updatesTaskA.push(update);
        // Apply changes to in-memory map for Task B chaining
        Object.assign(dbRow, update);
        if (samplesTaskA.length < 5) {
          samplesTaskA.push({ designCode, before: { ...dbRow }, after: update });
        }
      }
    });

    // ==========================================
    // TASK B: Backfill design_revisions from cutters.csv (Orphan cases)
    // ==========================================
    cuttersData.forEach(csvRow => {
      const moldDesignId = csvRow.MoldDesignID?.trim();
      const designCode = moldDesignMap.get(moldDesignId);
      if (!designCode || !drByCode.has(designCode)) return;

      const dbRow = drByCode.get(designCode);
      const update = { revision_id: dbRow.revision_id };
      let hasChanges = false;

      const newLen = parseNumeric(csvRow.CutlineLength);
      const newWidth = parseNumeric(csvRow.CutlineWidth);
      const newCornerR = parseText(csvRow.CutterCorner);
      const newChamferC = parseText(csvRow.CutterChamfer, true);

      // Note: dbRow might have been updated in Task A, so checking against the latest state
      if (dbRow.cutline_length === null && newLen !== null) { update.cutline_length = newLen; hasChanges = true; }
      if (dbRow.cutline_width === null && newWidth !== null) { update.cutline_width = newWidth; hasChanges = true; }
      if (dbRow.corner_r === null && newCornerR !== null) { update.corner_r = newCornerR; hasChanges = true; }
      if (dbRow.chamfer_c === null && newChamferC !== null) { update.chamfer_c = newChamferC; hasChanges = true; }

      if (hasChanges) {
        updatesTaskB.push(update);
        Object.assign(dbRow, update);
        if (samplesTaskB.length < 5) {
          samplesTaskB.push({ designCode, before: { ...dbRow }, after: update });
        }
      }
    });

    // ==========================================
    // TASK C: Backfill cutters physical dimensions
    // ==========================================
    cuttersData.forEach(csvRow => {
      const cutterNo = (csvRow.CutterCode || csvRow.CutterNo)?.trim();
      if (!cutterNo || !cutterByNo.has(cutterNo)) return;

      const dbRow = cutterByNo.get(cutterNo);
      const update = { cutter_id: dbRow.cutter_id };
      let hasChanges = false;

      const nLen = parseNumeric(csvRow.CutterLength);
      const nWidth = parseNumeric(csvRow.CutterWidth);
      const nHeight = parseNumeric(csvRow.CutterHeight);
      const nPostLen = parseNumeric(csvRow.PostCutLength);
      const nPostWidth = parseNumeric(csvRow.PostCutWidth);
      const nPitch = parseNumeric(csvRow.Pitch);
      const tCavity = parseText(csvRow.BladeCount);
      const tType = parseText(csvRow.CutterType);
      const tPlastic = parseText(csvRow.PlasticCutType);

      if (dbRow.cutter_length_mm === null && nLen !== null) { update.cutter_length_mm = nLen; hasChanges = true; }
      if (dbRow.cutter_width_mm === null && nWidth !== null) { update.cutter_width_mm = nWidth; hasChanges = true; }
      if (dbRow.cutter_height_mm === null && nHeight !== null) { update.cutter_height_mm = nHeight; hasChanges = true; }
      if (dbRow.post_cut_length === null && nPostLen !== null) { update.post_cut_length = nPostLen; hasChanges = true; }
      if (dbRow.post_cut_width === null && nPostWidth !== null) { update.post_cut_width = nPostWidth; hasChanges = true; }
      if (dbRow.pitch_mm === null && nPitch !== null) { update.pitch_mm = nPitch; hasChanges = true; }
      if (dbRow.cavity_count === null && tCavity !== null) { update.cavity_count = tCavity; hasChanges = true; }
      if (dbRow.cutter_type === null && tType !== null) { update.cutter_type = tType; hasChanges = true; }
      if (dbRow.plastic_cut_type === null && tPlastic !== null) { update.plastic_cut_type = tPlastic; hasChanges = true; }

      if (hasChanges) {
        updatesTaskC.push(update);
        if (samplesTaskC.length < 5) {
          samplesTaskC.push({ cutterNo, before: { ...dbRow }, after: update });
        }
      }
    });

    // ==========================================
    // EXECUTION & REPORTING
    // ==========================================
    console.log('\n================ REPORT ================');
    console.log(`Task A (MoldDesign -> design_revisions): ${updatesTaskA.length} updates queued.`);
    if (samplesTaskA.length) console.log(`Sample (first ${samplesTaskA.length}):`, JSON.stringify(samplesTaskA, null, 2));

    console.log(`\nTask B (Cutters -> design_revisions): ${updatesTaskB.length} updates queued.`);
    if (samplesTaskB.length) console.log(`Sample (first ${samplesTaskB.length}):`, JSON.stringify(samplesTaskB, null, 2));

    console.log(`\nTask C (Cutters -> cutters): ${updatesTaskC.length} updates queued.`);
    if (samplesTaskC.length) console.log(`Sample (first ${samplesTaskC.length}):`, JSON.stringify(samplesTaskC, null, 2));

    // Combine updates for design_revisions since Task A and Task B both target it.
    // We merge updates by ID to avoid conflicts in batch update.
    const combinedDesignRevisionsUpdatesMap = new Map();
    [...updatesTaskA, ...updatesTaskB].forEach(up => {
      if (!combinedDesignRevisionsUpdatesMap.has(up.revision_id)) {
        combinedDesignRevisionsUpdatesMap.set(up.revision_id, { ...up });
      } else {
        const existing = combinedDesignRevisionsUpdatesMap.get(up.revision_id);
        Object.assign(existing, up);
      }
    });
    const combinedDesignRevisionsUpdates = Array.from(combinedDesignRevisionsUpdatesMap.values());

    console.log(`\nTotal unique design_revisions to update: ${combinedDesignRevisionsUpdates.length}`);
    console.log(`Total unique cutters to update: ${updatesTaskC.length}`);

    if (isDryRun) {
      console.log('\nDRY RUN COMPLETED. Run with --execute to apply changes to the database.');
    } else {
      console.log('\nExecuting updates...');
      const drSuccess = await batchUpdate('design_revisions', combinedDesignRevisionsUpdates, 'revision_id');
      const cSuccess = await batchUpdate('cutters', updatesTaskC, 'cutter_id');
      console.log(`Successfully updated ${drSuccess}/${combinedDesignRevisionsUpdates.length} design_revisions.`);
      console.log(`Successfully updated ${cSuccess}/${updatesTaskC.length} cutters.`);
    }

  } catch (err) {
    console.error('Script encountered a fatal error:', err);
  }
}

main();
