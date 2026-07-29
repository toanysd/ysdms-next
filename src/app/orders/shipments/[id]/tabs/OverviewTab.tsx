'use client'

import { useTranslations } from 'next-intl'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save } from 'lucide-react'

type Props = {
  shipment: any
  onRefresh: () => void
}

export function OverviewTab({ shipment, onRefresh }: Props) {
  const t = useTranslations()

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
      alert(t('Common.updateError') + error.message)
    } else {
      onRefresh()
    }
  }

  return (
    <div className="card-flat" style={{ padding: 20 }}>
      <div className="form-section">
        <div className="form-section-header">
          {t('Orders.thongTinCoBan')}
        </div>
        
        <div className="form-grid-2">
          <div>
            <label className="form-label">
              {t('Orders.ngayXuat')}
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
              {t('Orders.ngayGiaoDuKienthucTe')}
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
              {t('Orders.soPhieuGiao')}
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
              {t('Orders.trangThai')}
            </label>
            <select
              className="form-select"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="PENDING">{t('Shipments.statusPending')}</option>
              <option value="SHIPPED">{t('Shipments.statusShipped')}</option>
              <option value="DELIVERED">{t('Shipments.statusDelivered')}</option>
              <option value="CANCELLED">{t('Shipments.statusCancelled')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-header">
          {t('Orders.thongTinVanChuyen')}
        </div>
        
        <div className="form-grid-2">
          <div>
            <label className="form-label">
              {t('Orders.onViVanChuyen')}
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
              {t('Orders.maVanOnTracking')}
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
              {t('Orders.ghiChu')}
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
          {t('Common.save')}
        </button>
      </div>
    </div>
  )
}
