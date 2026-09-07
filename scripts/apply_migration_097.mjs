import { Client } from 'pg';
import fs from 'fs';

const connectionString = "postgresql://postgres.iirezrszalmecsslbruo:Ysd%401621toan@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString });

async function main() {
  try {
    console.log("Connecting to Supabase Live DB...");
    await client.connect();
    console.log("Connected successfully.");

    const sql = fs.readFileSync('./supabase/migrations/20260907000004_097_equipment_loans.sql', 'utf8');
    console.log("Applying Migration 097...");
    await client.query(sql);
    console.log("Migration 097 applied successfully!");

    // Verify table and view existence
    const tableRes = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'equipment_loans'
      ORDER BY ordinal_position;
    `);
    console.log("\nVerified equipment_loans columns count:", tableRes.rows.length);

    const viewRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'v_equipment_loans_summary';
    `);
    console.log("Verified v_equipment_loans_summary columns count:", viewRes.rows.length);

    // Verify trigger and function
    const funcRes = await client.query(`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_name IN ('fn_generate_equipment_loan_code', 'fn_dispatch_equipment_loan', 'fn_complete_equipment_loan_return');
    `);
    console.log("Verified functions count:", funcRes.rows.length);

  } catch (err) {
    console.error("Migration 097 failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
