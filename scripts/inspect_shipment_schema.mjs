import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
const envMap = {}
env.split('\n').forEach((l) => {
  const m = l.match(/^([^=]+)=(.*)$/)
  if (m) envMap[m[1]] = m[2].trim()
})

const sb = createClient(envMap.NEXT_PUBLIC_SUPABASE_URL, envMap.SUPABASE_SERVICE_ROLE_KEY)

async function inspect() {
  console.log('=== 1. CHECKING SHIPMENT TABLES ===')
  const possibleTables = [
    'shipments', 'shipment_lines', 'shipment_items', 'delivery_notes',
    'delivery_note_lines', 'delivery_sites', 'order_shipments'
  ]

  for (const t of possibleTables) {
    const { data, error } = await sb.from(t).select('*').limit(1)
    if (!error) {
      console.log(`[FOUND TABLE] ${t}:`, data)
    } else {
      console.log(`[NOT FOUND] ${t}: (${error.message})`)
    }
  }

  console.log('\n=== 2. SHIPMENTS TABLE COLUMNS & SAMPLE DATA ===')
  const { data: sampleShipment, error: sErr } = await sb.from('shipments').select('*').limit(1)
  if (sampleShipment && sampleShipment[0]) {
    console.log('Shipments Columns:', Object.keys(sampleShipment[0]))
    console.log('Sample Shipment Row:', sampleShipment[0])
  } else {
    console.log('Shipments query error or empty:', sErr, sampleShipment)
  }

  console.log('\n=== 3. ORDER_LINES SHIP-RELATED COLUMNS ===')
  const { data: sampleOrderLine, error: olErr } = await sb.from('order_lines').select('*').limit(1)
  if (sampleOrderLine && sampleOrderLine[0]) {
    console.log('Order_lines Columns:', Object.keys(sampleOrderLine[0]))
    console.log('Sample Order_line:', sampleOrderLine[0])
  } else {
    console.log('Order_lines error:', olErr)
  }

  console.log('\n=== 4. DELIVERY_SITES COLUMNS ===')
  const { data: sampleSite, error: siteErr } = await sb.from('delivery_sites').select('*').limit(1)
  if (sampleSite && sampleSite[0]) {
    console.log('Delivery_sites Columns:', Object.keys(sampleSite[0]))
    console.log('Sample Delivery Site:', sampleSite[0])
  } else {
    console.log('Delivery_sites error:', siteErr)
  }
}

inspect()
