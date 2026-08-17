import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function debugOrders() {
  const { data: ol, error: olErr } = await supabase
    .from('order_lines')
    .select(`
      line_id, quantity, unit, created_at,
      orders(order_id, order_no, order_date, order_status, notes)
    `)
    .limit(1)

  console.log('Order lines query with orders:', JSON.stringify(ol, null, 2), 'Error:', olErr)
}

debugOrders().catch(console.error)
