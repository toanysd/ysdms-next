export type TabId = 'overview' | 'order_lines' | 'production_instructions' | 'shipments'

type Props = {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const TABS: { id: TabId; label: string; vi: string }[] = [
  { id: 'overview', label: '基本情報', vi: 'Tổng quan' },
  { id: 'order_lines', label: '受注明細', vi: 'Chi tiết đơn hàng' },
  { id: 'production_instructions', label: '製造指示', vi: 'Chỉ thị sản xuất' },
  { id: 'shipments', label: '出荷履歴', vi: 'Lịch sử giao hàng' }
]

export function OrderTabNavigation({ activeTab, onTabChange }: Props) {
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
              padding: '12px 4px',
              cursor: 'pointer',
              position: 'relative',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
              <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
              <span style={{ fontSize: 10, opacity: 0.8 }}>{tab.vi}</span>
            </div>
            {isActive && (
              <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--accent)', borderRadius: '2px 2px 0 0' }} />
            )}
          </button>
        )
      })}
    </div>
  )
}
