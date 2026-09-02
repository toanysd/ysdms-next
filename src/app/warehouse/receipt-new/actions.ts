'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReceiptAction(header: any, rolls: any[]) {
  const supabase = await createClient()

  // 1. Validate inputs
  if (!header.receipt_no || !header.receipt_date) {
    return { error: 'Thiếu thông tin bắt buộc trên phiếu' }
  }
  if (rolls.length === 0) {
    return { error: 'Cần ít nhất 1 cuộn nhựa' }
  }

  // Check unique barcodes
  const barcodes = rolls.map(r => r.roll_barcode).filter(Boolean)
  const { data: existingRolls } = await supabase
    .from('plastic_receipt_roll')
    .select('roll_barcode')
    .in('roll_barcode', barcodes)

  if (existingRolls && existingRolls.length > 0) {
    return { error: `Mã Barcode đã tồn tại trong hệ thống: ${existingRolls.map(e => e.roll_barcode).join(', ')}` }
  }

  // 2. Insert receipt
  const { data: receipt, error: receiptErr } = (await supabase
    .from('plastic_receipt')
    ['insert']({
receipt_no: header.receipt_no,
      receipt_date: header.receipt_date,
      supplier_id: header.supplier_id || null,
      invoice_no: header.invoice_no || null,
      note: header.note || null
    } as any)
    .select('id')
    .single()) as any

  if (receiptErr) {
    console.error('Error insert receipt', receiptErr)
    return { error: `Lỗi tạo phiếu nhập: ${receiptErr.message}` }
  }

  // 3. Insert rolls
  const rollsToInsert = rolls.map(r => ({
    receipt_id: receipt.id,
    plastic_id: r.plastic_id,
    roll_barcode: r.roll_barcode,
    nominal_length_m: r.nominal_length_m,
    received_length_m: r.nominal_length_m,
    current_length_m: r.nominal_length_m,
    status: 'in_stock',
    location: r.location || null
  }))

  const { error: rollsErr } = await supabase
    .from('plastic_receipt_roll')
    .insert(rollsToInsert)

  if (rollsErr) {
    console.error('Error insert rolls', rollsErr)
    // Rollback receipt since rolls failed
    await supabase.from('plastic_receipt').delete().eq('id', receipt.id)
    return { error: `Lỗi lưu danh sách cuộn: ${rollsErr.message}. Đã rollback phiếu nhập.` }
  }

  // 4. Success
  revalidatePath('/warehouse/rolls')
  return { success: true, receiptId: receipt.id }
}
