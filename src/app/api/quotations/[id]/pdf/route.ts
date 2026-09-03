import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { QuotationPDF } from '@/components/pdf/QuotationPDF'
import { createClient } from '@/lib/supabase/server'
import React from 'react'

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params
  const supabase = await createClient()

  // Fetch quotation + lines + company
  const { data: quote, error } = await supabase
    .from('quotations')
    .select(`
      *, 
      companies(company_name),
      quotation_lines(*)
    `)
    .eq('quotation_id', params.id)
    .single()

  if (error || !quote) {
    return NextResponse.json({ error: 'Quotation not found' }, { status: 404 })
  }

  // Sort lines by line_no
  if (quote.quotation_lines && Array.isArray(quote.quotation_lines)) {
    quote.quotation_lines.sort((a: any, b: any) => (a.line_no || 0) - (b.line_no || 0))
  }

  const buffer = await renderToBuffer(
    React.createElement(QuotationPDF as React.ComponentType<any>, { data: quote })
  )

  const filename = `${quote.quotation_no}_Rev${quote.revision_no || 1}.pdf`

  return new NextResponse(buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
