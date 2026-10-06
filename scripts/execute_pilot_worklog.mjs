import fs from 'fs';
import pg from 'pg';

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = env.match(/^DATABASE_URL=(.*)$/m);
if (!dbUrlMatch) {
  console.error('No DATABASE_URL found');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString: dbUrlMatch[1].trim() });

async function executePilot() {
  const client = await pool.connect();
  try {
    console.log('=== PREFLIGHT CHECK ===');
    const preflight = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM jobs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202' AND job_code = 'JOB-INTERNAL-SHOP') AS job_exists,
        (SELECT COUNT(*) FROM job_steps WHERE step_id = '6ba5c7b9-4ec3-4d41-bbd2-057613287bff' AND job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS step_exists,
        (SELECT COUNT(*) FROM employees WHERE employee_id = 'abe82154-2f81-44ec-b76e-11a2db247fca' AND is_active = true) AS employee_exists,
        (SELECT COUNT(*) FROM processing_codes WHERE processing_code_id = 50 AND is_active = true) AS processing_code_exists,
        (SELECT COUNT(*) FROM work_logs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS existing_worklogs_count,
        (SELECT COUNT(*) FROM work_logs) AS work_logs_total_before;
    `);
    const pf = preflight.rows[0];
    console.log('Preflight results:', pf);

    if (
      Number(pf.job_exists) !== 1 ||
      Number(pf.step_exists) !== 1 ||
      Number(pf.employee_exists) !== 1 ||
      Number(pf.processing_code_exists) !== 1 ||
      Number(pf.existing_worklogs_count) !== 0 ||
      Number(pf.work_logs_total_before) !== 7105
    ) {
      throw new Error(`Preflight assertion failed: ${JSON.stringify(pf)}`);
    }

    console.log('=== EXECUTING FAIL-CLOSED TRANSACTION ===');
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
    console.log('Inserted row:', insertRes.rows[0]);

    const postflight = await client.query(`
      SELECT 
        1 AS pilot_log_count,
        (SELECT COUNT(*) FROM work_logs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS job_worklogs_count,
        (SELECT COUNT(*) FROM work_logs) AS work_logs_total_after,
        (SELECT processing_status_id FROM job_steps WHERE step_id = '6ba5c7b9-4ec3-4d41-bbd2-057613287bff') AS step_processing_status_id,
        (SELECT step_status FROM job_steps WHERE step_id = '6ba5c7b9-4ec3-4d41-bbd2-057613287bff') AS step_status_after,
        (SELECT job_status FROM jobs WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202') AS job_status_after,
        (SELECT actual_hours FROM job_steps WHERE step_id = '6ba5c7b9-4ec3-4d41-bbd2-057613287bff') AS step_actual_hours_after;
    `);
    const pst = postflight.rows[0];
    console.log('Postflight checks:', pst);

    if (
      Number(pst.job_worklogs_count) !== 1 ||
      Number(pst.work_logs_total_after) !== 7106
    ) {
      throw new Error(`Postflight assertion failed: ${JSON.stringify(pst)}`);
    }

    await client.query('COMMIT');
    console.log('TRANSACTION COMMITTED SUCCESSFULLY!');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Execution aborted and rolled back:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

executePilot();
