'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { createQuickMoldJobWorkflow, QuickMoldJobStepInput } from '@/app/actions/quick-mold-job'
import {
  X, Sparkles, PenTool, Box, Wrench, Clock, Save, RefreshCw,
  Plus, Trash2, CheckCircle2, AlertTriangle, Layers, Calendar, User, Zap,
  ArrowLeft, ArrowRight, Check, History, ExternalLink, Pencil, FileText,
  PlusCircle, MapPin, Tag, Filter, CheckSquare, Square
} from 'lucide-react'
import { EquipmentTypeIcon, getEquipmentTypeTheme } from '@/components/ui/EquipmentTypeIcon'
import { formatCutterDisplayCode, formatMoldDisplayCode, formatRackLocationDisplay } from '@/lib/utils/moldNaming'

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
  cavity_pitch_mm: number | null
  machine_feed_pitch_mm: number | null
  plug_type: string | null
  customer_tray_name: string | null
  parent_design_id: string | null
  design_category: string | null
  change_summary?: string | null
  created_at?: string
}

interface EquipmentData {
  id: string
  code: string
  name: string
  type: string
  status: string
  rack: string
  keeper?: string | null
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

const WIZARD_STEPS = [
  { step: 1, title: 'CAD仕様 Hub', desc: 'CAD仕様 & リビジョン選択', icon: PenTool },
  { step: 2, title: '物理金型 Hub', desc: '金型・設備 Kit & 参照', icon: Box },
  { step: 3, title: 'ジョブ指示 Hub', desc: 'ジョブ作成 & 対象区分', icon: Wrench },
  { step: 4, title: '工程・作業ログ Hub', desc: '工程Kit & 作業実績ログ', icon: Clock },
] as const

type EquipTabFilter = 'ALL' | 'MOLD' | 'CUTTER' | 'WATER_BASE' | 'PRESSURE_BASE' | 'FRAME' | 'PLUG'

export function CenteredQuickJobWizardModal({
  isOpen,
  mode,
  subMode = 'NEXT_MASS',
  productId,
  selectedRev: initialSelectedRev,
  targetEquipment: initialTargetEquipment,
  onClose,
  onSuccess,
}: CenteredQuickJobWizardModalProps) {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)

  // Master Lookups
  const [companies, setCompanies] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  // Active Context Cascade States (Domain Relationships: Product -> Active Rev -> Active Equip -> Active Job)
  const [allRevisions, setAllRevisions] = useState<DesignRevisionData[]>([])
  const [activeRevId, setActiveRevId] = useState<string | null>(initialSelectedRev?.revision_id || null)

  const [equipmentsForRev, setEquipmentsForRev] = useState<EquipmentData[]>([])
  const [activeEquipId, setActiveEquipId] = useState<string | null>(initialTargetEquipment?.id || null)
  const [equipCategoryTab, setEquipCategoryTab] = useState<EquipTabFilter>('ALL')

  const [jobsForEquip, setJobsForEquip] = useState<any[]>([])
  const [editingJobId, setEditingJobId] = useState<string | null>(null)

  const [worklogsForJob, setWorklogsForJob] = useState<any[]>([])

  // Form States - Step 1: Customer & CAD Specs
  const [companyId, setCompanyId] = useState('')
  const [productCode, setProductCode] = useState('')
  const [productName, setProductName] = useState('')
  const [customerProductName, setCustomerProductName] = useState('')
  const [plasticType, setPlasticType] = useState('')
  const [designCode, setDesignCode] = useState('')
  const [designLength, setDesignLength] = useState<number | ''>('')
  const [designWidth, setDesignWidth] = useState<number | ''>('')
  const [designHeight, setDesignHeight] = useState<number | ''>('')
  const [designDepth, setDesignDepth] = useState<number | ''>('')
  const [cutlineLength, setCutlineLength] = useState<number | ''>('')
  const [cutlineWidth, setCutlineWidth] = useState<number | ''>('')
  const [cavityCount, setCavityCount] = useState<number | ''>('')
  const [plugType, setPlugType] = useState('')
  const [versionNote, setVersionNote] = useState('')

  // Form States - Step 2: Physical Mold & Stamp
  const [systemCode, setSystemCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [physicalStamp, setPhysicalStamp] = useState('')

  // Form States - Step 3: Job Directive & Target Scope
  const [jobCode, setJobCode] = useState('')
  const [jobName, setJobName] = useState('新規本型加工')
  const [jobTypeId, setJobTypeId] = useState('1')
  const [jobTargetScope, setJobTargetScope] = useState<'FULL_SET' | 'MOLD_ONLY' | 'PLUG_ONLY' | 'CUTTER_ONLY'>('FULL_SET')
  const [responsibleId, setResponsibleId] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10))
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')

  // Form States - Step 4: Component Steps & Worklogs
  const [steps, setSteps] = useState<QuickMoldJobStepInput[]>([
    { step_no: 1, step_name: '金型本体', type_code: 'MOLD', material_spec: 'A5052', quantity: 1, arrangement: 'REQUIRED', condition: 'NEW', manufacture_location: 'IN_HOUSE' },
    { step_no: 2, step_name: '木型プラグ', type_code: 'PLUG', material_spec: 'ベニヤ木板', quantity: 1, arrangement: 'REQUIRED', condition: 'NEW', manufacture_location: 'IN_HOUSE' }
  ])

  // New Worklog Input State
  const [newLogWorker, setNewLogWorker] = useState('')
  const [newLogHours, setNewLogHours] = useState<number | ''>('')
  const [newLogNotes, setNewLogNotes] = useState('')

  // Load All Revisions for product
  const loadProductRevisions = useCallback(async () => {
    if (!productId) return
    const { data: revs } = await supabase
      .from('design_revisions')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (revs && revs.length > 0) {
      setAllRevisions(revs as unknown as DesignRevisionData[])
      if (!activeRevId) setActiveRevId(revs[0].revision_id)
    }
  }, [productId, supabase, activeRevId])

  // Load Equipment specifically linked to the active revision (matches TabDesignsEquipment.tsx)
  const loadEquipmentsForActiveRev = useCallback(async (revId: string | null) => {
    if (!revId) {
      setEquipmentsForRev([])
      return
    }

    const revObj = allRevisions.find(r => r.revision_id === revId)
    const targetL = revObj?.design_length || revObj?.cutline_length || null
    const targetW = revObj?.design_width || revObj?.cutline_width || null

    const equipMap = new Map<string, EquipmentData>()

    // A. Direct equipment linked strictly to this design revision
    const { data: dirEquip } = await supabase
      .from('equipment')
      .select('equipment_id, equipment_type, equipment_code, display_name, usage_status, device_status, actual_length_mm, actual_width_mm, rack_layers(layer_code, racks(rack_code)), keeper_company:companies!equipment_keeper_company_id_fkey(company_code, company_name)')
      .eq('design_revision_id', revId)

    if (dirEquip) {
      dirEquip.forEach((e: any) => {
        const isCutter = ['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(String(e.equipment_type || '').toUpperCase())
        const code = isCutter ? formatCutterDisplayCode(e.equipment_code) : (e.equipment_code || '—')
        const rack = formatRackLocationDisplay(e.rack_layers)
        const keeper = e.keeper_company?.company_code || e.keeper_company?.company_name || 'YSD'
        equipMap.set(e.equipment_id, { id: e.equipment_id, code, name: e.display_name || '', type: e.equipment_type || 'MOLD', status: e.usage_status || 'IN_STOCK', rack, keeper })
      })
    }

    // B. Shared cutters via mold_design_cutters junction table
    // FK cutter_id points to legacy cutters table, so lookup via BOTH equipment_id AND legacy_cutter_id
    const { data: juncs } = await supabase.from('mold_design_cutters').select('cutter_id').eq('mold_design_id', revId)
    if (juncs && juncs.length > 0) {
      const cIds = juncs.map(j => j.cutter_id).filter(Boolean)
      if (cIds.length > 0) {
        const { data: sCutters } = await supabase
          .from('equipment')
          .select('equipment_id, equipment_type, equipment_code, display_name, usage_status, device_status, rack_layers(layer_code, racks(rack_code)), keeper_company:companies!equipment_keeper_company_id_fkey(company_code, company_name)')
          .or(`equipment_id.in.(${cIds.join(',')}),legacy_cutter_id.in.(${cIds.join(',')})`)

        if (sCutters) {
          sCutters.forEach((sc: any) => {
            if (!equipMap.has(sc.equipment_id)) {
              const code = formatCutterDisplayCode(sc.equipment_code)
              const rack = formatRackLocationDisplay(sc.rack_layers)
              const keeper = sc.keeper_company?.company_code || sc.keeper_company?.company_name || 'YSD'
              equipMap.set(sc.equipment_id, { id: sc.equipment_id, code, name: sc.display_name || '', type: sc.equipment_type || 'CUTTER', status: sc.usage_status || 'IN_STOCK', rack, keeper })
            }
          })
        }
      }
    }

    // C. CAV Spec Match Candidates (auxiliary: WATER_BASE, PRESSURE_BASE, FRAME, PLUG, STACKING)
    if (targetL && targetW) {
      const { data: auxCandidates } = await supabase
        .from('equipment')
        .select('equipment_id, equipment_type, equipment_code, display_name, usage_status, device_status, actual_length_mm, actual_width_mm, design_revision_id, rack_layers(layer_code, racks(rack_code)), keeper_company:companies!equipment_keeper_company_id_fkey(company_code, company_name)')
        .not('equipment_type', 'in', '("MOLD","CUTTER","CUTTER_SEPARATE","CUTTER_INLINE","抜型")')

      if (auxCandidates) {
        auxCandidates.forEach((aux: any) => {
          if (equipMap.has(aux.equipment_id)) return
          const l = aux.actual_length_mm ? Number(aux.actual_length_mm) : null
          const w = aux.actual_width_mm ? Number(aux.actual_width_mm) : null
          const isMatch = (l && w) && ((l === targetL && w === targetW) || (l === targetW && w === targetL))
          if (isMatch) {
            const rack = formatRackLocationDisplay(aux.rack_layers)
            const keeper = aux.keeper_company?.company_code || aux.keeper_company?.company_name || 'YSD'
            equipMap.set(aux.equipment_id, { id: aux.equipment_id, code: aux.equipment_code || '—', name: aux.display_name || '', type: aux.equipment_type || 'AUXILIARY', status: aux.usage_status || 'IN_STOCK', rack, keeper })
          }
        })
      }
    }

    const list = Array.from(equipMap.values())
    setEquipmentsForRev(list)
    if (list.length > 0 && !activeEquipId) {
      setActiveEquipId(list[0].id)
    }
  }, [supabase, activeEquipId, allRevisions])

  // Load Jobs linked specifically to active revision or active equipment
  const loadJobsForActiveEquip = useCallback(async (equipId: string | null, revId: string | null) => {
    let query = supabase.from('jobs').select('*, employees(employee_name)').order('created_at', { ascending: false })

    if (equipId) {
      query = query.or(`equipment_id.eq.${equipId},physical_mold_id.eq.${equipId}`)
    } else if (revId) {
      query = query.eq('design_revision_id', revId)
    } else if (productId) {
      query = query.limit(20)
    }

    const { data: jobs } = await query
    if (jobs) {
      setJobsForEquip(jobs)
      if (jobs.length > 0 && !editingJobId) {
        // Pre-select first job
        setEditingJobId(jobs[0].job_id)
      }
    } else {
      setJobsForEquip([])
    }
  }, [supabase, productId, editingJobId])

  // Load Worklogs linked to active job (work_logs does NOT have equipment_id — RULE-DATA-02)
  const loadWorklogsForActiveJob = useCallback(async (jobId: string | null) => {
    if (!jobId) {
      setWorklogsForJob([])
      return
    }
    const { data: logs } = await supabase
      .from('work_logs')
      .select('*, employees(employee_name)')
      .eq('job_id', jobId)
      .order('work_date', { ascending: false })
      .limit(50)

    if (logs) setWorklogsForJob(logs)
    else setWorklogsForJob([])
  }, [supabase])

  // Initial Modal Data Loading
  useEffect(() => {
    if (!isOpen) return
    setError(null)
    setCurrentStep(mode === 'CREATE_JOB' ? 3 : mode === 'CREATE_MOLD' ? 2 : 1)

    async function initData() {
      // 1. Fetch Masters
      const [empRes, compRes] = await Promise.all([
        supabase.from('employees').select('employee_id, employee_name').order('employee_name').limit(50),
        supabase.from('companies').select('company_id, company_name, company_code').order('company_name').limit(50)
      ])
      if (empRes.data) setEmployees(empRes.data)
      if (compRes.data) setCompanies(compRes.data)

      // 2. Fetch product info & customer
      if (productId) {
        const { data: prod } = await supabase
          .from('products')
          .select('*, companies:companies!products_company_id_fkey(company_id, company_name, company_code)')
          .eq('product_id', productId)
          .maybeSingle()

        if (prod) {
          setProductCode(prod.product_code || '')
          setProductName(prod.product_name || '')
          setCustomerProductName(prod.customer_product_name || '')
          setCompanyId(prod.company_id || prod.companies?.company_id || '')
        }
      }

      await loadProductRevisions()
    }

    initData()
  }, [isOpen, productId, mode, supabase, loadProductRevisions])

  // Cascade effect 1: When activeRevId changes, pre-fill Step 1 inputs & reload Step 2 equipments
  useEffect(() => {
    if (!activeRevId || allRevisions.length === 0) return

    const rev = allRevisions.find(r => r.revision_id === activeRevId) || initialSelectedRev
    if (rev) {
      setDesignCode(rev.design_code || '')
      setDesignLength(rev.design_length || '')
      setDesignWidth(rev.design_width || '')
      setDesignHeight(rev.design_height || '')
      setDesignDepth(rev.design_depth || '')
      setCutlineLength(rev.cutline_length || '')
      setCutlineWidth(rev.cutline_width || '')
      setCavityCount(rev.cavity_count || '')
      setPlugType(rev.plug_type || '')
      setPlasticType(rev.plastic_type_designed || '')
      setVersionNote(rev.change_summary || '')

      setSystemCode(`${rev.design_code || 'REV'} #1`)
      setDisplayName(`${rev.design_code || 'REV'} 金型 #1`)
      setPhysicalStamp(rev.design_code || '')
      setJobCode(`J-${rev.design_code || 'REV'}`)
    }

    loadEquipmentsForActiveRev(activeRevId)
  }, [activeRevId, allRevisions, initialSelectedRev, loadEquipmentsForActiveRev])

  // Cascade effect 2: When activeEquipId changes, reload Step 3 jobs
  useEffect(() => {
    loadJobsForActiveEquip(activeEquipId, activeRevId)
  }, [activeEquipId, activeRevId, loadJobsForActiveEquip])

  // Cascade effect 3: When editingJobId changes, reload Step 4 worklogs
  useEffect(() => {
    loadWorklogsForActiveJob(editingJobId)
  }, [editingJobId, loadWorklogsForActiveJob])

  // Step 2 Filtered Equipment (MUST be before early return — React hooks order rule)
  const filteredEquipmentsForRev = useMemo(() => {
    if (equipCategoryTab === 'ALL') return equipmentsForRev
    return equipmentsForRev.filter(item => {
      const tUpper = String(item.type || '').toUpperCase()
      if (equipCategoryTab === 'MOLD') return ['MOLD', '金型'].includes(tUpper)
      if (equipCategoryTab === 'CUTTER') return ['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(tUpper)
      if (equipCategoryTab === 'WATER_BASE') return tUpper === 'WATER_BASE'
      if (equipCategoryTab === 'PRESSURE_BASE') return tUpper === 'PRESSURE_BASE'
      if (equipCategoryTab === 'FRAME') return tUpper === 'FRAME'
      if (equipCategoryTab === 'PLUG') return ['PLUG', 'STACKING', 'AUXILIARY'].includes(tUpper)
      return true
    })
  }, [equipmentsForRev, equipCategoryTab])

  const activeRevObj = allRevisions.find(r => r.revision_id === activeRevId)
  const activeEquipObj = equipmentsForRev.find(e => e.id === activeEquipId)

  if (!isOpen) return null

  // Switch Active Revision & Cascade Context
  const handleSelectRevision = (rev: DesignRevisionData) => {
    setActiveRevId(rev.revision_id)
    setActiveEquipId(null)
    setEditingJobId(null)
  }

  // Switch Active Equipment & Cascade Context
  const handleSelectEquipment = (eq: EquipmentData) => {
    setActiveEquipId(eq.id)
    setSystemCode(eq.code)
    setDisplayName(eq.name)
    setJobCode(`J-${eq.code}`)
    setEditingJobId(null)
  }

  // Select Existing Job for editing or reference
  const handleSelectExistingJob = (job: any) => {
    setEditingJobId(job.job_id)
    setJobCode(job.job_code || '')
    setJobName(job.job_name || '')
    setJobTypeId(job.job_type_id?.toString() || '1')
    if (job.responsible_id) setResponsibleId(job.responsible_id)
    if (job.start_date) setStartDate(job.start_date.substring(0, 10))
    if (job.deadline) setDeadline(job.deadline.substring(0, 10))
    if (job.notes) setNotes(job.notes)
  }

  // Target Scope Switcher (Full Set / Mold / Plug Only / Cutter Only)
  const handleSelectTargetScope = (scope: 'FULL_SET' | 'MOLD_ONLY' | 'PLUG_ONLY' | 'CUTTER_ONLY') => {
    setJobTargetScope(scope)
    const baseCode = designCode || 'REV'

    if (scope === 'PLUG_ONLY') {
      setJobName('[プラグ] 修正・削り出し')
      setSteps([
        { step_no: 1, step_name: '木型プラグ加工', type_code: 'PLUG', material_spec: 'ベニヤ木板', quantity: 1, arrangement: 'REQUIRED', condition: 'REPAIR', manufacture_location: 'IN_HOUSE' }
      ])
    } else if (scope === 'MOLD_ONLY') {
      setJobName('[金型] 本体加工・修正')
      setSteps([
        { step_no: 1, step_name: '金型本体マシニング', type_code: 'MOLD', material_spec: 'A5052', quantity: 1, arrangement: 'REQUIRED', condition: 'REPAIR', manufacture_location: 'IN_HOUSE' }
      ])
    } else if (scope === 'CUTTER_ONLY') {
      setJobName('[抜型] 刃物再研磨・調整')
      setSteps([
        { step_no: 1, step_name: '抜型刃物調整', type_code: 'CUTTER', material_spec: 'SKD11', quantity: 1, arrangement: 'REQUIRED', condition: 'REPAIR', manufacture_location: 'OUTSOURCED' }
      ])
    } else {
      setJobName('新規本型加工一式')
      setSteps([
        { step_no: 1, step_name: '金型本体', type_code: 'MOLD', material_spec: 'A5052', quantity: 1, arrangement: 'REQUIRED', condition: 'NEW', manufacture_location: 'IN_HOUSE' },
        { step_no: 2, step_name: '木型プラグ', type_code: 'PLUG', material_spec: 'ベニヤ木板', quantity: 1, arrangement: 'REQUIRED', condition: 'NEW', manufacture_location: 'IN_HOUSE' }
      ])
    }
  }

  // Quick Add Worklog Item
  const handleAddWorklog = async () => {
    if (!newLogWorker || !newLogHours) return
    const empObj = employees.find(e => e.employee_id === newLogWorker)

    const newLog = {
      log_id: `temp_${Date.now()}`,
      work_date: new Date().toISOString().substring(0, 10),
      employee_id: newLogWorker,
      employees: empObj ? { employee_name: empObj.employee_name } : null,
      hours_spent: Number(newLogHours),
      notes: newLogNotes || '加工作業実績'
    }

    setWorklogsForJob(prev => [newLog, ...prev])
    setNewLogHours('')
    setNewLogNotes('')
  }

  const handleAddComponentStep = (typeCode: string, name: string, material: string) => {
    setSteps(prev => [
      ...prev,
      {
        step_no: prev.length + 1,
        step_name: name,
        type_code: typeCode,
        material_spec: material,
        quantity: 1,
        arrangement: 'REQUIRED',
        condition: 'NEW',
        manufacture_location: 'IN_HOUSE',
      }
    ])
  }

  const handleRemoveStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, step_no: i + 1 })))
  }

  // Unified Save Package Handler
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await createQuickMoldJobWorkflow({
        company_id: companyId || null,
        product_code: productCode || 'PROD',
        product_name: productName || 'Product',
        customer_product_name: customerProductName || null,

        design_code: designCode || 'REV1',
        design_length: Number(designLength) || null,
        design_width: Number(designWidth) || null,
        design_height: Number(designHeight) || null,
        design_depth: Number(designDepth) || null,
        cutline_length: Number(cutlineLength) || null,
        cutline_width: Number(cutlineWidth) || null,
        cavity_count: Number(cavityCount) || null,
        plastic_type_designed: plasticType || null,
        plug_type: plugType || null,

        system_code: systemCode || `${designCode} #1`,
        display_name: displayName || `${designCode} Mold`,
        physical_stamp: physicalStamp || null,

        job_code: jobCode || `J-${designCode}`,
        job_name: jobName || '本型加工',
        job_type_id: jobTypeId || '1',
        responsible_id: responsibleId || null,
        start_date: startDate || null,
        deadline: deadline || null,
        notes: notes || null,

        steps: steps,
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to save mold & job package')
      }

      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Error in CenteredQuickJobWizardModal:', err)
      setError(err?.message || 'Transaction failed')
    } finally {
      setLoading(false)
    }
  }

  // (useMemo and derived consts moved before early return — see above)

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
    }}>
      <div className="card" style={{
        width: 1140, maxWidth: '97vw', height: 720, maxHeight: '94vh', background: 'var(--bg-surface)',
        borderRadius: 12, border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', overflow: 'hidden'
      }}>

        {/* Modal Top Header */}
        <div style={{
          padding: '12px 20px', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
              color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚡ 統合業務データセンター Wizard
                {activeRevObj && (
                  <span className="badge badge--success" style={{ fontSize: 10 }}>
                    選択中: {activeRevObj.design_code} (Rev.{activeRevObj.revision_number || 0})
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                フォーム入力 (左) と リアルタイム連動コンテキスト・参照パネル (右)
              </div>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* STEPPER NAVIGATION BAR (1 -> 2 -> 3 -> 4) */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border-default)',
          borderBottom: '1px solid var(--border-default)'
        }}>
          {WIZARD_STEPS.map((s) => {
            const isActive = currentStep === s.step
            const isCompleted = currentStep > s.step

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => setCurrentStep(s.step as any)}
                style={{
                  padding: '10px 14px', border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: isActive ? 'var(--bg-surface)' : 'var(--bg-surface-2)',
                  borderBottom: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  transition: 'all 0.15s ease', display: 'flex', alignItems: 'center', gap: 10
                }}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                  background: isCompleted ? 'var(--accent)' : isActive ? 'color-mix(in srgb, var(--accent) 20%, transparent)' : 'var(--border-default)',
                  color: isCompleted ? '#FFF' : isActive ? 'var(--accent)' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {isCompleted ? <Check size={14} /> : s.step}
                </div>

                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ fontSize: 11, fontWeight: isActive ? 700 : 600, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.desc}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{ padding: '8px 16px', background: '#FEE2E2', borderBottom: '1px solid #FCA5A5', color: '#991B1B', fontSize: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {/* DOMAIN HUB SPLIT CONTAINER (Left 62% Active Form vs Right 38% Business Reference) */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: 0 }}>

          {/* LEFT COLUMN: ACTIVE STEP FORM INPUTS */}
          <div style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16, borderRight: '1px solid var(--border-default)' }}>

            {/* STEP 1: CAD Specs & Product Info */}
            {currentStep === 1 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PenTool size={16} style={{ color: 'var(--accent)' }} /> STEP 1: 得意先・製品・CAD仕様パラメータ
                  </span>
                  <button type="button" className="btn btn-secondary" onClick={() => handleSubmit()} style={{ fontSize: 10, padding: '2px 8px' }}>
                    💾 このステップのみ保存
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: 12 }}>
                  <div>
                    <label className="form-label">得意先 (Customer)</label>
                    <select className="form-input" value={companyId} onChange={(e) => setCompanyId(e.target.value)}>
                      <option value="">— 選択なし —</option>
                      {companies.map(c => (
                        <option key={c.company_id} value={c.company_id}>{c.company_name} ({c.company_code})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">製品コード (Product Code)</label>
                    <input type="text" className="form-input" value={productCode} onChange={(e) => setProductCode(e.target.value)} style={{ fontFamily: 'monospace', fontWeight: 700 }} required />
                  </div>
                  <div>
                    <label className="form-label">設計樹脂仕様 (Single SSOT from Design)</label>
                    <input type="text" className="form-input" value={plasticType} onChange={(e) => setPlasticType(e.target.value)} placeholder="PET 透明 1mm [640] 帯電防止付..." style={{ fontWeight: 600 }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="form-label">図面コード (Design Code)</label>
                    <input type="text" className="form-input" value={designCode} onChange={(e) => setDesignCode(e.target.value)} style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }} required />
                  </div>
                  <div>
                    <label className="form-label">外寸 L (mm)</label>
                    <input type="number" className="form-input" value={designLength} onChange={(e) => setDesignLength(e.target.value ? Number(e.target.value) : '')} placeholder="590" />
                  </div>
                  <div>
                    <label className="form-label">外寸 W (mm)</label>
                    <input type="number" className="form-input" value={designWidth} onChange={(e) => setDesignWidth(e.target.value ? Number(e.target.value) : '')} placeholder="400" />
                  </div>
                  <div>
                    <label className="form-label">高さ H (mm)</label>
                    <input type="number" className="form-input" value={designHeight} onChange={(e) => setDesignHeight(e.target.value ? Number(e.target.value) : '')} placeholder="74" />
                  </div>
                  <div>
                    <label className="form-label">深さ D (mm)</label>
                    <input type="number" className="form-input" value={designDepth} onChange={(e) => setDesignDepth(e.target.value ? Number(e.target.value) : '')} placeholder="62" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">カットライン L (mm)</label>
                    <input type="number" className="form-input" value={cutlineLength} onChange={(e) => setCutlineLength(e.target.value ? Number(e.target.value) : '')} placeholder="530" />
                  </div>
                  <div>
                    <label className="form-label">カットライン W (mm)</label>
                    <input type="number" className="form-input" value={cutlineWidth} onChange={(e) => setCutlineWidth(e.target.value ? Number(e.target.value) : '')} placeholder="350" />
                  </div>
                  <div>
                    <label className="form-label">取数 (Cavity Count)</label>
                    <input type="number" className="form-input" value={cavityCount} onChange={(e) => setCavityCount(e.target.value ? Number(e.target.value) : '')} placeholder="12" />
                  </div>
                  <div>
                    <label className="form-label">プラグ構成 (Plug Config)</label>
                    <input type="text" className="form-input" value={plugType} onChange={(e) => setPlugType(e.target.value)} placeholder="なし / プラグ有" />
                  </div>
                </div>

                <div>
                  <label className="form-label">リビジョン改訂メモ・要約 (Revision Summary Note)</label>
                  <input type="text" className="form-input" value={versionNote} onChange={(e) => setVersionNote(e.target.value)} placeholder="例: ポケット深さ変更 (62mm -> 65mm), Bo góc R15..." />
                </div>
              </>
            )}

            {/* STEP 2: Physical Mold & Equipment Set Kit */}
            {currentStep === 2 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Box size={16} style={{ color: 'var(--accent)' }} /> STEP 2: 物理金型・刻印 & 構成部品 Kit 設定
                  </span>
                  <button type="button" className="btn btn-secondary" onClick={() => handleSubmit()} style={{ fontSize: 10, padding: '2px 8px' }}>
                    💾 このステップのみ保存
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">システム金型コード (System Code)</label>
                    <input type="text" className="form-input" value={systemCode} onChange={(e) => setSystemCode(e.target.value)} style={{ fontFamily: 'monospace', fontWeight: 700 }} required />
                  </div>
                  <div>
                    <label className="form-label">金型表示名 (Display Name)</label>
                    <input type="text" className="form-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="form-label">物理刻印コード (Physical Stamp)</label>
                    <input type="text" className="form-input" value={physicalStamp} onChange={(e) => setPhysicalStamp(e.target.value)} style={{ fontFamily: 'monospace' }} />
                  </div>
                </div>

                {/* Kit Composition Active List */}
                <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, padding: 14, background: 'var(--bg-surface-2)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                      構成部品・補助設備 Kit 一括追加 ({steps.length} アイテム)
                    </span>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button type="button" className="btn btn-secondary" onClick={() => handleAddComponentStep('PLUG', '木型プラグ', 'ベニヤ木板')} style={{ fontSize: 10, padding: '3px 8px' }}>+ PLUG</button>
                      <button type="button" className="btn btn-secondary" onClick={() => handleAddComponentStep('CUTTER', '抜型刃物', 'SKD11')} style={{ fontSize: 10, padding: '3px 8px' }}>+ CUTTER</button>
                      <button type="button" className="btn btn-secondary" onClick={() => handleAddComponentStep('WATER_BASE', '水冷盤', 'A5052')} style={{ fontSize: 10, padding: '3px 8px' }}>+ WATER</button>
                      <button type="button" className="btn btn-secondary" onClick={() => handleAddComponentStep('PRESSURE_BASE', '圧空盤', 'SS400')} style={{ fontSize: 10, padding: '3px 8px' }}>+ PRESS</button>
                      <button type="button" className="btn btn-secondary" onClick={() => handleAddComponentStep('FRAME', 'フレーム', 'SS400')} style={{ fontSize: 10, padding: '3px 8px' }}>+ FRAME</button>
                    </div>
                  </div>

                  {/* Component Steps Active Table */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {steps.map((st, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--bg-surface)', borderRadius: 6, border: '1px solid var(--border-default)', fontSize: 11 }}>
                        <span className="badge badge--info" style={{ fontSize: 9 }}>{st.type_code}</span>
                        <input type="text" className="form-input" style={{ fontSize: 11, flex: 1 }} value={st.step_name} onChange={(e) => {
                          const val = e.target.value
                          setSteps(prev => prev.map((item, i) => i === idx ? { ...item, step_name: val } : item))
                        }} />
                        <input type="text" className="form-input" style={{ fontSize: 11, width: 120 }} value={st.material_spec || ''} placeholder="材質..." onChange={(e) => {
                          const val = e.target.value
                          setSteps(prev => prev.map((item, i) => i === idx ? { ...item, material_spec: val } : item))
                        }} />
                        <button type="button" onClick={() => handleRemoveStep(idx)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* STEP 3: Job Directive & Target Scope */}
            {currentStep === 3 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Wrench size={16} style={{ color: 'var(--accent)' }} /> STEP 3: ジョブ指示 & 対象区分・スケジュール
                  </span>
                  <button type="button" className="btn btn-secondary" onClick={() => handleSubmit()} style={{ fontSize: 10, padding: '2px 8px' }}>
                    💾 このステップのみ保存
                  </button>
                </div>

                {/* Job Target Scope Switcher */}
                <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, padding: 10, background: 'var(--bg-surface-2)' }}>
                  <label className="form-label" style={{ marginBottom: 6 }}>加工対象区分 (Target Scope / Object Target)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                    {([
                      { scope: 'FULL_SET', label: '一式 (Full Set)' },
                      { scope: 'MOLD_ONLY', label: '金型のみ (Mold Only)' },
                      { scope: 'PLUG_ONLY', label: 'プラグのみ (Plug Only)' },
                      { scope: 'CUTTER_ONLY', label: '抜型のみ (Cutter Only)' },
                    ] as const).map(item => {
                      const isSel = jobTargetScope === item.scope
                      return (
                        <button
                          key={item.scope}
                          type="button"
                          onClick={() => handleSelectTargetScope(item.scope)}
                          style={{
                            padding: '6px 8px', fontSize: 11, fontWeight: isSel ? 700 : 500,
                            background: isSel ? 'var(--accent)' : 'var(--bg-surface)',
                            color: isSel ? '#FFF' : 'var(--text-primary)',
                            border: `1px solid ${isSel ? 'var(--accent)' : 'var(--border-default)'}`,
                            borderRadius: 6, cursor: 'pointer', transition: 'all 0.12s ease'
                          }}
                        >
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">ジョブコード (Job Code)</label>
                    <input type="text" className="form-input" value={jobCode} onChange={(e) => setJobCode(e.target.value)} style={{ fontFamily: 'monospace', fontWeight: 700 }} required />
                  </div>
                  <div>
                    <label className="form-label">ジョブ件名 (Job Title)</label>
                    <input type="text" className="form-input" value={jobName} onChange={(e) => setJobName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="form-label">担当者 (Assignee)</label>
                    <select className="form-input" value={responsibleId} onChange={(e) => setResponsibleId(e.target.value)}>
                      <option value="">— 選択なし —</option>
                      {employees.map(emp => (
                        <option key={emp.employee_id} value={emp.employee_id}>{emp.employee_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 12 }}>
                  <div>
                    <label className="form-label">着手日 (Start Date)</label>
                    <input type="date" className="form-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">納期 (Deadline)</label>
                    <input type="date" className="form-input" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">詳細メモ (Notes)</label>
                    <input type="text" className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="加工指示・注意事項..." />
                  </div>
                </div>
              </>
            )}

            {/* STEP 4: Processing Kit & Worklog History */}
            {currentStep === 4 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={16} style={{ color: 'var(--accent)' }} /> STEP 4: 構成部品 Kit・加工工程スケジュール ({steps.length} items)
                  </span>
                  <button type="button" className="btn btn-primary" onClick={() => handleSubmit()} style={{ fontSize: 11, padding: '4px 12px' }}>
                    💾 全一括保存実行
                  </button>
                </div>

                <table className="data-table" style={{ width: '100%', fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th>構成区分</th>
                      <th>部品名称</th>
                      <th>材質・仕様</th>
                      <th style={{ width: 60, textAlign: 'center' }}>数量</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {steps.map((s, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'monospace' }}>{s.step_no}</td>
                        <td>
                          <span className="badge badge--info" style={{ fontSize: 9 }}>{s.type_code || 'MOLD'}</span>
                        </td>
                        <td style={{ fontWeight: 600 }}>{s.step_name}</td>
                        <td>{s.material_spec || '—'}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{s.quantity || 1}</td>
                        <td>
                          <button type="button" onClick={() => handleRemoveStep(idx)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

          </div>

          {/* RIGHT COLUMN: DOMAIN CONTEXT CASCADE & REFERENCE PANELS */}
          <div style={{ overflowY: 'auto', padding: 16, background: 'var(--bg-surface-2)', display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* STEP 1 RIGHT PANEL: Revision Selector & Description Summary */}
            {currentStep === 1 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <History size={13} style={{ color: 'var(--accent)' }} /> 既存図面・リビジョン選択 ({allRevisions.length} 件)
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>クリックで連動切り替え</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {allRevisions.map(rev => {
                    const isSelected = rev.revision_id === activeRevId

                    return (
                      <div
                        key={rev.revision_id}
                        onClick={() => handleSelectRevision(rev)}
                        className="card-flat"
                        style={{
                          padding: 8, background: isSelected ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--bg-surface)',
                          border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-default)',
                          fontSize: 11, display: 'flex', flexDirection: 'column', gap: 4, cursor: 'pointer', transition: 'all 0.12s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {isSelected && <CheckSquare size={13} style={{ color: 'var(--accent)' }} />}
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{rev.design_code}</span>
                          </div>
                          <span className="badge badge--neutral" style={{ fontSize: 9 }}>Rev.{rev.revision_number || 0}</span>
                        </div>

                        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                          外寸: {[rev.design_length, rev.design_width, rev.design_height].filter(Boolean).join('×')} mm | 取数: {rev.cavity_count || '—'}
                        </div>

                        <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 2, borderTop: '1px dashed var(--border-default)', paddingTop: 4 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>📝 {rev.change_summary || '変更メモなし'}</span>
                            <span>{rev.created_at?.slice(0, 10) || '—'}</span>
                          </div>
                          {rev.plastic_type_designed && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span className="badge badge--info" style={{ fontSize: 8 }}>樹脂</span>
                              <span style={{ fontSize: 10, fontWeight: 600 }}>{rev.plastic_type_designed}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* STEP 2 RIGHT PANEL: Revision-Specific Physical Mold & Equipment Set List with Tabbed Category Filter */}
            {currentStep === 2 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Box size={13} style={{ color: 'var(--accent)' }} /> リビジョン連動設備・金型 ({filteredEquipmentsForRev.length} 件)
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>クリックで対象切り替え</span>
                </div>

                {/* Tabbed Category Filter */}
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {(['ALL', 'MOLD', 'CUTTER', 'WATER_BASE', 'PRESSURE_BASE', 'FRAME', 'PLUG'] as const).map(tabKey => {
                    const isSel = equipCategoryTab === tabKey
                    const theme = getEquipmentTypeTheme(tabKey === 'ALL' ? null : tabKey)

                    return (
                      <button
                        key={tabKey}
                        type="button"
                        onClick={() => setEquipCategoryTab(tabKey)}
                        style={{
                          fontSize: 9, padding: '2px 6px', borderRadius: 10, border: `1px solid ${isSel ? theme.borderColor : 'var(--border-default)'}`,
                          background: isSel ? theme.bg : 'var(--bg-surface)', color: isSel ? theme.color : 'var(--text-secondary)', cursor: 'pointer'
                        }}
                      >
                        {theme.labelJA}
                      </button>
                    )
                  })}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {filteredEquipmentsForRev.map(eq => {
                    const isSelected = eq.id === activeEquipId
                    const theme = getEquipmentTypeTheme(eq.type)

                    return (
                      <div
                        key={eq.id}
                        onClick={() => handleSelectEquipment(eq)}
                        className="card-flat"
                        style={{
                          padding: 8, background: isSelected ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--bg-surface)',
                          border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-default)',
                          fontSize: 11, display: 'flex', flexDirection: 'column', gap: 3, cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <EquipmentTypeIcon type={eq.type} size={13} />
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: theme.color }}>{eq.code}</span>
                          </div>
                          <span className="badge badge--success" style={{ fontSize: 9 }}>{eq.status}</span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-primary)', fontWeight: 600 }}>{eq.name}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                          <span>ラック: {eq.rack}</span>
                          <span>保管: {eq.keeper}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* STEP 3 RIGHT PANEL: Equipment-Specific Jobs History */}
            {currentStep === 3 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Wrench size={13} style={{ color: 'var(--accent)' }} /> 選択設備の加工ジョブ履歴 ({jobsForEquip.length} 件)
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>クリックで編集</span>
                </div>

                {jobsForEquip.length === 0 ? (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>— この設備の加工ジョブ履歴はありません —</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {jobsForEquip.map(job => (
                      <div
                        key={job.job_id}
                        onClick={() => handleSelectExistingJob(job)}
                        className="card-flat"
                        style={{
                          padding: 8, background: editingJobId === job.job_id ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--bg-surface)',
                          border: editingJobId === job.job_id ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                          fontSize: 11, display: 'flex', flexDirection: 'column', gap: 3, cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{job.job_code}</span>
                          <span className="badge badge--neutral" style={{ fontSize: 9 }}>{job.job_status || 'IN_PROGRESS'}</span>
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{job.job_name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>担当: {job.employees?.employee_name || '—'}</span>
                          <span>納期: {job.deadline ? job.deadline.substring(0, 10) : '—'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 4 RIGHT PANEL: Equipment & Job Specific Worklogs & Quick Add */}
            {currentStep === 4 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
                  <Clock size={13} style={{ color: 'var(--accent)' }} /> 選択ジョブの作業実績 ({worklogsForJob.length} 件)
                </div>

                {/* Quick Add Worklog Form */}
                <div className="card-flat" style={{ padding: 8, background: 'var(--bg-surface)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-primary)' }}>+ 作業実績の追加 (Quick Worklog)</span>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 6 }}>
                    <select className="form-input" style={{ fontSize: 10 }} value={newLogWorker} onChange={(e) => setNewLogWorker(e.target.value)}>
                      <option value="">作業者選択</option>
                      {employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.employee_name}</option>)}
                    </select>
                    <input type="number" className="form-input" style={{ fontSize: 10 }} placeholder="時間 (h)" value={newLogHours} onChange={(e) => setNewLogHours(e.target.value ? Number(e.target.value) : '')} />
                  </div>

                  <input type="text" className="form-input" style={{ fontSize: 10 }} placeholder="作業メモ..." value={newLogNotes} onChange={(e) => setNewLogNotes(e.target.value)} />

                  <button type="button" className="btn btn-secondary" onClick={handleAddWorklog} style={{ fontSize: 10, padding: '3px 8px', justifyContent: 'center' }}>
                    + 実績ログ追加
                  </button>
                </div>

                {/* Worklog List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {worklogsForJob.map((log, idx) => (
                    <div key={log.log_id || idx} style={{ padding: '6px 8px', background: 'var(--bg-surface)', borderRadius: 4, border: '1px solid var(--border-default)', fontSize: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                        <span>{log.employees?.employee_name || '作業者'}</span>
                        <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{log.hours_spent}h</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)' }}>{log.work_date || '今日'} — {log.notes}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

          </div>

        </div>

        {/* WIZARD NAVIGATION FOOTER */}
        <div style={{
          padding: '12px 20px', background: 'var(--bg-surface-2)', borderTop: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading} style={{ fontSize: 11 }}>
            キャンセル
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep((currentStep - 1) as any)}
                style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <ArrowLeft size={13} /> 前へ (Back)
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setCurrentStep((currentStep + 1) as any)}
                style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px' }}
              >
                次へ (Next Step) <ArrowRight size={13} />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSubmit()}
                disabled={loading}
                style={{ fontSize: 11, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
              >
                {loading ? <RefreshCw size={14} className="spin" /> : <Save size={14} />} 💾 全一括保存実行 (Save Package)
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
