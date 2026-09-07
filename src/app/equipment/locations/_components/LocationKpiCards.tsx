'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Layers, Grid3X3, Box, CheckCircle2 } from 'lucide-react'
import type { LocationKpis } from '../actions'

interface Props {
  kpis: LocationKpis
}

export default function LocationKpiCards({ kpis }: Props) {
  const t = useTranslations('EquipmentLocations.kpi')

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. 総ラック数 */}
      <div className="card-flat p-3 flex items-center justify-between" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div>
          <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
            {t('totalRacks')}
          </div>
          <div className="text-[20px] font-bold mt-0.5" style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
            {kpis.totalRacks}
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--tint-teal-bg)', color: 'var(--accent)' }}
        >
          <Layers size={18} />
        </div>
      </div>

      {/* 2. 総棚段数 */}
      <div className="card-flat p-3 flex items-center justify-between" style={{ borderLeft: '4px solid #3B82F6' }}>
        <div>
          <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
            {t('totalLayers')}
          </div>
          <div className="text-[20px] font-bold mt-0.5" style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
            {kpis.totalLayers}
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--tint-blue-bg)', color: '#3B82F6' }}
        >
          <Grid3X3 size={18} />
        </div>
      </div>

      {/* 3. 保管中設備 */}
      <div className="card-flat p-3 flex items-center justify-between" style={{ borderLeft: '4px solid #10B981' }}>
        <div>
          <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
            {t('storedEquipment')}
          </div>
          <div className="text-[20px] font-bold mt-0.5" style={{ color: '#059669', fontFamily: 'monospace' }}>
            {kpis.totalEquipment.toLocaleString()}
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10B981' }}
        >
          <Box size={18} />
        </div>
      </div>

      {/* 4. 棚使用率 */}
      <div className="card-flat p-3 flex items-center justify-between" style={{ borderLeft: '4px solid #8B5CF6' }}>
        <div>
          <div className="text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
            {t('occupancyRate')}
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-[20px] font-bold" style={{ color: '#7C3AED', fontFamily: 'monospace' }}>
              {kpis.occupancyRate}%
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              ({kpis.occupiedLayers}/{kpis.totalLayers})
            </span>
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--tint-purple-bg)', color: '#8B5CF6' }}
        >
          <CheckCircle2 size={18} />
        </div>
      </div>
    </div>
  )
}
