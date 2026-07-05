
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const { data: cols, error: err } = await supabase.rpc('execute_sql', { query: 
    SELECT 
      t.relname as table_name,
      i.relname as index_name,
      a.attname as column_name
    FROM 
      pg_class t,
      pg_class i,
      pg_index ix,
      pg_attribute a
    WHERE 
      t.oid = ix.indrelid
      and i.oid = ix.indexrelid
      and a.attrelid = t.oid
      and a.attnum = ANY(ix.indkey)
      and t.relkind = 'r'
      and ix.indisunique = true
      and t.relname IN ('customers', 'plastic_master', 'product_master', 'orders', 'mold_base', 'mold_design_revision', 'mold_physical', 'cutter_master', 'machine_model', 'machine_instance');
   });
  
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Unique indexes:', cols);
  }
}
main();

