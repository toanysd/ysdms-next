'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Plus, Search, Check, AlertCircle, Settings, Edit2, Power, PowerOff } from 'lucide-react'

interface ProcessingCodeItem {
  processing_code_id: number
  processing_name: string
  department_code: string | null
  category: string | null
  sort_note: number | null
  is_active: boolean | null
}

interface ProcessingCodesManagerModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdated: () => void
}

const DEPARTMENTS = [
  { value: 'ALL', label: 'すべて (Tất cả)' },
  { value: 'DESIGN', label: '設計部 (Thiết kế)' },
  { value: 'MOLD_SHOP', label: '金型工場 (Xưởng khuôn)' },
  { value: 'PRODUCTION', label: '生産部 (Sản xuất)' },
  { value: 'OFFICE', label: '事務 (Văn phòng)' },
  { value: 'QUALITY', label: '品質 (Chất lượng)' },
  { value: 'GENERAL', label: '共通 (Chung)' },
]

export function ProcessingCodesManagerModal({
  isOpen,
  onClose,
  onUpdated,
}: ProcessingCodesManagerModalProps) {
  const supabase = createClient()

  const [codes, setCodes] = useState<ProcessingCodeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState('ALL')

  // New Code Form State
  const [showAddForm, setShowAddForm] = useState(false)
  const [newId, setNewId] = useState('')
  const [newName, setNewName] = useState('')
  const [newDept, setNewDept] = useState('MOLD_SHOP')
  const [newCategory, setNewCategory] = useState('MOLD')
  const [savingNew, setSavingNew] = useState(false)

  // Edit Inline State
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDept, setEditDept] = useState('')

  const loadCodes = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('processing_codes')
        .select('*')
        .order('processing_code_id', { ascending: true })

      if (err) throw err
      if (data) setCodes(data as ProcessingCodeItem[])
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải danh sách mã công việc')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadCodes()
      setShowAddForm(false)
      setEditingId(null)
    }
  }, [isOpen])

  // Filtered list
  const filteredCodes = codes.filter(c => {
    const matchesDept = selectedDept === 'ALL' || c.department_code === selectedDept
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch = !query ||
      String(c.processing_code_id).includes(query) ||
      (c.processing_name && c.processing_name.toLowerCase().includes(query)) ||
      (c.category && c.category.toLowerCase().includes(query))

    return matchesDept && matchesSearch
  })

  // Toggle is_active
  const handleToggleActive = async (item: ProcessingCodeItem) => {
    const nextActive = !item.is_active
    try {
      const { error: updateErr } = await supabase
        .from('processing_codes')
        .update({ is_active: nextActive, updated_at: new Date().toISOString() })
        .eq('processing_code_id', item.processing_code_id)

      if (updateErr) throw updateErr

      setCodes(prev =>
        prev.map(c =>
          c.processing_code_id === item.processing_code_id
            ? { ...c, is_active: nextActive }
            : c
        )
      )
      onUpdated()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật trạng thái')
    }
  }

  // Save inline edit
  const handleSaveEdit = async (codeId: number) => {
    if (!editName.trim()) return
    try {
      const { error: updateErr } = await supabase
        .from('processing_codes')
        .update({
          processing_name: editName.trim(),
          department_code: editDept || null,
          updated_at: new Date().toISOString()
        })
        .eq('processing_code_id', codeId)

      if (updateErr) throw updateErr

      setCodes(prev =>
        prev.map(c =>
          c.processing_code_id === codeId
            ? { ...c, processing_name: editName.trim(), department_code: editDept || null }
            : c
        )
      )
      setEditingId(null)
      onUpdated()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lưu chỉnh sửa')
    }
  }

  // Create new code
  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault()
    const idNum = parseInt(newId.trim(), 10)
    if (isNaN(idNum) || idNum <= 0) {
      return setError('Mã ID phải là số nguyên dương hợp lệ')
    }
    if (!newName.trim()) {
      return setError('Tên công việc là bắt buộc')
    }

    setSavingNew(true)
    setError(null)
    try {
      const { error: insertErr } = await supabase
        .from('processing_codes')
        .insert({
          processing_code_id: idNum,
          processing_name: newName.trim(),
          department_code: newDept,
          category: newCategory,
          sort_note: idNum,
          is_active: true,
        })

      if (insertErr) throw insertErr

      await loadCodes()
      setShowAddForm(false)
      setNewId('')
      setNewName('')
      onUpdated()
    } catch (err: any) {
      setError(err.message || 'Lỗi khi thêm mã công việc mới')
    } finally {
      setSavingNew(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        className="card-flat"
        style={{
          width: '100%',
          maxWidth: 720,
          background: 'var(--bg-surface)',
          borderRadius: 8,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '88vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--tint-teal-bg, var(--bg-surface-2))',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Settings size={16} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              加工コード管理 (Quản lý Mã Công việc / Processing Codes)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toolbar: Search + Dept Filter + Add Button */}
        <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {error && (
            <div style={{
              padding: '8px 12px',
              borderRadius: 6,
              background: 'var(--tint-error-bg, #fee2e2)',
              color: 'var(--status-error, #b91c1c)',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="IDまたは作業名で検索..."
                className="form-input"
                style={{ paddingLeft: 30, fontSize: 12, height: 32 }}
              />
            </div>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="form-input"
              style={{ width: 'auto', fontSize: 12, height: 32, fontWeight: 600 }}
            >
              {DEPARTMENTS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>

            {/* Toggle Add Form Button */}
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary"
              style={{ fontSize: 11, padding: '4px 10px', height: 32, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Plus size={13} /> {showAddForm ? '閉じる' : '新規コード追加'}
            </button>
          </div>

          {/* Add New Code Sub-form */}
          {showAddForm && (
            <form onSubmit={handleCreateNew} style={{
              padding: '10px 14px',
              borderRadius: 6,
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-default)',
              display: 'grid',
              gridTemplateColumns: '80px 1.5fr 120px 120px auto',
              gap: 8,
              alignItems: 'center',
              marginTop: 4
            }}>
              <div>
                <input
                  type="number"
                  placeholder="ID (VD: 36)"
                  value={newId}
                  onChange={e => setNewId(e.target.value)}
                  className="form-input font-mono"
                  style={{ fontSize: 12, height: 30 }}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="作業名 (Tên công việc)"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="form-input"
                  style={{ fontSize: 12, height: 30 }}
                  required
                />
              </div>
              <div>
                <select
                  value={newDept}
                  onChange={e => setNewDept(e.target.value)}
                  className="form-input"
                  style={{ fontSize: 11, height: 30 }}
                >
                  <option value="DESIGN">設計部</option>
                  <option value="MOLD_SHOP">金型工場</option>
                  <option value="PRODUCTION">生産部</option>
                  <option value="OFFICE">事務</option>
                  <option value="GENERAL">共通</option>
                </select>
              </div>
              <div>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="form-input"
                  style={{ fontSize: 11, height: 30 }}
                >
                  <option value="DESIGN">DESIGN</option>
                  <option value="MOLD">MOLD</option>
                  <option value="PLUG">PLUG</option>
                  <option value="CUTTER">CUTTER</option>
                  <option value="EQUIPMENT">EQUIPMENT</option>
                  <option value="GENERAL">GENERAL</option>
                  <option value="OFFICE">OFFICE</option>
                  <option value="SHIPPING">SHIPPING</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={savingNew}
                className="btn btn-primary"
                style={{ fontSize: 11, padding: '4px 10px', height: 30 }}
              >
                {savingNew ? '保存中...' : '登録'}
              </button>
            </form>
          )}
        </div>

        {/* Table of Codes */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 12px 18px' }}>
          {loading ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
              読み込み中...
            </div>
          ) : filteredCodes.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
              コードが見つかりません (Không tìm thấy mã phù hợp)
            </div>
          ) : (
            <table className="data-table" style={{ width: '100%', fontSize: 12, marginTop: 8 }}>
              <thead>
                <tr>
                  <th style={{ width: 50, textAlign: 'center' }}>ID</th>
                  <th>作業内容 (Tên công việc)</th>
                  <th style={{ width: 100 }}>部門</th>
                  <th style={{ width: 100 }}>カテゴリ</th>
                  <th style={{ width: 70, textAlign: 'center' }}>状態</th>
                  <th style={{ width: 60, textAlign: 'center' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredCodes.map(item => {
                  const isEditing = editingId === item.processing_code_id

                  return (
                    <tr key={item.processing_code_id} style={{ opacity: item.is_active ? 1 : 0.45 }}>
                      <td style={{ textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>
                        {item.processing_code_id}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="form-input"
                            style={{ fontSize: 12, height: 28 }}
                            autoFocus
                          />
                        ) : (
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {item.processing_name}
                          </span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <select
                            value={editDept}
                            onChange={e => setEditDept(e.target.value)}
                            className="form-input"
                            style={{ fontSize: 11, height: 28 }}
                          >
                            <option value="DESIGN">設計部</option>
                            <option value="MOLD_SHOP">金型工場</option>
                            <option value="PRODUCTION">生産部</option>
                            <option value="OFFICE">事務</option>
                            <option value="GENERAL">共通</option>
                          </select>
                        ) : (
                          <span style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            borderRadius: 3,
                            fontWeight: 700,
                            background: item.department_code === 'DESIGN'
                              ? 'var(--tint-teal-bg)'
                              : item.department_code === 'MOLD_SHOP'
                                ? 'var(--tint-blue-bg, #eff6ff)'
                                : 'var(--bg-surface-2)',
                            color: item.department_code === 'DESIGN'
                              ? 'var(--accent)'
                              : 'var(--text-secondary)'
                          }}>
                            {item.department_code || '—'}
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                          {item.category || '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          title={item.is_active ? '無効化 (Vô hiệu hóa)' : '有効化 (Kích hoạt)'}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: item.is_active ? 'var(--status-success, #16a34a)' : 'var(--text-muted)'
                          }}
                        >
                          {item.is_active ? <Power size={14} /> : <PowerOff size={14} />}
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(item.processing_code_id)}
                              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--accent)' }}
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(item.processing_code_id)
                              setEditName(item.processing_name)
                              setEditDept(item.department_code || 'MOLD_SHOP')
                            }}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
                            title="編集 (Sửa)"
                          >
                            <Edit2 size={13} />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 18px',
          borderTop: '1px solid var(--border-default)',
          background: 'var(--bg-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 11,
          color: 'var(--text-muted)'
        }}>
          <span>合計: {filteredCodes.length} コード</span>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: 11, padding: '3px 12px' }}
          >
            完了 (Đóng)
          </button>
        </div>
      </div>
    </div>
  )
}
