'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createShipmentAction(formData: FormData) {
  const supabase = await createClient()
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
  let noteNo = deliveryNoteNo
  if (!noteNo) {
    const d = new Date(shipDate || Date.now())
    const yy = String(d.getFullYear()).slice(-2)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const rnd = Math.floor(1000 + Math.random() * 9000)
    noteNo = `DN-${yy}${mm}${dd}-${rnd}`
  }

  // 2. Insert shipment
  const { data: shipment, error: shipError } = await supabase
    .from('shipments')
    .insert({
      order_id: orderId,
      order_line_id: orderLineId,
      ship_date: shipDate || new Date().toISOString().slice(0, 10),
      delivery_site_id: deliverySiteId || null,
      delivery_method: deliveryMethod || 'TRUCK',
      delivery_note_no: noteNo,
      status: 'SHIPPED',
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

  revalidatePath('/orders/shipments')
  revalidatePath(`/orders/${orderId}`)
  revalidatePath('/orders')
  return { success: true, shipmentId: shipment?.shipment_id }
}

export async function searchOrderLinesAction(orderSearch: string) {
  const supabase = await createClient()
  
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
}
