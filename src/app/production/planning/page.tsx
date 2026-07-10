import { Suspense } from 'react'
import { getMachineEffectiveSpecs } from '@/app/actions/machine'
import { getPendingOrderItemsForPlanning, getProductionPlansByDateRange, getOperators } from '@/app/actions/production'
import PlanningClickWrapper from './PlanningClickWrapper'
import ExcelPlanGridView from './ExcelPlanGridView-v8.5.2-1'
import DayPlanGrid from './DayPlanGrid'
import CompactPlanningToolbar from './CompactPlanningToolbar'
import { format, addDays, startOfMonth, endOfMonth, parseISO, startOfWeek } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function ProductionPlanningPage(props: { searchParams: Promise<{ date?: string, endDate?: string, view?: string, display?: string }> }) {
    const searchParams = await props.searchParams
    const dateParam = searchParams.date || new Date().toISOString().split('T')[0]
    const viewMode = (searchParams.view as any) || 'week1'
    const displayMode = (searchParams.display as any) || 'grid'
    
    // Calculate end date based on viewMode
    const currentDate = parseISO(dateParam)
    let endDate = currentDate
    let daysCount = 7

    if (viewMode === 'custom' && searchParams.endDate) {
        endDate = parseISO(searchParams.endDate)
        daysCount = Math.round((endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)) + 1
        if (daysCount < 1) daysCount = 1
    } else {
        if (viewMode === 'day') {
            endDate = currentDate
            daysCount = 1
        } else if (viewMode === 'week1') {
            endDate = addDays(currentDate, 6)
            daysCount = 7
        } else if (viewMode === 'week2') {
            endDate = addDays(currentDate, 13)
            daysCount = 14
        } else if (viewMode === 'month') {
            endDate = addDays(currentDate, 29)
            daysCount = 30
        }
    }
    const endDateStr = format(endDate, 'yyyy-MM-dd')

    const allMachines = await getMachineEffectiveSpecs()
    const customOrder = ['8号機', '台湾機', '6号機', '7号機', '5号機', '4号機']
    const machines = allMachines
        .filter(m => m.type_code === 'THERMOFORM' || m.type_code === '成形')
        .sort((a, b) => {
            const indexA = customOrder.indexOf(a.internal_code)
            const indexB = customOrder.indexOf(b.internal_code)
            if (indexA !== -1 && indexB !== -1) return indexA - indexB
            if (indexA !== -1) return -1
            if (indexB !== -1) return 1
            return a.internal_code.localeCompare(b.internal_code)
        })

    const pendingItems = await getPendingOrderItemsForPlanning()
    const plans = await getProductionPlansByDateRange(dateParam, endDateStr)
    const operators = await getOperators()

    return (
        <div className="flex flex-col h-[calc(100vh-48px)] bg-[var(--mcs-bg)] text-[var(--mcs-text)] font-sans">
            <CompactPlanningToolbar 
                currentDate={dateParam}
                endDate={endDateStr}
                viewMode={viewMode}
                activeView={displayMode}
            />

            <PlanningClickWrapper 
                pendingItems={pendingItems} 
                machines={machines}
                operators={operators}
            >
                <div key="main-panel" className="flex-1 flex flex-col h-full bg-[var(--mcs-surface)] w-full relative">
                    <div className="flex-1 overflow-hidden p-0">
                        {displayMode === 'grid' ? (
                            <ExcelPlanGridView plans={plans} machines={machines} startDateStr={dateParam} daysCount={daysCount} />
                        ) : (
                            <DayPlanGrid plans={plans} machines={machines} dateStr={dateParam} />
                        )}
                    </div>
                </div>
            </PlanningClickWrapper>
        </div>
    )
}
