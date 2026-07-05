const { Client } = require('pg');

async function testConnection() {
  const uri = 'postgresql://postgres:toanysd1621@db.iirezrszalmecsslbruo.supabase.co:5432/postgres';
  const client = new Client({ connectionString: uri });
  
  try {
    await client.connect();
    console.log("CONNECTED SUCCESSFULLY!");
    const res = await client.query('SELECT 1 as result');
    console.log(res.rows[0]);
  } catch (err) {
    console.error("CONNECTION FAILED:", err.message);
  } finally {
    await client.end();
  }
}

testConnection();
