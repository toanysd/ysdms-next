import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase URL or Key in environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log('--- E2E Seed Scenario: JAE_351AB ---');
  
  try {
    // 1. Company
    console.log('1. Creating/Finding Company (JAE)...');
    let { data: company } = await supabase.from('companies').select('*').eq('company_code', 'JAE').single();
    if (!company) {
      const { data, error } = await supabase.from('companies').insert({
        company_code: 'JAE',
        company_name: 'Japan Aviation Electronics',
        company_type: ['customer']
      }).select().single();
      if (error && error.code !== 'PGRST116') throw error;
      company = data;
    }

    if (!company) {
       console.log('Could not fetch or insert JAE company. Exiting.');
       return;
    }

    // 2. Product
    console.log('2. Creating/Finding Product (JAE-351AB)...');
    let { data: product } = await supabase.from('products').select('*').eq('product_code', 'JAE-351AB').single();
    if (!product) {
      const { data, error } = await supabase.from('products').insert({
        company_id: company.company_id,
        product_code: 'JAE-351AB',
        product_name_ja: '351AB コネクタトレイ',
        product_name_en: '351AB Connector Tray',
        status: 'mass_production'
      }).select().single();
      if (error && error.code !== 'PGRST116') throw error;
      product = data;
    }

    // 3. Order
    console.log('3. Creating Order & Order Line...');
    const orderNo = `JAE_351AB_20260615`;
    let { data: order } = await supabase.from('orders').select('*').eq('order_no', orderNo).single();
    if (!order) {
      const { data, error } = await supabase.from('orders').insert({
        order_no: orderNo,
        company_id: company.company_id,
        order_date: '2026-06-15',
        order_status: 'NEW',
        order_type: 'design_tray'
      }).select().single();
      if (error && error.code !== 'PGRST116') throw error;
      order = data;
      
      const { data: lineData, error: lineError } = await supabase.from('order_lines').insert({
        order_id: order.order_id,
        line_no: 1,
        product_id: product.product_id,
        quantity: 10000,
        due_date: '2026-06-30'
      }).select().single();
      if (lineError) throw lineError;
    }
    
    let { data: orderLine } = await supabase.from('order_lines').select('*').eq('order_id', order.order_id).single();

    // 4. Tooling: Mold Master & Design Revision (Acts as Engineering Request in V3)
    console.log('4. Creating Mold Master and Design Revision...');
    let { data: moldMaster } = await supabase.from('mold_masters').select('*').eq('product_id', product.product_id).single();
    if (!moldMaster) {
      const { data, error } = await supabase.from('mold_masters').insert({
        product_id: product.product_id,
        mold_master_code: 'M-351AB',
        mold_master_name: 'M-351AB JAE Connector Tray Mold'
      }).select().single();
      if (error && error.code !== 'PGRST116') throw error;
      moldMaster = data;
    }

    let { data: designRev } = await supabase.from('design_revisions').select('*').eq('mold_master_id', moldMaster.mold_master_id).single();
    if (!designRev) {
      const { data, error } = await supabase.from('design_revisions').insert({
        mold_master_id: moldMaster.mold_master_id,
        design_code: 'D-351AB-A',
        status: 'APPROVED',
        company_id: company.company_id
      }).select().single();
      if (error && error.code !== 'PGRST116') throw error;
      designRev = data;
    }

    // 5. Tooling: Mold Revision & Physical Mold
    console.log('5. Creating Mold Revision & Physical Mold...');
    let { data: moldRev } = await supabase.from('mold_revisions').select('*').eq('mold_master_id', moldMaster.mold_master_id).single();
    if (!moldRev) {
      const { data, error } = await supabase.from('mold_revisions').insert({
        mold_master_id: moldMaster.mold_master_id,
        revision_code: 'REV-A',
        revision_name: 'Revision A',
        is_active: true
      }).select().single();
      if (error && error.code !== 'PGRST116') throw error;
      moldRev = data;
    }

    let { data: physicalMold } = await supabase.from('physical_molds').select('*').eq('mold_revision_id', moldRev.revision_id).single();
    if (!physicalMold) {
      const { data, error } = await supabase.from('physical_molds').insert({
        mold_revision_id: moldRev.revision_id,
        system_code: 'M-351AB-01',
        display_name: 'M-351AB Mold',
        physical_stamp: 'M351AB-1',
        usage_status: 'IN_USE'
      }).select().single();
      if (error && error.code !== 'PGRST116') throw error;
      physicalMold = data;
    }

    // 6. Tooling Job
    console.log('6. Creating Tooling Job & Job Step...');
    let { data: jobType } = await supabase.from('job_types').select('*').limit(1).single();
    if (!jobType) {
        console.log('No job type found, creating a dummy one');
        const { data, error } = await supabase.from('job_types').insert({ type_code: 'NEW', type_name: 'New Mold' }).select().single();
        if (error && error.code !== 'PGRST116' && error.code !== '42P01') console.log(error);
        jobType = data || { job_type_id: '00000000-0000-0000-0000-000000000000' };
    }

    let { data: toolingJob } = await supabase.from('jobs').select('*').eq('mold_master_id', moldMaster.mold_master_id).single();
    if (!toolingJob) {
      const { data, error } = await supabase.from('jobs').insert({
        mold_master_id: moldMaster.mold_master_id,
        job_code: 'JOB-M351AB',
        job_name: 'Mold Making JAE-351AB',
        job_type_id: jobType.job_type_id || jobType.id,
        job_status: 'COMPLETED',
        deadline: '2026-06-20'
      }).select().single();
      if (error && error.code !== 'PGRST116') throw error;
      toolingJob = data;
      
      const { error: stepError } = await supabase.from('job_steps').insert({
        job_id: toolingJob.job_id,
        step_no: 1,
        step_name: 'Mold Base CNC',
        track: 'MOLD',
        step_status: 'COMPLETED',
        deadline: '2026-06-18'
      });
      if (stepError) throw stepError;
    }

    // 7. Production Schedule
    console.log('7. Creating Production Schedule (Plan)...');
    let { data: machine } = await supabase.from('machines').select('*').limit(1).single();
    if (!machine) {
       const { data, error } = await supabase.from('machines').insert({
           machine_code: 'M-01',
           machine_name: 'Asano 1',
           machine_type: 'THERMOFORMING'
       }).select().single();
       if (error && error.code !== 'PGRST116') throw error;
       machine = data;
    }

    let { data: schedule } = await supabase.from('production_schedules').select('*').eq('product_id', product.product_id).single();
    if (!schedule) {
      const { data, error } = await supabase.from('production_schedules').insert({
        machine_id: machine.machine_id,
        product_id: product.product_id,
        mold_id: physicalMold.physical_mold_id,
        schedule_date: '2026-06-25',
        shift: 'DAY',
        planned_quantity: 10000,
        status: 'IN_PROGRESS'
      }).select().single();
      if (error && error.code !== 'PGRST116') throw error;
      schedule = data;
    }

    console.log('7.5. Creating Production Order...');
    let { data: prodOrder } = await supabase.from('production_orders').select('*').eq('po_code', 'PO-JAE-01').single();
    if (!prodOrder) {
      const { data, error } = await supabase.from('production_orders').insert({
        po_code: 'PO-JAE-01',
        order_line_id: orderLine.line_id,
        machine_id: machine.machine_id,
        physical_mold_id: physicalMold.physical_mold_id,
        planned_quantity: 10000,
        planned_start: '2026-06-25',
        planned_end: '2026-06-26'
      }).select().single();
      if (error && error.code !== 'PGRST116') throw error;
      prodOrder = data;
    }

    // 8. Worklog (Production Log)
    console.log('8. Creating Worklog (production_logs)...');
    const { error: logError } = await supabase.from('production_logs').insert({
        po_id: prodOrder.po_id,
        machine_id: machine.machine_id,
        log_date: '2026-06-25',
        output_quantity: 4500,
        defect_quantity: 50,
        forming_params_json: { temp_top: 210, temp_bottom: 180, cycle_time: 5.5 }
    });
    if (logError) throw logError;

    // 9. QC (Tray Inspection)
    console.log('9. Creating QC Inspection...');
    const { error: qcError } = await supabase.from('tray_inspections').insert({
        job_id: toolingJob.job_id, // assuming it links to job
        product_id: product.product_id,
        inspection_type: 'TRAY_DIMENSION',
        inspection_stage: 'IN_PROCESS',
        pass_fail: 'PASS',
        measurement_data: { length: 351.2, width: 250.5, height: 15.0, thickness: 1.2 }
    });
    if (qcError) throw qcError;

    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('Failed seeding E2E scenario:', error);
  }
}

main();
