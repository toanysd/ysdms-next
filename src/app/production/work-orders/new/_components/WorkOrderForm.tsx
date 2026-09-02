'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle, Search, Calendar, FileText, CheckCircle2 } from 'lucide-react'
import { searchProductsAction, getProductDetailsAction, createWorkOrderAction } from '../actions'

export function WorkOrderForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Searching logic
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // Form State
  const [form, setForm] = useState({
    wo_code: `WO-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}-${Math.floor(Math.random() * 10000).toString().padStart(4,'0')}`,
    wo_name: '',
    wo_type: 'NEW_SET',
    priority: 5,
    deadline: '',
    notes: '',
    design_revision_id: null as string | null,
    company_id: null as string | null,
  })

  // Debounce search
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      const results = await searchProductsAction(searchTerm)
      setSearchResults(results)
      setShowResults(true)
      setIsSearching(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleSelectProduct = async (product: any) => {
    setSelectedProduct(product)
    setSearchTerm('')
    setShowResults(false)
    
    // Auto-fill wo_name
    let defaultWoName = `新規金型製作 ${product.product_code}`
    if (form.wo_type === 'REPAIR') defaultWoName = `修理 ${product.product_code}`
    else if (form.wo_type === 'MODIFICATION') defaultWoName = `改造 ${product.product_code}`

    setForm(prev => ({ ...prev, wo_name: prev.wo_name || defaultWoName }))

    // Fetch revision & company
    const details = await getProductDetailsAction(product.product_id)
    setForm(prev => ({
      ...prev,
      design_revision_id: details.revision_id,
      company_id: details.company_id
    }))
  }

  const handleClearProduct = () => {
    setSelectedProduct(null)
    setForm(prev => ({ ...prev, design_revision_id: null, company_id: null }))
  }

  const handleSubmit = async () => {
    setErrorMsg('')
    setLoading(true)

    if (!selectedProduct) {
      setErrorMsg('Vui lòng chọn Sản Phẩm')
      setLoading(false)
      return
    }
    if (!form.wo_name || !form.deadline) {
      setErrorMsg('Vui lòng điền đủ Tên WO và Hạn chót')
      setLoading(false)
      return
    }

    const payload = {
      ...form,
      product_id: selectedProduct.product_id
    }

    const res = await createWorkOrderAction(payload)
    if (res.error) {
      setErrorMsg(res.error)
      setLoading(false)
    } else {
      router.push(`/production/work-orders`) // wait, PE wants to go to detail, but for WO-A2, going to list is fine. Let's go to list for now.
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 800, margin: '0 auto' }}>
      <div className="card-flat" style={{ padding: 24 }}>
        <h2 className="text-[16px] font-bold mb-6" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-default)', paddingBottom: 12 }}>
          Khởi Tạo Work Order
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          
          {/* TÌM KIẾM SẢN PHẨM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label font-bold">1. Chọn Sản Phẩm (Product) (*)</label>
            {!selectedProduct ? (
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: 36, fontSize: 14 }}
                  placeholder="Nhập mã hoặc tên sản phẩm để tìm kiếm..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                {isSearching && <span className="absolute right-3 top-2.5 text-xs text-slate-400">Đang tìm...</span>}
                
                {showResults && searchResults.length > 0 && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 6, marginTop: 4, zIndex: 10, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    {searchResults.map(p => (
                      <div 
                        key={p.product_id}
                        onClick={() => handleSelectProduct(p)}
                        style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-default)', cursor: 'pointer' }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>{p.product_code}</span>
                          <span style={{ fontSize: 13 }}>{p.product_name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {showResults && searchResults.length === 0 && !isSearching && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 6, marginTop: 4, zIndex: 10, padding: 12, textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
                    Không tìm thấy sản phẩm nào phù hợp.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '12px 16px', background: 'var(--tint-teal-bg)', border: '1px solid var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircle2 color="var(--accent)" size={20} />
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: 'monospace', color: 'var(--accent)' }}>{selectedProduct.product_code}</span>
                      {selectedProduct.product_name}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                      {form.design_revision_id ? 'Đã liên kết bản vẽ thiết kế' : '⚠️ Sản phẩm chưa có bản vẽ thiết kế'} | Khách hàng: {form.company_id ? 'Đã liên kết' : 'N/A'}
                    </p>
                  </div>
                </div>
                <button 
                  className="btn btn-secondary text-xs cursor-pointer"
                  onClick={handleClearProduct}
                >
                  Thay đổi
                </button>
              </div>
            )}
          </div>

          <hr style={{ borderTop: '1px solid var(--border-default)' }} />

          {/* THÔNG TIN WO */}
          <div className="grid grid-cols-2 gap-6">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label font-bold">Mã WO (Tự động)</label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  className="form-input bg-slate-50 cursor-not-allowed" 
                  style={{ paddingLeft: 36, fontFamily: 'monospace', fontWeight: 700 }}
                  value={form.wo_code}
                  readOnly
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label font-bold">Tên Lệnh Sản Xuất (*)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="VD: 新規金型製作 TOW-004"
                value={form.wo_name}
                onChange={e => setForm({...form, wo_name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label font-bold">Loại WO</label>
              <select className="form-input" value={form.wo_type} onChange={e => setForm({...form, wo_type: e.target.value})}>
                <option value="NEW_SET">Chế tạo mới (NEW_SET)</option>
                <option value="REPAIR">Sửa chữa (REPAIR)</option>
                <option value="MODIFICATION">Cải tiến/Đổi thiết kế (MODIFICATION)</option>
                <option value="REMAKE">Làm lại (REMAKE)</option>
                <option value="OTHER">Khác (OTHER)</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label font-bold">Mức Độ Ưu Tiên</label>
              <select className="form-input" value={form.priority} onChange={e => setForm({...form, priority: Number(e.target.value)})}>
                <option value={5}>NORMAL (Bình thường)</option>
                <option value={3}>HIGH (Cao)</option>
                <option value={1}>URGENT (Khẩn cấp)</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label className="form-label font-bold">Hạn Chót (Deadline) (*)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="date" 
                  className="form-input" 
                  style={{ paddingLeft: 36 }}
                  value={form.deadline}
                  onChange={e => setForm({...form, deadline: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label className="form-label font-bold">Ghi chú thêm</label>
            <textarea 
              className="form-textarea" 
              rows={3}
              placeholder="Nhập ghi chú cho bộ phận sản xuất..."
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
            />
          </div>

        </div>

        {errorMsg && (
          <div style={{ padding: 12, borderRadius: 6, background: '#FEF2F2', border: '1px solid #F87171', color: '#B91C1C', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-default)' }}>
          <button 
            className="btn btn-secondary cursor-pointer" 
            onClick={() => router.back()}
            disabled={loading}
          >
            Hủy Bỏ
          </button>
          <button 
            className="btn btn-primary flex items-center gap-1.5 cursor-pointer"
            onClick={handleSubmit}
            disabled={loading || !selectedProduct}
          >
            <Save size={16} />
            <span>{loading ? 'Đang Tạo...' : 'Tạo Work Order'}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
