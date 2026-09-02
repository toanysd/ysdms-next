'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function startJobAction(jobId: string) {
  const supabase = await createClient()

  // Called to invoke the rpc_start_job and template job_steps
  const { data, error } = await supabase.rpc('rpc_start_job' as any, { p_job_id: jobId })

  if (error) {
    console.error('Error starting job:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/production/jobs/${jobId}`)
  revalidatePath('/production/jobs')
  revalidatePath('/production/schedule')
  return { success: true, data }
}

export async function addWorkLogAction(formData: FormData) {
  const supabase = await createClient()

  const jobId = formData.get('job_id') as string
  const stepId = formData.get('job_step_id') as string
  const workDate = formData.get('work_date') as string
  const hoursSpent = parseFloat(formData.get('hours_spent') as string) || 0
  const quantityDone = parseInt(formData.get('quantity_done') as string) || 0
  const notes = formData.get('notes') as string // NG notes go here
  const markComplete = formData.get('mark_complete') === 'on'
  const plannedStart = formData.get('planned_start') as string
  const employeeId = formData.get('employee_id') as string

  if (!employeeId) {
    return { success: false, error: 'Bắt buộc chọn người thực hiện (employee)' }
  }

  // 1. Check if step is NOT_STARTED and needs auto-update to IN_PROGRESS
  const stepStatus = formData.get('step_status') as string
  if (stepStatus === 'NOT_STARTED') {
    const todayStr = new Date().toISOString().split('T')[0]
    await supabase.from('job_steps').update({
      step_status: 'IN_PROGRESS',
      planned_start: plannedStart || todayStr
    }).eq('step_id', stepId)
  }

  // 2. Insert work_log
  const { error: logError } = await supabase.from('work_logs').insert({
    job_id: jobId,
    job_step_id: stepId,
    employee_id: employeeId,
    work_date: workDate,
    hours_spent: hoursSpent,
    quantity_done: quantityDone,
    notes: notes,
    is_finished: markComplete
  })

  if (logError) {
    console.error('Error inserting work_log:', logError)
    return { success: false, error: logError.message }
  }

  // 3. Mark step completed if checkbox was checked
  if (markComplete) {
    // Get total hours from all logs for this step to update actual_hours
    const { data: allLogs } = await supabase.from('work_logs').select('hours_spent').eq('job_step_id', stepId)
    const totalHours = allLogs?.reduce((sum, log) => sum + (log.hours_spent || 0), 0) || 0
    
    const todayStr = new Date().toISOString().split('T')[0]
    await supabase.from('job_steps').update({
      step_status: 'COMPLETED',
      planned_end: todayStr,
      actual_hours: totalHours
    }).eq('step_id', stepId)

    // Check if ALL steps are now completed for the Job
    const { data: allSteps } = await supabase.from('job_steps').select('step_status').eq('job_id', jobId)
    const allCompleted = allSteps?.every(s => s.step_status === 'COMPLETED')
    
    if (allCompleted) {
      // Auto-update Job to COMPLETED
      await supabase.from('jobs').update({
        job_status: 'COMPLETED',
        completed_date: todayStr
      }).eq('job_id', jobId)
    }
  }

  revalidatePath(`/production/jobs/${jobId}`)
  revalidatePath('/production/jobs')
  revalidatePath('/production/schedule')
  return { success: true }
}
