'use client'

import React from 'react'
import { Layers, ShieldCheck, Ruler, Cpu, Wrench } from 'lucide-react'
import { EquipmentDetailData } from './types'

interface Props {
  data: EquipmentDetailData
}

export default function AuxiliaryDetailView({ data }: Props) {
  const typeLabelMap: Record<string, { labelJA: string; labelVI: string; color: string; bg: string }> = {
    WATER_BASE: { labelJA: '水冷ベース', labelVI: 'Đế nước làm mát', color: 'var(--tint-blue-text)', bg: 'var(--tint-blue-bg)' },
    PRESSURE_BASE: { labelJA: '圧空ベース', labelVI: 'Đế khí nén', color: 'var(--tint-teal-text)', bg: 'var(--tint-teal-bg)' },
    STACKING: { labelJA: 'スタッキング', labelVI: 'Khung xếp chồng', color: 'var(--tint-purple-text)', bg: 'var(--tint-purple-bg)' },
    FRAME: { labelJA: 'フレーム', labelVI: 'Khung gá', color: 'var(--tint-orange-text)', bg: 'var(--tint-orange-bg)' },
    PLUG: { labelJA: 'プラグ', labelVI: 'Plug ép', color: 'var(--tint-purple-text)', bg: 'var(--tint-purple-bg)' },
    PLATE: { labelJA: '面版', labelVI: 'Tấm gá mặt', color: 'var(--tint-teal-text)', bg: 'var(--tint-teal-bg)' }
  }

  const typeConfig = typeLabelMap[data.equipment_type] || {
    labelJA: data.equipment_type || ' phụ具',
    labelVI: 'Thiết bị phụ trợ',
    color: 'var(--accent)',
    bg: 'var(--tint-teal-bg)'
  }

  const dims = [
    data.actual_length_mm,
    data.actual_width_mm,
    data.actual_height_mm
  ].filter(Boolean).join(' × ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Overview Block */}
      <div
        className="card-flat"
        style={{
          padding: 14,
          background: 'var(--bg-surface-2)',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: typeConfig.color,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 6
          }}
        >
          <Cpu size={15} />
          <span>{typeConfig.labelJA} 仕様 (Thông số {typeConfig.labelVI})</span>
        </div>

        {/* Paper Style Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: 12 }}>
          {/* Code */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Mã thiết bị:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>
              {data.equipment_code}
            </span>
          </div>

          {/* Name */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Tên hiển thị:
            </span>
            <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
              {data.display_name}
            </span>
          </div>

          {/* Type Badge */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Phân loại:
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 4,
                background: typeConfig.bg,
                color: typeConfig.color,
                border: '1px solid var(--border-subtle)'
              }}
            >
              {typeConfig.labelJA} ({typeConfig.labelVI})
            </span>
          </div>

          {/* Material Spec */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Vật liệu chế tạo:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
              {data.material_spec || 'A5052 (Nhôm)'}
            </span>
          </div>

          {/* Dimensions */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Kích thước ngoài:
            </span>
            <span className="badge badge--info" style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>
              {dims ? `${dims} mm` : data.dimensions || '—'}
            </span>
          </div>

          {/* Weight */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Trọng lượng (kg):
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {data.actual_weight ? `${data.actual_weight} kg` : '—'}
            </span>
          </div>

          {/* Manufacturing Date */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Ngày nhập kho:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-secondary)' }}>
              {data.manufacturing_date || data.entry_date || '—'}
            </span>
          </div>

          {/* Physical Stamp */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Mã khắc chìm (Stamp):
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: 'var(--text-secondary)' }}>
              {data.physical_stamp || '—'}
            </span>
          </div>
        </div>
      </div>

      {/* CAV Compatibility Rule Notice */}
      {(data.equipment_type === 'WATER_BASE' || data.equipment_type === 'PRESSURE_BASE' || data.equipment_type === 'FRAME') && (
        <div
          className="card-flat"
          style={{
            padding: 12,
            background: 'var(--tint-blue-bg)',
            border: '1px solid var(--tint-blue-border)',
            borderRadius: 8,
            fontSize: 11,
            color: 'var(--tint-blue-text)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}
        >
          <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={16} />
            <span>💡 Quy tắc Dùng chung theo Mã CAV (CAV Compatibility Rule):</span>
          </div>
          <div>
            Đế làm mát (`WATER_BASE`), Đế khí (`PRESSURE_BASE`), Khung (`FRAME`) dùng chung cho tất cả các khuôn có <strong>cùng Mã CAV / Khổ Kích thước ngoài</strong> (Khổ A: 470x300, Khổ ZD: 470x347...).
          </div>
        </div>
      )}
    </div>
  )
}
