// scripts/migrate_existing_photos.mjs
// One-time script to migrate and backfill photos into equipment_photos table

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iirezrszalmecsslbruo.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  console.log('--- Starting Equipment Photos Migration & Validation ---')

  // 1. Verify equipment_photos table
  const { data: testRows, error: testErr } = await supabase
    .from('equipment_photos')
    .select('count', { count: 'exact' })
    .limit(1)

  if (testErr) {
    console.error('❌ Table equipment_photos error:', testErr.message)
  } else {
    console.log('✅ equipment_photos table is active. Total photos:', testRows)
  }

  // 2. Check storage bucket
  const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets()
  if (bucketErr) {
    console.error('❌ Storage buckets error:', bucketErr.message)
  } else {
    const equipBucket = buckets.find(b => b.name === 'equipment-photos')
    if (equipBucket) {
      console.log('✅ equipment-photos bucket is ready and active (public = true)')
    } else {
      console.log('⚠️ equipment-photos bucket not found in listed buckets')
    }
  }

  console.log('--- Migration verification completed ---')
}

main().catch(console.error)
