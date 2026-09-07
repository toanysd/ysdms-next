'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Calendar,
  Search,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  AlertTriangle,
  Layers,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react'
import { getDeadlineUrgency } from './TrayScheduleGantt'

interface TrayScheduleGridProps {
  startDate: string
  endDate: string
  gridFilter?: { machineId?: string; machineCode?: string; date?: string } | null
  onClearFilter?: () => void
  refreshKey?: number
}

interface TrayScheduleRow {
  schedule_id: string
  schedule_date: string
  scheduled_start: string | null
  scheduled_end: string | null
  shift: string | null
  status: string | null
  planned_quantity: number | null
  actual_quantity: number | null
  notes: string | null
  machine_id: string
  machine_code: string
  machine_name: string
  machine_group: string | null
  product_id: string | null
  product_code: string | null
  product_name_internal: string | null
  product_name: string | null
  work_order_id: string | null
  wo_no: string | null
  wo_code: string | null
  wo_name: string | null
  order_id: string | null
  order_no: string | null
  requested_delivery: string | null
  order_status: string | null
  roll_id: string | null
  roll_barcode: string | null
  plastic_grade: string | null
  roll_remaining_m: number | null
  roll_status: string | null
  operator_id: string | null
  operator_name: string | null
  operator_short: string | null
}

const STATUS_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  PLANNED:     { bg: '#EFF6FF', text: '#2563EB', label: '計画' },
  IN_PROGRESS: { bg: '#FEF3C7', text: '#D97706', label: '稼働中' },
  DONE:        { bg: '#ECFDF5', text: '#059669', label: '完了' },
  OVERDUE:     { bg: '#FEF2F2', text: '#DC2626', label: '遅延' },
}

export default function TrayScheduleGrid({
  startDate: initStartDate,
  endDate: initEndDate,
  gridFilter,
  onClearFilter,
  refreshKey,
}: TrayScheduleGridProps) {
  const supabase = createClient()

  // Date range filter
  const [rangeStart, setRangeStart] = useState<string>(initStartDate)
  const [rangeEnd, setRangeEnd] = useState<string>(initEndDate)

  // Filters
  const [selectedMachine, setSelectedMachine] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')

  // Sync external gridFilter from Heatmap click (T9)
  useEffect(() => {
    if (gridFilter) {
      if (gridFilter.machineCode) {
        setSelectedMachine(gridFilter.machineCode)
      }
      if (gridFilter.date) {
        setRangeStart(gridFilter.date)
        setRangeEnd(gridFilter.date)
      }
    }
  }, [gridFilter])

  // Sorting
  const [sortField, setSortField] = useState<string>('schedule_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Data state
  const [rows, setRows] = useState<TrayScheduleRow[]>([])
  const [machines, setMachines] = useState<{ machine_id: string; machine_code: string; machine_name: string }[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Load Machines
  useEffect(() => {
    async function loadMachines() {
      const distinctMap = new Map<string, { machine_id: string; machine_code: string; machine_name: string }>()
      for (let i = 1; i <= 14; i++) {
        distinctMap.set(`MACH-${i}`, {
          machine_id: `MACH-${i}`,
          machine_code: `MACH-${i}`,
          machine_name: `${i}号機`,
        })
      }
      const { data } = await supabase.from('v_tray_schedule_gantt').select('machine_id, machine_code, machine_name')
      if (data) {
        for (const item of data) {
          if (item.machine_code) {
            distinctMap.set(item.machine_code, {
              machine_id: item.machine_id || item.machine_code,
              machine_code: item.machine_code,
              machine_name: item.machine_name || item.machine_code,
            })
          }
        }
      }
      const sorted = Array.from(distinctMap.values()).sort((a, b) => {
        const numA = parseInt(a.machine_code.replace(/\D/g, '')) || 0
        const numB = parseInt(b.machine_code.replace(/\D/g, '')) || 0
        return numA - numB
      })
      setMachines(sorted)
    }
    loadMachines()
  }, [supabase])

  // Load Schedule Rows
  const fetchScheduleRows = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('v_tray_schedule_gantt')
      .select('*')
      .gte('schedule_date', rangeStart)
      .lte('schedule_date', rangeEnd)
      .or('shift.eq.day,shift.eq.DAY,shift.is.null')

    if (selectedMachine !== 'ALL') {
      query = query.eq('machine_code', selectedMachine)
    }
    if (selectedStatus !== 'ALL') {
      query = query.eq('status', selectedStatus)
    }

    if (sortField === 'machine_code') {
      query = query.order('machine_code', { ascending: sortOrder === 'asc' })
    } else if (sortField === 'planned_quantity') {
      query = query.order('planned_quantity', { ascending: sortOrder === 'asc' })
    } else {
      query = query.order('schedule_date', { ascending: sortOrder === 'asc' }).order('machine_code', { ascending: true })
    }

    const { data, error } = await query
    if (!error && data) {
      setRows(data as TrayScheduleRow[])
    }
    setLoading(false)
  }, [rangeStart, rangeEnd, selectedMachine, selectedStatus, sortField, sortOrder, supabase])

  useEffect(() => {
    fetchScheduleRows()
  }, [fetchScheduleRows, refreshKey])

  // Filtered rows by search query
  const filteredRows = useMemo(() => {
    if (!debouncedSearch.trim()) return rows
    const q = debouncedSearch.toLowerCase().trim()
    return rows.filter(
      (r) =>
        r.product_code?.toLowerCase().includes(q) ||
        r.product_name_internal?.toLowerCase().includes(q) ||
        r.wo_code?.toLowerCase().includes(q) ||
        r.roll_barcode?.toLowerCase().includes(q) ||
        r.operator_name?.toLowerCase().includes(q)
    )
  }, [rows, debouncedSearch])

  // Date Shift Helpers
  const handleShiftDays = (delta: number) => {
    const s = new Date(rangeStart + 'T00:00:00Z')
    const e = new Date(rangeEnd + 'T00:00:00Z')
    s.setUTCDate(s.getUTCDate() + delta)
    e.setUTCDate(e.getUTCDate() + delta)
    setRangeStart(s.toISOString().split('T')[0])
    setRangeEnd(e.toISOString().split('T')[0])
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8, background: '#FFFFFF' }}>
      {/* ── Active Heatmap Filter Banner ── */}
      {gridFilter && (
        <div
          style={{
            padding: '6px 14px',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontWeight: 700, color: '#1E40AF' }}>
              🎯 ヒートマップ絞込適用中:
            </span>
            {gridFilter.machineCode && (
              <span className="badge badge--info" style={{ fontSize: 10 }}>
                成型機: {gridFilter.machineCode}
              </span>
            )}
            {gridFilter.date && (
              <span className="badge badge--neutral" style={{ fontSize: 10 }}>
                日付: {gridFilter.date}
              </span>
            )}
          </div>
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: '#1E40AF',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                fontSize: 11,
              }}
            >
              <X size={12} />
              <span>絞込解除</span>
            </button>
          )}
        </div>
      )}

      {/* ── Filter Bar ── */}
      <div
        className="card-flat"
        style={{
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        {/* Left: Date controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => handleShiftDays(-7)}
            className="btn btn-secondary text-xs px-2 py-1 h-auto"
            title="7日前に移動"
          >
            <ChevronLeft size={14} />
            <span>7日前</span>
          </button>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '3px 10px',
              border: '1px solid #E2E8F0',
              borderRadius: 6,
              background: '#F8FAFC',
              fontSize: 12,
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            <Calendar size={14} color="var(--accent)" />
            <span>{rangeStart}</span>
            <span style={{ color: '#94A3B8' }}>〜</span>
            <span>{rangeEnd}</span>
          </div>

          <button
            onClick={() => handleShiftDays(7)}
            className="btn btn-secondary text-xs px-2 py-1 h-auto"
            title="7日後に移動"
          >
            <span>7日後</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Right: Dropdown Filters & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Machine select */}
          <select
            className="form-input text-xs"
            style={{ height: 30, width: 130 }}
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
          >
            <option value="ALL">全機械 (14台)</option>
            {machines.map((m) => (
              <option key={m.machine_code} value={m.machine_code}>
                {m.machine_code} {m.machine_name}
              </option>
            ))}
          </select>

          {/* Status select */}
          <select
            className="form-input text-xs"
            style={{ height: 30, width: 110 }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">全状態</option>
            <option value="PLANNED">計画</option>
            <option value="IN_PROGRESS">稼働中</option>
            <option value="DONE">完了</option>
          </select>

          {/* Product / Search box */}
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
            />
            <input
              type="text"
              placeholder="品番・WO検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input text-xs"
              style={{ height: 30, width: 160, paddingLeft: 26 }}
            />
          </div>

          <button
            onClick={() => fetchScheduleRows()}
            className="btn btn-secondary text-xs px-2.5 py-1 h-auto"
            title="再読み込み"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>

          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
            {filteredRows.length} 件
          </span>
        </div>
      </div>

      {/* ── 11 Cột Data Table (PE Spec) ── */}
      <div className="card-flat" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'auto' }}>
          <table className="data-table w-full" style={{ borderCollapse: 'collapse', minWidth: 1050 }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-2)', position: 'sticky', top: 0, zIndex: 10 }}>
                {/* 1. 日付 */}
                <th
                  onClick={() => handleSort('schedule_date')}
                  style={{ width: 80, padding: '8px 10px', fontSize: 11, cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>日付</span>
                    <ArrowUpDown size={11} color="#94A3B8" />
                  </div>
                </th>

                {/* 2. 機械 */}
                <th
                  onClick={() => handleSort('machine_code')}
                  style={{ width: 110, padding: '8px 10px', fontSize: 11, cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>成型機</span>
                    <ArrowUpDown size={11} color="#94A3B8" />
                  </div>
                </th>

                {/* 3. 品番 */}
                <th style={{ width: 130, padding: '8px 10px', fontSize: 11 }}>品番 (Product)</th>

                {/* 4. 指示No */}
                <th style={{ width: 110, padding: '8px 10px', fontSize: 11 }}>指示No (WO)</th>

                {/* 5. 計画数 */}
                <th
                  onClick={() => handleSort('planned_quantity')}
                  style={{ width: 95, padding: '8px 10px', fontSize: 11, textAlign: 'right', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                    <span>計画数</span>
                    <ArrowUpDown size={11} color="#94A3B8" />
                  </div>
                </th>

                {/* 6. 実績数 */}
                <th style={{ width: 100, padding: '8px 10px', fontSize: 11, textAlign: 'right' }}>実績数 (%)</th>

                {/* 7. 材料 / 原反 */}
                <th style={{ width: 160, padding: '8px 10px', fontSize: 11 }}>材料 / 原反ロール</th>

                {/* 8. 担当 */}
                <th style={{ width: 100, padding: '8px 10px', fontSize: 11 }}>担当オペ</th>

                {/* 9. 納期 (T8: Urgency badge) */}
                <th style={{ width: 110, padding: '8px 10px', fontSize: 11, textAlign: 'center' }}>納期 (締切)</th>

                {/* 10. 状態 */}
                <th style={{ width: 85, padding: '8px 10px', fontSize: 11, textAlign: 'center' }}>状態</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
                    <Loader2 size={22} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                    成型スケジュールを読み込み中...
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
                    指定期間のスケジュールは見つかりませんでした
                  </td>
                </tr>
              ) : (
                filteredRows.map((r) => {
                  const planned = r.planned_quantity || 0
                  const actual = r.actual_quantity || 0
                  const pct = planned > 0 ? Math.min(100, Math.round((actual / planned) * 100)) : 0

                  const st = STATUS_BADGES[r.status || 'PLANNED'] || STATUS_BADGES.PLANNED
                  const urgency = getDeadlineUrgency(r.requested_delivery)

                  // Format schedule_date MM/DD
                  const dObj = new Date(r.schedule_date + 'T00:00:00Z')
                  const formattedDate = `${String(dObj.getUTCMonth() + 1).padStart(2, '0')}/${String(dObj.getUTCDate()).padStart(2, '0')}`

                  return (
                    <tr
                      key={r.schedule_id}
                      style={{
                        borderBottom: '1px solid var(--border-default)',
                        background: r.status === 'IN_PROGRESS' ? 'rgba(254, 243, 199, 0.25)' : undefined,
                      }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* 1. 日付 */}
                      <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>
                        {formattedDate}
                      </td>

                      {/* 2. 機械 */}
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 11, color: '#0F172A' }}>
                            {r.machine_code}
                          </span>
                          <span style={{ fontSize: 10, color: '#64748B' }}>{r.machine_name}</span>
                        </div>
                      </td>

                      {/* 4. 品番 */}
                      <td style={{ padding: '8px 10px', fontSize: 12, fontWeight: 700 }}>
                        <Link
                          href={`/master/products`}
                          style={{
                            color: 'var(--accent)',
                            textDecoration: 'none',
                            fontFamily: 'monospace',
                          }}
                          className="hover:underline"
                        >
                          {r.product_code || '—'}
                        </Link>
                      </td>

                      {/* 5. 指示No */}
                      <td style={{ padding: '8px 10px', fontFamily: 'monospace', fontSize: 11, color: '#475569' }}>
                        {r.wo_code || '—'}
                      </td>

                      {/* 6. 計画数 */}
                      <td
                        style={{
                          padding: '8px 10px',
                          textAlign: 'right',
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {planned.toLocaleString()}
                      </td>

                      {/* 7. 実績数 (%) */}
                      <td style={{ padding: '8px 10px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600 }}>
                            {actual.toLocaleString()}
                          </span>
                          <div style={{ width: 60, height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${pct}%`,
                                height: '100%',
                                background: pct >= 100 ? '#10B981' : '#F59E0B',
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* 8. 材料 / 原反ロール */}
                      <td style={{ padding: '8px 10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#1E293B' }}>
                            {r.plastic_grade || 'PET 0.5t'}
                          </span>
                          <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748B' }}>
                            {r.roll_barcode || '未引当'}
                            {r.roll_remaining_m ? ` (${r.roll_remaining_m.toLocaleString()}m)` : ''}
                          </span>
                        </div>
                      </td>

                      {/* 9. 担当オペレーター */}
                      <td style={{ padding: '8px 10px', fontSize: 11 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              background: '#E2E8F0',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 9,
                              fontWeight: 700,
                              color: '#475569',
                            }}
                          >
                            {(r.operator_short || r.operator_name || 'U')[0]}
                          </span>
                          <span style={{ color: '#334155' }}>
                            {r.operator_short || r.operator_name || '未割当'}
                          </span>
                        </div>
                      </td>

                      {/* 10. 納期 (T8: Urgency badge) */}
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        {r.requested_delivery ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: '#0F172A' }}>
                              {r.requested_delivery}
                            </span>
                            {urgency && (
                              <span
                                style={{
                                  fontSize: 8,
                                  fontWeight: 800,
                                  padding: '1px 4px',
                                  borderRadius: 2,
                                  background: urgency.bg,
                                  color: urgency.text,
                                  border: `1px solid ${urgency.border}`,
                                }}
                              >
                                {urgency.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: 11, color: '#94A3B8' }}>—</span>
                        )}
                      </td>

                      {/* 11. 状態 */}
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: st.bg,
                            color: st.text,
                          }}
                        >
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
