import { Client } from 'pg';

const client = new Client({ connectionString: process.env.DATABASE_URL });

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
    FROM pg_policies
    WHERE tablename IN ('work_logs', 'jobs', 'job_steps', 'machines')
    ORDER BY tablename, policyname;
  `);
  console.table(res.rows);
  await client.end();
}

main().catch(console.error);
