// Migration script: Backfill product_description from design_revisions.tray_info
// Run: $env:SUPABASE_SERVICE_ROLE_KEY='...'; node scripts/migrate_product_description.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://iirezrszalmecsslbruo.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  db: { schema: 'public' },
  auth: { persistSession: false }
})

async function run() {
  console.log('🔄 Step 1: Checking column exists...')
  const { error: checkErr } = await supabase.from('products').select('product_description').limit(1)
  if (checkErr) {
    console.error('❌ Column product_description does not exist:', checkErr.message)
    process.exit(1)
  }
  console.log('  ✅ Column exists')

  // Step 2: Fetch all design_revisions with tray_info, grouped by product_id
  // Take the LATEST revision's tray_info for each product
  console.log('🔄 Step 2: Fetching design_revisions with tray_info...')
  
  const { data: revisions, error: revErr } = await supabase
    .from('design_revisions')
    .select('revision_id, product_id, tray_info, customer_tray_name, design_date, created_at')
    .not('tray_info', 'is', null)
    .neq('tray_info', '')
    .order('created_at', { ascending: false })

  if (revErr) {
    console.error('❌ Error fetching design_revisions:', revErr)
    process.exit(1)
  }

  console.log(`  Found ${revisions.length} revisions with tray_info`)

  // Group by product_id, take first (latest) tray_info
  const productDescMap = new Map()
  const productNameMap = new Map()
  
  for (const rev of revisions) {
    if (rev.product_id && !productDescMap.has(rev.product_id)) {
      productDescMap.set(rev.product_id, rev.tray_info)
    }
    // Also backfill customer_tray_name → product_name if available
    if (rev.product_id && rev.customer_tray_name && !productNameMap.has(rev.product_id)) {
      productNameMap.set(rev.product_id, rev.customer_tray_name)
    }
  }

  console.log(`  Unique products with tray_info: ${productDescMap.size}`)
  console.log(`  Unique products with customer_tray_name: ${productNameMap.size}`)

  // Step 3: Update products.product_description
  console.log('🔄 Step 3: Updating products.product_description from design_revisions.tray_info...')
  
  let updatedDesc = 0
  let updatedName = 0
  let errors = 0

  for (const [productId, description] of productDescMap) {
    const updateData = { product_description: description }
    
    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('product_id', productId)
      .is('product_description', null) // Only update if currently NULL
    
    if (error) {
      errors++
      if (errors <= 3) console.error(`  ❌ Error updating ${productId}:`, error.message)
    } else {
      updatedDesc++
    }
  }

  console.log(`  ✅ Updated product_description: ${updatedDesc} products`)

  // Step 4: Also fix product_name where it's just the internal code
  console.log('🔄 Step 4: Fixing product_name where it equals product_name_internal (was not properly set)...')
  
  for (const [productId, customerName] of productNameMap) {
    // Only update if product_name equals product_name_internal (indicating it wasn't properly set)
    const { data: prod } = await supabase
      .from('products')
      .select('product_name, product_name_internal')
      .eq('product_id', productId)
      .single()
    
    if (prod && prod.product_name === prod.product_name_internal) {
      const { error } = await supabase
        .from('products')
        .update({ product_name: customerName })
        .eq('product_id', productId)
      
      if (!error) updatedName++
    }
  }

  console.log(`  ✅ Fixed product_name from customer_tray_name: ${updatedName} products`)

  // Step 5: Verify
  console.log('🔄 Step 5: Verification...')
  
  const { count: total } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { count: withDesc } = await supabase.from('products').select('*', { count: 'exact', head: true }).not('product_description', 'is', null)
  const { count: withNotes } = await supabase.from('products').select('*', { count: 'exact', head: true }).not('notes', 'is', null)
  
  console.log('')
  console.log('📊 Final Statistics:')
  console.log(`  Total products: ${total}`)
  console.log(`  With product_description: ${withDesc}`)
  console.log(`  With notes (remaining): ${withNotes}`)
  console.log(`  Errors: ${errors}`)
  
  // Sample verification
  const { data: sample } = await supabase
    .from('products')
    .select('product_code, product_name, product_description')
    .not('product_description', 'is', null)
    .ilike('product_code', 'SMK%')
    .limit(5)
  
  if (sample && sample.length > 0) {
    console.log('')
    console.log('📋 Sample SMK products after migration:')
    for (const s of sample) {
      console.log(`  ${s.product_code}: name="${s.product_name}" | desc="${s.product_description}"`)
    }
  }
  
  console.log('')
  console.log('✅ Migration complete!')
}

run().catch(err => {
  console.error('❌ Unexpected error:', err)
  process.exit(1)
})
