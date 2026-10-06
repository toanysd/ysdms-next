import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

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

async function runCrossReference() {
  console.log('================================================================')
  console.log('ĐỐI SOÁT CHÉO TOÀN DIỆN: ACCESS ysdJOB_20261006.accdb ↔ SUPABASE PRODUCTION')
  console.log('================================================================\n')

  const accessData = JSON.parse(fs.readFileSync('scripts/access_audit_export.json', 'utf8'))

  // 1. Fetch Supabase Data
  console.log('[1] TẢI DỮ LIỆU TỪ SUPABASE PRODUCTION...')
  const [
    sbWorkOrders,
    sbJobs,
    sbJobSteps,
    sbWorkLogs,
    sbEquipment,
    sbCompanies,
    sbEmployees,
    sbMachines
  ] = await Promise.all([
    fetchAll('work_orders', 'wo_id, wo_code, wo_name, legacy_id, company_id, product_id, deadline, start_date, created_at'),
    fetchAll('jobs', 'job_id, job_code, job_name, legacy_id, work_order_id, company_id, equipment_id, deadline, start_date, created_at'),
    fetchAll('job_steps', 'step_id, job_id, legacy_id, processing_status_id, item_type_id, deadline, step_name'),
    fetchAll('work_logs', 'log_id, job_id, job_step_id, employee_id, legacy_id, work_date, hours_spent, processing_code_id, is_finished'),
    fetchAll('equipment', 'equipment_id, equipment_code, equipment_type, display_name, legacy_id'),
    fetchAll('companies', 'company_id, company_code, company_name, legacy_id'),
    fetchAll('employees', 'employee_id, employee_code, employee_name, legacy_id'),
    fetchAll('machines', 'machine_id, machine_code, machine_name')
  ])

  console.log(`- Supabase work_orders: ${sbWorkOrders.length}`)
  console.log(`- Supabase jobs: ${sbJobs.length}`)
  console.log(`- Supabase job_steps: ${sbJobSteps.length}`)
  console.log(`- Supabase work_logs: ${sbWorkLogs.length}`)
  console.log(`- Supabase equipment: ${sbEquipment.length}`)
  console.log(`- Supabase companies: ${sbCompanies.length}`)
  console.log(`- Supabase employees: ${sbEmployees.length}`)
  console.log(`- Supabase machines: ${sbMachines.length}\n`)

  // 2. Cross-reference tblJOB (1,230) vs work_orders / jobs
  console.log('[2] ĐỐI SOÁT tblJOB (1,230 dòng) ↔ work_orders (1,203) / jobs (1,204)...')
  const accessJobs = accessData.tblJOB
  
  // Maps for Supabase lookup
  const sbJobByLegacyId = new Map()
  const sbJobByCode = new Map()
  const sbWoByLegacyId = new Map()
  const sbWoByCode = new Map()

  sbJobs.forEach(j => {
    if (j.legacy_id) {
      sbJobByLegacyId.set(String(j.legacy_id).trim(), j)
      sbJobByLegacyId.set(String(j.legacy_id).replace(/^JOB-/, '').trim(), j)
    }
    if (j.job_code) sbJobByCode.set(j.job_code.trim().toUpperCase(), j)
  })

  sbWorkOrders.forEach(w => {
    if (w.legacy_id) {
      sbWoByLegacyId.set(String(w.legacy_id).trim(), w)
      sbWoByLegacyId.set(String(w.legacy_id).replace(/^JOB-/, '').trim(), w)
    }
    if (w.wo_code) sbWoByCode.set(w.wo_code.trim().toUpperCase(), w)
  })

  let matchedJobCount = 0
  const unimportedJobs = []
  const duplicateAccessJobCodes = new Map()

  accessJobs.forEach(aj => {
    const jIdStr = String(aj.JobID)
    const jCode = (aj.JobCode || '').trim().toUpperCase()

    if (jCode) {
      duplicateAccessJobCodes.set(jCode, (duplicateAccessJobCodes.get(jCode) || 0) + 1)
    }

    const matchedInJob = sbJobByLegacyId.get(jIdStr) || (jCode ? sbJobByCode.get(jCode) : null)
    const matchedInWo = sbWoByLegacyId.get(jIdStr) || (jCode ? sbWoByCode.get(jCode) : null)

    if (matchedInJob || matchedInWo) {
      matchedJobCount++
    } else {
      unimportedJobs.push(aj)
    }
  })

  console.log(`- Tổng số Jobs trong Access: ${accessJobs.length}`)
  console.log(`- Khớp đã có trên Supabase: ${matchedJobCount}`)
  console.log(`- CHƯA CÓ TRÊN SUPABASE (Mới/Thiếu): ${unimportedJobs.length}`)

  // 3. Cross-reference tblProcessingDeadline (2,527) vs job_steps (2,447)
  console.log('\n[3] ĐỐI SOÁT tblProcessingDeadline (2,527 dòng) ↔ job_steps (2,447)...')
  const accessDeadlines = accessData.tblProcessingDeadline
  const sbStepByLegacyId = new Map()
  sbJobSteps.forEach(s => {
    if (s.legacy_id) {
      const raw = String(s.legacy_id).trim()
      sbStepByLegacyId.set(raw, s)
      const numOnly = raw.replace(/^[A-Za-z_-]+/, '')
      if (numOnly) sbStepByLegacyId.set(numOnly, s)
    }
  })

  let matchedStepCount = 0
  const unimportedSteps = []
  accessDeadlines.forEach(ad => {
    const dIdStr = String(ad.ProcessingDeadlineID)
    if (sbStepByLegacyId.has(dIdStr)) {
      matchedStepCount++
    } else {
      unimportedSteps.push(ad)
    }
  })

  console.log(`- Tổng số Deadlines trong Access: ${accessDeadlines.length}`)
  console.log(`- Khớp đã có trên Supabase: ${matchedStepCount}`)
  console.log(`- CHƯA CÓ TRÊN SUPABASE (Mới/Thiếu): ${unimportedSteps.length}`)

  // 4. Cross-reference tblWorkLog (7,416) vs work_logs (7,105)
  console.log('\n[4] ĐỐI SOÁT tblWorkLog (7,416 dòng) ↔ work_logs (7,105)...')
  const accessWorkLogs = accessData.tblWorkLog
  const sbLogByLegacyId = new Map()
  sbWorkLogs.forEach(l => {
    if (l.legacy_id) {
      const raw = String(l.legacy_id).trim()
      sbLogByLegacyId.set(raw, l)
      const numOnly = raw.replace(/^[A-Za-z_-]+/, '')
      if (numOnly) sbLogByLegacyId.set(numOnly, l)
    }
  })

  let matchedLogCount = 0
  const unimportedLogs = []
  accessWorkLogs.forEach(al => {
    const lIdStr = String(al.WorkLogID)
    if (sbLogByLegacyId.has(lIdStr)) {
      matchedLogCount++
    } else {
      unimportedLogs.push(al)
    }
  })

  console.log(`- Tổng số WorkLogs trong Access: ${accessWorkLogs.length}`)
  console.log(`- Khớp đã có trên Supabase: ${matchedLogCount}`)
  console.log(`- CHƯA CÓ TRÊN SUPABASE (Mới/Thiếu): ${unimportedLogs.length}`)

  // 5. Analyze tblMoldBorrow (209)
  console.log('\n[5] PHÂN TÍCH tblMoldBorrow (209 dòng)...')
  const accessBorrows = accessData.tblMoldBorrow
  console.log(`- Tổng số phiếu mượn khuôn trong Access: ${accessBorrows.length}`)
  console.log(`- Supabase equipment_loans hiện tại: 0 dòng (100% chưa được nạp)`)

  // Save detailed audit report JSON
  const auditSummary = {
    analyzed_at: new Date().toISOString(),
    jobs: {
      access_total: accessJobs.length,
      supabase_total_jobs: sbJobs.length,
      supabase_total_wo: sbWorkOrders.length,
      matched: matchedJobCount,
      unimported_count: unimportedJobs.length,
      unimported_samples: unimportedJobs.slice(0, 10),
      unimported_all_keys: unimportedJobs.map(j => ({ JobID: j.JobID, JobCode: j.JobCode, JobName: j.JobName, JobStartDate: j.JobStartDate, DeliveryDeadline: j.DeliveryDeadline }))
    },
    job_steps: {
      access_total: accessDeadlines.length,
      supabase_total: sbJobSteps.length,
      matched: matchedStepCount,
      unimported_count: unimportedSteps.length,
      unimported_samples: unimportedSteps.slice(0, 10)
    },
    work_logs: {
      access_total: accessWorkLogs.length,
      supabase_total: sbWorkLogs.length,
      matched: matchedLogCount,
      unimported_count: unimportedLogs.length,
      unimported_samples: unimportedLogs.slice(0, 10),
      unimported_dates: {
        min: unimportedLogs.reduce((m, l) => !m || l.ProcessingDate < m ? l.ProcessingDate : m, null),
        max: unimportedLogs.reduce((m, l) => !m || l.ProcessingDate > m ? l.ProcessingDate : m, null)
      }
    },
    mold_borrows: {
      access_total: accessBorrows.length,
      supabase_total: 0,
      samples: accessBorrows.slice(0, 5)
    },
    employees: {
      access_count: accessData.tblEmployee.length,
      supabase_count: sbEmployees.length
    },
    machines: {
      access_count: accessData.tblMachine.length,
      supabase_count: sbMachines.length
    }
  }

  fs.writeFileSync('scripts/access_vs_supabase_audit_summary.json', JSON.stringify(auditSummary, null, 2))
  console.log('\nĐã lưu kết quả chi tiết vào scripts/access_vs_supabase_audit_summary.json!')
}

runCrossReference().catch(console.error)
