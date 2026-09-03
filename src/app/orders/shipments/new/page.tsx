import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ShipmentForm } from './_components/ShipmentForm'

export const dynamic = 'force-dynamic'

export default async function NewShipmentPage(props: {
  searchParams?: Promise<{ order_id?: string }>
}) {
  const t = await getTranslations('Shipment')
  const supabase = await createClient()
  const sp = await props.searchParams
  const orderId = sp?.order_id

  // Fetch active delivery sites
  const { data: deliverySites } = await supabase
    .from('delivery_sites')
    .select('site_id, site_name')
    .eq('is_active', true)
    .order('site_name')

  let initialOrder: any = null
  let initialLines: any[] = []

  if (orderId) {
    const { data: o } = await supabase
      .from('orders')
      .select('order_id, order_no, companies (company_name)')
      .eq('order_id', orderId)
      .single()

    if (o) {
      initialOrder = o
      const { data: lines } = await supabase
        .from('order_lines')
        .select(`
          line_id, order_id, quantity, shipped_qty, remaining_qty, line_status, unit,
          products (product_code, product_name)
        `)
        .eq('order_id', orderId)
        .order('line_no', { ascending: true })

      if (lines) {
        initialLines = lines
          .filter((l: any) => {
            const rem = l.remaining_qty !== null && l.remaining_qty !== undefined
              ? Number(l.remaining_qty)
              : (Number(l.quantity) - Number(l.shipped_qty || 0))
            return rem > 0 && l.line_status !== 'SHIPPED'
          })
          .map((l: any) => ({
            line_id: l.line_id,
            order_id: l.order_id,
            order_no: o.order_no,
            customer_name: (o as any)?.companies?.company_name || '',
            quantity: Number(l.quantity),
            shipped_qty: Number(l.shipped_qty || 0),
            remaining_qty: l.remaining_qty !== null && l.remaining_qty !== undefined
              ? Number(l.remaining_qty)
              : (Number(l.quantity) - Number(l.shipped_qty || 0)),
            unit: l.unit || 'pcs',
            product_code: l.products?.product_code || '',
            product_name: l.products?.product_name || l.products?.product_code || ''
          }))
      }
    }
  }

  return (
    <div className="flex flex-col h-full gap-3 max-w-3xl mx-auto w-full">
      {/* PageHeader Compact */}
      <div className="shrink-0 flex items-center gap-4 p-3 card-flat">
        <Link href="/orders/shipments" className="btn btn-secondary shrink-0">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('backToList')}
        </Link>
        <h1 className="text-lg font-bold text-slate-900">{t('newTitle')}</h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto card-flat p-6">
        <ShipmentForm
          deliverySites={deliverySites || []}
          initialOrder={initialOrder}
          initialLines={initialLines}
        />
      </div>
    </div>
  )
}
