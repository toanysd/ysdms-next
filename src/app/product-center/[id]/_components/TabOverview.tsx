'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  TrendingUp, Clock, Truck, CheckCircle2,
  Calendar, Wrench, Hammer, PenTool, AlertTriangle,
  Building2, ExternalLink, Layers, ShieldAlert,
  Package, Scissors, Pin, FileText, MapPin,
  Scale, Ruler, CircleDot
} from 'lucide-react'
import Link from 'next/link'
import EquipmentQuickPreviewModal, { type QuickPreviewItem } from './EquipmentQuickPreviewModal'

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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '1px 0', lineHeight: 1.5 }}>
      <span style={{
        fontSize: 10, color: '#64748B', fontWeight: 600, fontFamily: 'var(--font-jp)',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: 13, fontWeight: 700,
        fontFamily: mono ? 'monospace' : 'var(--font-jp)',
        color: accent ? 'var(--accent)' : (value == null ? '#94A3B8' : '#0F172A'),
        maxWidth: '68%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
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
      lineHeight: 1.5,
      ...(isDiff ? {
        background: 'var(--tint-orange-bg)',
        borderRadius: 3, padding: '0 3px',
      } : {})
    }}>
      <span style={{
        fontSize: 10, fontWeight: 600, color: '#64748B', fontFamily: 'var(--font-jp)',
        whiteSpace: 'nowrap', minWidth: 78, flexShrink: 0,
      }}>
        {label}
      </span>
      {isDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 3px', verticalAlign: 'super' }}>{diffLabel || 'MOD'}</span>}
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

  // Active Job
  const [activeJob, setActiveJob] = useState<{ id: string; code: string; status: string; deadline: string; name: string } | null>(null)

  // Recent Orders
  const [recentOrders, setRecentOrders] = useState<RecentOrderLine[]>([])
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

        // Jobs
        let jobQuery = supabase.from('jobs').select('job_id, job_code, job_name, job_status, mold_deadline, created_at')
        if (revIds.length > 0) {
          jobQuery = jobQuery.or(`product_id.eq.${productId},design_revision_id.in.(${revIds.join(',')})`)
        } else {
          jobQuery = jobQuery.eq('product_id', productId)
        }
        const { data: jobs } = await jobQuery.order('created_at', { ascending: false })

        if (jobs && jobs.length > 0) {
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
        const { data: lines, count: lCount } = await supabase
          .from('order_lines')
          .select(`
            line_id, quantity, unit, created_at,
            orders(order_id, order_no, order_date, order_status)
          `, { count: 'exact' })
          .eq('product_id', productId)
          .order('created_at', { ascending: false })

        if (lines) {
          setTotalOrderCount(lCount || lines.length)
          const sumQty = lines.reduce((acc: number, l: any) => acc + (l.quantity || 0), 0)
          setTotalOrderQty(sumQty)
          setRecentOrders((lines.slice(0, 5) as unknown) as RecentOrderLine[])

          const shippedLines = lines.filter((l: any) => l.orders?.order_status === 'COMPLETED' || l.orders?.order_status === 'SHIPPED')
          const shippedQty = shippedLines.reduce((acc: number, l: any) => acc + (l.quantity || 0), 0)
          setTotalDelivered(shippedQty)

          const totalValidOrders = lines.filter((l: any) => l.orders?.order_status === 'COMPLETED').length
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
    ? [activeRev.design_length, activeRev.design_width, activeRev.design_depth || activeRev.design_height].filter(Boolean).join(' × ')
    : ''
  const cutlineDims = activeRev
    ? [activeRev.cutline_length, activeRev.cutline_width].filter(Boolean).join(' × ')
    : ''

  const getRack = (rl: { layer_code: string | null; racks: { rack_code: string | null } | null } | null) => {
    if (!rl) return '—'
    return [rl.racks?.rack_code, rl.layer_code].filter(Boolean).join('-') || '—'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ═══ Compact Stats Strip ═══ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
        padding: '6px 10px', borderRadius: 6, background: 'var(--bg-surface)', border: '1px solid var(--border-default)'
      }}>
        {/* Left: Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Calendar size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{tPC('tabOverviewLabel')}</span>
        </div>

        {/* Center: KPI chips */}
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

        {/* Right: Period selector */}
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

      {/* ═══ MAIN 2-COLUMN: Product Identity (left) + Tech Specs & Equipment (right) ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 280px) 1fr', gap: 14 }}>

        {/* ── LEFT: Product Identity Card ── */}
        <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-teal-border)' }}>
          <div style={{
            background: 'var(--tint-teal-bg)', borderBottom: '1px solid var(--tint-teal-border)',
            padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6
          }}>
            <Package size={14} style={{ color: 'var(--tint-teal-text)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tint-teal-text)' }}>{tPC('productIdentity')}</span>
          </div>

          {/* Compact Product Header Badge */}
          <div style={{
            padding: '10px 12px',
            background: 'linear-gradient(135deg, var(--tint-teal-bg) 0%, var(--bg-surface-2) 100%)',
            display: 'flex', alignItems: 'center', gap: 10,
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 6,
              background: 'var(--bg-surface)', border: '1px solid var(--tint-teal-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Package size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent)' }}>
                {productCode}
              </div>
              <div style={{ fontSize: 11, color: '#475569', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {productName || productNameInternal || tPC('noImageAvailable')}
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InfoRow label={tProd('productCode')} value={productCode} mono accent />
            <InfoRow label={tPC('internalNameLabel')} value={productNameInternal} />
            <InfoRow label={tProd('productName')} value={productName} />
            <InfoRow label={tPC('customerProductNameLabel')} value={customerProductName} />
            <InfoRow label={tProd('pocketCount')} value={pocketCount || activeRev?.pocket_numbers || activeRev?.cavity_count} mono />
            <InfoRow label={tPC('piecesPerBoxLabel')} value={piecesPerBox} mono />
            <InfoRow label={tPC('boxSpecLabel')} value={null} />
            <InfoRow label={tPC('plasticSpecLabel')} value={primaryPlasticSpec || primaryPlasticCode || activeRev?.plastic_type_designed} mono />
            <InfoRow label={tPC('firstShipmentLabel')} value={firstShipmentDate} mono />
            {notes && (
              <div style={{ marginTop: 4, padding: '6px 8px', background: 'var(--bg-surface-2)', borderRadius: 4, fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: 10 }}>{tPC('notesLabel')}:</span> {notes}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Tech Specs + Equipment ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Technical Spec Card (Expanded) */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-teal-border)' }}>
            <div style={{
              background: 'var(--tint-teal-bg)', borderBottom: '1px solid var(--tint-teal-border)',
              padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PenTool size={14} style={{ color: 'var(--tint-teal-text)' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tint-teal-text)' }}>{tPC('techSpec')}</span>
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
              {/* ═══ Revision Selector Chips ═══ */}
              {allRevs.length > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginRight: 2 }}>{tPC('revisionSelectorLabel')}:</span>
                  {allRevs.map(r => (
                    <button
                      key={r.revision_id}
                      onClick={() => {
                        setSelectedRevId(r.revision_id)
                        setActiveRev(r)
                      }}
                      style={{
                        fontSize: 10, fontWeight: 600, fontFamily: 'monospace',
                        padding: '2px 8px', borderRadius: 10, cursor: 'pointer',
                        border: selectedRevId === r.revision_id
                          ? '1.5px solid var(--accent)'
                          : '1px solid var(--border-default)',
                        background: selectedRevId === r.revision_id
                          ? 'color-mix(in srgb, var(--accent) 12%, transparent)'
                          : 'var(--bg-surface)',
                        color: selectedRevId === r.revision_id
                          ? 'var(--accent)'
                          : r.status === 'APPROVED' || r.status === 'RELEASED'
                            ? 'var(--text-primary)'
                            : 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', gap: 4
                      }}
                    >
                      {r.design_code || `Rev.${r.revision_number}`}
                      <span className={REV_STATUS_BADGE[r.status] || 'badge badge--neutral'} style={{ fontSize: 7, padding: '1px 4px' }}>
                        {r.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div style={{ padding: 12 }}>
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

                const diffFieldStyle = (isDiff: boolean) => (isDiff ? {
                  background: 'var(--tint-orange-bg)',
                  border: '1px solid var(--tint-orange-border)',
                  borderRadius: 4,
                  padding: '2px 4px',
                } : {})

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Change summary banner if exists */}
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2px 12px', fontSize: 12 }}>
                      {/* Row 1: Dimensions */}
                      {trayDims && <SpecCell label={tPC('trayDimensions')} value={`${trayDims} mm`} isDiff={trayDimsDiff} diffLabel={tPC('fieldChanged')} span={2} />}
                      {cutlineDims && <SpecCell label={tPC('cutlineDimensions')} value={`${cutlineDims} mm`} isDiff={cutlineDimsDiff} diffLabel={tPC('fieldChanged')} span={1} />}

                      {/* Row 2: Material & Pocket/Pitch */}
                      <SpecCell label={tPC('designedMaterial')} value={activeRev.plastic_type_designed || primaryPlasticCode} isDiff={plasticDiff} diffLabel={tPC('fieldChanged')} span={2} mono={false} />
                      <SpecCell
                        label={tPC('cavityAndPitch')}
                        value={(activeRev.pocket_numbers || activeRev.cavity_count) ? `${activeRev.pocket_numbers || activeRev.cavity_count} Pocket${activeRev.cavity_pitch_mm ? ' / ' + activeRev.cavity_pitch_mm + 'mm' : ''}` : null}
                        isDiff={cavityDiff}
                        diffLabel={tPC('fieldChanged')}
                        span={1}
                      />

                      {/* Row 3: Feed pitch & Tray Name & Draft angle */}
                      <SpecCell label={tPC('feedPitch')} value={activeRev.machine_feed_pitch_mm ? `${activeRev.machine_feed_pitch_mm} mm` : null} isDiff={feedPitchDiff} diffLabel={tPC('fieldChanged')} />
                      <SpecCell label={tPC('customerTrayName')} value={activeRev.customer_tray_name} isDiff={customerTrayNameDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                      <SpecCell label={tPC('draftAngleLabel')} value={activeRev.draft_angle != null ? `${activeRev.draft_angle}°` : null} isDiff={draftAngleDiff} diffLabel={tPC('fieldChanged')} />

                      {/* Row 4: Corner R & Chamfer C & Undercut depth */}
                      <SpecCell label={tPC('cornerRadiusLabel')} value={activeRev.corner_r != null ? `R${activeRev.corner_r}` : null} isDiff={cornerRDiff} diffLabel={tPC('fieldChanged')} />
                      <SpecCell label={tPC('chamferLabel')} value={activeRev.chamfer_c != null ? `C${activeRev.chamfer_c}` : null} isDiff={chamferCDiff} diffLabel={tPC('fieldChanged')} />
                      <SpecCell label="Undercut" value={activeRev.under_depth != null ? `${activeRev.under_depth} mm` : null} />

                      {/* Row 5: Process specs */}
                      <SpecCell label={tPC('orientationLabel')} value={activeRev.orientation} isDiff={orientationDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                      <SpecCell label={tPC('setupTypeLabel')} value={activeRev.setup_type} isDiff={setupTypeDiff} diffLabel={tPC('fieldChanged')} mono={false} />
                      <SpecCell label={tPC('plugTypeLabel')} value={activeRev.plug_type} isDiff={plugTypeDiff} diffLabel={tPC('fieldChanged')} mono={false} />

                      {/* Row 6: Cutter & Tray Info */}
                      <SpecCell
                        label={tPC('hasSeparateCutterLabel')}
                        value={activeRev.has_separate_cutter == null ? null : (activeRev.has_separate_cutter ? tPC('yesLabel') : tPC('noLabel'))}
                        isDiff={separateCutterDiff}
                        diffLabel={tPC('fieldChanged')}
                        mono={false}
                      />
                      {activeRev.tray_info && (
                        <SpecCell label={tPC('trayInfoLabel')} value={activeRev.tray_info} isDiff={trayInfoDiff} diffLabel={tPC('fieldChanged')} span={2} mono={false} />
                      )}
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

          {/* ═══ Equipment Overview Cards (Categorized Group Columns with Uniform Ordering) ═══ */}
          {(() => {
            const getMoldRevId = (m: MoldDetail) => m.mold_revisions?.design_revision_id || null
            const grandTotal = moldDetails.length + equipDetails.length + cutterDetails.length

            // Sort helper: Active ([現行]) -> Shared ([共有]) -> Legacy ([旧版]) -> Disposed ([廃棄])
            const sortMolds = [...moldDetails].sort((a, b) => {
              const aActive = getMoldRevId(a) === selectedRevId ? 0 : 1
              const bActive = getMoldRevId(b) === selectedRevId ? 0 : 1
              if (aActive !== bActive) return aActive - bActive
              return (a.system_code || '').localeCompare(b.system_code || '')
            })

            const sortCutters = [...cutterDetails].sort((a, b) => {
              const aActive = a.linked_rev_id === selectedRevId ? 0 : 1
              const bActive = b.linked_rev_id === selectedRevId ? 0 : 1
              if (aActive !== bActive) return aActive - bActive
              return (a.cutter_no || '').localeCompare(b.cutter_no || '')
            })

            const sortEquip = [...equipDetails].sort((a, b) => {
              const aActive = a.design_revision_id === selectedRevId ? 0 : 1
              const bActive = b.design_revision_id === selectedRevId ? 0 : 1
              if (aActive !== bActive) return aActive - bActive
              return (a.equipment_code || '').localeCompare(b.equipment_code || '')
            })

            const bindingBadge = (type: 'active' | 'legacy' | 'disposed' | 'shared') => {
              const cfg = {
                active: { label: tPC('bindingActive'), cls: 'badge badge--success' },
                shared: { label: tPC('bindingShared'), cls: 'badge badge--info' },
                legacy: { label: tPC('bindingLegacy'), cls: 'badge badge--neutral' },
                disposed: { label: tPC('bindingDisposed'), cls: 'badge badge--error' },
              }[type]
              return <span className={cfg.cls} style={{ fontSize: 7, padding: '1px 5px', marginLeft: 4 }}>{cfg.label}</span>
            }

            const renderMoldCard = (m: MoldDetail, binding: 'active' | 'legacy') => {
              const dims = [m.actual_length_mm, m.actual_width_mm, m.actual_height_mm].filter(Boolean).join('×')
              const isDisposed = m.usage_status === 'DISPOSED'
              return (
                <div
                  key={m.physical_mold_id}
                  onClick={() => setPreviewItem({ type: 'mold', data: m })}
                  style={{
                    border: binding === 'active' ? '1.5px solid var(--accent)' : '1px solid var(--border-default)',
                    borderRadius: 8, overflow: 'hidden',
                    background: binding === 'active' ? 'var(--tint-teal-bg)' : 'var(--bg-surface)',
                    opacity: binding === 'legacy' ? 0.75 : 1, transition: 'all 0.15s ease', cursor: 'pointer'
                  }}
                >
                  <div style={{
                    height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--tint-orange-bg) 0%, var(--bg-surface-2) 100%)',
                    borderBottom: '1px solid var(--border-subtle)', gap: 6
                  }}>
                    <Wrench size={18} style={{ color: 'var(--tint-orange-text)', opacity: 0.6 }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tint-orange-text)', textTransform: 'uppercase' }}>{tPC('moldThumbnail')}</span>
                  </div>
                  <div style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>{m.system_code || '—'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span className={STATUS_BADGE[m.usage_status || ''] || STATUS_BADGE[m.device_status || ''] || 'badge badge--neutral'} style={{ fontSize: 7 }}>
                          {m.usage_status || m.device_status || '—'}
                        </span>
                        {bindingBadge(isDisposed ? 'disposed' : binding)}
                      </div>
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.display_name || '—'}</span>
                    {dims && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--text-muted)' }}>
                        <Ruler size={9} /> <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{dims}mm</span>
                        {m.actual_weight && <> · <Scale size={9} /> {m.actual_weight}kg</>}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--text-muted)' }}>
                      <MapPin size={9} /> {getRack(m.rack_layers)}
                      {m.piece_count && <> · {m.piece_count}{tPC('pieceCount')}</>}
                      <> · <Building2 size={9} /> {m.keeper_company?.company_code || m.keeper_company?.company_name || 'YSD'}</>
                    </div>
                  </div>
                </div>
              )
            }

            const renderCutterCard = (c: CutterDetail, binding: 'active' | 'legacy') => {
              const isShared = c.is_shared
              const isDisposed = c.usage_status === 'DISPOSED'
              const dims = [c.cutter_length_mm, c.cutter_width_mm].filter(Boolean).join('×')

              return (
                <div
                  key={c.cutter_id}
                  onClick={() => setPreviewItem({ type: 'cutter', data: c })}
                  style={{
                    border: binding === 'active' ? '1.5px solid var(--accent)' : '1px solid var(--border-default)',
                    borderRadius: 8, overflow: 'hidden',
                    background: binding === 'active' ? 'var(--tint-teal-bg)' : 'var(--bg-surface)',
                    opacity: binding === 'legacy' ? 0.75 : 1, transition: 'all 0.15s ease', cursor: 'pointer'
                  }}
                >
                  <div style={{
                    height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--tint-purple-bg) 0%, var(--bg-surface-2) 100%)',
                    borderBottom: '1px solid var(--border-subtle)', gap: 6
                  }}>
                    <Scissors size={18} style={{ color: 'var(--tint-purple-text)', opacity: 0.6 }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--tint-purple-text)', textTransform: 'uppercase' }}>{tPC('cutterThumbnail')}</span>
                  </div>
                  <div style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>{c.cutter_no || '—'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span className={STATUS_BADGE[c.usage_status || ''] || 'badge badge--success'} style={{ fontSize: 7 }}>
                          {c.usage_status || (c.cutter_presence ? '在空' : '保管中')}
                        </span>
                        {bindingBadge(isDisposed ? 'disposed' : (isShared ? 'shared' : binding))}
                      </div>
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.cutter_name || '—'}</span>
                    {dims && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--text-muted)' }}>
                        <Ruler size={9} /> <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{dims}mm</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--text-muted)' }}>
                      <MapPin size={9} /> {getRack(c.rack_layers)}
                      <> · <Building2 size={9} /> {c.keeper_company?.company_code || c.keeper_company?.company_name || 'YSD'}</>
                    </div>
                  </div>
                </div>
              )
            }

            const renderEquipCard = (eq: EquipDetail, binding: 'active' | 'legacy') => {
              const isPlug = eq.equipment_type?.includes('PLUG')
              const isCutter = eq.equipment_type?.includes('CUTTER')
              const Icon = isCutter ? Scissors : isPlug ? Pin : Wrench
              const tintBg = isCutter ? 'var(--tint-purple-bg)' : isPlug ? 'var(--tint-blue-bg)' : 'var(--tint-orange-bg)'
              const tintText = isCutter ? 'var(--tint-purple-text)' : isPlug ? 'var(--tint-blue-text)' : 'var(--tint-orange-text)'
              const typeLabel = isCutter ? tPC('cutterThumbnail') : isPlug ? tPC('plugThumbnail') : eq.equipment_type || 'Equipment'
              const isDisposed = eq.usage_status === 'DISPOSED'

              return (
                <div
                  key={eq.equipment_id}
                  onClick={() => setPreviewItem({ type: 'equip', data: eq })}
                  style={{
                    border: binding === 'active' ? '1.5px solid var(--accent)' : '1px solid var(--border-default)',
                    borderRadius: 8, overflow: 'hidden',
                    background: binding === 'active' ? 'var(--tint-teal-bg)' : 'var(--bg-surface)',
                    opacity: binding === 'legacy' ? 0.75 : 1, transition: 'all 0.15s ease', cursor: 'pointer'
                  }}
                >
                  <div style={{
                    height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `linear-gradient(135deg, ${tintBg} 0%, var(--bg-surface-2) 100%)`,
                    borderBottom: '1px solid var(--border-subtle)', gap: 6
                  }}>
                    <Icon size={18} style={{ color: tintText, opacity: 0.6 }} />
                    <span style={{ fontSize: 9, fontWeight: 700, color: tintText, textTransform: 'uppercase' }}>{typeLabel}</span>
                  </div>
                  <div style={{ padding: '6px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>{eq.equipment_code || '—'}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span className={STATUS_BADGE[eq.usage_status || ''] || STATUS_BADGE[eq.device_status || ''] || 'badge badge--neutral'} style={{ fontSize: 7 }}>
                          {eq.usage_status || eq.device_status || '—'}
                        </span>
                        {bindingBadge(isDisposed ? 'disposed' : binding)}
                      </div>
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eq.display_name || '—'}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--text-muted)' }}>
                      <MapPin size={9} /> {getRack(eq.rack_layers)}
                      <> · <Building2 size={9} /> {eq.keeper_company?.company_code || eq.keeper_company?.company_name || 'YSD'}</>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-orange-border)' }}>
                <div style={{
                  background: 'var(--tint-orange-bg)', borderBottom: '1px solid var(--tint-orange-border)',
                  padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6
                }}>
                  <Wrench size={14} style={{ color: 'var(--tint-orange-text)' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tint-orange-text)' }}>{tPC('equipmentOverview')}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    {grandTotal} items
                  </span>
                </div>

                <div style={{ padding: 12 }}>
                  {grandTotal === 0 ? (
                    <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 12 }}>
                      {tPC('noEquipmentLinked')}
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                      {/* Column 1: Physical Molds */}
                      {moldDetails.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{
                            fontSize: 11, fontWeight: 700, color: 'var(--tint-orange-text)',
                            display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 4,
                            borderBottom: '2px solid var(--tint-orange-border)'
                          }}>
                            <Wrench size={12} />
                            <span>{tPC('moldsGroupTitle') || '金型 (Molds)'}</span>
                            <span className="badge badge--neutral font-mono font-bold" style={{ fontSize: 9, marginLeft: 'auto' }}>
                              {moldDetails.length}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {sortMolds.map(m => renderMoldCard(m, getMoldRevId(m) === selectedRevId ? 'active' : 'legacy'))}
                          </div>
                        </div>
                      )}

                      {/* Column 2: Cutters / 抜型 */}
                      {cutterDetails.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{
                            fontSize: 11, fontWeight: 700, color: 'var(--tint-purple-text)',
                            display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 4,
                            borderBottom: '2px solid var(--tint-purple-border)'
                          }}>
                            <Scissors size={12} />
                            <span>{tPC('cuttersGroupTitle') || '抜型 (Cutting Dies)'}</span>
                            <span className="badge badge--neutral font-mono font-bold" style={{ fontSize: 9, marginLeft: 'auto' }}>
                              {cutterDetails.length}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {sortCutters.map(c => renderCutterCard(c, c.linked_rev_id === selectedRevId ? 'active' : 'legacy'))}
                          </div>
                        </div>
                      )}

                      {/* Column 3: Plugs & Auxiliary Equipment */}
                      {equipDetails.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <div style={{
                            fontSize: 11, fontWeight: 700, color: 'var(--tint-blue-text)',
                            display: 'flex', alignItems: 'center', gap: 5, paddingBottom: 4,
                            borderBottom: '2px solid var(--tint-blue-border)'
                          }}>
                            <Pin size={12} />
                            <span>{tPC('auxEquipGroupTitle') || 'プラグ・その他設備'}</span>
                            <span className="badge badge--neutral font-mono font-bold" style={{ fontSize: 9, marginLeft: 'auto' }}>
                              {equipDetails.length}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {sortEquip.map(eq => renderEquipCard(eq, eq.design_revision_id === selectedRevId ? 'active' : 'legacy'))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })()}

        </div>
      </div>

      {/* ═══ BOTTOM 3-COLUMN ROW ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>

        {/* Recent Orders */}
        <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-purple-border)' }}>
          <div style={{
            background: 'var(--tint-purple-bg)', borderBottom: '1px solid var(--tint-purple-border)',
            padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <FileText size={14} style={{ color: 'var(--tint-purple-text)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tint-purple-text)' }}>{tPC('recentOrdersCard')}</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{totalOrderCount} total</span>
          </div>
          <div style={{ padding: 10 }}>
            {recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: 11 }}>{tPC('noOrdersForProduct')}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {recentOrders.slice(0, 4).map(ol => (
                  <div key={ol.line_id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '5px 8px', borderRadius: 4, background: 'var(--bg-surface-2)', fontSize: 11
                  }}>
                    <Link
                      href={ol.orders ? `/orders/${ol.orders.order_id}` : '#'}
                      style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}
                    >
                      {ol.orders?.order_no || '—'}
                    </Link>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ol.quantity?.toLocaleString()} pcs
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                      {ol.orders?.order_date?.slice(0, 10) || '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Design Timeline */}
        <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-blue-border)' }}>
          <div style={{
            background: 'var(--tint-blue-bg)', borderBottom: '1px solid var(--tint-blue-border)',
            padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6
          }}>
            <Layers size={14} style={{ color: 'var(--tint-blue-text)' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tint-blue-text)' }}>{tPC('designHistory')}</span>
          </div>
          <div style={{ padding: 10 }}>
            {allRevs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: 11 }}>{tCommon('noData')}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {allRevs.map(r => (
                  <div
                    key={r.revision_id}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '5px 8px', borderRadius: 4,
                      background: r.revision_id === activeRev?.revision_id ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--bg-surface-2)',
                      border: r.revision_id === activeRev?.revision_id ? '1px solid var(--accent)' : '1px solid transparent',
                      fontSize: 11
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Link href={`/engineering/designs/revisions/${r.revision_id}`} style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
                        {r.design_code || `Rev.${r.revision_number}`}
                      </Link>
                      <span className={REV_STATUS_BADGE[r.status] || 'badge badge--neutral'} style={{ fontSize: 8 }}>
                        {r.status}
                      </span>
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {r.created_at?.slice(0, 10)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Customer + Active Job + Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Customer Quick Card */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-blue-border)' }}>
            <div style={{
              background: 'var(--tint-blue-bg)', borderBottom: '1px solid var(--tint-blue-border)',
              padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building2 size={14} style={{ color: 'var(--tint-blue-text)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tint-blue-text)' }}>{tCust('customer')}</span>
              </div>
              {customer && (
                <Link href={`/master/customers/${customer.company_id}`} style={{ fontSize: 10, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <ExternalLink size={10} /> {tPC('openPage')}
                </Link>
              )}
            </div>
            <div style={{ padding: '8px 12px' }}>
              {customer ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <InfoRow label={tCust('customerCode')} value={customer.company_code} mono accent />
                  <InfoRow label={tCust('companyName')} value={customer.company_name} />
                  {customer.tel && <InfoRow label={tPC('phoneLabel')} value={customer.tel} mono />}
                </div>
              ) : (
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</div>
              )}
            </div>
          </div>

          {/* Active Job Card */}
          {activeJob && (
            <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-orange-border)' }}>
              <div style={{
                background: 'var(--tint-orange-bg)', borderBottom: '1px solid var(--tint-orange-border)',
                padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6
              }}>
                <Hammer size={14} style={{ color: 'var(--tint-orange-text)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tint-orange-text)' }}>{tPC('activeJobCard')}</span>
              </div>
              <div style={{ padding: '8px 12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href={`/equipment/jobs/${activeJob.id}`} style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}>
                      {activeJob.code}
                    </Link>
                    <span className={STATUS_BADGE[activeJob.status] || 'badge badge--neutral'} style={{ fontSize: 8 }}>
                      {activeJob.status}
                    </span>
                  </div>
                  {activeJob.name && <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{activeJob.name}</span>}
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {tPC('deadline')}: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{activeJob.deadline}</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--status-warning-bg)' }}>
              <div style={{
                background: 'var(--status-warning-bg)', borderBottom: '1px solid color-mix(in srgb, var(--status-warning) 30%, transparent)',
                padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6
              }}>
                <ShieldAlert size={14} style={{ color: 'var(--status-warning-text)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-warning-text)' }}>{tPC('systemAlerts')}</span>
              </div>
              <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {alerts.map(a => (
                  <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: a.type === 'warning' ? 'var(--status-warning-text)' : 'var(--text-secondary)' }}>
                    <AlertTriangle size={12} />
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Equipment Quick Preview Modal */}
        <EquipmentQuickPreviewModal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          item={previewItem}
        />

      </div>

    </div>
  )
}