'use client'

import { useTranslations } from 'next-intl'

import React, { useState, useEffect } from 'react'
import { getProductionPlansByOrderId } from '@/app/actions/production'
import { Loader2, Plus, CalendarDays } from 'lucide-react'
import CreatePlanForm from '@/app/production/planning/CreatePlanForm'

export function OrderProductionPanel({ orderId, items, slipNo }: { orderId?: string, items: any[], slipNo?: string }) {
  const t = useTranslations()

    const [plans, setPlans] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any | null>(null)

    const fetchPlans = async () => {
        if (!orderId) return;
        setIsLoading(true)
        try {
            const data = await getProductionPlansByOrderId(orderId)
            setPlans(data)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPlans()
    }, [orderId])

    // If no orderId, it means this is a new draft order that hasn't been saved to DB yet.
    if (!orderId) return null

    return (
        <div className="bg-white border border-blue-200 shadow-sm rounded-lg p-4 mt-4">
            <h3 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2 border-b border-blue-100 pb-2">
                <CalendarDays size={16} /> 
                {t('Common.chiThiSanXuat')}
            </h3>

            {isLoading ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : (
                <div className="space-y-4">
                    {items.map((item, index) => {
                        const itemPlans = plans.filter(p => p.order_item_id === item.id)
                        const totalPlanned = itemPlans.reduce((sum, p) => sum + (p.planned_quantity || 0), 0)
                        
                        return (
                            <div key={item.id || index} className="border border-gray-200 rounded p-3 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex-1 w-full">
                                    <div className="text-sm font-bold text-gray-800">{item.product_pn_raw || t('Orders.unknownProduct')}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {t('Orders.requested')} <span className="font-mono text-blue-600 font-bold">{item.quantity}</span> | 
                                        {t('Orders.scheduled')} <span className="font-mono text-green-600 font-bold">{totalPlanned}</span>
                                    </div>
                                    
                                    {itemPlans.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {itemPlans.map(p => (
                                                <div key={p.id} className="text-[11px] flex gap-2 items-center bg-white border border-gray-200 px-2 py-1.5 rounded shadow-sm flex-wrap">
                                                    <span className="text-gray-500 w-[70px] shrink-0 font-mono">{p.planned_date}</span>
                                                    <span className="font-bold text-gray-700 bg-gray-100 px-1 rounded">{p.machine_instance?.internal_code || '?'}</span>
                                                    <span className="text-gray-600 border-l pl-2 text-xs">{p.mold_physical?.physical_code || t('Orders.unassignedMold')}</span>
                                                    <span className="ml-auto font-mono text-blue-600 font-bold bg-blue-50 px-1 rounded">{t('Orders.qtyPrefix')} {p.planned_quantity}</span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${p.status === 'SCHEDULED' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{p.status}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="shrink-0 w-full md:w-auto">
                                    {!item.id ? (
                                        <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded">{t('Orders.saveOrderFirst')}</span>
                                    ) : (
                                        <button 
                                            type="button"
                                            onClick={() => setSelectedItem({
                                                order_item_id: item.id,
                                                total_requested_qty: item.quantity,
                                                total_planned_qty: totalPlanned,
                                                delivery_date: item.delivery_date,
                                                detail: {
                                                    product_id: item.product_id,
                                                    product_pn_raw: item.product_pn_raw,
                                                    orders: { slip_no: slipNo || '' }
                                                }
                                            })}
                                            className="w-full md:w-auto h-[32px] px-4 flex justify-center items-center gap-2 text-xs font-bold bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 rounded transition-colors shadow-sm"
                                        >
                                            <Plus size={14} />
                                            {t('Common.taoLenh')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Render CreatePlanForm with a backdrop */}
            {selectedItem && (
                <>
                    <div 
                        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" 
                        onClick={() => setSelectedItem(null)}
                    />
                    <div className="z-50 relative">
                        <CreatePlanForm 
                            item={selectedItem} 
                            onClose={() => {
                                setSelectedItem(null)
                                fetchPlans()
                            }} 
                        />
                    </div>
                </>
            )}
        </div>
    )
}
