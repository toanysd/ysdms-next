'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { format } from 'date-fns'

interface InspectionLog {
  log_id: string
  log_date: string
  inspector_id: string
  result: string | null
  qty_wc: number | null
  qty_sc: number | null
  qty_dt: number | null
  qty_fm: number | null
  qty_bh: number | null
  qty_br: number | null
  qty_sd: number | null
  qty_ot: number | null
  notes: string | null
  employees: {
    employee_name: string
  } | null
  products: {
    product_code: string
  } | null
}

interface Props {
  logs: InspectionLog[]
}

export default function InspectionTable({ logs }: Props) {
  const t = useTranslations('DailyInspection')

  const getResultBadge = (res: string | null) => {
    switch (res) {
      case 'PASS': return <span className="badge badge--success">{t('pass')}</span>
      case 'FAIL': return <span className="badge badge--error">{t('fail')}</span>
      case 'CONDITIONAL': return <span className="badge badge--warning">{t('conditional')}</span>
      default: return <span className="badge badge--neutral">—</span>
    }
  }

  const calcNg = (log: InspectionLog) => {
    return (log.qty_wc || 0) + (log.qty_sc || 0) + (log.qty_dt || 0) + 
           (log.qty_fm || 0) + (log.qty_bh || 0) + (log.qty_br || 0) + 
           (log.qty_sd || 0) + (log.qty_ot || 0)
  }

  return (
    <div className="card-flat">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('inspector')}</th>
              <th>{t('product')}</th>
              <th>{t('result')}</th>
              <th className="text-right">{t('totalNg')}</th>
              <th>{t('notes')}</th>
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
                  <td>{getResultBadge(log.result)}</td>
                  <td className="text-right font-mono text-[var(--status-error)]">
                    {calcNg(log)}
                  </td>
                  <td>{log.notes || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
