import { Client } from 'pg';
import fs from 'fs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/apply_migration_099.mjs");
  process.exit(1);
}

const client = new Client({ connectionString });

async function main() {
  try {
    console.log("Connecting to Supabase Live DB (aws-1 pooler)...");
    await client.connect();
    console.log("Connected successfully.");

    const sql = fs.readFileSync('./supabase/migrations/20260908000002_099_work_order_equipment_set.sql', 'utf8');
    console.log("Applying Migration 099...");
    await client.query(sql);
    console.log("Migration 099 applied successfully!");

    // 1. Verify View columns
    const viewRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'v_work_order_equipment_set' 
      ORDER BY ordinal_position;
    `);
    console.log(`\nVerified View v_work_order_equipment_set (${viewRes.rows.length} columns):`);
    viewRes.rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type})`));

    // 2. Test sample query on View
    const sampleViewRes = await client.query(`
      SELECT wo_code, equipment_code, equipment_type, assignment_type, readiness_status, rack_code, layer_code
      FROM public.v_work_order_equipment_set
      LIMIT 5;
    `);
    console.log("\nSample rows from v_work_order_equipment_set:", sampleViewRes.rows);

    // 3. Test RPC function with a sample work order
    const woRes = await client.query(`
      SELECT wo_id, wo_code FROM public.work_orders LIMIT 1;
    `);
    if (woRes.rows.length > 0) {
      const sampleWoId = woRes.rows[0].wo_id;
      const sampleWoCode = woRes.rows[0].wo_code;
      console.log(`\nTesting RPC fn_get_wo_equipment_set on sample WO: ${sampleWoCode} (${sampleWoId})...`);
      const rpcRes = await client.query(`
        SELECT public.fn_get_wo_equipment_set($1) AS result;
      `, [sampleWoId]);
      console.log("RPC execution result summary:", JSON.stringify(rpcRes.rows[0].result.summary, null, 2));
      console.log("Primary mold:", rpcRes.rows[0].result.primary_mold?.equipment_code || 'None');
      console.log("Set members count:", rpcRes.rows[0].result.set_members?.length || 0);
      console.log("Suggested shared count:", rpcRes.rows[0].result.suggested_shared?.length || 0);
    }

  } catch (err) {
    console.error("Migration 099 failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
