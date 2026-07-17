/**
 * seed_phase2_test_cases.mjs — Seed specific test cases for Phase 2 production instruction PDF layout verification
 * Run: node scripts/seed_phase2_test_cases.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env.local manually
const envPath = resolve(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx === -1) continue
  env[trimmed.substring(0, idx)] = trimmed.substring(idx + 1)
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function main() {
  console.log('🚀 Seeding Phase 2 Test Cases...\n')

  // Resolve Kyocera ID
  const { data: companyKyo } = await supabase.from('companies').select('company_id').eq('company_code', 'KYOCERA').single()
  const { data: orderKyo } = await supabase.from('orders').select('order_id').eq('order_no', 'ORD-2026-KYO-001').single()

  if (!companyKyo || !orderKyo) {
    console.error('❌ Failed: KYOCERA company or order ORD-2026-KYO-001 not found!')
    process.exit(1)
  }

  // --- 1. Clean up old test cases ---
  console.log('--- Cleaning up old TEST-PI-* instructions, products and sites ---')
  await supabase.from('production_instructions').delete().like('instruction_no', 'TEST-PI-%')
  await supabase.from('products').delete().eq('product_code', 'TRAY-LONG-TEST')
  await supabase.from('delivery_sites').delete().eq('site_code', 'SITE-LONG-TEST')

  // --- 2. Create products and delivery sites with long fields for Case 2 ---
  console.log('--- Creating long test records ---')
  const { data: longProduct, error: pErr } = await supabase.from('products').insert({
    product_code: 'TRAY-LONG-TEST',
    product_name: 'Kyocera Industrial High-Precision Multi-Layer Connectors Tray Type-A2-XL-LongLongName',
    company_id: companyKyo.company_id
  }).select('product_id').single()

  if (pErr) {
    console.error('❌ Failed to create long product:', pErr.message)
    process.exit(1)
  }

  const { data: longSite, error: sErr } = await supabase.from('delivery_sites').insert({
    company_id: companyKyo.company_id,
    site_code: 'SITE-LONG-TEST',
    site_name: 'Kyocera Advanced Research & Logistics Center',
    site_address: '〒100-0005 東京都千代田区丸の内１丁目９−１ グラントウキョウサウスタワー 35階 配送センターB棟 窓口7',
    contact_person: '山田 太朗',
    site_tel: '03-1234-5678'
  }).select('site_id').single()

  if (sErr) {
    console.error('❌ Failed to create long site:', sErr.message)
    process.exit(1)
  }

  // Get regular product and site for Case 1 and 3
  const { data: regProduct } = await supabase.from('products').select('product_id').eq('product_code', 'TRAY-KYO-A1').single()
  const { data: regSite } = await supabase.from('delivery_sites').select('site_id').eq('site_code', 'KYOCERA-KYO').single()

  // --- 3. Create production instructions ---
  console.log('--- Creating test instructions ---')
  const testInstructions = [
    {
      instruction_no: 'TEST-PI-CASE1', // Short name & 1 tag
      order_id: orderKyo.order_id,
      product_id: regProduct.product_id,
      instruction_type: 'FORMING',
      production_site: '本社',
      quantity_ordered: 1200,
      requested_date: '2026-09-01',
      delivery_site_id: regSite.site_id,
      template_type: 'GENERAL',
      status: 'DRAFT',
      notes: 'Case 1 test notes.'
    },
    {
      instruction_no: 'TEST-PI-CASE2', // Long name, long address, 4 tags, packaging checkboxes
      order_id: orderKyo.order_id,
      product_id: longProduct.product_id,
      instruction_type: 'FORMING',
      production_site: '青森',
      quantity_ordered: 2500,
      daily_quantity: 500,
      requested_date: '2026-09-02',
      delivery_site_id: longSite.site_id,
      template_type: 'HAE',
      plain_case: true,
      plain_label: true,
      adhesive_sheet: true,
      status: 'ISSUED',
      notes: 'Case 2: Testing long name wrapping, long address wrapping, packaging checkboxes, and 4 tag layout.'
    },
    {
      instruction_no: 'TEST-PI-CASE3', // Many notes, multiple dates, 8+ tags
      order_id: orderKyo.order_id,
      product_id: regProduct.product_id,
      instruction_type: 'FORMING',
      production_site: '茨城',
      quantity_ordered: 5000,
      daily_quantity: 1000,
      requested_date: '2026-09-03',
      delivery_site_id: regSite.site_id,
      template_type: 'GENERAL',
      status: 'ISSUED',
      notes: 'Line 1: Special quality control guidelines are active.\nLine 2: Keep temperature constant at 210 degrees C.\nLine 3: Delivery schedule: 2000 pcs on 09/03, 3000 pcs on 09/05.\nLine 4: Rework status checked.\nLine 5: Please confirm carton weights before shipping.'
    }
  ]

  const { data: inserted, error: insErr } = await supabase
    .from('production_instructions')
    .insert(testInstructions)
    .select('id, instruction_no')

  if (insErr) {
    console.error('❌ Failed to insert instructions:', insErr.message)
    process.exit(1)
  }

  const idMap = {}
  inserted.forEach(pi => {
    idMap[pi.instruction_no] = pi.id
  })

  // --- 4. Seed tags for Case 1 (1 tag) ---
  console.log('--- Seeding tags for Case 1 ---')
  await supabase.from('production_instruction_tags').insert([
    { instruction_id: idMap['TEST-PI-CASE1'], tag_code: 'URGENT', display_order: 0 }
  ])

  // --- 5. Seed tags for Case 2 (4 tags) ---
  console.log('--- Seeding tags for Case 2 ---')
  await supabase.from('production_instruction_tags').insert([
    { instruction_id: idMap['TEST-PI-CASE2'], tag_code: 'URGENT', display_order: 0 },
    { instruction_id: idMap['TEST-PI-CASE2'], tag_code: 'PROTOTYPE', display_order: 1 },
    { instruction_id: idMap['TEST-PI-CASE2'], tag_code: 'FIRST_RUN', display_order: 2 },
    { instruction_id: idMap['TEST-PI-CASE2'], tag_code: 'QUALITY_HOLD', display_order: 3 }
  ])

  // --- 6. Seed tags for Case 3 (9 tags: 7 standard + 2 custom) ---
  console.log('--- Seeding tags for Case 3 (9 tags) ---')
  await supabase.from('production_instruction_tags').insert([
    { instruction_id: idMap['TEST-PI-CASE3'], tag_code: 'URGENT', display_order: 0 },
    { instruction_id: idMap['TEST-PI-CASE3'], tag_code: 'PROTOTYPE', display_order: 1 },
    { instruction_id: idMap['TEST-PI-CASE3'], tag_code: 'FIRST_RUN', display_order: 2 },
    { instruction_id: idMap['TEST-PI-CASE3'], tag_code: 'QUALITY_HOLD', display_order: 3 },
    { instruction_id: idMap['TEST-PI-CASE3'], tag_code: 'REWORK', display_order: 4 },
    { instruction_id: idMap['TEST-PI-CASE3'], tag_code: 'PACKAGING_SPECIAL', display_order: 5 },
    { instruction_id: idMap['TEST-PI-CASE3'], tag_code: 'DELIVERY_SPLIT', display_order: 6 },
    { instruction_id: idMap['TEST-PI-CASE3'], custom_label: '仮ラベル貼付', display_order: 7 }, // Custom tag 1 (JP 6 chars <= 12)
    { instruction_id: idMap['TEST-PI-CASE3'], custom_label: 'TEST-OVERFLOW-TAG-LONG', display_order: 8 } // Custom tag 2 (22 chars <= 24)
  ])

  console.log('✅ Successfully seeded Phase 2 verification test cases!')
  console.table(inserted)
}

main().catch(err => {
  console.error('❌ Error executing script:', err)
  process.exit(1)
})
