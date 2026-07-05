// @ts-nocheck
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Search, Layers, ChevronRight, FileText, Factory, FilterX } from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import Link from 'next/link'

type Company = {
  company_name: string
  company_code: string
}

type MoldMaster = {
  product_id: string
  product_code: string
  product_name_internal: string | null
  product_status: string
  company_id: string | null
  keeper_company_id: string | null
  companies: Company | null
  keeper_company: Company | null
}

const STATUS_TABS = [
  { key: 'ALL', label: '全て', labelVi: 'Tất cả' },
  { key: 'ACTIVE', label: '稼働中', labelVi: 'Đang hoạt động' },
  { key: 'INACTIVE', label: '休止中', labelVi: 'Không hoạt động' },
]

export default function MoldBasePage() {
  const supabase = createClient()

  const [molds, setMolds] = useState<MoldMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Pagination
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const PAGE_SIZE = 50

  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [filterCompanyId, setFilterCompanyId] = useState<string | null>(null)
  const [filterKeeperId, setFilterKeeperId] = useState<string | null>(null)

  useEffect(() => {
    setPage(1)
  }, [activeTab, debouncedSearchQuery, filterCompanyId, filterKeeperId])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchMolds = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('products')
      .select(`
        *,
        companies!products_company_id_fkey ( company_code, company_name ),
        keeper_company:companies!products_keeper_company_id_fkey ( company_code, company_name )
      `, { count: 'exact' })
      .order('product_code', { ascending: true })

    if (activeTab !== 'ALL') {
      query = query.eq('product_status', activeTab)
    }

    if (debouncedSearchQuery.trim()) {
      const q = debouncedSearchQuery.trim()
      query = query.or(`product_code.ilike.%${q}%,product_name_internal.ilike.%${q}%`)
    }

    if (filterCompanyId) {
      query = query.eq('company_id', filterCompanyId)
    }

    if (filterKeeperId) {
      query = query.eq('keeper_company_id', filterKeeperId)
    }

    // Pagination
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, error: err, count } = await query

    if (err) {
      setError(err.message)
      setMolds([])
    } else {
      setMolds((data || []) as unknown as MoldMaster[])
      setTotalRecords(count || 0)
    }
    setLoading(false)
  }, [activeTab, debouncedSearchQuery, filterCompanyId, filterKeeperId, page, supabase])

  useEffect(() => {
    fetchMolds()
  }, [fetchMolds])

  const handleClearFilters = () => {
    setActiveTab('ALL')
    setSearchQuery('')
    setDebouncedSearchQuery('')
    setFilterCompanyId(null)
    setFilterKeeperId(null)
  }

  const hasFilters = activeTab !== 'ALL' || !!searchQuery || !!filterCompanyId || !!filterKeeperId

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Layers size={20} style={{ color: 'var(--accent)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="ja" style={{ fontSize: 16 }}>金型マスター</span>
            <span className="vi" style={{ fontSize: 11 }}>Danh mục Khuôn gốc</span>
          </div>
        </div>
        <Link href="/master/molds/new">
          <button className="btn btn-primary">
            <Plus size={14} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>新規登録</span>
          </button>
        </Link>
      </div>

      {/* ── Filters Section ── */}
      <div className="form-section" style={{ flexShrink: 0, marginBottom: 0 }}>
        <div className="form-section-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Search className="section-icon" />
            <span>検索条件 / Bộ lọc</span>
          </div>
          {hasFilters && (
            <button 
              onClick={handleClearFilters}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, textTransform: 'uppercase' }}
            >
              <FilterX size={12} /> クリア / Xóa lọc
            </button>
          )}
        </div>
        <div className="form-section-body">
          
          {/* Status Tabs */}
          <div className="tab-nav" style={{ margin: '-14px -14px 14px', background: 'var(--bg-surface)' }}>
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`tab-item ${activeTab === tab.key ? 'tab-item--active' : ''}`}
                style={{ flex: 1, padding: '8px 4px', border: 'none', background: 'transparent' }}
              >
                <span className="tab-ja">{tab.label}</span>
                <span className="tab-vi">{tab.labelVi} {activeTab === tab.key ? `(${totalRecords})` : ''}</span>
              </button>
            ))}
          </div>

          <div className="form-grid-3">
            {/* Search */}
            <div className="form-field">
              <label className="form-label">
                <span className="label-ja">コード・名称</span>
                <span className="label-vi">Mã/Tên khuôn</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="検索..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 30 }}
                />
              </div>
            </div>

            {/* Customer Filter */}
            <div className="form-field">
              <label className="form-label">
                <span className="label-ja">顧客 (所有者)</span>
                <span className="label-vi">Khách hàng (Chủ sở hữu)</span>
              </label>
              <AsyncSearchableSelect
                value={filterCompanyId}
                onChange={setFilterCompanyId}
                placeholder="顧客を検索..."
                fetchOptions={async (q) => {
                  const res = await fetch(`/api/search/companies?q=${encodeURIComponent(q)}&type=CUSTOMER&limit=20`)
                  if (!res.ok) return []
                  const { data } = await res.json()
                  return (data || []).map((c: any) => ({
                    value: c.company_id,
                    label: c.company_name,
                    sublabel: c.company_code
                  }))
                }}
              />
            </div>

            {/* Keeper Filter */}
            <div className="form-field">
              <label className="form-label">
                <span className="label-ja">保管先</span>
                <span className="label-vi">Nơi lưu giữ (Keeper)</span>
              </label>
              <AsyncSearchableSelect
                value={filterKeeperId}
                onChange={setFilterKeeperId}
                placeholder="保管先を検索..."
                fetchOptions={async (q) => {
                  const res = await fetch(`/api/search/companies?q=${encodeURIComponent(q)}&limit=20`)
                  if (!res.ok) return []
                  const { data } = await res.json()
                  return (data || []).map((c: any) => ({
                    value: c.company_id,
                    label: c.company_name,
                    sublabel: c.company_code
                  }))
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            読み込み中... / Đang tải dữ liệu...
          </div>
        ) : error ? (
          <div style={{ padding: 16, color: 'var(--status-error)', fontSize: 12 }}>
            エラー / Lỗi: {error}
          </div>
        ) : (
          <React.Fragment>
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 180 }}>
                      <span className="ja">金型コード</span>
                      <span className="vi">Mã Khuôn</span>
                    </th>
                    <th style={{ width: 220 }}>
                      <span className="ja">金型名称</span>
                      <span className="vi">Tên Khuôn</span>
                    </th>
                    <th style={{ width: 180 }}>
                      <span className="ja">顧客</span>
                      <span className="vi">Khách hàng</span>
                    </th>
                    <th style={{ width: 180 }}>
                      <span className="ja">保管先</span>
                      <span className="vi">Nơi lưu giữ</span>
                    </th>
                    <th style={{ width: 100, textAlign: 'center' }}>
                      <span className="ja">状態</span>
                      <span className="vi">Trạng thái</span>
                    </th>
                    <th style={{ width: 60, textAlign: 'right' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {molds.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                        データがありません / Không có dữ liệu
                      </td>
                    </tr>
                  ) : (
                    molds.map(item => (
                      <tr key={item.product_id}>
                        <td>
                          <Link href={`/master/molds/${item.product_id}`} style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 700, fontSize: 13, textDecoration: 'none' }} className="hover:underline">
                            {item.product_code}
                          </Link>
                        </td>
                        <td>
                          {item.product_name_internal || '-'}
                        </td>
                        <td>
                          {item.companies ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600 }}>{item.companies.company_name}</span>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                {item.companies.company_code}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                          )}
                        </td>
                        <td>
                          {item.keeper_company ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600 }}>{item.keeper_company.company_name}</span>
                              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                {item.keeper_company.company_code}
                              </span>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {item.product_status === 'ACTIVE' ?
                            (<span className="badge badge--success">ACTIVE</span>) :
                            (<span className="badge badge--neutral">{item.product_status || 'INACTIVE'}</span>)
                          }
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link href={`/master/molds/${item.product_id}`} style={{ color: 'var(--text-muted)', display: 'inline-flex', padding: 4 }}>
                            <ChevronRight size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
              <Pagination
                currentPage={page}
                totalRecords={totalRecords}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  )
}
