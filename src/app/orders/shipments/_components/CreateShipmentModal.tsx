'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  X, Truck, Calendar, Building2, Package, CheckCircle2,
  AlertCircle, ArrowRight, Save, MapPin
} from 'lucide-react'

interface CreateShipmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newShipmentId?: string) => void
}

interface OrderOption {
  order_id: string
  order_no: string
  order_date: string
  order_status: string
  company_id: string
  companies?: { company_name: string; company_code: string } | null
  order_lines?: OrderLineOption[]
}

interface OrderLineOption {
  line_id: string
  line_no: number
  product_id: string
  quantity: number
  unit?: string | null
  line_status?: string | null
  delivery_site_id?: string | null
  box_type?: string | null
  packing_style?: string | null
  products?: { product_code: string; product_name: string } | null
}

interface DeliverySiteOption {
  site_id: string
  company_id: string
  site_code: string
  site_name: string
  site_address?: string | null
}

export function CreateShipmentModal({ isOpen, onClose, onSuccess }: CreateShipmentModalProps) {
  const t = useTranslations('Shipments')
  const supabase = createClient()

  const [orders, setOrders] = useState<OrderOption[]>([])
  const [deliverySites, setDeliverySites] = useState<DeliverySiteOption[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [selectedLineIds, setSelectedLineIds] = useState<Set<string>>(new Set())

  // Shipment Header Form
  const [deliveryNoteNo, setDeliveryNoteNo] = useState('')
  const [shipDate, setShipDate] = useState(new Date().toISOString().slice(0, 10))
  const [deliverySiteId, setDeliverySiteId] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState<'TRUCK' | 'COURIER' | 'SELF_PICKUP'>('TRUCK')
  const [trackingNo, setTrackingNo] = useState('')
  const [shipmentType, setShipmentType] = useState('MASS_PRODUCTION')
  const [notes, setNotes] = useState('')

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-generate Delivery Note No (DN-YYMM-XXX)
  useEffect(() => {
    if (isOpen) {
      const now = new Date()
      const yymm = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}`
      const seq = Math.floor(100 + Math.random() * 900)
      setDeliveryNoteNo(`DN-${yymm}-${seq}`)
    }
  }, [isOpen])

  // Load Open Orders and Delivery Sites
  useEffect(() => {
    if (!isOpen) return
    async function loadData() {
      setLoading(true)
      try {
        // 1. Fetch Orders with Lines
        const { data: oData, error: oErr } = await supabase
          .from('orders')
          .select(`
            order_id, order_no, order_date, order_status, company_id,
            companies:companies!orders_company_id_fkey ( company_name, company_code ),
            order_lines (
              line_id, line_no, product_id, quantity, unit, line_status, delivery_site_id,
              box_type, packing_style,
              products:products!order_lines_product_id_fkey ( product_code, product_name )
            )
          `)
          .order('order_date', { ascending: false })

        if (oErr) throw oErr
        if (oData) setOrders(oData as any)

        // 2. Fetch Delivery Sites
        const { data: sData } = await supabase
          .from('delivery_sites')
          .select('site_id, company_id, site_code, site_name, site_address')
          .order('site_name', { ascending: true })

        if (sData) setDeliverySites(sData)
      } catch (err: any) {
        console.error('Error loading orders for shipment modal:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [isOpen])

  // Current Selected Order
  const currentOrder = useMemo(() => {
    return orders.find((o) => o.order_id === selectedOrderId)
  }, [orders, selectedOrderId])

  // Filter Delivery Sites for Current Order's Customer
  const filteredSites = useMemo(() => {
    if (!currentOrder?.company_id) return deliverySites
    return deliverySites.filter((s) => s.company_id === currentOrder.company_id)
  }, [deliverySites, currentOrder])

  // When order changes, select all undelivered lines by default
  useEffect(() => {
    if (currentOrder?.order_lines) {
      const undelivered = currentOrder.order_lines
        .filter((l) => l.line_status !== 'DELIVERED')
        .map((l) => l.line_id)

      setSelectedLineIds(new Set(undelivered))

      // Auto set delivery site from first line if available
      const firstSite = currentOrder.order_lines.find((l) => l.delivery_site_id)?.delivery_site_id
      if (firstSite) setDeliverySiteId(firstSite)
    } else {
      setSelectedLineIds(new Set())
    }
  }, [currentOrder])

  const toggleLine = (lineId: string) => {
    setSelectedLineIds((prev) => {
      const next = new Set(prev)
      if (next.has(lineId)) next.delete(lineId)
      else next.add(lineId)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrderId) {
      setError('受注を選択してください (Vui lòng chọn đơn hàng)')
      return
    }
    if (selectedLineIds.size === 0) {
      setError('出荷対象の明細行を少なくとも1つ選択してください (Vui lòng chọn ít nhất 1 dòng sản phẩm để xuất)')
      return
    }

    setSubmitting(true)
    setError(null)

    let createdShipmentId: string | null = null

    try {
      // Step a: Insert into shipments
      const { data: sData, error: sErr } = await supabase
        .from('shipments')
        .insert({
          delivery_note_no: deliveryNoteNo,
          order_id: selectedOrderId,
          delivery_site_id: deliverySiteId || null,
          ship_date: shipDate,
          status: 'SHIPPED',
          delivery_method: deliveryMethod,
          tracking_no: trackingNo || null,
          shipment_type: shipmentType,
          notes: notes || null,
        })
        .select('shipment_id')
        .single()

      if (sErr) throw sErr
      createdShipmentId = sData.shipment_id

      // Step b: Update selected order_lines to DELIVERED
      const lineIdsArray = Array.from(selectedLineIds)
      const { error: lErr } = await supabase
        .from('order_lines')
        .update({
          line_status: 'DELIVERED',
          ship_date: shipDate,
          delivery_site_id: deliverySiteId || null,
        })
        .in('line_id', lineIdsArray)

      if (lErr) throw lErr

      // Step c: Check if all order_lines are now DELIVERED
      const allLines = currentOrder?.order_lines || []
      const remainingUndelivered = allLines.filter(
        (l) => !selectedLineIds.has(l.line_id) && l.line_status !== 'DELIVERED'
      )

      if (remainingUndelivered.length === 0) {
        // Complete the order!
        await supabase
          .from('orders')
          .update({ order_status: 'COMPLETED' })
          .eq('order_id', selectedOrderId)
      }

      onSuccess(createdShipmentId)
      onClose()
    } catch (err: any) {
      console.error('Error creating shipment:', err)
      setError(err?.message || '出荷登録中にエラーが発生しました')

      // Rollback shipment if lines update failed
      if (createdShipmentId) {
        await supabase.from('shipments').delete().eq('shipment_id', createdShipmentId)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      padding: 16,
    }}>
      <div style={{
        background: 'var(--bg-surface, #ffffff)', borderRadius: 8,
        maxWidth: 820, width: '100%', maxHeight: '90vh', overflowY: 'auto',
        border: '1px solid var(--border-default, #e2e8f0)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 18px', borderBottom: '1px solid var(--border-default, #e2e8f0)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-surface-2, #f8fafc)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Truck size={18} style={{ color: 'var(--accent, #0D9488)' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
              {t('createShipment')} (新規出荷・納品登録)
            </span>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && (
            <div style={{ padding: '8px 12px', background: '#FEE2E2', color: '#DC2626', borderRadius: 4, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Step 1: Select Order */}
          <div className="card-flat" style={{ padding: 14, background: 'var(--bg-surface-2, #f8fafc)' }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 6 }}>
              1. {t('selectOrder')} (Select Order to Ship) *
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="form-input"
              required
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              <option value="">-- {t('selectOrder')} --</option>
              {orders.map((o) => (
                <option key={o.order_id} value={o.order_id}>
                  [{o.order_no}] {o.companies?.company_name || '得意先'} (受注日: {o.order_date} | {o.order_status})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Order Lines to Deliver */}
          {currentOrder && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>2. {t('selectOrderLines')}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  選択中: {selectedLineIds.size} / {currentOrder.order_lines?.length || 0} 行
                </span>
              </div>

              <div style={{ border: '1px solid var(--border-default)', borderRadius: 6, overflow: 'hidden' }}>
                <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 40, textAlign: 'center' }}>選択</th>
                      <th style={{ width: 45, textAlign: 'center' }}>No</th>
                      <th style={{ width: 130 }}>製品コード</th>
                      <th>品名・仕様</th>
                      <th style={{ width: 90, textAlign: 'right' }}>受注数量</th>
                      <th style={{ width: 100, textAlign: 'center' }}>現状ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrder.order_lines?.map((line, idx) => {
                      const isDelivered = line.line_status === 'DELIVERED'
                      const isSelected = selectedLineIds.has(line.line_id)

                      return (
                        <tr
                          key={line.line_id}
                          onClick={() => !isDelivered && toggleLine(line.line_id)}
                          style={{
                            cursor: isDelivered ? 'not-allowed' : 'pointer',
                            background: isSelected ? 'var(--tint-teal-bg, #f0fdfa)' : isDelivered ? '#f8fafc' : 'transparent',
                            opacity: isDelivered ? 0.6 : 1,
                          }}
                        >
                          <td style={{ textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isDelivered}
                              onChange={() => toggleLine(line.line_id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td style={{ textAlign: 'center', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                            {line.line_no || idx + 1}
                          </td>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent, #0D9488)' }}>
                            {line.products?.product_code || '—'}
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{line.products?.product_name || 'トレイ製品'}</span>
                            {line.box_type && <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 6 }}>({line.box_type})</span>}
                          </td>
                          <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 700 }}>
                            {Number(line.quantity).toLocaleString()} {line.unit || '枚'}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {isDelivered ? (
                              <span className="badge badge--success" style={{ fontSize: 9 }}>✓ 出荷済</span>
                            ) : (
                              <span className="badge badge--neutral" style={{ fontSize: 9 }}>{line.line_status || '未出荷'}</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 3: Shipment Header Details */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              3. 出荷伝票情報・配送先 (Delivery Note & Dispatch Details)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {/* Delivery Note No */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
                  {t('deliveryNoteNo')} *
                </label>
                <input
                  type="text"
                  value={deliveryNoteNo}
                  onChange={(e) => setDeliveryNoteNo(e.target.value)}
                  className="form-input"
                  required
                  style={{ fontFamily: 'monospace', fontWeight: 700 }}
                />
              </div>

              {/* Ship Date */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
                  {t('shipDate')} *
                </label>
                <input
                  type="date"
                  value={shipDate}
                  onChange={(e) => setShipDate(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {/* Delivery Site */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
                  {t('deliverySite')}
                </label>
                <select
                  value={deliverySiteId}
                  onChange={(e) => setDeliverySiteId(e.target.value)}
                  className="form-input"
                >
                  <option value="">-- 指定なし (自社引き取り等) --</option>
                  {filteredSites.map((s) => (
                    <option key={s.site_id} value={s.site_id}>
                      [{s.site_code}] {s.site_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Method */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
                  {t('deliveryMethod')}
                </label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value as any)}
                  className="form-input"
                >
                  <option value="TRUCK">自社トラック便 (YSD Truck)</option>
                  <option value="COURIER">路線便 / 宅配 (Courier)</option>
                  <option value="SELF_PICKUP">客先引取 (Direct Pick-up)</option>
                </select>
              </div>

              {/* Tracking No */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
                  {t('trackingNo')}
                </label>
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  className="form-input"
                  placeholder="例: 群馬500 あ 12-34 / 伝票番号"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 3 }}>
              備考・注意事項 (Notes)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
              rows={2}
              placeholder="荷下ろし指定時間、フォークリフト要否など..."
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 6, borderTop: '1px solid var(--border-default)' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={submitting}
              style={{ fontSize: 12, padding: '6px 16px' }}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ fontSize: 12, padding: '6px 18px', gap: 5 }}
            >
              <Save size={13} />
              <span>{submitting ? '出荷登録中...' : '出荷・納品を確定'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
