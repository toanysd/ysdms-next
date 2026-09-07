'use client'

import React from 'react'
import Link from 'next/link'
import {
  MapPin,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Building2,
  AlertTriangle,
  Layers,
  Search,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ScannedEquipmentResult, ScannedLayerResult } from '@/app/equipment/locations/actions'

interface Props {
  scannedResult:
    | { type: 'EQUIPMENT'; data: ScannedEquipmentResult }
    | { type: 'LAYER'; data: ScannedLayerResult }
    | { type: 'UNKNOWN'; raw: string }
    | null
  targetCode: string
  onTargetCodeChange: (code: string) => void
  onClearTarget: () => void
  isMatched: boolean
  onOpenMoveModal: (equipment: ScannedEquipmentResult) => void
  onRescan: () => void
}

export default function ScannerAROverlay({
  scannedResult,
  targetCode,
  onTargetCodeChange,
  onClearTarget,
  isMatched,
  onOpenMoveModal,
  onRescan,
}: Props) {
  const t = useTranslations('EquipmentLocations.scanner')

  return (
    <div className="space-y-4">
      {/* 1. Target Mode Search Bar */}
      <div className="card-flat bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={targetCode}
              onChange={(e) => onTargetCodeChange(e.target.value)}
              placeholder={t('targetSearchPlaceholder')}
              className="form-input form-input-search w-full font-mono text-sm pl-9 pr-8 py-2"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            {targetCode && (
              <button
                type="button"
                onClick={onClearTarget}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={t('clearTarget')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {targetCode && (
            <span
              className={`px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 shrink-0 ${
                isMatched
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              {isMatched ? (
                <>
                  <Sparkles size={14} className="text-emerald-600" />
                  <span>{t('matchFound')}</span>
                </>
              ) : (
                <span>Locate Mode</span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* 2. Detected AR Results Card */}
      {scannedResult && (
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* A. Scanned Equipment Result */}
          {scannedResult.type === 'EQUIPMENT' && (
            <div
              className={`card-flat p-4 rounded-xl border shadow-md ${
                isMatched
                  ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400/30'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-200">
                    [{scannedResult.data.equipment_type}]
                  </span>
                  {isMatched && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white flex items-center gap-1 shadow-sm">
                      <Sparkles size={12} />
                      <span>{t('matchFound')}</span>
                    </span>
                  )}
                </div>

                {/* Rescan Button */}
                <button
                  type="button"
                  onClick={onRescan}
                  className="btn btn-secondary text-xs py-1 px-2.5 flex items-center gap-1 text-slate-600 hover:text-slate-900"
                >
                  <RotateCcw size={13} />
                  <span>{t('actionRescan')}</span>
                </button>
              </div>

              {/* Main Code & Name */}
              <div className="mb-3">
                <h2 className="text-lg sm:text-xl font-bold font-mono text-slate-900">
                  {scannedResult.data.equipment_code}
                </h2>
                <p className="text-sm text-slate-600 font-medium line-clamp-1">
                  {scannedResult.data.display_name || '—'}
                </p>
              </div>

              {/* Specs & Location Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-teal-600 shrink-0" />
                  <span className="text-slate-500">{t('currentLocation')}:</span>
                  {scannedResult.data.current_layer_code ? (
                    <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {scannedResult.data.current_layer_code}
                    </span>
                  ) : (
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {t('unassigned')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-slate-500 shrink-0" />
                  <span className="text-slate-500">{t('owner')}:</span>
                  <span className="font-medium text-slate-800 truncate">
                    {scannedResult.data.owner_company_name || 'YSD'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenMoveModal(scannedResult.data)}
                  className="btn btn-primary text-xs py-2 px-3.5 flex-1 flex items-center justify-center gap-1.5 font-semibold shadow-sm"
                >
                  <MapPin size={14} />
                  <span>{t('actionMove')}</span>
                </button>

                <Link
                  href={`/equipment/molds/${scannedResult.data.equipment_id}`}
                  className="btn btn-secondary text-xs py-2 px-3.5 flex-1 flex items-center justify-center gap-1.5 text-slate-700 font-medium"
                >
                  <ExternalLink size={14} />
                  <span>{t('actionView')}</span>
                </Link>
              </div>
            </div>
          )}

          {/* B. Scanned Layer Result */}
          {scannedResult.type === 'LAYER' && (
            <div className="card-flat bg-teal-50/50 p-4 rounded-xl border border-teal-200 shadow-md">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-teal-600 text-white">
                  {t('layerDetected')}
                </span>
                <button
                  type="button"
                  onClick={onRescan}
                  className="btn btn-secondary text-xs py-1 px-2.5 flex items-center gap-1 text-slate-600 hover:text-slate-900"
                >
                  <RotateCcw size={13} />
                  <span>{t('actionRescan')}</span>
                </button>
              </div>

              <div className="mb-3">
                <h2 className="text-xl font-bold font-mono text-teal-900">
                  {scannedResult.data.layer_code}
                </h2>
                <p className="text-xs text-slate-600">
                  {t('layerRackInfo', {
                    rack: scannedResult.data.rack_name,
                    zone: scannedResult.data.zone_code,
                    layer: scannedResult.data.layer_number,
                  })}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs py-2 border-y border-teal-100 mb-3">
                <Layers size={14} className="text-teal-700 shrink-0" />
                <span className="text-slate-600">{t('containing')}</span>
                <span className="font-mono font-bold text-teal-800">
                  {t('equipmentCount', { count: scannedResult.data.equipment_count })}
                </span>
              </div>

              <Link
                href={`/equipment/locations/${scannedResult.data.rack_id}`}
                className="btn btn-primary text-xs py-2 px-3.5 w-full flex items-center justify-center gap-1.5 font-semibold"
              >
                <span>{t('viewRackShelf')}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* C. Unknown Result */}
          {scannedResult.type === 'UNKNOWN' && (
            <div className="card-flat bg-rose-50 p-4 rounded-xl border border-rose-200 text-center shadow-md">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle size={20} />
              </div>
              <h3 className="text-sm font-bold text-rose-900 mb-1">{t('unknownCode')}</h3>
              <p className="text-xs text-rose-700 max-w-sm mx-auto mb-3">
                {t('unknownCodeDesc', { code: scannedResult.raw })}
              </p>
              <button
                type="button"
                onClick={onRescan}
                className="btn btn-secondary text-xs py-1.5 px-4 inline-flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>{t('actionRescan')}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
