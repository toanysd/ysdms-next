'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addProductAction(formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const name = formData.get('name') as string

  const { data, error } = await supabase
    .from('product_master')
    .insert([
      {
        code: code.trim(),
        name: name ? name.trim() : null,
        is_active: true
      }
    ])

  if (error) {
    console.error('Error adding product:', error)
    return { error: error.message }
  }

  revalidatePath('/master/product')
  redirect('/master/product')
}
