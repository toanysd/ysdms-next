'use client'

import { FileText, Package, List } from 'lucide-react'

export type TabId = 'overview' | 'docs' | 'lots'

type Props = {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function ShipmentTabNavigation({ activeTab, onTabChange }: Props) {
  const tabs: { id: TabId; labelJa: string; labelVi: string; icon: any }[] = [
    { id: 'overview', labelJa: '概要', labelVi: 'Tổng quan', icon: FileText },
    { id: 'docs', labelJa: '書類', labelVi: 'Hồ sơ/Chứng từ', icon: List },
    { id: 'lots', labelJa: 'ロット', labelVi: 'Lô hàng', icon: Package },
  ]

  return (
    <div className="tab-nav" style={{ flexShrink: 0 }}>
      {tabs.map(t => {
        const active = activeTab === t.id
        const Icon = t.icon
        return (
          <button
            key={t.id}
            className={`tab-item ${active ? 'active' : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            <Icon size={14} className="tab-icon" />
            <span className="ja">{t.labelJa}</span>
            <span className="vi">{t.labelVi}</span>
          </button>
        )
      })}
    </div>
  )
}
