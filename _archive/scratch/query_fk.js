const fs = require('fs');
const { Client } = require('pg');
const env = fs.readFileSync('.env.local', 'utf8');
const dbUrlMatch = env.match(/DATABASE_URL=\"?([^\"\n]+)\"?/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1].trim() : null;
const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
client.connect().then(() => {
  client.query("SELECT conname, contype, confrelid::regclass FROM pg_constraint WHERE conrelid = 'plastic_receipt'::regclass;")
    .then(res => { console.log('Constraints:', res.rows); client.end(); })
    .catch(err => { console.error('Query error', err); client.end(); });
});