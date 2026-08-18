/**
 * rollback_step_d.js — Xóa dữ liệu sai từ Step D
 * 
 * 1. Xóa job_steps có step_name chứa "undefined" (21 bản ghi sai)
 * 2. Xóa work_logs bị trùng/sai từ Step D (dựa trên created_at timestamp)
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

async function fetchAll(table, select, filter) {
  let all = [], from = 0, ps = 1000;
  while (true) {
    let q = supabase.from(table).select(select, { count: 'exact' }).range(from, from + ps - 1);
    if (filter) q = filter(q);
    const { data, error, count } = await q;
    if (error) { console.error(`  Error: ${error.message}`); break; }
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < ps) break;
    from += ps;
  }
  return all;
}

async function main() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`🔄 ROLLBACK STEP D — Dọn dẹp dữ liệu sai`);
  console.log(`   Mode: ${COMMIT ? '🔴 COMMIT (Xóa thật)' : '🟡 DRY-RUN (Chỉ phân tích)'}`);
  console.log('════════════════════════════════════════════════════════════════');

  // ── 1. Tìm job_steps sai (step_name chứa "undefined") ──
  console.log('\n━━━ 1. Job Steps có "undefined" ━━━');
  const badSteps = await fetchAll('job_steps', 'step_id, job_id, step_no, step_name, track, item_type_id, created_at',
    q => q.ilike('step_name', '%undefined%')
  );
  console.log(`  Tìm thấy: ${badSteps.length} job_steps sai`);
  if (badSteps.length > 0) {
    badSteps.slice(0, 10).forEach(s => 
      console.log(`    step_no=${s.step_no} name="${s.step_name}" track=${s.track} created=${s.created_at}`)
    );
    if (badSteps.length > 10) console.log(`    ... và ${badSteps.length - 10} nữa`);
  }

  // Collect bad step_ids to also clean related work_logs
  const badStepIds = badSteps.map(s => s.step_id);

  // ── 2. Tìm work_logs liên kết với các bad steps ──
  console.log('\n━━━ 2. Work Logs liên kết với bad steps ━━━');
  let linkedWL = [];
  if (badStepIds.length > 0) {
    linkedWL = await fetchAll('work_logs', 'log_id, job_step_id, job_id, work_date, employee_id, hours_spent, created_at',
      q => q.in('job_step_id', badStepIds)
    );
    console.log(`  Work logs liên kết với bad steps: ${linkedWL.length}`);
  }

  // ── 3. Tìm TẤT CẢ work_logs được tạo bởi Step D (sau 07:45 UTC hôm nay) ──
  console.log('\n━━━ 3. Work Logs được tạo bởi Step D (sau 07:45 UTC hôm nay) ━━━');
  const syncStartTime = '2026-08-18T07:45:00+00:00'; // Step D started around 16:48 JST = 07:48 UTC
  const recentWL = await fetchAll('work_logs', 'log_id, job_step_id, job_id, work_date, employee_id, hours_spent, created_at',
    q => q.gte('created_at', syncStartTime)
  );
  console.log(`  Work logs tạo sau ${syncStartTime}: ${recentWL.length}`);
  
  if (recentWL.length > 0) {
    recentWL.slice(0, 5).forEach(wl =>
      console.log(`    date=${wl.work_date} emp=${wl.employee_id?.slice(0,8)} hrs=${wl.hours_spent} created=${wl.created_at}`)
    );
  }

  // ── 4. Tổng hợp work_logs cần xóa: TẤT CẢ recent + linked ──
  const wlToDelete = new Map();
  linkedWL.forEach(wl => wlToDelete.set(wl.log_id, wl));
  recentWL.forEach(wl => wlToDelete.set(wl.log_id, wl)); // ALL recent, not just filtered
  const totalWL = wlToDelete.size;
  console.log(`\n  → Tổng work_logs cần xóa (deduplicated): ${totalWL}`);

  // ── 5. Thực hiện xóa ──
  console.log('\n━━━ XÓA DỮ LIỆU ━━━');
  
  if (COMMIT) {
    // Delete work_logs first (FK constraint)
    if (totalWL > 0) {
      const ids = Array.from(wlToDelete.keys());
      console.log(`  ⏳ Xóa ${ids.length} work_logs...`);
      for (let i = 0; i < ids.length; i += 100) {
        const batch = ids.slice(i, i + 100);
        const { error } = await supabase.from('work_logs').delete().in('log_id', batch);
        if (error) console.error(`  ❌ Error: ${error.message}`);
        else console.log(`  ✓ Batch ${i}-${i + batch.length} deleted`);
      }
    }

    // Delete bad job_steps
    if (badStepIds.length > 0) {
      console.log(`  ⏳ Xóa ${badStepIds.length} bad job_steps...`);
      const { error } = await supabase.from('job_steps').delete().in('step_id', badStepIds);
      if (error) console.error(`  ❌ Error: ${error.message}`);
      else console.log(`  ✓ Deleted ${badStepIds.length} job_steps`);
    }
  }

  // ── Verify counts ──
  const { count: jsCount } = await supabase.from('job_steps').select('step_id', { count: 'exact' });
  const { count: wlCount } = await supabase.from('work_logs').select('log_id', { count: 'exact' });

  console.log('\n════════════════════════════════════════════════════════════════');
  console.log('📊 TỔNG KẾT ROLLBACK:');
  console.log(`  Bad job_steps:  ${badSteps.length} (sẽ xóa)`);
  console.log(`  Bad work_logs:  ${totalWL} (sẽ xóa)`);
  console.log(`  DB hiện tại: job_steps=${jsCount}, work_logs=${wlCount}`);
  console.log(`  Mode: ${COMMIT ? '✅ ĐÃ XÓA' : '⚡ DRY-RUN — Chạy với --commit để xóa'}`);
  console.log('════════════════════════════════════════════════════════════════');
}

main().catch(err => { console.error(err); process.exit(1); });
