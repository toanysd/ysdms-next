import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function run() {
    const { data: stock } = await supabase.from('tray_stock_summary').select('current_stock').eq('product_code', '1-130-1').single()
    console.log('Current Stock:', stock?.current_stock)

    const { data: txn } = await supabase.from('tray_inventory_txn').select('txn_type, quantity, lot_no, operator_name').eq('lot_no', 'TEST-UI-999').order('created_at', { ascending: false }).limit(1).single()
    console.log('Last OUT Txn:', txn)
}
run()
