import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Search, FileText } from 'lucide-react'
import { OrderWithCustomer } from '@/types/orders'
import { OrderListActions } from '@/components/order/OrderListActions'

export const dynamic = 'force-dynamic';

export default async function OrderPage() {
    const supabase = await createClient()

    const { data: orders, error } = await supabase
        .from('orders')
        .select(`
      *,
      customers (customer_code, delivery_name),
      order_items (
          id,
          product_pn_raw,
          delivery_date,
          delivery_date_end,
          product_master (
              code,
              name,
              customer_code,
              product_mold_map (
                  mold_design_revision (
                      mold_physical ( physical_code )
                  )
              )
          )
      )
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
                        <span className="ja">指示書・受注管理 [SYNCED]</span>
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
                            <th className="p-3 font-bold w-[110px]">
                                <span className="ja">伝票番号 (Mã LOT)</span>
                            </th>
                            <th className="p-3 font-bold w-[100px]">
                                <span className="ja">発注日 (Ngày Đặt)</span>
                            </th>
                            <th className="p-3 font-bold w-[140px]">
                                <span className="ja">得意先 (Khách hàng)</span>
                            </th>
                            <th className="p-3 font-bold w-[180px]">
                                <span className="ja">品番 (Mã khay)</span>
                            </th>
                            <th className="p-3 font-bold w-[100px]">
                                <span className="ja">金型 (Mã khuôn)</span>
                            </th>
                            <th className="p-3 font-bold w-[80px] text-center border-l border-gray-200">
                                <span className="ja text-[11px]">出荷日</span>
                            </th>
                            <th className="p-3 font-bold w-[80px] text-center border-r border-gray-200">
                                <span className="ja text-[11px]">着日</span>
                            </th>
                            <th className="p-3 font-bold w-[100px] text-center">
                                <span className="ja">状態 (Status)</span>
                            </th>
                            <th className="p-3 font-bold w-[80px]">
                                <span className="ja">担当 (PIC)</span>
                            </th>
                            <th className="p-3 font-bold">
                                <span className="ja">事項 (Ghi chú)</span>
                            </th>
                            <th className="p-3 font-bold text-center w-[80px]">
                                <span className="ja">操作 (Xử lý)</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px]">
                        {orders?.map((item: any) => (
                            <tr key={item.id} className="border-b border-[#e0e0e0] hover:bg-teal-50/30 group transition-colors cursor-pointer">
                                <td className="p-3 font-mono font-bold text-teal-800 text-[13px] align-top relative">
                                    {item.order_type === 'outsource' && <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-bl" title="Outsource"></div>}
                                    {item.slip_no || '-'}
                                </td>
                                <td className="p-3 text-slate-600 font-mono align-top text-[12px]">{item.order_date.substring(0, 10).replace(/-/g, '/')}</td>
                                <td className="p-3 font-bold text-slate-700 align-top text-[12px] break-words">{item.customers?.customer_code} {item.customers?.delivery_name ? <span className="block text-[10px] text-gray-500 italic mt-0.5">{item.customers.delivery_name}</span> : ''}</td>

                                <td className="p-0 border-l border-gray-50 align-top">
                                    {item.order_items?.map((oi: any) => {
                                        const pm = oi.product_master;
                                        const mainText = pm?.customer_code || pm?.name || pm?.code || oi.product_pn_raw || '-';
                                        
                                        const subTextParts = [];
                                        if (pm?.customer_code && pm.name && pm.name !== pm.customer_code) subTextParts.push(pm.name);
                                        if (pm?.code && pm.code !== mainText && pm.code !== pm?.name) subTextParts.push(pm.code);
                                        
                                        const subText = subTextParts.filter(Boolean).join(' / ');

                                        return (
                                            <div key={oi.id} className="p-3 text-emerald-800 font-mono font-bold text-[12px] border-b border-gray-100 last:border-b-0 break-words flex flex-col gap-0.5">
                                                <span>{mainText}</span>
                                                {subText && (
                                                    <span className="text-[10px] text-gray-500 italic opacity-80 whitespace-normal leading-tight">
                                                        {subText}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </td>

                                <td className="p-0 border-l border-gray-50 align-top bg-slate-50/50">
                                    {item.order_items?.map((oi: any) => {
                                        const physicals = oi.product_master?.product_mold_map?.[0]?.mold_design_revision?.mold_physical;
                                        const moldCode = Array.isArray(physicals) ? physicals?.[0]?.physical_code : physicals?.physical_code;
                                        return <div key={oi.id} className="p-3 text-slate-600 font-mono text-[11px] border-b border-gray-100 last:border-b-0 truncate">{moldCode || <span className="text-gray-300">-</span>}</div>
                                    })}
                                </td>

                                <td className="p-0 align-top text-center border-l border-dashed border-gray-200">
                                    {item.order_items?.map((oi: any) => (
                                        <div key={oi.id} className="p-3 text-teal-700 font-mono text-[12px] border-b border-gray-100 last:border-b-0">{oi.delivery_date ? oi.delivery_date.substring(5, 10).replace('-', '/') : '-'}</div>
                                    ))}
                                </td>

                                <td className="p-0 align-top text-center border-r border-dashed border-gray-200">
                                    {item.order_items?.map((oi: any) => (
                                        <div key={oi.id} className="p-3 text-orange-700 font-mono text-[12px] border-b border-gray-100 last:border-b-0">{oi.delivery_date_end ? oi.delivery_date_end.substring(5, 10).replace('-', '/') : '-'}</div>
                                    ))}
                                </td>

                                <td className="p-3 text-center align-top">{getStatusBadge(item.status)}</td>
                                <td className="p-3 align-top text-[12px]">{item.handler_name || '-'}</td>
                                <td className="p-3 text-slate-500 min-w-[150px] align-top whitespace-pre-wrap leading-relaxed text-[11px] border-l border-gray-50">{item.internal_notes || '-'}</td>
                                <td className="p-3 text-center align-top">
                                    <OrderListActions orderId={item.id} status={item.status} />
                                </td>
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
