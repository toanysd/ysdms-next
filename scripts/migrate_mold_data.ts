import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const [k, ...v] = line.split('=')
      return [k.trim(), v.join('=').trim()]
    })
)

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
const supabase = createClient(supabaseUrl, supabaseKey)

async function migrate() {
  console.log("🚀 Bắt đầu tiến trình Migration từ CSV...")

  const traysPath = path.resolve(process.cwd(), 'source_data', 'csv-access-data', 'tray.csv')
  const moldsPath = path.resolve(process.cwd(), 'source_data', 'csv-access-data', 'molds.csv')

  const traysRaw = fs.readFileSync(traysPath, 'utf-8')
  const moldsRaw = fs.readFileSync(moldsPath, 'utf-8')

  const trays: any[] = parse(traysRaw, { columns: true, skip_empty_lines: true, bom: true })
  const molds: any[] = parse(moldsRaw, { columns: true, skip_empty_lines: true, bom: true })

  console.log(`✅ Đã tải ${trays.length} khay (trays.csv).`)
  console.log(`✅ Đã tải ${molds.length} khuôn (molds.csv).`)

  // 1. Tạo Map TrayID -> TrayName
  const trayIdToTrayInfo = new Map()
  for (const t of trays) {
    if (t.TrayID) {
      trayIdToTrayInfo.set(t.TrayID, {
        name: t.MoldTrayName || `Tray-${t.TrayID}`,
        code: t.TrayCode || `TR-${t.TrayID}`,
        remarks: t.TrayOrderNotes || ''
      })
    }
  }

  // 2. Fetch toàn bộ mold_physical và mold_design_revision để map physical_code -> UUID
  console.log("⏳ Fetching mold data from Supabase...")
  const { data: physicals, error: pErr } = await supabase.from('mold_physical').select('id, physical_code, revision_id')
  if (pErr) {
    console.error("❌ Lỗi fetch mold_physical:", pErr)
    return
  }

  const codeToRevisionId = new Map()
  const codeToPhysicalId = new Map()
  for (const p of physicals) {
    if (p.physical_code) {
      codeToRevisionId.set(p.physical_code, p.revision_id)
      codeToPhysicalId.set(p.physical_code, p.id)
    }
  }

  // 3. Chuẩn bị dữ liệu cập nhật
  console.log("⏳ Đang xử lý Mapping dữ liệu Khay và Kích thước...")
  
  let updatedMoldsCount = 0
  let insertedTraysCount = 0

  // Lưu cache product name -> product UUID
  const productNameToId = new Map()
  
  // Fetch existing product_master
  const { data: existingProducts } = await supabase.from('product_master').select('id, name')
  for (const ep of existingProducts || []) {
    productNameToId.set(ep.name, ep.id)
  }

  let matchedMoldsCount = 0

  for (const m of molds) {
    const moldCode = m.MoldCode
    const moldName = m.MoldName
    let revisionId = codeToRevisionId.get(moldCode)
    let physicalId = codeToPhysicalId.get(moldCode)
    
    if (!revisionId && moldName) {
      revisionId = codeToRevisionId.get(moldName)
      physicalId = codeToPhysicalId.get(moldName)
    }
    
    if (!revisionId) continue; // Khuôn này chưa được seed trong Supabase, bỏ qua
    matchedMoldsCount++

    // Update legacy_id in mold_physical since we have it!
    if (m.MoldID && physicalId) {
       await supabase.from('mold_physical').update({ legacy_id: parseInt(m.MoldID) }).eq('id', physicalId)
    }

    // A. Update Dimensions in mold_design_revision
    const l = parseFloat(m.MoldLengthModified) || null
    const w = parseFloat(m.MoldWidthModified) || null
    const h = parseFloat(m.MoldHeightModified) || null
    
    if (l || w || h) {
      await supabase.from('mold_design_revision')
        .update({ length_mm: l, width_mm: w, height_mm: h })
        .eq('id', revisionId)
      updatedMoldsCount++
    }

    // B. Xử lý Khay (Tray)
    const trayId = m.TrayID
    if (trayId && trayIdToTrayInfo.has(trayId)) {
      const trayInfo = trayIdToTrayInfo.get(trayId)
      
      let productUuid = productNameToId.get(trayInfo.name)
      if (!productUuid) {
        // Create new product
        const { data: newProd, error: prodErr } = await supabase.from('product_master')
          .insert({
            name: trayInfo.name,
            code: trayInfo.name, // code must be unique, name might be safe enough
            remarks: trayInfo.remarks
          })
          .select('id')
          .single()

        if (!prodErr && newProd) {
          productUuid = newProd.id
          productNameToId.set(trayInfo.name, productUuid)
          insertedTraysCount++
        } else if (prodErr && prodErr.code === '23505') {
            // Duplicate code error, fetch it
            const { data: existingProd } = await supabase.from('product_master').select('id').eq('code', trayInfo.name).single()
            if(existingProd) {
                productUuid = existingProd.id
                productNameToId.set(trayInfo.name, productUuid)
            }
        }
      }

      // Link mold to product (product_mold_map)
      if (productUuid) {
        // Check if map already exists
        const { data: existingMap } = await supabase.from('product_mold_map')
          .select('id')
          .eq('product_id', productUuid)
          .eq('revision_id', revisionId)
          .single()
          
        if (!existingMap) {
          await supabase.from('product_mold_map').insert({
            product_id: productUuid,
            revision_id: revisionId
          })
        }
      }
    }
  }

  console.log("✅ MIGRATION HOÀN TẤT!")
  console.log(`- Đã match ${matchedMoldsCount} khuôn với DB.`)
  console.log(`- Đã cập nhật kích thước cho ${updatedMoldsCount} khuôn.`)
  console.log(`- Đã thêm mới ${insertedTraysCount} khay vào danh mục Sản phẩm.`)
}

migrate().catch(console.error)
