'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  Wrench, Hammer, Clock, PlusCircle, ExternalLink,
  CheckCircle2, AlertCircle, Layers, Calendar,
  User, FileText, ChevronRight, Sparkles, RefreshCw, Scissors, Box
} from 'lucide-react'
import Link from 'next/link'
import { QuickAddRepairJobModal } from './QuickAddRepairJobModal'
import { WorklogFormShared } from '@/components/worklogs/WorklogFormShared'

interface TabJobsProps {
  productId: string
}

interface EquipmentItem {
  equipment_id: string
  equipment_code: string
  display_name: string
  equipment_type: string
  device_status?: string | null
  usage_status?: string | null
  physical_stamp?: string | null
  created_at?: string | null
}

interface JobStep {
  step_id: string
  step_no: number
  step_name: string
  arrangement?: string | null
  condition?: string | null
  manufacture_location?: string | null
  estimated_hours?: number | null
  deadline?: string | null
}

interface WorkLogItem {
  log_id: string
  work_date: string
  hours_spent?: number | null
  description?: string | null
  is_finished?: boolean | null
  job_step_id?: string | null
  employees?: {
    employee_name: string
  } | null
  job_steps?: {
    step_name: string
  } | null
}

interface JobItem {
  job_id: string
  job_code: string
  job_name: string
  job_status: string
  job_category?: string | null
  deadline?: string | null
  mold_deadline?: string | null
  ship_date?: string | null
  estimated_hours?: number | null
  responsible_id?: string | null
  notes?: string | null
  created_at: string
  equipment_id?: string | null
  employees?: {
    employee_name: string
  } | null
  job_steps?: JobStep[]
  work_logs?: WorkLogItem[]
  total_actual_hours: number
}

const CATEGORY_BADGE: Record<string, { label: string; className: string }> = {
  NEW: { label: '新規製作', className: 'badge badge--success font-semibold' },
  REPAIR: { label: '改修・修正', className: 'badge badge--warning font-semibold' },
  MAINTENANCE: { label: '定期保守', className: 'badge badge--info font-semibold' },
  REMAKE: { label: '再製作', className: 'badge badge--neutral font-semibold' },
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  NEW: { label: '新規', className: 'badge badge--neutral' },
  NOT_STARTED: { label: '未着手', className: 'badge badge--neutral' },
  IN_PROGRESS: { label: '進行中', className: 'badge badge--info font-semibold' },
  ON_HOLD: { label: '保留', className: 'badge badge--warning' },
  COMPLETED: { label: '完了', className: 'badge badge--success font-semibold' },
  CANCELLED: { label: '中止', className: 'badge badge--error' },
}

export function TabJobs({ productId }: TabJobsProps) {
  const t = useTranslations('ProductCenter')
  const tCommon = useTranslations('Common')
  const supabase = createClient()

  const [productCode, setProductCode] = useState('')
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([])
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Modals state
  const [repairModalEquip, setRepairModalEquip] = useState<EquipmentItem | null>(null)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [targetLogJobId, setTargetLogJobId] = useState<string | undefined>(undefined)

  const loadData = useCallback(async () => {
    if (!productId) return
    setLoading(true)

    try {
      // 1. Fetch Product details
      const { data: prodData } = await supabase
        .from('products')
        .select('product_code, product_name_internal')
        .eq('product_id', productId)
        .single()
      
      if (prodData) {
        setProductCode(prodData.product_code)
      }

      // 2. Fetch Design Revisions of this product
      const { data: revs } = await supabase
        .from('design_revisions')
        .select('revision_id')
        .eq('product_id', productId)

      const revIds = (revs || []).map((r: any) => r.revision_id)

      // 3. Fetch Equipment (Molds, Cutters, Plugs, Bases) associated with this product's revisions
      let equipData: any[] = []
      if (revIds.length > 0) {
        const { data: eq } = await supabase
          .from('equipment')
          .select('equipment_id, equipment_code, display_name, equipment_type, device_status, usage_status, physical_stamp, created_at')
          .in('design_revision_id', revIds)
          .order('equipment_type')
          .order('created_at', { ascending: true })
        if (eq) equipData = eq
      }
      setEquipmentList(equipData)

      const equipIds = equipData.map((e: any) => e.equipment_id)

      // 4. Fetch Jobs for this product / equipment / revisions
      let jobQuery = supabase
        .from('jobs')
        .select(`
          job_id, job_code, job_name, job_status, job_category,
          deadline, mold_deadline, ship_date, estimated_hours,
          responsible_id, notes, created_at, equipment_id,
          employees:responsible_id(employee_name),
          job_steps(step_id, step_no, step_name, arrangement, condition, manufacture_location, estimated_hours, deadline),
          work_logs(log_id, work_date, hours_spent, description, is_finished, job_step_id, employees:employee_id(employee_name), job_steps:job_step_id(step_name))
        `)

      const orConditions = [`product_id.eq.${productId}`]
      if (equipIds.length > 0) {
        orConditions.push(`equipment_id.in.(${equipIds.join(',')})`)
      }
      if (revIds.length > 0) {
        orConditions.push(`design_revision_id.in.(${revIds.join(',')})`)
      }

      const { data: rawJobs, error: jobErr } = await jobQuery
        .or(orConditions.join(','))
        .order('created_at', { ascending: false })

      if (jobErr) throw jobErr

      const mappedJobs: JobItem[] = (rawJobs || []).map((j: any) => {
        const logs: WorkLogItem[] = j.work_logs || []
        const totalActualHours = Math.round(logs.reduce((sum, log) => sum + (log.hours_spent || 0), 0) * 10) / 10

        const sortedSteps = [...(j.job_steps || [])].sort((a, b) => (a.step_no || 0) - (b.step_no || 0))
        const sortedLogs = [...logs].sort((a, b) => new Date(b.work_date).getTime() - new Date(a.work_date).getTime())

        return {
          ...j,
          job_steps: sortedSteps,
          work_logs: sortedLogs,
          total_actual_hours: totalActualHours,
        }
      })

      setJobs(mappedJobs)

      if (mappedJobs.length > 0 && (!selectedJobId || !mappedJobs.some(j => j.job_id === selectedJobId))) {
        setSelectedJobId(mappedJobs[0].job_id)
      }
    } catch (err) {
      console.error('Error loading manufacturing history & jobs:', err)
    } finally {
      setLoading(false)
    }
  }, [productId, supabase, selectedJobId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const selectedJob = jobs.find((j) => j.job_id === selectedJobId) || jobs[0] || null

  // Overall KPI statistics
  const totalActualMachiningHours = Math.round(jobs.reduce((sum, j) => sum + j.total_actual_hours, 0) * 10) / 10
  const totalWorklogsCount = jobs.reduce((sum, j) => sum + (j.work_logs?.length || 0), 0)

  // Group jobs by equipment
  const equipJobGroups = equipmentList.map((equip) => {
    const equipJobs = jobs.filter((j) => j.equipment_id === equip.equipment_id)
    return {
      equip,
      jobs: equipJobs,
    }
  })

  // Jobs that are not assigned to a specific equipment
  const unassignedJobs = jobs.filter(
    (j) => !j.equipment_id || !equipmentList.some((e) => e.equipment_id === j.equipment_id)
  )

  const getEquipIcon = (type: string) => {
    switch (type) {
      case 'MOLD':
        return <Wrench size={14} style={{ color: 'var(--accent)' }} />
      case 'CUTTER_SEPARATE':
      case 'CUTTER_INLINE':
        return <Scissors size={14} style={{ color: '#D97706' }} />
      case 'PLUG':
        return <Box size={14} style={{ color: '#8B5CF6' }} />
      default:
        return <Layers size={14} style={{ color: 'var(--text-muted)' }} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10, padding: 12 }}>
      {/* ── Top Summary Header ── */}
      <div
        className="card-flat"
        style={{
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          background: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: 'var(--tint-orange-bg)',
                border: '1px solid var(--tint-orange-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--tint-orange-text)',
              }}
            >
              <Hammer size={18} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                {t('tabJobsLabel')}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {t('equipmentLifecycle')}
              </div>
            </div>
          </div>

          <div style={{ height: 24, width: 1, background: 'var(--border-default)' }} />

          {/* Quick Metrics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600 }}>
                登録設備数
              </div>
              <div className="font-mono" style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                {equipmentList.length} <span style={{ fontSize: 10, fontWeight: 500 }}>点</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600 }}>
                総ジョブ数
              </div>
              <div className="font-mono" style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>
                {jobs.length} <span style={{ fontSize: 10, fontWeight: 500 }}>件</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600 }}>
                {t('totalActualHours')}
              </div>
              <div className="font-mono" style={{ fontSize: 14, fontWeight: 800, color: 'var(--accent)' }}>
                {totalActualMachiningHours} <span style={{ fontSize: 10, fontWeight: 500 }}>h</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600 }}>
                日報記録数
              </div>
              <div className="font-mono" style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-secondary)' }}>
                {totalWorklogsCount} <span style={{ fontSize: 10, fontWeight: 500 }}>件</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Action Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className="btn btn-secondary cursor-pointer"
            onClick={loadData}
            style={{ fontSize: 11, padding: '4px 10px', height: 28, gap: 4 }}
          >
            <RefreshCw size={12} />
            <span>更新</span>
          </button>

          <button
            type="button"
            className="btn btn-primary cursor-pointer"
            onClick={() => {
              setTargetLogJobId(selectedJobId || (jobs.length > 0 ? jobs[0].job_id : undefined))
              setIsLogModalOpen(true)
            }}
            style={{ fontSize: 11, padding: '4px 12px', height: 28, gap: 4 }}
          >
            <Clock size={13} />
            <span>📝 {t('logWork')}</span>
          </button>
        </div>
      </div>

      {/* ── Main 2-Column Area ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', gap: 12, flex: 1, minHeight: 0 }}>
        {/* ── LEFT COLUMN: Equipment & Jobs Tree ── */}
        <div
          className="card-flat"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'var(--bg-surface)',
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--border-default)',
              background: 'var(--tint-teal-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={14} style={{ color: 'var(--accent)' }} />
              <span>設備別加工履歴 (Equipment Timeline)</span>
            </div>
            <Link
              href={`/equipment/jobs/quick-create?product_id=${productId}`}
              style={{
                fontSize: 11,
                color: 'var(--accent)',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <PlusCircle size={12} />
              <span>+ 新規工程作成</span>
            </Link>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {loading ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                {t('loadingData')}
              </div>
            ) : equipmentList.length === 0 && unassignedJobs.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                {t('noData')}
              </div>
            ) : (
              <>
                {/* Equipment Cards with nested Job Timelines */}
                {equipJobGroups.map(({ equip, jobs: equipJobs }) => {
                  return (
                    <div
                      key={equip.equipment_id}
                      style={{
                        border: '1px solid var(--border-default)',
                        borderRadius: 6,
                        background: '#fff',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Equipment Header Bar */}
                      <div
                        style={{
                          padding: '8px 10px',
                          background: 'var(--bg-muted, #F8FAFC)',
                          borderBottom: '1px solid var(--border-default)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 6,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
                          {getEquipIcon(equip.equipment_type)}
                          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                            {equip.display_name || equip.equipment_code}
                          </span>
                          <span
                            className="font-mono text-[10px]"
                            style={{ color: 'var(--text-muted)', background: '#fff', padding: '1px 4px', borderRadius: 3, border: '1px solid var(--border-default)' }}
                          >
                            {equip.equipment_type}
                          </span>
                        </div>

                        {/* Button to add repair/maintenance job on this specific equipment */}
                        <button
                          type="button"
                          className="btn btn-secondary cursor-pointer"
                          onClick={() => setRepairModalEquip(equip)}
                          style={{
                            fontSize: 10.5,
                            padding: '2px 6px',
                            height: 22,
                            gap: 3,
                            color: 'var(--tint-orange-text)',
                            borderColor: 'var(--tint-orange-border)',
                          }}
                        >
                          <Wrench size={10} />
                          <span>+ 改修/保守</span>
                        </button>
                      </div>

                      {/* Jobs Timeline under this Equipment */}
                      <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {equipJobs.length === 0 ? (
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '6px 4px', fontStyle: 'italic' }}>
                            {t('noJobsForEquip')}
                          </div>
                        ) : (
                          equipJobs.map((job) => {
                            const isSelected = selectedJobId === job.job_id
                            const catConfig = CATEGORY_BADGE[job.job_category || 'NEW'] || CATEGORY_BADGE.NEW
                            const statusConfig = STATUS_BADGE[job.job_status] || STATUS_BADGE.NOT_STARTED

                            return (
                              <div
                                key={job.job_id}
                                onClick={() => setSelectedJobId(job.job_id)}
                                style={{
                                  padding: '8px 10px',
                                  borderRadius: 4,
                                  border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
                                  background: isSelected ? 'var(--tint-teal-bg)' : '#FAFAFA',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span
                                      className="font-mono text-[12px] font-bold"
                                      style={{ color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}
                                    >
                                      {job.job_code}
                                    </span>
                                    <span className={catConfig.className} style={{ fontSize: 9.5 }}>
                                      {catConfig.label}
                                    </span>
                                  </div>
                                  <span className={statusConfig.className} style={{ fontSize: 9.5 }}>
                                    {statusConfig.label}
                                  </span>
                                </div>

                                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                                  {job.job_name}
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Calendar size={11} />
                                    <span className="font-mono">{job.mold_deadline || job.deadline || '—'}</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={11} />
                                    <span className="font-mono font-bold" style={{ color: job.total_actual_hours > 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
                                      {job.total_actual_hours}h
                                    </span>
                                    {job.estimated_hours ? (
                                      <span className="font-mono" style={{ fontSize: 10 }}>/ {job.estimated_hours}h</span>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Unassigned / General Product Jobs */}
                {unassignedJobs.length > 0 && (
                  <div
                    style={{
                      border: '1px solid var(--border-default)',
                      borderRadius: 6,
                      background: '#fff',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        padding: '8px 10px',
                        background: '#F1F5F9',
                        borderBottom: '1px solid var(--border-default)',
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      📁 その他 / 全般ジョブ ({unassignedJobs.length})
                    </div>
                    <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {unassignedJobs.map((job) => {
                        const isSelected = selectedJobId === job.job_id
                        const statusConfig = STATUS_BADGE[job.job_status] || STATUS_BADGE.NOT_STARTED

                        return (
                          <div
                            key={job.job_id}
                            onClick={() => setSelectedJobId(job.job_id)}
                            style={{
                              padding: '8px 10px',
                              borderRadius: 4,
                              border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
                              background: isSelected ? 'var(--tint-teal-bg)' : '#FAFAFA',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span className="font-mono text-[12px] font-bold" style={{ color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                                {job.job_code}
                              </span>
                              <span className={statusConfig.className} style={{ fontSize: 9.5 }}>
                                {statusConfig.label}
                              </span>
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                              {job.job_name}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Selected Job Detail & Worklogs ── */}
        <div
          className="card-flat"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            background: 'var(--bg-surface)',
          }}
        >
          {selectedJob ? (
            <>
              {/* Job Header Info */}
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-default)',
                  background: 'var(--tint-blue-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <Link
                      href={`/equipment/jobs/${selectedJob.job_id}`}
                      className="font-mono text-[14px] font-extrabold"
                      style={{ color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <span>{selectedJob.job_code}</span>
                      <ExternalLink size={12} />
                    </Link>
                    <span className={STATUS_BADGE[selectedJob.job_status]?.className || 'badge badge--neutral'} style={{ fontSize: 10 }}>
                      {STATUS_BADGE[selectedJob.job_status]?.label || selectedJob.job_status}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedJob.job_name}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-primary cursor-pointer"
                    onClick={() => {
                      setTargetLogJobId(selectedJob.job_id)
                      setIsLogModalOpen(true)
                    }}
                    style={{ fontSize: 11, padding: '4px 12px', height: 28, gap: 4 }}
                  >
                    <Clock size={12} />
                    <span>📝 {t('logWork')}</span>
                  </button>
                </div>
              </div>

              {/* Job Key Meta Details */}
              <div
                style={{
                  padding: '8px 16px',
                  borderBottom: '1px solid var(--border-default)',
                  background: '#fff',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 12,
                  fontSize: 11,
                }}
              >
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>担当者</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {selectedJob.employees?.employee_name || '—'}
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>金型納期 / 期日</div>
                  <div className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                    {selectedJob.mold_deadline || selectedJob.deadline || '—'}
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t('estimatedHours')}</div>
                  <div className="font-mono font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {selectedJob.estimated_hours ? `${selectedJob.estimated_hours} h` : '—'}
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{t('totalActualHours')}</div>
                  <div className="font-mono font-extrabold" style={{ color: 'var(--accent)' }}>
                    {selectedJob.total_actual_hours} h
                  </div>
                </div>
              </div>

              {/* Notes or instructions if any */}
              {selectedJob.notes && (
                <div style={{ padding: '8px 16px', background: '#F8FAFC', borderBottom: '1px solid var(--border-default)', fontSize: 11 }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>指示・備考: </span>
                  <span style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{selectedJob.notes}</span>
                </div>
              )}

              {/* Scrollable Steps & Logs */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* 1. Job Steps Section */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Layers size={13} style={{ color: 'var(--accent)' }} />
                    <span>{t('jobSteps')} ({(selectedJob.job_steps || []).length})</span>
                  </div>

                  {(selectedJob.job_steps || []).length === 0 ? (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '6px 0' }}>
                      工程ステップが定義されていません
                    </div>
                  ) : (
                    <table className="data-table" style={{ fontSize: 11 }}>
                      <thead>
                        <tr>
                          <th style={{ width: 40 }}>No</th>
                          <th>工程名</th>
                          <th style={{ width: 70 }}>手配/状態</th>
                          <th style={{ width: 70 }}>製造場所</th>
                          <th style={{ width: 70 }}>予定工数</th>
                          <th style={{ width: 90 }}>納期</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedJob.job_steps?.map((step) => (
                          <tr key={step.step_id}>
                            <td className="font-mono text-center font-bold">{step.step_no}</td>
                            <td style={{ fontWeight: 600 }}>{step.step_name}</td>
                            <td>
                              <span style={{ fontSize: 10, color: step.condition === 'NEW' ? 'var(--accent)' : 'var(--text-muted)' }}>
                                {step.condition === 'NEW' ? '新規' : '流用/既存'}
                              </span>
                            </td>
                            <td>
                              <span style={{ fontSize: 10 }}>
                                {step.manufacture_location === 'OUTSOURCED' ? '外注' : '内製'}
                              </span>
                            </td>
                            <td className="font-mono text-right">
                              {step.estimated_hours ? `${step.estimated_hours}h` : '—'}
                            </td>
                            <td className="font-mono text-center">
                              {step.deadline || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* 2. Work Logs Section */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Clock size={13} style={{ color: 'var(--accent)' }} />
                      <span>{t('workLogHistory')} ({(selectedJob.work_logs || []).length})</span>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary cursor-pointer"
                      onClick={() => {
                        setTargetLogJobId(selectedJob.job_id)
                        setIsLogModalOpen(true)
                      }}
                      style={{ fontSize: 10.5, padding: '2px 8px', height: 22, gap: 3 }}
                    >
                      <PlusCircle size={11} />
                      <span>日報を追加</span>
                    </button>
                  </div>

                  {(selectedJob.work_logs || []).length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, background: '#FAFAFA', borderRadius: 6 }}>
                      — 作業ログはありません —
                    </div>
                  ) : (
                    <table className="data-table" style={{ fontSize: 11 }}>
                      <thead>
                        <tr>
                          <th style={{ width: 85 }}>作業日</th>
                          <th style={{ width: 90 }}>作業者</th>
                          <th style={{ width: 110 }}>対象工程</th>
                          <th style={{ width: 60, textAlign: 'right' }}>工数</th>
                          <th>作業内容・備考</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedJob.work_logs?.map((log) => {
                          const hours = log.hours_spent || 0
                          return (
                            <tr key={log.log_id}>
                              <td className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                                {log.work_date}
                              </td>
                              <td style={{ fontWeight: 600 }}>
                                {log.employees?.employee_name || '—'}
                              </td>
                              <td style={{ color: 'var(--text-secondary)' }}>
                                {log.job_steps?.step_name || '—'}
                              </td>
                              <td className="font-mono text-right font-bold" style={{ color: 'var(--accent)' }}>
                                {hours}h
                              </td>
                              <td style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                                {log.description || '—'}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>
              ジョブを選択してください
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Add Repair / Maintenance Job Modal ── */}
      {repairModalEquip && (
        <QuickAddRepairJobModal
          isOpen={!!repairModalEquip}
          onClose={() => setRepairModalEquip(null)}
          productId={productId}
          productCode={productCode}
          equipment={repairModalEquip}
          onCreated={loadData}
        />
      )}

      {/* ── Modal Worklog Entry Form ── */}
      {isLogModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsLogModalOpen(false) }}
        >
          <div
            style={{
              width: '100%', maxWidth: 640,
              background: 'var(--bg-surface)',
              borderRadius: 8,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}
          >
            <WorklogFormShared
              mode="modal"
              defaultJobId={targetLogJobId}
              onSuccess={() => {
                setIsLogModalOpen(false)
                loadData()
              }}
              onCancel={() => setIsLogModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}