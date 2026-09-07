'use client'

import React, { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import QRCode from 'qrcode'
import {
  X,
  Printer,
  CheckSquare,
  Square,
  Layers,
  Sparkles,
  Loader2,
  Settings,
  Filter,
} from 'lucide-react'
import {
  getEquipmentTypeShortLabel,
  buildEquipmentQrPayload,
  truncateText,
} from './QRCodeDisplay'

export interface EquipmentPrintItem {
  equipmentId: string
  equipmentCode: string
  equipmentType: string
  displayName?: string | null
  currentLayerCode?: string | null
  layerNumber?: number | null
}

export interface QRBatchPrintSheetProps {
  isOpen: boolean
  onClose: () => void
  items: EquipmentPrintItem[]
  title?: string
  defaultSize?: 30 | 40 | 50
  defaultMode?: 'short' | 'url'
}

export default function QRBatchPrintSheet({
  isOpen,
  onClose,
  items,
  title,
  defaultSize = 40,
  defaultMode = 'short',
}: QRBatchPrintSheetProps) {
  const t = useTranslations('EquipmentLocations.qr')

  const [size, setSize] = useState<30 | 40 | 50>(defaultSize)
  const [mode, setMode] = useState<'short' | 'url'>(defaultMode)
  const [showCode, setShowCode] = useState(true)
  const [showName, setShowName] = useState(true)
  const [showLocation, setShowLocation] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(items.map((i) => i.equipmentId)))
  const [generating, setGenerating] = useState(false)

  // Update selectedIds when items change
  React.useEffect(() => {
    setSelectedIds(new Set(items.map((i) => i.equipmentId)))
  }, [items])

  const selectedItems = useMemo(() => {
    return items.filter((item) => selectedIds.has(item.equipmentId))
  }, [items, selectedIds])

  if (!isOpen) return null

  const handleToggleItem = (id: string) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const handleSelectAll = () => {
    setSelectedIds(new Set(items.map((i) => i.equipmentId)))
  }

  const handleDeselectAll = () => {
    setSelectedIds(new Set())
  }

  const handlePrintBatch = async () => {
    if (selectedItems.length === 0) return
    setGenerating(true)

    try {
      // 1. Generate all QR code Data URLs in parallel
      const pixelWidth = size === 30 ? 300 : size === 40 ? 400 : 500

      const qrResults = await Promise.all(
        selectedItems.map(async (item) => {
          const payload = buildEquipmentQrPayload({
            type: item.equipmentType,
            code: item.equipmentCode,
            id: item.equipmentId,
            mode,
          })

          const dataUrl = await QRCode.toDataURL(payload, {
            width: pixelWidth,
            margin: 1,
            errorCorrectionLevel: 'M',
            color: { dark: '#000000', light: '#ffffff' },
          })

          const typeLabel = getEquipmentTypeShortLabel(item.equipmentType)
          const subName = truncateText(item.displayName, 20)

          return {
            ...item,
            dataUrl,
            payload,
            typeLabel,
            subName,
          }
        })
      )

      // 2. Build HTML A4 Print Sheet
      const labelsHtml = qrResults
        .map((r) => {
          return `
            <div class="qr-label">
              ${
                showCode
                  ? `<div class="lbl-header">[${r.typeLabel}] ${r.equipmentCode}</div>`
                  : ''
              }
              <div class="lbl-img-wrap">
                <img src="${r.dataUrl}" alt="${r.payload}">
              </div>
              ${showName && r.subName ? `<div class="lbl-name">${r.subName}</div>` : ''}
              ${
                showLocation && r.currentLayerCode
                  ? `<div class="lbl-loc">📍 ${r.currentLayerCode}</div>`
                  : ''
              }
            </div>
          `
        })
        .join('')

      const html = `
        <!DOCTYPE html>
        <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <title>${title || 'A4 QR Batch Sheet'} (${selectedItems.length})</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 8mm 6mm;
            }
            * {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 0;
              background: #fff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Hiragino Sans", sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .grid-container {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(${size}mm, 1fr));
              gap: 4mm 3mm;
              justify-content: center;
              padding: 0;
            }
            .qr-label {
              width: ${size}mm;
              height: ${size}mm;
              border: 0.5px dotted #999;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              text-align: center;
              padding: ${size === 30 ? '1.5mm' : '2.5mm'};
              page-break-inside: avoid;
              break-inside: avoid;
              overflow: hidden;
            }
            .lbl-header {
              font-family: monospace;
              font-weight: 800;
              font-size: ${size === 30 ? '8.5pt' : size === 40 ? '10pt' : '11.5pt'};
              line-height: 1.15;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              color: #000;
            }
            .lbl-img-wrap {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              overflow: hidden;
              margin: 0.5mm 0;
            }
            .lbl-img-wrap img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              image-rendering: pixelated;
            }
            .lbl-name {
              font-size: ${size === 30 ? '6.5pt' : size === 40 ? '7.5pt' : '9pt'};
              color: #222;
              line-height: 1.15;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .lbl-loc {
              font-family: monospace;
              font-weight: 700;
              font-size: ${size === 30 ? '6.5pt' : size === 40 ? '7.5pt' : '8.5pt'};
              color: #555;
              margin-top: 0.5mm;
              width: 100%;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            @media print {
              body { padding: 0; }
              .grid-container { gap: 3.5mm 2.5mm; }
            }
          </style>
        </head>
        <body>
          <div class="grid-container">
            ${labelsHtml}
          </div>
          <script>
            window.onload = () => { setTimeout(() => window.print(), 400); };
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
    } catch (err: any) {
      console.error('Error in batch printing:', err)
      alert(err.message || 'Lỗi tạo bản in A4')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Printer size={18} className="text-teal-400" />
            <div>
              <div className="font-bold text-[15px] leading-tight">{t('batchTitle')}</div>
              <div className="text-[11px] text-slate-300">
                {title ? `${title} — ` : ''}
                {t('selectedCount', { count: selectedItems.length })}
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
        <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-4 text-[13px]">
          {/* Controls Bar: Size, Mode, Checkboxes */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Size */}
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
                      className={`flex-1 py-1.5 text-center transition-colors ${
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

              {/* Mode */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1 uppercase tracking-wider">
                  {t('format')}
                </label>
                <div className="flex rounded-md shadow-sm border border-slate-300 bg-white overflow-hidden text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setMode('short')}
                    className={`flex-1 py-1.5 text-center truncate px-1 transition-colors ${
                      mode === 'short'
                        ? 'bg-teal-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('formatShort')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`flex-1 py-1.5 text-center truncate px-1 transition-colors ${
                      mode === 'url'
                        ? 'bg-teal-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t('formatUrl')}
                  </button>
                </div>
              </div>
            </div>

            {/* Print Options */}
            <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center gap-4 text-[12px]">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={showCode}
                  onChange={(e) => setShowCode(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>{t('showCode')}</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={showName}
                  onChange={(e) => setShowName(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>{t('showName')}</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={showLocation}
                  onChange={(e) => setShowLocation(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span>{t('showLocation')}</span>
              </label>
            </div>
          </div>

          {/* Checklist Area */}
          <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col flex-1">
            <div className="px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-[12px]">
              <div className="font-bold text-slate-700 flex items-center gap-1.5">
                <Filter size={13} className="text-slate-500" />
                <span>
                  {t('selectedCount', { count: selectedItems.length })} / {items.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="btn btn-secondary text-[11px] py-0.5 px-2 flex items-center gap-1 text-slate-700"
                >
                  <CheckSquare size={12} />
                  <span>{t('selectAll')}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="btn btn-secondary text-[11px] py-0.5 px-2 flex items-center gap-1 text-slate-700"
                >
                  <Square size={12} />
                  <span>{t('deselectAll')}</span>
                </button>
              </div>
            </div>

            {/* Item rows */}
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
              {items.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-[12px]">
                  {t('noEquipmentToPrint')}
                </div>
              ) : (
                items.map((item) => {
                  const isChecked = selectedIds.has(item.equipmentId)
                  return (
                    <label
                      key={item.equipmentId}
                      className={`flex items-center gap-3 px-3.5 py-2 hover:bg-slate-50 cursor-pointer transition-colors ${
                        isChecked ? 'bg-teal-50/40' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleItem(item.equipmentId)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                        <div className="truncate">
                          <span className="font-mono font-bold text-slate-900 mr-2 text-[12px]">
                            {item.equipmentCode}
                          </span>
                          <span className="text-slate-600 text-[12px] truncate">
                            {item.displayName || '—'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded border bg-slate-50 text-slate-600">
                            {getEquipmentTypeShortLabel(item.equipmentType)}
                          </span>
                          {item.currentLayerCode && (
                            <span className="text-[11px] font-mono text-slate-500">
                              {item.currentLayerCode}
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            A4 Grid: ~{size === 30 ? '48' : size === 40 ? '24' : '15'} tem / trang A4
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-[12px] py-1.5 px-3"
              disabled={generating}
            >
              {t('close')}
            </button>
            <button
              type="button"
              onClick={handlePrintBatch}
              disabled={generating || selectedItems.length === 0}
              className="btn btn-primary text-[12px] py-1.5 px-4 font-bold flex items-center gap-1.5 shadow-sm"
            >
              {generating ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Printer size={14} />
              )}
              <span>{t('batchPrintBtn')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
