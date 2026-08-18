'use client'

import React, { useState, useMemo, useEffect } from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { format, parseISO, addDays, isSameDay } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import ToolingGroupedJobCard from './ToolingGroupedJobCard'
import ToolingMonthJobPill from './ToolingMonthJobPill'
import { JobQuickViewDrawer } from '@/components/equipment/JobQuickViewDrawer'
import { EditStepModal } from '@/app/equipment/jobs/[id]/tabs/EditStepModal'
import { DailyWorklogQuickModal } from '@/components/worklogs/DailyWorklogQuickModal'

import { TimeframeMode } from './ToolingScheduleToolbar'

const DAYS_JA = ['日', '月', '火', '水', '木', '金', '土']

interface ToolingExcelGridViewProps {
    jobs: JobForGantt[]
    workOrders?: any[]
    machines: any[]
    employees: any[]
    startDateStr: string
    daysCount?: number
    timeframe?: TimeframeMode
    perspective?: string
    trackFilter?: 'ALL' | 'MOLD' | 'PLUG' | 'CUTTER'
    searchQuery?: string
}

export default function ToolingExcelGridView({
    jobs,
    workOrders = [],
    machines = [],
    employees = [],
    startDateStr,
    daysCount = 14,
    timeframe = 'week2',
    trackFilter = 'ALL',
    searchQuery = ''
}: ToolingExcelGridViewProps) {
    const t = useTranslations('Equipment.Schedule')
    const tDays = useTranslations('Equipment.Schedule.days')
    const router = useRouter()

    const [liveJobs, setLiveJobs] = useState<JobForGantt[]>(jobs)

    useEffect(() => {
        setLiveJobs(jobs)
    }, [jobs])

    // Modal / Drawer states
    const [selectedJobForDrawer, setSelectedJobForDrawer] = useState<JobForGantt | null>(null)
    const [selectedStepForEdit, setSelectedStepForEdit] = useState<{ step: JobStepRow, job: JobForGantt } | null>(null)
    const [selectedJobForWorklog, setSelectedJobForWorklog] = useState<{ job: JobForGantt, step?: JobStepRow, date?: string } | null>(null)

    // Lookup maps
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
        return liveJobs.filter(j => {
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
    }, [liveJobs, trackFilter, searchQuery])

    // Generate date list based on timeframe
    const start = parseISO(startDateStr)
    const activeDaysCount = timeframe === 'week1' ? 7 : timeframe === 'week2' ? 14 : Math.max(daysCount, 28)
    
    const dateList: string[] = useMemo(() => {
        const list: string[] = []
        for (let i = 0; i < activeDaysCount; i++) {
            list.push(format(addDays(start, i), 'yyyy-MM-dd'))
        }
        return list
    }, [start, activeDaysCount])

    // Check if step falls on date: STRICT DEADLINE MATCH & ONLY INSTRUCTED/ACTIVE STEPS
    const isStepOnDate = (step: JobStepRow, dateStr: string, job: JobForGantt) => {
        const hasLogs = step.work_logs && step.work_logs.length > 0
        const hasHours = Number(step.planned_hours) > 0 || Number(step.estimated_hours) > 0 || (step.actual_hours && step.actual_hours > 0)
        const isCompletedOrActive = step.step_status === 'COMPLETED' || step.step_status === 'IN_PROGRESS' || (step.processing_statuses?.status_code && !step.processing_statuses.status_code.includes('未'))

        // 1. Step explicit deadline matches this date
        if (step.deadline) {
            const stepDl = step.deadline.split('T')[0]
            if (stepDl === dateStr) return true
        }

        // 2. If step has no explicit deadline, only match if job mold_deadline matches AND step is actually instructed/active
        if (!step.deadline) {
            const moldDl = job.mold_deadline ? job.mold_deadline.split('T')[0] : null
            if (moldDl === dateStr && (hasLogs || hasHours || isCompletedOrActive)) {
                return true
            }
        }

        return false
    }

    // Group jobs for a specific date
    const getGroupedJobsForDate = (dateStr: string) => {
        const dateJobMap = new Map<string, { job: JobForGantt, steps: JobStepRow[] }>()
        
        filteredJobs.forEach(job => {
            const matchingSteps = (job.job_steps || []).filter(step => isStepOnDate(step, dateStr, job))
            if (matchingSteps.length > 0) {
                dateJobMap.set(job.job_id, {
                    job,
                    steps: matchingSteps
                })
            }
        })

        return Array.from(dateJobMap.values())
    }

    // Render single standard day column (Used in 1-Week and 2-Weeks Views)
    const renderDayColumn = (dateStr: string, isCompact: boolean = false) => {
        const parsedDate = parseISO(dateStr)
        const dayIndex = parsedDate.getDay()
        const isWeekend = dayIndex === 0 || dayIndex === 6
        const isToday = isSameDay(parsedDate, new Date())
        const groupedJobs = getGroupedJobsForDate(dateStr)
        const totalJobsCount = groupedJobs.length
        const totalStepsCount = groupedJobs.reduce((sum, g) => sum + g.steps.length, 0)

        return (
            <div 
                key={dateStr}
                className={`flex flex-col h-full rounded-lg border transition-all overflow-hidden bg-white ${
                    isToday 
                        ? 'border-[var(--accent)] shadow-md ring-2 ring-[var(--accent)]/20' 
                        : isWeekend 
                            ? 'border-[var(--border-default)] bg-slate-50/40' 
                            : 'border-[var(--border-default)] shadow-xs'
                }`}
            >
                {/* Column Header: Date + Count */}
                <div className={`px-2.5 py-2 flex items-center justify-between border-b shrink-0 ${
                    isToday ? 'bg-[var(--tint-teal-bg)] border-[var(--accent)]/30' : 'bg-slate-100/70 border-[var(--border-default)]'
                }`}>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`font-mono font-bold text-[14px] ${isToday ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                            {format(parsedDate, 'MM/dd')}
                        </span>
                        <span className={`text-[11px] font-bold ${isWeekend ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                            ({DAYS_JA[dayIndex]})
                        </span>
                        {isToday && (
                            <span className="px-1.5 py-0.2 rounded bg-[var(--accent)] text-white text-[8.5px] font-bold uppercase shadow-2xs">
                                {t('today')}
                            </span>
                        )}
                    </div>

                    {totalJobsCount > 0 && (
                        <span className="text-[9.5px] font-bold font-mono px-1.5 py-0.2 rounded bg-white text-[var(--text-secondary)] border border-[var(--border-default)] shadow-2xs shrink-0">
                            {totalJobsCount} 案件 {isCompact ? '' : `(${totalStepsCount} 項目)`}
                        </span>
                    )}
                </div>

                {/* Column Content: Stack of Grouped Job Cards */}
                <div className={`p-2 flex flex-col gap-2.5 overflow-y-auto flex-1 bg-slate-50/60 ${isCompact ? 'max-h-full' : ''}`}>
                    {groupedJobs.map(({ job, steps }) => (
                        <ToolingGroupedJobCard 
                            key={job.job_id}
                            job={job}
                            steps={steps}
                            empMap={empMap}
                            machMap={machMap}
                            onOpenJob={setSelectedJobForDrawer}
                            onEditStep={(st, j) => setSelectedStepForEdit({ step: st, job: j })}
                            onQuickLog={(j, st) => setSelectedJobForWorklog({ job: j, step: st, date: dateStr })}
                        />
                    ))}

                    {groupedJobs.length === 0 && (
                        <div className="flex-1 min-h-[60px] flex flex-col items-center justify-center text-[var(--text-muted)] text-[10.5px] italic opacity-40">
                            <span>— {t('noTasks')} —</span>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Render Month Day Cell (Used in Month Calendar Grid View)
    const renderMonthCell = (dateStr: string) => {
        const parsedDate = parseISO(dateStr)
        const dayIndex = parsedDate.getDay()
        const isWeekend = dayIndex === 0 || dayIndex === 6
        const isToday = isSameDay(parsedDate, new Date())
        const groupedJobs = getGroupedJobsForDate(dateStr)

        return (
            <div
                key={dateStr}
                className={`flex flex-col h-full bg-white border border-slate-200 overflow-hidden transition-all hover:bg-slate-50/60 p-1 ${
                    isToday ? 'bg-emerald-50/30 border-emerald-400 ring-1 ring-emerald-400/30' : isWeekend ? 'bg-slate-50/40' : ''
                }`}
            >
                {/* Cell Header: Date + Badge */}
                <div className="flex justify-between items-center px-1 pb-1 mb-1 border-b border-slate-100 text-[11px]">
                    <div className="flex items-center gap-1">
                        <span className={`font-mono font-bold ${isToday ? 'text-emerald-700 font-extrabold' : isWeekend ? 'text-red-500' : 'text-slate-700'}`}>
                            {format(parsedDate, 'MM/dd')}
                        </span>
                        <span className={`text-[9.5px] ${isWeekend ? 'text-red-400' : 'text-slate-400'}`}>
                            ({DAYS_JA[dayIndex]})
                        </span>
                    </div>

                    {groupedJobs.length > 0 && (
                        <span className="text-[9px] font-bold font-mono px-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {groupedJobs.length} 件
                        </span>
                    )}
                </div>

                {/* Cell Body: List of compact Month Job Pills */}
                <div className="flex flex-col gap-1 overflow-y-auto flex-1">
                    {groupedJobs.map(({ job, steps }) => (
                        <React.Fragment key={job.job_id}>
                            {steps.map(step => (
                                <ToolingMonthJobPill 
                                    key={step.step_id}
                                    job={job}
                                    step={step}
                                    onClick={(j, st) => setSelectedStepForEdit({ step: st, job: j })}
                                    onDoubleClick={(j, st) => setSelectedJobForWorklog({ job: j, step: st, date: dateStr })}
                                />
                            ))}
                        </React.Fragment>
                    ))}

                    {groupedJobs.length === 0 && (
                        <div className="h-full flex items-center justify-center text-slate-300 text-[9px] italic">
                            —
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden bg-[var(--bg-surface-2)]">
            {/* ─── 1. TIMEFRAME = 1 WEEK: 7 COLUMNS AUTO-FIT VIEWPORT ─── */}
            {timeframe === 'week1' && (
                <div className="grid grid-cols-7 gap-2.5 h-full w-full p-2.5 overflow-hidden">
                    {dateList.slice(0, 7).map(dateStr => renderDayColumn(dateStr, false))}
                </div>
            )}

            {/* ─── 2. TIMEFRAME = 2 WEEKS: 2-ROW SPLIT GRID (7 COLS X 2 ROWS) ─── */}
            {timeframe === 'week2' && (
                <div className="flex flex-col gap-2.5 h-full w-full p-2.5 overflow-hidden">
                    {/* Row 1: Week 1 (Days 1-7) */}
                    <div className="grid grid-cols-7 gap-2 flex-1 min-h-0 overflow-hidden">
                        {dateList.slice(0, 7).map(dateStr => renderDayColumn(dateStr, true))}
                    </div>
                    {/* Row 2: Week 2 (Days 8-14) */}
                    <div className="grid grid-cols-7 gap-2 flex-1 min-h-0 overflow-hidden">
                        {dateList.slice(7, 14).map(dateStr => renderDayColumn(dateStr, true))}
                    </div>
                </div>
            )}

            {/* ─── 3. TIMEFRAME = 1 MONTH: STANDARD MONTH CALENDAR GRID (7 COLS X 4-5 ROWS) ─── */}
            {timeframe === 'month' && (
                <div className="flex flex-col h-full w-full p-2.5 overflow-hidden">
                    {/* Month Weekdays Header */}
                    <div className="grid grid-cols-7 gap-1.5 pb-1.5 shrink-0 text-center font-bold text-[11px] text-slate-600 border-b border-slate-200">
                        {['月 (Mon)', '火 (Tue)', '水 (Wed)', '木 (Thu)', '金 (Fri)', '土 (Sat)', '日 (Sun)'].map((dayName, idx) => (
                            <div key={dayName} className={`py-1 rounded bg-slate-100 ${idx >= 5 ? 'text-red-600' : ''}`}>
                                {dayName}
                            </div>
                        ))}
                    </div>

                    {/* Month Grid Cells */}
                    <div className="grid grid-cols-7 gap-1.5 flex-1 min-h-0 overflow-y-auto pt-1.5">
                        {dateList.map(dateStr => renderMonthCell(dateStr))}
                    </div>
                </div>
            )}

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
                    onClose={() => {
                        setSelectedStepForEdit(null)
                        router.refresh()
                    }}
                    onSaved={() => {
                        router.refresh()
                    }}
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
