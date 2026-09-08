import { Client } from 'pg';

const connectionString = "postgresql://postgres.iirezrszalmecsslbruo:Ysd%401621toan@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString });

async function runE2ETest() {
  await client.connect();
  console.log("=== STARTING MILESTONE 18 SPRINT 2 ADR-009 LIVE WORKFLOW TEST ===");

  try {
    const eqRes = await client.query(`SELECT equipment_id, equipment_code, keeper_company_id, current_rack_layer_id FROM public.equipment LIMIT 1;`);
    const compRes = await client.query(`SELECT company_id, company_code FROM public.companies WHERE company_code <> 'YSD' LIMIT 1;`);
    const ysdRes = await client.query(`SELECT company_id, company_code FROM public.companies WHERE company_code = 'YSD' LIMIT 1;`);
    const empRes = await client.query(`SELECT employee_id FROM public.employees LIMIT 1;`);

    const equipment = eqRes.rows[0];
    const customerCompany = compRes.rows[0];
    const ysdCompany = ysdRes.rows[0];
    const employee = empRes.rows[0];

    console.log(`Test Equipment: ${equipment.equipment_code} (${equipment.equipment_id})`);
    console.log(`Customer Owner: ${customerCompany.company_code} (${customerCompany.company_id})`);
    console.log(`YSD ID: ${ysdCompany.company_code} (${ysdCompany.company_id})`);

    // ==========================================
    // TEST FLOW 1: CUSTOMER_LOAN (Mượn / Giữ hộ YSD)
    // ==========================================
    console.log("\n--- TEST FLOW 1: CUSTOMER_LOAN (Customer -> YSD) ---");
    const insertLoan1 = await client.query(`
      INSERT INTO public.equipment_loans (
        equipment_id,
        loan_type,
        from_company_id,
        to_company_id,
        loan_date,
        scheduled_return_date,
        requested_by,
        purpose,
        photo_overall_url,
        photo_nameplate_url
      ) VALUES ($1, 'CUSTOMER_LOAN', $2, $3, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', $4, 'Khuôn khách hàng gửi YSD giữ hộ dập khay', 'https://example.com/overall.jpg', 'https://example.com/nameplate.jpg')
      RETURNING loan_id, loan_code, status, loan_type;
    `, [equipment.equipment_id, customerCompany.company_id, ysdCompany.company_id, employee.employee_id]);

    const loan1 = insertLoan1.rows[0];
    console.log(`Created CUSTOMER_LOAN: Code=${loan1.loan_code}, Type=${loan1.loan_type}, Status=${loan1.status}`);

    // Approve
    await client.query(`UPDATE public.equipment_loans SET status = 'APPROVED', approved_by = $1, approved_at = now() WHERE loan_id = $2;`, [employee.employee_id, loan1.loan_id]);
    console.log("Approved CUSTOMER_LOAN.");

    // Check View for has_valid_loan_document
    const viewRes1 = await client.query(`
      SELECT loan_id, loan_code, has_valid_loan_document, photo_overall_url, photo_nameplate_url 
      FROM public.v_equipment_loans_summary 
      WHERE loan_id = $1;
    `, [loan1.loan_id]);
    console.log("View Row 1 (has_valid_loan_document):", viewRes1.rows[0].has_valid_loan_document);
    if (!viewRes1.rows[0].has_valid_loan_document) {
      throw new Error("has_valid_loan_document should be TRUE for approved CUSTOMER_LOAN!");
    }

    // Dispatch (Nhận vào xưởng YSD)
    const dispatchRes1 = await client.query(`SELECT public.fn_dispatch_equipment_loan($1, $2, 'Nhận khuôn từ khách hàng') AS result;`, [loan1.loan_id, employee.employee_id]);
    console.log("Dispatch RPC Result 1:", dispatchRes1.rows[0].result);

    const eqAfterDispatch1 = await client.query(`SELECT keeper_company_id FROM public.equipment WHERE equipment_id = $1;`, [equipment.equipment_id]);
    console.log("Equipment Keeper after CUSTOMER_LOAN dispatch:", eqAfterDispatch1.rows[0].keeper_company_id);
    if (eqAfterDispatch1.rows[0].keeper_company_id !== ysdCompany.company_id) {
      throw new Error("Keeper company ID should be YSD for CUSTOMER_LOAN!");
    }

    // Clean up Loan 1
    await client.query(`DELETE FROM public.equipment_ship_logs WHERE ship_item_name = $1;`, [loan1.loan_code]);
    await client.query(`DELETE FROM public.equipment_loans WHERE loan_id = $1;`, [loan1.loan_id]);

    // ==========================================
    // TEST FLOW 2: RETURN_TO_CUSTOMER (YSD -> Khách)
    // ==========================================
    console.log("\n--- TEST FLOW 2: RETURN_TO_CUSTOMER (YSD -> Customer) ---");
    const insertLoan2 = await client.query(`
      INSERT INTO public.equipment_loans (
        equipment_id,
        loan_type,
        from_company_id,
        to_company_id,
        loan_date,
        scheduled_return_date,
        requested_by,
        purpose
      ) VALUES ($1, 'RETURN_TO_CUSTOMER', $2, $3, CURRENT_DATE, NULL, $4, 'Hoàn trả khuôn về khách hàng kết thúc hợp đồng')
      RETURNING loan_id, loan_code, status, loan_type;
    `, [equipment.equipment_id, ysdCompany.company_id, customerCompany.company_id, employee.employee_id]);

    const loan2 = insertLoan2.rows[0];
    console.log(`Created RETURN_TO_CUSTOMER: Code=${loan2.loan_code}, Type=${loan2.loan_type}`);

    // Approve & Dispatch
    await client.query(`UPDATE public.equipment_loans SET status = 'APPROVED', approved_by = $1, approved_at = now() WHERE loan_id = $2;`, [employee.employee_id, loan2.loan_id]);
    await client.query(`SELECT public.fn_dispatch_equipment_loan($1, $2, 'Xuất kho trả khuôn cho khách') AS result;`, [loan2.loan_id, employee.employee_id]);

    const eqAfterDispatch2 = await client.query(`SELECT keeper_company_id, current_rack_layer_id FROM public.equipment WHERE equipment_id = $1;`, [equipment.equipment_id]);
    console.log("Equipment Keeper after RETURN_TO_CUSTOMER dispatch:", eqAfterDispatch2.rows[0].keeper_company_id);
    console.log("Equipment Rack Layer after RETURN_TO_CUSTOMER dispatch:", eqAfterDispatch2.rows[0].current_rack_layer_id);
    if (eqAfterDispatch2.rows[0].keeper_company_id !== customerCompany.company_id) {
      throw new Error("Keeper company ID should be Customer for RETURN_TO_CUSTOMER!");
    }
    if (eqAfterDispatch2.rows[0].current_rack_layer_id !== null) {
      throw new Error("Rack layer should be NULL when returned to customer!");
    }

    // Clean up Loan 2
    await client.query(`DELETE FROM public.equipment_ship_logs WHERE ship_item_name = $1;`, [loan2.loan_code]);
    await client.query(`DELETE FROM public.equipment_loans WHERE loan_id = $1;`, [loan2.loan_id]);

    // Restore original equipment values
    await client.query(`UPDATE public.equipment SET keeper_company_id = $1, current_rack_layer_id = $2 WHERE equipment_id = $3;`, [equipment.keeper_company_id, equipment.current_rack_layer_id, equipment.equipment_id]);

    console.log("\n=== ALL ADR-009 LIVE WORKFLOW TESTS PASSED 100%! ===");
  } catch (err) {
    console.error("Test Failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runE2ETest();
