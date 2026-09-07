'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import {
  MapPin,
  Layers,
  ArrowRight,
  Clock,
  User,
  CheckCircle2,
  RefreshCw,
  MoveRight,
  Inbox,
  QrCode,
} from 'lucide-react'
import type { MoldDetailData } from '../page'
import {
  getLocationMoveLogs,
  type LocationMoveLogItem,
} from '@/app/equipment/locations/actions'
import LocationMoveModal from '@/app/equipment/locations/_components/LocationMoveModal'
import QRCodeDisplay from '@/components/equipment/QRCodeDisplay'
import QRCodeModal from '@/components/equipment/QRCodeModal'

export function LocationTab({ mold }: { mold: MoldDetailData }) {
  const t = useTranslations('EquipmentLocations.tab')
  const [logs, setLogs] = useState<LocationMoveLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const fetchHistory = useCallback(async () => {
    if (!mold?.equipment_id) return
    setLoading(true)
    try {
      const res = await getLocationMoveLogs(mold.equipment_id, 10)
      setLogs(res)
    } catch (err) {
      console.error('Failed to fetch location move logs:', err)
    } finally {
      setLoading(false)
    }
  }, [mold?.equipment_id])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const rackLayer = mold.rack_layers
  const rack = rackLayer?.racks

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Current Storage Location Card */}
      <div
        className="card-flat p-4"
        style={{ borderLeft: '4px solid var(--accent)', background: 'var(--bg-surface)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: 'var(--tint-teal-bg)', color: 'var(--accent)' }}
            >
              <MapPin size={22} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t('currentLocationTitle')}
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-[20px] font-extrabold font-mono text-slate-900">
                  {rackLayer?.layer_code || '—'}
                </span>
                {rack && (
                  <span className="text-[12px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {rack.rack_code} {rack.rack_name ? `(${rack.rack_name})` : ''}
                  </span>
                )}
              </div>
              <div className="text-[12px] text-slate-600 mt-1 flex items-center gap-1.5">
                <Layers size={13} className="text-teal-600" />
                <span>
                  {rack?.location_in_factory || t('noLocationAssigned')}
                  {rackLayer?.layer_number != null && ` — Tầng ${rackLayer.layer_number}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Clickable QR Thumbnail 64x64 */}
            <button
              type="button"
              onClick={() => setQrModalOpen(true)}
              className="p-1 rounded-lg border border-slate-200 bg-white hover:border-teal-500 hover:shadow-sm transition-all flex flex-col items-center gap-0.5 group cursor-pointer"
              title="QRコード拡大・印刷"
            >
              <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
                <QRCodeDisplay
                  equipmentCode={mold.equipment_code}
                  equipmentType={mold.mold_type || 'MOLD'}
                  equipmentId={mold.equipment_id}
                  productName={mold.display_name}
                  currentLayerCode={rackLayer?.layer_code}
                  size={30}
                  showBorder={false}
                  className="!w-12 !h-12 !min-w-[48px] !min-h-[48px] !p-0 pointer-events-none"
                />
              </div>
              <span className="text-[8.5px] font-bold text-slate-500 group-hover:text-teal-700 flex items-center gap-0.5">
                <QrCode size={9} />
                <span>QR</span>
              </span>
            </button>

            {/* Action: Open Move Modal */}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-primary text-[12px] py-1.5 px-3.5 flex items-center gap-1.5 font-semibold shadow-sm"
            >
              <MoveRight size={14} />
              <span>{t('changeRackBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Recent Movement Logs (Asset Location Logs) */}
      <div className="card-flat p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            <h3 className="text-[14px] font-bold text-slate-900">{t('moveHistoryTitle')}</h3>
            <span className="text-[11px] text-slate-400">({t('recent10Rows')})</span>
          </div>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="btn btn-secondary text-[11px] py-0.5 px-2 flex items-center gap-1 text-slate-600"
            title="Refresh"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            <span>{t('refresh')}</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-[12px] flex flex-col items-center gap-1.5">
            <RefreshCw size={20} className="animate-spin text-teal-600" />
            <span>{t('loadingHistory')}</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center">
            <Inbox size={32} className="opacity-40 mb-1.5" />
            <div className="text-[13px] font-medium text-slate-600">{t('noHistoryLogs')}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{t('noHistoryLogsSub')}</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table w-full text-[12px]">
              <thead>
                <tr>
                  <th style={{ width: 140 }}>{t('thDate')}</th>
                  <th>{t('thFrom')}</th>
                  <th style={{ width: 30 }}></th>
                  <th>{t('thTo')}</th>
                  <th>{t('thOperator')}</th>
                  <th>{t('thNotes')}</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="font-mono text-slate-600 whitespace-nowrap">
                      {log.moved_at ? log.moved_at.slice(0, 16).replace('T', ' ') : '—'}
                    </td>
                    <td>
                      {log.old_layer_code ? (
                        <div className="flex items-center gap-1 font-mono">
                          <span className="font-bold text-slate-700">{log.old_layer_code}</span>
                          {log.old_rack_code && (
                            <span className="text-[10px] text-slate-400">({log.old_rack_code})</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>
                    <td className="text-center text-slate-400">
                      <ArrowRight size={13} className="inline text-teal-600" />
                    </td>
                    <td>
                      {log.new_layer_code ? (
                        <div className="flex items-center gap-1 font-mono">
                          <span className="font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
                            {log.new_layer_code}
                          </span>
                          {log.new_rack_code && (
                            <span className="text-[10px] text-slate-500">({log.new_rack_code})</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>
                    <td className="text-slate-700 font-medium">
                      {log.moved_by_name || '—'}
                    </td>
                    <td className="text-slate-600 max-w-[200px] truncate" title={log.notes || ''}>
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Location Move Modal */}
      {modalOpen && (
        <LocationMoveModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            fetchHistory()
            window.location.reload()
          }}
          equipment={{
            equipment_id: mold.equipment_id,
            equipment_code: mold.equipment_code,
            display_name: mold.display_name,
            current_rack_layer_id: mold.current_rack_layer_id,
            current_layer_code: rackLayer?.layer_code,
            current_rack_code: rack?.rack_code,
            current_location_in_factory: rack?.location_in_factory,
            company_id: (mold as any).company_id,
            owner_company_name: mold.mold_revisions?.products?.companies?.company_name,
            keeper_company_id: mold.keeper_company_id,
            keeper_company_name: mold.keeper_company?.company_name,
          }}
          defaultTab="RACK"
        />
      )}

      {/* 4. QR Code Modal */}
      {qrModalOpen && (
        <QRCodeModal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          equipment={{
            equipmentId: mold.equipment_id,
            equipmentCode: mold.equipment_code,
            equipmentType: mold.mold_type || 'MOLD',
            displayName: mold.display_name,
            currentLayerCode: rackLayer?.layer_code,
          }}
        />
      )}
    </div>
  )
}
