import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import ExcelJS from 'exceljs'

export const dynamic = 'force-dynamic'

/**
 * WO-P1-007 (Gói 8) — API Xuất Dữ Liệu Kiểm Kê Form Excel Khảo Sát Cột G/H/I/J/K cho JAE / NLC
 * (貸与設備棚卸調査表)
 * Tuân thủ SSOT MOLD_CUSTODY_BUSINESS_SPEC v1.0 (Chủ đề 2)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const companyId = searchParams.get('companyId') || ''
    const scope = searchParams.get('scope') || 'ALL'
    const filterLocation = searchParams.get('location') || ''
    const filterStatus = searchParams.get('status') || ''

    // 1. Fetch Company metadata if companyId is provided
    let companyName = '全取引先 (All Partners)'
    let companyCode = 'ALL'
    if (companyId) {
      const { data: comp } = await (supabase as any)
        .from('companies')
        .select('company_id, company_name, company_code')
        .eq('company_id', companyId)
        .maybeSingle()
      
      if (comp) {
        companyName = comp.company_name
        companyCode = comp.company_code
      }
    }

    // 2. Fetch Active Loans for Cột G check
    const { data: loansData, error: loansErr } = await (supabase as any)
      .from('equipment_loans')
      .select('equipment_id, status, loan_code, loan_date, scheduled_return_date')
      .in('status', ['ACTIVE', 'DISPATCHED', 'APPROVED'])

    if (loansErr) {
      console.warn('[ExportSurvey] Warning fetching loans:', loansErr.message)
    }

    const loanMap = new Map<string, any>()
    if (loansData) {
      for (const loan of loansData) {
        loanMap.set(loan.equipment_id, loan)
      }
    }

    // 3. Query equipment items with relations
    // We paginate with range to fetch up to 3000 records safely without hitting Supabase 1000 row truncation
    const allMolds: any[] = []
    const BATCH_SIZE = 1000
    let from = 0
    let hasMore = true

    while (hasMore) {
      const to = from + BATCH_SIZE - 1
      let query: any

      if (companyId) {
        query = (supabase as any)
          .from('equipment')
          .select(`
            equipment_id,
            equipment_code,
            display_name,
            equipment_type,
            device_status,
            usage_status,
            created_at,
            updated_at,
            notes,
            legacy_specs,
            physical_stamp,
            rack_layers!current_rack_layer_id(
              id,
              layer_code,
              layer_number,
              racks(id, rack_code, rack_name, rack_code_new, zone_code, location_in_factory)
            ),
            design_revisions!inner(
              product_id,
              design_code,
              products!inner(
                product_code,
                product_name,
                product_name_internal,
                company_id,
                companies:companies!products_company_id_fkey(company_id, company_name, company_code)
              )
            )
          `)
          .in('equipment_type', ['MOLD', 'WATER_BASE', 'PRESSURE_BASE'])
          .eq('design_revisions.products.company_id', companyId)
          .order('equipment_code', { ascending: true })
          .range(from, to)
      } else {
        query = (supabase as any)
          .from('equipment')
          .select(`
            equipment_id,
            equipment_code,
            display_name,
            equipment_type,
            device_status,
            usage_status,
            created_at,
            updated_at,
            notes,
            legacy_specs,
            physical_stamp,
            rack_layers!current_rack_layer_id(
              id,
              layer_code,
              layer_number,
              racks(id, rack_code, rack_name, rack_code_new, zone_code, location_in_factory)
            ),
            design_revisions(
              product_id,
              design_code,
              products(
                product_code,
                product_name,
                product_name_internal,
                company_id,
                companies:companies!products_company_id_fkey(company_id, company_name, company_code)
              )
            )
          `)
          .in('equipment_type', ['MOLD', 'WATER_BASE', 'PRESSURE_BASE'])
          .order('equipment_code', { ascending: true })
          .range(from, to)
      }

      // Location filters
      if (filterLocation === 'ASSIGNED') {
        query = query.not('current_rack_layer_id', 'is', null)
      } else if (filterLocation === 'UNASSIGNED') {
        query = query.is('current_rack_layer_id', null)
      } else if (filterLocation.startsWith('ZONE_')) {
        const zone = filterLocation.replace('ZONE_', '')
        query = query.eq('rack_layers.racks.zone_code', zone)
      }

      if (filterStatus) {
        query = query.eq('device_status', filterStatus)
      }

      const { data, error } = await query
      if (error) {
        console.error('[ExportSurvey] Error fetching equipment:', error)
        throw error
      }

      if (data && data.length > 0) {
        allMolds.push(...data)
        if (data.length < BATCH_SIZE || allMolds.length >= 5000) {
          hasMore = false
        } else {
          from += BATCH_SIZE
        }
      } else {
        hasMore = false
      }
    }

    // 4. Construct Excel Workbook with Japanese Corporate Styling
    const workbook = new ExcelJS.Workbook()
    workbook.creator = 'YSDMS NextGen'
    workbook.lastModifiedBy = 'YSDMS NextGen'
    workbook.created = new Date()
    workbook.modified = new Date()

    const sheet = workbook.addWorksheet('貸与設備棚卸調査表', {
      views: [{ showGridLines: true }],
      pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
    })

    // Title Row
    const titleRow = sheet.addRow(['貸与設備棚卸調査表 (Fixed Asset Inventory Survey)'])
    titleRow.font = { name: 'Yu Gothic', size: 16, bold: true, color: { argb: 'FF1E3A8A' } }
    sheet.mergeCells('A1:K1')
    titleRow.height = 32
    titleRow.alignment = { vertical: 'middle' }

    // Subtitle / Metadata Row
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '/')
    const metaRow = sheet.addRow([
      `対象企業: ${companyName} (${companyCode})  |  出力日: ${todayStr}  |  対象件数: ${allMolds.length} 件  |  管理企業: 吉田金型工業株式会社`
    ])
    metaRow.font = { name: 'Yu Gothic', size: 10, color: { argb: 'FF475569' } }
    sheet.mergeCells('A2:K2')
    metaRow.height = 20
    metaRow.alignment = { vertical: 'middle' }

    // Empty separator row
    const emptyRow = sheet.addRow([])
    emptyRow.height = 10

    // Header Row (Row 4) — 11 Cột Chuẩn SSOT A - K
    const headers = [
      'No.',
      '客先資産番号',
      '設備名称・金型名',
      'YSD管理番号',
      '品名・製品型番',
      '数量',
      '貸出書の有無',
      '金型の有無',
      '保管場所',
      '稼働状況',
      '最終使用日・今後の見通し'
    ]

    const headerRow = sheet.addRow(headers)
    headerRow.height = 28
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E3A8A' } // Navy Header
      }
      cell.font = {
        name: 'Yu Gothic',
        size: 10,
        bold: true,
        color: { argb: 'FFFFFFFF' }
      }
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
      }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
        right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
      }
    })

    // Setup Column Widths
    sheet.columns = [
      { width: 6 },  // A: No.
      { width: 18 }, // B: 客先資産番号
      { width: 26 }, // C: 設備名称・金型名
      { width: 16 }, // D: YSD管理番号
      { width: 30 }, // E: 品名・製品型番
      { width: 8 },  // F: 数量
      { width: 14 }, // G: 貸出書の有無
      { width: 14 }, // H: 金型の有無
      { width: 26 }, // I: 保管場所
      { width: 22 }, // J: 稼働状況
      { width: 34 }, // K: 最終使用日・今後の見通し
    ]

    // Populate Data Rows
    const THREE_YEARS_MS = 3 * 365.25 * 24 * 60 * 60 * 1000
    const nowMs = Date.now()

    allMolds.forEach((m, idx) => {
      // Col B: Customer Asset No
      const customerAssetNo =
        m.physical_stamp ||
        m.legacy_specs?.MoldCode ||
        m.equipment_code

      // Col C: Equipment Name
      const equipName = m.display_name || m.equipment_code

      // Col D: YSD Management Code
      const ysdCode = m.equipment_code

      // Col E: Product Name / Part No
      const prod = m.design_revisions?.products
      const prodName = prod?.product_name || prod?.product_name_internal || prod?.product_code || '—'

      // Col F: Quantity
      const qty = '1 台'

      // Col G: 貸出書の有無 (Biên nhận mượn / thỏa thuận mượn)
      const hasActiveLoan = loanMap.has(m.equipment_id)
      const loanStatusSymbol = hasActiveLoan ? '○' : '×'

      // Col H: 金型の有無 (Hiện vật thực tế tại xưởng)
      const activeLoan = loanMap.get(m.equipment_id)
      const isLoanDispatched = activeLoan && activeLoan.status === 'DISPATCHED'
      const isPhysicallyPresent =
        (m.current_rack_layer_id != null ||
          ['NORMAL', 'AVAILABLE'].includes(m.device_status) ||
          ['STORAGE', 'IN_STOCK', 'IN_USE'].includes(m.usage_status)) &&
        !isLoanDispatched &&
        m.device_status !== 'DISPOSED'
      const physicalSymbol = isPhysicallyPresent ? '○' : '×'

      // Col I: 保管場所 (Vị trí lưu kho)
      let storageLocation = '未配置'
      if (m.rack_layers) {
        const factory = m.rack_layers.racks?.location_in_factory || '川崎本社工場'
        const layer =
          m.rack_layers.layer_code ||
          m.rack_layers.racks?.rack_code_new ||
          m.rack_layers.racks?.rack_code ||
          ''
        storageLocation = `${factory} [${layer}]`
      } else if (isLoanDispatched) {
        storageLocation = `社外貸出中 (${activeLoan.loan_code})`
      }

      // Col J: 稼働状況 (Tình trạng hoạt động)
      let operatingStatus = '稼働'
      if (m.device_status === 'DISPOSED') {
        operatingStatus = '廃棄済'
      } else if (m.device_status === 'MAINTENANCE') {
        operatingStatus = '保全・補修中'
      } else {
        // Check dormant (休止 / 3年以上休止)
        const updatedTime = m.updated_at ? new Date(m.updated_at).getTime() : 0
        const isDormant = updatedTime > 0 && nowMs - updatedTime >= THREE_YEARS_MS
        if (isDormant || m.usage_status === 'OUT_OF_STOCK') {
          operatingStatus = '非稼働 (3年以上休止)'
        }
      }

      // Col K: 最終使用日・今後の見通し (Ngày sử dụng gần nhất & Kế hoạch tương lai)
      const lastUsedDate = m.updated_at
        ? m.updated_at.slice(0, 10).replace(/-/g, '/')
        : '—'
      const outlookNote = m.notes
        ? m.notes
        : operatingStatus === '稼働'
        ? '保管継続 (次回受注時使用)'
        : '休止保管 (取引先確認済)'
      const colKValue = `${lastUsedDate} / ${outlookNote}`

      // Append row
      const row = sheet.addRow([
        idx + 1,
        customerAssetNo,
        equipName,
        ysdCode,
        prodName,
        qty,
        loanStatusSymbol,
        physicalSymbol,
        storageLocation,
        operatingStatus,
        colKValue
      ])

      row.height = 22
      const isEven = idx % 2 === 1

      row.eachCell((cell, colNumber) => {
        cell.font = { name: 'Yu Gothic', size: 10, color: { argb: 'FF0F172A' } }
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        }

        if (isEven) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFF8FAFC' }
          }
        }

        // Alignments
        if (colNumber === 1 || colNumber === 6) {
          // No., 数量
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
        } else if (colNumber === 2 || colNumber === 4) {
          // 客先資産番号, YSD管理番号
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
          cell.font = { name: 'Consolas', size: 10, bold: true, color: { argb: 'FF1E293B' } }
        } else if (colNumber === 7 || colNumber === 8) {
          // 貸出書の有無 (G), 金型の有無 (H)
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
          const val = cell.value?.toString()
          if (val === '○') {
            cell.font = { name: 'Yu Gothic', size: 11, bold: true, color: { argb: 'FF047857' } } // Emerald
          } else {
            cell.font = { name: 'Yu Gothic', size: 11, bold: true, color: { argb: 'FFB91C1C' } } // Red
          }
        } else if (colNumber === 10) {
          // 稼働状況 (J)
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
          const val = cell.value?.toString() || ''
          if (val.includes('3年以上休止')) {
            cell.font = { name: 'Yu Gothic', size: 9.5, bold: true, color: { argb: 'FFD97706' } } // Amber
          } else if (val === '稼働') {
            cell.font = { name: 'Yu Gothic', size: 10, bold: true, color: { argb: 'FF0284C7' } } // Sky Blue
          }
        } else {
          cell.alignment = { vertical: 'middle', horizontal: 'left' }
        }
      })
    })

    // 5. Generate and Return Stream Buffer
    const buffer = await workbook.xlsx.writeBuffer()
    const sanitizedCode = companyCode.replace(/[^a-zA-Z0-9_-]/g, '') || 'ALL'
    const filename = `貸与設備棚卸調査表_${sanitizedCode}_${todayStr.replace(/\//g, '')}.xlsx`

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Cache-Control': 'no-store, max-age=0'
      }
    })

  } catch (error: any) {
    console.error('[ExportSurvey] Critical error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
