'use client'

import React from 'react'
import { Crop, Layers, ShieldCheck, Ruler, CheckCircle } from 'lucide-react'
import { EquipmentDetailData } from './types'
import { formatCutterDisplayCode } from '@/lib/utils/moldNaming'

interface Props {
  data: EquipmentDetailData
}

export default function CutterDetailView({ data }: Props) {
  const isInline = data.equipment_type === 'CUTTER_INLINE' || data.sub_type?.includes('INLINE')
  const cutterCode = formatCutterDisplayCode(data.cutter_no || data.equipment_code)
  const dimsCutter = [
    data.actual_length_mm,
    data.actual_width_mm,
    data.actual_height_mm
  ].filter(Boolean).join(' × ')

  const isAvailable = data.cutter_presence ?? true

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Cutter Overview Card */}
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
            color: 'var(--tint-orange-text)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 6
          }}
        >
          <Crop size={15} />
          <span>抜き型仕様 (Thông số Kỹ thuật Dao Cắt)</span>
        </div>

        {/* Paper Style Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: 12 }}>
          {/* Cutter No */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Mã Dao (CutterNo):
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: 'var(--tint-orange-text)' }}>
              {cutterCode}
            </span>
          </div>

          {/* Cutter Name */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Tên Dao cắt:
            </span>
            <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
              {data.cutter_name || data.display_name}
            </span>
          </div>

          {/* Cutter Type */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Loại Dao:
            </span>
            <span className="badge badge--orange" style={{ fontWeight: 700, fontSize: 10 }}>
              {isInline ? 'インライン (Dao liền máy)' : '別抜き (Dao rời)'}
            </span>
          </div>

          {/* Presence Status */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Trạng thái sẵn sàng:
            </span>
            <span className={isAvailable ? 'badge badge--success' : 'badge badge--neutral'} style={{ fontSize: 10 }}>
              {isAvailable ? '在空 (Sẵn sàng / Trống)' : '使用中 (Đang gá máy)'}
            </span>
          </div>

          {/* Dimensions */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Kích thước dao:
            </span>
            <span className="badge badge--orange" style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>
              {dimsCutter ? `${dimsCutter} mm` : data.dimensions || '—'}
            </span>
          </div>

          {/* Material Steel Spec */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Vật liệu lưỡi cắt:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {data.material_spec || 'SKD11 (Nhật Bản)'}
            </span>
          </div>

          {/* Manufacturing Date */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 95, flexShrink: 0, fontWeight: 600 }}>
              Ngày tạo dao:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-secondary)' }}>
              {data.manufacturing_date || data.entry_date || '—'}
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
        </div>
      </div>

      {/* Shared Compatibility Rule Warning Box */}
      <div
        className="card-flat"
        style={{
          padding: 12,
          background: 'var(--tint-teal-bg)',
          border: '1px solid var(--tint-teal-border)',
          borderRadius: 8,
          fontSize: 11,
          color: 'var(--tint-teal-text)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}
      >
        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ShieldCheck size={16} />
          <span>💡 Quy tắc Dùng chung Dao Cắt (Cutter Reuse Policy):</span>
        </div>
        <div>
          Dao cắt được gợi ý dùng chung theo <strong>Kích thước bao ngoài sản phẩm</strong>. KTV cần đối chiếu biên dạng uốn cong và vị trí lỗ khoét trước khi gá sản phẩm mới lên dao cắt này.
        </div>
      </div>
    </div>
  )
}
