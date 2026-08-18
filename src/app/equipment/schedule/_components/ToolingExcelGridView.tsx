'use client'

import React, { useState, useMemo } from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { format, parseISO, addDays, isSameDay } from 'date-fns'
import { useTranslations } from 'next-intl'
import ToolingJobCard from './ToolingJobCard'
import { JobQuickViewDrawer } from '@/components/equipment/JobQuickViewDrawer'
import { EditStepModal } from '@/app/equipment/jobs/[id]/tabs/EditStepModal'
import { DailyWorklogQuickModal } from '@/components/worklogs/DailyWorklogQuickModal'

interface ToolingExcelGridViewProps {
    jobs: JobForGantt[]
    workOrders?: any[]
    machines: any[]
    employees: any[]
    startDateStr: string
    daysCount?: number
    perspective?: 'machine' | 'job'
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
    perspective = 'machine',
    trackFilter = 'ALL',
    searchQuery = ''
}: ToolingExcelGridViewProps) {
    const t = useTranslations('Equipment.Schedule')
    const tDays = useTranslations('Equipment.Schedule.days')

    // Modal / Drawer states
    const [selectedJobForDrawer, setSelectedJobForDrawer] = useState<JobForGantt | null>(null)
    const [selectedStepForEdit, setSelectedStepForEdit] = useState<{ step: JobStepRow, job: JobForGantt } | null>(null)
    const [selectedJobForWorklog, setSelectedJobForWorklog] = useState<{ job: JobForGantt, step?: JobStepRow } | null>(null)

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

    // Generate date rows
    const start = parseISO(startDateStr)
    const dateList: string[] = useMemo(() => {
        const list: string[] = []
        for (let i = 0; i < daysCount; i++) {
            list.push(format(addDays(start, i), 'yyyy-MM-dd'))
        }
        return list
    }, [start, daysCount])

    // Defined Machine Columns
    const machineColumns = useMemo(() => {
        const mainMachines = machines.filter(m => {
            const name = (m.machine_code || m.machine_name || '').toUpperCase()
            return name.includes('CMX') || name.includes('MILLTAP') || name.includes('MILLAC') || name.includes('DURA') || name.includes('CNC')
        })

        // Standard groups
        return [
            ...mainMachines.map(m => ({ id: m.machine_id, code: m.machine_code || m.machine_name, name: m.machine_name, type: 'CNC' })),
            { id: '__MANUAL__', code: t('manualWork'), name: '手仕上・ミガキ・組立', type: 'MANUAL' },
            { id: '__OUTSOURCE__', code: t('outsourceWork'), name: '外注・特殊', type: 'OUTSOURCE' }
        ]
    }, [machines, t])

    // Check if step falls on date
    const isStepOnDate = (step: JobStepRow, dateStr: string, job: JobForGantt) => {
        // 1. Check work_logs
        if (step.work_logs && step.work_logs.some(w => w.work_date === dateStr)) return true

        // 2. Check planned dates
        if (step.planned_start && step.planned_end) {
            const pStart = step.planned_start.split('T')[0]
            const pEnd = step.planned_end.split('T')[0]
            if (dateStr >= pStart && dateStr <= pEnd) return true
        }

        // 3. Fallback to deadline or single date
        if (step.deadline && step.deadline.split('T')[0] === dateStr) return true

        // 4. If step has no dates, fallback to job dates
        if (!step.planned_start && !step.deadline && job.start_date && job.mold_deadline) {
            const jStart = job.start_date.split('T')[0]
            const jEnd = job.mold_deadline.split('T')[0]
            if (dateStr >= jStart && dateStr <= jEnd) return true
        }

        return false
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden bg-[var(--bg-surface-2)]">
            {/* Perspective: Machine Centric */}
            {perspective === 'machine' ? (
                <div className="w-full h-full overflow-auto">
                    <div className="inline-block min-w-max bg-[var(--bg-surface)] border-b border-r border-[var(--border-default)]">
                        {/* Header Row (Machines) - STICKY TOP */}
                        <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-surface)] sticky top-0 z-20 shadow-xs">
                            <div className="w-24 shrink-0 border-r border-[var(--border-default)] p-2.5 sticky left-0 bg-[var(--bg-surface)] z-30 font-bold text-[12px] text-[var(--text-muted)] flex items-center justify-center">
                                {t('table.machine')} / {t('today')}
                            </div>
                            {machineColumns.map(col => (
                                <div key={col.id} className="w-[300px] shrink-0 border-r border-[var(--border-default)] p-2 flex flex-col items-center justify-center bg-[var(--bg-surface-hover)]">
                                    <div className="font-bold text-[13px] text-[var(--text-primary)] font-mono flex items-center gap-1.5">
                                        <span>{col.code}</span>
                                    </div>
                                    <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[280px]">
                                        {col.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Date Rows */}
                        {dateList.map((dateStr, rIdx) => {
                            const parsedDate = parseISO(dateStr)
                            const isToday = isSameDay(parsedDate, new Date())
                            const dayIndex = parsedDate.getDay().toString() as '0'|'1'|'2'|'3'|'4'|'5'|'6'
                            const dayLabel = tDays(dayIndex)
                            const isWeekend = dayIndex === '0' || dayIndex === '6'

                            return (
                                <div 
                                    key={dateStr} 
                                    className={`flex border-b border-[var(--border-default)] min-h-[90px] ${
                                        isToday 
                                            ? 'bg-[var(--tint-teal-bg)]/30' 
                                            : isWeekend 
                                                ? 'bg-[var(--bg-surface-2)]/60' 
                                                : 'bg-[var(--bg-surface)]'
                                    }`}
                                >
                                    {/* Date Row Header - STICKY LEFT */}
                                    <div className="w-24 shrink-0 border-r border-[var(--border-default)] py-2 px-1 flex flex-col justify-center items-center sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)]">
                                        <div className={`font-bold text-[15px] tabular-nums font-mono leading-none ${isToday ? 'text-[var(--accent)] font-extrabold' : 'text-[var(--text-primary)]'}`}>
                                            {format(parsedDate, 'MM/dd')}
                                        </div>
                                        <div className={`text-[11px] font-bold mt-1 ${isWeekend ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                                            ({dayLabel})
                                        </div>
                                        {isToday && (
                                            <span className="mt-1 px-1.5 py-0.2 rounded bg-[var(--accent)] text-white text-[9px] font-bold uppercase">
                                                {t('today')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Cells for each machine */}
                                    {machineColumns.map(col => {
                                        // Collect matching steps
                                        const matchingItems: { job: JobForGantt, step: JobStepRow }[] = []
                                        
                                        filteredJobs.forEach(job => {
                                            (job.job_steps || []).forEach(step => {
                                                const matchMachine = col.type === 'CNC' 
                                                    ? step.machine_id === col.id 
                                                    : col.type === 'MANUAL'
                                                        ? (!step.machine_id || step.machining_location?.includes('社内') || step.step_name?.includes('ミガキ') || step.step_name?.includes('仕上') || step.step_name?.includes('ネル'))
                                                        : (step.machining_location?.includes('外注') || step.machining_location?.includes('協力'))

                                                if (matchMachine && isStepOnDate(step, dateStr, job)) {
                                                    matchingItems.push({ job, step })
                                                }
                                            })
                                        })

                                        const totalHours = matchingItems.reduce((sum, item) => sum + (Number(item.step.planned_hours) || Number(item.step.estimated_hours) || 0), 0)
                                        const isOverloaded = totalHours > 8.5

                                        return (
                                            <div 
                                                key={`${dateStr}-${col.id}`}
                                                className="w-[300px] shrink-0 border-r border-[var(--border-default)] p-1.5 flex flex-col gap-1.5 relative group hover:bg-[var(--bg-surface-hover)]/70 transition-colors"
                                            >
                                                {/* Header in cell: Total load indicator */}
                                                {matchingItems.length > 0 && (
                                                    <div className="flex justify-between items-center px-1 pb-1 border-b border-[var(--border-default)] text-[10px] text-[var(--text-muted)]">
                                                        <span className="font-semibold">{matchingItems.length} 件</span>
                                                        <span className={`font-mono font-bold px-1 rounded ${isOverloaded ? 'bg-red-100 text-red-700 font-extrabold border border-red-200' : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)]'}`}>
                                                            Σ {totalHours.toFixed(1)}h {isOverloaded ? '⚠️' : ''}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Job Task Cards */}
                                                <div className="flex flex-col gap-1.5 flex-1">
                                                    {matchingItems.map(({ job, step }) => (
                                                        <ToolingJobCard 
                                                            key={`${job.job_id}-${step.step_id}`}
                                                            job={job}
                                                            step={step}
                                                            empName={empMap.get(step.assigned_to || '') || empMap.get((job as any).responsible_id || '')}
                                                            machName={machMap.get(step.machine_id || '')}
                                                            onOpenJob={setSelectedJobForDrawer}
                                                            onEditStep={(st, j) => setSelectedStepForEdit({ step: st, job: j })}
                                                            onQuickLog={(j, st) => setSelectedJobForWorklog({ job: j, step: st })}
                                                        />
                                                    ))}
                                                </div>

                                                {matchingItems.length === 0 && (
                                                    <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-40 text-[10px] text-[var(--text-muted)] italic">
                                                        {t('noTasks')}
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
            ) : (
                /* Perspective: Job & Work Object Centric */
                <div className="w-full h-full overflow-auto">
                    <div className="inline-block min-w-max bg-[var(--bg-surface)] border-b border-r border-[var(--border-default)]">
                        {/* Header Row */}
                        <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-surface)] sticky top-0 z-20 shadow-xs">
                            <div className="w-56 shrink-0 border-r border-[var(--border-default)] p-2 sticky left-0 bg-[var(--bg-surface)] z-30 font-bold text-[12px] text-[var(--text-muted)]">
                                {t('table.job')} / {t('table.track')}
                            </div>
                            <div className="w-24 shrink-0 border-r border-[var(--border-default)] p-2 sticky left-56 bg-[var(--bg-surface)] z-30 font-bold text-[12px] text-[var(--text-muted)] text-center">
                                {t('table.moldDeadline')}
                            </div>
                            <div className="w-20 shrink-0 border-r border-[var(--border-default)] p-2 sticky left-80 bg-[var(--bg-surface)] z-30 font-bold text-[12px] text-[var(--text-muted)] text-center">
                                {t('table.progress')}
                            </div>

                            {dateList.map((dateStr) => {
                                const parsedDate = parseISO(dateStr)
                                const isToday = isSameDay(parsedDate, new Date())
                                const dayIndex = parsedDate.getDay().toString() as '0'|'1'|'2'|'3'|'4'|'5'|'6'
                                const isWeekend = dayIndex === '0' || dayIndex === '6'

                                return (
                                    <div 
                                        key={dateStr} 
                                        className={`w-28 shrink-0 border-r border-[var(--border-default)] p-1.5 flex flex-col items-center justify-center ${
                                            isToday ? 'bg-[var(--tint-teal-bg)]' : isWeekend ? 'bg-[var(--bg-surface-2)]' : 'bg-[var(--bg-surface-hover)]'
                                        }`}
                                    >
                                        <div className={`font-mono font-bold text-[13px] ${isToday ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                                            {format(parsedDate, 'MM/dd')}
                                        </div>
                                        <div className={`text-[10px] font-semibold ${isWeekend ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                                            ({tDays(dayIndex)})
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Job Rows */}
                        {filteredJobs.map((job) => {
                            const steps = job.job_steps || []
                            const moldSteps = steps.filter(s => s.track === 'MOLD' || !s.track)
                            const plugSteps = steps.filter(s => s.track === 'PLUG')
                            const cutterSteps = steps.filter(s => s.track === 'CUTTER')

                            const tracks = [
                                { key: 'MOLD', label: '本型', color: 'var(--accent)', steps: moldSteps },
                                ...(job.has_plug || plugSteps.length > 0 ? [{ key: 'PLUG', label: 'プラグ', color: 'var(--status-warning)', steps: plugSteps }] : []),
                                ...(cutterSteps.length > 0 ? [{ key: 'CUTTER', label: '抜型', color: 'var(--brand-purple, #9333ea)', steps: cutterSteps }] : [])
                            ]

                            return (
                                <React.Fragment key={job.job_id}>
                                    {tracks.map((tr, tIdx) => (
                                        <div key={`${job.job_id}-${tr.key}`} className="flex border-b border-[var(--border-default)] hover:bg-[var(--bg-surface-hover)] transition-colors min-h-[44px]">
                                            {/* Fixed Left Job & Track Info */}
                                            <div 
                                                onClick={() => setSelectedJobForDrawer(job)}
                                                className="w-56 shrink-0 border-r border-[var(--border-default)] p-2 sticky left-0 z-10 bg-[var(--bg-surface)] flex items-center justify-between gap-1.5 cursor-pointer shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)]"
                                            >
                                                <div className="flex flex-col min-w-0">
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-mono font-bold text-[12px] text-[var(--accent)] truncate">
                                                            {job.products?.product_code || job.job_code}
                                                        </span>
                                                        <span className="text-[9px] font-bold px-1 rounded" style={{ backgroundColor: 'var(--bg-surface-2)', color: tr.color }}>
                                                            {tr.label}
                                                        </span>
                                                    </div>
                                                    <span className="text-[10px] text-[var(--text-muted)] truncate" title={job.job_name}>
                                                        {job.job_name}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Fixed Deadline */}
                                            <div className="w-24 shrink-0 border-r border-[var(--border-default)] p-2 sticky left-56 z-10 bg-[var(--bg-surface)] flex items-center justify-center font-mono text-[11px] font-bold text-[var(--text-primary)]">
                                                {job.mold_deadline ? format(parseISO(job.mold_deadline), 'MM/dd') : '—'}
                                            </div>

                                            {/* Fixed Progress */}
                                            <div className="w-20 shrink-0 border-r border-[var(--border-default)] p-2 sticky left-80 z-10 bg-[var(--bg-surface)] flex items-center justify-center">
                                                <div className="w-full bg-[var(--bg-surface-2)] rounded-full h-2 overflow-hidden border border-[var(--border-default)]">
                                                    <div 
                                                        className="bg-[var(--accent)] h-full transition-all"
                                                        style={{ width: `${job.overall_progress || 0}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Calendar Date Columns */}
                                            {dateList.map((dateStr) => {
                                                const activeSteps = tr.steps.filter(s => isStepOnDate(s, dateStr, job))

                                                return (
                                                    <div key={dateStr} className="w-28 shrink-0 border-r border-[var(--border-default)] p-1 flex flex-col gap-1 items-center justify-center">
                                                        {activeSteps.map(st => (
                                                            <div 
                                                                key={st.step_id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setSelectedStepForEdit({ step: st, job })
                                                                }}
                                                                className="w-full text-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-[var(--tint-teal-bg)] text-[var(--accent)] border border-[var(--accent)]/30 hover:shadow-xs cursor-pointer truncate"
                                                                title={`[${st.step_name}] ${st.planned_hours || st.estimated_hours || 0}h`}
                                                            >
                                                                {st.step_name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ))}
                                </React.Fragment>
                            )
                        })}
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
                    initialDate={format(new Date(), 'yyyy-MM-dd')}
                />
            )}
        </div>
    )
}
