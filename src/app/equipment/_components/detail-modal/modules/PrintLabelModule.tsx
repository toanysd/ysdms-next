'use client'

import React from 'react'
import { Printer, QrCode, Box, MapPin } from 'lucide-react'
import { EquipmentDetailData } from '../types'
import { formatRackLocationDisplay } from '@/lib/utils/moldNaming'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
}

export default function PrintLabelModule({ data, onClose }: Props) {
  const rackText = formatRackLocationDisplay(data.rack_layers)
  const keeperName = data.keeper_company?.company_name || 'YSD (社内)'

  const handlePrint = () => {
    window.print()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 12 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        Mẫu nhãn in thông số kỹ thuật thiết bị (Label Layout Specification Sheet):
      </div>

      {/* Printable Spec Label Card */}
      <div
        id="printable-equipment-label"
        style={{
          border: '2px solid #0f172a',
          borderRadius: 8,
          padding: 16,
          background: '#ffffff',
          color: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0f172a', paddingBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '0.05em' }}>YSD MOLD SYSTEM</div>
          <span style={{ fontSize: 10, fontWeight: 700, background: '#0f172a', color: '#ffffff', padding: '2px 8px', borderRadius: 4 }}>
            {data.equipment_type}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>MÃ THIẾT BỊ / CODE</div>
            <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
              {data.equipment_code}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>
              {data.display_name}
            </div>

            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 11 }}>
              <div>
                <span style={{ color: '#64748b' }}>Kích thước: </span>
                <strong style={{ fontFamily: 'monospace' }}>
                  {data.actual_length_mm || data.dimensions || '—'} × {data.actual_width_mm || ''} × {data.actual_height_mm || ''} mm
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Khối lượng: </span>
                <strong style={{ fontFamily: 'monospace' }}>{data.actual_weight ? `${data.actual_weight} kg` : '—'}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 12, fontWeight: 700, color: '#0284c7' }}>
              <MapPin size={14} />
              <span>KỆ LƯU TRỮ: {rackText} ({keeperName})</span>
            </div>
          </div>

          {/* QR Code Placeholder Canvas */}
          <div style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
            <QrCode size={64} style={{ color: '#0f172a' }} />
            <span style={{ fontSize: 8, fontFamily: 'monospace', color: '#64748b', marginTop: 2 }}>{data.equipment_code}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12 }}>
          閉じる (Đóng)
        </button>
        <button type="button" onClick={handlePrint} className="btn btn-primary" style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Printer size={14} />
          <span>印刷を実行 (In nhãn)</span>
        </button>
      </div>
    </div>
  )
}
