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
        return { label: format(deadline, 'MM/dd'), badgeClass: 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] font-mono text-[9px]' }
    }

    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24))
    const formattedDate = format(deadline, 'MM/dd')

    if (diffDays < 0) {
        return { label: `! ${formattedDate}`, badgeClass: 'bg-[#FEE2E2] text-[#B91C1C] border border-[#F87171] font-bold font-mono text-[9px] animate-pulse' }
    } else if (diffDays === 0) {
        return { label: `本日 ${formattedDate}`, badgeClass: 'bg-[#FEE2E2] text-[#DC2626] border border-[#EF4444] font-bold font-mono text-[9px] animate-pulse' }
    } else if (diffDays === 1) {
        return { label: `明日 ${formattedDate}`, badgeClass: 'bg-[#FFEDD5] text-[#C2410C] border border-[#FB923C] font-bold font-mono text-[9px]' }
    } else if (diffDays === 2) {
        return { label: formattedDate, badgeClass: 'bg-[#FEF9C3] text-[#A16207] border border-[#FDE047] font-bold font-mono text-[9px]' }
    }
    return { label: formattedDate, badgeClass: 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] font-mono text-[9px]' }
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

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dlDate = deadline ? new Date(deadline) : null
    if (dlDate) dlDate.setHours(0, 0, 0, 0)
    const diffDays = dlDate && !isNaN(dlDate.getTime()) ? Math.ceil((dlDate.getTime() - today.getTime()) / (1000 * 3600 * 24)) : 999

    let borderLeftClass = 'border-l-3 border-l-slate-400'
    if (isCompleted) {
        borderLeftClass = 'border-l-3 border-l-[#16A34A]'
    } else if (diffDays < 0) {
        borderLeftClass = 'border-l-3 border-l-[#DC2626]'
    } else if (diffDays === 0) {
        borderLeftClass = 'border-l-3 border-l-[#DC2626]'
    } else if (diffDays === 1) {
        borderLeftClass = 'border-l-3 border-l-[#EA580C]'
    } else if (diffDays === 2) {
        borderLeftClass = 'border-l-3 border-l-[#CA8A04]'
    } else {
        borderLeftClass = 'border-l-3 border-l-slate-400'
    }
    
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
            className={`group relative rounded-[4px] p-1.5 border transition-all cursor-pointer shadow-xs hover:shadow-md hover:border-[var(--accent)] flex flex-col gap-1 text-[11px] ${borderLeftClass} ${
                isCompleted 
                    ? 'bg-[#F0FDF4] border-[var(--border-default)] opacity-80' 
                    : isInProgress 
                        ? 'bg-white border-[var(--border-default)]' 
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
