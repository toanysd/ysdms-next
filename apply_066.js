const fs = require('fs');
const { Client } = require('pg');

async function run() {
  const uri = 'postgresql://postgres.iirezrszalmecsslbruo:Ysd@1621toan@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres';
  const client = new Client({ connectionString: uri });
  
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected successfully.");
    
    console.log("Reading SQL file...");
    const sql = fs.readFileSync('supabase/migrations/20260606000001_066_update_cutters_base_type.sql', 'utf-8');
    
    console.log("Executing SQL...");
    await client.query(sql);
    console.log("SCHEMA 066 APPLIED SUCCESSFULLY!");
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await client.end();
  }
}
run();
