'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, Printer, ExternalLink, CheckCircle, AlertCircle, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { WorkOrderListItem } from '../types'

interface WorkOrderTableProps {
  data: WorkOrderListItem[]
}

export function WorkOrderTable({ data }: WorkOrderTableProps) {
  const t = useTranslations('WorkOrders')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge badge--success">{t('completed')}</span>
      case 'IN_PROGRESS':
        return <span className="badge badge--warning">{t('inProgress')}</span>
      case 'CANCELLED':
        return <span className="badge badge--error">{t('cancelled')}</span>
      case 'PLANNED':
      default:
        return <span className="badge badge--info">{t('planned')}</span>
    }
  }

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ width: 130 }}>{t('col_code')}</th>
            <th style={{ width: 190 }}>{t('col_name')}</th>
            <th style={{ width: 140 }}>{t('col_customer')}</th>
            <th style={{ width: 110, textAlign: 'center' }}>{t('colLinkedOrder')}</th>
            <th style={{ width: 110, textAlign: 'center' }}>{t('colSetStatus')}</th>
            <th style={{ width: 110, textAlign: 'center' }}>{t('colProgress')}</th>
            <th style={{ width: 100, textAlign: 'center' }}>{t('colHours')}</th>
            <th style={{ width: 95, textAlign: 'center' }}>{t('col_deadline')}</th>
            <th style={{ width: 85, textAlign: 'center' }}>{t('col_status')}</th>
            <th style={{ width: 90, textAlign: 'center' }}>{t('action')}</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={10} style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
                指示票データが見つかりません (Không có dữ liệu)
              </td>
            </tr>
          ) : (
            data.map((wo) => {
              const hasSet = wo.total_set_items > 0
              const isSetReady = wo.is_set_ready

              return (
                <tr key={wo.wo_id}>
                  {/* WO Code - Hyperlink */}
                  <td style={{ verticalAlign: 'middle' }}>
                    <Link
                      href={`/production/work-orders/${wo.wo_id}`}
                      style={{
                        color: 'var(--accent)',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        fontSize: 13,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {wo.wo_code}
                    </Link>
                  </td>

                  {/* Name & Product */}
                  <td style={{ verticalAlign: 'middle' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {wo.wo_name}
                    </div>
                    {wo.product_code && (
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
                        {wo.product_code} {wo.product_name ? `(${wo.product_name})` : ''}
                      </div>
                    )}
                  </td>

                  {/* Customer */}
                  <td style={{ verticalAlign: 'middle', fontSize: 12, color: 'var(--text-secondary)' }}>
                    {wo.company_name || '—'}
                  </td>

                  {/* 1. Linked Order (M28-B) */}
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    {wo.order_id && wo.order_no ? (
                      <Link
                        href={`/orders/${wo.order_id}`}
                        style={{
                          color: 'var(--accent)',
                          fontWeight: 600,
                          fontFamily: 'monospace',
                          fontSize: 11,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          backgroundColor: '#F0FDFA',
                          padding: '2px 6px',
                          borderRadius: 4,
                          border: '1px solid #CCFBF1',
                        }}
                        title="受注伝票を表示"
                      >
                        <FileText size={11} />
                        <span>{wo.order_no}</span>
                      </Link>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>

                  {/* SET Status Badge */}
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    {hasSet ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '2px 6px',
                          borderRadius: 12,
                          fontSize: 10.5,
                          fontWeight: 700,
                          backgroundColor: isSetReady ? 'var(--tint-teal-bg, #F0FDF4)' : 'var(--tint-orange-bg, #FFFBEB)',
                          color: isSetReady ? '#15803D' : '#B45309',
                          border: `1px solid ${isSetReady ? '#BBF7D0' : '#FDE68A'}`,
                        }}
                      >
                        {isSetReady ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                        <span>
                          {isSetReady ? t('setReadyBadge') : t('setIncompleteBadge')}{' '}
                          ({wo.ready_set_items}/{wo.total_set_items})
                        </span>
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        —
                      </span>
                    )}
                  </td>

                  {/* 2. % Tiến độ tổng hợp (M28-B) */}
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: wo.progress_percent === 100 ? '#15803D' : 'var(--text-primary)',
                          }}
                        >
                          {wo.progress_percent}%
                        </span>
                        {wo.total_steps > 0 && (
                          <span style={{ fontSize: 9.5, color: 'var(--text-secondary)' }}>
                            ({wo.completed_steps}/{wo.total_steps})
                          </span>
                        )}
                      </div>
                      <div style={{ width: 70, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.min(wo.progress_percent, 100)}%`,
                            height: '100%',
                            backgroundColor: wo.progress_percent === 100 ? '#10B981' : (wo.is_overdue ? '#EF4444' : 'var(--accent, #0D9488)'),
                            transition: 'width 0.3s',
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* 3. Giờ công Planned / Actual (M28-B) */}
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, fontFamily: 'monospace', lineHeight: 1.3 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{wo.sum_planned_hours}h</span>
                      <span style={{ color: 'var(--text-muted)', margin: '0 2px' }}>/</span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: wo.variance_hours > 0 ? '#DC2626' : (wo.sum_actual_hours > 0 ? '#0D9488' : 'var(--text-primary)'),
                        }}
                      >
                        {wo.sum_actual_hours}h
                      </span>
                      {wo.variance_hours > 0 && (
                        <div style={{ fontSize: 9, color: '#DC2626', fontWeight: 700 }}>
                          (+{wo.variance_hours}h)
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Deadline */}
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    {wo.deadline ? (
                      <span
                        style={{
                          fontSize: 12,
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          color: wo.is_overdue ? '#DC2626' : 'var(--text-primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Calendar size={13} color={wo.is_overdue ? '#DC2626' : 'var(--text-muted)'} />
                        {wo.deadline.slice(0, 10)}
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    {getStatusBadge(wo.wo_status)}
                  </td>

                  {/* Actions */}
                  <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      {/* Print PDF */}
                      <a
                        href={`/api/production/work-orders/${wo.wo_id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary"
                        style={{
                          padding: '3px 6px',
                          height: 'auto',
                          fontSize: 11,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                        title={t('printPdf')}
                      >
                        <Printer size={13} />
                        <span>PDF</span>
                      </a>

                      {/* Detail View */}
                      <Link
                        href={`/production/work-orders/${wo.wo_id}`}
                        className="btn btn-secondary"
                        style={{
                          padding: '3px 6px',
                          height: 'auto',
                          fontSize: 11,
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                        title="詳細"
                      >
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
