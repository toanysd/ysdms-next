'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addMoldBaseAction(formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const name = formData.get('name') as string
  const customer_id = formData.get('customer_id') as string

  // Clean data
  const insertData: any = {
    code: code.trim(),
    name: name.trim() || null,
    is_active: true
  }
  
  if (customer_id) {
    insertData.customer_id = customer_id;
  }

  const { data, error } = await supabase
    .from('mold_base')
    .insert([insertData])

  if (error) {
    console.error('Error adding mold base:', error)
    return { error: error.message }
  }

  // Cập nhật lại cache cho trang danh sách
  revalidatePath('/master/mold')
  
  // Trở về trang danh sách
  redirect('/master/mold')
}
