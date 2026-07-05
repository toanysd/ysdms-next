const fs = require('fs');
const { Client } = require('pg');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1]] = match[2].trim();
});

const client = new Client({
  connectionString: 'postgresql://postgres:Ysd@1621toan@db.iirezrszalmecsslbruo.supabase.co:5432/postgres'
});

async function check() {
  await client.connect();
  const res = await client.query(`
    SELECT event_object_table, trigger_name, event_manipulation, action_statement
    FROM information_schema.triggers
    WHERE event_object_table IN ('delivery_sites', 'company_contacts', 'companies')
  `);
  console.log(res.rows);
  await client.end();
}

check().catch(console.error);
