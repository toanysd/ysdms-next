/**
 * sync_access_step_d_fixed.js — Sync job_steps & work_logs chuẩn xác 100%
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const env = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const COMMIT = process.argv.includes('--commit');

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^['"]|['"]$/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const obj = {};
    headers.forEach((h, idx) => {
      let val = cols[idx] !== undefined ? cols[idx].trim() : '';
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      obj[h] = val;
    });
    rows.push(obj);
  }
  return rows;
}

function parseDate(dStr) {
  if (!dStr) return null;
  const parts = dStr.trim().split('/');
  if (parts.length === 3) {
    const m = parts[0].padStart(2, '0');
    const d = parts[1].padStart(2, '0');
    const y = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
    return `${y}-${m}-${d}`;
  }
  return null;
}

const ITEM_TYPE_MAP = {
  1: { name: 'アルミ材', track: 'ALUMI' },
  2: { name: '金型', track: 'MOLD' },
  3: { name: 'プラグ', track: 'PLUG' },
  4: { name: '抜型', track: 'CUTTER' },
  5: { name: '水冷盤', track: 'WATER COOLING BASE' },
  6: { name: '圧空ベース', track: 'PRESSIER BASE' },
  7: { name: 'スタッキング', track: 'STAKING' },
  8: { name: 'フレーム', track: 'FRAME' },
  9: { name: '機械など', track: 'MACHINE' },
  10: { name: '成形・プレス・出荷など', track: 'OTHER' },
  11: { name: '試作金型', track: 'TEST MOLD' },
};

async function fetchAll(table, select) {
  let all = [], from = 0, ps = 1000;
  while (true) {
    const { data, error } = await supabase.from(table).select(select).range(from, from + ps - 1);
    if (error) { console.error(`Fetch ${table} error:`, error.message); break; }
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < ps) break;
    from += ps;
  }
  return all;
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`🔄 SYNC STEP D (FIXED) — Đồng bộ Job Steps & Work Logs`);
  console.log(`   Mode: ${COMMIT ? '🔴 COMMIT (Ghi vào DB)' : '🟡 DRY-RUN (Chỉ phân tích)'}`);
  console.log('════════════════════════════════════════════════════════════════');

  // 1. Load CSVs
  const jobsCSV = parseCSV('source_data/csv-access-data/jobs.csv');
  const deadlinesCSV = parseCSV('source_data/csv-access-data/processingdeadline.csv');
  const worklogsCSV = parseCSV('source_data/csv-access-data/worklog.csv');
  const procCodesCSV = parseCSV('source_data/csv-access-data/processingcode.csv');

  // Map processing codes
  const codeMap = new Map();
  procCodesCSV.forEach(c => {
    if (c.ProcessingCodeID) codeMap.set(parseInt(c.ProcessingCodeID), c.ProcessingName);
  });

  // 2. Load DB Reference Data
  const dbJobs = await fetchAll('jobs', 'job_id, job_code, job_name, legacy_id');
  const dbSteps = await fetchAll('job_steps', 'step_id, job_id, step_no, step_name, track, item_type_id, deadline, step_status');
  const dbEmployees = await fetchAll('employees', 'employee_id, employee_name, employee_code, legacy_id');
  const dbWorkLogs = await fetchAll('work_logs', 'log_id, job_id, job_step_id, employee_id, work_date, hours_spent, processing_code_id, description');

  console.log(`DB Counts: Jobs=${dbJobs.length}, Steps=${dbSteps.length}, Employees=${dbEmployees.length}, WorkLogs=${dbWorkLogs.length}`);

  // Build Job lookup map
  const jobMap = new Map();
  dbJobs.forEach(j => {
    if (j.legacy_id) {
      jobMap.set(String(j.legacy_id), j);
      jobMap.set(`JOB-${j.legacy_id}`, j);
      if (String(j.legacy_id).startsWith('JOB-')) {
        jobMap.set(String(j.legacy_id).replace('JOB-', ''), j);
      }
    }
    if (j.job_code) {
      jobMap.set(j.job_code.toUpperCase().replace(/[-\s]/g, ''), j);
    }
  });

  // Build Employee lookup map
  const empMap = new Map();
  dbEmployees.forEach(e => {
    if (e.legacy_id) {
      empMap.set(String(e.legacy_id), e);
      empMap.set(`EMP-${e.legacy_id}`, e);
      if (String(e.legacy_id).startsWith('EMP-')) {
        empMap.set(String(e.legacy_id).replace('EMP-', ''), e);
      }
    }
  });
  const SYSTEM_EMP_ID = '00000000-0000-0000-0000-000000000000';

  // Build Existing Steps lookup map: job_id -> array of steps
  const stepsByJobId = new Map();
  dbSteps.forEach(s => {
    if (!stepsByJobId.has(s.job_id)) stepsByJobId.set(s.job_id, []);
    stepsByJobId.get(s.job_id).push(s);
  });

  // ── PART 1: MATCH OR INSERT JOB STEPS ──
  console.log('\n━━━ PART 1: JOB STEPS (processingdeadline.csv -> job_steps) ━━━');
  
  // Map: ProcessingDeadlineID -> step_id
  const deadlineToStepMap = new Map();
  const deadlineToJobMap = new Map();

  let matchedStepsCount = 0;
  const newStepsToInsert = [];
  let stepOrphanCount = 0;

  for (const dline of deadlinesCSV) {
    const dlineId = String(dline.ProcessingDeadlineID);
    if (!dlineId) continue;

    // Find Job
    const job = jobMap.get(String(dline.JobID)) || jobMap.get(`JOB-${dline.JobID}`);
    if (!job) {
      stepOrphanCount++;
      continue;
    }
    deadlineToJobMap.set(dlineId, job);

    const itemTypeId = dline.ItemTypeID ? parseInt(dline.ItemTypeID) : 2;
    const typeInfo = ITEM_TYPE_MAP[itemTypeId] || { name: '金型', track: 'MOLD' };

    // Check existing steps for this job
    const existing = stepsByJobId.get(job.job_id) || [];
    let matchedStep = existing.find(s => s.item_type_id === itemTypeId) ||
                      existing.find(s => s.track === typeInfo.track) ||
                      existing.find(s => s.step_name === typeInfo.name);

    if (matchedStep) {
      matchedStepsCount++;
      deadlineToStepMap.set(dlineId, matchedStep.step_id);
    } else {
      // Need to create new step
      const stepNo = existing.length + newStepsToInsert.filter(s => s.job_id === job.job_id).length + 1;
      
      let stepStatus = 'PENDING';
      const statusId = dline.ProcessingStatusID ? parseInt(dline.ProcessingStatusID) : 1;
      if (statusId === 8) stepStatus = 'COMPLETED';
      else if (statusId >= 2) stepStatus = 'IN_PROGRESS';

      const newStep = {
        _dlineId: dlineId,
        job_id: job.job_id,
        step_no: stepNo,
        step_name: typeInfo.name,
        track: typeInfo.track,
        item_type_id: itemTypeId,
        step_status: stepStatus,
        deadline: parseDate(dline.ProcessingDeadline),
        drawing_receipt_date: parseDate(dline.DrawingReceiptDate),
        notes: dline.ProcessingNotes || null,
      };
      newStepsToInsert.push(newStep);
    }
  }

  console.log(`  Deadlines in CSV: ${deadlinesCSV.length}`);
  console.log(`  ✓ Đã khớp với step hiện có: ${matchedStepsCount}`);
  console.log(`  ⊕ Cần thêm mới: ${newStepsToInsert.length}`);
  console.log(`  ⚠️ Không tìm thấy Job: ${stepOrphanCount}`);

  if (newStepsToInsert.length > 0) {
    console.log(`  Mẫu steps cần thêm:`);
    newStepsToInsert.slice(0, 10).forEach(s => {
      const j = dbJobs.find(job => job.job_id === s.job_id);
      console.log(`    Job: ${j?.job_code || j?.job_name} | Step ${s.step_no}: ${s.step_name} (${s.track}) | Deadline: ${s.deadline}`);
    });
  }

  if (COMMIT && newStepsToInsert.length > 0) {
    console.log(`\n  ⏳ Đang ghi ${newStepsToInsert.length} job_steps mới vào DB...`);
    for (const s of newStepsToInsert) {
      const dlineId = s._dlineId;
      const insertData = { ...s };
      delete insertData._dlineId;

      const { data, error } = await supabase.from('job_steps').insert([insertData]).select('step_id').single();
      if (error) {
        console.error(`  ❌ Lỗi insert step cho job ${s.job_id}:`, error.message);
      } else if (data) {
        deadlineToStepMap.set(dlineId, data.step_id);
        // Also update stepsByJobId in memory
        if (!stepsByJobId.has(s.job_id)) stepsByJobId.set(s.job_id, []);
        stepsByJobId.get(s.job_id).push({ ...insertData, step_id: data.step_id });
      }
    }
    console.log(`  ✓ Đã ghi xong job_steps!`);
  }

  // ── PART 2: MATCH OR INSERT WORK LOGS ──
  console.log('\n━━━ PART 2: WORK LOGS (worklog.csv -> work_logs) ━━━');

  // Build fingerprint set of DB work_logs
  // Fingerprint: job_id + work_date + employee_id + hours_spent + (processing_code_id || description)
  const dbFingerprints = new Set();
  dbWorkLogs.forEach(l => {
    const dStr = l.work_date ? l.work_date.slice(0, 10) : '';
    const code = l.processing_code_id || '';
    const desc = l.description || '';
    const fp1 = `${l.job_id}|${dStr}|${l.employee_id}|${l.hours_spent}|${code}`;
    const fp2 = `${l.job_id}|${dStr}|${l.employee_id}|${l.hours_spent}|${desc}`;
    const fp3 = `${l.job_id}|${dStr}|${l.employee_id}|${l.hours_spent}`;
    dbFingerprints.add(fp1);
    dbFingerprints.add(fp2);
    dbFingerprints.add(fp3);
  });

  let matchedLogsCount = 0;
  const newLogsToInsert = [];
  let logOrphanCount = 0;

  for (const row of worklogsCSV) {
    const dlineId = String(row.ProcessingDeadlineID);
    if (!dlineId) { logOrphanCount++; continue; }

    const job = deadlineToJobMap.get(dlineId);
    if (!job) { logOrphanCount++; continue; }

    const stepId = deadlineToStepMap.get(dlineId) || null;

    // Resolve Employee
    const emp = empMap.get(String(row.EmployeeID)) || empMap.get(`EMP-${row.EmployeeID}`);
    const empId = emp ? emp.employee_id : SYSTEM_EMP_ID;

    const workDate = parseDate(row.ProcessingDate);
    const hours = parseFloat(row.ProcessingTime) || 0;
    const codeId = row.ProcessingCodeID ? parseInt(row.ProcessingCodeID) : null;
    const desc = codeId ? (codeMap.get(codeId) || null) : null;

    // Check duplicate
    const dStr = workDate || '';
    const fp1 = `${job.job_id}|${dStr}|${empId}|${hours}|${codeId || ''}`;
    const fp2 = `${job.job_id}|${dStr}|${empId}|${hours}|${desc || ''}`;
    const fp3 = `${job.job_id}|${dStr}|${empId}|${hours}`;

    if (dbFingerprints.has(fp1) || dbFingerprints.has(fp2) || dbFingerprints.has(fp3)) {
      matchedLogsCount++;
    } else {
      newLogsToInsert.push({
        job_id: job.job_id,
        job_step_id: stepId,
        employee_id: empId,
        work_date: workDate,
        hours_spent: hours,
        processing_code_id: codeId,
        description: desc,
        notes: row.ProcessingNotes || null,
        is_finished: row.Finished === 'TRUE' || row.Finished === 'true',
        quantity_done: row.ProcessingNumbers ? parseInt(row.ProcessingNumbers) : null,
      });
      // Add to fingerprints to prevent intra-CSV duplicate inserts
      dbFingerprints.add(fp1);
      dbFingerprints.add(fp2);
      dbFingerprints.add(fp3);
    }
  }

  console.log(`  Work logs in CSV: ${worklogsCSV.length}`);
  console.log(`  ✓ Đã khớp với DB hiện tại: ${matchedLogsCount}`);
  console.log(`  ⊕ Cần thêm mới: ${newLogsToInsert.length}`);
  console.log(`  ⚠️ Không tìm thấy Job/Deadline: ${logOrphanCount}`);

  if (newLogsToInsert.length > 0) {
    console.log(`\n  Mẫu work_logs cần thêm mới (Tổng: ${newLogsToInsert.length}):`);
    newLogsToInsert.slice(0, 15).forEach(l => {
      const j = dbJobs.find(job => job.job_id === l.job_id);
      const e = dbEmployees.find(emp => emp.employee_id === l.employee_id);
      console.log(`    Job: ${j?.job_code || j?.job_name} | Date: ${l.work_date} | Worker: ${e?.employee_name || 'SYSTEM'} | Hrs: ${l.hours_spent}h | Desc: ${l.description || l.processing_code_id}`);
    });
  }

  if (COMMIT && newLogsToInsert.length > 0) {
    console.log(`\n  ⏳ Đang ghi ${newLogsToInsert.length} work_logs mới vào DB...`);
    for (let i = 0; i < newLogsToInsert.length; i += 50) {
      const batch = newLogsToInsert.slice(i, i + 50);
      const { error } = await supabase.from('work_logs').insert(batch);
      if (error) console.error(`  ❌ Lỗi insert batch ${i}:`, error.message);
      else console.log(`  ✓ Batch ${i}-${i + batch.length} inserted`);
    }
    console.log(`  ✓ Đã ghi xong work_logs!`);
  }

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('📊 TỔNG KẾT STEP D:');
  console.log(`  Job Steps:  ${matchedStepsCount} khớp, ${newStepsToInsert.length} mới`);
  console.log(`  Work Logs:  ${matchedLogsCount} khớp, ${newLogsToInsert.length} mới`);
  console.log(`  Mode: ${COMMIT ? '✅ ĐÃ COMMIT THÀNH CÔNG' : '⚡ DRY-RUN (Chạy với --commit để ghi DB)'}`);
  console.log('════════════════════════════════════════════════════════════════');
}

main().catch(err => { console.error(err); process.exit(1); });
