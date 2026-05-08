'use client'

import React, { useState } from 'react'
import { Search, Eye, X, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function StockTable({ initialData }: { initialData: any[] }) {
    const [search, setSearch] = useState('')
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
    const [selectedTxns, setSelectedTxns] = useState<any[]>([])
    const [isLoadingModal, setIsLoadingModal] = useState(false)

    const filteredData = initialData.filter(item => {
        if (!search) return true
        const s = search.toLowerCase()
        return item.product_code?.toLowerCase().includes(s) || item.product_name?.toLowerCase().includes(s)
    })

    const handleOpenModal = async (product: any) => {
        setSelectedProduct(product)
        setIsLoadingModal(true)
        setSelectedTxns([])

        const supabase = createClient()
        const { data } = await supabase
            .from('tray_inventory_txn')
            .select('*')
            .eq('product_id', product.product_id)
            .order('txn_date', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(10)
        
        if (data) setSelectedTxns(data)
        setIsLoadingModal(false)
    }

    return (
        <div className="flex flex-col">
            <div className="p-4 border-b border-[var(--mcs-border)] flex justify-between items-center bg-gray-50">
                <div className="relative w-72">
                    <input 
                        type="text"
                        placeholder="Tìm mã / tên khay..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--mcs-border-strong)] rounded focus:border-[var(--mcs-primary)] focus:ring-1 focus:ring-[var(--mcs-primary)]"
                    />
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 bg-[var(--mcs-surface-2)] uppercase border-b border-[var(--mcs-border)]">
                        <tr>
                            <th className="px-4 py-3">品番 (Mã)</th>
                            <th className="px-4 py-3">品名 (Tên Khay)</th>
                            <th className="px-4 py-3 text-right">入庫 (Tổng Nhập)</th>
                            <th className="px-4 py-3 text-right">出庫 (Tổng Xuất)</th>
                            <th className="px-4 py-3 text-right">調整 (Kiểm Kê)</th>
                            <th className="px-4 py-3 text-right text-[var(--mcs-primary)]">現在庫 (Tồn Hiện Tại)</th>
                            <th className="px-4 py-3 text-center">操作 (Thao tác)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-10 text-gray-500">データがありません (Không có dữ liệu)</td>
                            </tr>
                        ) : (
                            filteredData.map(item => (
                                <tr key={item.product_id} className="border-b border-[var(--mcs-border)] hover:bg-blue-50/50 transition-colors">
                                    <td className="px-4 py-3 font-bold text-[var(--mcs-text)]">{item.product_code}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.product_name}</td>
                                    <td className="px-4 py-3 text-right font-mono text-emerald-600">{item.total_in.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right font-mono text-blue-600">{item.total_out.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right font-mono text-amber-600">{item.total_adjust.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-right font-mono font-bold text-lg text-[var(--mcs-primary)] bg-[var(--mcs-primary-light)]/30">
                                        {item.current_stock.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button 
                                            onClick={() => handleOpenModal(item)}
                                            className="px-3 py-1.5 text-xs font-bold text-white bg-[var(--mcs-primary)] hover:bg-[var(--mcs-primary-dark)] rounded shadow-sm flex items-center gap-1 mx-auto"
                                        >
                                            <Eye size={14} /> 詳細 (Chi tiết)
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
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200 p-4">
                    <div className="bg-white w-full max-w-3xl rounded-lg shadow-2xl overflow-hidden border border-[var(--mcs-border)] flex flex-col max-h-[85vh]">
                        <div className="bg-[var(--mcs-primary-light)] p-4 border-b border-[var(--mcs-primary)] flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-[16px] font-bold text-[var(--mcs-primary-hover)]">📦 履歴詳細 (Chi tiết Lịch sử)</h2>
                                <p className="text-xs text-gray-600 mt-1">{selectedProduct.product_code} - {selectedProduct.product_name}</p>
                            </div>
                            <button onClick={() => setSelectedProduct(null)} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto">
                            {isLoadingModal ? (
                                <p className="text-center py-8 text-gray-500">データを読み込んでいます... (Đang tải...)</p>
                            ) : selectedTxns.length === 0 ? (
                                <p className="text-center py-8 text-gray-500">最近の履歴はありません (Không có lịch sử giao dịch gần đây)</p>
                            ) : (
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase border-b">
                                        <tr>
                                            <th className="pb-2">Ngày/Giờ</th>
                                            <th className="pb-2">Loại</th>
                                            <th className="pb-2 text-right">Số lượng</th>
                                            <th className="pb-2 pl-4">Ghi chú / Số Lô</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {selectedTxns.map(t => (
                                            <tr key={t.id} className="hover:bg-gray-50">
                                                <td className="py-3 text-xs text-gray-500 whitespace-nowrap">
                                                    {new Date(t.created_at).toLocaleString('vi-VN')}
                                                </td>
                                                <td className="py-3">
                                                    {t.txn_type === 'IN' && <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded"><ArrowDownRight size={12}/> NHẬP</span>}
                                                    {t.txn_type === 'OUT' && <span className="inline-flex items-center gap-1 text-blue-600 font-bold text-xs bg-blue-50 px-2 py-0.5 rounded"><ArrowUpRight size={12}/> XUẤT</span>}
                                                    {t.txn_type === 'ADJUST' && <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded"><RefreshCcw size={12}/> Đ.CHỈNH</span>}
                                                </td>
                                                <td className="py-3 text-right font-mono font-bold">
                                                    {t.txn_type === 'OUT' ? '-' : (t.txn_type === 'ADJUST' && t.quantity > 0 ? '+' : '')}{t.quantity}
                                                </td>
                                                <td className="py-3 pl-4 text-xs text-gray-600">
                                                    <div className="max-w-[200px] truncate" title={t.notes}>{t.notes}</div>
                                                    {t.lot_no && <div className="text-[10px] text-[var(--mcs-primary)] mt-1">Lot: {t.lot_no}</div>}
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
