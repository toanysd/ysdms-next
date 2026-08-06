'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, Building2, MapPin } from 'lucide-react'
import { EquipmentDetailData } from './types'
import { formatRackLocationDisplay } from '@/lib/utils/moldNaming'

interface Props {
  data: EquipmentDetailData
}

export default function StorageStatusCard({ data }: Props) {
  const t = useTranslations('EquipmentDetailModal')

  const keeperName = data.keeper_company?.company_name || data.keeper_company?.company_code || 'YSD'
  const isExternalKeeper = Boolean(
    data.keeper_company_id &&
    keeperName.toUpperCase() !== 'YSD' &&
    !keeperName.includes('社内')
  )

  const rackText = formatRackLocationDisplay(data.rack_layers)
  const statusStr = data.usage_status || data.device_status || 'IN_STOCK'
  const isOut = statusStr === 'OUT' || statusStr === 'LOAN' || isExternalKeeper
  const confirmDate = data.returned_date || data.entry_date || (data as any).updated_at?.slice(0, 10) || new Date().toISOString().slice(0, 10)

  return (
    <div
      className="card-flat"
      style={{
        padding: 14,
        background: isExternalKeeper
          ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, var(--bg-surface-2) 100%)'
          : 'linear-gradient(135deg, var(--tint-teal-bg) 0%, var(--bg-surface-2) 100%)',
        border: isExternalKeeper
          ? '1.5px solid var(--tint-orange-border)'
          : '1px solid var(--tint-teal-border)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 6
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
          <MapPin size={15} />
          <span>{t('storageStatusTitle')}</span>
        </div>

        <span
          className={isOut ? 'badge badge--warning' : 'badge badge--success'}
          style={{ fontSize: 10, padding: '2px 8px', fontWeight: 700 }}
        >
          {isOut ? t('statusOut') : t('statusIn')}
        </span>
      </div>

      {/* Main Grid Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
        {/* Keeper Company */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('keeperCompany')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              className={isExternalKeeper ? 'badge badge--error' : 'badge badge--info'}
              style={{ fontSize: 10, padding: '2px 8px', fontWeight: 700 }}
            >
              {keeperName}
            </span>
          </div>
        </div>

        {/* Storage Rack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('returnRack')}</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>
            📍 {rackText}
          </span>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('operationStatus')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className={isOut ? 'badge badge--warning' : 'badge badge--success'} style={{ fontSize: 10, fontWeight: 700 }}>
              {statusStr} ({confirmDate})
            </span>
          </div>
        </div>

        {/* Confirmation Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('lastConfirmation')}</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-secondary)' }}>
            📅 {confirmDate}
          </span>
        </div>
      </div>

      {/* Warning Alert Box for External Keeper */}
      {isExternalKeeper && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            background: 'var(--tint-orange-bg)',
            border: '1px solid var(--tint-orange-border)',
            color: 'var(--tint-orange-text)',
            fontSize: 11,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            marginTop: 4
          }}
        >
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            {t('externalStorageWarning', { company: keeperName, rack: rackText })}
          </div>
        </div>
      )}
    </div>
  )
}
