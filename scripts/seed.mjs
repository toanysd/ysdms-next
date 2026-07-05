import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('--- YSDMS-NextGen Seed Data Generation ---');
  const ts = Date.now();
  
  // 1. customers -> plastic_master
  console.log('1. Inserting Customer and Plastic Master...');
  const { data: customer, error: errCust } = await supabase.from('customers').insert({
    customer_code: `CUST-${ts}`,
    delivery_name: 'Yamada Manufacturing',
    customer_name_jp: '山田製作所',
    customer_type: 'hq',
    is_active: true
  }).select().single();
  if (errCust) throw errCust;
  
  const { data: plastic, error: errPlas } = await supabase.from('plastic_master').insert({
    code: `PP-${ts}`,
    family: 'PP',
    thickness_mm: 1.2,
    width_mm: 600,
    color: 'Clear'
  }).select().single();
  if (errPlas) throw errPlas;
  
  // 2. machine_type -> machine_model -> machine_instance
  console.log('2. Inserting Machine Hierarchy...');
  const { data: mType } = await supabase.from('machine_type').select('id').limit(1).single();
  const typeId = mType.id;
  
  const { data: model, error: errMod } = await supabase.from('machine_model').insert({
    machine_type_id: typeId,
    model_code: `MDL-${ts}`,
    manufacturer: 'ILLIG'
  }).select().single();
  if (errMod) throw errMod;
  
  const { data: inst, error: errInst } = await supabase.from('machine_instance').insert({
    machine_model_id: model.id,
    internal_code: `MAC-${ts}`,
    name: 'ILLIG Thermoformer 01',
    status: 'active'
  }).select().single();
  if (errInst) throw errInst;

  // 3. mold_base -> mold_design_revision -> mold_physical
  console.log('3. Inserting Mold Hierarchy...');
  const { data: moldBase, error: errMB } = await supabase.from('mold_base').insert({
    code: `MB-${ts}`,
    name: 'Tray Mold Base',
    customer_id: customer.id
  }).select().single();
  if (errMB) throw errMB;

  const { data: moldRev, error: errRev } = await supabase.from('mold_design_revision').insert({
    mold_base_id: moldBase.id,
    revision_code: `REV-${ts}`,
    version_label: 'R1'
  }).select().single();
  if (errRev) throw errRev;

  const { data: moldPhys, error: errPhys } = await supabase.from('mold_physical').insert({
    revision_id: moldRev.id,
    physical_code: `PHYS-${ts}`,
    cavity: 4,
    status: 'ACTIVE'
  }).select().single();
  if (errPhys) throw errPhys;

  // 4. product_master -> product_mold_map -> mold_plastic_bom
  console.log('4. Inserting Product and BOM...');
  const { data: prod, error: errProd } = await supabase.from('product_master').insert({
    code: `PRD-${ts}`,
    name: 'Precision Tray',
    customer_id: customer.id
  }).select().single();
  if (errProd) throw errProd;

  await supabase.from('product_mold_map').insert({
    product_id: prod.id,
    revision_id: moldRev.id
  });

  await supabase.from('mold_plastic_bom').insert({
    revision_id: moldRev.id,
    plastic_id: plastic.id,
    actual_weight_grams: 45,
    scrap_ratio: 0.1
  });

  // 5. orders (in_production) -> order_items
  console.log('5. Inserting Orders...');
  const { data: order, error: errOrd } = await supabase.from('orders').insert({
    slip_no: `SLIP-${ts}`,
    order_date: new Date().toISOString(),
    status: 'in_production',
    customer_id: customer.id
  }).select().single();
  if (errOrd) throw errOrd;

  const { data: orderItem, error: errOI } = await supabase.from('order_items').insert({
    order_id: order.id,
    product_id: prod.id,
    mold_id: moldBase.id,
    quantity: 1000,
    shots_count: 250
  }).select().single();
  if (errOI) throw errOI;

  // 6. production_plans -> production_log
  console.log('6. Inserting Production Data...');
  await supabase.from('production_plans').insert({
    order_item_id: orderItem.id,
    machine_instance_id: inst.id,
    mold_physical_id: moldPhys.id,
    planned_date: new Date().toISOString(),
    planned_quantity: 1000,
    status: 'COMPLETED'
  });

  const { data: log, error: errLog } = await supabase.from('production_log').insert({
    order_item_id: orderItem.id,
    machine_instance_id: inst.id,
    mold_physical_id: moldPhys.id,
    produced_qty: 1000,
    status: 'COMPLETED'
  }).select().single();
  if (errLog) throw errLog;

  // 7. tray_inventory_txn
  console.log('7. Inserting Tray Inventory Transaction...');
  await supabase.from('tray_inventory_txn').insert({
    txn_type: 'IN',
    product_id: prod.id,
    order_item_id: orderItem.id,
    production_log_id: log.id,
    quantity: 1000,
    txn_date: new Date().toISOString(),
    notes: 'Production completed'
  });

  // 8. MRP/BOM Crucial Step
  console.log('8. Triggering automatic plastic deduction...');
  
  const { data: rpcData, error: rpcErr } = await supabase.rpc('auto_deduct_plastic_on_production', {
    p_order_id: order.id
  });

  if (rpcErr && rpcErr.message.includes('does not exist')) {
    console.log('RPC failed due to schema mismatch, falling back to JS implementation (simulating DO block).');
    const weightGrams = 45;
    const scrapRatio = 0.1;
    const shotsCount = orderItem.shots_count;
    const qtyKg = Number((weightGrams * (1 + scrapRatio) * shotsCount / 1000.0).toFixed(4));
    
    const { error: insErr } = await supabase.from('inventory_txn').insert({
      txn_type: 'OUT',
      plastic_id: plastic.id,
      qty_kg: qtyKg,
      ref_vocher: 'ORDER:' + order.id,
      remark: 'Auto-deduct khi Order -> in_production (Fallback JS)'
    });
    if (insErr) throw insErr;
    console.log('Plastic deduction executed successfully (Fallback).');
  } else if (rpcErr) {
    throw rpcErr;
  } else {
    console.log('RPC executed successfully:', rpcData);
  }

  console.log('\nSeed process completed successfully!');
  console.log('Order ID created:', order.id);
}

main().catch(console.error);
