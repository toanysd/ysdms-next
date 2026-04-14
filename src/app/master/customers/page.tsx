import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Search, Users } from 'lucide-react'

export type Customer = {
  id: string
  customer_code: string
  delivery_name: string
  contact_person: string | null
  phone: string | null
  is_active: boolean
}

export default async function CustomersPage() {
  const supabase = await createClient()
  
  const { data: customers, error } = await supabase
    .from('customers')
    .select('*')
    .order('customer_code', { ascending: true })
    .limit(100)

  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm">
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-[var(--mcs-text-muted)]" />
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span className="ja">顧客・納入先マスター</span>
            <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Danh mục Khách Hàng / Điểm giao nhận</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1.5 text-[var(--mcs-text-muted)]" size={16} />
            <input 
              type="text" 
              placeholder="Tìm mã hoặc tên khách..." 
              className="h-[30px] w-[200px] pl-8 text-xs border-[var(--mcs-border)] focus:border-[var(--mcs-primary)] rounded"
            />
          </div>
          <Link href="/master/customers/new">
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
              <th className="p-3 font-bold w-[120px]">
                <span className="ja">顧客コード</span><span className="vi">Mã KH</span>
              </th>
              <th className="p-3 font-bold w-[250px]">
                <span className="ja">納入先名称</span><span className="vi">Tên Đơn vị giao hàng</span>
              </th>
              <th className="p-3 font-bold w-[150px]">
                <span className="ja">担当者 (サブ)</span><span className="vi">Liên hệ</span>
              </th>
              <th className="p-3 font-bold w-[120px]">
                <span className="ja">電話番号</span><span className="vi">SĐT</span>
              </th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {error && (<tr><td colSpan={4} className="p-4 text-[var(--mcs-error)]">Lỗi dữ liệu: {error.message}</td></tr>)}
            {customers?.map((item: Customer) => (
              <tr key={item.id} className="border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] transition-colors">
                <td className="p-3 font-mono font-bold text-[var(--mcs-text)] text-sm">{item.customer_code}</td>
                <td className="p-3 whitespace-nowrap overflow-hidden text-ellipsis max-w-[250px]" title={item.delivery_name}>{item.delivery_name}</td>
                <td className="p-3">{item.contact_person || '-'}</td>
                <td className="p-3">{item.phone || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
