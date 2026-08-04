import { Wrench, Calendar, User, Briefcase, Plus, Shield } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createMoldJobAction } from '@/app/actions/mold-job'
import { useTranslations } from 'next-intl'
import type { MoldDetailData } from '../page'
import { CreateJobModal } from '@/components/equipment/CreateJobModal'

type JobRow = {
  job_id: string
  job_code: string
  job_name: string
  job_status: string | null
  overall_progress: number | null
  mold_deadline: string | null
  notes: string | null
  created_at: string | null
  job_types?: { job_type_name_ja: string; job_type_name_vi: string } | null
  employees?: { employee_name: string } | null
}

type JobType = {
  job_type_id: string
  job_type_name_ja: string
  job_type_name_vi: string
}

type Employee = {
  employee_id: string
  employee_code: string
  employee_name: string
}

export function JobsTab({ mold }: { mold: MoldDetailData }) {
  const tEquipment = useTranslations('Equipment')
  const tCommon = useTranslations('Common')
  const supabase = createClient()
  const [jobs, setJobs] = useState<JobRow[]>([])
  const [loading, setLoading] = useState(true)

  // Form states - removed old inline modal states
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('jobs')
      .select(`
        *,
        job_types!jobs_job_type_id_fkey(job_type_name_ja, job_type_name_vi),
        employees!jobs_responsible_id_fkey(employee_name)
      `)
      .eq('physical_mold_id', mold.physical_mold_id)
      .order('created_at', { ascending: false })

    setJobs((data as any[]) || [])
    setLoading(false)
  }, [mold.physical_mold_id, supabase])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  return (
    <div className="card-flat" style={{ padding: 0 }}>
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid var(--border-default)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
          <Wrench size={13} style={{ marginRight: 4, verticalAlign: -2 }} />
          {tEquipment('machiningRepairJobsTitle')}
        </h3>
        <button
          className="btn btn-secondary"
          style={{ height: 26, padding: '0 8px', fontSize: 11 }}
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={12} />
          <span>{tEquipment('Jobs.createJob')}</span>
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>{tEquipment('Jobs.cols.jobCode')}</th>
              <th>{tEquipment('Jobs.cols.jobName')}</th>
              <th>{tEquipment('Jobs.cols.type')}</th>
              <th>{tEquipment('Jobs.cols.status')}</th>
              <th>{tEquipment('Jobs.cols.progress')}</th>
              <th>{tEquipment('operator')}</th>
              <th>{tEquipment('Jobs.cols.deadline')}</th>
              <th>{tCommon('notes')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: 20, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>{tCommon('loading')}</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: 20, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>{tEquipment('Jobs.noData')}</td></tr>
            ) : (
              jobs.map(job => (
                <tr key={job.job_id}>
                  <td>
                    <Link
                      href={`/equipment/jobs/${job.job_id}`}
                      style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace', fontSize: 13, textDecoration: 'none' }}
                    >
                      {job.job_code}
                    </Link>
                  </td>
                  <td>{job.job_name}</td>
                  <td>
                    {job.job_types ? (
                      <span style={{ fontFamily: 'var(--font-jp)', fontSize: 11 }}>
                        {job.job_types.job_type_name_ja}
                      </span>
                    ) : '—'}
                  </td>
                  <td>
                    <span className={`badge ${
                      job.job_status === 'COMPLETED' ? 'badge--success' : 
                      job.job_status === 'IN_PROGRESS' ? 'badge--warning' : 'badge--neutral'
                    }`}>
                      {job.job_status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, height: 4, background: 'var(--bg-surface-3)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${job.overall_progress || 0}%`,
                          background: job.job_status === 'COMPLETED' ? 'var(--status-success)' : 'var(--accent)'
                        }} />
                      </div>
                      <span style={{ fontSize: 10, fontFamily: 'monospace' }}>{job.overall_progress || 0}%</span>
                    </div>
                  </td>
                  <td>{job.employees?.employee_name || '—'}</td>
                  <td>
                    {job.mold_deadline ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11 }}>
                        <Calendar size={10} style={{ color: 'var(--text-muted)' }} />
                        {new Date(job.mold_deadline).toLocaleDateString('ja-JP')}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{job.notes || ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <CreateJobModal
          initialPhysicalMoldId={mold.physical_mold_id}
          productId={mold.mold_revisions?.product_id || undefined}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchJobs()
          }}
        />
      )}
    </div>
  )
}
