'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { OrderItemsGrid, GridRow } from './OrderItemsGrid'
import { createOrderWithItemsAction } from '@/app/actions/order'
import { OrderInsert, OrderItemInsert } from '@/types/orders'

interface CustomerLite {
    id: string
    code: string
    name_jp: string | null
}

interface OrderFormClientProps {
    customers: CustomerLite[]
}

export function OrderFormClient({ customers }: OrderFormClientProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorObj, setErrorObj] = useState<string | null>(null)

    // Header State
    const [slipNo, setSlipNo] = useState('')
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
    const [orderType, setOrderType] = useState<'molding' | 'outsource' | 'prototype'>('molding')
    const [customerId, setCustomerId] = useState('')
    const [deliverySite, setDeliverySite] = useState('')
    const [requesterCode, setRequesterCode] = useState('')
    const [handlerName, setHandlerName] = useState('')
    const [internalNotes, setInternalNotes] = useState('')

    // Items State
    const [items, setItems] = useState<GridRow[]>([])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!customerId) return alert('Vui lòng chọn khách hàng')
        if (items.length === 0) return alert('Đơn hàng phải có ít nhất 1 mặt hàng (dòng chi tiết)')

        // Validate items
        for (const i of items) {
            if (!i.product_pn_raw) return alert(`Dòng ${i.line_no} bị thiếu Product Code`)
            if (!i.quantity || i.quantity <= 0) return alert(`Dòng ${i.line_no} phải có số lượng lớn hơn 0`)
        }

        try {
            setIsSubmitting(true)
            setErrorObj(null)

            const header: OrderInsert = {
                slip_no: slipNo || null,
                order_date: orderDate,
                order_type: orderType,
                status: 'draft',
                customer_id: customerId,
                delivery_site_code: deliverySite || null,
                delivery_address: null,
                requester_code: requesterCode || null,
                handler_name: handlerName || null,
                internal_notes: internalNotes || null,
                approval_status: 'pending',
                approved_by: null,
                approved_at: null,
                created_by: null
            }

            const itemInserts: Omit<OrderItemInsert, 'order_id'>[] = items.map(i => ({
                line_no: i.line_no,
                product_pn_raw: i.product_pn_raw,
                product_id: i.product_id,
                request_no: i.request_no || null,
                quantity: i.quantity,
                packing_qty: i.packing_qty,
                packing_boxes: i.packing_boxes,
                delivery_date: i.delivery_date || null,
                delivery_date_end: i.delivery_date_end || null,
                process_notes: i.process_notes || null,
                currency: 'JPY',
                unit_price: null,
                mold_id: null
            }))

            await createOrderWithItemsAction(header, itemInserts)

            router.push('/order')
            router.refresh()
        } catch (err: any) {
            console.error(err)
            setErrorObj(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-[var(--mcs-surface)] flex-1 overflow-hidden">
            <div className="h-[48px] bg-teal-50 px-4 flex items-center justify-between border-b border-teal-200 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <Link href="/order" className="text-teal-700 hover:text-teal-900 transition-colors mr-2">
                        <ArrowLeft size={18} />
                    </Link>
                    <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
                        <span className="ja">新規指示書作成 (Tạo Chỉ thị / Đơn Hàng)</span>
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    {errorObj && <span className="text-red-500 text-xs font-bold mr-4">{errorObj}</span>}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-[30px] px-6 rounded bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                        Lưu Toàn Bộ Đơn
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50/50 p-4">
                <div className="max-w-[1400px] mx-auto space-y-4">

                    {/* Header Card */}
                    <div className="bg-white border border-teal-200 shadow-sm rounded-lg p-4">
                        <h3 className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2 border-b border-teal-100 pb-2">
                            🏷️ Thông Tin Chung (Header)
                        </h3>

                        <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-1 flex flex-col gap-1">
                                <label className="text-[12px] font-bold text-teal-900 shadow-black">伝票/LOT No.</label>
                                <input value={slipNo} onChange={e => setSlipNo(e.target.value)} type="text" className="w-full h-[34px] font-mono text-sm border-teal-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded px-2" placeholder="Ví dụ: 263090" />
                            </div>

                            <div className="col-span-1 flex flex-col gap-1">
                                <label className="text-[12px] font-bold text-teal-900">Ngày phát hành (発注日) <span className="text-red-500">*</span></label>
                                <input value={orderDate} onChange={e => setOrderDate(e.target.value)} type="date" required className="w-full h-[34px] text-sm border-teal-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded px-2" />
                            </div>

                            <div className="col-span-1 flex flex-col gap-1">
                                <label className="text-[12px] font-bold text-teal-900">Loại đơn (Order Type) <span className="text-red-500">*</span></label>
                                <select value={orderType} onChange={e => setOrderType(e.target.value as any)} className="w-full h-[34px] text-[13px] border-teal-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded px-2 bg-white cursor-pointer hover:bg-gray-50">
                                    <option value="molding">Molding (Đúc khuôn)</option>
                                    <option value="outsource">Outsource (Thuê ngoài)</option>
                                    <option value="prototype">Prototype (Mẫu thử)</option>
                                </select>
                            </div>

                            <div className="col-span-1 flex flex-col gap-1">
                                <label className="text-[12px] font-bold text-teal-900">Khách Hàng (Customer) <span className="text-red-500">*</span></label>
                                <select value={customerId} onChange={e => setCustomerId(e.target.value)} required className="w-full h-[34px] font-mono text-sm border-teal-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded px-2 bg-white cursor-pointer hover:bg-gray-50">
                                    <option value="">-- Chọn Khách Hàng --</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.code} - {c.name_jp || 'No Name'}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-1 flex flex-col gap-1">
                                <label className="text-[12px] font-bold text-teal-900">Mã chi nhánh nhận (納品先)</label>
                                <input value={deliverySite} onChange={e => setDeliverySite(e.target.value)} type="text" className="w-full h-[34px] font-mono text-sm border-teal-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded px-2" placeholder="Ví dụ: KSP3" />
                            </div>

                            <div className="col-span-1 flex flex-col gap-1">
                                <label className="text-[12px] font-bold text-teal-900">Yêu cầu từ (依頼元)</label>
                                <input value={requesterCode} onChange={e => setRequesterCode(e.target.value)} type="text" className="w-full h-[34px] font-mono text-sm border-teal-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded px-2" placeholder="Ví dụ: KBY01" />
                            </div>

                            <div className="col-span-1 flex flex-col gap-1">
                                <label className="text-[12px] font-bold text-teal-900">PIC Nội bộ (担当)</label>
                                <input value={handlerName} onChange={e => setHandlerName(e.target.value)} type="text" className="w-full h-[34px] text-sm border-teal-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded px-2" placeholder="Ví dụ: 桜井" />
                            </div>

                            <div className="col-span-3 flex flex-col gap-1">
                                <label className="text-[12px] font-bold text-teal-900">Ghi chú chung toàn phiếu (注意事項)</label>
                                <input value={internalNotes} onChange={e => setInternalNotes(e.target.value)} type="text" className="w-full h-[34px] text-sm border-teal-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded px-2" placeholder="Nhập ghi chú chung..." />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow-sm p-4 rounded-lg border border-teal-200 mt-4">
                        <OrderItemsGrid items={items} onChange={setItems} />
                    </div>

                </div>
            </div>
        </form>
    )
}
