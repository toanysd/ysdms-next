import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Search, Server } from 'lucide-react'

export type MachineMaster = {
  id: string
  code: string
  type: string | null
  status: string | null
  is_active: boolean
}

export default async function MachineMasterPage() {
  const supabase = await createClient()
  
  const { data: machines, error } = await supabase
    .from('machine_master')
    .select('*')
    .order('code', { ascending: true })

  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm">
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Server size={20} className="text-[var(--mcs-text-muted)]" />
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span className="ja">設備・機械マスター</span>
            <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Danh mục Máy Sản Xuất</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 text-[var(--mcs-text-muted)]" size={16} />
            <input 
              type="text" 
              placeholder="Tìm mã máy..." 
              className="h-[30px] w-[200px] pl-8 text-xs border-[var(--mcs-border)] focus:border-[var(--mcs-primary)] rounded"
            />
          </div>
          <Link href="/master/machine/new">
            <button className="btn-primary h-[30px] px-3 flex items-center gap-1 text-xs">
              <Plus size={16} />
              <div className="flex flex-col items-center leading-none mt-1">
                <span className="ja">新規登録</span>
              </div>
            </button>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead className="bg-[var(--mcs-surface-3)] sticky top-0 z-10 shadow-[0_1px_0_var(--mcs-border)] text-xs text-[var(--mcs-text-secondary)]">
            <tr>
              <th className="p-3 font-bold w-[150px]">
                <span className="ja">号機コード</span><span className="vi">Mã Máy</span>
              </th>
              <th className="p-3 font-bold w-[200px]">
                <span className="ja">機種・タイプ</span><span className="vi">Loại Máy đúc</span>
              </th>
              <th className="p-3 font-bold w-[120px]">
                <span className="ja">稼働状態</span><span className="vi">Status</span>
              </th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {machines?.map((item: MachineMaster) => (
              <tr key={item.id} className="border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] hover:bg-opacity-50">
                <td className="p-3 font-mono font-bold text-[var(--mcs-text)] text-sm">{item.code}</td>
                <td className="p-3">{item.type || '-'}</td>
                <td className="p-3">
                  {item.status === 'RUNNING' ? (
                     <span className="px-2 py-0.5 bg-[var(--mcs-success-light)] text-[var(--mcs-success-text)] border border-[rgba(39,174,96,0.25)] rounded text-[10px] font-bold">RUNNING</span>
                  ) : item.status === 'MAINTENANCE' ? (
                     <span className="px-2 py-0.5 bg-[var(--mcs-warning-light)] text-[var(--mcs-warning-text)] border border-[rgba(243,156,18,0.25)] rounded text-[10px] font-bold">MAINTENANCE</span>
                  ) : (
                     <span className="px-2 py-0.5 bg-[var(--mcs-neutral-light)] text-[var(--mcs-neutral-text)] border border-[rgba(149,165,166,0.25)] rounded text-[10px] font-bold">IDLE</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
