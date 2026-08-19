'use client'

import React, { useState } from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { format } from 'date-fns'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface ToolingGroupedJobCardProps {
    job: JobForGantt
    steps: JobStepRow[]
    empMap: Map<string, string>
    machMap: Map<string, string>
    currentColumnDate?: string
    isExpanded?: boolean
    onToggleExpand?: () => void
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

export type UrgencyLevel = 'COMPLETED' | 'OVERDUE' | 'DUE_TODAY' | 'DUE_1_DAY' | 'DUE_2_DAYS' | 'ON_TRACK'

export interface UrgencyMeta {
    level: UrgencyLevel
    badgeLabel: string
    badgeClass: string
    cardBorderLeft: string
    headerBg: string
    headerBorder: string
}

function resolveUrgency(deadlineStr: string | null | undefined, isCompleted: boolean): UrgencyMeta {
    if (isCompleted) {
        const d = deadlineStr ? new Date(deadlineStr) : null
        const dateLabel = d && !isNaN(d.getTime()) ? format(d, 'MM/dd') : '完了'
        return {
            level: 'COMPLETED',
            badgeLabel: dateLabel,
            badgeClass: 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] font-mono text-[8.5px]',
            cardBorderLeft: 'border-l-[4px] border-l-[#16A34A]',
            headerBg: 'bg-[#F0FDF4]',
            headerBorder: 'border-[#BBF7D0]'
        }
    }

    if (!deadlineStr) {
        return {
            level: 'ON_TRACK',
            badgeLabel: '—',
            badgeClass: 'bg-slate-100 text-slate-600 border border-slate-300 font-mono text-[8.5px]',
            cardBorderLeft: 'border-l-[4px] border-l-slate-400',
            headerBg: 'bg-[#F8FAFC]',
            headerBorder: 'border-[#E2E8F0]'
        }
    }

    const deadline = new Date(deadlineStr)
    deadline.setHours(0, 0, 0, 0)
    if (isNaN(deadline.getTime())) {
        return {
            level: 'ON_TRACK',
            badgeLabel: '—',
            badgeClass: 'bg-slate-100 text-slate-600 border border-slate-300 font-mono text-[8.5px]',
            cardBorderLeft: 'border-l-[4px] border-l-slate-400',
            headerBg: 'bg-[#F8FAFC]',
            headerBorder: 'border-[#E2E8F0]'
        }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24))
    const formattedDate = format(deadline, 'MM/dd')

    // 1. Overdue (< 0 days) -> RED (Đỏ cảnh báo)
    if (diffDays < 0) {
        return {
            level: 'OVERDUE',
            badgeLabel: `! ${formattedDate}`,
            badgeClass: 'bg-[#FEE2E2] text-[#B91C1C] border border-[#F87171] font-bold font-mono text-[8.5px] animate-pulse',
            cardBorderLeft: 'border-l-[4px] border-l-[#DC2626]',
            headerBg: 'bg-[#FEF2F2]',
            headerBorder: 'border-[#FECACA]'
        }
    }

    // 2. Due Today (0 days) -> RED / CRITICAL (Đỏ khẩn cấp trong ngày hôm nay)
    if (diffDays === 0) {
        return {
            level: 'DUE_TODAY',
            badgeLabel: `本日 ${formattedDate}`,
            badgeClass: 'bg-[#FEE2E2] text-[#DC2626] border border-[#EF4444] font-extrabold font-mono text-[8.5px] animate-pulse',
            cardBorderLeft: 'border-l-[4px] border-l-[#DC2626]',
            headerBg: 'bg-[#FFF1F2]',
            headerBorder: 'border-[#FECDD3]'
        }
    }

    // 3. Due in 1 Day (Trước 1 ngày - ngày mai đến hạn) -> ORANGE (Màu Cam)
    if (diffDays === 1) {
        return {
            level: 'DUE_1_DAY',
            badgeLabel: `明日 ${formattedDate}`,
            badgeClass: 'bg-[#FFEDD5] text-[#C2410C] border border-[#FB923C] font-bold font-mono text-[8.5px]',
            cardBorderLeft: 'border-l-[4px] border-l-[#EA580C]',
            headerBg: 'bg-[#FFF7ED]',
            headerBorder: 'border-[#FED7AA]'
        }
    }

    // 4. Due in 2 Days (Trước 2 ngày) -> YELLOW (Màu Vàng)
    if (diffDays === 2) {
        return {
            level: 'DUE_2_DAYS',
            badgeLabel: formattedDate,
            badgeClass: 'bg-[#FEF9C3] text-[#A16207] border border-[#FDE047] font-bold font-mono text-[8.5px]',
            cardBorderLeft: 'border-l-[4px] border-l-[#CA8A04]',
            headerBg: 'bg-[#FEFCE8]',
            headerBorder: 'border-[#FEF08A]'
        }
    }

    // 5. On Track (> 2 days / 3 ngày trở lên) -> NEUTRAL SLATE (Màu xám trung tính, không nhầm lẫn với hoàn thành)
    return {
        level: 'ON_TRACK',
        badgeLabel: formattedDate,
        badgeClass: 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] font-mono text-[8.5px]',
        cardBorderLeft: 'border-l-[4px] border-l-slate-400',
        headerBg: 'bg-[#F8FAFC]',
        headerBorder: 'border-[#E2E8F0]'
    }
}

const URGENCY_RANK: Record<UrgencyLevel, number> = {
    OVERDUE: 5,
    DUE_TODAY: 4,
    DUE_1_DAY: 3,
    DUE_2_DAYS: 2,
    ON_TRACK: 1,
    COMPLETED: 0
}

function resolveJobOverallUrgency(job: JobForGantt, steps: JobStepRow[]): UrgencyMeta {
    const isJobCompleted = job.job_status === 'COMPLETED'
    const jobDeadline = job.target_completion_date || job.mold_deadline || job.deadline

    if (isJobCompleted) {
        return resolveUrgency(jobDeadline, true)
    }

    // Evaluate job level milestone
    let highestUrgency = resolveUrgency(jobDeadline, false)

    // Evaluate each step to reflect the highest severity on the Job card
    for (const st of steps) {
        const isStDone = st.step_status === 'COMPLETED' || st.processing_statuses?.status_code?.includes('完了')
        if (isStDone) continue

        const stDl = st.deadline || job.mold_deadline
        const stUrgency = resolveUrgency(stDl, false)
        if (URGENCY_RANK[stUrgency.level] > URGENCY_RANK[highestUrgency.level]) {
            highestUrgency = stUrgency
        }
    }

    // If all steps exist and are completed -> Completed
    if (steps.length > 0 && steps.every(st => st.step_status === 'COMPLETED' || st.processing_statuses?.status_code?.includes('完了'))) {
        return resolveUrgency(jobDeadline, true)
    }

    return highestUrgency
}

export default function ToolingGroupedJobCard({
    job,
    steps,
    empMap,
    machMap,
    currentColumnDate,
    isExpanded: controlledExpanded,
    onToggleExpand,
    onOpenJob,
    onEditStep,
    onQuickLog
}: ToolingGroupedJobCardProps) {
    const [localExpanded, setLocalExpanded] = useState(true)
    const isExpanded = controlledExpanded !== undefined ? controlledExpanded : localExpanded

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (onToggleExpand) {
            onToggleExpand()
        } else {
            setLocalExpanded(!localExpanded)
        }
    }

    const isJobCompleted = job.job_status === 'COMPLETED'
    const isJobInProgress = job.job_status === 'IN_PROGRESS'

    const overallUrgency = resolveJobOverallUrgency(job, steps)
    const productCode = job.products?.product_code || job.job_code || 'JOB'

    return (
        <div 
            className={`rounded-lg border transition-all shadow-xs hover:shadow-md bg-white overflow-hidden mb-1.5 border-[var(--border-default)] ${overallUrgency.cardBorderLeft} ${
                isJobCompleted ? 'opacity-90' : ''
            }`}
        >
            {/* ─── PARENT JOB HEADER (DYNAMIC CONDITIONAL COLOR BY URGENCY) ─── */}
            <div 
                onClick={() => onOpenJob && onOpenJob(job)}
                className={`p-2 cursor-pointer hover:brightness-95 transition-all flex flex-col gap-1 border-b ${overallUrgency.headerBg} ${overallUrgency.headerBorder}`}
            >
                {/* Row 1: Code + Items count badge + Expand toggle (Left) & Overall Target Completion (Right) */}
                <div className="flex justify-between items-center gap-1">
                    <div className="flex items-center gap-1 min-w-0">
                        <button
                            type="button"
                            onClick={handleToggle}
                            className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors rounded hover:bg-white shrink-0"
                            title={isExpanded ? 'Thu gọn công đoạn' : 'Mở rộng công đoạn'}
                        >
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <span className="font-bold text-[13px] font-mono text-[var(--accent)] tracking-tight truncate">
                            {productCode}
                        </span>
                        {steps.length > 0 && (
                            <span 
                                onClick={handleToggle}
                                className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white text-[var(--text-secondary)] border border-[var(--border-default)] shadow-2xs shrink-0 cursor-pointer hover:border-[var(--accent)]"
                            >
                                {steps.length} 項目
                            </span>
                        )}
                    </div>

                    {/* Header Milestone Badge with Urgency Formatting */}
                    <span className={`shrink-0 ${overallUrgency.badgeClass}`} title="完成目標日 / 状態">
                        🏁 {overallUrgency.badgeLabel}
                    </span>
                </div>

                {/* Row 2: Job Name / Customer */}
                <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] pl-4">
                    <span className="truncate font-semibold text-[var(--text-primary)]" title={job.job_name}>
                        {job.job_name}
                    </span>
                    {job.companies?.company_name && (
                        <span className="truncate max-w-[70px] font-jp opacity-90 shrink-0 ml-1 text-right text-[9.5px] bg-white px-1.5 py-0.2 rounded border border-[var(--border-default)] shadow-2xs font-medium" title={job.companies.company_name}>
                            {job.companies.company_code || job.companies.company_name}
                        </span>
                    )}
                </div>

                {/* Row 3: 3 Milestones (Left) + Status Badge ONLY (Right) - Clean, Full Display without truncation */}
                <div className="flex items-center justify-between gap-1 text-[9.5px] font-mono pl-4 pt-0.5">
                    {/* Left: 3 Milestones */}
                    <div className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
                        {job.target_completion_date && (
                            <span className="text-[#166534] font-bold bg-[#DCFCE7] border border-[#86EFAC]/50 px-1 py-0.2 rounded whitespace-nowrap" title="完成目標日 (出荷前3稼働日)">
                                🏁{job.target_completion_date.slice(5)}
                            </span>
                        )}
                        {job.mold_deadline && (
                            <span className="text-[var(--accent)] bg-white border border-[var(--border-default)] px-1 py-0.2 rounded whitespace-nowrap" title="指示納期 / 払出期日">
                                🛠️{job.mold_deadline.slice(5, 10)}
                            </span>
                        )}
                        {job.ship_date && (
                            <span className="text-[var(--status-warning)] bg-[#FEF3C7] border border-[#FDE68A]/60 px-1 py-0.2 rounded whitespace-nowrap" title="出荷予定日">
                                📦{job.ship_date.slice(5, 10)}
                            </span>
                        )}
                    </div>

                    {/* Right: Status Badge ONLY */}
                    <div className="flex items-center shrink-0">
                        <span className={`px-1.5 py-0.2 rounded text-[8.5px] font-bold ${
                            isJobCompleted 
                                ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]' 
                                : isJobInProgress 
                                    ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]' 
                                    : 'bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1]'
                        }`}>
                            {isJobCompleted ? '完了' : isJobInProgress ? '進行中' : '新規'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ─── TREE / SUB-ITEMS (SCROLLABLE CONTAINER WITH MAX HEIGHT & CONDITIONAL COLOR) ─── */}
            {isExpanded && (
                <div 
                    className="p-1 flex flex-col gap-1 bg-[#F8FAFC] rounded-b-lg overflow-y-auto max-h-[165px]"
                    style={{
                        scrollbarWidth: 'thin'
                    }}
                >
                    {steps.map((step) => {
                        const track = resolveTrack(step)
                        const trackMeta = TRACK_CONFIG[track] || TRACK_CONFIG.MOLD
                        
                        const stepLogHours = (step.work_logs || []).reduce((sum, w) => sum + (Number(w.hours_spent) || 0), 0)
                        const stepActualHours = step.actual_hours || stepLogHours || 0

                        const statusMeta = resolveStepStatus(step)
                        const isStepDone = statusMeta.label === '完了'

                        const stepDeadline = step.deadline || job.mold_deadline
                        const stepUrgency = resolveUrgency(stepDeadline, isStepDone)

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
                                className={`group/step rounded-[4px] px-1.5 py-1 border transition-all cursor-pointer flex items-center justify-between gap-1.5 text-[11px] bg-white border-[var(--border-default)] hover:border-[var(--accent)] hover:shadow-xs ${
                                    isStepDone ? 'opacity-75 hover:opacity-100' : ''
                                }`}
                                title={`[${step.step_name}]\nダブルクリックで日報入力`}
                            >
                                {/* Left: Track Badge + Full Step Name */}
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                    <span 
                                        className="px-1 py-0.2 rounded font-bold text-[8.5px] uppercase shrink-0 shadow-2xs"
                                        style={{ backgroundColor: trackMeta.bg, color: trackMeta.text }}
                                    >
                                        {trackMeta.label}
                                    </span>
                                    <span className="font-semibold text-[var(--text-primary)] truncate group-hover/step:text-[var(--accent)] text-[11px]" title={step.step_name}>
                                        {step.step_name}
                                    </span>
                                </div>

                                {/* Right: Status + Conditional Urgency Deadline Badge + Actual Machining Hours */}
                                <div className="flex items-center gap-1 shrink-0">
                                    {/* Status Badge */}
                                    <span className={`px-1 py-0.2 rounded text-[8px] font-bold ${statusMeta.badgeClass}`}>
                                        {statusMeta.label}
                                    </span>

                                    {/* Conditional Urgency Deadline Badge */}
                                    <span className={`px-1 py-0.2 rounded font-mono font-bold text-[8.5px] ${stepUrgency.badgeClass}`} title="期日 / 完了日">
                                        {stepUrgency.badgeLabel}
                                    </span>

                                    {/* Actual Logged Machining Hours (Inside Step) */}
                                    {stepActualHours > 0 && (
                                        <span className="font-mono font-bold text-[9px] text-[var(--status-success)] bg-[var(--tint-teal-bg)] px-1 py-0.2 rounded border border-[var(--status-success)]/30 shrink-0" title="実績工数">
                                            {stepActualHours.toFixed(1)}h
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
