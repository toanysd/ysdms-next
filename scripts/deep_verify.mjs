import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf8')
const envMap = {}
env.split('\n').forEach((l) => {
  const m = l.match(/^([^=]+)=(.*)$/)
  if (m) envMap[m[1]] = m[2].trim()
})

const sb = createClient(envMap.NEXT_PUBLIC_SUPABASE_URL, envMap.SUPABASE_SERVICE_ROLE_KEY)

async function deepVerify() {
  const accessData = JSON.parse(fs.readFileSync('scripts/access_audit_export.json', 'utf8'))

  // 1. Kiểm tra tính duy nhất (Uniqueness) trong Access
  const jobIds = accessData.tblJOB.map(j => j.JobID)
  const jobCodes = accessData.tblJOB.map(j => j.JobCode).filter(Boolean)
  const deadlineIds = accessData.tblProcessingDeadline.map(d => d.ProcessingDeadlineID)
  const workLogIds = accessData.tblWorkLog.map(w => w.WorkLogID)
  const borrowIds = accessData.tblMoldBorrow.map(b => b.MoldBorrowID)

  console.log('--- KIỂM TRA TÍNH DUY NHẤT (UNIQUENESS TRONG ACCESS) ---')
  console.log(`- tblJOB: ${jobIds.length} rows, unique JobID: ${new Set(jobIds).size}`)
  console.log(`- tblJOB: ${jobCodes.length} non-null JobCode, unique JobCode: ${new Set(jobCodes).size}`)
  
  // Find duplicate job codes if any
  const codeCounts = {}
  jobCodes.forEach(c => codeCounts[c] = (codeCounts[c] || 0) + 1)
  const dupCodes = Object.keys(codeCounts).filter(c => codeCounts[c] > 1)
  console.log(`- Duplicate JobCodes in Access: ${dupCodes.length} (Examples: ${dupCodes.slice(0, 5).join(', ')})`)

  console.log(`- tblProcessingDeadline: ${deadlineIds.length} rows, unique ProcessingDeadlineID: ${new Set(deadlineIds).size}`)
  console.log(`- tblWorkLog: ${workLogIds.length} rows, unique WorkLogID: ${new Set(workLogIds).size}`)
  console.log(`- tblMoldBorrow: ${borrowIds.length} rows, unique MoldBorrowID: ${new Set(borrowIds).size}`)

  // 2. Kiểm tra design_revisions & products trong Supabase
  const { count: designRevCount } = await sb.from('design_revisions').select('*', { count: 'exact', head: true })
  console.log(`\n--- SUPABASE DESIGN REVISIONS ---`)
  console.log(`- Supabase design_revisions: ${designRevCount} rows`)

  // 3. Phân tích 7 Jobs cũ có 26 steps mới
  const summary = JSON.parse(fs.readFileSync('scripts/access_vs_supabase_audit_summary.json', 'utf8'))
  const unimportedJobIdSet = new Set(summary.jobs.unimported_all_keys.map(j => j.JobID))
  const accessJobsMap = new Map(accessData.tblJOB.map(j => [j.JobID, j]))
  
  const sbStepLegacy = new Set()
  let from = 0
  while (true) {
    const { data } = await sb.from('job_steps').select('legacy_id').range(from, from + 999)
    if (!data || data.length === 0) break
    data.forEach(s => {
      if (s.legacy_id) {
        sbStepLegacy.add(String(s.legacy_id).replace(/^[A-Za-z_-]+/, ''))
      }
    })
    if (data.length < 1000) break
    from += 1000
  }

  const stepsForExistingJobs = accessData.tblProcessingDeadline.filter(d => !sbStepLegacy.has(String(d.ProcessingDeadlineID)) && !unimportedJobIdSet.has(d.JobID))
  const existingJobMapWithSteps = {}
  stepsForExistingJobs.forEach(s => {
    existingJobMapWithSteps[s.JobID] = (existingJobMapWithSteps[s.JobID] || []).concat(s)
  })

  console.log(`\n--- 7 JOBS ĐÃ CÓ NHƯNG BỔ SUNG 26 STEPS MỚI ---`)
  Object.keys(existingJobMapWithSteps).forEach(jId => {
    const job = accessJobsMap.get(parseInt(jId)) || {}
    console.log(`- JobID ${jId} (${job.JobCode} - ${job.JobName}): ${existingJobMapWithSteps[jId].length} steps mới`)
  })
}

deepVerify().catch(console.error)
