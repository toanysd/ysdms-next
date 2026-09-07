'use client'

import React, { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  QrCode,
  Layers,
  Sparkles,
} from 'lucide-react'
import QRCodeDisplay, {
  getEquipmentTypeShortLabel,
  truncateText,
} from './QRCodeDisplay'

export interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  equipment: {
    equipmentId: string
    equipmentCode: string
    equipmentType: string
    displayName?: string | null
    currentLayerCode?: string | null
  }
}

export default function QRCodeModal({
  isOpen,
  onClose,
  equipment,
}: QRCodeModalProps) {
  const t = useTranslations('EquipmentLocations.qr')
  const [size, setSize] = useState<30 | 40 | 50>(40)
  const [mode, setMode] = useState<'short' | 'url'>('short')
  const [copied, setCopied] = useState(false)
  const [currentDataUrl, setCurrentDataUrl] = useState<string>('')
  const [currentPayload, setCurrentPayload] = useState<string>('')

  const handleDataUrlReady = useCallback((url: string, payload: string) => {
    setCurrentDataUrl(url)
    setCurrentPayload(payload)
  }, [])

  if (!isOpen) return null

  // 1. Single Tag Print
  const handlePrint = () => {
    if (!currentDataUrl) return

    const typeLabel = getEquipmentTypeShortLabel(equipment.equipmentType)
    const subName = truncateText(equipment.displayName, 20)

    const html = `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <title>QR: ${equipment.equipmentCode}</title>
        <style>
          @page {
            size: auto;
            margin: 10mm;
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: #fff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .qr-label {
            width: ${size}mm;
            height: ${size}mm;
            border: 0.5px dotted #999;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            text-align: center;
            padding: ${size === 30 ? '1.5mm' : '2.5mm'};
            page-break-inside: avoid;
          }
          .lbl-header {
            font-family: monospace;
            font-weight: 800;
            font-size: ${size === 30 ? '9pt' : size === 40 ? '10.5pt' : '12pt'};
            line-height: 1.2;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .lbl-img-wrap {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            overflow: hidden;
            margin: 1mm 0;
          }
          .lbl-img-wrap img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            image-rendering: pixelated;
          }
          .lbl-name {
            font-size: ${size === 30 ? '7pt' : size === 40 ? '8pt' : '9.5pt'};
            color: #333;
            line-height: 1.2;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .lbl-loc {
            font-family: monospace;
            font-weight: 700;
            font-size: ${size === 30 ? '7pt' : size === 40 ? '8pt' : '9pt'};
            color: #666;
            margin-top: 0.5mm;
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          @media print {
            body { height: auto; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="qr-label">
          <div class="lbl-header">[${typeLabel}] ${equipment.equipmentCode}</div>
          <div class="lbl-img-wrap">
            <img src="${currentDataUrl}" alt="QR">
          </div>
          ${subName ? `<div class="lbl-name">${subName}</div>` : ''}
          ${equipment.currentLayerCode ? `<div class="lbl-loc">📍 ${equipment.currentLayerCode}</div>` : ''}
        </div>
        <script>
          window.onload = () => { setTimeout(() => window.print(), 350); };
        </script>
      </body>
      </html>
    `

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) {
      alert('Vui lòng cho phép mở popup để in tem QR.')
    } else {
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    }
  }

  // 2. Download Single Tag PNG
  const handleDownload = () => {
    if (!currentDataUrl) return
    const a = document.createElement('a')
    a.href = currentDataUrl
    a.download = `QR_${equipment.equipmentCode}_${size}mm_${mode}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // 3. Copy to Clipboard
  const handleCopy = async () => {
    if (!currentDataUrl) return
    try {
      const res = await fetch(currentDataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.warn('Clipboard image copy failed, falling back to text:', err)
      try {
        await navigator.clipboard.writeText(currentPayload)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (copyErr) {
        console.error('Clipboard copy failed:', copyErr)
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode size={18} className="text-teal-400" />
            <div>
              <div className="font-bold text-[15px] leading-tight">{t('singleTitle')}</div>
              <div className="text-[11px] text-slate-300 font-mono">
                {equipment.equipmentCode} — {equipment.displayName || '—'}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4 text-[13px]">
          {/* Controls: Size & Format */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
            {/* Size selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                {t('tagSize')}
              </label>
              <div className="flex rounded-md shadow-sm border border-slate-300 bg-white overflow-hidden text-[12px] font-semibold">
                {([30, 40, 50] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex-1 py-1 text-center transition-colors ${
                      size === s
                        ? 'bg-teal-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {s}mm
                  </button>
                ))}
              </div>
            </div>

            {/* Mode selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                {t('format')}
              </label>
              <div className="flex rounded-md shadow-sm border border-slate-300 bg-white overflow-hidden text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setMode('short')}
                  className={`flex-1 py-1 text-center truncate px-1 transition-colors ${
                    mode === 'short'
                      ? 'bg-teal-600 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title={t('formatShort')}
                >
                  {t('formatShort')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('url')}
                  className={`flex-1 py-1 text-center truncate px-1 transition-colors ${
                    mode === 'url'
                      ? 'bg-teal-600 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title={t('formatUrl')}
                >
                  {t('formatUrl')}
                </button>
              </div>
            </div>
          </div>

          {/* QR Tag Live Preview */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-100/70 rounded-xl border border-dashed border-slate-300 min-h-[200px]">
            <QRCodeDisplay
              equipmentCode={equipment.equipmentCode}
              equipmentType={equipment.equipmentType}
              equipmentId={equipment.equipmentId}
              productName={equipment.displayName}
              currentLayerCode={equipment.currentLayerCode}
              size={size}
              mode={mode}
              showBorder={true}
              onDataUrlReady={handleDataUrlReady}
              className="shadow-sm transition-all"
            />
            <div className="mt-3 text-[11px] text-slate-500 font-mono text-center">
              Payload: <span className="font-bold text-slate-700">{currentPayload}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary py-2 px-3 flex items-center justify-center gap-1.5 text-[12px] font-bold shadow-sm"
            >
              <Printer size={15} />
              <span>{t('printBtn')}</span>
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-secondary py-2 px-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold"
            >
              <Download size={15} />
              <span>{t('downloadBtn')}</span>
            </button>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className={`btn py-2 px-3 flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'btn-secondary'
              }`}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? t('copied') : t('copyBtn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
