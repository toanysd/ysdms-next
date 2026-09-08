'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { 
  WOEquipmentSetResult, 
  WorkOrderListItem, 
  WorkOrderKpis, 
  WOStatus,
  WorkOrderWorklogItem
} from './types'

export const JOB_STEP_TEMPLATES: Record<string, string[]> = {
  MOLD:            ['CAM設計', 'CNC加工', '磨き仕上げ', '試打確認'],
  CUTTER_INLINE:   ['設計', 'レーザー/CNC加工', '刃研ぎ', '試打確認'],
  CUTTER_SEPARATE: ['設計', 'レーザー/CNC加工', '刃研ぎ', '試打確認'],
  PRESSURE_BASE:   ['設計', '加工', '確認'],
  WATER_BASE:      ['設計', '配管加工', '確認'],
  STACKING:        ['設計', '溶接/加工', '確認'],
  PLUG:            ['設計', '加工', '確認'],
  FRAME:           ['設計', '加工', '確認'],
}

const VALID_EQUIPMENT_TYPES = [
  'MOLD', 'CUTTER_INLINE', 'CUTTER_SEPARATE', 'PRESSURE_BASE', 'WATER_BASE', 'STACKING', 'PLUG', 'FRAME'
]

// 1. GET WORK ORDERS (LIST + KPIS + SET SUMMARY)
export async function getWorkOrders(params: {
  search?: string
  status?: string
  page?: number
  pageSize?: number
}): Promise<{
  items: WorkOrderListItem[]
  total: number
  kpis: WorkOrderKpis
  error?: string
}> {
  try {
    const supabase = await createClient()
    const page = params.page || 1
    const pageSize = params.pageSize || 50
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    // 1.1 Query KPIs in parallel
    const nowIso = new Date().toISOString().slice(0, 10)
    const [inProgressRes, plannedRes, completedRes, overdueRes] = await Promise.all([
      supabase.from('work_orders').select('*', { count: 'exact', head: true }).eq('wo_status', 'IN_PROGRESS'),
      supabase.from('work_orders').select('*', { count: 'exact', head: true }).eq('wo_status', 'PLANNED'),
      supabase.from('work_orders').select('*', { count: 'exact', head: true }).eq('wo_status', 'COMPLETED'),
      supabase.from('work_orders').select('*', { count: 'exact', head: true })
        .not('wo_status', 'in', '("COMPLETED","CANCELLED")')
        .lt('deadline', nowIso)
    ])

    const kpis: WorkOrderKpis = {
      in_progress: inProgressRes.count || 0,
      planned: plannedRes.count || 0,
      completed: completedRes.count || 0,
      overdue: overdueRes.count || 0
    }

    // 1.2 Query Main List
    let query = supabase
      .from('work_orders')
      .select(`
        wo_id,
        wo_code,
        wo_name,
        wo_type,
        wo_status,
        start_date,
        deadline,
        priority,
        company_id,
        product_id,
        companies:companies!work_orders_company_id_fkey (company_name),
        products:products!work_orders_product_id_fkey (product_code, product_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (params.status && params.status !== 'ALL') {
      query = query.eq('wo_status', params.status)
    }

    if (params.search && params.search.trim() !== '') {
      const s = params.search.trim()
      query = query.or(`wo_code.ilike.%${s}%,wo_name.ilike.%${s}%`)
    }

    const { data: woData, count, error } = await query

    if (error) {
      console.error('getWorkOrders query error:', error)
      return { items: [], total: 0, kpis, error: error.message }
    }

    const woList = woData || []
    const woIds = woList.map(w => w.wo_id)

    // 1.3 Fetch SET summary counts for these WOs from View v_work_order_equipment_set
    const setSummaryMap: Record<string, { total: number, ready: number }> = {}
    if (woIds.length > 0) {
      const { data: setRows } = await supabase
        .from('v_work_order_equipment_set')
        .select('wo_id, readiness_status')
        .in('wo_id', woIds)

      if (setRows) {
        for (const row of setRows) {
          if (!setSummaryMap[row.wo_id]) {
            setSummaryMap[row.wo_id] = { total: 0, ready: 0 }
          }
          setSummaryMap[row.wo_id].total += 1
          if (row.readiness_status === 'READY') {
            setSummaryMap[row.wo_id].ready += 1
          }
        }
      }
    }

    const items: WorkOrderListItem[] = woList.map(w => {
      const comp = Array.isArray(w.companies) ? w.companies[0] : w.companies
      const prod = Array.isArray(w.products) ? w.products[0] : w.products
      const setStats = setSummaryMap[w.wo_id] || { total: 0, ready: 0 }
      const isOverdue = !!(w.deadline && w.deadline < nowIso && !['COMPLETED', 'CANCELLED'].includes(w.wo_status))

      return {
        wo_id: w.wo_id,
        wo_code: w.wo_code,
        wo_name: w.wo_name,
        wo_type: w.wo_type,
        wo_status: w.wo_status as WOStatus,
        start_date: w.start_date,
        deadline: w.deadline,
        priority: w.priority || 5,
        company_id: w.company_id,
        company_name: comp?.company_name || null,
        product_id: w.product_id,
        product_code: prod?.product_code || null,
        product_name: prod?.product_name || null,
        total_set_items: setStats.total,
        ready_set_items: setStats.ready,
        is_set_ready: setStats.total > 0 && setStats.ready === setStats.total,
        is_overdue: isOverdue
      }
    })

    return {
      items,
      total: count || 0,
      kpis
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return { items: [], total: 0, kpis: { in_progress: 0, planned: 0, overdue: 0, completed: 0 }, error: msg }
  }
}

// 2. GET WORK ORDER DETAIL
export async function getWorkOrderDetail(woId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('work_orders')
    .select(`
      *,
      companies:companies!work_orders_company_id_fkey (company_id, company_name, company_code),
      products:products!work_orders_product_id_fkey (product_id, product_code, product_name, product_name_internal),
      design_revisions:design_revisions!work_orders_design_revision_id_fkey (
        revision_id, design_code, revision_number, plastic_type_designed, cutline_length, cutline_width, cav_type_id
      ),
      responsible:employees!work_orders_responsible_id_fkey (employee_id, employee_name),
      jobs (
        job_id, job_code, job_name, job_category, job_status, equipment_id, start_date, deadline,
        responsible:employees!jobs_responsible_id_fkey (employee_name),
        equipment (equipment_type, display_name, equipment_code),
        job_steps (step_id, step_name, step_status, step_no)
      )
    `)
    .eq('wo_id', woId)
    .single()

  if (error || !data) {
    return { error: error?.message || 'Work Order not found' }
  }

  return { data }
}

// 3. GET WORK ORDER EQUIPMENT SET (RPC CALL WITH STRICT TYPES)
export async function getWorkOrderEquipmentSet(woId: string): Promise<{
  data: WOEquipmentSetResult | null
  error?: string
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .rpc('fn_get_wo_equipment_set', { p_wo_id: woId })

    if (error) {
      console.error('fn_get_wo_equipment_set error:', error)
      return { data: null, error: error.message }
    }

    if (!data || typeof data !== 'object') {
      return { data: null, error: 'Empty RPC response' }
    }

    const payload = data as unknown as WOEquipmentSetResult & { error?: string }
    if (payload.error) {
      return { data: null, error: payload.error }
    }

    return { data: payload }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return { data: null, error: msg }
  }
}

// 4. ASSIGN EQUIPMENT TO SET (equipment_assignments)
export async function assignEquipmentToSet(
  primaryMoldId: string,
  relatedEquipmentId: string,
  relationshipType: string = 'SET_MEMBER',
  notes?: string
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('equipment_assignments')
    .upsert({
      primary_equipment_id: primaryMoldId,
      related_equipment_id: relatedEquipmentId,
      relationship_type: relationshipType,
      is_default: true,
      notes: notes || null
    }, {
      onConflict: 'primary_equipment_id,related_equipment_id'
    })
    .select('assignment_id')
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/production/work-orders')
  return { success: true, assignmentId: data.assignment_id }
}

// 5. UPDATE WORK ORDER STATUS WITH GATEKEEPER CHECK (ADR-010 Quyết định 3)
export async function updateWorkOrderStatus(
  woId: string,
  newStatus: WOStatus,
  overrideReason?: string
) {
  const supabase = await createClient()

  // 5.1 Gatekeeper verification when moving to IN_PROGRESS
  if (newStatus === 'IN_PROGRESS') {
    const { data: setInfo, error: setError } = await getWorkOrderEquipmentSet(woId)
    if (setError || !setInfo) {
      return { 
        success: false, 
        gatekeeperBlocked: true, 
        message: 'Không thể kiểm tra trạng thái thiết bị SET trước khi phát lệnh dập.' 
      }
    }

    // Must have mold & cutter
    if (!setInfo.summary.has_mold || !setInfo.summary.has_cutter) {
      if (!overrideReason || overrideReason.trim() === '') {
        return {
          success: false,
          gatekeeperBlocked: true,
          message: 'Chỉ thị sản xuất khay bắt buộc phải có đầy đủ Khuôn (MOLD) và Dao cắt (CUTTER). Vui lòng kiểm tra lại thiết bị hoặc nhập lý do ngoại lệ được duyệt.'
        }
      }
    }

    // All items should be READY
    if (!setInfo.summary.is_all_ready) {
      if (!overrideReason || overrideReason.trim() === '') {
        return {
          success: false,
          gatekeeperBlocked: true,
          message: `Bộ thiết bị SET chưa hoàn toàn sẵn sàng (${setInfo.summary.ready_items}/${setInfo.summary.total_items} sẵn sàng). Vui lòng chuẩn bị đủ thiết bị hoặc xác nhận ngoại lệ.`
        }
      }
    }
  }

  // 5.2 Perform update
  const updatePayload: {
    wo_status: string
    completed_at?: string | null
    notes?: string
  } = {
    wo_status: newStatus
  }

  if (newStatus === 'COMPLETED') {
    updatePayload.completed_at = new Date().toISOString()
  } else if (newStatus === 'PLANNED') {
    updatePayload.completed_at = null
  }

  if (overrideReason) {
    updatePayload.notes = `[Xác nhận ngoại lệ ${new Date().toISOString().slice(0, 10)}]: ${overrideReason}`
  }

  const { error } = await supabase
    .from('work_orders')
    .update(updatePayload)
    .eq('wo_id', woId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/production/work-orders/${woId}`)
  revalidatePath('/production/work-orders')
  return { success: true }
}

// 6. GENERATE JOBS FOR WORK ORDER (ADR-002 & ADR-003: 1 Equipment = 1 Job)
export async function generateJobsForWorkOrder(workOrderId: string) {
  const supabase = await createClient()

  // 1. Get WO
  const { data: wo, error: woError } = await supabase
    .from('work_orders')
    .select('wo_id, wo_code, wo_name, product_id, design_revision_id, case_id, company_id, deadline, wo_status')
    .eq('wo_id', workOrderId)
    .single()

  if (woError || !wo) return { error: 'Work order not found' }

  // 2. Resolve revisionId & productId
  let productId = wo.product_id
  let revisionId = wo.design_revision_id

  if (!revisionId && productId) {
    const { data: rev } = await supabase
      .from('design_revisions')
      .select('revision_id')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (rev) revisionId = rev.revision_id
  }

  if (!productId && revisionId) {
    const { data: dr } = await supabase
      .from('design_revisions')
      .select('product_id')
      .eq('revision_id', revisionId)
      .single()
    if (dr?.product_id) productId = dr.product_id
  }

  if (!revisionId && !productId) {
    return { error: '製品IDまたは設計リビジョンが特定できません。Work Orderに製品を紐付けてください。' }
  }

  // 3. Find primary MOLD equipment
  const targetEquipments: Array<{
    equipment_id: string
    equipment_code: string
    display_name: string | null
    equipment_type: string
  }> = []

  interface SimpleEquipmentRow {
    equipment_id: string
    equipment_code: string
    display_name: string | null
    equipment_type: string
  }

  let mold: SimpleEquipmentRow | null = null
  if (revisionId) {
    const { data: moldData } = await supabase
      .from('equipment')
      .select('equipment_id, equipment_code, display_name, equipment_type')
      .eq('design_revision_id', revisionId)
      .eq('equipment_type', 'MOLD')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    mold = moldData as SimpleEquipmentRow | null
  }

  if (mold) {
    targetEquipments.push(mold)

    // 4. Find auxiliary equipment via equipment_assignments (SET_MEMBER)
    const { data: assignments } = await supabase
      .from('equipment_assignments')
      .select(`
        related_equipment_id,
        related_equipment:equipment!equipment_assignments_related_equipment_id_fkey(
          equipment_id, equipment_code, display_name, equipment_type
        )
      `)
      .eq('primary_equipment_id', mold.equipment_id)
      .eq('relationship_type', 'SET_MEMBER')

    if (assignments && assignments.length > 0) {
      for (const a of assignments) {
        const rel = (Array.isArray(a.related_equipment) ? a.related_equipment[0] : a.related_equipment) as SimpleEquipmentRow | null
        if (
          rel && 
          VALID_EQUIPMENT_TYPES.includes(rel.equipment_type) &&
          !targetEquipments.some(e => e.equipment_id === rel.equipment_id)
        ) {
          targetEquipments.push(rel)
        }
      }
    } else if (revisionId) {
      // Fallback: any other equipment with the same design_revision_id
      const { data: otherEq } = await supabase
        .from('equipment')
        .select('equipment_id, equipment_code, display_name, equipment_type')
        .eq('design_revision_id', revisionId)
        .in('equipment_type', VALID_EQUIPMENT_TYPES)
        .neq('equipment_id', mold.equipment_id)
        .order('created_at', { ascending: false })

      if (otherEq && otherEq.length > 0) {
        const includedTypes = new Set<string>(['MOLD'])
        for (const eq of (otherEq as SimpleEquipmentRow[])) {
          if (!includedTypes.has(eq.equipment_type)) {
            targetEquipments.push(eq)
            includedTypes.add(eq.equipment_type)
          }
        }
      }
    }
  }

  if (targetEquipments.length === 0) {
    return { error: '紐付く設備・金型が見つかりません。製品の設計リビジョンまたは設備登録を確認してください。' }
  }

  // 5. Idempotency check: Find existing jobs for this work_order
  const { data: existingJobs } = await supabase
    .from('jobs')
    .select('equipment_id')
    .eq('work_order_id', workOrderId)

  const existingEquipIds = new Set(existingJobs?.map(j => j.equipment_id).filter(Boolean))
  const equipmentsToCreate = targetEquipments.filter(eq => !existingEquipIds.has(eq.equipment_id))

  if (equipmentsToCreate.length === 0) {
    return { 
      success: true, 
      jobsCreated: 0, 
      message: '該当するすべての設備に対してすでに指示書（Jobs）が発行されています。' 
    }
  }

  // 6. Create Jobs and Job Steps
  let totalJobsCreated = 0
  let totalStepsCreated = 0

  for (const eq of equipmentsToCreate) {
    const jobCategory = eq.equipment_type === 'MOLD'
      ? 'MOLD_NEW'
      : (eq.equipment_type.startsWith('CUTTER') ? 'CUTTER_NEW' : 'EQUIPMENT_NEW')

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const jobCode = `JOB-${wo.wo_code}-${eq.equipment_type.slice(0, 4)}-${randomSuffix}`
    const jobName = `${wo.wo_name || wo.wo_code} - ${eq.display_name || eq.equipment_code || eq.equipment_type}`

    const { data: newJob, error: jobError } = await supabase
      .from('jobs')
      .insert({
        work_order_id: workOrderId,
        equipment_id: eq.equipment_id,
        product_id: productId,
        design_revision_id: revisionId,
        case_id: wo.case_id,
        company_id: wo.company_id,
        job_code: jobCode,
        job_name: jobName,
        job_category: jobCategory,
        job_status: 'PENDING',
        deadline: wo.deadline,
        start_date: new Date().toISOString().slice(0, 10),
      })
      .select('job_id')
      .single()

    if (jobError || !newJob) {
      console.error('Error creating job for equipment:', eq.equipment_id, jobError)
      continue
    }

    totalJobsCreated++

    // Insert Steps
    const stepNames = JOB_STEP_TEMPLATES[eq.equipment_type] || ['設計・準備', '加工', '仕上げ・確認']
    const stepsToInsert = stepNames.map((name, index) => ({
      job_id: newJob.job_id,
      step_no: index + 1,
      step_name: name,
      step_status: 'PENDING',
      track: eq.equipment_type === 'MOLD' ? 'MOLD' : (eq.equipment_type === 'PLUG' ? 'PLUG' : 'CUTTER'),
      deadline: wo.deadline,
    }))

    const { error: stepsError } = await supabase
      .from('job_steps')
      .insert(stepsToInsert)

    if (stepsError) {
      console.error('Error creating steps for job:', newJob.job_id, stepsError)
    } else {
      totalStepsCreated += stepsToInsert.length
    }
  }

  // Update WO status to IN_PROGRESS if confirmed or planned
  if (['CONFIRMED', 'PLANNED'].includes(wo.wo_status)) {
    await supabase
      .from('work_orders')
      .update({ wo_status: 'IN_PROGRESS' })
      .eq('wo_id', workOrderId)
  }

  revalidatePath(`/production/work-orders/${workOrderId}`)
  revalidatePath('/production/work-orders')
  revalidatePath('/equipment/jobs')

  return {
    success: true,
    jobsCreated: totalJobsCreated,
    stepsCreated: totalStepsCreated,
    message: `${totalJobsCreated} 件の加工指示（Job）と ${totalStepsCreated} 件の工程ステップを発行しました。`
  }
}

// 7. GET WORK ORDER WORKLOGS (Nippo logs connected via Jobs)
export async function getWorkOrderWorklogs(jobIds: string[]): Promise<WorkOrderWorklogItem[]> {
  if (!jobIds || jobIds.length === 0) return []
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('work_logs')
      .select(`
        log_id,
        job_id,
        job_step_id,
        employee_id,
        work_date,
        hours_spent,
        quantity_done,
        quantity_ng,
        is_finished,
        notes,
        created_at,
        machine_id,
        employees:employees!work_logs_employee_id_fkey (employee_name),
        job_steps:job_steps!work_logs_job_step_id_fkey (step_name),
        jobs:jobs!work_logs_job_id_fkey (job_code, job_name),
        machines:machines!work_logs_machine_id_fkey (machine_name)
      `)
      .in('job_id', jobIds)
      .order('work_date', { ascending: false })

    if (error || !data) {
      console.error('getWorkOrderWorklogs error:', error)
      return []
    }

    return (data as any[]).map((d) => ({
      log_id: d.log_id,
      job_id: d.job_id,
      job_code: d.jobs?.job_code || null,
      job_name: d.jobs?.job_name || null,
      step_id: d.job_step_id,
      step_name: d.job_steps?.step_name || null,
      employee_id: d.employee_id,
      employee_name: d.employees?.employee_name || null,
      machine_id: d.machine_id,
      machine_name: d.machines?.machine_name || null,
      work_date: d.work_date,
      hours_spent: d.hours_spent,
      quantity_done: d.quantity_done,
      quantity_ng: d.quantity_ng || 0,
      is_finished: d.is_finished,
      notes: d.notes,
      created_at: d.created_at
    }))
  } catch (err) {
    console.error('getWorkOrderWorklogs exception:', err)
    return []
  }
}

