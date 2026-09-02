import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Plus, PackageCheck } from 'lucide-react'
import { ShipmentFilterBar } from './_components/ShipmentFilterBar'

export const dynamic = 'force-dynamic'

export default async function ShipmentsListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const t = await getTranslations('Shipment')
  const supabase = await createClient()

  const orderNo = typeof searchParams.order_no === 'string' ? searchParams.order_no : ''
  const customer = typeof searchParams.customer === 'string' ? searchParams.customer : ''
  const fromDate = typeof searchParams.from_date === 'string' ? searchParams.from_date : ''
  const toDate = typeof searchParams.to_date === 'string' ? searchParams.to_date : ''
  const status = typeof searchParams.status === 'string' ? searchParams.status : ''

  // Build query
  let query = supabase
    .from('shipments')
    .select(`
      shipment_id,
      delivery_note_no,
      ship_date,
      delivery_method,
      status,
      orders (
        order_no,
        company_id,
        companies (
          company_name
        )
      ),
      order_lines (
        quantity,
        product_id
      ),
      delivery_sites (
        site_name
      )
    `)
    .order('ship_date', { ascending: false })

  if (orderNo || customer) {
    let companyIds: string[] = []
    
    // Step 0: Pre-query companies if customer filter exists
    if (customer) {
      const { data: cos } = await supabase
        .from('companies')
        .select('company_id')
        .ilike('company_name', `%${customer}%`)
        .limit(100)
      companyIds = cos?.map((c: any) => c.company_id) ?? []
    }

    // Step 1: Pre-query orders
    let orderQuery = supabase.from('orders').select('order_id')
    if (orderNo) orderQuery = orderQuery.ilike('order_no', `%${orderNo}%`)
    
    if (customer && companyIds.length > 0) {
      orderQuery = orderQuery.in('company_id', companyIds)
    } else if (customer && companyIds.length === 0) {
      // Force empty if no companies matched
      query = query.eq('shipment_id', '00000000-0000-0000-0000-000000000000')
      orderQuery = orderQuery.eq('order_id', '00000000-0000-0000-0000-000000000000') // prevents fetching all orders
    }
    
    // Step 2: Fetch matched orders and filter shipments
    if (!(customer && companyIds.length === 0)) {
      const { data: matchedOrders } = await orderQuery.limit(200)
      
      if (matchedOrders && matchedOrders.length > 0) {
        const orderIds = matchedOrders.map((o: any) => o.order_id)
        query = query.in('order_id', orderIds)
      } else {
        query = query.eq('shipment_id', '00000000-0000-0000-0000-000000000000')
      }
    }
  }

  if (fromDate) query = query.gte('ship_date', fromDate)
  if (toDate) query = query.lte('ship_date', toDate)
  if (status) query = query.eq('status', status)

  const { data: shipments, error } = await query.limit(50)

  if (error) {
    console.error('Error fetching shipments:', error)
  }

  return (
    <div className="flex flex-col h-full gap-3">
      {/* PageHeader (Rule 2) */}
      <div className="shrink-0 flex items-center justify-between p-4 card-flat">
        <div className="flex items-center gap-3">
          <PackageCheck className="w-5 h-5 text-[var(--accent)]" />
          <h1 className="text-lg font-bold text-slate-900">{t('title')}</h1>
        </div>
        <Link href="/orders/shipments/new" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          {t('addBtn')}
        </Link>
      </div>

      {/* FilterBar (Rule 2) */}
      <ShipmentFilterBar />

      {/* Content Area */}
      <div className="flex-1 overflow-auto card-flat">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th className="text-left">{t('colDeliveryNote')}</th>
              <th className="text-left">{t('colCustomer')}</th>
              <th className="text-left">{t('colOrderNo')}</th>
              <th className="text-left">{t('colDate')}</th>
              <th className="text-left">{t('colSite')}</th>
              <th className="text-left">{t('colMethod')}</th>
              <th className="text-center">{t('colStatus')}</th>
            </tr>
          </thead>
          <tbody>
            {(!shipments || shipments.length === 0) ? (
              <tr>
                <td colSpan={7} className="text-center text-slate-500 py-8">
                  {t('emptyText')}
                </td>
              </tr>
            ) : (
              shipments.map((ship: any) => (
                <tr key={ship.shipment_id}>
                  <td>
                    <Link 
                      href={`/orders/shipments/${ship.shipment_id}`}
                      className="text-[var(--accent)] font-bold font-mono text-[13px] hover:underline"
                    >
                      {ship.delivery_note_no || '—'}
                    </Link>
                  </td>
                  <td className="text-slate-900 font-medium text-[13px]">
                    {ship.orders?.companies?.company_name || '—'}
                  </td>
                  <td className="text-slate-600 font-mono text-[13px]">
                    {ship.orders?.order_no || '—'}
                  </td>
                  <td className="text-slate-600 text-[13px]">
                    {ship.ship_date ? new Date(ship.ship_date).toLocaleDateString('ja-JP') : '—'}
                  </td>
                  <td className="text-slate-600 text-[13px]">
                    {ship.delivery_sites?.site_name || '—'}
                  </td>
                  <td className="text-slate-600 text-[13px]">
                    {ship.delivery_method || '—'}
                  </td>
                  <td className="text-center">
                    {ship.status === 'SHIPPED' ? (
                      <span className="badge badge--success">{t('badgeShipped')}</span>
                    ) : (
                      <span className="badge badge--warning">{t('badgePending')}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
