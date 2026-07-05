import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

const DRY_RUN = process.argv.includes('--dry-run')

async function purgeOrphanBasesV2() {
  console.log('═══════════════════════════════════════════')
  console.log(`  PURGE ORPHAN MOLD_BASE v2 ${DRY_RUN ? '[DRY RUN]' : '[LIVE]'}`)
  console.log('═══════════════════════════════════════════\n')

  // Step 1: Lấy TẤT CẢ mold_base_id từ revisions (PHÂN TRANG!)
  console.log('Step 1: Thu thập mold_base_id có revision (paginated)...')
  let allRevBaseIds = []
  let revOffset = 0
  while (true) {
    const { data } = await supabase
      .from('mold_design_revision')
      .select('mold_base_id')
      .range(revOffset, revOffset + 999)
    if (!data || data.length === 0) break
    allRevBaseIds = allRevBaseIds.concat(data)
    revOffset += 1000
  }
  const baseIdsWithRevision = new Set(allRevBaseIds.map(r => r.mold_base_id))
  console.log(`  → ${baseIdsWithRevision.size} mold_base có ít nhất 1 revision (từ ${allRevBaseIds.length} rev rows)`)

  // Step 2: Lấy TẤT CẢ mold_base_id từ order_items (PHÂN TRANG!)
  console.log('Step 2: Thu thập mold_base_id từ order_items...')
  let allOrderMoldIds = []
  let oiOffset = 0
  while (true) {
    const { data } = await supabase
      .from('order_items')
      .select('mold_id')
      .not('mold_id', 'is', null)
      .range(oiOffset, oiOffset + 999)
    if (!data || data.length === 0) break
    allOrderMoldIds = allOrderMoldIds.concat(data)
    oiOffset += 1000
  }
  const baseIdsInOrders = new Set(allOrderMoldIds.map(o => o.mold_id))
  console.log(`  → ${baseIdsInOrders.size} mold_base được tham chiếu từ order_items`)

  // Step 3: Lấy TẤT CẢ mold_base (PHÂN TRANG!)
  console.log('Step 3: Lấy toàn bộ mold_base...')
  let allBases = []
  let baseOffset = 0
  while (true) {
    const { data } = await supabase
      .from('mold_base')
      .select('id, code')
      .range(baseOffset, baseOffset + 999)
    if (!data || data.length === 0) break
    allBases = allBases.concat(data)
    baseOffset += 1000
  }
  console.log(`  → ${allBases.length} mold_base tổng`)

  // Step 4: Xác định TRUE orphan (không có revision VÀ không có order_items)
  const orphans = allBases.filter(b => !baseIdsWithRevision.has(b.id) && !baseIdsInOrders.has(b.id))
  const hasRevOrOrder = allBases.filter(b => baseIdsWithRevision.has(b.id) || baseIdsInOrders.has(b.id))
  
  console.log(`\n  ✅ Giữ lại: ${hasRevOrOrder.length} mold_base (có revision hoặc order_items)`)
  console.log(`  ❌ TRUE Orphan: ${orphans.length} mold_base (KHÔNG rev, KHÔNG order)`)
  console.log(`  Sample orphans:`, orphans.slice(0, 10).map(o => o.code))

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Không xóa. Chạy lại KHÔNG có --dry-run để xóa thật.')
    return
  }

  // Step 5: Xóa orphans theo batch
  console.log(`\nStep 5: Xóa ${orphans.length} orphan records...`)
  const BATCH = 100
  let deleted = 0
  let failed = 0

  for (let i = 0; i < orphans.length; i += BATCH) {
    const batchIds = orphans.slice(i, i + BATCH).map(o => o.id)
    const { error } = await supabase
      .from('mold_base')
      .delete()
      .in('id', batchIds)
    
    if (error) {
      console.log(`\n  ❌ Batch ${i} failed:`, error.message)
      failed += batchIds.length
    } else {
      deleted += batchIds.length
    }
    process.stdout.write(`\r  Progress: ${deleted + failed}/${orphans.length} (deleted=${deleted}, failed=${failed})`)
  }

  // Step 6: Xác nhận
  console.log('\n\nStep 6: Xác nhận...')
  const { count: finalCount } = await supabase
    .from('mold_base')
    .select('*', { count: 'exact', head: true })
  console.log(`  mold_base còn lại: ${finalCount} rows`)

  console.log('\n═══════════════════════════════════════════')
  console.log(`  HOÀN TẤT: Đã xóa ${deleted} orphan, lỗi ${failed}`)
  console.log('═══════════════════════════════════════════')
}

purgeOrphanBasesV2()
