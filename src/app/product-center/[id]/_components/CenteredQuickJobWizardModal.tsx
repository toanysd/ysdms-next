'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { createQuickMoldJobWorkflow, QuickMoldJobStepInput } from '@/app/actions/quick-mold-job'
import {
  X, Sparkles, PenTool, Box, Wrench, Clock, Save, RefreshCw,
  Plus, Trash2, CheckCircle2, AlertTriangle, Layers, Calendar, User, Zap,
  ArrowLeft, ArrowRight, Check, History, ExternalLink, Pencil, FileText, PlusCircle
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
  cavity_pitch_mm: number | null
  machine_feed_pitch_mm: number | null
  plug_type: string | null
  customer_tray_name: string | null
  parent_design_id: string | null
  design_category: string | null
}

interface EquipmentData {
  id: string
  code: string
  name: string
  type: string
  status: string
  rack: string
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
  { step: 1, title: 'CAD仕様 Hub', desc: 'CAD仕様 & リビジョン履歴', icon: PenTool },
  { step: 2, title: '物理金型 Hub', desc: '金型情報 & 設備リスト', icon: Box },
  { step: 3, title: 'ジョブ指示 Hub', desc: 'ジョブ作成 & 既存ジョブ履歴', icon: Wrench },
  { step: 4, title: '工程・作業ログ Hub', desc: '工程Kit & 作業実績ログ', icon: Clock },
] as const

export function CenteredQuickJobWizardModal({
  isOpen,
  mode,
  subMode = 'NEXT_MASS',
  productId,
  selectedRev,
  targetEquipment,
  onClose,
  onSuccess,
}: CenteredQuickJobWizardModalProps) {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)

  // Master Data States
  const [companies, setCompanies] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  // Existing Context History Data
  const [existingRevisions, setExistingRevisions] = useState<any[]>([])
  const [existingMolds, setExistingMolds] = useState<any[]>([])
  const [existingJobs, setExistingJobs] = useState<any[]>([])
  const [existingWorklogs, setExistingWorklogs] = useState<any[]>([])
  const [editingJobId, setEditingJobId] = useState<string | null>(null)

  // Form States - Step 1: Customer & Product & CAD
  const [companyId, setCompanyId] = useState('')
  const [productCode, setProductCode] = useState('')
  const [productName, setProductName] = useState('')
  const [customerProductName, setCustomerProductName] = useState('')
  const [plasticType, setPlasticType] = useState('PET 0.5t')
  const [designCode, setDesignCode] = useState('')
  const [designLength, setDesignLength] = useState<number | ''>('')
  const [designWidth, setDesignWidth] = useState<number | ''>('')
  const [designHeight, setDesignHeight] = useState<number | ''>('')
  const [designDepth, setDesignDepth] = useState<number | ''>('')
  const [cutlineLength, setCutlineLength] = useState<number | ''>('')
  const [cutlineWidth, setCutlineWidth] = useState<number | ''>('')
  const [cavityCount, setCavityCount] = useState<number | ''>('')
  const [plugType, setPlugType] = useState('')

  // Form States - Step 2: Physical Mold
  const [systemCode, setSystemCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [physicalStamp, setPhysicalStamp] = useState('')

  // Form States - Step 3: Job Directive
  const [jobCode, setJobCode] = useState('')
  const [jobName, setJobName] = useState('新規本型加工')
  const [jobTypeId, setJobTypeId] = useState('1')
  const [responsibleId, setResponsibleId] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10))
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')

  // Form States - Step 4: Components & Worklogs
  const [steps, setSteps] = useState<QuickMoldJobStepInput[]>([
    { step_no: 1, step_name: '金型', type_code: 'MOLD', material_spec: 'A5052', quantity: 1, arrangement: 'REQUIRED', condition: 'NEW', manufacture_location: 'IN_HOUSE' },
    { step_no: 2, step_name: 'プラグ', type_code: 'PLUG', material_spec: 'ベニヤ木板', quantity: 1, arrangement: 'REQUIRED', condition: 'NEW', manufacture_location: 'IN_HOUSE' }
  ])

  // New Worklog Quick Input Form
  const [newLogWorker, setNewLogWorker] = useState('')
  const [newLogHours, setNewLogHours] = useState<number | ''>('')
  const [newLogNotes, setNewLogNotes] = useState('')

  // Load Existing Reference Data for Domain Panels
  const loadDomainReferences = useCallback(async () => {
    if (!productId) return

    // 1. Existing Revisions
    const { data: revs } = await supabase
      .from('design_revisions')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    if (revs) setExistingRevisions(revs)

    // 2. Existing Molds & Equipment
    const { data: equip } = await supabase
      .from('equipment')
      .select('*, rack_layers(layer_code, racks(rack_code))')
      .order('created_at', { ascending: false })
      .limit(30)
    if (equip) setExistingMolds(equip)

    // 3. Existing Jobs
    const { data: jobsList } = await supabase
      .from('jobs')
      .select('*, employees(employee_name)')
      .order('created_at', { ascending: false })
      .limit(20)
    if (jobsList) setExistingJobs(jobsList)

    // 4. Existing Worklogs
    const { data: logs } = await supabase
      .from('work_logs')
      .select('*, employees(employee_name)')
      .order('work_date', { ascending: false })
      .limit(20)
    if (logs) setExistingWorklogs(logs)
  }, [productId, supabase])

  // Initial Data Loader
  useEffect(() => {
    if (!isOpen) return
    setError(null)
    setCurrentStep(mode === 'CREATE_JOB' ? 3 : mode === 'CREATE_MOLD' ? 2 : 1)

    async function loadInitialData() {
      // Load Masters
      const [empRes, compRes] = await Promise.all([
        supabase.from('employees').select('employee_id, employee_name').order('employee_name').limit(50),
        supabase.from('companies').select('company_id, company_name, company_code').order('company_name').limit(50)
      ])
      if (empRes.data) setEmployees(empRes.data)
      if (compRes.data) setCompanies(compRes.data)

      // Fetch product info
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
          setPlasticType(prod.primary_plastic_code || 'PET 0.5t')
          if (prod.companies) setCompanyId(prod.companies.company_id)
        }
      }

      // Pre-fill design code & CAD specs
      if (selectedRev) {
        const baseCode = selectedRev.design_code || 'REV'
        let newCode = baseCode

        if (subMode === 'NEXT_MASS') {
          const nextNum = (selectedRev.revision_number || 0) + 1
          const cleanBase = baseCode.replace(/R\d+$/, '').replace(/DR\d+$/, '')
          newCode = `${cleanBase}R${nextNum}`
        } else if (subMode === 'PROTO_FROM_MASS') {
          const cleanBase = baseCode.replace(/R\d+$/, '').replace(/DR\d+$/, '')
          newCode = `${cleanBase}DR1`
        } else if (subMode === 'PROTO_SUCCESSION') {
          const cleanBase = baseCode.replace(/R\d+$/, '').replace(/DR\d+$/, '')
          newCode = `${cleanBase}DR2`
        } else if (subMode === 'PROMOTE_TO_MASS') {
          const cleanBase = baseCode.replace(/R\d+$/, '').replace(/DR\d+$/, '')
          newCode = `${cleanBase}R1`
        }

        setDesignCode(newCode)
        setDesignLength(selectedRev.design_length || '')
        setDesignWidth(selectedRev.design_width || '')
        setDesignHeight(selectedRev.design_height || '')
        setDesignDepth(selectedRev.design_depth || '')
        setCutlineLength(selectedRev.cutline_length || '')
        setCutlineWidth(selectedRev.cutline_width || '')
        setCavityCount(selectedRev.cavity_count || '')
        setPlugType(selectedRev.plug_type || '')

        // Pre-fill Mold code
        setSystemCode(`${newCode} #1`)
        setDisplayName(`${newCode} 金型 #1`)
        setPhysicalStamp(newCode)

        // Pre-fill Job code
        setJobCode(`J-${newCode}`)
        if (mode === 'CREATE_JOB') {
          setJobName('金型改造・保守')
          setJobTypeId('2')
        } else {
          setJobName('新規本型加工')
          setJobTypeId('1')
        }
      }

      if (targetEquipment) {
        setSystemCode(targetEquipment.code)
        setDisplayName(targetEquipment.name)
        setJobCode(`J-${targetEquipment.code}`)
      }

      await loadDomainReferences()
    }

    loadInitialData()
  }, [isOpen, productId, selectedRev, targetEquipment, mode, subMode, supabase, loadDomainReferences])

  if (!isOpen) return null

  // 1-Click Select Existing Job to Edit / Use as Naming Reference
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

    setExistingWorklogs(prev => [newLog, ...prev])
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
        primary_plastic_code: plasticType || null,

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
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                ⚡ 統合業務データセンター Wizard (Centered Domain Operations Hub)
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                フォーム入力 (左) と リアルタイム業務履歴・参照パネル (右) を備えた統合ハブ
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

        {/* DOMAIN HUB SPLIT CONTAINER (Left 62% Form vs Right 38% Business Reference) */}
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
                  <span className="badge badge--info" style={{ fontSize: 10 }}>1 / 4 Hub</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
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
                    <label className="form-label">樹脂材料 (Plastic Material)</label>
                    <input type="text" className="form-input" value={plasticType} onChange={(e) => setPlasticType(e.target.value)} />
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
              </>
            )}

            {/* STEP 2: Physical Mold & Equipment Set Kit */}
            {currentStep === 2 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Box size={16} style={{ color: 'var(--accent)' }} /> STEP 2: 物理金型・刻印 & 構成部品 Kit 設定
                  </span>
                  <span className="badge badge--info" style={{ fontSize: 10 }}>2 / 4 Hub</span>
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

                {/* Kit Composition Toggles */}
                <div style={{ border: '1px solid var(--border-default)', borderRadius: 8, padding: 14, background: 'var(--bg-surface-2)', marginTop: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'block' }}>
                    構成部品・補助設備 Kit 一括追加 (Add Auxiliary Equipment Set)
                  </span>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => handleAddComponentStep('PLUG', 'プラグ', 'ベニヤ木板')} style={{ fontSize: 11, padding: '4px 10px' }}>+ PLUG (プラグ)</button>
                    <button type="button" className="btn btn-secondary" onClick={() => handleAddComponentStep('CUTTER', '抜型', 'SKD11')} style={{ fontSize: 11, padding: '4px 10px' }}>+ CUTTER (抜型)</button>
                    <button type="button" className="btn btn-secondary" onClick={() => handleAddComponentStep('WATER_BASE', '水冷盤', 'A5052')} style={{ fontSize: 11, padding: '4px 10px' }}>+ WATER_BASE (水冷盤)</button>
                    <button type="button" className="btn btn-secondary" onClick={() => handleAddComponentStep('PRESSURE_BASE', '圧空盤', 'SS400')} style={{ fontSize: 11, padding: '4px 10px' }}>+ PRESSURE_BASE (圧空盤)</button>
                    <button type="button" className="btn btn-secondary" onClick={() => handleAddComponentStep('FRAME', 'フレーム', 'SS400')} style={{ fontSize: 11, padding: '4px 10px' }}>+ FRAME (フレーム)</button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 3: Job Directive & Assignee */}
            {currentStep === 3 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Wrench size={16} style={{ color: 'var(--accent)' }} /> STEP 3: ジョブ指示 & 担当者・スケジュール
                  </span>
                  <span className="badge badge--info" style={{ fontSize: 10 }}>3 / 4 Hub</span>
                </div>

                {editingJobId && (
                  <div style={{ padding: '6px 10px', background: 'color-mix(in srgb, var(--accent) 10%, transparent)', border: '1px solid var(--accent)', borderRadius: 6, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>✏️ 既存ジョブ編集モード: <strong>{jobCode}</strong> ({jobName})</span>
                    <button type="button" onClick={() => { setEditingJobId(null); setJobCode(`J-${designCode}`); setJobName('新規本型加工') }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontWeight: 700 }}>
                      + 新規ジョブ作成に戻る
                    </button>
                  </div>
                )}

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

            {/* STEP 4: Processing Kit & Steps Table */}
            {currentStep === 4 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={16} style={{ color: 'var(--accent)' }} /> STEP 4: 構成部品 Kit・加工工程スケジュール ({steps.length} items)
                  </span>
                  <span className="badge badge--info" style={{ fontSize: 10 }}>4 / 4 Hub</span>
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

          {/* RIGHT COLUMN: DOMAIN BUSINESS REFERENCE & EXISTING HISTORY PANEL */}
          <div style={{ overflowY: 'auto', padding: 16, background: 'var(--bg-surface-2)', display: 'flex', flexDirection: 'column', gap: 12 }}>

            {/* STEP 1 RIGHT PANEL: Existing Revisions History */}
            {currentStep === 1 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
                  <History size={13} style={{ color: 'var(--accent)' }} /> 既存図面・リビジョン全景 ({existingRevisions.length} 件)
                </div>

                {existingRevisions.length === 0 ? (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>— リビジョン履歴はありません —</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {existingRevisions.map(rev => (
                      <div key={rev.revision_id} className="card-flat" style={{ padding: 8, background: 'var(--bg-surface)', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{rev.design_code}</span>
                          <span className="badge badge--neutral" style={{ fontSize: 9 }}>Rev.{rev.revision_number}</span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
                          外寸: {[rev.design_length, rev.design_width, rev.design_height].filter(Boolean).join('×')} mm | 取数: {rev.cavity_count || '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 2 RIGHT PANEL: Existing Physical Molds & Equipment */}
            {currentStep === 2 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
                  <Box size={13} style={{ color: 'var(--accent)' }} /> 既存の物理金型・設備リスト ({existingMolds.length} 件)
                </div>

                {existingMolds.length === 0 ? (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>— 物理設備はありません —</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {existingMolds.slice(0, 10).map(eq => (
                      <div key={eq.equipment_id} className="card-flat" style={{ padding: 8, background: 'var(--bg-surface)', fontSize: 11, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{eq.equipment_code}</span>
                          <span className="badge badge--success" style={{ fontSize: 9 }}>{eq.usage_status || 'IN_STOCK'}</span>
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{eq.display_name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* STEP 3 RIGHT PANEL: Existing Jobs History (Click to edit or reference naming!) */}
            {currentStep === 3 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Wrench size={13} style={{ color: 'var(--accent)' }} /> 既存加工ジョブ全景 ({existingJobs.length} 件)
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>クリックで編集/命名参照</span>
                </div>

                {existingJobs.length === 0 ? (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>— 加工ジョブはありません —</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {existingJobs.map(job => (
                      <div
                        key={job.job_id}
                        onClick={() => handleSelectExistingJob(job)}
                        className="card-flat"
                        style={{
                          padding: 8, background: editingJobId === job.job_id ? 'color-mix(in srgb, var(--accent) 12%, transparent)' : 'var(--bg-surface)',
                          border: editingJobId === job.job_id ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                          fontSize: 11, display: 'flex', flexDirection: 'column', gap: 3, cursor: 'pointer', transition: 'all 0.12s ease'
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

            {/* STEP 4 RIGHT PANEL: Machining Worklogs History & Quick Add */}
            {currentStep === 4 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border-default)', paddingBottom: 6 }}>
                  <Clock size={13} style={{ color: 'var(--accent)' }} /> 作業実績ログ ({existingWorklogs.length} 件)
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

                {/* Log List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {existingWorklogs.map((log, idx) => (
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
                {loading ? <RefreshCw size={14} className="spin" /> : <Save size={14} />} 💾 一括保存実行 (Save Package)
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
