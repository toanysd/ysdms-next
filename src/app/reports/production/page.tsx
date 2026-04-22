import type { Metadata } from 'next'
import ReportDashboard from './ReportDashboard-v8.5.2-1'
import Link from 'next/link'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { getProductionReport } from '@/app/actions/reports'

export const metadata: Metadata = {
    title: '生産・稼働レポート | Báo cáo Sản xuất',
}

export default async function ProductionReportsPage() {
    // Mặc định: 7 ngày gần nhất (Weekly focus)
    const today = new Date()
    const endDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

    const startD = new Date(today)
    startD.setDate(startD.getDate() - 6)
    const startDate = startD.getFullYear() + '-' + String(startD.getMonth() + 1).padStart(2, '0') + '-' + String(startD.getDate()).padStart(2, '0')

    const initialData = await getProductionReport(startDate, endDate)

    return (
        <main className="p-4 md:p-6 lg:p-8 h-full flex flex-col min-h-0 bg-[var(--mcs-surface-1)]">
            <div className="flex items-center gap-4 mb-5 shrink-0">
                <Link href="/reports" className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[var(--mcs-surface-2)] transition-colors bg-[var(--mcs-surface)] shadow-sm border border-[var(--mcs-border)] text-[var(--mcs-text-muted)] hover:text-[var(--mcs-primary)]">
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--mcs-text)] flex items-center gap-2">
                        <BarChart3 className="text-[var(--mcs-primary)]" size={24} />
                        生産実績レポート <span className="text-lg font-normal ml-1">(Báo cáo Sản Xuất)</span>
                    </h1>
                    <p className="text-[var(--mcs-text-muted)] text-sm ml-8 mt-1 border-l-2 pl-2 border-[var(--mcs-border)]">
                        生産・稼働実績の集計と出力 (Tổng hợp & phân tích KPI ca máy, xuất dữ liệu)
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-hidden min-h-0 relative rounded-lg border border-[var(--mcs-border)] shadow-md">
                <ReportDashboard initialData={initialData} defaultStartDate={startDate} defaultEndDate={endDate} />
            </div>
        </main>
    )
}
