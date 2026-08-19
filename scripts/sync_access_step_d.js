/**
 * sync_access_step_d.js
 * =============================================================
 * Step D: Job Steps (processingdeadline.csv) & Work Logs (worklog.csv)
 * 
 * 1. Add legacy_id columns to job_steps & work_logs (via pg direct)
 * 2. Match existing records via composite keys
 * 3. Tag legacy_id on matched records
 * 4. Insert missing records
 * 
 * Modes: --dry-run (default) | --commit
 * Usage: node scripts/sync_access_step_d.js [--commit]
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
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) return `${match[3]}-${match[1].padStart(2, '0')}-${match[2].padStart(2, '0')}`;
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
  return val === 'TRUE' || val === 'true' || val === '1';
}

// ========== STEP D1: CHECK LEGACY_ID COLUMNS ==========

async function checkLegacyIdColumns() {
  console.log('\n━━━ D1: Kiểm tra cột legacy_id trong job_steps & work_logs ━━━');

  // Try to select with legacy_id to check if it exists
  const { error: e1 } = await supabase.from('job_steps').select('legacy_id').limit(1);
  const { error: e2 } = await supabase.from('work_logs').select('legacy_id').limit(1);

  const jsHas = !e1;
  const wlHas = !e2;

  if (!jsHas || !wlHas) {
    const projectRef = env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');
    console.log('  ⚠️ Cột legacy_id chưa có. Vui lòng chạy SQL sau trong Supabase Dashboard:');
    console.log(`  Dashboard: https://supabase.com/dashboard/project/${projectRef}/sql/new`);
    console.log('  ────────────────────────────────────────');
    if (!jsHas) console.log('  ALTER TABLE job_steps ADD COLUMN IF NOT EXISTS legacy_id TEXT;');
    if (!wlHas) console.log('  ALTER TABLE work_logs ADD COLUMN IF NOT EXISTS legacy_id TEXT;');
    console.log('  ────────────────────────────────────────');
    console.log('  Sau khi chạy SQL, chạy lại script này.');
    return false;
  }

  console.log('  ✓ Cả 2 bảng đều có cột legacy_id');
  return true;
}

// ========== STEP D2: JOB STEPS ==========

let hasColumns = false; // Set by main()

async function syncJobSteps() {
  console.log('\n━━━ D2: CÔNG ĐOẠN (processingdeadline.csv → job_steps) ━━━');

  const deadlinesCSV = parseCSV('processingdeadline.csv');
  const processingCodesCSV = parseCSV('processingcode.csv');
  const processingItemsCSV = parseCSV('processingitems.csv');
  const processingStatusCSV = parseCSV('processingstatus.csv');

  // Build lookup for processing codes (Name mapping)
  const codeNameMap = new Map();
  processingCodesCSV.forEach(c => { if (c.ProcessingCodeID) codeNameMap.set(c.ProcessingCodeID, c.ProcessingName); });

  // Build lookup for processing items (Track/ItemType mapping)
  const itemNameMap = new Map();
  processingItemsCSV.forEach(i => { if (i.ProcessingItemID) itemNameMap.set(i.ProcessingItemID, i.ProcessingItemName); });

  // Build lookup for processing status
  const statusMap = new Map();
  processingStatusCSV.forEach(s => { if (s.ProcessingStatusID) statusMap.set(s.ProcessingStatusID, s.ProcessingStatus); });

  // Load jobs from DB (need to resolve JobID → job_id)
  const dbJobs = await fetchAllRows('jobs', 'job_id, job_code, legacy_id');
  const dbJobByLegacyId = new Map();
  dbJobs.forEach(j => {
    if (j.legacy_id) dbJobByLegacyId.set(String(j.legacy_id), j);
  });

  // Load existing job_steps — only select columns that exist
  const jsSelect = hasColumns ? 'step_id, job_id, step_name, item_type_id, track, deadline, legacy_id' : 'step_id, job_id, step_name, item_type_id, track, deadline';
  const dbSteps = await fetchAllRows('job_steps', jsSelect);

  // Build composite key for existing steps: job_id + item_type_id + step_name(approx)
  const dbStepCompositeSet = new Map();
  dbSteps.forEach(s => {
    const key = `${s.job_id}|${s.item_type_id || ''}|${s.step_name || ''}`;
    dbStepCompositeSet.set(key, s);
  });
  // Also build by job_id for broader matching
  const dbStepsByJobId = new Map();
  dbSteps.forEach(s => {
    if (!dbStepsByJobId.has(s.job_id)) dbStepsByJobId.set(s.job_id, []);
    dbStepsByJobId.get(s.job_id).push(s);
  });

  // Load employees & companies
  const dbEmployees = await fetchAllRows('employees', 'employee_id, legacy_id');
  const dbEmpByLegacyId = new Map();
  dbEmployees.forEach(e => { if (e.legacy_id) dbEmpByLegacyId.set(String(e.legacy_id), e); });

  const dbCompanies = await fetchAllRows('companies', 'company_id, legacy_id');
  const dbCompByLegacyId = new Map();
  dbCompanies.forEach(c => { if (c.legacy_id) dbCompByLegacyId.set(String(c.legacy_id), c); });

  let matched = 0, taggedLegacy = 0, toInsert = [], noJobFound = 0;

  for (const csv of deadlinesCSV) {
    const csvId = csv.ProcessingDeadlineID;
    if (!csvId) continue;

    // Resolve job_id from JobID in CSV — DB uses JOB-{id} format
    const jobLegacyId = csv.JobID ? String(csv.JobID) : null;
    if (!jobLegacyId) { noJobFound++; continue; }

    const job = dbJobByLegacyId.get(`JOB-${jobLegacyId}`)
      || dbJobByLegacyId.get(jobLegacyId);
    if (!job) { noJobFound++; continue; }

    const stepName = csv.IDCapDC || codeNameMap.get(csv.ProcessingCodeID) || `工程-${csv.ProcessingCodeID}`;
    const itemTypeId = csv.ItemTypeID ? parseInt(csv.ItemTypeID) : null;
    const itemName = itemNameMap.get(csv.ItemTypeID) || '';

    // Map track from IDCapDC or ItemTypeID
    let track = 'MOLD';
    const capDC = (csv.IDCapDC || '').toUpperCase();
    if (capDC.includes('MOLD') || capDC.includes('1.')) track = 'MOLD';
    else if (capDC.includes('PLUG') || capDC.includes('2.')) track = 'PLUG';
    else if (capDC.includes('CUTTER') || capDC.includes('3.')) track = 'CUTTER';
    else if (capDC.includes('ALUMI') || capDC.includes('0.')) track = 'MOLD';
    else if (capDC.includes('OTHER')) track = 'OTHER';
    else if (itemTypeId === 1) track = 'MOLD';
    else if (itemTypeId === 2) track = 'MOLD';
    else if (itemTypeId === 3) track = 'PLUG';
    else if (itemTypeId === 4) track = 'CUTTER';

    // Try to match existing step via composite key
    const existingSteps = dbStepsByJobId.get(job.job_id) || [];
    let matchedStep = null;
    
    // Strategy 1: Exact match by item_type_id + track
    for (const s of existingSteps) {
      if (s.item_type_id === itemTypeId) {
        matchedStep = s; break;
      }
    }
    // Strategy 2: Match by track name
    if (!matchedStep) {
      for (const s of existingSteps) {
        if (s.track === track) {
          matchedStep = s; break;
        }
      }
    }

    if (matchedStep) {
      matched++;
      // Tag legacy_id if not set (only if column exists)
      if (hasColumns && !matchedStep.legacy_id && COMMIT_MODE) {
        await supabase.from('job_steps')
          .update({ legacy_id: `STEP-${csvId}` })
          .eq('step_id', matchedStep.step_id);
        taggedLegacy++;
      }
      // Remove from pool to avoid double-matching
      const idx = existingSteps.indexOf(matchedStep);
      if (idx > -1) existingSteps.splice(idx, 1);
    } else {
      // Resolve outsource_company
      let outsourceCompany = null;
      if (csv.MachiningCustomerID) {
        const comp = dbCompByLegacyId.get(`COMP-${csv.MachiningCustomerID}`);
        if (comp) outsourceCompany = comp.company_id;
      }

      // Map status
      let stepStatus = 'PENDING';
      const statusId = csv.ProcessingStatusID ? parseInt(csv.ProcessingStatusID) : 0;
      if (statusId === 8) stepStatus = 'COMPLETED';
      else if (statusId >= 2) stepStatus = 'IN_PROGRESS';

      const insertObj = {
        job_id: job.job_id,
        step_no: itemTypeId || 0,
        step_name: stepName,
        item_type_id: itemTypeId,
        track: track,
        step_status: stepStatus,
        deadline: parseDate(csv.ProcessingDeadline),
        estimated_hours: parseNum(csv.EstimatedHours),
        set_info: csv.Set || null,
        tehai_info: csv.Tehai || null,
        drawing_receipt_date: parseDate(csv.DrawingReceiptDate),
        outsource_company: outsourceCompany,
        notes: csv.ProcessingNotes || null,
      };
      if (hasColumns) insertObj.legacy_id = `STEP-${csvId}`;
      toInsert.push(insertObj);
    }
  }

  console.log(`  CSV: ${deadlinesCSV.length} | DB: ${dbSteps.length}`);
  console.log(`  ✓ Đã khớp: ${matched} (${taggedLegacy} tagged legacy_id)`);
  console.log(`  ⊕ Cần thêm mới: ${toInsert.length}`);
  console.log(`  ⚠️ Không tìm thấy Job: ${noJobFound}`);

  if (toInsert.length > 0) {
    console.log(`  Mẫu insert:`, toInsert.slice(0, 5).map(s => `${s.step_name}@${s.track}(${s.step_status})`).join(', '));
  }

  if (COMMIT_MODE && toInsert.length > 0) {
    console.log(`  ⏳ Inserting ${toInsert.length} new job_steps...`);
    for (let i = 0; i < toInsert.length; i += 50) {
      const batch = toInsert.slice(i, i + 50);
      const { error } = await supabase.from('job_steps').insert(batch);
      if (error) console.error(`  ❌ Insert batch ${i} error:`, error.message);
      else console.log(`  ✓ Batch ${i}-${i + batch.length} inserted`);
    }
  }

  return { matched, inserted: toInsert.length, noJobFound, taggedLegacy };
}

// ========== STEP D3: WORK LOGS ==========

async function syncWorkLogs() {
  console.log('\n━━━ D3: NHẬT KÝ (worklog.csv → work_logs) ━━━');

  const worklogsCSV = parseCSV('worklog.csv');
  const processingCodesCSV = parseCSV('processingcode.csv');
  const codeNameMap = new Map();
  processingCodesCSV.forEach(c => { if (c.ProcessingCodeID) codeNameMap.set(c.ProcessingCodeID, c.ProcessingName); });

  // Load job_steps — select only existing columns
  const stepSelect = hasColumns ? 'step_id, job_id, item_type_id, legacy_id' : 'step_id, job_id, item_type_id';
  const dbSteps = await fetchAllRows('job_steps', stepSelect);
  
  // Build step lookup by job_id + item_type_id (composite)
  const dbStepByJobAndType = new Map();
  dbSteps.forEach(s => {
    const key = `${s.job_id}|${s.item_type_id || ''}`;
    dbStepByJobAndType.set(key, s);
  });
  // Also by legacy_id if available
  const dbStepByLegacyId = new Map();
  if (hasColumns) {
    dbSteps.forEach(s => { if (s.legacy_id) dbStepByLegacyId.set(String(s.legacy_id), s); });
  }

  // Load jobs for resolution — DB uses JOB-{id} format
  const dbJobs = await fetchAllRows('jobs', 'job_id, legacy_id');
  const dbJobByLegacyId = new Map();
  dbJobs.forEach(j => { if (j.legacy_id) dbJobByLegacyId.set(String(j.legacy_id), j); });

  // Load employees
  const dbEmployees = await fetchAllRows('employees', 'employee_id, legacy_id');
  const dbEmpByLegacyId = new Map();
  dbEmployees.forEach(e => { if (e.legacy_id) dbEmpByLegacyId.set(String(e.legacy_id), e); });

  // Load existing work_logs — select only existing columns
  const wlSelect = hasColumns ? 'log_id, job_step_id, job_id, work_date, employee_id, hours_spent, legacy_id' : 'log_id, job_step_id, job_id, work_date, employee_id, hours_spent';
  const dbWorkLogs = await fetchAllRows('work_logs', wlSelect);

  // Build composite key for matching: job_step_id + work_date + employee_id + hours
  const dbWLCompositeSet = new Set();
  dbWorkLogs.forEach(wl => {
    const dateStr = wl.work_date ? wl.work_date.slice(0, 10) : '';
    const key = `${wl.job_step_id || wl.job_id}|${dateStr}|${wl.employee_id || ''}|${wl.hours_spent || ''}`;
    dbWLCompositeSet.add(key);
  });

  // Build bridge: ProcessingDeadlineID → {JobID, ItemTypeID} from CSV
  const deadlinesCSV = parseCSV('processingdeadline.csv');
  const deadlineBridge = new Map();
  deadlinesCSV.forEach(d => {
    if (d.ProcessingDeadlineID) {
      deadlineBridge.set(String(d.ProcessingDeadlineID), {
        jobId: d.JobID,
        itemTypeId: d.ItemTypeID ? parseInt(d.ItemTypeID) : null
      });
    }
  });

  let matched = 0, toInsert = [], noStepFound = 0, noJobFound = 0;

  for (const csv of worklogsCSV) {
    const csvId = csv.WorkLogID;
    if (!csvId) continue;

    // Resolve job_step via ProcessingDeadlineID
    let jobStepId = null;
    let jobId = null;

    // Strategy 1: Via legacy_id on step (if columns exist and tagged)
    if (hasColumns && csv.ProcessingDeadlineID) {
      const step = dbStepByLegacyId.get(`STEP-${csv.ProcessingDeadlineID}`);
      if (step) {
        jobStepId = step.step_id;
        jobId = step.job_id;
      }
    }

    // Strategy 2: Via bridge CSV (ProcessingDeadlineID → JobID+ItemTypeID) → DB composite
    if (!jobStepId && csv.ProcessingDeadlineID) {
      const bridge = deadlineBridge.get(String(csv.ProcessingDeadlineID));
      if (bridge && bridge.jobId) {
        const job = dbJobByLegacyId.get(`JOB-${bridge.jobId}`) || dbJobByLegacyId.get(String(bridge.jobId));
        if (job) {
          jobId = job.job_id;
          if (bridge.itemTypeId !== null) {
            const step = dbStepByJobAndType.get(`${job.job_id}|${bridge.itemTypeId}`);
            if (step) jobStepId = step.step_id;
          }
        }
      }
    }

    if (!jobStepId && !jobId) {
      noStepFound++;
      continue;
    }

    // Resolve employee — DB uses EMP-{id} format
    const SYSTEM_EMPLOYEE_ID = '00000000-0000-0000-0000-000000000000'; // System Temp
    let employeeId = SYSTEM_EMPLOYEE_ID; // default fallback for NOT NULL constraint
    if (csv.EmployeeID) {
      const emp = dbEmpByLegacyId.get(`EMP-${csv.EmployeeID}`)
        || dbEmpByLegacyId.get(String(csv.EmployeeID));
      if (emp) employeeId = emp.employee_id;
    }

    const workDate = parseDate(csv.ProcessingDate);
    const hoursSpent = parseNum(csv.ProcessingTime);

    // Check if already exists
    const dateStr = workDate || '';
    const compositeKey = `${jobStepId || jobId}|${dateStr}|${employeeId || ''}|${hoursSpent || ''}`;
    if (dbWLCompositeSet.has(compositeKey)) {
      matched++;
      continue;
    }

    // Resolve processing_code_id
    let processingCodeId = csv.ProcessingCodeID ? parseInt(csv.ProcessingCodeID) : null;

    const insertObj = {
      job_step_id: jobStepId,
      job_id: jobId,
      employee_id: employeeId,
      work_date: workDate,
      hours_spent: hoursSpent,
      quantity_done: csv.ProcessingNumbers ? parseInt(csv.ProcessingNumbers) : null,
      is_finished: parseBool(csv.Finished),
      contact_content: csv.Noidunglienlac || null,
      notes: csv.ProcessingNotes || null,
      processing_code_id: processingCodeId,
    };
    if (hasColumns) insertObj.legacy_id = `WL-${csvId}`;
    toInsert.push(insertObj);
  }

  console.log(`  CSV: ${worklogsCSV.length} | DB: ${dbWorkLogs.length}`);
  console.log(`  ✓ Đã khớp: ${matched}`);
  console.log(`  ⊕ Cần thêm mới: ${toInsert.length}`);
  console.log(`  ⚠️ Không tìm thấy Step/Job: ${noStepFound}`);

  if (toInsert.length > 0) {
    console.log(`  Mẫu insert:`, toInsert.slice(0, 5).map(w =>
      `WL(date=${w.work_date}, hrs=${w.hours_spent}, step=${w.job_step_id ? '✓' : '✗'})`
    ).join(', '));
  }

  if (COMMIT_MODE && toInsert.length > 0) {
    console.log(`  ⏳ Inserting ${toInsert.length} new work_logs...`);
    for (let i = 0; i < toInsert.length; i += 50) {
      const batch = toInsert.slice(i, i + 50);
      const { error } = await supabase.from('work_logs').insert(batch);
      if (error) console.error(`  ❌ Insert batch ${i} error:`, error.message);
      else console.log(`  ✓ Batch ${i}-${i + batch.length} inserted`);
    }
  }

  return { matched, inserted: toInsert.length, noStepFound };
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`🔄 STEP D: CÔNG ĐOẠN & NHẬT KÝ (job_steps + work_logs)`);
  console.log(`   Mode: ${COMMIT_MODE ? '🔴 COMMIT (Ghi vào DB)' : '🟡 DRY-RUN (Chỉ phân tích)'}`);
  console.log('════════════════════════════════════════════════════════════════');

  hasColumns = await checkLegacyIdColumns();
  if (!hasColumns) {
    console.log('\n⚠️ Tiếp tục sync KHÔNG CẦN legacy_id (sẽ dùng composite key matching)...');
  }

  const resultSteps = await syncJobSteps();
  const resultWorkLogs = await syncWorkLogs();

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('📊 TỔNG KẾT STEP D:');
  console.log(`  Công đoạn: ${resultSteps.matched} khớp, ${resultSteps.inserted} mới, ${resultSteps.taggedLegacy} tagged`);
  console.log(`  Nhật ký:   ${resultWorkLogs.matched} khớp, ${resultWorkLogs.inserted} mới`);
  console.log(`  Mode: ${COMMIT_MODE ? '✅ ĐÃ COMMIT' : '⚡ DRY-RUN — Chạy với --commit để ghi vào DB'}`);
  console.log('════════════════════════════════════════════════════════════════');
}

main().catch(err => { console.error('Sync failed:', err); process.exit(1); });

