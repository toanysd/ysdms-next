import { Client } from 'pg';
import fs from 'fs';

const connectionString = "postgresql://postgres.iirezrszalmecsslbruo:Ysd%401621toan@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString });

async function main() {
  try {
    console.log("Connecting to Supabase Live DB (aws-1 pooler)...");
    await client.connect();
    console.log("Connected successfully.");

    const sql = fs.readFileSync('./supabase/migrations/20260908000001_098_equipment_loans_semantic_and_photos.sql', 'utf8');
    console.log("Applying Migration 098...");
    await client.query(sql);
    console.log("Migration 098 applied successfully!");

    // 1. Verify photo columns in equipment_loans
    const colRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'equipment_loans' AND column_name IN ('photo_overall_url', 'photo_nameplate_url');
    `);
    console.log("\nVerified photo columns:", colRes.rows);

    // 2. Verify constraints
    const conRes = await client.query(`
      SELECT conname, pg_get_constraintdef(oid) 
      FROM pg_constraint 
      WHERE conrelid = 'public.equipment_loans'::regclass AND conname IN ('equipment_loans_loan_type_check', 'chk_scheduled_return_date');
    `);
    console.log("\nVerified constraints:");
    conRes.rows.forEach(r => console.log(`  ${r.conname}: ${r.pg_get_constraintdef}`));

    // 3. Verify View columns including has_valid_loan_document
    const viewRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'v_equipment_loans_summary' 
        AND column_name IN ('has_valid_loan_document', 'photo_overall_url', 'photo_nameplate_url');
    `);
    console.log("\nVerified View audit & photo columns:", viewRes.rows);

  } catch (err) {
    console.error("Migration 098 failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
