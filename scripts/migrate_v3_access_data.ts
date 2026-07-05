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

async function fetchAll(table: string, columns: string) {
  let allData: any[] = []
  let page = 0
  const pageSize = 1000
  while (true) {
    const { data, error } = await supabase.from(table).select(columns).range(page * pageSize, (page + 1) * pageSize - 1)
    if (error) throw error
    if (!data || data.length === 0) break
    allData = allData.concat(data)
    if (data.length < pageSize) break
    page++
  }
  return allData
}

async function getCompanyMap() {
  const companies = await fetchAll('companies', 'company_id, company_code')
  const map = new Map<string, string>()
  for (const c of companies) {
    map.set(c.company_code.toUpperCase(), c.company_id)
    if (c.company_code.startsWith('KP-')) {
      map.set(c.company_code.replace('KP-', ''), c.company_id)
    }
  }
  const defaultCompany = map.get('YSD') || companies[0]?.company_id
  return { map, defaultCompany }
}

async function migrate() {
  console.log("🚀 Bắt đầu tiến trình Migration V3 từ CSV...")

  const dir = path.resolve(process.cwd(), 'source_data', 'csv-access-data')
  const readFile = (name: string) => {
    try {
      return parse(fs.readFileSync(path.join(dir, name), 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })
    } catch (e) {
      console.warn(`⚠️ Warning: Could not read ${name}`)
      return []
    }
  }

  const moldMaster: any[] = readFile('moldmaster.csv')
  const moldDesign: any[] = readFile('molddesign.csv')
  const molds: any[] = readFile('molds.csv')
  const trays: any[] = readFile('tray.csv')
  const cutters: any[] = readFile('cutters.csv')

  const { map: companyMap, defaultCompany } = await getCompanyMap()

  const getCompanyId = (customerId: string) => {
    if (!customerId) return defaultCompany
    return companyMap.get(customerId.toString().toUpperCase()) || defaultCompany
  }

  const accessProductToUuid = new Map<string, string>()
  const accessDesignToUuid = new Map<string, string>()
  const designToProductUuid = new Map<string, string>() 
  const accessMoldToUuid = new Map<string, string>()
  
  // Fetch existing maps to reduce upsert overhead, but we will still update
  console.log(`\n⏳ Đang tải dữ liệu cache từ database...`)
  const existingProductsCache = await fetchAll('products', 'product_id, product_code')
  const productCodeToId = new Map(existingProductsCache.map(m => [m.product_code, m.product_id])); // replaced

  // 1. MOLD MASTERS (incremental: skip existing, only insert new)
  let newMasters = 0
  for (const mm of moldMaster) {
    const code = mm.MoldMasterCode?.trim()
    if (!code) continue

    let uuid = productCodeToId.get(code)
    if (uuid) {
      // Already exists — just build mapping, skip DB call
      if (mm.MoldMasterID) accessProductToUuid.set(mm.MoldMasterID.toString().trim(), uuid)
      continue
    }

    const payload = {
      company_id: getCompanyId(mm.CustomerID),
      product_code: code,
      product_name_internal: mm.MoldMasterName?.trim() || code,
      product_status: 'ACTIVE',
      notes: mm.Notes?.trim() || null
    }
    const { data, error } = await supabase.from('products').insert([payload]).select('product_id').single()
    if (error) console.error("Master insert error:", code, error.message)
    if (data) {
      uuid = data.product_id
      productCodeToId.set(code, uuid)
    }
    if (uuid && mm.MoldMasterID) {
      accessProductToUuid.set(mm.MoldMasterID.toString().trim(), uuid)
    }
    newMasters++
  }
  console.log(`✅ products: ${newMasters} mới / ${moldMaster.length} tổng (đã skip ${moldMaster.length - newMasters} existing)`)

  // 2. DESIGN REVISIONS
  console.log(`\n⏳ Đang tải cache design_revisions...`)
  const existingDesignRevisions = await fetchAll('design_revisions', 'revision_id, design_code')
  const designCodeToId = new Map(existingDesignRevisions.map(d => [d.design_code, d.revision_id]))

  console.log(`⏳ Đang xử lý ${moldDesign.length} bản ghi design_revisions (incremental)...`)
  let newDesigns = 0
  for (const md of moldDesign) {
    const code = md.MoldDesignName?.trim()
    if (!code) continue

    // Resolve product_id
    let product_id = accessProductToUuid.get(md.DesignMasterID?.toString().trim())
    if (!product_id) {
      const designCode = md.MoldDesignCode?.trim() || code.replace(/[\s-]/g, '')
      if (!designCode) continue
      let existingMmId = productCodeToId.get(designCode) || productCodeToId.get(code.replace(/[\s-]/g, ''))
      if (existingMmId) {
        product_id = existingMmId
      } else {
        const { data: newMM, error: mmErr } = await supabase.from('products').insert([{
          company_id: getCompanyId(md.CustomerID), product_code: designCode,
          product_name_internal: code, product_status: 'ACTIVE', notes: null
        }]).select('product_id').single()
        if (mmErr) { console.error("Auto-create mold_master error:", designCode, mmErr.message); continue }
        product_id = newMM.product_id
        productCodeToId.set(designCode, product_id)
        console.log(`  ➕ Auto-created mold_master: ${designCode}`)
      }
      if (md.DesignMasterID) accessProductToUuid.set(md.DesignMasterID.toString().trim(), product_id)
    }

    if (md.MoldDesignID) designToProductUuid.set(md.MoldDesignID.toString().trim(), product_id)

    // Check if design already exists — skip if so
    let uuid = designCodeToId.get(code)
    if (uuid) {
      if (md.MoldDesignID) accessDesignToUuid.set(md.MoldDesignID.toString().trim(), uuid)
      continue // Already exists, just build mapping
    }

    const payload: any = {
      product_id, company_id: getCompanyId(md.CustomerID), design_code: code,
      design_length: parseFloat(md.MoldDesignLength) || null, design_width: parseFloat(md.MoldDesignWidth) || null,
      design_height: parseFloat(md.MoldDesignHeight) || null, design_depth: parseFloat(md.MoldDesignDepth) || null,
      design_weight: md.MoldDesignWeight?.trim() || null,
      cutline_length: parseFloat(md.CutlineLength) || null, cutline_width: parseFloat(md.CutlineWidth) || null,
      cavity_count: parseInt(md.CAVID) || parseInt(md.PieceCount) || null,
      corner_r: md.CornerR?.trim() || null, chamfer_c: md.ChamferC?.trim() || null,
      draft_angle: md.DraftAngle?.trim() || null, pitch_mm: parseFloat(md.Pitch) || null,
      orientation: md.MoldOrientation?.trim() || null, setup_type: md.MoldSetupType?.trim() || null,
      plug_type: md.Plug === 'TRUE' ? 'OWNED' : 'NONE', has_separate_cutter: md.SeparateCutter === 'TRUE',
      customer_tray_name: md.CustomerTrayName?.trim() || null,
      customer_equipment_no: md.CustomerEquipmentNo?.trim() || null,
      customer_drawing_no: md.CustomerDrawingNo?.trim() || null
    }

    const { data, error } = await supabase.from('design_revisions').insert([payload]).select('revision_id').single()
    if (error) console.error("Design insert error:", code, error.message)
    if (data) { uuid = data.revision_id; designCodeToId.set(code, uuid) }
    if (uuid && md.MoldDesignID) accessDesignToUuid.set(md.MoldDesignID.toString().trim(), uuid)
    newDesigns++
  }
  console.log(`✅ design_revisions: ${newDesigns} mới / ${moldDesign.length} tổng`)

  // 3. MOLD REVISIONS & PHYSICAL MOLDS
  console.log(`\n⏳ Đang tải cache physical_molds...`)
  const existingPhysical = await fetchAll('physical_molds', 'physical_mold_id, system_code')
  const physicalCodeToId = new Map(existingPhysical.map(p => [p.system_code, p.physical_mold_id]))

  console.log(`⏳ Đang xử lý ${molds.length} bản ghi physical_molds (incremental)...`)
  let newPhysicals = 0
  for (const m of molds) {
    const code = m.MoldCode?.trim() || m.MoldName?.trim()
    if (!code) continue

    // Skip existing
    let pId = physicalCodeToId.get(code)
    if (pId) {
      if (m.MoldID) accessMoldToUuid.set(m.MoldID.toString().trim(), pId)
      continue
    }

    const design_revision_id = accessDesignToUuid.get(m.MoldDesignID?.toString().trim()) || null
    let product_id = designToProductUuid.get(m.MoldDesignID?.toString().trim())
    if (!product_id) {
      product_id = productCodeToId.get(code) || productCodeToId.values().next().value
    }

    let mold_revision_id = null
    const revCode = code + "_REV"
    const { data: revs } = await supabase.from('mold_revisions').select('revision_id').eq('revision_code', revCode)
    if (revs && revs.length > 0) {
      mold_revision_id = revs[0].revision_id
    } else {
      const { data: newRev, error } = await supabase.from('mold_revisions').insert([{
        product_id,
        design_revision_id,
        revision_code: revCode,
        revision_name: code
      }]).select('revision_id').single()
      if (error) console.error("Mold revision insert error:", revCode, error.message)
      if (newRev) mold_revision_id = newRev.revision_id
    }

    if (!mold_revision_id) continue

    const payload = {
      mold_revision_id,
      keeper_company_id: getCompanyId(m.KeeperCompany),
      system_code: code,
      display_name: m.MoldName?.trim() || code,
      device_status: m.DeviceStatus?.trim() || 'IN_USE'
    }

    const { data, error } = await supabase.from('physical_molds').insert([payload]).select('physical_mold_id').single()
    if (error) console.error("Physical insert error:", code, error.message)
    if (data) pId = data.physical_mold_id
    if (pId && m.MoldID) accessMoldToUuid.set(m.MoldID.toString().trim(), pId)
    newPhysicals++
  }
  console.log(`✅ physical_molds: ${newPhysicals} mới / ${molds.length} tổng`)

  // 4. PRODUCTS (trays)
  console.log(`\n⏳ Đang tải cache products...`)
  

  console.log(`⏳ Đang xử lý ${trays.length} bản ghi products (incremental)...`)
  let newProducts = 0
  for (const t of trays) {
    const code = t.MoldTrayName?.trim() || t.TrayCode?.trim() || t.TrayName?.trim()
    if (!code) continue
    if (productCodeToId.has(code)) continue // Already exists

    const payload = {
      company_id: getCompanyId(t.CustomerID),
      
      product_code: code, product_name: t.TrayName?.trim() || code,
      product_name_internal: t.CustomerTrayName?.trim() || null,
      product_status: 'ACTIVE', notes: t.TrayOrderNotes?.trim() || null
    }
    const {error} = await supabase.from('products').insert([payload])
    if (error) console.error("Product insert error:", code, error.message)
    newProducts++
  }
  console.log(`✅ products: ${newProducts} mới / ${trays.length} tổng`)

  // 5. CUTTERS (cutter_masters & cutters)
  // 5. CUTTERS (incremental)
  const existingCutterMasters = await fetchAll('cutter_masters', 'cutter_master_id, cutter_master_code')
  const cutterMasterCodeToId = new Map(existingCutterMasters.map(c => [c.cutter_master_code, c.cutter_master_id]))
  const existingCutters = await fetchAll('cutters', 'cutter_id, cutter_no')
  const cutterCodeSet = new Set(existingCutters.map(c => c.cutter_no))

  console.log(`\n⏳ Đang xử lý ${cutters.length} bản ghi cutters (incremental)...`)
  let newCutters = 0
  for (const c of cutters) {
    const code = c.CutterCode?.trim() || c.CutterName?.trim()
    if (!code) continue
    if (cutterCodeSet.has(code)) continue // Already exists

    let cutter_master_id = cutterMasterCodeToId.get(code)
    if (!cutter_master_id) {
      const { data: newMaster } = await supabase.from('cutter_masters').insert([{
        cutter_master_code: code, cutter_master_name: c.CutterName?.trim() || code,
        company_id: getCompanyId(c.CustomerID)
      }]).select('cutter_master_id').single()
      if (newMaster) { cutter_master_id = newMaster.cutter_master_id; cutterMasterCodeToId.set(code, cutter_master_id) }
    }
    if (!cutter_master_id) continue

    await supabase.from('cutters').insert([{
      cutter_master_id, cutter_no: code, cutter_name: c.CutterName?.trim() || code,
      cutter_design_code: code, usage_status: c.UsageStatus?.trim() || 'IN_USE'
    }])
    cutterCodeSet.add(code)
    newCutters++
  }
  console.log(`✅ cutters: ${newCutters} mới / ${cutters.length} tổng`)

  console.log("\n🎉 MIGRATION V3 HOÀN TẤT!")
}

migrate().catch(console.error).finally(() => process.exit(0))
