import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { addProductAction } from '@/app/actions/product'

export default function NewProductPage() {
  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm max-w-2xl mx-auto w-full">
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/master/product" className="text-[var(--mcs-text-muted)] hover:text-[var(--mcs-primary)] transition-colors mr-2">
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span className="ja">新規製品登録 (Tray)</span>
            <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Đăng ký Khay sản phẩm mới</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <form action={addProductAction} className="space-y-6">
          <div className="flex flex-col gap-4">
            
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">製品コード <span className="text-[var(--mcs-error)]">*</span></span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Mã Khay (VD: TR-001)</span>
              </label>
              <input type="text" name="code" required className="w-full h-[34px] font-mono text-sm" placeholder="VD: TR-001" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">製品名称</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Tên Khay (Tùy chọn)</span>
              </label>
              <input type="text" name="name" className="w-full h-[34px]" placeholder="VD: Khay đựng linh kiện 20 lỗ" />
            </div>

          </div>

          <div className="border-t border-[var(--mcs-border)] pt-4 flex justify-end gap-3 mt-6">
            <Link href="/master/product">
              <button type="button" className="h-[34px] px-4 rounded border border-[var(--mcs-border)] text-[var(--mcs-text)] hover:bg-[var(--mcs-surface-2)] transition-colors">
                <span className="ja">キャンセル</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-4px]">Hủy bỏ</span>
              </button>
            </Link>
            
            <button type="submit" className="h-[34px] px-6 rounded bg-[var(--mcs-primary)] text-white font-bold hover:bg-[var(--mcs-primary-hover)] flex items-center justify-center gap-2 transition-colors">
              <Save size={16} />
              <div className="flex flex-col leading-none mt-[2px]">
                <span className="ja">保存</span>
                <span className="vi text-[9px] font-normal opacity-80 block mt-[1px]">Lưu Khay (Tray)</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
