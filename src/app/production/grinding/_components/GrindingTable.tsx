'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { format } from 'date-fns'

interface GrindingLog {
  log_id: string
  log_date: string
  weight_kg: number
  bag_count: number | null
  notes: string | null
  material_type: string
  employees: {
    employee_name: string
  } | null
}

interface Props {
  logs: GrindingLog[]
}

export default function GrindingTable({ logs }: Props) {
  const t = useTranslations('Grinding')

  return (
    <div className="card-flat">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>{t('date')}</th>
              <th>{t('employee')}</th>
              <th>{t('material')}</th>
              <th className="text-right">{t('weightKg')}</th>
              <th className="text-right">{t('bagCount')}</th>
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
                  <td>
                    <span className="badge badge--info">{log.material_type}</span>
                  </td>
                  <td className="text-right font-mono">{log.weight_kg}</td>
                  <td className="text-right font-mono">{log.bag_count || '—'}</td>
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
