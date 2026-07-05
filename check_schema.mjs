
import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const res = await supabase.from('mold_cutter_config').select('*').limit(1);
  console.log('mold_cutter_config columns:', Object.keys(res.data[0] || {}));
  
  const uniqueKeys = async (tableName) => {
    // Just fetch 1 row to see columns
    const r = await supabase.from(tableName).select('*').limit(1);
    console.log(tableName, Object.keys(r.data?.[0] || {}));
  };
  
  await uniqueKeys('customers');
  await uniqueKeys('plastic_master');
  await uniqueKeys('product_master');
  await uniqueKeys('orders');
  await uniqueKeys('mold_base');
  await uniqueKeys('mold_design_revision');
  await uniqueKeys('mold_physical');
  await uniqueKeys('cutter_master');
}
main();

