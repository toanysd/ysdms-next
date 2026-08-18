'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, Clock, User, Briefcase, Loader2, Calendar } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { EditStepModal } from './EditStepModal'

type WorklogRow = {
  log_id: string
  job_id: string
  job_step_id: string | null
  employee_id: string
  work_date: string
  hours_spent: number | null
  is_finished: boolean | null
  description: string | null
  notes: string | null
  processing_code_id?: number | null
  employees: { employee_name: string } | null
  job_steps: { step_name: string; step_no: number } | null
}

export function LogsTab({ job, onRefresh }: { job: any; onRefresh: () => void }) {
  const t = useTranslations()
  const supabase = createClient()
  const [logs, setLogs] = useState<WorklogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedStep, setSelectedStep] = useState<any | null>(null)
  const [editingLog, setEditingLog] = useState<any | null>(null)

  const jobSteps = useMemo(() => (
    (job.job_steps || []).map((s: any) => ({
      step_id: s.step_id,
      step_no: s.step_no,
      step_name: s.step_name,
      job_id: job.job_id,
    }))
  ), [job])

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('work_logs')
      .select(`
        log_id, job_id, job_step_id, employee_id,
        work_date, hours_spent, is_finished, description, notes, processing_code_id,
        employees(employee_name),
        job_steps(step_id, step_name, step_no)
      `)
      .eq('job_id', job.job_id)
      .order('work_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (err) setError(err.message)
    else setLogs(data as any[])
    setLoading(false)
  }, [job.job_id, supabase])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const handleDelete = async (logId: string) => {
    if (!window.confirm(t('Common.deleteConfirm'))) return
    const { error: err } = await supabase.from('work_logs').delete().eq('log_id', logId)
    if (err) alert(err.message)
    else { fetchLogs(); onRefresh() }
  }

  const handleOpenCreate = () => {
    setSelectedStep(job.job_steps?.[0] || null)
    setEditingLog(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (log: WorklogRow) => {
    const matchedStep = (job.job_steps || []).find((s: any) => s.step_id === log.job_step_id)
    setSelectedStep(matchedStep || job.job_steps?.[0] || null)
    setEditingLog(log)
    setModalOpen(true)
  }

  const { totalHours, hoursByStep, hoursByWorker } = useMemo(() => {
    let total = 0
    const byStep: Record<string, number> = {}
    const byWorker: Record<string, number> = {}
    logs.forEach(log => {
      const hrs = log.hours_spent || 0
      total += hrs
      const stepKey = log.job_steps?.step_name || 'Other'
      byStep[stepKey] = (byStep[stepKey] || 0) + hrs
      const workerKey = log.employees?.employee_name || 'Unknown'
      byWorker[workerKey] = (byWorker[workerKey] || 0) + hrs
    })
    return { totalHours: total, hoursByStep: byStep, hoursByWorker: byWorker }
  }, [logs])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', height: '100%' }}>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>

        <div className="card-flat" style={{ padding: 16, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={16} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: 13, fontWeight: 700 }}>{t('Equipment.tongGioThucTe')}</h3>
            </div>
            <button className="btn btn-primary" style={{ height: 28, padding: '0 10px', fontSize: 11 }} onClick={handleOpenCreate}>
              <Plus size={12} />
              <span>{t('Equipment.themNhatKy')}</span>
            </button>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
            {totalHours.toFixed(2)} <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>h</span>
          </div>
        </div>

        <div className="card-flat" style={{ padding: 16, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Briefcase size={14} style={{ color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: 12, fontWeight: 700 }}>{t('Equipment.byStep')}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 80, overflowY: 'auto' }} className="custom-scrollbar">
            {Object.entries(hoursByStep).map(([step, hrs]) => (
              <div key={step} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{step}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{(hrs as number).toFixed(2)}h</span>
              </div>
            ))}
            {Object.keys(hoursByStep).length === 0 && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('Common.noData')}</div>}
          </div>
        </div>

        <div className="card-flat" style={{ padding: 16, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <User size={14} style={{ color: 'var(--text-muted)' }} />
            <h3 style={{ fontSize: 12, fontWeight: 700 }}>{t('Equipment.byWorker')}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 80, overflowY: 'auto' }} className="custom-scrollbar">
            {Object.entries(hoursByWorker).map(([worker, hrs]) => (
              <div key={worker} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{worker}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{(hrs as number).toFixed(2)}h</span>
              </div>
            ))}
            {Object.keys(hoursByWorker).length === 0 && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('Common.noData')}</div>}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: 0 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{t('Equipment.workLogDetail')}</div>
          {loading && <Loader2 size={14} className="animate-spin text-[var(--accent)]" />}
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
          <table className="data-table">
            <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-surface-2)', zIndex: 1 }}>
              <tr>
                <th style={{ width: 100 }}>{t('Equipment.logWorkDate')}</th>
                <th style={{ width: 130 }}>{t('Equipment.logWorker')}</th>
                <th style={{ width: 160 }}>{t('Equipment.step')}</th>
                <th>{t('Equipment.logDescription')}</th>
                <th style={{ width: 80 }}>{t('Equipment.logHours')}</th>
                <th style={{ width: 60 }}>{t('Equipment.completed')}</th>
                <th style={{ width: 80 }}>{t('Equipment.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {!loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>
                    {t('Equipment.noLogs')}
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.log_id}>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>
                        <Calendar size={10} style={{ color: 'var(--text-muted)' }} />
                        {new Date(log.work_date).toLocaleDateString('ja-JP')}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: 12, color: 'var(--text-primary)' }}>
                      {log.employees?.employee_name || '—'}
                    </td>
                    <td style={{ fontSize: 12, fontWeight: 600 }}>
                      {log.job_steps
                        ? `${log.job_steps.step_no != null ? log.job_steps.step_no + '. ' : ''}${log.job_steps.step_name}`
                        : <span style={{ color: 'var(--text-muted)' }}>—</span>
                      }
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                      {log.notes || log.description || '—'}
                    </td>
                    <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)', fontSize: 13 }}>
                      {log.hours_spent != null ? log.hours_spent.toFixed(2) : '0.00'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {log.is_finished
                        ? <span className="badge badge--success" style={{ fontSize: 11 }}>✓</span>
                        : <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</span>
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleOpenEdit(log)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title={t('Common.edit')}>
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(log.log_id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-error)' }} title={t('Common.delete')}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal (EditStepModal - Unified 2-Panel A4 Preview) ── */}
      {modalOpen && (
        <EditStepModal
          jobId={job.job_id}
          step={selectedStep}
          nextStepNo={(job.job_steps || []).length + 1}
          initialLog={editingLog}
          onClose={() => { setModalOpen(false); setEditingLog(null); setSelectedStep(null) }}
          onSaved={() => { setModalOpen(false); setEditingLog(null); setSelectedStep(null); fetchLogs(); onRefresh() }}
        />
      )}
    </div>
  )
}

