'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  TrendingUp, Clock, Truck, CheckCircle2,
  Calendar, Wrench, Hammer, PenTool, AlertTriangle,
  Building2, ExternalLink, Layers, ShieldAlert,
  Package, Scissors, Pin, FileText, MapPin,
  Scale, Ruler, CircleDot, LayoutGrid, List
} from 'lucide-react'
import Link from 'next/link'
import EquipmentQuickPreviewModal, { type QuickPreviewItem } from './EquipmentQuickPreviewModal'

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
  label, value, mono = true, isDiff, diffLabel, span
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
}) {
  const displayVal = value == null || value === '' ? '—' : String(value)
  const isEmpty = displayVal === '—'

  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 5,
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
            has_separate_cutter, customer_tray_name, tray_info, version_note, created_at, designer
          `)
          .eq('product_id', productId)
          .order('created_at', { ascending: false })

        const revList = (revs || []) as unknown as DesignRevItem[]
        setAllRevs(revList)

        if (revList.length > 0) {
          const approved = revList.find(r => r.status === 'APPROVED' || r.status === 'RELEASED') || revList[0]
          setActiveRev(approved)
          setSelectedRevId(approved.revision_id)
        }

        const revIds = revList.map(r => r.revision_id)

        // Physical Molds (expanded details)
        if (revIds.length > 0) {
          const { data: molds } = await supabase
            .from('physical_molds')
            .select(`
              physical_mold_id, system_code, display_name, device_status, usage_status,
              mold_type, piece_count, actual_length_mm, actual_width_mm, actual_height_mm,
              actual_weight, manufacturing_date,
              rack_layers(layer_code, racks(rack_code)),
              keeper_company:companies!physical_molds_keeper_company_id_fkey(company_code, company_name),
              mold_revisions(design_revision_id)
            `)
            .in('mold_revision_id', revIds)

          if (molds) setMoldDetails(molds as unknown as MoldDetail[])

          // Equipment (Plugs, Cutters, etc.)
          const { data: equips } = await supabase
            .from('equipment')
            .select(`
              equipment_id, equipment_code, display_name, equipment_type, usage_status, device_status,
              design_revision_id,
              rack_layers(layer_code, racks(rack_code)),
              keeper_company:companies!equipment_keeper_company_id_fkey(company_code, company_name)
            `)
            .in('design_revision_id', revIds)

          if (equips) setEquipDetails(equips as unknown as EquipDetail[])

          // Cutters (抜型) - Direct & Junction Shared
          const { data: directCutters } = await supabase
            .from('cutters')
            .select(`
              cutter_id, cutter_no, cutter_name, cutter_type, usage_status, cutter_presence,
              design_revision_id, cutter_length_mm, cutter_width_mm,
              rack_layers(layer_code, racks(rack_code)),
              keeper_company:companies!cutters_keeper_company_id_fkey(company_code, company_name)
            `)
            .in('design_revision_id', revIds)

          const { data: juncs } = await supabase
            .from('mold_design_cutters')
            .select('mold_design_id, cutter_id')
            .in('mold_design_id', revIds)

          let sharedCutters: any[] = []
          if (juncs && juncs.length > 0) {
            const juncCutterIds = juncs.map(j => j.cutter_id).filter(Boolean)
            if (juncCutterIds.length > 0) {
              const { data: sCutters } = await supabase
                .from('cutters')
                .select(`
                  cutter_id, cutter_no, cutter_name, cutter_type, usage_status, cutter_presence,
                  design_revision_id, cutter_length_mm, cutter_width_mm,
                  rack_layers(layer_code, racks(rack_code)),
                  keeper_company:companies!cutters_keeper_company_id_fkey(company_code, company_name)
                `)
                .in('cutter_id', juncCutterIds)

              if (sCutters) {
                sharedCutters = sCutters.map(sc => {
                  const matchJunc = juncs.find(j => j.cutter_id === sc.cutter_id)
                  return {
                    ...sc,
                    is_shared: sc.design_revision_id ? !revIds.includes(sc.design_revision_id) : true,
                    linked_rev_id: matchJunc?.mold_design_id || sc.design_revision_id
                  }
                })
              }
            }
          }

          const directMapped = (directCutters || []).map(dc => ({
            ...dc,
            is_shared: false,
            linked_rev_id: dc.design_revision_id
          }))

          const cutterMap = new Map<string, any>()
          directMapped.forEach(c => cutterMap.set(c.cutter_id, c))
          sharedCutters.forEach(c => {
            if (!cutterMap.has(c.cutter_id)) {
              cutterMap.set(c.cutter_id, c)
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
              delivery_sites(site_name, address, contact_person, phone)
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
  const cutlineDims = activeRev
    ? [activeRev.cutline_length, activeRev.cutline_width].filter(Boolean).join(' × ')
    : ''
  const productDimsSpec = activeRev && cutlineDims
    ? [
        cutlineDims,
        activeRev.corner_r != null ? `R${activeRev.corner_r}` : null,
        activeRev.chamfer_c != null ? `C${activeRev.chamfer_c}` : null
      ].filter(Boolean).join(' - ')
    : ''

  const getRack = (rl: { layer_code: string | null; racks: { rack_code: string | null } | null } | null) => {
    if (!rl) return '—'
    return [rl.racks?.rack_code, rl.layer_code].filter(Boolean).join('-') || '—'
  }

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
      <div style={{ display: 'grid', gridTemplateColumns: '250px minmax(0, 1.5fr) minmax(320px, 450px)', gap: 12 }}>

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
              {productDimsSpec && <InfoRow label={tPC('cutlineDimensions')} value={`${productDimsSpec} mm`} mono />}
              <InfoRow label={tProd('pocketCount')} value={pocketCount || activeRev?.pocket_numbers || activeRev?.cavity_count} mono />
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
              {activeRev && (
                <Link
                  href={`/engineering/designs/revisions/${activeRev.revision_id}`}
                  style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}
                >
                  {activeRev.design_code || 'Design'} <ExternalLink size={11} />
                </Link>
              )}
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
                  {allRevs.map(r => {
                    const isSelected = selectedRevId === r.revision_id
                    return (
                      <div
                        key={r.revision_id}
                        onClick={() => {
                          setSelectedRevId(r.revision_id)
                          setActiveRev(r)
                        }}
                        style={{
                          display: 'flex', flexDirection: 'column', gap: 2, padding: '5px 7px', borderRadius: 6,
                          cursor: 'pointer', transition: 'all 0.15s ease',
                          border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border-default)',
                          background: isSelected ? 'var(--tint-teal-bg)' : 'var(--bg-surface)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 11, color: isSelected ? 'var(--accent)' : 'var(--text-primary)' }}>
                            {r.design_code || `Rev.${r.revision_number}`}
                          </span>
                          <span className={REV_STATUS_BADGE[r.status] || 'badge badge--neutral'} style={{ fontSize: 8, padding: '1px 5px' }}>
                            {r.status}
                          </span>
                        </div>
                        {r.created_at && (
                          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            {r.created_at.slice(0, 10)}
                          </span>
                        )}
                      </div>
                    )
                  })}
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
                      {/* 3-Column Structured Layout */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '2px 14px', fontSize: 12 }}>
                        {/* Column 1: Main Text & Plastic Spec */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {trayDims && <SpecCell label={tPC('trayDimensions')} value={`${trayDims} mm`} isDiff={trayDimsDiff} diffLabel={tPC('fieldChanged')} />}
                          <SpecCell label={tPC('designedMaterial')} value={activeRev.plastic_type_designed || primaryPlasticCode} isDiff={plasticDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                          <SpecCell label={tPC('customerTrayName')} value={activeRev.customer_tray_name} isDiff={customerTrayNameDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                          {activeRev.tray_info && (
                            <SpecCell label={tPC('trayInfoLabel')} value={activeRev.tray_info} isDiff={trayInfoDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                          )}
                        </div>

                        {/* Column 2: Dimensions & Pocket / Impression */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {cutlineDims && <SpecCell label={tPC('cutlineDimensions')} value={productDimsSpec ? `${productDimsSpec} mm` : `${cutlineDims} mm`} isDiff={cutlineDimsDiff} diffLabel={tPC('fieldChanged')} />}
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
                          <SpecCell label={tPC('cornerRadiusLabel')} value={activeRev.corner_r != null ? `R${activeRev.corner_r}` : null} isDiff={cornerRDiff} diffLabel={tPC('fieldChanged')} />
                          <SpecCell label={tPC('chamferLabel')} value={activeRev.chamfer_c != null ? `C${activeRev.chamfer_c}` : null} isDiff={chamferCDiff} diffLabel={tPC('fieldChanged')} />
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
              const linkedRevId = m.mold_revisions?.design_revision_id
              if (linkedRevId) return linkedRevId
              return (m as any).mold_revision_id || null
            }

            // Filter equipment by revision if filter mode is 'revision'
            const filteredMolds = equipFilterMode === 'revision' && selectedRevId
              ? moldDetails.filter(m => getMoldRevId(m) === selectedRevId)
              : moldDetails
            const filteredCutters = equipFilterMode === 'revision' && selectedRevId
              ? cutterDetails.filter(c => c.linked_rev_id === selectedRevId || c.design_revision_id === selectedRevId)
              : cutterDetails
            const filteredEquips = equipFilterMode === 'revision' && selectedRevId
              ? equipDetails.filter(eq => eq.design_revision_id === selectedRevId)
              : equipDetails

            const grandTotal = filteredMolds.length + filteredEquips.length + filteredCutters.length
            const totalAll = moldDetails.length + equipDetails.length + cutterDetails.length

            // Selected Equipment info for storage box
            const selectedEquipData = (() => {
              if (!selectedEquip) return null
              if (selectedEquip.type === 'mold') {
                const m = moldDetails.find(item => item.physical_mold_id === selectedEquip.id)
                if (!m) return null
                return {
                  code: m.system_code || m.physical_mold_id,
                  name: m.display_name || 'Physical Mold',
                  rack: getRack(m.rack_layers),
                  keeper: m.keeper_company?.company_code || m.keeper_company?.company_name || 'YSD',
                  status: m.usage_status || m.device_status || 'IN_STOCK',
                  updatedAt: m.manufacturing_date || '—'
                }
              }
              if (selectedEquip.type === 'cutter') {
                const c = cutterDetails.find(item => item.cutter_id === selectedEquip.id)
                if (!c) return null
                return {
                  code: c.cutter_no || c.cutter_id,
                  name: c.cutter_name || 'Cutting Die',
                  rack: getRack(c.rack_layers),
                  keeper: c.keeper_company?.company_code || c.keeper_company?.company_name || 'YSD',
                  status: c.usage_status || (c.cutter_presence ? '在空 (IN)' : '保管中 (IN)'),
                  updatedAt: '—'
                }
              }
              if (selectedEquip.type === 'equip') {
                const eq = equipDetails.find(item => item.equipment_id === selectedEquip.id)
                if (!eq) return null
                return {
                  code: eq.equipment_code || eq.equipment_id,
                  name: eq.display_name || eq.equipment_type || 'Equipment',
                  rack: getRack(eq.rack_layers),
                  keeper: eq.keeper_company?.company_code || eq.keeper_company?.company_name || 'YSD',
                  status: eq.usage_status || eq.device_status || 'NORMAL',
                  updatedAt: '—'
                }
              }
              return null
            })()

            // Selected Equipment Jobs
            const selectedEquipJobs = allJobs.filter((j: JobItem) => {
              if (!selectedEquip) return true
              if (selectedEquip.type === 'mold') return j.physical_mold_id === selectedEquip.id || j.design_revision_id === selectedRevId
              if (selectedEquip.type === 'cutter') return j.equipment_id === selectedEquip.id || j.design_revision_id === selectedRevId
              if (selectedEquip.type === 'equip') return j.equipment_id === selectedEquip.id || j.design_revision_id === selectedRevId
              return true
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
              return (
                <div
                  key={id}
                  onClick={() => {
                    setSelectedEquip(prev => prev?.id === id ? null : { type, id, code: code || id })
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
                    {code || '—'}
                  </span>
                  <span style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {name || '—'}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>{typeLabel}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    <MapPin size={9} /> {rack}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: 'var(--text-muted)' }}>
                    <Building2 size={9} /> {keeper}
                  </span>
                  <span className={statusCls} style={{ fontSize: 8 }}>{statusText}</span>
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
              return (
                <div
                  key={id}
                  onClick={() => {
                    setSelectedEquip(prev => prev?.id === id ? null : { type, id, code: code || id })
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
                          fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'underline',
                          cursor: 'pointer'
                        }}
                        title={tPC('quickPreviewTitle') || 'Quick Preview'}
                      >
                        {code || '—'}
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: 2, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      <MapPin size={9} /> {rack}
                    </span>
                    <span className={statusCls} style={{ fontSize: 8 }}>{statusText}</span>
                  </div>
                </div>
              )
            }

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* 1. Các thiết bị liên quan */}
                <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-orange-border)' }}>
                  <div style={{
                    background: 'var(--tint-orange-bg)', borderBottom: '1px solid var(--tint-orange-border)',
                    padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Wrench size={14} style={{ color: 'var(--tint-orange-text)' }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tint-orange-text)' }}>{tPC('boxRelatedEquipmentTitle')}</span>
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
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{grandTotal}/{totalAll}</span>
                    </div>
                  </div>

                  <div style={{ padding: 10 }}>
                    {grandTotal === 0 ? (
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
                        {/* Molds (金型) */}
                        {sortMolds.map(m => {
                          const isActive = getMoldRevId(m) === selectedRevId
                          const isDisposed = m.usage_status === 'DISPOSED'
                          const renderFunc = equipViewMode === 'grid' ? renderEquipCard : renderEquipRow
                          return renderFunc(
                            m.physical_mold_id,
                            'mold',
                            m.system_code,
                            m.display_name,
                            <Wrench size={13} style={{ color: 'var(--tint-orange-text)', flexShrink: 0 }} />,
                            tPC('moldsGroupTitle') || '金型',
                            m.usage_status || m.device_status || '—',
                            STATUS_BADGE[m.usage_status || ''] || STATUS_BADGE[m.device_status || ''] || 'badge badge--neutral',
                            bindingLabel(isActive, isDisposed),
                            getRack(m.rack_layers),
                            m.keeper_company?.company_code || m.keeper_company?.company_name || 'YSD',
                            { type: 'mold', data: m }
                          )
                        })}
                        {/* Cutters (抜型) */}
                        {sortCutters.map(c => {
                          const isActive = c.linked_rev_id === selectedRevId
                          const isDisposed = c.usage_status === 'DISPOSED'
                          const renderFunc = equipViewMode === 'grid' ? renderEquipCard : renderEquipRow
                          return renderFunc(
                            c.cutter_id,
                            'cutter',
                            c.cutter_no,
                            c.cutter_name,
                            <Scissors size={13} style={{ color: 'var(--tint-purple-text)', flexShrink: 0 }} />,
                            tPC('cuttersGroupTitle') || '抜型',
                            c.usage_status || (c.cutter_presence ? '在空' : '保管中'),
                            STATUS_BADGE[c.usage_status || ''] || 'badge badge--success',
                            bindingLabel(isActive, isDisposed, c.is_shared),
                            getRack(c.rack_layers),
                            c.keeper_company?.company_code || c.keeper_company?.company_name || 'YSD',
                            { type: 'cutter', data: c }
                          )
                        })}
                        {/* Other Equipment (Press base, Water base, Stacking, Plug) */}
                        {sortEquip.map(eq => {
                          const isActive = eq.design_revision_id === selectedRevId
                          const isDisposed = eq.usage_status === 'DISPOSED'
                          const isPlug = eq.equipment_type?.includes('PLUG')
                          const isCutter = eq.equipment_type?.includes('CUTTER')
                          const Icon = isCutter ? Scissors : isPlug ? Pin : Wrench
                          const tintColor = isCutter ? 'var(--tint-purple-text)' : isPlug ? 'var(--tint-blue-text)' : 'var(--tint-orange-text)'
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
                            { type: 'equip', data: eq }
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
                        <InfoRow label={tPC('equipCodeLabel')} value={selectedEquipData.code} mono accent />
                        <InfoRow label={tPC('equipNameLabel')} value={selectedEquipData.name} />
                        <InfoRow label={tPC('rackLocationLabel')} value={selectedEquipData.rack} mono />
                        <InfoRow label={tPC('keeperCompanyLabel')} value={selectedEquipData.keeper} />
                        <InfoRow label={tPC('storageStatusLabel')} value={selectedEquipData.status} />
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

      {/* Equipment Quick Preview Modal */}
      <EquipmentQuickPreviewModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        item={previewItem}
      />

    </div>
  )
}