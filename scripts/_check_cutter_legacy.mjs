import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  'process.env.SUPABASE_SERVICE_ROLE_KEY'
);

async function main() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'cutter_master' });
  console.log(data || error);

  // also just try to select legacy_id to see if it throws
  const { error: selErr } = await supabase.from('cutter_master').select('legacy_id').limit(1);
  if (selErr) {
    console.error('legacy_id error:', selErr.message);
  } else {
    console.log('legacy_id EXISTS in cutter_master');
  }

  // same for mold_cutter_config
  const { error: confErr } = await supabase.from('mold_cutter_config').select('legacy_id').limit(1);
  if (confErr) {
    console.error('config legacy_id error:', confErr.message);
  } else {
    console.log('legacy_id EXISTS in mold_cutter_config');
  }
}
main();
