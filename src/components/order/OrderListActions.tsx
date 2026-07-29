'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Edit, Loader2, CheckCircle, Truck } from 'lucide-react'
import { updateOrderStatusAction, deleteOrderAction } from '@/app/actions/order'
import { ShipModal } from './ShipModal'
import { useTranslations } from 'next-intl'

interface OrderListActionsProps {
    orderId: string
    status: string
    slipNo?: string
    orderItems?: any[]
}

export function OrderListActions({ orderId, status, slipNo, orderItems }: OrderListActionsProps) {
    const t = useTranslations()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isShipModalOpen, setIsShipModalOpen] = useState(false)

    if (status !== 'draft' && status !== 'in_production') {
        return <span className="text-gray-300">-</span>
    }

    const handleDelete = () => {
        if (!confirm(t('Order.confirmDeleteDraft'))) return

        startTransition(async () => {
            try {
                await deleteOrderAction(orderId)
                router.refresh()
            } catch (err: any) {
                alert(`${t('Common.error')}: ${err.message}`)
            }
        })
    }

    const handleEdit = () => {
        alert(t('Order.editNotAvailable'))
    }

    const handleConfirm = () => {
        startTransition(async () => {
            try {
                await updateOrderStatusAction(orderId, 'confirmed' as any)
                router.refresh()
            } catch (err: any) {
                alert(`${t('Order.confirmError')}: ${err.message}`)
            }
        })
    }

    return (
        <>
            {status === 'draft' && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={handleConfirm}
                        disabled={isPending}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 focus:bg-emerald-100 rounded transition-colors disabled:opacity-50"
                        title={t('Order.approveDraft')}
                    >
                        {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    </button>
                    <button
                        onClick={handleEdit}
                        disabled={isPending}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 focus:bg-blue-100 rounded transition-colors disabled:opacity-50"
                        title={t('Order.editDraft')}
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="p-1.5 text-red-500 hover:bg-red-50 focus:bg-red-100 rounded transition-colors disabled:opacity-50"
                        title={t('Order.deleteDraft')}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )}

            {status === 'in_production' && (
                <div className="flex items-center justify-center">
                    <button
                        onClick={() => setIsShipModalOpen(true)}
                        className="px-2 py-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded shadow-sm flex items-center gap-1 transition-colors"
                    >
                        <Truck size={14} /> {t('Order.ship')}
                    </button>
                </div>
            )}

            {isShipModalOpen && (
                <ShipModal
                    orderId={orderId}
                    slipNo={slipNo || ''}
                    orderItems={orderItems || []}
                    onClose={() => setIsShipModalOpen(false)}
                />
            )}
        </>
    )
}
