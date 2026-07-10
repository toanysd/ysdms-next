'use client'

import React, { useState } from 'react'
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from '@dnd-kit/core'
import { createProductionPlanAction, getProductPhysicalMolds } from '@/app/actions/production'
import { format, parseISO } from 'date-fns'

export default function PlanningDndWrapper({ children, pendingItems, machines }: { children: React.ReactNode, pendingItems: any[], machines: any[] }) {
    const [activeId, setActiveId] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [dropData, setDropData] = useState<any>(null)

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string)
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        setActiveId(null)

        if (over && over.id) {
            // over.id format: m-id|YYYY-MM-DD|SHIFT
            const [machineId, dateStr, shift] = (over.id as string).split('|')
            const orderId = active.id as string

            const order = pendingItems.find(o => o.order_item_id === orderId)
            const machine = machines.find(m => m.id === machineId)

            if (order && machine) {
                setDropData({ order, machine, dateStr, shift })
                setModalOpen(true)
            }
        }
    }

    const activeOrder = activeId ? pendingItems.find(o => o.order_item_id === activeId) : null

    return (
        <DndContext id="planning-board-dnd" onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {children}

            <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                {activeOrder ? (
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 border-l-4 border-l-emerald-500 p-3 rounded-lg shadow-2xl scale-105 rotate-2 cursor-grabbing w-[280px]">
                        <div className="flex justify-between items-start">
                            <div className="font-black text-slate-800 dark:text-slate-100">{activeOrder.detail?.orders?.slip_no}</div>
                        </div>
                        <div className="text-[13px] font-mono font-bold text-emerald-600 mt-1">{activeOrder.detail?.product_pn_raw}</div>
                        <div className="text-sm font-bold mt-2">Qty: {activeOrder.total_requested_qty}</div>
                    </div>
                ) : null}
            </DragOverlay>

            {modalOpen && dropData && (
                <ConfirmModal 
                    data={dropData} 
                    onClose={() => setModalOpen(false)} 
                    onSuccess={() => setModalOpen(false)}
                />
            )}
        </DndContext>
    )
}

function ConfirmModal({ data, onClose, onSuccess }: { data: any, onClose: () => void, onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [molds, setMolds] = useState<any[]>([])
    const [selectedMold, setSelectedMold] = useState('')

    React.useEffect(() => {
        const fetchMolds = async () => {
            try {
                // Fetch molds regardless of product_id for now (Phase B fallback)
                const res = await getProductPhysicalMolds(data.order.detail?.product_id || '')
                setMolds(res)
                if (res.length > 0) setSelectedMold(res[0].id)
            } catch (err) {}
        }
        fetchMolds()
    }, [data.order.detail?.product_id])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        const fd = new FormData(e.target as HTMLFormElement)
        const qty = Number(fd.get('qty'))
        
        try {
            await createProductionPlanAction({
                order_item_id: data.order.order_item_id,
                machine_instance_id: data.machine.id,
                mold_physical_id: selectedMold || null as any, // allow null if not strict
                planned_date: data.dateStr,
                planned_quantity: qty,
                operator_name: fd.get('operator') as string || undefined,
                shift: data.shift,
            })
            onSuccess()
        } catch (err: any) {
            alert(err.message)
        }
        setLoading(false)
    }

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
            <div className="bg-[var(--mcs-surface)] w-full max-w-md rounded-lg shadow-2xl overflow-hidden border border-[var(--mcs-border)]">
                <div className="bg-[var(--mcs-primary-light)] p-4 border-b border-[var(--mcs-primary)]">
                    <h2 className="text-[16px] font-bold text-[var(--mcs-primary-hover)]">⚙️ 計画確認 (Xác nhận xếp lịch)</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm bg-[var(--mcs-surface-2)] p-4 rounded-md border border-[var(--mcs-border)]">
                        <div><span className="text-gray-500 block text-[11px]">設備 (Máy):</span> <span className="font-bold">{data.machine.internal_code}</span></div>
                        <div><span className="text-gray-500 block text-[11px]">日付 (Ngày):</span> <span className="font-bold">{data.shift} | {format(parseISO(data.dateStr), 'MM/dd')}</span></div>
                        <div className="col-span-2 border-t border-[var(--mcs-border)] my-1"></div>
                        <div className="col-span-2"><span className="text-gray-500 block text-[11px]">品番 (Sản phẩm):</span> <span className="font-bold">{data.order.detail?.product_pn_raw}</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-[12px] font-bold mb-1">金型 (Khuôn)</label>
                            <select 
                                value={selectedMold} 
                                onChange={e => setSelectedMold(e.target.value)}
                                className="w-full bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded px-3 py-2 text-sm"
                                required
                            >
                                <option value="">--- Chọn khuôn (Chưa xác định) ---</option>
                                {molds.map(m => (
                                    <option key={m.id} value={m.id}>{m.physical_code} {m.status !== 'ACTIVE' ? '(⚠️ Bảo trì)' : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[12px] font-bold mb-1">計画数 (Kế hoạch Qty)</label>
                            <input name="qty" type="number" defaultValue={data.order.total_requested_qty - data.order.total_planned_qty} max={data.order.total_requested_qty - data.order.total_planned_qty} className="w-full bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded px-3 py-2 text-sm" required />
                        </div>
                        <div>
                            <label className="block text-[12px] font-bold mb-1">担当者 (Operator)</label>
                            <input name="operator" type="text" placeholder="Tên thợ..." className="w-full bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-[var(--mcs-border)]">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded">Hủy</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-bold bg-[var(--mcs-primary)] text-white rounded shadow">{loading ? 'Saving...' : '✅ Xác nhận'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
