'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { format } from 'date-fns'

interface LogEntry {
  log_id: string
  log_date: string
  operator_id: string
  qty_ok: number
  qty_ng?: number
  equipment_id: string | null
  employees: {
    employee_name: string
  } | null
  products: {
    product_code: string
  } | null
}

interface Props {
  logs: LogEntry[]
  type: 'forming' | 'press'
}

export default function DailyLogsTable({ logs, type }: Props) {
  const t = useTranslations('DailyLogs')

  const calcFormingNg = (log: any) => {
    return (log.qty_ng_a || 0) + (log.qty_ng_b || 0) + (log.qty_ng_c || 0) +
           (log.qty_ng_d || 0) + (log.qty_ng_e || 0) + (log.qty_ng_f || 0) + (log.qty_ng_g || 0)
  }

  return (
    <div className="card-flat">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('operator')}</th>
              <th>{t('product')}</th>
              <th>{t('equipment')}</th>
              <th className="text-right">{t('goodQty')}</th>
              <th className="text-right">{t('ngQty')}</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-[var(--text-muted)]">
                  —
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.log_id}>
                  <td>{log.log_date ? format(new Date(log.log_date), 'yyyy-MM-dd') : '—'}</td>
                  <td>{log.employees?.employee_name || '—'}</td>
                  <td className="font-mono">{log.products?.product_code || '—'}</td>
                  <td className="font-mono">{log.equipment_id || '—'}</td>
                  <td className="text-right font-mono text-[var(--status-success)]">{log.qty_ok}</td>
                  <td className="text-right font-mono text-[var(--status-error)]">
                    {type === 'forming' ? calcFormingNg(log) : (log.qty_ng || 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
