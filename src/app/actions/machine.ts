'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addMachineAction(formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const machine_model_id = formData.get('machine_model_id') as string
  const status = formData.get('status') as string

  if (!machine_model_id) throw new Error('Vui lòng chọn Dòng Máy (Model)')

  const { error } = await supabase
    .from('machine_instance')
    .insert([
      {
        internal_code: code.trim(),
        name: code.trim(), // Use code as name for now
        status: status === 'IDLE' ? 'active' : 'maintenance',
        machine_model_id: machine_model_id
      }
    ])

  if (error) {
    console.error('Error adding machine:', error)
    throw new Error(error.message)
  }

  revalidatePath('/master/machine')
}

export async function getMachineTypes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('machine_type')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching machine types:', error)
    return []
  }
  return data
}

export async function getMachineModels() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('machine_model')
    .select(`
       *,
       machine_type(code, name_vi, name_jp, spec_schema)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching machine models:', error)
    return []
  }
  return data
}

export async function upsertMachineModelAction(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string | null
  const machine_type_id = formData.get('machine_type_id') as string
  const model_code = formData.get('model_code') as string
  const manufacturer = formData.get('manufacturer') as string
  const model_name = formData.get('model_name') as string
  const specsRaw = formData.get('specs') as string

  let specs = {}
  try {
    specs = JSON.parse(specsRaw || '{}')
  } catch (e) { }

  const payload = {
    machine_type_id,
    model_code: model_code.trim(),
    manufacturer: manufacturer?.trim(),
    model_name: model_name?.trim(),
    specs
  }

  let error;
  if (id) {
    const { error: updErr } = await supabase.from('machine_model').update(payload).eq('id', id)
    error = updErr
  } else {
    const { error: insErr } = await supabase.from('machine_model').insert([payload])
    error = insErr
  }

  if (error) {
    console.error('Error upserting machine model:', error)
    throw new Error(error.message)
  }

  revalidatePath('/master/machine')
}

/**
 * Lấy danh sách thông số thực tế của tất cả các máy (View `v_machine_effective_specs`)
 */
export async function getMachineEffectiveSpecs() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('v_machine_effective_specs')
    .select('*')
    .neq('status', 'retired') // Lấy active và maintenance
    .order('internal_code', { ascending: true })

  if (error) {
    console.error('[API Error] getMachineEffectiveSpecs:', error)
    return []
  }

  return data
}

/**
 * Lấy danh sách máy có thể chạy được mẫu sản phẩm (Khay) dựa trên matrix tương thích
 */
export async function getMachineTrayCompatibility(productId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('machine_tray_compatibility')
    .select(`
            is_compatible,
            compatibility_notes,
            product_id,
            machine_instance (
                id,
                internal_code,
                name,
                status
            )
        `)
    .eq('is_compatible', true)

  if (productId) {
    query = query.eq('product_id', productId)
  }

  const { data, error } = await query

  if (!error && data && data.length > 0) {
    return data
  }

  // FALLBACK: Nếu hệ thống chưa setup mapping máy-sp, trả về tất cả các máy 'active' để xưởng có thể gán tạm
  const { data: allMachines } = await supabase
    .from('machine_instance')
    .select('id, internal_code, name, status')
    .eq('status', 'active')

  if (allMachines && allMachines.length > 0) {
    return allMachines.map(m => ({ machine_instance: m }))
  }

  return []
}
