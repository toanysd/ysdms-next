'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import TrayScheduleGantt from '@/components/production/TrayScheduleGantt'
import TrayScheduleGrid from '@/components/production/TrayScheduleGrid'
import PlasticRollPanel from '@/components/production/PlasticRollPanel'
import MachineHeatmap from '@/components/production/MachineHeatmap'
import QuickScheduleModal from '@/components/production/QuickScheduleModal'
// Import existing Tooling / Mold Gantt chart component — 100% preserved
import { GanttChart } from './_components/GanttChart'
import {
  Calendar,
  Layers,
  Wrench,
  Loader2,
  PlusCircle,
  BarChart3,
  Flame,
  X,
} from 'lucide-react'

type TabId = 'tray-gantt' | 'tray-grid' | 'tooling-gantt'
type ViewMode = 'gantt' | 'heatmap'

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

  // ── Lifted State for Sprint 2 ──
  const [viewMode, setViewMode] = useState<ViewMode>('gantt') // Tab 1: gantt or heatmap (T9)
  const [highlightRollId, setHighlightRollId] = useState<string | null>(null) // T7 roll highlight
  const [gridFilter, setGridFilter] = useState<{ machineId?: string; machineCode?: string; date?: string } | null>(null) // T9 heatmap click
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false) // T10 quick modal
  const [refreshKey, setRefreshKey] = useState(0) // reload trigger on new schedule

  // Date range for Tray Gantt & Grid: default today to today + 14 days
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
              真空成型機14台の稼働スケジュール管理・原反引当・稼働ヒートマップ一元化 (M13-S2)
            </span>
          </div>
        </div>

        {/* Action Buttons in PageHeader */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* View mode toggle button when in Tab 1 (T9) */}
          {activeTab === 'tray-gantt' && (
            <div style={{ display: 'flex', background: '#F1F5F9', padding: 2, borderRadius: 6, border: '1px solid #CBD5E1' }}>
              <button
                onClick={() => setViewMode('gantt')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'gantt' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'gantt' ? 'var(--accent)' : '#64748B',
                  boxShadow: viewMode === 'gantt' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <BarChart3 size={13} />
                <span>ガントチャート</span>
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'heatmap' ? '#FFFFFF' : 'transparent',
                  color: viewMode === 'heatmap' ? '#D97706' : '#64748B',
                  boxShadow: viewMode === 'heatmap' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Flame size={13} />
                <span>稼働ヒートマップ</span>
              </button>
            </div>
          )}

          {/* Quick Schedule Create Button (T10) */}
          {activeTab !== 'tooling-gantt' && (
            <button
              onClick={() => setIsQuickCreateOpen(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, height: 32, padding: '0 12px', fontWeight: 700 }}
            >
              <PlusCircle size={15} />
              <span>成型指示登録</span>
            </button>
          )}

          <span className="badge badge--neutral" style={{ fontSize: 10, fontFamily: 'monospace' }}>
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

      {/* ── Tab Content Area + Side Panel ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        {/* Main Content Pane */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Tab 1: 成型機スケジュール (Gantt or Heatmap) */}
          {activeTab === 'tray-gantt' && (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {viewMode === 'gantt' ? (
                <TrayScheduleGantt
                  startDate={defaultTrayStart}
                  endDate={defaultTrayEnd}
                  highlightRollId={highlightRollId}
                  refreshKey={refreshKey}
                />
              ) : (
                <MachineHeatmap
                  startDate={defaultTrayStart}
                  endDate={defaultTrayEnd}
                  onCellClick={(mCode, date) => {
                    setActiveTab('tray-grid')
                    setGridFilter({ machineCode: mCode, date })
                  }}
                  refreshKey={refreshKey}
                />
              )}
            </div>
          )}

          {/* Tab 2: 成型指示一覧 (Grid DataTable) */}
          {activeTab === 'tray-grid' && (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <TrayScheduleGrid
                startDate={defaultTrayStart}
                endDate={defaultTrayEnd}
                gridFilter={gridFilter}
                onClearFilter={() => setGridFilter(null)}
                refreshKey={refreshKey}
              />
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

        {/* ── T7: Plastic Roll Inventory Panel (Docked Right Sidebar) ── */}
        {/* Only rendered in Tab 1 (tray-gantt) and Tab 2 (tray-grid), NOT in Tab 3 (tooling) */}
        {activeTab !== 'tooling-gantt' && (
          <PlasticRollPanel
            onRollSelect={(rId) => setHighlightRollId(rId)}
            highlightedRollId={highlightRollId}
            refreshKey={refreshKey}
          />
        )}
      </div>

      {/* ── T10: Quick Schedule Create Modal ── */}
      <QuickScheduleModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
        onSuccess={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  )
}
