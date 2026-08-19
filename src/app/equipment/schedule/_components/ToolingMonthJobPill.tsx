'use client'

import React from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { format } from 'date-fns'

interface ToolingMonthJobPillProps {
    job: JobForGantt
    step: JobStepRow
    onClick?: (job: JobForGantt, step: JobStepRow) => void
    onDoubleClick?: (job: JobForGantt, step: JobStepRow) => void
}

const TRACK_CONFIG: Record<string, { bg: string, text: string, label: string, border: string }> = {
    MOLD: { bg: 'var(--tint-teal-bg, #ccfbf1)', text: 'var(--accent, #0d9488)', label: '型', border: '#14b8a6' },
    PLUG: { bg: 'var(--tint-amber-bg, #fef3c7)', text: 'var(--status-warning, #d97706)', label: 'プ', border: '#f59e0b' },
    CUTTER: { bg: 'var(--tint-purple-bg, #f3e8ff)', text: 'var(--brand-purple, #9333ea)', label: '刃', border: '#a855f7' },
    FINISH: { bg: 'var(--tint-blue-bg, #dbeafe)', text: 'var(--status-info, #2563eb)', label: '仕', border: '#3b82f6' }
}

function resolveTrack(step: JobStepRow): string {
    if (step.track) return step.track
    const name = step.step_name || ''
    if (name.includes('プラグ')) return 'PLUG'
    if (name.includes('抜型') || name.includes('刃')) return 'CUTTER'
    if (name.includes('仕上') || name.includes('ミガキ')) return 'FINISH'
    return 'MOLD'
}

export type UrgencyLevel = 'COMPLETED' | 'OVERDUE' | 'DUE_TODAY' | 'DUE_1_DAY' | 'DUE_2_DAYS' | 'ON_TRACK'

export interface UrgencyMeta {
    level: UrgencyLevel
    badgeLabel: string
    badgeClass: string
    cardClass: string
    borderLeftClass: string
}

function resolveUrgency(deadlineStr: string | null | undefined, isCompleted: boolean): UrgencyMeta {
    if (isCompleted) {
        const d = deadlineStr ? new Date(deadlineStr) : null
        const dateLabel = d && !isNaN(d.getTime()) ? format(d, 'MM/dd') : '完了'
        return {
            level: 'COMPLETED',
            badgeLabel: dateLabel,
            badgeClass: 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] font-mono text-[8px] font-bold',
            cardClass: 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]',
            borderLeftClass: 'border-l-[3px] border-l-[#16A34A]'
        }
    }

    if (!deadlineStr) {
        return {
            level: 'ON_TRACK',
            badgeLabel: '',
            badgeClass: 'bg-slate-100 text-slate-600 border border-slate-300 font-mono text-[8px]',
            cardClass: 'bg-white border-slate-200 text-slate-900',
            borderLeftClass: 'border-l-[3px] border-l-slate-400'
        }
    }

    const deadline = new Date(deadlineStr)
    deadline.setHours(0, 0, 0, 0)
    if (isNaN(deadline.getTime())) {
        return {
            level: 'ON_TRACK',
            badgeLabel: '',
            badgeClass: 'bg-slate-100 text-slate-600 border border-slate-300 font-mono text-[8px]',
            cardClass: 'bg-white border-slate-200 text-slate-900',
            borderLeftClass: 'border-l-[3px] border-l-slate-400'
        }
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24))
    const formattedDate = format(deadline, 'MM/dd')

    // 1. Overdue (< 0 days) -> RED (Đỏ cảnh báo trễ hạn)
    if (diffDays < 0) {
        return {
            level: 'OVERDUE',
            badgeLabel: `! ${formattedDate}`,
            badgeClass: 'bg-[#FEE2E2] text-[#B91C1C] border border-[#F87171] font-bold font-mono text-[8px] animate-pulse',
            cardClass: 'bg-[#FEF2F2] border-[#F87171] text-[#991B1B]',
            borderLeftClass: 'border-l-[3px] border-l-[#DC2626]'
        }
    }

    // 2. Due Today (0 days) -> RED/ROSE (Đỏ khẩn cấp trong ngày hôm nay)
    if (diffDays === 0) {
        return {
            level: 'DUE_TODAY',
            badgeLabel: `本日 ${formattedDate}`,
            badgeClass: 'bg-[#FEE2E2] text-[#DC2626] border border-[#EF4444] font-extrabold font-mono text-[8px] animate-pulse',
            cardClass: 'bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]',
            borderLeftClass: 'border-l-[3px] border-l-[#DC2626]'
        }
    }

    // 3. Due in 1 Day (Trước 1 ngày - ngày mai đến hạn) -> ORANGE (Màu Cam)
    if (diffDays === 1) {
        return {
            level: 'DUE_1_DAY',
            badgeLabel: `明日 ${formattedDate}`,
            badgeClass: 'bg-[#FFEDD5] text-[#C2410C] border border-[#FB923C] font-bold font-mono text-[8px]',
            cardClass: 'bg-[#FFF7ED] border-[#FED7AA] text-[#9A3412]',
            borderLeftClass: 'border-l-[3px] border-l-[#EA580C]'
        }
    }

    // 4. Due in 2 Days (Trước 2 ngày) -> YELLOW (Màu Vàng)
    if (diffDays === 2) {
        return {
            level: 'DUE_2_DAYS',
            badgeLabel: formattedDate,
            badgeClass: 'bg-[#FEF9C3] text-[#A16207] border border-[#FDE047] font-bold font-mono text-[8px]',
            cardClass: 'bg-[#FEFCE8] border-[#FEF08A] text-[#854D0E]',
            borderLeftClass: 'border-l-[3px] border-l-[#CA8A04]'
        }
    }

    // 5. On Track (> 2 days)
    return {
        level: 'ON_TRACK',
        badgeLabel: formattedDate,
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-300 font-mono text-[8px]',
        cardClass: 'bg-white border-slate-200 text-slate-900',
        borderLeftClass: 'border-l-[3px] border-l-slate-400'
    }
}

export default function ToolingMonthJobPill({
    job,
    step,
    onClick,
    onDoubleClick
}: ToolingMonthJobPillProps) {
    const isJobCompleted = job.job_status === 'COMPLETED' || step.step_status === 'COMPLETED'
    const isJobInProgress = job.job_status === 'IN_PROGRESS' || step.step_status === 'IN_PROGRESS'

    const track = resolveTrack(step)
    const trackStyle = TRACK_CONFIG[track] || TRACK_CONFIG.MOLD

    const effectiveDeadline = step.deadline || (job as any).target_completion_date || job.mold_deadline || job.deadline
    const urgency = resolveUrgency(effectiveDeadline, isJobCompleted)

    const productCode = job.products?.product_code || job.job_code || 'JOB'
    const companyCode = job.companies?.company_code || ''

    const stepLogHours = (step.work_logs || []).reduce((sum, w) => sum + (Number(w.hours_spent) || 0), 0)
    const stepActualHours = step.actual_hours || stepLogHours || 0

    return (
        <div
            onClick={(e) => {
                e.stopPropagation()
                if (onClick) onClick(job, step)
            }}
            onDoubleClick={(e) => {
                e.stopPropagation()
                if (onDoubleClick) onDoubleClick(job, step)
            }}
            className={`group/pill px-1.5 py-1 rounded-[4px] border text-[10px] cursor-pointer flex flex-col gap-0.5 transition-all hover:scale-[1.01] hover:shadow-xs select-none shadow-2xs ${urgency.cardClass} ${urgency.borderLeftClass}`}
            title={`[${productCode}] ${step.step_name}\n期限: ${effectiveDeadline ? effectiveDeadline.split('T')[0] : 'なし'}\n状態: ${isJobCompleted ? '完了' : isJobInProgress ? '進行中' : '未着手'}\n実績: ${stepActualHours > 0 ? `${stepActualHours}h` : 'なし'}\nクリック: 詳細 / ダブルクリック: 日報`}
        >
            {/* Top row: Track Badge + Product Code + Company Badge + Deadline Badge */}
            <div className="flex items-center justify-between gap-1 min-w-0">
                <div className="flex items-center gap-1 min-w-0 flex-1">
                    {/* Track icon pill */}
                    <span 
                        className="w-3.5 h-3.5 rounded-[3px] font-bold text-[8px] flex items-center justify-center shrink-0 border"
                        style={{ backgroundColor: trackStyle.bg, color: trackStyle.text, borderColor: trackStyle.border }}
                    >
                        {trackStyle.label}
                    </span>

                    {/* Job / Product code */}
                    <span className="font-mono font-bold text-[10.5px] truncate text-[var(--accent)] tracking-tight">
                        {productCode}
                    </span>

                    {/* Company pill */}
                    {companyCode && (
                        <span className="text-[8px] font-mono font-bold px-0.5 rounded bg-slate-200/80 text-slate-700 shrink-0">
                            {companyCode}
                        </span>
                    )}
                </div>

                {/* Urgency / Deadline Badge */}
                {urgency.badgeLabel && (
                    <span className={`px-1 py-0 rounded shrink-0 ${urgency.badgeClass}`}>
                        {urgency.badgeLabel}
                    </span>
                )}
            </div>

            {/* Bottom row: Step Name + Status + Actual Hours */}
            <div className="flex items-center justify-between gap-1 text-[9px] text-slate-700 pl-4.5">
                <span className="truncate font-medium text-slate-800">
                    {step.step_name}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                    {/* Status indicator */}
                    <span className={`text-[8px] px-0.5 rounded font-semibold ${
                        isJobCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : isJobInProgress
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                    }`}>
                        {isJobCompleted ? '完了' : isJobInProgress ? '進行' : '未着'}
                    </span>

                    {/* Actual hours badge */}
                    {stepActualHours > 0 && (
                        <span className="font-mono font-bold text-[8.5px] text-[#15803D] bg-white px-1 py-0 rounded border border-[#86EFAC]">
                            {stepActualHours.toFixed(1)}h
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
