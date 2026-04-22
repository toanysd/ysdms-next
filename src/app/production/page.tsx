import { getTodayProductionPlans, getActiveProductionLogs, getTodayCompletedLogs } from '@/app/actions/production'
import KanbanBoard from './KanbanBoard-v8.5.2-1'

export const dynamic = 'force-dynamic'

export default async function ProductionDashboardPage() {
    const pendingItems = await getTodayProductionPlans()
    const activeLogs = await getActiveProductionLogs()
    const completedLogs = await getTodayCompletedLogs()

    return (
        <KanbanBoard
            initialPending={pendingItems}
            initialActive={activeLogs}
            initialCompleted={completedLogs}
        />
    )
}
