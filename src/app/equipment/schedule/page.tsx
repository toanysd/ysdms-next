import { getJobsForGantt } from '@/app/actions/mold-job'
import { getWorkOrdersForGantt } from '@/app/actions/work-orders'
import { createClient } from '@/lib/supabase/server'
import MoldJobGantt from '@/components/equipment/MoldJobGantt'
import { Plus } from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'

export default async function ToolingSchedulePage({ searchParams }: { searchParams: Promise<{ search?: string, from?: string, to?: string, page?: string }> }) {
  const supabase = await createClient()
  const t = await getTranslations('Equipment.Schedule')
  
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams?.search || ''
  const pageSize = 500

  // Default range: Monday this week to Sunday next week (14 days)
  const today = new Date()
  const day = today.getDay()
  const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1)
  
  const startOfThisWeek = new Date(today)
  startOfThisWeek.setDate(diffToMonday)
  startOfThisWeek.setHours(0,0,0,0)
  
  const endOfNextWeek = new Date(startOfThisWeek)
  endOfNextWeek.setDate(endOfNextWeek.getDate() + 13)
  endOfNextWeek.setHours(23,59,59,999)

  const hasExplicitDates = !!resolvedSearchParams?.from && !!resolvedSearchParams?.to
  const fromDate = hasExplicitDates ? resolvedSearchParams.from : (query.trim() ? undefined : startOfThisWeek.toISOString().split('T')[0])
  const toDate = hasExplicitDates ? resolvedSearchParams.to : (query.trim() ? undefined : endOfNextWeek.toISOString().split('T')[0])

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
  })
  
  const baseUrl = `/equipment/schedule?from=${fromDate}&to=${toDate}${query ? '&search=' + encodeURIComponent(query) : ''}`

  return (
    <div className="flex flex-col h-[calc(100vh-144px)] md:h-[calc(100vh-85px)] gap-3 overflow-hidden">
      {/* --- Compact Header & KPI --- */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-md px-4 py-2 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col justify-center">
            <h1 className="text-lg font-bold text-slate-800 font-jp leading-tight">{t('title')}</h1>
            <span className="text-[10px] text-slate-500">{t('subtitle')}</span>
          </div>
          
          <div className="w-px h-8 bg-slate-200 mx-2"></div>
          
          {/* Micro KPIs */}
          <div className="flex gap-6">
            {[
              { label: t('kpis.totalJobs'), value: totalJobs, accent: 'text-slate-800' },
              { label: t('kpis.inProgress'), value: inProgress, accent: 'text-amber-600' },
              { label: t('kpis.completed'), value: completed, accent: 'text-green-600' },
              { label: t('kpis.overdue'), value: overdue.length, accent: 'text-red-600' },
            ].map((kpi, i) => (
              <div key={i} className="flex flex-col justify-center">
                <div className="text-[10px] text-slate-500 font-medium leading-none mb-1">
                  <span className="font-jp">{kpi.label}</span>
                </div>
                <div className={`text-lg font-bold font-mono leading-none ${kpi.accent}`}>
                  {kpi.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Gantt Chart --- */}
      <div className="flex-1 min-h-0 relative">
        <MoldJobGantt 
          workOrders={workOrders}
          jobs={jobs} 
          employees={employees} 
          machines={machines}
          initialFromDate={fromDate}
          initialToDate={toDate}
        />
      </div>
    </div>
  )
}
