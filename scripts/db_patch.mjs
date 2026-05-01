import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function runPatch() {
  console.log("Fetching order_items with null product_id...")
  const { data: items } = await supabase.from('order_items').select('id, product_pn_raw').is('product_id', null)
  
  if (!items || items.length === 0) {
    console.log("No orders need patching.")
    return
  }

  for (const item of items) {
    const raw = item.product_pn_raw?.trim()
    if (!raw) continue

    // find product_master by code or customer_code
    const { data: prods } = await supabase.from('product_master')
        .select('id')
        .or(`code.ilike.%${raw}%,customer_code.ilike.%${raw}%,name.ilike.%${raw}%`)
        .limit(1)

    if (prods && prods.length > 0) {
       console.log(`Patching item ${item.id} (${raw}) -> Product ${prods[0].id}`)
       await supabase.from('order_items').update({ product_id: prods[0].id }).eq('id', item.id)
    }
  }
  console.log("Patch complete.")
}

runPatch()
