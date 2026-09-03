'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  ArrowLeft, ArrowUpFromLine, Truck, Download, Save,
  Building2, MapPin, CheckCircle2, Clock, XCircle, AlertCircle,
  Package, Calendar, ExternalLink, RefreshCw, Layers, Boxes
} from 'lucide-react'
import Link from 'next/link'

interface ShipmentDetailPageProps {
  params: Promise<{ id: string }>
}

const STATUS_OPTIONS = [
  { value: 'PREPARING', labelJA: '準備中 ⏳', bg: '#F1F5F9', color: '#475569' },
  { value: 'SHIPPED', labelJA: '出荷済 🚚', bg: '#EFF6FF', color: '#2563EB' },
  { value: 'DELIVERED', labelJA: '受領済 ✅', bg: '#ECFDF5', color: '#059669' },
  { value: 'CANCELLED', labelJA: 'キャンセル ❌', bg: '#FEF2F2', color: '#DC2626' },
]

export default function ShipmentDetailPage({ params }: ShipmentDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const t = useTranslations('Shipment')
  const supabase = createClient()

  const [shipment, setShipment] = useState<any>(null)
  const [orderLines, setOrderLines] = useState<any[]>([])
  const [shipmentLots, setShipmentLots] = useState<any[]>([])
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
          employees:employees!shipments_shipped_by_fkey ( employee_id, full_name )
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

      // 2. Fetch Shipment Lots (Lô xuất kho)
      const { data: lots, error: lotErr } = await supabase
        .from('shipment_lots')
        .select(`
          shipment_lot_id, qty_shipped, carton_count, pallet_no, notes,
          production_lots (
            lot_id, lot_no,
            products (product_code, product_name)
          )
        `)
        .eq('shipment_id', id)

      if (!lotErr && lots) {
        setShipmentLots(lots)
      }

      // 3. Fetch Linked Order Lines (Tiến độ Order Line)
      if (sData?.orders?.order_id) {
        const { data: lines, error: lErr } = await supabase
          .from('order_lines')
          .select(`
            line_id, line_no, quantity, shipped_qty, remaining_qty, unit, box_type, packing_style, line_status, ship_date,
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
  const totalShippedQty = orderLines.reduce((sum, l) => sum + (Number(l.shipped_qty ?? l.quantity) || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>

      {/* ── 1. BackBar & Navigation (Rule 3) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, flexWrap: 'wrap', gap: 8, padding: '10px 14px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => router.back()}
            className="btn btn-secondary text-xs font-bold px-2 py-1 h-auto flex items-center gap-1"
          >
            <ArrowLeft size={13} />
            <span>戻る</span>
          </button>
          <Link
            href="/orders/shipments"
            className="btn btn-secondary text-xs font-bold px-2 py-1 h-auto flex items-center gap-1"
          >
            <ArrowUpFromLine size={13} />
            <span>一覧</span>
          </Link>

          <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 15, color: 'var(--accent)', marginLeft: 6 }}>
            {shipment.delivery_note_no || 'DN-未採番'}
          </span>

          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
            background: statusConf.bg, color: statusConf.color,
          }}>
            {statusConf.labelJA}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {saveSuccess && (
            <span style={{ fontSize: 11, color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={13} /> 保存完了
            </span>
          )}

          <a
            href={`/api/shipments/${shipment.shipment_id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary text-xs font-bold px-3 py-1.5 h-auto flex items-center gap-1.5 text-slate-700 hover:text-teal-700"
          >
            <Download size={13} color="var(--accent)" />
            <span>納品書PDF</span>
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary text-xs font-bold px-3 py-1.5 h-auto flex items-center gap-1.5"
          >
            <Save size={13} />
            <span>{saving ? '保存中...' : '変更を保存'}</span>
          </button>
        </div>
      </div>

      {/* ── Section A: Header thông tin giao hàng ── */}
      <div className="card-flat" style={{ padding: 16, flexShrink: 0 }}>
        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Truck size={15} color="var(--accent)" />
          <span>出荷伝票 基本情報 (Shipment Header)</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {/* Customer & Delivery Site */}
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              得意先 & 納入場所
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
              関連受注 (Linked Order)
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
              出荷日: <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{shipment.ship_date}</strong>
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>
              担当者: <strong style={{ color: 'var(--text-primary)' }}>{shipment.employees?.full_name || '未割当'}</strong>
            </span>
          </div>

          {/* Status & Method */}
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              出荷ステータス & 配送方法
            </span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="form-select mb-2"
              style={{ height: 28, fontSize: 11 }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.labelJA}</option>
              ))}
            </select>
            <select
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value)}
              className="form-select"
              style={{ height: 28, fontSize: 11 }}
            >
              <option value="TRUCK">自社便・トラック (TRUCK)</option>
              <option value="COURIER">路線便・宅配 (COURIER)</option>
              <option value="SELF_PICKUP">顧客引取 (SELF_PICKUP)</option>
              <option value="OTHER">その他 (OTHER)</option>
            </select>
          </div>

          {/* Tracking / Notes */}
          <div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 2 }}>
              送り状番号 (Tracking No)
            </span>
            <input
              type="text"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              className="form-input"
              placeholder="便名・車両番号・問合せ番号"
              style={{ height: 28, fontSize: 11 }}
            />
          </div>
        </div>
      </div>

      {/* ── Section B: Chi tiết lô xuất kho (shipment_lots) ── */}
      <div className="card-flat" style={{ padding: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Boxes size={15} style={{ color: 'var(--accent)' }} />
            <span>出荷対象製品・ロット詳細 (Shipment Lots)</span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: 700 }}>
            出荷品目: {orderLines.length} 品目
          </span>
        </div>

        {shipmentLots.length > 0 ? (
          <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ width: 100 }}>Lot#</th>
                <th style={{ width: 140 }}>品番</th>
                <th>品名・仕様</th>
                <th style={{ width: 110, textAlign: 'right' }}>出荷数</th>
                <th style={{ width: 90, textAlign: 'center' }}>カートン</th>
                <th style={{ width: 90, textAlign: 'center' }}>Pallet</th>
                <th>備考</th>
              </tr>
            </thead>
            <tbody>
              {shipmentLots.map((lot, idx) => (
                <tr key={lot.shipment_lot_id || idx}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>
                    {lot.production_lots?.lot_no || 'L-未設定'}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                    {lot.production_lots?.products?.product_code || '—'}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>
                      {lot.production_lots?.products?.product_name || '成型品'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, fontSize: 13 }}>
                    {Number(lot.qty_shipped || 0).toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>
                    {lot.carton_count ? `${lot.carton_count} 箱` : '—'}
                  </td>
                  <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>
                    {lot.pallet_no || '—'}
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {lot.notes || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ width: 45, textAlign: 'center' }}>No</th>
                <th style={{ width: 140 }}>製品コード</th>
                <th>製品名・仕様</th>
                <th style={{ width: 110, textAlign: 'right' }}>今回出荷数量</th>
                <th style={{ width: 60, textAlign: 'center' }}>単位</th>
                <th style={{ width: 140 }}>荷姿・梱包</th>
                <th style={{ width: 110, textAlign: 'center' }}>状態</th>
              </tr>
            </thead>
            <tbody>
              {orderLines.map((line, idx) => (
                <tr key={line.line_id || idx}>
                  <td style={{ textAlign: 'center', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    {line.line_no || idx + 1}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent)' }}>
                    {line.products?.product_code || '—'}
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {line.products?.product_name || 'トレイ製品'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: 'var(--text-primary)' }}>
                    {Number(line.shipped_qty ?? line.quantity).toLocaleString()}
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
        )}
      </div>

      {/* ── Section C: Tiến độ Order Line của Order liên quan ── */}
      <div className="card-flat" style={{ padding: 16 }}>
        <h2 className="text-[13px] font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Layers size={15} color="var(--accent)" />
          <span>受注明細 出荷進捗 (Order Line Delivery Progress)</span>
        </h2>

        <div className="space-y-3">
          {orderLines.map((line) => {
            const totalQty = Number(line.quantity) || 0
            const shipped = Number(line.shipped_qty || 0)
            const remaining = line.remaining_qty !== null && line.remaining_qty !== undefined
              ? Number(line.remaining_qty)
              : Math.max(0, totalQty - shipped)
            const percent = totalQty > 0 ? Math.round((shipped / totalQty) * 100) : 0

            return (
              <div key={line.line_id} className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[var(--accent)]">
                      #{line.line_no}
                    </span>
                    <span className="font-bold text-slate-800 text-[13px]">
                      {line.products?.product_name || line.products?.product_code}
                    </span>
                    {line.products?.product_code && (
                      <span className="text-xs font-mono text-slate-500">
                        ({line.products.product_code})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-700">
                      進捗: {percent}%
                    </span>
                    <span className={`badge ${line.line_status === 'SHIPPED' ? 'badge--success' : (line.line_status === 'PARTIALLY_SHIPPED' ? 'badge--warning' : 'badge--neutral')} text-[10px] font-bold`}>
                      {line.line_status === 'SHIPPED' ? '全数出荷済' : (line.line_status === 'PARTIALLY_SHIPPED' ? '一部出荷済' : '未出荷')}
                    </span>
                  </div>
                </div>

                {/* Mini Progress Bar */}
                <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                  <div 
                    style={{ 
                      width: `${percent}%`, 
                      height: '100%', 
                      background: percent >= 100 ? 'var(--status-success)' : 'var(--accent)',
                      transition: 'width 0.4s ease'
                    }} 
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                  <span>注文総数: <strong className="text-slate-900">{totalQty.toLocaleString()}</strong> {line.unit}</span>
                  <span>出荷済: <strong className="text-blue-700">{shipped.toLocaleString()}</strong> {line.unit}</span>
                  <span>未出荷残数: <strong className="text-emerald-700">{remaining.toLocaleString()}</strong> {line.unit}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Notes */}
      <div className="card-flat" style={{ padding: 14 }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
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
  )
}
