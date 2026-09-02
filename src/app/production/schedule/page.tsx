export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { GanttChart } from './_components/GanttChart'
import { Calendar } from 'lucide-react'

export default async function SchedulePage(props: { searchParams: Promise<{ from?: string, to?: string }> }) {
  const searchParams = await props.searchParams
  
  // Default date range: current week +/- 2 weeks (approx 30 days)
  const today = new Date()
  
  const defaultFrom = new Date(today)
  defaultFrom.setDate(today.getDate() - 14)
  
  const defaultTo = new Date(today)
  defaultTo.setDate(today.getDate() + 14)

  const fromDate = searchParams.from ? new Date(searchParams.from) : defaultFrom
  const toDate = searchParams.to ? new Date(searchParams.to) : defaultTo

  const supabase = await createClient()

  // Fetch jobs
  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      job_id, job_code, job_name, job_category, job_status,
      start_date, deadline, priority,
      work_orders!inner(wo_id, wo_code, wo_status),
      equipment(equipment_type, equipment_code)
    `)
    .gte('deadline', fromDate.toISOString())
    .lte('deadline', toDate.toISOString())
    .order('job_category', { ascending: true })
    .order('deadline', { ascending: true })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* ── PageHeader ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Calendar size={20} color="var(--accent)" />
          <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>
            Lịch Sản Xuất (Gantt)
          </h1>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 4px', display: 'flex', flexDirection: 'column' }}>
        <div className="card-flat" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <GanttChart 
            jobs={jobs || []} 
            startDate={fromDate} 
            endDate={toDate} 
          />
        </div>
      </div>
    </div>
  )
}
