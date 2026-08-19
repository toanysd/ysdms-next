'use client'

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { JobForGantt, JobStepRow } from '@/app/actions/mold-job'
import { Gantt, Task, ViewMode } from 'gantt-task-react'
import 'gantt-task-react/dist/index.css'
import { Edit2, Save, Undo, ChevronLeft, ChevronRight, Crosshair, Sparkles, ClipboardList, Printer, CalendarRange } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown'
import { useTranslations } from 'next-intl'
import { shiftJobDates, applyAutoScheduleUpdates } from '@/app/actions/mold-job'
import { EditStepModal } from '@/app/equipment/jobs/[id]/tabs/EditStepModal'
import { JobQuickViewDrawer } from '@/components/equipment/JobQuickViewDrawer'
import { ManufacturingSheetOCRModal } from '@/components/ocr/ManufacturingSheetOCRModal'
import { DailyWorklogQuickModal } from '@/components/worklogs/DailyWorklogQuickModal'
import { calculateAutoSchedule } from '@/lib/scheduling/autoScheduler'

interface Props {
  workOrders?: any[]
  jobs: JobForGantt[]
  employees?: any[]
  machines?: any[]
  initialFromDate?: string
  initialToDate?: string
  trackFilter?: 'ALL' | 'MOLD' | 'PLUG' | 'CUTTER'
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
  EXISTING: '流用',
  SHARED: '流用',
}

function getDelayColor(
  deadlineStr: string | null | undefined,
  endDateStr: string | null | undefined | Date,
  isCompleted: boolean
): { color: string; bg: string; label: string } | null {
  if (!deadlineStr) return null;
  
  const deadline = new Date(deadlineStr);
  deadline.setHours(0,0,0,0);
  if (isNaN(deadline.getTime())) return null;
  
  const today = new Date();
  today.setHours(0,0,0,0);
  
  if (isCompleted) {
    if (endDateStr) {
      const end = new Date(endDateStr);
      end.setHours(0,0,0,0);
      if (!isNaN(end.getTime())) {
        if (end <= deadline) {
          // Completed on time -> green (teal badge)
          return { color: '#0f766e', bg: '#ccfbf1', label: 'ON_TIME' }; 
        } else {
          // Completed after deadline -> blue (slate blue badge showing it was once late)
          return { color: '#1d4ed8', bg: '#dbeafe', label: 'LATE_COMPLETED' }; 
        }
      }
    }
    return { color: '#0f766e', bg: '#ccfbf1', label: 'ON_TIME' };
  } else {
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      // Overdue -> Dark Red badge
      return { color: '#7f1d1d', bg: '#fecaca', label: 'OVERDUE' };
    } else if (diffDays === 0) {
      // Due today -> Red badge
      return { color: '#b91c1c', bg: '#fee2e2', label: 'DUE_TODAY' };
    } else if (diffDays === 1) {
      // 1 day left -> Dark Orange badge
      return { color: '#c2410c', bg: '#ffedd5', label: 'DUE_1_DAY' };
    } else if (diffDays === 2) {
      // 2 days left -> Orange badge
      return { color: '#ea580c', bg: '#fff7ed', label: 'DUE_2_DAYS' };
    } else if (diffDays <= 5) {
      // 3-5 days left -> Lighter Orange/Peach badge
      return { color: '#f97316', bg: '#fffbeb', label: 'DUE_5_DAYS' };
    }
  }
  return null;
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
  onExpandTracksOnly: () => void
  onCollapseAll: () => void
}

const CustomTaskListHeader = React.memo(function CustomTaskListHeader({
  headerHeight, fontFamily, onExpandAll, onExpandTracksOnly, onCollapseAll
}: HeaderProps) {
  const { gridTemplate, isPanelExpanded, showDates } = React.useContext(GanttHandlersContext)
  const tIntl = useTranslations('Equipment')
  
  const hStyle: React.CSSProperties = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', textTransform: 'uppercase', letterSpacing: '0.05em' }
  const hHide: React.CSSProperties = { ...hStyle, display: isPanelExpanded ? 'block' : 'none' }
  
  return (
    <div style={{ height: headerHeight, fontFamily, fontSize: 10, display: 'grid', gridTemplateColumns: gridTemplate, alignItems: 'center', padding: '0 4px', borderBottom: '1px solid var(--border-default)', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)' }}>
      <div style={{ ...hStyle, display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div className="flex gap-0.5" style={{ zIndex: 10 }}>
           <button className="flex items-center justify-center bg-[var(--bg-surface-2)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] rounded-sm h-4.5 px-1 text-[9px] font-bold cursor-pointer" onClick={onCollapseAll} title={tIntl('collapseAll')}>－</button>
           <button className="flex items-center justify-center bg-[var(--bg-surface-2)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] rounded-sm h-4.5 px-1 text-[9px] font-bold text-[var(--accent)] cursor-pointer" onClick={onExpandTracksOnly} title={tIntl('expandTracksOnly')}>⚙️</button>
           <button className="flex items-center justify-center bg-[var(--bg-surface-2)] hover:bg-[var(--bg-hover)] border border-[var(--border-default)] rounded-sm h-4.5 px-1 text-[9px] font-bold cursor-pointer" onClick={onExpandAll} title={tIntl('expandAll')}>＋</button>
        </div>
        <span>ジョブ / 工程</span>
      </div>
      <div style={hHide}>設備</div>
      <div style={{ ...hHide, textAlign: 'center' }} title="予定時間">予定H</div>
      <div style={{ ...hHide, textAlign: 'center' }} title="実績時間">実績H</div>
      <div style={{ ...hHide, textAlign: 'center' }} title="実績日">実績日</div>
      <div style={{ ...hHide, textAlign: 'center' }}>状態</div>
      {showDates && (
        <>
          <div style={{ ...hHide, textAlign: 'center' }}>開始</div>
          <div style={{ ...hHide, textAlign: 'center' }}>終了</div>
        </>
      )}
      <div style={{ ...hHide, textAlign: 'center', color: 'var(--text-primary)', fontWeight: 700 }} title="金型・構成部品の完成期日">{tIntl('moldDeadline')}</div>
      <div style={{ ...hHide, textAlign: 'center', color: 'var(--accent)', fontWeight: 700 }} title="製品の出荷期日">{tIntl('shippingDeadline')}</div>
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
  selectedTaskId?: string | null
  onSelectTask?: (task: ExtendedTask) => void
  originalTasks?: ExtendedTask[]
  showDates?: boolean
}

const TaskRow = React.memo(function TaskRow({
  t, index, rowHeight, rowWidth, gridTemplate, isPanelExpanded,
  isExpanded, currentStepData, machOptions, empOptions, expandedTracks,
  onExpanderClick, onScrollToDate, onEditStep, onUpdateLocalStep, onOpenQuickView, 
  selectedJobId, onSelectJob, selectedTaskId, onSelectTask, showDates
}: any) {
  const tIntl = useTranslations('Equipment')
  
  const isSelected = t.id === selectedTaskId || (t.type === 'project' && t.id === selectedJobId && !selectedTaskId)
  
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

  const isTrack = t.isTrackHeader === true
  const isTrackCompleted = isTrack && ((t as any).trackStatus === 'COMPLETED' || (t as any).trackStatus?.includes('完了'))
  
  const delayInfo = getDelayColor(
    t.type === 'project' 
      ? (t.originalJob?.mold_deadline || t.originalJob?.deadline)
      : (isTrack 
          ? t.trackDeadline 
          : currentStepData?.deadline),
    t.type === 'project'
      ? (t.originalJob?.job_status === 'COMPLETED' ? t.end : null)
      : (isTrack
          ? (isTrackCompleted ? t.end : null)
          : ((currentStepData?.step_status === 'COMPLETED' || currentStepData?.processing_statuses?.status_code?.includes('完了')) ? (currentStepData?.actual_end || t.end) : null)),
    t.type === 'project'
      ? t.originalJob?.job_status === 'COMPLETED'
      : (isTrack
          ? isTrackCompleted
          : (currentStepData?.step_status === 'COMPLETED' || currentStepData?.processing_statuses?.status_code?.includes('完了')))
  );

  if (delayInfo) {
    statusColor = delayInfo.color;
  }

  const isTask = t.type === 'task'
  const step = t.originalStep
  const isActual = t.isActualRow === true

  if ((t as any).isAddStepRow) {
    return (
      <div 
        style={{
          height: rowHeight, width: rowWidth,
          display: 'flex', alignItems: 'center',
          padding: '0 12px 0 28px',
          borderBottom: '1px dashed var(--border-default)',
          backgroundColor: 'var(--bg-surface-2, #f8fafc)',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-3, #f1f5f9)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-2, #f8fafc)')}
        onClick={(e) => {
          e.stopPropagation()
          onEditStep({
            type: 'task',
            isAddStepRow: true,
            originalJobId: (t as any).originalJobId,
            originalJob: (t as any).originalJob,
          } as any)
        }}
      >
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>＋</span>
          <span>{tIntl('themCongDoanJobNay')}</span>
        </button>
      </div>
    )
  }

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

  const trackMeta = isTrack
    ? (TRACK_META[t.trackCode || ''] || { badge: '?', color: 'var(--accent)', bg: 'var(--accent-light)', label: t.trackCode || 'OTHER' })
    : null

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
        onClick={() => onSelectTask && onSelectTask(t)}
        style={{
          height: rowHeight, width: rowWidth,
          display: 'grid', gridTemplateColumns: gridTemplate,
          alignItems: 'center', padding: '0 4px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: isSelected ? 'rgba(13, 148, 136, 0.12)' : 'var(--bg-surface-2)',
          borderLeft: isSelected ? '4px solid var(--accent)' : `3px solid ${trackMeta!.color}`,
          boxShadow: isSelected ? 'inset 0 0 0 1px rgba(13, 148, 136, 0.25)' : 'none',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
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
        {isPanelExpanded && (
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'left', paddingLeft: 4 }}>
            {doneCount}/{stepCount} 工程
          </div>
        )}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-muted)', textAlign: 'center' }}>
            {(t as any).trackTotalPlannedHours ? `${(t as any).trackTotalPlannedHours}H` : '-'}
          </div>
        )}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, fontWeight: 700, color: trackStatusColor, textAlign: 'center', fontFamily: 'monospace' }}>
            {(t as any).trackTotalActualHours ? `${(t as any).trackTotalActualHours}H` : '-'}
          </div>
        )}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, textAlign: 'center', minWidth: 0, color: 'var(--text-muted)' }}>
            -
          </div>
        )}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', lineHeight: 1.2 }}>
            {delayInfo ? (
              <span style={{
                color: delayInfo.color,
                backgroundColor: delayInfo.bg,
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: 9,
                whiteSpace: 'nowrap'
              }}>
                {trackStatusText}
              </span>
            ) : (
              <span style={{ fontWeight: 700, color: trackStatusColor }}>{trackStatusText}</span>
            )}
            <span style={{ fontSize: 8, opacity: 0.8, color: 'var(--text-muted)' }}>{prog}%</span>
          </div>
        )}
        {isPanelExpanded && (
          <div style={{ fontSize: 10, textAlign: 'center', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: showDates ? 'block' : 'none' }}>
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
        {isPanelExpanded && (
          <div style={{ fontSize: 10, textAlign: 'center', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: showDates ? 'block' : 'none' }}>
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
        {isPanelExpanded && (
          <div style={{ fontSize: 9.5, minWidth: 0, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '14px' }}>
            {deadline ? (
              delayInfo ? (
                <span
                  style={{ cursor: 'pointer', color: delayInfo.color, backgroundColor: delayInfo.bg, padding: '1.5px 5px', borderRadius: '3px', fontWeight: 600, textDecoration: 'underline', textDecorationStyle: 'dotted', whiteSpace: 'nowrap', opacity: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onScrollToDate(deadline, index, deadline) }}
                  title="期限日にスクロール"
                >
                  {formatShortDateWithDay(deadline)}
                </span>
              ) : (
                <span
                  style={{ cursor: 'pointer', color: isOverdue ? 'var(--status-error)' : 'var(--text-muted)', fontWeight: 600, textDecoration: 'underline', textDecorationStyle: 'dotted', whiteSpace: 'nowrap', opacity: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); onScrollToDate(deadline, index, deadline) }}
                  title="期限日にスクロール"
                >
                  {formatShortDateWithDay(deadline)}
                </span>
              )
            ) : <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', paddingLeft: '8px' }}>—</span>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div 
      onClick={() => onSelectTask && onSelectTask(t)}
      style={{ 
        height: rowHeight, 
        width: rowWidth, 
        display: 'grid', 
        gridTemplateColumns: gridTemplate, 
        alignItems: 'center', 
        padding: '0 4px', 
        borderBottom: '1px solid var(--border-subtle)', 
        borderLeft: isSelected ? '4px solid var(--accent)' : '4px solid transparent',
        backgroundColor: isSelected ? 'rgba(13, 148, 136, 0.12)' : rowBg,
        boxShadow: isSelected ? 'inset 0 0 0 1px rgba(13, 148, 136, 0.25)' : 'none',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease, border-left-color 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, gridColumn: t.type === 'project' && isPanelExpanded ? '1 / 6' : undefined }}>
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
                  const dl = t.originalJob?.mold_deadline || t.originalJob?.deadline;
                  const targetDate = dl ? new Date(dl) : (earliestStart || new Date());
                  onSelectJob(t.id);
                  onScrollToDate(targetDate.toISOString(), index, dl);
                }}
                style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-default)', borderRadius: '4px', cursor: 'pointer', color: 'var(--accent)', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: '4px', lineHeight: 1, flexShrink: 0 }}
                title={tIntl('scrollToJob')}
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
                let stepName = isWorkLog 
                    ? (t.originalWorkLog?.processing_name || t.name || 'N/A')
                    : (t.originalStep?.step_name || t.name || 'N/A')
                
                // Format step name for clean domain terminology and prevent redundant labels
                if (!isWorkLog) {
                  const upperTrack = stepTrack.toUpperCase()
                  if (stepName === 'カッター' || stepName === 'CUTTER' || stepName === '抜型') {
                    stepName = '抜型製作'
                  } else if (stepName === 'プラグ' && upperTrack === 'PLUG') {
                    stepName = 'プラグ製作'
                  } else if (stepName === 'アルミ材' && upperTrack === 'MOLD') {
                    stepName = 'アルミ材手配'
                  } else if (stepName === '金型' && upperTrack === 'MOLD') {
                    stepName = '金型製作'
                  }
                }
                return (
                  <div 
                    style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, minWidth: 0, cursor: 'pointer' }}
                    onDoubleClick={(e) => { e.stopPropagation(); onEditStep(t) }}
                    title={tIntl('doubleClickToEdit')}
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
                      {tMeta.badge}
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
          {t.type !== 'project' && (
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

              <div style={{ padding: '0 4px', textAlign: 'center', minWidth: 0, fontSize: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isTask ? (
                  t.originalWorkLog?.work_date ? (
                    <span 
                      style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}
                      onClick={(e) => { e.stopPropagation(); onScrollToDate(t.originalWorkLog.work_date, index, t.originalWorkLog.work_date) }}
                      title="作業日にスクロール"
                    >
                      {formatShortDateWithDay(t.originalWorkLog.work_date)}
                    </span>
                  ) : t.originalStep?.actual_start || t.originalStep?.actual_end ? (
                    <span 
                      style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}
                      onClick={(e) => { e.stopPropagation(); onScrollToDate(t.originalStep.actual_start || t.originalStep.actual_end, index, t.originalStep.actual_start || t.originalStep.actual_end) }}
                      title="実績日にスクロール"
                    >
                      {formatShortDateWithDay(t.originalStep.actual_start || t.originalStep.actual_end)}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                  )
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>-</span>
                )}
              </div>
            </>
          )}

          <div style={{ textAlign: 'center', fontSize: 10, minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {t.isDisabled ? '' : (
              delayInfo ? (
                <span style={{
                  color: delayInfo.color,
                  backgroundColor: delayInfo.bg,
                  padding: '2px 5px',
                  borderRadius: '4px',
                  fontWeight: 700,
                  fontSize: 9.5,
                  whiteSpace: 'nowrap'
                }}>
                  {statusText}
                </span>
              ) : (
                <span style={{ color: statusColor, fontWeight: 600, fontSize: 10, whiteSpace: 'nowrap' }}>
                  {statusText}
                </span>
              )
            )}
          </div>

          {showDates && (
            <>
              <div style={{ textAlign: 'center', fontSize: 10, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.isDisabled ? '' : (
                  <span 
                    style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', color: statusColor }}
                    onClick={(e) => { e.stopPropagation(); onScrollToDate(isTask ? currentStepData?.planned_start : t.start, index, isTask ? currentStepData?.planned_start : t.start) }}
                    title={tIntl('scrollToPlannedStart')}
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
                    title={tIntl('scrollToPlannedEnd')}
                  >
                    {formatShortDateWithDay(isTask ? currentStepData?.planned_end : t.end)}
                  </span>
                )}
              </div>
            </>
          )}

          <div style={{ padding: '0 2px', display: 'flex', alignItems: 'center', justifyContent: isTask ? 'flex-start' : 'center', paddingLeft: isTask ? '28px' : '0px', gap: 2, minWidth: 0 }}>
            {(() => {
              const targetDl = isTask
                ? (currentStepData?.deadline || t.originalStep?.deadline)
                : (isTrack ? t.trackDeadline : (t.originalJob?.mold_deadline || t.originalJob?.deadline))
              
              if (!targetDl) return <span style={{ color: 'var(--text-muted)', fontSize: 9.5 }}>—</span>

              return delayInfo ? (
                <span 
                  style={{ fontSize: 10, color: delayInfo.color, backgroundColor: delayInfo.bg, padding: '2px 6px', borderRadius: '4px', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', whiteSpace: 'nowrap' }}
                  onClick={(e) => { e.stopPropagation(); onScrollToDate(targetDl, index, targetDl) }}
                  title={tIntl('scrollToDeadline')}
                >
                  {formatShortDateWithDay(targetDl)}
                </span>
              ) : (
                <span 
                  style={{ fontSize: 10, color: statusColor, cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted', whiteSpace: 'nowrap', fontWeight: 700 }}
                  onClick={(e) => { e.stopPropagation(); onScrollToDate(targetDl, index, targetDl) }}
                  title={tIntl('scrollToDeadline')}
                >
                  {formatShortDateWithDay(targetDl)}
                </span>
              )
            })()}
          </div>

          {/* 出荷期日 (Shipping / Product Deadline) */}
          <div style={{ padding: '0 2px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
            {(() => {
              if (t.type === 'project') {
                const shipDate = t.originalJob?.ship_date || (t.originalJob as any)?.work_orders?.delivery_date || (t.originalJob as any)?.work_orders?.deadline
                if (!shipDate) return <span style={{ color: 'var(--text-muted)', fontSize: 9.5 }}>—</span>

                const moldDl = t.originalJob?.mold_deadline || t.originalJob?.deadline
                const isConflict = moldDl && new Date(shipDate).getTime() < new Date(moldDl).getTime()

                return (
                  <span 
                    style={{ 
                      fontSize: 10, 
                      color: isConflict ? 'var(--status-error, #dc2626)' : 'var(--accent, #0d9488)', 
                      backgroundColor: isConflict ? 'rgba(239, 68, 68, 0.1)' : 'var(--tint-teal-bg, rgba(13, 148, 136, 0.08))',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      cursor: 'pointer', 
                      textDecoration: 'underline', 
                      textDecorationStyle: 'dotted', 
                      whiteSpace: 'nowrap', 
                      fontWeight: 700 
                    }}
                    onClick={(e) => { e.stopPropagation(); onScrollToDate(shipDate, index, shipDate) }}
                    title={isConflict ? `出荷期日: ${formatShortDateWithDay(shipDate)} (⚠️ 金型完成期日より前です)` : `出荷期日: ${formatShortDateWithDay(shipDate)}`}
                  >
                    {formatShortDateWithDay(shipDate)}
                  </span>
                )
              }
              return <span style={{ color: 'var(--text-muted)', fontSize: 9.5 }}>—</span>
            })()}
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
  onScrollToDate, onEditStep, onUpdateLocalStep, onOpenQuickView, 
  selectedJobId, onSelectJob, selectedTaskId, onSelectTask, showDates,
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
            selectedTaskId={selectedTaskId}
            onSelectTask={onSelectTask}
            showDates={showDates}
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
      headerHeight={ctx.headerHeight}
      fontFamily={ctx.fontFamily}
      fontSize={ctx.fontSize}
      isPanelExpanded={ctx.isPanelExpanded}
      gridTemplate={ctx.gridTemplate}
      onExpandAll={ctx.onExpandAll}
      onExpandTracksOnly={ctx.onExpandTracksOnly}
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
      rowHeight={ctx.rowHeight}
      rowWidth={ctx.rowWidth}
      fontFamily={ctx.fontFamily}
      fontSize={ctx.fontSize}
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
      selectedTaskId={data.selectedTaskId}
      onSelectTask={ctx.onSelectTask}
      originalTasks={data.originalTasks}
      showDates={ctx.showDates}
    />
  )
})

export default function MoldJobGantt({ workOrders = [], jobs, employees = [], machines = [], initialFromDate, initialToDate, trackFilter = 'ALL' }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('Equipment')
  const tCommon = useTranslations('Common')
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
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false)
  const [isWorklogModalOpen, setIsWorklogModalOpen] = useState(false)
  const [worklogDefaultJobId, setWorklogDefaultJobId] = useState<string | undefined>(undefined)
  const [isPrintNippoModalOpen, setIsPrintNippoModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null)

  const handleSelectTask = useCallback((task: ExtendedTask) => {
    setSelectedTaskId(prev => prev === task.id ? null : task.id)
    setSelectedTask(prev => prev?.id === task.id ? null : task)
    if (task.originalJobId) {
      setSelectedJobId(task.originalJobId)
    } else if (task.type === 'project') {
      setSelectedJobId(task.id)
    }
  }, [])

  const wrapperRef = useRef<HTMLDivElement>(null)
  const [ganttHeight, setGanttHeight] = useState(600)
  const [showDates, setShowDates] = useState(false)

  useEffect(() => {
    if (!wrapperRef.current) return
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height
        if (height > 0) {
          setGanttHeight(height)
        }
      }
    })
    resizeObserver.observe(wrapperRef.current)
    return () => resizeObserver.disconnect()
  }, [])

  const [localSteps, setLocalSteps] = useState<Record<string, Partial<JobStepRow>>>({})
  const [isSaving, setIsSaving] = useState(false)

  const [isDraftMode, setIsDraftMode] = useState(false)
  const [draftJobs, setDraftJobs] = useState<JobForGantt[]>([])
  const [draftUpdates, setDraftUpdates] = useState<any[]>([])
  const [isDraftSaving, setIsDraftSaving] = useState(false)

  const [fromDate, setFromDate] = useState<string>(initialFromDate || '')
  const [toDate, setToDate] = useState<string>(initialToDate || '')


  const fromDateRef = useRef(fromDate)
  const toDateRef = useRef(toDate)
  const viewModeRef = useRef(viewMode)
  const compareModeRef = useRef(compareMode)
  const tasksRef = useRef<ExtendedTask[]>([])
  const localStepsRef = useRef(localSteps)
  const processedLocateRef = useRef<string | null>(null)
  const handleScrollToDateRef = useRef<(
    targetDateString: string | null | undefined,
    rowIndex?: number,
    highlightDateString?: string | null
  ) => boolean>(() => false)

  useEffect(() => { fromDateRef.current = fromDate }, [fromDate])
  useEffect(() => { toDateRef.current = toDate }, [toDate])
  useEffect(() => { viewModeRef.current = viewMode }, [viewMode])
  useEffect(() => { compareModeRef.current = compareMode }, [compareMode])
  useEffect(() => { localStepsRef.current = localSteps }, [localSteps])

  useEffect(() => {
    if (!searchParams) return;
    const s = searchParams.get('from');
    const e = searchParams.get('to');
    
    let updated = false;
    if (s && s !== fromDateRef.current) { setFromDate(s); updated = true; }
    if (e && e !== toDateRef.current) { setToDate(e); updated = true; }
    
    if (updated && s && e) {
        const ds = new Date(s);
        const de = new Date(e);
        const diffDays = Math.round((de.getTime() - ds.getTime()) / (1000 * 3600 * 24)) + 1;
        if (diffDays >= 13 && diffDays <= 15) setActivePreset('2W');
        else if (diffDays >= 28 && diffDays <= 32) setActivePreset('1M');
        else if (diffDays >= 88 && diffDays <= 93) setActivePreset('3M');
        else setActivePreset('');
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

  const setViewRange = useCallback((range: '2W' | '1M' | '3M') => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let start = new Date(today)
    let end = new Date(today)

    if (range === '2W') {
      const day = today.getDay()
      const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1)
      start.setDate(diffToMonday)
      end = new Date(start)
      end.setDate(end.getDate() + 13) // 14 days total (this week + next week)
    } else if (range === '1M') {
      start = new Date(today.getFullYear(), today.getMonth(), 1)
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    } else if (range === '3M') {
      start = new Date(today.getFullYear(), today.getMonth(), 1)
      end = new Date(today.getFullYear(), today.getMonth() + 3, 0)
    }

    setActivePreset(range)
    const sStr = start.toISOString().split('T')[0]
    const eStr = end.toISOString().split('T')[0]
    setFromDate(sStr)
    setToDate(eStr)
    handleApplyDateFilter(sStr, eStr)
  }, [handleApplyDateFilter])

  const handleTodayClick = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayMs = today.getTime()
    
    const s = fromDateRef.current ? new Date(fromDateRef.current).getTime() : 0
    const e = toDateRef.current ? new Date(toDateRef.current).getTime() : 0
    
    if (todayMs >= s && todayMs <= e) {
      const todayStr = today.toISOString().split('T')[0]
      handleScrollToDateRef.current(todayStr, undefined, todayStr)
    } else {
      const day = today.getDay()
      const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1)
      const start = new Date(today)
      start.setDate(diffToMonday)
      const end = new Date(start)
      end.setDate(end.getDate() + 13)
      
      const sStr = start.toISOString().split('T')[0]
      const eStr = end.toISOString().split('T')[0]
      
      const params = new URLSearchParams(window.location.search)
      params.set('from', sStr)
      params.set('to', eStr)
      params.set('locateDate', today.toISOString().split('T')[0])
      params.set('highlightDate', today.toISOString().split('T')[0])
      
      setActivePreset('2W')
      setFromDate(sStr)
      setToDate(eStr)
      processedLocateRef.current = null // Reset so scroll effect fires upon reload
      router.push(`?${params.toString()}`)
    }
  }, [router])

  const shiftDateRange = useCallback((direction: 1 | -1) => {
    const s = fromDateRef.current ? new Date(fromDateRef.current) : new Date()
    const e = toDateRef.current ? new Date(toDateRef.current) : new Date()
    
    if (activePreset === '1M') {
       s.setMonth(s.getMonth() + direction)
       const lastDay = new Date(s.getFullYear(), s.getMonth() + 1, 0)
       e.setFullYear(s.getFullYear())
       e.setMonth(s.getMonth())
       e.setDate(lastDay.getDate())
    } else if (activePreset === '3M') {
       s.setMonth(s.getMonth() + direction * 3)
       const lastDay = new Date(s.getFullYear(), s.getMonth() + 3, 0)
       e.setFullYear(s.getFullYear())
       e.setMonth(s.getMonth() + 2)
       e.setDate(lastDay.getDate())
    } else if (activePreset === '2W') {
       s.setDate(s.getDate() + direction * 14)
       e.setDate(e.getDate() + direction * 14)
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

  const tasks = useMemo<ExtendedTask[]>(() => {
    const result: ExtendedTask[] = []
    const displayJobs = isDraftMode ? draftJobs : jobs

    const BOUND_START = fromDate ? new Date(fromDate) : new Date()
    const BOUND_END = toDate ? new Date(toDate + ' 23:59:59') : new Date()
    
    const parseSafeDate = (val: any, fallback: Date): Date => {
      if (!val) return fallback
      const d = typeof val === 'string' || typeof val === 'number' ? new Date(val) : val
      if (!d || isNaN(d.getTime())) return fallback
      return d
    }

    const clampDate = (d: Date) => {
      if (!d || isNaN(d.getTime())) return new Date(BOUND_START)
      if (d.getTime() > 4000000000000) return new Date(BOUND_END)
      if (d.getTime() < 1000000000000) return new Date(BOUND_START)
      return d
    }

    const makeValidRange = (startDate: Date, endDate: Date) => {
      let s = clampDate(startDate)
      let e = clampDate(endDate)
      if (e.getTime() <= s.getTime()) {
        e = new Date(s.getTime() + 86400000) // Ensure end is at least 1 day after start
      }
      return { start: s, end: e }
    }

    // Sort jobs by deadline descending: newest (latest deadline) at the top, oldest at the bottom
    const sortedJobs = [...displayJobs].sort((a, b) => {
      const dlA = a.mold_deadline || a.deadline || ''
      const dlB = b.mold_deadline || b.deadline || ''
      if (dlA && dlB) {
        const diff = new Date(dlB).getTime() - new Date(dlA).getTime()
        if (diff !== 0) return diff
      } else if (dlA && !dlB) {
        return -1
      } else if (!dlA && dlB) {
        return 1
      }
      return (new Date(b.created_at || 0).getTime()) - (new Date(a.created_at || 0).getTime())
    })

    // Process all jobs uniformly with full 3-level breakdown (Job -> Tracks -> Steps -> Add Step row)
    sortedJobs.forEach(job => {
      // If trackFilter is set, only include jobs that have at least one step for this track
      if (trackFilter && trackFilter !== 'ALL') {
        const hasMatchingStep = job.job_steps?.some(step => {
          if (
            (step as any).condition === 'EXISTING' ||
            (step as any).step_status === 'EXISTING' ||
            (step as any).arrangement === 'NOT_REQUIRED'
          ) {
            return false
          }
          const track = (step.track || 'MOLD').toUpperCase()
          if (trackFilter === 'MOLD') return track === 'MOLD' || track === 'ALUMI' || track === 'FINISH'
          return track === trackFilter
        })
        if (!hasMatchingStep) return
      }

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
        const targetDl = job.mold_deadline || job.deadline
        if (targetDl) {
            projEnd = new Date(targetDl)
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

      // Extract Product Code, Job Type, and WO Code from DB relations
      const prodCode = (job as any).products?.product_name_internal || (job as any).products?.product_code || (job as any).mold_masters?.products?.product_name_internal || ''
      const typeName = (job as any).job_types?.job_type_name_ja || ((job as any).job_name?.includes(':') ? (job as any).job_name.split(':')[0].trim() : '')
      const woCode = (job as any).work_orders?.wo_code

      let cleanedJobName = job.job_name || job.job_code

      if (prodCode) {
        let revSuffix = ''
        if ((job as any).design_revisions?.revision_number !== undefined && (job as any).design_revisions?.revision_number > 0) {
          revSuffix = `-R${(job as any).design_revisions.revision_number}`
        }
        const fullProductDisplay = prodCode.includes('-R') || !revSuffix ? prodCode : `${prodCode}${revSuffix}`
        const displayType = typeName || ((job as any).job_name?.replace(/^[A-Z0-9_-]+[:\s]*/i, '') || '金型製作')
        
        cleanedJobName = `${fullProductDisplay}: ${displayType}`
        if (woCode) {
          cleanedJobName = `${cleanedJobName} [${woCode}]`
        }
      } else {
        if (woCode) {
          cleanedJobName = `${cleanedJobName} [${woCode}]`
        }
      }

      result.push({
        id: job.job_id,
        name: cleanedJobName,
        start: cProjStart,
        end: cProjEnd,
        progress: job.overall_progress || 0,
        type: 'project',
        hideChildren: !expandedJobs.has(job.job_id),
        styles: { backgroundColor: s.color, progressColor: s.progressColor },
        originalJob: job,
      })

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

      const TRACK_ORDER = ['ALUMI', 'MOLD', 'PLUG', 'CUTTER', 'WATER COOLING BASE', 'PRESSIER BASE', 'STAKING', 'FRAME', 'MACHINE', 'OTHER', 'TEST MOLD', 'FINISH']
      const stepsByTrack = new Map<string, typeof job.job_steps>()

      job.job_steps?.forEach(step => {
        // Only include steps for equipment being manufactured (exclude shared existing equipment)
        if (
          (step as any).condition === 'EXISTING' ||
          (step as any).step_status === 'EXISTING' ||
          (step as any).arrangement === 'NOT_REQUIRED'
        ) {
          return
        }
        const track = (step.track || 'MOLD').toUpperCase()
        if (['WATER_BASE', 'WATER COOLING BASE', 'FRAME', 'PRESSIER BASE', 'PRESSURE_BASE', 'STAKING', 'STACKING'].includes(track)) {
          if ((step as any).condition !== 'NEW' && !(step as any).deadline && !(step as any).estimated_hours) {
            return
          }
        }
        if (!stepsByTrack.has(track)) stepsByTrack.set(track, [])
        stepsByTrack.get(track)!.push(step)
      })

      let presentTracks = TRACK_ORDER.filter(t => stepsByTrack.has(t))
      stepsByTrack.forEach((_, k) => { if (!TRACK_ORDER.includes(k)) presentTracks.push(k) })

      if (trackFilter && trackFilter !== 'ALL') {
        presentTracks = presentTracks.filter(t => {
          if (trackFilter === 'MOLD') return t === 'MOLD' || t === 'ALUMI' || t === 'FINISH'
          return t === trackFilter
        })
      }

      const makeDateRange = (startDate: Date, endDate: Date, hasDates: boolean) => {
          let cs = parseSafeDate(startDate, BOUND_START)
          let ce = parseSafeDate(endDate, BOUND_END)
          if (ce.getTime() <= cs.getTime() || !hasDates) ce = new Date(cs.getTime() + 86400000)
          return { start: cs, end: ce }
      }

      if (!expandedJobs.has(job.job_id)) return;

      presentTracks.forEach(trackCode => {
        const trackSteps = stepsByTrack.get(trackCode) || []
        const completedCount = trackSteps.filter(s => (s as any).processing_statuses?.status_code?.includes('完了') || s.step_status === 'COMPLETED').length
        const trackProgress = trackSteps.length > 0 ? Math.round((completedCount / trackSteps.length) * 100) : 0

        let trackDeadline: string | null = null
        trackSteps.forEach(s => {
          if (s.deadline) {
            const dStr = typeof s.deadline === 'string' ? s.deadline.split('T')[0] : s.deadline
            if (!trackDeadline || dStr > trackDeadline) trackDeadline = dStr
          }
        })
        if (!trackDeadline && (trackCode === 'MOLD' || trackCode === 'FINISH')) {
          trackDeadline = job.mold_deadline || job.deadline || null
        }

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

            const isAllExisting = trackSteps.length > 0 && trackSteps.every((s: any) => s.condition === 'EXISTING' || s.originalStep?.condition === 'EXISTING' || s.step_status === 'EXISTING');
            if (isAllExisting) {
                finalTrackStatus = 'EXISTING';
            } else if (trackSteps.length > 0 && completedCount === trackSteps.length) {
                finalTrackStatus = 'COMPLETED';
            } else if (totalLogs > 0 && finishedLogs === totalLogs) {
                finalTrackStatus = 'COMPLETED';
            } else if (completedCount > 0 || finishedLogs > 0 || hasHours || trackTotalActualHours > 0) {
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
              const stepDl = step.deadline ? new Date(step.deadline) : null
              
              let pStart: Date
              let pEnd: Date
              let hasPlannedStep = hasPlanned

              if (hasPlanned) {
                pStart = new Date(step.planned_start!)
                pEnd   = new Date(step.planned_end!)
              } else if (stepDl) {
                pEnd = new Date(stepDl)
                const daysNeeded = step.estimated_hours ? Math.ceil(step.estimated_hours / 8) : 1
                pStart = new Date(pEnd.getTime() - daysNeeded * 86400000)
                hasPlannedStep = true
              } else {
                pStart = new Date(projStart)
                pEnd   = new Date(projStart)
                pEnd.setDate(pEnd.getDate() + 1)
              }

              const aStart = hasActual ? new Date(step.actual_start!) : pStart
              const aEnd   = hasActual ? new Date(step.actual_end!) : pEnd

              pushTaskRows(
                  step.step_id, step.step_name || 'N/A',
                  pStart, pEnd, hasPlannedStep,
                  aStart, aEnd, hasActual,
                  progress, stepS,
                  step, null, dependencies
              )
          }
        })
      })

      // Push + Add Step row at the bottom of the expanded job
      if (expandedJobs.has(job.job_id)) {
        result.push({
          id: `${job.job_id}_add_step_row`,
          name: t('themCongDoanJobNay'),
          start: new Date(projStart),
          end: new Date(projEnd),
          progress: 0,
          type: 'task',
          project: job.job_id,
          dependencies: [],
          styles: { backgroundColor: 'transparent', progressColor: 'transparent', backgroundSelectedColor: 'transparent' },
          isAddStepRow: true,
          originalJobId: job.job_id,
          originalJob: job,
          isDisabled: false
        } as any)
      }

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
          const dlStr = job.mold_deadline || job.deadline
          if (dlStr) {
            const dl = new Date(dlStr)
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
  }, [jobs, draftJobs, isDraftMode, compareMode, expandedJobs, expandedTracks, fromDate, toDate, initialFromDate, initialToDate, trackFilter])

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
    let timeoutId: NodeJS.Timeout;
    
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newHeight = Math.floor(entry.contentRect.height) - 58;
        // Debounce to prevent layout thrashing infinite loops
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setGanttHeight(prev => {
            // Only update if difference is significant to avoid sub-pixel loops
            if (Math.abs(prev - newHeight) > 2) {
              return newHeight;
            }
            return prev;
          });
        }, 50);
      }
    });
    observer.observe(wrapperRef.current);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

  // Hybrid Wheel Clamping to prevent loop at boundaries while preserving smooth scrolling
  useEffect(() => {
    const container = wrapperRef.current;
    if (!container) return;

    const handleWheelCapture = (e: WheelEvent) => {
      const verticalScrollContainer = container.querySelector('._1eT-t') as HTMLElement;
      if (!verticalScrollContainer) return;

      if (!e.shiftKey && e.deltaY !== 0) {
        const maxScroll = verticalScrollContainer.scrollHeight - verticalScrollContainer.clientHeight;
        const currentScroll = verticalScrollContainer.scrollTop;
        
        const isScrollingDown = e.deltaY > 0;
        const isScrollingUp = e.deltaY < 0;
        
        // 5px tolerance range for boundary detection
        const nearTop = currentScroll <= 5;
        const nearBottom = currentScroll >= maxScroll - 5;
        
        if ((nearTop && isScrollingUp) || (nearBottom && isScrollingDown)) {
          // Block the event to prevent the library from calculating and looping
          e.stopPropagation();
          e.preventDefault();
          
          // Snap strictly to boundary
          if (isScrollingUp) {
            verticalScrollContainer.scrollTop = 0;
          } else {
            verticalScrollContainer.scrollTop = maxScroll;
          }
        }
      }
    };

    container.addEventListener('wheel', handleWheelCapture, { capture: true, passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheelCapture, { capture: true });
    };
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
    // Also expand all tracks (MOLD, PLUG, FINISH, CUTTER, etc.)
    const allTrackIds = new Set<string>()
    jobs.forEach(j => {
      const tracks = new Set<string>()
      j.job_steps?.forEach((s: any) => {
        tracks.add((s.track || 'MOLD').toUpperCase())
      })
      tracks.forEach(trackCode => {
        allTrackIds.add(`${j.job_id}_track_${trackCode}`)
      })
    })
    setExpandedTracks(allTrackIds)
  }, [jobs])

  const handleExpandTracksOnly = useCallback(() => {
    setExpandedJobs(new Set(jobs.map(j => j.job_id)))
    setExpandedTracks(new Set())
  }, [jobs])

  const handleCollapseAll = useCallback(() => {
    setExpandedJobs(new Set())
    setExpandedTracks(new Set())
  }, [])

  const handleEditStep = useCallback((task: ExtendedTask) => {
    if ((task as any).isAddStepRow) {
      setEditingJobId((task as any).originalJobId)
      setEditingStep(null)
      setEditingWorklog(null)
      return
    }
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
    const extTask = task as ExtendedTask
    if ((extTask as any).isAddStepRow) {
      setEditingJobId((extTask as any).originalJobId)
      setEditingStep(null)
      setEditingWorklog(null)
      return
    }
    if (task.isDisabled) return
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
    
    // gantt-task-react DOM structure:
    //   ._CZjuD (ganttVerticalContainer) → controls scrollLeft (horizontal chart scroll)
    //     └── svg (calendar header)
    //     └── ._2B2zv (horizontalContainer) → controls scrollTop (vertical chart scroll)
    //          └── svg (chart body with bars)
    //   ._1eT-t (VerticalScroll) → scrollbar rail on the right, synced via onScroll
    //   ._2k9Ys (HorizontalScroll) → scrollbar rail at the bottom, synced via onScroll
    
    // For horizontal scrolling: use the bottom scrollbar (._2k9Ys) which fires onScroll
    // and the library syncs ._CZjuD.scrollLeft automatically
    let horizontalScrollContainer = ganttEl.querySelector('._2k9Ys') as HTMLElement;
    
    // For vertical scrolling: use the right scrollbar (._1eT-t) which fires onScroll  
    // and the library syncs ._2B2zv.scrollTop automatically
    let verticalScrollContainer = ganttEl.querySelector('._1eT-t') as HTMLElement;
    
    // Fallback: if scrollbar elements not found, try the actual chart containers directly
    if (!horizontalScrollContainer) {
      horizontalScrollContainer = ganttEl.querySelector('._CZjuD') as HTMLElement;
    }
    if (!verticalScrollContainer) {
      verticalScrollContainer = ganttEl.querySelector('._2B2zv') as HTMLElement;
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

    if (tasksRef.current.length === 0) return false

    // Filter visible tasks (excluding collapsed ones) exactly like gantt-task-react does
    const getChildren = (taskList: ExtendedTask[], task: ExtendedTask) => {
      return taskList.filter(t => t.project === task.id)
    }

    const removeHiddenTasks = (taskList: ExtendedTask[]) => {
      let filtered = [...taskList]
      const groupedTasks = filtered.filter(t => t.hideChildren && t.type === 'project')
      for (let i = 0; i < groupedTasks.length; i++) {
        const groupedTask = groupedTasks[i]
        const children = getChildren(filtered, groupedTask)
        filtered = filtered.filter(t => children.indexOf(t) === -1)
      }
      return filtered
    }

    const visibleTasks = removeHiddenTasks(tasksRef.current)
    if (visibleTasks.length === 0) return false

    // Find the bounds of visible tasks to determine the grid range exactly like gantt-task-react
    let minTaskDate = visibleTasks[0].start
    let maxTaskDate = visibleTasks[0].start
    visibleTasks.forEach(t => {
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

    // =====================================================================
    // STEP 1: SCROLL — use ._2k9Ys (horizontal) and ._1eT-t (vertical)
    // These are the only elements with real overflow that fire onScroll.
    // The library syncs chart body containers via React state.
    // We use behavior: 'auto' (instant) here to make it extremely responsive
    // and avoid any visual scroll animation lag.
    // =====================================================================
    requestAnimationFrame(() => {
      if (horizontalScrollContainer) {
        horizontalScrollContainer.scrollTo({ left: scrollToLeft, behavior: 'auto' })
      }
      if (verticalScrollContainer) {
        verticalScrollContainer.scrollTo({ top: scrollToTop, behavior: 'auto' })
      }
    })

    // =====================================================================
    // STEP 2: DRAW RED LINE — delayed to run AFTER scroll completes
    // 
    // WHY the delay is critical:
    // scroll → fires onScroll event → library calls setScrollX/Y
    // → React re-render → SVG DOM may be recreated
    // → any elements appended to old SVG are lost
    //
    // By waiting 100ms (almost instant to human eye), we ensure React
    // has finished re-rendering, and we find the FRESH SVG element.
    // =====================================================================
    const drawRedLineIndicators = () => {
      if (!ganttEl) return

      // Find chart body SVG fresh — always search from ganttEl, never cache
      let chartSvg: SVGSVGElement | null = null;
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

      // Remove any existing pulse indicators
      ganttEl.querySelectorAll('.date-locate-pulse').forEach(el => el.remove())

      let highlightPixel = targetPixel
      if (highlightDateString) {
        const hdDate = new Date(highlightDateString)
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
        // Horizontal row highlight (red band)
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
          const barWrappers = chartSvg.querySelectorAll('g[tabindex="0"]')
          if (barWrappers && barWrappers[rowIndex]) {
            const targetWrapper = barWrappers[rowIndex]
            targetWrapper.classList.add('highlighted-job-bar')
            setTimeout(() => targetWrapper.classList.remove('highlighted-job-bar'), 3500)
          }
        }

        // Vertical red line at target date
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
    }

    // Delay drawing 100ms (instant to eye, but lets DOM/React sync complete)
    setTimeout(drawRedLineIndicators, 100)

    return false
  }, [router])



  // Auto-scroll when navigated via locateDate URL param
  useEffect(() => {
    const locateDate = searchParams?.get('locateDate')
    const locateRow = searchParams?.get('locateRow')
    const highlightDate = searchParams?.get('highlightDate')
    
    if (locateDate && wrapperRef.current) {
      // Loop protection: if we've already handled this precise URL locate parameters, skip!
      const locateKey = `${locateDate}_${locateRow || ''}_${highlightDate || ''}`
      if (processedLocateRef.current === locateKey) {
        return
      }
      
      const targetMs = new Date(locateDate).getTime()
      
      // We must wait until the Server Component has actually fetched the expanded date range
      // and passed it down via initialFromDate / initialToDate, otherwise the scroll logic
      // will run on the old data, return true (out of bounds), and never draw the pulse.
      const bStart = new Date(initialFromDate || Date.now()).getTime()
      const bEnd = new Date(initialToDate || Date.now()).getTime()
      const leeway = 7 * 24 * 60 * 60 * 1000 // Add some leeway for task bounds extending beyond
      
      if (targetMs >= bStart - leeway && targetMs <= bEnd + leeway) {
        processedLocateRef.current = locateKey // Mark as handled immediately to prevent async race
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

  // Updated with 完成期日 & 出荷期日 columns — 10 cols when showDates, 8 cols otherwise
  const GRID_TEMPLATE = isPanelExpanded 
    ? (showDates ? '150px 65px 36px 36px 58px 52px 55px 55px 72px 72px' : '190px 70px 38px 38px 60px 60px 75px 75px') 
    : '200px'

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
    onExpandTracksOnly: handleExpandTracksOnly,
    onCollapseAll: handleCollapseAll,
    onOpenQuickView: setQuickViewJob,
    onSelectJob: setSelectedJobId,
    onSelectTask: handleSelectTask,
    showDates,
  }), [isPanelExpanded, GRID_TEMPLATE, machOptions, empOptions, compareMode, handleScrollToDate, handleEditStep, updateLocalStep, handleExpandAll, handleExpandTracksOnly, handleCollapseAll, handleSelectTask, showDates])

  // Volatile context: changes frequently (on every edit/expand)
  // Only StaticTableComponent subscribes to this
  const dataValue = useMemo(() => ({
    expandedJobs, expandedTracks,
    localSteps,
    selectedJobId,
    selectedTaskId,
    selectedTask,
    originalTasks: tasks,
  }), [expandedJobs, expandedTracks, localSteps, selectedJobId, selectedTaskId, selectedTask, tasks])

  if (tasks.length === 0) return null
  const hasEdits = Object.keys(localSteps).length > 0

  const activeFilterCls = 'bg-[var(--accent-subtle)] shadow-sm font-semibold text-[var(--accent)] border-[var(--accent-light)]'
  const inactiveCls = 'text-[var(--text-muted)] border-transparent hover:bg-[var(--bg-hover)]'

  return (
    <GanttHandlersContext.Provider value={handlersValue}>
    <GanttDataContext.Provider value={dataValue}>
      <div className="card-flat flex flex-col h-full" style={{ overflow: 'hidden' }}>
        <div className="flex items-center justify-between border-b px-2.5 py-1 gap-2 shrink-0 flex-wrap md:flex-nowrap" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-surface)' }}>
          {/* GROUP 1: Time Navigation & Scope */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Quick Shift buttons */}
            <div className="flex items-center border rounded overflow-hidden shadow-sm h-7" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-surface-2)' }}>
              <button className="px-2 transition-colors flex items-center text-[10px] hover:bg-[var(--bg-hover)] h-full cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => shiftDateRange(-1)} title={t('prev')}>
                <ChevronLeft size={12} />
              </button>
              <div className="w-px h-full bg-[var(--border-default)]" />
              <button className="px-2.5 transition-colors text-[10.5px] font-semibold hover:bg-[var(--bg-hover)] h-full flex items-center cursor-pointer" style={{ color: 'var(--text-primary)' }} onClick={handleTodayClick} title={t('today')}>
                {t('today')}
              </button>
              <div className="w-px h-full bg-[var(--border-default)]" />
              <button className="px-2 transition-colors flex items-center text-[10px] hover:bg-[var(--bg-hover)] h-full cursor-pointer" style={{ color: 'var(--text-secondary)' }} onClick={() => shiftDateRange(1)} title={t('next')}>
                <ChevronRight size={12} />
              </button>
            </div>

            {/* Date Pickers */}
            <div className="flex items-center gap-1 px-1.5 border rounded shadow-sm h-7" style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-default)' }}>
              <input type="date" className="form-input text-[10.5px] py-0 px-0.5 h-5 w-[100px] bg-transparent border-0 font-mono text-[var(--text-primary)]" value={fromDate} onChange={e => { setFromDate(e.target.value); setActivePreset(''); handleApplyDateFilter(e.target.value, toDateRef.current); }} />
              <span className="text-[10px] text-[var(--text-muted)] font-bold">~</span>
              <input type="date" className="form-input text-[10.5px] py-0 px-0.5 h-5 w-[100px] bg-transparent border-0 font-mono text-[var(--text-primary)]" value={toDate} onChange={e => { setToDate(e.target.value); setActivePreset(''); handleApplyDateFilter(fromDateRef.current, e.target.value); }} />
            </div>

            {/* Presets */}
            <div className="flex p-0.5 rounded border shadow-sm items-center h-7 gap-0.5" style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-default)' }}>
              <button className={`px-2 py-0.5 font-medium rounded-sm border transition-all text-[10px] h-5.5 flex items-center cursor-pointer ${activePreset === '2W' ? activeFilterCls : inactiveCls}`} onClick={() => setViewRange('2W')}>2週間</button>
              <button className={`px-2 py-0.5 font-medium rounded-sm border transition-all text-[10px] h-5.5 flex items-center cursor-pointer ${activePreset === '1M' ? activeFilterCls : inactiveCls}`} onClick={() => setViewRange('1M')}>1ヶ月</button>
              <button className={`px-2 py-0.5 font-medium rounded-sm border transition-all text-[10px] h-5.5 flex items-center cursor-pointer ${activePreset === '3M' ? activeFilterCls : inactiveCls}`} onClick={() => setViewRange('3M')}>3ヶ月</button>
            </div>
          </div>

          {/* GROUP 2: View Unit, Compare & Columns */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Expansion levels */}
            <div className="flex p-0.5 rounded border shadow-sm items-center h-7 gap-0.5" style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-default)' }}>
              <button 
                type="button"
                className={`px-2 py-0.5 font-medium rounded-sm border transition-all text-[10px] h-5.5 flex items-center cursor-pointer ${expandedJobs.size === 0 ? activeFilterCls : inactiveCls}`} 
                onClick={handleCollapseAll}
                title={t('collapseAll')}
              >
                {t('collapseAll')}
              </button>
              <button 
                type="button"
                className={`px-2 py-0.5 font-medium rounded-sm border transition-all text-[10px] h-5.5 flex items-center cursor-pointer ${expandedJobs.size > 0 && expandedTracks.size === 0 ? activeFilterCls : inactiveCls}`} 
                onClick={handleExpandTracksOnly}
                title={t('expandTracksOnly')}
              >
                ⚙️ {t('expandTracksOnly')}
              </button>
              <button 
                type="button"
                className={`px-2 py-0.5 font-medium rounded-sm border transition-all text-[10px] h-5.5 flex items-center cursor-pointer ${expandedTracks.size > 0 ? activeFilterCls : inactiveCls}`} 
                onClick={handleExpandAll}
                title={t('expandAll')}
              >
                ＋ {t('expandAll')}
              </button>
            </div>

            {/* View Resolution */}
            <div className="flex p-0.5 rounded border shadow-sm items-center h-7 gap-0.5" style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-default)' }}>
              <button className={`px-2.5 py-0.5 font-medium rounded-sm border transition-all text-[10px] h-5.5 flex items-center cursor-pointer ${viewMode === ViewMode.Day ? activeFilterCls : inactiveCls}`} onClick={() => setViewMode(ViewMode.Day)}>日</button>
              <button className={`px-2.5 py-0.5 font-medium rounded-sm border transition-all text-[10px] h-5.5 flex items-center cursor-pointer ${viewMode === ViewMode.Week ? activeFilterCls : inactiveCls}`} onClick={() => setViewMode(ViewMode.Week)}>週</button>
              <button className={`px-2.5 py-0.5 font-medium rounded-sm border transition-all text-[10px] h-5.5 flex items-center cursor-pointer ${viewMode === ViewMode.Month ? activeFilterCls : inactiveCls}`} onClick={() => setViewMode(ViewMode.Month)}>月</button>
            </div>

            {/* Compare Mode */}
            <div className="flex p-0.5 rounded border shadow-sm items-center h-7 gap-0.5" style={{ backgroundColor: 'var(--bg-surface-2)', borderColor: 'var(--border-default)' }}>
              <button className={`px-3 py-0.5 font-medium rounded-sm border transition-all text-[10.5px] h-5.5 flex items-center cursor-pointer ${compareMode === 'PLANNED' ? activeFilterCls : inactiveCls}`} onClick={() => setCompareMode('PLANNED')}>予定</button>
              <button className={`px-3 py-0.5 font-medium rounded-sm border transition-all text-[10.5px] h-5.5 flex items-center cursor-pointer ${compareMode === 'ACTUAL' ? activeFilterCls : inactiveCls}`} onClick={() => setCompareMode('ACTUAL')}>実績</button>
              <button className={`px-3 py-0.5 font-medium rounded-sm border transition-all text-[10.5px] h-5.5 flex items-center cursor-pointer ${compareMode === 'COMPARE' ? activeFilterCls : inactiveCls}`} onClick={() => setCompareMode('COMPARE')}>予実比較</button>
            </div>

            {/* Dates toggle */}
            <button 
              type="button"
              className={`flex items-center gap-1 px-2 rounded border shadow-sm h-7 text-[10px] font-medium transition-all cursor-pointer ${showDates ? 'bg-[var(--accent-subtle)] border-[var(--accent-light)] text-[var(--accent)]' : 'bg-[var(--bg-surface-2)] border-[var(--border-default)] text-[var(--text-secondary)]'}`}
              onClick={() => setShowDates(!showDates)}
              title="開始日・終了日列の表示切り替え"
            >
              <CalendarRange size={12} />
              <span>日程</span>
            </button>
          </div>

          {/* GROUP 3: Panel Toggle */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Expand / Collapse panel */}
            <button className="btn btn-secondary text-[10px] px-2 h-7 cursor-pointer" onClick={() => setIsPanelExpanded(!isPanelExpanded)} title={isPanelExpanded ? 'パネルを折りたたむ' : 'パネルを展開'}>
              {isPanelExpanded ? '◀' : '▶'}
            </button>
          </div>

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

          /* Force auto scroll behavior and no overscroll to prevent infinite scroll loops at boundaries */
          ._1eT-t {
            scroll-behavior: auto !important;
            overscroll-behavior: none !important;
          }
        `}} />
        <Gantt
          tasks={tasks}
          viewMode={viewMode}
          locale="ja"
          headerHeight={40}
          ganttHeight={Math.max(0, Math.min(ganttHeight, tasks.length * (compareMode === 'COMPARE' ? 44 : 26)))}
          onDateChange={handleTaskChange}
          onProgressChange={handleTaskChange}
          onDoubleClick={handleTaskDoubleClick}
          onExpanderClick={handleExpanderClick}
          listCellWidth={isPanelExpanded ? (showDates ? "670px" : "620px") : "200px"}
          columnWidth={viewMode === ViewMode.Month ? 150 : 60}
          fontFamily="var(--font-jp)"
          fontSize="10px"
          TaskListHeader={StaticHeaderComponent}
          TaskListTable={StaticTableComponent}
          rowHeight={compareMode === 'COMPARE' ? 44 : 26}
          barBackgroundColor="var(--bg-surface-3)"
        />
      </div>

      {editingJobId && (
        <EditStepModal
          jobId={editingJobId}
          step={editingStep}
          nextStepNo={editingStep?.step_no || 1}
          initialLog={editingWorklog}
          onClose={() => {
            setEditingJobId(null)
            setEditingStep(null)
            setEditingWorklog(null)
          }}
          onSaved={() => {
            router.refresh()
          }}
        />
      )}

      {isWorklogModalOpen && (
        <DailyWorklogQuickModal
          isOpen={isWorklogModalOpen}
          onClose={() => {
            setIsWorklogModalOpen(false)
            setWorklogDefaultJobId(undefined)
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

      {isOCRModalOpen && (
        <ManufacturingSheetOCRModal
          isOpen={isOCRModalOpen}
          onClose={() => setIsOCRModalOpen(false)}
          onSuccess={() => {
            setIsOCRModalOpen(false)
            router.refresh()
          }}
        />
      )}

      {isPrintNippoModalOpen && (
        <DailyWorklogQuickModal
          isOpen={isPrintNippoModalOpen}
          onClose={() => setIsPrintNippoModalOpen(false)}
        />
      )}
    </div>
    </GanttDataContext.Provider>
    </GanttHandlersContext.Provider>
  )
}
