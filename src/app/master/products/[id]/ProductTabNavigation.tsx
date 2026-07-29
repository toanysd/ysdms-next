'use client'

import { FileText, ShoppingCart, Layers } from 'lucide-react'

import { useTranslations } from 'next-intl'

export type TabId = 'overview' | 'orders' | 'designs'

export type TabDef = {
  id: TabId
  tKey: string
  icon: typeof FileText
  enabled: boolean
}

export const TABS: TabDef[] = [
  { id: 'overview',    tKey: 'overview',       icon: FileText,      enabled: true },
  { id: 'orders',      tKey: 'orders',         icon: ShoppingCart,  enabled: true },
  { id: 'designs',     tKey: 'designs',        icon: Layers,        enabled: true },
]

export function ProductTabNavigation({
  activeTab,
  onTabChange,
}: {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}) {
  const t = useTranslations('Master.Products.Tabs')
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
              background: isActive ? 'var(--bg-surface)' : 'transparent',
              borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -2,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              fontWeight: isActive ? 700 : 500,
              fontSize: 12,
              fontFamily: 'var(--font-jp)',
              transition: 'all 0.15s ease',
            }}
          >
            <Icon size={14} />
            <span>{t(tab.tKey)}</span>
          </button>
        )
      })}
    </div>
  )
}
