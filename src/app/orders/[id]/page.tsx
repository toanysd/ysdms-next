import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft, ArrowUpFromLine, Truck } from 'lucide-react'
import { BackButton } from './_components/BackButton'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { OrderHeaderForm } from './_components/OrderHeaderForm'
import { OrderLineForm } from './_components/OrderLineForm'
import { WorkOrderLinker } from './_components/WorkOrderLinker'

export default async function OrderDetailPage(props: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ tab?: string }>
}) {
  const tMaster = await getTranslations('Master')
  const { id } = await props.params
  const sp = await props.searchParams
  const activeTab = sp?.tab || 'lines'

  const supabase = await createClient()

  // 1. Fetch Order + Companies
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, companies(company_id, company_name, company_code)')
    .eq('order_id', id)
    .single()

  if (error || !order) notFound()

  // 2. Fetch Order Lines
  const { data: orderLines } = await supabase
    .from('order_lines')
    .select('*, products(product_id, product_code, product_name)')
    .eq('order_id', id)
    .order('line_no', { ascending: true })

  // 3. Fetch Work Orders for Linker
  let linkedWOs: any[] = []
  let suggestedWOs: any[] = []

  if (activeTab === 'work_orders') {
    // Linked
    const { data: linked } = await supabase
      .from('work_orders')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: false })
    linkedWOs = linked || []

    // Suggested
    const productIds = (orderLines || []).map(l => l.product_id).filter(Boolean)
    if (productIds.length > 0) {
      const { data: suggested } = await supabase
        .from('work_orders')
        .select('*')
        .is('order_id', null)
        .in('product_id', productIds)
        .order('created_at', { ascending: false })
      suggestedWOs = suggested || []
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      
      {/* ── PageHeader ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton />
          <Link href="/orders" style={{ color: 'var(--text-muted)' }}>
            <ArrowUpFromLine size={18} />
          </Link>
          <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>{order.order_no}</h1>
              <span className="badge badge--info font-mono">{order.companies?.company_name}</span>
            </div>
          </div>
        </div>

        {/* Nút phát hành 納品書 */}
        {order.order_status !== 'CANCELLED' && (
          <Link href={`/orders/shipments/new?order_id=${order.order_id}`}>
            <button className="btn btn-primary flex items-center gap-1.5 text-xs px-3 py-1.5 h-auto cursor-pointer">
              <Truck size={14} />
              <span>納品書を発行する</span>
            </button>
          </Link>
        )}
      </div>

      {/* ── Order Header Form ── */}
      <OrderHeaderForm order={order} companies={[]} />

      {/* ── FilterBar / TabBar ── */}
      <div className="form-section" style={{ flexShrink: 0, marginBottom: 0 }}>
        <div className="form-section-body">
          <div className="tab-nav" style={{ margin: '-14px -14px -14px', background: 'var(--bg-surface)' }}>
            <Link 
              href={`/orders/${id}?tab=lines`}
              className={`tab-item ${activeTab === 'lines' ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span style={{ fontWeight: 700 }}>Chi tiết Đơn</span>
            </Link>
            <Link 
              href={`/orders/${id}?tab=work_orders`}
              className={`tab-item ${activeTab === 'work_orders' ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span style={{ fontWeight: 700 }}>Lệnh sản xuất</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {activeTab === 'lines' && (
          <OrderLineForm orderId={id} initialLines={orderLines || []} orderStatus={order.order_status || 'DRAFT'} />
        )}
        
        {activeTab === 'work_orders' && (
          <WorkOrderLinker orderId={id} linkedWorkOrders={linkedWOs} suggestedWorkOrders={suggestedWOs} />
        )}
      </div>

    </div>
  )
}
