'use client'

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { Gantt, Task, ViewMode } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import { Edit2, Save, Undo, ChevronLeft, ChevronRight, Crosshair } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown'

import { shiftJobDates, applyAutoScheduleUpdates } from '@/app/actions/mold-job'
import { EditStepModal } from '@/app/equipment/jobs/[id]/tabs/EditStepModal'
import { WorklogEditModal } from '@/components/equipment/WorklogEditModal'
import { JobQuickViewDrawer } from '@/components/equipment/JobQuickViewDrawer'
import { calculateAutoSchedule } from '@/lib/scheduling/autoScheduler'

interface Props {
  jobs: JobForGantt[]
  employees?: any[]
  machines?: any[]
  initialFromDate?: string
  initialToDate?: string
}

export interface ExtendedTask extends Task {
  originalJob?: any;
  originalStep?: any;
  originalWorkLog?: any;
  originalJobId?: string;
  isActualRow?: boolean;
  // Track header rows
  isTrackHeader?: boolean;
  trackCode?: string;       // 'MOLD' | 'PLUG' | 'FINISH'
  trackProgress?: number;
  trackDeadline?: string | null;
  trackStepCount?: number;
  trackCompletedCount?: number;
}

const STEP_STATUS: Record<string, { color: string; progressColor: string }> = {
  COMPLETED:   { color: 'var(--status-success-bg, #e6f4ea)', progressColor: 'var(--status-success)' },
  IN_PROGRESS: { color: 'var(--status-info-bg, #e8f0fe)', progressColor: 'var(--status-info)' },
  PENDING:     { color: 'var(--bg-surface-3)', progressColor: 'var(--text-muted)' },
}

function resolveStatusColor(code?: string) {
  if (!code) return STEP_STATUS.PENDING;
  if (code.includes('完了')) return STEP_STATUS.COMPLETED;
  if (code.includes('進行中') || code.match(/^[1-6]\./) || code.includes('材料')) return STEP_STATUS.IN_PROGRESS;
  if (code.includes('未確認')) return STEP_STATUS.PENDING;
  return STEP_STATUS.PENDING;
}

function resolveProgress(code?: string) {
  if (!code) return 0;
  if (code.includes('完了')) return 100;
  if (code.includes('進行中') || code.match(/^[1-6]\./) || code.includes('材料')) return 50;
  if (code.includes('未確認')) return 0;
  return 0;
}

const STATUS_LOCALE: Record<string, string> = {
  NEW: '新規',
  IN_PROGRESS: '進行中',
  COMPLETED: '完了',
  PENDING: '未定',
  CANCELLED: 'キャンセル',
}

function formatStatusText(code?: string) {
  if (!code) return STATUS_LOCALE['NEW'];
  return STATUS_LOCALE[code] || code;
}

const JOB_STATUS: Record<string, { color: string; progressColor: string }> = {
  NEW:         { color: 'var(--accent)', progressColor: 'var(--accent)' },
  IN_PROGRESS: { color: 'var(--accent)', progressColor: 'var(--accent)' },
  COMPLETED:   { color: 'var(--accent)', progressColor: 'var(--accent)' },
  CANCELLED:   { color: 'var(--status-error-bg, #fce8e6)', progressColor: 'var(--status-error)' },
}

const daysJa = ['日', '月', '火', '水', '木', '金', '土']

function formatShortDateWithDay(dateString?: string | null): string {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return ''
  return `${d.getMonth() + 1}/${d.getDate()} (${daysJa[d.getDay()]})`
}

function formatFullDateWithDay(dateString?: string | null): string {
  if (!dateString) return ''
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return ''
  return `${d.getFullYear()}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')} (${daysJa[d.getDay()]})`
}

// GanttHandlersContext: stable — only changes when handlers/options change (rare)
const GanttHandlersContext = React.createContext<any>(null);
// GanttDataContext: volatile — changes with localSteps/expandedJobs on every edit
const GanttDataContext = React.createContext<any>(null);
// Keep old alias for backward compat
const GanttContext = GanttHandlersContext;


// ─── External, memoised sub-components ──────────────────────────────────────
// These MUST live outside the parent component so their reference never changes
// between renders, otherwise gantt-task-react unmounts and remounts the entire
// table tree on every state update.

interface HeaderProps {
  headerHeight: number
  fontFamily: string
  fontSize: string
  isPanelExpanded: boolean
  gridTemplate: string
  onExpandAll: () => void
  onCollapseAll: () => void
}

const CustomTaskListHeader = React.memo(function CustomTaskListHeader({
  headerHeight, fontFamily, isPanelExpanded, gridTemplate, onExpandAll, onCollapseAll,
}: HeaderProps) {
  const hStyle: React.CSSProperties = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', textTransform: 'uppercase', letterSpacing: '0.05em' }
  const hHide: React.CSSProperties = { ...hStyle, display: isPanelExpanded ? 'block' : 'none' }
  return (
    <div style={{ height: headerHeight, fontFamily, fontSize: 10, display: 'grid', gridTemplateColumns: gridTemplate, alignItems: 'center', padding: '0 4px', borderBottom: '1px solid var(--border-default)', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)' }}>
      <div style={{ ...hStyle, display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div className="flex gap-0.5" style={{ zIndex: 10 }}>
           <button className="flex items-center justify-center bg-[var(--bg-surface-2)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] rounded-sm h-4 w-4 text-[10px]" onClick={onExpandAll} title="全展開 (Expand All)">+</button>
           <button className="flex items-center justify-center bg-[var(--bg-surface-2)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] rounded-sm h-4 w-4 text-[10px]" onClick={onCollapseAll} title="全折畳 (Collapse All)">-</button>
        </div>
        <span>ジョブ / 工程</span>
      </div>
      <div style={hHide}>設備</div>
      <div style={{ ...hHide, textAlign: 'center' }} title="予定時間">予定H</div>
      <div style={{ ...hHide, textAlign: 'center' }} title="実績時間">実績H</div>
      <div style={{ ...hHide, textAlign: 'center' }}>状態</div>
      <div style={{ ...hHide, textAlign: 'center' }}>開始</div>
      <div style={{ ...hHide, textAlign: 'center' }}>終了</div>
      <div style={{ ...hHide, textAlign: 'center' }}>期限</div>
    </div>
  )
})

interface TableProps {
  rowHeight: number
  rowWidth: string
  tasks: ExtendedTask[]
  fontFamily: string
  fontSize: string
  onExpanderClick: (task: ExtendedTask) => void
  // context passed as props
  isPanelExpanded: boolean
  gridTemplate: string
  expandedJobs: Set<string>
  expandedTracks: Set<string>
  localSteps: Record<string, Partial<JobStepRow>>
  machOptions: { id: string; label: string }[]
  empOptions: { id: string; label: string }[]
  compareMode: 'PLANNED' | 'ACTUAL' | 'COMPARE'
  onScrollToDate: (date: string | null | undefined, rowIndex?: number, highlight?: string | null) => boolean | undefined
  onEditStep: (task: ExtendedTask) => void
  onUpdateLocalStep: (stepId: string, updates: Partial<JobStepRow>) => void
  onOpenQuickView: (job: JobForGantt) => void
  selectedJobId: string | null
  onSelectJob: (jobId: string | null) => void
  originalTasks?: ExtendedTask[]
}

const TaskRow = React.memo(function TaskRow({
  t, index, rowHeight, rowWidth, gridTemplate, isPanelExpanded,
  isExpanded, currentStepData, machOptions, empOptions, expandedTracks,
  onExpanderClick, onScrollToDate, onEditStep, onUpdateLocalStep, onOpenQuickView, selectedJobId, onSelectJob
}: any) {
  let expanderSymbol = ""
  if (t.type === 'project') {
     expanderSymbol = isExpanded ? "▼" : "▶"
  } else if (t.isTrackHeader) {
     expanderSymbol = expandedTracks.has(t.id) ? "▼" : "▶"
  }

  let statusColor = 'var(--text-muted)'
  let statusText = '-'
  if (t.type === 'project') {
    statusText = formatStatusText(t.originalJob?.job_status || 'NEW')
    if (statusText === '完了') statusColor = 'var(--status-success)'
    else if (statusText === '進行中') statusColor = 'var(--status-warning)'
    else statusColor = 'var(--status-info)'
  } else {
    statusText = formatStatusText(t.originalStep?.processing_statuses?.status_code || t.originalStep?.step_status || 'PENDING')
    if (statusText === '完了' || statusText.includes('完了')) statusColor = 'var(--status-success)'
    else if (statusText === '進行中' || statusText.includes('進行中') || statusText.match(/^[1-6]\./) || statusText.includes('材料')) statusColor = 'var(--status-warning)'
  }

  const isTask = t.type === 'task'
  const step = t.originalStep
  const isActual = t.isActualRow === true
  const isCompareMode = isTask && (t.id?.endsWith('_actual') || t.id?.endsWith('_planned'))

  if (t.id === 'dummy_timeline_bound') {
     return <div style={{ height: rowHeight, overflow: 'hidden' }}></div>
  }

  const rowBg = t.type === 'project' 
    ? (t.id === selectedJobId ? 'var(--accent-light)' : 'var(--bg-surface)')
    : isActual 
      ? 'rgba(13, 122, 122, 0.04)'
      : 'transparent'

  const TRACK_META: Record<string, { badge: string; color: string; bg: string; label: string }> = {
    ALUMI:              { badge: 'A', color: '#6d4c41', bg: '#efebe9', label: 'アルミ材' },
    MOLD:               { badge: 'M', color: '#1565c0', bg: '#e3f2fd', label: '金型' },
    PLUG:               { badge: 'P', color: '#e65100', bg: '#fff3e0', label: 'プラグ' },
    CUTTER:             { badge: 'C', color: '#b71c1c', bg: '#ffebee', label: '抜型' },
    'WATER COOLING BASE': { badge: 'W', color: '#0277bd', bg: '#e1f5fe', label: '水冷盤' },
    'PRESSIER BASE':    { badge: 'B', color: '#4527a0', bg: '#ede7f6', label: '圧空ベース' },
    STAKING:            { badge: 'S', color: '#00695c', bg: '#e0f2f1', label: 'スタッキング' },
    FRAME:              { badge: 'R', color: '#37474f', bg: '#eceff1', label: 'フレーム' },
    MACHINE:            { badge: 'N', color: '#455a64', bg: '#eceff1', label: '機械など' },
    OTHER:              { badge: 'O', color: '#616161', bg: '#f5f5f5', label: '成形・プレス・出荷など' },
    'TEST MOLD':        { badge: 'T', color: '#1565c0', bg: '#e3f2fd', label: '試作金型' },
    FINISH:             { badge: 'F', color: '#1b5e20', bg: '#e8f5e9', label: '仕上げ' },
  }

  const isTrack = t.isTrackHeader === true
  const trackMeta = isTrack
    ? (TRACK_META[t.trackCode || ''] || { badge: '?', color: 'var(--accent)', bg: 'var(--accent-light)', label: t.trackCode || 'OTHER' })
    : null

  // Track header row — special compact rendering
  if (isTrack) {
    const prog = t.trackProgress ?? 0
    const deadline = t.trackDeadline
    const stepCount = t.trackStepCount ?? 0
    const doneCount = t.trackCompletedCount ?? 0
    const isOverdue = deadline && new Date(deadline) < new Date() && prog < 100
    
    const trackStatusText = formatStatusText((t as any).trackStatus || 'NEW')
    let trackStatusColor = 'var(--text-muted)'
    if (trackStatusText === '完了' || trackStatusText.includes('完了') || trackStatusText === 'COMPLETED') trackStatusColor = 'var(--status-success)'
    else if (trackStatusText === '進行中' || trackStatusText.includes('進行中') || trackStatusText === 'IN_PROGRESS' || trackStatusText.match(/^[1-6]\./) || trackStatusText.includes('材料')) trackStatusColor = 'var(--status-warning)'

    return (
      <div 
        style={{
          height: rowHeight, width: rowWidth,
          display: 'grid', gridTemplateColumns: gridTemplate,
          alignItems: 'center', padding: '0 4px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-2)',
          borderLeft: `3px solid ${trackMeta!.color}`,
        }}
        onDoubleClick={(e) => { 
          e.stopPropagation(); 
          if (t.originalStep) {
            onEditStep(t);
          } else {
            onExpanderClick(t);
          }
        }}
      >
        {/* Name col: icon + badge pill + track label + mini progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0, paddingLeft: 4 }}>
          <div 
            style={{ width: 14, cursor: 'pointer', textAlign: 'center', userSelect: 'none', color: 'var(--text-muted)', fontSize: 9 }} 
            onClick={(e) => { e.stopPropagation(); onExpanderClick(t) }}
          >
            {expanderSymbol}
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 16, height: 16, borderRadius: 3,
            background: trackMeta!.bg,
            color: trackMeta!.color,
            fontSize: 9, fontWeight: 900, flexShrink: 0,
            border: `1px solid ${trackMeta!.color}`,
            letterSpacing: '-0.5px',
          }}>{trackMeta!.badge}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: trackMeta!.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {trackMeta!.label}
          </span>
          {isPanelExpanded && (
            <div style={{ flex: 1, height: 4, background: 'var(--border-default)', borderRadius: 2, overflow: 'hidden', minWidth: 16, maxWidth: 36 }}>
              <div style={{ width: `${prog}%`, height: '100%', background: trackMeta!.color, borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
          )}
        </div>
        {/* Machine col: step count */}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'left', paddingLeft: 4 }}>
            {doneCount}/{stepCount} 工程
          </div>
        )}
        {/* planned H: aggregate from worklogs */}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-muted)', textAlign: 'center' }}>
            {(t as any).trackTotalPlannedHours ? `${(t as any).trackTotalPlannedHours}H` : '-'}
          </div>
        )}
        {/* actual H: aggregate from worklogs */}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, fontWeight: 700, color: trackStatusColor, textAlign: 'center', fontFamily: 'monospace' }}>
            {(t as any).trackTotalActualHours ? `${(t as any).trackTotalActualHours}H` : '-'}
          </div>
        )}
        {/* status: text + progress % */}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, fontWeight: 700, color: trackStatusColor, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1.2 }}>
            <span>{trackStatusText}</span>
            <span style={{ fontSize: 8, opacity: 0.8 }}>{prog}%</span>
          </div>
        )}
        {/* start: show track start date */}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, textAlign: 'center', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t.start && !(t.styles?.backgroundColor === 'transparent') ? (
              <span 
                style={{ cursor: 'pointer', color: 'var(--text-muted)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                onClick={(e) => { e.stopPropagation(); onScrollToDate(t.start, index, t.start) }}
                title="開始日にスクロール"
              >
                {formatShortDateWithDay(t.start?.toISOString?.() || t.start)}
              </span>
            ) : null}
          </div>
        )}
        {/* end: show track end date */}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, textAlign: 'center', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t.end && !(t.styles?.backgroundColor === 'transparent') ? (
              <span 
                style={{ cursor: 'pointer', color: 'var(--text-muted)', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                onClick={(e) => { e.stopPropagation(); onScrollToDate(t.end, index, t.end) }}
                title="終了日にスクロール"
              >
                {formatShortDateWithDay(t.end?.toISOString?.() || t.end)}
              </span>
            ) : null}
          </div>
        )}
        {/* deadline */}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, textAlign: 'center', minWidth: 0 }}>
            {deadline ? (
              <span
                style={{ cursor: 'pointer', color: isOverdue ? 'var(--status-error)' : 'var(--text-muted)', fontWeight: isOverdue ? 700 : 400, textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                onClick={(e) => { e.stopPropagation(); onScrollToDate(deadline, index, deadline) }}
                title="期限日にスクロール / Cuộn đến ngày kỳ hạn"
              >
                {formatShortDateWithDay(deadline)}
              </span>
            ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ height: rowHeight, width: rowWidth, display: 'grid', gridTemplateColumns: gridTemplate, alignItems: 'center', padding: '0 4px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: rowBg }}>
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
        <div 
          style={{ width: 14, cursor: 'pointer', textAlign: 'center', userSelect: 'none', color: 'var(--text-muted)', fontSize: 9 }} 
          onClick={() => onExpanderClick(t)}
        >
          {expanderSymbol}
        </div>
        
        <div 
          style={{ marginLeft: t.type === 'project' ? 4 : (t.isTrackHeader ? 12 : 24), flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}
          onDoubleClick={(e) => {
            if (isTask) {
              e.stopPropagation()
              onEditStep(t)
            }
          }}
        >
          {!isTask && !t.isDisabled ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
              <span 
                onClick={(e) => { e.stopPropagation(); onSelectJob(t.id); onOpenQuickView(t.originalJob!) }}
                style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 10, flex: 1, cursor: 'pointer' }} 
                title={t.name}
              >
                {t.name}
              </span>
              <button
                onClick={(e) => { 
                  e.stopPropagation();
                  let earliestStart: Date | null = null;
                  if (t.originalJob?.start_date) {
                    earliestStart = new Date(t.originalJob.start_date);
                  }
                  t.originalJob?.job_steps?.forEach((s: any) => {
                    if (s.planned_start) {
                      const sd = new Date(s.planned_start);
                      if (!earliestStart || sd < earliestStart) earliestStart = sd;
                    }
                    if (s.actual_start) {
                      const sd = new Date(s.actual_start);
                      if (!earliestStart || sd < earliestStart) earliestStart = sd;
                    }
                  });
                  const targetDate = t.originalJob?.mold_deadline ? new Date(t.originalJob.mold_deadline) : (earliestStart || new Date());
                  onSelectJob(t.id);
                  onScrollToDate(targetDate.toISOString(), index, t.originalJob?.mold_deadline);
                }}
                style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: '4px', cursor: 'pointer', color: 'var(--accent)', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: '4px', lineHeight: 1, flexShrink: 0 }}
                title="ジョブ位置へ移動 / Cuộn đến vị trí Job"
              >
                <Crosshair size={12} />
              </button>
            </div>
          ) : isTask ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0 }}>
              {(() => {
                const stepTrack = t.originalStep?.track || 'MOLD'
                const tMeta = TRACK_META[stepTrack.toUpperCase()] || { badge: '?', color: 'var(--accent)', bg: 'var(--accent-light)' }
                const isWorkLog = !!t.originalWorkLog
                const stepName = isWorkLog 
                    ? (t.originalWorkLog?.processing_name || t.name || 'N/A')
                    : (t.originalStep?.step_name || t.name || 'N/A')
                return (
                  <div 
                    style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0, cursor: 'pointer' }}
                    onDoubleClick={(e) => { e.stopPropagation(); onEditStep(t) }}
                    title="ダブルクリックして編集 / Nháy đúp để sửa"
                  >
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 14, height: 14, borderRadius: 2,
                      background: isWorkLog ? 'transparent' : tMeta.bg, 
                      color: isWorkLog ? 'var(--text-muted)' : tMeta.color,
                      fontSize: 8, fontWeight: 900, flexShrink: 0,
                      border: isWorkLog ? '1px solid var(--border-default)' : `1px solid ${tMeta.color}`, 
                      letterSpacing: '-0.5px',
                    }} title={isWorkLog ? '作業工程' : tMeta.label}>
                      {isWorkLog ? '⚙' : tMeta.badge}
                    </span>
                    <span style={{ 
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, fontSize: 9, fontWeight: 500,
                      fontStyle: isActual ? 'italic' : 'normal',
                      color: isActual ? 'var(--text-secondary)' : 'var(--text-primary)',
                    }} title={stepName}>
                      {isActual ? `↳ ${stepName} (実績)` : stepName}
                    </span>
                    {isWorkLog && t.originalWorkLog?.total_actual_hours > 0 && (
                      <span style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 600, fontFamily: 'monospace', flexShrink: 0 }}>
                        {t.originalWorkLog.total_actual_hours}H
                      </span>
                    )}
                  </div>
                )
              })()}
              {!isActual && (
                <button onClick={() => onEditStep(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} title="詳細編集">
                  <Edit2 size={10} />
                </button>
              )}
            </div>
          ) : (
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 11 }}>{t.name}</span>
          )}
        </div>
      </div>

      {isPanelExpanded && (
        <>
          <div style={{ padding: '0 4px', minWidth: 0 }}>
            {isTask && !isActual ? (
              t.originalWorkLog ? (
                <span style={{ fontSize: 9, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}
                  title={t.originalWorkLog.employee_names?.join(', ') || '-'}
                >
                  {t.originalWorkLog.employee_names?.[0] || '-'}
                </span>
              ) : (
                <select 
                  className="form-input bg-white w-full" 
                  style={{ padding: '0 2px', fontSize: 10, height: 20, borderColor: 'transparent', backgroundColor: 'transparent' }}
                  value={currentStepData?.machine_id || ''}
                  onChange={(e) => onUpdateLocalStep(step!.step_id, { machine_id: e.target.value || null })}
                >
                  <option value="">-</option>
                  {machOptions.map((m: any) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              )
            ) : null}
          </div>
          <div style={{ padding: '0 4px', textAlign: 'center', minWidth: 0, fontSize: 10 }}>
            {isTask && !isActual ? (
              t.originalWorkLog ? (
                <span style={{ fontFamily: 'monospace' }}>
                  {t.originalWorkLog.total_planned_hours || '-'}
                </span>
              ) : (
                <input 
                  type="number" 
                  className="form-input bg-white w-full text-center" 
                  style={{ padding: '0 2px', fontSize: 10, height: 20, borderColor: 'transparent', backgroundColor: 'transparent' }}
                  value={currentStepData?.planned_hours ?? ''}
                  onChange={(e) => onUpdateLocalStep(step!.step_id, { planned_hours: e.target.value ? Number(e.target.value) : null })}
                />
              )
            ) : null}
          </div>

          <div style={{ padding: '0 4px', textAlign: 'center', minWidth: 0, fontSize: 10, color: statusColor }}>
            {isTask && !isActual ? (
              t.originalWorkLog ? (
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  {t.originalWorkLog.total_actual_hours || '-'}
                </span>
              ) : (
                <span>{currentStepData?.actual_hours || '-'}</span>
              )
            ) : null}
          </div>

          <div style={{ textAlign: 'center', fontSize: 10, color: statusColor, fontWeight: 500, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t.isDisabled ? '' : statusText}
          </div>

          <div style={{ textAlign: 'center', fontSize: 10, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t.isDisabled ? '' : (
              <span 
                style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', color: statusColor }}
                onClick={(e) => { e.stopPropagation(); onScrollToDate(isTask ? currentStepData?.planned_start : t.start, index, isTask ? currentStepData?.planned_start : t.start) }}
                title="予定開始日にスクロール / Cuộn đến ngày bắt đầu"
              >
                {formatShortDateWithDay(isTask ? currentStepData?.planned_start : t.start)}
              </span>
            )}
          </div>
          
          <div style={{ textAlign: 'center', fontSize: 10, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t.isDisabled ? '' : (
              <span 
                style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', color: statusColor }}
                onClick={(e) => { e.stopPropagation(); onScrollToDate(isTask ? currentStepData?.planned_end : t.end, index, isTask ? currentStepData?.planned_end : t.end) }}
                title="予定終了日にスクロール / Cuộn đến ngày kết thúc"
              >
                {formatShortDateWithDay(isTask ? currentStepData?.planned_end : t.end)}
              </span>
            )}
          </div>

          <div style={{ padding: '0 2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 0 }}>
            {!isTask && t.originalJob?.mold_deadline ? (
              <span 
                style={{ fontSize: 10, color: statusColor, cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                onClick={(e) => { e.stopPropagation(); onScrollToDate(t.originalJob?.mold_deadline, index, t.originalJob?.mold_deadline) }}
                title="金型納期にスクロール / Cuộn đến hạn chót khuôn"
              >
                {formatShortDateWithDay(t.originalJob.mold_deadline)}
              </span>
            ) : isTask && currentStepData?.deadline ? (
              <span 
                style={{ fontSize: 10, color: statusColor, cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                onClick={(e) => { e.stopPropagation(); onScrollToDate(currentStepData.deadline, index, currentStepData.deadline) }}
                title="期限日にスクロール / Cuộn đến ngày kỳ hạn"
              >
                {formatShortDateWithDay(currentStepData.deadline)}
              </span>
            ) : isTask && currentStepData?.planned_end ? (
              <span 
                style={{ fontSize: 10, color: 'var(--accent)', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' }}
                onClick={(e) => { e.stopPropagation(); onScrollToDate(currentStepData?.planned_end, index, currentStepData?.planned_end) }}
                title="予定完了日にスクロール / Cuộn đến ngày hoàn thành dự kiến"
              >
                {formatFullDateWithDay(currentStepData?.planned_end)}
              </span>
            ) : (
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>-</span>
            )}
          </div>
        </>
      )}
    </div>
  )
})

const CustomTaskListTable = React.memo(function CustomTaskListTable({
  rowHeight, rowWidth, tasks: currentTasks, fontFamily, onExpanderClick,
  isPanelExpanded, gridTemplate, expandedJobs, expandedTracks, localSteps,
  machOptions, empOptions, compareMode, originalTasks,
  onScrollToDate, onEditStep, onUpdateLocalStep, onOpenQuickView, selectedJobId, onSelectJob,
}: TableProps) {
  return (
    <div style={{ fontFamily, fontSize: 10, color: 'var(--text-primary)', borderRight: '1px solid var(--border-default)' }}>
      {currentTasks.map((t: ExtendedTask, index: number) => {
        const originalT = originalTasks?.find((ot: any) => ot.id === t.id) || t;
        const isExpanded = originalT.type === 'project' ? expandedJobs.has(originalT.id) : (originalT.isTrackHeader ? expandedTracks.has(originalT.id) : false);
        const currentStepData = originalT.type === 'task' && originalT.originalStep ? (localSteps[originalT.originalStep.step_id] || originalT.originalStep) : null;

        return (
          <TaskRow 
            key={originalT.id}
            t={originalT}
            index={index}
            rowHeight={rowHeight}
            rowWidth={rowWidth}
            gridTemplate={gridTemplate}
            isPanelExpanded={isPanelExpanded}
            isExpanded={isExpanded}
            currentStepData={currentStepData}
            machOptions={machOptions}
            empOptions={empOptions}
            expandedTracks={expandedTracks}
            onExpanderClick={onExpanderClick}
            onScrollToDate={onScrollToDate}
            onEditStep={onEditStep}
            onUpdateLocalStep={onUpdateLocalStep}
            onOpenQuickView={onOpenQuickView}
            selectedJobId={selectedJobId}
            onSelectJob={onSelectJob}
          />
        )
      })}
    </div>
  )
})
const StaticHeaderComponent = React.memo(function StaticHeaderComponent(props: any) {
  const ctx = React.useContext(GanttHandlersContext)
  if (!ctx) return null
  return (
    <CustomTaskListHeader
      {...props}
      isPanelExpanded={ctx.isPanelExpanded}
      gridTemplate={ctx.gridTemplate}
      onExpandAll={ctx.onExpandAll}
      onCollapseAll={ctx.onCollapseAll}
    />
  )
})

const StaticTableComponent = React.memo(function StaticTableComponent(props: any) {
  const ctx = React.useContext(GanttHandlersContext)
  const data = React.useContext(GanttDataContext)
  if (!ctx || !data) return null
  return (
    <CustomTaskListTable
      {...props}
      isPanelExpanded={ctx.isPanelExpanded}
      gridTemplate={ctx.gridTemplate}
      expandedJobs={data.expandedJobs}
      expandedTracks={data.expandedTracks}
      localSteps={data.localSteps}
      machOptions={ctx.machOptions}
      empOptions={ctx.empOptions}
      compareMode={ctx.compareMode}
      onExpanderClick={ctx.onExpanderClick}
      onScrollToDate={ctx.onScrollToDate}
      onEditStep={ctx.onEditStep}
      onUpdateLocalStep={ctx.onUpdateLocalStep}
      onOpenQuickView={ctx.onOpenQuickView}
      selectedJobId={data.selectedJobId}
      onSelectJob={ctx.onSelectJob}
      originalTasks={data.originalTasks}
    />
  )
})

// ─── Main Component ──────────────────────────────────────────────────────────

export default function MoldJobGantt({ jobs, employees = [], machines = [], initialFromDate, initialToDate }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Stable supabase client — never re-created on render
  const supabaseRef = useRef(createClient())
  const supabase = supabaseRef.current

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day)
  const [compareMode, setCompareMode] = useState<'PLANNED' | 'ACTUAL' | 'COMPARE'>('PLANNED')
  const [isPanelExpanded, setIsPanelExpanded] = useState(true)
  const [activePreset, setActivePreset] = useState<string>('')
  
  const [editingJobId, setEditingJobId] = useState<string | null>(null)
  const [editingStep, setEditingStep] = useState<any>(null)
  const [editingWorklog, setEditingWorklog] = useState<any>(null)
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set())
  const [expandedTracks, setExpandedTracks] = useState<Set<string>>(new Set())
  const [visibleMonth, setVisibleMonth] = useState<string>('')
  const [quickViewJob, setQuickViewJob] = useState<JobForGantt | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const [ganttHeight, setGanttHeight] = useState(600)

  // Local state for edits
  const [localSteps, setLocalSteps] = useState<Record<string, Partial<JobStepRow>>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Draft Mode / Auto-Scheduling State
  const [isDraftMode, setIsDraftMode] = useState(false)
  const [draftJobs, setDraftJobs] = useState<JobForGantt[]>([])
  const [draftUpdates, setDraftUpdates] = useState<any[]>([])
  const [isDraftSaving, setIsDraftSaving] = useState(false)

  // Date Filters
  const [fromDate, setFromDate] = useState<string>(initialFromDate || '')
  const [toDate, setToDate] = useState<string>(initialToDate || '')

  // Keep refs so callbacks can access latest without re-creating
  const fromDateRef = useRef(fromDate)
  const toDateRef = useRef(toDate)
  const viewModeRef = useRef(viewMode)
  const compareModeRef = useRef(compareMode)
  const tasksRef = useRef<ExtendedTask[]>([])
  const localStepsRef = useRef(localSteps)
  useEffect(() => { fromDateRef.current = fromDate }, [fromDate])
  useEffect(() => { toDateRef.current = toDate }, [toDate])
  useEffect(() => { viewModeRef.current = viewMode }, [viewMode])
  useEffect(() => { compareModeRef.current = compareMode }, [compareMode])
  useEffect(() => { localStepsRef.current = localSteps }, [localSteps])

  // Sync state from URL changes
  useEffect(() => {
    if (!searchParams) return;
    const s = searchParams.get('from');
    const e = searchParams.get('to');
    
    let updated = false;
    if (s && s !== fromDateRef.current) { setFromDate(s); updated = true; }
    if (e && e !== toDateRef.current) { setToDate(e); updated = true; }
    
    // Guess the preset if from/to are set
    if (updated && s && e) {
       const ds = new Date(s);
       const de = new Date(e);
       const diffDays = Math.round((de.getTime() - ds.getTime()) / (1000 * 3600 * 24));
       if (diffDays === 6 || diffDays === 7) setActivePreset('WEEK');
       else if (diffDays >= 28 && diffDays <= 31) setActivePreset('MONTH');
       else setActivePreset('DAY');
    }
  }, [searchParams]);

  const handleApplyDateFilter = useCallback((startStr?: string, endStr?: string) => {
    const s = startStr !== undefined ? startStr : fromDateRef.current;
    const e = endStr !== undefined ? endStr : toDateRef.current;
    const params = new URLSearchParams(window.location.search);
    if (s) params.set('from', s);
    else params.delete('from');
    if (e) params.set('to', e);
    else params.delete('to');
    router.push(`?${params.toString()}`);
  }, [router]);

  // Unified view range
  const setViewRange = useCallback((range: 'DAY' | 'WEEK' | 'MONTH') => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let start = new Date(today)
    let end = new Date(today)

    if (range === 'DAY') {
      setViewMode(ViewMode.Day)
    } else if (range === 'WEEK') {
      setViewMode(ViewMode.Day)
      const day = today.getDay()
      const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1)
      start.setDate(diffToMonday)
      end = new Date(start)
      end.setDate(end.getDate() + 6)
    } else {
      setViewMode(ViewMode.Day)
      start = new Date(today.getFullYear(), today.getMonth(), 1)
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    }

    setActivePreset(range)
    const sStr = start.toISOString().split('T')[0]
    const eStr = end.toISOString().split('T')[0]
    setFromDate(sStr)
    setToDate(eStr)
    handleApplyDateFilter(sStr, eStr)
  }, [handleApplyDateFilter])

  const handleTodayClick = useCallback(() => setViewRange('WEEK'), [setViewRange])

  const shiftDateRange = useCallback((direction: 1 | -1) => {
    const s = fromDateRef.current ? new Date(fromDateRef.current) : new Date()
    const e = toDateRef.current ? new Date(toDateRef.current) : new Date()
    
    if (activePreset === 'MONTH') {
       s.setMonth(s.getMonth() + direction)
       e.setMonth(e.getMonth() + direction)
       const lastDay = new Date(e.getFullYear(), e.getMonth() + 1, 0)
       e.setDate(lastDay.getDate())
    } else if (activePreset === 'WEEK') {
       s.setDate(s.getDate() + direction * 7)
       e.setDate(e.getDate() + direction * 7)
    } else if (activePreset === 'DAY') {
       s.setDate(s.getDate() + direction * 1)
       e.setDate(e.getDate() + direction * 1)
    } else {
       const diffTime = Math.abs(e.getTime() - s.getTime())
       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
       s.setDate(s.getDate() + direction * diffDays)
       e.setDate(e.getDate() + direction * diffDays)
    }
    
    const sStr = s.toISOString().split('T')[0]
    const eStr = e.toISOString().split('T')[0]
    setFromDate(sStr)
    setToDate(eStr)
    handleApplyDateFilter(sStr, eStr)
  }, [activePreset, handleApplyDateFilter])

  const empOptions = useMemo(() => employees.map(e => ({ id: e.employee_id, label: e.employee_name })), [employees])
  const machOptions = useMemo(() => machines.map(m => ({ id: m.machine_id, label: m.machine_name })), [machines])

  // mergedJobs for display in sidebar ONLY (NOT used for Gantt task bars)
  // This is intentionally NOT used for the tasks useMemo
  const mergedJobs = useMemo(() => {
    return jobs.map(job => {
      if (!job.job_steps) return job;
      const updatedSteps = job.job_steps.map(step => {
        const local = localSteps[step.step_id]
        if (!local) return step;
        return { ...step, ...local }
      })
      return { ...job, job_steps: updatedSteps }
    })
  }, [jobs, localSteps])

  // tasks useMemo uses ONLY jobs (not localSteps) so that inline edits
  // don't cause the entire Gantt SVG to re-render
  const tasks = useMemo<ExtendedTask[]>(() => {
    const result: ExtendedTask[] = []
    const displayJobs = isDraftMode ? draftJobs : jobs

    const BOUND_START = fromDate ? new Date(fromDate) : new Date()
    const BOUND_END = toDate ? new Date(toDate + ' 23:59:59') : new Date()
    
    const clampDate = (d: Date) => {
        // Only clamp insane dates to prevent gantt-task-react from crashing
        if (d.getTime() > 4000000000000) return new Date(BOUND_END) // Year 2096+
        if (d.getTime() < 1000000000000) return new Date(BOUND_START) // Year 2001-
        return d
    }

    // Use RAW jobs (not mergedJobs) so localSteps edits don't trigger SVG re-render
    displayJobs.forEach(job => {
      const s = JOB_STATUS[job.job_status || 'NEW'] || JOB_STATUS.NEW
      
      let projStart = new Date(8640000000000000)
      let projEnd = new Date(-8640000000000000)
      let hasValidSteps = false

      job.job_steps?.forEach(step => {
        const dates: Date[] = []
        if (step.planned_start) dates.push(new Date(step.planned_start))
        if (step.planned_end) dates.push(new Date(step.planned_end))
        if (step.actual_start) dates.push(new Date(step.actual_start))
        if (step.actual_end) dates.push(new Date(step.actual_end))
        
        const wls = (step as any).work_logs || []
        wls.forEach((wl: any) => {
            if (wl.work_date) {
                dates.push(new Date(wl.work_date))
                dates.push(new Date(new Date(wl.work_date).getTime() + 86400000))
            }
        })

        if (dates.length > 0) {
            const minD = new Date(Math.min(...dates.map(d => d.getTime())))
            const maxD = new Date(Math.max(...dates.map(d => d.getTime())))
            if (minD < projStart) projStart = minD
            if (maxD > projEnd) projEnd = maxD
            hasValidSteps = true
        }
      })

      if (!hasValidSteps) {
        if (job.mold_deadline) {
            projEnd = new Date(job.mold_deadline)
            projStart = new Date(projEnd)
            projStart.setDate(projStart.getDate() - 3)
        } else {
            projStart = new Date()
            projEnd = new Date()
            projEnd.setDate(projEnd.getDate() + 1)
        }
      }

      let cProjStart = clampDate(projStart)
      let cProjEnd = clampDate(projEnd)
      if (cProjStart.getTime() > cProjEnd.getTime()) cProjStart = new Date(cProjEnd)
      if (cProjStart.getTime() === cProjEnd.getTime()) cProjEnd.setHours(cProjEnd.getHours() + 1)

      result.push({
        id: job.job_id,
        name: (job as any).mold_masters?.products?.product_name || (job as any).products?.product_name
          ? `${job.job_code} ${(job as any).mold_masters?.products?.product_name || (job as any).products?.product_name}`
          : job.job_name || job.job_code,
        start: cProjStart,
        end: cProjEnd,
        progress: job.overall_progress || 0,
        type: 'project',
        hideChildren: !expandedJobs.has(job.job_id),
        styles: { backgroundColor: s.color, progressColor: s.progressColor },
        originalJob: job,
      })

      // Infer track from item_types if available, fallback to step_name for legacy
      job.job_steps?.forEach(s => {
          const itemTypes = (s as any).item_types
          if (itemTypes?.item_type_code) {
              s.track = itemTypes.item_type_code
          } else if (!s.track && s.step_name) {
              const upperName = s.step_name.toUpperCase()
              if (upperName.includes('PLUG') || upperName.includes('プラグ')) s.track = 'PLUG'
              else if (upperName.includes('CUTTER') || upperName.includes('抜型')) s.track = 'CUTTER'
              else if (upperName.includes('FINISH') || upperName.includes('仕上げ')) s.track = 'FINISH'
              else s.track = 'MOLD'
          }
      })

      // ─── Group steps by track (= item_type_code) ─────────────────────────
      const TRACK_ORDER = ['ALUMI', 'MOLD', 'PLUG', 'CUTTER', 'WATER COOLING BASE', 'PRESSIER BASE', 'STAKING', 'FRAME', 'MACHINE', 'OTHER', 'TEST MOLD', 'FINISH']
      const stepsByTrack = new Map<string, typeof job.job_steps>()

      job.job_steps?.forEach(step => {
        const track = (step.track || 'MOLD').toUpperCase()
        if (!stepsByTrack.has(track)) stepsByTrack.set(track, [])
        stepsByTrack.get(track)!.push(step)
      })

      // Ordered list of tracks that have steps, maintaining TRACK_ORDER + any extras
      const presentTracks = TRACK_ORDER.filter(t => stepsByTrack.has(t))
      stepsByTrack.forEach((_, k) => { if (!TRACK_ORDER.includes(k)) presentTracks.push(k) })

      const makeDateRange = (startDate: Date, endDate: Date, hasDates: boolean) => {
          let cs = clampDate(new Date(startDate))
          let ce = clampDate(new Date(endDate))
          if (cs.getTime() > ce.getTime()) cs = new Date(ce)
          if (cs.getTime() === ce.getTime() || !hasDates) ce.setHours(ce.getHours() + 1)
          return { start: cs, end: ce }
      }

      // If job is not expanded, don't push its tracks or steps
      if (!expandedJobs.has(job.job_id)) return;

      presentTracks.forEach(trackCode => {
        const trackSteps = stepsByTrack.get(trackCode) || []

        // Track summary stats
        const completedCount = trackSteps.filter(s => (s as any).processing_statuses?.status_code?.includes('完了') || s.step_status === 'COMPLETED').length
        const trackProgress = trackSteps.length > 0 ? Math.round((completedCount / trackSteps.length) * 100) : 0

        // ── Compute track deadline from step deadlines (Vấn đề 2) ──
        // Priority: 1) Earliest step deadline in this track  2) Job mold_deadline  3) null
        let trackDeadline: string | null = null
        trackSteps.forEach(s => {
          if (s.deadline) {
            const dStr = typeof s.deadline === 'string' ? s.deadline.split('T')[0] : s.deadline
            if (!trackDeadline || dStr < trackDeadline) trackDeadline = dStr
          }
        })
        if (!trackDeadline && (trackCode === 'MOLD' || trackCode === 'FINISH')) {
          trackDeadline = job.mold_deadline || null
        }

        // ── Compute track bar span from ALL sources (Vấn đề 3) ──
        // Include: step planned_start/end, step actual_start/end, worklog work_dates
        let tStart = new Date(8640000000000000)
        let tEnd   = new Date(-8640000000000000)
        let tHasDates = false
        let trackTotalActualHours = 0
        let trackTotalPlannedHours = 0
        
        trackSteps.forEach(s => {
          if (s.planned_start) { const d = new Date(s.planned_start); if (d < tStart) tStart = d; tHasDates = true }
          if (s.planned_end)   { const d = new Date(s.planned_end);   if (d > tEnd)   tEnd = d;   tHasDates = true }
          if (s.actual_start)  { const d = new Date(s.actual_start);  if (d < tStart) tStart = d; tHasDates = true }
          if (s.actual_end)    { const d = new Date(s.actual_end);    if (d > tEnd)   tEnd = d;   tHasDates = true }
          
          // Aggregate from worklogs (Vấn đề 3: track bar from children)
          const wls = (s as any).work_logs || []
          wls.forEach((wl: any) => {
            if (wl.work_date) {
              const wd = new Date(wl.work_date)
              if (wd < tStart) tStart = new Date(wd)
              const wdEnd = new Date(wd.getTime() + 86400000)
              if (wdEnd > tEnd) tEnd = new Date(wdEnd)
              tHasDates = true
            }
            trackTotalActualHours += (wl.hours_spent || 0)
            trackTotalPlannedHours += (wl.planned_hours || 0)
          })
        })

        // Use deadline as fallback for bar end
        if (!tHasDates && trackDeadline) {
          tEnd = new Date(trackDeadline)
          tStart = new Date(tEnd.getTime() - 7 * 86400000) // 1 week before deadline
          tHasDates = true
        }
        if (!tHasDates) { tStart = new Date(projStart); tEnd = new Date(projEnd) }
        if (tStart.getTime() > tEnd.getTime()) tEnd = new Date(tStart.getTime() + 3600000)
        const { start: ctStart, end: ctEnd } = makeDateRange(tStart, tEnd, tHasDates)

        const trackId = `${job.job_id}_track_${trackCode}`

        // Track Header row - now always visible
        const trackBarStyle = { 
            backgroundColor: 'var(--accent-light, #e0f2f1)', 
            progressColor: 'var(--accent)', 
            backgroundSelectedColor: 'var(--accent-light)' 
        }

        // Container step = any step that has item_type_id (linked to item_types table)
        const containerStep = trackSteps.find(s => (s as any).item_type_id != null)
        
        // Priority 1: Manual status from Container Step
        let finalTrackStatus = containerStep?.processing_statuses?.status_code || null;

        // Priority 2: Auto-calculate from Level 3 (work_logs)
        if (!finalTrackStatus) {
            let totalLogs = 0;
            let finishedLogs = 0;
            let hasHours = false;

            trackSteps.forEach(s => {
                const wls = (s as any).work_logs || [];
                totalLogs += wls.length;
                wls.forEach((wl: any) => {
                    // A worklog is "finished" if is_finished=true OR its status contains 完了
                    const statusCode = wl.processing_statuses?.status_code || '';
                    if (wl.is_finished || statusCode.includes('完了')) finishedLogs++;
                    if (wl.hours_spent > 0) hasHours = true;
                });
            });

            if (totalLogs > 0 && finishedLogs === totalLogs) {
                finalTrackStatus = 'COMPLETED';
            } else if (finishedLogs > 0 || hasHours || trackTotalActualHours > 0) {
                finalTrackStatus = 'IN_PROGRESS';
            } else {
                finalTrackStatus = 'NEW';
            }
        }

        result.push({
          id: trackId,
          name: '',
          start: ctStart,
          end: ctEnd,
          progress: trackProgress,
          type: 'task',
          project: job.job_id,
          originalJobId: job.job_id,
          originalStep: containerStep,
          dependencies: [],
          styles: trackBarStyle,
          isTrackHeader: true,
          trackCode,
          trackProgress,
          trackDeadline,
          trackStepCount: trackSteps.length,
          trackCompletedCount: completedCount,
          trackTotalActualHours: Math.round(trackTotalActualHours * 100) / 100,
          trackTotalPlannedHours: trackTotalPlannedHours,
          trackStatus: finalTrackStatus,
        } as ExtendedTask)

        // If track is not expanded, don't push its steps
        if (!expandedTracks.has(trackId)) return;

        // Function to push task rows (reused for step or worklogs)
        const pushTaskRows = (
            taskId: string, name: string,
            pStart: Date, pEnd: Date, hasPlanned: boolean,
            aStart: Date, aEnd: Date, hasActual: boolean,
            progress: number, stepS: any,
            originalStep: any, originalWorkLog: any = null,
            dependencies: string[] = []
        ) => {
            const { start: cPStart, end: cPEnd } = makeDateRange(pStart, pEnd, hasPlanned);
            const { start: cAStart, end: cAEnd } = makeDateRange(aStart, aEnd, hasActual);

            if (compareMode === 'PLANNED') {
                result.push({
                    id: taskId + '_planned',
                    name: hasPlanned ? name : '',
                    start: cPStart, end: cPEnd,
                    progress, type: 'task', project: trackId, dependencies: hasPlanned ? dependencies : [],
                    styles: hasPlanned 
                        ? (isDraftMode 
                            ? { backgroundColor: '#f3e8ff', progressColor: '#a855f7', backgroundSelectedColor: '#a855f7' } // Purple for draft
                            : { backgroundColor: stepS.color, progressColor: stepS.progressColor }) 
                        : { backgroundColor: 'var(--planned-ghost)', progressColor: 'transparent', backgroundSelectedColor: 'transparent' },
                    originalStep, originalWorkLog, originalJobId: job.job_id, isActualRow: false
                });
            } else if (compareMode === 'ACTUAL') {
                if (hasActual) {
                    result.push({
                        id: taskId + '_actual', name, start: cAStart, end: cAEnd, progress: 100, type: 'task', project: trackId, dependencies: [],
                        styles: { backgroundColor: stepS.color, progressColor: stepS.progressColor, backgroundSelectedColor: stepS.progressColor },
                        originalStep, originalWorkLog, originalJobId: job.job_id, isActualRow: true
                    });
                } else {
                    result.push({
                        id: taskId + '_actual', name: '', start: cPStart, end: cPEnd, progress: 0, type: 'task', project: trackId, dependencies: [],
                        styles: { backgroundColor: 'var(--actual-ghost)', progressColor: 'transparent', backgroundSelectedColor: 'transparent' },
                        originalStep, originalWorkLog, originalJobId: job.job_id, isActualRow: true
                    });
                }
            } else if (compareMode === 'COMPARE') {
                result.push({
                    id: taskId + '_planned', name: hasPlanned ? name : '', start: cPStart, end: cPEnd, progress: 0, type: 'task', project: trackId, dependencies: hasPlanned ? dependencies : [],
                    styles: isDraftMode 
                        ? { backgroundColor: 'var(--compare-draft)', progressColor: 'transparent', backgroundSelectedColor: 'transparent' }
                        : { backgroundColor: 'var(--compare-planned)', progressColor: 'transparent', backgroundSelectedColor: 'transparent' },
                    originalStep, originalWorkLog, originalJobId: job.job_id, isActualRow: false
                });
                if (hasActual) {
                    result.push({
                        id: taskId + '_actual', name, start: cAStart, end: cAEnd, progress: 100, type: 'task', project: trackId, dependencies: [],
                        styles: { backgroundColor: stepS.color, progressColor: stepS.progressColor, backgroundSelectedColor: stepS.progressColor },
                        originalStep, originalWorkLog, originalJobId: job.job_id, isActualRow: true
                    });
                } else {
                    result.push({
                        id: taskId + '_actual', name: '', start: cPStart, end: cPEnd, progress: 0, type: 'task', project: trackId, dependencies: [],
                        styles: { backgroundColor: 'var(--actual-ghost)', progressColor: 'transparent', backgroundSelectedColor: 'transparent' },
                        originalStep, originalWorkLog, originalJobId: job.job_id, isActualRow: true
                    });
                }
            }
        };

        // Individual step bars
        trackSteps.sort((a, b) => (a.step_no || 0) - (b.step_no || 0)).forEach((step, index) => {
          const dependencies = index > 0 ? [trackSteps[index - 1].step_id + '_planned'] : []
          const stepStatusCode = (step as any).processing_statuses?.status_code;
          const progress = stepStatusCode ? resolveProgress(stepStatusCode) : (step.step_status === 'COMPLETED' ? 100 : step.step_status === 'IN_PROGRESS' ? 50 : 0);
          const stepS = stepStatusCode ? resolveStatusColor(stepStatusCode) : (STEP_STATUS[step.step_status || 'PENDING'] || STEP_STATUS.PENDING);
          // Container step = has item_type_id (linked to item_types lookup table)
          const isContainerStep = (step as any).item_type_id != null
          const wls = (step as any).work_logs || []

          if (isContainerStep && wls.length > 0) {
              // ── Container step with worklogs: render worklogs as Level 3 ──
              // Group worklogs by processing_code_id
              const wlGroups = new Map<number | string, typeof wls>()
              wls.forEach((wl: any) => {
                  const key = wl.processing_code_id ?? 'none'
                  if (!wlGroups.has(key)) wlGroups.set(key, [])
                  wlGroups.get(key)!.push(wl)
              })

              let subIndex = 0
              wlGroups.forEach((logs, codeId) => {
                  // Processing name from the code, NOT employee name
                  const procName = logs[0]?.processing_codes?.processing_name || '作業'
                  
                  // Sum actual hours across all entries in this group
                  const totalActualHours = logs.reduce((sum: number, l: any) => sum + (l.hours_spent || 0), 0)
                  
                  // Get planned hours from first log's planned_hours (user-entered)
                  const totalPlannedHours = logs[0]?.planned_hours || 0
                  
                  // Collect unique employees for tooltip
                  const employeeNames = [...new Set(logs.map((l: any) => l.employees?.employee_name).filter(Boolean))]

                  // Calculate ACTUAL date range from work_date entries
                  let earliestDate: Date | null = null
                  let latestDate: Date | null = null
                  logs.forEach((l: any) => {
                      if (l.work_date) {
                          const wd = new Date(l.work_date)
                          if (!earliestDate || wd < earliestDate) earliestDate = new Date(wd)
                          if (!latestDate || wd > latestDate) latestDate = new Date(wd)
                      }
                  })
                  const hasActualWl = !!(earliestDate && latestDate)
                  
                  // ── Calculate PLANNED date range ──
                  // Priority: 1) planned_date from worklog  2) step deadline  3) fallback to actual dates
                  let pStart: Date
                  let pEnd: Date
                  let hasPlannedWl: boolean
                  
                  if (logs[0]?.planned_date) {
                      // User explicitly set a planned date
                      pStart = new Date(logs[0].planned_date)
                      const daysNeeded = totalPlannedHours > 0 ? Math.ceil(totalPlannedHours / 8) : 1
                      pEnd = new Date(pStart.getTime() + daysNeeded * 86400000)
                      hasPlannedWl = true
                  } else if (step.deadline || step.planned_end) {
                      // Calculate backwards from step deadline
                      const baseEnd = new Date(step.deadline || step.planned_end!)
                      const daysNeeded = totalPlannedHours > 0 ? Math.ceil(totalPlannedHours / 8) : 1
                      pStart = new Date(baseEnd.getTime() - daysNeeded * 86400000)
                      pEnd = new Date(baseEnd)
                      hasPlannedWl = true
                  } else if (hasActualWl) {
                      // No planned dates but has actual data → show ghost bar at actual position
                      // hasPlannedWl stays FALSE → pushTaskRows renders ghost/dashed bar in PLANNED mode
                      pStart = new Date(earliestDate!)
                      pEnd = new Date(latestDate!.getTime() + 86400000)
                      hasPlannedWl = false
                  } else {
                      // No data at all → use project range
                      pStart = new Date(projStart)
                      pEnd = new Date(projStart)
                      pEnd.setDate(pEnd.getDate() + 1)
                      hasPlannedWl = false
                  }
                  
                  // Actual date range
                  let aStart: Date = earliestDate || pStart
                  let aEnd: Date = latestDate ? new Date((latestDate as unknown as Date).getTime() + 86400000) : pEnd

                  const wlId = `${step.step_id}_wl_${codeId}_${subIndex}`
                  const wProgress = hasActualWl ? 50 : 0

                  // Build the enriched worklog info for UI display
                  const workLogInfo = {
                      ...logs[0],
                      processing_name: procName,
                      total_actual_hours: Math.round(totalActualHours * 100) / 100,
                      total_planned_hours: totalPlannedHours,
                      employee_names: employeeNames,
                      log_count: logs.length,
                  }

                  pushTaskRows(
                      wlId, procName,
                      pStart, pEnd, hasPlannedWl,
                      aStart, aEnd, hasActualWl,
                      wProgress, stepS,
                      step, workLogInfo,
                      []
                  )
                  subIndex++
              })
          } else if (isContainerStep && wls.length === 0) {
              // Container step with NO worklogs: skip (track header already represents it)
              // Vấn đề 1: IRI-015 shows empty MOLD row → don't render
          } else {
              // ── Normal step: render as-is ──
              const hasPlanned = !!(step.planned_start && step.planned_end)
              const hasActual  = !!(step.actual_start  && step.actual_end)
              const pStart = hasPlanned ? new Date(step.planned_start!) : new Date(projStart)
              const pEnd   = hasPlanned ? new Date(step.planned_end!)   : new Date(projStart)
              const aStart = hasActual ? new Date(step.actual_start!) : new Date(projStart)
              const aEnd   = hasActual ? new Date(step.actual_end!) : new Date(projStart)

              pushTaskRows(
                  step.step_id, step.step_name || 'N/A',
                  pStart, pEnd, hasPlanned,
                  aStart, aEnd, hasActual,
                  progress, stepS,
                  step, null, dependencies
              )
          }
        })
      })

    })

    if (result.length === 0) {
      result.push({
        id: 'dummy',
        name: 'スケジュールなし',
        start: new Date(),
        end: new Date(Date.now() + 86400000),
        progress: 0,
        type: 'project',
        isDisabled: true
      })
    }

    let effectiveFrom = fromDate || initialFromDate
    let effectiveTo = toDate || initialToDate
    
    if (result.length > 0) {
        // Compute the widest date range from ALL tasks + deadlines, 
        // NOT just the data query range (from/to).
        // This allows scrolling to deadlines outside the query period.
        let gridMin = new Date(8640000000000000)
        let gridMax = new Date(-8640000000000000)
        
        // Include effective query range as minimum
        if (effectiveFrom) {
          const ef = new Date(effectiveFrom)
          if (!isNaN(ef.getTime()) && ef < gridMin) gridMin = new Date(ef)
        }
        if (effectiveTo) {
          const et = new Date(effectiveTo)
          if (!isNaN(et.getTime()) && et > gridMax) gridMax = new Date(et)
        }
        
        // Include ALL task dates
        result.forEach(t => {
          if (t.start && t.start < gridMin) gridMin = new Date(t.start)
          if (t.end && t.end > gridMax) gridMax = new Date(t.end)
        })
        
        // Include deadlines from jobs (may extend beyond task dates)
        jobs.forEach((job: any) => {
          if (job.mold_deadline) {
            const dl = new Date(job.mold_deadline)
            if (!isNaN(dl.getTime())) {
              if (dl < gridMin) gridMin = new Date(dl)
              // Extend 2 weeks after latest deadline to give visual room
              const dlPlus = new Date(dl.getTime() + 14 * 86400000)
              if (dlPlus > gridMax) gridMax = new Date(dlPlus)
            }
          }
          // Include step deadlines
          job.job_steps?.forEach((step: any) => {
            if (step.deadline) {
              const sd = new Date(step.deadline)
              if (!isNaN(sd.getTime())) {
                if (sd < gridMin) gridMin = new Date(sd)
                const sdPlus = new Date(sd.getTime() + 7 * 86400000)
                if (sdPlus > gridMax) gridMax = new Date(sdPlus)
              }
            }
          })
        })
        
        // Add padding: 1 week before, 2 weeks after
        gridMin.setDate(gridMin.getDate() - 7)
        gridMax.setDate(gridMax.getDate() + 14)
        
        if (!isNaN(gridMin.getTime()) && !isNaN(gridMax.getTime()) && gridMin < gridMax) {
            result.push({
                id: 'dummy_timeline_bound',
                name: '',
                start: gridMin,
                end: gridMax,
                progress: 0,
                type: 'task',
                isDisabled: true,
                styles: { backgroundColor: 'transparent', progressColor: 'transparent', backgroundSelectedColor: 'transparent' },
                isActualRow: false
            })
        }
    }

    return result
  }, [jobs, draftJobs, isDraftMode, compareMode, expandedJobs, expandedTracks, fromDate, toDate, initialFromDate, initialToDate])

  // Keep tasksRef updated without triggering re-renders
  tasksRef.current = tasks;

  // Fix Gantt Japanese Calendar Format via DOM manipulation after render
  useEffect(() => {
    if (!wrapperRef.current) return;
    
    const updateHeaders = () => {
      if (!wrapperRef.current) return;
      const svgs = wrapperRef.current.querySelectorAll('svg');
      let headerSvg: SVGSVGElement | null = null;
      let chartSvg: SVGSVGElement | null = null;
      for (let i = 0; i < svgs.length; i++) {
        if (svgs[i].getAttribute('width') && parseInt(svgs[i].getAttribute('width') || '0') > 100) {
          if (!headerSvg) headerSvg = svgs[i];
          else { chartSvg = svgs[i]; break; }
        }
      }

      if (headerSvg) {
        headerSvg.querySelectorAll('text').forEach(el => {
          const y = parseFloat(el.getAttribute('y') || '0');
          const txt = el.textContent;
          if (!txt) return;

          if (y > 25) { // Bottom row
            el.classList.add('gantt-bottom-text');
            if (txt.includes(',') && !txt.includes('（')) {
              const parts = txt.split(',');
              if (parts.length === 2) {
                el.textContent = `${parts[1].trim()}（${parts[0].trim()}）`;
              }
            }
          } else if (y > 0 && y <= 25) { // Top row
            el.classList.add('gantt-top-text');
            if (txt.match(/(\d+)月\s*(\d+)/)) {
              el.textContent = txt.replace(/(\d+)月\s*(\d+)/, '$2年$1月');
            }
          }
        });
      }

      if (chartSvg) {
        chartSvg.querySelectorAll('text').forEach(el => {
          el.classList.add('gantt-bar-label');
        });
      }
    };
    
    // Run immediately and after a short delay to ensure SVG is mounted
    updateHeaders();
    const timer = setTimeout(updateHeaders, 50);
    return () => clearTimeout(timer);
  }, [tasks, viewMode, fromDate, toDate, compareMode]);

  // Track visible month based on scroll position
  useEffect(() => {
    if (!wrapperRef.current) return;
    let scrollContainer: HTMLElement | null = null;
    const svgs = wrapperRef.current.querySelectorAll('svg');
    for (let i = 0; i < svgs.length; i++) {
      if (svgs[i].getAttribute('width') && parseInt(svgs[i].getAttribute('width') || '0') > 100) {
        scrollContainer = svgs[i].parentElement;
        break;
      }
    }
    if (!scrollContainer) return;

    const updateVisibleMonth = () => {
      if (!scrollContainer) return;
      const centerPixel = scrollContainer.scrollLeft + scrollContainer.clientWidth / 2;
      const texts = scrollContainer.querySelectorAll('svg text');
      let closestText = '';
      let minDiff = Infinity;
      
      texts.forEach(el => {
        const y = parseFloat(el.getAttribute('y') || '0');
        if (y > 0 && y <= 25) { // Top row (months/years)
          const x = parseFloat(el.getAttribute('x') || '0');
          const diff = Math.abs(x - centerPixel);
          if (diff < minDiff) {
            minDiff = diff;
            closestText = el.textContent || '';
          }
        }
      });
      if (closestText) {
        setVisibleMonth(prev => prev !== closestText ? closestText : prev);
      }
    };

    const timer = setTimeout(updateVisibleMonth, 100);
    scrollContainer.addEventListener('scroll', updateVisibleMonth, { passive: true });
    return () => {
      clearTimeout(timer);
      scrollContainer?.removeEventListener('scroll', updateVisibleMonth);
    };
  }, [tasks, viewMode, fromDate, toDate, compareMode]);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setGanttHeight(Math.floor(entry.contentRect.height) - 58);
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Fix for gantt-task-react scroll bouncing / infinite loop bug
  // We stop the 'wheel' event in the capture phase so gantt-task-react 
  // does not trigger its buggy manual handleWheel logic which fights with native scroll.
  useEffect(() => {
    const container = wrapperRef.current;
    if (!container) return;
    
    const stopWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };
    
    container.addEventListener('wheel', stopWheel, { capture: true, passive: false });
    return () => container.removeEventListener('wheel', stopWheel, { capture: true });
  }, []);

  const updateLocalStep = useCallback((stepId: string, updates: Partial<JobStepRow>) => {
    setLocalSteps(prev => ({
      ...prev,
      [stepId]: { ...(prev[stepId] || {}), ...updates }
    }));
  }, []);

  const handleTaskChange = useCallback(async (task: Task, children: Task[]) => {
    try {
      if (task.type === 'project') {
        const originalProj = tasksRef.current.find(t => t.id === task.id);
        if (originalProj && originalProj.start) {
          const deltaMs = task.start.getTime() - originalProj.start.getTime();
          if (deltaMs !== 0) {
            await shiftJobDates(task.id, deltaMs);
            router.refresh();
          }
        }
        return;
      }

      const realId = task.id.replace('_planned', '').replace('_actual', '');
      setLocalSteps(prev => ({
        ...prev,
        [realId]: { ...(prev[realId] || {}), planned_start: task.start.toISOString(), planned_end: task.end.toISOString() }
      }));

      if (children && children.length > 0) {
        for (const child of children) {
          const childRealId = child.id.replace('_planned', '').replace('_actual', '');
          setLocalSteps(prev => ({
            ...prev,
            [childRealId]: { ...(prev[childRealId] || {}), planned_start: child.start.toISOString(), planned_end: child.end.toISOString() }
          }));
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [router])

  const handleSaveChanges = useCallback(async () => {
    const steps = localStepsRef.current
    if (Object.keys(steps).length === 0) return
    setIsSaving(true)
    try {
      for (const [stepId, updates] of Object.entries(steps)) {
        const updatePayload: any = {}
        if (updates.planned_start) updatePayload.planned_start = updates.planned_start
        if (updates.planned_end) updatePayload.planned_end = updates.planned_end
        if (updates.assigned_to !== undefined) updatePayload.assigned_to = updates.assigned_to
        if (updates.machine_id !== undefined) updatePayload.machine_id = updates.machine_id
        if (updates.planned_hours !== undefined) updatePayload.planned_hours = updates.planned_hours

        if (Object.keys(updatePayload).length > 0) {
          const { error } = await supabase.from('job_steps').update(updatePayload).eq('step_id', stepId)
          if (error) console.error("Error updating step", stepId, error)
        }
      }
      setLocalSteps({})
      router.refresh()
    } catch (e) {
      console.error(e)
      alert("保存エラー / Lỗi khi lưu")
    } finally {
      setIsSaving(false)
    }
  }, [supabase, router]) // localSteps read via ref — no re-create on each edit

  const handleCancelChanges = useCallback(() => {
    if (confirm("未保存の変更を破棄しますか？")) {
      setLocalSteps({})
    }
  }, [])

  const handleExpanderClick = useCallback((task: Task) => {
    if (task.type === 'project') {
      setExpandedJobs(prev => {
        const next = new Set(prev)
        if (next.has(task.id)) next.delete(task.id)
        else next.add(task.id)
        return next
      })
    } else if (task.id.includes('_track_')) {
      setExpandedTracks(prev => {
        const next = new Set(prev)
        if (next.has(task.id)) next.delete(task.id)
        else next.add(task.id)
        return next
      })
    }
  }, [])

  const handleExpandAll = useCallback(() => {
    setExpandedJobs(new Set(jobs.map(j => j.job_id)))
  }, [jobs])

  const handleCollapseAll = useCallback(() => {
    setExpandedJobs(new Set())
  }, [])

  const handleEditStep = useCallback((task: ExtendedTask) => {
    if (task.isDisabled) return
    if (task.type === 'project' && task.originalJob) {
      setQuickViewJob(task.originalJob)
    } else if (task.type === 'task' && task.originalWorkLog && task.originalJobId && task.originalStep) {
      setEditingJobId(task.originalJobId)
      setEditingStep(task.originalStep)
      setEditingWorklog(task.originalWorkLog)
    } else if (task.type === 'task' && task.originalStep && task.originalJobId) {
      setEditingJobId(task.originalJobId)
      setEditingStep(task.originalStep)
      setEditingWorklog(null)
    }
  }, [])

  const handleTaskDoubleClick = useCallback((task: Task) => {
    if (task.isDisabled) return
    const extTask = task as ExtendedTask
    if (extTask.type === 'project' && extTask.originalJob) {
      setQuickViewJob(extTask.originalJob)
    } else if (extTask.type === 'task' && extTask.originalWorkLog && extTask.originalJobId && extTask.originalStep) {
      setEditingJobId(extTask.originalJobId)
      setEditingStep(extTask.originalStep)
      setEditingWorklog(extTask.originalWorkLog)
    } else if (extTask.type === 'task' && extTask.originalStep && extTask.originalJobId) {
      setEditingJobId(extTask.originalJobId)
      setEditingStep(extTask.originalStep)
      setEditingWorklog(null)
    }
  }, [])

  /**
   * Scroll the Gantt chart to a target date column.
   * Returns true if it navigated away (URL push), false if it scrolled in place.
   */
  const handleScrollToDate = useCallback((
    targetDateString: string | null | undefined,
    rowIndex?: number,
    highlightDateString?: string | null
  ): boolean => {
    if (!targetDateString) return false
    const targetDate = new Date(targetDateString)
    targetDate.setHours(0, 0, 0, 0)
    if (isNaN(targetDate.getTime())) return false

    const ganttEl = wrapperRef.current
    if (!ganttEl) return false


    const currentViewMode = viewModeRef.current
    const currentCompareMode = compareModeRef.current
    
    // Find the correct native scrollbar elements using style detection first
    let horizontalScrollContainer = ganttEl.querySelector('div[style*="overflow-x"]') as HTMLElement;
    let verticalScrollContainer = ganttEl.querySelector('div[style*="overflow-y"]') as HTMLElement;

    // Fallback to known class names if detection failed
    if (!horizontalScrollContainer) {
      horizontalScrollContainer = ganttEl.querySelector('._2k9Ys') as HTMLElement;
    }
    if (!verticalScrollContainer) {
      verticalScrollContainer = ganttEl.querySelector('._1eT-t') as HTMLElement;
    }

    const targetMs = targetDate.getTime()
    
    // Scroll only moves the Gantt viewport, never changes the data query range.

    // Helper: add to date exactly as gantt-task-react does
    const addToDate = (d: Date, quantity: number, scale: "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond") => {
      return new Date(
        d.getFullYear() + (scale === "year" ? quantity : 0),
        d.getMonth() + (scale === "month" ? quantity : 0),
        d.getDate() + (scale === "day" ? quantity : 0),
        d.getHours() + (scale === "hour" ? quantity : 0),
        d.getMinutes() + (scale === "minute" ? quantity : 0),
        d.getSeconds() + (scale === "second" ? quantity : 0),
        d.getMilliseconds() + (scale === "millisecond" ? quantity : 0)
      )
    }

    // Helper: start of date exactly as gantt-task-react does
    const startOfDate = (d: Date, scale: "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond") => {
      const scores = ["millisecond", "second", "minute", "hour", "day", "month", "year"]
      const shouldReset = (_scale: string) => {
        const maxScore = scores.indexOf(scale)
        return scores.indexOf(_scale) <= maxScore
      }
      return new Date(
        d.getFullYear(),
        shouldReset("year") ? 0 : d.getMonth(),
        shouldReset("month") ? 1 : d.getDate(),
        shouldReset("day") ? 0 : d.getHours(),
        shouldReset("hour") ? 0 : d.getMinutes(),
        shouldReset("minute") ? 0 : d.getSeconds(),
        shouldReset("second") ? 0 : d.getMilliseconds()
      )
    }

    // Helper: get Monday of the week exactly as gantt-task-react does
    const getMonday = (d: Date) => {
      const day = d.getDay()
      const diff = d.getDate() - day + (day === 0 ? -6 : 1)
      return new Date(new Date(d).setDate(diff))
    }

    // Helper: seed dates exactly as gantt-task-react does
    const seedDates = (start: Date, end: Date, mode: ViewMode) => {
      let currentDate = new Date(start)
      const dates = [currentDate]
      while (currentDate < end) {
        switch (mode) {
          case ViewMode.Month:
            currentDate = addToDate(currentDate, 1, "month")
            break;
          case ViewMode.Week:
            currentDate = addToDate(currentDate, 7, "day")
            break;
          case ViewMode.Day:
          default:
            currentDate = addToDate(currentDate, 1, "day")
            break;
        }
        dates.push(currentDate)
      }
      return dates
    }

    // Filter visible tasks (excluding collapsed ones)
    const visibleTasks = tasksRef.current.filter(t => {
      if (t.type === 'project') return true
      if (t.project) {
        const parent = tasksRef.current.find(pt => pt.id === t.project)
        return parent ? !parent.hideChildren : true
      }
      return true
    })

    if (tasksRef.current.length === 0) return false

    // Find the bounds of ALL tasks to determine the grid range exactly like gantt-task-react
    let minTaskDate = tasksRef.current[0].start
    let maxTaskDate = tasksRef.current[0].end
    tasksRef.current.forEach(t => {
      if (t.start < minTaskDate) minTaskDate = t.start
      if (t.end > maxTaskDate) maxTaskDate = t.end
    })

    const preStepsCount = 1
    let gridStartDate = new Date(minTaskDate)
    let gridEndDate = new Date(maxTaskDate)

    switch (currentViewMode) {
      case ViewMode.Month:
        gridStartDate = addToDate(gridStartDate, -1 * preStepsCount, "month")
        gridStartDate = startOfDate(gridStartDate, "month")
        gridEndDate = addToDate(gridEndDate, 1, "year")
        gridEndDate = startOfDate(gridEndDate, "year")
        break

      case ViewMode.Week:
        gridStartDate = startOfDate(gridStartDate, "day")
        gridStartDate = addToDate(getMonday(gridStartDate), -7 * preStepsCount, "day")
        gridEndDate = startOfDate(gridEndDate, "day")
        gridEndDate = addToDate(gridEndDate, 1.5, "month")
        break

      case ViewMode.Day:
      default:
        gridStartDate = startOfDate(gridStartDate, "day")
        gridStartDate = addToDate(gridStartDate, -1 * preStepsCount, "day")
        gridEndDate = startOfDate(gridEndDate, "day")
        gridEndDate = addToDate(gridEndDate, 19, "day")
        break
    }

    const colWidth = currentViewMode === ViewMode.Month ? 150 : 60
    const gridDates = seedDates(gridStartDate, gridEndDate, currentViewMode)

    // Calculate pixel offset (X coordinate)
    let targetIndex = gridDates.findIndex(d => d.getTime() >= targetMs) - 1
    if (targetIndex < 0) targetIndex = 0
    if (targetIndex >= gridDates.length - 1) targetIndex = gridDates.length - 2

    const currentIntervalStart = gridDates[targetIndex]
    const nextIntervalStart = gridDates[targetIndex + 1]
    let targetPixel = targetIndex * colWidth

    if (currentIntervalStart && nextIntervalStart) {
      const remainderMillis = targetMs - currentIntervalStart.getTime()
      const intervalMillis = nextIntervalStart.getTime() - currentIntervalStart.getTime()
      const percentOfInterval = remainderMillis / intervalMillis
      targetPixel = targetIndex * colWidth + percentOfInterval * colWidth
    }

    // Scroll positioning
    const viewportWidth = horizontalScrollContainer ? horizontalScrollContainer.clientWidth : 800
    const scrollToLeft = Math.max(0, targetPixel - (viewportWidth / 2))
    
    const rHeight = currentCompareMode === 'COMPARE' ? 44 : 26
    // SVG chart body starts at y=0, no header offset needed
    const rowTop = rowIndex !== undefined ? (rowIndex * rHeight) : 0
    const viewportHeight = verticalScrollContainer ? verticalScrollContainer.clientHeight : 600
    const scrollToTop = rowIndex !== undefined ? Math.max(0, (rowIndex * rHeight) - (viewportHeight / 2)) : 0

    requestAnimationFrame(() => {
      if (horizontalScrollContainer) {
        horizontalScrollContainer.scrollTo({ left: scrollToLeft, behavior: 'smooth' })
      }
      if (verticalScrollContainer) {
        verticalScrollContainer.scrollTo({ top: scrollToTop, behavior: 'smooth' })
      }
    })

    // Find the main chart body SVG
    let chartSvg: SVGSVGElement | null = null;
    if (horizontalScrollContainer) {
      chartSvg = horizontalScrollContainer.querySelector('svg');
    }
    
    // Fallback if not found in scroll container
    if (!chartSvg) {
      const svgs = ganttEl.querySelectorAll('svg');
      let svgCount = 0;
      for (let i = 0; i < svgs.length; i++) {
        if (svgs[i].getAttribute('width') && parseInt(svgs[i].getAttribute('width') || '0') > 100) {
          svgCount++;
          if (svgCount === 2) {  // Take the 2nd large SVG (chart body)
            chartSvg = svgs[i];
            break;
          }
        }
      }
      if (!chartSvg) {
        for (let i = 0; i < svgs.length; i++) {
          if (svgs[i].getAttribute('width') && parseInt(svgs[i].getAttribute('width') || '0') > 100) {
            chartSvg = svgs[i];
            break;
          }
        }
      }
    }

    ganttEl.querySelectorAll('.date-locate-pulse').forEach(el => el.remove())
    let highlightPixel = targetPixel
    if (highlightDateString) {
      const hdDate = new Date(highlightDateString)
      // Hiển thị đường đỏ ở đầu ngày theo yêu cầu của user
      hdDate.setHours(0, 0, 0, 0)
      const hdMs = hdDate.getTime()
      let hdIndex = gridDates.findIndex(d => d.getTime() >= hdMs) - 1
      if (hdIndex < 0) hdIndex = 0
      if (hdIndex >= gridDates.length - 1) hdIndex = gridDates.length - 2

      const hdIntervalStart = gridDates[hdIndex]
      const hdNextIntervalStart = gridDates[hdIndex + 1]
      if (hdIntervalStart && hdNextIntervalStart) {
        const hdRemainderMillis = hdMs - hdIntervalStart.getTime()
        const hdIntervalMillis = hdNextIntervalStart.getTime() - hdIntervalStart.getTime()
        const hdPercentOfInterval = hdRemainderMillis / hdIntervalMillis
        highlightPixel = hdIndex * colWidth + hdPercentOfInterval * colWidth
      }
    }

    if (chartSvg) {
      if (rowIndex !== undefined && rowIndex >= 0) {
        const hPulse = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        hPulse.setAttribute('class', 'date-locate-pulse animate-pulse-locate')
        hPulse.setAttribute('x', '0')
        hPulse.setAttribute('y', String(rowTop))
        hPulse.setAttribute('width', '100%')
        hPulse.setAttribute('height', String(rHeight))
        hPulse.setAttribute('fill', 'rgba(217, 48, 37, 0.15)')
        hPulse.setAttribute('stroke', 'var(--status-error, #d93025)')
        hPulse.setAttribute('stroke-width', '2')
        hPulse.style.pointerEvents = 'none'
        
        chartSvg.appendChild(hPulse)
        setTimeout(() => hPulse.remove(), 3500)

        // Highlight the specific task bar (Job) to show selection
        // gantt-task-react adds tabIndex="0" to every Task wrapper
        const barWrappers = chartSvg.querySelectorAll('g[tabindex="0"]')
        if (barWrappers && barWrappers[rowIndex]) {
          const targetWrapper = barWrappers[rowIndex]
          targetWrapper.classList.add('highlighted-job-bar')
          setTimeout(() => targetWrapper.classList.remove('highlighted-job-bar'), 3500)
        }
      }

      const vPulse = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      vPulse.setAttribute('class', 'date-locate-pulse animate-pulse-locate')
      vPulse.setAttribute('x1', String(highlightPixel))
      vPulse.setAttribute('y1', '0')
      vPulse.setAttribute('x2', String(highlightPixel))
      vPulse.setAttribute('y2', '100%')
      vPulse.setAttribute('stroke', 'var(--status-error, #d93025)')
      vPulse.setAttribute('stroke-width', '2')
      vPulse.style.pointerEvents = 'none'
      
      chartSvg.appendChild(vPulse)
      setTimeout(() => vPulse.remove(), 3500)
    }

    return false
  }, [router])

  // Auto-scroll when navigated via locateDate URL param
  useEffect(() => {
    const locateDate = searchParams?.get('locateDate')
    const locateRow = searchParams?.get('locateRow')
    const highlightDate = searchParams?.get('highlightDate')
    
    if (locateDate && wrapperRef.current) {
      const targetMs = new Date(locateDate).getTime()
      
      // We must wait until the Server Component has actually fetched the expanded date range
      // and passed it down via initialFromDate / initialToDate, otherwise the scroll logic
      // will run on the old data, return true (out of bounds), and never draw the pulse.
      const bStart = new Date(initialFromDate || Date.now()).getTime()
      const bEnd = new Date(initialToDate || Date.now()).getTime()
      const leeway = 7 * 24 * 60 * 60 * 1000 // Add some leeway for task bounds extending beyond
      
      if (targetMs >= bStart - leeway && targetMs <= bEnd + leeway) {
        const timer = setTimeout(() => {
          const redirected = handleScrollToDate(locateDate, locateRow ? parseInt(locateRow) : undefined, highlightDate)
          
          if (!redirected) {
            const url = new URL(window.location.href)
            url.searchParams.delete('locateDate')
            url.searchParams.delete('locateRow')
            url.searchParams.delete('highlightDate')
            window.history.replaceState({}, '', url.pathname + url.search)
          }
        }, 400) // Slightly longer to allow Gantt DOM to fully paint
        return () => clearTimeout(timer)
      }
    }
  }, [searchParams, initialFromDate, initialToDate, tasks, handleScrollToDate])

  // Removed 担当者 (nhân công) column — now 8 cols instead of 9
  const GRID_TEMPLATE = isPanelExpanded ? '160px 90px 45px 45px 55px 65px 65px 85px' : '200px 0 0 0 0 0 0 0'

  // Stable context: only handlers and options — does NOT include localSteps or expandedJobs
  // This means editing a step does NOT cause StaticHeaderComponent to re-render
  const handlersValue = useMemo(() => ({
    isPanelExpanded,
    gridTemplate: GRID_TEMPLATE,
    machOptions,
    empOptions,
    compareMode,
    onExpanderClick: handleExpanderClick,
    onScrollToDate: handleScrollToDate,
    onEditStep: handleEditStep,
    onUpdateLocalStep: updateLocalStep,
    onExpandAll: handleExpandAll,
    onCollapseAll: handleCollapseAll,
    onOpenQuickView: setQuickViewJob,
    onSelectJob: setSelectedJobId,
  }), [isPanelExpanded, GRID_TEMPLATE, machOptions, empOptions, compareMode, handleScrollToDate, handleEditStep, updateLocalStep, handleExpandAll, handleCollapseAll])

  // Volatile context: changes frequently (on every edit/expand)
  // Only StaticTableComponent subscribes to this
  const dataValue = useMemo(() => ({
    expandedJobs, expandedTracks,
    localSteps,
    selectedJobId,
    originalTasks: tasks,
  }), [expandedJobs, expandedTracks, localSteps, selectedJobId, tasks])

  if (tasks.length === 0) return null
  const hasEdits = Object.keys(localSteps).length > 0

  const activeFilterCls = 'bg-[var(--accent-subtle)] shadow-sm font-semibold text-[var(--accent)] border-[var(--accent-light)]'
  const inactiveCls = 'text-[var(--text-muted)] border-transparent hover:bg-[var(--bg-hover)]'

  return (
    <GanttHandlersContext.Provider value={handlersValue}>
    <GanttDataContext.Provider value={dataValue}>
      <div className="card-flat flex flex-col h-full" style={{ overflow: 'hidden' }}>
        <div className="flex items-center justify-between border-b px-2 py-1.5 gap-2 shrink-0" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-surface)' }}>
        <div className="flex items-center gap-1.5">
          <button className="btn btn-secondary text-[10px] px-2 py-0.5 h-5" onClick={handleTodayClick}>今日</button>

          <div className="flex items-center border rounded overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
            <button className="px-1.5 py-0.5 transition-colors flex items-center text-[10px]" style={{ color: 'var(--text-secondary)' }} onClick={() => shiftDateRange(-1)}><ChevronLeft size={11} /></button>
            <div style={{ width: 1, backgroundColor: 'var(--border-default)', alignSelf: 'stretch' }} />
            <button className="px-1.5 py-0.5 transition-colors flex items-center text-[10px]" style={{ color: 'var(--text-secondary)' }} onClick={() => shiftDateRange(1)}><ChevronRight size={11} /></button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold px-1" style={{ color: 'var(--text-primary)' }}>
              {fromDate.replace(/-/g, '/')} <span style={{ color: 'var(--text-muted)' }}>~</span> {toDate.replace(/-/g, '/')}
            </span>
            {visibleMonth && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent-subtle)', color: 'var(--accent)' }}>
                {visibleMonth}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 p-0.5 border rounded" style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-default)' }}>
            <input type="date" className="form-input text-[10px] py-0 px-1 h-5 w-24" style={{ backgroundColor: 'var(--bg-surface)' }} value={fromDate} onChange={e => { setFromDate(e.target.value); setActivePreset(''); handleApplyDateFilter(e.target.value, toDateRef.current); }} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>-</span>
            <input type="date" className="form-input text-[10px] py-0 px-1 h-5 w-24" style={{ backgroundColor: 'var(--bg-surface)' }} value={toDate} onChange={e => { setToDate(e.target.value); setActivePreset(''); handleApplyDateFilter(fromDateRef.current, e.target.value); }} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tối ưu hóa Toggle */}
          <div className="flex items-center gap-2 px-2 py-1 rounded border shadow-sm" style={{ backgroundColor: isDraftMode ? 'var(--accent-subtle)' : 'var(--bg-surface-2)', borderColor: isDraftMode ? 'var(--accent)' : 'var(--border-default)' }}>
            <span className="text-[11px] font-semibold" style={{ color: isDraftMode ? 'var(--accent)' : 'var(--text-secondary)' }}>
              Tối ưu hóa (AI)
            </span>
            <button 
              className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${isDraftMode ? 'bg-[var(--accent)]' : 'bg-[var(--bg-surface-3)]'}`}
              onClick={() => {
                if (!isDraftMode) {
                  const { draftJobs, hasOverdue, updates } = calculateAutoSchedule(jobs, { allowSaturday: false, maxHoursPerDay: 8 })
                  setDraftJobs(draftJobs)
                  setDraftUpdates(updates)
                  setIsDraftMode(true)
                } else {
                  setIsDraftMode(false)
                  setDraftJobs([])
                  setDraftUpdates([])
                }
              }}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isDraftMode ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
            </button>
            {isDraftMode && (
              <div className="flex items-center gap-1 border-l pl-2 ml-1" style={{ borderColor: 'var(--accent)' }}>
                <button 
                   className="btn text-[10px] px-2 py-0.5" 
                   style={{ backgroundColor: 'white', color: 'var(--accent)', border: '1px solid var(--accent)' }}
                   onClick={() => setIsDraftMode(false)}
                   disabled={isDraftSaving}
                >Hủy</button>
                <button 
                   className="btn btn-primary text-[10px] px-2 py-0.5"
                   disabled={isDraftSaving}
                   onClick={async () => {
                     setIsDraftSaving(true)
                     try {
                        await applyAutoScheduleUpdates(draftUpdates)
                        setIsDraftMode(false)
                        router.refresh()
                     } catch(e) {
                        console.error(e)
                     } finally {
                        setIsDraftSaving(false)
                     }
                   }}
                >{isDraftSaving ? 'Lưu...' : 'Lưu Lịch'}</button>
              </div>
            )}
          </div>

          <div className="flex p-1 rounded border text-[11px] shadow-sm" style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-default)' }}>
            <button className={`px-5 py-1.5 font-medium rounded-sm border transition-all ${activePreset === 'DAY' ? activeFilterCls : inactiveCls}`} onClick={() => setViewRange('DAY')}>日</button>
            <button className={`px-5 py-1.5 font-medium rounded-sm border transition-all ${activePreset === 'WEEK' ? activeFilterCls : inactiveCls}`} onClick={() => setViewRange('WEEK')}>週</button>
            <button className={`px-5 py-1.5 font-medium rounded-sm border transition-all ${activePreset === 'MONTH' ? activeFilterCls : inactiveCls}`} onClick={() => setViewRange('MONTH')}>月</button>
          </div>

          <div className="flex p-1 rounded border text-[11px] shadow-sm" style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-default)' }}>
            <button className={`px-5 py-1.5 font-medium rounded-sm border transition-all ${compareMode === 'PLANNED' ? activeFilterCls : inactiveCls}`} onClick={() => setCompareMode('PLANNED')}>予定</button>
            <button className={`px-5 py-1.5 font-medium rounded-sm border transition-all ${compareMode === 'ACTUAL' ? activeFilterCls : inactiveCls}`} onClick={() => setCompareMode('ACTUAL')}>実績</button>
            <button className={`px-5 py-1.5 font-medium rounded-sm border transition-all ${compareMode === 'COMPARE' ? activeFilterCls : inactiveCls}`} onClick={() => setCompareMode('COMPARE')}>予実比較</button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button className="btn btn-secondary text-[10px] px-2 py-0.5 h-5" onClick={() => setIsPanelExpanded(!isPanelExpanded)}>
            {isPanelExpanded ? '◀' : '▶'}
          </button>

          {hasEdits && (
            <div className="flex items-center gap-1 ml-1 pl-1.5" style={{ borderLeft: '1px solid var(--border-default)' }}>
              <span className="text-[9px] font-medium" style={{ color: 'var(--status-warning)' }}>未保存({Object.keys(localSteps).length})</span>
              <button className="btn text-[10px] px-1.5 py-0.5" style={{ backgroundColor: 'var(--bg-surface-3)' }} onClick={handleCancelChanges} disabled={isSaving}>
                <Undo size={10} /> 取消
              </button>
              <button className="btn btn-primary text-[10px] px-2 py-0.5" onClick={handleSaveChanges} disabled={isSaving}>
                <Save size={10} /> {isSaving ? '保存中...' : '保存'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gantt Area */}
      <div id="gantt-container" ref={wrapperRef} className="relative w-full flex-1 overflow-hidden bg-white" style={{ minHeight: '300px' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .bar-wrapper { transition: all 0.2s ease; cursor: pointer; }
          .bar-wrapper:hover .bar { filter: brightness(0.9); }
          .project-background { fill: var(--text-primary) !important; }
          .project-top { fill: var(--text-primary) !important; }
          ._9w8d5 { fill: var(--text-secondary) !important; font-size: 10px !important; font-weight: 600 !important; }
          ._2q1Kt { fill: var(--text-muted) !important; font-size: 9px !important; }
          ._1rLuZ { stroke: var(--border-subtle) !important; }
          ._RuwuK { stroke: var(--border-default) !important; }
          :root {
            --planned-ghost: #e2e8f0;
            --actual-ghost: #e2e8f0;
            --compare-planned: #e2e8f0;
            --compare-draft: #e2e8f0;
          }
          rect[fill="var(--planned-ghost)"] { stroke: var(--text-muted); stroke-width: 1; stroke-dasharray: 4,3; opacity: 0.5; }
          rect[fill="var(--actual-ghost)"] { stroke: var(--text-muted); stroke-width: 1; stroke-dasharray: 4,3; opacity: 0.25; }
          rect[fill="var(--compare-planned)"] { stroke: var(--accent); stroke-width: 1.5; stroke-dasharray: 5,3; fill: transparent !important; opacity: 0.7; }
          rect[fill="var(--compare-draft)"] { stroke: #a855f7; stroke-width: 2; stroke-dasharray: 5,3; fill: rgba(168, 85, 247, 0.1) !important; opacity: 0.9; }
          .gantt-top-text { fill: var(--text-secondary) !important; font-size: 11px !important; font-weight: 600 !important; }
          .gantt-bottom-text { fill: var(--text-muted) !important; font-size: 10px !important; }
          
          /* ── Bar text: inside bar (class ._3zRJQ) ── */
          /* Default: dark text for light-background bars (PENDING, ghost, etc.) */
          ._3zRJQ { 
            fill: var(--text-primary, #1a1a2e) !important; 
            font-weight: 600 !important; 
            font-size: 10px !important;
            pointer-events: none; 
          }
          
          /* ── Bar text: outside bar (class ._3KcaM) ── */
          ._3KcaM { 
            fill: var(--text-secondary, #555) !important; 
            font-size: 9px !important;
            pointer-events: none;
          }
          
          /* Ghost/empty bars: hide text completely (they have name='') anyway,
             but also ensure any residual text is invisible */
          g:has(rect[fill="var(--planned-ghost)"]) ._3zRJQ,
          g:has(rect[fill="var(--actual-ghost)"]) ._3zRJQ,
          g:has(rect[fill="transparent"]) ._3zRJQ {
            fill: transparent !important;
          }
          
          /* Selection effect for located job */
          .highlighted-job-bar rect, .highlighted-job-bar polygon {
            fill: var(--status-warning, #f59e0b) !important;
            transition: fill 0.3s ease;
          }

          @keyframes locate-pulse {
            0% { opacity: 0; stroke-width: 4; fill-opacity: 0.8; }
            15% { opacity: 1; stroke-width: 2; fill-opacity: 0.15; }
            30% { opacity: 0.2; stroke-width: 2; fill-opacity: 0.05; }
            45% { opacity: 1; stroke-width: 2; fill-opacity: 0.15; }
            100% { opacity: 0; stroke-width: 2; fill-opacity: 0.15; }
          }
          .animate-pulse-locate {
            animation: locate-pulse 3s ease-out forwards;
          }
        `}} />
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          locale="ja"
          headerHeight={40}
          ganttHeight={ganttHeight}
          onDateChange={handleTaskChange}
          onProgressChange={handleTaskChange}
          onDoubleClick={handleTaskDoubleClick}
          onExpanderClick={handleExpanderClick}
          listCellWidth={isPanelExpanded ? "715px" : "200px"}
          columnWidth={viewMode === ViewMode.Month ? 150 : 60}
          fontFamily="var(--font-jp)"
          fontSize="10px"
          TaskListHeader={StaticHeaderComponent}
          TaskListTable={StaticTableComponent}
          rowHeight={compareMode === 'COMPARE' ? 44 : 26}
          barBackgroundColor="var(--bg-surface-3)"
        />
      </div>

      {editingJobId && !editingWorklog && (
        <EditStepModal
          jobId={editingJobId}
          step={editingStep}
          nextStepNo={editingStep?.step_no || 1}
          onClose={() => {
            setEditingJobId(null)
            setEditingStep(null)
          }}
          onSaved={() => {
            setEditingJobId(null)
            setEditingStep(null)
            router.refresh()
          }}
        />
      )}

      {editingJobId && editingWorklog && (
        <WorklogEditModal
          jobId={editingJobId}
          step={editingStep}
          worklog={editingWorklog}
          onClose={() => {
            setEditingJobId(null)
            setEditingStep(null)
            setEditingWorklog(null)
          }}
          onSaved={() => {
            setEditingJobId(null)
            setEditingStep(null)
            setEditingWorklog(null)
            router.refresh()
          }}
        />
      )}

      {quickViewJob && (
        <JobQuickViewDrawer
          job={quickViewJob}
          onClose={() => setQuickViewJob(null)}
          onOpenStepEdit={(jobId, step) => {
            setEditingJobId(jobId)
            setEditingStep(step)
          }}
          onJobUpdated={() => {
            router.refresh()
          }}
        />
      )}
    </div>
    </GanttDataContext.Provider>
    </GanttHandlersContext.Provider>
  )
}
