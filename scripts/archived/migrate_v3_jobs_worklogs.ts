import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'
import * as crypto from 'crypto'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const [k, ...v] = line.split('=')
      return [k.trim(), v.join('=').trim()]
    })
)

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
const supabase = createClient(supabaseUrl, supabaseKey)

const dir = path.resolve(process.cwd(), 'source_data', 'csv-access-data')
const readFile = (name: string) => {
  try {
    return parse(fs.readFileSync(path.join(dir, name), 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })
  } catch (e) {
    console.warn(`⚠️ Warning: Could not read ${name}`)
    return []
  }
}

async function fetchAll(table: string, columns: string) {
  let allData: any[] = []
  let page = 0
  const pageSize = 1000
  while (true) {
    const { data, error } = await supabase.from(table).select(columns).range(page * pageSize, (page + 1) * pageSize - 1)
    if (error) {
      console.error(`Error fetching ${table}:`, error.message)
      break
    }
    if (!data || data.length === 0) break
    allData = allData.concat(data)
    if (data.length < pageSize) break
    page++
  }
  return allData
}

async function run() {
  console.log('🚀 Bắt đầu tiến trình Migration Jobs, Processing, Worklogs V3 từ CSV...')

  const jobsData = readFile('jobs.csv')
  const processingDeadlineData = readFile('processingdeadline.csv')
  const worklogData = readFile('worklog.csv')

  console.log(`\n⏳ Đang tải cache từ database...`)
  
  // 1. Load job types
  let jobTypes = await fetchAll('job_types', 'job_type_id, job_type_name_ja')
  let typeNameToId = new Map(jobTypes.map(t => [t.job_type_name_ja, t.job_type_id]))
  
  const extractTypeName = (period: string) => {
    if (!period) return 'OTHER'
    if (period.includes('新規型')) return 'NEW_MOLD'
    if (period.includes('新規')) return 'NEW'
    if (period.includes('追加工')) return 'ADDITIONAL_MACHINING'
    if (period.includes('修理')) return 'REPAIR'
    if (period.includes('再生')) return 'REPRODUCTION'
    if (period.includes('その他')) return 'OTHER'
    // Map the mojibake to readable formats if possible based on earlier tests
    if (period.includes('V') && period.includes('K')) return 'NEW'
    if (period.includes('C')) return 'NEW_MOLD'
    if (period.includes('H')) return 'ADDITIONAL_MACHINING'
    return 'OTHER'
  }

  // Ensure default job types exist
  const requiredTypes = ['NEW_MOLD', 'NEW', 'ADDITIONAL_MACHINING', 'REPAIR', 'REPRODUCTION', 'OTHER']
  for (const t of requiredTypes) {
    if (!typeNameToId.has(t)) {
      const newId = crypto.randomUUID()
      const { data, error } = await supabase.from('job_types').insert([{ job_type_id: newId, job_type_name_ja: t, job_type_name_vi: t }]).select('job_type_id').single()
      if (data) {
        typeNameToId.set(t, data.job_type_id)
      } else {
        console.error("Failed to insert job type", t, error?.message)
      }
    }
  }


  const parseDate = (d: string) => {
    if (!d || d.trim() === '') return null
    const parts = d.split(' ')[0].split('/')
    if (parts.length !== 3) return null
    // Assuming MM/DD/YYYY from Access default format, try to parse
    // Some might be M/D/YYYY
    const month = parts[0].padStart(2, '0')
    const day = parts[1].padStart(2, '0')
    let year = parts[2]
    if (year.length === 2) year = '20' + year
    return `${year}-${month}-${day}`
  }

  // 2. Load molds and designs
  const designs = await fetchAll('design_revisions', 'revision_id, legacy_id, mold_master_id, design_code')
  const accessDesignToUuid = new Map(designs.filter(d => d.legacy_id).map(d => [d.legacy_id, d.revision_id]))
  const designToMasterUuid = new Map(designs.map(d => [d.revision_id, d.mold_master_id]))
  // Also build a design_code → revision_id map for fallback lookup
  const designCodeToRevision = new Map(designs.map(d => [d.design_code, d.revision_id]))
  const designCodeToMaster = new Map(designs.map(d => [d.design_code, d.mold_master_id]))

  // 2b. Load mold_masters for fallback lookup by code
  const moldMasters = await fetchAll('mold_masters', 'mold_master_id, mold_master_code')
  const moldMasterCodeToId = new Map(moldMasters.map(m => [m.mold_master_code, m.mold_master_id]))

  // 3. Load jobs (if running multiple times)
  const existingJobs = await fetchAll('jobs', 'job_id, job_code')
  const jobCodeToId = new Map(existingJobs.map(j => [j.job_code, j.job_id]))

  // 3b. Load molddesign CSV for code lookups
  const moldDesignCSV = readFile('molddesign.csv')
  const moldDesignIdToCode = new Map(moldDesignCSV.map((d: any) => [d.MoldDesignID?.toString().trim(), d.MoldDesignCode?.trim()]))

  console.log(`\n⏳ Đang xử lý ${jobsData.length} bản ghi jobs...`)
  let upsertedJobs = 0
  let skippedJobs = 0
  const accessJobIdToUuid = new Map<string, string>()

  for (const j of jobsData) {
    const jobCode = j.JobCode?.trim() || j.JobName?.trim()
    if (!jobCode) continue

    const accessDesignId = j.MoldDesignID?.toString().trim()

    // Try to resolve design_revision_id and mold_master_id through multiple strategies
    let design_revision_id = accessDesignToUuid.get(accessDesignId) || null
    let mold_master_id = design_revision_id ? designToMasterUuid.get(design_revision_id) : null

    // Strategy 2: Look up by design_code from the CSV
    if (!mold_master_id && accessDesignId) {
      const designCode = moldDesignIdToCode.get(accessDesignId)
      if (designCode) {
        design_revision_id = design_revision_id || designCodeToRevision.get(designCode) || null
        mold_master_id = designCodeToMaster.get(designCode) || null
      }
    }

    // Strategy 3: Look up mold_master directly by job code
    if (!mold_master_id) {
      mold_master_id = moldMasterCodeToId.get(jobCode) || null
    }

    // If still no mold_master_id, skip with a warning
    if (!mold_master_id) {
      skippedJobs++
      continue
    }

    const typeName = extractTypeName(j.ReleasePeriod)
    const job_type_id = typeNameToId.get(typeName) || typeNameToId.get('OTHER')

    const payload = {
      job_code: jobCode,
      job_name: j.JobName?.trim() || jobCode,
      job_type_id,
      mold_master_id,
      design_revision_id,
      deadline: parseDate(j.DeliveryDeadline),
      month_period: j.MonthPeriod ? parseInt(j.MonthPeriod) : null,
      notes: j.JobNote?.trim() || null,
      approved: j.Approved === 'TRUE'
    }

    let jId = jobCodeToId.get(jobCode)
    if (jId) {
      // Already exists — just build mapping, skip DB call
      if (j.JobID) accessJobIdToUuid.set(j.JobID.toString().trim(), jId)
      continue
    }

    const { data, error } = await supabase.from('jobs').insert([payload]).select('job_id').single()
    if (error) console.error("Job insert error:", jobCode, error.message)
    if (data) {
      jId = data.job_id
      jobCodeToId.set(jobCode, jId)
    }

    if (jId && j.JobID) {
      accessJobIdToUuid.set(j.JobID.toString().trim(), jId)
    }
    upsertedJobs++
  }
  console.log(`✅ jobs: ${upsertedJobs} mới / ${jobsData.length} tổng (Skipped: ${skippedJobs} không tìm được mold_master)`)

  // 4. Load Employees
  const employees = await fetchAll('employees', 'employee_id, employee_code, legacy_id')
  const accessEmpToUuid = new Map(employees.filter(e => e.legacy_id).map(e => [e.legacy_id, e.employee_id]))
  // Fallback: map by EmployeeID = legacy_id if legacy_id was not explicitly set but employee_code is like 'E01' etc.
  // Assuming employees are already migrated with legacy_id or employee_code

  // 5. Job Steps (incremental)
  // Pre-load all existing job_steps into cache: key = "job_id|step_no" → step_id
  const existingSteps = await fetchAll('job_steps', 'step_id, job_id, step_no')
  const stepKeyToId = new Map(existingSteps.map(s => [`${s.job_id}|${s.step_no}`, s.step_id]))

  console.log(`\n⏳ Đang xử lý ${processingDeadlineData.length} bản ghi job_steps (incremental)...`)
  let newSteps = 0
  const accessDeadlineToStepId = new Map<string, string>()
  // Build a map of step → job for worklogs (avoid per-record queries)
  const stepToJobId = new Map<string, string>()

  for (const pd of processingDeadlineData) {
    const jId = accessJobIdToUuid.get(pd.JobID?.toString().trim())
    if (!jId) continue

    const pItemId = pd.ItemTypeID ? parseInt(pd.ItemTypeID) : null
    const stepKey = `${jId}|${pItemId || 1}`

    // Check if already exists
    let step_id = stepKeyToId.get(stepKey)
    if (step_id) {
      // Already exists — just build mapping
      if (pd.ProcessingDeadlineID) {
        accessDeadlineToStepId.set(pd.ProcessingDeadlineID.toString().trim(), step_id)
        stepToJobId.set(step_id, jId)
      }
      continue
    }

    // Map ItemTypeID → step name (Access convention)
    const ITEM_TYPE_NAMES: Record<number, string> = {
      1: 'OTHER', 2: 'MOLD', 3: 'PLUG', 4: 'CUTTER',
      5: 'FORMING', 6: 'ASSEMBLY', 7: 'INSPECTION', 8: 'PACKING', 9: 'SHIPPING', 10: 'REWORK'
    }
    const stepName = ITEM_TYPE_NAMES[pItemId || 0] || `Step ${pd.ItemTypeID || '1'}`

    // Map processing_status_id → step_status enum
    const psId = pd.ProcessingStatusID ? parseInt(pd.ProcessingStatusID) : null
    let stepStatus = 'PENDING'
    if (psId === 8) stepStatus = 'COMPLETED'       // F.完了
    else if (psId && psId >= 2 && psId <= 7) stepStatus = 'IN_PROGRESS' // Processing stages
    else if (psId === 9) stepStatus = 'IN_PROGRESS' // N.進行中
    else if (psId === 11 || psId === 12 || psId === 13) stepStatus = 'IN_PROGRESS' // Material statuses

    const payload = {
      job_id: jId,
      step_name: stepName,
      step_no: pItemId || 1,
      item_type_id: pItemId,
      step_status: stepStatus,
      processing_status_id: psId,
      deadline: parseDate(pd.ProcessingDeadline),
      estimated_hours: pd.EstimatedHours ? parseFloat(pd.EstimatedHours) : null,
      tehai_info: pd.Tehai?.trim() || null,
      set_info: pd.Set?.trim() || null,
      drawing_receipt_date: parseDate(pd.DrawingReceiptDate)
    }

    const { data, error } = await supabase.from('job_steps').insert([payload]).select('step_id').single()
    if (error) {
      console.error("Job step insert error:", error.message)
    } else if (data) {
      step_id = data.step_id
      stepKeyToId.set(stepKey, step_id)
    }

    if (step_id && pd.ProcessingDeadlineID) {
      accessDeadlineToStepId.set(pd.ProcessingDeadlineID.toString().trim(), step_id)
      stepToJobId.set(step_id, jId)
      newSteps++
    }
  }
  console.log(`✅ job_steps: ${newSteps} mới / ${processingDeadlineData.length} tổng`)

  // 6. Worklogs (incremental)
  // Pre-load existing worklog keys: "step_id|date|employee_id"
  const existingWorklogs = await fetchAll('work_logs', 'log_id, job_step_id, work_date, employee_id')
  const worklogKeySet = new Set(existingWorklogs.map(w => `${w.job_step_id}|${w.work_date}|${w.employee_id}`))

  console.log(`\n⏳ Đang xử lý ${worklogData.length} bản ghi work_logs (incremental)...`)
  let newWorklogs = 0

  for (const w of worklogData) {
    const step_id = accessDeadlineToStepId.get(w.ProcessingDeadlineID?.toString().trim())
    if (!step_id) continue

    let employee_id = accessEmpToUuid.get(w.EmployeeID?.toString().trim())
    if (!employee_id && employees.length > 0) employee_id = employees[0].employee_id
    if (!employee_id) continue

    const work_date = parseDate(w.ProcessingDate) || new Date().toISOString().split('T')[0]
    const wlKey = `${step_id}|${work_date}|${employee_id}`
    if (worklogKeySet.has(wlKey)) continue // Already exists

    const job_id = stepToJobId.get(step_id)
    if (!job_id) continue

    const { error } = await supabase.from('work_logs').insert([{
      job_id,
      job_step_id: step_id,
      employee_id,
      work_date,
      hours_spent: w.ProcessingTime ? parseFloat(w.ProcessingTime) : 0,
      processing_code_id: w.ProcessingCodeID ? parseInt(w.ProcessingCodeID) : null,
      notes: w.ProcessingNotes?.trim() || null,
      quantity_done: w.ProcessingNumbers ? parseInt(w.ProcessingNumbers) : null,
      is_finished: w.Finished === 'TRUE'
    }])
    if (error) console.error("Worklog insert error:", error.message)
    else {
      worklogKeySet.add(wlKey)
      newWorklogs++
    }
  }
  console.log(`✅ work_logs: ${newWorklogs} mới / ${worklogData.length} tổng`)

  console.log(`\n🎉 TIẾN TRÌNH ĐỒNG BỘ SẢN XUẤT (JOBS/WORKLOGS) HOÀN TẤT!`)
}

run().catch(console.error)
