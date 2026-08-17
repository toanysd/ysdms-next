'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createQuickMoldJobWorkflow, QuickMoldJobInput, ProcessStepInput } from '@/app/actions/quick-mold-job'
import {
  X, CheckCircle2, AlertTriangle, Layers, Calendar, User, FileText,
  PlusCircle, Tag, Settings, Trash2, Save, Edit2, Clock, Plus, RefreshCw, ChevronRight, Info, Filter
} from 'lucide-react'

export type QuickWizardMode = 'CREATE_DESIGN' | 'CREATE_MOLD' | 'CREATE_JOB' | 'UPDATE_EQUIPMENT'

interface DesignRevisionData {
  revision_id: string
  design_code: string | null
  revision_number: number | null
  status: string | null
  plastic_type_designed: string | null
  design_length: number | null
  design_width: number | null
  design_height: number | null
  design_depth: number | null
  cutline_length: number | null
  cutline_width: number | null
  cavity_count: number | null
  plug_type: string | null
}

interface EquipmentData {
  id: string
  code: string
  name: string
  type: string
  status: string
  rack?: string
  n_jobs?: number
}

interface WorkLogItem {
  log_id: string
  work_date: string
  employee_id: string
  employee_name?: string
  job_step_id?: string | null
  step_name?: string | null
  processing_code_id?: number | null
  processing_name?: string | null
  hours_spent: number
  description?: string
  notes?: string
}

interface CenteredQuickJobWizardModalProps {
  isOpen: boolean
  mode: QuickWizardMode
  subMode?: string
  productId: string
  selectedRev: DesignRevisionData | null
  targetEquipment: EquipmentData | null
  onClose: () => void
  onSuccess: () => void
}

const TYPE_BADGE_MAP: Record<string, string> = {
  MOLD: '成形金型',
  PLUG: '木型プラグ',
  CUTTER: '抜型刃物',
  CUTTER_SEPARATE: '抜型刃物',
  WATER_BASE: '水冷盤',
  AIR_BASE: '圧空盤',
  FRAME: 'フレーム',
  STACKING: 'スタッキング'
}

interface ExtendedStepInput extends ProcessStepInput {
  step_id?: string
}

export function CenteredQuickJobWizardModal({
  isOpen,
  productId,
  selectedRev,
  targetEquipment,
  onClose,
  onSuccess,
}: CenteredQuickJobWizardModalProps) {
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  // Master Data
  const [employees, setEmployees] = useState<{ employee_id: string; employee_name: string }[]>([])
  const [processingCodes, setProcessingCodes] = useState<{ processing_code_id: number; processing_name: string }[]>([])
  
  // Context Data
  const [productInfo, setProductInfo] = useState({ code: '', name: '' })
  
  // Equipment Data
  const [equipmentsForRev, setEquipmentsForRev] = useState<EquipmentData[]>([])
  const [selectedEquipId, setSelectedEquipId] = useState<string>('')
  const [equipMode, setEquipMode] = useState<'EXISTING' | 'NEW'>('EXISTING')
  
  // New Equipment state (if equipMode === 'NEW')
  const [newEquipType, setNewEquipType] = useState('MOLD')
  const [newEquipCode, setNewEquipCode] = useState('')
  const [newEquipName, setNewEquipName] = useState('')

  // Jobs for selected equipment
  const [equipmentJobs, setEquipmentJobs] = useState<any[]>([])
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null) // null = creating new job

  // Job Detail / Form State
  const [woType, setWoType] = useState('NEW')
  const [jobName, setJobName] = useState('')
  const [responsibleId, setResponsibleId] = useState('')
  const [manufactureLocation, setManufactureLocation] = useState('IN_HOUSE')
  const [startDate, setStartDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')
  const [steps, setSteps] = useState<ExtendedStepInput[]>([])
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null) // null = all steps

  // Work Logs State & DEDICATED SUB-MODAL POPUP State
  const [worklogs, setWorklogs] = useState<WorkLogItem[]>([])
  const [isWorklogModalOpen, setIsWorklogModalOpen] = useState(false)
  const [editingLogId, setEditingLogId] = useState<string | null>(null)
  const [newLogDate, setNewLogDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [newLogWorkerId, setNewLogWorkerId] = useState<string>('')
  const [newLogStepId, setNewLogStepId] = useState<string | null>(null)
  const [newLogProcCodeId, setNewLogProcCodeId] = useState<number | null>(null)
  const [newLogHours, setNewLogHours] = useState<string>('')
  const [newLogDesc, setNewLogDesc] = useState<string>('')
  const [addingLog, setAddingLog] = useState(false)

  // Load jobs for an equipment
  const loadEquipmentJobs = useCallback(async (equipId: string) => {
    if (!equipId) {
      setEquipmentJobs([])
      return
    }
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('equipment_id', equipId)
      .order('created_at', { ascending: false })
    
    if (data) {
      setEquipmentJobs(data)
      if (data.length > 0) {
        loadJobDetails(data[0])
      } else {
        handlePrepareNewJob()
      }
    } else {
      setEquipmentJobs([])
      handlePrepareNewJob()
    }
  }, [supabase])

  // Load steps and worklogs for a selected job
  const loadJobDetails = useCallback(async (job: any) => {
    setSelectedJobId(job.job_id)
    setEditingLogId(null)
    setIsWorklogModalOpen(false)
    setSelectedStepId(null)
    setNewLogStepId(null)
    setNewLogProcCodeId(null)
    setWoType(job.wo_type || 'NEW')
    setJobName(job.job_name || '')
    setResponsibleId(job.responsible_id || '')
    setManufactureLocation(job.manufacture_location || 'IN_HOUSE')
    setStartDate(job.start_date ? job.start_date.split('T')[0] : '')
    setDeadline(job.deadline ? job.deadline.split('T')[0] : '')
    setNotes(job.notes || '')

    // Fetch Steps
    const { data: jobSteps } = await supabase
      .from('job_steps')
      .select('*')
      .eq('job_id', job.job_id)
      .order('step_no', { ascending: true })

    if (jobSteps && jobSteps.length > 0) {
      setSteps(jobSteps.map(s => ({
        step_id: s.step_id,
        step_no: s.step_no,
        step_name: s.step_name || '',
        estimated_hours: s.estimated_hours,
        assigned_to: s.assigned_to,
        notes: s.notes
      })))
    } else {
      setSteps([])
    }

    // Fetch Work Logs joined with job_steps and processing_codes
    const { data: logs } = await supabase
      .from('work_logs')
      .select('log_id, work_date, employee_id, job_step_id, processing_code_id, hours_spent, description, notes, employees(employee_name), job_steps(step_name, step_no), processing_codes(processing_name)')
      .eq('job_id', job.job_id)
      .order('work_date', { ascending: false })

    if (logs) {
      setWorklogs(logs.map(l => ({
        log_id: l.log_id,
        work_date: l.work_date,
        employee_id: l.employee_id,
        employee_name: (l.employees as any)?.employee_name || '担当者',
        job_step_id: l.job_step_id || null,
        step_name: (l.job_steps as any)?.step_name || null,
        processing_code_id: l.processing_code_id || null,
        processing_name: (l.processing_codes as any)?.processing_name || null,
        hours_spent: Number(l.hours_spent || 0),
        description: l.description || l.notes || ''
      })))
    } else {
      setWorklogs([])
    }
  }, [supabase])

  const handlePrepareNewJob = () => {
    setSelectedJobId(null)
    setEditingLogId(null)
    setIsWorklogModalOpen(false)
    setSelectedStepId(null)
    setNewLogStepId(null)
    setNewLogProcCodeId(null)
    setWoType('NEW')
    setJobName('')
    setResponsibleId('')
    setManufactureLocation('IN_HOUSE')
    setStartDate('')
    setDeadline('')
    setNotes('')
    setSteps([])
    setWorklogs([])
  }

  useEffect(() => {
    if (!isOpen) return
    setError(null)

    async function initData() {
      const { data: emps } = await supabase.from('employees').select('employee_id, employee_name').order('employee_name')
      if (emps) {
        setEmployees(emps)
        if (emps.length > 0) setNewLogWorkerId(emps[0].employee_id)
      }

      const { data: procCodes } = await supabase
        .from('processing_codes')
        .select('processing_code_id, processing_name')
        .eq('is_active', true)
        .order('processing_name')
      if (procCodes) {
        setProcessingCodes(procCodes)
      }

      if (productId) {
        const { data: prod } = await supabase.from('products').select('product_code, product_name').eq('product_id', productId).maybeSingle()
        if (prod) {
          setProductInfo({ code: prod.product_code || '', name: prod.product_name || '' })
        }
      }

      // Build equipment list: combine design_revision_id query + targetEquipment
      const list: EquipmentData[] = []
      const seenIds = new Set<string>()

      if (selectedRev?.revision_id) {
        const { data: equips } = await supabase
          .from('equipment')
          .select('equipment_id, equipment_code, display_name, equipment_type, usage_status')
          .eq('design_revision_id', selectedRev.revision_id)
        
        if (equips && equips.length > 0) {
          equips.forEach(e => {
            seenIds.add(e.equipment_id)
            list.push({
              id: e.equipment_id,
              code: e.equipment_code || '',
              name: e.display_name || '',
              type: e.equipment_type || '',
              status: e.usage_status || '',
              rack: ''
            })
          })
        }
      }

      // Ensure targetEquipment is always in the list (may come from shared cutter, CAV match, etc.)
      if (targetEquipment?.id && !seenIds.has(targetEquipment.id)) {
        // Fetch fresh data from DB to get accurate info
        const { data: targetEq } = await supabase
          .from('equipment')
          .select('equipment_id, equipment_code, display_name, equipment_type, usage_status')
          .eq('equipment_id', targetEquipment.id)
          .maybeSingle()

        if (targetEq) {
          seenIds.add(targetEq.equipment_id)
          list.push({
            id: targetEq.equipment_id,
            code: targetEq.equipment_code || targetEquipment.code,
            name: targetEq.display_name || targetEquipment.name,
            type: targetEq.equipment_type || targetEquipment.type,
            status: targetEq.usage_status || targetEquipment.status,
            rack: ''
          })
        } else {
          // DB fetch failed, use the passed-in data
          list.push({
            id: targetEquipment.id,
            code: targetEquipment.code,
            name: targetEquipment.name,
            type: targetEquipment.type,
            status: targetEquipment.status,
            rack: ''
          })
        }
      }

      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const { count } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('equipment_id', list[i].id)
          list[i].n_jobs = count || 0
        }

        setEquipmentsForRev(list)
        setEquipMode('EXISTING')
        const initialId = targetEquipment?.id || list[0].id
        setSelectedEquipId(initialId)
        loadEquipmentJobs(initialId)
      } else {
        setEquipMode('NEW')
      }
    }
    initData()
  }, [isOpen, productId, selectedRev, targetEquipment, supabase, loadEquipmentJobs])

  const handleSelectEquipment = (equipId: string) => {
    setEquipMode('EXISTING')
    setSelectedEquipId(equipId)
    loadEquipmentJobs(equipId)
  }

  const handleToggleStepFilter = (stepKey?: string) => {
    if (!stepKey) {
      setSelectedStepId(null)
      setNewLogStepId(null)
      return
    }
    setSelectedStepId(stepKey)
    const matchingStep = steps.find((s, i) => (s.step_id || `step-no-${s.step_no || i + 1}`) === stepKey || s.step_id === stepKey)
    const stepVal = matchingStep?.step_id || stepKey
    setNewLogStepId(stepVal)
  }

  // Work Log Actions & Sub-Modal Popup Handlers
  const handleOpenCreateWorklogModal = () => {
    if (!selectedJobId) {
      alert('先にJobを保存してから作業日報を追加してください。')
      return
    }
    setEditingLogId(null)
    setNewLogDate(new Date().toISOString().split('T')[0])
    setNewLogWorkerId(employees[0]?.employee_id || '')
    setNewLogStepId(selectedStepId || (steps.length > 0 ? (steps[0].step_id || `step-no-1`) : null))
    setNewLogProcCodeId(null)
    setNewLogHours('')
    setNewLogDesc('')
    setIsWorklogModalOpen(true)
  }

  const handleStartEditWorklog = (log: WorkLogItem) => {
    setEditingLogId(log.log_id)
    setNewLogDate(log.work_date)
    setNewLogWorkerId(log.employee_id)
    setNewLogStepId(log.job_step_id || null)
    setNewLogProcCodeId(log.processing_code_id || null)
    setNewLogHours(String(log.hours_spent))
    setNewLogDesc(log.description || '')
    setIsWorklogModalOpen(true)
  }

  const handleCancelWorklogModal = () => {
    setIsWorklogModalOpen(false)
    setEditingLogId(null)
    setNewLogProcCodeId(null)
    setNewLogHours('')
    setNewLogDesc('')
  }

  const handleSaveWorklog = async () => {
    if (!selectedJobId) {
      alert('先にJobを保存してから作業日報を追加してください。')
      return
    }
    if (!newLogHours || Number(newLogHours) <= 0) {
      alert('工数(時間)を正しく入力してください。')
      return
    }

    setAddingLog(true)
    try {
      const activeStepKey = newLogStepId || selectedStepId
      const matchingStep = steps.find((s, i) => s.step_id === activeStepKey || (s.step_id || `step-no-${s.step_no || i + 1}`) === activeStepKey)
      const resolvedStepId = matchingStep?.step_id || null

      if (editingLogId) {
        // Update existing worklog
        const { error: updateErr } = await supabase
          .from('work_logs')
          .update({
            employee_id: newLogWorkerId || responsibleId || employees[0]?.employee_id,
            job_step_id: resolvedStepId,
            processing_code_id: newLogProcCodeId,
            work_date: newLogDate,
            hours_spent: Number(newLogHours),
            description: newLogDesc || '作業日報'
          })
          .eq('log_id', editingLogId)

        if (updateErr) throw updateErr

        showToast('作業日報を更新しました', 'success')
      } else {
        // Insert new worklog
        const { error: insertErr } = await supabase.from('work_logs').insert({
          job_id: selectedJobId,
          job_step_id: resolvedStepId,
          processing_code_id: newLogProcCodeId,
          employee_id: newLogWorkerId || responsibleId || employees[0]?.employee_id,
          work_date: newLogDate,
          hours_spent: Number(newLogHours),
          description: newLogDesc || '作業日報'
        })

        if (insertErr) throw insertErr

        showToast('作業日報を登録しました', 'success')
      }

      setIsWorklogModalOpen(false)
      setEditingLogId(null)
      setNewLogHours('')
      setNewLogDesc('')
      
      const currentJob = equipmentJobs.find(j => j.job_id === selectedJobId)
      if (currentJob) await loadJobDetails(currentJob)
    } catch (err: any) {
      showToast('日報登録エラー: ' + err.message, 'error')
    } finally {
      setAddingLog(false)
    }
  }

  const handleDeleteWorklog = async (logId: string) => {
    if (!confirm('この作業日報を削除してもよろしいですか？')) return

    try {
      const { error: delErr } = await supabase.from('work_logs').delete().eq('log_id', logId)
      if (delErr) throw delErr

      showToast('作業日報を削除しました', 'info')
      const currentJob = equipmentJobs.find(j => j.job_id === selectedJobId)
      if (currentJob) await loadJobDetails(currentJob)
    } catch (err: any) {
      showToast('日報削除エラー: ' + err.message, 'error')
    }
  }

  // Steps Actions
  const handleAddStep = () => {
    setSteps(prev => [...prev, {
      step_no: prev.length + 1,
      step_name: '',
      estimated_hours: null,
      assigned_to: null,
      notes: null
    }])
  }

  const handleUpdateStep = (idx: number, field: keyof ProcessStepInput, value: any) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  const handleRemoveStep = (idx: number) => {
    setSteps(prev => {
      const updated = prev.filter((_, i) => i !== idx)
      return updated.map((s, i) => ({ ...s, step_no: i + 1 }))
    })
  }

  // Main Submit Action
  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const selectedEquip = equipmentsForRev.find(e => e.id === selectedEquipId)

      if (selectedJobId) {
        // Update Existing Job
        const jobUpdateData: Record<string, any> = {
          job_name: jobName,
          responsible_id: responsibleId || null,
          start_date: startDate || null,
          deadline: deadline || null,
          notes: notes || null
        }
        const { error: jobErr } = await supabase.from('jobs').update(jobUpdateData as any).eq('job_id', selectedJobId)
        if (jobErr) throw jobErr

        // Delete old steps and re-insert
        await supabase.from('job_steps').delete().eq('job_id', selectedJobId)
        if (steps.length > 0) {
          const newSteps = steps.map(s => ({
            job_id: selectedJobId,
            step_no: s.step_no,
            step_name: s.step_name,
            estimated_hours: s.estimated_hours,
            assigned_to: s.assigned_to,
            notes: s.notes,
            step_status: 'PENDING'
          }))
          const { error: stepsErr } = await supabase.from('job_steps').insert(newSteps as any)
          if (stepsErr) throw stepsErr
        }
        showToast('Jobの変更を保存しました', 'success')
      } else {
        // Create New Job Workflow
        const payload: QuickMoldJobInput = {
          product_code: productInfo.code,
          product_name: productInfo.name,
          design_code: selectedRev?.design_code || 'N/A',
          wo_type: woType,
          wo_name: jobName,
          responsible_id: responsibleId || null,
          start_date: startDate || null,
          deadline: deadline || null,
          notes: notes || null,
          jobs: [
            {
              temp_id: 'job-1',
              equipment_type: equipMode === 'EXISTING' ? (selectedEquip?.type || 'MOLD') : newEquipType,
              equipment_code: equipMode === 'EXISTING' ? (selectedEquip?.code || '') : newEquipCode,
              equipment_name: equipMode === 'EXISTING' ? (selectedEquip?.name || '') : newEquipName,
              is_existing: equipMode === 'EXISTING',
              existing_equipment_id: equipMode === 'EXISTING' ? selectedEquipId : null,
              manufacture_location: manufactureLocation,
              deadline: deadline || null,
              steps: steps
            }
          ]
        }

        const res = await createQuickMoldJobWorkflow(payload)
        if (!res.success) throw new Error(res.error)
        showToast('新規Jobを作成しました', 'success')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error saving job')
      showToast('エラーが発生しました: ' + (err.message || ''), 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const selectedEquipInfo = equipmentsForRev.find(e => e.id === selectedEquipId)
  const selectedStepInfo = steps.find((s, i) => (s.step_id || `step-no-${s.step_no || i + 1}`) === selectedStepId)
  
  // Filtered worklogs by step
  const filteredWorklogs = selectedStepId 
    ? worklogs.filter(w => {
        if (selectedStepInfo?.step_id && w.job_step_id && w.job_step_id === selectedStepInfo.step_id) return true
        if (selectedStepInfo?.step_name && w.step_name && w.step_name.trim().toLowerCase() === selectedStepInfo.step_name.trim().toLowerCase()) return true
        return false
      }) 
    : worklogs

  const totalActualHours = filteredWorklogs.reduce((sum, w) => sum + w.hours_spent, 0)

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
      zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10
    }}>
      <div className="card-flat" style={{
        width: 1360, maxWidth: '98vw', height: '90vh', maxHeight: 880, background: 'var(--bg-surface)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 8, boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        
        {/* TOAST NOTIFICATION OVERLAY */}
        {toast && (
          <div style={{
            position: 'absolute', top: 14, right: 50, zIndex: 100000,
            background: toast.type === 'error' ? 'var(--danger)' : toast.type === 'info' ? '#3B82F6' : 'var(--success)',
            color: '#ffffff', padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
          }}>
            {toast.type === 'error' ? <AlertTriangle size={15} /> : toast.type === 'info' ? <Info size={15} /> : <CheckCircle2 size={15} />}
            {toast.message}
          </div>
        )}

        {/* DEDICATED WORKLOG SUB-MODAL POPUP */}
        {isWorklogModalOpen && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)',
            zIndex: 100001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
          }}>
            <div className="card-flat" style={{
              width: 520, maxWidth: '92vw', background: 'var(--bg-surface)', borderRadius: 8,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', border: '1px solid var(--border-default)',
              overflow: 'hidden', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ padding: '10px 14px', background: editingLogId ? 'var(--tint-orange-bg)' : 'var(--tint-blue-bg)', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={16} color="var(--accent)" /> {editingLogId ? '✏️ 作業日報の編集' : '+ 新規作業日報の追加'}
                </h3>
                <button onClick={handleCancelWorklogModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
              </div>

              <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 10 }}>作業日 <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input type="date" className="form-input" style={{ padding: '4px 8px', fontSize: 11 }} value={newLogDate} onChange={e => setNewLogDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 10 }}>作業者 <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <select className="form-input" style={{ padding: '4px 8px', fontSize: 11 }} value={newLogWorkerId} onChange={e => setNewLogWorkerId(e.target.value)}>
                      {employees.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.employee_name}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="form-label" style={{ fontSize: 10 }}>対象工程</label>
                    <select className="form-input" style={{ padding: '4px 8px', fontSize: 11 }} value={newLogStepId || ''} onChange={e => setNewLogStepId(e.target.value || null)}>
                      <option value="">— 全体・共通 —</option>
                      {steps.map((s, i) => {
                        const val = s.step_id || `step-no-${s.step_no || i + 1}`
                        return (
                          <option key={val} value={val}>
                            #{s.step_no} {s.step_name || '工程'}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: 10 }}>実績工数 (時間) <span style={{ color: 'var(--danger)' }}>*</span></label>
                    <input type="number" step="0.5" className="form-input" style={{ padding: '4px 8px', fontSize: 11 }} placeholder="例: 2.5" value={newLogHours} onChange={e => setNewLogHours(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 10 }}>作業種別 (Processing Code)</label>
                  <select className="form-input" style={{ padding: '4px 8px', fontSize: 11 }} value={newLogProcCodeId || ''} onChange={e => setNewLogProcCodeId(e.target.value ? Number(e.target.value) : null)}>
                    <option value="">— 作業種別を選択 (省略可) —</option>
                    {processingCodes.map(pc => (
                      <option key={pc.processing_code_id} value={pc.processing_code_id}>{pc.processing_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 10 }}>作業内容・詳細メモ</label>
                  <input type="text" className="form-input" style={{ padding: '4px 8px', fontSize: 11 }} placeholder="作業内容の補足やメモを入力" value={newLogDesc} onChange={e => setNewLogDesc(e.target.value)} />
                </div>
              </div>

              <div style={{ padding: '10px 14px', background: 'var(--bg-surface-2)', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: 11 }} onClick={handleCancelWorklogModal}>キャンセル</button>
                <button className="btn btn-primary" style={{ padding: '4px 14px', fontSize: 11 }} onClick={handleSaveWorklog} disabled={addingLog}>
                  <Save size={13} style={{ marginRight: 3 }} /> {addingLog ? '保存中...' : editingLogId ? '💾 更新' : '💾 日報登録'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOP BAR */}
        <div style={{ padding: '8px 14px', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Layers size={18} color="var(--accent)" />
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>設備・加工Job & 日報管理 Hub</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>

        {/* CONTEXT SPEC HEADER (HIGH DENSITY PRODUCT CENTER SPEC LAYOUT) */}
        <div style={{ padding: '6px 14px', background: 'var(--tint-teal-bg)', borderBottom: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: 11 }}>
            <div>
              <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>製品:</span>{' '}
              <strong style={{ color: '#0F172A', fontFamily: 'monospace', fontSize: 12 }}>{productInfo.code}</strong> <span style={{ color: '#475569' }}>({productInfo.name})</span>
            </div>
            <div>
              <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>リビジョン:</span>{' '}
              <strong style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12 }}>{selectedRev?.design_code || '未設定'}</strong>
            </div>
            <div>
              <span style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>外寸 (L×W×H):</span>{' '}
              <strong style={{ color: '#0F172A', fontFamily: 'monospace', fontSize: 12 }}>{selectedRev?.design_length || '-'} × {selectedRev?.design_width || '-'} × {selectedRev?.design_height || '-'} mm</strong>
            </div>
          </div>

          {/* EQUIPMENT SELECTOR DROPDOWN */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>対象設備:</span>
            {equipMode === 'EXISTING' ? (
              <select className="form-input" value={selectedEquipId} onChange={e => handleSelectEquipment(e.target.value)} style={{ padding: '2px 6px', fontSize: 11, fontWeight: 700, width: 260 }}>
                {equipmentsForRev.map(eq => (
                  <option key={eq.id} value={eq.id}>[{TYPE_BADGE_MAP[eq.type] || eq.type}] {eq.code} - {eq.name}</option>
                ))}
              </select>
            ) : (
              <span className="badge badge--warning" style={{ fontSize: 10 }}>新規設備作成中</span>
            )}
            <button 
              className={`btn ${equipMode === 'NEW' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: 10, padding: '2px 8px' }}
              onClick={() => { setEquipMode(equipMode === 'NEW' ? 'EXISTING' : 'NEW'); setSelectedEquipId(''); handlePrepareNewJob() }}
            >
              {equipMode === 'NEW' ? '既存設備へ' : '+ 新規設備'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ padding: '6px 14px', background: 'color-mix(in srgb, var(--danger) 10%, transparent)', color: 'var(--danger)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={15} /> {error}
          </div>
        )}

        {/* MAIN SPLIT PANEL CONTAINER (COMPACT LEFT 210px, RIGHT FLEX 1) */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          
          {/* COMPACT LEFT PANEL (210px): JOBS LIST TABLE */}
          <div style={{ width: 210, flexShrink: 0, borderRight: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface-2)' }}>
            <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 4 }}>
                <FileText size={13} color="var(--accent)" /> 加工Job ({equipmentJobs.length})
              </div>
              <button 
                className="btn btn-primary" 
                style={{ fontSize: 9, padding: '2px 6px' }}
                onClick={handlePrepareNewJob}
              >
                <Plus size={11} style={{ marginRight: 2 }} /> 新規
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 5 }}>
              {equipmentJobs.length === 0 ? (
                <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-muted)', fontSize: 10 }}>
                  Job履歴なし<br />「新規」で追加
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {equipmentJobs.map(job => {
                    const isSelected = selectedJobId === job.job_id
                    return (
                      <div
                        key={job.job_id}
                        className="card-flat"
                        style={{
                          padding: 6,
                          cursor: 'pointer',
                          borderRadius: 4,
                          borderLeft: isSelected ? '3px solid var(--accent)' : '1px solid var(--border-default)',
                          background: isSelected ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--bg-surface)',
                          transition: 'all 0.1s ease'
                        }}
                        onClick={() => loadJobDetails(job)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                          <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: 'var(--accent)' }}>
                            {job.job_code}
                          </span>
                          <span className="badge badge--info" style={{ fontSize: 8, padding: '0px 4px' }}>{job.job_status || 'PENDING'}</span>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {job.job_name || '(名称なし)'}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 9, color: '#64748B' }}>
                          <span>納期: {job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}</span>
                          <ChevronRight size={11} color={isSelected ? 'var(--accent)' : '#94A3B8'} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL (FLEX 1): 2-SUB-COLUMN HIGH DENSITY GRID (DIRECTIVE 38% / WORKLOGS 62%) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 10, background: 'var(--bg-surface)' }}>
            
            {/* PANEL HEADER TITLE BAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-default)', paddingBottom: 4, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="badge badge--info" style={{ fontSize: 9 }}>{selectedJobId ? '既存Job編集' : '新規Job作成'}</span>
                <h3 style={{ fontSize: 12, fontWeight: 700, margin: 0, color: '#0F172A' }}>
                  {selectedJobId ? `Job詳細: ${jobName || '名称未設定'}` : '新規Job指示の入力'}
                </h3>
              </div>
              {selectedJobId && (
                <div style={{ fontSize: 10, color: '#475569' }}>
                  {selectedStepId ? `工程 [${selectedStepInfo?.step_name}] 実績: ` : '合計実績工数: '}
                  <strong style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: 13, fontWeight: 700 }}>{totalActualHours.toFixed(1)} h</strong>
                </div>
              )}
            </div>

            {/* 2-SUB-COLUMN HIGH DENSITY GRID CONTAINER (38% STEPS / 62% WORKLOGS) */}
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '38% 62%', gap: 10, overflow: 'hidden' }}>
              
              {/* SUB-COLUMN 1 (LEFT 38%): DIRECTIVE & STEPS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
                
                {/* BLOCK 1: JOB DIRECTIVE FORM */}
                <div className="card-flat" style={{ padding: 8 }}>
                  <h4 style={{ fontSize: 10, fontWeight: 700, color: '#475569', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Tag size={12} color="var(--accent)" /> 加工指示基本情報 (Job Directive)
                  </h4>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 6, marginBottom: 6 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: 9 }}>指示区分</label>
                      <select className="form-input" style={{ padding: '2px 4px', fontSize: 10 }} value={woType} onChange={e => setWoType(e.target.value)}>
                        <option value="NEW">新規製作 (NEW)</option>
                        <option value="REPAIR">修理/改造 (REPAIR)</option>
                        <option value="OUTSOURCED">外注 (OUTSOURCED)</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 9 }}>Job名称</label>
                      <input type="text" className="form-input" style={{ padding: '2px 4px', fontSize: 10 }} value={jobName} onChange={e => setJobName(e.target.value)} placeholder="例: 1次試作向け修正" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 4, marginBottom: 6 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: 9 }}>担当者</label>
                      <select className="form-input" style={{ padding: '2px 2px', fontSize: 10 }} value={responsibleId} onChange={e => setResponsibleId(e.target.value)}>
                        <option value="">— 選択 —</option>
                        {employees.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.employee_name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 9 }}>場所</label>
                      <select className="form-input" style={{ padding: '2px 2px', fontSize: 10 }} value={manufactureLocation} onChange={e => setManufactureLocation(e.target.value)}>
                        <option value="IN_HOUSE">社内</option>
                        <option value="OUTSOURCED">外注</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 9 }}>着手予定</label>
                      <input type="date" className="form-input" style={{ padding: '2px 2px', fontSize: 9 }} value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 9 }}>納期</label>
                      <input type="date" className="form-input" style={{ padding: '2px 2px', fontSize: 9 }} value={deadline} onChange={e => setDeadline(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: 9 }}>備考・特記事項</label>
                    <input type="text" className="form-input" style={{ padding: '2px 4px', fontSize: 10 }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="メモ・注意事項" />
                  </div>
                </div>

                {/* BLOCK 2: PROCESSING STEPS WITH STEP FILTER SELECTION */}
                <div className="card-flat" style={{ padding: 8, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <h4 style={{ fontSize: 10, fontWeight: 700, color: '#475569', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Settings size={12} color="var(--accent)" /> 加工工程リスト (Job Steps)
                    </h4>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {selectedStepId && (
                        <button className="btn btn-secondary" onClick={() => handleToggleStepFilter(undefined)} style={{ fontSize: 8, padding: '1px 5px' }}>
                          全工程表示
                        </button>
                      )}
                      <button className="btn btn-secondary" onClick={handleAddStep} style={{ fontSize: 9, padding: '1px 5px' }}>
                        <PlusCircle size={11} style={{ marginRight: 2 }} /> 追加
                      </button>
                    </div>
                  </div>

                  {/* QUICK STEP FILTER PILLS BAR */}
                  {steps.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6, padding: '3px 4px', background: 'var(--bg-surface-2)', borderRadius: 4 }}>
                      <button
                        className={`btn ${selectedStepId === null ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: 8, padding: '1px 5px', height: 18, borderRadius: 8 }}
                        onClick={() => handleToggleStepFilter(undefined)}
                      >
                        全 ({worklogs.length})
                      </button>
                      {steps.map((s, i) => {
                        const key = s.step_id || `step-no-${s.step_no || i + 1}`
                        const isActive = selectedStepId === key
                        const stepLogsCount = worklogs.filter(w => (w.job_step_id && s.step_id && w.job_step_id === s.step_id) || (w.step_name && s.step_name && w.step_name.trim().toLowerCase() === s.step_name.trim().toLowerCase())).length
                        return (
                          <button
                            key={key}
                            className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ fontSize: 8, padding: '1px 5px', height: 18, borderRadius: 8 }}
                            onClick={() => handleToggleStepFilter(key)}
                          >
                            #{s.step_no} {s.step_name || '工程'} ({stepLogsCount})
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {steps.length === 0 ? (
                    <div style={{ padding: 10, textAlign: 'center', color: 'var(--text-muted)', fontSize: 10, border: '1px dashed var(--border-default)', borderRadius: 4 }}>
                      工程が未登録です。「追加」から登録してください。
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto', flex: 1 }}>
                      {steps.map((step, idx) => {
                        const stepKey = step.step_id || `step-no-${step.step_no || idx + 1}`
                        const isStepSelected = selectedStepId === stepKey
                        return (
                          <div 
                            key={idx} 
                            style={{ 
                              display: 'flex', gap: 4, alignItems: 'center', padding: 4, 
                              background: isStepSelected ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'var(--bg-surface-2)', 
                              border: isStepSelected ? '2px solid var(--accent)' : '1px solid var(--border-default)', 
                              borderRadius: 4, cursor: 'pointer', transition: 'all 0.1s ease'
                            }}
                            onClick={() => handleToggleStepFilter(stepKey)}
                          >
                            <div style={{ width: 16, height: 16, borderRadius: '50%', background: isStepSelected ? 'var(--accent)' : 'var(--border-default)', color: isStepSelected ? '#fff' : 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, flexShrink: 0 }}>
                              {step.step_no}
                            </div>
                            <div style={{ flex: 1.5 }}>
                              <input 
                                type="text" 
                                className="form-input" 
                                style={{ padding: '2px 4px', fontSize: 10, fontWeight: isStepSelected ? 700 : 400 }} 
                                placeholder="工程名 (例: CAD/CAM, CNC, 放電, 磨き)" 
                                value={step.step_name} 
                                onChange={e => handleUpdateStep(idx, 'step_name', e.target.value)} 
                                onFocus={() => handleToggleStepFilter(stepKey)}
                              />
                            </div>
                            <div style={{ width: 55, flexShrink: 0 }}>
                              <input 
                                type="number" 
                                className="form-input" 
                                style={{ padding: '2px 4px', fontSize: 10 }} 
                                placeholder="工数(h)" 
                                value={step.estimated_hours || ''} 
                                onChange={e => handleUpdateStep(idx, 'estimated_hours', e.target.value ? Number(e.target.value) : null)} 
                                onFocus={() => handleToggleStepFilter(stepKey)}
                              />
                            </div>
                            <div style={{ width: 85, flexShrink: 0 }}>
                              <select 
                                className="form-input" 
                                style={{ padding: '2px 2px', fontSize: 10 }} 
                                value={step.assigned_to || ''} 
                                onChange={e => handleUpdateStep(idx, 'assigned_to', e.target.value)} 
                                onFocus={() => handleToggleStepFilter(stepKey)}
                              >
                                <option value="">— 担当 —</option>
                                {employees.map(emp => <option key={emp.employee_id} value={emp.employee_id}>{emp.employee_name}</option>)}
                              </select>
                            </div>
                            {isStepSelected ? (
                              <span style={{ fontSize: 8, color: 'var(--accent)', fontWeight: 700, padding: '1px 2px', flexShrink: 0 }}>✓ 選択中</span>
                            ) : (
                              <span style={{ fontSize: 8, color: 'var(--text-muted)', padding: '1px 2px', flexShrink: 0 }}>選択</span>
                            )}
                            <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: 1, flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); handleRemoveStep(idx) }}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* SUB-COLUMN 2 (RIGHT 62% - EXPANDED HIGH CAPACITY WORKLOGS TABLE): WORKLOGS ONLY */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
                
                {/* BLOCK 3: REAL WORKLOGS TABLE WITH ADD BUTTON IN HEADER */}
                <div className="card-flat" style={{ padding: 8, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <h4 style={{ fontSize: 11, fontWeight: 700, color: '#475569', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={13} color="var(--accent)" /> 
                        {selectedStepId ? `作業日報 (工程: ${selectedStepInfo?.step_name || ''})` : '作業日報・実績ログ (全工程)'}
                      </h4>
                      {selectedStepId && (
                        <span className="badge badge--info" style={{ fontSize: 9 }}>工程フィルター適用中</span>
                      )}
                    </div>
                    
                    {/* DEDICATED ADD WORKLOG BUTTON TO TRIGGER SUB-MODAL */}
                    <button 
                      className="btn btn-primary"
                      style={{ fontSize: 10, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
                      onClick={handleOpenCreateWorklogModal}
                    >
                      <Plus size={12} /> + 作業日報を追加
                    </button>
                  </div>

                  {/* DENSE HIGH CAPACITY WORKLOGS TABLE WITH EXPANDED NO-WRAP WORKER NAME */}
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filteredWorklogs.length > 0 ? (
                      <table className="data-table" style={{ width: '100%', fontSize: 11 }}>
                        <thead>
                          <tr>
                            <th style={{ width: 80, padding: '4px 6px' }}>作業日</th>
                            <th style={{ width: 110, padding: '4px 6px', whiteSpace: 'nowrap' }}>作業者</th>
                            <th style={{ width: 65, padding: '4px 6px' }}>対象工程</th>
                            <th style={{ width: 55, padding: '4px 6px' }}>工数</th>
                            <th style={{ padding: '4px 6px' }}>作業種別・詳細メモ</th>
                            <th style={{ width: 45, textAlign: 'center', padding: '4px 6px' }}>操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredWorklogs.map(log => (
                            <tr key={log.log_id} style={{ background: editingLogId === log.log_id ? 'var(--tint-orange-bg)' : undefined }}>
                              <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#0F172A', padding: '4px 6px', whiteSpace: 'nowrap' }}>
                                {new Date(log.work_date).toLocaleDateString()}
                              </td>
                              <td style={{ fontWeight: 600, color: '#0F172A', padding: '4px 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {log.employee_name}
                              </td>
                              <td style={{ padding: '4px 6px' }}>
                                {log.step_name ? (
                                  <span className="badge badge--info" style={{ fontSize: 9, padding: '1px 5px' }}>{log.step_name}</span>
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>全体</span>
                                )}
                              </td>
                              <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)', fontSize: 12, padding: '4px 6px', whiteSpace: 'nowrap' }}>
                                {log.hours_spent} h
                              </td>
                              <td style={{ color: '#0F172A', padding: '4px 6px', wordBreak: 'break-word' }}>
                                {log.processing_name && (
                                  <span className="badge badge--neutral" style={{ fontSize: 9, padding: '1px 5px', marginRight: 4, display: 'inline-block' }}>
                                    {log.processing_name}
                                  </span>
                                )}
                                <span style={{ fontSize: 11 }}>{log.description || '-'}</span>
                              </td>
                              <td style={{ textAlign: 'center', padding: '4px 6px' }}>
                                <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 1 }} onClick={() => handleStartEditWorklog(log)} title="編集">
                                    <Edit2 size={13} />
                                  </button>
                                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: 1 }} onClick={() => handleDeleteWorklog(log.log_id)} title="削除">
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', padding: 20 }}>
                        {selectedStepId ? 'この工程の作業日報は未登録です。「+ 作業日報を追加」から登録できます。' : '作業日報は未登録です。「+ 作業日報を追加」から登録できます。'}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* FOOTER ACTION BAR */}
        <div style={{ padding: '6px 14px', background: 'var(--bg-surface-2)', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
            選択設備: <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{selectedEquipInfo?.code || newEquipCode || '未選択'}</strong>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-secondary" style={{ padding: '3px 10px', fontSize: 10 }} onClick={() => { showToast('操作をキャンセルしました', 'info'); onClose() }}>閉じる</button>
            <button className="btn btn-primary" style={{ padding: '3px 12px', fontSize: 10 }} onClick={handleSubmit} disabled={loading}>
              <Save size={13} style={{ marginRight: 3 }} /> {loading ? '保存中...' : '💾 保存実行'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
