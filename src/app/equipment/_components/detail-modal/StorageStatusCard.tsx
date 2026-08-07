'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, MapPin, CheckCircle2, FileQuestion, History, Building2 } from 'lucide-react'
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
  // 1. Storage Location & Custody (所在・保管場所)
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
    : '未配置 (Chưa phân kệ)'

  // ══════════════════════════════════════════════════════════════════
  // 2. Physical Inventory Verification (物理検証ステータス)
  // ══════════════════════════════════════════════════════════════════
  const isUnverified = data.device_status === 'UNVERIFIED' || data.usage_status === 'UNVERIFIED'
  const isDisposed = data.device_status === 'DISPOSED' || data.usage_status === 'DISPOSED'

  // ══════════════════════════════════════════════════════════════════
  // 3. Last Check-in/out Operation Log (入出庫履歴)
  // ══════════════════════════════════════════════════════════════════
  const hasRealLog = Boolean(latestStatusLog || latestLog)
  const explicitAction = (latestStatusLog?.status || latestLog?.action_type || '').toUpperCase()

  const confirmDate =
    latestStatusLog?.action_date?.slice(0, 10) ||
    latestLog?.action_date?.slice(0, 10) ||
    data.returned_date ||
    data.entry_date ||
    null

  const performerName =
    latestStatusLog?.employees?.employee_name ||
    latestLog?.employees?.employee_name ||
    null

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

  return (
    <div
      className="card-flat"
      style={{
        padding: 12,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
          <MapPin size={15} />
          <span>保管・所在ステータス (Quản lý Vị trí & Trạng thái)</span>
        </div>
      </div>

      {/* 3 Scientific Status Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>

        {/* Row 1: Custody & Location */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--bg-surface)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>
            <Building2 size={14} style={{ color: 'var(--accent)' }} />
            <span>1. 保管場所 (Vị trí):</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
            <span style={{ color: isExternalKeeper ? 'var(--tint-orange-text)' : 'var(--text-primary)' }}>
              🏢 {keeperName}
            </span>
            <span style={{ color: 'var(--border-default)' }}>|</span>
            <span style={{ fontFamily: 'monospace', color: data.rack_layers ? 'var(--accent)' : 'var(--text-muted)' }}>
              📍 {rackText}
            </span>
          </div>
        </div>

        {/* Row 2: Physical Verification Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--bg-surface)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>
            <CheckCircle2 size={14} style={{ color: isUnverified ? '#f59e0b' : isDisposed ? '#ef4444' : '#10b981' }} />
            <span>2. 実物検証 (Xác thực thực tế):</span>
          </div>
          <div>
            {isUnverified ? (
              <span className="badge badge--neutral" style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px' }}>
                ⚠️ 未検証 (Chưa kiểm kê thực tế)
              </span>
            ) : isDisposed ? (
              <span className="badge badge--error" style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px' }}>
                🗑️ 廃棄済 (Đã thanh lý/hủy)
              </span>
            ) : (
              <span className="badge badge--success" style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px' }}>
                ✅ 実物確認済 (Đã kiểm kê xưởng YSD)
              </span>
            )}
          </div>
        </div>

        {/* Row 3: Latest Transaction Log */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--bg-surface)', borderRadius: 6, border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}>
            <History size={14} style={{ color: 'var(--accent)' }} />
            <span>3. 直近入出庫 (Nhật ký gần nhất):</span>
          </div>
          <div>
            {!hasRealLog ? (
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                📑 未記録 (Chưa có nhật ký nhập/xuất)
              </span>
            ) : isOut ? (
              <span className="badge badge--warning" style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px' }}>
                🔴 OUT {destinationLoc ? `(${destinationLoc})` : ''} {confirmDate ? `· ${confirmDate}` : ''}
              </span>
            ) : (
              <span className="badge badge--success" style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px' }}>
                🟢 IN 社内保管 {confirmDate ? `· ${confirmDate}` : ''}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Warning Banner for Unverified Molds */}
      {isUnverified && (
        <div
          style={{
            padding: '8px 10px',
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
            ⚠️ Khuôn khởi tạo từ quét CAD Server — <strong>Chưa xác thực kiểm kê tồn tại vật lý tại xưởng YSD</strong>.
          </div>
        </div>
      )}

      {/* OUT Destination Warning Banner */}
      {isOut && (
        <div
          style={{
            padding: '8px 10px',
            borderRadius: 6,
            background: 'rgba(254, 243, 199, 0.85)',
            border: '1px solid var(--tint-orange-border)',
            color: 'var(--tint-orange-text)',
            fontSize: 11,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8
          }}
        >
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1, color: '#f97316' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontWeight: 700, fontSize: 11, color: '#c2410c' }}>
              🔴 一時持出中 (Khuôn đang được mượn/chuyển ra ngoài)
            </div>
            <div>
              現在地 (Nơi đến): <strong>{destinationLoc || keeperName || '社外'}</strong> {performerName ? `(Thực hiện bởi: ${performerName})` : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
