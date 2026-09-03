'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  Package, Wrench, Hammer, FileText, Building2, Plus,
  ExternalLink, RefreshCw, BarChart3, TrendingUp,
  AlertTriangle, CheckCircle2, Clock, DollarSign,
  CreditCard, ShieldAlert, Sparkles, Layers, ArrowRight,
  Factory, Eye
} from 'lucide-react'
import { getDashboardData, ExecutiveDashboardData } from '@/app/actions/dashboard'

export default function ExecutiveDashboardPage() {
  const t = useTranslations('Dashboard')
  const [data, setData] = useState<ExecutiveDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoMode, setDemoMode] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getDashboardData()
      setData(res)
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return d.substring(0, 10).replace(/-/g, '/')
  }

  const renderJobStatusBadge = (st: string | null) => {
    const status = (st || 'DRAFT').toUpperCase()
    if (status === 'COMPLETED') return <span className="badge badge--success">{t('statusCompleted')}</span>
    if (status === 'IN_PROGRESS') return <span className="badge badge--warning">{t('statusInProgress')}</span>
    if (status === 'PLANNED') return <span className="badge badge--info">{t('statusPlanned')}</span>
    return <span className="badge badge--neutral">{status}</span>
  }

  // Determine active financial dataset (Real vs Demo)
  const activeFinance = demoMode
    ? data?.demoFinanceOverview
    : data?.financeOverview

  const hasRealFinanceData = (data?.financeOverview?.totalInvoicesCount || 0) > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: '100%', paddingBottom: 24 }}>
      
      {/* ── Demo Mode Warning Banner (Pinned when active) ── */}
      {demoMode && (
        <div
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            background: 'linear-gradient(90deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(217, 119, 6, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} style={{ color: '#D97706', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>
              {t('demoWarningBadge')}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDemoMode(false)}
            style={{
              background: '#D97706',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 4,
              padding: '2px 10px',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('turnOffDemo')}
          </button>
        </div>
      )}

      {/* ── 1. Page Header Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--tint-teal-bg, #F0FDFA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #CCFBF1',
            }}
          >
            <BarChart3 size={20} style={{ color: 'var(--accent, #0D9488)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary, #0F172A)', margin: 0 }}>
              {t('executiveTitle')}
            </h1>
            <span style={{ fontSize: 11, color: 'var(--text-muted, #64748B)' }}>
              {t('executiveSubtitle')}
            </span>
          </div>
        </div>

        {/* Header Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Demo Mode Toggle Switch */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 20,
              background: demoMode ? '#FEF3C7' : '#F1F5F9',
              border: demoMode ? '1px solid #FCD34D' : '1px solid #E2E8F0',
              cursor: 'pointer',
            }}
            onClick={() => setDemoMode(!demoMode)}
            title={t('demoToggleTooltip')}
          >
            <Eye size={13} style={{ color: demoMode ? '#D97706' : '#64748B' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: demoMode ? '#92400E' : '#475569' }}>
              {demoMode ? t('demoActive') : t('demoToggle')}
            </span>
          </div>

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
            href="/orders/quotations"
            className="btn btn-secondary"
            style={{ height: 30, padding: '0 12px', gap: 6, fontSize: 12, textDecoration: 'none' }}
          >
            <FileText size={14} />
            <span>{t('createQuotationBtn')}</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 🏭 TẦNG 1: SẢN XUẤT, THIẾT BỊ & NĂNG SUẤT XƯỞNG (Live DB 100%)       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0 0 0' }}>
          <Factory size={15} style={{ color: 'var(--accent)' }} />
          <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            {t('tier1Title')}
          </h2>
          <span className="badge badge--success" style={{ fontSize: 10, padding: '1px 6px' }}>
            {t('liveDbBadge')}
          </span>
        </div>

        {/* 4 KPI Cards (Manufacturing & Equipment) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flexShrink: 0 }}>
          {/* KPI 1: Products & Design Revisions */}
          <div className="card-flat" style={{ padding: '12px 14px', background: 'var(--tint-teal-bg, #F0FDFA)', border: '1px solid #CCFBF1' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent, #0D9488)' }}>
                {t('kpiProducts')}
              </span>
              <Package size={16} style={{ color: 'var(--accent)', opacity: 0.8 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
                {data?.kpis.totalProducts?.toLocaleString() || '—'}
              </span>
              <span style={{ fontSize: 11, color: '#64748B' }}>
                {data?.kpis.totalDesignRevisions?.toLocaleString() || '—'} {t('revisionsUnit')}
              </span>
            </div>
          </div>

          {/* KPI 2: Unified Equipment (8 Types ADR-001) */}
          <div className="card-flat" style={{ padding: '12px 14px', background: 'var(--tint-blue-bg, #EFF6FF)', border: '1px solid #DBEAFE' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB' }}>
                {t('kpiEquipment')}
              </span>
              <Wrench size={16} style={{ color: '#2563EB', opacity: 0.8 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
                {data?.kpis.totalEquipment?.toLocaleString() || '—'}
              </span>
              <span style={{ fontSize: 11, color: '#64748B' }}>
                {data?.kpis.totalPhysicalMolds?.toLocaleString() || '—'} {t('moldsUnit')}
              </span>
            </div>
          </div>

          {/* KPI 3: Processing Jobs */}
          <div className="card-flat" style={{ padding: '12px 14px', background: 'var(--tint-orange-bg, #FFFBEB)', border: '1px solid #FDE68A' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706' }}>
                {t('kpiJobs')}
              </span>
              <Hammer size={16} style={{ color: '#D97706', opacity: 0.8 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
                {data?.kpis.totalJobs?.toLocaleString() || '—'}
              </span>
              <span style={{ fontSize: 11, color: '#D97706', fontWeight: 600 }}>
                {data?.jobStatusBreakdown?.find((j) => j.status === 'IN_PROGRESS')?.count || 0} {t('inProgressUnit')}
              </span>
            </div>
          </div>

          {/* KPI 4: WorkLogs & Logged Hours */}
          <div className="card-flat" style={{ padding: '12px 14px', background: 'var(--tint-purple-bg, #FAF5FF)', border: '1px solid #F3E8FF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED' }}>
                {t('kpiWorkHours')}
              </span>
              <Clock size={16} style={{ color: '#7C3AED', opacity: 0.8 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
                {data?.kpis.totalWorkHours?.toLocaleString() || '—'}
              </span>
              <span style={{ fontSize: 11, color: '#64748B' }}>
                {data?.kpis.totalWorkLogs?.toLocaleString() || '—'} {t('workLogsUnit')}
              </span>
            </div>
          </div>
        </div>

        {/* Work Order Status Cards (M11-S1) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, flexShrink: 0 }}>
          {/* Card 1: IN_PROGRESS */}
          <div className="card-flat" style={{ padding: '10px 14px', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706' }}>
                製造指示中 (In Progress)
              </span>
              <span className="badge badge--warning" style={{ fontSize: 10 }}>IN_PROGRESS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: '#92400E' }}>
                {data?.workOrderKPIs?.inProgressCount ?? 0}
              </span>
              <span style={{ fontSize: 11, color: '#B45309', fontWeight: 600 }}>件 進行中</span>
            </div>
          </div>

          {/* Card 2: READY_FOR_PRODUCTION */}
          <div className="card-flat" style={{ padding: '10px 14px', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>
                出荷準備完了 (Ready for Production)
              </span>
              <span className="badge badge--success" style={{ fontSize: 10 }}>READY_FOR_PRD</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: '#065F46' }}>
                {data?.workOrderKPIs?.readyForProductionCount ?? 0}
              </span>
              <span style={{ fontSize: 11, color: '#047857', fontWeight: 600 }}>件 成型スタンバイ</span>
            </div>
          </div>

          {/* Card 3: PLANNED / UNPROCESSED */}
          <div className="card-flat" style={{ padding: '10px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#475569' }}>
                未着手・計画中 (Planned)
              </span>
              <span className="badge badge--neutral" style={{ fontSize: 10 }}>PLANNED</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 800, fontFamily: 'monospace', color: '#334155' }}>
                {data?.workOrderKPIs?.plannedCount ?? 0}
              </span>
              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>件 計画待機</span>
            </div>
          </div>
        </div>

        {/* Row 2: Widget 1 (Equipment Types 8 ADR-001) & Widget 2 (Jobs Status & Progress) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
          
          {/* Widget 1: Equipment Breakdown by 8 Types */}
          <div className="card-flat" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                {t('widgetEquipmentDistribution')}
              </span>
              <Link href="/equipment/unified" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <span>{t('viewAll')}</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {(data?.equipmentBreakdown || []).map((eq) => (
                <div
                  key={eq.type}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>
                      {eq.typeNameJA}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
                      {eq.count}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, Math.round((eq.activeCount / Math.max(1, eq.count)) * 100))}%`,
                        height: '100%',
                        background: 'var(--accent, #0D9488)',
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: '#64748B' }}>
                    <span>{t('activeStatus')}: {eq.activeCount}</span>
                    {eq.maintenanceCount > 0 && (
                      <span style={{ color: '#D97706', fontWeight: 600 }}>
                        {t('maintenanceStatus')}: {eq.maintenanceCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 2: Jobs Status & Recent Active Jobs */}
          <div className="card-flat" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                {t('widgetRecentJobs')}
              </span>
              <Link href="/equipment/jobs" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <span>{t('viewAllJobs')}</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {/* Jobs Status Summary Pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {(data?.jobStatusBreakdown || []).map((st) => (
                <div
                  key={st.status}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: '#F1F5F9',
                    fontSize: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span style={{ color: '#475569', fontWeight: 600 }}>{st.status}</span>
                  <span style={{ fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>{st.count}</span>
                </div>
              ))}
            </div>

            {/* Recent Jobs Mini List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflow: 'auto' }}>
              {(data?.recentJobs || []).map((job) => (
                <div
                  key={job.job_id}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 4,
                    border: '1px solid #F1F5F9',
                    background: '#FAFAFA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '65%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Link
                        href={`/equipment/jobs/${job.job_id}`}
                        style={{ fontSize: 12, fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)', textDecoration: 'none' }}
                      >
                        {job.job_code}
                      </Link>
                      <span style={{ fontSize: 11, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {job.job_name}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {renderJobStatusBadge(job.job_status)}
                    <span style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Widget 3 (Attention Equipment) */}
        {(data?.attentionEquipment?.length || 0) > 0 && (
          <div className="card-flat" style={{ padding: '10px 14px', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} style={{ color: '#D97706' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>
                  {t('widgetAttentionEquipment')}
                </span>
              </div>
              <span style={{ fontSize: 11, color: '#B45309' }}>
                {data?.attentionEquipment.length} {t('attentionCountUnit')}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {data?.attentionEquipment.map((item) => (
                <div
                  key={item.equipment_id}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 4,
                    background: '#FFFFFF',
                    border: '1px solid #FCD34D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
                      {item.equipment_code}
                    </div>
                    <div style={{ fontSize: 10, color: '#64748B' }}>
                      {item.equipment_name}
                    </div>
                  </div>
                  <span className="badge badge--warning" style={{ fontSize: 10 }}>
                    {item.device_status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Row 4: Widget B (Urgent Jobs Alert) & Widget C (Active Work Orders) (M11-S1) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
          {/* Widget B: 🚨 緊急対応が必要な加工指示 (Urgent Jobs Alert) */}
          <div className="card-flat" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={15} style={{ color: '#DC2626' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                  ⚠️ 7日以内に期限を迎える加工指示
                </span>
                <span className="badge badge--error" style={{ fontSize: 10, fontWeight: 700 }}>
                  {data?.urgentJobs?.length || 0} 件
                </span>
              </div>
              <Link href="/equipment/jobs" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <span>すべてのJobs</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {(!data?.urgentJobs || data.urgentJobs.length === 0) ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', background: '#F8FAFC', borderRadius: 6, border: '1px dashed #CBD5E1' }}>
                <CheckCircle2 size={24} style={{ color: '#059669', margin: '0 auto 6px' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', display: 'block' }}>
                  現在、期限間近の緊急Jobsはありません
                </span>
                <span style={{ fontSize: 11, color: '#64748B' }}>すべての加工指示が計画通り順調に進行しています</span>
              </div>
            ) : (
              <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ width: 65, textAlign: 'center' }}>残日数</th>
                    <th style={{ width: 130 }}>Job Code</th>
                    <th>製品・設備</th>
                    <th style={{ width: 90, textAlign: 'center' }}>ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {data.urgentJobs.map((j) => {
                    let badgeStyle = { bg: '#FEF2F2', color: '#DC2626', label: `🔴 ${j.daysRemaining <= 0 ? '超過' : `${j.daysRemaining}日`}` }
                    if (j.daysRemaining > 1 && j.daysRemaining <= 3) {
                      badgeStyle = { bg: '#FFFBEB', color: '#D97706', label: `🟡 ${j.daysRemaining}日` }
                    } else if (j.daysRemaining > 3) {
                      badgeStyle = { bg: '#F1F5F9', color: '#475569', label: `⚪ ${j.daysRemaining}日` }
                    }

                    return (
                      <tr key={j.job_id}>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{
                            fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4,
                            background: badgeStyle.bg, color: badgeStyle.color, fontFamily: 'monospace'
                          }}>
                            {badgeStyle.label}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/equipment/jobs/${j.job_id}`}
                            style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent)', textDecoration: 'none' }}
                          >
                            {j.job_code}
                          </Link>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: '#0F172A', display: 'block' }}>
                            {j.product_name || j.product_code || j.job_name}
                          </span>
                          {j.equipment_code && (
                            <span style={{ fontSize: 10, color: '#64748B', fontFamily: 'monospace' }}>
                              設備: {j.equipment_code}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${j.job_status === 'IN_PROGRESS' ? 'badge--warning' : 'badge--neutral'}`} style={{ fontSize: 9 }}>
                            {j.job_status}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Widget C: 製造中の製造指示 (Active Work Orders) */}
          <div className="card-flat" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layers size={15} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>
                  製造中の製造指示 (Active Work Orders)
                </span>
                <span className="badge badge--info" style={{ fontSize: 10, fontWeight: 700 }}>
                  {data?.workOrderKPIs?.totalWorkOrders || 0} 件
                </span>
              </div>
              <Link href="/production/work-orders" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <span>すべての指示</span>
                <ArrowRight size={11} />
              </Link>
            </div>

            {(!data?.activeWorkOrders || data.activeWorkOrders.length === 0) ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', background: '#F8FAFC', borderRadius: 6, border: '1px dashed #CBD5E1' }}>
                <span style={{ fontSize: 12, color: '#64748B' }}>現在進行中の製造指示はありません</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflow: 'auto' }}>
                {data.activeWorkOrders.map((wo) => (
                  <div
                    key={wo.wo_id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 6,
                      border: '1px solid #E2E8F0',
                      background: '#FAFAFA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '70%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Link
                          href={`/production/work-orders/${wo.wo_id}`}
                          style={{ fontSize: 12, fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent)', textDecoration: 'none' }}
                        >
                          {wo.wo_code}
                        </Link>
                        {wo.company_name && (
                          <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>
                            {wo.company_name}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 11, color: '#0F172A', fontWeight: 600 }}>
                        {wo.product_name || wo.product_code || wo.wo_name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className={`badge ${wo.wo_status === 'READY_FOR_PRODUCTION' ? 'badge--success' : (wo.wo_status === 'IN_PROGRESS' ? 'badge--warning' : 'badge--neutral')}`} style={{ fontSize: 10 }}>
                        {wo.wo_status}
                      </span>
                      <Link href={`/production/work-orders/${wo.wo_id}`} style={{ color: '#94A3B8' }}>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 💼 TẦNG 2: THƯƠNG MẠI, DOANH THU & CÔNG NỢ (Live DB + Empty State)   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <DollarSign size={15} style={{ color: '#2563EB' }} />
            <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
              {t('tier2Title')}
            </h2>
            {demoMode ? (
              <span className="badge badge--warning" style={{ fontSize: 10, padding: '1px 6px' }}>
                {t('demoBadge')}
              </span>
            ) : hasRealFinanceData ? (
              <span className="badge badge--success" style={{ fontSize: 10, padding: '1px 6px' }}>
                {t('liveDbBadge')}
              </span>
            ) : (
              <span className="badge badge--neutral" style={{ fontSize: 10, padding: '1px 6px' }}>
                {t('readyBadge')}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link
              href="/orders/invoices"
              style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}
            >
              <span>{t('viewInvoices')}</span>
              <ArrowRight size={11} />
            </Link>
            <span style={{ color: '#CBD5E1' }}>|</span>
            <Link
              href="/orders/debt"
              style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}
            >
              <span>{t('viewDebtReport')}</span>
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        {/* Financial KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {/* Total Invoiced */}
          <div className="card-flat" style={{ padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{t('kpiTotalBilled')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A', marginTop: 4 }}>
              ¥{(activeFinance?.totalBilledAmount || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>
              {activeFinance?.totalInvoicesCount || 0} {t('invoicesCountUnit')}
            </div>
          </div>

          {/* Total Collected */}
          <div className="card-flat" style={{ padding: '12px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#166534' }}>{t('kpiTotalPaid')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: '#16A34A', marginTop: 4 }}>
              ¥{(activeFinance?.totalPaidAmount || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: '#15803D', marginTop: 2 }}>
              {activeFinance?.totalBilledAmount ? Math.round(((activeFinance.totalPaidAmount || 0) / activeFinance.totalBilledAmount) * 100) : 0}% {t('collectionRate')}
            </div>
          </div>

          {/* Total Outstanding Debt */}
          <div className="card-flat" style={{ padding: '12px 14px', background: (activeFinance?.totalRemainingDebt || 0) > 0 ? '#FFFBEB' : '#F8FAFC', border: '1px solid #FDE68A' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#92400E' }}>{t('kpiTotalRemaining')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: (activeFinance?.totalRemainingDebt || 0) > 0 ? '#D97706' : '#16A34A', marginTop: 4 }}>
              ¥{(activeFinance?.totalRemainingDebt || 0).toLocaleString()}
            </div>
            <div style={{ fontSize: 10, color: '#B45309', marginTop: 2 }}>
              {activeFinance?.overdueInvoicesCount || 0} {t('overdueInvoicesCountUnit')}
            </div>
          </div>

          {/* Commercial Quotes */}
          <div className="card-flat" style={{ padding: '12px 14px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{t('kpiQuotations')}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A', marginTop: 4 }}>
              {activeFinance?.totalQuotationsCount || 0} {t('quotationsCountUnit')}
            </div>
            <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>
              {t('quotationsSubtitle')}
            </div>
          </div>
        </div>

        {/* Widget 5: Top Debt Partners & Empty State Banner */}
        <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
          {!demoMode && !hasRealFinanceData ? (
            // ── Clean Empty State Banner ──
            <div
              style={{
                padding: '36px 24px',
                textAlign: 'center',
                background: '#FAFAFA',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                }}
              >
                <CreditCard size={22} />
              </div>
              <div style={{ maxWidth: 520 }}>
                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  {t('emptyFinanceTitle')}
                </h3>
                <p style={{ margin: '6px 0 0 0', fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>
                  {t('emptyFinanceDesc')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={() => setDemoMode(true)}
                  className="btn btn-secondary"
                  style={{ fontSize: 12, padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Sparkles size={14} style={{ color: '#D97706' }} />
                  <span>{t('previewDemoBtn')}</span>
                </button>
                <Link
                  href="/orders/quotations"
                  className="btn btn-primary"
                  style={{ fontSize: 12, padding: '4px 12px', textDecoration: 'none' }}
                >
                  {t('createQuotationBtn')}
                </Link>
              </div>
            </div>
          ) : (
            // ── Partner Debt Summary Table (Real or Demo) ──
            <table className="data-table" style={{ margin: 0, width: '100%' }}>
              <thead>
                <tr>
                  <th>{t('partnerName')}</th>
                  <th style={{ width: 110, textAlign: 'center' }}>{t('invoicesCount')}</th>
                  <th style={{ width: 140, textAlign: 'right' }}>{t('billedAmount')}</th>
                  <th style={{ width: 140, textAlign: 'right' }}>{t('paidAmount')}</th>
                  <th style={{ width: 150, textAlign: 'right' }}>{t('remainingDebt')}</th>
                  <th style={{ width: 120, textAlign: 'center' }}>{t('overdueStatus')}</th>
                  <th style={{ width: 120, textAlign: 'center' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {(activeFinance?.topDebtCustomers || []).map((item) => (
                  <tr key={item.company_id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0F172A' }}>{item.company_name}</div>
                      {item.company_code && (
                        <div style={{ fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>{item.company_code}</div>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 600 }}>
                      {item.total_invoices}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                      ¥{item.total_billed.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#16A34A', fontWeight: 600 }}>
                      ¥{item.total_paid.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: item.total_remaining > 0 ? '#D97706' : '#16A34A' }}>
                      ¥{item.total_remaining.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {item.overdue_count > 0 ? (
                        <span className="badge badge--error" style={{ fontSize: 11 }}>
                          {item.overdue_count} {t('overdueUnit')}
                        </span>
                      ) : (
                        <span style={{ fontSize: 12, color: '#94A3B8' }}>0</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Link
                        href="/orders/invoices"
                        className="btn btn-secondary"
                        style={{ padding: '2px 8px', fontSize: 11, textDecoration: 'none' }}
                      >
                        {t('details')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
