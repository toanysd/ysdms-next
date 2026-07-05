import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envConfig = fs.readFileSync('.env.local', 'utf8')
const envKeys = {}
envConfig.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) envKeys[match[1]] = match[2].trim().replace(/^"|"$/g, '')
})

const supabase = createClient(envKeys['NEXT_PUBLIC_SUPABASE_URL'], envKeys['SUPABASE_SERVICE_ROLE_KEY'])

async function apply() {
    const sql = fs.readFileSync('supabase/migrations/20260508_050_inventory_dashboard_view.sql', 'utf8')
    
    // Split by semicolons, filter empty, execute each statement
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 10)
    
    // For this migration, we need to run as a single block since it has $$ delimiters
    const { error } = await supabase.rpc('exec_sql', { sql_text: sql })
    
    if (error) {
        // If exec_sql doesn't exist, inform user to run manually
        console.log('⚠️ RPC exec_sql không tồn tại. Thử phương pháp khác...')
        
        // Try running the view separately
        const viewSQL = `CREATE OR REPLACE VIEW public.tray_stock_summary AS
SELECT 
    t.product_id,
    p.code AS product_code,
    p.name AS product_name,
    p.customer_code,
    SUM(CASE WHEN t.txn_type = 'IN' THEN t.quantity ELSE 0 END) AS total_in,
    SUM(CASE WHEN t.txn_type = 'OUT' THEN t.quantity ELSE 0 END) AS total_out,
    SUM(CASE WHEN t.txn_type = 'ADJUST' THEN t.quantity ELSE 0 END) AS total_adjust,
    SUM(
        CASE 
            WHEN t.txn_type = 'IN' THEN t.quantity 
            WHEN t.txn_type = 'OUT' THEN -t.quantity 
            WHEN t.txn_type = 'ADJUST' THEN t.quantity 
            ELSE 0 
        END
    ) AS current_stock
FROM 
    public.tray_inventory_txn t
JOIN 
    public.product_master p ON t.product_id = p.id
GROUP BY 
    t.product_id, p.code, p.name, p.customer_code`

        // Test if the view already has customer_code
        const { data: testData, error: testErr } = await supabase.from('tray_stock_summary').select('customer_code').limit(1)
        if (testErr && testErr.message.includes('customer_code')) {
            console.log('❌ View chưa có customer_code. Chỉ huy cần apply Migration 050 qua SQL Editor.')
        } else {
            console.log('✅ View đã có customer_code sẵn rồi!')
        }
        
        // Test KPI function
        const { data: kpiData, error: kpiErr } = await supabase.rpc('get_inventory_dashboard_kpis')
        if (kpiErr) {
            console.log('❌ KPI RPC chưa tồn tại. Chỉ huy cần apply Migration 050 qua SQL Editor.')
            console.log('📋 File SQL: supabase/migrations/20260508_050_inventory_dashboard_view.sql')
        } else {
            console.log('✅ KPI RPC đã hoạt động:', JSON.stringify(kpiData, null, 2))
        }
    } else {
        console.log('✅ Migration 050 đã apply thành công!')
    }
}

apply()
