import Link from 'next/link'
import { getMoldHealthList } from '@/app/actions/maintenance'
import { Wrench, AlertTriangle, ShieldCheck, Drill, ArrowRight, History } from 'lucide-react'

// Dashboard Bảo trì Khuôn (Tầng 5C)
export default async function MaintenanceDashboard() {
    const healthList = await getMoldHealthList()

    const overdueCount = healthList.filter(h => h.health_status === 'OVERDUE').length
    const warningCount = healthList.filter(h => h.health_status === 'WARNING').length
    const okCount = healthList.filter(h => h.health_status === 'OK' || h.health_status === 'NO_SCHEDULE').length

    const getStatusStyle = (status: string) => {
        if (status === 'OVERDUE') return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-300', icon: '🚨' }
        if (status === 'WARNING') return { color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300', icon: '⚠️' }
        if (status === 'OK') return { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-300', icon: '✅' }
        return { color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200', icon: '➖' }
    }

    const fmt = (v: number) => new Intl.NumberFormat('en-US').format(v)

    return (
        <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg overflow-y-auto m-2">
            {/* Header */}
            <div className="h-[48px] bg-teal-50 px-4 flex items-center justify-between border border-teal-200 rounded-t-lg shrink-0">
                <div className="flex items-center gap-2">
                    <Wrench size={20} className="text-teal-700" />
                    <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
                        <span className="ja">金型メンテナンス (Mold Maintenance)</span>
                        <span className="vi font-normal text-teal-700 mt-[-2px] text-[10px]">Giám sát Sức khỏe & Bảo trì Khuôn</span>
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/maintenance/log">
                        <button className="bg-white hover:bg-teal-50 border border-teal-300 text-teal-700 h-[30px] px-3 flex items-center gap-1.5 text-xs rounded transition-colors shadow-sm font-bold">
                            <History size={14} />
                            Nhật ký Bảo trì
                        </button>
                    </Link>
                </div>
            </div>

            <div className="p-4 flex flex-col gap-4 border-x border-b border-teal-100 rounded-b-lg flex-1">
                {/* KPI Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`bg-white border ${overdueCount > 0 ? 'border-red-300' : 'border-slate-200'} rounded-lg p-4 shadow-sm flex items-center justify-between`}>
                        <div>
                            <p className="text-xs text-red-600 font-bold mb-1 uppercase tracking-wide">Quá hạn Bảo trì (Overdue)</p>
                            <h3 className="text-3xl font-black text-red-700">{overdueCount} <span className="text-sm font-normal text-red-500/70">khuôn</span></h3>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${overdueCount > 0 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-300'}`}>
                            <AlertTriangle size={24} />
                        </div>
                    </div>

                    <div className={`bg-white border ${warningCount > 0 ? 'border-amber-300' : 'border-slate-200'} rounded-lg p-4 shadow-sm flex items-center justify-between`}>
                        <div>
                            <p className="text-xs text-amber-600 font-bold mb-1 uppercase tracking-wide">Sắp đến hạn (Warning)</p>
                            <h3 className="text-3xl font-black text-amber-700">{warningCount} <span className="text-sm font-normal text-amber-600/70">khuôn</span></h3>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${warningCount > 0 ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-300'}`}>
                            <Drill size={24} />
                        </div>
                    </div>

                    <div className="bg-white border border-green-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-green-600 font-bold mb-1 uppercase tracking-wide">Hoạt động tốt / OK</p>
                            <h3 className="text-3xl font-black text-green-700">{okCount} <span className="text-sm font-normal text-green-600/70">khuôn</span></h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                            <ShieldCheck size={24} />
                        </div>
                    </div>
                </div>

                {/* Overdue / Warning Highlight Grid */}
                {(overdueCount > 0 || warningCount > 0) && (
                    <div className="mt-2">
                        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <AlertTriangle size={16} className="text-red-500" />
                            Khuôn cần chú ý (Action Required)
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {healthList.filter(h => h.health_status === 'OVERDUE' || h.health_status === 'WARNING').map(h => {
                                const st = getStatusStyle(h.health_status)
                                return (
                                    <div key={h.physical_id} className={`border ${st.border} ${st.bg} rounded-lg p-4 shadow-sm`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-mono font-black text-slate-800 text-lg">{h.physical_code}</h4>
                                                <p className="text-[10px] text-slate-500">{h.mold_base_code} (Rev: {h.revision_code})</p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold border ${st.border} rounded text-white ${h.health_status === 'OVERDUE' ? 'bg-red-600 animate-pulse' : 'bg-amber-500'}`}>
                                                {st.icon} {h.health_status}
                                            </span>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                                                <span>Số lượt ép (Shots)</span>
                                                <span className="font-bold">{fmt(h.total_shots)} / {fmt(h.interval_shots || 0)}</span>
                                            </div>
                                            <div className="h-2 bg-white/70 rounded-full overflow-hidden border border-white">
                                                <div
                                                    className={`h-full ${h.health_status === 'OVERDUE' ? 'bg-red-500' : 'bg-amber-400'}`}
                                                    style={{ width: `${Math.min(h.lifecycle_pct || 0, 100)}%` }}
                                                />
                                            </div>
                                            <div className="text-right text-[10px] mt-1 text-slate-500 font-mono">
                                                {h.lifecycle_pct}% tới hạn
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* All Molds List */}
                <div className="mt-4 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                    <h3 className="text-sm font-bold text-slate-700 p-4 border-b">Danh sách Sức khỏe Khuôn (All Physical Molds)</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead className="bg-[#f8fafc] text-xs text-slate-500">
                                <tr>
                                    <th className="p-3 font-bold border-b">Mã vật lý<span className="block text-[9px] font-normal">Physical Code</span></th>
                                    <th className="p-3 font-bold border-b">Mã thiết kế<span className="block text-[9px] font-normal">Base & Rev</span></th>
                                    <th className="p-3 text-right font-bold border-b w-[120px]">Số lượt ép<span className="block text-[9px] font-normal">Total Shots</span></th>
                                    <th className="p-3 text-right font-bold border-b w-[120px]">Ngưỡng bảo trì<span className="block text-[9px] font-normal">Interval</span></th>
                                    <th className="p-3 border-b text-center w-[200px]">Tuổi thọ chu kỳ<span className="block text-[9px] font-normal">Lifecycle Progress</span></th>
                                    <th className="p-3 text-center font-bold border-b w-[100px]">Trạng thái<span className="block text-[9px] font-normal">Health</span></th>
                                </tr>
                            </thead>
                            <tbody className="text-[12px]">
                                {healthList.map(h => {
                                    const st = getStatusStyle(h.health_status)
                                    return (
                                        <tr key={h.physical_id} className={`border-b border-slate-100 hover:bg-slate-50 ${h.health_status === 'OVERDUE' ? 'bg-red-50/20' : ''}`}>
                                            <td className="p-3 font-mono font-bold text-teal-800">{h.physical_code}</td>
                                            <td className="p-3">
                                                <span className="font-bold text-slate-700">{h.mold_base_code}</span>
                                                <span className="text-slate-400 font-mono text-[10px] ml-1 px-1 bg-slate-100 rounded">{h.revision_code}</span>
                                            </td>
                                            <td className="p-3 text-right font-mono text-slate-700 font-bold">{fmt(h.total_shots)}</td>
                                            <td className="p-3 text-right font-mono text-slate-400">{h.interval_shots ? fmt(h.interval_shots) : '-'}</td>
                                            <td className="p-3">
                                                {h.interval_shots ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-slate-200 rounded overflow-hidden">
                                                            <div className={`h-full ${st.bg === 'bg-red-50' ? 'bg-red-500' : st.bg === 'bg-amber-50' ? 'bg-amber-400' : 'bg-green-400'}`} style={{ width: `${Math.min(h.lifecycle_pct || 0, 100)}%` }} />
                                                        </div>
                                                        <span className={`w-8 text-right text-[10px] font-bold ${st.color}`}>{h.lifecycle_pct}%</span>
                                                    </div>
                                                ) : <span className="text-[10px] text-slate-300 italic block text-center">No schedule</span>}
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${st.border} ${st.bg} ${st.color}`}>
                                                    {h.health_status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {healthList.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-400 italic">Chưa có dữ liệu khuôn vật lý.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}
