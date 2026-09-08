'use server'

import { createClient, createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface WorklogSavePayload {
  log_id?: string
  work_date: string
  employee_id: string
  job_id: string
  job_step_id: string | null
  hours_spent: number
  is_finished: boolean
  processing_code_id?: number | null
  description?: string | null
  notes?: string | null
  quantity_done?: number | null
  quantity_ng?: number
  machine_id?: string | null
}

/**
 * Core Step Completion Engine (ADR-011)
 * Khi một work log ghi nhận is_finished = true:
 * 1. Tính actual_hours = SUM(hours_spent) cho step_id
 * 2. UPDATE job_steps SET step_status = 'COMPLETED', actual_hours = sum
 * 3. Nếu toàn bộ steps của job_id đều COMPLETED:
 *    -> UPDATE jobs SET job_status = 'COMPLETED', completed_date = NOW()
 * 4. Nếu toàn bộ jobs của work_order_id đều COMPLETED:
 *    -> Cascade UPDATE work_orders SET wo_status = 'COMPLETED', completed_at = NOW()
 *
 * SỬ DỤNG Service Role client (createServerSupabaseClient) để bypass RLS, đảm bảo cascade thực thi an toàn.
 */
async function processStepCompletionEngine(
  jobId: string,
  jobStepId: string | null,
  workOrderId?: string | null
) {
  if (!jobStepId) return

  const adminSupabase = createServerSupabaseClient()

  // 1. Tính tổng actual_hours của step này
  const { data: logs } = await adminSupabase
    .from('work_logs')
    .select('hours_spent')
    .eq('job_step_id', jobStepId)


  const totalHours = (logs || []).reduce((acc: number, l: any) => acc + (Number(l.hours_spent) || 0), 0)

  // 2. UPDATE job_steps
  await adminSupabase
    .from('job_steps')
    .update({
      step_status: 'COMPLETED',
      actual_hours: totalHours,
      updated_at: new Date().toISOString()
    })
    .eq('step_id', jobStepId)

  // 3. Kiểm tra xem toàn bộ steps của job_id đã COMPLETED chưa
  const { data: pendingSteps } = await adminSupabase
    .from('job_steps')
    .select('step_id')
    .eq('job_id', jobId)
    .neq('step_status', 'COMPLETED')

  if (pendingSteps && pendingSteps.length === 0) {
    await adminSupabase
      .from('jobs')
      .update({
        job_status: 'COMPLETED',
        completed_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('job_id', jobId)

    // 4. Cascade to work_orders
    let woId = workOrderId
    if (!woId) {
      const { data: jobRow } = await adminSupabase
        .from('jobs')
        .select('work_order_id')
        .eq('job_id', jobId)
        .single()
      woId = jobRow?.work_order_id
    }

    if (woId) {
      const { data: pendingJobs } = await adminSupabase
        .from('jobs')
        .select('job_id')
        .eq('work_order_id', woId)
        .neq('job_status', 'COMPLETED')

      if (pendingJobs && pendingJobs.length === 0) {
        await adminSupabase
          .from('work_orders')
          .update({
            wo_status: 'COMPLETED',
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('wo_id', woId)
      }
    }
  }
}

/**
 * Direct Server Action for JSON payload (used by WorklogFormShared & Modals)
 */
export async function saveWorklogRecord(
  payload: WorklogSavePayload
): Promise<{ success: boolean; log_id?: string; error?: string }> {
  try {
    const supabase = await createClient()

    if (!payload.work_date) return { success: false, error: 'Vui lòng chọn ngày làm việc' }
    if (!payload.employee_id) return { success: false, error: 'Vui lòng chọn người thực hiện' }
    if (!payload.job_id) return { success: false, error: 'Vui lòng chọn Job gia công' }
    if (!payload.hours_spent || isNaN(payload.hours_spent) || payload.hours_spent <= 0) {
      return { success: false, error: 'Số giờ làm việc không hợp lệ' }
    }

    // Lookup Job category & Work Order
    const { data: job } = await supabase
      .from('jobs')
      .select('job_id, job_type_id, work_order_id, job_types(category)')
      .eq('job_id', payload.job_id)
      .single()

    const jobCategory = (job?.job_types as any)?.category
    const isThermoforming = jobCategory === 'THERMOFORMING'

    if (isThermoforming && (payload.quantity_done === null || payload.quantity_done === undefined || payload.quantity_done < 0)) {
      return { success: false, error: '良品生産数 (quantity_done) は成形生産に必須です。' }
    }

    const recordData = {
      job_id: payload.job_id,
      job_step_id: payload.job_step_id || null,
      employee_id: payload.employee_id,
      work_date: payload.work_date,
      hours_spent: payload.hours_spent,
      is_finished: payload.is_finished ?? false,
      processing_code_id: payload.processing_code_id || null,
      description: payload.description || null,
      notes: payload.notes || null,
      quantity_done: payload.quantity_done != null ? Number(payload.quantity_done) : null,
      quantity_ng: payload.quantity_ng != null ? Number(payload.quantity_ng) : 0,
      machine_id: payload.machine_id || null,
    }

    let logId = payload.log_id
    if (logId) {
      const { error: updateErr } = await supabase
        .from('work_logs')
        .update(recordData)
        .eq('log_id', logId)

      if (updateErr) return { success: false, error: updateErr.message }
    } else {
      const { data: inserted, error: insertErr } = await supabase
        .from('work_logs')
        .insert(recordData)
        .select('log_id')
        .single()

      if (insertErr) return { success: false, error: insertErr.message }
      logId = inserted.log_id
    }

    // Step Completion Engine (dùng Service Role)
    if (payload.is_finished && payload.job_step_id) {
      await processStepCompletionEngine(
        payload.job_id,
        payload.job_step_id,
        job?.work_order_id
      )
    }

    revalidatePath('/worklogs')
    if (job?.work_order_id) {
      revalidatePath(`/production/work-orders/${job.work_order_id}`)
      revalidatePath('/production/work-orders')
    }

    return { success: true, log_id: logId }
  } catch (err: any) {
    console.error('saveWorklogRecord error:', err)
    return { success: false, error: err?.message || 'Lỗi lưu nhật ký' }
  }
}

/**
 * Form Action for Next.js form submissions
 */
export async function createWorklog(
  formData: FormData
): Promise<{ error?: string; errorKey?: string; success?: boolean; log_id?: string } | void> {
  const work_date   = formData.get('work_date')   as string | null
  const employee_id = formData.get('employee_id') as string | null
  const job_step_id = formData.get('job_step_id') as string | null
  const hours_raw   = formData.get('hours_spent') as string | null
  const is_finished = formData.get('is_finished') === 'true'
  const notes       = (formData.get('notes') as string | null)?.trim() || null
  const job_id_raw  = formData.get('job_id') as string | null
  const code_id_raw = formData.get('processing_code_id') as string | null
  const description = (formData.get('description') as string | null)?.trim() || null
  const qty_done    = formData.get('quantity_done') as string | null
  const qty_ng      = formData.get('quantity_ng') as string | null
  const machine_id  = (formData.get('machine_id') as string | null) || null

  if (!work_date)   return { errorKey: 'validation.reqWorkDate', error: 'Work date is required' }
  if (!employee_id) return { errorKey: 'validation.reqEmployee', error: 'Employee is required' }
  if (!job_step_id) return { errorKey: 'validation.reqStep', error: 'Step is required' }

  const hours_spent = hours_raw ? parseFloat(hours_raw) : null
  if (!hours_spent || isNaN(hours_spent) || hours_spent <= 0) {
    return { errorKey: 'validation.reqHours', error: 'Hours must be greater than 0' }
  }

  const supabase = await createClient()
  let jobId = job_id_raw
  if (!jobId) {
    const { data: step, error: stepError } = await supabase
      .from('job_steps')
      .select('job_id')
      .eq('step_id', job_step_id)
      .single()

    if (stepError || !step?.job_id) {
      return { errorKey: 'validation.stepNotFound', error: 'Job step info not found' }
    }
    jobId = step.job_id
  }

  const res = await saveWorklogRecord({
    work_date,
    employee_id,
    job_id: jobId,
    job_step_id,
    hours_spent,
    is_finished,
    processing_code_id: code_id_raw ? parseInt(code_id_raw, 10) : null,
    description,
    notes,
    quantity_done: qty_done ? parseInt(qty_done, 10) : null,
    quantity_ng: qty_ng ? parseInt(qty_ng, 10) : 0,
    machine_id
  })

  if (!res.success) {
    return { error: res.error }
  }

  return { success: true, log_id: res.log_id }
}
