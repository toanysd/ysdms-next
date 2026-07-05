import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const fixedCode = 'CUST-DUP-TEST';
  console.log('Inserting first time...');
  const { data: c1, error: e1 } = await supabase.from('customers').insert({
    customer_code: fixedCode,
    delivery_name: 'Test',
    customer_name_jp: 'Duplicate Test',
    is_active: true
  }).select().single();
  
  if (e1) console.error('First insert error:', e1.message);
  else console.log('First insert success:', c1.id);

  console.log('Inserting second time...');
  const { data: c2, error: e2 } = await supabase.from('customers').insert({
    customer_code: fixedCode,
    delivery_name: 'Test',
    customer_name_jp: 'Duplicate Test 2',
    is_active: true
  }).select().single();

  if (e2) console.error('Second insert error:', e2.message);
  else console.log('Second insert success:', c2.id);
}
main();
