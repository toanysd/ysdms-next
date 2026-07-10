'use server'

import { createClient } from '@/lib/supabase/server'
import { startOfDay, addDays, format, isBefore, isEqual } from 'date-fns'

export type MRPTimelineCell = {
  date: string;
  demand_m: number;
  supply_m: number;
  projected_stock_m: number;
}

export type MRPPlasticRow = {
  plastic_id: string;
  plastic_code: string;
  plastic_family: string;
  color: string;
  branch_id: string;
  branch_code: string;
  current_stock_m: number;
  timeline: MRPTimelineCell[];
}

export async function getMRPTimelineData(days: number = 30): Promise<MRPPlasticRow[]> {
  const supabase = await createClient()

  // 1. Fetch Master Plastics
  const { data: plastics } = await supabase
    .from('plastic_master')
    .select('plastic_id, plastic_code, plastic_family, color_name_normalized')
    
  // 2. Fetch Current Stock from plastic_receipt_roll (Grouped by branch and plastic_id)
  const { data: rolls } = await supabase
    .from('plastic_receipt_roll')
    .select('plastic_id, branch_id, current_length_m, companies!plastic_receipt_roll_branch_id_fkey(company_code)')
    .gt('current_length_m', 0)

  // 3. Fetch Pending Order Lines to calculate Demand
  const startDateStr = format(new Date(), 'yyyy-MM-dd')
  const endDateStr = format(addDays(new Date(), days), 'yyyy-MM-dd')

  const { data: orderLines } = await supabase
    .from('order_lines')
    .select(`
      due_date,
      quantity,
      orders!inner(order_status, company_id),
      products!inner(
        product_id,
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
    .gte('due_date', startDateStr)
    .lte('due_date', endDateStr)

  // -- Aggregation Logic --
  // A map to hold the MRP data: Map<plasticId_branchId, MRPPlasticRow>
  const mrpMap = new Map<string, MRPPlasticRow>()

  // Initialize with Stock Data
  if (rolls && plastics) {
    rolls.forEach((roll: any) => {
      if (!roll.plastic_id || !roll.branch_id) return
      const key = `${roll.plastic_id}_${roll.branch_id}`
      const plasticInfo = plastics.find((p: any) => p.plastic_id === roll.plastic_id)
      
      if (!mrpMap.has(key)) {
        // Initialize timeline array
        const timeline: MRPTimelineCell[] = []
        for (let i = 0; i < days; i++) {
          const tDate = format(addDays(new Date(), i), 'yyyy-MM-dd')
          timeline.push({
            date: tDate,
            demand_m: 0,
            supply_m: 0,
            projected_stock_m: 0
          })
        }

        mrpMap.set(key, {
          plastic_id: roll.plastic_id,
          plastic_code: plasticInfo?.plastic_code || 'N/A',
          plastic_family: plasticInfo?.plastic_family || '',
          color: plasticInfo?.color_name_normalized || '',
          branch_id: roll.branch_id,
          branch_code: (roll.companies as any)?.company_code || 'UNKNOWN',
          current_stock_m: 0,
          timeline
        })
      }
      
      const row = mrpMap.get(key)!
      row.current_stock_m += Number(roll.current_length_m || 0)
    })
  }

  // Add Demand to Timeline
  if (orderLines) {
    orderLines.forEach((line: any) => {
      // Find active revision for the product
      const revisions = line.products?.design_revisions
      if (!revisions || !Array.isArray(revisions) || revisions.length === 0) return
      
      // Get the latest revision (assuming the first or we'd need to sort by created_at)
      const rev = revisions[0]
      if (!rev.plastic_id) return

      // Assume branch_id is the company_id of the order (Internal branches like HONSHA, MARUDAI)
      // If it's a customer order, demand is placed on the main factory? 
      // For now, let's map all demand to 'MARUDAI' if it's external, or match if internal.
      // We will fallback to MARUDAI if we don't have a specific branch.
      // (This logic can be refined later based on production site allocation)
      const targetBranchId = line.orders?.company_id 

      let key = `${rev.plastic_id}_${targetBranchId}`
      
      // If the map doesn't have this key, we might need to initialize it with 0 stock
      if (!mrpMap.has(key)) {
        // Try finding any row with this plastic to copy metadata, or just skip/create empty
        const plasticInfo = plastics?.find((p: any) => p.plastic_id === rev.plastic_id)
        if (!plasticInfo) return
        
        const timeline: MRPTimelineCell[] = []
        for (let i = 0; i < days; i++) {
          const tDate = format(addDays(new Date(), i), 'yyyy-MM-dd')
          timeline.push({ date: tDate, demand_m: 0, supply_m: 0, projected_stock_m: 0 })
        }
        
        mrpMap.set(key, {
          plastic_id: rev.plastic_id,
          plastic_code: plasticInfo.plastic_code || 'N/A',
          plastic_family: plasticInfo.plastic_family || '',
          color: plasticInfo.color_name_normalized || '',
          branch_id: targetBranchId as string,
          branch_code: 'ASSIGNED', // Need to fetch branch code
          current_stock_m: 0,
          timeline
        })
      }

      const row = mrpMap.get(key)!
      const tCell = row.timeline.find(t => t.date === line.due_date)
      if (tCell) {
        // Calculate meters needed
        const cavCount = rev.cavity_count || 1
        const pitch = Number(rev.machine_feed_pitch_mm || rev.cutline_length || 0)
        // meter = (Qty / Cavity) * Pitch * 1.05 (Hao hụt 5%) / 1000
        const meterReq = (Number(line.quantity) / cavCount) * pitch * 1.05 / 1000
        tCell.demand_m += meterReq
      }
    })
  }

  // Calculate Projected Stock
  const results = Array.from(mrpMap.values())
  results.forEach(row => {
    let runningStock = row.current_stock_m
    row.timeline.forEach(t => {
      runningStock = runningStock - t.demand_m + t.supply_m
      t.projected_stock_m = runningStock
    })
  })

  // Sort by plastic code
  results.sort((a, b) => a.plastic_code.localeCompare(b.plastic_code))

  return results
}
