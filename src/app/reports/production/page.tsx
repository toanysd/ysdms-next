export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import ReportDashboard from './ReportDashboard-v8.5.2-1'
import Link from 'next/link'
import { ArrowLeft, BarChart3 } from 'lucide-react'
import { getProductionReport } from '@/app/actions/reports'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: '生産実績レポート | YSDMS NextGen',
}

export default async function ProductionReportsPage() {
  const t = await getTranslations('Reports')

  const today = new Date()
  const endDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0')

  const startD = new Date(today)
  startD.setDate(startD.getDate() - 6)
  const startDate = startD.getFullYear() + '-' + String(startD.getMonth() + 1).padStart(2, '0') + '-' + String(startD.getDate()).padStart(2, '0')

  const initialData = await getProductionReport(startDate, endDate)

  return (
    <main className="p-4 md:p-6 lg:p-8 h-full flex flex-col min-h-0 bg-[var(--bg-base)]">
      <div className="flex items-center gap-4 mb-5 shrink-0">
        <Link href="/reports" className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[var(--bg-surface-elevated)] transition-colors bg-[var(--bg-surface)] shadow-sm border border-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--accent)]">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 className="text-[var(--accent)]" size={24} />
            {t('productionReportTitle')}
          </h1>
          <p className="text-[var(--text-muted)] text-sm ml-8 mt-1 border-l-2 pl-2 border-[var(--border-default)]">
            {t('productionReportSubtitle')}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden min-h-0 relative rounded-lg border border-[var(--border-default)] shadow-md">
        <ReportDashboard initialData={initialData} defaultStartDate={startDate} defaultEndDate={endDate} />
      </div>
    </main>
  )
}
