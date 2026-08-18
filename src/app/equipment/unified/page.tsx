'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  Search, X, Loader2, ArrowLeft, ArrowUpFromLine,
  ArrowUp, ArrowDown, ArrowUpDown, Layers, FileText,
  Trash2, Pencil, PenTool
} from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import EquipmentDetailModal from '@/app/equipment/_components/detail-modal/EquipmentDetailModal'

type EquipmentType = 'ALL' | 'MOLD' | 'CUTTER' | 'WATER_BASE' | 'PRESSURE_BASE' | 'FRAME' | 'STACKING'

type Equipment = {
  equipment_id: string
  equipment_code: string
  display_name: string
  equipment_type: string
  dimensions: string | null
  actual_length_mm: string | null
  actual_width_mm: string | null
  actual_height_mm: string | null
  device_status: string
  usage_status: string
  material_spec: string | null
  manufacturing_date: string | null
  companies: { company_name: string; company_code: string } | null
  rack_layers: {
    layer_code: string
    racks: { rack_code: string } | null
  } | null
  created_at: string
}

function UnifiedEquipmentPageContent() {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const urlSearchParams = useSearchParams()
  const t = useTranslations('EquipmentUnified')

  const [equipmentList, setEquipmentList] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState(urlSearchParams.get('search') || '')
  
  const [filterType, setFilterType] = useState<EquipmentType>('ALL')

  // Sorting
  const [sortCol, setSortCol] = useState(urlSearchParams.get('sort') || 'created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>((urlSearchParams.get('dir') as 'asc' | 'desc') || 'desc')

  // Pagination & Search
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const PAGE_SIZE = 50
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('search_equipment_unified')

  // Selected Equipment Modal
  const [selectedEquipId, setSelectedEquipId] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
      if (search.trim().length >= 2) addToHistory(search.trim())
    }, 400)
    return () => clearTimeout(timer)
  }, [search, addToHistory])

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
  }, [filterType])

  const fetchEquipment = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    let query = supabase
      .from('equipment')
      .select(`
        equipment_id, equipment_code, display_name, equipment_type,
        dimensions, actual_length_mm, actual_width_mm, actual_height_mm,
        device_status, usage_status, material_spec, manufacturing_date,
        companies:companies!equipment_company_id_fkey(company_name, company_code),
        rack_layers(
          layer_code,
          racks(rack_code)
        )
      `, { count: 'exact' })
      .order(sortCol, { ascending: sortDir === 'asc' })

    if (filterType !== 'ALL') {
      if (filterType === 'CUTTER') {
        query = query.in('equipment_type', ['CUTTER_SEPARATE', 'CUTTER_INLINE'])
      } else {
        query = query.eq('equipment_type', filterType)
      }
    }
    
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim()
      query = query.or(`equipment_code.ilike.%${q}%,display_name.ilike.%${q}%`)
    }

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, error: err, count } = await query
    if (err) setError(err.message)
    else {
      setEquipmentList((data as unknown as Equipment[]) || [])
      setTotalRecords(count || 0)
    }
    setLoading(false)
  }, [filterType, debouncedSearch, page, sortCol, sortDir])

  useEffect(() => {
    fetchEquipment()
  }, [fetchEquipment])

  const formatSize = (dim: string | null, l: string | null, w: string | null, h: string | null) => {
    if (dim) return dim
    if (!l && !w && !h) return '—'
    return `${l || '-'}×${w || '-'}×${h || '-'}`
  }

  const formatRackLocation = (m: Equipment) => {
    const layer = m.rack_layers?.layer_code
    const rack = m.rack_layers?.racks?.rack_code
    if (rack && layer) return `${rack}-${layer.replace(rack + '-', '')}`
    return rack || layer || '—'
  }

  const getTypeBadgeClass = (type: string) => {
    if (type === 'MOLD') return 'badge--info'
    if (type === 'CUTTER_SEPARATE' || type === 'CUTTER_INLINE') return 'badge--warning'
    if (type === 'WATER_BASE') return 'badge--success'
    if (type === 'PRESSURE_BASE') return 'badge--error'
    return 'badge--neutral'
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown size={11} className="text-slate-400 opacity-50" />
    return sortDir === 'asc' ? <ArrowUp size={11} className="text-accent" /> : <ArrowDown size={11} className="text-accent" />
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

  const SortTh = ({ col, label, w, style, className }: { col?: string; label: string; w?: number | string; style?: React.CSSProperties, className?: string }) => {
    const baseClass = "text-left font-bold text-[10px] uppercase p-2 border-b text-slate-500 whitespace-nowrap"
    if (!col) return (
      <th className={`${baseClass} ${className || ''}`} style={{ width: w, fontFamily: 'var(--font-jp)', ...style }}>
        {label}
      </th>
    )
    return (
      <th className={`${baseClass} cursor-pointer select-none ${className || ''}`} style={{ width: w, fontFamily: 'var(--font-jp)', ...style }} onClick={() => handleSort(col)}>
        <div className="flex items-center gap-1">
          <div>
            {label}
          </div>
          <SortIcon col={col} />
        </div>
      </th>
    )
  }

  const getUnifiedTypeLabel = (type: string) => {
    switch (type) {
      case 'MOLD': return t('typeLabels.MOLD')
      case 'CUTTER_SEPARATE': return t('typeLabels.CUTTER_SEPARATE')
      case 'CUTTER_INLINE': return t('typeLabels.CUTTER_INLINE')
      case 'WATER_BASE': return t('typeLabels.WATER_BASE')
      case 'PRESSURE_BASE': return t('typeLabels.PRESSURE_BASE')
      case 'FRAME': return t('typeLabels.FRAME')
      case 'STACKING': return t('typeLabels.STACKING')
      default: return type
    }
  }

  const getUnifiedStatusLabel = (status: string) => {
    switch (status) {
      case 'NORMAL': return t('statusLabels.NORMAL')
      case 'STORAGE': return t('statusLabels.STORAGE')
      case 'ACTIVE': return t('statusLabels.ACTIVE')
      case 'LOAN': return t('statusLabels.LOAN')
      case 'DISPOSED': return t('statusLabels.DISPOSED')
      case 'MAINTENANCE': return t('statusLabels.MAINTENANCE')
      default: return status
    }
  }

  const tabs: { type: EquipmentType; labelKey: string }[] = [
    { type: 'ALL', labelKey: 'filterAll' },
    { type: 'MOLD', labelKey: 'filterMold' },
    { type: 'CUTTER', labelKey: 'filterCutter' },
    { type: 'WATER_BASE', labelKey: 'filterWaterBase' },
    { type: 'PRESSURE_BASE', labelKey: 'filterPressureBase' },
    { type: 'FRAME', labelKey: 'filterFrame' },
    { type: 'STACKING', labelKey: 'filterStacking' },
  ]

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11 }}
          >
            <ArrowLeft size={13} />
          </button>
          <div className="flex items-center gap-2">
            <Layers size={18} style={{ color: 'var(--text-muted)' }} />
            <div>
              <h1 className="text-[15px] font-bold leading-tight" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-jp)' }}>{t('title')}</h1>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-flat flex flex-col gap-3" style={{ padding: '8px 12px' }}>
        <div className="flex items-center gap-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.type}
              onClick={() => setFilterType(tab.type)}
              className={`px-3 py-1.5 text-[12px] font-bold border-b-2 transition-colors ${filterType === tab.type ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              style={{ fontFamily: 'var(--font-jp)', marginBottom: '-1px' }}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1" style={{ minWidth: 200, maxWidth: 320 }}>
            <Search size={14} className="absolute left-2 top-[7px]" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder={t('searchPlaceholder')}
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
        </div>
      </div>

      {error && (
        <div className="card-flat text-[12px] flex items-center justify-between text-red-500 p-3 bg-red-50 border border-red-200">
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)} className="text-red-500"><X size={14} /></button>
        </div>
      )}

      {/* Table */}
      <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table w-full" style={{ borderCollapse: 'collapse', minWidth: 1050 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                <SortTh col="equipment_code" label={t('cols.code')} w={110} />
                <SortTh col="display_name" label={t('cols.name')} w={140} />
                <SortTh col="equipment_type" label={t('cols.type')} w={100} />
                <SortTh label={t('cols.dimensions')} w={120} />
                <SortTh col="material_spec" label={t('cols.material')} w={100} />
                <SortTh label={t('cols.customer')} w={130} />
                <SortTh label={t('cols.location')} w={100} />
                <SortTh col="usage_status" label={t('cols.status')} w={100} />
                <SortTh label={t('cols.actions')} w={80} />
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={9} className="p-8 text-center text-xs text-slate-500"><Loader2 size={16} className="animate-spin inline mr-2" />{t('loading')}</td></tr>}
              {!loading && equipmentList.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-xs text-slate-500">{t('noData')}</td></tr>}
              {!loading && equipmentList.map((m, idx) => {
                const customer = m.companies
                const badgeClass = getTypeBadgeClass(m.equipment_type)
                
                return (
                  <tr key={m.equipment_id} className={idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-50'} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td className="p-2 text-xs font-mono font-bold">
                      <button
                        onClick={() => setSelectedEquipId(m.equipment_id)}
                        style={{ color: 'var(--accent)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 700 }}
                        title={t('details')}
                      >
                        {m.equipment_code}
                      </button>
                    </td>
                    <td className="p-2 text-xs">{m.display_name}</td>
                    <td className="p-2">
                      <span className={`badge ${badgeClass} text-[10px]`}>
                        {getUnifiedTypeLabel(m.equipment_type)}
                      </span>
                    </td>
                    <td className="p-2 text-[11px] font-mono font-semibold">
                      {formatSize(m.dimensions, m.actual_length_mm, m.actual_width_mm, m.actual_height_mm)}
                    </td>
                    <td className="p-2 text-[11px]">
                      {m.material_spec || '—'}
                    </td>
                    <td className="p-2 text-[11px]">
                      {customer ? (
                        <div>
                          <div className="font-bold">{customer.company_code}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{customer.company_name}</div>
                        </div>
                      ) : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="p-2 text-[11px] font-mono font-semibold">{formatRackLocation(m)}</td>
                    <td className="p-2">
                      <div className="flex flex-col gap-0.5">
                        <span className={`badge ${m.usage_status === 'IN' ? 'badge--success' : m.usage_status === 'OUT' ? 'badge--warning' : 'badge--neutral'} text-[10px]`}>
                          {getUnifiedStatusLabel(m.usage_status)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {m.manufacturing_date ? m.manufacturing_date.slice(0, 10) : '—'}
                        </span>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setSelectedEquipId(m.equipment_id)}
                          className="btn btn-secondary h-6 w-6 p-0 flex items-center justify-center"
                          title={t('details')}
                        >
                          <ArrowUpFromLine size={12} className="rotate-90" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t">
          <Pagination 
            currentPage={page} 
            totalRecords={totalRecords} 
            pageSize={PAGE_SIZE} 
            onPageChange={setPage} 
          />
        </div>
      </div>

      {/* Equipment Detail Modal */}
      <EquipmentDetailModal
        isOpen={Boolean(selectedEquipId)}
        onClose={() => setSelectedEquipId(null)}
        equipmentId={selectedEquipId}
        onUpdateSuccess={fetchEquipment}
        onNavigate={(id) => setSelectedEquipId(id)}
      />
    </div>
  )
}

export default function UnifiedEquipmentPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-slate-500">Loading...</div>}>
      <UnifiedEquipmentPageContent />
    </Suspense>
  )
}
