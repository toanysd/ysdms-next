import { createClient } from '@/lib/supabase/server'
import { InboundFormClient } from '@/components/inventory/InboundFormClient'

export default async function InventoryInboundPage() {
    const supabase = await createClient()

    // Lấy danh mục Nhựa
    const { data: plastics } = await supabase
        .from('plastic_master')
        .select('id, code, material, color_name')
        .eq('is_active', true)

    return <InboundFormClient plastics={plastics || []} />
}
