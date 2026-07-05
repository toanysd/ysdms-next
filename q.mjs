import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const c = new Client({ connectionString: process.env.DATABASE_URL });
c.connect().then(() => c.query("SELECT product_id, product_code, product_name, product_name_en FROM public.products WHERE product_code ILIKE '%SMK%' OR product_name ILIKE '%SMK%'").then(r => { console.log(r.rows); c.end(); })).catch(e => { console.error(e); c.end(); });
