'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'

type Employee = {
  employee_id: string
  employee_name: string
}

type Job = {
  job_id: string
  job_code: string
}

type JobStep = {
  step_id: string
  step_no: number
  step_name: string
}

export function QCForm({ employees }: { employees: Employee[] }) {
  const t = useTranslations('QC')
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [jobSearch, setJobSearch] = useState('')
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJob, setSelectedJob] = useState<string>('')
  const [steps, setSteps] = useState<JobStep[]>([])
  
  // Form State
  const [stepId, setStepId] = useState('')
  const [recordedAt, setRecordedAt] = useState(() => {
    // default now() formatted for datetime-local
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })
  const [kcsId, setKcsId] = useState(employees.length > 0 ? employees[0].employee_id : '')
  const [qtyChecked, setQtyChecked] = useState<number | ''>('')
  const [qtyPass, setQtyPass] = useState<number | ''>('')
  const [defectCategory, setDefectCategory] = useState('')
  const [defectNotes, setDefectNotes] = useState('')

  // Derived NG
  const qtyNg = typeof qtyChecked === 'number' && typeof qtyPass === 'number' 
    ? Math.max(0, qtyChecked - qtyPass) 
    : 0

  // Async Job Search
  useEffect(() => {
    if (jobSearch.length < 2) {
      setJobs([])
      return
    }
    const fetchJobs = async () => {
      const { data } = await supabase
        .from('jobs')
        .select('job_id, job_code')
        .ilike('job_code', `%${jobSearch}%`)
        .limit(10)
      if (data) setJobs(data)
    }
    const timer = setTimeout(fetchJobs, 300)
    return () => clearTimeout(timer)
  }, [jobSearch, supabase])

  // Fetch Steps when Job is selected
  useEffect(() => {
    if (!selectedJob) {
      setSteps([])
      setStepId('')
      return
    }
    const fetchSteps = async () => {
      const { data } = await supabase
        .from('job_steps')
        .select('step_id, step_no, step_name')
        .eq('job_id', selectedJob)
        .order('step_no')
      if (data) {
        setSteps(data)
        if (data.length > 0) setStepId(data[0].step_id)
      }
    }
    fetchSteps()
  }, [selectedJob, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob || !stepId || qtyChecked === '' || qtyPass === '' || !kcsId) return
    
    setLoading(true)
    const { error } = await supabase.from('job_qc_logs').insert({
      job_id: selectedJob,
      job_step_id: stepId,
      recorded_by: kcsId,
      recorded_at: new Date(recordedAt).toISOString(),
      quantity_checked: qtyChecked,
      quantity_pass: qtyPass,
      quantity_ng: qtyNg,
      defect_category: qtyNg > 0 ? defectCategory : null,
      defect_notes: qtyNg > 0 ? defectNotes : null
    })

    setLoading(false)
    if (error) {
      alert(error.message)
    } else {
      router.push('/production/qc')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Job Selection */}
      <div className="form-section">
        <label className="form-label">{t('selectJob')}</label>
        <div className="flex flex-col gap-2">
          {!selectedJob ? (
            <>
              <input
                type="text"
                className="form-input"
                placeholder={t('searchJobPlaceholder')}
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
              />
              {jobs.length > 0 && (
                <div className="border border-slate-200 rounded-md shadow-sm mt-1 max-h-40 overflow-y-auto">
                  {jobs.map(j => (
                    <div 
                      key={j.job_id} 
                      className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-[13px] font-mono text-[var(--accent)]"
                      onClick={() => {
                        setSelectedJob(j.job_id)
                        setJobSearch(j.job_code)
                      }}
                    >
                      {j.job_code}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="font-mono text-[14px] font-bold text-[var(--accent)] bg-[var(--tint-teal-bg)] px-3 py-1.5 rounded-md">
                {jobs.find(j => j.job_id === selectedJob)?.job_code || jobSearch}
              </span>
              <button 
                type="button" 
                onClick={() => { setSelectedJob(''); setJobSearch(''); setJobs([]) }}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Step Selection */}
      <div className="form-section">
        <label className="form-label">{t('selectStep')}</label>
        <select 
          className="form-select" 
          value={stepId} 
          onChange={(e) => setStepId(e.target.value)}
          disabled={!selectedJob}
          required
        >
          <option value="">--</option>
          {steps.map(s => (
            <option key={s.step_id} value={s.step_id}>
              Bước {s.step_no}: {s.step_name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-grid-2">
        <div className="form-section">
          <label className="form-label">{t('recordedAt')}</label>
          <input 
            type="datetime-local" 
            className="form-input" 
            value={recordedAt}
            onChange={(e) => setRecordedAt(e.target.value)}
            required
          />
        </div>
        <div className="form-section">
          <label className="form-label">{t('selectEmployee')}</label>
          <select 
            className="form-select" 
            value={kcsId} 
            onChange={(e) => setKcsId(e.target.value)}
            required
          >
            {employees.map(e => (
              <option key={e.employee_id} value={e.employee_id}>
                {e.employee_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-grid-3">
        <div className="form-section">
          <label className="form-label">{t('checkedQty')}</label>
          <input 
            type="number" 
            min="0"
            className="form-input font-mono font-bold" 
            value={qtyChecked}
            onChange={(e) => setQtyChecked(e.target.value ? parseInt(e.target.value) : '')}
            required
          />
        </div>
        <div className="form-section">
          <label className="form-label text-emerald-700">{t('passQty')}</label>
          <input 
            type="number" 
            min="0"
            max={typeof qtyChecked === 'number' ? qtyChecked : undefined}
            className="form-input font-mono font-bold text-emerald-700" 
            value={qtyPass}
            onChange={(e) => setQtyPass(e.target.value ? parseInt(e.target.value) : '')}
            required
          />
        </div>
        <div className="form-section">
          <label className="form-label text-red-600">{t('ngQty')}</label>
          <div className="form-input font-mono font-bold text-red-600 bg-slate-50 flex items-center">
            {qtyNg}
          </div>
        </div>
      </div>

      {qtyNg > 0 && (
        <div className="p-4 bg-[var(--tint-orange-bg)] rounded-lg space-y-4 border border-orange-200">
          <div className="form-section">
            <label className="form-label text-orange-900">{t('defectCategory')}</label>
            <select 
              className="form-select border-orange-300"
              value={defectCategory}
              onChange={(e) => setDefectCategory(e.target.value)}
              required
            >
              <option value="">{t('selectDefectOpt')}</option>
              <option value="DIMENSION">{t('defectDIMENSION')}</option>
              <option value="APPEARANCE">{t('defectAPPEARANCE')}</option>
              <option value="MATERIAL">{t('defectMATERIAL')}</option>
              <option value="BURR">{t('defectBURR')}</option>
              <option value="OTHER">{t('defectOTHER')}</option>
            </select>
          </div>
          <div className="form-section">
            <label className="form-label text-orange-900">{t('defectNotes')}</label>
            <textarea 
              className="form-textarea border-orange-300" 
              rows={2}
              value={defectNotes}
              onChange={(e) => setDefectNotes(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || !selectedJob || !stepId || qtyChecked === ''}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? t('savingBtn') : t('saveBtn')}
        </button>
      </div>
    </form>
  )
}
