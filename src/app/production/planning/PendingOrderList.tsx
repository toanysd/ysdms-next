'use client'

import { useState } from 'react'
import CreatePlanForm from './CreatePlanForm'
import { addDays, differenceInDays } from 'date-fns'
import { useDraggable } from '@dnd-kit/core'

function DraggableOrderItem({ item, onClick, urgencyColor }: { item: any, onClick: () => void, urgencyColor: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.order_item_id,
    })

    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}
            className={`bg-white/10 dark:bg-black/10 backdrop-blur-[8px] p-[12px] rounded-md hover:bg-[var(--mcs-surface-hover)] hover:shadow-[var(--mcs-shadow-md)] transition-all group flex flex-col cursor-grab active:cursor-grabbing relative overflow-hidden ${urgencyColor} ${isDragging ? 'opacity-30' : 'opacity-100'}`}
            onDoubleClick={onClick} // Change to double click so drag is single click
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
    )
}

export default function PendingOrderList({ initialItems }: { initialItems: any[] }) {
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

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
            {initialItems.map(item => {
                let urgencyColor = 'border-[var(--mcs-border)]' // Default
                if (item.detail?.delivery_date) {
                    const deliveryDate = new Date(item.detail.delivery_date)
                    const diff = differenceInDays(deliveryDate, today)
                    if (diff <= 2) urgencyColor = 'border-l-[3px] border-l-[var(--mcs-error)] border-t-[var(--mcs-border)] border-r-[var(--mcs-border)] border-b-[var(--mcs-border)]'
                    else if (diff <= 5) urgencyColor = 'border-l-[3px] border-l-[var(--mcs-warning)] border-t-[var(--mcs-border)] border-r-[var(--mcs-border)] border-b-[var(--mcs-border)]'
                    else urgencyColor = 'border-l-[3px] border-l-[var(--mcs-success)] border-t-[var(--mcs-border)] border-r-[var(--mcs-border)] border-b-[var(--mcs-border)]'
                }

                return (
                    <DraggableOrderItem 
                        key={item.order_item_id} 
                        item={item} 
                        onClick={() => setSelectedItem(item)} 
                        urgencyColor={urgencyColor} 
                    />
                )
            })}

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
