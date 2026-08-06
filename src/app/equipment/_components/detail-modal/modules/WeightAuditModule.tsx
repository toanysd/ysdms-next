'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Scale, Loader2 } from 'lucide-react'
import { EquipmentDetailData } from '../types'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
  onSuccess: () => void
}

export default function WeightAuditModule({ data, onClose, onSuccess }: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [actualWeight, setActualWeight] = useState(data.actual_weight || '')
  const designWeight = data.design_revisions?.design_weight || '—'

  const handleWeightSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      const { error: err1 } = await supabase
        .from('equipment')
        .update({
          actual_weight: actualWeight
        })
        .eq('equipment_id', data.equipment_id)

      if (err1) throw err1

      setMsg('✅ 実測重量を更新しました！')
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
    <form onSubmit={handleWeightSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
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

      {/* Design vs Actual comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 10, background: 'var(--bg-surface-2)', borderRadius: 6 }}>
        <div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>設計重量 (Bản vẽ):</span>
          <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14 }}>{designWeight}</div>
        </div>
        <div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>現在の登録重量 (Hiện tại):</span>
          <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: 'var(--accent)' }}>
            {data.actual_weight ? `${data.actual_weight} kg` : '—'}
          </div>
        </div>
      </div>

      {/* New weight input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          実測重量 (Khối lượng cân thực tế kg):
        </label>
        <input
          type="text"
          className="form-input"
          value={actualWeight}
          onChange={e => setActualWeight(e.target.value)}
          placeholder="VD: 14.3"
          required
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12 }}>
          閉じる (Đóng)
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ fontSize: 12 }}>
          {loading ? <Loader2 className="animate-spin" size={14} /> : '重量を保存 (Lưu khối lượng)'}
        </button>
      </div>
    </form>
  )
}
