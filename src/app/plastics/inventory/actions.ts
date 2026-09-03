'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface RollInput {
  roll_barcode: string
  plastic_id: string
  received_length_m: number
  lot_no?: string
  location?: string
}

export interface CreateReceiptInput {
  receipt_no: string
  receipt_date: string
  supplier_name?: string
  note?: string
  rolls: RollInput[]
}

export async function createPlasticReceiptAction(input: CreateReceiptInput) {
  const supabase = await createClient()

  // 1. Validation
  if (!input.receipt_no || !input.receipt_no.trim()) {
    return { success: false, error: '納品書No・入荷番号を入力してください。' }
  }
  if (!input.rolls || input.rolls.length === 0) {
    return { success: false, error: '少なくとも1本のロールを追加してください。' }
  }

  for (const r of input.rolls) {
    if (!r.roll_barcode || !r.roll_barcode.trim()) {
      return { success: false, error: 'すべてのロールにバーコードを入力してください。' }
    }
    if (!r.plastic_id) {
      return { success: false, error: '規格・材質を選択してください。' }
    }
    if (!r.received_length_m || r.received_length_m <= 0) {
      return { success: false, error: '受入長さ(m)は0より大きい数値を入力してください。' }
    }
  }

  // 2. Barcode Uniqueness check (Idempotency)
  const barcodes = input.rolls.map(r => r.roll_barcode.trim())
  const { data: existingRolls, error: checkErr } = await supabase
    .from('plastic_receipt_roll')
    .select('roll_barcode')
    .in('roll_barcode', barcodes)

  if (checkErr) {
    return { success: false, error: `バーコードの重複確認中にエラー: ${checkErr.message}` }
  }

  if (existingRolls && existingRolls.length > 0) {
    const dupes = existingRolls.map((r: any) => r.roll_barcode).join(', ')
    return { success: false, error: `以下のバーコードは既に登録されています: ${dupes}` }
  }

  // 3. Insert plastic_receipt
  const { data: receipt, error: rErr } = await supabase
    .from('plastic_receipt')
    .insert({
      receipt_no: input.receipt_no.trim(),
      receipt_date: input.receipt_date || new Date().toISOString().split('T')[0],
      note: input.note ? input.note.trim() : (input.supplier_name ? `仕入先: ${input.supplier_name.trim()}` : null),
    })
    .select('id')
    .single()

  if (rErr || !receipt) {
    return { success: false, error: `入荷伝票の登録に失敗しました: ${rErr?.message}` }
  }

  // 4. Insert plastic_receipt_roll (N rows)
  const rollsToInsert = input.rolls.map(r => ({
    receipt_id: receipt.id,
    plastic_id: r.plastic_id,
    roll_barcode: r.roll_barcode.trim(),
    lot_no: r.lot_no ? r.lot_no.trim() : null,
    nominal_length_m: Number(r.received_length_m),
    received_length_m: Number(r.received_length_m),
    current_length_m: Number(r.received_length_m),
    status: 'in_stock',
    location: r.location || '本社',
    supplier_name: input.supplier_name ? input.supplier_name.trim() : null,
  }))

  const { error: rollErr } = await supabase
    .from('plastic_receipt_roll')
    .insert(rollsToInsert)

  if (rollErr) {
    return { success: false, error: `ロール明細の登録に失敗しました: ${rollErr.message}` }
  }

  revalidatePath('/plastics/inventory')
  return { success: true, receipt_id: receipt.id }
}
