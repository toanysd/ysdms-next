'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createShipmentAction(formData: FormData) {
  const supabase = await createClient()
  const orderLineId = formData.get('order_line_id') as string | null
  const orderId = formData.get('order_id') as string
  const shipDate = formData.get('ship_date') as string
  const deliverySiteId = formData.get('delivery_site_id') as string | null
  const deliveryMethod = formData.get('delivery_method') as string
  const deliveryNoteNo = formData.get('delivery_note_no') as string
  const notes = formData.get('notes') as string

  // 1. Insert shipment
  const { error: shipError } = await supabase.from('shipments').insert({
    order_id: orderId,
    order_line_id: orderLineId || null,
    ship_date: shipDate,
    delivery_site_id: deliverySiteId || null,
    delivery_method: deliveryMethod,
    delivery_note_no: deliveryNoteNo || null,
    status: 'SHIPPED',
    notes: notes || null
  })
  if (shipError) return { success: false, error: shipError.message }

  // 2. Update order_line status → SHIPPED (chỉ khi có order_line_id)
  if (orderLineId) {
    await supabase.from('order_lines')
      .update({ line_status: 'SHIPPED' })
      .eq('line_id', orderLineId)

    // 3. Check nếu tất cả lines của order đã SHIPPED
    const { data: allLines } = await supabase
      .from('order_lines')
      .select('line_status')
      .eq('order_id', orderId)

    const allShipped = allLines?.every(l => l.line_status === 'SHIPPED')
    if (allShipped) {
      await supabase.from('orders')
        .update({ order_status: 'COMPLETED' })
        .eq('order_id', orderId)
    }
  }

  revalidatePath('/orders/shipments')
  revalidatePath('/orders')
  return { success: true }
}

export async function searchOrderLinesAction(orderSearch: string) {
  const supabase = await createClient()
  
  // 1. Fetch matching orders
  const { data: orders } = await supabase
    .from('orders')
    .select('order_id, order_no')
    .ilike('order_no', `%${orderSearch}%`)
    .limit(10)
  
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
      products (product_name)
    `)
    .in('order_id', orderIds)
    
  if (!lines) return []

  // 3. Fetch existing shipments to filter out already shipped lines
  const { data: existingShipments } = await supabase
    .from('shipments')
    .select('order_line_id')
    .in('order_id', orderIds)
    .not('order_line_id', 'is', null)

  const shippedLineIds = new Set(existingShipments?.map(s => s.order_line_id))

  // 4. Combine and filter
  const finalLines = lines
    .filter((l: any) => !shippedLineIds.has(l.line_id))
    .map((l: any) => ({
      line_id: l.line_id,
      order_id: l.order_id,
      quantity: l.quantity,
      order_no: orders.find(o => o.order_id === l.order_id)?.order_no || '',
      product_name: l.products?.product_name || ''
    }))

  return finalLines
}
