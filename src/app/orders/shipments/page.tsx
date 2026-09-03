import { createClient } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Plus, PackageCheck, FileText, ArrowUpRight } from 'lucide-react'
import { ShipmentFilterBar } from './_components/ShipmentFilterBar'

export const dynamic = 'force-dynamic'

export default async function ShipmentsListPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
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
        order_id,
        order_no,
        company_id,
        companies (
          company_name
        )
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
      query = query.eq('shipment_id', '00000000-0000-0000-0000-000000000000')
      orderQuery = orderQuery.eq('order_id', '00000000-0000-0000-0000-000000000000')
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

  const renderStatusBadge = (st: string | null) => {
    switch (st) {
      case 'DELIVERED':
        return <span className="badge badge--success font-bold text-xs">受領済 ✅</span>
      case 'SHIPPED':
        return <span className="badge badge--info font-bold text-xs">出荷済 🚚</span>
      case 'CANCELLED':
        return <span className="badge badge--error font-bold text-xs">取消 ❌</span>
      case 'PREPARING':
      default:
        return <span className="badge badge--neutral font-bold text-xs text-slate-500">準備中 ⏳</span>
    }
  }

  return (
    <div className="flex flex-col h-full gap-3">
      {/* PageHeader */}
      <div className="shrink-0 flex items-center justify-between p-4 card-flat">
        <div className="flex items-center gap-3">
          <PackageCheck className="w-5 h-5 text-[var(--accent)]" />
          <h1 className="text-lg font-bold text-slate-900">{t('title')}</h1>
        </div>
        <Link href="/orders/shipments/new" className="btn btn-primary flex items-center gap-1.5">
          <Plus size={16} />
          <span>{t('addBtn')}</span>
        </Link>
      </div>

      {/* FilterBar */}
      <ShipmentFilterBar />

      {/* Content Area */}
      <div className="flex-1 overflow-auto card-flat p-0">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th style={{ width: '18%' }}>納品書No</th>
              <th style={{ width: '22%' }}>得意先</th>
              <th style={{ width: '14%' }}>受注No</th>
              <th style={{ width: '12%' }}>出荷日</th>
              <th style={{ width: '12%' }}>出荷方法</th>
              <th style={{ width: '10%', textAlign: 'center' }}>ステータス</th>
              <th style={{ width: '12%', textAlign: 'center' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {(!shipments || shipments.length === 0) ? (
              <tr>
                <td colSpan={7} className="text-center text-slate-500 py-12 font-medium">
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
                      {ship.delivery_note_no || 'DN-未採番'}
                    </Link>
                  </td>
                  <td className="text-slate-900 font-semibold text-[13px]">
                    {ship.orders?.companies?.company_name || '—'}
                  </td>
                  <td>
                    <Link
                      href={`/orders/${ship.orders?.order_id}`}
                      className="text-slate-600 font-mono text-[12px] hover:underline"
                    >
                      {ship.orders?.order_no || '—'}
                    </Link>
                  </td>
                  <td className="text-slate-700 font-mono text-[12px]">
                    {ship.ship_date || '—'}
                  </td>
                  <td className="text-slate-700 text-[12px]">
                    {ship.delivery_method || '自社便・トラック'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {renderStatusBadge(ship.status)}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div className="flex items-center justify-center gap-2">
                      <a
                        href={`/api/shipments/${ship.shipment_id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary text-xs px-2 py-1 h-auto flex items-center gap-1 font-bold text-slate-700 hover:text-teal-700"
                        title="納品書PDFを表示・印刷"
                      >
                        <FileText size={13} color="var(--accent)" />
                        <span>納品書</span>
                      </a>
                      <Link
                        href={`/orders/shipments/${ship.shipment_id}`}
                        className="btn btn-secondary text-xs px-2 py-1 h-auto flex items-center text-slate-500"
                        title="詳細を表示"
                      >
                        <ArrowUpRight size={13} />
                      </Link>
                    </div>
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
