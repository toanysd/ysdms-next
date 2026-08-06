'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Truck, Building2, Calendar, FileText, Loader2, CheckCircle, AlertTriangle } from 'lucide-react'
import { EquipmentDetailData } from '../types'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
  onSuccess: () => void
}

export default function CheckInOutModule({ data, onClose, onSuccess }: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [companies, setCompanies] = useState<any[]>([])

  const [movementType, setMovementType] = useState<'SHIPMENT' | 'RETURN' | 'LOAN' | 'REPAIR'>('SHIPMENT')
  const [targetKeeperId, setTargetKeeperId] = useState<string>(data.keeper_company_id || '')
  const [actionDate, setActionDate] = useState<string>(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')

  useEffect(() => {
    async function fetchCompanies() {
      const { data: comp } = await supabase
        .from('companies')
        .select('company_id, company_name, company_code')
        .order('company_code')
      if (comp) setCompanies(comp)
    }
    fetchCompanies()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      const isReturn = movementType === 'RETURN' || !targetKeeperId
      const newStatus = isReturn ? 'IN_STOCK' : movementType === 'LOAN' ? 'LOAN' : movementType === 'REPAIR' ? 'MAINTENANCE' : 'OUT'
      const finalKeeperId = isReturn ? null : targetKeeperId

      // 1. Update equipment
      const { error: err1 } = await supabase
        .from('equipment')
        .update({
          keeper_company_id: finalKeeperId,
          usage_status: newStatus,
          returned_date: isReturn ? actionDate : null
        })
        .eq('equipment_id', data.equipment_id)

      if (err1) throw err1

      // 2. Insert equipment_movements log
      await (supabase as any).from('equipment_movements').insert({
        equipment_id: data.equipment_id,
        movement_type: movementType,
        from_company_id: data.keeper_company_id || null,
        to_company_id: finalKeeperId,
        moved_at: actionDate,
        notes: notes || `入出庫: ${movementType}`
      })

      // 3. Insert equipment_history log
      await supabase.from('equipment_history').insert({
        equipment_id: data.equipment_id,
        action_type: movementType === 'RETURN' ? 'RETURN' : movementType === 'LOAN' ? 'LOAN' : 'TRANSFER',
        action_date: actionDate,
        from_company_id: data.keeper_company_id || null,
        to_company_id: finalKeeperId,
        description: `[${movementType}] ${notes || 'Chuyển vị trí lưu trữ'}`
      })

      setMsg('✅ 入出庫・移動ステータスを更新しました！')
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 900)
    } catch (err: any) {
      setMsg(`❌ エラー: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {msg && (
        <div
          style={{
            padding: '8px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            background: msg.includes('❌') ? 'var(--tint-orange-bg)' : 'var(--tint-teal-bg)',
            color: msg.includes('❌') ? 'var(--tint-orange-text)' : 'var(--tint-teal-text)'
          }}
        >
          {msg}
        </div>
      )}

      {/* Movement Category Selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          移動種別 (Loại xuất nhập / Vận chuyển):
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {[
            { id: 'SHIPMENT', label: '出荷 (Xuất)' },
            { id: 'RETURN', label: '返却 (Trả YSD)' },
            { id: 'LOAN', label: '借用 (Cho mượn)' },
            { id: 'REPAIR', label: '修繕 (Sửa mạ)' },
          ].map(m => (
            <button
              type="button"
              key={m.id}
              onClick={() => {
                setMovementType(m.id as any)
                if (m.id === 'RETURN') setTargetKeeperId('')
              }}
              style={{
                fontSize: 11, fontWeight: movementType === m.id ? 700 : 500,
                color: movementType === m.id ? 'var(--accent)' : 'var(--text-secondary)',
                background: movementType === m.id ? 'var(--tint-teal-bg)' : 'var(--bg-surface-2)',
                border: movementType === m.id ? '1px solid var(--accent)' : '1px solid var(--border-default)',
                borderRadius: 6, padding: '6px 4px', cursor: 'pointer'
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target Keeper Company */}
      {movementType !== 'RETURN' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
            移動先保管会社 (Công ty tiếp nhận):
          </label>
          <select
            className="form-input"
            value={targetKeeperId}
            onChange={e => setTargetKeeperId(e.target.value)}
            required
          >
            <option value="">-- 選択してください (Chọn công ty) --</option>
            {companies.map(c => (
              <option key={c.company_id} value={c.company_id}>
                🏢 {c.company_name} ({c.company_code})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Date */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          移動実施日 (Ngày thực hiện):
        </label>
        <input
          type="date"
          className="form-input"
          value={actionDate}
          onChange={e => setActionDate(e.target.value)}
          required
        />
      </div>

      {/* Notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          備考・特記事項 (Ghi chú):
        </label>
        <textarea
          className="form-textarea"
          rows={2}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="VD: Gửi mạ Teflon tại Marudai, dự kiến hoàn thành sau 3 ngày..."
        />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12 }}>
          キャンセル (Hủy)
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ fontSize: 12 }}>
          {loading ? <Loader2 className="animate-spin" size={14} /> : '更新を実行 (Xác nhận)'}
        </button>
      </div>
    </form>
  )
}
