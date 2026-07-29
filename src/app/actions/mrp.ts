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

  // 1. Fetch incomplete order lines with nested product -> design_revisions
  const { data: orderLines, error: linesError } = await supabase
    .from('order_lines')
    .select(`
      line_id,
      quantity,
      due_date,
      order_id,
      product_id,
      design_revision_id,
      orders!inner(order_no, order_status),
      products!inner(
        product_code,
        design_revisions(
          revision_id,
          plastic_id,
          cavity_count,
          machine_feed_pitch_mm,
          cutline_length
        )
      )
    `)
    .in('orders.order_status', ['NEW', 'CONFIRMED', 'IN_PRODUCTION'])

  if (linesError || !orderLines) {
    console.error('MRP Error fetching order lines:', linesError)
    throw new Error('Failed to fetch order data for MRP')
  }

  // 2. Fetch current plastic inventory (plastic_receipt_roll)
  const { data: stockData, error: stockError } = await supabase
    .from('plastic_receipt_roll')
    .select('plastic_id, current_length_m')
    .gt('current_length_m', 0)

  if (stockError) {
    console.error('MRP Error fetching plastic stock:', stockError)
  }

  const stockMap: Record<string, number> = {}
  stockData?.forEach(s => {
    if (s.plastic_id) {
      stockMap[s.plastic_id] = (stockMap[s.plastic_id] || 0) + (s.current_length_m || 0)
    }
  })

  // 3. Fetch all plastics
  const { data: plastics, error: plasticsError } = await supabase
    .from('plastic_master')
    .select('plastic_id, plastic_code, color_name_normalized, thickness_mm')

  if (plasticsError || !plastics) {
    console.error('MRP Error fetching plastics:', plasticsError)
    throw new Error('Failed to fetch plastics master data for MRP')
  }

  const mrpMap: Record<string, MrpResult> = {}
  
  plastics.forEach(p => {
    mrpMap[p.plastic_id] = {
      plastic_id: p.plastic_id,
      plastic_code: p.plastic_code,
      plastic_color: p.color_name_normalized || '',
      plastic_thickness: Number(p.thickness_mm || 0),
      total_demand_meters: 0,
      current_stock_meters: stockMap[p.plastic_id] || 0,
      shortage_meters: 0,
      order_count: 0,
      demand_details: []
    }
  })

  // 4. Aggregate Demand
  orderLines.forEach((line: any) => {
    const product = line.products
    if (!product) return

    // Find the revision
    let revision: any = null
    if (line.design_revision_id) {
      revision = product.design_revisions?.find((r: any) => r.revision_id === line.design_revision_id)
    }
    // Fallback to the first revision if none selected or not found
    if (!revision && product.design_revisions && product.design_revisions.length > 0) {
      revision = product.design_revisions[0]
    }
    if (!revision || !revision.plastic_id) return

    const plasticId = revision.plastic_id
    if (!mrpMap[plasticId]) return

    const cavity = revision.cavity_count || 1
    const pitch = Number(revision.machine_feed_pitch_mm || revision.cutline_length || 0)
    const shotsNeeded = Math.ceil(line.quantity / cavity)
    
    // Formula: Demand in Meters = (pitch_mm / 1000) * shotsNeeded * 1.05 (Hao hụt 5%)
    const demandMeters = (pitch / 1000) * shotsNeeded * 1.05

    mrpMap[plasticId].total_demand_meters += demandMeters
    mrpMap[plasticId].order_count += 1
    
    const orderData = line.orders as any
    mrpMap[plasticId].demand_details.push({
      order_slip_no: orderData?.order_no || 'N/A',
      product_code: product.product_code || 'Unknown',
      qty_needed: line.quantity,
      plastic_demand_meters: demandMeters
    })
  })

  // 5. Calculate Shortage
  const results = Object.values(mrpMap).map(res => {
    res.shortage_meters = Math.max(0, res.total_demand_meters - res.current_stock_meters)
    return res
  })

  // Filter out plastics with no demand
  return results.filter(r => r.total_demand_meters > 0).sort((a, b) => b.shortage_meters - a.shortage_meters)
}
