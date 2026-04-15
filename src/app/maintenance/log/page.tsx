import Link from 'next/link'
import { getMaintenanceLogs } from '@/app/actions/maintenance'
import { ArrowLeft, History, Wrench, Settings, Search } from 'lucide-react'

// Nhật ký Bảo trì (Tầng 5C)
export default async function MaintenanceLogPage() {
    const logs = await getMaintenanceLogs()

    const fmt = (v: number) => new Intl.NumberFormat('en-US').format(v)
    const fmtCurrency = (v: number) => new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(v)

    return (
        <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg overflow-hidden m-2 border border-teal-200 shadow-sm">
            {/* Header */}
            <div className="h-[48px] bg-teal-50 px-4 flex items-center justify-between border-b border-teal-200 shrink-0">
                <div className="flex items-center gap-2">
                    <Link href="/maintenance" className="text-teal-500 hover:text-teal-700 transition-colors" title="Quay lại Dashboard Bảo trì">
                        <ArrowLeft size={18} />
                    </Link>
                    <History size={20} className="text-teal-700" />
                    <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
                        <span className="ja">メンテナンス履歴 (Maintenance Logs)</span>
                        <span className="vi font-normal text-teal-700 mt-[-2px] text-[10px]">Nhật ký Bảo trì Khuôn vật lý</span>
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-2 top-1.5 text-teal-400" size={16} />
                        <input
                            type="text"
                            disabled
                            placeholder="Tìm kiếm khuôn / PIC..."
                            title="Chức năng tìm kiếm đang phát triển"
                            className="h-[30px] w-[200px] pl-8 text-xs border border-teal-200 bg-white/50 text-slate-400 rounded outline-none cursor-not-allowed"
                        />
                    </div>
                    {/* Placeholder for Add action if needed via Client Component form later */}
                    <button className="bg-teal-700 hover:bg-teal-800 text-white h-[30px] px-3 flex items-center gap-1.5 text-xs rounded transition-colors shadow-sm font-bold opacity-50 cursor-not-allowed" title="Tính năng tạo log đang phát triển">
                        <Settings size={14} />
                        Ghi nhận Bảo trì
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_var(--mcs-border)] text-[11px] text-slate-500 whitespace-nowrap">
                        <tr>
                            <th className="p-3 font-bold w-[120px]">Ngày bảo trì</th>
                            <th className="p-3 font-bold">Khuôn Vật Lý (ID)</th>
                            <th className="p-3 font-bold">Loại bảo trì</th>
                            <th className="p-3 text-right font-bold">Lượt ép lúc bảo trì</th>
                            <th className="p-3 font-bold">Hành động khắc phục</th>
                            <th className="p-3 text-right font-bold">Chi phí</th>
                            <th className="p-3 font-bold w-[150px]">Người thực hiện (PIC)</th>
                        </tr>
                    </thead>
                    <tbody className="text-[12px]">
                        {logs.map(log => (
                            <tr key={log.id} className="border-b border-slate-100 hover:bg-teal-50/20 transition-colors">
                                <td className="p-3 font-mono text-slate-600 font-bold">{new Date(log.maintenance_date).toLocaleDateString('ja-JP')}</td>
                                <td className="p-3">
                                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-teal-800">{log.mold_physical_id.substring(0, 8)}...</span>
                                </td>
                                <td className="p-3">
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded uppercase">
                                        {log.maintenance_type || 'routine'}
                                    </span>
                                </td>
                                <td className="p-3 text-right font-mono text-slate-700">{log.shots_at_maintenance ? fmt(log.shots_at_maintenance) : '-'}</td>
                                <td className="p-3 text-slate-600 truncate max-w-[250px]" title={log.action_taken || ''}>{log.action_taken || '-'}</td>
                                <td className="p-3 text-right font-mono text-amber-700">{log.cost ? fmtCurrency(log.cost) : '-'}</td>
                                <td className="p-3 font-bold text-slate-700">{log.performed_by || '-'}</td>
                            </tr>
                        ))}

                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Wrench size={32} className="text-slate-300" />
                                        <p>Chưa có dữ liệu bảo trì khuôn nào được ghi nhận.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Tổng cộng: <strong className="text-teal-800">{logs.length}</strong> nhật ký</span>
                <span className="text-slate-400">Dữ liệu từ bảng mold_maintenance_log</span>
            </div>
        </div>
    )
}
