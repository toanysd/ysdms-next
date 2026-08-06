'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Check, Loader2, MapPin, Truck, Sparkles, ClipboardCheck, Printer, Camera, QrCode, Scale, Trash2 } from 'lucide-react'
import { ActionDialogType, EquipmentDetailData } from './types'

interface Props {
  activeAction: ActionDialogType
  onCloseAction: () => void
  data: EquipmentDetailData
  onSuccess: () => void
}

export default function ActionDialogManager({ activeAction, onCloseAction, data, onSuccess }: Props) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [companies, setCompanies] = useState<any[]>([])
  const [racks, setRacks] = useState<any[]>([])

  // Form states
  const [selectedKeeperId, setSelectedKeeperId] = useState<string>(data.keeper_company_id || '')
  const [selectedRackLayerId, setSelectedRackLayerId] = useState<string>(data.current_rack_layer_id || '')
  const [notes, setNotes] = useState('')
  const [actualWeight, setActualWeight] = useState(data.actual_weight || '')
  const [teflonDate, setTeflonDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    if (!activeAction) return
    setMsg(null)
    setLoading(false)

    async function fetchMasterData() {
      // Fetch companies
      const { data: comp } = await supabase.from('companies').select('company_id, company_name, company_code').order('company_code')
      if (comp) setCompanies(comp)

      // Fetch rack layers
      const { data: rl } = await supabase.from('rack_layers').select('id, layer_code, racks(rack_code)').limit(100)
      if (rl) setRacks(rl)
    }

    fetchMasterData()
  }, [activeAction, supabase])

  if (!activeAction) return null

  // Submit Handlers
  const handleCheckInOut = async () => {
    setLoading(true)
    setMsg(null)
    try {
      const isExternal = Boolean(selectedKeeperId)
      const newStatus = isExternal ? 'OUT' : 'IN_STOCK'

      const { error: err1 } = await supabase
        .from('equipment')
        .update({
          keeper_company_id: selectedKeeperId || null,
          usage_status: newStatus,
          returned_date: isExternal ? null : new Date().toISOString().slice(0, 10)
        })
        .eq('equipment_id', data.equipment_id)

      if (err1) throw err1

      // Log movement
      await (supabase as any).from('equipment_movements').insert({
        equipment_id: data.equipment_id,
        movement_type: isExternal ? 'SHIPMENT' : 'RETURN',
        to_company_id: selectedKeeperId || null,
        notes: notes || '入出庫ステータス更新'
      })

      setMsg('✅ 入出庫ステータスを更新しました！')
      setTimeout(() => {
        onSuccess()
        onCloseAction()
      }, 1000)
    } catch (err: any) {
      setMsg(`❌ エラー: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRelocate = async () => {
    setLoading(true)
    setMsg(null)
    try {
      const { error: err1 } = await supabase
        .from('equipment')
        .update({
          current_rack_layer_id: selectedRackLayerId || null
        })
        .eq('equipment_id', data.equipment_id)

      if (err1) throw err1

      setMsg('✅ 保管棚・段位置を移動しました！')
      setTimeout(() => {
        onSuccess()
        onCloseAction()
      }, 1000)
    } catch (err: any) {
      setMsg(`❌ エラー: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleAudit = async () => {
    setLoading(true)
    setMsg(null)
    try {
      const { error: err1 } = await supabase
        .from('equipment')
        .update({
          on_checklist: true
        })
        .eq('equipment_id', data.equipment_id)

      if (err1) throw err1

      setMsg('✅ 棚卸実査を完了として記録しました！')
      setTimeout(() => {
        onSuccess()
        onCloseAction()
      }, 1000)
    } catch (err: any) {
      setMsg(`❌ エラー: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleWeightUpdate = async () => {
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
        onCloseAction()
      }, 1000)
    } catch (err: any) {
      setMsg(`❌ エラー: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleScrap = async () => {
    if (!confirm('⚠️ 本当にこの設備を廃棄（DISPOSED）にしますか？')) return
    setLoading(true)
    setMsg(null)
    try {
      const { error: err1 } = await supabase
        .from('equipment')
        .update({
          usage_status: 'DISPOSED',
          device_status: 'DISPOSED',
          disposed_date: new Date().toISOString().slice(0, 10)
        })
        .eq('equipment_id', data.equipment_id)

      if (err1) throw err1

      setMsg('✅ 設備を廃棄処理しました。')
      setTimeout(() => {
        onSuccess()
        onCloseAction()
      }, 1000)
    } catch (err: any) {
      setMsg(`❌ エラー: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Dialog Titles & Icons
  const dialogConfig: Record<string, { title: string; icon: any }> = {
    CHECKIN_OUT: { title: '入出庫・返却登録 (Check-in / Check-out)', icon: MapPin },
    INVENTORY_AUDIT: { title: '棚卸実査確認 (Inventory Audit)', icon: ClipboardCheck },
    TEFLON_COATING: { title: 'テフロン再加工履歴 (Teflon Coating)', icon: Sparkles },
    PRINT_LABEL: { title: '設備ラベル・QR印刷 (Print Label)', icon: Printer },
    PHOTO_MANAGER: { title: '写真管理 (Photo Manager)', icon: Camera },
    QR_VIEW: { title: 'QRコード表示 (QR Code View)', icon: QrCode },
    RELOCATE: { title: '棚位置変更・返却 (Relocate Rack)', icon: Truck },
    WEIGHT_AUDIT: { title: '実測重量更新 (Weight Audit)', icon: Scale },
    SCRAP_DISPOSAL: { title: '設備廃棄処理 (Scrap / Disposal)', icon: Trash2 }
  }

  const cfg = dialogConfig[activeAction] || { title: 'Thao tác', icon: MapPin }
  const DialogIcon = cfg.icon

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
      }}
      onClick={onCloseAction}
    >
      <div
        className="card-flat"
        style={{
          width: '100%', maxWidth: 520, borderRadius: 10, overflow: 'hidden',
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex', flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Dialog Header */}
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--bg-surface-2)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>
            <DialogIcon size={18} />
            <span>{cfg.title}</span>
          </div>
          <button
            onClick={onCloseAction}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Dialog Body */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
          {msg && (
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                background: msg.includes('❌') ? 'var(--tint-orange-bg)' : 'var(--tint-teal-bg)',
                color: msg.includes('❌') ? 'var(--tint-orange-text)' : 'var(--tint-teal-text)',
                fontWeight: 600
              }}
            >
              {msg}
            </div>
          )}

          {/* CHECKIN / OUT FORM */}
          {activeAction === 'CHECKIN_OUT' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label className="form-label" style={{ fontSize: 11 }}>保管会社 (Công ty giữ thiết bị):</label>
                <select
                  className="form-input"
                  value={selectedKeeperId}
                  onChange={e => setSelectedKeeperId(e.target.value)}
                >
                  <option value="">YSD (社内保管 - Tại kho YSD)</option>
                  {companies.map(c => (
                    <option key={c.company_id} value={c.company_id}>
                      {c.company_name} ({c.company_code})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label className="form-label" style={{ fontSize: 11 }}>メモ / 理由 (Ghi chú / Lý do):</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Lý do xuất nhập kho..."
                />
              </div>

              <button onClick={handleCheckInOut} disabled={loading} className="btn btn-primary" style={{ marginTop: 8 }}>
                {loading ? <Loader2 className="animate-spin" size={14} /> : '更新を実行 (Cập nhật)'}
              </button>
            </>
          )}

          {/* RELOCATE FORM */}
          {activeAction === 'RELOCATE' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label className="form-label" style={{ fontSize: 11 }}>移動先保管棚 (Vị trí tầng kệ mới):</label>
                <select
                  className="form-input"
                  value={selectedRackLayerId}
                  onChange={e => setSelectedRackLayerId(e.target.value)}
                >
                  <option value="">未 chỉ定 (Chưa chỉ định)</option>
                  {racks.map(r => (
                    <option key={r.id} value={r.id}>
                      📍 Kệ {r.racks?.rack_code || '—'} - Tầng {r.layer_code || '0'}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={handleRelocate} disabled={loading} className="btn btn-primary" style={{ marginTop: 8 }}>
                {loading ? <Loader2 className="animate-spin" size={14} /> : '位置変更を保存 (Lưu vị trí mới)'}
              </button>
            </>
          )}

          {/* INVENTORY AUDIT FORM */}
          {activeAction === 'INVENTORY_AUDIT' && (
            <>
              <div>Hiện tại thiết bị <strong>{data.display_name}</strong> đang được ghi nhận tại vị trí. Bấm xác nhận bên dưới để hoàn tất kiểm kê.</div>
              <button onClick={handleAudit} disabled={loading} className="btn btn-primary" style={{ marginTop: 8 }}>
                {loading ? <Loader2 className="animate-spin" size={14} /> : '✅ 棚卸完了を記録 (Xác nhận kiểm kê)'}
              </button>
            </>
          )}

          {/* WEIGHT AUDIT FORM */}
          {activeAction === 'WEIGHT_AUDIT' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label className="form-label" style={{ fontSize: 11 }}>実測重量 (kg):</label>
                <input
                  className="form-input"
                  type="text"
                  value={actualWeight}
                  onChange={e => setActualWeight(e.target.value)}
                  placeholder="VD: 14.3"
                />
              </div>

              <button onClick={handleWeightUpdate} disabled={loading} className="btn btn-primary" style={{ marginTop: 8 }}>
                {loading ? <Loader2 className="animate-spin" size={14} /> : '重量を保存 (Lưu khối lượng)'}
              </button>
            </>
          )}

          {/* SCRAP DISPOSAL FORM */}
          {activeAction === 'SCRAP_DISPOSAL' && (
            <>
              <div style={{ color: 'var(--badge-error-text, #ef4444)', fontWeight: 600 }}>
                ⚠️ Lưu ý: Hành động này sẽ chuyển trạng thái thiết bị thành DISPOSED (Hủy).
              </div>
              <button onClick={handleScrap} disabled={loading} className="btn btn-primary" style={{ background: '#ef4444', borderColor: '#dc2626', marginTop: 8 }}>
                {loading ? <Loader2 className="animate-spin" size={14} /> : '🗑️ 廃棄処理を実行 (Xác nhận hủy)'}
              </button>
            </>
          )}

          {/* PRINT LABEL / QR / PHOTO / TEFLON PLACEHOLDERS */}
          {['PRINT_LABEL', 'QR_VIEW', 'PHOTO_MANAGER', 'TEFLON_COATING'].includes(activeAction) && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-secondary)' }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{cfg.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mã thiết bị: {data.equipment_code}</div>
              <button onClick={onCloseAction} className="btn btn-secondary" style={{ marginTop: 14 }}>
                閉じる (Đóng)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
