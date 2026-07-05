import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const client = await pool.connect();
  try {
    console.log('Fixing RLS for aluminum_blanks...');
    
    // Enable RLS
    await client.query('ALTER TABLE aluminum_blanks ENABLE ROW LEVEL SECURITY;');
    
    // Create Select policy
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cho phép xem phôi nhôm' AND tablename = 'aluminum_blanks') THEN
          CREATE POLICY "Cho phép xem phôi nhôm" ON aluminum_blanks FOR SELECT USING (true);
        END IF;
      END
      $$;
    `);

    // Create Insert policy
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cho phép thêm phôi nhôm' AND tablename = 'aluminum_blanks') THEN
          CREATE POLICY "Cho phép thêm phôi nhôm" ON aluminum_blanks FOR INSERT WITH CHECK (true);
        END IF;
      END
      $$;
    `);

    // Create Update policy
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cho phép sửa phôi nhôm' AND tablename = 'aluminum_blanks') THEN
          CREATE POLICY "Cho phép sửa phôi nhôm" ON aluminum_blanks FOR UPDATE USING (true);
        END IF;
      END
      $$;
    `);

    // Create Delete policy
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Cho phép xóa phôi nhôm' AND tablename = 'aluminum_blanks') THEN
          CREATE POLICY "Cho phép xóa phôi nhôm" ON aluminum_blanks FOR DELETE USING (true);
        END IF;
      END
      $$;
    `);

    // Reload schema cache for PostgREST
    await client.query("NOTIFY pgrst, 'reload schema';");

    console.log('RLS policies added successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

main();
