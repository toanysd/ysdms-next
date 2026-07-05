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
  console.log("🚀 Bắt đầu tiến trình Migration chi tiết từ molddesign.csv...")

  const traysPath = path.resolve(process.cwd(), 'source_data', 'csv-access-data', 'tray.csv')
  const moldsPath = path.resolve(process.cwd(), 'source_data', 'csv-access-data', 'molds.csv')
  const moldDesignPath = path.resolve(process.cwd(), 'source_data', 'csv-access-data', 'molddesign.csv')

  const traysRaw = fs.readFileSync(traysPath, 'utf-8')
  const moldsRaw = fs.readFileSync(moldsPath, 'utf-8')
  const moldDesignRaw = fs.readFileSync(moldDesignPath, 'utf-8')

  const trays: any[] = parse(traysRaw, { columns: true, skip_empty_lines: true, bom: true })
  const molds: any[] = parse(moldsRaw, { columns: true, skip_empty_lines: true, bom: true })
  const moldDesigns: any[] = parse(moldDesignRaw, { columns: true, skip_empty_lines: true, bom: true })

  // 1. Tạo Map TrayID -> TrayName
  const trayIdToTrayName = new Map()
  for (const t of trays) {
    if (t.TrayID && t.MoldTrayName) {
      trayIdToTrayName.set(t.TrayID, t.MoldTrayName)
    }
  }

  // 2. Map MoldDesignID -> revision_id
  console.log("⏳ Fetching mold data from Supabase...")
  const { data: physicals } = await supabase.from('mold_physical').select('id, physical_code, revision_id')
  const codeToRevisionId = new Map()
  for (const p of physicals || []) {
    if (p.physical_code) codeToRevisionId.set(p.physical_code, p.revision_id)
  }

  const moldDesignIdToRevisionId = new Map()
  for (const m of molds) {
    const moldCode = m.MoldCode
    const moldName = m.MoldName
    let revisionId = codeToRevisionId.get(moldCode)
    if (!revisionId && moldName) revisionId = codeToRevisionId.get(moldName)

    if (revisionId && m.MoldDesignID) {
      moldDesignIdToRevisionId.set(m.MoldDesignID, revisionId)
    }
  }

  // 3. Fetch product_master
  console.log("⏳ Fetching product_master from Supabase...")
  const { data: products } = await supabase.from('product_master').select('id, name')
  const productNameToId = new Map()
  for (const p of products || []) {
    if (p.name) productNameToId.set(p.name, p.id)
  }

  // 4. Chuẩn bị dữ liệu cập nhật
  console.log("⏳ Đang xử lý Cập nhật Vật liệu và Kích thước...")
  
  let updatedProductsCount = 0
  let updatedRevisionsCount = 0

  for (const md of moldDesigns) {
    // 4.1 Update mold_design_revision (Kích thước Dao / Khuôn và Thiết kế)
    const revisionId = moldDesignIdToRevisionId.get(md.MoldDesignID)
    if (revisionId) {
      const ml = parseFloat(md.MoldDesignLength) || null
      const mw = parseFloat(md.MoldDesignWidth) || null
      const mh = parseFloat(md.MoldDesignHeight) || null
      
      const cutlineX = parseFloat(md.CutlineX) || null
      const cutlineY = parseFloat(md.CutlineY) || null
      const pitch = parseFloat(md.Pitch) || null
      const pocketNumbers = parseInt(md.PocketNumbers) || null
      const underDepth = parseFloat(md.UnderDepth) || null
      
      const revUpdate: any = {}
      if (ml !== null) revUpdate.length_mm = ml
      if (mw !== null) revUpdate.width_mm = mw
      if (mh !== null) revUpdate.height_mm = mh
      
      if (cutlineX !== null) revUpdate.cutline_x = cutlineX
      if (cutlineY !== null) revUpdate.cutline_y = cutlineY
      if (pitch !== null) revUpdate.pitch = pitch
      if (pocketNumbers !== null) revUpdate.pocket_numbers = pocketNumbers
      if (underDepth !== null) revUpdate.under_depth = underDepth
      
      if (md.CornerR) revUpdate.corner_r = md.CornerR
      if (md.ChamferC) revUpdate.chamfer_c = md.ChamferC
      if (md.UnderAngle) revUpdate.under_angle = md.UnderAngle
      if (md.DraftAngle) revUpdate.draft_angle = md.DraftAngle
      if (md.MoldOrientation) revUpdate.mold_orientation = md.MoldOrientation
      if (md.MoldSetupType) revUpdate.mold_setup_type = md.MoldSetupType
      if (md.SeparateCutter) revUpdate.separate_cutter = md.SeparateCutter === 'TRUE'
      if (md.Plug) revUpdate.plug = md.Plug === 'TRUE'
      if (md.CustomerDrawingNo) revUpdate.customer_drawing_no = md.CustomerDrawingNo
      if (md.CustomerEquipmentNo) revUpdate.customer_equipment_no = md.CustomerEquipmentNo

      if (Object.keys(revUpdate).length > 0) {
        await supabase.from('mold_design_revision').update(revUpdate).eq('id', revisionId)
        updatedRevisionsCount++
      }
    }

    // 4.2 Update product_master (Vật liệu, Kích thước Khay)
    const trayId = md.TrayID
    if (trayId) {
      const trayName = trayIdToTrayName.get(trayId)
      if (trayName) {
        const productId = productNameToId.get(trayName)
        if (productId) {
          const material = md.DesignForPlasticType?.trim() || null
          const internalName = md.TrayInfoForMoldDesign?.trim() || null
          const customerName = md.CustomerTrayName?.trim() || null
          
          const updateData: any = {}
          if (material) updateData.material = material
          if (internalName) updateData.internal_product_name = internalName
          if (customerName) updateData.customer_product_name = customerName
          
          if (Object.keys(updateData).length > 0) {
            await supabase.from('product_master').update(updateData).eq('id', productId)
            updatedProductsCount++
          }
        }
      }
    }
  }

  console.log("✅ MIGRATION HOÀN TẤT!")
  console.log(`- Đã cập nhật kích thước (Length, Width, Height) cho ${updatedRevisionsCount} Khuôn/Dao.`)
  console.log(`- Đã cập nhật Vật liệu Nhựa (Material) cho ${updatedProductsCount} Sản phẩm / Khay.`)
}

migrate().catch(console.error)
