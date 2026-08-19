'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  X, Loader2, Trash2, Clock,
  Calendar, CheckCircle2, FileText, ChevronDown, ChevronUp,
  Printer, FileDown, Eye, Plus, Layers, User,
  Edit3, Briefcase, ClipboardList, Settings
} from 'lucide-react'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { DailyWorklogA4Sheet, PRICE_MAP, NippoItem } from '@/components/worklogs/DailyWorklogA4Sheet'
import { getEmployeeStampUrl } from '@/lib/utils/stampUtils'
import { ProcessingCodesManagerModal } from '@/components/worklogs/ProcessingCodesManagerModal'

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
  step?: StepData | null
  jobId?: string | null
  nextStepNo?: number
  initialLog?: any
  mode?: 'edit_worklog' | 'create_step'
  onClose: () => void
  onSaved: () => void
}

const QUICK_HOURS = [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0, 8.0]
const STORAGE_KEY_LAST_WORKER = 'ysdms_last_selected_worker_id'

export function EditStepModal({ step, jobId, nextStepNo = 1, initialLog, mode = 'edit_worklog', onClose, onSaved }: Props) {
  const t = useTranslations()
  const supabase = createClient()
  const isNew = mode === 'create_step'

  const [error, setError] = useState<string | null>(null)

  // Master Reference Data fetched from DB tables (NO hardcoding)
  const [itemTypes, setItemTypes] = useState<any[]>([])
  const [processingCodes, setProcessingCodes] = useState<{ value: string; label: string }[]>([])
  const [rawCodes, setRawCodes] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  // Department filter for processing codes (Q7/Q8)
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL')
  const [showCodeManagerModal, setShowCodeManagerModal] = useState(false)

  const [activeJobId, setActiveJobId] = useState<string>(jobId || '')
  const [activeStep, setActiveStep] = useState<any>(step || null)
  const [allJobsOptions, setAllJobsOptions] = useState<{ value: string; label: string }[]>([])
  const [jobStepsList, setJobStepsList] = useState<any[]>([])

  const [isEditingStepConfig, setIsEditingStepConfig] = useState(isNew)
  const [stepName, setStepName] = useState(step?.step_name || '')
  const [selectedItemTypeId, setSelectedItemTypeId] = useState<string>(step?.item_type_id ? String(step.item_type_id) : '7')
  const [stepTrack, setStepTrack] = useState(step?.track || 'STACKING')
  const [manufactureLocation, setManufactureLocation] = useState<'IN_HOUSE' | 'OUTSOURCE'>(
    (step as any)?.manufacture_location === 'OUTSOURCE' ? 'OUTSOURCE' : 'IN_HOUSE'
  )
  const [stepNo, setStepNo] = useState(step?.step_no || nextStepNo || 1)
  const [stepStatus, setStepStatus] = useState<string>(step?.step_status || 'PENDING')
  const [plannedHours, setPlannedHours] = useState(step?.planned_hours ? String(step.planned_hours) : '2.0')
  const [stepDeadline, setStepDeadline] = useState(step?.deadline ? step.deadline.split('T')[0] : '')
  const [stepAssignedTo, setStepAssignedTo] = useState(step?.assigned_to || '')
  const [stepNotes, setStepNotes] = useState(step?.notes || '')
  const [savingStep, setSavingStep] = useState(false)

  // Sync state when step changes
  useEffect(() => {
    if (step) {
      setActiveStep(step)
      setStepName(step.step_name || '')
      setSelectedItemTypeId(step.item_type_id ? String(step.item_type_id) : '7')
      setStepTrack(step.track || 'STACKING')
      setManufactureLocation((step as any)?.manufacture_location === 'OUTSOURCE' ? 'OUTSOURCE' : 'IN_HOUSE')
      setStepNo(step.step_no || nextStepNo || 1)
      setStepStatus(step.step_status || 'PENDING')
      setPlannedHours(step.planned_hours ? String(step.planned_hours) : '2.0')
      setStepDeadline(step.deadline ? step.deadline.split('T')[0] : '')
      setStepAssignedTo(step.assigned_to || '')
      setStepNotes(step.notes || '')
    }
  }, [step, nextStepNo])

  useEffect(() => {
    if (jobId) setActiveJobId(jobId)
  }, [jobId])

  // Status options for Step/Component
  const STEP_STATUS_OPTIONS = [
    { value: 'PENDING', label: '未着手', icon: '⚪', activeBg: '#E2E8F0', activeText: '#0F172A', activeBorder: '#64748B' },
    { value: 'IN_PROGRESS', label: '進行中', icon: '🟠', activeBg: '#FEF3C7', activeText: '#92400E', activeBorder: '#F59E0B' },
    { value: 'COMPLETED', label: '完了', icon: '🟢', activeBg: '#DCFCE7', activeText: '#15803D', activeBorder: '#16A34A' },
    { value: 'ON_HOLD', label: '保留', icon: '🟣', activeBg: '#EDE9FE', activeText: '#6D28D9', activeBorder: '#8B5CF6' },
    { value: 'CANCELLED', label: '中止', icon: '🔴', activeBg: '#FEE2E2', activeText: '#B91C1C', activeBorder: '#EF4444' },
  ]

  const handleUpdateStepStatus = async (newStatus: string) => {
    setStepStatus(newStatus)
    const targetStepId = activeStep?.step_id || step?.step_id
    if (targetStepId) {
      try {
        let procStatusId: number | null = null
        if (newStatus === 'COMPLETED') procStatusId = 8
        else if (newStatus === 'IN_PROGRESS') procStatusId = 9
        else if (newStatus === 'PENDING') procStatusId = 1

        const payload: any = { step_status: newStatus }
        if (procStatusId) payload.processing_status_id = procStatusId

        const { error } = await supabase
          .from('job_steps')
          .update(payload)
          .eq('step_id', targetStepId)
        if (error) throw error

        if (activeStep) {
          setActiveStep({ ...activeStep, step_status: newStatus })
        }
        setJobStepsList(prev => prev.map(s => s.step_id === targetStepId ? { ...s, step_status: newStatus } : s))
        onSaved()
      } catch (err: any) {
        alert('ステータス更新エラー: ' + err.message)
      }
    }
  }

  // Job metadata
  const [jobMeta, setJobMeta] = useState<{
    job_code?: string | null
    job_name?: string | null
    job_category?: string | null
    deadline?: string | null
    mold_deadline?: string | null
  } | null>(null)

  const [logs, setLogs] = useState<any[]>([])
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [todayWorkerLogs, setTodayWorkerLogs] = useState<any[]>([])
  const [loadingTodayLogs, setLoadingTodayLogs] = useState(false)

  const [editingLogId, setEditingLogId] = useState<string | null>(initialLog?.log_id || initialLog?.id || null)
  const [logWorkDate, setLogWorkDate] = useState(
    initialLog?.work_date ? initialLog.work_date.split('T')[0] : new Date().toISOString().split('T')[0]
  )
  const [logWorker, setLogWorker] = useState(initialLog?.employee_id || '')
  const [logHours, setLogHours] = useState(
    initialLog?.hours_spent !== undefined && initialLog?.hours_spent !== null
      ? String(initialLog.hours_spent)
      : '0'
  )
  const [selectedCodeId, setSelectedCodeId] = useState<string>(
    initialLog?.processing_code_id ? String(initialLog.processing_code_id) : ''
  )
  const [customDescription, setCustomDescription] = useState(initialLog?.description || '')
  const [logNotes, setLogNotes] = useState(initialLog?.notes || '')
  const [logIsFinished, setLogIsFinished] = useState(Boolean(initialLog?.is_finished))
  const [addingLog, setAddingLog] = useState(false)

  // Print & Preview Options
  const [showStamp, setShowStamp] = useState(false)
  const [showHours, setShowHours] = useState(true)
  const [showZoomModal, setShowZoomModal] = useState(false)

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

  const handleSelectJob = async (newJobId: string) => {
    setActiveJobId(newJobId)
    if (!newJobId) {
      setJobMeta(null)
      setActiveStep(null)
      setJobStepsList([])
      setLogs([])
      return
    }

    const { data: jData } = await supabase
      .from('jobs')
      .select('job_id, job_code, job_name, job_category, deadline, mold_deadline')
      .eq('job_id', newJobId)
      .maybeSingle()
    if (jData) setJobMeta(jData)

    const { data: stps } = await supabase
      .from('job_steps')
      .select('*')
      .eq('job_id', newJobId)
      .order('step_no')

    if (stps && stps.length > 0) {
      setJobStepsList(stps)
      const firstStep = stps[0]
      setActiveStep(firstStep)
      setStepName(firstStep.step_name || '')
      setStepStatus(firstStep.step_status || 'PENDING')
      setPlannedHours(firstStep.planned_hours ? String(firstStep.planned_hours) : '2.0')
      setStepDeadline(firstStep.deadline ? firstStep.deadline.split('T')[0] : '')
      setStepTrack(firstStep.track || 'MOLD')
      setSelectedItemTypeId(firstStep.item_type_id ? String(firstStep.item_type_id) : '1')
      setStepNotes(firstStep.notes || '')
      setStepAssignedTo(firstStep.assigned_to || '')
    } else {
      setJobStepsList([])
      setActiveStep(null)
      setLogs([])
    }
  }

  const handleSelectStep = (st: any) => {
    setActiveStep(st)
    setStepName(st.step_name || '')
    setStepStatus(st.step_status || 'PENDING')
    setPlannedHours(st.planned_hours ? String(st.planned_hours) : '2.0')
    setStepDeadline(st.deadline ? st.deadline.split('T')[0] : '')
    setStepTrack(st.track || 'MOLD')
    setSelectedItemTypeId(st.item_type_id ? String(st.item_type_id) : '1')
    setStepNotes(st.notes || '')
    setStepAssignedTo(st.assigned_to || '')
  }

  // Load / Reload Processing Codes (with department_code)
  const loadProcessingCodes = async () => {
    const { data: codesData } = await supabase
      .from('processing_codes')
      .select('processing_code_id, processing_name, department_code, category')
      .eq('is_active', true)
      .order('processing_code_id')
    if (codesData) {
      setRawCodes(codesData)
      setProcessingCodes(codesData.map(c => ({
        value: String(c.processing_code_id),
        label: `[${c.processing_code_id}] ${c.processing_name}`
      })))
    }
  }

  // Auto-filter department when job changes
  useEffect(() => {
    if (!jobMeta) return
    if (jobMeta.job_category === 'DESIGN') {
      setDepartmentFilter('DESIGN')
    } else if (['MOLD_NEW', 'MOLD_MODIFY', 'CUTTER_NEW', 'EQUIPMENT_NEW', 'EQUIPMENT_REPAIR'].includes(jobMeta.job_category || '')) {
      setDepartmentFilter('MOLD_SHOP')
    } else if (jobMeta.job_category === 'INTERNAL_OPS' || jobMeta.job_category === 'MAINTENANCE') {
      setDepartmentFilter('GENERAL')
    } else {
      setDepartmentFilter('ALL')
    }
  }, [jobMeta])

  // Processing codes already recorded in the current step
  const recordedCodeIds = useMemo(() => {
    return new Set(logs.map(l => l.processing_code_id).filter(Boolean) as number[])
  }, [logs])

  // Context flags (Prototype vs Mass)
  const isPrototypeContext = useMemo(() => {
    const stepName = (activeStep?.step_name || '').toLowerCase()
    const jobCode = (jobMeta?.job_code || '').toLowerCase()
    return stepName.includes('試作') || jobCode.includes('-d') || jobCode.includes('prototype')
  }, [activeStep?.step_name, jobMeta?.job_code])

  const isMassContext = useMemo(() => {
    const stepName = (activeStep?.step_name || '').toLowerCase()
    return stepName.includes('本型') || (!isPrototypeContext && jobMeta?.job_category === 'DESIGN')
  }, [activeStep?.step_name, isPrototypeContext, jobMeta?.job_category])

  // All applicable processing codes for current department & context (Prototype vs Mass)
  const applicableProcessingCodes = useMemo(() => {
    return processingCodes.filter(pc => {
      const raw = rawCodes.find((c: any) => String(c.processing_code_id) === pc.value)
      if (!raw) return true

      // 1. Department filter
      if (departmentFilter !== 'ALL' && raw.department_code !== departmentFilter) {
        return false
      }

      // 2. Filter between 試作 and 本型 for Design codes
      if (raw.department_code === 'DESIGN' || departmentFilter === 'DESIGN') {
        const name = raw.processing_name || ''
        if (isPrototypeContext && !isMassContext) {
          // Prototype step -> exclude strictly mass-only codes
          if (name.includes('本型') || name === '3D金型図面作成') return false
        } else if (isMassContext && !isPrototypeContext) {
          // Mass production step -> exclude strictly prototype-only codes
          if (name.includes('試作')) return false
        }
      }

      return true
    })
  }, [processingCodes, rawCodes, departmentFilter, isPrototypeContext, isMassContext])

  // Dropdown options: Only hide recorded codes for DESIGN jobs (checklist mode)
  // For Mold Shop, Internal Ops & Production: keep all codes selectable for repeatable logging
  const dropdownProcessingCodes = useMemo(() => {
    if (jobMeta?.job_category === 'DESIGN') {
      return applicableProcessingCodes.filter(pc => {
        const codeId = parseInt(pc.value)
        if (editingLogId && selectedCodeId === pc.value) return true
        return !recordedCodeIds.has(codeId)
      })
    }
    return applicableProcessingCodes
  }, [applicableProcessingCodes, recordedCodeIds, editingLogId, selectedCodeId, jobMeta?.job_category])

  useEffect(() => {
    async function loadMeta() {
      const targetJob = activeJobId || jobId
      if (targetJob) {
        const { data: jData } = await supabase
          .from('jobs')
          .select('job_id, job_code, job_name, job_category, deadline, mold_deadline')
          .eq('job_id', targetJob)
          .maybeSingle()
        if (jData) setJobMeta(jData)

        const { data: stps } = await supabase
          .from('job_steps')
          .select('*')
          .eq('job_id', targetJob)
          .order('step_no')
        if (stps) {
          setJobStepsList(stps)
          if (!activeStep && stps.length > 0) {
            setActiveStep(stps[0])
            setStepName(stps[0].step_name || '')
            setStepStatus(stps[0].step_status || 'PENDING')
            setPlannedHours(stps[0].planned_hours ? String(stps[0].planned_hours) : '2.0')
            setStepDeadline(stps[0].deadline ? stps[0].deadline.split('T')[0] : '')
            setStepTrack(stps[0].track || 'MOLD')
            setSelectedItemTypeId(stps[0].item_type_id ? String(stps[0].item_type_id) : '1')
            setStepNotes(stps[0].notes || '')
            setStepAssignedTo(stps[0].assigned_to || '')
          }
        }

        if (isNew) {
          const nextNo = (stps && stps.length > 0 && stps[stps.length - 1].step_no != null)
            ? stps[stps.length - 1].step_no + 1
            : 1
          setStepNo(nextNo)
        }
      }

      const { data: jList } = await supabase
        .from('jobs')
        .select('job_id, job_code, job_name, job_category, products(product_code, product_name_internal)')
        .neq('job_status', 'CANCELLED')
        .order('job_code')

      if (jList) {
        setAllJobsOptions(jList.map(j => ({
          value: j.job_id,
          label: `[${j.job_code}] ${j.job_name || ''}`
        })))
      }

      const [
        { data: itData },
        { data: empData }
      ] = await Promise.all([
        supabase.from('item_types').select('*').order('item_type_id'),
        supabase.from('employees').select('employee_id, employee_name, employee_name_short, employee_code').eq('is_active', true).order('employee_name')
      ])

      if (itData && itData.length > 0) {
        setItemTypes(itData)
        if (step?.item_type_id) {
          setSelectedItemTypeId(String(step.item_type_id))
        } else if (isNew && !stepName) {
          const stkItem = itData.find(i => i.item_type_code === 'STAKING' || i.item_type_code === 'STACKING') || itData[0]
          setSelectedItemTypeId(String(stkItem.item_type_id))
          setStepName(stkItem.item_type_name_ja + '製作')
          setStepTrack(stkItem.item_type_code?.toUpperCase() || 'STACKING')
        }
      }

      await loadProcessingCodes()

      if (empData) {
        setEmployees(empData)
        const lastWorker = localStorage.getItem(STORAGE_KEY_LAST_WORKER)
        if (lastWorker && empData.some(e => e.employee_id === lastWorker)) {
          setLogWorker(lastWorker)
        } else if (empData.length > 0 && !logWorker) {
          setLogWorker(empData[0].employee_id)
        }
      }
    }
    loadMeta()
  }, [jobId, activeJobId, isNew, step, supabase])

  const handleItemTypeChange = (itId: string) => {
    setSelectedItemTypeId(itId)
    const it = itemTypes.find(i => String(i.item_type_id) === String(itId))
    if (it) {
      const code = it.item_type_code?.toUpperCase() || 'MOLD'
      const isOutsource = code.includes('CUTTER') || code.includes('FRAME') || it.item_type_name_ja.includes('抜型') || it.item_type_name_ja.includes('枠')
      setManufactureLocation(isOutsource ? 'OUTSOURCE' : 'IN_HOUSE')

      if (code.includes('PLUG')) setStepTrack('PLUG')
      else if (code.includes('CUTTER')) setStepTrack('CUTTER')
      else if (code.includes('STAKING') || code.includes('STACKING')) setStepTrack('STACKING')
      else if (code.includes('BASE') || code.includes('WATER') || code.includes('PRESS')) setStepTrack('BASE')
      else setStepTrack('MOLD')

      setStepName(it.item_type_name_ja + (it.item_type_name_ja.endsWith('製作') || it.item_type_name_ja.endsWith('加工') ? '' : '製作'))
    }
  }

  const handleWorkerChange = (val: string | null) => {
    const newWorkerId = val || ''
    setLogWorker(newWorkerId)
    if (newWorkerId) localStorage.setItem(STORAGE_KEY_LAST_WORKER, newWorkerId)
  }

  const fetchLogs = useCallback(async () => {
    const currentStepId = activeStep?.step_id || step?.step_id
    if (!currentStepId) {
      setLogs([])
      return
    }
    setLoadingLogs(true)
    const { data } = await supabase
      .from('work_logs')
      .select('log_id, work_date, hours_spent, description, notes, is_finished, employee_id, processing_code_id, employees:employee_id(employee_name, employee_name_short), processing_codes:processing_code_id(processing_code_id, processing_name)')
      .eq('job_step_id', currentStepId)
      .order('work_date', { ascending: false })

    if (data) setLogs(data)
    setLoadingLogs(false)
  }, [activeStep?.step_id, step?.step_id, supabase])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const fetchTodayLogs = useCallback(async () => {
    if (!logWorker || !logWorkDate) {
      setTodayWorkerLogs([])
      return
    }
    setLoadingTodayLogs(true)
    const { data, error } = await supabase
      .from('work_logs')
      .select(`
        log_id, work_date, hours_spent, description, notes, processing_code_id, job_id, job_step_id, employee_id,
        processing_codes(processing_code_id, processing_name),
        jobs(
          job_id,
          job_code,
          job_name,
          physical_molds:equipment_id(equipment_code),
          products:product_id(product_code, product_name_internal)
        )
      `)
      .eq('employee_id', logWorker)
      .eq('work_date', logWorkDate)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching today worker logs:', error)
    }
    if (data) setTodayWorkerLogs(data as any)
    setLoadingTodayLogs(false)
  }, [logWorker, logWorkDate, supabase])

  useEffect(() => {
    fetchTodayLogs()
  }, [fetchTodayLogs])

  const handleSaveStepConfig = async () => {
    if (!stepName.trim()) {
      alert('工程名を入力してください')
      return
    }
    setSavingStep(true)
    try {
      const payload: any = {
        step_name: stepName.trim(),
        item_type_id: parseInt(selectedItemTypeId),
        track: stepTrack,
        planned_hours: plannedHours ? parseFloat(plannedHours) : null,
        deadline: stepDeadline ? new Date(stepDeadline).toISOString() : null,
        target_completion_date: stepDeadline || null,
        manufacture_location: manufactureLocation,
        assigned_to: stepAssignedTo || null,
        notes: stepNotes.trim() || null,
        step_status: stepStatus || 'PENDING',
      }

      if (isNew) {
        const targetJobId = activeJobId || jobId || 'caeb4ec3-065a-4653-b69a-19e6dbc4287a'
        payload.job_id = targetJobId
        const { data: latestSteps } = await supabase
          .from('job_steps')
          .select('step_no')
          .eq('job_id', targetJobId)
          .order('step_no', { ascending: false })
          .limit(1)
        
        const finalStepNo = (latestSteps && latestSteps.length > 0 && latestSteps[0].step_no != null) ? latestSteps[0].step_no + 1 : 1
        payload.step_no = finalStepNo

        const { error } = await supabase.from('job_steps').insert([payload])
        if (error) throw error
        onSaved()
        onClose()
      } else {
        const targetStepId = activeStep?.step_id || step?.step_id
        const { error } = await supabase.from('job_steps').update(payload).eq('step_id', targetStepId)
        if (error) throw error
        if (activeStep) setActiveStep({ ...activeStep, ...payload })
        setJobStepsList(prev => prev.map(s => s.step_id === targetStepId ? { ...s, ...payload } : s))
        onSaved()
        setIsEditingStepConfig(false)
      }
    } catch (err: any) {
      alert('エラー: ' + err.message)
    } finally {
      setSavingStep(false)
    }
  }

  const handleSaveLog = async () => {
    if (!logWorker) { alert('作業者を選択してください'); return }
    // Hours are optional: default to 0 if blank or not entered
    const parsedHours = parseFloat(logHours)
    const hours = (!isNaN(parsedHours) && parsedHours >= 0) ? parsedHours : 0

    let desc = customDescription.trim()
    let codeId: number | null = null
    if (selectedCodeId) {
      codeId = parseInt(selectedCodeId)
      const matched = rawCodes.find(c => c.processing_code_id === codeId)
      if (matched) desc = matched.processing_name
    }

    setAddingLog(true)
    try {
      const targetJobId: string = activeJobId || jobId || 'caeb4ec3-065a-4653-b69a-19e6dbc4287a'
      const targetStepId: string | null = activeStep?.step_id || step?.step_id || null

      const payload = {
        job_id: targetJobId,
        job_step_id: targetStepId,
        work_date: logWorkDate,
        hours_spent: hours,
        employee_id: logWorker,
        processing_code_id: codeId,
        description: desc || null,
        notes: logNotes.trim() || null,
        is_finished: logIsFinished || true,
      }

      if (editingLogId) {
        const { error } = await supabase.from('work_logs').update(payload).eq('log_id', editingLogId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('work_logs').insert([payload])
        if (error) throw error
      }

      if (targetStepId) {
        const { data: allLogs } = await supabase
          .from('work_logs')
          .select('log_id, hours_spent, processing_code_id')
          .eq('job_step_id', targetStepId)
        
        if (allLogs) {
          const total = Math.round(allLogs.reduce((sum, l) => sum + (l.hours_spent || 0), 0) * 100) / 100
          
          // Check if all applicable codes for this step are now recorded (only for DESIGN checklist)
          let stepStatusToSet = activeStep?.step_status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'
          if (jobMeta?.job_category === 'DESIGN') {
            const allRecordedCodes = new Set(allLogs.map(l => l.processing_code_id).filter(Boolean))
            const hasRemainingCodes = applicableProcessingCodes.some(pc => !allRecordedCodes.has(parseInt(pc.value)))
            stepStatusToSet = (!hasRemainingCodes && applicableProcessingCodes.length > 0) || activeStep?.step_status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS'
          }

          await supabase.from('job_steps').update({
            actual_hours: total,
            step_status: stepStatusToSet
          }).eq('step_id', targetStepId)

          if (activeStep) setActiveStep({ ...activeStep, actual_hours: total, step_status: stepStatusToSet })
          setJobStepsList(prev => prev.map(s => s.step_id === targetStepId ? { ...s, actual_hours: total, step_status: stepStatusToSet } : s))

          // Auto-complete parent Job if all steps are completed
          const { data: allJobSteps } = await supabase
            .from('job_steps')
            .select('step_id, step_status')
            .eq('job_id', targetJobId)

          if (allJobSteps && allJobSteps.length > 0) {
            const allDone = allJobSteps.every(s => (s.step_id === targetStepId ? stepStatusToSet === 'COMPLETED' : s.step_status === 'COMPLETED'))
            if (allDone) {
              await supabase.from('jobs').update({ job_status: 'COMPLETED' }).eq('job_id', targetJobId)
            }
          }
        }
      }

      setEditingLogId(null)
      setSelectedCodeId('')
      setCustomDescription('')
      setLogNotes('')
      setLogHours('0')
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
    if (!window.confirm('削除しますか？')) return
    const { error } = await supabase.from('work_logs').delete().eq('log_id', logId)
    if (!error) {
      fetchLogs()
      fetchTodayLogs()
      onSaved()
    }
  }

  const handlePrintSheet = (isPdf = false) => {
    const printContent = document.getElementById('nippo-a4-sheet-container')
    if (!printContent) return

    const printWin = window.open('', '_blank', 'width=1050,height=800')
    if (!printWin) return

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>日報記録書_${selectedWorkerName}_${logWorkDate}</title>
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
  }

  const selectedWorker = employees.find(e => e.employee_id === logWorker)
  const selectedWorkerName = selectedWorker?.employee_name || '担当者'
  const selectedWorkerShort = selectedWorker?.employee_name_short || selectedWorkerName
  const totalTodayHours = Math.round(todayWorkerLogs.reduce((sum, l) => sum + (l.hours_spent || 0), 0) * 100) / 100

  const getModelCode = (l: any) => {
    if (!l.jobs) return '-'
    if (l.jobs.job_code === '社内作業') return '社内作業'
    if (l.jobs.physical_molds?.equipment_code) return l.jobs.physical_molds.equipment_code
    if (l.jobs.products?.product_code) return l.jobs.products.product_code
    return l.jobs.job_code || ''
  }

  const nippoItems: NippoItem[] = useMemo(() => {
    return todayWorkerLogs.map(l => ({
      log_id: l.log_id,
      work_date: l.work_date,
      job_id: l.job_id || undefined,
      processing_code_id: l.processing_code_id || undefined,
      model_code: getModelCode(l),
      processing_name: l.processing_codes?.processing_name || l.description || '',
      notes: l.notes || '',
      hours_spent: l.hours_spent,
      price_value: ''
    }))
  }, [todayWorkerLogs])

  const currentItemType = itemTypes.find(i => String(i.item_type_id) === (activeStep?.item_type_id ? String(activeStep.item_type_id) : selectedItemTypeId))
  const currentItemTypeName = currentItemType?.item_type_name_ja || activeStep?.track || '金型'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14 }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="card-flat" style={{ width: '100%', maxWidth: isNew ? '580px' : '1400px', background: 'var(--bg-surface)', borderRadius: 8, boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', maxHeight: '96vh', height: isNew ? 'auto' : '92vh', overflow: 'hidden' }}>
        <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--border-default)', background: 'var(--tint-teal-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: '#fff', border: '1px solid var(--tint-teal-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              {isNew ? <Plus size={16} /> : <Clock size={16} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{isNew ? '新規工程の追加' : '作業日報の記録・工程情報'}</span>
                {jobMeta && <span className="font-mono text-[11.5px] font-bold" style={{ background: 'var(--tint-blue-bg)', color: 'var(--tint-blue-text)', padding: '1px 8px', borderRadius: 4, border: '1px solid var(--tint-blue-border)' }}>[{jobMeta.job_code}] {jobMeta.job_name}</span>}
                {!isNew && activeStep && <span className="text-[11.5px] font-bold" style={{ background: 'var(--tint-purple-bg, #EDE9FE)', color: 'var(--tint-purple-text, #7C3AED)', padding: '1px 8px', borderRadius: 4, border: '1px solid var(--tint-purple-border, #DDD6FE)' }}>{activeStep.step_name} [{currentItemTypeName}]</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}><X size={18} /></button>
        </div>

        {isNew ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>項目分類 <span style={{ color: 'red' }}>*</span></label>
                <select className="form-input font-bold" style={{ fontSize: 12, height: 38 }} value={selectedItemTypeId} onChange={(e) => handleItemTypeChange(e.target.value)}>
                  {itemTypes.map((it) => <option key={it.item_type_id} value={it.item_type_id}>{it.item_type_name_ja} ({it.item_type_code})</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>工程名 <span style={{ color: 'red' }}>*</span></label>
                <input type="text" className="form-input font-bold" style={{ fontSize: 13, height: 38 }} value={stepName} onChange={(e) => setStepName(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>予定工数 (h)</label>
                <input type="number" step="0.5" className="form-input font-mono font-bold text-center" style={{ fontSize: 14, height: 38, color: 'var(--accent)' }} value={plannedHours} onChange={(e) => setPlannedHours(e.target.value)} />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: 11.5, fontWeight: 700 }}>完了期日</label>
                <input type="date" className="form-input font-mono font-bold" style={{ fontSize: 13, height: 38 }} value={stepDeadline} onChange={(e) => setStepDeadline(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
              <button className="btn btn-secondary" onClick={onClose}>キャンセル</button>
              <button className="btn btn-primary" onClick={handleSaveStepConfig} disabled={savingStep}>{savingStep ? '登録中...' : '工程を登録'}</button>
            </div>
          </div>
        ) : (
          /* ── 2-PANEL SPLIT BODY ── */
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: 'var(--bg-base, #F1F5F9)' }}>
            
            {/* ◀ LEFT PANEL: Job Selector + Step List + Step Info + History (470px width) ◀ */}
            <div style={{ width: '470px', flexShrink: 0, borderRight: '1px solid var(--border-default)', padding: '12px', display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', background: 'var(--bg-surface)' }}>
              {error && <div style={{ padding: '8px 12px', background: 'var(--tint-error-bg)', color: 'var(--tint-error-text)', fontSize: 12, borderRadius: 6 }}>{error}</div>}

              {/* 1. Job Selector & Step List */}
              <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, background: '#F8FAFC', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Briefcase size={13} style={{ color: 'var(--accent)' }} />
                    対象ジョブ (Chọn Job / Hạng mục):
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectJob('caeb4ec3-065a-4653-b69a-19e6dbc4287a')}
                    style={{ fontSize: 10, fontWeight: 800, color: '#1D4ED8', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}
                    title="社内作業を選択"
                  >
                    📌 社内作業
                  </button>
                </div>

                <SearchableSelect
                  options={allJobsOptions}
                  value={activeJobId}
                  onChange={(v) => handleSelectJob(v || '')}
                  placeholder="ジョブ・型番・製品名で検索..."
                  maxDropdownHeight="200px"
                />

                {jobStepsList.length > 0 ? (
                  <div style={{ marginTop: 2 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                      工程一覧 (Danh sách công đoạn - {jobStepsList.length} 件):
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {jobStepsList.map((st) => {
                        const isSelected = activeStep?.step_id === st.step_id
                        const stStatus = STEP_STATUS_OPTIONS.find(o => o.value === st.step_status)
                        return (
                          <button
                            key={st.step_id}
                            type="button"
                            onClick={() => handleSelectStep(st)}
                            style={{
                              padding: '3px 8px',
                              fontSize: 10.5,
                              fontWeight: isSelected ? 800 : 600,
                              borderRadius: 4,
                              border: isSelected ? '1.5px solid #7C3AED' : '1px solid var(--border-default)',
                              background: isSelected ? '#EDE9FE' : '#FFFFFF',
                              color: isSelected ? '#6D28D9' : 'var(--text-primary)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                          >
                            <span>{stStatus?.icon || '⚪'}</span>
                            <span>{st.step_name}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '6px 4px', fontSize: 10.5, color: 'var(--text-muted)' }}>
                    {activeJobId ? '— このジョブには工程が登録されていません —' : '— 上の検索バーまたは「📌 社内作業」からジョブを選択してください —'}
                  </div>
                )}
              </div>

              {/* 2. Step Details & Status Card */}
              <div style={{ border: '1.5px solid #DDD6FE', borderLeft: '5px solid #7C3AED', borderRadius: 8, background: '#F5F3FF', overflow: 'hidden' }}>
                <div style={{ padding: '7px 10px', background: '#EDE9FE', borderBottom: '1px solid #DDD6FE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Layers size={14} style={{ color: '#7C3AED' }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#6D28D9' }}>対象工程情報 (Thông tin công đoạn)</span>
                  </div>
                  {activeStep && (
                    <button
                      type="button"
                      onClick={() => setIsEditingStepConfig(!isEditingStepConfig)}
                      style={{ fontSize: 10, fontWeight: 700, color: '#6D28D9', background: '#fff', border: '1px solid #DDD6FE', borderRadius: 4, padding: '2px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Edit3 size={11} />
                      <span>{isEditingStepConfig ? '表示に戻る' : '工程設定を変更'}</span>
                    </button>
                  )}
                </div>

                {!activeStep ? (
                  <div style={{ padding: '14px 10px', textAlign: 'center', color: '#64748B', fontSize: 11 }}>
                    — ジョブ・工程を選択すると詳細が表示されます —
                  </div>
                ) : isEditingStepConfig ? (
                  <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, background: '#FAFAFA' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px', gap: 8 }}>
                      <div>
                        <label className="form-label" style={{ fontSize: 10, fontWeight: 700 }}>工程名</label>
                        <input type="text" className="form-input font-bold" style={{ fontSize: 11.5, height: 30 }} value={stepName} onChange={(e) => setStepName(e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: 10, fontWeight: 700 }}>分類</label>
                        <select className="form-input font-bold" style={{ fontSize: 10.5, height: 30 }} value={selectedItemTypeId} onChange={(e) => handleItemTypeChange(e.target.value)}>
                          {itemTypes.map((it) => <option key={it.item_type_id} value={it.item_type_id}>{it.item_type_name_ja}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 8 }}>
                      <div>
                        <label className="form-label" style={{ fontSize: 10, fontWeight: 700 }}>予定工数(h)</label>
                        <input type="number" step="0.5" className="form-input font-mono font-bold text-center" style={{ fontSize: 12, height: 30 }} value={plannedHours} onChange={(e) => setPlannedHours(e.target.value)} />
                      </div>
                      <div>
                        <label className="form-label" style={{ fontSize: 10, fontWeight: 700 }}>完了期日</label>
                        <input type="date" className="form-input font-mono" style={{ fontSize: 11.5, height: 30 }} value={stepDeadline} onChange={(e) => setStepDeadline(e.target.value)} />
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleSaveStepConfig} disabled={savingStep} style={{ fontSize: 11, padding: '4px 10px', justifyContent: 'center' }}>
                      {savingStep ? '保存中...' : '工程設定を保存'}
                    </button>
                  </div>
                ) : (
                  <div style={{ padding: '8px 10px', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 6, background: '#F5F3FF' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#1E1B4B' }}>
                        {activeStep?.step_name || '作業'}
                      </span>
                      <span className="font-mono font-bold" style={{ fontSize: 10, background: '#EDE9FE', color: '#6D28D9', padding: '1px 6px', borderRadius: 4, border: '1px solid #DDD6FE' }}>
                        {currentItemTypeName}
                      </span>
                    </div>

                    {/* Interactive 1-click status pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                      {STEP_STATUS_OPTIONS.map((opt) => {
                        const isActive = (stepStatus || activeStep?.step_status || 'PENDING') === opt.value
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleUpdateStepStatus(opt.value)}
                            style={{
                              padding: '2px 6px',
                              fontSize: 10,
                              fontWeight: isActive ? 800 : 500,
                              borderRadius: 4,
                              border: isActive ? `1.5px solid ${opt.activeBorder}` : '1px solid #CBD5E1',
                              background: isActive ? opt.activeBg : '#FFFFFF',
                              color: isActive ? opt.activeText : '#64748B',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <span>{opt.icon}</span>
                            <span>{opt.label}</span>
                          </button>
                        )
                      })}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 8px', color: '#475569', fontSize: 10.5, paddingTop: 4, borderTop: '1px dashed #DDD6FE' }}>
                      <div>予定工数: <strong className="font-mono" style={{ color: '#0F172A' }}>{plannedHours ? `${plannedHours}h` : activeStep?.planned_hours ? `${activeStep.planned_hours}h` : '—'}</strong></div>
                      <div>累計実績: <strong className="font-mono" style={{ color: '#16A34A', fontWeight: 800 }}>{Math.round(logs.reduce((sum, l) => sum + (Number(l.hours_spent) || 0), 0) * 10) / 10}h</strong></div>
                      <div>完了期日: <strong className="font-mono" style={{ color: (stepDeadline || activeStep?.deadline) ? '#DC2626' : '#0F172A' }}>{(stepDeadline || activeStep?.deadline) ? (stepDeadline || activeStep?.deadline?.split('T')[0]) : '—'}</strong></div>
                      <div>加工区分: <strong style={{ color: (activeStep as any)?.manufacture_location === 'OUTSOURCE' || manufactureLocation === 'OUTSOURCE' ? '#D97706' : 'var(--accent)' }}>{(activeStep as any)?.manufacture_location === 'OUTSOURCE' || manufactureLocation === 'OUTSOURCE' ? '外注' : '社内'}</strong></div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Step Work History Table */}
              <div style={{ border: '1px solid var(--border-default)', borderRadius: 6, background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1, minHeight: '160px' }}>
                <div style={{ padding: '6px 10px', background: '#F8FAFC', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FileText size={13} style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>この工程の作業履歴 ({logs.length} 件)</span>
                  </div>
                  {loadingLogs && <Loader2 size={12} className="animate-spin text-slate-400" />}
                </div>

                <div style={{ padding: 4, overflowY: 'auto', flex: 1 }}>
                  {logs.length === 0 ? (
                    <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11 }}>— まだ日報が登録されていません —</div>
                  ) : (
                    <table className="data-table" style={{ fontSize: 10, width: '100%', tableLayout: 'fixed' }}>
                      <thead>
                        <tr>
                          <th style={{ width: 75, padding: '3px 4px', whiteSpace: 'nowrap' }}>作業日</th>
                          <th style={{ width: 85, padding: '3px 4px', whiteSpace: 'nowrap' }}>作業者</th>
                          <th style={{ width: 42, padding: '3px 4px', whiteSpace: 'nowrap', textAlign: 'right' }}>工数</th>
                          <th style={{ padding: '3px 4px', whiteSpace: 'nowrap' }}>内容</th>
                          <th style={{ width: 38, padding: '3px 2px', textAlign: 'center' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((l) => (
                          <tr key={l.log_id}>
                            <td className="font-mono" style={{ fontSize: 9.5, padding: '3px 4px', whiteSpace: 'nowrap' }}>{l.work_date}</td>
                            <td style={{ fontSize: 10, padding: '3px 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={l.employees?.employee_name || ''}>{l.employees?.employee_name_short || l.employees?.employee_name || '—'}</td>
                            <td className="font-mono text-right font-bold" style={{ color: 'var(--accent)', fontSize: 10.5, padding: '3px 4px', whiteSpace: 'nowrap' }}>{l.hours_spent || 0}h</td>
                            <td style={{ fontSize: 9.5, padding: '3px 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.processing_codes?.processing_name || l.description || l.notes || ''}>{l.processing_codes?.processing_name || l.description || l.notes || '—'}</td>
                            <td className="text-center" style={{ padding: '3px 2px', whiteSpace: 'nowrap' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLogId(l.log_id)
                                  setLogWorkDate(l.work_date || logWorkDate)
                                  setLogWorker(l.employee_id || logWorker)
                                  setLogHours(l.hours_spent ? String(l.hours_spent) : '1.0')
                                  setSelectedCodeId(l.processing_code_id ? String(l.processing_code_id) : '')
                                  setCustomDescription(l.description || '')
                                  setLogNotes(l.notes || '')
                                }}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 1 }}
                                title="編集"
                              >
                                <Edit3 size={11} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLog(l.log_id)}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--status-error)', padding: 1, marginLeft: 2 }}
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
              </div>
            </div>

            {/* ▶ RIGHT PANEL: Top (Worklog Entry Form) + Bottom (Live A4 Preview) ▶ */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F8FAFC' }}>
              
              {/* ── TOP HALF: WORKLOG ENTRY FORM (Streamlined Workflow 1->2->3->4->5) ── */}
              <div style={{ background: '#FFFFFF', padding: '10px 16px', borderBottom: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ClipboardList size={14} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--text-primary)' }}>
                      {editingLogId ? '✏️ 日報の編集 (Chỉnh sửa nhật ký)' : '📝 日報の登録 (Ghi nhật ký thao tác)'}
                    </span>
                  </div>
                  {editingLogId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLogId(null)
                        setLogWorkDate(new Date().toISOString().split('T')[0])
                        setSelectedCodeId('')
                        setCustomDescription('')
                        setLogNotes('')
                        setLogHours('0')
                      }}
                      style={{ fontSize: 10.5, color: '#64748B', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}
                    >
                      ✕ 新規作成に戻る (Hủy sửa)
                    </button>
                  )}
                </div>

                {/* Row 1: 1. 作業日 (Ngày) & 2. 作業者 (Nhân viên) */}
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 12, alignItems: 'center' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 10.5, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={11} style={{ color: 'var(--accent)' }} />
                      1. 作業日 (Ngày) <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="date"
                      className="form-input font-mono font-bold"
                      style={{ fontSize: 11.5, height: 30 }}
                      value={logWorkDate}
                      onChange={(e) => setLogWorkDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: 10.5, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <User size={11} style={{ color: 'var(--accent)' }} />
                      2. 作業者 (Nhân viên) <span style={{ color: 'red' }}>*</span>
                    </label>
                    <select
                      className="form-input font-bold"
                      style={{ fontSize: 11.5, height: 30 }}
                      value={logWorker}
                      onChange={(e) => handleWorkerChange(e.target.value)}
                    >
                      <option value="">— 作業者を選択 —</option>
                      {employees.map((e) => (
                        <option key={e.employee_id} value={e.employee_id}>
                          [{e.employee_code || '—'}] {e.employee_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: 3. 加工コード・作業内容 (Nội dung thao tác) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <label className="form-label" style={{ fontSize: 10.5, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ClipboardList size={11} style={{ color: 'var(--accent)' }} />
                      3. 加工コード・作業内容 (Mã thao tác) <span style={{ color: 'red' }}>*</span>
                    </label>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {jobMeta?.job_category === 'DESIGN' && applicableProcessingCodes.length > 0 && (
                        <span style={{
                          fontSize: 9.5,
                          padding: '1px 6px',
                          borderRadius: 3,
                          background: dropdownProcessingCodes.length === 0 ? 'var(--tint-teal-bg)' : '#FEF3C7',
                          color: dropdownProcessingCodes.length === 0 ? 'var(--accent)' : '#B45309',
                          border: `1px solid ${dropdownProcessingCodes.length === 0 ? 'var(--tint-teal-border)' : '#FDE68A'}`,
                          fontWeight: 700
                        }}>
                          {dropdownProcessingCodes.length === 0 ? '🎉 全工程記録完了' : `未記録: ${dropdownProcessingCodes.length}/${applicableProcessingCodes.length}件`}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowCodeManagerModal(true)}
                        style={{
                          fontSize: 10,
                          padding: '1px 6px',
                          background: 'var(--bg-surface-2)',
                          border: '1px solid var(--border-default)',
                          borderRadius: 3,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 3,
                          color: 'var(--text-secondary)',
                          fontWeight: 600,
                        }}
                        title="Quản lý / Thêm mới mã công việc"
                      >
                        <Settings size={10} /> <span>コード管理</span>
                      </button>
                    </div>
                  </div>

                  {/* Department filter row */}
                  <div style={{ display: 'flex', gap: 3, marginBottom: 3, flexWrap: 'wrap' }}>
                    {[
                      { value: 'ALL', label: 'すべて' },
                      { value: 'DESIGN', label: '設計' },
                      { value: 'MOLD_SHOP', label: '金型' },
                      { value: 'PRODUCTION', label: '生産' },
                      { value: 'OFFICE', label: '事務' },
                      { value: 'GENERAL', label: '共通' },
                    ].map(dept => (
                      <button
                        key={dept.value}
                        type="button"
                        onClick={() => setDepartmentFilter(dept.value)}
                        style={{
                          padding: '1px 6px',
                          fontSize: 9.5,
                          fontWeight: departmentFilter === dept.value ? 700 : 500,
                          borderRadius: 3,
                          border: '1px solid var(--border-default)',
                          background: departmentFilter === dept.value ? 'var(--accent)' : 'var(--bg-surface)',
                          color: departmentFilter === dept.value ? '#fff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        {dept.label}
                      </button>
                    ))}
                  </div>

                  <SearchableSelect
                    options={dropdownProcessingCodes}
                    value={selectedCodeId}
                    onChange={(v) => {
                      setSelectedCodeId(v || '')
                      if (v) {
                        const matched = rawCodes.find(c => c.processing_code_id === parseInt(v))
                        if (matched) setCustomDescription(matched.processing_name)
                      }
                    }}
                    placeholder={dropdownProcessingCodes.length === 0 ? "すべての加工コードが登録済みです" : "コードまたは作業名で検索..."}
                    maxDropdownHeight="320px"
                  />
                </div>

                {/* Row 3: 4. 備考・申し送り (Ghi chú) */}
                <div>
                  <label className="form-label" style={{ fontSize: 10.5, fontWeight: 700, margin: 0 }}>
                    4. 備考・申し送り (Ghi chú / Số shot)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: 11, height: 30 }}
                    placeholder="治具、特記事項、ショット数など..."
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                  />
                </div>

                {/* Row 4: 5. 実績工数 (h) & [ 日報を登録 ] */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 10, alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <label className="form-label" style={{ fontSize: 10.5, fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} style={{ color: 'var(--accent)' }} />
                        5. 実績工数 (h) (Giờ công - Không bắt buộc)
                      </label>
                      <span style={{ fontSize: 9.5, color: 'var(--text-muted)' }}>クイック選択:</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        max="24"
                        placeholder="0"
                        className="form-input font-mono text-center font-bold"
                        style={{ fontSize: 12.5, height: 28, width: 55, color: 'var(--accent)' }}
                        value={logHours}
                        onChange={(e) => setLogHours(e.target.value)}
                      />
                      {[0, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 6.0, 8.0].map((h) => {
                        const isSelected = parseFloat(logHours) === h
                        return (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setLogHours(String(h))}
                            style={{
                              padding: '1px 5px',
                              fontSize: 9.5,
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

                  <div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveLog}
                      disabled={addingLog}
                      style={{ fontSize: 11.5, padding: '5px 12px', width: '100%', height: 30, justifyContent: 'center', gap: 4, fontWeight: 700 }}
                    >
                      {addingLog ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                      <span>{addingLog ? '登録中...' : editingLogId ? '日報を更新' : '日報を登録'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ── BOTTOM HALF: LIVE A4 PREVIEW (Auto-fit + Zoom Modal) ── */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 12px', gap: 6, minHeight: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border-default)', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Eye size={13} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--text-primary)' }}>
                      日報記録書プレビュー（{selectedWorkerShort} ・ {logWorkDate}）
                    </span>
                    <span className="font-mono font-bold" style={{ fontSize: 10.5, background: 'var(--tint-teal-bg)', color: 'var(--accent)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--tint-teal-border)' }}>
                      本日合計: {totalTodayHours} H
                    </span>
                  </div>

                  {/* Print Controls + Zoom Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={showStamp}
                        onChange={(e) => setShowStamp(e.target.checked)}
                        style={{ width: 13, height: 13, accentColor: 'var(--accent)' }}
                      />
                      <span>印鑑表示</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5, color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={showHours}
                        onChange={(e) => setShowHours(e.target.checked)}
                        style={{ width: 13, height: 13, accentColor: 'var(--accent)' }}
                      />
                      <span>工数印字</span>
                    </label>

                    <button
                      type="button"
                      className="btn btn-secondary flex items-center gap-1 shadow-2xs"
                      style={{ fontSize: 10.5, padding: '2px 8px', height: 26 }}
                      onClick={() => setShowZoomModal(true)}
                      title="100%全画面プレビュー"
                    >
                      <Eye size={11} />
                      <span>拡大</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary flex items-center gap-1 shadow-2xs"
                      style={{ fontSize: 10.5, padding: '2px 10px', height: 26 }}
                      onClick={() => handlePrintSheet(false)}
                      title="A4横用紙に印刷"
                    >
                      <Printer size={11} />
                      <span>印刷</span>
                    </button>
                  </div>
                </div>

                {/* Standard A4 Preview Sheet Container (Exact standard format, full crispness) */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'auto',
                    padding: '8px',
                    background: 'var(--bg-base, #F1F5F9)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                  }}
                >
                  <div
                    id="nippo-a4-sheet-container"
                    style={{
                      background: '#fff',
                      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                      borderRadius: 4,
                      display: 'inline-block',
                    }}
                  >
                    <DailyWorklogA4Sheet
                      workDate={logWorkDate}
                      workerName={selectedWorkerName}
                      totalHours={totalTodayHours}
                      items={nippoItems}
                      scale={0.78}
                      showStamp={showStamp}
                      showHours={showHours}
                      hidePriceTableInPreview={false}
                      stampUrl={getEmployeeStampUrl(selectedWorker)}
                      onEditItem={(item) => {
                        const targetLog = todayWorkerLogs.find(l => l.log_id === item.log_id)
                        if (targetLog) {
                          setEditingLogId(targetLog.log_id)
                          setLogWorkDate(targetLog.work_date || logWorkDate)
                          setLogHours(targetLog.hours_spent ? String(targetLog.hours_spent) : '0')
                          setSelectedCodeId(targetLog.processing_code_id ? String(targetLog.processing_code_id) : '')
                          setCustomDescription(targetLog.description || '')
                          setLogNotes(targetLog.notes || '')
                        }
                      }}
                      onDeleteItem={(logId) => handleDeleteLog(logId)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Fullscreen Zoom Preview Modal ── */}
        {showZoomModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: 'rgba(0, 0, 0, 0.75)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16
            }}
            onClick={() => setShowZoomModal(false)}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                maxHeight: '92vh',
                overflow: 'auto',
                padding: 16,
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>🔍 拡大印刷プレビュー (100% 原寸)</span>
                <button
                  type="button"
                  onClick={() => setShowZoomModal(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: 11, padding: '2px 8px' }}
                >
                  ✕ 閉じる
                </button>
              </div>
              <DailyWorklogA4Sheet
                workDate={logWorkDate}
                workerName={selectedWorkerName}
                totalHours={totalTodayHours}
                items={nippoItems}
                scale={1.0}
                showStamp={showStamp}
                showHours={showHours}
                hidePriceTableInPreview={true}
                stampUrl={getEmployeeStampUrl(selectedWorker)}
              />
            </div>
          </div>
        )}

        {/* ── Modal Footer ── */}
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-surface)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button className="btn btn-secondary" onClick={onClose} style={{ fontSize: 11.5, padding: '4px 16px' }}>
            閉じる (Đóng)
          </button>
        </div>
      </div>

      {/* Processing Codes Manager Modal (Q7) */}
      <ProcessingCodesManagerModal
        isOpen={showCodeManagerModal}
        onClose={() => setShowCodeManagerModal(false)}
        onUpdated={loadProcessingCodes}
      />
    </div>
  )
}
