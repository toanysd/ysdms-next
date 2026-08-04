import { getLoadingBoardData } from './_actions/board'
import LoadingBoardClient from './_components/LoadingBoardClient'
import { addDays, format } from 'date-fns'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function LoadingBoardPage() {
  const t = await getTranslations('LoadingBoard')
  const today = new Date()
  const endDate = addDays(today, 6) // Rolling 7 days

  const startDateStr = format(today, 'yyyy-MM-dd')
  const endDateStr = format(endDate, 'yyyy-MM-dd')

  const { machines, pendingOrders, productionPlans } = await getLoadingBoardData(startDateStr, endDateStr)

  return (
    <div className="min-h-screen bg-[var(--bg-surface)] flex flex-col">
      <header className="border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{t('title')}</h1>
          <p className="text-xs font-medium text-[var(--text-muted)] mt-0.5">{t('subtitle')}</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-xs font-mono font-bold text-[var(--text-secondary)]">
            {format(today, 'yyyy/MM/dd')} - {format(endDate, 'yyyy/MM/dd')}
          </div>
          <button className="btn btn-secondary text-xs px-3 py-1.5 font-bold">
            {t('weekNav')}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <LoadingBoardClient 
          initialMachines={machines}
          initialPendingOrders={pendingOrders}
          initialPlans={productionPlans}
          startDateStr={startDateStr}
        />
      </main>
    </div>
  )
}
