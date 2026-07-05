import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const KWE005_ID = '9242a20e-e416-451d-9d85-71e8a722b60e';
  const orderId = "62eea056-2942-43c3-a11d-ec731a8bd31d";
  
  // order items for KWE-005
  const { data: orderItem } = await supabase.from('order_items').select('*').eq('id', 'f905e218-c639-423d-b564-d37861f8a7da').single();
  
  const { data: revs } = await supabase.from('mold_design_revision').select('*').eq('mold_base_id', orderItem.mold_id);
  console.log('Revs:', revs);
  
  const { data: phys } = await supabase.from('mold_physical').select('*').eq('revision_id', revs[0].id);
  console.log('Phys:', phys);
}
main().catch(console.error);
