import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { ShipmentPDFDocument } from '@/app/orders/shipments/_components/ShipmentPDFDocument'
import React from 'react'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch shipment details
  const { data: shipment, error: sErr } = await supabase
    .from('shipments')
    .select(`
      shipment_id, delivery_note_no, ship_date, status,
      delivery_method, tracking_no, invoice_no, shipment_type, notes,
      orders:orders!shipments_order_id_fkey (
        order_id, order_no, order_date,
        companies:companies!orders_company_id_fkey ( company_name, company_code )
      ),
      delivery_sites:delivery_sites!shipments_delivery_site_id_fkey ( site_id, site_name, site_address, site_tel ),
      employees:employees!shipments_shipped_by_fkey ( employee_name )
    `)
    .eq('shipment_id', id)
    .single()

  if (sErr || !shipment) {
    return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
  }

  // 2. Fetch order lines for this shipment's order
  let orderLines: any[] = []
  if (shipment.orders?.order_id) {
    const { data: lines } = await supabase
      .from('order_lines')
      .select(`
        line_id, line_no, quantity, unit, box_type, packing_style, line_status,
        products:products!order_lines_product_id_fkey ( product_id, product_code, product_name )
      `)
      .eq('order_id', shipment.orders.order_id)
      .order('line_no', { ascending: true })

    if (lines) orderLines = lines
  }

  const buffer = await renderToBuffer(
    React.createElement(ShipmentPDFDocument as React.ComponentType<any>, {
      shipment,
      orderLines,
    })
  )

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${shipment.delivery_note_no || 'delivery_note'}.pdf"`,
    },
  })
}
