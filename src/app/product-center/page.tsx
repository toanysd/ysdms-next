'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Search, Package, ArrowRight, Database, LayoutGrid, Table,
  RotateCcw, CheckSquare, Square, ExternalLink, Filter, Clock,
  ArrowUp, ArrowDown, ArrowUpDown, Building2, X, Plus, Sparkles
} from 'lucide-react'

import { Pagination } from '@/components/ui/Pagination'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'
import Link from 'next/link'

import ProductFilterDrawer, { ProductFilterState, INITIAL_PRODUCT_FILTERS } from './_components/ProductFilterDrawer'
import CreateProductModal from './_components/CreateProductModal'
import { ManufacturingSheetOCRModal } from '@/components/ocr/ManufacturingSheetOCRModal'

type ProductStatus = 'ACTIVE' | 'MAINTENANCE' | 'DISPOSED'

type ProductItem = {
  product_id: string
  product_code: string
  product_name: string | null
  product_name_internal: string | null
  customer_product_name: string | null
  product_status: ProductStatus
  pocket_count: number | null
  notes: string | null
  product_description: string | null
  first_shipment_date: string | null
  created_at: string
  updated_at: string
  companies: {
    company_id: string
    company_name: string
    company_code: string
  } | null
  _design?: {
    plastic_type_designed: string | null
    design_length: number | null
    design_width: number | null
    design_height: number | null
    design_depth: number | null
  } | null
}

type ViewMode = 'grid' | 'table'
type SortDir = 'asc' | 'desc' | null
type SortColumn = 'product_code' | 'product_name' | 'customer' | 'pocket_count' | 'product_status' | 'first_shipment_date'

const PAGE_SIZE = 48

type ColumnDef = {
  key: string
  sortKey?: SortColumn
  labelKey: string
  fallbackLabel: string
  align: 'left' | 'center' | 'right'
  minWidth: number
  defaultWidth: number
  resizable: boolean
}

const TABLE_COLUMNS: ColumnDef[] = [
  { key: 'select', labelKey: '', fallbackLabel: '', align: 'center', minWidth: 36, defaultWidth: 36, resizable: false },
  { key: 'product_code', sortKey: 'product_code', labelKey: 'productCode', fallbackLabel: 'Product Code', align: 'left', minWidth: 90, defaultWidth: 110, resizable: true },
  { key: 'product_name', sortKey: 'product_name', labelKey: 'productName', fallbackLabel: 'Product Name', align: 'left', minWidth: 160, defaultWidth: 280, resizable: true },
  { key: 'dimensions', labelKey: 'dimensions', fallbackLabel: 'Dimensions', align: 'left', minWidth: 80, defaultWidth: 120, resizable: true },
  { key: 'plastic', labelKey: 'plasticSpec', fallbackLabel: 'Material', align: 'left', minWidth: 80, defaultWidth: 140, resizable: true },
  { key: 'pocket_count', sortKey: 'pocket_count', labelKey: 'pocketCount', fallbackLabel: 'Pockets', align: 'center', minWidth: 50, defaultWidth: 70, resizable: true },
  { key: 'customer', sortKey: 'customer', labelKey: 'customer', fallbackLabel: 'Customer', align: 'left', minWidth: 80, defaultWidth: 140, resizable: true },
  { key: 'status', sortKey: 'product_status', labelKey: 'status', fallbackLabel: 'Status', align: 'center', minWidth: 60, defaultWidth: 80, resizable: true },
  { key: 'first_shipment_date', sortKey: 'first_shipment_date', labelKey: 'firstShipmentDate', fallbackLabel: 'First Ship', align: 'center', minWidth: 80, defaultWidth: 100, resizable: true },
  { key: 'action', labelKey: '', fallbackLabel: '', align: 'center', minWidth: 70, defaultWidth: 80, resizable: false },
]

function buildFuzzyPatterns(trimmed: string): string[] {
  const clean = trimmed.replace(/[%_]/g, '')
  const compact = clean.replace(/[\s\-_]/g, '')
  const chunks = compact.match(/[a-zA-Z]+|\d+/g)

  const patterns = new Set<string>()
  patterns.add(`%${clean}%`)
  if (chunks && chunks.length > 1) {
    patterns.add(`%${chunks.join('%')}%`)
  } else if (compact) {
    patterns.add(`%${compact}%`)
  }
  return Array.from(patterns)
}

export default function ProductCenterIndexPage() {
  const tPC = useTranslations('ProductCenter')
  const tProd = useTranslations('Products')
  const tMaster = useTranslations('Master')
  const tCust = useTranslations('Customers')
  const tCommon = useTranslations('Common')

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const initialSearch = searchParams.get('search') || ''
  const initialStatus = (searchParams.get('status') as ProductStatus | 'ALL') || 'ALL'
  const initialView = (searchParams.get('view') as ViewMode) || 'table'

  const [query, setQuery] = useState(initialSearch)
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | 'ALL'>(initialStatus)
  const [viewMode, setViewMode] = useState<ViewMode>(initialView)
  const [currentPage, setCurrentPage] = useState(1)

  const [products, setProducts] = useState<ProductItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('search_product_center')

  // Advanced Filter Drawer State
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false)
  const [filterState, setFilterState] = useState<ProductFilterState>(INITIAL_PRODUCT_FILTERS)
  const [companiesList, setCompaniesList] = useState<Array<{ company_id: string; company_code: string; company_name: string }>>([])
  const [plasticTypesList, setPlasticTypesList] = useState<string[]>([])

  const [sortColumn, setSortColumn] = useState<SortColumn | null>('first_shipment_date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    TABLE_COLUMNS.forEach(c => { initial[c.key] = c.defaultWidth })
    return initial
  })

  const resizingRef = useRef<{ colKey: string; startX: number; startWidth: number } | null>(null)

  // Sync search input with URL search param
  useEffect(() => {
    const urlQuery = searchParams.get('search') || ''
    setQuery(urlQuery)
  }, [searchParams])

  // Fetch filter options on mount
  useEffect(() => {
    async function loadOptions() {
      const { data: comp } = await supabase
        .from('companies')
        .select('company_id, company_code, company_name')
        .order('company_code', { ascending: true })
      if (comp) setCompaniesList(comp)

      const { data: revs } = await supabase
        .from('design_revisions')
        .select('plastic_type_designed')
        .not('plastic_type_designed', 'is', null)
        .limit(200)
      if (revs) {
        const set = new Set(revs.map(r => r.plastic_type_designed?.trim()).filter(Boolean) as string[])
        setPlasticTypesList(Array.from(set).slice(0, 30))
      }
    }
    loadOptions()
  }, [supabase])

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      let req = supabase
        .from('products')
        .select(`
          product_id, product_code, product_name, product_name_internal, customer_product_name,
          product_status, pocket_count, notes, product_description, first_shipment_date, created_at, updated_at,
          companies:companies!products_company_id_fkey(company_id, company_name, company_code)
        `, { count: 'exact' })

      if (query.trim().length > 0) {
        const patterns = buildFuzzyPatterns(query.trim())
        const orConditions: string[] = []
        patterns.forEach(pat => {
          orConditions.push(`product_code.ilike.${pat}`)
          orConditions.push(`product_name.ilike.${pat}`)
          orConditions.push(`product_name_internal.ilike.${pat}`)
          orConditions.push(`customer_product_name.ilike.${pat}`)
          orConditions.push(`product_description.ilike.${pat}`)
        })
        req = req.or(orConditions.join(','))
      }

      const activeStatusFilter = filterState.status !== 'ALL' ? filterState.status : selectedStatus
      if (activeStatusFilter !== 'ALL') {
        req = req.eq('product_status', activeStatusFilter)
      } else {
        req = req.neq('product_status', 'MERGED')
      }

      if (filterState.companyId) {
        req = req.eq('company_id', filterState.companyId)
      }

      if (filterState.pocketMin) {
        req = req.gte('pocket_count', Number(filterState.pocketMin))
      }

      if (filterState.pocketMax) {
        req = req.lte('pocket_count', Number(filterState.pocketMax))
      }

      const from = (currentPage - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const serverSortable: SortColumn[] = ['product_code', 'product_name', 'pocket_count', 'product_status', 'first_shipment_date']
      if (sortColumn && sortDir && serverSortable.includes(sortColumn)) {
        req = req.order(sortColumn, { ascending: sortDir === 'asc', nullsFirst: false })
      } else {
        req = req.order('first_shipment_date', { ascending: false, nullsFirst: false })
      }

      const { data, count, error } = await req.range(from, to)

      if (error) throw error

      if (data) {
        let items = data as unknown as ProductItem[]

        if (sortColumn === 'customer' && sortDir) {
          items = [...items].sort((a, b) => {
            const aVal = a.companies?.company_code || ''
            const bVal = b.companies?.company_code || ''
            return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
          })
        }

        const productIds = items.map(p => p.product_id)
        if (productIds.length > 0) {
          const { data: revs } = await supabase
            .from('design_revisions')
            .select('product_id, plastic_type_designed, design_length, design_width, design_height, design_depth')
            .in('product_id', productIds)
            .order('created_at', { ascending: false })

          if (revs && revs.length > 0) {
            const designMap = new Map<string, typeof revs[0]>()
            for (const r of revs) {
              if (r.product_id && !designMap.has(r.product_id)) {
                designMap.set(r.product_id, r)
              }
            }
            items = items.map(p => ({
              ...p,
              _design: designMap.get(p.product_id) ? {
                plastic_type_designed: designMap.get(p.product_id)!.plastic_type_designed,
                design_length: designMap.get(p.product_id)!.design_length,
                design_width: designMap.get(p.product_id)!.design_width,
                design_height: designMap.get(p.product_id)!.design_height,
                design_depth: designMap.get(p.product_id)!.design_depth,
              } : null
            }))
          }
        }

        setProducts(items)
        setTotalCount(count || 0)
      }
    } catch (err) {
      console.error('Error fetching product center list:', err)
    } finally {
      setIsLoading(false)
    }
  }, [query, selectedStatus, filterState, currentPage, sortColumn, sortDir, supabase])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const isDraggingRef = useRef(false)

  const activeFilterCount = Object.entries(filterState).filter(([k, v]) => {
    if (k === 'status') return v !== 'ALL'
    return Boolean(v)
  }).length

  const handleSort = (col: SortColumn) => {
    if (isDraggingRef.current) return

    if (sortColumn !== col) {
      setSortColumn(col)
      setSortDir(col === 'first_shipment_date' ? 'desc' : 'asc')
    } else if (sortDir === 'asc') {
      setSortDir('desc')
    } else if (sortDir === 'desc') {
      setSortDir('asc')
    } else {
      setSortColumn('first_shipment_date')
      setSortDir('desc')
    }
    setCurrentPage(1)
  }

  const SortIcon = ({ col }: { col: SortColumn }) => {
    if (sortColumn !== col) return <ArrowUpDown size={11} style={{ opacity: 0.3 }} />
    if (sortDir === 'asc') return <ArrowUp size={11} style={{ color: 'var(--accent)' }} />
    return <ArrowDown size={11} style={{ color: 'var(--accent)' }} />
  }

  const handleResizeStart = (colKey: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDraggingRef.current = false
    const startX = e.clientX
    const startWidth = columnWidths[colKey] || 100
    resizingRef.current = { colKey, startX, startWidth }

    const handleMouseMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return
      isDraggingRef.current = true
      const delta = ev.clientX - startX
      const col = TABLE_COLUMNS.find(c => c.key === colKey)
      const minW = col?.minWidth || 50
      const newWidth = Math.max(minW, startWidth + delta)
      setColumnWidths(prev => ({ ...prev, [colKey]: newWidth }))
    }

    const handleMouseUp = () => {
      resizingRef.current = null
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      setTimeout(() => { isDraggingRef.current = false }, 100)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleSearchSubmit = (val: string) => {
    setQuery(val)
    if (val.trim()) addToHistory(val.trim())
    setCurrentPage(1)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(products.map(p => p.product_id)))
    }
  }

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  const resetFilters = () => {
    setQuery('')
    setSelectedStatus('ALL')
    setFilterState(INITIAL_PRODUCT_FILTERS)
    setCurrentPage(1)
    setSelectedIds(new Set())
    setSortColumn(null)
    setSortDir(null)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/product-center`)
  }

  const statusTabLabels: Record<ProductStatus | 'ALL', string> = {
    ALL: tCommon('all'),
    ACTIVE: tMaster('activeStatus'),
    MAINTENANCE: tMaster('maintenanceStatus'),
    DISPOSED: tMaster('disposedStatus'),
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>

      {/* Header Bar */}
      <div style={{
        flexShrink: 0, padding: '6px 14px',
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-surface)',
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}>
        {/* Left: Icon + Title + Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Database size={16} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
            {tProd('title')}
          </span>
          <span className="badge badge--info font-mono font-bold" style={{ fontSize: 10 }}>
            {totalCount}
          </span>
        </div>

        {/* Center: Active Query Pill & Advanced Filter Drawer Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, flexWrap: 'wrap' }}>
          {query && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px',
              background: 'var(--tint-teal-bg)', border: '1px solid var(--tint-teal-border)',
              borderRadius: 14, fontSize: 11, fontWeight: 700, color: 'var(--tint-teal-text)'
            }}>
              <Search size={12} />
              <span>&quot;{query}&quot;</span>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete('search')
                  router.push(`/product-center`)
                }}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                <X size={12} />
              </button>
            </div>
          )}

          {/* Advanced Filter Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="btn btn-secondary cursor-pointer"
            style={{
              height: 28, padding: '0 10px', fontSize: 11, gap: 5, flexShrink: 0,
              border: activeFilterCount > 0 ? '1px solid var(--accent)' : '1px solid var(--border-default)',
              background: activeFilterCount > 0 ? 'var(--tint-teal-bg)' : 'var(--bg-surface-2)',
              color: activeFilterCount > 0 ? 'var(--tint-teal-text)' : 'var(--text-secondary)'
            }}
          >
            <Filter size={13} style={{ color: activeFilterCount > 0 ? 'var(--accent)' : 'var(--text-muted)' }} />
            <span>{tPC('activeFiltersCount', { count: activeFilterCount })}</span>
          </button>
        </div>

        {/* Right: View Toggle + Status Filters + Reset + Master Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, flexWrap: 'wrap' }}>
          {/* View Mode Toggle */}
          <div style={{ display: 'inline-flex', padding: 1, background: 'var(--bg-surface-2)', borderRadius: 5, border: '1px solid var(--border-default)' }}>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              style={{
                display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px',
                borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                background: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'grid' ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              <LayoutGrid size={12} /><span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px',
                borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700,
                background: viewMode === 'table' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'table' ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              <Table size={12} /><span>Table</span>
            </button>
          </div>

          {/* Status Filter Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Filter size={12} style={{ color: 'var(--text-muted)' }} />
            {(['ALL', 'ACTIVE', 'MAINTENANCE', 'DISPOSED'] as const).map(s => {
              const isActive = selectedStatus === s
              const label = statusTabLabels[s]
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSelectedStatus(s)
                    setCurrentPage(1)
                  }}
                  style={{
                    padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer', border: '1px solid transparent',
                    background: isActive ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'var(--bg-surface-2)',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    borderColor: isActive ? 'var(--accent)' : 'var(--border-default)',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Select All */}
          <button
            type="button"
            onClick={toggleSelectAll}
            className="btn btn-secondary cursor-pointer"
            style={{ height: 26, padding: '0 8px', fontSize: 11, gap: 3 }}
          >
            {selectedIds.size > 0 && selectedIds.size === products.length ? (
              <CheckSquare size={12} style={{ color: 'var(--accent)' }} />
            ) : (
              <Square size={12} style={{ color: 'var(--text-muted)' }} />
            )}
            {selectedIds.size > 0 && (
              <span className="badge badge--info font-bold" style={{ fontSize: 9 }}>{selectedIds.size}</span>
            )}
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={resetFilters}
            className="btn btn-secondary cursor-pointer"
            style={{ height: 26, padding: '0 7px', fontSize: 11, gap: 3, color: 'var(--text-muted)' }}
          >
            <RotateCcw size={12} />
          </button>

          {/* AI OCR Button */}
          <button
            type="button"
            onClick={() => setIsOcrModalOpen(true)}
            className="btn"
            style={{
              height: 26,
              padding: '0 10px',
              fontSize: 11,
              gap: 4,
              background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <Sparkles size={13} />
            <span>AI 工程票取込</span>
          </button>

          {/* Create Product Button */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
            style={{ height: 26, padding: '0 10px', fontSize: 11, gap: 4 }}
          >
            <Plus size={13} />
            <span>{tProd('newProduct') || '新規登録'}</span>
          </button>

          {/* Master Link */}
          <Link
            href="/master/products"
            className="btn btn-secondary text-[11px] font-bold"
            style={{ height: 26, padding: '0 8px', gap: 3, textDecoration: 'none' }}
          >
            <Package size={12} />
            <span>Master</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            {tCommon('loading')}
          </div>
        ) : products.length === 0 ? (
          <div className="card-flat" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', margin: 'auto' }}>
            <Package size={44} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
            <div style={{ fontSize: 14, fontWeight: 700 }}>{tCommon('noData')}</div>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 10, padding: 10 }}>
            {products.map(p => {
              const isSelected = selectedIds.has(p.product_id)
              const statusText = statusTabLabels[p.product_status] || p.product_status

              return (
                <div
                  key={p.product_id}
                  className="card-flat"
                  style={{
                    padding: 0, overflow: 'hidden', cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-default)',
                    boxShadow: isSelected ? '0 0 0 1px var(--accent)' : 'none',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}
                  onClick={() => router.push(`/product-center/${p.product_id}`)}
                >
                  {/* Card Header */}
                  <div style={{
                    padding: '7px 10px', background: 'var(--bg-surface-2)',
                    borderBottom: '1px solid var(--border-default)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span onClick={e => { e.stopPropagation(); toggleSelectOne(p.product_id); }}>
                        {isSelected ? <CheckSquare size={14} style={{ color: 'var(--accent)' }} /> : <Square size={14} style={{ color: 'var(--text-muted)' }} />}
                      </span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: 'var(--accent)' }}>
                        {p.product_code}
                      </span>
                    </div>
                    <span className={`badge ${
                      p.product_status === 'ACTIVE' ? 'badge--success font-bold' :
                      p.product_status === 'MAINTENANCE' ? 'badge--warning font-bold' :
                      'badge--neutral font-bold'
                    }`} style={{ fontSize: 9 }}>
                      {statusText}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '8px 10px', display: 'flex', gap: 10, flex: 1 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 6, flexShrink: 0,
                      background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Package size={22} style={{ color: 'var(--accent)', opacity: 0.5 }} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.product_description || '—'}
                      </div>
                      {p.companies && (
                        <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Building2 size={10} style={{ color: 'var(--text-muted)' }} />
                          <span style={{ fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>{p.companies.company_code}</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>— {p.companies.company_name}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 2 }}>
                        {(() => {
                          const d = p._design
                          const dims = d ? [d.design_length, d.design_width, d.design_depth || d.design_height].filter(Boolean) : []
                          if (dims.length === 0) return null
                          return (
                            <span style={{ fontSize: 10, background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 3, padding: '1px 5px', fontFamily: 'monospace', fontWeight: 600 }}>
                              {dims.join('×')}
                            </span>
                          )
                        })()}
                        {p.pocket_count && (
                          <span style={{ fontSize: 10, background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: 3, padding: '1px 5px', fontWeight: 700, fontFamily: 'monospace' }}>
                            {p.pocket_count} Pkt
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div style={{
                    padding: '5px 10px', borderTop: '1px solid var(--border-subtle)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'monospace' }}>
                      <Clock size={10} /> {p.first_shipment_date || (p.updated_at ? p.updated_at.slice(0, 10) : '—')}
                    </span>
                    <span style={{ color: 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                      {tProd('title')} <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* TABLE VIEW */
          <div style={{ flex: 1, overflow: 'auto' }}>
            <table className="data-table" style={{ width: '100%', tableLayout: 'fixed' }}>
              <colgroup>
                {TABLE_COLUMNS.map(col => (
                  <col key={col.key} style={{ width: columnWidths[col.key] || col.defaultWidth }} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  {TABLE_COLUMNS.map(col => (
                    <th
                      key={col.key}
                      style={{
                        textAlign: col.align as any,
                        position: 'relative',
                        cursor: col.sortKey ? 'pointer' : 'default',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                      }}
                      onClick={() => col.sortKey && handleSort(col.sortKey)}
                    >
                      {col.key === 'select' ? (
                        <span onClick={e => { e.stopPropagation(); toggleSelectAll(); }} style={{ cursor: 'pointer' }}>
                          {selectedIds.size > 0 && selectedIds.size === products.length ? (
                            <CheckSquare size={14} style={{ color: 'var(--accent)' }} />
                          ) : (
                            <Square size={14} style={{ color: 'var(--text-muted)' }} />
                          )}
                        </span>
                      ) : col.key === 'action' ? (
                        <span></span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          {col.key === 'product_code' ? tProd('productCode') :
                           col.key === 'product_name' ? tProd('productName') :
                           col.key === 'dimensions' ? tPC('dimensions') :
                           col.key === 'plastic' ? tPC('plasticSpec') :
                           col.key === 'pocket_count' ? tProd('pocketCount') :
                           col.key === 'customer' ? tCust('customer') :
                           col.key === 'status' ? tCommon('status') :
                           col.key === 'first_shipment_date' ? tPC('firstShipmentDate') : col.fallbackLabel}
                          {col.sortKey && <SortIcon col={col.sortKey} />}
                        </span>
                      )}

                      {col.resizable && (
                        <div
                          onMouseDown={e => handleResizeStart(col.key, e)}
                          onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                          style={{
                            position: 'absolute', right: 0, top: 0, bottom: 0, width: 6,
                            cursor: 'col-resize', zIndex: 2,
                          }}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map(p => {
                  const isSelected = selectedIds.has(p.product_id)
                  const statusText = statusTabLabels[p.product_status] || p.product_status

                  return (
                    <tr
                      key={p.product_id}
                      style={{
                        background: isSelected ? 'color-mix(in srgb, var(--accent) 6%, transparent)' : undefined,
                        cursor: 'pointer'
                      }}
                      onClick={() => router.push(`/product-center/${p.product_id}`)}
                    >
                      <td style={{ textAlign: 'center' }} onClick={e => { e.stopPropagation(); toggleSelectOne(p.product_id); }}>
                        {isSelected ? <CheckSquare size={14} style={{ color: 'var(--accent)' }} /> : <Square size={14} style={{ color: 'var(--text-muted)' }} />}
                      </td>

                      <td>
                        <Link
                          href={`/product-center/${p.product_id}`}
                          className="font-mono font-semibold text-[13px]"
                          style={{ color: 'var(--accent)', textDecoration: 'none' }}
                          onClick={e => e.stopPropagation()}
                        >
                          {p.product_code}
                        </Link>
                      </td>

                      <td>
                        {p.product_description || p.product_name ? (
                          <div className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>
                            {p.product_description || p.product_name}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>—</span>
                        )}
                      </td>

                      <td>
                        {(() => {
                          const d = p._design
                          if (!d) return <span style={{ color: 'var(--text-muted)' }}>—</span>
                          const dims = [d.design_length, d.design_width, d.design_depth || d.design_height].filter(Boolean)
                          if (dims.length === 0) return <span style={{ color: 'var(--text-muted)' }}>—</span>
                          return (
                            <span className="font-mono text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                              {dims.join('×')}
                            </span>
                          )
                        })()}
                      </td>

                      <td>
                        {(() => {
                          const plastic = p._design?.plastic_type_designed
                          if (!plastic) return <span style={{ color: 'var(--text-muted)' }}>—</span>
                          return (
                            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                              {plastic}
                            </span>
                          )
                        })()}
                      </td>

                      <td className="font-mono text-[13px] text-center" style={{ color: 'var(--text-secondary)' }}>
                        {p.pocket_count || '—'}
                      </td>

                      <td>
                        {p.companies ? (
                          <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>
                            <span className="font-mono font-semibold" style={{ color: 'var(--accent)' }}>{p.companies.company_code}</span> — {p.companies.company_name}
                          </span>
                        ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${
                          p.product_status === 'ACTIVE' ? 'badge--success' :
                          p.product_status === 'MAINTENANCE' ? 'badge--warning' :
                          'badge--neutral'
                        }`} style={{ fontSize: 9 }}>
                          {statusText}
                        </span>
                      </td>

                      <td className="font-mono text-[12px] text-center" style={{ color: 'var(--text-secondary)' }}>
                        {p.first_shipment_date || '—'}
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <Link
                          href={`/product-center/${p.product_id}`}
                          className="btn btn-secondary text-[10px]"
                          style={{ height: 24, padding: '0 8px', gap: 3, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                          onClick={e => e.stopPropagation()}
                        >
                          <ExternalLink size={11} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalRecords={totalCount}
        pageSize={PAGE_SIZE}
        onPageChange={page => setCurrentPage(page)}
      />

      {/* Advanced Filter Drawer */}
      <ProductFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filterState}
        onApplyFilters={newFilters => {
          setFilterState(newFilters)
          setCurrentPage(1)
        }}
        onResetFilters={resetFilters}
        companiesList={companiesList}
        plasticTypesList={plasticTypesList}
      />

      {/* Create Product Modal */}
      <CreateProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(productId) => {
          setIsCreateModalOpen(false)
          fetchProducts()
          router.push(`/product-center/${productId}`)
        }}
      />

      {/* AI Manufacturing Sheet OCR Modal */}
      <ManufacturingSheetOCRModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        onSuccess={(res) => {
          setIsOcrModalOpen(false)
          fetchProducts()
          if (res?.product_id) {
            router.push(`/product-center/${res.product_id}`)
          }
        }}
      />

    </div>
  )
}