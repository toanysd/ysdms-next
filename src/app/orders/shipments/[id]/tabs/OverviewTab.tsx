'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save } from 'lucide-react'

type Props = {
  shipment: any
  onRefresh: () => void
}

export function OverviewTab({ shipment, onRefresh }: Props) {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  
  const [form, setForm] = useState({
    ship_date: '',
    delivery_date: '',
    delivery_note_no: '',
    carrier: '',
    tracking_no: '',
    status: 'SHIPPED',
    notes: ''
  })

  useEffect(() => {
    if (shipment) {
      setForm({
        ship_date: shipment.ship_date?.slice(0, 10) || '',
        delivery_date: shipment.delivery_date?.slice(0, 10) || '',
        delivery_note_no: shipment.delivery_note_no || '',
        carrier: shipment.carrier || '',
        tracking_no: shipment.tracking_no || '',
        status: shipment.status || 'SHIPPED',
        notes: shipment.notes || ''
      })
    }
  }, [shipment])

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      ...form,
      updated_at: new Date().toISOString()
    }
    
    // convert empty strings to null for dates
    if (!payload.delivery_date) delete (payload as any).delivery_date

    const { error } = await supabase
      .from('shipments')
      .update(payload as any)
      .eq('shipment_id', shipment.shipment_id)
      
    setSaving(false)
    if (error) {
      alert('更新エラー: ' + error.message)
    } else {
      onRefresh()
    }
  }

  return (
    <div className="card-flat" style={{ padding: 20 }}>
      <div className="form-section">
        <div className="form-section-header">
          <span className="ja">基本情報</span>
          <span className="vi">Thông tin cơ bản</span>
        </div>
        
        <div className="form-grid-2">
          <div>
            <label className="form-label">
              <span className="label-ja">出荷日 <span style={{ color: 'var(--status-error)' }}>*</span></span>
              <span className="label-vi">Ngày xuất</span>
            </label>
            <input
              type="date"
              className="form-input"
              value={form.ship_date}
              onChange={e => setForm({ ...form, ship_date: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">
              <span className="label-ja">納品日</span>
              <span className="label-vi">Ngày giao (dự kiến/thực tế)</span>
            </label>
            <input
              type="date"
              className="form-input"
              value={form.delivery_date}
              onChange={e => setForm({ ...form, delivery_date: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">
              <span className="label-ja">納品書番号</span>
              <span className="label-vi">Số phiếu giao</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={form.delivery_note_no}
              onChange={e => setForm({ ...form, delivery_note_no: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">
              <span className="label-ja">ステータス</span>
              <span className="label-vi">Trạng thái</span>
            </label>
            <select
              className="form-select"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="PENDING">未出荷 / Chờ xuất</option>
              <option value="SHIPPED">出荷済 / Đã xuất</option>
              <option value="DELIVERED">納品済 / Đã giao</option>
              <option value="CANCELLED">キャンセル / Hủy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-header">
          <span className="ja">配送情報</span>
          <span className="vi">Thông tin vận chuyển</span>
        </div>
        
        <div className="form-grid-2">
          <div>
            <label className="form-label">
              <span className="label-ja">配送業者</span>
              <span className="label-vi">Đơn vị vận chuyển</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={form.carrier}
              onChange={e => setForm({ ...form, carrier: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">
              <span className="label-ja">追跡番号</span>
              <span className="label-vi">Mã vận đơn (Tracking)</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={form.tracking_no}
              onChange={e => setForm({ ...form, tracking_no: e.target.value })}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">
              <span className="label-ja">備考</span>
              <span className="label-vi">Ghi chú</span>
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || !form.ship_date}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          保存する
        </button>
      </div>
    </div>
  )
}
