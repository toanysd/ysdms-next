const fs = require('fs');
const { Client } = require('pg');

async function run() {
  const uri = 'postgresql://postgres.iirezrszalmecsslbruo:Th03111987@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres';
  const client = new Client({ connectionString: uri });
  
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected successfully.");
    
    console.log("Reading SQL file...");
    const sql = fs.readFileSync('supabase/migrations/20260623000000_073_fix_jobs_mapping.sql', 'utf-8');
    
    console.log("Executing SQL...");
    await client.query(sql);
    console.log("SCHEMA APPLIED SUCCESSFULLY!");
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await client.end();
  }
}
run();
