import React from 'react'
import { createClient } from '@/lib/supabase/server'
import ShipmentPrintClient from './_components/ShipmentPrintClient'
import { notFound } from 'next/navigation'

export default async function ShipmentPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch shipment with all related data
  const { data: shipment, error } = await supabase
    .from('shipments')
    .select(`
      *,
      orders (
        order_id,
        order_no,
        customer_order_no,
        companies (
          company_code,
          company_name,
          address,
          tel
        )
      ),
      delivery_sites (
        site_id,
        site_code,
        site_name,
        contact_person,
        site_address,
        site_tel
      ),
      shipment_lots (
        shipment_lot_id,
        qty_shipped,
        carton_count,
        notes,
        production_lots (
          lot_no,
          production_orders (
            order_lines (
              unit,
              products (
                product_code,
                product_name,
                customer_product_name,
                pieces_per_box
              )
            )
          )
        )
      )
    `)
    .eq('shipment_id', id)
    .single()

  if (error || !shipment) {
    console.error('Failed to fetch shipment:', error)
    return notFound()
  }

  return <ShipmentPrintClient initialData={shipment} />
}
