import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();

  console.log('--- 1. Check current connection DB name & host ---');
  const dbInfo = await client.query(`SELECT current_database(), current_user, inet_server_addr(), inet_server_port();`);
  console.table(dbInfo.rows);

  console.log('--- 2. ALL work_logs created recently ---');
  const logsRes = await client.query(`
    SELECT log_id, work_date, hours_spent, quantity_done, quantity_ng, machine_id, notes, created_at
    FROM public.work_logs
    ORDER BY created_at DESC
    LIMIT 5;
  `);
  console.table(logsRes.rows);

  console.log('--- 3. Exact query PE ran ---');
  const peRes = await client.query(`
    SELECT log_id, work_date, hours_spent, quantity_done, quantity_ng, 
           machine_id IS NOT NULL AS has_machine, is_finished
    FROM public.work_logs
    WHERE notes = 'M20 PE Verification Test';
  `);
  console.table(peRes.rows);

  console.log('--- 4. Exact job PE queried (21477d1e) ---');
  const jobRes = await client.query(`
    SELECT job_id, job_code, job_type_id, job_category, created_at
    FROM public.jobs
    WHERE job_id::text LIKE '21477d1e%';
  `);
  console.table(jobRes.rows);

  await client.end();
}

main().catch(console.error);
