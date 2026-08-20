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
  console.log('=== 1. CHECKING QUOTATION TABLES ===')
  const possibleTables = [
    'quotations', 'quotes', 'quotation_lines', 'quotation_items',
    'estimates', 'estimate_items', 'price_quotes', 'price_estimates',
    'mold_quotations', 'tray_quotations'
  ]

  for (const t of possibleTables) {
    const { data, error } = await sb.from(t).select('*').limit(1)
    if (!error) {
      console.log(`[FOUND TABLE] ${t}:`, data)
    } else {
      console.log(`[NOT FOUND] ${t}: (${error.message})`)
    }
  }

  console.log('\n=== 2. ORDERS & ORDER_LINES PRICE COLUMNS ===')
  const { data: sampleOrder, error: oErr } = await sb.from('orders').select('*').limit(1)
  if (sampleOrder && sampleOrder[0]) {
    console.log('Orders Columns:', Object.keys(sampleOrder[0]))
    console.log('Sample Order Data:', sampleOrder[0])
  } else {
    console.log('Orders query error:', oErr)
  }

  const { data: sampleLine, error: lErr } = await sb.from('order_lines').select('*').limit(1)
  if (sampleLine && sampleLine[0]) {
    console.log('\nOrder_lines Columns:', Object.keys(sampleLine[0]))
    console.log('Sample Order_line Data:', sampleLine[0])
  } else {
    console.log('Order_lines query error:', lErr)
  }

  console.log('\n=== 3. DESIGN_REVISIONS TECHNICAL SPEC COLUMNS ===')
  const { data: sampleRev, error: rErr } = await sb.from('design_revisions').select('*').limit(1)
  if (sampleRev && sampleRev[0]) {
    console.log('Design_revisions Columns:', Object.keys(sampleRev[0]))
    console.log('Sample Design_revision Data:', sampleRev[0])
  } else {
    console.log('Design_revisions query error:', rErr)
  }

  console.log('\n=== 4. BUSINESS_CASES COMMERCIAL COLUMNS ===')
  const { data: sampleCase, error: cErr } = await sb.from('business_cases').select('*').limit(1)
  if (sampleCase && sampleCase[0]) {
    console.log('Business_cases Columns:', Object.keys(sampleCase[0]))
    console.log('Sample Business_case Data:', sampleCase[0])
  } else {
    console.log('Business_cases query error:', cErr)
  }
}

inspect()
