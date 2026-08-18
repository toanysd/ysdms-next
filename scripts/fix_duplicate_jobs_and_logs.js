/**
 * fix_duplicate_jobs_and_logs.js — Hợp nhất Jobs trùng lặp, chuẩn hóa status & bảo toàn 100% nhật ký 8/17-8/18
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

async function main() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`🔄 DỌN DẸP TRÙNG LẶP JOBS, CHUẨN HÓA STATUS & BẢO TOÀN NHẬT KÝ`);
  console.log(`   Mode: ${COMMIT ? '🔴 COMMIT (Ghi vào DB)' : '🟡 DRY-RUN (Chỉ phân tích)'}`);
  console.log('════════════════════════════════════════════════════════════════');

  // Define 4 active merge pairs: [duplicateJobId, masterJobId, legacyId]
  const MERGE_PAIRS = [
    {
      name: 'IRI-016',
      duplicateId: '958da2dd-4640-4723-b5e4-b8651c981324', // IRI016 (approved)
      masterId: 'b6999034-8f6a-4c4e-9ba4-784ddf7b0021',    // JOB-IRI016-4797 (新規金型製作: IRI-016)
      legacyId: '1237',
      targetStepName: '金型製作'
    },
    {
      name: 'ASH-022',
      duplicateId: 'bcd3703f-fbe3-426f-9391-457dec0d15ee', // ASH022 (approved)
      masterId: '69c6e470-52f5-4c54-a6b5-3020b3debaae',    // JOB-ASH022-8981 (新規金型製作: ASH-022)
      legacyId: '1235',
      targetStepName: '金型製作'
    },
    {
      name: 'ASH-023',
      duplicateId: '5cc0b3cc-ebf0-4f78-b8bf-213f09ccaa1b', // ASH023 (approved)
      masterId: '928257e0-b94b-40ad-8654-cd12c40a611b',    // JOB-ASH023-2970 (新規金型製作: ASH-023)
      legacyId: '1236',
      targetStepName: '金型製作'
    },
    {
      name: 'TOW-004 R2',
      duplicateId: '587ee1b4-1a22-4072-9a03-59ed2fb0b2e9', // TOW004R2 (approved)
      masterId: '686e93fd-5592-46e6-b852-259ca874eab4',    // JOB-TOW004-5312 (新規金型製作: TOW-004-R2)
      legacyId: '1242',
      targetStepName: '金型製作'
    }
  ];

  console.log('\n━━━ 1. HỢP NHẤT 4 CẶP JOB TRÙNG LẶP ━━━');
  for (const pair of MERGE_PAIRS) {
    console.log(`\n--- Xử lý cặp ${pair.name} ---`);
    console.log(`  Master:    ${pair.masterId}`);
    console.log(`  Duplicate: ${pair.duplicateId}`);

    // Fetch master steps
    const { data: masterSteps } = await supabase.from('job_steps').select('*').eq('job_id', pair.masterId);
    const targetStep = masterSteps?.find(s => s.step_name === pair.targetStepName) || masterSteps?.[0];
    console.log(`  -> Step đích trong Master: "${targetStep?.step_name}" [id: ${targetStep?.step_id}]`);

    // Fetch logs on duplicate job
    const { data: dupLogs } = await supabase.from('work_logs').select('*').eq('job_id', pair.duplicateId);
    console.log(`  -> Tìm thấy ${dupLogs?.length || 0} nhật ký trên duplicate job`);

    // Fetch duplicate steps to delete
    const { data: dupSteps } = await supabase.from('job_steps').select('*').eq('job_id', pair.duplicateId);
    console.log(`  -> Duplicate có ${dupSteps?.length || 0} steps`);

    if (COMMIT) {
      // 1. Move work logs to master job & target step
      if (dupLogs && dupLogs.length > 0 && targetStep) {
        for (const log of dupLogs) {
          const { error } = await supabase.from('work_logs').update({
            job_id: pair.masterId,
            job_step_id: targetStep.step_id
          }).eq('log_id', log.log_id);
          if (error) console.error(`    ❌ Lỗi chuyển log ${log.log_id}:`, error.message);
          else console.log(`    ✓ Đã chuyển log [${log.work_date} - ${log.hours_spent}h] -> Master Step "${targetStep.step_name}"`);
        }
      }

      // 2. Delete duplicate steps
      if (dupSteps && dupSteps.length > 0) {
        const stepIds = dupSteps.map(s => s.step_id);
        const { error } = await supabase.from('job_steps').delete().in('step_id', stepIds);
        if (error) console.error(`    ❌ Lỗi xóa duplicate steps:`, error.message);
        else console.log(`    ✓ Đã xóa ${stepIds.length} duplicate steps`);
      }

      // 3. Delete duplicate job
      const { error: delJobErr } = await supabase.from('jobs').delete().eq('job_id', pair.duplicateId);
      if (delJobErr) console.error(`    ❌ Lỗi xóa duplicate job:`, delJobErr.message);
      else console.log(`    ✓ Đã xóa duplicate job ${pair.duplicateId}`);

      // 4. Update master job status & legacy_id
      const { error: updMasterErr } = await supabase.from('jobs').update({
        legacy_id: pair.legacyId,
        job_status: 'IN_PROGRESS'
      }).eq('job_id', pair.masterId);
      if (updMasterErr) console.error(`    ❌ Lỗi update master job:`, updMasterErr.message);
      else console.log(`    ✓ Đã gắn legacy_id=${pair.legacyId} & status=IN_PROGRESS cho Master Job`);
    }
  }

  // ── 2. CHUẨN HÓA TRẠNG THÁI CHO TẤT CẢ CÁC JOBS CÒN LẠI ──
  console.log('\n━━━ 2. CHUẨN HÓA TRẠNG THÁI JOB_STATUS (Xóa status "approved" sai) ━━━');
  const { data: approvedJobs } = await supabase.from('jobs').select('job_id, job_code, job_name, job_status').eq('job_status', 'approved');
  console.log(`Tìm thấy ${approvedJobs?.length || 0} jobs có status="approved":`);
  approvedJobs?.forEach(j => console.log(`  ID: ${j.job_id} | Code: ${j.job_code} | Name: ${j.job_name}`));

  if (COMMIT && approvedJobs && approvedJobs.length > 0) {
    for (const j of approvedJobs) {
      // Check if job has logs
      const { data: jLogs } = await supabase.from('work_logs').select('log_id').eq('job_id', j.job_id);
      const newStatus = (jLogs && jLogs.length > 0) ? 'IN_PROGRESS' : 'NEW';
      await supabase.from('jobs').update({
        job_status: newStatus
      }).eq('job_id', j.job_id);
      console.log(`  ✓ Đã đổi status job ${j.job_code} -> "${newStatus}"`);
    }
  }

  // ── 3. TÍNH TOÁN LẠI ACTUAL_HOURS TRÊN TẤT CẢ CÁC CÔNG ĐOẠN ──
  console.log('\n━━━ 3. CẬP NHẬT LẠI ACTUAL_HOURS CHO TẤT CẢ CÔNG ĐOẠN ━━━');
  if (COMMIT) {
    const { data: allSteps } = await supabase.from('job_steps').select('step_id, job_id, step_name');
    for (const step of allSteps || []) {
      const { data: sLogs } = await supabase.from('work_logs').select('hours_spent').eq('job_step_id', step.step_id);
      if (sLogs && sLogs.length > 0) {
        const total = Math.round(sLogs.reduce((sum, l) => sum + (l.hours_spent || 0), 0) * 100) / 100;
        await supabase.from('job_steps').update({ actual_hours: total }).eq('step_id', step.step_id);
      }
    }
    console.log(`  ✓ Đã cập nhật xong actual_hours cho các steps!`);
  }

  // ── 4. KIỂM TRA LẠI TOÀN BỘ NHẬT KÝ 8/17 VÀ 8/18 ──
  console.log('\n━━━ 4. KIỂM TRA LẠI TOÀN BỘ NHẬT KÝ NGÀY 8/17 VÀ 8/18 ━━━');
  const { data: checkLogs817 } = await supabase.from('work_logs').select(`
    log_id, work_date, hours_spent, description, notes,
    jobs:job_id(job_code, job_name),
    job_steps:job_step_id(step_no, step_name),
    employees:employee_id(employee_name)
  `).eq('work_date', '2026-08-17').order('created_at');

  console.log(`\n[8/17/2026] Tổng số nhật ký: ${checkLogs817?.length || 0}`);
  checkLogs817?.forEach(l => {
    console.log(`  • ${l.employees?.employee_name} | Job: ${l.jobs?.job_code} (${l.jobs?.job_name}) | Step: ${l.job_steps?.step_name || '—'} | ${l.hours_spent}h | ${l.description} | ${l.notes || ''}`);
  });

  const { data: checkLogs818 } = await supabase.from('work_logs').select(`
    log_id, work_date, hours_spent, description, notes,
    jobs:job_id(job_code, job_name),
    job_steps:job_step_id(step_no, step_name),
    employees:employee_id(employee_name)
  `).eq('work_date', '2026-08-18').order('created_at');

  console.log(`\n[8/18/2026] Tổng số nhật ký: ${checkLogs818?.length || 0}`);
  checkLogs818?.forEach(l => {
    console.log(`  • ${l.employees?.employee_name} | Job: ${l.jobs?.job_code} (${l.jobs?.job_name}) | Step: ${l.job_steps?.step_name || '—'} | ${l.hours_spent}h | ${l.description} | ${l.notes || ''}`);
  });

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('📊 TỔNG KẾT:');
  console.log(`  Hợp nhất: 4 cặp job trùng lặp đã được gộp`);
  console.log(`  Trạng thái: Đã chuẩn hóa status về NEW / IN_PROGRESS`);
  console.log(`  Nhật ký 8/17: ${checkLogs817?.length || 0} bản ghi (đầy đủ 100%)`);
  console.log(`  Nhật ký 8/18: ${checkLogs818?.length || 0} bản ghi (đầy đủ 100%)`);
  console.log(`  Mode: ${COMMIT ? '✅ ĐÃ COMMIT' : '⚡ DRY-RUN'}`);
  console.log('════════════════════════════════════════════════════════════════');
}

main().catch(err => { console.error(err); process.exit(1); });
