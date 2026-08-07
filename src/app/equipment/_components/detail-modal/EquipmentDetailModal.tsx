'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  X, ExternalLink, Box, Crop, Pin, Layers, Ruler, MapPin, Sparkles,
  History, Camera, ChevronRight, AlertTriangle
} from 'lucide-react'
import { EquipmentDetailData, EquipmentDetailModalProps, ActionDialogType } from './types'
import StorageStatusCard from './StorageStatusCard'
import EquipmentActionGrid from './EquipmentActionGrid'
import QuickAccessNav from './QuickAccessNav'
import MoldDetailView from './MoldDetailView'
import CutterDetailView from './CutterDetailView'
import AuxiliaryDetailView from './AuxiliaryDetailView'
import ActionDialogManager from './ActionDialogManager'

export default function EquipmentDetailModal({
  isOpen,
  onClose,
  equipmentId,
  initialData,
  onUpdateSuccess
}: EquipmentDetailModalProps) {
  const supabase = createClient()
  const [data, setData] = useState<EquipmentDetailData | null>(initialData || null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'specs' | 'lifecycle' | 'jobs' | 'movements'>('specs')
  const [jobsHistory, setJobsHistory] = useState<any[]>([])
  const [movementsHistory, setMovementsHistory] = useState<any[]>([])
  const [statusLogs, setStatusLogs] = useState<any[]>([])
  const [activeAction, setActiveAction] = useState<ActionDialogType>(null)

  // Fetch full details if only equipmentId provided or on refresh
  const fetchEquipmentDetails = async (id?: string) => {
    if (!id || id === 'undefined') {
      setLoading(false)
      return
    }

    setLoading(true)
    const { data: eq, error } = await supabase
      .from('equipment')
      .select(`
        *,
        keeper_company:companies!keeper_company_id(company_name, company_code),
        company:companies!company_id(company_name, company_code),
        rack_layers(layer_code, racks(rack_code)),
        design_revisions(
          revision_id, design_code, design_length, design_width, design_height, design_weight,
          product_length, product_width, product_height, product_weight, pocket_count, piece_count,
          resin_type, resin_thickness, tray_title,
          products(product_code, product_name_internal, product_name)
        )
      `)
      .or(`equipment_id.eq.${id},legacy_physical_mold_id.eq.${id},legacy_cutter_id.eq.${id}`)
      .limit(1)
      .maybeSingle()

    if (!error && eq) {
      setData(eq as unknown as EquipmentDetailData)
    }
    setLoading(false)

    // Use the actual equipment_id (UUID) for subsequent queries
    const targetEqId = eq?.equipment_id || id

    // Fetch Jobs
    const { data: jobs } = await supabase
      .from('jobs')
      .select(`
        job_id, job_code, job_name, job_status, created_at, deadline, ship_date, job_category, notes,
        design_revisions(revision_id, design_code)
      `)
      .or(`physical_mold_id.eq.${id},equipment_id.eq.${id}`)
      .order('created_at', { ascending: true })

    if (jobs) setJobsHistory(jobs)

    // Fetch Equipment History (movements, transfers, rack moves)
    const { data: history } = await supabase
      .from('equipment_history')
      .select(`
        history_id, action_type, action_date, description, to_location,
        from_company:from_company_id(company_code, company_name),
        to_company:to_company_id(company_code, company_name),
        employees(employee_name)
      `)
      .eq('equipment_id', targetEqId)
      .order('action_date', { ascending: false })
      .limit(10)

    if (history) setMovementsHistory(history)

    // Fetch Equipment Status Logs (check-in/check-out - specialized table)
    // Note: table created after last types generation, cast as any
    const { data: sLogs } = await (supabase as any)
      .from('equipment_status_logs')
      .select(`
        status_log_id, status, action_date, to_location, notes,
        destinations(destination_name),
        employees(employee_name)
      `)
      .eq('equipment_id', targetEqId)
      .order('action_date', { ascending: false })
      .limit(10)

    if (sLogs) setStatusLogs(sLogs as any[])
  }

  useEffect(() => {
    if (!isOpen) return
    setActiveTab('specs')
    const targetId = equipmentId || initialData?.equipment_id || (initialData as any)?.physical_mold_id || (initialData as any)?.cutter_id
    if (targetId) {
      fetchEquipmentDetails(targetId)
    } else if (initialData) {
      setData(initialData)
    }
  }, [isOpen, equipmentId, initialData])

  if (!isOpen) return null
  if (!data && loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card-flat" style={{ padding: 24, borderRadius: 10, background: 'var(--bg-surface)' }}>
          読み込み中... (Loading details...)
        </div>
      </div>
    )
  }

  if (!data) return null

  // Determine Type & Styling
  const eqType = data.equipment_type?.toUpperCase() || 'MOLD'
  const isMold = eqType === 'MOLD' || eqType.includes('金型')
  const isCutter = eqType.includes('CUTTER') || eqType.includes('抜型')
  const isPlug = eqType.includes('PLUG')

  const categoryLabel = isMold ? '金型 (Mold)' : isCutter ? '抜型 (Cutter)' : isPlug ? 'プラグ (Plug)' : `${eqType} (Equipment)`
  const IconComponent = isCutter ? Crop : isPlug ? Pin : Box
  const headerGradient = isCutter
    ? 'linear-gradient(135deg, var(--tint-orange-bg) 0%, var(--bg-surface-2) 100%)'
    : isPlug
    ? 'linear-gradient(135deg, var(--tint-purple-bg) 0%, var(--bg-surface-2) 100%)'
    : 'linear-gradient(135deg, var(--tint-blue-bg) 0%, var(--bg-surface-2) 100%)'

  const headerTextColor = isCutter
    ? 'var(--tint-orange-text)'
    : isPlug
    ? 'var(--tint-purple-text)'
    : 'var(--tint-blue-text)'

  const detailUrl = isMold
    ? `/master/molds`
    : isCutter
    ? `/master/cutters`
    : `/equipment/unified`

  const handleRefresh = () => {
    const targetId = data?.equipment_id || (data as any)?.physical_mold_id || (data as any)?.cutter_id || equipmentId
    if (targetId) fetchEquipmentDetails(targetId)
    if (onUpdateSuccess) onUpdateSuccess()
  }

  // Determine Real Physical Keeper Company
  // - company_id: Khách hàng / Chủ sở hữu (Owner, e.g. KSP)
  // - keeper_company_id: Công ty đang giữ khuôn thực tế (Keeper)
  // Nếu keeper_company_id trống hoặc bằng company_id (chưa chuyển đi), vị trí thực tế là tại YSD (社内).
  const ownerCompanyId = data?.company_id
  const keeperCompanyId = data?.keeper_company_id

  let keeperName = 'YSD'
  let isExternalKeeper = false

  if (keeperCompanyId && keeperCompanyId !== ownerCompanyId && data?.keeper_company) {
    const code = (data.keeper_company.company_code || '').toUpperCase()
    const name = data.keeper_company.company_name || ''
    if (code !== 'YSD' && !name.includes('YSD') && !name.includes('社内')) {
      keeperName = name || code
      isExternalKeeper = true
    }
  } else if (movementsHistory[0]?.action_type === 'TRANSFER' && movementsHistory[0]?.to_company) {
    const toName = movementsHistory[0].to_company.company_name || movementsHistory[0].to_company.company_code
    if (toName && !toName.includes('YSD')) {
      keeperName = toName
      isExternalKeeper = true
    }
  }

  // Determine real-time status from specialized status_logs table first, then equipment_history, then DB fields
  const latestStatusLog = statusLogs[0]
  const latestMovement = movementsHistory[0]
  const rawStatus = (
    latestStatusLog?.status ||
    latestMovement?.action_type ||
    data?.usage_status ||
    data?.device_status ||
    ''
  ).toUpperCase()
  const destinationDisplay =
    latestStatusLog?.to_location ||
    latestStatusLog?.destinations?.destination_name ||
    latestMovement?.to_location ||
    latestMovement?.to_company?.company_name ||
    ''

  const isHeaderOut =
    rawStatus === 'OUT' ||
    rawStatus === 'CHECK_OUT' ||
    rawStatus === 'TRANSFER' ||
    rawStatus === 'OUT_OF_STOCK' ||
    rawStatus === 'LOAN' ||
    rawStatus === 'MAINTENANCE' ||
    rawStatus === 'BROKEN' ||
    rawStatus === 'DISPOSED' ||
    isExternalKeeper

  let headerStatusText = 'IN (社内保管)'
  let headerBadgeClass = 'badge badge--success'

  if (rawStatus === 'DISPOSED' || rawStatus === 'SCRAP') {
    headerStatusText = '廃棄 (Đã hủy)'
    headerBadgeClass = 'badge badge--error'
  } else if (rawStatus === 'MAINTENANCE' || rawStatus === 'REPAIR') {
    headerStatusText = 'メンテナンス中'
    headerBadgeClass = 'badge badge--warning'
  } else if (isHeaderOut) {
    headerStatusText = 'OUT (社外/出庫)'
    headerBadgeClass = 'badge badge--warning'
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="card-flat"
        style={{
          width: '100%', maxWidth: 1080, maxHeight: '92vh', borderRadius: 12, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.25)',
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div style={{
          background: headerGradient, borderBottom: '1px solid var(--border-subtle)',
          padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8, background: 'var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <IconComponent size={20} style={{ color: headerTextColor }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: headerTextColor, textTransform: 'uppercase' }}>
                  {categoryLabel}
                </span>
                <span className={headerBadgeClass} style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px' }}>
                  {headerStatusText}
                </span>
                <span className={isExternalKeeper ? 'badge badge--error' : 'badge badge--info'} style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px' }}>
                  🏢 {keeperName}
                </span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{data.equipment_code}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'sans-serif' }}>
                  ({data.display_name})
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              border: 'none', background: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 6,
              borderRadius: 6, color: 'var(--text-primary)', display: 'flex', alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Main Body (3 Column Layout) */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: 14, padding: 14, overflowY: 'auto', flex: 1 }}>

          {/* LEFT COLUMN: Thumbnail Photo & Quick Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Photo Box */}
            <div
              className="card-flat"
              style={{
                padding: 10, background: 'var(--bg-surface-2)', borderRadius: 8,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
              }}
            >
              <div style={{
                width: '100%', height: 160, borderRadius: 6, background: '#1e293b',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8',
                border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden'
              }}>
                <Box size={40} opacity={0.4} />
                <span style={{ position: 'absolute', bottom: 6, fontSize: 10, color: '#94a3b8', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: 4 }}>
                  📷 No Image
                </span>
              </div>
              <button
                onClick={() => setActiveAction('PHOTO_MANAGER')}
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: 11, padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
              >
                <Camera size={13} />
                <span>写真登録・変更</span>
              </button>
            </div>

            {/* Quick Logs Card */}
            <div className="card-flat" style={{ padding: 10, background: 'var(--bg-surface-2)', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
              <div style={{ fontWeight: 700, color: 'var(--accent)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4 }}>
                📄 履歴・レポート (Tóm tắt Lịch sử)
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>テフロン状況:</span>
                <span style={{ fontWeight: 700 }}>{data.is_teflon ? '済' : 'なし'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>直近の輸送:</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{data.returned_date || '—'}</span>
              </div>
            </div>
          </div>

          {/* MIDDLE COLUMN: Storage Card + Specs + Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Storage Card */}
            <StorageStatusCard data={data} latestLog={movementsHistory[0]} latestStatusLog={latestStatusLog} destinationDisplay={destinationDisplay} />

            {/* Modal Tabs Bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '4px',
              background: 'var(--bg-surface-2)', borderRadius: 6, border: '1px solid var(--border-subtle)'
            }}>
              {[
                { id: 'specs', label: '📌 基本仕様' },
                { id: 'lifecycle', label: '🌿 改訂系統図' },
                { id: 'jobs', label: '⚙️ 加工履歴' },
                { id: 'movements', label: '🚚 移動履歴' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1, fontSize: 11, fontWeight: activeTab === tab.id ? 700 : 500,
                    color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                    background: activeTab === tab.id ? 'var(--bg-surface)' : 'transparent',
                    border: activeTab === tab.id ? '1px solid var(--border-default)' : 'none',
                    borderRadius: 4, padding: '5px 0', cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'specs' && (
              <>
                {isMold && <MoldDetailView data={data} />}
                {isCutter && <CutterDetailView data={data} />}
                {!isMold && !isCutter && <AuxiliaryDetailView data={data} />}
              </>
            )}

            {activeTab === 'lifecycle' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
                {jobsHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                    改訂・加工 Job 履歴はありません。
                  </div>
                ) : (
                  jobsHistory.map((j, idx) => (
                    <div key={j.job_id} className="card-flat" style={{ padding: 10, background: 'var(--bg-surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="badge badge--info" style={{ fontSize: 9 }}>Job #{idx + 1}</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{j.job_code || j.job_name}</span>
                      </div>
                      <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>
                        {(j.ship_date || j.created_at || '').slice(0, 10)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'jobs' && (
              <div style={{ fontSize: 11 }}>
                {jobsHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>加工履歴なし</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Job コード</th>
                        <th>ステータス</th>
                        <th>日付</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobsHistory.map(j => (
                        <tr key={j.job_id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{j.job_code || j.job_name}</td>
                          <td><span className="badge badge--success" style={{ fontSize: 8 }}>{j.job_status || 'COMPLETED'}</span></td>
                          <td style={{ fontFamily: 'monospace' }}>{(j.ship_date || j.created_at || '').slice(0, 10)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === 'movements' && (
              <div style={{ fontSize: 11 }}>
                {movementsHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>移動履歴なし (Chưa có lịch sử di chuyển)</div>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>日付</th>
                        <th>Loại</th>
                        <th>Đến (To)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movementsHistory.map(m => (
                        <tr key={m.movement_id}>
                          <td style={{ fontFamily: 'monospace' }}>{(m.moved_at || '').slice(0, 10)}</td>
                          <td><span className="badge badge--info" style={{ fontSize: 8 }}>{m.movement_type}</span></td>
                          <td style={{ fontWeight: 700 }}>{m.to_company?.company_code || 'YSD'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: 9 Action Buttons & Quick Access Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <EquipmentActionGrid onOpenAction={setActiveAction} />
            <QuickAccessNav data={data} onClose={onClose} />
          </div>
        </div>

        {/* Footer Action Bar */}
        <div style={{
          padding: '10px 18px', background: 'var(--bg-surface-2)',
          borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
        }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ fontSize: 12, padding: '5px 14px' }}>
            閉じる (Đóng)
          </button>

          <Link
            href={detailUrl}
            onClick={onClose}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '5px 16px', textDecoration: 'none' }}
          >
            <ExternalLink size={14} />
            <span>詳細ページを開く (Chi tiết)</span>
          </Link>
        </div>
      </div>

      {/* Sub Dialog Action Manager */}
      <ActionDialogManager
        activeAction={activeAction}
        onCloseAction={() => setActiveAction(null)}
        onSelectAction={(action) => setActiveAction(action)}
        data={data}
        onSuccess={handleRefresh}
      />
    </div>
  )
}
