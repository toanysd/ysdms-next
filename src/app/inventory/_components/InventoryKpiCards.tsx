'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Package, AlertTriangle, XCircle, Truck } from 'lucide-react'
import { InventoryKPIs } from '../actions'

interface InventoryKpiCardsProps {
  kpis: InventoryKPIs
  activeStatus?: string
  onStatusClick?: (status: string) => void
}

export function InventoryKpiCards({ kpis, activeStatus, onStatusClick }: InventoryKpiCardsProps) {
  const t = useTranslations('Inventory')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, flexShrink: 0 }}>
      {/* 1. Total Products */}
      <div
        className="card-flat cursor-pointer transition-all hover:shadow-sm"
        style={{
          padding: '12px 14px',
          background: 'var(--tint-teal-bg, #F0FDFA)',
          border: activeStatus === 'ALL' ? '2px solid var(--accent)' : '1px solid #CCFBF1',
        }}
        onClick={() => onStatusClick && onStatusClick('ALL')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent, #0D9488)' }}>
            {t('kpiTotalProducts')}
          </span>
          <Package size={16} style={{ color: 'var(--accent)', opacity: 0.8 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
            {kpis.totalProducts.toLocaleString()}
          </span>
          <span style={{ fontSize: 11, color: '#64748B' }}>
            {t('unitPcs')}
          </span>
        </div>
      </div>

      {/* 2. Total Stock */}
      <div
        className="card-flat"
        style={{
          padding: '12px 14px',
          background: 'var(--tint-blue-bg, #EFF6FF)',
          border: '1px solid #DBEAFE',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#2563EB' }}>
            {t('kpiTotalStock')}
          </span>
          <Package size={16} style={{ color: '#2563EB', opacity: 0.8 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: '#0F172A' }}>
            {kpis.totalStockPcs.toLocaleString()}
          </span>
          <span style={{ fontSize: 11, color: '#64748B' }}>
            {t('unitPcs')}
          </span>
        </div>
      </div>

      {/* 3. Low Stock Alert */}
      <div
        className="card-flat cursor-pointer transition-all hover:shadow-sm"
        style={{
          padding: '12px 14px',
          background: kpis.lowStockCount > 0 ? '#FFFBEB' : 'var(--bg-surface)',
          border: activeStatus === 'LOW_STOCK' ? '2px solid #D97706' : (kpis.lowStockCount > 0 ? '1px solid #FDE68A' : '1px solid var(--border-default)'),
        }}
        onClick={() => onStatusClick && onStatusClick('LOW_STOCK')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706' }}>
            {t('kpiLowStock')}
          </span>
          <AlertTriangle size={16} style={{ color: '#D97706', opacity: 0.8 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: '#92400E' }}>
            {kpis.lowStockCount.toLocaleString()}
          </span>
          <span style={{ fontSize: 11, color: '#B45309', fontWeight: 600 }}>
            {t('unitPcs')}
          </span>
        </div>
      </div>

      {/* 4. Out of Stock */}
      <div
        className="card-flat cursor-pointer transition-all hover:shadow-sm"
        style={{
          padding: '12px 14px',
          background: 'var(--bg-surface)',
          border: activeStatus === 'OUT_OF_STOCK' ? '2px solid #475569' : '1px solid var(--border-default)',
        }}
        onClick={() => onStatusClick && onStatusClick('OUT_OF_STOCK')}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
            {t('kpiOutOfStock')}
          </span>
          <XCircle size={16} style={{ color: '#64748B', opacity: 0.8 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'monospace', color: '#475569' }}>
            {kpis.outOfStockCount.toLocaleString()}
          </span>
          <span style={{ fontSize: 11, color: '#64748B' }}>
            {t('unitPcs')}
          </span>
        </div>
      </div>
    </div>
  )
}
