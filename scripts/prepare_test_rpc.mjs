import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function runTest() {
  console.log("Looking up data for '1-130-1'...")
  const { data: p } = await supabase.from('product_master').select('id, code').eq('code', '1-130-1').single()
  if (!p) {
    console.log("Not found product")
    return
  }
  
  let orderItemId = null
  let orderId = null
  const { data: items } = await supabase.from('order_items').select('id, order_id').eq('product_id', p.id).limit(1)
  
  if (items && items.length > 0) {
    orderItemId = items[0].id
    orderId = items[0].order_id
    console.log(`Found Order Item! Product ID: ${p.id}, Order ID: ${orderId}, Order Item ID: ${orderItemId}`)
  } else {
    // create a fake order to test
    const { data: o } = await supabase.from('orders').insert({ status: 'in_production' }).select('id').single()
    const { data: oi } = await supabase.from('order_items').insert({ order_id: o.id, product_id: p.id, quantity: 100 }).select('id').single()
    orderId = o.id
    orderItemId = oi.id
    console.log(`Created fake order! Product ID: ${p.id}, Order ID: ${orderId}, Order Item ID: ${orderItemId}`)
  }

  // Generate the 4 test cases script for the user
  console.log(`
-- TEST SCRIPTS READY
-- Bạn có thể chạy 4 test cases này trực tiếp trong Supabase SQL Editor:

-- Case 1: Xuất 50 / Tồn 140 -> Hợp lệ
SELECT public.ship_order_items(
  '${orderId}',
  '[{
    "order_item_id": "${orderItemId}",
    "product_id":    "${p.id}",
    "quantity":      50,
    "lot_no":        "ORD-2026-01-26",
    "operator_name": "Test Operator"
  }]'::JSONB,
  'Test Case 1: Xuất 50'
);

-- Case 2: Xuất 200 / Tồn 90 -> Báo lỗi INSUFFICIENT_STOCK
SELECT public.ship_order_items(
  '${orderId}',
  '[{
    "order_item_id": "${orderItemId}",
    "product_id":    "${p.id}",
    "quantity":      200,
    "lot_no":        "ORD-2026-01-26",
    "operator_name": "Test Operator"
  }]'::JSONB,
  'Test Case 2: Xuất 200 (Quá Tồn)'
);

-- Case 3: Xuất số lượng âm (-5) -> Báo lỗi INVALID_QTY
SELECT public.ship_order_items(
  '${orderId}',
  '[{
    "order_item_id": "${orderItemId}",
    "product_id":    "${p.id}",
    "quantity":      -5,
    "lot_no":        "ORD-2026-01-26",
    "operator_name": "Test Operator"
  }]'::JSONB,
  'Test Case 3: Xuất Âm'
);

-- (Để test Case 4 Order shipped thì đơn hàng đó đã bị chuyển sang shipped ở Case 1, nên chạy lại Case 1 sẽ trigger Case 4: ORDER_NOT_SHIPPABLE)
`);
}
runTest()
