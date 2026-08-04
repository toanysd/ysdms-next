// Backfill first_shipment_date on products table
// Path: jobs → design_revisions → products
// Run: node scripts/backfill_first_shipment_date.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://iirezrszalmecsslbruo.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SERVICE_KEY) { console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set'); process.exit(1) }
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

async function run() {
  // Step 0: Ensure column exists
  console.log('🔄 Step 0: Ensuring first_shipment_date column exists...')
  const { data: testData, error: testErr } = await supabase.from('products').select('first_shipment_date').limit(1)
  if (testErr && testErr.message.includes('does not exist')) {
    console.log('  Column does not exist. Please run migration SQL first:')
    console.log('  ALTER TABLE products ADD COLUMN IF NOT EXISTS first_shipment_date DATE;')
    console.log('  Run this in Supabase SQL Editor, then re-run this script.')
    process.exit(1)
  }
  console.log('  ✅ Column exists')

  // Step 1: Fetch all jobs with ship_date + design_revision_id
  console.log('🔄 Step 1: Fetching jobs with ship_date...')
  const { data: jobs, error: jobErr } = await supabase
    .from('jobs')
    .select('job_id, ship_date, design_revision_id')
    .not('ship_date', 'is', null)
    .not('design_revision_id', 'is', null)
  
  if (jobErr) { console.error('❌', jobErr); process.exit(1) }
  console.log(`  Jobs with ship_date: ${jobs.length}`)

  // Step 2: Fetch design_revisions to get product_id
  console.log('🔄 Step 2: Resolving design_revision → product...')
  const revIds = [...new Set(jobs.map(j => j.design_revision_id))]
  
  const revToProduct = new Map()
  for (let i = 0; i < revIds.length; i += 500) {
    const batch = revIds.slice(i, i + 500)
    const { data: revs, error } = await supabase
      .from('design_revisions')
      .select('revision_id, product_id')
      .in('revision_id', batch)
    if (error) { console.error('❌', error); continue }
    for (const r of revs) {
      revToProduct.set(r.revision_id, r.product_id)
    }
  }
  console.log(`  Resolved ${revToProduct.size} revisions → products`)

  // Step 3: Build product → earliest ship_date map
  const productShipDate = new Map()
  for (const job of jobs) {
    const productId = revToProduct.get(job.design_revision_id)
    if (!productId) continue
    
    const shipDate = job.ship_date.slice(0, 10) // YYYY-MM-DD
    const existing = productShipDate.get(productId)
    if (!existing || shipDate < existing) {
      productShipDate.set(productId, shipDate)
    }
  }
  console.log(`  Products with ship dates: ${productShipDate.size}`)

  // Step 4: Update products
  console.log('🔄 Step 4: Updating products.first_shipment_date...')
  let updated = 0, errors = 0
  for (const [productId, shipDate] of productShipDate) {
    const { error } = await supabase
      .from('products')
      .update({ first_shipment_date: shipDate })
      .eq('product_id', productId)
    
    if (error) { errors++; if (errors <= 3) console.error('  ❌', error.message) }
    else updated++
  }
  console.log(`  Updated: ${updated}, Errors: ${errors}`)

  // Step 5: Also backfill from CSV DeliveryDeadline for jobs without ship_date in DB
  console.log('🔄 Step 5: Backfill from CSV...')
  const fs = await import('fs')
  const csvText = fs.readFileSync('source_data/csv-access-data/jobs.csv', 'utf-8')
  const lines = csvText.split('\n').filter(l => l.trim())
  const hdr = lines[0].replace(/^\uFEFF/, '').split(',').map(h => h.trim())
  const ddIdx = hdr.indexOf('DeliveryDeadline')
  const mdIdx = hdr.indexOf('MoldDesignID')
  
  // Build MoldDesignID → DeliveryDeadline
  const csvDeadlines = new Map()
  let csvCount = 0
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',')
    const dd = (vals[ddIdx] || '').trim()
    const mdId = (vals[mdIdx] || '').trim()
    if (!dd || !mdId) continue
    // Parse date - might be various formats
    let parsed = null
    if (/^\d{4}[/-]\d{2}[/-]\d{2}/.test(dd)) {
      parsed = dd.slice(0, 10).replace(/\//g, '-')
    } else if (/^\d{2}[/-]\d{2}[/-]\d{4}/.test(dd)) {
      const parts = dd.split(/[/-]/)
      parsed = `${parts[2]}-${parts[0]}-${parts[1]}`
    }
    if (!parsed) continue
    
    const existing = csvDeadlines.get(mdId)
    if (!existing || parsed < existing) {
      csvDeadlines.set(mdId, parsed)
    }
    csvCount++
  }
  console.log(`  CSV rows with DeliveryDeadline: ${csvCount}, unique designs: ${csvDeadlines.size}`)

  // Resolve DESIGN-{id} → product_id via design_revisions
  const allRevisions = []
  let offset = 0
  while (true) {
    const { data } = await supabase
      .from('design_revisions')
      .select('revision_id, legacy_id, product_id')
      .not('legacy_id', 'is', null)
      .range(offset, offset + 999)
    if (!data || data.length === 0) break
    allRevisions.push(...data)
    offset += data.length
    if (data.length < 1000) break
  }

  const legacyToProduct = new Map()
  for (const r of allRevisions) {
    const mdId = r.legacy_id.replace('DESIGN-', '')
    legacyToProduct.set(mdId, r.product_id)
  }

  let csvUpdated = 0
  for (const [mdId, deadline] of csvDeadlines) {
    const productId = legacyToProduct.get(mdId)
    if (!productId) continue
    if (productShipDate.has(productId)) continue // already set from DB

    const { error } = await supabase
      .from('products')
      .update({ first_shipment_date: deadline })
      .eq('product_id', productId)
    
    if (error) errors++
    else csvUpdated++
  }
  console.log(`  CSV backfill updated: ${csvUpdated}`)

  // Verify
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).not('first_shipment_date', 'is', null)
  const { count: totalP } = await supabase.from('products').select('*', { count: 'exact', head: true })
  console.log(`\n📊 Products with first_shipment_date: ${count} / ${totalP}`)
  
  const { data: sample } = await supabase
    .from('products')
    .select('product_code, first_shipment_date')
    .not('first_shipment_date', 'is', null)
    .order('first_shipment_date', { ascending: false })
    .limit(5)
  if (sample) {
    console.log('\n📋 Latest samples:')
    for (const s of sample) console.log(`  ${s.product_code}: ${s.first_shipment_date}`)
  }
  console.log('\n✅ Done!')
}

run().catch(e => { console.error('❌', e); process.exit(1) })
