'use client'

import { useEffect, useState } from 'react'
import { checkMaterialStock } from '@/app/actions/production-instructions'
import type { PIFormData } from '../new/page'

interface Props {
  form: PIFormData
  update: (p: Partial<PIFormData>) => void
  onBack: () => void
  onSubmit: (status: 'DRAFT' | 'ISSUED') => void
  submitting: boolean
}

export default function Step3MaterialConfirm({ form, update, onBack, onSubmit, submitting }: Props) {
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const check = async () => {
      if (!form.material_spec || !form.production_site || !form.quantity_ordered) return
      setChecking(true)
      const result = await checkMaterialStock(form.material_spec, form.production_site, form.quantity_ordered)
      update({ material_stock_warning: !result.sufficient, material_stock_qty: result.currentStock })
      setChecking(false)
    }
    check()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const features = [
    form.antistatic && '帯電防止',
    form.silicon && 'シリコン',
    form.surface_coating && '塗布',
  ].filter(Boolean)

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">確認 — 材料・発行</h2>

      {/* Material info */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">材料情報</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">材料:</span> <span className="font-medium">{form.material_spec || '—'}</span></div>
          <div><span className="text-gray-500">厚み:</span> <span>{form.material_thickness ? `${form.material_thickness}t` : '—'}</span></div>
          <div><span className="text-gray-500">シート巾:</span> <span>{form.material_width ? `${form.material_width}mm` : '—'}</span></div>
          <div><span className="text-gray-500">粉砕材:</span> <span>{form.recycled_pct > 0 ? `${form.recycled_pct}%` : 'なし'}</span></div>
          {features.length > 0 && (
            <div className="col-span-2"><span className="text-gray-500">特殊:</span> <span>{features.join(', ')}</span></div>
          )}
        </div>
      </div>

      {/* Stock check */}
      <div className={`rounded-lg border p-4 ${
        checking ? 'bg-gray-50 border-gray-200' :
        form.material_stock_warning ? 'bg-orange-50 border-orange-200' : 'bg-green-50 border-green-200'
      }`}>
        {checking ? (
          <p className="text-sm text-gray-500">在庫確認中...</p>
        ) : form.material_stock_qty === null ? (
          <p className="text-sm text-gray-500">在庫データなし</p>
        ) : form.material_stock_warning ? (
          <div>
            <p className="text-sm font-semibold text-orange-800">⚠️ 材料在庫不足</p>
            <p className="text-sm text-orange-700 mt-1">
              現在庫: <span className="font-mono font-bold">{form.material_stock_qty.toLocaleString()}</span> 枚 /
              必要: <span className="font-mono font-bold">{form.quantity_ordered.toLocaleString()}</span> 枚
            </p>
            <p className="text-xs text-orange-600 mt-1">※ 在庫不足でも指示書の作成は可能です</p>
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold text-green-800">✅ 材料在庫あり</p>
            <p className="text-sm text-green-700 mt-1">
              現在庫: <span className="font-mono font-bold">{form.material_stock_qty.toLocaleString()}</span> 枚
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm space-y-1">
        <p className="font-semibold text-blue-800 mb-2">発行内容確認</p>
        <p>受注: <span className="font-mono">{form.order_no}</span> / {form.product_code}</p>
        <p>生産拠点: {form.production_site} / 数量: {form.quantity_ordered.toLocaleString()} 枚</p>
        <p>納入先: {form.delivery_site_name}</p>
        <p>納期: <span className="font-mono">{form.requested_date}</span></p>
        <p>テンプレート: {form.template_type}</p>
        {form.is_first_time && <p>✅ 初回</p>}
        {form.has_label && <p>✅ ラベル要</p>}
      </div>

      <div className="flex justify-between pt-2">
        <button onClick={onBack} className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50" disabled={submitting}>← 戻る</button>
        <div className="flex gap-2">
          <button
            onClick={() => onSubmit('DRAFT')}
            disabled={submitting}
            className="px-4 py-2 border border-gray-300 bg-white text-sm rounded-lg hover:bg-gray-50 disabled:opacity-40"
          >
            下書き保存
          </button>
          <button
            onClick={() => onSubmit('ISSUED')}
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40"
          >
            {submitting ? '処理中...' : '発行する'}
          </button>
        </div>
      </div>
    </div>
  )
}
