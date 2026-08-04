import { useTranslations } from 'next-intl'

export type TabId = 'overview' | 'order_lines' | 'production_instructions' | 'shipments'

type Props = {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const TABS: { id: TabId; key: 'Tabs.overview' | 'Tabs.order_lines' | 'Tabs.production_instructions' | 'Tabs.shipments' }[] = [
  { id: 'overview', key: 'Tabs.overview' },
  { id: 'order_lines', key: 'Tabs.order_lines' },
  { id: 'production_instructions', key: 'Tabs.production_instructions' },
  { id: 'shipments', key: 'Tabs.shipments' },
]

export function OrderTabNavigation({ activeTab, onTabChange }: Props) {
  const t = useTranslations('Orders')

  return (
    <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--border-default)', marginTop: 8 }}>
      {TABS.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '12px 8px',
              cursor: 'pointer',
              position: 'relative',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>
              {t(tab.key)}
            </span>
            {isActive && (
              <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--accent)', borderRadius: '2px 2px 0 0' }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
