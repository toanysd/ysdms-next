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
      orders(order_no, companies(company_name, company_code)),
      products(product_id, product_code, product_name),
      delivery_sites(site_name),
      production_instruction_tags(
        tag_code,
        custom_label,
        production_tag_master(label_ja, print_style)
      )
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
        orders(order_no, companies(company_name, company_code)),
        products(product_id, product_code, product_name),
        delivery_sites(site_name, site_address),
        production_instruction_tags(
          tag_code,
          custom_label,
          production_tag_master(label_ja, label_vi, priority, print_style)
        )
    `)
    .eq('id', id)
    .single()
  return data
}

export async function searchOrders(query: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select(`
      order_id, order_no,
      order_lines(
        products(
          product_id, product_code, product_name, primary_plastic_code, primary_plastic_spec,
          design_revisions(revision_id, revision_number)
        )
      ),
      companies(company_id, company_name, company_code)
    `)
    .ilike('order_no', `%${query}%`)
    .limit(20)

  if (error || !data) return []

  // Map to match the expected structure: flatten product from first order_line
  return data.map(order => {
    // Safely type-cast the join result
    const orderLines = (order as any).order_lines || []
    const firstLine = orderLines[0]
    const product = firstLine?.products || null
    const designRevisions = product?.design_revisions || []
    const latestRevision = designRevisions.length > 0
      ? designRevisions.sort((a: any, b: any) => (b.revision_number || 0) - (a.revision_number || 0))[0]
      : null

    return {
      order_id: order.order_id,
      order_no: order.order_no,
      products: product ? {
        product_id: product.product_id,
        product_code: product.product_code,
        product_name: product.product_name,
        primary_plastic_code: product.primary_plastic_code,
        primary_plastic_spec: product.primary_plastic_spec,
        latest_design_revision_id: latestRevision ? latestRevision.revision_id : null
      } : null,
      companies: order.companies
    }
  })
}

export async function searchDeliverySites(query: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('delivery_sites')
    .select('site_id, site_name, site_code, site_address')
    .or(`site_name.ilike.%${query}%,site_code.ilike.%${query}%`)
    .eq('is_active', true)
    .limit(30)
  return data ?? []
}

export async function checkMaterialStock(
  materialSpec: string,
  productionSite: string,
  quantityNeeded: number
): Promise<{ sufficient: boolean; currentStock: number }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('material_inventory_v2')
    .select('available_m')
    .eq('material_spec', materialSpec)
    .eq('factory_site', productionSite)

  if (error || !data || data.length === 0) {
    return { sufficient: false, currentStock: 0 }
  }

  // Sum up available stock across all variants (silicon/antistatic) for the same spec and factory
  const currentStock = data.reduce((sum, row) => sum + Number(row.available_m || 0), 0)

  return { sufficient: currentStock >= quantityNeeded, currentStock }
}

export async function getStandardTags() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('production_tag_master')
    .select('tag_code, label_ja, label_vi, priority, print_style')
    .eq('is_active', true)
    .order('priority', { ascending: true })
  return data ?? []
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
      daily_quantity: form.daily_quantity || null,
      plain_case: form.plain_case || false,
      plain_label: form.plain_label || false,
      adhesive_sheet: form.adhesive_sheet || false,
      design_revision_id: form.design_revision_id || null,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  // Insert tags if any
  if (form.tags && form.tags.length > 0) {
    const tagsToInsert = form.tags.map((t, idx) => ({
      instruction_id: data.id,
      tag_code: t.tag_code || null,
      custom_label: t.custom_label || null,
      display_order: idx
    }))
    const { error: tagsError } = await supabase
      .from('production_instruction_tags')
      .insert(tagsToInsert)
    if (tagsError) {
      console.error('Failed to save tags for instruction:', tagsError)
    }
  }

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
