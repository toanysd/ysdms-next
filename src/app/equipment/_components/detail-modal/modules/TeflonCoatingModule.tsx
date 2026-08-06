'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Check, Loader2 } from 'lucide-react'
import { EquipmentDetailData } from '../types'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
  onSuccess: () => void
}

export default function TeflonCoatingModule({ data, onClose, onSuccess }: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [isTeflon, setIsTeflon] = useState<boolean>(data.is_teflon ?? false)
  const [coatingVendor, setCoatingVendor] = useState('丸大 (Marudai)')
  const [coatingDate, setCoatingDate] = useState(new Date().toISOString().slice(0, 10))
  const [notes, setNotes] = useState('')

  const handleTeflonSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      // 1. Update equipment teflon flag & notes
      const teflonNote = isTeflon ? `[✨ テフロン済] ${coatingVendor} (${coatingDate}). ${notes}` : '標準 (Chưa mạ)'
      const { error: err1 } = await supabase
        .from('equipment')
        .update({
          is_teflon: isTeflon,
          notes: teflonNote
        } as any)
        .eq('equipment_id', data.equipment_id)

      if (err1) throw err1

      // 2. Insert into jobs
      if (isTeflon) {
        await supabase.from('jobs').insert({
          equipment_id: data.equipment_id,
          job_code: `TEF-${data.equipment_code}-${Date.now().toString().slice(-4)}`,
          job_name: `✨ テフロンコーティング再加工 (${coatingVendor})`,
          job_category: 'EQUIPMENT_REPAIR',
          job_status: 'COMPLETED',
          ship_date: coatingDate,
          notes: notes || 'Hoàn thành mạ phủ Teflon'
        })

        // 3. Insert equipment_history
        await supabase.from('equipment_history').insert({
          equipment_id: data.equipment_id,
          action_type: 'REPAIR',
          action_date: coatingDate,
          description: `[テフロン加工] Gửi mạ phủ Teflon tại ${coatingVendor}`
        })
      }

      setMsg('✅ テフロン加工情報を更新しました！')
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
    <form onSubmit={handleTeflonSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
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

      {/* Teflon Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 10, background: 'var(--tint-purple-bg)', borderRadius: 6 }}>
        <div style={{ fontWeight: 700, color: 'var(--tint-purple-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Sparkles size={16} />
          <span>テフロンコーティング済 (Đã mạ Teflon):</span>
        </div>
        <input
          type="checkbox"
          checked={isTeflon}
          onChange={e => setIsTeflon(e.target.checked)}
          style={{ width: 18, height: 18, cursor: 'pointer' }}
        />
      </div>

      {isTeflon && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
              加工業者 (Đơn vị mạ):
            </label>
            <input
              type="text"
              className="form-input"
              value={coatingVendor}
              onChange={e => setCoatingVendor(e.target.value)}
              placeholder="VD: 丸大 (Marudai)..."
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
              加工完了日 (Ngày mạ xong):
            </label>
            <input
              type="date"
              className="form-input"
              value={coatingDate}
              onChange={e => setCoatingDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
              備考 (Ghi chú mạ):
            </label>
            <textarea
              className="form-textarea"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ghi chú thêm về mạ phủ..."
            />
          </div>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12 }}>
          閉じる (Đóng)
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ fontSize: 12 }}>
          {loading ? <Loader2 className="animate-spin" size={14} /> : 'テフロン情報を保存 (Lưu)'}
        </button>
      </div>
    </form>
  )
}
