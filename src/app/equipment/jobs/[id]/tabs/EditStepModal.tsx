'use client'

import { useTranslations } from 'next-intl'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Save, Loader2, ListPlus, Plus, Trash2, Clock } from 'lucide-react'

type StepData = {
  step_id: string
  step_no: number
  step_name: string
  step_status: string | null
  track: string | null
  planned_start: string | null
  planned_end: string | null
  planned_hours: number | null
  actual_hours: number | null
  estimated_hours: number | null
  machining_location: string | null
  machine_id: string | null
  assigned_to: string | null
  deadline: string | null
  notes: string | null
  processing_status_id?: number | null
}

type Props = {
  step: StepData | null // null means creating a new step
  jobId: string
  nextStepNo: number
  onClose: () => void
  onSaved: () => void
}

const STATUS_OPTIONS = [
  { value: 'PENDING', ja: '未着手' },
  { value: 'IN_PROGRESS', ja: '進行中' },
  { value: 'COMPLETED', ja: '完了' },
]

export function EditStepModal({ step, jobId, nextStepNo, onClose, onSaved }: Props) {
  const t = useTranslations()

  const supabase = createClient()
  const isNew = !step

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Reference data
  const [stdProcesses, setStdProcesses] = useState<any[]>([])
  const [machines, setMachines] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [processingCodes, setProcessingCodes] = useState<any[]>([])
  const [processingStatuses, setProcessingStatuses] = useState<any[]>([])

  // Form state - Left Panel
  const [stepNo, setStepNo] = useState(step?.step_no || nextStepNo)
  const [stepName, setStepName] = useState(step?.step_name || '')
  const [track, setTrack] = useState(step?.track || '')
  const [stepStatus, setStepStatus] = useState(step?.step_status || 'PENDING')
  const [processingStatusId, setProcessingStatusId] = useState<string>(step?.processing_status_id?.toString() || '')
  const [plannedStart, setPlannedStart] = useState(step?.planned_start?.slice(0, 10) || '')
  const [plannedEnd, setPlannedEnd] = useState(step?.planned_end?.slice(0, 10) || '')
  const [plannedHours, setPlannedHours] = useState<string>(step?.planned_hours?.toString() || '')
  const [actualHours, setActualHours] = useState<string>(step?.actual_hours?.toString() || '')
  const [estimatedHours, setEstimatedHours] = useState<string>(step?.estimated_hours?.toString() || '')
  const [machiningLocation, setMachiningLocation] = useState(step?.machining_location || '')
  const [machineId, setMachineId] = useState(step?.machine_id || '')
  const [assignedTo, setAssignedTo] = useState(step?.assigned_to || '')
  const [deadline, setDeadline] = useState(step?.deadline?.slice(0, 10) || '')
  const [notes, setNotes] = useState(step?.notes || '')

  // Logs state - Right Panel
  const [logs, setLogs] = useState<any[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)

  // Log Form state
  const [editingLogId, setEditingLogId] = useState<string | null>(null)
  const [logPlannedDate, setLogPlannedDate] = useState('')
  const [logPlannedHours, setLogPlannedHours] = useState('')
  const [logWorkDate, setLogWorkDate] = useState(new Date().toISOString().split('T')[0])
  const [logWorker, setLogWorker] = useState('')
  const [logMachine, setLogMachine] = useState('')
  const [logCode, setLogCode] = useState('')
  const [logHours, setLogHours] = useState('')
  const [logNotes, setLogNotes] = useState('')
  const [logStatusId, setLogStatusId] = useState('')
  const [addingLog, setAddingLog] = useState(false)

  useEffect(() => {
    async function loadRefs() {
      const [
        { data: std }, 
        { data: mac }, 
        { data: emp },
        { data: codes },
        { data: pStatus }
      ] = await Promise.all([
        supabase.from('standard_process_times').select('id, process_name_ja, track, default_hours').eq('is_active', true),
        supabase.from('machines').select('machine_id, machine_name, machine_type').order('machine_name'),
        supabase.from('employees').select('employee_id, employee_name').eq('is_active', true).order('employee_name'),
        supabase.from('processing_codes').select('processing_code_id, processing_name, category').eq('is_active', true).order('category').order('processing_name'),
        supabase.from('processing_statuses').select('status_id, status_code, status_name_vi').order('status_id')
      ])
      if (std) setStdProcesses(std)
      if (mac) setMachines(mac)
      if (emp) setEmployees(emp)
      if (codes) setProcessingCodes(codes)
      if (pStatus) setProcessingStatuses(pStatus)
    }
    loadRefs()
  }, [])

  const fetchLogs = useCallback(async () => {
    if (isNew || !step?.step_id) return
    setLoadingLogs(true)
    const { data, error: err } = await supabase
      .from('work_logs')
      .select(`
        *,
        employees(employee_name),
        processing_codes(processing_name),
        processing_statuses(status_code)
      `)
      .eq('job_step_id', step.step_id)
      .order('work_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (!err && data) setLogs(data)
    setLoadingLogs(false)
  }, [step?.step_id, isNew])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const applyStdProcess = (procId: string) => {
    const p = stdProcesses.find(x => x.id === procId)
    if (p) {
      setStepName(p.process_name_ja)
      setTrack(p.track || '')
      setEstimatedHours(p.default_hours?.toString() || '')
      setPlannedHours('') // DO NOT auto-fill, leave as placeholder
    }
  }

  const handleSaveStep = async () => {
    if (!stepName.trim()) {
      setError('工程名を入力してください / Vui lòng nhập tên công đoạn')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const payload = {
        job_id: jobId,
        step_no: stepNo,
        step_name: stepName,
        step_status: stepStatus,
        processing_status_id: processingStatusId ? parseInt(processingStatusId) : null,
        track: track || null,
        planned_start: plannedStart || null,
        planned_end: plannedEnd || null,
        planned_hours: plannedHours ? parseFloat(plannedHours) : null,
        actual_hours: actualHours ? parseFloat(actualHours) : null,
        estimated_hours: estimatedHours ? parseFloat(estimatedHours) : null,
        machining_location: machiningLocation || null,
        machine_id: machineId || null,
        assigned_to: assignedTo || null,
        deadline: deadline || null,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      }

      if (isNew) {
        const { error: insErr } = await supabase.from('job_steps').insert([payload])
        if (insErr) throw new Error(insErr.message)
      } else {
        const { error: updErr } = await supabase
          .from('job_steps')
          .update(payload)
          .eq('step_id', step.step_id)
        if (updErr) throw new Error(updErr.message)
      }

      // Recalculate overall_progress on the job
      const { data: allSteps } = await supabase.from('job_steps').select('step_status').eq('job_id', jobId)

      if (allSteps && allSteps.length > 0) {
        const completed = allSteps.filter(s => s.step_status === 'COMPLETED').length
        const progress = Math.round((completed / allSteps.length) * 100)
        const inProgress = allSteps.some(s => s.step_status === 'IN_PROGRESS')

        await supabase
          .from('jobs')
          .update({
            overall_progress: progress,
            job_status: progress >= 100 ? 'COMPLETED' : (progress > 0 || inProgress) ? 'IN_PROGRESS' : 'NEW',
            updated_at: new Date().toISOString(),
          })
          .eq('job_id', jobId)
      }

      onSaved()
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLog = async () => {
    if (!logCode && !logNotes) {
      alert('作業内容またはメモを入力してください / Vui lòng nhập nội dung hoặc ghi chú')
      return
    }

    setAddingLog(true)
    try {
      const payload = {
        job_id: jobId,
        job_step_id: step?.step_id,
        planned_date: logPlannedDate || null,
        planned_hours: logPlannedHours ? parseFloat(logPlannedHours) : null,
        work_date: logWorkDate || '',
        hours_spent: logHours ? parseFloat(logHours) : null,
        employee_id: logWorker || '',
        machine_id: logMachine || null,
        processing_code_id: logCode ? parseInt(logCode) : null,
        notes: logNotes || null,
        processing_status_id: logStatusId ? parseInt(logStatusId) : null,
        is_finished: logStatusId ? processingStatuses.find(s => s.status_id === parseInt(logStatusId))?.status_code?.includes('完了') || false : false
      }
      
      let error;
      if (editingLogId) {
        ({ error } = await supabase.from('work_logs').update(payload).eq('log_id', editingLogId))
      } else {
        ({ error } = await supabase.from('work_logs').insert([payload]))
      }
      
      if (error) throw new Error(error.message)
      
      // Calculate total actual hours and update step
      const { data: allLogs } = await supabase.from('work_logs').select('hours_spent').eq('job_step_id', step!.step_id)
      if (allLogs) {
        const total = allLogs.reduce((sum, l) => sum + (l.hours_spent || 0), 0)
        setActualHours(total.toString())
        // Auto update actual hours in DB
        await supabase.from('job_steps').update({ actual_hours: total }).eq('step_id', step!.step_id)
      }

      // Reset form
      setEditingLogId(null)
      setLogCode('')
      setLogHours('')
      setLogNotes('')
      setLogPlannedHours('')
      setLogWorker('')
      setLogMachine('')
      setLogStatusId('')
      
      fetchLogs()
      onSaved() // To trigger parent refresh (Step list actual hours)
    } catch (err: any) {
      alert('エラー / Lỗi: ' + err.message)
    } finally {
      setAddingLog(false)
    }
  }

  const handleEditLog = (log: any) => {
    setEditingLogId(log.log_id)
    setLogPlannedDate(log.planned_date || '')
    setLogPlannedHours(log.planned_hours?.toString() || '')
    setLogWorkDate(log.work_date || '')
    setLogWorker(log.employee_id || '')
    setLogMachine(log.machine_id || '')
    setLogCode(log.processing_code_id?.toString() || '')
    setLogHours(log.hours_spent?.toString() || '')
    setLogNotes(log.notes || '')
    setLogStatusId(log.processing_status_id?.toString() || '')
  }

  const handleCancelEditLog = () => {
    setEditingLogId(null)
    setLogCode('')
    setLogHours('')
    setLogNotes('')
    setLogPlannedHours('')
    setLogWorker('')
    setLogMachine('')
    setLogStatusId('')
  }

  const handleDeleteLog = async (logId: string) => {
    if (!window.confirm('このログを削除しますか？ / Bạn có chắc muốn xoá nhật ký này?')) return
    
    const { error } = await supabase.from('work_logs').delete().eq('log_id', logId)
    if (error) {
      alert('エラー / Lỗi: ' + error.message)
    } else {
      fetchLogs()
      onSaved()
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} />

      <div className="card" style={{
        position: 'relative', 
        width: isNew ? 640 : 1100, // Expand if not new to show split pane
        maxWidth: '95vw',
        height: '90vh', 
        display: 'flex', flexDirection: 'column',
        padding: 0, zIndex: 1,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border-default)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge" style={{ backgroundColor: 'var(--bg-surface-3)', color: 'var(--text-primary)' }}>
                #{stepNo}
              </span>
              <span style={{ fontWeight: 700, fontSize: 16 }}>
                {isNew ? '新規工程 / Thêm công đoạn' : '工程詳細 / Chi tiết công đoạn'}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body - Split Pane */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* Left Panel - Step Edit */}
          <div style={{ 
            flex: isNew ? 1 : '0 0 50%', 
            padding: 20, 
            overflowY: 'auto',
            borderRight: isNew ? 'none' : '1px solid var(--border-default)',
            display: 'flex', flexDirection: 'column', gap: 16
          }}>
            <h3 style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
              {t('Equipment.thongTinCongOan')}
            </h3>

            {error && (
              <div style={{ padding: '8px 12px', background: 'var(--status-error)', color: '#fff', borderRadius: 'var(--radius-sm)', fontSize: 12 }}>
                {error}
              </div>
            )}

            {isNew && (
              <div style={{ background: 'var(--bg-surface-2)', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)' }}>
                  <ListPlus size={14} />
                  {t('Equipment.chonTuQuyTrinhChuan')}
                </label>
                <select className="form-input" onChange={e => applyStdProcess(e.target.value)} defaultValue="">
                  <option value="">-- 手動で入力 / Nhập thủ công --</option>
                  {stdProcesses.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.track}] {p.process_name_ja} ({p.default_hours}h)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-grid-2">
              <div>
                <label className="form-label">
                  {t('Equipment.tenCongOan')}
                </label>
                <input className="form-input" value={stepName} onChange={e => setStepName(e.target.value)} />
              </div>
              <div>
                <label className="form-label">
                  {t('Equipment.track')}
                </label>
                <input className="form-input" value={track} onChange={e => setTrack(e.target.value)} placeholder="例: MOLD, PLUG, FINISH" />
              </div>
            </div>

            <div className="form-grid-2">
              <div>
                <label className="form-label">
                  {t('Equipment.trangThai')}
                </label>
                <select className="form-input" value={processingStatusId} onChange={e => setProcessingStatusId(e.target.value)}>
                  <option value="">-- 自動算出 / Tự động --</option>
                  {processingStatuses.map(opt => (
                    <option key={opt.status_id} value={opt.status_id}>
                      {opt.status_code}{opt.status_name_vi ? ` / ${opt.status_name_vi}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">
                  {t('Equipment.thuTu')}
                </label>
                <input type="number" className="form-input" value={stepNo} onChange={e => setStepNo(parseInt(e.target.value) || 1)} />
              </div>
            </div>

            <div className="form-grid-2">
              <div>
                <label className="form-label">
                  {t('Equipment.batAuDuKien')}
                </label>
                <input type="date" className="form-input" value={plannedStart} onChange={e => setPlannedStart(e.target.value)} />
              </div>
              <div>
                <label className="form-label">
                  {t('Equipment.ketThucDuKien')}
                </label>
                <input type="date" className="form-input" value={plannedEnd} onChange={e => setPlannedEnd(e.target.value)} />
              </div>
            </div>

            <div className="form-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div>
                <label className="form-label">
                  {t('Equipment.gioDuKien')}
                </label>
                <input 
                  type="number" 
                  step="0.5" 
                  min="0" 
                  className="form-input" 
                  value={plannedHours} 
                  onChange={e => setPlannedHours(e.target.value)} 
                  placeholder={estimatedHours || ''}
                  onFocus={e => {
                    if (!plannedHours && estimatedHours) {
                      setPlannedHours(estimatedHours);
                      setTimeout(() => e.target.select(), 0);
                    }
                  }}
                />
              </div>
              <div>
                <label className="form-label">
                  {t('Equipment.gioThucTe')}
                </label>
                <input type="number" step="0.5" min="0" className="form-input" value={actualHours} onChange={e => setActualHours(e.target.value)} />
              </div>
              <div>
                <label className="form-label">
                  {t('Equipment.hanChot')}
                </label>
                <input type="date" className="form-input" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>
            </div>


            <div>
              <label className="form-label">
                {t('Equipment.ghiChu')}
              </label>
              <textarea className="form-textarea" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="メモ・注意事項..." />
            </div>

            {/* Footer for Left Panel */}
            <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <div>
                {!isNew && (
                  <button 
                    className="btn btn-secondary hover-danger" 
                    style={{ padding: '0 8px', height: 32 }}
                    onClick={async () => {
                      if (window.confirm('この工程を削除しますか？ / Bạn có chắc chắn muốn xóa công đoạn này?')) {
                        setSaving(true)
                        const { error } = await supabase.from('job_steps').delete().eq('step_id', step!.step_id)
                        setSaving(false)
                        if (!error) onSaved()
                        else alert(error.message)
                      }
                    }} 
                    disabled={saving}
                    title="削除 / Xóa"
                  >
                    <Trash2 size={14} style={{ color: 'var(--status-error)' }} />
                  </button>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" onClick={onClose} disabled={saving}>
                  {t('Equipment.luu')}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Worklogs (Only show if editing an existing step) */}
          {!isNew && (
            <div style={{ flex: '0 0 50%', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface-2)' }}>
              
              {/* Form Add/Edit Log */}
              <div style={{ padding: 20, borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
                    {editingLogId ? t('Common.edit') : t('Common.addNew')}
                  </h3>
                  {editingLogId && (
                    <button className="btn-icon" onClick={handleCancelEditLog} title="キャンセル / Hủy">
                      <X size={16} />
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  {/* Row 1: Planned Date & Planned Hours */}
                  <div>
                    <label className="form-label">予定日 / Ngày dự kiến</label>
                    <input type="date" className="form-input form-input-sm" value={logPlannedDate} onChange={e => setLogPlannedDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">予定時間(h) / Giờ dự kiến</label>
                    <input type="number" step="0.1" min="0" className="form-input form-input-sm" value={logPlannedHours} onChange={e => setLogPlannedHours(e.target.value)} />
                  </div>
                  
                  {/* Row 2: Actual Date & Actual Hours */}
                  <div>
                    <label className="form-label">実施日 / Ngày thực tế</label>
                    <input type="date" className="form-input form-input-sm" value={logWorkDate} onChange={e => setLogWorkDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">実績時間(h) / Giờ thực tế</label>
                    <input type="number" step="0.1" min="0" className="form-input form-input-sm" value={logHours} onChange={e => setLogHours(e.target.value)} />
                  </div>

                  {/* Row 3: Worker & Machine */}
                  <div>
                    <label className="form-label">作業者 / Người làm</label>
                    <select className="form-input form-input-sm" value={logWorker} onChange={e => setLogWorker(e.target.value)}>
                      <option value="">-- 選択 / Chọn --</option>
                      {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">機械 / Máy móc</label>
                    <select className="form-input form-input-sm" value={logMachine} onChange={e => setLogMachine(e.target.value)}>
                      <option value="">-- 選択 / Chọn --</option>
                      {machines.map(m => <option key={m.machine_id} value={m.machine_id}>[{m.machine_type}] {m.machine_name}</option>)}
                    </select>
                  </div>

                  {/* Row 4: Processing Code */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">作業内容 / Nội dung thao tác *</label>
                    <select className="form-input form-input-sm" value={logCode} onChange={e => setLogCode(e.target.value)}>
                      <option value="">-- 手動入力 / Không chọn --</option>
                      {processingCodes.map(c => (
                        <option key={c.processing_code_id} value={c.processing_code_id}>
                          {c.category ? `[${c.category}] ` : ''}{c.processing_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">メモ / Ghi chú</label>
                    <input type="text" className="form-input form-input-sm" value={logNotes} onChange={e => setLogNotes(e.target.value)} placeholder="備考..." />
                  </div>
                  {/* Row 5: Status */}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">状態 / Trạng thái</label>
                    <select className="form-input form-input-sm" value={logStatusId} onChange={e => setLogStatusId(e.target.value)}>
                      <option value="">-- 選択 / Chọn --</option>
                      {processingStatuses.map(s => (
                        <option key={s.status_id} value={s.status_id}>
                          {s.status_code}{s.status_name_vi ? ` / ${s.status_name_vi}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  {editingLogId && (
                    <button type="button" className="btn btn-secondary text-xs" onClick={handleCancelEditLog}>
                      {t('Common.cancel')}
                    </button>
                  )}
                  <button 
                    type="button" 
                    className="btn btn-primary text-xs" 
                    onClick={handleSaveLog} 
                    disabled={addingLog}
                  >
                    {addingLog ? '...' : (editingLogId ? t('Common.save') : t('Common.addNew'))}
                  </button>
                </div>
              </div>

              {/* Log History */}
              <div style={{ flex: 1, padding: 20, overflowY: 'auto' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  {t('Equipment.lichSuKeHoach')}
                </h3>

                {loadingLogs ? (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)' }}>
                    <Loader2 size={16} className="animate-spin" style={{ margin: '0 auto' }} />
                  </div>
                ) : logs.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, background: 'var(--bg-surface)', borderRadius: 6 }}>
                    記録がありません / Chưa có nhật ký nào
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {logs.map(log => (
                      <div 
                        key={log.log_id} 
                        className={`card-flat ${editingLogId === log.log_id ? 'border-primary' : ''}`} 
                        style={{ 
                          padding: 12, 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          justifyContent: 'space-between', 
                          gap: 12,
                          cursor: 'pointer',
                          borderWidth: editingLogId === log.log_id ? 2 : 1,
                          borderColor: editingLogId === log.log_id ? 'var(--accent)' : 'var(--border-default)'
                        }}
                        onClick={() => handleEditLog(log)}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            {log.planned_date && (
                              <span className="badge badge--warning" style={{ fontSize: 11, padding: '2px 6px' }}>
                                予: {new Date(log.planned_date).toLocaleDateString('ja-JP')} ({log.planned_hours || 0}h)
                              </span>
                            )}
                            {log.work_date && (
                              <span className="badge badge--success" style={{ fontSize: 11, padding: '2px 6px' }}>
                                実: {new Date(log.work_date).toLocaleDateString('ja-JP')} ({log.hours_spent || 0}h)
                              </span>
                            )}
                            <span style={{ fontWeight: 600, fontSize: 12 }}>
                              {log.employees?.employee_name || '—'}
                            </span>
                            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                              {log.machines?.machine_name || '—'}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                            {log.processing_codes?.processing_name || '—'}
                          </div>
                          {log.notes && (
                            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                              {log.notes}
                            </div>
                          )}
                        </div>
                        <button 
                          className="btn-icon hover-danger"
                          style={{ padding: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLog(log.log_id);
                          }}
                          title="削除 / Xoá"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
