'use client'

import React from 'react'
import { Box, Layers, Sparkles, Shield, Ruler, Weight, Package } from 'lucide-react'
import { EquipmentDetailData } from './types'

interface Props {
  data: EquipmentDetailData
}

export default function MoldDetailView({ data }: Props) {
  const rev = data.design_revisions
  const prod = rev?.products

  const dimsMold = [
    data.actual_length_mm || rev?.design_length,
    data.actual_width_mm || rev?.design_width,
    data.actual_height_mm || rev?.design_height
  ].filter(Boolean).join(' × ')

  const dimsProd = [
    rev?.product_length,
    rev?.product_width,
    rev?.product_height
  ].filter(Boolean).join(' × ')

  const isTeflonCoated = Boolean(
    data.is_teflon ||
    data.notes?.toLowerCase().includes('teflon') ||
    data.notes?.toLowerCase().includes('テフロン')
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Mold Overview Block */}
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
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: 6
          }}
        >
          <Box size={15} />
          <span>概要 (Tổng quan Thông số Khuôn)</span>
        </div>

        {/* Paper Style Specs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: 12 }}>
          {/* Equipment Display Name & Code */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 85, flexShrink: 0, fontWeight: 600 }}>
              兆称 (Mã khuôn):
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>
              #{data.equipment_code} {data.display_name}
            </span>
          </div>

          {/* Linked Tray Info */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 85, flexShrink: 0, fontWeight: 600 }}>
              トレイ情報:
            </span>
            <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>
              {rev?.tray_title || prod?.product_name || prod?.product_name_internal || '—'}
            </span>
          </div>

          {/* Resin Material & Thickness */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 85, flexShrink: 0, fontWeight: 600 }}>
              樹脂 (Loại nhựa):
            </span>
            <span style={{ fontWeight: 700, fontSize: 12, color: 'var(--tint-purple-text)' }}>
              {rev?.resin_type || 'PET'} {rev?.resin_thickness ? `${rev.resin_thickness}mm` : ''}
            </span>
          </div>

          {/* Initial Export / Mfg Date */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 85, flexShrink: 0, fontWeight: 600 }}>
              初回出荷日:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-secondary)' }}>
              {data.manufacturing_date || data.entry_date || '—'}
            </span>
          </div>

          {/* Mold Cavity & Pocket Count */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 85, flexShrink: 0, fontWeight: 600 }}>
              枚数 (Số mảnh):
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {data.piece_count || rev?.piece_count || 1} 枚
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 85, flexShrink: 0, fontWeight: 600 }}>
              ポケット数:
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {data.pocket_count || rev?.pocket_count || '—'} pockets
            </span>
          </div>

          {/* Mold Dimensions Badge */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 85, flexShrink: 0, fontWeight: 600 }}>
              金型寸法:
            </span>
            <span
              className="badge badge--info"
              style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}
            >
              {dimsMold ? `${dimsMold} mm` : '—'}
            </span>
          </div>

          {/* Mold Weight */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 85, flexShrink: 0, fontWeight: 600 }}>
              重量 (kg):
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {data.actual_weight ? `${data.actual_weight} kg` : rev?.design_weight || '—'}
            </span>
          </div>

          {/* Product Dimensions Badge */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 85, flexShrink: 0, fontWeight: 600 }}>
              製品寸法:
            </span>
            <span
              className="badge badge--success"
              style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}
            >
              {dimsProd ? `${dimsProd} mm` : '—'}
            </span>
          </div>

          {/* Product Weight */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', minWidth: 85, flexShrink: 0, fontWeight: 600 }}>
              製品重量(g):
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
              {rev?.product_weight ? `${rev.product_weight} g` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Teflon & Special Status Block */}
      <div
        className="card-flat"
        style={{
          padding: 12,
          background: isTeflonCoated ? 'var(--tint-purple-bg)' : 'var(--bg-surface-2)',
          border: isTeflonCoated ? '1px solid var(--tint-purple-border)' : '1px solid var(--border-default)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} style={{ color: isTeflonCoated ? 'var(--tint-purple-text)' : 'var(--text-muted)' }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: isTeflonCoated ? 'var(--tint-purple-text)' : 'var(--text-primary)' }}>
              テフロンコーティング (Trạng thái mạ Teflon)
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              {isTeflonCoated ? 'Khuôn đã được phủ mạ Teflon chống dính bề mặt' : 'Khuôn tiêu chuẩn chưa mạ Teflon'}
            </div>
          </div>
        </div>

        <span className={isTeflonCoated ? 'badge badge--purple font-bold' : 'badge badge--neutral'}>
          {isTeflonCoated ? '✨ 済 (Đã mạ)' : '標準 (Chưa mạ)'}
        </span>
      </div>
    </div>
  )
}
