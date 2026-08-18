'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  Package, Wrench, Hammer, FileText, Building2, Plus,
  ExternalLink, RefreshCw
} from 'lucide-react'
import { getDashboardData, RealDashboardData } from '@/app/actions/dashboard'
import { QuickActionsHub } from './_components/QuickActionsHub'

export default function DashboardPage() {
  const t = useTranslations('Dashboard')

  const [data, setData] = useState<RealDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    const res = await getDashboardData()
    setData(res)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return d.substring(0, 10).replace(/-/g, '/')
  }

  const renderJobStatusBadge = (st: string | null) => {
    const status = st || 'DRAFT'
    if (status === 'COMPLETED') return <span className="badge badge--success">{t('statusCompleted')}</span>
    if (status === 'IN_PROGRESS') return <span className="badge badge--warning">{t('statusInProgress')}</span>
    if (status === 'PLANNED') return <span className="badge badge--info">{t('statusPlanned')}</span>
    return <span className="badge badge--neutral">{status}</span>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: '100%', paddingBottom: 20 }}>
      
      {/* ── Header Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Package size={22} style={{ color: 'var(--accent)' }} />
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)', margin: 0 }}>
              {t('title')}
            </h1>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {t('subtitle')}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={loadData}
            className="btn btn-secondary"
            style={{ height: 30, padding: '0 10px', gap: 4, fontSize: 11 }}
            title={t('updateBtn')}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>{t('updateBtn')}</span>
          </button>
          <Link
            href="/equipment/jobs/quick-create"
            className="btn btn-primary"
            style={{ height: 30, padding: '0 12px', gap: 6, fontSize: 12, textDecoration: 'none' }}
          >
            <Plus size={14} />
            <span>{t('quickCreateBtn')}</span>
          </Link>
          <Link
            href="/worklog"
            className="btn btn-secondary"
            style={{ height: 30, padding: '0 12px', gap: 6, fontSize: 12, textDecoration: 'none' }}
          >
            <FileText size={14} />
            <span>{t('worklogBtn')}</span>
          </Link>
        </div>
      </div>

      {/* ── Row 1: Real KPI Cards (4 Cards with Visual Anchor Tints) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flexShrink: 0 }}>
        
        {/* KPI 1: Products */}
        <div className="card-flat" style={{ padding: '14px 16px', background: 'var(--tint-teal-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-jp)' }}>
              {t('kpiProducts')}
            </span>
            <Package size={16} style={{ color: 'var(--accent)', opacity: 0.8 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.kpis.totalProducts || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {loading ? '' : t('kpiDesignRevisions', { count: (data?.kpis.totalDesignRevisions || 0).toLocaleString() })}
            </span>
          </div>
        </div>

        {/* KPI 2: Physical Molds */}
        <div className="card-flat" style={{ padding: '14px 16px', background: 'var(--tint-blue-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-info)', fontFamily: 'var(--font-jp)' }}>
              {t('kpiPhysicalMolds')}
            </span>
            <Wrench size={16} style={{ color: 'var(--status-info)', opacity: 0.8 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.kpis.totalPhysicalMolds || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {loading ? '' : t('kpiCutters', { count: (data?.kpis.totalCutters || 0).toLocaleString() })}
            </span>
          </div>
        </div>

        {/* KPI 3: Mold Jobs */}
        <div className="card-flat" style={{ padding: '14px 16px', background: 'var(--tint-orange-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-warning)', fontFamily: 'var(--font-jp)' }}>
              {t('kpiJobs')}
            </span>
            <Hammer size={16} style={{ color: 'var(--status-warning)', opacity: 0.8 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.kpis.totalJobs || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {loading ? '' : t('kpiWorklogs', { count: (data?.kpis.totalWorkLogs || 0).toLocaleString() })}
            </span>
          </div>
        </div>

        {/* KPI 4: Companies */}
        <div className="card-flat" style={{ padding: '14px 16px', background: 'var(--tint-purple-bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', fontFamily: 'var(--font-jp)' }}>
              {t('kpiCompanies')}
            </span>
            <Building2 size={16} style={{ color: 'var(--status-success)', opacity: 0.8 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.kpis.totalCompanies || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--status-success)', fontWeight: 600 }}>
              {t('kpiRealAccess')}
            </span>
          </div>
        </div>

      </div>
      {/* ── Row 1.5: Quick Business Action Hub ── */}
      <QuickActionsHub />

      {/* ── Row 2: 4 Real Analytics Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flexShrink: 0 }}>
        
        {/* Widget 1: Job Status */}
        <div className="card-flat" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="card-header-tint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>{t('jobStatusTitle')}</span>
            <span className="badge badge--info" style={{ fontSize: 9 }}>Real</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data?.jobStatusBreakdown.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.status}</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Mold Device Status */}
        <div className="card-flat" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="card-header-tint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>{t('moldStatusTitle')}</span>
            <span className="badge badge--success" style={{ fontSize: 9 }}>Real</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data?.moldStatusBreakdown.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{item.status}</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 3: Asset Ratio */}
        <div className="card-flat" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="card-header-tint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>{t('techAssetsTitle')}</span>
            <span className="badge badge--neutral" style={{ fontSize: 9 }}>Access Data</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>CAD Revisions</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>4,735</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Physical Molds</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>4,751</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Physical Cutters</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>1,283</span>
            </div>
          </div>
        </div>

        {/* Widget 4: Nippo Worklogs */}
        <div className="card-flat" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="card-header-tint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>{t('nippoTitle')}</span>
            <span className="badge badge--warning" style={{ fontSize: 9 }}>Active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('nippoTotalLogs')}</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)' }}>6,980</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('nippoEmployees')}</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>45+</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t('nippoProcesses')}</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>44</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Row 3: Main Layout (Recent Jobs Table + Master System Stats) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, flex: 1, minHeight: 0 }}>
        
        {/* Left: 10 Recent Real Jobs */}
        <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          <div className="card-header-tint" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Hammer size={14} style={{ color: 'var(--accent)' }} />
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>
                {t('recentJobs.title')}
              </h3>
            </div>
            <Link href="/equipment/jobs" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              {t('recentJobs.viewAll')}
            </Link>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 110 }}>{t('recentJobs.colCode')}</th>
                  <th>{t('recentJobs.colName')}</th>
                  <th style={{ width: 120 }}>{t('recentJobs.colMold')}</th>
                  <th style={{ width: 100 }}>{t('recentJobs.colDeadline')}</th>
                  <th style={{ width: 110, textAlign: 'center' }}>{t('recentJobs.colStatus')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)', fontSize: 12 }}>
                      {t('recentJobs.loading')}
                    </td>
                  </tr>
                ) : data?.recentJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)', fontSize: 12 }}>
                      {t('recentJobs.empty')}
                    </td>
                  </tr>
                ) : (
                  data?.recentJobs.map(j => (
                    <tr key={j.job_id} className="hover:bg-[var(--bg-surface-2)] transition-colors">
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        <Link href={`/equipment/jobs/${j.job_id}`} style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          {j.job_code}
                          <ExternalLink size={10} />
                        </Link>
                      </td>
                      <td style={{ fontWeight: 600, fontSize: 12 }}>
                        {j.job_name}
                      </td>
                      <td style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {j.system_code || j.display_name || '—'}
                      </td>
                      <td style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                        {formatDate(j.deadline)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {renderJobStatusBadge(j.job_status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Master System Stats */}
        <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div className="card-header-tint" style={{ padding: '10px 14px' }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>
              {t('systemMasterStats.title')}
            </h3>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
            {([
              ['products', t('systemMasterStats.masterItemProducts'), (data?.kpis.totalProducts || 0).toLocaleString(), t('systemMasterStats.masterItemProductsSub', { count: (data?.kpis.totalProducts || 0).toLocaleString() })],
              ['designs', t('systemMasterStats.masterItemDesigns'), (data?.kpis.totalDesignRevisions || 0).toLocaleString(), t('systemMasterStats.masterItemDesignsSub', { count: (data?.kpis.totalDesignRevisions || 0).toLocaleString() })],
              ['molds', t('systemMasterStats.masterItemMolds'), (data?.kpis.totalPhysicalMolds || 0).toLocaleString(), t('systemMasterStats.masterItemMoldsSub', { count: (data?.kpis.totalPhysicalMolds || 0).toLocaleString() })],
              ['cutters', t('systemMasterStats.masterItemCutters'), (data?.kpis.totalCutters || 0).toLocaleString(), t('systemMasterStats.masterItemCuttersSub', { count: (data?.kpis.totalCutters || 0).toLocaleString() })],
              ['jobs', t('systemMasterStats.masterItemJobs'), (data?.kpis.totalJobs || 0).toLocaleString(), t('systemMasterStats.masterItemJobsSub', { count: (data?.kpis.totalJobs || 0).toLocaleString() })],
              ['worklogs', t('systemMasterStats.masterItemWorklogs'), (data?.kpis.totalWorkLogs || 0).toLocaleString(), t('systemMasterStats.masterItemWorklogsSub', { count: (data?.kpis.totalWorkLogs || 0).toLocaleString() })],
              ['companies', t('systemMasterStats.masterItemCompanies'), (data?.kpis.totalCompanies || 0).toLocaleString(), t('systemMasterStats.masterItemCompaniesSub', { count: (data?.kpis.totalCompanies || 0).toLocaleString() })],
            ] as [string, string, string, string][]).map(([key, label, val, sub], i) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < 6 ? '1px solid var(--border-subtle)' : 'none', paddingBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{sub}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{val}</span>
              </div>
            ))}
          </div>
          
          <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--status-success)', fontWeight: 600 }}>
              <div className="badge-dot badge-dot--success" />
              <span>{t('systemMasterStats.onlineStatus')}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
