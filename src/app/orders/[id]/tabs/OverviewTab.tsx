import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import { createClient } from '@/lib/supabase/client'
import type { OrderDetailData } from '../page'

export function OverviewTab({
  order,
  isEditing,
  formData,
  setFormData
}: {
  order: OrderDetailData
  isEditing: boolean
  formData: Partial<OrderDetailData>
  setFormData: (val: any) => void
}) {
  const supabase = createClient()

  // Note: isEditing is now handled by OrderForm, so we only need to render the read-only view here.
  return (
    <div className="card-flat" style={{ padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>要求No.</div>
          <div style={{ fontSize: 13, fontFamily: 'monospace' }}>{order.customer_order_no || '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>伝票/LOT No.</div>
          <div style={{ fontSize: 13, fontFamily: 'monospace' }}>{order.lot_no || '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>受注種別</div>
          <div>
            <span className={order.order_type === 'MOLD' ? 'badge badge--warning' : 'badge badge--info'}>
              {order.order_type === 'MOLD' ? '金型' : '製品・トレイ'}
            </span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>受注日</div>
          <div style={{ fontSize: 13, fontFamily: 'monospace' }}>{order.order_date || '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>希望納期</div>
          <div style={{ fontSize: 13, fontFamily: 'monospace' }}>{order.requested_delivery || '—'}</div>
        </div>
        <div style={{ gridColumn: '1' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>備考</div>
          <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{order.notes || '—'}</div>
        </div>
      </div>
    </div>
  )
}
