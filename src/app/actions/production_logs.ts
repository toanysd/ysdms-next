'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProductionLogsBySchedule(scheduleId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('production_logs')
        .select('*')
        .eq('po_id', scheduleId) // using po_id to map to schedule_id
        .order('log_date', { ascending: false })

    if (error) {
        console.error('Error fetching production logs:', error)
        return []
    }
    return data
}

export async function createProductionLog(payload: any) {
    const supabase = await createClient()
    
    // Get current user id
    const { data: { user } } = await supabase.auth.getUser()
    const operator_id = user?.id || null

    const { data, error } = await supabase
        .from('production_logs')
        .insert([{
            ...payload,
            operator_id: payload.operator_id || operator_id
        }])
        .select()
        .single()

    if (error) {
        console.error('Error creating production log:', error)
        return { error: error.message }
    }

    revalidatePath('/production/worklog')
    return { data }
}

export async function updateProductionLog(logId: string, payload: any) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('production_logs')
        .update(payload)
        .eq('log_id', logId)
        .select()
        .single()

    if (error) {
        console.error('Error updating production log:', error)
        return { error: error.message }
    }

    revalidatePath('/production/worklog')
    return { data }
}
