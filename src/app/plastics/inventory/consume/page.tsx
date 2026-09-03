import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import { ConsumeForm } from './_components/ConsumeForm'

export const dynamic = 'force-dynamic'

export default async function ConsumePlasticRollPage(props: {
  searchParams?: Promise<{ roll_id?: string }>
}) {
  const searchParams = await props.searchParams
  const preselectedRollId = searchParams?.roll_id || ''

  const supabase = await createClient()

  // 1. Fetch available rolls (in_stock or in_use with length > 0)
  const { data: rolls, error: rollsErr } = await supabase
    .from('plastic_receipt_roll')
    .select(`
      id, roll_barcode, current_length_m, nominal_length_m, status, location,
      plastic_master!inner (plastic_id, plastic_code, thickness_mm, width_mm)
    `)
    .in('status', ['in_stock', 'in_use'])
    .gt('current_length_m', 0)
    .order('current_length_m', { ascending: false })

  if (rollsErr) {
    console.error('Failed to load rolls for consumption:', rollsErr)
  }

  // 2. Fetch recent work orders for optional association
  const { data: workOrders } = await supabase
    .from('work_orders')
    .select('wo_id, wo_code, wo_name, wo_status')
    .order('created_at', { ascending: false })
    .limit(40)

  return (
    <div className="flex flex-col h-full gap-3 max-w-3xl mx-auto w-full">
      {/* PageHeader Compact */}
      <div className="shrink-0 flex items-center justify-between p-3 card-flat">
        <div className="flex items-center gap-3">
          <Link href="/plastics/inventory" className="btn btn-secondary text-xs px-2.5 py-1.5 h-auto flex items-center gap-1 font-bold">
            <ArrowLeft size={14} />
            <span>在庫一覧へ戻る</span>
          </Link>
          <div className="flex items-center gap-2">
            <ClipboardList size={18} color="var(--accent)" />
            <h1 className="text-base font-bold text-slate-900">材料消費登録 (Manual Material Consumption Entry)</h1>
          </div>
        </div>
      </div>

      {/* Content Form */}
      <div className="flex-1 overflow-auto card-flat p-6">
        <ConsumeForm
          rolls={(rolls as any) || []}
          workOrders={workOrders || []}
          preselectedRollId={preselectedRollId}
        />
      </div>
    </div>
  )
}
