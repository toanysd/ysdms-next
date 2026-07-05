'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Save, Loader2, Calendar } from 'lucide-react'
import { SearchableSelect } from '@/components/ui/SearchableSelect'

type WorklogModalProps = {
  jobId: string
  jobSteps: any[] // to select which step this log belongs to
  initialData?: any | null
  onClose: () => void
  onSuccess: () => void
}

export function WorklogModal({ jobId, jobSteps, initialData, onClose, onSuccess }: WorklogModalProps) {
  const supabase = createClient()
  const isEdit = !!initialData

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Master data
  const [employees, setEmployees] = useState<{ value: string; label: string }[]>([])
  const [processingCodes, setProcessingCodes] = useState<{ id: number; name: string; category: string }[]>([])

  // Form State
  const [workDate, setWorkDate] = useState<string>(
    initialData?.work_date || new Date().toISOString().split('T')[0]
  )
  const [employeeId, setEmployeeId] = useState<string>(initialData?.employee_id || '')
  const [stepId, setStepId] = useState<string>(initialData?.job_step_id || '')
  const [processingCodeId, setProcessingCodeId] = useState<number | ''>(
    initialData?.processing_code_id || ''
  )
  const [hoursSpent, setHoursSpent] = useState<string>(
    initialData?.hours_spent?.toString() || ''
  )
  const [plannedHours, setPlannedHours] = useState<string>(
    initialData?.planned_hours?.toString() || ''
  )
  const [plannedDate, setPlannedDate] = useState<string>(
    initialData?.planned_date || ''
  )
  const [notes, setNotes] = useState<string>(initialData?.notes || '')
  
  // Custom description if they don't want to use processing_code_id or want to add details
  const [description, setDescription] = useState<string>(initialData?.description || '')

  useEffect(() => {
    async function fetchMasterData() {
      // 1. Employees
      const { data: empData } = await supabase
        .from('employees')
        .select('employee_id, employee_name')
        .eq('is_active', true)
        .order('employee_name')
      
      if (empData) {
        setEmployees(empData.map(e => ({
          value: e.employee_id,
          label: e.employee_name
        })))
      }

      // 2. Processing Codes
      const { data: codeData } = await supabase
        .from('processing_codes')
        .select('processing_code_id, processing_name, category')
        .eq('is_active', true)
        .order('sort_note', { ascending: true })
      
      if (codeData) {
        setProcessingCodes(codeData.map(c => ({
          id: c.processing_code_id,
          name: c.processing_name,
          category: c.category || 'OTHER'
        })))
      }
    }
    fetchMasterData()
  }, [supabase])

  // Automatically update description when processing code changes (if description is empty or matches previous)
  const handleCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setProcessingCodeId(val ? Number(val) : '')
    
    if (val) {
      const code = processingCodes.find(c => c.id === Number(val))
      if (code && (!description || description === '')) {
        setDescription(code.name)
      }
    }
  }

  const handleSave = async () => {
    setError(null)
    if (!employeeId) {
      setError('作業者を選択してください / Vui lòng chọn người thực hiện')
      return
    }
    if (!workDate) {
      setError('作業日を入力してください / Vui lòng nhập ngày')
      return
    }

    setLoading(true)

    const payload: any = {
      job_id: jobId,
      job_step_id: stepId || null,
      employee_id: employeeId,
      work_date: workDate,
      processing_code_id: processingCodeId || null,
      description: description || null,
      hours_spent: hoursSpent ? parseFloat(hoursSpent) : null,
      planned_hours: plannedHours ? parseFloat(plannedHours) : null,
      planned_date: plannedDate || null,
      notes: notes || null,
    }

    if (isEdit && initialData.log_id) {
      const { error: err } = await supabase
        .from('work_logs')
        .update(payload)
        .eq('log_id', initialData.log_id)
      
      if (err) setError(err.message)
      else onSuccess()
    } else {
      const { error: err } = await supabase
        .from('work_logs')
        .insert([payload])
      
      if (err) setError(err.message)
      else onSuccess()
    }
    setLoading(false)
  }

  // Generate options for Processing Codes grouping by Category
  const renderCodeOptions = () => {
    const categories = Array.from(new Set(processingCodes.map(c => c.category)))
    return categories.map(cat => (
      <optgroup key={cat} label={cat}>
        {processingCodes.filter(c => c.category === cat).map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </optgroup>
    ))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="card-flat"
        style={{ width: '100%', maxWidth: 500, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
              {isEdit ? 'ログ編集' : '新規ログ作成'}
            </h2>
            <div className="text-[11px] text-[var(--text-muted)]">
              {isEdit ? 'Chỉnh sửa nhật ký' : 'Tạo nhật ký công việc mới'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded"
            style={{ width: 32, height: 32, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="custom-scrollbar" style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          {error && (
            <div style={{ padding: '8px 12px', background: 'color-mix(in srgb, var(--status-error) 10%, transparent)', color: 'var(--status-error)', fontSize: 12, borderRadius: 4, marginBottom: 16 }}>
              ⚠ {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="form-grid-2">
              {/* Work Date */}
              <div>
                <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  作業日 <span className="text-[10px] font-normal text-[var(--text-muted)] ml-1">Ngày làm</span>
                  <span className="text-[var(--status-error)] ml-1">*</span>
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="date"
                    className="form-input w-full pl-8"
                    value={workDate}
                    onChange={e => setWorkDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Hours */}
              <div>
                <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  実績時間 <span className="text-[10px] font-normal text-[var(--text-muted)] ml-1">Số giờ thực tế</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="2.5"
                    className="form-input w-full"
                    value={hoursSpent}
                    onChange={e => setHoursSpent(e.target.value)}
                  />
                  <span className="text-[12px] text-[var(--text-muted)] font-mono">H</span>
                </div>
              </div>
            </div>

            <div className="form-grid-2">
              {/* Planned Date */}
              <div>
                <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  予定日 <span className="text-[10px] font-normal text-[var(--text-muted)] ml-1">Ngày dự kiến (Tuỳ chọn)</span>
                </label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="date"
                    className="form-input w-full pl-8"
                    value={plannedDate}
                    onChange={e => setPlannedDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Planned Hours */}
              <div>
                <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                  予定時間 <span className="text-[10px] font-normal text-[var(--text-muted)] ml-1">Giờ dự kiến (Tuỳ chọn)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    placeholder="2.5"
                    className="form-input w-full"
                    value={plannedHours}
                    onChange={e => setPlannedHours(e.target.value)}
                  />
                  <span className="text-[12px] text-[var(--text-muted)] font-mono">H</span>
                </div>
              </div>
            </div>

            {/* Employee */}
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                作業者 <span className="text-[10px] font-normal text-[var(--text-muted)] ml-1">Người thực hiện</span>
                <span className="text-[var(--status-error)] ml-1">*</span>
              </label>
              <SearchableSelect
                options={employees}
                value={employeeId}
                onChange={val => setEmployeeId(val || '')}
              />
            </div>

            {/* Step */}
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                工程 <span className="text-[10px] font-normal text-[var(--text-muted)] ml-1">Công đoạn (Tuỳ chọn)</span>
              </label>
              <select
                className="form-input w-full"
                value={stepId}
                onChange={e => setStepId(e.target.value)}
              >
                <option value="">-- 工程なし (Không thuộc công đoạn nào) --</option>
                {jobSteps.map(s => (
                  <option key={s.step_id} value={s.step_id}>
                    {s.step_no != null ? `${s.step_no}. ` : ''}{s.step_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Processing Code */}
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                作業内容 (マスタ) <span className="text-[10px] font-normal text-[var(--text-muted)] ml-1">Mã thao tác chuẩn</span>
              </label>
              <select
                className="form-input w-full"
                value={processingCodeId}
                onChange={handleCodeChange}
              >
                <option value="">-- 指定なし (Không chọn) --</option>
                {renderCodeOptions()}
              </select>
            </div>

            {/* Custom Description */}
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                作業詳細 <span className="text-[10px] font-normal text-[var(--text-muted)] ml-1">Chi tiết thao tác</span>
              </label>
              <input
                type="text"
                className="form-input w-full"
                placeholder="VD: Bản nháp, xử lý thô..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ fontFamily: 'var(--font-jp)' }}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
                備考 <span className="text-[10px] font-normal text-[var(--text-muted)] ml-1">Ghi chú thêm</span>
              </label>
              <textarea
                className="form-textarea w-full"
                placeholder="Ghi chú thêm nếu cần..."
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: 8, background: 'var(--bg-surface-1)' }}>
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            キャンセル
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span style={{ fontFamily: 'var(--font-jp)' }}>保存</span>
          </button>
        </div>
      </div>
    </div>
  )
}
