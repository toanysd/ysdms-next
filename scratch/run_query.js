const { Client } = require('pg');
const fs = require('fs');
const envStr = fs.readFileSync('.env.local', 'utf8');
const dbUrl = envStr.split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=')[1].trim();


async function main() {
  const client = new Client({
    connectionString: dbUrl,
  });
  
  await client.connect();
  
  const sql = process.argv[2] || "SELECT 1";
  
  try {
    const res = await client.query(sql);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

main();
