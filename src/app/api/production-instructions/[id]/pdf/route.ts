import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { ProductionInstructionPDF } from '@/app/production-instructions/_components/ProductionInstructionPDF'
import React from 'react'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { data: pi } = await supabase
    .from('production_instructions')
    .select(`
      *,
      orders(order_no),
      products(product_code, product_name, drawing_no),
      companies(name, code),
      delivery_sites(site_name, address, contact_person, phone)
    `)
    .eq('id', params.id)
    .single()

  if (!pi) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const buffer = await renderToBuffer(
    React.createElement(ProductionInstructionPDF, { pi })
  )

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${pi.instruction_no}.pdf"`,
    },
  })
}
