import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function runTestCases() {
  console.log("Looking up data for '1-130-1'...")
  const { data: p } = await supabase.from('product_master').select('id, code').eq('code', '1-130-1').single()
  const { data: items } = await supabase.from('order_items').select('id, order_id').eq('product_id', p.id).limit(1)
  
  if (!items || items.length === 0) {
      console.log("No order items found for this product.")
      return
  }

  const orderId = items[0].order_id
  const orderItemId = items[0].id

  // Helper to call RPC
  const callShip = async (qty, expectedName) => {
    console.log(`\n--- Chạy ${expectedName} ---`)
    const { data, error } = await supabase.rpc('ship_order_items', {
      p_order_id: orderId,
      p_items: [{
        order_item_id: orderItemId,
        product_id: p.id,
        quantity: qty,
        lot_no: "ORD-2026-01-26",
        operator_name: "Test Operator"
      }],
      p_notes: 'Test RPC'
    })
    
    if (error) {
      console.log(`❌ RPC Lỗi:`, error.message || error)
    } else {
      console.log(`✅ Kết quả:`, data)
    }

    // Lấy tồn kho hiện tại
    const { data: stock } = await supabase.from('tray_stock_summary').select('current_stock').eq('product_id', p.id).single()
    console.log(`Tồn kho sau khi chạy: ${stock?.current_stock}`)
  }

  const resetOrder = async () => {
    await supabase.from('orders').update({ status: 'in_production' }).eq('id', orderId)
  }

  // Chạy Case 1
  await resetOrder()
  await callShip(50, "Test Case 1: Xuất 50 / tồn 140")

  // Chạy Case 2
  await resetOrder()
  await callShip(200, "Test Case 2: Xuất 200 / tồn 90 (Kỳ vọng: INSUFFICIENT_STOCK)")

  // Chạy Case 3
  await resetOrder()
  await callShip(-5, "Test Case 3: Xuất âm -5 (Kỳ vọng: INVALID_QTY)")

  // Chạy Case 4
  // Do không reset ở đây, order vẫn mang status in_production vì bị lỗi ở Case 3 (không update).
  // Nên ta chạy ship thành công trước, sau đó chạy Case 4.
  await resetOrder()
  await callShip(1, "Pre-Case 4: Giao 1 khay để chuyển trạng thái sang shipped")
  await callShip(10, "Test Case 4: Đơn đã shipped (Kỳ vọng: ORDER_NOT_SHIPPABLE)")
}

runTestCases()
