import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function auditMigration() {
  const { count: cCount } = await supabase.from('cutters').select('*', { count: 'exact', head: true })
  const { count: eCount } = await supabase.from('equipment').select('*', { count: 'exact', head: true }).in('equipment_type', ['CUTTER_SEPARATE', 'CUTTER_INLINE', 'CUTTER'])

  console.log(`=== COUNT SUMMARY ===`)
  console.log(`cutters table total rows: ${cCount}`)
  console.log(`equipment table cutter rows: ${eCount}`)

  // Sample cutters with missing equipment or un-synced fields
  const { data: cutters } = await supabase
    .from('cutters')
    .select('cutter_id, cutter_no, cutter_name, cutter_type, keeper_company_id, current_rack_layer_id, base_type, cutline_length, cutline_width')
    .not('keeper_company_id', 'is', null)
    .limit(10)

  console.log('\nSample cutters with keeper_company_id in cutters table:')
  console.log(JSON.stringify(cutters, null, 2))

  if (cutters && cutters.length > 0) {
    const ids = cutters.map(c => c.cutter_id)
    const { data: matchedEquip } = await supabase
      .from('equipment')
      .select('equipment_id, equipment_code, display_name, equipment_type, sub_type, keeper_company_id, current_rack_layer_id, legacy_cutter_id')
      .in('legacy_cutter_id', ids)

    console.log('\nCorresponding equipment rows for those cutters:')
    console.log(JSON.stringify(matchedEquip, null, 2))
  }
}

auditMigration().catch(console.error)
