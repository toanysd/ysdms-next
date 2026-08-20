'use client'

import { useState, useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  FileText, Plus, ExternalLink, Truck, DollarSign,
  ShoppingBag, Package, CheckCircle2, Clock, AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface TabOrdersProps {
  productId: string
}

interface OrderLineItem {
  line_id: string
  order_id: string
  quantity: number
  unit: string
  line_status: string
  created_at: string
  orders: {
    order_id: string
    order_no: string
    order_date: string
    order_status: string
    companies: {
      company_name: string
      company_code: string
    } | null
  } | null
}

const STATUS_BADGE: Record<string, string> = {
  NEW: 'badge badge--info font-bold',
  CONFIRMED: 'badge badge--warning font-bold',
  IN_PRODUCTION: 'badge badge--info font-bold',
  SHIPPED: 'badge badge--success font-bold',
  CANCELLED: 'badge badge--error font-bold',
}

export function TabOrders({ productId }: TabOrdersProps) {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()

  const [orderLines, setOrderLines] = useState<OrderLineItem[]>([])
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('order_lines')
          .select(`
            line_id, order_id, quantity, unit, line_status, created_at,
            orders(order_id, order_no, order_date, order_status, companies:companies!orders_company_id_fkey(company_name, company_code))
          `)
          .eq('product_id', productId)
          .order('created_at', { ascending: false })

        if (error) throw error
        if (data) {
          const list = data as unknown as OrderLineItem[]
          setOrderLines(list)
          if (list.length > 0) setSelectedLineId(list[0].line_id)
        }
      } catch (err) {
        console.error('Error fetching order lines for TabOrders:', err)
      } finally {
        setLoading(false)
      }
    }
    if (productId) fetchOrders()
  }, [productId])

  // Aggregate KPI Calculations
  const { totalOrderedQty, totalShippedQty, backlogQty, activeOrdersCount } = useMemo(() => {
    let totalOrdered = 0
    let totalShipped = 0
    const activeOrderIds = new Set<string>()

    orderLines.forEach((line) => {
      const order = Array.isArray(line.orders) ? line.orders[0] : line.orders
      const qty = Number(line.quantity) || 0
      totalOrdered += qty

      const isShipped = order?.order_status === 'SHIPPED' || line.line_status === 'SHIPPED'
      if (isShipped) {
        totalShipped += qty
      }

      if (order && ['NEW', 'CONFIRMED', 'IN_PRODUCTION'].includes(order.order_status)) {
        activeOrderIds.add(order.order_id)
      }
    })

    const backlog = Math.max(0, totalOrdered - totalShipped)

    return {
      totalOrderedQty: totalOrdered,
      totalShippedQty: totalShipped,
      backlogQty: backlog,
      activeOrdersCount: activeOrderIds.size,
    }
  }, [orderLines])

  const selectedLine = orderLines.find((l) => l.line_id === selectedLineId)
  const selectedOrder = selectedLine?.orders
    ? Array.isArray(selectedLine.orders)
      ? selectedLine.orders[0]
      : selectedLine.orders
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── 1. Top 4 KPI Summary Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 10,
      }}>
        {/* Card 1: Total Ordered Qty */}
        <div className="card-flat" style={{ padding: '12px 14px', borderLeft: '4px solid var(--accent, #0D9488)', background: 'var(--tint-teal-bg, #f0fdfa)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
              {t('kpiTotalOrders')} (Tổng Đặt)
            </span>
            <Package size={15} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
            {loading ? '...' : `${totalOrderedQty.toLocaleString()} pcs`}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            全 {orderLines.length} 受注行 (Total lines)
          </div>
        </div>

        {/* Card 2: Total Shipped Qty */}
        <div className="card-flat" style={{ padding: '12px 14px', borderLeft: '4px solid #059669', background: '#ECFDF5' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
              {t('kpiDelivered')} (Đã Xuất)
            </span>
            <CheckCircle2 size={15} style={{ color: '#059669' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: '#059669' }}>
            {loading ? '...' : `${totalShippedQty.toLocaleString()} pcs`}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            出荷完了済 (Delivered)
          </div>
        </div>

        {/* Card 3: Backlog Qty */}
        <div className="card-flat" style={{ padding: '12px 14px', borderLeft: '4px solid #D97706', background: '#FFFBEB' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
              {t('kpiBacklogOrders')} (Tồn Đọng)
            </span>
            <Clock size={15} style={{ color: '#D97706' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: backlogQty > 0 ? '#D97706' : 'var(--text-primary)' }}>
            {loading ? '...' : `${backlogQty.toLocaleString()} pcs`}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            {backlogQty > 0 ? '⚠️ 未出荷残あり (Pending)' : '✓ 残なし (All shipped)'}
          </div>
        </div>

        {/* Card 4: Active Open Orders */}
        <div className="card-flat" style={{ padding: '12px 14px', borderLeft: '4px solid var(--tint-purple-text, #8B5CF6)', background: 'var(--tint-purple-bg, #faf5ff)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>
              {t('kpiOpenOrdersCount')} (Đang Mở)
            </span>
            <ShoppingBag size={15} style={{ color: 'var(--tint-purple-text)' }} />
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: 'var(--tint-purple-text)' }}>
            {loading ? '...' : `${activeOrdersCount} 件 (Orders)`}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            製作・手配進行中
          </div>
        </div>
      </div>

      {/* ── 2. Action Bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShoppingBag size={16} style={{ color: 'var(--tint-purple-text)' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            {t('orderHistoryAndShipments', { count: orderLines.length })}
          </span>
        </div>
        <Link
          href={`/orders?product_id=${productId}`}
          className="btn btn-primary"
          style={{ height: 28, padding: '0 12px', fontSize: 11, gap: 4, textDecoration: 'none' }}
        >
          <Plus size={12} />
          <span>{t('newOrder')}</span>
        </Link>
      </div>

      {/* ── 3. Main Data Content ── */}
      {orderLines.length === 0 ? (
        <div className="card-flat" style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          {t('noOrdersForProduct')}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 34%) minmax(280px, 42%) 1fr', gap: 12 }}>

          {/* Left Column: Order Lines List */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-purple-border)' }}>
            <div style={{
              background: 'var(--tint-purple-bg)', borderBottom: '1px solid var(--tint-purple-border)',
              padding: '10px 12px', fontSize: 12, fontWeight: 700, color: 'var(--tint-purple-text)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span>{t('orderListTitle')}</span>
              <span style={{ fontSize: 10, background: 'var(--bg-surface)', padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>
                {orderLines.length}
              </span>
            </div>

            <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {orderLines.map((line) => {
                const order = Array.isArray(line.orders) ? line.orders[0] : line.orders
                const isSelected = line.line_id === selectedLineId
                return (
                  <div
                    key={line.line_id}
                    onClick={() => setSelectedLineId(line.line_id)}
                    style={{
                      padding: '8px 10px', cursor: 'pointer', borderRadius: 6,
                      background: isSelected ? 'color-mix(in srgb, var(--accent) 10%, transparent)' : 'var(--bg-surface-2)',
                      border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border-default)',
                      transition: 'all 0.1s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 13, color: 'var(--accent)' }}>
                        {order?.order_no || '—'}
                      </span>
                      <span className={STATUS_BADGE[order?.order_status || ''] || 'badge badge--neutral'} style={{ fontSize: 9 }}>
                        {order?.order_status || '—'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                      <span style={{ color: 'var(--text-muted)' }}>{order?.order_date || '—'}</span>
                      <span style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)', fontSize: 13 }}>
                        {line.quantity?.toLocaleString()} {line.unit || 'pcs'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Middle Column: Selected Order Detail */}
          <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-blue-border)' }}>
            <div style={{
              background: 'var(--tint-blue-bg)', borderBottom: '1px solid var(--tint-blue-border)',
              padding: '10px 12px', fontSize: 12, fontWeight: 700, color: 'var(--tint-blue-text)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span>{t('selectedOrderDetailTitle')}</span>
              {selectedOrder && (
                <Link href={`/orders/${selectedOrder.order_id}`} style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                  {t('openOrderDetail')} <ExternalLink size={11} />
                </Link>
              )}
            </div>

            <div style={{ padding: 14 }}>
              {selectedOrder ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-2)', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border-default)' }}>
                    <span style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: 15, color: 'var(--accent)' }}>
                      {selectedOrder.order_no}
                    </span>
                    <span className={STATUS_BADGE[selectedOrder.order_status] || 'badge badge--neutral'} style={{ fontSize: 10 }}>
                      {selectedOrder.order_status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: 6 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, minWidth: 90 }}>{t('customerLabel')}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {selectedOrder.companies?.company_code} — {selectedOrder.companies?.company_name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: 6 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, minWidth: 90 }}>{t('orderDateLabel')}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedOrder.order_date || '—'}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', borderBottom: '1px dashed var(--border-subtle)', paddingBottom: 6 }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, minWidth: 90 }}>{t('orderQuantityLabel')}</span>
                    <span style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)', fontSize: 15 }}>
                      {selectedLine?.quantity?.toLocaleString()} {selectedLine?.unit || 'pcs'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, minWidth: 90 }}>{t('lineStatusLabel')}</span>
                    <span className="badge badge--info" style={{ fontSize: 10 }}>
                      {selectedLine?.line_status || 'CONFIRMED'}
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                  {t('selectOrderPrompt')}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Quotation Card & Shipments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Quotation Status Card */}
            <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-purple-border)' }}>
              <div style={{
                background: 'var(--tint-purple-bg)', borderBottom: '1px solid var(--tint-purple-border)',
                padding: '10px 12px', fontSize: 12, fontWeight: 700, color: 'var(--tint-purple-text)',
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                <DollarSign size={14} style={{ color: 'var(--tint-purple-text)' }} /> {t('quotationInfoTitle')}
              </div>
              <div style={{ padding: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div>{t('relatedQuotation')} <span style={{ color: 'var(--text-muted)' }}>{t('notLinked')}</span></div>
                <div style={{ marginTop: 8 }}>
                  <Link href="/orders/quotations" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>
                    {t('createQuotationLink')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Shipment History */}
            <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-green-border)' }}>
              <div style={{
                background: 'var(--tint-green-bg)', borderBottom: '1px solid var(--tint-green-border)',
                padding: '10px 12px', fontSize: 12, fontWeight: 700, color: 'var(--tint-green-text)',
                display: 'flex', alignItems: 'center', gap: 6
              }}>
                <Truck size={14} style={{ color: 'var(--tint-green-text)' }} /> {t('shipmentHistoryTitle')}
              </div>
              <div style={{ padding: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                {t('noShipments')}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}