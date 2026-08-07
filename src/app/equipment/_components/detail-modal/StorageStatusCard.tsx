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
  //    STRICT REAL DATA: Tuyệt đối KHÔNG fallback/mặc định là YSD khi NULL!
  // ══════════════════════════════════════════════════════════════════
  const keeperCompanyId = data.keeper_company_id

  let keeperName = ''
  let isExternalKeeper = false

  if (data.keeper_company) {
    const code = (data.keeper_company.company_code || '').toUpperCase()
    const name = data.keeper_company.company_name || ''
    keeperName = name || code
    if (code !== 'YSD' && !name.includes('YSD') && !name.includes('社内')) {
      isExternalKeeper = true
    }
  } else if (latestLog?.action_type === 'TRANSFER' && latestLog?.to_company) {
    const toName = latestLog.to_company.company_name || latestLog.to_company.company_code
    if (toName) {
      keeperName = toName
      if (!toName.includes('YSD')) isExternalKeeper = true
    }
  } else if (keeperCompanyId) {
    keeperName = 'Keeper Company'
  } else {
    keeperName = '未指定 (Chưa xác định)'
  }

  const rackText = data.rack_layers
    ? formatRackLocationDisplay(data.rack_layers)
    : '未配置 (Chưa gá kệ)'

  // ══════════════════════════════════════════════════════════════════
  // 2. REAL-TIME STATUS — STRICT REAL DATA: Không fallback IN khi NULL!
  const hasRealLog = Boolean(latestStatusLog || latestLog)
  const explicitAction = (latestStatusLog?.status || latestLog?.action_type || '').toUpperCase()

  const confirmDate =
    latestStatusLog?.action_date?.slice(0, 10) ||
    latestLog?.action_date?.slice(0, 10) ||
    data.returned_date ||
    data.entry_date ||
    '未確認 (Chưa có xác nhận)'

  const destinationLoc =
    destinationDisplay ||
    latestStatusLog?.to_location ||
    latestStatusLog?.destinations?.destination_name ||
    latestLog?.to_location ||
    latestLog?.to_company?.company_name ||
    ''

  const isUnverified = data.device_status === 'UNVERIFIED' || data.usage_status === 'UNVERIFIED'

  const isOut =
    explicitAction === 'OUT' ||
    explicitAction === 'CHECK_OUT' ||
    explicitAction === 'TRANSFER' ||
    explicitAction === 'OUT_OF_STOCK' ||
    explicitAction === 'LOAN' ||
    explicitAction === 'MAINTENANCE' ||
    explicitAction === 'BROKEN' ||
    isExternalKeeper

  // ══════════════════════════════════════════════════════════════════
  // 3. BADGE DISPLAY — Rõ ràng 100% từ dữ liệu thực (Không ngầm định IN)
  // ══════════════════════════════════════════════════════════════════
  let statusDisplayLabel = '未設定 (Chưa xác định)'
  let statusBadgeClass = 'badge badge--neutral'

  if (isUnverified) {
    statusDisplayLabel = '未検証 (Chưa kiểm kê thực tế)'
    statusBadgeClass = 'badge badge--neutral'
  } else if (!hasRealLog) {
    statusDisplayLabel = '登録済 (Chưa có nhật ký)'
    statusBadgeClass = 'badge badge--neutral'
  } else if (explicitAction === 'DISPOSED' || explicitAction === 'SCRAP' || data.device_status === 'DISPOSED') {
    statusDisplayLabel = '廃棄 (Đã hủy)'
    statusBadgeClass = 'badge badge--error'
  } else if (explicitAction === 'RETURNED') {
    statusDisplayLabel = '返却済 (Đã trả)'
    statusBadgeClass = 'badge badge--info'
  } else if (explicitAction === 'MAINTENANCE' || explicitAction === 'REPAIR') {
    statusDisplayLabel = 'メンテナンス中 (Đang bảo trì)'
    statusBadgeClass = 'badge badge--warning'
  } else if (isOut) {
    statusDisplayLabel = destinationLoc ? `OUT (${destinationLoc})` : 'OUT (社外/出庫)'
    statusBadgeClass = 'badge badge--warning'
  } else if (explicitAction === 'IN' || explicitAction === 'CHECK_IN' || explicitAction === 'IN_STOCK') {
    statusDisplayLabel = 'IN (社内保管)'
    statusBadgeClass = 'badge badge--success'
  } else {
    statusDisplayLabel = '登録済 (Chưa có nhật ký)'
    statusBadgeClass = 'badge badge--neutral'
  }

  return (
    <div
      className="card-flat"
      style={{
        padding: 14,
        background: isUnverified
          ? 'var(--bg-surface-2)'
          : isExternalKeeper
          ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, var(--bg-surface-2) 100%)'
          : isOut
          ? 'linear-gradient(135deg, var(--tint-orange-bg) 0%, var(--bg-surface-2) 100%)'
          : 'linear-gradient(135deg, var(--tint-teal-bg) 0%, var(--bg-surface-2) 100%)',
        border: isUnverified
          ? '1px dashed var(--border-default)'
          : isExternalKeeper
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
      {/* Header — Title only, no duplicate badges */}
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
          className={statusBadgeClass}
          style={{ fontSize: 10, padding: '3px 10px', fontWeight: 700 }}
        >
          {statusDisplayLabel}
        </span>
      </div>

      {/* Main Grid Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
        {/* Keeper Company */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('keeperCompany')}</span>
          <span style={{
            fontWeight: 700, fontSize: 13,
            color: isExternalKeeper ? 'var(--tint-orange-text)' : keeperCompanyId ? 'var(--text-primary)' : 'var(--text-muted)'
          }}>
            {keeperName}
          </span>
        </div>

        {/* Storage Rack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('returnRack')}</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: data.rack_layers ? 'var(--accent)' : 'var(--text-muted)' }}>
            📍 {rackText}
          </span>
        </div>

        {/* Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('operationStatus')}</span>
          <span style={{
            fontWeight: 700, fontSize: 13,
            color: isOut ? 'var(--tint-orange-text)' : isUnverified ? 'var(--text-muted)' : 'var(--accent)'
          }}>
            {statusDisplayLabel}
          </span>
        </div>

        {/* Confirmation Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{t('lastConfirmation')}</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-secondary)' }}>
            📅 {confirmDate}
          </span>
        </div>
      </div>

      {/* Warning Banner for Unverified Molds */}
      {isUnverified && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            background: 'var(--bg-surface-3)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
            fontSize: 11,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
        >
          <AlertTriangle size={15} style={{ flexShrink: 0, color: '#f59e0b' }} />
          <div>
            ⚠️ Khuôn khởi tạo từ quét thư mục CAD Server — <strong>Chưa xác thực kiểm kê tồn tại vật lý tại xưởng YSD</strong>.
          </div>
        </div>
      )}

      {/* OUT Destination Warning Banner */}
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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
