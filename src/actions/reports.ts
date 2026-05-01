'use server'

import { createClient } from '@/lib/supabase/server'
import { MonthlyRow, DailyRow, MoldPerfRow } from '@/types/dashboard'

export async function getMonthlySummary(): Promise<MonthlyRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('v_monthly_summary')
    .select('*')
    .order('month_start')

  if (error) {
    console.error('Error fetching monthly summary:', error)
    return []
  }

  // Parse strings to numbers if needed based on the contract
  return (data || []).map((row: any) => ({
    ...row,
    avg_qty_per_day: parseFloat(row.avg_qty_per_day || '0'),
    mold_map_rate_pct: parseFloat(row.mold_map_rate_pct || '0'),
  })) as MonthlyRow[]
}

export async function getDailyProductionTrend(): Promise<DailyRow[]> {
  const supabase = await createClient()
  
  // For a 30-day trend, we fetch the last 30 distinct days, or just fetch all and aggregate on the frontend
  const { data, error } = await supabase
    .from('v_daily_production')
    .select('order_date, total_qty')
    .order('order_date', { ascending: false })
    .limit(30)

  if (error) {
    console.error('Error fetching daily production:', error)
    return []
  }

  // We group by order_date and sum total_qty since the view might return multiple rows per date (if by mold)
  const grouped = (data || []).reduce((acc: any, curr: any) => {
    if (!acc[curr.order_date]) {
      acc[curr.order_date] = 0
    }
    acc[curr.order_date] += Number(curr.total_qty || 0)
    return acc
  }, {})

  const trendData = Object.keys(grouped).map(date => ({
    order_date: date,
    total_qty: grouped[date],
    mold_code: '',
    product_code: null,
    product_pn_raw: '',
    item_count: 0,
    has_trial_shot: false,
    trial_shot_count: 0
  }))

  return trendData.sort((a, b) => a.order_date.localeCompare(b.order_date)) as DailyRow[]
}

export async function getMoldPerformanceTop10(): Promise<MoldPerfRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('v_mold_performance')
    .select('*')
    .order('total_qty', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching mold performance:', error)
    return []
  }

  return (data || []).map((row: any) => ({
    ...row,
    avg_qty_per_day: parseFloat(row.avg_qty_per_day || '0'),
  })) as MoldPerfRow[]
}
