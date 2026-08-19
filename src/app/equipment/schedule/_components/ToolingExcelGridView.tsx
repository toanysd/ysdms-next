'use client'

import React, { useState, useMemo, useEffect } from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { format, parseISO, addDays, isSameDay } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { X, Calendar, Layers, CheckCircle2, Clock } from 'lucide-react'
import ToolingGroupedJobCard from './ToolingGroupedJobCard'
import ToolingMonthGroupedJobCard from './ToolingMonthGroupedJobCard'
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
    trackFilter?: 'ALL' | 'DESIGN' | 'MOLD' | 'PLUG' | 'CUTTER'
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
    const router = useRouter()

    const [liveJobs, setLiveJobs] = useState<JobForGantt[]>(jobs)

    useEffect(() => {
        setLiveJobs(jobs)
    }, [jobs])

    // Accordion state: dateStr -> activeJobId (null means all collapsed in multi-job cells)
    const [activeAccordionMap, setActiveAccordionMap] = useState<Record<string, string | null>>({})
    
    // Day Focus Modal for zooming in on a single day
    const [selectedDayForFocusModal, setSelectedDayForFocusModal] = useState<string | null>(null)

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
            if (trackFilter && trackFilter !== 'ALL') {
                if (trackFilter === 'DESIGN') {
                    const isDesignJob = j.job_category === 'DESIGN' || j.job_code?.startsWith('DES-') || j.job_steps?.some(s => (s.track || '').toUpperCase() === 'DESIGN')
                    if (!isDesignJob) return false
                } else {
                    const hasMatchingStep = j.job_steps?.some(s => {
                        if ((s as any).condition === 'EXISTING' || (s as any).step_status === 'EXISTING' || (s as any).arrangement === 'NOT_REQUIRED') return false
                        const track = (s.track || 'MOLD').toUpperCase()
                        if (trackFilter === 'MOLD') return track === 'MOLD' || track === 'ALUMI' || track === 'FINISH'
                        return track === trackFilter
                    })
                    if (!hasMatchingStep) return false
                }
            }

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

    // Check if step falls on date: SMART DEADLINE MATCH
    // - Ad-hoc / custom steps (e.g. スタッキング on 8/17, 材料手配 on 8/18) match their explicit step.deadline
    // - Main mold manufacturing steps (金型製作, プラグ, 抜型, etc.) match job.target_completion_date (完成目標日 - 3稼働日前)
    const isStepOnDate = (step: JobStepRow, dateStr: string, job: JobForGantt) => {
        const hasLogs = step.work_logs && step.work_logs.length > 0
        const hasHours = Number(step.planned_hours) > 0 || Number(step.estimated_hours) > 0 || (step.actual_hours && step.actual_hours > 0)
        const isCompletedOrActive = step.step_status === 'COMPLETED' || step.step_status === 'IN_PROGRESS' || (step.processing_statuses?.status_code && !step.processing_statuses.status_code.includes('未'))

        const stepDl = step.deadline ? step.deadline.split('T')[0] : null
        const jobMoldDl = job.mold_deadline ? job.mold_deadline.split('T')[0] : null
        const jobTargetDl = job.target_completion_date ? job.target_completion_date.split('T')[0] : (jobMoldDl || null)

        // 1. If step has an explicit custom deadline DIFFERENT from job.mold_deadline (e.g. スタッキング on 8/17)
        if (stepDl && jobMoldDl && stepDl !== jobMoldDl) {
            if (stepDl === dateStr) return true
            return false
        }

        // 2. If step is a main manufacturing step (step.deadline equals mold_deadline or target_completion_date or is null)
        // Match against job.target_completion_date (the fabrication target for the mold department)
        if (!stepDl || stepDl === jobMoldDl || stepDl === jobTargetDl) {
            if (jobTargetDl === dateStr && (hasLogs || hasHours || isCompletedOrActive)) {
                return true
            }
        }

        return false
    }

    // Group jobs for a specific date (unifying Design and Mold jobs for the same product)
    const getGroupedJobsForDate = (dateStr: string) => {
        const dateJobMap = new Map<string, { job: JobForGantt, steps: JobStepRow[] }>()
        
        filteredJobs.forEach(job => {
            const groupKey = (job as any).product_id || job.products?.product_id || (job as any).work_order_id || job.job_id
            let matchingSteps = (job.job_steps || []).filter(step => isStepOnDate(step, dateStr, job))
            if (trackFilter && trackFilter !== 'ALL') {
                matchingSteps = matchingSteps.filter(step => {
                    if (trackFilter === 'DESIGN') {
                        return (step.track || '').toUpperCase() === 'DESIGN' || job.job_category === 'DESIGN' || job.job_code?.startsWith('DES-')
                    }
                    const track = (step.track || 'MOLD').toUpperCase()
                    if (trackFilter === 'MOLD') return track === 'MOLD' || track === 'ALUMI' || track === 'FINISH'
                    return track === trackFilter
                })
            }
            if (matchingSteps.length > 0) {
                if (!dateJobMap.has(groupKey)) {
                    dateJobMap.set(groupKey, {
                        job,
                        steps: [...matchingSteps]
                    })
                } else {
                    const existing = dateJobMap.get(groupKey)!
                    existing.steps.push(...matchingSteps)
                    // Prefer manufacturing job over DESIGN job for header display
                    if (job.job_category !== 'DESIGN' && existing.job.job_category === 'DESIGN') {
                        existing.job = job
                    }
                }
            }
        })

        return Array.from(dateJobMap.values())
    }

    // Toggle Accordion for a specific date
    const handleToggleJobAccordion = (dateStr: string, jobId: string, isMultiJob: boolean) => {
        setActiveAccordionMap(prev => {
            const currentActive = prev[dateStr]
            // If already active, collapse it. If not active, expand it and collapse others.
            if (currentActive === jobId) {
                return { ...prev, [dateStr]: null }
            }
            return { ...prev, [dateStr]: jobId }
        })
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
        const isMultiJob = groupedJobs.length > 1

        return (
            <div 
                key={dateStr}
                className={`flex flex-col h-full rounded-lg border transition-all overflow-hidden bg-white min-h-0 ${
                    isToday 
                        ? 'border-[var(--accent)] shadow-md ring-2 ring-[var(--accent)]/20' 
                        : isWeekend 
                            ? 'border-[var(--border-default)] bg-slate-50/40' 
                            : 'border-[var(--border-default)] shadow-xs'
                }`}
            >
                {/* Column Header: Date + Count Badge */}
                <div className={`px-2 py-1.5 flex items-center justify-between border-b shrink-0 ${
                    isToday ? 'bg-[var(--tint-teal-bg)] border-[var(--accent)]/30' : 'bg-slate-100/70 border-[var(--border-default)]'
                }`}>
                    <div className="flex items-center gap-1 min-w-0">
                        <span className={`font-mono font-bold text-[13px] ${isToday ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                            {format(parsedDate, 'MM/dd')}
                        </span>
                        <span className={`text-[10.5px] font-bold ${isWeekend ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                            ({DAYS_JA[dayIndex]})
                        </span>
                        {isToday && (
                            <span className="px-1 py-0.2 rounded bg-[var(--accent)] text-white text-[8px] font-bold uppercase shadow-2xs">
                                {t('today')}
                            </span>
                        )}
                    </div>

                    {totalJobsCount > 0 && (
                        <button
                            type="button"
                            onClick={() => setSelectedDayForFocusModal(dateStr)}
                            className="text-[9px] font-bold font-mono px-1.5 py-0.2 rounded bg-white text-[var(--text-secondary)] border border-[var(--border-default)] shadow-2xs shrink-0 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer flex items-center gap-1"
                            title="クリックでこの日の全案件を拡大表示"
                        >
                            <span>{totalJobsCount} 案件</span>
                            {!isCompact && <span>({totalStepsCount} 項目)</span>}
                        </button>
                    )}
                </div>

                {/* Column Content: Stack of Grouped Job Cards with Smooth Independent Scrolling */}
                <div className="p-1.5 flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 bg-slate-50/60" style={{ scrollbarWidth: 'thin' }}>
                    {groupedJobs.map(({ job, steps }) => {
                        // In 2-week view when multiple jobs exist, smart accordion controls which job is expanded
                        const activeJobId = activeAccordionMap[dateStr]
                        const isExpanded = isMultiJob && isCompact
                            ? activeJobId === job.job_id
                            : (activeJobId === null ? false : activeJobId === undefined ? true : activeJobId === job.job_id)

                        return (
                            <ToolingGroupedJobCard 
                                key={job.job_id}
                                job={job}
                                steps={steps}
                                empMap={empMap}
                                machMap={machMap}
                                currentColumnDate={dateStr}
                                isExpanded={isExpanded}
                                onToggleExpand={() => handleToggleJobAccordion(dateStr, job.job_id, isMultiJob)}
                                onOpenJob={setSelectedJobForDrawer}
                                onEditStep={(st, j) => setSelectedStepForEdit({ step: st, job: j })}
                                onQuickLog={(j, st) => setSelectedJobForWorklog({ job: j, step: st, date: dateStr })}
                            />
                        )
                    })}

                    {groupedJobs.length === 0 && (
                        <div className="flex-1 min-h-[50px] flex flex-col items-center justify-center text-[var(--text-muted)] text-[10.5px] italic opacity-40">
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
        const isSaturday = dayIndex === 6
        const isSunday = dayIndex === 0
        const isWeekend = isSaturday || isSunday
        const isToday = isSameDay(parsedDate, new Date())
        const groupedJobs = getGroupedJobsForDate(dateStr)

        return (
            <div
                key={dateStr}
                className={`flex flex-col h-full bg-white border overflow-hidden transition-all p-1.5 shadow-2xs ${
                    isToday
                        ? 'bg-[var(--tint-teal-bg)]/35 border-[var(--accent)] ring-2 ring-[var(--accent)]/40 z-10'
                        : isSunday
                            ? 'bg-rose-50/30 border-slate-200'
                            : isSaturday
                                ? 'bg-blue-50/20 border-slate-200'
                                : 'border-slate-200 hover:border-slate-300'
                }`}
            >
                {/* Cell Header: Date + Today Pill + Item Count Badge */}
                <div className={`flex justify-between items-center px-1 pb-1 mb-1 border-b text-[11px] ${
                    isToday ? 'border-[var(--accent)]/30' : 'border-slate-100'
                }`}>
                    <div className="flex items-center gap-1">
                        <span className={`font-mono font-bold text-[12px] ${
                            isToday
                                ? 'text-[var(--accent)] font-extrabold'
                                : isSunday
                                    ? 'text-red-600'
                                    : isSaturday
                                        ? 'text-blue-600'
                                        : 'text-slate-800'
                        }`}>
                            {format(parsedDate, 'MM/dd')}
                        </span>
                        <span className={`text-[10px] font-bold ${
                            isSunday
                                ? 'text-red-500'
                                : isSaturday
                                    ? 'text-blue-500'
                                    : 'text-slate-500'
                        }`}>
                            ({DAYS_JA[dayIndex]})
                        </span>
                        {isToday && (
                            <span className="px-1 py-0.2 rounded bg-[var(--accent)] text-white text-[8px] font-bold uppercase shadow-2xs">
                                {t('today')}
                            </span>
                        )}
                    </div>

                    {groupedJobs.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setSelectedDayForFocusModal(dateStr)}
                            className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-300 shadow-2xs hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer transition-all"
                            title="クリックでこの日の案件を拡大表示"
                        >
                            {groupedJobs.length} 件
                        </button>
                    )}
                </div>

                {/* Cell Body: List of rich Grouped Month Job Cards with urgency colors */}
                <div className="flex flex-col gap-1.5 overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin' }}>
                    {groupedJobs.map(({ job, steps }) => (
                        <ToolingMonthGroupedJobCard 
                            key={job.job_id}
                            job={job}
                            steps={steps}
                            empMap={empMap}
                            machMap={machMap}
                            currentColumnDate={dateStr}
                            onOpenJob={setSelectedJobForDrawer}
                            onEditStep={(st, j) => setSelectedStepForEdit({ step: st, job: j })}
                            onQuickLog={(j, st) => setSelectedJobForWorklog({ job: j, step: st, date: dateStr })}
                        />
                    ))}

                    {groupedJobs.length === 0 && (
                        <div className="h-full flex items-center justify-center text-slate-300 text-[10px] italic">
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
                <div className="grid grid-cols-7 gap-2 h-full w-full p-2 overflow-hidden">
                    {dateList.slice(0, 7).map(dateStr => renderDayColumn(dateStr, false))}
                </div>
            )}

            {/* ─── 2. TIMEFRAME = 2 WEEKS: 2-ROW SPLIT GRID (7 COLS X 2 ROWS WITH ACCORDION) ─── */}
            {timeframe === 'week2' && (
                <div className="flex flex-col gap-2 h-full w-full p-2 overflow-hidden">
                    {/* Row 1: Week 1 (Days 1-7) */}
                    <div className="grid grid-cols-7 gap-1.5 flex-1 min-h-0 overflow-hidden">
                        {dateList.slice(0, 7).map(dateStr => renderDayColumn(dateStr, true))}
                    </div>
                    {/* Row 2: Week 2 (Days 8-14) */}
                    <div className="grid grid-cols-7 gap-1.5 flex-1 min-h-0 overflow-hidden">
                        {dateList.slice(7, 14).map(dateStr => renderDayColumn(dateStr, true))}
                    </div>
                </div>
            )}

            {/* ─── 3. TIMEFRAME = 1 MONTH: STANDARD MONTH CALENDAR GRID ─── */}
            {timeframe === 'month' && (
                <div className="flex flex-col h-full w-full p-2 overflow-hidden">
                    {/* Month Weekdays Header */}
                    <div className="grid grid-cols-7 gap-1 pb-1 shrink-0 text-center font-bold text-[10.5px] text-slate-600 border-b border-slate-200">
                        {['月 (Mon)', '火 (Tue)', '水 (Wed)', '木 (Thu)', '金 (Fri)', '土 (Sat)', '日 (Sun)'].map((dayName, idx) => (
                            <div key={dayName} className={`py-0.5 rounded bg-slate-100 ${idx >= 5 ? 'text-red-600' : ''}`}>
                                {dayName}
                            </div>
                        ))}
                    </div>

                    {/* Month Grid Cells */}
                    <div className="grid grid-cols-7 gap-1 flex-1 min-h-0 overflow-y-auto pt-1">
                        {dateList.map(dateStr => renderMonthCell(dateStr))}
                    </div>
                </div>
            )}

            {/* ─── DAY FOCUS MODAL: FULL DETAILS EXPANSION FOR A SINGLE DAY ─── */}
            {selectedDayForFocusModal && (() => {
                const dayParsed = parseISO(selectedDayForFocusModal)
                const dayGroupedJobs = getGroupedJobsForDate(selectedDayForFocusModal)
                const totalHours = dayGroupedJobs.reduce((sum, g) => {
                    const stepSum = g.steps.reduce((sSum, s) => {
                        const logSum = (s.work_logs || []).reduce((wSum, w) => wSum + (Number(w.hours_spent) || 0), 0)
                        return sSum + (s.actual_hours || logSum || 0)
                    }, 0)
                    return sum + stepSum
                }, 0)

                return (
                    <div 
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
                        onClick={() => setSelectedDayForFocusModal(null)}
                    >
                        <div 
                            className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="text-[var(--accent)]" size={18} />
                                    <div>
                                        <h3 className="font-bold text-[14px] text-slate-800 flex items-center gap-2">
                                            <span>{format(dayParsed, 'yyyy年MM月dd日')} ({DAYS_JA[dayParsed.getDay()]}) の作業・金型案件</span>
                                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                                                {dayGroupedJobs.length} 案件
                                            </span>
                                        </h3>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDayForFocusModal(null)}
                                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body: List of all Jobs in full expansion */}
                            <div className="p-3.5 flex flex-col gap-3 overflow-y-auto bg-slate-50/70 flex-1">
                                {dayGroupedJobs.map(({ job, steps }) => (
                                    <ToolingGroupedJobCard 
                                        key={job.job_id}
                                        job={job}
                                        steps={steps}
                                        empMap={empMap}
                                        machMap={machMap}
                                        currentColumnDate={selectedDayForFocusModal}
                                        isExpanded={true}
                                        onOpenJob={(j) => {
                                            setSelectedJobForDrawer(j)
                                            setSelectedDayForFocusModal(null)
                                        }}
                                        onEditStep={(st, j) => {
                                            setSelectedStepForEdit({ step: st, job: j })
                                        }}
                                        onQuickLog={(j, st) => {
                                            setSelectedJobForWorklog({ job: j, step: st, date: selectedDayForFocusModal })
                                        }}
                                    />
                                ))}

                                {dayGroupedJobs.length === 0 && (
                                    <div className="py-12 text-center text-slate-400 text-[13px] italic">
                                        この日の作業予定はありません
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-600 font-mono">
                                <div>
                                    合計実績: <strong className="text-emerald-700 font-bold">{totalHours.toFixed(1)}h</strong>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedDayForFocusModal(null)}
                                    className="btn btn-secondary py-1 px-3 text-[11.5px]"
                                >
                                    閉じる (Close)
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })()}

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
