'use client'

import React, { useState, useEffect } from 'react'
import { X, Wrench, Save, Loader2, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'

export type EquipmentEditData = {
  equipment_id: string
  equipment_code: string | null
  display_name: string | null
  equipment_type: string | null
  sub_type?: string | null
  mold_type?: string | null
  device_status: string | null
  usage_status: string | null
  piece_count?: number | null
  actual_length_mm?: string | number | null
  actual_width_mm?: string | number | null
  actual_height_mm?: string | number | null
  actual_weight?: string | number | null
  manufacturing_date?: string | null
  keeper_company_id?: string | null
}

interface EditEquipmentModalProps {
  isOpen: boolean
  equipment: EquipmentEditData | null
  onClose: () => void
  onSuccess: () => void
}

export function EditEquipmentModal({
  isOpen,
  equipment,
  onClose,
  onSuccess
}: EditEquipmentModalProps) {
  const tCommon = useTranslations('Common')
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [companies, setCompanies] = useState<Array<{ company_id: string; company_code: string; company_name: string }>>([])

  const [formData, setFormData] = useState({
    equipment_code: '',
    display_name: '',
    equipment_type: 'MOLD',
    sub_type: '',
    device_status: 'NORMAL',
    usage_status: 'IN_STOCK',
    piece_count: '',
    actual_length_mm: '',
    actual_width_mm: '',
    actual_height_mm: '',
    actual_weight: '',
    manufacturing_date: '',
    keeper_company_id: ''
  })

  useEffect(() => {
    async function loadCompanies() {
      const { data } = await supabase
        .from('companies')
        .select('company_id, company_code, company_name')
        .order('company_code', { ascending: true })
      if (data) setCompanies(data)
    }
    if (isOpen) loadCompanies()
  }, [isOpen, supabase])

  useEffect(() => {
    if (!isOpen || !equipment) return
    setError(null)
    setFormData({
      equipment_code: equipment.equipment_code || '',
      display_name: equipment.display_name || '',
      equipment_type: equipment.equipment_type || 'MOLD',
      sub_type: equipment.sub_type || equipment.mold_type || '',
      device_status: equipment.device_status || 'NORMAL',
      usage_status: equipment.usage_status || 'IN_STOCK',
      piece_count: equipment.piece_count != null ? String(equipment.piece_count) : '',
      actual_length_mm: equipment.actual_length_mm != null ? String(equipment.actual_length_mm) : '',
      actual_width_mm: equipment.actual_width_mm != null ? String(equipment.actual_width_mm) : '',
      actual_height_mm: equipment.actual_height_mm != null ? String(equipment.actual_height_mm) : '',
      actual_weight: equipment.actual_weight != null ? String(equipment.actual_weight) : '',
      manufacturing_date: equipment.manufacturing_date || '',
      keeper_company_id: equipment.keeper_company_id || ''
    })
  }, [isOpen, equipment])

  if (!isOpen || !equipment) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.equipment_code.trim()) {
      setError('設備コードは必須です (Equipment Code is required)')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: updateErr } = await supabase
        .from('equipment')
        .update({
          equipment_code: formData.equipment_code.trim(),
          display_name: formData.display_name.trim() || formData.equipment_code.trim(),
          equipment_type: formData.equipment_type,
          sub_type: formData.sub_type.trim() || null,
          mold_type: formData.sub_type.trim() || null,
          device_status: formData.device_status,
          usage_status: formData.usage_status,
          piece_count: formData.piece_count ? parseInt(formData.piece_count, 10) : null,
          actual_length_mm: formData.actual_length_mm.trim() || null,
          actual_width_mm: formData.actual_width_mm.trim() || null,
          actual_height_mm: formData.actual_height_mm.trim() || null,
          actual_weight: formData.actual_weight.trim() || null,
          manufacturing_date: formData.manufacturing_date || null,
          keeper_company_id: formData.keeper_company_id || null
        })
        .eq('equipment_id', equipment.equipment_id)

      if (updateErr) throw new Error(updateErr.message)

      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.message || '設備情報の更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="card-flat"
        style={{
          width: '100%', maxWidth: 680, maxHeight: '90vh',
          background: 'var(--bg-surface)', borderRadius: 10,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)', overflow: 'hidden',
          display: 'flex', flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderBottom: '1px solid var(--border-default)',
            background: 'var(--tint-orange-bg, var(--bg-surface-2))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Wrench size={18} style={{ color: 'var(--tint-orange-text)' }} />
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                設備・金型情報編集 (Chỉnh sửa Quy cách Thiết bị/Khuôn)
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {equipment.equipment_code}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div style={{ padding: 20, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div style={{
                padding: '10px 12px', borderRadius: 6, background: '#FEF2F2', border: '1px solid #FECACA',
                color: '#DC2626', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6
              }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-grid-2" style={{ gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  設備コード (Mã thiết bị) <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input font-mono font-bold"
                  value={formData.equipment_code}
                  onChange={(e) => setFormData({ ...formData, equipment_code: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  表示名称 (Tên hiển thị)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  設備種別 (Loại thiết bị)
                </label>
                <select
                  className="form-input"
                  value={formData.equipment_type}
                  onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value })}
                >
                  <option value="MOLD">成形金型 (Mold)</option>
                  <option value="CUTTER_SEPARATE">抜型・別刃 (Separate Cutter)</option>
                  <option value="CUTTER_INLINE">抜型・インライン (Inline Cutter)</option>
                  <option value="WATER_BASE">水冷盤 (Water Base)</option>
                  <option value="PRESSURE_BASE">圧空盤 (Pressure Base)</option>
                  <option value="FRAME">フレーム (Frame)</option>
                  <option value="STACKING">スタッキング (Stacking)</option>
                  <option value="PLUG">木型プラグ (Plug)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  サブ種別 / 仕様 (Phân loại phụ / Mảnh)
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.sub_type}
                  onChange={(e) => setFormData({ ...formData, sub_type: e.target.value })}
                  placeholder="例: 上型, 駒..."
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  運用ステータス (Trạng thái sử dụng)
                </label>
                <select
                  className="form-input"
                  value={formData.usage_status}
                  onChange={(e) => setFormData({ ...formData, usage_status: e.target.value })}
                >
                  <option value="IN_STOCK">保管中 (In Stock)</option>
                  <option value="IN_USE">使用中 (In Use)</option>
                  <option value="LOAN">貸出中 (Loan)</option>
                  <option value="REPAIR">修理/改造中 (Repair)</option>
                  <option value="SCRAPPED">廃棄 (Scrapped)</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  設備状態 (Tình trạng thiết bị)
                </label>
                <select
                  className="form-input"
                  value={formData.device_status}
                  onChange={(e) => setFormData({ ...formData, device_status: e.target.value })}
                >
                  <option value="NORMAL">正常 (Normal)</option>
                  <option value="MAINTENANCE">メンテ要 (Maintenance)</option>
                  <option value="REPAIR">修理要 (Repair Needed)</option>
                  <option value="DISPOSED">廃棄 (Disposed)</option>
                </select>
              </div>
            </div>

            {/* Physical Dimensions Group */}
            <div style={{ background: 'var(--bg-surface-2)', padding: 12, borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 8 }}>
                📏 実測寸法・重量 (Physical Dimensions & Weight)
              </div>
              <div className="form-grid-4" style={{ gap: 8 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 10 }}>実測長 (Length mm)</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    value={formData.actual_length_mm}
                    onChange={(e) => setFormData({ ...formData, actual_length_mm: e.target.value })}
                    placeholder="355"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: 10 }}>実測幅 (Width mm)</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    value={formData.actual_width_mm}
                    onChange={(e) => setFormData({ ...formData, actual_width_mm: e.target.value })}
                    placeholder="270"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: 10 }}>実測高 (Height mm)</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    value={formData.actual_height_mm}
                    onChange={(e) => setFormData({ ...formData, actual_height_mm: e.target.value })}
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: 10 }}>実測重量 (Weight kg)</label>
                  <input
                    type="text"
                    className="form-input font-mono"
                    value={formData.actual_weight}
                    onChange={(e) => setFormData({ ...formData, actual_weight: e.target.value })}
                    placeholder="45.5"
                  />
                </div>
              </div>
            </div>

            <div className="form-grid-2" style={{ gap: 12 }}>
              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  製造年月日 (Ngày sản xuất)
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.manufacturing_date}
                  onChange={(e) => setFormData({ ...formData, manufacturing_date: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  保管会社 / 預かり先 (Đơn vị quản lý giữ)
                </label>
                <select
                  className="form-input"
                  value={formData.keeper_company_id}
                  onChange={(e) => setFormData({ ...formData, keeper_company_id: e.target.value })}
                >
                  <option value="">-- 社内 / 自社保管 --</option>
                  {companies.map(c => (
                    <option key={c.company_id} value={c.company_id}>
                      {c.company_code} - {c.company_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '12px 20px', borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-surface-2)', display: 'flex', justifyContent: 'flex-end', gap: 8
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              {tCommon('cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>{tCommon('save')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
