import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, PackagePlus } from 'lucide-react'
import { ReceiptForm } from './_components/ReceiptForm'

export const dynamic = 'force-dynamic'

export default async function NewPlasticReceiptPage() {
  const supabase = await createClient()

  // Fetch active plastic masters
  const { data: plastics, error } = await supabase
    .from('plastic_master')
    .select('plastic_id, plastic_code, plastic_family, thickness_mm, width_mm, standard_length_m')
    .eq('is_active', true)
    .order('plastic_code', { ascending: true })

  if (error) {
    console.error('Failed to load plastic masters:', error)
  }

  return (
    <div className="flex flex-col h-full gap-3 max-w-5xl mx-auto w-full">
      {/* PageHeader Compact */}
      <div className="shrink-0 flex items-center justify-between p-3 card-flat">
        <div className="flex items-center gap-3">
          <Link href="/plastics/inventory" className="btn btn-secondary text-xs px-2.5 py-1.5 h-auto flex items-center gap-1 font-bold">
            <ArrowLeft size={14} />
            <span>在庫一覧へ戻る</span>
          </Link>
          <div className="flex items-center gap-2">
            <PackagePlus size={18} color="var(--accent)" />
            <h1 className="text-base font-bold text-slate-900">プラスチック原料 入荷登録 (Plastic Receipt Intake)</h1>
          </div>
        </div>
      </div>

      {/* Content Area: Form */}
      <div className="flex-1 overflow-auto card-flat p-6">
        <ReceiptForm plastics={plastics || []} />
      </div>
    </div>
  )
}
