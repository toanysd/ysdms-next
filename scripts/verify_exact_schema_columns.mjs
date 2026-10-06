import pg from 'pg'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const dbUrl = envContent.match(/^DATABASE_URL=(.*)$/m)[1].trim()
const pool = new pg.Pool({ connectionString: dbUrl })

async function run() {
  const client = await pool.connect()
  try {
    console.log('=== 1. VERIFY COLUMNS: JOBS ===')
    const jobCols = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'jobs'
      ORDER BY ordinal_position
    `)
    const jobColMap = Object.fromEntries(jobCols.rows.map(c => [c.column_name, c]))
    console.log('Jobs total columns:', jobCols.rows.length)
    console.log('Payload job columns verification:')
    const payloadJobCols = ['job_code', 'job_name', 'job_category', 'job_status', 'company_id', 'is_facility_job', 'overall_progress', 'notes', 'created_at', 'updated_at']
    for (const col of payloadJobCols) {
      if (jobColMap[col]) {
        console.log(`  [OK] ${col}: data_type=${jobColMap[col].data_type}, nullable=${jobColMap[col].is_nullable}, default=${jobColMap[col].column_default}`)
      } else {
        console.log(`  [MISSING] ${col} DOES NOT EXIST IN JOBS TABLE!`)
      }
    }

    console.log('\n=== 2. ALL COLUMNS IN JOB_STEPS ===')
    const stepCols = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'job_steps'
      ORDER BY ordinal_position
    `)
    for (const r of stepCols.rows) {
      console.log(`  ${r.column_name} (${r.data_type}, nullable=${r.is_nullable}, default=${r.column_default})`)
    }


    console.log('\n=== ALL COLUMNS IN JOBS ===')
    for (const r of jobCols.rows) {
      console.log(`  ${r.column_name} (${r.data_type}, nullable=${r.is_nullable}, default=${r.column_default})`)
    }


    console.log('\n=== 3. PREFLIGHT VERIFICATION: EXISTING DATA & ENUMS ===')
    // 3.1. JOB-INTERNAL-SHOP existence
    const jobExists = await client.query(`SELECT count(*) FROM jobs WHERE job_code = 'JOB-INTERNAL-SHOP'`)
    console.log('Existing count of JOB-INTERNAL-SHOP:', jobExists.rows[0].count)

    // 3.2. Company YSD
    const ysdComp = await client.query(`SELECT company_id, company_code, company_name FROM companies WHERE company_code = 'YSD'`)
    console.log('Company YSD count:', ysdComp.rows.length, ysdComp.rows)

    // 3.3. Processing codes 40, 42, 50, 54
    const codes = await client.query(`
      SELECT processing_code_id, processing_name, department_code, category 
      FROM processing_codes 
      WHERE processing_code_id IN (40, 42, 50, 54)
      ORDER BY processing_code_id
    `)
    console.log('Processing codes count:', codes.rows.length, codes.rows)

    // 3.4. Processing items 1, 7, 10
    const items = await client.query(`
      SELECT processing_item_id, item_name 
      FROM processing_items 
      WHERE processing_item_id IN (1, 7, 10)
      ORDER BY processing_item_id
    `)
    console.log('Processing items count:', items.rows.length, items.rows)

    // 3.5. Baseline row counts on jobs and job_steps
    const jobsCount = await client.query(`SELECT count(*) FROM jobs`)
    const stepsCount = await client.query(`SELECT count(*) FROM job_steps`)
    console.log(`\nBASELINE ROW COUNTS: jobs=${jobsCount.rows[0].count}, job_steps=${stepsCount.rows[0].count}`)

  } finally {
    client.release()
    await pool.end()
  }
}

run().catch(err => {
  console.error('Error verifying schema columns:', err)
  process.exit(1)
})
