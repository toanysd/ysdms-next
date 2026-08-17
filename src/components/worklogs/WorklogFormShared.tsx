'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  Calendar, User, Clock, CheckCircle2,
  Layers, FileText, AlertCircle, Loader2,
  X, Save, Sparkles, Plus, Check, Briefcase
} from 'lucide-react'
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
  processing_code_id?: number | null
  description?: string | null
  notes?: string | null
}

type Employee = { value: string; label: string }
type JobOption = { value: string; label: string }
type JobStepOption = { step_id: string; step_no: number | null; step_name: string | null; job_id: string }
type JobType = { job_type_id: string; job_type_name_ja: string; job_type_name_vi: string }

const QUICK_HOURS = [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0, 8.0]
const STORAGE_KEY_LAST_WORKER = 'ysdms_last_selected_worker_id'

// ── Component ────────────────────────────────────────────────────────────────
export function WorklogFormShared({
  defaultJobId,
  preloadedSteps,
  initialData,
  mode,
  onSuccess,
  onCancel,
}: WorklogFormSharedProps) {
  const t = useTranslations('Worklogs')
  const tCommon = useTranslations('Common')
  const supabase = createClient()

  const isEdit = !!initialData?.log_id
  const isJobLocked = !!defaultJobId && !isEdit

  // Form State
  const [workDate, setWorkDate] = useState<string>(
    initialData?.work_date
      ? initialData.work_date.slice(0, 10)
      : new Date().toISOString().split('T')[0]
  )
  const [employeeId, setEmployeeId] = useState<string>(initialData?.employee_id || '')
  const [selectedJobId, setSelectedJobId] = useState<string>(
    initialData?.job_id || defaultJobId || ''
  )
  const [stepId, setStepId] = useState<string>(initialData?.job_step_id || '')
  const [hoursSpent, setHoursSpent] = useState<string>(
    initialData?.hours_spent != null ? String(initialData.hours_spent) : '1.0'
  )
  const [isFinished, setIsFinished] = useState<boolean>(initialData?.is_finished ?? false)
  const [selectedCodeId, setSelectedCodeId] = useState<string>(
    initialData?.processing_code_id ? String(initialData.processing_code_id) : ''
  )
  const [customDescription, setCustomDescription] = useState<string>(initialData?.description || '')
  const [notes, setNotes] = useState<string>(initialData?.notes || '')

  // Dropdown Lists
  const [employees, setEmployees] = useState<Employee[]>([])
  const [jobs, setJobs] = useState<JobOption[]>([])
  const [steps, setSteps] = useState<JobStepOption[]>([])
  const [jobTypes, setJobTypes] = useState<JobType[]>([])
  const [processingCodes, setProcessingCodes] = useState<{ value: string; label: string }[]>([])
  const [rawCodes, setRawCodes] = useState<any[]>([])

  // Quick Job modal state
  const [showQuickJob, setShowQuickJob] = useState(false)
  const [quickJobName, setQuickJobName] = useState('')
  const [quickJobTypeId, setQuickJobTypeId] = useState('')
  const [isFacilityJob, setIsFacilityJob] = useState(false)
  const [quickJobCreating, setQuickJobCreating] = useState(false)

  // Status State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Load Employees, Jobs, Processing Codes ──────────────────────────────────
  useEffect(() => {
    async function loadMeta() {
      // 1. Employees
      const { data: emps } = await supabase
        .from('employees')
        .select('employee_id, employee_name, employee_code')
        .eq('is_active', true)
        .order('employee_name')
      if (emps) {
        setEmployees(emps.map(e => ({ value: e.employee_id, label: `[${e.employee_code}] ${e.employee_name}` })))
        
        // Restore last selected worker from localStorage
        const lastWorker = localStorage.getItem(STORAGE_KEY_LAST_WORKER)
        if (!initialData?.employee_id && lastWorker && emps.some(e => e.employee_id === lastWorker)) {
          setEmployeeId(lastWorker)
        } else if (!employeeId && emps.length > 0 && !initialData?.employee_id) {
          setEmployeeId(emps[0].employee_id)
        }
      }

      // 2. Jobs
      if (!isJobLocked) {
        const { data: jobList } = await supabase
          .from('jobs')
          .select('job_id, job_code, job_name, job_category')
          .order('job_code')
        if (jobList) {
          const sorted = [...jobList].sort((a, b) => {
            const aIsInternal = a.job_code === '社内作業' || a.job_category === 'INTERNAL_OPS'
            const bIsInternal = b.job_code === '社内作業' || b.job_category === 'INTERNAL_OPS'
            if (aIsInternal && !bIsInternal) return -1
            if (!aIsInternal && bIsInternal) return 1
            return (a.job_code || '').localeCompare(b.job_code || '')
          })
          setJobs(sorted.map(j => ({
            value: j.job_id,
            label: j.job_code === '社内作業' || j.job_category === 'INTERNAL_OPS'
              ? `📌 [${j.job_code}] ${j.job_name}`
              : `[${j.job_code}] ${j.job_name}`
          })))
        }
      }

      // 3. Job Types
      const { data: jTypes } = await supabase.from('job_types').select('*').order('job_type_name_ja')
      if (jTypes) {
        setJobTypes(jTypes)
      }

      // 4. Processing Codes
      const { data: codes } = await supabase
        .from('processing_codes')
        .select('processing_code_id, processing_name')
        .eq('is_active', true)
        .order('processing_code_id')
      if (codes) {
        setRawCodes(codes)
        setProcessingCodes(codes.map(c => ({
          value: String(c.processing_code_id),
          label: `[${c.processing_code_id}] ${c.processing_name}`
        })))
      }
    }
    loadMeta()
  }, [supabase, isJobLocked, initialData, employeeId])

  // Handle worker change & persist
  const handleEmployeeChange = (val: string | null) => {
    const newEmpId = val || ''
    setEmployeeId(newEmpId)
    if (newEmpId) {
      localStorage.setItem(STORAGE_KEY_LAST_WORKER, newEmpId)
    }
  }

  // ── Load Steps when Job changes ────────────────────────────────────────────
  useEffect(() => {
    if (isJobLocked && preloadedSteps) {
      setSteps(preloadedSteps)
      if (!stepId && preloadedSteps.length > 0) {
        setStepId(preloadedSteps[0].step_id)
      }
      return
    }

    if (!selectedJobId) {
      setSteps([])
      return
    }

    async function loadSteps() {
      const { data } = await supabase
        .from('job_steps')
        .select('step_id, step_no, step_name, job_id')
        .eq('job_id', selectedJobId)
        .order('step_no')
      if (data) {
        setSteps(data)
        if (!stepId && data.length > 0) {
          setStepId(data[0].step_id)
        }
      }
    }
    loadSteps()
  }, [selectedJobId, supabase, isJobLocked, preloadedSteps, stepId])

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setError(null)
    if (!workDate) return setError('Vui lòng chọn ngày làm việc')
    if (!employeeId) return setError('Vui lòng chọn người thực hiện')
    if (!selectedJobId) return setError('Vui lòng chọn Job gia công')
    if (!stepId) return setError('Vui lòng chọn công đoạn')
    const hours = hoursSpent ? parseFloat(hoursSpent) : null
    if (!hours || isNaN(hours) || hours <= 0) {
      return setError('Vui lòng nhập số giờ làm việc hợp lệ')
    }

    // Determine description: either from selected processing code or custom description
    let desc = customDescription.trim()
    let codeId: number | null = null
    if (selectedCodeId) {
      codeId = parseInt(selectedCodeId)
      const matched = rawCodes.find(c => c.processing_code_id === codeId)
      if (matched && !desc) {
        desc = matched.processing_name
      }
    }

    setLoading(true)
    const payload = {
      job_id: selectedJobId,
      job_step_id: stepId || null,
      employee_id: employeeId,
      work_date: workDate,
      hours_spent: hours,
      is_finished: isFinished,
      processing_code_id: codeId,
      description: desc || null,
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

  // ── Focused, Distraction-Free Form Content ──────────────────────────────────
  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: mode === 'modal' ? '16px 22px' : 0 }}>
      {error && (
        <div
          style={{
            padding: '8px 12px',
            background: 'var(--tint-error-bg)',
            color: 'var(--tint-error-text)',
            fontSize: 12,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* ── SECTION 1: Session & Assignment ── */}
      <div
        style={{
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          background: '#fff',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '7px 14px',
            background: 'var(--tint-blue-bg)',
            borderBottom: '1px solid var(--tint-blue-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--tint-blue-text)',
          }}
        >
          <User size={14} />
          <span>担当・日時 (Người thực hiện & Ngày làm việc)</span>
        </div>

        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Row 1: Date & Employee */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
            <div>
              <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                {t('formWorkDate')} (Ngày làm) <span style={{ color: 'red' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar
                  size={14}
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="date"
                  className="form-input font-mono"
                  style={{ paddingLeft: 32, fontSize: 13, fontWeight: 600, height: 36 }}
                  value={workDate}
                  onChange={(e) => setWorkDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700, margin: 0 }}>
                  {t('formEmployee')} (Người thực hiện) <span style={{ color: 'red' }}>*</span>
                </label>
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                  ※ 次回もこの作業者を記憶
                </span>
              </div>
              <SearchableSelect
                options={employees}
                value={employeeId}
                onChange={handleEmployeeChange}
              />
            </div>
          </div>

          {/* Row 2: Job (when unlocked) */}
          {!isJobLocked && (
            <div>
              <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                {t('formJob')} (Job gia công) <span style={{ color: 'red' }}>*</span>
              </label>
              <SearchableSelect
                options={jobs}
                value={selectedJobId}
                onChange={(v) => {
                  setSelectedJobId(v || '')
                  setShowQuickJob(false)
                }}
              />
            </div>
          )}

          {/* Row 3: Step */}
          <div>
            <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
              {t('formStep')} (Công đoạn) <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              className="form-input"
              value={stepId}
              onChange={(e) => setStepId(e.target.value)}
              disabled={!selectedJobId}
              style={{ fontSize: 12.5, fontWeight: 600, height: 36 }}
            >
              <option value="">— {selectedJobId ? t('selectStep') : t('selectJobFirst')} —</option>
              {steps.map((s) => {
                const isInternalJob = (selectedJobId && (
                  selectedJobId === 'caeb4ec3-065a-4653-b69a-19e6dbc4287a' || 
                  jobs.find(j => j.value === selectedJobId)?.label.includes('社内作業')
                ))
                const showStepNo = !isInternalJob && s.step_no != null
                return (
                  <option key={s.step_id} value={s.step_id}>
                    {showStepNo ? `Step ${s.step_no}. ` : ''}{s.step_name || t('unnamedStep')}
                  </option>
                )
              })}
            </select>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Actual Hours & Progress ── */}
      <div
        style={{
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          background: '#fff',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '7px 14px',
            background: 'var(--tint-teal-bg)',
            borderBottom: '1px solid var(--tint-teal-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--accent)',
          }}
        >
          <Clock size={14} />
          <span>実績工数・進捗 (Số giờ thực tế & Hoàn thành)</span>
        </div>

        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Hours input with quick selection chips */}
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, alignItems: 'center' }}>
            <div>
              <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                {t('formHours')} (h) <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="24"
                className="form-input font-mono text-center"
                style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)', height: 36 }}
                value={hoursSpent}
                onChange={(e) => setHoursSpent(e.target.value)}
              />
            </div>

            {/* Quick hour buttons */}
            <div>
              <label className="form-label" style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>
                クイック選択 (Chọn nhanh số giờ):
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {QUICK_HOURS.map((h) => {
                  const isSelected = parseFloat(hoursSpent) === h
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHoursSpent(String(h))}
                      style={{
                        padding: '3px 9px',
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        borderRadius: 4,
                        border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
                        background: isSelected ? 'var(--accent)' : 'var(--bg-muted, #F8FAFC)',
                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.1s ease',
                      }}
                    >
                      {h}h
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Finished Step Checkbox */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              background: isFinished ? 'var(--tint-teal-bg)' : '#F8FAFC',
              border: `1px solid ${isFinished ? 'var(--tint-teal-border)' : 'var(--border-default)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            onClick={() => setIsFinished(!isFinished)}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', margin: 0 }}>
              <input
                type="checkbox"
                checked={isFinished}
                onChange={(e) => setIsFinished(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              <span style={{ fontSize: 12, fontWeight: 700, color: isFinished ? 'var(--accent)' : 'var(--text-primary)' }}>
                {t('stepFinished')} (Công đoạn này đã hoàn thành xong)
              </span>
            </label>
            {isFinished && <CheckCircle2 size={16} style={{ color: 'var(--accent)' }} />}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Processing Code & Notes ── */}
      <div
        style={{
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          background: '#fff',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '7px 14px',
            background: 'var(--bg-muted, #F8FAFC)',
            borderBottom: '1px solid var(--border-default)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text-secondary)',
          }}
        >
          <FileText size={14} />
          <span>作業内容・詳細 (Nội dung thực hiện theo mã công việc)</span>
        </div>

        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Processing code searchable select + custom text */}
          <div>
            <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
              加工コード・作業内容 (Mã công việc / Nội dung gia công) <span style={{ color: 'red' }}>*</span>
            </label>
            <SearchableSelect
              options={processingCodes}
              value={selectedCodeId}
              onChange={(v) => {
                setSelectedCodeId(v || '')
                if (v) {
                  const matched = rawCodes.find(c => c.processing_code_id === parseInt(v))
                  if (matched) setCustomDescription(matched.processing_name)
                }
              }}
              placeholder="コードまたは作業名で検索（例: 21 試作穴あけ、12 本型ミガキ、50 5S...）"
              maxDropdownHeight="320px"
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
              {t('formNotes')} (Ghi chú tự do / 申し送り)
            </label>
            <textarea
              className="form-textarea"
              rows={2}
              style={{ fontSize: 12 }}
              placeholder="治具、引き継ぎ事項、特記事項など..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )

  // ── Modal wrapper ────────────────────────────────────────────────────────
  if (mode === 'modal') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
        onClick={onCancel}
      >
        <div
          className="card-flat"
          style={{
            width: '100%',
            maxWidth: 720,
            background: 'var(--bg-surface)',
            borderRadius: 8,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '92vh',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border-default)',
              background: 'var(--tint-teal-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: '#fff',
                  border: '1px solid var(--tint-teal-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                }}
              >
                <Clock size={18} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                  {isEdit ? t('editLog') : t('newLog')}
                </h2>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  日々の実績工数と作業内容を正確に記録します
                </div>
              </div>
            </div>
            <button
              onClick={onCancel}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: 4,
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {inner}
          </div>

          {/* Modal Footer */}
          <div
            style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border-default)',
              background: 'var(--bg-muted, #F8FAFC)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            <button className="btn btn-secondary" onClick={onCancel} disabled={loading} style={{ fontSize: 12, padding: '6px 16px' }}>
              {tCommon('cancel')}
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ fontSize: 12.5, padding: '6px 18px', gap: 6 }}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              <span>{loading ? '保存中...' : tCommon('save')}</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Page wrapper ─────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card-flat" style={{ padding: 22 }}>
        {inner}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border-default)' }}>
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>{tCommon('cancel')}</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ gap: 6 }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>{loading ? '保存中...' : tCommon('save')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
