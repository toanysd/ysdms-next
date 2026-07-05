const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const c = new Client({ connectionString: process.env.DATABASE_URL });
c.connect().then(() => {
  console.log('Connected');
  return c.query("SELECT * FROM public.products WHERE product_code ILIKE '%SMK%' OR product_name ILIKE '%SMK%'");
}).then(r => {
  console.log('PRODUCTS:', r.rows);
  return c.query("SELECT * FROM public.molds WHERE mold_code ILIKE '%SMK%' OR mold_name ILIKE '%SMK%'");
}).then(r => {
  console.log('MOLDS:', r.rows);
  c.end();
}).catch(e => { console.error(e); c.end(); });
