import { Client } from 'pg';

const connectionString = "postgresql://postgres.iirezrszalmecsslbruo:Ysd%401621toan@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
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
