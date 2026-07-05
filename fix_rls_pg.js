const { Client } = require('pg');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const dbUrlMatch = env.match(/DATABASE_URL=(.+)/);
if (!dbUrlMatch) {
  console.error("No DATABASE_URL found");
  process.exit(1);
}

const client = new Client({
  connectionString: dbUrlMatch[1].trim(),
});

async function run() {
  try {
    await client.connect();
    console.log("Connected");
    const query = `
      ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Enable ALL for anon" ON public.work_logs;
      DROP POLICY IF EXISTS "Enable ALL for authenticated" ON public.work_logs;
      CREATE POLICY "Enable ALL for anon" ON public.work_logs FOR ALL TO anon USING (true) WITH CHECK (true);
      CREATE POLICY "Enable ALL for authenticated" ON public.work_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
    `;
    await client.query(query);
    console.log("Success");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

run();
