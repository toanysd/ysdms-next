'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function addMachineAction(formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const type = formData.get('type') as string
  const status = formData.get('status') as string

  const { data, error } = await supabase
    .from('machine_master')
    .insert([
      {
        code: code.trim(),
        type: type ? type.trim() : null,
        status: status || 'IDLE',
        is_active: true
      }
    ])

  if (error) {
    console.error('Error adding machine:', error)
    return { error: error.message }
  }

  revalidatePath('/master/machine')
  redirect('/master/machine')
}
