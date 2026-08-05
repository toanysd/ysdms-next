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
    .from('equipment')
    .insert([
      {
        equipment_code: code.trim().startsWith('CT-') ? code.trim() : `CT-${code.trim()}`,
        display_name: code.trim(),
        equipment_type: 'CUTTER_SEPARATE',
        sub_type: type ? type.trim() : null,
        actual_width_mm: isNaN(width_mm) ? null : String(width_mm),
        device_status: 'NORMAL',
        usage_status: 'STORAGE'
      }
    ])

  if (error) {
    console.error('Error adding cutter:', error)
    throw new Error(error.message)
  }

  revalidatePath('/master/cutter')
  redirect('/master/cutter')
}
