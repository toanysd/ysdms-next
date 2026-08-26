import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  'process.env.SUPABASE_SERVICE_ROLE_KEY'
);

async function main() {
  const { data: dbRow, error } = await supabase.from('mold_physical').select('id, physical_code, legacy_id').eq('physical_code', 'JAE-303').single();
  console.log('JAE-303 before:', dbRow, error);

  if (dbRow) {
    const { data, error: updErr } = await supabase
      .from('mold_physical')
      .update({ legacy_id: 272 })
      .eq('id', dbRow.id)
      .select();
    
    console.log('Update result:', data, updErr);
  }
}
main();
