'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Hammer, ArrowRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

type Job = {
  job_id: string
  job_code: string
  job_name: string
  job_status: string
  overall_progress: number
  created_at: string
  design_revision_id: string | null
  physical_mold_id: string | null
  job_types: { job_type_name_ja: string } | null
  design_revisions: { design_code: string, revision_number: number } | null
  physical_molds: { display_name: string, system_code: string } | null
}

export function DesignJobsList({ 
  productId,
  selectedRevisionId,
  selectedMoldId
}: { 
  productId: string
  selectedRevisionId: string | null
  selectedMoldId: string | null
}) {
  const t = useTranslations('Engineering')
  const supabase = createClient()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('jobs')
      .select(`
        job_id, job_code, job_name, job_status, overall_progress, created_at,
        design_revision_id, physical_mold_id,
        job_types(job_type_name_ja),
        design_revisions(design_code, revision_number),
        physical_molds(display_name, system_code, mold_revisions(design_revision_id))
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (data) setJobs(data as unknown as Job[])
    setLoading(false)
  }, [productId, supabase])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  if (loading) {
    return <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('loading')}</div>
  }

  const filteredJobs = jobs.filter(j => {
    if (selectedMoldId) {
      return j.physical_mold_id === selectedMoldId
    }
    if (selectedRevisionId) {
      if (j.design_revision_id === selectedRevisionId) return true
      if ((j.physical_molds as any)?.mold_revisions?.design_revision_id === selectedRevisionId) return true
      return false
    }
    return true
  })

  return (
    <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Hammer size={14} style={{ color: 'var(--accent)' }} />
        <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>{t('relatedJobs')}</h3>
        {selectedMoldId ? (
          <span className="badge badge--info" style={{ fontSize: 10, marginLeft: 'auto', fontWeight: 600 }}>
            Filtered by Mold
          </span>
        ) : selectedRevisionId ? (
          <span className="badge badge--info" style={{ fontSize: 10, marginLeft: 'auto', fontWeight: 600 }}>
            Filtered by Revision
          </span>
        ) : null}
      </div>
      <div style={{ overflowX: 'auto', maxHeight: 400 }}>
        {filteredJobs.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
            {t('noRelatedJobs')}
          </div>
        ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('jobCode')}</th>
              <th>{t('jobName')}</th>
              <th>{t('jobType')}</th>
              <th>{t('targetDesign')}</th>
              <th>{t('targetMold')}</th>
              <th>{t('statusLabel')}</th>
              <th>{t('progress')}</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.job_id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                    <Link href={`/equipment/jobs/${job.job_id}`} style={{ color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {job.job_code}
                        <ExternalLink size={10} />
                    </Link>
                </td>
                <td style={{ fontSize: 12 }}>{job.job_name}</td>
                <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{job.job_types?.job_type_name_ja || '—'}</td>
                <td style={{ fontSize: 11, fontFamily: 'monospace' }}>
                    {job.design_revisions ? `${job.design_revisions.design_code} (Rev ${job.design_revisions.revision_number})` : '—'}
                </td>
                <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {job.physical_molds ? `${job.physical_molds.display_name}` : '—'}
                </td>
                <td style={{ fontSize: 11 }}>{job.job_status}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-surface-3)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${job.overall_progress || 0}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }} />
                    </div>
                    <span style={{ fontSize: 10, fontFamily: 'monospace' }}>{job.overall_progress || 0}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  )
}
