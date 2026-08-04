'use client'

import React, { useState } from 'react'
import { Search, Eye, X, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getRecentTrayTxns } from '@/app/actions/inventory'

export default function StockTable({ initialData }: { initialData: any[] }) {
    const t = useTranslations()
    const [search, setSearch] = useState('')
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
    const [selectedTxns, setSelectedTxns] = useState<any[]>([])
    const [isLoadingModal, setIsLoadingModal] = useState(false)

    const filteredData = initialData.filter(item => {
        if (!search) return true
        const s = search.toLowerCase()
        return item.product_code?.toLowerCase().includes(s) || item.product_name?.toLowerCase().includes(s) || item.customer_code?.toLowerCase().includes(s)
    })

    const handleOpenModal = async (product: any) => {
        setSelectedProduct(product)
        setIsLoadingModal(true)
        setSelectedTxns([])

        const result = await getRecentTrayTxns(product.product_id)
        if (result.success && result.data) {
            setSelectedTxns(result.data)
        }
        setIsLoadingModal(false)
    }

    return (
        <div className="flex flex-col">
            <div className="p-4 border-b border-[var(--border-default)] flex justify-between items-center bg-[var(--bg-surface-2)]">
                <div className="relative w-72">
                    <input 
                        type="text"
                        placeholder={t('Inventory.searchPlaceholder')}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="form-input form-input-search w-full"
                    />
                    <Search size={16} className="absolute left-3 top-2.5 text-[var(--text-muted)]" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>{t('Inventory.productCode')}</th>
                            <th>{t('Inventory.productName')}</th>
                            <th>{t('Inventory.customer')}</th>
                            <th className="text-right">{t('Inventory.totalIn')}</th>
                            <th className="text-right">{t('Inventory.totalOut')}</th>
                            <th className="text-right">{t('Inventory.totalAdjust')}</th>
                            <th className="text-right text-[var(--accent)]">{t('Inventory.currentStock')}</th>
                            <th className="text-center">{t('Common.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-10 text-[var(--text-muted)]">{t('Common.noData')}</td>
                            </tr>
                        ) : (
                            filteredData.map(item => (
                                <tr key={item.product_id}>
                                    <td className="font-mono font-bold text-[13px] text-[var(--accent)]">{item.product_code}</td>
                                    <td className="font-semibold text-[var(--text-primary)]">{item.product_name}</td>
                                    <td>
                                        {item.customer_code && (
                                            <span className="badge badge--info font-mono font-bold">
                                                {item.customer_code}
                                            </span>
                                        )}
                                    </td>
                                    <td className="text-right font-mono font-bold text-[13px] text-[var(--status-success)]">{item.total_in.toLocaleString()}</td>
                                    <td className="text-right font-mono font-bold text-[13px] text-[var(--status-info)]">{item.total_out.toLocaleString()}</td>
                                    <td className="text-right font-mono font-bold text-[13px] text-[var(--status-warning)]">{item.total_adjust.toLocaleString()}</td>
                                    <td className="text-right font-mono font-bold text-[14px] text-[var(--accent)] bg-[var(--tint-teal-bg)]">
                                        {item.current_stock.toLocaleString()}
                                    </td>
                                    <td className="text-center">
                                        <button 
                                            onClick={() => handleOpenModal(item)}
                                            className="btn btn-secondary text-xs font-bold mx-auto"
                                        >
                                            <Eye size={14} /> {t('Common.details')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Chi Tiết Lịch Sử */}
            {selectedProduct && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[var(--bg-surface)] w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden border border-[var(--border-default)] flex flex-col max-h-[85vh]">
                        <div className="bg-[var(--bg-surface-2)] p-4 border-b border-[var(--border-default)] flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-[16px] font-bold text-[var(--text-primary)]">📦 {t('Inventory.historyDetail')}</h2>
                                <p className="text-xs font-mono font-bold text-[var(--accent)] mt-1">{selectedProduct.product_code} - {selectedProduct.product_name}</p>
                            </div>
                            <button onClick={() => setSelectedProduct(null)} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                                <X size={20} className="text-[var(--text-muted)]" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {isLoadingModal ? (
                                <p className="text-center py-8 text-[var(--text-muted)]">{t('Common.loading')}</p>
                            ) : selectedTxns.length === 0 ? (
                                <p className="text-center py-8 text-[var(--text-muted)]">{t('Common.noData')}</p>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>{t('Inventory.dateTime')}</th>
                                            <th>{t('Inventory.type')}</th>
                                            <th className="text-right">{t('Inventory.quantity')}</th>
                                            <th className="pl-4">{t('Inventory.notesLot')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedTxns.map(tItem => (
                                            <tr key={tItem.id}>
                                                <td className="text-xs font-mono text-[var(--text-muted)] whitespace-nowrap">
                                                    {new Date(tItem.created_at).toLocaleString('ja-JP')}
                                                </td>
                                                <td>
                                                    {tItem.txn_type === 'IN' && <span className="badge badge--success font-mono font-bold text-xs"><ArrowDownRight size={12}/> IN</span>}
                                                    {tItem.txn_type === 'OUT' && <span className="badge badge--info font-mono font-bold text-xs"><ArrowUpRight size={12}/> OUT</span>}
                                                    {tItem.txn_type === 'ADJUST' && <span className="badge badge--warning font-mono font-bold text-xs"><RefreshCcw size={12}/> ADJUST</span>}
                                                </td>
                                                <td className="text-right font-mono font-bold text-[13px]">
                                                    {tItem.txn_type === 'OUT' ? '-' : (tItem.txn_type === 'ADJUST' && tItem.quantity > 0 ? '+' : '')}{tItem.quantity}
                                                </td>
                                                <td className="pl-4 text-xs text-[var(--text-primary)]">
                                                    <div className="max-w-[200px] truncate" title={tItem.notes}>{tItem.notes}</div>
                                                    {tItem.lot_no && <div className="text-[11px] font-mono font-bold text-[var(--accent)] mt-1">Lot: {tItem.lot_no}</div>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

