import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
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
  const t = await getTranslations('Production')
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
        <h2>{t('notFound')}</h2>
        <Link href="/production" className="text-[var(--mcs-primary)] underline">{t('back')}</Link>
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

    if (!logData) return <div className="p-10">{t('logNotExists')}</div>
    if (logData.end_time) return <div className="p-10 text-emerald-500 font-bold">{t('shiftCompleted')} <Link href="/production" className="underline">{t('back')}</Link></div>

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
          <ChevronLeft /> {t('backToKanban')}
        </Link>

        <div className="bg-[var(--mcs-surface-2)] p-4 rounded-lg border border-[var(--mcs-border)] mb-6">
          <h1 className="text-xl font-bold text-[var(--mcs-text)] flex items-center gap-2 mb-2">
            <CheckCircle className="text-emerald-500" />
            {t('closeShiftTitle')}
          </h1>
          <div className="grid grid-cols-2 gap-4 text-sm mt-4">
            <div><span className="text-[var(--mcs-text-muted)]">{t('productCode')}:</span> <b>{itemData.products?.product_code}</b></div>
            <div><span className="text-[var(--mcs-text-muted)]">{t('plannedQty')}:</span> <b>{itemData.quantity.toLocaleString()} pcs</b></div>
            <div><span className="text-[var(--mcs-text-muted)]">{t('machine')}:</span> <b>{logData.machines?.machine_code}</b></div>
            <div><span className="text-[var(--mcs-text-muted)]">{t('operator')}:</span> <b>{logData.employees?.employee_name_short || logData.employees?.employee_name || 'N/A'}</b></div>
            <div className="col-span-2"><span className="text-[var(--mcs-text-muted)]">{t('startTime')}:</span> <b>{new Date(logData.start_time || '').toLocaleString('vi-VN')}</b></div>
          </div>
        </div>

        <form action={handleComplete} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[var(--mcs-text)] mb-2">{t('goodQtyLabel')}</label>
            <input
              type="number"
              name="produced_qty"
              required
              min="0"
              className="w-full p-4 text-2xl font-bold bg-[var(--mcs-surface)] border-2 border-[var(--mcs-border)] focus:border-emerald-500 rounded-md text-[var(--mcs-text)]"
              placeholder={t('goodQtyPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--mcs-text)] mb-2">{t('scrapQtyLabel')}</label>
            <input
              type="number"
              name="scrap_qty"
              defaultValue="0"
              min="0"
              className="w-full p-4 text-xl font-bold bg-[var(--mcs-surface)] border-2 border-[var(--mcs-border)] focus:border-red-500 rounded-md text-[var(--mcs-text)]"
            />
          </div>

          <div className="bg-[var(--mcs-surface-2)] p-4 rounded-md border border-[var(--mcs-border)] space-y-4">
            <h3 className="font-bold text-sm text-[var(--mcs-text)] border-b border-[var(--mcs-border)] pb-2 mb-2">{t('plasticRollManagement')}</h3>
            <div>
              <label className="block text-xs font-bold text-[var(--mcs-text)] mb-1">{t('rollBarcode')}</label>
              <input type="text" name="roll_barcode" placeholder="VD: RLL-2026-..." className="w-full p-2 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded text-sm text-[var(--mcs-text)] focus:border-[var(--mcs-primary)]" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[var(--mcs-text)] mb-1">{t('metersConsumed')}</label>
                <input type="number" step="0.1" name="meters_consumed" defaultValue="0" className="w-full p-2 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded text-sm text-[var(--mcs-text)] focus:border-[var(--mcs-primary)]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--mcs-text)] mb-1">{t('metersWasted')}</label>
                <input type="number" step="0.1" name="meters_wasted" defaultValue="0" className="w-full p-2 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded text-sm text-[var(--mcs-text)] focus:border-[var(--mcs-primary)]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--mcs-text)] mb-1">{t('metersRemaining')}</label>
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
                <span className="block text-sm font-bold text-[var(--mcs-primary-hover)]">{t('directInventoryIn')}</span>
                <span className="block text-xs text-gray-600 mt-1">{t('qcHoldExplanation')}</span>
              </div>
            </label>

            <div className="mt-3 pl-8">
              <label className="block text-xs font-bold text-gray-600 mb-1">{t('lotNo')}</label>
              <input
                type="text"
                name="lot_no"
                defaultValue={itemData.orders?.order_no || ''}
                placeholder="VD: 263090..."
                className="w-full p-2 text-sm bg-white border border-[var(--mcs-border)] rounded focus:border-[var(--mcs-primary)]"
              />
              <span className="text-[10px] text-gray-500 mt-1 block">{t('lotNoExplanation')}</span>
            </div>
          </div>
          <button type="submit" className="w-full h-16 text-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-md flex items-center justify-center gap-2 transition-colors shadow-lg">
            <CheckCircle size={24} /> {t('completeBtn')}
          </button>
          <p className="text-xs text-center text-[var(--mcs-text-muted)] mt-2">{t('lifecycleWearAuto')}</p>
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
        <ChevronLeft /> {t('backToKanban')}
      </Link>

      <div className="bg-[var(--mcs-surface-alert)] p-4 rounded-lg border border-[var(--mcs-border)] mb-6">
        <h1 className="text-xl font-bold text-[var(--mcs-text)] flex items-center gap-2 mb-2">
          <Play className="text-amber-500" />
          {t('startShiftTitle')}
        </h1>
        <div className="text-sm mt-2 text-[var(--mcs-text-muted)]">
          {t('startShiftExplanation', { code: itemData.products?.product_code, qty: itemData.quantity.toLocaleString() })}
        </div>
      </div>

      <form action={handleStart} className="space-y-5">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-[var(--mcs-text)] mb-2">
            <Factory size={16} className="text-[var(--mcs-primary)]" />
            {t('selectMachine')}
          </label>
          <select name="machine_id" required className="w-full p-3 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-md text-[var(--mcs-text)] focus:border-[var(--mcs-primary)] font-bold">
            <option value="">{t('selectMachinePlaceholder')}</option>
            {machines?.map(m => <option key={m.machine_id} value={m.machine_id}>{m.machine_code} - {m.machine_name}</option>)}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-[var(--mcs-text)] mb-2">
            <User size={16} className="text-[var(--mcs-primary)]" />
            {t('selectOperator')}
          </label>
          <select name="operator_name" required className="w-full p-3 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-md text-[var(--mcs-text)] focus:border-[var(--mcs-primary)]">
            <option value="">{t('selectOperatorPlaceholder')}</option>
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
            {t('moldMapping')}
          </label>

          {autoResolvedMold ? (
            <div className="bg-emerald-500/10 border border-emerald-500 rounded-md p-4 mb-3">
              <h3 className="font-bold text-emerald-600 flex items-center gap-2 mb-2">
                <CheckCircle size={16} /> {t('autoResolvedMoldTitle')}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-[var(--mcs-text-muted)]">{t('moldCode')}:</span> <b className="text-[var(--mcs-text)]">{autoResolvedMold.system_code} (Rev: {autoResolvedMold.revision_code})</b></div>
                <div><span className="text-[var(--mcs-text-muted)]">{t('status')}:</span> <b className={autoResolvedMold.device_status === 'ACTIVE' ? "text-emerald-500" : "text-amber-500"}>{autoResolvedMold.device_status}</b></div>
                <div className="col-span-2"><span className="text-[var(--mcs-text-muted)]">{t('storageLocation')}:</span> <b className="text-[var(--mcs-text)] font-mono text-lg px-2 py-0.5 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded shadow inline-block mt-1">{autoResolvedMold.current_rack_layer_id || t('notConfigured')}</b></div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-500/10 border border-amber-500 rounded-md p-3 mb-3 text-sm text-amber-600 font-bold">
              {t('notMappedAlert')}
            </div>
          )}

          <select name="mold_physical_id" defaultValue={autoResolvedMold?.mold_physical_id || ""} className="w-full p-3 bg-[var(--mcs-surface)] border border-[var(--mcs-border)] rounded-md text-[var(--mcs-text)] focus:border-[var(--mcs-primary)] font-bold">
            <option value="">{t('dontTrackMold')}</option>
            {availableMolds.map(m => <option key={m.mold_physical_id} value={m.mold_physical_id}>{m.system_code} (Rev: {m.revision_code})</option>)}
          </select>
          <p className="text-[10px] text-[var(--mcs-text-muted)] mt-1">{t('overrideHint')}</p>
        </div>

        <div className="pt-4 border-t border-[var(--mcs-border)]">
          <button type="submit" className="w-full h-14 text-lg font-bold bg-[var(--mcs-primary)] hover:bg-[var(--mcs-primary-dark)] text-white rounded-md flex items-center justify-center gap-2 transition-colors shadow">
            <Play size={20} /> {t('startBtn')}
          </button>
        </div>
      </form>
    </div>
  )
}
