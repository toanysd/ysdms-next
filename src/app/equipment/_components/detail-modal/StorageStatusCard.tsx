'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, MapPin, Building2, Layers, CalendarCheck, Clock } from 'lucide-react'
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

  // 1. Kệ cất giữ / trả về YSD
  const rackText = data.rack_layers
    ? formatRackLocationDisplay(data.rack_layers)
    : '未配置 (Chưa phân kệ)'

  // 2. Công ty lưu giữ (Keeper Company)
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
  } else if (data.current_rack_layer_id || data.rack_layers) {
    keeperName = 'YSD ((株)ヨシダ成形)'
  } else if (keeperCompanyId) {
    keeperName = 'Keeper Company'
  } else {
    keeperName = '未指定 (Chưa xác định)'
  }

  // 3. Trạng thái Checkin / Checkout (IN / OUT / 未記録)
  const rawStatus = (data.usage_status || data.device_status || (data.cutter_presence === false ? 'OUT' : data.cutter_presence === true ? 'STORAGE' : '') || '').toUpperCase()
  const hasRealLog = Boolean(latestStatusLog || latestLog || rawStatus)
  const explicitAction = (latestStatusLog?.status || latestLog?.action_type || rawStatus).toUpperCase()
  const isUnverified = data.device_status === 'UNVERIFIED' || data.usage_status === 'UNVERIFIED'

  const confirmDate =
    latestStatusLog?.action_date?.slice(0, 10) ||
    latestLog?.action_date?.slice(0, 10) ||
    (data as any).last_action_date ||
    data.returned_date ||
    data.entry_date ||
    (data.created_at ? data.created_at.slice(0, 10) : '未確認')

  const destinationLoc =
    destinationDisplay ||
    latestStatusLog?.to_location ||
    latestStatusLog?.destinations?.destination_name ||
    latestLog?.to_location ||
    latestLog?.to_company?.company_name ||
    (data as any).destination_name ||
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

  // 3 Cấp trạng thái Checkin rõ ràng 100%
  let statusBadgeLabel = ''
  let statusBadgeClass = 'badge badge--neutral'

  if (isUnverified) {
    statusBadgeLabel = '⚠️ 未検証 (Chưa kiểm kê)'
    statusBadgeClass = 'badge badge--neutral'
  } else if (!hasRealLog) {
    // CHƯA CÓ DỮ LIỆU CHECKIN THỰC TẾ
    statusBadgeLabel = '⚪ 未記録 (Chưa có dữ liệu checkin)'
    statusBadgeClass = 'badge badge--neutral'
  } else if (isOut) {
    statusBadgeLabel = '🔴 OUT (社外/出庫)'
    statusBadgeClass = 'badge badge--warning'
  } else if (explicitAction === 'IN' || explicitAction === 'CHECK_IN' || explicitAction === 'RETURN') {
    statusBadgeLabel = '🟢 IN (社内保管)'
    statusBadgeClass = 'badge badge--success'
  } else {
    statusBadgeLabel = '⚪ 未記録 (Chưa có dữ liệu checkin)'
    statusBadgeClass = 'badge badge--neutral'
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
      {/* Title Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: 6
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>
          <MapPin size={16} />
          <span>保管・ステータス (Lưu trữ & Trạng thái Checkin)</span>
        </div>
      </div>

      {/* Main Grid — 2 Columns (4 Fields) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>

        {/* Field 1: 保管会社 (Công ty) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Building2 size={13} style={{ color: 'var(--accent)' }} />
            保管会社 (Công ty):
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

        {/* Field 2: 返却先棚 (Giá trả về YSD) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Layers size={13} style={{ color: 'var(--accent)' }} />
            返却先棚 (Giá trả về YSD):
          </span>
          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: data.rack_layers ? 'var(--accent)' : 'var(--text-muted)' }}>
            📍 {rackText}
          </span>
        </div>

        {/* Field 3: 状態 (Trạng thái Checkin IN/OUT/未記録) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} style={{ color: 'var(--accent)' }} />
            状態 (Trạng thái Checkin):
          </span>
          <div>
            <span className={statusBadgeClass} style={{ fontSize: 11, padding: '3px 10px', fontWeight: 700 }}>
              {statusBadgeLabel}
            </span>
          </div>
        </div>

        {/* Field 4: 確認 (Xác nhận gần nhất) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <CalendarCheck size={13} style={{ color: 'var(--accent)' }} />
            確認 (Xác nhận):
          </span>
          <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 12, color: 'var(--text-secondary)' }}>
            📅 {confirmDate}
          </span>
        </div>

      </div>

      {/* Dòng cảnh báo / Nơi đến khi OUT */}
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
              🔴 社外持出中 (Khuôn đang ở ngoài kho YSD)
            </div>
            <div>
              現在地 (Nơi đến): <strong>{destinationLoc || keeperName || '社外'}</strong>
            </div>
            <div>
              ※ 返却時は返却先棚 <strong>{rackText}</strong> に戻してください。
            </div>
          </div>
        </div>
      )}

      {/* Dòng cảnh báo khi Công ty giữ là đơn vị bên ngoài */}
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
            ⚠️ <strong>社外保管 (tại {keeperName}):</strong> Khuôn đang được lưu giữ bên ngoài. Khi trả về hãy mang tới phòng khuôn của YSD.
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
            ⚠️ Khuôn khởi tạo từ CAD Server — Chưa xác thực kiểm kê tồn tại thực tế tại xưởng YSD.
          </div>
        </div>
      )}
    </div>
  )
}
