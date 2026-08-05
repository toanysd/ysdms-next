'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Plus, Pencil, Trash2, X, Save, Filter, Search,
  ChevronDown, Loader2, Image as ImageIcon, Box, FileText,
  ArrowLeft, ArrowUpFromLine, CheckCircle2, PenTool, Hammer, Wrench,
  ArrowUp, ArrowDown, ArrowUpDown
} from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import Link from 'next/link'
import { CreateJobModal } from '@/components/equipment/CreateJobModal'
import { MoldModal, PhysicalMoldFormData } from '@/components/equipment/MoldModal'
import { useTranslations } from 'next-intl'

type MoldStatus = 'ACTIVE' | 'MAINTENANCE' | 'DISPOSED' | string
type StorageStatus = 'IN_STOCK' | 'IN_USE' | 'OUT_OF_STOCK' | string

type PhysicalMold = {
  physical_mold_id: string
  system_code: string
  display_name: string
  mold_revision_id: string | null
  device_status: MoldStatus
  usage_status: StorageStatus
  actual_length_mm: string | null
  actual_width_mm: string | null
  actual_height_mm: string | null
  actual_weight: string | null
  piece_count: number
  mold_type: string
  current_rack_layer_id: string | null
  created_at: string
  updated_at: string
  mold_revisions: {
    product_id: string
    revision_code: string
    products: {
      product_code: string
      product_name: string
      product_name_internal: string | null
      companies: { company_name: string; company_code: string } | null
    } | null
  } | null
  rack_layers: {
    layer_code: string
    racks: { rack_code: string } | null
  } | null
}

const STATUS_LABELS: Record<string, { key: string; color: string }> = {
  ACTIVE:      { key: 'ACTIVE',      color: 'var(--status-success)' },
  MAINTENANCE: { key: 'MAINTENANCE', color: 'var(--status-warning)' },
  DISPOSED:    { key: 'DISPOSED',    color: 'var(--status-error)' },
}

const STORAGE_LABELS: Record<string, { key: string; color: string }> = {
  IN_STOCK:     { key: 'IN_STOCK',     color: 'var(--status-success)' },
  IN_USE:       { key: 'IN_USE',       color: 'var(--status-info)' },
  OUT_OF_STOCK: { key: 'OUT_OF_STOCK', color: 'var(--text-muted)' },
}

import React, { Suspense } from 'react'

function MoldsPageContent() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const urlSearchParams = useSearchParams()
  const t = useTranslations('Equipment')

  const [molds, setMolds] = useState<PhysicalMold[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Init from URL params: ?search= 
  const [search, setSearch] = useState(
    urlSearchParams.get('search') || ''
  )
  const [filterStatus, setFilterStatus] = useState<MoldStatus | ''>('')
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Sorting
  const [sortCol, setSortCol] = useState(urlSearchParams.get('sort') || 'created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>((urlSearchParams.get('dir') as 'asc' | 'desc') || 'desc')

  // Pagination & Search
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const PAGE_SIZE = 50
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('search_molds')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to page 1 on search
      if (search.trim().length >= 2) addToHistory(search.trim())
    }, 500)
    return () => clearTimeout(timer)
  }, [search, addToHistory])

  // ── Write search back to URL so router.back() restores state ──
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
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
  }, [search, sortCol, sortDir])

  useEffect(() => {
    setPage(1)
  }, [filterStatus])

  // Forms
  const [modalInitialData, setModalInitialData] = useState<Partial<PhysicalMoldFormData>>({})

  // Job Creation state
  const [jobModalParams, setJobModalParams] = useState<{ physicalMoldId: string; designRevisionId: string; productId: string; productCode: string } | null>(null)

  const fetchMolds = useCallback(async () => {
    setLoading(true)
    setError(null)
    const masterFilter = urlSearchParams.get('master') || ''
    const revisionFilter = urlSearchParams.get('revision') || ''
    
    let query = supabase
      .from('equipment')
      .select(`
        *,
        design_revisions(
          product_id,
          design_code,
          products(
            product_code,
            product_name,
            product_name_internal,
            companies:companies!products_company_id_fkey(company_name, company_code)
          )
        ),
        rack_layers!current_rack_layer_id(
          layer_code,
          racks(rack_code)
        )
      `, { count: 'exact' })
      .in('equipment_type', ['MOLD', 'WATER_BASE', 'PRESSURE_BASE'])
      .order(sortCol === 'system_code' ? 'equipment_code' : sortCol, { ascending: sortDir === 'asc' })

    if (filterStatus) query = query.eq('device_status', filterStatus)
    
    if (revisionFilter) {
      query = query.ilike('equipment_code', `${revisionFilter}%`)
    } else if (masterFilter) {
      query = query.ilike('equipment_code', `${masterFilter}%`)
    }
    
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim()
      query = query.or(`equipment_code.ilike.%${q}%,display_name.ilike.%${q}%`)
    }

    // Pagination
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, error: err, count } = await query
    if (err) setError(err.message)
    else {
      const mapped = (data || []).map((e: any) => ({
        physical_mold_id: e.equipment_id,
        system_code: e.equipment_code,
        display_name: e.display_name,
        mold_revision_id: e.design_revision_id,
        device_status: e.device_status,
        usage_status: e.usage_status,
        actual_length_mm: e.actual_length_mm,
        actual_width_mm: e.actual_width_mm,
        actual_height_mm: e.actual_height_mm,
        actual_weight: e.actual_weight,
        piece_count: e.piece_count || 1,
        mold_type: e.mold_type || e.equipment_type,
        current_rack_layer_id: e.current_rack_layer_id,
        created_at: e.created_at,
        updated_at: e.updated_at,
        mold_revisions: e.design_revisions ? {
          product_id: e.design_revisions.product_id,
          revision_code: e.design_revisions.design_code,
          products: e.design_revisions.products
        } : null,
        rack_layers: e.rack_layers
      }))
      setMolds(mapped as unknown as PhysicalMold[])
      setTotalRecords(count || 0)
    }
    setLoading(false)
  }, [filterStatus, debouncedSearch, page, sortCol, sortDir])

  useEffect(() => {
    fetchMolds()
  }, [fetchMolds])

  const filteredMolds = molds

  // Auto-link revision from URL params (when coming from design page)
  const urlMaster = urlSearchParams.get('master') || ''
  const urlRevisionCode = urlSearchParams.get('revision') || ''

  const openCreate = () => {
    setEditingId(null)
    setModalInitialData({})
    setModalOpen(true)
  }

  const openEdit = (m: PhysicalMold) => {
    setEditingId(m.physical_mold_id)
    setModalOpen(true)
  }

  useEffect(() => {
    if (urlSearchParams.get('action') === 'new') {
      openCreate()
    }
  }, [urlSearchParams.get('action')])


  const handleDelete = async (id: string) => {
    const { error: err } = await supabase.from('equipment').delete().eq('equipment_id', id)
    if (err) setError(err.message)
    setDeleteId(null)
    fetchMolds()
  }

  const formatSize = (l: string | null, w: string | null, h: string | null) => {
    if (!l && !w && !h) return '—'
    return `${l || '-'}×${w || '-'}×${h || '-'}`
  }

  const formatRackLocation = (m: PhysicalMold) => {
    const layer = m.rack_layers?.layer_code
    const rack = m.rack_layers?.racks?.rack_code
    if (rack && layer) return `${rack}-${layer.replace(rack + '-', '')}`
    return rack || layer || '—'
  }

  const getMoldStatusLabel = (key: string) => {
    switch (key) {
      case 'ACTIVE': return t('status.ACTIVE')
      case 'MAINTENANCE': return t('status.MAINTENANCE')
      case 'DISPOSED': return t('status.DISPOSED')
      case 'IN_STOCK': return t('status.IN_STOCK')
      case 'IN_USE': return t('status.IN_USE')
      case 'OUT_OF_STOCK': return t('status.OUT_OF_STOCK')
      default: return key
    }
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const s = STATUS_LABELS[status]
    const color = s ? s.color : 'var(--text-muted)'
    return (
      <span className="inline-flex items-center px-[6px] py-[1px] rounded-full text-[10px] font-bold whitespace-nowrap" style={{ color: color, background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 25%, transparent)` }}>
        {s ? getMoldStatusLabel(s.key) : status}
      </span>
    )
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown size={11} className="text-slate-400 opacity-50" />
    return sortDir === 'asc' ? <ArrowUp size={11} className="text-accent" /> : <ArrowDown size={11} className="text-accent" />
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

  const SortTh = ({ col, ja, w, style, className }: { col?: string; ja: string; w?: number | string; style?: React.CSSProperties, className?: string }) => {
    const baseClass = "text-left font-bold text-[10px] uppercase p-2 border-b text-slate-500 whitespace-nowrap"
    if (!col) return (
      <th className={`${baseClass} ${className || ''}`} style={{ width: w, fontFamily: 'var(--font-jp)', ...style }}>
        {ja}
      </th>
    )
    return (
      <th className={`${baseClass} cursor-pointer select-none ${className || ''}`} style={{ width: w, fontFamily: 'var(--font-jp)', ...style }} onClick={() => handleSort(col)}>
        <div className="flex items-center gap-1">
          <div>
            {ja}
          </div>
          <SortIcon col={col} />
        </div>
      </th>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ── Header: Back/Up + Title + Add button ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back = browser back (preserves previous page state) */}
          <button
            onClick={() => router.back()}
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11 }}
            title={t('Molds.backTitle')}
          >
            <ArrowLeft size={13} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{t('Molds.back')}</span>
          </button>
          {/* Up = go to equipment top */}
          <Link
            href="/equipment/molds"
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            title={t('Molds.listTitle')}
            onClick={() => { setSearch(''); setFilterStatus('') }}
          >
            <ArrowUpFromLine size={12} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{t('Molds.list')}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Box size={18} style={{ color: 'var(--text-muted)' }} />
            <div>
              <h1 className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{t('Molds.title')}</h1>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('Molds.subtitle')}</span>
            </div>
          </div>
        </div>
        <button onClick={openCreate} className="h-[32px] px-3 text-[12px] font-bold rounded flex items-center gap-1.5" style={{ background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer' }}>
          <Plus size={14} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>{t('Molds.newRegister')}</span>
        </button>
      </div>

      <div className="card-flat" style={{ padding: '8px 12px' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1" style={{ minWidth: 200, maxWidth: 320 }}>
            <Search size={14} className="absolute left-2 top-[7px]" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder={t('Molds.searchPlaceholder')}
              className="form-input w-full"
              style={{ paddingLeft: 26, height: 28, fontSize: 11 }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 6, top: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
              >
                <X size={12} />
              </button>
            )}
            <SearchSuggestions
              history={history}
              onSelect={(q) => { setSearch(q); setShowSuggestions(false) }}
              onRemove={removeFromHistory}
              onClear={clearHistory}
              visible={showSuggestions && !search}
              onClose={() => setShowSuggestions(false)}
            />
          </div>
          <div className="relative">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as MoldStatus | '')} className="h-[28px] pl-2 pr-6 text-[11px] rounded border border-slate-300 appearance-none bg-white">
              <option value="">{t('Molds.statusAll')}</option>
              {Object.keys(STATUS_LABELS).map((k) => <option key={k} value={k}>{getMoldStatusLabel(STATUS_LABELS[k].key)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="card-flat text-[12px] flex items-center justify-between text-red-500 p-3 bg-red-50 border border-red-200">
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)} className="text-red-500"><X size={14} /></button>
        </div>
      )}

      <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
        {(urlSearchParams.get('master') || urlSearchParams.get('revision')) && (
          <div className="px-3 py-2 bg-slate-50 border-b text-[11px] text-slate-600 flex items-center justify-between">
            <span>
              <span className="font-bold mr-1">{t('Molds.filterLabel')}</span>
              <strong className="text-slate-800">
                {urlSearchParams.get('revision') || urlSearchParams.get('master')}
              </strong>
            </span>
            <button 
              onClick={() => {
                const p = new URLSearchParams(urlSearchParams.toString())
                p.delete('master')
                p.delete('revision')
                router.replace(`${pathname}${p.toString() ? '?' + p.toString() : ''}`)
              }}
              className="text-slate-400 hover:text-slate-800"
              title={t('Molds.clearFilter')}
            ><X size={14} /></button>
          </div>
        )}
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 1050 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                <SortTh col="system_code" ja={t('Molds.cols.code')} w={90} />
                <SortTh col="display_name" ja={t('Molds.cols.name')} w={120} />
                <SortTh ja={t('Molds.cols.product')} w={160} />
                <SortTh ja={t('Molds.cols.customer')} w={120} />
                <SortTh ja={t('Molds.cols.size')} w={130} />
                <SortTh ja={t('Molds.cols.rackLocation')} w={100} />
                <SortTh col="usage_status" ja={t('Molds.cols.storage')} w={65} />
                <SortTh col="device_status" ja={t('Molds.cols.status')} w={70} />
                <SortTh ja={t('Molds.cols.actions')} w={80} />
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={9} className="p-8 text-center text-xs text-slate-500"><Loader2 size={16} className="animate-spin inline mr-2" />{t('Molds.loading')}</td></tr>}
              {!loading && filteredMolds.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-xs text-slate-500">{t('Molds.noData')}</td></tr>}
              {!loading && filteredMolds.map((m, idx) => {
                const product = (m.mold_revisions as any)?.products
                const customer = product?.companies
                return (
                  <tr key={m.physical_mold_id} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50'} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-2 text-xs font-mono font-bold">
                      <Link
                        href={`/equipment/molds/${m.physical_mold_id}`}
                        style={{ color: 'var(--accent)', textDecoration: 'none' }}
                        title={t('Molds.actions.openDetails')}
                      >
                        {m.system_code}
                      </Link>
                    </td>
                    <td className="p-2 text-xs">{m.display_name}</td>
                    <td className="p-2 text-[11px]">
                      {product ? (
                        <div>
                          <div className="font-bold font-mono">{product.product_code}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{product.product_name}</div>
                        </div>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="p-2 text-[11px]">
                      {customer ? (
                        <div>
                          <div className="font-bold">{customer.company_code}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[110px]">{customer.company_name}</div>
                        </div>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="p-2 text-[11px] font-mono font-semibold">
                      {formatSize(m.actual_length_mm, m.actual_width_mm, m.actual_height_mm)}
                    </td>
                    <td className="p-2 text-[11px] font-mono font-semibold">{formatRackLocation(m)}</td>
                    <td className="p-2">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border bg-slate-100">{STORAGE_LABELS[m.usage_status] ? getMoldStatusLabel(STORAGE_LABELS[m.usage_status].key) : m.usage_status}</span>
                    </td>
                    <td className="p-2"><StatusBadge status={m.device_status} /></td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        {m.mold_revision_id && m.mold_revisions?.product_id && (
                          <Link
                            href={`/engineering/designs/${m.mold_revisions.product_id}?revision=${m.mold_revision_id}`}
                            className="p-1.5 border rounded hover:bg-slate-100 text-accent"
                            title={t('Molds.actions.designVersion')}
                          >
                            <PenTool size={12} />
                          </Link>
                        )}
                        {m.mold_revision_id && m.mold_revisions?.product_id && (
                          <button
                            onClick={() => setJobModalParams({
                              physicalMoldId: m.physical_mold_id,
                              designRevisionId: m.mold_revision_id!,
                              productId: m.mold_revisions!.product_id,
                              productCode: m.mold_revisions!.products?.product_code || ''
                            })}
                            className="p-1.5 border rounded hover:bg-slate-100 text-accent"
                            title={t('Molds.actions.createJob')}
                          >
                            <Hammer size={12} />
                          </button>
                        )}
                        <button onClick={() => window.open(`/api/pdf/mold-certificate?mold_id=${m.system_code}`, '_blank')} className="p-1.5 border rounded hover:bg-slate-100 text-slate-600" title={t('Molds.actions.print')}>
                          <FileText size={12} />
                        </button>
                        <button onClick={() => openEdit(m)} className="p-1.5 border rounded hover:bg-slate-100 text-slate-600" title={t('Molds.actions.edit')}><Pencil size={12} /></button>
                        <button onClick={() => setDeleteId(m.physical_mold_id)} className="p-1.5 border rounded hover:bg-red-50 text-red-500 border-red-200" title={t('Molds.actions.delete')}><Trash2 size={12} /></button>
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

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-lg p-5 w-[360px]" onClick={e => e.stopPropagation()}>
            <p className="font-bold text-[13px] mb-4">{t('Molds.deleteConfirmTitle')}</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-3 py-1.5 text-xs border rounded">{t('Molds.cancel')}</button>
              <button onClick={() => handleDelete(deleteId)} className="px-3 py-1.5 text-xs bg-red-500 text-white font-bold rounded">{t('Molds.deleteButton')}</button>
            </div>
          </div>
        </div>
      )}

      <MoldModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingId={editingId}
        initialData={modalInitialData}
        onSuccess={() => {
          fetchMolds()
        }}
      />

      {jobModalParams && (
        <CreateJobModal
          initialPhysicalMoldId={jobModalParams.physicalMoldId}
          initialDesignRevisionId={jobModalParams.designRevisionId}
          productId={jobModalParams.productId}
          productCode={jobModalParams.productCode}
          onClose={() => setJobModalParams(null)}
          onSuccess={(jobId) => {
            setJobModalParams(null)
            router.push(`/equipment/jobs/${jobId}`)
          }}
        />
      )}
    </div>
  )
}

export default function MoldsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading...</div>}>
      <MoldsPageContent />
    </Suspense>
  )
}
