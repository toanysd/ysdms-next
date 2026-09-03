'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitOutgoingQCAction(formData: FormData) {
  const supabase = await createClient()
  const orderLineId = formData.get('order_line_id') as string
  const inspectorId = formData.get('inspector_id') as string
  const qtySubmitted = parseInt(formData.get('qty_submitted') as string)
  const qtyPass = parseInt(formData.get('qty_pass') as string)
  const qtyNg = Math.max(0, qtySubmitted - qtyPass)
  const result = qtyNg === 0 ? 'PASS' : 'FAIL'
  const measurementData = formData.get('measurement_data') as string
  const customerFormRef = formData.get('customer_form_ref') as string
  const notes = formData.get('notes') as string

  // 1. Insert QC record
  const { error: qcError } = await supabase.from('outgoing_qc_records').insert({
    order_line_id: orderLineId,
    inspector_id: inspectorId,
    qty_submitted: qtySubmitted,
    qty_pass: qtyPass,
    qty_ng: qtyNg,
    result,
    measurement_data: measurementData ? JSON.parse(measurementData) : null,
    customer_form_ref: customerFormRef || null,
    notes: notes || null
  })
  if (qcError) return { success: false, error: qcError.message }

  // 2. Auto-update order_lines.line_status
  const newLineStatus = result === 'PASS' ? 'READY_TO_SHIP' : 'QC_FAILED'
  await supabase.from('order_lines')
    .update({ line_status: newLineStatus })
    .eq('line_id', orderLineId)

  revalidatePath('/production/qc')
  revalidatePath('/orders/shipments')
  return { success: true, result }
}
