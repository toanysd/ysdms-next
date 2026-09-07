'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Filter,
  Loader2,
  RefreshCw,
  Info,
  Clock,
  User,
  Package,
  Layers,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'

interface TrayScheduleGanttProps {
  startDate: string // 'YYYY-MM-DD'
  endDate: string   // 'YYYY-MM-DD'
  machineGroup?: string
  highlightRollId?: string | null
  refreshKey?: number
}

interface Machine {
  machine_id: string
  machine_code: string
  machine_name: string
  machine_group: string | null
}

interface TrayScheduleItem {
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

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  PLANNED:     { bg: '#3B82F6', border: '#2563EB', text: '#FFFFFF', label: '計画 (PLANNED)' },
  IN_PROGRESS: { bg: '#F59E0B', border: '#D97706', text: '#FFFFFF', label: '稼働中 (IN_PROGRESS)' },
  DONE:        { bg: '#10B981', border: '#059669', text: '#FFFFFF', label: '完了 (DONE)' },
  OVERDUE:     { bg: '#EF4444', border: '#DC2626', text: '#FFFFFF', label: '遅延 (OVERDUE)' },
}

// ── T8: Shipment Countdown Helper ──
export function getDeadlineUrgency(requestedDelivery: string | null) {
  if (!requestedDelivery) return null
  const d = new Date(requestedDelivery + 'T00:00:00Z')
  const now = new Date()
  now.setUTCHours(0, 0, 0, 0)
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 3600 * 24))

  if (diffDays < 0) {
    return { label: '期限超', text: '#FFFFFF', bg: '#B91C1C', border: '#991B1B', priority: 0 }
  }
  if (diffDays <= 2) {
    return { label: `残${diffDays}日`, text: '#FFFFFF', bg: '#DC2626', border: '#B91C1C', priority: 1 }
  }
  if (diffDays <= 5) {
    return { label: `残${diffDays}日`, text: '#78350F', bg: '#FDE68A', border: '#F59E0B', priority: 2 }
  }
  if (diffDays <= 14) {
    return { label: `残${diffDays}日`, text: '#14532D', bg: '#BBF7D0', border: '#22C55E', priority: 3 }
  }
  return null
}

export default function TrayScheduleGantt({
  startDate: initStartDate,
  endDate: initEndDate,
  machineGroup: initMachineGroup,
  highlightRollId,
  refreshKey,
}: TrayScheduleGanttProps) {
  const supabase = createClient()

  // Date range state
  const [rangeStart, setRangeStart] = useState<string>(initStartDate)
  const [rangeEnd, setRangeEnd] = useState<string>(initEndDate)

  // Filter state
  const [selectedMachine, setSelectedMachine] = useState<string>('ALL')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Data state
  const [machines, setMachines] = useState<Machine[]>([])
  const [schedules, setSchedules] = useState<TrayScheduleItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Tooltip & Selected Item state
  const [hoveredItem, setHoveredItem] = useState<{ item: TrayScheduleItem; x: number; y: number } | null>(null)
  const [selectedItem, setSelectedItem] = useState<TrayScheduleItem | null>(null)

  // Fetch Machines (14 machines)
  useEffect(() => {
    async function loadMachines() {
      // Fetch via view or machines table to ensure 14 machines are covered
      const { data: viewData } = await supabase
        .from('v_tray_schedule_gantt')
        .select('machine_id, machine_code, machine_name, machine_group')
      
      const distinctMap = new Map<string, Machine>()
      // Seed default 14 machines fallback
      for (let i = 1; i <= 14; i++) {
        distinctMap.set(`MACH-${i}`, {
          machine_id: `MACH-${i}`,
          machine_code: `MACH-${i}`,
          machine_name: `${i}号機`,
          machine_group: null,
        })
      }
      if (viewData) {
        for (const item of viewData) {
          if (item.machine_code) {
            distinctMap.set(item.machine_code, {
              machine_id: item.machine_id || item.machine_code,
              machine_code: item.machine_code,
              machine_name: item.machine_name || item.machine_code,
              machine_group: item.machine_group,
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

  // Fetch Schedules from View
  const loadSchedules = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('v_tray_schedule_gantt')
      .select('*')
      .gte('schedule_date', rangeStart)
      .lte('schedule_date', rangeEnd)
      .or('shift.eq.day,shift.eq.DAY,shift.is.null')
      .order('machine_code', { ascending: true })
      .order('scheduled_start', { ascending: true })

    if (selectedMachine !== 'ALL') {
      query = query.eq('machine_code', selectedMachine)
    }
    if (selectedStatus !== 'ALL') {
      query = query.eq('status', selectedStatus)
    }

    const { data, error } = await query
    if (!error && data) {
      setSchedules(data as TrayScheduleItem[])
    }
    setLoading(false)
  }, [rangeStart, rangeEnd, selectedMachine, selectedStatus, supabase])

  useEffect(() => {
    loadSchedules()
  }, [loadSchedules, refreshKey])

  // Compute Days array for Gantt timeline
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

  // Shift navigation
  const handleShiftDays = (delta: number) => {
    const s = new Date(rangeStart + 'T00:00:00Z')
    const e = new Date(rangeEnd + 'T00:00:00Z')
    s.setUTCDate(s.getUTCDate() + delta)
    e.setUTCDate(e.getUTCDate() + delta)
    setRangeStart(s.toISOString().split('T')[0])
    setRangeEnd(e.toISOString().split('T')[0])
  }

  const handleSetPresetDays = (daysCount: number) => {
    const s = new Date()
    const e = new Date()
    e.setDate(s.getDate() + daysCount - 1)
    setRangeStart(s.toISOString().split('T')[0])
    setRangeEnd(e.toISOString().split('T')[0])
  }

  // Filtered machines for display
  const displayMachines = useMemo(() => {
    if (selectedMachine === 'ALL') return machines
    return machines.filter((m) => m.machine_code === selectedMachine)
  }, [machines, selectedMachine])

  // Map schedules by machine_code
  const schedulesByMachineCode = useMemo(() => {
    const map: Record<string, TrayScheduleItem[]> = {}
    for (const item of schedules) {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const match =
          item.product_code?.toLowerCase().includes(q) ||
          item.wo_code?.toLowerCase().includes(q) ||
          item.roll_barcode?.toLowerCase().includes(q) ||
          item.operator_name?.toLowerCase().includes(q)
        if (!match) continue
      }
      const code = item.machine_code || 'OTHER'
      if (!map[code]) map[code] = []
      map[code].push(item)
    }
    return map
  }, [schedules, searchQuery])

  // ── T8: Urgent Summary Calculation ──
  const urgentSummary = useMemo(() => {
    let upcoming7DaysCount = 0
    let criticalCount = 0 // <= 2 days or overdue

    for (const s of schedules) {
      if (s.requested_delivery) {
        const urgency = getDeadlineUrgency(s.requested_delivery)
        if (urgency) {
          upcoming7DaysCount++
          if (urgency.priority <= 1) {
            criticalCount++
          }
        }
      }
    }
    return { upcoming7DaysCount, criticalCount }
  }, [schedules])

  // Width constant for each day column in px
  const DAY_COL_WIDTH = 110
  const totalTimelineWidth = daysArray.length * DAY_COL_WIDTH

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 6, background: '#FFFFFF' }}>
      {/* ── T8: Urgent Summary Banner ── */}
      {urgentSummary.upcoming7DaysCount > 0 && (
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            background: urgentSummary.criticalCount > 0 ? '#FEF2F2' : '#FFFBEB',
            border: urgentSummary.criticalCount > 0 ? '1px solid #FECACA' : '1px solid #FDE68A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 11,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle
              size={15}
              style={{ color: urgentSummary.criticalCount > 0 ? '#DC2626' : '#D97706', flexShrink: 0 }}
            />
            <span style={{ fontWeight: 700, color: urgentSummary.criticalCount > 0 ? '#991B1B' : '#92400E' }}>
              ⚠️ 今後7日間の出荷予定: <strong>{urgentSummary.upcoming7DaysCount}</strong> 件
              {urgentSummary.criticalCount > 0 && (
                <span style={{ marginLeft: 6, color: '#DC2626' }}>
                  — 🔴 <strong>{urgentSummary.criticalCount}</strong> 件が期限迫る (残2日以内または期限超過)
                </span>
              )}
            </span>
          </div>
          <span style={{ fontSize: 10, color: '#64748B' }}>納品遅延防止のため成型優先度をご確認ください</span>
        </div>
      )}

      {/* ── Toolbar & Filter Controls ── */}
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
        {/* Left: Date navigation */}
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
            <span style={{ fontSize: 11, fontWeight: 400, color: '#64748B' }}>({daysArray.length}日間)</span>
          </div>

          <button
            onClick={() => handleShiftDays(7)}
            className="btn btn-secondary text-xs px-2 py-1 h-auto"
            title="7日後に移動"
          >
            <span>7日後</span>
            <ChevronRight size={14} />
          </button>

          <div style={{ display: 'flex', gap: 4, marginLeft: 4 }}>
            <button
              onClick={() => handleSetPresetDays(7)}
              className="btn btn-secondary text-[11px] px-2 py-0.5 h-auto font-bold"
            >
              今週
            </button>
            <button
              onClick={() => handleSetPresetDays(14)}
              className="btn btn-secondary text-[11px] px-2 py-0.5 h-auto font-bold"
            >
              2週間
            </button>
            <button
              onClick={() => handleSetPresetDays(30)}
              className="btn btn-secondary text-[11px] px-2 py-0.5 h-auto font-bold"
            >
              1ヶ月
            </button>
          </div>
        </div>

        {/* Right: Dropdown Filters & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Machine Filter */}
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

          {/* Status Filter */}
          <select
            className="form-input text-xs"
            style={{ height: 30, width: 120 }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">全状態</option>
            <option value="PLANNED">計画 (PLANNED)</option>
            <option value="IN_PROGRESS">稼働中 (IN_PROGRESS)</option>
            <option value="DONE">完了 (DONE)</option>
          </select>

          {/* Search Box */}
          <input
            type="text"
            placeholder="品番・WO・材料検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input text-xs"
            style={{ height: 30, width: 150 }}
          />

          <button
            onClick={() => loadSchedules()}
            className="btn btn-secondary text-xs px-2.5 py-1 h-auto"
            title="再読み込み"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Status Legend ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 12px', fontSize: 11 }}>
        <span style={{ fontWeight: 700, color: '#475569' }}>凡例:</span>
        {Object.entries(STATUS_COLORS).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: v.bg }} />
            <span style={{ color: '#334155' }}>{v.label}</span>
          </div>
        ))}
        {highlightRollId && (
          <span className="badge badge--warning" style={{ fontSize: 10 }}>
            ⚡ 原反ロール {highlightRollId.slice(0, 8)}... を強調表示中
          </span>
        )}
        <span style={{ color: '#94A3B8', marginLeft: 'auto' }}>
          合計: <strong>{schedules.length}</strong> 件の成型スケジュール
        </span>
      </div>

      {/* ── Main Gantt Matrix Area ── */}
      <div
        className="card-flat"
        style={{
          flex: 1,
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          border: '1px solid #E2E8F0',
        }}
      >
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
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--accent)',
            }}
          >
            <Loader2 size={20} className="animate-spin" />
            <span>スケジュール読込中...</span>
          </div>
        )}

        <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
          {/* Sticky Left Column: Machines Header */}
          <div
            style={{
              width: 150,
              flexShrink: 0,
              borderRight: '2px solid #CBD5E1',
              background: '#F8FAFC',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 20,
            }}
          >
            {/* Top-left corner box */}
            <div
              style={{
                height: 54,
                borderBottom: '2px solid #CBD5E1',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: '#F1F5F9',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>成型機 (14台)</span>
              <span style={{ fontSize: 9, color: '#64748B' }}>Machine Timeline</span>
            </div>

            {/* Machine Rows labels */}
            <div style={{ flex: 1, overflowY: 'hidden' }}>
              {displayMachines.map((m) => (
                <div
                  key={m.machine_code}
                  style={{
                    height: 52,
                    borderBottom: '1px solid #E2E8F0',
                    padding: '6px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: '#F8FAFC',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, fontFamily: 'monospace', color: '#0F172A' }}>
                      {m.machine_code}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        padding: '1px 5px',
                        borderRadius: 3,
                        background: '#E2E8F0',
                        color: '#334155',
                        fontWeight: 700,
                      }}
                    >
                      {m.machine_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable Right Area: Timeline Headers & Schedule Bars */}
          <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
            <div style={{ width: totalTimelineWidth, minWidth: '100%' }}>
              {/* Timeline Header Row (Days & Shifts) */}
              <div
                style={{
                  height: 54,
                  borderBottom: '2px solid #CBD5E1',
                  background: '#F8FAFC',
                  display: 'flex',
                  position: 'sticky',
                  top: 0,
                  zIndex: 10,
                }}
              >
                {daysArray.map((day) => (
                  <div
                    key={day.dateStr}
                    style={{
                      width: DAY_COL_WIDTH,
                      flexShrink: 0,
                      borderRight: '1px solid #CBD5E1',
                      background: day.isToday ? '#EFF6FF' : day.isWeekend ? '#F8FAFC' : '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Day & Date */}
                    <div
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        borderBottom: '1px solid #E2E8F0',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: day.isToday ? 800 : 700,
                          fontFamily: 'monospace',
                          color: day.isToday ? '#2563EB' : '#1E293B',
                        }}
                      >
                        {day.label}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color:
                            day.dayOfWeek === '日'
                              ? '#DC2626'
                              : day.dayOfWeek === '土'
                              ? '#2563EB'
                              : '#64748B',
                        }}
                      >
                        ({day.dayOfWeek})
                      </span>
                      {day.isToday && (
                        <span
                          style={{
                            fontSize: 8,
                            fontWeight: 800,
                            padding: '1px 3px',
                            borderRadius: 2,
                            background: '#2563EB',
                            color: '#FFFFFF',
                          }}
                        >
                          本日
                        </span>
                      )}
                    </div>

                    {/* Shift (昼直 08:00 - 17:00) */}
                    <div style={{ height: 18, fontSize: 9, color: '#64748B', textAlign: 'center', lineHeight: '18px' }}>
                      昼直 (08:00 - 17:00)
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline Body Rows (Per Machine) */}
              <div style={{ position: 'relative' }}>
                {/* Vertical day grid background lines */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: totalTimelineWidth,
                    display: 'flex',
                    pointerEvents: 'none',
                  }}
                >
                  {daysArray.map((day) => (
                    <div
                      key={day.dateStr}
                      style={{
                        width: DAY_COL_WIDTH,
                        flexShrink: 0,
                        borderRight: '1px solid #E2E8F0',
                        background: day.isToday
                          ? 'rgba(239, 246, 255, 0.4)'
                          : day.isWeekend
                          ? 'rgba(248, 250, 252, 0.5)'
                          : 'transparent',
                        height: '100%',
                      }}
                    />
                  ))}
                </div>

                {/* Machine Schedule Rows */}
                {displayMachines.map((m) => {
                  const machineItems = schedulesByMachineCode[m.machine_code] || []

                  return (
                    <div
                      key={m.machine_code}
                      style={{
                        height: 52,
                        borderBottom: '1px solid #E2E8F0',
                        position: 'relative',
                      }}
                    >
                      {/* Bars for this machine */}
                      {machineItems.map((item) => {
                        // Calculate bar position based on scheduled_start / end
                        const timelineStartMs = new Date(rangeStart + 'T00:00:00Z').getTime()

                        const startMs = item.scheduled_start
                          ? new Date(item.scheduled_start).getTime()
                          : new Date(item.schedule_date + (item.shift === 'NIGHT' ? 'T20:00:00Z' : 'T08:00:00Z')).getTime()

                        const endMs = item.scheduled_end
                          ? new Date(item.scheduled_end).getTime()
                          : startMs + 8 * 3600 * 1000

                        const startOffsetHours = (startMs - timelineStartMs) / (1000 * 3600)
                        const durationHours = Math.max(4, (endMs - startMs) / (1000 * 3600))

                        // Each day has 24 hours and takes DAY_COL_WIDTH px (110px)
                        const PX_PER_HOUR = DAY_COL_WIDTH / 24
                        const barLeft = Math.max(0, startOffsetHours * PX_PER_HOUR)
                        const barWidth = Math.max(45, durationHours * PX_PER_HOUR)

                        // Status Color
                        const isOverdue =
                          item.status !== 'DONE' &&
                          item.scheduled_end &&
                          new Date(item.scheduled_end).getTime() < Date.now()
                        const colKey = isOverdue ? 'OVERDUE' : item.status || 'PLANNED'
                        const colorInfo = STATUS_COLORS[colKey] || STATUS_COLORS.PLANNED

                        // T8: Countdown Urgency
                        const urgency = getDeadlineUrgency(item.requested_delivery)

                        // T7: Highlight check
                        const isRollMatched = highlightRollId && item.roll_id === highlightRollId
                        const isDimmed = highlightRollId && !isRollMatched

                        return (
                          <div
                            key={item.schedule_id}
                            onClick={() => setSelectedItem(item)}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect()
                              setHoveredItem({
                                item,
                                x: rect.left + rect.width / 2,
                                y: rect.top - 8,
                              })
                            }}
                            onMouseLeave={() => setHoveredItem(null)}
                            style={{
                              position: 'absolute',
                              left: `${barLeft}px`,
                              width: `${barWidth}px`,
                              top: 8,
                              height: 36,
                              background: colorInfo.bg,
                              border: isRollMatched
                                ? '2px solid #FFFFFF'
                                : `1px solid ${colorInfo.border}`,
                              borderRadius: 5,
                              color: colorInfo.text,
                              padding: '2px 6px',
                              cursor: 'pointer',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              boxShadow: isRollMatched
                                ? '0 0 10px #3B82F6, 0 2px 6px rgba(0,0,0,0.3)'
                                : '0 1px 3px rgba(0,0,0,0.15)',
                              transition: 'all 0.15s ease',
                              opacity: isDimmed ? 0.25 : 1,
                              zIndex: isRollMatched ? 25 : 5,
                            }}
                            className="hover:scale-[1.02] hover:shadow-md"
                          >
                            {/* Bar Line 1: Product / WO + Shift badge + T8 Urgency badge */}
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: 10,
                                fontWeight: 800,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.product_code || item.wo_code || '指示'}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {urgency && (
                                  <span
                                    style={{
                                      fontSize: 8,
                                      fontWeight: 800,
                                      padding: '1px 3px',
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
                            </div>

                            {/* Bar Line 2: Quantity */}
                            <div
                              style={{
                                fontSize: 9,
                                opacity: 0.95,
                                fontFamily: 'monospace',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {(item.planned_quantity || 0).toLocaleString()} khay
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hover Tooltip (7 trường bắt buộc + T8 Deadline Urgency) ── */}
      {hoveredItem && (
        <div
          style={{
            position: 'fixed',
            left: `${hoveredItem.x}px`,
            top: `${hoveredItem.y}px`,
            transform: 'translate(-50%, -100%)',
            background: '#0F172A',
            color: '#FFFFFF',
            borderRadius: 6,
            padding: '10px 12px',
            fontSize: 11,
            zIndex: 9999,
            pointerEvents: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            width: 290,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: 4 }}>
            <span style={{ fontWeight: 800, color: '#38BDF8', fontFamily: 'monospace' }}>
              {hoveredItem.item.machine_code} {hoveredItem.item.machine_name}
            </span>
            <span
              style={{
                fontSize: 9,
                padding: '1px 5px',
                borderRadius: 3,
                background:
                  hoveredItem.item.status === 'DONE'
                    ? '#059669'
                    : hoveredItem.item.status === 'IN_PROGRESS'
                    ? '#D97706'
                    : '#2563EB',
                fontWeight: 700,
              }}
            >
              {hoveredItem.item.status} ({hoveredItem.item.shift})
            </span>
          </div>

          {/* 7 trường dữ liệu bắt buộc + Countdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '2px 6px', marginTop: 2 }}>
            <span style={{ color: '#94A3B8' }}>WO:</span>
            <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{hoveredItem.item.wo_code || '—'}</span>

            <span style={{ color: '#94A3B8' }}>品番 (SP):</span>
            <span style={{ fontWeight: 700, color: '#FCD34D' }}>{hoveredItem.item.product_code || '—'}</span>

            <span style={{ color: '#94A3B8' }}>計画/実績:</span>
            <span>
              {(hoveredItem.item.planned_quantity || 0).toLocaleString()} / {(hoveredItem.item.actual_quantity || 0).toLocaleString()} khay
            </span>

            <span style={{ color: '#94A3B8' }}>材料 (Nhựa):</span>
            <span>{hoveredItem.item.plastic_grade || 'PET 0.5t'}</span>

            <span style={{ color: '#94A3B8' }}>原反ロール:</span>
            <span style={{ fontFamily: 'monospace', color: '#86EFAC' }}>
              {hoveredItem.item.roll_barcode || '—'}
              {hoveredItem.item.roll_remaining_m ? ` (${hoveredItem.item.roll_remaining_m}m)` : ''}
            </span>

            <span style={{ color: '#94A3B8' }}>出荷納期:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#F87171', fontWeight: 700 }}>
                {hoveredItem.item.requested_delivery || '未定'}
              </span>
              {(() => {
                const urg = getDeadlineUrgency(hoveredItem.item.requested_delivery)
                if (!urg) return null
                return (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: '1px 4px',
                      borderRadius: 2,
                      background: urg.bg,
                      color: urg.text,
                    }}
                  >
                    {urg.label}
                  </span>
                )
              })()}
            </div>

            <span style={{ color: '#94A3B8' }}>作業担当:</span>
            <span>{hoveredItem.item.operator_name || hoveredItem.item.operator_short || '未割当'}</span>
          </div>
        </div>
      )}

      {/* ── Detail Modal when Clicked ── */}
      {selectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 8,
              width: 460,
              padding: '18px 20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={18} color="var(--accent)" />
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>
                  成型スケジュール詳細
                </span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '8px 12px', fontSize: 12 }}>
              <span style={{ color: '#64748B' }}>対象成型機:</span>
              <span style={{ fontWeight: 800, color: '#0F172A' }}>
                {selectedItem.machine_code} ({selectedItem.machine_name})
              </span>

              <span style={{ color: '#64748B' }}>予定日時:</span>
              <span style={{ fontFamily: 'monospace' }}>
                {selectedItem.schedule_date} (昼直 08:00-17:00)
              </span>

              <span style={{ color: '#64748B' }}>指示No (WO):</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{selectedItem.wo_code || '—'}</span>

              <span style={{ color: '#64748B' }}>製品品番:</span>
              <span style={{ fontWeight: 800, color: 'var(--accent)' }}>{selectedItem.product_code || '—'}</span>

              <span style={{ color: '#64748B' }}>計画数 / 実績数:</span>
              <span style={{ fontWeight: 700 }}>
                {(selectedItem.planned_quantity || 0).toLocaleString()} khay / 実績: {(selectedItem.actual_quantity || 0).toLocaleString()} khay
              </span>

              <span style={{ color: '#64748B' }}>使用原反ロール:</span>
              <span style={{ fontFamily: 'monospace' }}>
                {selectedItem.roll_barcode || '未指定'}
                {selectedItem.roll_remaining_m ? ` (残量: ${selectedItem.roll_remaining_m}m)` : ''}
              </span>

              <span style={{ color: '#64748B' }}>担当オペレーター:</span>
              <span>{selectedItem.operator_name || '未割当'}</span>

              <span style={{ color: '#64748B' }}>出荷納期:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#DC2626', fontWeight: 700 }}>{selectedItem.requested_delivery || '未定'}</span>
                {(() => {
                  const urg = getDeadlineUrgency(selectedItem.requested_delivery)
                  if (!urg) return null
                  return (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        padding: '1px 5px',
                        borderRadius: 3,
                        background: urg.bg,
                        color: urg.text,
                      }}
                    >
                      {urg.label}
                    </span>
                  )
                })()}
              </div>

              <span style={{ color: '#64748B' }}>備考:</span>
              <span style={{ color: '#475569' }}>{selectedItem.notes || '特記事項なし'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                onClick={() => setSelectedItem(null)}
                className="btn btn-primary text-xs px-4 py-1.5 h-auto font-bold"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
