export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import KanbanBoard from '../KanbanBoard'
import { getTodayProductionPlans, getActiveProductionLogs, getTodayCompletedLogs } from '@/app/actions/production'

export const metadata = {
  title: '成形現場カンバン | YSDMS NextGen',
}

export const revalidate = 0 // Tắt cache để Kanban real-time

export default async function KanbanPage() {
  const [initialPending, initialActive, initialCompleted] = await Promise.all([
    getTodayProductionPlans(),
    getActiveProductionLogs(),
    getTodayCompletedLogs()
  ])

  return (
    <KanbanBoard 
      initialPending={initialPending} 
      initialActive={initialActive} 
      initialCompleted={initialCompleted} 
    />
  )
}
