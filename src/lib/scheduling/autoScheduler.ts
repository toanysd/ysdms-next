import type { JobForGantt } from '@/app/actions/mold-job'

export interface AutoScheduleOptions {
  allowSaturday?: boolean
  maxHoursPerDay?: number // usually 8, or 12 for OT
  forwardFromDate?: Date
}

/**
 * ScheduleCursor: Tracks working hours across days.
 * - Skips weekends (Sat/Sun by default, or just Sun if allowSaturday=true).
 * - addHours(n): consumes n hours from the cursor's current position, returning
 *   the start and end date for that work block. 
 *   Subsequent calls continue from where the previous left off (minutes/hours within a day).
 */
class ScheduleCursor {
  date: Date
  hoursAvailable: number
  maxHoursPerDay: number
  allowSaturday: boolean

  constructor(startDate: Date, maxHoursPerDay: number, allowSaturday: boolean) {
    this.date = new Date(startDate)
    this.date.setHours(0, 0, 0, 0)
    this.maxHoursPerDay = maxHoursPerDay
    this.allowSaturday = allowSaturday
    this.hoursAvailable = maxHoursPerDay
    this.skipWeekend()
  }

  skipWeekend() {
    while (true) {
      const dow = this.date.getDay()
      const isSunday = dow === 0
      const isSaturday = dow === 6 && !this.allowSaturday
      if (isSunday || isSaturday) {
        this.date.setDate(this.date.getDate() + 1)
        this.hoursAvailable = this.maxHoursPerDay
      } else {
        break
      }
    }
  }

  addHours(hours: number): { start: Date, end: Date } {
    this.skipWeekend()
    const startDay = new Date(this.date)

    let remaining = hours
    if (remaining <= 0) {
      // 0-hour task: represent as a single 1-hour block on current day
      return { start: startDay, end: new Date(this.date) }
    }

    while (remaining > 0) {
      this.skipWeekend()
      if (remaining <= this.hoursAvailable) {
        this.hoursAvailable -= remaining
        remaining = 0
      } else {
        remaining -= this.hoursAvailable
        this.date.setDate(this.date.getDate() + 1)
        this.hoursAvailable = this.maxHoursPerDay
      }
    }

    return { start: startDay, end: new Date(this.date) }
  }

  /** Peek: clone this cursor without advancing it */
  clone(): ScheduleCursor {
    const c = new ScheduleCursor(this.date, this.maxHoursPerDay, this.allowSaturday)
    c.hoursAvailable = this.hoursAvailable
    return c
  }
}

/**
 * Subtract working hours backwards from an end date.
 * Used for Backward Scheduling (Deadline - total hours => start date).
 */
function subtractWorkingHours(endDate: Date, hours: number, allowSaturday: boolean, maxHoursPerDay: number): Date {
  const date = new Date(endDate)
  date.setHours(0, 0, 0, 0)
  let remaining = hours

  while (remaining > 0) {
    const dow = date.getDay()
    const isWeekend = dow === 0 || (!allowSaturday && dow === 6)
    if (!isWeekend) {
      remaining -= maxHoursPerDay
    }
    if (remaining > 0) {
      date.setDate(date.getDate() - 1)
    }
  }
  return date
}

/** 
 * calculateAutoSchedule: Main scheduling engine.
 * 
 * RULES BY JOB STATE:
 * 
 * 1. COMPLETED Job  → Skip entirely. Do not touch any dates.
 * 
 * 2. IN_PROGRESS Job → Mixed mode:
 *    - COMPLETED steps → Skip (dates are historical facts).
 *    - IN_PROGRESS steps → Keep planned_start unchanged; only suggest planned_end 
 *      based on remaining work (estimated from total_planned_hours - actual).
 *    - PENDING steps → Forward schedule from the day AFTER latest actual date.
 * 
 * 3. NEW Job (no actual work yet):
 *    a. If all steps already have planned_start → Respect those dates. 
 *       Only re-plan PENDING/empty worklogs relative to existing step dates.
 *    b. If no planned dates exist but deadline is known → Use Backward Scheduling:
 *       Start = Deadline - total planned hours.
 *    c. If nothing exists → Forward schedule from today.
 */
export function calculateAutoSchedule(
  jobs: JobForGantt[],
  options: AutoScheduleOptions
) {
  const { allowSaturday = false, maxHoursPerDay = 8, forwardFromDate = new Date() } = options

  // Deep clone to avoid mutating original state
  const clonedJobs: JobForGantt[] = JSON.parse(JSON.stringify(jobs))

  // Sort jobs: IN_PROGRESS first (highest priority), then NEW by nearest deadline
  clonedJobs.sort((a, b) => {
    const statusOrder: Record<string, number> = { IN_PROGRESS: 0, NEW: 1, COMPLETED: 2, CANCELLED: 3 }
    const oa = statusOrder[a.job_status || 'NEW'] ?? 1
    const ob = statusOrder[b.job_status || 'NEW'] ?? 1
    if (oa !== ob) return oa - ob
    // Same status: sort by deadline (earliest first)
    const da = a.mold_deadline ? new Date(a.mold_deadline).getTime() : Infinity
    const db = b.mold_deadline ? new Date(b.mold_deadline).getTime() : Infinity
    return da - db
  })

  let hasOverdue = false
  const updates: any[] = []

  const today = new Date(forwardFromDate)
  today.setHours(0, 0, 0, 0)

  for (const job of clonedJobs) {
    const jobStatus = job.job_status || 'NEW'

    // ──────────────────────────────────────────────────────────────────────
    // CASE 1: COMPLETED or CANCELLED — Skip entirely
    // ──────────────────────────────────────────────────────────────────────
    if (jobStatus === 'COMPLETED' || jobStatus === 'CANCELLED') {
      // Mark for Gantt to render with a special "done" overlay (no changes needed)
      ;(job as any).autoScheduleNote = 'SKIPPED_COMPLETED'
      continue
    }

    const steps = (job.job_steps || []).sort((a, b) => (a.step_no || 0) - (b.step_no || 0))

    // ──────────────────────────────────────────────────────────────────────
    // Find latest actual date across ALL work logs and steps (for IN_PROGRESS)
    // ──────────────────────────────────────────────────────────────────────
    let latestActual = new Date(0)
    for (const step of steps) {
      if (step.actual_end) {
        const ae = new Date(step.actual_end)
        if (ae > latestActual) latestActual = ae
      }
      for (const wl of (step as any).work_logs || []) {
        if (wl.work_date) {
          const wd = new Date(wl.work_date)
          if (wd > latestActual) latestActual = wd
        }
      }
    }

    // ──────────────────────────────────────────────────────────────────────
    // CASE 2: IN_PROGRESS — Find remaining work and schedule from next working day after latest actual
    // ──────────────────────────────────────────────────────────────────────
    if (jobStatus === 'IN_PROGRESS') {
      // Base date = the day AFTER the latest actual work day
      const baseDate = latestActual > new Date(0)
        ? new Date(latestActual.getTime() + 86400000) // next day
        : new Date(today)

      const cursor = new ScheduleCursor(baseDate, maxHoursPerDay, allowSaturday)

      for (const step of steps) {
        const stepStatus = step.step_status || 'PENDING'

        // Skip COMPLETED steps — their dates are historical facts
        if (stepStatus === 'COMPLETED') {
          ;(step as any).autoScheduleNote = 'SKIPPED_COMPLETED'
          continue
        }

        const wls = (step as any).work_logs || []
        const wlGroups = groupByProcessingCode(wls)

        let stepStart: Date | null = null
        let stepEnd: Date | null = null

        for (const [, logs] of wlGroups) {
          const plannedHours = logs[0]?.planned_hours || 0
          const actualHours = logs.reduce((s: number, wl: any) => s + (wl.hours_spent || 0), 0)

          if (stepStatus === 'IN_PROGRESS') {
            // Step is actively running: keep existing planned_start, only suggest new planned_end
            const remainingHours = Math.max(0, plannedHours - actualHours)
            
            if (step.planned_start) {
              // Respect existing planned_start
              if (!stepStart) stepStart = new Date(step.planned_start)
            } else if (!stepStart) {
              stepStart = new Date(cursor.date)
            }
            
            // Calculate estimated end based on remaining work
            if (remainingHours > 0) {
              const { end } = cursor.addHours(remainingHours)
              if (!stepEnd || end > stepEnd) stepEnd = end
            } else {
              // No remaining hours → suggest today as end
              stepEnd = new Date(today)
            }

            // Only update planned_end, preserve planned_start
            if (stepStart && stepEnd) {
              step.planned_end = stepEnd.toISOString().split('T')[0]
              updates.push({
                type: 'step',
                id: step.step_id,
                planned_end: step.planned_end,
              })
            }

          } else {
            // PENDING step within IN_PROGRESS job → forward schedule normally
            if (plannedHours >= 0) {
              const { start, end } = cursor.addHours(plannedHours)
              if (!stepStart || start < stepStart) stepStart = new Date(start)
              if (!stepEnd || end > stepEnd) stepEnd = new Date(end)

              const formattedStart = start.toISOString().split('T')[0]
              logs[0].planned_date = formattedStart
              updates.push({
                type: 'worklog',
                id: logs[0].log_id,
                planned_date: formattedStart,
                planned_hours: plannedHours,
              })
            }
          }
        }

        if (stepStatus !== 'IN_PROGRESS' && wls.length > 0 && stepStart && stepEnd) {
          step.planned_start = (stepStart as Date).toISOString().split('T')[0]
          step.planned_end = (stepEnd as Date).toISOString().split('T')[0]
          updates.push({
            type: 'step',
            id: step.step_id,
            planned_start: step.planned_start,
            planned_end: step.planned_end,
          })
        }
      }

    } else {
      // ──────────────────────────────────────────────────────────────────────
      // CASE 3: NEW — No actual work yet. Determine scheduling start.
      // ──────────────────────────────────────────────────────────────────────

      // Calculate total planned hours across all steps/worklogs
      let totalPlannedHours = 0
      for (const step of steps) {
        for (const wl of (step as any).work_logs || []) {
          totalPlannedHours += (wl.planned_hours || 0)
        }
      }

      // Find earliest existing planned_start across all steps
      let earliestPlannedStart: Date | null = null
      for (const step of steps) {
        if (step.planned_start) {
          const ps = new Date(step.planned_start)
          if (!earliestPlannedStart || ps < earliestPlannedStart) {
            earliestPlannedStart = ps
          }
        }
      }

      let baseDate: Date

      if (earliestPlannedStart && earliestPlannedStart > today) {
        // 3a: Steps already have planned dates in the future → respect them
        baseDate = new Date(earliestPlannedStart)
      } else if (!earliestPlannedStart && job.mold_deadline) {
        // 3b: No planned dates, but deadline exists → Backward scheduling
        // Calculate: Start = Deadline - totalPlannedHours (working days)
        const deadline = new Date(job.mold_deadline)
        // Even if totalPlannedHours is 0, subtractWorkingHours will return deadline
        // If it's 0, we still want to schedule it BEFORE or ON the deadline
        baseDate = subtractWorkingHours(deadline, totalPlannedHours || (steps.length * 8), allowSaturday, maxHoursPerDay)
        
        // We DO NOT clamp to `today` here. If the job is already late (deadline in past or too tight),
        // we let it schedule in the past so the user can visually see they are behind schedule
        // and need to rush, rather than artificially pushing it past the deadline.
      } else {
        // 3c: No planned dates, no deadline → forward schedule from today
        baseDate = new Date(today)
      }

      const cursor = new ScheduleCursor(baseDate, maxHoursPerDay, allowSaturday)

      for (const step of steps) {
        const wls = (step as any).work_logs || []
        const wlGroups = groupByProcessingCode(wls)

        let stepStart: Date | null = null
        let stepEnd: Date | null = null

        for (const [, logs] of wlGroups) {
          const plannedHours = logs[0]?.planned_hours || 0
          const { start, end } = cursor.addHours(plannedHours > 0 ? plannedHours : 8) // default 1 day if no hours given

          if (!stepStart || start < stepStart) stepStart = new Date(start)
          if (!stepEnd || end > stepEnd) stepEnd = new Date(end)

          const formattedStart = start.toISOString().split('T')[0]
          logs[0].planned_date = formattedStart
          updates.push({
            type: 'worklog',
            id: logs[0].log_id,
            planned_date: formattedStart,
            planned_hours: plannedHours || 8,
          })
        }

        if (wls.length > 0 && stepStart && stepEnd) {
          step.planned_start = (stepStart as Date).toISOString().split('T')[0]
          step.planned_end = (stepEnd as Date).toISOString().split('T')[0]
          updates.push({
            type: 'step',
            id: step.step_id,
            planned_start: step.planned_start,
            planned_end: step.planned_end,
          })
        }
      }
    }

    // Check if final cursor position exceeds deadline
    if (job.mold_deadline) {
      const deadlineDate = new Date(job.mold_deadline)
      // Find latest planned_end across all steps after scheduling
      let latestPlannedEnd = new Date(0)
      for (const step of steps) {
        if (step.planned_end) {
          const pe = new Date(step.planned_end)
          if (pe > latestPlannedEnd) latestPlannedEnd = pe
        }
      }
      if (latestPlannedEnd > deadlineDate) {
        hasOverdue = true
        ;(job as any).isOverdue = true
      }
    }
  }

  return { draftJobs: clonedJobs, hasOverdue, updates }
}

/** Helper: group work logs by processing_code_id */
function groupByProcessingCode(wls: any[]): Map<string | number, any[]> {
  const map = new Map<string | number, any[]>()
  for (const wl of wls) {
    const key = wl.processing_code_id ?? 'none'
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(wl)
  }
  return map
}
