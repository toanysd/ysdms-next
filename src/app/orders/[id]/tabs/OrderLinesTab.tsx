import type { OrderDetailData } from '../page'

export function OrderLinesTab({ order }: { order: OrderDetailData }) {
  const lines = order.order_lines || []

  if (lines.length === 0) {
    return (
      <div className="card-flat" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        明細がありません / Không có chi tiết sản phẩm
      </div>
    )
  }

  return (
    <div className="card-flat custom-scrollbar" style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 60, textAlign: 'center' }}>No</th>
            <th>品番 / Mã SP</th>
            <th>品名 / Tên SP</th>
            <th style={{ width: 100, textAlign: 'right' }}>数量 / SL</th>
            <th style={{ width: 80 }}>単位</th>
            <th style={{ width: 100, textAlign: 'center' }}>状態 / Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {lines.sort((a, b) => a.line_no - b.line_no).map(line => (
            <tr key={line.line_id}>
              <td style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {line.line_no}
              </td>
              <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--text-primary)' }}>
                {line.products?.product_code || '—'}
              </td>
              <td>
                {line.products?.product_name || '—'}
                {line.is_free_sample && <span className="badge badge--warning" style={{ marginLeft: 6, fontSize: 9 }}>SAMPLE</span>}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>
                {line.quantity}
              </td>
              <td style={{ color: 'var(--text-muted)' }}>{line.unit}</td>
              <td style={{ textAlign: 'center' }}>
                <span className="badge badge--neutral">{line.status || 'NEW'}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
