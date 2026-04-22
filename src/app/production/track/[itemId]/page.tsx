import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { startProductionLog, completeProductionLog } from '@/app/actions/production'
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
        .from('order_items')
        .select(`
            id, quantity, product_pn_raw, product_id,
            product_master(name, remarks),
            orders(slip_no, customer_id)
        `)
        .eq('id', itemId)
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
            .from('production_log')
            .select(`*, machine_master(code, name)`)
            .eq('id', logId)
            .single()

        if (!logData) return <div className="p-10">Log không tồn tại</div>
        if (logData.status === 'COMPLETED') return <div className="p-10 text-emerald-500 font-bold">Ca này đã được chốt xong! <Link href="/production" className="underline">Quay lại</Link></div>

        const handleComplete = async (formData: FormData) => {
            'use server'
            const producedQty = Number(formData.get('produced_qty')) || 0
            const scrapQty = Number(formData.get('scrap_qty')) || 0
            await completeProductionLog({
                log_id: logId,
                produced_qty: producedQty,
                scrap_qty: scrapQty
            })
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
                        <div><span className="text-[var(--mcs-text-muted)]">品番 (Mã hàng):</span> <b>{itemData.product_pn_raw}</b></div>
                        <div><span className="text-[var(--mcs-text-muted)]">予定数 (Yêu cầu gốc):</span> <b>{itemData.quantity.toLocaleString()} pcs</b></div>
                        <div><span className="text-[var(--mcs-text-muted)]">生産機 (Máy):</span> <b>{logData.machine_master?.code}</b></div>
                        <div><span className="text-[var(--mcs-text-muted)]">作業者 (Thợ máy):</span> <b>{logData.operator_name || 'N/A'}</b></div>
                        <div className="col-span-2"><span className="text-[var(--mcs-text-muted)]">開始時間 (Bắt đầu lúc):</span> <b>{new Date(logData.start_time).toLocaleString('vi-VN')}</b></div>
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
    const { data: machines } = await supabase.from('machine_master').select('*').eq('status', 'ACTIVE')

    // FETCH MOLDS MAPPED TO THIS PRODUCT ONLY (AUTO-RESOLVE)
    const { data: moldMappings } = await (supabase as any)
        .from('product_mold_map')
        .select(`
            mold_design_revision (
                id, revision_code,
                mold_physical (
                    id, physical_code, storage_location, status
                )
            )
        `)
        .eq('product_id', itemData.product_id)

    const availableMolds: any[] = []
    moldMappings?.forEach((mapping: any) => {
        const physicals = mapping.mold_design_revision?.mold_physical || []
        const physArray = Array.isArray(physicals) ? physicals : [physicals]
        physArray.forEach((p: any) => {
            if (p) availableMolds.push({ ...p, revision_code: mapping.mold_design_revision.revision_code })
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
                    次の品番の生産を開始しようとしています。 <b>{itemData.product_pn_raw}</b> (予定数: {itemData.quantity.toLocaleString()} pcs)<br />
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
                        {machines?.map(m => <option key={m.id} value={m.id}>{m.code} - {m.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-[var(--mcs-text)] mb-2">
                        <User size={16} className="text-[var(--mcs-primary)]" />
                        作業者 / Tên Thợ (Người Vận Hành)
                    </label>
                    <input type="text" name="operator_name" placeholder="例：Anh Tin, Chi Hoa..." className="w-full p-3 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-md text-[var(--mcs-text)] focus:border-[var(--mcs-primary)]" />
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
                                <div><span className="text-[var(--mcs-text-muted)]">金型コード (Mã khuôn):</span> <b className="text-[var(--mcs-text)]">{autoResolvedMold.physical_code} (Rev: {autoResolvedMold.revision_code})</b></div>
                                <div><span className="text-[var(--mcs-text-muted)]">ステータス (Trạng thái):</span> <b className={autoResolvedMold.status === 'ACTIVE' ? "text-emerald-500" : "text-amber-500"}>{autoResolvedMold.status}</b></div>
                                <div className="col-span-2"><span className="text-[var(--mcs-text-muted)]">保管場所 (Vị trí kệ):</span> <b className="text-[var(--mcs-text)] font-mono text-lg px-2 py-0.5 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded shadow inline-block mt-1">{autoResolvedMold.storage_location || '未設定 (Chưa cấu hình)'}</b></div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-amber-500/10 border border-amber-500 rounded-md p-3 mb-3 text-sm text-amber-600 font-bold">
                            ⚠️ この製品は金型にマッピングされていません！ (Khay này chưa được mapping với Khuôn nào trong hệ thống! Hoặc Khuôn chưa tạo thực thể vật lý.)
                        </div>
                    )}

                    <select name="mold_physical_id" defaultValue={autoResolvedMold?.id || ""} className="w-full p-3 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-md text-[var(--mcs-text)] focus:border-[var(--mcs-primary)] font-bold">
                        <option value="">-- この品番の金型を追跡しない / Không theo dõi Khuôn cho mã này --</option>
                        {availableMolds.map(m => <option key={m.id} value={m.id}>{m.physical_code} (Rev: {m.revision_code})</option>)}
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
