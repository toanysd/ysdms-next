'use server'

import { createClient } from '@/lib/supabase/server'

export type InventoryItem = {
  product_id: string
  product_code: string
  product_name: string | null
  product_name_internal: string | null
  company_id: string | null
  company_name: string | null
  company_code: string | null
  total_produced: number
  total_shipped: number
  current_stock: number
  low_stock_threshold: number
  stock_status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
}

export type InventoryKPIs = {
  totalProducts: number
  totalStockPcs: number
  lowStockCount: number
  outOfStockCount: number
  thisMonthShippedPcs: number
}

export async function getInventoryKPIs(): Promise<InventoryKPIs> {
  const supabase = await createClient()

  // 1. View aggregates
  const { data: viewAgg, error: aggErr } = await (supabase as any)
    .from('v_product_stock_summary')
    .select('stock_status, current_stock')

  let totalProducts = 0
  let totalStockPcs = 0
  let lowStockCount = 0
  let outOfStockCount = 0

  if (!aggErr && viewAgg) {
    totalProducts = viewAgg.length
    for (const row of (viewAgg as any[])) {
      totalStockPcs += Number(row.current_stock || 0)
      if (row.stock_status === 'LOW_STOCK') lowStockCount++
      else if (row.stock_status === 'OUT_OF_STOCK') outOfStockCount++
    }
  }

  // 2. Shipments this month
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  const { data: shipData } = await supabase
    .from('shipments')
    .select('shipped_quantity')
    .gte('ship_date', startOfMonth)
    .in('status', ['SHIPPED', 'DELIVERED'])

  const thisMonthShippedPcs = (shipData || []).reduce((sum: number, s: any) => sum + (Number(s.shipped_quantity) || 0), 0)

  return {
    totalProducts,
    totalStockPcs,
    lowStockCount,
    outOfStockCount,
    thisMonthShippedPcs
  }
}

export async function getInventoryStockData(params: {
  search?: string
  companyId?: string
  stockStatus?: string
  page?: number
  pageSize?: number
  sortCol?: string
  sortDir?: 'asc' | 'desc'
}): Promise<{ items: InventoryItem[]; total: number }> {
  const supabase = await createClient()
  const page = params.page || 1
  const pageSize = params.pageSize || 50
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = (supabase as any)
    .from('v_product_stock_summary')
    .select('*', { count: 'exact' })

  if (params.companyId && params.companyId !== 'ALL') {
    query = query.eq('company_id', params.companyId)
  }

  if (params.stockStatus && params.stockStatus !== 'ALL') {
    query = query.eq('stock_status', params.stockStatus)
  }

  if (params.search && params.search.trim()) {
    const q = params.search.trim()
    query = query.or(`product_code.ilike.%${q}%,product_name.ilike.%${q}%,product_name_internal.ilike.%${q}%`)
  }

  // Sorting
  const sortCol = params.sortCol || 'current_stock'
  const sortAsc = params.sortDir === 'asc'
  query = query.order(sortCol, { ascending: sortAsc }).range(from, to)

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching inventory stock data:', error)
    return { items: [], total: 0 }
  }

  return {
    items: (data as InventoryItem[]) || [],
    total: count || 0
  }
}

export async function getInventoryCompanies(): Promise<{ company_id: string; company_name: string; company_code: string | null }[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('companies')
    .select('company_id, company_name, company_code')
    .contains('company_type', ['CUSTOMER'])
    .order('company_name', { ascending: true })

  if (error) {
    console.error('Error fetching companies:', error)
    return []
  }

  return (data as any[]) || []
}
