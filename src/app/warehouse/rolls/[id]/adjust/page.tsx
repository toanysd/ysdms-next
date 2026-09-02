export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, ArrowUpFromLine } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AdjustForm } from './_components/AdjustForm'

export default async function AdjustRollPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  const { data: roll } = await supabase
    .from('plastic_receipt_roll')
    .select('id, roll_barcode, current_length_m')
    .eq('id', params.id)
    .single()

  if (!roll) {
    notFound()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      
      {/* ── BackBar (Detail Page Pattern) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href={`/warehouse/rolls/${roll.id}`} className="btn btn-secondary flex items-center gap-1.5 px-2 py-1 h-auto text-xs font-bold cursor-pointer">
            <ArrowLeft size={14} />
            戻る (Back to Detail)
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 className="text-[18px] font-bold" style={{ color: 'var(--text-primary)', margin: 0 }}>
            Điều Chỉnh: {roll.roll_barcode}
          </h1>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflow: 'auto', padding: '0 4px' }}>
        <AdjustForm rollId={roll.id} currentLength={roll.current_length_m} />
      </div>
    </div>
  )
}
