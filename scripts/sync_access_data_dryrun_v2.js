/**
 * sync_access_data_dryrun_v2.js
 * =============================================================
 * Corrected Dry-Run: Đối soát toàn diện CSV Access ↔ Supabase DB
 * 
 * Fixes applied:
 *  1. Full pagination (fetch ALL rows, not just 1000)
 *  2. Normalized matching (remove hyphens, spaces for code comparison)
 *  3. Multi-key matching: legacy_id, equipment_code, display_name
 *  4. Auxiliary equipment detection from molds.csv (WB/PB/Frame)
 *  5. Design-first linkage verification
 *  6. NO company/product import — only verify linkage
 * =============================================================
 */

const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
  });
}

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) { console.error('Missing Supabase credentials'); process.exit(1); }
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const values = [];
    let cur = '';
    let inQuotes = false;

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { values.push(cur.trim().replace(/^"|"$/g, '').replace(/\r$/, '')); cur = ''; }
      else { cur += char; }
    }
    values.push(cur.trim().replace(/^"|"$/g, '').replace(/\r$/, ''));

    const row = {};
    headers.forEach((h, idx) => { row[h] = (values[idx] !== undefined && values[idx] !== '') ? values[idx] : null; });
    rows.push(row);
  }
  return rows;
}

async function fetchAllRows(table, select = '*') {
  let allRows = [];
  let from = 0;
  const pageSize = 1000;
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

// ========== MAIN ANALYSIS ==========

async function runAnalysis() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log('🔍 DRY-RUN V2: PHÂN TÍCH ĐỐI SOÁT DỮ LIỆU CSV ACCESS (CHÍNH XÁC)');
  console.log('════════════════════════════════════════════════════════════════\n');

  const report = { analyzedAt: new Date().toISOString(), modules: {} };

  // ───────────────────────────────────────────────
  // 1. DESIGN REVISIONS (molddesign.csv ↔ design_revisions)
  // ───────────────────────────────────────────────
  console.log('━━━ 1. THIẾT KẾ (molddesign.csv ↔ design_revisions) ━━━');
  const designsCSV = parseCSV('molddesign.csv');
  const dbDesigns = await fetchAllRows('design_revisions', 'revision_id, product_id, design_code, legacy_id');

  // Build lookup maps
  const dbDesignByLegacyId = new Map();
  const dbDesignByCode = new Map();
  dbDesigns.forEach(d => {
    if (d.legacy_id) dbDesignByLegacyId.set(String(d.legacy_id), d);
    if (d.design_code) dbDesignByCode.set(normalize(d.design_code), d);
  });

  let designMatched = 0, designNew = 0, designMatchedNoProduct = 0;
  const unmatchedDesigns = [];

  designsCSV.forEach(csv => {
    const csvId = csv.MoldDesignID;
    const csvCode = csv.MoldDesignCode || csv.MoldDesignName;

    const match = dbDesignByLegacyId.get(String(csvId))
      || (csvCode ? dbDesignByCode.get(normalize(csvCode)) : null);

    if (match) {
      designMatched++;
      if (!match.product_id) designMatchedNoProduct++;
    } else {
      designNew++;
      if (unmatchedDesigns.length < 10) unmatchedDesigns.push({ id: csvId, code: csvCode, trayId: csv.TrayID });
    }
  });

  report.modules.designRevisions = {
    csvRows: designsCSV.length, dbRows: dbDesigns.length,
    matched: designMatched, matchedMissingProduct: designMatchedNoProduct,
    newToInsert: designNew, sampleUnmatched: unmatchedDesigns
  };
  console.log(`  CSV: ${designsCSV.length} | DB: ${dbDesigns.length}`);
  console.log(`  ✓ Đã khớp: ${designMatched} (trong đó ${designMatchedNoProduct} chưa gắn product_id)`);
  console.log(`  ⊕ Cần thêm mới: ${designNew}`);
  if (unmatchedDesigns.length > 0) {
    console.log(`  Mẫu chưa khớp (10 đầu):`, unmatchedDesigns.map(u => `${u.code}(ID=${u.id})`).join(', '));
  }

  // ───────────────────────────────────────────────
  // 2. EQUIPMENT / KHUÔN (molds.csv ↔ equipment)
  // ───────────────────────────────────────────────
  console.log('\n━━━ 2. THIẾT BỊ: KHUÔN (molds.csv ↔ equipment) ━━━');
  const moldsCSV = parseCSV('molds.csv');
  const dbEquipment = await fetchAllRows('equipment', 'equipment_id, equipment_code, display_name, equipment_type, legacy_id, company_id');

  console.log(`  DB equipment total: ${dbEquipment.length} (fetched with pagination)`);

  // Build multi-key lookup for equipment
  const dbEquipByLegacyId = new Map();
  const dbEquipByCode = new Map();
  const dbEquipByNormCode = new Map();
  const dbEquipByDisplayName = new Map();

  dbEquipment.forEach(e => {
    if (e.legacy_id) dbEquipByLegacyId.set(String(e.legacy_id).toLowerCase(), e);
    if (e.equipment_code) {
      dbEquipByCode.set(e.equipment_code.toLowerCase(), e);
      dbEquipByNormCode.set(normalize(e.equipment_code), e);
    }
    if (e.display_name) dbEquipByDisplayName.set(e.display_name.toLowerCase(), e);
  });

  // Classify molds.csv entries: real molds vs auxiliary equipment
  let moldMatched = 0, moldNew = 0, moldAuxiliary = 0;
  const auxPatterns = [/^WB[-\s]/i, /^PB[-\s]/i, /^RDF/i, /WATER/i, /PRESSURE/i, /BASE/i, /FRAME/i, /JIG/i, /STACKING/i, /^MZT/i];
  const unmatchedMolds = [];
  const auxiliaryItems = [];

  moldsCSV.forEach(csv => {
    const csvId = csv.MoldID;
    const csvName = (csv.MoldName || '').trim();
    const csvCode = (csv.MoldCode || '').trim();

    // Check if this is actually auxiliary equipment
    const isAux = auxPatterns.some(p => p.test(csvName) || p.test(csvCode));
    if (isAux) {
      moldAuxiliary++;
      if (auxiliaryItems.length < 20) auxiliaryItems.push({ id: csvId, name: csvName, code: csvCode, type: 'AUXILIARY' });
    }

    // Multi-key matching
    const match = dbEquipByLegacyId.get(`mold-${csvId}`)
      || dbEquipByLegacyId.get(String(csvId))
      || dbEquipByCode.get(csvName.toLowerCase())
      || dbEquipByDisplayName.get(csvName.toLowerCase())
      || dbEquipByNormCode.get(normalize(csvCode))
      || dbEquipByNormCode.get(normalize(csvName));

    if (match) {
      moldMatched++;
    } else {
      moldNew++;
      if (unmatchedMolds.length < 10) unmatchedMolds.push({ id: csvId, name: csvName, code: csvCode, isAux });
    }
  });

  report.modules.molds = {
    csvRows: moldsCSV.length, matched: moldMatched, newToInsert: moldNew,
    auxiliaryDetected: moldAuxiliary,
    sampleUnmatched: unmatchedMolds, sampleAuxiliary: auxiliaryItems
  };
  console.log(`  CSV: ${moldsCSV.length} | Đã khớp: ${moldMatched} | Cần thêm: ${moldNew}`);
  console.log(`  🔧 Thiết bị phụ trợ phát hiện trong molds.csv: ${moldAuxiliary} (WB/PB/Frame/Jig/Stacking...)`);
  if (auxiliaryItems.length > 0) {
    console.log(`  Mẫu thiết bị phụ trợ:`, auxiliaryItems.slice(0, 5).map(a => `${a.name}(ID=${a.id})`).join(', '));
  }
  if (unmatchedMolds.length > 0) {
    console.log(`  Mẫu chưa khớp:`, unmatchedMolds.map(u => `${u.name}(ID=${u.id})`).join(', '));
  }

  // ───────────────────────────────────────────────
  // 3. EQUIPMENT / DAO CẮT (cutters.csv ↔ equipment)
  // ───────────────────────────────────────────────
  console.log('\n━━━ 3. THIẾT BỊ: DAO CẮT (cutters.csv ↔ equipment) ━━━');
  const cuttersCSV = parseCSV('cutters.csv');

  let cutterMatched = 0, cutterNew = 0;
  const unmatchedCutters = [];

  cuttersCSV.forEach(csv => {
    const csvId = csv.CutterID;
    const csvNo = (csv.CutterNo || '').trim();
    const csvName = (csv.CutterName || '').trim();
    const csvDesignCode = (csv.CutterDesignCode || '').trim();

    // Multi-key matching with CT- prefix awareness
    const match = dbEquipByLegacyId.get(`cut-${csvId}`)
      || dbEquipByLegacyId.get(String(csvId))
      || dbEquipByCode.get(`ct-${csvNo}`.toLowerCase())
      || dbEquipByCode.get(csvNo.toLowerCase())
      || dbEquipByDisplayName.get(csvName.toLowerCase())
      || dbEquipByNormCode.get(normalize(csvName))
      || dbEquipByNormCode.get(normalize(csvDesignCode));

    if (match) {
      cutterMatched++;
    } else {
      cutterNew++;
      if (unmatchedCutters.length < 10) unmatchedCutters.push({ id: csvId, no: csvNo, name: csvName });
    }
  });

  report.modules.cutters = {
    csvRows: cuttersCSV.length, matched: cutterMatched, newToInsert: cutterNew,
    sampleUnmatched: unmatchedCutters
  };
  console.log(`  CSV: ${cuttersCSV.length} | Đã khớp: ${cutterMatched} | Cần thêm: ${cutterNew}`);
  if (unmatchedCutters.length > 0) {
    console.log(`  Mẫu chưa khớp:`, unmatchedCutters.map(u => `${u.name}(No=${u.no},ID=${u.id})`).join(', '));
  }

  // ───────────────────────────────────────────────
  // 4. JOBS (jobs.csv ↔ jobs)
  // ───────────────────────────────────────────────
  console.log('\n━━━ 4. CHỈ THỊ SẢN XUẤT (jobs.csv ↔ jobs) ━━━');
  const jobsCSV = parseCSV('jobs.csv');
  const dbJobs = await fetchAllRows('jobs', 'job_id, job_code, job_name, legacy_id, design_revision_id, equipment_id');

  const dbJobByLegacyId = new Map();
  const dbJobByCode = new Map();
  dbJobs.forEach(j => {
    if (j.legacy_id) dbJobByLegacyId.set(String(j.legacy_id).toLowerCase(), j);
    if (j.job_code) dbJobByCode.set(j.job_code.toLowerCase(), j);
  });

  let jobMatched = 0, jobNew = 0, jobMissingDesign = 0, jobMissingEquip = 0;
  const unmatchedJobs = [];

  jobsCSV.forEach(csv => {
    const csvId = csv.JobID;
    const csvCode = (csv.JobCode || csv.JobName || '').trim();

    const match = dbJobByLegacyId.get(String(csvId))
      || dbJobByLegacyId.get(`job-${csvId}`)
      || (csvCode ? dbJobByCode.get(csvCode.toLowerCase()) : null);

    if (match) {
      jobMatched++;
      if (!match.design_revision_id) jobMissingDesign++;
      if (!match.equipment_id) jobMissingEquip++;
    } else {
      jobNew++;
      if (unmatchedJobs.length < 10) unmatchedJobs.push({ id: csvId, code: csvCode, moldDesignId: csv.MoldDesignID, moldId: csv.MoldID });
    }
  });

  report.modules.jobs = {
    csvRows: jobsCSV.length, dbRows: dbJobs.length,
    matched: jobMatched, missingDesignLink: jobMissingDesign, missingEquipLink: jobMissingEquip,
    newToInsert: jobNew, sampleUnmatched: unmatchedJobs
  };
  console.log(`  CSV: ${jobsCSV.length} | DB: ${dbJobs.length}`);
  console.log(`  ✓ Đã khớp: ${jobMatched} (${jobMissingDesign} thiếu design, ${jobMissingEquip} thiếu equipment)`);
  console.log(`  ⊕ Cần thêm mới: ${jobNew}`);

  // ───────────────────────────────────────────────
  // 5. JOB STEPS & WORK LOGS
  // ───────────────────────────────────────────────
  console.log('\n━━━ 5. CÔNG ĐOẠN & NHẬT KÝ (processingdeadline.csv, worklog.csv) ━━━');
  const deadlinesCSV = parseCSV('processingdeadline.csv');
  const worklogsCSV = parseCSV('worklog.csv');

  const dbSteps = await fetchAllRows('job_steps', 'step_id, legacy_id');
  const dbWorkLogs = await fetchAllRows('work_logs', 'work_log_id, legacy_id');

  const dbStepByLegacy = new Set(dbSteps.map(s => String(s.legacy_id)).filter(Boolean));
  const dbWLByLegacy = new Set(dbWorkLogs.map(w => String(w.legacy_id)).filter(Boolean));

  let stepMatched = 0, stepNew = 0;
  deadlinesCSV.forEach(csv => {
    if (dbStepByLegacy.has(String(csv.ProcessingDeadlineID))) stepMatched++;
    else stepNew++;
  });

  let wlMatched = 0, wlNew = 0;
  worklogsCSV.forEach(csv => {
    if (dbWLByLegacy.has(String(csv.WorkLogID))) wlMatched++;
    else wlNew++;
  });

  report.modules.steps = { csvRows: deadlinesCSV.length, dbRows: dbSteps.length, matched: stepMatched, newToInsert: stepNew };
  report.modules.workLogs = { csvRows: worklogsCSV.length, dbRows: dbWorkLogs.length, matched: wlMatched, newToInsert: wlNew };

  console.log(`  Công đoạn: CSV ${deadlinesCSV.length} | DB ${dbSteps.length} | Khớp: ${stepMatched} | Mới: ${stepNew}`);
  console.log(`  Nhật ký:   CSV ${worklogsCSV.length} | DB ${dbWorkLogs.length} | Khớp: ${wlMatched} | Mới: ${wlNew}`);

  // ───────────────────────────────────────────────
  // 6. CONSUMABLES & PURCHASE ORDERS & MOLD LOANS (Module mới)
  // ───────────────────────────────────────────────
  console.log('\n━━━ 6. MODULE MỚI: VẬT TƯ TIÊU HAO & GIẤY MƯỢN KHUÔN ━━━');
  const vattuCSV = parseCSV('vattutbl.csv');
  const dathangCSV = parseCSV('dathangvttbl.csv');
  const vattusdCSV = parseCSV('vattusdtbl.csv');
  const borrowCSV = parseCSV('moldborrow.csv');

  report.modules.consumables = { catalogItems: vattuCSV.length, purchaseOrders: dathangCSV.length, usageRecords: vattusdCSV.length };
  report.modules.moldLoans = { records: borrowCSV.length };

  console.log(`  Danh mục vật tư (consumables):        ${vattuCSV.length} mã`);
  console.log(`  Đặt mua vật tư (purchase orders):     ${dathangCSV.length} đơn`);
  console.log(`  Tiêu hao thực tế (usage logs):        ${vattusdCSV.length} bản ghi`);
  console.log(`  Giấy mượn khuôn (mold loans):         ${borrowCSV.length} biên bản`);

  // ───────────────────────────────────────────────
  // 7. EQUIPMENT TYPE BREAKDOWN IN DB
  // ───────────────────────────────────────────────
  console.log('\n━━━ 7. THỐNG KÊ EQUIPMENT THEO LOẠI TRONG DB ━━━');
  const typeCounts = {};
  dbEquipment.forEach(e => { typeCounts[e.equipment_type] = (typeCounts[e.equipment_type] || 0) + 1; });
  Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  report.modules.equipmentBreakdown = typeCounts;

  // ───────────────────────────────────────────────
  // SAVE REPORT
  // ───────────────────────────────────────────────
  const reportPath = path.join(__dirname, '..', 'backups', 'access_sync_dryrun_v2_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(`✅ DRY-RUN V2 HOÀN TẤT!`);
  console.log(`Báo cáo: ${reportPath}`);
  console.log('════════════════════════════════════════════════════════════════');
}

runAnalysis().catch(err => {
  console.error('Analysis failed:', err);
  process.exit(1);
});
