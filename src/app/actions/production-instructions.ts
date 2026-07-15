'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { PIFormData } from '@/app/production-instructions/new/page'

// ─── Types ────────────────────────────────────────────────────────────────────

const COMPANY_TEMPLATE_MAP: Record<string, 'HAE' | 'NLC' | 'SMK' | 'YAE' | 'GENERAL'> = {
  HAE: 'HAE', JAE: 'HAE', NLC: 'NLC', SMK: 'SMK', YAE: 'YAE',
}

async function generateInstructionNo(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  const year = new Date().getFullYear()
  const { count } = await supabase
    .from('production_instructions')
    .select('*', { count: 'exact', head: true })
    .like('instruction_no', `PI-${year}-%`)
  const seq = String((count ?? 0) + 1).padStart(6, '0')
  return `PI-${year}-${seq}`
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export async function getProductionInstructions(filters: {
  status?: string
  production_site?: string
  date_from?: string
  date_to?: string
  search?: string
}) {
  const supabase = await createClient()
  let q = supabase
    .from('production_instructions')
    .select(`
      id, instruction_no, product_id, instruction_type, production_site,
      quantity_ordered, requested_date, status, template_type,
      material_stock_warning, created_at,
      orders(order_no),
      products(product_code, product_name),
      companies(name),
      delivery_sites(site_name)
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (filters.status) q = q.eq('status', filters.status)
  if (filters.production_site) q = q.eq('production_site', filters.production_site)
  if (filters.date_from) q = q.gte('requested_date', filters.date_from)
  if (filters.date_to) q = q.lte('requested_date', filters.date_to)
  if (filters.search) {
    q = q.or(`instruction_no.ilike.%${filters.search}%`)
  }

  const { data } = await q
  return data ?? []
}

export async function getProductionInstructionById(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('production_instructions')
    .select(`
      *,
      orders(order_no),
      products(product_code, product_name),
      companies(name),
      delivery_sites(site_name, address)
    `)
    .eq('id', id)
    .single()
  return data
}

export async function searchOrders(query: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select(`
      id, order_no,
      products(id, product_code, product_name, material_spec, material_thickness, material_width, antistatic, silicon, surface_coating, recycled_pct),
      companies(id, name, code)
    `)
    .or(`order_no.ilike.%${query}%`)
    .limit(20)
  return data ?? []
}

export async function searchDeliverySites(query: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('delivery_sites')
    .select('id, site_name, site_code, address')
    .or(`site_name.ilike.%${query}%,site_code.ilike.%${query}%`)
    .eq('active', true)
    .limit(30)
  return data ?? []
}

export async function checkMaterialStock(
  materialSpec: string,
  productionSite: string,
  quantityNeeded: number
): Promise<{ sufficient: boolean; currentStock: number }> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('material_inventory')
    .select('quantity')
    .eq('material_spec', materialSpec)
    .eq('factory', productionSite)
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()
  const currentStock = (data as { quantity: number } | null)?.quantity ?? 0
  return { sufficient: currentStock >= quantityNeeded, currentStock }
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export async function createProductionInstruction(
  form: PIFormData & { status: 'DRAFT' | 'ISSUED' }
): Promise<{ id?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: '認証が必要です' }

  const instruction_no = await generateInstructionNo(supabase)
  const issued_at = form.status === 'ISSUED' ? new Date().toISOString() : null

  const { data, error } = await supabase
    .from('production_instructions')
    .insert({
      instruction_no,
      order_id: form.order_id || null,
      product_id: form.product_id || null,
      instruction_type: 'FORMING',
      production_site: form.production_site,
      quantity_ordered: form.quantity_ordered,
      requested_date: form.requested_date,
      delivery_site_id: form.delivery_site_id || null,
      template_type: form.template_type,
      material_spec: form.material_spec || null,
      material_thickness: form.material_thickness,
      material_width: form.material_width,
      antistatic: form.antistatic,
      silicon: form.silicon,
      surface_coating: form.surface_coating,
      recycled_pct: form.recycled_pct,
      is_first_time: form.is_first_time,
      has_label: form.has_label,
      notes: form.notes || null,
      material_stock_warning: form.material_stock_warning,
      material_stock_qty: form.material_stock_qty,
      status: form.status,
      issued_at,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  revalidatePath('/production-instructions')
  return { id: data.id }
}

export async function issueProductionInstruction(id: string): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('production_instructions')
    .update({ status: 'ISSUED', issued_at: new Date().toISOString() })
    .eq('id', id)
    .eq('status', 'DRAFT')
  revalidatePath(`/production-instructions/${id}`)
  revalidatePath('/production-instructions')
}
