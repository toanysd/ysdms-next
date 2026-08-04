'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState, useCallback, useMemo, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, Pencil, Trash2, X, Save, Search, Package,
  Loader2, UserPlus, PenTool, Building2, ExternalLink, CheckCircle2,
  ArrowLeft, ArrowUpFromLine, ArrowUp, ArrowDown, ArrowUpDown
} from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'
import { CompanyFormModal } from '@/components/master/CompanyFormModal'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

// ─── Types ───────────────────────────────────────────────────────────────────

type ProductStatus = 'ACTIVE' | 'MAINTENANCE' | 'DISPOSED'

type Company = {
  company_id: string
  company_name: string
  company_code: string
  company_type?: string | string[] | null
}

type Product = {
  product_id: string
  product_code: string
  product_name: string
  product_name_en: string | null
  product_name_internal: string | null
  company_id: string
  mold_master_id: string | null
  customer_product_name: string | null
  product_status: ProductStatus
  pocket_count: number | null
  pieces_per_box: number | null
  box_spec: string | null
  notes: string | null
  created_at: string
  updated_at: string
  companies: {
    company_name: string
    company_code: string
  } | null
  design_revisions?: {
    revision_id: string
    design_code: string
    revision_number: number | null
  }[] | null
}

type ProductForm = {
  product_code: string
  product_name: string
  company_id: string
  customer_product_name: string | null
  product_status: ProductStatus
  mold_master_id: string | null
  pocket_count: number | null
  pieces_per_box: number | null
  box_spec: string | null
  notes: string | null
}

const EMPTY_FORM: ProductForm = {
  product_code: '',
  product_name: '',
  company_id: '',
  customer_product_name: null,
  product_status: 'ACTIVE',
  mold_master_id: null,
  pocket_count: null,
  pieces_per_box: null,
  box_spec: null,
  notes: null,
}

// ─── Component ───────────────────────────────────────────────────────────────

function ProductsPageContent() {
  const tProd = useTranslations('Products')
  const tMaster = useTranslations('Master')
  const tCust = useTranslations('Customers')
  const tCommon = useTranslations('Common')

  const supabase = createClient()
  const urlSearchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [products, setProducts] = useState<Product[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState(urlSearchParams.get('search') || '')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('search_products')

  // Sorting
  const [sortCol, setSortCol] = useState(urlSearchParams.get('sort') || 'created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>((urlSearchParams.get('dir') as 'asc' | 'desc') || 'desc')

  // Pagination
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const PAGE_SIZE = 50

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setPage(1)
      if (searchQuery.trim()) {
        addToHistory(searchQuery.trim())
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (searchQuery) params.set('search', searchQuery)
      if (sortCol !== 'created_at') params.set('sort', sortCol)
      if (sortDir !== 'desc') params.set('dir', sortDir)
      
      const newQS = params.toString()
      const currentQS = urlSearchParams.toString()
      if (newQS !== currentQS) {
        router.replace(`${pathname}${newQS ? '?' + newQS : ''}`, { scroll: false })
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery, sortCol, sortDir])

  useEffect(() => {
    setPage(1)
  }, [statusFilter])

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<ProductForm>({ ...EMPTY_FORM })

  const [codeExists, setCodeExists] = useState(false)
  const [checkingCode, setCheckingCode] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [savedProductId, setSavedProductId] = useState<string | null>(null)

  useEffect(() => {
    if (!modalOpen || !form.product_code) {
      setCodeExists(false)
      setCheckingCode(false)
      return
    }
    const timer = setTimeout(async () => {
      setCheckingCode(true)
      let query = supabase.from('products').select('product_id').eq('product_code', form.product_code).limit(1)
      const { data } = await query
      setCodeExists(!!data && data.length > 0)
      setCheckingCode(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [form.product_code, modalOpen, supabase])

  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('products')
      .select('*, companies!products_company_id_fkey(company_name, company_code), design_revisions(revision_id, design_code, revision_number)', { count: 'exact' })
      .order(sortCol, { ascending: sortDir === 'asc' })

    if (statusFilter !== 'ALL') {
      query = query.eq('product_status', statusFilter)
    }

    if (debouncedSearchQuery.trim()) {
      const q = debouncedSearchQuery.trim()
      query = query.or(`product_code.ilike.%${q}%,product_name.ilike.%${q}%`)
    }

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, error: err, count } = await query
    if (err) setError(err.message)
    else {
      setProducts((data as unknown as Product[]) || [])
      setTotalRecords(count || 0)
    }
    setLoading(false)
  }, [statusFilter, debouncedSearchQuery, page, sortCol, sortDir])

  const fetchCompanies = useCallback(async () => {
    let allData: Company[] = []
    let hasMore = true
    let pageIdx = 0

    while (hasMore) {
      const { data, error } = await supabase
        .from('companies')
        .select('company_id, company_name, company_code, company_type')
        .order('company_code', { ascending: true })
        .range(pageIdx * 1000, (pageIdx + 1) * 1000 - 1)

      if (error) break
      if (data) {
        allData = [...allData, ...(data as Company[])]
        if (data.length < 1000) {
          hasMore = false
        } else {
          pageIdx++
        }
      } else {
        hasMore = false
      }
    }
    
    setCompanies(allData)
  }, [supabase])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const customerCompanies = useMemo(() => {
    return companies.filter(c => {
      if (!c.company_type) return true
      if (Array.isArray(c.company_type)) {
        return c.company_type.some(t => t.toUpperCase().includes('CUSTOMER'))
      }
      return String(c.company_type).toUpperCase().includes('CUSTOMER')
    })
  }, [companies])

  const openAdd = () => {
    setForm({ ...EMPTY_FORM })
    setError(null)
    setSavedSuccess(false)
    setSavedProductId(null)
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    if (!form.product_code) {
      setError(tProd('productCode') + ' ' + tCommon('required'))
      setSaving(false)
      return
    }
    if (codeExists) {
      setError(tProd('productCode') + ' Error')
      setSaving(false)
      return
    }
    if (!form.company_id) {
      setError(tCust('customer') + ' ' + tCommon('required'))
      setSaving(false)
      return
    }

    const basePayload = {
      product_code: form.product_code,
      product_name: form.product_name,
      company_id: form.company_id,
      customer_product_name: form.customer_product_name || null,
      product_status: form.product_status,
      mold_master_id: form.mold_master_id || null,
      pocket_count: form.pocket_count,
      pieces_per_box: form.pieces_per_box,
      box_spec: form.box_spec || null,
      notes: form.notes || null,
    }

    const { data, error: err } = await supabase
      .from('products')
      .insert([basePayload])
      .select('product_id')
      .single()
    if (err) {
      setError(err.code === '23505' ? tProd('productCode') + ' Error' : err.message)
      setSaving(false)
      return
    } else {
      setSavedProductId(data.product_id)
      setSavedSuccess(true)
      setSaving(false)
      fetchProducts()
      return
    }
  }

  const handleCompanySaved = async (companyId: string) => {
    setNewCustomerModalOpen(false)
    const { data } = await supabase
      .from('companies')
      .select('company_id, company_name, company_code, company_type')
      .order('company_code', { ascending: true })
    if (data) {
      setCompanies(data as Company[])
      setForm(f => ({ ...f, company_id: companyId }))
    }
  }

  const handleDelete = async (id: string) => {
    const { error: err } = await supabase.from('products').delete().eq('product_id', id)
    if (err) setError(err.message)
    setDeleteTarget(null)
    fetchProducts()
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown size={11} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
    return sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />
  }

  const handleSort = (col: string) => {
    if (sortCol === col) {
      if (sortDir === 'asc') setSortDir('desc')
      else { setSortCol('created_at'); setSortDir('desc') }
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const statusTabLabels: Record<ProductStatus | 'ALL', string> = {
    ALL: tMaster('allStatus'),
    ACTIVE: tMaster('activeStatus'),
    MAINTENANCE: tMaster('maintenanceStatus'),
    DISPOSED: tMaster('disposedStatus'),
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Back / Up Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => router.back()}
          className="btn btn-secondary"
          style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11 }}
        >
          <ArrowLeft size={13} />
          <span>{tMaster('backButton')}</span>
        </button>
        <Link
          href="/master/products"
          className="btn btn-secondary"
          style={{
            height: 28, padding: '0 8px', gap: 3, fontSize: 11,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
          }}
        >
          <ArrowUpFromLine size={12} />
          <span>{tMaster('listButton')}</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package size={20} style={{ color: 'var(--accent)' }} />
          <div>
            <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
              {tProd('title')}
            </h1>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="btn btn-primary h-[32px] px-3 text-[12px] font-bold rounded flex items-center gap-1 cursor-pointer"
        >
          <Plus size={14} />
          <span>{tCommon('addNew')}</span>
        </button>
      </div>

      {/* Search + Status Tabs Bar */}
      <div className="card-flat" style={{ padding: '8px 12px' }}>
        <div className="flex items-center gap-4">
          <div style={{ position: 'relative' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input
                type="text"
                placeholder={tMaster('searchProduct')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="form-input form-input-search w-[280px] text-[12px]"
                style={{ height: 32 }}
              />
            </div>
            <SearchSuggestions
              history={history}
              visible={showSuggestions}
              onSelect={(q) => { setSearchQuery(q); setShowSuggestions(false) }}
              onRemove={removeFromHistory}
              onClear={clearHistory}
              onClose={() => setShowSuggestions(false)}
            />
          </div>
          
          <div className="flex items-center bg-[var(--bg-surface-2)] rounded p-1 border border-[var(--border-default)]">
            {(['ALL', 'ACTIVE', 'MAINTENANCE', 'DISPOSED'] as const).map(tabKey => (
              <button
                key={tabKey}
                onClick={() => setStatusFilter(tabKey)}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                  statusFilter === tabKey 
                    ? 'bg-[var(--accent)] text-white shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
                }`}
              >
                {statusTabLabels[tabKey]} <span className="opacity-70 ml-1">{tabKey === 'ALL' ? totalRecords : ''}</span>
              </button>
            ))}
          </div>
          
          <div className="text-[12px] text-[var(--text-muted)] font-bold whitespace-nowrap ml-auto font-mono">
            {totalRecords}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div
          className="card-flat text-[12px] flex items-center justify-between"
          style={{
            padding: '8px 12px',
            background: 'color-mix(in srgb, var(--status-error) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--status-error) 25%, transparent)',
            color: 'var(--status-error)',
          }}
        >
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--status-error)' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Data Table */}
      <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table w-full">
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                <th onClick={() => handleSort('product_code')} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    <span>{tProd('productCode')}</span>
                    <SortIcon col="product_code" />
                  </div>
                </th>
                <th onClick={() => handleSort('product_name')} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    <span>{tProd('productName')}</span>
                    <SortIcon col="product_name" />
                  </div>
                </th>
                <th>
                  <span>{tMaster('MoldMaster')}</span>
                </th>
                <th onClick={() => handleSort('company_id')} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1">
                    <span>{tCust('customer')}</span>
                    <SortIcon col="company_id" />
                  </div>
                </th>
                <th>{tProd('customerProductName')}</th>
                <th onClick={() => handleSort('pocket_count')} className="cursor-pointer select-none text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>{tProd('pocketCount')}</span>
                    <SortIcon col="pocket_count" />
                  </div>
                </th>
                <th onClick={() => handleSort('pieces_per_box')} className="cursor-pointer select-none text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>{tProd('piecesPerBox')}</span>
                    <SortIcon col="pieces_per_box" />
                  </div>
                </th>
                <th>{tProd('boxSpec')}</th>
                <th onClick={() => handleSort('product_status')} className="cursor-pointer select-none text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span>{tCommon('status')}</span>
                    <SortIcon col="product_status" />
                  </div>
                </th>
                <th style={{ width: 80, textAlign: 'center' }}>{tMaster('thaoTac')}</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={10} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                    <Loader2 size={16} className="animate-spin inline-block mr-2" />
                    {tCommon('loading')}
                  </td>
                </tr>
              )}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                    {tCommon('noData')}
                  </td>
                </tr>
              )}
              {!loading && products.map((p, idx) => {
                const stLabel = statusTabLabels[p.product_status] || p.product_status
                const isDiffBg = idx % 2 !== 0
                return (
                  <tr
                    key={p.product_id}
                    style={{
                      background: isDiffBg ? 'var(--bg-surface-2)' : 'transparent',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <td>
                      <Link href={`/master/products/${p.product_id}`} className="font-mono font-semibold text-[13px]" style={{ color: 'var(--accent)' }}>
                        {p.product_code}
                      </Link>
                    </td>
                    <td>
                      <div className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                        {p.product_name || '—'}
                      </div>
                    </td>
                    <td className="font-mono text-[11px]">
                      {p.design_revisions && p.design_revisions.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {p.design_revisions.slice(0, 3).map(dr => (
                            <Link
                              key={dr.revision_id}
                              href={`/engineering/designs/revisions/${dr.revision_id}`}
                              style={{
                                color: 'var(--accent)',
                                background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                                border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                                padding: '1px 5px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 500,
                                textDecoration: 'none',
                              }}
                            >
                              {dr.design_code}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ fontSize: 12 }}>
                      {p.companies ? (
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{p.companies.company_name}</span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td className="font-mono text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                      {p.customer_product_name || '—'}
                    </td>
                    <td className="font-mono text-[13px] text-center" style={{ color: 'var(--text-secondary)' }}>
                      {p.pocket_count ?? '—'}
                    </td>
                    <td className="font-mono text-[13px] text-center" style={{ color: 'var(--text-secondary)' }}>
                      {p.pieces_per_box ?? '—'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {p.box_spec || '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${
                        p.product_status === 'ACTIVE' ? 'badge--success' :
                        p.product_status === 'MAINTENANCE' ? 'badge--warning' :
                        'badge--neutral'
                      }`}>
                        {stLabel}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div className="flex items-center justify-center gap-1">
                        <Link href={`/master/products/${p.product_id}`} title={tCommon('edit')} className="p-1 rounded text-[var(--accent)] hover:bg-[var(--border-subtle)]">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => setDeleteTarget(p)} title={tCommon('delete')} className="p-1 rounded text-[var(--status-error)] hover:bg-[var(--border-subtle)] cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={page} 
          totalRecords={totalRecords} 
          pageSize={PAGE_SIZE} 
          onPageChange={setPage} 
        />
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="card-flat"
            style={{ padding: 20, width: 380 }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
              {tMaster('confirmDelete')}
            </p>
            <div
              className="text-[12px] rounded"
              style={{
                padding: '8px 12px',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                marginBottom: 16,
              }}
            >
              <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>
                {deleteTarget.product_code}
              </span>
              <span style={{ margin: '0 6px', color: 'var(--text-muted)' }}>—</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {deleteTarget.product_name || '—'}
              </span>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn btn-secondary text-[12px]"
              >
                {tCommon('cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteTarget.product_id)}
                className="btn btn-primary text-[12px] font-bold"
                style={{ background: 'var(--status-error)', borderColor: 'var(--status-error)' }}
              >
                {tCommon('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center"
          style={{ background: 'rgba(0,0,0,0.5)', paddingTop: 60, overflowY: 'auto' }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="card-flat"
            style={{ padding: 0, width: 560, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-default)',
                background: 'var(--bg-surface-2)',
              }}
            >
              <div>
                <h2 className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  {tCommon('addNew')}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="flex items-center justify-center rounded cursor-pointer"
                style={{ width: 32, height: 32, background: 'transparent', border: 'none', color: 'var(--text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 16 }}>
              {error && (
                <div style={{ padding: '8px 12px', background: 'color-mix(in srgb, var(--status-error) 10%, transparent)', color: 'var(--status-error)', fontSize: 12, borderRadius: 4, marginBottom: 16, border: '1px solid color-mix(in srgb, var(--status-error) 20%, transparent)' }}>
                  ⚠ {error}
                </div>
              )}
              <div className="form-grid-2 gap-3">
                {/* Product Code */}
                <div>
                  <label className="block text-[11px] font-bold" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                    {tProd('productCode')} <span style={{ color: 'var(--status-error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.product_code}
                    onChange={e => setForm(f => ({ ...f, product_code: e.target.value.toUpperCase() }))}
                    placeholder="IRI-003A"
                    className="form-input w-full font-mono font-bold text-[13px]"
                    style={{ borderColor: codeExists ? 'var(--status-error)' : undefined }}
                  />
                  {checkingCode && <div className="text-[10px] text-[var(--text-muted)] mt-1 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> {tCommon('loading')}</div>}
                  {!checkingCode && codeExists && <div className="text-[10px] font-bold mt-1" style={{ color: 'var(--status-error)' }}>⚠ {tProd('productCode')} Error</div>}
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-[11px] font-bold" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                    {tProd('productName')}
                  </label>
                  <input
                    type="text"
                    value={form.product_name}
                    onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
                    className="form-input w-full text-[13px]"
                  />
                </div>

                {/* Customer */}
                <div>
                  <label className="block text-[11px] font-bold" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                    {tCust('customer')} <span style={{ color: 'var(--status-error)' }}>*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <SearchableSelect
                        options={customerCompanies.map(c => ({
                          value: c.company_id,
                          label: `${c.company_code} — ${c.company_name}`
                        }))}
                        value={form.company_id || null}
                        onChange={val => setForm(f => ({ ...f, company_id: val || '' }))}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewCustomerModalOpen(true)}
                      className="h-[32px] px-2 rounded flex items-center gap-1 shrink-0 btn btn-secondary text-[11px] font-bold cursor-pointer"
                    >
                      <UserPlus size={14} />
                      <span className="hidden sm:inline">{tCommon('addNew')}</span>
                    </button>
                  </div>
                </div>

                {/* Customer Product Name */}
                <div>
                  <label className="block text-[11px] font-bold" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                    {tProd('customerProductName')}
                  </label>
                  <input
                    type="text"
                    value={form.customer_product_name || ''}
                    onChange={e => setForm(f => ({ ...f, customer_product_name: e.target.value || null }))}
                    className="form-input w-full font-mono text-[13px]"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[11px] font-bold" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                    {tCommon('status')} <span style={{ color: 'var(--status-error)' }}>*</span>
                  </label>
                  <select
                    value={form.product_status}
                    onChange={e => setForm(f => ({ ...f, product_status: e.target.value as ProductStatus }))}
                    className="form-input w-full text-[13px]"
                  >
                    {(['ACTIVE', 'MAINTENANCE', 'DISPOSED'] as ProductStatus[]).map(k => (
                      <option key={k} value={k}>{statusTabLabels[k]}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Separator */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '12px 0' }} />

              {/* Packaging section */}
              <p className="text-[12px] font-bold" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
                {tProd('packagingSpec')}
              </p>
              <div className="form-grid-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                    {tProd('pocketCount')}
                  </label>
                  <input
                    type="number"
                    value={form.pocket_count ?? ''}
                    onChange={e => setForm(f => ({ ...f, pocket_count: e.target.value ? Number(e.target.value) : null }))}
                    placeholder="0"
                    className="form-input w-full font-mono text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                    {tProd('piecesPerBox')}
                  </label>
                  <input
                    type="number"
                    value={form.pieces_per_box ?? ''}
                    onChange={e => setForm(f => ({ ...f, pieces_per_box: e.target.value ? Number(e.target.value) : null }))}
                    placeholder="0"
                    className="form-input w-full font-mono text-[13px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                    {tProd('boxSpec')}
                  </label>
                  <input
                    type="text"
                    value={form.box_spec || ''}
                    onChange={e => setForm(f => ({ ...f, box_spec: e.target.value || null }))}
                    className="form-input w-full text-[13px]"
                  />
                </div>
              </div>

              {/* Separator */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '12px 0' }} />

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-bold" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
                  {tProd('notes')}
                </label>
                <textarea
                  value={form.notes || ''}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value || null }))}
                  rows={2}
                  className="form-textarea w-full text-[12px]"
                />
              </div>
            </div>

            {/* Quick Links */}
            {savedSuccess && (form.mold_master_id || savedProductId || form.company_id) && (
              <div
                style={{
                  padding: '8px 16px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'color-mix(in srgb, var(--accent) 4%, var(--bg-surface-2))',
                  display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                }}
              >
                {(form.mold_master_id || savedProductId) && (
                  <Link
                    href={`/engineering/designs/${savedProductId || form.mold_master_id}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                      fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
                      fontWeight: 700,
                    }}
                  >
                    <PenTool size={11} />
                    <span>{tMaster('MoldMaster')}</span>
                    <ExternalLink size={9} style={{ opacity: 0.5 }} />
                  </Link>
                )}
                {form.company_id && (
                  <Link
                    href={`/master/customers/${form.company_id}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                      fontSize: 11, color: 'var(--text-primary)', textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    <Building2 size={11} />
                    <span>{tCust('customer')}</span>
                    <ExternalLink size={9} style={{ opacity: 0.4 }} />
                  </Link>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div
              style={{
                padding: '10px 16px',
                borderTop: '1px solid var(--border-default)',
                background: savedSuccess ? 'color-mix(in srgb, var(--status-success) 6%, var(--bg-surface-2))' : 'var(--bg-surface-2)',
              }}
            >
              {savedSuccess ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} style={{ color: 'var(--status-success)' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-success)' }}>
                      {tCommon('save')} OK
                    </span>
                  </div>
                  <button
                    onClick={() => { setSavedSuccess(false); setModalOpen(false) }}
                    className="btn btn-secondary h-[30px] px-3 text-[12px] rounded cursor-pointer"
                  >
                    {tCommon('cancel')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="btn btn-secondary h-[32px] px-3 text-[12px] rounded cursor-pointer"
                  >
                    {tCommon('cancel')}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary h-[32px] px-3 text-[12px] rounded font-bold flex items-center gap-1 cursor-pointer"
                    style={{ opacity: saving ? 0.6 : 1 }}
                  >
                    {saving && <Loader2 size={12} className="animate-spin" />}
                    <Save size={14} />
                    <span>
                      {tCommon('save')}
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Customer Unified Modal */}
      <CompanyFormModal
        isOpen={newCustomerModalOpen}
        onClose={() => setNewCustomerModalOpen(false)}
        onSaved={handleCompanySaved}
      />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  )
}

