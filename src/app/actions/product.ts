'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { TablesInsert } from '@/types/database.types'

export async function addProductAction(formData: FormData) {
  const supabase = await createClient()

  // Required core fields
  const code = formData.get('code') as string
  const name = formData.get('name') as string
  const customer_code = formData.get('customer_code') as string | null

  // Material & Dimensions
  const material = formData.get('material') as string | null
  const thickness = formData.get('thickness') ? parseFloat(formData.get('thickness') as string) : null
  const sheet_width = formData.get('sheet_width') ? parseFloat(formData.get('sheet_width') as string) : null
  const length_val = formData.get('length_val') ? parseFloat(formData.get('length_val') as string) : null
  const width_val = formData.get('width_val') ? parseFloat(formData.get('width_val') as string) : null

  // Tolerances
  const length_tol_upper = formData.get('length_tol_upper') ? parseFloat(formData.get('length_tol_upper') as string) : null
  const length_tol_lower = formData.get('length_tol_lower') ? parseFloat(formData.get('length_tol_lower') as string) : null
  const width_tol_upper = formData.get('width_tol_upper') ? parseFloat(formData.get('width_tol_upper') as string) : null
  const width_tol_lower = formData.get('width_tol_lower') ? parseFloat(formData.get('width_tol_lower') as string) : null

  // Booleans
  const antistatic = formData.get('antistatic') === 'on' || formData.get('antistatic') === 'true'
  const silicone = formData.get('silicone') === 'on' || formData.get('silicone') === 'true'
  const coating = formData.get('coating') === 'on' || formData.get('coating') === 'true'
  const is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true'

  // Packaging and Notes
  const quantity_per_box = formData.get('quantity_per_box') ? parseInt(formData.get('quantity_per_box') as string, 10) : null
  const remarks = formData.get('remarks') as string | null

  const newProduct: TablesInsert<'product_master'> = {
    code: code.trim(),
    name: name ? name.trim() : '',
    customer_code: customer_code ? customer_code.trim() : null,
    material: material ? material.trim() : null,
    thickness,
    sheet_width,
    length_val,
    width_val,
    length_tol_upper,
    length_tol_lower,
    width_tol_upper,
    width_tol_lower,
    antistatic,
    silicone,
    coating,
    quantity_per_box,
    is_active,
    remarks: remarks ? remarks.trim() : null
  }

  const { data, error } = await supabase
    .from('product_master')
    .insert([newProduct])

  if (error) {
    console.error('Error adding product:', error)
    throw new Error(error.message)
  }

  revalidatePath('/master/product')
  redirect('/master/product')
}
