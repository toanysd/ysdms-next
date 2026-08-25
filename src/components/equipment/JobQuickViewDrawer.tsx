'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, ExternalLink, Calendar, Building2, Wrench, Clock, ChevronRight, Save, AlertTriangle, Hash, FileText, Plus, Ruler } from 'lucide-react'
import Link from 'next/link'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import { calculateTargetCompletionDate } from '@/lib/utils/companyCalendar'

interface JobQuickViewDrawerProps {
  job: JobForGantt | null
  onClose: () => void
  onOpenStepEdit: (jobId: string, step: JobStepRow) => void
  onJobUpdated: () => void
}

const getStatusOptions = (t: any) => [
  { value: 'NEW', label: t('jobStatus.NEW'), color: 'var(--status-info)' },
  { value: 'IN_PROGRESS', label: t('jobStatus.IN_PROGRESS'), color: 'var(--status-warning)' },
  { value: 'COMPLETED', label: t('jobStatus.COMPLETED'), color: 'var(--status-success)' },
  { value: 'ON_HOLD', label: t('jobStatus.ON_HOLD'), color: 'var(--text-muted)' },
]

const getStepStatusBadge = (t: any) => ({
  PENDING: { label: t('stepStatus.PENDING'), bg: 'var(--bg-surface-2)', color: 'var(--text-muted)' },
  IN_PROGRESS: { label: t('stepStatus.IN_PROGRESS'), bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--status-warning)' },
  COMPLETED: { label: t('stepStatus.COMPLETED'), color: 'var(--status-success)' },
})

function formatDate(d: string | null | undefined): string {
  if (!d) return '-'
  const date = new Date(d)
  const m = date.getMonth() + 1
  const day = date.getDate()
  const dow = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
  return `${m}/${day}（${dow}）`
}

function isOverdue(deadline: string | null | undefined): boolean {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

export function JobQuickViewDrawer({ job, onClose, onOpenStepEdit, onJobUpdated }: JobQuickViewDrawerProps) {
  const t = useTranslations('Engineering')
  const [activeTab, setActiveTab] = useState<'steps' | 'notes'>('steps')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Job Types Master list from DB
  const [jobTypes, setJobTypes] = useState<any[]>([])

  // Editable fields
  const [jobName, setJobName] = useState('')
  const [jobTypeId, setJobTypeId] = useState('1')
  const [priority, setPriority] = useState(5)
  const [targetCompletionDate, setTargetCompletionDate] = useState('')
  const [moldDeadline, setMoldDeadline] = useState('')
  const [shipDate, setShipDate] = useState('')
  const [jobStatus, setJobStatus] = useState('NEW')
  const [notes, setNotes] = useState('')

  // Load Job Types from DB
  useEffect(() => {
    async function loadJobTypes() {
      const supabase = createClient()
      const { data } = await supabase.from('job_types').select('*').order('sort_order', { ascending: true })
      if (data) setJobTypes(data)
    }
    loadJobTypes()
  }, [])

  // Sync state when job changes
  useEffect(() => {
    if (job) {
      setJobName(job.job_name || '')
      setJobTypeId(job.job_type_id ? String(job.job_type_id) : '1')
      setPriority(job.priority || 5)
      setTargetCompletionDate(job.target_completion_date?.split('T')[0] || '')
      setMoldDeadline(job.mold_deadline?.split('T')[0] || '')
      setShipDate(job.ship_date?.split('T')[0] || '')
      setJobStatus(job.job_status || 'NEW')
      setNotes((job as any).notes || '')
      setIsEditing(false)
      setActiveTab('steps')
    }
  }, [job])

  const handleMoldDeadlineChange = (val: string) => {
    setMoldDeadline(val)
    const autoTarget = calculateTargetCompletionDate(shipDate, val)
    if (autoTarget) setTargetCompletionDate(autoTarget)
  }

  const handleShipDateChange = (val: string) => {
    setShipDate(val)
    const autoTarget = calculateTargetCompletionDate(val, moldDeadline)
    if (autoTarget) setTargetCompletionDate(autoTarget)
  }

  const handleJobTypeChange = (newTypeId: string) => {
    setJobTypeId(newTypeId)
    const matched = jobTypes.find(jt => String(jt.job_type_id) === String(newTypeId))
    if (matched) {
      if (jobName.includes(':')) {
        const parts = jobName.split(':')
        const suffix = parts.slice(1).join(':').trim()
        setJobName(`${matched.job_type_name_ja}: ${suffix}`)
      }
    }
  }

  const handleSave = useCallback(async () => {
    if (!job) return
    setIsSaving(true)
    try {
      const supabase = createClient()
      const finalTarget = targetCompletionDate || calculateTargetCompletionDate(shipDate, moldDeadline) || null
      const matchedType = jobTypes.find(jt => String(jt.job_type_id) === String(jobTypeId))

      // 1. Update job
      const { error } = await supabase
        .from('jobs')
        .update({
          job_name: jobName,
          job_type_id: jobTypeId || null,
          job_category: matchedType?.category || undefined,
          priority,
          target_completion_date: finalTarget,
          mold_deadline: moldDeadline || null,
          ship_date: shipDate || null,
          job_status: jobStatus,
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('job_id', job.job_id)

      if (error) throw error

      // Update local job in memory so view mode immediately updates
      job.job_name = jobName
      job.job_type_id = jobTypeId
      ;(job as any).job_types = matchedType
      ;(job as any).job_category = matchedType?.category
      job.priority = priority
      job.target_completion_date = finalTarget
      job.mold_deadline = moldDeadline
      job.ship_date = shipDate
      job.job_status = jobStatus
      ;(job as any).notes = notes

      // 2. Sync main tooling steps if they were aligned with previous mold_deadline
      const oldMoldDl = job.mold_deadline?.split('T')[0]
      const oldTargetDl = job.target_completion_date?.split('T')[0]
      if (job.job_steps && job.job_steps.length > 0) {
        for (const st of job.job_steps) {
          const stDl = st.deadline?.split('T')[0]
          if (!stDl || stDl === oldMoldDl || stDl === oldTargetDl) {
            await supabase
              .from('job_steps')
              .update({
                deadline: finalTarget ? `${finalTarget}T00:00:00+00:00` : (moldDeadline ? `${moldDeadline}T00:00:00+00:00` : null),
                target_completion_date: finalTarget,
                updated_at: new Date().toISOString()
              })
              .eq('step_id', st.step_id)
          }
        }
      }

      setIsEditing(false)
      onJobUpdated()
    } catch (err) {
      console.error('Failed to save job:', err)
    } finally {
      setIsSaving(false)
    }
  }, [job, jobName, jobTypeId, jobTypes, priority, targetCompletionDate, moldDeadline, shipDate, jobStatus, notes, onJobUpdated])

  // Handle ESC key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (job) {
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }
  }, [job, onClose])

  if (!job) return null

  const steps = [...(job.job_steps || [])].sort((a, b) => a.step_no - b.step_no)
  const statusOptions = getStatusOptions(t)
  const stepStatusBadges = getStepStatusBadge(t)
  const statusOption = statusOptions.find(s => s.value === jobStatus) || statusOptions[0]
  const productName = (job as any).mold_masters?.products?.product_name || (job as any).products?.product_name || '-'
  const moldCode = (job as any).mold_masters?.mold_master_code || (job as any).products?.product_code || '-'
  const companyName = job.companies?.company_name || '-'
  const jobTypeName = (job as any).job_types?.job_type_name_ja || '-'
  const deadlineOverdue = isOverdue(job.mold_deadline) && job.job_status !== 'COMPLETED'
  const completedSteps = steps.filter(s => s.step_status === 'COMPLETED').length

  const resetEditing = () => {
    setIsEditing(false)
    setJobName(job.job_name || '')
    setPriority(job.priority || 5)
    setMoldDeadline(job.mold_deadline?.split('T')[0] || '')
    setShipDate(job.ship_date?.split('T')[0] || '')
    setJobStatus(job.job_status || 'NEW')
    setNotes((job as any).notes || '')
  }

  return createPortal(
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.35)',
          zIndex: 1000,
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '480px',
          maxWidth: '92vw',
          backgroundColor: 'var(--bg-page)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.12)',
          animation: 'drawer-slide-in 250ms ease-out forwards',
          fontFamily: 'var(--font-jp)',
        }}
      >
        {/* ─── Header ─── */}
        <div style={{
          padding: '16px 20px 14px',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface)',
        }}>
          {/* Row 1: Job Code + Status + Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
              <span style={{
                fontFamily: 'monospace',
                fontWeight: 700,
                fontSize: 16,
                color: 'var(--accent)',
                letterSpacing: '0.5px',
              }}>
                {job.job_code}
              </span>
              <span style={{
                padding: '3px 10px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: statusOption.color,
                color: '#fff',
                whiteSpace: 'nowrap',
              }}>
                {statusOption.label}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
              <Link
                href={`/equipment/jobs/${job.job_id}`}
                title={t('openFullPage')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 4,
                  borderRadius: 4,
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  transition: 'background-color 150ms ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-2)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <ExternalLink size={18} />
              </Link>
              <div style={{ width: 1, height: 16, backgroundColor: 'var(--border-default)', margin: '0 4px' }} />

              {isEditing ? (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ padding: '5px 14px', fontSize: 13, height: 32 }}
                  >
                    <Save size={14} /> {isSaving ? '保存中...' : '保存'}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={resetEditing}
                    style={{ padding: '5px 14px', fontSize: 13, height: 32 }}
                  >
                    取消
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(true)}
                  style={{ padding: '5px 14px', fontSize: 13, height: 32 }}
                >
                  編集
                </button>
              )}
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: 4,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
                title={t('close')}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Row 2: Job Name & Job Type */}
          {isEditing ? (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>
                    Job種別 (Loại Job)
                  </label>
                  <select
                    className="form-input font-bold"
                    value={jobTypeId}
                    onChange={e => handleJobTypeChange(e.target.value)}
                    style={{ fontSize: 12, padding: '4px 8px', height: 34, width: '100%' }}
                  >
                    {jobTypes.map(jt => (
                      <option key={jt.job_type_id} value={String(jt.job_type_id)}>
                        {jt.job_type_name_ja}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 2 }}>
                    指示名 (Tên chỉ thị)
                  </label>
                  <input
                    className="form-input font-bold"
                    value={jobName}
                    onChange={e => setJobName(e.target.value)}
                    style={{ fontSize: 13, padding: '4px 8px', height: 34, width: '100%' }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 15, color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1.4 }}>
                {jobName || job.job_code}
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 4,
                backgroundColor: 'var(--tint-teal-bg)',
                color: 'var(--tint-teal-text)',
                border: '1px solid var(--tint-teal-border)'
              }}>
                {jobTypes.find(jt => String(jt.job_type_id) === String(jobTypeId || job.job_type_id))?.job_type_name_ja || jobTypeName || '新規金型'}
              </span>
            </div>
          )}

          {/* Row 3: Product */}
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <span>{productName}</span>
          </div>
        </div>

        {/* ─── Info Cards ─── */}
        <div style={{
          padding: '12px 20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface)',
        }}>
          <InfoCard icon={<Building2 size={14} />} label="取引先" value={companyName} />
          <InfoCard icon={<Wrench size={14} />} label="金型" value={moldCode} />

          {/* 3 Milestones: View Mode */}
          {!isEditing && (
            <>
              <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, padding: '6px 8px', background: 'var(--bg-surface-2)', borderRadius: 6, border: '1px solid var(--border-default)' }}>
                {/* 1. Target Completion Date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#166534' }}>🏁 完成目標 (3稼働日前)</span>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '2px 4px', borderRadius: 4, textAlign: 'center', border: '1px solid #86EFAC' }}>
                    {job.target_completion_date ? formatDate(job.target_completion_date) : '—'}
                  </span>
                </div>

                {/* 2. Mold Handover Deadline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>🛠️ 指示納期 / 払出</span>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: deadlineOverdue ? 'var(--status-error)' : 'var(--text-primary)', background: '#fff', padding: '2px 4px', borderRadius: 4, textAlign: 'center', border: '1px solid var(--border-default)' }}>
                    {job.mold_deadline ? formatDate(job.mold_deadline) : '—'}
                  </span>
                </div>

                {/* 3. Product Ship Date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#92400E' }}>📦 製品出荷納期</span>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: '#92400E', background: '#FEF3C7', padding: '2px 4px', borderRadius: 4, textAlign: 'center', border: '1px solid #FDE68A' }}>
                    {job.ship_date ? formatDate(job.ship_date) : '—'}
                  </span>
                </div>
              </div>

              <InfoCard
                icon={<Clock size={14} />}
                label="進捗"
                value={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 7, backgroundColor: 'var(--bg-surface-3)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${job.overall_progress || 0}%`, height: '100%', backgroundColor: 'var(--accent)', borderRadius: 4, transition: 'width 300ms ease' }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', minWidth: 36, textAlign: 'right' }}>{job.overall_progress || 0}%</span>
                  </div>
                }
              />
              <InfoCard icon={<FileText size={14} />} label="状態" value={statusOption.label} />
            </>
          )}

          {/* 3 Milestones: Edit Mode */}
          {isEditing && (
            <>
              <InfoCard
                icon={<Calendar size={14} className="text-[#166534]" />}
                label="🏁 完成目標日 (3稼働日前)"
                value={
                  <input
                    type="date"
                    className="form-input font-mono font-bold"
                    value={targetCompletionDate}
                    onChange={e => setTargetCompletionDate(e.target.value)}
                    style={{ fontSize: 12, padding: '3px 6px', height: 30, width: '100%', borderColor: '#86EFAC', background: '#F0FDF4', color: '#166534' }}
                  />
                }
              />
              <InfoCard
                icon={<Calendar size={14} />}
                label="🛠️ 指示納期 / 払出期日"
                value={
                  <input
                    type="date"
                    className="form-input font-mono"
                    value={moldDeadline}
                    onChange={e => handleMoldDeadlineChange(e.target.value)}
                    style={{ fontSize: 12, padding: '3px 6px', height: 30, width: '100%' }}
                  />
                }
              />
              <InfoCard
                icon={<Calendar size={14} className="text-[#92400E]" />}
                label="📦 製品出荷納期"
                value={
                  <input
                    type="date"
                    className="form-input font-mono font-bold"
                    value={shipDate}
                    onChange={e => handleShipDateChange(e.target.value)}
                    style={{ fontSize: 12, padding: '3px 6px', height: 30, width: '100%', borderColor: '#FDE68A', background: '#FFFBEB', color: '#92400E' }}
                  />
                }
              />
              <InfoCard
                icon={<Hash size={14} />}
                label="優先度"
                value={
                  <select
                    className="form-input"
                    value={priority}
                    onChange={e => setPriority(Number(e.target.value))}
                    style={{ fontSize: 13, padding: '3px 6px', height: 30, width: '100%' }}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                }
              />
              <div style={{ gridColumn: '1 / -1' }}>
                <InfoCard
                  icon={<FileText size={14} />}
                  label="状態"
                  value={
                    <select
                      className="form-input"
                      value={jobStatus}
                      onChange={e => setJobStatus(e.target.value)}
                      style={{ fontSize: 13, padding: '3px 6px', height: 30, width: '100%' }}
                    >
                      {statusOptions.map((s: any) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* ─── Mold Dimensions & Info (compact) ─── */}
        {(job.design_revisions || job.equipment || job.products) && (
          <div style={{ padding: '8px 20px', display: 'flex', flexWrap: 'wrap', gap: 6, borderBottom: '1px solid var(--border-default)', backgroundColor: 'var(--bg-surface)' }}>
            {job.design_revisions?.design_length && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface-2)', padding: '2px 8px', borderRadius: 4 }}>
                <Ruler size={10} style={{ marginRight: 3, verticalAlign: -1 }} />
                {job.design_revisions.design_length}×{job.design_revisions.design_width}×{job.design_revisions.design_depth}mm
              </span>
            )}
            {job.design_revisions?.cutline_length && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface-2)', padding: '2px 8px', borderRadius: 4 }}>
                CL:{job.design_revisions.cutline_length}×{job.design_revisions.cutline_width}
              </span>
            )}
            {job.design_revisions?.cavity_count && (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface-2)', padding: '2px 8px', borderRadius: 4 }}>
                {job.design_revisions.cavity_count}面
              </span>
            )}
            {(job as any).mold_masters?.products?.product_material_specs?.map((spec: any, idx: number) => (
              <span key={idx} style={{ fontSize: 11, color: 'var(--status-info)', backgroundColor: 'var(--bg-surface-2)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                {spec.material_type}{spec.thickness_mm ? ` ${spec.thickness_mm}mm` : ''}
              </span>
            ))}
            {job.design_revisions?.plastic_type_designed && !(job as any).mold_masters?.products?.product_material_specs?.length && (
              <span style={{ fontSize: 11, color: 'var(--status-info)', backgroundColor: 'var(--bg-surface-2)', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                {job.design_revisions.plastic_type_designed}
              </span>
            )}
            {(job as any).mold_masters && (
              <Link href={`/engineering/designs/${(job as any).mold_masters.mold_master_id}`} style={{ fontSize: 11, color: 'var(--accent)', backgroundColor: 'var(--accent-light)', padding: '2px 8px', borderRadius: 4, textDecoration: 'none', fontWeight: 600 }}>
                🔗 {(job as any).mold_masters.mold_master_code} (TK)
              </Link>
            )}
            {job.equipment && (
              <Link href={`/equipment/molds/${job.equipment.equipment_id}`} style={{ fontSize: 11, color: 'var(--accent)', backgroundColor: 'var(--bg-surface-2)', padding: '2px 8px', borderRadius: 4, textDecoration: 'none', fontWeight: 600 }}>
                🔗 {job.equipment.display_name} (VL)
              </Link>
            )}
          </div>
        )}

        {/* ─── Tabs ─── */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--bg-surface)',
          padding: '0 20px',
        }}>
          {(['steps', 'notes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: activeTab === tab ? 600 : 500,
                color: activeTab === tab ? 'var(--accent)' : 'var(--text-muted)',
                borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 150ms ease',
              }}
            >
              {tab === 'steps' ? `工程 / Steps (${completedSteps}/${steps.length})` : '備考 / Notes'}
            </button>
          ))}
        </div>

        {/* ─── Tab Content ─── */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {activeTab === 'steps' ? (
            <div>
              {steps.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  {t('noSteps')}
                </div>
              ) : (
                steps.map((step) => {
                  const sb = (stepStatusBadges as any)[step.step_status] || stepStatusBadges.PENDING
                  const stepOverdue = isOverdue(step.deadline) && step.step_status !== 'COMPLETED'
                  return (
                    <div
                      key={step.step_id}
                      onClick={() => onOpenStepEdit(job.job_id, step)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '28px 1fr auto',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 20px',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background-color 150ms ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Step number circle */}
                      <div style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: sb.bg,
                        color: sb.color,
                        border: `1.5px solid ${sb.color}`,
                        flexShrink: 0,
                      }}>
                        {step.step_no}
                      </div>

                      {/* Step info */}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {step.step_name}
                          </span>
                          {step.track && (
                            <span style={{
                              fontSize: 10,
                              padding: '2px 6px',
                              borderRadius: 4,
                              backgroundColor: 'var(--bg-surface-2)',
                              color: 'var(--text-muted)',
                              fontWeight: 500,
                            }}>
                              {step.track}
                            </span>
                          )}
                          <span style={{
                            fontSize: 10,
                            padding: '2px 7px',
                            borderRadius: 4,
                            backgroundColor: sb.bg,
                            color: sb.color,
                            fontWeight: 600,
                          }}>
                            {(step as any).processing_statuses?.status_code || sb.label}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', gap: 12, flexWrap: 'wrap', lineHeight: 1.5 }}>
                          <span>予定: {formatDate(step.planned_start)} → {formatDate(step.planned_end)}</span>
                          {step.planned_hours != null && step.planned_hours > 0 && <span>{step.planned_hours}h予定</span>}
                          {step.actual_hours != null && step.actual_hours > 0 && (
                            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{step.actual_hours}h実績</span>
                          )}
                          {stepOverdue && step.deadline && (
                            <span style={{ color: 'var(--status-error)', fontWeight: 500 }}>
                              <AlertTriangle size={11} style={{ verticalAlign: -2, marginRight: 2 }} />
                              期限超過
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Chevron */}
                      <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    </div>
                  )
                })
              )}
              <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border-default)' }}>
                <button
                  className="btn btn-secondary w-full"
                  onClick={() => onOpenStepEdit(job.job_id, null as any)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 32, fontSize: 13 }}
                >
                  <Plus size={14} /> {t('addNewStep')}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: 20 }}>
              {isEditing ? (
                <textarea
                  className="form-textarea"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={8}
                  style={{ width: '100%', fontSize: 13 }}
                  placeholder={t('enterNotes')}
                />
              ) : (
                <div style={{
                  fontSize: 13,
                  color: notes ? 'var(--text-primary)' : 'var(--text-muted)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}>
                  {notes || t('noNotes')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes drawer-slide-in {
          from {
            transform: translateX(100%);
            opacity: 0.5;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>,
    document.body
  )
}

/* ─── InfoCard sub-component ─── */
function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      padding: '8px 10px',
      borderRadius: 8,
      backgroundColor: 'var(--bg-page)',
    }}>
      <div style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{typeof value === 'string' ? value : value}</div>
      </div>
    </div>
  )
}
