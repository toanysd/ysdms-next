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
import { ProductionInstructionsTab } from './tabs/ProductionInstructionsTab'
import { OrderForm } from '../_components/OrderForm'
import { OrderHeaderInput, OrderLineInput } from '@/app/actions/orders'

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
  products: { product_id: string; product_code: string; product_name: string | null } | null
}

export type OrderDetailData = {
  order_id: string
  order_no: string
  company_id: string | null
  quote_id: string | null
  order_date: string | null
  requested_delivery: string | null
  order_type: string | null
  customer_order_no: string | null
  lot_no: string | null
  order_status: string
  notes: string | null
  created_at: string
  companies: {
    company_name: string
    company_code: string
  } | null
  order_lines: (OrderLineDetail & OrderLineInput)[]
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
    case 'production_instructions': return <ProductionInstructionsTab order={order} />
    case 'shipments': return <PlaceholderTab name="出荷履歴" />
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
        開発中
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
          products(product_id, product_code, product_name)
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

  // handleSave is now handled by OrderForm, we just need to refresh when done
  const handleEditSuccess = () => {
    setIsEditing(false)
    fetchOrder()
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
          {error || '受注が見つかりません'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          ID: {orderId}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 relative" style={{ height: '100%', paddingBottom: isEditing ? 0 : 0 }}>
      {!isEditing && <OrderBackButton />}

      {!isEditing && (
        <>
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
        </>
      )}

      {isEditing && (
        <div style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>受注編集</h2>
          <OrderForm 
            isEditing={true}
            initialOrder={{
              header: {
                order_id: order.order_id,
                company_id: order.company_id || '',
                order_no: order.order_no,
                order_date: order.order_date,
                requested_delivery: order.requested_delivery,
                order_type: order.order_type,
                customer_order_no: order.customer_order_no,
                lot_no: order.lot_no,
                notes: order.notes,
                order_status: order.order_status
              },
              lines: order.order_lines.map(l => ({
                line_id: l.line_id,
                order_id: l.order_id,
                product_id: l.product_id,
                delivery_site_id: l.delivery_site_id || null,
                line_no: l.line_no,
                quantity: l.quantity,
                unit: l.unit,
                due_date: l.due_date,
                ship_date: l.ship_date,
                is_free_sample: l.is_free_sample,
                charge_type: l.charge_type,
                packing_style: l.packing_style,
                shipping_notes: l.shipping_notes,
                line_status: l.line_status
              }))
            }}
            onCancel={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
          />
        </div>
      )}
    </div>
  )
}
