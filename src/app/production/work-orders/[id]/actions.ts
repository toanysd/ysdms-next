'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function confirmWorkOrderAction(woId: string) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data, error } = await (supabase.rpc as any)('rpc_confirm_work_order', {
    p_wo_id: woId,
    p_confirmed_by: session?.user?.id || '00000000-0000-0000-0000-000000000000'
  })

  if (error) {
    console.error('RPC confirm WO error:', error)
    return { error: `Lỗi xác nhận WO: ${error.message}` }
  }

  revalidatePath(`/production/work-orders/${woId}`)
  revalidatePath('/production/work-orders')
  return { success: true, data }
}
