import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = fs.readFileSync('.env.local', 'utf8')
const envMap = {}
env.split('\n').forEach((l) => {
  const m = l.match(/^([^=]+)=(.*)$/)
  if (m) envMap[m[1]] = m[2].trim()
})

const sb = createClient(envMap.NEXT_PUBLIC_SUPABASE_URL, envMap.SUPABASE_SERVICE_ROLE_KEY)

async function fetchAll(table, select) {
  let all = [], from = 0, ps = 1000
  while (true) {
    const { data, error } = await sb.from(table).select(select).range(from, from + ps - 1)
    if (error) { console.error(`Fetch ${table} error:`, error.message); break; }
    if (!data || data.length === 0) break
    all = all.concat(data)
    if (data.length < ps) break
    from += ps
  }
  return all
}

async function analyze() {
  const accessData = JSON.parse(fs.readFileSync('scripts/access_audit_export.json', 'utf8'))
  const [sbJobSteps, sbWorkLogs, sbCompanies, sbEmployees] = await Promise.all([
    fetchAll('job_steps', 'step_id, job_id, legacy_id'),
    fetchAll('work_logs', 'log_id, job_id, legacy_id, work_date'),
    fetchAll('companies', 'company_id, company_code, company_name, legacy_id'),
    fetchAll('employees', 'employee_id, employee_code, employee_name, legacy_id')
  ])

  // Map legacy ids
  const sbStepLegacy = new Set(sbJobSteps.map(s => String(s.legacy_id || '').replace(/^[A-Za-z_-]+/, '')))
  const sbLogLegacy = new Set(sbWorkLogs.map(l => String(l.legacy_id || '').replace(/^[A-Za-z_-]+/, '')))

  const accessJobsMap = new Map(accessData.tblJOB.map(j => [j.JobID, j]))

  // 1. Phân tích 27 Jobs
  const summary = JSON.parse(fs.readFileSync('scripts/access_vs_supabase_audit_summary.json', 'utf8'))
  const unimportedJobs = summary.jobs.unimported_all_keys
  const unimportedJobIdSet = new Set(unimportedJobs.map(j => j.JobID))

  console.log('=== PHÂN TÍCH 27 JOBS CHƯA CÓ TRÊN SUPABASE ===')
  unimportedJobs.forEach((j, idx) => {
    const full = accessJobsMap.get(j.JobID)
    console.log(`${idx + 1}. JobID: ${j.JobID} | Code: ${j.JobCode} | Name: ${j.JobName} | Start: ${j.JobStartDate} | Deadline: ${j.DeliveryDeadline} | CustID: ${full.MachiningCustomerID} | Qty: ${full.JobQuantity}`)
  })

  // 2. Phân tích 81 JobSteps
  const unimportedSteps = accessData.tblProcessingDeadline.filter(d => !sbStepLegacy.has(String(d.ProcessingDeadlineID)))
  console.log(`\n=== PHÂN TÍCH 81 DEADLINES (JOB STEPS) CHƯA CÓ ===`)
  console.log(`Tổng số steps chưa có: ${unimportedSteps.length}`)

  let stepsForNewJobs = 0
  let stepsForExistingJobs = 0
  const existingJobStepJobIds = new Set()

  unimportedSteps.forEach(s => {
    if (unimportedJobIdSet.has(s.JobID)) {
      stepsForNewJobs++
    } else {
      stepsForExistingJobs++
      existingJobStepJobIds.add(s.JobID)
    }
  })
  console.log(`- Thuộc về 27 Jobs MỚI: ${stepsForNewJobs} steps`)
  console.log(`- Thuộc về các Jobs ĐÃ CÓ TRÊN SUPABASE: ${stepsForExistingJobs} steps (trên ${existingJobStepJobIds.size} Jobs cũ bổ sung step)`)

  // 3. Phân tích 311 WorkLogs
  const unimportedLogs = accessData.tblWorkLog.filter(l => !sbLogLegacy.has(String(l.WorkLogID)))
  console.log(`\n=== PHÂN TÍCH 311 WORK LOGS CHƯA CÓ ===`)
  console.log(`Tổng số work logs chưa có: ${unimportedLogs.length}`)

  const logDates = unimportedLogs.map(l => l.ProcessingDate).filter(Boolean).sort()
  console.log(`- Ngày làm việc sớm nhất: ${logDates[0]}`)
  console.log(`- Ngày làm việc muộn nhất: ${logDates[logDates.length - 1]}`)

  // Phân bố theo năm/tháng
  const monthDist = {}
  unimportedLogs.forEach(l => {
    const ym = (l.ProcessingDate || 'UNKNOWN').substring(0, 7)
    monthDist[ym] = (monthDist[ym] || 0) + 1
  })
  console.log('- Phân bố theo tháng:')
  Object.keys(monthDist).sort().forEach(ym => {
    console.log(`  • ${ym}: ${monthDist[ym]} logs`)
  })

  // 4. Phân tích 209 MoldBorrow (Phiếu mượn khuôn)
  console.log(`\n=== PHÂN TÍCH 209 MOLD BORROW (PHIẾU MƯỢN KHUÔN) ===`)
  const borrows = accessData.tblMoldBorrow
  const borrowDates = borrows.map(b => b.CertificateDate).filter(Boolean).sort()
  console.log(`- Ngày cấp sớm nhất: ${borrowDates[0]}`)
  console.log(`- Ngày cấp muộn nhất: ${borrowDates[borrowDates.length - 1]}`)
  
  const distinctBorrowVendors = new Set(borrows.map(b => b.VendorName).filter(Boolean))
  console.log(`- Số lượng vendor/khách hàng mượn: ${distinctBorrowVendors.size}`)
  console.log(`- Danh sách vendor tiêu biểu: ${Array.from(distinctBorrowVendors).slice(0, 10).join(', ')}`)

  // Output full delta object
  const deltaDetails = {
    unimportedJobs,
    unimportedStepsCount: unimportedSteps.length,
    stepsForNewJobs,
    stepsForExistingJobs,
    unimportedLogsCount: unimportedLogs.length,
    logDatesRange: { min: logDates[0], max: logDates[logDates.length - 1] },
    monthDist,
    moldBorrowsCount: borrows.length,
    borrowDatesRange: { min: borrowDates[0], max: borrowDates[borrowDates.length - 1] }
  }
  fs.writeFileSync('scripts/delta_details.json', JSON.stringify(deltaDetails, null, 2))
}

analyze().catch(console.error)
