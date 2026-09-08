'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle2, 
  AlertTriangle, 
  Camera, 
  Layers, 
  Plus, 
  ExternalLink, 
  Wrench,
  Compass,
  AlertCircle
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { assignEquipmentToSet } from '../../actions'
import type { 
  WOEquipmentSetResult, 
  EquipmentSetMember, 
  SuggestedSharedEquipment, 
  WOReadinessStatus 
} from '../../types'

interface TabEquipmentSetProps {
  equipmentSet: WOEquipmentSetResult
}

export function TabEquipmentSet({ equipmentSet }: TabEquipmentSetProps) {
  const t = useTranslations('WorkOrders')
  const router = useRouter()
  const [assigningId, setAssigningId] = useState<string | null>(null)

  const { summary, primary_mold, set_members, suggested_shared } = equipmentSet
  const isAllReady = summary.is_all_ready

  const handleAssignToSet = async (equipment: SuggestedSharedEquipment) => {
    if (!primary_mold) {
      alert('Khuôn chính chưa được xác định, không thể liên kết thiết bị phụ trợ.')
      return
    }

    setAssigningId(equipment.equipment_id)
    const res = await assignEquipmentToSet(
      primary_mold.equipment_id,
      equipment.equipment_id,
      'SET_MEMBER',
      `Auto-assigned via Work Order ${equipmentSet.wo_code}`
    )
    setAssigningId(null)

    if (!res.success) {
      alert(`Lỗi gán thiết bị: ${res.error}`)
    } else {
      router.refresh()
    }
  }

  const getReadinessBadge = (status: WOReadinessStatus) => {
    switch (status) {
      case 'READY':
        return (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              padding: '3px 8px',
              borderRadius: 4,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <CheckCircle2 size={12} />
            {t('readinessReady')}
          </span>
        )
      case 'IN_USE':
        return (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              padding: '3px 8px',
              borderRadius: 4,
            }}
          >
            {t('readinessInUse')}
          </span>
        )
      case 'MAINTENANCE':
        return (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              padding: '3px 8px',
              borderRadius: 4,
            }}
          >
            {t('readinessMaintenance')}
          </span>
        )
      case 'LOANED_OUT':
        return (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: '#FFEDD5',
              color: '#C2410C',
              padding: '3px 8px',
              borderRadius: 4,
            }}
          >
            {t('readinessLoanedOut')}
          </span>
        )
      case 'MISSING_RACK':
        return (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: '#F1F5F9',
              color: '#475569',
              padding: '3px 8px',
              borderRadius: 4,
            }}
          >
            {t('readinessMissingRack')}
          </span>
        )
      case 'NOT_READY':
      default:
        return (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              backgroundColor: '#FEE2E2',
              color: '#B91C1C',
              padding: '3px 8px',
              borderRadius: 4,
            }}
          >
            {t('readinessNotReady')}
          </span>
        )
    }
  }

  const renderEquipmentCard = (
    item: EquipmentSetMember,
    isPrimary: boolean = false
  ) => {
    const rackDisplay =
      item.rack_code && item.layer_code
        ? `${item.rack_code}-${item.layer_code}`
        : item.layer_code || '未割当 (Chưa gán kệ)'

    return (
      <div
        key={item.equipment_id}
        style={{
          border: `1.5px solid ${isPrimary ? 'var(--accent, #0D9488)' : 'var(--border-default)'}`,
          borderRadius: 6,
          backgroundColor: isPrimary ? '#FBFDFD' : 'var(--bg-surface)',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* Card Header: Type badge + Status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: isPrimary ? '#CCFBF1' : '#F1F5F9',
                color: isPrimary ? '#0F766E' : '#334155',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              {isPrimary ? t('primaryMold') : item.equipment_type}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
              [{item.assignment_type}]
            </span>
          </div>

          <div>{getReadinessBadge(item.readiness_status)}</div>
        </div>

        {/* Equipment Code & Name */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <Link
              href={`/equipment/unified?search=${item.equipment_code}`}
              style={{
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'monospace',
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              {item.equipment_code}
            </Link>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {item.equipment_name}
            </span>
          </div>

          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            所有: {item.owner_company_name || '—'} | 保管: {item.keeper_company_name || 'YSD'}
          </div>
        </div>

        {/* Rack Location & AR Scanner button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#F8FAFC',
            padding: '6px 10px',
            borderRadius: 4,
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Compass size={14} color="#0284C7" />
            <span style={{ fontSize: 11, color: '#475569', fontWeight: 600 }}>
              {t('rackLocation')}:
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                fontFamily: 'monospace',
                color: item.current_rack_layer_id ? '#1D4ED8' : '#64748B',
              }}
            >
              {rackDisplay}
            </span>
          </div>

          {/* Direct AR Scanner button (Milestone 17) */}
          <Link
            href={`/equipment/scan?find=${encodeURIComponent(item.equipment_code)}`}
            className="btn btn-secondary"
            style={{
              padding: '3px 8px',
              fontSize: 11,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              backgroundColor: '#FFFFFF',
            }}
          >
            <Camera size={12} color="var(--accent)" />
            <span>{t('arScanLocator')}</span>
          </Link>
        </div>

        {/* Active Loan warning if any */}
        {item.active_loan_code && (
          <div
            style={{
              fontSize: 11,
              color: '#C2410C',
              backgroundColor: '#FFF7ED',
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #FFEDD5',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <AlertCircle size={12} />
            <span>
              貸出中: {item.active_loan_code} (返却予定:{' '}
              {item.loan_scheduled_return_date || '未定'})
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      
      {/* ── Top Readiness Summary Banner ── */}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 6,
          backgroundColor: isAllReady ? 'var(--tint-teal-bg, #F0FDF4)' : 'var(--tint-orange-bg, #FFFBEB)',
          border: `1.5px solid ${isAllReady ? '#BBF7D0' : '#FDE68A'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isAllReady ? (
            <CheckCircle2 size={22} color="#16A34A" />
          ) : (
            <AlertTriangle size={22} color="#D97706" />
          )}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: isAllReady ? '#15803D' : '#B45309',
              }}
            >
              {isAllReady
                ? 'すべてのSET設備がREADY（準備完了）です — 製造開始可能'
                : '一部の設備が未準備または棚番未設定です — 現品と保管場所を確認してください'}
            </div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
              金型: {summary.has_mold ? '✅ あり' : '❌ なし'} | 抜型:{' '}
              {summary.has_cutter ? '✅ あり' : '❌ なし'} | 準備完了:{' '}
              <strong style={{ color: '#0F172A' }}>{summary.ready_items}</strong> /{' '}
              {summary.total_items} 点
            </div>
          </div>
        </div>

        <div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              fontFamily: 'monospace',
              padding: '4px 12px',
              borderRadius: 20,
              backgroundColor: isAllReady ? '#15803D' : '#D97706',
              color: '#FFFFFF',
            }}
          >
            {summary.ready_items} / {summary.total_items} READY
          </span>
        </div>
      </div>

      {/* ── Section 1: Primary Mold & Direct Members ── */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
          }}
        >
          <Layers size={16} color="var(--accent)" />
          <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            構成設備一覧 (Assigned Tooling SET Members)
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
          {/* Primary Mold */}
          {primary_mold && renderEquipmentCard(primary_mold, true)}

          {/* Set Members */}
          {set_members.map((item: EquipmentSetMember) => renderEquipmentCard(item, false))}

          {!primary_mold && set_members.length === 0 && (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '24px 16px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 6,
                border: '1px dashed var(--border-default)',
              }}
            >
              {t('noSetMembers')}
            </div>
          )}
        </div>
      </div>

      {/* ── Section 2: Compatible Shared Auxiliaries (Tier 3 RPC) ── */}
      {suggested_shared && suggested_shared.length > 0 && (
        <div
          style={{
            marginTop: 8,
            padding: '14px 16px',
            borderRadius: 6,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Wrench size={15} color="#0284C7" />
              <h3 style={{ fontSize: 13, fontWeight: 700, margin: 0, color: '#0F172A' }}>
                {t('suggestedSharedTitle')}
              </h3>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              CAV・サイズ一致による候補 (Gợi ý dùng chung)
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', fontSize: 11 }}>
              <thead>
                <tr>
                  <th style={{ width: 100 }}>管理番号</th>
                  <th style={{ width: 110 }}>種別</th>
                  <th>名称</th>
                  <th style={{ width: 100 }}>保管棚番</th>
                  <th style={{ width: 80, textAlign: 'center' }}>状態</th>
                  <th style={{ width: 90, textAlign: 'center' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {suggested_shared.map((eq: SuggestedSharedEquipment) => {
                  const rackStr =
                    eq.rack_code && eq.layer_code
                      ? `${eq.rack_code}-${eq.layer_code}`
                      : eq.layer_code || '—'

                  return (
                    <tr key={eq.equipment_id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                        {eq.equipment_code}
                      </td>
                      <td>{eq.equipment_type}</td>
                      <td>{eq.equipment_name}</td>
                      <td style={{ fontFamily: 'monospace', color: '#1D4ED8', fontWeight: 700 }}>
                        {rackStr}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {getReadinessBadge(eq.readiness_status)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleAssignToSet(eq)}
                          disabled={assigningId === eq.equipment_id}
                          className="btn btn-primary"
                          style={{
                            padding: '2px 8px',
                            fontSize: 10,
                            height: 'auto',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                          }}
                        >
                          <Plus size={11} />
                          <span>{t('assignToSet')}</span>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
