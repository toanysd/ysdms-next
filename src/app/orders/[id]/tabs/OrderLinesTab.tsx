import Link from 'next/link'
import type { OrderDetailData } from '../page'

export function OrderLinesTab({ order }: { order: OrderDetailData }) {
  const lines = order.order_lines || []

  if (lines.length === 0) {
    return (
      <div className="card-flat" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        明細がありません
      </div>
    )
  }

  return (
    <div className="card-flat custom-scrollbar" style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 60, textAlign: 'center' }}>No.</th>
            <th>品番</th>
            <th>品名</th>
            <th style={{ width: 100, textAlign: 'right' }}>数量</th>
            <th style={{ width: 100 }}>有償・無償</th>
            <th style={{ width: 120 }}>出荷日</th>
            <th style={{ width: 120 }}>納期</th>
            <th style={{ width: 120 }}>荷姿</th>
            <th style={{ width: 100, textAlign: 'center' }}>状態</th>
          </tr>
        </thead>
        <tbody>
          {lines.sort((a, b) => a.line_no - b.line_no).map(line => (
            <tr key={line.line_id}>
              <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {line.line_no}
              </td>
              <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                {line.product_id ? (
                  <Link href={`/master/products/${line.product_id}`} className="hover:underline" style={{ color: 'var(--accent)' }}>
                    {line.products?.product_code || line.product_id}
                  </Link>
                ) : (
                  '—'
                )}
              </td>
              <td>
                {line.products?.product_name || '—'}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                {line.quantity} <span style={{fontSize: 11, fontWeight: 'normal', color: 'var(--text-muted)'}}>{line.unit}</span>
              </td>
              <td>
                {line.charge_type === 'FREE' && <span className="badge badge--warning">無償</span>}
                {line.charge_type === 'PAID' && <span className="badge badge--success">有償</span>}
                {line.charge_type === 'OFFICE_SAMPLE' && <span className="badge badge--info">事務所</span>}
              </td>
              <td>{line.ship_date || '—'}</td>
              <td>{line.due_date || '—'}</td>
              <td>{line.packing_style || '—'}</td>
              <td style={{ textAlign: 'center' }}>
                <span className="badge badge--neutral">{line.line_status || line.status || 'NEW'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
