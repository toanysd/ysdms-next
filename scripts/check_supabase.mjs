import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Try to load .env or .env.local
let envContent = '';
try {
    envContent = fs.readFileSync('.env.local', 'utf8');
} catch {
    try {
        envContent = fs.readFileSync('.env', 'utf8');
    } catch {
        console.error('No .env or .env.local found');
        process.exit(1);
    }
}

const env = envContent.split('\n').reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) acc[m[1]] = m[2].trim().replace(/^"|"$/g, '');
    return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    const { data, error } = await supabase.from('mold_base').select('*').limit(1);
    if (error) {
        console.error('Supabase Error:', error);
    } else {
        console.log('Supabase Connection Success! Found mold_base record:', data.length);
    }
}
checkSchema();
