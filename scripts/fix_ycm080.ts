// Script to fix YCM-080 missing data - insert mold_master, design_revision, physical_mold, job, job_steps
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

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
  try { return parse(fs.readFileSync(path.join(dir, name), 'utf-8'), { columns: true, skip_empty_lines: true, bom: true }) }
  catch { return [] }
}

const parseDate = (d: string) => {
  if (!d || d.trim() === '') return null
  const parts = d.split(' ')[0].split('/')
  if (parts.length !== 3) return null
  const month = parts[0].padStart(2, '0')
  const day = parts[1].padStart(2, '0')
  let year = parts[2]
  if (year.length === 2) year = '20' + year
  return `${year}-${month}-${day}`
}

async function run() {
  console.log('🔧 Fixing YCM-080 missing data...')
  
  const moldsCSV: any[] = readFile('molds.csv')
  const designsCSV: any[] = readFile('molddesign.csv')
  const jobsCSV: any[] = readFile('jobs.csv')
  const pdCSV: any[] = readFile('processingdeadline.csv')
  const worklogsCSV: any[] = readFile('worklog.csv')

  // Find company ID for customer 230
  const { data: companies } = await supabase.from('companies').select('company_id, company_code')
  const companyMap = new Map(companies?.map(c => [c.company_code, c.company_id]) || [])
  const defaultCompanyId = companyMap.get('YSD') || companies?.[0]?.company_id

  // CustomerID 230 → find company_code
  // From the access screenshot it's a YCM customer - let's find by checking existing molds
  const { data: existingMold } = await supabase.from('mold_masters').select('mold_master_id, company_id').eq('mold_master_code', 'YCM080D').single()
  const companyId = existingMold?.company_id || defaultCompanyId
  console.log('Using company_id:', companyId)

  // ── 1. Mold Master YCM-080 ──────────────────────────────────────
  const { data: existingMM } = await supabase.from('mold_masters').select('mold_master_id').eq('mold_master_code', 'YCM080').maybeSingle()
  let moldMasterId = existingMM?.mold_master_id

  if (!moldMasterId) {
    const { data, error } = await supabase.from('mold_masters').insert({
      mold_master_code: 'YCM080',
      mold_master_name: 'YCM-080',
      company_id: companyId,
      mold_class: null
    }).select('mold_master_id').single()
    if (error) { console.error('mold_master insert error:', error.message); return }
    moldMasterId = data.mold_master_id
    console.log('✅ Created mold_master YCM080:', moldMasterId)
  } else {
    console.log('ℹ️ mold_master YCM080 already exists:', moldMasterId)
  }

  // ── 2. Design Revision (MoldDesignID=4859, MoldDesignCode=YCM080) ─
  const d4859 = designsCSV.find((d: any) => d.MoldDesignID === '4859')
  let designRevisionId: string | null = null

  const { data: existingDR } = await supabase.from('design_revisions').select('revision_id').eq('design_code', 'YCM080').maybeSingle()
  if (existingDR?.revision_id) {
    designRevisionId = existingDR.revision_id
    console.log('ℹ️ design_revision YCM080 already exists:', designRevisionId)
  } else if (d4859) {
    const { data, error } = await supabase.from('design_revisions').insert({
      mold_master_id: moldMasterId,
      company_id: companyId,
      design_code: 'YCM080',
      design_length: parseFloat(d4859.MoldDesignLength) || null,
      design_width: parseFloat(d4859.MoldDesignWidth) || null,
      design_height: parseFloat(d4859.MoldDesignHeight) || null,
      design_depth: parseFloat(d4859.MoldDesignDepth) || null,
      pocket_numbers: parseInt(d4859.PocketNumbers) || null,
      cutline_length: parseFloat(d4859.CutlineX) || null,
      cutline_width: parseFloat(d4859.CutlineY) || null,
      corner_r: d4859.CornerR?.trim() || null,
      draft_angle: d4859.DraftAngle?.trim() || null,
      under_depth: parseFloat(d4859.UnderDepth) || null,
      has_plug: false,
      tray_info: d4859.TrayInfoForMoldDesign?.trim() || null,
      legacy_id: 4859,
      data_input_date: parseDate(d4859.DataInput)
    }).select('revision_id').single()
    if (error) { console.error('design_revision insert error:', error.message); return }
    designRevisionId = data.revision_id
    console.log('✅ Created design_revision YCM080:', designRevisionId)
  }

  // ── 3. Physical Mold (MoldID=5859) ─────────────────────────────
  const m5859 = moldsCSV.find((m: any) => m.MoldID === '5859')
  let physicalMoldId: string | null = null

  const { data: existingPM } = await supabase.from('physical_molds').select('physical_mold_id').ilike('system_code', '%YCM080%').maybeSingle()
  if (existingPM?.physical_mold_id) {
    physicalMoldId = existingPM.physical_mold_id
    console.log('ℹ️ physical_mold YCM080 already exists:', physicalMoldId)
  } else if (m5859) {
    const { data, error } = await supabase.from('physical_molds').insert({
      mold_master_id: moldMasterId,
      design_revision_id: designRevisionId,
      system_code: 'YCM080',
      display_name: 'YCM-080',
      company_id: companyId,
      mold_status: 'ACTIVE',
    }).select('physical_mold_id').single()
    if (error) { console.error('physical_mold insert error:', error.message) }
    else {
      physicalMoldId = data.physical_mold_id
      console.log('✅ Created physical_mold YCM080:', physicalMoldId)
    }
  }

  // ── 4. Job YCM-080 (JobID=1192) ────────────────────────────────
  const j1192 = jobsCSV.find((j: any) => j.JobID === '1192')
  if (!j1192) { console.error('Job 1192 not found in CSV'); return }

  const { data: existingJob } = await supabase.from('jobs').select('job_id').eq('job_code', 'YCM080').maybeSingle()
  let jobId = existingJob?.job_id

  if (!jobId) {
    const { data: jobTypeData } = await supabase.from('job_types').select('job_type_id').ilike('job_type_name_ja', '%新規金型%').maybeSingle()
    const jobTypeId = jobTypeData?.job_type_id

    const { data, error } = await supabase.from('jobs').insert({
      job_code: 'YCM080',
      job_name: 'YCM-080',
      job_type_id: jobTypeId,
      mold_master_id: moldMasterId,
      design_revision_id: designRevisionId,
      physical_mold_id: physicalMoldId,
      company_id: companyId,
      mold_deadline: parseDate(j1192.DeliveryDeadline), // 7/3/2026
      job_status: 'NEW',
      approved: j1192.Approved === 'TRUE',
      notes: j1192.JobNote?.trim() || null
    }).select('job_id').single()
    if (error) { console.error('job insert error:', error.message); return }
    jobId = data.job_id
    console.log('✅ Created job YCM080:', jobId)
  } else {
    console.log('ℹ️ job YCM080 already exists:', jobId)
  }

  // ── 5. Job Steps from processingdeadline (JobID=1192) ──────────
  const pds = pdCSV.filter((pd: any) => pd.JobID === '1192')
  console.log(`Found ${pds.length} processingdeadline records for JobID 1192`)
  
  const { data: employees } = await supabase.from('employees').select('employee_id, legacy_id').order('employee_id')
  const empMap = new Map(employees?.filter(e => e.legacy_id).map(e => [e.legacy_id, e.employee_id]) || [])
  const defaultEmpId = employees?.[0]?.employee_id

  const accessDeadlineToStepId = new Map<string, string>()

  for (const pd of pds) {
    const stepName = pd.ProcessingNotes?.trim() || pd.ItemTypeID === '2' ? 'MOLD' : pd.ItemTypeID === '3' ? 'PLUG' : pd.ItemTypeID === '4' ? 'CUTTER' : `Step ${pd.ItemTypeID || '1'}`
    const itemTypeId = pd.ItemTypeID ? parseInt(pd.ItemTypeID) : null
    const payload = {
      job_id: jobId,
      step_name: pd.MachiningCustomerID === '1' ? 'MOLD' : pd.MachiningCustomerID === '2' ? 'PLUG' : pd.ProcessingNotes?.trim() || stepName,
      step_no: itemTypeId || 1,
      item_type_id: itemTypeId,
      processing_status_id: pd.ProcessingStatusID ? parseInt(pd.ProcessingStatusID) : null,
      deadline: parseDate(pd.ProcessingDeadline),
      estimated_hours: pd.EstimatedHours ? parseFloat(pd.EstimatedHours) : null,
    }
    
    // Determine step name from the Access CSV - use ProcessingDeadline data
    // ItemTypeID: 2=MOLD, 3=PLUG, 4=CUTTER typically
    const realStepName = itemTypeId === 2 ? 'MOLD' : itemTypeId === 3 ? 'PLUG' : itemTypeId === 4 ? 'CUTTER' : pd.ProcessingNotes?.trim() || 'Step'
    payload.step_name = realStepName

    const { data: existStep } = await supabase.from('job_steps').select('step_id').eq('job_id', jobId).eq('step_no', payload.step_no).maybeSingle()
    let stepId = existStep?.step_id

    if (!stepId) {
      const { data: s, error } = await supabase.from('job_steps').insert([payload]).select('step_id').single()
      if (error) console.error('step insert error:', error.message, JSON.stringify(payload))
      else stepId = s.step_id
    }

    if (stepId && pd.ProcessingDeadlineID) {
      accessDeadlineToStepId.set(pd.ProcessingDeadlineID.toString().trim(), stepId)
    }
  }
  console.log(`✅ Inserted ${accessDeadlineToStepId.size} job_steps for YCM-080`)

  // ── 6. Work Logs (linked to JobID=1192 processingdeadlines) ──────
  const wls = worklogsCSV.filter((w: any) => {
    const pdId = w.ProcessingDeadlineID?.toString().trim()
    return accessDeadlineToStepId.has(pdId)
  })
  console.log(`Found ${wls.length} worklogs for YCM-080`)

  let wlCount = 0
  for (const w of wls) {
    const stepId = accessDeadlineToStepId.get(w.ProcessingDeadlineID?.toString().trim())
    if (!stepId) continue
    
    const employeeId = empMap.get(w.EmployeeID?.toString().trim()) || defaultEmpId
    if (!employeeId) continue

    const workDate = parseDate(w.ProcessingDate) || new Date().toISOString().split('T')[0]
    
    // Check if already exists
    const { data: existWL } = await supabase.from('work_logs').select('log_id').eq('job_step_id', stepId).eq('work_date', workDate).eq('employee_id', employeeId).maybeSingle()
    if (existWL?.log_id) continue

    const { error } = await supabase.from('work_logs').insert({
      job_id: jobId,
      job_step_id: stepId,
      employee_id: employeeId,
      work_date: workDate,
      hours_spent: w.ProcessingTime ? parseFloat(w.ProcessingTime) : 0,
      processing_code_id: w.ProcessingCodeID ? parseInt(w.ProcessingCodeID) : null,
      notes: w.ProcessingNotes?.trim() || null,
      quantity_done: w.ProcessingNumbers ? parseInt(w.ProcessingNumbers) : null,
      is_finished: w.Finished === 'TRUE'
    })
    if (error) console.error('worklog insert error:', error.message)
    else wlCount++
  }
  console.log(`✅ Inserted ${wlCount} work_logs for YCM-080`)
  console.log('🎉 YCM-080 fix complete!')
}

run().catch(console.error)
