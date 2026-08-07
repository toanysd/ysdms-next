'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, MapPin } from 'lucide-react'
import { EquipmentDetailData } from './types'
import { formatRackLocationDisplay } from '@/lib/utils/moldNaming'

interface Props {
  data: EquipmentDetailData
  latestLog?: any
  latestStatusLog?: any
  destinationDisplay?: string
}

export default function StorageStatusCard({ data, latestLog, latestStatusLog, destinationDisplay }: Props) {
  const t = useTranslations('EquipmentDetailModal')

  // ══════════════════════════════════════════════════════════════════
  // 1. KEEPER COMPANY — Công ty đang giữ khuôn vật lý thực tế
  //    keeper_company_id → companies (khác với company_id = owner/customer)
  //    Ưu tiên: keeper_company_id (DB) > latest TRANSFER in history > YSD default
  // ══════════════════════════════════════════════════════════════════
  const ownerCompanyId = data.company_id
  const keeperCompanyId = data.keeper_company_id

  let keeperName = 'YSD'
  let isExternalKeeper = false

  if (keeperCompanyId && keeperCompanyId !== ownerCompanyId && data.keeper_company) {
    const code = (data.keeper_company.company_code || '').toUpperCase()
    const name = data.keeper_company.company_name || ''
    if (code !== 'YSD' && !name.includes('YSD') && !name.includes('社内')) {
      keeperName = name || code
      isExternalKeeper = true
    }
  } else if (latestLog?.action_type === 'TRANSFER' && latestLog?.to_company) {
    const toName = latestLog.to_company.company_name || latestLog.to_company.company_code
    if (toName && !toName.includes('YSD')) {
      keeperName = toName
      isExternalKeeper = true
    }
  }

  const rackText = formatRackLocationDisplay(data.rack_layers)

  // ══════════════════════════════════════════════════════════════════
  // 2. REAL-TIME STATUS — Ưu tiên: equipment_status_logs > equipment_history > DB fields
  //    equipment_status_logs chứa lịch sử CHECK_IN/CHECK_OUT hàng ngày (statuslogs gốc)
  // ══════════════════════════════════════════════════════════════════
  const latestActionType = (
    latestStatusLog?.status ||
    latestLog?.action_type ||
    data.usage_status ||
    data.device_status ||
    ''
  ).toUpperCase()

  const confirmDate =
    latestStatusLog?.action_date?.slice(0, 10) ||
    latestLog?.action_date?.slice(0, 10) ||
    data.returned_date ||
    data.entry_date ||
    '—'

  // Destination = where the mold was taken to
  const destinationLoc =
    destinationDisplay ||
    latestStatusLog?.to_location ||
    latestStatusLog?.destinations?.destination_name ||
    latestLog?.to_location ||
    latestLog?.to_company?.company_name ||
    ''

  const isOut =
    latestActionType === 'OUT' ||
    latestActionType === 'CHECK_OUT' ||
    latestActionType === 'TRANSFER' ||
    latestActionType === 'OUT_OF_STOCK' ||
    latestActionType === 'LOAN' ||
    latestActionType === 'MAINTENANCE' ||
    latestActionType === 'BROKEN' ||
    latestActionType === 'DISPOSED' ||
    isExternalKeeper

  // ══════════════════════════════════════════════════════════════════
  // 3. BADGE DISPLAY
  // ══════════════════════════════════════════════════════════════════
  let statusDisplayLabel = 'IN (社内保管)'
  let statusBadgeClass = 'badge badge--success'

  if (latestActionType === 'DISPOSED' || latestActionType === 'SCRAP') {
    statusDisplayLabel = '廃棄 (Đã hủy)'
    statusBadgeClass = 'badge badge--error'
  } else if (latestActionType === 'RETURNED') {
    statusDisplayLabel = '返却済 (Đã trả)'
    statusBadgeClass = 'badge badge--info'
  } else if (latestActionType === 'MAINTENANCE' || latestActionType === 'REPAIR') {
    statusDisplayLabel = 'メンテナンス中 (Đang bảo trì)'
    statusBadgeClass = 'badge badge--warning'
  } else if (isOut) {
    statusDisplayLabel = destinationLoc ? `OUT (${destinationLoc})` : 'OUT (社外/出庫)'
    statusBadgeClass = 'badge badge--warning'
  } else {
    statusDisplayLabel = 'IN (社内保管)'
    statusBadgeClass = 'badge badge--success'
  }

  return (
    <div
      className="card-flat"
      style={{
        padding: 14,
        background: isExternalKeeper
          ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, var(--bg-surface-2) 100%)'
          : isOut
          ? 'linear-gradient(135deg, var(--tint-orange-bg) 0%, var(--bg-surface-2) 100%)'
          : 'linear-gradient(135deg, var(--tint-teal-bg) 0%, var(--bg-surface-2) 100%)',
        border: isExternalKeeper
          ? '1.5px solid var(--tint-orange-border)'
          : isOut
          ? '1px solid var(--tint-orange-border)'
          : '1px solid var(--tint-teal-border)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}
    >
      {/* Header — 2 Separate Badges: 1. IN/OUT Status, 2. Keeper Company */}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Badge 1: Movement Status (IN / OUT) */}
          <span
            className={statusBadgeClass}
            style={{ fontSize: 10, padding: '3px 10px', fontWeight: 700 }}
          >
            {statusDisplayLabel}
          </span>

          {/* Badge 2: Keeper Company */}
          <span
            className={isExternalKeeper ? 'badge badge--error' : 'badge badge--info'}
            style={{ fontSize: 10, padding: '3px 10px', fontWeight: 700 }}
          >
            🏢 {keeperName}
          </span>
        </div>
      </div>

      {/* Main Grid Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
        {/* Keeper Company (Công ty lưu trữ hiện tại) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('keeperCompany')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              className={isExternalKeeper ? 'badge badge--error' : 'badge badge--info'}
              style={{ fontSize: 11, padding: '2px 8px', fontWeight: 700 }}
            >
              {keeperName} {isExternalKeeper ? '(社外保管)' : '(社内)'}
            </span>
          </div>
        </div>

        {/* Storage Rack (Vị trí kệ gốc) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('returnRack')}</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: 'var(--accent)' }}>
            📍 {rackText}
          </span>
        </div>

        {/* Status (Trạng thái Xuất / Nhập) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('operationStatus')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className={statusBadgeClass} style={{ fontSize: 11, fontWeight: 700 }}>
              {statusDisplayLabel}
            </span>
          </div>
        </div>

        {/* Confirmation Date (Ngày cập nhật / xác nhận gần nhất) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('lastConfirmation')}</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-secondary)' }}>
            📅 {confirmDate}
          </span>
        </div>
      </div>

      {/* OUT Destination Warning Banner (Matching SACT v9: 🔴 一時持出中 現在地: 台湾成形) */}
      {isOut && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 6,
            background: 'rgba(254, 243, 199, 0.85)',
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
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1, color: '#f97316' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#c2410c' }}>
              🔴 一時持出中 (Khuôn đang tạm thời được lấy mang ra ngoài)
            </div>
            <div>
              現在地 (Vị trí hiện tại): <strong>{destinationLoc || keeperName || '社外'}</strong>
            </div>
            <div>
              返却時は元の棚 <strong>{rackText}</strong> に戻してください。
              <span style={{ fontSize: 10, opacity: 0.85, marginLeft: 4 }}>(Vị trí khi trả về là {rackText})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
