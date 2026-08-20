'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import {
  Truck, Plus, Search, Download, ExternalLink, RefreshCw,
  Building2, MapPin, CheckCircle2, Clock, Calendar, Package
} from 'lucide-react'
import Link from 'next/link'
import { CreateShipmentModal } from './_components/CreateShipmentModal'

interface ShipmentItem {
  shipment_id: string
  delivery_note_no: string
  ship_date: string
  status: string
  delivery_method?: string | null
  tracking_no?: string | null
  shipment_type?: string | null
  notes?: string | null
  orders?: {
    order_id: string
    order_no: string
    companies?: {
      company_name: string
      company_code: string
    } | null
  } | null
  delivery_sites?: {
    site_id: string
    site_name: string
    site_address?: string | null
  } | null
  employees?: {
    employee_name: string
  } | null
}

const STATUS_BADGE: Record<string, { labelJA: string; badgeClass: string; bg: string; color: string }> = {
  PREPARING: { labelJA: '準備中 (Preparing)', badgeClass: 'badge badge--neutral', bg: '#F1F5F9', color: '#475569' },
  SHIPPED: { labelJA: '出荷済 (Shipped)', badgeClass: 'badge badge--info', bg: '#EFF6FF', color: '#2563EB' },
  DELIVERED: { labelJA: '納品受領済 (Delivered)', badgeClass: 'badge badge--success', bg: '#ECFDF5', color: '#059669' },
  CANCELLED: { labelJA: 'キャンセル', badgeClass: 'badge badge--error', bg: '#FEF2F2', color: '#DC2626' },
}

export default function ShipmentsPage() {
  const t = useTranslations('Shipments')
  const supabase = createClient()

  const [shipments, setShipments] = useState<ShipmentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const fetchShipments = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select(`
          shipment_id, delivery_note_no, ship_date, status,
          delivery_method, tracking_no, shipment_type, notes,
          orders:orders!shipments_order_id_fkey (
            order_id, order_no,
            companies:companies!orders_company_id_fkey ( company_name, company_code )
          ),
          delivery_sites:delivery_sites!shipments_delivery_site_id_fkey ( site_id, site_name, site_address ),
          employees:employees!shipments_shipped_by_fkey ( employee_name )
        `)
        .order('ship_date', { ascending: false })

      if (error) throw error
      if (data) setShipments(data as any)
    } catch (err: any) {
      console.error('Error fetching shipments:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchShipments()
  }, [fetchShipments])

  // Filtered List
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const matchSearch =
        searchQuery === '' ||
        (s.delivery_note_no || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.orders?.order_no || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.orders?.companies?.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.delivery_sites?.site_name || '').toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter

      return matchSearch && matchStatus
    })
  }, [shipments, searchQuery, statusFilter])

  // Summary Metrics
  const { totalShipmentsCount, preparingCount, deliveredCount } = useMemo(() => {
    let prep = 0
    let deliv = 0

    shipments.forEach((s) => {
      if (s.status === 'PREPARING') prep++
      if (s.status === 'DELIVERED' || s.status === 'SHIPPED') deliv++
    })

    return {
      totalShipmentsCount: shipments.length,
      preparingCount: prep,
      deliveredCount: deliv,
    }
  }, [shipments])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>

      {/* ── 1. Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Truck size={22} style={{ color: 'var(--accent, #0D9488)' }} />
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {t('title')} (Shipment & Delivery Management)
            </h1>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              出荷実績記録・納品書/受領書PDF発行・受注残数(Backlog)自動連動
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary"
            style={{ height: 32, padding: '0 14px', fontSize: 12, gap: 5 }}
          >
            <Plus size={14} />
            <span>{t('newShipment')}</span>
          </button>
          <button
            onClick={fetchShipments}
            className="btn btn-secondary"
            style={{ height: 32, width: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="再読込 (Làm mới)"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── 2. Summary KPI Ribbon ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        flexShrink: 0,
      }}>
        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid var(--accent, #0D9488)', background: 'var(--tint-teal-bg, #f0fdfa)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
            📦 {t('totalShipments')} (Tổng Đợt Xuất)
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
            {loading ? '...' : `${totalShipmentsCount} 回`}
          </div>
        </div>

        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid #F59E0B', background: '#FFFBEB' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
            ⏳ {t('preparing')} (Đang Chuẩn Bị)
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: '#D97706' }}>
            {loading ? '...' : `${preparingCount} 回`}
          </div>
        </div>

        <div className="card-flat" style={{ padding: '10px 14px', borderLeft: '4px solid #059669', background: '#ECFDF5' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 2 }}>
            🚚 {t('delivered')} / {t('shipped')} (Đã Xuất / Đã Giao)
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: '#059669' }}>
            {loading ? '...' : `${deliveredCount} 回`}
          </div>
        </div>
      </div>

      {/* ── 3. Filter Bar ── */}
      <div className="card-flat" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="form-input"
            style={{ height: 28, fontSize: 12 }}
          />
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{t('shipmentStatus')}:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
            style={{ height: 28, fontSize: 11 }}
          >
            <option value="ALL">すべて (All Status)</option>
            <option value="PREPARING">準備中 (Preparing)</option>
            <option value="SHIPPED">出荷済 (Shipped)</option>
            <option value="DELIVERED">納品完了 (Delivered)</option>
            <option value="CANCELLED">キャンセル</option>
          </select>
        </div>
      </div>

      {/* ── 4. Main Data Table ── */}
      <div className="card-flat" style={{ flex: 1, overflow: 'auto', padding: 0 }}>
        {loading ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            <RefreshCw size={18} className="animate-spin" style={{ margin: '0 auto 8px' }} />
            出荷データを読込中...
          </div>
        ) : filteredShipments.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            <Truck size={28} style={{ margin: '0 auto 8px', color: 'var(--text-muted)' }} />
            <div>{t('noShipmentsFound')}</div>
          </div>
        ) : (
          <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ width: 140 }}>{t('deliveryNoteNo')}</th>
                <th style={{ width: 120 }}>{t('orderNo')}</th>
                <th>{t('customerName')}</th>
                <th>{t('deliverySite')}</th>
                <th style={{ width: 100 }}>{t('shipDate')}</th>
                <th style={{ width: 130 }}>{t('deliveryMethod')}</th>
                <th style={{ width: 120, textAlign: 'center' }}>{t('shipmentStatus')}</th>
                <th style={{ width: 100, textAlign: 'center' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredShipments.map((s) => {
                const statusConf = STATUS_BADGE[s.status] || STATUS_BADGE.PREPARING
                return (
                  <tr key={s.shipment_id}>
                    {/* Delivery Note No (Link) */}
                    <td>
                      <Link
                        href={`/orders/shipments/${s.shipment_id}`}
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 800,
                          fontSize: 13,
                          color: 'var(--accent, #0D9488)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {s.delivery_note_no || 'DN-未採番'}
                        <ExternalLink size={11} />
                      </Link>
                    </td>

                    {/* Order No */}
                    <td>
                      {s.orders?.order_id ? (
                        <Link
                          href={`/orders/${s.orders.order_id}`}
                          style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}
                        >
                          {s.orders.order_no}
                        </Link>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>

                    {/* Customer */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Building2 size={13} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {s.orders?.companies?.company_name || '得意先未設定'}
                        </span>
                      </div>
                    </td>

                    {/* Delivery Site */}
                    <td>
                      {s.delivery_sites?.site_name ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} style={{ color: 'var(--accent)' }} />
                          <span style={{ fontWeight: 600 }}>{s.delivery_sites.site_name}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>自社引取 / 指定なし</span>
                      )}
                    </td>

                    {/* Ship Date */}
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {s.ship_date}
                    </td>

                    {/* Delivery Method */}
                    <td>
                      <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                        {s.delivery_method === 'TRUCK' ? '自社トラック便' : s.delivery_method === 'COURIER' ? '路線便' : s.delivery_method === 'SELF_PICKUP' ? '客先引取' : s.delivery_method || '—'}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                        background: statusConf.bg, color: statusConf.color,
                      }}>
                        {statusConf.labelJA}
                      </span>
                    </td>

                    {/* Actions: PDF Download */}
                    <td style={{ textAlign: 'center' }}>
                      <a
                        href={`/api/shipments/${s.shipment_id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ height: 24, padding: '0 8px', fontSize: 10, gap: 3, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                        title="納品書・受領書PDF出力"
                      >
                        <Download size={11} />
                        <span>納品書</span>
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Create Shipment Modal ── */}
      <CreateShipmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchShipments()
        }}
      />

    </div>
  )
}
