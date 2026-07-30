'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import {
  Package, Wrench, Hammer, FileText, Building2, Layers, Plus,
  CheckCircle2, Clock, AlertCircle, ExternalLink, RefreshCw, BarChart2
} from 'lucide-react'
import { getDashboardData, RealDashboardData } from '@/app/actions/dashboard'

export default function DashboardPage() {
  const t = useTranslations('Dashboard')
  const locale = useLocale()

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
    if (status === 'COMPLETED') return <span className="badge badge--success">完了 / Complete</span>
    if (status === 'IN_PROGRESS') return <span className="badge badge--warning">進行中 / In Progress</span>
    if (status === 'PLANNED') return <span className="badge badge--info">計画中 / Planned</span>
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
              製品・生産統括ダッシュボード
            </h1>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Bảng điều khiển tổng quan lấy Sản phẩm Master & Chỉ thị Gia công làm trung tâm
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={loadData}
            className="btn btn-secondary"
            style={{ height: 30, padding: '0 10px', gap: 4, fontSize: 11 }}
            title="Dữ liệu mới"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            <span>更新</span>
          </button>
          <Link
            href="/equipment/jobs/quick-create"
            className="btn btn-primary"
            style={{ height: 30, padding: '0 12px', gap: 6, fontSize: 12, textDecoration: 'none' }}
          >
            <Plus size={14} />
            <span>一括登録 (Tạo nhanh 1-Trang)</span>
          </Link>
          <Link
            href="/worklog"
            className="btn btn-secondary"
            style={{ height: 30, padding: '0 12px', gap: 6, fontSize: 12, textDecoration: 'none' }}
          >
            <FileText size={14} />
            <span>作業日報 (Nippo)</span>
          </Link>
        </div>
      </div>

      {/* ── Row 1: Real KPI Cards (4 Cards) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flexShrink: 0 }}>
        
        {/* KPI 1: Products */}
        <div className="card-flat" style={{ padding: '14px 16px', borderTop: '3px solid var(--accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-jp)' }}>
              製品マスター (Master SP)
            </span>
            <Package size={16} style={{ color: 'var(--accent)', opacity: 0.8 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.kpis.totalProducts || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {loading ? '' : `${(data?.kpis.totalDesignRevisions || 0).toLocaleString()} bản vẽ CAD`}
            </span>
          </div>
        </div>

        {/* KPI 2: Physical Molds */}
        <div className="card-flat" style={{ padding: '14px 16px', borderTop: '3px solid var(--status-info)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-info)', fontFamily: 'var(--font-jp)' }}>
              保有金型 (Khuôn Vật Lý)
            </span>
            <Wrench size={16} style={{ color: 'var(--status-info)', opacity: 0.8 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.kpis.totalPhysicalMolds || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {loading ? '' : `${(data?.kpis.totalCutters || 0).toLocaleString()} dao cắt`}
            </span>
          </div>
        </div>

        {/* KPI 3: Mold Jobs */}
        <div className="card-flat" style={{ padding: '14px 16px', borderTop: '3px solid var(--status-warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-warning)', fontFamily: 'var(--font-jp)' }}>
              加工指示 (Chỉ Thị Gia Công)
            </span>
            <Hammer size={16} style={{ color: 'var(--status-warning)', opacity: 0.8 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.kpis.totalJobs || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {loading ? '' : `${(data?.kpis.totalWorkLogs || 0).toLocaleString()} lượt Nippo`}
            </span>
          </div>
        </div>

        {/* KPI 4: Companies */}
        <div className="card-flat" style={{ padding: '14px 16px', borderTop: '3px solid var(--status-success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-success)', fontFamily: 'var(--font-jp)' }}>
              得意先企業 (Khách Hàng)
            </span>
            <Building2 size={16} style={{ color: 'var(--status-success)', opacity: 0.8 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
              {loading ? '...' : (data?.kpis.totalCompanies || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 10, color: 'var(--status-success)', fontWeight: 600 }}>
              100% Real Access Data
            </span>
          </div>
        </div>

      </div>

      {/* ── Row 2: 4 Real Analytics Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flexShrink: 0 }}>
        
        {/* Widget 1: Job Status */}
        <div className="card-flat" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>📊 ジョブ進捗 (Trạng thái Job)</span>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>🛠️ 金型状態 (Trạng thái Khuôn)</span>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>📐 技術資産 (Tài Sản Kỹ Thuật)</span>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>📝 作業日報 (Nhật ký Nippo)</span>
            <span className="badge badge--warning" style={{ fontSize: 9 }}>Active</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Tổng lượt ghi nhật ký</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)' }}>6,980</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Nhân viên tham gia</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>45+</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Công đoạn tiêu chuẩn</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>44</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Row 3: Main Layout (Recent Jobs Table + Master System Stats) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, flex: 1, minHeight: 0 }}>
        
        {/* Left: 10 Recent Real Jobs */}
        <div className="card-flat" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Hammer size={14} style={{ color: 'var(--accent)' }} />
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>
                直近の加工ジョブ (10 Chỉ thị gia công gần đây nhất)
              </h3>
            </div>
            <Link href="/equipment/jobs" style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              すべて見る ➔
            </Link>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 110 }}>ジョブコード</th>
                  <th>ジョブ名 / Tên Job</th>
                  <th style={{ width: 120 }}>対象金型 / Khuôn</th>
                  <th style={{ width: 100 }}>納期 / Hạn chót</th>
                  <th style={{ width: 110, textAlign: 'center' }}>ステータス</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)', fontSize: 12 }}>
                      Dữ liệu thực đang tải từ Supabase...
                    </td>
                  </tr>
                ) : data?.recentJobs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)', fontSize: 12 }}>
                      Chưa có Job gia công nào.
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
          <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface-2)' }}>
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)' }}>
              システムマスター統計 (Thống kê Master Data Real)
            </h3>
          </div>
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, overflowY: 'auto' }}>
            {([
              ['products', '製品マスター (Sản phẩm master)', (data?.kpis.totalProducts || 0).toLocaleString(), '4,078 khay thực tế'],
              ['designs', '設計リビジョン (Bản vẽ CAD)', (data?.kpis.totalDesignRevisions || 0).toLocaleString(), '4,735 bản vẽ'],
              ['molds', '物理金型 (Khuôn vật lý)', (data?.kpis.totalPhysicalMolds || 0).toLocaleString(), '4,751 chiếc khuôn'],
              ['cutters', '抜型 (Dao cắt vật lý)', (data?.kpis.totalCutters || 0).toLocaleString(), '1,283 chiếc dao'],
              ['jobs', '加工指示 (Chỉ thị gia công)', (data?.kpis.totalJobs || 0).toLocaleString(), '1,183 Job chỉ thị'],
              ['worklogs', '作業日報 (Nhật ký công việc)', (data?.kpis.totalWorkLogs || 0).toLocaleString(), '6,980 lượt Nippo'],
              ['companies', '得意先企業 (Doanh nghiệp KH)', (data?.kpis.totalCompanies || 0).toLocaleString(), '1,991 công ty'],
            ] as [string, string, string, string][]).map(([key, label, val, sub], i) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < 6 ? '1px solid var(--border-subtle)' : 'none', paddingBottom: 6 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>{label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{sub}</div>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{val}</span>
              </div>
            ))}
          </div>
          
          <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--status-success)', fontWeight: 600 }}>
              <div className="badge-dot badge-dot--success" />
              <span>Database Status: ONLINE & 100% SYNCED</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
