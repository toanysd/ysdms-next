'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, ArrowUpFromLine, Truck, Download, Save,
  Building2, MapPin, CheckCircle2, Clock, XCircle, AlertCircle,
  Package, Calendar, ExternalLink, RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface ShipmentDetailPageProps {
  params: Promise<{ id: string }>
}

const STATUS_OPTIONS = [
  { value: 'PREPARING', labelJA: '準備中 (Preparing)', bg: '#F1F5F9', color: '#475569' },
  { value: 'SHIPPED', labelJA: '出荷済 (Shipped)', bg: '#EFF6FF', color: '#2563EB' },
  { value: 'DELIVERED', labelJA: '納品受領済 (Delivered)', bg: '#ECFDF5', color: '#059669' },
  { value: 'CANCELLED', labelJA: 'キャンセル', bg: '#FEF2F2', color: '#DC2626' },
]

export default function ShipmentDetailPage({ params }: ShipmentDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const t = useTranslations('Shipments')
  const supabase = createClient()

  const [shipment, setShipment] = useState<any>(null)
  const [orderLines, setOrderLines] = useState<any[]>([])
  const [status, setStatus] = useState('SHIPPED')
  const [deliveryMethod, setDeliveryMethod] = useState('TRUCK')
  const [trackingNo, setTrackingNo] = useState('')
  const [notes, setNotes] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadShipment = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Fetch Shipment Header
      const { data: sData, error: sErr } = await supabase
        .from('shipments')
        .select(`
          *,
          orders:orders!shipments_order_id_fkey (
            order_id, order_no, order_date, order_status,
            companies:companies!orders_company_id_fkey ( company_id, company_name, company_code, tel, address )
          ),
          delivery_sites:delivery_sites!shipments_delivery_site_id_fkey ( site_id, site_name, site_address, site_tel, contact_person ),
          employees:employees!shipments_shipped_by_fkey ( employee_id, employee_name )
        `)
        .eq('shipment_id', id)
        .single()

      if (sErr) throw sErr
      if (sData) {
        setShipment(sData)
        setStatus(sData.status || 'SHIPPED')
        setDeliveryMethod(sData.delivery_method || 'TRUCK')
        setTrackingNo(sData.tracking_no || '')
        setNotes(sData.notes || '')
      }

      // 2. Fetch Order Lines
      if (sData?.orders?.order_id) {
        const { data: lines, error: lErr } = await supabase
          .from('order_lines')
          .select(`
            line_id, line_no, quantity, unit, box_type, packing_style, line_status, ship_date,
            products:products!order_lines_product_id_fkey ( product_id, product_code, product_name )
          `)
          .eq('order_id', sData.orders.order_id)
          .order('line_no', { ascending: true })

        if (lErr) throw lErr
        if (lines) setOrderLines(lines)
      }
    } catch (err: any) {
      console.error('Error loading shipment detail:', err)
      setError(err?.message || '出荷データの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShipment()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    setError(null)

    try {
      const { error: updErr } = await supabase
        .from('shipments')
        .update({
          status,
          delivery_method: deliveryMethod,
          tracking_no: trackingNo || null,
          notes: notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('shipment_id', id)

      if (updErr) throw updErr

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      console.error('Error updating shipment:', err)
      setError(err?.message || '更新中にエラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="card-flat" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 8px' }} />
        出荷伝票データを読込中...
      </div>
    )
  }

  if (error || !shipment) {
    return (
      <div className="card-flat" style={{ padding: 24, textAlign: 'center', color: '#DC2626' }}>
        <AlertCircle size={20} style={{ margin: '0 auto 8px' }} />
        {error || '出荷伝票が見つかりませんでした'}
        <div style={{ marginTop: 12 }}>
          <Link href="/orders/shipments" className="btn btn-secondary">
            {t('backToList')}
          </Link>
        </div>
      </div>
    )
  }

  const statusConf = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[1]
  const totalShippedQty = orderLines.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>

      {/* ── 1. BackBar & Navigation ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => router.back()}
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 10px', fontSize: 11, gap: 4 }}
          >
            <ArrowLeft size={12} />
            <span>戻る</span>
          </button>
          <Link
            href="/orders/shipments"
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 10px', fontSize: 11, gap: 4 }}
          >
            <ArrowUpFromLine size={12} />
            <span>{t('shipmentList')}</span>
          </Link>

          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 15, color: 'var(--accent, #0D9488)', marginLeft: 6 }}>
            {shipment.delivery_note_no}
          </span>

          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
            background: statusConf.bg, color: statusConf.color,
          }}>
            {statusConf.labelJA}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {saveSuccess && (
            <span style={{ fontSize: 11, color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={13} /> 保存しました
            </span>
          )}

          <a
            href={`/api/shipments/${shipment.shipment_id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 12px', fontSize: 11, gap: 4, textDecoration: 'none', display: 'flex', alignItems: 'center' }}
          >
            <Download size={12} />
            <span>{t('printDeliveryNote')}</span>
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ height: 28, padding: '0 14px', fontSize: 11, gap: 4 }}
          >
            <Save size={12} />
            <span>{saving ? '保存中...' : '変更を保存'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. Top Overview Grid ── */}
      <div className="card-flat" style={{ padding: 14, flexShrink: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {/* Customer & Delivery Site */}
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              {t('customerName')} & {t('deliverySite')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <Building2 size={14} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--text-primary)' }}>
                {shipment.orders?.companies?.company_name || '得意先未設定'}
              </span>
            </div>
            {shipment.delivery_sites?.site_name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--accent)' }}>
                <MapPin size={11} />
                <span style={{ fontWeight: 600 }}>{shipment.delivery_sites.site_name}</span>
              </div>
            )}
            {shipment.delivery_sites?.site_address && (
              <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block' }}>{shipment.delivery_sites.site_address}</span>
            )}
          </div>

          {/* Linked Order */}
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              {t('orderNo')} (Linked Order)
            </span>
            {shipment.orders?.order_id ? (
              <Link
                href={`/orders/${shipment.orders.order_id}`}
                style={{
                  fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: 'var(--accent)',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4
                }}
              >
                {shipment.orders.order_no}
                <ExternalLink size={11} />
              </Link>
            ) : (
              <span style={{ color: 'var(--text-muted)' }}>—</span>
            )}
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
              出荷日: <strong style={{ color: 'var(--text-primary)' }}>{shipment.ship_date}</strong>
            </span>
          </div>

          {/* Status & Method */}
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              {t('shipmentStatus')}
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-input"
              style={{ height: 26, fontSize: 11 }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.labelJA}</option>
              ))}
            </select>
          </div>

          {/* Tracking / Vehicle */}
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              {t('trackingNo')}
            </span>
            <input
              type="text"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              className="form-input"
              placeholder="便名・車両番号・追跡番号"
              style={{ height: 26, fontSize: 11 }}
            />
          </div>
        </div>
      </div>

      {/* ── 3. Delivered Products Table ── */}
      <div className="card-flat" style={{ flex: 1, overflow: 'auto', padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Package size={15} style={{ color: 'var(--accent, #0D9488)' }} />
            <span>出荷対象製品明細 (Delivered Products)</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 700 }}>
            合計数量: {totalShippedQty.toLocaleString()} 点 ({orderLines.length} 品目)
          </span>
        </div>

        <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ width: 45, textAlign: 'center' }}>No</th>
              <th style={{ width: 140 }}>製品コード</th>
              <th>製品名・仕様</th>
              <th style={{ width: 100, textAlign: 'right' }}>出荷数量</th>
              <th style={{ width: 60, textAlign: 'center' }}>単位</th>
              <th style={{ width: 140 }}>梱包形態・荷姿</th>
              <th style={{ width: 110, textAlign: 'center' }}>状態</th>
            </tr>
          </thead>
          <tbody>
            {orderLines.map((line, idx) => (
              <tr key={line.line_id || idx}>
                <td style={{ textAlign: 'center', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                  {line.line_no || idx + 1}
                </td>
                <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent, #0D9488)' }}>
                  <Link href={`/product-center/${line.products?.product_id || ''}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                    {line.products?.product_code || '—'}
                  </Link>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {line.products?.product_name || 'トレイ製品'}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: 'var(--text-primary)' }}>
                  {Number(line.quantity || 0).toLocaleString()}
                </td>
                <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  {line.unit || '枚'}
                </td>
                <td>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                    {line.box_type || line.packing_style || 'ダンボール梱包'}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="badge badge--success" style={{ fontSize: 9 }}>✓ 出荷済</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Notes */}
        <div style={{ marginTop: 14 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
            出荷備考・特記事項 (Shipment Notes)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-textarea"
            rows={2}
            placeholder="配送時の注意点、受領サイン特記事項など..."
          />
        </div>
      </div>

    </div>
  )
}
