'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Loader2, ShoppingBag } from 'lucide-react'

type OrderLineWithInfo = {
  line_id: string
  line_no: number
  quantity: number
  unit: string | null
  due_date: string | null
  line_status: string | null
  orders: {
    order_id: string
    order_no: string
    order_date: string | null
    order_status: string | null
    companies: {
      company_name: string
      company_code: string
    } | null
  } | null
}

export function OrdersTab({ productId }: { productId: string }) {
  const supabase = createClient()
  const [lines, setLines] = useState<OrderLineWithInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: err } = await supabase
          .from('order_lines')
          .select(`
            line_id,
            line_no,
            quantity,
            unit,
            due_date,
            line_status,
            orders!inner(
              order_id,
              order_no,
              order_date,
              order_status,
              companies(company_name, company_code)
            )
          `)
          .eq('product_id', productId)
          .order('created_at', { ascending: false })

        if (err) throw err
        setLines((data || []) as unknown as OrderLineWithInfo[])
      } catch (err: any) {
        console.error("Error fetching product orders:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [productId, supabase])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, gap: 8 }}>
        <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>注文履歴を読み込み中...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card-flat" style={{ padding: 20, color: 'var(--status-error)', fontSize: 12 }}>
        ⚠ {error}
      </div>
    )
  }

  if (lines.length === 0) {
    return (
      <div className="card-flat" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        <ShoppingBag size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
        <div style={{ fontSize: 12, fontFamily: 'var(--font-jp)' }}>注文履歴がありません</div>
        <div style={{ fontSize: 11, marginTop: 2 }}>Chưa có đơn hàng nào cho sản phẩm này.</div>
      </div>
    )
  }

  return (
    <div className="card-flat custom-scrollbar" style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 50, textAlign: 'center' }}>No</th>
            <th>受注番号 / Mã Đơn hàng</th>
            <th>得意先 / Khách hàng</th>
            <th style={{ width: 100, textAlign: 'center' }}>受注日</th>
            <th style={{ width: 100, textAlign: 'right' }}>数量 / SL</th>
            <th style={{ width: 70 }}>単位</th>
            <th style={{ width: 100, textAlign: 'center' }}>明細状態</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line, idx) => (
            <tr key={line.line_id}>
              <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {idx + 1}
              </td>
              <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                {line.orders ? (
                  <Link href={`/orders/${line.orders.order_id}`} className="hover:underline" style={{ color: 'var(--accent)' }}>
                    {line.orders.order_no}
                  </Link>
                ) : (
                  '—'
                )}
              </td>
              <td>
                <span className="font-bold text-slate-700">{line.orders?.companies?.company_code}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>
                  {line.orders?.companies?.company_name}
                </span>
              </td>
              <td style={{ textAlign: 'center', fontFamily: 'monospace' }}>
                {line.orders?.order_date ? new Date(line.orders.order_date).toLocaleDateString() : '—'}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                {line.quantity?.toLocaleString()}
              </td>
              <td style={{ color: 'var(--text-muted)' }}>{line.unit || 'PCS'}</td>
              <td style={{ textAlign: 'center' }}>
                <span className={`badge ${
                  line.line_status === 'COMPLETED' ? 'badge--success' : 'badge--neutral'
                }`}>
                  {line.line_status || 'NEW'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
