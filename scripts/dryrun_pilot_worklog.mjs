import fs from 'fs';
import pg from 'pg';

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = env.match(/^DATABASE_URL=(.*)$/m);
if (!dbUrlMatch) {
  console.error('No DATABASE_URL found');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: dbUrlMatch[1].trim() });

async function dryRun() {
  const client = await pool.connect();
  try {
    console.log('--- 1. PREFLIGHT READ-ONLY ---');
    const preflight = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM jobs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202' AND job_code = 'JOB-INTERNAL-SHOP') AS job_exists,
        (SELECT COUNT(*) FROM job_steps WHERE step_id = '6ba5c7b9-4ec3-4d41-bbd2-057613287bff' AND job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS step_exists,
        (SELECT COUNT(*) FROM employees WHERE employee_id = 'abe82154-2f81-44ec-b76e-11a2db247fca' AND is_active = true) AS employee_exists,
        (SELECT COUNT(*) FROM processing_codes WHERE processing_code_id = 50 AND is_active = true) AS processing_code_exists,
        (SELECT COUNT(*) FROM work_logs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS existing_worklogs_count,
        (SELECT COUNT(*) FROM work_logs) AS work_logs_total_before;
    `);
    console.log('Preflight results:', preflight.rows[0]);

    console.log('\n--- 2. TRANSACTION DRY-RUN (TEST INSERT WITH IMMEDIATE ROLLBACK) ---');
    await client.query('BEGIN');

    const insertRes = await client.query(`
      INSERT INTO public.work_logs (
        job_id,
        job_step_id,
        employee_id,
        work_date,
        hours_spent,
        processing_code_id,
        description,
        notes,
        is_finished,
        quantity_done,
        quantity_ng
      ) VALUES (
        '380d3e19-6074-4701-a0bd-d0e8a2892202',
        '6ba5c7b9-4ec3-4d41-bbd2-057613287bff',
        'abe82154-2f81-44ec-b76e-11a2db247fca',
        '2026-10-06',
        1.0,
        50,
        '5S',
        '金型工場エリアの5S整理整頓・清掃作業実施（Pilot Work Log）',
        false,
        NULL,
        0
      )
      RETURNING log_id, job_id, job_step_id, employee_id, work_date, hours_spent, processing_code_id;
    `);
    console.log('Inserted row (in transaction):', insertRes.rows[0]);

    const postInsertCheck = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM work_logs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS job_worklogs_count,
        (SELECT COUNT(*) FROM work_logs) AS work_logs_total_in_tx,
        (SELECT processing_status_id FROM job_steps WHERE step_id = '6ba5c7b9-4ec3-4d41-bbd2-057613287bff') AS step_processing_status_id;
    `);
    console.log('Post-insert checks (in transaction):', postInsertCheck.rows[0]);

    await client.query('ROLLBACK');
    console.log('SUCCESSFULLY ROLLED BACK! Zero writes committed.');

    console.log('\n--- 3. VERIFY BASELINE PRESERVED AFTER ROLLBACK ---');
    const postRollback = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM work_logs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS job_worklogs_count,
        (SELECT COUNT(*) FROM work_logs) AS work_logs_total_after_rollback,
        (SELECT processing_status_id FROM job_steps WHERE step_id = '6ba5c7b9-4ec3-4d41-bbd2-057613287bff') AS step_processing_status_id;
    `);
    console.log('Post-rollback checks:', postRollback.rows[0]);

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Dry-run error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

dryRun();
