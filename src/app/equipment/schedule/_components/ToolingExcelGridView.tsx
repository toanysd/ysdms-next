'use client'

import React, { useState, useMemo } from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { format, parseISO, addDays, isSameDay } from 'date-fns'
import { useTranslations } from 'next-intl'
import ToolingGroupedJobCard from './ToolingGroupedJobCard'
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

    // Generate date columns
    const start = parseISO(startDateStr)
    const dateList: string[] = useMemo(() => {
        const list: string[] = []
        for (let i = 0; i < daysCount; i++) {
            list.push(format(addDays(start, i), 'yyyy-MM-dd'))
        }
        return list
    }, [start, daysCount])

    // Generate Machine Rows
    const machineRows = useMemo(() => {
        return [
            ...machines.map(m => ({ id: m.machine_id, code: m.machine_code || m.machine_name, name: m.machine_name, type: 'CNC' })),
            { id: '__MANUAL__', code: t('manualWork'), name: '手仕上・ミガキ・組立', type: 'MANUAL' },
            { id: '__OUTSOURCE__', code: t('outsourceWork'), name: '外注・特殊', type: 'OUTSOURCE' }
        ]
    }, [machines, t])

    // Check if step falls on date: STRICT DEADLINE MATCH
    const isStepOnDate = (step: JobStepRow, dateStr: string, job: JobForGantt) => {
        // 1. Step deadline matches this date
        if (step.deadline) {
            const stepDl = step.deadline.split('T')[0]
            if (stepDl === dateStr) return true
        }

        // 2. If step has no deadline of its own, check if job's mold_deadline matches this date
        if (!step.deadline) {
            const moldDl = job.mold_deadline ? job.mold_deadline.split('T')[0] : null
            if (moldDl === dateStr) return true
        }

        return false
    }

    return (
        <div className="w-full h-full flex flex-col overflow-hidden bg-[var(--bg-surface-2)]">
            <div className="w-full h-full overflow-auto">
                <div className="inline-block min-w-max bg-[var(--bg-surface)] border-b border-r border-[var(--border-default)]">
                    
                    {/* TOP HEADER ROW: Dates */}
                    <div className="flex border-b border-[var(--border-default)] bg-[var(--bg-surface)] sticky top-0 z-20 shadow-xs">
                        {/* Top-Left Corner: Machine / Trạm label */}
                        <div className="w-48 shrink-0 border-r border-[var(--border-default)] p-2 sticky left-0 bg-[var(--bg-surface)] z-30 font-bold text-[12px] text-[var(--text-muted)] flex flex-col justify-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)]">
                            <div className="text-center">{t('table.machine')}</div>
                            <div className="text-[10px] font-normal opacity-70 text-center">Máy & Trạm gia công</div>
                        </div>
                        
                        {/* Dates */}
                        {dateList.map((dateStr) => {
                            const parsedDate = parseISO(dateStr)
                            const isToday = isSameDay(parsedDate, new Date())
                            const dayIndex = parsedDate.getDay().toString() as '0'|'1'|'2'|'3'|'4'|'5'|'6'
                            const isWeekend = dayIndex === '0' || dayIndex === '6'
                            
                            return (
                                <div 
                                    key={dateStr}
                                    className={`w-[180px] shrink-0 border-r border-[var(--border-default)] p-1.5 flex flex-col items-center justify-center ${
                                        isToday ? 'bg-[var(--tint-teal-bg)]' : isWeekend ? 'bg-[var(--bg-surface-2)]' : 'bg-[var(--bg-surface-hover)]'
                                    }`}
                                >
                                    <div className={`font-mono font-bold text-[14px] ${isToday ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                                        {format(parsedDate, 'MM/dd')}
                                    </div>
                                    <div className={`text-[10px] font-semibold ${isWeekend ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                                        ({tDays(dayIndex)})
                                    </div>
                                    {isToday && (
                                        <span className="mt-0.5 px-1.5 py-0.5 rounded bg-[var(--accent)] text-white text-[9px] font-bold uppercase shadow-xs">
                                            {t('today')}
                                        </span>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    {/* BODY ROWS: Machines */}
                    {machineRows.map(mach => (
                        <div key={mach.id} className="flex border-b border-[var(--border-default)] min-h-[90px] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] transition-colors">
                            {/* Left Sticky Cell: Machine Name */}
                            <div className="w-48 shrink-0 border-r border-[var(--border-default)] p-3 sticky left-0 z-10 bg-[var(--bg-surface)] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-center">
                                <div className="font-bold text-[13px] text-[var(--text-primary)] font-mono">
                                    {mach.code}
                                </div>
                                <div className="text-[11px] text-[var(--text-muted)] mt-1 break-words whitespace-normal">
                                    {mach.name}
                                </div>
                            </div>

                            {/* Cells for each Date */}
                            {dateList.map((dateStr) => {
                                // Group steps by Job ID for this (machine, date)
                                const groupedMap = new Map<string, { job: JobForGantt, steps: JobStepRow[] }>()

                                filteredJobs.forEach(job => {
                                    (job.job_steps || []).forEach(step => {
                                        const matchMachine = mach.type === 'CNC' 
                                            ? step.machine_id === mach.id 
                                            : mach.type === 'MANUAL'
                                                ? (!step.machine_id || step.machining_location?.includes('社内') || step.step_name?.includes('ミガキ') || step.step_name?.includes('仕上') || step.step_name?.includes('ネル'))
                                                : (step.machining_location?.includes('外注') || step.machining_location?.includes('協力'))

                                        if (matchMachine && isStepOnDate(step, dateStr, job)) {
                                            if (!groupedMap.has(job.job_id)) {
                                                groupedMap.set(job.job_id, { job, steps: [] })
                                            }
                                            groupedMap.get(job.job_id)!.steps.push(step)
                                        }
                                    })
                                })

                                const groupedJobs = Array.from(groupedMap.values())
                                const totalStepsCount = groupedJobs.reduce((sum, g) => sum + g.steps.length, 0)
                                const totalHours = groupedJobs.reduce((sum, g) => {
                                    return sum + g.steps.reduce((sSum, st) => sSum + (Number(st.planned_hours) || Number(st.estimated_hours) || 0), 0)
                                }, 0)
                                const isOverloaded = totalHours > 8.5
                                const isToday = isSameDay(parseISO(dateStr), new Date())

                                return (
                                    <div 
                                        key={`${mach.id}-${dateStr}`}
                                        className={`w-[180px] shrink-0 border-r border-[var(--border-default)] p-1.5 flex flex-col gap-1.5 relative group hover:bg-[var(--bg-surface-hover)] transition-colors ${
                                            isToday ? 'bg-[var(--tint-teal-bg)]/20' : ''
                                        }`}
                                    >
                                        {/* Total load header */}
                                        {groupedJobs.length > 0 && (
                                            <div className="flex justify-between items-center px-1 pb-1 border-b border-[var(--border-default)] text-[10px] text-[var(--text-muted)]">
                                                <span className="font-semibold">{groupedJobs.length} 案件 ({totalStepsCount} 項目)</span>
                                                <span className={`font-mono font-bold px-1 rounded ${isOverloaded ? 'bg-red-100 text-red-700 font-extrabold border border-red-200' : 'bg-[var(--bg-surface-2)] text-[var(--text-secondary)]'}`}>
                                                    Σ {totalHours.toFixed(1)}h {isOverloaded ? '⚠️' : ''}
                                                </span>
                                            </div>
                                        )}

                                        {/* Tree / Grouped Job Cards */}
                                        <div className="flex flex-col gap-2 flex-1">
                                            {groupedJobs.map(({ job, steps }) => (
                                                <ToolingGroupedJobCard 
                                                    key={job.job_id}
                                                    job={job}
                                                    steps={steps}
                                                    empMap={empMap}
                                                    machMap={machMap}
                                                    onOpenJob={setSelectedJobForDrawer}
                                                    onEditStep={(st, j) => setSelectedStepForEdit({ step: st, job: j })}
                                                    onQuickLog={(j, st) => setSelectedJobForWorklog({ job: j, step: st })}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
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
                    initialDate={format(new Date(), 'yyyy-MM-dd')}
                />
            )}
        </div>
    )
}
