'use client'
import { useState } from 'react'
import DayPlanGrid from './DayPlanGrid'
import ExcelPlanGridView from './ExcelPlanGridView-v8.5.2-1'
import { LayoutGrid, List } from 'lucide-react'

// Container wrapper xử lý chuyển đổi giữa List View và Excel View
export default function DayPlanContainer({ plans, machines, dateStr }: { plans: any[], machines: any[], dateStr: string }) {
    const [viewMode, setViewMode] = useState<'LIST' | 'EXCEL'>('EXCEL') // Mặc định mở luôn dạng Excel cho Sếp xem trải nghiệm

    return (
        <div className="flex flex-col h-full w-full bg-[var(--mcs-surface)] rounded-[6px] border border-[var(--mcs-border)] shadow-sm overflow-hidden relative">

            {/* Control Bar */}
            <div className="absolute top-[8px] right-[8px] z-20 flex bg-[var(--mcs-surface-3)] border border-[var(--mcs-border-strong)] p-[2px] rounded shadow-sm">
                <button
                    onClick={() => setViewMode('LIST')}
                    className={`flex items-center gap-[6px] px-[12px] py-[4px] rounded-[3px] text-[11px] font-bold transition-colors ${viewMode === 'LIST' ? 'bg-[var(--mcs-surface)] shadow border border-[var(--mcs-border)] text-[var(--mcs-primary)]' : 'text-[var(--mcs-text-muted)] hover:text-[var(--mcs-text)] border border-transparent'}`}
                >
                    <List size={14} />
                    リストビュー <span className="font-normal opacity-80">(List)</span>
                </button>
                <button
                    onClick={() => setViewMode('EXCEL')}
                    className={`flex items-center gap-[6px] px-[12px] py-[4px] rounded-[3px] text-[11px] font-bold transition-colors ${viewMode === 'EXCEL' ? 'bg-[#ffecb3] border border-[#ffe082] text-[#856404] shadow' : 'text-[var(--mcs-text-muted)] hover:text-[var(--mcs-text)] border border-transparent'}`}
                >
                    <LayoutGrid size={14} />
                    エクセルビュー <span className="font-normal opacity-80">(Lưới Excel)</span>
                </button>
            </div>

            {/* View Render */}
            <div className="flex-1 w-full h-full overflow-hidden mt-[0px]">
                {viewMode === 'LIST' ? (
                    <div className="pt-[40px] h-full"> {/* Padding nhường chỗ Control Bar */}
                        <DayPlanGrid plans={plans} machines={machines} dateStr={dateStr} />
                    </div>
                ) : (
                    <div className="pt-[40px] h-full bg-[var(--mcs-surface-2)]">
                        <ExcelPlanGridView plans={plans} machines={machines} startDateStr={dateStr} />
                    </div>
                )}
            </div>

        </div>
    )
}
