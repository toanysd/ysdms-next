/**
 * seed_production_instructions_demo.mjs — Seed demo data for production instructions
 * Chạy: node scripts/seed_production_instructions_demo.mjs
 * Đảm bảo idempotent, an toàn, sử dụng service_role key.
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
  console.log('🚀 Bắt đầu seed Production Instructions demo data...\n')

  // --- 1. Tạo các delivery site nếu còn thiếu ---
  console.log('--- Kiểm tra và bổ sung các Delivery Site ---')
  
  // Lấy ID Kyocera
  const { data: companyKyo } = await supabase.from('companies').select('company_id').eq('company_code', 'KYOCERA').single()
  if (!companyKyo) {
    console.error('❌ Thất bại: Không tìm thấy công ty KYOCERA!')
    process.exit(1)
  }

  // Check KYOCERA-KYO site
  let { data: siteKyo } = await supabase.from('delivery_sites').select('site_id').eq('site_code', 'KYOCERA-KYO').maybeSingle()
  if (!siteKyo) {
    console.log('   ℹ️ Đang tạo delivery site KYOCERA-KYO...')
    const { data, error } = await supabase.from('delivery_sites').insert({
      company_id: companyKyo.company_id,
      site_code: 'KYOCERA-KYO',
      site_name: '京セラ 京都本社',
      site_address: '〒612-8501 京都市伏見区竹田鳥羽殿町6',
      contact_person: '田中 健一',
      site_tel: '075-604-3500'
    }).select('site_id').single()
    
    if (error) {
      console.error('❌ Thất bại khi tạo KYOCERA-KYO:', error.message)
      process.exit(1)
    }
    siteKyo = data
    console.log('   ✅ Đã tạo thành công KYOCERA-KYO:', siteKyo.site_id)
  } else {
    console.log('   ✅ Đã có sẵn KYOCERA-KYO:', siteKyo.site_id)
  }

  // Lấy ID Murata
  const { data: companyMur } = await supabase.from('companies').select('company_id').eq('company_code', 'MURATA').single()
  if (!companyMur) {
    console.error('❌ Thất bại: Không tìm thấy công ty MURATA!')
    process.exit(1)
  }

  // Check MURATA-NGK site
  let { data: siteMur } = await supabase.from('delivery_sites').select('site_id').eq('site_code', 'MURATA-NGK').maybeSingle()
  if (!siteMur) {
    console.log('   ℹ️ Đang tạo delivery site MURATA-NGK...')
    const { data, error } = await supabase.from('delivery_sites').insert({
      company_id: companyMur.company_id,
      site_code: 'MURATA-NGK',
      site_name: '村田製作所 長岡京倉庫',
      site_address: '〒617-8555 長岡京市東神足1-10-1',
      contact_person: '山田 花子',
      site_tel: '075-955-6789'
    }).select('site_id').single()
    
    if (error) {
      console.error('❌ Thất bại khi tạo MURATA-NGK:', error.message)
      process.exit(1)
    }
    siteMur = data
    console.log('   ✅ Đã tạo thành công MURATA-NGK:', siteMur.site_id)
  } else {
    console.log('   ✅ Đã có sẵn MURATA-NGK:', siteMur.site_id)
  }

  // --- 2. Xác thực tất cả các liên kết bắt buộc ---
  console.log('\n--- Xác thực các liên kết bắt buộc ---')

  // a) Iriso Electronics
  const { data: companyIriso } = await supabase.from('companies').select('company_id').eq('company_code', 'IRI').single()
  const { data: orderIriso } = await supabase.from('orders').select('order_id').eq('order_no', 'ORD-IRI-2026-001').single()
  const { data: productIriso } = await supabase.from('products').select('product_id').eq('product_code', 'IRI001').single()
  const { data: siteIriso } = await supabase.from('delivery_sites').select('site_id').eq('site_code', 'IRI').single()

  if (!companyIriso || !orderIriso || !productIriso || !siteIriso) {
    console.error('❌ Thất bại: Thiếu dữ liệu liên kết Iriso (IRI)!', { companyIriso, orderIriso, productIriso, siteIriso })
    process.exit(1)
  }
  console.log('   ✅ Xác thực Iriso (IRI) thành công')

  // b) Kyocera
  const { data: orderKyo } = await supabase.from('orders').select('order_id').eq('order_no', 'ORD-2026-KYO-001').single()
  const { data: prodKyoA1 } = await supabase.from('products').select('product_id').eq('product_code', 'TRAY-KYO-A1').single()
  const { data: prodKyoC3 } = await supabase.from('products').select('product_id').eq('product_code', 'TRAY-KYO-C3').single()

  if (!orderKyo || !prodKyoA1 || !prodKyoC3) {
    console.error('❌ Thất bại: Thiếu dữ liệu liên kết Kyocera!', { orderKyo, prodKyoA1, prodKyoC3 })
    process.exit(1)
  }
  console.log('   ✅ Xác thực Kyocera thành công')

  // c) Murata
  const { data: orderMur } = await supabase.from('orders').select('order_id').eq('order_no', 'ORD-2026-MUR-002').single()
  const { data: prodMurB2 } = await supabase.from('products').select('product_id').eq('product_code', 'TRAY-MUR-B2').single()

  if (!orderMur || !prodMurB2) {
    console.error('❌ Thất bại: Thiếu dữ liệu liên kết Murata!', { orderMur, prodMurB2 })
    process.exit(1)
  }
  console.log('   ✅ Xác thực Murata thành công\n')

  // --- 3. Dọn dẹp dữ liệu cũ (Idempotent) ---
  console.log('--- Đang xóa các chỉ thị sản xuất DEMO-PI-2026-* cũ ---')
  const { error: deleteErr } = await supabase
    .from('production_instructions')
    .delete()
    .like('instruction_no', 'DEMO-PI-2026-%')

  if (deleteErr) {
    console.error('❌ Lỗi xóa dữ liệu cũ:', deleteErr.message)
    process.exit(1)
  }
  console.log('   ✅ Đã dọn dẹp sạch sẽ\n')

  // --- 4. Tạo 4 bản ghi Chỉ thị sản xuất demo ---
  console.log('--- Đang tạo 4 bản ghi Chỉ thị sản xuất demo ---')
  const demoData = [
    {
      instruction_no: 'DEMO-PI-2026-001',
      order_id: orderIriso.order_id,
      product_id: productIriso.product_id,
      instruction_type: 'FORMING',
      production_site: '本社',
      quantity_ordered: 3000,
      quantity_per_stack: 50,
      material_spec: 'PS(N) 0.8mm Black',
      material_thickness: 0.8,
      material_width: 580,
      antistatic: true,
      silicon: false,
      surface_coating: false,
      recycled_pct: 30.0,
      delivery_site_id: siteIriso.site_id,
      requested_date: '2026-08-01',
      lot_no: 'LOT-DEMO-001',
      template_type: 'GENERAL',
      has_label: true,
      is_first_time: false,
      material_stock_warning: false,
      material_stock_qty: 4500,
      status: 'DRAFT',
      notes: 'Chỉ thị sản xuất Nháp (Draft / Chờ phát hành) để kiểm thử bộ lọc.'
    },
    {
      instruction_no: 'DEMO-PI-2026-002',
      order_id: orderKyo.order_id,
      product_id: prodKyoA1.product_id,
      instruction_type: 'FORMING',
      production_site: '青森',
      quantity_ordered: 5000,
      quantity_per_stack: 40,
      material_spec: 'PET(N) 0.5t 400x50m',
      material_thickness: 0.5,
      material_width: 400,
      antistatic: false,
      silicon: true,
      surface_coating: false,
      recycled_pct: 0.0,
      delivery_site_id: siteKyo.site_id,
      requested_date: '2026-08-05',
      lot_no: 'LOT-DEMO-002',
      template_type: 'HAE',
      has_label: false,
      is_first_time: true,
      material_stock_warning: true,
      material_stock_qty: 1200,
      status: 'ISSUED',
      notes: 'Chỉ thị sản xuất đã được duyệt và phát hành (Planned / Đã lên kế hoạch).'
    },
    {
      instruction_no: 'DEMO-PI-2026-003',
      order_id: orderMur.order_id,
      product_id: prodMurB2.product_id,
      instruction_type: 'FORMING',
      production_site: '茨城',
      quantity_ordered: 8000,
      quantity_per_stack: 100,
      material_spec: 'PP 1.2mm Clear',
      material_thickness: 1.2,
      material_width: 600,
      antistatic: true,
      silicon: true,
      surface_coating: true,
      recycled_pct: 50.0,
      delivery_site_id: siteMur.site_id,
      requested_date: '2026-08-10',
      lot_no: 'LOT-DEMO-003',
      template_type: 'SMK',
      has_label: true,
      is_first_time: false,
      material_stock_warning: false,
      material_stock_qty: 10000,
      status: 'IN_PRODUCTION',
      notes: 'Chỉ thị sản xuất đang được gia công định hình tại nhà máy (In progress).'
    },
    {
      instruction_no: 'DEMO-PI-2026-004',
      order_id: orderKyo.order_id,
      product_id: prodKyoC3.product_id,
      instruction_type: 'FORMING',
      production_site: '坂田',
      quantity_ordered: 2000,
      quantity_per_stack: 25,
      material_spec: 'ABS 1.0mm White',
      material_thickness: 1.0,
      material_width: 500,
      antistatic: false,
      silicon: false,
      surface_coating: false,
      recycled_pct: 10.0,
      delivery_site_id: siteKyo.site_id,
      requested_date: '2026-08-12',
      lot_no: 'LOT-DEMO-004',
      template_type: 'GENERAL',
      has_label: true,
      is_first_time: false,
      material_stock_warning: false,
      material_stock_qty: 3000,
      status: 'COMPLETED',
      notes: 'Chỉ thị sản xuất đã gia công hoàn tất (Completed).'
    }
  ]

  const { data: inserted, error: insertErr } = await supabase
    .from('production_instructions')
    .insert(demoData)
    .select('id, instruction_no, status, order_id, product_id, delivery_site_id')

  if (insertErr) {
    console.error('❌ Insert demo data failed:', insertErr.message)
    process.exit(1)
  }

  console.log('   ✅ Đã ghi thành công 4 bản ghi demo!\n')
  console.log('--- CHI TIẾT DỮ LIỆU ĐÃ SEED ---')
  console.table(inserted)

  console.log('\n🎉 Hoàn thành seed dữ liệu kiểm thử thành công!')
}

main().catch(err => {
  console.error('❌ Error in seed execution:', err)
  process.exit(1)
})
