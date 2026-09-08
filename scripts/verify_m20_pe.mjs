import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/verify_m20_pe.mjs');
  process.exit(1);
}

const client = new Client({ connectionString });

async function main() {
  await client.connect();

  try {
    console.log('=== CHỈ THỊ #033: THỰC HIỆN VERIFICATION TEST THỰC TẾ TRÊN LIVE DB ===');

    // 1. Kiểm tra job có job_type_id = '11'
    const jobCheck = await client.query(`
      SELECT j.job_id, j.job_code, j.job_type_id, js.step_id
      FROM public.jobs j
      JOIN public.job_steps js ON js.job_id = j.job_id
      WHERE j.job_type_id = '11'
      LIMIT 1;
    `);

    let jobId, stepId;

    if (jobCheck.rows.length > 0) {
      jobId = jobCheck.rows[0].job_id;
      stepId = jobCheck.rows[0].step_id;
      console.log(`Đã tìm thấy Job THERMOFORMING có sẵn: ${jobCheck.rows[0].job_code} (Job: ${jobId}, Step: ${stepId})`);
    } else {
      console.log('Chưa có Job nào có job_type_id = 11. Đang tạo 1 Job test + 1 Step test...');
      
      // Lấy 1 work_order thực tế để liên kết (ví dụ WO-L-1248 hoặc bất kỳ)
      const woRes = await client.query(`SELECT wo_id FROM public.work_orders WHERE wo_code = 'WO-L-1248' LIMIT 1;`);
      const woId = woRes.rows.length > 0 ? woRes.rows[0].wo_id : null;

      const jobInsert = await client.query(`
        INSERT INTO public.jobs (
          work_order_id, job_code, job_name, job_category, job_type_id, job_status
        ) VALUES (
          $1, 'JOB-TH-LIVE-001', '成形生産: Live Verification Job', 'THERMOFORMING', '11', 'IN_PROGRESS'
        ) RETURNING job_id;
      `, [woId]);
      jobId = jobInsert.rows[0].job_id;

      const stepInsert = await client.query(`
        INSERT INTO public.job_steps (
          job_id, step_no, step_name, step_status
        ) VALUES (
          $1, 1, '本成形・検品工程', 'IN_PROGRESS'
        ) RETURNING step_id;
      `, [jobId]);
      stepId = stepInsert.rows[0].step_id;

      console.log(`Đã tạo Job mới: JOB-TH-LIVE-001 (Job: ${jobId}, Step: ${stepId})`);
    }

    // 2. Lấy 1 employee thực tế
    const empRes = await client.query(`SELECT employee_id, employee_name FROM public.employees WHERE is_active = true LIMIT 1;`);
    const employeeId = empRes.rows[0].employee_id;
    console.log(`Employee thực hiện: ${empRes.rows[0].employee_name} (${employeeId})`);

    // 3. Lấy 1 thermoforming machine thực tế (MACH-1)
    const machRes = await client.query(`SELECT machine_id, machine_code, machine_name FROM public.machines WHERE machine_type = '成形' AND is_active = true LIMIT 1;`);
    const machineId = machRes.rows[0].machine_id;
    console.log(`Machine thực hiện: ${machRes.rows[0].machine_code} - ${machRes.rows[0].machine_name} (${machineId})`);

    // 4. Xóa bản ghi test cũ nếu có cùng note để đảm bảo tính idempotent
    await client.query(`DELETE FROM public.work_logs WHERE notes = 'M20 PE Verification Test';`);

    // 5. Bước V1: Insert work_log thực tế (KHÔNG ROLLBACK)
    console.log('\n--- Bước V1: Đang insert work_log thực tế (quantity_done=150, quantity_ng=2, hours_spent=3.5)... ---');
    const insertSql = `
      INSERT INTO public.work_logs (
        job_id, job_step_id, employee_id, work_date, hours_spent, 
        quantity_done, quantity_ng, machine_id, is_finished, notes
      ) VALUES (
        $1, $2, $3, '2026-09-08', 
        3.5, 150, 2, $4, false, 'M20 PE Verification Test'
      ) RETURNING log_id, work_date, hours_spent, quantity_done, quantity_ng, machine_id, is_finished, notes;
    `;
    const insertRes = await client.query(insertSql, [jobId, stepId, employeeId, machineId]);
    console.log('✅ INSERT thành công!');

    // 6. Bước V2: Query verification theo đúng lệnh PE yêu cầu
    console.log('\n--- Bước V2: Query xác minh trên Live DB theo lệnh PE ---');
    const verifySql = `
      SELECT log_id, work_date, hours_spent, quantity_done, quantity_ng, 
             machine_id IS NOT NULL AS has_machine, is_finished
      FROM public.work_logs
      WHERE notes = 'M20 PE Verification Test';
    `;
    const verifyRes = await client.query(verifySql);
    console.table(verifyRes.rows);

    console.log('\n🎉 DỮ LIỆU ĐÃ TỒN TẠI THỰC TẾ TRÊN SUPABASE LIVE DB. SẴN SÀNG ĐỂ PE QUERY TRỰC TIẾP!');
  } catch (err) {
    console.error('Error executing verification:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
