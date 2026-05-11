import { createClient } from '@/lib/supabase/server'
import MoldSearchTable from "./_components/MoldSearchTable"
import MoldHeaderActions from "./_components/MoldHeaderActions"

// Cache this page for faster navigation, but revalidate every 5 minutes 
// (or rely on real-time / client side invalidation if needed later)
export const revalidate = 0 

export default async function MoldWorkCenterPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParamsResolved = await props.searchParams
  const supabase = await createClient()

  // 1. Fetch KPIs in parallel
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0]

  const [
    { count: cntTotal },
    { count: cntIn },
    { count: cntOut },
    { count: cntTeflon },
    { data: itemTypes },
    { data: customers },
    { data: racks },
    { data: allLayers },
    { data: employees },
    { data: destinations },
    { data: companies }
  ] = await Promise.all([
    supabase.from('mold_physical').select('*', { count: 'exact', head: true }),
    supabase.from('mold_physical').select('*', { count: 'exact', head: true }).eq('checkin_status', 'IN'),
    supabase.from('mold_physical').select('*', { count: 'exact', head: true }).eq('checkin_status', 'OUT'),
    supabase.from('mold_physical').select('*', { count: 'exact', head: true })
      .gt('teflon_count', 0)
      .gte('last_teflon_date', thirtyDaysAgoStr),
    supabase.from('item_types').select('id, name, code').order('name'),
    supabase.from('customers').select('id, customer_name_jp, customer_code').order('customer_name_jp').limit(50),
    supabase.from('racks').select('id, code, name').order('code'),
    supabase.from('rack_layers').select('id, rack_id, code, label, layer_index').order('layer_index'),
    supabase.from('employees').select('id, name, employee_code').order('name'),
    supabase.from('destinations').select('id, name, code').order('name'),
    supabase.from('companies').select('id, name, code').order('name'),
  ])

  // Parse search params for initial load
  const search = typeof searchParamsResolved.search === 'string' ? searchParamsResolved.search : ''
  const typeId = typeof searchParamsResolved.type === 'string' ? searchParamsResolved.type : ''
  const status = typeof searchParamsResolved.status === 'string' ? searchParamsResolved.status : ''
  const customerId = typeof searchParamsResolved.customer === 'string' ? searchParamsResolved.customer : ''
  const page = typeof searchParamsResolved.page === 'string' ? parseInt(searchParamsResolved.page) : 1
  const pageSize = 50
  const offset = Math.max(0, (page - 1) * pageSize)

  // 2. Fetch initial table data
  let query = supabase
    .from('mold_physical')
    .select(`
      id, physical_code, cavity, checkin_status, teflon_count, last_teflon_date, status,
      item_type_id,
      mold_design_revision!inner (
        revision_code,
        mold_base!inner (
          name, code, customer_id
        )
      ),
      item_types (name),
      rack_layers (
        code, label,
        racks (name)
      )
    `)
    // Customers join is tricky through nested inner joins in PostgREST, 
    // so we will resolve customer_name on client or via a separate mapping,
    // but we can query it directly if we have the view. For now, let's fetch base fields.
    .order('physical_code')
    .range(offset, offset + pageSize - 1)

  if (search) {
    // Basic ilike on physical_code (Note: PostgREST doesn't support complex OR across nested tables easily via query params, 
    // we would need a view or RPC for full cross-table search. For now, search physical_code)
    query = query.ilike('physical_code', `%${search}%`)
  }
  if (typeId) {
    query = query.eq('item_type_id', typeId)
  }
  if (status) {
    query = query.eq('checkin_status', status)
  }
  if (customerId) {
    query = query.eq('mold_design_revision.mold_base.customer_id', customerId)
  }

  const { data: molds, error } = await query

  // We need to map customer names separately since it's hard to join 3 levels deep with PostgREST
  const custMap = new Map(customers?.map(c => [c.id, c.customer_name_jp]) || [])

  // Format the data for the client component
  const initialMolds = (molds || []).map(m => {
    const base = Array.isArray(m.mold_design_revision) ? m.mold_design_revision[0]?.mold_base : m.mold_design_revision?.mold_base
    const rackLayer = Array.isArray(m.rack_layers) ? m.rack_layers[0] : m.rack_layers
    const itemType = Array.isArray(m.item_types) ? m.item_types[0] : m.item_types
    
    // Safely extract customer ID
    let custId = null
    if (base && typeof base === 'object' && !Array.isArray(base) && 'customer_id' in base) {
        custId = base.customer_id
    }

    return {
      id: m.id,
      physical_code: m.physical_code,
      mold_name: base?.name || '-',
      item_type_name: itemType?.name || '-',
      customer_name: custId ? (custMap.get(custId) || 'Unknown') : '-',
      cavity: m.cavity || 1,
      rack_code: rackLayer?.code || '-',
      rack_label: rackLayer?.label || '-',
      rack_name: rackLayer?.racks?.name || '-',
      checkin_status: m.checkin_status || 'IN',
      teflon_count: m.teflon_count || 0,
      last_teflon_date: m.last_teflon_date,
      status: m.status
    }
  })

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-[#01696f] text-white shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">金型管理センター</h1>
            <p className="text-xs text-teal-100">Trung Tâm Quản Lý Khuôn</p>
          </div>
          <MoldHeaderActions />
        </div>
      </div>

      {/* KPI ROW */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow-sm border border-slate-200 flex flex-col justify-center">
          <div className="text-xs text-slate-500 font-bold mb-1">総金型数 (Tổng khuôn)</div>
          <div className="text-2xl font-black text-slate-800">{cntTotal?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm border border-teal-200 bg-teal-50/30 flex flex-col justify-center">
          <div className="text-xs text-teal-600 font-bold mb-1">庫内 IN (Trong kho)</div>
          <div className="text-2xl font-black text-teal-700">{cntIn?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm border border-orange-200 bg-orange-50/30 flex flex-col justify-center">
          <div className="text-xs text-orange-600 font-bold mb-1">庫外 OUT (Ngoài kho)</div>
          <div className="text-2xl font-black text-orange-700">{cntOut?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-white p-4 rounded shadow-sm border border-purple-200 bg-purple-50/30 flex flex-col justify-center">
          <div className="text-xs text-purple-600 font-bold mb-1">テフロン中 (Đang mạ Teflon)</div>
          <div className="text-2xl font-black text-purple-700">{cntTeflon?.toLocaleString() || 0}</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 px-4 pb-4">
        <div className="bg-white rounded shadow-sm border border-slate-200 h-full flex flex-col overflow-hidden">
          <MoldSearchTable 
            initialData={initialMolds} 
            itemTypes={itemTypes || []}
            customers={customers || []}
            initialParams={{ search, typeId, status, customerId }}
            racks={racks || []}
            allLayers={allLayers || []}
            employees={employees || []}
            destinations={destinations || []}
            companies={companies || []}
          />
        </div>
      </div>
    </div>
  )
}
