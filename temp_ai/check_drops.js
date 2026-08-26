const { createClient } = require('@supabase/supabase-js');

const url = 'https://iirezrszalmecsslbruo.supabase.co';
const key = 'process.env.SUPABASE_SERVICE_ROLE_KEY';

const supabase = createClient(url, key);

async function check() {
    const { data, error } = await supabase.from('physical_molds').select('legacy_id').limit(1);
    console.log("physical_molds:", error ? error.message : "Exists!");
    
    const { data: cData, error: cErr } = await supabase.from('cutters').select('legacy_id').limit(1);
    console.log("cutters:", cErr ? cErr.message : "Exists!");
    
    const { data: jData, error: jErr } = await supabase.from('jobs').select('physical_mold_id').limit(1);
    console.log("jobs.physical_mold_id:", jErr ? jErr.message : "Exists!");
}

check();
