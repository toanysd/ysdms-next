import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Plus, ListChecks } from 'lucide-react'
import { QCFilterBar } from './_components/QCFilterBar'

export const dynamic = 'force-dynamic'

export default async function QCListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const t = await getTranslations('QC')
  const supabase = await createClient()

  const search = typeof searchParams.search === 'string' ? searchParams.search : ''
  const result = typeof searchParams.result === 'string' ? searchParams.result : ''

  // Build query
  let query = supabase
    .from('job_qc_logs')
    .select(`
      qc_log_id,
      recorded_at,
      quantity_checked,
      quantity_pass,
      quantity_ng,
      defect_category,
      jobs!inner (
        job_id,
        job_code
      ),
      job_steps!inner (
        step_name
      ),
      employees!inner (
        employee_name
      )
    `)
    .order('recorded_at', { ascending: false })

  if (search) {
    const { data: matchedJobs } = await supabase
      .from('jobs')
      .select('job_id')
      .ilike('job_code', `%${search}%`)
      .limit(100)
    
    if (matchedJobs && matchedJobs.length > 0) {
      const jobIds = matchedJobs.map(j => j.job_id)
      query = query.in('job_id', jobIds)
    } else {
      // Force empty result by querying an impossible UUID
      query = query.eq('job_id', '00000000-0000-0000-0000-000000000000')
    }
  }

  if (result === 'NG') {
    query = query.gt('quantity_ng', 0)
  } else if (result === 'PASS') {
    query = query.eq('quantity_ng', 0)
  }

  const { data: logs, error } = await query.limit(50)

  if (error) {
    console.error('Error fetching QC logs:', error)
  }

  return (
    <div className="flex flex-col h-full gap-3">
      {/* PageHeader (Rule 2) */}
      <div className="shrink-0 flex items-center justify-between p-4 card-flat">
        <div className="flex items-center gap-3">
          <ListChecks className="w-5 h-5 text-[var(--accent)]" />
          <h1 className="text-lg font-bold text-slate-900">{t('title')}</h1>
        </div>
        <Link href="/production/qc/new" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          {t('addBtn')}
        </Link>
      </div>

      {/* FilterBar (Rule 2) */}
      <QCFilterBar />

      {/* Content Area */}
      <div className="flex-1 overflow-auto card-flat">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th className="text-left">{t('colJobCode')}</th>
              <th className="text-left">{t('colStep')}</th>
              <th className="text-left">{t('colDate')}</th>
              <th className="text-left">{t('colKCS')}</th>
              <th className="text-right">{t('colChecked')}</th>
              <th className="text-right">{t('colPass')}</th>
              <th className="text-right">{t('colNG')}</th>
              <th className="text-center">{t('colDefect')}</th>
            </tr>
          </thead>
          <tbody>
            {logs?.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-slate-500 py-8">
                  {t('emptyText')}
                </td>
              </tr>
            ) : (
              logs?.map((log: any) => {
                const hasNG = log.quantity_ng > 0
                return (
                  <tr key={log.qc_log_id}>
                    <td>
                      <Link 
                        href={`/production/jobs/${log.jobs.job_id}`}
                        className="text-[var(--accent)] font-bold font-mono text-[13px] hover:underline"
                      >
                        {log.jobs.job_code}
                      </Link>
                    </td>
                    <td className="text-slate-600 font-medium text-[13px]">
                      {log.job_steps.step_name}
                    </td>
                    <td className="text-slate-600 text-[12px]">
                      {new Date(log.recorded_at).toLocaleString('ja-JP')}
                    </td>
                    <td className="text-slate-900 text-[13px]">
                      {log.employees?.employee_name || '—'}
                    </td>
                    <td className="text-right font-mono text-[13px] text-slate-900">
                      {log.quantity_checked}
                    </td>
                    <td className="text-right font-mono text-[13px] text-emerald-600">
                      {log.quantity_pass}
                    </td>
                    <td className={`text-right font-mono text-[13px] ${hasNG ? 'text-red-600 font-bold' : 'text-slate-400'}`}>
                      {log.quantity_ng}
                    </td>
                    <td className="text-center">
                      {hasNG && log.defect_category ? (
                        <span className="badge badge--error">
                          {log.defect_category}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
