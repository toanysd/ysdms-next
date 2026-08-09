'use client'

import React from 'react'
import { Box, Crop, Droplets, Gauge, Frame, Layers, Wrench } from 'lucide-react'

export interface EquipmentTypeIconProps {
  type: string | null | undefined
  size?: number
  className?: string
  style?: React.CSSProperties
}

export function getEquipmentTypeTheme(type: string | null | undefined) {
  const tUpper = String(type || '').toUpperCase()

  if (['MOLD', '金型'].includes(tUpper)) {
    return {
      labelJA: '金型',
      labelVI: 'Khuôn',
      color: '#0F766E', // Teal
      bg: 'color-mix(in srgb, #0F766E 12%, transparent)',
      borderColor: '#0F766E40',
      icon: Box,
    }
  }

  if (['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(tUpper)) {
    return {
      labelJA: '抜型',
      labelVI: 'Dao cắt',
      color: '#0284C7', // Sky Blue
      bg: 'color-mix(in srgb, #0284C7 12%, transparent)',
      borderColor: '#0284C740',
      icon: Crop,
    }
  }

  if (tUpper === 'WATER_BASE') {
    return {
      labelJA: '水冷盤',
      labelVI: 'Đế nước',
      color: '#0891B2', // Cyan
      bg: 'color-mix(in srgb, #0891B2 12%, transparent)',
      borderColor: '#0891B240',
      icon: Droplets,
    }
  }

  if (tUpper === 'PRESSURE_BASE') {
    return {
      labelJA: '圧空盤',
      labelVI: 'Đế khí',
      color: '#B45309', // Amber
      bg: 'color-mix(in srgb, #B45309 12%, transparent)',
      borderColor: '#B4530940',
      icon: Gauge,
    }
  }

  if (tUpper === 'FRAME') {
    return {
      labelJA: 'フレーム',
      labelVI: 'Khung',
      color: '#4338CA', // Indigo
      bg: 'color-mix(in srgb, #4338CA 12%, transparent)',
      borderColor: '#4338CA40',
      icon: Frame,
    }
  }

  if (['PLUG', 'STACKING', 'AUXILIARY'].includes(tUpper)) {
    return {
      labelJA: 'プラグ・他',
      labelVI: 'Plug / Khác',
      color: '#047857', // Emerald
      bg: 'color-mix(in srgb, #047857 12%, transparent)',
      borderColor: '#04785740',
      icon: Layers,
    }
  }

  return {
    labelJA: '設備',
    labelVI: 'Thiết bị',
    color: '#64748B', // Slate
    bg: 'color-mix(in srgb, #64748B 12%, transparent)',
    borderColor: '#64748B40',
    icon: Wrench,
  }
}

export function EquipmentTypeIcon({ type, size = 16, className, style }: EquipmentTypeIconProps) {
  const theme = getEquipmentTypeTheme(type)
  const IconComponent = theme.icon

  return (
    <IconComponent
      size={size}
      className={className}
      style={{
        color: theme.color,
        flexShrink: 0,
        ...style,
      }}
    />
  )
}
