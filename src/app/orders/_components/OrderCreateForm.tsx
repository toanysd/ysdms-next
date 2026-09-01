'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import { useTranslations } from 'next-intl'
import { Save, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function OrderCreateForm() {
  const tCommon = useTranslations('Common')
  const router = useRouter()
  const supabase = createClient()

  const [companyId, setCompanyId] = useState<string | null>(null)
  const [orderNo, setOrderNo] = useState('')
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0])
  const [requestedDelivery, setRequestedDelivery] = useState('')
  const [customerOrderNo, setCustomerOrderNo] = useState('')
  const [notes, setNotes] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyId || !orderNo || !orderDate) {
      setError('Vui lòng nhập các trường bắt buộc (*)')
      return
    }

    setIsSubmitting(true)
    setError(null)

    const payload = {
      company_id: companyId,
      order_no: orderNo,
      order_date: orderDate,
      requested_delivery: requestedDelivery || null,
      customer_order_no: customerOrderNo || null,
      notes: notes || null,
      order_status: 'DRAFT'
    }

    const { data, error: insertError } = await supabase
      .from('orders')
      .insert(payload)
      .select('order_id')
      .single()

    setIsSubmitting(false)

    if (insertError) {
      setError(insertError.message)
    } else if (data) {
      router.push(`/orders/${data.order_id}`)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, padding: '4px 0' }}>
        <Link href="/orders" style={{ color: 'var(--text-muted)' }} className="btn btn-secondary !p-1.5">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>Tạo Đơn hàng mới</h1>
      </div>

      <div className="card-flat" style={{ flex: 1, padding: '24px' }}>
        <form onSubmit={handleSubmit} style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {error && (
            <div className="form-callout form-callout--error">
              {error}
            </div>
          )}

          <div className="form-grid-1">
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                Khách hàng <span style={{ color: 'var(--status-error)' }}>*</span>
              </label>
              <AsyncSearchableSelect
                placeholder="Tìm Khách hàng..."
                value={companyId}
                onChange={(val) => setCompanyId(val)}
                fetchOptions={async (query: string) => {
                  let q = supabase
                    .from('companies')
                    .select('company_id, company_code, company_name')
                    .contains('company_type', ['CUSTOMER'])
                  
                  if (query) {
                    q = q.or(`company_code.ilike.%${query}%,company_name.ilike.%${query}%`)
                  }
                  
                  const { data } = await q.limit(20)
                  return (data || []).map(c => ({
                    value: c.company_id,
                    label: c.company_name,
                    sublabel: c.company_code
                  }))
                }}
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                Mã Đơn hàng (Nội bộ) <span style={{ color: 'var(--status-error)' }}>*</span>
              </label>
              <input
                className="form-input font-mono text-[13px]"
                value={orderNo}
                onChange={e => setOrderNo(e.target.value)}
                placeholder="VD: ORD-2026-0001"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                Số PO Khách hàng (Nếu có)
              </label>
              <input
                className="form-input font-mono text-[13px]"
                value={customerOrderNo}
                onChange={e => setCustomerOrderNo(e.target.value)}
                placeholder="VD: PO-123456"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                Ngày đặt hàng <span style={{ color: 'var(--status-error)' }}>*</span>
              </label>
              <input
                type="date"
                className="form-input text-[13px]"
                value={orderDate}
                onChange={e => setOrderDate(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                Ngày giao yêu cầu
              </label>
              <input
                type="date"
                className="form-input text-[13px]"
                value={requestedDelivery}
                onChange={e => setRequestedDelivery(e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-1">
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>Ghi chú</label>
              <textarea
                className="form-textarea text-[13px]"
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="..."
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <button type="button" onClick={() => router.push('/orders')} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ minWidth: 120 }}>
              {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {tCommon('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
