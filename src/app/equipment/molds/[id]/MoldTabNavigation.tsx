'use client'

import { useState } from 'react'
import { FileText, MapPin, Truck, Shield, Camera, Wrench } from 'lucide-react'

export type TabId = 'overview' | 'location' | 'transfer' | 'jobs' | 'teflon' | 'photos' | 'maintenance'

export type TabDef = {
  id: TabId
  labelJa: string
  labelVi: string
  icon: typeof FileText
  enabled: boolean
}

/** Registry of all tabs — add new tabs here only */
export const TABS: TabDef[] = [
  { id: 'overview',    labelJa: '概要',       labelVi: 'Tổng quan',    icon: FileText,  enabled: true },
  { id: 'location',    labelJa: '位置・入出庫', labelVi: 'Vị trí',       icon: MapPin,    enabled: true },
  { id: 'transfer',    labelJa: '移動',       labelVi: 'Vận chuyển',   icon: Truck,     enabled: true },
  { id: 'jobs',        labelJa: 'ジョブ',     labelVi: 'Job',          icon: Wrench,    enabled: true },
  { id: 'teflon',      labelJa: 'テフロン',   labelVi: 'Teflon',       icon: Shield,    enabled: false },
  { id: 'photos',      labelJa: '写真',       labelVi: 'Ảnh',          icon: Camera,    enabled: false },
  { id: 'maintenance', labelJa: '保守',       labelVi: 'Bảo trì',     icon: Wrench,    enabled: false },
]

export function MoldTabNavigation({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}) {
  return (
    <div
      className="card-flat"
      style={{
        padding: 0, display: 'flex', gap: 0, overflow: 'hidden',
        borderBottom: '2px solid var(--border-default)',
      }}
    >
      {TABS.filter(t => t.enabled).map((tab) => {
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
            <span>{tab.labelJa}</span>
            <span style={{ fontSize: 9, opacity: 0.6, fontFamily: 'var(--font-main)' }}>
              {tab.labelVi}
            </span>
          </button>
        )
      })}
    </div>
  )
}
