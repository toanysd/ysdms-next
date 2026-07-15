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
    // @ts-ignore
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
  const { data, error } = await (supabase as any)
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
  const { data, error } = await (supabase as any)
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
    // @ts-ignore
    const { error: updErr } = await supabase.from('machine_model').update(payload).eq('id', id)
    error = updErr
  } else {
    // @ts-ignore
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
 * Lấy danh sách thông sềEthực tế của tất cả các máy (View `v_machine_effective_specs`)
 */
export async function getMachineEffectiveSpecs() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('machines')
    .select('*')
    .eq('is_active', true)
    .order('machine_code', { ascending: true })

  if (error) {
    console.error('[API Error] getMachineEffectiveSpecs:', error)
    return []
  }

  return data.map(m => ({
    ...m,
    id: m.machine_id,
    name: m.machine_name,
    internal_code: m.machine_code,
    type_code: m.machine_type
  }))
}

/**
 * Lấy danh sách máy có thềEchạy được mẫu sản phẩm (Khay) dựa trên matrix tương thích
 */
export async function getMachineTrayCompatibility(productId?: string) {
  const supabase = await createClient()

  let query: any = (supabase as any)
    // @ts-ignore
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
    // @ts-ignore
    .eq('is_compatible', true)

  if (productId) {
    // @ts-ignore
    query = query.eq('product_id', productId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching machine tray compatibility:', error)
    return []
  }
  return data
}
