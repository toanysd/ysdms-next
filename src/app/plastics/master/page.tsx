'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pagination } from '@/components/ui/Pagination'
import { Search, Loader2, Plus, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'
import Link from 'next/link'

// ── Enum Labels ──
const FAMILY_OPTIONS = ['ALL', 'PET', 'PS', 'PP', 'PVC', 'PPF', 'OTHER'] as const
const ELEC_LABELS: Record<string, { ja: string; color: string; bg: string }> = {
  normal:     { ja: '通常',       color: 'var(--text-secondary)', bg: 'var(--bg-surface-2)' },
  conductive: { ja: '導電',       color: 'var(--status-error)',    bg: 'color-mix(in srgb, var(--status-error) 12%, transparent)' },
  antistatic: { ja: '帯電防止',   color: 'var(--status-warning)',  bg: 'color-mix(in srgb, var(--status-warning) 12%, transparent)' },
}
const SILICONE_LABELS: Record<string, { ja: string; color: string; bg: string }> = {
  silicone_free: { ja: 'ノンシリ', color: 'var(--status-success)', bg: 'color-mix(in srgb, var(--status-success) 12%, transparent)' },
  with_silicone: { ja: 'シリコン有', color: 'var(--status-info)', bg: 'color-mix(in srgb, var(--status-info) 12%, transparent)' },
  unknown:       { ja: '未確認',   color: 'var(--text-muted)',     bg: 'var(--bg-surface-2)' },
}
const REVIEW_LABELS: Record<string, { ja: string; color: string; bg: string }> = {
  draft:     { ja: '未確認', color: 'var(--text-muted)',       bg: 'var(--bg-surface-2)' },
  checked:   { ja: '確認済', color: 'var(--status-warning)',  bg: 'color-mix(in srgb, var(--status-warning) 12%, transparent)' },
  confirmed: { ja: '承認済', color: 'var(--status-success)',  bg: 'color-mix(in srgb, var(--status-success) 12%, transparent)' },
}
const COLOR_JA: Record<string, string> = {
  natural: 'ナチュラル', clear: 'クリア', black: '黒', white: '白',
  green: '緑', blue: '青', brown: '茶', gray: 'グレー', unknown: '未確認',
}

export default function PlasticsMasterPage() {
  const supabase = createClient()
  const [plastics, setPlastics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('search_plastic_master')
  const [familyFilter, setFamilyFilter] = useState('ALL')
  const [elecFilter, setElecFilter] = useState('ALL')
  const [siliFilter, setSiliFilter] = useState('ALL')

  // Sorting
  const [sortCol, setSortCol] = useState('plastic_code')
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

  const fetchPlastics = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('plastic_master')
      .select('*', { count: 'exact' })
      .order(sortCol, { ascending: sortDir === 'asc' })

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.trim()
      query = query.or(`plastic_code.ilike.%${q}%,plastic_family.ilike.%${q}%,color_name_normalized.ilike.%${q}%,remarks_raw.ilike.%${q}%`)
    }
    if (familyFilter !== 'ALL') {
      query = query.ilike('plastic_family', `%${familyFilter}%`)
    }
    if (elecFilter !== 'ALL') {
      query = query.eq('electrical_property', elecFilter)
    }
    if (siliFilter !== 'ALL') {
      query = query.eq('silicone_status_normalized', siliFilter)
    }

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)

    const { data, error: err, count } = await query
    if (err) setError(err.message)
    else {
      setPlastics(data || [])
      setTotalRecords(count || 0)
    }
    setLoading(false)
  }, [debouncedSearch, familyFilter, elecFilter, siliFilter, page, sortCol, sortDir, supabase])

  useEffect(() => { fetchPlastics() }, [fetchPlastics])

  const handleSort = (col: string) => {
    if (sortCol === col) {
      if (sortDir === 'asc') setSortDir('desc')
      else { setSortCol('plastic_code'); setSortDir('asc') }
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ArrowUpDown size={10} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
    return sortDir === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />
  }

  const ThSort = ({ col, ja, vi, w, align }: { col: string; ja: string; vi?: string; w?: number | string; align?: string }) => (
    <th
      onClick={() => handleSort(col)}
      style={{
        padding: '6px 8px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
        color: 'var(--text-muted)', textAlign: (align as any) || 'left', whiteSpace: 'nowrap',
        width: w, borderBottom: '1px solid var(--border-default)', cursor: 'pointer', userSelect: 'none',
        fontFamily: 'var(--font-jp)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        <div>
          <span>{ja}</span>
          {vi && <span style={{ fontWeight: 400, fontSize: 9, opacity: 0.7, marginLeft: 3 }}>{vi}</span>}
        </div>
        <SortIcon col={col} />
      </div>
    </th>
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Search + Filters */}
      <div className="card-flat" style={{ padding: '8px 12px' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div style={{ position: 'relative' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
              <input
                type="text"
                placeholder="コード・材質・色..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                className="form-input form-input-search w-[260px] text-[12px]"
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

          {/* Family filter */}
          <select className="form-input text-[11px]" style={{ height: 32, width: 100 }} value={familyFilter} onChange={e => { setFamilyFilter(e.target.value); setPage(1) }}>
            <option value="ALL">材質: 全て</option>
            {FAMILY_OPTIONS.filter(f => f !== 'ALL').map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          {/* Electrical filter */}
          <select className="form-input text-[11px]" style={{ height: 32, width: 120 }} value={elecFilter} onChange={e => { setElecFilter(e.target.value); setPage(1) }}>
            <option value="ALL">導電性: 全て</option>
            {Object.entries(ELEC_LABELS).map(([k, v]) => <option key={k} value={k}>{v.ja}</option>)}
          </select>

          {/* Silicone filter */}
          <select className="form-input text-[11px]" style={{ height: 32, width: 130 }} value={siliFilter} onChange={e => { setSiliFilter(e.target.value); setPage(1) }}>
            <option value="ALL">ｼﾘｺﾝ: 全て</option>
            {Object.entries(SILICONE_LABELS).map(([k, v]) => <option key={k} value={k}>{v.ja}</option>)}
          </select>

          <div className="text-[12px] text-[var(--text-muted)] whitespace-nowrap ml-auto" style={{ fontFamily: 'var(--font-jp)' }}>
            {totalRecords} 件
          </div>
        </div>
      </div>

      {error && (
        <div className="card-flat text-[12px] text-[var(--status-error)] p-3">⚠ {error}</div>
      )}

      {/* Data Table */}
      <div className="card-flat" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table w-full" style={{ borderCollapse: 'collapse', minWidth: 1100 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)' }}>
                <ThSort col="plastic_code" ja="標準コード" w={220} />
                <ThSort col="plastic_family" ja="材質" w={80} />
                <ThSort col="thickness_mm" ja="厚さ" w={60} align="right" />
                <ThSort col="width_mm" ja="幅" w={60} align="right" />
                <ThSort col="standard_length_m" ja="標準長" w={65} align="right" />
                <ThSort col="color_name_normalized" ja="色" w={90} />
                <th style={{ padding: '6px 8px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-jp)' }}>導電性</th>
                <th style={{ padding: '6px 8px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-jp)' }}>ｼﾘｺﾝ</th>
                <th style={{ padding: '6px 8px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', borderBottom: '1px solid var(--border-default)', fontFamily: 'var(--font-jp)' }}>確認</th>
                <ThSort col="is_active" ja="状態" w={65} />
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={10} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  <Loader2 size={16} className="animate-spin inline-block mr-2" /> 読み込み中...
                </td></tr>
              )}
              {!loading && plastics.length === 0 && (
                <tr><td colSpan={10} style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
                  データがありません
                </td></tr>
              )}
              {!loading && plastics.map((item, idx) => {
                const elec = ELEC_LABELS[item.electrical_property] || ELEC_LABELS.normal
                const sili = SILICONE_LABELS[item.silicone_status_normalized] || SILICONE_LABELS.unknown
                const review = REVIEW_LABELS[item.status_review] || REVIEW_LABELS.draft
                const colorJa = COLOR_JA[item.color_name_normalized] || item.color_name_normalized || '—'

                return (
                  <tr key={item.plastic_id} style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: idx % 2 === 0 ? 'transparent' : 'var(--bg-surface-2)',
                  }}>
                    {/* Mã chuẩn — Hyperlink */}
                    <td style={{ padding: '5px 8px', fontSize: 12, fontFamily: 'monospace', fontWeight: 700 }}>
                      <Link href={`/plastics/master/${item.plastic_id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                        {item.plastic_code}
                      </Link>
                    </td>
                    {/* Họ nhựa */}
                    <td style={{ padding: '5px 8px', fontSize: 11 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.plastic_family || '—'}</span>
                      {item.plastic_subtype && (
                        <span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 3 }}>({item.plastic_subtype})</span>
                      )}
                    </td>
                    {/* Dày */}
                    <td style={{ padding: '5px 8px', fontSize: 12, textAlign: 'right', fontFamily: 'monospace' }}>{item.thickness_mm ?? '—'}</td>
                    {/* Khổ */}
                    <td style={{ padding: '5px 8px', fontSize: 12, textAlign: 'right', fontFamily: 'monospace' }}>{item.width_mm ?? '—'}</td>
                    {/* Dài chuẩn */}
                    <td style={{ padding: '5px 8px', fontSize: 12, textAlign: 'right', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                      {item.standard_length_m ? `${item.standard_length_m}` : '—'}
                    </td>
                    {/* Màu */}
                    <td style={{ padding: '5px 8px', fontSize: 11 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {item.color_code_raw && (
                          <span style={{ fontSize: 9, fontFamily: 'monospace', fontWeight: 700, background: 'var(--bg-surface-3)', padding: '1px 4px', borderRadius: 3 }}>
                            {item.color_code_raw}
                          </span>
                        )}
                        <span style={{ fontFamily: 'var(--font-jp)' }}>{colorJa}</span>
                      </div>
                    </td>
                    {/* Tính điện — Badge */}
                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10,
                        color: elec.color, background: elec.bg, fontFamily: 'var(--font-jp)',
                        display: 'inline-block',
                      }}>{elec.ja}</span>
                    </td>
                    {/* Silicone — Badge */}
                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10,
                        color: sili.color, background: sili.bg, fontFamily: 'var(--font-jp)',
                        display: 'inline-block',
                      }}>{sili.ja}</span>
                    </td>
                    {/* Xác nhận — Badge */}
                    <td style={{ padding: '5px 8px', textAlign: 'center' }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 10,
                        color: review.color, background: review.bg, fontFamily: 'var(--font-jp)',
                        display: 'inline-block',
                      }}>{review.ja}</span>
                    </td>
                    {/* Trạng thái */}
                    <td style={{ padding: '5px 8px', fontSize: 10 }}>
                      <span style={{
                        fontWeight: 700, padding: '2px 6px', borderRadius: 10,
                        color: item.is_active ? 'var(--status-success)' : 'var(--text-muted)',
                        background: item.is_active ? 'color-mix(in srgb, var(--status-success) 12%, transparent)' : 'var(--bg-surface-2)',
                        fontFamily: 'var(--font-jp)',
                      }}>
                        {item.is_active ? '有効' : '無効'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={page} totalRecords={totalRecords} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </div>
  )
}
