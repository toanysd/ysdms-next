// Backfill: DesignForPlasticType from molddesign.csv → design_revisions.plastic_type_designed
// Run: $env:SUPABASE_SERVICE_ROLE_KEY='...'; node scripts/backfill_plastic_type.mjs

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = 'https://iirezrszalmecsslbruo.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SERVICE_KEY) { console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set'); process.exit(1) }

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  db: { schema: 'public' },
  auth: { persistSession: false }
})

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim())
  // Remove BOM
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

async function run() {
  // Step 1: Read CSV
  console.log('🔄 Step 1: Reading molddesign.csv...')
  const csvText = readFileSync('source_data/csv-access-data/molddesign.csv', 'utf-8')
  const rows = parseCSV(csvText)
  console.log(`  Total rows in CSV: ${rows.length}`)

  // Build map: legacy_id → plastic_type
  const plasticMap = new Map()
  let csvWithPlastic = 0
  for (const row of rows) {
    const designId = row['MoldDesignID']
    const plasticType = row['DesignForPlasticType']
    if (designId && plasticType && plasticType.trim()) {
      plasticMap.set(`DESIGN-${designId}`, plasticType.trim())
      csvWithPlastic++
    }
  }
  console.log(`  CSV rows with DesignForPlasticType: ${csvWithPlastic}`)

  // Step 2: Fetch all design_revisions with legacy_id
  console.log('🔄 Step 2: Fetching design_revisions...')
  
  const allRevisions = []
  let offset = 0
  const PAGE = 1000
  while (true) {
    const { data, error } = await supabase
      .from('design_revisions')
      .select('revision_id, legacy_id, plastic_type_designed')
      .not('legacy_id', 'is', null)
      .range(offset, offset + PAGE - 1)
    
    if (error) { console.error('❌ Error:', error); break }
    if (!data || data.length === 0) break
    allRevisions.push(...data)
    offset += data.length
    if (data.length < PAGE) break
  }
  console.log(`  Design revisions with legacy_id: ${allRevisions.length}`)

  // Step 3: Match and update
  console.log('🔄 Step 3: Updating plastic_type_designed...')
  
  let matched = 0
  let updated = 0
  let skipped = 0
  let errors = 0

  for (const rev of allRevisions) {
    const plasticType = plasticMap.get(rev.legacy_id)
    if (!plasticType) continue
    matched++
    
    // Skip if already has value
    if (rev.plastic_type_designed && rev.plastic_type_designed.trim()) {
      skipped++
      continue
    }

    const { error } = await supabase
      .from('design_revisions')
      .update({ plastic_type_designed: plasticType })
      .eq('revision_id', rev.revision_id)
    
    if (error) {
      errors++
      if (errors <= 3) console.error(`  ❌ Error updating ${rev.revision_id}:`, error.message)
    } else {
      updated++
    }
  }

  console.log(`  Matched: ${matched}`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Skipped (already filled): ${skipped}`)
  console.log(`  Errors: ${errors}`)

  // Step 4: Verify
  console.log('🔄 Step 4: Verification...')
  const { count: total } = await supabase
    .from('design_revisions')
    .select('*', { count: 'exact', head: true })
  const { count: withPlastic } = await supabase
    .from('design_revisions')
    .select('*', { count: 'exact', head: true })
    .not('plastic_type_designed', 'is', null)

  console.log(`  📊 Total design_revisions: ${total}`)
  console.log(`  📊 With plastic_type_designed: ${withPlastic}`)

  // Sample
  const { data: sample } = await supabase
    .from('design_revisions')
    .select('legacy_id, plastic_type_designed, tray_info')
    .not('plastic_type_designed', 'is', null)
    .limit(5)
  
  if (sample && sample.length > 0) {
    console.log('')
    console.log('📋 Sample after backfill:')
    for (const s of sample) {
      console.log(`  ${s.legacy_id}: plastic="${s.plastic_type_designed}" | tray="${s.tray_info}"`)
    }
  }

  console.log('')
  console.log('✅ Backfill complete!')
}

run().catch(err => { console.error('❌', err); process.exit(1) })
