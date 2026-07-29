'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { NGDetailLog } from '@/types/quality'

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

export async function createInspection(payload: Record<string, unknown>) {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    const inspected_by = user?.id || null

    const { data, error } = await (supabase as any)
        .from('tray_inspections')
        .insert([{
            ...payload,
            inspected_by: (payload.inspected_by as string) || inspected_by,
            inspected_date: (payload.inspected_date as string) || new Date().toISOString()
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

export async function updateInspection(inspectionId: string, payload: Record<string, unknown>) {
    const supabase = await createClient()
    
    const { data, error } = await (supabase as any)
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

export async function createLotInspection(
    payload: Record<string, unknown>,
    ngDetails: Array<Record<string, unknown>> = []
) {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    const inspector_id = user?.id || null

    const { data: insData, error: insError } = await (supabase as any)
        .from('inspections')
        .insert({
            production_lot_id: payload.production_lot_id,
            po_id: payload.po_id,
            inspector_id: inspector_id,
            inspection_date: (payload.inspection_date as string) || new Date().toISOString(),
            inspection_stage: (payload.inspection_stage as string) || 'in_process',
            inspected_qty: (payload.inspected_qty as number) || 0,
            good_qty: (payload.good_qty as number) || 0,
            ng_qty: (payload.ng_qty as number) || 0,
            ng_category: (payload.ng_category as string) || null,
            result: (payload.result as string) || ((payload.ng_qty as number) > 0 ? 'FAIL' : 'PASS'),
            notes: payload.notes
        })
        .select()
        .single()

    if (insError) {
        console.error('Error creating lot inspection:', insError)
        return { error: insError.message }
    }

    if (ngDetails && ngDetails.length > 0) {
        const ngPayloads = ngDetails.map(ng => ({
            inspection_id: insData.inspection_id,
            ng_category: ng.ng_category,
            ng_description: ng.ng_description,
            ng_qty: (ng.ng_qty as number) || 1,
            photo_path: (ng.photo_path as string) || null
        }))

        const { error: ngError } = await (supabase as any)
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

export async function getNGStatistics(): Promise<{ data: NGDetailLog[]; error?: string }> {
    const supabase = await createClient()
    const { data, error } = await (supabase as any)
        .from('ng_detail_logs')
        .select(`
            ng_log_id,
            inspection_id,
            ng_category,
            ng_description,
            ng_qty,
            photo_path,
            created_at,
            inspections (
                inspection_date,
                inspection_stage,
                production_lots!production_lot_id (
                    lot_no,
                    production_orders (
                        po_code,
                        order_lines (
                            orders (order_no),
                            products (product_code, product_name)
                        )
                    )
                )
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching NG statistics:', error)
        return { data: [], error: error.message }
    }

    const mappedData = (data || []).map((item: any) => {
        const ins = item.inspections
        if (ins) {
            const lot = ins.production_lots
            if (lot) {
                const po = lot.production_orders
                if (po) {
                    const line = po.order_lines
                    po.order_no = line?.orders?.order_no || null
                    po.products = line?.products || null
                }
            }
        }
        return item
    })

    return { data: (mappedData as unknown as NGDetailLog[]) }
}
