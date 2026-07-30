'use client'

import React from 'react'
import { AlertTriangle, Save, LogOut, X } from 'lucide-react'

interface UnsavedChangesModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveAndExit: () => void
  onDiscardAndExit: () => void
  title?: string
  message?: string
}

export function UnsavedChangesModal({
  isOpen,
  onClose,
  onSaveAndExit,
  onDiscardAndExit,
  title = 'Bạn có muốn thoát mà không lưu không? / 変更を保存せずに移動しますか？',
  message = 'Dữ liệu thông tin vừa nhập hoặc chỉnh sửa chưa được lưu. Nếu thoát ngay bây giờ, các thay đổi của bạn sẽ bị mất.'
}: UnsavedChangesModalProps) {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        padding: 16
      }}
    >
      <div
        className="card-flat"
        style={{
          width: '100%',
          maxWidth: 500,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 12,
          boxShadow: '0 25px 30px -5px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'color-mix(in srgb, var(--status-warning) 14%, transparent)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'color-mix(in srgb, var(--status-warning) 25%, transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <AlertTriangle size={18} style={{ color: 'var(--status-warning)' }} />
            </div>
            <div>
              <span className="badge badge--warning" style={{ fontSize: 9, marginBottom: 2 }}>
                CẢNH BÁO THOÁT TRANG / 離脱確認
              </span>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 20px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {message}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            padding: '12px 18px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-2)',
            flexWrap: 'wrap'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ height: 32, padding: '0 14px', fontSize: 12, fontWeight: 600 }}
          >
            Ở lại trang (Hủy)
          </button>

          <button
            type="button"
            onClick={onDiscardAndExit}
            className="btn btn-secondary"
            style={{
              height: 32,
              padding: '0 14px',
              fontSize: 12,
              borderColor: 'var(--status-error)',
              color: 'var(--status-error)',
              fontWeight: 600,
              gap: 4
            }}
          >
            <LogOut size={13} />
            <span>Thoát không lưu</span>
          </button>

          <button
            type="button"
            onClick={onSaveAndExit}
            className="btn btn-primary"
            style={{
              height: 32,
              padding: '0 16px',
              fontSize: 12,
              gap: 6,
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: 700
            }}
          >
            <Save size={14} />
            <span>Lưu & Thoát</span>
          </button>
        </div>
      </div>
    </div>
  )
}
