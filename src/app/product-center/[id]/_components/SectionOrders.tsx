'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { FileText, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SectionShell } from './SectionShell'

interface OrderLine {
  line_id: string
  order_id: string
  quantity: number
  unit: string
  line_status: string
  orders: {
    order_id: string
    order_no: string
    order_date: string
    order_status: string
    companies: {
      company_name: string
      company_code: string
    } | null
  } | null
}

const STATUS_BADGE: Record<string, string> = {
  NEW: 'badge badge--info',
  CONFIRMED: 'badge badge--warning',
  IN_PRODUCTION: 'badge badge--info',
  SHIPPED: 'badge badge--success',
  CANCELLED: 'badge badge--error',
}

export function SectionOrders({ productId }: { productId: string }) {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()
  const [orderLines, setOrderLines] = useState<OrderLine[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true)
      try {
        const { count } = await supabase
          .from('order_lines')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', productId)

        if (count !== null) setTotalCount(count)

        const { data, error } = await supabase
          .from('order_lines')
          .select(`
            line_id, order_id, quantity, unit, line_status, created_at,
            orders(order_id, order_no, order_date, order_status, companies:companies!orders_company_id_fkey(company_name, company_code))
          `)
          .eq('product_id', productId)
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        if (data) setOrderLines(data as unknown as OrderLine[])
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) fetchOrders()
  }, [productId])

  const actions = (
    <Link
      href={`/orders?product_id=${productId}`}
      className="btn btn-secondary"
      style={{ height: 24, padding: '0 8px', fontSize: 10, gap: 4, textDecoration: 'none' }}
    >
      <Plus size={12} />
      <span>{t('newOrder')}</span>
    </Link>
  )

  return (
    <SectionShell
      titleKey="section2Title"
      icon={FileText}
      accentColor="var(--tint-purple-text)"
      count={totalCount}
      isLoading={isLoading}
      actions={actions}
    >
      {orderLines.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', padding: '16px 0', textAlign: 'center', fontSize: 12 }}>
          {t('noOrders')}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>{t('orderNo')}</th>
                <th style={{ textAlign: 'left' }}>{t('customer')}</th>
                <th style={{ textAlign: 'left' }}>{t('orderDate')}</th>
                <th style={{ textAlign: 'right' }}>{t('quantity')}</th>
                <th style={{ textAlign: 'center' }}>{t('lineStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {orderLines.map((line) => {
                const order = Array.isArray(line.orders) ? line.orders[0] : line.orders
                const company = order?.companies ? (Array.isArray(order.companies) ? order.companies[0] : order.companies) : null

                return (
                  <tr key={line.line_id}>
                    <td>
                      {order ? (
                        <Link
                          href={`/orders/${order.order_id}`}
                          style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}
                        >
                          {order.order_no}
                        </Link>
                      ) : '—'}
                    </td>
                    <td>{company?.company_name || '—'}</td>
                    <td>{order?.order_date || '—'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      {line.quantity?.toLocaleString() || 0} {line.unit || ''}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={STATUS_BADGE[order?.order_status || ''] || 'badge badge--neutral'} style={{ fontSize: 9 }}>
                        {order?.order_status || '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8 }}>
            <Link href={`/orders?product_id=${productId}`} style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              {t('viewAll')} →
            </Link>
          </div>
        </div>
      )}
    </SectionShell>
  )
}
