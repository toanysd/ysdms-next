'use client'

import React from 'react'
import { ClipboardList, Plus } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface WorkOrderHeaderProps {
  totalCount: number
}

export function WorkOrderHeader({ totalCount }: WorkOrderHeaderProps) {
  const t = useTranslations('WorkOrders')

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-default)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ClipboardList size={22} color="var(--accent)" />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {t('title')}
            </h1>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: 'var(--tint-teal-bg, #F0FDFA)',
                color: 'var(--accent, #0D9488)',
                padding: '2px 8px',
                borderRadius: 10,
                border: '1px solid var(--border-default)',
              }}
            >
              {totalCount} 件
            </span>
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
            真空成形・金型セット指示管理 (Thermoforming Work Orders & Tooling SET)
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link
          href="/production/work-orders/new"
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            padding: '6px 12px',
          }}
        >
          <Plus size={14} />
          <span>{t('new')}</span>
        </Link>
      </div>
    </div>
  )
}
