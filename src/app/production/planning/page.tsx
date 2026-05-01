import { Suspense } from 'react'
import { getMachineEffectiveSpecs } from '@/app/actions/machine'
import { getPendingOrderItemsForPlanning, getProductionPlansByDateRange } from '@/app/actions/production'
import Link from 'next/link'
import PlanningDndWrapper from './PlanningDndWrapper'
import PendingOrderList from './PendingOrderList'
import DayPlanContainer from './DayPlanContainer-v8.5.2-1'
import { format, addDays } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function ProductionPlanningPage(props: { searchParams: Promise<{ date?: string }> }) {
    const searchParams = await props.searchParams
    const dateParam = searchParams.date || new Date().toISOString().split('T')[0]
    
    // Calculate prev and next week
    const currentDate = new Date(dateParam)
    const prevDate = new Date(currentDate)
    prevDate.setDate(currentDate.getDate() - 7)
    const nextDate = new Date(currentDate)
    nextDate.setDate(currentDate.getDate() + 7)
    
    const prevDateStr = prevDate.toISOString().split('T')[0]
    const nextDateStr = nextDate.toISOString().split('T')[0]

    const machines = await getMachineEffectiveSpecs()
    const pendingItems = await getPendingOrderItemsForPlanning()
    const plans = await getProductionPlansByDateRange(dateParam, nextDateStr) // 7 days

    return (
        <div className="flex flex-col h-[calc(100vh-48px)] bg-[var(--mcs-bg)] text-[var(--mcs-text)] font-sans">
            <header className="flex h-[48px] bg-[var(--mcs-surface)] border-b border-[var(--mcs-border)] px-4 items-center justify-between shrink-0 shadow-sm z-20">
                <div>
                    <h1 className="text-[16px] font-bold text-[var(--mcs-text)]">
                        生産計画 <span className="text-[12px] font-normal text-[var(--mcs-text-muted)] tracking-wider ml-2 uppercase">Lập Kế hoạch Sản xuất (Drag & Drop)</span>
                    </h1>
                </div>
            </header>

            <PlanningDndWrapper pendingItems={pendingItems} machines={machines}>
                <main className="flex-1 flex overflow-hidden">
                {/* LEFT PANEL: 35% */}
                <div className="w-[35%] min-w-[320px] max-w-[400px] border-r border-[var(--mcs-border)] flex flex-col h-full bg-[var(--mcs-surface-2)] z-10">
                    <div className="px-3 py-2 bg-[var(--mcs-surface)] border-b border-[var(--mcs-border)] shrink-0 shadow-sm">
                        <div className="flex items-baseline justify-between mb-[6px]">
                            <h2 className="text-[14px] font-bold text-[var(--mcs-primary)]">未計画注文</h2>
                            <span className="text-[11px] text-[var(--mcs-text-muted)] ml-2">(Chờ Kế hoạch)</span>
                        </div>
                        <div className="flex gap-[6px]">
                            <button className="text-[11px] bg-[var(--mcs-surface)] px-[8px] py-[4px] rounded border border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] text-[var(--mcs-text-secondary)] font-bold transition-colors">Lọc Khách hàng</button>
                            <button className="text-[11px] bg-[var(--mcs-surface)] px-[8px] py-[4px] rounded border border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] text-[var(--mcs-text-secondary)] font-bold transition-colors">Ngày Giao</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-[10px]">
                        <PendingOrderList initialItems={pendingItems} />
                    </div>
                </div>

                {/* RIGHT PANEL: 65% */}
                <div className="flex-1 flex flex-col h-full bg-[var(--mcs-surface)] relative">
                    <div className="px-[16px] py-[8px] h-[52px] bg-[var(--mcs-surface-hover)] border-b border-[var(--mcs-border-strong)] shrink-0 flex justify-between items-center shadow-sm z-10">
                        <div className="flex items-baseline">
                            <h2 className="text-[14px] font-bold text-[var(--mcs-text)]">当日計画表</h2>
                            <span className="text-[11px] text-[var(--mcs-text-muted)] ml-2">(Lịch biểu Máy)</span>
                        </div>

                        <div className="flex items-center gap-[1px] bg-[var(--mcs-surface)] rounded-md border border-[var(--mcs-border-strong)] shadow-sm overflow-hidden">
                            <Link href={`?date=${prevDateStr}`} className="px-[12px] py-[6px] text-[var(--mcs-text-secondary)] hover:bg-[var(--mcs-surface-3)] text-xs font-bold transition-colors border-r border-[var(--mcs-border)]">←</Link>
                            <div className="px-[16px] py-[6px] bg-[var(--mcs-primary-light)] text-[var(--mcs-primary-hover)] font-mono text-[13px] font-bold">{dateParam}</div>
                            <Link href={`?date=${nextDateStr}`} className="px-[12px] py-[6px] text-[var(--mcs-text-secondary)] hover:bg-[var(--mcs-surface-3)] text-xs font-bold transition-colors border-l border-[var(--mcs-border)]">→</Link>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-0">
                        <DayPlanContainer plans={plans} machines={machines} dateStr={dateParam} />
                    </div>
                </div>
            </main>
            </PlanningDndWrapper>
        </div>
    )
}
