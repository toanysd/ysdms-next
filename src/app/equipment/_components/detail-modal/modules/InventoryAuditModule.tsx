'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ClipboardCheck, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { EquipmentDetailData } from '../types'
import { formatRackLocationDisplay } from '@/lib/utils/moldNaming'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
  onSuccess: () => void
}

export default function InventoryAuditModule({ data, onClose, onSuccess }: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [auditResult, setAuditResult] = useState<'MATCH' | 'RELOCATED' | 'MISSING'>('MATCH')
  const [auditNotes, setAuditNotes] = useState('')

  const rackText = formatRackLocationDisplay(data.rack_layers)
  const keeperName = data.keeper_company?.company_name || 'YSD (社内)'

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    try {
      const today = new Date().toISOString().slice(0, 10)
      const { error: err1 } = await supabase
        .from('equipment')
        .update({
          on_checklist: true
        })
        .eq('equipment_id', data.equipment_id)

      if (err1) throw err1

      // Log into equipment_history
      await supabase.from('equipment_history').insert({
        equipment_id: data.equipment_id,
        action_type: 'MAINTENANCE',
        action_date: today,
        description: `[棚卸実査] Kết quả: ${auditResult}. ${auditNotes || 'Đã kiểm tra vị trí thực tế'}`
      })

      setMsg('✅ 棚卸実査を完了として記録しました！')
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
    <form onSubmit={handleAuditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
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

      {/* Current Recorded Location Info */}
      <div
        className="card-flat"
        style={{
          padding: 10, background: 'var(--bg-surface-2)', borderRadius: 6,
          display: 'flex', flexDirection: 'column', gap: 4
        }}
      >
        <div style={{ fontWeight: 700, color: 'var(--accent)' }}>📌 現在の登録位置情報 (Vị trí hiện tại):</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>保管棚・段:</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>📍 {rackText}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)' }}>保管場所:</span>
          <span style={{ fontWeight: 700 }}>🏢 {keeperName}</span>
        </div>
      </div>

      {/* Audit Status Choice */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          実査結果 (Kết quả đối chiếu thực tế):
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[
            { id: 'MATCH', label: '一致 (Khớp)' },
            { id: 'RELOCATED', label: '異動 (Sai kệ)' },
            { id: 'MISSING', label: '未確認 (Thiếu)' }
          ].map(r => (
            <button
              type="button"
              key={r.id}
              onClick={() => setAuditResult(r.id as any)}
              style={{
                fontSize: 11, fontWeight: auditResult === r.id ? 700 : 500,
                color: auditResult === r.id ? 'var(--tint-teal-text)' : 'var(--text-secondary)',
                background: auditResult === r.id ? 'var(--tint-teal-bg)' : 'var(--bg-surface-2)',
                border: auditResult === r.id ? '1px solid var(--tint-teal-border)' : '1px solid var(--border-default)',
                borderRadius: 6, padding: '6px 4px', cursor: 'pointer'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Notes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          実査メモ (Ghi chú kiểm kê):
        </label>
        <textarea
          className="form-textarea"
          rows={2}
          value={auditNotes}
          onChange={e => setAuditNotes(e.target.value)}
          placeholder="VD: Kiểm kê định kỳ tháng 8, thiết bị nguyên vẹn tại kệ..."
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12 }}>
          閉じる (Đóng)
        </button>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ fontSize: 12 }}>
          {loading ? <Loader2 className="animate-spin" size={14} /> : '✅ 棚卸完了を記録 (Xác nhận)'}
        </button>
      </div>
    </form>
  )
}
