'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addPlasticAction(formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const family = formData.get('family') as string
  const thickness_mm = parseFloat(formData.get('thickness_mm') as string)
  const width_mm = parseFloat(formData.get('width_mm') as string)
  const color = formData.get('color') as string
  const grade = formData.get('grade') as string
  const reorder_point_kg = parseFloat(formData.get('reorder_point_kg') as string)

  const { data, error } = await supabase
    .from('plastic_master')
    .insert([
      {
        code,
        family,
        thickness_mm,
        width_mm,
        color: color || null,
        grade: grade || null,
        reorder_point_kg: isNaN(reorder_point_kg) ? 0 : reorder_point_kg,
        is_active: true
      }
    ])

  if (error) {
    console.error('Error adding plastic:', error)
    return { error: error.message }
  }

  // Cập nhật lại cache cho trang danh sách
  revalidatePath('/master/plastic')
  
  // Trở về trang danh sách
  redirect('/master/plastic')
}
