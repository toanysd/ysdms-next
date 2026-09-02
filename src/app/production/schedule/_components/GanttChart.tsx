'use client'

import React, { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format, eachDayOfInterval, addDays, isSameDay, differenceInDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  PLANNED:     '#94A3B8', // bg-slate-400
  IN_PROGRESS: '#14B8A6', // bg-teal-500
  COMPLETED:   '#22C55E', // bg-green-500
  ON_HOLD:     '#FBBF24', // bg-amber-400
  CANCELLED:   '#F87171', // bg-red-400
}

export function GanttChart({ jobs, startDate, endDate }: { jobs: any[], startDate: Date, endDate: Date }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const days = useMemo(() => {
    return eachDayOfInterval({ start: startDate, end: endDate })
  }, [startDate, endDate])

  const navigateDays = (delta: number) => {
    const newStart = addDays(startDate, delta)
    const newEnd = addDays(endDate, delta)
    
    const params = new URLSearchParams(searchParams.toString())
    params.set('from', newStart.toISOString())
    params.set('to', newEnd.toISOString())
    
    router.push(`/production/schedule?${params.toString()}`)
  }

  // Group jobs by category
  const groups = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const j of jobs) {
      if (!map[j.job_category]) map[j.job_category] = []
      map[j.job_category].push(j)
    }
    return map
  }, [jobs])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      
      {/* Controls & Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Trục X: date range */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 6, overflow: 'hidden' }}>
            <button onClick={() => navigateDays(-7)} className="px-3 py-1.5 hover:bg-slate-100 transition-colors border-r border-slate-200">
              <ChevronLeft size={16} />
            </button>
            <div className="px-4 py-1.5 text-xs font-bold font-mono">
              {format(startDate, 'yyyy-MM-dd')} — {format(endDate, 'yyyy-MM-dd')}
            </div>
            <button onClick={() => navigateDays(7)} className="px-3 py-1.5 hover:bg-slate-100 transition-colors border-l border-slate-200">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Status Legend */}
          {Object.entries(STATUS_COLORS).map(([st, color]) => (
            <div key={st} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: color }} />
              {st}
            </div>
          ))}
        </div>
      </div>

      {/* Gantt View Area */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <div style={{ minWidth: 800, paddingBottom: 32 }}>
          
          {/* Timeline Header */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', position: 'sticky', top: 0, background: 'var(--bg-surface)', zIndex: 10 }}>
            <div style={{ width: 180, flexShrink: 0, padding: '8px 12px', fontWeight: 700, fontSize: 12, color: 'var(--text-muted)', borderRight: '1px solid var(--border-default)', display: 'flex', alignItems: 'center' }}>
              Loại Job
            </div>
            <div style={{ flex: 1, display: 'flex' }}>
              {days.map((d, i) => (
                <div key={i} style={{ 
                  flex: 1, 
                  minWidth: 40,
                  textAlign: 'center', 
                  padding: '8px 0',
                  borderRight: '1px dashed var(--border-default)',
                  fontSize: 11,
                  fontWeight: 600,
                  color: isSameDay(d, new Date()) ? 'var(--accent)' : 'var(--text-muted)',
                  background: isSameDay(d, new Date()) ? 'var(--tint-teal-bg)' : 'transparent'
                }}>
                  {format(d, 'dd/MM')}
                </div>
              ))}
            </div>
          </div>

          {/* Groups & Rows */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {Object.keys(groups).length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600 }}>
                Không có Job nào trong khoảng thời gian này.
              </div>
            ) : (
              Object.entries(groups).map(([category, catJobs]) => (
                <div key={category} style={{ display: 'flex', borderBottom: '1px solid var(--border-default)' }}>
                  
                  {/* Y Axis - Category Name */}
                  <div style={{ 
                    width: 180, 
                    flexShrink: 0, 
                    padding: '12px', 
                    borderRight: '1px solid var(--border-default)',
                    background: 'var(--bg-surface-2)',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span className="badge badge--neutral font-bold">{category}</span>
                  </div>

                  {/* X Axis - Gantt Rows */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', padding: '8px 0' }}>
                    {/* Vertical Grid Lines */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none' }}>
                       {days.map((d, i) => (
                        <div key={i} style={{ 
                          flex: 1, 
                          minWidth: 40,
                          borderRight: '1px dashed var(--border-default)',
                          background: isSameDay(d, new Date()) ? 'var(--tint-teal-bg)' : 'transparent',
                          opacity: 0.3
                        }} />
                      ))}
                    </div>

                    {/* Job Bars */}
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 6, zIndex: 1 }}>
                      {catJobs.map((job: any) => {
                        const start = job.start_date ? new Date(job.start_date) : new Date(job.deadline)
                        const end = new Date(job.deadline)
                        
                        // Calculate offsets (basic MVP calculation)
                        let leftOffsetDays = differenceInDays(start, startDate)
                        let durationDays = differenceInDays(end, start) + 1 // +1 to include end day
                        
                        // Cap at viewport
                        if (leftOffsetDays < 0) {
                          durationDays += leftOffsetDays
                          leftOffsetDays = 0
                        }
                        
                        const totalDays = days.length
                        const leftPercent = Math.max(0, (leftOffsetDays / totalDays) * 100)
                        const widthPercent = Math.min(100 - leftPercent, (durationDays / totalDays) * 100)
                        
                        // Don't render if completely outside view
                        if (leftPercent >= 100 || widthPercent <= 0) return null

                        return (
                          <div key={job.job_id} style={{ position: 'relative', height: 24, width: '100%' }}>
                            <Link href={`/production/work-orders/${job.work_orders?.wo_id}`} style={{
                              position: 'absolute',
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                              height: '100%',
                              background: STATUS_COLORS[job.job_status] || STATUS_COLORS.PLANNED,
                              borderRadius: 4,
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0 8px',
                              overflow: 'hidden',
                              color: 'white',
                              fontSize: 11,
                              fontWeight: 700,
                              fontFamily: 'monospace',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                            }} title={`${job.job_code} - ${job.job_name}`}>
                              {job.job_code}
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}
