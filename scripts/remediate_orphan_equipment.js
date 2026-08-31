const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const sb = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] ? cols[idx].trim() : '';
    });
    rows.push(obj);
  }
  return rows;
}

const parseNum = val => {
  if (!val) return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
};
const parseBool = val => val === 'TRUE' || val === '1';

async function fetchAllCompanies() {
  let all = [];
  let from = 0;
  let step = 1000;
  while (true) {
    const { data } = await sb.from('companies').select('company_id, legacy_id').range(from, from + step - 1);
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < step) break;
    from += step;
  }
  return all;
}

async function run() {
  const types = ['MOLD', 'CUTTER_INLINE', 'CUTTER_SEPARATE'];
  const { data: orphans } = await sb
    .from('equipment')
    .select('equipment_id, equipment_code, equipment_type, legacy_id')
    .in('equipment_type', types)
    .is('design_revision_id', null);

  const moldsCSV = parseCSV(fs.readFileSync('source_data/csv-access-data/molds.csv', 'utf8'));
  const trayCSV = parseCSV(fs.readFileSync('source_data/csv-access-data/tray.csv', 'utf8'));
  const moldDesignCSV = parseCSV(fs.readFileSync('source_data/csv-access-data/molddesign.csv', 'utf8'));
  const cuttersCSV = parseCSV(fs.readFileSync('source_data/csv-access-data/cutters.csv', 'utf8'));

  const moldByLegacyId = new Map();
  moldsCSV.forEach(m => {
    if (m.MoldID) {
      moldByLegacyId.set(`MOLD-${m.MoldID}`, m);
      moldByLegacyId.set(`M-${m.MoldID}`, m); 
    }
  });

  const cutterByLegacyId = new Map();
  cuttersCSV.forEach(c => {
    if (c.CutterID) {
      cutterByLegacyId.set(`CUTTER-${c.CutterID}`, c);
      cutterByLegacyId.set(`C-${c.CutterID}`, c);
    }
  });

  const trayById = new Map();
  trayCSV.forEach(t => {
    if (t.TrayID) trayById.set(t.TrayID, t);
  });

  const designById = new Map();
  moldDesignCSV.forEach(d => {
    if (d.MoldDesignID) designById.set(d.MoldDesignID, d);
  });

  const companies = await fetchAllCompanies();
  const companyByLegacyId = new Map();
  companies.forEach(c => {
    if (c.legacy_id) companyByLegacyId.set(c.legacy_id, c.company_id);
  });

  const newProducts = [];
  const newDesigns = [];
  const equipmentUpdates = [];
  
  const seenTrays = new Set();
  const seenDesigns = new Set();
  
  let tempProductIdCounter = 1;
  let tempDesignIdCounter = 1;
  const productLegacyToTempId = new Map();
  const designLegacyToTempId = new Map();

  const unresolvedOrphans = [];

  for (const orphan of orphans) {
    if (!orphan.legacy_id) {
        unresolvedOrphans.push({ code: orphan.equipment_code, reason: "No legacy_id in DB" });
        continue;
    }

    let trayId = null;
    let moldDesignId = null;
    let isDisposed = false;

    if (orphan.legacy_id.startsWith('C-') || orphan.legacy_id.startsWith('CUTTER-')) {
        const cutterRec = cutterByLegacyId.get(orphan.legacy_id);
        if (!cutterRec) {
            unresolvedOrphans.push({ code: orphan.equipment_code, reason: `Not found in cutters.csv (${orphan.legacy_id})` });
            continue;
        }
        moldDesignId = cutterRec.MoldDesignID;
        isDisposed = cutterRec.UsageStatus === '廃棄済';
    } else {
        const moldRec = moldByLegacyId.get(orphan.legacy_id);
        if (!moldRec) {
            unresolvedOrphans.push({ code: orphan.equipment_code, reason: `Not found in molds.csv (${orphan.legacy_id})` });
            continue;
        }
        trayId = moldRec.TrayID;
        moldDesignId = moldRec.MoldDesignID;
        isDisposed = moldRec.MoldDisposing === '廃棄済';
    }
    
    if (!trayId && moldDesignId) {
        const des = designById.get(moldDesignId);
        if (des && des.TrayID) trayId = des.TrayID;
    }

    if (!trayId) {
        unresolvedOrphans.push({ code: orphan.equipment_code, reason: `TrayID is empty in Access (Legacy orphaned)` });
        continue;
    }

    const trayRec = trayById.get(trayId);
    if (!trayRec) {
        unresolvedOrphans.push({ code: orphan.equipment_code, reason: `TrayID ${trayId} not found in tray.csv` });
        continue;
    }

    let tempProdId;
    if (!seenTrays.has(trayId)) {
      seenTrays.add(trayId);
      tempProdId = `TEMP_PROD_${tempProductIdCounter++}`;
      productLegacyToTempId.set(trayId, tempProdId);
      
      const compId = companyByLegacyId.get(`CUST-${trayRec.CustomerID}`);
      const prodStatus = isDisposed ? 'INACTIVE' : 'ACTIVE';

      // Rule 2: Fix product_name_internal empty issue
      const trayName = trayRec.TrayName || trayRec.CustomerTrayName || trayRec.TrayCode || `TRAY-${trayId}`;
      const code = trayRec.TrayCode || trayRec.TrayName || `TRAY-${trayId}`;

      newProducts.push({
        _temp_id: tempProdId,
        product_code: code,
        product_name_internal: trayName,
        product_name: trayRec.CustomerTrayName || trayName,
        company_id: compId,
        product_status: prodStatus,
        legacy_id: `TRAY-${trayId}`
      });
    } else {
      tempProdId = productLegacyToTempId.get(trayId);
    }
    
    let tempDesId = null;
    if (moldDesignId) {
      const desRec = designById.get(moldDesignId);
      if (desRec) {
        if (!seenDesigns.has(moldDesignId)) {
          seenDesigns.add(moldDesignId);
          tempDesId = `TEMP_DES_${tempDesignIdCounter++}`;
          designLegacyToTempId.set(moldDesignId, tempDesId);
          
          const compId = companyByLegacyId.get(`CUST-${desRec.CustomerID}`);
          
          // Rule 3: Do not assign design_code = equipment_code blindly
          const desName = desRec.MoldDesignCode || desRec.MoldDesignName || null;
          const isPrototype = desName && (desName.includes('試作') || desName.includes('P試作'));
          const category = isPrototype ? 'PROTOTYPE_POCKET' : 'MASS_PRODUCTION';
          const designStatus = isDisposed ? 'LEGACY_MIGRATED_DISPOSED' : 'LEGACY_MIGRATED';

          newDesigns.push({
            _temp_id: tempDesId,
            _temp_product_id: tempProdId,
            design_code: desName || `DES-${moldDesignId}`,
            company_id: compId || null,
            status: designStatus,
            design_category: category,
            cutline_length: parseNum(desRec.CutlineX),
            cutline_width: parseNum(desRec.CutlineY),
            corner_r: desRec.CornerR || null,
            chamfer_c: desRec.ChamferC || null,
            design_length: parseNum(desRec.MoldDesignLength),
            design_width: parseNum(desRec.MoldDesignWidth),
            design_height: parseNum(desRec.MoldDesignHeight),
            design_depth: parseNum(desRec.MoldDesignDepth),
            pocket_numbers: desRec.PocketNumbers ? parseInt(desRec.PocketNumbers) : null,
            cavity_count: desRec.PieceCount ? parseInt(desRec.PieceCount) : null,
            machine_feed_pitch_mm: parseNum(desRec.Pitch),
            has_separate_cutter: parseBool(desRec.SeparateCutter),
            legacy_id: `DESIGN-${moldDesignId}`,
            legacy_specs: { _note: "Backfilled from Access molddesign.csv" }
          });
        } else {
          tempDesId = designLegacyToTempId.get(moldDesignId);
        }
      } else {
        unresolvedOrphans.push({ code: orphan.equipment_code, reason: `MoldDesignID ${moldDesignId} not found in molddesign.csv` });
      }
    } else {
      unresolvedOrphans.push({ code: orphan.equipment_code, reason: `MoldDesignID is empty in Access` });
    }
    
    if (tempDesId) {
      equipmentUpdates.push({
        equipment_id: orphan.equipment_id,
        equipment_code: orphan.equipment_code,
        _temp_design_id: tempDesId,
        legacy_id: orphan.legacy_id
      });
    }
  }

  const dryRunOutput = {
    summary: {
      total_orphans_found: orphans.length,
      unresolved_orphans_count: unresolvedOrphans.length,
      products_to_insert: newProducts.length,
      design_revisions_to_insert: newDesigns.length,
      equipment_records_to_update: equipmentUpdates.length,
    },
    unresolved_reasons_sample: unresolvedOrphans,
    products_preview: newProducts.slice(0, 3),
    design_revisions_preview: newDesigns.slice(0, 3),
    equipment_updates_preview: equipmentUpdates.slice(0, 3)
  };

  fs.writeFileSync('scratch/dryrun_remediation.json', JSON.stringify(dryRunOutput, null, 2), 'utf8');
}

run().catch(console.error);
