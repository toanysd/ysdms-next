'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ═══════════════════════════════════════════════════════
// Types for Work Orders (Option C Model)
// ═══════════════════════════════════════════════════════

export type CreateWorkOrderInput = {
  wo_name: string
  product_id?: string | null
  design_revision_id?: string | null
  order_id?: string | null
  company_id?: string | null
  case_id?: string | null
  wo_type?: 'NEW_SET' | 'REPAIR' | 'REMAKE' | 'MODIFICATION' | 'OTHER'
  start_date?: string | null
  deadline?: string | null
  responsible_id?: string | null
  priority?: number
  notes?: string | null
}

export type WorkOrderWithJobs = {
  wo_id: string
  wo_code: string
  wo_name: string
  product_id: string | null
  design_revision_id: string | null
  order_id: string | null
  company_id: string | null
  case_id: string | null
  wo_type: string
  wo_status: string
  start_date: string | null
  deadline: string | null
  completed_at: string | null
  responsible_id: string | null
  priority: number | null
  notes: string | null
  created_at: string | null
  updated_at: string | null
  products?: {
    product_id: string
    product_code: string
    product_name_internal: string | null
  } | null
  companies?: {
    company_name: string
    company_code: string
  } | null
  design_revisions?: {
    design_code: string
    revision_number: number | null
    plastic_type_designed: string | null
  } | null
  jobs: any[]
}

// ═══════════════════════════════════════════════════════
// Server Actions
// ═══════════════════════════════════════════════════════

/**
 * Creates a new Work Order.
 * Automatically generates wo_code using DB RPC if available, or falls back to server-side code generation.
 */
export async function createWorkOrder(input: CreateWorkOrderInput): Promise<{
  success: boolean
  wo_id?: string
  wo_code?: string
  error?: string
}> {
  const supabase = await createClient()

  try {
    // Generate code via DB function or server logic
    let wo_code: string | null = null
    const { data: codeData, error: codeErr } = await supabase.rpc('generate_wo_code' as any)
    
    if (!codeErr && codeData) {
      wo_code = codeData as string
    } else {
      const year = new Date().getFullYear()
      const randSeq = Math.floor(100000 + Math.random() * 900000)
      wo_code = `WO-${year}-${randSeq}`
    }

    const payload = {
      wo_code,
      wo_name: input.wo_name.trim(),
      product_id: input.product_id || null,
      design_revision_id: input.design_revision_id || null,
      order_id: input.order_id || null,
      company_id: input.company_id || null,
      case_id: input.case_id || null,
      wo_type: input.wo_type || 'NEW_SET',
      wo_status: 'PLANNED',
      start_date: input.start_date || null,
      deadline: input.deadline || null,
      responsible_id: input.responsible_id || null,
      priority: input.priority ?? 5,
      notes: input.notes?.trim() || null,
    }

    const { data, error } = await supabase
      .from('work_orders')
      .insert(payload)
      .select('wo_id, wo_code')
      .single()

    if (error) {
      console.error('Failed to create Work Order:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/equipment/schedule')
    revalidatePath('/product-center')

    return {
      success: true,
      wo_id: data.wo_id,
      wo_code: data.wo_code,
    }
  } catch (err: any) {
    console.error('Error creating Work Order:', err)
    return { success: false, error: err.message || 'Unknown error' }
  }
}

/**
 * Gets paginated Work Orders list with filtering.
 */
export async function getWorkOrders(params: {
  search?: string
  status?: string
  fromDate?: string
  toDate?: string
  page?: number
  pageSize?: number
}): Promise<{ data: WorkOrderWithJobs[]; count: number }> {
  const supabase = await createClient()
  const page = params.page || 1
  const pageSize = params.pageSize || 50
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('work_orders')
    .select(`
      *,
      products!work_orders_product_id_fkey(product_id, product_code, product_name_internal),
      companies!work_orders_company_id_fkey(company_name, company_code),
      design_revisions!work_orders_design_revision_id_fkey(design_code, revision_number, plastic_type_designed),
      jobs!jobs_work_order_id_fkey(
        job_id, job_code, job_name, job_status, equipment_id, start_date, deadline, completed_date,
        equipment!jobs_equipment_id_fkey(equipment_id, equipment_code, display_name, equipment_type)
      )
    `, { count: 'exact' })

  if (params.search?.trim()) {
    const q = `%${params.search.trim()}%`
    query = query.or(`wo_code.ilike.${q},wo_name.ilike.${q}`)
  }

  if (params.status && params.status !== 'ALL') {
    query = query.eq('wo_status', params.status)
  }

  if (params.fromDate) {
    query = query.gte('deadline', params.fromDate)
  }

  if (params.toDate) {
    query = query.lte('deadline', params.toDate)
  }

  query = query.order('deadline', { ascending: true, nullsFirst: false }).range(from, to)

  const { data, count, error } = await query

  if (error) {
    if (!error.message.includes('relation "public.work_orders" does not exist') && !error.message.includes('work_orders')) {
      console.error('Error fetching Work Orders:', error.message)
    }
    return { data: [], count: 0 }
  }

  return {
    data: (data || []) as WorkOrderWithJobs[],
    count: count || 0,
  }
}

/**
 * Gets Work Orders for Schedule Gantt Chart view (including child jobs, job_steps, and work_logs).
 */
export async function getWorkOrdersForGantt(params: {
  search?: string
  fromDate?: string
  toDate?: string
  page?: number
  pageSize?: number
}): Promise<{ data: WorkOrderWithJobs[]; count: number }> {
  const supabase = await createClient()
  const page = params.page || 1
  const pageSize = params.pageSize || 500
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('work_orders')
    .select(`
      *,
      products!work_orders_product_id_fkey(product_id, product_code, product_name_internal),
      companies!work_orders_company_id_fkey(company_name, company_code),
      design_revisions!work_orders_design_revision_id_fkey(design_code, revision_number, plastic_type_designed),
      jobs!jobs_work_order_id_fkey(
        job_id, job_code, job_name, job_status, equipment_id, start_date, deadline, completed_date, estimated_hours,
        equipment!jobs_equipment_id_fkey(equipment_id, equipment_code, display_name, equipment_type),
        job_steps(
          step_id, job_id, step_no, step_name, step_status,
          track, planned_start, planned_end, planned_hours,
          actual_hours, estimated_hours, machine_id, assigned_to, deadline
        )
      )
    `, { count: 'exact' })
    .neq('wo_status', 'CANCELLED')

  if (params.search?.trim()) {
    const q = `%${params.search.trim()}%`
    query = query.or(`wo_code.ilike.${q},wo_name.ilike.${q}`)
  }

  if (params.fromDate) {
    query = query.gte('deadline', params.fromDate)
  }

  if (params.toDate) {
    query = query.lte('deadline', params.toDate)
  }

  query = query.order('deadline', { ascending: true, nullsFirst: false }).range(from, to)

  const { data, count, error } = await query

  if (error) {
    if (!error.message.includes('relation "public.work_orders" does not exist') && !error.message.includes('work_orders')) {
      console.error('Error fetching Work Orders for Gantt:', error.message)
    }
    return { data: [], count: 0 }
  }

  return {
    data: (data || []) as WorkOrderWithJobs[],
    count: count || 0,
  }
}

/**
 * Auto-computes and updates Work Order status based on child jobs statuses.
 */
export async function updateWorkOrderStatus(wo_id: string): Promise<{ success: boolean }> {
  const supabase = await createClient()

  try {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('job_status')
      .eq('work_order_id', wo_id)

    if (error || !jobs) return { success: false }

    if (jobs.length === 0) return { success: true }

    const allCompleted = jobs.every(j => j.job_status === 'COMPLETED' || j.job_status === 'FINISHED')
    const anyInProgress = jobs.some(j => j.job_status === 'IN_PROGRESS' || j.job_status === 'ACTIVE')

    let newStatus = 'PLANNED'
    let completedAt: string | null = null

    if (allCompleted) {
      newStatus = 'COMPLETED'
      completedAt = new Date().toISOString()
    } else if (anyInProgress) {
      newStatus = 'IN_PROGRESS'
    }

    await supabase
      .from('work_orders')
      .update({ wo_status: newStatus, completed_at: completedAt })
      .eq('wo_id', wo_id)

    revalidatePath('/equipment/schedule')
    return { success: true }
  } catch (err) {
    console.error('Failed to update Work Order status:', err)
    return { success: false }
  }
}

/**
 * Links a job to a Work Order.
 */
export async function linkJobToWorkOrder(job_id: string, wo_id: string): Promise<{ success: boolean }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('jobs')
    .update({ work_order_id: wo_id } as any)
    .eq('job_id', job_id)

  if (error) {
    console.error('Failed to link job to Work Order:', error)
    return { success: false }
  }

  await updateWorkOrderStatus(wo_id)
  revalidatePath('/equipment/schedule')
  return { success: true }
}
