import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, RefreshCcw } from 'lucide-react'

export default async function TxnHistoryTab({ currentParams }: { currentParams: { tab?: string, txnType?: string } }) {
    const supabase = await createClient()
    
    // Build query
    let query = supabase
        .from('tray_inventory_txn')
        .select(`
            id, txn_type, quantity, txn_date, operator_name, notes, lot_no, created_at,
            product_master!inner(code, name)
        `)
        .order('txn_date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100)
    
    if (currentParams.txnType && currentParams.txnType !== 'ALL') {
        query = query.eq('txn_type', currentParams.txnType)
    }

    const { data: txns, error } = await query

    return (
        <div className="flex flex-col">
            <div className="p-4 border-b border-[var(--mcs-border)] bg-[var(--mcs-surface-2)] flex justify-between items-center">
                <div className="flex gap-2">
                    <Link href="/production/inventory?tab=history&txnType=ALL" className={`px-4 py-1.5 text-sm font-bold rounded shadow-sm transition-colors ${(!currentParams.txnType || currentParams.txnType === 'ALL') ? 'bg-gray-700 text-white' : 'bg-white border border-[var(--mcs-border)] text-gray-600 hover:bg-gray-50'}`}>
                        Tất cả (All)
                    </Link>
                    <Link href="/production/inventory?tab=history&txnType=IN" className={`px-4 py-1.5 text-sm font-bold rounded shadow-sm transition-colors ${currentParams.txnType === 'IN' ? 'bg-emerald-500 text-white' : 'bg-white border border-[var(--mcs-border)] text-gray-600 hover:bg-gray-50'}`}>
                        Nhập kho (IN)
                    </Link>
                    <Link href="/production/inventory?tab=history&txnType=OUT" className={`px-4 py-1.5 text-sm font-bold rounded shadow-sm transition-colors ${currentParams.txnType === 'OUT' ? 'bg-blue-500 text-white' : 'bg-white border border-[var(--mcs-border)] text-gray-600 hover:bg-gray-50'}`}>
                        Xuất kho (OUT)
                    </Link>
                    <Link href="/production/inventory?tab=history&txnType=ADJUST" className={`px-4 py-1.5 text-sm font-bold rounded shadow-sm transition-colors ${currentParams.txnType === 'ADJUST' ? 'bg-amber-500 text-white' : 'bg-white border border-[var(--mcs-border)] text-gray-600 hover:bg-gray-50'}`}>
                        Kiểm kê (ADJ)
                    </Link>
                </div>
                <div className="text-sm text-[var(--mcs-text-muted)]">Hiển thị 100 giao dịch gần nhất</div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-[var(--mcs-text)]">
                    <thead className="text-xs text-[var(--mcs-text-muted)] bg-gray-50 uppercase border-b border-[var(--mcs-border)]">
                        <tr>
                            <th className="px-4 py-3">Ngày/Giờ</th>
                            <th className="px-4 py-3">Loại Giao Dịch</th>
                            <th className="px-4 py-3">Mã Khay</th>
                            <th className="px-4 py-3 text-right">Số lượng</th>
                            <th className="px-4 py-3">Người thao tác</th>
                            <th className="px-4 py-3">Ghi chú / Số Lô</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--mcs-border)]">
                        {txns?.map(t => {
                            const prod = t.product_master as any
                            return (
                                <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                        {new Date(t.created_at).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="px-4 py-3">
                                        {t.txn_type === 'IN' && <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100"><ArrowDownRight size={12}/> NHẬP (IN)</span>}
                                        {t.txn_type === 'OUT' && <span className="inline-flex items-center gap-1 text-blue-600 font-bold text-xs bg-blue-50 px-2 py-0.5 rounded border border-blue-100"><ArrowUpRight size={12}/> XUẤT (OUT)</span>}
                                        {t.txn_type === 'ADJUST' && <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-100"><RefreshCcw size={12}/> Đ.CHỈNH (ADJ)</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-[var(--mcs-text)]">{prod.code}</div>
                                        <div className="text-xs text-gray-500 max-w-[200px] truncate" title={prod.name}>{prod.name}</div>
                                    </td>
                                    <td className={`px-4 py-3 text-right font-mono font-bold text-base ${t.txn_type === 'OUT' ? 'text-blue-600' : t.txn_type === 'IN' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {t.txn_type === 'OUT' ? '-' : (t.txn_type === 'ADJUST' && t.quantity > 0 ? '+' : '')}{t.quantity}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-700">
                                        {t.operator_name || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-600">
                                        <div className="line-clamp-2" title={t.notes || ''}>{t.notes || '-'}</div>
                                        {t.lot_no && <div className="text-[10px] font-mono text-[var(--mcs-primary)] mt-1 bg-[var(--mcs-primary-light)]/30 inline-block px-1 rounded">Lot: {t.lot_no}</div>}
                                    </td>
                                </tr>
                            )
                        })}
                        {(!txns || txns.length === 0) && (
                            <tr><td colSpan={6} className="px-4 py-10 text-center text-[var(--mcs-text-muted)]">Không có giao dịch nào phù hợp với bộ lọc.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
