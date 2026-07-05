'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Search companies (customers) by code or name.
 * Table: companies (NOT the old 'customers' table which was DROP-ed)
 */
export async function searchCustomers(query: string) {
  if (!query) return []

  const supabase = await createClient()

  const { data } = await supabase
    .from('companies')
    .select('company_id, company_code, company_name, company_type, tel, address, is_active')
    .or(`company_code.ilike.%${query}%,company_name.ilike.%${query}%`)
    .order('company_code', { ascending: true })
    .limit(20)

  return data || []
}

/**
 * Upsert a company (customer/supplier/etc.)
 * Table: companies
 */
export async function upsertCustomerAction(data: {
  company_id?: string
  company_code: string
  company_name: string
  company_name_romaji?: string | null
  company_type?: string[]
  tel?: string | null
  fax?: string | null
  address?: string | null
  notes?: string | null
  parent_company_id?: string | null
  is_active?: boolean
  order_folder_path?: string | null
  cad_folder_path?: string | null
}) {
  const supabase = await createClient()

  const payload = {
    company_code: data.company_code,
    company_name: data.company_name,
    company_name_romaji: data.company_name_romaji || null,
    company_type: data.company_type || ['CUSTOMER'],
    tel: data.tel || null,
    fax: data.fax || null,
    address: data.address || null,
    notes: data.notes || null,
    parent_company_id: data.parent_company_id || null,
    is_active: data.is_active ?? true,
    order_folder_path: data.order_folder_path || null,
    cad_folder_path: data.cad_folder_path || null,
  }

  if (data.company_id) {
    const { error } = await supabase
      .from('companies')
      .update(payload)
      .eq('company_id', data.company_id)

    if (error) {
      console.error('Error updating company:', error)
      return { success: false, error: error.message }
    }
  } else {
    const { error } = await supabase
      .from('companies')
      .insert(payload)

    if (error) {
      console.error('Error inserting company:', error)
      return { success: false, error: error.message }
    }
  }

  revalidatePath('/master/customers')
  return { success: true }
}

// ── Contacts ─────────────────────────────────────────────────────────────────

export async function upsertContactAction(data: {
  contact_id?: string
  company_id: string
  contact_name: string
  contact_role?: string | null
  contact_tel?: string | null
  contact_email?: string | null
  is_primary?: boolean
}) {
  const supabase = await createClient()

  const payload = {
    company_id: data.company_id,
    contact_name: data.contact_name,
    contact_role: data.contact_role || null,
    contact_tel: data.contact_tel || null,
    contact_email: data.contact_email || null,
    is_primary: data.is_primary ?? false,
  }

  if (data.contact_id) {
    const { error } = await supabase.from('company_contacts').update(payload).eq('contact_id', data.contact_id)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase.from('company_contacts').insert(payload)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath(`/master/customers/${data.company_id}`)
  return { success: true }
}

export async function deleteContactAction(contact_id: string, company_id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('company_contacts').delete().eq('contact_id', contact_id)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/master/customers/${company_id}`)
  return { success: true }
}

// ── Delivery Sites ───────────────────────────────────────────────────────────

export async function upsertDeliverySiteAction(data: {
  site_id?: string
  company_id: string
  site_code: string
  site_name: string
  site_address?: string | null
  site_tel?: string | null
  site_fax?: string | null
  contact_person?: string | null
  contact_email?: string | null
  delivery_notes?: string | null
  is_active?: boolean
}) {
  const supabase = await createClient()

  const payload = {
    company_id: data.company_id,
    site_code: data.site_code,
    site_name: data.site_name,
    site_address: data.site_address || null,
    site_tel: data.site_tel || null,
    site_fax: data.site_fax || null,
    contact_person: data.contact_person || null,
    contact_email: data.contact_email || null,
    delivery_notes: data.delivery_notes || null,
    is_active: data.is_active ?? true,
  }

  if (data.site_id) {
    const { error } = await supabase.from('delivery_sites').update(payload).eq('site_id', data.site_id)
    if (error) return { success: false, error: error.message }
  } else {
    const { error } = await supabase.from('delivery_sites').insert(payload)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath(`/master/customers/${data.company_id}`)
  return { success: true }
}

export async function deleteDeliverySiteAction(site_id: string, company_id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('delivery_sites').delete().eq('site_id', site_id)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/master/customers/${company_id}`)
  return { success: true }
}
