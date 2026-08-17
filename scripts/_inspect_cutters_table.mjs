import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function inspectCuttersTable() {
  const { data: cutters, error } = await supabase
    .from('cutters')
    .select(`
      *,
      keeper_company:companies!cutters_keeper_company_id_fkey(company_id, company_name, company_code),
      rack_layers(layer_code, racks(rack_code))
    `)
    .limit(10)

  console.log('Error:', error)
  console.log('Sample cutters:', JSON.stringify(cutters, null, 2))
}

inspectCuttersTable().catch(console.error)
