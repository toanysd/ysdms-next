'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, Calendar, X, Plus } from 'lucide-react'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { createQuickJob } from '@/app/actions/mold-job'

// ── Types ────────────────────────────────────────────────────────────────────
export type WorklogFormSharedProps = {
  /** Nếu truyền vào → lock job, chỉ hiện steps của job này */
  defaultJobId?: string
  /** Steps đã load sẵn từ ngoài (dùng khi defaultJobId cố định) */
  preloadedSteps?: JobStepOption[]
  /** Data ban đầu khi edit */
  initialData?: WorklogInitialData | null
  /** Chế độ hiển thị */
  mode: 'page' | 'modal'
  onSuccess: (redirectPath?: string) => void
  onCancel: () => void
}

export type WorklogInitialData = {
  log_id?: string
  work_date?: string
  employee_id?: string
  job_id?: string
  job_step_id?: string | null
  hours_spent?: number | null
  is_finished?: boolean
  description?: string | null
  notes?: string | null
}

type Employee = { value: string; label: string }
type JobOption = { value: string; label: string }
type JobStepOption = { step_id: string; step_no: number | null; step_name: string | null; job_id: string }
type JobType = { job_type_id: string; job_type_name_ja: string; job_type_name_vi: string }

// ── Component ────────────────────────────────────────────────────────────────
export function WorklogFormShared({
  defaultJobId,
  preloadedSteps,
  initialData,
  mode,
  onSuccess,
  onCancel,
}: WorklogFormSharedProps) {
  const supabase = createClient()
  const isEdit = !!(initialData?.log_id)
  const isJobLocked = !!defaultJobId

  // ── Master data ──────────────────────────────────────────────────────────
  const [employees, setEmployees] = useState<Employee[]>([])
  const [jobs, setJobs] = useState<JobOption[]>([])
  const [steps, setSteps] = useState<JobStepOption[]>(preloadedSteps || [])
  const [jobTypes, setJobTypes] = useState<JobType[]>([])

  // ── Form state ───────────────────────────────────────────────────────────
  const today = new Date().toISOString().slice(0, 10)
  const [workDate, setWorkDate] = useState(initialData?.work_date || today)
  const [employeeId, setEmployeeId] = useState(initialData?.employee_id || '')
  const [selectedJobId, setSelectedJobId] = useState(defaultJobId || initialData?.job_id || '')
  const [stepId, setStepId] = useState(initialData?.job_step_id || '')
  const [hoursSpent, setHoursSpent] = useState(initialData?.hours_spent?.toString() || '')
  const [isFinished, setIsFinished] = useState(initialData?.is_finished || false)
  const [description, setDescription] = useState(initialData?.description || '')
  const [notes, setNotes] = useState(initialData?.notes || '')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Quick Job Creation state (DEC-008) ──────────────────────────────────
  const [showQuickJob, setShowQuickJob] = useState(false)
  const [quickJobName, setQuickJobName] = useState('')
  const [quickJobTypeId, setQuickJobTypeId] = useState('')
  const [quickJobCreating, setQuickJobCreating] = useState(false)

  // ── Load master data ──────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      // Employees
      const { data: empData } = await supabase
        .from('employees')
        .select('employee_id, employee_code, employee_name')
        .eq('is_active', true)
        .order('employee_name')
      if (empData) {
        setEmployees(empData.map(e => ({
          value: e.employee_id,
          label: `${e.employee_code}${e.employee_name ? ' · ' + e.employee_name : ''}`
        })))
      }

      // Jobs (chỉ load khi không lock)
      if (!isJobLocked) {
        const { data: jobData } = await supabase
          .from('jobs')
          .select('job_id, job_code, job_name')
          .order('created_at', { ascending: false })
          .limit(200)
        if (jobData) {
          setJobs(jobData.map(j => ({
            value: j.job_id,
            label: `[${j.job_code}] ${j.job_name || ''}`
          })))
        }

        // Job types for Quick Job creation
        const { data: jtData } = await supabase
          .from('job_types')
          .select('job_type_id, job_type_name_ja, job_type_name_vi')
          .order('job_type_name_ja')
        if (jtData) setJobTypes(jtData)
      }
    }
    load()
  }, [supabase, isJobLocked])

  // ── Load steps khi job thay đổi (chế độ free-select) ─────────────────────
  useEffect(() => {
    if (isJobLocked && preloadedSteps) {
      setSteps(preloadedSteps)
      return
    }
    if (!selectedJobId) {
      setSteps([])
      setStepId('')
      return
    }
    async function loadSteps() {
      const { data } = await supabase
        .from('job_steps')
        .select('step_id, step_no, step_name, job_id')
        .eq('job_id', selectedJobId)
        .order('step_no')
      setSteps(data || [])
      setStepId('')
    }
    loadSteps()
  }, [selectedJobId, supabase, isJobLocked, preloadedSteps])

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setError(null)
    if (!workDate) return setError('作業日を入力してください / Vui lòng nhập ngày làm việc.')
    if (!employeeId) return setError('作業者を選択してください / Vui lòng chọn nhân viên.')
    if (!selectedJobId) return setError('ジョブを選択してください / Vui lòng chọn Job.')
    if (!stepId) return setError('工程を選択してください / Vui lòng chọn bước công việc.')
    const hours = hoursSpent ? parseFloat(hoursSpent) : null
    if (!hours || isNaN(hours) || hours <= 0) {
      return setError('作業時間は0より大きい値を入力してください / Số giờ phải lớn hơn 0.')
    }

    setLoading(true)
    const payload = {
      job_id: selectedJobId,
      job_step_id: stepId || null,
      employee_id: employeeId,
      work_date: workDate,
      hours_spent: hours,
      is_finished: isFinished,
      description: description.trim() || null,
      notes: notes.trim() || null,
    }

    let err: any = null
    if (isEdit && initialData?.log_id) {
      const res = await supabase.from('work_logs').update(payload).eq('log_id', initialData.log_id)
      err = res.error
    } else {
      const res = await supabase.from('work_logs').insert([payload])
      err = res.error
    }

    setLoading(false)
    if (err) return setError(err.message)
    onSuccess(mode === 'page' ? '/worklogs' : undefined)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: mode === 'modal' ? 20 : 0 }}>
      {error && (
        <div style={{ padding: '8px 12px', background: 'color-mix(in srgb, var(--status-error) 12%, transparent)', color: 'var(--status-error)', fontSize: 12, borderRadius: 6 }}>
          ⚠ {error}
        </div>
      )}

      {/* Row 1: Ngày + Nhân viên */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label className="form-label">
            作業日 <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Ngày làm việc</span>
            <span style={{ color: 'var(--status-error)' }}> *</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Calendar size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="date" className="form-input" style={{ paddingLeft: 30 }} value={workDate} onChange={e => setWorkDate(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label className="form-label">
            作業者 <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Nhân viên</span>
            <span style={{ color: 'var(--status-error)' }}> *</span>
          </label>
          <SearchableSelect options={employees} value={employeeId} onChange={v => setEmployeeId(v || '')} />
        </div>
      </div>

      {/* Row 2: Job (chỉ hiện khi không lock) */}
      {!isJobLocked && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label className="form-label">
            ジョブ <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Chọn Job</span>
            <span style={{ color: 'var(--status-error)' }}> *</span>
          </label>
          <SearchableSelect
            options={jobs}
            value={selectedJobId}
            onChange={v => { setSelectedJobId(v || ''); setShowQuickJob(false) }}
          />

          {/* Quick Job Creation (DEC-008) */}
          {!selectedJobId && !showQuickJob && (
            <button
              type="button"
              onClick={() => setShowQuickJob(true)}
              style={{
                background: 'none', border: '1px dashed var(--border-default)',
                borderRadius: 6, padding: '8px 12px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                color: 'var(--accent)', fontSize: 12, fontWeight: 600,
                marginTop: 4,
              }}
            >
              <Plus size={14} />
              <span>ジョブを新規作成 / Tạo Job nhanh</span>
            </button>
          )}

          {showQuickJob && (
            <div style={{
              marginTop: 6, padding: 14, borderRadius: 8,
              border: '1px solid var(--accent)',
              background: 'color-mix(in srgb, var(--accent) 5%, var(--bg-surface))',
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Plus size={13} /> クイックジョブ作成 / Tạo Job nhanh
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label" style={{ fontSize: 11 }}>
                    ジョブ名 <span style={{ color: 'var(--status-error)' }}>*</span>
                  </label>
                  <input
                    type="text" className="form-input" placeholder="VD: K-0123 新規"
                    value={quickJobName}
                    onChange={e => setQuickJobName(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label" style={{ fontSize: 11 }}>
                    種別 <span style={{ color: 'var(--status-error)' }}>*</span>
                  </label>
                  <select className="form-input" value={quickJobTypeId} onChange={e => setQuickJobTypeId(e.target.value)}>
                    <option value="">— 選択 —</option>
                    {jobTypes.map(jt => (
                      <option key={jt.job_type_id} value={jt.job_type_id}>
                        {jt.job_type_name_ja}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  type="button" className="btn btn-secondary"
                  style={{ fontSize: 11, padding: '5px 12px' }}
                  onClick={() => { setShowQuickJob(false); setQuickJobName(''); setQuickJobTypeId('') }}
                >
                  キャンセル
                </button>
                <button
                  type="button" className="btn btn-primary"
                  style={{ fontSize: 11, padding: '5px 12px' }}
                  disabled={quickJobCreating || !quickJobName.trim() || !quickJobTypeId}
                  onClick={async () => {
                    setQuickJobCreating(true)
                    setError(null)
                    const result = await createQuickJob({
                      job_name: quickJobName.trim(),
                      job_type_id: quickJobTypeId,
                      responsible_id: employeeId || null,
                    })
                    setQuickJobCreating(false)
                    if (!result.success) {
                      setError(result.error)
                      return
                    }
                    // Add new job to list & select it
                    const newJobOption = { value: result.job_id, label: `[${result.job_code}] ${quickJobName.trim()}` }
                    setJobs(prev => [newJobOption, ...prev])
                    setSelectedJobId(result.job_id)
                    setShowQuickJob(false)
                    setQuickJobName('')
                    setQuickJobTypeId('')
                  }}
                >
                  {quickJobCreating ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
                  <span>作成 / Tạo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Row 3: Bước công việc */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label className="form-label">
          工程ステップ <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Bước công việc</span>
          <span style={{ color: 'var(--status-error)' }}> *</span>
        </label>
        <select
          className="form-input"
          value={stepId}
          onChange={e => setStepId(e.target.value)}
          disabled={!selectedJobId}
        >
          <option value="">— {selectedJobId ? '工程を選択 / Chọn bước' : 'Chọn Job trước'} —</option>
          {steps.map(s => (
            <option key={s.step_id} value={s.step_id}>
              {s.step_no != null ? `${s.step_no}. ` : ''}{s.step_name || '(Không tên)'}
            </option>
          ))}
        </select>
      </div>

      {/* Row 4: Số giờ + is_finished */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label className="form-label">
            実績時間 (h) <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Số giờ thực tế</span>
            <span style={{ color: 'var(--status-error)' }}> *</span>
          </label>
          <input
            type="number" step="0.5" min="0.5" max="24" placeholder="8.0"
            className="form-input"
            value={hoursSpent}
            onChange={e => setHoursSpent(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label className="form-label">ステータス <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Trạng thái</span></label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, cursor: 'pointer' }}>
            <input
              type="checkbox"
              style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
              checked={isFinished}
              onChange={e => setIsFinished(e.target.checked)}
            />
            <span style={{ fontSize: 12 }}>工程完了 / Hoàn thành bước</span>
          </label>
        </div>
      </div>

      {/* Row 5: Mô tả */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label className="form-label">作業詳細 <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Chi tiết thao tác (tuỳ chọn)</span></label>
        <input
          type="text" className="form-input"
          placeholder="VD: Bản nháp, xử lý thô, hiệu chỉnh..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {/* Row 6: Ghi chú */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label className="form-label">備考 <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Ghi chú thêm</span></label>
        <textarea
          className="form-input" rows={2}
          placeholder="Ghi chú thêm nếu cần..."
          style={{ resize: 'vertical' }}
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>
    </div>
  )

  // ── Modal wrapper ────────────────────────────────────────────────────────
  if (mode === 'modal') {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onCancel}
      >
        <div
          className="card-flat"
          style={{ width: '100%', maxWidth: 520, padding: 0, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>
                {isEdit ? 'ログ編集 / Sửa nhật ký' : '新規ログ / Thêm nhật ký'}
              </h2>
            </div>
            <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={18} />
            </button>
          </div>
          {/* Body */}
          <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
            {inner}
          </div>
          {/* Footer */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>キャンセル</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span style={{ fontFamily: 'var(--font-jp)' }}>{isEdit ? '更新' : '保存'}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Page wrapper ─────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card-flat" style={{ padding: 24 }}>
        {inner}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, marginTop: 4, borderTop: '1px solid var(--border-default)' }}>
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <X size={14} />
            <span>キャンセル / Hủy</span>
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span style={{ fontFamily: 'var(--font-jp)' }}>{loading ? '登録中…' : '登録する / Lưu'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
