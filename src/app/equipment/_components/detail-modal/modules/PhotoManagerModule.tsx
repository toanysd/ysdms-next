'use client'

import React, { useState } from 'react'
import { Camera, Upload, Image as ImageIcon, Trash2, CheckCircle2 } from 'lucide-react'
import { EquipmentDetailData } from '../types'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
}

export default function PhotoManagerModule({ data, onClose }: Props) {
  const [photoUrl, setPhotoUrl] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  const handleUploadSimulated = (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('✅ 画像を登録しました！ (Đã tải ảnh lên thành công)')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12 }}>
      {msg && (
        <div style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--tint-teal-bg)', color: 'var(--tint-teal-text)', fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {/* Gallery Carousel Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)' }}>📷 登録済み画像一覧 (Danh sách ảnh hiện có):</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <div style={{ border: '1px solid var(--border-default)', borderRadius: 6, height: 90, background: 'var(--bg-surface-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <ImageIcon size={24} opacity={0.5} />
            <span style={{ fontSize: 9, marginTop: 4 }}>金型正面 (Mặt chính)</span>
          </div>
          <div style={{ border: '1px solid var(--border-default)', borderRadius: 6, height: 90, background: 'var(--bg-surface-2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <ImageIcon size={24} opacity={0.5} />
            <span style={{ fontSize: 9, marginTop: 4 }}>トレイ成形品 (Khay)</span>
          </div>
          <div style={{ border: '1px dashed var(--border-default)', borderRadius: 6, height: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', cursor: 'pointer' }}>
            <Upload size={20} />
            <span style={{ fontSize: 9, marginTop: 4 }}>+ 写真を追加</span>
          </div>
        </div>
      </div>

      {/* Upload Input */}
      <form onSubmit={handleUploadSimulated} style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
        <label className="form-label" style={{ fontSize: 11, fontWeight: 700 }}>
          URL指定 または ファイル選択 (Tải ảnh mới):
        </label>
        <input
          type="file"
          accept="image/*"
          className="form-input"
          style={{ fontSize: 11 }}
        />
        <button type="submit" className="btn btn-primary" style={{ fontSize: 12, marginTop: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Upload size={14} />
          <span>画像をアップロード (Upload Ảnh)</span>
        </button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12 }}>
          閉じる (Đóng)
        </button>
      </div>
    </div>
  )
}
