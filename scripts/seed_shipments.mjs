/**
 * seed_shipments.mjs — Seed demo data cho Shipments trực tiếp vào Supabase Cloud
 * Chạy: node scripts/seed_shipments.mjs
 * Dùng service_role key để bypass RLS.
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env.local manually (no dotenv dependency needed)
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
  console.log('🚀 Bắt đầu seed Shipments demo data...\n')

  // ── 1. Companies ──
  console.log('1. Companies...')
  const { data: existingKyocera } = await supabase
    .from('companies').select('company_id').eq('company_code', 'KYOCERA').single()
  const { data: existingMurata } = await supabase
    .from('companies').select('company_id').eq('company_code', 'MURATA').single()

  let kyoceraId, murataId

  if (existingKyocera) {
    kyoceraId = existingKyocera.company_id
    console.log('   KYOCERA đã tồn tại:', kyoceraId)
  } else {
    const { data, error } = await supabase.from('companies').insert({
      company_code: 'KYOCERA',
      company_name: '京セラ株式会社',
      company_name_romaji: 'Kyocera Corporation',
      company_type: ['customer'],
      address: '〒612-8501 京都市伏見区竹田鳥羽殿町6',
      tel: '075-604-3500', fax: '075-604-3501',
    }).select('company_id').single()
    if (error) { console.error('❌ Insert KYOCERA failed:', error.message); return }
    kyoceraId = data.company_id
    console.log('   ✅ KYOCERA created:', kyoceraId)
  }

  if (existingMurata) {
    murataId = existingMurata.company_id
    console.log('   MURATA đã tồn tại:', murataId)
  } else {
    const { data, error } = await supabase.from('companies').insert({
      company_code: 'MURATA',
      company_name: '株式会社村田製作所',
      company_name_romaji: 'Murata Manufacturing Co., Ltd.',
      company_type: ['customer'],
      address: '〒617-8555 長岡京市東神足1-10-1',
      tel: '075-955-6789', fax: '075-955-6790',
    }).select('company_id').single()
    if (error) { console.error('❌ Insert MURATA failed:', error.message); return }
    murataId = data.company_id
    console.log('   ✅ MURATA created:', murataId)
  }

  // ── 2. Products ──
  console.log('\n2. Products...')
  const products = [
    { product_code: 'TRAY-KYO-A1', product_name: 'Khay IC Kyocera Type-A1', company_id: kyoceraId },
    { product_code: 'TRAY-MUR-B2', product_name: 'Khay linh kiện Murata B2', company_id: murataId },
    { product_code: 'TRAY-KYO-C3', product_name: 'Khay Kyocera Series-C3',  company_id: kyoceraId },
  ]
  const productIds = {}
  for (const p of products) {
    const { data: existing } = await supabase
      .from('products').select('product_id').eq('product_code', p.product_code).single()
    if (existing) {
      productIds[p.product_code] = existing.product_id
      console.log(`   ${p.product_code} đã tồn tại: ${existing.product_id}`)
    } else {
      const { data, error } = await supabase.from('products').insert(p).select('product_id').single()
      if (error) { console.error(`❌ Insert ${p.product_code} failed:`, error.message); return }
      productIds[p.product_code] = data.product_id
      console.log(`   ✅ ${p.product_code} created: ${data.product_id}`)
    }
  }

  // ── 3. Orders ──
  console.log('\n3. Orders...')
  const ordersData = [
    { order_no: 'ORD-2026-KYO-001', company_id: kyoceraId, order_date: '2026-07-01', order_status: 'CONFIRMED' },
    { order_no: 'ORD-2026-MUR-002', company_id: murataId,  order_date: '2026-07-05', order_status: 'CONFIRMED' },
  ]
  const orderIds = {}
  for (const o of ordersData) {
    const { data: existing } = await supabase
      .from('orders').select('order_id').eq('order_no', o.order_no).single()
    if (existing) {
      orderIds[o.order_no] = existing.order_id
      console.log(`   ${o.order_no} đã tồn tại: ${existing.order_id}`)
    } else {
      const { data, error } = await supabase.from('orders').insert(o).select('order_id').single()
      if (error) { console.error(`❌ Insert ${o.order_no} failed:`, error.message); return }
      orderIds[o.order_no] = data.order_id
      console.log(`   ✅ ${o.order_no} created: ${data.order_id}`)
    }
  }

  // ── 4. Order Lines ──
  console.log('\n4. Order Lines...')
  const linesData = [
    { order_id: orderIds['ORD-2026-KYO-001'], line_no: 1, product_id: productIds['TRAY-KYO-A1'], quantity: 5000 },
    { order_id: orderIds['ORD-2026-KYO-001'], line_no: 2, product_id: productIds['TRAY-KYO-C3'], quantity: 2000 },
    { order_id: orderIds['ORD-2026-MUR-002'], line_no: 1, product_id: productIds['TRAY-MUR-B2'], quantity: 8000 },
  ]
  const lineIds = []
  for (const l of linesData) {
    const { data: existing } = await supabase
      .from('order_lines').select('line_id').eq('order_id', l.order_id).eq('line_no', l.line_no).single()
    if (existing) {
      lineIds.push(existing.line_id)
      console.log(`   Line ${l.line_no} đã tồn tại: ${existing.line_id}`)
    } else {
      const { data, error } = await supabase.from('order_lines').insert(l).select('line_id').single()
      if (error) { console.error(`❌ Insert order_line failed:`, error.message); return }
      lineIds.push(data.line_id)
      console.log(`   ✅ Line ${l.line_no} created: ${data.line_id}`)
    }
  }

  // ── 5. Production Orders ──
  console.log('\n5. Production Orders...')
  const posData = [
    { po_code: 'PO-2026-001', order_line_id: lineIds[0], planned_quantity: 5000 },
    { po_code: 'PO-2026-002', order_line_id: lineIds[1], planned_quantity: 2000 },
    { po_code: 'PO-2026-003', order_line_id: lineIds[2], planned_quantity: 8000 },
  ]
  const poIds = {}
  for (const po of posData) {
    const { data: existing } = await supabase
      .from('production_orders').select('po_id').eq('po_code', po.po_code).single()
    if (existing) {
      poIds[po.po_code] = existing.po_id
      console.log(`   ${po.po_code} đã tồn tại: ${existing.po_id}`)
    } else {
      const { data, error } = await supabase.from('production_orders').insert(po).select('po_id').single()
      if (error) { console.error(`❌ Insert ${po.po_code} failed:`, error.message); return }
      poIds[po.po_code] = data.po_id
      console.log(`   ✅ ${po.po_code} created: ${data.po_id}`)
    }
  }

  // ── 6. Production Lots ──
  console.log('\n6. Production Lots...')
  const lotsData = [
    { po_id: poIds['PO-2026-001'], lot_no: 'LOT-2026-0701-A', lot_status: 'completed', good_qty: 2480, notes: 'Lô 1/2 đơn A1' },
    { po_id: poIds['PO-2026-001'], lot_no: 'LOT-2026-0709-A', lot_status: 'completed', good_qty: 2510, notes: 'Lô 2/2 đơn A1' },
    { po_id: poIds['PO-2026-002'], lot_no: 'LOT-2026-0714-C', lot_status: 'in_progress', good_qty: 1800, notes: 'C3 đang sản xuất' },
    { po_id: poIds['PO-2026-003'], lot_no: 'LOT-2026-0706-B', lot_status: 'completed', good_qty: 4020, notes: 'QC pass 100%' },
    { po_id: poIds['PO-2026-003'], lot_no: 'LOT-2026-0712-B', lot_status: 'completed', good_qty: 3980, notes: 'NG 20 pcs bavia' },
  ]
  const lotIds = {}
  for (const lot of lotsData) {
    const { data: existing } = await supabase
      .from('production_lots').select('lot_id').eq('lot_no', lot.lot_no).single()
    if (existing) {
      lotIds[lot.lot_no] = existing.lot_id
      console.log(`   ${lot.lot_no} đã tồn tại: ${existing.lot_id}`)
    } else {
      const { data, error } = await supabase.from('production_lots').insert(lot).select('lot_id').single()
      if (error) { console.error(`❌ Insert ${lot.lot_no} failed:`, error.message); return }
      lotIds[lot.lot_no] = data.lot_id
      console.log(`   ✅ ${lot.lot_no} created: ${data.lot_id}`)
    }
  }

  // ── 7. Shipments ──
  console.log('\n7. Shipments...')
  const shipmentsData = [
    {
      order_id: orderIds['ORD-2026-KYO-001'],
      ship_date: '2026-07-15',
      status: 'SHIPPED',
      tracking_no: 'SHP-2026-001',
      delivery_note_no: 'DN-KYO-001',
      notes: '京セラ向け第1便。出荷完了。',
    },
    {
      order_id: orderIds['ORD-2026-KYO-001'],
      ship_date: '2026-07-18',
      status: 'SHIPPED',
      tracking_no: 'SHP-2026-002',
      delivery_note_no: 'DN-KYO-002',
      notes: '京セラ向け第2便(C3)。準備中。',
    },
    {
      order_id: orderIds['ORD-2026-MUR-002'],
      ship_date: '2026-07-19',
      status: 'DELIVERED',
      tracking_no: 'SHP-2026-003',
      delivery_note_no: 'DN-MUR-001',
      notes: '村田向け全数出荷。受領確認済み。',
    },
  ]
  const shipmentIds = []
  for (const s of shipmentsData) {
    const { data: existing } = await supabase
      .from('shipments').select('shipment_id').eq('tracking_no', s.tracking_no).single()
    if (existing) {
      shipmentIds.push(existing.shipment_id)
      console.log(`   ${s.tracking_no} đã tồn tại: ${existing.shipment_id}`)
    } else {
      const { data, error } = await supabase.from('shipments').insert(s).select('shipment_id').single()
      if (error) { console.error(`❌ Insert shipment ${s.tracking_no} failed:`, error.message); return }
      shipmentIds.push(data.shipment_id)
      console.log(`   ✅ ${s.tracking_no} created: ${data.shipment_id}`)
    }
  }

  // ── 8. Shipment Lots ──
  console.log('\n8. Shipment Lots...')
  const slData = [
    { shipment_id: shipmentIds[0], lot_id: lotIds['LOT-2026-0701-A'], qty_shipped: 2480, carton_count: 25, pallet_no: 'PAL-001', notes: 'Lô 1/2 A1' },
    { shipment_id: shipmentIds[0], lot_id: lotIds['LOT-2026-0709-A'], qty_shipped: 2510, carton_count: 25, pallet_no: 'PAL-001', notes: 'Lô 2/2 A1' },
    { shipment_id: shipmentIds[1], lot_id: lotIds['LOT-2026-0714-C'], qty_shipped: 0,    carton_count: 0,  pallet_no: '',        notes: 'Chờ LOT hoàn thành' },
    { shipment_id: shipmentIds[2], lot_id: lotIds['LOT-2026-0706-B'], qty_shipped: 4020, carton_count: 40, pallet_no: 'PAL-002', notes: 'Lô 1/2 B2' },
    { shipment_id: shipmentIds[2], lot_id: lotIds['LOT-2026-0712-B'], qty_shipped: 3980, carton_count: 40, pallet_no: 'PAL-003', notes: 'Lô 2/2 B2' },
  ]
  for (const sl of slData) {
    const { data: existing } = await supabase
      .from('shipment_lots').select('shipment_lot_id')
      .eq('shipment_id', sl.shipment_id).eq('lot_id', sl.lot_id).single()
    if (existing) {
      console.log(`   Shipment-Lot đã tồn tại: ${existing.shipment_lot_id}`)
    } else {
      const { data, error } = await supabase.from('shipment_lots').insert(sl).select('shipment_lot_id').single()
      if (error) { console.error(`❌ Insert shipment_lot failed:`, error.message); return }
      console.log(`   ✅ Shipment-Lot created: ${data.shipment_lot_id}`)
    }
  }

  // ── Verify ──
  console.log('\n─── VERIFY ───')
  const { count } = await supabase.from('shipments').select('*', { count: 'exact', head: true })
  console.log(`📦 Tổng số Shipments trong DB: ${count}`)

  const { data: testQuery, error: testErr } = await supabase
    .from('shipments')
    .select('shipment_id, ship_date, status, tracking_no, delivery_note_no, orders(order_no, companies(company_name))')
    .order('ship_date', { ascending: false })
    .limit(5)

  if (testErr) {
    console.error('❌ Test query failed:', testErr.message)
  } else {
    console.log('\n📋 Dữ liệu Shipments (giống query UI page.tsx):')
    testQuery.forEach(s => {
      console.log(`   ${s.tracking_no} | ${s.ship_date} | ${s.status} | Order: ${s.orders?.order_no || 'N/A'} | KH: ${s.orders?.companies?.company_name || 'N/A'}`)
    })
  }

  console.log('\n✅ SEED HOÀN TẤT! Refresh localhost:3000/orders/shipments để xem dữ liệu.')
}

main().catch(console.error)
