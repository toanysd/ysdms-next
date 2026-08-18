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

    return (
        <div className="w-full h-full flex flex-col overflow-hidden bg-[var(--bg-surface-2)]">
            <div className="w-full h-full overflow-x-auto overflow-y-auto">
                <div className="flex min-w-max h-full min-h-[500px] bg-[var(--bg-surface)] p-2 gap-2">
                    {dateList.map((dateStr) => {
                        const parsedDate = parseISO(dateStr)
                        const isToday = isSameDay(parsedDate, new Date())
                        const dayIndex = parsedDate.getDay().toString() as '0'|'1'|'2'|'3'|'4'|'5'|'6'
                        const isWeekend = dayIndex === '0' || dayIndex === '6'

                        // Group all jobs that have deadlines matching this dateStr
                        const jobsOnDateMap = new Map<string, { job: JobForGantt, steps: JobStepRow[] }>()

                        filteredJobs.forEach(job => {
                            const matchingSteps = (job.job_steps || []).filter(step => isStepOnDate(step, dateStr, job))

                            if (matchingSteps.length > 0) {
                                jobsOnDateMap.set(job.job_id, { job, steps: matchingSteps })
                            }
                        })

                        const groupedJobs = Array.from(jobsOnDateMap.values())
                        const totalJobsCount = groupedJobs.length
                        const totalStepsCount = groupedJobs.reduce((sum, g) => sum + g.steps.length, 0)

                        return (
                            <div 
                                key={dateStr}
                                className={`w-[270px] shrink-0 flex flex-col rounded-lg border transition-all overflow-hidden bg-[var(--bg-surface)] ${
                                    isToday 
                                        ? 'border-[var(--accent)] shadow-sm' 
                                        : isWeekend 
                                            ? 'border-[var(--border-default)] bg-[var(--bg-surface-2)]/30' 
                                            : 'border-[var(--border-default)]'
                                }`}
                            >
                                {/* Column Header: Date + Count */}
                                <div className={`p-2.5 flex items-center justify-between border-b ${
                                    isToday ? 'bg-[var(--tint-teal-bg)] border-[var(--accent)]/30' : 'bg-[var(--bg-surface-2)]/70 border-[var(--border-default)]'
                                }`}>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`font-mono font-bold text-[15px] ${isToday ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                                            {format(parsedDate, 'MM/dd')}
                                        </span>
                                        <span className={`text-[11px] font-bold ${isWeekend ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                                            ({tDays(dayIndex)})
                                        </span>
                                        {isToday && (
                                            <span className="px-1.5 py-0.2 rounded bg-[var(--accent)] text-white text-[9px] font-bold uppercase shadow-xs">
                                                {t('today')}
                                            </span>
                                        )}
                                    </div>

                                    {totalJobsCount > 0 && (
                                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)]">
                                            {totalJobsCount} 案件 ({totalStepsCount} 項目)
                                        </span>
                                    )}
                                </div>

                                {/* Column Content: Stack of Grouped Job Cards */}
                                <div className="p-2 flex flex-col gap-2 overflow-y-auto flex-1 max-h-[calc(100vh-230px)]">
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

                                    {groupedJobs.length === 0 && (
                                        <div className="h-36 flex flex-col items-center justify-center text-[var(--text-muted)] text-[11px] italic opacity-40">
                                            <span>— {t('noTasks')} —</span>
                                        </div>
                                    )}
                                </div>
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
                    initialDate={format(new Date(), 'yyyy-MM-dd')}
                />
            )}
        </div>
    )
}
