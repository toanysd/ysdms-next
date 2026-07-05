import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) acc[m[1]] = m[2].trim().replace(/^"|"$/g, '');
    return acc;
}, {});
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const p = { code: 'PS-100', name: 'PS Trắng', material: 'PS', thickness_mm: 1.0, color_name: 'Trắng', is_active: true };
sb.from('plastic_master').insert(p).select('*').then(res => console.log(res.error, res.data));
