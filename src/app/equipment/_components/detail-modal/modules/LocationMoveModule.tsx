'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Truck, MapPin, Loader2, CheckCircle2 } from 'lucide-react'
import { EquipmentDetailData } from '../types'
import { formatRackLocationDisplay } from '@/lib/utils/moldNaming'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
  onSuccess: () => void
}

export default function LocationMoveModule({ data, onClose, onSuccess }: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [racks, setRacks] = useState<any[]>([])
  const [targetRackLayerId, setTargetRackLayerId] = useState<string>(data.current_rack_layer_id || '')
  const [notes, setNotes] = useState('')

  const currentRackText = formatRackLocationDisplay(data.rack_layers)

  useEffect(() => {
    async function fetchRacks() {
      const { data: rl } = await supabase
        .from('rack_layers')
        .select('id, layer_code, layer_number, racks(rack_code, rack_name)')
        .limit(150)
      if (rl) setRacks(rl)
    }
    fetchRacks()
  }, [supabase])

  const handleMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      // 1. Update current_rack_layer_id
      const { error: err1 } = await supabase
        .from('equipment')
        .update({
          current_rack_layer_id: targetRackLayerId || null
        })
        .eq('equipment_id', data.equipment_id)

      if (err1) throw err1

      // 2. Insert into equipment_movements
      await (supabase as any).from('equipment_movements').insert({
        equipment_id: data.equipment_id,
        movement_type: 'RELOCATION',
        rack_layer_id: targetRackLayerId || null,
        moved_at: new Date().toISOString().slice(0, 10),
        notes: notes || `Thay đổi tầng kệ từ [${currentRackText}] sang vị trí mới`
      })

      setMsg('✅ 保管棚・段位置を移動しました！')
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
    <form onSubmit={handleMoveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
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

      {/* Current location */}
      <div style={{ padding: 10, background: 'var(--bg-surface-2)', borderRadius: 6, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-muted)' }}>現在位置 (Vị trí hiện tại):</span>
        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>📍 {currentRackText}</span>
      </div>

      {/* Target rack layer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          移動先保管棚・段 (Vị trí kệ mới):
        </label>
        <select
          className="form-input"
          value={targetRackLayerId}
          onChange={e => setTargetRackLayerId(e.target.value)}
          required
        >
          <option value="">-- 保管棚を選択 (Chọn tầng kệ) --</option>
          {racks.map(r => (
            <option key={r.id} value={r.id}>
              📍 Kệ {r.racks?.rack_code || '—'} - Tầng {r.layer_code || r.layer_number || '0'}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          移動理由・メモ (Lý do di chuyển):
        </label>
        <textarea
          className="form-textarea"
          rows={2}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="VD: Chuyển sang kệ 71-1 để bảo dưỡng định kỳ..."
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12 }}>
          閉じる (Đóng)
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ fontSize: 12 }}>
          {loading ? <Loader2 className="animate-spin" size={14} /> : '位置変更を実行 (Xác nhận)'}
        </button>
      </div>
    </form>
  )
}
