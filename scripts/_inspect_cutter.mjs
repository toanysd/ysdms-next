import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  'process.env.SUPABASE_SERVICE_ROLE_KEY'
);

async function inspect(tableName) {
  const { data, error } = await supabase.from(tableName).select('*').limit(1);
  if (error) {
    console.log(`[ERROR] ${tableName}:`, error.message);
  } else if (data && data.length > 0) {
    console.log(`\n--- ${tableName} ---`);
    for (const key of Object.keys(data[0])) {
      console.log(`  ${key}: ${typeof data[0][key]} = ${data[0][key]}`);
    }
  } else {
    console.log(`\n--- ${tableName} (EMPTY) ---`);
  }
}

async function main() {
  await inspect('cutter_master');
  await inspect('mold_cutter_config');
  await inspect('product_mold_map');
}

main();
