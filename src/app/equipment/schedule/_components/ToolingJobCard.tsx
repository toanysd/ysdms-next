'use client'

import React from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { format } from 'date-fns'

interface ToolingJobCardProps {
    job: JobForGantt
    step?: JobStepRow
    empName?: string
    machName?: string
    onOpenJob?: (job: JobForGantt) => void
    onEditStep?: (step: JobStepRow, job: JobForGantt) => void
    onQuickLog?: (job: JobForGantt, step?: JobStepRow) => void
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

const TRACK_COLORS: Record<string, { bg: string, text: string, label: string }> = {
    MOLD: { bg: 'var(--tint-teal-bg)', text: 'var(--accent)', label: '金型' },
    PLUG: { bg: 'var(--tint-amber-bg)', text: 'var(--status-warning)', label: 'プラグ' },
    CUTTER: { bg: 'var(--tint-purple-bg, #f3e8ff)', text: 'var(--brand-purple, #9333ea)', label: '抜型' },
    FINISH: { bg: 'var(--tint-blue-bg)', text: 'var(--status-info)', label: '仕上' }
}

export default function ToolingJobCard({
    job,
    step,
    empName,
    machName,
    onOpenJob,
    onEditStep,
    onQuickLog
}: ToolingJobCardProps) {
    const isCompleted = step ? (step.step_status === 'COMPLETED' || step.processing_statuses?.status_code?.includes('完了')) : (job.job_status === 'COMPLETED')
    const isInProgress = step ? (step.step_status === 'IN_PROGRESS' || step.processing_statuses?.status_code?.includes('進行中')) : (job.job_status === 'IN_PROGRESS')
    
    const deadline = step?.deadline || job.mold_deadline || job.deadline
    const delayBadge = getDelayBadge(deadline, !!isCompleted)
    
    const track = step?.track || (job.has_plug ? 'MOLD' : 'MOLD')
    const trackStyle = TRACK_COLORS[track] || TRACK_COLORS.MOLD

    const hours = step?.planned_hours || step?.estimated_hours || (job as any).estimated_hours || 0
    const actualHours = step?.actual_hours || (step?.work_logs || []).reduce((sum, w) => sum + (Number(w.hours_spent) || 0), 0)

    const productCode = job.products?.product_code || job.job_code || 'JOB'

    return (
        <div
            onClick={(e) => {
                e.stopPropagation()
                if (step && onEditStep) onEditStep(step, job)
                else if (onOpenJob) onOpenJob(job)
            }}
            onDoubleClick={(e) => {
                e.stopPropagation()
                if (onQuickLog) onQuickLog(job, step)
            }}
            className={`group relative rounded-[4px] p-1.5 border transition-all cursor-pointer shadow-xs hover:shadow-md hover:border-[var(--accent)] flex flex-col gap-1 text-[11px] ${
                isCompleted 
                    ? 'bg-[var(--bg-surface-2)] border-[var(--border-default)] opacity-80' 
                    : isInProgress 
                        ? 'bg-[var(--bg-surface)] border-l-3 border-l-[var(--accent)] border-t-[var(--border-default)] border-r-[var(--border-default)] border-b-[var(--border-default)]' 
                        : 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:bg-[var(--bg-surface-hover)]'
            }`}
            title={`[${job.job_code}] ${job.job_name} - ${step?.step_name || ''}\nダブルクリックで日報入力`}
        >
            {/* Row 1: Track & Job Code + Deadline */}
            <div className="flex justify-between items-center gap-1">
                <div className="flex items-center gap-1 min-w-0">
                    <span 
                        className="px-1 py-0.2 rounded font-bold text-[9px] uppercase shrink-0"
                        style={{ backgroundColor: trackStyle.bg, color: trackStyle.text }}
                    >
                        {trackStyle.label}
                    </span>
                    <span className="font-bold text-[var(--accent)] font-mono truncate text-[12px]">
                        {productCode}
                    </span>
                </div>
                {delayBadge && (
                    <span className={`shrink-0 ${delayBadge.badgeClass}`} title="完成期日">
                        {delayBadge.label}
                    </span>
                )}
            </div>

            {/* Row 2: Step Name or Job Name */}
            <div className="flex justify-between items-center text-[var(--text-primary)] font-medium">
                <span className="truncate" title={step?.step_name || job.job_name}>
                    {step?.step_name || job.job_name}
                </span>
                {hours > 0 && (
                    <span className="font-mono text-[11px] font-bold shrink-0 ml-1 text-[var(--text-secondary)]">
                        {actualHours > 0 ? `${actualHours.toFixed(1)}/` : ''}{hours.toFixed(1)}h
                    </span>
                )}
            </div>

            {/* Row 3: Operator & Company / Progress */}
            <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] border-t border-[var(--border-default)] pt-0.5 mt-0.5">
                <span className="truncate flex items-center gap-0.5">
                    👤 {empName || <span className="italic opacity-60">未割当</span>}
                </span>
                {job.companies?.company_name && (
                    <span className="truncate max-w-[70px] opacity-75 text-right font-jp" title={job.companies.company_name}>
                        {job.companies.company_code || job.companies.company_name}
                    </span>
                )}
            </div>
        </div>
    )
}
