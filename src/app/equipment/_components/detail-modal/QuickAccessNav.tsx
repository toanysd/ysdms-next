'use client'

import React from 'react'
import Link from 'next/link'
import {
  PenTool, Building2, Package, Layers, Truck, History, Sparkles
} from 'lucide-react'
import { EquipmentDetailData } from './types'

interface Props {
  data: EquipmentDetailData
  onClose: () => void
}

export default function QuickAccessNav({ data, onClose }: Props) {
  const productId = data.design_revisions?.products?.product_code
  const companyId = data.company_id || data.keeper_company_id

  const navItems = [
    {
      label: 'Design',
      labelJA: '設計',
      icon: PenTool,
      href: data.design_revision_id ? `/engineering/revisions?id=${data.design_revision_id}` : '/engineering/revisions',
      bg: 'var(--tint-blue-bg)',
      color: 'var(--tint-blue-text)'
    },
    {
      label: 'Customer',
      labelJA: '得意先',
      icon: Building2,
      href: companyId ? `/master/customers/${companyId}` : '/master/customers',
      bg: 'var(--tint-purple-bg)',
      color: 'var(--tint-purple-text)'
    },
    {
      label: 'Product',
      labelJA: '製品',
      icon: Package,
      href: productId ? `/master/products?search=${productId}` : '/master/products',
      bg: 'var(--tint-orange-bg)',
      color: 'var(--tint-orange-text)'
    },
    {
      label: 'Storage',
      labelJA: '位置',
      icon: Layers,
      href: '/equipment/unified',
      bg: 'var(--tint-teal-bg)',
      color: 'var(--tint-teal-text)'
    },
    {
      label: 'Transfer',
      labelJA: '輸送',
      icon: Truck,
      href: '/equipment/jobs',
      bg: 'var(--tint-blue-bg)',
      color: 'var(--tint-blue-text)'
    },
    {
      label: 'History',
      labelJA: '履歴',
      icon: History,
      href: `/equipment/unified/${data.equipment_id}`,
      bg: 'var(--bg-surface-2)',
      color: 'var(--text-primary)'
    },
    {
      label: 'Teflon',
      labelJA: 'テフロン',
      icon: Sparkles,
      href: '/equipment/jobs?category=teflon',
      bg: 'var(--tint-purple-bg)',
      color: 'var(--tint-purple-text)'
    }
  ]

  return (
    <div
      className="card-flat"
      style={{
        padding: 12,
        background: 'var(--bg-surface-2)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--accent)',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 4
        }}
      >
        🚀 クイックアクセス (TRUY CẬP NHANH MODULE)
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {navItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <Link
              key={idx}
              href={item.href}
              onClick={onClose}
              style={{
                background: item.bg,
                color: item.color,
                border: '1px solid var(--border-subtle)',
                borderRadius: 6,
                padding: '6px 4px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} />
              <span style={{ fontSize: 10, fontWeight: 700 }}>{item.label}</span>
              <span style={{ fontSize: 9, opacity: 0.75 }}>{item.labelJA}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
