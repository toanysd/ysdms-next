'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ShipmentPayload = {
  // Luồng A: WO-direct (bắt buộc 1 trong 2)
  work_order_id?: string
  // Luồng B: Order-based
  order_id?: string
  order_line_id?: string
  // Common fields
  ship_date: string          // YYYY-MM-DD, required
  shipped_quantity: number   // Số lượng giao lần này
  delivery_method?: string   // 'YSD便' | '佐川' | 'ヤマト' | 'その他'
  delivery_note_no?: string  // Tự sinh nếu null: DN-YYYYMMDD-NNN
  notes?: string
}

export interface CreateShipmentResult {
  success: boolean
  shipment_id?: string
  delivery_note_no?: string
  error?: string
}

/**
 * Server Action: Tạo phiếu xuất hàng / Shipment (ADR-012 / Chỉ thị #038)
 * Hỗ trợ Luồng A (WO-direct) và Luồng B (Order-based).
 */
export async function createShipment(payload: ShipmentPayload): Promise<CreateShipmentResult> {
  try {
    const supabase = createServerSupabaseClient()

    // 1. Validation
    if (!payload.work_order_id && !payload.order_id) {
      return { success: false, error: 'Chỉ thị sản xuất (Work Order) hoặc Đơn hàng (Order) là bắt buộc.' }
    }

    if (!payload.ship_date) {
      return { success: false, error: 'Vui lòng chọn ngày giao hàng.' }
    }

    if (!payload.shipped_quantity || isNaN(payload.shipped_quantity) || payload.shipped_quantity <= 0) {
      return { success: false, error: 'Số lượng giao hàng phải lớn hơn 0.' }
    }

    // 2. Auto-generate delivery_note_no if null
    let noteNo = payload.delivery_note_no?.trim()
    if (!noteNo) {
      const compactDate = payload.ship_date.replace(/-/g, '')
      const prefix = `DN-${compactDate}-`

      // Đếm số lượng shipment đã có trong ngày đó để sinh sequence
      const { count } = await supabase
        .from('shipments')
        .select('*', { count: 'exact', head: true })
        .ilike('delivery_note_no', `${prefix}%`)

      const seq = (count || 0) + 1
      noteNo = `${prefix}${String(seq).padStart(3, '0')}`
    }

    // 3. Insert shipment record
    const insertData = {
      work_order_id: payload.work_order_id || null,
      order_id: payload.order_id || null,
      order_line_id: payload.order_line_id || null,
      ship_date: payload.ship_date,
      shipped_quantity: Number(payload.shipped_quantity),
      delivery_method: payload.delivery_method || 'YSD便',
      delivery_note_no: noteNo,
      status: 'SHIPPED',
      shipment_type: 'physical',
      notes: payload.notes?.trim() || null,
    }

    const { data: inserted, error: insertErr } = await supabase
      .from('shipments')
      .insert(insertData)
      .select('shipment_id, delivery_note_no')
      .single()

    if (insertErr || !inserted) {
      console.error('[createShipment] Insert error:', insertErr)
      return { success: false, error: insertErr?.message || 'Không thể tạo bản ghi xuất hàng.' }
    }

    // 4. Revalidation
    revalidatePath('/shipments')
    if (payload.work_order_id) {
      revalidatePath(`/production/work-orders/${payload.work_order_id}`)
      revalidatePath('/production/work-orders')
    }

    return {
      success: true,
      shipment_id: inserted.shipment_id,
      delivery_note_no: inserted.delivery_note_no || noteNo,
    }
  } catch (err: any) {
    console.error('[createShipment] Exception:', err)
    return { success: false, error: err?.message || 'Lỗi hệ thống khi tạo xuất hàng.' }
  }
}
