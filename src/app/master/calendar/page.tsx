'use client'

import { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Briefcase,
  Sun,
  Coffee,
  Sparkles,
  Edit3,
  Check,
  X,
  Loader2,
  CalendarDays,
  PlusCircle,
  HelpCircle
} from 'lucide-react'
import {
  getCompanyCalendar,
  updateCalendarDay,
  toggleWorkingDay,
  batchUpdateCalendarDays,
  CalendarDayRecord
} from '@/app/actions/company-calendar'

const DAY_NAMES_JA = ['日', '月', '火', '水', '木', '金', '土']
const DAY_NAMES_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

const DAY_TYPE_CONFIG = {
  WORKDAY: { labelJA: '平日稼働', labelVI: 'Ngày làm việc', bg: '#F0FDF4', border: '#86EFAC', text: '#166534', badgeClass: 'badge--success' },
  SPECIAL_WORKDAY: { labelJA: '特別出勤', labelVI: 'Thứ 7 đi làm', bg: '#EFF6FF', border: '#93C5FD', text: '#1E40AF', badgeClass: 'badge--info' },
  HOLIDAY: { labelJA: '定休日', labelVI: 'Nghỉ tuần', bg: '#F8FAFC', border: '#CBD5E1', text: '#64748B', badgeClass: 'badge--neutral' },
  PUBLIC_HOLIDAY: { labelJA: '日本の祝日', labelVI: 'Ngày lễ Nhật', bg: '#FEF2F2', border: '#FCA5A5', text: '#991B1B', badgeClass: 'badge--error' },
  COMPANY_OFF: { labelJA: '会社休業', labelVI: 'Nghỉ công ty / Obon', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', badgeClass: 'badge--warning' },
}

export default function CompanyCalendarPage() {
  const t = useTranslations('Calendar')
  const now = new Date()
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear())
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth() + 1)
  
  const [days, setDays] = useState<CalendarDayRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [togglingDate, setTogglingDate] = useState<string | null>(null)
  
  // Edit Single Day Modal
  const [editingDay, setEditingDay] = useState<CalendarDayRecord | null>(null)
  const [editType, setEditType] = useState<CalendarDayRecord['day_type']>('WORKDAY')
  const [editIsWorking, setEditIsWorking] = useState(true)
  const [editHours, setEditHours] = useState('8.0')
  const [editNotes, setEditNotes] = useState('')
  const [savingSingle, setSavingSingle] = useState(false)

  // Batch Range Modal
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [batchStart, setBatchStart] = useState('')
  const [batchEnd, setBatchEnd] = useState('')
  const [batchType, setBatchType] = useState<CalendarDayRecord['day_type']>('COMPANY_OFF')
  const [batchNotes, setBatchNotes] = useState('')
  const [savingBatch, setSavingBatch] = useState(false)

  // Load calendar for selected year & month
  const loadMonthData = useCallback(async () => {
    setLoading(true)
    const res = await getCompanyCalendar(currentYear, currentMonth)
    if (res.success && res.data) {
      setDays(res.data)
    }
    setLoading(false)
  }, [currentYear, currentMonth])

  useEffect(() => {
    loadMonthData()
  }, [loadMonthData])

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear(currentYear - 1)
      setCurrentMonth(12)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear(currentYear + 1)
      setCurrentMonth(1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleToday = () => {
    setCurrentYear(now.getFullYear())
    setCurrentMonth(now.getMonth() + 1)
  }

  // Quick Toggle Handler
  const handleToggle = async (dateStr: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setTogglingDate(dateStr)
    const res = await toggleWorkingDay(dateStr)
    if (res.success) {
      setDays(prev => prev.map(d => {
        if (d.calendar_date === dateStr) {
          const nextWorking = res.is_working_day ?? !d.is_working_day
          const dow = new Date(dateStr + 'T00:00:00Z').getUTCDay()
          let newType: CalendarDayRecord['day_type'] = nextWorking ? (dow === 6 ? 'SPECIAL_WORKDAY' : 'WORKDAY') : (dow === 0 || dow === 6 ? 'HOLIDAY' : 'COMPANY_OFF')
          return {
            ...d,
            is_working_day: nextWorking,
            day_type: newType,
            working_hours: nextWorking ? 8.0 : 0.0
          }
        }
        return d
      }))
    }
    setTogglingDate(null)
  }

  // Open Edit Modal
  const handleOpenEdit = (day: CalendarDayRecord) => {
    setEditingDay(day)
    setEditType(day.day_type)
    setEditIsWorking(day.is_working_day)
    setEditHours(String(day.working_hours ?? 8.0))
    setEditNotes(day.notes || '')
  }

  // Save Single Day
  const handleSaveSingle = async () => {
    if (!editingDay) return
    setSavingSingle(true)
    const res = await updateCalendarDay(editingDay.calendar_date, {
      day_type: editType,
      is_working_day: editIsWorking,
      working_hours: parseFloat(editHours) || 0,
      notes: editNotes || null
    })
    if (res.success) {
      setDays(prev => prev.map(d => d.calendar_date === editingDay.calendar_date ? {
        ...d,
        day_type: editType,
        is_working_day: editIsWorking,
        working_hours: parseFloat(editHours) || 0,
        notes: editNotes || null
      } : d))
      setEditingDay(null)
    }
    setSavingSingle(false)
  }

  // Save Batch Range
  const handleSaveBatch = async () => {
    if (!batchStart || !batchEnd) return
    setSavingBatch(true)

    const dateList: string[] = []
    let curr = new Date(batchStart + 'T00:00:00Z')
    const end = new Date(batchEnd + 'T00:00:00Z')

    while (curr <= end) {
      dateList.push(curr.toISOString().slice(0, 10))
      curr.setUTCDate(curr.getUTCDate() + 1)
    }

    const isWorking = batchType === 'WORKDAY' || batchType === 'SPECIAL_WORKDAY'
    const res = await batchUpdateCalendarDays(dateList, {
      day_type: batchType,
      is_working_day: isWorking,
      working_hours: isWorking ? 8.0 : 0.0,
      notes: batchNotes || null
    })

    if (res.success) {
      await loadMonthData()
      setIsBatchModalOpen(false)
      setBatchStart('')
      setBatchEnd('')
      setBatchNotes('')
    }
    setSavingBatch(false)
  }

  // Calculate Monthly KPIs
  const totalDays = days.length
  const workingDaysCount = days.filter(d => d.is_working_day).length
  const holidaysCount = days.filter(d => !d.is_working_day).length
  const specialSaturdays = days.filter(d => d.day_type === 'SPECIAL_WORKDAY' && d.is_working_day).length
  const totalPlannedHours = days.reduce((sum, d) => sum + (d.is_working_day ? (Number(d.working_hours) || 8.0) : 0), 0)

  // Build 7-column calendar grid with leading/trailing blanks
  const firstDayOfMonth = new Date(Date.UTC(currentYear, currentMonth - 1, 1))
  const startDayOfWeek = firstDayOfMonth.getUTCDay() // 0 = Sun, 6 = Sat

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      
      {/* ─── 1. PAGE HEADER ─── */}
      <div className="card-flat" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: 8, background: 'var(--tint-teal-bg)', borderRadius: 8, color: 'var(--accent)' }}>
            <CalendarIcon size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              会社稼働カレンダー (Lịch Làm Việc Công Ty)
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
              Quản lý ngày làm việc (稼働日), ngày nghỉ lễ Nhật Bản, thứ 7 đi làm & kỳ nghỉ dài (お盆・年末年始)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleToday}
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            今月 (Tháng này)
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsBatchModalOpen(true)}
            style={{ fontSize: 12, padding: '6px 14px', gap: 6 }}
          >
            <PlusCircle size={14} />
            <span>一括期間設定 (Cài đặt chuỗi ngày)</span>
          </button>
        </div>
      </div>

      {/* ─── 2. FILTER & MONTH NAVIGATION BAR ─── */}
      <div className="card-flat" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', flexShrink: 0, flexWrap: 'wrap', gap: 10 }}>
        {/* Month Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={handlePrevMonth}
            className="btn btn-secondary"
            style={{ padding: '6px 10px' }}
            title="Tháng trước"
          >
            <ChevronLeft size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              className="form-input font-bold font-mono"
              style={{ width: 95, height: 34, fontSize: 14 }}
            >
              {[2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}年</option>
              ))}
            </select>

            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
              className="form-input font-bold font-mono"
              style={{ width: 85, height: 34, fontSize: 14 }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{m}月</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="btn btn-secondary"
            style={{ padding: '6px 10px' }}
            title="Tháng sau"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#F0FDF4', border: '1px solid #86EFAC' }} />
            <span>平日稼働 (Làm việc)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#EFF6FF', border: '1px solid #93C5FD' }} />
            <span style={{ fontWeight: 700, color: '#1E40AF' }}>⭐ 特別出勤 (T7 đi làm)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#FEF2F2', border: '1px solid #FCA5A5' }} />
            <span>日本の祝日 (Lễ Nhật)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#FFFBEB', border: '1px solid #FDE68A' }} />
            <span>会社休業 (Nghỉ Obon/Tết)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: '#F8FAFC', border: '1px solid #CBD5E1' }} />
            <span>定休日 (Nghỉ tuần)</span>
          </div>
        </div>
      </div>

      {/* ─── 3. KPI SUMMARY CARDS ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, flexShrink: 0 }}>
        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid #166534', background: '#F0FDF4' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Briefcase size={14} /> 稼働日数 (Ngày làm việc)
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#166534', fontFamily: 'monospace', marginTop: 3 }}>
            {workingDaysCount} <span style={{ fontSize: 12, fontWeight: 600 }}>日 / {totalDays}日</span>
          </div>
        </div>

        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid #1E40AF', background: '#EFF6FF' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1E40AF', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Sparkles size={14} /> 特別出勤日数 (Thứ 7 đi làm)
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#1E40AF', fontFamily: 'monospace', marginTop: 3 }}>
            {specialSaturdays} <span style={{ fontSize: 12, fontWeight: 600 }}>日</span>
          </div>
        </div>

        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid #991B1B', background: '#FEF2F2' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#991B1B', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Coffee size={14} /> 休日・祝日数 (Ngày nghỉ & lễ)
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#991B1B', fontFamily: 'monospace', marginTop: 3 }}>
            {holidaysCount} <span style={{ fontSize: 12, fontWeight: 600 }}>日</span>
          </div>
        </div>

        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid var(--accent)', background: 'var(--tint-teal-bg)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={14} /> 予定総労働時間 (Tổng giờ kế hoạch)
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--accent)', fontFamily: 'monospace', marginTop: 3 }}>
            {totalPlannedHours.toFixed(1)} <span style={{ fontSize: 12, fontWeight: 600 }}>h</span>
          </div>
        </div>
      </div>

      {/* ─── 4. MONTH CALENDAR GRID ─── */}
      <div className="card-flat" style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250, gap: 8, color: 'var(--text-muted)' }}>
            <Loader2 className="animate-spin" size={20} />
            <span>カレンダーデータを読み込み中...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* Header: Day of Week */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
              {DAY_NAMES_JA.map((dName, idx) => {
                const isSun = idx === 0
                const isSat = idx === 6
                return (
                  <div
                    key={dName}
                    style={{
                      textAlign: 'center',
                      fontWeight: 800,
                      fontSize: 12,
                      padding: '6px 0',
                      borderRadius: 4,
                      background: isSun ? '#FEE2E2' : isSat ? '#DBEAFE' : '#F1F5F9',
                      color: isSun ? '#991B1B' : isSat ? '#1E40AF' : '#475569'
                    }}
                  >
                    {dName} <span style={{ fontSize: 10, fontWeight: 600 }}>({DAY_NAMES_VI[idx]})</span>
                  </div>
                )
              })}
            </div>

            {/* Grid of Day Cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, flex: 1 }}>
              
              {/* Empty cells before start of month */}
              {Array.from({ length: startDayOfWeek }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  style={{
                    borderRadius: 6,
                    background: '#F8FAFC',
                    opacity: 0.3,
                    border: '1px dashed #E2E8F0',
                    minHeight: 90
                  }}
                />
              ))}

              {/* Real Month Days */}
              {days.map((day) => {
                const dayNum = parseInt(day.calendar_date.split('-')[2], 10)
                const config = DAY_TYPE_CONFIG[day.day_type] || DAY_TYPE_CONFIG.WORKDAY
                const isToday = day.calendar_date === now.toISOString().slice(0, 10)
                const isToggling = togglingDate === day.calendar_date

                return (
                  <div
                    key={day.calendar_date}
                    onClick={() => handleOpenEdit(day)}
                    style={{
                      borderRadius: 8,
                      border: `1.5px solid ${isToday ? 'var(--accent)' : config.border}`,
                      background: config.bg,
                      padding: '8px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 95,
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: isToday ? '0 0 0 2px rgba(13,148,136,0.2)' : 'none',
                      transition: 'transform 0.1s, box-shadow 0.1s'
                    }}
                    className="hover:shadow-sm"
                  >
                    {/* Top Row: Date Number & Quick Toggle */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'monospace', color: config.text }}>
                          {dayNum}
                        </span>
                        {isToday && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: 'var(--accent)', padding: '1px 5px', borderRadius: 3 }}>
                            今日
                          </span>
                        )}
                      </div>

                      {/* 1-Click Working/Holiday Toggle Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggle(day.calendar_date, e)}
                        disabled={isToggling}
                        title={day.is_working_day ? 'Bấm để đổi thành Ngày Nghỉ' : 'Bấm để đổi thành Ngày Làm Việc'}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          border: `1px solid ${day.is_working_day ? '#166534' : '#64748B'}`,
                          background: day.is_working_day ? '#DCFCE7' : '#F1F5F9',
                          color: day.is_working_day ? '#166534' : '#64748B',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2
                        }}
                      >
                        {isToggling ? <Loader2 size={10} className="animate-spin" /> : day.is_working_day ? '稼働' : '休'}
                      </button>
                    </div>

                    {/* Middle: Notes / Holiday Name */}
                    <div style={{ margin: '4px 0', minHeight: 20 }}>
                      {day.notes ? (
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: config.text,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={day.notes}
                        >
                          {day.notes}
                        </div>
                      ) : (
                        <div style={{ fontSize: 10, color: config.text, opacity: 0.8 }}>
                          {config.labelJA}
                        </div>
                      )}
                    </div>

                    {/* Bottom: Hours & Edit trigger */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10.5 }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: config.text }}>
                        {day.is_working_day ? `${day.working_hours}h` : '0h'}
                      </span>
                      <Edit3 size={12} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── MODAL: EDIT SINGLE DAY ─── */}
      {editingDay && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-default)', paddingBottom: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarDays size={18} style={{ color: 'var(--accent)' }} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  日別カレンダー設定 ({editingDay.calendar_date})
                </h3>
              </div>
              <button type="button" onClick={() => setEditingDay(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              
              {/* Working Day Toggle */}
              <div>
                <label className="form-label font-bold" style={{ fontSize: 11.5 }}>{t('dayType')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => { setEditIsWorking(true); if (editType === 'HOLIDAY' || editType === 'COMPANY_OFF') setEditType('WORKDAY') }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: 12,
                      border: editIsWorking ? '2px solid #166534' : '1px solid var(--border-default)',
                      background: editIsWorking ? '#DCFCE7' : '#F8FAFC',
                      color: editIsWorking ? '#166534' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    🟢 {t('workday')}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setEditIsWorking(false); if (editType === 'WORKDAY' || editType === 'SPECIAL_WORKDAY') setEditType('HOLIDAY') }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: 12,
                      border: !editIsWorking ? '2px solid #991B1B' : '1px solid var(--border-default)',
                      background: !editIsWorking ? '#FEE2E2' : '#F8FAFC',
                      color: !editIsWorking ? '#991B1B' : 'var(--text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    🔴 {t('holiday')}
                  </button>
                </div>
              </div>

              {/* Day Type Selection */}
              <div>
                <label className="form-label font-bold" style={{ fontSize: 11.5 }}>{t('dayType')}</label>
                <select
                  className="form-input font-bold"
                  value={editType}
                  onChange={(e) => {
                    const val = e.target.value as CalendarDayRecord['day_type']
                    setEditType(val)
                    if (val === 'WORKDAY' || val === 'SPECIAL_WORKDAY') setEditIsWorking(true)
                    else setEditIsWorking(false)
                  }}
                  style={{ height: 36, fontSize: 12 }}
                >
                  <option value="WORKDAY">{t('workday')}</option>
                  <option value="SPECIAL_WORKDAY">⭐ {t('specialWorkday')}</option>
                  <option value="HOLIDAY">{t('holiday')}</option>
                  <option value="PUBLIC_HOLIDAY">{t('publicHoliday')}</option>
                  <option value="COMPANY_OFF">{t('companyOff')}</option>
                </select>
              </div>

              {/* Working Hours */}
              {editIsWorking && (
                <div>
                  <label className="form-label font-bold" style={{ fontSize: 11.5 }}>{t('workingHours')}</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="24"
                    className="form-input font-mono font-bold"
                    value={editHours}
                    onChange={(e) => setEditHours(e.target.value)}
                    style={{ height: 36, fontSize: 13 }}
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="form-label font-bold" style={{ fontSize: 11.5 }}>{t('notes')}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="例: お盆休み、特別出勤日、社内行事など..."
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{ height: 36, fontSize: 12 }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingDay(null)}
                  style={{ fontSize: 12, padding: '7px 16px' }}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveSingle}
                  disabled={savingSingle}
                  style={{ fontSize: 12, padding: '7px 20px', gap: 6 }}
                >
                  {savingSingle ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>保存する</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: BATCH RANGE SETTING ─── */}
      {isBatchModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <div className="card" style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-default)', paddingBottom: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <PlusCircle size={18} style={{ color: 'var(--accent)' }} />
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {t('batchModalTitle')}
                  </h3>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {t('batchModalSubtitle')}
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => setIsBatchModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              
              {/* Date Range */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label className="form-label font-bold" style={{ fontSize: 11.5 }}>{t('startDate')}</label>
                  <input
                    type="date"
                    className="form-input font-mono font-bold"
                    value={batchStart}
                    onChange={(e) => setBatchStart(e.target.value)}
                    style={{ height: 36, fontSize: 12 }}
                  />
                </div>
                <div>
                  <label className="form-label font-bold" style={{ fontSize: 11.5 }}>{t('endDate')}</label>
                  <input
                    type="date"
                    className="form-input font-mono font-bold"
                    value={batchEnd}
                    onChange={(e) => setBatchEnd(e.target.value)}
                    style={{ height: 36, fontSize: 12 }}
                  />
                </div>
              </div>

              {/* Day Type Selection */}
              <div>
                <label className="form-label font-bold" style={{ fontSize: 11.5 }}>{t('dayType')}</label>
                <select
                  className="form-input font-bold"
                  value={batchType}
                  onChange={(e) => setBatchType(e.target.value as CalendarDayRecord['day_type'])}
                  style={{ height: 36, fontSize: 12 }}
                >
                  <option value="COMPANY_OFF">{t('companyOff')}</option>
                  <option value="PUBLIC_HOLIDAY">{t('publicHoliday')}</option>
                  <option value="SPECIAL_WORKDAY">⭐ {t('specialWorkday')}</option>
                  <option value="WORKDAY">{t('workday')}</option>
                  <option value="HOLIDAY">{t('holiday')}</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="form-label font-bold" style={{ fontSize: 11.5 }}>{t('notes')}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="例: お盆休み (8/13〜8/16)、創立記念休暇など..."
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  style={{ height: 36, fontSize: 12 }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsBatchModalOpen(false)}
                  style={{ fontSize: 12, padding: '7px 16px' }}
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveBatch}
                  disabled={savingBatch || !batchStart || !batchEnd}
                  style={{ fontSize: 12, padding: '7px 20px', gap: 6 }}
                >
                  {savingBatch ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>{t('applyBatch')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
