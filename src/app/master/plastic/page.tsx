import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus, Search } from 'lucide-react'

// Cấu trúc Type đồng bộ với Database Blueprint
export type PlasticMaster = {
  id: string
  code: string
  family: string
  thickness_mm: number
  width_mm: number
  color: string | null
  grade: string | null
  density_g_cm3: number | null
  reorder_point_kg: number
  is_active: boolean
}

export default async function PlasticMasterPage() {
  const supabase = await createClient()
  
  // Tạm thời query toàn bộ, nếu bảng lớn sẽ chia Pagination sau
  const { data: plastics, error } = await supabase
    .from('plastic_master')
    .select('*')
    .order('code', { ascending: true })

  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm">
      {/* Module Header Toolbar */}
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span className="ja">プラ材料マスター</span>
            <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Danh mục cuộn nhựa</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Global Search Input placeholder */}
          <div className="relative">
            <Search className="absolute left-2 top-1.5 text-[var(--mcs-text-muted)]" size={16} />
            <input 
              type="text" 
              placeholder="Tìm mã / family..." 
              className="h-[30px] w-[200px] pl-8 text-xs border-[var(--mcs-border)] focus:border-[var(--mcs-primary)] rounded"
            />
          </div>
          <Link href="/master/plastic/new">
            <button className="btn-primary h-[30px] px-3 flex items-center gap-1 text-xs">
              <Plus size={16} />
              <div className="flex flex-col items-center leading-none mt-1">
                <span className="ja">新規登録</span>
              </div>
            </button>
          </Link>
        </div>
      </div>

      {/* Tách phần Content để Scroll */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-[var(--mcs-surface-3)] sticky top-0 z-10 shadow-[0_1px_0_var(--mcs-border)] text-xs text-[var(--mcs-text-secondary)]">
            <tr>
              <th className="p-2 font-bold min-w-[150px]">
                <span className="ja">材料コード</span><span className="vi">Mã Nhựa</span>
              </th>
              <th className="p-2 font-bold min-w-[100px]">
                <span className="ja">分類</span><span className="vi">Family</span>
              </th>
              <th className="p-2 font-bold min-w-[200px]">
                <span className="ja">厚・幅 (mm)</span><span className="vi">Dày x Khổ</span>
              </th>
              <th className="p-2 font-bold hidden md:table-cell">
                <span className="ja">色/Grade</span><span className="vi">Màu sắc</span>
              </th>
              <th className="p-2 font-bold text-right hidden lg:table-cell">
                <span className="ja">発注点 (kg)</span><span className="vi">Min. Stock</span>
              </th>
              <th className="p-2 font-bold w-[120px]">
                <span className="ja">状態</span><span className="vi">Status</span>
              </th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {error && (
              <tr><td colSpan={6} className="p-4 text-center text-[var(--mcs-error)]">Lỗi truy xuất: {error.message}</td></tr>
            )}
            {!error && plastics?.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-[var(--mcs-text-muted)]">Chưa có dữ liệu. Vui lòng thêm vật liệu nhựa mới.</td></tr>
            )}
            {plastics?.map((item: PlasticMaster) => (
              <tr key={item.id} className="border-b border-[var(--mcs-border)] hover:bg-[var(--mcs-surface-hover)] group cursor-pointer transition-colors">
                <td className="p-2 font-mono font-bold text-[var(--mcs-text)]">{item.code}</td>
                <td className="p-2"><span className="px-2 py-0.5 bg-[var(--mcs-surface-3)] border border-[var(--mcs-border)] rounded text-[11px] font-bold text-[var(--mcs-text)]">{item.family}</span></td>
                <td className="p-2 font-mono">{item.thickness_mm} <span className="text-[var(--mcs-text-muted)]">x</span> {item.width_mm}</td>
                <td className="p-2 hidden md:table-cell">{item.color || '-'} {item.grade ? `(${item.grade})` : ''}</td>
                <td className="p-2 text-right font-mono font-bold hidden lg:table-cell text-[var(--mcs-text-secondary)]">{item.reorder_point_kg > 0 ? item.reorder_point_kg : '-'}</td>
                <td className="p-2">
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
