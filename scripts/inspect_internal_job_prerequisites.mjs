import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import pg from 'pg'


let dbUrl = process.env.DATABASE_URL
if (!dbUrl) {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  for (const line of envContent.split(/\r?\n/)) {
    const match = line.match(/^DATABASE_URL=(.*)$/)
    if (match) {
      dbUrl = match[1].trim()
      break
    }
  }
}

const pool = new pg.Pool({ connectionString: dbUrl })

async function inspect() {
  const client = await pool.connect()
  try {
    console.log('=== 1. CHECK CONFLICT: job_code ===')
    const existingJobs = await client.query(`
      SELECT job_id, job_code, job_name, job_status, created_at 
      FROM jobs 
      WHERE job_code = 'JOB-INTERNAL-SHOP' OR job_code ILIKE '%INTERNAL%'
    `)
    console.log('Existing jobs matching INTERNAL:', existingJobs.rows)

    console.log('\n=== 2. JOBS TABLE CONSTRAINTS & COLUMNS ===')
    const jobCols = await client.query(`
      SELECT column_name, data_type, udt_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'jobs'
      ORDER BY ordinal_position
    `)
    console.log('Jobs columns count:', jobCols.rows.length)
    const requiredJobCols = jobCols.rows.filter(c => c.is_nullable === 'NO' && !c.column_default)
    console.log('Required Jobs columns (is_nullable=NO, no default):', requiredJobCols)

    console.log('\n=== 3. CHECK ENUMS / CONSTRAINTS ON JOBS ===')
    const jobConstraints = await client.query(`
      SELECT conname, pg_get_constraintdef(c.oid) as def
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      WHERE t.relname = 'jobs' AND c.contype = 'c'
    `)
    console.log('Check constraints on jobs:', jobConstraints.rows)

    const jobCategoryDist = await client.query(`
      SELECT job_category, count(*) FROM jobs GROUP BY job_category ORDER BY count(*) DESC
    `)
    console.log('Distinct job_category values in jobs:', jobCategoryDist.rows)

    const jobStatusDist = await client.query(`
      SELECT job_status, count(*) FROM jobs GROUP BY job_status ORDER BY count(*) DESC
    `)
    console.log('Distinct job_status values in jobs:', jobStatusDist.rows)

    console.log('\n=== 4. JOB_STEPS TABLE CONSTRAINTS & COLUMNS ===')
    const stepCols = await client.query(`
      SELECT column_name, data_type, udt_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'job_steps'
      ORDER BY ordinal_position
    `)
    const requiredStepCols = stepCols.rows.filter(c => c.is_nullable === 'NO' && !c.column_default)
    console.log('Required job_steps columns (is_nullable=NO, no default):', requiredStepCols)

    const stepConstraints = await client.query(`
      SELECT conname, pg_get_constraintdef(c.oid) as def
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      WHERE t.relname = 'job_steps' AND c.contype = 'c'
    `)
    console.log('Check constraints on job_steps:', stepConstraints.rows)

    const stepStatusDist = await client.query(`
      SELECT step_status, count(*) FROM job_steps GROUP BY step_status ORDER BY count(*) DESC
    `)
    console.log('Distinct step_status values in job_steps:', stepStatusDist.rows)

    console.log('\n=== 5. PROCESSING CODES COLUMNS & VALUES ===')
    const pcCols = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'processing_codes'
      ORDER BY ordinal_position
    `)
    console.log('processing_codes columns:', pcCols.rows)

    const allCodes = await client.query(`
      SELECT * FROM processing_codes ORDER BY 1 LIMIT 50
    `)
    console.log('Sample processing_codes:', allCodes.rows)


    console.log('\n=== 6. PROCESSING STATUSES & PROCESSING ITEMS ===')
    const hasStatuses = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'processing_statuses'
      ) as exists
    `)
    if (hasStatuses.rows[0].exists) {
      const statuses = await client.query(`SELECT * FROM processing_statuses ORDER BY 1 LIMIT 10`)
      console.log('processing_statuses sample:', statuses.rows)
    } else {
      console.log('processing_statuses table does not exist.')
    }

    const hasItems = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'processing_items'
      ) as exists
    `)
    if (hasItems.rows[0].exists) {
      const items = await client.query(`SELECT * FROM processing_items ORDER BY 1 LIMIT 10`)
      console.log('processing_items sample:', items.rows)
    } else {
      console.log('processing_items table does not exist.')
    }

    console.log('\n=== 7. CHECK YSD INTERNAL COMPANY ID ===')
    const ysdComp = await client.query(`
      SELECT company_id, company_code, company_name 
      FROM companies 
      WHERE company_code ILIKE '%YSD%' OR company_name ILIKE '%YSD%' OR company_name ILIKE '%ヤマダ%'
      LIMIT 5
    `)
    console.log('YSD company records:', ysdComp.rows)

  } finally {
    client.release()
    await pool.end()
  }
}

inspect().catch(err => {
  console.error('Error during inspection:', err)
  process.exit(1)
})
