'use client'

import React, { useState } from 'react'
import { RefreshCw, AlertTriangle, CheckCircle, PackageSearch, PackageOpen } from 'lucide-react'
import { MrpResult } from '@/app/actions/mrp'
import { useTranslations } from 'next-intl'

export default function MrpDashboardClient({ initialData }: { initialData: MrpResult[] }) {
  const t = useTranslations('Mrp')
  const [data] = useState<MrpResult[]>(initialData)
  const [selectedPlastic, setSelectedPlastic] = useState<string | null>(null)

  const selectedData = data.find(d => d.plastic_id === selectedPlastic)

  return (
    <div className="flex-1 p-6 bg-[var(--mcs-surface)] flex flex-col h-screen overflow-hidden">
      <header className="mb-6 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[var(--mcs-text)] flex items-center gap-2">
            <RefreshCw className="text-[var(--mcs-primary)]" />
            {t('title')}
          </h1>
          <p className="text-sm text-[var(--mcs-text-muted)]">{t('subtitle')}</p>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Cột trái: Danh sách tổng hợp Nhựa */}
        <div className="lg:col-span-2 flex flex-col bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-lg shadow-sm min-h-0">
          <div className="p-4 border-b border-[var(--mcs-border)] bg-[var(--mcs-surface-2)]">
            <h2 className="font-bold text-lg">{t('summaryTitle')}</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--mcs-surface-2)] text-[var(--mcs-text-muted)] sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t('colPlasticCode')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('colCurrentStock')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('colTotalDemand')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t('colShortage')}</th>
                  <th className="px-4 py-3 font-semibold text-center">{t('colStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--mcs-border)]">
                {data.map((item) => (
                  <tr 
                    key={item.plastic_id} 
                    onClick={() => setSelectedPlastic(item.plastic_id)}
                    className={`cursor-pointer hover:bg-[var(--mcs-surface-2)] transition-colors ${selectedPlastic === item.plastic_id ? 'bg-[#e6f4f4]' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-[var(--mcs-primary)]">{item.plastic_code}</div>
                      <div className="text-xs text-[var(--mcs-text-muted)]">{item.plastic_color} • {item.plastic_thickness}mm</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{item.current_stock_meters.toLocaleString(undefined, {maximumFractionDigits:1})}</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-600">{item.total_demand_meters.toLocaleString(undefined, {maximumFractionDigits:1})}</td>
                    <td className={`px-4 py-3 text-right font-bold ${item.shortage_meters > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                      {item.shortage_meters > 0 ? `-${item.shortage_meters.toLocaleString(undefined, {maximumFractionDigits:1})}` : '0'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.shortage_meters > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                          <AlertTriangle size={12} /> {t('statusShortage')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold">
                          <CheckCircle size={12} /> {t('statusOk')}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-[var(--mcs-text-muted)]">
                      <PackageOpen className="mx-auto mb-2 opacity-50" size={32} />
                      {t('noDemand')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột phải: Chi tiết các Đơn hàng cấu thành Nhu cầu */}
        <div className="flex flex-col bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-lg shadow-sm min-h-0">
          <div className="p-4 border-b border-[var(--mcs-border)] bg-[var(--mcs-surface-2)]">
            <h2 className="font-bold text-lg">{t('detailTitle')}</h2>
            {selectedData && (
              <p className="text-sm text-[var(--mcs-text-muted)] mt-1">{t('detailSub', { code: selectedData.plastic_code })}</p>
            )}
          </div>
          <div className="flex-1 overflow-auto p-4">
            {!selectedData ? (
              <div className="h-full flex flex-col items-center justify-center text-[var(--mcs-text-muted)]">
                <PackageSearch size={48} className="mb-2 opacity-30" />
                <p>{t('selectPlasticPrompt')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedData.demand_details.map((detail, idx) => (
                  <div key={idx} className="bg-[var(--mcs-surface-2)] border border-[var(--mcs-border)] rounded p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-[13px] text-[var(--mcs-primary)]">{t('orderPrefix')}{detail.order_slip_no}</div>
                      <div className="font-bold text-sm text-amber-600">{detail.plastic_demand_meters.toLocaleString(undefined, {maximumFractionDigits:1})} m</div>
                    </div>
                    <div className="text-xs flex justify-between text-[var(--mcs-text-muted)]">
                      <span>{t('productPrefix')}{detail.product_code}</span>
                      <span>{t('qtyPrefix')}{detail.qty_needed.toLocaleString()}{t('qtySuffix')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
