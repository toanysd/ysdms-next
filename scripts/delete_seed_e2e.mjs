import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('--- Deleting E2E Seed Scenario: JAE_351AB ---');
  
  try {
    const { data: company } = await supabase.from('companies').select('company_id').eq('company_code', 'JAE').single();
    if (!company) {
      console.log('JAE company not found. Already deleted?');
      return;
    }
    const companyId = company.company_id;

    const { data: product } = await supabase.from('products').select('product_id').eq('product_code', 'JAE-351AB').single();
    
    // We can try to delete the company. If 'ON DELETE CASCADE' is active, it deletes everything.
    // However, if not, we delete manually in reverse order.
    
    console.log('1. Deleting QC & Worklogs...');
    if (product) {
       await supabase.from('tray_inspections').delete().eq('product_id', product.product_id);
    }
    
    // Delete production orders & schedules
    if (product) {
       const { data: schedules } = await supabase.from('production_schedules').select('schedule_id').eq('product_id', product.product_id);
       if (schedules && schedules.length > 0) {
           for (let s of schedules) {
               const { data: pOrders } = await supabase.from('production_orders').select('po_id').eq('po_code', 'PO-JAE-01');
               if (pOrders && pOrders.length > 0) {
                   for (let po of pOrders) {
                       await supabase.from('production_logs').delete().eq('po_id', po.po_id);
                       await supabase.from('production_orders').delete().eq('po_id', po.po_id);
                   }
               }
               await supabase.from('production_schedules').delete().eq('schedule_id', s.schedule_id);
           }
       }
    }

    console.log('2. Deleting Tooling Jobs & Molds...');
    if (product) {
       const { data: mm } = await supabase.from('mold_masters').select('mold_master_id').eq('product_id', product.product_id);
       if (mm && mm.length > 0) {
           for (let m of mm) {
               // Get jobs
               const { data: jobs } = await supabase.from('jobs').select('job_id').eq('mold_master_id', m.mold_master_id);
               if (jobs && jobs.length > 0) {
                   for (let j of jobs) {
                       await supabase.from('job_steps').delete().eq('job_id', j.job_id);
                       await supabase.from('jobs').delete().eq('job_id', j.job_id);
                   }
               }
               // Get revisions
               const { data: revs } = await supabase.from('mold_revisions').select('revision_id').eq('mold_master_id', m.mold_master_id);
               if (revs && revs.length > 0) {
                   for (let r of revs) {
                       await supabase.from('physical_molds').delete().eq('mold_revision_id', r.revision_id);
                       await supabase.from('mold_revisions').delete().eq('revision_id', r.revision_id);
                   }
               }
               await supabase.from('design_revisions').delete().eq('mold_master_id', m.mold_master_id);
               await supabase.from('mold_masters').delete().eq('mold_master_id', m.mold_master_id);
           }
       }
    }

    console.log('3. Deleting Orders...');
    const { data: order } = await supabase.from('orders').select('order_id').eq('order_no', 'JAE_351AB_20260615').single();
    if (order) {
       await supabase.from('order_lines').delete().eq('order_id', order.order_id);
       await supabase.from('orders').delete().eq('order_id', order.order_id);
    }

    console.log('4. Deleting Product and Company...');
    if (product) {
       await supabase.from('products').delete().eq('product_id', product.product_id);
    }
    await supabase.from('companies').delete().eq('company_id', companyId);

    console.log('--- DELETION COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('Failed deleting E2E scenario:', error);
  }
}

main();
