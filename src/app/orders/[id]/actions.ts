'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderHeaderAction(orderId: string, payload: any) {
  const supabase = await createClient()
  const { error } = await supabase.from('orders').update(payload).eq('order_id', orderId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  const supabase = await createClient()
  
  // Validate transition
  const VALID_FLOW = ['DRAFT', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'CLOSED']
  const ALLOW_CANCEL_FROM = ['DRAFT', 'CONFIRMED']
  
  const { data: current } = await supabase
    .from('orders').select('order_status').eq('order_id', orderId).single()
  
  const currentIdx = VALID_FLOW.indexOf(current?.order_status || '')
  const newIdx = VALID_FLOW.indexOf(newStatus)
  
  const isForwardOne = newIdx === currentIdx + 1
  const isCancelAllowed = newStatus === 'CANCELLED' && ALLOW_CANCEL_FROM.includes(current?.order_status || '')
  
  if (!isForwardOne && !isCancelAllowed) {
    return { success: false, error: `Không thể chuyển từ ${current?.order_status || 'UNKNOWN'} → ${newStatus}` }
  }
  
  const { error } = await supabase.from('orders').update({ order_status: newStatus }).eq('order_id', orderId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

export async function saveOrderLinesAction(orderId: string, lines: any[]) {
  const supabase = await createClient()
  
  const { data: order } = await supabase
    .from('orders').select('order_status').eq('order_id', orderId).single()
  if (!['DRAFT', 'CONFIRMED'].includes(order?.order_status || '')) {
    return { success: false, error: 'Không thể sửa đơn hàng đã xác nhận giao/đóng.' }
  }

  // 1. Fetch existing lines
  const { data: existing } = await supabase.from('order_lines').select('line_id').eq('order_id', orderId)
  const existingIds = (existing || []).map(l => l.line_id)
  
  // 2. Determine which to delete
  const incomingIds = lines.filter(l => l.line_id).map(l => l.line_id)
  const toDelete = existingIds.filter(id => !incomingIds.includes(id))
  
  if (toDelete.length > 0) {
    await supabase.from('order_lines').delete().in('line_id', toDelete)
  }
  
  // 3. Upsert lines
  const toUpsert = lines.map((l, i) => {
    const isNew = l.line_id && l.line_id.startsWith('new-')
    return {
      line_id: isNew ? undefined : l.line_id,
      order_id: orderId,
      line_no: i + 1,
      product_id: l.product_id,
      quantity: l.quantity || 0,
      unit: l.unit || 'PCS',
      due_date: l.due_date || null,
      ship_date: l.ship_date || null,
    }
  })
  
  if (toUpsert.length > 0) {
    const { error } = await supabase.from('order_lines').upsert(toUpsert)
    if (error) return { success: false, error: error.message }
  }
  
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

export async function linkWorkOrderAction(woId: string, orderId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('work_orders').update({ order_id: orderId }).eq('wo_id', woId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

export async function unlinkWorkOrderAction(woId: string, orderId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('work_orders').update({ order_id: null }).eq('wo_id', woId)
  if (error) return { success: false, error: error.message }
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

export async function createWorkOrderFromOrderAction(orderId: string): Promise<{
  success: boolean
  wo_id?: string
  wo_code?: string
  jobsCreated?: number
  stepsCreated?: number
  message?: string
  warning?: string
  error?: string
}> {
  if (!orderId) return { success: false, error: 'Mã đơn hàng không hợp lệ' }

  try {
    const supabase = await createClient()

    // 1. Fetch Order + Order Lines
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select(`
        order_id,
        order_no,
        order_status,
        company_id,
        requested_delivery,
        notes,
        order_lines (
          line_id,
          line_no,
          product_id,
          design_revision_id,
          quantity,
          due_date,
          notes,
          products:products!order_lines_product_id_fkey (
            product_id,
            product_code,
            product_name,
            product_name_internal
          )
        )
      `)
      .eq('order_id', orderId)
      .single()

    if (orderErr || !order) {
      return { success: false, error: orderErr?.message || 'Không tìm thấy đơn hàng' }
    }

    // 2. Validate Order status
    const validStatuses = ['CONFIRMED', 'IN_PRODUCTION']
    if (!validStatuses.includes(order.order_status || '')) {
      return {
        success: false,
        error: `Chỉ có thể tạo Lệnh sản xuất khi đơn hàng ở trạng thái CONFIRMED hoặc IN_PRODUCTION (Hiện tại: ${order.order_status || 'UNKNOWN'})`
      }
    }

    // 3. Idempotency: Check if a WO already exists for this order
    const { data: existingWo } = await supabase
      .from('work_orders')
      .select('wo_id, wo_code')
      .eq('order_id', orderId)
      .limit(1)
      .maybeSingle()

    if (existingWo) {
      return {
        success: false,
        error: `Đơn hàng này đã có Lệnh sản xuất liên kết (${existingWo.wo_code}). Không thể tạo trùng lặp.`
      }
    }

    // 4. Resolve Product, Design Revision, Deadline, and WO Name
    const lines = (order.order_lines || []).sort((a: any, b: any) => (a.line_no || 0) - (b.line_no || 0))
    const primaryLine = lines.find((l: any) => l.product_id) || lines[0]

    const resolvedProductId = primaryLine?.product_id || null
    let resolvedRevisionId = primaryLine?.design_revision_id || null

    if (resolvedProductId && !resolvedRevisionId) {
      const { data: rev } = await supabase
        .from('design_revisions')
        .select('revision_id')
        .eq('product_id', resolvedProductId)
        .order('revision_number', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (rev) resolvedRevisionId = rev.revision_id
    }

    const resolvedDeadline = primaryLine?.due_date || order.requested_delivery || null
    const prod = primaryLine?.products as any
    const prodLabel = prod?.product_name_internal || prod?.product_name || prod?.product_code || ''
    const wo_name = prodLabel
      ? `受注製造: ${order.order_no} - ${prodLabel}`
      : `受注製造: ${order.order_no}`

    // 5. Generate unique wo_code
    let wo_code: string | null = null
    const { data: codeData, error: codeErr } = await supabase.rpc('generate_wo_code' as any)
    if (!codeErr && codeData) {
      wo_code = codeData as string
    } else {
      const currentYear = new Date().getFullYear()
      const randSeq = Math.floor(100000 + Math.random() * 900000)
      wo_code = `WO-${currentYear}-${randSeq}`
    }

    // 6. Insert new work_orders record
    const { data: newWo, error: insertErr } = await supabase
      .from('work_orders')
      .insert({
        wo_code,
        wo_name,
        order_id: orderId,
        product_id: resolvedProductId,
        design_revision_id: resolvedRevisionId,
        company_id: order.company_id,
        wo_type: 'NEW_SET',
        wo_status: 'PLANNED',
        start_date: new Date().toISOString().slice(0, 10),
        deadline: resolvedDeadline,
        priority: 5,
        notes: `Tự động tạo từ Đơn hàng ${order.order_no}${order.notes ? ` (${order.notes})` : ''}`
      })
      .select('wo_id, wo_code')
      .single()

    if (insertErr || !newWo) {
      return { success: false, error: `Lỗi tạo Lệnh sản xuất: ${insertErr?.message || 'Không thể tạo bản ghi'}` }
    }

    // 7. Auto-generate Jobs & Steps via generateJobsForWorkOrder
    const { generateJobsForWorkOrder } = await import('@/app/production/work-orders/actions')
    const jobsResult = await generateJobsForWorkOrder(newWo.wo_id)

    // 8. Path Revalidation
    revalidatePath(`/orders/${orderId}`)
    revalidatePath('/production/work-orders')
    revalidatePath('/equipment/jobs')

    if (jobsResult.error) {
      return {
        success: true,
        wo_id: newWo.wo_id,
        wo_code: newWo.wo_code,
        jobsCreated: 0,
        stepsCreated: 0,
        warning: `Lệnh sản xuất ${newWo.wo_code} đã được tạo thành công, nhưng chưa thể tự sinh Jobs do: ${jobsResult.error}`,
        message: `Đã tạo Lệnh SX ${newWo.wo_code}. (Lưu ý: ${jobsResult.error})`
      }
    }

    return {
      success: true,
      wo_id: newWo.wo_id,
      wo_code: newWo.wo_code,
      jobsCreated: jobsResult.jobsCreated || 0,
      stepsCreated: jobsResult.stepsCreated || 0,
      message: `Đã tạo thành công Lệnh SX ${newWo.wo_code} kèm ${jobsResult.jobsCreated || 0} Jobs và ${jobsResult.stepsCreated || 0} Steps gia công!`
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi hệ thống không xác định'
    console.error('createWorkOrderFromOrderAction error:', err)
    return { success: false, error: msg }
  }
}

