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
  console.log("🚀 Bắt đầu tiến trình Migration Phase 2: Cập nhật Khuôn...")

  const moldMasterPath = path.resolve(process.cwd(), 'source_data', 'csv-access-data', 'moldmaster.csv')
  const moldDesignPath = path.resolve(process.cwd(), 'source_data', 'csv-access-data', 'molddesign.csv')
  const moldsPath = path.resolve(process.cwd(), 'source_data', 'csv-access-data', 'molds.csv')

  const moldMaster: any[] = parse(fs.readFileSync(moldMasterPath, 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })
  const moldDesign: any[] = parse(fs.readFileSync(moldDesignPath, 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })
  const molds: any[] = parse(fs.readFileSync(moldsPath, 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })

  // Maps from DB
  const { data: dbMoldBase } = await supabase.from('mold_base').select('id, code')
  const baseCodeToId = new Map((dbMoldBase || []).map(b => [b.code, b.id]))

  // 1. Update mold_base
  let updatedBaseCount = 0
  for (const mb of moldMaster) {
    const code = mb.MoldMasterCode
    const id = baseCodeToId.get(code)
    if (id) {
      await supabase.from('mold_base').update({
        mold_class: mb.MoldClass?.trim() || null,
        notes: mb.Notes?.trim() || null
      }).eq('id', id)
      updatedBaseCount++
    }
  }
  console.log(`✅ Đã cập nhật ${updatedBaseCount} bản ghi mold_base.`)

  // Maps from DB for revisions and physicals
  const { data: physicals } = await supabase.from('mold_physical').select('id, physical_code, revision_id')
  const physCodeToId = new Map()
  const physCodeToRevId = new Map()
  for (const p of physicals || []) {
    if (p.physical_code) {
      physCodeToId.set(p.physical_code, p.id)
      physCodeToRevId.set(p.physical_code, p.revision_id)
    }
  }

  const moldDesignIdToRevId = new Map()
  for (const m of molds) {
    const revId = physCodeToRevId.get(m.MoldCode) || physCodeToRevId.get(m.MoldName)
    if (revId && m.MoldDesignID) {
      moldDesignIdToRevId.set(m.MoldDesignID, revId)
    }
  }

  // 2. Update mold_design_revision
  let updatedRevCount = 0
  for (const md of moldDesign) {
    const revId = moldDesignIdToRevId.get(md.MoldDesignID)
    if (revId) {
      const updateData: any = {}
      if (md.MoldDesignLength) updateData.design_length = parseFloat(md.MoldDesignLength) || null
      if (md.MoldDesignWidth) updateData.design_width = parseFloat(md.MoldDesignWidth) || null
      if (md.MoldDesignHeight) updateData.design_height = parseFloat(md.MoldDesignHeight) || null
      if (md.MoldDesignDepth) updateData.design_depth = parseFloat(md.MoldDesignDepth) || null
      if (md.MoldDesignWeight) updateData.design_weight = parseFloat(md.MoldDesignWeight) || null
      if (md.PieceCount) updateData.piece_count = parseInt(md.PieceCount) || null
      if (md.CAVID) updateData.cavid = md.CAVID.trim()
      if (md.DataInput) updateData.data_input = md.DataInput.trim()
      if (md.TextContent) updateData.text_content = md.TextContent.trim()
      if (md.VersionNote) updateData.version_note = md.VersionNote.trim()
      if (md.DesignForPlasticType) updateData.design_for_plastic_type = md.DesignForPlasticType.trim()

      if (Object.keys(updateData).length > 0) {
        await supabase.from('mold_design_revision').update(updateData).eq('id', revId)
        updatedRevCount++
      }
    }
  }
  console.log(`✅ Đã cập nhật ${updatedRevCount} bản ghi mold_design_revision.`)

  // 3. Update mold_physical
  let updatedPhysCount = 0
  for (const m of molds) {
    const physId = physCodeToId.get(m.MoldCode) || physCodeToId.get(m.MoldName)
    if (physId) {
      const updateData: any = {}
      const keeper = m.storage_company || m.KeeperCompany
      if (keeper) updateData.keeper_company = keeper.trim()
      if (m.MoldLengthModified) updateData.modified_length = parseFloat(m.MoldLengthModified) || null
      if (m.MoldWidthModified) updateData.modified_width = parseFloat(m.MoldWidthModified) || null
      if (m.MoldHeightModified) updateData.modified_height = parseFloat(m.MoldHeightModified) || null
      if (m.MoldWeight) updateData.actual_weight = parseFloat(m.MoldWeight) || null
      if (m.MoldUsageStatus) updateData.usage_status = m.MoldUsageStatus.trim()
      if (m.DeviceStatus) updateData.device_status = m.DeviceStatus.trim()
      if (m.MoldOnCheckList) updateData.on_check_list = m.MoldOnCheckList === 'TRUE' || m.MoldOnCheckList === '1'
      if (m.MoldNotes) updateData.notes = m.MoldNotes.trim()

      if (Object.keys(updateData).length > 0) {
        await supabase.from('mold_physical').update(updateData).eq('id', physId)
        updatedPhysCount++
      }
    }
  }
  console.log(`✅ Đã cập nhật ${updatedPhysCount} bản ghi mold_physical.`)
  
  console.log("🎉 CHIẾN DỊCH 1 HOÀN TẤT!")
}

migrate().catch(console.error)
