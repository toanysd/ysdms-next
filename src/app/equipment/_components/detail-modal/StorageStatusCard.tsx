'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, MapPin, Building2, Layers } from 'lucide-react'
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
  // 1. Vị trí gá kệ cố định tại YSD (Registered Rack-Layer at YSD)
  //    Khi khuôn mang từ nơi khác về YSD sẽ cất vào kệ này
  // ══════════════════════════════════════════════════════════════════
  const rackText = data.rack_layers
    ? formatRackLocationDisplay(data.rack_layers)
    : '未配置 (Chưa gá kệ)'

  // ══════════════════════════════════════════════════════════════════
  // 2. Công ty đang giữ khuôn tại thời điểm hiện tại (Keeper Company)
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

  // ══════════════════════════════════════════════════════════════════
  // 3. Trạng thái lưu trữ tại YSD (IN hay OUT)
  // ══════════════════════════════════════════════════════════════════
  const hasRealLog = Boolean(latestStatusLog || latestLog)
  const explicitAction = (latestStatusLog?.status || latestLog?.action_type || '').toUpperCase()
  const isUnverified = data.device_status === 'UNVERIFIED' || data.usage_status === 'UNVERIFIED'

  const destinationLoc =
    destinationDisplay ||
    latestStatusLog?.to_location ||
    latestStatusLog?.destinations?.destination_name ||
    latestLog?.to_location ||
    latestLog?.to_company?.company_name ||
    ''

  const isOut =
    explicitAction === 'OUT' ||
    explicitAction === 'CHECK_OUT' ||
    explicitAction === 'TRANSFER' ||
    explicitAction === 'OUT_OF_STOCK' ||
    explicitAction === 'LOAN' ||
    explicitAction === 'MAINTENANCE' ||
    explicitAction === 'BROKEN' ||
    isExternalKeeper

  // Badge Status Determination
  let statusBadgeLabel = 'IN (社内保管)'
  let statusBadgeClass = 'badge badge--success'

  if (isUnverified) {
    statusBadgeLabel = '未検証 (Chưa kiểm kê)'
    statusBadgeClass = 'badge badge--neutral'
  } else if (isOut) {
    statusBadgeLabel = 'OUT (社外/出庫)'
    statusBadgeClass = 'badge badge--warning'
  } else if (hasRealLog && (explicitAction === 'IN' || explicitAction === 'CHECK_IN' || explicitAction === 'RETURN')) {
    statusBadgeLabel = 'IN (社内保管)'
    statusBadgeClass = 'badge badge--success'
  } else {
    // Verified record stored at YSD
    statusBadgeLabel = 'IN (社内保管)'
    statusBadgeClass = 'badge badge--success'
  }

  return (
    <div
      className="card-flat"
      style={{
        padding: 14,
        background: isUnverified
          ? 'var(--bg-surface-2)'
          : isExternalKeeper || isOut
          ? 'linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, var(--bg-surface-2) 100%)'
          : 'linear-gradient(135deg, var(--tint-teal-bg) 0%, var(--bg-surface-2) 100%)',
        border: isUnverified
          ? '1px dashed var(--border-default)'
          : isExternalKeeper || isOut
          ? '1px solid var(--tint-orange-border)'
          : '1px solid var(--tint-teal-border)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}
    >
      {/* Card Header: Title + IN/OUT Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 8
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
          <MapPin size={16} />
          <span>保管・所在情報 (Thông tin Bảo quản & Vị trí)</span>
        </div>

        {/* Badge Trạng Thái IN / OUT / 未検証 */}
        <span className={statusBadgeClass} style={{ fontSize: 11, padding: '3px 12px', fontWeight: 700 }}>
          {statusBadgeLabel}
        </span>
      </div>

      {/* Main 2-Column Storage Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 13 }}>

        {/* 1. Vị trí gá kệ tại YSD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Layers size={13} style={{ color: 'var(--accent)' }} />
            YSD定位置 (Vị trí gá kệ YSD):
          </span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: data.rack_layers ? 'var(--accent)' : 'var(--text-muted)' }}>
            📍 {rackText}
          </span>
        </div>

        {/* 2. Công ty đang giữ khuôn (Keeper Company Badge) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Building2 size={13} style={{ color: 'var(--accent)' }} />
            保管会社 (Đơn vị lưu giữ):
          </span>
          <div>
            <span
              className={isExternalKeeper ? 'badge badge--error' : keeperCompanyId ? 'badge badge--info' : 'badge badge--neutral'}
              style={{ fontSize: 11, padding: '3px 10px', fontWeight: 700 }}
            >
              🏢 {keeperName}
            </span>
          </div>
        </div>

      </div>

      {/* Nhắc nhở/Thông tin nơi đến khi OUT */}
      {isOut && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            background: 'rgba(254, 243, 199, 0.85)',
            border: '1px solid var(--tint-orange-border)',
            color: 'var(--tint-orange-text)',
            fontSize: 11,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            marginTop: 2
          }}
        >
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: '#f97316' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#c2410c' }}>
              🔴 社外持出中 (Khuôn đang được mượn/chuyển đi)
            </div>
            <div>
              現在地 (Nơi đến hiện tại): <strong>{destinationLoc || keeperName || '社外'}</strong>
            </div>
            <div>
              ※ 返却時はYSD定位置 <strong>{rackText}</strong> に戻してください。(Khi trả về YSD hãy cất vào kệ <strong>{rackText}</strong>).
            </div>
          </div>
        </div>
      )}

      {/* Nhắc nhở khi khuôn do Công ty bên ngoài lưu giữ */}
      {!isOut && isExternalKeeper && (
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            background: 'rgba(254, 243, 199, 0.85)',
            border: '1px solid var(--tint-orange-border)',
            color: 'var(--tint-orange-text)',
            fontSize: 11,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            marginTop: 2
          }}
        >
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: '#f97316' }} />
          <div>
            ⚠️ <strong>社外保管注意:</strong> Khuôn hiện đang được bảo quản tại công ty bên ngoài: <strong>{keeperName}</strong>.
          </div>
        </div>
      )}

      {/* Thông báo cho khuôn CAD chưa kiểm kê */}
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
            ⚠️ Khuôn khởi tạo từ CAD Server — Chưa xác thực kiểm kê thực tế tại xưởng YSD.
          </div>
        </div>
      )}
    </div>
  )
}
