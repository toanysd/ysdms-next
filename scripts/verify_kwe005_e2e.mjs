import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing Supabase URL or Key in environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log("Starting E2E Data Chain Verification for KWE-005...");

  // 1. KWE-005 product linked to KOWA-EMORI customer
  console.log("\n[1/5] Checking Product & Customer Link...");
  const { data: products, error: prodErr } = await supabase
    .from('product_master')
    .select('*, customers(*)')
    .ilike('name', '%KWE-005%')
    .not('customer_id', 'is', null)
    .limit(1);

  if (prodErr) throw new Error("Failed to fetch product: " + prodErr.message);
  if (!products || products.length === 0) {
    throw new Error("KWE-005 product with linked customer not found.");
  }

  const product = products[0];
  const customer = product.customers;

  if (!customer) {
    throw new Error("Product found but customer object is null.");
  }

  console.log(`✅ Product Found: ${product.name} (ID: ${product.id})`);
  console.log(`✅ Customer Linked: ${customer.customer_name_jp} / ${customer.customer_code} (ID: ${customer.id})`);

  if (!customer.customer_name_jp.includes("興和江守") && !customer.customer_code.includes("KOWA-EMORI")) {
     throw new Error("Customer is not KOWA-EMORI. Found: " + customer.customer_name_jp);
  }

  // 2. Order placed for 80 pcs
  console.log("\n[2/5] Checking Order and Order Items...");
  const { data: orderItems, error: oiErr } = await supabase
    .from('order_items')
    .select('*, orders(*)')
    .eq('product_id', product.id)
    .eq('quantity', 80)
    .limit(1);

  if (oiErr) throw new Error("Failed to fetch order items: " + oiErr.message);
  if (!orderItems || orderItems.length === 0) {
    throw new Error("Order item for 80 pcs of KWE-005 not found.");
  }

  const orderItem = orderItems[0];
  const order = orderItem.orders;

  console.log(`✅ Order Item Found (Quantity: ${orderItem.quantity}, ID: ${orderItem.id})`);
  console.log(`✅ Order Found (Slip No: ${order.slip_no}, ID: ${order.id})`);

  // 3. Order is marked as shipped
  console.log("\n[3/5] Checking Order Status...");
  if (order.status !== 'shipped') {
    throw new Error(`Order is not shipped. Current status: ${order.status}`);
  }
  console.log(`✅ Order Status is '${order.status}'`);

  // 4. Production log exists
  console.log("\n[4/5] Checking Production Log...");
  const { data: pLogs, error: plErr } = await supabase
    .from('production_log')
    .select('*')
    .eq('order_item_id', orderItem.id);

  if (plErr) throw new Error("Failed to fetch production log: " + plErr.message);
  if (!pLogs || pLogs.length === 0) {
    throw new Error("Production log not found for this order item.");
  }
  
  const log = pLogs[0];
  console.log(`✅ Production Log Found (Produced Qty: ${log.produced_qty}, Status: ${log.status})`);

  // 5. tray_inventory_txn shows IN and OUT
  console.log("\n[5/5] Checking Tray Inventory Transactions...");
  const { data: txns, error: txnErr } = await supabase
    .from('tray_inventory_txn')
    .select('*')
    .eq('order_item_id', orderItem.id);

  if (txnErr) throw new Error("Failed to fetch tray inventory txns: " + txnErr.message);
  
  const inTxns = txns.filter(t => t.txn_type === 'IN');
  const outTxns = txns.filter(t => t.txn_type === 'OUT');

  if (inTxns.length === 0) throw new Error("No IN transaction found for this order item.");
  if (outTxns.length === 0) throw new Error("No OUT transaction found for this order item.");

  console.log(`✅ IN transaction found (Qty: ${inTxns[0].quantity})`);
  console.log(`✅ OUT transaction found (Qty: ${outTxns[0].quantity})`);

  console.log("\n------------------------------------------------");
  console.log("VERIFIED: All data chain assertions passed successfully.");
  console.log("------------------------------------------------");
}

main().catch((err) => {
  console.error("\n❌ VERIFICATION FAILED:", err.message);
  process.exit(1);
});
