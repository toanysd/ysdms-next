'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .maybeSingle()

  if (profile?.role !== 'admin' && profile?.role !== 'pe') {
    throw new Error("Forbidden: Requires admin role")
  }

  return { supabase, user: userData.user }
}

export async function hideCompany(companyId: string) {
  const { supabase, user } = await verifyAdmin()

  const { error } = await supabase.rpc('hide_company', {
    p_company_id: companyId,
    p_user_id: user.id
  })

  if (error) {
    console.error('Error hiding company:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/master/data-sync')
  return { success: true }
}

export async function promoteCompanyToSSOT(companyId: string) {
  const { supabase, user } = await verifyAdmin()

  const { error } = await supabase.rpc('promote_company_to_ssot', {
    p_company_id: companyId,
    p_user_id: user.id
  })

  if (error) {
    console.error('Error promoting company:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/master/data-sync')
  return { success: true }
}

export async function remapCompanyFKs(oldCompanyId: string, newCompanyId: string) {
  const { supabase, user } = await verifyAdmin()

  const { error } = await supabase.rpc('remap_company_fks', {
    p_old_company_id: oldCompanyId,
    p_new_company_id: newCompanyId,
    p_user_id: user.id
  })

  if (error) {
    console.error('Error remapping company:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/master/data-sync')
  return { success: true }
}
