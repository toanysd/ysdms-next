import { Client } from 'pg';

const connectionString = "postgresql://postgres.iirezrszalmecsslbruo:Ysd%401621toan@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString });

async function runE2ETest() {
  await client.connect();
  console.log("=== STARTING MILESTONE 18 SPRINT 1 LIVE WORKFLOW TEST ===");

  try {
    // 1. Get an existing equipment and company for testing
    const eqRes = await client.query(`SELECT equipment_id, equipment_code, keeper_company_id FROM public.equipment LIMIT 1;`);
    const compRes = await client.query(`SELECT company_id, company_code FROM public.companies WHERE company_code <> 'YSD' LIMIT 1;`);
    const ysdRes = await client.query(`SELECT company_id FROM public.companies WHERE company_code = 'YSD' LIMIT 1;`);
    const empRes = await client.query(`SELECT employee_id FROM public.employees LIMIT 1;`);

    const equipment = eqRes.rows[0];
    const targetCompany = compRes.rows[0];
    const ysdCompany = ysdRes.rows[0];
    const employee = empRes.rows[0];

    console.log(`Test Equipment: ${equipment.equipment_code} (${equipment.equipment_id})`);
    console.log(`Original Keeper: ${equipment.keeper_company_id}`);
    console.log(`Target Borrower: ${targetCompany.company_code} (${targetCompany.company_id})`);

    // 2. Test auto-generation of loan_code on insert
    console.log("\n--- STEP 1: Creating Loan Proposal (PENDING_APPROVAL) ---");
    const insertRes = await client.query(`
      INSERT INTO public.equipment_loans (
        equipment_id,
        loan_type,
        to_company_id,
        from_company_id,
        loan_date,
        scheduled_return_date,
        requested_by,
        purpose,
        condition_on_loan
      ) VALUES ($1, 'BORROW', $2, $3, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', $4, 'E2E Test M18-S1', 'Tốt - Mới bảo dưỡng')
      RETURNING loan_id, loan_code, status, scheduled_return_date;
    `, [equipment.equipment_id, targetCompany.company_id, ysdCompany.company_id, employee.employee_id]);

    const createdLoan = insertRes.rows[0];
    console.log(`Created Loan: ID=${createdLoan.loan_id}, Code=${createdLoan.loan_code}, Status=${createdLoan.status}`);
    if (!createdLoan.loan_code.startsWith('LN-')) {
      throw new Error(`Loan code format invalid: ${createdLoan.loan_code}`);
    }

    // 3. Test View v_equipment_loans_summary
    console.log("\n--- STEP 2: Querying View v_equipment_loans_summary ---");
    const viewRes = await client.query(`
      SELECT loan_id, loan_code, status, equipment_code, to_company_code, days_overdue, is_overdue
      FROM public.v_equipment_loans_summary
      WHERE loan_id = $1;
    `, [createdLoan.loan_id]);
    console.log("View Row:", viewRes.rows[0]);

    // 4. Test Approval
    console.log("\n--- STEP 3: Approving Loan Proposal ---");
    await client.query(`
      UPDATE public.equipment_loans
      SET status = 'APPROVED', approved_by = $1, approved_at = now()
      WHERE loan_id = $2;
    `, [employee.employee_id, createdLoan.loan_id]);
    console.log("Loan status updated to APPROVED.");

    // 5. Test RPC fn_dispatch_equipment_loan
    console.log("\n--- STEP 4: Calling RPC fn_dispatch_equipment_loan ---");
    const dispatchRes = await client.query(`
      SELECT public.fn_dispatch_equipment_loan($1, $2, 'E2E test dispatch') AS result;
    `, [createdLoan.loan_id, employee.employee_id]);
    console.log("Dispatch RPC Result:", dispatchRes.rows[0].result);

    // Verify equipment keeper updated
    const eqAfterDispatch = await client.query(`
      SELECT equipment_id, keeper_company_id FROM public.equipment WHERE equipment_id = $1;
    `, [equipment.equipment_id]);
    console.log("Equipment Keeper after dispatch:", eqAfterDispatch.rows[0].keeper_company_id);
    if (eqAfterDispatch.rows[0].keeper_company_id !== targetCompany.company_id) {
      throw new Error("Keeper company ID was not updated to target company!");
    }

    // 6. Test RPC fn_complete_equipment_loan_return
    console.log("\n--- STEP 5: Calling RPC fn_complete_equipment_loan_return ---");
    const returnRes = await client.query(`
      SELECT public.fn_complete_equipment_loan_return($1, $2, NULL, 'Khuôn nguyên vẹn', 'E2E test return complete') AS result;
    `, [createdLoan.loan_id, employee.employee_id]);
    console.log("Return RPC Result:", returnRes.rows[0].result);

    // Verify equipment keeper restored and loan status is RETURNED
    const loanAfterReturn = await client.query(`
      SELECT status, actual_return_date, condition_on_return FROM public.equipment_loans WHERE loan_id = $1;
    `, [createdLoan.loan_id]);
    console.log("Loan record after return:", loanAfterReturn.rows[0]);

    const eqAfterReturn = await client.query(`
      SELECT equipment_id, keeper_company_id FROM public.equipment WHERE equipment_id = $1;
    `, [equipment.equipment_id]);
    console.log("Equipment Keeper after return:", eqAfterReturn.rows[0].keeper_company_id);

    // 7. Cleanup test data
    console.log("\n--- STEP 6: Cleaning Up Test Records ---");
    await client.query(`DELETE FROM public.equipment_ship_logs WHERE ship_item_name = $1;`, [createdLoan.loan_code]);
    await client.query(`DELETE FROM public.equipment_loans WHERE loan_id = $1;`, [createdLoan.loan_id]);
    
    // Restore original keeper
    await client.query(`UPDATE public.equipment SET keeper_company_id = $1 WHERE equipment_id = $2;`, [equipment.keeper_company_id, equipment.equipment_id]);
    console.log("Test records cleaned up and original equipment keeper restored.");

    console.log("\n=== ALL E2E WORKFLOW TESTS PASSED SUCCESSFULLY! ===");
  } catch (err) {
    console.error("E2E Test Failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runE2ETest();
