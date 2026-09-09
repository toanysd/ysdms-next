'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Package, Layers, Info } from 'lucide-react'

export function InventoryHeader() {
  const t = useTranslations('Inventory')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
      {/* Title & Tab Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--tint-teal-bg, #F0FDFA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #CCFBF1',
            }}
          >
            <Package size={20} style={{ color: 'var(--accent, #0D9488)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
              {t('pageTitle')}
            </h1>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {t('pageSubtitle')}
            </span>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="tab-nav" style={{ margin: 0 }}>
          <button className="tab-item tab-item--active" style={{ cursor: 'default' }}>
            <Package size={14} />
            <span>{t('tabFinishedGoods')}</span>
          </button>
          <Link href="/plastics/inventory" className="tab-item" style={{ textDecoration: 'none' }}>
            <Layers size={14} />
            <span>{t('tabRawMaterials')}</span>
          </Link>
        </div>
      </div>

      {/* Callout Notice: Nippo Calculation */}
      <div
        className="card-flat"
        style={{
          background: 'var(--tint-blue-bg, #EFF6FF)',
          border: '1px solid #BFDBFE',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderRadius: 6,
        }}
      >
        <Info size={16} style={{ color: '#2563EB', flexShrink: 0 }} />
        <span style={{ fontSize: 12, color: '#1E40AF', lineHeight: 1.4 }}>
          {t('bannerNotice')}
        </span>
      </div>
    </div>
  )
}
