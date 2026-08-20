'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  Wrench, Hammer, Clock, PlusCircle, ExternalLink,
  CheckCircle2, AlertCircle, Layers, Calendar, ChevronDown, ChevronRight,
  User, FileText, Sparkles, RefreshCw, Scissors, Box, AlertTriangle,
  TrendingUp, BarChart2, Plus, Edit
} from 'lucide-react'
import Link from 'next/link'
import { QuickAddRepairJobModal } from './QuickAddRepairJobModal'
import { WorklogFormShared } from '@/components/worklogs/WorklogFormShared'
import { EditJobModal, JobEditData } from '@/app/equipment/jobs/_components/EditJobModal'

interface TabJobsProps {
  productId: string
  productCode?: string
}

interface JobStepItem {
  step_id: string
  step_no: number
  step_name: string
  step_status?: string | null
  arrangement?: string | null
  condition?: string | null
  manufacture_location?: string | null
  estimated_hours?: number | null
  actual_hours?: number | null
  deadline?: string | null
  work_logs?: WorkLogItem[]
}

interface WorkLogItem {
  log_id: string
  work_date: string
  hours_spent: number
  description?: string | null
  is_finished?: boolean | null
  job_step_id?: string | null
  employees?: {
    employee_name: string
  } | null
}

interface JobItem {
  job_id: string
  job_code: string
  job_name: string
  job_status: string
  job_category?: string | null
  job_type_id?: string | null
  estimated_hours?: number | null
  start_date?: string | null
  deadline?: string | null
  completed_date?: string | null
  notes?: string | null
  created_at: string
  equipment_id?: string | null
  design_revision_id?: string | null
  job_steps?: JobStepItem[]
  work_logs?: WorkLogItem[]
  total_actual_hours: number
}

const CATEGORY_BADGE: Record<string, { label: string; className: string }> = {
  DESIGN: { label: '設計', className: 'badge badge--info font-semibold' },
  MOLD_NEW: { label: '新規金型', className: 'badge badge--success font-semibold' },
  MOLD_MODIFY: { label: '金型改修', className: 'badge badge--warning font-semibold' },
  CUTTER_NEW: { label: '新規抜型', className: 'badge badge--success font-semibold' },
  EQUIPMENT_NEW: { label: '新規治具', className: 'badge badge--success font-semibold' },
  EQUIPMENT_REPAIR: { label: '治具修理', className: 'badge badge--warning font-semibold' },
  INTERNAL_OPS: { label: '社内作業', className: 'badge badge--neutral font-semibold' },
  NEW: { label: '新規製作', className: 'badge badge--success font-semibold' },
  REPAIR: { label: '改修・修正', className: 'badge badge--warning font-semibold' },
  MAINTENANCE: { label: '定期保守', className: 'badge badge--info font-semibold' },
  REMAKE: { label: '再製作', className: 'badge badge--neutral font-semibold' },
}

const STATUS_CONFIG: Record<string, { labelJA: string; badgeClass: string; bg: string; color: string }> = {
  NEW: { labelJA: '新規 (New)', badgeClass: 'badge badge--neutral', bg: '#F1F5F9', color: '#475569' },
  NOT_STARTED: { labelJA: '未着手 (Pending)', badgeClass: 'badge badge--neutral', bg: '#F1F5F9', color: '#475569' },
  PENDING: { labelJA: '未着手 (Pending)', badgeClass: 'badge badge--neutral', bg: '#F1F5F9', color: '#475569' },
  IN_PROGRESS: { labelJA: '進行中 (In Progress)', badgeClass: 'badge badge--info', bg: '#EFF6FF', color: '#2563EB' },
  ON_HOLD: { labelJA: '保留 (On Hold)', badgeClass: 'badge badge--warning', bg: '#FFFBEB', color: '#D97706' },
  COMPLETED: { labelJA: '完了 (Completed)', badgeClass: 'badge badge--success', bg: '#ECFDF5', color: '#059669' },
  CANCELLED: { labelJA: '中止 (Cancelled)', badgeClass: 'badge badge--error', bg: '#FEF2F2', color: '#DC2626' },
}

export function TabJobs({ productId, productCode }: TabJobsProps) {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()

  const [jobs, setJobs] = useState<JobItem[]>([])
  const [expandedJobIds, setExpandedJobIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [code, setCode] = useState<string>(productCode || '')

  // Interactive Modals
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<JobEditData | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeLogJobId, setActiveLogJobId] = useState<string | null>(null)
  const [activeLogStepId, setActiveLogStepId] = useState<string | null>(null)

  const fetchJobs = useCallback(async () => {
    if (!productId) return
    setLoading(true)
    setError(null)

    try {
      // 1. Get product details if code is not provided
      if (!code) {
        const { data: p } = await supabase.from('products').select('product_code').eq('product_id', productId).single()
        if (p?.product_code) setCode(p.product_code)
      }

      // 2. Get revisions for this product
      const { data: revs } = await supabase
        .from('design_revisions')
        .select('revision_id')
        .eq('product_id', productId)

      const revIds = (revs || []).map((r) => r.revision_id)

      // 3. Query jobs matching product_id OR design_revision_id
      let query = supabase
        .from('jobs')
        .select(`
          job_id, job_code, job_name, job_status, job_category, job_type_id,
          estimated_hours, start_date, deadline, completed_date, notes, created_at,
          equipment_id, design_revision_id,
          job_steps (
            step_id, step_no, step_name, step_status, arrangement, condition,
            manufacture_location, estimated_hours, actual_hours, deadline,
            work_logs (
              log_id, work_date, hours_spent, is_finished, description,
              employees:employees!work_logs_employee_id_fkey ( employee_name )
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (revIds.length > 0) {
        query = query.or(`product_id.eq.${productId},design_revision_id.in.(${revIds.join(',')})`)
      } else {
        query = query.eq('product_id', productId)
      }

      const { data, error: fetchErr } = await query

      if (fetchErr) throw fetchErr

      if (data) {
        const enrichedJobs: JobItem[] = data.map((j: any) => {
          const steps: JobStepItem[] = (j.job_steps || []).map((s: any) => {
            const logs: WorkLogItem[] = (s.work_logs || []).map((l: any) => ({
              log_id: l.log_id,
              work_date: l.work_date,
              hours_spent: Number(l.hours_spent) || 0,
              is_finished: l.is_finished,
              description: l.description,
              employees: l.employees ? (Array.isArray(l.employees) ? l.employees[0] : l.employees) : null,
            }))

            const stepActualHours = logs.reduce((sum, l) => sum + l.hours_spent, 0)

            return {
              step_id: s.step_id,
              step_no: s.step_no || 0,
              step_name: s.step_name || '工程',
              step_status: s.step_status || 'PENDING',
              arrangement: s.arrangement,
              condition: s.condition,
              manufacture_location: s.manufacture_location,
              estimated_hours: s.estimated_hours != null ? Number(s.estimated_hours) : null,
              actual_hours: stepActualHours,
              deadline: s.deadline,
              work_logs: logs,
            }
          })

          // Sort steps by step_no
          steps.sort((a, b) => a.step_no - b.step_no)

          // Compute total actual hours for this job
          const totalActual = steps.reduce((sum, s) => sum + (s.actual_hours || 0), 0)

          return {
            job_id: j.job_id,
            job_code: j.job_code,
            job_name: j.job_name || '名称未設定',
            job_status: j.job_status || 'NEW',
            job_category: j.job_category,
            job_type_id: j.job_type_id,
            estimated_hours: j.estimated_hours != null ? Number(j.estimated_hours) : null,
            start_date: j.start_date,
            deadline: j.deadline,
            completed_date: j.completed_date,
            notes: j.notes,
            created_at: j.created_at,
            equipment_id: j.equipment_id,
            design_revision_id: j.design_revision_id,
            job_steps: steps,
            total_actual_hours: totalActual,
          }
        })

        setJobs(enrichedJobs)

        // Expand first job by default if available
        if (enrichedJobs.length > 0 && expandedJobIds.size === 0) {
          setExpandedJobIds(new Set([enrichedJobs[0].job_id]))
        }
      }
    } catch (err: any) {
      console.error('Error fetching jobs for TabJobs dashboard:', err)
      setError(err?.message || 'Lỗi tải danh sách Lệnh sản xuất')
    } finally {
      setLoading(false)
    }
  }, [productId, code])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const toggleAccordion = (jobId: string) => {
    setExpandedJobIds((prev) => {
      const next = new Set(prev)
      if (next.has(jobId)) next.delete(jobId)
      else next.add(jobId)
      return next
    })
  }

  // Summary Metrics
  const { totalJobs, totalEstHours, totalActHours, overrunCount, overallProgress } = useMemo(() => {
    let est = 0
    let act = 0
    let overruns = 0

    jobs.forEach((j) => {
      const jobEst = j.estimated_hours || 0
      const jobAct = j.total_actual_hours || 0
      est += jobEst
      act += jobAct
      if (jobEst > 0 && jobAct > jobEst) {
        overruns++
      }
    })

    const progress = est > 0 ? Math.min(100, Math.round((act / est) * 100)) : 0

    return {
      totalJobs: jobs.length,
      totalEstHours: est,
      totalActHours: act,
      overrunCount: overruns,
      overallProgress: progress,
    }
  }, [jobs])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── 1. Top Header & Action Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Wrench size={16} style={{ color: 'var(--tint-blue-text, #2563eb)' }} />
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('manufacturingDashboard')}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
              {t('equipmentLifecycle')}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setIsRepairModalOpen(true)}
            className="btn btn-primary"
            style={{ height: 28, padding: '0 12px', fontSize: 11, gap: 4 }}
          >
            <Plus size={12} />
            <span>{t('addRepairJob')}</span>
          </button>
          <button
            onClick={fetchJobs}
            className="btn btn-secondary"
            style={{ height: 28, width: 28, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="再読込 (Làm mới)"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── 2. Summary KPI Ribbon ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
      }}>
        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid var(--accent, #0D9488)', background: 'var(--tint-teal-bg, #f0fdfa)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
            📋 {t('productionOrder')} (Tổng Lệnh SX)
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
            {loading ? '...' : `${totalJobs} 件`}
          </div>
        </div>

        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid #3B82F6', background: '#EFF6FF' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
            ⏱️ {t('estimatedHours')} (Tổng Kế Hoạch)
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'monospace', color: '#1E40AF' }}>
            {loading ? '...' : `${totalEstHours.toFixed(1)} h`}
          </div>
        </div>

        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid #059669', background: '#ECFDF5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
              ⚙️ {t('actualHours')} (Tổng Thực Tế)
            </div>
            {overrunCount > 0 && (
              <span className="badge badge--error" style={{ fontSize: 8 }}>
                {overrunCount} {t('hoursOverrun')}
              </span>
            )}
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'monospace', color: '#059669' }}>
            {loading ? '...' : `${totalActHours.toFixed(1)} h`}
          </div>
        </div>

        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid var(--tint-purple-text, #8B5CF6)', background: 'var(--tint-purple-bg, #faf5ff)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
            📈 {t('progressPercent')} (Hiệu Suất Tổng)
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'monospace', color: 'var(--tint-purple-text)' }}>
            {loading ? '...' : `${overallProgress}%`}
          </div>
        </div>
      </div>

      {/* ── 3. Main 4-Level Accordion Dashboard ── */}
      {loading ? (
        <div className="card-flat" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
          <RefreshCw size={16} className="animate-spin" style={{ margin: '0 auto 8px' }} />
          製造指示・作業履歴を読込中... (Loading manufacturing jobs...)
        </div>
      ) : error ? (
        <div className="card-flat" style={{ padding: 16, color: '#DC2626', fontSize: 12, textAlign: 'center' }}>
          <AlertTriangle size={16} style={{ display: 'inline', marginRight: 6 }} />
          {error}
        </div>
      ) : jobs.length === 0 ? (
        <div className="card-flat" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          <Box size={24} style={{ margin: '0 auto 8px', color: 'var(--text-muted)' }} />
          <div>{t('noProductionOrders')}</div>
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => setIsRepairModalOpen(true)}
              className="btn btn-secondary"
              style={{ fontSize: 11, padding: '4px 12px' }}
            >
              <Plus size={12} /> {t('addRepairJob')}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {jobs.map((job) => {
            const isExpanded = expandedJobIds.has(job.job_id)
            const statusConf = STATUS_CONFIG[job.job_status] || STATUS_CONFIG.NEW
            const catBadge = CATEGORY_BADGE[job.job_category || ''] || CATEGORY_BADGE.NEW

            const estHours = job.estimated_hours || 0
            const actHours = job.total_actual_hours
            const isOverrun = estHours > 0 && actHours > estHours
            const overrunAmount = (actHours - estHours).toFixed(1)

            const progressPct = estHours > 0
              ? Math.min(100, Math.round((actHours / estHours) * 100))
              : (job.job_status === 'COMPLETED' ? 100 : 0)

            return (
              <div
                key={job.job_id}
                className="card-flat"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  border: isExpanded ? '1px solid var(--accent, #0D9488)' : '1px solid var(--border-default, #e2e8f0)',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* ── Level 1: Job Row Accordion Header ── */}
                <div
                  onClick={() => toggleAccordion(job.job_id)}
                  style={{
                    padding: '10px 14px',
                    background: isExpanded ? 'var(--tint-teal-bg, #f0fdfa)' : 'var(--bg-surface, #ffffff)',
                    borderBottom: isExpanded ? '1px solid var(--tint-teal-border, #99f6e4)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: 12,
                    userSelect: 'none',
                  }}
                >
                  {/* Left: Code, Name, Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={{ color: isExpanded ? 'var(--accent)' : 'var(--text-muted)' }}>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Link
                          href={`/equipment/jobs?job_id=${job.job_id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            fontSize: 13,
                            color: 'var(--accent, #0D9488)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          {job.job_code}
                          <ExternalLink size={10} />
                        </Link>

                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                          background: statusConf.bg, color: statusConf.color,
                        }}>
                          {statusConf.labelJA}
                        </span>

                        {job.job_category && (
                          <span className={catBadge.className} style={{ fontSize: 9 }}>
                            {catBadge.label}
                          </span>
                        )}

                        {isOverrun && (
                          <span style={{
                            fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 4,
                            background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA',
                            display: 'flex', alignItems: 'center', gap: 2,
                          }}>
                            <AlertTriangle size={9} />
                            {t('hoursOverrun')} (+{overrunAmount}h)
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>
                        {job.job_name}
                      </div>
                    </div>
                  </div>

                  {/* Right: Progress Bar & Hours */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                    {/* Progress Bar */}
                    <div style={{ width: 140 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>
                        <span>{t('progressPercent')}</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{progressPct}%</span>
                      </div>
                      <div style={{ height: 6, width: '100%', background: 'var(--border-default, #e2e8f0)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${progressPct}%`,
                          background: isOverrun ? '#DC2626' : (progressPct >= 100 ? '#059669' : 'var(--accent, #0D9488)'),
                          borderRadius: 3,
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                    </div>

                    {/* Hours Metric */}
                    <div style={{ textAlign: 'right', minWidth: 85 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        実績 / 予定
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: isOverrun ? '#DC2626' : 'var(--text-primary)' }}>
                        {actHours.toFixed(1)}h <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>/ {estHours > 0 ? `${estHours.toFixed(1)}h` : '—'}</span>
                      </div>
                    </div>

                    {/* Action: Edit Job */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingJob({
                          job_id: job.job_id,
                          job_code: job.job_code,
                          job_name: job.job_name,
                          job_status: job.job_status,
                          estimated_hours: job.estimated_hours || null,
                          deadline: job.deadline || null,
                        } as any)
                        setIsEditModalOpen(true)
                      }}
                      className="btn btn-secondary"
                      style={{ height: 26, padding: '0 8px', fontSize: 11 }}
                      title="Job編集 (Chỉnh sửa Job)"
                    >
                      <Edit size={11} />
                    </button>
                  </div>
                </div>

                {/* ── Level 2: Accordion Body (Job Steps & Work Logs) ── */}
                {isExpanded && (
                  <div style={{ padding: '12px 14px', background: 'var(--bg-surface, #ffffff)' }}>
                    {/* Steps Container */}
                    {!job.job_steps || job.job_steps.length === 0 ? (
                      <div style={{ padding: 14, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, background: 'var(--bg-surface-2)', borderRadius: 6 }}>
                        工程ステップ未登録 (Chưa có công đoạn nào được gán cho Lệnh SX này)
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          加工工程・ステップ内訳 (Job Steps Breakdown)
                        </div>

                        {job.job_steps.map((step) => {
                          const stepEst = step.estimated_hours || 0
                          const stepAct = step.actual_hours || 0
                          const stepOverrun = stepEst > 0 && stepAct > stepEst

                          return (
                            <div
                              key={step.step_id}
                              style={{
                                border: '1px solid var(--border-default, #e2e8f0)',
                                borderRadius: 6,
                                overflow: 'hidden',
                                background: 'var(--bg-surface-2, #f8fafc)',
                              }}
                            >
                              {/* Step Header */}
                              <div style={{
                                padding: '8px 12px',
                                background: 'var(--bg-surface-3, #f1f5f9)',
                                borderBottom: '1px solid var(--border-default, #e2e8f0)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: 12,
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                  <span style={{
                                    fontFamily: 'monospace', fontWeight: 800, fontSize: 11,
                                    background: 'var(--bg-surface, #ffffff)', padding: '1px 6px',
                                    borderRadius: 4, border: '1px solid var(--border-default)',
                                  }}>
                                    Step #{step.step_no}
                                  </span>
                                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {step.step_name}
                                  </span>
                                  <span className={STATUS_CONFIG[step.step_status || 'PENDING']?.badgeClass || 'badge badge--neutral'} style={{ fontSize: 8 }}>
                                    {step.step_status || 'PENDING'}
                                  </span>
                                  {step.manufacture_location && (
                                    <span style={{ fontSize: 9, color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '1px 6px', borderRadius: 4 }}>
                                      {step.manufacture_location}
                                    </span>
                                  )}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: stepOverrun ? '#DC2626' : 'var(--text-primary)' }}>
                                    {stepAct.toFixed(1)}h {stepEst > 0 && <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>/ {stepEst.toFixed(1)}h</span>}
                                  </span>

                                  <button
                                    onClick={() => {
                                      setActiveLogJobId(job.job_id)
                                      setActiveLogStepId(step.step_id)
                                    }}
                                    className="btn btn-secondary"
                                    style={{ height: 22, padding: '0 8px', fontSize: 10, gap: 3 }}
                                  >
                                    <Plus size={10} /> {t('logWork')}
                                  </button>
                                </div>
                              </div>

                              {/* ── Level 3: Work Logs Table within Step ── */}
                              <div style={{ padding: '8px 12px' }}>
                                {!step.work_logs || step.work_logs.length === 0 ? (
                                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                                    日報未入力 (Chưa có nhật ký làm việc cho bước này)
                                  </div>
                                ) : (
                                  <table className="data-table" style={{ width: '100%', fontSize: 11, background: 'transparent' }}>
                                    <thead>
                                      <tr>
                                        <th style={{ textAlign: 'left', width: 95 }}>作業日 (Date)</th>
                                        <th style={{ textAlign: 'left', width: 140 }}>担当者 (Operator)</th>
                                        <th style={{ textAlign: 'right', width: 85 }}>工数 (Hours)</th>
                                        <th style={{ textAlign: 'center', width: 80 }}>完了判定</th>
                                        <th style={{ textAlign: 'left' }}>作業内容・備考 (Description)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {step.work_logs.map((log) => (
                                        <tr key={log.log_id}>
                                          <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                                            {log.work_date}
                                          </td>
                                          <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                            {log.employees?.employee_name || '担当者不明'}
                                          </td>
                                          <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent, #0D9488)' }}>
                                            {log.hours_spent.toFixed(2)} h
                                          </td>
                                          <td style={{ textAlign: 'center' }}>
                                            {log.is_finished ? (
                                              <span className="badge badge--success" style={{ fontSize: 8 }}>✓ 完了</span>
                                            ) : (
                                              <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>進行中</span>
                                            )}
                                          </td>
                                          <td style={{ color: 'var(--text-secondary)' }}>
                                            {log.description || '—'}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Modals & Drawers ── */}
      {/* 1. Quick Add Repair Job Modal */}
      <QuickAddRepairJobModal
        isOpen={isRepairModalOpen}
        onClose={() => setIsRepairModalOpen(false)}
        productId={productId}
        productCode={code}
        equipment={null}
        onCreated={fetchJobs}
      />

      {/* 2. Edit Job Modal */}
      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingJob(null)
        }}
        job={editingJob}
        onSuccess={fetchJobs}
      />

      {/* 3. Worklog Modal */}
      {activeLogJobId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div style={{
            background: 'var(--bg-surface, #ffffff)', borderRadius: 8,
            maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 20
          }}>
            <WorklogFormShared
              defaultJobId={activeLogJobId}
              initialData={{
                job_id: activeLogJobId,
                job_step_id: activeLogStepId || undefined,
              }}
              mode="modal"
              onSuccess={() => {
                setActiveLogJobId(null)
                setActiveLogStepId(null)
                fetchJobs()
              }}
              onCancel={() => {
                setActiveLogJobId(null)
                setActiveLogStepId(null)
              }}
            />
          </div>
        </div>
      )}

    </div>
  )
}