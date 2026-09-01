const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function backfillLegacyWorkOrders() {
  console.log('--- Starting Backfill of Legacy work_order_id into jobs ---');

  const { data: legacyJobs, error: jobErr } = await supabase
    .from('jobs')
    .select('job_id, job_code, job_name, legacy_id, work_order_id, product_id')
    .is('work_order_id', null)
    .not('legacy_id', 'is', null);

  if (jobErr) {
    console.error('Error fetching jobs:', jobErr);
    return;
  }

  console.log(`Found ${legacyJobs.length} legacy jobs with work_order_id = NULL`);

  let updatedCount = 0;
  for (const job of legacyJobs) {
    const num = job.legacy_id.replace('LEGACY-JOB-', '');
    
    // Find matching work order
    const { data: wo } = await supabase
      .from('work_orders')
      .select('wo_id, wo_code, product_id')
      .eq('legacy_id', `LEGACY-WO-${num}`)
      .maybeSingle();

    if (wo) {
      const updatePayload = {
        work_order_id: wo.wo_id
      };

      // Also link product_id if job has product_id but wo doesn't, or vice-versa
      if (job.product_id && !wo.product_id) {
        await supabase.from('work_orders').update({ product_id: job.product_id }).eq('wo_id', wo.wo_id);
      } else if (!job.product_id && wo.product_id) {
        updatePayload.product_id = wo.product_id;
      }

      const { error: updErr } = await supabase
        .from('jobs')
        .update(updatePayload)
        .eq('job_id', job.job_id);

      if (!updErr) {
        updatedCount++;
      } else {
        console.error(`Failed to update job ${job.job_id}:`, updErr.message);
      }
    }
  }

  console.log(`✅ Successfully backfilled ${updatedCount} / ${legacyJobs.length} legacy jobs!`);

  // Specifically verify JAE-380
  const { data: jaeJob } = await supabase
    .from('jobs')
    .select('job_id, job_code, job_name, work_order_id, legacy_id, work_orders(wo_code, wo_name)')
    .eq('legacy_id', 'LEGACY-JOB-1248')
    .single();

  console.log('JAE-380 Job after backfill:', jaeJob);
}

backfillLegacyWorkOrders();
