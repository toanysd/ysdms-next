import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function inspectCutterSMK218R3() {
  console.log('--- 1. Searching equipment table for SMK218R3 cutter ---')
  const { data: eq } = await supabase
    .from('equipment')
    .select(`
      *,
      keeper_company:companies!keeper_company_id(company_name, company_code),
      company:companies!company_id(company_name, company_code),
      rack_layers(layer_code, racks(rack_code))
    `)
    .ilike('equipment_code', '%SMK218%')

  console.log('Equipment table matches:', JSON.stringify(eq, null, 2))

  console.log('\n--- 2. Searching legacy cutters table for SMK218 ---')
  const { data: cut } = await supabase
    .from('cutters')
    .select(`
      *,
      keeper_company:companies!keeper_company_id(company_name, company_code),
      company:companies!company_id(company_id, company_name, company_code),
      rack_layers(layer_code, racks(rack_code))
    `)
    .ilike('cutter_name', '%SMK218%')

  console.log('Legacy cutters table matches:', JSON.stringify(cut, null, 2))
}

inspectCutterSMK218R3().catch(console.error)
