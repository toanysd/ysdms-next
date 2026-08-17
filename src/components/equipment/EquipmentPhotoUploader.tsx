'use client'

import React, { useState, useRef } from 'react'
import { Camera, Upload, X, AlertCircle, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react'
import { uploadEquipmentPhoto, PhotoType, EquipmentPhotoRecord } from '@/lib/storage/EquipmentPhotoStore'

interface EquipmentPhotoUploaderProps {
  equipmentId: string
  onUploadSuccess?: (photo: EquipmentPhotoRecord) => void
  onCancel?: () => void
}

const PHOTO_TYPES: Array<{ value: PhotoType; labelJA: string; labelVI: string }> = [
  { value: 'OVERVIEW', labelJA: '全体写真 (Toàn cảnh)', labelVI: 'Toàn cảnh' },
  { value: 'DETAIL', labelJA: '詳細・刻印 (Chi tiết/Khắc chữ)', labelVI: 'Chi tiết / Khắc chữ' },
  { value: 'DAMAGE', labelJA: '損傷・摩耗 (Hư hỏng/Hao mòn)', labelVI: 'Hư hỏng / Mòn' },
  { value: 'MAINTENANCE', labelJA: 'メンテ・補修 (Bảo dưỡng)', labelVI: 'Bảo dưỡng' },
  { value: 'DOCUMENT', labelJA: '工程票・図面 (Phiếu/Bản vẽ)', labelVI: 'Phiếu / Bản vẽ' },
  { value: 'OTHER', labelJA: 'その他 (Khác)', labelVI: 'Khác' },
]

export function EquipmentPhotoUploader({
  equipmentId,
  onUploadSuccess,
  onCancel
}: EquipmentPhotoUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [photoType, setPhotoType] = useState<PhotoType>('OVERVIEW')
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('画像ファイル (JPEG, PNG, WebP) を選択してください')
      return
    }
    setError(null)
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !equipmentId) return

    setUploading(true)
    setError(null)

    try {
      const uploaded = await uploadEquipmentPhoto({
        equipmentId,
        file: selectedFile,
        photoType,
        caption
      })

      // Reset
      setSelectedFile(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
      setCaption('')

      if (onUploadSuccess) {
        onUploadSuccess(uploaded)
      }
    } catch (err: any) {
      setError(err.message || '写真のアップロードに失敗しました')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="card-flat" style={{ padding: 14, background: 'var(--bg-surface-2)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
      {/* Hidden Inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0])
          }
        }}
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/heic"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0])
          }
        }}
      />

      {error && (
        <div style={{
          padding: '8px 12px',
          borderRadius: 6,
          background: 'var(--tint-error-bg, #fee2e2)',
          color: 'var(--status-error, #b91c1c)',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 10
        }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragOver ? 'var(--accent)' : 'var(--border-default)'}`,
            borderRadius: 8,
            padding: '24px 16px',
            textAlign: 'center',
            background: isDragOver ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : 'var(--bg-surface)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
            <button
              type="button"
              className="btn btn-primary"
              style={{ fontSize: 12, padding: '6px 14px', gap: 6 }}
              onClick={(e) => {
                e.stopPropagation()
                cameraInputRef.current?.click()
              }}
            >
              <Camera size={16} />
              <span>📷 カメラで撮影 (Chụp ảnh)</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: '6px 14px', gap: 6 }}
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              <Upload size={16} />
              <span>📁 ファイルを選択 (Chọn ảnh)</span>
            </button>
          </div>

          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>
            ドラッグ＆ドロップまたはクリックして写真を追加 (Max 10MB, Tự động nén Canvas)
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            {/* Preview Thumbnail */}
            {previewUrl && (
              <div style={{
                position: 'relative',
                width: 110,
                height: 110,
                borderRadius: 6,
                overflow: 'hidden',
                border: '1px solid var(--border-default)',
                flexShrink: 0,
                background: '#000'
              }}>
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    if (previewUrl) URL.revokeObjectURL(previewUrl)
                    setPreviewUrl(null)
                  }}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {/* Photo Metadata Form */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>
                    写真種別 (Loại ảnh)
                  </label>
                  <select
                    value={photoType}
                    onChange={(e) => setPhotoType(e.target.value as PhotoType)}
                    className="form-input"
                    style={{ fontSize: 12, height: 28 }}
                  >
                    {PHOTO_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.labelJA}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 2 }}>
                    備考・説明 (Chú thích)
                  </label>
                  <input
                    type="text"
                    placeholder="例: 上型刻印確認, 刃先摩耗チェック..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="form-input"
                    style={{ fontSize: 12, height: 28 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={uploading}
                    className="btn btn-secondary"
                    style={{ fontSize: 11, height: 26, padding: '0 10px' }}
                  >
                    キャンセル
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn btn-primary"
                  style={{ fontSize: 11, height: 26, padding: '0 12px', gap: 4 }}
                >
                  {uploading ? (
                    <React.Fragment>
                      <Loader2 size={12} className="animate-spin" />
                      <span>圧縮・アップロード中...</span>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Upload size={12} />
                      <span>アップロード (Lưu ảnh)</span>
                    </React.Fragment>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
