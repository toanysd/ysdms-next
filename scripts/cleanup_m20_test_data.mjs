import { Client } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const client = new Client({ connectionString });

async function main() {
  await client.connect();
  console.log('--- Cleaning up test data on Live DB (Điều kiện 1 của PE) ---');

  const d1 = await client.query("DELETE FROM public.work_logs WHERE notes = 'M20 PE Verification Test';");
  console.log('Deleted work_logs count:', d1.rowCount);

  const d2 = await client.query("DELETE FROM public.job_steps WHERE step_id = '41ad0522-58ce-4627-8484-0897be9c0728';");
  console.log('Deleted job_steps count:', d2.rowCount);

  const d3 = await client.query("DELETE FROM public.jobs WHERE job_code = 'JOB-TH-LIVE-001';");
  console.log('Deleted jobs count:', d3.rowCount);

  const c1 = await client.query("SELECT count(*) FROM public.work_logs WHERE notes = 'M20 PE Verification Test';");
  const c2 = await client.query("SELECT count(*) FROM public.job_steps WHERE step_id = '41ad0522-58ce-4627-8484-0897be9c0728';");
  const c3 = await client.query("SELECT count(*) FROM public.jobs WHERE job_code = 'JOB-TH-LIVE-001';");

  console.log('Remaining test work_logs:', c1.rows[0].count);
  console.log('Remaining test job_steps:', c2.rows[0].count);
  console.log('Remaining test jobs:', c3.rows[0].count);

  if (c1.rows[0].count === '0' && c2.rows[0].count === '0' && c3.rows[0].count === '0') {
    console.log('✅ ALL TEST ENTITIES COMPLETELY REMOVED FROM PRODUCTION DB.');
  } else {
    console.warn('⚠️ Some test entities could not be cleaned up!');
  }

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
