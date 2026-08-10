import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { ProductionInstructionPDF } from '@/app/production-instructions/_components/ProductionInstructionPDF'
import React from 'react'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: pi } = await supabase
    .from('production_instructions')
    .select(`
      *,
      orders(order_no, companies(company_name, company_code)),
      products(
        product_id, product_code, product_name,
        design_revisions(
          revision_id, revision_number, customer_drawing_no, cutline_length, cutline_width,
          cavity_count, chamfer_c, has_separate_cutter, tolerance_pitch, setup_type, drawing_pdf_path,
          gas_pressure
        )
      ),
      delivery_sites(site_name, site_address, contact_person, site_tel),
      physical_molds(physical_mold_id, system_code, display_name),
      production_instruction_tags(
        tag_code,
        custom_label,
        production_tag_master(label_ja, label_vi, priority, print_style)
      )
    `)
    .eq('id', id)
    .single()

  if (!pi) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Find the selected/latest design revision to pass to the component
  const designRevisions = (pi.products as any)?.design_revisions || []
  const selectedRevision = pi.design_revision_id
    ? designRevisions.find((r: any) => r.revision_id === pi.design_revision_id)
    : (designRevisions.length > 0
        ? designRevisions.sort((a: any, b: any) => (b.revision_number || 0) - (a.revision_number || 0))[0]
        : null)

  const buffer = await renderToBuffer(
    React.createElement(ProductionInstructionPDF as React.ComponentType<any>, { 
      pi,
      revision: selectedRevision 
    })
  )

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${pi.instruction_no}.pdf"`,
    },
  })
}
