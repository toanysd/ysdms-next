import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { History, ArrowLeft } from 'lucide-react'

export default async function InventoryHistoryPage() {
    const supabase = await createClient()

    // Lịch sử giao dịch, table: inventory_txn
    // Trong schema hiện tại chưa map đúng, fetch trực tiếp.
    const { data: txns } = await supabase
        .from('inventory_txn')
        .select(`
      id, txn_type, change_kg, lot_no_material, transaction_date, notes, created_at,
      plastic_master (code, material, color_name)
    `)
        .order('created_at', { ascending: false })
        .limit(500) // 500 records gần nhất để tránh lag

    return (
        <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm m-2">
            <div className="h-[48px] bg-teal-50 px-4 flex items-center gap-2 border-b border-teal-200 shrink-0">
                <Link href="/inventory" className="text-teal-700 hover:text-teal-900 transition-colors mr-2">
                    <ArrowLeft size={18} />
                </Link>
                <History size={20} className="text-teal-700" />
                <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
                    <span className="ja">トランザクション履歴 (Tracing History)</span>
                    <span className="vi font-normal text-teal-700 mt-[-2px] text-xs">Lịch sử Giao dịch Xuất Nhập Nhựa (500 GD)</span>
                </h2>
            </div>

            <div className="flex-1 overflow-auto bg-white">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_var(--mcs-border)] text-xs text-slate-500 whitespace-nowrap">
                        <tr>
                            <th className="p-3 font-bold w-[120px]">
                                <span className="ja">Ngày giao dịch</span>
                            </th>
                            <th className="p-3 font-bold w-[100px]">
                                <span className="ja">Loại (Type)</span>
                            </th>
                            <th className="p-3 font-bold w-[200px]">
                                <span className="ja">Mã Nhựa (Plastic)</span>
                            </th>
                            <th className="p-3 font-bold w-[120px] text-right">
                                <span className="ja">Số lượng (Kg)</span>
                            </th>
                            <th className="p-3 font-bold w-[150px]">
                                <span className="ja">Mã Lô (Lot/ロット)</span>
                            </th>
                            <th className="p-3 font-bold">
                                <span className="ja">Ghi chú</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px]">
                        {txns?.map((item: any) => (
                            <tr key={item.id} className="border-b border-[#e0e0e0] hover:bg-slate-50 transition-colors">
                                <td className="p-3 font-mono text-slate-600">{item.transaction_date ? item.transaction_date.substring(0, 10) : item.created_at.substring(0, 10)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.txn_type === 'IN' ? 'bg-green-100 text-green-700 border border-green-300' :
                                            item.txn_type === 'OUT' ? 'bg-orange-100 text-orange-700 border border-orange-300' :
                                                'bg-slate-100 text-slate-700 border border-slate-300'
                                        }`}>
                                        {item.txn_type}
                                    </span>
                                </td>
                                <td className="p-3 font-bold text-slate-700">{item.plastic_master?.code}</td>
                                <td className={`p-3 font-mono font-bold text-right ${item.txn_type === 'IN' ? 'text-green-600' : 'text-orange-600'}`}>
                                    {item.txn_type === 'IN' ? '+' : '-'}{item.change_kg?.toLocaleString()}
                                </td>
                                <td className="p-3 font-mono text-slate-500">{item.lot_no_material || '-'}</td>
                                <td className="p-3 text-slate-500">{item.notes || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!txns || txns.length === 0) && (
                    <div className="p-8 text-center text-slate-400 italic">
                        Chưa có giao dịch kho nào.
                    </div>
                )}
            </div>
        </div>
    )
}
