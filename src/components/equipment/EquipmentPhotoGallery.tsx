'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Camera, Image as ImageIcon, Trash2, Edit2, Check, X, ExternalLink,
  ChevronLeft, ChevronRight, ZoomIn, Plus, RefreshCw, AlertCircle
} from 'lucide-react'
import {
  getEquipmentPhotos, deleteEquipmentPhoto, updateEquipmentPhoto,
  EquipmentPhotoRecord, PhotoType
} from '@/lib/storage/EquipmentPhotoStore'
import { EquipmentPhotoUploader } from './EquipmentPhotoUploader'

interface EquipmentPhotoGalleryProps {
  equipmentId: string
  equipmentCode?: string
  readOnly?: boolean
}

const TYPE_BADGES: Record<PhotoType, { label: string; color: string; bg: string }> = {
  OVERVIEW: { label: '全体', color: '#047857', bg: 'color-mix(in srgb, #10B981 15%, transparent)' },
  DETAIL: { label: '刻印/詳細', color: '#0369a1', bg: 'color-mix(in srgb, #0ea5e9 15%, transparent)' },
  DAMAGE: { label: '損傷/摩耗', color: '#b91c1c', bg: 'color-mix(in srgb, #ef4444 15%, transparent)' },
  MAINTENANCE: { label: 'メンテ', color: '#b45309', bg: 'color-mix(in srgb, #f59e0b 15%, transparent)' },
  DOCUMENT: { label: '工程票/図面', color: '#6d28d9', bg: 'color-mix(in srgb, #8b5cf6 15%, transparent)' },
  OTHER: { label: 'その他', color: '#475569', bg: 'color-mix(in srgb, #64748b 15%, transparent)' },
}

export function EquipmentPhotoGallery({
  equipmentId,
  equipmentCode,
  readOnly = false
}: EquipmentPhotoGalleryProps) {
  const [photos, setPhotos] = useState<EquipmentPhotoRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showUploader, setShowUploader] = useState(false)
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null)
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadPhotos = useCallback(async () => {
    if (!equipmentId) return
    setLoading(true)
    try {
      const data = await getEquipmentPhotos(equipmentId)
      setPhotos(data)
    } catch (err) {
      console.error('Error loading equipment photos:', err)
    } finally {
      setLoading(false)
    }
  }, [equipmentId])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  const handleDelete = async (photo: EquipmentPhotoRecord, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('この写真を削除してもよろしいですか？ (Bạn có chắc muốn xóa ảnh này?)')) return

    setDeletingId(photo.photo_id)
    try {
      await deleteEquipmentPhoto(photo.photo_id, photo.storage_path)
      setPhotos((prev) => prev.filter((p) => p.photo_id !== photo.photo_id))
      if (activeLightboxIndex !== null) {
        setActiveLightboxIndex(null)
      }
    } catch (err) {
      console.error('Error deleting photo:', err)
      alert('写真の削除に失敗しました')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSaveCaption = async (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await updateEquipmentPhoto(photoId, { caption: editCaption })
      setPhotos((prev) =>
        prev.map((p) => (p.photo_id === photoId ? { ...p, caption: editCaption } : p))
      )
      setEditingPhotoId(null)
    } catch (err) {
      console.error('Error updating caption:', err)
    }
  }

  const currentLightboxPhoto = activeLightboxIndex !== null ? photos[activeLightboxIndex] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ImageIcon size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
            設備・金型写真 ({photos.length} 枚)
          </span>
        </div>

        {!readOnly && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              onClick={() => setShowUploader(!showUploader)}
              className="btn btn-primary"
              style={{ fontSize: 11, padding: '2px 8px', height: 24, gap: 4 }}
            >
              <Camera size={12} />
              <span>{showUploader ? '閉じる' : '📷 写真を追加'}</span>
            </button>
            <button
              type="button"
              onClick={loadPhotos}
              className="btn btn-secondary"
              style={{ fontSize: 11, padding: '2px 6px', height: 24 }}
              title="再読込"
            >
              <RefreshCw size={11} />
            </button>
          </div>
        )}
      </div>

      {/* Uploader section */}
      {showUploader && !readOnly && (
        <EquipmentPhotoUploader
          equipmentId={equipmentId}
          onUploadSuccess={(newPhoto) => {
            setPhotos((prev) => [newPhoto, ...prev])
            setShowUploader(false)
          }}
          onCancel={() => setShowUploader(false)}
        />
      )}

      {/* Gallery Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 12 }}>
          写真を読み込み中...
        </div>
      ) : photos.length === 0 ? (
        <div
          className="card-flat"
          style={{
            textAlign: 'center',
            padding: '24px 16px',
            color: 'var(--text-muted)',
            fontSize: 11,
            background: 'var(--bg-surface-2)',
            borderRadius: 6
          }}
        >
          <Camera size={28} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
          <span>写真がまだ登録されていません</span>
          {!readOnly && !showUploader && (
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setShowUploader(true)}
                className="btn btn-secondary"
                style={{ fontSize: 11, padding: '3px 10px', margin: 'auto' }}
              >
                + 写真を撮影・追加する
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: 8
          }}
        >
          {photos.map((photo, index) => {
            const badge = TYPE_BADGES[photo.photo_type] || TYPE_BADGES.OTHER

            return (
              <div
                key={photo.photo_id}
                onClick={() => setActiveLightboxIndex(index)}
                className="card-flat"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: 0,
                  borderRadius: 6,
                  border: '1px solid var(--border-default)',
                  background: '#000',
                  aspectRatio: '4/3',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Image */}
                <img
                  src={photo.public_url}
                  alt={photo.caption || photo.file_name || 'Equipment Photo'}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Type Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    left: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: 3,
                    background: badge.bg,
                    color: badge.color,
                    backdropFilter: 'blur(4px)',
                    zIndex: 2
                  }}
                >
                  {badge.label}
                </div>

                {/* Caption overlay if exists */}
                {photo.caption && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                      color: '#fff',
                      padding: '8px 6px 4px',
                      fontSize: 10,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      zIndex: 2
                    }}
                  >
                    {photo.caption}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {currentLightboxPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: 16
          }}
          onClick={() => setActiveLightboxIndex(null)}
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#fff',
                marginBottom: 8,
                fontSize: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>
                  {equipmentCode || '設備写真'}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    padding: '2px 6px',
                    borderRadius: 3,
                    background: (TYPE_BADGES[currentLightboxPhoto.photo_type] || TYPE_BADGES.OTHER).bg,
                    color: (TYPE_BADGES[currentLightboxPhoto.photo_type] || TYPE_BADGES.OTHER).color
                  }}
                >
                  {(TYPE_BADGES[currentLightboxPhoto.photo_type] || TYPE_BADGES.OTHER).label}
                </span>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  ({activeLightboxIndex! + 1} / {photos.length}) — {currentLightboxPhoto.taken_at?.slice(0, 10)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <a
                  href={currentLightboxPhoto.public_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontSize: 11 }}
                  title="原寸大で開く"
                >
                  <ExternalLink size={14} />
                  <span>原寸</span>
                </a>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={(e) => handleDelete(currentLightboxPhoto, e)}
                    disabled={deletingId === currentLightboxPhoto.photo_id}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid #ef4444',
                      color: '#f87171',
                      padding: '3px 8px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 11,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Trash2 size={13} />
                    <span>削除</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveLightboxIndex(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: 4
                  }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Main Photo Display */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={currentLightboxPhoto.public_url}
                alt={currentLightboxPhoto.caption || 'Equipment Full Photo'}
                style={{
                  maxWidth: '85vw',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  borderRadius: 6,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              />

              {/* Prev / Next Arrows */}
              {photos.length > 1 && (
                <React.Fragment>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : photos.length - 1))
                    }
                    style={{
                      position: 'absolute',
                      left: -40,
                      background: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveLightboxIndex((prev) => (prev! < photos.length - 1 ? prev! + 1 : 0))
                    }
                    style={{
                      position: 'absolute',
                      right: -40,
                      background: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <ChevronRight size={24} />
                  </button>
                </React.Fragment>
              )}
            </div>

            {/* Bottom Caption & Edit */}
            <div
              style={{
                width: '100%',
                marginTop: 10,
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '8px 14px',
                borderRadius: 6,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 12
              }}
            >
              {editingPhotoId === currentLightboxPhoto.photo_id ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <input
                    type="text"
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    placeholder="説明・備考を入力..."
                    className="form-input"
                    style={{ flex: 1, fontSize: 12, height: 26, background: '#1e293b', color: '#fff', borderColor: '#475569' }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={(e) => handleSaveCaption(currentLightboxPhoto.photo_id, e)}
                    style={{ background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontSize: 11 }}
                  >
                    <Check size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPhotoId(null)}
                    style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ color: currentLightboxPhoto.caption ? '#f1f5f9' : '#94a3b8', fontStyle: currentLightboxPhoto.caption ? 'normal' : 'italic' }}>
                    {currentLightboxPhoto.caption || '説明なし (Chưa có chú thích)'}
                  </span>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPhotoId(currentLightboxPhoto.photo_id)
                        setEditCaption(currentLightboxPhoto.caption || '')
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11
                      }}
                    >
                      <Edit2 size={12} />
                      <span>編集</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
