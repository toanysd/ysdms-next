'use client'

import { useState } from 'react'
import { updateOrderHeaderAction, updateOrderStatusAction } from '../actions'
import { Save, Loader2, Edit2, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function OrderHeaderForm({ order, companies }: { order: any, companies: any[] }) {
  const tCommon = useTranslations('Common')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    order_no: order.order_no || '',
    customer_order_no: order.customer_order_no || '',
    order_date: order.order_date || '',
    requested_delivery: order.requested_delivery || '',
    notes: order.notes || ''
  })

  const handleSave = async () => {
    setIsSaving(true)
    const res = await updateOrderHeaderAction(order.order_id, formData)
    setIsSaving(false)
    if (res.success) {
      setIsEditing(false)
    } else {
      alert('Error saving header: ' + res.error)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (order.order_status === newStatus) return
    const res = await updateOrderStatusAction(order.order_id, newStatus)
    if (!res.success) alert('Error updating status: ' + res.error)
  }

  const statuses = ['DRAFT', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'CLOSED']

  return (
    <div className="card-flat" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ── STATUS BAR ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
        {statuses.map((status, idx) => {
          const isActive = order.order_status === status
          const isPassed = statuses.indexOf(order.order_status) >= idx
          
          return (
            <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => handleStatusChange(status)}
                className={`badge font-bold cursor-pointer transition-colors ${
                  isActive ? 'badge--info ring-2 ring-blue-500' :
                  isPassed ? 'badge--success opacity-80' : 'badge--neutral opacity-50'
                }`}
                style={{ fontSize: 11, padding: '4px 10px', whiteSpace: 'nowrap' }}
              >
                {status}
              </button>
              {idx < statuses.length - 1 && (
                <div style={{ width: 16, height: 2, background: isPassed ? 'var(--status-success)' : 'var(--border-subtle)' }} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── HEADER FORM ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Thông tin chung</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn btn-secondary !p-1.5" title="Sửa">
            <Edit2 size={14} /> Sửa
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setIsEditing(false)} className="btn btn-secondary !p-1.5" disabled={isSaving}>
              <X size={14} />
            </button>
            <button onClick={handleSave} className="btn btn-primary !p-1.5" disabled={isSaving}>
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            </button>
          </div>
        )}
      </div>

      <div className="form-grid-2">
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Mã Đơn</label>
          <input
            className="form-input font-mono text-[13px]"
            value={formData.order_no}
            onChange={e => setFormData({ ...formData, order_no: e.target.value })}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Mã PO Khách hàng</label>
          <input
            className="form-input font-mono text-[13px]"
            value={formData.customer_order_no}
            onChange={e => setFormData({ ...formData, customer_order_no: e.target.value })}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Ngày đặt</label>
          <input
            type="date"
            className="form-input text-[13px]"
            value={formData.order_date}
            onChange={e => setFormData({ ...formData, order_date: e.target.value })}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Ngày giao yêu cầu</label>
          <input
            type="date"
            className="form-input text-[13px]"
            value={formData.requested_delivery}
            onChange={e => setFormData({ ...formData, requested_delivery: e.target.value })}
            readOnly={!isEditing}
          />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Ghi chú</label>
        <textarea
          className="form-textarea text-[13px]"
          rows={2}
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          readOnly={!isEditing}
        />
      </div>
    </div>
  )
}
