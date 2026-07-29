'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FileText, MapPin, Truck, Shield, Camera, Wrench } from 'lucide-react'

export type TabId = 'overview' | 'location' | 'transfer' | 'jobs' | 'teflon' | 'photos' | 'maintenance'

export type TabDef = {
  id: TabId
  labelKey: string
  icon: typeof FileText
  enabled: boolean
}

export function MoldTabNavigation({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}) {
  const t = useTranslations('Equipment')
  const tabs: TabDef[] = [
    { id: 'overview',    labelKey: 'tabOverview',       icon: FileText,  enabled: true },
    { id: 'location',    labelKey: 'tabLocation',       icon: MapPin,    enabled: true },
    { id: 'transfer',    labelKey: 'tabTransfer',       icon: Truck,     enabled: true },
    { id: 'jobs',        labelKey: 'tabJobs',           icon: Wrench,    enabled: true },
    { id: 'teflon',      labelKey: 'tabTeflon',         icon: Shield,    enabled: false },
    { id: 'photos',      labelKey: 'tabPhotos',         icon: Camera,    enabled: false },
    { id: 'maintenance', labelKey: 'tabMaintenance',    icon: Wrench,    enabled: false },
  ]

  return (
    <div
      className="card-flat"
      style={{
        padding: 0, display: 'flex', gap: 0, overflow: 'hidden',
        borderBottom: '2px solid var(--border-default)',
      }}
    >
      {tabs.filter(t => t.enabled).map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 14px', border: 'none', cursor: 'pointer',
              background: isActive
                ? 'var(--bg-surface)'
                : 'transparent',
              borderBottom: isActive
                ? '2px solid var(--accent)'
                : '2px solid transparent',
              marginBottom: -2,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: 12,
              fontFamily: 'var(--font-jp)',
              transition: 'all 0.15s ease',
            }}
          >
            <Icon size={14} />
            <span>{t(tab.labelKey as any)}</span>
          </button>
        )
      })}
    </div>
  )
}
