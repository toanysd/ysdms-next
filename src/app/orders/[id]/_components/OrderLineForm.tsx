'use client'

import { useState } from 'react'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'
import { saveOrderLinesAction } from '../actions'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import { createClient } from '@/lib/supabase/client'

export function OrderLineForm({ orderId, initialLines, orderStatus }: { orderId: string, initialLines: any[], orderStatus: string }) {
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
    // Validate
    if (lines.some(l => !l.product_id || !l.quantity)) {
      alert('Vui lòng chọn Sản phẩm và Nhập số lượng cho tất cả các dòng.')
      return
    }

    setIsSaving(true)
    const res = await saveOrderLinesAction(orderId, lines)
    setIsSaving(false)
    if (!res.success) {
      alert('Lỗi lưu dòng đơn: ' + res.error)
    }
  }

  const fetchProducts = async (query: string) => {
    let q = supabase.from('products').select('product_id, product_code, product_name')
    if (query) {
      q = q.or(`product_code.ilike.%${query}%,product_name.ilike.%${query}%`)
    }
    const { data } = await q.limit(20)
    return (data || []).map(p => ({
      value: p.product_id,
      label: p.product_name || p.product_code,
      sublabel: p.product_code
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Chi tiết Đơn hàng ({lines.length})</h2>
        {canEdit && (
          <button onClick={handleSave} className="btn btn-primary !p-1.5 px-3" disabled={isSaving}>
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
            <span style={{ fontSize: 12 }}>Lưu thay đổi</span>
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
        {lines.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có dòng nào.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: 'center' }}>#</th>
                <th>Sản phẩm <span style={{ color: 'var(--status-error)' }}>*</span></th>
                <th style={{ width: 100 }}>Số lượng <span style={{ color: 'var(--status-error)' }}>*</span></th>
                <th style={{ width: 80 }}>ĐVT</th>
                <th style={{ width: 140 }}>Ngày giao YC</th>
                <th style={{ width: 140 }}>Ngày xuất hàng</th>
                {canEdit && <th style={{ width: 40, textAlign: 'center' }}></th>}
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={l.line_id}>
                  <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, fontWeight: 700 }}>{i + 1}</td>
                  <td>
                    {canEdit ? (
                      <AsyncSearchableSelect
                        placeholder="Chọn Sản phẩm..."
                        value={l.product_id}
                        onChange={v => updateLine(l.line_id, 'product_id', v)}
                        fetchOptions={fetchProducts}
                        initialOption={l.products ? { value: l.product_id, label: l.products.product_name, sublabel: l.products.product_code } : undefined}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{l.products?.product_name || l.product_id}</span>
                    )}
                  </td>
                  <td>
                    {canEdit ? (
                      <input type="number" min={1} className="form-input text-[13px] text-right font-mono" value={l.quantity} onChange={e => updateLine(l.line_id, 'quantity', parseInt(e.target.value) || 0)} />
                    ) : (
                      <span className="font-mono text-[13px]">{l.quantity}</span>
                    )}
                  </td>
                  <td>
                    {canEdit ? (
                      <input className="form-input text-[13px] text-center" value={l.unit} onChange={e => updateLine(l.line_id, 'unit', e.target.value)} />
                    ) : (
                      <span className="font-mono text-[13px]">{l.unit}</span>
                    )}
                  </td>
                  <td>
                    {canEdit ? (
                      <input type="date" className="form-input text-[13px]" value={l.due_date || ''} onChange={e => updateLine(l.line_id, 'due_date', e.target.value)} />
                    ) : (
                      <span className="font-mono text-[13px]">{l.due_date}</span>
                    )}
                  </td>
                  <td>
                    {canEdit ? (
                      <input type="date" className="form-input text-[13px]" value={l.ship_date || ''} onChange={e => updateLine(l.line_id, 'ship_date', e.target.value)} />
                    ) : (
                      <span className="font-mono text-[13px]">{l.ship_date}</span>
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
              ))}
            </tbody>
          </table>
        )}
        
        {canEdit && (
          <div style={{ padding: 16 }}>
            <button onClick={handleAddLine} className="btn btn-secondary flex items-center gap-1 text-[12px]">
              <Plus size={14} /> Thêm dòng
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
