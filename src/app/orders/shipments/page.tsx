'use client'

import { useTranslations } from 'next-intl'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, X, Truck, Filter, Package, Search, Loader2 } from 'lucide-react'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import { Pagination } from '@/components/ui/Pagination'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchHistory } from '@/hooks/useSearchHistory'
import { SearchSuggestions } from '@/components/ui/SearchSuggestions'

/* ─── Types ──────────────────────────────────────────────────── */
type Shipment = {
  shipment_id: string
  order_id: string | null
  ship_date: string
  delivery_date: string | null
  delivery_note_no: string | null
  shipped_by: string | null
  carrier: string | null
  tracking_no: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string
  orders?: {
    order_no: string
    companies?: { company_name: string } | null
  } | null
}

type ShipmentForm = {
  order_id: string
  ship_date: string
  delivery_date: string
  delivery_note_no: string
  carrier: string
  tracking_no: string
  status: string
  notes: string
}

const STATUS_OPTIONS = [
  { value: 'SHIPPED', labelKey: 'statusShipped', color: 'var(--status-info)' },
  { value: 'IN_TRANSIT', labelKey: 'statusInTransit', color: 'var(--status-warning)' },
  { value: 'DELIVERED', labelKey: 'statusDelivered', color: 'var(--status-success)' },
  { value: 'RETURNED', labelKey: 'statusReturned', color: 'var(--status-error)' },
]

const emptyForm: ShipmentForm = {
  order_id: '',
  ship_date: new Date().toISOString().slice(0, 10),
  delivery_date: '',
  delivery_note_no: '',
  carrier: '',
  tracking_no: '',
  status: 'SHIPPED',
  notes: '',
}

/* ─── Helpers ────────────────────────────────────────────────── */
function fmtDate(d: string | null | undefined): string {
  if (!d) return '-'
  return d.slice(0, 10).replace(/-/g, '/')
}

function getStatusDef(status: string) {
  return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
}

/* ─── Main Page ──────────────────────────────────────────────── */
export default function ShipmentsPage() {
  const t = useTranslations()
  const supabase = createClient()

  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') || ''
  const [searchText, setSearchText] = useState(urlSearch)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory('shipments_search')
  const router = useRouter()
  
  // Pagination
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const PAGE_SIZE = 50

  // Modal (Create Only)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<ShipmentForm>({ ...emptyForm })
  const [saving, setSaving] = useState(false)

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Filter resets page
  useEffect(() => {
    setPage(1)
  }, [dateFrom, dateTo, searchText])

  /* ─── Fetch ─────────────────────────────────────────────────── */
  const fetchShipments = useCallback(async () => {
    setLoading(true)
    let q = supabase
      .from('shipments')
      .select('*, orders(order_no, companies(company_name))', { count: 'exact' })
    
    if (dateFrom) q = q.gte('ship_date', dateFrom)
    if (dateTo) q = q.lte('ship_date', dateTo)
    if (searchText) {
      q = q.or(`delivery_note_no.ilike.%${searchText}%,tracking_no.ilike.%${searchText}%`)
    }

    q = q.order('ship_date', { ascending: false })
         .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

    const { data, count, error } = await q
    if (error) {
      console.error(error)
      setError(error.message)
    } else {
      setShipments((data as any) || [])
      setTotalCount(count || 0)
    }
    setLoading(false)
  }, [dateFrom, dateTo, searchText, page, supabase])

  useEffect(() => {
    fetchShipments()
  }, [fetchShipments])

  /* ─── Modal handlers ────────────────────────────────────────── */
  const openAdd = () => {
    setForm({ ...emptyForm })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload: Record<string, unknown> = {
      ship_date: form.ship_date,
      delivery_date: form.delivery_date || null,
      delivery_note_no: form.delivery_note_no || null,
      carrier: form.carrier || null,
      tracking_no: form.tracking_no || null,
      status: form.status,
      notes: form.notes || null,
      order_id: form.order_id || null,
    }

    const { data, error: err } = await supabase.from('shipments').insert(payload as any).select().single()
    if (err) { alert(`${t('Shipments.registerError')}${err.message}`); setSaving(false); return }
    
    setSaving(false)
    setModalOpen(false)
    router.push(`/orders/shipments/${data.shipment_id}`)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error: err } = await supabase.from('shipments').delete().eq('shipment_id', deleteId)
    if (err) alert(`${t('Shipments.deleteError')}${err.message}`)
    setDeleteId(null)
    fetchShipments()
  }

  /* ─── Render ────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Truck size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {t('Orders.quanLyGiaoHang')}
              </h1>
            </div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={16} />
          {t('Shipments.newShipment')}
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="card-flat" style={{ padding: '12px 16px', flexShrink: 0, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Filter size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
            {t('Orders.loc')}
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: 12, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="form-input" style={{ width: 130 }} />
            <span style={{ color: 'var(--text-muted)' }}>~</span>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="form-input" style={{ width: 130 }} />
          </div>

          <div style={{ flex: 1, maxWidth: 300 }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder={t('Shipments.searchPlaceholder')}
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchText.trim()) {
                      addToHistory(searchText.trim())
                      router.push(`?search=${encodeURIComponent(searchText.trim())}`)
                    }
                  }}
                  className="form-input form-input-search"
                  style={{ paddingLeft: 30 }}
                />
                {showSuggestions && (
                  <SearchSuggestions
                    history={history}
                    onSelect={(v) => {
                      setSearchText(v)
                      addToHistory(v)
                      router.push(`?search=${encodeURIComponent(v)}`)
                    }}
                    onClear={clearHistory}
                    onRemove={removeFromHistory}
                    visible={showSuggestions}
                    onClose={() => setShowSuggestions(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Data Table ────────────────────────────────────────── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            {t('Orders.loading')}
          </div>
        ) : error ? (
          <div style={{ padding: 16, color: 'var(--status-error)', fontSize: 12 }}>
            {t('Common.error')}: {error}
          </div>
        ) : (
          <>
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 120 }}>
                      {t('Orders.soPg')}
                    </th>
                    <th style={{ width: 120 }}>
                      {t('Orders.maH')}
                    </th>
                    <th style={{ width: 180 }}>
                      {t('Orders.khachHang')}
                    </th>
                    <th style={{ width: 100 }}>
                      {t('Orders.ngayXuat')}
                    </th>
                    <th style={{ width: 100 }}>
                      {t('Orders.ngayGiao')}
                    </th>
                    <th style={{ width: 110 }}>
                      {t('Orders.vanChuyen')}
                    </th>
                    <th style={{ width: 120 }}>
                      {t('Orders.tracking')}
                    </th>
                    <th style={{ width: 90, textAlign: 'center' }}>
                      {t('Orders.trangThai')}
                    </th>
                    <th style={{ width: 80, textAlign: 'right' }}>{t('Shipments.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                        {t('Shipments.noData')}
                      </td>
                    </tr>
                  ) : (
                    shipments.map((s: any) => {
                      const st = getStatusDef(s.status)
                      return (
                        <tr key={s.shipment_id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {s.delivery_note_no ? (
                              <Link href={`/orders/shipments/${s.shipment_id}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                                {s.delivery_note_no}
                              </Link>
                            ) : (
                              <Link href={`/orders/shipments/${s.shipment_id}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', fontStyle: 'italic' }}>
                                {t('Shipments.notSet')}
                              </Link>
                            )}
                          </td>
                          <td style={{ fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 600 }}>
                            {s.orders?.order_no || <span style={{ color: 'var(--text-muted)' }}>-</span>}
                          </td>
                          <td style={{ fontWeight: 500 }}>
                            {s.orders?.companies?.company_name || <span style={{ color: 'var(--text-muted)' }}>-</span>}
                          </td>
                          <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                            {fmtDate(s.ship_date)}
                          </td>
                          <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                            {fmtDate(s.delivery_date)}
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>
                            {s.carrier || '-'}
                          </td>
                          <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                            {s.tracking_no || '-'}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: 10,
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: 9999,
                                color: '#fff',
                                background: st.color,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {t(`Shipments.${st.labelKey}`)}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                              <Link
                                href={`/orders/shipments/${s.shipment_id}`}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}
                                title={t('Shipments.details')}
                              >
                                <Edit2 size={14} />
                              </Link>
                              <button
                                onClick={() => setDeleteId(s.shipment_id)}
                                style={{ background: 'none', border: 'none', color: 'var(--status-error)', cursor: 'pointer', padding: 4 }}
                                title={t('Shipments.delete')}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
              <Pagination
                currentPage={page}
                totalRecords={totalCount}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
              />
            </div>
          </>
        )}
      </div>

      {/* ═══════════ ADD/EDIT MODAL ═══════════ */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
          <div className="card" style={{ width: 480, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            <div className="form-section-header" style={{ justifyContent: 'space-between', padding: '12px 16px' }}>
              <div>
                {t('Orders.taoPhieuXuatMoi')}
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>
            
            <div className="custom-scrollbar" style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-field">
                <label className="form-label">{t('Orders.maOnHang')}</label>
                <AsyncSearchableSelect
                  value={form.order_id}
                  onChange={(v) => setForm(f => ({ ...f, order_id: v || '' }))}
                  placeholder={t('Shipments.searchOrderPlaceholder')}
                  fetchOptions={async (q) => {
                    const { data } = await supabase
                      .from('orders')
                      .select('order_id, order_no')
                      .ilike('order_no', `%${q}%`)
                      .limit(20)
                    return (data || []).map((o: any) => ({
                      value: o.order_id,
                      label: o.order_no,
                      sublabel: 'Order'
                    }))
                  }}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">{t('Orders.ngayXuat')}</label>
                  <input type="date" required className="form-input" value={form.ship_date} onChange={e => setForm(f => ({ ...f, ship_date: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label className="form-label">{t('Orders.ngayGiao')}</label>
                  <input type="date" className="form-input" value={form.delivery_date} onChange={e => setForm(f => ({ ...f, delivery_date: e.target.value }))} />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">{t('Orders.soPhieuGiao')}</label>
                <input type="text" className="form-input mono" value={form.delivery_note_no} onChange={e => setForm(f => ({ ...f, delivery_note_no: e.target.value }))} placeholder="DN-2026-001" />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">{t('Orders.hangVanChuyen')}</label>
                  <input type="text" className="form-input" value={form.carrier} onChange={e => setForm(f => ({ ...f, carrier: e.target.value }))} placeholder="ヤマト運輸" />
                </div>
                <div className="form-field">
                  <label className="form-label">{t('Orders.maTracking')}</label>
                  <input type="text" className="form-input mono" value={form.tracking_no} onChange={e => setForm(f => ({ ...f, tracking_no: e.target.value }))} />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">{t('Orders.trangThai')}</label>
                <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{t(`Shipments.${s.labelKey}`)}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">{t('Orders.ghiChu')}</label>
                <textarea className="form-textarea" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
              </div>
            </div>

            <div className="form-actions" style={{ padding: '12px 16px', background: 'var(--bg-surface-2)', marginTop: 0 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>{t('Shipments.cancel')}</button>
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving || !form.ship_date}>
                {saving && <Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />}
                {t('Shipments.register')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ DELETE CONFIRM ═══════════ */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
          <div className="card" style={{ width: 380, padding: 24, textAlign: 'center' }}>
            <Trash2 size={32} style={{ color: 'var(--status-error)', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: 15, marginBottom: 8, fontWeight: 'bold' }}>{t('Orders.confirmDelete')}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
              {t('Orders.deleteQuestion')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
                {t('Orders.cancel')}
              </button>
              <button className="btn" style={{ background: 'var(--status-error)', color: '#fff', border: 'none' }} onClick={handleDelete}>
                {t('Orders.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
