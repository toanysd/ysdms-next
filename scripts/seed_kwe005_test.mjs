import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase URL or Key in environment variables. Run with --env-file=.env.local");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('--- Seeding Kowa Emori (KWE-005) E2E Data ---');

  try {
    // 1. Insert customers
    console.log('1. Inserting Customer (KOWA-EMORI-TEST)...');
    let customer;
    const { data: extCust } = await supabase.from('customers').select('*').eq('customer_code', 'KOWA-EMORI-TEST').maybeSingle();
    if (extCust) {
      customer = extCust;
      console.log(` -> Customer exists: ${customer.id}`);
    } else {
      const { data, error } = await supabase.from('customers').insert({
        customer_code: 'KOWA-EMORI-TEST',
        delivery_name: 'アドガワエレクトロニクス(株)',
        delivery_address: '滋賀県高島市安曇川町田中2668',
        customer_name_jp: '興和江守株式会社',
        customer_type: 'hq',
        contact_person: '中口凛太良, 北野孝彦, 川端那月',
        is_active: true
      }).select().single();
      if (error) throw error;
      customer = data;
      console.log(` -> Customer inserted: ${customer.id}`);
    }

    // Insert plastic_master
    let plastic;
    const { data: extPlas } = await supabase.from('plastic_master').select('*').eq('code', 'PET-G-1.0').maybeSingle();
    if (extPlas) {
      plastic = extPlas;
      console.log(` -> Plastic exists: ${plastic.id}`);
    } else {
      const { data, error } = await supabase.from('plastic_master').insert({
        code: 'PET-G-1.0',
        family: 'PET',
        thickness_mm: 1.0,
        width_mm: 600,
        color: 'Green'
      }).select().single();
      if (error) throw error;
      plastic = data;
      console.log(` -> Plastic inserted: ${plastic.id}`);
    }

    // 2. Insert product_master
    console.log('2. Inserting Product Master (KWE-005)...');
    let prod;
    const { data: extProd } = await supabase.from('product_master').select('*').eq('code', 'KWE-005').maybeSingle();
    if (extProd) {
      const { data, error } = await supabase.from('product_master').update({
        name: 'T73 camera board tray / T73カメラ基板外形変更',
        material: 'PET Green (PET緑)',
        customer_id: customer.id,
      }).eq('id', extProd.id).select().single();
      if (error) throw error;
      prod = data;
      console.log(` -> Product updated: ${prod.id}`);
    } else {
      const { data, error } = await supabase.from('product_master').insert({
        code: 'KWE-005',
        name: 'T73 camera board tray / T73カメラ基板外形変更',
        material: 'PET Green (PET緑)',
        customer_id: customer.id,
        is_active: true
      }).select().single();
      if (error) throw error;
      prod = data;
      console.log(` -> Product inserted: ${prod.id}`);
    }

    // 3. Insert Orders
    console.log('3. Inserting Orders (PO: 4125887)...');
    let order;
    const { data: extOrd } = await supabase.from('orders').select('*').eq('slip_no', 'PO-4125887').maybeSingle();
    if (extOrd) {
      order = extOrd;
      console.log(` -> Order exists: ${order.id}`);
    } else {
      const { data, error } = await supabase.from('orders').insert({
        slip_no: 'PO-4125887',
        order_date: new Date().toISOString().split('T')[0],
        status: 'in_production',
        customer_id: customer.id,
        recipient_name: 'アドガワエレクトロニクス(株)',
        delivery_address: '滋賀県高島市安曇川町田中2668'
      }).select().single();
      if (error) throw error;
      order = data;
      console.log(` -> Order inserted: ${order.id}`);
    }

    // 4. Insert Mold Hierarchy
    console.log('4. Inserting Mold Hierarchy...');
    let moldBase;
    const { data: extMB } = await supabase.from('mold_base').select('*').eq('code', 'MB-KWE-005').maybeSingle();
    if (extMB) {
      moldBase = extMB;
      console.log(` -> Mold Base exists: ${moldBase.id}`);
    } else {
      const { data, error } = await supabase.from('mold_base').insert({
        code: 'MB-KWE-005',
        name: 'MB-KWE-005',
        customer_id: customer.id
      }).select().single();
      if (error) throw error;
      moldBase = data;
      console.log(` -> Mold Base inserted: ${moldBase.id}`);
    }

    let moldRev;
    const { data: extRev } = await supabase.from('mold_design_revision').select('*').eq('revision_code', 'KWE-005-R1').maybeSingle();
    if (extRev) {
      const { data, error } = await supabase.from('mold_design_revision').update({
        length_mm: 355,
        width_mm: 240
      }).eq('id', extRev.id).select().single();
      if (error) throw error;
      moldRev = data;
      console.log(` -> Mold Design Revision updated: ${moldRev.id}`);
    } else {
      const { data, error } = await supabase.from('mold_design_revision').insert({
        mold_base_id: moldBase.id,
        revision_code: 'KWE-005-R1',
        version_label: 'R1',
        length_mm: 355,
        width_mm: 240
      }).select().single();
      if (error) throw error;
      moldRev = data;
      console.log(` -> Mold Design Revision inserted: ${moldRev.id}`);
    }

    let moldPhys;
    const { data: extPhys } = await supabase.from('mold_physical').select('*').eq('physical_code', 'PHYS-KWE-005').maybeSingle();
    if (extPhys) {
      moldPhys = extPhys;
      console.log(` -> Mold Physical exists: ${moldPhys.id}`);
    } else {
      const { data, error } = await supabase.from('mold_physical').insert({
        revision_id: moldRev.id,
        physical_code: 'PHYS-KWE-005',
        cavity: 1,
        status: 'ACTIVE'
      }).select().single();
      if (error) throw error;
      moldPhys = data;
      console.log(` -> Mold Physical inserted: ${moldPhys.id}`);
    }

    // Teflon log linked to physical
    const { data: extTeflon } = await supabase.from('mold_teflon_logs').select('*').eq('mold_physical_id', moldPhys.id).eq('reason', 'Initial coating').maybeSingle();
    if (extTeflon) {
      console.log(` -> Mold Teflon Log exists: ${extTeflon.id}`);
    } else {
      const { data: teflon, error: errTeflon } = await supabase.from('mold_teflon_logs').insert({
        mold_physical_id: moldPhys.id,
        status: 'RECEIVED',
        coating_type: 'Teflon',
        reason: 'Initial coating'
      }).select().single();
      if (errTeflon) throw errTeflon;
      console.log(` -> Mold Teflon Log inserted: ${teflon.id}`);

      // Teflon State Update
      const { error: errUpd } = await supabase.from('mold_physical').update({
        teflon_count: 1,
        last_teflon_date: new Date().toISOString().split('T')[0]
      }).eq('id', moldPhys.id);
      if (errUpd) throw errUpd;
      console.log(` -> Mold Physical Teflon state updated`);
    }

    // Map Product to Mold
    const { data: extMap } = await supabase.from('product_mold_map').select('*').eq('product_id', prod.id).eq('revision_id', moldRev.id).maybeSingle();
    if (!extMap) {
      const { error: errMap } = await supabase.from('product_mold_map').insert({
        product_id: prod.id,
        revision_id: moldRev.id
      });
      if (errMap) throw errMap;
      console.log(` -> Product Mold Map inserted`);
    }

    const { data: extBom } = await supabase.from('mold_plastic_bom').select('*').eq('revision_id', moldRev.id).eq('plastic_id', plastic.id).maybeSingle();
    if (!extBom) {
      const { error: errBom } = await supabase.from('mold_plastic_bom').insert({
        revision_id: moldRev.id,
        plastic_id: plastic.id,
        actual_weight_grams: 50,
        scrap_ratio: 0.1
      });
      if (errBom) throw errBom;
      console.log(` -> Mold Plastic BOM inserted`);
    }

    // 5. Insert order_items
    console.log('5. Inserting Order Items (Qty: 80, 190000 JPY)...');
    let orderItem;
    const { data: extOI } = await supabase.from('order_items').select('*').eq('order_id', order.id).eq('line_no', 1).maybeSingle();
    if (extOI) {
      orderItem = extOI;
      console.log(` -> Order Item exists: ${orderItem.id}`);
    } else {
      const { data, error } = await supabase.from('order_items').insert({
        order_id: order.id,
        line_no: 1,
        product_id: prod.id,
        mold_id: moldBase.id,
        quantity: 80,
        unit_price: 2375, // 80 * 2375 = 190,000
        shots_count: 80,
        delivery_date: '2025-12-19'
      }).select().single();
      if (error) throw error;
      orderItem = data;
      console.log(` -> Order Item inserted: ${orderItem.id}`);
    }

    // 6. Insert cutter_master
    console.log('6. Inserting Cutter Master...');
    let cutter;
    const { data: extCutter } = await supabase.from('cutter_master').select('*').eq('code', 'CUT-KWE-005').maybeSingle();
    if (extCutter) {
      cutter = extCutter;
      console.log(` -> Cutter exists: ${cutter.id}`);
    } else {
      const { data, error } = await supabase.from('cutter_master').insert({
        code: 'CUT-KWE-005',
        width_rule: 'N/A',
        status: 'ACTIVE'
      }).select().single();
      if (error) throw error;
      cutter = data;
      console.log(` -> Cutter inserted: ${cutter.id}`);
    }

    // Link cutter to mold revision
    const { data: extCutterConfig } = await supabase.from('mold_cutter_config').select('*').eq('revision_id', moldRev.id).eq('cutter_id', cutter.id).maybeSingle();
    if (!extCutterConfig) {
      const { error } = await supabase.from('mold_cutter_config').insert({
        revision_id: moldRev.id,
        cutter_id: cutter.id
      });
      if (error) throw error;
      console.log(` -> Mold Cutter Config inserted`);
    }

    // 7. Get Machine Instance
    console.log('7. Finding Machine Instance...');
    let machineId;
    const { data: machine } = await supabase.from('machine_instance')
      .select('id')
      .eq('internal_code', '5号機')
      .maybeSingle();

    if (machine) {
      machineId = machine.id;
    } else {
      console.log(' -> 5号機 not found, inserting a fallback machine...');
      const { data: mType } = await supabase.from('machine_type').select('id').limit(1).single();
      
      let model;
      const { data: extModel } = await supabase.from('machine_model').select('*').eq('model_code', 'MDL-5G').maybeSingle();
      if (extModel) {
        model = extModel;
      } else {
        const { data, error } = await supabase.from('machine_model').insert({
          machine_type_id: mType.id,
          model_code: 'MDL-5G'
        }).select().single();
        if (error) throw error;
        model = data;
      }
      
      const { data: inst, error: instErr } = await supabase.from('machine_instance').insert({
        machine_model_id: model.id,
        internal_code: '5号機',
        name: '5号機'
      }).select().single();
      if (instErr) throw instErr;
      machineId = inst.id;
    }
    console.log(` -> Machine Instance ID: ${machineId}`);

    // 8. Insert production_plans and production_log
    console.log('8. Inserting Production Plans & Log...');
    let plan;
    const { data: extPlan } = await supabase.from('production_plans').select('*').eq('order_item_id', orderItem.id).eq('machine_instance_id', machineId).eq('mold_physical_id', moldPhys.id).maybeSingle();
    if (extPlan) {
      plan = extPlan;
      console.log(` -> Production Plan exists: ${plan.id}`);
    } else {
      const { data, error } = await supabase.from('production_plans').insert({
        order_item_id: orderItem.id,
        machine_instance_id: machineId,
        mold_physical_id: moldPhys.id,
        planned_date: new Date().toISOString().split('T')[0],
        planned_quantity: 80,
        status: 'COMPLETED',
        priority: 5
      }).select().single();
      if (error) throw error;
      plan = data;
      console.log(` -> Production Plan inserted: ${plan.id}`);
    }

    let log;
    const { data: extLog } = await supabase.from('production_log').select('*').eq('order_item_id', orderItem.id).eq('machine_instance_id', machineId).eq('mold_physical_id', moldPhys.id).maybeSingle();
    if (extLog) {
      log = extLog;
      console.log(` -> Production Log exists: ${log.id}`);
    } else {
      const { data, error } = await supabase.from('production_log').insert({
        order_item_id: orderItem.id,
        machine_instance_id: machineId,
        mold_physical_id: moldPhys.id,
        cutter_id: cutter.id,
        produced_qty: 80,
        status: 'COMPLETED',
        start_time: new Date().toISOString()
      }).select().single();
      if (error) throw error;
      log = data;
      console.log(` -> Production Log inserted: ${log.id}`);
    }

    // 9. Crucial Step: Insert an IN record into tray_inventory_txn
    console.log('9. Inserting IN record into tray_inventory_txn (Qty 80)...');
    let txn;
    const { data: extTxn } = await supabase.from('tray_inventory_txn').select('*').eq('production_log_id', log.id).eq('txn_type', 'IN').maybeSingle();
    if (extTxn) {
      txn = extTxn;
      console.log(` -> Inventory IN Txn exists: ${txn.id}`);
    } else {
      const { data, error } = await supabase.from('tray_inventory_txn').insert({
        txn_type: 'IN',
        product_id: prod.id,
        order_item_id: orderItem.id,
        production_log_id: log.id,
        quantity: 80,
        txn_date: new Date().toISOString().split('T')[0],
        notes: 'Production completed'
      }).select().single();
      if (error) throw error;
      txn = data;
      console.log(` -> Inventory IN Txn inserted: ${txn.id}`);
    }

    // 10. Call Supabase RPC ship_order_items
    console.log('10. Calling ship_order_items RPC...');
    const { data: currentOrder } = await supabase.from('orders').select('status').eq('id', order.id).single();
    if (currentOrder && currentOrder.status !== 'shipped' && currentOrder.status !== 'SHIPPED') {
      const { data: rpcData, error: rpcErr } = await supabase.rpc('ship_order_items', {
        p_order_id: order.id,
        p_items: [{
          product_id: prod.id,
          quantity: 80,
          order_item_id: orderItem.id,
          lot_no: 'LOT-KWE-005',
          operator_name: 'Seed Script'
        }],
        p_notes: 'Shipment of PO 4125887'
      });
      if (rpcErr) throw rpcErr;
      console.log(` -> RPC executed successfully:`, rpcData);
    } else {
      console.log(' -> Order already shipped, skipping RPC...');
    }

    // Verify order status
    const { data: finalOrder } = await supabase.from('orders').select('status').eq('id', order.id).single();
    console.log(` -> Final Order Status: ${finalOrder.status}`);

    console.log('\n✅ KWE-005 Seed completed successfully!');
  } catch (error) {
    console.error('\n❌ Error during seed:', error);
    process.exit(1);
  }
}

main();
