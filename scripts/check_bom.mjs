import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) acc[m[1]] = m[2].trim().replace(/^"|"$/g, '');
    return acc;
}, {});

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

sb.from('mold_plastic_bom').select('*', { count: 'exact', head: true }).then(r => {
    console.log('BOM Count:', r.count, r.error);
});
