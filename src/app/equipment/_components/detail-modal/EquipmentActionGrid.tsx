'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import {
  MapPin, ClipboardCheck, Sparkles, Printer, Camera, QrCode,
  Truck, Scale, Trash2, ArrowRightLeft
} from 'lucide-react'
import { ActionDialogType } from './types'

interface Props {
  onOpenAction: (type: ActionDialogType) => void
}

export default function EquipmentActionGrid({ onOpenAction }: Props) {
  const t = useTranslations('EquipmentDetailModal')

  const actions: { id: ActionDialogType; label: string; icon: any; bg: string; border: string; color: string }[] = [
    {
      id: 'CHECKIN_OUT',
      label: t('actions.checkInOut'),
      icon: MapPin,
      bg: 'var(--tint-blue-bg)',
      border: 'var(--tint-blue-border)',
      color: 'var(--tint-blue-text)'
    },
    {
      id: 'INVENTORY_AUDIT',
      label: t('actions.inventoryAudit'),
      icon: ClipboardCheck,
      bg: 'var(--tint-teal-bg)',
      border: 'var(--tint-teal-border)',
      color: 'var(--tint-teal-text)'
    },
    {
      id: 'TEFLON_COATING',
      label: t('actions.teflon'),
      icon: Sparkles,
      bg: 'var(--tint-orange-bg)',
      border: 'var(--tint-orange-border)',
      color: 'var(--tint-orange-text)'
    },
    {
      id: 'PRINT_LABEL',
      label: t('actions.print'),
      icon: Printer,
      bg: 'var(--bg-surface-2)',
      border: 'var(--border-default)',
      color: 'var(--text-primary)'
    },
    {
      id: 'PHOTO_MANAGER',
      label: t('actions.photo'),
      icon: Camera,
      bg: 'var(--tint-purple-bg)',
      border: 'var(--tint-purple-border)',
      color: 'var(--tint-purple-text)'
    },
    {
      id: 'QR_VIEW',
      label: t('actions.qr'),
      icon: QrCode,
      bg: 'var(--tint-purple-bg)',
      border: 'var(--tint-purple-border)',
      color: 'var(--tint-purple-text)'
    },
    {
      id: 'TRANSPORT',
      label: t('actions.transport'),
      icon: Truck,
      bg: 'var(--tint-blue-bg)',
      border: 'var(--tint-blue-border)',
      color: 'var(--tint-blue-text)'
    },
    {
      id: 'RACK_MOVE',
      label: t('actions.rackMove'),
      icon: ArrowRightLeft,
      bg: 'var(--tint-orange-bg)',
      border: 'var(--tint-orange-border)',
      color: 'var(--tint-orange-text)'
    },
    {
      id: 'WEIGHT_AUDIT',
      label: t('actions.weight'),
      icon: Scale,
      bg: 'var(--tint-teal-bg)',
      border: 'var(--tint-teal-border)',
      color: 'var(--tint-teal-text)'
    },
    {
      id: 'SCRAP_DISPOSAL',
      label: t('actions.scrap'),
      icon: Trash2,
      bg: 'var(--tint-orange-bg)',
      border: 'var(--tint-orange-border)',
      color: 'var(--badge-error-text, #ef4444)'
    }
  ]

  return (
    <div
      className="card-flat"
      style={{
        padding: 12,
        background: 'var(--bg-surface-2)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--accent)',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 4
        }}
      >
        ⚡ {t('actionGridTitle')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
        {actions.map(act => {
          const Icon = act.icon
          return (
            <button
              key={act.id}
              onClick={() => onOpenAction(act.id)}
              className="btn"
              style={{
                background: act.bg,
                border: `1px solid ${act.border}`,
                color: act.color,
                borderRadius: 8,
                padding: '8px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={18} />
              <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.1 }}>
                {act.label}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
