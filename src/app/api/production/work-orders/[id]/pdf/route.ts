import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderToBuffer } from '@react-pdf/renderer'
import React from 'react'
import QRCode from 'qrcode'
import { WorkOrderPDFDocument } from '@/components/pdf/WorkOrderPDFDocument'
import type { WOEquipmentSetResult } from '@/app/production/work-orders/types'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: woId } = await params
    const supabase = await createClient()

    // 1. Fetch Work Order detail
    const { data: woData, error: woError } = await supabase
      .from('work_orders')
      .select(`
        wo_id,
        wo_code,
        wo_name,
        wo_type,
        wo_status,
        start_date,
        deadline,
        notes,
        companies:companies!work_orders_company_id_fkey (company_name),
        products:products!work_orders_product_id_fkey (product_code, product_name),
        responsible:employees!work_orders_responsible_id_fkey (full_name)
      `)
      .eq('wo_id', woId)
      .single()

    if (woError || !woData) {
      return new NextResponse('Work Order not found', { status: 404 })
    }

    // 2. Fetch resolved equipment SET via RPC
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('fn_get_wo_equipment_set', { p_wo_id: woId })

    if (rpcError || !rpcData) {
      return new NextResponse(`Error fetching equipment set: ${rpcError?.message || 'Empty response'}`, { status: 500 })
    }

    const equipmentSet = rpcData as unknown as WOEquipmentSetResult

    // 3. Generate QR codes for all equipment in SET (and the WO itself)
    const qrCodes: Record<string, string> = {}

    // QR for WO
    const origin = req.nextUrl.origin || 'https://ysdms.yoshidamold.co.jp'
    qrCodes[woData.wo_code] = await QRCode.toDataURL(`${origin}/production/work-orders/${woId}`, {
      width: 120,
      margin: 1,
    })

    // QR for primary mold
    if (equipmentSet.primary_mold) {
      const moldCode = equipmentSet.primary_mold.equipment_code
      qrCodes[equipmentSet.primary_mold.equipment_id] = await QRCode.toDataURL(
        `${origin}/equipment/scan?find=${encodeURIComponent(moldCode)}`,
        { width: 120, margin: 1 }
      )
    }

    // QR for each set member
    if (equipmentSet.set_members && equipmentSet.set_members.length > 0) {
      for (const item of equipmentSet.set_members) {
        qrCodes[item.equipment_id] = await QRCode.toDataURL(
          `${origin}/equipment/scan?find=${encodeURIComponent(item.equipment_code)}`,
          { width: 120, margin: 1 }
        )
      }
    }

    // 4. Format WO header data
    const comp = Array.isArray(woData.companies) ? woData.companies[0] : woData.companies
    const prod = Array.isArray(woData.products) ? woData.products[0] : woData.products
    const resp = Array.isArray(woData.responsible) ? woData.responsible[0] : woData.responsible

    const formattedWo = {
      wo_id: woData.wo_id,
      wo_code: woData.wo_code,
      wo_name: woData.wo_name,
      wo_type: woData.wo_type,
      wo_status: woData.wo_status,
      start_date: woData.start_date,
      deadline: woData.deadline,
      company_name: comp?.company_name || null,
      product_code: prod?.product_code || null,
      product_name: prod?.product_name || null,
      responsible_name: resp?.employee_name || null,
      notes: woData.notes || null,
    }

    // 5. Render to buffer
    const buffer = await renderToBuffer(
      React.createElement(WorkOrderPDFDocument, {
        wo: formattedWo,
        equipmentSet,
        qrCodes,
      }) as any
    )

    const filename = `工程指示票_${woData.wo_code}.pdf`

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (err: unknown) {
    console.error('Error generating Work Order PDF:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return new NextResponse(`Error generating PDF: ${msg}`, { status: 500 })
  }
}
