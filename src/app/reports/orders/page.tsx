import Link from 'next/link'
import { getOrdersReport, getOrdersByMonth } from '@/app/actions/reports'
import { ArrowLeft, ClipboardList, Calendar, TrendingUp } from 'lucide-react'
import ExportCSVButton from '@/components/reports/ExportCSVButton'

const CSV_HEADERS: Record<string, string> = {
    slip_no: 'Mã LOT (Slip No)',
    order_date: 'Ngày đặt',
    customer_name: 'Khách hàng',
    customer_code: 'Mã KH',
    status: 'Trạng thái',
    order_type: 'Loại',
    line_count: 'Số dòng',
    total_qty: 'Tổng SL',
    total_amount: 'Tổng tiền',
    approval_status: 'Duyệt',
    created_at: 'Ngày tạo',
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    draft: { label: 'Nháp (Draft)', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    confirmed: { label: 'Đã xác nhận', color: 'bg-teal-50 text-teal-700 border-teal-300' },
    in_production: { label: 'Đang SX', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    shipped: { label: 'Đã giao', color: 'bg-green-100 text-green-700 border-green-300' },
    delivered: { label: 'Hoàn tất', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-600 border-red-300' },
}

export default async function OrdersReportPage() {
    const [orders, monthlyGroups] = await Promise.all([
        getOrdersReport(),
        getOrdersByMonth(),
    ])

    const totalOrders = orders.length
    const totalQty = orders.reduce((s, r) => s + Number(r.total_qty || 0), 0)
    const totalAmount = orders.reduce((s, r) => s + Number(r.total_amount || 0), 0)
    const uniqueCustomers = new Set(orders.map(o => o.customer_id)).size

    const fmt = (v: number) => new Intl.NumberFormat('en-US').format(v)
    const fmtCurrency = (v: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(v)

    // Status distribution
    const statusDist: Record<string, number> = {}
    orders.forEach(o => {
        statusDist[o.status] = (statusDist[o.status] || 0) + 1
    })
    const maxStatusVal = Math.max(...Object.values(statusDist), 1)

    return (
        <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg overflow-hidden m-2">
            {/* Header */}
            <div className="h-[48px] bg-teal-50 px-4 flex items-center justify-between border border-teal-200 rounded-t-lg shrink-0">
                <div className="flex items-center gap-2">
                    <Link href="/reports" className="text-teal-500 hover:text-teal-700 transition-colors" title="Quay lại Reports">
                        <ArrowLeft size={18} />
                    </Link>
                    <ClipboardList size={20} className="text-teal-700" />
                    <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
                        <span className="ja">受注レポート (Orders Report)</span>
                        <span className="vi font-normal text-teal-700 mt-[-2px] text-[10px]">Báo cáo Đơn hàng chi tiết</span>
                    </h2>
                </div>

                <ExportCSVButton
                    data={orders as unknown as Record<string, unknown>[]}
                    filename="YSDMS_Orders_Report"
                    headers={CSV_HEADERS}
                    label="CSV出力 (Xuất)"
                />
            </div>

            <div className="flex-1 overflow-auto border-x border-b border-teal-100 rounded-b-lg">

                {/* KPI Summary Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                    <div className="bg-white border border-blue-100 rounded-lg p-3 text-center shadow-sm">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Tổng đơn hàng</p>
                        <p className="text-xl font-black text-blue-800 mt-1">{fmt(totalOrders)} <span className="text-xs font-normal text-slate-400">đơn</span></p>
                    </div>
                    <div className="bg-white border border-teal-100 rounded-lg p-3 text-center shadow-sm">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Tổng sản lượng</p>
                        <p className="text-xl font-black text-teal-800 mt-1">{fmt(totalQty)} <span className="text-xs font-normal text-slate-400">SP</span></p>
                    </div>
                    <div className="bg-white border border-amber-100 rounded-lg p-3 text-center shadow-sm">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Tổng doanh thu</p>
                        <p className="text-xl font-black text-amber-800 mt-1">{fmtCurrency(totalAmount)}</p>
                    </div>
                    <div className="bg-white border border-purple-100 rounded-lg p-3 text-center shadow-sm">
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Khách hàng</p>
                        <p className="text-xl font-black text-purple-800 mt-1">{uniqueCustomers} <span className="text-xs font-normal text-slate-400">KH</span></p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 border-b border-slate-100">
                    {/* Status Distribution */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                            <ClipboardList size={14} className="text-slate-400" />
                            Phân bố Trạng thái
                        </h3>
                        <div className="flex flex-col gap-2">
                            {Object.entries(statusDist).map(([status, count]) => {
                                const pct = Math.max((count / maxStatusVal) * 100, 3)
                                const statusInfo = STATUS_MAP[status] || { label: status, color: 'bg-slate-100 text-slate-700 border-slate-300' }
                                return (
                                    <div key={status} className="flex items-center gap-2">
                                        <div className="w-[100px]">
                                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>
                                        <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden">
                                            <div className="h-full bg-blue-400 rounded transition-all duration-500" style={{ width: `${pct}%` }} />
                                        </div>
                                        <div className="w-8 text-right text-xs font-bold text-slate-700">{count}</div>
                                    </div>
                                )
                            })}
                            {Object.keys(statusDist).length === 0 && (
                                <p className="text-xs text-slate-400 italic">Chưa có dữ liệu</p>
                            )}
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                            <Calendar size={14} className="text-slate-400" />
                            Đơn hàng theo Tháng (月別)
                        </h3>
                        <div className="flex flex-col gap-1.5">
                            {monthlyGroups.slice(0, 6).map(g => {
                                const maxMonthOrders = Math.max(...monthlyGroups.map(m => m.order_count), 1)
                                const pct = Math.max((g.order_count / maxMonthOrders) * 100, 3)
                                return (
                                    <div key={g.month} className="flex items-center gap-2">
                                        <div className="w-[70px] text-xs font-mono text-slate-600">{g.month.substring(0, 7)}</div>
                                        <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden">
                                            <div className="h-full bg-teal-400 rounded transition-all duration-500" style={{ width: `${pct}%` }} />
                                        </div>
                                        <div className="w-[130px] text-right text-[11px] text-slate-600">
                                            <span className="font-bold">{g.order_count}</span> đơn
                                            <span className="text-slate-400 mx-1">|</span>
                                            <span className="font-bold">{fmt(g.total_qty)}</span> SP
                                        </div>
                                    </div>
                                )
                            })}
                            {monthlyGroups.length === 0 && (
                                <p className="text-xs text-slate-400 italic">Chưa có dữ liệu</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Detail Table */}
                <div className="overflow-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_var(--mcs-border)] text-[11px] text-slate-500 whitespace-nowrap">
                            <tr>
                                <th className="p-2.5 font-bold">Mã LOT (伝票)</th>
                                <th className="p-2.5 font-bold">Ngày đặt</th>
                                <th className="p-2.5 font-bold">Khách hàng</th>
                                <th className="p-2.5 font-bold text-center">Trạng thái</th>
                                <th className="p-2.5 font-bold">Loại</th>
                                <th className="p-2.5 font-bold text-right">Số dòng</th>
                                <th className="p-2.5 font-bold text-right">Tổng SL</th>
                                <th className="p-2.5 font-bold text-right">Tổng tiền</th>
                                <th className="p-2.5 font-bold text-center">Duyệt</th>
                                <th className="p-2.5 font-bold">Tạo lúc</th>
                            </tr>
                        </thead>
                        <tbody className="text-[12px]">
                            {orders.map((row) => {
                                const statusInfo = STATUS_MAP[row.status] || { label: row.status, color: 'bg-slate-100 text-slate-700 border-slate-300' }
                                return (
                                    <tr key={row.id} className="border-b border-slate-100 hover:bg-teal-50/30 transition-colors">
                                        <td className="p-2.5 font-mono font-bold text-teal-800 text-sm">{row.slip_no || '-'}</td>
                                        <td className="p-2.5 font-mono text-slate-600">{row.order_date?.substring(0, 10)}</td>
                                        <td className="p-2.5">
                                            <div className="font-bold text-slate-700">{row.customer_name || '-'}</div>
                                            {row.customer_code && <div className="text-[10px] text-slate-400 font-mono">{row.customer_code}</div>}
                                        </td>
                                        <td className="p-2.5 text-center">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </td>
                                        <td className="p-2.5 capitalize text-slate-600">{row.order_type || '-'}</td>
                                        <td className="p-2.5 text-right font-mono text-slate-500">{row.line_count}</td>
                                        <td className="p-2.5 text-right font-mono font-bold text-slate-800">{fmt(Number(row.total_qty))}</td>
                                        <td className="p-2.5 text-right font-mono text-amber-700">{fmtCurrency(Number(row.total_amount))}</td>
                                        <td className="p-2.5 text-center">
                                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${row.approval_status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                                {row.approval_status || '-'}
                                            </span>
                                        </td>
                                        <td className="p-2.5 text-[11px] text-slate-400 font-mono">
                                            {row.created_at ? new Date(row.created_at).toLocaleDateString('ja-JP') : '-'}
                                        </td>
                                    </tr>
                                )
                            })}

                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={10} className="p-8 text-center text-slate-400 italic">
                                        Chưa có đơn hàng nào trong hệ thống.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Tổng: <strong className="text-blue-800">{totalOrders}</strong> đơn hàng | <strong className="text-teal-800">{fmt(totalQty)}</strong> SP | <strong className="text-amber-700">{fmtCurrency(totalAmount)}</strong></span>
                    <span className="text-slate-400">Dữ liệu từ Supabase View v_order_summary</span>
                </div>
            </div>
        </div>
    )
}
