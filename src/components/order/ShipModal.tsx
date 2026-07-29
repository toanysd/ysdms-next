'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { X, Truck, Loader2, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getStockForProducts } from '@/app/actions/inventory'
import { shipOrderItemsAction } from '@/app/actions/order'

interface OrderItem {
    id: string
    product_id: string
    product_pn_raw: string
    quantity: number
    product_master?: {
        code: string
        name: string
        customer_part_number: string
    }
}

interface ShipModalProps {
    orderId: string
    slipNo: string
    orderItems: OrderItem[]
    onClose: () => void
}

export function ShipModal({ orderId, slipNo, orderItems, onClose }: ShipModalProps) {
    const [isPending, startTransition] = useTransition()
    const [stocks, setStocks] = useState<Record<string, number>>({})
    const [isLoadingStocks, setIsLoadingStocks] = useState(true)
    const [notes, setNotes] = useState('')
    const t = useTranslations('Orders')

    // State for inputs
    const [inputs, setInputs] = useState<Record<string, { qty: string, lot: string }>>(() => {
        const init: Record<string, { qty: string, lot: string }> = {}
        orderItems?.forEach(item => {
            init[item.id] = {
                qty: (item.quantity || 0).toString(),
                lot: slipNo || ''
            }
        })
        return init
    })

    useEffect(() => {
        async function fetchStocks() {
            try {
                const productIds = orderItems.map(i => i.product_id)
                const res = await getStockForProducts(productIds)
                if (res.success && res.data) {
                    const map: Record<string, number> = {}
                    res.data.forEach((item: any) => {
                        map[item.product_id] = item.current_stock || 0
                    })
                    setStocks(map)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoadingStocks(false)
            }
        }
        fetchStocks()
    }, [orderItems])

    const handleInputChange = (itemId: string, field: 'qty' | 'lot', val: string) => {
        setInputs(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: val
            }
        }))
    }

    const handleSubmit = () => {
        const itemsToShip = orderItems.map(item => {
            const input = inputs[item.id]
            return {
                order_item_id: item.id,
                product_id: item.product_id,
                quantity: parseInt(input?.qty || '0', 10) || 0,
                lot_no: input?.lot || '',
                operator_name: ''
            }
        })

        startTransition(async () => {
            try {
                await shipOrderItemsAction(orderId, itemsToShip, notes || t('shippingDefaultNotes'))
                onClose() // Tắt modal sau khi xong
            } catch (err: any) {
                alert(t('errorShipping') + err.message)
            }
        })
    }

    const isAnyEmpty = orderItems.some(i => !inputs[i.id]?.qty || parseInt(inputs[i.id].qty, 10) <= 0)

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="bg-teal-700 text-white p-4 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <Truck size={20} />
                        <div>
                            <h2 className="text-[16px] font-bold">{t('shipmentTitle')}</h2>
                            <p className="text-xs text-teal-100 mt-0.5">{t('orderCode')}: #{slipNo || orderId.substring(0, 8)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} disabled={isPending} className="p-1 hover:bg-black/20 rounded transition-colors disabled:opacity-50">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto bg-slate-50 flex-1">
                    {isLoadingStocks ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="animate-spin text-teal-600" size={24} />
                            <span className="ml-2 text-sm text-gray-500">{t('loadingStock')}</span>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 border-b border-gray-200 text-xs text-gray-600">
                                    <tr>
                                        <th className="p-3">{t('colProductCode')}</th>
                                        <th className="p-3 text-right">{t('colOrdered')}</th>
                                        <th className="p-3 text-right">{t('colStock')}</th>
                                        <th className="p-3 text-center">{t('colShipQty')}</th>
                                        <th className="p-3">{t('colLot')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems?.map(item => {
                                        const pm = item.product_master
                                        const code = pm?.customer_part_number || pm?.code || item.product_pn_raw
                                        const orderQty = item.quantity || 0
                                        const stock = stocks[item.product_id] || 0
                                        const inputQty = parseInt(inputs[item.id]?.qty || '0', 10) || 0
                                        const isLowStock = stock < inputQty

                                        return (
                                            <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                <td className="p-3 font-bold text-gray-800">{code}</td>
                                                <td className="p-3 text-right font-mono text-gray-500">{orderQty.toLocaleString()}</td>
                                                <td className="p-3 text-right font-mono font-bold">
                                                    <span className={isLowStock ? "text-red-600 flex items-center justify-end gap-1" : "text-emerald-600"}>
                                                        {isLowStock && <AlertTriangle size={12} />}
                                                        {stock.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="number"
                                                        value={inputs[item.id]?.qty}
                                                        onChange={e => handleInputChange(item.id, 'qty', e.target.value)}
                                                        className={`w-20 px-2 py-1 text-right border rounded font-mono ${isLowStock ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'}`}
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        value={inputs[item.id]?.lot}
                                                        onChange={e => handleInputChange(item.id, 'lot', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded focus:border-teal-500 focus:ring-teal-500 text-sm"
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="mt-4">
                        <label className="block text-xs font-bold text-gray-700 mb-1">{t('notesLabel')}</label>
                        <input
                            type="text"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-teal-500 focus:ring-teal-500 text-sm"
                        />
                    </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-200 flex justify-end gap-2 shrink-0">
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || isAnyEmpty}
                        className="px-4 py-2 text-sm font-bold text-white bg-teal-600 rounded hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isPending && <Loader2 size={16} className="animate-spin" />}
                        ✈ {t('confirmShipment')}
                    </button>
                </div>
            </div>
        </div>
    )
}
