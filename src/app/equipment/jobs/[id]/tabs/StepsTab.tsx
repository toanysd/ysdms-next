'use client'

import { useTranslations } from 'next-intl'
import { CheckCircle2, Circle, Clock, ArrowUp, ArrowDown, ArrowUpDown, Pencil, Trash2, Plus } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { EditStepModal } from './EditStepModal'

const STEP_STATUS_MAP: Record<string, { key: string; color: string }> = {
  PENDING:     { key: 'statusPending', color: 'var(--text-muted)' },
  IN_PROGRESS: { key: 'statusInProgress', color: 'var(--status-warning)' },
  COMPLETED:   { key: 'statusCompleted', color: 'var(--status-success)' },
}

export function StepsTab({ job, onRefresh }: { job: any; onRefresh?: () => void }) {
  const t = useTranslations()

  const steps = [...(job.job_steps || [])].sort((a: any, b: any) => a.step_no - b.step_no)
  const supabase = createClient()

  const [sortCol, setSortCol] = useState('step_no')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc')
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeStep, setActiveStep] = useState<any | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const sortedSteps = [...steps].sort((a: any, b: any) => {
    const av = a[sortCol]
    const bv = b[sortCol]
    if (av == null && bv == null) return 0
    if (av == null) return 1
    if (bv == null) return -1
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortDir === 'asc' ? cmp : -cmp
  })

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown size={11} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
    return sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />
  }

  const SortTh = ({ col, label, style }: { col: string; label: string; style?: React.CSSProperties }) => (
    <th style={{ ...style, cursor: 'pointer', userSelect: 'none' }} onClick={() => handleSort(col)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div>
          {label}
        </div>
        <SortIcon col={col} />
      </div>
    </th>
  )

  const openCreateModal = () => {
    setActiveStep(null)
    setIsModalOpen(true)
  }

  const openEditModal = (step: any) => {
    setActiveStep(step)
    setIsModalOpen(true)
  }

  const handleDelete = async (e: React.MouseEvent, stepId: string, stepName: string) => {
    e.stopPropagation()
    if (!window.confirm(t('Common.deleteConfirm'))) {
      return
    }
    
    setDeleting(stepId)
    const { error } = await supabase.from('job_steps').delete().eq('step_id', stepId)
    setDeleting(null)
    
    if (error) {
      alert(t('Common.deleteError') + error.message)
    } else {
      onRefresh?.()
    }
  }

  const handleStepSaved = () => {
    onRefresh?.()
  }

  const nextStepNo = steps.length > 0 ? Math.max(...steps.map(s => s.step_no)) + 1 : 1

  return (
    <>
      <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)' }}>
            <Clock size={16} style={{ color: 'var(--accent)' }} />
            {t('Equipment.danhSachCongOan')}
          </h3>
          <button className="btn btn-primary text-xs" onClick={openCreateModal}>
            <Plus size={14} />
            {t('Equipment.themCongOan')}
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <SortTh col="step_no" label="No." style={{ width: 55, textAlign: 'center' }} />
                <SortTh col="step_name" label={t('Equipment.tenCongOan')} style={{ width: 180 }} />
                <th style={{ width: 80 }}>
                  {t('Equipment.track')}
                </th>
                <SortTh col="step_status" label={t('Equipment.trangThai')} style={{ width: 100 }} />
                <SortTh col="planned_start" label={t('Equipment.batAuDuKien')} style={{ width: 110 }} />
                <SortTh col="planned_end" label={t('Equipment.ketThucDuKien')} style={{ width: 110 }} />
                <SortTh col="planned_hours" label={t('Equipment.gioDuKien')} style={{ width: 80 }} />
                <SortTh col="actual_hours" label={t('Equipment.gioThucTe')} style={{ width: 80 }} />
                <SortTh col="deadline" label={t('Equipment.hanChot')} style={{ width: 100 }} />
                <th style={{ width: 140 }}>備考 (Ghi chú)</th>
                <th style={{ width: 70 }}></th>
              </tr>
            </thead>
            <tbody>
              {sortedSteps.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                    {t('Equipment.noSteps')}
                  </td>
                </tr>
              ) : (
                sortedSteps.map((step: any) => {
                  const isCompleted = step.step_status === 'COMPLETED'
                  const isRunning = step.step_status === 'IN_PROGRESS'
                  const stLabel = STEP_STATUS_MAP[step.step_status || ''] || STEP_STATUS_MAP['PENDING']
                  
                  return (
                    <tr
                      key={step.step_id}
                      style={{ cursor: 'pointer', opacity: deleting === step.step_id ? 0.5 : 1 }}
                      onClick={() => openEditModal(step)}
                    >
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 700 }}>{step.step_no}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{step.step_name}</td>
                      <td>
                        <span className="badge" style={{ backgroundColor: 'var(--bg-surface-3)', color: 'var(--text-primary)' }}>
                          {step.track || '—'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: stLabel.color }}>
                          {isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                          <span style={{ fontWeight: isCompleted || isRunning ? 700 : 400 }}>
                            {step.processing_statuses?.status_code || (t as any)(`Equipment.${stLabel.key}`) || stLabel.key}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {step.planned_start ? new Date(step.planned_start).toLocaleDateString('ja-JP') : '—'}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {step.planned_end ? new Date(step.planned_end).toLocaleDateString('ja-JP') : '—'}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        {step.planned_hours != null ? (
                          `${step.planned_hours}h`
                        ) : step.estimated_hours != null ? (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', opacity: 0.7 }}>({step.estimated_hours}h)</span>
                        ) : '—'}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>
                        {step.actual_hours != null ? `${step.actual_hours}h` : '—'}
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {step.deadline ? new Date(step.deadline).toLocaleDateString('ja-JP') : '—'}
                      </td>
                      <td style={{ fontSize: 11, color: 'var(--text-secondary)', maxWidth: 140 }} className="truncate" title={step.notes || ''}>
                        {step.notes || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditModal(step) }}
                            className="btn-icon"
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                            title={t('Common.edit')}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, step.step_id, step.step_name)}
                            className="btn-icon hover-danger"
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                            title={t('Common.delete')}
                            disabled={deleting === step.step_id}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <EditStepModal
          step={activeStep}
          jobId={job.job_id}
          nextStepNo={nextStepNo}
          onClose={() => setIsModalOpen(false)}
          onSaved={handleStepSaved}
        />
      )}
    </>
  )
}

