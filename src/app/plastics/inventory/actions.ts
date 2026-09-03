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

export interface ConsumeRollInput {
  roll_id: string
  consumed_m: number
  consumed_at?: string
  wo_id?: string
  wo_code?: string
  operator_name?: string
  note?: string
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
  const barcodes = input.rolls.map((r) => r.roll_barcode.trim())
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
      note: input.note ? input.note.trim() : input.supplier_name ? `仕入先: ${input.supplier_name.trim()}` : null,
    })
    .select('id')
    .single()

  if (rErr || !receipt) {
    return { success: false, error: `入荷伝票の登録に失敗しました: ${rErr?.message}` }
  }

  // 4. Insert plastic_receipt_roll (N rows)
  const rollsToInsert = input.rolls.map((r) => ({
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

  const { error: rollErr } = await supabase.from('plastic_receipt_roll').insert(rollsToInsert)

  if (rollErr) {
    return { success: false, error: `ロール明細の登録に失敗しました: ${rollErr.message}` }
  }

  revalidatePath('/plastics/inventory')
  return { success: true, receipt_id: receipt.id }
}

export async function consumePlasticRollAction(input: ConsumeRollInput) {
  const supabase = await createClient()

  if (!input.roll_id) {
    return { success: false, error: 'ロールを選択してください。' }
  }
  if (!input.consumed_m || input.consumed_m <= 0) {
    return { success: false, error: '消費量は0mより大きい数値を指定してください。' }
  }

  // 1. Fetch current roll
  const { data: roll, error: rErr } = await supabase
    .from('plastic_receipt_roll')
    .select('id, roll_barcode, plastic_id, current_length_m, status')
    .eq('id', input.roll_id)
    .single()

  if (rErr || !roll) {
    return { success: false, error: 'ロールが見つかりませんでした。' }
  }

  if (input.consumed_m > (roll.current_length_m || 0)) {
    return {
      success: false,
      error: `消費量(${input.consumed_m}m)が現在残量(${roll.current_length_m || 0}m)を超えています。`,
    }
  }

  const newLength = Math.max(0, (roll.current_length_m || 0) - input.consumed_m)
  const newStatus = newLength <= 0 ? 'empty' : 'in_use'

  // 2. Update plastic_receipt_roll
  const { error: updateErr } = await supabase
    .from('plastic_receipt_roll')
    .update({
      current_length_m: newLength,
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('id', roll.id)

  if (updateErr) {
    return { success: false, error: `ロール残量の更新に失敗しました: ${updateErr.message}` }
  }

  // 3. Insert into plastic_adjustment_log
  const logNote = input.wo_code
    ? `製造消費 [WO: ${input.wo_code}]${input.note ? ` - ${input.note}` : ''}`
    : input.note || '現場手動消費記録'

  const { error: logErr } = await supabase.from('plastic_adjustment_log').insert({
    roll_id: roll.id,
    change_length_m: -input.consumed_m,
    action_type: 'PRODUCTION',
    note: logNote,
    operator_name: input.operator_name || null,
    created_at: input.consumed_at || new Date().toISOString(),
  })

  if (logErr) {
    console.error('plastic_adjustment_log insert error:', logErr)
  }

  // Also attempt to log into material_consumption_logs if constraints allow
  try {
    await supabase.from('material_consumption_logs').insert({
      material_id: roll.plastic_id,
      consumed_qty: input.consumed_m,
      unit: 'm',
      consumed_at: input.consumed_at || new Date().toISOString(),
      notes: logNote,
      work_order_id: input.wo_id || null,
      roll_id: roll.id,
    } as any)
  } catch (e) {
    // Gracefully ignore if pending migration
  }

  revalidatePath('/plastics/inventory')
  revalidatePath('/dashboard')
  return { success: true, newLength, newStatus }
}

export async function getRollConsumptionHistoryAction(rollId: string) {
  const supabase = await createClient()
  const { data: logs, error } = await supabase
    .from('plastic_adjustment_log')
    .select('id, change_length_m, action_type, note, operator_name, created_at')
    .eq('roll_id', rollId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getRollConsumptionHistoryAction error:', error)
    return []
  }
  return logs || []
}
