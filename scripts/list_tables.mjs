import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) acc[m[1]] = m[2].trim().replace(/^"|"$/g, '');
    return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function checkSchema() {
    const { data, error } = await supabase.rpc('get_tables'); 
    // Wait, get_tables might not exist. I'll just read from information_schema
    const { data: tables, error: err } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
    
    if (err) {
        // If information_schema is blocked by postgrest, we can just look at database.types.ts
        console.log('Cannot query information_schema directly.');
    } else {
        console.log(tables);
    }
}
checkSchema();
