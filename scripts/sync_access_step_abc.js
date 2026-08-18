/**
 * sync_access_step_abc.js
 * =============================================================
 * Đồng bộ Access CSV → Supabase DB
 * 
 * Step A: Design Revisions (insert mới + gắn product_id thiếu)
 * Step B: Equipment (insert mới + verify phân loại phụ trợ)
 * Step C: Jobs (insert mới theo cấu trúc phẳng NextGen)
 * 
 * Modes: --dry-run (default) | --commit
 * Usage: node scripts/sync_access_step_abc.js [--commit]
 * =============================================================
 */

const fs = require('fs');
const path = require('path');

const COMMIT_MODE = process.argv.includes('--commit');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const env = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const CSV_DIR = path.join(__dirname, '..', 'source_data', 'csv-access-data');

// ========== UTILITIES ==========

function normalize(str) {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/[-\s_.]/g, '');
}

function parseCSV(filename) {
  const filePath = path.join(CSV_DIR, filename);
  if (!fs.existsSync(filePath)) { console.warn(`  [WARN] File not found: ${filename}`); return []; }
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^['"﻿\uFEFF]|['"\r]$/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = []; let cur = ''; let inQuotes = false;
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === '"') inQuotes = !inQuotes;
      else if (ch === ',' && !inQuotes) { values.push(cur.trim().replace(/^"|"$/g, '').replace(/\r$/, '')); cur = ''; }
      else cur += ch;
    }
    values.push(cur.trim().replace(/^"|"$/g, '').replace(/\r$/, ''));
    const row = {};
    headers.forEach((h, idx) => { row[h] = (values[idx] !== undefined && values[idx] !== '') ? values[idx] : null; });
    rows.push(row);
  }
  return rows;
}

async function fetchAllRows(table, select = '*') {
  let allRows = []; let from = 0; const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase.from(table).select(select).range(from, from + pageSize - 1);
    if (error) { console.warn(`  [WARN] Error fetching ${table}: ${error.message}`); return allRows; }
    if (!data || data.length === 0) break;
    allRows = allRows.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return allRows;
}

function parseDate(dateStr) {
  if (!dateStr) return null;
  // Handle M/D/YYYY format from Access
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) return `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
  // Handle YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return dateStr.slice(0, 10);
  return null;
}

function parseNum(val) {
  if (!val) return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function parseBool(val) {
  if (!val) return false;
  return val === 'TRUE' || val === 'true' || val === '1' || val === 'Yes';
}

// Classify equipment type from mold name/code
function classifyEquipmentType(name, code) {
  const n = (name || '').toUpperCase();
  const c = (code || '').toUpperCase();
  if (/^WB[-\s]|WATER/.test(n) || /^WB/.test(c)) return 'WATER_BASE';
  if (/^PB[-\s]|PRESSURE/.test(n) || /^PB/.test(c)) return 'PRESSURE_BASE';
  if (/^RDF|FRAME|JIG/.test(n) || /^RDF/.test(c)) return 'FRAME';
  if (/^MZT|STACKING/.test(n) || /^MZT/.test(c)) return 'STACKING';
  if (/^PLATE/.test(n)) return 'FRAME'; // Plates are typically frames/jigs
  return 'MOLD';
}

// ========== STEP A: DESIGN REVISIONS ==========

async function stepA(dbDesigns, dbProducts) {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  STEP A: THIẾT KẾ (molddesign.csv → design_revisions)  ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  const designsCSV = parseCSV('molddesign.csv');

  // Build lookup maps
  const dbDesignByLegacyId = new Map();
  dbDesigns.forEach(d => { if (d.legacy_id) dbDesignByLegacyId.set(String(d.legacy_id), d); });

  const dbProductByLegacyId = new Map();
  dbProducts.forEach(p => { if (p.legacy_id) dbProductByLegacyId.set(String(p.legacy_id), p); });

  const toInsert = [];
  const toFixProductId = [];

  for (const csv of designsCSV) {
    const csvId = csv.MoldDesignID;
    // Skip garbage rows (MoldDesignID should be a number)
    if (!csvId || isNaN(parseInt(csvId))) continue;

    const legacyId = `DESIGN-${csvId}`;
    const existing = dbDesignByLegacyId.get(legacyId);

    if (existing) {
      // Check if product_id is missing and we can resolve it
      if (!existing.product_id && csv.TrayID) {
        const product = dbProductByLegacyId.get(`TRAY-${csv.TrayID}`);
        if (product) {
          toFixProductId.push({
            revision_id: existing.revision_id,
            product_id: product.product_id,
            design_code: existing.design_code,
            trayId: csv.TrayID
          });
        }
      }
    } else {
      // New design — resolve product_id via TrayID
      let productId = null;
      let companyId = null;
      if (csv.TrayID) {
        const product = dbProductByLegacyId.get(`TRAY-${csv.TrayID}`);
        if (product) {
          productId = product.product_id;
          companyId = product.company_id;
        }
      }

      const designCode = (csv.MoldDesignCode || csv.MoldDesignName || '').trim();
      if (!designCode) continue; // Skip rows without a design code

      toInsert.push({
        design_code: designCode,
        product_id: productId,
        company_id: companyId,
        cutline_length: parseNum(csv.CutlineX),
        cutline_width: parseNum(csv.CutlineY),
        corner_r: csv.CornerR || null,
        chamfer_c: csv.ChamferC || null,
        design_length: parseNum(csv.MoldDesignLength),
        design_width: parseNum(csv.MoldDesignWidth),
        design_height: parseNum(csv.MoldDesignHeight),
        design_depth: parseNum(csv.MoldDesignDepth),
        design_weight: csv.MoldDesignWeight || null,
        pocket_numbers: csv.PocketNumbers ? parseInt(csv.PocketNumbers) : null,
        cavity_count: csv.PieceCount ? parseInt(csv.PieceCount) : null,
        machine_feed_pitch_mm: parseNum(csv.Pitch),
        orientation: csv.MoldOrientation || null,
        setup_type: csv.MoldSetupType || null,
        plug_type: csv.Plug === 'TRUE' || csv.Plug === '1' ? 'OWNED' : 'NONE',
        has_separate_cutter: parseBool(csv.SeparateCutter),
        plastic_type_designed: csv.DesignForPlasticType || null,
        customer_tray_name: csv.CustomerTrayName || null,
        customer_drawing_no: csv.CustomerDrawingNo || null,
        customer_equipment_no: csv.CustomerEquipmentNo || null,
        text_content: csv.TextContent || null,
        data_input_date: parseDate(csv.DataInput),
        design_date: parseDate(csv.DesignCreatedDate),
        legacy_id: legacyId,
        legacy_specs: csv.VersionNote ? { version_note: csv.VersionNote } : null
      });
    }
  }

  console.log(`  📝 Thiết kế cần insert MỚI: ${toInsert.length}`);
  console.log(`  🔗 Thiết kế cần gắn product_id: ${toFixProductId.length}`);

  if (toInsert.length > 0) {
    console.log(`  Mẫu insert:`, toInsert.slice(0, 3).map(d => `${d.design_code} (product=${d.product_id ? '✓' : '✗'})`).join(', '));
  }
  if (toFixProductId.length > 0) {
    console.log(`  Mẫu fix:`, toFixProductId.slice(0, 3).map(d => `${d.design_code} → TRAY-${d.trayId}`).join(', '));
  }

  if (COMMIT_MODE) {
    // Insert new designs in batches
    if (toInsert.length > 0) {
      console.log(`  ⏳ Inserting ${toInsert.length} new design_revisions...`);
      for (let i = 0; i < toInsert.length; i += 50) {
        const batch = toInsert.slice(i, i + 50);
        const { error } = await supabase.from('design_revisions').insert(batch);
        if (error) console.error(`  ❌ Insert batch ${i} error:`, error.message);
        else console.log(`  ✓ Batch ${i}-${i + batch.length} inserted`);
      }
    }

    // Fix missing product_id
    if (toFixProductId.length > 0) {
      console.log(`  ⏳ Fixing ${toFixProductId.length} missing product_id links...`);
      for (const fix of toFixProductId) {
        const { error } = await supabase.from('design_revisions')
          .update({ product_id: fix.product_id })
          .eq('revision_id', fix.revision_id);
        if (error) console.error(`  ❌ Fix ${fix.design_code} error:`, error.message);
      }
      console.log(`  ✓ Fixed ${toFixProductId.length} product_id links`);
    }
  }

  return { inserted: toInsert.length, fixed: toFixProductId.length };
}

// ========== STEP B: EQUIPMENT ==========

async function stepB(dbEquipment, dbDesigns, dbProducts) {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  STEP B: THIẾT BỊ (molds.csv → equipment)              ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  const moldsCSV = parseCSV('molds.csv');

  // Build lookup
  const dbEquipByLegacyId = new Map();
  const dbEquipByNormCode = new Map();
  const dbEquipByDisplayName = new Map();
  dbEquipment.forEach(e => {
    if (e.legacy_id) dbEquipByLegacyId.set(String(e.legacy_id), e);
    if (e.equipment_code) dbEquipByNormCode.set(normalize(e.equipment_code), e);
    if (e.display_name) dbEquipByDisplayName.set(e.display_name.toLowerCase(), e);
  });

  const dbDesignByLegacyId = new Map();
  dbDesigns.forEach(d => { if (d.legacy_id) dbDesignByLegacyId.set(String(d.legacy_id), d); });

  const dbProductByLegacyId = new Map();
  dbProducts.forEach(p => { if (p.legacy_id) dbProductByLegacyId.set(String(p.legacy_id), p); });

  const toInsert = [];
  const misclassified = [];

  for (const csv of moldsCSV) {
    const csvId = csv.MoldID;
    if (!csvId || isNaN(parseInt(csvId))) continue;

    const legacyId = `MOLD-${csvId}`;
    const csvName = (csv.MoldName || '').trim();
    const csvCode = (csv.MoldCode || '').trim();

    // Multi-key matching
    const existing = dbEquipByLegacyId.get(legacyId)
      || dbEquipByDisplayName.get(csvName.toLowerCase())
      || dbEquipByNormCode.get(normalize(csvCode))
      || dbEquipByNormCode.get(normalize(csvName));

    if (existing) {
      // Verify equipment_type classification for auxiliary equipment
      const expectedType = classifyEquipmentType(csvName, csvCode);
      if (expectedType !== 'MOLD' && existing.equipment_type === 'MOLD') {
        misclassified.push({
          equipment_id: existing.equipment_id,
          equipment_code: existing.equipment_code,
          currentType: existing.equipment_type,
          shouldBe: expectedType,
          csvName
        });
      }
    } else {
      // Resolve design_revision and product via MoldDesignID
      let designRevisionId = null;
      let productId = null;
      let companyId = null;

      if (csv.MoldDesignID) {
        const design = dbDesignByLegacyId.get(`DESIGN-${csv.MoldDesignID}`);
        if (design) {
          designRevisionId = design.revision_id;
          productId = design.product_id;
        }
      }
      if (!productId && csv.TrayID) {
        const product = dbProductByLegacyId.get(`TRAY-${csv.TrayID}`);
        if (product) {
          productId = product.product_id;
          companyId = product.company_id;
        }
      }

      const equipType = classifyEquipmentType(csvName, csvCode);

      toInsert.push({
        equipment_code: csvName || csvCode, // Use MoldName as code (has hyphens)
        display_name: csvName || csvCode,
        equipment_type: equipType,
        actual_length_mm: csv.MoldLengthModified || null,
        actual_width_mm: csv.MoldWidthModified || null,
        actual_height_mm: csv.MoldHeightModified || null,
        actual_weight: csv.MoldWeight || null,
        company_id: companyId,
        design_revision_id: designRevisionId,
        usage_status: csv.MoldUsageStatus || 'STORAGE',
        device_status: csv.DeviceStatus || 'NORMAL',
        entry_date: parseDate(csv.MoldEntry),
        notes: csv.MoldNotes || null,
        legacy_id: legacyId
      });
    }
  }

  console.log(`  📦 Thiết bị cần insert MỚI: ${toInsert.length}`);
  console.log(`  ⚠️ Thiết bị phân loại sai (MOLD → nên là WB/PB/Frame): ${misclassified.length}`);

  if (toInsert.length > 0) {
    console.log(`  Mẫu insert:`, toInsert.map(e => `${e.equipment_code}(${e.equipment_type})`).join(', '));
  }
  if (misclassified.length > 0) {
    console.log(`  Mẫu sai phân loại:`, misclassified.slice(0, 5).map(e => `${e.equipment_code}: ${e.currentType}→${e.shouldBe}`).join(', '));
  }

  if (COMMIT_MODE) {
    if (toInsert.length > 0) {
      console.log(`  ⏳ Inserting ${toInsert.length} new equipment...`);
      const { error } = await supabase.from('equipment').insert(toInsert);
      if (error) console.error(`  ❌ Insert error:`, error.message);
      else console.log(`  ✓ Inserted ${toInsert.length} equipment`);
    }

    if (misclassified.length > 0) {
      console.log(`  ⏳ Fixing ${misclassified.length} misclassified equipment types...`);
      for (const fix of misclassified) {
        const { error } = await supabase.from('equipment')
          .update({ equipment_type: fix.shouldBe })
          .eq('equipment_id', fix.equipment_id);
        if (error) console.error(`  ❌ Fix ${fix.equipment_code} error:`, error.message);
      }
      console.log(`  ✓ Fixed ${misclassified.length} equipment types`);
    }
  }

  return { inserted: toInsert.length, misclassified: misclassified.length };
}

// ========== STEP C: JOBS ==========

async function stepC(dbDesigns, dbEquipment, dbProducts, dbJobs) {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  STEP C: CHỈ THỊ (jobs.csv → jobs) [Flat NextGen]      ║');
  console.log('║  Access: Design→Mold→Job (chuỗi)                       ║');
  console.log('║  NextGen: Job→design+equip+product+company (phẳng)      ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

  const jobsCSV = parseCSV('jobs.csv');

  // Build lookups
  const dbJobByLegacyId = new Map();
  const dbJobByCode = new Map();
  dbJobs.forEach(j => {
    if (j.legacy_id) dbJobByLegacyId.set(String(j.legacy_id), j);
    if (j.job_code) dbJobByCode.set(j.job_code.toLowerCase(), j);
  });

  const dbDesignByLegacyId = new Map();
  dbDesigns.forEach(d => { if (d.legacy_id) dbDesignByLegacyId.set(String(d.legacy_id), d); });

  const dbEquipByLegacyId = new Map();
  dbEquipment.forEach(e => { if (e.legacy_id) dbEquipByLegacyId.set(String(e.legacy_id), e); });

  const dbProductByLegacyId = new Map();
  dbProducts.forEach(p => { if (p.legacy_id) dbProductByLegacyId.set(String(p.legacy_id), p); });

  // Load employees & companies for responsible_id / outsource_company
  const dbEmployees = await fetchAllRows('employees', 'employee_id, legacy_id');
  const dbEmpByLegacyId = new Map();
  dbEmployees.forEach(e => { if (e.legacy_id) dbEmpByLegacyId.set(String(e.legacy_id), e); });

  const dbCompanies = await fetchAllRows('companies', 'company_id, legacy_id');
  const dbCompanyByLegacyId = new Map();
  dbCompanies.forEach(c => { if (c.legacy_id) dbCompanyByLegacyId.set(String(c.legacy_id), c); });

  const toInsert = [];
  const toFixLinks = [];
  const unresolvedJobs = [];

  // Map Access ReleasePeriod → NextGen job_category
  function mapJobCategory(releasePeriod) {
    if (!releasePeriod) return 'OTHER';
    const rp = releasePeriod.trim();
    if (rp.includes('新規金型') || rp.includes('新規')) return 'MOLD_NEW';
    if (rp.includes('修理') || rp.includes('追加工')) return 'MOLD_MODIFY';
    if (rp.includes('再版') || rp.includes('再生産')) return 'MOLD_MODIFY';
    return 'OTHER';
  }

  for (const csv of jobsCSV) {
    const csvId = csv.JobID;
    if (!csvId || isNaN(parseInt(csvId))) continue;

    const legacyId = String(csvId);
    const jobCode = (csv.JobCode || csv.JobName || `JOB-${csvId}`).trim();

    const existing = dbJobByLegacyId.get(legacyId)
      || dbJobByLegacyId.get(`JOB-${csvId}`)
      || dbJobByCode.get(jobCode.toLowerCase());

    if (existing) {
      // Check if existing job is missing links
      if (!existing.equipment_id && csv.MoldID) {
        const equip = dbEquipByLegacyId.get(`MOLD-${csv.MoldID}`);
        if (equip) {
          toFixLinks.push({ job_id: existing.job_id, equipment_id: equip.equipment_id, job_code: existing.job_code });
        }
      }
      continue;
    }

    // === Resolve Access chain → NextGen flat ===
    // 1. Resolve design_revision_id via MoldDesignID
    let designRevisionId = null;
    let productId = null;
    let companyId = null;

    if (csv.MoldDesignID) {
      const design = dbDesignByLegacyId.get(`DESIGN-${csv.MoldDesignID}`);
      if (design) {
        designRevisionId = design.revision_id;
        productId = design.product_id;
        // Get company_id from design if available
        if (design.company_id) companyId = design.company_id;
      }
    }

    // 2. Resolve equipment_id via MoldID
    let equipmentId = null;
    if (csv.MoldID) {
      const equip = dbEquipByLegacyId.get(`MOLD-${csv.MoldID}`);
      if (equip) {
        equipmentId = equip.equipment_id;
        // If company_id not yet resolved, try from equipment
        if (!companyId && equip.company_id) companyId = equip.company_id;
      }
    }

    // 3. Resolve company_id via MachiningCustomerID (if still null)
    if (!companyId && csv.MachiningCustomerID) {
      const comp = dbCompanyByLegacyId.get(`COMP-${csv.MachiningCustomerID}`);
      if (comp) companyId = comp.company_id;
    }

    // 4. Resolve responsible_id
    let responsibleId = null;
    if (csv.ResponsiblePersonID) {
      const emp = dbEmpByLegacyId.get(String(csv.ResponsiblePersonID));
      if (emp) responsibleId = emp.employee_id;
    }

    // 5. Resolve outsource_company
    let outsourceCompany = null;
    if (csv.OutsourcingID) {
      const comp = dbCompanyByLegacyId.get(`COMP-${csv.OutsourcingID}`);
      if (comp) outsourceCompany = comp.company_id;
    }

    if (!designRevisionId && !equipmentId) {
      unresolvedJobs.push({ csvId, jobCode, moldDesignId: csv.MoldDesignID, moldId: csv.MoldID });
      continue; // Skip jobs that can't link to anything
    }

    toInsert.push({
      job_code: jobCode,
      job_name: csv.JobName || jobCode,
      job_category: mapJobCategory(csv.ReleasePeriod),
      job_status: csv.Approved === 'TRUE' ? 'approved' : 'draft',
      design_revision_id: designRevisionId,
      equipment_id: equipmentId,
      product_id: productId,
      company_id: companyId,
      responsible_id: responsibleId,
      outsource_company: outsourceCompany,
      start_date: parseDate(csv.JobStartDate),
      ship_date: parseDate(csv.MoldShippingDate),
      mold_deadline: parseDate(csv.DeliveryDeadline),
      deadline: parseDate(csv.DeliveryDeadline),
      approved: parseBool(csv.Approved),
      quantity: parseNum(csv.JobQuantity),
      has_plug: parseBool(csv.SeparateCutter) ? null : null, // Need more logic
      separate_cutter: parseBool(csv.SeparateCutter),
      release_type: csv.ReleasePeriod || null,
      year_period: csv.YearPeriod ? parseInt(csv.YearPeriod) : null,
      month_period: csv.MonthPeriod ? parseInt(csv.MonthPeriod) : null,
      notes: csv.JobNote || null,
      legacy_id: legacyId
    });
  }

  console.log(`  📋 Job cần insert MỚI: ${toInsert.length}`);
  console.log(`  🔗 Job cần bổ sung equipment_id: ${toFixLinks.length}`);
  console.log(`  ⚠️ Job không thể resolve (thiếu design & equipment): ${unresolvedJobs.length}`);

  if (toInsert.length > 0) {
    console.log(`  Mẫu insert:`, toInsert.slice(0, 5).map(j =>
      `${j.job_code}(design=${j.design_revision_id ? '✓' : '✗'}, equip=${j.equipment_id ? '✓' : '✗'}, product=${j.product_id ? '✓' : '✗'})`
    ).join(', '));
  }
  if (unresolvedJobs.length > 0) {
    console.log(`  Mẫu unresolved:`, unresolvedJobs.slice(0, 5).map(j => `${j.jobCode}(design=${j.moldDesignId},mold=${j.moldId})`).join(', '));
  }

  if (COMMIT_MODE) {
    if (toInsert.length > 0) {
      console.log(`  ⏳ Inserting ${toInsert.length} new jobs...`);
      for (let i = 0; i < toInsert.length; i += 50) {
        const batch = toInsert.slice(i, i + 50);
        const { error } = await supabase.from('jobs').insert(batch);
        if (error) console.error(`  ❌ Insert batch ${i} error:`, error.message);
        else console.log(`  ✓ Batch ${i}-${i + batch.length} inserted`);
      }
    }

    if (toFixLinks.length > 0) {
      console.log(`  ⏳ Fixing ${toFixLinks.length} missing equipment_id links...`);
      for (const fix of toFixLinks) {
        const { error } = await supabase.from('jobs')
          .update({ equipment_id: fix.equipment_id })
          .eq('job_id', fix.job_id);
        if (error) console.error(`  ❌ Fix ${fix.job_code} error:`, error.message);
      }
      console.log(`  ✓ Fixed ${toFixLinks.length} equipment links`);
    }
  }

  return { inserted: toInsert.length, fixedLinks: toFixLinks.length, unresolved: unresolvedJobs.length };
}

// ========== MAIN ==========

async function main() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`🔄 SYNC ACCESS → SUPABASE: STEPS A + B + C`);
  console.log(`   Mode: ${COMMIT_MODE ? '🔴 COMMIT (Ghi vào DB)' : '🟡 DRY-RUN (Chỉ phân tích)'}`);
  console.log('════════════════════════════════════════════════════════════════');

  // Pre-fetch all needed data with pagination
  console.log('\n⏳ Loading DB data...');
  const dbDesigns = await fetchAllRows('design_revisions', 'revision_id, design_code, legacy_id, product_id, company_id');
  console.log(`  design_revisions: ${dbDesigns.length}`);
  const dbEquipment = await fetchAllRows('equipment', 'equipment_id, equipment_code, display_name, equipment_type, legacy_id, company_id');
  console.log(`  equipment: ${dbEquipment.length}`);
  const dbProducts = await fetchAllRows('products', 'product_id, product_code, product_name_internal, legacy_id, company_id');
  console.log(`  products: ${dbProducts.length}`);
  const dbJobs = await fetchAllRows('jobs', 'job_id, job_code, job_name, legacy_id, design_revision_id, equipment_id');
  console.log(`  jobs: ${dbJobs.length}`);

  const resultA = await stepA(dbDesigns, dbProducts);
  const resultB = await stepB(dbEquipment, dbDesigns, dbProducts);
  const resultC = await stepC(dbDesigns, dbEquipment, dbProducts, dbJobs);

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('📊 TỔNG KẾT:');
  console.log(`  Step A (Thiết kế): ${resultA.inserted} mới, ${resultA.fixed} gắn product_id`);
  console.log(`  Step B (Thiết bị): ${resultB.inserted} mới, ${resultB.misclassified} sửa phân loại`);
  console.log(`  Step C (Chỉ thị):  ${resultC.inserted} mới, ${resultC.fixedLinks} gắn equipment, ${resultC.unresolved} unresolved`);
  console.log(`  Mode: ${COMMIT_MODE ? '✅ ĐÃ COMMIT VÀO DB' : '⚡ DRY-RUN — Chạy lại với --commit để ghi vào DB'}`);
  console.log('════════════════════════════════════════════════════════════════');
}

main().catch(err => { console.error('Sync failed:', err); process.exit(1); });
