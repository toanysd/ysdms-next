'use client'

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Search, FileText, ChevronDown, ChevronRight, Edit, Trash2, X, Package, Calendar, Hash, FilterX } from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import Link from 'next/link'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'
import { useTranslations } from 'next-intl'

// ── Types ──────────────────────────────────────────────────────────────
type OrderLine = {
  line_id: string
  order_id: string
  product_id: string | null
  quantity: number
  unit: string
  unit_price: number | null
  status: string
  line_no: number
  is_free_sample: boolean
  products: { product_code: string; product_name: string | null } | null
}

type Company = {
  company_name: string
  company_code: string
}

type Order = {
  order_id: string
  order_no: string
  company_id: string | null
  quote_id: string | null
  order_date: string | null
  requested_delivery_date: string | null
  order_type: string | null
  status: string
  notes: string | null
  created_at: string
  order_folder_path?: string | null
  companies: Company | null
  order_lines: OrderLine[]
}

type StatusKey = 'NEW' | 'QUOTED' | 'APPROVED' | 'IN_PRODUCTION' | 'SHIPPED' | 'CANCELLED'

// ── Status config ──────────────────────────────────────────────────────
const STATUS_CONFIG: Record<StatusKey, { labelKey: string; badgeClass: string }> = {
  NEW:           { labelKey: 'statusNew', badgeClass: 'badge badge--info' },
  QUOTED:        { labelKey: 'statusQuoted', badgeClass: 'badge badge--warning' },
  APPROVED:      { labelKey: 'statusApproved', badgeClass: 'badge badge--neutral' },
  IN_PRODUCTION: { labelKey: 'statusInProduction', badgeClass: 'badge badge--success' },
  SHIPPED:       { labelKey: 'statusShipped', badgeClass: 'badge badge--neutral' },
  CANCELLED:     { labelKey: 'statusCancelled', badgeClass: 'badge badge--error' },
}

const FILTER_TABS: { key: string; labelKey: string }[] = [
  { key: 'ALL',           labelKey: 'filterAll' },
  { key: 'NEW',           labelKey: 'statusNew' },
  { key: 'IN_PRODUCTION', labelKey: 'statusInProduction' },
  { key: 'SHIPPED',       labelKey: 'statusShipped' },
  { key: 'CANCELLED',     labelKey: 'statusCancelled' },
]

// ── Helpers ────────────────────────────────────────────────────────────
function formatDate(d: string | null): string {
  if (!d) return '-'
  return d.substring(0, 10).replace(/-/g, '/')
}

function generateNextOrderNo(orders: Order[]): string {
  const year = new Date().getFullYear()
  const prefix = `A-${year}-`
  const existing = orders
    .map(o => o.order_no)
    .filter(n => n.startsWith(prefix))
    .map(n => parseInt(n.replace(prefix, ''), 10))
    .filter(n => !isNaN(n))
  const next = existing.length > 0 ? Math.max(...existing) + 1 : 1
  return `${prefix}${String(next).padStart(4, '0')}`
}

// ══════════════════════════════════════════════════════════════════════
// Main Page Component
// ══════════════════════════════════════════════════════════════════════
export default function OrdersPage() {
  const t = useTranslations('Orders')
  const tCommon = useTranslations('Common')
  const supabase = createClient()

  // ── State ──
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({ total: 0, production: 0, shipped: 0 })
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [isApproving, setIsApproving] = useState(false)

  // ── Filters & Pagination ──
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const PAGE_SIZE = 50

  const [activeTab, setActiveTab] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('search_orders')
  const [filterCustomerId, setFilterCustomerId] = useState<string | null>(null)
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')


  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [activeTab, debouncedSearchQuery, filterCustomerId, filterStartDate, filterEndDate])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      if (searchQuery.trim().length >= 2) addToHistory(searchQuery.trim())
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // ── Fetch orders ──
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    let query = supabase
      .from('orders')
      .select('*, companies(company_name, company_code), order_lines(*, products(product_code, product_name))', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (activeTab !== 'ALL') {
      query = query.eq('order_status', activeTab)
    }

    if (debouncedSearchQuery.trim()) {
      const q = debouncedSearchQuery.trim()
      query = query.or(`order_no.ilike.%${q}%`)
    }

    if (filterCustomerId) {
      query = query.eq('company_id', filterCustomerId)
    }

    if (filterStartDate) {
      query = query.gte('order_date', filterStartDate)
    }

    if (filterEndDate) {
      query = query.lte('order_date', filterEndDate)
    }

    // Pagination
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, error: err, count } = await query

    if (err) {
      setError(err.message)
      setOrders([])
    } else {
      const mapped = (data || []).map(o => ({
        ...o,
        order_type: o.order_type || 'PRODUCT',
        requested_delivery_date: o.requested_delivery,
        status: o.order_status,
        order_lines: o.order_lines || []
      }))
      setOrders(mapped as unknown as Order[])
      setTotalRecords(count || 0)
    }
    setLoading(false)
  }, [activeTab, debouncedSearchQuery, filterCustomerId, filterStartDate, filterEndDate, page, supabase])

  useEffect(() => {
    fetchOrders()
    const fetchStats = async () => {
      const [ { count: t }, { count: p }, { count: s } ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'IN_PRODUCTION'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('order_status', 'SHIPPED')
      ])
      setStats({ total: t || 0, production: p || 0, shipped: s || 0 })
    }
    fetchStats()
  }, [fetchOrders, supabase])

  const handleClearFilters = () => {
    setActiveTab('ALL')
    setSearchQuery('')
    setDebouncedSearchQuery('')
    setFilterCustomerId(null)
    setFilterStartDate('')
    setFilterEndDate('')
  }

  // ── Delete order handler ──
  const handleDeleteOrder = async (id: string, orderNo: string) => {
    if (!confirm(t('deleteConfirm', { orderNo }))) return
    const { error: delErr } = await supabase.from('orders').delete().eq('order_id', id)
    if (delErr) {
      alert(`${tCommon('error')}: ${delErr.message}`)
      return
    }
    fetchOrders()
  }

  // ── Bulk approve handler ──
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(orders.filter(o => o.status === 'NEW').map(o => o.order_id))
    } else {
      setSelectedOrders([])
    }
  }

  const handleSelectRow = (id: string) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleBulkApprove = async () => {
    if (selectedOrders.length === 0) return
    if (!confirm(t('bulkApproveConfirm', { count: selectedOrders.length }))) return

    setIsApproving(true)
    const { error: updErr } = await supabase
      .from('orders')
      .update({ order_status: 'APPROVED' })
      .in('order_id', selectedOrders)

    setIsApproving(false)
    if (updErr) {
      alert(`${tCommon('error')}: ${updErr.message}`)
      return
    }
    
    setSelectedOrders([])
    fetchOrders()
  }

  // ── Status badge renderer ──
  const renderStatusBadge = (status: string) => {
    const cfg = STATUS_CONFIG[status as StatusKey]
    if (!cfg) return <span className="badge badge--neutral">{status}</span>
    return (
      <span className={cfg.badgeClass}>
        <span style={{ fontWeight: 600 }}>{t(cfg.labelKey as any)}</span>
      </span>
    )
  }

  const hasFilters = activeTab !== 'ALL' || !!searchQuery || !!filterCustomerId || !!filterStartDate || !!filterEndDate

  // ════════════════════════════════════════════════════════════════════
  // Render
  // ════════════════════════════════════════════════════════════════════
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      
      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <FileText size={20} style={{ color: 'var(--accent)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>{t('title')}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {selectedOrders.length > 0 && (
            <button 
              className="btn btn-secondary" 
              onClick={handleBulkApprove} 
              disabled={isApproving}
              style={{ borderColor: 'var(--status-success)', color: 'var(--status-success)' }}
            >
              {isApproving ? t('approving') : t('bulkApprove', { count: selectedOrders.length })}
            </button>
          )}
          <Link href="/orders/create" className="btn btn-primary">
            <Plus size={14} />
            <span style={{ fontWeight: 600 }}>{t('newOrder')}</span>
          </Link>
        </div>
      </div>

      {/* ── Integrated Toolbar ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0, paddingBottom: 8 }}>
        
        {/* Tabs & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {FILTER_TABS.map(tab => {
              const isActive = activeTab === tab.key;
              let countStr = '';
              if (tab.key === 'ALL') countStr = stats.total.toString();
              else if (tab.key === 'IN_PRODUCTION') countStr = stats.production.toString();
              else if (tab.key === 'SHIPPED') countStr = stats.shipped.toString();

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 4px',
                    cursor: 'pointer',
                    position: 'relative',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, lineHeight: 1.2 }}>{t(tab.labelKey as any)}</span>
                    {countStr && (
                      <span className="badge badge--neutral" style={{ padding: '0 6px', fontSize: 10, background: isActive ? 'var(--accent-light)' : 'var(--bg-surface-2)', color: isActive ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {countStr}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--accent)', borderRadius: '2px 2px 0 0' }} />
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Quick Actions inside Toolbar */}
          {hasFilters && (
            <button 
              onClick={handleClearFilters}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: '4px' }}
            >
              <FilterX size={12} /> {t('clear')}
            </button>
          )}
        </div>

        {/* Inline Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Search */}
          <div style={{ position: 'relative', width: 240 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder={tCommon('search')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="form-input"
              style={{ paddingLeft: 30, height: 32, fontSize: 13 }}
            />
            <SearchSuggestions
              history={history}
              onSelect={(q) => { setSearchQuery(q); setShowSuggestions(false) }}
              onRemove={removeFromHistory}
              onClear={clearHistory}
              visible={showSuggestions && !searchQuery}
              onClose={() => setShowSuggestions(false)}
            />
          </div>

          {/* Customer */}
          <div style={{ width: 240 }}>
            <AsyncSearchableSelect
              value={filterCustomerId}
              onChange={setFilterCustomerId}
              placeholder={t('customer')}
              fetchOptions={async (q) => {
                const { data } = await supabase
                  .from('companies')
                  .select('company_id, company_name, company_code')
                  .ilike('company_name', `%${q}%`)
                  .limit(20)
                return (data || []).map((c: any) => ({
                  value: c.company_id,
                  label: c.company_name,
                  sublabel: c.company_code
                }))
              }}
            />
          </div>

          {/* Dates */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '2px 8px', height: 32 }}>
            <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
            <input
              type="date"
              value={filterStartDate}
              onChange={e => setFilterStartDate(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12, color: 'var(--text-primary)', width: 110 }}
              title={t('fromDate')}
            />
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>-</span>
            <input
              type="date"
              value={filterEndDate}
              onChange={e => setFilterEndDate(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12, color: 'var(--text-primary)', width: 110 }}
              title={t('toDate')}
            />
          </div>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            {t('loading')}
          </div>
        ) : error ? (
          <div style={{ padding: 16, color: 'var(--status-error)', fontSize: 12 }}>
            {tCommon('error')}: {error}
          </div>
        ) : (
          <React.Fragment>
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 40, textAlign: 'center' }}>
                      <input 
                        type="checkbox" 
                        onChange={handleSelectAll}
                        checked={orders.filter(o => o.status === 'NEW').length > 0 && selectedOrders.length === orders.filter(o => o.status === 'NEW').length}
                        title={t('selectAllNew')}
                      />
                    </th>
                    <th style={{ width: 140 }}>
                      <span style={{ fontWeight: 600 }}>{t('orderCode')}</span>
                    </th>
                    <th style={{ width: 100 }}>
                      <span style={{ fontWeight: 600 }}>{tCommon('status')}</span>
                    </th>
                    <th style={{ width: 220 }}>
                      <span style={{ fontWeight: 600 }}>{t('customerName')}</span>
                    </th>
                    <th style={{ width: 110 }}>
                      <span style={{ fontWeight: 600 }}>{t('orderDate')}</span>
                    </th>
                    <th style={{ width: 110 }}>
                      <span style={{ fontWeight: 600 }}>{t('deliveryDate')}</span>
                    </th>
                    <th style={{ width: 80, textAlign: 'center' }}>
                      <span style={{ fontWeight: 600 }}>{t('quantity')}</span>
                    </th>
                    <th style={{ width: 100, textAlign: 'center' }}>
                      <span style={{ fontWeight: 600 }}>{tCommon('status')}</span>
                    </th>
                    <th style={{ width: 80, textAlign: 'right' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                        {t('noData')}
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => {
                      return (
                        <tr key={order.order_id}>
                          <td style={{ textAlign: 'center', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); if(order.status === 'NEW') handleSelectRow(order.order_id); }}>
                            {order.status === 'NEW' ? (
                              <input 
                                type="checkbox" 
                                checked={selectedOrders.includes(order.order_id)}
                                onChange={() => handleSelectRow(order.order_id)}
                                onClick={e => e.stopPropagation()}
                              />
                            ) : (
                              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                            )}
                          </td>
                          <td>
                            <Link
                              href={`/orders/${order.order_id}`}
                              style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}
                            >
                              {order.order_no}
                            </Link>
                          </td>
                          <td>
                            <span className={order.order_type === 'MOLD' ? 'badge badge--warning' : 'badge badge--info'}>
                              {order.order_type === 'MOLD' ? t('mold') : t('product')}
                            </span>
                          </td>
                          <td>
                            {order.companies ? (
                              <Link href={`/master/customers/${order.company_id}`} style={{ textDecoration: 'none' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ fontWeight: 600, color: 'var(--accent)' }} className="hover:underline">
                                    {order.companies.company_name}
                                  </span>
                                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                    {order.companies.company_code}
                                  </span>
                                </div>
                              </Link>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>—</span>
                            )}
                          </td>
                          <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                            {formatDate(order.order_date)}
                          </td>
                          <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                            {formatDate(order.requested_delivery_date)}
                          </td>
                          <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>
                            {order.order_lines?.length || 0}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {renderStatusBadge(order.status)}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.order_id, order.order_no); }}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
                              title={tCommon('delete')}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      )
                    })
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
