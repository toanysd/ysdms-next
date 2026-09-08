import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pgClient = new Client({ connectionString });

async function main() {
  await pgClient.connect();

  console.log('=== 1. PG DIRECT QUERY ===');
  const res1 = await pgClient.query(`
    SELECT j.job_id, j.job_code, j.job_type_id, j.work_order_id
    FROM public.jobs j
    WHERE j.job_type_id = '11'
    LIMIT 5;
  `);
  console.log('PG Lệnh 1 (jobs job_type_id=11):', res1.rows);

  const res2 = await pgClient.query(`
    SELECT log_id, work_date, quantity_done, quantity_ng, 
           machine_id, is_finished, notes
    FROM public.work_logs
    WHERE quantity_done IS NOT NULL
    ORDER BY created_at DESC
    LIMIT 5;
  `);
  console.log('PG Lệnh 2 (work_logs quantity_done IS NOT NULL):', res2.rows);

  const res3 = await pgClient.query(`
    SELECT js.step_id, js.step_status, js.actual_hours, js.updated_at
    FROM public.job_steps js
    WHERE js.step_status = 'COMPLETED'
      AND js.actual_hours IS NOT NULL
    ORDER BY js.updated_at DESC
    LIMIT 5;
  `);
  console.log('PG Lệnh 3 (job_steps COMPLETED with actual_hours):', res3.rows);

  console.log('\n=== 2. SUPABASE REST API (SERVICE ROLE) ===');
  const adminSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: adminJobs } = await adminSupabase.from('jobs').select('job_id, job_code, job_type_id').eq('job_type_id', '11');
  console.log('Supabase Service Role Jobs (job_type_id=11):', adminJobs);

  const { data: adminLogs } = await adminSupabase.from('work_logs').select('log_id, work_date, quantity_done, quantity_ng, notes').not('quantity_done', 'is', null).limit(5);
  console.log('Supabase Service Role Logs (quantity_done not null):', adminLogs);

  console.log('\n=== 3. SUPABASE REST API (ANON) ===');
  const anonSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: anonJobs, error: anonJobsErr } = await anonSupabase.from('jobs').select('job_id, job_code, job_type_id').eq('job_type_id', '11');
  console.log('Supabase Anon Jobs:', anonJobs, 'Error:', anonJobsErr);

  const { data: anonLogs, error: anonLogsErr } = await anonSupabase.from('work_logs').select('log_id, notes, quantity_done').eq('notes', 'M20 PE Verification Test');
  console.log('Supabase Anon Logs:', anonLogs, 'Error:', anonLogsErr);

  console.log('\n=== 4. CHECK RLS ON TABLES ===');
  const rlsCheck = await pgClient.query(`
    SELECT relname, relrowsecurity 
    FROM pg_class 
    WHERE relname IN ('work_logs', 'jobs', 'job_steps', 'machines');
  `);
  console.table(rlsCheck.rows);

  await pgClient.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
