'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Plus, ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react'
import { InventoryItem } from '../actions'

interface InventoryTableProps {
  items: InventoryItem[]
  sortCol: string
  sortDir: 'asc' | 'desc'
  onSort: (col: string) => void
}

export function InventoryTable({ items, sortCol, sortDir, onSort }: InventoryTableProps) {
  const t = useTranslations('Inventory')

  const renderSortIcon = (col: string) => {
    if (sortCol !== col) return <ArrowUpDown size={12} className="text-slate-400 opacity-60" />
    return sortDir === 'asc' ? <ArrowUp size={12} style={{ color: 'var(--accent)' }} /> : <ArrowDown size={12} style={{ color: 'var(--accent)' }} />
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return <span className="badge badge--success">{t('statusInStock')}</span>
      case 'LOW_STOCK':
        return (
          <span className="badge badge--warning flex items-center gap-1 font-bold">
            <AlertTriangle size={11} />
            {t('statusLowStock')}
          </span>
        )
      case 'OUT_OF_STOCK':
        return <span className="badge badge--neutral">{t('statusOutOfStock')}</span>
      default:
        return <span className="badge badge--neutral">{status}</span>
    }
  }

  return (
    <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => onSort('product_code')} className="cursor-pointer" style={{ width: '22%' }}>
                <div className="flex items-center gap-1.5">
                  <span>{t('thProduct')}</span>
                  {renderSortIcon('product_code')}
                </div>
              </th>
              <th style={{ width: '18%' }}>{t('thCustomer')}</th>
              <th onClick={() => onSort('total_produced')} className="cursor-pointer text-right" style={{ width: '12%' }}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>{t('thProduced')}</span>
                  {renderSortIcon('total_produced')}
                </div>
              </th>
              <th onClick={() => onSort('total_shipped')} className="cursor-pointer text-right" style={{ width: '12%' }}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>{t('thShipped')}</span>
                  {renderSortIcon('total_shipped')}
                </div>
              </th>
              <th onClick={() => onSort('current_stock')} className="cursor-pointer text-right" style={{ width: '12%' }}>
                <div className="flex items-center justify-end gap-1.5">
                  <span>{t('thStock')}</span>
                  {renderSortIcon('current_stock')}
                </div>
              </th>
              <th className="text-right" style={{ width: '10%' }}>{t('thThreshold')}</th>
              <th style={{ width: '14%' }}>{t('thStatus')}</th>
              <th className="text-center" style={{ width: '12%' }}>{t('thActions')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isLowStock = item.stock_status === 'LOW_STOCK'
              const isOutOfStock = item.stock_status === 'OUT_OF_STOCK'
              const needsWO = isLowStock || isOutOfStock

              return (
                <tr
                  key={item.product_id}
                  style={{
                    background: isLowStock ? 'rgba(245, 158, 11, 0.04)' : undefined,
                  }}
                >
                  {/* Sản phẩm */}
                  <td>
                    <div className="flex flex-col">
                      <Link
                        href={`/product-center/${item.product_id}`}
                        style={{
                          fontWeight: 700,
                          fontFamily: 'monospace',
                          fontSize: 13,
                          color: 'var(--accent)',
                          textDecoration: 'none',
                        }}
                        className="hover:underline"
                        title={item.product_name || item.product_code}
                      >
                        {item.product_code}
                      </Link>
                      {item.product_name && item.product_name !== item.product_code && (
                        <span className="text-[11px] text-slate-500 truncate" style={{ maxWidth: 200 }}>
                          {item.product_name}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Khách hàng */}
                  <td>
                    <span className="text-[12px] font-medium text-slate-700">
                      {item.company_name || '—'}
                    </span>
                  </td>

                  {/* Đã dập (Produced) */}
                  <td className="text-right font-mono text-[13px] text-slate-600">
                    {item.total_produced.toLocaleString()}
                  </td>

                  {/* Đã xuất (Shipped) */}
                  <td className="text-right font-mono text-[13px] text-slate-600">
                    {item.total_shipped.toLocaleString()}
                  </td>

                  {/* Tồn kho (Stock) */}
                  <td className="text-right font-mono text-[14px] font-bold">
                    <span
                      style={{
                        color: item.current_stock > 0 ? '#0F172A' : '#94A3B8',
                      }}
                    >
                      {item.current_stock.toLocaleString()}
                    </span>
                  </td>

                  {/* Ngưỡng an toàn */}
                  <td className="text-right font-mono text-[12px] text-slate-500">
                    {item.low_stock_threshold.toLocaleString()}
                  </td>

                  {/* Trạng thái */}
                  <td>
                    {renderStatusBadge(item.stock_status)}
                  </td>

                  {/* Thao tác: Tạo WO */}
                  <td className="text-center">
                    {needsWO && (
                      <Link
                        href={`/production/work-orders/new?product_id=${item.product_id}&wo_name=${encodeURIComponent('新規金型製作 ' + item.product_code)}&source=inventory_alert`}
                      >
                        <button
                          className="btn btn-secondary flex items-center justify-center gap-1 text-[11px] px-2 py-1 h-auto w-full"
                          style={{
                            borderColor: isOutOfStock ? '#EF4444' : '#F59E0B',
                            color: isOutOfStock ? '#DC2626' : '#D97706',
                            background: isOutOfStock ? '#FEF2F2' : '#FFFBEB',
                            fontWeight: 700,
                          }}
                          title="Tạo Lệnh sản xuất để bổ sung tồn kho cho sản phẩm này"
                        >
                          <Plus size={12} />
                          <span>{t('btnCreateWO')}</span>
                        </button>
                      </Link>
                    )}
                  </td>
                </tr>
              )
            })}

            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400 italic">
                  {t('noProductsFound')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
