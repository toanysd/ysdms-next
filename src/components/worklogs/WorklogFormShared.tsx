'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
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
  onCancel
}: WorklogFormSharedProps) {
  const supabase = createClient()
  const t = useTranslations('Worklogs')
  const tCommon = useTranslations('Common')

  const isEdit = !!initialData?.log_id
  const isJobLocked = !!defaultJobId

  // ── States ──────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [jobs, setJobs] = useState<JobOption[]>([])
  const [steps, setSteps] = useState<JobStepOption[]>([])
  const [jobTypes, setJobTypes] = useState<JobType[]>([])

  const [workDate, setWorkDate] = useState(() => {
    if (initialData?.work_date) return initialData.work_date
    return new Date().toISOString().split('T')[0]
  })
  const [employeeId, setEmployeeId] = useState(initialData?.employee_id || '')
  const [selectedJobId, setSelectedJobId] = useState(defaultJobId || initialData?.job_id || '')
  const [stepId, setStepId] = useState(initialData?.job_step_id || '')
  const [hoursSpent, setHoursSpent] = useState(initialData?.hours_spent?.toString() || '')
  const [isFinished, setIsFinished] = useState(initialData?.is_finished || false)
  const [description, setDescription] = useState(initialData?.description || '')
  const [notes, setNotes] = useState(initialData?.notes || '')

  // Quick Job Form
  const [showQuickJob, setShowQuickJob] = useState(false)
  const [quickJobName, setQuickJobName] = useState('')
  const [quickJobTypeId, setQuickJobTypeId] = useState('')
  const [isFacilityJob, setIsFacilityJob] = useState(false)
  const [quickJobCreating, setQuickJobCreating] = useState(false)

  // ── Load Initial Metadata ──────────────────────────────────────────────────
  useEffect(() => {
    async function loadMeta() {
      // 1. Employees
      const { data: emps } = await supabase.from('employees').select('employee_id, employee_name, employee_code').order('employee_code')
      if (emps) {
        setEmployees(emps.map(e => ({ value: e.employee_id, label: `[${e.employee_code}] ${e.employee_name}` })))
      }

      // 2. Jobs (nếu không lock)
      if (!isJobLocked) {
        const { data: jobList } = await supabase.from('jobs').select('job_id, job_code, job_name').order('job_code')
        if (jobList) {
          setJobs(jobList.map(j => ({ value: j.job_id, label: `[${j.job_code}] ${j.job_name}` })))
        }
      }

      // 3. Job Types
      const { data: jTypes } = await supabase.from('job_types').select('*').order('job_type_name_ja')
      if (jTypes) {
        setJobTypes(jTypes)
      }
    }
    loadMeta()
  }, [supabase, isJobLocked])

  // ── Load Steps when Job changes ────────────────────────────────────────────
  useEffect(() => {
    if (isJobLocked && preloadedSteps) {
      setSteps(preloadedSteps)
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
      if (data) setSteps(data)
    }
    loadSteps()
  }, [selectedJobId, supabase, isJobLocked, preloadedSteps])

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setError(null)
    if (!workDate) return setError(t('validation.reqWorkDate'))
    if (!employeeId) return setError(t('validation.reqEmployee'))
    if (!selectedJobId) return setError(t('validation.reqJob'))
    if (!stepId) return setError(t('validation.reqStep'))
    const hours = hoursSpent ? parseFloat(hoursSpent) : null
    if (!hours || isNaN(hours) || hours <= 0) {
      return setError(t('validation.reqHours'))
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

      {/* Row 1: Date & Employee */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label className="form-label">
            {t('formWorkDate')}
            <span style={{ color: 'var(--status-error)' }}> *</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Calendar size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="date" className="form-input" style={{ paddingLeft: 30 }} value={workDate} onChange={e => setWorkDate(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label className="form-label">
            {t('formEmployee')}
            <span style={{ color: 'var(--status-error)' }}> *</span>
          </label>
          <SearchableSelect options={employees} value={employeeId} onChange={v => setEmployeeId(v || '')} />
        </div>
      </div>

      {/* Row 2: Job (when unlocked) */}
      {!isJobLocked && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label className="form-label">
            {t('formJob')}
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
              <span>{t('createQuickJob')}</span>
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
                <Plus size={13} /> {t('quickJobTitle')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label" style={{ fontSize: 11 }}>
                    {t('quickJobNameLabel')} <span style={{ color: 'var(--status-error)' }}>*</span>
                  </label>
                  <input
                    type="text" className="form-input" placeholder={t('quickJobNamePlaceholder')}
                    value={quickJobName}
                    onChange={e => setQuickJobName(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label" style={{ fontSize: 11 }}>
                    {t('type')} <span style={{ color: 'var(--status-error)' }}>*</span>
                  </label>
                  <select
                    className="form-input"
                    value={quickJobTypeId}
                    onChange={e => setQuickJobTypeId(e.target.value)}
                  >
                    <option value="">{t('selectType')}</option>
                    {jobTypes.map(t => (
                      <option key={t.job_type_id} value={t.job_type_id}>
                        {t.job_type_name_ja}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Job Classification Selection */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--bg-surface-2)', padding: '6px 10px', borderRadius: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>{t('jobClassification')}</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11 }}>
                  <input
                    type="radio"
                    name="isFacilityJob"
                    checked={!isFacilityJob}
                    onChange={() => setIsFacilityJob(false)}
                  />
                  <span>{t('moldProcessingJob')}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11 }}>
                  <input
                    type="radio"
                    name="isFacilityJob"
                    checked={isFacilityJob}
                    onChange={() => setIsFacilityJob(true)}
                  />
                  <span>{t('internalWorkJob')}</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
                <button
                  type="button" className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}
                  onClick={() => { setShowQuickJob(false); setQuickJobName(''); setQuickJobTypeId('') }}
                >
                  {tCommon('cancel')}
                </button>
                <button
                  type="button" className="btn btn-primary" style={{ padding: '4px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                  disabled={quickJobCreating || !quickJobName.trim() || !quickJobTypeId}
                  onClick={async () => {
                    setQuickJobCreating(true)
                    const result = await createQuickJob({
                      job_name: quickJobName.trim(),
                      job_type_id: quickJobTypeId,
                      is_facility_job: isFacilityJob
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
                  <span>{t('create')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Row 3: Step */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label className="form-label">
          {t('formStep')}
          <span style={{ color: 'var(--status-error)' }}> *</span>
        </label>
        <select
          className="form-input"
          value={stepId}
          onChange={e => setStepId(e.target.value)}
          disabled={!selectedJobId}
        >
          <option value="">— {selectedJobId ? t('selectStep') : t('selectJobFirst')} —</option>
          {steps.map(s => (
            <option key={s.step_id} value={s.step_id}>
              {s.step_no != null ? `${s.step_no}. ` : ''}{s.step_name || t('unnamedStep')}
            </option>
          ))}
        </select>
      </div>

      {/* Row 4: Hours & Finished */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <label className="form-label">
            {t('formHours')}
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
          <label className="form-label">{t('formStatus')}</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 38, cursor: 'pointer' }}>
            <input
              type="checkbox"
              style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }}
              checked={isFinished}
              onChange={e => setIsFinished(e.target.checked)}
            />
            <span style={{ fontSize: 12 }}>{t('stepFinished')}</span>
          </label>
        </div>
      </div>

      {/* Row 5: Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label className="form-label">{t('formDescription')}</label>
        <input
          type="text" className="form-input"
          placeholder="..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {/* Row 6: Notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <label className="form-label">{t('formNotes')}</label>
        <textarea
          className="form-input" rows={2}
          placeholder="..."
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
                {isEdit ? t('editLog') : t('newLog')}
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
            <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>{tCommon('cancel')}</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span style={{ fontFamily: 'var(--font-jp)' }}>{loading ? t('saving') : tCommon('save')}</span>
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
            <span>{tCommon('cancel')}</span>
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span style={{ fontFamily: 'var(--font-jp)' }}>{loading ? t('saving') : tCommon('save')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
