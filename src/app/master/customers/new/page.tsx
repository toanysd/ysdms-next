import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { addCustomerAction } from '@/app/actions/customer'

export default function NewCustomerPage() {
  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm max-w-3xl mx-auto w-full">
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/master/customers" className="text-[var(--mcs-text-muted)] hover:text-[var(--mcs-primary)] transition-colors mr-2">
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span className="ja">新規顧客登録</span>
            <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Thêm Khách hàng mới</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <form action={addCustomerAction} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">No. (ID) <span className="text-[var(--mcs-error)]">*</span></span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Mã định danh (VD: AMP1)</span>
              </label>
              <input type="text" name="customer_code" required className="w-full h-[34px] font-mono text-sm" placeholder="VD: AMP1" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">送り先 <span className="text-[var(--mcs-error)]">*</span></span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Tên chi nhánh/đơn vị nhận hàng</span>
              </label>
              <input type="text" name="delivery_name" required className="w-full h-[34px]" placeholder="VD: (株)アーク RPT工場" />
            </div>
            
            <div className="flex flex-col gap-1 col-span-2">
              <label className="text-[12px] font-bold">
                <span className="ja">住所</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Địa chỉ giao hàng</span>
              </label>
              <input type="text" name="delivery_address" className="w-full h-[34px]" placeholder="Địa chỉ đầy đủ..." />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">サブ (Contact Person)</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Người liên hệ / Bộ phận</span>
              </label>
              <input type="text" name="contact_person" className="w-full h-[34px]" placeholder="VD: 昆野 様宛" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">電話番号 (Phone)</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Số điện thoại</span>
              </label>
              <input type="text" name="phone" className="w-full h-[34px]" placeholder="VD: 03-XXXX-XXXX" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">依頼元(依頼主)</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Mã bên đặt hàng (VD: AMP01)</span>
              </label>
              <input type="text" name="requester_code" className="w-full h-[34px]" placeholder="VD: AMP01" />
            </div>

          </div>

          <div className="border-t border-[var(--mcs-border)] pt-4 flex justify-end gap-3 mt-6">
            <Link href="/master/customers">
              <button type="button" className="h-[34px] px-4 rounded border border-[var(--mcs-border)] text-[var(--mcs-text)] hover:bg-[var(--mcs-surface-2)] transition-colors">
                <span className="ja">キャンセル</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-4px]">Hủy bỏ</span>
              </button>
            </Link>
            
            <button type="submit" className="h-[34px] px-6 rounded bg-[var(--mcs-primary)] text-white font-bold hover:bg-[var(--mcs-primary-hover)] flex items-center justify-center gap-2 transition-colors">
              <Save size={16} />
              <div className="flex flex-col leading-none mt-[2px]">
                <span className="ja">保存</span>
                <span className="vi text-[9px] font-normal opacity-80 block mt-[1px]">Lưu dữ liệu</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
