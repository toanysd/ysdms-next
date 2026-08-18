'use client'

import React from 'react'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'

interface ToolingMonthJobPillProps {
    job: JobForGantt
    step: JobStepRow
    onClick?: (job: JobForGantt, step: JobStepRow) => void
    onDoubleClick?: (job: JobForGantt, step: JobStepRow) => void
}

const TRACK_SHORT_LABEL: Record<string, string> = {
    MOLD: '型',
    PLUG: 'プ',
    CUTTER: '刃',
    FINISH: '仕'
}

const TRACK_COLORS: Record<string, { bg: string, text: string }> = {
    MOLD: { bg: 'var(--tint-teal-bg)', text: 'var(--accent)' },
    PLUG: { bg: 'var(--tint-amber-bg)', text: 'var(--status-warning)' },
    CUTTER: { bg: 'var(--tint-purple-bg, #f3e8ff)', text: 'var(--brand-purple, #9333ea)' },
    FINISH: { bg: 'var(--tint-blue-bg)', text: 'var(--status-info)' }
}

function resolveTrack(step: JobStepRow): string {
    if (step.track) return step.track
    const name = step.step_name || ''
    if (name.includes('プラグ')) return 'PLUG'
    if (name.includes('抜型') || name.includes('刃')) return 'CUTTER'
    if (name.includes('仕上') || name.includes('ミガキ')) return 'FINISH'
    return 'MOLD'
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
    const trackLabel = TRACK_SHORT_LABEL[track] || '型'
    const trackStyle = TRACK_COLORS[track] || TRACK_COLORS.MOLD

    const productCode = job.products?.product_code || job.job_code || 'JOB'

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
            className={`group/pill px-1.5 py-0.5 rounded-[4px] border text-[10px] cursor-pointer flex items-center justify-between gap-1 transition-all hover:scale-[1.01] hover:shadow-xs select-none ${
                isJobCompleted 
                    ? 'bg-slate-50 border-slate-200 text-slate-500 opacity-80 hover:opacity-100' 
                    : isJobInProgress 
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 shadow-2xs hover:border-emerald-500' 
                        : 'bg-white border-slate-200 text-slate-800 hover:border-blue-400'
            }`}
            title={`[${productCode}] ${step.step_name}\n状態: ${isJobCompleted ? '完了' : isJobInProgress ? '進行中' : '未着手'}\n実績: ${stepActualHours > 0 ? `${stepActualHours}h` : 'なし'}\nクリック: 詳細 / ダブルクリック: 日報`}
        >
            <div className="flex items-center gap-1 min-w-0 flex-1">
                {/* Track icon pill */}
                <span 
                    className="w-3.5 h-3.5 rounded-[3px] font-bold text-[8px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: trackStyle.bg, color: trackStyle.text }}
                >
                    {trackLabel}
                </span>

                {/* Job code + step name */}
                <span className="font-mono font-bold text-[10px] truncate text-[var(--accent)]">
                    {productCode}
                </span>
                <span className="truncate text-[9.5px] opacity-80">
                    {step.step_name}
                </span>
            </div>

            {/* Actual hours badge */}
            {stepActualHours > 0 && (
                <span className="font-mono font-bold text-[8.5px] text-[var(--status-success)] bg-white/90 px-1 py-0 rounded border border-[var(--status-success)]/30 shrink-0">
                    {stepActualHours.toFixed(1)}h
                </span>
            )}
        </div>
    )
}
