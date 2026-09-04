'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Flame,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
  Info,
  ArrowRight,
} from 'lucide-react'

interface MachineHeatmapProps {
  startDate: string
  endDate: string
  onCellClick: (machineCode: string, date: string) => void
  refreshKey?: number
}

interface HeatCell {
  machineCode: string
  date: string
  slots: number
  totalQty: number
  hasDay: boolean
  hasNight: boolean
  products: string[]
}

export default function MachineHeatmap({
  startDate: initStartDate,
  endDate: initEndDate,
  onCellClick,
  refreshKey,
}: MachineHeatmapProps) {
  const supabase = createClient()
  const [rangeStart, setRangeStart] = useState(initStartDate)
  const [rangeEnd, setRangeEnd] = useState(initEndDate)
  const [loading, setLoading] = useState(true)
  const [heatData, setHeatData] = useState<Map<string, HeatCell>>(new Map())
  const [hoveredCell, setHoveredCell] = useState<{ cell: HeatCell; x: number; y: number } | null>(null)

  // 14 machines list
  const machines = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => ({
      code: `MACH-${i + 1}`,
      name: `${i + 1}号機`,
    }))
  }, [])

  // Days array (14 days)
  const daysArray = useMemo(() => {
    const list: { dateStr: string; label: string; dayOfWeek: string; isToday: boolean; isWeekend: boolean }[] = []
    const start = new Date(rangeStart + 'T00:00:00Z')
    const end = new Date(rangeEnd + 'T00:00:00Z')
    const todayStr = new Date().toISOString().split('T')[0]
    const weekdaysJA = ['日', '月', '火', '水', '木', '金', '土']

    const cur = new Date(start)
    while (cur <= end) {
      const dStr = cur.toISOString().split('T')[0]
      const dayIdx = cur.getUTCDay()
      list.push({
        dateStr: dStr,
        label: `${cur.getUTCMonth() + 1}/${cur.getUTCDate()}`,
        dayOfWeek: weekdaysJA[dayIdx],
        isToday: dStr === todayStr,
        isWeekend: dayIdx === 0 || dayIdx === 6,
      })
      cur.setUTCDate(cur.getUTCDate() + 1)
    }
    return list
  }, [rangeStart, rangeEnd])

  // Fetch and aggregate heatmap data
  useEffect(() => {
    async function loadHeatmap() {
      setLoading(true)
      const { data, error } = await supabase
        .from('v_tray_schedule_gantt')
        .select('machine_code, schedule_date, shift, planned_quantity, product_code')
        .gte('schedule_date', rangeStart)
        .lte('schedule_date', rangeEnd)

      const map = new Map<string, HeatCell>()

      if (data) {
        for (const item of data) {
          const mCode = item.machine_code || 'OTHER'
          const key = `${mCode}_${item.schedule_date}`
          const existing = map.get(key) || {
            machineCode: mCode,
            date: item.schedule_date,
            slots: 0,
            totalQty: 0,
            hasDay: false,
            hasNight: false,
            products: [],
          }

          existing.slots += 1
          existing.totalQty += item.planned_quantity || 0
          if (item.shift === 'NIGHT') existing.hasNight = true
          else existing.hasDay = true
          if (item.product_code && !existing.products.includes(item.product_code)) {
            existing.products.push(item.product_code)
          }

          map.set(key, existing)
        }
      }

      setHeatData(map)
      setLoading(false)
    }
    loadHeatmap()
  }, [rangeStart, rangeEnd, refreshKey, supabase])

  // Get cell color style
  const getCellStyle = (cell: HeatCell | undefined) => {
    if (!cell || cell.slots === 0) {
      return { bg: '#F8FAFC', text: '#94A3B8', border: '#E2E8F0' }
    }
    if (cell.totalQty >= 15000) {
      return { bg: '#1E40AF', text: '#FFFFFF', border: '#1E3A8A' } // 2 shifts full load
    }
    if (cell.slots >= 2 || cell.totalQty >= 8000) {
      return { bg: '#3B82F6', text: '#FFFFFF', border: '#2563EB' } // High load
    }
    if (cell.totalQty >= 5000) {
      return { bg: '#93C5FD', text: '#1E3A8A', border: '#60A5FA' } // Medium load
    }
    return { bg: '#DBEAFE', text: '#1E3A8A', border: '#BFDBFE' } // Light load
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8, background: '#FFFFFF' }}>
      {/* ── Toolbar ── */}
      <div
        className="card-flat"
        style={{
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Flame size={18} color="#D97706" />
          <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>
            成型機 稼働密度ヒートマップ (14台 × {daysArray.length}日間)
          </span>
          <span style={{ fontSize: 11, color: '#64748B' }}>
            マスをクリックすると成型指示一覧（Grid）へジャンプして詳細を確認できます
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10 }}>
          <span style={{ color: '#64748B' }}>負荷凡例:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 12, height: 12, background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 2 }} />
            <span>空き</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 12, height: 12, background: '#DBEAFE', borderRadius: 2 }} />
            <span>&lt;5k</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 12, height: 12, background: '#93C5FD', borderRadius: 2 }} />
            <span>5k~8k</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 12, height: 12, background: '#3B82F6', borderRadius: 2 }} />
            <span>8k~15k</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ width: 12, height: 12, background: '#1E40AF', borderRadius: 2 }} />
            <span>≥15k (フル稼働)</span>
          </div>
        </div>
      </div>

      {/* ── Heatmap Grid ── */}
      <div className="card-flat" style={{ flex: 1, padding: 0, overflow: 'auto', position: 'relative' }}>
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.7)',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              color: 'var(--accent)',
            }}
          >
            <Loader2 size={18} className="animate-spin" />
            <span>ヒートマップ集計中...</span>
          </div>
        )}

        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 1000 }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #CBD5E1' }}>
              <th style={{ width: 130, padding: '8px 10px', fontSize: 11, textAlign: 'left', color: '#1E293B' }}>
                成型機
              </th>
              {daysArray.map((day) => (
                <th
                  key={day.dateStr}
                  style={{
                    padding: '6px 4px',
                    fontSize: 10,
                    textAlign: 'center',
                    borderLeft: '1px solid #E2E8F0',
                    background: day.isToday ? '#EFF6FF' : undefined,
                  }}
                >
                  <div style={{ fontWeight: day.isToday ? 800 : 700, fontFamily: 'monospace' }}>{day.label}</div>
                  <div
                    style={{
                      fontSize: 9,
                      color:
                        day.dayOfWeek === '日'
                          ? '#DC2626'
                          : day.dayOfWeek === '土'
                          ? '#2563EB'
                          : '#64748B',
                    }}
                  >
                    ({day.dayOfWeek})
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => (
              <tr key={m.code} style={{ borderBottom: '1px solid #E2E8F0' }}>
                {/* Machine label */}
                <td style={{ padding: '6px 10px', background: '#F8FAFC', borderRight: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 11, color: '#0F172A' }}>
                      {m.code}
                    </span>
                    <span style={{ fontSize: 9, color: '#64748B' }}>{m.name}</span>
                  </div>
                </td>

                {/* Day cells */}
                {daysArray.map((day) => {
                  const key = `${m.code}_${day.dateStr}`
                  const cell = heatData.get(key)
                  const style = getCellStyle(cell)

                  return (
                    <td
                      key={day.dateStr}
                      onClick={() => {
                        if (cell && cell.slots > 0) {
                          onCellClick(m.code, day.dateStr)
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (cell && cell.slots > 0) {
                          const rect = e.currentTarget.getBoundingClientRect()
                          setHoveredCell({
                            cell,
                            x: rect.left + rect.width / 2,
                            y: rect.top - 6,
                          })
                        }
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{
                        padding: 0,
                        borderLeft: '1px solid #E2E8F0',
                        textAlign: 'center',
                        cursor: cell && cell.slots > 0 ? 'pointer' : 'default',
                        height: 38,
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: style.bg,
                          color: style.text,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'opacity 0.15s',
                        }}
                        className={cell && cell.slots > 0 ? 'hover:opacity-85' : ''}
                      >
                        {cell && cell.slots > 0 ? (
                          <>
                            <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'monospace' }}>
                              {(cell.totalQty / 1000).toFixed(1)}k
                            </span>
                            <div style={{ display: 'flex', gap: 2, fontSize: 8 }}>
                              {cell.hasDay && <span>🌞</span>}
                              {cell.hasNight && <span>🌙</span>}
                            </div>
                          </>
                        ) : (
                          <span style={{ fontSize: 9, color: '#CBD5E1' }}>—</span>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Hover Tooltip ── */}
      {hoveredCell && (
        <div
          style={{
            position: 'fixed',
            left: `${hoveredCell.x}px`,
            top: `${hoveredCell.y}px`,
            transform: 'translate(-50%, -100%)',
            background: '#0F172A',
            color: '#FFFFFF',
            borderRadius: 6,
            padding: '8px 10px',
            fontSize: 11,
            zIndex: 9999,
            pointerEvents: 'none',
            boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
            width: 220,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: 3 }}>
            <span style={{ fontWeight: 800, color: '#38BDF8', fontFamily: 'monospace' }}>
              {hoveredCell.cell.machineCode}
            </span>
            <span style={{ fontSize: 10, color: '#94A3B8' }}>{hoveredCell.cell.date}</span>
          </div>

          <div style={{ fontSize: 10 }}>
            <div>計画合計: <strong>{hoveredCell.cell.totalQty.toLocaleString()}</strong> khay ({hoveredCell.cell.slots} ca)</div>
            <div>稼働直: {hoveredCell.cell.hasDay ? '🌞 昼' : ''} {hoveredCell.cell.hasNight ? '🌙 夜' : ''}</div>
            {hoveredCell.cell.products.length > 0 && (
              <div style={{ color: '#FCD34D' }}>品番: {hoveredCell.cell.products.join(', ')}</div>
            )}
          </div>
          <div style={{ fontSize: 9, color: '#38BDF8', marginTop: 2 }}>👉 クリックで指示一覧を開く</div>
        </div>
      )}
    </div>
  )
}
