import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Search, Box } from 'lucide-react'

export type ProductMaster = {
  id: string
  code: string
  name: string | null
  is_active: boolean
}

export default async function ProductMasterPage() {
  const supabase = await createClient()
  
  const { data: products, error } = await supabase
    .from('product_master')
    .select('*')
    .order('code', { ascending: true })

  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm">
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Box size={20} className="text-[var(--mcs-text-muted)]" />
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span className="ja">製品マスター (Tray)</span>
            <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Danh mục Khay sản phẩm</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 text-[var(--mcs-text-muted)]" size={16} />
            <input 
              type="text" 
              placeholder="Tìm mã khay..." 
              className="h-[30px] w-[200px] pl-8 text-xs border-[var(--mcs-border)] focus:border-[var(--mcs-primary)] rounded"
            />
          </div>
          <Link href="/master/product/new">
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
              <th className="p-3 font-bold w-[200px]">
                <span className="ja">製品コード</span><span className="vi">Mã Khay</span>
              </th>
              <th className="p-3 font-bold">
                <span className="ja">製品名称</span><span className="vi">Tên Sản phẩm</span>
              </th>
              <th className="p-3 font-bold w-[120px]">
                <span className="ja">状態</span><span className="vi">Status</span>
              </th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {products?.map((item: ProductMaster) => (
              <tr key={item.id} className="border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] group cursor-pointer transition-colors">
                <td className="p-3 font-mono font-bold text-[var(--mcs-text)] text-sm">{item.code}</td>
                <td className="p-3">{item.name || '-'}</td>
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
