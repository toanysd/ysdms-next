import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Search, Layers, ChevronRight } from 'lucide-react'

export type MoldBase = {
  id: string
  code: string
  name: string | null
  customer_id: string | null
  is_active: boolean
  prototype_base_id: string | null
  customers?: {
    delivery_name: string
    customer_code: string
  } | null
  mold_design_revision?: { id: string }[]
}

export default async function MoldBasePage() {
  const supabase = await createClient()

  // Nạp dữ liệu kèm thông tin khách hàng (JOIN) + đếm Revisions
  const { data: molds, error } = await supabase
    .from('mold_base')
    .select(`
      *,
      customers ( customer_code, delivery_name ),
      mold_design_revision ( id )
    `)
    .order('code', { ascending: true })

  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm">
      {/* Module Header Toolbar */}
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Layers size={20} className="text-[var(--mcs-text-muted)]" />
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span className="ja">金型マスター (Base)</span>
            <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Danh mục Khuôn gốc</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 text-[var(--mcs-text-muted)]" size={16} />
            <input
              type="text"
              placeholder="Tìm mã khuôn..."
              className="h-[30px] w-[200px] pl-8 text-xs border-[var(--mcs-border)] focus:border-[var(--mcs-primary)] rounded"
            />
          </div>
          <Link href="/master/mold/new">
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
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-[var(--mcs-surface-3)] sticky top-0 z-10 shadow-[0_1px_0_var(--mcs-border)] text-xs text-[var(--mcs-text-secondary)]">
            <tr>
              <th className="p-3 font-bold w-[180px]">
                <span className="ja">金型コード</span><span className="vi">Mã Khuôn (Base)</span>
              </th>
              <th className="p-3 font-bold">
                <span className="ja">金型名称</span><span className="vi">Tên Khuôn</span>
              </th>
              <th className="p-3 font-bold w-[160px]">
                <span className="ja">顧客</span><span className="vi">Khách hàng</span>
              </th>
              <th className="p-3 font-bold w-[100px] text-center">
                <span className="ja">設計版数</span><span className="vi">Revisions</span>
              </th>
              <th className="p-3 font-bold w-[100px]">
                <span className="ja">状態</span><span className="vi">Status</span>
              </th>
              <th className="p-3 w-[40px]"></th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {error && (
              <tr><td colSpan={6} className="p-4 text-center text-[var(--mcs-error)]">Lỗi truy xuất: {error.message}</td></tr>
            )}
            {!error && (!molds || molds.length === 0) && (
              <tr><td colSpan={6} className="p-8 text-center text-[var(--mcs-text-muted)]">Chưa có khuôn nào. Vui lòng tạo Khuôn gốc mới.</td></tr>
            )}
            {molds?.map((item: MoldBase) => (
              <tr key={item.id} className="border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] group transition-colors">
                <td className="p-3">
                  <Link href={`/master/mold/${item.id}`} className="font-mono font-bold text-[var(--mcs-primary)] text-sm hover:underline">
                    {item.code}
                  </Link>
                </td>
                <td className="p-3">{item.name || '-'}</td>
                <td className="p-3">
                  {item.customers ? (
                    <span className="px-2 py-0.5 bg-[var(--mcs-primary-light)] text-[var(--mcs-primary)] border border-[var(--mcs-primary)] border-opacity-30 rounded font-bold text-[11px]">
                      {item.customers.customer_code}
                    </span>
                  ) : <span className="text-[var(--mcs-text-muted)]">-</span>}
                </td>
                <td className="p-3 text-center">
                  <span className="inline-flex items-center justify-center min-w-[24px] h-[22px] px-1.5 rounded-full bg-[var(--mcs-surface-3)] text-[var(--mcs-text-secondary)] font-bold text-[11px]">
                    {item.mold_design_revision?.length || 0}
                  </span>
                </td>
                <td className="p-3">
                  {item.is_active ?
                    (<span className="px-2 py-0.5 bg-[var(--mcs-success-light)] text-[var(--mcs-success-text)] border border-[rgba(39,174,96,0.25)] rounded uppercase text-[10px] font-bold">Active</span>) :
                    (<span className="px-2 py-0.5 bg-[var(--mcs-neutral-light)] text-[var(--mcs-neutral-text)] border border-[rgba(149,165,166,0.25)] rounded uppercase text-[10px] font-bold">Inactive</span>)
                  }
                </td>
                <td className="p-3">
                  <Link href={`/master/mold/${item.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--mcs-text-muted)]">
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
