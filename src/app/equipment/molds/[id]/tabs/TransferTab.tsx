'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import {
  Truck,
  Building2,
  ArrowRight,
  Clock,
  RefreshCw,
  Inbox,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import type { MoldDetailData } from '../page'
import {
  getEquipmentShipLogs,
  returnEquipmentToOwner,
  type EquipmentShipLogItem,
} from '@/app/equipment/locations/actions'
import LocationMoveModal from '@/app/equipment/locations/_components/LocationMoveModal'

export function TransferTab({ mold }: { mold: MoldDetailData }) {
  const t = useTranslations('EquipmentLocations.transferTab')
  const [logs, setLogs] = useState<EquipmentShipLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [returning, setReturning] = useState(false)

  // Determine Owner & Keeper companies
  const ownerCompany = mold.mold_revisions?.products?.companies || (mold as any).owner_company
  const ownerCompanyName = ownerCompany?.company_name || '—'
  const ownerCompanyCode = ownerCompany?.company_code || ''
  const ownerCompanyId = ownerCompany?.company_id || (mold as any).company_id

  const keeperCompanyName =
    mold.keeper_company?.company_name || '(株)ヨシダ成形 (社内保管)'
  const keeperCompanyCode = mold.keeper_company?.company_code || 'YSD'
  const keeperCompanyId = mold.keeper_company_id

  const isReturnedToOwner =
    Boolean(ownerCompanyId && keeperCompanyId === ownerCompanyId)
  const isYsdKeeper =
    !keeperCompanyId ||
    keeperCompanyCode === 'YSD' ||
    keeperCompanyName.includes('ヨシダ')

  const fetchHistory = useCallback(async () => {
    if (!mold?.equipment_id) return
    setLoading(true)
    try {
      const res = await getEquipmentShipLogs(mold.equipment_id, 10)
      setLogs(res)
    } catch (err) {
      console.error('Failed to fetch equipment ship logs:', err)
    } finally {
      setLoading(false)
    }
  }, [mold?.equipment_id])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  // Handle 1-click Return to Owner
  const handleQuickReturn = async () => {
    if (!ownerCompanyId) return
    const msg = t('confirmReturn', { owner: ownerCompanyName })
    if (!confirm(msg)) return

    setReturning(true)
    try {
      const res = await returnEquipmentToOwner({
        equipmentId: mold.equipment_id,
        ownerCompanyId,
        currentKeeperCompanyId: keeperCompanyId || '',
        itemName: mold.display_name || mold.equipment_code,
      })

      if (res.success) {
        await fetchHistory()
        window.location.reload()
      } else {
        alert(res.error || 'Failed to return mold')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setReturning(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Current Custody & Ownership Card */}
      <div
        className="card-flat p-4"
        style={{ borderLeft: '4px solid #6366F1', background: 'var(--bg-surface)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Company Info Left */}
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: '#EEF2FF', color: '#4F46E5' }}
            >
              <Truck size={22} />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t('custodyTitle')}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                {/* Owner Company */}
                <div className="flex items-center gap-1.5 text-[13px]">
                  <span className="text-slate-500 text-[12px] font-medium">
                    {t('ownerCompany')}:
                  </span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Building2 size={13} className="text-slate-400" />
                    {ownerCompanyName}
                    {ownerCompanyCode && (
                      <span className="text-[11px] font-mono text-slate-500">
                        ({ownerCompanyCode})
                      </span>
                    )}
                  </span>
                </div>

                <span className="text-slate-300 hidden sm:inline">|</span>

                {/* Current Keeper Company */}
                <div className="flex items-center gap-1.5 text-[13px]">
                  <span className="text-slate-500 text-[12px] font-medium">
                    {t('keeperCompany')}:
                  </span>
                  <span className="font-bold text-indigo-700 flex items-center gap-1">
                    <Building2 size={13} className="text-indigo-400" />
                    {keeperCompanyName}
                    {keeperCompanyCode && (
                      <span className="text-[11px] font-mono text-indigo-500">
                        ({keeperCompanyCode})
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-1.5 flex items-center gap-2">
                {isReturnedToOwner ? (
                  <span className="badge badge--neutral text-[11px] py-0.5 px-2 font-semibold">
                    <CheckCircle2 size={11} className="mr-1 inline text-slate-600" />
                    {t('statusReturned')}
                  </span>
                ) : isYsdKeeper ? (
                  <span className="badge badge--info text-[11px] py-0.5 px-2 font-semibold">
                    <CheckCircle2 size={11} className="mr-1 inline text-teal-600" />
                    {t('statusInHouse')}
                  </span>
                ) : (
                  <span className="badge badge--warning text-[11px] py-0.5 px-2 font-semibold">
                    <AlertCircle size={11} className="mr-1 inline text-amber-600" />
                    {t('statusOther')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons Right */}
          <div className="flex items-center gap-2">
            {/* 1-Click Return to Owner button */}
            {ownerCompanyId && !isReturnedToOwner && (
              <button
                type="button"
                onClick={handleQuickReturn}
                disabled={returning}
                className="btn text-[12px] py-1.5 px-3.5 flex items-center gap-1.5 font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all"
                title={t('returnToOwnerBtn')}
              >
                <RotateCcw size={13} className={returning ? 'animate-spin' : ''} />
                <span>{t('returnToOwnerBtn')}</span>
              </button>
            )}

            {/* General Company Transfer button */}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn text-[12px] py-1.5 px-3.5 flex items-center gap-1.5 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
            >
              <Truck size={14} />
              <span>{t('changeCompanyBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Transfer History Table */}
      <div className="card-flat p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-slate-500" />
            <h3 className="text-[14px] font-bold text-slate-900">
              {t('transferHistoryTitle')}
            </h3>
            <span className="text-[11px] text-slate-400">({t('recent10Rows')})</span>
          </div>
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="btn btn-secondary text-[11px] py-0.5 px-2 flex items-center gap-1 text-slate-600"
            title={t('refresh')}
          >
            <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
            <span>{t('refresh')}</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-[12px] flex flex-col items-center gap-1.5">
            <RefreshCw size={20} className="animate-spin text-indigo-600" />
            <span>{t('loadingHistory')}</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center">
            <Inbox size={32} className="opacity-40 mb-1.5" />
            <div className="text-[13px] font-medium text-slate-600">
              {t('noHistoryLogs')}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {t('noHistoryLogsSub')}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table w-full text-[12px]">
              <thead>
                <tr>
                  <th style={{ width: 130 }}>{t('thDate')}</th>
                  <th>{t('thFrom')}</th>
                  <th style={{ width: 30 }}></th>
                  <th>{t('thTo')}</th>
                  <th>{t('thOperator')}</th>
                  <th>{t('thNotes')}</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.ship_log_id} className="hover:bg-slate-50/80">
                    <td className="font-mono text-slate-600 whitespace-nowrap font-medium">
                      {log.ship_date
                        ? new Date(log.ship_date).toLocaleDateString('ja-JP')
                        : '—'}
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                        <Building2 size={12} className="text-slate-400" />
                        {log.from_company_name || '—'}
                      </span>
                    </td>
                    <td className="text-center text-slate-400">
                      <ArrowRight size={13} className="inline text-indigo-600" />
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 font-bold text-indigo-700 bg-indigo-50/70 px-2 py-0.5 rounded">
                        <Building2 size={12} className="text-indigo-500" />
                        {log.to_company_name || '—'}
                      </span>
                    </td>
                    <td className="text-slate-700 font-medium">
                      {log.employee_name || '—'}
                    </td>
                    <td
                      className="text-slate-600 max-w-[220px] truncate"
                      title={log.notes || ''}
                    >
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. Location & Company Move Modal */}
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
            current_layer_code: mold.rack_layers?.layer_code,
            current_rack_code: mold.rack_layers?.racks?.rack_code,
            current_location_in_factory:
              mold.rack_layers?.racks?.location_in_factory,
            company_id: ownerCompanyId,
            owner_company_name: ownerCompanyName,
            keeper_company_id: mold.keeper_company_id,
            keeper_company_name: mold.keeper_company?.company_name,
          }}
          defaultTab="COMPANY"
        />
      )}
    </div>
  )
}
