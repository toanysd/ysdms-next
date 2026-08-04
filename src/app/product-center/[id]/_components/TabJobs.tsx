'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Hammer, Clock, PlusCircle, ExternalLink, Wrench, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface TabJobsProps {
  productId: string
}

interface Job {
  job_id: string
  job_code: string
  job_name: string
  job_status: string
  mold_deadline: string
  responsible: string
}

interface WorkLog {
  log_id: string
  date: string
  worker: string
  hours: number
  notes: string
}

const STATUS_BADGE: Record<string, string> = {
  IN_PROGRESS: 'badge badge--info',
  COMPLETED: 'badge badge--success',
  ON_HOLD: 'badge badge--warning',
  CANCELLED: 'badge badge--error',
  NEW: 'badge badge--neutral',
  NOT_STARTED: 'badge badge--neutral',
}

export function TabJobs({ productId }: TabJobsProps) {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()

  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [loadingLogs, setLoadingLogs] = useState(false)

  useEffect(() => {
    async function loadJobs() {
      setLoadingJobs(true)
      try {
        const { data: revs } = await supabase
          .from('design_revisions')
          .select('revision_id')
          .eq('product_id', productId)

        const revIds = (revs || []).map((r: any) => r.revision_id)

        let query = supabase
          .from('jobs')
          .select(`job_id, job_code, job_name, job_status, mold_deadline, created_at, job_types(job_type_name_ja)`)

        if (revIds.length > 0) {
          query = query.or(`product_id.eq.${productId},design_revision_id.in.(${revIds.join(',')})`)
        } else {
          query = query.eq('product_id', productId)
        }

        const { data: jobData, error } = await query.order('created_at', { ascending: false })

        if (error) throw error
        if (jobData) {
          const list: Job[] = jobData.map((j: any) => ({
            job_id: j.job_id,
            job_code: j.job_code,
            job_name: j.job_name || j.job_types?.job_type_name_ja || '',
            job_status: j.job_status || 'NOT_STARTED',
            mold_deadline: j.mold_deadline || '',
            responsible: '',
          }))
          setJobs(list)
          if (list.length > 0) setSelectedJobId(list[0].job_id)
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
      } finally {
        setLoadingJobs(false)
      }
    }
    if (productId) loadJobs()
  }, [productId])

  useEffect(() => {
    async function loadLogs() {
      if (!selectedJobId) { setWorkLogs([]); return }
      setLoadingLogs(true)
      try {
        const { data: logData, error } = await supabase
          .from('work_logs')
          .select(`log_id, work_date, hours_spent, notes, description, employees(employee_name)`)
          .eq('job_id', selectedJobId)
          .order('work_date', { ascending: false })

        if (error) throw error
        if (logData) {
          const list: WorkLog[] = logData.map((l: any) => ({
            log_id: l.log_id,
            date: l.work_date || '',
            worker: l.employees?.employee_name || '—',
            hours: l.hours_spent || 0,
            notes: l.description || l.notes || '',
          }))
          setWorkLogs(list)
        }
      } catch (err) {
        console.error('Error fetching worklogs:', err)
      } finally {
        setLoadingLogs(false)
      }
    }
    loadLogs()
  }, [selectedJobId])

  const totalHours = workLogs.reduce((acc, log) => acc + log.hours, 0)
  const selectedJob = jobs.find(j => j.job_id === selectedJobId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Hammer size={16} style={{ color: 'var(--tint-orange-text)' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {t('machiningHistoryAndWorkLogs', { count: jobs.length })}
          </span>
        </div>
        <Link
          href={`/equipment/jobs/quick-create?product_id=${productId}`}
          className="btn btn-secondary"
          style={{ height: 28, padding: '0 10px', fontSize: 11, gap: 4, textDecoration: 'none' }}
        >
          <PlusCircle size={12} />
          <span>{t('newJob')}</span>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card-flat" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          {t('noMachiningJobs')}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 36%) 1fr', gap: 12 }}>

          {/* Left Column: Jobs List (Tinted Orange Header) */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-orange-border)' }}>
            <div style={{
              background: 'var(--tint-orange-bg)', borderBottom: '1px solid var(--tint-orange-border)',
              padding: '10px 12px', fontSize: 12, fontWeight: 700, color: 'var(--tint-orange-text)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span>{t('machiningJobList')}</span>
              <span style={{ fontSize: 10, background: 'var(--bg-surface)', padding: '1px 6px', borderRadius: 10 }}>{jobs.length}</span>
            </div>

            <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {jobs.map(job => {
                const isSelected = selectedJobId === job.job_id
                return (
                  <div
                    key={job.job_id}
                    onClick={() => setSelectedJobId(job.job_id)}
                    style={{
                      padding: '8px 10px', cursor: 'pointer', borderRadius: 6,
                      background: isSelected ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--bg-surface-2)',
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-default)',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 14, color: 'var(--accent)' }}>
                        {job.job_code}
                      </span>
                      <span className={STATUS_BADGE[job.job_status] || 'badge badge--neutral'} style={{ fontSize: 9 }}>
                        {job.job_status}
                      </span>
                      {job.mold_deadline && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto', fontWeight: 600 }}>
                          <Clock size={11} />{job.mold_deadline.slice(0, 10)}
                        </span>
                      )}
                    </div>
                    {job.job_name && (
                      <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600, marginTop: 4 }}>
                        {job.job_name}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Work Logs Timeline (Tinted Blue Header) */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-blue-border)' }}>
            <div style={{
              background: 'var(--tint-blue-bg)', borderBottom: '1px solid var(--tint-blue-border)',
              padding: '10px 12px', fontSize: 12, fontWeight: 700, color: 'var(--tint-blue-text)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                {selectedJob ? (
                  <span>
                    {t('workLogTitle')} — <Link href={`/equipment/jobs/${selectedJobId}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontFamily: 'monospace', fontWeight: 800 }}>
                      {selectedJob.job_code} <ExternalLink size={11} style={{ display: 'inline', verticalAlign: 'middle' }} />
                    </Link>
                  </span>
                ) : t('workLogTitle')}
              </div>
              {totalHours > 0 && (
                <span style={{ fontSize: 11, color: 'var(--tint-blue-text)', fontWeight: 700, background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--tint-blue-border)' }}>
                  {t('totalHoursLabel')} <strong>{totalHours}h</strong>
                </span>
              )}
            </div>

            <div style={{ padding: 12 }}>
              {loadingLogs ? (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('loadingLogs')}</span>
              ) : workLogs.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                  {t('noWorkLogs')}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '90px 1.2fr 60px 2fr', gap: 8, padding: '6px 8px', background: 'var(--bg-surface-2)', borderRadius: 4, fontWeight: 700, fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>{t('workDateColumn')}</span>
                    <span>{t('workerColumn')}</span>
                    <span style={{ textAlign: 'right' }}>{t('hoursColumn')}</span>
                    <span>{t('notesColumn')}</span>
                  </div>
                  {workLogs.map((log, idx) => (
                    <div
                      key={log.log_id}
                      style={{
                        display: 'grid', gridTemplateColumns: '90px 1.2fr 60px 2fr', gap: 8,
                        padding: '8px', fontSize: 12,
                        borderBottom: idx < workLogs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      }}
                    >
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 600 }}>{log.date || '—'}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 700 }}>{log.worker}</span>
                      <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 800, textAlign: 'right', fontFamily: 'monospace' }}>{log.hours}h</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.notes || '—'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}