'use client'

import { FileText, ShoppingCart, Layers } from 'lucide-react'

export type TabId = 'overview' | 'orders' | 'designs'

export type TabDef = {
  id: TabId
  labelJa: string
  labelVi: string
  icon: typeof FileText
  enabled: boolean
}

export const TABS: TabDef[] = [
  { id: 'overview',    labelJa: '概要',       labelVi: 'Tổng quan',    icon: FileText,      enabled: true },
  { id: 'orders',      labelJa: '注文履歴',   labelVi: 'Đơn hàng',     icon: ShoppingCart,  enabled: true },
  { id: 'designs',    labelJa: '設計一覧',   labelVi: 'Thiết kế',     icon: Layers,        enabled: true },
]

export function ProductTabNavigation({
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
