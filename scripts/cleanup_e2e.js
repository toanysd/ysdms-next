import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data: c } = await supabase.from('customers').select('id').eq('customer_code', 'CUST-E2E-01').single();
  if (c) {
    // Delete order_items first
    const { data: o } = await supabase.from('orders').select('id').eq('customer_id', c.id);
    if (o && o.length > 0) {
      const orderIds = o.map(order => order.id);
      await supabase.from('order_items').delete().in('order_id', orderIds);
      await supabase.from('orders').delete().in('id', orderIds);
    }
    await supabase.from('customers').delete().eq('id', c.id);
  }
  // Also delete any other orders with slip_no like E2E-%
  const { data: e2eOrders } = await supabase.from('orders').select('id').like('slip_no', 'E2E-%');
  if (e2eOrders && e2eOrders.length > 0) {
    const e2eIds = e2eOrders.map(o => o.id);
    await supabase.from('order_items').delete().in('order_id', e2eIds);
    await supabase.from('orders').delete().in('id', e2eIds);
  }

  console.log('Deleted CUST-E2E-01 and related orders');
}

run()
