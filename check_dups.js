const { createClient } = require('@supabase/supabase-js');
const envVars = Object.fromEntries(
  require('fs').readFileSync('.env.local', 'utf-8')
    .split('\n')
    .filter(line => line.includes('='))
    .map(line => {
      const [k, ...v] = line.split('=')
      return [k.trim(), v.join('=').trim()]
    })
);
const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDuplicates() {
  const check = async (table, codeColumn) => {
    let allData = [];
    let page = 0;
    const pageSize = 1000;
    while (true) {
      const { data, error } = await supabase.from(table).select(codeColumn).range(page * pageSize, (page + 1) * pageSize - 1);
      if (error) { console.error('Error fetching', table, error.message); return; }
      if (!data || data.length === 0) break;
      allData = allData.concat(data);
      if (data.length < pageSize) break;
      page++;
    }

    const counts = {};
    for (const row of allData) {
      const code = row[codeColumn];
      if (code) {
        counts[code] = (counts[code] || 0) + 1;
      }
    }
    const dups = Object.entries(counts).filter(([_, count]) => count > 1);
    console.log(`Table ${table} (${allData.length} rows) - ${dups.length} duplicate codes:`);
    if (dups.length > 0) console.log(dups.slice(0, 5));
  };

  await check('mold_masters', 'mold_master_code');
  await check('design_revisions', 'design_code');
  await check('physical_molds', 'system_code');
  await check('jobs', 'job_code');
}

checkDuplicates().catch(console.error);
