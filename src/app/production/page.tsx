import { getPendingProductionItems, getActiveProductionLogs } from '@/app/actions/production'
import Link from 'next/link'
import { Play, CheckCircle, Factory, Settings } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProductionDashboardPage() {
    const pendingItems = await getPendingProductionItems()
    const activeLogs = await getActiveProductionLogs()

    return (
        <div className="flex-1 p-6 overflow-hidden flex flex-col bg-[var(--mcs-surface)] h-screen">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--mcs-text)] flex items-center gap-2">
                        <Factory className="text-[var(--mcs-primary)]" />
                        生産管理 Kanban (Production Execution)
                    </h1>
                    <p className="text-sm text-[var(--mcs-text-muted)]">Giám sát và Vận hành Tiến độ xưởng ép</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/production/active" className="px-4 py-2 bg-[var(--mcs-surface-2)] border border-[var(--mcs-border)] text-[var(--mcs-text)] rounded-md font-bold flex items-center gap-2 hover:border-[var(--mcs-primary)] transition-colors">
                        <Settings size={18} /> Monitor (TV View)
                    </Link>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
                {/* Cột 1: Cần chạy (Pending / To Do) */}
                <div className="flex flex-col bg-[var(--mcs-surface-alert)] border border-[var(--mcs-border)] rounded-lg p-4 h-full">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--mcs-border)]">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <h2 className="font-bold text-[var(--mcs-text)] text-lg">Chờ Chạy (未着手)</h2>
                        <span className="ml-auto bg-[var(--mcs-surface-2)] px-2 py-1 rounded-full text-xs font-bold text-[var(--mcs-text-muted)]">
                            {pendingItems?.length || 0}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {pendingItems?.map((item: any) => {
                            // Sum up completed quantities
                            const doneQty = item.production_log?.filter((l: any) => l.status === 'COMPLETED').reduce((acc: number, cur: any) => acc + cur.produced_qty, 0) || 0
                            const isRunning = item.production_log?.some((l: any) => l.status === 'IN_PROGRESS')

                            if (doneQty >= item.quantity && !isRunning) return null; // Ẩn những món đã xong hẳn

                            return (
                                <div key={item.id} className="bg-[var(--mcs-surface)] border-l-4 border-l-amber-500 border border-[var(--mcs-border)] rounded-md p-3 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-xs text-[var(--mcs-primary)] font-bold mb-1">
                                                {item.orders.slip_no} • Hàng: {item.product_pn_raw}
                                            </div>
                                            <div className="text-sm font-bold text-[var(--mcs-text)]">
                                                Cần sx: {item.quantity.toLocaleString()} (Đã xong: {doneQty.toLocaleString()})
                                            </div>
                                        </div>
                                        <Link href={`/production/track/${item.id}`} className="shrink-0 p-2 bg-[var(--mcs-primary)] hover:bg-[var(--mcs-primary-dark)] text-white rounded-md transition-colors shadow">
                                            <Play size={18} />
                                        </Link>
                                    </div>
                                    {isRunning && (
                                        <div className="mt-2 text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded w-fit">
                                            Đang có máy cắn tải (IN_PROGRESS)
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                        {(!pendingItems || pendingItems.length === 0) && (
                            <div className="text-center text-[var(--mcs-text-muted)] text-sm py-10">Không có lệnh sản xuất nào đang chờ.</div>
                        )}
                    </div>
                </div>

                {/* Cột 2: Đang Lên Máy (In Progress) */}
                <div className="flex flex-col bg-[var(--mcs-surface-success)] border border-[var(--mcs-border)] rounded-lg p-4 h-full">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[var(--mcs-border)]">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <h2 className="font-bold text-[var(--mcs-text)] text-lg">Đang Lên Máy (実行中)</h2>
                        <span className="ml-auto bg-[var(--mcs-surface-2)] px-2 py-1 rounded-full text-xs font-bold text-[var(--mcs-text-muted)]">
                            {activeLogs?.length || 0}
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {activeLogs?.map((log: any) => (
                            <div key={log.id} className="bg-[var(--mcs-surface)] border-l-4 border-l-emerald-500 border border-[var(--mcs-border)] rounded-md p-3 shadow-sm flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="text-xs text-[var(--mcs-primary)] font-bold mb-1">
                                            Mã: {log.order_items.product_pn_raw}
                                        </div>
                                        <div className="text-sm font-bold text-[var(--mcs-text)] flex items-center gap-2">
                                            Máy ép: <span className="bg-[var(--mcs-surface-2)] px-2 py-0.5 rounded border border-[var(--mcs-border)]">{log.machine_master?.code}</span>
                                        </div>
                                    </div>
                                    <Link href={`/production/track/${log.order_items.id}?logId=${log.id}`} className="shrink-0 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors shadow">
                                        <CheckCircle size={18} />
                                    </Link>
                                </div>
                                <div className="text-[11px] text-[var(--mcs-text-muted)] flex justify-between items-center mt-1 border-t border-[var(--mcs-border)] pt-2">
                                    <span>Thợ: {log.operator_name || 'Không ghi tên'}</span>
                                    <span>Bắt đầu: {new Date(log.start_time).toLocaleTimeString('vi-VN')}</span>
                                </div>
                            </div>
                        ))}
                        {(!activeLogs || activeLogs.length === 0) && (
                            <div className="text-center text-[var(--mcs-text-muted)] text-sm py-10">Máy xưởng đang rảnh tải.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
