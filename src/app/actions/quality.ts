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

export async function createLotInspection(payload: any, ngDetails: any[] = []) {
    const supabase = await createClient()
    
    // Get current user id
    const { data: { user } } = await supabase.auth.getUser()
    const inspector_id = user?.id || null

    // 1. Insert into inspections
    const { data: insData, error: insError } = await supabase
        .from('inspections')
        .insert({
            production_lot_id: payload.production_lot_id,
            po_id: payload.po_id,
            inspector_id: inspector_id,
            inspection_date: payload.inspection_date || new Date().toISOString(),
            inspection_stage: payload.inspection_stage || 'in_process',
            inspected_qty: payload.inspected_qty || 0,
            good_qty: payload.good_qty || 0,
            ng_qty: payload.ng_qty || 0,
            ng_category: payload.ng_category || null,
            result: payload.result || (payload.ng_qty > 0 ? 'FAIL' : 'PASS'),
            notes: payload.notes
        })
        .select()
        .single()

    if (insError) {
        console.error('Error creating lot inspection:', insError)
        return { error: insError.message }
    }

    // 2. Insert into ng_detail_logs if ngDetails exist
    if (ngDetails && ngDetails.length > 0) {
        const ngPayloads = ngDetails.map(ng => ({
            inspection_id: insData.inspection_id,
            ng_category: ng.ng_category,
            ng_description: ng.ng_description,
            ng_qty: ng.ng_qty || 1,
            photo_path: ng.photo_path || null
        }))

        const { error: ngError } = await supabase
            .from('ng_detail_logs')
            .insert(ngPayloads)

        if (ngError) {
            console.error('Error creating ng details:', ngError)
            return { error: ngError.message }
        }
    }

    revalidatePath('/quality/lot-inspections')
    revalidatePath('/quality/defects')
    return { data: insData }
}

export async function getNGStatistics() {
    const supabase = await createClient()
    // Fetch ng_detail_logs joined with inspections
    const { data, error } = await supabase
        .from('ng_detail_logs')
        .select(`
            *,
            inspections (
                inspection_date,
                inspection_stage,
                production_lots!production_lot_id (
                    lot_no,
                    production_orders (
                        order_no,
                        products (product_code, product_name)
                    )
                )
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching NG statistics:', error)
        return { data: [], error: error.message }
    }
    return { data }
}
