'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import {
  ArrowLeft,
  ArrowUpFromLine,
  Search,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Box,
  Layers,
  Wrench,
  PenTool,
  Clock,
  Hammer,
  HelpCircle,
  Sparkles,
  ChevronDown,
  X,
  History,
  FileSpreadsheet,
  PlusCircle,
  ChevronRight,
  Pencil
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  getQuickMoldJobData,
  createQuickMoldJobWorkflow,
  updateQuickMoldJobWorkflow,
  QuickMoldJobInput,

  QuickMoldJobStepInput
} from '@/app/actions/quick-mold-job'
import { QuickMoldJobConfirmModal } from '@/components/equipment/QuickMoldJobConfirmModal'
import { RealtimeReferencePanel } from '@/components/equipment/RealtimeReferencePanel'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'
import { UnsavedChangesModal } from '@/components/ui/UnsavedChangesModal'
import { WorklogEditModal, WorklogModalData } from '@/components/equipment/WorklogEditModal'
import { ManufacturingSheetOCRModal } from '@/components/ocr/ManufacturingSheetOCRModal'

type Company = {
  company_id: string
  company_name: string
  company_code: string
}

type Employee = {
  employee_id: string
  employee_name: string
}

type JobType = {
  job_type_id: string
  job_type_name_ja: string
  job_type_name_vi?: string
}

type ProcessingCode = {
  processing_code_id: number
  processing_name: string
  category: string
}

type PlasticMaster = {
  plastic_id: string
  plastic_code: string
  plastic_family: string
  thickness_mm?: number | null
}

// Compact & Hyphenated variant generator (e.g. JAE359 <-> JAE-359)
function getSearchVariants(term: string): string[] {
  const raw = term.trim()
  if (!raw) return []
  const compact = raw.replace(/[-_\s]/g, '')
  let hyphenated = raw
  if (/^[A-Za-z]+\d+$/.test(compact)) {
    hyphenated = compact.replace(/^([A-Za-z]+)(\d+)$/, '$1-$2')
  }
  const set = new Set([raw, compact, hyphenated])
  return Array.from(set)
}

function autoMatchPlastic(text: string, masters: PlasticMaster[]): PlasticMaster | null {
  if (!text || masters.length === 0) return null
  const familyMatch = text.match(/(PET|PP|PS|PVC|ABS|HIPS|OPS|A-PET)/i)
  const thicknessMatch = text.match(/(\d+\.?\d*)\s*(?:mm|t)/i)
  if (!familyMatch) return null
  const family = familyMatch[1].toUpperCase()
  const thick = thicknessMatch ? parseFloat(thicknessMatch[1]) : null

  // 1. Try matching both family and thickness
  if (thick != null) {
    const exact = masters.find(pm => 
      pm.plastic_family?.toUpperCase().includes(family) && 
      Math.abs((pm.thickness_mm || 0) - thick) < 0.05
    )
    if (exact) return exact
  }

  // 2. Try matching family only
  const famMatch = masters.find(pm => pm.plastic_family?.toUpperCase().includes(family))
  return famMatch || null
}

// ── Standard Default Job Types (Includes Equipment & Tooling Job Types) ──
const DEFAULT_JOB_TYPES: JobType[] = [
  { job_type_id: '1', job_type_name_ja: '新規金型' },
  { job_type_id: '2', job_type_name_ja: '金型改造' },
  { job_type_id: '3', job_type_name_ja: '新規抜型' },
  { job_type_id: '4', job_type_name_ja: '金型メンテナンス' },
  { job_type_id: '5', job_type_name_ja: '新規水冷盤' },
  { job_type_id: '6', job_type_name_ja: '新規圧空盤' },
  { job_type_id: '7', job_type_name_ja: '新規枠・受け盤' },
  { job_type_id: '8', job_type_name_ja: '設備修理・清掃' },
  { job_type_id: '9', job_type_name_ja: 'その他' }
]

// ── Derive job_category from job_type_id for conditional form sections ──
const JOB_TYPE_TO_CATEGORY: Record<string, string> = {
  '1': 'MOLD_NEW',
  '2': 'MOLD_MODIFY',
  '3': 'CUTTER_NEW',
  '4': 'MAINTENANCE',
  '5': 'EQUIPMENT_NEW',
  '6': 'EQUIPMENT_NEW',
  '7': 'EQUIPMENT_NEW',
  '8': 'EQUIPMENT_REPAIR',
  '9': 'OTHER',
  '10': 'OTHER',
}

// Categories that require Product/Design/PhysicalMold sections (1-3)
const CATEGORIES_NEEDING_PRODUCT_DESIGN_MOLD = new Set([
  'MOLD_NEW', 'MOLD_MODIFY', 'CUTTER_NEW',
])

// ── Standard Presets for Quick Add Mold Kit Components ──
const COMPONENT_CHIPS = [
  { type_code: 'MOLD', labelJA: 'MOLD (本型)' },
  { type_code: 'PLUG', labelJA: 'PLUG (プラグ)' },
  { type_code: 'CUTTER', labelJA: 'CUTTER (抜型)' },
  { type_code: 'WATER_BASE', labelJA: '水冷ベース' },
  { type_code: 'PRESSURE_BASE', labelJA: '圧空ベース' },
  { type_code: 'STAKING', labelJA: '熱かしめ' },
  { type_code: 'FRAME', labelJA: '枠 (フレーム)' },
]

// ── Preset Workflows ──
const PRESET_WORKFLOWS = {
  NEW_MOLD: {
    labelJA: '本型新規',
    steps: [
      { step_no: 1, step_name: '金型設計&加工', estimated_hours: null },
      { step_no: 2, step_name: '本型穴あけ', estimated_hours: null },
      { step_no: 3, step_name: '本型マシニング', estimated_hours: null },
      { step_no: 4, step_name: '本型磨き', estimated_hours: null },
      { step_no: 5, step_name: '本型検査&試作', estimated_hours: null },
    ]
  },
  MODIFY_MOLD: {
    labelJA: '金型改造',
    steps: [
      { step_no: 1, step_name: '改造設計', estimated_hours: null },
      { step_no: 2, step_name: '追加マシニング', estimated_hours: null },
      { step_no: 3, step_name: '修正磨き', estimated_hours: null },
    ]
  },
  PROTOTYPE: {
    labelJA: '試作金型',
    steps: [
      { step_no: 1, step_name: '簡易型マシニング', estimated_hours: null },
      { step_no: 2, step_name: '試作穴あけ', estimated_hours: null },
      { step_no: 3, step_name: '成形試作', estimated_hours: null },
    ]
  }
}

export default function QuickCreateMoldJobPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editJobIdParam = searchParams.get('editJobId')
  const productIdParam = searchParams.get('product_id')
  const locale = useLocale()
  const tText = useCallback((vi: string, ja: string) => locale === 'vi' ? vi : ja, [locale])
  const t = useTranslations('Equipment.QuickCreate')
  const tCommon = useTranslations('Common')
  const tEquipment = useTranslations('Equipment')
  const supabase = createClient()

  // Masters
  const [companies, setCompanies] = useState<Company[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [jobTypes, setJobTypes] = useState<JobType[]>(DEFAULT_JOB_TYPES)
  const [processingCodes, setProcessingCodes] = useState<ProcessingCode[]>([])
  const [plasticMasters, setPlasticMasters] = useState<PlasticMaster[]>([])
  const [loadingMasters, setLoadingMasters] = useState(true)

  // Edit Mode state
  const [editJobId, setEditJobId] = useState<string | null>(null)
  const [loadingJobData, setLoadingJobData] = useState(false)
  const [initialLoadedData, setInitialLoadedData] = useState<any | null>(null)
  const [workLogs, setWorkLogs] = useState<any[]>([])

  // Top Search Bar for Edit Mode & History Hook
  const [jobSearchQuery, setJobSearchQuery] = useState('')
  const [jobSearchResults, setJobSearchResults] = useState<any[]>([])
  const [isJobSearchOpen, setIsJobSearchOpen] = useState(false)
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false)
  const { history: searchHistory, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('quick_create_job_search')
  const jobSearchRef = useRef<HTMLDivElement>(null)

  // Step 1: Customer & Product Master
  const [companyId, setCompanyId] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const comboboxRef = useRef<HTMLDivElement>(null)

  // Product Combobox State
  const [productCode, setProductCode] = useState('')
  const [customerProductName, setCustomerProductName] = useState('')
  const [productName, setProductName] = useState('')
  const [primaryPlasticCode, setPrimaryPlasticCode] = useState('')
  const [plasticTypeDesigned, setPlasticTypeDesigned] = useState('')
  const [plasticId, setPlasticId] = useState('')
  const [productSearchResults, setProductSearchResults] = useState<any[]>([])
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
  const [productHighlightedIndex, setProductHighlightedIndex] = useState(0)
  const productComboboxRef = useRef<HTMLDivElement>(null)

  // Step 2: CAD Design Specs
  const [designCode, setDesignCode] = useState('')
  const [designLength, setDesignLength] = useState('')
  const [designWidth, setDesignWidth] = useState('')
  const [designHeight, setDesignHeight] = useState('')
  const [designDepth, setDesignDepth] = useState('')
  const [cavityCount, setCavityCount] = useState('')
  const [cutlineLength, setCutlineLength] = useState('')
  const [cutlineWidth, setCutlineWidth] = useState('')
  const [cornerR, setCornerR] = useState('')
  const [chamferC, setChamferC] = useState('')
  const [orientation, setOrientation] = useState('1. 下型')
  const [setupType, setSetupType] = useState('1. 普通')
  const [draftAngle, setDraftAngle] = useState('')
  const [underDepth, setUnderDepth] = useState('')
  const [undercutSpec, setUndercutSpec] = useState('')
  const [textContent, setTextContent] = useState('')
  const [plugType, setPlugType] = useState('')
  const [hasSeparateCutter, setHasSeparateCutter] = useState(false)
  const [pocketPrototype, setPocketPrototype] = useState('')

  // Step 3: Physical Mold
  const [systemCode, setSystemCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [physicalStamp, setPhysicalStamp] = useState('')

  // Step 4: Job Directive
  const [jobCode, setJobCode] = useState('')
  const [jobName, setJobName] = useState('新規本型加工')
  const [jobTypeId, setJobTypeId] = useState('1')
  const [responsibleId, setResponsibleId] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().substring(0, 10))
  const [deadline, setDeadline] = useState('')
  const [shipDate, setShipDate] = useState('')
  const [priceQuoteRequired, setPriceQuoteRequired] = useState(true)
  const [unitPrice, setUnitPrice] = useState('')
  const [notes, setNotes] = useState('')

  // Step 5 & 6: Unified Job Components (= job_steps)
  // Each component can have both component info (type_code, material_spec...) AND processing info (estimated_hours, assigned_to...)
  const [steps, setSteps] = useState<QuickMoldJobStepInput[]>([
    { step_no: 1, step_name: '金型', type_code: 'MOLD', material_spec: 'A5052', quantity: 1, arrangement: 'REQUIRED', condition: 'NEW', manufacture_location: 'IN_HOUSE' },
    { step_no: 2, step_name: 'プラグ', type_code: 'PLUG', material_spec: 'ベニヤ木板', quantity: 1, arrangement: 'REQUIRED', condition: 'NEW', manufacture_location: 'IN_HOUSE' }
  ])
  const [selectedStepNo, setSelectedStepNo] = useState<number | null>(null)

  // Confirmation Modal & Saving State
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [createdResult, setCreatedResult] = useState<{ jobId: string; moldId: string; isEdit?: boolean } | null>(null)

  // Worklog Edit Modal state
  const [isWorklogModalOpen, setIsWorklogModalOpen] = useState(false)
  const [editingWorklog, setEditingWorklog] = useState<WorklogModalData | null>(null)

  // Exit Confirmation Modal state
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false)
  const [pendingExitAction, setPendingExitAction] = useState<('back' | 'up' | 'cancel' | { type: 'loadJob'; id: string }) | null>(null)

  // ── Dirty state checking ──
  const checkIsDirty = useCallback(() => {
    if (!initialLoadedData) {
      return !!(companyId || productCode || jobCode || designCode || steps.length > 2)
    }
    if (productCode !== (initialLoadedData.product_code || '')) return true
    if (productName !== (initialLoadedData.product_name || '')) return true
    if (customerProductName !== (initialLoadedData.customer_product_name || '')) return true
    if (designCode !== (initialLoadedData.design_code || '')) return true
    if (designLength !== (initialLoadedData.design_length || '')) return true
    if (designWidth !== (initialLoadedData.design_width || '')) return true
    if (designHeight !== (initialLoadedData.design_height || '')) return true
    if (jobCode !== (initialLoadedData.job_code || '')) return true
    if (jobName !== (initialLoadedData.job_name || '')) return true
    if (deadline !== (initialLoadedData.deadline || '')) return true
    if (unitPrice !== (initialLoadedData.unit_price || '')) return true
    return false
  }, [
    initialLoadedData, companyId, productCode, productName, customerProductName,
    primaryPlasticCode, designCode, designLength, designWidth, designHeight,
    jobCode, jobName, deadline, unitPrice, steps
  ])

  // ── Navigation Exit Intercept Handlers ──
  const handleNavigateExit = (action: 'back' | 'up' | 'cancel' | { type: 'loadJob'; id: string }) => {
    if (checkIsDirty()) {
      setPendingExitAction(action)
      setShowExitConfirmModal(true)
    } else {
      executeExitAction(action)
    }
  }

  const executeExitAction = (action: 'back' | 'up' | 'cancel' | { type: 'loadJob'; id: string }) => {
    if (typeof action === 'string') {
      if (action === 'back') router.back()
      else if (action === 'up' || action === 'cancel') router.push('/equipment/jobs')
    } else if (action?.type === 'loadJob') {
      loadJobForEditing(action.id)
    }
  }

  const handleSaveAndExit = () => {
    setShowExitConfirmModal(false)
    // Trigger submit modal to save package
    setShowConfirmModal(true)
  }

  const handleDiscardAndExit = () => {
    setShowExitConfirmModal(false)
    if (pendingExitAction) {
      executeExitAction(pendingExitAction)
      setPendingExitAction(null)
    }
  }

  // ── Worklog CRUD Handlers ──
  const handleOpenWorklogModal = (log?: any) => {
    if (log) {
      setEditingWorklog({
        log_id: log.log_id,
        work_date: log.work_date,
        employee_id: log.employee_id,
        job_step_id: log.job_step_id || '',
        hours_spent: log.hours_spent,
        processing_code_id: log.processing_code_id,
        is_finished: log.is_finished,
        notes: log.notes || log.description || ''
      })
    } else {
      setEditingWorklog(null)
    }
    setIsWorklogModalOpen(true)
  }

  const handleSaveWorklog = async (data: WorklogModalData) => {
    if (editJobId) {
      let stepIdToUse = data.job_step_id
      const matchedStep = steps.find(s => s.step_id === data.job_step_id || String(s.step_no) === data.job_step_id)
      if (matchedStep?.step_id) {
        stepIdToUse = matchedStep.step_id
      }

      const payload = {
        job_id: editJobId,
        job_step_id: stepIdToUse || null,
        employee_id: data.employee_id,
        work_date: data.work_date,
        hours_spent: Number(data.hours_spent),
        processing_code_id: data.processing_code_id || null,
        is_finished: data.is_finished || false,
        notes: data.notes || null
      }

      let res
      if (data.log_id && !data.log_id.startsWith('temp_')) {
        res = await supabase.from('work_logs').update(payload).eq('log_id', data.log_id)
      } else {
        res = await supabase.from('work_logs').insert(payload)
      }

      if (res.error) {
        throw new Error(res.error.message)
      }

      // Re-fetch worklogs from DB
      const { data: logs } = await supabase
        .from('work_logs')
        .select('*, employees(employee_name), job_step:job_step_id(step_id, step_no, step_name, track), processing_codes:processing_code_id(processing_name)')
        .eq('job_id', editJobId)
        .order('work_date', { ascending: false })

      if (logs) setWorkLogs(logs)
    } else {
      // Local state mutation for Create Mode
      const matchedStep = steps.find(s => s.step_id === data.job_step_id || String(s.step_no) === data.job_step_id)
      const empObj = employees.find(e => e.employee_id === data.employee_id)
      const procObj = processingCodes.find(p => p.processing_code_id === data.processing_code_id)

      const localLog = {
        log_id: data.log_id || `temp_${Date.now()}`,
        work_date: data.work_date,
        employee_id: data.employee_id,
        job_step_id: matchedStep?.step_id || null,
        hours_spent: Number(data.hours_spent),
        processing_code_id: data.processing_code_id || null,
        is_finished: data.is_finished || false,
        notes: data.notes || '',
        employees: empObj ? { employee_name: empObj.employee_name } : null,
        job_step: matchedStep ? { step_id: matchedStep.step_id, step_no: matchedStep.step_no, step_name: matchedStep.step_name, track: matchedStep.type_code, type_code: matchedStep.type_code } : null,
        processing_codes: procObj ? { processing_name: procObj.processing_name } : null
      }

      if (data.log_id) {
        setWorkLogs(prev => prev.map(l => l.log_id === data.log_id ? localLog : l))
      } else {
        setWorkLogs(prev => [localLog, ...prev])
      }
    }
  }

  const handleDeleteWorklog = async (logId: string) => {
    if (!confirm(t('confirmDeleteWorkLog'))) return

    if (editJobId && !logId.startsWith('temp_')) {
      const { error } = await supabase.from('work_logs').delete().eq('log_id', logId)
      if (error) {
        alert(`${t('errDeleteWorklog')}: ${error.message}`)
        return
      }
      setWorkLogs(prev => prev.filter(l => l.log_id !== logId))
    } else {
      setWorkLogs(prev => prev.filter(l => l.log_id !== logId))
    }
  }

  // Fetch Master Data (Employees, JobTypes, ProcessingCodes)
  useEffect(() => {
    async function loadMasters() {
      setLoadingMasters(true)
      const [empRes, jtRes, procRes, plasticRes] = await Promise.all([
        supabase.from('employees').select('employee_id, employee_name').order('employee_name').limit(100),
        supabase.from('job_types').select('job_type_id, job_type_name_ja, job_type_name_vi').order('sort_order'),
        supabase.from('processing_codes').select('processing_code_id, processing_name, category').order('processing_code_id'),
        supabase.from('plastic_master').select('plastic_id, plastic_code, plastic_family, thickness_mm').order('plastic_code')
      ])

      if (empRes.data) setEmployees(empRes.data)
      if (jtRes.data && jtRes.data.length > 0) {
        const dbTypes = jtRes.data as unknown as JobType[]
        const mergedMap = new Map<string, JobType>()
        dbTypes.forEach(jt => mergedMap.set(jt.job_type_id, jt))
        DEFAULT_JOB_TYPES.forEach(djt => {
          const existsByName = Array.from(mergedMap.values()).some(x => x.job_type_name_ja === djt.job_type_name_ja)
          if (!existsByName && !mergedMap.has(djt.job_type_id)) {
            mergedMap.set(djt.job_type_id, djt)
          }
        })
        setJobTypes(Array.from(mergedMap.values()))
      } else {
        setJobTypes(DEFAULT_JOB_TYPES)
      }
      if (procRes.data) setProcessingCodes(procRes.data as ProcessingCode[])
      if (plasticRes.data) setPlasticMasters(plasticRes.data as PlasticMaster[])
      setLoadingMasters(false)
    }
    loadMasters()
  }, [supabase])

  // Realtime Debounced Server-Side Company Query (Fixes limit 150 cutoff across 1,991+ DB records)
  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = customerSearch.trim()
      let req = supabase
        .from('companies')
        .select('company_id, company_name, company_code')
        .order('company_name')
        .limit(40)

      if (query && !query.includes('(')) {
        req = supabase
          .from('companies')
          .select('company_id, company_name, company_code')
          .or(`company_name.ilike.%${query}%,company_code.ilike.%${query}%`)
          .order('company_name')
          .limit(40)
      }

      const { data: compList } = await req
      if (compList) {
        setCompanies(compList)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [customerSearch, supabase])

  // Realtime Debounced Product Query (Supports compact & hyphenated e.g. JAE359 vs JAE-359)
  useEffect(() => {
    const timer = setTimeout(async () => {
      const query = productCode.trim()
      if (!query) {
        setProductSearchResults([])
        return
      }

      const variants = getSearchVariants(query)
      const cond = variants.flatMap(v => [
        `product_code.ilike.%${v}%`,
        `product_name_internal.ilike.%${v}%`
      ]).join(',')

      const { data: prodList } = await supabase
        .from('products')
        .select('*, companies(company_id, company_name, company_code)')
        .or(cond)
        .limit(20)

      if (prodList) setProductSearchResults(prodList)
    }, 250)

    return () => clearTimeout(timer)
  }, [productCode, supabase])

  // ── Load Existing Job Data into Form (Edit Mode) ──
  const loadJobForEditing = useCallback(async (jobId: string) => {
    setLoadingJobData(true)
    const res = await getQuickMoldJobData(jobId)
    setLoadingJobData(false)

    if (res.success && res.job) {
      const j = res.job
      setEditJobId(j.job_id)

      // 1. Customer & Product Resolution (3-Level Fallback)
      const targetCompany = j.resolved_company || j.companies || j.products?.companies
      let loadedCustomerName = ''
      if (targetCompany) {
        setCompanyId(targetCompany.company_id)
        loadedCustomerName = `${targetCompany.company_name} (${targetCompany.company_code})`
        setCustomerSearch(loadedCustomerName)
        setCompanies(prev => {
          if (!prev.some(c => c.company_id === targetCompany.company_id)) {
            return [targetCompany, ...prev]
          }
          return prev
        })
      } else {
        const compId = j.company_id || j.products?.company_id || j.design_revisions?.company_id
        if (compId) setCompanyId(compId)
      }

      // Product
      const prodCode = j.products?.product_code || ''
      const prodName = j.products?.product_name || ''
      const custProdName = j.products?.customer_product_name || ''
      const plasticText = j.design_revisions?.plastic_type_designed || ''
      const pId = j.design_revisions?.plastic_id || ''
      setProductCode(prodCode)
      setProductName(prodName)
      setCustomerProductName(custProdName)
      setPlasticTypeDesigned(plasticText)
      setPlasticId(pId)

      if (pId) {
        const matched = plasticMasters.find(pm => pm.plastic_id === pId)
        if (matched) setPrimaryPlasticCode(matched.plastic_code)
      } else if (plasticText) {
        const auto = autoMatchPlastic(plasticText, plasticMasters)
        if (auto) {
          setPlasticId(auto.plastic_id)
          setPrimaryPlasticCode(auto.plastic_code)
        } else {
          setPrimaryPlasticCode('')
        }
      } else {
        setPrimaryPlasticCode('')
      }

      // Design Revision Specs
      const d = j.design_revisions || {}
      const desCode = d.design_code || ''
      const dLen = d.design_length?.toString() || ''
      const dWid = d.design_width?.toString() || ''
      const dHgt = d.design_height?.toString() || ''
      const dDep = d.design_depth?.toString() || ''
      const cav = d.cavity_count?.toString() || ''
      const cutL = d.cutline_length?.toString() || ''
      const cutW = d.cutline_width?.toString() || ''
      const cR = d.corner_r || ''
      const cC = d.chamfer_c || ''

      setDesignCode(desCode)
      setDesignLength(dLen)
      setDesignWidth(dWid)
      setDesignHeight(dHgt)
      setDesignDepth(dDep)
      setCavityCount(cav)
      setCutlineLength(cutL)
      setCutlineWidth(cutW)
      setCornerR(cR)
      setChamferC(cC)
      setOrientation(d.orientation || '1. 下型')
      setSetupType(d.setup_type || '1. 普通')
      setDraftAngle(d.draft_angle || '')
      setUnderDepth(d.under_depth || '')
      setUndercutSpec(d.undercut_spec || '')
      setTextContent(d.text_content || '')
      setPlugType(d.plug_type || '')
      setHasSeparateCutter(d.has_separate_cutter || false)
      if (d.change_summary?.includes('ポケット試作:')) {
        setPocketPrototype(d.change_summary.replace('ポケット試作:', '').trim())
      }

      // Physical Mold
      const m = j.physical_molds || {}
      const sysCode = m.system_code || ''
      const dispName = m.display_name || ''
      const stamp = m.physical_stamp || ''
      setSystemCode(sysCode)
      setDisplayName(dispName)
      setPhysicalStamp(stamp)

      // Job Directive
      const jCode = j.job_code || ''
      const jName = j.job_name || ''
      const jDead = j.deadline ? j.deadline.substring(0, 10) : ''
      const jPrice = j.unit_price?.toString() || ''
      setJobCode(jCode)
      setJobName(jName)
      setJobTypeId(j.job_type_id?.toString() || '1')
      setResponsibleId(j.responsible_id || '')
      setStartDate(j.start_date ? j.start_date.substring(0, 10) : '')
      setDeadline(jDead)
      setShipDate(j.ship_date ? j.ship_date.substring(0, 10) : '')
      setPriceQuoteRequired(j.price_quote_required || false)
      setUnitPrice(jPrice)
      setNotes(j.notes || '')

      // Load actual job_steps (= job components) from DB with full component fields
      if (j.job_steps && j.job_steps.length > 0) {
        setSteps(j.job_steps.map((s: any) => ({
          step_id: s.step_id,
          step_no: s.step_no,
          step_name: s.step_name,
          type_code: s.type_code || s.track || null,
          material_spec: s.material_spec || null,
          quantity: s.quantity || 1,
          arrangement: s.arrangement || null,
          condition: s.condition || null,
          manufacture_location: s.manufacture_location || null,
          estimated_hours: s.estimated_hours != null ? s.estimated_hours.toString() : '',
          assigned_to: s.assigned_to || s.assigned_employee_id || s.employee_id || '',
          deadline: s.deadline ? s.deadline.substring(0, 10) : null,
          notes: s.notes || null,
        })))
      } else {
        setSteps([])
      }

      // Fetch actual work_logs for this job with joined job_step (including track for component matching) and processing_codes
      const { data: logs } = await supabase
        .from('work_logs')
        .select('*, employees(employee_name), job_step:job_step_id(step_id, step_no, step_name, track), processing_codes:processing_code_id(processing_name)')
        .eq('job_id', j.job_id)
        .order('work_date', { ascending: false })

      if (logs) setWorkLogs(logs)

      // Save initial snapshot for Diff comparison
      setInitialLoadedData({
        product_code: prodCode,
        product_name: prodName,
        customer_product_name: custProdName,
        design_code: desCode,
        design_length: dLen,
        design_width: dWid,
        design_height: dHgt,
        design_depth: dDep,
        cavity_count: cav,
        cutline_length: cutL,
        cutline_width: cutW,
        corner_r: cR,
        chamfer_c: cC,
        system_code: sysCode,
        physical_stamp: stamp,
        job_code: jCode,
        job_name: jName,
        deadline: jDead,
        unit_price: jPrice,
        customerName: loadedCustomerName
      })
    } else {
      alert(`${t('errLoadJob')}: ${res.error}`)
    }
  }, [supabase, t])

  // ── Load Product Data into Form (when navigating from Product Center or direct product_id) ──
  const loadProductById = useCallback(async (productId: string) => {
    setLoadingJobData(true)
    try {
      // 1. Fetch product with company
      // 1. Fetch product
      const { data: prod, error: prodErr } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', productId)
        .single()

      if (prodErr || !prod) {
        console.error('Error fetching product for quick-create:', prodErr)
        return
      }

      setProductCode(prod.product_code || '')
      setCustomerProductName(prod.customer_product_name || '')
      setProductName(prod.product_name || prod.product_name_internal || '')

      if (prod.company_id) {
        setCompanyId(prod.company_id)
        const { data: comp } = await supabase
          .from('companies')
          .select('company_id, company_name, company_code')
          .eq('company_id', prod.company_id)
          .single()

        if (comp) {
          setCustomerSearch(`${comp.company_name} (${comp.company_code})`)
          setCompanies(prev => {
            if (!prev.some(c => c.company_id === comp.company_id)) {
              return [comp, ...prev]
            }
            return prev
          })
        }
      }

      // 2. Fetch latest design revision for this product
      const { data: revList } = await supabase
        .from('design_revisions')
        .select('*')
        .eq('product_id', productId)
        .order('revision_number', { ascending: false, nullsFirst: false })
        .limit(1)

      if (revList && revList.length > 0) {
        const d = revList[0]
        setDesignCode(d.design_code || '')
        setDesignLength(d.design_length != null ? d.design_length.toString() : '')
        setDesignWidth(d.design_width != null ? d.design_width.toString() : '')
        setDesignHeight(d.design_height != null ? d.design_height.toString() : '')
        setDesignDepth(d.design_depth != null ? d.design_depth.toString() : '')
        setCavityCount(d.cavity_count != null ? d.cavity_count.toString() : '')
        setCutlineLength(d.cutline_length != null ? d.cutline_length.toString() : '')
        setCutlineWidth(d.cutline_width != null ? d.cutline_width.toString() : '')
        setCornerR(d.corner_r || '')
        setChamferC(d.chamfer_c || '')
        setOrientation(d.orientation || '1. 下型')
        setSetupType(d.setup_type || '1. 普通')
        setDraftAngle(d.draft_angle || '')
        setUnderDepth(d.under_depth || '')
        setUndercutSpec(d.undercut_spec || '')
        setTextContent(d.text_content || '')
        setPlugType(d.plug_type || '')
        setHasSeparateCutter(d.has_separate_cutter || false)
        const pText = d.plastic_type_designed || ''
        const pId = d.plastic_id || ''
        setPlasticTypeDesigned(pText)
        setPlasticId(pId)
        if (pId) {
          const matched = plasticMasters.find(pm => pm.plastic_id === pId)
          if (matched) setPrimaryPlasticCode(matched.plastic_code)
        } else if (pText) {
          const auto = autoMatchPlastic(pText, plasticMasters)
          if (auto) {
            setPlasticId(auto.plastic_id)
            setPrimaryPlasticCode(auto.plastic_code)
          } else {
            setPrimaryPlasticCode('')
          }
        } else {
          setPrimaryPlasticCode('')
        }
        if (d.change_summary?.includes('ポケット試作:')) {
          setPocketPrototype(d.change_summary.replace('ポケット試作:', '').trim())
        }
      }

      setDisplayName(prod.product_name_internal || prod.product_code || '')
    } finally {
      setLoadingJobData(false)
    }
  }, [supabase])

  // Load Job or Product on URL Param change
  useEffect(() => {
    if (editJobIdParam && !loadingMasters) {
      loadJobForEditing(editJobIdParam)
    } else if (productIdParam && !loadingMasters && !editJobId) {
      loadProductById(productIdParam)
    }
  }, [editJobIdParam, productIdParam, loadingMasters, editJobId, loadJobForEditing, loadProductById])

  // Live Search Job in DB for top search bar
  useEffect(() => {
    const timer = setTimeout(async () => {
      const q = jobSearchQuery.trim()
      if (!q) {
        setJobSearchResults([])
        return
      }

      const variants = getSearchVariants(q)
      const cond = variants.flatMap(v => [
        `job_code.ilike.%${v}%`,
        `job_name.ilike.%${v}%`
      ]).join(',')

      const { data } = await supabase
        .from('jobs')
        .select('job_id, job_code, job_name, job_status, created_at')
        .or(cond)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        setJobSearchResults(data)
        setIsJobSearchOpen(true)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [jobSearchQuery, supabase])

  const selectSearchJob = (jobId: string, queryStr?: string) => {
    if (queryStr) addToHistory(queryStr)
    setIsJobSearchOpen(false)
    setShowHistoryDropdown(false)
    setJobSearchQuery('')
    handleNavigateExit({ type: 'loadJob', id: jobId })
  }

  // Close Dropdowns on Click Outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(e.target as Node)) {
        setIsCustomerDropdownOpen(false)
      }
      if (productComboboxRef.current && !productComboboxRef.current.contains(e.target as Node)) {
        setIsProductDropdownOpen(false)
      }
      if (jobSearchRef.current && !jobSearchRef.current.contains(e.target as Node)) {
        setIsJobSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Dynamic Customer List directly from Server Query
  const filteredCompanies = companies

  const selectCompany = (company: Company) => {
    setCompanyId(company.company_id)
    setCustomerSearch(`${company.company_name} (${company.company_code})`)
    setIsCustomerDropdownOpen(false)
  }

  const selectProduct = async (prod: any) => {
    setProductCode(prod.product_code || '')
    setCustomerProductName(prod.customer_product_name || '')
    setProductName(prod.product_name || prod.product_name_internal || '')

    if (prod.companies) {
      setCompanyId(prod.companies.company_id)
      setCustomerSearch(`${prod.companies.company_name} (${prod.companies.company_code})`)
    }

    if (prod.product_id) {
      const { data: revList } = await supabase
        .from('design_revisions')
        .select('*')
        .eq('product_id', prod.product_id)
        .order('revision_number', { ascending: false, nullsFirst: false })
        .limit(1)

      if (revList && revList.length > 0) {
        const d = revList[0]
        setDesignCode(d.design_code || '')
        setDesignLength(d.design_length != null ? d.design_length.toString() : '')
        setDesignWidth(d.design_width != null ? d.design_width.toString() : '')
        setDesignHeight(d.design_height != null ? d.design_height.toString() : '')
        setDesignDepth(d.design_depth != null ? d.design_depth.toString() : '')
        setCavityCount(d.cavity_count != null ? d.cavity_count.toString() : '')
        setCutlineLength(d.cutline_length != null ? d.cutline_length.toString() : '')
        setCutlineWidth(d.cutline_width != null ? d.cutline_width.toString() : '')
        setCornerR(d.corner_r || '')
        setChamferC(d.chamfer_c || '')
        setOrientation(d.orientation || '1. 下型')
        setSetupType(d.setup_type || '1. 普通')
        setDraftAngle(d.draft_angle || '')
        setUnderDepth(d.under_depth || '')
        setUndercutSpec(d.undercut_spec || '')
        setTextContent(d.text_content || '')
        setPlugType(d.plug_type || '')
        setHasSeparateCutter(d.has_separate_cutter || false)
        const pText = d.plastic_type_designed || ''
        const pId = d.plastic_id || ''
        setPlasticTypeDesigned(pText)
        setPlasticId(pId)
        if (pId) {
          const matched = plasticMasters.find(pm => pm.plastic_id === pId)
          if (matched) setPrimaryPlasticCode(matched.plastic_code)
        } else if (pText) {
          const auto = autoMatchPlastic(pText, plasticMasters)
          if (auto) {
            setPlasticId(auto.plastic_id)
            setPrimaryPlasticCode(auto.plastic_code)
          } else {
            setPrimaryPlasticCode('')
          }
        } else {
          setPrimaryPlasticCode('')
        }
        if (d.change_summary?.includes('ポケット試作:')) {
          setPocketPrototype(d.change_summary.replace('ポケット試作:', '').trim())
        }
      }
    }

    setIsProductDropdownOpen(false)
  }

  const handleCustomerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isCustomerDropdownOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsCustomerDropdownOpen(true)
        return
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.min(prev + 1, filteredCompanies.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredCompanies.length > 0 && highlightedIndex < filteredCompanies.length) {
        selectCompany(filteredCompanies[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      setIsCustomerDropdownOpen(false)
    }
  }

  // Component/Step Handlers (unified — all operate on steps[])
  const toggleComponentChip = (chip: typeof COMPONENT_CHIPS[0]) => {
    const existsIdx = steps.findIndex(s => s.type_code === chip.type_code)
    if (existsIdx >= 0) {
      const targetStep = steps[existsIdx]
      const hasWorklogs = workLogs.some(l => {
        if (targetStep.step_id && l.job_step_id && l.job_step_id === targetStep.step_id) return true
        if (targetStep.type_code && (l.job_step?.track === targetStep.type_code || l.job_step?.type_code === targetStep.type_code)) return true
        if (l.job_step?.step_no != null && Number(l.job_step.step_no) === Number(targetStep.step_no)) return true
        return false
      })

      const msg = hasWorklogs
        ? `構成部品「${targetStep.step_name}」には作業日報があります。削除しますか？`
        : `構成部品「${targetStep.step_name}」を削除しますか？`

      if (!confirm(msg)) return

      // Remove this component
      setSteps(prev => {
        const next = prev.filter((_, i) => i !== existsIdx)
        return next.map((s, i) => ({ ...s, step_no: i + 1 }))
      })
    } else {
      const isOutsourced = chip.type_code === 'CUTTER'
      const defaultName = chip.type_code === 'MOLD' ? '金型' : chip.type_code === 'PLUG' ? 'プラグ' : chip.type_code === 'CUTTER' ? '抜型' : chip.type_code === 'WATER_BASE' ? '水冷盤' : chip.type_code === 'FRAME' ? '枠' : chip.type_code === 'PRESSURE_BASE' ? '押板' : chip.type_code
      setSteps(prev => [
        ...prev,
        {
          step_no: prev.length + 1,
          step_name: defaultName,
          type_code: chip.type_code,
          material_spec: chip.type_code === 'MOLD' ? 'A5052' : chip.type_code === 'PLUG' ? '木板' : chip.type_code === 'WATER_BASE' ? 'A5052' : 'SKD11',
          quantity: 1,
          arrangement: 'REQUIRED',
          condition: 'NEW',
          manufacture_location: isOutsourced ? 'OUTSOURCED' : 'IN_HOUSE',
        }
      ])
    }
  }

  const updateComponent = (index: number, field: keyof QuickMoldJobStepInput, val: any) => {
    setSteps(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: val }
      return next
    })
  }

  const removeComponent = (index: number) => {
    const targetStep = steps[index]
    if (!targetStep) return

    const hasWorklogs = workLogs.some(l => {
      if (targetStep.step_id && l.job_step_id && l.job_step_id === targetStep.step_id) return true
      if (targetStep.type_code && (l.job_step?.track === targetStep.type_code || l.job_step?.type_code === targetStep.type_code)) return true
      if (l.job_step?.step_no != null && Number(l.job_step.step_no) === Number(targetStep.step_no)) return true
      return false
    })

    const msg = hasWorklogs
      ? `「${targetStep.step_name}」には作業日報があります。削除しますか？`
      : `「${targetStep.step_name}」を削除しますか？`

    if (!confirm(msg)) return

    setSteps(prev => {
      const next = prev.filter((_, i) => i !== index)
      return next.map((s, i) => ({ ...s, step_no: i + 1 }))
    })
  }

  // Step Handlers (same as component handlers — unified)
  const updateStep = updateComponent

  const addStep = () => {
    setSteps(prev => [
      ...prev,
      { step_no: prev.length + 1, step_name: '加工工程', estimated_hours: null }
    ])
  }

  const removeStep = removeComponent

  const applyPreset = (presetKey: keyof typeof PRESET_WORKFLOWS) => {
    setSteps([...PRESET_WORKFLOWS[presetKey].steps])
  }

  // Browser tab exit/refresh warning if unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (checkIsDirty()) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [checkIsDirty])

  // Prevent ENTER key from submitting form, instead focus next input field
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement
      // Allow enter key inside textarea for multiline or buttons to click
      if (target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') return

      e.preventDefault()
      const form = e.currentTarget
      const focusables = Array.from(
        form.querySelectorAll<HTMLElement>(
          'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])'
        )
      )

      const index = focusables.indexOf(target)
      if (index > -1 && index < focusables.length - 1) {
        focusables[index + 1].focus()
      }
    }
  }

  // Handle Intercept Form Submit & Show Confirm Modal
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmModal(true)
  }

  // Handle Actual Save (Create or Update)
  const commitSave = async () => {
    setSaving(true)

    const payload: QuickMoldJobInput = {
      company_id: companyId || undefined,
      product_code: productCode,
      product_name: productName,
      customer_product_name: customerProductName,
      design_code: designCode,
      design_length: designLength ? Number(designLength) : null,
      design_width: designWidth ? Number(designWidth) : null,
      design_height: designHeight ? Number(designHeight) : null,
      design_depth: designDepth ? Number(designDepth) : null,
      cavity_count: cavityCount ? Number(cavityCount) : null,
      plastic_type_designed: plasticTypeDesigned || null,
      plastic_id: plasticId || null,
      cutline_length: cutlineLength ? Number(cutlineLength) : null,
      cutline_width: cutlineWidth ? Number(cutlineWidth) : null,
      corner_r: cornerR,
      chamfer_c: chamferC,
      orientation,
      setup_type: setupType,
      draft_angle: draftAngle ? Number(draftAngle) : null,
      under_depth: underDepth ? Number(underDepth) : null,
      undercut_spec: undercutSpec,
      text_content: textContent,
      plug_type: plugType,
      has_separate_cutter: hasSeparateCutter,
      pocket_prototype: pocketPrototype,
      system_code: systemCode,
      display_name: displayName,
      physical_stamp: physicalStamp,
      job_code: jobCode,
      job_name: jobName,
      job_type_id: jobTypeId || null,
      job_category: JOB_TYPE_TO_CATEGORY[jobTypeId] || 'OTHER',
      responsible_id: responsibleId || undefined,
      start_date: startDate || undefined,
      deadline: deadline || undefined,
      ship_date: shipDate || undefined,
      price_quote_required: priceQuoteRequired,
      unit_price: unitPrice ? Number(unitPrice) : null,
      notes,
      steps
    }

    if (editJobId) {
      // Update Mode
      const res = await updateQuickMoldJobWorkflow(editJobId, payload)
      setSaving(false)
      setShowConfirmModal(false)

      if (res.success && res.job_id) {
        setCreatedResult({ jobId: res.job_id, moldId: res.physical_mold_id || '', isEdit: true })
      } else {
        alert(`${t('errUpdate')}: ${res.error}`)
      }
    } else {
      // Create Mode
      const res = await createQuickMoldJobWorkflow(payload)
      setSaving(false)
      setShowConfirmModal(false)

      if (res.success && res.job_id) {
        setCreatedResult({ jobId: res.job_id, moldId: res.physical_mold_id || '', isEdit: false })
      } else {
        alert(`${t('errCreate')}: ${res.error}`)
      }
    }
  }

  const selectedCustomerName = companies.find(c => c.company_id === companyId)?.company_name || ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8, padding: 8, background: 'var(--bg-base)' }}>
      {/* ── Top Header & Master Job Search Bar (Responsive) ── */}
      <div className="card-flat flex flex-col md:flex-row md:items-center justify-between gap-2 p-2 md:p-3 shrink-0 border-l-4 border-[var(--accent)]">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="flex gap-1.5 shrink-0">
            <button type="button" onClick={() => handleNavigateExit('back')} className="btn btn-secondary" style={{ height: 26, padding: '0 8px', fontSize: 11, gap: 4 }}>
              <ArrowLeft size={13} />
              <span>{t('back')}</span>
            </button>
            <button type="button" onClick={() => handleNavigateExit('up')} className="btn btn-secondary" style={{ height: 26, padding: '0 8px', fontSize: 11, gap: 4 }}>
              <ArrowUpFromLine size={13} />
              <span>{t('upList')}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOcrModalOpen(true)}
              className="btn"
              style={{
                height: 26,
                padding: '0 10px',
                fontSize: 11,
                gap: 4,
                background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Sparkles size={13} />
              <span>AI 工程票取込</span>
            </button>
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="btn btn-primary"
              style={{ height: 26, padding: '0 10px', fontSize: 11, gap: 4, background: 'var(--accent)', color: '#fff', fontWeight: 700 }}
            >
              <Save size={13} />
              <span>{tCommon('save')}</span>
            </button>
          </div>

          <div>
            <h1 style={{ fontSize: 14, fontWeight: 700, margin: 0, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
              <span>{t('pageTitle')}</span>
              {editJobId ? (
                <span className="badge badge--warning" style={{ fontSize: 10 }}>EDIT MODE [{jobCode}]</span>
              ) : (
                <span className="badge badge--info" style={{ fontSize: 10 }}>CREATE MODE</span>
              )}
            </h1>
          </div>
        </div>

        {/* Top Search Bar for Edit Mode */}
        <div ref={jobSearchRef} className="relative w-full md:w-[340px]">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: 8, color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input form-input-search mono"
              style={{ height: 28, fontSize: 12, paddingLeft: 28, paddingRight: 24 }}
              placeholder={t('searchJobPlaceholder')}
              value={jobSearchQuery}
              onChange={e => setJobSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchHistory.length > 0) setShowHistoryDropdown(true)
              }}
            />
            {jobSearchQuery && (
              <button
                type="button"
                onClick={() => setJobSearchQuery('')}
                style={{ position: 'absolute', right: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Search History Suggestions Dropdown */}
          {showHistoryDropdown && !jobSearchQuery && searchHistory.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, marginTop: 2 }}>
              <SearchSuggestions
                history={searchHistory}
                visible={showHistoryDropdown}
                onSelect={(kw) => {
                  setJobSearchQuery(kw)
                  setShowHistoryDropdown(false)
                }}
                onRemove={removeFromHistory}
                onClear={clearHistory}
                onClose={() => setShowHistoryDropdown(false)}
              />
            </div>
          )}

          {/* Realtime Search Results */}
          {isJobSearchOpen && jobSearchResults.length > 0 && (
            <div
              className="card-flat"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 100,
                marginTop: 2,
                maxHeight: 240,
                overflowY: 'auto',
                padding: 4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                background: 'var(--bg-surface)',
              }}
            >
              <div style={{ padding: '4px 8px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
                {t('searchResultsTitle')} ({jobSearchResults.length})
              </div>
              {jobSearchResults.map(job => (
                <div
                  key={job.job_id}
                  onClick={() => selectSearchJob(job.job_id, job.job_code)}
                  style={{
                    padding: '6px 8px',
                    fontSize: 11,
                    cursor: 'pointer',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  className="hover:bg-accent/10"
                >
                  <div>
                    <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>[{job.job_code}]</strong>
                    <span style={{ marginLeft: 6, color: 'var(--text-primary)' }}>{job.job_name}</span>
                  </div>
                  <span className="badge badge--info" style={{ fontSize: 9 }}>{job.job_status || 'NEW'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content: Responsive 2-Panel Layout (Stack on Mobile, 2-Cols on Desktop) ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-y-auto lg:overflow-hidden">
        
        {/* ── LEFT PANEL: Main Form (lg:col-span-8 / 66% on Desktop, 100% on Mobile) ── */}
        <div className="lg:col-span-8 overflow-y-auto pr-0 lg:pr-1">
          {createdResult ? (
            <div className="card-flat" style={{ padding: 24, textAlign: 'center', borderLeft: '4px solid var(--status-success)' }}>
              <CheckCircle2 size={40} style={{ color: 'var(--status-success)', margin: '0 auto 12px' }} />
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>
                {createdResult.isEdit ? t('successUpdateTitle') : t('successCreateTitle')}
              </h2>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16 }}>
                Job ID: <code style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{createdResult.jobId}</code>
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <Link href={`/equipment/jobs/${createdResult.jobId}`} className="btn btn-primary" style={{ height: 30, fontSize: 12 }}>
                  {t('viewJobDetailBtn')}
                </Link>
                <button
                  onClick={() => {
                    setCreatedResult(null)
                    setEditJobId(null)
                    setJobCode('')
                    setProductCode('')
                  }}
                  className="btn btn-secondary"
                  style={{ height: 30, fontSize: 12 }}
                >
                  {t('continueCreatingBtn')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} onKeyDown={handleFormKeyDown} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              
              {/* ── Section 1: 得意先 & 製品情報 (Master Data - Blue Accent) ── */}
              {CATEGORIES_NEEDING_PRODUCT_DESIGN_MOLD.has(JOB_TYPE_TO_CATEGORY[jobTypeId] || 'MOLD_NEW') && (
              <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Building2 size={15} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
                    {t('step1Title')}
                  </span>
                  <span className="badge badge--info" style={{ fontSize: 10 }}>
                    {t('step1Tag')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  
                  {/* Customer Combobox */}
                  <div ref={comboboxRef} style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                      {t('customerLabel')}
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ height: 28, fontSize: 12, padding: '2px 24px 2px 8px' }}
                        placeholder={t('customerPlaceholder')}
                        value={customerSearch}
                        onChange={e => {
                          setCustomerSearch(e.target.value)
                          setIsCustomerDropdownOpen(true)
                          setHighlightedIndex(0)
                        }}
                        onFocus={() => setIsCustomerDropdownOpen(true)}
                        onKeyDown={handleCustomerKeyDown}
                      />
                      <ChevronDown size={14} style={{ position: 'absolute', right: 6, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    </div>

                    {/* Customer Dropdown Menu */}
                    {isCustomerDropdownOpen && (
                      <div
                        className="card-flat"
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          zIndex: 100,
                          marginTop: 2,
                          maxHeight: 180,
                          overflowY: 'auto',
                          padding: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          background: 'var(--bg-surface)',
                        }}
                      >
                        <div
                          onClick={() => {
                            setCompanyId('')
                            setCustomerSearch('')
                            setIsCustomerDropdownOpen(false)
                          }}
                          style={{ padding: '4px 8px', fontSize: 11, color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                          — 顧客を選択しない —
                        </div>
                        {filteredCompanies.length === 0 ? (
                          <div style={{ padding: 8, fontSize: 11, color: 'var(--text-muted)' }}>
                            該当する顧客が見つかりません
                          </div>
                        ) : (
                          filteredCompanies.map((c, idx) => (
                            <div
                              key={c.company_id}
                              onClick={() => selectCompany(c)}
                              style={{
                                padding: '5px 8px',
                                fontSize: 11,
                                cursor: 'pointer',
                                borderRadius: 4,
                                background: idx === highlightedIndex ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'transparent',
                              }}
                            >
                              <strong>{c.company_name}</strong>
                              <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 6 }}>({c.company_code})</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Product Combobox Dropdown */}
                  <div ref={productComboboxRef} style={{ position: 'relative' }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                      {t('productCodeLabel')} <span style={{ color: 'var(--status-error)' }}>*</span>
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        required
                        placeholder={t('productSearchPlaceholder')}
                        className="form-input mono"
                        style={{ height: 28, fontSize: 12, padding: '2px 24px 2px 8px', fontWeight: 700 }}
                        value={productCode}
                        onChange={e => {
                          setProductCode(e.target.value.toUpperCase())
                          setIsProductDropdownOpen(true)
                          setProductHighlightedIndex(0)
                        }}
                        onFocus={() => setIsProductDropdownOpen(true)}
                      />
                      <ChevronDown size={14} style={{ position: 'absolute', right: 6, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                    </div>

                    {/* Product Dropdown Menu */}
                    {isProductDropdownOpen && productSearchResults.length > 0 && (
                      <div
                        className="card-flat"
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          zIndex: 100,
                          marginTop: 2,
                          maxHeight: 200,
                          overflowY: 'auto',
                          padding: 2,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          background: 'var(--bg-surface)',
                        }}
                      >
                        {productSearchResults.map((prod, idx) => (
                          <div
                            key={prod.product_id}
                            onClick={() => selectProduct(prod)}
                            style={{
                              padding: '5px 8px',
                              fontSize: 11,
                              cursor: 'pointer',
                              borderRadius: 4,
                              background: idx === productHighlightedIndex ? 'color-mix(in srgb, var(--accent) 15%, transparent)' : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}
                            className="hover:bg-accent/10"
                          >
                            <div>
                              <strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>[{prod.product_code}]</strong>
                              <span style={{ marginLeft: 6, color: 'var(--text-primary)' }}>{prod.product_name || prod.customer_product_name}</span>
                            </div>
                            {prod.companies && (
                              <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{prod.companies.company_name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                      {t('customerProductNameLabel')}
                    </label>
                    <input
                      type="text"
                      placeholder={t('customerProductNamePlaceholder')}
                      className="form-input"
                      style={{ height: 28, fontSize: 12, padding: '2px 8px' }}
                      value={customerProductName}
                      onChange={e => setCustomerProductName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div>
                      <div className="flex items-center justify-between" style={{ marginBottom: 2 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                          {t('plasticTypeDesignedLabel')}
                        </label>
                        {plasticId && (
                          <span className="badge badge--success" style={{ fontSize: 9, padding: '0 4px', lineHeight: '14px' }}>
                            ✓ {t('autoMatchedPlasticBadge')}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder={t('plasticTypeDesignedPlaceholder')}
                        className="form-input font-mono"
                        style={{ height: 28, fontSize: 11, padding: '2px 6px', fontWeight: 600 }}
                        value={plasticTypeDesigned}
                        onChange={e => {
                          const val = e.target.value
                          setPlasticTypeDesigned(val)
                          const auto = autoMatchPlastic(val, plasticMasters)
                          if (auto) {
                            setPlasticId(auto.plastic_id)
                            setPrimaryPlasticCode(auto.plastic_code)
                          }
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 1 }}>
                        {t('primaryPlasticCodeLabel')}
                      </label>
                      <select
                        className="form-input"
                        style={{ height: 24, fontSize: 11, padding: '1px 4px' }}
                        value={plasticId || primaryPlasticCode}
                        onChange={e => {
                          const val = e.target.value
                          const found = plasticMasters.find(pm => pm.plastic_id === val || pm.plastic_code === val)
                          if (found) {
                            setPlasticId(found.plastic_id)
                            setPrimaryPlasticCode(found.plastic_code)
                          } else {
                            setPlasticId('')
                            setPrimaryPlasticCode(val)
                          }
                        }}
                      >
                        <option value="">— {tCommon('selectPlaceholder')} —</option>
                        {plasticMasters.length > 0 ? (
                          plasticMasters.map(pm => (
                            <option key={pm.plastic_id} value={pm.plastic_id}>
                              {pm.plastic_code} {pm.plastic_family ? `(${pm.plastic_family}${pm.thickness_mm ? ` ${pm.thickness_mm}mm` : ''})` : ''}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="PET 0.5t">PET 0.5t</option>
                            <option value="PET 0.3t">PET 0.3t</option>
                            <option value="PP 0.5t">PP 0.5t</option>
                            <option value="PS 0.4t">PS 0.4t</option>
                            <option value="A-PET 0.5t">A-PET 0.5t</option>
                            <option value="CONDUCTIVE PS">CONDUCTIVE PS</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* ── Section 2: 設計 & 寸法パラメータ (CAD Specs - Purple Accent) ── */}
              {CATEGORIES_NEEDING_PRODUCT_DESIGN_MOLD.has(JOB_TYPE_TO_CATEGORY[jobTypeId] || 'MOLD_NEW') && (
              <>
              <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid var(--tint-purple-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <PenTool size={15} style={{ color: 'var(--tint-purple-bg)' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
                    {t('step2Title')}
                  </span>
                  <span className="badge badge--info" style={{ fontSize: 10 }}>
                    {t('step2Tag')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-2">
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('designCodeLabel')}</label>
                    <input type="text" className="form-input mono" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={designCode} onChange={e => setDesignCode(e.target.value)} placeholder={t('designCodePlaceholder')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('lengthLabel')}</label>
                    <input type="number" placeholder={t('lengthPlaceholder')} className="form-input mono" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={designLength} onChange={e => setDesignLength(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('widthLabel')}</label>
                    <input type="number" placeholder={t('widthPlaceholder')} className="form-input mono" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={designWidth} onChange={e => setDesignWidth(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('heightLabel')}</label>
                    <input type="number" placeholder={t('heightPlaceholder')} className="form-input mono" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={designHeight} onChange={e => setDesignHeight(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('depthLabel')}</label>
                    <input type="number" placeholder={t('depthPlaceholder')} className="form-input mono" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={designDepth} onChange={e => setDesignDepth(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('cavityLabel')}</label>
                    <input type="number" placeholder={t('cavityPlaceholder')} className="form-input mono" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={cavityCount} onChange={e => setCavityCount(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('cutlineLabel')}</label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <input type="number" placeholder={t('cutlineLPlaceholder')} className="form-input mono" style={{ height: 28, fontSize: 11, padding: '2px 4px' }} value={cutlineLength} onChange={e => setCutlineLength(e.target.value)} />
                      <input type="number" placeholder={t('cutlineWPlaceholder')} className="form-input mono" style={{ height: 28, fontSize: 11, padding: '2px 4px' }} value={cutlineWidth} onChange={e => setCutlineWidth(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('cornerRLabel')}</label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <input type="text" placeholder={t('cornerRPlaceholder')} className="form-input mono" style={{ height: 28, fontSize: 11, padding: '2px 4px' }} value={cornerR} onChange={e => setCornerR(e.target.value)} />
                      <input type="text" placeholder={t('chamferCPlaceholder')} className="form-input mono" style={{ height: 28, fontSize: 11, padding: '2px 4px' }} value={chamferC} onChange={e => setChamferC(e.target.value)} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('orientationLabel')}</label>
                    <select className="form-input" style={{ height: 28, fontSize: 12, padding: '2px 6px' }} value={orientation} onChange={e => setOrientation(e.target.value)}>
                      <option value="1. 下型">{tText('1. Khuôn dưới', '1. 下型')}</option>
                      <option value="2. 上型">{tText('2. Khuôn trên', '2. 上型')}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('setupTypeLabel')}</label>
                    <select className="form-input" style={{ height: 28, fontSize: 12, padding: '2px 6px' }} value={setupType} onChange={e => setSetupType(e.target.value)}>
                      <option value="1. 普通">{tText('1. Thuận', '1. 普通')}</option>
                      <option value="2. 逆型">{tText('2. Ngược', '2. 逆型')}</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('underLabel')}</label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <input type="number" placeholder={t('underDepthPlaceholder')} className="form-input" style={{ height: 28, fontSize: 11, padding: '2px 4px', width: 50 }} value={underDepth} onChange={e => setUnderDepth(e.target.value)} />
                      <input type="text" placeholder={t('undercutSpecPlaceholder')} className="form-input" style={{ height: 28, fontSize: 11, padding: '2px 4px' }} value={undercutSpec} onChange={e => setUndercutSpec(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 3: 金型登録 (Physical Mold - Amber Accent) ── */}
              <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid var(--status-warning)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Wrench size={15} style={{ color: 'var(--status-warning)' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
                    {t('step3Title')}
                  </span>
                  <span className="badge badge--warning" style={{ fontSize: 10 }}>
                    {t('step3Tag')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('systemCodeLabel')}</label>
                    <input type="text" className="form-input mono" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={systemCode} onChange={e => setSystemCode(e.target.value)} placeholder={t('systemCodePlaceholder')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('displayNameLabel')}</label>
                    <input type="text" className="form-input" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder={t('displayNamePlaceholder')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('physicalStampLabel')}</label>
                    <input type="text" className="form-input mono" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={physicalStamp} onChange={e => setPhysicalStamp(e.target.value)} placeholder={t('physicalStampPlaceholder')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('textContentLabel')}</label>
                    <input type="text" className="form-input" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={textContent} onChange={e => setTextContent(e.target.value)} placeholder={t('textContentPlaceholder')} />
                  </div>
                </div>
              </div>
              </>)}

              {/* ── Section 4: ジョブ指示 & 期間 (Job Directive - Emerald Accent) ── */}
              <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid var(--status-success)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Hammer size={15} style={{ color: 'var(--status-success)' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
                    {t('step4Title')}
                  </span>
                  <span className="badge badge--success" style={{ fontSize: 10 }}>
                    {t('step4Tag')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                      {t('jobCodeLabel')} <span style={{ color: 'var(--status-error)' }}>*</span>
                    </label>
                    <input type="text" required className="form-input mono" style={{ height: 28, fontSize: 12, padding: '2px 8px', fontWeight: 700 }} value={jobCode} onChange={e => setJobCode(e.target.value)} placeholder={t('jobCodePlaceholder')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                      {t('jobNameLabel')} <span style={{ color: 'var(--status-error)' }}>*</span>
                    </label>
                    <input type="text" required className="form-input" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={jobName} onChange={e => setJobName(e.target.value)} placeholder={t('jobNamePlaceholder')} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('jobTypeLabel')}</label>
                    <select className="form-input" style={{ height: 28, fontSize: 12, padding: '2px 6px' }} value={jobTypeId} onChange={e => setJobTypeId(e.target.value)}>
                      {jobTypes.map(jt => (
                        <option key={jt.job_type_id} value={jt.job_type_id}>
                          {locale === 'vi' ? (jt.job_type_name_vi || jt.job_type_name_ja) : (jt.job_type_name_ja || jt.job_type_name_vi)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('responsiblePersonLabel')}</label>
                    <select className="form-input" style={{ height: 28, fontSize: 12, padding: '2px 6px' }} value={responsibleId} onChange={e => setResponsibleId(e.target.value)}>
                      <option value="">— {t('unassigned')} —</option>
                      {employees.map(emp => (
                        <option key={emp.employee_id} value={emp.employee_id}>
                          {emp.employee_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('startDateLabel')}</label>
                    <input type="date" className="form-input" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('deadlineLabel')}</label>
                    <input type="date" className="form-input" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={deadline} onChange={e => setDeadline(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('shipDateLabel')}</label>
                    <input type="date" className="form-input" style={{ height: 28, fontSize: 12, padding: '2px 8px' }} value={shipDate} onChange={e => setShipDate(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t('priceQuoteLabel')}</label>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                        <input type="checkbox" checked={priceQuoteRequired} onChange={e => setPriceQuoteRequired(e.target.checked)} />
                        <span>見積済</span>
                      </label>
                      <input type="number" placeholder={t('unitPricePlaceholder')} className="form-input mono" style={{ height: 28, fontSize: 12, padding: '2px 6px', flex: 1 }} value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 5: 構成部品 & 補助設備 (Mold Kit Components - Accent Border) ── */}
              <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Box size={15} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
                      {t('step5Title')}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--accent)', background: 'var(--accent-subtle)', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                      {t('step5Tag')}
                    </span>
                  </div>

                  {/* Component Chips Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginRight: 2 }}>{t('quickAddParts')}</span>
                    {COMPONENT_CHIPS.map(chip => {
                      const isSelected = steps.some(s => s.type_code === chip.type_code)
                      return (
                        <button
                          key={chip.type_code}
                          type="button"
                          onClick={() => toggleComponentChip(chip)}
                          className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                          style={{
                            height: 22,
                            padding: '0 8px',
                            fontSize: 10,
                            fontWeight: 600,
                            background: isSelected ? 'var(--accent)' : undefined,
                            borderColor: isSelected ? 'var(--accent)' : undefined,
                          }}
                        >
                          {isSelected ? '✓ ' : '+ '} {chip.type_code}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Component Kit Table (Full Specs: Deadline, Arrangement, Condition, Manufacture Location) */}
                <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 6 }}>
                  <table className="data-table" style={{ width: '100%', minWidth: 940, fontSize: 10 }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-surface-2)' }}>
                        <th style={{ width: 85, padding: '4px 6px' }}>{t('kitPartType')}</th>
                        <th style={{ minWidth: 130, padding: '4px 6px' }}>{t('kitPartName')}</th>
                        <th style={{ width: 110, padding: '4px 6px' }}>{t('kitMaterialSpec')}</th>
                        <th style={{ width: 45, textAlign: 'center', padding: '4px 4px' }}>{t('kitQuantity')}</th>
                        <th style={{ width: 125, padding: '4px 6px' }}>{t('kitDeadline')}</th>
                        <th style={{ width: 110, padding: '4px 6px' }}>{t('kitArrangement')}</th>
                        <th style={{ width: 110, padding: '4px 6px' }}>{t('kitCondition')}</th>
                        <th style={{ width: 130, padding: '4px 6px' }}>{t('kitManufactureLoc')}</th>
                        <th style={{ minWidth: 110, padding: '4px 6px' }}>{t('kitNotes')}</th>
                        <th style={{ width: 28, textAlign: 'center', padding: '4px 4px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Component rows = steps that have a type_code
                        const componentEntries = steps
                          .map((comp, originalIdx) => ({ comp, originalIdx }))
                          .filter(({ comp }) => !!comp.type_code)
                        
                        if (componentEntries.length === 0) {
                          return (
                            <tr>
                              <td colSpan={10} style={{ textAlign: 'center', padding: 12, color: 'var(--text-muted)', fontSize: 11 }}>
                                {t('noComponentsYet')}
                              </td>
                            </tr>
                          )
                        }

                        return componentEntries.map(({ comp, originalIdx }) => (
                          <tr key={`comp-${comp.type_code || 'step'}-${originalIdx}`}>
                            <td style={{ padding: '3px 6px' }}>
                              <select
                                className="form-input"
                                style={{ height: 24, fontSize: 10, padding: '1px 4px', fontWeight: 700, color: 'var(--accent)' }}
                                value={comp.type_code || ''}
                                onChange={e => {
                                  const newTypeCode = e.target.value
                                  updateComponent(originalIdx, 'type_code', newTypeCode)
                                  updateComponent(originalIdx, 'track', newTypeCode)
                                }}
                              >
                                {COMPONENT_CHIPS.map(chip => (
                                  <option key={chip.type_code} value={chip.type_code}>
                                    {chip.type_code}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: '3px 6px' }}>
                              <input
                                type="text"
                                className="form-input"
                                style={{ height: 24, fontSize: 11, padding: '2px 4px' }}
                                value={comp.step_name}
                                onChange={e => updateComponent(originalIdx, 'step_name', e.target.value)}
                              />
                            </td>
                            <td style={{ padding: '3px 6px' }}>
                              <input
                                type="text"
                                className="form-input"
                                style={{ height: 24, fontSize: 11, padding: '2px 4px' }}
                                value={comp.material_spec || ''}
                                onChange={e => updateComponent(originalIdx, 'material_spec', e.target.value)}
                                placeholder="A5052/SKD11"
                              />
                            </td>
                            <td style={{ padding: '3px 4px', textAlign: 'center' }}>
                              <input
                                type="number"
                                min="1"
                                className="form-input"
                                style={{ height: 24, fontSize: 11, padding: '2px 2px', textAlign: 'center' }}
                                value={comp.quantity || 1}
                                onChange={e => updateComponent(originalIdx, 'quantity', Number(e.target.value))}
                              />
                            </td>
                            <td style={{ padding: '3px 6px' }}>
                              <input
                                type="date"
                                className="form-input"
                                style={{ height: 24, fontSize: 10, padding: '2px 4px' }}
                                value={comp.deadline || ''}
                                onChange={e => updateComponent(originalIdx, 'deadline', e.target.value)}
                              />
                            </td>
                            <td style={{ padding: '3px 6px' }}>
                              <select
                                className="form-input"
                                style={{ height: 24, fontSize: 10, padding: '2px 4px' }}
                                value={comp.arrangement || 'REQUIRED'}
                                onChange={e => updateComponent(originalIdx, 'arrangement', e.target.value)}
                              >
                                <option value="REQUIRED">{t('arrRequired')}</option>
                                <option value="NOT_REQUIRED">{t('arrNotRequired')}</option>
                              </select>
                            </td>
                            <td style={{ padding: '3px 6px' }}>
                              <select
                                className="form-input"
                                style={{ height: 24, fontSize: 10, padding: '2px 4px' }}
                                value={comp.condition || 'NEW'}
                                onChange={e => updateComponent(originalIdx, 'condition', e.target.value)}
                              >
                                <option value="NEW">{t('condNew')}</option>
                                <option value="EXISTING">{t('condExisting')}</option>
                              </select>
                            </td>
                            <td style={{ padding: '3px 6px' }}>
                              <select
                                className="form-input"
                                style={{ height: 24, fontSize: 10, padding: '2px 4px', fontWeight: comp.manufacture_location === 'OUTSOURCED' ? 700 : 400, color: comp.manufacture_location === 'OUTSOURCED' ? 'var(--status-warning)' : undefined }}
                                value={comp.manufacture_location || 'IN_HOUSE'}
                                onChange={e => updateComponent(originalIdx, 'manufacture_location', e.target.value)}
                              >
                                <option value="IN_HOUSE">{t('locInHouse')}</option>
                                <option value="OUTSOURCED">{t('locOutsourced')}</option>
                              </select>
                            </td>
                            <td style={{ padding: '3px 6px' }}>
                              <input
                                type="text"
                                className="form-input"
                                style={{ height: 24, fontSize: 10, padding: '2px 4px' }}
                                value={comp.notes || ''}
                                onChange={e => updateComponent(originalIdx, 'notes', e.target.value)}
                                placeholder="..."
                              />
                            </td>
                            <td style={{ padding: '3px 4px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => removeComponent(originalIdx)}
                                style={{ background: 'none', border: 'none', color: 'var(--status-error)', cursor: 'pointer', padding: 2 }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Section 6: 詳細加工工程 (2-COLUMN SPLIT: Process Steps & Worklogs) ── */}
              <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid var(--accent)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Layers size={15} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-jp)', color: 'var(--text-primary)' }}>
                      {t('step6Title')}
                    </span>
                    <span className="badge badge--info" style={{ fontSize: 10 }}>
                      {t('step6Tag')}
                    </span>
                  </div>

                  {/* Workflow Presets */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('presetWorkflow')}</span>
                    <button type="button" onClick={() => applyPreset('NEW_MOLD')} className="btn btn-secondary" style={{ height: 22, padding: '0 6px', fontSize: 10 }}>
                      {PRESET_WORKFLOWS.NEW_MOLD.labelJA}
                    </button>
                    <button type="button" onClick={() => applyPreset('MODIFY_MOLD')} className="btn btn-secondary" style={{ height: 22, padding: '0 6px', fontSize: 10 }}>
                      {PRESET_WORKFLOWS.MODIFY_MOLD.labelJA}
                    </button>
                    <button type="button" onClick={() => applyPreset('PROTOTYPE')} className="btn btn-secondary" style={{ height: 22, padding: '0 6px', fontSize: 10 }}>
                      {PRESET_WORKFLOWS.PROTOTYPE.labelJA}
                    </button>
                  </div>
                </div>

                {/* 2-Column Split inside Section 6 */}
                {(() => {
                  // Enhanced worklog filter: step_id FK → track → step_no → step_name
                  const filteredWorkLogs = selectedStepNo == null 
                    ? workLogs 
                    : workLogs.filter(l => {
                        const activeStep = steps.find(s => s.step_no === selectedStepNo)
                        if (!activeStep) return true

                        // 1. Primary: exact match by step_id FK (most reliable)
                        if (activeStep.step_id && l.job_step_id && l.job_step_id === activeStep.step_id) return true

                        // 2. Track-based: if active step has type_code (e.g. MOLD, PLUG, CUTTER),
                        //    match worklogs whose joined job_step has the same track/type_code
                        const activeTrack = activeStep.type_code
                        if (activeTrack) {
                          const logTrack = l.job_step?.track || l.job_step?.type_code
                          if (logTrack && logTrack === activeTrack) return true
                        }

                        // 3. Fallback: match by step_no from joined data
                        const lStepNo = l.job_step?.step_no
                        if (lStepNo != null && Number(lStepNo) === Number(selectedStepNo)) return true

                        // 4. Name-based fallback for legacy data
                        const lStepName = l.job_step?.step_name
                        if (lStepName && activeStep.step_name && lStepName.trim() === activeStep.step_name.trim()) return true

                        return false
                      })

                  const activeStepObj = selectedStepNo != null ? steps.find(s => s.step_no === selectedStepNo) : null

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: '38% 62%', gap: 10 }}>
                      
                      {/* Column 1: Process Step Gantt Schedule Form */}
                      <div>
                        <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 6, marginBottom: 8 }}>
                          <table className="data-table" style={{ width: '100%', fontSize: 11 }}>
                            <thead>
                              <tr style={{ background: 'var(--bg-surface-2)' }}>
                                <th style={{ width: 30, textAlign: 'center', padding: '4px 4px' }}>{t('stepNo')}</th>
                                <th style={{ padding: '4px 6px' }}>{t('stepName')}</th>
                                <th style={{ width: 60, padding: '4px 4px' }}>{t('estimatedHours')}</th>
                                <th style={{ width: 95, padding: '4px 4px' }}>{t('assignedPerson')}</th>
                                <th style={{ width: 24, textAlign: 'center', padding: '4px 2px' }}></th>
                              </tr>
                            </thead>
                            <tbody>
                              {steps.length === 0 ? (
                                <tr>
                                  <td colSpan={5} style={{ textAlign: 'center', padding: 12, color: 'var(--text-muted)', fontSize: 11 }}>
                                    {t('noComponentsYet')}
                                  </td>
                                </tr>
                              ) : (
                                steps.map((st, idx) => {
                                  const isSelected = selectedStepNo === st.step_no
                                  // Count worklogs matching this step (same logic as filter)
                                  const stepLogCount = workLogs.filter(l => {
                                    if (st.step_id && l.job_step_id && l.job_step_id === st.step_id) return true
                                    if (st.type_code) {
                                      const logTrack = l.job_step?.track || l.job_step?.type_code
                                      if (logTrack && logTrack === st.type_code) return true
                                    }
                                    const lStepNo = l.job_step?.step_no
                                    if (lStepNo != null && Number(lStepNo) === Number(st.step_no)) return true
                                    const lStepName = l.job_step?.step_name
                                    if (lStepName && st.step_name && lStepName.trim() === st.step_name.trim()) return true
                                    return false
                                  }).length
                                  return (
                                    <tr 
                                      key={idx}
                                      onClick={() => setSelectedStepNo(st.step_no)}
                                      style={{ 
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? 'color-mix(in srgb, var(--accent) 18%, transparent)' : undefined,
                                        borderLeft: isSelected ? '4px solid var(--accent)' : '4px solid transparent'
                                      }}
                                    >
                                      <td style={{ textAlign: 'center', fontWeight: 700, padding: '4px 4px', fontFamily: 'monospace' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                          {st.step_no}
                                          {stepLogCount > 0 && (
                                            <span style={{ 
                                              fontSize: 8, fontWeight: 700, 
                                              background: 'var(--accent)', color: '#fff', 
                                              borderRadius: '50%', width: 13, height: 13, 
                                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                              flexShrink: 0
                                            }}>
                                              {stepLogCount}
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                      <td style={{ padding: '4px 4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                          <select
                                            className="form-input"
                                            style={{ height: 24, fontSize: 10, padding: '2px 4px', width: '100%', fontWeight: isSelected ? 700 : 400 }}
                                            value={st.step_name}
                                            onChange={e => { setSelectedStepNo(st.step_no); updateStep(idx, 'step_name', e.target.value) }}
                                          >
                                            <optgroup label={t('componentEquipmentOptgroup')}>
                                              <option value="金型">{tText('Khuôn (MOLD)', '金型')}</option>
                                              <option value="プラグ">{tText('Plug (PLUG)', 'プラグ')}</option>
                                              <option value="抜型">{tText('Dao cắt (CUTTER)', '抜型')}</option>
                                              <option value="水冷盤">{tText('Đế làm mát (WATER_BASE)', '水冷盤')}</option>
                                              <option value="枠">{tText('Khung (FRAME)', '枠')}</option>
                                              <option value="押板">{tText('Đế áp lực (PRESSURE_BASE)', '押板')}</option>
                                            </optgroup>
                                            <optgroup label={t('standardProcessingCodesOptgroup')}>
                                              {processingCodes.map(pc => (
                                                <option key={pc.processing_code_id} value={pc.processing_name}>
                                                  {pc.processing_name}
                                                </option>
                                              ))}
                                            </optgroup>
                                            {!processingCodes.some(pc => pc.processing_name === st.step_name) && !['金型', 'プラグ', 'カッター', '水冷盤', '枠', '押板'].includes(st.step_name) && (
                                              <option value={st.step_name}>{st.step_name}</option>
                                            )}
                                          </select>
                                          {isSelected && (
                                            <span style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 700, flexShrink: 0 }}>🎯</span>
                                          )}
                                        </div>
                                      </td>
                                      <td style={{ padding: '4px 4px' }}>
                                        <input
                                          type="number"
                                          step="any"
                                          className="form-input"
                                          style={{ height: 24, fontSize: 10, padding: '2px 4px' }}
                                          value={st.estimated_hours || ''}
                                          onFocus={() => setSelectedStepNo(st.step_no)}
                                          onClick={() => setSelectedStepNo(st.step_no)}
                                          onChange={e => { setSelectedStepNo(st.step_no); updateStep(idx, 'estimated_hours', e.target.value ? Number(e.target.value) : null) }}
                                          placeholder="h"
                                        />
                                      </td>
                                      <td style={{ padding: '4px 4px' }}>
                                        <select
                                          className="form-input"
                                          style={{ height: 24, fontSize: 10, padding: '2px 4px' }}
                                          value={st.assigned_to || ''}
                                          onFocus={() => setSelectedStepNo(st.step_no)}
                                          onClick={() => setSelectedStepNo(st.step_no)}
                                          onChange={e => { setSelectedStepNo(st.step_no); updateStep(idx, 'assigned_to', e.target.value) }}
                                        >
                                          <option value="">— {t('unassigned')} —</option>
                                          {employees.map(emp => (
                                            <option key={emp.employee_id} value={emp.employee_id}>
                                              {emp.employee_name}
                                            </option>
                                          ))}
                                        </select>
                                      </td>
                                      <td style={{ textAlign: 'center', padding: '4px 2px' }}>
                                        <button
                                          type="button"
                                          onClick={(e) => { e.stopPropagation(); removeStep(idx) }}
                                          style={{ background: 'none', border: 'none', color: 'var(--status-error)', cursor: 'pointer', padding: 2 }}
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </td>
                                    </tr>
                                  )
                                })
                              )}
                            </tbody>
                          </table>
                        </div>

                        <button
                          type="button"
                          onClick={addStep}
                          className="btn btn-secondary"
                          style={{ height: 24, padding: '0 10px', fontSize: 10, gap: 4, fontWeight: 600 }}
                        >
                          <Plus size={12} />
                          <span>{t('addStep')}</span>
                        </button>
                      </div>

                      {/* Column 2: Actual Machining Worklogs & Daily Log History */}
                      <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={13} />
                            {t('worklogsTitle')}
                            {selectedStepNo != null && (
                              <span 
                                className="badge badge--info" 
                                style={{ fontSize: 9, cursor: 'pointer', marginLeft: 4 }}
                                onClick={() => setSelectedStepNo(null)}
                                title={tText('Bấm để xem tất cả nhật ký', 'クリックしてすべてのログを表示')}
                              >
                                🎯 {tText('STT', '工程')} {selectedStepNo}: {activeStepObj?.step_name || ''} ({tText('✕ Xem tất cả', '✕ すべて表示')})
                              </span>
                            )}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {filteredWorkLogs.length > 0 && (
                              <span className="badge badge--info" style={{ fontSize: 9 }}>
                                {t('totalActualHours')}: {filteredWorkLogs.reduce((sum, l) => sum + (Number(l.hours_spent) || 0), 0)}h
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenWorklogModal()}
                              className="btn btn-secondary"
                              style={{ height: 22, padding: '0 8px', fontSize: 10, gap: 4, fontWeight: 600, background: 'color-mix(in srgb, var(--accent) 12%, transparent)', color: 'var(--accent)', borderColor: 'var(--accent)' }}
                            >
                              <Plus size={11} />
                              <span>+ {tText('Thêm nhật ký', 'ログ追加')}</span>
                            </button>
                          </div>
                        </div>

                        {filteredWorkLogs.length === 0 ? (
                          <div className="card-flat" style={{ padding: 16, textAlign: 'center', background: 'var(--bg-surface-2)', border: '1px dashed var(--border-default)', borderRadius: 6 }}>
                            <Clock size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 6px' }} />
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
                              {selectedStepNo != null 
                                ? tText(`Chưa có nhật ký gia công cho công đoạn "${activeStepObj?.step_name || selectedStepNo}".`, `工程 "${activeStepObj?.step_name || selectedStepNo}" の加工ログはまだありません。`)
                                : t('worklogsEmpty')
                              }
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenWorklogModal()}
                              className="btn btn-secondary"
                              style={{ height: 24, padding: '0 10px', fontSize: 10, gap: 4 }}
                            >
                              <Plus size={12} />
                              <span>{tCommon('addNew')}</span>
                            </button>
                          </div>
                        ) : (
                          <div style={{ overflowX: 'auto', border: '1px solid var(--border-default)', borderRadius: 6, maxHeight: 220, overflowY: 'auto' }}>
                            <table className="data-table" style={{ width: '100%', fontSize: 10 }}>
                              <thead>
                                <tr style={{ background: 'var(--bg-surface-2)' }}>
                                  <th style={{ width: 75, padding: '3px 4px', whiteSpace: 'nowrap' }}>{t('workDate')}</th>
                                  <th style={{ width: 90, padding: '3px 4px', whiteSpace: 'nowrap' }}>{t('worker')}</th>
                                  <th style={{ width: 75, padding: '3px 4px', whiteSpace: 'nowrap' }}>{t('step')}</th>
                                  <th style={{ width: 45, padding: '3px 4px', textAlign: 'center', whiteSpace: 'nowrap' }}>{t('actualHours')}</th>
                                  <th style={{ padding: '3px 6px' }}>{t('statusNotes')}</th>
                                  <th style={{ padding: '3px 4px', textAlign: 'center', width: 40, whiteSpace: 'nowrap' }}>{tCommon('action')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredWorkLogs.map(log => {
                                  // Determine the processing/operation name to display
                                  const procName = log.processing_codes?.processing_name 
                                    || log.job_step?.step_name 
                                    || '—'
                                  return (
                                    <tr key={log.log_id}>
                                      <td style={{ padding: '3px 4px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                                        {log.work_date ? log.work_date.substring(0, 10) : '—'}
                                      </td>
                                      <td style={{ padding: '3px 4px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 90 }}>
                                        {log.employees?.employee_name || '—'}
                                      </td>
                                      <td style={{ padding: '3px 4px', fontSize: 9, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 75 }}>
                                        {procName}
                                      </td>
                                      <td style={{ padding: '3px 4px', textAlign: 'center', fontWeight: 700, color: 'var(--accent)', whiteSpace: 'nowrap' }}>
                                        {log.hours_spent}h
                                      </td>
                                      <td style={{ padding: '3px 6px' }}>
                                        {log.is_finished ? (
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span className="badge badge--success" style={{ fontSize: 8, flexShrink: 0 }}>{tEquipment('statusCompleted')}</span>
                                            {(log.notes || log.description) && (
                                              <span style={{ color: 'var(--text-muted)' }}>{log.notes || log.description}</span>
                                            )}
                                          </div>
                                        ) : (
                                          <span style={{ color: 'var(--text-muted)' }}>{log.notes || log.description || '—'}</span>
                                        )}
                                      </td>
                                      <td style={{ padding: '3px 4px', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                          <button
                                            type="button"
                                            onClick={() => handleOpenWorklogModal(log)}
                                            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 2 }}
                                            title={tText('Sửa nhật ký', 'ログ編集')}
                                          >
                                            <Pencil size={12} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteWorklog(log.log_id)}
                                            style={{ background: 'none', border: 'none', color: 'var(--status-error)', cursor: 'pointer', padding: 2 }}
                                            title={tText('Xóa nhật ký', 'ログ削除')}
                                          >
                                            <Trash2 size={12} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                    </div>
                  )
                })()}
              </div>

              {/* ── Bottom Submit Actions ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => handleNavigateExit('cancel')}
                  className="btn btn-secondary"
                  style={{ height: 32, padding: '0 16px', fontSize: 12 }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ height: 32, padding: '0 20px', fontSize: 12, gap: 6, background: editJobId ? 'var(--status-warning)' : 'var(--accent)', color: '#fff', fontWeight: 700 }}
                >
                  <CheckCircle2 size={15} />
                  <span>{editJobId ? t('submitUpdate') : t('submitCreate')}</span>
                </button>
              </div>

            </form>
          )}
        </div>

        {/* ── RIGHT PANEL: Realtime Duplicate & Reference Panel (lg:col-span-4 / 34% on Desktop, 100% on Mobile) ── */}
        <div className="lg:col-span-4 overflow-y-auto">
          <RealtimeReferencePanel
            customerSearch={customerSearch}
            productCode={productCode}
            designCode={designCode}
            systemCode={systemCode}
            jobCode={jobCode}
            onSelectJob={loadJobForEditing}
          />
        </div>
      </div>

      {/* ── Submit Confirmation & Diff Comparison Modal ── */}
      <QuickMoldJobConfirmModal
        visible={showConfirmModal}
        editJobId={editJobId}
        formData={{
          company_id: companyId || undefined,
          product_code: productCode,
          product_name: productName,
          customer_product_name: customerProductName,
          design_code: designCode,
          design_length: designLength ? Number(designLength) : null,
          design_width: designWidth ? Number(designWidth) : null,
          design_height: designHeight ? Number(designHeight) : null,
          design_depth: designDepth ? Number(designDepth) : null,
          cavity_count: cavityCount ? Number(cavityCount) : null,
          cutline_length: cutlineLength ? Number(cutlineLength) : null,
          cutline_width: cutlineWidth ? Number(cutlineWidth) : null,
          corner_r: cornerR,
          chamfer_c: chamferC,
          orientation,
          setup_type: setupType,
          draft_angle: draftAngle ? Number(draftAngle) : null,
          under_depth: underDepth ? Number(underDepth) : null,
          undercut_spec: undercutSpec,
          text_content: textContent,
          plug_type: plugType,
          has_separate_cutter: hasSeparateCutter,
          pocket_prototype: pocketPrototype,
          system_code: systemCode,
          display_name: displayName,
          physical_stamp: physicalStamp,
          job_code: jobCode,
          job_name: jobName,
          job_type_id: jobTypeId || null,
          job_category: JOB_TYPE_TO_CATEGORY[jobTypeId] || 'OTHER',
          responsible_id: responsibleId || undefined,
          start_date: startDate || undefined,
          deadline: deadline || undefined,
          ship_date: shipDate || undefined,
          price_quote_required: priceQuoteRequired,
          unit_price: unitPrice ? Number(unitPrice) : null,
          notes,
          steps,
          customerName: selectedCustomerName
        }}
        initialData={initialLoadedData}
        onConfirm={commitSave}
        onClose={() => setShowConfirmModal(false)}
        saving={saving}
      />

      {/* ── Worklog Create / Edit Modal ── */}
      <WorklogEditModal
        isOpen={isWorklogModalOpen}
        onClose={() => setIsWorklogModalOpen(false)}
        onSave={handleSaveWorklog}
        initialData={editingWorklog}
        employees={employees}
        steps={steps}
        processingCodes={processingCodes}
        selectedStepNo={selectedStepNo}
      />

      {/* ── Exit Unsaved Changes Confirmation Modal ── */}
      <UnsavedChangesModal
        isOpen={showExitConfirmModal}
        onClose={() => setShowExitConfirmModal(false)}
        onSaveAndExit={handleSaveAndExit}
        onDiscardAndExit={handleDiscardAndExit}
      />

      {/* ── AI Manufacturing Sheet OCR Modal ── */}
      <ManufacturingSheetOCRModal
        isOpen={isOcrModalOpen}
        onClose={() => setIsOcrModalOpen(false)}
        onSuccess={(res) => {
          setIsOcrModalOpen(false)
          if (res?.job_id) {
            router.push(`/equipment/jobs/${res.job_id}`)
          } else if (res?.product_id) {
            loadProductById(res.product_id)
          }
        }}
      />
    </div>
  )
}
