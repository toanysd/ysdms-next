import pg from 'pg'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const dbUrl = envContent.match(/^DATABASE_URL=(.*)$/m)[1].trim()
const pool = new pg.Pool({ connectionString: dbUrl })

async function runPreflight() {
  const client = await pool.connect()
  try {
    console.log('=== RUNNING PREFLIGHT READ-ONLY QUERIES ===\n')

    // 1.1. Check job code conflict
    const q1 = await client.query(`
      SELECT count(*) AS job_code_conflict_count 
      FROM public.jobs 
      WHERE job_code = 'JOB-INTERNAL-SHOP'
    `)
    console.log('1.1. Conflict check (JOB-INTERNAL-SHOP):', q1.rows[0])

    // 1.2. Check company YSD
    const q2 = await client.query(`
      SELECT company_id, company_code, company_name 
      FROM public.companies 
      WHERE company_code = 'YSD'
    `)
    console.log('1.2. Company YSD (must be 1):', q2.rows.length, q2.rows[0])

    // 1.3. Check processing_items 1, 7, 10
    const q3 = await client.query(`
      SELECT processing_item_id, item_name 
      FROM public.processing_items 
      WHERE processing_item_id IN (1, 7, 10)
      ORDER BY processing_item_id
    `)
    console.log('1.3. Processing items 1, 7, 10 (must be 3):', q3.rows.length, q3.rows)

    // 1.4. Check processing_codes 40, 42, 50, 54
    const q4 = await client.query(`
      SELECT processing_code_id, processing_name, department_code, category 
      FROM public.processing_codes 
      WHERE processing_code_id IN (40, 42, 50, 54)
      ORDER BY processing_code_id
    `)
    console.log('1.4. Processing codes 40, 42, 50, 54 (must be 4):', q4.rows.length, q4.rows)

    // 1.5. Check processing status 1 (0.未確認)
    const q5 = await client.query(`
      SELECT status_id, status_code, status_name_vi 
      FROM public.processing_statuses 
      WHERE status_id = 1
    `)
    console.log('1.5. Processing status 1 (0.未確認):', q5.rows.length, q5.rows[0])

    // 1.6. Baseline check: Verify no changes in jobs and job_steps
    const qJobs = await client.query(`SELECT count(*) FROM public.jobs`)
    const qSteps = await client.query(`SELECT count(*) FROM public.job_steps`)
    const qLogs = await client.query(`SELECT count(*) FROM public.work_logs`)
    console.log(`\n1.6. Production baseline counts: jobs=${qJobs.rows[0].count}, job_steps=${qSteps.rows[0].count}, work_logs=${qLogs.rows[0].count}`)

  } finally {
    client.release()
    await pool.end()
  }
}

runPreflight().catch(err => {
  console.error('Error running preflight:', err)
  process.exit(1)
})
