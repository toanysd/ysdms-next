import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/test_wo_set.mjs");
  process.exit(1);
}
const client = new Client({ connectionString });

async function main() {
  await client.connect();
  const r = await client.query("SELECT wo_id, wo_code FROM public.work_orders WHERE wo_code = 'WO-L-1248'");
  if (r.rows.length > 0) {
    const wo = r.rows[0];
    const res = await client.query('SELECT public.fn_get_wo_equipment_set($1) AS res', [wo.wo_id]);
    console.log(`\n=== RESULT FOR ${wo.wo_code} ===`);
    console.log(JSON.stringify(res.rows[0].res, null, 2));
  } else {
    console.log("WO not found");
  }
  await client.end();
}

main();
