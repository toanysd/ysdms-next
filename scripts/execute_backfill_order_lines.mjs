import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf8')
const envMap = {}
env.split('\n').forEach((l) => {
  const m = l.match(/^([^=]+)=(.*)$/)
  if (m) envMap[m[1]] = m[2].trim()
})

const sb = createClient(envMap.NEXT_PUBLIC_SUPABASE_URL, envMap.SUPABASE_SERVICE_ROLE_KEY)

async function executeBackfill() {
  const isExecute = process.argv.includes('--execute')
  if (!isExecute) {
    console.log('SAFETY GUARD: --execute flag not passed. Aborting without write.')
    console.log('Usage: node scripts/execute_backfill_order_lines.mjs --execute')
    process.exit(0)
  }

  console.log('=== EXECUTING ORDER_LINES BACKFILL (PE APPROVED) ===\n')

  // 1. Read JSON source data
  const jsonPath = 'source_data/parse_output_dryrun_v2.json'
  const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  const jsonOrders = rawData.orders || []

  // 2. Fetch all orders from Supabase DB to map order_no -> order_id
  let allDbOrders = []
  let from = 0
  const pageSize = 1000
  while (true) {
    const { data, error } = await sb
      .from('orders')
      .select('order_id, order_no')
      .range(from, from + pageSize - 1)
    if (error) {
      console.error('Error fetching DB orders:', error)
      process.exit(1)
    }
    allDbOrders = allDbOrders.concat(data)
    if (data.length < pageSize) break
    from += pageSize
  }

  const dbOrderMap = new Map()
  for (const o of allDbOrders) {
    dbOrderMap.set(o.order_no, o.order_id)
  }

  // 3. Prepare rows to insert
  const rowsToInsert = []
  for (const jo of jsonOrders) {
    const orderId = dbOrderMap.get(jo.order_no)
    if (!orderId) continue

    let lineSeq = 1
    for (const l of jo.lines) {
      const qty = l.quantity != null ? Number(l.quantity) : 1
      rowsToInsert.push({
        order_id: orderId,
        line_no: lineSeq++,
        product_id: l.product_id,
        quantity: qty,
        unit: 'PCS',
        line_status: 'CONFIRMED',
        notes: l.notes || null,
        shipped_qty: 0,
        remaining_qty: qty,
      })
    }
  }

  console.log(`Prepared ${rowsToInsert.length} rows for insertion across ${allDbOrders.length} orders.`)

  // 4. Batch insert in chunks of 500 rows
  const CHUNK_SIZE = 500
  let insertedCount = 0
  const startTime = Date.now()

  for (let i = 0; i < rowsToInsert.length; i += CHUNK_SIZE) {
    const chunk = rowsToInsert.slice(i, i + CHUNK_SIZE)
    const { error } = await sb
      .from('order_lines')
      .upsert(chunk, { onConflict: 'order_id,line_no', ignoreDuplicates: true })

    if (error) {
      console.error(`Error inserting chunk ${i / CHUNK_SIZE + 1}:`, error)
      process.exit(1)
    }

    insertedCount += chunk.length
    console.log(`Inserted chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(rowsToInsert.length / CHUNK_SIZE)} (${insertedCount}/${rowsToInsert.length} rows)`)
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`\nBackfill completed successfully in ${durationSec}s!`)

  // 5. Final row count verification
  const { count: finalCount } = await sb
    .from('order_lines')
    .select('*', { count: 'exact', head: true })
  console.log(`Final order_lines count in Supabase: ${finalCount}`)
}

executeBackfill()
