import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

loadEnvConfig(process.cwd());
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function main() {
    const { data, error } = await supabase.from('job_steps').select('step_id, job_id, step_name, processing_status_id, step_status, processing_statuses(status_code)').limit(10);
    console.log("DB DATA:", JSON.stringify(data, null, 2));
    if(error) console.error(error);
}
main();
