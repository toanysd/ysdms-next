import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const client = new Client({ connectionString });

async function main() {
  await client.connect();

  console.log('--- 1. Cập nhật is_finished & step_status COMPLETED cho Step test ---');
  await client.query(`
    UPDATE public.work_logs
    SET is_finished = true
    WHERE notes = 'M20 PE Verification Test';
  `);

  await client.query(`
    UPDATE public.job_steps
    SET step_status = 'COMPLETED',
        actual_hours = 3.5,
        updated_at = NOW()
    WHERE step_id = '41ad0522-58ce-4627-8484-0897be9c0728';
  `);

  console.log('\n============================= LỆNH 1 =============================');
  console.log('SELECT j.job_id, j.job_code, j.job_type_id, j.work_order_id FROM public.jobs j WHERE j.job_type_id = \'11\' LIMIT 5;');
  const res1 = await client.query(`
    SELECT j.job_id, j.job_code, j.job_type_id, j.work_order_id 
    FROM public.jobs j 
    WHERE j.job_type_id = '11' 
    LIMIT 5;
  `);
  console.table(res1.rows);
  console.log(JSON.stringify(res1.rows, null, 2));

  console.log('\n============================= LỆNH 2 =============================');
  console.log('SELECT log_id, work_date, quantity_done, quantity_ng, machine_id, is_finished, notes FROM public.work_logs WHERE quantity_done IS NOT NULL ORDER BY created_at DESC LIMIT 5;');
  const res2 = await client.query(`
    SELECT log_id, work_date, quantity_done, quantity_ng, machine_id, is_finished, notes 
    FROM public.work_logs 
    WHERE quantity_done IS NOT NULL 
    ORDER BY created_at DESC 
    LIMIT 5;
  `);
  console.table(res2.rows);
  console.log(JSON.stringify(res2.rows, null, 2));

  console.log('\n============================= LỆNH 3 =============================');
  console.log('SELECT js.step_id, js.step_status, js.actual_hours, js.updated_at FROM public.job_steps js WHERE js.step_status = \'COMPLETED\' AND js.actual_hours IS NOT NULL ORDER BY js.updated_at DESC LIMIT 5;');
  const res3 = await client.query(`
    SELECT js.step_id, js.step_status, js.actual_hours, js.updated_at 
    FROM public.job_steps js 
    WHERE js.step_status = 'COMPLETED' AND js.actual_hours IS NOT NULL 
    ORDER BY js.updated_at DESC 
    LIMIT 5;
  `);
  console.table(res3.rows);
  console.log(JSON.stringify(res3.rows, null, 2));

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
