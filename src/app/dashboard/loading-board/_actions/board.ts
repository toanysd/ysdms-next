'use server'

import { createClient } from '@/lib/supabase/server'
import { MachineInstance, PendingOrder, ProductionPlan, MoldPhysical } from '@/types/loading-board'
import { revalidatePath } from 'next/cache'

export async function getLoadingBoardData(startDate: string, endDate: string) {
  const supabase = await createClient()

  // 1. Fetch Machines
  const { data: machinesData, error: mErr } = await supabase
    .from('machine_instance')
    .select('id, internal_code, name, status')
    .order('internal_code')

  if (mErr) console.error(mErr)

  // 2. Fetch Pending Orders (Order items that are NOT in production_plans yet, or quantity < ordered)
  // For simplicity, we just fetch items that don't have a plan. 
  // We can do this by fetching all order items and filtering, or using a view.
  // We'll fetch order items where status is draft/confirmed/sent (from orders).
  // Note: This query might need optimization for production.
  const { data: itemsData, error: iErr } = await supabase
    .from('order_items')
    .select(`
      id, quantity, product_pn_raw,
      orders!inner(slip_no, delivery_date, status),
      production_plans(id)
    `)
    .in('orders.status', ['draft', 'confirmed', 'sent', 'in_production'])

  if (iErr) console.error(iErr)

  const pendingOrders: PendingOrder[] = []
  
  if (itemsData) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (const item of itemsData as any) {
      if (item.production_plans && item.production_plans.length > 0) continue // Skip if already planned

      let urgency: PendingOrder['urgency'] = 'UNKNOWN'
      let dDate = item.orders.delivery_date

      if (dDate) {
        const delivery = new Date(dDate)
        const diffTime = delivery.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays <= 2) urgency = 'CRITICAL'
        else if (diffDays <= 5) urgency = 'WARNING'
        else urgency = 'NORMAL'
      }

      pendingOrders.push({
        order_item_id: item.id,
        slip_no: item.orders.slip_no,
        product_pn_raw: item.product_pn_raw,
        quantity: item.quantity,
        delivery_date: dDate,
        urgency
      })
    }
  }

  // 3. Fetch Plans in the date range
  const { data: plansData, error: pErr } = await supabase
    .from('production_plans')
    .select(`
      id, order_item_id, machine_instance_id, mold_physical_id, 
      planned_date, shift, planned_quantity, estimated_shots, operator_name, status,
      order_items(product_pn_raw, orders(slip_no))
    `)
    .gte('planned_date', startDate)
    .lte('planned_date', endDate)

  if (pErr) console.error(pErr)

  const productionPlans: ProductionPlan[] = (plansData || []).map((p: any) => ({
    id: p.id,
    order_item_id: p.order_item_id,
    machine_instance_id: p.machine_instance_id,
    mold_physical_id: p.mold_physical_id,
    planned_date: p.planned_date,
    shift: p.shift,
    planned_quantity: p.planned_quantity,
    estimated_shots: p.estimated_shots,
    operator_name: p.operator_name,
    status: p.status,
    slip_no: p.order_items?.orders?.slip_no,
    product_pn_raw: p.order_items?.product_pn_raw
  }))

  return {
    machines: (machinesData || []) as MachineInstance[],
    pendingOrders: pendingOrders.sort((a, b) => {
      // Sort CRITICAL first, then WARNING, then NORMAL
      const uMap = { CRITICAL: 0, WARNING: 1, NORMAL: 2, UNKNOWN: 3 }
      return uMap[a.urgency] - uMap[b.urgency]
    }),
    productionPlans
  }
}

export async function getCompatibleMolds(machineId: string, orderItemId: string) {
  const supabase = await createClient()
  
  // Actually, we need to join machine_tray_compatibility -> product_master -> product_mold_map -> mold_design_revision -> mold_physical
  // Or simply fetch all mold_physical for now and we will implement rigorous filtering later.
  const { data } = await supabase
    .from('mold_physical')
    .select('id, physical_code, cavity')
    .eq('status', 'ACTIVE')

  return (data || []) as MoldPhysical[]
}

export async function createProductionPlan(payload: {
  order_item_id: string
  machine_instance_id: string
  mold_physical_id: string | null
  planned_date: string
  shift: 'DAY' | 'NIGHT'
  planned_quantity: number
  estimated_shots: number
  operator_name: string | null
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('production_plans')
    .insert([{
      ...payload,
      status: 'SCHEDULED'
    }])
    .select()

  if (error) {
    console.error('Insert plan error:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/loading-board')
  return { success: true, data }
}
