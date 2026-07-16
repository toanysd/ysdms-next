'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createWorklog(
  formData: FormData
): Promise<{ error: string } | void> {
  const supabase = await createClient()

  // ── Parse & validate ─────────────────────────────────────────────────────────────
  const work_date   = formData.get('work_date')   as string | null
  const employee_id = formData.get('employee_id') as string | null
  const job_step_id = formData.get('job_step_id') as string | null
  const hours_raw   = formData.get('hours_spent') as string | null
  const is_finished = formData.get('is_finished') === 'true'
  const notes       = (formData.get('notes') as string | null)?.trim() || null

  if (!work_date)   return { error: '作業日を入力してください / Vui lòng nhập ngày làm việc.' }
  if (!employee_id) return { error: '担当者を選択してください / Vui lòng chọn nhân viên.' }
  if (!job_step_id) return { error: '工程を選択してください / Vui lòng chọn bước công việc.' }

  const hours_spent = hours_raw ? parseFloat(hours_raw) : null
  if (!hours_spent || isNaN(hours_spent) || hours_spent <= 0) {
    return { error: '作業時間は0より大きい値を入力してください / Số giờ phải lớn hơn 0.' }
  }

  // ── Insert ───────────────────────────────────────────────────────────────────────
  const { error } = await supabase
    .from('work_logs')
    .insert({
      work_date,
      employee_id,
      job_step_id,
      hours_spent,
      is_finished,
      notes,
    })

  if (error) return { error: error.message }

  revalidatePath('/worklogs')
}
