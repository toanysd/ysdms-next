'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { upsertDeliverySiteAction, deleteDeliverySiteAction } from '@/app/actions/customer'
import { Database } from '@/types/database.types'

type DeliverySite = Database['public']['Tables']['delivery_sites']['Row']

export function DeliverySiteList({ companyId, sites }: { companyId: string, sites: DeliverySite[] }) {
  const t = useTranslations()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DeliverySite | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    site_code: '',
    site_name: '',
    site_address: '',
    site_tel: '',
    site_fax: '',
    contact_person: '',
    contact_email: '',
    delivery_notes: '',
    is_active: true,
  })

  const openAdd = () => {
    setEditingItem(null)
    setFormData({
      site_code: '',
      site_name: '',
      site_address: '',
      site_tel: '',
      site_fax: '',
      contact_person: '',
      contact_email: '',
      delivery_notes: '',
      is_active: true,
    })
    setIsModalOpen(true)
  }

  const openEdit = (s: DeliverySite) => {
    setEditingItem(s)
    setFormData({
      site_code: s.site_code,
      site_name: s.site_name,
      site_address: s.site_address || '',
      site_tel: s.site_tel || '',
      site_fax: s.site_fax || '',
      contact_person: s.contact_person || '',
      contact_email: s.contact_email || '',
      delivery_notes: s.delivery_notes || '',
      is_active: s.is_active ?? true,
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.site_code.trim()) return alert('Vui lòng nhập mã địa điểm')
    if (!formData.site_name.trim()) return alert('Vui lòng nhập tên địa điểm')

    setIsLoading(true)
    const payload = {
      site_id: editingItem?.site_id,
      company_id: companyId,
      ...formData
    }
    const res = await upsertDeliverySiteAction(payload)
    setIsLoading(false)

    if (res.success) {
      setIsModalOpen(false)
    } else {
      alert(res.error || 'Có lỗi xảy ra')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa điểm giao hàng này?')) return
    setIsLoading(true)
    const res = await deleteDeliverySiteAction(id, companyId)
    setIsLoading(false)
    if (!res.success) alert(res.error || 'Có lỗi xảy ra')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexShrink: 0 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>納品先一覧</h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Danh sách địa điểm giao hàng</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary" style={{ gap: 4 }}>
          <Plus size={14} /> 追加 / Thêm
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
        {sites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            データがありません / Chưa có dữ liệu
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 100 }}>
                  {t('Master.ma')}
                </th>
                <th style={{ width: 150 }}>
                  {t('Master.ten')}
                </th>
                <th>
                  {t('Master.iaChi')}
                </th>
                <th style={{ width: 120 }}>
                  {t('Master.nguoiNhan')}
                </th>
                <th style={{ width: 100 }}>
                  {t('Master.st')}
                </th>
                <th style={{ width: 60, textAlign: 'center' }}>
                  {t('Master.tempKey')}
                </th>
                <th style={{ width: 80, textAlign: 'center' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {sites.map(s => (
                <tr key={s.site_id}>
                  <td style={{ fontFamily: 'monospace' }}>{s.site_code}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.site_name}</td>
                  <td>{s.site_address}</td>
                  <td>{s.contact_person}</td>
                  <td>{s.site_tel}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${s.is_active ? 'badge--success' : 'badge--neutral'}`}>
                      {s.is_active ? 'OK' : '停止'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                      <button onClick={() => openEdit(s)} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(s.site_id)} style={{ color: 'var(--text-error)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-surface)', padding: 20, borderRadius: 'var(--radius-md)', width: 500, boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
              {editingItem ? '編集 / Sửa' : '追加 / Thêm mới'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>コード / Mã <span style={{ color: 'var(--text-error)' }}>*</span></label>
                  <input
                    className="form-input"
                    value={formData.site_code}
                    onChange={e => setFormData({ ...formData, site_code: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>状態 / Trạng thái</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>Sử dụng (Active)</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>納品先名 / Tên địa điểm <span style={{ color: 'var(--text-error)' }}>*</span></label>
                <input
                  className="form-input"
                  value={formData.site_name}
                  onChange={e => setFormData({ ...formData, site_name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>住所 / Địa chỉ</label>
                <input
                  className="form-input"
                  value={formData.site_address}
                  onChange={e => setFormData({ ...formData, site_address: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>電話番号 / SĐT</label>
                  <input
                    className="form-input"
                    value={formData.site_tel}
                    onChange={e => setFormData({ ...formData, site_tel: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>FAX</label>
                  <input
                    className="form-input"
                    value={formData.site_fax}
                    onChange={e => setFormData({ ...formData, site_fax: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>担当者 / Người nhận</label>
                  <input
                    className="form-input"
                    value={formData.contact_person}
                    onChange={e => setFormData({ ...formData, contact_person: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>メール / Email</label>
                  <input
                    className="form-input"
                    value={formData.contact_email}
                    onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>備考 / Ghi chú giao hàng</label>
                <textarea
                  className="form-textarea"
                  value={formData.delivery_notes}
                  onChange={e => setFormData({ ...formData, delivery_notes: e.target.value })}
                  rows={2}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
              <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary" disabled={isLoading}>
                キャンセル / Hủy
              </button>
              <button onClick={handleSave} className="btn btn-primary" disabled={isLoading}>
                {isLoading ? '...' : '保存 / Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
