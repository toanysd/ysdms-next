import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmV6cnN6YWxtZWNzc2xicnVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTYxMTc0NSwiZXhwIjoyMDkxMTg3NzQ1fQ.zDDtsF_NP7_g9HiclRu3Y-nPJLcalxtz0yCSwuRgtBQ'
);

async function main() {
  const { data, error } = await supabase.from('mold_physical').select('id, physical_code, legacy_id').is('legacy_id', null).limit(10);
  console.log('Unmapped in DB:');
  for (const d of data) {
    console.log(`"${d.physical_code}"`);
  }
}
main();
