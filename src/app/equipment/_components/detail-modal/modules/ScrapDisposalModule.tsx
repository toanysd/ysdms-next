'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'
import { EquipmentDetailData } from '../types'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
  onSuccess: () => void
}

export default function ScrapDisposalModule({ data, onClose, onSuccess }: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [scrapReason, setScrapReason] = useState('摩耗・破損 (Mòn/Hỏng)')
  const [disposedDate, setDisposedDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')

  const handleScrapSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirm('⚠️ 警告: この設備を本当に廃棄（DISPOSED）にしますか？\nHành động này sẽ khóa trạng thái khuôn.')) return

    setLoading(true)
    setMsg(null)

    try {
      // 1. Update equipment status
      const { error: err1 } = await supabase
        .from('equipment')
        .update({
          usage_status: 'DISPOSED',
          device_status: 'DISPOSED',
          disposed_date: disposedDate
        })
        .eq('equipment_id', data.equipment_id)

      if (err1) throw err1

      // 2. Insert log into equipment_history
      await supabase.from('equipment_history').insert({
        equipment_id: data.equipment_id,
        action_type: 'DISPOSE',
        action_date: disposedDate,
        description: `[廃棄処理] Lý do: ${scrapReason}. ${notes}`
      })

      setMsg('✅ 設備の廃棄処理を完了しました。')
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
    <form onSubmit={handleScrapSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
      {msg && (
        <div
          style={{
            padding: '8px 12px', borderRadius: 6, fontWeight: 600,
            background: msg.includes('❌') ? 'var(--tint-orange-bg)' : 'var(--tint-teal-bg)',
            color: msg.includes('❌') ? 'var(--tint-orange-text)' : 'var(--tint-teal-text)'
          }}
        >
          {msg}
        </div>
      )}

      <div style={{ padding: 10, background: 'var(--tint-orange-bg)', border: '1px solid var(--tint-orange-border)', borderRadius: 6, color: 'var(--tint-orange-text)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontWeight: 700 }}>⚠️ 設備廃棄の手続き (Quy trình Hủy khuôn/Thiết bị)</div>
          <div style={{ fontSize: 11 }}>
            Sau khi hủy, thiết bị sẽ chuyển sang trạng thái <strong>DISPOSED</strong> và không thể gá sản xuất tiếp.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          廃棄理由 (Lý do hủy thiết bị):
        </label>
        <select
          className="form-input"
          value={scrapReason}
          onChange={e => setScrapReason(e.target.value)}
        >
          <option value="摩耗・破損 (Mòn/Hỏng)">摩耗・破損 (Mòn / Hỏng do sử dụng)</option>
          <option value="改訂に伴う廃版 (Bản thiết kế mới thay thế)">改訂に伴う廃版 (Sản phẩm đổi thiết kế)</option>
          <option value="客先指示による廃棄 (Khách hàng yêu cầu hủy)">客先指示による廃棄 (Khách hàng yêu cầu hủy)</option>
          <option value="その他 (Khác)">その他 (Lý do khác)</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          廃棄年月日 (Ngày thanh lý):
        </label>
        <input
          type="date"
          className="form-input"
          value={disposedDate}
          onChange={e => setDisposedDate(e.target.value)}
          required
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          詳細メモ (Ghi chú lý do thanh lý):
        </label>
        <textarea
          className="form-textarea"
          rows={2}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Số biên bản thanh lý..."
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12 }}>
          キャンセル (Hủy)
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ background: '#ef4444', borderColor: '#dc2626', fontSize: 12 }}>
          {loading ? <Loader2 className="animate-spin" size={14} /> : '🗑️ 廃棄処理を確定 (Xác nhận hủy)'}
        </button>
      </div>
    </form>
  )
}
