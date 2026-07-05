import { Client } from 'pg';
import fs from 'fs';

// Replace the @ in the password with %40
const connectionString = "postgresql://postgres:Ysd%401621toan@db.iirezrszalmecsslbruo.supabase.co:5432/postgres";

const client = new Client({
  connectionString,
});

async function main() {
  try {
    await client.connect();
    const sql = fs.readFileSync('./scripts/schema_update_smk225.sql', 'utf8');
    await client.query(sql);
    console.log("Schema updated successfully.");
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await client.end();
  }
}

main();
