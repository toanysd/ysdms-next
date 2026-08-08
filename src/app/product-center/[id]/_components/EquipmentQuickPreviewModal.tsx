'use client'

import React from 'react'
import EquipmentDetailModal from '@/app/equipment/_components/detail-modal/EquipmentDetailModal'

export type QuickPreviewItem =
  | { type: 'mold'; data: any }
  | { type: 'cutter'; data: any }
  | { type: 'equip'; data: any }

interface Props {
  isOpen: boolean
  onClose: () => void
  item: QuickPreviewItem | null
}

export default function EquipmentQuickPreviewModal({ isOpen, onClose, item }: Props) {
  if (!isOpen || !item) return null

  const equipId = item.type === 'mold'
    ? (item.data.equipment_id || item.data.physical_mold_id)
    : item.type === 'cutter'
    ? (item.data.equipment_id || item.data.cutter_id)
    : item.data.equipment_id

  // Explicitly inject correct equipment_type so EquipmentDetailModal recognizes cutter vs mold
  const normalizedInitialData = {
    ...item.data,
    equipment_type: item.type === 'cutter'
      ? 'CUTTER'
      : item.type === 'mold'
      ? 'MOLD'
      : (item.data.equipment_type || 'EQUIPMENT')
  }

  return (
    <EquipmentDetailModal
      isOpen={isOpen}
      onClose={onClose}
      equipmentId={equipId}
      initialData={normalizedInitialData}
    />
  )
}
