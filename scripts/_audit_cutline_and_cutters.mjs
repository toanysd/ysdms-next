import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function auditData() {
  console.log('=== 1. AUDIT DESIGN_REVISIONS FOR CUTLINE DIMENSIONS ===')
  const { data: revs } = await supabase
    .from('design_revisions')
    .select('revision_id, design_code, design_length, design_width, design_height, cutline_length, cutline_width, product_length, product_width')
    .ilike('design_code', '%SMK218%')

  console.log('SMK218 design_revisions sample:')
  console.log(JSON.stringify(revs, null, 2))

  console.log('\n=== 2. AUDIT CUTTERS VS EQUIPMENT FOR CUTTERS ===')
  const { data: legacyCutters } = await supabase
    .from('cutters')
    .select(`
      cutter_id, cutter_no, cutter_name, cutter_design_code, cutter_type,
      current_rack_layer_id, keeper_company_id, cutter_length_mm, cutter_width_mm, cutter_height_mm,
      cutline_length, cutline_width, corner_r, chamfer_c, plastic_cut_type, base_type, notes,
      keeper_company:companies!cutters_keeper_company_id_fkey(company_code, company_name),
      rack_layers(layer_code, racks(rack_code))
    `)
    .ilike('cutter_name', '%SMK218%')

  console.log('Legacy cutters table matching SMK218:')
  console.log(JSON.stringify(legacyCutters, null, 2))

  const { data: equipCutters } = await supabase
    .from('equipment')
    .select(`
      equipment_id, equipment_code, display_name, equipment_type, sub_type, dimensions,
      actual_length_mm, actual_width_mm, actual_height_mm, current_rack_layer_id, keeper_company_id,
      design_revision_id, legacy_cutter_id, legacy_id,
      keeper_company:companies!keeper_company_id(company_code, company_name),
      rack_layers(layer_code, racks(rack_code))
    `)
    .in('equipment_type', ['CUTTER_SEPARATE', 'CUTTER_INLINE'])
    .ilike('display_name', '%SMK218%')

  console.log('Equipment table matching SMK218 cutters:')
  console.log(JSON.stringify(equipCutters, null, 2))
}

auditData().catch(console.error)
