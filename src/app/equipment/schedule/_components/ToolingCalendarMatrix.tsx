'use client'

import React, { useState, useMemo, useCallback } from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { format, parseISO, addDays, isSameDay } from 'date-fns'
import { useTranslations } from 'next-intl'
import { ChevronRight, ChevronDown, Crosshair, Sparkles, CheckCircle2, Clock, AlertTriangle, Layers, User, Plus } from 'lucide-react'
import { JobQuickViewDrawer } from '@/components/equipment/JobQuickViewDrawer'
import { EditStepModal } from '@/app/equipment/jobs/[id]/tabs/EditStepModal'
import { DailyWorklogQuickModal } from '@/components/worklogs/DailyWorklogQuickModal'

interface ToolingCalendarMatrixProps {
    jobs: JobForGantt[]
    workOrders?: any[]
    machines: any[]
    employees: any[]
    startDateStr: string
    daysCount?: number
    trackFilter?: 'ALL' | 'MOLD' | 'PLUG' | 'CUTTER'
    searchQuery?: string
}

// Tree row item types
type TreeRowType = 'job' | 'track' | 'step'

interface TreeRowItem {
    id: string
    type: TreeRowType
    job: JobForGantt
    trackCode?: string
    trackLabel?: string
    trackDeadline?: string | null
    trackStatus?: string
    step?: JobStepRow
    depth: number
}

const TRACK_META: Record<string, { label: string, badge: string, color: string, bg: string }> = {
    MOLD: { label: '金型', badge: 'M', color: 'var(--accent)', bg: 'var(--tint-teal-bg)' },
    PLUG: { label: 'プラグ', badge: 'P', color: 'var(--status-warning)', bg: 'var(--tint-amber-bg)' },
    CUTTER: { label: '抜型', badge: 'C', color: 'var(--brand-purple, #9333ea)', bg: 'var(--tint-purple-bg, #f3e8ff)' }
}

const daysJa = ['日', '月', '火', '水', '木', '金', '土']

function formatShortDateWithDay(dateString?: string | null): string {
    if (!dateString) return ''
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return ''
    return `${d.getMonth() + 1}/${d.getDate()}(${daysJa[d.getDay()]})`
}

function getDelayInfo(deadlineStr?: string | null, isCompleted?: boolean) {
    if (!deadlineStr) return null
    const deadline = new Date(deadlineStr)
    deadline.setHours(0, 0, 0, 0)
    if (isNaN(deadline.getTime())) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (isCompleted) {
        return { label: formatShortDateWithDay(deadlineStr), badgeClass: 'badge badge--success text-[10px]' }
    }

    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24))
    if (diffDays < 0) {
        return { label: `! ${formatShortDateWithDay(deadlineStr)}`, badgeClass: 'badge badge--error font-bold text-[10px] animate-pulse' }
    } else if (diffDays <= 2) {
        return { label: formatShortDateWithDay(deadlineStr), badgeClass: 'badge badge--warning font-bold text-[10px]' }
    }
    return { label: formatShortDateWithDay(deadlineStr), badgeClass: 'badge badge--neutral text-[10px]' }
}

export default function ToolingCalendarMatrix({
    jobs,
    workOrders = [],
    machines = [],
    employees = [],
    startDateStr,
    daysCount = 14,
    trackFilter = 'ALL',
    searchQuery = ''
}: ToolingCalendarMatrixProps) {
    const t = useTranslations('Equipment.Schedule')
    const tDays = useTranslations('Equipment.Schedule.days')

    // Tree expand state
    const [expandedJobs, setExpandedJobs] = useState<Set<string>>(() => new Set(jobs.map(j => j.job_id)))
    const [expandedTracks, setExpandedTracks] = useState<Set<string>>(() => {
        const s = new Set<string>()
        jobs.forEach(j => {
            s.add(`${j.job_id}-MOLD`)
            s.add(`${j.job_id}-PLUG`)
            s.add(`${j.job_id}-CUTTER`)
        })
        return s
    })

    // Modals & Drawers state
    const [selectedJobForDrawer, setSelectedJobForDrawer] = useState<JobForGantt | null>(null)
    const [selectedStepForEdit, setSelectedStepForEdit] = useState<{ step: JobStepRow, job: JobForGantt } | null>(null)
    const [selectedJobForWorklog, setSelectedJobForWorklog] = useState<{ job: JobForGantt, step?: JobStepRow, date?: string } | null>(null)

    // Lookup Maps
    const empMap = useMemo(() => {
        const m = new Map<string, string>()
        employees.forEach(e => m.set(e.employee_id, e.employee_name || e.employee_code))
        return m
    }, [employees])

    const machMap = useMemo(() => {
        const m = new Map<string, string>()
        machines.forEach(mach => m.set(mach.machine_id, mach.machine_code || mach.machine_name))
        return m
    }, [machines])

    // Filter jobs
    const filteredJobs = useMemo(() => {
        return jobs.filter(j => {
            if (trackFilter === 'MOLD' && !j.job_steps?.some(s => s.track === 'MOLD')) return false
            if (trackFilter === 'PLUG' && !j.has_plug && !j.job_steps?.some(s => s.track === 'PLUG')) return false
            if (trackFilter === 'CUTTER' && !j.job_steps?.some(s => s.track === 'CUTTER')) return false

            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchCode = j.job_code?.toLowerCase().includes(q)
                const matchName = j.job_name?.toLowerCase().includes(q)
                const matchProduct = j.products?.product_code?.toLowerCase().includes(q) || j.products?.product_name_internal?.toLowerCase().includes(q)
                const matchCustomer = j.companies?.company_name?.toLowerCase().includes(q)
                if (!matchCode && !matchName && !matchProduct && !matchCustomer) return false
            }
            return true
        })
    }, [jobs, trackFilter, searchQuery])

    // Generate Calendar Dates
    const start = parseISO(startDateStr)
    const dateList: string[] = useMemo(() => {
        const list: string[] = []
        for (let i = 0; i < daysCount; i++) {
            list.push(format(addDays(start, i), 'yyyy-MM-dd'))
        }
        return list
    }, [start, daysCount])

    // Expand / Collapse Handlers
    const toggleJobExpand = useCallback((jobId: string) => {
        setExpandedJobs(prev => {
            const next = new Set(prev)
            if (next.has(jobId)) next.delete(jobId)
            else next.add(jobId)
            return next
        })
    }, [])

    const toggleTrackExpand = useCallback((trackKey: string) => {
        setExpandedTracks(prev => {
            const next = new Set(prev)
            if (next.has(trackKey)) next.delete(trackKey)
            else next.add(trackKey)
            return next
        })
    }, [])

    const handleExpandAll = useCallback(() => {
        const allJobs = new Set(jobs.map(j => j.job_id))
        const allTracks = new Set<string>()
        jobs.forEach(j => {
            allTracks.add(`${j.job_id}-MOLD`)
            allTracks.add(`${j.job_id}-PLUG`)
            allTracks.add(`${j.job_id}-CUTTER`)
        })
        setExpandedJobs(allJobs)
        setExpandedTracks(allTracks)
    }, [jobs])

    const handleCollapseAll = useCallback(() => {
        setExpandedJobs(new Set())
        setExpandedTracks(new Set())
    }, [])

    const handleExpandTracksOnly = useCallback(() => {
        setExpandedJobs(new Set(jobs.map(j => j.job_id)))
        setExpandedTracks(new Set())
    }, [jobs])

    // Build Flat Rows for Synchronized Rendering
    const flattenedRows: TreeRowItem[] = useMemo(() => {
        const rows: TreeRowItem[] = []

        filteredJobs.forEach(job => {
            // 1. Job Row
            rows.push({
                id: job.job_id,
                type: 'job',
                job,
                depth: 0
            })

            if (!expandedJobs.has(job.job_id)) return

            const steps = job.job_steps || []
            const moldSteps = steps.filter(s => s.track === 'MOLD' || !s.track)
            const plugSteps = steps.filter(s => s.track === 'PLUG')
            const cutterSteps = steps.filter(s => s.track === 'CUTTER')

            const tracks = [
                { key: 'MOLD', label: '金型', steps: moldSteps, deadline: job.mold_deadline, status: job.mold_track_status },
                ...(job.has_plug || plugSteps.length > 0 ? [{ key: 'PLUG', label: 'プラグ', steps: plugSteps, deadline: job.mold_deadline, status: job.plug_track_status }] : []),
                ...(cutterSteps.length > 0 ? [{ key: 'CUTTER', label: '抜型', steps: cutterSteps, deadline: job.mold_deadline, status: 'PENDING' }] : [])
            ]

            tracks.forEach(tr => {
                const trackKey = `${job.job_id}-${tr.key}`
                const completedStepsCount = tr.steps.filter(s => s.step_status === 'COMPLETED' || s.processing_statuses?.status_code?.includes('完了')).length

                // 2. Track Row
                rows.push({
                    id: trackKey,
                    type: 'track',
                    job,
                    trackCode: tr.key,
                    trackLabel: `${tr.label} (${completedStepsCount}/${tr.steps.length} 工程)`,
                    trackDeadline: tr.deadline,
                    trackStatus: tr.status,
                    depth: 1
                })

                if (!expandedTracks.has(trackKey)) return

                // 3. Step Rows
                tr.steps.forEach(step => {
                    rows.push({
                        id: `${job.job_id}-${step.step_id}`,
                        type: 'step',
                        job,
                        trackCode: tr.key,
                        step,
                        depth: 2
                    })
                })
            })
        })

        return rows
    }, [filteredJobs, expandedJobs, expandedTracks])

    return (
        <div className="w-full h-full flex flex-col overflow-hidden bg-[var(--bg-surface)]">
            {/* Scrollable Container with Split Left (Sticky) and Right Matrix */}
            <div className="w-full h-full overflow-auto">
                <div className="inline-block min-w-max bg-[var(--bg-surface)] border-b border-r border-[var(--border-default)]">
                    
                    {/* ─────────────────────────────────────────────────────────────
                        HEADER ROW (Sticky Top)
                    ───────────────────────────────────────────────────────────── */}
                    <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-surface)] sticky top-0 z-30 shadow-xs">
                        {/* LEFT HEADER (Width: 480px, Sticky Left) */}
                        <div className="w-[500px] shrink-0 border-r border-[var(--border-default)] px-3 py-2 sticky left-0 bg-[var(--bg-surface)] z-40 flex items-center justify-between shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded p-0.5 shadow-xs">
                                    <button onClick={handleCollapseAll} className="px-1.5 py-0.5 hover:bg-[var(--bg-surface-hover)] rounded text-[10px] font-bold" title="すべて折りたたむ">－</button>
                                    <button onClick={handleExpandTracksOnly} className="px-1.5 py-0.5 hover:bg-[var(--bg-surface-hover)] rounded text-[10px] font-bold text-[var(--accent)]" title="トラックのみ展開">⚙️</button>
                                    <button onClick={handleExpandAll} className="px-1.5 py-0.5 hover:bg-[var(--bg-surface-hover)] rounded text-[10px] font-bold" title="すべて展開">＋</button>
                                </div>
                                <span className="font-bold text-[12px] text-[var(--text-primary)]">ジョブ / 工程 (Job & Steps)</span>
                            </div>
                            <div className="grid grid-cols-[85px_65px_60px_65px_65px] gap-1 text-[10px] font-bold text-[var(--text-muted)] text-center tracking-tight">
                                <div>設備</div>
                                <div>予定/実績</div>
                                <div>状態</div>
                                <div>完成期日</div>
                                <div className="text-[var(--accent)]">出荷日</div>
                            </div>
                        </div>

                        {/* RIGHT CALENDAR HEADER (Day Columns) */}
                        {dateList.map((dateStr) => {
                            const parsedDate = parseISO(dateStr)
                            const isToday = isSameDay(parsedDate, new Date())
                            const dayIndex = parsedDate.getDay().toString() as '0'|'1'|'2'|'3'|'4'|'5'|'6'
                            const isWeekend = dayIndex === '0' || dayIndex === '6'

                            return (
                                <div 
                                    key={dateStr} 
                                    className={`w-[140px] shrink-0 border-r border-[var(--border-default)] py-1.5 px-1 flex flex-col items-center justify-center transition-colors ${
                                        isToday 
                                            ? 'bg-[var(--tint-teal-bg)] border-b-2 border-b-[var(--accent)]' 
                                            : isWeekend 
                                                ? 'bg-[var(--bg-surface-2)]' 
                                                : 'bg-[var(--bg-surface-hover)]'
                                    }`}
                                >
                                    <div className={`font-mono font-bold text-[13px] leading-tight ${isToday ? 'text-[var(--accent)] font-extrabold' : 'text-[var(--text-primary)]'}`}>
                                        {format(parsedDate, 'MM/dd')}
                                    </div>
                                    <div className={`text-[10px] font-bold ${isWeekend ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                                        ({tDays(dayIndex)})
                                    </div>
                                    {isToday && (
                                        <span className="mt-0.5 px-1 rounded bg-[var(--accent)] text-white text-[8px] font-bold uppercase tracking-tighter">
                                            {t('today')}
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* ─────────────────────────────────────────────────────────────
                        BODY ROWS (1:1 Left Row to Right Calendar Row)
                    ───────────────────────────────────────────────────────────── */}
                    {flattenedRows.map((row, rIdx) => {
                        const { job, step, type, trackCode } = row
                        const isJobRow = type === 'job'
                        const isTrackRow = type === 'track'
                        const isStepRow = type === 'step'

                        const isJobExpanded = expandedJobs.has(job.job_id)
                        const isTrackExpanded = isTrackRow && expandedTracks.has(row.id)

                        const moldDeadlineInfo = getDelayInfo(job.mold_deadline, job.job_status === 'COMPLETED')
                        const shipDateInfo = getDelayInfo(job.ship_date, job.job_status === 'COMPLETED')

                        return (
                            <div 
                                key={row.id} 
                                className={`flex border-b border-[var(--border-default)] transition-colors ${
                                    isJobRow 
                                        ? 'bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] min-h-[40px]' 
                                        : isTrackRow 
                                            ? 'bg-[var(--bg-surface-2)]/60 hover:bg-[var(--bg-surface-hover)] min-h-[34px]' 
                                            : 'bg-[var(--bg-surface)] hover:bg-[var(--tint-teal-bg)]/20 min-h-[36px]'
                                }`}
                            >
                                {/* ─── LEFT PANEL ROW (Sticky Left, Width: 500px) ─── */}
                                <div 
                                    className={`w-[500px] shrink-0 border-r border-[var(--border-default)] px-2 py-1 sticky left-0 z-20 flex items-center justify-between shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] bg-inherit ${
                                        isJobRow ? 'font-bold' : ''
                                    }`}
                                >
                                    {/* Left Title & Hierarchy Indent */}
                                    <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-2">
                                        {/* Expand Toggle */}
                                        {isJobRow ? (
                                            <button 
                                                onClick={() => toggleJobExpand(job.job_id)}
                                                className="w-4 h-4 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0"
                                            >
                                                {isJobExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                            </button>
                                        ) : isTrackRow ? (
                                            <button 
                                                onClick={() => toggleTrackExpand(row.id)}
                                                className="w-4 h-4 ml-3 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] shrink-0"
                                            >
                                                {isTrackExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                            </button>
                                        ) : (
                                            <div className="w-4 ml-6 shrink-0 text-center text-[var(--text-muted)] text-[10px]">↳</div>
                                        )}

                                        {/* Title Display */}
                                        {isJobRow ? (
                                            <div 
                                                onClick={() => setSelectedJobForDrawer(job)}
                                                className="flex items-center gap-1.5 truncate cursor-pointer hover:underline"
                                                title={`[${job.job_code}] ${job.job_name}`}
                                            >
                                                <span className="font-mono text-[13px] text-[var(--accent)] font-bold truncate">
                                                    {job.products?.product_code || job.job_code}
                                                </span>
                                                <span className="text-[11px] text-[var(--text-primary)] truncate font-semibold font-jp">
                                                    {job.job_name}
                                                </span>
                                            </div>
                                        ) : isTrackRow ? (
                                            <div className="flex items-center gap-1 text-[11px] font-semibold">
                                                <span 
                                                    className="w-4 h-4 rounded-xs text-[9px] font-bold flex items-center justify-center uppercase shrink-0"
                                                    style={{ backgroundColor: TRACK_META[trackCode || 'MOLD']?.bg, color: TRACK_META[trackCode || 'MOLD']?.color }}
                                                >
                                                    {TRACK_META[trackCode || 'MOLD']?.badge}
                                                </span>
                                                <span className="truncate text-[var(--text-primary)] font-jp">{row.trackLabel}</span>
                                            </div>
                                        ) : (
                                            <div 
                                                onDoubleClick={() => setSelectedStepForEdit({ step: step!, job })}
                                                className="flex items-center gap-1 text-[11px] truncate cursor-pointer hover:text-[var(--accent)]"
                                                title={`${step?.step_name} (ダブルクリックで編集)`}
                                            >
                                                <span className="text-[var(--text-muted)] font-mono text-[10px]">{step?.step_no}.</span>
                                                <span className="truncate text-[var(--text-primary)] font-medium font-jp">{step?.step_name}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Specs in Left Panel */}
                                    <div className="grid grid-cols-[85px_65px_60px_65px_65px] gap-1 text-[11px] text-center items-center shrink-0 font-mono">
                                        {/* Machine */}
                                        <div className="truncate text-[10px] text-[var(--text-muted)] px-1">
                                            {isStepRow ? (machMap.get(step?.machine_id || '') || step?.machining_location || '—') : ''}
                                        </div>

                                        {/* Hours (Planned / Actual) */}
                                        <div className="text-[11px] text-[var(--text-secondary)]">
                                            {isStepRow ? (
                                                <span>{step?.planned_hours ? `${step.planned_hours}h` : '—'}</span>
                                            ) : isTrackRow ? (
                                                <span className="font-bold text-[10px]">
                                                    {(row as any).step ? '' : ''}
                                                </span>
                                            ) : (
                                                <span className="font-bold text-[11px] text-[var(--accent)]">
                                                    {(job as any).estimated_hours ? `${(job as any).estimated_hours}h` : ''}
                                                </span>
                                            )}
                                        </div>

                                        {/* Status */}
                                        <div className="text-[10px]">
                                            {isJobRow ? (
                                                <span className={`px-1 py-0.2 rounded font-bold uppercase text-[9px] ${
                                                    job.job_status === 'COMPLETED' ? 'badge badge--success' : job.job_status === 'IN_PROGRESS' ? 'badge badge--warning' : 'badge badge--neutral'
                                                }`}>
                                                    {job.job_status === 'COMPLETED' ? '完了' : job.job_status === 'IN_PROGRESS' ? '進行中' : '新規'}
                                                </span>
                                            ) : isStepRow ? (
                                                <span className="text-[10px] text-[var(--text-muted)] font-jp">
                                                    {step?.step_status === 'COMPLETED' ? '完了' : step?.step_status === 'IN_PROGRESS' ? '進行' : '未定'}
                                                </span>
                                            ) : ''}
                                        </div>

                                        {/* Mold Deadline */}
                                        <div>
                                            {isJobRow && moldDeadlineInfo ? (
                                                <span className={moldDeadlineInfo.badgeClass}>{moldDeadlineInfo.label}</span>
                                            ) : isStepRow && step?.deadline ? (
                                                <span className="text-[10px] text-[var(--text-muted)]">{formatShortDateWithDay(step.deadline)}</span>
                                            ) : '—'}
                                        </div>

                                        {/* Ship Date */}
                                        <div>
                                            {isJobRow && shipDateInfo ? (
                                                <span className="font-bold text-[var(--accent)] text-[10px]">{shipDateInfo.label}</span>
                                            ) : '—'}
                                        </div>
                                    </div>
                                </div>

                                {/* ─── RIGHT CALENDAR GRID ROW (Date Columns) ─── */}
                                {dateList.map((dateStr) => {
                                    const parsedDate = parseISO(dateStr)
                                    const isToday = isSameDay(parsedDate, new Date())

                                    // 1. Step Row Cell
                                    if (isStepRow && step) {
                                        const pStart = step.planned_start ? step.planned_start.split('T')[0] : null
                                        const pEnd = step.planned_end ? step.planned_end.split('T')[0] : (step.deadline ? step.deadline.split('T')[0] : null)
                                        const isPlannedOnDate = pStart && pEnd ? (dateStr >= pStart && dateStr <= pEnd) : (pEnd === dateStr)

                                        const workLogsOnDate = (step.work_logs || []).filter(w => w.work_date === dateStr)
                                        const totalLogHours = workLogsOnDate.reduce((sum, w) => sum + (Number(w.hours_spent) || 0), 0)
                                        const isDeadlineDay = step.deadline && step.deadline.split('T')[0] === dateStr

                                        return (
                                            <div 
                                                key={dateStr} 
                                                onDoubleClick={() => setSelectedJobForWorklog({ job, step, date: dateStr })}
                                                className={`w-[140px] shrink-0 border-r border-[var(--border-default)] p-1 flex flex-col justify-center items-center relative transition-colors ${
                                                    isToday ? 'bg-[var(--tint-teal-bg)]/20' : ''
                                                }`}
                                            >
                                                {/* Actual Log (Green Pill) */}
                                                {totalLogHours > 0 && (
                                                    <div 
                                                        onClick={(e) => { e.stopPropagation(); setSelectedJobForWorklog({ job, step, date: dateStr }) }}
                                                        className="w-full text-center py-0.5 px-1 rounded bg-[var(--status-success-bg, #e6f4ea)] text-[var(--status-success)] border border-[var(--status-success)]/30 font-bold font-mono text-[10px] shadow-xs cursor-pointer truncate"
                                                        title={`実績: ${totalLogHours.toFixed(1)}h\nダブルクリックで日報修正`}
                                                    >
                                                        ✅ {totalLogHours.toFixed(1)}h
                                                    </div>
                                                )}

                                                {/* Planned Step Pill (Teal / Amber) */}
                                                {isPlannedOnDate && totalLogHours === 0 && (
                                                    <div 
                                                        onClick={(e) => { e.stopPropagation(); setSelectedStepForEdit({ step, job }) }}
                                                        className={`w-full text-center py-0.5 px-1 rounded text-[10px] font-bold font-mono cursor-pointer truncate shadow-xs ${
                                                            step.step_status === 'IN_PROGRESS' 
                                                                ? 'bg-[var(--tint-amber-bg)] text-[var(--status-warning)] border border-[var(--status-warning)]/40' 
                                                                : 'bg-[var(--tint-teal-bg)] text-[var(--accent)] border border-[var(--accent)]/30'
                                                        }`}
                                                        title={`予定: ${step.step_name} (${step.planned_hours || step.estimated_hours || 0}h)\nクリックで編集`}
                                                    >
                                                        {machMap.get(step.machine_id || '') || step.step_name}
                                                    </div>
                                                )}

                                                {/* Deadline Marker */}
                                                {isDeadlineDay && !isPlannedOnDate && totalLogHours === 0 && (
                                                    <div className="w-full text-center py-0.5 px-1 rounded bg-red-50 text-red-700 border border-red-200 text-[9px] font-bold font-mono">
                                                        🎯 期限
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }

                                    // 2. Track Row Cell
                                    if (isTrackRow) {
                                        return (
                                            <div 
                                                key={dateStr} 
                                                className={`w-[140px] shrink-0 border-r border-[var(--border-default)] p-1 flex items-center justify-center ${
                                                    isToday ? 'bg-[var(--tint-teal-bg)]/20' : ''
                                                }`}
                                            >
                                                {/* Track Deadline Flag */}
                                                {job.mold_deadline && job.mold_deadline.split('T')[0] === dateStr && (
                                                    <span className="text-[9px] font-bold text-[var(--accent)] bg-[var(--tint-teal-bg)] px-1 rounded border border-[var(--accent)]/30">
                                                        🏁 {TRACK_META[trackCode || 'MOLD']?.label}
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    }

                                    // 3. Job Row Cell
                                    const isMoldDeadline = job.mold_deadline && job.mold_deadline.split('T')[0] === dateStr
                                    const isShipDate = job.ship_date && job.ship_date.split('T')[0] === dateStr

                                    return (
                                        <div 
                                            key={dateStr} 
                                            className={`w-[140px] shrink-0 border-r border-[var(--border-default)] p-1 flex flex-col gap-0.5 items-center justify-center ${
                                                isToday ? 'bg-[var(--tint-teal-bg)]/30' : ''
                                            }`}
                                        >
                                            {isMoldDeadline && (
                                                <div 
                                                    className="w-full text-center py-0.5 px-1 rounded bg-[var(--tint-teal-bg)] text-[var(--accent)] border border-[var(--accent)] font-bold text-[10px] shadow-xs"
                                                    title={`完成目標日: ${formatShortDateWithDay(job.mold_deadline)}`}
                                                >
                                                    🏁 完成
                                                </div>
                                            )}
                                            {isShipDate && (
                                                <div 
                                                    className="w-full text-center py-0.5 px-1 rounded bg-[var(--tint-amber-bg)] text-[var(--status-warning)] border border-[var(--status-warning)] font-bold text-[10px] shadow-xs"
                                                    title={`出荷予定日: ${formatShortDateWithDay(job.ship_date)}`}
                                                >
                                                    📦 出荷
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Quick View Drawer */}
            {selectedJobForDrawer && (
                <JobQuickViewDrawer 
                    job={selectedJobForDrawer}
                    onClose={() => setSelectedJobForDrawer(null)}
                    onOpenStepEdit={(jobId, step) => {
                        const j = jobs.find(jb => jb.job_id === jobId) || selectedJobForDrawer
                        setSelectedStepForEdit({ step, job: j })
                    }}
                    onJobUpdated={() => setSelectedJobForDrawer(null)}
                />
            )}

            {/* Edit Step Modal */}
            {selectedStepForEdit && (
                <EditStepModal 
                    step={selectedStepForEdit.step}
                    jobId={selectedStepForEdit.job.job_id}
                    nextStepNo={(selectedStepForEdit.job.job_steps?.length || 0) + 1}
                    onClose={() => setSelectedStepForEdit(null)}
                    onSaved={() => setSelectedStepForEdit(null)}
                />
            )}

            {/* Daily Worklog Quick Modal */}
            {selectedJobForWorklog && (
                <DailyWorklogQuickModal 
                    isOpen={!!selectedJobForWorklog}
                    onClose={() => setSelectedJobForWorklog(null)}
                    initialEmployeeId={selectedJobForWorklog.step?.assigned_to || (selectedJobForWorklog.job as any).responsible_id || undefined}
                    initialDate={selectedJobForWorklog.date || format(new Date(), 'yyyy-MM-dd')}
                />
            )}
        </div>
    )
}
