'use client'

import React, { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { useTranslations } from 'next-intl'

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
    const t = useTranslations('Planning.PendingOrders')
    const [searchTerm, setSearchTerm] = useState('')

    const filteredItems = pendingItems.filter(item => {
        const search = searchTerm.toLowerCase()
        const slipNo = (item.detail?.orders?.slip_no || '').toLowerCase()
        const pnRaw = (item.detail?.product_pn_raw || '').toLowerCase()
        return slipNo.includes(search) || pnRaw.includes(search)
    })

    const headerText = selectedCell 
        ? t('addPlanToMachine', { machine: machineCode || '', date: format(parseISO(selectedCell.dateStr), 'MM/dd') }) 
        : t('unplannedOrders')

    return (
        <div className="fixed top-0 right-0 h-screen w-[360px] bg-[var(--bg-surface)] border-l border-[var(--border-default)] shadow-[-4px_0_24px_-10px_rgba(0,0,0,0.1)] z-50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex flex-col p-3 border-b border-[var(--border-default)] bg-[var(--tint-teal-bg)] shrink-0 gap-2">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-[13px] font-bold text-[var(--accent)]">{headerText}</h2>
                        <span className="text-[11px] text-[var(--text-muted)] flex items-center gap-1 font-semibold">
                            {t('unplannedOrders')}: <span className="bg-[var(--bg-surface)] font-bold font-mono px-1.5 rounded-full border border-[var(--accent)] text-[var(--accent)]">{pendingItems.length}</span>
                        </span>
                    </div>
                    <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 hover:bg-[var(--bg-surface)] rounded transition-colors shrink-0">
                        ✖
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="p-3 border-b border-[var(--border-default)] bg-[var(--bg-surface-2)] shrink-0">
                <input 
                    type="text" 
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-input w-full text-sm shadow-sm"
                />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredItems.length === 0 ? (
                    <div className="text-center text-[var(--text-muted)] text-sm mt-10">{t('noOrdersFound')}</div>
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
                                className={`flex items-start gap-3 p-3 border rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-[var(--tint-amber-bg)] border-[var(--status-warning)]' : 'bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--accent)]'}`}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={isSelected}
                                    onChange={() => {}} // handled by parent div click
                                    className="mt-1 w-4 h-4 text-[var(--accent)] rounded border-[var(--border-default)] focus:ring-[var(--accent)]"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <div className="font-bold text-[14px] text-[var(--accent)] font-mono truncate" title={pnRaw}>{pnRaw}</div>
                                        <div className="text-[11px] font-mono font-bold text-[var(--text-primary)] bg-[var(--bg-surface-2)] px-1.5 py-0.5 rounded whitespace-nowrap ml-2 border border-[var(--border-default)]">Qty: {qty.toLocaleString()}</div>
                                    </div>
                                    <div className="text-[11px] font-mono text-[var(--text-muted)] truncate opacity-80" title={slipNo}>{slipNo}</div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border-default)] bg-[var(--bg-surface)] shrink-0 flex items-center justify-between">
                <div className="text-sm font-bold text-[var(--text-primary)]">
                    <span className="font-mono text-base" style={{ color: 'var(--status-warning)' }}>{selectedOrders.length}</span> {t('selectedCount')}
                </div>
                <button 
                    onClick={onConfirm}
                    disabled={selectedOrders.length === 0 || isSubmitting}
                    className={`btn ${selectedOrders.length === 0 ? 'btn-secondary text-[var(--text-muted)] cursor-not-allowed' : 'btn-primary'}`}
                >
                    {isSubmitting ? t('processing') : t('confirmSelection')}
                </button>
            </div>
        </div>
    )
}

