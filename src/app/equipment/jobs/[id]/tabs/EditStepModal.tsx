'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  X, Loader2, Trash2, Clock,
  Calendar, CheckCircle2, FileText, ChevronDown, ChevronUp,
  Printer, FileDown, Eye, Plus, Layers, User,
  Edit3
} from 'lucide-react'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { DailyWorklogA4Sheet, PRICE_MAP, NippoItem } from '@/components/worklogs/DailyWorklogA4Sheet'
import { getEmployeeStampUrl } from '@/lib/utils/stampUtils'

type StepData = {
  step_id: string
  step_no: number
  step_name: string
  step_status: string | null
  track: string | null
  planned_start: string | null
  planned_end: string | null
  planned_hours: number | null
  actual_hours: number | null
  estimated_hours: number | null
  machining_location: string | null
  machine_id: string | null
  assigned_to: string | null
  deadline: string | null
  notes: string | null
  item_type_id?: number | null
  processing_status_id?: number | null
}

type Props = {
  step: StepData | null
  jobId: string
  nextStepNo: number
  initialLog?: any
  onClose: () => void
  onSaved: () => void
}

const QUICK_HOURS = [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0, 8.0]
const STORAGE_KEY_LAST_WORKER = 'ysdms_last_selected_worker_id'

export function EditStepModal({ step, jobId, nextStepNo, initialLog, onClose, onSaved }: Props) {
  const t = useTranslations()
  const supabase = createClient()
  const isNew = !step

  const [error, setError] = useState<string | null>(null)

  // Master Reference Data fetched from DB tables (NO hardcoding)
  const [itemTypes, setItemTypes] = useState<any[]>([])
  const [processingCodes, setProcessingCodes] = useState<{ value: string; label: string }[]>([])
  const [rawCodes, setRawCodes] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  // Step Configuration State (For New Step or Editing Step metadata)
  const [isEditingStepConfig, setIsEditingStepConfig] = useState(isNew)
  const [stepName, setStepName] = useState(step?.step_name || '')
  const [selectedItemTypeId, setSelectedItemTypeId] = useState<string>(step?.item_type_id ? String(step.item_type_id) : '7')
  const [stepTrack, setStepTrack] = useState(step?.track || 'STACKING')
  const [stepNo, setStepNo] = useState(step?.step_no || nextStepNo || 1)
  const [stepStatus, setStepStatus] = useState<string>(step?.step_status || 'PENDING')
  const [plannedHours, setPlannedHours] = useState(step?.planned_hours ? String(step.planned_hours) : '2.0')
  const [stepDeadline, setStepDeadline] = useState(step?.deadline ? step.deadline.split('T')[0] : '')
  const [stepAssignedTo, setStepAssignedTo] = useState(step?.assigned_to || '')
  const [stepNotes, setStepNotes] = useState(step?.notes || '')
  const [savingStep, setSavingStep] = useState(false)

  // Status options for Step/Component
  const STEP_STATUS_OPTIONS = [
    { value: 'PENDING', label: '未着手', bg: 'var(--bg-surface-2, #F1F5F9)', text: 'var(--text-muted, #64748B)', border: 'var(--border-default, #CBD5E1)' },
    { value: 'IN_PROGRESS', label: '進行中', bg: 'var(--tint-amber-bg, #FEF3C7)', text: 'var(--status-warning, #D97706)', border: '#F59E0B' },
    { value: 'COMPLETED', label: '完了', bg: 'var(--status-success-bg, #DCFCE7)', text: 'var(--status-success, #16A34A)', border: '#22C55E' },
    { value: 'ON_HOLD', label: '保留', bg: 'var(--tint-purple-bg, #EDE9FE)', text: '#7C3AED', border: '#8B5CF6' },
    { value: 'CANCELLED', label: '中止', bg: '#FEE2E2', text: '#DC2626', border: '#EF4444' },
  ]

  const handleUpdateStepStatus = async (newStatus: string) => {
    setStepStatus(newStatus)
    if (step?.step_id) {
      try {
        const { error } = await supabase
          .from('job_steps')
          .update({ step_status: newStatus })
          .eq('step_id', step.step_id)
        if (error) throw error
        onSaved()
      } catch (err: any) {
        alert('ステータス更新エラー: ' + err.message)
      }
    }
  }

  // Job metadata for clear context anchor
  const [jobMeta, setJobMeta] = useState<{
    job_code?: string | null
    job_name?: string | null
    job_category?: string | null
    deadline?: string | null
    mold_deadline?: string | null
  } | null>(null)

  // Worklogs list for this step (all dates)
  const [logs, setLogs] = useState<any[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)

  // Worklogs for this worker on selected date (All jobs today)
  const [todayWorkerLogs, setTodayWorkerLogs] = useState<any[]>([])
  const [loadingTodayLogs, setLoadingTodayLogs] = useState(false)
  const [isStepHistoryExpanded, setIsStepHistoryExpanded] = useState(true)

  // Focused Log Form State (Pre-populate with initialLog if provided)
  const [editingLogId, setEditingLogId] = useState<string | null>(initialLog?.log_id || initialLog?.id || null)
  const [logWorkDate, setLogWorkDate] = useState(
    initialLog?.work_date ? initialLog.work_date.split('T')[0] : new Date().toISOString().split('T')[0]
  )
  const [logWorker, setLogWorker] = useState(initialLog?.employee_id || '')
  const [logHours, setLogHours] = useState(
    initialLog?.hours_spent !== undefined && initialLog?.hours_spent !== null
      ? String(initialLog.hours_spent)
      : '1.0'
  )
  const [selectedCodeId, setSelectedCodeId] = useState<string>(
    initialLog?.processing_code_id ? String(initialLog.processing_code_id) : ''
  )
  const [customDescription, setCustomDescription] = useState(initialLog?.description || '')
  const [logNotes, setLogNotes] = useState(initialLog?.notes || '')
  const [logIsFinished, setLogIsFinished] = useState(Boolean(initialLog?.is_finished))
  const [addingLog, setAddingLog] = useState(false)

  useEffect(() => {
    if (initialLog) {
      setEditingLogId(initialLog.log_id || initialLog.id || null)
      if (initialLog.work_date) setLogWorkDate(initialLog.work_date.split('T')[0])
      if (initialLog.employee_id) setLogWorker(initialLog.employee_id)
      if (initialLog.hours_spent !== undefined && initialLog.hours_spent !== null) setLogHours(String(initialLog.hours_spent))
      if (initialLog.processing_code_id) setSelectedCodeId(String(initialLog.processing_code_id))
      if (initialLog.description) setCustomDescription(initialLog.description)
      if (initialLog.notes) setLogNotes(initialLog.notes)
      if (initialLog.is_finished !== undefined) setLogIsFinished(Boolean(initialLog.is_finished))
    }
  }, [initialLog])

  // ── Load All Master Data Dynamically from DB ──
  useEffect(() => {
    async function loadMeta() {
      // 1. Fetch Job Info
      if (jobId) {
        const { data: jData } = await supabase
          .from('jobs')
          .select('job_id, job_code, job_name, job_category, deadline, mold_deadline')
          .eq('job_id', jobId)
          .maybeSingle()
        if (jData) {
          setJobMeta(jData)
          if (isNew && !stepDeadline) {
            const dl = jData.mold_deadline || (jData.deadline ? jData.deadline.split('T')[0] : '')
            if (dl) setStepDeadline(dl)
          }
        }

        if (isNew) {
          const { data: latestSteps } = await supabase
            .from('job_steps')
            .select('step_no')
            .eq('job_id', jobId)
            .order('step_no', { ascending: false })
            .limit(1)

          const nextNo = (latestSteps && latestSteps.length > 0 && latestSteps[0].step_no != null)
            ? latestSteps[0].step_no + 1
            : 1
          setStepNo(nextNo)
        }
      }

      // 2. Fetch Item Types (Phân nhánh), Processing Codes, Employees
      const [
        { data: itData },
        { data: codesData },
        { data: empData }
      ] = await Promise.all([
        supabase.from('item_types').select('*').order('item_type_id'),
        supabase.from('processing_codes').select('processing_code_id, processing_name').eq('is_active', true).order('processing_code_id'),
        supabase.from('employees').select('employee_id, employee_name, employee_name_short, employee_code').eq('is_active', true).order('employee_name')
      ])

      if (itData && itData.length > 0) {
        setItemTypes(itData)
        if (step?.item_type_id) {
          setSelectedItemTypeId(String(step.item_type_id))
        } else if (isNew && !stepName) {
          // Default to STACKING (id=7) or first item
          const stkItem = itData.find(i => i.item_type_code === 'STAKING' || i.item_type_code === 'STACKING') || itData[0]
          setSelectedItemTypeId(String(stkItem.item_type_id))
          setStepName(stkItem.item_type_name_ja + '製作')
          setStepTrack(stkItem.item_type_code?.toUpperCase() || 'STACKING')
        }
      }

      if (codesData) {
        setRawCodes(codesData)
        const codeOptions = codesData.map(c => ({
          value: String(c.processing_code_id),
          label: `[${c.processing_code_id}] ${c.processing_name}`
        }))
        setProcessingCodes(codeOptions)
      }

      if (empData) {
        setEmployees(empData)
        // Restore last selected worker from localStorage
        const lastWorker = localStorage.getItem(STORAGE_KEY_LAST_WORKER)
        if (lastWorker && empData.some(e => e.employee_id === lastWorker)) {
          setLogWorker(lastWorker)
        } else if (empData.length > 0 && !logWorker) {
          setLogWorker(empData[0].employee_id)
        }
      }
    }
    loadMeta()
  }, [jobId, isNew, step, supabase])

  // When changing item_type in Create Step, also auto set track and step name
  const handleItemTypeChange = (itId: string) => {
    setSelectedItemTypeId(itId)
    const it = itemTypes.find(i => String(i.item_type_id) === itId)
    if (it) {
      const code = it.item_type_code?.toUpperCase() || 'MOLD'
      if (code.includes('PLUG')) setStepTrack('PLUG')
      else if (code.includes('CUTTER')) setStepTrack('CUTTER')
      else if (code.includes('STAKING') || code.includes('STACKING')) setStepTrack('STACKING')
      else if (code.includes('BASE') || code.includes('WATER') || code.includes('PRESS')) setStepTrack('BASE')
      else setStepTrack('MOLD')

      // Set default step name if empty or generic
      setStepName(it.item_type_name_ja + (it.item_type_name_ja.endsWith('製作') || it.item_type_name_ja.endsWith('加工') ? '' : '製作'))
    }
  }

  // Handle worker change and persist to localStorage
  const handleWorkerChange = (val: string | null) => {
    const newWorkerId = val || ''
    setLogWorker(newWorkerId)
    if (newWorkerId) {
      localStorage.setItem(STORAGE_KEY_LAST_WORKER, newWorkerId)
    }
  }

  // Fetch worklogs for this step
  const fetchLogs = useCallback(async () => {
    if (!step?.step_id) return
    setLoadingLogs(true)
    const { data } = await supabase
      .from('work_logs')
      .select('log_id, work_date, hours_spent, description, notes, is_finished, employee_id, processing_code_id, employees:employee_id(employee_name, employee_name_short), processing_codes:processing_code_id(processing_code_id, processing_name)')
      .eq('job_step_id', step.step_id)
      .order('work_date', { ascending: false })

    if (data) setLogs(data)
    setLoadingLogs(false)
  }, [step?.step_id, supabase])

  // Fetch today's worklogs for this worker across ALL jobs
  const fetchTodayLogs = useCallback(async () => {
    if (!logWorker || !logWorkDate) {
      setTodayWorkerLogs([])
      return
    }
    setLoadingTodayLogs(true)
    const { data } = await supabase
      .from('work_logs')
      .select(`
        log_id, work_date, hours_spent, description, notes, is_finished, processing_code_id,
        jobs:job_id(
          job_code,
          job_name,
          physical_molds:equipment_id(equipment_code),
          products:product_id(product_code)
        ),
        job_steps:job_step_id(step_no, step_name),
        processing_codes:processing_code_id(processing_code_id, processing_name)
      `)
      .eq('employee_id', logWorker)
      .eq('work_date', logWorkDate)
      .order('created_at', { ascending: true })

    if (data) setTodayWorkerLogs(data)
    setLoadingTodayLogs(false)
  }, [logWorker, logWorkDate, supabase])

  useEffect(() => {
    if (step?.step_id) fetchLogs()
  }, [step?.step_id, fetchLogs])

  useEffect(() => {
    fetchTodayLogs()
  }, [fetchTodayLogs])

  // ── SAVE / CREATE STEP CONFIGURATION ──
  const handleSaveStepConfig = async () => {
    if (!stepName.trim()) {
      alert('工程名を入力または選択してください (Vui lòng nhập tên công đoạn)')
      return
    }
    setSavingStep(true)
    try {
      const itIdNum = selectedItemTypeId ? parseInt(selectedItemTypeId) : null
      const payload: any = {
        job_id: jobId,
        step_no: stepNo,
        step_name: stepName.trim(),
        item_type_id: itIdNum,
        track: stepTrack || 'STACKING',
        planned_hours: plannedHours ? parseFloat(plannedHours) : null,
        deadline: stepDeadline || null,
        assigned_to: stepAssignedTo || null,
        notes: stepNotes.trim() || null,
        step_status: step?.step_status || 'PENDING',
      }

      if (isNew) {
        // Query latest max step_no for this job to prevent duplicate key constraint
        const { data: latestSteps } = await supabase
          .from('job_steps')
          .select('step_no')
          .eq('job_id', jobId)
          .order('step_no', { ascending: false })
          .limit(1)

        const finalStepNo = (latestSteps && latestSteps.length > 0 && latestSteps[0].step_no != null)
          ? latestSteps[0].step_no + 1
          : (stepNo || 1)

        payload.step_no = finalStepNo

        const { error } = await supabase.from('job_steps').insert([payload])
        if (error) throw error
        onSaved()
        onClose()
      } else {
        const { error } = await supabase.from('job_steps').update(payload).eq('step_id', step.step_id)
        if (error) throw error
        onSaved()
        setIsEditingStepConfig(false)
      }
    } catch (err: any) {
      alert('エラー: ' + err.message)
    } finally {
      setSavingStep(false)
    }
  }

  // ── SAVE DAILY WORKLOG ENTRY ──
  const handleSaveLog = async () => {
    if (!logWorker) {
      alert('作業者を選択してください')
      return
    }
    const hours = parseFloat(logHours)
    if (!hours || isNaN(hours) || hours <= 0) {
      alert('実績時間を正しく入力してください')
      return
    }

    let desc = customDescription.trim()
    let codeId: number | null = null
    if (selectedCodeId) {
      codeId = parseInt(selectedCodeId)
      const matched = rawCodes.find(c => c.processing_code_id === codeId)
      if (matched) {
        desc = matched.processing_name
      }
    }

    if (!desc && !codeId && !logNotes.trim()) {
      alert('加工コード（作業内容）を選択してください')
      return
    }

    setAddingLog(true)
    try {
      const payload = {
        job_id: jobId,
        job_step_id: step?.step_id || null,
        work_date: logWorkDate || new Date().toISOString().split('T')[0],
        hours_spent: hours,
        employee_id: logWorker,
        processing_code_id: codeId,
        description: desc || null,
        notes: logNotes.trim() || null,
        is_finished: logIsFinished,
      }

      if (editingLogId) {
        const { error } = await supabase.from('work_logs').update(payload).eq('log_id', editingLogId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('work_logs').insert([payload])
        if (error) throw error
      }

      // Update actual hours sum on the step
      if (step?.step_id) {
        const { data: allLogs } = await supabase
          .from('work_logs')
          .select('hours_spent')
          .eq('job_step_id', step.step_id)
        
        if (allLogs) {
          const total = Math.round(allLogs.reduce((sum, l) => sum + (l.hours_spent || 0), 0) * 100) / 100
          await supabase.from('job_steps').update({ actual_hours: total }).eq('step_id', step.step_id)
        }
      }

      // Reset form fields
      setEditingLogId(null)
      setSelectedCodeId('')
      setCustomDescription('')
      setLogNotes('')
      setLogHours('1.0')
      setLogIsFinished(false)

      fetchLogs()
      fetchTodayLogs()
      onSaved()
    } catch (err: any) {
      alert('エラー: ' + err.message)
    } finally {
      setAddingLog(false)
    }
  }

  const handleDeleteLog = async (logId: string) => {
    if (!window.confirm('この作業日報を削除してもよろしいですか？')) return
    const { error } = await supabase.from('work_logs').delete().eq('log_id', logId)
    if (!error) {
      fetchLogs()
      fetchTodayLogs()
      onSaved()
    }
  }

  // Print Nippo Sheet Action
  const handlePrintSheet = (isPdf = false) => {
    const printContent = document.getElementById('nippo-a4-sheet-container')
    if (!printContent) return

    const printWin = window.open('', '_blank', 'width=1050,height=800')
    if (!printWin) return

    const workerObj = employees.find(e => e.employee_id === logWorker)
    const workerName = workerObj ? workerObj.employee_name : '担当者'

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>日報記録書_${workerName}_${logWorkDate}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background: #fff;
              color: #000;
              font-family: "MS PGothic", "Meiryo", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .nippo-a4-sheet {
              transform: none !important;
              box-shadow: none !important;
              border: none !important;
              padding: 22mm 12mm 20mm 12mm !important;
              width: 100% !important;
              height: 100% !important;
              box-sizing: border-box !important;
              page-break-inside: avoid;
            }
            .nippo-row-actions {
              display: none !important;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
            }
            window.onafterprint = function() {
              window.close();
            }
          </script>
        </body>
      </html>
    `)
    printWin.document.close()

    alert(`【印刷完了】\n日報記録書の印刷・PDF出力処理が完了しました。\n（対象: ${workerName}様・${logWorkDate}）`)
  }

  const selectedWorker = employees.find(e => e.employee_id === logWorker)
  const selectedWorkerName = selectedWorker?.employee_name || '担当者'
  const selectedWorkerShort = selectedWorker?.employee_name_short || selectedWorkerName
  const totalTodayHours = Math.round(todayWorkerLogs.reduce((sum, l) => sum + (l.hours_spent || 0), 0) * 100) / 100

  const employeeOptions = employees.map(e => ({
    value: e.employee_id,
    label: `[${e.employee_code || '—'}] ${e.employee_name}`
  }))

  const nippoItems: NippoItem[] = useMemo(() => {
    return todayWorkerLogs.map(l => {
      const pName = l.processing_codes?.processing_name || l.description || ''
      const moldCode = l.jobs?.physical_molds?.equipment_code || l.jobs?.products?.product_code || l.jobs?.job_code || ''
      return {
        log_id: l.log_id,
        model_code: moldCode,
        processing_name: pName,
        notes: l.notes || '',
        hours_spent: l.hours_spent,
        price_value: ''
      }
    })
  }, [todayWorkerLogs])

  // Current item type name for badge
  const currentItemType = itemTypes.find(i => String(i.item_type_id) === (step?.item_type_id ? String(step.item_type_id) : selectedItemTypeId))
  const currentItemTypeName = currentItemType?.item_type_name_ja || step?.track || '金型'
  const assignedWorkerName = employees.find(e => e.employee_id === (step?.assigned_to || stepAssignedTo))?.employee_name

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="card-flat"
        style={{
          width: '100%',
          maxWidth: isNew ? '580px' : '1360px',
          background: 'var(--bg-surface)',
          borderRadius: 8,
          boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '96vh',
          overflow: 'hidden',
          transition: 'max-width 0.2s ease',
        }}
      >
        {/* ── Modal Header: Context Anchor ── */}
        <div
          style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--tint-teal-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: '#fff',
                border: '1px solid var(--tint-teal-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              {isNew ? <Plus size={18} /> : <Clock size={18} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>
                  {isNew ? '新規工程の追加' : '作業日報の記録・工程情報'}
                </span>
                {jobMeta && (
                  <span
                    className="font-mono text-[12px] font-bold"
                    style={{
                      background: 'var(--tint-blue-bg)',
                      color: 'var(--tint-blue-text)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: '1px solid var(--tint-blue-border)',
                    }}
                  >
                    [{jobMeta.job_code}] {jobMeta.job_name}
                  </span>
                )}
                {!isNew && step && (
                  <span
                    className="text-[12px] font-bold"
                    style={{
                      background: 'var(--tint-purple-bg, #EDE9FE)',
                      color: 'var(--tint-purple-text, #7C3AED)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: '1px solid var(--tint-purple-border, #DDD6FE)',
                    }}
                  >
                    {jobMeta?.job_code === '社内作業' || jobMeta?.job_category === 'INTERNAL_OPS' ? '' : `Step ${step.step_no}. `}{step.step_name} [{currentItemTypeName}]
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                {isNew
                  ? 'スタッキング・金型・プラグ・抜型などの新しい工程を登録します'
                  : '対象工程を確認し、日報（実績工数・加工コード）を正確に記録します'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* ── IF IS_NEW: CLEAN COMPACT STEP CREATION FORM (NO PROCESSING CODES) ── */}
        {isNew ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
            
            {/* Field 1: 分類 (Item Type from DB) & Step Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                  項目分類 (Phân loại hạng mục) <span style={{ color: 'red' }}>*</span>
                </label>
                <select
                  className="form-input font-bold"
                  style={{ fontSize: 13, height: 38 }}
                  value={selectedItemTypeId}
                  onChange={(e) => handleItemTypeChange(e.target.value)}
                >
                  {itemTypes.map((it) => (
                    <option key={it.item_type_id} value={String(it.item_type_id)}>
                      {it.item_type_name_ja} ({it.item_type_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                  工程名 (Tên công đoạn) <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input font-bold"
                  style={{ fontSize: 13, height: 38 }}
                  placeholder="例: スタッキング製作、全型製作..."
                  value={stepName}
                  onChange={(e) => setStepName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Field 2: 予定工数 & 期日 */}
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                  予定工数 (h)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="form-input font-mono font-bold text-center"
                  style={{ fontSize: 15, height: 38, color: 'var(--accent)' }}
                  placeholder="2.0"
                  value={plannedHours}
                  onChange={(e) => setPlannedHours(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                  完了期日 (Kỳ hạn hoàn thành)
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar
                    size={14}
                    style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="date"
                    className="form-input font-mono font-bold"
                    style={{ paddingLeft: 30, fontSize: 13, height: 38 }}
                    value={stepDeadline}
                    onChange={(e) => setStepDeadline(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Field 3: 担当者 & 備考 */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                  担当作業者 (Người phụ trách)
                </label>
                <select
                  className="form-input"
                  style={{ fontSize: 12, height: 38 }}
                  value={stepAssignedTo}
                  onChange={(e) => setStepAssignedTo(e.target.value)}
                >
                  <option value="">— 選択なし —</option>
                  {employees.map((e) => (
                    <option key={e.employee_id} value={e.employee_id}>
                      [{e.employee_code || '—'}] {e.employee_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>
                  備考 (Ghi chú)
                </label>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: 12, height: 38 }}
                  placeholder="特記事項、治具など..."
                  value={stepNotes}
                  onChange={(e) => setStepNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ fontSize: 12, padding: '7px 20px' }}>
                キャンセル
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveStepConfig}
                disabled={savingStep}
                style={{ fontSize: 13, padding: '8px 24px', gap: 6 }}
              >
                {savingStep ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                <span>{savingStep ? '登録中...' : '工程を登録する (Tạo công đoạn)'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* ── IF !IS_NEW: 2-PANEL SPLIT SCREEN WORKLOG RECORDING BODY ── */
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', background: 'var(--bg-base, #F1F5F9)' }}>
            
            {/* ◀ LEFT PANEL: Step Info Card + Worklog Input Card (450px width) ◀ */}
            <div
              style={{
                width: '450px',
                borderRight: '1px solid var(--border-default)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                overflowY: 'auto',
                background: 'var(--bg-surface)',
              }}
            >
              {error && (
                <div style={{ padding: '8px 12px', background: 'var(--tint-error-bg)', color: 'var(--tint-error-text)', fontSize: 12, borderRadius: 6 }}>
                  {error}
                </div>
              )}

              {/* ── 1. STEP SPECIFICATION ANCHOR CARD ── */}
              <div
                style={{
                  border: '1px solid var(--tint-purple-border, #DDD6FE)',
                  borderRadius: 8,
                  background: 'var(--tint-purple-bg, #F5F3FF)',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div
                  style={{
                    padding: '8px 12px',
                    background: 'var(--tint-purple-bg, #EDE9FE)',
                    borderBottom: '1px solid var(--tint-purple-border, #DDD6FE)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Layers size={14} style={{ color: 'var(--tint-purple-text, #7C3AED)' }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--tint-purple-text, #7C3AED)' }}>
                      対象工程情報 (Thông tin công đoạn)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingStepConfig(!isEditingStepConfig)}
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: 'var(--tint-purple-text, #7C3AED)',
                      background: '#fff',
                      border: '1px solid var(--tint-purple-border, #DDD6FE)',
                      borderRadius: 4,
                      padding: '2px 7px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Edit3 size={11} />
                    <span>{isEditingStepConfig ? '日報入力に戻る' : '工程設定を変更'}</span>
                  </button>
                </div>

                {isEditingStepConfig ? (
                  /* Inline Edit Step Config Form */
                  <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10, background: '#FAFAFA' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 8 }}>
                      <div>
                        <label className="form-label" style={{ fontSize: 10.5, fontWeight: 700 }}>工程名</label>
                        <input
                          type="text"
                          className="form-input font-bold"
                          style={{ fontSize: 12, height: 32 }}
                          value={stepName}
                          onChange={(e) => setStepName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: 10.5, fontWeight: 700 }}>分類</label>
                        <select
                          className="form-input font-bold"
                          style={{ fontSize: 11, height: 32 }}
                          value={selectedItemTypeId}
                          onChange={(e) => handleItemTypeChange(e.target.value)}
                        >
                          {itemTypes.map((it) => (
                            <option key={it.item_type_id} value={String(it.item_type_id)}>
                              {it.item_type_name_ja}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 8 }}>
                      <div>
                        <label className="form-label" style={{ fontSize: 10.5, fontWeight: 700 }}>予定工数(h)</label>
                        <input
                          type="number"
                          step="0.5"
                          className="form-input font-mono text-center font-bold"
                          style={{ fontSize: 12, height: 32 }}
                          value={plannedHours}
                          onChange={(e) => setPlannedHours(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: 10.5, fontWeight: 700 }}>期日 (Deadline)</label>
                        <input
                          type="date"
                          className="form-input font-mono"
                          style={{ fontSize: 11.5, height: 32 }}
                          value={stepDeadline}
                          onChange={(e) => setStepDeadline(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveStepConfig}
                      disabled={savingStep}
                      style={{ fontSize: 11.5, padding: '5px 12px', justifyContent: 'center' }}
                    >
                      {savingStep ? '保存中...' : '工程設定を保存'}
                    </button>
                  </div>
                ) : (
                  /* Step Info Full-Tinted Container */
                  <div style={{ padding: '10px 12px', fontSize: 11.5, display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(237, 233, 254, 0.4)' }}>
                    {/* Row 1: Step Name + Track Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-primary)' }}>
                        {jobMeta?.job_code === '社内作業' || jobMeta?.job_category === 'INTERNAL_OPS' ? '' : `Step ${step?.step_no}. `}{step?.step_name}
                      </span>
                      <span
                        className="font-mono font-bold"
                        style={{
                          fontSize: 10.5,
                          background: 'var(--tint-purple-bg, #EDE9FE)',
                          color: 'var(--tint-purple-text, #7C3AED)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          border: '1px solid var(--tint-purple-border, #DDD6FE)',
                        }}
                      >
                        {currentItemTypeName}
                      </span>
                    </div>

                    {/* Row 2: Interactive Step Status Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', paddingTop: 2 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>
                        工程状態:
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {STEP_STATUS_OPTIONS.map((opt) => {
                          const isActive = (stepStatus || step?.step_status || 'PENDING') === opt.value
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleUpdateStepStatus(opt.value)}
                              style={{
                                padding: '2px 8px',
                                fontSize: 10.5,
                                fontWeight: isActive ? 800 : 500,
                                borderRadius: 4,
                                border: `1px solid ${isActive ? opt.border : 'var(--border-default)'}`,
                                background: isActive ? opt.bg : '#fff',
                                color: isActive ? opt.text : 'var(--text-muted)',
                                cursor: 'pointer',
                                boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              {isActive ? '✓ ' : ''}{opt.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Row 3: Specs Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', color: 'var(--text-secondary)', fontSize: 11, paddingTop: 6, borderTop: '1px dashed var(--tint-purple-border, #DDD6FE)' }}>
                      <div>
                        予定工数: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{plannedHours ? `${plannedHours}h` : step?.planned_hours ? `${step.planned_hours}h` : '—'}</strong>
                      </div>
                      <div>
                        累計実績: <strong className="font-mono" style={{ color: 'var(--status-success)' }}>{Math.round(logs.reduce((sum, l) => sum + (Number(l.hours_spent) || 0), 0) * 10) / 10}h</strong>
                      </div>
                      <div>
                        完了期日: <strong className="font-mono" style={{ color: (stepDeadline || step?.deadline) ? '#DC2626' : 'var(--text-primary)' }}>{(stepDeadline || step?.deadline) ? (stepDeadline || step?.deadline?.split('T')[0]) : '—'}</strong>
                      </div>
                      <div>
                        担当: <strong style={{ color: 'var(--text-primary)' }}>{assignedWorkerName || '—'}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── 2. FOCUSED WORKLOG INPUT CARD ── */}
              <div
                style={{
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                  background: '#fff',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '7px 12px',
                    background: 'var(--tint-blue-bg)',
                    borderBottom: '1px solid var(--tint-blue-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--tint-blue-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={13} />
                    <span>{editingLogId ? '日報データの編集' : '新規日報の登録'}</span>
                  </div>
                  {editingLogId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLogId(null)
                        setSelectedCodeId('')
                        setCustomDescription('')
                        setLogNotes('')
                        setLogHours('1.0')
                      }}
                      style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      編集キャンセル
                    </button>
                  )}
                </div>

                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {/* Row 1: Work Date & Worker */}
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                        作業日 <span style={{ color: 'red' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Calendar
                          size={13}
                          style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                        />
                        <input
                          type="date"
                          className="form-input font-mono"
                          style={{ paddingLeft: 28, fontSize: 12, fontWeight: 600, height: 34 }}
                          value={logWorkDate}
                          onChange={(e) => setLogWorkDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <label className="form-label" style={{ fontSize: 11, fontWeight: 700, margin: 0 }}>
                          作業者 <span style={{ color: 'red' }}>*</span>
                        </label>
                        <span style={{ fontSize: 9.5, color: 'var(--accent)', fontWeight: 600 }}>
                          ✓ 記憶中
                        </span>
                      </div>
                      <SearchableSelect
                        options={employeeOptions}
                        value={logWorker}
                        onChange={handleWorkerChange}
                        maxDropdownHeight="300px"
                      />
                    </div>
                  </div>

                  {/* Row 2: Actual Hours with Quick Chips */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 700, margin: 0 }}>
                        実績工数 (h) <span style={{ color: 'red' }}>*</span>
                      </label>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>クイック選択:</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 6, alignItems: 'center' }}>
                      <input
                        type="number"
                        step="0.25"
                        min="0.25"
                        max="24"
                        className="form-input font-mono text-center"
                        style={{ fontSize: 15, fontWeight: 800, color: 'var(--accent)', height: 34 }}
                        value={logHours}
                        onChange={(e) => setLogHours(e.target.value)}
                      />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {QUICK_HOURS.map((h) => {
                          const isSelected = parseFloat(logHours) === h
                          return (
                            <button
                              key={h}
                              type="button"
                              onClick={() => setLogHours(String(h))}
                              style={{
                                padding: '2px 5px',
                                fontSize: 10.5,
                                fontWeight: 700,
                                fontFamily: 'monospace',
                                borderRadius: 3,
                                border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-default)'}`,
                                background: isSelected ? 'var(--accent)' : 'var(--bg-muted, #F8FAFC)',
                                color: isSelected ? '#fff' : 'var(--text-secondary)',
                                cursor: 'pointer',
                              }}
                            >
                              {h}h
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Processing Code */}
                  <div>
                    <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                      加工コード・作業内容 <span style={{ color: 'red' }}>*</span>
                    </label>
                    <SearchableSelect
                      options={processingCodes}
                      value={selectedCodeId}
                      onChange={(v) => {
                        setSelectedCodeId(v || '')
                        if (v) {
                          const matched = rawCodes.find(c => c.processing_code_id === parseInt(v))
                          if (matched) setCustomDescription(matched.processing_name)
                        }
                      }}
                      placeholder="コードまたは作業名で検索（例: 21 穴あけ、12 ミガキ...）"
                      maxDropdownHeight="300px"
                    />
                  </div>

                  {/* Row 4: Notes */}
                  <div>
                    <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
                      備考・申し送り (Ghi chú)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: 11.5, height: 34 }}
                      placeholder="治具、引き継ぎ事項、特記事項など..."
                      value={logNotes}
                      onChange={(e) => setLogNotes(e.target.value)}
                    />
                  </div>

                  {/* Submit Log Button */}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveLog}
                    disabled={addingLog}
                    style={{ fontSize: 12.5, padding: '7px 16px', gap: 6, width: '100%', justifyContent: 'center', marginTop: 2 }}
                  >
                    {addingLog ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    <span>{addingLog ? '登録中...' : editingLogId ? '日報を更新' : '日報を登録する'}</span>
                  </button>
                </div>
              </div>

              {/* ── 3. STEP ALL-TIME HISTORY COLLAPSIBLE ── */}
              <div
                style={{
                  border: '1px solid var(--border-default)',
                  borderRadius: 6,
                  background: '#fff',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '6px 10px',
                    background: '#F8FAFC',
                    borderBottom: isStepHistoryExpanded ? '1px solid var(--border-default)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsStepHistoryExpanded(!isStepHistoryExpanded)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={13} style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>
                      この工程の全期間履歴（Step {step?.step_no}）
                    </span>
                    <span className="badge badge--neutral" style={{ fontSize: 10 }}>
                      {logs.length}件
                    </span>
                  </div>
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {isStepHistoryExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {isStepHistoryExpanded && (
                  <div style={{ padding: 4 }}>
                    {logs.length === 0 ? (
                      <div style={{ padding: 8, textAlign: 'center', color: 'var(--text-muted)', fontSize: 10.5 }}>
                        — 過去日報なし —
                      </div>
                    ) : (
                      <table className="data-table" style={{ fontSize: 10, width: '100%', tableLayout: 'fixed' }}>
                        <thead>
                          <tr>
                            <th style={{ width: 75, padding: '3px 4px', whiteSpace: 'nowrap' }}>作業日</th>
                            <th style={{ width: 105, padding: '3px 4px', whiteSpace: 'nowrap' }}>作業者</th>
                            <th style={{ width: 42, padding: '3px 4px', whiteSpace: 'nowrap', textAlign: 'right' }}>工数</th>
                            <th style={{ padding: '3px 4px', whiteSpace: 'nowrap' }}>内容</th>
                            <th style={{ width: 24, padding: '3px 2px', textAlign: 'center' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {logs.map((l) => (
                            <tr key={l.log_id}>
                              <td className="font-mono" style={{ fontSize: 9.5, padding: '3px 4px', whiteSpace: 'nowrap' }}>
                                {l.work_date}
                              </td>
                              <td style={{ fontSize: 10, padding: '3px 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={l.employees?.employee_name || ''}>
                                {l.employees?.employee_name_short || l.employees?.employee_name || '—'}
                              </td>
                              <td className="font-mono text-right font-bold" style={{ color: 'var(--accent)', fontSize: 10.5, padding: '3px 4px', whiteSpace: 'nowrap' }}>
                                {l.hours_spent || 0}h
                              </td>
                              <td style={{ fontSize: 9.5, padding: '3px 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.description || l.notes || ''}>
                                {l.description || l.notes || '—'}
                              </td>
                              <td className="text-center" style={{ padding: '3px 2px' }}>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLog(l.log_id)}
                                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--status-error)', padding: 2 }}
                                  title="削除"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ▶ RIGHT PANEL: Live A4 Nippo Sheet Preview & Export Tools ▶ */}
            <div
              style={{
                flex: 1,
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                overflowY: 'auto',
              }}
            >
              {/* Action Bar on top of sheet preview */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#fff',
                  padding: '7px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-default)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Eye size={14} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>
                    日報記録書プレビュー（{selectedWorkerShort} ・ {logWorkDate}）
                  </span>
                  <span
                    className="font-mono font-bold"
                    style={{
                      fontSize: 11,
                      background: 'var(--tint-teal-bg)',
                      color: 'var(--accent)',
                      padding: '2px 8px',
                      borderRadius: 4,
                      border: '1px solid var(--tint-teal-border)',
                    }}
                  >
                    本日合計: {totalTodayHours} H
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary flex items-center gap-1.5 shadow-sm"
                    style={{ fontSize: 11, padding: '4px 12px' }}
                    onClick={() => handlePrintSheet(false)}
                  >
                    <Printer size={13} />
                    <span>印刷 (Print)</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary flex items-center gap-1.5 shadow-sm"
                    style={{ fontSize: 11, padding: '4px 12px' }}
                    onClick={() => handlePrintSheet(true)}
                  >
                    <FileDown size={13} />
                    <span>PDF出力</span>
                  </button>
                </div>
              </div>

              {/* ── A4 Sheet Replica Container (Rendered exactly with DailyWorklogA4Sheet) ── */}
              <div
                id="nippo-a4-sheet-container"
                style={{
                  background: '#fff',
                  padding: '10px',
                  borderRadius: 6,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  border: '1px solid #CBD5E1',
                  overflowX: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <DailyWorklogA4Sheet
                  workDate={logWorkDate}
                  workerName={selectedWorkerName}
                  totalHours={totalTodayHours}
                  items={nippoItems}
                  stampUrl={getEmployeeStampUrl(selectedWorker)}
                  onEditItem={(item) => {
                    const targetLog = todayWorkerLogs.find(l => l.log_id === item.log_id)
                    if (targetLog) {
                      setEditingLogId(targetLog.log_id)
                      setLogWorkDate(targetLog.work_date || logWorkDate)
                      setLogHours(targetLog.hours_spent ? String(targetLog.hours_spent) : '')
                      setSelectedCodeId(targetLog.processing_code_id ? String(targetLog.processing_code_id) : '')
                      setLogNotes(targetLog.notes || '')
                    }
                  }}
                  onDeleteItem={(logId) => handleDeleteLog(logId)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Modal Footer ── */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button className="btn btn-secondary" onClick={onClose} style={{ fontSize: 12, padding: '5px 18px' }}>
            閉じる (Đóng)
          </button>
        </div>
      </div>
    </div>
  )
}
