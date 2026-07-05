import { createClient } from '@/lib/supabase/server'
import MoldSearchTable from "./_components/MoldSearchTable"
import MoldHeaderActions from "./_components/MoldHeaderActions"

export const revalidate = 0 

export default async function MoldWorkCenterPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParamsResolved = await props.searchParams
  const supabase = await createClient()

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
    supabase.from('physical_molds').select('*', { count: 'exact', head: true }),
    supabase.from('physical_molds').select('*', { count: 'exact', head: true }).eq('usage_status', 'IN_STOCK'),
    supabase.from('physical_molds').select('*', { count: 'exact', head: true }).eq('usage_status', 'SHIPPED'),
    supabase.from('physical_molds').select('*', { count: 'exact', head: true }).eq('usage_status', 'TEFLON'),
    supabase.from('item_types').select('id, name, code').order('name'),
    supabase.from('companies').select('company_id, company_name, company_code').order('company_name').limit(50),
    supabase.from('racks').select('id, code, name').order('code'),
    supabase.from('rack_layers').select('id, rack_id, layer_code, layer_number').order('layer_number'),
    supabase.from('employees').select('employee_id, employee_name, employee_code').order('employee_name'),
    supabase.from('companies').select('company_id, company_name, company_code').order('company_name'),
    supabase.from('companies').select('company_id, company_name, company_code').order('company_name'),
  ])

  const search = typeof searchParamsResolved.search === 'string' ? searchParamsResolved.search : ''
  const typeId = typeof searchParamsResolved.type === 'string' ? searchParamsResolved.type : ''
  const status = typeof searchParamsResolved.status === 'string' ? searchParamsResolved.status : ''
  const customerId = typeof searchParamsResolved.customer === 'string' ? searchParamsResolved.customer : ''
  const rackId = typeof searchParamsResolved.rack === 'string' ? searchParamsResolved.rack : ''
  const teflonStatus = typeof searchParamsResolved.teflon === 'string' ? searchParamsResolved.teflon : ''

  const page = typeof searchParamsResolved.page === 'string' ? parseInt(searchParamsResolved.page) : 1
  const pageSize = 50
  const offset = Math.max(0, (page - 1) * pageSize)

  // 2. Fetch initial table data
  let query = supabase
    .from('physical_molds')
    .select(`
      physical_mold_id, system_code, display_name, usage_status, device_status, updated_at,
      current_rack_layer_id, cav_type_id,
      mold_revisions!inner (
        revision_code,
        products!inner (
          product_name_internal, product_code, company_id
        )
      ),
      cav_types (cav_name),
      rack_layers!current_rack_layer_id (
        layer_code, layer_number, rack_id,
        racks (name)
      )
    `)
    .order('system_code')
    .range(offset, offset + pageSize - 1)

  if (search) {
    query = query.ilike('system_code', `%${search}%`)
  }
  if (typeId) {
    // skip for now since it's cav_type_id
  }
  if (status) {
    query = query.eq('usage_status', status === 'IN' ? 'IN_STOCK' : 'SHIPPED')
  }
  if (customerId) {
    query = query.eq('mold_revisions.products.company_id', customerId)
  }
  if (rackId) {
    const layerIds = (allLayers || []).filter(l => l.rack_id === rackId).map(l => l.id)
    if (layerIds.length > 0) {
      query = query.in('current_rack_layer_id', layerIds)
    } else {
      query = query.eq('current_rack_layer_id', '00000000-0000-0000-0000-000000000000')
    }
  }

  const { data: molds, error } = await query

  const custMap = new Map(customers?.map(c => [c.company_id, c.company_name]) || [])

  const initialMolds = (molds || []).map((m: any) => {
    const revision = m.mold_revisions as any
    const base = revision?.products as any
    const rackLayer = m.rack_layers as any
    
    let custId = base?.company_id

    return {
      id: m.physical_mold_id,
      physical_code: m.system_code,
      mold_name: base?.product_name_internal || '-',
      product_info: '-', // Removed to simplify
      dimensions: '-',
      item_type_name: m.cav_types?.cav_name || '-',
      customer_name: custId ? (custMap.get(custId) || 'Unknown') : '-',
      cavity: 1,
      rack_code: rackLayer?.layer_code || '-',
      rack_label: rackLayer?.layer_number !== undefined && rackLayer?.layer_number !== null ? `Layer ${rackLayer.layer_number}` : '-',
      rack_name: rackLayer?.racks?.name || '-',
      checkin_status: m.usage_status === 'IN_STOCK' ? 'IN' : (m.usage_status === 'SHIPPED' ? 'OUT' : 'TEFLON'),
      teflon_count: 0,
      last_teflon_date: null,
      status: m.device_status,
      updated_at: m.updated_at
    }
  })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-hidden rounded-xl border border-[var(--mcs-border)] shadow-sm bg-[var(--mcs-surface)] flex flex-col">
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
  )
}
