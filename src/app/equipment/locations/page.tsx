'use client'

import React, { useEffect, useState, useTransition, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { MapPin, RefreshCw } from 'lucide-react'
import { getLocationsOverview, type LocationsOverviewData } from './actions'
import LocationKpiCards from './_components/LocationKpiCards'
import LocationFilterBar from './_components/LocationFilterBar'
import RackCardGrid from './_components/RackCardGrid'

export default function EquipmentLocationsPage() {
  const t = useTranslations('EquipmentLocations')
  const [data, setData] = useState<LocationsOverviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Filter states
  const [selectedZone, setSelectedZone] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')

  const loadData = () => {
    setLoading(true)
    startTransition(async () => {
      try {
        const res = await getLocationsOverview()
        setData(res)
      } catch (err) {
        console.error('Failed to load locations overview:', err)
      } finally {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  // Client-side quick filter
  const filteredRacks = useMemo(() => {
    if (!data) return []
    let result = data.racks

    if (selectedZone !== 'ALL') {
      result = result.filter((r) => r.zone_code === selectedZone)
    }

    if (selectedStatus === 'IN_USE') {
      result = result.filter((r) => r.total_equipment > 0)
    } else if (selectedStatus === 'EMPTY') {
      result = result.filter((r) => r.total_equipment === 0)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (r) =>
          r.rack_code_new.toLowerCase().includes(q) ||
          r.rack_code.toLowerCase().includes(q) ||
          r.rack_name.toLowerCase().includes(q) ||
          r.location_in_factory.toLowerCase().includes(q) ||
          r.layers.some((l) => l.layer_code.toLowerCase().includes(q))
      )
    }

    return result
  }, [data, selectedZone, selectedStatus, searchQuery])

  return (
    <div className="flex flex-col h-full gap-3 p-3 md:p-4 overflow-y-auto">
      {/* 1. PageHeader */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--tint-teal-bg)', color: 'var(--accent)' }}
          >
            <MapPin size={20} />
          </div>
          <div>
            <h1
              className="text-[17px] font-bold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {t('title')}
            </h1>
            <p className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={loadData}
          disabled={loading || isPending}
          className="btn btn-secondary text-[12px] flex items-center gap-1 py-1 px-2.5"
          title="Refresh"
        >
          <RefreshCw size={13} className={loading || isPending ? 'animate-spin' : ''} />
          <span>{t('refresh')}</span>
        </button>
      </div>

      {/* 2. KPI Cards */}
      {data && <LocationKpiCards kpis={data.kpis} />}

      {/* 3. Filter Bar */}
      {data && (
        <LocationFilterBar
          zones={data.zones}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onSelectStatus={setSelectedStatus}
          zoneCounts={data.kpis.zoneCounts}
          totalRacks={data.kpis.totalRacks}
        />
      )}

      {/* 4. Main Content Area */}
      <div className="flex-1 min-h-[300px]">
        {loading ? (
          <div className="card-flat p-12 text-center text-slate-400 font-medium">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-teal-600" />
            <p className="text-[13px]">{t('loadingLocations')}</p>
          </div>
        ) : (
          <RackCardGrid racks={filteredRacks} />
        )}
      </div>
    </div>
  )
}
