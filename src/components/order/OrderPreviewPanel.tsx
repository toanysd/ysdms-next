'use client'

import React from 'react'
import { GridRow } from './OrderItemsGrid'
import { useTranslations } from 'next-intl'

interface CustomerLite {
    id: string
    customer_code: string
    delivery_name: string | null
    delivery_address: string | null
    requester_code: string | null
}

interface OrderPreviewPanelProps {
    slipNo: string
    orderDate: string
    selectedCustomer: CustomerLite | null
    requesterCode: string
    handlerName: string
    recipientName: string
    internalNotes: string
    items: GridRow[]
}

export function OrderPreviewPanel({ slipNo, orderDate, selectedCustomer, requesterCode, handlerName, recipientName, internalNotes, items }: OrderPreviewPanelProps) {
    const t = useTranslations('Orders')
    if (items.length === 0 || !items.some(i => i.product_pn_raw)) return null;

    return (
        <div className="mt-8 bg-white border-2 border-emerald-500 rounded-lg p-6 shadow-md max-w-4xl mx-auto printable-area mb-24">
            <div className="flex justify-between items-center border-b-2 border-emerald-200 pb-4 mb-6">
                <div>
                    <h2 className="text-2xl font-black text-emerald-900 tracking-tight">{t('previewTitle')}</h2>
                    <p className="text-emerald-700 text-sm mt-1 font-mono font-bold">{t('slipNo')} {slipNo || '---'}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-500">{t('issueDate')} <span className="text-gray-900">{orderDate}</span></p>
                    <p className="text-sm font-bold text-gray-500 gap-2 flex items-center justify-end mt-1">{t('handlerName')} <span className="px-2 py-1 bg-gray-100 rounded text-black">{handlerName || '---'}</span></p>
                </div>
            </div>

            {/* Customer Section */}
            <div className="bg-emerald-50 rounded-lg p-4 mb-6 border border-emerald-100">
                <h3 className="text-xs uppercase font-bold text-emerald-600 mb-2 tracking-wider">{t('deliveryDest')}</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xl font-bold text-emerald-900 font-mono">{selectedCustomer?.customer_code || '---'}</p>
                        <p className="text-sm font-bold text-emerald-800">{selectedCustomer?.delivery_name || t('unselected')}</p>
                    </div>
                    <div className="text-right text-sm text-emerald-800 flex flex-col justify-end">
                        <p>📍 {selectedCustomer?.delivery_address || '---'}</p>
                        <p className="mt-1">{t('recipientName')} <span className="font-bold text-teal-700">{recipientName || '---'}</span></p>
                        <p className="mt-1">{t('requester')} <span className="font-bold">{requesterCode || '---'}</span></p>
                    </div>
                </div>
            </div>

            {/* Grid Items */}
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item._key} className="border-2 border-teal-100 rounded-lg p-4 grid grid-cols-12 gap-4 bg-teal-50/10 hover:bg-teal-50/30 transition-colors">
                        <div className="col-span-1 text-2xl font-black text-teal-200 flex items-center justify-center select-none">
                            #{item.line_no}
                        </div>
                        <div className="col-span-3 flex flex-col justify-center">
                            <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mb-1">{t('pnLabel')}</p>
                            <div className="flex flex-col">
                                <p className="text-2xl font-black text-teal-900 font-mono tracking-tight leading-none mb-1">{item.product_pn_internal || item.product_pn_raw || '---'}</p>
                                {(item.product_pn_raw && item.product_pn_raw !== item.product_pn_internal) && (
                                    <p className="text-[13px] text-teal-600/80 font-mono font-bold leading-none">{item.product_pn_raw}</p>
                                )}
                            </div>
                        </div>
                        <div className="col-span-2 flex flex-col justify-center border-l-2 border-teal-100 pl-4">
                            <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mb-1">{t('moldLabel')}</p>
                            <p className="text-[16px] font-bold text-[var(--mcs-primary-dark)] font-mono leading-none mt-1">
                                {item.product_details?.mold_code || '--'}
                            </p>
                        </div>
                        <div className="col-span-3 flex flex-col justify-center border-l-2 border-teal-100 pl-4">
                            <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mb-1">{t('qtyLabel')}</p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-2xl font-black text-amber-600">{item.quantity || 0}</p>
                                <span className="text-xs font-bold text-amber-600/70">{t('qtyUnit')}</span>
                            </div>
                        </div>
                        <div className="col-span-3 flex flex-col justify-center border-l-2 border-teal-100 pl-4">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">{t('shipDate')}</p>
                                <p className="text-sm font-bold text-teal-900 leading-none">{item.delivery_date || '---'}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">{t('arrivalDate')}</p>
                                <p className="text-sm font-bold text-teal-900 leading-none">{item.delivery_date_end || '---'}</p>
                            </div>
                        </div>

                        {/* Plastic auto fill */}
                        <div className="col-span-12 mt-2 pt-3 border-t-2 border-teal-100/50 grid grid-cols-3 gap-4">
                            <div className="col-span-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">{t('materialThick')}</p>
                                <p className="text-sm font-bold text-teal-800">
                                    {item.product_details?.material ? `${item.product_details.material} / ${item.product_details.thickness}mm` : <span className="text-red-400 italic">{t('missingData')}</span>}
                                </p>
                            </div>
                            <div className="col-span-1 border-l border-gray-200 pl-4">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">{t('cutSize')}</p>
                                <p className="text-sm font-bold text-teal-800">
                                    {item.product_details?.length_val ? `${item.product_details.length_val} x ${item.product_details.width_val}` : '---'}
                                </p>
                            </div>
                            <div className="col-span-1 border-l border-gray-200 pl-4">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">{t('requestNo')}</p>
                                <p className="text-sm text-gray-600 font-mono">{item.request_no || '---'}</p>
                            </div>
                        </div>

                        {/* Ghi chú từng dòng & Báo Office Qty */}
                        {(item.process_notes || item.office_qty) && (
                            <div className="col-span-12 mt-3 px-3 py-2 bg-amber-50/70 border-l-[3px] border-amber-400 rounded-r shadow-sm flex flex-col justify-center">
                                <div className="flex items-center justify-between mb-0.5">
                                    <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">{t('notesLabel')}</p>
                                    {!!item.office_qty && (
                                        <span className="text-[11px] font-bold text-white bg-amber-600 px-1.5 py-0.5 rounded shadow-sm">
                                            {t('officeQtyAdd', { qty: item.office_qty })}
                                        </span>
                                    )}
                                </div>
                                {item.process_notes && <p className="text-[13px] text-amber-900 font-medium leading-snug">{item.process_notes}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {internalNotes && (
                <div className="mt-8 px-4 py-3 bg-teal-50/50 border-l-[3px] border-emerald-500 rounded-sm shadow-sm flex flex-col justify-center printable-no-break">
                    <p className="text-[10px] text-teal-800 font-bold uppercase tracking-wider mb-1">{t('generalNotes')}</p>
                    <div className="text-[12.5px] text-teal-950 font-medium whitespace-pre-wrap leading-relaxed">
                        {internalNotes}
                    </div>
                </div>
            )}
        </div>
    )
}
