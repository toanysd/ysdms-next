import { createClient } from '@supabase/supabase-js';

const c = createClient(
  'https://iirezrszalmecsslbruo.supabase.co',
  'process.env.SUPABASE_SERVICE_ROLE_KEY'
);

async function main() {
  // Tables we know exist but need column info
  const tables = [
    'order_items', 'production_log', 'rack_layers',
    'item_types', 'process_tag_master',
    'mold_maintenance_log', 'operator_master'
  ];

  // Also check if there's an 'orders' table (not order_head)
  const maybeNames = [
    'orders', 'production_plans', 'tray_inventories',
    'cutter_status_logs', 'cutter_location_logs',
    'scrap_logs', 'ship_logs'
  ];

  console.log('=== Column Details for Existing Tables ===\n');

  for (const t of tables) {
    const { data, error } = await c.from(t).select('*').limit(1);
    if (!error && data && data.length > 0) {
      const sample = data[0];
      console.log('--- ' + t + ' ---');
      for (const [k, v] of Object.entries(sample)) {
        console.log('  ' + k + ': ' + JSON.stringify(v));
      }
      console.log('');
    }
  }

  console.log('\n=== Checking Alternative Table Names ===\n');
  for (const t of maybeNames) {
    const { data, error, count } = await c.from(t).select('*', { count: 'exact' }).limit(1);
    if (error) {
      console.log('[NOT_FOUND] ' + t);
    } else {
      const cols = data && data.length > 0 ? Object.keys(data[0]).join(', ') : '(empty)';
      console.log('[EXISTS] ' + t + ' | rows=' + count + ' | cols: ' + cols);
    }
  }
}

main();
