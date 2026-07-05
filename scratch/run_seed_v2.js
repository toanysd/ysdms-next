const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:Ysd@1621toan@db.iirezrszalmecsslbruo.supabase.co:5432/postgres';
const sqlFilePath = path.join(__dirname, '..', 'supabase', 'migrations', '20260606000000_999_seed_legacy_data_v2.sql');

async function runMigration() {
  console.log('Reading SQL file...');
  const sql = fs.readFileSync(sqlFilePath, 'utf-8');
  
  const client = new Client({ connectionString });
  
  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    
    console.log('Executing SQL (this might take a minute)...');
    await client.query(sql);
    
    console.log('Migration successful!');
  } catch (err) {
    console.error('Error executing migration:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
