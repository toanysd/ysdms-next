'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createInboundTxnAction(data: {
    plastic_id: string
    change_kg: number
    lot_no_material?: string
    notes?: string
    transaction_date: string
}) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('inventory_txn')
        .insert([{
            plastic_id: data.plastic_id,
            txn_type: 'IN',
            change_kg: data.change_kg,
            lot_no_material: data.lot_no_material || null,
            notes: data.notes || null,
            transaction_date: data.transaction_date
        }])

    if (error) {
        console.error('Lỗi khi nhập kho:', error)
        throw new Error(error.message)
    }

    revalidatePath('/inventory')
    revalidatePath('/inventory/history')
}
