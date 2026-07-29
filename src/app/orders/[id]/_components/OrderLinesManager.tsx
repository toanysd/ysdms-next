'use client'

import { useTranslations } from 'next-intl'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, PackageOpen, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import { useRouter } from 'next/navigation'

type OrderLine = {
  line_id: string
  order_id: string
  line_no: number
  product_id: string
  quantity: number
  unit: string
  due_date: string | null
  delivery_site_id: string | null
  material_spec_id: string | null
  line_status: string
  priority: string | null
  is_free_sample: boolean
  charge_type: string | null
  notes: string | null
  products?: {
    product_code: string
    product_name: string | null
  } | null
}

const LINE_STATUS_OPT = [
  { value: 'NEW', labelKey: 'lineStatusNew' },
  { value: 'PRODUCING', labelKey: 'lineStatusProducing' },
  { value: 'INSPECTING', labelKey: 'lineStatusInspecting' },
  { value: 'READY', labelKey: 'lineStatusReady' },
]

export function OrderLinesManager({ orderId, companyId, initialLines }: { orderId: string, companyId: string, initialLines: OrderLine[] }) {
  const t = useTranslations()

  const supabase = createClient()
  const router = useRouter()
  
  const [lines, setLines] = useState<OrderLine[]>(initialLines)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deliverySites, setDeliverySites] = useState<any[]>([])

  useEffect(() => {
    supabase.from('delivery_sites')
      .select('site_id, site_name, contact_person')
      .eq('company_id', companyId)
      .then(({ data }) => {
        if (data) setDeliverySites(data)
      })
  }, [companyId, supabase])
  
  const [form, setForm] = useState({
    product_id: '',
    quantity: 1,
    unit: 'pcs',
    line_status: 'NEW',
    delivery_site_id: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)

  const handleOpenAdd = () => {
    setForm({
      product_id: '',
      quantity: 1,
      unit: 'pcs',
      line_status: 'NEW',
      delivery_site_id: '',
      notes: '',
    })
    setEditingId(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (l: OrderLine) => {
    setForm({
      product_id: l.product_id,
      quantity: l.quantity,
      unit: l.unit,
      line_status: l.line_status,
      delivery_site_id: l.delivery_site_id || '',
      notes: l.notes || '',
    })
    setEditingId(l.line_id)
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      order_id: orderId,
      product_id: form.product_id,
      quantity: form.quantity,
      unit: form.unit,
      line_status: form.line_status,
      delivery_site_id: form.delivery_site_id || null,
      notes: form.notes || null,
    }

    if (editingId) {
      const { error } = await supabase.from('order_lines').update(payload).eq('line_id', editingId)
      if (error) alert(error.message)
    } else {
      const maxLineNo = lines.length > 0 ? Math.max(...lines.map(x => x.line_no)) : 0
      const { error } = await supabase.from('order_lines').insert({
        ...payload,
        line_no: maxLineNo + 1
      })
      if (error) alert(error.message)
    }

    setSaving(false)
    setModalOpen(false)
    
    // Refresh lines
    const { data } = await supabase
      .from('order_lines')
      .select('*, products(product_code, product_name)')
      .eq('order_id', orderId)
      .order('line_no', { ascending: true })
    if (data) setLines(data as OrderLine[])
    router.refresh()
  }

  const handleDelete = async (lineId: string) => {
    if (!confirm(t('Common.deleteConfirm'))) return
    const { error } = await supabase.from('order_lines').delete().eq('line_id', lineId)
    if (error) alert(error.message)
    else {
      setLines(prev => prev.filter(l => l.line_id !== lineId))
      router.refresh()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PackageOpen size={16} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{t('Orders.orderDetails')}</span>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <Plus size={14} />
          <span>{t('Common.add')}</span>
        </button>
      </div>

      {/* Table */}
      <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60, textAlign: 'center' }}>No.</th>
              <th>
                {t('Orders.sanPham')}
              </th>
              <th style={{ width: 100, textAlign: 'right' }}>
                {t('Orders.soLuong')}
              </th>
              <th style={{ width: 80, textAlign: 'center' }}>
                {t('Orders.trangThai')}
              </th>
              <th style={{ width: 80, textAlign: 'right' }}>{t('Common.action')}</th>
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                  {t('Orders.noOrderLines')}
                </td>
              </tr>
            ) : (
              lines.map(l => {
                const sLabel = LINE_STATUS_OPT.find(x => x.value === l.line_status)?.labelKey
                const displayLabel = sLabel ? t(`Orders.${sLabel}`) : l.line_status
                return (
                  <tr key={l.line_id}>
                    <td style={{ textAlign: 'center', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{l.line_no}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{l.products?.product_name || '—'}</div>
                      <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{l.products?.product_code}</div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                      {l.quantity} <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{l.unit}</span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge--neutral" style={{ fontSize: 9 }}>{displayLabel}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                        <button onClick={() => handleOpenEdit(l)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 4 }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(l.line_id)} style={{ background: 'none', border: 'none', color: 'var(--status-error)', cursor: 'pointer', padding: 4 }}>
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

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
          <div className="card" style={{ width: 440 }}>
            <div className="form-section-header" style={{ justifyContent: 'space-between', padding: '12px 16px' }}>
              <div>
                {editingId ? t('Common.edit') : t('Common.addNew')}
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-field">
                <label className="form-label">{t('Orders.sanPham')}</label>
                <AsyncSearchableSelect
                  value={form.product_id}
                  onChange={(v) => setForm(f => ({ ...f, product_id: v || '' }))}
                  placeholder={t('Orders.searchProduct')}
                  fetchOptions={async (q) => {
                    const { data } = await supabase
                      .from('products')
                      .select('product_id, product_code, product_name')
                      .or(`product_code.ilike.%${q}%,product_name.ilike.%${q}%`)
                      .limit(20)
                    return (data || []).map((p: any) => ({
                      value: p.product_id,
                      label: p.product_name,
                      sublabel: p.product_code
                    }))
                  }}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label className="form-label">{t('Orders.soLuong')}</label>
                  <input type="number" className="form-input" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))} />
                </div>
                <div className="form-field">
                  <label className="form-label">{t('Orders.onVi')}</label>
                  <input type="text" className="form-input" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label">{t('Orders.iaIemGiaoHang')}</label>
                <select className="form-input" value={form.delivery_site_id} onChange={e => setForm(f => ({ ...f, delivery_site_id: e.target.value }))}>
                  <option value="">{t('Orders.noDeliverySite')}</option>
                  {deliverySites.map(s => (
                    <option key={s.site_id} value={s.site_id}>
                      {s.site_name} {s.contact_person ? `(${s.contact_person})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">{t('Orders.trangThai')}</label>
                <select className="form-input" value={form.line_status} onChange={e => setForm(f => ({ ...f, line_status: e.target.value }))}>
                  {LINE_STATUS_OPT.map(o => (
                    <option key={o.value} value={o.value}>{t(`Orders.${o.labelKey}`)}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="form-label">{t('Orders.ghiChu')}</label>
                <textarea className="form-textarea" rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>

            <div className="form-actions" style={{ padding: '12px 16px', background: 'var(--bg-surface-2)', marginTop: 0 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>{t('Common.cancel')}</button>
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving || !form.product_id}>
                {saving && <Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />}
                {t('Common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
