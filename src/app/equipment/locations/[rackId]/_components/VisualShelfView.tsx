'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft,
  ArrowUpFromLine,
  MapPin,
  Box,
  Layers,
  Search,
  X,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  MoveRight,
} from 'lucide-react'
import type { RackDetailWithLayers, RackEquipmentItem } from '../../actions'
import LocationMoveModal from '../../_components/LocationMoveModal'

interface Props {
  data: RackDetailWithLayers
}

export default function VisualShelfView({ data }: Props) {
  const router = useRouter()
  const t = useTranslations('EquipmentLocations.detail')
  const tZones = useTranslations('EquipmentLocations.zones')
  const [filterQuery, setFilterQuery] = useState('')
  const [moveTargetEquipment, setMoveTargetEquipment] = useState<any | null>(null)

  const rack = data.rack

  let zoneLabel = rack.zone_code
  try {
    zoneLabel = tZones(rack.zone_code)
  } catch {
    zoneLabel = rack.zone_code
  }

  // Filter equipment inside layers if search is active
  const filteredLayers = useMemo(() => {
    if (!filterQuery.trim()) return data.layers

    const q = filterQuery.trim().toLowerCase()
    return data.layers.map((l) => {
      const matchEq = l.equipment.filter(
        (eq) =>
          eq.equipment_code.toLowerCase().includes(q) ||
          eq.display_name.toLowerCase().includes(q) ||
          eq.equipment_type.toLowerCase().includes(q)
      )
      return {
        ...l,
        equipment: matchEq,
      }
    })
  }, [data.layers, filterQuery])

  const totalFilteredEquipment = useMemo(() => {
    return filteredLayers.reduce((sum, l) => sum + l.equipment.length, 0)
  }, [filteredLayers])

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'MOLD':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'CUTTER_SEPARATE':
      case 'CUTTER_INLINE':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'PLUG':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'WATER_BASE':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200'
      case 'PRESSURE_BASE':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getStatusBadgeClass = (status: string | null) => {
    switch (status) {
      case 'NORMAL':
        return 'badge--success'
      case 'MAINTENANCE':
        return 'badge--warning'
      case 'REPAIRING':
      case 'DAMAGED':
        return 'badge--error'
      default:
        return 'badge--neutral'
    }
  }

  return (
    <div className="flex flex-col h-full gap-3 p-3 md:p-4 overflow-y-auto">
      {/* 1. BackBar & Navigation */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="btn btn-secondary text-[12px] flex items-center gap-1 py-1 px-2.5"
          >
            <ArrowLeft size={14} />
            <span>{t('back')}</span>
          </button>
          <Link
            href="/equipment/locations"
            className="btn btn-secondary text-[12px] flex items-center gap-1 py-1 px-2.5"
            style={{ textDecoration: 'none' }}
          >
            <ArrowUpFromLine size={14} />
            <span>{t('backToList')}</span>
          </Link>
        </div>

        {/* Search within this rack */}
        <div className="relative w-64">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input w-full pl-8 pr-7 text-[12px] py-1"
            placeholder={t('searchInRackPlaceholder')}
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
          />
          {filterQuery && (
            <button
              onClick={() => setFilterQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-slate-200"
            >
              <X size={12} style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Rack Header Card */}
      <div
        className="card-flat p-4 flex flex-wrap items-center justify-between gap-4"
        style={{ borderLeft: '4px solid var(--accent)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--tint-teal-bg)', color: 'var(--accent)' }}
          >
            <Layers size={24} />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-[22px] font-extrabold tracking-tight"
                style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}
              >
                {rack.rack_code_new}
              </span>
              <span
                className="text-[12px] px-2 py-0.5 rounded bg-slate-100 font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                {t('legacyRef')}: {rack.rack_code}{' '}
                {rack.rack_name !== rack.rack_code && rack.rack_name ? `(${rack.rack_name})` : ''}
              </span>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'var(--tint-teal-bg)', color: 'var(--accent)' }}
              >
                {rack.zone_code} - {zoneLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
              <MapPin size={13} style={{ color: 'var(--accent)' }} />
              <span>{rack.location_in_factory}</span>
              {rack.notes && <span className="text-slate-400">({rack.notes})</span>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <div className="text-center px-2">
            <div className="text-[10px] uppercase font-bold text-slate-500">{t('totalLayers')}</div>
            <div className="text-[18px] font-bold text-slate-800 font-mono">{data.total_layers}</div>
          </div>
          <div className="w-px h-7 bg-slate-200" />
          <div className="text-center px-2">
            <div className="text-[10px] uppercase font-bold text-slate-500">{t('totalEquipment')}</div>
            <div className="text-[18px] font-bold text-teal-700 font-mono">
              {totalFilteredEquipment}{' '}
              {filterQuery && <span className="text-[11px] text-slate-400 font-normal">/ {data.total_equipment}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Visual Shelf Stack (Simulates Physical Multi-Tier Shelf) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="text-[13px] font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
            <Box size={16} style={{ color: 'var(--accent)' }} />
            <span>{t('visualShelfTitle')}</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {t('shelfOrderHint')} {/* Tầng trên cùng -> Tầng 1 dưới cùng */}
          </span>
        </div>

        {/* Shelf Stack (Layers sorted from top to bottom) */}
        <div className="flex flex-col gap-3">
          {filteredLayers.map((layer) => {
            const hasEquipment = layer.equipment.length > 0

            return (
              <div
                key={layer.id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Layer Shelf Bar (Header) */}
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded font-bold text-[13px] bg-slate-800 text-white font-mono"
                    >
                      {layer.layer_code}
                    </span>
                    <span className="text-[12px] font-semibold text-slate-700">
                      {t('layerLabel', { number: layer.layer_number })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full font-mono ${
                        hasEquipment ? 'bg-teal-100 text-teal-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {layer.equipment.length} {t('equipmentUnit')}
                    </span>
                  </div>
                </div>

                {/* Layer Items Shelf Deck */}
                <div className="p-3 bg-slate-50/50">
                  {!hasEquipment ? (
                    <div className="p-4 rounded-md border border-dashed border-slate-300 text-center text-slate-400 text-[12px]">
                      {t('emptyLayerSlot')}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      {layer.equipment.map((eq) => (
                        <div
                          key={eq.equipment_id}
                          className="bg-white p-2.5 rounded border border-slate-200 hover:border-teal-500 hover:shadow-sm transition-all flex flex-col justify-between"
                        >
                          <div>
                            {/* Equipment Code & Link */}
                            <div className="flex items-start justify-between gap-1 mb-1">
                              <Link
                                href={`/equipment/molds/${eq.equipment_id}`}
                                className="font-mono font-bold text-[13px] text-teal-700 hover:underline flex items-center gap-1 group truncate"
                                title={eq.equipment_code}
                              >
                                <span className="truncate">{eq.equipment_code}</span>
                                <ExternalLink size={11} className="opacity-0 group-hover:opacity-100 shrink-0" />
                              </Link>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${getTypeBadgeClass(
                                  eq.equipment_type
                                )}`}
                              >
                                {eq.equipment_type}
                              </span>
                            </div>

                            {/* Display Name */}
                            <div className="text-[12px] font-medium text-slate-800 truncate mb-1" title={eq.display_name}>
                              {eq.display_name}
                            </div>
                          </div>

                          {/* Status and footer */}
                          <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <span className={`badge ${getStatusBadgeClass(eq.device_status)} text-[10px] py-0 px-1.5`}>
                                {eq.device_status || 'NORMAL'}
                              </span>
                              {eq.usage_status && (
                                <span className="text-slate-500 font-mono text-[10px]">{eq.usage_status}</span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setMoveTargetEquipment({
                                  equipment_id: eq.equipment_id,
                                  equipment_code: eq.equipment_code,
                                  display_name: eq.display_name,
                                  current_rack_layer_id: layer.id,
                                  current_layer_code: layer.layer_code,
                                  current_rack_code: rack.rack_code_new,
                                  current_location_in_factory: rack.location_in_factory,
                                })
                              }
                              className="btn btn-secondary text-[10px] py-0.5 px-2 flex items-center gap-1 font-semibold text-teal-700 hover:bg-teal-50"
                              title={t('moveBtn')}
                            >
                              <MoveRight size={11} />
                              <span>{t('moveBtn')}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Steel Shelf Bottom Beam (Visual Accent for physical realism) */}
                <div className="h-1.5 bg-slate-300 border-t border-slate-400" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Move Location Modal */}
      {moveTargetEquipment && (
        <LocationMoveModal
          isOpen={!!moveTargetEquipment}
          onClose={() => setMoveTargetEquipment(null)}
          onSuccess={() => {
            setMoveTargetEquipment(null)
            router.refresh()
          }}
          equipment={moveTargetEquipment}
        />
      )}
    </div>
  )
}
