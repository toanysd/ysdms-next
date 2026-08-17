'use client'

import React from 'react'
import { EquipmentDetailData } from '../types'
import { EquipmentPhotoGallery } from '@/components/equipment/EquipmentPhotoGallery'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
}

export default function PhotoManagerModule({ data, onClose }: Props) {
  const equipId = data.equipment_id || (data as any).id || ''
  const equipCode = data.equipment_code || data.display_name || ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 2px' }}>
        <EquipmentPhotoGallery
          equipmentId={equipId}
          equipmentCode={equipCode}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 10, marginTop: 10, borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12, padding: '4px 14px' }}>
          閉じる (Đóng)
        </button>
      </div>
    </div>
  )
}
