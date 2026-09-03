'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pagination } from '@/components/ui/Pagination'
import { Search, Loader2, ArrowUp, ArrowDown, ArrowUpDown, AlertTriangle, Box, Layers, PackagePlus } from 'lucide-react'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'
import Link from 'next/link'

// ── Status labels ──
const STATUS_LABELS: Record<string, { ja: string; color: string; bg: string }> = {
  in_stock:  { ja: '在庫中', color: 'var(--status-success)', bg: 'color-mix(in srgb, var(--status-success) 12%, transparent)' },
  in_use:    { ja: '使用中', color: 'var(--status-warning)', bg: 'color-mix(in srgb, var(--status-warning) 12%, transparent)' },
  empty:     { ja: '消費済', color: 'var(--text-muted)',      bg: 'var(--bg-surface-2)' },
  returned:  { ja: '返品',   color: 'var(--status-info)',    bg: 'color-mix(in srgb, var(--status-info) 12%, transparent)' },
}

function StatCard({
  ja,
  value,
  unit,
  icon,
  color,
  onClick,
  active,
}: {
  ja: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  color: string
  onClick?: () => void
  active?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={`card-flat ${onClick ? 'cursor-pointer hover:border-slate-400 transition-all' : ''}`}
      style={{
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: active ? `2px solid ${color}` : undefined,
        background: active ? `color-mix(in srgb, ${color} 8%, transparent)` : undefined,
      }}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, background: `color-mix(in srgb, ${color} 12%, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
          {value}{unit && <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 2 }}>{unit}</span>}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-jp)', lineHeight: 1.2 }}>
          {ja} {active && <span style={{ color, fontWeight: 700 }}>[抽出中]</span>}
        </div>
      </div>
    </div>
  )
}

export default function PlasticsInventoryPage() {
  const supabase = createClient()
  const [rolls, setRolls] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Stats
  const [totalRolls, setTotalRolls] = useState(0)
  const [totalMeters, setTotalMeters] = useState(0)
  const [lowStockCount, setLowStockCount] = useState(0)
  const [inUseCount, setInUseCount] = useState(0)

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('search_plastic_inventory')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [familyFilter, setFamilyFilter] = useState('ALL')
  const [onlyLowStock, setOnlyLowStock] = useState(false)

  // Sort
  const [sortCol, setSortCol] = useState('current_length_m')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  // Pagination
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const PAGE_SIZE = 50

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
      if (searchQuery.trim()) addToHistory(searchQuery.trim())
    }, 500)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // Fetch stats on mount
  useEffect(() => {
    async function loadStats() {
      const { data: allRolls } = await supabase
        .from('plastic_receipt_roll')
        .select('current_length_m, status')
      if (allRolls) {
        const active = allRolls.filter(r => r.status === 'in_stock' || r.status === 'in_use')
        setTotalRolls(active.length)
        setTotalMeters(Math.round(active.reduce((sum, r) => sum + (r.current_length_m || 0), 0)))
        setLowStockCount(active.filter(r => (r.current_length_m || 0) <= 50).length)
        setInUseCount(allRolls.filter(r => r.status === 'in_use').length)
      }
    }
    loadStats()
  }, [supabase])

  const fetchRolls = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from('plastic_receipt_roll')
      .select('*, plastic_master!inner(plastic_code, plastic_family, plastic_subtype, thickness_mm, width_mm, color_name_normalized, color_code_raw), plastic_receipt(receipt_no, receipt_date)', { count: 'exact' })

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim()
      query = query.or(`roll_barcode.ilike.%${q}%,lot_no.ilike.%${q}%,supplier_name.ilike.%${q}%,plastic_master.plastic_code.ilike.%${q}%`)
    }

    if (statusFilter !== 'ALL') {
      query = query.eq('status', statusFilter)
    }
    if (familyFilter !== 'ALL') {
      query = query.ilike('plastic_master.plastic_family', `%${familyFilter}%`)
    }
    if (onlyLowStock) {
      query = query.lte('current_length_m', 50)
    }

    // Sort
    if (sortCol.startsWith('plastic_master.')) {
      query = query.order(sortCol.replace('plastic_master.', ''), { ascending: sortDir === 'asc', referencedTable: 'plastic_master' })
    } else {
      query = query.order(sortCol, { ascending: sortDir === 'asc' })
    }

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, count, error } = await query
    if (!error) {
      setRolls(data || [])
      setTotalRecords(count || 0)
    }
    setLoading(false)
  }, [debouncedSearch, statusFilter, familyFilter, onlyLowStock, page, sortCol, sortDir, supabase])

  useEffect(() => { fetchRolls() }, [fetchRolls])

  const handleSort = (col: string) => {
    if (sortCol === col) {
      if (sortDir === 'asc') setSortDir('desc')
      else { setSortCol('current_length_m'); setSortDir('asc') }
    } else { setSortCol(col); setSortDir('asc') }
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown size={10} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
    return sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />
  }

  const ThSort = ({ col, ja, w, align }: { col: string; ja: string; w?: number | string; align?: string }) => (
    <th onClick={() => handleSort(col)} style={{
      padding: '6px 8px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
      color: 'var(--text-muted)', textAlign: (align as any) || 'left', whiteSpace: 'nowrap',
      width: w, borderBottom: '1px solid var(--border-default)', cursor: 'pointer', userSelect: 'none', fontFamily: 'var(--font-jp)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        {ja} <SortIcon col={col} />
      </div>
    </th>
  )

  const COLOR_JA: Record<string, string> = {
    natural: 'ナチュラル', clear: 'クリア', black: '黒', white: '白',
    green: '緑', blue: '青', brown: '茶', gray: 'グレー', unknown: '—',
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ── PageHeader (TASK 3) ── */}
      <div className="card-flat" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-2">
          <Layers size={20} style={{ color: 'var(--accent)' }} />
          <div>
            <h1 className="text-[15px] font-bold text-slate-900" style={{ margin: 0 }}>
              プラスチック原反・ロール在庫管理 (Roll Inventory)
            </h1>
            <span className="text-[11px] text-slate-500">
              各 cuộn nhựa theo dõi theo barcode, chiều dài thực tế và nhà máy lưu kho
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/plastics/inventory/new">
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, height: 32, padding: '0 12px', fontWeight: 700 }}>
              <PackagePlus size={15} />
              <span>入荷登録</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <StatCard ja="総ロール数" value={totalRolls} icon={<Box size={18} style={{ color: 'var(--accent)' }} />} color="var(--accent)" />
        <StatCard ja="総在庫" value={totalMeters.toLocaleString()} unit="m" icon={<Layers size={18} style={{ color: 'var(--status-info)' }} />} color="var(--status-info)" />
        <StatCard
          ja="在庫低下 (≤50m)"
          value={lowStockCount}
          icon={<AlertTriangle size={18} style={{ color: lowStockCount > 0 ? '#DC2626' : 'var(--status-warning)' }} />}
          color={lowStockCount > 0 ? '#DC2626' : 'var(--status-warning)'}
          onClick={() => { setOnlyLowStock(!onlyLowStock); setPage(1) }}
          active={onlyLowStock}
        />
        <StatCard ja="使用中" value={inUseCount} icon={<Loader2 size={18} style={{ color: 'var(--status-success)' }} />} color="var(--status-success)" />
      </div>

      {/* Low Stock Alert Banner (TASK 2) */}
      {lowStockCount > 0 && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: onlyLowStock ? '#FEF3C7' : '#FFFBEB',
            border: '1px solid #FCD34D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} style={{ color: '#D97706', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#92400E' }}>
              ⚠️ 残量50m以下のロールが {lowStockCount} 本あります（在庫補充または交換をご検討ください）
            </span>
          </div>
          <button
            type="button"
            onClick={() => { setOnlyLowStock(!onlyLowStock); setPage(1) }}
            style={{
              background: onlyLowStock ? '#B45309' : '#D97706',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 4,
              padding: '4px 12px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {onlyLowStock ? '全件表示に戻す' : '残量50m以下を抽出'}
          </button>
        </div>
      )}

      {/* Search + Filters */}
      <div className="card-flat" style={{ padding: '8px 12px' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div style={{ position: 'relative' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input
                type="text" placeholder="ロールコード・ロット・マスターコード..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="form-input form-input-search w-[300px] text-[12px]"
                style={{ height: 32 }}
              />
            </div>
            <SearchSuggestions
              history={history} visible={showSuggestions}
              onSelect={(q) => { setSearchQuery(q); setShowSuggestions(false) }}
              onRemove={removeFromHistory} onClear={clearHistory}
              onClose={() => setShowSuggestions(false)}
            />
          </div>

          <select className="form-input text-[11px]" style={{ height: 32, width: 110 }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="ALL">状態: 全て</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v.ja}</option>)}
          </select>

          <select className="form-input text-[11px]" style={{ height: 32, width: 100 }} value={familyFilter} onChange={e => { setFamilyFilter(e.target.value); setPage(1) }}>
            <option value="ALL">材質: 全て</option>
            {['PET', 'PS', 'PP', 'PVC'].map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          {onlyLowStock && (
            <button
              onClick={() => { setOnlyLowStock(false); setPage(1) }}
              className="btn btn-secondary text-[11px] px-2 py-1 h-auto font-bold text-amber-700"
            >
              ✕ 残量50m以下絞込を解除
            </button>
          )}

          <div className="text-[12px] text-[var(--text-muted)] whitespace-nowrap ml-auto" style={{ fontFamily: 'var(--font-jp)' }}>
            {totalRecords} 件
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table w-full" style={{ borderCollapse: 'collapse', minWidth: 1000 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                <ThSort col="roll_barcode" ja="ロールコード" w={140} />
                <ThSort col="plastic_master.plastic_code" ja="標準コード" w={200} />
                <ThSort col="plastic_master.plastic_family" ja="材質" w={70} />
                <th style={{ padding: '6px 8px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-jp)' }}>厚さ×幅</th>
                <th style={{ padding: '6px 8px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-jp)' }}>色</th>
                <ThSort col="current_length_m" ja="残り (m)" w={80} align="right" />
                <ThSort col="nominal_length_m" ja="当初 (m)" w={80} align="right" />
                <th style={{ padding: '6px 8px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-jp)' }}>消化率</th>
                <ThSort col="status" ja="状態" w={80} align="center" />
                <ThSort col="location" ja="工場・場所" w={90} />
                <ThSort col="lot_no" ja="ロットNo" w={110} />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                    ロールデータを読み込み中...
                  </td>
                </tr>
              ) : rolls.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                    データが見つかりません
                  </td>
                </tr>
              ) : (
                rolls.map((r) => {
                  const m = r.plastic_master || {}
                  const nominal = r.nominal_length_m || r.received_length_m || 1
                  const current = r.current_length_m || 0
                  const usedPct = Math.min(100, Math.max(0, Math.round(((nominal - current) / nominal) * 100)))
                  const isLow = current <= 50
                  const st = STATUS_LABELS[r.status] || { ja: r.status, color: 'var(--text-muted)', bg: 'var(--bg-surface-2)' }

                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border-default)', background: isLow ? '#FFFBEB' : undefined }}>
                      {/* Roll Barcode */}
                      <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>
                        <span style={{ color: 'var(--accent)' }}>{r.roll_barcode}</span>
                      </td>

                      {/* Plastic Code */}
                      <td style={{ padding: '6px 8px', fontSize: 11, fontWeight: 600 }}>
                        <Link href={`/plastics/master/${r.plastic_id}`} style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>
                          {m.plastic_code || '—'}
                        </Link>
                      </td>

                      {/* Family */}
                      <td style={{ padding: '6px 8px', fontSize: 11, fontWeight: 700, fontFamily: 'monospace' }}>
                        <span className="badge badge--neutral" style={{ fontSize: 9 }}>{m.plastic_family || '—'}</span>
                      </td>

                      {/* Specs */}
                      <td style={{ padding: '6px 8px', fontSize: 11, textAlign: 'center', fontFamily: 'monospace' }}>
                        {m.thickness_mm ? `${m.thickness_mm}t` : '—'} × {m.width_mm ? `${m.width_mm}` : '—'}
                      </td>

                      {/* Color */}
                      <td style={{ padding: '6px 8px', fontSize: 10, textAlign: 'center' }}>
                        {COLOR_JA[m.color_name_normalized?.toLowerCase()] || m.color_name_normalized || '—'}
                      </td>

                      {/* Current Length (Remaining) */}
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, fontSize: 12, color: isLow ? '#DC2626' : 'var(--text-primary)' }}>
                        {current.toLocaleString()}m
                        {isLow && <span style={{ fontSize: 9, marginLeft: 3 }}>⚠️</span>}
                      </td>

                      {/* Nominal Length */}
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                        {nominal.toLocaleString()}m
                      </td>

                      {/* Used Progress */}
                      <td style={{ padding: '6px 8px', width: 90 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ flex: 1, height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${usedPct}%`, height: '100%', background: isLow ? '#DC2626' : 'var(--accent)' }} />
                          </div>
                          <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'var(--text-muted)', width: 26, textAlign: 'right' }}>{usedPct}%</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: st.bg, color: st.color }}>
                          {st.ja}
                        </span>
                      </td>

                      {/* Location */}
                      <td style={{ padding: '6px 8px', fontSize: 11 }}>
                        {r.location || '—'}
                      </td>

                      {/* Lot No */}
                      <td style={{ padding: '6px 8px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {r.lot_no || '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-default)' }}>
          <Pagination
            currentPage={page}
            totalRecords={totalRecords}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </div>
  )
}
