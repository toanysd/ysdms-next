import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { QuotationPDFDocument } from '@/app/orders/quotations/_components/QuotationPDFDocument'
import React from 'react'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch quotation header with customer and employee relations
  const { data: quotation, error: qErr } = await supabase
    .from('quotations')
    .select(`
      quotation_id, quotation_no, quote_date, valid_until,
      status, quotation_type, total_amount, notes,
      company_id, prepared_by, extra_json,
      companies ( company_id, company_name, company_code, tel, address ),
      employees:employees!quotations_prepared_by_fkey ( employee_id, employee_name )
    `)
    .eq('quotation_id', id)
    .single()

  if (qErr || !quotation) {
    return NextResponse.json({ error: 'Quotation not found' }, { status: 404 })
  }

  // 2. Fetch quotation lines
  const { data: lines } = await supabase
    .from('quotation_lines')
    .select('*')
    .eq('quotation_id', id)
    .order('line_no', { ascending: true })

  const buffer = await renderToBuffer(
    React.createElement(QuotationPDFDocument as React.ComponentType<any>, {
      quotation,
      lines: lines || [],
    })
  )

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${quotation.quotation_no || 'quotation'}.pdf"`,
    },
  })
}
