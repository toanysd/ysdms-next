'use client'

import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronRight, MapPin, Layers, Box, Inbox } from 'lucide-react'
import type { RackSummary } from '../actions'

interface Props {
  racks: RackSummary[]
}

export default function RackCardGrid({ racks }: Props) {
  const t = useTranslations('EquipmentLocations.rackCard')
  const tZones = useTranslations('EquipmentLocations.zones')

  if (racks.length === 0) {
    return (
      <div className="card-flat p-12 text-center flex flex-col items-center justify-center">
        <Inbox size={40} style={{ color: 'var(--text-muted)', opacity: 0.5 }} className="mb-2" />
        <div className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
          {t('noRacksFound')}
        </div>
        <div className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
          {t('noRacksFoundSub')}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
      {racks.map((rack) => {
        let zoneLabel = rack.zone_code
        try {
          zoneLabel = tZones(rack.zone_code)
        } catch {
          zoneLabel = rack.zone_code
        }

        const isOccupied = rack.total_equipment > 0
        const occupiedLayersCount = rack.layers.filter((l) => l.equipment_count > 0).length

        return (
          <Link
            key={rack.id}
            href={`/equipment/locations/${rack.id}`}
            className="card-flat p-3.5 flex flex-col justify-between hover:shadow-md transition-all duration-150 hover:-translate-y-0.5 border border-slate-200 group no-underline text-inherit"
            style={{ textDecoration: 'none' }}
          >
            <div>
              {/* Header: New Code, Zone Badge, Legacy Code */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-[16px] font-extrabold tracking-tight group-hover:text-teal-700 transition-colors"
                    style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}
                  >
                    {rack.rack_code_new}
                  </span>
                  {/* Legacy Circle/Name */}
                  <span
                    className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 font-medium"
                    style={{ color: 'var(--text-muted)' }}
                    title={t('legacyRef')}
                  >
                    {rack.rack_code} {rack.rack_name !== rack.rack_code && rack.rack_name ? `(${rack.rack_name})` : ''}
                  </span>
                </div>

                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: 'var(--tint-teal-bg)', color: 'var(--accent)' }}
                >
                  {rack.zone_code}
                </span>
              </div>

              {/* Location in factory */}
              <div
                className="flex items-center gap-1 text-[11px] mb-3 truncate"
                style={{ color: 'var(--text-muted)' }}
                title={rack.location_in_factory}
              >
                <MapPin size={12} className="shrink-0" style={{ color: 'var(--accent)' }} />
                <span className="truncate">{rack.location_in_factory}</span>
              </div>

              {/* Mini Shelf Visualizer (Stacked horizontal bars from top layer to layer 1) */}
              <div className="bg-slate-50 p-2 rounded border border-slate-100 mb-3 flex flex-col gap-1">
                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-0.5">
                  <span>{t('miniShelfTitle')}</span>
                  <span>
                    {occupiedLayersCount}/{rack.total_layers} {t('layersOccupied')}
                  </span>
                </div>
                <div className="flex flex-col-reverse gap-1">
                  {rack.layers.map((l) => {
                    const hasEq = l.equipment_count > 0
                    return (
                      <div
                        key={l.id}
                        className={`h-2.5 rounded-sm flex items-center px-1.5 justify-between text-[9px] font-mono transition-colors ${
                          hasEq
                            ? 'bg-teal-600 text-white font-bold'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                        title={`${l.layer_code}: ${l.equipment_count} ${t('equipmentUnit')}`}
                      >
                        <span className="leading-none text-[8px] opacity-90">L{l.layer_number}</span>
                        {hasEq && <span className="leading-none text-[8px]">{l.equipment_count}</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Footer: Stats & Navigation Link */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-1.5 font-bold">
                <Box size={14} style={{ color: isOccupied ? '#059669' : 'var(--text-muted)' }} />
                <span
                  style={{
                    color: isOccupied ? '#059669' : 'var(--text-muted)',
                    fontFamily: 'monospace',
                  }}
                >
                  {isOccupied ? `${rack.total_equipment.toLocaleString()} ${t('equipmentUnit')}` : t('emptyShelf')}
                </span>
              </div>

              <div className="flex items-center text-teal-700 font-semibold text-[11px] group-hover:translate-x-0.5 transition-transform">
                <span>{t('viewDetails')}</span>
                <ChevronRight size={14} className="ml-0.5" />
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
