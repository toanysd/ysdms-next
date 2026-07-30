'use client'

import { useTranslations, useLocale } from 'next-intl'

import { useEffect, useState, useCallback, useMemo } from 'react'
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
  // mold_masters DEPRECATED — Products = MoldMasters = Tray
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

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<ProductStatus, { ja: string; vi: string; color: string; bg: string; border: string }> = {
  ACTIVE: {
    ja: '有効',
    vi: 'Hoạt động',
    color: 'var(--status-success)',
    bg: 'color-mix(in srgb, var(--status-success) 12%, transparent)',
    border: 'color-mix(in srgb, var(--status-success) 25%, transparent)',
  },
  MAINTENANCE: {
    ja: 'メンテ中',
    vi: 'Bảo trì',
    color: 'var(--status-warning)',
    bg: 'color-mix(in srgb, var(--status-warning) 12%, transparent)',
    border: 'color-mix(in srgb, var(--status-warning) 25%, transparent)',
  },
  DISPOSED: {
    ja: '廃止',
    vi: 'Ngừng',
    color: 'var(--text-muted)',
    bg: 'color-mix(in srgb, var(--text-muted) 12%, transparent)',
    border: 'color-mix(in srgb, var(--text-muted) 25%, transparent)',
  },
}

const STATUS_TABS: { key: ProductStatus | 'ALL'; ja: string; vi: string }[] = [
  { key: 'ALL', ja: '全て', vi: 'Tất cả' },
  { key: 'ACTIVE', ja: '有効', vi: 'Hoạt động' },
  { key: 'MAINTENANCE', ja: 'メンテ中', vi: 'Bảo trì' },
  { key: 'DISPOSED', ja: '廃止', vi: 'Ngừng' },
]

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

import React, { Suspense } from 'react'

function ProductsPageContent() {
  const t = useTranslations()
  const locale = useLocale()
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
      setPage(1) // Reset to page 1 on search change
      if (searchQuery.trim()) {
        addToHistory(searchQuery.trim())
      }
    }, 500)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // ── Write search & sort back to URL so router.back() restores state ──
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortCol, sortDir])

  useEffect(() => {
    setPage(1) // Reset to page 1 on status filter change
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

  // New Customer Modal
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false)

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  // ─── Data Fetching ──────────────────────────────────────────────────────

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

    // Pagination
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, debouncedSearchQuery, page, sortCol, sortDir])

  const fetchCompanies = useCallback(async () => {
    let allData: Company[] = []
    let hasMore = true
    let page = 0

    while (hasMore) {
      const { data, error } = await supabase
        .from('companies')
        .select('company_id, company_name, company_code, company_type')
        .order('company_code', { ascending: true })
        .range(page * 1000, (page + 1) * 1000 - 1)

      if (error) break
      if (data) {
        allData = [...allData, ...(data as Company[])]
        if (data.length < 1000) {
          hasMore = false
        } else {
          page++
        }
      } else {
        hasMore = false
      }
    }
    
    setCompanies(allData)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  // ─── Customer companies filter (CUSTOMER type) ─────────────────────────

  const customerCompanies = useMemo(() => {
    return companies.filter(c => {
      if (!c.company_type) return true // show all if no type
      if (Array.isArray(c.company_type)) {
        return c.company_type.some(t => t.toUpperCase().includes('CUSTOMER'))
      }
      return String(c.company_type).toUpperCase().includes('CUSTOMER')
    })
  }, [companies])

  // ─── CRUD Handlers ─────────────────────────────────────────────────────

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
      setError('製品コードは必須です / Mã SP là bắt buộc')
      setSaving(false)
      return
    }
    if (codeExists) {
      setError('製品コードは既に存在します / Mã SP này đã tồn tại')
      setSaving(false)
      return
    }
    if (!form.company_id) {
      setError('得意先は必須です / Khách hàng là bắt buộc')
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

    // Products = MoldMasters — no need for separate mold_master creation

    const { data, error: err } = await supabase
      .from('products')
      .insert([basePayload])
      .select('product_id')
      .single()
    if (err) {
      setError(err.code === '23505' ? '製品コードは既に存在します / Mã SP này đã tồn tại' : err.message)
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
    // Refresh companies list and select the new company
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

  // ─── Table Helpers ──────────────────────────────────────────────────────

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown size={11} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
    return sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />
  }

  const handleSort = (col: string) => {
    if (sortCol === col) {
      if (sortDir === 'asc') setSortDir('desc')
      else { setSortCol('created_at'); setSortDir('desc') } // default
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const SortTh = ({ col, ja, vi, w, style }: { col?: string; ja: string; vi: string; w?: number | string; style?: React.CSSProperties }) => {
    if (!col) return (
      <th style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'left', whiteSpace: 'nowrap', width: w, borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-jp)', ...style }}>
        {locale === 'vi' ? vi : ja}
      </th>
    )
    return (
      <th style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'left', whiteSpace: 'nowrap', width: w, borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-jp)', cursor: 'pointer', userSelect: 'none', ...style }} onClick={() => handleSort(col)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div>
            {locale === 'vi' ? vi : ja}
          </div>
          <SortIcon col={col} />
        </div>
      </th>
    )
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-3">
      {/* Back / Up Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => router.back()}
          className="btn btn-secondary"
          style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11 }}
          title="前のページに戻る / Quay lại trang trước"
        >
          <ArrowLeft size={13} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>戻る</span>
        </button>
        <Link
          href="/master/products"
          className="btn btn-secondary"
          style={{
            height: 28, padding: '0 8px', gap: 3, fontSize: 11,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
          }}
          title="一覧へ / Về danh sách sản phẩm"
        >
          <ArrowUpFromLine size={12} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>一覧</span>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package size={18} style={{ color: 'var(--accent)' }} />
          <div>
            <h1
              className="text-[15px] font-bold leading-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}
            >
              製品マスター
            </h1>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Sản phẩm (Trung tâm hệ thống)
            </span>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="btn btn-primary h-[32px] px-3 text-[12px] font-bold rounded flex items-center gap-1"
        >
          <Plus size={14} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>新規追加</span>
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
                placeholder="コード・製品名で検索... / Tìm kiếm"
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
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1 rounded text-[11px] font-bold transition-colors font-[family-name:var(--font-jp)] ${
                  statusFilter === tab.key 
                    ? 'bg-[var(--accent)] text-white shadow-sm' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
                }`}
              >
                {tab.ja} <span className="opacity-70 ml-1">{tab.key === 'ALL' ? totalRecords : ''}</span>
              </button>
            ))}
          </div>
          
          <div className="text-[12px] text-[var(--text-muted)] font-[family-name:var(--font-jp)] whitespace-nowrap ml-auto">
            {totalRecords} 件
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
          <table className="data-table w-full" style={{ borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                <SortTh col="product_code" ja="コード" vi="Mã" w={100} />
                <SortTh col="product_name" ja="製品名" vi="Tên SP" w={180} />
                <SortTh col="mold_code" ja="金型コード" vi="Mã khuôn" w={110} />
                <SortTh col="company_id" ja="得意先" vi="Khách hàng" w={140} />
                <SortTh ja="顧客部品番号" vi="Mã KH" w={120} />
                <SortTh col="pocket_count" ja="ポケット数" vi="Pocket" w={70} />
                <SortTh col="pcs_per_box" ja="箱入数" vi="Pcs/Box" w={70} />
                <SortTh ja="箱仕様" vi="Box Spec" w={90} />
                <SortTh col="product_status" ja="状態" vi="Status" w={75} />
                <SortTh ja="操作" vi="" w={90} />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                    <Loader2 size={16} className="animate-spin inline-block mr-2" />
                    読み込み中...
                  </td>
                </tr>
              )}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                    データがありません / Không có dữ liệu
                  </td>
                </tr>
              )}
              {!loading && products.map((p, idx) => {
                const st = STATUS_LABELS[p.product_status] || STATUS_LABELS.ACTIVE
                return (
                  <tr
                    key={p.product_id}
                    style={{
                      background: idx % 2 === 0 ? 'transparent' : 'var(--bg-surface-2)',
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.1s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 6%, transparent)')}
                    onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'var(--bg-surface-2)')}
                  >
                    <td style={{ padding: '6px 10px', fontSize: 13, fontFamily: 'monospace', fontWeight: 700 }}><Link href={`/master/products/${p.product_id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>{p.product_code}</Link></td>
                    <td style={{ padding: '6px 10px', fontSize: 12 }}><div style={{ fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{p.product_name || '—'}</div></td>
                    <td style={{ padding: '6px 10px', fontSize: 11, fontFamily: 'monospace' }}>
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
                                fontWeight: 600,
                                textDecoration: 'none',
                              }}
                              onClick={e => e.stopPropagation()}
                            >
                              {dr.design_code}
                            </Link>
                          ))}
                          {p.design_revisions.length > 3 && (
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{p.design_revisions.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '6px 10px', fontSize: 11 }}>{p.companies ? <div><span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{p.companies.company_name}</span></div> : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td style={{ padding: '6px 10px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{p.customer_product_name || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td style={{ padding: '6px 10px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-primary)', textAlign: 'center' }}>{p.pocket_count != null ? p.pocket_count : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td style={{ padding: '6px 10px', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-primary)', textAlign: 'center' }}>{p.pieces_per_box != null ? p.pieces_per_box : <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td style={{ padding: '6px 10px', fontSize: 11, color: 'var(--text-secondary)' }}>{p.box_spec || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                    <td style={{ padding: '6px 10px' }}><span className="inline-flex items-center px-[6px] py-[1px] rounded-full text-[10px] font-bold whitespace-nowrap" style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}>{st.ja}</span></td>
                    <td style={{ padding: '6px 10px' }}>
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        <Link href={`/master/products/${p.product_id}`} title="詳細" className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><Pencil size={14} /></Link>
                        <button onClick={() => setDeleteTarget(p)} title="削除" className="flex items-center justify-center rounded" style={{ width: 32, height: 32, background: 'transparent', border: '1px solid color-mix(in srgb, var(--status-error) 30%, transparent)', color: 'var(--status-error)', cursor: 'pointer' }}><Trash2 size={14} /></button>
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

      {/* ─── Delete Confirmation Dialog ──────────────────────────────────── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="card-flat"
            style={{ padding: 20, width: 380 }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-[13px] font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)', marginBottom: 4 }}>
              この製品を削除しますか？
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)', marginBottom: 4 }}>
              Bạn có chắc muốn xóa sản phẩm này? Thao tác không thể hoàn tác.
            </p>
            <div
              className="text-[12px] rounded"
              style={{
                padding: '6px 10px',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                marginBottom: 16,
              }}
            >
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>
                {deleteTarget.product_code}
              </span>
              <span style={{ margin: '0 6px', color: 'var(--text-muted)' }}>—</span>
              <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>
                {deleteTarget.product_name || '名前なし'}
              </span>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn btn-secondary h-[32px] px-3 text-[12px] rounded"
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDelete(deleteTarget.product_id)}
                className="h-[32px] px-3 text-[12px] rounded font-bold"
                style={{
                  background: 'var(--status-error)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Modal ────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', paddingTop: 60, overflowY: 'auto' }}
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
                <h2
                  className="text-[14px] font-bold"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}
                >
                  新規製品追加
                </h2>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Thêm sản phẩm mới
                </span>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="flex items-center justify-center rounded"
                style={{ width: 32, height: 32, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
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
                <FieldGroup label="製品コード" sub="Mã SP" required>
                  <input
                    type="text"
                    value={form.product_code}
                    onChange={e => setForm(f => ({ ...f, product_code: e.target.value.toUpperCase() }))}
                    placeholder="IRI-003A"
                    className="form-input w-full"
                    style={{ fontFamily: 'monospace', fontWeight: 700, borderColor: codeExists ? 'var(--status-error)' : undefined }}
                  />
                  {checkingCode && <div className="text-[10px] text-[var(--text-muted)] mt-1 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> チェック中... / Đang kiểm tra...</div>}
                  {!checkingCode && codeExists && <div className="text-[10px] font-bold mt-1" style={{ color: 'var(--status-error)' }}>⚠ このコードは既に存在します / Mã này đã tồn tại</div>}
                </FieldGroup>

                {/* Product Name */}
                <FieldGroup label="製品名" sub="Tên SP">
                  <input
                    type="text"
                    value={form.product_name}
                    onChange={e => setForm(f => ({ ...f, product_name: e.target.value }))}
                    placeholder="製品名を入力"
                    className="form-input w-full"
                    style={{ fontFamily: 'var(--font-jp)' }}
                  />
                </FieldGroup>

                {/* Customer — REQUIRED */}
                <FieldGroup label="得意先" sub="Khách hàng" required>
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
                      className="h-[32px] px-2 rounded flex items-center gap-1 shrink-0"
                      style={{
                        background: 'var(--accent-light)',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent)',
                        fontSize: '11px',
                        fontWeight: 600
                      }}
                      title="新規得意先追加 / Thêm khách hàng mới"
                    >
                      <UserPlus size={14} />
                      <span className="hidden sm:inline" style={{ fontFamily: 'var(--font-jp)' }}>新規</span>
                    </button>
                  </div>
                </FieldGroup>

                {/* Customer Product Name */}
                <FieldGroup label="顧客製品名" sub="Tên SP khách hàng">
                  <input
                    type="text"
                    value={form.customer_product_name || ''}
                    onChange={e => setForm(f => ({ ...f, customer_product_name: e.target.value || null }))}
                    placeholder="顧客の部品番号"
                    className="form-input w-full"
                    style={{ fontFamily: 'monospace' }}
                  />
                </FieldGroup>

                {/* Status */}
                <FieldGroup label="状態" sub="Trạng thái" required>
                  <select
                    value={form.product_status}
                    onChange={e => setForm(f => ({ ...f, product_status: e.target.value as ProductStatus }))}
                    className="form-input w-full"
                  >
                    {(Object.keys(STATUS_LABELS) as ProductStatus[]).map(k => (
                      <option key={k} value={k}>{STATUS_LABELS[k].ja} / {STATUS_LABELS[k].vi}</option>
                    ))}
                  </select>
                </FieldGroup>

                {/* Mold Master — auto-linked, read-only display */}
                <FieldGroup label="金型コード" sub="Mã khuôn (tự động)">
                  <div
                    className="form-input w-full"
                    style={{
                      fontFamily: 'monospace', fontSize: 12,
                      background: 'var(--bg-surface-2)',
                      color: form.mold_master_id ? 'var(--accent)' : 'var(--text-muted)',
                      cursor: 'default', display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    {form.mold_master_id ? (
                      <>✓ Đã liên kết</>
                    ) : (
                      <>→ Tự tạo khi lưu</>
                    )}
                  </div>
                </FieldGroup>
              </div>

              {/* Separator */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '12px 0' }} />

              {/* Packaging section */}
              <p className="text-[11px] font-bold" style={{ color: 'var(--text-secondary)', marginBottom: 8, fontFamily: 'var(--font-jp)' }}>
                梱包仕様 <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>Thông số đóng gói</span>
              </p>
              <div className="form-grid-2 gap-3">
                {/* Pocket Count */}
                <FieldGroup label="ポケット数" sub="Số pocket">
                  <input
                    type="number"
                    value={form.pocket_count ?? ''}
                    onChange={e => setForm(f => ({ ...f, pocket_count: e.target.value ? Number(e.target.value) : null }))}
                    placeholder="0"
                    className="form-input w-full"
                    style={{ fontFamily: 'monospace' }}
                  />
                </FieldGroup>

                {/* Pieces per Box */}
                <FieldGroup label="箱入数" sub="Số lượng/hộp">
                  <input
                    type="number"
                    value={form.pieces_per_box ?? ''}
                    onChange={e => setForm(f => ({ ...f, pieces_per_box: e.target.value ? Number(e.target.value) : null }))}
                    placeholder="0"
                    className="form-input w-full"
                    style={{ fontFamily: 'monospace' }}
                  />
                </FieldGroup>

                {/* Box Spec */}
                <FieldGroup label="箱仕様" sub="Quy cách hộp">
                  <input
                    type="text"
                    value={form.box_spec || ''}
                    onChange={e => setForm(f => ({ ...f, box_spec: e.target.value || null }))}
                    placeholder="箱仕様を入力"
                    className="form-input w-full"
                  />
                </FieldGroup>
              </div>

              {/* Separator */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '12px 0' }} />

              {/* Notes */}
              <div>
                <FieldGroup label="備考" sub="Ghi chú">
                  <textarea
                    value={form.notes || ''}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value || null }))}
                    rows={2}
                    className="form-textarea w-full"
                  />
                </FieldGroup>
              </div>
            </div>

            {/* ── Quick Links (always visible when saved) ── */}
            {savedSuccess && (form.mold_master_id || savedProductId || form.company_id) && (
              <div
                style={{
                  padding: '8px 16px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'color-mix(in srgb, var(--accent) 4%, var(--bg-surface-2))',
                  display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-jp)' }}>
                  関連 / Liên kết:
                </span>
                {(form.mold_master_id || savedProductId) && (
                  <Link
                    href={`/engineering/designs/${savedProductId || form.mold_master_id}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      padding: '3px 10px', borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                      fontSize: 11, color: 'var(--accent)', textDecoration: 'none',
                      fontWeight: 700, transition: 'all 0.15s',
                    }}
                    title="設計版を開く / Xem thiết kế"
                  >
                    <PenTool size={11} />
                    <span style={{ fontFamily: 'var(--font-jp)' }}>設計版</span>
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
                      fontWeight: 600, transition: 'all 0.15s',
                    }}
                    title="得意先詳細を開く / Mở trang khách hàng"
                  >
                    <Building2 size={11} />
                    <span style={{ fontFamily: 'var(--font-jp)' }}>得意先</span>
                    <ExternalLink size={9} style={{ opacity: 0.4 }} />
                  </Link>
                )}
              </div>
            )}

            {/* ── Modal Footer (Save/Cancel or Success) ── */}
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
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-success)', fontFamily: 'var(--font-jp)' }}>
                      登録完了
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>— 上の関連リンクから次へ進めます</span>
                  </div>
                  <button
                    onClick={() => { setSavedSuccess(false); setModalOpen(false) }}
                    className="btn btn-secondary h-[30px] px-3 text-[12px] rounded"
                  >
                    閉じる
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="btn btn-secondary h-[32px] px-3 text-[12px] rounded"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary h-[32px] px-3 text-[12px] rounded font-bold flex items-center gap-1"
                    style={{ opacity: saving ? 0.6 : 1 }}
                  >
                    {saving && <Loader2 size={12} className="animate-spin" />}
                    <Save size={14} />
                    <span style={{ fontFamily: 'var(--font-jp)' }}>
                      登録
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── New Customer Unified Modal ─────────────────────────────────────── */}
      <CompanyFormModal
        isOpen={newCustomerModalOpen}
        onClose={() => setNewCustomerModalOpen(false)}
        onSaved={handleCompanySaved}
      />
    </div>
  )
}

// ─── Field Group Helper ──────────────────────────────────────────────────────

function FieldGroup({
  label, sub, required, children,
}: {
  label: string
  sub: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold" style={{ color: 'var(--text-secondary)', marginBottom: 3, fontFamily: 'var(--font-jp)' }}>
        {label}
        {required && <span style={{ color: 'var(--status-error)', marginLeft: 2 }}>*</span>}
        <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: 4, fontSize: 10 }}>{sub}</span>
      </label>
      {children}
    </div>
  )
}

export default function ProductsPage() {
  const t = useTranslations()
  return (
    <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  )
}
