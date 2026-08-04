'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createWorklog(
  formData: FormData
): Promise<{ error?: string; errorKey?: string } | void> {
  const supabase = await createClient()

  // ── Parse & validate ────────────────────────────────────────────────
  const work_date   = formData.get('work_date')   as string | null
  const employee_id = formData.get('employee_id') as string | null
  const job_step_id = formData.get('job_step_id') as string | null
  const hours_raw   = formData.get('hours_spent') as string | null
  const is_finished = formData.get('is_finished') === 'true'
  const notes       = (formData.get('notes') as string | null)?.trim() || null

  if (!work_date)   return { errorKey: 'validation.reqWorkDate', error: 'Work date is required' }
  if (!employee_id) return { errorKey: 'validation.reqEmployee', error: 'Employee is required' }
  if (!job_step_id) return { errorKey: 'validation.reqStep', error: 'Step is required' }

  const hours_spent = hours_raw ? parseFloat(hours_raw) : null
  if (!hours_spent || isNaN(hours_spent) || hours_spent <= 0) {
    return { errorKey: 'validation.reqHours', error: 'Hours must be greater than 0' }
  }

  // ── Lookup job_id từ job_steps ──────────────────────────────────────
  const { data: step, error: stepError } = await supabase
    .from('job_steps')
    .select('job_id')
    .eq('step_id', job_step_id)
    .single()

  if (stepError || !step?.job_id) {
    return { errorKey: 'validation.stepNotFound', error: 'Job step info not found' }
  }

  const job_id = step.job_id

  // ── Insert ──────────────────────────────────────────────────────────
  const { error } = await supabase
    .from('work_logs')
    .insert({
      work_date,
      employee_id,
      job_step_id,
      job_id,
      hours_spent,
      is_finished,
      notes,
    })

  if (error) return { error: error.message }

  revalidatePath('/worklogs')
}
