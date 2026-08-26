import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  'process.env.SUPABASE_SERVICE_ROLE_KEY'
);

async function main() {
  const { data, error } = await supabase.from('mold_physical').select('id, physical_code, legacy_id').is('legacy_id', null).limit(10);
  console.log('Unmapped in DB:');
  for (const d of data) {
    console.log(`"${d.physical_code}"`);
  }
}
main();
