import pg from 'pg'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf8')
const dbUrl = envContent.match(/^DATABASE_URL=(.*)$/m)[1].trim()
const pool = new pg.Pool({ connectionString: dbUrl })

async function execute() {
  const client = await pool.connect()
  try {
    console.log('=== STEP 1: PREFLIGHT VERIFICATION ===')

    // 1. Check job code conflict
    const conflictRes = await client.query(`
      SELECT count(*) FROM public.jobs WHERE job_code = 'JOB-INTERNAL-SHOP'
    `)
    if (parseInt(conflictRes.rows[0].count) > 0) {
      throw new Error(`ABORT: job_code JOB-INTERNAL-SHOP already exists! Count: ${conflictRes.rows[0].count}`)
    }
    console.log('  [OK] job_code conflict count: 0')

    // 2. Check company YSD
    const compRes = await client.query(`
      SELECT company_id FROM public.companies WHERE company_code = 'YSD'
    `)
    if (compRes.rows.length !== 1) {
      throw new Error(`ABORT: YSD company count mismatch: ${compRes.rows.length}`)
    }
    const companyId = compRes.rows[0].company_id
    console.log(`  [OK] company YSD found: ${companyId}`)

    // 3. Check processing items
    const itemsRes = await client.query(`
      SELECT processing_item_id FROM public.processing_items WHERE processing_item_id IN (1, 7, 10)
    `)
    if (itemsRes.rows.length !== 3) {
      throw new Error(`ABORT: processing_items 1, 7, 10 count mismatch: ${itemsRes.rows.length}`)
    }
    console.log('  [OK] processing_items 1, 7, 10 verified')

    // 4. Check processing status 1
    const statusRes = await client.query(`
      SELECT status_id FROM public.processing_statuses WHERE status_id = 1
    `)
    if (statusRes.rows.length !== 1) {
      throw new Error(`ABORT: processing_status 1 not found`)
    }
    console.log('  [OK] processing_status 1 verified')

    // Baseline counts
    const bJobs = await client.query(`SELECT count(*) FROM public.jobs`)
    const bSteps = await client.query(`SELECT count(*) FROM public.job_steps`)
    const bLogs = await client.query(`SELECT count(*) FROM public.work_logs`)
    console.log(`  [OK] Baseline counts: jobs=${bJobs.rows[0].count}, job_steps=${bSteps.rows[0].count}, work_logs=${bLogs.rows[0].count}`)

    console.log('\n=== STEP 2: EXECUTE TRANSACTION ===')
    await client.query('BEGIN')

    // Insert 1 Job
    const insertJobRes = await client.query(`
      INSERT INTO public.jobs (
        job_code,
        job_name,
        job_category,
        job_status,
        company_id,
        processing_item_id,
        overall_progress,
        priority,
        notes,
        created_at,
        updated_at
      ) VALUES (
        'JOB-INTERNAL-SHOP',
        '社内作業・5S・保全',
        'INTERNAL_OPS',
        'PENDING',
        $1,
        10,
        0,
        5,
        '社内作業・設備保全・5S・治具修理用パイロットジョブ (Internal Shop Pilot Job)',
        NOW(),
        NOW()
      ) RETURNING job_id
    `, [companyId])

    const newJobId = insertJobRes.rows[0].job_id
    console.log(`  [OK] Inserted 1 Job: ${newJobId}`)

    // Insert 4 Steps
    const stepsData = [
      {
        step_no: 1,
        step_name: '5S・工場清掃',
        track: 'FINISH',
        processing_item_id: 10,
        processing_status_id: 1,
        notes: '[Mã công việc: 50] 工場環境整備、清掃、整理整頓 (5S & Factory Cleaning)'
      },
      {
        step_no: 2,
        step_name: '設備・コンプレッサー保全',
        track: 'FINISH',
        processing_item_id: 10,
        processing_status_id: 1,
        notes: '[Mã công việc: 54] 機械設備点検、コンプレッサー給油、定期保全 (Equipment Maintenance)'
      },
      {
        step_no: 3,
        step_name: '金型・治具修理',
        track: 'MOLD',
        processing_item_id: 1,
        processing_status_id: 1,
        notes: '[Mã công việc: 42] 金型溶接補修、プラグ手直し、治具修理 (Mold & Jig Repair)'
      },
      {
        step_no: 4,
        step_name: 'スタッキング木板製作',
        track: 'FINISH',
        processing_item_id: 7,
        processing_status_id: 1,
        notes: '[Mã công việc: 40] スタッキング用木板加工・組み立て (Stacking Board Fabrication)'
      }
    ]

    for (const step of stepsData) {
      await client.query(`
        INSERT INTO public.job_steps (
          job_id,
          step_no,
          step_name,
          step_status,
          track,
          processing_item_id,
          processing_status_id,
          progress_percent,
          actual_hours,
          notes,
          created_at,
          updated_at
        ) VALUES (
          $1, $2, $3, 'PENDING', $4, $5, $6, 0, 0, $7, NOW(), NOW()
        )
      `, [newJobId, step.step_no, step.step_name, step.track, step.processing_item_id, step.processing_status_id, step.notes])
    }
    console.log('  [OK] Inserted 4 Steps')

    // In-transaction validation
    const valRes = await client.query(`
      SELECT 
        j.job_code,
        j.job_status,
        j.overall_progress,
        count(s.step_id) as step_count,
        min(s.step_no) as min_step_no,
        max(s.step_no) as max_step_no,
        count(*) FILTER (WHERE s.step_status = 'PENDING') as pending_steps_count
      FROM public.jobs j
      JOIN public.job_steps s ON j.job_id = s.job_id
      WHERE j.job_id = $1
      GROUP BY j.job_id, j.job_code, j.job_status, j.overall_progress
    `, [newJobId])

    const v = valRes.rows[0]
    if (parseInt(v.step_count) !== 4 || parseInt(v.min_step_no) !== 1 || parseInt(v.max_step_no) !== 4 || parseInt(v.pending_steps_count) !== 4 || v.job_status !== 'PENDING' || parseFloat(v.overall_progress) !== 0) {
      throw new Error(`In-transaction validation failed: ${JSON.stringify(v)}`)
    }
    console.log('  [OK] In-transaction validation passed:', v)

    await client.query('COMMIT')
    console.log('  [OK] Transaction COMMITTED successfully!')

    console.log('\n=== STEP 3: POSTFLIGHT VERIFICATION ===')
    const postJob = await client.query(`
      SELECT count(*) as job_count, max(job_status) as job_status, max(overall_progress) as overall_progress
      FROM public.jobs WHERE job_code = 'JOB-INTERNAL-SHOP'
    `)
    const postSteps = await client.query(`
      SELECT 
        count(*) as step_count,
        min(step_no) as min_step_no,
        max(step_no) as max_step_no,
        count(*) FILTER (WHERE step_status = 'PENDING') as pending_steps_count
      FROM public.job_steps
      WHERE job_id = $1
    `, [newJobId])

    const aJobs = await client.query(`SELECT count(*) FROM public.jobs`)
    const aSteps = await client.query(`SELECT count(*) FROM public.job_steps`)
    const aLogs = await client.query(`SELECT count(*) FROM public.work_logs`)

    const postflightOutput = {
      job_count: parseInt(postJob.rows[0].job_count),
      step_count: parseInt(postSteps.rows[0].step_count),
      min_step_no: parseInt(postSteps.rows[0].min_step_no),
      max_step_no: parseInt(postSteps.rows[0].max_step_no),
      pending_steps_count: parseInt(postSteps.rows[0].pending_steps_count),
      job_status: postJob.rows[0].job_status,
      overall_progress: parseFloat(postJob.rows[0].overall_progress),
      jobs_total_after: parseInt(aJobs.rows[0].count),
      job_steps_total_after: parseInt(aSteps.rows[0].count),
      work_logs_total_after: parseInt(aLogs.rows[0].count)
    }

    console.log('\n=== POSTFLIGHT SUMMARY OUTPUT (EXACT FORMAT) ===')
    console.log(JSON.stringify(postflightOutput, null, 2))

    // Write output to artifact file
    fs.writeFileSync('scripts/postflight_internal_job_result.json', JSON.stringify({
      job_id: newJobId,
      ...postflightOutput,
      executed_at: new Date().toISOString()
    }, null, 2))

  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('TRANSACTION FAILED & ROLLED BACK:', err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

execute().catch(err => {
  console.error('Fatal execution error:', err)
  process.exit(1)
})
