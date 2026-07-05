import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function testQuery() {
    console.log('Testing End-to-End Order Integration Query...');
    
    const { data, error } = await supabase
        .from('order_items')
        .select(`
            id,
            quantity,
            orders!inner(slip_no, order_date, status, customer_id),
            product_master!inner(
                code,
                name,
                product_mold_map!inner(
                    mold_design_revision!inner(
                        revision_code,
                        mold_physical(physical_code, cavity)
                    )
                )
            )
        `)
        .limit(5);

    if (error) {
        console.error('Query failed:', error);
        return;
    }

    console.log(`Found ${data.length} integrated order items:`);
    console.log(JSON.stringify(data, null, 2));
}

testQuery();
