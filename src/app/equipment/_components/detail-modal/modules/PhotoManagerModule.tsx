'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { EquipmentDetailData } from '../types'
import { EquipmentPhotoGallery } from '@/components/equipment/EquipmentPhotoGallery'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
}

export default function PhotoManagerModule({ data, onClose }: Props) {
  const equipId = data.equipment_id || (data as any).id || ''
  const equipCode = data.equipment_code || data.display_name || ''
  // Rule 3 Global: Default Blur ON for media privacy shield
  const [blurEnabled, setBlurEnabled] = useState<boolean>(true)

  return (
    <div
      className={blurEnabled ? 'ysd-photo-privacy-shield-active' : 'ysd-photo-privacy-shield-off'}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', gap: 8 }}
    >
      <style>{`
        .ysd-photo-privacy-shield-active img {
          filter: blur(12px);
          transition: filter 0.2s ease, transform 0.2s ease;
        }
        .ysd-photo-privacy-shield-active img:hover {
          filter: blur(0px);
        }
        .ysd-photo-privacy-shield-active [style*="z-index: 99999"] img {
          filter: blur(0px);
        }
      `}</style>

      {/* Privacy Blur Shield Control Bar */}
      <div
        className="card-flat"
        style={{
          padding: '6px 12px',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          fontSize: 11
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
          <Shield size={14} style={{ color: blurEnabled ? 'var(--accent)' : 'var(--text-muted)' }} />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            Privacy Shield ({blurEnabled ? 'ON: ぼかし中' : 'OFF: クリア表示'})
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            — {blurEnabled ? 'Mặc định làm mờ (Rê chuột vào ảnh hoặc mở Popup để xem rõ)' : 'Đang hiển thị rõ toàn bộ ảnh'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={blurEnabled}
              onChange={(e) => setBlurEnabled(e.target.checked)}
            />
            <span>Default Blur</span>
          </label>
          <button
            type="button"
            onClick={() => setBlurEnabled((prev) => !prev)}
            className="btn btn-secondary"
            style={{ fontSize: 11, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {blurEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
            <span>{blurEnabled ? 'Toggle Blur: Hiện rõ (Unblur)' : 'Toggle Blur: Làm mờ (Blur)'}</span>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 2px' }}>
        <EquipmentPhotoGallery
          equipmentId={equipId}
          equipmentCode={equipCode}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10, marginTop: 4, borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 14px' }}>
          閉じる (Đóng)
        </button>
      </div>
    </div>
  )
}
