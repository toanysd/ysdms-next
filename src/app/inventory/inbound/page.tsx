export const dynamic = 'force-dynamic'

// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import { InboundFormClient } from '@/components/inventory/InboundFormClient'

export default async function InventoryInboundPage() {
    const supabase = await createClient()

    // Lấy danh mục Nhựa
    const { data: plastics } = await supabase
        .from('plastic_master')
        .select('id:plastic_id, code:plastic_code, material:plastic_family, color_name:color')
        .eq('is_active', true)

    return <InboundFormClient plastics={plastics || []} />
}
