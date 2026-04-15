import Link from 'next/link'
import { BarChart3, Database, ClipboardList, ArrowRight } from 'lucide-react'

/**
 * Reports Hub — Trang tổng hợp Báo cáo
 * Sprint 5B-2
 */
export default function ReportsPage() {
    const reportModules = [
        {
            href: '/reports/inventory',
            icon: Database,
            titleJA: '在庫レポート',
            titleVI: 'Báo cáo Tồn kho Nhựa',
            description: 'Chi tiết tồn kho theo loại nhựa (Family), cảnh báo ngưỡng thấp, tổng hợp IN/OUT. Hỗ trợ xuất CSV.',
            accent: 'teal',
            stats: ['Tồn kho real-time', 'Group theo Family', 'Cảnh báo Reorder'],
        },
        {
            href: '/reports/orders',
            icon: ClipboardList,
            titleJA: '受注レポート',
            titleVI: 'Báo cáo Đơn hàng',
            description: 'Thống kê đơn hàng theo khách hàng, tháng, trạng thái. Lọc nhanh và xuất CSV chi tiết.',
            accent: 'blue',
            stats: ['Lọc theo tháng', 'Group theo KH', 'Export CSV'],
        },
    ]

    const accentMap: Record<string, { border: string; bg: string; text: string; hoverBg: string; iconBg: string }> = {
        teal: {
            border: 'border-teal-200',
            bg: 'bg-teal-50/60',
            text: 'text-teal-700',
            hoverBg: 'hover:bg-teal-50',
            iconBg: 'bg-teal-100',
        },
        blue: {
            border: 'border-blue-200',
            bg: 'bg-blue-50/60',
            text: 'text-blue-700',
            hoverBg: 'hover:bg-blue-50',
            iconBg: 'bg-blue-100',
        },
    }

    return (
        <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg overflow-y-auto m-2">
            {/* Header */}
            <div className="h-[48px] bg-teal-50 px-4 flex items-center justify-between border border-teal-200 rounded-t-lg shrink-0">
                <div className="flex items-center gap-2">
                    <BarChart3 size={20} className="text-teal-700" />
                    <h2 className="text-[14px] font-bold text-teal-900 flex flex-col">
                        <span className="ja">レポート一覧 (Reports)</span>
                        <span className="vi font-normal text-teal-700 mt-[-2px] text-[10px]">Trung tâm Báo cáo</span>
                    </h2>
                </div>
            </div>

            <div className="p-6 border-x border-b border-teal-100 rounded-b-lg flex-1">
                {/* Summary Banner */}
                <div className="mb-6 p-4 bg-gradient-to-r from-teal-50 to-slate-50 border border-teal-100 rounded-lg">
                    <p className="text-sm text-slate-600">
                        <span className="font-bold text-teal-800">Sprint 5B-2</span> — Hệ thống Báo cáo YSDMS. Chọn module bên dưới để xem chi tiết và xuất dữ liệu.
                    </p>
                </div>

                {/* Report Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reportModules.map((mod) => {
                        const colors = accentMap[mod.accent]
                        return (
                            <Link key={mod.href} href={mod.href} className="block group">
                                <div className={`border ${colors.border} rounded-xl p-5 ${colors.hoverBg} transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer`}>
                                    {/* Icon + Title */}
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center shrink-0`}>
                                            <mod.icon size={20} className={colors.text} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-[14px] font-bold text-slate-800">{mod.titleJA}</h3>
                                            <p className="text-[11px] text-slate-500">{mod.titleVI}</p>
                                        </div>
                                        <ArrowRight size={16} className="text-slate-300 group-hover:text-teal-500 transition-colors mt-1" />
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-slate-600 mb-3 leading-relaxed">{mod.description}</p>

                                    {/* Feature Tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {mod.stats.map((s) => (
                                            <span key={s} className={`px-2 py-0.5 text-[10px] font-bold rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
