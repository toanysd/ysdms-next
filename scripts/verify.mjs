import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const orderId = process.argv[2];
  if (!orderId) {
    console.error('Please provide an order ID to verify. Usage: node verify.mjs <order_id>');
    process.exit(1);
  }

  console.log(`Verifying E2E data chain for Order: ${orderId}...`);

  const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();
  if (!order) throw new Error('Order not found');
  console.log('- Order exists:', order.id);

  const { data: orderItems } = await supabase.from('order_items').select('*').eq('order_id', orderId);
  if (!orderItems || orderItems.length === 0) throw new Error('Order items not found');
  const oi = orderItems[0];
  console.log('- Order Item exists:', oi.id);

  const { data: product } = await supabase.from('product_master').select('*').eq('id', oi.product_id).single();
  if (!product) throw new Error('Product not found');
  console.log('- Product exists:', product.id);

  const { data: log } = await supabase.from('production_log').select('*').eq('order_item_id', oi.id);
  if (!log || log.length === 0) throw new Error('Production log not found');
  console.log('- Production Log exists:', log[0].id);

  const { data: trayTxn } = await supabase.from('tray_inventory_txn').select('*').eq('order_item_id', oi.id);
  if (!trayTxn || trayTxn.length === 0) throw new Error('Tray inventory txn not found');
  console.log('- Tray Inventory Transaction (IN) exists');

  const { data: plasticTxn } = await supabase.from('inventory_txn')
    .select('*')
    .eq('ref_vocher', 'ORDER:' + orderId)
    .eq('txn_type', 'OUT');

  if (!plasticTxn || plasticTxn.length === 0) {
    throw new Error('Verification FAILED: Plastic deduction transaction not found in inventory_txn!');
  }
  
  console.log('- Plastic Deduction Transaction (OUT) exists:', plasticTxn[0].qty_kg, 'kg');
  console.log('\nVerification SUCCESSFUL. The E2E chain is unbroken.');
}

main().catch(console.error);
