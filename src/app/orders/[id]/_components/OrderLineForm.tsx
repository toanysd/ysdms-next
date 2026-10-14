'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'
import { saveOrderLinesAction } from '../actions'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import { createClient } from '@/lib/supabase/client'

function formatProductLabel(prod?: { product_code?: string | null; product_name_internal?: string | null } | null) {
  if (!prod) return '—'
  const code = prod.product_code?.trim() || ''
  const internal = prod.product_name_internal?.trim() || ''
  if (code && internal && internal !== code) return `${code} (${internal})`
  return code || internal || '—'
}

export function OrderLineForm({ orderId, initialLines, orderStatus }: { orderId: string, initialLines: any[], orderStatus: string }) {
  const tOrders = useTranslations('Orders')
  const tCommon = useTranslations('Common')
  const [lines, setLines] = useState(initialLines)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()
  
  const canEdit = orderStatus === 'DRAFT' || orderStatus === 'CONFIRMED'

  const handleAddLine = () => {
    setLines([...lines, {
      line_id: `new-${Date.now()}`,
      order_id: orderId,
      product_id: null,
      quantity: 1,
      shipped_qty: 0,
      remaining_qty: 1,
      line_status: 'DRAFT',
      unit: 'PCS',
      due_date: '',
      ship_date: ''
    }])
  }

  const handleRemoveLine = (id: string) => {
    setLines(lines.filter(l => l.line_id !== id))
  }

  const updateLine = (id: string, field: string, value: any) => {
    setLines(lines.map(l => l.line_id === id ? { ...l, [field]: value } : l))
  }

  const handleSave = async () => {
    if (lines.some(l => !l.product_id || !l.quantity)) {
      alert(tOrders('errorLineProductAndQtyRequired'))
      return
    }

    setIsSaving(true)
    const res = await saveOrderLinesAction(orderId, lines)
    setIsSaving(false)
    if (!res.success) {
      alert(tOrders('errorSave') + ': ' + res.error)
    }
  }

  const fetchProducts = async (query: string) => {
    let q = supabase.from('products').select('product_id, product_code, product_name_internal')
    if (query) {
      q = q.or(`product_code.ilike.%${query}%,product_name_internal.ilike.%${query}%`)
    }
    const { data } = await q.limit(20)
    return (data || []).map(p => ({
      value: p.product_id,
      label: formatProductLabel(p),
      sublabel: p.product_code || undefined
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{tOrders('orderDetails')} ({lines.length})</h2>
        {canEdit && (
          <button onClick={handleSave} className="btn btn-primary !p-1.5 px-3" disabled={isSaving}>
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
            <span style={{ fontSize: 12 }}>{tCommon('save')}</span>
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
        {lines.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>{tOrders('noOrderLines')}</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: 'center' }}>#</th>
                <th>{tOrders('product')} <span style={{ color: 'var(--status-error)' }}>*</span></th>
                <th style={{ width: 100, textAlign: 'right' }}>{tOrders('quantity')} <span style={{ color: 'var(--status-error)' }}>*</span></th>
                <th style={{ width: 70, textAlign: 'center' }}>{tOrders('onVi')}</th>
                <th style={{ width: 90, textAlign: 'right' }}>{tOrders('shippedQtyCol')}</th>
                <th style={{ width: 90, textAlign: 'right' }}>{tOrders('remainingQtyCol')}</th>
                <th style={{ width: 110, textAlign: 'center' }}>{tOrders('lineStatusCol')}</th>
                <th style={{ width: 130 }}>{tOrders('deliveryDate')}</th>
                <th style={{ width: 130 }}>{tOrders('shipDate')}</th>
                {canEdit && <th style={{ width: 40, textAlign: 'center' }}></th>}
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => {
                const shippedQty = Number(l.shipped_qty ?? 0)
                const remainingQty = l.remaining_qty !== null && l.remaining_qty !== undefined
                  ? Number(l.remaining_qty)
                  : Math.max(0, Number(l.quantity || 0) - shippedQty)
                const lineStatus = l.line_status || 'CONFIRMED'
                const productLabel = formatProductLabel(l.products)

                return (
                  <tr key={l.line_id}>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }}>{l.line_no ?? (i + 1)}</td>
                    <td>
                      {canEdit ? (
                        <AsyncSearchableSelect
                          placeholder={tOrders('searchProductPlaceholder')}
                          value={l.product_id}
                          onChange={v => updateLine(l.line_id, 'product_id', v)}
                          fetchOptions={fetchProducts}
                          initialOption={l.products ? { value: l.product_id, label: productLabel, sublabel: l.products.product_code } : undefined}
                        />
                      ) : (
                        <span style={{ fontWeight: 700, fontSize: 13, fontFamily: 'monospace' }}>{productLabel}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {canEdit ? (
                        <input type="number" min={1} className="form-input text-[13px] text-right font-mono" value={l.quantity} onChange={e => updateLine(l.line_id, 'quantity', parseInt(e.target.value) || 0)} />
                      ) : (
                        <span className="font-mono text-[13px] font-bold">{Number(l.quantity || 0).toLocaleString()}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {canEdit ? (
                        <input className="form-input text-[13px] text-center" value={l.unit} onChange={e => updateLine(l.line_id, 'unit', e.target.value)} />
                      ) : (
                        <span className="font-mono text-[13px]">{l.unit}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-mono text-[13px]">{shippedQty.toLocaleString()}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="font-mono text-[13px] font-bold" style={{ color: remainingQty > 0 ? 'var(--accent)' : 'var(--text-muted)' }}>
                        {remainingQty.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge font-bold ${
                        lineStatus === 'SHIPPED' ? 'badge--success' :
                        lineStatus === 'PARTIALLY_SHIPPED' ? 'badge--warning' :
                        lineStatus === 'CONFIRMED' ? 'badge--info' :
                        'badge--neutral'
                      }`}>
                        {lineStatus}
                      </span>
                    </td>
                    <td>
                      {canEdit ? (
                        <input type="date" className="form-input text-[13px]" value={l.due_date || ''} onChange={e => updateLine(l.line_id, 'due_date', e.target.value)} />
                      ) : (
                        <span className="font-mono text-[13px]">{l.due_date || '—'}</span>
                      )}
                    </td>
                    <td>
                      {canEdit ? (
                        <input type="date" className="form-input text-[13px]" value={l.ship_date || ''} onChange={e => updateLine(l.line_id, 'ship_date', e.target.value)} />
                      ) : (
                        <span className="font-mono text-[13px]">{l.ship_date || '—'}</span>
                      )}
                    </td>
                    {canEdit && (
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => handleRemoveLine(l.line_id)} style={{ color: 'var(--status-error)' }} className="p-1 hover:bg-red-50 rounded">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        
        {canEdit && (
          <div style={{ padding: 16 }}>
            <button onClick={handleAddLine} className="btn btn-secondary flex items-center gap-1 text-[12px]">
              <Plus size={14} /> {tOrders('addLine')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
