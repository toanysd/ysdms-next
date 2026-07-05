const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.iirezrszalmecsslbruo:Ysd@1621toan@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres'
});

async function run() {
  try {
    await client.connect();
    const sql = `
      CREATE TABLE IF NOT EXISTS aluminum_blanks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          mold_id UUID REFERENCES physical_molds(id),
          blank_type TEXT DEFAULT '切板', 
          material_grade TEXT DEFAULT 'A5052',
          length_mm NUMERIC NOT NULL,
          width_mm NUMERIC NOT NULL,
          thickness_mm NUMERIC NOT NULL,
          status TEXT DEFAULT 'ORDERED', 
          ordered_date DATE,
          received_date DATE,
          supplier_id UUID REFERENCES companies(id),
          notes TEXT,
          created_at TIMESTAMPTZ DEFAULT now(),
          updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;
    await client.query(sql);
    console.log('Table aluminum_blanks created successfully.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();
