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

  if (isEditing) {
    return (
      <div className="card-flat" style={{ padding: 20 }}>
        <div className="form-grid-2">
          <div className="form-field">
            <label className="form-label"><span className="label-ja">受注番号</span><span className="label-vi">Mã đơn hàng</span></label>
            <input type="text" className="form-input" style={{ fontFamily: 'monospace' }} value={formData.order_no || ''} onChange={e => setFormData({ ...formData, order_no: e.target.value })} />
          </div>
          <div className="form-field">
            <label className="form-label"><span className="label-ja">状態</span><span className="label-vi">Trạng thái</span></label>
            <select className="form-input" value={formData.order_status || 'NEW'} onChange={e => setFormData({ ...formData, order_status: e.target.value })}>
              <option value="NEW">新規 / Mới</option>
              <option value="QUOTED">見積済 / Đã báo giá</option>
              <option value="APPROVED">承認済 / Đã duyệt</option>
              <option value="IN_PRODUCTION">生産中 / Đang SX</option>
              <option value="SHIPPED">出荷済 / Đã giao</option>
              <option value="CANCELLED">取消 / Đã huỷ</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label"><span className="label-ja">得意先</span><span className="label-vi">Khách hàng</span></label>
            <AsyncSearchableSelect
              value={formData.company_id || null}
              onChange={(v) => setFormData({ ...formData, company_id: v })}
              placeholder="顧客を検索..."
              fetchOptions={async (q) => {
                const { data } = await supabase
                  .from('companies')
                  .select('company_id, company_name, company_code')
                  .ilike('company_name', `%${q}%`)
                  .limit(20)
                return (data || []).map((c: any) => ({
                  value: c.company_id,
                  label: c.company_name,
                  sublabel: c.company_code
                }))
              }}
            />
          </div>
          <div />

          <div className="form-field">
            <label className="form-label"><span className="label-ja">受注日</span><span className="label-vi">Ngày đặt</span></label>
            <input type="date" className="form-input" value={formData.order_date || ''} onChange={e => setFormData({ ...formData, order_date: e.target.value })} />
          </div>
          <div className="form-field">
            <label className="form-label"><span className="label-ja">希望納期</span><span className="label-vi">Ngày giao mong muốn</span></label>
            <input type="date" className="form-input" value={formData.requested_delivery || ''} onChange={e => setFormData({ ...formData, requested_delivery: e.target.value })} />
          </div>
        </div>

        <div className="form-field" style={{ marginTop: 16 }}>
          <label className="form-label"><span className="label-ja">備考</span><span className="label-vi">Ghi chú</span></label>
          <textarea className="form-textarea" value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={3} />
        </div>
      </div>
    )
  }

  return (
    <div className="card-flat" style={{ padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>受注日 / Ngày đặt</div>
          <div style={{ fontSize: 13, fontFamily: 'monospace' }}>{order.order_date || '—'}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>希望納期 / Ngày giao mong muốn</div>
          <div style={{ fontSize: 13, fontFamily: 'monospace' }}>{order.requested_delivery || '—'}</div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>備考 / Ghi chú</div>
          <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{order.notes || '—'}</div>
        </div>
      </div>
    </div>
  )
}
