'use client'
import React from 'react'
import { Server } from 'lucide-react'

export default function TypeTab({ types }: { types: any[] }) {
    return (
        <div className="bg-white border border-[var(--mcs-border)] rounded-md shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[var(--mcs-border)] flex items-center justify-between">
                <div>
                    <h2 className="text-[14px] font-bold text-slate-800 flex items-center gap-2">
                        <Server size={18} className="text-teal-600" />
                        設備種別 (Danh mục Loại Máy)
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-1">
                        Danh sách các phân loại chính của máy móc (Chỉ xem). Tránh thay đổi cấu trúc gốc.
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 whitespace-nowrap">
                        <tr>
                            <th className="p-3 font-bold w-[120px]">
                                <span className="ja">コード (Code)</span>
                            </th>
                            <th className="p-3 font-bold w-[180px]">
                                <span className="ja">名称 (Tên tiếng Nhật)</span>
                            </th>
                            <th className="p-3 font-bold w-[200px]">
                                <span className="ja">Tên tiếng Việt</span>
                            </th>
                            <th className="p-3 font-bold">
                                <span className="ja">Schema (Định nghĩa thông số)</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {types.map((t: any) => (
                            <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                <td className="p-3 font-mono font-bold text-emerald-700">{t.code}</td>
                                <td className="p-3 font-bold text-slate-800">{t.name_jp || '-'}</td>
                                <td className="p-3 text-slate-600">{t.name_vi}</td>
                                <td className="p-3 text-slate-500 font-mono text-[10px]">
                                    {t.spec_schema?.fields ? `[${t.spec_schema.fields.length} fields defined]` : '{}'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
