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
                onClose()
            } catch (err: any) {
                alert(t('errorShipping') + err.message)
            }
        })
    }

    const isAnyEmpty = orderItems.some(i => !inputs[i.id]?.qty || parseInt(inputs[i.id].qty, 10) <= 0)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(4px)' }}>
            <div className="card-flat w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                <div className="p-4 flex justify-between items-center shrink-0" style={{ background: 'var(--accent)', color: '#ffffff' }}>
                    <div className="flex items-center gap-2">
                        <Truck size={20} />
                        <div>
                            <h2 className="text-[16px] font-bold text-white">{t('shipmentTitle')}</h2>
                            <p className="text-xs text-white/80 mt-0.5" style={{ fontFamily: 'monospace' }}>{t('orderCode')}: #{slipNo || orderId.substring(0, 8)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} disabled={isPending} className="p-1 hover:bg-white/20 rounded transition-colors disabled:opacity-50 text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar" style={{ background: 'var(--bg-surface-2)' }}>
                    {isLoadingStocks ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="animate-spin text-[var(--accent)]" size={24} />
                            <span className="ml-2 text-sm text-[var(--text-muted)]">{t('loadingStock')}</span>
                        </div>
                    ) : (
                        <div className="border border-[var(--border-default)] rounded-md shadow-sm overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                            <table className="data-table w-full text-sm text-left">
                                <thead>
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
                                            <tr key={item.id}>
                                                <td className="p-3 font-bold" style={{ color: 'var(--text-primary)', fontSize: 13, fontFamily: 'monospace' }}>{code}</td>
                                                <td className="p-3 text-right font-mono" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{orderQty.toLocaleString()}</td>
                                                <td className="p-3 text-right font-mono font-bold" style={{ fontSize: 13 }}>
                                                    <span className={isLowStock ? "flex items-center justify-end gap-1" : ""} style={{ color: isLowStock ? 'var(--status-error)' : 'var(--status-success)' }}>
                                                        {isLowStock && <AlertTriangle size={12} />}
                                                        {stock.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <input
                                                        type="number"
                                                        value={inputs[item.id]?.qty}
                                                        onChange={e => handleInputChange(item.id, 'qty', e.target.value)}
                                                        className="form-input w-20 text-right font-mono font-bold"
                                                        style={{
                                                            fontSize: 13,
                                                            borderColor: isLowStock ? 'var(--status-error)' : 'var(--border-default)',
                                                            backgroundColor: isLowStock ? 'color-mix(in srgb, var(--status-error) 10%, var(--bg-surface))' : 'var(--bg-surface)'
                                                        }}
                                                    />
                                                </td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        value={inputs[item.id]?.lot}
                                                        onChange={e => handleInputChange(item.id, 'lot', e.target.value)}
                                                        className="form-input w-full text-sm font-mono"
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
                        <label className="form-label block text-xs font-bold mb-1">{t('notesLabel')}</label>
                        <input
                            type="text"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="..."
                            className="form-input w-full text-sm"
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-[var(--border-default)] flex justify-end gap-2 shrink-0" style={{ background: 'var(--bg-surface-2)' }}>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="btn btn-secondary"
                        style={{ height: 34, padding: '0 16px', fontSize: 12 }}
                    >
                        {t('cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isPending || isAnyEmpty}
                        className="btn btn-primary"
                        style={{ height: 34, padding: '0 18px', fontSize: 12, gap: 6, background: 'var(--accent)', color: '#fff', fontWeight: 700 }}
                    >
                        {isPending && <Loader2 size={16} className="animate-spin" />}
                        <span>✈ {t('confirmShipment')}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
