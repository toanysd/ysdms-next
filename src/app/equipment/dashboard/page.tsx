'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import {
  Wrench, Layers, AlertCircle, Settings, FileEdit, Truck,
  BarChart2, Plus, Calendar, Clock, AlertTriangle, Link2,
  CheckCircle2, RefreshCw, ChevronRight, ExternalLink, Zap
} from 'lucide-react'
import { getEquipmentDashboardData, EquipmentDashboardData } from '@/app/actions/dashboard'
import { QuickLinkMoldModal } from '@/components/equipment/QuickLinkMoldModal'

export default function ToolingDashboard() {
  const t = useTranslations('Equipment.Dashboard')
  const locale = useLocale()

  const [data, setData] = useState<EquipmentDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterMode, setFilterMode] = useState<'TODAY_WEEK' | 'IN_PROGRESS' | 'NEWEST' | 'DEADLINE'>('TODAY_WEEK')
  const [linkMoldModalJob, setLinkMoldModalJob] = useState<{ jobId: string; jobCode: string; jobName: string } | null>(null)

  const loadData = useCallback(async (mode: 'TODAY_WEEK' | 'IN_PROGRESS' | 'NEWEST' | 'DEADLINE' = filterMode) => {
    setLoading(true)
    const res = await getEquipmentDashboardData(mode)
    setData(res)
    setLoading(false)
  }, [filterMode])

  useEffect(() => {
    loadData(filterMode)
  }, [filterMode, loadData])

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return d.substring(0, 10).replace(/-/g, '/')
  }

  // ── Deadline Color-Coding (Mức độ từ gần đến xa & Fix logic cho status COMPLETED) ──
  const getDeadlineBadgeStyle = (deadlineStr: string | null, jobStatus?: string | null) => {
    // 🟢 Nếu Job đã HOÀN THÀNH (COMPLETED) -> Hiển thị badge Hoàn thành an toàn, không báo Quá hạn
    if (jobStatus === 'COMPLETED') {
      return {
        bg: 'color-mix(in srgb, var(--status-success) 15%, transparent)',
        color: 'var(--status-success)',
        border: '1px solid var(--status-success)',
        label: '🟢 完了'
      }
    }

    if (!deadlineStr) {
      return {
        bg: 'var(--bg-surface-3)', color: 'var(--text-muted)', border: '1px solid var(--border-default)', label: '—'
      }
    }

    const today = new Date('2026-07-30')
    const deadline = new Date(deadlineStr)
    const diffTime = deadline.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return {
        bg: 'color-mix(in srgb, var(--status-error) 15%, transparent)',
        color: 'var(--status-error)',
        border: '1px solid var(--status-error)',
        label: `🔴 超過 ${Math.abs(diffDays)}日`
      }
    } else if (diffDays <= 7) {
      return {
        bg: 'color-mix(in srgb, var(--status-warning) 18%, transparent)',
        color: 'var(--status-warning)',
        border: '1px solid var(--status-warning)',
        label: `🟧 残り ${diffDays}日 (至急)`
      }
    } else if (diffDays <= 30) {
      return {
        bg: 'color-mix(in srgb, var(--status-info) 18%, transparent)',
        color: 'var(--status-info)',
        border: '1px solid var(--status-info)',
        label: `🟦 残り ${diffDays}日`
      }
    } else {
      return {
        bg: 'color-mix(in srgb, var(--status-success) 18%, transparent)',
        color: 'var(--status-success)',
        border: '1px solid var(--status-success)',
        label: `🟩 残り ${diffDays}日`
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: '100%', paddingBottom: 16 }}>
      
      {/* ── Page Header & Quick Navigation Buttons (Ultra-Compact) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, paddingBottom: 2 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <h1 style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)', margin: 0 }}>
            {t('title')}
          </h1>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {t('subtitle')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => loadData(filterMode)}
            className="btn btn-secondary"
            style={{ height: 26, padding: '0 8px', gap: 4, fontSize: 10 }}
            title={t('refresh')}
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            <span>{t('refresh')}</span>
          </button>
          <Link
            href="/equipment/schedule"
            className="btn btn-primary"
            style={{ height: 26, padding: '0 10px', gap: 4, fontSize: 11, textDecoration: 'none', background: 'var(--accent)' }}
          >
            <BarChart2 size={12} />
            <span>{t('ganttChart')}</span>
          </Link>
          <Link
            href="/equipment/jobs/quick-create"
            className="btn btn-secondary"
            style={{ height: 26, padding: '0 10px', gap: 4, fontSize: 11, textDecoration: 'none' }}
          >
            <Plus size={12} />
            <span>{t('quickCreate')}</span>
          </Link>
        </div>
      </div>

      {/* ── Row 1: Streamlined 4 KPI Cards (Compact Row Height) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, flexShrink: 0 }}>
        
        {/* KPI 1: Overdue Jobs */}
        <div className="card-flat" style={{ padding: '8px 12px', borderTop: '2px solid var(--status-error)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--status-error)', fontFamily: 'var(--font-jp)' }}>
              {t('kpis.overdue')}
            </span>
            <AlertCircle size={14} style={{ color: 'var(--status-error)', opacity: 0.9 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.overdueJobsCount || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--status-error)', fontWeight: 600 }}>
              {t('kpis.overdueSub')}
            </span>
          </div>
        </div>

        {/* KPI 2: Active Jobs */}
        <div className="card-flat" style={{ padding: '8px 12px', borderTop: '2px solid var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-jp)' }}>
              {t('kpis.active')}
            </span>
            <Wrench size={14} style={{ color: 'var(--accent)', opacity: 0.9 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.activeJobsCount || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {t('kpis.activeSub')}
            </span>
          </div>
        </div>

        {/* KPI 3: Unlinked Jobs */}
        <div className="card-flat" style={{ padding: '8px 12px', borderTop: '2px solid var(--status-warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--status-warning)', fontFamily: 'var(--font-jp)' }}>
              {t('kpis.unlinked')}
            </span>
            <AlertTriangle size={14} style={{ color: 'var(--status-warning)', opacity: 0.9 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.unlinkedJobsCount || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--status-warning)', fontWeight: 600 }}>
              {t('kpis.unlinkedSub')}
            </span>
          </div>
        </div>

        {/* KPI 4: Cutters & Equipment */}
        <div className="card-flat" style={{ padding: '8px 12px', borderTop: '2px solid var(--status-success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--status-success)', fontFamily: 'var(--font-jp)' }}>
              {t('kpis.cutters')}
            </span>
            <Layers size={14} style={{ color: 'var(--status-success)', opacity: 0.9 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.totalCuttersCount || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {t('kpis.cuttersSub')}
            </span>
          </div>
        </div>

      </div>

      {/* ── Row 2: Rebalanced 2 Panels Layout (68% Main Jobs | 32% Side Panels) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '68% 32%', gap: 10, flex: 1, minHeight: 0 }}>
        
        {/* Main Panel: Active Jobs & Production Schedule */}
        <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Wrench size={14} style={{ color: 'var(--accent)' }} />
                <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>
                  {t('priorityJobs.title')}
                </h3>
              </div>
              <Link href="/equipment/schedule" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>{t('priorityJobs.ganttLink')}</span>
                <ChevronRight size={12} />
              </Link>
            </div>

            {/* Filter Mode Tabs (Default: TODAY_WEEK) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`btn ${filterMode === 'TODAY_WEEK' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ height: 22, padding: '0 8px', fontSize: 10, fontWeight: 600 }}
                onClick={() => setFilterMode('TODAY_WEEK')}
              >
                {t('priorityJobs.tabSchedule')}
              </button>
              <button
                type="button"
                className={`btn ${filterMode === 'IN_PROGRESS' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ height: 22, padding: '0 8px', fontSize: 10, fontWeight: 600 }}
                onClick={() => setFilterMode('IN_PROGRESS')}
              >
                {t('priorityJobs.tabInProgress')}
              </button>
              <button
                type="button"
                className={`btn ${filterMode === 'NEWEST' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ height: 22, padding: '0 8px', fontSize: 10, fontWeight: 600 }}
                onClick={() => setFilterMode('NEWEST')}
              >
                {t('priorityJobs.tabNewest')}
              </button>
              <button
                type="button"
                className={`btn ${filterMode === 'DEADLINE' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ height: 22, padding: '0 8px', fontSize: 10, fontWeight: 600 }}
                onClick={() => setFilterMode('DEADLINE')}
              >
                {t('priorityJobs.tabDeadline')}
              </button>
            </div>
          </div>

          <div className="custom-scrollbar" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
                Loading...
              </div>
            ) : data?.activeJobs.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
                {t('priorityJobs.noActive')}
              </div>
            ) : (
              (data?.activeJobs || []).map((job: any) => {
                const deadlineBadge = getDeadlineBadgeStyle(job.deadline, job.job_status)
                return (
                  <div
                    key={job.job_id}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid var(--border-default)',
                      background: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    {/* Left: Job Code & Name & Mold */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                        [{job.job_code}]
                      </span>
                      <Link
                        href={`/equipment/jobs/${job.job_id}`}
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          fontFamily: 'var(--font-jp)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {job.job_name}
                      </Link>
                      <span className="badge badge--info" style={{ fontSize: 9, padding: '1px 6px', flexShrink: 0 }}>
                        {job.mold_name || 'Mold'}
                      </span>
                    </div>

                    {/* Middle: Progress Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: 110, flexShrink: 0 }}>
                      <div style={{ flex: 1, height: 4, background: 'var(--bg-surface-3)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${job.overall_progress || 0}%`, background: 'var(--accent)' }} />
                      </div>
                      <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 600 }}>{job.overall_progress || 0}%</span>
                    </div>

                    {/* Right: Status & Deadline Pill */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        Status: <strong style={{ color: 'var(--text-primary)' }}>{job.job_status}</strong>
                      </span>
                      <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: deadlineBadge.bg, color: deadlineBadge.color, border: deadlineBadge.border, fontWeight: 700 }}>
                        {deadlineBadge.label}
                      </span>
                      <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {formatDate(job.deadline)}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Side Panel Stack: Column 2 (Unlinked) & Column 3 (Teflon) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          
          {/* Side Widget 1: Unlinked Molds Alert */}
          <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', padding: 0, flex: 1, overflow: 'hidden' }}>
            <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-default)', background: 'color-mix(in srgb, var(--status-warning) 8%, var(--bg-surface-2))', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} style={{ color: 'var(--status-warning)' }} />
                <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>
                  {t('unlinkedJobs.title')}
                </h3>
              </div>
              <span className="badge badge--warning" style={{ fontSize: 9 }}>
                {data?.unlinkedJobsCount || 0} Job
              </span>
            </div>

            <div className="custom-scrollbar" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: 15, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
                  Loading...
                </div>
              ) : data?.unlinkedJobs.length === 0 ? (
                <div style={{ padding: 15, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>
                  {t('unlinkedJobs.allLinked')}
                </div>
              ) : (
                (data?.unlinkedJobs || []).map((j: any) => (
                  <div
                    key={j.job_id}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 6,
                      border: '1px solid var(--border-default)',
                      background: 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                        [{j.job_code}] {j.job_name}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>
                        {t('unlinkedJobs.deadline')}: {formatDate(j.deadline)}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ height: 22, padding: '0 6px', fontSize: 9, color: 'var(--accent)', fontWeight: 600, gap: 3 }}
                      onClick={() => setLinkMoldModalJob({ jobId: j.job_id, jobCode: j.job_code, jobName: j.job_name })}
                    >
                      <Link2 size={10} />
                      <span>{t('unlinkedJobs.linkBtn')}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Side Widget 2: Teflon & Auxiliary Equipment */}
          <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', padding: 0, flex: '0 0 auto', overflow: 'hidden' }}>
            <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Settings size={14} style={{ color: 'var(--status-info)' }} />
                <h3 style={{ margin: 0, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>
                  {t('surfaceTreatment.title')}
                </h3>
              </div>
            </div>

            <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ padding: '6px 8px', borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {t('surfaceTreatment.teflonTitle')}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--text-secondary)' }}>
                    {t('surfaceTreatment.teflonDesc')}
                  </div>
                </div>
              </div>

              <div style={{ padding: '6px 8px', borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {t('surfaceTreatment.cuttersTitle')}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)' }}>
                  {t('surfaceTreatment.cuttersUnit')}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Quick Link Mold Modal */}
      {linkMoldModalJob && (
        <QuickLinkMoldModal
          jobId={linkMoldModalJob.jobId}
          jobCode={linkMoldModalJob.jobCode}
          jobName={linkMoldModalJob.jobName}
          onClose={() => setLinkMoldModalJob(null)}
          onSuccess={() => loadData(filterMode)}
        />
      )}

    </div>
  )
}
