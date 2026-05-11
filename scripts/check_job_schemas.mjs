import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function inspectSchema() {
  const { data, error } = await supabase.from('mold_job_processes').select('*').limit(1);
  if (error) console.log(error);
  else console.log('mold_job_processes cols:', data.length > 0 ? Object.keys(data[0]) : 'Table exists but empty');
  
  // also get the columns from information_schema
  const { data: cols } = await supabase.rpc('execute_sql', { sql: `SELECT column_name FROM information_schema.columns WHERE table_name = 'mold_job_processes'` });
  if (cols) console.log(cols);
}
inspectSchema()
