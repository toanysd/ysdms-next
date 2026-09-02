'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function adjustRollAction(rollId: string, delta: number, type: string, reason: string) {
  const supabase = await createClient()

  // Verify auth session to get user if possible, else fallback
  const { data: { session } } = await supabase.auth.getSession()
  const operator = session?.user?.email || 'System'

  const { data, error } = await (supabase.rpc as any)('rpc_adjust_roll', {
    p_roll_id: rollId,
    p_delta: delta,
    p_reason: reason,
    p_type: type,
    p_operator: operator
  })

  if (error) {
    console.error('RPC error:', error)
    return { error: `Lỗi điều chỉnh: ${error.message}` }
  }

  revalidatePath(`/warehouse/rolls/${rollId}`)
  revalidatePath(`/warehouse/rolls`)
  return { success: true }
}
