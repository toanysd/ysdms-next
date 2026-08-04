'use client'

import { ListTodo, FileText, History } from 'lucide-react'
import { useTranslations } from 'next-intl'

export type TabId = 'overview' | 'steps' | 'logs'

export function JobTabNavigation({
  activeTab, onTabChange
}: {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}) {
  const tEquipment = useTranslations('Equipment')

  const tabs: { id: TabId; labelKey: 'overview' | 'steps' | 'logs'; icon: any }[] = [
    { id: 'overview', labelKey: 'overview', icon: FileText },
    { id: 'steps', labelKey: 'steps', icon: ListTodo },
    { id: 'logs', labelKey: 'logs', icon: History },
  ]

  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {tabs.map(tab => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: isActive ? 'var(--bg-surface)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              fontSize: 12,
              fontWeight: isActive ? 700 : 500,
              fontFamily: 'var(--font-jp)',
              borderTopLeftRadius: 'var(--radius-md)',
              borderTopRightRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              borderTop: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              boxShadow: isActive ? '0 -2px 10px rgba(0,0,0,0.02)' : 'none',
            }}
          >
            <Icon size={14} />
            {tEquipment(`tabs.${tab.labelKey}`)}
          </button>
        )
      })}
    </div>
  )
}
