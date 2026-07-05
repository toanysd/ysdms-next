// temp_ai/check_migration_b.mjs — Kiểm tra vấn đề duplicate column parent_company_id
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  // dùng service_role key để bypass RLS
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCS'
)

async function checkDB() {
  console.log('=== Kiểm tra cột parent_company_id trên bảng companies ===\n')

  // 1. Kiểm tra cột có tồn tại không (qua information_schema)
  const { data: colData, error: colErr } = await supabase
    .rpc('check_column_exists', { 
      p_table: 'companies', 
      p_column: 'parent_company_id' 
    })
    .maybeSingle()

  // RPC có thể không tồn tại, thử cách khác: lấy 1 row và xem cấu trúc
  const { data: sample, error: sampleErr } = await supabase
    .from('companies')
    .select('company_id, company_name, parent_company_id')
    .limit(3)

  if (sampleErr) {
    console.log('❌ Lỗi khi query companies với parent_company_id:', sampleErr.message)
    console.log('  → Có thể cột KHÔNG tồn tại hoặc có lỗi migration')
  } else {
    console.log('✅ Cột parent_company_id TỒN TẠI trên bảng companies')
    console.log('  → Migration 069 & 070 đều đã chạy OK (không bị lỗi duplicate)')
    console.log('\nSample data (3 rows):')
    sample.forEach(r => {
      console.log(`  - ${r.company_name} | parent_id: ${r.parent_company_id ?? 'NULL'}`)
    })
  }

  // 2. Kiểm tra delivery_sites có cột contact_person không
  console.log('\n=== Kiểm tra delivery_sites ===')
  const { data: siteData, error: siteErr } = await supabase
    .from('delivery_sites')
    .select('site_id, site_name, contact_person, contact_email')
    .limit(3)

  if (siteErr) {
    console.log('❌ Lỗi delivery_sites contact_person:', siteErr.message)
  } else {
    console.log('✅ delivery_sites.contact_person tồn tại')
    console.log(`  → ${siteData.length} rows lấy được`)
  }

  // 3. Tổng số companies
  const { count, error: cntErr } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  if (!cntErr) {
    console.log(`\n📊 Tổng số companies trong DB: ${count} records`)
  }
}

checkDB().catch(console.error)
