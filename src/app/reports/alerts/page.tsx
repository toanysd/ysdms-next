import Link from 'next/link'
import { getInventoryReport } from '@/app/actions/reports'
import { ArrowLeft, AlertTriangle, Bell, ShieldCheck, TrendingDown } from 'lucide-react'

/**
 * Sprint 5B-3: Cảnh báo Reorder & Giám sát Ngưỡng Tồn kho
 * Hiển thị danh sách nhựa dưới ngưỡng tối thiểu (min_threshold_kg / reorder_point_kg)
 */
export default async function AlertsPage() {
    const inventory = await getInventoryReport()

    // Phân loại: Critical (is_low_stock) vs Normal
    const criticalItems = inventory.filter(r => r.is_low_stock)
    const normalItems = inventory.filter(r => !r.is_low_stock)

    // Phân mức cảnh báo chi tiết
    const getAlertLevel = (current: number, threshold: number | null): { level: string; color: string; icon: string; bg: string; border: string } => {
        if (!threshold || threshold <= 0) return { level: '未設定', color: 'text-slate-400', icon: '—', bg: 'bg-slate-50', border: 'border-slate-200' }
        const ratio = current / threshold
        if (ratio <= 0) return { level: '在庫切れ (Hết)', color: 'text-red-700', icon: '🔴', bg: 'bg-red-50', border: 'border-red-300' }
        if (ratio <= 0.5) return { level: '危険 (Nguy hiểm)', color: 'text-red-600', icon: '🔴', bg: 'bg-red-50', border: 'border-red-200' }
        if (ratio <= 1.0) return { level: '注意 (Cần bổ sung)', color: 'text-amber-600', icon: '🟡', bg: 'bg-amber-50', border: 'border-amber-200' }
        if (ratio <= 1.5) return { level: '監視中 (Theo dõi)', color: 'text-blue-600', icon: '🔵', bg: 'bg-blue-50', border: 'border-blue-200' }
        return { level: '正常 (Đủ)', color: 'text-green-600', icon: '🟢', bg: 'bg-green-50', border: 'border-green-200' }
    }

    const fmt = (v: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(v)

    return (
        <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg overflow-hidden m-2">
            {/* Header */}
            <div className="h-[48px] bg-teal-50 px-4 flex items-center justify-between border border-teal-200 rounded-t-lg shrink-0">
                <div className="flex items-center gap-2">
                    <Link href="/reports" className="text-teal-500 hover:text-teal-700 transition-colors" title="Quay lại Reports">
                        <ArrowLeft size={18} />
                    </Link>
                    <Bell size={20} className="text-teal-700" />
                    <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
                        <span className="ja">在庫アラート (Inventory Alerts)</span>
                        <span className="vi font-normal text-teal-700 mt-[-2px] text-[10px]">Cảnh báo Tồn kho & Reorder</span>
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    {criticalItems.length > 0 ? (
                        <span className="px-3 py-1 text-[11px] font-bold bg-red-100 text-red-700 border border-red-300 rounded-full animate-pulse flex items-center gap-1">
                            <AlertTriangle size={12} />
                            {criticalItems.length} cảnh báo
                        </span>
                    ) : (
                        <span className="px-3 py-1 text-[11px] font-bold bg-green-100 text-green-700 border border-green-300 rounded-full flex items-center gap-1">
                            <ShieldCheck size={12} />
                            Hệ thống ổn định
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto border-x border-b border-teal-100 rounded-b-lg">

                {/* Summary Banner */}
                <div className={`p-4 border-b flex items-center gap-3 ${criticalItems.length > 0 ? 'bg-red-50/60 border-red-100' : 'bg-green-50/60 border-green-100'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${criticalItems.length > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                        {criticalItems.length > 0
                            ? <AlertTriangle size={24} className="text-red-500" />
                            : <ShieldCheck size={24} className="text-green-500" />
                        }
                    </div>
                    <div>
                        <h3 className={`text-sm font-bold ${criticalItems.length > 0 ? 'text-red-800' : 'text-green-800'}`}>
                            {criticalItems.length > 0
                                ? `⚠ ${criticalItems.length} mã nhựa cần bổ sung ngay!`
                                : '✅ Toàn bộ kho nhựa trong tình trạng ổn định.'
                            }
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Tổng giám sát: {inventory.length} mã | Bình thường: {normalItems.length} | Cảnh báo: {criticalItems.length}
                        </p>
                    </div>
                </div>

                {/* Critical Alerts Section */}
                {criticalItems.length > 0 && (
                    <div className="p-4 border-b border-slate-100">
                        <h3 className="text-xs font-bold text-red-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                            <AlertTriangle size={14} />
                            Danh sách Cảnh báo — 要注意リスト
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {criticalItems.map(item => {
                                const alert = getAlertLevel(Number(item.current_stock_kg), Number(item.reorder_point_kg))
                                const stockPercent = item.reorder_point_kg && Number(item.reorder_point_kg) > 0
                                    ? Math.min((Number(item.current_stock_kg) / Number(item.reorder_point_kg)) * 100, 100)
                                    : 0

                                return (
                                    <div key={item.plastic_id} className={`border ${alert.border} ${alert.bg} rounded-lg p-4 shadow-sm transition-all hover:shadow-md`}>
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-mono font-bold text-sm text-slate-800">{item.plastic_code}</span>
                                            <span className={`text-[10px] font-bold ${alert.color}`}>
                                                {alert.icon} {alert.level}
                                            </span>
                                        </div>

                                        {/* Details */}
                                        <div className="text-xs text-slate-500 mb-3">
                                            <span className="px-1.5 py-0.5 bg-white/60 border border-slate-200 rounded text-[10px] font-bold mr-1">{item.family}</span>
                                            {item.color && <span className="text-slate-400">{item.color}</span>}
                                            {item.grade && <span className="text-slate-400 ml-1">({item.grade})</span>}
                                        </div>

                                        {/* Stock Bar */}
                                        <div className="mb-2">
                                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                                                <span>Tồn kho / Ngưỡng</span>
                                                <span className="font-bold">{fmt(Number(item.current_stock_kg))} / {item.reorder_point_kg ? fmt(Number(item.reorder_point_kg)) : '—'} kg</span>
                                            </div>
                                            <div className="h-2.5 bg-white/80 rounded-full overflow-hidden border border-slate-200">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-700 ${stockPercent <= 30 ? 'bg-red-500' : stockPercent <= 70 ? 'bg-amber-400' : 'bg-green-400'}`}
                                                    style={{ width: `${Math.max(stockPercent, 3)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Trend indicator */}
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                            <TrendingDown size={10} className="text-red-400" />
                                            Last activity: {item.last_txn_time ? new Date(item.last_txn_time).toLocaleDateString('ja-JP') : 'N/A'}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* All Items Summary Table */}
                <div className="p-4">
                    <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                        全品目リスト — Toàn bộ mã nhựa ({inventory.length})
                    </h3>
                    <div className="overflow-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead className="bg-slate-50 text-[11px] text-slate-500 whitespace-nowrap">
                                <tr>
                                    <th className="p-2.5 font-bold">Mã nhựa</th>
                                    <th className="p-2.5 font-bold">Loại</th>
                                    <th className="p-2.5 font-bold">Màu</th>
                                    <th className="p-2.5 font-bold text-right">Tồn (kg)</th>
                                    <th className="p-2.5 font-bold text-right">Ngưỡng (kg)</th>
                                    <th className="p-2.5 font-bold text-center">Tỉ lệ %</th>
                                    <th className="p-2.5 font-bold text-center">Mức cảnh báo</th>
                                </tr>
                            </thead>
                            <tbody className="text-[12px]">
                                {inventory.map(row => {
                                    const alert = getAlertLevel(Number(row.current_stock_kg), Number(row.reorder_point_kg))
                                    const ratio = row.reorder_point_kg && Number(row.reorder_point_kg) > 0
                                        ? (Number(row.current_stock_kg) / Number(row.reorder_point_kg) * 100)
                                        : null

                                    return (
                                        <tr key={row.plastic_id} className={`border-b border-slate-100 transition-colors ${row.is_low_stock ? 'bg-red-50/30 hover:bg-red-50' : 'hover:bg-teal-50/20'}`}>
                                            <td className="p-2.5 font-mono font-bold text-teal-800">{row.plastic_code}</td>
                                            <td className="p-2.5">
                                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 rounded">{row.family}</span>
                                            </td>
                                            <td className="p-2.5 text-slate-600">{row.color || '-'}</td>
                                            <td className={`p-2.5 text-right font-mono font-bold ${row.is_low_stock ? 'text-red-600' : 'text-slate-800'}`}>
                                                {fmt(Number(row.current_stock_kg))}
                                            </td>
                                            <td className="p-2.5 text-right font-mono text-slate-500">
                                                {row.reorder_point_kg ? fmt(Number(row.reorder_point_kg)) : '—'}
                                            </td>
                                            <td className="p-2.5 text-center">
                                                {ratio !== null ? (
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${ratio <= 50 ? 'bg-red-400' : ratio <= 100 ? 'bg-amber-400' : 'bg-green-400'}`}
                                                                style={{ width: `${Math.min(ratio, 100)}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-[10px] font-bold ${ratio <= 50 ? 'text-red-500' : ratio <= 100 ? 'text-amber-500' : 'text-green-500'}`}>
                                                            {ratio.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-slate-300">—</span>
                                                )}
                                            </td>
                                            <td className="p-2.5 text-center">
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${alert.bg} ${alert.color} ${alert.border}`}>
                                                    {alert.level}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}

                                {inventory.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                                            Chưa có dữ liệu tồn kho trong hệ thống.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Giám sát: <strong className="text-teal-800">{inventory.length}</strong> mã nhựa | Cảnh báo: <strong className="text-red-600">{criticalItems.length}</strong></span>
                    <span className="text-slate-400">Auto-refresh mỗi lần truy cập (SSR Real-time)</span>
                </div>
            </div>
        </div>
    )
}
