import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase URL or Key in environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify() {
  console.log("Starting verification of KWE-005 data chain...");

  // 1. Find the customer
  const { data: customers, error: cErr } = await supabase
    .from('customers')
    .select('*')
    .ilike('customer_code', 'KOWA-EMORI-%')
    .order('created_at', { ascending: false })
    .limit(1);

  if (cErr || !customers || customers.length === 0) {
    throw new Error("Customer KOWA-EMORI not found.");
  }
  const customer = customers[0];
  console.log(`[OK] Found Customer: ${customer.customer_code} (${customer.id})`);

  // 2. Find the product KWE-005 linked to this customer
  const { data: products, error: pErr } = await supabase
    .from('product_master')
    .select('*')
    .eq('customer_id', customer.id)
    .ilike('code', 'KWE-005-%')
    .order('created_at', { ascending: false })
    .limit(1);

  if (pErr || !products || products.length === 0) {
    throw new Error("Product KWE-005 not found for this customer.");
  }
  const product = products[0];
  console.log(`[OK] Found Product: ${product.code} (${product.id}) linked to KOWA-EMORI`);

  // 3. Find the order items for this product
  const { data: orderItems, error: oiErr } = await supabase
    .from('order_items')
    .select('*, orders!inner(*)')
    .eq('product_id', product.id)
    .order('created_at', { ascending: false })
    .limit(1);

  if (oiErr || !orderItems || orderItems.length === 0) {
    throw new Error("Order item not found for product KWE-005.");
  }
  const orderItem = orderItems[0];
  const order = orderItem.orders;
  
  if (orderItem.quantity !== 80) {
    throw new Error(`Order quantity is ${orderItem.quantity}, expected 80.`);
  }
  console.log(`[OK] Found Order Item: quantity is 80 (order_item_id: ${orderItem.id})`);

  // 4. Verify order is marked as shipped
  if (order.status !== 'shipped') {
    throw new Error(`Order status is ${order.status}, expected 'shipped'.`);
  } else {
    console.log(`[OK] Order status is 'shipped'.`);
  }

  // 5. Verify production_log exists
  const { data: prodLogs, error: plErr } = await supabase
    .from('production_log')
    .select('*')
    .eq('order_item_id', orderItem.id);

  if (plErr || !prodLogs || prodLogs.length === 0) {
    throw new Error("Production log not found for order item.");
  }
  console.log(`[OK] Found Production Log(s) for the order item.`);

  // 6. Verify tray_inventory_txn shows IN and OUT stock transactions
  const { data: txns, error: txErr } = await supabase
    .from('tray_inventory_txn')
    .select('*')
    .eq('product_id', product.id);

  if (txErr || !txns || txns.length === 0) {
    throw new Error("Tray inventory transactions not found for product.");
  }

  const inTxn = txns.filter(t => t.txn_type === 'IN');
  const outTxn = txns.filter(t => t.txn_type === 'OUT');

  if (inTxn.length === 0) {
    throw new Error("Missing IN transaction in tray_inventory_txn.");
  }
  console.log(`[OK] Found IN transaction(s) in tray_inventory_txn (Qty: ${inTxn.reduce((acc, t)=>acc+t.quantity, 0)})`);

  if (outTxn.length === 0) {
    throw new Error("Missing OUT transaction in tray_inventory_txn.");
  }
  console.log(`[OK] Found OUT transaction(s) in tray_inventory_txn (Qty: ${outTxn.reduce((acc, t)=>acc+t.quantity, 0)})`);

  console.log("\nVERDICT: VERIFIED");
}

verify().catch(err => {
  console.error("\nVERDICT: FAILED");
  console.error(err.message);
  process.exit(1);
});
