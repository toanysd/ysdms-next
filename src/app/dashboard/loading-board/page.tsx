import { getLoadingBoardData } from './_actions/board'
import LoadingBoardClient from './_components/LoadingBoardClient'
import { addDays, format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function LoadingBoardPage() {
  const today = new Date()
  const endDate = addDays(today, 6) // Rolling 7 days

  const startDateStr = format(today, 'yyyy-MM-dd')
  const endDateStr = format(endDate, 'yyyy-MM-dd')

  const { machines, pendingOrders, productionPlans } = await getLoadingBoardData(startDateStr, endDateStr)

  return (
    <div className="min-h-screen bg-[var(--mcs-surface)] dark:bg-slate-950 flex flex-col">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Machine Loading Board</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Smart Scheduling (Rolling 7-Days)</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-sm font-bold text-slate-600 dark:text-slate-300">
            {format(today, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
          </div>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-bold text-xs transition-colors">
            Week Nav ◀ ▶
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
