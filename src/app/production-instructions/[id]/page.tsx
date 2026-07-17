import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductionInstructionById, issueProductionInstruction } from '@/app/actions/production-instructions'

const STATUS_STEPS = ['DRAFT', 'ISSUED', 'IN_PRODUCTION', 'COMPLETED']
const STATUS_LABELS: Record<string, string> = {
  DRAFT: '下書き', ISSUED: '発行済み', IN_PRODUCTION: '生産中', COMPLETED: '完了', CANCELLED: 'キャンセル'
}

export default async function ProductionInstructionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pi = await getProductionInstructionById(id)
  if (!pi) notFound()

  const currentStepIdx = STATUS_STEPS.indexOf(pi.status)

  // Process tags for display
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags = (pi as any).production_instruction_tags || []

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/production-instructions" className="text-sm text-gray-500 hover:text-gray-700" title="一覧へ">↑ 一覧</Link>
            <h1 className="text-2xl font-bold text-gray-900 font-mono">{pi.instruction_no}</h1>
            {pi.material_stock_warning && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                ⚠️ 発行時に材料不足
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            作成: {pi.created_at ? new Date(pi.created_at).toLocaleDateString('ja-JP') : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/api/production-instructions/${pi.id}/pdf`}
            target="_blank"
            className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
          >
            🖨️ PDF印刷
          </Link>
          {pi.status === 'DRAFT' && (
            <form action={issueProductionInstruction.bind(null, pi.id)}>
              <button type="submit" className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                発行する
              </button>
            </form>
          )}
          <Link href="/production-instructions" className="px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50">
            一覧へ
          </Link>
        </div>
      </div>

      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-gray-500 font-medium mr-1">タグ:</span>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {tags.map((tag: any, idx: number) => {
            const label = tag.tag_code
              ? (tag.production_tag_master?.label_ja || tag.tag_code)
              : tag.custom_label
            const printStyle = tag.production_tag_master?.print_style || 'default'
            const isRed = printStyle === 'red' || printStyle === 'red_bold'
            return (
              <span
                key={idx}
                className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border ${
                  isRed
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {label}
              </span>
            )
          })}
        </div>
      )}

      {/* Status Stepper */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {STATUS_STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${i < currentStepIdx ? 'bg-green-500 text-white' :
                    i === currentStepIdx ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {i < currentStepIdx ? '✓' : i + 1}
                </div>
                <span className={`text-xs ${i === currentStepIdx ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>
                  {STATUS_LABELS[s]}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${i < currentStepIdx ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="受注・製品">
          <Row label="受注No." value={pi.orders?.order_no ?? '—'} />
          <Row label="品番" value={pi.products?.product_code ?? '—'} />
          <Row label="品名" value={pi.products?.product_name ?? '—'} />
          <Row label="客先" value={pi.orders?.companies?.company_name ?? '—'} />
          <Row label="テンプレート" value={pi.template_type} />
        </InfoCard>
        <InfoCard title="生産情報">
          <Row label="生産拠点" value={pi.production_site ?? '—'} />
          <Row label="計画数量" value={`${pi.quantity_ordered.toLocaleString()} 枚`} />
          {pi.daily_quantity && <Row label="日次目標" value={`${pi.daily_quantity.toLocaleString()} 枚/日`} />}
          <Row label="入数" value={pi.quantity_per_stack ? `${pi.quantity_per_stack}枚/段` : '—'} />
          <Row label="納期" value={pi.requested_date} mono />
          {pi.is_first_time && <Row label="初回" value="✅ 初回" />}
          {pi.has_label && <Row label="ラベル" value="✅ 要ラベル" />}
          {pi.plain_case && <Row label="無地箱" value="✅" />}
          {pi.plain_label && <Row label="無地ラベル" value="✅" />}
          {pi.adhesive_sheet && <Row label="粘着シート" value="✅" />}
        </InfoCard>
        <InfoCard title="材料">
          <Row label="材料" value={pi.material_spec ?? '—'} />
          <Row label="厚み" value={pi.material_thickness ? `${pi.material_thickness}t` : '—'} />
          <Row label="シート巾" value={pi.material_width ? `${pi.material_width}mm` : '—'} />
          {pi.antistatic && <Row label="帯電防止" value="✅" />}
          {pi.silicon && <Row label="シリコン" value="✅" />}
          {pi.recycled_pct && pi.recycled_pct > 0 && <Row label="粉砕材" value={`${pi.recycled_pct}%`} />}
          {pi.material_stock_qty !== null && (
            <Row
              label="在庫 (作成時)"
              value={`${pi.material_stock_qty.toLocaleString()}${pi.material_stock_warning ? ' ⚠️' : ''}`}
            />
          )}
        </InfoCard>
        <InfoCard title="納入先">
          <Row label="納入先" value={pi.delivery_sites?.site_name ?? '—'} />
          <Row label="住所" value={pi.delivery_sites?.site_address ?? '—'} />
          <Row label="LOT No." value={pi.lot_no ?? '—'} />
        </InfoCard>
      </div>

      {pi.notes && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-yellow-800 mb-1">備考</p>
          <p className="text-sm text-yellow-900 whitespace-pre-wrap">{pi.notes}</p>
        </div>
      )}
    </div>
  )
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{title}</h3>
      <dl className="space-y-2">{children}</dl>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-2 text-sm">
      <dt className="text-gray-500 flex-shrink-0">{label}</dt>
      <dd className={`text-gray-900 text-right ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  )
}
