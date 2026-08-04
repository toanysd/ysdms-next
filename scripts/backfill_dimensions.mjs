// Backfill: MoldDesign dimensions from molddesign.csv → design_revisions
// Run: $env:SUPABASE_SERVICE_ROLE_KEY='...'; node scripts/backfill_dimensions.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://iirezrszalmecsslbruo.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SERVICE_KEY) { console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  db: { schema: 'public' }, auth: { persistSession: false }
})

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim())
  const headerLine = lines[0].replace(/^\uFEFF/, '')
  const headers = headerLine.split(',').map(h => h.trim())
  const rows = []
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',')
    const row = {}
    headers.forEach((h, idx) => { row[h] = (vals[idx] || '').trim() })
    rows.push(row)
  }
  return rows
}

function parseNum(val) {
  if (!val || val === '' || val === '0') return null
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}

async function run() {
  console.log('🔄 Step 1: Reading molddesign.csv...')
  const csvText = readFileSync('source_data/csv-access-data/molddesign.csv', 'utf-8')
  const rows = parseCSV(csvText)
  console.log(`  Total rows: ${rows.length}`)

  // Build map: DESIGN-{id} → dimensions
  const dimMap = new Map()
  let csvWithDims = 0
  for (const row of rows) {
    const id = row['MoldDesignID']
    const len = parseNum(row['MoldDesignLength'])
    const wid = parseNum(row['MoldDesignWidth'])
    const hei = parseNum(row['MoldDesignHeight'])
    const dep = parseNum(row['MoldDesignDepth'])
    
    if (id && (len || wid)) {
      dimMap.set(`DESIGN-${id}`, { design_length: len, design_width: wid, design_height: hei, design_depth: dep })
      csvWithDims++
    }
  }
  console.log(`  CSV rows with dimensions: ${csvWithDims}`)

  // Step 2: Fetch revisions
  console.log('🔄 Step 2: Fetching design_revisions...')
  const allRevisions = []
  let offset = 0
  const PAGE = 1000
  while (true) {
    const { data, error } = await supabase
      .from('design_revisions')
      .select('revision_id, legacy_id, design_length')
      .not('legacy_id', 'is', null)
      .range(offset, offset + PAGE - 1)
    if (error) { console.error('❌', error); break }
    if (!data || data.length === 0) break
    allRevisions.push(...data)
    offset += data.length
    if (data.length < PAGE) break
  }
  console.log(`  Revisions with legacy_id: ${allRevisions.length}`)

  // Step 3: Update
  console.log('🔄 Step 3: Updating dimensions...')
  let matched = 0, updated = 0, skipped = 0, errors = 0

  for (const rev of allRevisions) {
    const dims = dimMap.get(rev.legacy_id)
    if (!dims) continue
    matched++
    if (rev.design_length) { skipped++; continue }

    const updateData = {}
    if (dims.design_length) updateData.design_length = dims.design_length
    if (dims.design_width) updateData.design_width = dims.design_width
    if (dims.design_height) updateData.design_height = dims.design_height
    if (dims.design_depth) updateData.design_depth = dims.design_depth
    
    if (Object.keys(updateData).length === 0) { skipped++; continue }

    const { error } = await supabase
      .from('design_revisions')
      .update(updateData)
      .eq('revision_id', rev.revision_id)
    
    if (error) { errors++; if (errors <= 3) console.error('  ❌', rev.revision_id, error.message) }
    else updated++
  }

  console.log(`  Matched: ${matched}, Updated: ${updated}, Skipped: ${skipped}, Errors: ${errors}`)

  // Step 4: Verify
  const { count: withLen } = await supabase.from('design_revisions').select('*', { count: 'exact', head: true }).not('design_length', 'is', null)
  const { count: total } = await supabase.from('design_revisions').select('*', { count: 'exact', head: true })
  console.log(`\n📊 With dimensions: ${withLen} / ${total}`)

  const { data: sample } = await supabase
    .from('design_revisions')
    .select('legacy_id, design_length, design_width, design_height, design_depth, tray_info')
    .not('design_length', 'is', null)
    .limit(5)
  
  if (sample) {
    console.log('\n📋 Samples:')
    for (const s of sample) {
      console.log(`  ${s.legacy_id}: ${s.design_length}×${s.design_width}×${s.design_depth||s.design_height} | ${s.tray_info || '-'}`)
    }
  }
  console.log('\n✅ Done!')
}

run().catch(err => { console.error('❌', err); process.exit(1) })
