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

            {/* Header section (Tags) */}
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-2 shadow-sm">
              <h3 className="text-sm font-bold text-teal-800 mb-3 flex items-center gap-2">
                🏷️ Thông Tin Cơ Bản
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-teal-900">
                    <span className="ja">製品コード <span className="text-[var(--mcs-error)]">*</span></span>
                    <span className="vi text-[10px] text-teal-700 block mt-[-2px]">Mã Khay (P/N)</span>
                  </label>
                  <input type="text" name="code" required className="w-full h-[34px] font-mono text-sm border-teal-200 focus:border-teal-500 rounded px-2" placeholder="VD: TR-001" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-teal-900">
                    <span className="ja">製品名称</span>
                    <span className="vi text-[10px] text-teal-700 block mt-[-2px]">Tên Khay / 型番</span>
                  </label>
                  <input type="text" name="name" className="w-full h-[34px] border-teal-200 focus:border-teal-500 rounded px-2" placeholder="VD: JAE-2X4" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-teal-900">
                    <span className="ja">得意先コード</span>
                    <span className="vi text-[10px] text-teal-700 block mt-[-2px]">Mã Khách hàng</span>
                  </label>
                  <input type="text" name="customer_code" className="w-full h-[34px] font-mono text-sm border-teal-200 focus:border-teal-500 rounded px-2" placeholder="VD: CUST-XYZ" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-teal-900">
                    <span className="ja">材質</span>
                    <span className="vi text-[10px] text-teal-700 block mt-[-2px]">Vật liệu</span>
                  </label>
                  <input type="text" name="material" className="w-full h-[34px] border-teal-200 focus:border-teal-500 rounded px-2" placeholder="VD: PS(CL), PP(N)" />
                </div>
              </div>
            </div>

            {/* Material Dimensions */}
            <div className="border border-[var(--mcs-border)] rounded-lg p-4">
              <h3 className="text-sm font-bold text-[var(--mcs-text)] mb-3 flex items-center gap-2">
                📐 Thông Số Vật Liệu Tấm
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold">
                    <span className="ja">厚み (mm)</span>
                    <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Độ dày (mm)</span>
                  </label>
                  <input type="number" step="0.001" name="thickness" className="w-full h-[34px] font-mono text-sm px-2 border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)]" placeholder="0.000" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold">
                    <span className="ja">ｼｰﾄ巾 (mm)</span>
                    <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Khổ rộng tấm (mm)</span>
                  </label>
                  <input type="number" step="0.001" name="sheet_width" className="w-full h-[34px] font-mono text-sm px-2 border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)]" placeholder="0.000" />
                </div>
              </div>
            </div>

            {/* Tray Dimensions */}
            <div className="border border-[var(--mcs-border)] rounded-lg p-4">
              <h3 className="text-sm font-bold text-[var(--mcs-text)] mb-3 flex items-center gap-2">
                📏 Kích Thước Khay
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Length */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold">
                      <span className="ja">長手 (mm)</span>
                      <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Chiều dài (mm)</span>
                    </label>
                    <input type="number" step="0.001" name="length_val" className="w-full h-[34px] font-mono text-sm px-2 border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)]" placeholder="0.000" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--mcs-text-muted)] whitespace-nowrap">+上限</span>
                      <input type="number" step="0.001" name="length_tol_upper" className="w-full h-[28px] text-[11px] px-2 border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)]" placeholder="+0.0" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--mcs-text-muted)] whitespace-nowrap">-下限</span>
                      <input type="number" step="0.001" name="length_tol_lower" className="w-full h-[28px] text-[11px] px-2 border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)]" placeholder="-0.0" />
                    </div>
                  </div>
                </div>

                {/* Width */}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold">
                      <span className="ja">短手 (mm)</span>
                      <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Chiều rộng (mm)</span>
                    </label>
                    <input type="number" step="0.001" name="width_val" className="w-full h-[34px] font-mono text-sm px-2 border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)]" placeholder="0.000" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--mcs-text-muted)] whitespace-nowrap">+上限</span>
                      <input type="number" step="0.001" name="width_tol_upper" className="w-full h-[28px] text-[11px] px-2 border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)]" placeholder="+0.0" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--mcs-text-muted)] whitespace-nowrap">-下限</span>
                      <input type="number" step="0.001" name="width_tol_lower" className="w-full h-[28px] text-[11px] px-2 border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)]" placeholder="-0.0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Surface & Packaging */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-[var(--mcs-border)] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[var(--mcs-text)] mb-3 flex items-center gap-2">
                  ⚡ Xử Lý Bề Mặt
                </h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="antistatic" className="w-4 h-4 accent-teal-600 rounded" />
                    <span className="text-sm">Chống tĩnh điện (帯電防止)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="silicone" className="w-4 h-4 accent-teal-600 rounded" />
                    <span className="text-sm">Tráng Silicone (ｼﾘｺﾝ塗布)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="coating" className="w-4 h-4 accent-teal-600 rounded" />
                    <span className="text-sm">Cán màng (塗布)</span>
                  </label>
                </div>
              </div>

              <div className="border border-[var(--mcs-border)] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[var(--mcs-text)] mb-3 flex items-center gap-2">
                  📦 Đóng Gói
                </h3>
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold">
                    <span className="ja">入数</span>
                    <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Số khay/thùng</span>
                  </label>
                  <input type="number" name="quantity_per_box" className="w-full h-[34px] font-mono text-sm px-2 border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)] max-w-[150px]" placeholder="VD: 500" />
                </div>
              </div>
            </div>

            {/* Remarks & Status */}
            <div className="border border-[var(--mcs-border)] rounded-lg p-4">
              <h3 className="text-sm font-bold text-[var(--mcs-text)] mb-3 flex items-center gap-2">
                📝 Ghi Chú & Trạng Thái
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold">
                    <span className="ja">備考</span>
                    <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Ghi chú kỹ thuật</span>
                  </label>
                  <textarea name="remarks" className="w-full h-[80px] p-2 text-sm border border-[var(--mcs-border)] focus:border-[var(--mcs-primary)] rounded resize-y" placeholder="Nhập ghi chú..."></textarea>
                </div>

                <label className="flex items-center gap-2 cursor-pointer bg-[var(--mcs-surface-hover)] p-2 rounded border border-[var(--mcs-border)]">
                  <input type="checkbox" name="is_active" defaultChecked className="w-4 h-4 accent-teal-600 rounded" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Đang hoạt động (Active)</span>
                    <span className="text-[10px] text-[var(--mcs-text-muted)]">Bỏ chọn nếu khay này đã bị dừng sản xuất</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          <div className="border-t border-[var(--mcs-border)] pt-4 flex justify-end gap-3 mt-6 pb-6">
            <Link href="/master/product">
              <button type="button" className="h-[34px] px-4 rounded border border-[var(--mcs-border)] text-[var(--mcs-text)] hover:bg-[var(--mcs-surface-2)] transition-colors">
                <span className="ja">キャンセル</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-4px]">Hủy bỏ</span>
              </button>
            </Link>

            <button type="submit" className="h-[34px] px-6 rounded bg-teal-700 text-white font-bold hover:bg-teal-800 flex items-center justify-center gap-2 transition-colors">
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
