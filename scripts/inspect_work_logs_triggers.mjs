import fs from 'fs';
import pg from 'pg';

const env = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = env.match(/^DATABASE_URL=(.*)$/m);
if (dbUrlMatch) {
  const pool = new pg.Pool({ connectionString: dbUrlMatch[1].trim() });
  try {
    const res = await pool.query(`
      SELECT pg_get_functiondef(oid)
      FROM pg_proc
      WHERE proname = 'trg_update_job_status_from_steps';
    `);
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
