'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getInspectionsByJob(jobId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('tray_inspections')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching tray inspections:', error)
        return []
    }
    return data
}

export async function createInspection(payload: any) {
    const supabase = await createClient()
    
    // Get current user id
    const { data: { user } } = await supabase.auth.getUser()
    const inspected_by = user?.id || null

    const { data, error } = await supabase
        .from('tray_inspections')
        .insert([{
            ...payload,
            inspected_by: payload.inspected_by || inspected_by,
            inspected_date: payload.inspected_date || new Date().toISOString()
        }])
        .select()
        .single()

    if (error) {
        console.error('Error creating tray inspection:', error)
        return { error: error.message }
    }

    revalidatePath('/quality/inspections')
    return { data }
}

export async function updateInspection(inspectionId: string, payload: any) {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('tray_inspections')
        .update(payload)
        .eq('inspection_id', inspectionId)
        .select()
        .single()

    if (error) {
        console.error('Error updating tray inspection:', error)
        return { error: error.message }
    }

    revalidatePath('/quality/inspections')
    return { data }
}
