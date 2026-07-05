'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertTriangle, Save } from 'lucide-react'
import { useParams } from 'next/navigation'

import { OrderBackButton } from './BackButton'
import { OrderDetailHeader } from './OrderDetailHeader'
import { OrderTabNavigation, type TabId } from './OrderTabNavigation'
import { OverviewTab } from './tabs/OverviewTab'
import { OrderLinesTab } from './tabs/OrderLinesTab'

export type OrderLineDetail = {
  line_id: string
  order_id: string
  product_id: string | null
  quantity: number
  unit: string
  unit_price: number | null
  status: string
  line_no: number
  is_free_sample: boolean
  products: { product_code: string; product_name: string | null } | null
}

export type OrderDetailData = {
  order_id: string
  order_no: string
  company_id: string | null
  quote_id: string | null
  order_date: string | null
  requested_delivery: string | null
  order_status: string
  notes: string | null
  created_at: string
  companies: {
    company_name: string
    company_code: string
  } | null
  order_lines: OrderLineDetail[]
}

function TabContent({ 
  tab, order, isEditing, formData, setFormData 
}: { 
  tab: TabId; order: OrderDetailData;
  isEditing: boolean;
  formData: Partial<OrderDetailData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<OrderDetailData>>>;
}) {
  switch (tab) {
    case 'overview':  return <OverviewTab order={order} isEditing={isEditing} formData={formData} setFormData={setFormData} />
    case 'order_lines': return <OrderLinesTab order={order} />
    case 'shipments': return <PlaceholderTab name="出荷履歴 / Lịch sử giao hàng" />
    default:          return null
  }
}

function PlaceholderTab({ name }: { name: string }) {
  return (
    <div className="card-flat" style={{
      padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)',
    }}>
      <div style={{ fontSize: 13, fontFamily: 'var(--font-jp)', marginBottom: 4 }}>
        {name}
      </div>
      <div style={{ fontSize: 11 }}>
        開発中 / Đang phát triển...
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string
  const supabase = createClient()

  const [order, setOrder] = useState<OrderDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<OrderDetailData>>({})

  const fetchOrder = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('orders')
      .select(`
        *,
        companies(company_name, company_code),
        order_lines(
          *,
          products(product_code, product_name)
        )
      `)
      .eq('order_id', orderId)
      .single()

    if (err) {
      setError(err.message)
    } else {
      setOrder(data as unknown as OrderDetailData)
      setFormData(data as unknown as OrderDetailData)
    }
    setLoading(false)
  }, [orderId, supabase])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  const handleSave = async () => {
    if (!order) return
    
    const fieldsToUpdate = {
      order_no: formData.order_no,
      order_status: formData.order_status,
      company_id: formData.company_id,
      order_date: formData.order_date || null,
      requested_delivery: formData.requested_delivery || null,
      notes: formData.notes,
    }

    const { error: updateErr } = await supabase
      .from('orders')
      .update(fieldsToUpdate as any)
      .eq('order_id', order.order_id)

    if (!updateErr) {
      setIsEditing(false)
      fetchOrder()
    } else {
      console.error(updateErr)
      alert("Failed to save: " + updateErr.message)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 8 }}>
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>読み込み中...</span>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="card-flat" style={{ padding: 20, textAlign: 'center' }}>
        <AlertTriangle size={24} style={{ color: 'var(--status-error)', marginBottom: 8, marginInline: 'auto' }} />
        <div style={{ fontSize: 13, color: 'var(--status-error)', fontWeight: 600 }}>
          {error || '受注が見つかりません / Không tìm thấy đơn hàng'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          ID: {orderId}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 relative" style={{ height: '100%', paddingBottom: isEditing ? 80 : 0 }}>
      <OrderBackButton />

      <OrderDetailHeader 
        order={order} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing}
      />

      <OrderTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div style={{ marginTop: 16 }}>
        <TabContent 
          tab={activeTab} 
          order={order} 
          isEditing={isEditing} 
          formData={formData} 
          setFormData={setFormData} 
        />
      </div>

      {isEditing && (
        <div className="card-flat sticky bottom-0 z-10 flex justify-end gap-2 p-3 mt-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <button className="btn btn-secondary" onClick={() => { setIsEditing(false); setFormData(order) }}>
            キャンセル / Huỷ
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            保存 / Lưu
          </button>
        </div>
      )}
    </div>
  )
}
