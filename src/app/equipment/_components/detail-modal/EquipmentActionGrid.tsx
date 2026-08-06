'use client'

import React from 'react'
import {
  MapPin, ClipboardCheck, Sparkles, Printer, Camera, QrCode,
  Truck, Scale, Trash2
} from 'lucide-react'
import { ActionDialogType } from './types'

interface Props {
  onOpenAction: (type: ActionDialogType) => void
}

export default function EquipmentActionGrid({ onOpenAction }: Props) {
  const actions = [
    {
      id: 'CHECKIN_OUT' as ActionDialogType,
      labelJA: '入出庫',
      labelVI: 'Nhập xuất',
      icon: MapPin,
      bg: 'var(--tint-blue-bg)',
      border: 'var(--tint-blue-border)',
      color: 'var(--tint-blue-text)'
    },
    {
      id: 'INVENTORY_AUDIT' as ActionDialogType,
      labelJA: '棚卸',
      labelVI: 'Kiểm kê',
      icon: ClipboardCheck,
      bg: 'var(--tint-teal-bg)',
      border: 'var(--tint-teal-border)',
      color: 'var(--tint-teal-text)'
    },
    {
      id: 'TEFLON_COATING' as ActionDialogType,
      labelJA: 'テフロン',
      labelVI: 'Mạ Teflon',
      icon: Sparkles,
      bg: 'var(--tint-orange-bg)',
      border: 'var(--tint-orange-border)',
      color: 'var(--tint-orange-text)'
    },
    {
      id: 'PRINT_LABEL' as ActionDialogType,
      labelJA: '印刷',
      labelVI: 'In nhãn',
      icon: Printer,
      bg: 'var(--bg-surface-2)',
      border: 'var(--border-default)',
      color: 'var(--text-primary)'
    },
    {
      id: 'PHOTO_MANAGER' as ActionDialogType,
      labelJA: '写真',
      labelVI: 'Ảnh thiết bị',
      icon: Camera,
      bg: 'var(--tint-purple-bg)',
      border: 'var(--tint-purple-border)',
      color: 'var(--tint-purple-text)'
    },
    {
      id: 'QR_VIEW' as ActionDialogType,
      labelJA: 'QR',
      labelVI: 'Mã QR',
      icon: QrCode,
      bg: 'var(--tint-purple-bg)',
      border: 'var(--tint-purple-border)',
      color: 'var(--tint-purple-text)'
    },
    {
      id: 'RELOCATE' as ActionDialogType,
      labelJA: '移動・返却',
      labelVI: 'Di chuyển / Trả',
      icon: Truck,
      bg: 'var(--tint-orange-bg)',
      border: 'var(--tint-orange-border)',
      color: 'var(--tint-orange-text)'
    },
    {
      id: 'WEIGHT_AUDIT' as ActionDialogType,
      labelJA: '重量',
      labelVI: 'Khối lượng',
      icon: Scale,
      bg: 'var(--tint-teal-bg)',
      border: 'var(--tint-teal-border)',
      color: 'var(--tint-teal-text)'
    },
    {
      id: 'SCRAP_DISPOSAL' as ActionDialogType,
      labelJA: '廃棄',
      labelVI: 'Hủy khuôn',
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
        ⚡ 操作・リンク (Thao tác & Chức năng Realtime)
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
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
              <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.1 }}>{act.labelJA}</div>
              <div style={{ fontSize: 9, opacity: 0.8, fontWeight: 500 }}>{act.labelVI}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
