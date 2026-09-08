import React from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Truck, Plus, PackageCheck, Clock, Calendar, CheckCircle2, FileText, Search, ArrowUpRight } from 'lucide-react'
import { Pagination } from '@/components/ui/Pagination'

export const dynamic = 'force-dynamic'

interface ShipmentsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const PAGE_SIZE = 50

export default async function ShipmentsPage({ searchParams }: ShipmentsPageProps) {
  const resolvedParams = await searchParams
  const t = await getTranslations('Shipment')
  const supabase = createServerSupabaseClient()

  // Filter params
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search.trim() : ''
  const woId = typeof resolvedParams.wo_id === 'string' ? resolvedParams.wo_id.trim() : ''
  const orderId = typeof resolvedParams.order_id === 'string' ? resolvedParams.order_id.trim() : ''
  const status = typeof resolvedParams.status === 'string' ? resolvedParams.status.trim() : ''
  const dateFrom = typeof resolvedParams.date_from === 'string' ? resolvedParams.date_from.trim() : ''
  const dateTo = typeof resolvedParams.date_to === 'string' ? resolvedParams.date_to.trim() : ''
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) || 1 : 1

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  // Query shipments with related work_orders and orders
  let query = supabase
    .from('shipments')
    .select(`
      shipment_id,
      delivery_note_no,
      ship_date,
      shipped_quantity,
      delivery_method,
      status,
      notes,
      created_at,
      work_order_id,
      order_id,
      work_orders (
        wo_id,
        wo_code,
        wo_name
      ),
      orders (
        order_id,
        order_no,
        companies (
          company_name
        )
      )
    `, { count: 'exact' })
    .order('ship_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (woId) query = query.eq('work_order_id', woId)
  if (orderId) query = query.eq('order_id', orderId)
  if (status) query = query.eq('status', status)
  if (dateFrom) query = query.gte('ship_date', dateFrom)
  if (dateTo) query = query.lte('ship_date', dateTo)
  if (search) {
    query = query.or(`delivery_note_no.ilike.%${search}%,notes.ilike.%${search}%,tracking_no.ilike.%${search}%`)
  }

  const { data: shipments, count: totalCount, error } = await query.range(from, to)

  if (error) {
    console.error('[ShipmentsPage] Query error:', error)
  }

  // KPIs
  const allShipments = shipments || []
  const totalShippedQty = allShipments.reduce((acc, s) => acc + (Number(s.shipped_quantity) || 0), 0)
  const todayStr = new Date().toISOString().slice(0, 10)
  const todayCount = allShipments.filter(s => s.ship_date === todayStr).length
  const woDirectCount = allShipments.filter(s => !!s.work_order_id).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      
      {/* ── 1. Page Header ── */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexShrink: 0,
          padding: '12px 16px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 8,
          border: '1px solid var(--border-default)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div 
            style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 8, 
              backgroundColor: 'var(--tint-teal-bg, #F0FDFA)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--accent)'
            }}
          >
            <Truck size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              出荷・納品管理
            </h1>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Quản lý Xuất hàng & Phiếu giao hàng 納品書 (Milestone 21)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link 
            href="/production/work-orders"
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, padding: '7px 14px' }}
          >
            <PackageCheck size={15} />
            <span>指示書一覧 (Work Orders)</span>
          </Link>
        </div>
      </div>

      {/* ── 2. KPI Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, flexShrink: 0 }}>
        {/* Total Shipments */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>累計出荷件数</span>
            <Truck size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {(totalCount || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>件</span>
          </div>
        </div>

        {/* Total Shipped Qty */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>累計出荷数量</span>
            <PackageCheck size={16} style={{ color: '#0EA5E9' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {totalShippedQty.toLocaleString()}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>pcs</span>
          </div>
        </div>

        {/* Today Shipments */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>本日出荷</span>
            <Calendar size={16} style={{ color: '#10B981' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {todayCount}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>件</span>
          </div>
        </div>

        {/* WO Direct Shipments */}
        <div className="card-flat" style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>WO直接出荷</span>
            <CheckCircle2 size={16} style={{ color: '#8B5CF6' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {woDirectCount}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>件</span>
          </div>
        </div>
      </div>

      {/* ── 3. Filter Bar ── */}
      <div 
        className="card-flat" 
        style={{ 
          padding: '10px 14px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: 12,
          flexShrink: 0 
        }}
      >
        <form method="GET" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
          {/* Search text */}
          <div style={{ position: 'relative', minWidth: 200, flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="納品書番号・メモ検索..."
              className="form-input"
              style={{ paddingLeft: 30, width: '100%' }}
            />
          </div>

          {/* Date from */}
          <input
            type="date"
            name="date_from"
            defaultValue={dateFrom}
            className="form-input"
            style={{ width: 140 }}
            title="出荷日 (開始)"
          />

          {/* Date to */}
          <input
            type="date"
            name="date_to"
            defaultValue={dateTo}
            className="form-input"
            style={{ width: 140 }}
            title="出荷日 (終了)"
          />

          {/* Status */}
          <select name="status" defaultValue={status} className="form-input" style={{ width: 130 }}>
            <option value="">すべての状態</option>
            <option value="SHIPPED">出荷済 (SHIPPED)</option>
            <option value="DELIVERED">納品完了 (DELIVERED)</option>
          </select>

          <button type="submit" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }}>
            絞り込み
          </button>

          {(search || dateFrom || dateTo || status || woId || orderId) && (
            <Link href="/shipments" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }}>
              リセット
            </Link>
          )}
        </form>
      </div>

      {/* ── 4. Shipments Data Table ── */}
      <div className="card-flat" style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {allShipments.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            <Truck size={40} style={{ margin: '0 auto 10px', opacity: 0.35 }} />
            <p style={{ fontWeight: 600 }}>出荷データが見つかりません</p>
            <span style={{ fontSize: 12 }}>Work Order の「出荷」タブから直接出荷を登録できます。</span>
          </div>
        ) : (
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '180px' }}>納品書番号 (Số phiếu)</th>
                <th style={{ width: '110px' }}>出荷日 (Ngày xuất)</th>
                <th style={{ width: '220px' }}>関連指示書・受注 (Liên kết)</th>
                <th style={{ width: '130px', textAlign: 'right' }}>出荷数 (Số lượng)</th>
                <th style={{ width: '140px' }}>納品方法 (Phương thức)</th>
                <th style={{ width: '100px' }}>状態 (Status)</th>
                <th>備考 (Ghi chú)</th>
                <th style={{ width: '130px', textAlign: 'center' }}>納品書PDF</th>
              </tr>
            </thead>
            <tbody>
              {allShipments.map((s) => {
                const wo = s.work_orders as any
                const ord = s.orders as any

                return (
                  <tr key={s.shipment_id}>
                    {/* Delivery Note No */}
                    <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)', fontSize: 13 }}>
                      {s.delivery_note_no || '—'}
                    </td>

                    {/* Ship Date */}
                    <td style={{ fontFamily: 'monospace', fontSize: 13 }}>
                      {s.ship_date}
                    </td>

                    {/* Links */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {wo && (
                          <Link 
                            href={`/production/work-orders/${wo.wo_id}?tab=shipments`}
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 4, 
                              fontSize: 12, 
                              fontWeight: 600,
                              color: 'var(--accent)',
                              textDecoration: 'none'
                            }}
                          >
                            <span className="badge badge--neutral" style={{ fontFamily: 'monospace', fontSize: 11 }}>
                              WO: {wo.wo_code}
                            </span>
                            <ArrowUpRight size={12} />
                          </Link>
                        )}
                        {ord && (
                          <Link 
                            href={`/orders/${ord.order_id}`}
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: 4, 
                              fontSize: 12, 
                              fontWeight: 600,
                              color: '#0EA5E9',
                              textDecoration: 'none'
                            }}
                          >
                            <span className="badge badge--neutral" style={{ fontFamily: 'monospace', fontSize: 11 }}>
                              ORD: {ord.order_no}
                            </span>
                            {ord.companies?.company_name && (
                              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                                ({ord.companies.company_name})
                              </span>
                            )}
                          </Link>
                        )}
                        {!wo && !ord && <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </div>
                    </td>

                    {/* Shipped Quantity */}
                    <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', fontSize: 14 }}>
                      {(Number(s.shipped_quantity) || 0).toLocaleString()} <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>pcs</span>
                    </td>

                    {/* Delivery Method */}
                    <td style={{ fontSize: 13 }}>
                      {s.delivery_method || '—'}
                    </td>

                    {/* Status */}
                    <td>
                      <span className="badge badge--success" style={{ fontSize: 11, padding: '2px 8px' }}>
                        {s.status === 'SHIPPED' ? '出荷済' : (s.status || '出荷済')}
                      </span>
                    </td>

                    {/* Notes */}
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      {s.notes || '—'}
                    </td>

                    {/* PDF Action */}
                    <td style={{ textAlign: 'center' }}>
                      <a
                        href={`/api/shipments/${s.shipment_id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          padding: '3px 8px',
                          textDecoration: 'none',
                        }}
                        title="納品書PDFを表示・印刷"
                      >
                        <FileText size={12} />
                        <span>納品書PDF</span>
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalCount != null && totalCount > PAGE_SIZE && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-default)', marginTop: 'auto' }}>
            <Pagination
              currentPage={page}
              pageSize={PAGE_SIZE}
              totalRecords={totalCount}
              baseUrl="/shipments"
            />
          </div>
        )}
      </div>

    </div>
  )
}
