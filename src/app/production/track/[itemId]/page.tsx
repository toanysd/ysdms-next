import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { startProductionLog, completeProductionLog, getOperators } from '@/app/actions/production'
import { recordTrayIn } from '@/app/actions/inventory'
import { ChevronLeft, Play, CheckCircle, Factory, User, Wrench } from 'lucide-react'

// Props for app router
export default async function ProductionTrackPage({
    params,
    searchParams
}: {
    params: Promise<{ itemId: string }>
    searchParams: Promise<{ logId?: string }>
}) {
    const { itemId } = await params
    const { logId } = await searchParams

    const supabase = await createClient()

    // Fetch order item details
    const { data: itemData } = await supabase
        .from('order_lines')
        .select(`
            line_id, quantity, product_id,
            products(product_code, product_name, notes),
            orders(order_no, company_id)
        `)
        .eq('line_id', itemId)
        .single()

    if (!itemData) {
        return (
            <div className="p-10 text-center">
                <h2>Không tìm thấy Order Item</h2>
                <Link href="/production" className="text-[var(--mcs-primary)] underline">Quay lại</Link>
            </div>
        )
    }

    // IF COMPLETING
    if (logId) {
        const { data: logData } = await supabase
            .from('production_logs')
            .select(`
                *,
                machines(machine_code, machine_name),
                employees(employee_name, employee_name_short)
            `)
            .eq('log_id', logId)
            .single()

        if (!logData) return <div className="p-10">Log không tồn tại</div>
        if (logData.end_time) return <div className="p-10 text-emerald-500 font-bold">Ca này đã được chốt xong! <Link href="/production" className="underline">Quay lại</Link></div>

        const handleComplete = async (formData: FormData) => {
            'use server'
            const producedQty = Number(formData.get('produced_qty')) || 0
            const scrapQty = Number(formData.get('scrap_qty')) || 0
            const doInventoryIn = formData.get('do_inventory_in') === 'on'
            const lotNo = formData.get('lot_no') as string
            
            const rollBarcode = formData.get('roll_barcode') as string
            const metersConsumed = Number(formData.get('meters_consumed')) || 0
            const metersRemaining = Number(formData.get('meters_remaining')) || 0
            const metersWasted = Number(formData.get('meters_wasted')) || 0

            try {
                await completeProductionLog({
                    log_id: logId,
                    produced_qty: producedQty,
                    scrap_qty: scrapQty,
                    roll_barcode: rollBarcode,
                    meters_consumed: metersConsumed,
                    meters_remaining: metersRemaining,
                    meters_wasted: metersWasted
                })
            } catch (err: any) {
                redirect('/production/track/' + itemId + '?logId=' + logId + '&error=complete_failed')
            }

            const goodQty = producedQty - scrapQty
            
            if (doInventoryIn && goodQty > 0) {
                const operatorName = logData.employees?.employee_name_short || logData.employees?.employee_name || null
                const invResult = await recordTrayIn({
                    product_id: itemData.product_id,
                    production_log_id: logId,
                    quantity: goodQty,
                    lot_no: lotNo || null,
                    operator_name: operatorName
                })
                
                if (!invResult?.success) {
                    redirect('/production?warning=inventory_failed')
                }
            }

            redirect('/production')
        }

        return (
            <div className="p-6 max-w-xl mx-auto bg-[var(--mcs-surface)] min-h-screen">
                <Link href="/production" className="flex items-center gap-2 text-[var(--mcs-primary)] mb-6 font-bold">
                    <ChevronLeft /> Kanbanへ戻る (Quay lại Kanban)
                </Link>

                <div className="bg-[var(--mcs-surface-2)] p-4 rounded-lg border border-[var(--mcs-border)] mb-6">
                    <h1 className="text-xl font-bold text-[var(--mcs-text)] flex items-center gap-2 mb-2">
                        <CheckCircle className="text-emerald-500" />
                        完了報告 (Chốt Ca Máy)
                    </h1>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div><span className="text-[var(--mcs-text-muted)]">品番 (Mã hàng):</span> <b>{itemData.products?.product_code}</b></div>
                        <div><span className="text-[var(--mcs-text-muted)]">予定数 (Yêu cầu gốc):</span> <b>{itemData.quantity.toLocaleString()} pcs</b></div>
                        <div><span className="text-[var(--mcs-text-muted)]">生産機 (Máy):</span> <b>{logData.machines?.machine_code}</b></div>
                        <div><span className="text-[var(--mcs-text-muted)]">作業者 (Thợ máy):</span> <b>{logData.employees?.employee_name_short || logData.employees?.employee_name || 'N/A'}</b></div>
                        <div className="col-span-2"><span className="text-[var(--mcs-text-muted)]">開始時間 (Bắt đầu lúc):</span> <b>{new Date(logData.start_time || '').toLocaleString('vi-VN')}</b></div>
                    </div>
                </div>

                <form action={handleComplete} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-[var(--mcs-text)] mb-2">良品数 / Số lượng THÀNH PHẨM (Good Qty)</label>
                        <input
                            type="number"
                            name="produced_qty"
                            required
                            min="0"
                            className="w-full p-4 text-2xl font-bold bg-[var(--mcs-surface)] border-2 border-[var(--mcs-border)] focus:border-emerald-500 rounded-md text-[var(--mcs-text)]"
                            placeholder="良品数を入力... (Nhập số lượng OK)"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[var(--mcs-text)] mb-2">不良数 / Số lượng PHẾ PHẨM (Scrap/NG)</label>
                        <input
                            type="number"
                            name="scrap_qty"
                            defaultValue="0"
                            min="0"
                            className="w-full p-4 text-xl font-bold bg-[var(--mcs-surface)] border-2 border-[var(--mcs-border)] focus:border-red-500 rounded-md text-[var(--mcs-text)]"
                        />
                    </div>
                    
                    <div className="bg-[var(--mcs-surface-2)] p-4 rounded-md border border-[var(--mcs-border)] space-y-4">
                        <h3 className="font-bold text-sm text-[var(--mcs-text)] border-b border-[var(--mcs-border)] pb-2 mb-2">Quản lý Nhựa (Plastic Roll Management)</h3>
                        <div>
                            <label className="block text-xs font-bold text-[var(--mcs-text)] mb-1">Mã vạch Cuộn nhựa (Roll Barcode)</label>
                            <input type="text" name="roll_barcode" placeholder="VD: RLL-2026-..." className="w-full p-2 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded text-sm text-[var(--mcs-text)] focus:border-[var(--mcs-primary)]" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-[var(--mcs-text)] mb-1">Đã dùng (m)</label>
                                <input type="number" step="0.1" name="meters_consumed" defaultValue="0" className="w-full p-2 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded text-sm text-[var(--mcs-text)] focus:border-[var(--mcs-primary)]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--mcs-text)] mb-1">Phế/Hao hụt (m)</label>
                                <input type="number" step="0.1" name="meters_wasted" defaultValue="0" className="w-full p-2 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded text-sm text-[var(--mcs-text)] focus:border-[var(--mcs-primary)]" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--mcs-text)] mb-1">Còn lại (m)</label>
                                <input type="number" step="0.1" name="meters_remaining" defaultValue="0" className="w-full p-2 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded text-sm text-[var(--mcs-text)] focus:border-[var(--mcs-primary)]" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-[var(--mcs-primary-light)] p-4 rounded-md border border-[var(--mcs-primary)] mt-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input 
                                type="checkbox" 
                                name="do_inventory_in" 
                                defaultChecked 
                                className="w-5 h-5 mt-0.5 rounded text-[var(--mcs-primary)] focus:ring-[var(--mcs-primary)]"
                            />
                            <div>
                                <span className="block text-sm font-bold text-[var(--mcs-primary-hover)]">在庫に入庫する / Nhập thẳng vào Kho (IN)</span>
                                <span className="block text-xs text-gray-600 mt-1">Bỏ tick nếu hàng bị giữ lại QC (QC Hold) chưa được nhập kho. Số lượng nhập = Thành phẩm - Phế phẩm.</span>
                            </div>
                        </label>
                        
                        <div className="mt-3 pl-8">
                            <label className="block text-xs font-bold text-gray-600 mb-1">ロット番号 / Số Lô (Lot No.)</label>
                            <input 
                                type="text" 
                                name="lot_no"
                                defaultValue={itemData.orders?.order_no || ''} 
                                placeholder="VD: 263090..."
                                className="w-full p-2 text-sm bg-white border border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)]"
                            />
                            <span className="text-[10px] text-gray-500 mt-1 block">Mặc định lấy theo Slip No. của Đơn hàng</span>
                        </div>
                    </div>
                    <button type="submit" className="w-full h-16 text-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-md flex items-center justify-center gap-2 transition-colors shadow-lg">
                        <CheckCircle size={24} /> 完了報告する (BÁO CÁO HOÀN THÀNH)
                    </button>
                    <p className="text-xs text-center text-[var(--mcs-text-muted)] mt-2">システムは必要に応じて物理金型の摩耗を自動的に認識します。<br />(Hệ thống sẽ tự nhận diện hao mòn khuôn vật lý nếu có)</p>
                </form>
            </div>
        )
    }

    // IF STARTING
    // Fetch generic dropdowns
    const { data: machines } = await supabase.from('machines').select('*').eq('is_active', true)
    const operators = await getOperators()

    // FETCH MOLDS MAPPED TO THIS PRODUCT ONLY (AUTO-RESOLVE)
    const { data: moldMappings } = await (supabase as any)
        .from('products')
        .select(`
            mold_revisions (
                revision_code,
                physical_molds (
                    mold_physical_id, system_code, current_rack_layer_id, device_status
                )
            )
        `)
        .eq('product_id', itemData.product_id)

    const availableMolds: any[] = []
    moldMappings?.forEach((mapping: any) => {
        mapping.mold_revisions?.forEach((rev: any) => {
            const physicals = rev.physical_molds || []
            const physArray = Array.isArray(physicals) ? physicals : [physicals]
            physArray.forEach((p: any) => {
                if (p) availableMolds.push({ ...p, revision_code: rev.revision_code })
            })
        })
    })

    const autoResolvedMold = availableMolds.length > 0 ? availableMolds[0] : null

    const handleStart = async (formData: FormData) => {
        'use server'
        const machineId = formData.get('machine_id') as string
        const operatorName = formData.get('operator_name') as string
        const moldId = formData.get('mold_physical_id') as string

        await startProductionLog({
            order_item_id: itemId,
            machine_id: machineId,
            operator_name: operatorName || null,
            mold_physical_id: moldId && moldId !== '' ? moldId : null
        })
        redirect('/production')
    }

    return (
        <div className="p-6 max-w-xl mx-auto bg-[var(--mcs-surface)] min-h-screen">
            <Link href="/production" className="flex items-center gap-2 text-[var(--mcs-primary)] mb-6 font-bold">
                <ChevronLeft /> Kanbanへ戻る (Quay lại Kanban)
            </Link>

            <div className="bg-[var(--mcs-surface-alert)] p-4 rounded-lg border border-[var(--mcs-border)] mb-6">
                <h1 className="text-xl font-bold text-[var(--mcs-text)] flex items-center gap-2 mb-2">
                    <Play className="text-amber-500" />
                    生産開始 (Khởi động Ca Máy)
                </h1>
                <div className="text-sm mt-2 text-[var(--mcs-text-muted)]">
                    次の品番の生産を開始しようとしています。 <b>{itemData.products?.product_code}</b> (予定数: {itemData.quantity.toLocaleString()} pcs)<br />
                    (Bạn đang chuẩn bị mở ca sản xuất cho mã hàng trên)
                </div>
            </div>

            <form action={handleStart} className="space-y-5">
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-[var(--mcs-text)] mb-2">
                        <Factory size={16} className="text-[var(--mcs-primary)]" />
                        機械の選択 / Chọn Máy (*)
                    </label>
                    <select name="machine_id" required className="w-full p-3 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-md text-[var(--mcs-text)] focus:border-[var(--mcs-primary)] font-bold">
                        <option value="">-- 機械を選択 / Bấm để chọn --</option>
                        {machines?.map(m => <option key={m.machine_id} value={m.machine_id}>{m.machine_code} - {m.machine_name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-[var(--mcs-text)] mb-2">
                        <User size={16} className="text-[var(--mcs-primary)]" />
                        作業者 / Tên Thợ (Người Vận Hành)
                    </label>
                    <select name="operator_name" required className="w-full p-3 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-md text-[var(--mcs-text)] focus:border-[var(--mcs-primary)]">
                        <option value="">-- 作業者を選択 / Chọn Thợ máy --</option>
                        {operators.map(op => (
                            <option key={op.code} value={op.code}>
                                {op.code} - {op.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-[var(--mcs-text)] mb-2">
                        <Wrench size={16} className="text-[var(--mcs-primary)]" />
                        金型の紐付け / Gắn Mã Khuôn (Auto-resolve)
                    </label>

                    {autoResolvedMold ? (
                        <div className="bg-emerald-500/10 border border-emerald-500 rounded-md p-4 mb-3">
                            <h3 className="font-bold text-emerald-600 flex items-center gap-2 mb-2">
                                <CheckCircle size={16} /> システム自動割り当て金型 (Khuôn Auto-resolve)
                            </h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div><span className="text-[var(--mcs-text-muted)]">金型コード (Mã khuôn):</span> <b className="text-[var(--mcs-text)]">{autoResolvedMold.system_code} (Rev: {autoResolvedMold.revision_code})</b></div>
                                <div><span className="text-[var(--mcs-text-muted)]">ステータス (Trạng thái):</span> <b className={autoResolvedMold.device_status === 'ACTIVE' ? "text-emerald-500" : "text-amber-500"}>{autoResolvedMold.device_status}</b></div>
                                <div className="col-span-2"><span className="text-[var(--mcs-text-muted)]">保管場所 (Vị trí kệ):</span> <b className="text-[var(--mcs-text)] font-mono text-lg px-2 py-0.5 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded shadow inline-block mt-1">{autoResolvedMold.current_rack_layer_id || '未設定 (Chưa cấu hình)'}</b></div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-amber-500/10 border border-amber-500 rounded-md p-3 mb-3 text-sm text-amber-600 font-bold">
                            ⚠️ この製品は金型にマッピングされていません！ (Khay này chưa được mapping với Khuôn nào trong hệ thống! Hoặc Khuôn chưa tạo thực thể vật lý.)
                        </div>
                    )}

                    <select name="mold_physical_id" defaultValue={autoResolvedMold?.mold_physical_id || ""} className="w-full p-3 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-md text-[var(--mcs-text)] focus:border-[var(--mcs-primary)] font-bold">
                        <option value="">-- この品番の金型を追跡しない / Không theo dõi Khuôn cho mã này --</option>
                        {availableMolds.map(m => <option key={m.mold_physical_id} value={m.mold_physical_id}>{m.system_code} (Rev: {m.revision_code})</option>)}
                    </select>
                    <p className="text-[10px] text-[var(--mcs-text-muted)] mt-1">保全部の指示で金型を変更する場合は、上書き操作が可能です。(Cho phép override khi bảo trì yêu cầu đổi khuôn)</p>
                </div>

                <div className="pt-4 border-t border-[var(--mcs-border)]">
                    <button type="submit" className="w-full h-14 text-lg font-bold bg-[var(--mcs-primary)] hover:bg-[var(--mcs-primary-dark)] text-white rounded-md flex items-center justify-center gap-2 transition-colors shadow">
                        <Play size={20} /> 生産を開始する (LÊN MÁY & BẮT ĐẦU)
                    </button>
                </div>
            </form>
        </div>
    )
}
