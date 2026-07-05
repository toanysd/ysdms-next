import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify() {
  console.log("Starting E2E Verification for KWE-005 Data Chain...");

  // 1. Get customer KOWA-EMORI
  const { data: customer } = await supabase.from('customers').select('*').eq('customer_code', 'KOWA-EMORI').single();
  if (!customer) throw new Error("Customer KOWA-EMORI not found.");
  console.log("✔ Customer KOWA-EMORI found.");

  // 2. Get product KWE-005 and verify linkage
  const { data: product } = await supabase.from('product_master').select('*').eq('code', 'KWE-005').single();
  if (!product) throw new Error("Product KWE-005 not found.");
  if (product.customer_id !== customer.id) throw new Error(`Product KWE-005 is not linked to KOWA-EMORI (Expected ${customer.id}, got ${product.customer_id}).`);
  console.log("✔ Product KWE-005 is correctly linked to KOWA-EMORI.");

  // 3. Get order item with 80 pcs for this product
  const { data: orderItems } = await supabase.from('order_items').select('*, orders(*)').eq('product_id', product.id).eq('quantity', 80);
  if (!orderItems || orderItems.length === 0) throw new Error("No order item found for KWE-005 with 80 pcs.");
  
  // Find the right one (it should be linked to an order)
  const targetItem = orderItems.find(item => item.orders && item.orders.order_type === 'design_mold');
  if (!targetItem) throw new Error("Could not find order item with parent order having order_type 'design_mold'.");
  
  const order = targetItem.orders;
  console.log(`✔ Order item found for 80 pcs (Order Item ID: ${targetItem.id}).`);

  // 4. Check order status and type
  if (order.status !== 'shipped') throw new Error(`Order status is '${order.status}', expected 'shipped'.`);
  if (order.order_type !== 'design_mold') throw new Error(`Order type is '${order.order_type}', expected 'design_mold'.`);
  console.log(`✔ Order is marked as '${order.status}' and order_type is '${order.order_type}'.`);

  // 5. Check production log
  const { data: logs } = await supabase.from('production_log').select('*').eq('order_item_id', targetItem.id);
  if (!logs || logs.length === 0) throw new Error("Production log not found for this order item.");
  console.log(`✔ Production log exists (Found ${logs.length} logs).`);

  // 6. Check tray_inventory_txn for IN and OUT
  const { data: txns } = await supabase.from('tray_inventory_txn').select('*').eq('order_item_id', targetItem.id);
  const hasIn = txns.some(t => t.txn_type === 'IN');
  const hasOut = txns.some(t => t.txn_type === 'OUT');
  if (!hasIn || !hasOut) throw new Error(`Missing inventory transactions. IN: ${hasIn}, OUT: ${hasOut}.`);
  console.log(`✔ tray_inventory_txn shows both IN and OUT stock transactions.`);

  // 7. Check mold dimensions are set
  if (!targetItem.mold_id) throw new Error("Order item does not have a mold_id linked.");
  const { data: revs } = await supabase.from('mold_design_revision').select('*').eq('mold_base_id', targetItem.mold_id);
  if (!revs || revs.length === 0) throw new Error("No mold_design_revision found for the linked mold_base.");
  
  const rev = revs[0];
  if (rev.length_mm == null || rev.width_mm == null) {
    throw new Error(`Mold dimensions not fully set! Length: ${rev.length_mm}, Width: ${rev.width_mm}.`);
  }
  console.log(`✔ Mold dimensions are set: ${rev.length_mm}x${rev.width_mm} mm.`);

  console.log("\n=====================");
  console.log("VERDICT: VERIFIED");
  console.log("=====================");
}

verify().catch(err => {
  console.error("Verification failed:", err.message);
  process.exit(1);
});
