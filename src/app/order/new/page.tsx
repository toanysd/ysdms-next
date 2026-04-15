import { createClient } from '@/lib/supabase/server'
import { OrderFormClient } from '@/components/order/OrderFormClient'

export default async function NewOrderPage() {
    const supabase = await createClient()

    // Fetch customers to populate the dropdown using Service Role
    const { data: customers } = await supabase
        .from('customers')
        .select('id, code, name_jp')
        .eq('is_active', true)
        .order('code', { ascending: true })

    return (
        <div className="flex-1 flex flex-col p-2 h-full">
            <OrderFormClient customers={customers || []} />
        </div>
    )
}
