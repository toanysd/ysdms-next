'use client'

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
  { value: 'SHIPPED', labelJa: '出荷済', labelVi: 'Đã xuất', color: 'var(--status-info)' },
  { value: 'IN_TRANSIT', labelJa: '配送中', labelVi: 'Đang giao', color: 'var(--status-warning)' },
  { value: 'DELIVERED', labelJa: '納品完了', labelVi: 'Đã giao', color: 'var(--status-success)' },
  { value: 'RETURNED', labelJa: '返品', labelVi: 'Trả lại', color: 'var(--status-error)' },
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
  const { history, addHistory, clearHistory } = useSearchHistory('shipments_search')
  const router = useRouter()
  
  // Pagination
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
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
    setError(null)
    let q = supabase
      .from('shipments')
      .select('*, orders(order_no, companies(company_name))', { count: 'exact' })
      .order('ship_date', { ascending: false })

    if (dateFrom) q = q.gte('ship_date', dateFrom)
    if (dateTo) q = q.lte('ship_date', dateTo)
    
    // Pagination
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    q = q.range(from, to)

    const { data, error: err, count } = await q
    if (err) setError(err.message)
    else {
      setShipments((data as unknown as Shipment[]) || [])
      setTotalRecords(count || 0)
    }
    setLoading(false)
  }, [dateFrom, dateTo, page])

  useEffect(() => { fetchShipments() }, [fetchShipments])

  /* ─── Filtered list (client side for text search inside the page) ───────────────────────── */
  const filtered = useMemo(() => {
    if (!searchText.trim()) return shipments
    const q = searchText.toLowerCase()
    return shipments.filter(s =>
      (s.delivery_note_no || '').toLowerCase().includes(q) ||
      (s.orders?.order_no || '').toLowerCase().includes(q) ||
      (s.orders?.companies?.company_name || '').toLowerCase().includes(q) ||
      (s.carrier || '').toLowerCase().includes(q) ||
      (s.tracking_no || '').toLowerCase().includes(q)
    )
  }, [shipments, searchText])

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
    if (err) { alert('登録エラー: ' + err.message); setSaving(false); return }
    
    setSaving(false)
    setModalOpen(false)
    router.push(`/orders/shipments/${data.shipment_id}`)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error: err } = await supabase.from('shipments').delete().eq('shipment_id', deleteId)
    if (err) alert('削除エラー: ' + err.message)
    setDeleteId(null)
    fetchShipments()
  }

  /* ─── Render ────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* ── Page Header ───────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Truck size={20} style={{ color: 'var(--accent)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="ja" style={{ fontSize: 16 }}>出荷・納品</span>
            <span className="vi" style={{ fontSize: 11 }}>Xuất hàng &amp; Phiếu giao</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={14} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>新規出荷</span>
        </button>
      </div>

      {/* ── Filters Section ───────────────────────────────────── */}
      <div className="form-section" style={{ flexShrink: 0, marginBottom: 0 }}>
        <div className="form-section-header">
          <Filter className="section-icon" />
          <span>検索条件</span>
        </div>
        <div className="form-section-body">
          <div className="form-grid-4">
            <div className="form-field">
              <label className="form-label">
                <span className="label-ja">出荷日 (から)</span>
                <span className="label-vi">Xuất từ ngày</span>
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">
                <span className="label-ja">出荷日 (まで)</span>
                <span className="label-vi">Đến ngày</span>
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">
                <span className="label-ja">キーワード</span>
                <span className="label-vi">Tìm kiếm</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="検索..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchText.trim()) {
                      addHistory(searchText.trim())
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
                      addHistory(v)
                      router.push(`?search=${encodeURIComponent(v)}`)
                    }}
                    onClear={clearHistory}
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
            読み込み中...
          </div>
        ) : error ? (
          <div style={{ padding: 16, color: 'var(--status-error)', fontSize: 12 }}>
            エラー: {error}
          </div>
        ) : (
          <>
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 120 }}>
                      <span className="ja">納品書No</span>
                      <span className="vi">Số PG</span>
                    </th>
                    <th style={{ width: 120 }}>
                      <span className="ja">受注番号</span>
                      <span className="vi">Mã ĐH</span>
                    </th>
                    <th style={{ width: 180 }}>
                      <span className="ja">得意先</span>
                      <span className="vi">Khách hàng</span>
                    </th>
                    <th style={{ width: 100 }}>
                      <span className="ja">出荷日</span>
                      <span className="vi">Ngày xuất</span>
                    </th>
                    <th style={{ width: 100 }}>
                      <span className="ja">納品日</span>
                      <span className="vi">Ngày giao</span>
                    </th>
                    <th style={{ width: 110 }}>
                      <span className="ja">運送</span>
                      <span className="vi">Vận chuyển</span>
                    </th>
                    <th style={{ width: 120 }}>
                      <span className="ja">追跡No</span>
                      <span className="vi">Tracking</span>
                    </th>
                    <th style={{ width: 90, textAlign: 'center' }}>
                      <span className="ja">状態</span>
                      <span className="vi">Trạng thái</span>
                    </th>
                    <th style={{ width: 80, textAlign: 'right' }}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                        データがありません
                      </td>
                    </tr>
                  ) : (
                    filtered.map(s => {
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
                                未設定
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
                              {st.labelJa}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                              <Link
                                href={`/orders/shipments/${s.shipment_id}`}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}
                                title="詳細"
                              >
                                <Edit2 size={14} />
                              </Link>
                              <button
                                onClick={() => setDeleteId(s.shipment_id)}
                                style={{ background: 'none', border: 'none', color: 'var(--status-error)', cursor: 'pointer', padding: 4 }}
                                title="削除"
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
                totalRecords={totalRecords}
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
                <span className="ja" style={{ fontSize: 13, textTransform: 'none', color: 'var(--text-primary)' }}>
                  新規出荷登録
                </span>
                <span className="vi" style={{ fontSize: 10, textTransform: 'none' }}>
                  Tạo phiếu xuất mới
                </span>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>
            
            <div className="custom-scrollbar" style={{ padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-field">
                <label className="form-label"><span className="label-ja">受注番号</span><span className="label-vi">Mã đơn hàng</span></label>
                <AsyncSearchableSelect
                  value={form.order_id}
                  onChange={(v) => setForm(f => ({ ...f, order_id: v || '' }))}
                  placeholder="受注番号を検索..."
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
                  <label className="form-label"><span className="label-ja">出荷日 *</span><span className="label-vi">Ngày xuất</span></label>
                  <input type="date" required className="form-input" value={form.ship_date} onChange={e => setForm(f => ({ ...f, ship_date: e.target.value }))} />
                </div>
                <div className="form-field">
                  <label className="form-label"><span className="label-ja">納品日</span><span className="label-vi">Ngày giao</span></label>
                  <input type="date" className="form-input" value={form.delivery_date} onChange={e => setForm(f => ({ ...f, delivery_date: e.target.value }))} />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label"><span className="label-ja">納品書番号</span><span className="label-vi">Số phiếu giao</span></label>
                <input type="text" className="form-input mono" value={form.delivery_note_no} onChange={e => setForm(f => ({ ...f, delivery_note_no: e.target.value }))} placeholder="DN-2026-001" />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label"><span className="label-ja">運送会社</span><span className="label-vi">Hãng vận chuyển</span></label>
                  <input type="text" className="form-input" value={form.carrier} onChange={e => setForm(f => ({ ...f, carrier: e.target.value }))} placeholder="ヤマト運輸" />
                </div>
                <div className="form-field">
                  <label className="form-label"><span className="label-ja">追跡番号</span><span className="label-vi">Mã tracking</span></label>
                  <input type="text" className="form-input mono" value={form.tracking_no} onChange={e => setForm(f => ({ ...f, tracking_no: e.target.value }))} />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label"><span className="label-ja">状態</span><span className="label-vi">Trạng thái</span></label>
                <select className="form-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  {STATUS_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.labelJa} / {s.labelVi}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label"><span className="label-ja">備考</span><span className="label-vi">Ghi chú</span></label>
                <textarea className="form-textarea" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
              </div>
            </div>

            <div className="form-actions" style={{ padding: '12px 16px', background: 'var(--bg-surface-2)', marginTop: 0 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>キャンセル</button>
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving || !form.ship_date}>
                {saving && <Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />}
                登録する
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
            <h3 className="ja" style={{ fontSize: 15, marginBottom: 8 }}>削除確認</h3>
            <p className="vi" style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
              この出荷レコードを削除しますか？<br/>
              Bạn có chắc muốn xoá bản ghi này?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>キャンセル</button>
              <button className="btn" style={{ background: 'var(--status-error)', color: '#fff', border: 'none' }} onClick={handleDelete}>
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
