'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addCutterAction(formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const type = formData.get('type') as string
  const width_mm = parseFloat(formData.get('width_mm') as string)

  const { data, error } = await supabase
    .from('cutter_master')
    .insert([
      {
        code: code.trim(),
        type: type ? type.trim() : null,
        width_mm: isNaN(width_mm) ? null : width_mm,
        is_active: true
      }
    ])

  if (error) {
    console.error('Error adding cutter:', error)
    throw new Error(error.message)
  }

  revalidatePath('/master/cutter')
  redirect('/master/cutter')
}
