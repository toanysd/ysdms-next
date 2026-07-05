const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: jobs } = await supabase.from('jobs').select('job_id, job_code').limit(20);
  console.log(jobs.map(j => j.job_code).join(', '));
}
run();
