'use client'

import React, { useState, useEffect } from 'react'
import { Clock, Save, X, User, Calendar, CheckSquare, Layers } from 'lucide-react'

export interface WorklogModalData {
  log_id?: string
  work_date: string
  employee_id: string
  job_step_id: string
  hours_spent: number | string
  processing_code_id?: number | null
  is_finished?: boolean
  notes?: string
}

interface WorklogEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: WorklogModalData) => Promise<void> | void
  initialData?: WorklogModalData | null
  employees: { employee_id: string; employee_name: string }[]
  steps: { step_id?: string; step_no: number; step_name: string; type_code?: string | null }[]
  processingCodes?: { processing_code_id: number; processing_name: string; category?: string }[]
  selectedStepNo?: number | null
}

export function WorklogEditModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  employees,
  steps,
  processingCodes = [],
  selectedStepNo
}: WorklogEditModalProps) {
  const [workDate, setWorkDate] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [jobStepId, setJobStepId] = useState('')
  const [hoursSpent, setHoursSpent] = useState<number | string>('')
  const [processingCodeId, setProcessingCodeId] = useState<string>('')
  const [isFinished, setIsFinished] = useState(false)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setError('')
      setSubmitting(false)
      if (initialData) {
        setWorkDate(initialData.work_date ? initialData.work_date.substring(0, 10) : new Date().toISOString().substring(0, 10))
        setEmployeeId(initialData.employee_id || '')
        setJobStepId(initialData.job_step_id || '')
        setHoursSpent(initialData.hours_spent ?? '')
        setProcessingCodeId(initialData.processing_code_id ? String(initialData.processing_code_id) : '')
        setIsFinished(!!initialData.is_finished)
        setNotes(initialData.notes || '')
      } else {
        // Defaults for new entry
        setWorkDate(new Date().toISOString().substring(0, 10))
        setEmployeeId(employees[0]?.employee_id || '')
        
        // Default step matching selectedStepNo if available, or first step
        const targetStep = selectedStepNo != null
          ? steps.find(s => s.step_no === selectedStepNo)
          : steps[0]
        setJobStepId(targetStep?.step_id || (targetStep ? String(targetStep.step_no) : ''))
        setHoursSpent('')
        setProcessingCodeId('')
        setIsFinished(false)
        setNotes('')
      }
    }
  }, [isOpen, initialData, employees, steps, selectedStepNo])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!workDate) {
      setError('Vui lòng chọn ngày làm việc / 作業日を選択してください。')
      return
    }
    if (!employeeId) {
      setError('Vui lòng chọn nhân viên / 担当者を選択してください。')
      return
    }
    if (!jobStepId) {
      setError('Vui lòng chọn công đoạn / 工程を選択してください。')
      return
    }
    const numHours = Number(hoursSpent)
    if (isNaN(numHours) || numHours <= 0) {
      setError('Số giờ làm phải lớn hơn 0 / 作業時間は0より大きい値を入力してください。')
      return
    }

    try {
      setSubmitting(true)
      await onSave({
        log_id: initialData?.log_id,
        work_date: workDate,
        employee_id: employeeId,
        job_step_id: jobStepId,
        hours_spent: numHours,
        processing_code_id: processingCodeId ? parseInt(processingCodeId, 10) : null,
        is_finished: isFinished,
        notes: notes.trim()
      })
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi lưu nhật ký.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(2px)',
        padding: 16
      }}
    >
      <div
        className="card-flat"
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 10,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} style={{ color: 'var(--accent)' }} />
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              {initialData ? 'Cập nhật Nhật ký Gia công / 作業日報編集' : 'Thêm Nhật ký Gia công Mới / 作業日報新規登録'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
            {error && (
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: 'color-mix(in srgb, var(--status-error) 15%, transparent)',
                  border: '1px solid var(--status-error)',
                  color: 'var(--status-error)',
                  fontSize: 11
                }}
              >
                {error}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Work Date */}
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <Calendar size={13} style={{ color: 'var(--accent)' }} />
                  <span>Ngày làm việc / 作業日 <span style={{ color: 'red' }}>*</span></span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={workDate}
                  onChange={e => setWorkDate(e.target.value)}
                  required
                />
              </div>

              {/* Employee */}
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <User size={13} style={{ color: 'var(--accent)' }} />
                  <span>Người thực hiện / 担当者 <span style={{ color: 'red' }}>*</span></span>
                </label>
                <select
                  className="form-input"
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  required
                >
                  <option value="">— Chọn nhân viên —</option>
                  {employees.map(emp => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.employee_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Job Step / Component */}
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <Layers size={13} style={{ color: 'var(--accent)' }} />
                  <span>Công đoạn / Component <span style={{ color: 'red' }}>*</span></span>
                </label>
                <select
                  className="form-input"
                  value={jobStepId}
                  onChange={e => setJobStepId(e.target.value)}
                  required
                >
                  <option value="">— Chọn công đoạn —</option>
                  {steps.map((st, idx) => (
                    <option key={st.step_id || idx} value={st.step_id || String(st.step_no)}>
                      STT {st.step_no}: {st.step_name} {st.type_code ? `[${st.type_code}]` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hours Spent */}
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                  <Clock size={13} style={{ color: 'var(--accent)' }} />
                  <span>Số giờ làm (H) / 実績時間 <span style={{ color: 'red' }}>*</span></span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="form-input"
                  value={hoursSpent}
                  onChange={e => setHoursSpent(e.target.value)}
                  placeholder="Ví dụ: 2.5"
                  required
                />
              </div>
            </div>

            {/* Optional Processing Code */}
            {processingCodes.length > 0 && (
              <div>
                <label className="form-label" style={{ marginBottom: 4 }}>
                  Mã thao tác chi tiết / 詳細加工コード (Tuỳ chọn):
                </label>
                <select
                  className="form-input"
                  value={processingCodeId}
                  onChange={e => setProcessingCodeId(e.target.value)}
                >
                  <option value="">— Không chọn (Dùng tên công đoạn) —</option>
                  {processingCodes.map(pc => (
                    <option key={pc.processing_code_id} value={pc.processing_code_id}>
                      {pc.processing_name} ({pc.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Notes / Description */}
            <div>
              <label className="form-label" style={{ marginBottom: 4 }}>
                Ghi chú / Nội dung công việc (作業内容・メモ):
              </label>
              <textarea
                className="form-textarea"
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Nhập ghi chú chi tiết hoặc tình trạng công việc..."
                style={{ fontSize: 11 }}
              />
            </div>

            {/* Is Finished Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <input
                type="checkbox"
                id="modal_is_finished"
                checked={isFinished}
                onChange={e => setIsFinished(e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--accent)' }}
              />
              <label htmlFor="modal_is_finished" style={{ cursor: 'pointer', fontWeight: 600, fontSize: 12, color: isFinished ? 'var(--status-success)' : 'var(--text-primary)' }}>
                Công đoạn đã hoàn thành (完了)
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
              padding: '12px 16px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-2)'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={submitting}
              style={{ height: 30, padding: '0 14px', fontSize: 11 }}
            >
              Hủy / キャンセル
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{
                height: 30,
                padding: '0 16px',
                fontSize: 11,
                gap: 6,
                background: 'var(--accent)',
                color: '#fff',
                fontWeight: 700
              }}
            >
              <Save size={14} />
              <span>{submitting ? 'Đang lưu...' : 'Lưu Nhật ký / 保存'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
