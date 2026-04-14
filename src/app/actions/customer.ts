'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addCustomerAction(formData: FormData) {
  const supabase = await createClient()

  const customer_code = formData.get('customer_code') as string
  const delivery_name = formData.get('delivery_name') as string
  const delivery_address = formData.get('delivery_address') as string
  const requester_code = formData.get('requester_code') as string
  const contact_person = formData.get('contact_person') as string
  const phone = formData.get('phone') as string
  
  const { data, error } = await supabase
    .from('customers')
    .insert([
      {
        customer_code: customer_code.trim(),
        delivery_name: delivery_name.trim(),
        delivery_address: delivery_address ? delivery_address.trim() : null,
        requester_code: requester_code ? requester_code.trim() : null,
        contact_person: contact_person ? contact_person.trim() : null,
        phone: phone ? phone.trim() : null,
        is_active: true
      }
    ])

  if (error) {
    console.error('Error adding customer:', error)
    return { error: error.message }
  }

  revalidatePath('/master/customers')
  redirect('/master/customers')
}
