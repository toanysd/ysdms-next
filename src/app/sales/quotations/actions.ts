'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createQuotationAction(formData: FormData, lines: any[]) {
  const supabase = await createClient()

  // 1. Get user (for created_by if needed)
  const { data: { user } } = await supabase.auth.getUser()

  // 2. Parse form
  const company_id = formData.get('company_id') as string
  const case_id = formData.get('case_id') as string || null
  const quotation_type = formData.get('quotation_type') as string
  const quote_date = formData.get('quote_date') as string
  const valid_until = formData.get('valid_until') as string || null
  const notes = formData.get('notes') as string || null

  if (!company_id || !quotation_type || !quote_date) {
    return { success: false, error: 'Missing required fields' }
  }

  // Auto calculate total
  const total_amount = lines.reduce((acc, line) => {
    return acc + (Number(line.quantity) || 0) * (Number(line.unit_price) || 0)
  }, 0)

  // Generate quotation_no (dummy format: QUO-YYMMDD-XXXX)
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '')
  const randomStr = Math.floor(1000 + Math.random() * 9000)
  const quotation_no = `QUO-${dateStr}-${randomStr}`

  // 3. Insert header
  const { data: quote, error: quoteError } = await supabase
    .from('quotations')
    .insert({
      quotation_no,
      company_id,
      case_id,
      quotation_type,
      quote_date,
      valid_until,
      notes,
      total_amount,
      status: 'DRAFT',
      prepared_by: user?.id || null
    })
    .select('quotation_id')
    .single()

  if (quoteError || !quote) {
    return { success: false, error: quoteError?.message || 'Failed to create quotation' }
  }

  // 4. Insert lines if any
  if (lines.length > 0) {
    const linesToInsert = lines.map((line, index) => ({
      quotation_id: quote.quotation_id,
      line_no: index + 1,
      item_type: line.item_type || 'OTHER',
      description: line.description,
      quantity: Number(line.quantity) || 0,
      unit_price: Number(line.unit_price) || 0,
      amount: (Number(line.quantity) || 0) * (Number(line.unit_price) || 0)
    }))

    const { error: linesError } = await supabase
      .from('quotation_lines')
      .insert(linesToInsert)

    if (linesError) {
      return { success: false, error: linesError.message }
    }
  }

  revalidatePath('/sales/quotations')
  return { success: true, data: { quotation_id: quote.quotation_id } }
}
