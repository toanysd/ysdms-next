import { Client } from 'pg';
import fs from 'fs';

// Safely load connection string from env
let connectionString = process.env.DATABASE_URL;

if (!connectionString && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  for (const line of envContent.split('\n')) {
    if (line.startsWith('DATABASE_URL=')) {
      connectionString = line.split('=')[1].trim();
      break;
    }
  }
}

if (!connectionString) {
  console.error("DATABASE_URL is not set. Run with: node --env-file=.env.local scripts/apply_migration_100.mjs");
  process.exit(1);
}

const client = new Client({ connectionString });

async function main() {
  try {
    console.log("Connecting to Supabase Live DB...");
    await client.connect();
    console.log("Connected successfully.");

    const sql = fs.readFileSync('./supabase/migrations/20260908000003_100_add_thermoforming_job_type.sql', 'utf8');
    console.log("Applying Migration 100...");
    await client.query(sql);
    console.log("Migration 100 applied successfully!");

    // Quality gate: SELECT * FROM job_types ORDER BY sort_order
    const res = await client.query(`
      SELECT job_type_id, job_type_name_ja, job_type_name_vi, category, sort_order 
      FROM public.job_types 
      ORDER BY sort_order ASC;
    `);

    console.log("\n=== Quality Gate Bước 2a: job_types table state ===");
    console.table(res.rows);

    await client.end();
  } catch (err) {
    console.error("Error applying migration 100:", err);
    if (client) await client.end();
    process.exit(1);
  }
}

main();
