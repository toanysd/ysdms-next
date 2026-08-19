'use client'

import React from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { format } from 'date-fns'

interface ToolingMonthGroupedJobCardProps {
    job: JobForGantt
    steps: JobStepRow[]
    empMap?: Map<string, string>
    machMap?: Map<string, string>
    currentColumnDate?: string
    onOpenJob?: (job: JobForGantt) => void
    onEditStep?: (step: JobStepRow, job: JobForGantt) => void
    onQuickLog?: (job: JobForGantt, step?: JobStepRow) => void
}

const TRACK_CONFIG: Record<string, { bg: string, text: string, label: string, border: string }> = {
    DESIGN: { bg: '#eff6ff', text: '#2563eb', label: '設', border: '#93c5fd' },
    MOLD: { bg: 'var(--tint-teal-bg, #ccfbf1)', text: 'var(--accent, #0d9488)', label: '型', border: '#14b8a6' },
    PLUG: { bg: 'var(--tint-amber-bg, #fef3c7)', text: 'var(--status-warning, #d97706)', label: 'プ', border: '#f59e0b' },
    CUTTER: { bg: 'var(--tint-purple-bg, #f3e8ff)', text: 'var(--brand-purple, #9333ea)', label: '刃', border: '#a855f7' },
    FINISH: { bg: 'var(--tint-blue-bg, #dbeafe)', text: 'var(--status-info, #2563eb)', label: '仕', border: '#3b82f6' }
}

function resolveTrack(step: JobStepRow): string {
    if (step.track) return step.track
    const name = step.step_name || ''
    if (name.includes('図面') || name.includes('3D') || name.includes('設計') || name.includes('レイアウト') || name.includes('プログラム')) return 'DESIGN'
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
    headerBg: string
    headerBorder: string
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
            cardClass: 'bg-[#F0FDF4]/90 border-[#86EFAC] text-[#166534]',
            headerBg: 'bg-[#DCFCE7]/60',
            headerBorder: 'border-[#BBF7D0]',
            borderLeftClass: 'border-l-[3px] border-l-[#16A34A]'
        }
    }

    if (!deadlineStr) {
        return {
            level: 'ON_TRACK',
            badgeLabel: '',
            badgeClass: 'bg-slate-100 text-slate-600 border border-slate-300 font-mono text-[8px]',
            cardClass: 'bg-white border-slate-200 text-slate-900',
            headerBg: 'bg-slate-50/80',
            headerBorder: 'border-slate-200',
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
            headerBg: 'bg-slate-50/80',
            headerBorder: 'border-slate-200',
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
            cardClass: 'bg-[#FEF2F2]/90 border-[#F87171] text-[#991B1B]',
            headerBg: 'bg-[#FEE2E2]/70',
            headerBorder: 'border-[#FECACA]',
            borderLeftClass: 'border-l-[3px] border-l-[#DC2626]'
        }
    }

    // 2. Due Today (0 days) -> RED/ROSE (Đỏ khẩn cấp trong ngày hôm nay)
    if (diffDays === 0) {
        return {
            level: 'DUE_TODAY',
            badgeLabel: `本日 ${formattedDate}`,
            badgeClass: 'bg-[#FEE2E2] text-[#DC2626] border border-[#EF4444] font-extrabold font-mono text-[8px] animate-pulse',
            cardClass: 'bg-[#FFF1F2]/90 border-[#FECDD3] text-[#9F1239]',
            headerBg: 'bg-[#FFE4E6]/70',
            headerBorder: 'border-[#FECDD3]',
            borderLeftClass: 'border-l-[3px] border-l-[#DC2626]'
        }
    }

    // 3. Due in 1 Day (Trước 1 ngày - ngày mai đến hạn) -> ORANGE (Màu Cam)
    if (diffDays === 1) {
        return {
            level: 'DUE_1_DAY',
            badgeLabel: `明日 ${formattedDate}`,
            badgeClass: 'bg-[#FFEDD5] text-[#C2410C] border border-[#FB923C] font-bold font-mono text-[8px]',
            cardClass: 'bg-[#FFF7ED]/90 border-[#FED7AA] text-[#9A3412]',
            headerBg: 'bg-[#FFEDD5]/70',
            headerBorder: 'border-[#FED7AA]',
            borderLeftClass: 'border-l-[3px] border-l-[#EA580C]'
        }
    }

    // 4. Due in 2 Days (Trước 2 ngày) -> YELLOW (Màu Vàng)
    if (diffDays === 2) {
        return {
            level: 'DUE_2_DAYS',
            badgeLabel: formattedDate,
            badgeClass: 'bg-[#FEF9C3] text-[#A16207] border border-[#FDE047] font-bold font-mono text-[8px]',
            cardClass: 'bg-[#FEFCE8]/90 border-[#FEF08A] text-[#854D0E]',
            headerBg: 'bg-[#FEF9C3]/70',
            headerBorder: 'border-[#FEF08A]',
            borderLeftClass: 'border-l-[3px] border-l-[#CA8A04]'
        }
    }

    // 5. On Track (> 2 days)
    return {
        level: 'ON_TRACK',
        badgeLabel: formattedDate,
        badgeClass: 'bg-slate-100 text-slate-700 border border-slate-300 font-mono text-[8px]',
        cardClass: 'bg-white border-slate-200 text-slate-900',
        headerBg: 'bg-slate-50/80',
        headerBorder: 'border-slate-200',
        borderLeftClass: 'border-l-[3px] border-l-slate-400'
    }
}

export default function ToolingMonthGroupedJobCard({
    job,
    steps,
    empMap,
    machMap,
    currentColumnDate,
    onOpenJob,
    onEditStep,
    onQuickLog
}: ToolingMonthGroupedJobCardProps) {
    const isJobCompleted = job.job_status === 'COMPLETED' || steps.every(s => s.step_status === 'COMPLETED')
    const isJobInProgress = job.job_status === 'IN_PROGRESS' || steps.some(s => s.step_status === 'IN_PROGRESS' || (s.work_logs && s.work_logs.length > 0))

    const effectiveDeadline = (job as any).target_completion_date || job.mold_deadline || job.deadline
    const urgency = resolveUrgency(effectiveDeadline, isJobCompleted)

    const productCode = job.products?.product_code || job.job_code || 'JOB'
    const companyCode = job.companies?.company_code || ''

    // Calculate total hours of steps in this card
    const totalActualHours = steps.reduce((sum, s) => {
        const logHours = (s.work_logs || []).reduce((lSum, w) => lSum + (Number(w.hours_spent) || 0), 0)
        return sum + (s.actual_hours || logHours || 0)
    }, 0)

    return (
        <div
            className={`rounded-[4px] border overflow-hidden flex flex-col transition-all hover:shadow-sm select-none shadow-2xs ${urgency.cardClass} ${urgency.borderLeftClass}`}
        >
            {/* ── 1. CARD HEADER (Parent Job Info) ── */}
            <div
                onClick={() => onOpenJob && onOpenJob(job)}
                className={`px-1.5 py-1 border-b flex items-center justify-between gap-1 cursor-pointer transition-colors hover:brightness-95 ${urgency.headerBg} ${urgency.headerBorder}`}
                title={`[${productCode}] ${job.job_name || ''}\n期限: ${effectiveDeadline ? effectiveDeadline.split('T')[0] : 'なし'}\n状態: ${isJobCompleted ? '完了' : isJobInProgress ? '進行中' : '未着手'}\nクリック: Job詳細を開く`}
            >
                {/* Left: Product Code + Company Badge + Steps Count */}
                <div className="flex items-center gap-1 min-w-0 flex-1">
                    <span className="font-mono font-bold text-[11px] text-[var(--accent)] truncate tracking-tight">
                        {productCode}
                    </span>

                    {companyCode && (
                        <span className="text-[8px] font-mono font-bold px-1 py-0.2 rounded bg-slate-200/80 text-slate-700 shrink-0">
                            {companyCode}
                        </span>
                    )}

                    <span className="text-[8px] font-mono text-slate-500 font-semibold shrink-0">
                        {steps.length}項目
                    </span>
                </div>

                {/* Right: Urgency Deadline Badge + Job Status Badge */}
                <div className="flex items-center gap-1 shrink-0">
                    {urgency.badgeLabel && (
                        <span className={`px-1 py-0 rounded ${urgency.badgeClass}`}>
                            {urgency.badgeLabel}
                        </span>
                    )}

                    <span className={`text-[8px] px-1 py-0.2 rounded font-semibold ${
                        isJobCompleted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isJobInProgress
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-600 border border-slate-300'
                    }`}>
                        {isJobCompleted ? '完了' : isJobInProgress ? '進行中' : '未着手'}
                    </span>
                </div>
            </div>

            {/* ── 2. JOB NAME SUMMARY (If present) ── */}
            {job.job_name && (
                <div
                    onClick={() => onOpenJob && onOpenJob(job)}
                    className="px-1.5 pt-0.5 text-[9px] font-semibold text-slate-800 truncate cursor-pointer hover:underline"
                    title={job.job_name}
                >
                    {job.job_name}
                </div>
            )}

            {/* ── 3. SUB-COMPONENTS / STEPS LIST ── */}
            <div className="p-1 flex flex-col gap-0.5 bg-white/70">
                {steps.map((step) => {
                    const track = resolveTrack(step)
                    const trackStyle = TRACK_CONFIG[track] || TRACK_CONFIG.MOLD
                    const isStepDone = step.step_status === 'COMPLETED'
                    const isStepActive = step.step_status === 'IN_PROGRESS' || (step.work_logs && step.work_logs.length > 0)
                    
                    const stepLogHours = (step.work_logs || []).reduce((sum, w) => sum + (Number(w.hours_spent) || 0), 0)
                    const stepHours = step.actual_hours || stepLogHours || 0

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
                            className={`px-1 py-0.5 rounded-[3px] flex items-center justify-between gap-1 text-[9.5px] cursor-pointer transition-all hover:bg-slate-100 hover:scale-[1.01] border ${
                                isStepDone
                                    ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                                    : isStepActive
                                        ? 'bg-amber-50/60 border-amber-200/80 text-amber-900'
                                        : 'bg-white border-slate-200 text-slate-800'
                            }`}
                            title={`[${trackStyle.label}] ${step.step_name}\n状態: ${isStepDone ? '完了' : isStepActive ? '進行中' : '未着手'}\n実績: ${stepHours > 0 ? `${stepHours}h` : 'なし'}\nクリック: 工程編集 / ダブルクリック: 日報入力`}
                        >
                            {/* Left: Track badge + Step Name */}
                            <div className="flex items-center gap-1 min-w-0 flex-1">
                                <span
                                    className="w-3 h-3 rounded-[2px] font-bold text-[7.5px] flex items-center justify-center shrink-0 border"
                                    style={{ backgroundColor: trackStyle.bg, color: trackStyle.text, borderColor: trackStyle.border }}
                                >
                                    {trackStyle.label}
                                </span>

                                <span className="truncate font-medium text-slate-800">
                                    {step.step_name}
                                </span>
                            </div>

                            {/* Right: Step Status Pill + Hours */}
                            <div className="flex items-center gap-1 shrink-0">
                                <span className={`text-[7.5px] px-0.5 py-0 rounded font-semibold ${
                                    isStepDone
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : isStepActive
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {isStepDone ? '完了' : isStepActive ? '進行' : '未着'}
                                </span>

                                {stepHours > 0 && (
                                    <span className="font-mono font-bold text-[8px] text-[#15803D] bg-white px-0.5 rounded border border-[#86EFAC]">
                                        {stepHours.toFixed(1)}h
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ── 4. TOTAL HOURS BADGE (If > 0) ── */}
            {totalActualHours > 0 && (
                <div className="px-1.5 py-0.5 bg-slate-50 border-t border-slate-200/60 flex items-center justify-between text-[8px] text-slate-600 font-mono">
                    <span className="text-[7.5px] uppercase font-bold text-slate-400">実績合計</span>
                    <span className="font-bold text-[#15803D]">{totalActualHours.toFixed(1)}h</span>
                </div>
            )}
        </div>
    )
}
