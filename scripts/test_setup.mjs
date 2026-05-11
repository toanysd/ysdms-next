import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function checkOrders() {
    const { data: o } = await supabase.from('orders').select('id, slip_no, status').eq('status', 'in_production')
    console.log("In-production orders:", o)
    if (!o || o.length === 0) {
        // Create one for testing!
        console.log("No in_production orders found, creating one...")
        const { data: p } = await supabase.from('product_master').select('id, code').eq('code', '1-130-1').single()
        const { data: no } = await supabase.from('orders').insert({ status: 'in_production', slip_no: 'TEST-UI-999' }).select('id').single()
        await supabase.from('order_items').insert({ order_id: no.id, product_id: p.id, quantity: 15 })
        console.log("Created TEST-UI-999 order.")
    }

    const { data: stock } = await supabase.from('tray_stock_summary').select('product_code, current_stock').eq('product_code', '1-130-1').single()
    console.log("Current stock for 1-130-1:", stock)
}
checkOrders()
