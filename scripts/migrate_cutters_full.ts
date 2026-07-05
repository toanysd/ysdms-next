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
  console.log("🚀 Bắt đầu tiến trình Migration Phase 2: Khởi tạo Dao Cắt...")

  const cuttersPath = path.resolve(process.cwd(), 'source_data', 'csv-access-data', 'cutters.csv')
  const cutters: any[] = parse(fs.readFileSync(cuttersPath, 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })

  // Need mapping from MoldDesignID -> revision_id
  const moldsPath = path.resolve(process.cwd(), 'source_data', 'csv-access-data', 'molds.csv')
  const molds: any[] = parse(fs.readFileSync(moldsPath, 'utf-8'), { columns: true, skip_empty_lines: true, bom: true })
  
  const { data: physicals } = await supabase.from('mold_physical').select('id, physical_code, revision_id')
  const physCodeToRevId = new Map()
  for (const p of physicals || []) {
    if (p.physical_code) physCodeToRevId.set(p.physical_code, p.revision_id)
  }
  const moldDesignIdToRevId = new Map()
  for (const m of molds) {
    const revId = physCodeToRevId.get(m.MoldCode) || physCodeToRevId.get(m.MoldName)
    if (revId && m.MoldDesignID) {
      moldDesignIdToRevId.set(m.MoldDesignID, revId)
    }
  }

  console.log(`✅ Đã tải ${cutters.length} dao cắt (cutters.csv).`)

  let insertedCuttersCount = 0
  let linkedCuttersCount = 0

  for (const c of cutters) {
    const code = c.CutterNo || c.CutterCode || c.CutterID
    if (!code) continue;

    let { data: cutterRec } = await supabase.from('cutter_master').select('id').eq('code', code).single()
    
    const cutterData: any = {
      code: code,
      cutter_name: c.CutterName?.trim() || null,
      cutter_note: c.CutterNote?.trim() || null,
      usage_status: c.UsageStatus?.trim() || null,
      mold_shared: c.MoldShared === 'TRUE' || c.MoldShared === '1',
      blade_count: parseInt(c.BladeCount) || null,
      pitch: parseFloat(c.Pitch) || null,
      plastic_cut_type: c.PlasticCutType?.trim() || null,
      post_cut_length: parseFloat(c.PostCutLength) || null,
      post_cut_width: parseFloat(c.PostCutWidth) || null,
      cutline_length: parseFloat(c.CutlineLength) || null,
      cutline_width: parseFloat(c.CutlineWidth) || null,
      cutter_length: parseFloat(c.CutterLength) || null,
      cutter_width: parseFloat(c.CutterWidth) || null,
      cutter_height: parseFloat(c.CutterHeight) || null,
      cutter_thickness: parseFloat(c.CutterThickness) || null,
      cutter_corner: c.CutterCorner?.trim() || null,
      cutter_chamfer: c.CutterChamfer?.trim() || null,
      cutter_type: c.CutterType?.trim() || null,
      cutter_dim: c.CutterDim?.trim() || null,
      pp_cushion_use: c.PPcushionUse?.trim() || null
    }

    let cutterId = cutterRec?.id
    if (!cutterId) {
      const { data: newCutter, error: insErr } = await supabase.from('cutter_master').insert(cutterData).select('id').single()
      if (newCutter) {
        cutterId = newCutter.id
        insertedCuttersCount++
      } else {
        // Có thể mã đã tồn tại nhưng single() ở trên lỗi
        const { data: existing } = await supabase.from('cutter_master').select('id').eq('code', code).single()
        if (existing) {
          cutterId = existing.id
          await supabase.from('cutter_master').update(cutterData).eq('id', cutterId)
        }
      }
    } else {
      await supabase.from('cutter_master').update(cutterData).eq('id', cutterId)
    }

    if (c.MoldDesignID && cutterId) {
      const revId = moldDesignIdToRevId.get(c.MoldDesignID)
      if (revId) {
        const { data: existingLink } = await supabase.from('mold_cutter_config')
          .select('id').eq('cutter_id', cutterId).eq('revision_id', revId).single()
        
        if (!existingLink) {
          await supabase.from('mold_cutter_config').insert({
            cutter_id: cutterId,
            revision_id: revId,
            setup_notes: c.CutterDetail?.trim() || null
          })
          linkedCuttersCount++
        }
      }
    }
  }

  console.log(`✅ Đã Insert/Update thành công dữ liệu dao cắt. Số lượng thêm mới: ${insertedCuttersCount}.`)
  console.log(`✅ Đã liên kết ${linkedCuttersCount} cặp Khuôn-Dao.`)
  console.log("🎉 CHIẾN DỊCH 2 HOÀN TẤT!")
}

migrate().catch(console.error)
