'use client'

import { useState } from 'react'
import CreatePlanForm from './CreatePlanForm'

export default function PendingOrderList({ initialItems }: { initialItems: any[] }) {
    const [selectedItem, setSelectedItem] = useState<any>(null)

    if (initialItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-[40px] opacity-70">
                <p className="text-[12px] font-bold text-[var(--mcs-text)]">全注文の計画が完了しました</p>
                <p className="text-[10px] uppercase tracking-wider mt-[4px] text-[var(--mcs-text-muted)]">Đã lên lịch xong toàn bộ</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-[8px] pb-24 relative">
            {initialItems.map(item => (
                <div key={item.order_item_id}
                    className="bg-[var(--mcs-surface)] border border-[var(--mcs-border)] p-[12px] rounded-md hover:bg-[var(--mcs-surface-hover)] hover:border-[var(--mcs-primary)] hover:shadow-[var(--mcs-shadow-md)] transition-all group flex flex-col cursor-pointer relative overflow-hidden"
                    onClick={() => setSelectedItem(item)}
                >
                    <div className="flex justify-between items-baseline mb-[6px]">
                        <div className="font-bold text-[14px] text-[var(--mcs-text)] tabular-nums">{item.detail?.orders?.slip_no}</div>
                        <div className="text-[10px] font-bold bg-[var(--mcs-warning-light)] text-[var(--mcs-warning-text)] border border-[var(--mcs-warning)] px-[6px] py-[2px] rounded-sm shadow-sm">
                            {item.detail?.delivery_date ? new Date(item.detail.delivery_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) : 'N/A'}
                        </div>
                    </div>

                    <div className="text-[13px] font-mono font-bold text-[var(--mcs-primary)] truncate mb-[10px]" title={item.detail?.product_pn_raw}>
                        {item.detail?.product_pn_raw}
                    </div>

                    <div className="flex items-center gap-[10px] bg-[var(--mcs-surface-2)] p-[6px] rounded border border-[var(--mcs-border)]">
                        <div className="h-[6px] flex-1 bg-[var(--mcs-surface-3)] rounded-full overflow-hidden border border-[var(--mcs-border-strong)] inset-shadow">
                            <div
                                className={`h-full ${item.plan_coverage_pct === 0 ? 'bg-[var(--mcs-error)]' : 'bg-[var(--mcs-warning)]'} transition-all`}
                                style={{ width: `${item.plan_coverage_pct}%` }}
                            ></div>
                        </div>
                        <div className="text-[12px] font-mono font-bold text-[var(--mcs-text)] tabular-nums text-right w-[80px]">
                            {item.total_planned_qty} <span className="text-[10px] font-normal text-[var(--mcs-text-muted)]">/ {item.total_requested_qty}</span>
                        </div>
                    </div>
                </div>
            ))}

            {/* Fixed Bottom Form Slider */}
            {selectedItem && (
                <div className="fixed bottom-0 left-[52px] w-[35%] max-w-[400px] z-50 animate-slide-up shadow-[var(--mcs-shadow-lg)]">
                    <CreatePlanForm
                        item={selectedItem}
                        onClose={() => setSelectedItem(null)}
                    />
                </div>
            )}
        </div>
    )
}
