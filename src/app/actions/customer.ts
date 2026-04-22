'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function searchCustomers(query: string) {
  if (!query) return []

  const supabase = await createClient()

  const { data } = await supabase
    .from('customers')
    .select('id, customer_code, delivery_name, delivery_address, requester_code, contact_person, phone')
    .or(`customer_code.ilike.%${query}%,delivery_name.ilike.%${query}%`)
    .order('customer_code', { ascending: true })
    .limit(20)

  return data || []
}

export async function addCustomerAction(formData: FormData) {
  const supabase = await createClient()
  
  const customer_code = formData.get('customer_code') as string
  const delivery_name = formData.get('delivery_name') as string
  const delivery_address = formData.get('delivery_address') as string || null
  const contact_person = formData.get('contact_person') as string || null
  const phone = formData.get('phone') as string || null
  const requester_code = formData.get('requester_code') as string || null

  const { error } = await supabase.from('customers').insert({
    customer_code,
    delivery_name,
    delivery_address,
    contact_person,
    phone,
    requester_code
  })

  if (error) {
    console.error('Lỗi khi thêm Khách hàng:', error)
    throw new Error('Lỗi khi thêm Khách hàng: ' + error.message)
  }

  revalidatePath('/master/customers')
  redirect('/master/customers')
}
