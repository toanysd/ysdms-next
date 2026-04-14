import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { addPlasticAction } from '@/app/actions/plastic'

export default function NewPlasticPage() {
  return (
    <div className="flex flex-col h-full bg-[var(--mcs-surface)] rounded-lg border border-[var(--mcs-border)] overflow-hidden shadow-sm max-w-3xl mx-auto w-full">
      {/* Module Header Toolbar */}
      <div className="h-[48px] bg-[var(--mcs-surface-3)] px-4 flex items-center justify-between border-b border-[var(--mcs-border)] shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/master/plastic" className="text-[var(--mcs-text-muted)] hover:text-[var(--mcs-primary)] transition-colors mr-2">
            <ArrowLeft size={18} />
          </Link>
          <h2 className="text-[14px] font-bold text-[var(--mcs-text)] flex flex-col">
            <span className="ja">新規プラ材料登録</span>
            <span className="vi font-normal text-[var(--mcs-text-muted)] mt-[-2px]">Đăng ký Cuộn Nhựa mới</span>
          </h2>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto p-6">
        <form action={addPlasticAction} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">材料コード <span className="text-[var(--mcs-error)]">*</span></span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Mã Nhựa (vd: PET-FR-02)</span>
              </label>
              <input type="text" name="code" required className="w-full h-[34px]" placeholder="VD: PET-FR-02" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">分類 (Family) <span className="text-[var(--mcs-error)]">*</span></span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Chủng loại (PS, PET, PP)</span>
              </label>
              <select name="family" required className="w-full h-[34px] bg-white">
                <option value="">Chọn Family</option>
                <option value="PS">PS</option>
                <option value="PET">PET</option>
                <option value="PP">PP</option>
                <option value="PVC">PVC</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">厚み (mm) <span className="text-[var(--mcs-error)]">*</span></span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Độ dày (VD: 0.5)</span>
              </label>
              <input type="number" step="0.01" min="0" name="thickness_mm" required className="w-full h-[34px]" placeholder="0.00" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">幅 (mm) <span className="text-[var(--mcs-error)]">*</span></span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Khổ ngang (VD: 680)</span>
              </label>
              <input type="number" step="1" min="0" name="width_mm" required className="w-full h-[34px]" placeholder="0" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">色 (Color)</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Màu sắc (VD: T, BK)</span>
              </label>
              <input type="text" name="color" className="w-full h-[34px]" placeholder="VD: T (Trong suốt)" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">グレード (Grade)</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Phân loại kỹ thuật (Chống tĩnh điện...)</span>
              </label>
              <input type="text" name="grade" className="w-full h-[34px]" placeholder="VD: AS (Chống tĩnh điện)" />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold">
                <span className="ja">発注点 (kg)</span>
                <span className="vi text-[10px] text-[var(--mcs-text-muted)] block mt-[-2px]">Mức tồn kho tối thiểu báo động</span>
              </label>
              <input type="number" step="0.1" min="0" name="reorder_point_kg" className="w-full h-[34px]" placeholder="VD: 50.0" defaultValue="0" />
            </div>

          </div>

          <div className="border-t border-[var(--mcs-border)] pt-4 flex justify-end gap-3 mt-6">
            <Link href="/master/plastic">
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
