import { getProductionPlansByDate } from '@/app/actions/production'
import DayPlanContainer from './DayPlanContainer-v8.5.2-1'

export default async function RightPanelData({ dateStr, machines }: { dateStr: string, machines: any[] }) {
    const plans = await getProductionPlansByDate(dateStr)

    return <DayPlanContainer plans={plans} machines={machines} dateStr={dateStr} />
}
