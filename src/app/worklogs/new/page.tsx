export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import WorklogForm from '../_components/WorklogForm'

export const metadata = { title: 'YSDMS | 作業ログ — 新規登録' }

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function NewWorklogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const jobId = params.job_id || undefined
  const stepId = params.step_id || undefined

  let lockedJob: any = null
  let preloadedSteps: any[] = []

  if (jobId) {
    const supabase = await createClient()

    const { data: job } = await supabase
      .from('jobs')
      .select(`
        job_id,
        job_code,
        job_name,
        companies:companies!jobs_company_id_fkey(
          company_name,
          company_code
        )
      `)
      .eq('job_id', jobId)
      .single()

    if (job) {
      lockedJob = job

      const { data: steps } = await supabase
        .from('job_steps')
        .select('step_id, step_no, step_name, job_id, step_status')
        .eq('job_id', jobId)
        .order('step_no')

      preloadedSteps = steps || []
    }
  }

  return (
    <WorklogForm
      defaultJobId={jobId}
      defaultStepId={stepId}
      lockedJob={lockedJob}
      preloadedSteps={preloadedSteps}
    />
  )
}
