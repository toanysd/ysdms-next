import { createClient } from '@/lib/supabase/server'
import { getActiveProductionLogs } from '@/app/actions/production'
import { Factory, Cog, CheckCircle2, User, Clock, MonitorPlay, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function FactoryFloorMonitor() {
    const supabase = await createClient()

    // Fetch all active machines from new instance schema
    const { data: machines } = await supabase
        .from('machine_instance')
        .select(`
            id, internal_code, status,
            machine_model ( name )
        `)
        .eq('status', 'ACTIVE')
        .order('internal_code', { ascending: true })

    // Fetch active jobs (IN_PROGRESS)
    const activeLogs = await getActiveProductionLogs()

    // Map machines to their current job (if any)
    const machineStatusMap = machines?.map(machine => {
        // Now matching via machine_instance_id correctly!
        const job = activeLogs?.find((log: any) => log.machine_instance_id === machine.id)
        return {
            ...machine,
            currentJob: job || null
        }
    }) || []

    return (
        <div className="flex-1 overflow-y-auto bg-[var(--mcs-surface)] min-h-screen">
            {/* Header chuyên dụng cho Tivi */}
            <header className="bg-[var(--mcs-surface-2)] p-4 border-b border-[var(--mcs-border)] flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/production" className="p-2 bg-[var(--mcs-surface)] rounded-md border border-[var(--mcs-border)] text-[var(--mcs-text)] hover:text-[var(--mcs-primary)] transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-[var(--mcs-primary)] flex items-center gap-2 tracking-wide uppercase">
                            <MonitorPlay size={28} />
                            稼働状況モニター (FACTORY FLOOR MONITOR)
                        </h1>
                        <p className="text-sm font-bold text-[var(--mcs-text-muted)] mt-1">
                            リアルタイム稼働状況 (Live Status) • {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-[var(--mcs-text)] font-mono tracking-widest">
                        {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-sm font-bold text-emerald-500 mt-1 uppercase">稼働中 (Running): {activeLogs?.length || 0} / {machines?.length || 0}</div>
                </div>
            </header>

            <main className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {machineStatusMap.map(machine => {
                        const isRunning = machine.currentJob !== null

                        return (
                            <div
                                key={machine.id}
                                className={`flex flex-col border-2 rounded-xl overflow-hidden shadow-lg transition-all
                                    ${isRunning ? 'border-emerald-500 bg-emerald-500/5' : 'border-[var(--mcs-border)] bg-[var(--mcs-surface)] opacity-80'}
                                `}
                            >
                                {/* Machine Header */}
                                <div className={`p-4 flex justify-between items-center ${isRunning ? 'bg-emerald-500 text-white' : 'bg-[var(--mcs-surface-2)] border-b border-[var(--mcs-border)]'}`}>
                                    <div className="flex items-center gap-3">
                                        <Factory size={28} className={isRunning ? "text-white" : "text-[var(--mcs-text-muted)]"} />
                                        <div>
                                            <h2 className={`text-2xl font-black ${isRunning ? 'text-white' : 'text-[var(--mcs-text)]'}`}>{machine.internal_code}</h2>
                                            <p className={`text-xs font-bold uppercase ${isRunning ? 'text-emerald-100' : 'text-[var(--mcs-text-muted)]'}`}>{Array.isArray(machine.machine_model) ? machine.machine_model[0]?.name : (machine.machine_model as any)?.name || 'UNKNOWN'}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border-2 ${isRunning ? 'bg-white text-emerald-600 border-white' : 'bg-[var(--mcs-surface)] text-[var(--mcs-text-muted)] border-[var(--mcs-border)]'}`}>
                                        {isRunning ? '稼働中 (RUNNING)' : '待機中 (IDLE)'}
                                    </div>
                                </div>

                                {/* Machine Body */}
                                <div className="p-5 flex-1 flex flex-col justify-center min-h-[140px]">
                                    {isRunning ? (
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-xs font-bold text-[var(--mcs-text-muted)] uppercase tracking-wider mb-1">品番 (Mã Sản Phẩm / Item)</div>
                                                <div className="text-xl font-black text-[var(--mcs-text)]">{machine.currentJob.order_items.product_pn_raw}</div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-500/20">
                                                <div>
                                                    <div className="text-[10px] font-bold text-[var(--mcs-text-muted)] uppercase tracking-wider mb-1 flex items-center gap-1"><User size={12} /> 作業者(Thợ Máy)</div>
                                                    <div className="font-bold text-[var(--mcs-text)] truncate">{machine.currentJob.operator_name || 'N/A'}</div>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-[var(--mcs-text-muted)] uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={12} /> 開始時間(Giờ Bắt Đầu)</div>
                                                    <div className="font-bold text-[var(--mcs-text)]">{new Date(machine.currentJob.start_time).toLocaleTimeString('vi-VN')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-center space-y-3 h-full">
                                            <Cog size={48} className="text-[var(--mcs-border)] animate-spin-slow" style={{ animationDuration: '8s' }} />
                                            <p className="text-lg font-bold text-[var(--mcs-text-muted)] uppercase tracking-widest">稼働準備完了 (Sẵn Sàng Hứng Tải)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}
