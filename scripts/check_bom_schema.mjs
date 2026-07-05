import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) acc[m[1]] = m[2].trim().replace(/^"|"$/g, '');
    return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function getColumns() {
    const { data, error } = await supabase.from('mold_plastic_bom').select('*').limit(1);
    console.log('Error:', error);
    if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    } else {
        // Since it's empty, we can get columns by inserting a dummy and capturing the error
        const { error: insErr } = await supabase.from('mold_plastic_bom').insert({}).select('*');
        console.log('Insert Error:', insErr);
    }
}

getColumns();
