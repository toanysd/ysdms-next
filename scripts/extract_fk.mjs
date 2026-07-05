import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let envContent = '';
try { envContent = fs.readFileSync('.env.local', 'utf8'); } catch { envContent = fs.readFileSync('.env', 'utf8'); }
const env = envContent.split('\n').reduce((acc, line) => {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m) acc[m[1]] = m[2].trim().replace(/^"|"$/g, '');
    return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function getForeignKeys() {
    const query = `
    SELECT
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
    FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema='public';
    `;
    
    // We cannot run raw queries using standard Supabase client without an RPC function.
    // Let's just output this limitation and I'll do a simple view_file on database.types.ts and read the JSON directly.
    console.log("Supabase REST API does not support raw SQL unless via RPC.");
}

getForeignKeys();
