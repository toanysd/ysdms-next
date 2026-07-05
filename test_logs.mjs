import { createClient } from '@supabase/supabase-js'; 
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data: logs } = await supabase.from('work_logs').select('*').limit(20);
  console.log("LOGS:");
  console.log(JSON.stringify(logs, null, 2));

  // Let's get MTM-190 R2 job id
  const { data: jobs } = await supabase.from('jobs').select('job_id, job_code').eq('job_code', 'MTM-190 R2');
  console.log("JOB:", jobs);
  if (jobs && jobs.length > 0) {
      const { data: logsForJob } = await supabase.from('work_logs').select('*').eq('job_id', jobs[0].job_id);
      console.log("LOGS FOR MTM-190 R2:", logsForJob);

      // Check its job steps
      const { data: steps } = await supabase.from('job_steps').select('*').eq('job_id', jobs[0].job_id);
      console.log("STEPS FOR MTM-190 R2:", steps);
  }
}
test();
