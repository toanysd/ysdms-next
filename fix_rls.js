const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
const { createClient } = require('@supabase/supabase-js');
const v = Object.fromEntries(
  env.split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const [k, ...rest] = l.split('=');
      return [k.trim(), rest.join('=').trim()];
    })
);
const supabase = createClient(v['NEXT_PUBLIC_SUPABASE_URL'], v['SUPABASE_SERVICE_ROLE_KEY']);

async function run() {
  const query = `
    ALTER TABLE public.work_logs ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Enable ALL for anon" ON public.work_logs;
    DROP POLICY IF EXISTS "Enable ALL for authenticated" ON public.work_logs;
    CREATE POLICY "Enable ALL for anon" ON public.work_logs FOR ALL TO anon USING (true) WITH CHECK (true);
    CREATE POLICY "Enable ALL for authenticated" ON public.work_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
  `;
  const { data, error } = await supabase.rpc('exec_sql', { sql: query });
  console.log('Result:', error);
}
run();
