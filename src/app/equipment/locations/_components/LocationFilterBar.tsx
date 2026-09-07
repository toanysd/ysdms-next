'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Search, X, Filter, MapPin } from 'lucide-react'

interface Props {
  zones: string[]
  selectedZone: string
  onSelectZone: (zone: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedStatus: string
  onSelectStatus: (status: string) => void
  zoneCounts: Record<string, number>
  totalRacks: number
}

export default function LocationFilterBar({
  zones,
  selectedZone,
  onSelectZone,
  searchQuery,
  onSearchChange,
  selectedStatus,
  onSelectStatus,
  zoneCounts,
  totalRacks,
}: Props) {
  const t = useTranslations('EquipmentLocations.filter')
  const tZones = useTranslations('EquipmentLocations.zones')

  const hasActiveFilters = selectedZone !== 'ALL' || selectedStatus !== 'ALL' || searchQuery.trim() !== ''

  const handleClear = () => {
    onSelectZone('ALL')
    onSelectStatus('ALL')
    onSearchChange('')
  }

  return (
    <div className="card-flat p-3 flex flex-col gap-2.5">
      {/* Top Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input w-full pl-9 pr-8 text-[13px]"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-slate-200 transition-colors"
              title="Clear"
            >
              <X size={14} style={{ color: 'var(--text-muted)' }} />
            </button>
          )}
        </div>

        {/* Zone Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <MapPin size={15} style={{ color: 'var(--accent)' }} />
          <select
            className="form-input text-[13px] py-1.5 px-2.5 font-medium"
            value={selectedZone}
            onChange={(e) => onSelectZone(e.target.value)}
          >
            <option value="ALL">
              {t('allZones')} ({totalRacks})
            </option>
            {zones.map((z) => {
              let label = z
              try {
                label = tZones(z)
              } catch {
                label = z
              }
              const count = zoneCounts[z] || 0
              return (
                <option key={z} value={z}>
                  {label} ({count})
                </option>
              )
            })}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter size={15} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-input text-[13px] py-1.5 px-2.5"
            value={selectedStatus}
            onChange={(e) => onSelectStatus(e.target.value)}
          >
            <option value="ALL">{t('statusAll')}</option>
            <option value="IN_USE">{t('statusInUse')}</option>
            <option value="EMPTY">{t('statusEmpty')}</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="btn btn-secondary text-[12px] py-1 px-2.5 shrink-0"
          >
            <X size={13} className="mr-1 inline" />
            {t('clearFilter')}
          </button>
        )}
      </div>

      {/* Quick Zone Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[12px] scrollbar-thin">
        <button
          onClick={() => onSelectZone('ALL')}
          className={`px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-all text-[11px] ${
            selectedZone === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t('allZonesShort')} ({totalRacks})
        </button>
        {zones.map((z) => {
          let label = z
          try {
            label = tZones(z)
          } catch {
            label = z
          }
          const count = zoneCounts[z] || 0
          const isSelected = selectedZone === z

          return (
            <button
              key={z}
              onClick={() => onSelectZone(z)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all text-[11px] font-medium flex items-center gap-1 ${
                isSelected
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{z}</span>
              <span
                className={`text-[10px] px-1 rounded-full ${
                  isSelected ? 'bg-teal-800 text-teal-100' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
