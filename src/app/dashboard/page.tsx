import { getDashboardData } from '@/app/actions/dashboard'
import { LayoutDashboard, AlertCircle, PackageSearch, Box, Truck } from 'lucide-react'

export default async function DashboardPage() {
    const data = await getDashboardData()
    const kpis = data.kpis

    // Prepare Bar Chart Data
    const statusLabels: Record<string, string> = {
        'draft': 'Nháp (Draft)',
        'pending': 'Chờ duyệt (Pending)',
        'confirmed': 'Đã xác nhận',
        'in_production': 'Đang SX (In-Prod)',
        'shipped': 'Đã giao (Shipped)',
        'delivered': 'Hoàn tất (Delivered)',
        'cancelled': 'Đã hủy'
    }

    const formatKg = (val: number) => {
        return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val)
    }

    const formatQty = (val: number) => {
        return new Intl.NumberFormat('en-US').format(val)
    }

    // Calculate max value for simple CSS bar chart
    const maxStatusVal = Math.max(...Object.values(data.statusCounts), 1)
    const maxWeeklyVal = Math.max(...data.weeklyChartData.map((d: any) => d.quantity), 1)

    return (
        <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg overflow-y-auto m-2">
            {/* Header */}
            <div className="h-[48px] bg-teal-50 px-4 flex items-center justify-between border border-teal-200 rounded-t-lg shrink-0">
                <div className="flex items-center gap-2">
                    <LayoutDashboard size={20} className="text-teal-700" />
                    <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
                        <span className="ja">ダッシュボード (Dashboard)</span>
                        <span className="vi font-normal text-teal-700 mt-[-2px] text-[10px]">Tổng quan Hoạt động</span>
                    </h2>
                </div>
            </div>

            <div className="p-4 flex flex-col gap-4 border-x border-b border-teal-100 rounded-b-lg flex-1">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Tồn kho */}
                    <div className="bg-white border border-teal-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wide">Tổng Nhựa Tồn Kho</p>
                            <h3 className="text-2xl font-black text-teal-800">{formatKg(kpis.total_stock_kg)} <span className="text-sm font-normal text-slate-500">kg</span></h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                            <Box size={20} className="text-teal-600" />
                        </div>
                    </div>

                    {/* Cảnh báo Reorder */}
                    <div className={`bg-white border ${kpis.low_stock_count > 0 ? 'border-red-300' : 'border-teal-200'} rounded-lg p-4 shadow-sm flex items-center justify-between`}>
                        <div>
                            <p className={`text-xs font-bold mb-1 uppercase tracking-wide ${kpis.low_stock_count > 0 ? 'text-red-500' : 'text-slate-500'}`}>Cảnh báo Hết Nhựa</p>
                            <h3 className={`text-2xl font-black ${kpis.low_stock_count > 0 ? 'text-red-600' : 'text-teal-800'}`}>
                                {kpis.low_stock_count} <span className="text-sm font-normal text-slate-500">mã</span>
                            </h3>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${kpis.low_stock_count > 0 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-teal-50 text-teal-600'}`}>
                            <AlertCircle size={20} />
                        </div>
                    </div>

                    {/* Đơn hàng pending */}
                    <div className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-amber-600 font-bold mb-1 uppercase tracking-wide">Đơn Pending / Đang SX</p>
                            <h3 className="text-2xl font-black text-amber-700">{kpis.orders_pending} <span className="text-sm font-normal text-amber-600/70">đơn</span></h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                            <PackageSearch size={20} className="text-amber-500" />
                        </div>
                    </div>

                    {/* Đơn hàng Delivered */}
                    <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-blue-600 font-bold mb-1 uppercase tracking-wide">Đơn Đã Giao (Tháng này)</p>
                            <h3 className="text-2xl font-black text-blue-700">{kpis.orders_shipped} <span className="text-sm font-normal text-blue-600/70">đơn</span></h3>
                            <p className="text-[10px] text-slate-400 mt-1">Tổng cộng {kpis.orders_this_month} đơn tháng này</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                            <Truck size={20} className="text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                    {/* Bar Chart: Order Status */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Trạng thái Đơn hàng (Order Status)</h3>
                        <div className="flex flex-col gap-3">
                            {Object.entries(data.statusCounts).length === 0 && (
                                <p className="text-xs text-slate-400 italic">Chưa có dữ liệu đơn hàng</p>
                            )}
                            {Object.entries(data.statusCounts).map(([status, count]) => {
                                const widthPct = Math.max((Number(count) / maxStatusVal) * 100, 2);
                                return (
                                    <div key={status} className="flex items-center gap-2">
                                        <div className="w-[120px] text-xs text-slate-600 truncate" title={statusLabels[status] || status}>
                                            {statusLabels[status] || status}
                                        </div>
                                        <div className="flex-1 h-5 bg-slate-100 rounded overflow-hidden flex items-center">
                                            <div
                                                className="h-full bg-teal-500 rounded flex items-center px-2 text-[10px] text-white font-bold transition-all duration-500"
                                                style={{ width: `${widthPct}%` }}
                                            >
                                                {count > 0 && widthPct > 8 && String(count)}
                                            </div>
                                        </div>
                                        <div className="w-8 text-right text-xs font-bold text-slate-700">{String(count)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Chart: Sản phẩm tiêu thụ theo tuần */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col">
                        <h3 className="text-sm font-bold text-slate-700 mb-4 border-b pb-2">Số lượng Sản xuất theo tuần (Weekly output)</h3>
                        <div className="flex-1 flex items-end gap-2 h-[200px] mt-2 relative">
                            {data.weeklyChartData.length === 0 && (
                                <p className="text-xs text-slate-400 italic absolute top-1/2 w-full text-center">Chưa có dữ liệu sản xuất</p>
                            )}
                            {data.weeklyChartData.map((d: any, idx: number) => {
                                const heightPct = Math.max((d.quantity / maxWeeklyVal) * 100, 5);
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center justify-end group">
                                        <div className="text-[10px] text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                                            {formatQty(d.quantity)}
                                        </div>
                                        <div
                                            className="w-full bg-slate-200 hover:bg-teal-400 transition-all duration-300 rounded-t-sm"
                                            style={{ height: `${heightPct}%` }}
                                        ></div>
                                        <div className="text-[9px] text-slate-400 mt-2 truncate w-full text-center" title={d.week}>
                                            {d.week ? d.week.substring(5) : ''} {/* e.g. "2026-04-12" -> "04-12" */}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
