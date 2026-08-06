'use client'

import React from 'react'
import { QrCode, Download, Share2 } from 'lucide-react'
import { EquipmentDetailData } from '../types'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
}

export default function QRCodeViewerModule({ data, onClose }: Props) {
  const qrCodeText = data.equipment_code

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '10px 0', fontSize: 12 }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        Mã QR quét trên thiết bị di động (Mobile QR Code Scanner):
      </div>

      <div
        style={{
          border: '2px solid var(--accent)',
          borderRadius: 12,
          padding: 20,
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.15)'
        }}
      >
        <QrCode size={180} style={{ color: '#0f172a' }} />
        <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
          {data.equipment_code}
        </div>
        <div style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>
          {data.display_name}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12 }}>
          閉じる (Đóng)
        </button>
      </div>
    </div>
  )
}
