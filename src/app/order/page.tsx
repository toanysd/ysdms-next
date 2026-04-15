import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Search, FileText } from 'lucide-react'
import { OrderWithCustomer } from '@/types/orders'

export default async function OrderPage() {
    const supabase = await createClient()

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
      *,
      customers (customer_code, delivery_name)
    `)
        .order('created_at', { ascending: false })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft': return <span className="px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-300 rounded text-[10px] font-bold">Draft</span>
            case 'pending': return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded text-[10px] font-bold">Pending</span>
            case 'in_production': return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-300 rounded text-[10px] font-bold">In-Prod</span>
            case 'shipped': return <span className="px-2 py-0.5 bg-green-100 text-green-700 border border-green-300 rounded text-[10px] font-bold">Shipped</span>
            default: return <span className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-300 rounded text-[10px] font-bold uppercase">{status}</span>
        }
    }

    return (
        <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm m-2">
            <div className="h-[48px] bg-teal-50 px-4 flex items-center justify-between border-b border-teal-200 shrink-0">
                <div className="flex items-center gap-2">
                    <FileText size={20} className="text-teal-700" />
                    <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
                        <span className="ja">指示書・受注管理 (Order Management)</span>
                        <span className="vi font-normal text-teal-700 mt-[-2px] text-xs">Quản lý Đơn hàng / Chỉ thị SX</span>
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <Search className="absolute left-2 top-1.5 text-teal-400" size={16} />
                        <input
                            type="text"
                            disabled
                            placeholder="Sắp ra mắt..."
                            title="Tính năng Search đang được nâng cấp"
                            className="h-[30px] w-[200px] pl-8 text-xs border border-teal-200 bg-gray-50 text-gray-400 rounded outline-none cursor-not-allowed"
                        />
                    </div>
                    <Link href="/order/new">
                        <button className="bg-teal-700 hover:bg-teal-800 text-white h-[30px] px-3 flex items-center gap-1 text-xs rounded transition-colors shadow-sm font-bold">
                            <Plus size={16} />
                            <div className="flex flex-col items-center leading-none mt-1">
                                <span className="ja">新規作成 (Tạo Đơn)</span>
                            </div>
                        </button>
                    </Link>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_var(--mcs-border)] text-xs text-slate-500 whitespace-nowrap">
                        <tr>
                            <th className="p-3 font-bold w-[120px]">
                                <span className="ja">Mã LOT / 伝票番号</span>
                            </th>
                            <th className="p-3 font-bold w-[100px]">
                                <span className="ja">Ngày(発注日)</span>
                            </th>
                            <th className="p-3 font-bold w-[150px]">
                                <span className="ja">Khách hàng</span>
                            </th>
                            <th className="p-3 font-bold w-[100px]">
                                <span className="ja">Phân loại</span>
                            </th>
                            <th className="p-3 font-bold w-[120px] text-center">
                                <span className="ja">Trạng thái</span>
                            </th>
                            <th className="p-3 font-bold">
                                <span className="ja">PIC(担当)</span>
                            </th>
                            <th className="p-3 font-bold">
                                <span className="ja">Ghi chú(事項)</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px]">
                        {orders?.map((item: OrderWithCustomer) => (
                            <tr key={item.id} className="border-b border-[#e0e0e0] hover:bg-teal-50/30 group transition-colors cursor-pointer">
                                <td className="p-3 font-mono font-bold text-teal-800 text-sm">{item.slip_no || '-'}</td>
                                <td className="p-3 text-slate-600 font-mono">{item.order_date.substring(0, 10)}</td>
                                <td className="p-3 font-bold text-slate-700">{item.customers?.customer_code} {item.customers?.delivery_name ? `(${item.customers.delivery_name})` : ''}</td>
                                <td className="p-3 capitalize">{item.order_type}</td>
                                <td className="p-3 text-center">{getStatusBadge(item.status)}</td>
                                <td className="p-3">{item.handler_name || '-'}</td>
                                <td className="p-3 text-slate-500 overflow-hidden text-ellipsis max-w-[200px] whitespace-nowrap">{item.internal_notes || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!orders || orders.length === 0) && (
                    <div className="p-8 text-center text-slate-400 italic">
                        Chưa có đơn hàng nào trong hệ thống.
                    </div>
                )}
            </div>
        </div>
    )
}
