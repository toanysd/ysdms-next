import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function syncAllCutters() {
  const { data: cutters } = await supabase.from('cutters').select('*').range(999, 2000)
  console.log(`Syncing remaining ${cutters?.length || 0} cutters...`)
  if (!cutters) return

  let count = 0
  for (const c of cutters) {
    const rawType = (c.cutter_type || '').toUpperCase()
    const eqType = (rawType.includes('INLINE') || rawType.includes('IN-LINE')) ? 'CUTTER_INLINE' : 'CUTTER_SEPARATE'

    const legacySpecs = {
      cutter_no: c.cutter_no,
      cutter_type: c.cutter_type,
      base_type: c.base_type,
      cutline_length: c.cutline_length,
      cutline_width: c.cutline_width,
      corner_r: c.corner_r,
      chamfer_c: c.chamfer_c,
      plastic_cut_type: c.plastic_cut_type,
      post_cut_length: c.post_cut_length,
      post_cut_width: c.post_cut_width,
      cutter_presence: c.cutter_presence
    }

    const payload = {
      equipment_type: eqType,
      sub_type: c.cutter_type || c.base_type || null,
      keeper_company_id: c.keeper_company_id || null,
      current_rack_layer_id: c.current_rack_layer_id || null,
      actual_length_mm: c.cutter_length_mm || null,
      actual_width_mm: c.cutter_width_mm || null,
      actual_height_mm: c.cutter_height_mm || null,
      notes: c.notes || null,
      legacy_specs: legacySpecs
    }

    const { error } = await supabase.from('equipment').update(payload).eq('legacy_cutter_id', c.cutter_id)
    if (!error) count++
  }
  console.log(`Synced ${count} remaining cutters!`)
}

syncAllCutters().catch(console.error)
