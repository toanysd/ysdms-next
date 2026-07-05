'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { upsertContactAction, deleteContactAction } from '@/app/actions/customer'
import { Database } from '@/types/database.types'

type Contact = Database['public']['Tables']['company_contacts']['Row']

export function ContactList({ companyId, contacts }: { companyId: string, contacts: Contact[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    contact_name: '',
    contact_role: '',
    contact_tel: '',
    contact_email: '',
    is_primary: false,
  })

  const openAdd = () => {
    setEditingItem(null)
    setFormData({
      contact_name: '',
      contact_role: '',
      contact_tel: '',
      contact_email: '',
      is_primary: false,
    })
    setIsModalOpen(true)
  }

  const openEdit = (c: Contact) => {
    setEditingItem(c)
    setFormData({
      contact_name: c.contact_name,
      contact_role: c.contact_role || '',
      contact_tel: c.contact_tel || '',
      contact_email: c.contact_email || '',
      is_primary: c.is_primary || false,
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.contact_name.trim()) return alert('Vui lòng nhập tên người liên hệ')

    setIsLoading(true)
    const payload = {
      contact_id: editingItem?.contact_id,
      company_id: companyId,
      ...formData
    }
    const res = await upsertContactAction(payload)
    setIsLoading(false)

    if (res.success) {
      setIsModalOpen(false)
    } else {
      alert(res.error || 'Có lỗi xảy ra')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người liên hệ này?')) return
    setIsLoading(true)
    const res = await deleteContactAction(id, companyId)
    setIsLoading(false)
    if (!res.success) alert(res.error || 'Có lỗi xảy ra')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexShrink: 0 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>担当者一覧</h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Danh sách người liên hệ</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary" style={{ gap: 4 }}>
          <Plus size={14} /> 追加 / Thêm
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
        {contacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            データがありません / Chưa có dữ liệu
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <span className="ja">優先</span>
                  <span className="vi">Chính</span>
                </th>
                <th>
                  <span className="ja">担当者名</span>
                  <span className="vi">Tên</span>
                </th>
                <th>
                  <span className="ja">役職</span>
                  <span className="vi">Chức vụ</span>
                </th>
                <th>
                  <span className="ja">電話番号</span>
                  <span className="vi">SĐT</span>
                </th>
                <th>
                  <span className="ja">メール</span>
                  <span className="vi">Email</span>
                </th>
                <th style={{ width: 80, textAlign: 'center' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(c => (
                <tr key={c.contact_id}>
                  <td style={{ textAlign: 'center' }}>
                    {c.is_primary && <span className="badge badge--success">Primary</span>}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.contact_name}</td>
                  <td>{c.contact_role}</td>
                  <td>{c.contact_tel}</td>
                  <td>{c.contact_email}</td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                      <button onClick={() => openEdit(c)} style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(c.contact_id)} style={{ color: 'var(--text-error)', background: 'none', border: 'none', cursor: 'pointer' }}>
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
          <div style={{ background: 'var(--bg-surface)', padding: 20, borderRadius: 'var(--radius-md)', width: 400, boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
              {editingItem ? '編集 / Sửa' : '追加 / Thêm mới'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>担当者名 / Tên liên hệ <span style={{ color: 'var(--text-error)' }}>*</span></label>
                <input
                  className="form-input"
                  value={formData.contact_name}
                  onChange={e => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              
              <div className="form-grid-2">
                <div>
                  <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>役職 / Chức vụ</label>
                  <input
                    className="form-input"
                    value={formData.contact_role}
                    onChange={e => setFormData({ ...formData, contact_role: e.target.value })}
                    placeholder="Manager"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>優先 / Liên hệ chính</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, height: 32 }}>
                    <input
                      type="checkbox"
                      checked={formData.is_primary}
                      onChange={e => setFormData({ ...formData, is_primary: e.target.checked })}
                    />
                    <span style={{ fontSize: 13 }}>Primary</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>電話番号 / SĐT</label>
                <input
                  className="form-input"
                  value={formData.contact_tel}
                  onChange={e => setFormData({ ...formData, contact_tel: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, marginBottom: 4 }}>メール / Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={formData.contact_email}
                  onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
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
