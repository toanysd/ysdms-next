'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ShipmentPayload = {
  // Luồng A: WO-direct (bắt buộc 1 trong 2: work_order_id hoặc order_id)
  work_order_id?: string
  // Luồng B: Order-based
  order_id?: string
  order_line_id?: string
  // Common fields
  ship_date: string          // YYYY-MM-DD, required
  shipped_quantity: number   // Số lượng giao lần này
  delivery_site_id?: string
  delivery_method?: string   // 'YSD便' | '佐川' | 'ヤマト' | 'TRUCK' | 'COURIER' | 'その他'
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
      delivery_site_id: payload.delivery_site_id || null,
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
    try {
      revalidatePath('/shipments')
      if (payload.work_order_id) {
        revalidatePath(`/production/work-orders/${payload.work_order_id}`)
        revalidatePath('/production/work-orders')
      }
      if (payload.order_id) {
        revalidatePath(`/orders/${payload.order_id}`)
        revalidatePath('/orders')
      }
    } catch {
      // Ignore if called outside Next.js request context
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

/**
 * Server Action: Xử lý FormData từ giao diện tạo mới Shipment (Order-based / Luồng B)
 */
export async function createShipmentAction(formData: FormData): Promise<{ success: boolean; error?: string; shipmentId?: string }> {
  try {
    const supabase = createServerSupabaseClient()
    const orderLineId = formData.get('order_line_id') as string
    const orderId = formData.get('order_id') as string
    const shipDate = formData.get('ship_date') as string
    const deliverySiteId = formData.get('delivery_site_id') as string | null
    const deliveryMethod = formData.get('delivery_method') as string
    const deliveryNoteNo = formData.get('delivery_note_no') as string
    const notes = formData.get('notes') as string
    const rawQty = formData.get('quantity') as string
    const qtyShippedThisTime = Number(rawQty)

    if (!orderId || !orderLineId) {
      return { success: false, error: '受注および明細行（Order Line）を選択してください。' }
    }

    if (isNaN(qtyShippedThisTime) || qtyShippedThisTime <= 0) {
      return { success: false, error: '出荷数量は1以上の数値を入力してください。' }
    }

    // 1. Fetch line details
    const { data: line, error: lineError } = await supabase
      .from('order_lines')
      .select('line_id, order_id, quantity, shipped_qty, remaining_qty, line_status')
      .eq('line_id', orderLineId)
      .single()

    if (lineError || !line) {
      return { success: false, error: '指定された受注明細行が見つかりません。' }
    }

    const currentRemaining = (line as any).remaining_qty !== null && (line as any).remaining_qty !== undefined
      ? Number((line as any).remaining_qty)
      : (Number(line.quantity) - Number((line as any).shipped_qty || 0))

    // Guard: Không cho phép giao vượt số lượng còn lại
    if (qtyShippedThisTime > currentRemaining) {
      return {
        success: false,
        error: `出荷数量(${qtyShippedThisTime.toLocaleString()})が未出荷残数(${currentRemaining.toLocaleString()})を超えています。`
      }
    }

    // Generate safe delivery note no if not provided
    let noteNo = deliveryNoteNo?.trim()
    if (!noteNo) {
      const d = new Date(shipDate || Date.now())
      const yy = String(d.getFullYear()).slice(-2)
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const rnd = Math.floor(1000 + Math.random() * 9000)
      noteNo = `DN-${yy}${mm}${dd}-${rnd}`
    }

    // 2. Insert shipment with shipped_quantity
    const { data: shipment, error: shipError } = await supabase
      .from('shipments')
      .insert({
        order_id: orderId,
        order_line_id: orderLineId,
        ship_date: shipDate || new Date().toISOString().slice(0, 10),
        shipped_quantity: qtyShippedThisTime,
        delivery_site_id: deliverySiteId || null,
        delivery_method: deliveryMethod || 'TRUCK',
        delivery_note_no: noteNo,
        status: 'SHIPPED',
        shipment_type: 'physical',
        notes: notes || null
      })
      .select('shipment_id')
      .single()

    if (shipError) return { success: false, error: shipError.message }

    // 3. Update order_lines (shipped_qty, remaining_qty, line_status)
    const newShippedQty = Number((line as any).shipped_qty || 0) + qtyShippedThisTime
    const newRemaining = currentRemaining - qtyShippedThisTime
    const newLineStatus = newRemaining <= 0 ? 'SHIPPED' : 'PARTIALLY_SHIPPED'

    const { error: updateLineErr } = await supabase
      .from('order_lines')
      .update({
        shipped_qty: newShippedQty,
        remaining_qty: newRemaining,
        line_status: newLineStatus,
        updated_at: new Date().toISOString()
      } as any)
      .eq('line_id', orderLineId)

    if (updateLineErr) {
      console.error('Error updating order line:', updateLineErr)
    }

    // 4. Check if all order lines for this order are SHIPPED
    const { data: allLines } = await supabase
      .from('order_lines')
      .select('line_status, remaining_qty')
      .eq('order_id', orderId)

    const allShipped = allLines && allLines.length > 0 && allLines.every((l: any) => {
      return l.line_status === 'SHIPPED' || (l.remaining_qty !== null && l.remaining_qty <= 0)
    })

    if (allShipped) {
      await supabase
        .from('orders')
        .update({ order_status: 'COMPLETED', updated_at: new Date().toISOString() })
        .eq('order_id', orderId)
    } else {
      await supabase
        .from('orders')
        .update({ order_status: 'SHIPPED', updated_at: new Date().toISOString() })
        .eq('order_id', orderId)
        .neq('order_status', 'COMPLETED')
    }

    try {
      revalidatePath('/shipments')
      revalidatePath(`/orders/${orderId}`)
      revalidatePath('/orders')
    } catch {
      // Ignore if called outside Next.js request context
    }
    return { success: true, shipmentId: shipment?.shipment_id }
  } catch (err: any) {
    console.error('[createShipmentAction] Exception:', err)
    return { success: false, error: err?.message || 'Lỗi xử lý xuất hàng' }
  }
}

/**
 * Server Action: Tìm kiếm Order Lines theo mã đơn hàng phục vụ autocomplete ở form xuất hàng
 */
export async function searchOrderLinesAction(orderSearch: string) {
  try {
    const supabase = createServerSupabaseClient()
    
    // 1. Fetch matching orders
    const { data: orders } = await supabase
      .from('orders')
      .select('order_id, order_no, companies (company_name)')
      .ilike('order_no', `%${orderSearch}%`)
      .limit(15)
    
    if (!orders || orders.length === 0) {
      return []
    }
    
    const orderIds = orders.map(o => o.order_id)

    // 2. Fetch order lines with products
    const { data: lines } = await supabase
      .from('order_lines')
      .select(`
        line_id,
        order_id,
        quantity,
        shipped_qty,
        remaining_qty,
        line_status,
        unit,
        products (product_code, product_name)
      `)
      .in('order_id', orderIds)
      
    if (!lines) return []

    // 3. Filter lines that still have remaining qty
    const finalLines = lines
      .filter((l: any) => {
        const remaining = l.remaining_qty !== null && l.remaining_qty !== undefined
          ? Number(l.remaining_qty)
          : (Number(l.quantity) - Number(l.shipped_qty || 0))
        return remaining > 0 && l.line_status !== 'SHIPPED'
      })
      .map((l: any) => {
        const parentOrder = orders.find(o => o.order_id === l.order_id)
        const remaining = l.remaining_qty !== null && l.remaining_qty !== undefined
          ? Number(l.remaining_qty)
          : (Number(l.quantity) - Number(l.shipped_qty || 0))

        return {
          line_id: l.line_id,
          order_id: l.order_id,
          order_no: parentOrder?.order_no || '',
          customer_name: (parentOrder as any)?.companies?.company_name || '',
          quantity: Number(l.quantity),
          shipped_qty: Number((l as any).shipped_qty || 0),
          remaining_qty: remaining,
          unit: l.unit || 'pcs',
          product_code: l.products?.product_code || '',
          product_name: l.products?.product_name || l.products?.product_code || ''
        }
      })

    return finalLines
  } catch (err) {
    console.error('[searchOrderLinesAction] Error:', err)
    return []
  }
}
