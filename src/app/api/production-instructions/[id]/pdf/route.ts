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
      orders(order_no),
      products(product_id, product_code, product_name),
      companies(company_name, company_code),
      delivery_sites(site_name, site_address, contact_person, site_tel)
    `)
    .eq('id', id)
    .single()

  if (!pi) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const buffer = await renderToBuffer(
    React.createElement(ProductionInstructionPDF as React.ComponentType<any>, { pi })
  )

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${pi.instruction_no}.pdf"`,
    },
  })
}
