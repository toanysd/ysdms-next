import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function testLegacyCutterFetch() {
  const cutterId = '9fc03c85-dda5-456c-b269-2d822ba41ce6' // SKK-008 from previous test

  console.log('--- 1. Querying equipment table ---')
  const { data: eq } = await supabase
    .from('equipment')
    .select(`
      *,
      keeper_company:companies!keeper_company_id(company_name, company_code),
      rack_layers(layer_code, racks(rack_code))
    `)
    .or(`equipment_id.eq.${cutterId},legacy_cutter_id.eq.${cutterId}`)
    .maybeSingle()

  console.log('Equipment table match:', eq)

  if (!eq) {
    console.log('\n--- 2. Querying legacy cutters table with FK expansion ---')
    const { data: cut, error } = await supabase
      .from('cutters')
      .select(`
        *,
        keeper_company:companies!cutters_keeper_company_id_fkey(company_name, company_code),
        rack_layers(layer_code, racks(rack_code))
      `)
      .eq('cutter_id', cutterId)
      .maybeSingle()

    console.log('Legacy cutters table match:', JSON.stringify(cut, null, 2), 'Error:', error)
  }
}

testLegacyCutterFetch().catch(console.error)
