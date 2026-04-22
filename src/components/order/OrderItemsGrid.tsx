'use client'

import React from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { ProductSearchInput } from './ProductSearchInput'
import { ProcessTagsEditor } from './ProcessTagsEditor'

export interface GridRow {
    _key: string
    line_no: number
    product_pn_raw: string
    product_pn_internal?: string
    product_id: string | null
    product_details?: {
        material?: string
        thickness?: number
        length_val?: number
        width_val?: number
        mold_code?: string
    }
    request_no: string
    quantity: number
    packing_qty: number | null
    packing_boxes: number | null
    delivery_date: string | null
    delivery_date_end: string | null
    office_qty?: number | null
    process_notes: string
}

interface OrderItemsGridProps {
    items: GridRow[]
    onChange: (items: GridRow[]) => void
}

export function OrderItemsGrid({ items, onChange }: OrderItemsGridProps) {

    const generateKey = () => Math.random().toString(36).substring(2, 9)

    const handleAddRow = () => {
        const newRow: GridRow = {
            _key: generateKey(),
            line_no: items.length + 1,
            product_pn_raw: '',
            product_pn_internal: '',
            product_id: null,
            request_no: '',
            quantity: 0,
            packing_qty: null,
            packing_boxes: null,
            delivery_date: null,
            delivery_date_end: null,
            office_qty: null,
            process_notes: ''
        }
        onChange([...items, newRow])
    }

    const handleRemoveRow = (keyToRemove: string) => {
        const newItems = items
            .filter(i => i._key !== keyToRemove)
            .map((item, idx) => ({ ...item, line_no: idx + 1 }))
        onChange(newItems)
    }

    const updateRow = (key: string, field: keyof GridRow, value: any) => {
        const newItems = items.map(item => {
            if (item._key === key) {
                return { ...item, [field]: value }
            }
            return item
        })
        onChange(newItems)
    }

    const updateRowMultiple = (key: string, updates: Partial<GridRow>) => {
        const newItems = items.map(item => {
            if (item._key === key) {
                return { ...item, ...updates }
            }
            return item
        })
        onChange(newItems)
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--mcs-text)] flex items-center gap-2">
                    📦 明細リスト (Danh Sách Mặt Hàng)
                </h3>
                <button
                    type="button"
                    onClick={handleAddRow}
                    className="h-[28px] px-3 bg-teal-600 text-white text-[12px] font-bold rounded flex items-center gap-1 hover:bg-teal-700 transition-colors"
                >
                    <Plus size={14} /> Thêm Dòng
                </button>
            </div>

            <div className="border border-[var(--mcs-border)] rounded-lg overflow-x-auto shadow-sm pb-48 min-h-[350px]">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead className="bg-teal-50 border-b border-teal-200 text-[11px] text-teal-900 whitespace-nowrap">
                        <tr>
                            <th className="p-2 w-[40px] text-center border-r border-teal-100">No.</th>
                            <th className="p-2 w-[120px] border-r border-teal-100">要求No. (Mã Y/C)</th>
                            <th className="p-2 min-w-[240px] border-r border-teal-100">品番 (P/N) <span className="text-red-500">*</span></th>
                            <th className="p-2 w-[80px] text-right border-r border-teal-100">数量 (Số lượng) <span className="text-red-500">*</span></th>
                            <th className="p-2 w-[50px] text-right border-r border-teal-100" title="Văn phòng">事務所 (VP)</th>
                            <th className="p-2 w-[80px] text-right border-r border-teal-100">梱包入数 (Qty/Thùng)</th>
                            <th className="p-2 w-[80px] text-right border-r border-teal-100">箱数 (Số Thùng)</th>
                            <th className="p-2 w-[110px] border-r border-teal-100">出荷日 (Ngày xuất)</th>
                            <th className="p-2 w-[110px] border-r border-teal-100">着日 (Ngày nhận)</th>
                            <th className="p-2 min-w-[150px] border-r border-teal-100">事項 (Ghi chú)</th>
                            <th className="p-2 w-[40px] text-center">削除 (Xóa)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-[12px]">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="p-8 text-center text-[var(--mcs-text-muted)] italic bg-gray-50/50">
                                    Chưa có mặt hàng nào. Vui lòng nhấn "Thêm Dòng" để nhập mã liệu.
                                </td>
                            </tr>
                        ) : (
                            items.map((row) => (
                                <tr key={row._key} className="border-b border-[#e0e0e0] hover:bg-teal-50/30 focus-within:bg-teal-50/50 transition-colors">
                                    <td className="p-0 border-r border-[#e0e0e0] text-center text-[#7f8c8d] font-mono align-top pt-2.5">{row.line_no}</td>

                                    <td className="p-0 border-r border-[#e0e0e0]">
                                        <input
                                            type="text"
                                            value={row.request_no}
                                            onChange={e => updateRow(row._key, 'request_no', e.target.value)}
                                            className="w-full h-[34px] px-2 outline-none bg-transparent focus:bg-white focus:ring-1 ring-inset ring-teal-500"
                                            placeholder="1441923"
                                        />
                                    </td>

                                    <td className="p-0 border-r border-[#e0e0e0] align-top bg-white">
                                        <ProductSearchInput
                                            defaultValue={row.product_pn_raw}
                                            onChangeText={(val) => updateRow(row._key, 'product_pn_raw', val)}
                                            onSelect={(product) => {
                                                updateRowMultiple(row._key, {
                                                    product_pn_raw: product.customer_code || product.pn,
                                                    product_pn_internal: product.pn,
                                                    product_id: product.id,
                                                    product_details: {
                                                        material: product.material,
                                                        thickness: product.thickness,
                                                        length_val: product.length_val,
                                                        width_val: product.width_val,
                                                        mold_code: product.mold_code
                                                    }
                                                })
                                            }}
                                        />
                                        {row.product_details?.material && (
                                            <div className="px-2 pb-1.5 pt-0.5 flex items-center justify-start">
                                                <span className="inline-block bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded border border-emerald-200 font-bold whitespace-nowrap tracking-wide">
                                                    📦 {row.product_details.material}/{row.product_details.thickness}mm | {row.product_details.length_val}×{row.product_details.width_val}
                                                </span>
                                            </div>
                                        )}
                                    </td>

                                    <td className="p-0 border-r border-[#e0e0e0]">
                                        <input
                                            type="number"
                                            step="1"
                                            min="0"
                                            value={row.quantity || ''}
                                            onChange={e => updateRow(row._key, 'quantity', parseInt(e.target.value) || 0)}
                                            className="w-full h-[34px] px-2 outline-none bg-transparent focus:bg-white focus:ring-1 ring-inset ring-teal-500 text-right font-bold text-[var(--mcs-text)]"
                                            required
                                        />
                                    </td>

                                    <td className="p-0 border-r border-[#e0e0e0]">
                                        <input
                                            type="number"
                                            step="1"
                                            min="0"
                                            value={row.office_qty || ''}
                                            onChange={e => updateRow(row._key, 'office_qty', parseInt(e.target.value) || null)}
                                            className="w-full h-[34px] px-2 outline-none bg-transparent focus:bg-white focus:ring-1 ring-inset ring-teal-500 text-right text-emerald-700 font-bold bg-emerald-50/30"
                                            placeholder="VP"
                                        />
                                    </td>

                                    <td className="p-0 border-r border-[#e0e0e0]">
                                        <input
                                            type="number"
                                            step="1"
                                            value={row.packing_qty || ''}
                                            onChange={e => updateRow(row._key, 'packing_qty', parseInt(e.target.value) || null)}
                                            className="w-full h-[34px] px-2 outline-none bg-transparent focus:bg-white focus:ring-1 ring-inset ring-teal-500 text-right text-[var(--mcs-text-secondary)]"
                                        />
                                    </td>

                                    <td className="p-0 border-r border-[#e0e0e0]">
                                        <input
                                            type="number"
                                            step="1"
                                            value={row.packing_boxes || ''}
                                            onChange={e => updateRow(row._key, 'packing_boxes', parseInt(e.target.value) || null)}
                                            className="w-full h-[34px] px-2 outline-none bg-transparent focus:bg-white focus:ring-1 ring-inset ring-teal-500 text-right text-[var(--mcs-text-secondary)]"
                                        />
                                    </td>

                                    <td className="p-0 border-r border-[#e0e0e0]">
                                        <input
                                            type="date"
                                            value={row.delivery_date || ''}
                                            onChange={e => updateRow(row._key, 'delivery_date', e.target.value)}
                                            className="w-full h-[34px] px-1 outline-none bg-transparent focus:bg-white focus:ring-1 ring-inset ring-teal-500 text-[#7f8c8d] text-[11px]"
                                        />
                                    </td>

                                    <td className="p-0 border-r border-[#e0e0e0]">
                                        <input
                                            type="date"
                                            value={row.delivery_date_end || ''}
                                            onChange={e => updateRow(row._key, 'delivery_date_end', e.target.value)}
                                            className="w-full h-[34px] px-1 outline-none bg-transparent focus:bg-white focus:ring-1 ring-inset ring-teal-500 text-[#7f8c8d] text-[11px]"
                                        />
                                    </td>

                                    <td className="p-0 border-r border-[#e0e0e0] align-top bg-white">
                                        <ProcessTagsEditor
                                            value={row.process_notes}
                                            onChange={(val) => updateRow(row._key, 'process_notes', val)}
                                        />
                                    </td>

                                    <td className="p-0 text-center bg-white border-l-0">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRow(row._key)}
                                            className="h-[34px] w-full flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            title="Xóa dòng này"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
