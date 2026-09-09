import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { QuotationPDF, QuotationPDFLine } from '@/components/pdf/QuotationPDF'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import React from 'react'

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await Promise.resolve(props.params)
    const quotationId = params.id
    const supabase = createServerSupabaseClient() as SupabaseClient

    // 1. Fetch quotation + companies + employees + quotation_lines (with products and design_revisions)
    const { data: quote, error } = await supabase
      .from('quotations')
      .select(`
        *,
        companies:companies!quotations_company_id_fkey (company_name),
        employees:employees!quotations_prepared_by_fkey (employee_name),
        quotation_lines (
          *,
          products:products!quotation_lines_product_id_fkey (
            product_code, product_name, external_length_mm, external_width_mm
          ),
          design_revisions:design_revisions!quotation_lines_design_revision_id_fkey (
            design_code, plastic_type_designed
          )
        )
      `)
      .eq('quotation_id', quotationId)
      .single()

    if (error || !quote) {
      console.error('[Quotation PDF API] Not found or error:', error)
      return NextResponse.json(
        { error: 'Quotation not found: ' + (error?.message || '') },
        { status: 404 }
      )
    }

    // 2. Sort and map lines for PDF formatting
    const rawLines = Array.isArray(quote.quotation_lines) ? quote.quotation_lines : []
    rawLines.sort((a: any, b: any) => (a.line_no || 0) - (b.line_no || 0))

    const formattedLines: QuotationPDFLine[] = rawLines.map((l: any, idx: number) => {
      const productCode = l.products?.product_code || null
      const productName = l.products?.product_name || null
      const modelCode = l.model_code || productCode || null

      let desc = l.description
      if (!desc && productName) {
        desc = productName
      }

      return {
        line_no: l.line_no || idx + 1,
        model_code: modelCode,
        description: desc,
        quantity: l.quantity,
        quantity_text: l.quantity_text,
        unit_price: l.unit_price,
        amount: l.amount,
        plastic_type_designed: l.design_revisions?.plastic_type_designed || null,
        design_code: l.design_revisions?.design_code || null,
        external_length_mm: l.products?.external_length_mm || null,
        external_width_mm: l.products?.external_width_mm || null,
      }
    })

    const pdfPayload = {
      ...quote,
      companies: quote.companies,
      employees: quote.employees,
      prepared_by_name: quote.employees?.employee_name || null,
      quotation_lines: formattedLines,
    }

    // 3. Render PDF Buffer using @react-pdf/renderer
    const buffer = await renderToBuffer(
      React.createElement(QuotationPDF as React.ComponentType<any>, { data: pdfPayload })
    )

    const filename = `${quote.quotation_no || 'Quotation'}_Rev${quote.revision_no || 1}.pdf`

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (err: unknown) {
    const errorText = err instanceof Error ? err.message : 'Internal PDF render error'
    console.error('[Quotation PDF API] Exception:', err)
    return NextResponse.json({ error: errorText }, { status: 500 })
  }
}
