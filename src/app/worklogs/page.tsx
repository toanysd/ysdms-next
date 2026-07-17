import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import WorklogTable from './_components/WorklogTable'

export const metadata = { title: 'YSDMS | 作業ログ' }

const PAGE_SIZE = 50

export default async function WorklogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const page = parseInt(params.page ?? '1', 10)
  const from = (page - 1) * PAGE_SIZE

  const jobFilter    = params.job_id      ?? null
  const empFilter    = params.employee_id ?? null
  const dateFrom     = params.date_from   ?? null
  const dateTo       = params.date_to     ?? null
  const statusFilter = params.status      ?? 'all'

  let query = supabase
    .from('work_logs')
    .select(
      `log_id, work_date, hours_spent, is_finished, notes,
       job_step:job_steps!work_logs_job_step_id_fkey(
         step_id, step_no, step_name, deadline,
         job:jobs!job_steps_job_id_fkey(job_id, job_code, job_name)
       ),
       employee:employees!work_logs_employee_id_fkey(employee_id, employee_code, employee_name)`,
      { count: 'exact' }
    )
    .order('work_date', { ascending: false })
    .order('log_id',    { ascending: false })
    .range(from, from + PAGE_SIZE - 1)

  if (jobFilter)                      query = query.eq('job_id', jobFilter)
  if (empFilter)                      query = query.eq('employee_id', empFilter)
  if (dateFrom)                       query = query.gte('work_date', dateFrom)
  if (dateTo)                         query = query.lte('work_date', dateTo)
  if (statusFilter === 'finished')    query = query.eq('is_finished', true)
  if (statusFilter === 'in_progress') query = query.eq('is_finished', false)

  const { data: logs, count, error } = await query

  // WL-04: Tổng giờ per job
  const { data: allHours } = await supabase
    .from('work_logs')
    .select('job_id, hours_spent')

  const hoursByJob: Record<string, number> = {}
  for (const row of allHours ?? []) {
    if (!row.job_id) continue
    hoursByJob[row.job_id] = (hoursByJob[row.job_id] ?? 0) + (row.hours_spent ?? 0)
  }

  // Dropdown data cho FilterBar
  const { data: employees } = await supabase
    .from('employees')
    .select('employee_id, employee_code, employee_name')
    .order('employee_code')

  const { data: jobs } = await supabase
    .from('jobs')
    .select('job_id, job_code, job_name')
    .order('job_code')

  return (
    <WorklogTable
      logs={logs ?? []}
      totalCount={count ?? 0}
      page={page}
      pageSize={PAGE_SIZE}
      employees={employees ?? []}
      jobs={jobs ?? []}
      hoursByJob={hoursByJob}
      filters={{ jobFilter, empFilter, dateFrom, dateTo, statusFilter }}
      error={error?.message ?? null}
    />
  )
}
