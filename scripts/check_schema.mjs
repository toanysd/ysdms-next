import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) acc[m[1]] = m[2].trim().replace(/^"|"$/g, '');
    return acc;
}, {});

const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

Promise.all([
  sb.from('product_master').select('*').limit(1),
  sb.from('plastic_master').select('*').limit(1)
]).then(res => {
  console.log('Product:', res[0].data?.[0]);
  console.log('Plastic:', res[1].data?.[0]);
});
