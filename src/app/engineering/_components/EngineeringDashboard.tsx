'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { FileEdit, CheckCircle, Clock, Search, ArrowRight, UploadCloud, Layers } from 'lucide-react'
import { updateDesignStatus } from '@/app/actions/engineering'
import { BilingualTitle } from '@/components/ui/BilingualTitle'

export default function EngineeringDashboard({ requests }: { requests: any[] }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [isPending, startTransition] = useTransition()

    // Defensive check
    const safeRequests = Array.isArray(requests) ? requests : []

    const filteredRequests = safeRequests.filter(req => {
        const orders = Array.isArray(req.orders) ? req.orders[0] : req.orders
        return (req.product_pn_raw || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
               (orders?.slip_no || '').toLowerCase().includes(searchTerm.toLowerCase())
    })

    const pendingDesign = filteredRequests.filter(req => {
        const product = Array.isArray(req.product_master) ? req.product_master[0] : req.product_master
        let specExt = product?.spec_ext;
        if (typeof specExt !== 'object' || Array.isArray(specExt) || !specExt) specExt = {};
        const status = specExt.design_status || 'draft'
        return status !== 'approved'
    })

    const pendingAluminum = filteredRequests.filter(req => {
        const product = Array.isArray(req.product_master) ? req.product_master[0] : req.product_master
        let specExt = product?.spec_ext;
        if (typeof specExt !== 'object' || Array.isArray(specExt) || !specExt) specExt = {};
        const status = specExt.design_status || 'draft'
        return status === 'approved'
    })

    const renderRequestCard = (req: any) => {
        const product = Array.isArray(req.product_master) ? req.product_master[0] : req.product_master
        const orders = Array.isArray(req.orders) ? req.orders[0] : req.orders
        const customers = Array.isArray(orders?.customers) ? orders.customers[0] : orders?.customers
        
        let specExt = product?.spec_ext;
        if (typeof specExt !== 'object' || Array.isArray(specExt) || !specExt) specExt = {};
        const designStatus = specExt.design_status || 'draft'
        const isMold = orders?.order_type === 'design_mold'
        
        return (
            <div key={req.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="p-2 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <div className="text-[10px] font-mono text-gray-500">{orders?.slip_no}</div>
                        <div className="text-[13px] font-bold text-slate-800 mt-1">{req.product_pn_raw || product?.code || 'Chưa có mã khay'}</div>
                    </div>
                    <div>
                        {getStatusBadge(designStatus)}
                    </div>
                </div>

                <div className="p-2 flex-1 flex flex-col gap-1">
                    <div className="text-[11px] text-gray-600 flex justify-between">
                        <span>Khách hàng:</span>
                        <span className="font-bold text-slate-700">{customers?.customer_name_jp || customers?.customer_code}</span>
                    </div>
                    <div className="text-[11px] text-gray-600 flex justify-between items-center">
                        <span>Loại YC:</span>
                        <span className={`font-bold px-1.5 py-0.5 rounded ${isMold ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                            {isMold ? '設計金型 (Khuôn)' : '設計トレイ (Khay)'}
                        </span>
                    </div>
                    <div className="text-[11px] text-gray-600 flex justify-between items-center">
                        <Link href={`/orders/${orders?.order_no || ''}`} className="text-blue-600 hover:underline flex items-center gap-1 font-bold" title="Xem Đơn hàng gốc">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            {orders?.order_no || 'Đơn hàng gốc'}
                        </Link>
                        <span>{orders?.order_date}</span>
                    </div>
                </div>

                <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-lg flex flex-col gap-2">
                    {/* Status Controls */}
                    {product?.id && (
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-gray-500 font-bold">Cập nhật tiến độ</span>
                            <select 
                                value={designStatus}
                                onChange={(e) => handleStatusChange(product.id, e.target.value)}
                                disabled={isPending}
                                className="text-[11px] border border-gray-300 rounded px-1 py-0.5 outline-none focus:border-blue-500 disabled:opacity-50"
                            >
                                <option value="draft">Chưa bắt đầu</option>
                                <option value="in_progress">Đang thiết kế</option>
                                <option value="pending_approval">Chờ khách duyệt</option>
                                <option value="approved">Đã duyệt (Approved)</option>
                            </select>
                        </div>
                    )}

                    {/* Action Links */}
                    <div className="grid grid-cols-2 gap-2">
                        <Link 
                            href={product?.id ? `/production/products/${product.id}` : '#'}
                            className={`flex justify-center items-center gap-1.5 text-[11px] font-bold py-1.5 rounded transition-colors ${!product?.id ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'}`}
                        >
                            <Layers size={14}/>
                            <span className="ja">トレイ詳細 (Khay)</span>
                        </Link>
                        
                        <Link 
                            href={`/master/mold${product?.id ? `?product_id=${product.id}` : ''}`}
                            className="flex justify-center items-center gap-1.5 text-[11px] font-bold py-1.5 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
                        >
                            <UploadCloud size={14}/>
                            <span className="ja">金型図面 (Khuôn)</span>
                        </Link>
                    </div>
                    {designStatus === 'approved' && (
                        <div className="mt-1 pt-2 border-t border-gray-200">
                            <Link 
                                href={`/equipment/jobs?new=true&source=engineering&product=${product?.product_code || ''}&product_id=${product?.id || ''}`}
                                className="w-full flex justify-center items-center gap-1.5 text-[11px] font-bold py-1.5 rounded bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                            >
                                <FileEdit size={14} />
                                Lập Yêu cầu Gia công Khuôn
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const handleStatusChange = (productId: string, newStatus: string) => {
        if (!productId) return
        startTransition(async () => {
            try {
                await updateDesignStatus(productId, newStatus)
            } catch (error: any) {
                alert(error.message || 'Lỗi cập nhật trạng thái')
            }
        })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1"><CheckCircle size={12}/> 承認済 (Đã duyệt)</span>
            case 'pending_approval':
                return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1"><Clock size={12}/> 承認待ち (Chờ duyệt)</span>
            case 'in_progress':
                return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1"><FileEdit size={12}/> 險ｭ險井ｸｭ (Đang thiết kế)</span>
            default:
                return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1">譛ｪ逹謇・(Chưa bắt đầu)</span>
        }
    }

    return (
        <div className="flex flex-col flex-1 overflow-hidden bg-white rounded-lg shadow-sm border border-blue-200">
            {/* Toolbar */}
            <div className="p-4 border-b border-blue-100 flex items-center justify-between bg-blue-50/50">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo Khay hoặc Số Phiếu..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-1.5 text-[13px] border border-gray-300 rounded focus:border-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="flex-1 overflow-auto p-3 bg-gray-50/30 flex flex-col md:flex-row gap-3">
                
                {/* Column 1: Ch盻・Thi蘯ｿt k蘯ｿ (Draft, In Progress, Pending Approval) */}
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-blue-200">
                        <FileEdit className="text-blue-600" size={16} />
                        <BilingualTitle ja="設計依頼 (トレイ・金型)" vi="Yêu cầu Thiết kế (Khay/Khuôn)" className="gap-0 flex-1" />
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold py-0.5 px-2 rounded-full">{pendingDesign.length}</span>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-4">
                        {pendingDesign.map(req => renderRequestCard(req))}
                        {pendingDesign.length === 0 && (
                            <div className="text-center py-4 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                Trống
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 2: Ch盻・Phﾃｴi nhﾃｴm & Ph盻･ tr盻｣ (Approved) */}
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-orange-200">
                        <Layers className="text-orange-600" size={16} />
                        <BilingualTitle ja="材料計算" vi="Tính Phôi nhôm & Phụ trợ" className="gap-0 flex-1" />
                        <span className="bg-orange-100 text-orange-800 text-[10px] font-bold py-0.5 px-2 rounded-full">{pendingAluminum.length}</span>
                    </div>
                    <div className="flex flex-col gap-3 overflow-y-auto pr-1 pb-4">
                        {pendingAluminum.map(req => renderRequestCard(req))}
                        {pendingAluminum.length === 0 && (
                            <div className="text-center py-4 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                Trống
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

