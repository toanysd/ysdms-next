'use client'

import React, { useState } from 'react'
import { format, parseISO } from 'date-fns'

export default function PendingOrderPanel({ 
    pendingItems, 
    selectedOrders, 
    selectedCell,
    machineCode,
    onToggle, 
    onConfirm, 
    onClose,
    isSubmitting
}: { 
    pendingItems: any[], 
    selectedOrders: string[], 
    selectedCell: any,
    machineCode?: string,
    onToggle: (id: string) => void, 
    onConfirm: () => void, 
    onClose: () => void,
    isSubmitting: boolean
}) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredItems = pendingItems.filter(item => {
        const search = searchTerm.toLowerCase()
        const slipNo = (item.detail?.orders?.slip_no || '').toLowerCase()
        const pnRaw = (item.detail?.product_pn_raw || '').toLowerCase()
        return slipNo.includes(search) || pnRaw.includes(search)
    })

    const headerText = selectedCell ? `${machineCode} (${format(parseISO(selectedCell.dateStr), 'MM/dd')}) への計画追加` : '未計画注文'

    return (
        <div className="fixed top-0 right-0 h-screen w-[360px] bg-[var(--mcs-surface)] border-l border-[var(--mcs-border-strong)] shadow-[-4px_0_24px_-10px_rgba(0,0,0,0.1)] z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex flex-col p-3 border-b border-[var(--mcs-border)] bg-[var(--mcs-primary-light)] shrink-0 gap-2">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-[13px] font-bold text-[var(--mcs-primary-hover)]">{headerText}</h2>
                        <span className="text-[11px] text-[var(--mcs-primary)] flex items-center gap-1">
                            未計画注文: <span className="bg-white font-bold px-1.5 rounded-full border border-[var(--mcs-primary)]">{pendingItems.length}</span>
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 p-1 hover:bg-white rounded transition-colors shrink-0">
                        ✖
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="p-3 border-b border-[var(--mcs-border)] bg-[var(--mcs-surface-2)] shrink-0">
                <input 
                    type="text" 
                    placeholder="Tìm mã đơn, tên sản phẩm..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-[var(--mcs-border)] rounded shadow-sm focus:ring-1 focus:ring-[var(--mcs-primary)] outline-none"
                />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredItems.length === 0 ? (
                    <div className="text-center text-gray-500 text-sm mt-10">Không tìm thấy đơn hàng.</div>
                ) : (
                    filteredItems.map(item => {
                        const isSelected = selectedOrders.includes(item.order_item_id)
                        const slipNo = item.detail?.orders?.slip_no
                        const pnRaw = item.detail?.product_pn_raw
                        const qty = item.total_requested_qty - item.total_planned_qty

                        return (
                            <div 
                                key={item.order_item_id}
                                onClick={() => onToggle(item.order_item_id)}
                                className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-yellow-50 border-yellow-400' : 'bg-white border-[var(--mcs-border)] hover:border-[var(--mcs-primary-light)]'}`}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={isSelected}
                                    onChange={() => {}} // handled by parent div click
                                    className="mt-1 w-4 h-4 text-[var(--mcs-primary)] rounded border-gray-300 focus:ring-[var(--mcs-primary)]"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <div className="font-bold text-sm text-[var(--mcs-text)] truncate" title={slipNo}>{slipNo}</div>
                                        <div className="text-[11px] font-mono text-gray-500 bg-gray-100 px-1 rounded whitespace-nowrap ml-2">Qty: {qty.toLocaleString()}</div>
                                    </div>
                                    <div className="text-[12px] font-bold text-[var(--mcs-primary)] truncate" title={pnRaw}>{pnRaw}</div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--mcs-border-strong)] bg-white shrink-0 flex items-center justify-between">
                <div className="text-sm font-bold text-gray-700">
                    <span className="text-yellow-600">{selectedOrders.length}</span> 件選択中
                </div>
                <button 
                    onClick={onConfirm}
                    disabled={selectedOrders.length === 0 || isSubmitting}
                    className={`px-4 py-2 rounded font-bold text-sm shadow-sm transition-colors ${selectedOrders.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[var(--mcs-primary)] text-white hover:bg-[var(--mcs-primary-hover)]'}`}
                >
                    {isSubmitting ? '処理中...' : '確定選択 (Xác nhận)'}
                </button>
            </div>
        </div>
    )
}
