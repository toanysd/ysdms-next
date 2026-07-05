import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ'
);

async function main() {
  const { data: dbRow, error } = await supabase.from('mold_physical').select('id, physical_code, legacy_id').eq('physical_code', 'DIC-059').single();
  console.log('DIC-059 before:', dbRow, error);

  if (dbRow) {
    const { data, error: updErr } = await supabase
      .from('mold_physical')
      .update({ legacy_id: 500 })
      .eq('id', dbRow.id)
      .select();
    
    console.log('Update result:', data, updErr);
  }
}
main();
