'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  X, Settings, Plus, Wrench, Clock, CheckSquare, RefreshCw, Edit3, Trash2, Calendar, User, FileText, ChevronRight
} from 'lucide-react'
import { EquipmentTypeIcon, getEquipmentTypeTheme } from '@/components/ui/EquipmentTypeIcon'
import { QuickWizardMode } from './CenteredQuickJobWizardModal'

interface EquipmentJobDrawerProps {
  isOpen: boolean
  onClose: () => void
  equipment: {
    id: string
    type: string
    code: string
    name: string
    status: string
    rack: string
  } | null
  onOpenJobWizard?: (mode: QuickWizardMode, targetEquip?: any) => void
}

export function EquipmentJobDrawer({ isOpen, onClose, equipment, onOpenJobWizard }: EquipmentJobDrawerProps) {
  const supabase = createClient()

  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedJob, setSelectedJob] = useState<any | null>(null)
  const [selectedStepFilter, setSelectedStepFilter] = useState<string | null>(null)

  // Worklog Sub-Modal State inside Drawer
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [editingLogId, setEditingLogId] = useState<string | null>(null)
  const [logForm, setLogForm] = useState({
    work_date: new Date().toISOString().split('T')[0],
    worker_name: 'ダオ ティ ジェン',
    job_step_id: '',
    hours_spent: 1.0,
    processing_code_id: '',
    description: '',
  })
  const [processingCodes, setProcessingCodes] = useState<any[]>([])
  const [isSavingLog, setIsSavingLog] = useState(false)

  // Load jobs for equipment
  const fetchJobs = useCallback(async (equipId: string) => {
    setLoading(true)
    try {
      const { data: jobData } = await supabase
        .from('jobs')
        .select('*, job_steps(*), work_logs(*, employees(employee_name), processing_codes(processing_name))')
        .eq('equipment_id', equipId)
        .order('created_at', { ascending: false })

      if (jobData && jobData.length > 0) {
        setJobs(jobData)
        setSelectedJob(jobData[0])
      } else {
        setJobs([])
        setSelectedJob(null)
      }

      // Load processing codes master
      const { data: pcData } = await supabase
        .from('processing_codes')
        .select('processing_code_id, processing_name')
        .eq('is_active', true)
        .order('processing_code_id', { ascending: true })

      if (pcData) setProcessingCodes(pcData)
    } catch (err) {
      console.error('Error fetching jobs for drawer:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (isOpen && equipment?.id) {
      fetchJobs(equipment.id)
    }
  }, [isOpen, equipment, fetchJobs])

  // Open Log Modal (Create or Edit)
  const handleOpenAddLog = (stepId?: string) => {
    setEditingLogId(null)
    setLogForm({
      work_date: new Date().toISOString().split('T')[0],
      worker_name: 'ダオ ティ ジェン',
      job_step_id: stepId || (selectedJob?.job_steps?.[0]?.step_id || ''),
      hours_spent: 1.0,
      processing_code_id: processingCodes[0]?.processing_code_id ? String(processingCodes[0].processing_code_id) : '',
      description: '',
    })
    setIsLogModalOpen(true)
  }

  const handleOpenEditLog = (log: any) => {
    setEditingLogId(log.log_id)
    setLogForm({
      work_date: log.work_date ? new Date(log.work_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      worker_name: log.employees?.employee_name || 'ダオ ティ ジェン',
      job_step_id: log.job_step_id || '',
      hours_spent: Number(log.hours_spent || 1.0),
      processing_code_id: log.processing_code_id ? String(log.processing_code_id) : '',
      description: log.description || '',
    })
    setIsLogModalOpen(true)
  }

  // Save Log
  const handleSaveLog = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return

    setIsSavingLog(true)
    try {
      // Find worker employee_id
      const { data: emp } = await supabase
        .from('employees')
        .select('employee_id')
        .ilike('employee_name', `%${logForm.worker_name}%`)
        .maybeSingle()

      const payload: any = {
        job_id: selectedJob.job_id,
        job_step_id: logForm.job_step_id || null,
        work_date: logForm.work_date,
        hours_spent: Number(logForm.hours_spent),
        processing_code_id: logForm.processing_code_id ? Number(logForm.processing_code_id) : null,
        description: logForm.description,
      }
      if (emp?.employee_id) {
        payload.employee_id = emp.employee_id
      }

      if (editingLogId) {
        await supabase.from('work_logs').update(payload).eq('log_id', editingLogId)
      } else {
        await supabase.from('work_logs').insert([payload])
      }

      setIsLogModalOpen(false)
      if (equipment?.id) fetchJobs(equipment.id)
    } catch (err) {
      console.error('Error saving worklog:', err)
    } finally {
      setIsSavingLog(false)
    }
  }

  // Delete Log
  const handleDeleteLog = async (logId: string) => {
    if (!confirm('この作業日報を削除しますか？')) return
    try {
      await supabase.from('work_logs').delete().eq('log_id', logId)
      if (equipment?.id) fetchJobs(equipment.id)
    } catch (err) {
      console.error('Error deleting log:', err)
    }
  }

  if (!equipment) return null

  const theme = getEquipmentTypeTheme(equipment.type)

  // Filtered worklogs for selected job
  const displayedLogs = selectedJob?.work_logs ? (
    selectedStepFilter
      ? selectedJob.work_logs.filter((l: any) => l.job_step_id === selectedStepFilter)
      : selectedJob.work_logs
  ) : []

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.35)',
            backdropFilter: 'blur(2px)', zIndex: 9989, transition: 'opacity 0.2s ease'
          }}
        />
      )}

      {/* Slide-over Side Drawer Container */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: 620, maxWidth: '92vw',
          background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-default)',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.18)', zIndex: 9990,
          display: 'flex', flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* DRAWER HEADER */}
        <div
          style={{
            padding: '12px 16px', borderBottom: '1px solid var(--border-default)',
            background: 'var(--bg-surface-2)', display: 'flex', flexDirection: 'column', gap: 8
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
              <EquipmentTypeIcon type={equipment.type} size={18} />
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: theme.color }}>
                {equipment.code}
              </span>
              <span style={{ fontSize: 10, background: theme.bg, color: theme.color, border: `1px solid ${theme.borderColor}`, padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>
                {theme.labelJA}
              </span>
              <span className="badge badge--neutral" style={{ fontSize: 9 }}>
                {equipment.status || 'ACTIVE'}
              </span>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer', padding: 4,
                color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              title="閉じる (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Equipment Display Name & Location */}
          <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{equipment.name || '名称未設定'}</span>
            {equipment.rack !== '—' && (
              <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Clock size={10} /> 保管棚: {equipment.rack}
              </span>
            )}
          </div>

          {/* Header Action Suite */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, borderTop: '1px solid var(--border-default)' }}>
            <button
              className="btn btn-primary"
              style={{ fontSize: 10, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={() => onOpenJobWizard?.('CREATE_JOB', equipment)}
            >
              <Plus size={12} /> + 新規Job指示
            </button>
            <button
              className="btn btn-secondary"
              style={{ fontSize: 10, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
              onClick={() => onOpenJobWizard?.('CREATE_JOB', equipment)}
            >
              <Wrench size={12} /> 全機能 Hubを開く
            </button>
          </div>
        </div>

        {/* DRAWER BODY (CONTENT SPLIT VIEW) */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
              <RefreshCw size={18} className="spin" style={{ marginBottom: 8 }} />
              <span>Jobデータを読み込み中...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ flex: 1, padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
              <span>この設備 ({equipment.code}) に登録された加工Jobはありません。</span>
              <button
                className="btn btn-primary"
                style={{ fontSize: 11, marginTop: 12, padding: '4px 12px' }}
                onClick={() => onOpenJobWizard?.('CREATE_JOB', equipment)}
              >
                + 新規Job作成指示を出す
              </button>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr', overflow: 'hidden' }}>
              
              {/* LEFT SUB-COLUMN: JOBS LIST */}
              <div style={{ borderRight: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', padding: 8, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 2 }}>
                  登録Job ({jobs.length}件)
                </div>

                {jobs.map(job => {
                  const isSelected = selectedJob?.job_id === job.job_id
                  const stepsCount = job.job_steps?.length || 0
                  const logsCount = job.work_logs?.length || 0
                  const totalHours = (job.work_logs || []).reduce((sum: number, l: any) => sum + Number(l.hours_spent || 0), 0)

                  return (
                    <div
                      key={job.job_id}
                      onClick={() => {
                        setSelectedJob(job)
                        setSelectedStepFilter(null)
                      }}
                      style={{
                        padding: 8, borderRadius: 6, cursor: 'pointer',
                        borderLeft: isSelected ? '3px solid var(--accent)' : '1px solid var(--border-default)',
                        background: isSelected ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--bg-surface)',
                        transition: 'all 0.12s ease', display: 'flex', flexDirection: 'column', gap: 2
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>
                          {job.job_code}
                        </span>
                        <span className="badge badge--info" style={{ fontSize: 8, padding: '0px 4px' }}>
                          {job.job_status || 'PENDING'}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {job.job_name || '(名称未設定)'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: '#64748B' }}>
                        <span>工程: {stepsCount} | 日報: {logsCount}</span>
                        <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{totalHours.toFixed(1)}h</strong>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* RIGHT SUB-COLUMN: SELECTED JOB DETAILS, STEPS & WORKLOGS */}
              {selectedJob ? (
                <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  
                  {/* JOB DIRECTIVE SUMMARY HEADER */}
                  <div style={{ padding: 10, background: 'var(--bg-surface-2)', borderRadius: 6, border: '1px solid var(--border-default)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                        {selectedJob.job_code}: {selectedJob.job_name || '名称未設定'}
                      </span>
                      <span className="badge badge--neutral" style={{ fontSize: 9 }}>
                        区分: {selectedJob.wo_type || 'NEW'}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: 10, color: '#475569' }}>
                      <div>着手: <strong style={{ color: '#0F172A' }}>{selectedJob.start_date ? new Date(selectedJob.start_date).toLocaleDateString() : '-'}</strong></div>
                      <div>納期: <strong style={{ color: '#0F172A' }}>{selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : '-'}</strong></div>
                      <div>場所: <strong style={{ color: '#0F172A' }}>{selectedJob.manufacture_location === 'IN_HOUSE' ? '社内' : '外注'}</strong></div>
                      <div>備考: <span style={{ color: '#0F172A' }}>{selectedJob.notes || '-'}</span></div>
                    </div>
                  </div>

                  {/* JOB STEPS LIST */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Settings size={13} color="var(--accent)" /> 加工工程リスト ({selectedJob.job_steps?.length || 0}ステップ)
                      </span>
                      {selectedStepFilter && (
                        <button
                          onClick={() => setSelectedStepFilter(null)}
                          style={{ fontSize: 9, color: 'var(--accent)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                          全工程表示に戻る ✕
                        </button>
                      )}
                    </div>

                    {selectedJob.job_steps && selectedJob.job_steps.length > 0 ? (
                      <table className="data-table" style={{ width: '100%', fontSize: 10 }}>
                        <thead>
                          <tr>
                            <th style={{ width: 30 }}>#</th>
                            <th>工程名</th>
                            <th style={{ width: 65 }}>予定(h)</th>
                            <th style={{ width: 90 }}>担当者</th>
                            <th style={{ width: 65 }}>実績(h)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedJob.job_steps.map((step: any) => {
                            const isStepActive = selectedStepFilter === step.step_id
                            const stepLogs = (selectedJob.work_logs || []).filter((l: any) => l.job_step_id === step.step_id)
                            const stepHours = stepLogs.reduce((sum: number, l: any) => sum + Number(l.hours_spent || 0), 0)

                            return (
                              <tr
                                key={step.step_id || step.step_no}
                                onClick={() => setSelectedStepFilter(isStepActive ? null : step.step_id)}
                                style={{
                                  cursor: 'pointer',
                                  background: isStepActive ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : undefined
                                }}
                              >
                                <td style={{ fontWeight: 700 }}>{step.step_no}</td>
                                <td style={{ fontWeight: 600, color: '#0F172A' }}>
                                  {step.step_name} {isStepActive && <span style={{ fontSize: 8, color: 'var(--accent)' }}>(フィルター中)</span>}
                                </td>
                                <td style={{ fontFamily: 'monospace' }}>{step.estimated_hours ? `${step.estimated_hours}h` : '-'}</td>
                                <td>{step.assigned_to || '-'}</td>
                                <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{stepHours.toFixed(1)}h</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', padding: 6 }}>工程未登録</div>
                    )}
                  </div>

                  {/* WORKLOGS SUMMARY & ADD BUTTON */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} color="var(--accent)" /> 実績作業日報ログ ({displayedLogs.length}件)
                      </span>

                      <button
                        className="btn btn-primary"
                        style={{ fontSize: 9, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
                        onClick={() => handleOpenAddLog()}
                      >
                        <Plus size={10} /> + 作業日報を追加
                      </button>
                    </div>

                    {displayedLogs.length > 0 ? (
                      <table className="data-table" style={{ width: '100%', fontSize: 10 }}>
                        <thead>
                          <tr>
                            <th style={{ width: 75 }}>作業日</th>
                            <th style={{ width: 100 }}>作業者</th>
                            <th style={{ width: 45 }}>工数</th>
                            <th>作業種別・詳細メモ</th>
                            <th style={{ width: 40, textAlign: 'center' }}>操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedLogs.map((log: any) => (
                            <tr key={log.log_id}>
                              <td style={{ fontFamily: 'monospace' }}>{new Date(log.work_date).toLocaleDateString()}</td>
                              <td style={{ fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap' }}>{log.employees?.employee_name || '担当者'}</td>
                              <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{log.hours_spent}h</td>
                              <td>
                                {log.processing_codes?.processing_name && (
                                  <span className="badge badge--neutral" style={{ fontSize: 8, padding: '0 4px', marginRight: 4 }}>
                                    {log.processing_codes.processing_name}
                                  </span>
                                )}
                                <span>{log.description || '-'}</span>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                  <button
                                    onClick={() => handleOpenEditLog(log)}
                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 1, color: 'var(--text-muted)' }}
                                    title="編集"
                                  >
                                    <Edit3 size={11} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLog(log.log_id)}
                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 1, color: '#EF4444' }}
                                    title="削除"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', padding: 12, textAlign: 'center', border: '1px dashed var(--border-default)', borderRadius: 6 }}>
                        作業日報が登録されていません。「+ 作業日報を追加」ボタンから登録できます。
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
                  Jobを選択してください。
                </div>
              )}

            </div>
          )}
        </div>
      </div>

      {/* SUB-MODAL POPUP FOR WORKLOG ENTRY INSIDE DRAWER */}
      {isLogModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setIsLogModalOpen(false)}
        >
          <div
            style={{
              width: 520, maxWidth: '95vw', background: 'var(--bg-surface)', borderRadius: 8,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-default)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '12px 16px', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                <Clock size={16} color="var(--accent)" />
                <span>{editingLogId ? '作業日報を編集' : '新規作業日報を登録'} ({selectedJob?.job_code})</span>
              </div>
              <button
                onClick={() => setIsLogModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveLog} style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 2, display: 'block' }}>
                    作業日 (Date)
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={logForm.work_date}
                    onChange={e => setLogForm({ ...logForm, work_date: e.target.value })}
                    required
                    style={{ fontSize: 11, padding: '4px 8px' }}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 2, display: 'block' }}>
                    作業者 (Worker)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={logForm.worker_name}
                    onChange={e => setLogForm({ ...logForm, worker_name: e.target.value })}
                    required
                    style={{ fontSize: 11, padding: '4px 8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 2, display: 'block' }}>
                    対象工程 (Step)
                  </label>
                  <select
                    className="form-input"
                    value={logForm.job_step_id}
                    onChange={e => setLogForm({ ...logForm, job_step_id: e.target.value })}
                    style={{ fontSize: 11, padding: '4px 8px' }}
                  >
                    <option value="">-- 対象工程を選択 --</option>
                    {selectedJob?.job_steps?.map((step: any) => (
                      <option key={step.step_id} value={step.step_id}>
                        Step {step.step_no}: {step.step_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 2, display: 'block' }}>
                    実績工数 (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    className="form-input"
                    value={logForm.hours_spent}
                    onChange={e => setLogForm({ ...logForm, hours_spent: Number(e.target.value) })}
                    required
                    style={{ fontSize: 11, padding: '4px 8px', fontFamily: 'monospace', fontWeight: 700 }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 2, display: 'block' }}>
                  作業種別 (Processing Code)
                </label>
                <select
                  className="form-input"
                  value={logForm.processing_code_id}
                  onChange={e => setLogForm({ ...logForm, processing_code_id: e.target.value })}
                  style={{ fontSize: 11, padding: '4px 8px' }}
                >
                  <option value="">-- 作業種別を選択 --</option>
                  {processingCodes.map(pc => (
                    <option key={pc.processing_code_id} value={pc.processing_code_id}>
                      {pc.processing_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 2, display: 'block' }}>
                  作業内容・詳細メモ (Description)
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={logForm.description}
                  onChange={e => setLogForm({ ...logForm, description: e.target.value })}
                  placeholder="具体的な作業内容や注意点を入力..."
                  style={{ fontSize: 11, padding: '6px 8px' }}
                />
              </div>

              {/* Modal Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8, borderTop: '1px solid var(--border-default)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ fontSize: 11, padding: '4px 12px' }}
                  onClick={() => setIsLogModalOpen(false)}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSavingLog}
                  style={{ fontSize: 11, padding: '4px 16px', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  {isSavingLog ? <RefreshCw size={12} className="spin" /> : <CheckSquare size={12} />}
                  <span>{editingLogId ? '更新保存' : '登録保存'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
