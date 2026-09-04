'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import TrayScheduleGantt from '@/components/production/TrayScheduleGantt'
import TrayScheduleGrid from '@/components/production/TrayScheduleGrid'
// Import existing Tooling / Mold Gantt chart component — 100% preserved
import { GanttChart } from './_components/GanttChart'
import { Calendar, Layers, Wrench, Loader2 } from 'lucide-react'

type TabId = 'tray-gantt' | 'tray-grid' | 'tooling-gantt'

interface TabConfig {
  id: TabId
  label: string
  subLabel: string
  icon: string
  badge?: string
}

const TABS: TabConfig[] = [
  {
    id: 'tray-gantt',
    label: '成型機スケジュール',
    subLabel: 'Tray Gantt Timeline',
    icon: '🗜️',
    badge: '14機',
  },
  {
    id: 'tray-grid',
    label: '成型指示一覧',
    subLabel: 'Tray Production Orders',
    icon: '📋',
  },
  {
    id: 'tooling-gantt',
    label: '金型・設計工程',
    subLabel: 'Tooling & Mold Gantt',
    icon: '🛠️',
  },
]

export default function ProductionSchedulePage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<TabId>('tray-gantt')

  // Date range for Tray Gantt & Grid: default today - 2 days to today + 12 days (14 days)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])
  const defaultTrayStart = todayStr
  const defaultTrayEnd = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d.toISOString().split('T')[0]
  }, [])

  // State for Tooling Gantt (Tab 3 — preserved)
  const [toolingJobs, setToolingJobs] = useState<any[]>([])
  const [loadingTooling, setLoadingTooling] = useState<boolean>(false)

  const defaultToolingFrom = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 14)
    return d
  }, [])
  const defaultToolingTo = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 14)
    return d
  }, [])

  // Lazy load tooling jobs when Tab 3 is active
  useEffect(() => {
    if (activeTab === 'tooling-gantt' && toolingJobs.length === 0) {
      async function loadToolingJobs() {
        setLoadingTooling(true)
        const { data } = await supabase
          .from('jobs')
          .select(`
            job_id, job_code, job_name, job_category, job_status,
            start_date, deadline, priority,
            work_orders!inner(wo_id, wo_code, wo_status),
            equipment(equipment_type, equipment_code),
            job_steps (
              quantity, step_status,
              work_logs (quantity_done)
            )
          `)
          .gte('deadline', defaultToolingFrom.toISOString())
          .lte('deadline', defaultToolingTo.toISOString())
          .order('job_category', { ascending: true })
          .order('deadline', { ascending: true })

        if (data) setToolingJobs(data)
        setLoadingTooling(false)
      }
      loadToolingJobs()
    }
  }, [activeTab, toolingJobs.length, defaultToolingFrom, defaultToolingTo, supabase])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
      {/* ── PageHeader ── */}
      <div
        className="card-flat"
        style={{
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={18} color="var(--accent)" />
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-slate-900" style={{ margin: 0 }}>
              生産・成型機スケジュール (Production & Machine Schedule)
            </h1>
            <span className="text-[11px] text-slate-500">
              真空成型機14台の稼働スケジュール管理および金型設計製作工程の一元化 (M13)
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge--neutral" style={{ fontSize: 11, fontFamily: 'monospace' }}>
            Live DB v_tray_schedule_gantt
          </span>
        </div>
      </div>

      {/* ── 3-Tab Navigation Bar ── */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          borderBottom: '2px solid #E2E8F0',
          padding: '0 4px',
          flexShrink: 0,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: isActive ? 800 : 600,
                border: 'none',
                background: isActive ? '#FFFFFF' : 'transparent',
                color: isActive ? 'var(--accent)' : '#64748B',
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                borderBottom: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                marginBottom: -2,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              className="hover:text-slate-900"
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '1px 5px',
                    borderRadius: 10,
                    background: isActive ? 'var(--accent)' : '#E2E8F0',
                    color: isActive ? '#FFFFFF' : '#475569',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Tab Content Area ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Tab 1: 成型機スケジュール (Gantt Timeline) */}
        {activeTab === 'tray-gantt' && (
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <TrayScheduleGantt startDate={defaultTrayStart} endDate={defaultTrayEnd} />
          </div>
        )}

        {/* Tab 2: 成型指示一覧 (Grid DataTable) */}
        {activeTab === 'tray-grid' && (
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <TrayScheduleGrid startDate={defaultTrayStart} endDate={defaultTrayEnd} />
          </div>
        )}

        {/* Tab 3: 金型・設計工程 (Tooling Gantt Cũ — Bảo toàn 100%) */}
        {activeTab === 'tooling-gantt' && (
          <div className="card-flat" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {loadingTooling ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#64748B' }}>
                <Loader2 size={22} className="animate-spin" />
                <span>金型工程データを読込中...</span>
              </div>
            ) : (
              <GanttChart
                jobs={toolingJobs}
                startDate={defaultToolingFrom}
                endDate={defaultToolingTo}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
