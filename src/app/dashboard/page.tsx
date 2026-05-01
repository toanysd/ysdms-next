import DashboardTabs from '@/components/dashboard/DashboardTabs'
import { getMonthlySummary, getDailyProductionTrend } from '@/actions/reports'

export const dynamic = 'force-dynamic'

export default async function Page() {
    const [monthlyData, trendData] = await Promise.all([
        getMonthlySummary(),
        getDailyProductionTrend()
    ])

    return <DashboardTabs monthlyData={monthlyData} trendData={trendData} />
}
