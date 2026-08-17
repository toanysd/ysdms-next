import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function testFixes() {
  console.log('--- 1. Testing physical_molds query without mold_revision_id ---')
  const { data: pm, error: pmErr } = await supabase
    .from('physical_molds')
    .select(`
      physical_mold_id, system_code, display_name, device_status, usage_status, mold_type, piece_count,
      actual_length_mm, actual_width_mm, actual_height_mm, actual_weight, manufacturing_date,
      rack_layers(layer_code, racks(rack_code))
    `)
    .limit(1)

  console.log('physical_molds Error:', pmErr)

  console.log('\n--- 2. Testing order_lines query without delivery_sites ---')
  const { data: ol, error: olErr } = await supabase
    .from('order_lines')
    .select(`
      line_id, quantity, unit, created_at,
      orders(order_id, order_no, order_date, order_status, notes, companies:company_id(company_name, company_code))
    `)
    .limit(1)

  console.log('order_lines Error:', olErr)
}

testFixes().catch(console.error)
