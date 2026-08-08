'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  TrendingUp, Clock, Truck, CheckCircle2,
  Calendar, Wrench, Hammer, PenTool, AlertTriangle,
  Building2, ExternalLink, Layers, ShieldAlert,
  Package, Crop, Pin, FileText, MapPin, Box,
  Scale, Ruler, CircleDot, LayoutGrid, List,
  GitFork, CornerDownRight, Link2, ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import EquipmentQuickPreviewModal, { type QuickPreviewItem } from './EquipmentQuickPreviewModal'
import { isPrototypeDesignOrMold, getEffectiveDesignStatus, getDesignStatusBadgeInfo, formatCutterDisplayCode, formatMoldDisplayCode, formatCutterSpecString, formatCutlineSpecString, getCutlineSpecs, formatCornerRDisplay, formatChamferCDisplay, extractBaseMassCode, formatRackLocationDisplay, lookupCavType } from '@/lib/utils/moldNaming'
import { updateRevisionStatus } from '@/app/actions/engineering'

type JobItem = {
  job_id: string
  job_code: string
  job_name: string | null
  job_status: string | null
  mold_deadline: string | null
  created_at: string
  physical_mold_id?: string | null
  cutter_id?: string | null
  equipment_id?: string | null
  design_revision_id?: string | null
}

interface TabOverviewProps {
  productId: string
  companyId: string
  productCode: string
  productName: string | null
  productNameInternal: string | null
  customerProductName: string | null
  productDescription: string | null
  productStatus: string
  pocketCount: number | null
  piecesPerBox: number | null
  primaryPlasticCode: string | null
  primaryPlasticSpec: string | null
  firstShipmentDate: string | null
  notes: string | null
}

type DesignRevItem = {
  revision_id: string
  design_code: string | null
  revision_number: number
  status: string
  design_length: number | null
  design_width: number | null
  design_height: number | null
  design_depth: number | null
  cutline_length: number | null
  cutline_width: number | null
  cavity_count: number | null
  pocket_numbers: number | null
  cavity_pitch_mm: number | null
  machine_feed_pitch_mm: number | null
  plastic_type_designed: string | null
  corner_r: number | null
  chamfer_c: number | null
  draft_angle: number | string | null
  under_depth: number | string | null
  orientation: string | null
  setup_type: string | null
  plug_type: string | null
  has_separate_cutter: boolean | null
  customer_tray_name: string | null
  tray_info: string | null
  version_note?: string | null
  change_summary?: string | null
  created_at: string
  designer: string | null
  design_category?: string | null
  parent_design_id?: string | null
}

type CustomerInfo = {
  company_id: string
  company_code: string
  company_name: string
  tel: string | null
  address: string | null
}

type RecentOrderLine = {
  line_id: string
  quantity: number
  unit: string | null
  created_at: string
  orders: {
    order_id: string
    order_no: string
    order_date: string | null
    order_status: string
    notes?: string | null
    delivery_sites?: {
      site_name: string | null
      address: string | null
      contact_person: string | null
      phone: string | null
    } | null
  } | null
}

type MoldDetail = {
  physical_mold_id: string
  system_code: string | null
  display_name: string | null
  device_status: string | null
  usage_status: string | null
  mold_type: string | null
  piece_count: number | null
  actual_length_mm: string | null
  actual_width_mm: string | null
  actual_height_mm: string | null
  actual_weight: string | null
  manufacturing_date: string | null
  rack_layers: { layer_code: string | null; racks: { rack_code: string | null } | null } | null
  keeper_company: { company_code: string | null; company_name: string | null } | null
  mold_revisions: { design_revision_id: string | null } | null
}

type EquipDetail = {
  equipment_id: string
  equipment_code: string | null
  display_name: string | null
  equipment_type: string | null
  usage_status: string | null
  device_status: string | null
  design_revision_id: string | null
  actual_length_mm?: string | null
  actual_width_mm?: string | null
  actual_height_mm?: string | null
  actual_weight?: string | null
  rack_layers: { layer_code: string | null; racks: { rack_code: string | null } | null } | null
  keeper_company: { company_code: string | null; company_name: string | null } | null
}

type CutterDetail = {
  cutter_id: string
  cutter_no: string | null
  cutter_name: string | null
  cutter_type: string | null
  usage_status: string | null
  cutter_presence: boolean | null
  design_revision_id: string | null
  cutter_length_mm: number | null
  cutter_width_mm: number | null
  rack_layers: { layer_code: string | null; racks: { rack_code: string | null } | null } | null
  keeper_company: { company_code: string | null; company_name: string | null } | null
  is_shared?: boolean
  linked_rev_id?: string | null
}

const REV_STATUS_BADGE: Record<string, string> = {
  APPROVED: 'badge badge--success',
  RELEASED: 'badge badge--info',
  SUBMITTED: 'badge badge--warning',
  DRAFT: 'badge badge--neutral',
  REJECTED: 'badge badge--error',
  SUPERSEDED: 'badge badge--neutral',
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'badge badge--success',
  IN_USE: 'badge badge--success',
  IN_STOCK: 'badge badge--info',
  MAINTENANCE: 'badge badge--warning',
  LOAN: 'badge badge--warning',
  NORMAL: 'badge badge--success',
  DISPOSED: 'badge badge--error',
}

/* ────────── helper: info row ────────── */
function InfoRow({ label, value, mono, accent }: { label: string; value: string | number | null | undefined; mono?: boolean; accent?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '2px 0', lineHeight: 1.6 }}>
      <span style={{
        fontSize: 11, color: '#475569', fontWeight: 600, fontFamily: 'var(--font-jp)',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 13, fontWeight: 700,
        fontFamily: mono ? 'monospace' : 'var(--font-jp)',
        color: accent ? 'var(--accent)' : (value == null ? '#94A3B8' : '#0F172A'),
        maxWidth: '72%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
      }}>
        {value ?? '—'}
      </span>
    </div>
  )
}

/* ────────── helper: spec cell (inline compact row) ────────── */
function SpecCell({
  label, value, mono = true, isDiff, diffLabel, span, badge
}: {
  label: string
  value: string | number | null | undefined
  mono?: boolean
  isDiff?: boolean
  diffLabel?: string
  bg?: string
  color?: string
  border?: string
  span?: number
  badge?: React.ReactNode
}) {
  const displayVal = value == null || value === '' ? '—' : String(value)
  const isEmpty = displayVal === '—'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      gridColumn: span ? `span ${span}` : undefined,
      lineHeight: 1.6,
      ...(isDiff ? {
        background: 'var(--tint-orange-bg)',
        borderRadius: 3, padding: '0 4px',
      } : {})
    }}>
      <span style={{
        fontSize: 11, fontWeight: 600, color: '#475569', fontFamily: 'var(--font-jp)',
        whiteSpace: 'nowrap', minWidth: 78, flexShrink: 0,
      }}>
        {label}
      </span>
      {isDiff && <span className="badge badge--warning" style={{ fontSize: 8, padding: '0 4px', verticalAlign: 'super' }}>{diffLabel || 'MOD'}</span>}
      <span style={{
        fontSize: 13, fontWeight: 700,
        fontFamily: mono ? 'monospace' : 'var(--font-jp)',
        color: isDiff ? 'var(--tint-orange-text)' : (isEmpty ? '#94A3B8' : '#0F172A'),
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {displayVal}
      </span>
      {badge}
    </div>
  )
}

export function TabOverview(props: TabOverviewProps) {
  const {
    productId, companyId, productCode, productName, productNameInternal,
    customerProductName, productDescription, productStatus,
    pocketCount, piecesPerBox, primaryPlasticCode, primaryPlasticSpec,
    firstShipmentDate, notes
  } = props

  const tPC = useTranslations('ProductCenter')
  const tProd = useTranslations('Products')
  const tMaster = useTranslations('Master')
  const tCust = useTranslations('Customers')
  const tCommon = useTranslations('Common')

  const supabase = createClient()

  const [period, setPeriod] = useState<'ALL' | 'MONTH' | 'QUARTER' | 'YEAR'>('ALL')
  const [loading, setLoading] = useState(true)

  // Metrics
  const [totalOrderQty, setTotalOrderQty] = useState(0)
  const [totalOrderCount, setTotalOrderCount] = useState(0)
  const [totalHours, setTotalHours] = useState(0)
  const [totalDelivered, setTotalDelivered] = useState(0)
  const [onTimeRate, setOnTimeRate] = useState(100)

  // Design Revisions
  const [activeRev, setActiveRev] = useState<DesignRevItem | null>(null)
  const [allRevs, setAllRevs] = useState<DesignRevItem[]>([])
  const [selectedRevId, setSelectedRevId] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    if (!activeRev) return
    setUpdatingStatus(true)
    try {
      await updateRevisionStatus(activeRev.revision_id, newStatus)
      const updated = { ...activeRev, status: newStatus }
      setActiveRev(updated)
      setAllRevs(prev => prev.map(r => r.revision_id === activeRev.revision_id ? updated : r))
    } catch (err) {
      console.error('Failed to update revision status:', err)
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Customer Info
  const [customer, setCustomer] = useState<CustomerInfo | null>(null)

  // Equipment Details
  const [moldDetails, setMoldDetails] = useState<MoldDetail[]>([])
  const [equipDetails, setEquipDetails] = useState<EquipDetail[]>([])
  const [cutterDetails, setCutterDetails] = useState<CutterDetail[]>([])
  const [previewItem, setPreviewItem] = useState<QuickPreviewItem | null>(null)
  const [selectedEquip, setSelectedEquip] = useState<{ type: 'mold' | 'cutter' | 'equip'; id: string; code: string } | null>(null)
  const [equipFilterMode, setEquipFilterMode] = useState<'revision' | 'all'>('revision')
  const [equipViewMode, setEquipViewMode] = useState<'list' | 'grid'>('grid')
  const [equipCategoryTab, setEquipCategoryTab] = useState<string>('ALL')

  // Active Job
  const [activeJob, setActiveJob] = useState<{ id: string; code: string; status: string; deadline: string; name: string } | null>(null)
  const [allJobs, setAllJobs] = useState<JobItem[]>([])

  // Recent Orders
  const [recentOrders, setRecentOrders] = useState<RecentOrderLine[]>([])
  const [selectedOrderLine, setSelectedOrderLine] = useState<RecentOrderLine | null>(null)
  const [alerts, setAlerts] = useState<Array<{ id: string; type: 'warning' | 'info'; text: string }>>([])

  useEffect(() => {
    async function loadOverview() {
      setLoading(true)
      try {
        // Customer
        if (companyId) {
          const { data: cData } = await supabase
            .from('companies')
            .select('company_id, company_code, company_name, tel, address')
            .eq('company_id', companyId)
            .single()
          if (cData) setCustomer(cData as unknown as CustomerInfo)
        }

        // Design Revisions (expanded select)
        const { data: revs } = await supabase
          .from('design_revisions')
          .select(`
            revision_id, design_code, revision_number, status,
            design_length, design_width, design_height, design_depth,
            cutline_length, cutline_width, cavity_count, pocket_numbers, cavity_pitch_mm, machine_feed_pitch_mm,
            plastic_type_designed, corner_r, chamfer_c, draft_angle, under_depth, orientation, setup_type, plug_type,
            has_separate_cutter, customer_tray_name, tray_info, version_note, created_at, designer,
            design_category, parent_design_id
          `)
          .eq('product_id', productId)
        // Sort revs so newest revision is ALWAYS FIRST (by R-number DESC, created_at DESC)
        const revList = ((revs || []) as unknown as DesignRevItem[]).sort((a, b) => {
          const revA = Number(a.revision_number || a.design_code?.match(/R(\d+)/i)?.[1] || 0)
          const revB = Number(b.revision_number || b.design_code?.match(/R(\d+)/i)?.[1] || 0)
          if (revB !== revA) return revB - revA
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        })
        setAllRevs(revList)

        if (revList.length > 0) {
          // Always pick the newest revision (revList[0]) by default
          const newest = revList[0]
          setActiveRev(newest)
          setSelectedRevId(newest.revision_id)
        }

        const revIds = revList.map(r => r.revision_id)

        // Physical Molds & Equipment (Unified Equipment Source linked directly to design_revisions or product code)
        if (revIds.length > 0) {
          const { data: pData } = await supabase.from('products').select('product_code').eq('product_id', productId).single()
          const prodCode = pData?.product_code || ''
          let equipQuery = supabase
            .from('equipment')
            .select(`
              equipment_id, equipment_code, display_name, equipment_type, sub_type, usage_status, device_status,
              design_revision_id, mold_type, piece_count, actual_length_mm, actual_width_mm, actual_height_mm,
              actual_weight, manufacturing_date,
              rack_layers(layer_code, racks(rack_code)),
              keeper_company:companies!equipment_keeper_company_id_fkey(company_code, company_name)
            `)
          if (prodCode) {
            equipQuery = equipQuery.or(`design_revision_id.in.(${revIds.join(',')}),equipment_code.ilike.%${prodCode}%,display_name.ilike.%${prodCode}%`)
          } else {
            equipQuery = equipQuery.in('design_revision_id', revIds)
          }
          const { data: equips } = await equipQuery

          let allEquipList: any[] = equips || []

          // Fallback: Check physical_molds if any physical mold is missing from equipment table
          const existingMoldCodes = new Set(allEquipList.filter(e => ['MOLD', 'WATER_BASE', 'PRESSURE_BASE'].includes(e.equipment_type)).map(e => e.equipment_code))
          const { data: pMolds } = await supabase
            .from('physical_molds')
            .select(`
              physical_mold_id, system_code, display_name, device_status, usage_status,
              mold_type, piece_count, actual_length_mm, actual_width_mm, actual_height_mm,
              actual_weight, manufacturing_date,
              rack_layers(layer_code, racks(rack_code))
            `)
            .limit(50)

          if (pMolds) {
            pMolds.forEach((pm: any) => {
              if (!existingMoldCodes.has(pm.system_code)) {
                allEquipList.push({
                  equipment_id: pm.physical_mold_id,
                  equipment_code: pm.system_code,
                  display_name: pm.display_name,
                  equipment_type: 'MOLD',
                  sub_type: pm.mold_type,
                  usage_status: pm.usage_status,
                  device_status: pm.device_status,
                  mold_type: pm.mold_type,
                  piece_count: pm.piece_count,
                  actual_length_mm: pm.actual_length_mm,
                  actual_width_mm: pm.actual_width_mm,
                  actual_height_mm: pm.actual_height_mm,
                  actual_weight: pm.actual_weight,
                  manufacturing_date: pm.manufacturing_date,
                  rack_layers: pm.rack_layers,
                  keeper_company: pm.keeper_company,
                  design_revision_id: pm.mold_revision_id
                })
              }
            })
          }

          // Partition allEquipList into Molds, Cutters, and Other Auxiliary Equipments
          const moldEquips = allEquipList.filter((eq: any) =>
            ['MOLD', 'WATER_BASE', 'PRESSURE_BASE'].includes(eq.equipment_type) || eq.equipment_type?.includes('金型')
          )
          const cutterEquips = allEquipList.filter((eq: any) =>
            ['CUTTER_SEPARATE', 'CUTTER_INLINE', 'CUTTER', '抜型'].includes(eq.equipment_type)
          )
          const auxiliaryEquips = allEquipList.filter((eq: any) =>
            !['MOLD', 'WATER_BASE', 'PRESSURE_BASE'].includes(eq.equipment_type) &&
            !['CUTTER_SEPARATE', 'CUTTER_INLINE', 'CUTTER', '抜型'].includes(eq.equipment_type) &&
            !eq.equipment_type?.includes('金型')
          )

          // Map Molds
          const moldDetailsMapped = moldEquips.map((eq: any) => ({
            physical_mold_id: eq.equipment_id,
            system_code: eq.equipment_code,
            display_name: eq.display_name,
            device_status: eq.device_status,
            usage_status: eq.usage_status,
            mold_type: eq.mold_type || eq.sub_type,
            piece_count: eq.piece_count,
            actual_length_mm: eq.actual_length_mm,
            actual_width_mm: eq.actual_width_mm,
            actual_height_mm: eq.actual_height_mm,
            actual_weight: eq.actual_weight,
            manufacturing_date: eq.manufacturing_date,
            rack_layers: eq.rack_layers,
            keeper_company: eq.keeper_company,
            mold_revisions: { design_revision_id: eq.design_revision_id || null }
          }))
          setMoldDetails(moldDetailsMapped as unknown as MoldDetail[])

          // Set Auxiliary Equipment (only non-molds, non-cutters)
          setEquipDetails(auxiliaryEquips as unknown as EquipDetail[])

          // Check for shared cutters via mold_design_cutters junction table
          const { data: juncs } = await supabase
            .from('mold_design_cutters')
            .select('mold_design_id, cutter_id')
            .in('mold_design_id', revIds)

          let sharedCutters: any[] = []
          if (juncs && juncs.length > 0) {
            const juncCutterIds = juncs.map(j => j.cutter_id).filter(Boolean)
            if (juncCutterIds.length > 0) {
              const { data: sCutters } = await supabase
                .from('equipment')
                .select(`
                  equipment_id, equipment_code, display_name, equipment_type, sub_type, usage_status, device_status,
                  design_revision_id, actual_length_mm, actual_width_mm, actual_height_mm,
                  rack_layers(layer_code, racks(rack_code)),
                  keeper_company:companies!equipment_keeper_company_id_fkey(company_code, company_name)
                `)
                .in('equipment_id', juncCutterIds)

              if (sCutters) {
                sharedCutters = sCutters.map(sc => {
                  const matchJunc = juncs.find(j => j.cutter_id === sc.equipment_id)
                  return {
                    cutter_id: sc.equipment_id,
                    cutter_no: sc.equipment_code,
                    cutter_name: sc.display_name,
                    cutter_type: sc.sub_type,
                    usage_status: sc.usage_status,
                    cutter_presence: sc.device_status !== 'DISPOSED',
                    design_revision_id: sc.design_revision_id,
                    cutter_length_mm: sc.actual_length_mm ? Number(sc.actual_length_mm) : null,
                    cutter_width_mm: sc.actual_width_mm ? Number(sc.actual_width_mm) : null,
                    rack_layers: sc.rack_layers,
                    keeper_company: sc.keeper_company,
                    is_shared: sc.design_revision_id ? !revIds.includes(sc.design_revision_id) : true,
                    linked_rev_id: matchJunc?.mold_design_id || sc.design_revision_id
                  }
                })
              }
            }
          }

          const directMapped = cutterEquips.map((dc: any) => ({
            cutter_id: dc.equipment_id,
            cutter_no: dc.equipment_code,
            cutter_name: dc.display_name,
            cutter_type: dc.sub_type,
            usage_status: dc.usage_status,
            cutter_presence: dc.device_status !== 'DISPOSED',
            design_revision_id: dc.design_revision_id,
            cutter_length_mm: dc.actual_length_mm ? Number(dc.actual_length_mm) : null,
            cutter_width_mm: dc.actual_width_mm ? Number(dc.actual_width_mm) : null,
            rack_layers: dc.rack_layers,
            keeper_company: dc.keeper_company,
            is_shared: false,
            linked_rev_id: dc.design_revision_id
          }))

          // Deduplicate cutters by cutter_no (equipment_code) or cutter_id
          const cutterMap = new Map<string, any>()
          directMapped.forEach(c => {
            const key = c.cutter_no || c.cutter_id
            cutterMap.set(key, c)
          })
          sharedCutters.forEach(c => {
            const key = c.cutter_no || c.cutter_id
            if (!cutterMap.has(key)) {
              cutterMap.set(key, c)
            }
          })

          setCutterDetails(Array.from(cutterMap.values()) as unknown as CutterDetail[])
        }

        // Jobs (select extra equipment link columns)
        let jobQuery = supabase.from('jobs').select('job_id, job_code, job_name, job_status, mold_deadline, created_at, physical_mold_id, equipment_id, design_revision_id')
        if (revIds.length > 0) {
          jobQuery = jobQuery.or(`product_id.eq.${productId},design_revision_id.in.(${revIds.join(',')})`)
        } else {
          jobQuery = jobQuery.eq('product_id', productId)
        }
        const { data: jobs } = await jobQuery.order('created_at', { ascending: false })

        if (jobs && jobs.length > 0) {
          setAllJobs(jobs as unknown as JobItem[])
          const running = jobs.find((j: any) => j.job_status === 'IN_PROGRESS') || jobs[0]
          setActiveJob({
            id: running.job_id,
            code: running.job_code,
            status: running.job_status || 'NOT_STARTED',
            deadline: running.mold_deadline || '—',
            name: running.job_name || ''
          })
        }

        const jobIds = (jobs || []).map((j: any) => j.job_id)
        if (jobIds.length > 0) {
          const { data: logs } = await supabase
            .from('work_logs')
            .select('hours_spent')
            .in('job_id', jobIds)

          if (logs) {
            const sumHours = logs.reduce((acc: number, l: any) => acc + (l.hours_spent || 0), 0)
            setTotalHours(Math.round(sumHours * 10) / 10)
          }
        }

        // Order Lines
        let linesData: any[] | null = null
        let lCountVal = 0
        const { data: lines, count: lCount, error: linesErr } = await supabase
          .from('order_lines')
          .select(`
            line_id, quantity, unit, created_at,
            orders(
              order_id, order_no, order_date, order_status, notes,
              companies:company_id(company_name, company_code)
            )
          `, { count: 'exact' })
          .eq('product_id', productId)
          .order('created_at', { ascending: false })

        if (linesErr) {
          const { data: fallbackLines, count: fbCount } = await supabase
            .from('order_lines')
            .select(`
              line_id, quantity, unit, created_at,
              orders(
                order_id, order_no, order_date, order_status, notes
              )
            `, { count: 'exact' })
            .eq('product_id', productId)
            .order('created_at', { ascending: false })
          linesData = fallbackLines
          lCountVal = fbCount || 0
        } else {
          linesData = lines
          lCountVal = lCount || 0
        }

        if (linesData && linesData.length > 0) {
          setTotalOrderCount(lCountVal || linesData.length)
          const sumQty = linesData.reduce((acc: number, l: any) => acc + (l.quantity || 0), 0)
          setTotalOrderQty(sumQty)
          const mappedLines = (linesData.slice(0, 5) as unknown) as RecentOrderLine[]
          setRecentOrders(mappedLines)
          setSelectedOrderLine(mappedLines[0])

          const shippedLines = linesData.filter((l: any) => l.orders?.order_status === 'COMPLETED' || l.orders?.order_status === 'SHIPPED')
          const shippedQty = shippedLines.reduce((acc: number, l: any) => acc + (l.quantity || 0), 0)
          setTotalDelivered(shippedQty)

          const totalValidOrders = linesData.filter((l: any) => l.orders?.order_status === 'COMPLETED').length
          if (totalValidOrders > 0) {
            setOnTimeRate(95)
          }
        }

        // Alerts
        const alertList: Array<{ id: string; type: 'warning' | 'info'; text: string }> = []
        if (jobs) {
          const overdue = jobs.filter((j: any) => j.mold_deadline && new Date(j.mold_deadline) < new Date() && j.job_status !== 'COMPLETED')
          if (overdue.length > 0) {
            alertList.push({ id: 'overdue', type: 'warning', text: `Jobs overdue: ${overdue.length}` })
          }
        }
        if (revList.length === 0) {
          alertList.push({ id: 'no_rev', type: 'info', text: tCommon('noData') })
        }
        setAlerts(alertList)

      } catch (err) {
        console.error('Error loading overview tab:', err)
      } finally {
        setLoading(false)
      }
    }
    if (productId) loadOverview()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, companyId, period])

  const trayDims = activeRev
    ? [activeRev.design_length, activeRev.design_width, activeRev.design_height || activeRev.design_depth].filter(Boolean).join(' × ')
    : ''
  const activeCutlineSpecs = getCutlineSpecs(activeRev)
  const cutlineBase = activeCutlineSpecs.formatted
  const productDimsSpec = cutlineBase !== '—' ? cutlineBase : ''

  const getRack = (rl: any) => formatRackLocationDisplay(rl)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ═══ ROW 1: Compact Stats Strip ═══ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
        padding: '6px 10px', borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-default)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{tPC('tabOverviewLabel')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <TrendingUp size={12} style={{ color: 'var(--tint-purple-text)' }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('kpiTotalOrders')}</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{totalOrderQty.toLocaleString()}</span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>({totalOrderCount}PO)</span>
          </div>
          <div style={{ width: 1, height: 14, background: 'var(--border-default)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} style={{ color: 'var(--tint-orange-text)' }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('kpiMachiningHours')}</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{totalHours}h</span>
          </div>
          <div style={{ width: 1, height: 14, background: 'var(--border-default)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Truck size={12} style={{ color: 'var(--tint-teal-text)' }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('kpiDelivered')}</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{totalDelivered.toLocaleString()}</span>
          </div>
          <div style={{ width: 1, height: 14, background: 'var(--border-default)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={12} style={{ color: 'var(--tint-blue-text)' }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{tPC('kpiOnTime')}</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{onTimeRate}%</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--bg-surface-2)', padding: '2px 4px', borderRadius: 4, border: '1px solid var(--border-default)' }}>
          {(['ALL', 'MONTH', 'QUARTER', 'YEAR'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                fontSize: 9, fontWeight: period === p ? 700 : 500,
                color: period === p ? 'var(--accent)' : 'var(--text-secondary)',
                background: period === p ? 'var(--bg-surface)' : 'none',
                border: period === p ? '1px solid var(--border-default)' : 'none',
                borderRadius: 3, padding: '2px 6px', cursor: 'pointer'
              }}
            >
              {p === 'ALL' ? tCommon('all') : p}
            </button>
          ))}
        </div>
      </div>

        {/* ═══ MAIN 3-COLUMN LAYOUT: Left (250px) | Center (flex 1.5) | Right (max 450px) ═══ */}
      <div style={{ overflowX: 'auto', width: '100%', paddingBottom: 6 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '250px minmax(360px, 1.5fr) minmax(280px, 450px)', minWidth: '1020px', gap: 12 }}>

        {/* 👈 COLUMN 1 (Left 270px): Product Overview -> Product Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* BOX 1: Thông tin tổng quan (Ảnh sản phẩm + Khách hàng) */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-teal-border)' }}>
            <div style={{
              background: 'var(--tint-teal-bg)', borderBottom: '1px solid var(--tint-teal-border)',
              padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6
            }}>
              <Package size={14} style={{ color: 'var(--tint-teal-text)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tint-teal-text)' }}>{tPC('boxOverviewTitle')}</span>
            </div>
            {/* Product Photo Thumbnail - 120x120 placeholder */}
            <div style={{
              width: '100%', height: 120,
              background: 'linear-gradient(135deg, var(--bg-surface-2) 0%, var(--bg-surface) 100%)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative'
            }}>
              <Package size={40} style={{ color: 'var(--border-default)', opacity: 0.5 }} />
              <span style={{
                position: 'absolute', bottom: 6, right: 8,
                fontSize: 9, color: 'var(--text-muted)', fontStyle: 'italic', opacity: 0.7
              }}>
                {tPC('noPhotoPlaceholder')}
              </span>
            </div>
            {/* Customer Quick Header */}
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{tCust('customer')}</span>
                {(customer?.company_id || companyId) && (
                  <Link
                    href={`/master/customers/${customer?.company_id || companyId}`}
                    style={{ fontSize: 10, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}
                  >
                    {tCommon('details')} <ExternalLink size={10} />
                  </Link>
                )}
              </div>
              {(customer?.company_id || companyId) ? (
                <Link
                  href={`/master/customers/${customer?.company_id || companyId}`}
                  style={{
                    fontSize: 13, fontWeight: 700, color: 'var(--accent)', textDecoration: 'none',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    display: 'inline-flex', alignItems: 'center', gap: 4
                  }}
                  title={customer?.company_name || 'Customer Detail'}
                >
                  {customer?.company_name || '—'}
                </Link>
              ) : (
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {customer?.company_name || '—'}
                </div>
              )}
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {customer?.company_code || '—'} {customer?.tel ? `· ${customer.tel}` : ''}
              </div>
            </div>
          </div>

          {/* BOX 2: Thông tin sản phẩm */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-teal-border)' }}>
            <div style={{
              background: 'var(--tint-teal-bg)', borderBottom: '1px solid var(--tint-teal-border)',
              padding: '6px 10px', fontSize: 12, fontWeight: 700, color: 'var(--tint-teal-text)'
            }}>
              {tPC('boxProductDetailsTitle')}
            </div>
            <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <InfoRow label={tProd('productCode')} value={productCode} mono accent />
              <InfoRow label={tPC('internalNameLabel')} value={productNameInternal} />
              <InfoRow label={tProd('productName')} value={productName} />
              <InfoRow label={tPC('customerProductNameLabel')} value={customerProductName} />
              <InfoRow label={tPC('cutlineDimensions')} value={productDimsSpec || '—'} mono />
              <InfoRow label={tProd('pocketCount')} value={pocketCount || activeRev?.pocket_numbers || activeRev?.cavity_count || (() => {
                const text = String(activeRev?.tray_info || activeRev?.customer_tray_name || productDescription || '')
                const m = text.match(/(\d+)\s*(?:個入|取|pocket)/i)
                return m ? m[1] : null
              })()} mono />
              <InfoRow label={tPC('piecesPerBoxLabel')} value={piecesPerBox} mono />
              <InfoRow label={tPC('plasticSpecLabel')} value={primaryPlasticSpec || primaryPlasticCode || activeRev?.plastic_type_designed} mono />
              <InfoRow label={tPC('firstShipmentLabel')} value={firstShipmentDate} mono />
              {notes && (
                <div style={{ marginTop: 4, padding: '4px 6px', background: 'var(--bg-surface-2)', borderRadius: 4, fontSize: 11, color: 'var(--text-secondary)' }}>
                  <strong>{tPC('notesLabel')}:</strong> {notes}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 👆 COLUMN 2 (Center flex 1.25): Specs & Revisions (Top) -> Order History (Middle) -> Delivery Site (Bottom) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* TOP BLOCK: Thông số kỹ thuật, chi tiết thiết kế */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-teal-border)' }}>
            <div style={{
              background: 'var(--tint-teal-bg)', borderBottom: '1px solid var(--tint-teal-border)',
              padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <PenTool size={14} style={{ color: 'var(--tint-teal-text)' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tint-teal-text)' }}>{tPC('boxSpecsDesignTitle')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {activeRev && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--tint-teal-text)' }}>承認状態:</span>
                    <select
                      value={getEffectiveDesignStatus(activeRev, allRevs)}
                      disabled={updatingStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      style={{
                        padding: '2px 6px', borderRadius: 4, fontSize: 11, fontWeight: 700,
                        border: '1px solid var(--tint-teal-border)', cursor: 'pointer',
                        background: 'var(--bg-surface)', color: 'var(--text-primary)'
                      }}
                    >
                      <option value="APPROVED">🟢 承認済 (Đã duyệt)</option>
                      <option value="PENDING_APPROVAL">🟡 承認待ち (Chờ duyệt)</option>
                      <option value="SUPERSEDED">⚪ 舊版 (Đã thay thế)</option>
                      <option value="REJECTED">🔴 不採用 (Không đạt)</option>
                    </select>
                  </div>
                )}
                {activeRev && (
                  <Link
                    href={`/engineering/designs/revisions/${activeRev.revision_id}`}
                    style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}
                  >
                    {activeRev.design_code || 'Design'} <ExternalLink size={11} />
                  </Link>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 0 }}>
              {/* Left Sub-sidebar: Lịch sử phiên bản thiết kế (160px) */}
              <div style={{ width: 160, flexShrink: 0, background: 'var(--bg-surface-2)', padding: 10, display: 'flex', flexDirection: 'column', gap: 6, borderRight: '1px solid var(--border-default)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 4, borderBottom: '1px solid var(--border-default)' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Layers size={14} style={{ color: 'var(--accent)' }} /> {tPC('designHistory')}
                  </span>
                  <span className="badge badge--info font-mono font-bold" style={{ fontSize: 9 }}>
                    {allRevs.length}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflowY: 'auto', flex: 1 }}>
                  {(() => {
                    const processedIds = new Set<string>()
                    type TreeGroup = {
                      parent: DesignRevItem
                      children: Array<{ item: DesignRevItem; relLabel: string }>
                    }
                    const treeGroups: TreeGroup[] = []

                    // 1. Process Mass Production Revisions as Root nodes
                    const massRevs = allRevs.filter(r => !isPrototypeDesignOrMold(r))
                    const protoRevs = allRevs.filter(r => isPrototypeDesignOrMold(r))

                    massRevs.forEach(m => {
                      if (processedIds.has(m.revision_id)) return
                      processedIds.add(m.revision_id)
                      const children: Array<{ item: DesignRevItem; relLabel: string }> = []
                      
                      // Find all matching prototype revisions for this mass production revision
                      const protoMatches = protoRevs.filter(p => p.parent_design_id === m.revision_id || m.parent_design_id === p.revision_id || extractBaseMassCode(p.design_code) === extractBaseMassCode(m.design_code))
                      protoMatches.forEach(proto => {
                        processedIds.add(proto.revision_id)
                        children.push({ item: proto, relLabel: '↳ 試作元' })
                      })
                      
                      treeGroups.push({ parent: m, children })
                    })

                    // 2. Any remaining Standalone / Unconverted Prototype revisions
                    const remainingRevs = allRevs.filter(r => !processedIds.has(r.revision_id))
                    remainingRevs.forEach(r => {
                      treeGroups.push({ parent: r, children: [] })
                    })

                    const renderRevCard = (r: DesignRevItem, isChild = false, relLabel = '') => {
                      const isSelected = selectedRevId === r.revision_id
                      const isProto = isPrototypeDesignOrMold(r)
                      const effStatus = getEffectiveDesignStatus(r, allRevs)
                      const badgeInfo = getDesignStatusBadgeInfo(effStatus)
                      return (
                        <div
                          key={r.revision_id}
                          onClick={() => {
                            setSelectedRevId(r.revision_id)
                            setActiveRev(r)
                          }}
                          style={{
                            display: 'flex', flexDirection: 'column', gap: 2, padding: isChild ? '4px 6px' : '5px 7px',
                            borderRadius: 6, cursor: 'pointer', transition: 'all 0.15s ease',
                            marginLeft: isChild ? 12 : 0,
                            borderLeft: isChild ? '3px solid var(--accent)' : undefined,
                            border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border-default)',
                            background: isSelected ? 'var(--tint-teal-bg)' : 'var(--bg-surface)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: isChild ? 10 : 11, color: isSelected ? 'var(--accent)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                              {isChild && <CornerDownRight size={11} style={{ color: 'var(--accent)' }} />}
                              {r.design_code || `Rev.${r.revision_number}`}
                            </span>
                            <span className={badgeInfo.badgeClass} style={{ fontSize: 8, padding: '1px 5px' }}>
                              {badgeInfo.label}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                            <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 4px', borderRadius: 3, background: isProto ? 'var(--tint-orange-bg)' : 'var(--tint-teal-bg)', color: isProto ? 'var(--tint-orange-text)' : 'var(--tint-teal-text)' }}>
                              {relLabel || (isProto ? '🧪 試作' : '🟢 正規')}
                            </span>
                            {r.created_at && (
                              <span style={{ fontSize: 9, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                {r.created_at.slice(0, 10)}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    }

                    return treeGroups.map(grp => (
                      <div key={grp.parent.revision_id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {renderRevCard(grp.parent, false)}
                        {grp.children.map(ch => renderRevCard(ch.item, true, ch.relLabel))}
                      </div>
                    ))
                  })()}
                </div>
              </div>

              {/* Right Area: 3-Column Technical Specs Grid */}
              <div style={{ flex: 1, padding: 12, minWidth: 0 }}>
                {activeRev ? (() => {
                  const selectedRevIndex = allRevs.findIndex(r => r.revision_id === selectedRevId)
                  const prevRev = selectedRevIndex >= 0 && selectedRevIndex < allRevs.length - 1 ? allRevs[selectedRevIndex + 1] : null

                  const isFieldChanged = (fields: Array<keyof DesignRevItem>) => {
                    if (!prevRev || !activeRev) return false
                    return fields.some(f => {
                      const v1 = activeRev[f]
                      const v2 = prevRev[f]
                      if ((v1 == null || v1 === '') && (v2 == null || v2 === '')) return false
                      return String(v1) !== String(v2)
                    })
                  }

                  const trayDimsDiff = isFieldChanged(['design_length', 'design_width', 'design_depth', 'design_height'])
                  const cutlineDimsDiff = isFieldChanged(['cutline_length', 'cutline_width'])
                  const cavityDiff = isFieldChanged(['cavity_count', 'cavity_pitch_mm'])
                  const plasticDiff = isFieldChanged(['plastic_type_designed'])
                  const feedPitchDiff = isFieldChanged(['machine_feed_pitch_mm'])
                  const customerTrayNameDiff = isFieldChanged(['customer_tray_name'])
                  const cornerRDiff = isFieldChanged(['corner_r'])
                  const chamferCDiff = isFieldChanged(['chamfer_c'])
                  const draftAngleDiff = isFieldChanged(['draft_angle'])
                  const orientationDiff = isFieldChanged(['orientation'])
                  const setupTypeDiff = isFieldChanged(['setup_type'])
                  const plugTypeDiff = isFieldChanged(['plug_type'])
                  const separateCutterDiff = isFieldChanged(['has_separate_cutter'])
                  const trayInfoDiff = isFieldChanged(['tray_info'])

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {/* Lineage & Link Bar */}
                      {(() => {
                        const isProto = isPrototypeDesignOrMold(activeRev)
                        const linkedItems: Array<{ item: DesignRevItem; label: string; badgeClass: string }> = []
                        
                        if (isProto) {
                          // Check if any Mass Production revision derives from this prototype
                          const massChild = allRevs.find(r => !isPrototypeDesignOrMold(r) && (r.parent_design_id === activeRev.revision_id || extractBaseMassCode(r.design_code) === extractBaseMassCode(activeRev.design_code)))
                          if (massChild) {
                            linkedItems.push({
                              item: massChild,
                              label: '🟢 本型化済 (Khuôn hàng loạt)',
                              badgeClass: 'badge badge--success'
                            })
                          } else {
                            linkedItems.push({
                              item: null as any,
                              label: '⚠️ 試作のみ (Chưa tạo bản hàng loạt)',
                              badgeClass: 'badge badge--neutral'
                            })
                          }
                        } else {
                          // Mass Production revision: check if it has a prototype parent
                          const protoParent = allRevs.find(r => isPrototypeDesignOrMold(r) && (r.revision_id === activeRev.parent_design_id || r.parent_design_id === activeRev.revision_id || extractBaseMassCode(r.design_code) === extractBaseMassCode(activeRev.design_code)))
                          if (protoParent) {
                            linkedItems.push({
                              item: protoParent,
                              label: '🧪 試作元 (Prototype Source)',
                              badgeClass: 'badge badge--warning'
                            })
                          }
                        }

                        if (linkedItems.length === 0) return null

                        return (
                          <div style={{
                            padding: '5px 10px', background: 'var(--bg-surface-2)',
                            border: '1px solid var(--border-default)', borderRadius: 6,
                            fontSize: 11, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap'
                          }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Link2 size={12} style={{ color: 'var(--accent)' }} /> 継承・関連:
                            </span>
                            {linkedItems.map((lk, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {lk.item ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedRevId(lk.item.revision_id)
                                      setActiveRev(lk.item)
                                    }}
                                    className={lk.badgeClass}
                                    style={{
                                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4,
                                      padding: '2px 8px', fontSize: 10, fontWeight: 700, border: 'none'
                                    }}
                                  >
                                    <span>{lk.label}: <strong>{lk.item.design_code}</strong></span>
                                    <ArrowRight size={10} />
                                  </button>
                                ) : (
                                  <span className={lk.badgeClass} style={{ padding: '2px 8px', fontSize: 10 }}>
                                    {lk.label}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )
                      })()}

                      {(activeRev.change_summary || activeRev.version_note) && (
                        <div style={{
                          padding: '6px 10px', background: 'var(--tint-orange-bg)',
                          border: '1px solid var(--tint-orange-border)', borderRadius: 6,
                          fontSize: 11, color: 'var(--tint-orange-text)', display: 'flex', alignItems: 'center', gap: 6
                        }}>
                          <AlertTriangle size={12} />
                          <span><strong>{tPC('changeSummary')}:</strong> {activeRev.change_summary || activeRev.version_note}</span>
                        </div>
                      )}
                      {/* 3-Column Structured Layout with Horizontal Scroll Protection */}
                      <div style={{ overflowX: 'auto', width: '100%', paddingBottom: 2 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr 1fr', minWidth: '480px', gap: '2px 14px', fontSize: 12 }}>
                          {/* Column 1: Main Text & Plastic Spec */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {(() => {
                              const cav = activeRev ? lookupCavType(activeRev.design_length, activeRev.design_width) : null
                              return (
                                <SpecCell
                                  label={tPC('trayDimensions')}
                                  value={trayDims ? `${trayDims} mm` : null}
                                  isDiff={trayDimsDiff}
                                  diffLabel={tPC('fieldChanged')}
                                  badge={cav ? (
                                    <span
                                      className="badge badge--neutral"
                                      style={{
                                        fontFamily: 'monospace', fontWeight: 700, fontSize: 10,
                                        color: '#0F766E', background: '#F0FDFA', border: '1px solid #99F6E4',
                                        padding: '1px 5px', marginLeft: 2, flexShrink: 0
                                      }}
                                    >
                                      {cav.badgeLabel}
                                    </span>
                                  ) : null}
                                />
                              )
                            })()}
                            <SpecCell label={tPC('designedMaterial')} value={activeRev.plastic_type_designed || primaryPlasticCode} isDiff={plasticDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                            <SpecCell label={tPC('customerTrayName')} value={activeRev.customer_tray_name} isDiff={customerTrayNameDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                            {activeRev.tray_info && (
                              <SpecCell label={tPC('trayInfoLabel')} value={activeRev.tray_info} isDiff={trayInfoDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                            )}
                          </div>

                          {/* Column 2: Dimensions & Pocket / Impression */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <SpecCell label="カットライン" value={formatCutlineSpecString(activeRev)} isDiff={cutlineDimsDiff} diffLabel={tPC('fieldChanged')} />
                            <SpecCell
                              label={tPC('cavityAndPitch')}
                              value={(activeRev.pocket_numbers || activeRev.cavity_count) ? `${activeRev.pocket_numbers || activeRev.cavity_count} Pocket${activeRev.cavity_pitch_mm ? ' / ' + activeRev.cavity_pitch_mm + 'mm' : ''}` : null}
                              isDiff={cavityDiff}
                              diffLabel={tPC('fieldChanged')}
                            />
                            <SpecCell
                              label={tPC('impressionCount')}
                              value={(activeRev.pocket_numbers || activeRev.cavity_count) ? `${activeRev.pocket_numbers || activeRev.cavity_count} 取` : null}
                              isDiff={cavityDiff}
                              diffLabel={tPC('fieldChanged')}
                            />
                            <SpecCell label={tPC('setupTypeLabel')} value={activeRev.setup_type} isDiff={setupTypeDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                            <SpecCell label={tPC('orientationLabel')} value={activeRev.orientation} isDiff={orientationDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                          </div>

                          {/* Column 3: Angles, Formings & Accessories */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <SpecCell label={tPC('draftAngleLabel')} value={activeRev.draft_angle != null ? `${activeRev.draft_angle}°` : null} isDiff={draftAngleDiff} diffLabel={tPC('fieldChanged')} />
                            <SpecCell
                              label={tPC('cornerRadiusLabel')}
                              value={formatCornerRDisplay(activeRev.corner_r)}
                              isDiff={cornerRDiff}
                              diffLabel={tPC('fieldChanged')}
                            />
                            <SpecCell
                              label={tPC('chamferLabel')}
                              value={formatChamferCDisplay(activeRev.chamfer_c)}
                              isDiff={chamferCDiff}
                              diffLabel={tPC('fieldChanged')}
                            />
                            <SpecCell label={tPC('undercutDepthLabel')} value={activeRev.under_depth != null ? `${activeRev.under_depth} mm` : null} />
                            <SpecCell label={tPC('plugTypeLabel')} value={activeRev.plug_type} isDiff={plugTypeDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                            <SpecCell
                              label={tPC('hasSeparateCutterLabel')}
                              value={activeRev.has_separate_cutter == null ? null : (activeRev.has_separate_cutter ? tPC('yesLabel') : tPC('noLabel'))}
                              isDiff={separateCutterDiff}
                              diffLabel={tPC('fieldChanged')}
                              mono={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })() : (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 12 }}>
                    {tCommon('noData')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MIDDLE BLOCK: Lịch sử đơn hàng gần đây */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-purple-border)' }}>
            <div style={{
              background: 'var(--tint-purple-bg)', borderBottom: '1px solid var(--tint-purple-border)',
              padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={14} style={{ color: 'var(--tint-purple-text)' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tint-purple-text)' }}>{tPC('boxOrderHistoryTitle')}</span>
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{recentOrders.length} orders</span>
            </div>
            <div style={{ padding: 10 }}>
              {recentOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '16px 0', fontSize: 12, color: 'var(--text-muted)' }}>{tPC('noOrdersForProduct')}</div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', textAlign: 'left' }}>
                        <th style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-muted)' }}>{tPC('orderNo') || 'Order No'}</th>
                        <th style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-muted)' }}>{tPC('orderDate') || 'Order Date'}</th>
                        <th style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'right' }}>{tPC('quantity') || 'Quantity'}</th>
                        <th style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-muted)' }}>{tPC('lineStatus') || 'Status'}</th>
                        <th style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-muted)' }}>{tPC('deliverySiteNameLabel') || 'Delivery Site'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(ol => {
                        const isSelected = selectedOrderLine?.line_id === ol.line_id
                        return (
                          <tr
                            key={ol.line_id}
                            onClick={() => setSelectedOrderLine(ol)}
                            style={{
                              borderBottom: '1px solid var(--border-subtle)',
                              cursor: 'pointer',
                              background: isSelected ? 'var(--tint-purple-bg)' : 'transparent',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>
                              {ol.orders?.order_no || '—'}
                            </td>
                            <td style={{ padding: '6px 8px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                              {ol.orders?.order_date?.slice(0, 10) || '—'}
                            </td>
                            <td style={{ padding: '6px 8px', fontFamily: 'monospace', fontWeight: 700, textAlign: 'right' }}>
                              {ol.quantity?.toLocaleString()} {ol.unit || 'pcs'}
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <span className={STATUS_BADGE[ol.orders?.order_status || ''] || 'badge badge--neutral'} style={{ fontSize: 8 }}>
                                {ol.orders?.order_status || 'NORMAL'}
                              </span>
                            </td>
                            <td style={{ padding: '6px 8px', color: 'var(--text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>
                              {ol.orders?.delivery_sites?.site_name || customer?.company_name || '—'}
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

          {/* BOTTOM BLOCK: Thông tin địa chỉ nhận hàng (theo từng đơn hàng) */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-blue-border)' }}>
            <div style={{
              background: 'var(--tint-blue-bg)', borderBottom: '1px solid var(--tint-blue-border)',
              padding: '8px 12px', fontSize: 12, fontWeight: 700, color: 'var(--tint-blue-text)', display: 'flex', alignItems: 'center', gap: 5
            }}>
              <MapPin size={14} /> {tPC('boxDeliverySiteTitle')}
            </div>
            <div style={{ padding: '10px 12px', fontSize: 11 }}>
              {selectedOrderLine ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px' }}>
                  <InfoRow label={tPC('deliveryOrderLabel')} value={selectedOrderLine.orders?.order_no} mono accent />
                  <InfoRow label={tPC('deliverySiteNameLabel')} value={selectedOrderLine.orders?.delivery_sites?.site_name || customer?.company_name} />
                  <InfoRow label={tPC('deliveryAddressLabel')} value={selectedOrderLine.orders?.delivery_sites?.address || customer?.address} />
                  <InfoRow label={tPC('deliveryContactLabel')} value={selectedOrderLine.orders?.delivery_sites?.contact_person} />
                  <InfoRow label={tPC('deliveryPhoneLabel')} value={selectedOrderLine.orders?.delivery_sites?.phone || customer?.tel} mono />
                </div>
              ) : (
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>
                  {tPC('boxDeliverySitePrompt')}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 👉 COLUMN 3 (Right flex 1): Related Equipment -> Storage Info -> Job History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* TOP BLOCK: Các thiết bị liên quan */}
          {(() => {
            const getMoldRevId = (m: MoldDetail) => {
              return (m as any).design_revision_id || m.mold_revisions?.design_revision_id || (m as any).mold_revision_id || null
            }

            const activeDesignCode = activeRev?.design_code ? activeRev.design_code.replace(/[\s\-_]/g, '').toUpperCase() : ''

            const matchesRevision = (itemRevId: string | null | undefined, itemCode: string | null | undefined, itemName: string | null | undefined) => {
              // 1. Direct linkage to the selected revision ID
              if (itemRevId && selectedRevId) return itemRevId === selectedRevId

              // 2. Exact code match with active revision
              const c1 = (itemCode || '').replace(/[\s\-_]/g, '').toUpperCase()
              const c2 = (itemName || '').replace(/[\s\-_]/g, '').toUpperCase()
              if (activeDesignCode && (c1 === activeDesignCode || c2 === activeDesignCode)) return true

              return false
            }

            // Filter equipment by revision if filter mode is 'revision'
            const filteredMolds = equipFilterMode === 'revision' && selectedRevId
              ? moldDetails.filter(m => matchesRevision(getMoldRevId(m), m.system_code, m.display_name))
              : moldDetails
            const filteredCutters = equipFilterMode === 'revision' && selectedRevId
              ? cutterDetails.filter(c => matchesRevision(c.linked_rev_id || c.design_revision_id, c.cutter_no, c.cutter_name))
              : cutterDetails
            const filteredEquips = equipFilterMode === 'revision' && selectedRevId
              ? equipDetails.filter(eq => matchesRevision(eq.design_revision_id, eq.equipment_code, eq.display_name))
              : equipDetails

            const grandTotal = filteredMolds.length + filteredEquips.length + filteredCutters.length
            const totalAll = moldDetails.length + equipDetails.length + cutterDetails.length

            const parseStorageStatus = (statusRaw?: string | null, keeper?: string | null) => {
              const st = (statusRaw || 'IN_STOCK').toUpperCase().trim()
              const isOut = st.includes('OUT') || st.includes('CHECKOUT') || st.includes('LOAN') || st.includes('IN_PROGRESS')
              const isExternal = Boolean(keeper && keeper !== 'YSD' && keeper !== '本社工場' && keeper !== '—')

              if (isOut) {
                if (isExternal) {
                  return {
                    badgeLabel: '⬆️ OUT',
                    badgeClass: 'badge badge--error',
                    type: 'OUT_EXTERNAL',
                    locationLabel: `🏢 ${keeper}`,
                    bg: '#FFF7ED',
                    border: '#FFEDD5',
                    color: '#C2410C',
                  }
                }
                return {
                  badgeLabel: '⬆️ OUT',
                  badgeClass: 'badge badge--error',
                  type: 'OUT_INTERNAL',
                  locationLabel: `🏭 ${keeper || '社内成形機'}`,
                  bg: '#FEFCE8',
                  border: '#FEF08A',
                  color: '#854D0E',
                }
              }

              return {
                badgeLabel: '⬇️ IN',
                badgeClass: 'badge badge--success',
                type: 'IN',
                locationLabel: '📍 保管中',
                bg: '#E0F2FE',
                border: '#BAE6FD',
                color: '#0369A1',
              }
            }

            // Selected Equipment info for storage box
            const selectedEquipData = (() => {
              if (!selectedEquip) return null
              if (selectedEquip.type === 'mold') {
                const m = moldDetails.find(item => item.physical_mold_id === selectedEquip.id)
                if (!m) return null
                const moldDims = [m.actual_length_mm || activeRev?.design_length, m.actual_width_mm || activeRev?.design_width, m.actual_height_mm || activeRev?.design_height || activeRev?.design_depth].filter(Boolean).join(' × ')
                const keeperName = m.keeper_company?.company_code || m.keeper_company?.company_name || 'YSD'
                const stInfo = parseStorageStatus(m.usage_status || m.device_status, keeperName)
                return {
                  code: formatMoldDisplayCode(m.system_code),
                  name: m.display_name || 'Physical Mold',
                  rack: getRack(m.rack_layers),
                  keeper: keeperName,
                  status: m.usage_status || m.device_status || 'IN_STOCK',
                  statusInfo: stInfo,
                  updatedAt: m.manufacturing_date || '—',
                  dims: moldDims ? `${moldDims} mm` : null,
                  weight: m.actual_weight ? `${m.actual_weight} kg` : null,
                  specStr: null
                }
              }
              if (selectedEquip.type === 'cutter') {
                const c = cutterDetails.find(item => item.cutter_id === selectedEquip.id)
                if (!c) return null
                const keeperName = c.keeper_company?.company_code || c.keeper_company?.company_name || 'YSD'
                const stInfo = parseStorageStatus(c.usage_status || (c.cutter_presence ? 'IN' : 'OUT'), keeperName)
                return {
                  code: formatCutterDisplayCode(c.cutter_no || c.cutter_id),
                  name: c.cutter_name || 'Cutting Die',
                  rack: getRack(c.rack_layers),
                  keeper: keeperName,
                  status: c.usage_status || (c.cutter_presence ? '在空 (IN)' : '保管中 (IN)'),
                  statusInfo: stInfo,
                  updatedAt: '—',
                  dims: null,
                  weight: null,
                  specStr: formatCutterSpecString(c, activeRev)
                }
              }
              if (selectedEquip.type === 'equip') {
                const eq = equipDetails.find(item => item.equipment_id === selectedEquip.id)
                if (!eq) return null
                const isCutter = eq.equipment_type?.includes('CUTTER')
                const eqDims = [eq.actual_length_mm, eq.actual_width_mm, eq.actual_height_mm].filter(Boolean).join(' × ')
                const keeperName = eq.keeper_company?.company_code || eq.keeper_company?.company_name || 'YSD'
                const stInfo = parseStorageStatus(eq.usage_status || eq.device_status, keeperName)
                return {
                  code: isCutter ? formatCutterDisplayCode(eq.equipment_code) : formatMoldDisplayCode(eq.equipment_code),
                  name: eq.display_name || eq.equipment_type || 'Equipment',
                  rack: getRack(eq.rack_layers),
                  keeper: keeperName,
                  status: eq.usage_status || eq.device_status || 'NORMAL',
                  statusInfo: stInfo,
                  updatedAt: '—',
                  dims: eqDims ? `${eqDims} mm` : null,
                  weight: eq.actual_weight ? `${eq.actual_weight} kg` : null,
                  specStr: isCutter ? formatCutterSpecString(eq, activeRev) : null
                }
              }
              return null
            })()

            // Selected Equipment Jobs - strictly match selected physical equipment
            const selectedEquipJobs = allJobs.filter((j: JobItem) => {
              if (!selectedEquip) return true
              return j.physical_mold_id === selectedEquip.id || j.equipment_id === selectedEquip.id
            })

            const sortMolds = [...filteredMolds].sort((a, b) => {
              const aActive = getMoldRevId(a) === selectedRevId ? 0 : 1
              const bActive = getMoldRevId(b) === selectedRevId ? 0 : 1
              if (aActive !== bActive) return aActive - bActive
              return (a.system_code || '').localeCompare(b.system_code || '')
            })

            const sortCutters = [...filteredCutters].sort((a, b) => {
              const aActive = a.linked_rev_id === selectedRevId ? 0 : 1
              const bActive = b.linked_rev_id === selectedRevId ? 0 : 1
              if (aActive !== bActive) return aActive - bActive
              return (a.cutter_no || '').localeCompare(b.cutter_no || '')
            })

            const sortEquip = [...filteredEquips].sort((a, b) => {
              const aActive = a.design_revision_id === selectedRevId ? 0 : 1
              const bActive = b.design_revision_id === selectedRevId ? 0 : 1
              if (aActive !== bActive) return aActive - bActive
              return (a.equipment_code || '').localeCompare(b.equipment_code || '')
            })

            const bindingLabel = (isActive: boolean, isDisposed: boolean, isShared?: boolean) => {
              if (isDisposed) return { label: tPC('bindingDisposed'), cls: 'badge badge--error' }
              if (isShared) return { label: tPC('bindingShared'), cls: 'badge badge--info' }
              if (isActive) return { label: tPC('bindingActive'), cls: 'badge badge--success' }
              return { label: tPC('bindingLegacy'), cls: 'badge badge--neutral' }
            }

            // Compact equipment row renderer (for List View)
            const renderEquipRow = (
              id: string,
              type: 'mold' | 'cutter' | 'equip',
              code: string | null,
              name: string | null,
              typeIcon: React.ReactNode,
              typeLabel: string,
              statusText: string,
              statusCls: string,
              binding: { label: string; cls: string },
              rack: string,
              keeper: string,
              previewItemData: QuickPreviewItem
            ) => {
              const isEquipSelected = selectedEquip?.id === id
              const isCutter = type === 'cutter' || (type === 'equip' && previewItemData.type === 'equip' && previewItemData.data?.equipment_type?.includes('CUTTER'))
              const displayCode = isCutter ? formatCutterDisplayCode(code) : (code || '—')
              const stInfo = parseStorageStatus(statusText, keeper)

              return (
                <div
                  key={id}
                  onClick={() => {
                    setSelectedEquip(prev => prev?.id === id ? null : { type, id, code: displayCode })
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 10px', borderRadius: 6,
                    background: isEquipSelected ? 'var(--tint-teal-bg)' : (binding.cls.includes('success') ? 'var(--tint-teal-bg)' : 'var(--bg-surface-2)'),
                    border: isEquipSelected ? '2px solid var(--accent)' : (binding.cls.includes('success') ? '1.5px solid var(--accent)' : '1px solid var(--border-default)'),
                    cursor: 'pointer', transition: 'all 0.15s ease', fontSize: 11
                  }}
                >
                  {typeIcon}
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)', minWidth: 75 }}>
                    {displayCode}
                  </span>
                  <span style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {name || '—'}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>{typeLabel}</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 5px', borderRadius: 4,
                    background: stInfo.bg, border: `1px solid ${stInfo.border}`, color: stInfo.color,
                    fontFamily: 'monospace', fontWeight: 700, fontSize: 9
                  }}>
                    <MapPin size={9} /> {stInfo.type === 'IN' ? rack : stInfo.locationLabel}
                  </span>
                  <span className={stInfo.badgeClass} style={{ fontSize: 8, padding: '1px 5px' }}>{stInfo.badgeLabel}</span>
                  <span className={binding.cls} style={{ fontSize: 8, padding: '1px 5px' }}>{binding.label}</span>
                  {isEquipSelected && (
                    <span className="badge badge--info font-bold" style={{ fontSize: 8, padding: '1px 5px' }}>
                      選択中
                    </span>
                  )}
                  <button
                    type="button"
                    title={tPC('quickPreviewTitle') || 'Quick Preview'}
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewItem(previewItemData)
                    }}
                    style={{
                      background: 'none', border: 'none', padding: 2, cursor: 'pointer',
                      color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
                    }}
                  >
                    <ExternalLink size={12} />
                  </button>
                </div>
              )
            }

            // Compact equipment card renderer (for Grid/Card View)
            const renderEquipCard = (
              id: string,
              type: 'mold' | 'cutter' | 'equip',
              code: string | null,
              name: string | null,
              typeIcon: React.ReactNode,
              typeLabel: string,
              statusText: string,
              statusCls: string,
              binding: { label: string; cls: string },
              rack: string,
              keeper: string,
              previewItemData: QuickPreviewItem
            ) => {
              const isEquipSelected = selectedEquip?.id === id
              const isEquipProto = isPrototypeDesignOrMold({ equipment_code: code, display_name: name })
              const isCutter = type === 'cutter' || (type === 'equip' && previewItemData.type === 'equip' && previewItemData.data?.equipment_type?.includes('CUTTER'))
              const displayCode = isCutter ? formatCutterDisplayCode(code) : (code || '—')
              const stInfo = parseStorageStatus(statusText, keeper)

              return (
                <div
                  key={id}
                  onClick={() => {
                    setSelectedEquip(prev => prev?.id === id ? null : { type, id, code: displayCode })
                  }}
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 4,
                    padding: '8px 10px', borderRadius: 6,
                    background: isEquipSelected ? 'var(--tint-teal-bg)' : (binding.cls.includes('success') ? 'var(--tint-teal-bg)' : 'var(--bg-surface-2)'),
                    border: isEquipSelected ? '2px solid var(--accent)' : (binding.cls.includes('success') ? '1.5px solid var(--accent)' : '1px solid var(--border-default)'),
                    cursor: 'pointer', transition: 'all 0.15s ease', fontSize: 11
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                      {typeIcon} {typeLabel}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, padding: '1px 4px', borderRadius: 3, background: isEquipProto ? 'var(--tint-orange-bg)' : 'var(--tint-teal-bg)', color: isEquipProto ? 'var(--tint-orange-text)' : 'var(--tint-teal-text)' }}>
                        {isEquipProto ? '🧪 試作' : '🟢 本型'}
                      </span>
                      <span className={binding.cls} style={{ fontSize: 8, padding: '1px 4px' }}>{binding.label}</span>
                      <button
                        type="button"
                        title={tPC('quickPreviewTitle') || 'Quick Preview'}
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewItem(previewItemData)
                        }}
                        style={{
                          background: 'none', border: 'none', padding: 2, cursor: 'pointer',
                          color: 'var(--accent)', display: 'flex', alignItems: 'center'
                        }}
                      >
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewItem(previewItemData)
                        }}
                        style={{
                          fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--accent)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'underline',
                          cursor: 'pointer'
                        }}
                        title={tPC('quickPreviewTitle') || 'Quick Preview'}
                      >
                        {displayCode}
                      </span>
                      {isEquipSelected && (
                        <span className="badge badge--info font-bold" style={{ fontSize: 8, padding: '0 4px' }}>
                          選択中
                        </span>
                      )}
                    </div>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {name || '—'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4, borderTop: '1px dashed var(--border-subtle)', fontSize: 9 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3, padding: '1px 5px', borderRadius: 4,
                      background: stInfo.bg, border: `1px solid ${stInfo.border}`, color: stInfo.color,
                      fontFamily: 'monospace', fontWeight: 700, fontSize: 9
                    }}>
                      <MapPin size={9} /> {stInfo.type === 'IN' ? rack : stInfo.locationLabel}
                    </span>
                    <span className={stInfo.badgeClass} style={{ fontSize: 8, padding: '1px 5px' }}>{stInfo.badgeLabel}</span>
                  </div>
                </div>
              )
            }

            const getCategoryTheme = (tabId: string) => {
              switch (tabId) {
                case 'MOLD':
                  return { bg: 'var(--tint-blue-bg)', border: 'var(--tint-blue-border)', text: 'var(--tint-blue-text)', badgeBg: 'rgba(2, 132, 199, 0.15)' }
                case 'CUTTER':
                  return { bg: 'var(--tint-orange-bg)', border: 'var(--tint-orange-border)', text: 'var(--tint-orange-text)', badgeBg: 'rgba(234, 88, 12, 0.15)' }
                case 'STACKING':
                  return { bg: 'var(--tint-teal-bg)', border: 'var(--tint-teal-border)', text: 'var(--tint-teal-text)', badgeBg: 'rgba(13, 148, 136, 0.15)' }
                case 'WATER_BASE':
                  return { bg: '#E0F2FE', border: '#BAE6FD', text: '#0284C7', badgeBg: 'rgba(2, 132, 199, 0.2)' }
                case 'PRESS_BASE':
                  return { bg: 'var(--tint-purple-bg)', border: 'var(--tint-purple-border)', text: 'var(--tint-purple-text)', badgeBg: 'rgba(147, 51, 234, 0.15)' }
                case 'FRAME':
                  return { bg: '#FEF3C7', border: '#FDE68A', text: '#D97706', badgeBg: 'rgba(217, 119, 6, 0.18)' }
                case 'PLATE':
                  return { bg: '#FFE4E6', border: '#FECDD3', text: '#E11D48', badgeBg: 'rgba(225, 29, 72, 0.15)' }
                case 'PLUG':
                  return { bg: '#E0E7FF', border: '#C7D2FE', text: '#4F46E5', badgeBg: 'rgba(79, 70, 229, 0.15)' }
                case 'ALL':
                default:
                  return { bg: 'var(--bg-surface-2)', border: 'var(--border-default)', text: 'var(--text-primary)', badgeBg: 'var(--border-default)' }
              }
            }

            const isEquipCutter = (type?: string | null) => {
              if (!type) return false
              const u = type.toUpperCase()
              return u.includes('CUTTER') || type.includes('抜型') || type.includes('刃物')
            }

            const isEquipMold = (type?: string | null) => {
              if (!type) return false
              const u = type.toUpperCase()
              return u.includes('MOLD') || type.includes('金型')
            }

            const getTabCount = (tabId: string) => {
              if (tabId === 'ALL') return grandTotal
              if (tabId === 'MOLD') {
                const equipMolds = filteredEquips.filter(eq => isEquipMold(eq.equipment_type)).length
                return filteredMolds.length + equipMolds
              }
              if (tabId === 'CUTTER') {
                const equipCutters = filteredEquips.filter(eq => isEquipCutter(eq.equipment_type)).length
                return filteredCutters.length + equipCutters
              }
              if (tabId === 'STACKING') return filteredEquips.filter(eq => eq.equipment_type?.toUpperCase().includes('STACK') || eq.equipment_type?.includes('スタッキング')).length
              if (tabId === 'WATER_BASE') return filteredEquips.filter(eq => eq.equipment_type?.toUpperCase().includes('WATER') || eq.equipment_type?.includes('水冷')).length
              if (tabId === 'PRESS_BASE') return filteredEquips.filter(eq => eq.equipment_type?.toUpperCase().includes('PRESS') || eq.equipment_type?.includes('圧空')).length
              if (tabId === 'FRAME') return filteredEquips.filter(eq => eq.equipment_type?.toUpperCase().includes('FRAME') || eq.equipment_type?.includes('フレーム')).length
              if (tabId === 'PLATE') return filteredEquips.filter(eq => eq.equipment_type?.toUpperCase().includes('PLATE') || eq.equipment_type?.includes('面版')).length
              if (tabId === 'PLUG') return filteredEquips.filter(eq => eq.equipment_type?.toUpperCase().includes('PLUG') || eq.equipment_type?.includes('プラグ')).length
              return 0
            }

            const showMolds = (equipCategoryTab === 'ALL' || equipCategoryTab === 'MOLD') ? sortMolds : []
            const showCutters = (equipCategoryTab === 'ALL' || equipCategoryTab === 'CUTTER') ? sortCutters : []
            const showEquip = (() => {
              if (equipCategoryTab === 'ALL') return sortEquip
              if (equipCategoryTab === 'MOLD') return sortEquip.filter(eq => isEquipMold(eq.equipment_type))
              if (equipCategoryTab === 'CUTTER') return sortEquip.filter(eq => isEquipCutter(eq.equipment_type))
              if (equipCategoryTab === 'STACKING') return sortEquip.filter(eq => eq.equipment_type?.toUpperCase().includes('STACK') || eq.equipment_type?.includes('スタッキング'))
              if (equipCategoryTab === 'WATER_BASE') return sortEquip.filter(eq => eq.equipment_type?.toUpperCase().includes('WATER') || eq.equipment_type?.includes('水冷'))
              if (equipCategoryTab === 'PRESS_BASE') return sortEquip.filter(eq => eq.equipment_type?.toUpperCase().includes('PRESS') || eq.equipment_type?.includes('圧空'))
              if (equipCategoryTab === 'FRAME') return sortEquip.filter(eq => eq.equipment_type?.toUpperCase().includes('FRAME') || eq.equipment_type?.includes('フレーム'))
              if (equipCategoryTab === 'PLATE') return sortEquip.filter(eq => eq.equipment_type?.toUpperCase().includes('PLATE') || eq.equipment_type?.includes('面版'))
              if (equipCategoryTab === 'PLUG') return sortEquip.filter(eq => eq.equipment_type?.toUpperCase().includes('PLUG') || eq.equipment_type?.includes('プラグ'))
              return []
            })()

            const displayedCount = showMolds.length + showCutters.length + showEquip.length

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* 1. Các thiết bị liên quan */}
                <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-default)' }}>
                  <div style={{
                    background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)',
                    padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Wrench size={14} style={{ color: 'var(--accent)' }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{tPC('boxRelatedEquipmentTitle')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {/* View Mode Toggle: List vs Card/Grid */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 1, background: 'var(--bg-surface)', padding: '2px', borderRadius: 5, border: '1px solid var(--border-default)' }}>
                        <button
                          onClick={() => setEquipViewMode('list')}
                          title={tPC('equipViewList')}
                          style={{
                            display: 'flex', alignItems: 'center', padding: '2px 5px', borderRadius: 4, border: 'none', cursor: 'pointer',
                            background: equipViewMode === 'list' ? 'var(--tint-teal-bg)' : 'none',
                            color: equipViewMode === 'list' ? 'var(--accent)' : 'var(--text-muted)'
                          }}
                        >
                          <List size={12} />
                        </button>
                        <button
                          onClick={() => setEquipViewMode('grid')}
                          title={tPC('equipViewGrid')}
                          style={{
                            display: 'flex', alignItems: 'center', padding: '2px 5px', borderRadius: 4, border: 'none', cursor: 'pointer',
                            background: equipViewMode === 'grid' ? 'var(--tint-teal-bg)' : 'none',
                            color: equipViewMode === 'grid' ? 'var(--accent)' : 'var(--text-muted)'
                          }}
                        >
                          <LayoutGrid size={12} />
                        </button>
                      </div>

                      {/* Filter Chips: Revision / All */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--bg-surface)', padding: '2px 3px', borderRadius: 5, border: '1px solid var(--border-default)' }}>
                        <button
                          onClick={() => setEquipFilterMode('revision')}
                          style={{
                            fontSize: 10, fontWeight: equipFilterMode === 'revision' ? 700 : 500,
                            color: equipFilterMode === 'revision' ? 'var(--accent)' : 'var(--text-secondary)',
                            background: equipFilterMode === 'revision' ? 'var(--tint-teal-bg)' : 'none',
                            border: equipFilterMode === 'revision' ? '1px solid var(--accent)' : 'none',
                            borderRadius: 4, padding: '2px 8px', cursor: 'pointer', whiteSpace: 'nowrap'
                          }}
                        >
                          {tPC('equipFilterRevision')}
                        </button>
                        <button
                          onClick={() => setEquipFilterMode('all')}
                          style={{
                            fontSize: 10, fontWeight: equipFilterMode === 'all' ? 700 : 500,
                            color: equipFilterMode === 'all' ? 'var(--accent)' : 'var(--text-secondary)',
                            background: equipFilterMode === 'all' ? 'var(--tint-teal-bg)' : 'none',
                            border: equipFilterMode === 'all' ? '1px solid var(--accent)' : 'none',
                            borderRadius: 4, padding: '2px 8px', cursor: 'pointer', whiteSpace: 'nowrap'
                          }}
                        >
                          {tPC('equipFilterAll')}
                        </button>
                      </div>
                      {selectedEquip && (
                        <button
                          onClick={() => setSelectedEquip(null)}
                          style={{ fontSize: 10, padding: '2px 8px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 4, cursor: 'pointer', color: 'var(--text-secondary)' }}
                        >
                          選択解除 ×
                        </button>
                      )}
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{displayedCount}/{grandTotal}</span>
                    </div>
                  </div>

                  {/* Sub-tab navigation bar arranged in 2 rows with distinct theme colors */}
                  <div style={{
                    display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, padding: '6px 8px',
                    background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-default)',
                    width: '100%', flexShrink: 0
                  }}>
                    {[
                      { id: 'ALL', labelKey: 'equipTabAll' },
                      { id: 'MOLD', labelKey: 'equipTabMold' },
                      { id: 'CUTTER', labelKey: 'equipTabCutter' },
                      { id: 'STACKING', labelKey: 'equipTabStacking' },
                      { id: 'WATER_BASE', labelKey: 'equipTabWaterBase' },
                      { id: 'PRESS_BASE', labelKey: 'equipTabPressBase' },
                      { id: 'FRAME', labelKey: 'equipTabFrame' },
                      { id: 'PLATE', labelKey: 'equipTabPlate' },
                      { id: 'PLUG', labelKey: 'equipTabPlug' },
                    ].map(tab => {
                      const isSelected = equipCategoryTab === tab.id
                      const cnt = getTabCount(tab.id)
                      const theme = getCategoryTheme(tab.id)
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setEquipCategoryTab(tab.id)}
                          style={{
                            fontSize: 10, fontWeight: isSelected ? 700 : 600,
                            color: isSelected ? theme.text : 'var(--text-secondary)',
                            background: isSelected ? theme.bg : 'var(--bg-surface)',
                            border: isSelected ? `1.5px solid ${theme.text}` : `1px solid ${theme.border}`,
                            borderRadius: 5, padding: '3px 8px', cursor: 'pointer', whiteSpace: 'nowrap',
                            display: 'flex', alignItems: 'center', gap: 4,
                            boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>{tPC(tab.labelKey)}</span>
                          <span style={{
                            fontSize: 9, fontWeight: 700, padding: '0 4px', borderRadius: 8,
                            background: isSelected ? theme.badgeBg : 'var(--bg-surface-2)',
                            color: isSelected ? theme.text : 'var(--text-muted)'
                          }}>
                            {cnt}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  <div style={{ padding: 10 }}>
                    {displayedCount > 0 && (showCutters.length > 0 || equipCategoryTab === 'CUTTER') && (
                      <div style={{
                        padding: '6px 10px', marginBottom: 8, borderRadius: 5,
                        background: 'var(--tint-orange-bg)', border: '1px solid var(--tint-orange-border)',
                        fontSize: 10, color: 'var(--tint-orange-text)', fontWeight: 600,
                        display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        <Crop size={12} style={{ flexShrink: 0 }} />
                        <span>⚠️ 抜型・スタッキング提案: 外形寸法による自動提案です。実際の切断線形状・R/C角・内側穴あきについて必ず担当者が確認して下さい。</span>
                      </div>
                    )}
                    {displayedCount === 0 ? (
                      <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: 12, lineHeight: 1.6 }}>
                        {tPC('noEquipmentLinked')}
                      </div>
                    ) : (
                      <div style={{
                        display: equipViewMode === 'grid' ? 'grid' : 'flex',
                        gridTemplateColumns: equipViewMode === 'grid' ? 'repeat(3, 1fr)' : undefined,
                        flexDirection: equipViewMode === 'list' ? 'column' : undefined,
                        gap: equipViewMode === 'grid' ? 6 : 4
                      }}>
                        {/* Molds (金型 - Blue Theme) */}
                        {showMolds.map(m => {
                          const isActive = getMoldRevId(m) === selectedRevId
                          const isDisposed = m.usage_status === 'DISPOSED'
                          const renderFunc = equipViewMode === 'grid' ? renderEquipCard : renderEquipRow
                          return renderFunc(
                            m.physical_mold_id,
                            'mold',
                            formatMoldDisplayCode(m.system_code),
                            m.display_name,
                            <Box size={13} style={{ color: 'var(--tint-blue-text)', flexShrink: 0 }} />,
                            tPC('moldsGroupTitle') || '金型',
                            m.usage_status || m.device_status || '—',
                            STATUS_BADGE[m.usage_status || ''] || STATUS_BADGE[m.device_status || ''] || 'badge badge--neutral',
                            bindingLabel(isActive, isDisposed),
                            getRack(m.rack_layers),
                            m.keeper_company?.company_code || m.keeper_company?.company_name || 'YSD',
                            { type: 'mold', data: { ...m, design_revisions: activeRev } }
                          )
                        })}
                        {/* Cutters (抜型 - Orange Theme) */}
                        {showCutters.map(c => {
                          const isActive = c.linked_rev_id === selectedRevId
                          const isDisposed = c.usage_status === 'DISPOSED'
                          const renderFunc = equipViewMode === 'grid' ? renderEquipCard : renderEquipRow
                          return renderFunc(
                            c.cutter_id,
                            'cutter',
                            formatCutterDisplayCode(c.cutter_no),
                            c.cutter_name,
                            <Crop size={13} style={{ color: 'var(--tint-orange-text)', flexShrink: 0 }} />,
                            tPC('cuttersGroupTitle') || '抜型',
                            c.usage_status || (c.cutter_presence ? '在空' : '保管中'),
                            STATUS_BADGE[c.usage_status || ''] || 'badge badge--success',
                            bindingLabel(isActive, isDisposed, c.is_shared),
                            getRack(c.rack_layers),
                            c.keeper_company?.company_code || c.keeper_company?.company_name || 'YSD',
                            { type: 'cutter', data: { ...c, design_revisions: activeRev } }
                          )
                        })}
                        {/* Other Equipment (Stacking, Water base, Press base, Frame, Plate, Plug) */}
                        {showEquip.map(eq => {
                          const isActive = eq.design_revision_id === selectedRevId
                          const isDisposed = eq.usage_status === 'DISPOSED'
                          const typeUpper = (eq.equipment_type || '').toUpperCase()
                          const isPlug = typeUpper.includes('PLUG') || typeUpper.includes('プラグ')
                          const isWater = typeUpper.includes('WATER') || typeUpper.includes('水冷')
                          const isPress = typeUpper.includes('PRESS') || typeUpper.includes('圧空')
                          const isFrame = typeUpper.includes('FRAME') || typeUpper.includes('フレーム')
                          const isPlate = typeUpper.includes('PLATE') || typeUpper.includes('面版')
                          const isStack = typeUpper.includes('STACK') || typeUpper.includes('スタッキング')
                          const isCutter = typeUpper.includes('CUTTER') || typeUpper.includes('抜型')

                          const Icon = isCutter ? Crop : isPlug ? Pin : Box
                          const tintColor = isWater ? '#0284C7' : isPress ? 'var(--tint-purple-text)' : isStack ? 'var(--tint-teal-text)' : isFrame ? '#D97706' : isPlate ? '#E11D48' : isPlug ? '#4F46E5' : 'var(--accent)'
                          const typeLabel = isCutter ? (tPC('cutterThumbnail') || '抜型') : isPlug ? (tPC('plugThumbnail') || 'プラグ') : eq.equipment_type || 'Equipment'
                          const renderFunc = equipViewMode === 'grid' ? renderEquipCard : renderEquipRow
                          return renderFunc(
                            eq.equipment_id,
                            'equip',
                            eq.equipment_code,
                            eq.display_name,
                            <Icon size={13} style={{ color: tintColor, flexShrink: 0 }} />,
                            typeLabel,
                            eq.usage_status || eq.device_status || '—',
                            STATUS_BADGE[eq.usage_status || ''] || STATUS_BADGE[eq.device_status || ''] || 'badge badge--neutral',
                            bindingLabel(isActive, isDisposed),
                            getRack(eq.rack_layers),
                            eq.keeper_company?.company_code || eq.keeper_company?.company_name || 'YSD',
                            { type: 'equip', data: { ...eq, design_revisions: activeRev } }
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Thông tin lưu trữ thiết bị */}
                <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-blue-border)' }}>
                  <div style={{
                    background: 'var(--tint-blue-bg)', borderBottom: '1px solid var(--tint-blue-border)',
                    padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    <MapPin size={14} style={{ color: 'var(--tint-blue-text)' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tint-blue-text)' }}>
                      {selectedEquipData ? `[ ${selectedEquipData.code} ] ${tPC('boxEquipmentStorageTitle')}` : tPC('boxEquipmentStorageTitle')}
                    </span>
                  </div>
                  <div style={{ padding: '10px 12px', fontSize: 11 }}>
                    {selectedEquipData ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 14px' }}>
                        {(() => {
                          const sortedJobs = [...selectedEquipJobs].sort((a, b) => {
                            const codeA = (a.job_code || a.job_name || '').toUpperCase()
                            const codeB = (b.job_code || b.job_name || '').toUpperCase()

                            const matchA = codeA.match(/R(?:EV)?\s*(\d+)/i)
                            const matchB = codeB.match(/R(?:EV)?\s*(\d+)/i)
                            const numA = matchA ? parseInt(matchA[1], 10) : 0
                            const numB = matchB ? parseInt(matchB[1], 10) : 0

                            if (numA > 0 && numB > 0 && numA !== numB) return numA - numB

                            const dateA = a.created_at || a.mold_deadline || ''
                            const dateB = b.created_at || b.mold_deadline || ''
                            return dateA.localeCompare(dateB)
                          })

                          const evolutionChain = sortedJobs
                            .map(j => (j.job_code || j.job_name || '').trim())
                            .filter((val, idx, self) => val && self.indexOf(val) === idx)

                          const evolutionStr = evolutionChain.length > 1 ? evolutionChain.join(' ➔ ') : null
                          if (!evolutionStr) return null

                          return (
                            <div style={{ gridColumn: '1 / -1', padding: '4px 8px', borderRadius: 4, background: 'var(--tint-teal-bg)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                              <span style={{ fontWeight: 700, color: 'var(--accent)' }}>🔄 金型改訂進化 (Evolution):</span>
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>{evolutionStr} (現行)</span>
                            </div>
                          )
                        })()}
                        <InfoRow label={tPC('equipCodeLabel')} value={selectedEquipData.code} mono accent />
                        <InfoRow label={tPC('equipNameLabel')} value={selectedEquipData.name} />
                        <InfoRow label="入出庫ステータス" value={selectedEquipData.statusInfo.badgeLabel} mono accent />
                        <InfoRow label={tPC('rackLocationLabel')} value={selectedEquipData.rack} mono />
                        <InfoRow label="保管会社・設置場所" value={selectedEquipData.statusInfo.locationLabel || selectedEquipData.keeper} />
                        {selectedEquipData.statusInfo.type !== 'IN' && (
                          <InfoRow label="返却予定ラック" value={`↩ ${selectedEquipData.rack}`} mono />
                        )}
                        {selectedEquipData.specStr && (
                          <InfoRow label="抜型物理寸法" value={selectedEquipData.specStr} mono accent />
                        )}
                        {selectedEquipData.dims && (
                          <InfoRow label="外形寸法" value={selectedEquipData.dims} mono />
                        )}
                        {selectedEquipData.weight && (
                          <InfoRow label="重量 (Weight)" value={selectedEquipData.weight} mono />
                        )}
                        <InfoRow label={tPC('lastUpdatedLabel')} value={selectedEquipData.updatedAt?.slice(0, 10)} mono />
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: 11 }}>
                        {tPC('boxEquipmentStoragePrompt')}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Lịch sử job trong thiết bị */}
                <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-orange-border)' }}>
                  <div style={{
                    background: 'var(--tint-orange-bg)', borderBottom: '1px solid var(--tint-orange-border)',
                    padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Hammer size={14} style={{ color: 'var(--tint-orange-text)' }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tint-orange-text)' }}>
                        {selectedEquipData ? `[ ${selectedEquipData.code} ] ${tPC('boxEquipmentJobsTitle')}` : tPC('boxEquipmentJobsTitle')}
                      </span>
                    </div>
                    <span className="badge badge--neutral font-mono font-bold" style={{ fontSize: 9 }}>
                      {selectedEquipJobs.length} jobs
                    </span>
                  </div>
                  <div style={{ padding: 10 }}>
                    {selectedEquipJobs.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: 11 }}>
                        {selectedEquipData ? `[${selectedEquipData.code}] ${tPC('boxEquipmentJobsPrompt')}` : tPC('boxEquipmentJobsPrompt')}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {selectedEquipJobs.map(j => (
                          <div
                            key={j.job_id}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '6px 8px', borderRadius: 4, background: 'var(--bg-surface-2)',
                              border: '1px solid var(--border-default)', fontSize: 11
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Link
                                href={`/equipment/jobs/${j.job_id}`}
                                style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}
                              >
                                {j.job_code}
                              </Link>
                              <span style={{ fontWeight: 600 }}>{j.job_name || '—'}</span>
                              <span className={STATUS_BADGE[j.job_status || ''] || 'badge badge--neutral'} style={{ fontSize: 8 }}>
                                {j.job_status}
                              </span>
                            </div>
                            {j.mold_deadline && (
                              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                {j.mold_deadline?.slice(0, 10)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )
          })()}

        </div>
      </div>
    </div>

      {/* Equipment Quick Preview Modal */}
      <EquipmentQuickPreviewModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        item={previewItem}
      />

    </div>
  )
}