'use client'

import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export interface QRCodeDisplayProps {
  equipmentCode: string
  equipmentType: string
  equipmentId: string
  productName?: string | null
  currentLayerCode?: string | null
  size?: 30 | 40 | 50 // in mm
  mode?: 'short' | 'url'
  showBorder?: boolean
  className?: string
  onDataUrlReady?: (dataUrl: string, payload: string) => void
}

/**
 * Immutable Prefix Table for Equipment Types
 * M: MOLD
 * C: CUTTER_SEPARATE / CUTTER_INLINE
 * P: PLUG
 * W: WATER_BASE
 * B: PRESSURE_BASE
 * S: STACKING
 * F: FRAME
 */
export function getEquipmentTypePrefix(type: string | null | undefined): string {
  const t = String(type || '').toUpperCase()
  if (['MOLD', '金型'].includes(t)) return 'M'
  if (['CUTTER', 'CUTTER_SEPARATE', 'CUTTER_INLINE', '抜型'].includes(t)) return 'C'
  if (['PLUG', 'プラグ'].includes(t)) return 'P'
  if (['WATER_BASE', '水冷盤'].includes(t)) return 'W'
  if (['PRESSURE_BASE', '圧空盤'].includes(t)) return 'B'
  if (['STACKING', 'スタッカー'].includes(t)) return 'S'
  if (['FRAME', '木枠'].includes(t)) return 'F'
  return 'E'
}

export function getEquipmentTypeShortLabel(type: string | null | undefined): string {
  const prefix = getEquipmentTypePrefix(type)
  switch (prefix) {
    case 'M': return '金型'
    case 'C': return '抜型'
    case 'P': return 'プラグ'
    case 'W': return '水冷盤'
    case 'B': return '圧空盤'
    case 'S': return 'スタッカー'
    case 'F': return '木枠'
    default: return '設備'
  }
}

export function buildEquipmentQrPayload(params: {
  type: string
  code: string
  id: string
  mode?: 'short' | 'url'
  baseUrl?: string
}): string {
  const { type, code, id, mode = 'short', baseUrl } = params
  const prefix = getEquipmentTypePrefix(type)

  if (mode === 'short') {
    return `${prefix}-${code.trim()}`
  }

  // URL mode using equipmentId (UUID)
  const host =
    baseUrl ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '') ||
    'https://ysdms.vercel.app'
  const cleanHost = host.replace(/\/+$/, '')
  return `${cleanHost}/equipment/molds/${id}`
}

export function truncateText(text: string | null | undefined, maxLen = 20): string {
  if (!text) return ''
  const trimmed = text.trim()
  if (trimmed.length <= maxLen) return trimmed
  return trimmed.slice(0, maxLen - 1) + '…'
}

export default function QRCodeDisplay({
  equipmentCode,
  equipmentType,
  equipmentId,
  productName,
  currentLayerCode,
  size = 40,
  mode = 'short',
  showBorder = true,
  className = '',
  onDataUrlReady,
}: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const payload = buildEquipmentQrPayload({
    type: equipmentType,
    code: equipmentCode,
    id: equipmentId,
    mode,
  })

  const typeLabel = getEquipmentTypeShortLabel(equipmentType)
  const subName = truncateText(productName, 20)

  useEffect(() => {
    let isMounted = true

    // Generate high-resolution QR image for sharp printing
    const pixelWidth = size === 30 ? 300 : size === 40 ? 400 : 500

    QRCode.toDataURL(payload, {
      width: pixelWidth,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) {
          setDataUrl(url)
          setError(null)
          if (onDataUrlReady) {
            onDataUrlReady(url, payload)
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error generating QR Code:', err)
          setError(err.message)
        }
      })

    return () => {
      isMounted = false
    }
  }, [payload, size, onDataUrlReady])

  // Responsive font sizes scaled based on tag size in mm
  const headerFontSize = size === 30 ? '9pt' : size === 40 ? '10.5pt' : '12pt'
  const subFontSize = size === 30 ? '7pt' : size === 40 ? '8pt' : '9.5pt'
  const locFontSize = size === 30 ? '7pt' : size === 40 ? '8pt' : '9pt'

  return (
    <div
      className={`qr-tag-container bg-white flex flex-col items-center justify-between text-center select-none ${className}`}
      style={{
        width: `${size}mm`,
        height: `${size}mm`,
        minWidth: `${size}mm`,
        minHeight: `${size}mm`,
        maxWidth: `${size}mm`,
        maxHeight: `${size}mm`,
        padding: size === 30 ? '1.5mm' : '2.5mm',
        boxSizing: 'border-box',
        border: showBorder ? '0.5px dotted #999' : 'none',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. Header: [金型] ARK-001 */}
      <div
        className="font-mono font-extrabold text-slate-900 tracking-tight leading-tight w-full truncate"
        style={{ fontSize: headerFontSize }}
        title={`[${typeLabel}] ${equipmentCode}`}
      >
        <span className="text-slate-600 font-bold mr-0.5">[{typeLabel}]</span>
        <span>{equipmentCode}</span>
      </div>

      {/* 2. QR Code Canvas Image */}
      <div className="flex-1 flex items-center justify-center w-full overflow-hidden my-0.5">
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={payload}
            className="w-full h-full object-contain pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
          />
        ) : error ? (
          <div className="text-[9px] text-rose-500 font-mono">ERR</div>
        ) : (
          <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-teal-600 animate-spin" />
        )}
      </div>

      {/* 3. Sub: Product / Mold Name (max 20 chars truncated) */}
      {subName && (
        <div
          className="text-slate-700 font-medium w-full truncate leading-tight"
          style={{ fontSize: subFontSize }}
          title={productName || ''}
        >
          {subName}
        </div>
      )}

      {/* 4. Location: Storage Layer Code (e.g. MR-01-L2) */}
      {currentLayerCode && (
        <div
          className="font-mono font-bold text-slate-500 w-full truncate leading-tight mt-0.5"
          style={{ fontSize: locFontSize }}
          title={currentLayerCode}
        >
          📍 {currentLayerCode}
        </div>
      )}
    </div>
  )
}
