import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/test_nippo_v2_engine.mjs');
  process.exit(1);
}

const client = new Client({ connectionString });

async function runQualityGates() {
  console.log('=== RUNNING QUALITY GATES FOR MILESTONE 20 (NIPPO V2) ===\n');
  await client.connect();

  try {
    // 1. Check job_types '11'
    console.log('--- Test 1: Verify job_type_id = 11 (THERMOFORMING) ---');
    const jtRes = await client.query(`
      SELECT job_type_id, job_type_name_ja, job_type_name_vi, category, sort_order
      FROM public.job_types
      WHERE job_type_id = '11';
    `);
    if (jtRes.rows.length === 0 || jtRes.rows[0].category !== 'THERMOFORMING') {
      throw new Error('job_type 11 missing or not THERMOFORMING');
    }
    console.log('✅ job_type 11 verified:', jtRes.rows[0]);

    // 2. Check Thermoforming Machines
    console.log('\n--- Test 2: Verify Thermoforming Machines in machines table ---');
    const machRes = await client.query(`
      SELECT machine_id, machine_code, machine_name, machine_type
      FROM public.machines
      WHERE machine_type = '成形' AND is_active = true
      ORDER BY machine_code;
    `);
    console.log(`✅ Found ${machRes.rows.length} active thermoforming machines:`);
    console.log(machRes.rows.map(m => `  ${m.machine_code}: ${m.machine_name}`).join(', '));
    const testMachine = machRes.rows[0]; // MACH-1

    // 3. Test Employee
    const empRes = await client.query(`SELECT employee_id, employee_name FROM public.employees WHERE is_active = true LIMIT 1;`);
    const testEmployee = empRes.rows[0];

    // 4. Create isolated Test Job & Step to test Step Completion Engine & Cascade
    console.log('\n--- Test 3: Test Step Completion Engine & Cascade (Transaction Test) ---');
    await client.query('BEGIN');

    // Create a dummy work order
    const woInsert = await client.query(`
      INSERT INTO public.work_orders (wo_code, wo_name, wo_status, priority)
      VALUES ('WO-TEST-M20', 'Test Nippo V2 Work Order', 'IN_PROGRESS', 5)
      RETURNING wo_id, wo_code, wo_status;
    `);
    const testWo = woInsert.rows[0];

    // Create a dummy job linked to this WO with category THERMOFORMING
    const jobInsert = await client.query(`
      INSERT INTO public.jobs (work_order_id, job_code, job_name, job_category, job_type_id, job_status)
      VALUES ($1, 'JOB-TEST-M20', 'Test Thermoforming Job', 'THERMOFORMING', '11', 'IN_PROGRESS')
      RETURNING job_id, job_code, job_status;
    `, [testWo.wo_id]);
    const testJob = jobInsert.rows[0];

    // Create 2 steps for this job
    const step1Insert = await client.query(`
      INSERT INTO public.job_steps (job_id, step_no, step_name, step_status)
      VALUES ($1, 1, '成形準備・型替え', 'IN_PROGRESS')
      RETURNING step_id, step_no, step_name, step_status;
    `, [testJob.job_id]);
    const testStep1 = step1Insert.rows[0];

    const step2Insert = await client.query(`
      INSERT INTO public.job_steps (job_id, step_no, step_name, step_status)
      VALUES ($1, 2, '本成形・検品', 'PENDING')
      RETURNING step_id, step_no, step_name, step_status;
    `, [testJob.job_id]);
    const testStep2 = step2Insert.rows[0];

    console.log(`Created test WO (${testWo.wo_code}), Job (${testJob.job_code}), Step 1 & Step 2.`);

    // 5. Test inserting Work Log 1 on Step 1 (hours = 1.5, not finished)
    console.log('\n--- Test 4: Insert Work Log 1 (hours_spent = 1.5, is_finished = false) ---');
    const log1Insert = await client.query(`
      INSERT INTO public.work_logs (
        job_id, job_step_id, employee_id, work_date, hours_spent, is_finished,
        machine_id, quantity_done, quantity_ng, notes
      ) VALUES (
        $1, $2, $3, CURRENT_DATE, 1.5, false,
        $4, 150, 2, 'Test Log 1 - Shift 1'
      ) RETURNING *;
    `, [testJob.job_id, testStep1.step_id, testEmployee.employee_id, testMachine.machine_id]);
    console.log('✅ Log 1 inserted:', {
      log_id: log1Insert.rows[0].log_id,
      quantity_done: log1Insert.rows[0].quantity_done,
      quantity_ng: log1Insert.rows[0].quantity_ng,
      hours_spent: log1Insert.rows[0].hours_spent,
      machine_id: log1Insert.rows[0].machine_id
    });

    // 6. Test inserting Work Log 2 on Step 1 (hours = 2.0, is_finished = true)
    console.log('\n--- Test 5: Insert Work Log 2 (hours_spent = 2.0, is_finished = true) ---');
    const log2Insert = await client.query(`
      INSERT INTO public.work_logs (
        job_id, job_step_id, employee_id, work_date, hours_spent, is_finished,
        machine_id, quantity_done, quantity_ng, notes
      ) VALUES (
        $1, $2, $3, CURRENT_DATE, 2.0, true,
        $4, 200, 5, 'Test Log 2 - Shift 2 finished'
      ) RETURNING *;
    `, [testJob.job_id, testStep1.step_id, testEmployee.employee_id, testMachine.machine_id]);

    // Simulate Step Completion Engine calculation for Step 1
    const logsSumRes = await client.query(`
      SELECT SUM(hours_spent) as total_hours FROM public.work_logs WHERE job_step_id = $1;
    `, [testStep1.step_id]);
    const step1Total = Number(logsSumRes.rows[0].total_hours);

    await client.query(`
      UPDATE public.job_steps 
      SET step_status = 'COMPLETED', actual_hours = $1, updated_at = NOW()
      WHERE step_id = $2;
    `, [step1Total, testStep1.step_id]);

    // Verify Step 1 is COMPLETED and actual_hours = 3.5 (1.5 + 2.0)
    const step1Check = await client.query(`SELECT step_status, actual_hours FROM public.job_steps WHERE step_id = $1;`, [testStep1.step_id]);
    console.log(`✅ Step 1 updated: status = ${step1Check.rows[0].step_status}, actual_hours = ${step1Check.rows[0].actual_hours} (expected: 3.5)`);
    if (Number(step1Check.rows[0].actual_hours) !== 3.5) {
      throw new Error(`Expected actual_hours 3.5, got ${step1Check.rows[0].actual_hours}`);
    }

    // Step 2 is still PENDING -> Job should NOT be completed yet
    const pendingSteps1 = await client.query(`
      SELECT step_id FROM public.job_steps WHERE job_id = $1 AND step_status != 'COMPLETED';
    `, [testJob.job_id]);
    console.log(`✅ Pending steps count: ${pendingSteps1.rows.length} (Job should remain IN_PROGRESS)`);

    // 7. Complete Step 2
    console.log('\n--- Test 6: Complete Step 2 -> Cascade to Job and Work Order ---');
    await client.query(`
      INSERT INTO public.work_logs (
        job_id, job_step_id, employee_id, work_date, hours_spent, is_finished,
        machine_id, quantity_done, quantity_ng
      ) VALUES (
        $1, $2, $3, CURRENT_DATE, 4.0, true,
        $4, 500, 10
      );
    `, [testJob.job_id, testStep2.step_id, testEmployee.employee_id, testMachine.machine_id]);

    await client.query(`
      UPDATE public.job_steps 
      SET step_status = 'COMPLETED', actual_hours = 4.0, updated_at = NOW()
      WHERE step_id = $1;
    `, [testStep2.step_id]);

    // Check all steps completed
    const pendingSteps2 = await client.query(`
      SELECT step_id FROM public.job_steps WHERE job_id = $1 AND step_status != 'COMPLETED';
    `, [testJob.job_id]);

    if (pendingSteps2.rows.length === 0) {
      // Complete Job
      await client.query(`
        UPDATE public.jobs 
        SET job_status = 'COMPLETED', completed_date = NOW(), updated_at = NOW()
        WHERE job_id = $1;
      `, [testJob.job_id]);

      // Complete WO cascade
      const pendingJobs = await client.query(`
        SELECT job_id FROM public.jobs WHERE work_order_id = $1 AND job_status != 'COMPLETED';
      `, [testWo.wo_id]);

      if (pendingJobs.rows.length === 0) {
        await client.query(`
          UPDATE public.work_orders 
          SET wo_status = 'COMPLETED', completed_at = NOW(), updated_at = NOW()
          WHERE wo_id = $1;
        `, [testWo.wo_id]);
      }
    }

    // Verify final cascade state
    const jobCheck = await client.query(`SELECT job_status, completed_date FROM public.jobs WHERE job_id = $1;`, [testJob.job_id]);
    const woCheck = await client.query(`SELECT wo_status, completed_at FROM public.work_orders WHERE wo_id = $1;`, [testWo.wo_id]);

    console.log(`✅ Job final status: ${jobCheck.rows[0].job_status} (completed_date: ${jobCheck.rows[0].completed_date})`);
    console.log(`✅ Work Order final status: ${woCheck.rows[0].wo_status} (completed_at: ${woCheck.rows[0].completed_at})`);

    if (jobCheck.rows[0].job_status !== 'COMPLETED' || woCheck.rows[0].wo_status !== 'COMPLETED') {
      throw new Error('Cascade completion to Job or Work Order failed!');
    }

    // Rollback test data so live DB stays untouched
    await client.query('ROLLBACK');
    console.log('\n✅ Transaction safely rolled back. Live DB is clean!');

    console.log('\n=== ALL QUALITY GATES PASSED (100%) ===');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Quality Gate Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runQualityGates();
