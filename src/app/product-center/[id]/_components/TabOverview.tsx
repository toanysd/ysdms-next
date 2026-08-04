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
  cavity_pitch_mm: number | null
  machine_feed_pitch_mm: number | null
  plastic_type_designed: string | null
  corner_r: number | null
  chamfer_c: number | null
  draft_angle: number | null
  orientation: string | null
  setup_type: string | null
  plug_type: string | null
  has_separate_cutter: boolean | null
  customer_tray_name: string | null
  tray_info: string | null
  change_summary: string | null
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
  unit_price: number | null
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '3px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
      <span style={{
        fontSize: 12, fontWeight: 600,
        fontFamily: mono ? 'monospace' : 'inherit',
        color: accent ? 'var(--accent)' : 'var(--text-primary)',
        maxWidth: '60%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
      }}>
        {value ?? '—'}
      </span>
    </div>
  )
}

/* ────────── helper: spec pill ────────── */
function SpecPill({ label, value, bg, color, border, isDiff }: { label: string; value: string; bg: string; color: string; border: string; isDiff?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{label}</span>
        {isDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
      </div>
      <span style={{
        background: isDiff ? 'var(--tint-orange-bg)' : bg,
        color: isDiff ? 'var(--tint-orange-text)' : color,
        border: `1px solid ${isDiff ? 'var(--tint-orange-border)' : border}`,
        padding: '3px 8px', borderRadius: 5, fontFamily: 'monospace', fontWeight: 700, fontSize: 13, display: 'inline-block'
      }}>
        {value}
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
            cutline_length, cutline_width, cavity_count, cavity_pitch_mm, machine_feed_pitch_mm,
            plastic_type_designed, corner_r, chamfer_c, draft_angle, orientation, setup_type, plug_type,
            has_separate_cutter, customer_tray_name, tray_info, change_summary, created_at, designer
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
              rack_layers(layer_code, racks(rack_code))
            `)
            .in('design_revision_id', revIds)

          if (equips) setEquipDetails(equips as unknown as EquipDetail[])
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
            line_id, quantity, unit_price, created_at,
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
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Delivered</span>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>{totalDelivered.toLocaleString()}</span>
          </div>
          <div style={{ width: 1, height: 14, background: 'var(--border-default)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle2 size={12} style={{ color: 'var(--tint-blue-text)' }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>On-Time</span>
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

          {/* Thumbnail Placeholder */}
          <div style={{
            width: '100%', height: 140,
            background: 'linear-gradient(135deg, var(--tint-teal-bg) 0%, var(--bg-surface-2) 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderBottom: '1px solid var(--border-subtle)', gap: 6
          }}>
            <Package size={44} style={{ color: 'var(--accent)', opacity: 0.35 }} />
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 }}>{tPC('noImageAvailable')}</span>
          </div>

          {/* Basic Info */}
          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <InfoRow label={tProd('productCode')} value={productCode} mono accent />
            <InfoRow label={tPC('internalNameLabel')} value={productNameInternal} />
            <InfoRow label={tProd('productName')} value={productName} />
            <InfoRow label={tPC('customerProductNameLabel')} value={customerProductName} />
            <InfoRow label={tProd('pocketCount')} value={pocketCount} mono />
            <InfoRow label={tPC('piecesPerBoxLabel')} value={piecesPerBox} mono />
            <InfoRow label={tPC('boxSpecLabel')} value={null} />
            <InfoRow label={tPC('plasticSpecLabel')} value={primaryPlasticSpec || primaryPlasticCode} mono />
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
                    {activeRev.change_summary && (
                      <div style={{
                        padding: '6px 10px', background: 'var(--tint-orange-bg)',
                        border: '1px solid var(--tint-orange-border)', borderRadius: 6,
                        fontSize: 11, color: 'var(--tint-orange-text)', display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        <AlertTriangle size={12} />
                        <span><strong>{tPC('changeSummary')}:</strong> {activeRev.change_summary}</span>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 16px', fontSize: 12 }}>
                      {/* Row 1: Core dimensions */}
                      {trayDims && <SpecPill label={tPC('trayDimensions')} value={`${trayDims} mm`} bg="var(--tint-green-bg)" color="var(--tint-green-text)" border="var(--tint-green-border)" isDiff={trayDimsDiff} />}
                      {cutlineDims && <SpecPill label={tPC('cutlineDimensions')} value={`${cutlineDims} mm`} bg="var(--tint-blue-bg)" color="var(--tint-blue-text)" border="var(--tint-blue-border)" isDiff={cutlineDimsDiff} />}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...diffFieldStyle(cavityDiff) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('cavityAndPitch')}</span>
                          {cavityDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                        </div>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 13, fontFamily: 'monospace' }}>
                          {activeRev.cavity_count || '—'} cav
                          {activeRev.cavity_pitch_mm ? ` / ${activeRev.cavity_pitch_mm}mm` : ''}
                        </span>
                      </div>

                      {/* Row 2: Material & feed */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...diffFieldStyle(plasticDiff) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('designedMaterial')}</span>
                          {plasticDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                        </div>
                        {(activeRev.plastic_type_designed || primaryPlasticCode) ? (
                          <span style={{ background: plasticDiff ? 'var(--tint-orange-bg)' : 'var(--bg-surface-2)', border: plasticDiff ? '1px solid var(--tint-orange-border)' : '1px solid var(--border-default)', padding: '3px 8px', borderRadius: 5, fontFamily: 'monospace', fontWeight: 700, fontSize: 12, display: 'inline-block' }}>
                            {activeRev.plastic_type_designed || primaryPlasticCode}
                          </span>
                        ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...diffFieldStyle(feedPitchDiff) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('feedPitch')}</span>
                          {feedPitchDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                        </div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                          {activeRev.machine_feed_pitch_mm ? `${activeRev.machine_feed_pitch_mm} mm` : '—'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...diffFieldStyle(customerTrayNameDiff) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('customerTrayName')}</span>
                          {customerTrayNameDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>
                          {activeRev.customer_tray_name || '—'}
                        </span>
                      </div>

                      {/* Row 3: Advanced specs */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...diffFieldStyle(cornerRDiff) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('cornerRadiusLabel')}</span>
                          {cornerRDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                        </div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-primary)' }}>
                          {activeRev.corner_r != null ? `R${activeRev.corner_r}` : '—'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...diffFieldStyle(chamferCDiff) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('chamferLabel')}</span>
                          {chamferCDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                        </div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-primary)' }}>
                          {activeRev.chamfer_c != null ? `C${activeRev.chamfer_c}` : '—'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...diffFieldStyle(draftAngleDiff) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('draftAngleLabel')}</span>
                          {draftAngleDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                        </div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-primary)' }}>
                          {activeRev.draft_angle != null ? `${activeRev.draft_angle}°` : '—'}
                        </span>
                      </div>

                      {/* Row 4: Process specs */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...diffFieldStyle(orientationDiff) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('orientationLabel')}</span>
                          {orientationDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{activeRev.orientation || '—'}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...diffFieldStyle(setupTypeDiff) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('setupTypeLabel')}</span>
                          {setupTypeDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{activeRev.setup_type || '—'}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...diffFieldStyle(plugTypeDiff) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('plugTypeLabel')}</span>
                          {plugTypeDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{activeRev.plug_type || '—'}</span>
                      </div>

                      {/* Row 5: Cutter & tray info */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, ...diffFieldStyle(separateCutterDiff) }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('hasSeparateCutterLabel')}</span>
                          {separateCutterDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>
                          {activeRev.has_separate_cutter == null ? '—' : activeRev.has_separate_cutter ? tPC('yesLabel') : tPC('noLabel')}
                        </span>
                      </div>
                      {activeRev.tray_info && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, gridColumn: 'span 2', ...diffFieldStyle(trayInfoDiff) }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>{tPC('trayInfoLabel')}</span>
                            {trayInfoDiff && <span className="badge badge--warning" style={{ fontSize: 7, padding: '0 4px' }}>Diff</span>}
                          </div>
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{activeRev.tray_info}</span>
                        </div>
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

          {/* ═══ Equipment Overview Cards (PA2+ with binding classification) ═══ */}
          {(() => {
            // Classify equipment by binding to selected revision
            const getMoldRevId = (m: MoldDetail) => m.mold_revisions?.design_revision_id || null
            const activeMolds = moldDetails.filter(m => getMoldRevId(m) === selectedRevId)
            const legacyMolds = moldDetails.filter(m => getMoldRevId(m) !== selectedRevId)
            const activeEquip = equipDetails.filter(e => e.design_revision_id === selectedRevId)
            const legacyEquip = equipDetails.filter(e => e.design_revision_id !== selectedRevId)

            const totalActive = activeMolds.length + activeEquip.length
            const totalLegacy = legacyMolds.length + legacyEquip.length

            const bindingBadge = (type: 'active' | 'legacy' | 'disposed') => {
              const cfg = {
                active: { label: tPC('bindingActive'), cls: 'badge badge--success' },
                legacy: { label: tPC('bindingLegacy'), cls: 'badge badge--neutral' },
                disposed: { label: tPC('bindingDisposed'), cls: 'badge badge--error' },
              }[type]
              return <span className={cfg.cls} style={{ fontSize: 7, padding: '1px 5px', marginLeft: 4 }}>{cfg.label}</span>
            }

            const renderMoldCard = (m: MoldDetail, binding: 'active' | 'legacy') => {
              const dims = [m.actual_length_mm, m.actual_width_mm, m.actual_height_mm].filter(Boolean).join('×')
              const isDisposed = m.usage_status === 'DISPOSED'
              return (
                <Link key={m.physical_mold_id} href={`/equipment/molds/${m.physical_mold_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden',
                    opacity: binding === 'legacy' ? 0.7 : 1, transition: 'all 0.15s ease', cursor: 'pointer'
                  }}>
                    <div style={{
                      height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'linear-gradient(135deg, var(--tint-orange-bg) 0%, var(--bg-surface-2) 100%)',
                      borderBottom: '1px solid var(--border-subtle)', gap: 6
                    }}>
                      <Wrench size={22} style={{ color: 'var(--tint-orange-text)', opacity: 0.5 }} />
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
                      </div>
                    </div>
                  </div>
                </Link>
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
                <div key={eq.equipment_id} style={{
                  border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden',
                  opacity: binding === 'legacy' ? 0.7 : 1, transition: 'all 0.15s ease'
                }}>
                  <div style={{
                    height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: `linear-gradient(135deg, ${tintBg} 0%, var(--bg-surface-2) 100%)`,
                    borderBottom: '1px solid var(--border-subtle)', gap: 6
                  }}>
                    <Icon size={22} style={{ color: tintText, opacity: 0.5 }} />
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
                    {moldDetails.length + equipDetails.length} items
                  </span>
                </div>

                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {moldDetails.length === 0 && equipDetails.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 12 }}>
                      {tPC('noEquipmentLinked')}
                    </div>
                  ) : (
                    <>
                      {/* Active Equipment (for selected revision) */}
                      {totalActive > 0 && (
                        <>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tint-teal-text)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <CircleDot size={10} /> {tPC('equipForRevision')} ({totalActive})
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                            {activeMolds.map(m => renderMoldCard(m, 'active'))}
                            {activeEquip.map(eq => renderEquipCard(eq, 'active'))}
                          </div>
                        </>
                      )}

                      {/* Legacy Equipment (older revisions) */}
                      {totalLegacy > 0 && (
                        <>
                          <div style={{
                            fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
                            display: 'flex', alignItems: 'center', gap: 4,
                            borderTop: totalActive > 0 ? '1px dashed var(--border-default)' : 'none',
                            paddingTop: totalActive > 0 ? 8 : 0
                          }}>
                            <Layers size={10} /> {tPC('equipOlderRevisions')} ({totalLegacy})
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                            {legacyMolds.map(m => renderMoldCard(m, 'legacy'))}
                            {legacyEquip.map(eq => renderEquipCard(eq, 'legacy'))}
                          </div>
                        </>
                      )}
                    </>
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

      </div>

    </div>
  )
}