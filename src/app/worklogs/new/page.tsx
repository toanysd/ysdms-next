import { createClient } from '@/lib/supabase/server'
import WorklogForm from '../_components/WorklogForm'

export const metadata = { title: 'YSDMS | 作業ログ — 新規登録' }

export default async function NewWorklogPage() {
  const supabase = await createClient()

  // WL-05: dropdown data
  const [{ data: employees }, { data: jobSteps }] = await Promise.all([
    supabase
      .from('employees')
      .select('employee_id, employee_code, employee_name')
      .order('employee_code'),
    supabase
      .from('job_steps')
      .select(
        `step_id, step_no, step_name, deadline,
         job:jobs!job_steps_job_id_fkey(job_id, job_code, job_name)`
      )
      .order('step_id'),
  ])

  return (
    <WorklogForm
      employees={employees ?? []}
      jobSteps={jobSteps ?? []}
    />
  )
}
