'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, RefreshCw, AlertCircle } from 'lucide-react'
import { revisePhysicalMoldAction } from '@/app/actions/mold-revise'
import type { MoldDetailData } from './page'

type DesignRevision = {
  revision_id: string
  design_code: string
  revision_number: number | null
}

type Props = {
  mold: MoldDetailData
  onClose: () => void
  onSuccess: () => void
}

export function ReviseMoldModal({ mold, onClose, onSuccess }: Props) {
  const supabase = createClient()
  const productId = mold.mold_revisions?.product_id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [designRevisions, setDesignRevisions] = useState<DesignRevision[]>([])

  // Form State
  const [selectedDesignId, setSelectedDesignId] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>(mold.display_name)
  const [notes, setNotes] = useState<string>('')

  const loadDesigns = useCallback(async () => {
    if (!productId) {
        setError('製品が見つかりません。/ Không tìm thấy sản phẩm.')
        setLoading(false)
        return
    }

    try {
      const { data } = await supabase
        .from('design_revisions')
        .select('revision_id, design_code, revision_number')
        .eq('product_id', productId)
        .order('revision_number', { ascending: false })
      
      if (data) setDesignRevisions(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [productId, supabase])

  useEffect(() => {
    loadDesigns()
  }, [loadDesigns])

  // Automatically suggest a new name when design is selected
  useEffect(() => {
    if (selectedDesignId) {
        const d = designRevisions.find(x => x.revision_id === selectedDesignId)
        if (d) {
            setDisplayName(`${mold.mold_revisions?.products?.product_code || 'Khuôn'} - R${d.revision_number}`)
        }
    }
  }, [selectedDesignId, designRevisions, mold])

  const handleSave = async () => {
    setError(null)
    if (!selectedDesignId) {
        setError('新しい設計版を選択してください。/ Vui lòng chọn phiên bản thiết kế mới.')
        return
    }
    if (!displayName) {
        setError('新しい金型名を入力してください。/ Vui lòng nhập tên khuôn mới.')
        return
    }

    setSaving(true)
    try {
      const result = await revisePhysicalMoldAction({
        physical_mold_id: mold.physical_mold_id,
        new_design_revision_id: selectedDesignId,
        new_display_name: displayName,
        notes
      })

      if (result.success) {
        onSuccess()
      } else {
        setError(result.error || 'Update failed.')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-[450px]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <div className="flex items-center gap-2">
            <RefreshCw size={16} style={{ color: 'var(--accent)' }} />
            <h3 className="m-0 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              金型のリビジョン更新 <span className="text-[11px] font-normal" style={{ color: 'var(--text-muted)' }}>/ Cập nhật phiên bản Khuôn vật lý</span>
            </h3>
          </div>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer" style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-3">
          {error && (
            <div className="px-3 py-2 text-xs rounded flex items-center gap-1.5" style={{ background: 'var(--bg-error)', color: 'var(--status-error)' }}>
                <AlertCircle size={14} />
                {error}
            </div>
          )}

          {loading ? (
            <div className="text-center p-5 text-xs" style={{ color: 'var(--text-muted)' }}>
                データを読み込み中... / Đang tải dữ liệu...
            </div>
          ) : (
            <>
              {/* Current Status */}
              <div className="px-3 py-2 rounded text-xs" style={{ background: 'var(--bg-surface-2)' }}>
                  <div style={{ color: 'var(--text-secondary)' }}>現在の設計 / Thiết kế hiện tại:</div>
                  <div className="font-semibold">{mold.mold_revisions?.revision_code || 'N/A'}</div>
                  <div className="mt-1" style={{ color: 'var(--text-secondary)' }}>現在の金型名 / Tên khuôn hiện tại:</div>
                  <div className="font-semibold">{mold.display_name}</div>
              </div>

              {/* Design Revision */}
              <div>
                <label className="block text-[11px] font-semibold mb-1">
                    新しい設計版 / Phiên bản thiết kế mới <span className="text-red-500">*</span>
                </label>
                <select 
                    className="form-select" 
                    value={selectedDesignId} 
                    onChange={e => setSelectedDesignId(e.target.value)}
                >
                  <option value="">-- 選択 / Chọn --</option>
                  {designRevisions.map(d => (
                    <option key={d.revision_id} value={d.revision_id}>
                      {d.design_code} (Rev {d.revision_number})
                    </option>
                  ))}
                </select>
              </div>

              {/* New Display Name */}
              <div>
                <label className="block text-[11px] font-semibold mb-1">
                    新しい金型名 / Tên khuôn mới <span className="text-red-500">*</span>
                </label>
                <input 
                    type="text" 
                    className="form-input" 
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-semibold mb-1">
                    更新理由・備考 / Lý do / Ghi chú
                </label>
                <textarea 
                    className="form-textarea" 
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="例：設変による金型改修 / Vd: Sửa khuôn theo thay đổi thiết kế"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-3 border-t" style={{ borderColor: 'var(--border-default)' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>キャンセル / Hủy</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || loading}>
            {saving ? '保存中...' : '更新 / Cập nhật'}
          </button>
        </div>
      </div>
    </div>
  )
}
