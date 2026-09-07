'use client'

import React, { Suspense, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft,
  Camera,
  MapPin,
  Search,
  Sparkles,
  RefreshCw,
  Layers,
} from 'lucide-react'
import CameraARScanner from '@/components/equipment/qr/CameraARScanner'
import ScannerAROverlay from '@/components/equipment/qr/ScannerAROverlay'
import LocationMoveModal from '@/app/equipment/locations/_components/LocationMoveModal'
import {
  resolveScannedQRCode,
  type ScannedQRResolution,
  type ScannedEquipmentResult,
  type ScannedLayerResult,
} from '@/app/equipment/locations/actions'

function ScanContent() {
  const searchParams = useSearchParams()
  const t = useTranslations('EquipmentLocations.scanner')
  const tQr = useTranslations('EquipmentLocations.qr')

  const initialTarget = searchParams.get('find') || searchParams.get('q') || ''

  const [targetCode, setTargetCode] = useState(initialTarget)
  const [showGrid, setShowGrid] = useState(true)
  const [isResolving, setIsResolving] = useState(false)
  const [scannedResult, setScannedResult] = useState<ScannedQRResolution | null>(null)
  const [manualQuery, setManualQuery] = useState('')

  // Move Modal integration
  const [equipmentToMove, setEquipmentToMove] = useState<ScannedEquipmentResult | null>(null)

  useEffect(() => {
    if (initialTarget) {
      setTargetCode(initialTarget)
    }
  }, [initialTarget])

  const handleScan = useCallback(
    async (payload: string) => {
      if (isResolving) return
      setIsResolving(true)

      try {
        const result = await resolveScannedQRCode(payload)
        setScannedResult(result)
      } catch (err) {
        console.error('Scan resolution error:', err)
        setScannedResult({
          type: 'UNKNOWN',
          raw: payload,
          error: 'Lỗi truy vấn dữ liệu thiết bị',
        })
      } finally {
        setIsResolving(false)
      }
    },
    [isResolving]
  )

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualQuery.trim()) return

    setIsResolving(true)
    try {
      const result = await resolveScannedQRCode(manualQuery.trim())
      setScannedResult(result)
    } catch (err) {
      console.error('Manual search resolution error:', err)
    } finally {
      setIsResolving(false)
    }
  }

  const handleRescan = () => {
    setScannedResult(null)
  }

  const isMatched = Boolean(
    targetCode.trim() &&
      scannedResult?.type === 'EQUIPMENT' &&
      scannedResult.data.equipment_code.toLowerCase().includes(targetCode.trim().toLowerCase())
  )

  const isUnknown = scannedResult?.type === 'UNKNOWN'

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/equipment/locations"
          className="btn btn-secondary flex items-center gap-1.5 text-xs text-slate-700 py-1.5 px-3"
        >
          <ArrowLeft size={14} />
          <span>{tQr('backToLocations')}</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            Sprint M17-S2
          </span>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Camera size={24} className="text-teal-600" />
          <span>{t('title')}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('subtitle')}
        </p>
      </div>

      {/* Main Camera Viewport with AR Overlay */}
      <div className="relative">
        <CameraARScanner
          active={true}
          isPaused={Boolean(equipmentToMove)}
          showGrid={showGrid}
          onToggleGrid={() => setShowGrid((prev) => !prev)}
          targetCode={targetCode}
          isMatched={isMatched}
          isUnknown={isUnknown}
          onScan={handleScan}
        />
      </div>

      {/* AR HUD & Results Overlay Component */}
      <ScannerAROverlay
        scannedResult={scannedResult}
        targetCode={targetCode}
        onTargetCodeChange={setTargetCode}
        onClearTarget={() => setTargetCode('')}
        isMatched={isMatched}
        onOpenMoveModal={(eq) => setEquipmentToMove(eq)}
        onRescan={handleRescan}
      />

      {/* Manual Input Fallback */}
      <div className="card-flat bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold">{t('manualSearchTitle')}</span>
          <span className="text-[11px] text-slate-400">{t('manualSearchSubtitle')}</span>
        </div>

        <form onSubmit={handleManualSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={manualQuery}
              onChange={(e) => setManualQuery(e.target.value)}
              placeholder="VD: M-ARK001-4 / MR-01-L2 / UUID..."
              className="form-input form-input-search w-full font-mono text-xs pl-8 pr-3 py-2"
            />
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={!manualQuery.trim() || isResolving}
            className="btn btn-secondary text-xs px-3.5 py-2 font-semibold disabled:opacity-50"
          >
            {isResolving ? (
              <RefreshCw size={13} className="animate-spin text-teal-600" />
            ) : (
              <span>{t('manualSearchBtn')}</span>
            )}
          </button>
        </form>
      </div>

      {/* Integrated LocationMoveModal for Instant Scan-to-Move */}
      {equipmentToMove && (
        <LocationMoveModal
          isOpen={Boolean(equipmentToMove)}
          onClose={() => setEquipmentToMove(null)}
          onSuccess={() => {
            // Update local current layer if successful
            setEquipmentToMove(null)
            handleRescan()
          }}
          equipment={{
            equipment_id: equipmentToMove.equipment_id,
            equipment_code: equipmentToMove.equipment_code,
            display_name: equipmentToMove.display_name,
            current_rack_layer_id: equipmentToMove.current_rack_layer_id,
            current_layer_code: equipmentToMove.current_layer_code,
            current_rack_code: equipmentToMove.current_rack_code,
            current_location_in_factory: equipmentToMove.current_location_in_factory,
            company_id: equipmentToMove.company_id,
            owner_company_name: equipmentToMove.owner_company_name,
            keeper_company_id: equipmentToMove.keeper_company_id,
            keeper_company_name: equipmentToMove.keeper_company_name,
          }}
        />
      )}
    </div>
  )
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-sm">
          Loading...
        </div>
      }
    >
      <ScanContent />
    </Suspense>
  )
}
