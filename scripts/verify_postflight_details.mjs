import pg from 'pg'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const dbUrl = envContent.match(/^DATABASE_URL=(.*)$/m)[1].trim()
const pool = new pg.Pool({ connectionString: dbUrl })

async function run() {
  const client = await pool.connect()
  try {
    console.log('=== 1. CREATED JOB RECORD ===')
    const j = await client.query(`
      SELECT j.job_id, j.job_code, j.job_name, j.job_category, j.job_status, j.overall_progress, j.company_id, c.company_code, c.company_name
      FROM public.jobs j
      LEFT JOIN public.companies c ON j.company_id = c.company_id
      WHERE j.job_code = 'JOB-INTERNAL-SHOP'
    `)
    console.log(JSON.stringify(j.rows, null, 2))

    console.log('\n=== 2. CREATED 4 JOB STEPS ===')
    const s = await client.query(`
      SELECT s.step_id, s.step_no, s.step_name, s.step_status, s.track, s.processing_item_id, pi.item_name, s.processing_status_id, ps.status_code, s.progress_percent, s.actual_hours, s.notes
      FROM public.job_steps s
      JOIN public.jobs j ON s.job_id = j.job_id
      LEFT JOIN public.processing_items pi ON s.processing_item_id = pi.processing_item_id
      LEFT JOIN public.processing_statuses ps ON s.processing_status_id = ps.status_id
      WHERE j.job_code = 'JOB-INTERNAL-SHOP'
      ORDER BY s.step_no
    `)
    console.log(JSON.stringify(s.rows, null, 2))

    console.log('\n=== 3. PRODUCTION TOTAL COUNTS ===')
    const jobsTotal = await client.query(`SELECT count(*) FROM public.jobs`)
    const stepsTotal = await client.query(`SELECT count(*) FROM public.job_steps`)
    const logsTotal = await client.query(`SELECT count(*) FROM public.work_logs`)
    console.log({
      jobs_total_after: parseInt(jobsTotal.rows[0].count),
      job_steps_total_after: parseInt(stepsTotal.rows[0].count),
      work_logs_total_after: parseInt(logsTotal.rows[0].count)
    })

  } finally {
    client.release()
    await pool.end()
  }
}

run().catch(err => {
  console.error('Error in postflight verification:', err)
  process.exit(1)
})
