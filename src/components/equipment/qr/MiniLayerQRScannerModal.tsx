'use client'

import React, { useState } from 'react'
import { X, Layers, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import CameraARScanner from './CameraARScanner'
import { resolveScannedQRCode, type ScannedLayerResult } from '@/app/equipment/locations/actions'

interface Props {
  isOpen: boolean
  onClose: () => void
  onLayerDetected: (layer: ScannedLayerResult) => void
}

export default function MiniLayerQRScannerModal({
  isOpen,
  onClose,
  onLayerDetected,
}: Props) {
  const t = useTranslations('EquipmentLocations.scanner')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successCode, setSuccessCode] = useState<string | null>(null)

  if (!isOpen) return null

  const handleScan = async (payload: string) => {
    if (loading || successCode) return
    setLoading(true)
    setError(null)

    try {
      const res = await resolveScannedQRCode(payload)
      if (res.type === 'LAYER') {
        setSuccessCode(res.data.layer_code)
        setTimeout(() => {
          onLayerDetected(res.data)
          onClose()
          setSuccessCode(null)
        }, 500)
      } else {
        setError(t('notLayerCode', { code: payload }))
      }
    } catch (err: any) {
      console.error('Failed to resolve scanned layer:', err)
      setError(err.message || t('cameraError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('scanLayerTitle')}</h3>
              <p className="text-[11px] text-slate-500">{t('scanLayerSubtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="p-4 bg-slate-900">
          <div className="relative rounded-xl overflow-hidden shadow-inner">
            <CameraARScanner
              active={isOpen}
              showGrid={false}
              onScan={handleScan}
              isPaused={Boolean(successCode)}
            />

            {/* Success Overlay */}
            {successCode && (
              <div className="absolute inset-0 z-30 bg-teal-900/90 flex flex-col items-center justify-center p-4 text-center animate-in zoom-in-95 duration-200">
                <CheckCircle2 size={44} className="text-teal-300 mb-2 animate-bounce" />
                <h4 className="text-base font-bold text-white mb-1">
                  {t('scanLayerSuccess', { code: successCode })}
                </h4>
                <p className="text-xs text-teal-200">{t('applyingLayer')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 mx-4 my-2 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            {t('exampleCode', { example: 'MR-01-L2' })}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary text-xs py-1.5 px-3.5"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  )
}
