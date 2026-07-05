'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Plus, Clock, Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface WorklogEditModalProps {
  jobId: string
  step: any
  worklog: any // if null, it's a new worklog
  onClose: () => void
  onSaved: () => void
}

export function WorklogEditModal({ jobId, step, worklog, onClose, onSaved }: WorklogEditModalProps) {
  const supabase = createClient()
  const router = useRouter()

  const [employees, setEmployees] = useState<any[]>([])
  const [machines, setMachines] = useState<any[]>([])
  const [processingCodes, setProcessingCodes] = useState<any[]>([])
  const [processingStatuses, setProcessingStatuses] = useState<any[]>([])

  const [logPlannedDate, setLogPlannedDate] = useState(worklog?.planned_date || '')
  const [logPlannedHours, setLogPlannedHours] = useState(worklog?.planned_hours?.toString() || '')
  const [logWorkDate, setLogWorkDate] = useState(worklog?.work_date || new Date().toISOString().split('T')[0])
  const [logWorker, setLogWorker] = useState(worklog?.employee_id || '')
  const [logMachine, setLogMachine] = useState(worklog?.machine_id || '')
  const [logCode, setLogCode] = useState(worklog?.processing_code_id?.toString() || '')
  const [logHours, setLogHours] = useState(worklog?.hours_spent?.toString() || '')
  const [logNotes, setLogNotes] = useState(worklog?.notes || '')
  const [logStatusId, setLogStatusId] = useState<string>(worklog?.processing_status_id?.toString() || '')
  const [logFinished, setLogFinished] = useState(worklog?.is_finished || false)
  
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadRefs() {
      const [
        { data: mac }, 
        { data: emp },
        { data: codes },
        { data: pStatus }
      ] = await Promise.all([
        supabase.from('machines').select('machine_id, machine_name, machine_type').order('machine_name'),
        supabase.from('employees').select('employee_id, employee_name').eq('is_active', true).order('employee_name'),
        supabase.from('processing_codes').select('processing_code_id, processing_name, category').eq('is_active', true).order('category').order('processing_name'),
        supabase.from('processing_statuses').select('status_id, status_code, status_name_vi').order('status_id')
      ])
      if (mac) setMachines(mac)
      if (emp) setEmployees(emp)
      if (codes) setProcessingCodes(codes)
      if (pStatus) setProcessingStatuses(pStatus)
    }
    loadRefs()
  }, [])

  const handleSaveLog = async () => {
    if (!logCode && !logNotes) {
      alert('作業内容またはメモを入力してください / Vui lòng nhập nội dung hoặc ghi chú')
      return
    }

    setSaving(true)
    try {
      const payload = {
        job_id: jobId,
        job_step_id: step.step_id,
        planned_date: logPlannedDate || null,
        planned_hours: logPlannedHours ? parseFloat(logPlannedHours) : null,
        work_date: logWorkDate || null,
        hours_spent: logHours ? parseFloat(logHours) : null,
        employee_id: logWorker || null,
        machine_id: logMachine || null,
        processing_code_id: logCode ? parseInt(logCode) : null,
        notes: logNotes || null,
        processing_status_id: logStatusId ? parseInt(logStatusId) : null,
        is_finished: logStatusId ? processingStatuses.find(s => s.status_id === parseInt(logStatusId))?.status_code?.includes('完了') || false : logFinished
      }
      
      let error;
      if (worklog?.log_id) {
        ({ error } = await supabase.from('work_logs').update(payload).eq('log_id', worklog.log_id))
      } else {
        ({ error } = await supabase.from('work_logs').insert([payload]))
      }
      
      if (error) throw new Error(error.message)
      
      // Calculate total actual hours and update step
      const { data: allLogs } = await supabase.from('work_logs').select('hours_spent').eq('job_step_id', step.step_id)
      if (allLogs) {
        const total = allLogs.reduce((sum, l) => sum + (l.hours_spent || 0), 0)
        await supabase.from('job_steps').update({ actual_hours: total }).eq('step_id', step.step_id)
      }
      
      onSaved()
      onClose()
    } catch (err: any) {
      alert('エラー / Lỗi: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteLog = async () => {
    if (!worklog?.log_id) return;
    if (!window.confirm('このログを削除しますか？ / Bạn có chắc muốn xoá nhật ký này?')) return
    
    const { error } = await supabase.from('work_logs').delete().eq('log_id', worklog.log_id)
    if (error) {
      alert('エラー / Lỗi: ' + error.message)
    } else {
      onSaved()
      onClose()
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 999999,
      padding: 20
    }}>
      <div className="card-flat" style={{
        width: '100%', maxWidth: 500,
        backgroundColor: 'var(--bg-surface)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '90vh',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface-2)'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              <span className="ja">{worklog ? '作業記録の編集' : '作業記録の追加'}</span>
              <span className="vi" style={{ marginLeft: 8, fontSize: 14, color: 'var(--text-muted)' }}>
                {worklog ? 'Sửa nhật ký (Cấp 3)' : 'Thêm nhật ký (Cấp 3)'}
              </span>
            </h2>
            <div style={{ fontSize: 13, color: 'var(--accent)', marginTop: 4 }}>
              {step.step_name}{worklog?.processing_name ? ` — ${worklog.processing_name}` : ''}
            </div>
          </div>
          <button className="btn-icon hover-danger" onClick={onClose} title="閉じる / Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 20, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Row 1: Planned Date & Planned Hours */}
            <div>
              <label className="form-label">予定日 / Ngày dự kiến</label>
              <input type="date" className="form-input" value={logPlannedDate} onChange={e => setLogPlannedDate(e.target.value)} />
            </div>
            <div>
              <label className="form-label">予定時間(h) / Giờ dự kiến</label>
              <input type="number" step="0.1" min="0" className="form-input" value={logPlannedHours} onChange={e => setLogPlannedHours(e.target.value)} />
            </div>
            
            {/* Row 2: Actual Date & Actual Hours */}
            <div>
              <label className="form-label">実施日 / Ngày thực tế</label>
              <input type="date" className="form-input" value={logWorkDate} onChange={e => setLogWorkDate(e.target.value)} />
            </div>
            <div>
              <label className="form-label">実績時間(h) / Giờ thực tế</label>
              <input type="number" step="0.1" min="0" className="form-input" value={logHours} onChange={e => setLogHours(e.target.value)} />
            </div>

            {/* Row 3: Worker & Machine */}
            <div>
              <label className="form-label">作業者 / Người làm</label>
              <select className="form-input" value={logWorker} onChange={e => setLogWorker(e.target.value)}>
                <option value="">-- 選択 / Chọn --</option>
                {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">機械 / Máy móc</label>
              <select className="form-input" value={logMachine} onChange={e => setLogMachine(e.target.value)}>
                <option value="">-- 選択 / Chọn --</option>
                {machines.map(m => <option key={m.machine_id} value={m.machine_id}>[{m.machine_type}] {m.machine_name}</option>)}
              </select>
            </div>

            {/* Row 4: Processing Code */}
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label">作業内容 / Nội dung thao tác *</label>
              <select className="form-input" value={logCode} onChange={e => setLogCode(e.target.value)}>
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
              <input type="text" className="form-input" value={logNotes} onChange={e => setLogNotes(e.target.value)} placeholder="備考..." />
            </div>
            {/* Row 5: Status */}
            <div style={{ gridColumn: 'span 2' }}>
              <label className="form-label">状態 / Trạng thái *</label>
              <select className="form-input" value={logStatusId} onChange={e => {
                setLogStatusId(e.target.value)
                // Auto-set is_finished when selecting F.完了
                const selected = processingStatuses.find(s => s.status_id === parseInt(e.target.value))
                if (selected?.status_code?.includes('完了')) {
                  setLogFinished(true)
                } else if (e.target.value) {
                  setLogFinished(false)
                }
              }}>
                <option value="">-- 選択 / Chọn --</option>
                {processingStatuses.map(s => (
                  <option key={s.status_id} value={s.status_id}>
                    {s.status_code}{s.status_name_vi ? ` / ${s.status_name_vi}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface-2)'
        }}>
          <div>
            {worklog?.log_id && (
              <button 
                className="btn btn-secondary hover-danger" 
                onClick={handleDeleteLog}
                disabled={saving}
              >
                <Trash2 size={14} style={{ color: 'var(--status-error)' }} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onClose} disabled={saving}>
              <span className="ja">キャンセル</span>
            </button>
            <button className="btn btn-primary" onClick={handleSaveLog} disabled={saving}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span className="ja">保存</span>
              <span className="vi">Lưu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
