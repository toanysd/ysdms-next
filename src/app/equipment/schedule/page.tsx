import { getJobsForGantt } from '@/app/actions/mold-job'
import { getWorkOrdersForGantt } from '@/app/actions/work-orders'
import { createClient } from '@/lib/supabase/server'
import MoldJobGantt from '@/components/equipment/MoldJobGantt'
import ToolingCalendarMatrix from './_components/ToolingCalendarMatrix'
import ToolingExcelGridView from './_components/ToolingExcelGridView'
import ToolingScheduleToolbar, { TimeframeMode, ViewMode, PerspectiveMode, TrackFilter } from './_components/ToolingScheduleToolbar'
import { format, parseISO, addDays } from 'date-fns'

export const dynamic = 'force-dynamic'

interface ToolingSchedulePageProps {
  searchParams: Promise<{
    search?: string
    from?: string
    to?: string
    view?: string
    timeframe?: string
    perspective?: string
    track?: string
    page?: string
  }>
}

export default async function ToolingSchedulePage(props: ToolingSchedulePageProps) {
  const supabase = await createClient()
  const resolvedSearchParams = await props.searchParams

  const query = resolvedSearchParams?.search || ''
  const activeView: ViewMode = (resolvedSearchParams?.view as ViewMode) || 'gantt'
  const timeframe: TimeframeMode = (resolvedSearchParams?.timeframe as TimeframeMode) || 'week2'
  const perspective: PerspectiveMode = (resolvedSearchParams?.perspective as PerspectiveMode) || 'job'
  const trackFilter: TrackFilter = (resolvedSearchParams?.track as TrackFilter) || 'ALL'
  const pageSize = 500

  // Date range calculation
  const today = new Date()
  const day = today.getDay()
  const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1)
  
  const startOfThisWeek = new Date(today)
  startOfThisWeek.setDate(diffToMonday)
  startOfThisWeek.setHours(0, 0, 0, 0)
  
  let defaultDays = 14
  if (timeframe === 'week1') defaultDays = 7
  else if (timeframe === 'week2') defaultDays = 14
  else if (timeframe === 'month') defaultDays = 30

  const defaultEnd = addDays(startOfThisWeek, defaultDays - 1)

  const hasExplicitDates = !!resolvedSearchParams?.from && !!resolvedSearchParams?.to
  const fromDate = hasExplicitDates ? resolvedSearchParams.from! : (query.trim() ? undefined : format(startOfThisWeek, 'yyyy-MM-dd'))
  const toDate = hasExplicitDates ? resolvedSearchParams.to! : (query.trim() ? undefined : format(defaultEnd, 'yyyy-MM-dd'))

  const fromDateFinal = fromDate || format(startOfThisWeek, 'yyyy-MM-dd')
  const toDateFinal = toDate || format(defaultEnd, 'yyyy-MM-dd')

  const parsedFrom = parseISO(fromDateFinal)
  const parsedTo = parseISO(toDateFinal)
  let daysCount = Math.round((parsedTo.getTime() - parsedFrom.getTime()) / (1000 * 3600 * 24)) + 1
  if (daysCount < 1) daysCount = 1

  const [woData, jobsData, empData, machData] = await Promise.all([
    getWorkOrdersForGantt({ search: query, fromDate, toDate, page: 1, pageSize }),
    getJobsForGantt(query, fromDate, toDate, 1, pageSize),
    supabase.from('employees').select('employee_id, employee_name, employee_code').order('employee_name'),
    supabase.from('machines').select('machine_id, machine_name, machine_code').order('machine_name')
  ])

  if (machData.error) {
    console.error('[API Error] Fetching machines failed:', machData.error)
  }

  const workOrders = woData.data
  const jobs = jobsData.data
  const totalJobs = jobsData.count
  const employees = empData.data || []
  const machines = machData.data || []

  // KPI calculations
  const inProgress = jobs.filter(j => j.job_status === 'IN_PROGRESS').length
  const completed = jobs.filter(j => j.job_status === 'COMPLETED').length
  const overdue = jobs.filter(j => {
    if (!j.mold_deadline) return false
    return new Date(j.mold_deadline) < new Date() && j.job_status !== 'COMPLETED'
  }).length

  return (
    <div className="flex flex-col h-[calc(100vh-144px)] md:h-[calc(100vh-85px)] gap-2 overflow-hidden">
      {/* --- Unified Toolbar --- */}
      <ToolingScheduleToolbar 
        currentDate={fromDateFinal}
        endDate={toDateFinal}
        timeframe={timeframe}
        activeView={activeView}
        perspective={perspective}
        trackFilter={trackFilter}
        searchQuery={query}
        totalJobsCount={totalJobs}
        inProgressCount={inProgress}
        overdueCount={overdue}
      />

      {/* --- Main View Content --- */}
      <div className="flex-1 min-h-0 relative rounded-md overflow-hidden border border-[var(--border-default)]">
        {activeView === 'grid' ? (
          <ToolingExcelGridView 
            jobs={jobs}
            workOrders={workOrders}
            machines={machines}
            employees={employees}
            startDateStr={fromDateFinal}
            daysCount={daysCount}
            timeframe={timeframe}
            trackFilter={trackFilter}
            searchQuery={query}
          />
        ) : (
          <MoldJobGantt 
            workOrders={workOrders}
            jobs={jobs} 
            employees={employees} 
            machines={machines}
            initialFromDate={fromDate}
            initialToDate={toDate}
            trackFilter={trackFilter}
          />
        )}
      </div>
    </div>
  )
}
