import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { addMoldBaseAction } from '@/app/actions/mold'

export default async function NewMoldBasePage() {
  const supabase = await createClient()
  
  // Fetch danh sách khách hàng để đưa vào thẻ Select
  const { data: customers } = await supabase
    .from('customers')
    .select('id, code, name')
    .order('code', { ascending: true })

  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm max-w-2xl mx-auto w-full">
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/master/mold" className="text-[var(--mcs-text-muted)] hover:text-[var(--mcs-primary)] transition-colors mr-2">
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span className="ja">新規金型登録 (Base)</span>
            <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Đăng ký Khuôn gốc mới</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 p-4 bg-[var(--mcs-info-light)] border-l-4 border-[var(--mcs-info)] rounded-r flex flex-col gap-1">
          <span className="ja font-bold text-[12px] text-[var(--mcs-info-text)]">💡 Base Mold (Khuôn Gốc) là gì?</span>
          <span className="vi text-[11px] text-[var(--mcs-text-secondary)] leading-relaxed">
            Khuôn gốc là định danh kinh doanh (Ví dụ: JAE-001). Sau khi tạo xong Khuôn gốc, bạn mới có thể tạo các Bản thiết kế (Revision R1, R2...) và Khuôn vật lý.
          </span>
        </div>

        <form action={addMoldBaseAction} className="space-y-6">
          <div className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">金型コード <span className="text-[var(--mcs-error)]">*</span></span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Mã Khuôn gốc (VD: JAE-001)</span>
              </label>
              <input type="text" name="code" required className="w-full h-[34px] font-mono text-sm" placeholder="VD: JAE-001" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">金型名称</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Tên Khuôn (Tùy chọn)</span>
              </label>
              <input type="text" name="name" className="w-full h-[34px]" placeholder="VD: Khay linh kiện A" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">顧客 (Customer)</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Khách hàng sở hữu</span>
              </label>
              <select name="customer_id" className="w-full h-[34px] bg-white text-sm">
                <option value="">-- Chưa gán khách hàng --</option>
                {customers?.map(c => (
                  <option key={c.id} value={c.id}>
                    [{c.code}] {c.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="border-t border-[var(--mcs-border)] pt-4 flex justify-end gap-3 mt-6">
            <Link href="/master/mold">
              <button type="button" className="h-[34px] px-4 rounded border border-[var(--mcs-border)] text-[var(--mcs-text)] hover:bg-[var(--mcs-surface-2)] transition-colors">
                <span className="ja">キャンセル</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-4px]">Hủy bỏ</span>
              </button>
            </Link>
            
            <button type="submit" className="h-[34px] px-6 rounded bg-[var(--mcs-primary)] text-white font-bold hover:bg-[var(--mcs-primary-hover)] flex items-center justify-center gap-2 transition-colors">
              <Save size={16} />
              <div className="flex flex-col leading-none mt-[2px]">
                <span className="ja">保存</span>
                <span className="vi text-[9px] font-normal opacity-80 block mt-[1px]">Lưu Khuôn gốc</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
