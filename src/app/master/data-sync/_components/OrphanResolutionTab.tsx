'use client'

import { useState } from 'react'
import { hideCompany, promoteCompanyToSSOT, remapCompanyFKs } from '../actions'

type Target = {
  classification: string
  db_company_id: string
  db_company_code: string
  db_company_name: string
  anomaly_reason: string
  total_transactions: string
  total_metadata: string
  transaction_breakdown: string
  metadata_breakdown: string
}

export default function OrphanResolutionTab({ 
  targets, 
  validCompanies 
}: { 
  targets: Target[],
  validCompanies: {company_id: string, company_code: string | null, company_name: string}[]
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [remapSelections, setRemapSelections] = useState<Record<string, string>>({})

  const group1 = targets.filter(t => t.classification.startsWith('Group 1'))
  const group3 = targets.filter(t => t.classification.startsWith('Group 3'))
  const group4 = targets.filter(t => t.classification.startsWith('Group 4'))

  const handlePromote = async (id: string) => {
    if (!confirm('Xác nhận đưa công ty này vào danh sách Khách hàng cốt lõi (SSOT)?')) return
    setLoadingId(id)
    const res = await promoteCompanyToSSOT(id)
    if (res?.error) alert('Lỗi: ' + res.error)
    setLoadingId(null)
  }

  const handleHide = async (id: string) => {
    if (!confirm('Xác nhận ẨN công ty này khỏi các dropdown tạo đơn hàng? (Dữ liệu lịch sử vẫn giữ nguyên)')) return
    setLoadingId(id)
    const res = await hideCompany(id)
    if (res?.error) alert('Lỗi: ' + res.error)
    setLoadingId(null)
  }

  const handleRemap = async (oldId: string) => {
    const newId = remapSelections[oldId]
    if (!newId) return alert('Vui lòng chọn công ty đích để remap.')
    if (newId === oldId) return alert('Không thể remap vào chính nó.')
    
    if (!confirm('CẢNH BÁO: Hành động này sẽ chuyển TOÀN BỘ lịch sử đơn hàng, khuôn, thiết kế... sang công ty mới và vô hiệu hóa công ty cũ. Bạn có chắc chắn?')) return
    
    setLoadingId(oldId)
    const res = await remapCompanyFKs(oldId, newId)
    if (res?.error) alert('Lỗi: ' + res.error)
    setLoadingId(null)
  }

  const renderBreakdown = (str: string) => {
    if (!str) return '-'
    return str.split(' | ').map(s => (
      <span key={s} className="badge badge--neutral mr-1 mb-1 text-[10px] py-[2px]">{s}</span>
    ))
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* GROUP 3: THIẾU SÓT NHƯNG CÓ GIAO DỊCH */}
      <div className="card-flat">
        <div className="px-4 py-3 bg-[var(--tint-teal-bg)] border-b border-[var(--border-color)]">
          <h2 className="font-bold text-[14px]">Group 3: Khách Hàng Giao Dịch Thật (Bị Sót Khỏi SSOT) - {group3.length} records</h2>
          <p className="text-[12px] text-muted">Cần BỔ SUNG vào SSOT. Đây là những công ty đang có dữ liệu đơn hàng/sản phẩm nhưng không có trong danh sách chuẩn.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-1/6">Mã / Tên</th>
                <th className="w-1/12">Trans FKs</th>
                <th className="w-2/5">Giao dịch cốt lõi</th>
                <th className="w-1/4">Metadata</th>
                <th className="w-1/12 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {group3.map(t => (
                <tr key={t.db_company_id}>
                  <td className="font-mono font-bold text-[13px]">
                    <div>{t.db_company_code || '-'}</div>
                    <div className="text-[var(--text-primary)] font-sans">{t.db_company_name}</div>
                  </td>
                  <td className="font-mono text-center font-bold">{t.total_transactions}</td>
                  <td className="whitespace-normal leading-tight">{renderBreakdown(t.transaction_breakdown)}</td>
                  <td className="whitespace-normal leading-tight">{renderBreakdown(t.metadata_breakdown)}</td>
                  <td className="text-center">
                    <button 
                      className="btn btn-primary text-[11px] py-1 px-2"
                      onClick={() => handlePromote(t.db_company_id)}
                      disabled={loadingId === t.db_company_id}
                    >
                      Bổ sung SSOT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GROUP 1: RÁC HÌNH THỨC */}
      <div className="card-flat">
        <div className="px-4 py-3 bg-[var(--tint-orange-bg)] border-b border-[var(--border-color)]">
          <h2 className="font-bold text-[14px]">Group 1: Rác Hình Thức (Format Anomaly) - {group1.length} records</h2>
          <p className="text-[12px] text-muted">Lỗi đuôi file, chuỗi số. Cần chọn công ty ĐÚNG để gộp (remap) tất cả lịch sử sang.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-1/5">Rác Cần Xử Lý</th>
                <th className="w-1/5">Dấu Hiệu Lỗi</th>
                <th className="w-1/4">Tổng Liên Kết (Trans / Meta)</th>
                <th className="w-1/4">Chọn Công Ty Chuẩn Để Gộp</th>
                <th className="w-1/12 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {group1.map(t => (
                <tr key={t.db_company_id}>
                  <td className="font-mono font-bold text-[13px] text-[var(--accent)]">
                    <div>{t.db_company_code || '-'}</div>
                    <div className="text-[var(--text-primary)] font-sans">{t.db_company_name}</div>
                  </td>
                  <td className="text-[12px] text-red-600">{t.anomaly_reason}</td>
                  <td>
                    <div className="text-[12px]">Trans: <b>{t.total_transactions}</b></div>
                    <div className="text-[12px]">Meta: <b>{t.total_metadata}</b></div>
                  </td>
                  <td>
                    <select 
                      className="form-input text-[12px] py-1 w-full"
                      value={remapSelections[t.db_company_id] || ''}
                      onChange={e => setRemapSelections(prev => ({...prev, [t.db_company_id]: e.target.value}))}
                    >
                      <option value="">-- Chọn công ty đích --</option>
                      {validCompanies.map(vc => (
                        <option key={vc.company_id} value={vc.company_id}>
                          {vc.company_code ? `[${vc.company_code}] ` : ''}{vc.company_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="text-center">
                    <button 
                      className="btn btn-secondary text-[11px] py-1 px-2 border-red-500 text-red-600"
                      onClick={() => handleRemap(t.db_company_id)}
                      disabled={loadingId === t.db_company_id || !remapSelections[t.db_company_id]}
                    >
                      Remap & Ẩn
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GROUP 4: DANH BẠ CŨ / NGỦ ĐÔNG */}
      <div className="card-flat">
        <div className="px-4 py-3 bg-[var(--tint-purple-bg)] border-b border-[var(--border-color)]">
          <h2 className="font-bold text-[14px]">Group 4: Danh Bạ Cũ / Ngủ Đông - {group4.length} records</h2>
          <p className="text-[12px] text-muted">Chỉ có liên kết phụ (mold_owners, contacts...) hoặc hoàn toàn trống. Cần ẨN khỏi hệ thống để làm sạch giao diện.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-1/6">Mã / Tên</th>
                <th className="w-2/5">Giao dịch cốt lõi</th>
                <th className="w-1/3">Liên kết phụ (Metadata)</th>
                <th className="w-1/12 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {group4.map(t => (
                <tr key={t.db_company_id}>
                  <td className="font-mono text-[13px]">
                    <div>{t.db_company_code || '-'}</div>
                    <div className="font-sans">{t.db_company_name}</div>
                  </td>
                  <td className="whitespace-normal leading-tight text-gray-400">{renderBreakdown(t.transaction_breakdown)}</td>
                  <td className="whitespace-normal leading-tight">{renderBreakdown(t.metadata_breakdown)}</td>
                  <td className="text-center">
                    <button 
                      className="btn btn-secondary text-[11px] py-1 px-2"
                      onClick={() => handleHide(t.db_company_id)}
                      disabled={loadingId === t.db_company_id}
                    >
                      Ẩn Khỏi Hệ Thống
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
