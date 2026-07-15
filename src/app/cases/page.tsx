'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Briefcase, Plus, Search, FilterX } from 'lucide-react'
import Link from 'next/link'

// ── Types ──────────────────────────────────────────────────────────────
type BusinessCase = {
  id: string
  case_code: string
  title: string
  case_type: string
  status: string
  requested_due_date: string | null
  created_at: string
  companies: { company_name: string; company_code: string } | null
  sales_owner: { employee_name: string } | null
}

// ── Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { labelJA: string; labelVI: string; badgeClass: string }> = {
  open:        { labelJA: '新規',     labelVI: 'Mới',         badgeClass: 'badge badge--info' },
  in_review:   { labelJA: '検討中',   labelVI: 'Đang xem xét', badgeClass: 'badge badge--warning' },
  quoted:      { labelJA: '見積済',   labelVI: 'Đã báo giá',  badgeClass: 'badge badge--neutral' },
  ordered:     { labelJA: '受注済',   labelVI: 'Có đơn hàng', badgeClass: 'badge badge--success' },
  completed:   { labelJA: '完了',     labelVI: 'Hoàn thành',  badgeClass: 'badge badge--success' },
  closed:      { labelJA: 'クローズ', labelVI: 'Đã đóng',     badgeClass: 'badge badge--neutral' },
}

const CASE_TYPE_CONFIG: Record<string, { labelJA: string; labelVI: string }> = {
  new_tray:          { labelJA: '新規トレイ',  labelVI: 'Khay mới' },
  repeat_order:      { labelJA: '追加注文',    labelVI: 'Đặt lại' },
  mold_modification: { labelJA: '金型改造',    labelVI: 'Sửa khuôn' },
  material_change:   { labelJA: '材料変更',    labelVI: 'Đổi vật liệu' },
  complaint:         { labelJA: 'クレーム',    labelVI: 'Khiếu nại' },
  inventory_audit:   { labelJA: '棚卸依頼',   labelVI: 'Kiểm kê khuôn' },
  tray_review:       { labelJA: '収納検討',    labelVI: 'Xem xét thiết kế tray' },
  other:             { labelJA: 'その他',      labelVI: 'Khác' },
}

const FILTER_TABS = [
  { key: 'ALL',       labelJA: '全て',   labelVI: 'Tất cả' },
  { key: 'open',      labelJA: '新規',   labelVI: 'Mới' },
  { key: 'in_review', labelJA: '検討中', labelVI: 'Đang xem' },
  { key: 'quoted',    labelJA: '見積済', labelVI: 'Đã báo giá' },
  { key: 'ordered',   labelJA: '受注済', labelVI: 'Có đơn' },
]

const PAGE_SIZE = 50

function formatDate(d: string | null) {
  if (!d) return '—'
  return d.substring(0, 10).replace(/-/g, '/')
}

// ── Main Component ──────────────────────────────────────────────────────
export default function CasesPage() {
  const supabase = createClient()
  const [cases, setCases] = useState<BusinessCase[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => { setPage(1) }, [activeTab, debouncedSearch])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 400)
    return () => clearTimeout(t)
  }, [searchQuery])

  const fetchCases = useCallback(async () => {
    setLoading(true)
    let q = (supabase as any)
      .from('business_cases')
      .select(`
        id, case_code, title, case_type, status, requested_due_date, created_at,
        companies(company_name, company_code),
        sales_owner:employees!business_cases_sales_owner_id_fkey(employee_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    if (activeTab !== 'ALL') q = q.eq('status', activeTab) as typeof q
    if (debouncedSearch.trim()) {
      q = q.or(`case_code.ilike.%${debouncedSearch}%,title.ilike.%${debouncedSearch}%`) as typeof q
    }

    const from = (page - 1) * PAGE_SIZE
    q = q.range(from, from + PAGE_SIZE - 1) as typeof q

    const { data, error, count } = await q
    if (error) {
      console.error('Fetch cases error:', error)
      setCases([])
      setTotalRecords(0)
    } else {
      setCases((data || []) as unknown as BusinessCase[])
      setTotalRecords(count || 0)
    }
    setLoading(false)
  }, [activeTab, debouncedSearch, page, supabase])

  useEffect(() => { fetchCases() }, [fetchCases])

  const hasFilters = activeTab !== 'ALL' || !!searchQuery
  const totalPages = Math.ceil(totalRecords / PAGE_SIZE)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Briefcase size={20} style={{ color: 'var(--accent)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-jp)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>事案管理</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Quản lý Sự việc / Business Cases</span>
          </div>
          <span className="badge badge--neutral" style={{ marginLeft: 4 }}>{totalRecords.toLocaleString()} 件</span>
        </div>
        <Link href="/cases/new" className="btn btn-primary" style={{ gap: 6, fontSize: 13 }}>
          <Plus size={14} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>新規事案</span>
        </Link>
      </div>

      {/* ── Filter Bar ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-default)', paddingBottom: 0 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {FILTER_TABS.map(tab => {
              const active = activeTab === tab.key
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  style={{ background: 'none', border: 'none', padding: '8px 12px', cursor: 'pointer',
                    position: 'relative', color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight: active ? 700 : 500 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-jp)' }}>{tab.labelJA}</span>
                    <span style={{ fontSize: 10, opacity: 0.75 }}>{tab.labelVI}</span>
                  </div>
                  {active && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
                      background: 'var(--accent)', borderRadius: '2px 2px 0 0' }} />
                  )}
                </button>
              )
            })}
          </div>
          {hasFilters && (
            <button onClick={() => { setActiveTab('ALL'); setSearchQuery('') }}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px' }}>
              <FilterX size={12} /> リセット
            </button>
          )}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%',
            transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input type="text" placeholder="事案コード・タイトル検索 / Tìm kiếm..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="form-input" style={{ paddingLeft: 32, height: 32, fontSize: 13 }} />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column',
        minHeight: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-muted)', fontSize: 13 }}>読み込み中... / Đang tải...</div>
        ) : (
          <>
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 150 }}>
                      <span className="ja">事案コード</span>
                      <span className="vi">Mã sự việc</span>
                    </th>
                    <th>
                      <span className="ja">タイトル</span>
                      <span className="vi">Tiêu đề</span>
                    </th>
                    <th style={{ width: 120 }}>
                      <span className="ja">種別</span>
                      <span className="vi">Loại</span>
                    </th>
                    <th style={{ width: 200 }}>
                      <span className="ja">得意先</span>
                      <span className="vi">Khách hàng</span>
                    </th>
                    <th style={{ width: 120 }}>
                      <span className="ja">担当者</span>
                      <span className="vi">Phụ trách KD</span>
                    </th>
                    <th style={{ width: 100 }}>
                      <span className="ja">希望納期</span>
                      <span className="vi">Hạn yêu cầu</span>
                    </th>
                    <th style={{ width: 100, textAlign: 'center' }}>
                      <span className="ja">状態</span>
                      <span className="vi">Trạng thái</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cases.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '48px 0',
                        color: 'var(--text-muted)', fontSize: 13 }}>
                        データがありません / Không có dữ liệu
                      </td>
                    </tr>
                  ) : cases.map(c => {
                    const statusCfg = STATUS_CONFIG[c.status]
                    const typeCfg = CASE_TYPE_CONFIG[c.case_type]
                    return (
                      <tr key={c.id}>
                        <td>
                          <Link href={`/cases/${c.id}`}
                            style={{ color: 'var(--accent)', fontFamily: 'monospace',
                              fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                            {c.case_code}
                          </Link>
                        </td>
                        <td style={{ fontWeight: 500, maxWidth: 320 }}>
                          <span style={{ display: 'block', overflow: 'hidden',
                            textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.title}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge--neutral" style={{ fontSize: 11 }}>
                            <span style={{ fontFamily: 'var(--font-jp)' }}>
                              {typeCfg?.labelJA ?? c.case_type}
                            </span>
                          </span>
                        </td>
                        <td>
                          {c.companies ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{c.companies.company_name}</span>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)',
                                fontFamily: 'monospace' }}>{c.companies.company_code}</span>
                            </div>
                          ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                          {c.sales_owner?.employee_name ?? '—'}
                        </td>
                        <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)',
                          fontSize: 12 }}>{formatDate(c.requested_due_date)}</td>
                        <td style={{ textAlign: 'center' }}>
                          {statusCfg
                            ? <span className={statusCfg.badgeClass}>
                                <span style={{ fontFamily: 'var(--font-jp)' }}>{statusCfg.labelJA}</span>
                              </span>
                            : <span className="badge badge--neutral">{c.status}</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-default)',
                background: 'var(--bg-surface-2)', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, totalRecords)} / {totalRecords.toLocaleString()} 件
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 12,
                      opacity: page === 1 ? 0.4 : 1 }}>← 前へ</button>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)',
                    padding: '4px 8px', alignSelf: 'center' }}>{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: 12,
                      opacity: page === totalPages ? 0.4 : 1 }}>次へ →</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
