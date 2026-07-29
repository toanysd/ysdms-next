export const dynamic = 'force-dynamic'

// @ts-nocheck
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Search, Scissors } from 'lucide-react'

export type CutterMaster = {
  id: string
  code: string
  type: string | null
  width_mm: number | null
  is_active: boolean
}

export default async function CutterMasterPage() {
  const t = await getTranslations('Master')
  const supabase = await createClient()
  
  const { data: cutters, error } = await supabase
    .from('cutters')
    .select('id:cutter_id, code:cutter_no, type:cutter_type, width_mm:cutter_width_mm, is_active:cutter_presence')
    .order('cutter_no', { ascending: true })

  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm">
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Scissors size={20} className="text-[var(--mcs-text-muted)]" />
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            {t('Master.maDaoCat')}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[var(--mcs-surface-2)] text-[var(--mcs-text-muted)] text-[11px] uppercase tracking-wider sticky top-0 border-b border-[var(--mcs-border)]">
            <tr>
              <th className="p-3 font-bold w-[180px]">
                {t('Master.maDaoCat')}
              </th>
              <th className="p-3 font-bold">
                {t('Master.loaiDao')}
              </th>
              <th className="p-3 font-bold w-[150px]">
                {t('Master.khoNgang')}
              </th>
              <th className="p-3 font-bold w-[120px]">
                {t('Master.status')}
              </th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {cutters?.map((item: any) => (
              <tr key={item.id} className="border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] group cursor-pointer transition-colors">
                <td className="p-3 font-mono font-bold text-[var(--mcs-text)] text-sm">{item.code}</td>
                <td className="p-3">
                  {item.type ? <span className="px-2 py-0.5 bg-[var(--mcs-surface-2)] border border-[var(--mcs-border)] rounded text-[11px]">{item.type}</span> : '-'}
                </td>
                <td className="p-3">{item.width_mm ? `${item.width_mm} mm` : '-'}</td>
                <td className="p-3">
                  {item.is_active ? 
                    (<span className="px-2 py-0.5 bg-[var(--mcs-success-light)] text-[var(--mcs-success-text)] border border-[rgba(39,174,96,0.25)] rounded uppercase text-[10px] font-bold">Active</span>) :
                    (<span className="px-2 py-0.5 bg-[var(--mcs-neutral-light)] text-[var(--mcs-neutral-text)] border border-[rgba(149,165,166,0.25)] rounded uppercase text-[10px] font-bold">Inactive</span>)
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
