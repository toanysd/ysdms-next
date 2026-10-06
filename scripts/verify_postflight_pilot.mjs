import fs from 'fs';
import pg from 'pg';

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrl = env.match(/^DATABASE_URL=(.*)$/m)[1].trim();
const pool = new pg.Pool({ connectionString: dbUrl });

async function verify() {
  const client = await pool.connect();
  try {
    const log = await client.query(`
      SELECT log_id, job_id, job_step_id, employee_id, work_date, hours_spent, processing_code_id, description, notes, is_finished, created_at
      FROM work_logs
      WHERE log_id = '9101a00b-2305-4185-a12e-4407fa8b47dd'
    `);
    console.log('WORK LOG VERIFIED:', log.rows[0]);

    const steps = await client.query(`
      SELECT step_id, step_no, step_name, step_status, processing_status_id, actual_hours
      FROM job_steps
      WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202'
      ORDER BY step_no
    `);
    console.log('STEPS VERIFIED:', steps.rows);

    const job = await client.query(`
      SELECT job_id, job_code, job_status, overall_progress
      FROM jobs
      WHERE job_id = '380d3e19-6074-4701-a0bd-d0e8a2892202'
    `);
    console.log('JOB VERIFIED:', job.rows[0]);

    const totalLogs = await client.query(`
      SELECT COUNT(*) AS total_work_logs FROM work_logs
    `);
    console.log('TOTAL WORK LOGS ON PRODUCTION:', totalLogs.rows[0].total_work_logs);
  } finally {
    client.release();
    await pool.end();
  }
}

verify();
