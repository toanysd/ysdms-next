const { Client } = require('pg');

async function testExists() {
    const client = new Client({ connectionString: 'postgresql://postgres.iirezrszalmecsslbruo:T%402n24072000ysd@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
    try {
        await client.connect();
        const res = await client.query("SELECT recipient_name FROM orders LIMIT 1;");
        console.log("Column EXISTS! Test DB direct SUCCESS");
        console.log("Restarting node app to force schema cache drop is standard fix for pgRest cached issues in test envs.");
    } catch (e) {
        console.error("Column DOES NOT EXIST:", e.message);
    } finally {
        await client.end();
    }
}
testExists();
