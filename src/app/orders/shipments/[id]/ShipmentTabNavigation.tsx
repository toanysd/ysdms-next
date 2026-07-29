'use client'

import { useTranslations } from 'next-intl'
import { FileText, Package, List } from 'lucide-react'

export type TabId = 'overview' | 'docs' | 'lots'

type Props = {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function ShipmentTabNavigation({ activeTab, onTabChange }: Props) {
  const t = useTranslations('Shipments')
  
  const tabs: { id: TabId; labelKey: string; icon: any }[] = [
    { id: 'overview', labelKey: 'tabOverview', icon: FileText },
    { id: 'docs', labelKey: 'tabDocs', icon: List },
    { id: 'lots', labelKey: 'tabLots', icon: Package },
  ]

  return (
    <div className="tab-nav" style={{ flexShrink: 0 }}>
      {tabs.map(tab => {
        const active = activeTab === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            className={`tab-item ${active ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon size={14} className="tab-icon" />
            <span>{t(tab.labelKey as any)}</span>
          </button>
        )
      })}
    </div>
  )
}
