export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Scissors } from 'lucide-react'

export type CutterMaster = {
  id: string
  code: string
  type: string | null
  width_mm: number | null
  is_active: boolean
}

export default async function CutterMasterPage() {
  const tMaster = await getTranslations('Master')
  const tCommon = await getTranslations('Common')
  const supabase = await createClient()
  
  const { data: cutters, error } = await supabase
    .from('cutters')
    .select('id:cutter_id, code:cutter_no, type:cutter_type, width_mm:cutter_width_mm, is_active:cutter_presence')
    .order('cutter_no', { ascending: true })

  return (
    <div className="flex flex-col h-full gap-3">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Scissors size={20} style={{ color: 'var(--accent)' }} />
          <h1 className="text-[15px] font-bold" style={{ color: 'var(--text-primary)' }}>
            {tMaster('maDaoCat')}
          </h1>
        </div>
      </div>

      <div className="card-flat flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{tMaster('maDaoCat')}</th>
                <th>{tMaster('loaiDao')}</th>
                <th>{tMaster('khoNgang')}</th>
                <th style={{ textAlign: 'center' }}>{tMaster('trangThai')}</th>
              </tr>
            </thead>
            <tbody>
              {error && (
                <tr>
                  <td colSpan={4} style={{ padding: 16, color: 'var(--status-error)' }}>
                    {error.message}
                  </td>
                </tr>
              )}
              {!error && (!cutters || cutters.length === 0) && (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
                    {tCommon('noData')}
                  </td>
                </tr>
              )}
              {cutters?.map((item: any) => (
                <tr key={item.id}>
                  <td className="font-mono font-bold text-[13px]" style={{ color: 'var(--accent)' }}>
                    {item.code}
                  </td>
                  <td>
                    {item.type ? (
                      <span className="badge badge--neutral font-bold">{item.type}</span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="font-mono font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                    {item.width_mm ? `${item.width_mm} mm` : '—'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${item.is_active ? 'badge--success' : 'badge--neutral'}`}>
                      {item.is_active ? tMaster('activeStatus') : tMaster('inactiveStatus')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

