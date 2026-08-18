'use client'

import React, { useState } from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { format } from 'date-fns'
import { ChevronDown, ChevronRight, Layers, Clock, User, AlertCircle } from 'lucide-react'

interface ToolingGroupedJobCardProps {
    job: JobForGantt
    steps: JobStepRow[]
    empMap: Map<string, string>
    machMap: Map<string, string>
    onOpenJob?: (job: JobForGantt) => void
    onEditStep?: (step: JobStepRow, job: JobForGantt) => void
    onQuickLog?: (job: JobForGantt, step?: JobStepRow) => void
}

const TRACK_CONFIG: Record<string, { bg: string, text: string, label: string, border: string }> = {
    MOLD: { bg: 'var(--tint-teal-bg)', text: 'var(--accent)', label: '金型', border: 'var(--accent)' },
    PLUG: { bg: 'var(--tint-amber-bg)', text: 'var(--status-warning)', label: 'プラグ', border: 'var(--status-warning)' },
    CUTTER: { bg: 'var(--tint-purple-bg, #f3e8ff)', text: 'var(--brand-purple, #9333ea)', label: '抜型', border: 'var(--brand-purple, #9333ea)' },
    FINISH: { bg: 'var(--tint-blue-bg)', text: 'var(--status-info)', label: '仕上', border: 'var(--status-info)' }
}

function resolveTrack(step: JobStepRow): string {
    if (step.track) return step.track
    const name = step.step_name || ''
    if (name.includes('プラグ')) return 'PLUG'
    if (name.includes('抜型') || name.includes('刃')) return 'CUTTER'
    if (name.includes('仕上') || name.includes('ミガキ')) return 'FINISH'
    return 'MOLD'
}

function getDelayBadge(deadlineStr: string | null | undefined, isCompleted: boolean) {
    if (!deadlineStr) return null
    const deadline = new Date(deadlineStr)
    deadline.setHours(0, 0, 0, 0)
    if (isNaN(deadline.getTime())) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (isCompleted) {
        return { label: format(deadline, 'MM/dd'), badgeClass: 'badge badge--success text-[10px]' }
    }

    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24))
    if (diffDays < 0) {
        return { label: `! ${format(deadline, 'MM/dd')}`, badgeClass: 'badge badge--error font-bold text-[10px] animate-pulse' }
    } else if (diffDays <= 2) {
        return { label: format(deadline, 'MM/dd'), badgeClass: 'badge badge--warning font-bold text-[10px]' }
    }
    return { label: format(deadline, 'MM/dd'), badgeClass: 'badge badge--neutral text-[10px]' }
}

export default function ToolingGroupedJobCard({
    job,
    steps,
    empMap,
    machMap,
    onOpenJob,
    onEditStep,
    onQuickLog
}: ToolingGroupedJobCardProps) {
    const [isExpanded, setIsExpanded] = useState(true)

    const isJobCompleted = job.job_status === 'COMPLETED'
    const isJobInProgress = job.job_status === 'IN_PROGRESS'

    const deadline = job.mold_deadline || job.deadline
    const delayBadge = getDelayBadge(deadline, isJobCompleted)

    const productCode = job.products?.product_code || job.job_code || 'JOB'
    const totalHours = steps.reduce((sum, s) => sum + (Number(s.planned_hours) || Number(s.estimated_hours) || 0), 0)
    const totalActualHours = steps.reduce((sum, s) => {
        const logSum = (s.work_logs || []).reduce((wSum, w) => wSum + (Number(w.hours_spent) || 0), 0)
        return sum + (s.actual_hours || logSum || 0)
    }, 0)

    return (
        <div 
            className={`rounded-[5px] border transition-all shadow-xs hover:shadow-md bg-[var(--bg-surface)] ${
                isJobCompleted 
                    ? 'border-[var(--border-default)] opacity-85' 
                    : isJobInProgress 
                        ? 'border-l-3 border-l-[var(--accent)] border-[var(--border-default)]' 
                        : 'border-[var(--border-default)]'
            }`}
        >
            {/* ─── PARENT JOB HEADER ─── */}
            <div 
                onClick={() => onOpenJob && onOpenJob(job)}
                className="p-1.5 cursor-pointer hover:bg-[var(--bg-surface-hover)] transition-colors rounded-t-[4px] flex flex-col gap-1 border-b border-[var(--border-default)]/60 bg-[var(--bg-surface-2)]/40"
            >
                {/* Row 1: Code + Badge + Expand toggle */}
                <div className="flex justify-between items-center gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsExpanded(!isExpanded)
                            }}
                            className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded hover:bg-[var(--bg-surface-2)] shrink-0"
                            title={isExpanded ? 'Thu gọn' : 'Mở rộng cây'}
                        >
                            {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        </button>
                        <span className="font-bold text-[12px] font-mono text-[var(--accent)] truncate">
                            {productCode}
                        </span>
                        {steps.length > 1 && (
                            <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-[var(--bg-surface-2)] text-[var(--text-muted)] border border-[var(--border-default)] shrink-0">
                                {steps.length} 項目
                            </span>
                        )}
                    </div>

                    {delayBadge && (
                        <span className={`shrink-0 ${delayBadge.badgeClass}`} title="期日">
                            {delayBadge.label}
                        </span>
                    )}
                </div>

                {/* Row 2: Job Name / Customer */}
                <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] pl-4">
                    <span className="truncate font-medium text-[var(--text-primary)]" title={job.job_name}>
                        {job.job_name}
                    </span>
                    {job.companies?.company_name && (
                        <span className="truncate max-w-[65px] font-jp opacity-80 shrink-0 ml-1 text-right" title={job.companies.company_name}>
                            {job.companies.company_code || job.companies.company_name}
                        </span>
                    )}
                </div>

                {/* Total Hours summary if > 0 */}
                {totalHours > 0 && (
                    <div className="flex justify-end items-center text-[9px] font-mono text-[var(--text-secondary)] pl-4">
                        <span>計: {totalActualHours > 0 ? `${totalActualHours.toFixed(1)}/` : ''}{totalHours.toFixed(1)}h</span>
                    </div>
                )}
            </div>

            {/* ─── TREE / SUB-ITEMS UNDERNEATH ─── */}
            {isExpanded && (
                <div className="p-1 flex flex-col gap-1 bg-[var(--bg-surface)] rounded-b-[4px]">
                    {steps.map((step, idx) => {
                        const track = resolveTrack(step)
                        const trackMeta = TRACK_CONFIG[track] || TRACK_CONFIG.MOLD
                        const empName = empMap.get(step.assigned_to || '') || empMap.get((job as any).responsible_id || '')
                        const machName = machMap.get(step.machine_id || '')
                        const stepHours = step.planned_hours || step.estimated_hours || 0
                        const isStepDone = step.step_status === 'COMPLETED' || step.processing_statuses?.status_code?.includes('完了')
                        const isStepActive = step.step_status === 'IN_PROGRESS' || step.processing_statuses?.status_code?.includes('進行中')

                        return (
                            <div
                                key={step.step_id}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (onEditStep) onEditStep(step, job)
                                }}
                                onDoubleClick={(e) => {
                                    e.stopPropagation()
                                    if (onQuickLog) onQuickLog(job, step)
                                }}
                                className={`group/step relative rounded-[3px] p-1 border transition-all cursor-pointer flex flex-col gap-0.5 text-[10px] ${
                                    isStepDone 
                                        ? 'bg-[var(--bg-surface-2)]/60 border-[var(--border-default)] opacity-75' 
                                        : isStepActive 
                                            ? 'bg-[var(--tint-teal-bg)]/30 border border-[var(--accent)]/40' 
                                            : 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--accent)] hover:bg-[var(--bg-surface-hover)]'
                                }`}
                                title={`[${step.step_name}] ${stepHours > 0 ? `${stepHours}h` : ''}\nダブルクリックで日報入力`}
                            >
                                {/* Step Branch Row: Track Badge + Step Name */}
                                <div className="flex items-center justify-between gap-1 min-w-0">
                                    <div className="flex items-center gap-1 min-w-0">
                                        <span 
                                            className="px-1 py-0.2 rounded font-bold text-[8px] uppercase shrink-0"
                                            style={{ backgroundColor: trackMeta.bg, color: trackMeta.text }}
                                        >
                                            {trackMeta.label}
                                        </span>
                                        <span className="font-medium text-[var(--text-primary)] truncate group-hover/step:text-[var(--accent)]">
                                            {step.step_name}
                                        </span>
                                    </div>
                                    {stepHours > 0 && (
                                        <span className="font-mono text-[9px] text-[var(--text-muted)] shrink-0 ml-1">
                                            {stepHours}h
                                        </span>
                                    )}
                                </div>

                                {/* Step Sub-row: Assignee / Machine if available */}
                                {(empName || machName) && (
                                    <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] pt-0.5 border-t border-[var(--border-default)]/40 mt-0.5">
                                        {empName ? (
                                            <span className="truncate flex items-center gap-0.5">
                                                👤 {empName}
                                            </span>
                                        ) : <span />}
                                        {machName && (
                                            <span className="truncate font-mono opacity-80 text-right">
                                                ⚙️ {machName}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
