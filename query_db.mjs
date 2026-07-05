import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  console.log('--- PRODUCTS TABLE COLUMNS ---');
  const res1 = await client.query(SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products';);
  console.log(res1.rows.map(r => r.column_name));

  console.log('--- SEARCH SMK-225 in PRODUCTS ---');
  const res2 = await client.query(SELECT * FROM public.products WHERE product_code ILIKE '%SMK-225%' OR product_name ILIKE '%SMK-225%');
  console.log(res2.rows);

  await client.end();
}
run().catch(console.error);
