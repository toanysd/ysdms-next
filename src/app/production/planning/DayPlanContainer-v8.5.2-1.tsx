'use client'
import { useState } from 'react'
import DayPlanGrid from './DayPlanGrid'
import ExcelPlanGridView from './ExcelPlanGridView-v8.5.2-1'
import { LayoutGrid, List } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function DayPlanContainer({ plans, machines, dateStr, daysCount = 7 }: { plans: any[], machines: any[], dateStr: string, daysCount?: number }) {
    const t = useTranslations('Planning.DayContainer')
    const [viewMode, setViewMode] = useState<'LIST' | 'EXCEL'>('EXCEL')

    return (
        <div className="flex flex-col h-full w-full bg-[var(--bg-surface)] rounded-none border-0 overflow-hidden relative">
            {/* Control Bar */}
            <div className="absolute top-[8px] right-[8px] z-20 flex bg-[var(--bg-surface-2)] border border-[var(--border-default)] p-[2px] rounded shadow-sm">
                <button
                    onClick={() => setViewMode('LIST')}
                    className={`flex items-center gap-[6px] px-[12px] py-[4px] rounded-[3px] text-[11px] font-bold transition-colors ${viewMode === 'LIST' ? 'bg-[var(--bg-surface)] shadow border border-[var(--border-default)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'}`}
                >
                    <List size={14} />
                    {t('listView')}
                </button>
                <button
                    onClick={() => setViewMode('EXCEL')}
                    className={`flex items-center gap-[6px] px-[12px] py-[4px] rounded-[3px] text-[11px] font-bold transition-colors ${viewMode === 'EXCEL' ? 'bg-[var(--tint-amber-bg)] border border-[var(--status-warning)] text-[var(--text-primary)] shadow' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-transparent'}`}
                >
                    <LayoutGrid size={14} />
                    {t('excelView')}
                </button>
            </div>

            {/* View Render */}
            <div className="flex-1 w-full h-full overflow-hidden mt-[0px]">
                {viewMode === 'LIST' ? (
                    <div className="pt-[40px] h-full">
                        <DayPlanGrid plans={plans} machines={machines} dateStr={dateStr} />
                    </div>
                ) : (
                    <div className="pt-[40px] h-full bg-[var(--bg-surface-2)]">
                        <ExcelPlanGridView plans={plans} machines={machines} startDateStr={dateStr} />
                    </div>
                )}
            </div>
        </div>
    )
}

