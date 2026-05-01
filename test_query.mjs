import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function run() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // 1. Check Product
    const { data: pData } = await supabase.from('product_master')
        .select('*')
        .or(`code.ilike.%167CSS%,customer_code.ilike.%167CSS%,name.ilike.%167CSS%,code.ilike.%SMK%`)
        .limit(5)

    console.log("---- TÌM KIẾM KHAY (167CSS / SMK) ----")
    console.log(`Số lượng tìm thấy: ${pData?.length || 0}`)
    if (pData?.length > 0) {
        console.log(pData.map(p => ({ code: p.code, customer_code: p.customer_code, name: p.name })))
    } else {
        // Query thử lấy bừa vài khay xem DB có data không
        const { data: random } = await supabase.from('product_master').select('code, customer_code').limit(2)
        console.log("Sample Data hiện tại:", random)
    }
}
run()
