'use client'

// @ts-nocheck

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  PenTool, Search, ChevronRight, Package, Building2,
  Layers, Filter, Plus,
} from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'
import Link from 'next/link'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'
import { useTranslations } from 'next-intl'

// ─── Types ─────────────────────────────────────────────────────────────────
type MoldWithProduct = {
  // Products = MoldMasters = Tray (same entity)
  product_id: string
  product_code: string
  product_name_internal: string | null
  product_name: string | null
  customer_product_name: string | null
  product_status: string | null
  company_id: string | null
  notes: string | null
  companies: { company_name: string; company_code: string } | null
  // Enriched from design_revisions
  _latestRevisionStatus?: string | null
  _revisionCount?: number
}

const STATUS_BADGE: Record<string, { key: string; cls: string }> = {
  DRAFT:      { key: 'DRAFT',       cls: 'badge badge--warning' },
  SUBMITTED:  { key: 'SUBMITTED',   cls: 'badge badge--info' },
  RELEASED:   { key: 'RELEASED',    cls: 'badge badge--success' },
  APPROVED:   { key: 'APPROVED',    cls: 'badge badge--success' },
  REJECTED:   { key: 'REJECTED',    cls: 'badge badge--error' },
  SUPERSEDED: { key: 'SUPERSEDED',  cls: 'badge badge--neutral' },
  ACTIVE:     { key: 'ACTIVE',      cls: 'badge badge--success' },
  INACTIVE:   { key: 'INACTIVE',    cls: 'badge badge--neutral' },
}

const PAGE_SIZE = 50

// ─── Component ─────────────────────────────────────────────────────
export default function DesignsListPage() {
  const t = useTranslations('Engineering')
  const supabase = createClient()

  const [molds, setMolds] = useState<MoldWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('search_designs')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      if (searchQuery.trim().length >= 2) addToHistory(searchQuery.trim())
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Reset page on search change
  useEffect(() => { setPage(1) }, [debouncedSearch])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    // Step 1: Fetch products (= mold_masters) with companies
    let query = supabase
      .from('products')
      .select(`
        product_id, product_code, product_name_internal, product_name, customer_product_name, product_status, company_id, notes,
        companies:companies!products_company_id_fkey ( company_name, company_code )
      `, { count: 'exact' })
      .order('product_code', { ascending: true })

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim()
      query = query.or(`product_code.ilike.%${q}%,product_name_internal.ilike.%${q}%,product_name.ilike.%${q}%`)
    }

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data: productData, error: prodErr, count } = await query

    if (prodErr) {
      setError(prodErr.message)
      setMolds([])
      setLoading(false)
      return
    }

    const productList = (productData || []) as MoldWithProduct[]
    setTotalRecords(count || 0)

    if (productList.length === 0) {
      setMolds([])
      setLoading(false)
      return
    }

    // Step 2: Fetch latest design_revision for each product
    const productIds = productList.map(p => p.product_id)
    const { data: revisions } = await supabase
      .from('design_revisions')
      .select('product_id, status, revision_number')
      .in('product_id', productIds)
      .order('revision_number', { ascending: false })

    const revByProduct: Record<string, { status: string | null; count: number }> = {}
    if (revisions) {
      for (const r of revisions) {
        if (r.product_id) {
          if (!revByProduct[r.product_id]) {
            revByProduct[r.product_id] = { status: r.status, count: 0 }
          }
          revByProduct[r.product_id].count++
        }
      }
    }

    // Enrich products with revision info
    const enriched = productList.map(p => ({
      ...p,
      _latestRevisionStatus: revByProduct[p.product_id]?.status || null,
      _revisionCount: revByProduct[p.product_id]?.count || 0,
    }))

    setMolds(enriched)
    setLoading(false)
  }, [debouncedSearch, page])

  useEffect(() => { fetchData() }, [fetchData])

  const renderBadge = (status: string | null) => {
    if (!status) return <span className="badge badge--neutral" style={{ fontSize: 10 }}>—</span>
    const cfg = STATUS_BADGE[status]
    if (!cfg) return <span className="badge badge--neutral" style={{ fontSize: 10 }}>{status}</span>
    return (
      <span className={cfg.cls} style={{ fontSize: 10 }}>
        <span style={{ fontFamily: 'var(--font-jp)', fontWeight: 700 }}>{t('status.' + cfg.key)}</span>
      </span>
    )
  }

  return (
    <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: 'var(--space-3)' }}>
          <PenTool size={20} style={{ color: 'var(--accent)' }} />
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', lineHeight: 1.3 }}>
              {t('designs.title')}
            </h1>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('designs.subtitle')}</span>
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="card-flat" style={{ padding: '8px 12px' }}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Layers size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-jp)' }}>
              {t('designs.moldList')}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              ({t('designs.moldsCount', { count: totalRecords })})
            </span>
          </div>
          <div className="relative">
            <Search size={14} style={{ position: 'absolute', left: 8, top: 8, color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder={t('designs.searchPlaceholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="form-input"
              style={{ height: 30, paddingLeft: 28, fontSize: 12, width: 280 }}
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
        </div>
      </div>

      {/* ── Data Table ── */}
      {loading ? (
        <div className="card-flat" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
          {t('designs.loading')}
        </div>
      ) : error ? (
        <div className="card-flat" style={{ padding: 16, color: 'var(--status-error)', fontSize: 12 }}>
          {t('designs.error')}: {error}
        </div>
      ) : molds.length === 0 ? (
        <div className="card-flat" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
          {t('designs.noData')}
        </div>
      ) : (
        <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 130 }}>
                  <span style={{ fontFamily: 'var(--font-jp)' }}>{t('designs.cols.moldCode')}</span>
                </th>
                <th>
                  <span style={{ fontFamily: 'var(--font-jp)' }}>{t('designs.cols.product')}</span>
                </th>
                <th style={{ width: 140 }}>
                  <span style={{ fontFamily: 'var(--font-jp)' }}>{t('designs.cols.customerProductName')}</span>
                </th>
                <th style={{ width: 140 }}>
                  <span style={{ fontFamily: 'var(--font-jp)' }}>{t('designs.cols.customer')}</span>
                </th>
                <th style={{ width: 80, textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-jp)' }}>{t('designs.cols.revision')}</span>
                </th>
                <th style={{ width: 130, textAlign: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-jp)' }}>{t('designs.cols.latestStatus')}</span>
                </th>
                <th style={{ width: 50, textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {molds.map(m => (
                <tr key={m.product_id}>
                  <td>
                    <Link
                      href={`/engineering/designs/${m.product_id}`}
                      style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'monospace', fontSize: 13, textDecoration: 'none' }}
                    >
                      {m.product_code}
                    </Link>
                  </td>
                  <td>
                    {m.product_name || m.product_name_internal ? (
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {m.product_name || m.product_name_internal}
                        </span>
                        {m.product_name && m.product_name_internal && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>
                            ({m.product_name_internal})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                      {m.customer_product_name || '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                      {m.companies?.company_name || '—'}
                    </span>
                    {m.companies?.company_code && (
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>
                        {m.companies.company_code}
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {m._revisionCount ? (
                      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
                        {m._revisionCount}
                      </span>
                    ) : (
                      <Link
                        href={`/engineering/designs/${m.product_id}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3,
                          padding: '3px 8px', borderRadius: 'var(--radius-sm)',
                          background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                          border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                          color: 'var(--accent)', fontSize: 10, fontWeight: 700,
                          textDecoration: 'none', whiteSpace: 'nowrap',
                        }}
                        title={t('designs.createDesign')}
                      >
                        <Plus size={10} />
                        <span style={{ fontFamily: 'var(--font-jp)' }}>{t('designs.createDesign')}</span>
                      </Link>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {m._revisionCount ? (
                      renderBadge(m._latestRevisionStatus ?? null)
                    ) : (
                      <span className="badge badge--neutral" style={{ fontSize: 10 }}>
                        <span style={{ fontFamily: 'var(--font-jp)' }}>{t('status.UNPLANNED')}</span>
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Link
                      href={`/engineering/designs/${m.product_id}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-default)', background: 'var(--bg-surface)',
                        color: 'var(--accent)', cursor: 'pointer', textDecoration: 'none',
                      }}
                      title={t('designs.details')}
                    >
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalRecords > PAGE_SIZE && (
        <Pagination
          currentPage={page}
          totalRecords={totalRecords}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </div>
  )
}
