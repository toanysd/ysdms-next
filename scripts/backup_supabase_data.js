const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  });
}

const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const TABLES_TO_BACKUP = [
  'companies',
  'company_contacts',
  'delivery_sites',
  'products',
  'design_revisions',
  'cav_types',
  'plastics_v2',
  'plastic_types',
  'equipment',
  'equipment_assignments',
  'equipment_history',
  'equipment_photos',
  'jobs',
  'job_steps',
  'work_logs',
  'processing_statuses',
  'processing_codes',
  'racks',
  'rack_layers',
  'employees',
  'machines',
  'orders',
  'order_lines',
  'shipments',
  'quotations',
  'quotation_items',
  'physical_molds',
  'cutters'
];

async function backupTable(tableName, backupDir) {
  console.log(`Exporting table: ${tableName}...`);
  let allRows = [];
  let from = 0;
  const pageSize = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .range(from, from + pageSize - 1);

    if (error) {
      console.warn(`  [Warning] Table ${tableName} failed to export or does not exist:`, error.message);
      return { tableName, rowCount: 0, status: 'SKIPPED_OR_ERROR', error: error.message };
    }

    if (data && data.length > 0) {
      allRows = allRows.concat(data);
      from += pageSize;
      if (data.length < pageSize) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  const filePath = path.join(backupDir, `${tableName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(allRows, null, 2), 'utf8');
  console.log(`  ✓ Saved ${allRows.length} rows to ${filePath}`);
  return { tableName, rowCount: allRows.length, status: 'SUCCESS' };
}

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(__dirname, '..', 'backups', `supabase_backup_${timestamp}`);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`========================================`);
  console.log(`STARTING SUPABASE DATA BACKUP`);
  console.log(`Destination: ${backupDir}`);
  console.log(`========================================`);

  const summary = [];
  for (const table of TABLES_TO_BACKUP) {
    const res = await backupTable(table, backupDir);
    summary.push(res);
  }

  const manifestPath = path.join(backupDir, '_manifest.json');
  const manifest = {
    timestamp: new Date().toISOString(),
    supabaseUrl,
    summary,
    totalTables: summary.filter(s => s.status === 'SUCCESS').length,
    totalRecords: summary.reduce((sum, s) => sum + (s.rowCount || 0), 0)
  };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`========================================`);
  console.log(`BACKUP COMPLETED SUCCESSFULLY!`);
  console.log(`Total Tables Exported: ${manifest.totalTables}`);
  console.log(`Total Records: ${manifest.totalRecords}`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`========================================`);
}

runBackup().catch(err => {
  console.error('Backup failed:', err);
  process.exit(1);
});
