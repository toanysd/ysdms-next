'use client'

import React, { useState } from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { format } from 'date-fns'
import { ChevronDown, ChevronRight, CheckCircle2, Clock, User, AlertCircle } from 'lucide-react'

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

function resolveStepStatus(step: JobStepRow): { label: string, badgeClass: string } {
    const status = step.step_status || ''
    const code = step.processing_statuses?.status_code || ''

    if (status === 'COMPLETED' || code.includes('完了')) {
        return { label: '完了', badgeClass: 'bg-[var(--status-success-bg, #e6f4ea)] text-[var(--status-success)] border border-[var(--status-success)]/30 font-bold' }
    }
    if (status === 'ON_HOLD' || code.includes('保留')) {
        return { label: '保留', badgeClass: 'bg-[var(--tint-purple-bg, #f3e8ff)] text-[var(--brand-purple, #9333ea)] border border-[var(--brand-purple, #9333ea)]/40 font-bold' }
    }
    if (status === 'CANCELLED' || code.includes('中止')) {
        return { label: '中止', badgeClass: 'bg-red-100 text-red-700 border border-red-200' }
    }
    if (status === 'IN_PROGRESS' || code.includes('進行')) {
        return { label: '進行中', badgeClass: 'bg-[var(--tint-amber-bg)] text-[var(--status-warning)] border border-[var(--status-warning)]/40 font-bold' }
    }
    if (status === 'PENDING') {
        return { label: '未着手', badgeClass: 'bg-[var(--bg-surface-2)] text-[var(--text-muted)] border border-[var(--border-default)]' }
    }
    if (step.work_logs && step.work_logs.length > 0) {
        return { label: '進行中', badgeClass: 'bg-[var(--tint-amber-bg)] text-[var(--status-warning)] border border-[var(--status-warning)]/40 font-bold' }
    }
    return { label: '未着手', badgeClass: 'bg-[var(--bg-surface-2)] text-[var(--text-muted)] border border-[var(--border-default)]' }
}

function getDeadlineBadge(deadlineStr: string | null | undefined, isCompleted: boolean) {
    if (!deadlineStr) return null
    const deadline = new Date(deadlineStr)
    deadline.setHours(0, 0, 0, 0)
    if (isNaN(deadline.getTime())) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (isCompleted) {
        return { label: format(deadline, 'MM/dd'), badgeClass: 'badge badge--success text-[9px]' }
    }

    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24))
    if (diffDays < 0) {
        return { label: `! ${format(deadline, 'MM/dd')}`, badgeClass: 'badge badge--error font-bold text-[9px] animate-pulse' }
    } else if (diffDays <= 2) {
        return { label: format(deadline, 'MM/dd'), badgeClass: 'badge badge--warning font-bold text-[9px]' }
    }
    return { label: format(deadline, 'MM/dd'), badgeClass: 'badge badge--neutral text-[9px]' }
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

    const jobDeadline = job.mold_deadline || job.deadline
    const jobDelayBadge = getDeadlineBadge(jobDeadline, isJobCompleted)

    const productCode = job.products?.product_code || job.job_code || 'JOB'

    // Total Actual Machining Hours (from work logs) ONLY
    const totalActualHours = steps.reduce((sum, s) => {
        const logSum = (s.work_logs || []).reduce((wSum, w) => wSum + (Number(w.hours_spent) || 0), 0)
        return sum + (s.actual_hours || logSum || 0)
    }, 0)

    return (
        <div 
            className={`rounded-[6px] border transition-all shadow-xs hover:shadow-md bg-[var(--bg-surface)] ${
                isJobCompleted 
                    ? 'border-[var(--border-default)] opacity-90' 
                    : isJobInProgress 
                        ? 'border-l-3 border-l-[var(--accent)] border-[var(--border-default)]' 
                        : 'border-[var(--border-default)]'
            }`}
        >
            {/* ─── PARENT JOB HEADER ─── */}
            <div 
                onClick={() => onOpenJob && onOpenJob(job)}
                className="p-2 cursor-pointer hover:bg-[var(--bg-surface-hover)] transition-colors rounded-t-[5px] flex flex-col gap-1 border-b border-[var(--border-default)]/70 bg-[var(--bg-surface-2)]/50"
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
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <span className="font-bold text-[13px] font-mono text-[var(--accent)] truncate">
                            {productCode}
                        </span>
                        {steps.length > 1 && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[var(--bg-surface-2)] text-[var(--text-muted)] border border-[var(--border-default)] shrink-0">
                                {steps.length} 項目
                            </span>
                        )}
                    </div>

                    {jobDelayBadge && (
                        <span className={`shrink-0 ${jobDelayBadge.badgeClass}`} title="金型期日">
                            {jobDelayBadge.label}
                        </span>
                    )}
                </div>

                {/* Row 2: Job Name / Customer */}
                <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] pl-4">
                    <span className="truncate font-medium text-[var(--text-primary)]" title={job.job_name}>
                        {job.job_name}
                    </span>
                    {job.companies?.company_name && (
                        <span className="truncate max-w-[75px] font-jp opacity-85 shrink-0 ml-1 text-right text-[10px] bg-[var(--bg-surface)] px-1 rounded border border-[var(--border-default)]/60" title={job.companies.company_name}>
                            {job.companies.company_code || job.companies.company_name}
                        </span>
                    )}
                </div>

                {/* Row 3: Status + Total Actual Machining Hours ONLY */}
                <div className="flex justify-between items-center text-[10px] font-mono pl-4 pt-0.5 border-t border-[var(--border-default)]/40 mt-0.5">
                    <span className="text-[var(--text-muted)]">
                        状態: <span className="font-semibold text-[var(--text-primary)]">{isJobCompleted ? '完了' : isJobInProgress ? '進行中' : '新規'}</span>
                    </span>
                    {totalActualHours > 0 && (
                        <span className="font-bold text-[var(--status-success)]">
                            実績: {totalActualHours.toFixed(1)}h
                        </span>
                    )}
                </div>
            </div>

            {/* ─── TREE / SUB-ITEMS UNDERNEATH ─── */}
            {isExpanded && (
                <div className="p-1.5 flex flex-col gap-1.5 bg-[var(--bg-surface)] rounded-b-[5px]">
                    {steps.map((step) => {
                        const track = resolveTrack(step)
                        const trackMeta = TRACK_CONFIG[track] || TRACK_CONFIG.MOLD
                        const empName = empMap.get(step.assigned_to || '') || empMap.get((job as any).responsible_id || '')
                        const machName = machMap.get(step.machine_id || '')
                        
                        const stepLogHours = (step.work_logs || []).reduce((sum, w) => sum + (Number(w.hours_spent) || 0), 0)
                        const stepActualHours = step.actual_hours || stepLogHours || 0

                        const statusMeta = resolveStepStatus(step)
                        const isStepDone = statusMeta.label === '完了'
                        const isStepActive = statusMeta.label === '進行中'

                        const stepDeadline = step.deadline || job.mold_deadline
                        const stepDeadlineBadge = getDeadlineBadge(stepDeadline, isStepDone)

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
                                className={`group/step relative rounded-[4px] p-1.5 border transition-all cursor-pointer flex flex-col gap-1 text-[11px] ${
                                    isStepDone 
                                        ? 'bg-[var(--bg-surface-2)]/60 border-[var(--border-default)] opacity-80 hover:opacity-100' 
                                        : isStepActive 
                                            ? 'bg-[var(--tint-teal-bg)]/30 border border-[var(--accent)]/50 shadow-xs' 
                                            : 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--accent)] hover:bg-[var(--bg-surface-hover)]'
                                }`}
                                title={`[${step.step_name}]\nダブルクリックで日報入力`}
                            >
                                {/* Row 1: Track Badge + Step Name + Status + Deadline */}
                                <div className="flex items-center justify-between gap-1 min-w-0">
                                    <div className="flex items-center gap-1 min-w-0">
                                        <span 
                                            className="px-1 py-0.2 rounded font-bold text-[8px] uppercase shrink-0"
                                            style={{ backgroundColor: trackMeta.bg, color: trackMeta.text }}
                                        >
                                            {trackMeta.label}
                                        </span>
                                        <span className="font-semibold text-[var(--text-primary)] truncate group-hover/step:text-[var(--accent)]">
                                            {step.step_name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                        {/* Status Badge */}
                                        <span className={`px-1 py-0.2 rounded text-[8px] font-bold ${statusMeta.badgeClass}`}>
                                            {statusMeta.label}
                                        </span>
                                        {/* Step Deadline Badge */}
                                        {stepDeadlineBadge && (
                                            <span className={`px-1 py-0.2 rounded font-mono font-bold text-[9px] ${stepDeadlineBadge.badgeClass}`} title="期日">
                                                {stepDeadlineBadge.label}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Row 2: Actual Machining Hours (実績) + Assignee / Machine */}
                                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-default)]/40 mt-0.5 font-mono">
                                    {/* Left: Assignee & Machine */}
                                    <div className="flex items-center gap-1 truncate max-w-[130px]">
                                        {empName ? (
                                            <span className="truncate flex items-center gap-0.5 text-[var(--text-secondary)] font-sans">
                                                👤 {empName}
                                            </span>
                                        ) : (
                                            <span className="opacity-40 italic">未割当</span>
                                        )}
                                        {machName && (
                                            <span className="truncate opacity-75 font-sans">
                                                • {machName}
                                            </span>
                                        )}
                                    </div>

                                    {/* Right: Actual Logged Hours ONLY */}
                                    <div className="flex items-center gap-1 shrink-0">
                                        {stepActualHours > 0 ? (
                                            <span className="font-bold text-[var(--status-success)] bg-[var(--tint-teal-bg)] px-1 rounded border border-[var(--status-success)]/30">
                                                実績: {stepActualHours.toFixed(1)}h
                                            </span>
                                        ) : (
                                            <span className="opacity-0">—</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
