'use server'

import { createClient } from '@/lib/supabase/server'

export interface MrpResult {
  plastic_id: string
  plastic_code: string
  plastic_color: string | null
  plastic_thickness: number
  total_demand_meters: number
  current_stock_meters: number
  shortage_meters: number
  order_count: number
  demand_details: {
    order_slip_no: string
    product_code: string
    qty_needed: number
    plastic_demand_meters: number
  }[]
}

export async function calculateMRP(): Promise<MrpResult[]> {
  const supabase = await createClient()

  // 1. Fetch incomplete order items with nested product -> mold -> bom -> plastic
  const { data: orderItems, error } = (await (supabase as any)
    // @ts-ignore
    .from('order_items')
    .select(`
      id, quantity, product_id, product_pn_raw, status,
      orders ( slip_no ),
      production_plans ( material_feed_length_mm ),
      product_master (
        product_mold_map (
          mold_design_revision (
            mold_plastic_bom (
              actual_weight_grams,
              scrap_ratio,
              plastic_master ( id, code, color, thickness_mm )
            ),
            mold_physical ( cavity )
          )
        )
      )
    `)
    .in('status', ['DRAFT', 'SCHEDULED', 'IN_PROGRESS'])) as any

  if (error || !orderItems) {
    console.error('MRP Error:', error)
    throw new Error('Failed to fetch order data for MRP')
  }

  // 2. Fetch current plastic inventory
  // @ts-ignore
  const { data: stockData } = await supabase.from('plastic_stock').select('plastic_id, current_meters')
  const stockMap: Record<string, number> = {}
  stockData?.forEach(s => {
    // @ts-ignore
    stockMap[s.plastic_id] = s.current_meters || 0
  })

  // @ts-ignore
  const { data: plastics } = await supabase.from('plastic_master').select('id, code, color, thickness_mm')
  
  const mrpMap: Record<string, MrpResult> = {}
  
  plastics?.forEach(p => {
    // @ts-ignore
    mrpMap[p.id] = {
      // @ts-ignore
      plastic_id: p.id,
      // @ts-ignore
      plastic_code: p.code,
      // @ts-ignore
      plastic_color: p.color,
      // @ts-ignore
      plastic_thickness: p.thickness_mm,
      total_demand_meters: 0,
      // @ts-ignore
      current_stock_meters: stockMap[p.id] || 0,
      shortage_meters: 0,
      order_count: 0,
      demand_details: []
    }
  })

  // 3. Aggregate Demand
  orderItems.forEach((item: any) => {
    // @ts-ignore
    const product = item.product_master as any
    if (!product) return

    const maps = product.product_mold_map
    if (!maps || maps.length === 0) return

    // Assuming 1 product maps to 1 active revision for simplicity
    const map = maps[0]
    const revision = map.mold_design_revision
    if (!revision) return

    const boms = revision.mold_plastic_bom
    if (!boms || boms.length === 0) return

    const bom = boms[0]
    const plastic = Array.isArray(bom.plastic_master) ? bom.plastic_master[0] : bom.plastic_master
    if (!plastic) return

    // Fetch feed length from plans if any
    // @ts-ignore
    const plans = item.production_plans
    let feedLength = 0
    if (Array.isArray(plans) && plans.length > 0) {
      feedLength = plans[0].material_feed_length_mm || 0
    } else if (plans && !Array.isArray(plans)) {
      feedLength = (plans as any).material_feed_length_mm || 0
    }

    const phys = Array.isArray(revision.mold_physical) ? revision.mold_physical[0] : revision.mold_physical
    const cavity = phys?.cavity || 1
    // @ts-ignore
    const shotsNeeded = Math.ceil(item.quantity / cavity)
    
    // Formula: Demand in Meters = (material_feed_length_mm / 1000) * shotsNeeded
    const demandMeters = (feedLength / 1000) * shotsNeeded

    if (mrpMap[plastic.id]) {
      mrpMap[plastic.id].total_demand_meters += demandMeters
      mrpMap[plastic.id].order_count += 1
      // @ts-ignore
      const orderData = item.orders as any
      mrpMap[plastic.id].demand_details.push({
        order_slip_no: orderData?.slip_no || 'N/A',
        // @ts-ignore
        product_code: item.product_pn_raw || 'Unknown',
        // @ts-ignore
        qty_needed: item.quantity,
        plastic_demand_meters: demandMeters
      })
    }
  })

  // 4. Calculate Shortage
  const results = Object.values(mrpMap).map(res => {
    res.shortage_meters = Math.max(0, res.total_demand_meters - res.current_stock_meters)
    return res
  })

  // Filter out plastics with no demand
  return results.filter(r => r.total_demand_meters > 0).sort((a, b) => b.shortage_meters - a.shortage_meters)
}
