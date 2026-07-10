import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import ExcelJS from 'exceljs'
import path from 'path'
import fs from 'fs'

// Helper to parse material notes
function parseMaterialNotes(notes: string | null) {
  if (!notes) return { material: '', thickness: '', width: '', staticCharge: '無', silicone: '無', coating: '無' }
  const matMatch = notes.match(/(PS|PP|PET|A-PET|PVC)/i)
  const material = matMatch ? matMatch[0] : ''
  const colorMatch = notes.match(/(黒|白|透明|クリア|ナチュラル|乳白)/)
  const color = colorMatch ? colorMatch[0] : ''
  const thickMatch = notes.match(/(\d+(?:\.\d+)?)\s*(?:㎜|mm|t)/i)
  const thickness = thickMatch ? thickMatch[1] : ''
  const widthMatch = notes.match(/(?:【|\[)(\d+)(?:】|\])/) || notes.match(/(\d+)\s*(?:w|巾)/i)
  const width = widthMatch ? widthMatch[1] : ''
  
  const antistatic = (notes.includes('導電') || notes.includes('帯電') || notes.includes('静電')) ? '帯電防止' : '無'
  const silicone = (notes.includes('シリコン') || notes.includes('ｼﾘｺﾝ')) ? '有' : '無'
  const coating = notes.includes('塗布') ? '有' : '無'

  return {
    material: material + (color ? `(${color})` : ''),
    thickness,
    width,
    staticCharge: antistatic,
    silicone,
    coating
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id: orderId } = await params

  try {
    // 1. Fetch order + lines + products + material_specs
    const { data: order, error } = await (supabase as any)
      .from('orders')
      .select(`
        *,
        companies ( company_code, company_name, address, tel ),
        order_lines (
          *,
          products ( product_id, product_code, product_name, product_name_internal, customer_product_name, pocket_count, notes ),
          product_material_specs ( material_type, material_grade, thickness_mm, sheet_width_mm, static_charge, silicone, coating )
        )
      `)
      .eq('order_id', orderId)
      .single()

    if (error || !order) {
      console.error('Order fetch error:', error)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const lines = order.order_lines || []

    // 2. Fetch design_revisions, order by created_at DESC to get the latest one
    const productIds = lines.map((l: any) => l.products?.product_id).filter(Boolean)
    const designMap: Record<string, any> = {}
    if (productIds.length > 0) {
      const { data: revs } = await (supabase as any)
        .from('design_revisions')
        .select('product_id, design_code, cutline_length, cutline_width, cavity_count, design_weight, plastic_type_designed, legacy_specs, created_at')
        .in('product_id', productIds)
        .order('created_at', { ascending: false })

      if (revs) {
        revs.forEach((r: any) => {
          if (!designMap[r.product_id]) designMap[r.product_id] = r
        })
      }
    }

    // 3. Fetch delivery_sites
    const siteIds = lines.map((l: any) => l.delivery_site_id).filter(Boolean)
    const siteMap: Record<string, any> = {}
    if (siteIds.length > 0) {
      const { data: sites } = await (supabase as any)
        .from('delivery_sites')
        .select('site_id, site_code, site_name, contact_person, site_address, site_tel')
        .in('site_id', [...new Set(siteIds)])

      if (sites) {
        sites.forEach((s: any) => { siteMap[s.site_id] = s })
      }
    }

    // 4. Load Template
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'order_template.xlsx')
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ error: 'Template not found' }, { status: 500 })
    }

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(templatePath)
    const sheet = workbook.worksheets[0]

    // 5. Fill Header
    if (order.order_date) {
      sheet.getCell('J11').value = new Date(order.order_date).toLocaleDateString('ja-JP')
    }
    sheet.getCell('J9').value = order.order_no || ''

    // 6. Fill Delivery Site
    const line1 = lines[0]
    const site = line1 ? siteMap[line1.delivery_site_id] : null
    if (site) {
      sheet.getCell('B42').value = site.site_code || ''
      sheet.getCell('A43').value = site.site_name || ''
      sheet.getCell('A44').value = site.contact_person ? `${site.contact_person} 様宛` : ''
      sheet.getCell('A45').value = site.site_address || ''
      sheet.getCell('A47').value = site.site_tel ? `TEL: ${site.site_tel}` : ''
    }

    // 7. Fill Request Source
    if (order.companies) {
      sheet.getCell('H45').value = order.companies.company_code || ''
      sheet.getCell('H46').value = order.companies.company_name || ''
    }

    // 8. Fill Order Lines helper
    function fillLine(line: any, startRow: number) {
      const rev = designMap[line.products?.product_id]
      const spec = line.product_material_specs

      const name = line.products?.product_name || ''
      const customerName = line.products?.customer_product_name || ''
      const pockets = line.products?.pocket_count ? `${line.products.pocket_count}P` : ''
      const pnDisplay = [name, customerName, pockets].filter(Boolean).join(' ')

      sheet.getCell(`A${startRow}`).value = order.customer_order_no || ''
      sheet.getCell(`B${startRow}`).value = pnDisplay
      sheet.getCell(`H${startRow}`).value = line.quantity || 0
      sheet.getCell(`I${startRow}`).value = line.notes || 'LT'
      sheet.getCell(`K${startRow}`).value = line.due_date ? new Date(line.due_date).toLocaleDateString('ja-JP') : ''
      sheet.getCell(`B${startRow + 1}`).value = line.products?.product_name || ''

      // Material
      const matRow = startRow + 3
      let matInfo = { material: '', thickness: '', width: '', staticCharge: '無', silicone: '無', coating: '無' }
      
      if (spec) {
        matInfo = {
          material: [spec.material_type, spec.material_grade ? `(${spec.material_grade})` : ''].filter(Boolean).join(''),
          thickness: spec.thickness_mm != null ? String(spec.thickness_mm) : '',
          width: spec.sheet_width_mm != null ? String(spec.sheet_width_mm) : '',
          staticCharge: spec.static_charge || '無',
          silicone: spec.silicone || '無',
          coating: spec.coating || '無',
        }
      } else {
        // Parse from notes
        matInfo = parseMaterialNotes(line.products?.notes)
      }

      sheet.getCell(`B${matRow}`).value = matInfo.material
      sheet.getCell(`C${matRow}`).value = matInfo.thickness
      sheet.getCell(`D${matRow}`).value = matInfo.width
      sheet.getCell(`E${matRow}`).value = matInfo.staticCharge
      sheet.getCell(`F${matRow}`).value = matInfo.silicone
      sheet.getCell(`G${matRow}`).value = matInfo.coating
    }

    // Line 1
    if (lines.length > 0) {
      fillLine(lines[0], 17)

      const rev1 = designMap[lines[0].products?.product_id]
      if (rev1) {
        sheet.getCell('I39').value = rev1.cutline_width || ''
        sheet.getCell('K39').value = rev1.cutline_length || ''
      }
    }

    // Line 2
    if (lines.length > 1) {
      fillLine(lines[1], 23)
    }

    // 9. Notes
    if (order.notes) {
      sheet.getCell('A30').value = order.notes
    }

    // 10. Generate & return
    const buffer = await workbook.xlsx.writeBuffer()
    const filename = `Order_${order.order_no || orderId}.xlsx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`
      }
    })

  } catch (err: any) {
    console.error('Export Excel Error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
